---
phase: 05-learn-page-cross-page-view-transitions
plan: 01
subsystem: engine
tags: [vanilla-js, node-test, headless-vm, ring, sky, atom-map]

# Dependency graph
requires:
  - phase: 02-state-storage-content-validator
    provides: AW.deriveNodeState (pure node-state derivation, extended here — never forked)
  - phase: 03-components-icon-kit-motion-language
    provides: AW.ringSVG / AW.skyDawn (Ring + Sky primitives, denominator re-wired here)
  - phase: 04-lesson-review-engine-port-detail-layer
    provides: the reward runner's Ring moment (preLessonAtoms/postAtoms, proxy replaced here)
provides:
  - AW.dailyIndex(date, poolLen) — pure day-of-year daily-ayah index (LRN-05 fix)
  - NODE_ATOMS map + AW.atomsDone(progress) — the verified 61-atom taught total (D-57/R-1)
  - AW.muteBtnHtml / AW.bindMuteBtn — exported mute-toggle helpers (D-60)
  - the 65→61 atom denominator live everywhere (Ring, Sky, reward runner, boot --dawn, preview.html)
  - render-smoke.mjs findPages() discovers root learn.html (Pitfall 7, ready for 05-02)
affects: [05-02, 05-03, 05-04, 05-05, 05-06]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Pure engine seam idiom: DOM-free AW.* function, tested via loadEngine/makeLS vm concatenation (mirrors AW.skyDawn/AW.deriveNodeState)"
    - "Module-scope constant (var NODE_ATOMS, not wrapped in an IIFE) directly readable in the same vm context as a bare identifier — same mechanism that lets test probes reference AW directly"
    - "Atomic denominator sweep: engine constant change + every paired test/preview assertion in ONE commit, suite green at the boundary"

key-files:
  created:
    - scripts/tests/learn-state.test.js
  modified:
    - shared/awba-engine.js
    - scripts/tests/ring.test.js
    - scripts/tests/sky.test.js
    - scripts/tests/render-smoke.mjs
    - preview.html

key-decisions:
  - "NODE_ATOMS is a top-level (module-scope) var, not exposed as AW.NODE_ATOMS — the public seam is AW.atomsDone(progress); the test reads NODE_ATOMS directly as a bare identifier in the same vm context, keeping AW's public surface to the single pure function per the DEF_STRUCT/SKY_ATOMS precedent"
  - "AW.atomsDone uses a for-in loop with Object.prototype.hasOwnProperty guard (functionally identical to the plan's literal code sample, marginally more defensive against prototype pollution on the stars object)"

requirements-completed: [CNT-03, LRN-05]

# Metrics
duration: ~20min
completed: 2026-07-13
---

# Phase 5 Plan 1: Learn-Page Engine Seams + 65→61 Atom Denominator Sweep Summary

**Four pure engine seams (dailyIndex, NODE_ATOMS/atomsDone, mute exports) proven headlessly via TDD, plus the atomic 65→61 Ring/Sky atom-denominator rewire across engine, tests, and preview.html — zero DOM built yet.**

## Performance

