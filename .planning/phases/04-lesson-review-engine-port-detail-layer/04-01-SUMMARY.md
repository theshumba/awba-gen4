---
phase: 04-lesson-review-engine-port-detail-layer
plan: 01
subsystem: testing
tags: [node-test, headless-chrome, engine, sha256, vm-sandbox]

# Dependency graph
requires:
  - phase: 03-components-icon-kit-motion-language
    provides: shipped AW.* primitives (icon/cite/wire/sheet/animate/ringSVG/skyTemp), AW.prefs closure, the RUNNERS/@layer screens placeholders
provides:
  - "AW.lessonStars/AW.comboShow/AW.comboPerfect/AW.reviewScore/AW.reviewStars — pure, DOM-free ENG-03/ENG-04 math contracts"
  - "AW.PER_LESSON/AW.REFLECT/AW.PER_REVIEW/AW.SWIFT/AW.QTIME — the frozen noor/timer constants"
  - "AW.sound(cue) — silent no-op sound plumbing reading awba_prefs.soundMuted"
  - "shared/sfx/ — the tracked, empty page-relative cue directory"
  - "scripts/tests/runner-math.test.js — headless unit proof pinning every ENG-03/ENG-04 number"
  - "scripts/tests/render-smoke.mjs — headless-Chrome page loader (console-error + register-root gate)"
  - "scripts/port-audit.mjs — byte-fidelity SHA + CDN/retired/holds grep gate"
affects: [04-03-lesson-runner, 04-05-review-runner, 04-06-content-port]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Pure-helper extraction: quiz/star/timer math lives on AW.* as DOM-free functions the runners call, mirroring the AW.deriveNodeState/AW.skyDawn precedent"
    - "Wave-0 harness convention: *.mjs tools (not *.test.js) that print OK/FAIL/DRIFT lines and exit 0 with 'no pages yet' against empty content dirs, becoming real gates once content lands"

key-files:
  created:
    - scripts/tests/runner-math.test.js
    - scripts/tests/render-smoke.mjs
    - scripts/port-audit.mjs
    - shared/sfx/.gitkeep
  modified:
    - shared/awba-engine.js

key-decisions:
  - "Reworded an AW.comboPerfect doc-comment away from the Gen-3 function name 'firePerfect' to avoid an incidental gated-literal match in shared/ (no functional change — AW.comboPerfect itself is the plan-mandated API name, not a retired-element reference)"
  - "port-audit.mjs's cfg-region extraction regex (Awba(Lesson|Review)(...) through the closing ');\\n</script>') is the byte-fidelity comparison unit for D-49 — same technique as the preview.html demoCfg SHA precedent"

patterns-established:
  - "AW.sound(cue) hardcodes the ../shared/sfx/ page-relative path because it is only ever called from lessons/reviews/ runners (one level below shared/) — future runner code should not re-derive this path"

requirements-completed: [ENG-03, ENG-04, MOT-05]

# Metrics
duration: ~11min
completed: 2026-07-13
---

# Phase 04 Plan 01: Test foundation — runner-math + AW.sound + Wave-0 harnesses Summary

**Byte-faithful ENG-03/ENG-04 quiz/star/review math extracted as six pure `AW.*` helpers (RED→GREEN, 64→70 tests), `AW.sound` silent-plumbing shipped, and two zero-dep Wave-0 harnesses (render-smoke, port-audit) built that tolerate empty `lessons/`/`reviews/` today and become real gates the moment content lands.**

## Performance

- **Duration:** ~11 min
- **Started:** 2026-07-13T14:50:00Z (approx)
- **Completed:** 2026-07-13T15:01:00Z
- **Tasks:** 3/3 completed
- **Files modified:** 5 (1 modified, 4 created)

## Accomplishments
- Every ENG-03/ENG-04 number from Gen-3's `resolve()`/`starsFor()`/`bind()`/`result()` is now a pure, headlessly-testable `AW.*` contract — the runners (04-03/04-05) call these instead of re-deriving the math inline.
- `AW.sound(cue)` ships full plumbing now, silent v1: missing `shared/sfx/{cue}.mp3` or a blocked autoplay resolves to a clean no-op with zero console errors (D-52/MOT-05).
- The two Wave-0 validation gaps identified in 04-VALIDATION are closed: a headless-Chrome render-smoke loader and a byte-fidelity/CDN/retired-element/holds port-audit tool, both zero-dependency and both already runnable (exit 0, "no pages yet") against today's empty content dirs.

## Task Commits

Each task was committed atomically:

1. **Task 1: Pure runner-math helpers on AW + runner-math.test.js (RED → GREEN)** - `8b5d02d` (test)
2. **Task 2: AW.sound(cue) silent no-op plumbing + shared/sfx/ directory** - `88a1e37` (feat)
3. **Task 3: render-smoke.mjs (Chrome loader) + port-audit.mjs (byte-fidelity + holds/CDN/retired)** - `01aedde` (test)

**Plan metadata:** (this commit, docs: complete plan)

_Note: Task 1 is a TDD task — a single commit was used since the RED state (helpers missing → TypeError) was proven interactively before the GREEN implementation was written and committed together with the test, per the plan's "Write test FIRST, confirm it fails, then implement" instruction; the fail→pass transition was verified live in this session (see Deviations for the one fix mid-flight)._

