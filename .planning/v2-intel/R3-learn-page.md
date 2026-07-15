# R3 — learn.html Recon (root page)

Source files read in full: `/Users/theshumba/Documents/GitHub/awba-gen4/learn.html` (1167 lines).
Skimmed for shared include pattern: `lessons/u1-m1.html` (67 lines), `reviews/u1-review.html` (32 lines).
Grepped: `shared/awba-engine.js` for terminal-link + UNIT_ICON.

---

## 1. Exact `<head>` template — learn.html (repo ROOT, root-relative paths)

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Awba · Learn</title>
<meta name="theme-color" content="#131013">
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="icons/apple-touch-icon-180.png">
<script>
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js'); });
  }
</script>
<link rel="preload" as="font" type="font/woff2" href="shared/fonts/readex-pro-400.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="shared/fonts/amiri-quran-400.woff2" crossorigin>
<link rel="stylesheet" href="shared/awba-engine.css">
<script src="shared/awba-engine.js"></script>
<style> @layer screens { /* page-authored CSS, see §6 */ } </style>
</head>
<body>
<main class="reg-orbit grain" id="app"></main>
```

**CRITICAL — theme-color differs by page register**:
- `learn.html` (root, Orbit/dark register, Kiswah Black ground): `#131013`
- `lessons/*.html` (cream register): `#F3EDE2`
- `reviews/*.html` (dark register, same as learn): `#131013`

**Only learn.html and index.html carry the full "install head trio"** (manifest link + apple-touch-icon + SW register script) — comment explicitly says so: "learn.html is itself the installable app; index.html carries the same trio." **v2 pages (onboarding, Practice, Profile, More) must clone this exact trio if they are top-level/root-relative pages**, same as learn.html — they are NOT lesson/review pages one level down.

learn.html preloads only 2 fonts (readex-pro-400, amiri-quran-400) — "the two critical faces only." Lesson pages preload different fonts depending on content (u1-m1 preloads readex-pro-400 + amiri-quran-400; u1-review preloads readex-pro-400 + readex-pro-600) — **preload choice is per-page content-driven, not fixed**.

`<body>` root element is always `<main class="reg-orbit grain" id="app"></main>` for learn.html — the entire page is one big JS-rendered `#app` div; `.reg-orbit` = the dark Orbit register class, `.grain` = the shipped grain texture overlay.

## 2. Service-worker registration snippet (verbatim, file://-guarded)

```html
<script>
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js'); });
  }
</script>
```

- Path `sw.js` is root-relative (works because learn.html is at repo root).
- Guard is `location.protocol !== 'file:'` — this is what keeps the double-click-review workflow and any file://-based render-smoke harness a no-op.
- Confirmed only on `learn.html` + `index.html` per the code comment (D-71). Lesson/review pages do **not** register the SW themselves.
- **v2 rule**: if Practice/Profile/More/onboarding are separate top-level pages, they need this exact snippet (with correct relative path to `sw.js`) cloned in, same file://-guard.

## 3. Tab bar — markup, active-state, CURRENT coming-soon wiring

### Markup (built by `tab(id, active, scene, label)` helper, rendered inside `render()`)
```html
<nav class="otabs" aria-label="Sections">
  <button class="tab active" type="button" id="tabLearn" aria-current="page">
    <span class="otab-ic">…AW.icon('lamp')…</span>Learn
  </button>
  <button class="tab" type="button" id="tabPractice"><span class="otab-ic">…AW.icon('beads')…</span>Practice</button>
  <button class="tab" type="button" id="tabReturns"><span class="otab-ic">…AW.icon('flame')…</span>Returns</button>
  <button class="tab" type="button" id="tabProfile"><span class="otab-ic">…AW.icon('man')…</span>Profile</button>
  <button class="tab" type="button" id="tabMore"><span class="otab-ic">…AW.icon('pattern')…</span>More</button>
</nav>
```
Exact `tab()` helper:
```js
function tab(id, active, scene, label) {
  return '<button class="tab' + (active ? ' active' : '') + '" type="button" id="' + id + '"' +
    (active ? ' aria-current="page"' : '') + '>' +
    '<span class="otab-ic">' + AW.icon(scene) + '</span>' + label + '</button>';
}
```
- **Active-state mechanics**: class `.active` + `aria-current="page"` attribute, both only on the currently-active tab. On Orbit (dark ground), the active cue is re-inked **gold** via `@layer screens .reg-orbit .tab.active` override (crimson is banned on Orbit — 2.65:1 contrast fail). This override presumably lives in `shared/awba-engine.css`, not learn.html's own `<style>` block — confirm in engine CSS before v2 pages assume it.
- Tab bar is `<nav class="otabs">`, a **direct child of `#app`** (rendered inside `app.innerHTML = '<div class="ob-shell">...</div>' + tabs;`) so no animated/transformed ancestor breaks its `position:fixed`.
- IDs: `tabLearn`, `tabPractice`, `tabReturns`, `tabProfile`, `tabMore` — re-wired via `getElementById` **every render()** call (the whole HUD/body/tabs innerHTML is rebuilt each render, so listeners must be reattached each time — v2 must follow same pattern, not assume one-time wiring).

