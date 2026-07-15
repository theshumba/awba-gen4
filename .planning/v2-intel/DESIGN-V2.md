# DESIGN-V2.md — the BINDING v2 design spec (onboarding · practice · profile · more · tabs)

**Judge:** Fable (design authority for awba-gen4 v2). **Date:** 2026-07-15.
**Method:** scored DESIGN-DRAFT-A (threshold/ritual lens) and DESIGN-DRAFT-B (calm-engineer lens)
per surface against Athar-law compliance, buildability vs the real engine (R1–R3, verified against
`shared/awba-engine.js`/`.css` ground truth), copy quality vs the shipped corpus (R6 §7), a11y,
edge-state coverage, and taste (the emil bar — *inevitable, not decorated*). This document is the
single source builders execute. **It supersedes both drafts.** Where I take one draft's surface as
base and graft the other's better idea, or rule a disagreement, the ruling is stated with a one-line
why. Nothing here overrides `ATHAR-SYSTEM.md` (canon) → `03-UI-SPEC-ATHAR.md` (executes it) → R0.

**Per-surface verdicts (winner = base; grafts noted):**
| Surface | Base | Grafts from the other draft |
|---|---|---|
| Onboarding | A (register + 3-row IA) | B's **empty-Ring pane-3 hero**, B's canonical "companion, not a cop" opener, B's **`?begin=1` loop-breaker** |
| Practice — architecture | B (**`AW.practiceRun` engine seam**) | A's subdirectory page, A's lessons-only pool, A's byte-verbatim native-field pool schema |
| Practice — sampling | B (deterministic `ringSeed ^ day ^ round`) | A's 8-item length + eligibility-by-star |
| Profile | B (Ring hero + `.pf-stat-num` catch) | A's per-unit lessons-only rows, A's privacy copy; **garden deferred (A)** |
| More | A (two-sheet start-over, ghost-not-rose destroy) | B's section IA + sheet copy |
| Tab bar | shared (both agree) | A's single `.reg-page .otabs` seam (drop B's speculative `.reg-festival`) |

---

## 0 · Global rulings (bind every surface)

### 0.1 Register assignment (law 1 — one ground per screen)
| Surface | Ground | Why | Tab active-cue |
|---|---|---|---|
| `onboarding.html` | **ORBIT** (`.reg-orbit grain`, Kiswah) | the doorway *into* the sacred centre, before any Ring is earned; same black world as home → crossing the threshold feels inevitable. Festival is **refused** (celebrates nothing yet; stamping here would land the real first plate flat). | (no bar) |
| `practice.html` (hub) | **PAGE** (`.reg-page grain`, cream) | quizzes live on Page (R5 §2.1); the hub shares its session's ground. | crimson |
| `practice/session.html` | **PAGE** + CIRCLE-drift opener | R5 §2.1: practice = PAGE-ground with a CIRCLE-drift review-opening — matches the shipped quiz + review-milestone precedent exactly. | (no bar) |
| `profile.html` | **ORBIT** (`.reg-orbit grain`, Kiswah) | foregrounds the Ring + macro stats → Orbit (R5 §2.1). "A private ledger of light." | gold |
| `more.html` | **PAGE** (`.reg-page grain`, cream) | the quietest, least-registered surface (R5 §2.1). "The quiet back room." | crimson |

No surface invents a 6th register, a 2nd ground, or a bespoke gradient/hex.

### 0.2 Page depth, install trio, theme-color, paths, preloads
| Page | Depth | Asset prefix | theme-color | Install trio | SW register | Tab bar | 2nd preload |
|---|---|---|---|---|---|---|---|
| onboarding.html | root | `shared/…` | `#131013` | **full** (manifest+icon+SW) | yes | no | `marcellus-400` |
| practice.html | root | `shared/…` | `#F3EDE2` | **full** | yes | yes | `readex-pro-600` |
| profile.html | root | `shared/…` | `#131013` | **full** | yes | yes | `marcellus-400` |
| more.html | root | `shared/…` | `#F3EDE2` | **full** | yes | yes | `readex-pro-600` |
| practice/session.html | **one level down** | `../shared/…` | `#F3EDE2` | **none** (like lessons) | no | no | `amiri-quran-400` |

- **Install-trio ruling (uniform, Draft B):** all four root pages clone learn.html's full head trio —
  `<link rel="manifest" href="manifest.webmanifest">` + `<link rel="apple-touch-icon" …>` + the
  file://-guarded SW-register script — plus their register-correct `theme-color`. *Why uniform over
  Draft A's onboarding-only exception:* harmless (every page points to the same manifest whose
  `start_url` stays `learn.html`), easiest to reason about (no per-page subset), and R4 §3.4 wants each
  new page to carry SW registration to be offline-installable. `index.html` and `manifest.webmanifest`
  are **untouched**; `start_url = learn.html` stays the front door.
- **session.html** carries **no** trio (one level down, like a lesson) and uses `../shared/…`,
  `../learn.html`, and loads `../shared/practice-pool.js` after `../shared/awba-engine.js`.
- **Why session lives one level down:** `AW.sound('correct'|'incorrect')` resolves `'../shared/sfx/…'`
  — only correct from a page one level below `shared/` (R1 §10). The root hub pages never call
  `AW.sound`, so their depth is fine.
- **Relative paths only, no leading slash, classic `<script>`, no modules/defer.** First preload is
  always `readex-pro-400` (the workhorse); the 2nd is per-page content-driven (column above).

### 0.3 Prefs keys (all via `AW.prefs.get/set` — never raw storage; the `installNudgeDismissed` precedent)
| Key | Type | Default | Owner | Purpose |
|---|---|---|---|---|
| `onboardingDone` | boolean | `false` | onboarding + learn boot | first-run redirect flag; also the "replay" detector |
| `displayName` | string | `''` | profile | optional on-device name (≤40 chars, sanitised) |

Both additive — **no schema bump** (R1 §2, the shipped install-nudge pattern). **Zero new `awba_state`
schema keys.** Key name `onboardingDone` matches R3 §5's own worked example. Every page's direct
storage-word count stays **0**.

### 0.4 First-run redirect (loop-proof, storage-off-safe — Draft B's `?begin=1`)
At the **very top of learn.html's outer IIFE, immediately after `'use strict';`, before any data
literal or `render()`** (R3 §5 slot), synchronous:
```js
if (window.AW && AW.prefs && !AW.prefs.get('onboardingDone', false)
    && location.search.indexOf('begin=1') === -1) {
  location.replace('onboarding.html');   // replace() → no history entry → back never loops
  return;                                 // out of the IIFE before touching #app (no flash of learn UI)
}
```
- **onboarding's Begin AND Skip** both do: `AW.prefs.set('onboardingDone', true);` then
  `location.replace('learn.html?begin=1');`. The `begin=1` param short-circuits the guard for that one
  navigation **even if the pref write no-oped** (private-mode / storage-off) — so Begin can never trap.
  *Why over Draft A's construction-only approach:* with storage off, Draft A's flag stays false, so
  every Begin bounces back to onboarding — a real trap. `?begin=1` guarantees the post-Begin navigation
  reaches learn.html regardless of storage.
- onboarding.html itself carries **no** guard (it is the destination). Lesson/review/practice pages
  carry no guard — direct deep-links never redirect.
- **Degradation (storage entirely off):** a later cold visit to learn.html re-shows onboarding
  (one tap to skip, never infinite). Acceptable for the rare no-storage case; no storage API is touched
  to detect it.

### 0.5 Denominator ruling — **61** (not 65)
The live engine is unambiguous: `NODE_ATOMS` sums to **61** (`learn-state.test` pins it), `ringSVG`
defaults `structure.atoms:61`, `skyDawn` divides by `/61`, preview reads "of 61". **Every "X of N"
string on the new surfaces uses 61.** The 61-vs-65 discrepancy is an **owner-ledger** item (R7): if 65
is ever declared canonical, it is a one-line `structure.atoms` engine change that cascades — never a
per-surface fix. Do **not** print 65.

### 0.6 Copy voice (bind all authored strings)
Warm, brief, mercy-toned, sentence case; never "free/upgrade/unlock", never streak-loss/urgency, never
gamer exclamation, never a competing-with-others frame (R6 §7). Wrongness is a strike never a colour
(law 8). Every surfaced citation carries `<span class="r-pill">unverified · pending review</span>`
unchanged. **Compound reward-clause CTAs (`START · earn noor`) are NOT confirmed canonical (R5 §5)** —
keep reward/qualifier text as calm Courier **sub-lines**, never shouty button labels. Flag at the copy
gate.

---

## A · ONBOARDING — the threshold

**Register:** ORBIT throughout (every pane). **The one memorable move:** pane 3's **empty Ring** —
`AW.ringSVG({atomsDone:0, size:280})`, **static** (no `animateFrom`, law 9). *Why this over Draft A's
bespoke gold-thread draw:* the Ring is the actual artefact the whole app is about; showing it empty
("your ring, waiting to be inked") is inevitable, not decorated — it makes the ring *already yours*
from second one, ties onboarding → profile → home into one object, reuses a shipped generator, and
adds **zero new art** (simpler *and* better taste than authoring a second thread primitive). At 0
progress `ringSVG` renders faint navy pilgrim-rows with no head-dot — a blank canvas, never broken.
**The arc:** *arrive → understand → step onto the path* (3 panes, one page, an in-place step machine —
no navigation between panes, focus + announce move with each step).

