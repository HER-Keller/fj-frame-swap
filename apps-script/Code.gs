/**
 * FJ Frame Swap — Google Sheets + Drive backend.
 *
 * Setup (one time):
 *   1. Create a new Google Sheet (e.g. "FJ Frame Swap"). Extensions → Apps Script.
 *      Replace Code.gs with this file.
 *   2. Change PASSCODE below, then Save.
 *   3. Pick "setup" in the function dropdown and click Run (approve the permissions prompt).
 *      This creates the Steps, Photos, Frame and Settings tabs and a Drive folder for photos.
 *   4. Optional, for "Ask Claude about this photo": Project Settings (gear) → Script properties →
 *      Add property ANTHROPIC_API_KEY with your key from console.anthropic.com.
 *   5. Deploy → New deployment → type "Web app". Execute as: Me. Who has access: Anyone.
 *      Copy the Web app URL (ends in /exec) into config.js.
 *
 * After editing this script later, use Deploy → Manage deployments → Edit → New version
 * so the same URL picks up the change.
 */

const PASSCODE = 'CHANGE-ME';

// Leave empty when this script is attached to the sheet (Extensions → Apps Script).
const SHEET_ID = '';

const MODEL = 'claude-opus-5-5';
const ANTHROPIC_VERSION = '2026-10-21';

const TABS = {
  Steps: { cols: ['code', 'done', 'notes', 'bag', 'updated'], headers: ['Step', 'Done', 'Notes', 'Bag #', 'Updated'] },
  Photos: { cols: ['id', 'step', 'fileId', 'caption', 'taken', 'qa', 'public', 'updated'], headers: ['ID', 'Step', 'Drive file', 'Caption', 'Taken', 'Claude Q&A (JSON)', 'Link shared', 'Updated'] },
  Frame: { cols: ['key', 'value', 'updated'], headers: ['Key', 'Value (JSON)', 'Updated'] },
  Settings: { cols: ['key', 'value', 'updated'], headers: ['Key', 'Value', 'Updated'] },
};

function doGet(e) {
  return json_({ ok: true, service: 'fj-frame-swap' });
}

function doPost(e) {
  let req = {};
  try { req = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, error: 'bad_request' }); }
  if (PASSCODE === 'CHANGE-ME') return json_({ ok: false, error: 'passcode_not_set' });
  if (String(req.key || '') !== PASSCODE) return json_({ ok: false, error: 'bad_passcode' });
  try {
    switch (req.action) {
      case 'list':
        return json_({ ok: true, steps: readAll_('Steps'), photos: readAll_('Photos').map(photoOut_), frame: readAll_('Frame'), settings: readAll_('Settings'), askEnabled: !!apiKey_() });
      case 'step':
        return json_({ ok: true, step: withLock_(() => upsert_('Steps', 'code', stepIn_(req.step))) });
      case 'frame':
        return json_({ ok: true, frame: withLock_(() => upsert_('Frame', 'key', { key: req.k, value: JSON.stringify(req.value) })) });
      case 'setting':
        return json_({ ok: true, setting: withLock_(() => upsert_('Settings', 'key', { key: req.k, value: String(req.value) })) });
      case 'photo_add':
        return json_({ ok: true, photo: photoOut_(addPhoto_(req.photo)) });
      case 'photo_update':
        return json_({ ok: true, photo: photoOut_(withLock_(() => updatePhoto_(req.id, req.patch || {}))) });
      case 'photo_delete':
        withLock_(() => deletePhoto_(req.id));
        return json_({ ok: true });
      case 'photo_data':
        return json_({ ok: true, data: photoData_(req.id) });
      case 'ask':
        return json_({ ok: true, ...askClaude_(req) });
      default:
        return json_({ ok: false, error: 'unknown_action' });
    }
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message || err) });
  }
}

/* ---------- Rows ---------- */

function readAll_(tab) {
  const sh = sheet_(tab), cols = TABS[tab].cols;
  const last = sh.getLastRow();
  if (last < 2) return [];
  return sh.getRange(2, 1, last - 1, cols.length).getValues()
    .filter(r => r[0] !== '' && r[0] !== null)
    .map(r => { const o = {}; cols.forEach((c, i) => { o[c] = cell_(r[i]); }); return o; });
}

function findRow_(sh, val) {
  const last = sh.getLastRow();
  if (last < 2 || !val) return -1;
  const ids = sh.getRange(2, 1, last - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) if (String(ids[i][0]) === String(val)) return i + 2;
  return -1;
}

