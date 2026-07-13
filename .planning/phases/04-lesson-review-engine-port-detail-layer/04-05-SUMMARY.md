---
phase: 04-lesson-review-engine-port-detail-layer
plan: 05
subsystem: engine
tags: [review-runner, timer-state-machine, circle-back, orbit-register, hajar-gold, thread-progress, rosette-seal, byte-splice, vanilla-js]

# Dependency graph
requires:
  - phase: 04-04
    provides: "AW._noorClaimer() persist-once seam (patterns-established said 04-05 mirrors it) + the register-carrier shell precedent"
  - phase: 04-03
    provides: "AwbaLesson runner shape (headless guard, setHUD/foot/btn idiom, .opt/.tf verdict classes, the 44px mute toggle this plan extracts and shares)"
  - phase: 04-02
    provides: "@layer screens shipped surfaces this plan's review CSS consumes (.ls-hud/.ls-mute/.ls-count/.opts/.tfrow/.meta/.rw-stars/.foot/.pintro/.opt-why)"
  - phase: 04-01
    provides: "AW.reviewScore / AW.reviewStars / AW.QTIME / AW.PER_REVIEW / AW.SWIFT — the byte-copied pure review math the runner calls, never re-derives; render-smoke + port-audit harnesses"
provides:
  - "AwbaReview(cfg) in the RUNNERS section — Gen-3's legendary review runner, mechanics byte-preserved, expressed on the Orbit register (.reg-orbit black + Hajar Gold)"
  - "the S5 review @layer screens surfaces (.rv-intro/.rv-ringdabs/.rv-timer/.rv-tnote/.rv-thread/.rv-arc/.rv-stage/.rv-q/.rv-result/.rv-mastery/.rv-noorline)"
  - "shared muteBtnHtml()/bindMuteBtn(refresh) — the ONE 44px HUD mute-toggle pattern for both runners"
  - "reviews/u1-review.html — the first ported review, cfg byte-identical (the review walking slice)"
affects: [04-06, 04-07, phase-05]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Review timer as Gen-3's exact decisecond machine: tleft = AW.QTIME*10, a 100ms setInterval, width %, .low under 28% — expression is the only change (.low = quiet ember deepen, never red/alarm)"
    - "Progress-as-thread: the container builds one .rv-arc SVG per question; paintThread() toggles the SHIPPED .thread class onto the path i<correct (classList.toggle with force never re-adds, so the draw never replays)"
    - "Un-inked-vs-lit split via :not(.thread) so the screens-layer rest style can never outrank the components-layer .thread gold (layer order: screens beats components)"
    - "Byte-splice port recipe re-proven on a review: extract the cfg region with port-audit's exact regex, assemble into a fresh zero-CDN Athar shell programmatically — never retype"

key-files:
  created:
    - "scripts/tests/runner-review.test.js — 6 DOM-free assertions: AwbaReview exists; QTIME 14→140ds; reviewScore 20/15; reviewStars 3/2/1 (2★ any-timeout cap, 1★ partial floor, never 0); review noor persists once via AW._noorClaimer; best-of star never downgrades"
    - "reviews/u1-review.html — cfg SHA 6e105a905c62b0947c7b3fb0c2c181fce630143a1f1365107f4f38593101402c byte-identical to _MVP-BUILD; CDN stripped; ../shared paths"
  modified:
    - "shared/awba-engine.css — +187 lines of S5 review surfaces inside the existing @layer screens block (order line untouched, count 1); token-only, zero new hex, gold/ember accents only"
    - "shared/awba-engine.js — AwbaReview(cfg) runner + the shared mute-toggle helpers (AwbaLesson refactored to consume them)"