## Files Created/Modified
- `shared/awba-engine.js` - RUNNER MATH banner added: `AW.PER_LESSON/REFLECT/PER_REVIEW/SWIFT/QTIME` constants + `AW.lessonStars/comboShow/comboPerfect/reviewScore/reviewStars` pure helpers, plus `AW.sound(cue)` silent no-op plumbing
- `scripts/tests/runner-math.test.js` - 6 new tests pinning every ENG-03/ENG-04 number via the `loadEngine`/`makeLS` harness
- `shared/sfx/.gitkeep` - tracks the empty page-relative cue directory (D-52)
- `scripts/tests/render-smoke.mjs` - headless system-Chrome page loader; console-error + register-root (`reg-page`/`reg-orbit`) gate; "no pages yet" exit 0 today
- `scripts/port-audit.mjs` - SHA-256 byte-fidelity of each ported page's cfg region vs the matching Gen-3 source, plus CDN/retired-element/U4-03-hold grep gates and the 3 expected validator notes printed as ACCEPTED; "no pages yet" exit 0 today

## Decisions Made
- Extracted quiz/star/timer math as pure functions rather than DOM-stub-only assertions (04-RESEARCH Open Question 1 / Assumption A4) — this is the cheapest path to ENG-03/ENG-04 coverage and matches the `AW.deriveNodeState`/`AW.skyDawn` precedent already in the codebase.
- `AW.sound`'s relative path is hardcoded to `../shared/sfx/` (not a computed depth) because the function is only ever invoked from `lessons/`/`reviews/` pages, both one level below `shared/` — matches the plan's explicit path caution and the existing `../shared/awba-engine.js` include relativity.
- render-smoke's register-root check uses a substring/regex (`class="[^"]*\breg-(page|orbit)\b[^"]*"`), never a literal `class="reg-page"` equality, since a rendered root may carry additional classes alongside the register class.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] `localStorage` grep-count regression from an incidental doc-comment**
- **Found during:** Task 1 (Pure runner-math helpers)
- **Issue:** The RUNNER MATH banner's opening doc-comment used the phrase "no DOM, no localStorage" to describe the new helpers' purity. `grep -c 'localStorage' shared/awba-engine.js` counts every literal occurrence including comments, so this bumped the count from 13 to 14 — failing the plan's acceptance criterion that the count stay at 13 (helpers touch no storage).
- **Fix:** Reworded the comment to "no DOM, no storage reads/writes of any kind" — same meaning, no literal match.
- **Files modified:** `shared/awba-engine.js`
- **Verification:** `grep -c 'localStorage' shared/awba-engine.js` → 13, confirmed before Task 1's commit.
- **Committed in:** `8b5d02d` (Task 1 commit — fixed before committing, not a separate commit)

**2. [Rule 1 - Bug] Gated-literal comment reference to Gen-3's `firePerfect`**
- **Found during:** Task 2 (AW.sound plumbing), while auditing the working tree for gated literals before committing
- **Issue:** A Task 1 doc-comment for `AW.comboPerfect` read "firePerfect() gate: fires once, at exactly a 3-streak" — citing Gen-3's function name verbatim. This is a legitimate source citation, not a retired-element reference, but it incidentally contains the substring "Perfect" inside a comment in `shared/awba-engine.js`, one of the two files the plan's own retired-element grep gate scans (`grep -rqiE 'confetti|class="perfect"|class="combo"|poppins' ... shared/awba-engine.js`). While the actual gate pattern (`class="perfect"`, with quotes) would not have matched, the machine gotchas note in this session's instructions call for zero tolerance of these literals in `shared/` comments/strings.
- **Fix:** Reworded to "the 3-streak flourish gate: fires once, at exactly combo===3 (Gen-3 resolve() 274; re-voiced per D-45 as a quiet gold-thread flourish, never an overlay)" — same citation, no gated word.
- **Files modified:** `shared/awba-engine.js`
- **Verification:** `grep -inE 'poppins|confetti|perfect|amber|--accent|rgba\(37,54|fonts\.googleapis|lantern-gold' shared/awba-engine.js` → only remaining hit is the legitimate `AW.comboPerfect` API identifier itself (the plan-mandated function name, not prose), which does not match the actual `class="perfect"` gate pattern.
- **Committed in:** `88a1e37` (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (both Rule 1 - bug/regression fixes caught before each task's commit, both self-inflicted by this session's own comment wording, neither affecting behavior)
**Impact on plan:** Both fixes are wording-only; no scope creep, no behavior change. The plan's acceptance criteria (localStorage count = 13, no gated literals in `shared/`) now hold exactly as written.

## Issues Encountered
None beyond the two auto-fixed wording issues above.

## User Setup Required

None - no external service configuration required. `shared/sfx/` is intentionally empty; sound-cue asset sourcing remains an owner-ledger item (D-52), not build-blocking.

## Next Phase Readiness

- The lesson runner (04-03) and review runner (04-05) have their math contracts ready to call (`AW.lessonStars`, `AW.comboShow`, `AW.comboPerfect`, `AW.reviewScore`, `AW.reviewStars`) instead of re-deriving noor/star/combo/timer math inline.
- `AW.sound` is wired and silent; the lesson/review HUD mute-toggle UI (out of scope here) can call `AW.prefs.set('soundMuted', …)` against the same slot with zero engine changes.
- `render-smoke.mjs` and `port-audit.mjs` are ready to turn into real gates the instant 04-03's u1-m1 lands and 04-06 ports the remaining 18 files — no further harness work needed before then.
- No blockers.

## Self-Check: PASSED

All created files verified present on disk; all 3 task commits verified present in git history.

---
*Phase: 04-lesson-review-engine-port-detail-layer*
*Completed: 2026-07-13*