function readRow_(tab, id) {
  const sh = sheet_(tab), cols = TABS[tab].cols;
  const row = findRow_(sh, id);
  if (row < 0) return null;
  const r = sh.getRange(row, 1, 1, cols.length).getValues()[0];
  const o = {}; cols.forEach((c, i) => { o[c] = cell_(r[i]); });
  return o;
}

function upsert_(tab, keyCol, obj) {
  if (!obj || !obj[keyCol]) throw new Error(tab + ' row needs ' + keyCol);
  const sh = sheet_(tab), cols = TABS[tab].cols;
  obj.updated = new Date().toISOString();
  const row = findRow_(sh, obj[keyCol]);
  if (row > 0) {
    const cur = sh.getRange(row, 1, 1, cols.length).getValues()[0];
    const merged = cols.map((c, i) => (obj[c] === undefined ? cur[i] : obj[c]));
    sh.getRange(row, 1, 1, cols.length).setValues([merged]);
  } else {
    sh.appendRow(cols.map(c => (obj[c] === undefined ? '' : obj[c])));
  }
  return obj;
}

function stepIn_(s) {
  if (!s || !s.code) throw new Error('step needs code');
  return { code: String(s.code), done: s.done ? 'TRUE' : 'FALSE', notes: String(s.notes || ''), bag: String(s.bag || '') };
}

/* ---------- Photos (Drive) ---------- */

function folder_() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('PHOTO_FOLDER_ID');
  if (id) { try { return DriveApp.getFolderById(id); } catch (e) { /* recreate below */ } }
  const f = DriveApp.createFolder('FJ Frame Swap Photos');
  props.setProperty('PHOTO_FOLDER_ID', f.getId());
  return f;
}

function addPhoto_(p) {
  if (!p || !p.id || !p.data) throw new Error('photo needs id and data');
  const existing = readRow_('Photos', p.id);
  if (existing) return existing; // retried upload
  const mime = /^image\/(jpeg|png|webp|gif)$/.test(p.mime) ? p.mime : 'image/jpeg';
  const blob = Utilities.newBlob(Utilities.base64Decode(p.data), mime, (p.step || 'photo') + '-' + p.id + '.jpg');
  const file = folder_().createFile(blob);
  let shared = 'FALSE';
  try { file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); shared = 'TRUE'; } catch (e) { /* org policy may block link sharing */ }
  return withLock_(() => upsert_('Photos', 'id', {
    id: String(p.id), step: String(p.step || 'general'), fileId: file.getId(), caption: String(p.caption || ''),
    taken: String(p.taken || new Date().toISOString()), qa: '[]', public: shared,
  }));
}

function updatePhoto_(id, patch) {
  const cur = readRow_('Photos', id);
  if (!cur) throw new Error('not_found');
  const next = { id: String(id) };
  if (patch.caption !== undefined) next.caption = String(patch.caption);
  if (patch.step !== undefined) next.step = String(patch.step);
  upsert_('Photos', 'id', next);
  return readRow_('Photos', id);
}

function deletePhoto_(id) {
  const sh = sheet_('Photos');
  const row = findRow_(sh, id);
  if (row < 0) return;
  const cur = readRow_('Photos', id);
  try { DriveApp.getFileById(cur.fileId).setTrashed(true); } catch (e) { /* already gone */ }
  sh.deleteRow(row);
}

function photoData_(id) {
  const cur = readRow_('Photos', id);
  if (!cur) throw new Error('not_found');
  const blob = DriveApp.getFileById(cur.fileId).getBlob();
  return { mime: blob.getContentType(), b64: Utilities.base64Encode(blob.getBytes()) };
}

function photoOut_(p) {
  let qa = [];
  try { qa = JSON.parse(p.qa || '[]'); } catch (e) { qa = []; }
  return { id: p.id, step: p.step, fileId: p.fileId, caption: p.caption, taken: p.taken, qa, public: String(p.public).toUpperCase() === 'TRUE', updated: p.updated };
}

/* ---------- Ask Claude ---------- */

function apiKey_() {
  return PropertiesService.getScriptProperties().getProperty('ANTHROPIC_API_KEY') || '';
}