key-decisions:
  - "The review noor persist at result routes through AW._noorClaimer() (T-04-05a mitigation + the 04-04 patterns-established instruction) — same arithmetic as Gen-3's one-shot AW.S.set, now re-entry-proof"
  - "The mute toggle is ONE shared module-scope pattern (muteBtnHtml/bindMuteBtn) consumed by both runners — the plan's §S6 hard rule; AwbaLesson's closure copies removed, zero behaviour change"
  - "Gen-3's goldsel selection class re-voiced as an inline gold borderColor cue (the AwbaLesson selection precedent, crimson→gold for Orbit); verdicts consume the shipped .opt.correct/.opt.wrong"
  - "The un-inked thread arcs rest --navy (the Orbit table's un-inked-rows ink) via .rv-arc path:not(.thread) — scoping by :not() keeps the shipped .thread gold + draw animation authoritative despite screens outranking components in the layer order"
  - "Gen-3's AW.CLOCK/AW.HEART foot icons are dropped (no clock/heart in the frozen 13-glyph registry) — the timeout verdict is an ember-inked title, the miss is law-8 'Nothing lost' text; no new glyph authored"

patterns-established:
  - "The byte-splice recipe now proven on BOTH page families (lesson + review) — 04-06 ports the remaining 14 lessons + 3 reviews with the same extraction regex + shell assembly"
  - "Review shell idiom for any future Orbit-register session: .reg-orbit .rv-shell carrier, ls-hud reuse, timerwrap .on toggle, thread row display toggling"

requirements-completed: [ENG-02, ENG-04, CNT-01, RWD-03, MOT-05]

# Metrics
duration: ~15min
completed: 2026-07-13
---

# Phase 4 Plan 05: AwbaReview Runner + Review Surfaces + First Ported Review Summary

**Gen-3's legendary review runner now lives in the RUNNERS section with its 14s decisecond timer, permanent-allInTime-kill timeout, circle-back mercy, and 15+swift5 / 3-2-1-star math byte-preserved via the 04-01 pure helpers — the whole session re-voiced onto the Orbit register (Kiswah Black + Hajar Gold, crimson banned): "the circle gathers" dab-drift intro, gold .thread arcs for progress, a quiet ember timer deepen, and a stamped gold .rosette mastery seal — proven end-to-end on a byte-identical ported u1-review.html.**

## Performance

- **Duration:** ~15 min
- **Completed:** 2026-07-13
- **Tasks:** 3 (Task 2 TDD: RED → GREEN)
- **Files modified:** 4 (1 CSS, 1 engine, 1 test created, 1 review page created)

## Accomplishments

- **S5 review surfaces** authored inside the existing `@layer screens` block (order line untouched, count 1): `.rv-intro` "the circle gathers" hero (six shipped `.dab` drift in around a ring, gold trophy centre), `.rv-timer` thin decisecond bar with a `.low` state that is a **quiet ember deepen** (never red, never a buzzer, nothing shakes), `.rv-thread` gold-thread progress arcs consuming the shipped `.thread`, `.rv-q` question surface, `.rv-timeout`/`.rv-good` verdict foots, `.rv-result` mastery screen with the shipped gold `.rosette` seal. Token-only, zero new hex; every pairing cited to the §S5 Orbit table (gold 8.40:1, ember 5.05:1, cream 16.22:1).
- **`AwbaReview(cfg)`** ports the Gen-3 state-machine byte-for-byte: `tleft = AW.QTIME*10` (140), 100ms tick, `.low` under 28%, `tleft<=0` → `thisInTime=false; allInTime=false` **permanently** → `timeUp()` (push to `skipped`, "time — it will wait at the end", options disabled, 1500ms auto-skip, no penalty); `advance()` → queue exhausted + `phase==='main' && skipped.length` → `circleBackOffer()` (`phase='back'`, `queue=skipped.slice()`, untimed, **no noor** — a named answer still lights its thread); numbers ONLY via `AW.reviewScore(thisInTime)` (20 swift / 15) and `AW.reviewStars(correct, total, allInTime)` (3 / 2 any-timeout cap / 1 partial, never 0); verdicts Legendary / Mastered / Reviewed; noor persists **once** at result via `AW._noorClaimer`; best-of star persist never downgrades; `AW.touchDay()` on "Begin the review"; `awback` hidden — **no back button anywhere**.
- **Sound + mute (§S6/MOT-05):** `AW.sound('correct'|'incorrect')` at the answer verdict, `'complete'` at the mastery result — meta moments only (the review carries no scripture surface). The 44px HUD mute toggle (aria-pressed + aria-label swap, `awba_prefs.soundMuted`) is now **one shared pattern** (`muteBtnHtml`/`bindMuteBtn`) consumed by both runners.
- **`reviews/u1-review.html`** — the review walking slice: cfg **byte-identical** to `_MVP-BUILD/reviews/u1-review.html` (SHA `6e105a905c62b0947c7b3fb0c2c181fce630143a1f1365107f4f38593101402c`, port-audit `BYTES OK`), the CDN font `<link>` stripped, self-hosted readex 400/600 preloads, one stylesheet, classic engine script, page-relative `../shared/` paths. Validator exit 0; render-smoke `SMOKE OK` on **both** `lessons/u1-m1.html` and `reviews/u1-review.html` (zero console errors, `.reg-orbit` register root); the rendered intro composition verified in headless Chrome (ring dabs, trophy glyph, title, both CTAs, 6 thread arcs, mute toggle).

