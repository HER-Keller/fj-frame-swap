(() => {
  'use strict';

  /* ---------- Config & constants ---------- */

  const APP_VERSION = '8';
  const API = (window.FJ_CONFIG && window.FJ_CONFIG.apiUrl || '').trim();
  const REMOTE = !!API;
  const KEY = { cache: 'fj.cache', outbox: 'fj.outbox', pass: 'fj.pass', hide: 'fj.hide', phase: 'fj.phase', view: 'fj.view' };
  const POLL_MS = 20000;
  const { PHASES, SPEC_GROUPS } = window.FJ_DATA;

  /* ---------- Storage ---------- */

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage full or blocked */ } },
  };

  // Photo bytes waiting to upload (and every photo in demo mode) live in IndexedDB.
  const idb = (() => {
    let dbp = null;
    const open = () => dbp || (dbp = new Promise((res, rej) => {
      const r = indexedDB.open('fj-photos', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('blobs');
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    }));
    const tx = async (mode, fn) => { const db = await open(); return new Promise((res, rej) => { const t = db.transaction('blobs', mode); const q = fn(t.objectStore('blobs')); t.oncomplete = () => res(q && q.result); t.onerror = () => rej(t.error); }); };
    return {
      put: (k, v) => tx('readwrite', s => s.put(v, k)),
      get: (k) => tx('readonly', s => s.get(k)),
      del: (k) => tx('readwrite', s => s.delete(k)),
    };
  })();

  const cached = store.get(KEY.cache, {});
  const state = {
    steps: cached.steps || {},          // code -> {done, notes, bag}
    photos: cached.photos || [],        // {id, step, fileId, caption, taken, qa[], public, pending}
    frame: cached.frame || { h: {}, rows: [] },
    trans: cached.trans || 'both',
    askEnabled: !!cached.askEnabled,
    guides: cached.guides || {},       // step code -> last uploaded (ISO), from the sheet's guide folder
    parts: cached.parts || [],          // {id, name, step, qty, status, partNo, price, link, photo, notes}
    partsServer: !!cached.partsServer,  // false until the sheet script has the Parts tab
    outbox: store.get(KEY.outbox, []),
    pass: store.get(KEY.pass, ''),
    phase: store.get(KEY.phase, 'p0'),
    view: 'checklist',
    rev: 0,
  };

  /* ---------- Utilities ---------- */

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const strip = h => String(h || '').replace(/<[^>]+>/g, '');
  const uid = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random()).replace(/-/g, '').slice(0, 12);
  const nowIso = () => new Date().toISOString();
  const vOK = v => !v || state.trans === 'both' || v === state.trans;

  const ALL = []; const BY = {};
  PHASES.forEach((ph, pi) => ph.steps.forEach((s, si) => {
    // s.c is the permanent id (saved progress, notes, photos and guides use it); s.code is the shown position.
    s.code = `P${pi}-${String(si + 1).padStart(2, '0')}`; s.c = s.id || s.code.toLowerCase(); s.phase = ph.id; s.pi = pi;
    ALL.push(s); BY[s.c] = s;
  }));
  BY.general = { c: 'general', code: 'GEN', t: 'General / unfiled', phase: 'general', specs: [] };
  const St = c => state.steps[c] || { done: false, notes: '', bag: '' };

  let toastTimer;
  function toast(msg, action) {
    const t = $('#toast');
    t.textContent = msg;
    if (action) { const b = document.createElement('button'); b.textContent = action.label; b.onclick = () => { t.classList.remove('show'); action.fn(); }; t.appendChild(b); }
    t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), action ? 6000 : 3000);
  }

  function persist() {
    store.set(KEY.cache, { steps: state.steps, photos: state.photos.map(p => ({ ...p })), frame: state.frame, trans: state.trans, askEnabled: state.askEnabled, guides: state.guides, parts: state.parts, partsServer: state.partsServer });
    store.set(KEY.outbox, state.outbox);
  }

  function commit(op) {
    state.rev++;
    if (REMOTE) state.outbox.push(op);
    persist();
    if (REMOTE) flush();
  }

  /* ---------- Sync with Apps Script ---------- */

  let flushing = false, retryTimer = null, inflight = null;
  const partOp = o => o.action === 'part' || o.action === 'part_delete';
  const sendable = o => !partOp(o) || state.partsServer;
  const dropOp = o => { const i = state.outbox.indexOf(o); if (i >= 0) state.outbox.splice(i, 1); };
  function setSync(s, text) { $('#syncBtn').dataset.state = s; $('#syncText').textContent = text; }

  async function api(body) {
    const res = await fetch(API, {
      method: 'POST',
      // text/plain keeps this a "simple" request so Apps Script doesn't need a CORS preflight.
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ ...body, key: state.pass }),
      redirect: 'follow',
    });
    if (!res.ok) throw Object.assign(new Error('HTTP ' + res.status), { network: true });
    const data = await res.json();
    if (!data.ok) throw Object.assign(new Error(data.error || 'error'), { code: data.error });
    return data;
  }

  function handleSyncError(err, { duringList = false, op = null } = {}) {
    if (err.code === 'bad_passcode' || err.code === 'passcode_not_set') {
      setSync('error', 'Locked');
      askPasscode(err.code === 'passcode_not_set' ? 'The sheet script still has the default passcode. Set PASSCODE in Code.gs and deploy a new version.' : 'That passcode didn’t work.');
      return;
    }
    if (err.code && duringList) { setSync('error', 'Sheet error'); toast('Couldn’t load from the sheet: ' + err.code); return; }
    if (err.code === 'unknown_action' && op && partOp(op)) { // sheet script predates the parts list: keep parts on the phone
      state.partsServer = false; persist();
      toast('Parts are saved on this phone. Update the sheet script to sync them.');
      return 'continue';
    }
    if (err.code) { // the server rejected this one op; drop it so the queue can't jam
      console.warn('Sync op rejected:', err.code, op);
      dropOp(op); persist();
      toast('A change couldn’t be saved: ' + err.code);
      return 'continue';
    }
    setSync('offline', state.outbox.length ? `Offline · ${state.outbox.length} waiting` : 'Offline');
    clearTimeout(retryTimer); retryTimer = setTimeout(flush, 10000);
  }

  async function blobToB64(blob) {
    return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(',')[1]); r.onerror = () => rej(r.error); r.readAsDataURL(blob); });
  }

  async function sendOp(op) {
    if (op.action !== 'photo_add') return api(op);
    const blob = await idb.get(op.photo.id);
    if (!blob) return { ok: true }; // deleted before it uploaded
    const data = await api({ action: 'photo_add', photo: { ...op.photo, mime: blob.type || 'image/jpeg', data: await blobToB64(blob) } });
    const i = state.photos.findIndex(p => p.id === op.photo.id);
    if (i >= 0) {
      const local = state.photos[i];
      state.photos[i] = { ...data.photo, caption: local.caption, step: local.step, qa: local.qa && local.qa.length ? local.qa : data.photo.qa };
    }
    idb.del(op.photo.id).catch(() => {});
    return data;
  }

  async function flush() {
    if (!REMOTE || flushing || !state.pass) return;
    flushing = true;
    setSync('busy', state.outbox.some(o => o.action === 'photo_add') ? 'Uploading…' : 'Saving…');
    try {
      let op;
      while ((op = state.outbox.find(sendable))) {
        inflight = op;
        try { await sendOp(op); dropOp(op); persist(); renderPhotosEverywhere(); }
        catch (err) { if (handleSyncError(err, { op }) !== 'continue') return; }
        finally { inflight = null; }
      }
    } finally { flushing = false; }
    refresh();
  }

  async function refresh() {
    if (!REMOTE) return;
    if (!state.pass) { askPasscode(); return; }
    if (state.outbox.some(sendable)) { flush(); return; }
    const rev = state.rev;
    setSync('busy', 'Syncing…');
    try {
      const data = await api({ action: 'list' });
      if (rev !== state.rev || state.outbox.some(sendable)) return; // local edits mid-flight; next poll catches up
      const steps = {};
      (data.steps || []).forEach(r => { steps[r.code] = { done: String(r.done).toUpperCase() === 'TRUE', notes: r.notes || '', bag: r.bag || '' }; });
      state.steps = steps;
      state.photos = data.photos || [];
      const frame = { h: {}, rows: [] };
      (data.frame || []).forEach(r => { try { frame[r.key] = JSON.parse(r.value); } catch { /* skip bad row */ } });
      state.frame = { h: frame.h || {}, rows: Array.isArray(frame.rows) ? frame.rows : [] };
      const trans = (data.settings || []).find(r => r.key === 'trans');
      if (trans && ['both', 'at', 'mt'].includes(trans.value)) state.trans = trans.value;
      state.askEnabled = !!data.askEnabled;
      if (data.guides) state.guides = data.guides;
      const held = state.outbox.length > 0; // only part ops wait here
      state.partsServer = Array.isArray(data.parts);
      if (state.partsServer && !held) state.parts = data.parts.map(normPart);
      persist();
      renderAll();
      if (held && state.partsServer) { flush(); return; }
      setSync('ok', held ? 'Synced · parts on phone' : 'Synced');
    } catch (err) { handleSyncError(err, { duringList: true }); }
  }

  function askPasscode(msg) {
    $('#passErr').hidden = !msg; $('#passErr').textContent = msg || '';
    if (!$('#passDlg').open) $('#passDlg').showModal();
  }
  $('#passForm').addEventListener('submit', e => {
    e.preventDefault();
    state.pass = $('#passForm').pass.value.trim();
    store.set(KEY.pass, state.pass);
    $('#passDlg').close(); $('#passForm').reset();
    refresh();
  });

  /* ---------- Step edits ---------- */

  function saveStep(c, patch) {
    state.steps[c] = { ...St(c), ...patch };
    const s = state.steps[c];
    // Collapse queued edits to the same step into one.
    state.outbox = state.outbox.filter(o => !(o.action === 'step' && o.step.code === c && o !== inflight));
    commit({ action: 'step', step: { code: c, done: !!s.done, notes: s.notes || '', bag: s.bag || '' } });
  }

  /* ---------- Rendering: checklist ---------- */

  function specTable(rows) {
    return `<div class="tbl-wrap"><table class="spec"><thead><tr><th>Fastener</th><th>N·m</th><th>Imperial</th><th>Note</th></tr></thead><tbody>${
      rows.filter(r => vOK(r.v)).map(r => `<tr><td>${esc(r.f)}</td><td class="num">${esc(r.nm)}</td><td class="num">${esc(r.imp)}</td><td class="note">${esc(r.note)}</td></tr>`).join('')
    }</tbody></table></div>`;
  }

  function renderProgress() {
    const vis = ALL.filter(s => vOK(s.v));
    const done = vis.filter(s => St(s.c).done).length;
    const pct = vis.length ? Math.round(done / vis.length * 100) : 0;
    $('#pct').textContent = pct + '%';
    $('#barfill').style.width = pct + '%';
    const chips = $('#phaseChips'), keepLeft = chips.scrollLeft; chips.textContent = '';
    PHASES.forEach((ph, pi) => {
      const list = vis.filter(s => s.phase === ph.id), d = list.filter(s => St(s.c).done).length;
      const b = document.createElement('button');
      b.type = 'button'; b.setAttribute('role', 'tab');
      b.setAttribute('aria-pressed', ph.id === state.phase);
      b.classList.toggle('full', list.length > 0 && d === list.length);
      b.innerHTML = `P${pi} ${esc(ph.name.split(/[ ,]/)[0])}<b>${d}/${list.length}</b>`;
      b.onclick = () => { state.phase = ph.id; store.set(KEY.phase, ph.id); renderChecklist(); window.scrollTo(0, 0); };
      chips.appendChild(b);
    });
    // Scroll only the chip strip sideways, and only when the phase changes. (scrollIntoView
    // here used to drag the whole page back to the top after every sync.)
    const cur = chips.querySelector('[aria-pressed="true"]');
    if (cur && chipsPhase !== state.phase) {
      chips.scrollLeft += cur.getBoundingClientRect().left - chips.getBoundingClientRect().left - (chips.clientWidth - cur.offsetWidth) / 2;
      chipsPhase = state.phase;
    } else chips.scrollLeft = keepLeft;
  }
  let chipsPhase = null;

  const openSteps = new Set();
  let renderedPhase = null, renderedTrans = null;

  function renderChecklist() {
    renderProgress();
    const ph = PHASES.find(p => p.id === state.phase) || PHASES[0];
    const pi = PHASES.indexOf(ph);
    const list = ph.steps.filter(s => vOK(s.v));
    const d = list.filter(s => St(s.c).done).length;
    const body = $('#phaseBody');
    // A background sync must not close open steps or pull focus out of a notes field:
    // when the same phase is already on screen, update the rows in place.
    if (renderedPhase === ph.id && renderedTrans === state.trans && body.querySelector('ol.steps')) {
      body.querySelector('.phase-head .n').textContent = `${d}/${list.length} done`;
      list.forEach(s => updateStepRow(s));
      return;
    }
    renderedPhase = ph.id; renderedTrans = state.trans;
    body.innerHTML = `<div class="phase-head"><h2>P${pi} · ${esc(ph.name)}</h2><span class="n">${d}/${list.length} done</span></div><p class="blurb">${ph.blurb}</p><ol class="steps"></ol>`;
    const ol = body.querySelector('ol');
    list.forEach(s => {
      const li = stepEl(s); ol.appendChild(li);
      if (openSteps.has(s.c)) { li.querySelector('.toggle').setAttribute('aria-expanded', 'true'); li.querySelector('.sbody').hidden = false; fillBody(li); }
    });
    if (!list.length) ol.innerHTML = '<li class="empty">No steps in this phase for your transmission.</li>';
  }

  function stepMeta(c) {
    const n = photosFor(c).length, st = St(c);
    const np = partsFor(c).filter(p => p.status !== 'have').length;
    return [n ? `${n} photo${n > 1 ? 's' : ''}` : '', np ? `${np} part${np > 1 ? 's' : ''} to buy` : '', st.bag ? `bag ${st.bag}` : '', st.notes ? 'notes' : ''].filter(Boolean).join(' · ');
  }

  function updateStepRow(s) {
    const li = document.getElementById(s.c); if (!li) return;
    const st = St(s.c);
    li.classList.toggle('done', !!st.done);
    li.querySelector('.srow input[type=checkbox]').checked = !!st.done;
    li.querySelector('.meta').textContent = stepMeta(s.c);
    li.querySelectorAll('[data-f]').forEach(f => { if (document.activeElement !== f && !typeTimers[s.c]) f.value = st[f.dataset.f] || ''; });
    if (li.querySelector('[data-ph]')) renderStepPhotos(li);
    renderStepParts(li);
  }

  function stepEl(s) {
    const c = s.c, st = St(c);
    const li = document.createElement('li');
    li.className = 'step' + (st.done ? ' done' : ''); li.id = c; li.dataset.c = c;
    li.innerHTML = `
      <div class="srow">
        <input type="checkbox" ${st.done ? 'checked' : ''} aria-label="Done: ${esc(s.t)}">
        <button type="button" class="toggle" aria-expanded="false">
          <span class="code">${s.code}</span>
          <span class="ttl">${esc(s.t)}${s.v ? `<span class="vtag">${s.v === 'at' ? 'A/T' : 'M/T'}</span>` : ''}</span>
          <span class="meta">${esc(stepMeta(c))}</span>
        </button>
      </div>
      <div class="sbody" hidden></div>`;
    return li;
  }

  function fillBody(li) {
    const s = BY[li.dataset.c], c = s.c, st = St(c);
    const body = li.querySelector('.sbody');
    const tag = s.list && s.d && /:$/.test(strip(s.d)) && s.list.length > 2 ? 'ol' : 'ul';
    body.innerHTML = `
      <button type="button" class="primary block" data-guide><span aria-hidden="true">📘</span> Illustrated guide</button>
      ${s.d ? `<p>${s.d}</p>` : ''}
      ${s.list ? `<${tag} class="sub">${s.list.map(x => `<li>${esc(x)}</li>`).join('')}</${tag}>` : ''}
      ${s.after ? `<p>${s.after}</p>` : ''}
      ${s.warn ? `<div class="warn"><b>Caution.</b> ${s.warn}</div>` : ''}
      ${s.specs && s.specs.length ? `<div><div class="lbl">Torque and specs</div>${specTable(s.specs)}</div>` : ''}
      ${s.tools && s.tools.length ? `<div><div class="lbl">Tools</div><div class="chips">${s.tools.map(t => `<span class="chip">${esc(t)}</span>`).join('')}</div></div>` : ''}
      ${s.man && s.man.length ? `<div><div class="lbl">In your manuals</div><div class="man">${s.man.map(m => `<span>${esc(m)}</span>`).join('')}</div></div>` : ''}
      ${s.refs && s.refs.length ? `<div><div class="lbl">Online</div><div class="refs">${s.refs.map(r => `<a href="${r[1]}" target="_blank" rel="noopener">${esc(r[0])} ↗</a>`).join('')}</div></div>` : ''}
      <div class="fields">
        <label>Bag / tag #<input type="text" data-f="bag" value="${esc(st.bag)}" placeholder="${s.code}-A" autocomplete="off"></label>
        <label>Notes and torque log<textarea data-f="notes" rows="2" placeholder="What you found, torque applied, date">${esc(st.notes)}</textarea></label>
      </div>
      <div><div class="lbl">Photos</div><div class="photos" data-ph></div><div class="err" data-err hidden></div></div>
      <div><div class="lbl">Parts to buy</div><ul class="plist" data-parts></ul><button type="button" class="block" data-addpart>＋ Add a part for this step</button></div>`;
    renderStepPhotos(li);
    renderStepParts(li);
  }

  function renderStepPhotos(li) {
    const box = li.querySelector('[data-ph]'); if (!box) return;
    const c = li.dataset.c; box.textContent = '';
    const list = photosFor(c);
    list.forEach((p, i) => box.appendChild(thumb(p, () => openViewer(list.map(x => x.id), i))));
    const cam = document.createElement('label'); cam.className = 'btn add';
    cam.innerHTML = `<span aria-hidden="true" style="font-size:20px">📷</span>Take photo<input type="file" accept="image/*" capture="environment">`;
    cam.querySelector('input').onchange = e => addPhotos(c, e.target, li.querySelector('[data-err]'));
    const lib = document.createElement('label'); lib.className = 'btn add';
    lib.innerHTML = `<span aria-hidden="true" style="font-size:20px">＋</span>Library<input type="file" accept="image/*" multiple>`;
    lib.querySelector('input').onchange = e => addPhotos(c, e.target, li.querySelector('[data-err]'));
    box.append(cam, lib);
  }

  $('#phaseBody').addEventListener('click', e => {
    const gb = e.target.closest('[data-guide]');
    if (gb) { openGuide(gb.closest('li.step').dataset.c); return; }
    const ap = e.target.closest('[data-addpart]');
    if (ap) { openPart({ step: ap.closest('li.step').dataset.c }); return; }
    const t = e.target.closest('.toggle'); if (!t) return;
    const li = t.closest('li.step'), body = li.querySelector('.sbody');
    const open = t.getAttribute('aria-expanded') !== 'true';
    t.setAttribute('aria-expanded', open); body.hidden = !open;
    if (open) openSteps.add(li.dataset.c); else openSteps.delete(li.dataset.c);
    if (open && !body.childElementCount) fillBody(li);
  });
  $('#phaseBody').addEventListener('change', e => {
    if (e.target.type !== 'checkbox') return;
    const li = e.target.closest('li.step'), c = li.dataset.c;
    saveStep(c, { done: e.target.checked });
    li.classList.toggle('done', e.target.checked);
    renderProgress();
    const ph = PHASES.find(p => p.id === state.phase), list = ph.steps.filter(s => vOK(s.v));
    $('#phaseBody .phase-head .n').textContent = `${list.filter(s => St(s.c).done).length}/${list.length} done`;
  });
  const typeTimers = {};
  $('#phaseBody').addEventListener('input', e => {
    const f = e.target.dataset.f; if (!f) return;
    const li = e.target.closest('li.step'), c = li.dataset.c, val = f === 'bag' ? e.target.value.trim() : e.target.value;
    clearTimeout(typeTimers[c]);
    typeTimers[c] = setTimeout(() => { typeTimers[c] = null; saveStep(c, { [f]: val }); }, 800);
  });

  /* ---------- Photos ---------- */

  const urlCache = new Map();
  function photosFor(c) { return state.photos.filter(p => p.step === c).sort((a, b) => String(a.taken).localeCompare(String(b.taken))); }

  async function photoUrl(p, size) {
    if (p.pending || !REMOTE) {
      if (urlCache.has(p.id)) return urlCache.get(p.id);
      const blob = await idb.get(p.id).catch(() => null);
      if (!blob) return '';
      const u = URL.createObjectURL(blob); urlCache.set(p.id, u); return u;
    }
    if (p.public && p.fileId) return `https://drive.google.com/thumbnail?id=${encodeURIComponent(p.fileId)}&sz=w${size}`;
    if (urlCache.has(p.id)) return urlCache.get(p.id);
    try {
      const { data } = await api({ action: 'photo_data', id: p.id });
      const bin = Uint8Array.from(atob(data.b64), ch => ch.charCodeAt(0));
      const u = URL.createObjectURL(new Blob([bin], { type: data.mime })); urlCache.set(p.id, u); return u;
    } catch { return ''; }
  }

  function setImg(img, p, size) {
    photoUrl(p, size).then(u => { if (u) img.src = u; else img.alt = 'Not loaded'; });
  }

  function thumb(p, onclick) {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'th';
    b.setAttribute('aria-label', 'Open photo' + (p.caption ? ': ' + p.caption : ''));
    const img = document.createElement('img'); img.alt = ''; img.loading = 'lazy'; setImg(img, p, 240);
    b.appendChild(img);
    if (p.pending) b.insertAdjacentHTML('beforeend', '<span class="badge wait">Waiting</span>');
    else if (p.qa && p.qa.length) b.insertAdjacentHTML('beforeend', '<span class="badge">Claude</span>');
    b.onclick = onclick;
    return b;
  }

  async function shrink(file) {
    try {
      const bmp = await createImageBitmap(file);
      const k = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
      const cv = document.createElement('canvas');
      cv.width = Math.round(bmp.width * k); cv.height = Math.round(bmp.height * k);
      cv.getContext('2d').drawImage(bmp, 0, 0, cv.width, cv.height);
      const blob = await new Promise(r => cv.toBlob(r, 'image/jpeg', 0.82));
      if (blob) return blob;
    } catch { /* fall through to the original file */ }
    return file;
  }

  async function addPhotos(c, input, errEl) {
    const files = [...(input.files || [])]; input.value = '';
    if (errEl) errEl.hidden = true;
    for (const f of files) {
      try {
        const blob = await shrink(f);
        const id = uid();
        await idb.put(id, blob);
        const p = { id, step: c, fileId: '', caption: '', taken: nowIso(), qa: [], public: false, pending: REMOTE };
        state.photos.push(p);
        if (REMOTE) commit({ action: 'photo_add', photo: { id, step: c, caption: '', taken: p.taken } }); else persist();
      } catch (e) {
        if (errEl) { errEl.textContent = 'That photo couldn’t be saved on this phone. Try again.'; errEl.hidden = false; }
      }
    }
    renderPhotosEverywhere();
    if (files.length) toast(files.length === 1 ? 'Photo added' : `${files.length} photos added`);
  }

  function renderPhotosEverywhere() {
    $$('#phaseBody li.step').forEach(li => {
      li.querySelector('.meta').textContent = stepMeta(li.dataset.c);
      if (li.querySelector('[data-ph]')) renderStepPhotos(li);
    });
    if (state.view === 'photos') renderGallery();
  }

  // Bench (Photos tab)
  let filter = 'all';
  function stepOptions() {
    return `<option value="general">General / unfiled</option>` + PHASES.map((ph, pi) => `<optgroup label="P${pi} · ${esc(ph.name)}">${ph.steps.filter(s => vOK(s.v)).map(s => `<option value="${s.c}">${s.code} ${esc(s.t)}</option>`).join('')}</optgroup>`).join('');
  }
  function renderGallery(keepScroll = true) {
    const y = window.scrollY;
    if (keepScroll) requestAnimationFrame(() => { if (Math.abs(window.scrollY - y) > 1 && state.view === 'photos') window.scrollTo(0, y); });
    const sel = $('#benchStep'), keep = sel.value;
    sel.innerHTML = stepOptions(); if (keep) sel.value = keep;
    const f = $('#filters'); f.textContent = '';
    [['all', 'All'], ['asked', 'Asked Claude'], ['general', 'Unfiled'], ...PHASES.map((ph, pi) => [ph.id, `P${pi}`])].forEach(([k, l]) => {
      const b = document.createElement('button'); b.type = 'button'; b.textContent = l; b.setAttribute('aria-pressed', filter === k);
      b.onclick = () => { filter = k; renderGallery(); }; f.appendChild(b);
    });
    const list = [...state.photos].sort((a, b) => String(b.taken).localeCompare(String(a.taken)))
      .filter(p => filter === 'all' || (filter === 'asked' ? (p.qa || []).length : filter === 'general' ? p.step === 'general' : (BY[p.step] || {}).phase === filter));
    const g = $('#gallery'); g.textContent = '';
    if (!list.length) { g.innerHTML = `<div class="empty" style="grid-column:1/-1">${state.photos.length ? 'No photos match this filter.' : 'No photos yet. Take one above, or from inside any step.'}</div>`; return; }
    const ids = list.map(p => p.id);
    list.forEach((p, i) => {
      const s = BY[p.step] || BY.general;
      const b = document.createElement('button'); b.type = 'button'; b.className = 'gcard';
      b.innerHTML = `<div class="img"><img alt="" loading="lazy">${p.pending ? '<span class="badge wait">Waiting</span>' : ''}</div><div class="cap"><span><span class="code">${esc(s.code)}</span> ${esc(p.caption || s.t)}</span><span class="muted">${p.taken ? new Date(p.taken).toLocaleDateString() : ''}${(p.qa || []).length ? ' · Claude answered' : ''}</span></div>`;
      setImg(b.querySelector('img'), p, 480);
      b.onclick = () => openViewer(ids, i);
      g.appendChild(b);
    });
  }
  $('#benchCam').onchange = e => addPhotos($('#benchStep').value, e.target, $('#benchErr'));
  $('#benchLib').onchange = e => addPhotos($('#benchStep').value, e.target, $('#benchErr'));

  /* ---------- Parts to buy ---------- */

  const PST = { need: 'Need', ordered: 'Ordered', have: 'Have' };
  const PNEXT = { need: 'ordered', ordered: 'have', have: 'need' };
  const money = n => '$' + (Math.round(n * 100) / 100).toFixed(2).replace(/\.00$/, '');
  function normPart(p) {
    const price = p.price === '' || p.price == null || isNaN(Number(p.price)) ? '' : Number(p.price);
    return { id: String(p.id), name: String(p.name || ''), step: String(p.step || '') || 'general', qty: Math.max(1, Math.round(Number(p.qty)) || 1), status: PST[p.status] ? p.status : 'need', partNo: String(p.partNo ?? ''), price, link: String(p.link || ''), photo: String(p.photo || ''), notes: String(p.notes || ''), updated: p.updated || '' };
  }
  function partsFor(c) { return state.parts.filter(p => p.step === c); }
  const stepIdx = c => { const i = ALL.findIndex(s => s.c === c); return i < 0 ? 1e4 : i; };
  const sortParts = list => list.sort((a, b) => stepIdx(a.step) - stepIdx(b.step) || a.name.localeCompare(b.name));

  function savePart(p) {
    p = normPart({ ...p, updated: nowIso() });
    const i = state.parts.findIndex(x => x.id === p.id);
    if (i >= 0) state.parts[i] = p; else state.parts.push(p);
    state.outbox = state.outbox.filter(o => !(o.action === 'part' && o.part.id === p.id && o !== inflight));
    commit({ action: 'part', part: p });
    renderPartsEverywhere();
  }
  function deletePart(id) {
    state.parts = state.parts.filter(p => p.id !== id);
    state.outbox = state.outbox.filter(o => !(o.action === 'part' && o.part.id === id && o !== inflight));
    commit({ action: 'part_delete', id });
    renderPartsEverywhere();
  }

  function partRow(p, { showStep = true } = {}) {
    const s = BY[p.step] || BY.general;
    const meta = [showStep ? `<span class="code">${esc(s.code)}</span>` : '', p.partNo ? `<span class="mono">${esc(p.partNo)}</span>` : '', p.price !== '' ? money(p.price) + (p.qty > 1 ? ' ea' : '') : '', p.photo ? 'photo' : '', p.notes ? 'notes' : ''].filter(Boolean).join(' · ');
    return `<li class="part" data-id="${esc(p.id)}">
      <button type="button" class="pill s-${p.status}" data-cycle aria-label="${PST[p.status]}. Tap to mark ${PST[PNEXT[p.status]]}">${PST[p.status]}</button>
      <button type="button" class="pbody" data-edit><span class="pname">${p.qty > 1 ? `<b class="mono">${p.qty}×</b> ` : ''}${esc(p.name)}</span>${meta ? `<span class="pmeta">${meta}</span>` : ''}</button>
      ${p.link ? `<a class="plink" href="${esc(p.link)}" target="_blank" rel="noopener">Buy ↗</a>` : ''}
    </li>`;
  }

  function renderStepParts(li) {
    const ul = li.querySelector('[data-parts]'); if (!ul) return;
    const order = { need: 0, ordered: 1, have: 2 };
    ul.innerHTML = sortParts(partsFor(li.dataset.c)).sort((a, b) => order[a.status] - order[b.status]).map(p => partRow(p, { showStep: false })).join('');
  }

  let partFilter = 'open';
  function renderParts() {
    const n = { need: 0, ordered: 0, have: 0 }; let left = 0, unpriced = 0;
    state.parts.forEach(p => { n[p.status]++; if (p.status !== 'have') { if (p.price !== '') left += p.price * p.qty; else unpriced++; } });
    $('#partSum').innerHTML = `<div><b>${n.need}</b>Need</div><div><b>${n.ordered}</b>Ordered</div><div><b>${n.have}</b>Have</div><div><b>${money(left)}</b>Left to buy${unpriced ? `<i>${unpriced} not priced</i>` : ''}</div>`;
    const f = $('#partFilters'); f.textContent = '';
    [['open', 'To buy'], ['need', 'Need'], ['ordered', 'Ordered'], ['have', 'Have'], ['all', 'All']].forEach(([k, l]) => {
      const b = document.createElement('button'); b.type = 'button'; b.textContent = l; b.setAttribute('aria-pressed', partFilter === k);
      b.onclick = () => { partFilter = k; renderParts(); }; f.appendChild(b);
    });
    const box = $('#partList');
    if (!state.parts.length) {
      const p5 = BY['p0-05'];
      box.innerHTML = `<div class="empty">No parts on the list yet. Add one here, from inside any step, or from a photo of the rusted part.${p5 ? `<div style="margin-top:12px"><button type="button" id="partStarter">Add the single-use parts from ${esc(p5.code)}</button></div>` : ''}</div>`;
      const st = $('#partStarter'); if (st) st.onclick = addStarterParts;
      return;
    }
    const groups = partFilter === 'all' ? ['need', 'ordered', 'have'] : partFilter === 'open' ? ['need', 'ordered'] : [partFilter];
    const html = groups.map(g => {
      const list = sortParts(state.parts.filter(p => p.status === g));
      return list.length ? `<h3 class="pgroup">${PST[g]} <span class="mono">${list.length}</span></h3><ul class="plist">${list.map(p => partRow(p)).join('')}</ul>` : '';
    }).join('');
    box.innerHTML = html || `<div class="empty">${partFilter === 'open' ? 'Everything on the list is in hand.' : 'Nothing here.'}</div>`;
  }

  function renderPartsBadge() {
    const n = state.parts.filter(p => p.status === 'need').length, b = $('#partsBadge');
    b.textContent = n; b.hidden = !n;
  }
  function renderPartsEverywhere() {
    renderPartsBadge();
    $$('#phaseBody li.step').forEach(li => { li.querySelector('.meta').textContent = stepMeta(li.dataset.c); renderStepParts(li); });
    if (state.view === 'parts') renderParts();
  }

  function addStarterParts() {
    const s = BY['p0-05']; if (!s) return;
    (s.list || []).forEach(line => {
      if (/^Fluids:/i.test(line)) return; // fluids are shopping, not parts; keep them in the step
      if (state.trans === 'mt' && /\(A\/T\)/.test(line)) return;
      const m = line.match(/^(\d+)\s+(.*)$/);
      const name = (m ? m[2] : line).replace(/^./, ch => ch.toUpperCase());
      savePart({ id: uid(), name, qty: m ? Number(m[1]) : 1, step: s.c, status: 'need' });
    });
    toast('Added the single-use parts');
  }

  // Add / edit sheet
  const partDlg = $('#partDlg'), partForm = $('#partForm');
  let editing = null;
  function openPart(p) {
    editing = p && p.id ? state.parts.find(x => x.id === p.id) || null : null;
    const v = editing || normPart({ id: '', status: 'need', qty: 1, ...p });
    $('#partH').textContent = editing ? 'Edit part' : 'Add a part';
    partForm.step.innerHTML = stepOptions(); partForm.step.value = BY[v.step] ? v.step : 'general';
    ['name', 'partNo', 'link', 'notes'].forEach(k => { partForm[k].value = v[k] || ''; });
    partForm.qty.value = v.qty || 1; partForm.price.value = v.price === '' ? '' : v.price;
    partForm.dataset.status = v.status; partForm.dataset.photo = v.photo || '';
    $$('#partStatus button').forEach(b => b.setAttribute('aria-pressed', b.dataset.st === v.status));
    const ph = state.photos.find(x => x.id === v.photo), box = $('#partPhoto');
    box.hidden = !ph; if (ph) { const img = box.querySelector('img'); img.removeAttribute('src'); setImg(img, ph, 240); }
    const del = $('#partDel'); del.hidden = !editing; del.classList.remove('confirm'); del.textContent = 'Delete';
    $('#partErr').hidden = true;
    partDlg.showModal();
    if (!editing && !v.name) partForm.name.focus();
  }
  $$('#partStatus button').forEach(b => b.onclick = () => { partForm.dataset.status = b.dataset.st; $$('#partStatus button').forEach(x => x.setAttribute('aria-pressed', x === b)); });
  partForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = partForm.name.value.trim();
    if (!name) { $('#partErr').textContent = 'Give the part a name.'; $('#partErr').hidden = false; partForm.name.focus(); return; }
    let link = partForm.link.value.trim();
    if (link && !/^https?:\/\//i.test(link)) link = 'https://' + link;
    savePart({ id: editing ? editing.id : uid(), name, qty: partForm.qty.value, status: partForm.dataset.status, step: partForm.step.value, partNo: partForm.partNo.value.trim(), price: partForm.price.value === '' ? '' : partForm.price.value, link, photo: partForm.dataset.photo, notes: partForm.notes.value });
    partDlg.close();
    toast(editing ? 'Part saved' : 'Added to the parts list');
  });
  $('#partCancel').onclick = () => partDlg.close();
  $('#partDel').onclick = () => {
    const b = $('#partDel'); if (!editing) return;
    if (!b.classList.contains('confirm')) { b.classList.add('confirm'); b.textContent = 'Tap again to delete'; return; }
    deletePart(editing.id); partDlg.close(); toast('Part removed');
  };
  $('#partAdd').onclick = () => openPart({});

  // Rows anywhere (Parts tab or inside a step): tap the pill to move it along, the row to edit.
  document.addEventListener('click', e => {
    const row = e.target.closest('li.part'); if (!row) return;
    const p = state.parts.find(x => x.id === row.dataset.id); if (!p) return;
    if (e.target.closest('[data-cycle]')) { savePart({ ...p, status: PNEXT[p.status] }); toast(`${p.name}: ${PST[PNEXT[p.status]]}`); }
    else if (e.target.closest('[data-edit]')) openPart(p);
  });

  $('#partCopy').onclick = async () => {
    const open = state.parts.filter(p => p.status !== 'have');
    if (!open.length) { toast('Nothing left to buy'); return; }
    const line = p => `- ${p.qty > 1 ? p.qty + '× ' : ''}${p.name}${p.partNo ? ' · #' + p.partNo : ''}${p.price !== '' ? ' · ' + money(p.price) + (p.qty > 1 ? ' ea' : '') : ''} (${(BY[p.step] || BY.general).code})${p.link ? '\n  ' + p.link : ''}`;
    let left = 0; open.forEach(p => { if (p.price !== '') left += p.price * p.qty; });
    const text = ['FJ frame swap: parts to buy', ...['need', 'ordered'].flatMap(g => { const l = sortParts(open.filter(p => p.status === g)); return l.length ? ['', PST[g] + ':', ...l.map(line)] : []; }), '', 'Left to buy: ' + money(left)].join('\n');
    try {
      if (navigator.share) await navigator.share({ title: 'FJ parts to buy', text });
      else { await navigator.clipboard.writeText(text); toast('Shopping list copied'); }
    } catch { /* share sheet dismissed */ }
  };

  /* ---------- Viewer ---------- */

  const V = { ids: [], i: 0, busy: false };
  const viewer = $('#viewer');
  const cur = () => state.photos.find(p => p.id === V.ids[V.i]);
  function openViewer(ids, i) { V.ids = ids; V.i = i; viewer.hidden = false; document.body.style.overflow = 'hidden'; history.pushState({ viewer: 1 }, ''); showCur(); }
  function closeViewer(fromPop) { viewer.hidden = true; document.body.style.overflow = ''; $('#vImg').removeAttribute('src'); if (!fromPop && history.state && history.state.viewer) history.back(); renderPhotosEverywhere(); }
  window.addEventListener('popstate', () => { if (!viewer.hidden) closeViewer(true); });
  function showCur() {
    const p = cur(); if (!p) { closeViewer(); return; }
    const s = BY[p.step] || BY.general;
    $('#vCode').textContent = s.code; $('#vTitle').textContent = s.t;
    $('#vPos').textContent = V.ids.length > 1 ? `${V.i + 1}/${V.ids.length}` : '';
    $('#vImg').removeAttribute('src'); $('#vImg').alt = p.caption || s.t; setImg($('#vImg'), p, 2000);
    $('#vCap').value = p.caption || '';
    $('#vStep').innerHTML = stepOptions(); $('#vStep').value = p.step;
    $('#vDate').textContent = p.taken ? 'Taken ' + new Date(p.taken).toLocaleString() : '';
    $('#vPrev').hidden = $('#vNext').hidden = V.ids.length < 2;
    $('#vGoStep').hidden = p.step === 'general';
    const del = $('#vDel'); del.classList.remove('confirm'); del.textContent = 'Delete photo';
    const canAsk = REMOTE && state.askEnabled;
    $('#vAskBox').hidden = !canAsk; $('#vAskOff').hidden = canAsk || !REMOTE;
    $('#vAns').hidden = true; $('#vAskErr').hidden = true; $('#vQ').value = '';
    renderHist(p);
  }
  function renderHist(p) {
    const h = $('#vHist'); h.textContent = '';
    (p.qa || []).slice().reverse().forEach(q => {
      const d = document.createElement('div'); d.className = 'qa-old';
      const qb = document.createElement('div'); qb.innerHTML = '<b>You asked:</b> '; qb.append(q.q);
      const ab = document.createElement('div'); ab.className = 'answer'; ab.textContent = q.a;
      const t = document.createElement('div'); t.className = 'muted small'; t.textContent = q.at ? new Date(q.at).toLocaleString() : '';
      d.append(qb, ab, t); h.appendChild(d);
    });
  }
  function stepBy(d) { if (V.ids.length < 2 || V.busy) return; V.i = (V.i + d + V.ids.length) % V.ids.length; showCur(); }
  $('#vPrev').onclick = () => stepBy(-1);
  $('#vNext').onclick = () => stepBy(1);
  $('#vClose').onclick = () => closeViewer();
  let sx = null;
  $('#vStage').addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  $('#vStage').addEventListener('touchend', e => { if (sx !== null) { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) stepBy(dx < 0 ? 1 : -1); } sx = null; });
  document.addEventListener('keydown', e => { if (viewer.hidden || /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return; if (e.key === 'ArrowLeft') stepBy(-1); if (e.key === 'ArrowRight') stepBy(1); if (e.key === 'Escape') closeViewer(); });

  function updatePhoto(p, patch) {
    Object.assign(p, patch);
    if (!REMOTE) { persist(); return; }
    if (p.pending) { const op = state.outbox.find(o => o.action === 'photo_add' && o.photo.id === p.id); if (op) Object.assign(op.photo, patch); persist(); return; }
    commit({ action: 'photo_update', id: p.id, patch });
  }
  let capTimer;
  $('#vCap').addEventListener('input', e => { const p = cur(); if (!p) return; clearTimeout(capTimer); const v = e.target.value; capTimer = setTimeout(() => updatePhoto(p, { caption: v }), 800); });
  $('#vStep').addEventListener('change', e => { const p = cur(); if (!p) return; updatePhoto(p, { step: e.target.value }); showCur(); toast('Moved to ' + (BY[e.target.value] || BY.general).code); });
  $('#vGoStep').onclick = () => {
    const p = cur(); if (!p) return;
    const s = BY[p.step]; closeViewer(); go('checklist');
    state.phase = s.phase; store.set(KEY.phase, s.phase); renderChecklist();
    const li = document.getElementById(s.c);
    if (li) { li.querySelector('.toggle').click(); li.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
  };
  $('#vPart').onclick = () => { const p = cur(); if (p) openPart({ step: p.step, photo: p.id, name: p.caption || '' }); };
  $('#vDel').onclick = () => {
    const b = $('#vDel'), p = cur(); if (!p) return;
    if (!b.classList.contains('confirm')) { b.classList.add('confirm'); b.textContent = 'Tap again to delete'; setTimeout(() => { b.classList.remove('confirm'); b.textContent = 'Delete photo'; }, 4000); return; }
    state.photos = state.photos.filter(x => x.id !== p.id);
    idb.del(p.id).catch(() => {});
    if (REMOTE) {
      if (p.pending) { state.outbox = state.outbox.filter(o => !(o.action === 'photo_add' && o.photo.id === p.id)); persist(); }
      else commit({ action: 'photo_delete', id: p.id });
    } else persist();
    V.ids = V.ids.filter(id => id !== p.id); V.i = Math.min(V.i, V.ids.length - 1);
    if (!V.ids.length) closeViewer(); else showCur();
  };

  function stepContext(c) {
    const s = BY[c]; if (!s) return '';
    const parts = [`Step ${s.code}: ${s.t}`];
    if (s.d) parts.push('What the step involves: ' + strip(s.d));
    if (s.list) parts.push(s.list.map(x => '- ' + x).join('\n'));
    if (s.after) parts.push(strip(s.after));
    if (s.warn) parts.push('Caution from the checklist: ' + strip(s.warn));
    if (s.specs && s.specs.length) parts.push('Factory torque specs for this step:\n' + s.specs.map(r => `- ${r.f}: ${r.nm} N·m (${r.imp})${r.note ? ' — ' + r.note : ''}`).join('\n'));
    const st = St(c); if (st.notes) parts.push("Owner's notes on this step: " + st.notes);
    return parts.join('\n');
  }

  const ASK_ERRORS = {
    ask_not_configured: 'Asking Claude isn’t set up yet. Add the ANTHROPIC_API_KEY script property (see the README).',
    claude_key_rejected: 'Anthropic rejected the API key. Check the ANTHROPIC_API_KEY script property.',
    claude_busy: 'Claude is busy right now. Try again in a minute.',
    claude_declined: 'Claude couldn’t answer that one. Try rephrasing the question.',
    claude_empty: 'Claude didn’t return an answer. Try again.',
    not_found: 'That photo isn’t on the sheet anymore.',
  };
  async function ask(q) {
    const p = cur(); if (!p || !q.trim() || V.busy) return;
    const out = $('#vAns'), err = $('#vAskErr');
    err.hidden = true;
    if (p.pending) { err.textContent = 'This photo hasn’t uploaded yet. Ask again once it shows as synced.'; err.hidden = false; return; }
    V.busy = true; $('#vAsk').disabled = true;
    out.hidden = false; out.textContent = 'Claude is looking at the photo… this can take 20–60 seconds.';
    try {
      const r = await api({ action: 'ask', id: p.id, question: q.trim(), context: stepContext(p.step) });
      Object.assign(p, { qa: r.photo.qa });
      persist();
      if (cur() && cur().id === p.id) { out.hidden = true; $('#vQ').value = ''; renderHist(p); }
      if (r.truncated) toast('The answer was cut short. Try a narrower question.');
    } catch (e) {
      out.hidden = true;
      const code = String(e.code || '');
      err.textContent = ASK_ERRORS[code] || (e.network ? 'No connection. Ask again when you’re back online.' : 'That didn’t go through: ' + (code || e.message));
      err.hidden = false;
    } finally { V.busy = false; $('#vAsk').disabled = false; }
  }
  $('#vAsk').onclick = () => ask($('#vQ').value);
  $$('#vAskBox [data-q]').forEach(b => b.onclick = () => { $('#vQ').value = b.dataset.q; ask(b.dataset.q); });

  /* ---------- Illustrated guides ---------- */
  // Built from the owner's Toyota manuals and stored in their Drive; fetched with the passcode and
  // kept on the phone (IndexedDB) so they open offline in the shop.

  const ORDER = ALL.map(s => s.c);
  const G = { code: null };
  const guideEl = $('#guide');

  async function refreshGuideList() {
    const r = await api({ action: 'guide_list' });
    state.guides = r.guides || {};
    persist();
    return state.guides;
  }

  async function loadGuide(code, { network = true, onFetch } = {}) {
    let want = state.guides[code];
    const hit = await idb.get('guide:' + code).catch(() => null);
    if (hit && (!want || hit.updated === want)) return hit.g;
    if (!REMOTE || !network) return hit ? hit.g : null;
    // The full sync may not have run yet (or a stuck upload is holding it up): ask the sheet directly.
    if (!want) { await refreshGuideList(); want = state.guides[code]; }
    if (!want) return hit ? hit.g : null;
    if (onFetch) onFetch();
    const r = await api({ action: 'guide_get', code });
    const g = JSON.parse(r.guide);
    await idb.put('guide:' + code, { updated: want, g }).catch(() => {});
    return g;
  }

  function summaryHtml(s) {
    const tag = s.list && s.d && /:$/.test(strip(s.d)) && s.list.length > 2 ? 'ol' : 'ul';
    return `<div class="g-sum">
      ${s.d ? `<p>${s.d}</p>` : ''}
      ${s.list ? `<${tag} class="sub">${s.list.map(x => `<li>${esc(x)}</li>`).join('')}</${tag}>` : ''}
      ${s.after ? `<p>${s.after}</p>` : ''}
      ${s.warn ? `<div class="warn"><b>Caution.</b> ${s.warn}</div>` : ''}
      ${s.specs && s.specs.length ? `<div><div class="lbl">Torque and specs</div>${specTable(s.specs)}</div>` : ''}
      ${s.tools && s.tools.length ? `<div><div class="lbl">Tools</div><div class="chips">${s.tools.map(t => `<span class="chip">${esc(t)}</span>`).join('')}</div></div>` : ''}
    </div>`;
  }

  function figHtml(g, id) {
    const src = g.images && g.images[id];
    return src ? `<button type="button" class="g-fig" data-zoom aria-label="Enlarge illustration"><img src="${src}" alt="Manual illustration"></button>` : '';
  }

  function sourceHtml(g, src) {
    const parts = [`<section class="g-src"><div class="g-lab">${esc(src.label)}</div>`];
    if (src.kind === 'components') {
      parts.push('<div class="g-kind">Exploded view</div><div class="g-comp">' + src.blocks.map(b => b.t === 'fig' ? figHtml(g, b.img) : (b.figs || []).map(id => figHtml(g, id)).join('')).join('') + '</div>');
    } else {
      src.blocks.forEach(b => {
        if (b.t === 'fig') { parts.push(figHtml(g, b.img)); return; }
        const figs = (b.figs || []).map(id => figHtml(g, id)).join('');
        const cls = { h: 'g-h', s: 'g-s', p: 'g-p', note: 'g-note', tq: 'g-tq' }[b.t] || 'g-p';
        parts.push(`<div class="${cls}">${esc(b.text)}</div>${figs}`);
      });
    }
    parts.push('</section>');
    return parts.join('');
  }

  async function openGuide(code) {
    const s = BY[code]; if (!s) return;
    G.code = code;
    if (guideEl.hidden) { guideEl.hidden = false; document.body.style.overflow = 'hidden'; history.pushState({ guide: 1 }, ''); }
    $('#gCode').textContent = s.code; $('#gTitle').textContent = s.t;
    const i = ORDER.indexOf(code);
    $('#gPrev').disabled = i <= 0; $('#gNext').disabled = i >= ORDER.length - 1;
    const body = $('#gBody'); body.scrollTop = 0;
    body.innerHTML = `<div class="g-wrap"><div id="gStatus" class="g-status"></div>${summaryHtml(s)}<div id="gManual" class="g-manual"></div></div>`;
    const box = $('#gManual'), status = $('#gStatus');
    const say = (html, cls = '') => { status.className = 'g-status ' + cls; status.innerHTML = html; };
    const noPages = !(s.man || []).some(m => !/^EM/.test(m));
    if (noPages) { say('This step isn’t in the factory manual, so there are no illustrations. Everything for it is below.'); return; }
    say('Checking for illustrations…', 'busy');
    let t0 = 0, tick = null;
    try {
      const g = await loadGuide(code, { onFetch: () => {
        t0 = Date.now();
        say('Downloading the manual pages… (first time only)', 'busy');
        tick = setInterval(() => { if (G.code === code) say(`Downloading the manual pages… ${Math.round((Date.now() - t0) / 1000)} s (first time only)`, 'busy'); }, 1000);
      } });
      clearInterval(tick);
      if (G.code !== code) return;
      if (!g) {
        say(REMOTE
          ? 'The illustrations for this step aren’t on the Google Sheet yet. Run <b>Upload FJ Guides</b> on the Mac (Transcend › FJ Cruiser), then open this again.'
          : 'Illustrated guides need the app connected to the Google Sheet.', 'warn');
        return;
      }
      const n = Object.keys(g.images || {}).length;
      box.innerHTML = g.sources.length ? g.sources.map(src => sourceHtml(g, src)).join('') : '';
      say(g.sources.length ? `<button type="button" class="g-jump">📘 ${n} illustration${n === 1 ? '' : 's'} from the manual <span aria-hidden="true">↓</span></button>` : 'No manual pages for this step.');
      const jump = status.querySelector('.g-jump');
      if (jump) jump.onclick = () => box.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (e) {
      clearInterval(tick);
      if (G.code !== code) return;
      say(e.network ? 'No connection, and this guide isn’t saved on the phone yet. Open it once with signal, or use “Save all guides offline” in More.'
        : e.code === 'unknown_action' ? 'The Google Sheet script is an old version without guides. Check that config.js points at the newest deployment.'
        : 'Couldn’t load this guide: ' + esc(e.code || e.message), 'err');
    }
  }

  function closeGuide(fromPop) {
    guideEl.hidden = true; G.code = null; $('#gBody').textContent = '';
    if (viewer.hidden) document.body.style.overflow = '';
    if (!fromPop && history.state && history.state.guide) history.back();
  }
  $('#gClose').onclick = () => closeGuide();
  $('#gPrev').onclick = () => { const i = ORDER.indexOf(G.code); if (i > 0) openGuide(ORDER[i - 1]); };
  $('#gNext').onclick = () => { const i = ORDER.indexOf(G.code); if (i < ORDER.length - 1) openGuide(ORDER[i + 1]); };
  $('#gBody').addEventListener('click', e => {
    const z = e.target.closest('[data-zoom]'); if (!z) return;
    $('#zImg').src = z.querySelector('img').src; $('#zImg').classList.remove('big'); $('#zoom').hidden = false;
  });
  $('#zClose').onclick = () => { $('#zoom').hidden = true; $('#zImg').removeAttribute('src'); };
  $('#zImg').onclick = () => $('#zImg').classList.toggle('big');
  window.addEventListener('popstate', () => { if (!guideEl.hidden) closeGuide(true); });

  async function saveAllGuides() {
    const btn = $('#saveGuides');
    if (!REMOTE) { toast('Connect the app to the sheet first'); return; }
    btn.disabled = true; btn.textContent = 'Checking the sheet…';
    try { await refreshGuideList(); } catch (e) { btn.disabled = false; btn.textContent = 'Save all guides offline'; toast(e.network ? 'No connection' : 'Couldn’t reach the sheet: ' + (e.code || e.message)); return; }
    const codes = Object.keys(state.guides).sort();
    if (!codes.length) { btn.disabled = false; btn.textContent = 'Save all guides offline'; toast('No guides on the sheet yet. Run Upload FJ Guides on the Mac.'); return; }
    btn.disabled = true;
    let done = 0, failed = 0;
    for (const c of codes) {
      btn.textContent = `Saving guides… ${done}/${codes.length}`;
      try { await loadGuide(c); } catch { failed++; }
      done++;
    }
    btn.disabled = false;
    btn.textContent = 'Save all guides offline';
    toast(failed ? `Saved ${done - failed} guides; ${failed} failed. Try again with better signal.` : `All ${done} guides saved on this phone`);
  }
  $('#saveGuides').onclick = saveAllGuides;

  /* ---------- Frame check ---------- */

  const HPTS = [['A', 'Body mounting hole ø26', 371], ['B', 'Shock absorber hole', 608], ['C', 'Body mounting hole ø43', 232], ['D', 'Standard hole 16×16 (reference)', 300], ['E', 'Standard hole ø20', 300], ['F', 'Body mounting hole ø43', 259], ['G', 'Body mounting hole ø43', 371]];
  const num = v => { const n = parseFloat(String(v || '').replace(',', '.')); return isNaN(n) ? null : n; };
  const deltaCell = v => v === null ? '<span class="delta muted">—</span>' : `<span class="delta ${Math.abs(v) > 3 ? 'bad' : 'ok'}">${v > 0 ? '+' : ''}${v.toFixed(1)} mm</span>`;
  let frameTimer;
  function saveFrame(k) {
    if (!REMOTE) { persist(); return; }
    clearTimeout(frameTimer);
    frameTimer = setTimeout(() => {
      state.outbox = state.outbox.filter((o, i) => !(i > 0 && o.action === 'frame' && o.k === k));
      commit({ action: 'frame', k, value: state.frame[k] });
    }, 700);
  }
  function renderHeights() {
    const tb = $('#heightTable tbody'); if (!tb) return;
    if (!tb.childElementCount) {
      tb.innerHTML = HPTS.map(([p, name, spec]) => `<tr><td><b class="mono">${p}</b> <span class="muted small">${esc(name)}</span></td><td class="num">${spec}</td>
        <td><input type="text" inputmode="decimal" class="frame-in" data-h="${p}_R" aria-label="${p} right floor-to-hole mm"></td><td data-d="${p}_R"></td>
        <td><input type="text" inputmode="decimal" class="frame-in" data-h="${p}_L" aria-label="${p} left floor-to-hole mm"></td><td data-d="${p}_L"></td></tr>`).join('');
    }
    const active = document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.h : null;
    tb.querySelectorAll('input[data-h]').forEach(i => { if (i.dataset.h !== active) i.value = state.frame.h[i.dataset.h] || ''; });
    ['R', 'L'].forEach(side => {
      const ref = num(state.frame.h['D_' + side]);
      HPTS.forEach(([p, , spec]) => {
        const m = num(state.frame.h[p + '_' + side]);
        tb.querySelector(`[data-d="${p}_${side}"]`).innerHTML = p === 'D' ? '<span class="muted small">reference</span>' : (ref === null || m === null ? deltaCell(null) : deltaCell((m - ref) - (spec - 300)));
      });
    });
  }
  const diagDelta = r => { const s = num(r.spec), n = num(r.new), o = num(r.old); if (n === null) return deltaCell(null); if (s !== null) return deltaCell(n - s); if (o !== null) return deltaCell(n - o) + ' <span class="muted small">vs old</span>'; return deltaCell(null); };
  function renderDiag(force) {
    const tb = $('#diagTable tbody'); if (!tb) return;
    if (!force && tb.contains(document.activeElement)) { state.frame.rows.forEach(r => { const c = tb.querySelector(`[data-dd="${r.id}"]`); if (c) c.innerHTML = diagDelta(r); }); return; }
    tb.textContent = '';
    if (!state.frame.rows.length) { tb.innerHTML = '<tr><td colspan="7" class="muted small">No measurements yet. Add one, e.g. From C (RH) To g (LH) for the crossing diagonal.</td></tr>'; return; }
    state.frame.rows.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = ['from', 'to', 'spec', 'old', 'new'].map(k => `<td><input type="text" class="frame-in" data-rid="${r.id}" data-k="${k}" value="${esc(r[k] || '')}" ${k === 'from' || k === 'to' ? '' : 'inputmode="decimal"'} aria-label="${k}"></td>`).join('') + `<td data-dd="${r.id}">${diagDelta(r)}</td><td><button type="button" data-del="${r.id}" aria-label="Remove row">✕</button></td>`;
      tb.appendChild(tr);
    });
  }
  function bindFrame() {
    const ht = $('#heightTable'), dt = $('#diagTable'), add = $('#addDiag');
    if (!ht || ht.dataset.bound) return; ht.dataset.bound = '1';
    ht.addEventListener('input', e => { const k = e.target.dataset.h; if (!k) return; state.frame.h = { ...state.frame.h, [k]: e.target.value }; renderHeights(); saveFrame('h'); });
    dt.addEventListener('input', e => { const id = e.target.dataset.rid; if (!id) return; const r = state.frame.rows.find(x => x.id === id); if (!r) return; r[e.target.dataset.k] = e.target.value; renderDiag(); saveFrame('rows'); });
    dt.addEventListener('click', e => { const id = e.target.dataset && e.target.dataset.del; if (!id) return; state.frame.rows = state.frame.rows.filter(r => r.id !== id); renderDiag(true); saveFrame('rows'); });
    add.onclick = () => { state.frame.rows = [...state.frame.rows, { id: 'r' + Date.now().toString(36), from: '', to: '', spec: '', old: '', new: '' }]; renderDiag(true); saveFrame('rows'); const last = $('#diagTable tbody tr:last-child input'); if (last) last.focus(); };
  }

  /* ---------- Torque book ---------- */

  function renderSpecs() {
    const q = $('#specSearch').value.trim().toLowerCase(), box = $('#specGroups');
    box.textContent = '';
    SPEC_GROUPS.forEach(g => {
      if (!vOK(g.v)) return;
      const rows = g.rows.filter(r => vOK(r.v) && (!q || (g.g + ' ' + r.f + ' ' + r.nm + ' ' + r.imp + ' ' + r.note).toLowerCase().includes(q)));
      if (!rows.length) return;
      const d = document.createElement('details'); d.className = 'grp'; d.open = !!q || g.g === 'Body mounts';
      d.innerHTML = `<summary>${esc(g.g)} <span class="muted mono" style="font-weight:400">(${rows.length})</span><span class="src">${esc(g.src)}</span></summary>${specTable(rows)}`;
      box.appendChild(d);
    });
    if (!box.childElementCount) box.innerHTML = `<div class="empty" style="margin-top:10px">No specs match “${esc(q)}”.</div>`;
  }
  $('#specSearch').addEventListener('input', renderSpecs);

  /* ---------- More ---------- */

  function applyTrans() { $$('[data-trans]').forEach(b => b.setAttribute('aria-pressed', b.dataset.trans === state.trans)); }
  $$('[data-trans]').forEach(b => b.onclick = () => {
    state.trans = b.dataset.trans; applyTrans(); renderAll();
    if (REMOTE) commit({ action: 'setting', k: 'trans', value: state.trans }); else persist();
  });
  const hideBtn = $('#hideDone');
  function applyHide(on) { hideBtn.setAttribute('aria-pressed', on); document.body.classList.toggle('hide-done', on); }
  hideBtn.onclick = () => { const on = hideBtn.getAttribute('aria-pressed') !== 'true'; applyHide(on); store.set(KEY.hide, on); };
  applyHide(!!store.get(KEY.hide, false));
  $('#syncNow').onclick = () => { if (REMOTE) refresh(); else toast('Demo mode: nothing to sync'); };
  $('#syncBtn').onclick = () => { if (REMOTE) refresh(); };
  $('#passBtn').onclick = () => askPasscode();
  $('#shareBtn').onclick = async () => {
    const url = location.origin + location.pathname + (state.pass ? '#join=' + encodeURIComponent(state.pass) : '');
    try {
      if (navigator.share) await navigator.share({ title: 'FJ Frame Swap', text: 'FJ frame swap checklist (link includes the passcode)', url });
      else { await navigator.clipboard.writeText(url); toast('Link copied. It includes the passcode.'); }
    } catch { /* share sheet dismissed */ }
  };
  $$('[data-jump]').forEach(b => b.onclick = () => document.getElementById(b.dataset.jump).scrollIntoView({ behavior: 'smooth' }));

  /* ---------- Views ---------- */

  const TITLES = { checklist: 'Checklist', photos: 'Photos', parts: 'Parts to buy', frame: 'Frame check', specs: 'Torque book', more: 'More' };
  function go(view) {
    state.view = view;
    $$('main > section[data-view]').forEach(s => { s.hidden = s.dataset.view !== view; });
    const tab = view === 'frame' ? 'more' : view; // Frame check opens from More
    $$('nav.tabbar [data-tab]').forEach(b => { if (b.dataset.tab === tab) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
    $('#viewTitle').textContent = TITLES[view];
    if (view === 'photos') renderGallery(false);
    if (view === 'parts') renderParts();
    if (view === 'specs') renderSpecs();
    if (view === 'frame') { bindFrame(); renderHeights(); renderDiag(true); }
    window.scrollTo(0, 0);
  }
  $$('nav.tabbar [data-tab]').forEach(b => b.onclick = () => go(b.dataset.tab));
  $$('[data-go]').forEach(b => b.onclick = () => go(b.dataset.go));

  function renderAll() {
    const y = window.scrollY; // a background sync redraws lists; keep the reader where they were
    applyTrans();
    renderChecklist();
    if (state.view === 'photos') renderGallery();
    if (state.view === 'parts') renderParts();
    renderPartsBadge();
    if (state.view === 'specs') renderSpecs();
    if (state.view === 'frame') { renderHeights(); renderDiag(); }
    if (Math.abs(window.scrollY - y) > 1) window.scrollTo(0, y);
  }

  /* ---------- Self-update and offline shell ---------- */

  async function checkForUpdate() {
    try {
      const res = await fetch('version.json?t=' + Date.now(), { cache: 'no-store' });
      if (!res.ok) return;
      const { version } = await res.json();
      if (version && String(version) !== APP_VERSION && sessionStorage.getItem('fj.reloadedFor') !== String(version)) {
        sessionStorage.setItem('fj.reloadedFor', String(version));
        location.reload();
      }
    } catch { /* offline: try again next time */ }
  }
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});

  /* ---------- Boot ---------- */

  const join = new URLSearchParams(location.hash.slice(1)).get('join');
  if (join) { state.pass = join; store.set(KEY.pass, join); history.replaceState(null, '', location.pathname + location.search); }

  renderAll();
  go('checklist');
  $('#appVersion').textContent = 'Version ' + APP_VERSION + (REMOTE ? '' : ' · demo mode (saved on this device only)');

  if (REMOTE) {
    setSync('busy', 'Connecting…');
    refresh();
    setInterval(() => { if (document.visibilityState === 'visible' && viewer.hidden) refresh(); }, POLL_MS);
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') { refresh(); checkForUpdate(); } });
    window.addEventListener('online', flush);
  } else {
    setSync('local', 'Demo');
  }
  checkForUpdate();

  window.FJ = { state };
})();