### CURRENT wiring (exact handler code, to be replaced with real links in v2)
```js
var tL = document.getElementById('tabLearn');
if (tL) tL.addEventListener('click', function () {
  window.scrollTo({ top: 0, behavior: AW.reducedMotion() ? 'auto' : 'smooth' });
});
var tP = document.getElementById('tabPractice');
if (tP) tP.addEventListener('click', function () {
  comingSoonSheet('beads', 'Practice is on its way. For now, keep walking the path.', 'Practice');
});
var tR = document.getElementById('tabReturns');
if (tR) tR.addEventListener('click', openStreakSheet);
var tPr = document.getElementById('tabProfile');
if (tPr) tPr.addEventListener('click', function () {
  comingSoonSheet('man', 'Your corner is on its way. For now, keep walking the path.', 'Profile');
});
var tM = document.getElementById('tabMore');
if (tM) tM.addEventListener('click', function () {
  comingSoonSheet('pattern', 'There is more to come. For now, keep walking the path.', 'More');
});
```
- **Learn tab**: not a nav — it's already the home page, so tap just scrolls to top (smooth, or instant under `AW.reducedMotion()`).
- **Practice / Profile / More tabs**: each opens `comingSoonSheet(sceneIcon, lineCopy, sheetLabel)` — v2 must replace these three handlers with real navigation (`window.location.href = '...'` or plain `<a>` conversion) to the new Practice/Profile/More pages, WITHOUT touching the Learn or Returns handlers.
- **Returns tab**: already wired to a REAL feature — `openStreakSheet` (the streak bottom sheet), same singleton opener used by the HUD returns stat and the streak strip. **This is NOT a coming-soon stub and must NOT be touched/replaced** — Returns already works.
- The course-switcher (`courseChip` → `openSwitcher()`) is separate from the tab bar; see §4 — it must **stay** coming-soon in v2 (explicit instruction from task).

## 4. Sheet builders — full code

All three ride the ONE shared primitive `AW.sheet(html, accessibleLabel)` (singleton, append-to-body, outside-tap + Esc close, scroll-lock — all shipped in the engine). Grip handle markup `<div class="grip"></div>` is the shared drag-handle visual, always first child.

### `openStreakSheet()`
```js
function openStreakSheet() {
  var st = AW.state(), n = st.returns;
  var wk = AW.weekCal(), dots = '';
  wk.forEach(function (d) { dots += '<span class="day' + (d.on ? ' here' : '') + '"></span>'; });
  AW.sheet(
    '<div class="grip"></div>' +
    '<div class="osh-hero">' +
      '<div class="osh-big">' + n + '</div>' +
      '<div class="osh-sub">' + (n === 1 ? 'day you came back' : 'days you came back') + '</div>' +
    '</div>' +
    '<div class="weekcal osh-week">' + dots + '</div>' +
    '<div class="osh-note">This number can never break and never reset. Every return adds to it, however long the gap. That is the point of this place.</div>',
    'Your streak');
}
```

### `openNoorSheet()`
```js
function openNoorSheet() {
  var st = AW.state();
  AW.sheet(
    '<div class="grip"></div>' +
    '<div class="osh-hero">' +
      '<div class="osh-big osh-gold">' + st.noor + '</div>' +
      '<div class="osh-sub">noor gathered</div>' +
    '</div>' +
    '<div class="osh-note">Light you collect as you learn. It is never spent against you, never dangled, and it never runs out.</div>',
    'Noor gathered');
}
```