- **Duration:** ~20 min (commit span 22:17:06Z–22:23:32Z UTC plus context-gathering)
- **Completed:** 2026-07-13
- **Tasks:** 3 (Task 1 TDD: RED commit implicit in the single GREEN commit per plan's atomic requirement — see TDD Gate Compliance below)
- **Files modified:** 6 (1 created, 5 modified)

## Accomplishments

- Wrote `scripts/tests/learn-state.test.js` (9 tests) proving RED before GREEN for every new seam, then landed `NODE_ATOMS` (15 verbatim lesson counts, Σ=61), `AW.atomsDone(progress)`, `AW.dailyIndex(date, poolLen)` (day-of-year, local parts, fixes the Gen-3 monthly-repeat bug), and `AW.muteBtnHtml`/`AW.bindMuteBtn` exports — all pure, DOM-free, tested against the real engine via the `loadEngine`/`makeLS` vm harness.
- Landed the entire 65→61 atom-denominator sweep as ONE atomic commit: `DEF_STRUCT.atoms`, `SKY_ATOMS`, both reward-runner proxy call sites (`preLessonAtoms`/`postAtoms`, the `ATOMS_PER_NODE=3` proxy fully retired), and the boot `--dawn` stamp all now read `AW.atomsDone(AW.state())`/61 — paired with every `ring.test.js`/`sky.test.js`/`preview.html` assertion moving to 61 in the same commit; suite stayed green (no red intermediate commit).
- Extended `render-smoke.mjs findPages()` to discover root `learn.html` behind an `existsSync` guard, ready for 05-02 to create it; render-smoke still exits `SMOKE OK` over the current 19 shipped pages.

## Task Commits

1. **Task 1: learn-state.test.js (RED) → AW.dailyIndex + NODE_ATOMS + AW.atomsDone + mute exports (GREEN)** - `e59131c` (feat)
2. **Task 2: the atomic 65→61 atom-denominator sweep** - `800dfd7` (feat)
3. **Task 3: extend render-smoke.mjs findPages() to discover root learn.html** - `bc545fc` (feat)

_Task 1 was executed under `tdd="true"`: the test file was written and run standalone first (5/9 tests failed with `TypeError: AW.X is not a function` / `AssertionError: undefined !== 'function'` — the RED signal), confirmed before any engine edit, then the engine edit made all 9 pass (GREEN) before the single commit landed. Per plan's task-level instruction the RED state was verified in-session (not committed separately) — see TDD Gate Compliance note._

## Files Created/Modified

- `scripts/tests/learn-state.test.js` - NEW. 9 tests: NODE_ATOMS sum/id-set, AW.atomsDone (empty/single/multi/review+chest-zero), AW.dailyIndex (Jan-8 vs Feb-8 non-collision, integer-in-range + leap-safety), mute-export typeof checks, 3 CNT-03 unlock-walk tests over `AW.deriveNodeState`, 1 chest-claim idempotency test.
- `shared/awba-engine.js` - Added `NODE_ATOMS` (module-scope var, 15 ids, Σ=61) + `AW.atomsDone` immediately after `AW.deriveNodeState` (before the boot block). Added `AW.dailyIndex` beside `AW.skyDawn`. Exported `AW.muteBtnHtml`/`AW.bindMuteBtn` after `bindMuteBtn`. Re-wired `DEF_STRUCT.atoms` 65→61, `SKY_ATOMS` 65→61, both reward-runner atom computations to `AW.atomsDone(AW.state())`, and the boot `--dawn` stamp to `skyDawn(AW.atomsDone(AW.state()))` (dropped the `TOTAL_NODES`/coarse node-count proxy entirely).
- `scripts/tests/ring.test.js` - Every `atomsDone: 65` / `of 65 inked` / `data-atoms="65"` / `4/15/65` assertion moved to 61.
- `scripts/tests/sky.test.js` - `/65` scaling → `/61`; cap-boundary input 65→61; kept the below-cap linear assertion at `26/61`.
- `scripts/tests/render-smoke.mjs` - `findPages()` now pushes root `learn.html` (existsSync-guarded) ahead of the lessons/reviews loop.
- `preview.html` - Every "X of 65"/"X / 65" caption and every `mountRing({..., atomsDone: 65, ...})` call moved to 61 (hero mark, Courier marginalia specimen, the 3 ring-gallery captions + JS calls, the 2 seed-comparison captions + JS calls).

## Decisions Made

- **NODE_ATOMS stays module-private (not `AW.NODE_ATOMS`)**: consistent with the codebase's existing pattern where per-computation denominators (`DEF_STRUCT`, `SKY_ATOMS`, the old `ATOMS_PER_NODE`) are never on the public `AW` surface — only the pure function (`AW.atomsDone`) is. The test reads the module-scope `var` directly as a bare identifier inside the same `vm.runInContext` call (the identical mechanism `sky.test.js`/`ring.test.js` already rely on to reference `AW` directly).
- **The Courier marginalia specimen ("18 / 65 · seed 4711...") in `preview.html` was also updated to 61** even though it is a decorative type specimen, not a live Ring caption — the plan's verify grep (`! grep -qE '/ *65|of 65|65 */ *65' preview.html`) is a blanket "no 65-denominator survives" gate and this string matched it; changing it to 61 is also more honest now that 61 is the app's real denominator.

## Deviations from Plan

None — plan executed exactly as written. One minor implementation-style note (not a deviation in behavior): `AW.atomsDone`'s loop adds an `Object.prototype.hasOwnProperty` guard the plan's literal code sample didn't include; behavior is identical for the plain-JSON `stars` objects the engine ever produces.

## Issues Encountered

None.

## TDD Gate Compliance

Task 1 was `tdd="true"`. The plan's `<action>` instructs writing the test file first and confirming it fails (RED) BEFORE editing the engine, then editing the engine (GREEN), then committing — a single-commit TDD task (unlike the plan-level `type: tdd` gate sequence with separate `test(...)`/`feat(...)` commits, this plan is `type: execute` with a task-level `tdd="true"` flag). RED was verified in-session: `node --test scripts/tests/learn-state.test.js` showed 5 failing / 4 passing (the 4 CNT-03/chest tests passed immediately because they exercise the already-shipped `AW.deriveNodeState`/`AW.S`, which is correct — only the 5 NEW-seam assertions were expected to be RED). After the engine edit, all 9 passed and the single commit `e59131c` landed both files together, matching the plan's explicit instruction ("Run the suite: RED → GREEN") without a separate committed RED state. No gate-sequence warning needed — this is the plan's specified flow, not the plan-level `type: tdd` gate.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `AW.dailyIndex`, `AW.atomsDone`, `AW.muteBtnHtml`/`AW.bindMuteBtn`, and the 61-atom-denominator Ring/Sky/reward wiring are all live, tested, and ready for 05-02 (`learn.html`) to consume directly — no further engine seam work needed for CNT-03/D-57/LRN-05/D-60.
- `render-smoke.mjs` will automatically pick up root `learn.html` the moment 05-02 creates it; no further harness change needed.
- **Carry-forward for the 05-06 human gate:** the `U4-09` atom-hold flag from 05-RESEARCH.md (§Atom Map) is unresolved by design — it is either a 4th silent hold or a numbering gap in Josh's corpus docs, and does not block the 61-atom earnable set either way, but it is an `[ASSUMED]` item the owner should eventually confirm.
- No blockers.

---
*Phase: 05-learn-page-cross-page-view-transitions*
*Completed: 2026-07-13*