## Task Commits

Each task committed atomically (Task 2 TDD, split RED/GREEN):

1. **Task 1 — Review @layer screens surfaces (Orbit + gold):** `f7fa6a9` — feat(04-05): review @layer screens surfaces — Orbit-dark + Hajar Gold (S5)
2. **Task 2 RED:** `16d0b8f` — test(04-05): add failing AwbaReview runner contract test (RED) — suite 94 tests, 1 fail (`typeof AwbaReview === 'undefined'`)
3. **Task 2 GREEN:** `98b8a55` — feat(04-05): AwbaReview(cfg) — timer state-machine + circle-back + mastery (GREEN) — suite 88→94/94 fail 0
4. **Task 3:** `d855a50` — feat(04-05): port reviews/u1-review.html — first review renders end-to-end

## TDD Gate Compliance

RED gate: `16d0b8f` (test commit, AwbaReview-existence assertion failing — 6 tests / 5 pass / 1 fail proven before implementation). GREEN gate: `98b8a55` (feat commit, `node --test scripts/tests/runner-review.test.js` → fail 0; full suite 94/94). No refactor commit needed (the mute-helper extraction shipped inside GREEN as part of the mandated share-the-pattern implementation).

## Deviations from Plan

### Auto-fixed / discretion (no STOP required)

**1. [Plan-mandated share] Mute toggle extracted from AwbaLesson to module scope**
- **Found during:** Task 2
- **Issue:** the plan requires the review HUD mute toggle to share the AwbaLesson pattern, but the helpers lived inside AwbaLesson's closure
- **Fix:** `SPEAKER_ON/OFF` + `muteBtnHtml()`/`bindMuteBtn(refresh)` hoisted to module scope in the RUNNERS section; AwbaLesson refactored to consume them (zero behaviour change; suite held green)
- **Files modified:** shared/awba-engine.js — **Commit:** 98b8a55