### `openSwitcher()` — course switcher, MUST STAY COMING-SOON in v2
```js
function openSwitcher() {
  function row(off, scene, name, pill, on) {
    return '<div class="sheet-row osw-row' + (off ? ' off' : '') + '">' +
      '<span class="osw-ic">' + AW.icon(scene, { size: '24px' }) + '</span>' +
      '<span class="osw-name">' + name + '</span>' +
      '<span class="osw-pill' + (on ? ' on' : '') + '">' + pill + '</span>' +
    '</div>';
  }
  AW.sheet(
    '<div class="grip"></div>' +
    row(false, 'lantern', 'Aqeedah · Level 1', 'ACTIVE', true) +
    row(true, 'open', 'Fiqh · Level 1', 'COMING SOON', false) +
    row(true, 'crescent', 'Seerah', 'COMING SOON', false) +
    row(true, 'cite', 'Qur’an', 'COMING SOON', false),
    'Switch course');
}
```
Triggered by `#courseChip` button click (in the HUD, not the tab bar). **Only Aqeedah is ACTIVE; the other 3 courses are permanently coming-soon pills — do not wire real navigation for them in v2.**

### `comingSoonSheet(scene, line, label)` — generic coming-soon sheet used by Practice/Profile/More tabs today
```js
function comingSoonSheet(scene, line, label) {
  var html =
    '<div class="grip"></div>' +
    '<div class="ocs-body">' +
      '<span class="ocs-ic">' + AW.icon(scene, { size: '40px' }) + '</span>' +
      '<p class="ocs-line">' + line + '</p>' +
    '</div>';
  AW.sheet(html, label);   // the tab name IS the sheet's accessible name
}
```
Reusable pattern (icon + one calm line) — Profile/More could reuse `.ocs-body`/`.ocs-ic`/`.ocs-line` CSS classes for any still-unbuilt sub-feature inside the new pages.

## 5. Boot sequence of learn.html's inline script

Order of operations inside the IIFE, top to bottom:
1. `UNITS` data array literal (course structure, byte-ported from Gen-3).
2. `DAILY` ayah pool array literal (7 verses, byte-verbatim, SHA-gated by `scripts/port-audit.mjs`).
3. `SPROUTS` doodle pool (20 SVG strings) + `sproutFor(id)` hash function (§10).
4. Flatten `UNITS` → `flat`/`meta`/`byId`/`metaById`/`idSet` (module-level, computed once at load, not per-render).
5. `var app = document.getElementById('app');` — cached once.
6. Function declarations only (no execution yet): `smoothPath`, `arcLenAtPoint`, `drawThreads`, `scheduleDraw`, `setupObservers`, `autoScroll`, popup functions (`closePop`/`placePop`/`openPopFor`/`nodeAtomCount`/`popContent`/`wireCta`/`setupPopup`), sheet builders (§4), Festival/chest-claim functions (`fmtDate`/`festivalHtml`/`closeFestival`/`openFestival`/`window.__awbaClaimChest`), and finally `render()` itself.
7. **`render()` is called once at the bottom of the IIFE**: `render();` (last line before `})();`).
8. Inside `render()` itself, in order: `closePop()` → `AW.state()` → `AW.deriveNodeState()` → compute active node/unit → build HUD html → build Ring hero html → build streak strip html → build Continue card html → build daily-ayah html → build the winding journey (units/nodes/threads) html → build Ibrahim epigraph html → build tab bar html → **one single `app.innerHTML = ...` assignment** (HUD + wrap + tabs) → `AW.bindMuteBtn(render)` → wire HUD taps → wire tab-bar taps → wire continue-card morph → wire daily-ayah citation taps → apply node entrance stagger (skipped under reduced motion) → `drawThreads()` → `setupObservers()` → `setupPopup()` → `if (!booted) { booted = true; autoScroll(); }` (autoScroll/hash-scroll fires ONLY on the very first render, guarded by module-level `booted` flag).
9. **After the IIFE**, a SEPARATE second `<script>` block runs: the add-to-home nudge controller (§7) — deliberately a separate classic script, not folded into the main IIFE ("never a module — file:// review must survive").

