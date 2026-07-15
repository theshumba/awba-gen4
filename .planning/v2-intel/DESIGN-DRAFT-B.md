# DESIGN-DRAFT-B — Awba Gen-4 v2 · four surfaces + tab integration
**Lens: "The Calm Engineer."** Designed from clarity, information architecture, and edge cases. Every state accounted for (fresh install → course-complete → reduced-motion → keyboard-only → RTL → 320px → offline), the fewest new classes that still hit the full Athar craft bar, and rulings that are decisive, not deferred.

Author: design pass B · 2026-07-15 · reads: R0–R6 intel, ATHAR authority (R5), learn.html/preview.html/engine CSS+JS ground truth.
Authority order unchanged: `ATHAR-SYSTEM.md` canon → `03-UI-SPEC-ATHAR.md` executes → this spec indexes four net-new surfaces. Where I diverge from an R5 inference I say so and justify.

---

## 0 · The one-screen summary (read this first)

| Surface | File(s) | Register / ground | Tab bar | New prefs | Engine seam it needs |
|---|---|---|---|---|---|
| **Onboarding** | `onboarding.html` (root) | ORBIT · Kiswah | no | `onboarded` | none |
| **Practice — hub** | `practice.html` (root) | PAGE · cream | yes (Practice) | — | cream tab-bar CSS |
| **Practice — drill** | `practice/session.html` (one level down) | PAGE · cream | no | — | `AW.practiceRun`, `shared/practice-pool.js` |
| **Profile** | `profile.html` (root) | ORBIT · Kiswah | yes (Profile) | `displayName` | `AW.streakSheet`/`AW.noorSheet`, `AW.sproutFor` |
| **More** | `more.html` (root) | PAGE · cream | yes (More) | — | cream tab-bar CSS |

**Register logic (from R5 §2.1, applied faithfully):** Onboarding is the doorway *into* the sacred centre → Orbit. Practice is a quiz surface → Page (the shipped home of quizzes). Profile foregrounds the Ring + macro identity → Orbit. More is the quietest utility surface → Page. Two grounds means the shared tab bar wears its host register (gold-active on dark, crimson-active on cream) — a **feature**, not a compromise: "each register wears its own accent" is the Athar thesis, and the bar obeys it.

**Denominator ruling:** the shipped engine is unambiguous — `NODE_ATOMS` sums to **61**, `ringSVG` defaults `structure.atoms:61`, `skyDawn` divides by `/61`, preview reads "of 61". Every "X of N atoms" string on the new surfaces uses **61**. (R5 §7 flagged 61-vs-65; the *live* engine denominator is 61 — resolved, do not print 65.)

---

## 1 · Consolidated Wave-A engine seams (the whole diff, smallest possible)

Everything the four surfaces need from the shared engine, ranked by size. Wave-B pages consume these; Wave-C wires learn.html + gates. Nothing here touches the 19 byte-frozen content files or the DAILY region.

**Seam A1 — cream tab-bar ground (CSS, ~4 lines).** The bottom nav must live on cream pages (Practice, More) as well as dark. Base `.otabs` is the dark treatment (leave untouched — learn.html + profile.html use it as-is). Add ONE scoped override in `@layer components` beside `.otabs`:
```css
.reg-page .otabs, .reg-festival .otabs {
  background: color-mix(in srgb, var(--cream) 92%, transparent);
  border-top: 1px solid var(--rule);           /* replaces the 2px navy keyline */
}                                                /* backdrop-filter:blur(8px) inherits from base .otabs */
```
Inactive `.tab` (base `--ink-62`, 5.02:1) and active `.tab.active` (base crimson, 6.13:1) already read correctly on cream — no further rule needed. Zero new hex.

**Seam A2 — `AW.streakSheet()` + `AW.noorSheet()` (JS, ~20 lines total).** D-60 mandates **one** implementation of the streak/noor sheets. They currently live page-private in learn.html; four tab pages now need the Returns-tab streak sheet, so duplicating would break D-60. Hoist verbatim into the engine (they already read only `AW.state()`/`AW.weekCal()`, use `AW.sheet`/`AW.icon`, and carry the exact shipped copy — no storage word added, no glyph added). Signatures: `AW.streakSheet()`, `AW.noorSheet()` — no args, open the singleton sheet. Wave-C refactors learn.html's `openStreakSheet`/`openNoorSheet` to call these (its zero-storage count is unchanged).

**Seam A3 — `AW.sproutFor(id)` + `AW.SPROUTS` (JS, the 20-doodle pool moved, ~30 lines).** The D-55 sprout pool + hash are page-private to learn.html (R3 §10). Profile's garden reuses them; duplicating 240 lines of SVG is a drift risk. Hoist the `SPROUTS` array + `sproutFor()` verbatim to `AW.SPROUTS` / `AW.sproutFor(id)`. These are **decorative inline SVG** (`aria-hidden`, `var(--gold)` ink) — NOT `AW.GLYPHS`, so `glyphCount` stays frozen at 13 (the R0 "decorative art = inline aria-hidden SVG, never a new GLYPHS entry" allowance). Wave-C refactors learn.html to call `AW.sproutFor`.

**Seam A4 — `AW.practiceRun(mountEl, items, opts)` (JS, ~70 lines) — the "practice-mode seam."** A self-contained quiz mini-runner that **reuses the shipped renderer + classes** so the feel cannot fork, without touching (or gutting) `AwbaLesson`:
- Renders each item via `AW._beatHtml(item, {})` (the shipped mc/tf/tile builders → identical `.pintro`/`.opts`/`.opt`/`.tfrow`/`.tf`/`.bank`/`.tile` markup).
- Wires selection → Check → verdict mirroring the shipped `bindChoice`/`bindTile` code paths exactly: real `disabled` on Check until a pick; 3px crimson selection cue + `aria-pressed`; on Check `.opt.correct`/`.opt.wrong` (mc/tf), `.opt-why` line, `.btn.retry`.
- **Correct** → shipped `PRAISE` cycle (`['That's it.','Beautiful.','Exactly right.','Masha'Allah.']`) announced, then a **Continue** advances. **Wrong** → grey ink-blot + `'Nothing lost. ' + item.why` + **Try again** (re-attempt the same item, selection reset — practice protects nothing, so re-attempting *is* the point).
- **No noor, no stars, no persistence, no `document.body` wipe, no du'a, no Ring, no Festival.** It mounts into the provided element only.
- Renders per-question marginalia ("Question i of n", Courier). Calls `opts.onDone({correct, total})` after the last item. If `opts.refs`/`opts.terms` present, calls `AW.wire(mountEl, {refs,terms})` after each render so any embedded citation/term mark opens the shipped sheet (with the pending pill).
- Motion via `AW.reducedMotion()`; announcements via `AW.announce`.

*Rationale (ruling on the brief's architecture choice):* running the drill through the **real `AwbaLesson` at `practice/session.html`** would inherit `../learn.html` + `../shared/` paths for free, but it would drag in the full reward choreography (verdict stars, noor claim, returns, done recap, Ring moment, du'a close) — precisely what practice must omit — and suppressing all six via a `cfg.practice` flag is a large, risky branch through byte-sensitive runner code. `AW.practiceRun` is the *smaller, safer* seam: one canonical, unit-testable practice interaction, the lesson runner untouched. (Fallback if the team wants a literally-zero engine-JS diff: author the identical runner page-side in `session.html`; it still goes through `AW._beatHtml` + shipped CSS, so feel is preserved. I recommend the engine seam for testability + single-source.)

