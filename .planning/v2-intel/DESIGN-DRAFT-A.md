# DESIGN-DRAFT-A — v2 surfaces, "The Threshold Keeper"

**Author:** design lens A (ritual / arrival / emotional arc). **Date:** 2026-07-15.
**Scope:** onboarding · practice (hub + session) · profile · more · tab-bar integration.
**Authority:** ATHAR-SYSTEM.md (canon) → 03-UI-SPEC-ATHAR (executes it) → R0–R6 intel. Nothing
below overrides those; where I infer, I say so and flag it for the design-review gate.

**How to read this:** every surface below is buildable without me — register, layout, a component
manifest (shipped / new page-CSS / Wave-A engine seam), FINAL copy (copy-paste), motion (shipped verb
+ token duration), an a11y contract, edge states, and a per-page acceptance checklist. §8 consolidates
every engine change. §9 is the judgment-call ledger. The 10-line summary is my final message.

---

## 0 · Global rulings (bind every surface)

### 0.1 Register assignment (law 1 — one ground per screen)
| Surface | Ground | Why (reasoned from the spec's own logic) | Tab active-cue |
|---|---|---|---|
| **onboarding.html** | **ORBIT** (`.reg-orbit`, Kiswah) | the doorway into the sacred centre, before any Ring exists; form-free telling, not a reading/collecting surface. Same black world as home → crossing the threshold feels like a door opening in a room you're already in. | (no bar) |
| **practice.html** (hub) | **PAGE** (`.reg-page`, cream) | quizzes live on Page; the hub shares its session's ground so entering a set is one continuous cream world. | crimson |
| **practice/session.html** | **PAGE** + CIRCLE-drift open | R5 §2.1: practice = "PAGE-ground with CIRCLE-drift review-opening treatment" — matches the shipped quiz + review-milestone precedent exactly. | (no bar) |
| **profile.html** | **ORBIT** (`.reg-orbit`, Kiswah) | foregrounds the Ring + macro stats → Orbit (R5 §2.1). "A private ledger of light." | gold |
| **more.html** | **PAGE** (`.reg-page`, cream) | R5 §2.1: settings = the quietest, least-registered surface. "The quiet back room." | crimson |

**No surface invents a 6th register, a 2nd ground, or a bespoke gradient.** Festival is deliberately
**refused for onboarding**: Festival is threshold-*celebration* (≤9 rationed moments, "never daily
chrome"); onboarding celebrates nothing yet — you haven't earned. Stamping a plate here would land
the *real* first plate (circuit-1 chest) flat. Onboarding is arrival at the doorway, not at mastery.

### 0.2 Page depth, install trio, theme-color, paths
| Page | Depth | Asset paths | theme-color | Install trio | SW register | Tab bar |
|---|---|---|---|---|---|---|
| onboarding.html | root | `shared/…` | `#131013` | manifest+icon+SW (full, clone learn.html) | yes | no |
| practice.html | root | `shared/…` | `#F3EDE2` | SW-register only | yes | yes |
| profile.html | root | `shared/…` | `#131013` | SW-register only | yes | yes |
| more.html | root | `shared/…` | `#F3EDE2` | SW-register only | yes | yes |
| practice/session.html | **one level down** | `../shared/…` | `#F3EDE2` | none (like lessons) | no | no |

- **Why session lives one level down:** `AW.sound('correct'|'incorrect')` resolves `'../shared/sfx/…'`
  — only correct from a page one level below `shared/` (R1 §10). Wiring the shipped cue slots (D-52,
  silent placeholders) requires this depth. It also makes `../shared/` CSS/JS/font paths clone the
  lesson head verbatim.
- **Install-trio ruling:** the manifest link + apple-touch-icon stay on `learn.html`+`index.html`
  only (the canonical front door; `start_url` unchanged = `learn.html`). The 4 new root pages carry
  **only** the guarded SW-register script + their register-correct `theme-color`, so each participates
  in offline control/updates and paints the right address bar, without competing to be the start_url.
  Onboarding is the exception — give it the **full trio**, because a fresh install's very first render
  can be `learn.html`→(redirect)→`onboarding.html` offline; it must be a valid installable first paint.
- **Relative paths only**, no leading slash, `file://`-openable, classic `<script>`, no modules/defer.

### 0.3 Prefs keys (all via `AW.prefs.get/set` — never raw storage; the `installNudgeDismissed` precedent)
| Key | Type | Default | Owner | Purpose |
|---|---|---|---|---|
| `onboardingDone` | boolean | `false` | onboarding + learn boot | first-run redirect flag; also = "replay" detector |
| `displayName` | string | `''` | profile | optional on-device name (≤24 chars, sanitised) |

New **prefs** keys are cheap (additive, no schema bump — R1 §2). **Zero new `awba_state` schema keys.**
The only `awba_state` touch v2 needs is a *reset*, handled by a Wave-A method inside the sanctioned
storage owner (§8), never a raw `localStorage` call on any page (page storage-word count stays 0).

### 0.4 First-run redirect (loop-proof)
At the **top of learn.html's IIFE, before `render()`** (R3 §5 slot), synchronous:
```js
if (window.AW && AW.prefs && !AW.prefs.get('onboardingDone', false)) {
  location.replace('onboarding.html'); return;   // replace() = no history trap; return before touching #app (no flash)
}
```
- **Loop-proof:** onboarding.html **never** redirects away on its own — it only *sets* the flag on
  Begin/Skip, then `location.replace('learn.html')`. learn→onboarding fires only while the flag is
  false; onboarding→learn only after the flag is true. No cycle.
- **Deep links never trap:** only learn.html carries the check. A direct link to a lesson/review/
  practice page works and never redirects.

---

## A · ONBOARDING — the threshold

**Register:** ORBIT throughout (every pane). **One memorable move:** a single gold thread draws
itself once under pane 1's headline — the first stroke of the same thread that will slowly close
around the learner's Ring, one circuit at a time. The journey begins as an empty thread; the path
fills it. **The arc:** *arrive → be reassured → be invited* (3 panes, one page, an internal step
machine — no navigation between panes, like the runners).

### A.1 Layout (`onboarding.html`, `<main class="reg-orbit grain" id="app">`)
One centred column, `max-width:480px`, comfortable vertical rhythm. Per pane, top→bottom:
`onb-dots` (3-step indicator, top) → `onb-pane` (kicker? → Marcellus headline → body/rows →
`onb-thread` on pane 1 only) → `onb-foot` (Back? · primary CTA · Skip?). Content is swapped by a
`step` variable (0/1/2); the whole `#app` inner is rebuilt per step (learn.html precedent), listeners
re-attached each render.

**Pane composition:**
- **Pane 1 — Arrival:** Courier kicker `Awba · a returning` → Marcellus headline → body → the gold
  thread draws. Foot: **Continue** (gold-ghost `.btn.ghost`) · **Skip** (quiet Courier text button).
- **Pane 2 — Reassurance:** Marcellus headline → three `onb-promise` rows (glyph + name + line).
  Foot: **Back** (quiet) · **Continue** · **Skip**.
- **Pane 3 — Invitation:** Marcellus headline → body. Foot: **Back** · **Step onto the path**
  (primary; replay variant: **Back to the path**). No Skip (the CTA *is* the exit).

### A.2 FINAL copy (copy-paste)
**Pane 1**
- kicker: `Awba · a returning`
- headline (Marcellus, ≥28px): `You've found your way here.`
- body: `Awba is a companion for learning the foundations of belief — never a cop. You walk at your own pace, and nothing is ever held against you.`

**Pane 2**
- headline: `A gentler way to learn.`
- row 1 — glyph `spark`, name `Noor — light you gather`, line `Every answer you get right adds a little. It is never spent against you, and it never runs out.`
- row 2 — glyph `flame`, name `Returns — the days you come back`, line `The count only ever grows. Miss a day, a week, a year — it never breaks, and it never shows a gap.`
- row 3 — glyph `angle`, name `A wrong answer costs nothing`, line `You'll get a gentle word and a chance to look again. No red, no buzzer, nothing lost.`

**Pane 3**
- headline: `The path is yours.`
- body: `Fifteen short lessons and four gentle reviews are waiting — no finish line to race to. Come as often, or as rarely, as you like. The way will always be here.`

**Buttons/controls (all panes):** `Continue` · `Skip` · `Back` · `Step onto the path` · (replay) `Back to the path`.
**Indicator SR label:** `Step {n} of 3`.

### A.3 Flow / behaviour
- On load read `var replay = AW.prefs.get('onboardingDone', false);` — `false` = first-run (Skip shown,
  pane-3 CTA `Step onto the path`); `true` = replay from More (no Skip, pane-3 CTA `Back to the path`).
- **Begin / Step onto the path / Skip** all do the same two things: `AW.prefs.set('onboardingDone', true);`
  then `location.replace('learn.html')`. (Skip == a gentler Begin; both set the flag so it never re-nags.)
- **Continue / Back** just change `step` and re-render (no storage).
- **Replay entry:** More's "See the welcome again" row → `onboarding.html` (flag already true → replay mode).

### A.4 Component manifest
| Element | Source |
|---|---|
| `.reg-orbit .grain`, `.btn.ghost` (gold on dark), focus ring (gold, auto) | **shipped** |
| glyphs `spark`/`flame`/`angle` via `AW.icon` | **shipped** (GLYPHS, no new icon) |
| `.thread` + `ink-draw` (the one gold stroke) | **shipped** celebration primitive (draw verb) |
| `.onb-shell/.onb-dots/.onb-pane/.onb-kick/.onb-head/.onb-body/.onb-promise/.onb-thread/.onb-foot/.onb-skip` | **new page-CSS** (`@layer screens` block in onboarding.html) — composition only, zero new token/hex |
| `AW.announce`, `AW.reducedMotion`, `AW.prefs` | **shipped** |

`.onb-head`: `font:400 var(--fs-display) var(--font-display); color:var(--cream);` /* §2.1 cream on
Kiswah 16.22:1 — Marcellus display text ≥28px is law-5-legal on Orbit */. `.onb-kick`: `--font-marg`,
`--paper-62` /* 6.69:1 */. `.onb-body`: `--font-work`, `--paper-85`. `.onb-promise` name: Readex 600
`--cream`; line: `--paper-62`; glyph: `--icon-accent` (gold). `.onb-skip`: quiet Courier text button,
`--paper-62`→`--cream` on hover, 44px hit, native `<button>`, gold focus rides in.

### A.5 Motion (shipped verbs, token durations)
- **Pane mount** = Orbit **draw** (UI-scale): `opacity 0→1 + translateY(4px→0)` over `--dur-draw`
  (240ms), `var(--ease)`. Applied to `.onb-pane` on each step render.
- **The thread** (pane 1 only): `.thread` `ink-draw` over `--dur-draw`, `--len` set to its path length,
  plays **once** on first mount of pane 1, never on Back-revisits (guard with a `threadDrawn` flag → set
  `animation:none` on revisit). Decorative, aniconic, one stroke.
- **No ambient loops anywhere** (guard against motion-for-motion): the thread is the only motion beyond
  pane mounts. Panes 2/3 just draw-mount.
- **Reduced motion** (`prefers-reduced-motion` OR `[data-motion="reduce"]`): durations collapse to 1ms
  via the shipped `@layer motion` rule (draw-mount snaps in); `.thread`'s `--dur-draw` collapses → the
  stroke renders fully drawn, static. No page-authored motion overrides needed.

### A.6 A11y contract
- Each step render moves focus to `.onb-head` (`tabindex="-1"` + `.focus()`, the runner's `focusHeading`
  pattern) so SRs announce the new pane; do **not** also `AW.announce` on step change (avoids double-speak).
- `.onb-dots` carries `aria-hidden="true"`; expose `Step {n} of 3` via an `aria-label` on the pane
  wrapper or a visually-hidden line, updated per step.
- All controls native `<button>`; 44px min; visible gold `:focus-visible` (auto from Orbit grammar).
- No focus trap needed — onboarding is the whole document, Tab cycles naturally.
- Skip/Back/Continue keyboard-operable; `Skip` first in DOM order after the CTA is fine, but place the
  **primary CTA before Skip** in source so Tab reaches the forward action first.

### A.7 Edge states
- Direct visit to `onboarding.html` with flag already true → replay mode (deliberate, from More): no
  Skip, pane-3 CTA `Back to the path`. Never traps (CTA returns to learn).
- No JS / SW off / `file://` → page renders pane 1 statically; Continue/Begin are native controls that
  still function (buttons run inline JS; if JS is fully off the page is inert but the redirect that
  brought them here also wouldn't have fired — acceptable).
- Offline (installed): onboarding.html is precached (§8), works fully.

### A.8 Acceptance checklist
- [ ] One register only (`.reg-orbit`) on every pane; no 2nd ground, no bespoke gradient.
- [ ] Zero new hex / token / glyph; every value `var(--token)`; new CSS in one `@layer screens` block.
- [ ] No Arabic/scripture rendered (English product voice only) → clean under rtl-audit + glyph-coverage.
- [ ] Flag round-trips: first-run learn→onboarding→(Begin)→learn renders (no loop); replay from More works.
- [ ] Skip and Begin both set `onboardingDone=true`; no raw `localStorage` on the page (count 0).
- [ ] Thread draws once, static under both reduced-motion triggers; no ambient loop.
- [ ] Focus lands on the headline each pane; `Step n of 3` announced; 44px targets; gold focus rings.
- [ ] Full install trio + `theme-color #131013`; page added to precache + all gate discovery (§8).

---

## B · PRACTICE — returning to walk a path already walked

Two surfaces: **practice.html** (root, the tab landing) + **practice/session.html** (one level down,
the set experience). **Poetry:** practice is not new ground — it's a quiet re-walk of the path you've
finished, "you are never circling alone." The one memorable move is the **circle gathering** at the
open (CIRCLE drift), then stillness.

### B.1 Architecture ruling (the decision the brief asked me to make)
**Practice session is a page-authored runner, NOT `AwbaLesson`/`AwbaReview`, and NOT an engine
practice-mode seam.** It renders each item's markup with the shipped **`AW._beatHtml(item, cfg)`** and
reuses the shipped CSS component classes verbatim; it re-authors the compact check→resolve→retry
interaction to mirror the shipped `resolve()` semantics (same classes, same copy shapes).

*Why not reuse `AwbaLesson`/`AwbaReview` whole:* both **write stars, credit noor, `touchDay`, and run
the full reward choreography (Ring moment / rosette / du'a)** — that would inflate the economy for
re-answering old questions and fire celebration that practice must not. *Why not a `cfg.practice`
seam through `AwbaLesson`:* it threads a branch through the shipped runner's tested reward flow — the
opposite of R0's "smallest possible engine diff," and it risks the 1000+ shipped tests. The
page-authored runner yields **zero engine JS/CSS change for the runner itself** and leaves the shipped
runners untouched. (Judgment-call tradeoff — divergence risk of re-authored interaction — logged §9.)

**No runtime collector hook** is added to `AwbaLesson`/`AwbaReview`: the pool is built **dev-time** by
re-using `validate-content.js`'s `node:vm` `ingest()` (R1 §7, R6 §4), so no engine seam is needed for
extraction either.

### B.2 The item pool (`shared/practice-pool.js`, dev-time generated)
- **Content:** every `mc`/`tf`/`tile` quiz beat from the **15 lesson** cfgs, **byte-verbatim** (no
  `verse`/`read`/`panel`/`depth`/`reflect`; reviews excluded — reviews are their own surface). Because
  items are exact substrings of already-harvested lesson content, they display no new scripture and no
  new codepoints.
- **Shape** (classic script assigning a global — file://-safe, no fetch):
  ```js
  window.AWBA_PRACTICE_POOL = {
    generated: 'YYYY-MM-DD',                 // provenance
    lessons: { u1m1: { refs:{…}, terms:{…} }, … },   // each lesson's refs+terms, verbatim (for AW.wire)
    items: [ { lesson:'u1m1', idx:4, t:'mc', item:{ q, o, c, good, gentle, quote? } }, … ]
  };
  ```
- **Extractor** `scripts/build-practice-pool.js` (dev-run, like font-subsetting — "data prep, not a
  build step"): reuse `ingest()` from `validate-content.js`; for each lesson capture `cfg`; walk
  `cfg.beats` for `t∈{mc,tf,tile}`; emit `{lesson:cfg.id, idx, t, item}` + `cfg.refs`/`cfg.terms`.
  Never regex the object literal; capture via the vm sandbox (its `AW.cite` stub returns real markup so
  embedded citation ids survive verbatim).
- **Fidelity gate** `scripts/tests/practice-pool-audit.mjs` (NEW, Wave A) — follows
  `port-audit.mjs`'s `checkDailyFidelity` shape: re-`ingest()` the 15 lessons at gate time, re-derive
  the item set, and assert each pool item **deep-equals** its source beat (canonicalised → SHA or
  structural equal). Prints `PRACTICE POOL OK` / `PRACTICE POOL DRIFT <lesson> #<idx>`; runs even before
  the pool exists (`OK — not yet present`). This makes the pool provably unable to drift from Josh's
  byte-frozen content.

### B.3 Noor ruling — **NO noor, NO stars, NO state writes at all**
Practice awards nothing and writes nothing to `awba_state`. Rationale (recommended, mark
owner-reviewable per R0):
1. **The shipped system already has this precedent:** review *circle-back* replays "earn 0 noor"
   (R1 §3). Practice is exactly circle-back — revisiting to strengthen. Match it.
2. **Protects the economy:** a modest ≤+5/correct would still be farmable on a re-answerable pool,
   inflating the "light you gathered as you learned" meaning without bound.
3. **Honours "practice is for you":** a gift to yourself, not a transaction. No score, no grade, no
   stars, no Ring change, no Festival.
4. **Zero writes = zero coupling** to the persistence layer = the smallest, safest runner (read-only
   against `awba_state`).
- **`touchDay` too? No.** Practice does **not** credit returns either — the streak's meaning stays tied
  to *learning* (lessons/reviews), and the surface stays 100% read-only. (Flagged owner-reviewable §9:
  "should practising count as a return?" — recommend no for v2.)

### B.4 Session length + sampling
- **Length: 8 items** per set (or all of them if the eligible pool has < 8).
- **Eligibility:** items whose `lesson` id has a star entry (`AW.state().stars[lesson]` present) —
  "completed lessons only." Completion = star presence (legitimate direct read; not reimplementing
  unlock logic — no locked/available distinction is shown here).
- **Sampling — seeded shuffle, NOT `Math.random`:** inline a ~6-line `mulberry32(seed)` (page-private,
  a generic util — the Ring's PRNG family; not religious/design content), Fisher-Yates the eligible
  list, take the first 8. **Seed = `Date.now()`** (a per-session nonce) so successive sets vary.
  - This is lawful because **practice has no reward path** (no noor/stars/Ring depend on the order) —
    the "no `Math.random` on reward paths" rule doesn't bind a zero-stakes selection, and we still avoid
    `Math.random` (mulberry32 from a nonce). If a fully reproducible build is ever wanted, swap the seed
    to `AW.ringSeed()` (stable-but-unique-per-learner order). Recommend the nonce for variety.

### B.5 practice.html (the hub, PAGE/cream, carries the tab bar)
Layout: header (`.pr-kick` Courier `Practice` → `.pr-title` Readex-600 h1 — Page titles are Readex,
not Marcellus, law 5) → framing body → honest depth line → primary CTA → tab bar. No noor/returns HUD
(Profile owns stats); keep it a calm, focused hub.

**State 1 — has completed content (eligible pool ≥ 1):**
- kick: `Practice`
- title: `Walk a path you've already walked.`
- body: `Practice gathers questions from the lessons you've finished, so you can look again — gently, at your own pace. Nothing here is scored, and nothing is ever lost. It's just for you.`
- depth line (Courier `.pr-depth`): `{N} questions ready · from {M} lessons finished`
- CTA (`.btn`, crimson): `Begin a set` → `practice/session.html`
- CTA sub-line (Courier): `8 questions, drawn from what you've finished.` (if eligible < 8: `{N} questions, drawn from what you've finished.`)

**State 2 — empty (nothing completed):** honest gentle nudge, never a dead end. Reuse the shipped
`.ocs-body / .ocs-ic / .ocs-line` coming-soon composition (beads scene icon + one calm line) + a CTA:
- kick: `Practice`
- title: `Practice opens as you go.`
- icon: `beads` (`AW.icon('beads',{size:'40px'})`), `--crimson` (Page)
- line: `Once you've finished your first lesson, its questions gather here — ready whenever you'd like to look again. Your path is the place to start.`
- CTA (`.btn`): `Back to the path` → `learn.html`

### B.6 practice/session.html (the set, PAGE/cream, NO tab bar)
Clone the **lesson** head template (`../shared/…`, `theme-color #F3EDE2`, preload readex-400 +
amiri-quran-400). Load `../shared/awba-engine.js` then `../shared/practice-pool.js` (both classic).
`<body>` root `<main class="reg-page grain" id="app">`; page-authored runner drives it.

**Screen anatomy (top→bottom):**
- **HUD** = `.ls-hud`: left Courier kicker `Practice`; right `.ls-stats` holding the `.ls-count`
  `{i} / {n}` + the shipped mute toggle `AW.muteBtnHtml()` (id `#lsmute`), wired via
  `AW.bindMuteBtn(rerenderStage)`.
- **The circle-gathering opener** (`.pr-drift`, the one move): 3 shipped `.dab`s with
  `animation-delay:0/40/80ms` settle beneath the kicker on session start, then still. Plays once.
- **Stage** = `.stage` mounting `AW._beatHtml(current.item, cfg)` where `cfg = { refs, terms }` is the
  merged union of the eligible lessons' refs/terms (so `AW.wire(stage, cfg)` binds any `.cite`/`.term`
  taps → the shipped citation/term sheets, which carry the pending pill automatically).
- **Foot** = `.foot`: one primary control. Before a pick: `Check` (`disabled` until an option is
  chosen — real `disabled`, a11y). After correct: `Continue`. After wrong: the shipped `.btn.retry`
  `Try again` (rose FRAME only).

**Interaction (mirror the shipped `resolve()` exactly, reusing shipped classes):**
- pick option → `.opt`/`.tf`/`.tile` selected; enable `Check`.
- on `Check`, `ok = (chosen === correct)`:
  - **correct** → mark `.opt.correct` (shipped gold dot draws); praise line cycling the **shipped**
    `PRAISE = ['That's it.', 'Beautiful.', 'Exactly right.', 'Masha'Allah.']` by `correctCount % 4`;
    `AW.sound('correct')`; `AW.announce('Correct.')`; foot → `Continue`.
  - **wrong** → `.opt.wrong` (grey ink-blot fade, law 8, never red/flash); `.opt-why` = `item.gentle`;
    line `'Nothing lost. ' + item.gentle`; `AW.sound('incorrect')`; `AW.announce('Not quite — look again.')`;
    foot → `.btn.retry` `Try again` (re-enables options, clears marks). **No noor, no score change.**
- `Continue` → next item (`focusHeading` to the new question); after item 8 → completion screen.

**Completion (PAGE, calm — NO Festival, NO Ring, NO rosette, NO celebration primitive):**
- title (`.pr-done` heading): `Well walked.`
- body: `You looked again at {n} questions from the lessons you've finished. Nothing here is scored — this was just for you.`
- optional gentle note (Courier, non-graded): `{m} of them came right away.`
- CTAs: `.btn` `Practise another set` (→ reload `session.html` for a fresh nonce/8) · `.btn.ghost`
  `Back to the path` (→ `../learn.html`).

**Session empty edge** (direct nav with nothing completed / eligible pool 0): render a calm inline
state — title `Nothing to practise yet` + line `Finish a lesson first, and its questions gather here.` +
`.btn` `Back to the path` (`../learn.html`). Never a blank/dead screen.

### B.7 Component manifest (both practice surfaces)
| Element | Source |
|---|---|
| `.reg-page .grain`, `.stage`, `.ls-hud/.ls-stats/.ls-count`, `.foot`, `.opt/.tf/.tile`, `.opt.correct/.opt.wrong/.opt-why`, `.btn/.btn.retry/.btn.ghost`, `.ocs-body/.ocs-ic/.ocs-line`, `.dab`+drift, `.cite/.term` | **shipped** |
| `AW._beatHtml`, `AW.wire`, `AW.sheetRef`, `AW.sheetTerm`, `AW.icon('beads')`, `AW.muteBtnHtml`, `AW.bindMuteBtn`, `AW.sound`, `AW.announce`, `AW.reducedMotion`, `AW.state` | **shipped** |
| `shared/practice-pool.js` + `build-practice-pool.js` + `practice-pool-audit.mjs` | **new (Wave A data + gate)** |
| `.pr-kick/.pr-title/.pr-depth/.pr-drift/.pr-done` + session runner JS | **new page-CSS/JS** (`@layer screens` + inline classic script) |
| page-private `mulberry32` | **new page-JS** (generic util; not on `AW`) |
| tab bar (`.otabs` markup + `.reg-page .otabs` cream seam) | **shipped markup + Wave-A 1-rule seam (§E, §8)** |

### B.8 Motion
- **Circle-gathering opener:** shipped `.dab` **drift** `--dur-drift` (300ms), staggered `animation-delay`
  0/40/80ms, once; renders settled under reduced motion (shipped `.dab {animation:none}` rule).
- **Item mount / resolve:** shipped `.opt` `settle` (`--dur-settle` 260ms); `.opt.correct` gold-dot draw
  (shipped). Press = the one paper-press (`--dur-press` 140ms). All reduced-motion-safe (shipped).
- **No noor count-up, no Ring, no rosette, no stamp** anywhere in practice.

### B.9 A11y contract
- Options/Check/retry/Continue/CTAs all native `<button>`/`<a>`; `Check` uses real `disabled`.
- `focusHeading` (tabindex=-1 + focus) to each item's question on advance; `AW.announce` on every
  resolve and on retry ("Look again."). Citation/term taps use `AW.sheet` (shipped trap + Esc + cream).
- 44px targets; crimson `:focus-visible` (auto, Page ground); `#lsmute` present so `AW.bindMuteBtn` binds.
- The `.pr-drift` dabs are `aria-hidden="true"` decoration.

### B.10 Acceptance checklist
- [ ] Session is page-authored (no `AwbaLesson`/`AwbaReview` call); shipped runners untouched.
- [ ] Zero writes to `awba_state` (no noor, no stars, no `touchDay`); page storage-word count 0.
- [ ] Pool items byte-verbatim; `practice-pool-audit` prints OK; no new scripture/codepoints.
- [ ] `AW.sound('correct'/'incorrect')` resolves (session is one level down); `#lsmute` wired.
- [ ] Sampling uses `mulberry32`(nonce) — no `Math.random`; length 8 (or all if fewer).
- [ ] Wrong = grey ink-blot + `.opt-why` + rose retry frame; never red/flash/shake; copy = "Nothing lost. …".
- [ ] Completion is calm Page — no Festival/Ring/rosette; empty + direct-nav-empty states handled.
- [ ] practice.html carries the cream tab bar (Practice active, crimson); session carries none.
- [ ] Both pages added to precache + gate discovery; `practice/` dir added to auto-discovery (§8).

---

## C · PROFILE — a private ledger of light

**Register:** ORBIT (Kiswah). **The hero + the one memorable move:** the learner's **Ring**, mounted
**static** (law 9 — `AW.ringSVG` **without** `animateFrom`) — the same seeded fingerprint as home, now
alone in the black world like a seal. Its meaning is the poetry: *no two paths are inked the same;
this one is yours.* Everything else is a quiet ledger read entirely through `AW.*`.

### C.1 Layout (`profile.html`, `<main class="reg-orbit grain" id="app">`, top→bottom)
1. **Greeting + optional name** — `.pf-greet` (`{Name}'s path` / `Your path`) + the name affordance (C.4).
2. **Ring hero** — `.pf-ring` mounting `AW.ringSVG({ atomsDone: AW.atomsDone(AW.state()), size: 300 })`
   (**no `animateFrom` → static**, law 9); Courier caption `.pf-cap` `{atoms} of 61 inked`; the
   uniqueness line `.pf-unique`.
3. **Stat ledger** — `.pf-stats` grid of `.pf-stat` (Marcellus numeral + Courier label). noor/returns
   tiles are tappable → the shipped streak/noor sheets (C.3).
4. **Week constellation** — the shipped promise line + `AW.weekCal()` dots.
5. **Per-unit progress** — 4 `.pf-unit` rows (scene icon + English title + thermal lesson-dabs + count).
6. **Privacy line** — `.pf-priv` (lock glyph + on-device honesty) + a pointer to More for Start-over.
7. **Tab bar** — Profile active, GOLD cue (Orbit).

### C.2 State reads (zero direct storage — `AW.*` only)
- Ring: `AW.ringSVG({ atomsDone: AW.atomsDone(AW.state()), size: 300 })` — static, seed from
  `AW.ringSeed()` internally. **Denominator = 61** (the engine's own `structure.atoms` default and what
  the Ring's `aria-label` reports; `NODE_ATOMS` sums 61; `learn-state.test` pins 61). **Flagged §9** as
  owner-confirmable (61 vs 65).
- noor `AW.state().noor`; returns `AW.state().returns`; atoms `AW.atomsDone(AW.state())`; stars total
  = `Object.values(AW.state().stars).reduce((a,b)=>a+b,0)`; week `AW.weekCal()`.
- **Per-unit completion via star presence** (not `deriveNodeState`): a `.pf-stat`/dab reads
  `AW.state().stars[lessonId]` present → **done** (`mastered` gold dab + check), absent → **not-yet**
  (hollow ring). Profile shows *completion*, not navigational unlock (no locked/available), so star
  presence is the faithful read — it is exactly what `deriveNodeState` uses for `done`; this is **not**
  reimplementing unlock logic.
- **Per-unit grouping** uses a small **page-private** structure array (unit titles + lesson-id lists):
  ```js
  var PF_UNITS = [
    { u:1, title:'The Foundation', lessons:['u1m1','u1m2','u1m3','u1m4'] },
    { u:2, title:'The Drift',      lessons:['u2m1','u2m2','u2m3','u2m3b'] },
    { u:3, title:'The Heart of It: Tawhid', lessons:['u3m1','u3m2','u3m3'] },
    { u:4, title:'The Pillars',    lessons:['u4m1','u4m2','u4m2b','u4m3'] }
  ];
  ```
  Icons from `AW.UNIT_ICON['u'+u]` (shipped). This duplicates ~15 ids + 4 titles from learn.html's
  `UNITS` (not SHA-gated content) to keep Wave B self-contained — **flagged §9**; recommended
  fast-follow is hoisting `UNITS`→`shared/course-structure.js`.

### C.3 Returns / noor taps → shipped sheets
Reuse the **Wave-A** `AW.streakSheet()` and `AW.noorSheet()` (§8) so the Returns tab **and** the
tappable returns/noor stat tiles open the exact shipped `.osh-*` cream sheets (identical to learn.html,
zero drift). If those seams are declined, re-author the ~8-line builders page-privately
(`.osh-hero/.osh-big/.osh-gold/.osh-sub/.osh-week/.osh-note` + `AW.weekCal` + `AW.sheet`).

### C.4 Optional display name — **YES, worth it**
A private ledger reads as *yours* with a name; cost is one prefs key + a small input. Design:
- **No name set:** greeting `Your path` + a quiet `.pf-addname` ghost button `Add your name`.
- **Tap** → reveal an inline `.pf-name-edit`: native `<input type="text" dir="auto" maxlength="24">`
  (label/aria `Your name — shown only on this device`) + `.btn` `Save` + quiet `Cancel`. `dir="auto"`
  handles any-script names in the workhorse font (law 4). Focus moves into the input.
- **Save** → `var v = input.value.trim().slice(0,24);` (sanitised; set via `textContent`, never
  `innerHTML`); `AW.prefs.set('displayName', v)`; `AW.announce('Name saved.')`; greeting → `{v}'s path`
  (or `Your path` if empty). `Escape`/`Cancel` reverts, restores focus to the affordance.
- **Name set:** greeting `{Name}'s path` + a quiet `Edit` button (same editor).
- Input styling (dark ground): `background:transparent; color:var(--cream); border:1px solid var(--edge);
  border-radius:var(--r-2);` gold `:focus-visible` (auto).

### C.5 FINAL copy
- greeting: `{Name}'s path` / `Your path`; add: `Add your name`; edit: `Edit`; input label:
  `Your name — shown only on this device`; buttons `Save` / `Cancel`; save announce `Name saved.`
- Ring caption: `{N} of 61 inked`
- uniqueness line: `No two paths are inked the same. This one is yours.`
- stat labels: `noor gathered` · `returns` · `of 61 learned` · `stars earned`
- week line: `{N} returns · your streak never breaks` · sub Courier `this week`
- per-unit count (Courier): `{done} / {total} lessons`
- privacy line: `Everything here lives on this device only — no account, no sign-in, nothing sent anywhere. You can clear it any time from More.`

### C.6 Component manifest
| Element | Source |
|---|---|
| `.reg-orbit .grain`, `.ring` (via `AW.ringSVG`), `.weekcal .day/.here` (Orbit styling), `[data-state]` thermal dabs (not-yet/mastered), glyphs (`lock`/`star`/`check`/`spark`/`flame`), scene icons (`AW.UNIT_ICON`), `.btn/.btn.ghost`, `.osh-*` sheets | **shipped** |
| `AW.ringSVG`(no animateFrom), `AW.atomsDone`, `AW.state`, `AW.weekCal`, `AW.ringSeed`, `AW.icon`, `AW.announce`, `AW.prefs`, `AW.sheet` | **shipped** |
| `AW.streakSheet()` / `AW.noorSheet()` | **Wave-A seam (recommended) or page-re-author** |
| `.pf-greet/.pf-addname/.pf-name-edit/.pf-name-input/.pf-ring/.pf-cap/.pf-unique/.pf-stats/.pf-stat/.pf-week/.pf-unit/.pf-udabs/.pf-priv` | **new page-CSS** (`@layer screens`) |
| `PF_UNITS` structure array | **new page-JS** (small duplication, §9) |
| **D-55 sprout garden** | **deferred** — needs `AW.SPROUTS`/`AW.sproutFor` hoist (§9); not in v2 first cut |

`.pf-stat` numeral: `font-family:var(--font-display); color:var(--cream);` /* §2.1 16.22:1 */ — noor
+ stars numerals use `color:var(--gold)` /* §2.1 8.40:1 */. Labels `--font-marg`, `--paper-62` /*
6.69:1 */. Per-unit dabs use shipped `[data-state="mastered"|"not-yet"]` (on Orbit: mastered = gold
fill no keyline; not-yet = `--powder` border) — the shipped dark-ground overrides apply automatically.

### C.7 Motion
- Page content mounts on the Orbit **draw** (opacity+translateY(4px), `--dur-draw`). **The Ring renders
  static** — never `animateFrom` on Profile (law 9); a mount on every visit must not replay a draw.
- Name-editor reveal: instant (or a `--dur-fade` opacity), reduced-motion-safe.
- Sheets: shipped `AW.sheet` settle (`--dur-sheet`). No ambient loops, no celebration.

### C.8 A11y contract
- Ring `<svg role="img" aria-label="Tawaf ring — N of 61 inked">` (shipped from `ringSVG`).
- Name affordance/editor: native controls; input has a real label; focus into input on reveal, back on
  save/cancel; `Escape` cancels; `AW.announce('Name saved.')`.
- Tappable returns/noor tiles are native `<button>`s with `aria-label` (e.g. `{N} returns — open your
  streak`); sheets use the shipped trap.
- Per-unit dabs: shape-first (`[data-state]`), each unit row has an accessible summary
  (`aria-label="{title}: {done} of {total} lessons complete"`); dabs themselves `aria-hidden`.
- 44px targets; gold `:focus-visible` (auto). Static-name gate render (empty name) → no user Arabic in
  the swept DOM → rtl-audit clean.

### C.9 Edge states
- Zero progress (fresh learner reaching Profile): Ring renders at 0 (no head-dot, shipped), caption
  `0 of 61 inked`, stats all 0, empty week (all un-lit dots — never a gap/red), all units not-yet. The
  uniqueness line still holds (their seed is already unique). Calm, honest, never shaming.
- `AW.S.isFallback()` true (newer blob): reads still work (defensive copies); display is read-only, no
  writes attempted except the name (a prefs write, separate blob) — safe.

### C.10 Acceptance checklist
- [ ] One register (`.reg-orbit`); Ring is the only macro map; mounted **static** (no `animateFrom`).
- [ ] All state via `AW.*` (0 direct storage); no `deriveNodeState` reimplementation (completion = star presence).
- [ ] Denominator 61 shown consistently with the Ring's own label; flagged owner-confirmable.
- [ ] Per-unit uses shipped thermal shapes; week never shows a gap/red; noor/returns tiles open shipped sheets.
- [ ] Optional name: prefs key `displayName`, sanitised, `dir="auto"`, on-device only; privacy line present.
- [ ] Zero new hex/token/glyph; new CSS in one `@layer screens` block; gold focus rings (auto).
- [ ] SW-register + `theme-color #131013`; added to precache + all gate discovery (§8); Profile tab gold-active.

---

## D · MORE — the quiet back room

**Register:** PAGE (cream) — "the one screen where 'quiet' is taken most literally" (R5 §2.1). No Ring,
no Sky tint, no thermal dabs, no celebration. **IA: sections of settings rows** — a scannable list of
`.sheet-row`-press rows grouped under quiet section headers; toggles inline, navigations as links,
explainers open the shipped `AW.sheet`, Start-over runs a calm double-confirm. Version/credits sit at
the foot as Courier marginalia. **The memorable note:** even the destructive action speaks in mercy —
the calm default is always *keep*.

### D.1 Layout (`more.html`, `<main class="reg-page grain" id="app">`, top→bottom)
Header (`.mr-kick` Courier `More` + `.mr-title` Readex-600 `Settings & about`) → 5 sections → foot →
tab bar (More active, crimson).

**§ Sound & motion**
- **Sound** — `.mr-row`: label `Sound` + sub `Calm cues as you learn` + the shipped
  `AW.muteBtnHtml()` (`#lsmute`) on the right; wire `AW.bindMuteBtn()`. Toggles `awba_prefs.soundMuted`
  + `<html data-sound="muted">`. (Cues are silent placeholders, D-52 — the toggle is the real pref.)
- **Reduce motion** — `.mr-row` with an authored `.mr-switch` (native `<button role="switch"
  aria-checked>`): label `Reduce motion` + sub `Calms animations across Awba. Your device setting is always respected too.`
  On toggle: `AW.prefs.set('motion', on?'reduce':'system')` + set/remove `<html data-motion="reduce">`
  + `AW.announce`. Knob transitions on `transform var(--dur-press) var(--ease)`, reduced-motion-safe.

**§ The path**
- **See the welcome again** — `.mr-row` as `<a href="onboarding.html">` (replay; flag already true) +
  a chevron affordance.
- **How Awba works** — `.mr-row` `<button>` → opens the how-it-works sheet (D.3).

**§ Honesty**
- **About the sources** — `.mr-row` `<button>` → opens the sources sheet (D.3), the pending-review posture.

**§ Your device**
- **Add to your home screen** — `.mr-row` `<button>` → install-help sheet (D.3). If
  `matchMedia('(display-mode: standalone)').matches || navigator.standalone` → replace with a static
  row `On your home screen ✓` (no sheet). (No dependence on a captured `beforeinstallprompt`.)
- **Start over** — `.mr-row` `<button>` (quiet, NOT alarm-red) → the double-confirm flow (D.4).

**§ About** (foot marginalia, `.mr-about`, Courier `--ink-62`)
- `Awba · version 2.0`
- `A companion, not a cop.`
- `Every citation is pending scholarly review.`

### D.2 FINAL copy — rows
- Sound: label `Sound` · sub `Calm cues as you learn`
- Motion: label `Reduce motion` · sub `Calms animations across Awba. Your device setting is always respected too.`
- Welcome: `See the welcome again`
- How: `How Awba works`
- Sources: `About the sources`
- Install: `Add to your home screen` · (installed) `On your home screen`
- Start over: `Start over` · sub `Clear your progress and begin fresh.`

### D.3 FINAL copy — explainer sheets (shipped `AW.sheet`, cream)
**How Awba works** (label `How Awba works`):
> `Awba teaches the foundations of belief in small steps — fifteen lessons and four reviews, walked at your own pace.`
> `Noor is light you gather as you learn. It is never spent against you, and never runs out.`
> `Returns counts the days you come back. It only grows, and it can never break.`
> `A wrong answer is never punished — a gentle word, and a chance to look again.`
> `No accounts, no streaks to lose, nothing to buy. Just a path, and light to walk it by.`

**About the sources** (label `About the sources`):
> `Every verse and hadith in Awba is shown with its reference and marked unverified · pending review.`
> `That marker is honest, not a formality: the wording is still being checked by qualified scholars before it can be called approved.`
> `Until then, please treat every citation as a draft, and return to a teacher or a trusted printed source for anything you rely on.`
> `We would rather show our work and our uncertainty than imply a certainty we haven't earned.`

**Add to your home screen** (label `Add to your home screen`) — feature-detect the platform line:
> (iOS/Safari — `'standalone' in navigator`) `In Safari, tap Share, then choose Add to Home Screen.`
> (other) `Open your browser menu and choose Add to Home Screen, or Install.`
> `Your path opens in a tap, and works offline once it's there.`

### D.4 Start-over — calm double-confirm (mercy voice, never red, keep = default)
Uses two sequential `AW.sheet` cream sheets. In both, the **primary/prominent** button is the *keep*
action; the destructive action is the quieter ghost. Never red, no shake, no drama.
- **Sheet 1** (label `Start over?`):
  > `Start over?`
  > `This clears your noor, your returns, and every star — and inks a fresh path. Your settings and your name stay. It can't be undone.`
  - buttons: `.btn` `Keep everything` (primary → close) · `.btn.ghost` `Start over` (→ sheet 2)
- **Sheet 2** (label `One more time`):
  > `One more time — are you sure?`
  > `Once cleared, your light and your returns can't be brought back. You can always begin again from here.`
  - buttons: `.btn` `No, keep it` (primary → close) · `.btn.ghost` `Yes, clear it` (→ reset)
- **On `Yes, clear it`:** `AW.S.reset()` (Wave-A §8 — re-inits `awba_state` to defaults, drops
  `ringSeed` so a **fresh fingerprint** mints next Ring; settings/prefs untouched). Then close, and open
  a brief confirmation sheet:
  > `A fresh path begins.`
  > `Your light and returns are cleared, and a new ring is waiting to be inked.`
  - button: `.btn` `Back to the path` (→ `learn.html`).
  - `AW.announce('Your progress has been cleared. A fresh path begins.')`.

**Why not `localStorage.removeItem`:** pages have zero direct storage access — reset must go through the
sanctioned owner. `AW.S.reset()` reuses the engine's existing `defaultState()`+`persist()` (adds **no
new `localStorage` literal** → the 13-count invariant holds). Because a defaults blob then exists,
legacy-key re-migration never fires (D-15 keys stay orphaned, harmless). Settings (`awba_prefs`:
`soundMuted`/`motion`/`displayName`/`onboardingDone`) are deliberately **not** cleared — Start-over
resets *progress*, not preferences.

### D.5 Component manifest
| Element | Source |
|---|---|
| `.reg-page .grain`, `.sheet-row`/`.osw-row` press grammar, `.btn/.btn.ghost`, `.osh-note`-style sheet prose, `AW.muteBtnHtml/.bindMuteBtn`, `AW.sheet`, `AW.announce`, `AW.prefs` | **shipped** |
| `AW.S.reset()` | **Wave-A seam (§8)** |
| `.mr-kick/.mr-title/.mr-sec/.mr-row/.mr-label/.mr-sub/.mr-switch/.mr-chev/.mr-about` | **new page-CSS** (`@layer screens`) |
| chevron / switch-knob | **inline aria-hidden SVG** (D-55 doodle precedent — not a new `AW.GLYPHS` entry) |
| tab bar `.otabs` + `.reg-page .otabs` cream seam | **shipped + Wave-A seam (§E, §8)** |

`.mr-switch` (native `role="switch"`): track `background:var(--rule)`→`var(--crimson)` when
`aria-checked`; knob `background:var(--cream)`, transform on `--dur-press`; 44px hit; crimson focus (auto).
`.mr-row` reuses `.sheet-row` press (`translateY(1px)` + faint crimson `:active` wash). `.mr-sub`
`--ink-62` /* 5.02:1 */. `.mr-about` Courier `--ink-62`.

### D.6 Motion
- Row press = the one paper-press (`--dur-press`). Switch knob = `transform var(--dur-press) var(--ease)`,
  reduced-motion collapses (the motion toggle itself must not animate under reduced motion — the
  `@layer motion` collapse handles it). Sheets = shipped `AW.sheet` settle (`--dur-sheet`). No ambient loops.

### D.7 A11y contract
- Every row is a native `<button>`/`<a>`; toggles carry state (`aria-pressed` for `#lsmute`,
  `aria-checked` for `.mr-switch`); labels/subs are real text (icon-only controls carry `aria-label`).
- Sheets use the shipped `AW.sheet` (focus trap, Esc, cream); `Escape` cancels Start-over at any step
  (= keep). `AW.announce` on motion toggle + on reset.
- 44px targets; crimson `:focus-visible` (auto, Page). Chevrons/knobs `aria-hidden`.

### D.8 Edge states
- Already installed → install row shows `On your home screen` (no sheet).
- `AW.S.isFallback()` true → Start-over's reset may not persist (protective session-fallback); the
  confirmation still shows — acceptable rare edge; note to builder that reset calls `persist` directly.
- Reduced motion already on (system) → the switch reads its `awba_prefs.motion` state; toggling to
  `system` doesn't override the OS setting (both triggers independent — honest sub-copy says so).

### D.9 Acceptance checklist
- [ ] One register (`.reg-page` cream); no Ring/Sky/thermal/celebration on the page.
- [ ] Sound uses the shipped `#lsmute` component; motion writes `awba_prefs.motion` + `[data-motion]`.
- [ ] Start-over is a calm double-confirm; keep = default/primary; never red; `AW.S.reset()` (no raw storage).
- [ ] Reset clears `awba_state` only (progress), not prefs/name/onboarding flag; fresh ring seed mints.
- [ ] Explainer + sources + install copy present verbatim; sources sheet carries the honest posture.
- [ ] Zero new hex/token/glyph (chevron/switch = inline aria-hidden SVG); new CSS in one `@layer screens`.
- [ ] SW-register + `theme-color #F3EDE2`; cream tab bar (More active, crimson); precache + gate discovery (§8).

---

## E · TAB BAR INTEGRATION

Five tabs, shipped order + icons: **Learn** `lamp` · **Practice** `beads` · **Returns** `flame` ·
**Profile** `man` · **More** `pattern`. (`man` is a shipped tab icon — aniconism note acknowledged, it
stays.)

### E.1 Which pages carry the bar
| Page | Bar? | Active tab | Register / cue |
|---|---|---|---|
| learn.html | yes | Learn | Orbit / gold |
| practice.html | yes | Practice | Page / crimson |
| profile.html | yes | Profile | Orbit / gold |
| more.html | yes | More | Page / crimson |
| onboarding.html | **no** | — | pre-path threshold |
| lesson / review / practice/session.html | **no** | — | immersive, tab-free (shipped convention) |

### E.2 Real navigation (replaces the coming-soon stubs)
- **Learn / Practice / Profile / More** become real destinations. On each page, the **inactive** tabs
  are `<a class="tab" href="…">` (native nav — file://-safe, and gets the shipped cross-document
  `@view-transition` morph **for free**, no per-page code; scripture never carries a VT name so nothing
  to guard). The **active** tab is a `<button class="tab active" aria-current="page">` that scrolls to
  top (the shipped Learn-tab behaviour, generalised).
- **Returns** stays a `<button class="tab">` opening the streak sheet **everywhere** (never navigates) —
  via the Wave-A `AW.streakSheet()` (§8), identical on all four pages. **On learn.html it already works
  (openStreakSheet) — do not touch it.**
- **learn.html Wave-C rewire:** replace only the three `comingSoonSheet(...)` handlers (Practice /
  Profile / More) with navigation to `practice.html` / `profile.html` / `more.html`; leave the Learn
  (scroll-to-top) and Returns (streak sheet) handlers untouched. `comingSoonSheet` becomes unused by the
  bar and may be removed (the course-switcher's `COMING SOON` rows are a *separate* feature and **stay**).
- **Course switcher stays coming-soon** (Fiqh/Seerah/Qur'an permanent `COMING SOON` pills) — untouched.

**New-page tab builder** (mirror the shipped `tab()` helper, but inactive tabs are real links):
```js
function tab(id, active, scene, label, href) {
  if (active) return '<button class="tab active" type="button" id="'+id+'" aria-current="page">'
    + '<span class="otab-ic">'+AW.icon(scene)+'</span>'+label+'</button>';
  if (href)   return '<a class="tab" id="'+id+'" href="'+href+'"><span class="otab-ic">'+AW.icon(scene)+'</span>'+label+'</a>';
  return      '<button class="tab" type="button" id="'+id+'"><span class="otab-ic">'+AW.icon(scene)+'</span>'+label+'</button>'; // Returns
}
// e.g. practice.html:
// tab('tabLearn',false,'lamp','Learn','learn.html') + tab('tabPractice',true,'beads','Practice')
// + tab('tabReturns',false,'flame','Returns')  [wired → AW.streakSheet()]
// + tab('tabProfile',false,'man','Profile','profile.html') + tab('tabMore',false,'pattern','More','more.html')
```
Re-attach the Returns click (`AW.streakSheet`) after every render (learn.html precedent — full innerHTML
rebuilds).

### E.3 Register consequence for the bar (the dark-vs-cream ruling)
The bar is the **same `.otabs` markup** on every page; only the container ground differs:
- **Orbit pages (learn, profile):** the shipped `.otabs` exactly — `background: color-mix(in srgb,
  var(--kiswah) 90%, transparent)`, `border-top: 2px solid var(--navy)`, `backdrop-filter: blur(8px)`;
  inactive labels `--paper-62`, icons gold (`.reg-orbit .tab svg{color:var(--icon-accent)}`), active
  **gold** label + gold 2px top-rule (`.reg-orbit .tab.active` override). **No change** — reuse verbatim.
- **Cream pages (practice, more):** the **base** `.tab` rules already produce the correct cream-bar
  behaviour — inactive `--ink-62`, active **crimson** label + crimson 2px top-rule (`.tab.active`),
  active icon crimson (`.tab.active svg{color:var(--icon-accent)}` = crimson on Page). Inactive icons
  inherit `--ink-62` (currentColor) — a quieter treatment than Orbit's all-gold icons, correct for the
  ≤10%/≤6-token budget on a cream daily screen. The **only** thing wrong on cream is the `.otabs`
  *container* (it hardcodes the Kiswah bg + navy border) → **one Wave-A seam rule** (§8):
  ```css
  .reg-page .otabs {                       /* cream-ground bar variant */
    background: color-mix(in srgb, var(--cream) 92%, transparent);
    border-top: 1px solid var(--rule);
  }
  ```
  Specificity `.reg-page .otabs` (0,2,0) beats the base `.otabs` (0,1,0); same `@layer screens`.
- **Contrast:** cream bar inactive `--ink-62` 5.02:1 ✓, active `--crimson` 6.13:1 ✓; dark bar gold
  8.40:1 ✓ — all cited inline per convention.

### E.4 A11y / motion
- Active tab `aria-current="page"`; inactive links are real `<a href>`; Returns is a labelled `<button>`
  (`aria-label="Open your streak"`). 44px min per tab (shipped). Register-correct `:focus-visible` (auto).
- Bar is a direct child of `#app` (no transformed ancestor breaks `position:fixed`). Content wrappers add
  `padding-bottom: calc(var(--sp-16) + env(safe-area-inset-bottom))` so the fixed bar never covers content.
- Tab-to-tab motion = the shipped native page morph (`@view-transition`), reduced-motion-killed by the
  shipped `@layer motion` block. No page-authored transition.

### E.5 Acceptance checklist
- [ ] Learn/Practice/Profile/More navigate for real; Returns opens the streak sheet on every bar; no dead taps.
- [ ] Active tab per page correct (`.active` + `aria-current`); gold on Orbit pages, crimson on cream pages.
- [ ] Cream bar via the single `.reg-page .otabs` seam; base tab rules give crimson active untouched.
- [ ] learn.html: only the 3 coming-soon handlers rewired; Learn + Returns + course-switcher untouched.
- [ ] Onboarding + lesson/review/session pages carry no bar.

---

## 8 · Wave-A seams (consolidated — smallest possible)

The whole v2 slate needs **one CSS rule + one state method + two optional sheet-builders** in the
engine, plus new *data/gate* files (not engine edits). Everything else is page-authored.

| # | Seam | Kind | Smallest form | Invariant proof |
|---|---|---|---|---|
| S1 | `.reg-page .otabs` cream bar | engine CSS (1 rule) | bg `color-mix(cream 92%)` + `border-top:1px var(--rule)` | zero new hex/token; base `.tab.active` (crimson) already correct on cream |
| S2 | `AW.S.reset()` | engine JS (1 method) | `mem = defaultState(); persist(mem);` (drops `ringSeed` → fresh fingerprint) | reuses existing `persist`/`defaultState` → **no new `localStorage` literal** (count stays 13); defaults-blob-present blocks legacy re-migration |
| S3 | `AW.streakSheet()` **+** `AW.noorSheet()` | engine JS (2 sheet-builders) | centralise learn.html's shipped `.osh-*` streak/noor sheets; read `AW.state()`/`AW.weekCal()`; render via `AW.sheet` | no new `localStorage` literal, no new glyph; learn.html adopts them in Wave C (replacing inline copies) — **recommended**; fallback = per-page ~8-line re-author |
| S4 | `shared/practice-pool.js` (generated) · `scripts/build-practice-pool.js` (dev) · `scripts/tests/practice-pool-audit.mjs` (gate) | new data + tooling (not engine edits) | reuse `validate-content.js` `ingest()`; byte-fidelity gate on `port-audit.checkDailyFidelity` pattern | pool is provably byte-verbatim vs the 15 frozen lessons; no runtime engine hook |

**Deferred / recommended fast-follows (NOT built in v2 — flagged, not required):**
- **S5** hoist `SPROUTS`/`sproutFor` → `AW.SPROUTS`/`AW.sproutFor` so Profile can grow a "garden of
  finished lessons" (≤15 sprouts = the existing per-lesson doodle aggregated, **not** a 65-plant map).
- **S6** hoist learn.html's `UNITS` → `shared/course-structure.js` (single source of truth) to remove
  Profile's small `PF_UNITS` duplication.

### 8.1 Wave-C integration work (engine-adjacent, one agent on main)
- learn.html: first-run redirect (§0.4) + tab rewire (§E.2) + adopt `AW.streakSheet`/`AW.noorSheet` (if S3).
- `sw.js`: add PRECACHE entries `onboarding.html`, `practice.html`, `practice/session.html`,
  `profile.html`, `more.html`, `shared/practice-pool.js`; **bump `CACHE` `awba-cache-v1`→`v2`**.
  (`c.addAll` fails install if any 404 → all files must exist first.) pwa-audit passes automatically once
  paths resolve to disk.
- Gate discovery (add the 4 root pages + `practice/` dir + new gate; report the true new counts, never
  pin-around): `render-smoke.mjs` `findPages()` (root pages + `practice/`), `contrast-audit.mjs`
  `findPages()` + a `driverFor`/`budgetFor` branch (reuse the LESSON driver for Page pages practice/more,
  the LEARN driver for Orbit pages profile/onboarding), `rtl-audit.mjs` `findPages()`,
  `check-glyph-coverage.py` `harvest()` (add the 4 pages + session + `practice-pool.js`),
  `a11y-keyboard.test.js` file list (native-control + zero-positive-tabindex sweep must include the new
  pages), the gated-literal sweep scope. Add `practice-pool-audit.mjs` to the standing gate run + README.
  Run all Chrome-spawning gates **isolated** (never concurrent).

---

## 9 · Risks / judgment calls

1. **Practice interaction re-authored (not engine-shared).** Chosen for zero-engine-diff + zero
   regression to shipped runners. *Risk:* subtle drift from the shipped quiz feel. *Mitigation:* reuse
   the exact shipped classes (`.opt.correct/.opt.wrong/.opt-why/.btn.retry`), the exact `PRAISE` array,
   and the exact `'Nothing lost. '+gentle` copy; render via `AW._beatHtml`. *Alternative if reviewer
   prefers zero-divergence:* a minimal `AW.quizItem(mountEl,item,{onResolve})` engine primitive both
   could share — larger, touches tested code. **Recommend the page-authored runner.**
2. **Practice noor = none** (matches circle-back). Marked **owner-reviewable**. If the owner wants a
   modest reward, the safest is a *cap per lesson-mastered* rather than per-answer (un-farmable) — but
   recommend none.
3. **Practice does not credit `returns`.** Owner-reviewable ("should showing up to practise count as a
   day you came back?"). Recommend no for v2 (read-only purity; streak = learning).
4. **Ring denominator 61 vs 65** (R7). Profile shows **61** (the engine's live value + the Ring's own
   `aria-label` + `learn-state.test` pin). **Flag for owner/content confirmation** before ship; if 65 is
   canonical, it is a one-line engine change (`structure.atoms`) that cascades — not a Profile fix.
5. **`PF_UNITS` duplication** (4 titles + 15 ids) in profile.html — keeps Wave B self-contained.
   *Risk:* drift if course structure changes (frozen for v2). *Fast-follow:* S6 hoist.
6. **Display name is optional + on-device.** A user could type Arabic → an Arabic text node without
   `lang="ar"`. The gate renders the **default empty** name (no Arabic in the swept DOM → rtl-audit
   clean); at runtime `dir="auto"` + the workhorse font (law 4) render it correctly. Minor; flagged.
7. **Sprout garden deferred** (needs S5 hoist; Wave B must stay self-contained). Profile's poetry rests
   on the Ring (the real fingerprint) for v2. Flagged as the highest-value fast-follow.
8. **`AW.S.reset()` under `memFallback`** (a newer-schema blob) won't persist (protective session
   fallback). Rare; the confirmation still shows. Builder note: reset should call `persist` directly.
9. **Install-help sheet doesn't fire the native prompt** (no reliable captured `beforeinstallprompt`
   from a settings tap). It shows platform instructions instead — robust, honest, file://-safe. The
   learn.html add-to-home *nudge* still handles the live prompt where the browser offers it.
10. **Middot compound CTAs** (e.g. `Begin a set` + a Courier sub-line rather than `START · earn noor`
    inside the button) — I kept reward/qualifier clauses as calm sub-lines, not shouty button text, per
    R5 §5's caution that the middot-in-button form isn't confirmed canonical. Confirm at the copy gate.
11. **`man` tab icon** is a shipped aniconic glyph (Profile) — retained per brief; not a figure/mascot.
12. **Cream-bar inactive icons are ink (not accent)** vs Orbit's all-gold icons — a deliberate minor
    asymmetry honouring the ≤10% accent budget on cream. Confirm at design gate.

---

## 10 · Gate / count deltas (honest, verify-by-running)
| Gate | v1 | v2 (verify) | change |
|---|---|---|---|
| render-smoke | 20 pages | ~25 (+onboarding/practice/profile/more + practice/session) | edit `findPages()` |
| rtl-audit | 21 targets | ~26 | edit `findPages()` |
| contrast-audit | 20 pages | ~25 (+ per-type driver branch) | edit `findPages()`+`driverFor` |
| pwa-audit | 46 precache | 52 (+5 pages +pool.js) | auto once `sw.js` edited |
| glyph-coverage | learn+lessons+reviews+engine | +4 pages +session +pool.js | edit `harvest()` (no new codepoints expected → passes) |
| practice-pool-audit | — | NEW `PRACTICE POOL OK` | new gate |
| `AW.GLYPHS===13` / `NODE_ATOMS sum 61` | 13 / 61 | **unchanged** | v2 adds no glyph, no atom |
| engine `localStorage` literal count | 13 | **13** (S2 reuses `persist`) | invariant held |
| page storage-word count | 0 | **0** (all via `AW.*`) | invariant held |

Never hand-write a count a gate didn't print — wire the discovery, run isolated, report the true total.
