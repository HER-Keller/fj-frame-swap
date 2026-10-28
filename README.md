# FJ Frame Swap

A phone app for the body-off frame swap on a 2007 FJ Cruiser. It covers the checklist, photos, the frame check and a torque book, with every spec taken from the Toyota factory manuals (RM0240U repair, BM0240U collision). Progress and photos sync through a Google Sheet and a Drive folder.

- **Checklist:** 94 steps in 8 phases. Each step has its torque table, tools, cautions, the manual folder path on the Transcend drive, a bag number, notes and photos.
- **Photos:** you can take a photo straight from any step, or browse them all on the Photos tab. The viewer has swipe, captions and moving a photo to another step. **Ask Claude** answers questions about a photo, using that step's instructions and specs as context.
- **Frame check:** a height check against Toyota's frame drawing, plus a point-to-point diagonal log.
- **Torque book:** all the specs in one place, with search.
- **Offline:** the app opens with no signal. Checkmarks, notes and photos are saved on the phone and sync when the connection comes back.

## 1. Connect a Google Sheet (about 3 minutes)

1. Create a new Google Sheet named **FJ Frame Swap**, then open **Extensions → Apps Script**.
2. Replace the contents of `Code.gs` with [`apps-script/Code.gs`](apps-script/Code.gs).
3. Change `const PASSCODE = 'CHANGE-ME';` to a passcode of your own, then **Save**.
4. In the function dropdown pick **setup**, then click **Run**. Approve the permissions prompt (Advanced → Go to project → Allow).
   This creates the **Steps**, **Photos**, **Frame** and **Settings** tabs and a **FJ Frame Swap Photos** folder in your Drive. It also carries over the progress from the earlier checklist page.
5. **Optional, for Ask Claude:** open **Project Settings** (the gear icon) → **Script properties** → **Add script property**. Name it `ANTHROPIC_API_KEY` and paste in a key from [console.anthropic.com](https://console.anthropic.com/). Each question costs about 2 cents. Leave this out and the app works the same, just without the Ask button.
6. **Deploy → New deployment** → gear icon → **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**. The passcode is what protects it.
7. Copy the **Web app URL** (it ends in `/exec`) into [`config.js`](config.js).

If you change `Code.gs` later, use **Deploy → Manage deployments → ✏️ → Version: New version** so the URL stays the same.

## 2. Host it (GitHub Pages)

Same setup as the Grocery Tracker:

```bash
gh repo create fj-frame-swap --public --source . --push
```

```bash
gh api -X POST repos/{owner}/fj-frame-swap/pages -f "source[branch]=main" -f "source[path]=/"
```

The app will be at `https://<username>.github.io/fj-frame-swap/`.

## 3. Add it to your iPhone

Open the link in Safari, enter the passcode, then tap **Share → Add to Home Screen**.

## Photos and privacy

Photos go into the **FJ Frame Swap Photos** Drive folder, and each one is shared as "anyone with the link can view" so the app can show it quickly. Nobody can find a photo without its exact link. If your Google account doesn't allow link sharing, the app loads photos through the script instead, which is slower but still works.

## Editing the sheet directly

You can edit the tabs by hand. Keep the column order as it is. Every open phone picks up changes within about 20 seconds.

## Local development

```bash
python3 -m http.server 8766
```

With `apiUrl` empty in `config.js`, the app runs in **demo mode** and saves everything in the browser, photos included.

When you publish a change, bump the version in `version.json`, `APP_VERSION` in `app.js`, the `?v=` numbers in `index.html` and `CACHE` in `sw.js`. Phones then reload to the new version on their own.
