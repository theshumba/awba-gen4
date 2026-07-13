# Phase 5: Learn Page & Cross-Page View Transitions — Pattern Map

**Mapped:** 2026-07-13
**Files analyzed:** 6 (1 new page, 2 engine files modified, 2 test files, 1 fidelity check) + the 20-page VT inheritance question resolved
**Analogs found:** 6 / 6 (every surface has a shipped in-repo analog; nothing is net-new logic)

> **Read this first — the phase thesis (RESEARCH §Summary, UI-SPEC §0):** Phase 5 is a
> **composition-and-wiring** phase, not a new-primitives phase. Almost every capability is a shipped
> `AW.*` seam or `@layer` primitive. The temptation to re-solve node-state / sheets / transitions /
> mute on the page is exactly how CNT-03 / RWD-04 / MOT-02 regressions get introduced — copy the
> analogs below verbatim instead. **`learn.html` sits at repo ROOT**, so its asset paths are
> `shared/awba-engine.css` / `shared/awba-engine.js` (NO `../` prefix — unlike `lessons/` and
> `reviews/`, which live one level down). This is the single most common byte-error the executor can
> make: mirror `preview.html`'s head (root-relative), NOT `lessons/u1-m1.html`'s head (`../`-prefixed).

---

## File Classification

| New / Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---------------------|------|-----------|----------------|---------------|
| `learn.html` (NEW, repo root) | page / controller (page-inline script, `.reg-orbit` composition) | event-driven + CRUD-render (reads `AW.state()`, renders, taps → popup/sheet/nav) | `preview.html` (root shell + head) · `lessons/u1-m1.html` (page shape) · Gen-3 `_MVP-BUILD/learn.html` (behaviour) | composite exact — shell + behaviour analogs both exist |
| `shared/awba-engine.js` (MOD — seams) | engine / utility (pure DOM-free helpers + two exports) | transform (pure fns) | `AW.dailyIndex` ← mirrors `AW.skyDawn` / `AW.deriveNodeState` / `AW.weekCal` (sibling pure helpers in the same file) | exact (same file, same idiom) |
| `shared/awba-engine.css` (MOD — VT + screens) | config / stylesheet | — | existing `@layer screens` (:923) block + reduced-motion (:1807) + `.rv-shell` gold override (:1686) | exact |
| `scripts/tests/learn-state.test.js` (NEW) | test | request-response (pure-fn assertions over `loadEngine` harness) | `scripts/tests/sky.test.js` + `scripts/tests/state-storage.test.js` | exact |
| `scripts/tests/render-smoke.mjs` (MOD — `findPages()`) | test / tooling | batch / file-I/O | itself (extend the dir list) | exact (in-place) |
| DAILY-pool byte-fidelity check (extend `scripts/port-audit.mjs` OR fold into `learn-state.test.js`) | test / tooling | file-I/O + SHA fidelity | `scripts/port-audit.mjs` `CFG_RE` + `sha256()` | role-match |
| **The 19 lesson/review pages** | page | — | **NO per-page edit required — see "Cross-doc VT: one stylesheet + one shared handler covers all 20 pages" below** | resolved |

---

## RESOLVED: Cross-document VT needs NO per-page HTML edit (the orchestrator's flagged question)

The prompt asked whether the `@view-transition` at-rule must be added to all 19 existing pages. **It must not — and should not.** Two facts settle it:

1. **The `@view-transition { navigation: auto; }` at-rule lives in the ONE shared `shared/awba-engine.css`** (a top-level document descriptor, added high in the file per Pitfall 1). Every page — all 19 lessons/reviews, `preview.html`, and the new `learn.html` — already `<link>`s this one stylesheet, so all 20 inherit the opt-in with **zero per-page CSS**. Verified: `grep -l awba-engine.js lessons/*.html reviews/*.html` → 19 hits (every page loads the shared engine + css).
2. **The `pageswap`/`pagereveal` shared-element name-stamp handlers belong in the ONE shared `shared/awba-engine.js`** (guarded by `typeof document !== 'undefined'`, mirroring the existing boot-stamp guard at js:471). Because the engine script loads on all 20 pages, one block of handler code covers every page — the LEARN side stamps the tapped node's Farag square on `pageswap`; the LESSON side gives its shipped `.journey` opener square the same `view-transition-name` on `pagereveal`. No lesson/review `.html` file is touched.

**Net Phase-5 file surface is exactly: `learn.html` (new) + `shared/awba-engine.js` + `shared/awba-engine.css` + `scripts/tests/learn-state.test.js` (new) + `scripts/tests/render-smoke.mjs` + `scripts/port-audit.mjs`.** The 19 pages are inert beneficiaries.

---

## Pattern Assignments

### `learn.html` — page shell + head (controller, page-inline classic script)