function askClaude_(req) {
  const key = apiKey_();
  if (!key) throw new Error('ask_not_configured');
  const cur = readRow_('Photos', req.id);
  if (!cur) throw new Error('not_found');
  const question = String(req.question || '').slice(0, 2000);
  const context = String(req.context || '').slice(0, 12000);
  if (!question.trim()) throw new Error('empty_question');
  const blob = DriveApp.getFileById(cur.fileId).getBlob();

  const prompt =
    'You\'re helping someone do a body-off frame swap on a 2007 Toyota FJ Cruiser in their own shop, using a 2-post lift and the Toyota factory repair manual. ' +
    'They took the attached photo while working on this step of their checklist:\n\n' + context +
    (cur.caption ? '\n\nTheir caption for the photo: ' + cur.caption : '') +
    '\n\nTheir question: ' + question +
    '\n\nLook closely at the photo and answer the question directly. Name the parts you can see. Point out anything that looks damaged, worn, corroded past reuse, missing, mis-routed, not fully seated, or unsafe. ' +
    'If the photo can\'t settle it, say what angle or close-up would. Only quote torque values that appear above; don\'t invent specs. Plain text, under 200 words.';

  const body = {
    model: MODEL,
    max_tokens: 16000,
    output_config: { effort: 'medium' },
    fallbacks: 'default',
    messages: [{
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: blob.getContentType() || 'image/jpeg', data: Utilities.base64Encode(blob.getBytes()) } },
        { type: 'text', text: prompt },
      ],
    }],
  };
  const res = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
    method: 'post',
    contentType: 'application/json',
    headers: { 'x-api-key': key, 'anthropic-version': ANTHROPIC_VERSION, 'anthropic-beta': 'server-side-fallback-2026-07-01' },
    payload: JSON.stringify(body),
    muteHttpExceptions: true,
  });
  const code = res.getResponseCode();
  let data = {};
  try { data = JSON.parse(res.getContentText()); } catch (e) { /* non-JSON error body */ }
  if (code === 429 || code === 529) throw new Error('claude_busy');
  if (code === 401 || code === 403) throw new Error('claude_key_rejected');
  if (code !== 200) throw new Error('claude_error_' + code + (data.error && data.error.message ? ': ' + data.error.message : ''));
  if (data.stop_reason === 'refusal') throw new Error('claude_declined');
  const text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n').trim();
  if (!text) throw new Error('claude_empty');

  const entry = { q: question, a: text, at: new Date().toISOString() };
  const photo = withLock_(() => {
    const p = readRow_('Photos', req.id);
    let qa = [];
    try { qa = JSON.parse(p.qa || '[]'); } catch (e) { qa = []; }
    qa = qa.concat([entry]).slice(-5);
    upsert_('Photos', 'id', { id: String(req.id), qa: JSON.stringify(qa) });
    return readRow_('Photos', req.id);
  });
  return { answer: text, truncated: data.stop_reason === 'max_tokens', photo: photoOut_(photo) };
}

/* ---------- Helpers ---------- */

function ss_() {
  return SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
}

function sheet_(name) {
  let sh = ss_().getSheetByName(name);
  if (!sh) { setup(); sh = ss_().getSheetByName(name); }
  if (!sh) throw new Error('Missing tab "' + name + '"');
  return sh;
}

function cell_(v) {
  if (v instanceof Date) return v.toISOString();
  if (v === true) return 'TRUE';
  if (v === false) return 'FALSE';
  return v === null || v === undefined ? '' : v;
}

function withLock_(fn) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try { return fn(); } finally { lock.releaseLock(); }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/* ---------- One-time setup ---------- */

function setup() {
  const ss = ss_();
  Object.keys(TABS).forEach((name, i) => {
    let sh = ss.getSheetByName(name);
    if (sh) return;
    sh = ss.insertSheet(name, i);
    sh.getRange(1, 1, 1, TABS[name].headers.length).setValues([TABS[name].headers]).setFontWeight('bold');
    sh.setFrozenRows(1);
    sh.getRange(1, 1, sh.getMaxRows(), TABS[name].cols.length).setNumberFormat('@');
  });
  folder_();

  // Progress carried over from the earlier claude.ai checklist page.
  const steps = ss.getSheetByName('Steps');
  if (steps.getLastRow() < 2) {
    const now = new Date().toISOString();
    steps.getRange(2, 1, 4, 5).setValues([
      ['p0-01', 'TRUE', '', '', now],
      ['p0-02', 'TRUE', '', '', now],
      ['p0-03', 'TRUE', '', '', now],
      ['p0-04', 'TRUE', 'Updated link for the body mounts: https://parts.woburntoyota.com/p/Toyota_2007_FJ-Cruiser-40L-V6-AT-4WD-Base-Sport-Utility/Body-Mount-Cushion-Upper/48814399/5220735050.html', '', now],
    ]);
  }
  // Remove the default empty tab if it's still there.
  const blank = ss.getSheetByName('Sheet1');
  if (blank && blank.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(blank);
  safeAlert_('Setup done: Steps, Photos, Frame and Settings tabs plus a "FJ Frame Swap Photos" Drive folder.');
}

function safeAlert_(msg) {
  try { SpreadsheetApp.getUi().alert(msg); } catch (e) { Logger.log(msg); }
}