**Where a first-run onboarding redirect check would safely slot in**: at the very top of the outer IIFE, BEFORE `render()` is called (ideally before even the `UNITS`/`DAILY` data literals, immediately after `'use strict';`) — a synchronous check via `AW.prefs.get('onboardingDone', false)` (or equivalent new pref key) that does `location.replace('onboarding.html')` and `return;` out of the IIFE before touching `app`/`render`. This must go through `AW.prefs` (see law below) — never a raw `localStorage.getItem` check — to keep the zero-direct-storage law intact. Doing the check before `render()` avoids a flash of the learn UI before redirecting.

**The zero-direct-storage-API law — CONFIRMED count = 0.** Grep of `learn.html` for `localStorage|sessionStorage` returns **zero matches**. Every state read/write on this page goes through engine primitives: `AW.state()`, `AW.S.get`/`AW.S.set` (13 total call-sites combined across `AW.S.`/`AW.prefs.`/`AW.state(` in the file), `AW.prefs.get`/`AW.prefs.set`, `AW.deriveNodeState`, `AW.dailyIndex`, `AW.weekCal`, `AW.ringSeed`, `AW.atomsDone`.

**How the install-nudge kept this at 0**: the add-to-home nudge (a whole separate feature bolted onto this page) needed to remember "dismissed" state persistently. Rather than adding a raw `localStorage` call (which would break the zero-direct-storage law), it defines `var DISMISS_KEY = 'installNudgeDismissed';` and calls `AW.prefs.get(DISMISS_KEY, false)` / `AW.prefs.set(DISMISS_KEY, true)` — i.e. it **reused the engine's existing single generic prefs storage call with a brand-new key string**, rather than adding a new storage call or a schema bump. The code comment states this explicitly: "this page never touches the storage layer itself, so a new pref KEY reuses the engine's single storage call (no new storage literal here, no call added in the engine, no schema bump)." **This is the pattern v2 MUST follow for any new page-level dismissal/first-run/preference state**: always `AW.prefs.get/set('newKeyName', default)`, never touch `localStorage` directly, never add a new engine-level storage call — just mint a new key string.

## 6. Page-authored `@layer screens` `<style>` block — what it styles