**2. [Rule 1 — D-45 re-voice] Gen-3 `goldsel` class → inline gold border selection cue**
- **Found during:** Task 2
- **Issue:** Gen-3 marks selection with a `goldsel` class; gen-4 ships no such class and the AwbaLesson precedent uses an inline token borderColor cue
- **Fix:** `n.style.borderColor='var(--gold)'` (the lesson's crimson cue re-voiced gold for Orbit); verdicts consume shipped `.opt.correct`/`.opt.wrong`
- **Files modified:** shared/awba-engine.js — **Commit:** 98b8a55

**3. [Rule 1 — frozen registry] Gen-3 `AW.CLOCK`/`AW.HEART` foot icons dropped**
- **Found during:** Task 2
- **Issue:** the frozen 13-glyph registry (components.test.js pins the counts) has no clock/heart mark
- **Fix:** the timeout verdict is an ember-inked `.pintro` title ("Time — this one will wait at the end"); the miss verdict is law-8 "Nothing lost" text — no new glyph authored
- **Files modified:** shared/awba-engine.js, shared/awba-engine.css — **Commits:** f7fa6a9, 98b8a55

**4. [Rule 2 — T-04-05a] Result noor persist routed through `AW._noorClaimer()`**
- **Found during:** Task 2
- **Issue:** Gen-3's bare one-shot `AW.S.set('noor', …)` at result is re-entry-fragile; the threat register mitigates double-persist and 04-04's patterns-established instructs 04-05 to mirror the claimer
- **Fix:** `claimNoor(noorEarned)` — identical arithmetic, idempotent; pinned by the new test
- **Files modified:** shared/awba-engine.js, scripts/tests/runner-review.test.js — **Commits:** 16d0b8f, 98b8a55

**5. [Rule 1 — inline guard] The swift chip's spark icon sized explicitly (16px)**
- **Found during:** Task 2
- **Issue:** `.ls-count` has no svg sizing rule; an unsized inline SVG can balloon
- **Fix:** `AW.icon('spark', { size:'16px' })` at the one call site (no CSS change; `.rv-noorline svg` is sized in Task 1's CSS)
- **Files modified:** shared/awba-engine.js — **Commit:** 98b8a55

Copy re-voices per the binding D-45 table (not deviations): "lights its lamp" → "lights its thread"; "Named — lamp lit" → "Named — thread lit"; the retired gold ground class / big intro art → `.reg-orbit` + dab-drift + trophy glyph.

## Known Stubs

| Stub | File | Reason |
|------|------|--------|
| `../learn.html` links ("Maybe later", "Back to the path") | reviews/u1-review.html (via the runner) | Gen-3 parity; the Learn page is Phase 5 — same intentional dead link 04-03 shipped in the lesson terminus |
| `shared/sfx/` empty — `AW.sound` is a clean silent no-op | shared/awba-engine.js | D-52 by design: silent v1; owner sources cue assets later, zero code change |

## Threat Flags

None — no new network endpoints, auth paths, or storage surfaces; persistence stays behind `AW.S`/`AW.prefs` (localStorage grep count held at 13); the CDN-absence + byte-fidelity gates run in port-audit.

## Verification

- Task verifies: all 3 `<automated>` lines run verbatim → PASS (Task 1, Task 2, Task 3).
- Suite: `node --test scripts/tests/*.test.js` → **94/94, fail 0** (baseline 88 grew by 6, never shrank).
- `localStorage` count: **13** (unchanged). `@layer` order line count: **1**.
- `node scripts/validate-content.js` (both pages): exit 0. `node scripts/port-audit.mjs`: `BYTES OK` ×2, `HOLD OK`, exit 0.
- `node scripts/tests/render-smoke.mjs`: `SMOKE OK lessons/u1-m1.html` + `SMOKE OK reviews/u1-review.html`, exit 0.
- Gated literals: zero hits file-wide for the banned set in shared/ and reviews/.

## Doubts for the 04-07 human gate

1. **The intro composition** (six faint-gold dabs on a 108px ring + a 44px trophy centre) is renderer discretion — does it read as "the circle gathers" at real scale, or too sparse?
2. **Cream `.opt`/`.tf` cards on the black Orbit ground** — the shipped rest chrome consumed as-is (manuscript leaves laid on the black world, ink 16.22:1 inside the card). Confirm it feels elevated, not pasted-in.
3. **`.rv-noorline` is Readex 600 gold at `--fs-h2`**, not Marcellus — law 5's ≥28px display-numeral floor kept the display face off an 18–20px line. Taste call for the gate.
4. **The result screen carries BOTH the rosette seal and the dab star row** (the spec asks for the seal; Gen-3 had stars) — check the double signal doesn't read busy.
5. **The 1500ms timeout auto-skip + ember note** — walk a real timeout and confirm it lands as calm mercy, not a jolt.
6. **The circle-back offer screen** reuses the intro surface with a lamp glyph — confirm the "Almost there" moment reads warm at scale.

## Self-Check: PASSED

- FOUND: shared/awba-engine.css (.rv-* S5 block inside @layer screens)
- FOUND: shared/awba-engine.js (`function AwbaReview`)
- FOUND: scripts/tests/runner-review.test.js
- FOUND: reviews/u1-review.html
- FOUND commits: f7fa6a9, 16d0b8f, 98b8a55, d855a50