**Seam A5 — the practice pool + its fidelity gate (tooling + data, no runtime engine change).**
- `scripts/build-practice-pool.js` — dev-time extractor (run once by a developer, like font-subsetting), reusing `validate-content.js`'s `node:vm` sandbox ingest (stub `AwbaLesson`/`AwbaReview` to capture cfg; `AW.cite` returns real markup). Walks every lesson `beats[]` (`mc`/`tf`/`tile`) and every review `items[]` (`mc`/`tf`), copies fields **byte-verbatim**, tags each with `src` (source node id). Detects (via the `collectStrings` raw-walk) whether any item string carries `data-ref`/`data-term`; only then carries that source's `refs`/`terms` subset.
- `shared/practice-pool.js` — the committed static output, a classic script:
```js
window.PRACTICE_POOL = {
  items: [
    { src:'u1m1', kind:'lesson', t:'mc', q:'…', quote:'…', o:['…'], c:0, why:'…' },
    { src:'u1r',  kind:'review', t:'tf', q:'…', c:true, why:'…' }, …
  ],
  refs:  { /* srcId: {…verbatim cfg.refs subset…} — only when an item embeds a mark */ },
  terms: { /* srcId: {…verbatim cfg.terms subset…} */ }
};
```
  `why` is the verbatim miss/explanation line copied from the source's own field (lesson `gentle`; review `t`) — a field *selection*, never a paraphrase. `q`/`o`/`c`/`quote`/`prompt`/`bank`/`solution` are byte-identical to source.
- `scripts/tests/practice-pool-audit.mjs` — the drift gate, following `port-audit.mjs`'s `checkDailyFidelity` shape: re-ingest the 19 source files the same way, and assert (1) every pool item's fields byte-match the source item it claims (`src` + type + position), (2) the pool contains items ONLY from the 19 files, (3) every `src` is a real lesson/review id. Runs unconditionally, prints `PRACTICE-POOL BYTES OK` / `… BYTES DRIFT`. This makes it impossible for Practice to drift from or invent content.

**Two new prefs keys only** — additive, no schema bump (the shipped install-nudge precedent): `onboarded` (bool, default `false`), `displayName` (string, default `''`). **Zero new `awba_state` schema keys.** Storage-word count in the engine stays 13; every new page keeps 0 direct storage refs.

---

## 2 · Global conventions for all four root pages