### A.1 Layout (`onboarding.html`, `<main class="reg-orbit grain" id="app">`)
One centred column, `max-width:480px`. Per pane, top→bottom: `.onb-kick` (Courier kicker) →
`.onb-head` (Marcellus headline, `tabindex="-1"` focus target) → pane body → `.onb-foot` (Back? ·
primary CTA · Skip?) → `.onb-dots` (3-step indicator, `aria-hidden`, pinned low). `#app` inner is
rebuilt per `step` (0/1/2); listeners re-attached each render (learn.html precedent).

- **Pane 1 — Welcome:** kicker → headline → body. Foot: **Show me how it works** (primary `.btn`,
  cream key on dark) · **Skip — take me in** (quiet `.btn.ghost`, gold).
- **Pane 2 — How it works:** kicker → headline → three `.onb-row`s (glyph + name + line). Foot:
  **Back** (ghost) · **And the path?** (primary) · **Skip — take me in** (ghost).
- **Pane 3 — The path:** kicker → headline → `.onb-ring` (empty Ring) → `.onb-mark` (Courier maker's
  mark) → body. Foot: **Back** (ghost) · **Begin, gently** (primary). No Skip (the CTA is the exit).

### A.2 FINAL copy (copy-paste)
**Pane 1**
- kicker: `Assalamu alaikum`
- headline (Marcellus, ≥28px): `A companion, not a cop.`
- body: `Awba walks the Aqeedah course with you — one small step at a time. No rush, no punishment, nothing to lose. Only a path, and your own light gathering as you go.`

**Pane 2**
- kicker: `Three things worth knowing`
- headline: `A gentler way to learn.`
- row 1 — glyph `spark` — name `Noor — light you gather` — line `Every answer you get right adds a little. It is never spent against you, and it never runs out.`
- row 2 — glyph `flame` — name `Returns — the days you come back` — line `The count only grows. Miss a day, a week, a year — it never breaks, and it never shows a gap.`
- row 3 — glyph `angle` — name `A wrong answer costs nothing` — line `A gentle word, and a chance to look again. No red, no buzzer, nothing lost.`

**Pane 3**
- kicker: `Where you're headed`
- headline: `Your path, traced in ink.`
- Ring: `AW.ringSVG({ atomsDone: 0, size: 280 })` (static; carries its shipped `aria-label`)
- maker's mark (Courier): `your ring · 0 of 61 inked`
- body: `Fifteen short lessons and four gentle reviews are waiting. Each one you finish inks one more mark into this ring — a drawing that becomes yours alone. Come as often, or as rarely, as you like.`

**Buttons (all panes):** `Show me how it works` · `And the path?` · `Begin, gently` · `Back` ·
`Skip — take me in`.
**SR step announce (on each advance):** `Step 1 of 3` / `Step 2 of 3` / `Step 3 of 3`.

### A.3 Flow / behaviour
- **Begin, gently / Skip — take me in** both: `AW.prefs.set('onboardingDone', true);` then
  `location.replace('learn.html?begin=1');` (§0.4). Skip == a gentler Begin — both set the flag.
- **Show me how it works / And the path? / Back** just change `step` and re-render (no storage).
- **Replay entry** (from More): direct nav to `onboarding.html` (flag already true → identical flow;
  Begin/Skip re-set the flag and land at `learn.html?begin=1`). No separate replay copy — the welcome
  reads the same first-run or replay.

### A.4 Component manifest
| Element | Source |
|---|---|
| `.reg-orbit .grain`, `.btn` (cream key on dark), `.btn.ghost` (gold), gold `:focus-visible` (auto) | **shipped** |
| glyphs `spark`/`flame`/`angle` via `AW.icon` | **shipped** GLYPHS (no new glyph) |
| `AW.ringSVG({atomsDone:0})` empty-Ring hero (static) | **shipped** |
| `AW.announce`, `AW.reducedMotion`, `AW.prefs` | **shipped** |
| `.onb-kick/.onb-head/.onb-row/.onb-ring/.onb-mark/.onb-foot/.onb-dots/.onb-dot` | **new page-CSS** (one `@layer screens` block; composition only, zero new token/hex) |

`.onb-head`: `font:400 var(--fs-display) var(--font-display); color:var(--cream);` /* §2.1 16.22:1 */.
`.onb-kick`/`.onb-mark`: `--font-marg`, `--paper-62` /* 6.69:1 */. body: `--font-work`, `--paper-85`.
`.onb-row` name: Readex 600 `--cream`; line: `--paper-62`; glyph: gold (`--icon-accent`, auto on Orbit).
`.onb-ring`: `width:min(280px,70vw); margin-inline:auto;`.

### A.5 Motion (shipped verbs, token durations)
- **Pane mount** = Orbit **draw** (UI-scale): `opacity 0→1 + translateY(4px→0)` over `--dur-draw`
  (240ms), `var(--ease)`, on `.onb-head`+body each step render.
- **Empty Ring:** static — `ringSVG` omits `animateFrom` (renders with zero animation nodes). Never
  redraws (law 9). No bespoke thread, no ambient loop anywhere on onboarding.
- **Reduced motion** (`prefers-reduced-motion` OR `[data-motion="reduce"]`): the engine `@layer motion`
  collapse snaps mounts to 1ms; Ring already static. No page-authored motion override needed.

