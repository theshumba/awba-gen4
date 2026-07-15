# R1 — shared/awba-engine.js: exhaustive reference

File: `/Users/theshumba/Documents/GitHub/awba-gen4/shared/awba-engine.js` (2596 lines, ONE classic script, `const AW = {}` at top-level, loaded via `<script src="../shared/awba-engine.js">` — never a module, never defer/async).

Load order matters: this file MUST load before any lesson/review data file or before any page-inline script that calls `AW.*`. It works `file://`-double-clicked by design.

---

## 1. Full public `AW.*` API surface

### Storage (the ONLY code allowed to touch `localStorage` — D-24, grep-gated at exactly 13 occurrences of the literal word `localStorage` in this file, confirmed by direct count)

- **`AW.S`** — IIFE closure over `awba_state` (schemaVersion 1). Methods:
  - `AW.S.get(key, default)` → lazily loads (`load()`) into module-private `mem` on first call; returns a **defensive copy** (via `structuredClone` or JSON round-trip) of `mem[key]` if present and not `undefined`, else `default`. Never returns a live reference for object/array values.
  - `AW.S.set(key, value)` → lazily loads, mutates `mem[key] = value`, then `persist(mem)` (re-serializes the WHOLE blob) — **unless** `memFallback` is true (see below), in which case the write is silently NOT persisted (session-only).
  - `AW.S.isFallback()` → returns `memFallback` (boolean). Ensures `load()` ran first. Read-only diagnostic for "progress not saving" UI.
  - Internal: `defaultState()` = `{ schemaVersion: 1, noor: 0, returns: 0, lastDay: null, days: [], stars: {}, chests: {} }`.
  - `migrations[]` array is the seam for future schema bumps; empty at v1. `runMigrations` has a 50-iteration guard (throws past it).
  - Legacy Gen-3 migration (`migrateFromLegacy()`) reads flat keys `awba_noor`, `awba_returns`, `awba_lastDay`, `awba_days`, `awba_stars`, and enumerates `awba_chest_<id>` keys via `localStorage.length`/`.key(i)` (NOT `Object.keys` — must work against real Storage, portable). Legacy keys are **never deleted** (D-15). Migration writes the new blob **once**.
  - `memFallback` (W1): if the persisted `awba_state` blob has a missing/non-numeric/**greater-than-CURRENT** schemaVersion but is still a plain object, the loader works from an **in-memory COPY** and sets `memFallback = true`, so ALL `AW.S.set()` calls for the rest of the session silently skip persist — this protects a newer build's blob from being clobbered by an older build. This is SESSION-WIDE, not per-write.

- **`AW.prefs`** — separate IIFE closure over `awba_prefs` (schemaVersion 1, own key, NEVER mixed with `awba_state`). `get(key, default)` / `set(key, value)`, no defensive copy (values are flat/primitive). `defaultPrefs()` = `{ schemaVersion: 1, soundMuted: false, motion: 'system', prayerTimes: skyDefaultTimes(), skyMode: 'manual' }`. CURRENT is deliberately NOT bumped when Sky fields were added — absent keys just resolve to their `default` arg.

- **`AW.todayStr()`** → `toLocalYMD(new Date())`, i.e. today's local date as `"YYYY-MM-DD"`.

- **`AW.state()`** → one-read snapshot: `{ noor, returns, stars, days, lastDay, chests }`, each read via `AW.S.get`. Mutating the returned object is safe (defensive copies already).

- **`AW.touchDay()`** → the mercy-streak engine. Call on lesson/review "begin" (NEVER on page load). If `lastDay !== today`: `returns++`, persists `returns` and `lastDay`, and pushes today into `days` (deduped, capped to last 90 via `.slice(-90)`). Returns the new `returns` count.

- **`AW.greetMode()`** → `'first'` (no lastDay) | `'streak'` (day diff ≤ 1) | `'returning'` (diff > 1). Diff computed from **local** midnight dates only (never UTC).

- **`AW.weekCal()`** → DOM-free Mon–Sun week array: `[{label:'Mo'..'Su', on:boolean}, ...7]`, `on` = that date is in `days[]`.

- **`AW.deriveNodeState(nodesFlat, progress)`** — PURE (no storage). `nodesFlat`: flat array of `{id, chest?}` course nodes in course order. `progress`: `{stars, chests}`. Returns `[{id, state}]` where `state` ∈ `locked|active|done|available`:
  - Chest node: `available` if immediately-preceding node has stars and chest unopened; `done` if opened; else `locked`.
  - Lesson/review node: `done` if has a star entry; else `active` if EVERY prior non-chest node has stars (strictly linear, whole course); else `locked`.

- **`AW.atomsDone(progress)`** — PURE. `Σ NODE_ATOMS[id]` over every id present in `progress.stars` (review/chest ids contribute 0, absent from the map). `NODE_ATOMS` (module-private var, NOT on `AW`) is the 15-lesson-id → taught-atom-count map (see §4). This is THE canonical "atoms done" computation — every Ring/Sky caller uses it, never a node-count proxy.

- **`AW.dailyIndex(date, poolLen)`** — PURE. Day-of-YEAR (local) modulo `poolLen`, safe modulo (handles any poolLen). Fixes a Gen-3 bug that used day-of-MONTH (repeated every ~28-31 days).

- **`AW.skyTemp`** = `skyTemp(now, times, mode)` — pure, `mode 'off'` ⇒ always `'day'`; else buckets local clock into `lastthird|dawn|day|dusk|night` against `{fajr,dhuhr,asr(unused),maghrib,isha}` HH:MM strings. `asr` is stored in prefs.prayerTimes but not used by skyTemp's bucketing.

- **`AW.skyDawn`** = `skyDawn(atomsDone)` — pure, `min(0.6, atomsDone/61)`. Feeds `--dawn` CSS var.

- **`AW.icon(name, opts)`** — the ONE a11y icon accessor. Looks up `AW.KIT[name]` first, then `AW.GLYPHS[name]`; unknown/malformed → `''` (never throws). `opts.label` → `role="img" aria-label="…"` (escaped); no label → `aria-hidden="true" focusable="false"`. `opts.size` → inline `style="width:…;height:auto"`. Injects attrs right after the FIRST `<svg` only (string-replace, not regex — safe against nested `<svg>`).

- **`AW.cite(id, label)`** → `'<span class="cite" data-ref="ID">' + AW.icon('cite') + escapeHtml(label) + '</span>'`. Byte-preserved shape — the `data-ref="…"` attribute is what `scripts/validate-content.js`'s regex `/data-ref=["']([^"']+)["']/g` and the real `AW.wire` click-binder both match. `id` is NOT escaped (author slug, left verbatim).

- **`AW.wire(root, cfg)`** — binds `.cite[data-ref]` clicks → `AW.sheetRef(cfg.refs||{}, id)`, `.term[data-term]` clicks → `AW.sheetTerm(cfg.terms||{}, id)`. Call after inserting rendered HTML into `root`.

- **`AW.reducedMotion()`** → true if OS `matchMedia('(prefers-reduced-motion: reduce)')` matches OR `<html data-motion="reduce">` (the in-app override the boot-stamp sets from `AW.prefs.get('motion')`). Guarded for headless (no window/document).

- **`AW._trapFocus(overlayEl)`** → returns `untrap()`. Tab-key containment on the overlay itself (keydown listener on `overlayEl`, not `document`). Focusable selector: `'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'`, filtered by `getClientRects().length > 0` (works for `position:fixed` where `offsetParent` is null).

- **`AW.sheet(html, label)`** — singleton bottom-sheet IIFE, callable directly: `AW.sheet(html, label)` opens and returns the `api` (chainable). `AW.sheet.close()` also works (`open.close = api.close`). Lazily creates `.scrim > .sheet[role=dialog][aria-modal=true]` on `document.body`. Outside-tap and Escape close it. `AW.sheetClose()` is a thin top-level wrapper for `AW.sheet.close()`.
  - `open(html, label)`: replaces content (`sheet.innerHTML = '<button class="sheet-x" aria-label="Close">×</button>' + html`), sets `aria-label` (default `"Details"`), locks scroll (`<html class="sheet-lock">`), moves focus into `.sheet-x`, wires `AW._trapFocus`. Captures invoker for focus-restore ONLY on a closed→open transition (content-replace on an already-open sheet keeps the original invoker).
  - `close()`: idempotent, disposes trap, unlocks scroll, restores focus to invoker.

- **`AW.sheetRef(refs, id)`** — citation sheet. `refs[id]` shape: `{ kind?, ref, ar, mean, src, grade? }`. No `grade` ⇒ Qur'an (`.r-ar ayah`, Amiri Quran face); `grade` present ⇒ hadith (`.r-ar`, general Amiri) + a `.r-pill.grade` pill. EVERY citation always also shows an `"unverified · pending review"` pill. Unknown id → no-op (`undefined`, no throw). Sheet's accessible name = `r.ref`.

- **`AW.sheetTerm(terms, id)`** — term-gloss sheet. `terms[id]` shape: `{ ar, tl, word, def, ctx }` (Arabic/transliteration/gloss-word/definition/context). Unknown id → no-op. Sheet's accessible name = `t.word`.

- **`AW.animate(el, keyframes, durToken, easeToken)`** — WAAPI wrapper. Reads `durToken`/`easeToken` (CSS custom-property NAMES, e.g. `'--dur-settle'`, `'--ease'`) off `getComputedStyle(document.documentElement)`; `durToken` parsed as `parseFloat(...) || 300`; `easeToken` used verbatim (a `linear(...)` string passes straight through). Self-guards `dur = 1` under `AW.reducedMotion()`. Returns the live `Animation` (`.finished` is awaitable).

- **`AW.ringSeed()`** — lazy accessor: reads `awba_state.ringSeed`; if absent, mints `(Math.random()*0x100000000)>>>0` and persists ONCE through `AW.S.set`. NOT part of `defaultState()` (a lazy field, not a schema bump — avoids rewriting legacy blobs).

- **`AW.ringSVG(cfg)`** — deterministic tawaf-ring SVG generator. `cfg`: `{ seed?, atomsDone, animateFrom?, circuitsDone?, size?, structure?:{circuits,lessons,atoms} }`. Defaults `structure` to `{circuits:4, lessons:15, atoms:61}` (each field independently falls back if missing/invalid — never NaN). `seed` defaults to `AW.ringSeed()`. `animateFrom` defaults to `atomsDone` (empty animate-span ⇒ fully static render — replay-safe). Uses `mulberry32(seed)` PRNG — SAME seed+progress always yields byte-identical markup; no `Date`/`Math.random` in the geometry path. Returns an inline `<svg class="ring" role="img" aria-label="Tawaf ring — N of M inked" data-seed="…" data-atoms="…" data-circuits="…">`. Colour-by-state: unfaint navy `#4A5C82` → ember `#E8502A` (in-progress lesson) → cream `#F3EDE2` (lesson done, circuit not sealed) → gold `#D9A441` (circuit sealed). A `.ring-thread` gold arc per completed circuit; a single static `.ring-head` gold dot at the inking frontier (absent entirely at 0 progress — no dabs[0] fallback).

- **`AW.icon`, `AW.KIT`, `AW.GLYPHS`, `AW.UNIT_ICON`** — see §5.

- **`AW.MLAB`** — `{ fact: 'Worth knowing', remember: 'Worth remembering', fard: 'The first duty', angle: 'Another angle' }` — marker-type → manuscript display label (ported from Gen-3; gen-4 does not ship a 5th marker glyph).

- **`AW.sound(cue)`** — `cue` ∈ `correct|incorrect|complete|streak`. No-ops if `AW.prefs.get('soundMuted', false)`. Otherwise `new Audio('../shared/sfx/' + cue + '.mp3').play().catch(()=>{})` — silently swallows missing file / autoplay-block / no Audio support. Path is relative to a page one level below `shared/` (i.e. `lessons/`, `reviews/`) — **a page at a different depth needs a different relative path or this breaks**.

- **`AW.muteBtnHtml`** = `muteBtnHtml()` — returns the shared 44px `<button class="ls-mute" id="lsmute" aria-pressed="…" aria-label="Mute/Unmute sounds">` HTML (speaker glyph inline SVG, currentColor). Reads `AW.prefs.get('soundMuted')`.
- **`AW.bindMuteBtn`** = `bindMuteBtn(refresh)` — finds `#lsmute` in the document, wires its click to flip `AW.prefs.soundMuted`, toggle `<html data-sound="muted">`, and call `refresh()` if given. **Assumes a specific DOM id `#lsmute`** — a new Practice/Profile/More page reusing this must render the exact `muteBtnHtml()` markup (or replicate the id) for `bindMuteBtn` to find it.

- **Runner math constants/helpers** (all on `AW`, pure): `AW.PER_LESSON` (12), `AW.REFLECT` (15), `AW.PER_REVIEW` (15), `AW.SWIFT` (5), `AW.QTIME` (14 — seconds), `AW.lessonStars(mistakes)`, `AW.comboShow(combo)`, `AW.comboPerfect(combo)`, `AW.reviewScore(inTime)`, `AW.reviewStars(correct,total,allInTime)`. See §3 for exact formulas.

- **`AW._beatHtml(it, cfg)`** — pure view dispatcher; dispatches on `it.t` to one of 9 beat-HTML builders (see §3). Returns `''` for unknown/missing `it`.

- **`AW._resolveScore(s, ok)`** — pure quiz-scoring reducer (Gen-3 byte-preserved). `s = {correct, combo, comboBest, mistakes, noorEarned}`. `ok=true` ⇒ `correct++, combo++, comboBest=max(comboBest,combo), noorEarned += AW.PER_LESSON(12)`. `ok=false` ⇒ `mistakes++, combo=0` (no noor lost, none gained on a miss).

- **`AW._noorClaimer()`** — factory returning `claim(amount)`. First call persists `AW.S.set('noor', AW.S.get('noor',0)+amount)` and returns `true`; every subsequent call is a no-op returning `false`. Guarantees noor credits exactly once per lesson/review session even across back/forward or double-taps.

- **`AW.announce(text)`** — the ONE body-level polite live region (`role="status" aria-live="polite" aria-atomic="true"` `<div class="aw-sr">`, direct child of `document.body`, lazily created/re-found so runner DOM wipes never destroy it). Sets `textContent` ONLY (never innerHTML — XSS-safe by construction). Re-announcing an IDENTICAL string clears then re-sets on next `requestAnimationFrame` (some SRs don't re-announce unchanged text).

- Globals NOT on `AW` but load-bearing: `globalThis.AW = AW` (test ergonomics — lets a headless test read `ctx.AW` after a separate vm run).

---

## 2. Storage schemas

### `awba_state` (key `'awba_state'`, `schemaVersion: 1`)
```
{
  schemaVersion: 1,
  noor: number,               // lifetime noor total
  returns: number,             // count of distinct days with activity ("streak" isn't consecutive-only — see touchDay/greetMode)
  lastDay: string|null,        // "YYYY-MM-DD" local, last day touchDay() fired
  days: string[],               // up to last 90 "YYYY-MM-DD" local dates with activity, deduped
  stars: { [nodeId]: 1|2|3 },  // best-of star rating per lesson/review id (never downgrades)
  chests: { [chestId]: true }, // opened chests
  ringSeed?: number,            // lazily added — 32-bit uint, minted once by AW.ringSeed()
}
```
Migration: Gen-3 legacy flat keys (`awba_noor`, `awba_returns`, `awba_lastDay`, `awba_days`, `awba_stars`, `awba_chest_<id>`) are read ONCE into this shape if no `awba_state` blob exists yet; legacy keys are never deleted. A blob with unrecognized/future schemaVersion is worked from an in-memory copy for the session (never overwritten on disk) — `AW.S.isFallback()` exposes this.

### `awba_prefs` (key `'awba_prefs'`, `schemaVersion: 1`)
```
{
  schemaVersion: 1,
  soundMuted: boolean,
  motion: 'system'|'reduce'|(other?),   // 'reduce' stamps <html data-motion="reduce"> at boot
  prayerTimes: { fajr:'HH:MM', dhuhr:'HH:MM', asr:'HH:MM', maghrib:'HH:MM', isha:'HH:MM' },  // default 05:00/13:00/16:30/19:30/21:00
  skyMode: 'manual'|'off',
}
```
No migration chain needed yet — new fields (prayerTimes/skyMode) were added WITHOUT a schema bump; `AW.prefs.get(k, default)` resolves the default for any key absent from an older persisted blob. **Any v2 addition to prefs should follow this same additive/no-bump pattern** unless a genuinely destructive reshape is needed.

**Dates are always LOCAL `YYYY-MM-DD`** — built from `getFullYear()/getMonth()+1/getDate()` (`toLocalYMD`), NEVER `toISOString()` or `new Date(ymdString)` (which parses as UTC midnight and silently shifts by the caller's UTC offset). Parsing back uses `parseLocalYMD` → `new Date(y, m-1, d)`. Any v2 code touching dates must reuse this exact pattern (or call `AW.todayStr()` directly).

---

## 3. AwbaLesson(cfg) / AwbaReview(cfg)

Both are **global functions** (not on `AW`), called inline by each lesson/review HTML data file: `AwbaLesson({...})` / `AwbaReview({...})`. Both `if (typeof document === 'undefined') return;` immediately (headless-safe no-op). Both **wipe `document.body.innerHTML`** at init and drive the whole page via `pos`/`qi` state machines — no other markup on those pages matters once these run.

### `AwbaLesson(cfg)` — cfg shape
```
{
  id: string,                 // REQUIRED — stars/chests key, e.g. "u1m1"
  unitColor: string,           // REQUIRED (validator-checked; inert in Athar — no register recolour)
  journey: string,             // REQUIRED — breadcrumb kicker text
  opener: { h2: string, p?: string, thought?: string },  // h2 REQUIRED
  terms: { [id]: {ar,tl,word,def,ctx} },   // REQUIRED (object; may be empty)
  refs: { [id]: {kind?,ref,ar,mean,src,grade?} },  // REQUIRED (object; may be empty)
  beats: [ {t: 'read'|'frame'|'verse'|'panel'|'depth'|'reflect'|'mc'|'tf'|'tile', ...} ],  // REQUIRED
  recap: string[],             // REQUIRED (array; rendered as a checklist on the "done" reward screen)
  grew?: string,                // optional "what changed" line on the noor-claim screen
  doneTitle?: string,           // default "Carried a little further"
  doneLine?: string,
  dua?: string | { ar: string, source?: string },  // optional — Josh's asset, never generated
  next?: { href: string, label: string },  // optional — "Next: label" link on the du'a close
}
```

**Per-beat-type fields** (from `AW._beatHtml` dispatch + the validator's contract — these two must stay in sync):
- `read`: `{ t:'read', kicker?, title?, html, marker?: {type: fact|remember|fard|angle, body} }` — `html` required.
- `frame`: `{ t:'frame', kicker?(default "The idea to hold onto"), lead }` — `lead` required.
- `verse`: `{ t:'verse', label, ar, tr, after? }` — `label`,`ar`,`tr` required. Renders fixed source line `"Translation of the meaning: The Clear Quran, Dr. Mustafa Khattab · pending review"`. Scripture law: `.scard` clean ground, `.ayah` gets `lang="ar" dir="rtl"`, NOTHING celebratory here.
- `panel`: `{ t:'panel', title, variant?: 'pull'|'tell'|'guard'|'check', intro?, items:[{n?,name,body}], marker? }` — `title`, `items[]` required; each item needs `name` + `body`.
- `depth`: `{ t:'depth', point, lenses: {reality, revelation, ruling} }` — `point` required; `lenses` must have EXACTLY the 3 keys `reality`/`revelation`/`ruling` (fixed order in UI: reality→revelation→ruling, each with a distinct glyph: angle/cite/fard).
- `reflect`: `{ t:'reflect', prompt, model }` — both required. Renders a private `<textarea>` (never persisted, never re-rendered) + a "Show a reflection" ghost button that reveals `model` and earns `AW.REFLECT` (15) noor once, announced via `AW.announce`.
- `mc`: `{ t:'mc', q, quote?, o:[string], c:integer (0..o.length-1), good, gentle }` — all of q/o/c/good/gentle required, `c` in range.
- `tf`: `{ t:'tf', q, c:boolean, good, gentle }`.
- `tile`: `{ t:'tile', prompt, bank:[string], solution:[string] (non-empty, every word ⊆ bank, solution.length need NOT equal bank.length), good, gentle }`.

**Quiz resolution flow**: user picks an option → "Check" button enables (real `disabled` attribute toggled, not just a CSS class — a11y fix) → on Check, `resolve(ok, it)` calls `AW._resolveScore` to update `correct/combo/comboBest/mistakes/noorEarned`, shows praise (`PRAISE = ['That's it.','Beautiful.','Exactly right.','Masha'Allah.']` cycling by `correct % 4`) or the miss line (`'Nothing lost. ' + it.gentle`), announces via `AW.announce`, and a 3-in-a-row combo (`AW.comboPerfect`) fires a delayed (260ms) gold `.thread` flourish + `AW.sound('streak')`.

**Reward choreography (6 moments, one register each, chained via `AW.animate(...).finished` with a 60ms stagger)**:
1. **Verdict** (Page/`reg-page`) — `AW.lessonStars(mistakes)` stars drift in, verdict word (`Flawless`/`Beautifully done`/`You made it through`), 3 stat tiles (noor/accuracy/best-run), advances to `rewardNoor` on click.
2. **Noor claim** (Page) — `claimNoor(noorEarned)` fires HERE (persists once, `AW.sound('complete')`), Marcellus count-up animation from 0 to `noorEarned`.
3. **Returns** (Page) — `AW.S.get('returns',0)` big count + `AW.weekCal()` presence dots (never shows a miss/gap — RWD-02 mercy law).
4. **Done** (Page) — best-of star persist: `if (now > prev) st[cfg.id] = now` (NEVER downgrades), shows `cfg.recap[]` as a checklist, `cfg.doneTitle`/`cfg.doneLine`.
5. **Ring moment** (Orbit/`reg-orbit`) — `postAtoms = AW.atomsDone(AW.state())` recomputed AFTER done()'s star write; `AW.ringSVG({atomsDone:postAtoms, animateFrom:preLessonAtoms})` where `preLessonAtoms` was captured at `AwbaLesson` INIT (before opener/touchDay/star-write) — so a genuine first completion draws only the new frontier span, a replay draws nothing.
6. **Du'a close** (Sky/`reg-sky-night`) — renders `cfg.dua` (if present) in Amiri with `lang="ar" dir="rtl"` + `pending review` source line, then the fixed line `"Alhamdulillah — continue."`, then `cfg.next` link + "Back to the path" link to `../learn.html`. **NO celebration primitive (`.dab`/`.thread`/`.plate`/`.rosette`) is ever authored here** — grep-gated (D-51).

Focus management: every reward-screen swap calls `focusHeading(selector)` (sets `tabindex="-1"` + `.focus()` on that screen's heading) — screen change moves FOCUS, never triggers a duplicate `AW.announce` (avoids double-speak).

### `AwbaReview(cfg) — cfg shape
```
{
  id: string,        // REQUIRED — stars key
  title: string,      // REQUIRED
  sub: string,        // REQUIRED
  mastery: string,    // REQUIRED — "what you can do now" closing text
  items: [
    { q, quote?, o:[string], c:integer, t:string } |     // mc-style (t = explanation text, NOT a beat type — naming collision, no code conflict)
    { tf:true, q, c:boolean, t:string }                   // tf-style
  ],   // REQUIRED
  next?: { href, label },  // REQUIRED per validator (href/label both required if `next` present... actually validator requires next itself)
}
```
Note: `checkTopLevelReview` in the validator treats `cfg.next` as REQUIRED (errors if missing), unlike the lesson's optional `next`.

**Mechanics (Gen-3 byte-preserved)**: whole session on Orbit register (`.reg-orbit`). No back button ever. 14s soft timer per question (`AW.QTIME*10` deciseconds, 100ms tick, `.low` styling under 28% remaining, one soft "10 seconds" `AW.announce` at the 10s mark). A timeout permanently sets `allInTime=false`, parks the question in `skipped[]`, disables its options, auto-advances after 1500ms — **no penalty**. When the main-phase queue is exhausted with skipped items, `circleBackOffer()` lets the learner replay them **untimed, for zero noor** (but a correct answer still lights its `.thread` arc). `phase` ∈ `'main'|'back'`.

**Reward math**: `AW.reviewScore(thisInTime)` = `15 + (inTime ? 5 : 0)` per correct MAIN-phase answer (circle-back answers earn 0 noor). `AW.reviewStars(correct, total, allInTime)`: `correct===total` → (`allInTime` ? 3 : 2); any miss at all → 1 (never 0, regardless of timing). `claimNoor(noorEarned)` fires once at `result()`. Best-of star persist (never downgrades) also happens at `result()`.

`result()` renders: a `.rosette` seal icon (stamped via `AW.animate(seal, [...], '--dur-stamp', '--ease')`), star row, verdict word (`Legendary`/`Mastered`/`Reviewed` for 3/2/1 stars), `"N of M named"` line, `cfg.mastery` block, noor-gathered line, `cfg.next` button + `"Back to the path"` link.

---

## 4. NODE_ATOMS / the 61-atom denominator

- Lives ONLY in `shared/awba-engine.js` as a **module-private** `var NODE_ATOMS` (NOT exposed on `AW`), around line 475:
```js
var NODE_ATOMS = {
  u1m1: 3, u1m2: 4, u1m3: 5, u1m4: 5,
  u2m1: 5, u2m2: 4, u2m3: 3, u2m3b: 3,
  u3m1: 4, u3m2: 5, u3m3: 5,
  u4m1: 3, u4m2: 4, u4m2b: 4, u4m3: 4
};
```
15 lesson ids only (reviews/chests contribute 0 — simply absent from the map). Σ = 61 (the 65-atom corpus minus 4 documented un-earnable holds: U3-13, U3-16, U4-03, U4-09).
- `AW.atomsDone(progress)` is the ONLY consumer inside the engine, and is the canonical function every caller (Ring moment, boot-stamp `--dawn` stamp, Sky) must use — never a `*3`-per-node proxy or a hand-rolled count. It sums `NODE_ATOMS[id] || 0` over every key present in `progress.stars`.
- `learn.html` (the course-map page, NOT this file) is where the full node graph/course structure presumably lives for rendering the path UI — this engine file only holds the atom-count map, not the node list itself. A v2 Practice/item-pool feature that needs "which lesson teaches which atom" beyond counts will need to consult `learn.html` or the content data files directly; this file exposes ONLY the aggregate count via `AW.atomsDone`.

---

## 5. GLYPHS (13) and KIT (20) + UNIT_ICON

**`AW.GLYPHS`** — exactly 13 keys (glyphCount is grep/test-gated to stay frozen at 13; DO NOT add a 14th without checking `components.test.js`):
`flame, spark, check, star, cite, lamp, lock, chest, trophy, fact, remember, fard, angle`
Each is a self-contained `~24x24` (or `20x24` for `lamp`) inline `<svg>…</svg>` string, no wrapping attrs (those get injected by `AW.icon`).

**`AW.KIT`** — exactly 20 scene-icon keys (240×300 viewBox portrait icons, one-colour `currentColor` + `var(--icon-accent)` sparkle):
```
mosque, carpet, lantern, lanterns, crescent, hijab, man, family, prostration, standing,
'quran-stand', beads, kaaba, dua, dates, compass, ewer, night, pattern, calendar
```
(source-numbered 01–20: 01-mosque, 02-prayer-carpet, 03-lantern, 04-lanterns, 05-crescent-star, 06-woman-hijab, 07-man, 08-family, 09-prostration, 10-standing-prayer, 11-quran-stand, 12-prayer-beads, 13-kaaba, 14-hands-dua, 15-iftar-dates, 16-qibla-compass, 17-water-ewer, 18-ramadan-night, 19-star-pattern, 20-ramadan-calendar). Note the `'quran-stand'` key needs bracket/quote access (`AW.KIT['quran-stand']`) since it's not a valid bare identifier.

**`AW.UNIT_ICON`** = `{ u1: 'compass', u2: 'lanterns', u3: 'kaaba', u4: 'mosque' }` — maps a `cfg.id`'s first-2-chars unit prefix (`u1`..`u4`) to its KIT scene name; used by the lesson opener's hero icon (`AW.UNIT_ICON[(cfg.id||'').slice(0,2)] || 'lantern'`).

---

## 6. Cross-document pageswap/pagereveal View-Transitions block

Guarded `if (typeof document !== 'undefined')`. Uses the ONE shared-element name `'circuit-term'` (D-58):
- `window.addEventListener('pageswap', e => { if (!e.viewTransition) return; ... })` — stamps `window.__awbaMorphEl.style.viewTransitionName = 'circuit-term'` (the OUTGOING page must have set `window.__awbaMorphEl` to the tapped node/continue-card element BEFORE navigating), clears it in `e.viewTransition.finished.then(...)`.
- `window.addEventListener('pagereveal', e => { if (!e.viewTransition) return; ... })` — stamps `document.querySelector('.hero-ico')` (the lesson opener's unit scene-icon square — the ONLY `.hero-ico` in the document at snapshot time) with the SAME name, clears it after `finished`.
- Bails silently (no console noise) whenever `e.viewTransition` is null — e.g. `file://` opaque-origin navigation, or a browser without View Transitions support. Both sides ALWAYS clear the mark after `finished` so back-to-back navigations never carry two same-named elements (a collision aborts the morph — the "uniqueness rule"). **Scripture is never a morph source** (no `.ayah`/`.scard`/epigraph ever gets `window.__awbaMorphEl`).
- A **new v2 page** (onboarding/Practice/Profile/More) that wants to participate in this morph must (a) set `window.__awbaMorphEl` to its own tapped element before navigating away, and/or (b) render exactly one `.hero-ico` element if it wants to be a morph TARGET on arrival — otherwise it just gets a plain navigation, which is a safe no-op, not a bug.

---

## 7. scripts/validate-content.js — the node:vm stub precedent

File: `/Users/theshumba/Documents/GitHub/awba-gen4/scripts/validate-content.js`. Zero npm deps (Node core `fs`/`path`/`vm` only).

**Mechanism**: for each data-file `.html`, regex-extracts the ONE inline (non-`src`) `<script>` block: `/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/i`. Builds a `vm.createContext(sandbox)` where `sandbox` is:
```js
{
  AW: { cite: function(id,label){ return '<span class="cite" data-ref="'+id+'">'+(label||'')+'</span>'; } },
  AwbaLesson: function(c){ cfg = c; kind = 'lesson'; },
  AwbaReview: function(c){ cfg = c; kind = 'review'; },
}
```
Then `vm.runInContext(scriptBody, sandbox, {filename: file})` — executing the data file's real inline script INSIDE the sandbox, which means `AwbaLesson({...})`/`AwbaReview({...})` calls just CAPTURE their `cfg` argument into a closure variable instead of driving DOM (the real engine functions are never loaded into this sandbox — only these capturing stubs are). Since `cfg` is real JS (not JSON — has `AW.cite(...)` calls, concatenation, embedded HTML), this vm-capture approach is required; regex-parsing the object literal was explicitly rejected (D-25/D-26).

**ID resolution** walks RAW captured strings (`collectStrings`, recursive walk of the whole cfg tree) and joins them with `\n`, then regexes for `data-ref=["']([^"']+)["']` and `data-term=["']([^"']+)["']` — NEVER `JSON.stringify(cfg)` first (stringify escapes quotes and silently zero-matches — Pitfall 2, verified against real Josh data files).

**Precedent for v2 Practice's item-pool extractor**: the SAME sandbox-stub-and-capture trick can extract every quiz item (`beats[]` mc/tf/tile entries, or review `items[]`) from every lesson/review HTML file at dev-time by running this exact ingest() function (or a copy of it) and then walking `cfg.beats`/`cfg.items` instead of/in addition to validating them. No new dependency needed — reuse `ingest()` from this file (it's exported: `module.exports = { ingest, validateCfg }`).

Beat/item contract constants worth reusing verbatim: `BEAT_TYPES = ['read','frame','verse','panel','depth','reflect','mc','tf','tile']`, `PANEL_VARIANTS = ['pull','tell','guard','check']`, `DEPTH_LENSES = ['reality','revelation','ruling']`, `MARKER_TYPES = ['fact','remember','fard','angle']`.

---

## 8. Invariants a v2 builder must NOT break

1. **Exactly 13 occurrences of the literal `localStorage`** in `awba-engine.js` (grep-gate, confirmed by direct count 2026-07-15). `AW.S`/`AW.prefs` are the ONLY code allowed to touch it — any new v2 storage need MUST go through `AW.S.get/set` or `AW.prefs.get/set`, never a new raw `localStorage.*` call anywhere in the codebase (including new pages).
2. **`AW.GLYPHS` must stay frozen at 13 keys** and **`AW.KIT` at 20 keys** — a components test asserts these counts. Adding icons for new v2 surfaces needs either reuse of existing glyphs/scenes or an explicit, deliberate count-gate update (not a silent add).
3. **Classic-script / `file://` assumptions**: no ES modules, no `type="module"`, no `defer`/`async` on the engine's own `<script>` tag; `AW` must exist synchronously at parse time before any inline data-file script runs. Any new v2 page must follow the identical `<script src="../shared/awba-engine.js">` (or correct relative depth) + inline classic `<script>` pattern.
4. **No gated literals in comments** — this file's comments reference D-numbers/law-numbers as design authority; a v2 builder should not literally copy-paste example strings from comments as if they were runtime constants without re-deriving from the real code.
5. **`globalThis.AW = AW`** must keep being exported for headless test ergonomics — don't wrap `AW` in a closure that prevents this.
6. **Dates**: always local `YYYY-MM-DD`, built via `getFullYear()/getMonth()/getDate()`. Never `toISOString()`/`new Date(ymdString)` for anything persisted or compared.
7. **`AW.S.get`/`AW.S.set` return/accept only JSON-safe values** (numbers/strings/booleans/plain objects/arrays) — the defensive-copy path uses `structuredClone`/JSON round-trip, so functions/DOM nodes/etc. must never be stored.
8. **Best-of star writes never downgrade** (`if (now > prev)` pattern) — any new progress-writing surface (e.g. a Practice page) must follow the same never-downgrade discipline if it touches `stars`.
9. **`AW._noorClaimer()` / claim-once discipline** — any new reward flow that credits noor must use a fresh `AW._noorClaimer()` instance per session and call `claim()` exactly once, mirroring the lesson/review runners, to avoid double-crediting on back/forward navigation.
10. **`AW.sound('cue')` path is relative to a page ONE level below `shared/`** (`'../shared/sfx/' + cue + '.mp3'`) — a new v2 page at a different directory depth (e.g. a top-level `practice.html` vs `lessons/xyz.html`) will resolve this path WRONG unless it's also one level deep, or `AW.sound` is extended to accept a base-path override.
11. **`bindMuteBtn`/`muteBtnHtml` expect DOM id `#lsmute`** exactly — any new page reusing the shared mute toggle must render that exact id (or the binder silently finds nothing and no-ops).
12. **Scripture/du'a content is never generated here** — `AwbaLesson`'s `duaClose()` only renders `cfg.dua` if the data file supplies it; a v2 surface must never author new Arabic/scripture strings inline in JS.
13. **`AW.ringSVG`'s determinism**: same `seed` + same `atomsDone`/`animateFrom`/`circuitsDone` must always yield byte-identical SVG — no `Date.now()`/`Math.random()` may be introduced into that code path if a v2 feature extends the Ring.