**Head template (clone learn.html's install trio — these are root, root-relative pages):**
```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Awba · {Welcome|Practice|Profile|More}</title>
<meta name="theme-color" content="{#131013 Orbit | #F3EDE2 Page}">
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="icons/apple-touch-icon-180.png">
<script>if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', function(){ navigator.serviceWorker.register('sw.js'); }); }</script>
<link rel="preload" as="font" type="font/woff2" href="shared/fonts/readex-pro-400.woff2" crossorigin>
<link rel="stylesheet" href="shared/awba-engine.css">
<script src="shared/awba-engine.js"></script>
<style>@layer screens { /* page seams only — see each surface */ }</style>
```
- `theme-color`: onboarding `#131013`, practice `#F3EDE2`, profile `#131013`, more `#F3EDE2`.
- Second preload per page: Orbit pages add `amiri-quran-400` only if they render scripture (none do → omit; Marcellus/Readex suffice). Practice preloads `readex-pro-600`. Keep the two-font preload discipline; never over-preload.
- `<body>` root: `<main class="{reg-orbit|reg-page} grain" id="app"></main>` — one JS-rendered shell, exactly like learn.html.
- **`practice/session.html` is the exception** — one level down, so it uses `../shared/…`, `../learn.html`, **no** manifest/apple-touch-icon/SW trio (like a lesson page), theme-color `#F3EDE2`, preloads `readex-pro-400` + `amiri-quran-400` (reused quotes may carry Arabic). It also loads `../shared/practice-pool.js`.

**The first-run redirect guard (Wave-C edit to learn.html — the exact logic).** At the very top of learn.html's outer IIFE, immediately after `'use strict';`, before any data literal or `render()`:
```js
if (window.AW && AW.prefs && !AW.prefs.get('onboarded', false)
    && location.search.indexOf('begin=1') === -1) {
  location.replace('onboarding.html');   // replace() → no history entry → back never loops
  return;                                 // out of the IIFE before touching #app (no flash of learn UI)
}
```
- **Loop-proof by construction:** onboarding's "Begin"/"Skip" set `AW.prefs.set('onboarded', true)` **then** navigate to `learn.html?begin=1`. The `begin=1` param short-circuits the guard for that one navigation **even if the pref write failed** (private-mode / storage-off) — so the flow can never trap. onboarding.html itself carries **no** guard (it is the destination). Lesson/review/practice pages carry no guard (direct deep-links never trap).
- Degradation: if storage is entirely unavailable, a later plain visit to learn.html re-shows onboarding (annoying, never infinite; onboarding is one tap to skip). Acceptable for the rare no-storage case; no storage API touched to detect it.

**Zero-direct-storage law:** every page reads/writes state ONLY through `AW.state()`/`AW.S.get/set`/`AW.prefs.get/set`. New page-level state = a new `AW.prefs` key string, never a raw `localStorage` call, never a new engine storage call (the install-nudge precedent, R3 §5).

**Motion / easing:** one family `var(--ease)`, tokens only (`--dur-settle` 260ms page reveals, `--dur-press` 140ms press, `--dur-sheet` 280ms sheets, `--dur-fade` 180ms). Both reduced-motion triggers ride in from the engine automatically for any shipped class; page-authored transitions must be guarded (both `@media (prefers-reduced-motion: reduce)` and the fact that `--dur-*` collapse to 1ms under the engine's motion layer covers class-based transitions). The one press recipe (`translateY(1px)`) is inherited by every `.btn/.opt/.tf/.tile/.tab/.hstat` — never re-author it.

**Focus grammar:** never hand-author focus rings — Orbit/Sky pages get gold rings, cream pages get crimson, automatically from the engine `:focus-visible` grammar. All controls native `<button>`/`<a>`; 44px min; icon-only controls carry `aria-label`; dynamic changes announce via `AW.announce`; overlays use `AW.sheet` (which already traps focus + Escape-closes + scroll-locks).

---

## 3 · SURFACE A — ONBOARDING (`onboarding.html`)

### Register + layout
**ORBIT** (Kiswah, `.reg-orbit grain`). One ground, all panes (law 1). A single page with a **3-pane in-place state machine** (no per-pane navigation, no flash, file://-safe) — panes swap by re-rendering one container; focus + announce move with each step. This is the doorway to the sacred centre: Marcellus display headlines (dark-ground display, ≥28px, law 5), Readex body (`--paper-85`), Courier kickers/marks (`--paper-62`), gold accent.

Column: the shipped `.reg-orbit grain` shell, content in a centered `.ob-shell`-style wrap. Each pane top→bottom: **kicker** (Courier) → **headline** (Marcellus) → **body** (Readex) → optional **hero** (pane 3 = the empty Ring) → **CTA row** → **step dots**. The CTA row + dots pin low; the pane content settles on advance.

### Component manifest
- **Shipped, reused as-is:** `.reg-orbit grain` ground, `.btn` (cream key on dark) for the primary CTA, `.btn.ghost` (gold thread) for Back/Skip, `AW.ringSVG({atomsDone:0, size:300})` for pane 3's empty-ring hero (static — no `animateFrom`), `AW.icon` (a scene mark if wanted), `AW.announce`, gold `:focus-visible`.
- **New page CSS (`@layer screens`, ~1 small block):** `.onb-wrap` (centered flex column, `padding`, `gap`), `.onb-kick` (Courier `--fs-marg` `--paper-62`), `.onb-h` (Marcellus `--fs-display` `--cream`), `.onb-body` (Readex `--fs-body` `--paper-85`, `max-width:52ch`), `.onb-ring` (`width:min(280px,70vw)` cap, mirrors `.ob-ringcap`), `.onb-mark` (Courier maker's line `--paper-62`), `.onb-cta` (flex row), `.onb-dots` (3 dots) / `.onb-dot` / `.onb-dot.on` (gold, 8px, mirrors `.weekcal .day` shape at 8px — `aria-hidden`). All values are shipped tokens; zero new hex.
- **No new glyphs, no new art** (the empty Ring is the hero — aniconic, zero commissioned art, and it makes the ring "already yours" from second one).

### FINAL copy (every string)
**Pane 1 — Welcome**
- kicker: `Assalamu alaikum`
- headline: `A companion, not a cop.`
- body: `Awba walks the Aqeedah course with you — one small step at a time. There is no rush here, no punishment, and nothing to lose. Only a path, and your own light gathering as you go.`
- primary CTA: `Show me how it works`
- skip (ghost): `Skip — take me in`

**Pane 2 — Noor & returns**
- kicker: `Two things worth knowing`
- headline: `Light you keep. A number that never breaks.`
- body block 1: `Noor is the light you gather for every answer. It is never spent against you, never dangled, and it never runs out.`
- body block 2: `Returns counts every day you come back. It can never break and never reset — however long the gap. That is the point of this place.`
- primary CTA: `And the path?`
- back (ghost): `Back` · skip (ghost): `Skip — take me in`

**Pane 3 — The path**
- kicker: `Where you're headed`
- headline: `Your path, traced in ink.`
- hero: the empty Ring (0 / 61)
- body: `Every lesson you finish inks one more mark into this ring — a drawing that becomes yours alone. Wrong answers cost nothing; you simply look again. Begin whenever you're ready.`
- maker's mark (Courier): `your ring · 0 of 61 inked`
- primary CTA: `Begin, gently`
- back (ghost): `Back`

**Screen-reader step announcements** (via `AW.announce` on each advance): `Step 1 of 3` / `Step 2 of 3` / `Step 3 of 3`.

### Interaction + motion
- Advance/back: re-render the pane container; incoming pane plays **settle** (`opacity 0→1, translateY(8px→0)`, `--dur-settle`, `var(--ease)`) — the Page/Orbit reveal. No slide. Focus moves to the new pane's `<h1>` (`tabindex="-1"`, `.focus()`), then `AW.announce("Step N of 3")` (focus-move first, then announce — avoids double-speak).
- Empty Ring: static (`AW.ringSVG` omits `animateFrom`); under reduced motion it renders with zero animation nodes anyway.
- Press: the one shipped paper-press on every CTA (inherited).
- **Reduced motion:** settle collapses to 1ms via the engine motion layer (both triggers); no ambient exists to stop. Panes appear in place, focus + announce unchanged.

### a11y contract
- `<main class="reg-orbit grain">` `role` not needed (main is a landmark). Each pane = a `<section aria-label>` swap; exactly one `<h1>` visible at a time.
- Tab order per pane: headline (focus target, non-operable `tabindex="-1"`, ring suppressed via the shipped `[tabindex="-1"]:focus-visible` rule) → primary CTA → back → skip → (dots are `aria-hidden`).
- Every CTA native `<button>`; gold `:focus-visible` rings; 44px targets.
- Dynamic pane change announced; the empty Ring carries its shipped `aria-label="Tawaf ring — 0 of 61 inked"`.

### Empty/edge states
- **Fresh install (the only real first-run):** shown via redirect. Works offline (precached). 320px: single column, Marcellus clamps down to 28px floor, no horizontal overflow.
- **Replay (from More):** identical flow; ends at `learn.html?begin=1` (onboarded already true → no re-redirect). No separate "replay" copy — the welcome reads the same whether first-run or replay.
- **Storage off:** Begin/Skip still navigate (via the `begin=1` param loop-breaker); the flag write simply no-ops.

### Acceptance checklist — Onboarding
- [ ] One register (Orbit) across all panes; zero new hex; zero direct storage (only `AW.prefs.get/set('onboarded', …)`).
- [ ] Begin **and** Skip both set `onboarded=true` and navigate to `learn.html?begin=1`.
- [ ] The learn.html guard redirects a first-run visitor here and never loops (verify with pref-write disabled).
- [ ] Each pane advance moves focus to the heading + announces "Step N of 3".
- [ ] Empty Ring renders static (no `animateFrom`), correct `aria-label`, capped width.
- [ ] Every CTA is a native button with a gold `:focus-visible` ring; 44px; reduced-motion settles instantly.
- [ ] No scripture, no invented Arabic, no celebration primitive, no tab bar.
- [ ] Added to `sw.js` precache; render-smoke/contrast/rtl/glyph coverage extended.

---

## 4 · SURFACE B — PRACTICE (`practice.html` hub + `practice/session.html` drill)

### B.1 — Hub (`practice.html`)
**Register:** PAGE (cream, `.reg-page grain`) — quizzes live on Page (R5). Carries the tab bar (Practice active, crimson). Readex titles (Page titles are Readex 600, **not** Marcellus — law 5).

**Layout** top→bottom: HUD-free (Practice needs no course chip) → a framing header → pool summary → primary CTA → tab bar. The whole thing reads the pool + `AW.state().stars` to decide *available vs empty*.

- Available (≥1 finished lesson/review with pool items): show framing + count + **Begin practice**.
- Empty (nothing finished): the honest empty state — a quiet at-rest sprout (via `AW.sproutFor('practice')` or a single faint doodle), a gentle line, and a **Go to the path** link. Never a dead end.

**Component manifest:** shipped `.reg-page grain`, `.btn` (crimson primary), `.btn.ghost` (secondary), `.otabs` + `.tab` (cream via Seam A1), `AW.sproutFor` (Seam A3) for the empty-state doodle, `AW.icon`. New CSS: `.pr-head`/`.pr-h` (Readex 600 `--fs-h1`)/`.pr-lede` (`--ink-85`)/`.pr-count` (Courier `--ink-62`)/`.pr-empty` (centered column)/`.pr-empty-doodle`. Zero new hex.

**Pool availability math (deterministic, pure):**
```
stars   = AW.state().stars
avail   = PRACTICE_POOL.items.filter(it => stars[it.src])   // completed-source only
N       = avail.length                                       // questions ready
M       = new Set(avail.map(it => it.src)).size              // lessons/reviews finished with items
```

**FINAL copy — hub**
- header kicker (Courier): `Practice`
- headline: `Strengthen what you've walked.`
- lede: `Practice brings back questions from the lessons you've already finished — the same words, nothing new. No stars to win or lose, no noor. Just time with what you've learned.`
- pool count (Courier, when available): `{N} questions ready · from {M} finished so far`  (singular: `1 question ready · from 1 finished so far`)
- primary CTA: `Begin practice`
- **Empty state** (nothing finished):
  - doodle: one faint at-rest sprout
  - line (Readex): `Nothing to strengthen yet.`
  - sub (`--ink-62`): `Practice opens once you've finished your first lesson. Everything you learn will wait for you here.`
  - CTA (ghost): `Go to the path`

### B.2 — The noor ruling (owner-reviewable)
**Ruling: NO noor in practice.** Justification: (1) zero noor **cannot** distort the shipped economy — the safest possible answer to "must not distort"; (2) it reinforces the mercy stance — noor is *earned* light from genuine new learning ("never dangled", per the shipped noor note); practice is repetition, "just for you"; (3) it removes all claim-once/idempotency/double-credit surface area. Stated plainly in the UI: `No noor here — practice is just for you.` (a quiet Courier line under the hub lede). **Marked owner-reviewable:** if the owner later wants a modest award, the seam is a deterministic `+N` gated through a fresh `AW._noorClaimer()` per session — but the shipped default is none, and I recommend it stays none.

### B.3 — Session (`practice/session.html`)
**Architecture ruling:** the drill is a **separate page one level down** (`practice/session.html`), mirroring the shipped `learn.html → lessons/*.html` shape: root hub with tabs → focused activity without tabs. One level down keeps `AW.sound('correct'|…)`'s `'../shared/sfx/'` path correct for the day real cues land, and `../shared/practice-pool.js` / `../learn.html` resolve naturally. It is driven by **`AW.practiceRun`** (Seam A4) — NOT `AwbaLesson` (see §1 A4 rationale): no stars, no noor, no reward choreography, no du'a, no Ring, no Festival.

**Register:** PAGE (cream), no tab bar (focused surface, like a lesson). Theme-color `#F3EDE2`.

**Sampling (deterministic, fair — NO `Math.random` anywhere):**
```
seed  = (AW.ringSeed() ^ dayNumber(local) ^ round) >>> 0     // round = in-memory session counter (starts 0)
avail = PRACTICE_POOL.items.filter(it => stars[it.src])
shuffle avail with mulberry32(seed) Fisher-Yates            // the same PRNG family the Ring uses
items = avail.slice(0, min(8, avail.length))                // session length = 8 (fewer if the pool is smaller)
```
- **Stable within a day + progress** (re-entering the same day gives the same 8 — kind, not jarring), **rotates day to day** (fresh material over time, no randomness), and **grows as you finish more lessons** (new `src` ids enter `avail`). "Practise again" bumps the in-memory `round` → a *different* 8 the same day, still deterministic, still no `Math.random`, no persistence.
- `dayNumber(local)` uses the D-16 local-date helpers (never UTC).

**Layout** top→bottom: a quiet back control (`.ls-back` "Leave practice") → per-question marginalia ("Question i of n", rendered by `AW.practiceRun`) → the beat (shipped `.stage` + `AW._beatHtml`) → the Check/Continue/Try-again foot. On finish → the calm verdict.

**Component manifest:** `AW.practiceRun` (Seam A4), which internally uses shipped `AW._beatHtml`, `.stage`/`.opt`/`.tf`/`.tile`/`.opt.correct`/`.opt.wrong`/`.opt-why`/`.btn`/`.btn.retry`, `AW.wire` (only if items carry marks), `AW.announce`, `AW.sound` (silent placeholders — cues wire to the shipped slots). Page CSS: minimal `.se-head` (back + progress row), `.se-done` (verdict column). Reuse `.ls-back` verbatim (cream ground → `--ink-62`, correct).

**FINAL copy — session**
- back control: `Leave practice`
- progress (Courier, per question): `Question {i} of {n}`
- correct verdict: shipped `PRAISE` cycle (`That's it.` / `Beautiful.` / `Exactly right.` / `Masha'Allah.`), announced; advance button: `Continue`
- wrong verdict: grey ink-blot + `Nothing lost. {item.why}`; retry button (`.btn.retry`): `Try again`
- announce on correct: `Correct.` · on wrong: `Not quite — nothing lost. Look again.`
- **Completion (calm, Page — no stars, no Festival):**
  - heading (Readex 600): `Done.`
  - line: `That's {n} revisited. Well walked.`
  - quiet count (Courier `--ink-62`, neutral, never a grade): `{n} revisited · {c} on the first look`
  - primary CTA: `Practise again`  (bumps `round`, re-runs)
  - ghost CTA: `Back to the path`  (`../learn.html`)
  - announce: `Practice complete. {n} questions revisited.`

### Interaction + motion
- Beat reveal: shipped `settle` on `.opt` (rides in from the engine). Check enables only on a pick (real `disabled`). Verdict uses the shipped correct-dot draw / grey-blot fade. Press = the one recipe. No new motion.
- **Reduced motion:** all collapse via the engine; verdicts still communicate (blot + `.opt-why` text + shape change carry the signal — never colour-only, law 8).

### a11y contract
- Native buttons/links throughout; crimson `:focus-visible` (Page); 44px; `AW.announce` for every verdict + progress + completion; the retry re-attempt returns focus to the first option.
- Any Arabic in a reused `quote`/`tile` renders through shipped markup (`.trans` / `.tile`); if a `quote` is scripture it renders via the shipped scripture component with the pending pill — **no scripture is authored here**, only shipped items are re-presented. `lang="ar"`/isolation ride in from the shipped renderers.
- Leaving mid-session is always available and non-punitive (`Leave practice`).

### Empty/edge states
- **Fresh install:** hub shows the empty state → "Go to the path". Session is unreachable (no items) — but if deep-linked with an empty pool, `AW.practiceRun` with `items.length===0` short-circuits straight to a gentle done screen: `Nothing to practise yet — finish a lesson first.` + `Go to the path`.
- **1 finished lesson, <8 items:** session runs all available items (n<8); copy pluralises correctly.
- **Course-complete:** full pool available; sampling rotates daily; nothing changes structurally.
- **320px / offline:** single column, precached, no overflow.

### Acceptance checklist — Practice
- [ ] Hub: one register (Page); Begin-practice appears only when ≥1 item is available; empty state links to the path (never dead).
- [ ] Pool is `shared/practice-pool.js`, generated by `build-practice-pool.js`, gated byte-verbatim by `practice-pool-audit.mjs` (`PRACTICE-POOL BYTES OK`); contains only items from the 19 files.
- [ ] Session lives at `practice/session.html` (one level down), no tab bar, no install trio, theme-color cream.
- [ ] Sampling is deterministic (mulberry32, seed = ringSeed ^ day ^ round); **no `Math.random` on any reward/selection path**; "again" reshuffles via in-memory round.
- [ ] **No noor, no star writes, no Ring, no du'a, no Festival** anywhere in the drill or completion (verify storage untouched).
- [ ] Quiz feel is the shipped feel (via `AW._beatHtml` + shipped classes); wrong = grey blot + gentle line + Try-again (law 8, never red).
- [ ] Verdicts/progress/completion all announce; crimson focus rings; 44px; reduced-motion collapses cleanly.
- [ ] Any reused scripture/citation carries the shipped pending pill; RTL/glyph gates extended to include the pool + session.

---

## 5 · SURFACE C — PROFILE (`profile.html`)

### Register + layout
**ORBIT** (Kiswah, `.reg-orbit grain`) — Profile foregrounds the Ring + macro identity (R5: "Profile should be ORBIT-ground if it foregrounds the Ring/macro stats"). Carries the tab bar (Profile active, gold). The learner's story, entirely from `AW.*` reads — no login, no cloud, no sharing.

**Layout** top→bottom:
1. **Greeting** (optional name) — Courier kicker + Marcellus name, or a quiet "Add your name" affordance.
2. **The Ring** (static, law 9 — the centrepiece) + Courier maker's-mark.
3. **Stat rail** — noor (→ noor sheet), returns + week constellation (→ streak sheet), lessons/stars.
4. **Per-unit progress** — 4 rows, thermal shape + count.
5. **The garden** — a sprout per finished lesson (the delight detail).
6. **Privacy line.**
7. Tab bar.

### Component manifest
- **Shipped:** `.reg-orbit grain`, `AW.ringSVG({atomsDone, size:300})` (static — **no `animateFrom`**, law 9: "any new surface showing the Ring must mount it WITHOUT `animateFrom`"), `AW.weekCal()` → `.weekcal`/`.day` (reuse the `.ob-streak` dark override for on/off dots), `AW.streakSheet()`/`AW.noorSheet()` (Seam A2), `AW.sproutFor` (Seam A3), thermal `[data-state]` shapes for per-unit dots (dark-ground overrides ride in), `AW.icon`/`AW.UNIT_ICON`, gold `:focus-visible`.
- **State reads (pure):** `AW.state()` (noor/returns/stars/days), `AW.atomsDone(state)` (=/61), `AW.ringSeed()`, `AW.weekCal()`. **`done ⟺ stars[id] != null`** — no `deriveNodeState`/full graph needed; Profile carries only a **compact page-local unit map** (ids + English title per unit), mirroring how learn.html carries `UNITS` locally (the shipped pattern; `deriveNodeState` takes the node list as an argument, so a page-local list is compliant, R6 D-18/19):
```js
var UNITS = [
  { n:1, title:'The Foundation',        nodes:['u1m1','u1m2','u1m3','u1m4','u1r'] },
  { n:2, title:'The Drift',             nodes:['u2m1','u2m2','u2m3','u2m3b','u2r'] },
  { n:3, title:'The Heart of It: Tawhid',nodes:['u3m1','u3m2','u3m3','u3r'] },
  { n:4, title:'The Pillars',           nodes:['u4m1','u4m2','u4m2b','u4m3','u4r'] }
];   // lessons+review only; chests are gifts, not progress rows
```
- **New CSS (`@layer screens`):** `.pf-greet`/`.pf-hello` (Courier)/`.pf-name` (Marcellus `--cream`), `.pf-name-form` + `.pf-name-input` (a dark-ground field, see below), `.pf-ring` (`width:min(300px,74vw)` cap, mirrors `.ob-ringcap`), `.pf-mark` (Courier `--paper-62`), `.pf-stats` (flex/grid), `.pf-stat`/`.pf-stat-num` (Marcellus display numeral, `--cream`; noor variant `--gold`)/`.pf-stat-lab` (Courier `--paper-62`), `.pf-units`/`.pf-unit-row` (icon + Farag-square title + thermal dab + count), `.pf-garden`/`.pf-sprout`, `.pf-privacy` (Courier `--paper-62`). All values shipped tokens; zero new hex. (Do **not** reuse the sheet-internal `.osh-big`/`.osh-sub` on this page — they ink `--kiswah` for a cream sheet and would vanish on dark; author `.pf-stat-num` with `--cream`/`--gold`.)

### FINAL copy (every string)
**Greeting**
- with name — kicker (Courier): `Assalamu alaikum` · name (Marcellus): `{displayName}`
- without name — ghost affordance: `Add your name` → reveals: label `Your name`, input (`maxlength=40`), save button `Save`, and when set a quiet `Remove` link.
- announce on save: `Name saved.` · on remove: `Name removed.`

**Ring + mark**
- maker's mark (Courier): `seed {seed.toString(36)} · {atomsDone} of 61 inked`

**Stat rail**
- noor: numeral `{noor}` (gold) + label `noor gathered` (tap → `AW.noorSheet()`), `aria-label="{noor} noor — open your light"`
- returns: numeral `{returns}` + label `days you came back` + the week constellation dots (tap → `AW.streakSheet()`), `aria-label="{returns} returns — open your streak"`
- lessons: `{lessonsDone} of 15 lessons`
- stars: `{totalStars} stars earned`

**Per-unit progress** (one row each)
- `Unit {n} · {title}` + thermal dab + `{done}/{total}`
  - thermal `data-state`: `mastered` if `done===total`, `progress` if `0<done<total`, `not-yet` if `0`
  - `done` = count of `unit.nodes` present in `stars`; `total` = `unit.nodes.length`
  - row `aria-label` e.g.: `Unit 1, The Foundation — 4 of 5, in progress`

**The garden**
- heading (Courier): `What you've grown`
- (a `AW.sproutFor(id)` sprout for each finished **lesson** id, gathered in a plot)
- empty: `Your garden begins with your first lesson.`

**Privacy**
- `Everything here lives on this device only — no account, no cloud, and nothing is shared unless you choose to.`

**Course-complete acknowledgment** (when all 15 lessons + 4 reviews are done): a quiet Courier line under the garden — `You've walked the whole path. The ring is closed.` (calm, Orbit — **not** Festival; a profile viewed every visit is daily chrome, which Festival's law 5 forbids).

### The name input — design + rules
- Ghost "Add your name" → inline `<form class="pf-name-form">`: `<label for="pfName">Your name</label><input id="pfName" class="pf-name-input" type="text" maxlength="40" autocomplete="off"><button class="btn ghost" type="submit">Save</button>`.
- `.pf-name-input`: `background: var(--navy); color: var(--cream); border: 1px solid var(--edge); border-radius: var(--r-2); padding: var(--sp-2s) var(--sp-3); font: var(--fs-body) var(--font-work);` — a dignified dark-ground field (cream on navy ≥13:1); gold `:focus-visible` rides in.
- On submit: `var v = input.value.trim().slice(0,40); AW.prefs.set('displayName', v);` re-render greeting; announce. **Render the name with `textContent` only** (never `innerHTML`) — XSS-safe by construction. Empty submit clears the name.
- Prefs key: `displayName` (string, default `''`). On-device only; never sent anywhere.
- **Ruling: worth it** — a small, dignified "this is yours" touch, on-device, cheap (one additive prefs key). Kept on Profile (identity), never in onboarding (onboarding stays a pure welcome, no forms — R5's forms-lean-Page note).

### Interaction + motion
- The Ring is static (no `animateFrom`); it never re-draws on a Profile visit (law 9). Under reduced motion it renders zero animation nodes.
- Stat/returns taps open the shipped sheets (`AW.noorSheet`/`AW.streakSheet`) — cream sheets over the dark world, settle in.
- Garden sprouts are static (law 9), gold ink on the dark ground.
- Page load: a single quiet Page-style `settle` on the content (optional; guarded). Press recipe inherited.

### a11y contract
- Native buttons/links; gold `:focus-visible`; 44px. Ring carries its shipped `aria-label`. Stat controls carry `aria-label` (icon-only). Per-unit rows carry composed `aria-label` (name + count + state phrase). Name form has a real `<label>`. Save/remove announce. The garden is decorative (`aria-hidden`).

### Empty/edge states
- **Fresh install:** Ring empty (0/61, all faint — reads intentional, "your path begins here"), noor 0, returns 0, no name (ghost affordance), per-unit all `not-yet`, garden shows `Your garden begins with your first lesson.` Nothing looks broken.
- **Mid-course:** partial everywhere; constellation shows returned days as gold, others as quiet powder (never a gap/red).
- **Course-complete:** Ring gold-thread closed, all units `mastered`, garden full (15 sprouts), the calm closed-path line.
- **Reduced motion / 320px / offline:** static, single column, precached, no overflow.

### Acceptance checklist — Profile
- [ ] One register (Orbit); Ring static (no `animateFrom`), correct denominator (61), maker's-mark uses `AW.ringSeed`.
- [ ] All data via `AW.*` reads only (zero direct storage); `done ⟺ stars[id]`; `atomsDone` via `AW.atomsDone`.
- [ ] Returns tap → `AW.streakSheet()`, noor tap → `AW.noorSheet()` (the ONE shared implementations, Seam A2).
- [ ] Per-unit rows use the shipped thermal shapes (dark-ground overrides), correct done/total.
- [ ] Garden uses `AW.sproutFor` (Seam A3), framed as a garden **not** a second map; max 15 plants; secondary to the Ring.
- [ ] Optional name via `displayName` prefs key, rendered with `textContent`, `maxlength=40`, on-device; save/remove announce.
- [ ] Privacy line present; no Festival on a daily surface; no scripture; no invented Arabic.
- [ ] Gold focus rings; 44px; tab bar (Profile active, gold); added to precache + all gates.

---

## 6 · SURFACE D — MORE (`more.html`)

### Register + layout
**PAGE** (cream, `.reg-page grain`) — the quietest, least-registered surface (R5: "Settings should default to PAGE... quiet taken most literally"). Carries the tab bar (More active, crimson). Information architecture: **labelled sections of rows** that "read like a well-set table" — toggle rows show inline state; action rows open sheets or navigate.

**Layout** top→bottom: page kicker → **§Sound & motion** → **§About Awba** → **§Your progress** → **§Awba (version/credits)** → tab bar.

### Component manifest
- **Shipped:** `.reg-page grain`, `.sheet-row` press feel, `AW.muteBtnHtml()` + `AW.bindMuteBtn()` (the `#lsmute` contract — reused verbatim), `AW.sheet` (for detail/confirm sheets — reuse `.ocs-body`/`.ocs-ic`/`.ocs-line` for icon+line sheets), `AW.prefs` (motion), `AW.S.set` (start-over), `AW.icon`, `.btn`/`.btn.retry`, `.r-pill` (live pending-pill example in the sources sheet), crimson `:focus-visible`.
- **New CSS (`@layer screens`):** `.mo-kick` (Courier)/`.mo-sec` (section block)/`.mo-sec-h` (Courier section header `--ink-62`)/`.mo-row` (flex: label-block ↔ control, min-height 44, `.sheet-row` press)/`.mo-row-label` (Readex `--ink`)/`.mo-row-desc` (`--ink-62`)/`.mo-row-ctrl` (right-aligned)/`.mo-ver` (Courier version block). Zero new hex.

### Information architecture + FINAL copy

**Page**
- kicker (Courier): `More`

**§ Sound & motion**
- section header: `Sound & motion`
- **Row — Sound:** label `Sound`, desc `Gentle cues as you learn.`, control = `AW.muteBtnHtml()` (the shipped `#lsmute` speaker toggle; `AW.bindMuteBtn()` wired after render). *(Silent plumbing — cue files are owner-gated; the toggle + `awba_prefs.soundMuted` work today.)*
- **Row — Reduce motion:** label `Reduce motion`, desc `Calm everything down — less movement, no draw.`, control = a native toggle button (`aria-pressed`, label `Reduce motion`, visible state `On`/`Off`). On toggle: `AW.prefs.set('motion', on ? 'reduce' : 'system')` and stamp `document.documentElement.dataset.motion = on ? 'reduce' : ''` (the same `[data-motion="reduce"]` the engine quiets on). Announce `Reduced motion on.` / `Reduced motion off.`

**§ About Awba**
- section header: `About Awba`
- **Row — How Awba works** → opens a sheet. Sheet copy (product voice):
  - title: `How Awba works`
  - body: `Awba walks the Aqeedah course with you — a companion, not a cop. Finish a lesson and you gather noor, the light that never runs out and is never spent against you. Come back and your returns grow — a number that can never break. Wrong answers cost nothing; you simply look again. There is no rush, and nothing here is ever lost.`
- **Row — Where our words come from** → opens the scripture-sourcing honesty sheet:
  - title: `Where our words come from`
  - body: `Every verse and hadith in Awba is shown word-for-word from its source — we never paraphrase, and we hold anything sensitive back until it's checked. Each one carries a quiet mark:`
  - live example: `<span class="r-pill">unverified · pending review</span>`
  - closing: `Nothing here has been signed off by a scholar yet. When it is, this note will change.`
- **Row — See the welcome again** → navigates to `onboarding.html`. desc: `Walk through the introduction once more.`
- **Row — Add Awba to your home screen** → opens an install-help sheet:
  - title: `Keep Awba a tap away`
  - iOS line: `On iPhone or iPad: tap Share, then Add to Home Screen.`
  - Android/desktop line: `On Android or desktop: open your browser menu, then Install (or Add to Home screen).`
  - closing: `Add it once, and your path is always here.`

**§ Your progress**
- section header: `Your progress`
- **Row — Start over** → opens the calm double-confirm sheet (never-red mercy). desc: `Clear your progress and begin the path anew.`
  - sheet title: `Start over?`
  - body: `This clears your noor, your returns, and your stars from this device. It cannot be undone — but nothing is held against you. Your path will simply be new again.`
  - primary (framed, **not** red — `.btn.retry` rose-frame styling, ink text): `Clear everything` → on first tap becomes `Tap again to confirm` (the double-confirm; a 2nd deliberate tap commits)
  - ghost: `Keep my progress` (closes the sheet)
  - on commit: reset via shipped seams only —
    ```js
    AW.S.set('noor', 0); AW.S.set('returns', 0); AW.S.set('lastDay', null);
    AW.S.set('days', []); AW.S.set('stars', {}); AW.S.set('chests', {});
    ```
    (prefs — including `onboarded`, `displayName`, `soundMuted`, `motion` — are **preserved**; ringSeed preserved so "your path begins again, same hand"; legacy Gen-3 flat keys never resurrect because the `awba_state` blob still exists so migration won't re-run). Then close sheet, `AW.announce('Your progress has been cleared. Your path is new again.')`, and `location.href = 'learn.html'` (onboarded stays true → no re-onboarding).

**§ Awba (version / credits)**
- section header: `Awba`
- version block (Courier `--ink-62`):
  - `Awba · version 2`
  - `A companion for the Aqeedah course.`
  - `Every word of scripture verbatim, sourced, pending review.`

### Toggle design
- Both the Sound (`#lsmute` shipped) and Reduce-motion toggles sit in the right-aligned `.mo-row-ctrl` slot. The mute button is the shipped 44×44 speaker glyph (`aria-pressed` conveys state). The motion toggle matches it as a 44px button showing `On`/`Off` with `aria-pressed` — same visual weight, so the two rows read as a matched pair. Both boot-reflect current prefs on render.

### Interaction + motion
- Rows: the shipped `.sheet-row` press (paper-press + faint crimson wash on `:active`). Sheets settle in (`AW.sheet`, `--dur-sheet`). The double-confirm is a text-swap on the same button (no new motion). Everything reduced-motion-guarded via the engine.
- **Never-red:** the destructive confirm uses the rose *frame* (`.btn.retry`) + ink text, never a red fill — the never-red mercy law holds even here.

### a11y contract
- Native buttons/links; crimson `:focus-visible`; 44px; icon-only mute carries its shipped `aria-label`. Toggles use `aria-pressed`. Sheets trap focus + Escape-close (shipped `AW.sheet`). Every state change (mute, motion, start-over) announces. Section headers are real headings; rows are operable controls with clear labels.

### Empty/edge states
- **Fresh install:** every control works regardless of progress (settings are progress-independent). Start-over on an empty state is a harmless no-op reset.
- **Storage off:** toggles/reset no-op silently (writes swallowed); the UI still responds (aria-pressed reflects the attempted state for the session).
- **Reduced motion already on (OS):** the in-app toggle still reflects/controls the `awba_prefs.motion` override independently (two paths, both honoured).
- **320px / offline:** rows stack cleanly, precached.

### Acceptance checklist — More
- [ ] One register (Page); IA = labelled sections of rows; zero new hex.
- [ ] Sound row uses `AW.muteBtnHtml()` + `AW.bindMuteBtn()` (the `#lsmute` contract); motion row writes `AW.prefs.motion` + stamps `[data-motion]`.
- [ ] "See the welcome again" → `onboarding.html`; How-it-works + Sources + Install open shipped `AW.sheet`s; Sources sheet shows a live `.r-pill`.
- [ ] Start-over is a calm double-confirm (two deliberate taps), never-red, mercy voice; resets via 6 `AW.S.set` calls only (no new engine primitive); preserves prefs + ringSeed; announces; lands on learn.html.
- [ ] Version/credits in Courier; no scripture; no invented content.
- [ ] Crimson focus rings; 44px; tab bar (More active, crimson); added to precache + all gates.

---

## 7 · SURFACE E — TAB BAR INTEGRATION

### Which pages carry the bar
- **Yes:** `learn.html` (Orbit), `practice.html` (Page), `profile.html` (Orbit), `more.html` (Page) — the four tab *landings*.
- **No:** `onboarding.html` (pre-app welcome — you're not "in" the tabbed app yet), `practice/session.html` + all `lessons/*` + `reviews/*` (focused activities, tab-free as shipped).

### The five tabs (unchanged set + icons)
`Learn` (lamp) · `Practice` (beads) · `Returns` (flame) · `Profile` (man) · `More` (pattern). The `man` scene icon is shipped and fine re: aniconism (R0). Returns is **the streak sheet everywhere** — never a page.

### Semantics: links for navigation, buttons for actions
On each tab-landing page, the bar is built like learn.html's `tab()` helper but with real destinations:
- **Cross-page tabs** → native `<a class="tab" href="…">` (navigation). Paths are root-relative from a root page: `learn.html`, `practice.html`, `profile.html`, `more.html`.
- **Returns tab** → native `<button class="tab" id="tabReturns">` → `AW.streakSheet()` (Seam A2). Identical on all four pages.
- **The current page's own tab** → native `<button class="tab active" aria-current="page">` that scrolls to top (`window.scrollTo({top:0, behavior: AW.reducedMotion() ? 'auto':'smooth'})`) — mirrors learn.html's Learn-tab behaviour.

Example — the bar on `practice.html` (Page):
```html
<nav class="otabs" aria-label="Sections">
  <a class="tab" href="learn.html"><span class="otab-ic">{lamp}</span>Learn</a>
  <button class="tab active" type="button" aria-current="page"><span class="otab-ic">{beads}</span>Practice</button>
  <button class="tab" type="button" id="tabReturns"><span class="otab-ic">{flame}</span>Returns</button>
  <a class="tab" href="profile.html"><span class="otab-ic">{man}</span>Profile</a>
  <a class="tab" href="more.html"><span class="otab-ic">{pattern}</span>More</a>
</nav>
```
Each page swaps which single tab is the `active` button; the rest of that page's own tab becomes an `<a>`. **learn.html (Wave C):** its Practice/Profile/More handlers change from `comingSoonSheet(...)` to real `<a href>` links (or `location.href`); **Learn stays scroll-to-top; Returns stays `openStreakSheet`/`AW.streakSheet()` — untouched** (Returns already works, R3 §3). The course-switcher (`#courseChip → openSwitcher`) stays coming-soon (Fiqh/Seerah/Qur'an permanent COMING SOON pills) — do not touch.

### Active-state + the cream-vs-dark consequence (the ruling)
The bar wears its host register:
- **Dark pages (learn, profile):** base `.otabs` (dark, kiswah-mix bg + navy keyline + blur) + the shipped `.reg-orbit .tab.active` **gold** override (crimson is banned on Orbit at 2.65:1) + gold inactive-icon. No new CSS — already in the engine.
- **Cream pages (practice, more):** **Seam A1** flips the container to a cream ground + `--rule` hairline; the base `.tab.active` **crimson** (6.13:1) and inactive `--ink-62` (5.02:1) read correctly on cream automatically. This is the R-5 precedent applied to a cream ground: gold-active on dark, crimson-active on cream — the exact focus-ring/press-ink logic the whole system uses.

Free bonus: `@view-transition { navigation: auto; }` is global, so link-based tab-to-tab navigation gets the native calm crossfade for free (killed under reduced motion by the shipped block) — zero per-page code.

### a11y + acceptance
- All tabs native `<a>`/`<button>`; the active tab carries `.active` **and** `aria-current="page"`; icon+label are both in the tab (label is the accessible text; `otab-ic` SVG is decorative); 44px min; register-correct focus rings ride in.
- [ ] Every tab-landing page shows the bar with exactly one `active` tab matching the page.
- [ ] Returns → the ONE streak sheet on all four pages; no dead taps anywhere.
- [ ] Cream pages use Seam A1; dark pages use the shipped gold override; no new hex.
- [ ] onboarding + session + lessons + reviews have **no** bar.
- [ ] `a11y-keyboard.test.js` file list extended to the 4 root pages (zero positive tabindex; native controls).

---

## 8 · Wave-C integration checklist (gates, sw, learn.html) — for the orchestrator

Not a Wave-B page task, but the design depends on it, so it's specified here honestly:
- **learn.html:** add the redirect guard (§2); swap Practice/Profile/More tab handlers to real `<a href>` links; refactor `openStreakSheet`/`openNoorSheet` → `AW.streakSheet`/`AW.noorSheet`; refactor local `SPROUTS`/`sproutFor` → `AW.sproutFor`. (Returns + course-switcher untouched; zero-storage count stays 0.)
- **sw.js:** add `onboarding.html`, `practice.html`, `profile.html`, `more.html`, `practice/session.html`, `shared/practice-pool.js` to PRECACHE (relative, no leading slash); **bump `CACHE` v1→v2**. `c.addAll` fails if any 404s — all six must exist first. pwa-audit re-derives + disk-checks automatically.
- **Gate discovery (add the 5 pages; report actual counts, never hand-pin):**
  - `render-smoke.mjs` `findPages()` — add the 4 root pages + a `practice/` dir (or explicit `session.html`). Count 20→~25.
  - `contrast-audit.mjs` `findPages()` — add the 5 + a driver branch (reuse the closest LEARN/LESSON load-driver shape; onboarding needs a pane-advance driver, session a quiz driver).
  - `rtl-audit.mjs` `findPages()` — add the 5 (session's reused Arabic quotes ride shipped `.ayah`/`.trans` markup).
  - `check-glyph-coverage.py` `harvest()` — add the 5 + `shared/practice-pool.js` (so any reused Arabic codepoint is covered).
  - Gated-literal sweep — extend file scope to the 5 new pages.
  - `a11y-keyboard.test.js` — extend its explicit file list to the 4 root pages + session.
- **New gate:** `practice-pool-audit.mjs` (Seam A5) in the standing gate board.
- **Chrome-serialisation law:** never run render-smoke / contrast / rtl / the `node --test` glob concurrently (all shell out to Chrome).

---

## 9 · Consolidated Wave-A seams (the shopping list)

| Seam | Kind | Size | Consumers | Count-law impact |
|---|---|---|---|---|
| A1 · `.reg-page/.reg-festival .otabs` cream ground | engine CSS | ~4 lines | practice, more | none (token-only) |
| A2 · `AW.streakSheet()` / `AW.noorSheet()` | engine JS | ~20 lines | profile + all Returns tabs + learn (refactor) | storage-word count unchanged (reads via existing `AW.state`) |
| A3 · `AW.sproutFor(id)` / `AW.SPROUTS` | engine JS | ~30 lines (moved) | profile + learn (refactor) | `glyphCount` stays 13 (decorative SVG, not GLYPHS) |
| A4 · `AW.practiceRun(mountEl, items, opts)` | engine JS | ~70 lines | session | uses existing `AW._beatHtml`/`_resolveScore`; no new storage/glyph |
| A5 · `build-practice-pool.js` + `shared/practice-pool.js` + `practice-pool-audit.mjs` | tooling + data + gate | script + generated file | practice hub + session | pool is byte-verbatim, gated; no engine runtime change |
| prefs · `onboarded`, `displayName` | new keys | 0 code (additive) | onboarding, profile | no schema bump; storage-word count unchanged |

That is the entire engine delta. Everything else is page-authored `@layer screens` blocks + inline classic scripts consuming shipped `AW.*`.

---

## 10 · Risks / judgment calls (called, not buried)

1. **Practice runner: engine seam vs page-authored (called: engine `AW.practiceRun`).** The engine seam is one canonical, unit-testable practice interaction and keeps `session.html` thin; the cost is mild conceptual duplication with the lesson's inline quiz code (feel is protected because both go through `AW._beatHtml` + shipped CSS). If the team wants a literally-zero engine-JS diff, the identical runner can be authored in `session.html` (Wave B) — same feel, less testability. Recommend the seam.
2. **Practice noor: none (owner-reviewable).** Ruled zero — safest re: economy, best re: mercy voice. If the owner wants a modest award later, the deterministic-`+N`-through-`AW._noorClaimer()` seam is noted; default stays none.
3. **Profile's page-local `UNITS` map** duplicates course structure that also lives in learn.html. It's the shipped pattern (learn.html carries its own; `deriveNodeState` takes the list as an arg), and it's structure (not scripture), but it is a drift surface. Mitigation: keep the id lists minimal; a light test can assert Profile's lesson ids ⊆ `NODE_ATOMS` keys. A future DRY move is hoisting `AW.COURSE`, deliberately deferred (bigger blast radius; not needed now).
4. **Sprout garden vs "never a 65-plant map."** Resolved by framing: the garden gathers ≤15 lesson sprouts as a *collection* (no path/route geometry), secondary to the Ring; the Ring remains the sole macro map. If a reviewer still reads it as a second map, drop the garden — the page stands without it (the Ring + stats carry it), but it is the page's one delight detail.
5. **Reused `quote` scripture in practice.** `mcHtml` renders `quote` as `.trans` (not `.ayah`). If any reused quote is raw Arabic scripture, that would sit outside scripture markup. Mitigation: the extractor flags items whose strings contain Arabic scripture ranges / `data-ref`, and (a) carries the source `refs`/`terms` for `AW.wire`, and (b) the pool-audit + glyph/rtl gates cover the session so nothing slips. If a quiz item genuinely displays an ayah, it must route through the shipped scripture component (as the lesson already does) with the pending pill — never a bare `.trans`. Flag for the extractor implementer to verify against the real 19 files.
6. **`begin=1` URL param loop-breaker** leaves a one-time param on the first post-onboarding learn.html URL. Harmless, self-clearing on next visit, and the only storage-free way to guarantee no redirect loop when persistence is unavailable. Accepted.
7. **Two grounds under one tab bar** is deliberate (register correctness > uniformity) and I believe it reads as intentional (the bar wears its register). If a reviewer wants a single uniform bar ground everywhere, the cheapest uniform option is making all four tab pages Orbit — but that would force Practice's quiz + More's settings onto a dark ground against the shipped precedent (lessons/settings are cream). I recommend keeping the register-correct split.
8. **Prayer-times editor** (R5 §10's one explicit "future settings" anchor) is intentionally **out of this More** — the brief's More list doesn't include it, and building it would gold-plate. Noted as the natural future home (writes `awba_prefs.prayerTimes` + `skyMode`), not built now.

---

*End DESIGN-DRAFT-B. Every string above is final copy for builders to paste. No scripture is invented anywhere; every citation surfaced carries the shipped `unverified · pending review` pill; all colour is `var(--token)`; all motion is the one easing family under both reduced-motion triggers.*