**Analog A — root-relative head:** `preview.html:1-20` (THE analog for a root page; NOT `lessons/u1-m1.html`, which is `../`-prefixed).

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Awba · Learn</title>
<meta name="theme-color" content="#131013">   <!-- Kiswah — matches reviews/u1-review.html (Orbit ground); lessons use #F3EDE2 (cream) -->
<link rel="preload" as="font" type="font/woff2" href="shared/fonts/readex-pro-400.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="shared/fonts/amiri-quran-400.woff2" crossorigin>
<link rel="stylesheet" href="shared/awba-engine.css">   <!-- NO ../ — root page -->
<script src="shared/awba-engine.js"></script>            <!-- classic, parse-time AW; NO ../ -->
</head>
```

**Fonts on disk (verified `shared/fonts/`):** `readex-pro-{300,400,500,600,700}`, `amiri-quran-400`, `amiri-{400,700}`, `aref-ruqaa-{400,700}`, `courier-prime-400`, `marcellus-400`, `rakkas-400`, `inter-{400,500,600,700}`. Preload only the two critical faces (Readex + Amiri Quran), exactly as `preview.html:14-15` and the lesson/review heads do — the rest load on demand.

**Analog B — page-inline `AwbaX(cfg)` body shape:** `lessons/u1-m1.html:13-16` / `reviews/u1-review.html:13-15` — `<body>` holds ONE inline `<script>` that calls the engine. learn.html follows the same shape, but instead of `AwbaLesson(cfg)` it holds the page's own `render()` + the `UNITS`/`DAILY` data + the wiring (it is a page, not a runner-cfg). Body root must carry the register class the smoke harness looks for:

```html
<body>
<main class="reg-orbit" id="app"><!-- HUD / Ring / streak / continue / ayah / path / Ibrahim / tabs render here --></main>
<script> /* UNITS, DAILY, render(), node/tab/sheet wiring — see below */ </script>
</body>
```

> **Register-root gate (Pitfall 7):** `render-smoke.mjs` REGISTER_ROOT_RE = `class="[^"]*\breg-(page|orbit)\b[^"]*"` (mjs:33) — `class="reg-orbit"` on `<main>` already passes; no regex change needed, only the `findPages()` dir list.

**Anti-patterns for this file (RESEARCH §Anti-Patterns, UI-SPEC retired list):** never emit `poppins`, `confetti`, `amber`, `lantern-gold`, `PERFECT`, `class="combo"`, `fonts.googleapis`, `rgba(37,54,`, `--accent`, `.gold-bg`, `.mascot`, `IC_CHEST`/`IC_STAR`/`IC_TROPHY`/`IC_LOCK`, `AW.LANTERN`/`AW.STARG`, or any `u.color` unit-tint. Drop the Gen-3 `color:` field on port.

---

### `learn.html` — node-state derivation (LRN-02 / CNT-03) — CONSUME, do not fork

**Analog:** `AW.deriveNodeState` — `shared/awba-engine.js:439-467` (PURE, DOM-free, built in Phase 2 *for this page*; it already encodes the exact Gen-3 unlock + chest rules).

```javascript
// shared/awba-engine.js:439 — the shipped seam (DO NOT reimplement Gen-3 nodeState on the page)
AW.deriveNodeState = function (nodesFlat, progress) {
  var stars = (progress && progress.stars) || {};
  var chests = (progress && progress.chests) || {};
  return nodesFlat.map(function (node, idx) {
    var state;
    if (node.chest) {
      var prev = nodesFlat[idx - 1];
      var prevHasStars = prev && stars[prev.id];
      if (!prevHasStars) { state = 'locked'; }
      else { state = chests[node.id] ? 'done' : 'available'; }
    } else if (stars[node.id]) {
      state = 'done';
    } else {
      var locked = false;
      for (var i = 0; i < idx; i++) {
        if (nodesFlat[i].chest) continue;
        if (!stars[nodesFlat[i].id]) { locked = true; break; }
      }
      state = locked ? 'locked' : 'active';
    }
    return { id: node.id, state: state };
  });
};
```

**How learn.html calls it** (build `flat` from the ported `UNITS`, pass the live snapshot):

```javascript
var flat = [];
UNITS.forEach(function (u) { u.nodes.forEach(function (n) { flat.push(n); }); });
var states = AW.deriveNodeState(flat, AW.state());   // [{id, state}]
// map state → data-state: done→'mastered', active/available→'progress', locked→'not-yet'
```

**`AW.state()` shape** (`shared/awba-engine.js:373-382`) — the ONLY read surface (D-24); never touch raw `awba_*` keys:

```javascript
AW.state = function () {
  return {
    noor: AW.S.get('noor', 0), returns: AW.S.get('returns', 0),
    stars: AW.S.get('stars', {}), days: AW.S.get('days', []),
    lastDay: AW.S.get('lastDay', null), chests: AW.S.get('chests', {}),
  };
};
```

**Ported `UNITS` flat order (CNT-03 unlock sequence, from Gen-3 `_MVP-BUILD/learn.html:119-151`):**
`u1m1→u1m2→u1m3→u1m4→u1r→u1c → u2m1→u2m2→u2m3→u2m3b→u2r→u2c → u3m1→u3m2→u3m3→u3r→u3c → u4m1→u4m2→u4m2b→u4m3→u4r→u4c`. Node `id`/`href`/`label` port verbatim; **drop the `color` field**; hrefs are `lessons/u1-m1.html` / `reviews/u1-review.html` (root-relative — learn.html is at root, so no `../`, exactly as Gen-3's already were).

---

### `learn.html` — node grammar: thermal `data-state` shapes (LRN-02/04, D-54)

**Analog A — the shipped shape grammar (consume, don't restyle):** `shared/awba-engine.css:341-343` (token map, `@layer base`) + `:858-875` (shapes, `@layer components`):

```css
/* @layer base :341 — colour token per state (secondary channel) */
[data-state="not-yet"]  { --st: var(--powder); }
[data-state="progress"] { --st: var(--ember);  }
[data-state="mastered"] { --st: var(--gold);   }
/* @layer components :858 — SHAPE is the primary channel (colour-blind + contrast safe) */
[data-state="not-yet"] { border: 2px solid var(--ink-62); background: transparent; }
.reg-orbit [data-state="not-yet"] { border-color: var(--powder); }          /* powder is home on dark */
[data-state="progress"] { border: 2px solid var(--st);
  background: linear-gradient(90deg, var(--st) 50%, transparent 50%); }       /* the ember half-dab */
[data-state="mastered"] { border: 0; background: var(--gold); color: var(--kiswah); }  /* filled + dark check glyph */
.reg-orbit [data-state="mastered"] { box-shadow: none; }
```

**Analog B — the per-dab sizing shell + how a runner emits `data-state` dabs:** `shared/awba-engine.css:977-984` (`.ls-dab`) and the runner's `paintProg()` at `shared/awba-engine.js:1717-1725`:

```javascript
// shared/awba-engine.js:1717 — paintProg(): the exact "map state → data-state span + check glyph" idiom the node grid mirrors
for (var i = 0; i < steps; i++) {
  var state = i < stepIndex ? 'mastered' : (i === pos ? 'progress' : 'not-yet');
  dabs += '<span class="ls-dab" data-state="' + state + '">' + (state === 'mastered' ? AW.icon('check') : '') + '</span>';
}
```

New `@layer screens` node classes (`.node` / `.node-thermal` sizing shell, `.noderow` winding offsets) are Claude's-discretion geometry — but the coloured/shape chrome is 100% the shipped `[data-state]` rules above. Review nodes add `.rosette` (see Festival below); chest nodes render the `.plate`-framed gift node.

**Glyphs (all shipped in `AW.GLYPHS`, `shared/awba-engine.js:865-892` — use `AW.icon(name)`, never re-author):** `star`, `trophy`, `lock`, `spark`, `flame`, `check`, `chest`. **Do NOT add a speaker glyph** — `components.test.js` freezes `glyphCount===13` (Pitfall 6). Unit scene icons via `AW.UNIT_ICON` (`shared/awba-engine.js:859`): `{u1:'compass', u2:'lanterns', u3:'kaaba', u4:'mosque'}`, rendered through `AW.icon()`.

---

### `learn.html` — the winding path: SVG thread + earned gold re-ink (LRN-04, D-54)

**Analog — the earned-portion gold re-ink is the SHIPPED `.thread` toggled onto a sub-path.** Precedent: the review runner's arc row toggles `.thread` onto lit arcs (`shared/awba-engine.css:1639-1656`):

```css
/* shared/awba-engine.css:1639 — "lit i<correct by toggling the SHIPPED .thread onto the arc path" */
.rv-arc path:not(.thread) { fill: none; stroke: var(--navy); stroke-width: 2; stroke-linecap: round; }
/* the .thread class (:890) supplies stroke:var(--gold) + animation:ink-draw */
```

**The `.thread` primitive + its keyframe (`shared/awba-engine.css:890-896` + `:1781-1785`):**

```css
.thread { fill: none; stroke: var(--gold); stroke-width: 2; stroke-linecap: round;
  animation: ink-draw var(--dur-draw) var(--ease) both; }
@keyframes ink-draw { from { stroke-dashoffset: var(--len); opacity: 0; } 8% { opacity: 1; } to { stroke-dashoffset: 0; opacity: 1; } }
```

**Pattern (RESEARCH Pattern 1):** one relative `.path` container per unit; nodes are real DOM `<button>`s (keyboard-focusable + `getBoundingClientRect`-anchorable) laid with alternating offsets; an absolutely-positioned `pointer-events:none` inline `<svg>` draws ONE thread `<path>` between node centres, recomputed after layout on `load` + `resize`/`ResizeObserver`. The earned sub-path carries `.thread` with `stroke-dasharray`/`--len` set to the earned fraction. **On learn-page load the earned gold is STATIC** (law 9 — no replay; consistent with the Ring). Do NOT hand-roll a fill animation.

---

### `learn.html` — Ring hero, STATIC on load (D-53/D-57, law 9)

**Analog — the reward runner's Ring moment, minus the draw:** `shared/awba-engine.js:2080-2089` shows the ONLY place a draw is legitimate (lesson-complete). learn.html copies the caller but **omits `animateFrom`** so it renders fully static:

```javascript
// learn.html — Ring hero: static-final (NO animateFrom → no replay; the draw belongs to lesson-complete only)
var st = AW.state();
var atomsDone = AW.atomsDone(st);                         // NEW seam (see engine seams below)
document.getElementById('ringHost').innerHTML = AW.ringSVG({ atomsDone: atomsDone, size: 300 });
document.documentElement.style.setProperty('--dawn', String(AW.skyDawn(atomsDone)));
```

Ring wrapper CSS is shipped (`shared/awba-engine.css:1789` `.ring`; the reward frame `.rw-ring .ring` at :1500 caps width — learn's own `@layer screens` hero frame mirrors it).

---

### `learn.html` — daily ayah under scripture law (LRN-05 / D-59)

**Analog — the `.scard` scripture card:** `shared/awba-engine.css:1111-1131` (`.scard` sets `--go:0` = no grain over scripture; `.scard .ayah` = strongest ink):

```css
.scard { --go: 0; padding: var(--sp-6); background: var(--cream); border-radius: var(--r-4);
  box-shadow: var(--keyline); display: flex; flex-direction: column; gap: var(--sp-4); }
.scard .ayah { color: var(--kiswah); margin: 0; }   /* strongest ink, full opacity, no ramp (law 3) */
```

**The `.ayah` face + the ONE permitted glow (`shared/awba-engine.css:386-406`)** — on the Orbit DARK ground the ayah takes cream/moonmilk strongest ink + `text-shadow:0 0 24px rgba(244,240,247,.30)` (the glow rule is scoped to dark grounds). Amiri Quran, `lang="ar" dir="rtl"`, `unicode-bidi:isolate`, lh 1.9, `letter-spacing:0`.

**DAILY pool — SPLICE byte-verbatim from Gen-3 `_MVP-BUILD/learn.html:153-160`** (the 7 verses; ˹ ˺ brackets intact; splice, never retype). Rotation via the new `AW.dailyIndex` seam (below) — the Gen-3 `getDate() % DAILY.length` bug (`_MVP-BUILD/learn.html:192`) is retired.

**Tap → full cite sheet:** reuse `AW.sheetRef`-style face-split (`shared/awba-engine.js:1051-1068`). The DAILY verses are Qur'an (no `grade`) → Amiri Quran + only the `unverified · pending review` pill, no grade pill. **Never** stamp a `view-transition-name` on the ayah, the cite ayah, or the Ibrahim line (D-58). Nothing celebratory adjacent (no `.dab`/`.thread`/`.plate`/`.rosette` in or beside the card — grep-gated).

---

### `learn.html` — node popup: cream slip, mounted on `document.body` (LRN-03, R-4, Pitfall 3)

**Analog A — mount-on-body precedent (why it must NOT append inside `.reg-orbit`):** `AW.sheet` — `shared/awba-engine.js:998-1039`. The sheet works because it appends `scrim` to `document.body` (OUTSIDE `.reg-orbit`), so its `.btn` resolves to the default Page-crimson fill. If the popup were appended inside `.reg-orbit`, `.reg-orbit .btn` (`shared/awba-engine.css:672`, cream-on-cream) would make its CTAs invisible.

```javascript
// shared/awba-engine.js:1009 — the body-append + outside-tap + Esc + scroll-lock pattern the popup borrows
scrim = document.createElement('div'); scrim.className = 'scrim';
document.body.appendChild(scrim);                                   // OUTSIDE .reg-orbit — the exemption done right
scrim.addEventListener('click', function (e) { if (e.target === scrim) api.close(); });
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') api.close(); });
// open(): document.documentElement.classList.add('sheet-lock');   // scroll-lock
```

**Analog B — the anchoring algorithm (`placePop`), ported from Gen-3 `_MVP-BUILD/learn.html:243-252`** (measure node centre, clamp popup centre into the viewport, offset the arrow via `--ax`). On gen-4, adapt to `position:fixed` + `getBoundingClientRect` (scroll-aware) since the popup mounts on `body`, not inside the node row:

```javascript
// Gen-3 _MVP-BUILD/learn.html:243 — the algorithm to port (arrow follows the node even when the body is clamped)
function placePop(pop, el) {
  var half = pop.offsetWidth/2 || 115;
  var nx = el.offsetLeft + el.offsetWidth/2;                    // gen-4: use getBoundingClientRect centre (fixed positioning)
  var cx = Math.max(half+6, Math.min(row.clientWidth-half-6, nx));
  pop.style.left = cx + 'px';
  pop.style.setProperty('--ax', (nx - cx) + 'px');             // arrow offset
}
document.addEventListener('click', function (e) {              // outside-tap close (ignores .npop/.node)
  if (openPop && !e.target.closest('.npop') && !e.target.closest('.node')) closePop();
});
```

New `.npop` class goes in `@layer screens` (cream `--r-3`, `--sh-2` shadow, arrow `:after` using `--ax`). Popup CTAs are the shipped `.btn` (default Page crimson, `shared/awba-engine.css:655`). Popup copy is in UI-SPEC §Copywriting (START/REVIEW/LEGENDARY + noor hints; locked = gentle "not yet", no CTA).

---

### `learn.html` — chest claim: idempotent +25 noor (RWD-04 / D-56)

**Analog — the write-once guard against `AW.S`; Gen-3 `_MVP-BUILD/learn.html:231-238` behaviour, re-homed onto the `chests` slot** (`awba_chest_*` already migrates → `chests` — verified `state-storage.test.js` asserts `{u1c:true}`):

```javascript
// UI-SPEC S5 / RESEARCH Pattern 3 — deterministic, exactly once, never randomized
var chests = AW.state().chests;               // defensive copy
if (!chests[nodeId]) {                         // write-once guard
  chests[nodeId] = true; AW.S.set('chests', chests);
  AW.S.set('noor', AW.S.get('noor', 0) + 25);  // +25 exactly once
  // → open the Festival interstitial (S5); learn screen stays Orbit
} // else: the "already opened — the light stayed with you" popup
```

**Festival interstitial primitives (S5) — all shipped:** `.plate` (`shared/awba-engine.css:897-909`, `stamp` verb `--dur-stamp` 150ms), `.rosette` (`:910-921`), the `@keyframes stamp` (`:1770-1774`), the `.reg-festival` ground (`:294-307`), and the crowd-arrival `.dab` drift — precedent `.rv-ringdabs` (`shared/awba-engine.css:1563-1578`, six `.dab`s arriving around a ring via `drift`). Rakkas (`--fs-festival`) is valid ONLY inside this Festival threshold, never on the Orbit learn screen (law 5 rationing — Aref Ruqaa is on the learn screen).

---

### `learn.html` — HUD marginalia + mute toggle + streak constellation + sheets + tabs (LRN-01/06/07, D-60)

**Analog — the HUD row + mute toggle:** `AwbaLesson`'s `setHUD()` at `shared/awba-engine.js:1704-1714` shows the exact `.ls-hud`/`.hstat`/`muteBtnHtml()`/`bindMuteBtn()` idiom the learn HUD mirrors:

```javascript
// shared/awba-engine.js:1704 — HUD marginalia: .hstat spark/flame + the shared mute toggle
var stats = '<span class="ls-stats">' +
  '<span class="hstat">' + AW.icon('spark') + '<span>' + (AW.S.get('noor',0) + noorEarned) + '</span></span>' +
  '<span class="hstat">' + AW.icon('flame') + '<span>' + AW.S.get('returns',0) + '</span></span>' +
  '</span>';
hudEl.innerHTML = stats + muteBtnHtml();       // ← learn.html calls AW.muteBtnHtml() (NEW export, see seams)
bindMuteBtn(function () { setHUD(hudStats); }); // ← learn.html calls AW.bindMuteBtn(refresh)
```

`.ls-hud`/`.hstat` CSS is shipped (`shared/awba-engine.css:948-963`, `:754-770`); `.reg-orbit .hstat { color: var(--paper-62) }` (`:767`) already handles the dark ground — no override needed for the HUD (the crimson problem is only the `.tab.active`, below).

**Analog — the streak constellation from `AW.weekCal()`** (`shared/awba-engine.js:417-429`, DOM-free `[{label,on}]`) rendered as the shipped `.weekcal .day`/`.day.here` presence dots (`shared/awba-engine.css:1451-1463`, `on` → gold `.here`, never a gap/miss). learn.html maps `weekCal()` to the constellation row (Sky's streak-as-constellation as TOKENS on the Orbit ground).

**Analog — every sheet rides the ONE `AW.sheet` singleton** (`shared/awba-engine.js:1033-1042`): streak / noor / course-switcher / tab coming-soons. Sheet copy ports verbatim from Gen-3 `_MVP-BUILD/learn.html:272-303`. `.sheet-row` press is shipped (`shared/awba-engine.css:833-838`); `.grip` at `:508`.

```javascript
// UI-SPEC S4 — course switcher / coming-soon, all on one AW.sheet call
AW.sheet('<div class="grip"></div>' +
  '<div class="sheet-row">Aqeedah · Level 1 … ACTIVE</div>' +
  '<div class="sheet-row off">Fiqh · Level 1 … COMING SOON</div>' + /* … */ '');
```

**Analog — tab bar + the crimson-on-Orbit fix (Pitfall 4 / R-5).** Shipped `.tab`/`.tab.active` (`shared/awba-engine.css:733-753`) inks crimson (2.65:1 on Kiswah — BANNED). The fix mirrors the shipped `.rv-shell` gold-override precedent (`shared/awba-engine.css:1686-1688`, which re-inks the Orbit press to gold). Add to `@layer screens` (OVERRIDE, never edit the shipped rule):

```css
/* @layer screens — gold 8.40:1 on Kiswah; mirrors .rv-shell .opt:active{border-color:var(--gold)} precedent */
.reg-orbit .tab.active { color: var(--gold); }
.reg-orbit .tab.active { box-shadow: inset 0 2px 0 var(--gold); }   /* re-ink the 2px top-rule gold */
```

Every inactive tab opens a designed coming-soon `AW.sheet` (Returns → the streak sheet — one implementation); never a dead tap.

---

### `learn.html` — navigation wiring + the shared-element VT morph (D-61, MOT-02 / D-58 / S6)

**Analog — the shipped opener square that receives the morph:** the lesson runner renders `.journey` (`shared/awba-engine.css:1013-1026`, the Aref-Ruqaa Farag square) as the opener. The morph pairs the tapped learn node's Farag square → this `.journey` square. Handlers live in `shared/awba-engine.js` (shared, covers all pages), guarded like the existing boot-stamp (js:471):

```javascript
// shared/awba-engine.js (new block, guarded by typeof document) — RESEARCH Pattern 4
window.addEventListener('pageswap', function (e) {
  if (!e.viewTransition) return;                          // null over file:// / unsupported → plain nav (Pitfall 2)
  if (window.__awbaMorphEl) window.__awbaMorphEl.style.viewTransitionName = 'circuit-term';
});
window.addEventListener('pagereveal', function (e) {
  if (!e.viewTransition) return;
  var opener = document.querySelector('.journey');        // the shipped opener square
  if (opener) opener.style.viewTransitionName = 'circuit-term';
  // clear after finished so successive navigations never collide (uniqueness: two same-named els abort the VT)
});
```

learn.html sets `window.__awbaMorphEl` to the tapped node's square at click time. `#<node-id>` hash honoured on load (D-61) — **match against the known `UNITS` id set before use; never interpolate the raw hash into markup** (RESEARCH §Security V5).

---

### `shared/awba-engine.js` — the four engine seams (transform helpers + two exports)

**Analog — sibling pure helpers in the SAME file define the idiom** (`AW.skyDawn` js:1350-1356, `AW.deriveNodeState` js:439, `AW.weekCal` js:417). New seams follow it: DOM-free, `AW.*`, defensively floored.

**Seam 1 — `AW.dailyIndex(date, poolLen)`** (LRN-05; mirror `AW.skyDawn`'s pure-helper shape; day-of-YEAR from LOCAL parts, D-16 — never `toISOString`/`new Date(ymdString)`):

```javascript
AW.dailyIndex = function (date, poolLen) {
  var d = date || new Date();
  var start = new Date(d.getFullYear(), 0, 0);
  var cur   = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  var doy   = Math.round((cur - start) / 86400000);   // 1..366, local
  return ((doy % poolLen) + poolLen) % poolLen;        // safe modulo
};
```

**Seam 2 — `NODE_ATOMS` map + `AW.atomsDone(progress)`** (D-57 / R-1; sum only starred nodes; "one constant, one place"). The verbatim per-node counts are in RESEARCH §Atom Map (u1m1:3, u1m2:4, u1m3:5, u1m4:5, u2m1:5, u2m2:4, u2m3:3, u2m3b:3, u3m1:4, u3m2:5, u3m3:5, u4m1:3, u4m2:4, u4m2b:4, u4m3:4 = **61 total**). `AW.atomsDone(progress)` = Σ `NODE_ATOMS[id]` over ids present in `progress.stars`.

**Seams 3+4 — expose the module-private mute helpers** (Pitfall 6 — they already close over `SPEAKER_ON/OFF` + `AW.prefs`; two one-liners after `bindMuteBtn` at js:1657):

```javascript
AW.muteBtnHtml = muteBtnHtml;   // shared/awba-engine.js:1642 — currently file-scope only
AW.bindMuteBtn = bindMuteBtn;   // shared/awba-engine.js:1648
```

**Atom-denominator re-wire (R-1 — 65→61, THREE touch-points + one boot proxy).** These are edits to EXISTING code, not new seams:
- `AW.ringSVG` `DEF_STRUCT` — `shared/awba-engine.js:1153` (`atoms: 65` → `61`) and its callers pass `AW.atomsDone(st)` instead of the `ATOMS_PER_NODE=3` proxy.
- `AW.skyDawn` `SKY_ATOMS` — `shared/awba-engine.js:1351` (`SKY_ATOMS = 65` → `61`). ⚠️ `sky.test.js:101-108` asserts `/65` scaling and `skyDawnAt(65)===0.6` — those assertions must move to `/61` in the same wave, or the suite goes red.
- The reward runner's `ATOMS_PER_NODE = 3` proxy — `shared/awba-engine.js:1687-1688` + `:2084` — replace with the real `NODE_ATOMS` map so lesson-complete inks the true frontier. ⚠️ `ring.test.js` "of 65" assertions + `preview.html`'s hard-coded `atomsDone` also move.
- The boot `--dawn` proxy — `shared/awba-engine.js:505-507` (`ATOMS = 65, TOTAL_NODES = 19` proxy) — re-wire to `AW.atomsDone(AW.state())` / `61`.

> **A1 is a LOCKED decision (61), per UI-SPEC R-1 — not a free choice.** Do the 65→61 sweep as ONE atomic wave so no test is left asserting the old denominator.

---

### `scripts/tests/learn-state.test.js` (NEW) — pure-helper assertions (CNT-03/D-57/LRN-05/RWD-04)

**Analog — the `loadEngine`/`makeLS` harness header:** `scripts/tests/sky.test.js:11-29` (fresh engine load per probe; probe assigns `globalThis.__out`) + `scripts/tests/ls-stub.js:45-52` (`loadEngine(ls, probeSrc)` concatenation contract).

```javascript
// header — copy verbatim from sky.test.js:11-18
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { makeLS, loadEngine, readOut } = require('./ls-stub');
// per-assertion probe idiom (sky.test.js:24-28):
//   'globalThis.__out = AW.dailyIndex(new Date(2026,0,8), 7);'  → loadEngine(makeLS({}), probe).__out
```

**Chest-idempotency fixture idiom — `scripts/tests/state-storage.test.js:26-56`** (seed `awba_chest_u1c`, drive `AW.S`, assert `{u1c:true}` + no double-count). CNT-03 unlock walk = drive `AW.deriveNodeState(flat, {stars, chests})` over the real `UNITS` map with staged fixtures; assert the exact locked→active→done + chest-after-review transitions. LRN-05 = `AW.dailyIndex(new Date(y,0,8),7) !== AW.dailyIndex(new Date(y,1,8),7)` (Jan-8 vs Feb-8 — the exact Gen-3 monthly-repeat bug). D-57 = `Σ NODE_ATOMS === 61` and `AW.atomsDone({stars:{u1m1:3}}) === 3`.

> **Machine note:** run via glob only — `node --test scripts/tests/*.test.js` (never a bare file arg in the suite run). File name per prompt: `scripts/tests/learn-state.test.js`.

---

### `scripts/tests/render-smoke.mjs` (MOD) — scan root `learn.html` (Pitfall 7)

**Analog — the file itself:** `findPages()` at `scripts/tests/render-smoke.mjs:35-45` walks only `lessons/` + `reviews/`. Extend to push root `learn.html`:

```javascript
// render-smoke.mjs:35 — add the root page to the discovery list (regex REGISTER_ROOT_RE already matches reg-orbit)
function findPages() {
  const pages = [];
  const rootLearn = path.join(ROOT, 'learn.html');
  if (existsSync(rootLearn)) pages.push(rootLearn);          // NEW
  for (const dir of ['lessons', 'reviews']) { /* …unchanged… */ }
  return pages;
}
```

Optionally add the MOT-02 `file://` no-error nav check (learn→u1-m1) — `loadInChrome()` already captures `SEVERE`/`Uncaught`; a clean `file://` load proves the `e.viewTransition` guard doesn't throw (A3).

---

### DAILY-pool byte-fidelity — extend `scripts/port-audit.mjs` (D-59)

**Analog — `CFG_RE` + `sha256()` splice-vs-source compare:** `scripts/port-audit.mjs:41-84`. Apply the same shape to the DAILY pool: SHA-256 the spliced 7-verse region in `learn.html` against the byte-identical region in `_MVP-BUILD/learn.html:153-160`.

```javascript
// port-audit.mjs:43 — the fidelity idiom to reuse for the DAILY splice
function sha256(str) { return createHash('sha256').update(str, 'utf8').digest('hex'); }
// define a DAILY_RE that captures the `const DAILY=[ … ];` region in both files; assert equal SHA (BYTES OK / BYTES DRIFT)
```

`SOURCE_ROOT = '/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD'` is already defined (`port-audit.mjs:37`). Note: `port-audit.mjs` currently lists only `lessons/`+`reviews/` (`:104`) — the DAILY check is a separate root-file compare, so add it as its own function, not via `listPages`.

---

## Shared Patterns

### Register-as-component exemption (cream Page object over the Orbit world)
**Source:** `AW.sheet` — `shared/awba-engine.js:998-1039` (append `scrim` to `document.body`, outside-tap + Esc close, `html.sheet-lock` scroll-lock).
**Apply to:** the node popup (R-4) AND every sheet. The rule: a cream object mounts on `body`, NEVER inside `.reg-orbit`, so its `.btn` resolves to Page-crimson (`shared/awba-engine.css:655`) not the invisible `.reg-orbit .btn` cream-on-cream (`:672`).

### The one motion vocabulary + dual reduced-motion trigger
**Source:** `@layer motion` — `shared/awba-engine.css:1729-1821`. One `--ease` family (`:158`); UI durations ≤300ms (`:160-166`); ambients 4–6s STOPPED (not spun) under reduce; both triggers (`@media prefers-reduced-motion` at `:1807` AND `[data-motion="reduce"]` at `:1814`) share rule bodies.
**Apply to:** every new ambient (the single `active`-node breathe, node-entrance settle/drift, ayah fade). The VT reduced-motion kill block joins THIS layer:
```css
/* @layer motion — beside the shipped reduced-motion guards; !important beats the UA cross-fade regardless of layer */
@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) { animation: none !important; }
}
[data-motion="reduce"] ::view-transition-group(*),
[data-motion="reduce"] ::view-transition-old(*),
[data-motion="reduce"] ::view-transition-new(*) { animation: none !important; }
```
The `@view-transition { navigation: auto; }` opt-in itself is a **top-level at-rule high in the file, immediately after the `@layer` order line at :16** (Pitfall 1) — NOT inside a layer. **NEVER re-declare the `@layer tokens, base, components, screens, motion;` order line at `shared/awba-engine.css:16`** (D-04 project law) — add content to `@layer screens`/`@layer motion` only.

### Icon / glyph accessor (single source, frozen count)
**Source:** `AW.icon(name, opts)` — `shared/awba-engine.js:927`; `AW.GLYPHS` (13, `:865-892`), `AW.KIT` (20), `AW.UNIT_ICON` (`:859`).
**Apply to:** every icon on the page. Never inline raw SVG or re-declare Gen-3 `IC_*`/`AW.LANTERN`. **Do not add a 14th glyph** (`components.test.js` freezes `glyphCount===13`).

### Storage read/write surface (D-24)
**Source:** `AW.state()` (`shared/awba-engine.js:373`, read snapshot) + `AW.S.get/set` (`:57`, the only localStorage surface). Migration (`awba_*` → slots) is lossless + verified (`state-storage.test.js`).
**Apply to:** all reads (via `AW.state()`); writes ONLY `chests` + `noor` (chest claim) and `ringSeed` (lazy). No new keys, no schema bump.

### Gated literals — never in `shared/` (comments included)
**Apply to:** every `shared/` edit. Forbidden substrings: `poppins`, `confetti`, `amber`, `rgba(37,54,`, `--accent`, `lantern-gold`, `PERFECT`, `class="combo"`, `gold-bg`, `fonts.googleapis`. (`port-audit.mjs:114-123` already gates `fonts.googleapis`/`confetti`/`class="combo"`/`poppins` on the ported pages.)

---

## No Analog Found

None. Every Phase-5 surface maps to a shipped in-repo analog — the winding-path GEOMETRY is the only discretionary design surface, but even its ink-draw/thread primitives, node shapes, and popup mechanics are shipped (RESEARCH §Summary: "composition-and-wiring phase, not a new-primitives phase"). The plant-stamp doodle pool is the one deferrable asset (D-55 / R-3 fallback: ship seed-rows + a single sprout glyph in v1; full ~20-doodle pool = fast-follow — planner decides the wave split).

---

## Metadata

**Analog search scope:** `shared/awba-engine.js` (state/migration, deriveNodeState, weekCal, sheet family, icon/glyph registries, mute helpers, ringSVG/skyDawn, lesson+review runners), `shared/awba-engine.css` (layer order, tokens/durations, registers, thermal, scripture law, sheet/press/celebration primitives, `@layer screens`, `@layer motion`), `lessons/u1-m1.html`, `reviews/u1-review.html`, `preview.html` (head), `scripts/tests/{sky,state-storage,state-helpers}.test.js`, `scripts/tests/{ls-stub.js,render-smoke.mjs}`, `scripts/port-audit.mjs`, and `/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD/learn.html` (Gen-3 behaviour, read in full).
**Files scanned:** ~14.
**Pattern extraction date:** 2026-07-13.