### A.6 A11y contract
- Each pane = a `<section aria-label>` swap; exactly one `<h1>`-role heading visible. On advance move
  focus to `.onb-head` (`tabindex="-1"` + `.focus()`, the runner's `focusHeading` pattern), **then**
  `AW.announce("Step N of 3")` (focus-first, then announce — no double-speak).
- `.onb-dots` `aria-hidden="true"`; the empty Ring carries its shipped `aria-label` (`Tawaf ring —
  0 of 61 inked`). All controls native `<button>`; 44px; gold `:focus-visible` (auto). Place the
  **primary CTA before Skip** in source so Tab reaches the forward action first. No focus trap (the
  page is the whole document).

### A.7 Edge states
- Direct visit with flag already true → replay (deliberate, from More): identical, never traps.
- 320px: single column; Marcellus clamps to its 28px floor; no horizontal overflow.
- Storage off: Begin/Skip still navigate via `?begin=1`; the flag write no-ops (§0.4).
- Offline (installed): precached (Wave C), works fully. JS off: page is inert, but the redirect that
  brought them here also wouldn't have fired — acceptable.

### A.8 Acceptance checklist
- [ ] One register (`.reg-orbit`) on every pane; no 2nd ground/gradient; zero new hex/token/glyph.
- [ ] Empty Ring is static (no `animateFrom`), 0/61 caption, correct `aria-label`, capped width.
- [ ] No scripture, no invented Arabic, no celebration primitive, no tab bar.
- [ ] Begin **and** Skip set `onboardingDone=true` and navigate to `learn.html?begin=1`; guard never
      loops (verify with pref-write disabled).
- [ ] Each advance moves focus to the heading, then announces "Step N of 3".
- [ ] Native buttons, 44px, gold focus rings; reduced-motion settles instantly.
- [ ] Full install trio + `theme-color #131013`; page added to precache + all gate discovery (Wave C).

---

## B · PRACTICE — returning to walk a path already walked

Two surfaces: **practice.html** (root, the tab landing) + **practice/session.html** (one level down,
the drill). **Poetry:** practice is a quiet re-walk of the path you've finished — "just for you." The
one memorable move is the **circle gathering** (CIRCLE drift) at the session open, then stillness.

### B.1 Architecture ruling — **the drill runs through `AW.practiceRun`, a Wave-A engine seam**
*Both drafts agree on the two safety invariants:* do **not** reuse `AwbaLesson`/`AwbaReview` whole
(they write stars, credit noor, `touchDay`, and fire the full reward choreography — all forbidden in
practice), and do **not** thread a `cfg.practice` branch through the tested lesson runner (risks the
1000+ shipped tests). The only disagreement is *where the re-authored interaction lives*.

**Ruling: the engine seam `AW.practiceRun(mountEl, items, opts)` (Draft B), not a page-authored runner
(Draft A).** Why — the smaller *risk-weighted* diff:
1. **Single source of the exact mercy interaction.** PRAISE (the engine's `['That's it.','Beautiful.',
   'Exactly right.','Masha'Allah.']`, curly apostrophes), the `'Nothing lost. '+gentle` miss line, the
   grey-blot/gold-dot verdicts — all sourced once. A page-authored runner (Draft A) duplicates these
   ~100 lines and Draft A itself logs "subtle drift from shipped feel" as its #1 risk. The seam removes
   that risk.
2. **Testable.** Wave-B pages ship "static self-checks only" — a page-authored runner would ship the
   mercy-critical interaction **untested**. The seam gets a real `node --test` unit test in Wave A.
3. **R0 explicitly scopes "any practice-mode seam" into Wave A.** The seam is the anticipated path.
4. **Genuinely additive:** reuses shipped `AW._beatHtml` + `.opt/.tf/.tile/.opt.correct/.opt.wrong/
   .opt-why/.btn.retry`; touches **no** existing tested runner code; adds no storage literal, no glyph,
   no scripture. Every count law holds.

**No runtime collector hook** is added to `AwbaLesson`/`AwbaReview`: the pool is built **dev-time**
(§B.2), so no extraction seam is needed either.

### B.2 The item pool — **lessons only**, byte-verbatim (`shared/practice-pool.js`, dev-generated)
**Ruling: pool = every `mc`/`tf`/`tile` quiz beat from the 15 lesson cfgs, byte-verbatim; reviews
EXCLUDED (Draft A).** Why over Draft B's 19-file pool: (a) review items have a **different shape**
(`tf:true` flag + `t` = explanation, no `tile`) — verified in the engine — so including them forces
the extractor + gate + seam to normalise two shapes; lessons-only keeps one homogeneous shape that
feeds `AW._beatHtml` and the seam's resolve directly. (b) R0/R6 say "quiz items reused from lessons the
learner has completed," and `tile` only exists in lessons. (c) reviews are their own timed capstone;
pulling them into calm practice muddies the "re-walk the lessons you finished" poetry. Reviews-in-pool
is logged as an **owner fast-follow** (needs shape normalisation), not v2.

- **Content:** each beat copied byte-verbatim, native field names retained (so `AW._beatHtml(item,{})`
  renders it and the seam's resolve reads `item.c`/`item.solution`/`item.gentle` directly). Because
  items are exact substrings of already-harvested lesson content, they display **no new scripture and
  no new codepoints**. `mc.quote` renders via the shipped `mcHtml` as `<p class="trans">` exactly as it
  does inside the lesson — identical presentation, so **no new scripture-law surface** is created
  (verified: `mcHtml` renders `quote` as `.trans`, not `.ayah`).
- **Shape** (classic script assigning a global — file://-safe, no fetch):
  ```js
  window.PRACTICE_POOL = {
    generated: 'YYYY-MM-DD',                                  // provenance
    lessons: { u1m1: { refs:{…}, terms:{…} }, … },            // each lesson's refs+terms verbatim, for AW.wire
    items: [ { lesson:'u1m1', idx:4, item:{ t:'mc', q, o, c, good, gentle, quote? } }, … ]
  };                                                           // item === the source beat verbatim (t retained)
  ```
- **Extractor** `scripts/build-practice-pool.js` (dev-run, like font-subsetting — data prep, not a
  build step): reuse `ingest()` from `scripts/validate-content.js` (its `node:vm` sandbox; `AW.cite`
  stub returns the real `<span class="cite" data-ref>` markup so embedded citation ids survive
  verbatim). For each of the 15 lessons capture `cfg`; walk `cfg.beats` for `t∈{mc,tf,tile}`; emit
  `{lesson:cfg.id, idx, item:beat}` + that lesson's `cfg.refs`/`cfg.terms`. Never regex the object
  literal (D-25/D-26).
- **Fidelity gate** `scripts/tests/practice-pool-audit.mjs` (NEW, Wave A) — follows
  `port-audit.mjs`'s `checkDailyFidelity` shape: re-`ingest()` the 15 lessons at gate time, re-derive
  the item set, and assert (1) every pool `item` deep-equals `cfg.beats[idx]` for its claimed
  `{lesson, idx}`, (2) the pool contains items ONLY from the 15 lesson files, (3) every `lesson` id is
  a real lesson id with a star key in `NODE_ATOMS`. Prints `PRACTICE-POOL BYTES OK` /
  `PRACTICE-POOL BYTES DRIFT <lesson> #<idx>`; runs unconditionally, printing
  `OK — not yet present` before the pool exists. This makes the pool provably unable to drift from
  Josh's byte-frozen content.

### B.3 Noor / returns ruling — **NO noor, NO stars, NO returns, NO writes** (owner-reviewable)
Practice awards nothing and writes nothing to `awba_state` — 100% read-only. Rationale (both drafts
agree; marked owner-reviewable per R0):
1. Matches the shipped **review circle-back** precedent ("earn 0 noor" — R1 §3). Practice *is*
   circle-back — revisiting to strengthen.
2. Zero noor **cannot** distort the shipped economy — the safest answer to "must not distort."
3. Honours "practice is for you" — a gift to yourself, not a transaction.
4. Zero writes = zero coupling to persistence = smallest, safest seam.
- **`touchDay` too? No.** Practice does not credit returns — the streak's meaning stays tied to
  *learning*. Stated plainly in the hub UI: `No noor here — practice is just for you.`
- **Owner-reviewable (recommend keep at none):** "should a modest per-lesson-mastered cap ever apply?"
  and "should practising count as a return?" — recommend **no** for v2.

### B.4 Session length + sampling — **deterministic** (Draft B), 8 items
- **Length: 8 items** per set (or all eligible if fewer than 8).
- **Eligibility:** `PRACTICE_POOL.items.filter(it => AW.state().stars[it.lesson])` — completed lessons
  only (star presence = completion; not reimplementing unlock logic — no locked/available shown here).
  `N = eligible.length`, `M = new Set(eligible.map(it=>it.lesson)).size`.
- **Sampling — seeded, NOT `Math.random`, NOT `Date.now()`:**
  ```
  seed  = (AW.ringSeed() ^ dayNumber(local) ^ round) >>> 0     // round = in-memory session counter, starts 0
  shuffle eligible with mulberry32(seed) Fisher-Yates          // the Ring's PRNG family; inline ~6-line mulberry32 (page-private util)
  items = eligible.slice(0, Math.min(8, eligible.length))
  ```
  *Why deterministic over Draft A's `Date.now()` nonce:* stable within a day+progress (re-entering the
  same day gives the same 8 — kind, not jarring), rotates day-to-day (fresh material over time, no
  randomness), grows as you finish more lessons, and is **unit-testable** (matches the Ring's
  determinism ethos). "Practise another set" bumps the in-memory `round` → a different 8 the same day,
  still deterministic. `dayNumber(local)` uses the D-16 local-date helper (never UTC). mulberry32 is a
  generic PRNG util (not religious/design content), page-private, not on `AW`.

### B.5 practice.html (the hub — PAGE/cream, carries the tab bar)
Layout: `.pr-kick` (Courier `Practice`) → `.pr-title` (Readex-600 h1 — **Page titles are Readex, not
Marcellus**, law 5) → framing lede → honest pool count → primary CTA + sub-line → the no-noor honesty
line → tab bar. No noor/returns HUD (Profile owns stats) — a calm, focused hub.

**State 1 — has completed content (eligible ≥ 1):**
- kick: `Practice`
- title: `Walk a path you've already walked.`
- lede: `Practice brings back questions from the lessons you've finished — the same words, nothing new. Nothing here is scored, and nothing is ever lost. It's just for you.`
- pool count (`.pr-count`, Courier): `{N} questions ready · from {M} lessons finished` (singular: `1 question ready · from 1 lesson finished`)
- CTA (`.btn`, crimson): `Begin a set` → `practice/session.html`
- CTA sub-line (Courier): `8 questions, drawn from what you've finished.` (if N<8: `{N} questions, drawn from what you've finished.`)
- honesty line (`.pr-note`, Courier `--ink-62`): `No noor here — practice is just for you.`

**State 2 — empty (nothing completed):** reuse the shipped `.ocs-body/.ocs-ic/.ocs-line` composition
(icon + one calm line) + a CTA — honest, never a dead end:
- kick: `Practice`
- title: `Practice opens as you go.`
- icon: `AW.icon('beads',{size:'40px'})`, crimson (Page)
- line: `Once you've finished your first lesson, its questions gather here — ready whenever you'd like to look again. Your path is the place to start.`
- CTA (`.btn.ghost`): `Back to the path` → `learn.html`

### B.6 practice/session.html (the drill — PAGE/cream, NO tab bar, driven by `AW.practiceRun`)
Clone the lesson head (`../shared/…`, `theme-color #F3EDE2`, preload `readex-pro-400` +
`amiri-quran-400`). Load `../shared/awba-engine.js` then `../shared/practice-pool.js` (both classic).
`<body>`: `<main class="reg-page grain" id="app">`. The **page** owns the outer chrome; **`AW.practiceRun`
owns the stage + foot + verdict**:

**Screen anatomy (top→bottom):**
- **`.se-head`** = a `.ls-back` "Leave practice" control (cream ground → `--ink-62`, shipped) on the
  left; the shipped mute toggle `AW.muteBtnHtml()` (id `#lsmute`, wired via `AW.bindMuteBtn`) on the right.
- **The circle-gathering opener** (`.pr-drift`, the one move): 3 shipped `.dab`s with
  `animation-delay:0/40/80ms` settle beneath the head on session start, then still. Once; `aria-hidden`.
- **`#practiceMount`** — the element `AW.practiceRun(mountEl, items, opts)` drives (progress line +
  stage + foot).
- On finish (`opts.onDone({correct,total})`) the page replaces the mount with the calm **completion**
  screen.

**`AW.practiceRun` usage (page side):**
```js
var eligible = PRACTICE_POOL.items.filter(function (it) { return AW.state().stars[it.lesson]; });
var items    = sampleEight(eligible, round);                 // §B.4 deterministic
if (!items.length) { renderEmpty(); return; }                // deep-link-with-empty-pool edge
var refs = {}, terms = {};                                   // union of the sampled items' source lessons
items.forEach(function (it) { Object.assign(refs, PRACTICE_POOL.lessons[it.lesson].refs);
                              Object.assign(terms, PRACTICE_POOL.lessons[it.lesson].terms); });
AW.practiceRun(document.getElementById('practiceMount'),
  items.map(function (it) { return it.item; }),
  { refs: refs, terms: terms, onDone: renderDone });
```

**Completion (PAGE, calm — NO Festival/Ring/rosette/celebration primitive):**
- heading (`.se-done`, Readex 600): `Well walked.`
- line: `You looked again at {n} questions from the lessons you've finished. Nothing here is scored — this was just for you.`
- quiet count (Courier, neutral, never a grade): `{c} of them came right away.`
- CTAs: `.btn` `Practise another set` (bump `round`, re-run in place) · `.btn.ghost` `Back to the path` (→ `../learn.html`)
- announce: `Practice complete. {n} questions revisited.`

**Empty / deep-link edge** (eligible = 0): heading `Nothing to practise yet` + line
`Finish a lesson first, and its questions gather here.` + `.btn` `Back to the path` (→ `../learn.html`).
Never a blank/dead screen.

### B.7 Component manifest (both practice surfaces)
| Element | Source |
|---|---|
| `.reg-page .grain`, `.stage`, `.opt/.tf/.tile`, `.opt.correct/.opt.wrong/.opt-why`, `.btn/.btn.retry/.btn.ghost`, `.ls-back`, `.ls-mute` (`#lsmute`), `.ocs-body/.ocs-ic/.ocs-line`, `.dab`+drift, `.cite/.term`, `.pintro/.trans/.opts/.tfrow/.tilebox/.bank` | **shipped** |
| `AW.practiceRun` (drives it), `AW._beatHtml`, `AW.wire`, `AW.sheetRef/.sheetTerm`, `AW.icon('beads')`, `AW.muteBtnHtml/.bindMuteBtn`, `AW.sound`, `AW.announce`, `AW.reducedMotion`, `AW.state`, `AW.ringSeed` | **shipped / Wave-A (`practiceRun`)** |
| `shared/practice-pool.js` + `build-practice-pool.js` + `practice-pool-audit.mjs` | **new (Wave-A data + gate)** |
| `.pr-kick/.pr-title/.pr-count/.pr-note/.pr-drift` · `.se-head/.se-done` · page-private `mulberry32`+`sampleEight` | **new page-CSS/JS** (`@layer screens` + inline classic script) |
| tab bar `.otabs` (hub only) + `.reg-page .otabs` cream seam | **shipped markup + Wave-A 1-rule seam (§E, S1)** |

### B.8 `AW.practiceRun(mountEl, items, opts)` — exact contract (Wave-A seam S4)
- **Signature:** `mountEl` = the DOM element to render into (never `document.body`); `items` = array of
  native lesson-beat objects (`{t:'mc'|'tf'|'tile', …}`); `opts = { onDone(fn({correct,total})), refs?,
  terms? }`.
- **Per item:** renders `mountEl.innerHTML = '<p class="se-prog">Question '+i+' of '+n+'</p><div
  class="stage">'+AW._beatHtml(item,{})+'</div>'+foot` where `foot` holds one `Check` button
  (real `disabled` attribute until a pick — the shipped ACC-01 pattern). If `opts.refs`/`opts.terms`,
  call `AW.wire(mountEl, {refs,terms})` after each render so `.cite`/`.term` taps open the shipped
  sheets (pending pill rides in).
- **Selection + resolve (mirrors shipped `bindChoice`/`bindTile` exactly — verified against the
  engine):** mc `chosen=+dataset.i, ok=(chosen===item.c)`; tf `chosen=(dataset.v==='true'),
  ok=(chosen===item.c)`; tile assemble `built`, `ok=(JSON.stringify(built)===JSON.stringify(item.solution))`.
  - **Correct** → mark the correct `.opt`/`.tf` `.correct` (shipped gold dot draws); praise line from
    the **single engine-level `PRAISE` const** cycled by `correctCount % PRAISE.length`;
    `AW.sound('correct')`; `AW.announce('Correct.')`; foot → `Continue`. `correct++`.
  - **Wrong** → mark `chosen` `.opt`/`.tf` `.wrong` (grey ink-blot fade, law 8 — never red/flash/shake);
    `.opt-why` = `'Nothing lost. ' + (item.gentle || '')`; `AW.sound('incorrect')`;
    `AW.announce('Not quite — nothing lost. Look again.')`; foot → `.btn.retry` `Try again` (re-enable
    options, clear marks, re-attempt the same item — practice protects nothing, so re-attempting *is*
    the point). **No noor, no score change.**
  - `Continue` → next item, `focusHeading('.pintro')`. After the last item → `opts.onDone({correct, total})`.
- **MUST NOT:** write any `awba_state` (no noor/stars/`touchDay`), no `document.body` wipe, no du'a,
  no Ring, no Festival/rosette, no new glyph, no authored scripture. Mounts into `mountEl` only.
- **Motion / a11y:** shipped `.opt` settle, gold-dot draw, grey-blot fade — reduced-motion-safe via the
  engine. `AW.reducedMotion()` respected (inherited). All controls native; crimson `:focus-visible`;
  44px; `AW.announce` on every verdict + progress.
- **Single-source PRAISE:** hoist the lesson runner's local `PRAISE` to a module-level const both the
  lesson runner and `practiceRun` read (behaviour-preserving move; no test pins its location). *Fallback
  if the builder wants zero lesson-runner touch:* declare an identical `var PRACTICE_PRAISE=[…]` in the
  seam — the strings (with curly apostrophes) are byte-copied from the engine, not re-typed.
- **Invariants touched:** none of the frozen counts. Additive engine JS: localStorage-literal count
  stays **13**, glyphCount stays **13**, NODE_ATOMS sum stays **61**.

### B.9 Motion
- **Circle-gathering opener:** shipped `.dab` **drift** `--dur-drift` (300ms), staggered 0/40/80ms,
  once; renders settled under reduced motion (shipped `.dab {animation:none}`).
- **Item mount / resolve:** shipped `.opt` settle (`--dur-settle`), gold-dot draw, one paper-press
  (`--dur-press`). **No noor count-up, no Ring, no rosette, no stamp** anywhere in practice.

### B.10 A11y contract
- Options/Check/retry/Continue/CTAs/`Leave practice` all native `<button>`/`<a>`; `Check` uses real
  `disabled`. `focusHeading` to each item's `.pintro` on advance; `AW.announce` on every verdict, retry,
  progress, completion. Citation/term taps use `AW.sheet` (shipped trap + Esc + cream). 44px; crimson
  `:focus-visible` (auto, Page). `#lsmute` present so `AW.bindMuteBtn` binds. `.pr-drift` dabs
  `aria-hidden`. Leaving mid-session (`Leave practice`) is always available and non-punitive.

### B.11 Acceptance checklist
- [ ] Session is driven by `AW.practiceRun` (not `AwbaLesson`/`AwbaReview`); shipped runners untouched.
- [ ] Zero writes to `awba_state` (no noor/stars/`touchDay`); page storage-word count 0.
- [ ] Pool is lessons-only, byte-verbatim; `practice-pool-audit` prints `PRACTICE-POOL BYTES OK`; no
      new scripture/codepoints.
- [ ] `AW.sound('correct'/'incorrect')` resolves (session is one level down); `#lsmute` wired.
- [ ] Sampling uses `mulberry32(ringSeed ^ day ^ round)` — no `Math.random`, no `Date.now`; length 8
      (or all if fewer); "Practise another set" bumps `round`.
- [ ] Wrong = grey ink-blot + `.opt-why` "Nothing lost. …" + `.btn.retry`; never red/flash/shake.
- [ ] Completion is calm Page — no Festival/Ring/rosette; empty + deep-link-empty states handled.
- [ ] Hub carries the cream tab bar (Practice active, crimson); session carries none.
- [ ] Both pages + pool.js added to precache + gate discovery; `practice/` dir auto-discovered (Wave C).

---

## C · PROFILE — a private ledger of light

**Register:** ORBIT (Kiswah). **The hero + one memorable move:** the learner's **Ring**, mounted
**static** (law 9 — `AW.ringSVG` **without** `animateFrom`) — the same seeded fingerprint as home, now
alone in the black world like a seal. Its meaning is the poetry: *no two paths are inked the same;
this one is yours.* Everything else is a quiet ledger read entirely through `AW.*`.

### C.1 Layout (`profile.html`, `<main class="reg-orbit grain" id="app">`, top→bottom)
1. **Greeting + optional name** — `.pf-greet` (Courier `Assalamu alaikum`) + Marcellus `{displayName}`
   or the "Add your name" affordance (C.4).
2. **Ring hero** — `.pf-ring` mounting `AW.ringSVG({ atomsDone: AW.atomsDone(AW.state()), size: 300 })`
   (**no `animateFrom` → static**); Courier maker's mark `.pf-mark`; the uniqueness line `.pf-unique`.
3. **Stat rail** — `.pf-stats` of `.pf-stat` (Marcellus numeral + Courier label). noor/returns tiles
   are tappable → the shipped noor/streak sheets (C.3).
4. **Week constellation** — `AW.weekCal()` dots under the returns tile + a Courier `this week` sub.
5. **Per-unit progress** — 4 `.pf-unit` rows (scene icon + English title + thermal dab + count).
6. **Privacy line** — `.pf-priv` + a pointer to More for Start-over.
7. **Tab bar** — Profile active, GOLD cue (Orbit).

**No sprout garden in v2 — deferred (Draft A).** *Why over Draft B's garden:* the garden needs the S5
`AW.sproutFor` hoist + a learn.html Wave-C refactor to adopt it, and R6 is explicitly nervous about
plant-viz reading as a second macro map ("NEVER a 65-plant map; the Ring is the only map"). The Ring is
the sanctioned, sufficient hero (R5/R6). Deferring keeps Wave-B Profile **self-contained** (R0's Wave-B
rule: no engine/learn.html edits) and is the smaller true diff. Logged as the highest-value fast-follow
(S5, spec ready).

### C.2 State reads (zero direct storage — `AW.*` only)
- Ring: `AW.ringSVG({ atomsDone: AW.atomsDone(AW.state()), size: 300 })` — static; seed from
  `AW.ringSeed()` internally. **Denominator = 61** (§0.5).
- noor `AW.state().noor`; returns `AW.state().returns`; atoms `AW.atomsDone(AW.state())`; lessons done
  = count of the 15 lesson ids present in `AW.state().stars`; stars total =
  `Object.values(AW.state().stars).reduce((a,b)=>a+b,0)`; week `AW.weekCal()`.
- **Per-unit completion via star presence** (not `deriveNodeState`): a lesson id present in `stars` →
  **done** (`[data-state="mastered"]` gold dab + check), absent → **not-yet** (hollow ring). Profile
  shows *completion*, not navigational unlock, so star presence is the faithful read (it is exactly
  what `deriveNodeState` uses for `done`).
- **Per-unit grouping** uses a small **page-private** map — **lessons only** (Draft A; reviews/chests
  are not progress rows):
  ```js
  var PF_UNITS = [
    { u:1, title:'The Foundation',           lessons:['u1m1','u1m2','u1m3','u1m4'] },
    { u:2, title:'The Drift',                lessons:['u2m1','u2m2','u2m3','u2m3b'] },
    { u:3, title:'The Heart of It: Tawhid',  lessons:['u3m1','u3m2','u3m3'] },
    { u:4, title:'The Pillars',              lessons:['u4m1','u4m2','u4m2b','u4m3'] }
  ];   // 4+4+3+4 = 15; ids/titles from the R3 §8 authoritative flattened list
  ```
  Icons from `AW.UNIT_ICON['u'+u]` (shipped). Duplicates ~15 ids + 4 titles from learn.html's `UNITS`
  (structure, not SHA-gated content) to keep Wave-B self-contained — flagged; the deferred **S6** hoist
  (`shared/course-structure.js`) removes it later. A light Wave-C test asserts `PF_UNITS` lesson ids ⊆
  `NODE_ATOMS` keys.

### C.3 Returns / noor taps → shipped sheets (via Wave-A S3)
Reuse the **Wave-A** `AW.streakSheet()` / `AW.noorSheet()` (S3) so the returns/noor stat tiles open
the exact shipped `.osh-*` cream sheets (identical to learn.html, zero drift). **Do NOT reuse `.osh-big`/
`.osh-sub` on the Profile page body** — verified: `.osh-big { color: var(--ink) }` (= `--kiswah`), which
vanishes on the dark Orbit ground. Author `.pf-stat-num` with `--cream` (`--gold` for the noor numeral)
instead; the `.osh-*` classes live ONLY inside the cream sheets. (Draft B's catch — correct.)

### C.4 Optional display name — **YES** (Draft B's field, on Profile only)
A private ledger reads as *yours* with a name; cost is one prefs key + a small input. On Profile, never
onboarding (onboarding stays a pure welcome, no forms — R5's forms-lean-Page note).
- **No name set:** greeting `Assalamu alaikum` + a quiet `.pf-addname` ghost button `Add your name`.
- **Tap** → reveal inline `<form class="pf-name-form">`: `<label for="pfName">Your name — shown only on
  this device</label><input id="pfName" class="pf-name-input" type="text" maxlength="40" dir="auto"
  autocomplete="off">` + `.btn.ghost` `Save` + quiet `Cancel`. Focus moves into the input.
- **Save** → `var v = input.value.trim().slice(0,40);` `AW.prefs.set('displayName', v)`; render the
  name with **`textContent` only** (never `innerHTML` — XSS-safe by construction); `AW.announce('Name
  saved.')`. Empty submit clears it (`AW.announce('Name removed.')`). `Escape`/`Cancel` reverts + restores
  focus to the affordance.
- **Name set:** greeting shows Marcellus `{displayName}` + a quiet `Edit` (same editor) and, inside the
  editor, a quiet `Remove`.
- **`.pf-name-input` styling (dark ground, dignified field):** `background: var(--navy); color:
  var(--cream); border: 1px solid var(--edge); border-radius: var(--r-2); padding: var(--sp-2s)
  var(--sp-3); font: var(--fs-body) var(--font-work);` /* cream on navy ≥13:1 */; gold `:focus-visible`
  (auto). `dir="auto"` handles any-script names in the workhorse font (law 4). maxlength 40 (over Draft
  A's 24 — more inclusive of real names).

### C.5 FINAL copy
- greeting kicker (Courier): `Assalamu alaikum`
- name affordances: `Add your name` · `Edit` · `Remove` · `Cancel` · input label `Your name — shown only on this device` · save button `Save` · announce `Name saved.` / `Name removed.`
- Ring maker's mark (Courier): `your ring · {atomsDone} of 61 inked`
- uniqueness line: `No two paths are inked the same. This one is yours.`
- stat labels: `noor gathered` · `days you came back` · `lessons finished` · `stars earned`
- stat values: noor `{noor}` (gold numeral) · returns `{returns}` · lessons `{done} of 15` · stars `{total}`
- week sub (Courier): `this week`
- per-unit count (Courier): `{done} / {total} lessons`
- privacy line: `Everything here lives on this device only — no account, no sign-in, nothing sent anywhere. You can clear it any time from More.`
- course-complete note (all 15 lessons done; quiet Courier, calm Orbit — **not** Festival): `You've walked the whole path. The ring is closed.`

### C.6 Component manifest
| Element | Source |
|---|---|
| `.reg-orbit .grain`, `.ring` (via `AW.ringSVG`), `.weekcal .day/.here`, `[data-state]` thermal dabs, glyphs (`check`/`spark`/`flame`), scene icons (`AW.UNIT_ICON`), `.btn/.btn.ghost`, `.osh-*` (inside sheets only) | **shipped** |
| `AW.ringSVG`(no animateFrom), `AW.atomsDone`, `AW.state`, `AW.weekCal`, `AW.ringSeed`, `AW.icon`, `AW.announce`, `AW.prefs` | **shipped** |
| `AW.streakSheet()` / `AW.noorSheet()` | **Wave-A seam S3** |
| `.pf-greet/.pf-addname/.pf-name-form/.pf-name-input/.pf-ring/.pf-mark/.pf-unique/.pf-stats/.pf-stat/.pf-stat-num/.pf-stat-lab/.pf-week/.pf-unit/.pf-priv` | **new page-CSS** (`@layer screens`) |
| `PF_UNITS` structure array | **new page-JS** (small duplication; S6 removes later) |
| sprout garden | **deferred** (needs S5; not in v2) |

`.pf-stat-num`: `font-family:var(--font-display); color:var(--cream);` /* §2.1 16.22:1 */ — the noor
numeral uses `color:var(--gold)` /* §2.1 8.40:1 */. `.pf-stat-lab`: `--font-marg`, `--paper-62`
/* 6.69:1 */. Per-unit dabs use shipped `[data-state="mastered"|"not-yet"]` (dark-ground overrides ride
in automatically: mastered = gold fill no keyline; not-yet = `--powder` border).

### C.7 Motion
- Content mounts on the Orbit **draw** (opacity+translateY(4px), `--dur-draw`). **The Ring renders
  static** — never `animateFrom` on Profile (law 9); a mount on every visit must not replay a draw.
- Name-editor reveal: `--dur-fade` opacity, reduced-motion-safe. Sheets: shipped `AW.sheet` settle
  (`--dur-sheet`). No ambient loops, no celebration.

### C.8 A11y contract
- Ring `<svg role="img" aria-label="Tawaf ring — N of 61 inked">` (shipped from `ringSVG`).
- Name affordance/editor native; input has a real `<label>`; focus into input on reveal, back on
  save/cancel; `Escape` cancels; announce on save/remove.
- noor/returns tiles native `<button>` with `aria-label` (`{noor} noor — open your light` /
  `{returns} returns — open your streak`); sheets use the shipped trap.
- Per-unit rows: shape-first `[data-state]`; each row `aria-label="Unit {n}, {title} — {done} of
  {total} lessons, {state phrase}"`; dabs `aria-hidden`. 44px; gold `:focus-visible` (auto). Default
  render carries no user Arabic → rtl-audit clean.

### C.9 Edge states
- **Zero progress:** Ring renders at 0 (faint navy rows, no head-dot — shipped), maker's mark
  `your ring · 0 of 61 inked`, all stats 0, empty week (all un-lit — never a gap/red), all units
  not-yet. The uniqueness line still holds (their seed is already unique). Calm, honest, never shaming.
- **Course-complete:** Ring gold-thread closed, all units mastered, the calm closed-path line.
- **`AW.S.isFallback()` true** (newer blob): reads still work (defensive copies); display is read-only,
  the name is a `prefs` write (separate blob) — safe.
- 320px / offline: single column, precached, no overflow.

### C.10 Acceptance checklist
- [ ] One register (`.reg-orbit`); Ring is the only macro map; mounted **static** (no `animateFrom`);
      denominator 61.
- [ ] All state via `AW.*` (0 direct storage); completion = star presence (no `deriveNodeState`
      reimplementation); `atomsDone` via `AW.atomsDone`.
- [ ] `.pf-stat-num` authored (`--cream`/`--gold`); `.osh-big/.osh-sub` NOT reused on the page body.
- [ ] noor/returns tiles open the shipped `AW.noorSheet`/`AW.streakSheet` (S3); week never shows a gap/red.
- [ ] Per-unit uses shipped thermal shapes; correct done/total (lessons only, 15 total).
- [ ] Optional name: `displayName` prefs key, `textContent` render, `dir="auto"`, maxlength 40,
      on-device; privacy line present.
- [ ] Zero new hex/token/glyph; new CSS in one `@layer screens` block; gold focus rings (auto).
- [ ] SW-register + `theme-color #131013`; Profile tab gold-active; added to precache + gate discovery.

---

## D · MORE — the quiet back room

**Register:** PAGE (cream). No Ring, no Sky tint, no thermal dabs, no celebration. **IA: labelled
sections of rows** — a scannable list of `.sheet-row`-press rows under quiet section headers; toggles
inline, navigations as links, explainers open the shipped `AW.sheet`, Start-over runs a calm
double-confirm. Version/credits sit at the foot as Courier marginalia. **The memorable note:** even the
destructive action speaks in mercy — the calm default is always *keep*.

### D.1 Layout (`more.html`, `<main class="reg-page grain" id="app">`, top→bottom)
Header (`.mr-kick` Courier `More` + `.mr-title` Readex-600 `Settings & about`) → 4 sections → foot →
tab bar (More active, crimson).

**§ Sound & motion**
- **Sound** — `.mr-row`: label `Sound` + sub `Calm cues as you learn.` + the shipped `AW.muteBtnHtml()`
  (`#lsmute`) on the right; wire `AW.bindMuteBtn()`. (Cues are silent placeholders — D-52; the toggle is
  the real `awba_prefs.soundMuted` pref.)
- **Reduce motion** — `.mr-row` with a native `.mr-switch` (`<button role="switch" aria-checked>`,
  visible `On`/`Off`): label `Reduce motion` + sub `Calms animations across Awba. Your device setting is
  always respected too.` On toggle: `AW.prefs.set('motion', on?'reduce':'system')` + set/remove
  `<html data-motion="reduce">` + announce `Reduced motion on.` / `Reduced motion off.`

**§ The path**
- **See the welcome again** — `.mr-row` as `<a href="onboarding.html">` (replay) + a chevron.
- **How Awba works** — `.mr-row` `<button>` → the how-it-works sheet (D.3).

**§ Honesty**
- **Where our words come from** — `.mr-row` `<button>` → the sources sheet (D.3), the pending-review posture.

**§ Your device**
- **Add to your home screen** — `.mr-row` `<button>` → install-help sheet (D.3). If
  `matchMedia('(display-mode: standalone)').matches || navigator.standalone` → replace with a static row
  `On your home screen ✓` (no sheet). (No dependence on a captured `beforeinstallprompt`.)
- **Start over** — `.mr-row` `<button>` (quiet, NOT alarm-red) → the double-confirm flow (D.4).

**§ About** (foot marginalia, `.mr-about`, Courier `--ink-62`)
- `Awba · version 2.0`
- `A companion, not a cop.`
- `Every citation is pending scholarly review.`

### D.2 FINAL copy — rows
- Sound: label `Sound` · sub `Calm cues as you learn.`
- Motion: label `Reduce motion` · sub `Calms animations across Awba. Your device setting is always respected too.`
- Welcome: `See the welcome again`
- How: `How Awba works`
- Sources: `Where our words come from`
- Install: `Add to your home screen` · (installed) `On your home screen ✓`
- Start over: `Start over` · sub `Clear your progress and begin the path anew.`

### D.3 FINAL copy — explainer sheets (shipped `AW.sheet`, cream)
**How Awba works** (label `How Awba works`):
> `Awba teaches the foundations of belief in small steps — fifteen lessons and four reviews, walked at your own pace.`
> `Noor is light you gather as you learn. It is never spent against you, and it never runs out.`
> `Returns counts the days you come back. It only grows, and it can never break.`
> `A wrong answer is never punished — a gentle word, and a chance to look again.`
> `No accounts, no streaks to lose, nothing to buy. Just a path, and light to walk it by.`

**Where our words come from** (label `Where our words come from`):
> `Every verse and hadith in Awba is shown word-for-word from its source — we never paraphrase, and we hold anything sensitive back until it's checked. Each one carries a quiet mark:`
> `<span class="r-pill">unverified · pending review</span>`  ← a live pill (exact shipped markup)
> `Nothing here has been signed off by a scholar yet. When it is, this note will change.`

**Add to your home screen** (label `Add to your home screen`) — feature-detect the platform line:
> (iOS/Safari — `'standalone' in navigator`) `On iPhone or iPad: tap Share, then Add to Home Screen.`
> (other) `On Android or desktop: open your browser menu, then Install (or Add to Home Screen).`
> `Add it once, and your path is always here.`

### D.4 Start-over — calm two-sheet double-confirm (Draft A; mercy voice, never red, keep = default)
**Ruling: two sequential `AW.sheet` cream sheets, keep = the prominent `.btn`, destroy = the quiet
`.btn.ghost` (Draft A) — NOT a single same-button double-tap (Draft B).** Why: two fresh sheets make a
rapid double-tap impossible to blow through, each step makes *keep* the primary action, and using
`.btn.ghost` (not the rose `.btn.retry`) for destruction stays on-label (rose is the retry-frame
semantic per D-A12, not a destroy button). Never red, no shake, no drama.

- **Sheet 1** (label `Start over?`):
  > `Start over?`
  > `This clears your noor, your returns, and every star — and begins the path anew. Your settings and your name stay, and your ring keeps its own hand. It can't be undone.`
  - buttons: `.btn` `Keep everything` (primary → close) · `.btn.ghost` `Start over` (→ sheet 2)
- **Sheet 2** (label `One more time`):
  > `One more time — are you sure?`
  > `Once cleared, your light and your returns can't be brought back. You can always begin again from here.`
  - buttons: `.btn` `No, keep it` (primary → close) · `.btn.ghost` `Yes, clear it` (→ reset)
- **On `Yes, clear it`:** `AW.S.reset()` (Wave-A S2 — re-inits `awba_state` to defaults, **preserving
  `ringSeed`** so the same fingerprint re-inks; settings/prefs/name/`onboardingDone` untouched). Then
  close and open a confirmation sheet:
  > `A fresh path begins.`
  > `Your light and returns are cleared. The same ring is waiting to be inked again.`
  - button: `.btn` `Back to the path` (→ `learn.html`)
  - `AW.announce('Your progress has been cleared. A fresh path begins.')`

**ringSeed ruling — PRESERVE (same fingerprint).** Why over Draft A's original "drop the seed for a
fresh ring": law 10 says the seed is the maker's mark, "created ONCE… then NEVER regenerated." Start-over
clears *progress*, not *identity* — the same hand re-walks. `AW.S.reset()` therefore preserves
`ringSeed`. (This also keeps the copy honest: "the same ring… inked again," not "a new ring.")

**Why `AW.S.reset()` over Draft B's six page-side `AW.S.set()` calls:** reset is a storage operation
that belongs in the storage owner (the ONLY code allowed to touch the blob shape); a single atomic
method is schema-proof (always clears to the current `defaultState()`), testable, and simpler at the
call site. The diff is ~4 lines, reuses `persist`/`defaultState` → **no new `localStorage` literal**
(count stays 13). Both approaches are law-compliant (neither touches raw `localStorage` on the page);
the seam is the better-engineered one. Because a defaults blob then exists, legacy-key re-migration
never fires (D-15 keys stay orphaned, harmless).

### D.5 Component manifest
| Element | Source |
|---|---|
| `.reg-page .grain`, `.sheet-row`/`.osw-row` press grammar, `.btn/.btn.ghost`, `.osh-note`-style sheet prose, `.r-pill`, `AW.muteBtnHtml/.bindMuteBtn`, `AW.sheet`, `AW.announce`, `AW.prefs` | **shipped** |
| `AW.S.reset()` | **Wave-A seam S2** |
| `.mr-kick/.mr-title/.mr-sec/.mr-sec-h/.mr-row/.mr-label/.mr-sub/.mr-switch/.mr-chev/.mr-about` | **new page-CSS** (`@layer screens`) |
| chevron / switch-knob | **inline aria-hidden SVG** (the doodle precedent — NOT a new `AW.GLYPHS` entry) |
| tab bar `.otabs` + `.reg-page .otabs` cream seam | **shipped + Wave-A seam S1** |

`.mr-switch` (native `role="switch"`): track `background:var(--rule)`→`var(--crimson)` when
`aria-checked`; knob `background:var(--cream)`, transform on `--dur-press`; 44px hit; crimson focus
(auto). `.mr-row` reuses `.sheet-row` press (`translateY(1px)` + faint crimson `:active` wash). `.mr-sub`
`--ink-62` /* 5.02:1 */. `.mr-about` Courier `--ink-62`.

### D.6 Motion
- Row press = the one paper-press (`--dur-press`). Switch knob = `transform var(--dur-press) var(--ease)`
  (the motion toggle itself must not animate under reduced motion — the `@layer motion` collapse handles
  it). Sheets = shipped `AW.sheet` settle (`--dur-sheet`). No ambient loops.

### D.7 A11y contract
- Every row native `<button>`/`<a>`; toggles carry state (`aria-pressed` for `#lsmute`, `aria-checked`
  for `.mr-switch`); labels/subs are real text; icon-only controls carry `aria-label`. Sheets use the
  shipped `AW.sheet` (trap + Esc + cream); `Escape` cancels Start-over at any step (= keep). `AW.announce`
  on motion toggle + on reset. 44px; crimson `:focus-visible` (auto). Chevrons/knobs `aria-hidden`.

### D.8 Edge states
- Already installed → install row shows `On your home screen ✓` (no sheet).
- `AW.S.isFallback()` true → reset may not persist (protective session-fallback); the confirmation still
  shows — acceptable rare edge; `AW.S.reset()` calls `persist` directly (which the fallback guard
  no-ops).
- Reduced motion already on (system) → the switch reflects `awba_prefs.motion`; toggling to `system`
  doesn't override the OS setting (both triggers independent — the honest sub-copy says so).
- Start-over on an empty state = a harmless no-op reset.

### D.9 Acceptance checklist
- [ ] One register (`.reg-page` cream); IA = labelled sections of rows; no Ring/Sky/thermal/celebration.
- [ ] Sound uses the shipped `#lsmute` component; motion writes `awba_prefs.motion` + stamps `[data-motion]`.
- [ ] Start-over is a calm two-sheet double-confirm; keep = primary `.btn`; destroy = quiet `.btn.ghost`
      (never rose/red); `AW.S.reset()` (no raw storage); preserves prefs/name/onboarding + **ringSeed**.
- [ ] Sources sheet carries a live `.r-pill` + the honest posture; how-it-works + install copy verbatim.
- [ ] Zero new hex/token/glyph (chevron/switch = inline aria-hidden SVG); new CSS in one `@layer screens`.
- [ ] SW-register + `theme-color #F3EDE2`; cream tab bar (More active, crimson); precache + gate discovery.

---

## E · TAB BAR INTEGRATION

Five tabs, shipped order + icons: **Learn** `lamp` · **Practice** `beads` · **Returns** `flame` ·
**Profile** `man` · **More** `pattern`. (`man` is a shipped aniconic scene glyph — acknowledged, stays.)

### E.1 Which pages carry the bar
| Page | Bar? | Active | Register / cue |
|---|---|---|---|
| learn.html | yes | Learn | Orbit / gold |
| practice.html | yes | Practice | Page / crimson |
| profile.html | yes | Profile | Orbit / gold |
| more.html | yes | More | Page / crimson |
| onboarding.html | **no** | — | pre-path threshold |
| lesson / review / practice/session.html | **no** | — | immersive, tab-free (shipped convention) |

### E.2 Real navigation (replaces the coming-soon stubs)
- **Learn / Practice / Profile / More:** the **inactive** tabs are `<a class="tab" href="…">` (native
  nav — file://-safe, gets the shipped cross-document morph for free, scripture never carries a VT name).
  The **active** tab is `<button class="tab active" aria-current="page">` that scrolls to top
  (`window.scrollTo({top:0, behavior: AW.reducedMotion() ? 'auto':'smooth'})` — the shipped Learn-tab
  behaviour generalised).
- **Returns** stays a `<button class="tab">` opening the **streak sheet everywhere** (never navigates)
  — via `AW.streakSheet()` (S3), identical on all four pages. On learn.html it already works
  (`openStreakSheet`) — leave it, then refactor it to call `AW.streakSheet()` in Wave C (S3 adoption).
- **New-page tab builder** (mirror the shipped `tab()`, inactive = real links):
  ```js
  function tab(id, active, scene, label, href) {
    if (active) return '<button class="tab active" type="button" id="'+id+'" aria-current="page">'
      + '<span class="otab-ic">'+AW.icon(scene)+'</span>'+label+'</button>';
    if (href)   return '<a class="tab" id="'+id+'" href="'+href+'"><span class="otab-ic">'+AW.icon(scene)+'</span>'+label+'</a>';
    return      '<button class="tab" type="button" id="'+id+'"><span class="otab-ic">'+AW.icon(scene)+'</span>'+label+'</button>'; // Returns
  }
  ```
  Re-attach the Returns click (`AW.streakSheet`) after every render (full innerHTML rebuilds).
- **learn.html Wave-C rewire:** replace ONLY the three `comingSoonSheet(...)` handlers (Practice /
  Profile / More) with navigation to `practice.html` / `profile.html` / `more.html`. **Leave Learn
  (scroll-to-top) and Returns (streak sheet) untouched.** `comingSoonSheet` becomes unused by the bar
  and may be removed; the **course-switcher's `COMING SOON` rows are a separate feature and stay
  untouched** (Fiqh/Seerah/Qur'an permanent pills).

### E.3 Register consequence — the cream-vs-dark ruling (single seam S1)
Same `.otabs` markup on every page; only the container ground differs:
- **Orbit pages (learn, profile):** the shipped `.otabs` exactly (`background: color-mix(in srgb,
  var(--kiswah) 90%, transparent)`, `border-top: 2px solid var(--navy)`, `backdrop-filter: blur(8px)`;
  inactive labels `--paper-62`, icons gold; active **gold** label + gold 2px top-rule via the shipped
  `.reg-orbit .tab.active` override). **No change** — reuse verbatim.
- **Cream pages (practice, more):** the **base** `.tab` rules already give the correct behaviour —
  inactive `--ink-62` (5.02:1), active **crimson** label + crimson 2px top-rule (`.tab.active`, 6.13:1).
  The only wrong thing on cream is the `.otabs` *container* (it hardcodes the Kiswah bg + navy border)
  → **one Wave-A seam rule (S1)**, added in `@layer components` beside `.otabs` in `awba-engine.css`:
  ```css
  .reg-page .otabs {                                                 /* cream-ground bar variant */
    background: color-mix(in srgb, var(--cream) 92%, transparent);
    border-top: 1px solid var(--rule);
  }
  ```
  Specificity `.reg-page .otabs` (0,2,0) beats base `.otabs` (0,1,0). **Drop Draft B's `.reg-festival`
  addition** — no Festival page ships in v2; add it later if a Festival surface ever needs the bar.
  Inactive icons on cream inherit `--ink-62` (currentColor) — a deliberate quieter treatment than Orbit's
  all-gold icons, correct for the cream accent budget.

### E.4 A11y / motion
- Active tab `.active` + `aria-current="page"`; inactive links real `<a href>`; Returns a labelled
  `<button>` (`aria-label="Open your streak"`). 44px per tab (shipped). Register-correct `:focus-visible`
  (auto). Bar is a direct child of `#app` (no transformed ancestor breaks `position:fixed`). Content
  wrappers add `padding-bottom: calc(var(--sp-16) + env(safe-area-inset-bottom))` so the fixed bar never
  covers content. Tab-to-tab motion = the shipped native page morph (`@view-transition`), reduced-motion-
  killed by the shipped `@layer motion` block. No page-authored transition.

### E.5 Acceptance checklist
- [ ] Learn/Practice/Profile/More navigate for real; Returns opens the streak sheet on every bar; no
      dead taps.
- [ ] Active tab per page correct (`.active` + `aria-current`); gold on Orbit, crimson on cream.
- [ ] Cream bar via the single `.reg-page .otabs` seam (S1); base `.tab.active` gives crimson untouched.
- [ ] learn.html: only the 3 coming-soon handlers rewired; Learn + Returns + course-switcher untouched.
- [ ] Onboarding + lesson/review/session carry no bar.

---

## 8 · Consolidated Wave-A engine seams (the whole diff, smallest true set)

One agent on main. Each seam with its exact contract + the invariants it touches. **Net effect: 1 CSS
rule + 3 JS additions + 2 prefs keys, plus dev data/tooling (not engine edits). Every frozen count is
unchanged.**

| # | Seam | Kind | Exact contract | Invariants touched |
|---|---|---|---|---|
| **S1** | `.reg-page .otabs` cream bar | engine CSS, 1 rule (`@layer components`) | `background: color-mix(in srgb, var(--cream) 92%, transparent); border-top: 1px solid var(--rule);` | none — token-only, zero new hex; base `.tab.active` crimson already correct on cream |
| **S2** | `AW.S.reset()` | engine JS, ~4 lines | `var seed = mem && mem.ringSeed; mem = defaultState(); if (seed != null) mem.ringSeed = seed; persist(mem);` — clears progress, **preserves ringSeed**, no-ops persist under `memFallback` | reuses `persist`/`defaultState` → **no new `localStorage` literal** (count stays **13**); defaults-blob-present blocks legacy re-migration |
| **S3** | `AW.streakSheet()` + `AW.noorSheet()` | engine JS, ~20 lines | hoist learn.html's page-private `openStreakSheet`/`openNoorSheet` verbatim (they already read only `AW.state()`/`AW.weekCal()`, render via `AW.sheet`/`AW.icon`, carry the exact shipped `.osh-*` copy). No args. **D-60 REQUIRES one implementation** — so this is mandatory (re-authoring per-page would violate D-60). learn.html adopts them in Wave C. | no new storage literal, no new glyph; learn.html's zero-storage count unchanged |
| **S4** | `AW.practiceRun(mountEl, items, opts)` | engine JS, ~70 lines | the practice mini-runner (full contract in §B.8): reuses `AW._beatHtml` + shipped `.opt/.tf/.tile/.opt.correct/.opt.wrong/.opt-why/.btn.retry`; mirrors shipped `bindChoice`/`bindTile` resolve; **no noor/stars/`touchDay`/du'a/Ring/Festival/body-wipe**; `opts.onDone({correct,total})`; `AW.wire` if refs/terms present; single-source PRAISE (hoist the lesson runner's local to a module const both share) | additive; **no new localStorage literal (13)**, **no new glyph (13)**, no NODE_ATOMS change (61); gets a new unit test |
| **prefs** | `onboardingDone`, `displayName` | 2 new keys | additive via `AW.prefs.get/set` (the install-nudge precedent); no schema bump | no storage schema change; every page's direct storage-word count stays **0** |
| **data** | `shared/practice-pool.js` (generated) · `scripts/build-practice-pool.js` (dev) · `scripts/tests/practice-pool-audit.mjs` (gate) | new data + tooling (NOT engine edits) | reuse `validate-content.js` `ingest()`; lessons-only, byte-verbatim, native field names; gate follows `port-audit.checkDailyFidelity` shape (§B.2) | pool provably byte-verbatim vs the 15 frozen lessons; no runtime engine hook |

**Deferred / recommended fast-follows (NOT built in v2 — logged, not required):**
- **S5** — hoist learn.html's page-private `SPROUTS` + `sproutFor` → `AW.SPROUTS`/`AW.sproutFor(id)` so
  Profile can grow a garden of finished lessons (≤15 sprouts, framed as a *collection* not a 65-map).
  Needs a learn.html Wave-C refactor to adopt `AW.sproutFor`. Highest-value fast-follow.
- **S6** — hoist learn.html's `UNITS` → `shared/course-structure.js` (single source of truth) to remove
  Profile's `PF_UNITS` duplication.

**Invariant ledger (all UNCHANGED by v2 — no gate edit needed for these):** engine `localStorage`
literal count = **13**; every page (incl. the 4 new + pool.js) direct storage-word count = **0**;
`AW.GLYPHS` count = **13**; `AW.KIT` count = **20**; `NODE_ATOMS` sum = **61**; `@layer tokens, base,
components, screens, motion;` order line appears exactly once (new pages add only `@layer screens`
content blocks). Zero new hex anywhere.

---

## 9 · Wave-C integration list (one agent on main, after merge-review)

### 9.1 learn.html (zero-storage count stays 0)
1. **First-run redirect guard** — §0.4 exact code at the top of the outer IIFE.
2. **Tab rewire** — §E.2: the 3 `comingSoonSheet` handlers → nav to `practice.html`/`profile.html`/
   `more.html`. Learn + Returns + course-switcher untouched.
3. **Adopt S3** — refactor `openStreakSheet`/`openNoorSheet` to call `AW.streakSheet()`/`AW.noorSheet()`.
4. **Adopt single-source PRAISE (S4)** — if the lesson runner's local `PRAISE` was hoisted to a module
   const, no learn.html change; this is an engine-internal move.

### 9.2 sw.js (offline + version bump)
- Add PRECACHE entries (relative, no leading slash): `onboarding.html`, `practice.html`,
  `practice/session.html`, `profile.html`, `more.html`, `shared/practice-pool.js` (**+6 → 52 entries**).
- **Bump `CACHE` `'awba-cache-v1'` → `'awba-cache-v2'`** (the only trigger for the activate-time purge +
  fresh precache pickup). `c.addAll` fails install if any entry 404s → **all six must exist on disk
  first**. `caches.match('learn.html')` offline fallback unchanged. `pwa-audit.mjs` re-derives + disk-
  checks automatically once these land.

### 9.3 The five gate-coverage edits (from R4 — wire discovery, run isolated, report the TRUE totals)
1. **`render-smoke.mjs` `findPages()`** — add the 4 root pages explicitly + discover the `practice/` dir
   (like `lessons`/`reviews`). Count 20 → ~25. Pass = no `Uncaught|AW is not defined|SEVERE` + a
   `reg-(page|orbit)` class present per page.
2. **`contrast-audit.mjs` `findPages()`** — add the 5 pages + a `driverFor`/`budgetFor`/`timeoutFor`
   branch: reuse the **LESSON** load driver for the Page pages (practice.html/more.html/session.html —
   session needs a quiz-advance driver), the **LEARN** load driver for the Orbit pages
   (onboarding.html/profile.html — onboarding needs a pane-advance driver). Count 20 → ~25; the
   corpus-wide ground-truth ratio checks are unaffected.
3. **`rtl-audit.mjs` `findPages()`** — add the 5 pages (any reused Arabic in session rides shipped
   `.trans`/`.ayah` markup). Targets 21 → ~26.
4. **`check-glyph-coverage.py` `harvest()`** — add the 4 root pages + `practice/session.html` +
   `shared/practice-pool.js`. No new codepoints expected (pool is byte-verbatim substrings) → passes;
   this closes the silent-gap risk (the gate never sees unlisted pages).
5. **`a11y-keyboard.test.js` file list** — add the 4 root pages + session (native-control + zero-
   positive-tabindex sweep must include them).

Plus: extend the **gated-literal sweep** file scope to the 5 new pages (grep them for the retired-
vocabulary/celebration-primitive set; remember `ugrep` needs `--`/paren-wrap for patterns starting with
`-`, and scope celebration-class greps to `class="…\b(dab|thread|plate|rosette)\b` to avoid the
`"One religion, one thread"` false positive). Add `practice-pool-audit.mjs` to the standing gate board
+ README's command block.

### 9.4 New tests
- `scripts/tests/practice-pool-audit.mjs` (S4 data gate) — `PRACTICE-POOL BYTES OK` / `… DRIFT`.
- A `node --test` unit test for **`AW.practiceRun`**: correct → PRAISE + `AW.announce('Correct.')` +
  advances; wrong → grey `.opt.wrong` + `.opt-why` "Nothing lost. …" + `.btn.retry`; **zero
  `awba_state` writes** (assert noor/stars/returns unchanged before/after a full run); `onDone({correct,
  total})` correct.
- A `node --test` unit test for **`AW.S.reset()`**: clears noor/returns/lastDay/days/stars/chests to
  defaults; **preserves `ringSeed`** and all `awba_prefs`; the localStorage-literal count assertion (13)
  and no-op-under-`memFallback` behaviour hold.
- (Optional) smoke for `AW.streakSheet`/`AW.noorSheet` parity with the retired inline builders.

### 9.5 Run discipline
Run all Chrome-spawning gates **isolated, never concurrent** (render-smoke, contrast-audit, rtl-audit,
and the `node --test` glob's 3 Chrome files). Test command: `node --test scripts/tests/*.test.js` (glob
form only). Never hand-write a count a gate didn't print — wire discovery, run, report the true total.

---

## 10 · Open items on the owner ledger (v2 does NOT resolve these — build around them)

1. **Ring denominator 61 vs 65** — show **61** (the live engine value + Ring `aria-label` +
   `learn-state.test` pin). Owner-confirm before any change; 65 would be a one-line `structure.atoms`
   engine change that cascades, never a per-surface fix.
2. **Practice noor = none** — owner-reviewable; recommend keep none (matches circle-back; un-farmable;
   safest for the economy).
3. **Practice does not credit `returns`** — owner-reviewable; recommend no (streak stays tied to learning).
4. **Compound reward-clause CTAs not confirmed canonical (R5 §5)** — kept reward text as calm Courier
   sub-lines, never shouty button labels. Confirm at the copy gate.
5. **Sound assets silent (D-52)** — session wires the existing `AW.sound('correct'|'incorrect')` slots;
   sources no audio (owner decision: sound effects not music).
6. **Sprout garden (S5) + `UNITS` hoist (S6)** — deferred fast-follows; Profile's poetry rests on the
   Ring for v2.
7. **Display-name Arabic edge** — `dir="auto"` + the workhorse font render any-script names correctly at
   runtime; the gate renders the empty default (no Arabic in the swept DOM → rtl-audit clean).
8. **Reviews-in-practice-pool** — deferred (needs item-shape normalisation); v2 pool is lessons-only.
9. **Scholar sign-off / Clear Quran licensing / default du'a / Arabic chapter-terms / Fiqh-Seerah-Qur'an
   courses** — untouched, no new religious content; course-switcher stays coming-soon.

---

*End DESIGN-V2.md. Every authored string above is final copy for builders to paste. No scripture is
invented; every surfaced citation carries the shipped `unverified · pending review` pill; all colour is
`var(--token)` (zero new hex); all motion is the one easing family under both reduced-motion triggers;
every frozen count (localStorage 13 · GLYPHS 13 · KIT 20 · atoms 61 · page-storage 0) is held.*