Three things ONLY (learn.html's only page-owned CSS; "zero new tokens, zero new hex — every value is a shipped variable"):
1. `#streakStrip` — UA button-chrome reset (the streak strip is a native `<button>` per D-62; reset appearance/background/border/padding/margin/font/color/text-align/cursor so the shipped `.ob-streak` visual is unaffected by native button defaults).
2. `.oayah-cite` — the "Read the citation" quiet Courier marginalia affordance on the daily-ayah card: 44px tap target, hairline underline (not filled), `--paper-62` ink at rest → `--cream` on hover, focus ring rides in automatically from engine grammar, `:active` press with reduced-motion guard.
3. `.aw-nudge` / `.awn-*` classes — the entire add-to-home nudge visual system: fixed-position wrapper (`bottom: calc(var(--awn-lift, 64px) + var(--sp-4))`, z-index 60, sits above tab bar z-index 50, below popup z-index 70), enter/exit transition states (`.is-in`/`.is-out`, asymmetric durations), the inner `.awn-card` (Layl Navy panel, cream text, hairline edge-line shadow — never a drop shadow on dark), icon/copy/title/line/actions/add-button/dismiss-button sub-styles, all reduced-motion guarded.

## 7. Add-to-home nudge — markup/logic + AW.prefs key

- **Separate classic `<script>` IIFE**, appended after the main render IIFE, guarded first by `if (!window.AW || !AW.prefs) return;`.
- **Standalone check** (already-installed guard): `window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true` → return early, never nudge.
- **Dismissal key**: `var DISMISS_KEY = 'installNudgeDismissed';` read via `AW.prefs.get(DISMISS_KEY, false)`.
- **Chromium path**: listens for `beforeinstallprompt`, calls `e.preventDefault()`, stashes `deferred = e`, calls `reveal('prompt')` (shows an "Add to home" button that calls `deferred.prompt()` then `dismiss()` on `userChoice` resolution either way).
- **iOS path**: feature-detects `'standalone' in navigator` (iOS Safari-only property, no UA sniffing), waits 1200ms (letting Chromium's event win first if present) then `reveal('ios')` — shows a Share→Add-to-Home-Screen text hint, NO button.
- **`appinstalled` event**: sets the dismiss pref permanently and removes the banner if shown.
- **Markup** (via `build(variant)`): a `<div class="aw-nudge reg-orbit">` (role="region", aria-label="Keep Awba on your home screen") containing `.awn-card` → `.awn-ic` (lamp icon) + `.awn-copy` (`.awn-title` "Keep Awba a tap away" + `.awn-line` variant copy) + `.awn-acts` (`.awn-add` button, Chromium-only + `.awn-dismiss` "Not now" button, always present).
- **Mounted on `document.body`** directly (not inside `#app`), so a `render()` rebuild of `#app.innerHTML` never wipes it — same body-mount pattern as the node popup (§3 of learn.html body — "R-4 / Pitfall 3").
- Height of the fixed tab bar is measured live (`document.querySelector('.otabs')`) to set `--awn-lift` custom property so the banner floats just above it, never hardcoded.
- `AW.announce(...)` fires a polite screen-reader announcement when revealed.

## 8. UNITS data structure — full id/label/href/order map

Structure: `UNITS` = array of 4 unit objects `{ n, title, desc, nodes: [...] }`. Each node object: `{ id, href?, label, review?:true, chest?:true }`. Flattened into `flat`/`meta`/`byId`/`metaById`/`idSet` at module load (never mutated after).

**Full 24-node list, in exact flattened order** (this IS the order Practice/Profile need for any id↔label↔href/kind map):

| # | id | kind | href | label | Unit |
|---|----|------|------|-------|------|
| 1 | u1m1 | lesson | lessons/u1-m1.html | What sound belief is | U1 The Foundation |
| 2 | u1m2 | lesson | lessons/u1-m2.html | Why belief matters | U1 |
| 3 | u1m3 | lesson | lessons/u1-m3.html | Where belief comes from | U1 |
| 4 | u1m4 | lesson | lessons/u1-m4.html | How we keep it sound | U1 |
| 5 | u1r | review | reviews/u1-review.html | Legendary review | U1 |
| 6 | u1c | chest | (none — chest:true, no href) | A gift | U1 |
| 7 | u2m1 | lesson | lessons/u2-m1.html | The causes within you | U2 The Drift |
| 8 | u2m2 | lesson | lessons/u2-m2.html | The pulls from outside | U2 |
| 9 | u2m3 | lesson | lessons/u2-m3.html | Protecting yourself I | U2 |
| 10 | u2m3b | lesson | lessons/u2-m3b.html | Protecting yourself II | U2 |
| 11 | u2r | review | reviews/u2-review.html | Legendary review | U2 |
| 12 | u2c | chest | (none) | A gift | U2 |
| 13 | u3m1 | lesson | lessons/u3-m1.html | What Tawhid is | U3 The Heart of It: Tawhid |
| 14 | u3m2 | lesson | lessons/u3-m2.html | Worth more than everything | U3 |
| 15 | u3m3 | lesson | lessons/u3-m3.html | One religion, one thread | U3 |
| 16 | u3r | review | reviews/u3-review.html | Legendary review | U3 |
| 17 | u3c | chest | (none) | A gift | U3 |
| 18 | u4m1 | lesson | lessons/u4-m1.html | The two pillars | U4 The Pillars |
| 19 | u4m2 | lesson | lessons/u4-m2.html | The Lord of everything | U4 |
| 20 | u4m2b | lesson | lessons/u4-m2b.html | The deniers' twist | U4 |
| 21 | u4m3 | lesson | lessons/u4-m3.html | How we know He is there | U4 |
| 22 | u4r | review | reviews/u4-review.html | The final review | U4 |
| 23 | u4c | chest | (none) | The course gift | U4 |

**Total = 23 nodes** (task brief said "23/24" — actual count is 23: 15 lessons + 4 reviews + 4 chests = 23). Unit titles: U1 "The Foundation" / U2 "The Drift" / U3 "The Heart of It: Tawhid" / U4 "The Pillars". `chest` nodes carry NO `href` field at all (`chest:true` only) — they're claimed via popup CTA + `window.__awbaClaimChest(id)`, never navigated to.

`AW.UNIT_ICON = { u1: 'compass', u2: 'lanterns', u3: 'kaaba', u4: 'mosque' };` (defined in `shared/awba-engine.js` line 957) — maps unit number to a scene-icon name, used for the unit-header icon, course chip icon, and course-switcher.

## 9. Lesson/review page conventions (for v2 Practice sessions)

- Both lesson and review pages: **inline `<script>` config, NOT external src** — the whole page's content is a single JS object literal passed to a global engine function call (`AwbaLesson({...})` or `AwbaReview({...})`), executed synchronously right after the engine script has loaded (classic script load order: engine `<script src>` in `<head>` runs first, config `<script>` in `<body>` runs after, calling the now-defined global function).
- **Head differences from learn.html** (both lesson and review live in subdirectories, one level down):
  - All asset paths use `../` prefix: `../shared/fonts/*.woff2`, `../shared/awba-engine.css`, `../shared/awba-engine.js`.
  - **NO manifest link, NO apple-touch-icon, NO SW-registration script** — the install trio lives ONLY on learn.html/index.html.
  - `theme-color` differs: lessons use `#F3EDE2` (cream register), reviews use `#131013` (dark register, matching learn.html's Orbit ground).
  - Lesson preloads: `readex-pro-400` + `amiri-quran-400` (content has Arabic terms/citations). Review preloads: `readex-pro-400` + `readex-pro-600` (no Arabic ayah display in the review shell itself, per this sample — but check per-review, since u1-review's `items` are pure English MCQ, no `ar:` fields).
  - `<body>` has **no wrapper `<main id="app">` shell written by the page** — `AwbaLesson`/`AwbaReview` fully own DOM construction themselves (confirmed by engine comment: "both runners wipe document.body.innerHTML at init").
- **`AwbaLesson(cfg)` shape** (from `u1-m1.html`): `{ id, unitColor, journey, opener:{h2,p,thought}, terms:{key:{ar,tl,word,def,ctx}}, refs:{key:{ref,ar,mean,src}|{kind,ref,grade,ar,mean,src}}, beats:[...various t: 'read'|'depth'|'reflect'|'mc'|'panel'|'tf'...], grew, recap:[...], doneTitle, doneLine, next:{href,label} }`. Note: `unitColor` field still present in the data even though "the retired `color` field is DROPPED" for path rendering in learn.html — it's part of Josh's byte-preserved data shape and simply unused/ignored by the Athar engine (compatibility constraint, not a v2 pattern to copy).
- **`AwbaReview(cfg)` shape** (from `u1-review.html`): `{ id, title, sub, mastery, items:[{q,o,c,t}|{q,quote,o,c,t}|{q,tf:true,c,t}], next:{href,label} }`.
- **Terminal "Back to the path" link** — NOT authored per-page; it's built inside the shared engine (`shared/awba-engine.js`):
  - Lesson footer (engine line 2309): `foot(nextBtn + '<a class="ls-back" href="../learn.html">Back to the path</a>');`
  - Review footer (engine line 2586): `foot(nextBtn + '<a class="btn ghost" href="../learn.html">Back to the path</a>');`
  - Review pre-start footer (engine line 2474): `foot(btn('Begin the review', '', 'start') + '<a class="btn ghost" href="../learn.html">Maybe later</a>');`
  - Both hardcode `../learn.html` — **this assumes the page lives exactly one directory below repo root**. Any new v2 "Practice session" page must either live at that same depth (e.g. `practice/session.html` → `../learn.html` still resolves) or the engine's hardcoded path needs updating — check actual depth before reusing this engine code path unmodified.
  - `cfg.next` (both lesson and review) renders as `<a class="btn" href="{next.href}">Next: {next.label}</a>` (lesson) / `<a class="btn" href="{next.href}">{next.label}</a>` (review) — the forward-navigation link, separate from the "back to path" link.

## 10. D-55 doodle pool location + `sproutFor(id)`

- Lives **inline in learn.html itself** (not in the shared engine) — the `SPROUTS` array (20 hand-inked 24×24 SVG string literals, indices 0–19, gold-ink-only `var(--gold)`, `aria-hidden="true"`, static/no animation per "law 9").
- Built from two shared string fragments: `SPD` (closing stroke-tail: `" fill="none" stroke="var(--gold)" stroke-width="1.8" stroke-linecap="round"/>'`) and `SPO` (opening svg tag: `'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">'`).
- **`sproutFor(id)` — exact code**:
```js
function sproutFor(id) {
  var h = 0;
  for (var i = 0; i < id.length; i++) { h = (h * 31 + id.charCodeAt(i)) >>> 0; }
  return SPROUTS[h % SPROUTS.length];
}
```
  A simple unsigned string hash (multiply-by-31 rolling hash, `>>> 0` to force unsigned 32-bit) modulo pool length (20) — deterministic per node id string, no `Math.random`, so the same lesson always gets the same plant every render/session. Only used for lesson nodes (not reviews/chests) that are in `done` state — rendered as `<span class="onode-sprout">' + sproutFor(nd.id) + '</span>`.
- **If Profile reuses this**: it would need to copy both the `SPROUTS` array + `sproutFor()` function (currently NOT exposed on `AW.*`, i.e. NOT a shared engine primitive — it is page-private to learn.html). Either duplicate the array+function into the new page, or (better, if scope allows) hoist it into `shared/awba-engine.js` as `AW.sproutFor`/`AW.SPROUTS` so both pages share one copy — flag this as a judgment call for the v2 builder, not something already decided.

---

## Headline facts a v2 builder must not get wrong

1. `learn.html` sits at repo ROOT — every path is root-relative (`shared/...`, `icons/...`), never `../`; lessons/reviews are one level down and use `../shared/...`.
2. Only `learn.html` + `index.html` carry the manifest link, apple-touch-icon, and SW-registration script — lesson/review pages have none of these three.
3. `theme-color` is register-specific: `#131013` (Kiswah/dark, learn.html + reviews) vs `#F3EDE2` (cream, lessons).
4. SW registration is always guarded by `location.protocol !== 'file:'` — never remove this guard.
5. ZERO direct `localStorage`/`sessionStorage` calls anywhere in learn.html — everything goes through `AW.state()`, `AW.S.get/set`, `AW.prefs.get/set`. Any new v2 state (onboarding-done flag, etc.) must reuse `AW.prefs.get/set('newKeyName', default)` — never touch storage directly, never add a new engine-level storage call.
6. Tab bar has 5 tabs: Learn (id `tabLearn`), Practice (`tabPractice`), Returns (`tabReturns`), Profile (`tabProfile`), More (`tabMore`) — icons `lamp`/`beads`/`flame`/`man`/`pattern` respectively.
7. Returns tab is ALREADY real (opens `openStreakSheet()`) — do not touch it. Only Practice/Profile/More are coming-soon stubs (`comingSoonSheet(...)`) that v2 must replace with real navigation.
8. The course-switcher (`openSwitcher()`, opened from `#courseChip` in the HUD, separate from the tab bar) MUST STAY coming-soon in v2 — only "Aqeedah · Level 1" is ACTIVE; Fiqh/Seerah/Qur'an stay permanent COMING SOON pills.
9. All tab-bar/HUD click listeners are rewired on every single `render()` call (learn.html does a full `app.innerHTML` rebuild each render) — there is no persistent DOM, so v2 pages following this pattern must re-attach listeners after every re-render too.
10. Course structure: 4 units × (lessons + 1 review + 1 chest) = 23 total nodes, ids like `u1m1`…`u4c`; chest nodes have no `href`, claimed via popup + `window.__awbaClaimChest(id)`.
11. Lesson/review pages use a single inline `<script>` calling global `AwbaLesson({...})` / `AwbaReview({...})` — classic (non-module) scripts, engine loaded first via `<script src>`, config script runs after and both use the SAME storage/engine, never separate.
12. The "Back to the path" terminal link is generated by the SHARED ENGINE (`shared/awba-engine.js` lines 2309/2474/2586), hardcoded to `../learn.html` — not authored per lesson/review page; any new page reusing this engine code must sit at the same directory depth or the hardcoded path breaks.
13. `AW.UNIT_ICON = { u1: 'compass', u2: 'lanterns', u3: 'kaaba', u4: 'mosque' }` — defined once in `shared/awba-engine.js`, reused everywhere a unit-icon is needed.
14. The D-55 sprout doodle pool (`SPROUTS` array + `sproutFor(id)` hash function) is currently PAGE-PRIVATE to learn.html, not a shared `AW.*` primitive — Profile must either duplicate it or the team must hoist it into the engine first.
15. `AW.sheet(html, label)` is the ONE shared bottom-sheet primitive (singleton, body-mounted, outside-tap/Esc close, scroll-lock) — reused for streak/noor/switcher/comingSoon; any new Profile/More content sheets should reuse this same call rather than inventing new sheet DOM.
