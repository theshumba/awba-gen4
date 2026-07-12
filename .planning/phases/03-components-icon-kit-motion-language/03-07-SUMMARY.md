---
phase: 03-components-icon-kit-motion-language
plan: 07
subsystem: ui
tags: [ring-generator, tawaf-fingerprint, mulberry32, deterministic-svg, seeded-prng, ink-draw, orbit-draw-verb, reduced-motion, spof, maker-mark, macro-progress]

# Dependency graph
requires:
  - phase: 03-06
    provides: "the Athar @layer tokens colour set (--navy/--ember/--cream/--gold hexes) + the one-easing motion tokens --ease + --dur-draw the ink-draw keyframe consumes"
  - phase: 03-03
    provides: "AW.reducedMotion() — the call-time gate the generator's reduced-motion branch consults"
  - phase: 02 (STATE layer)
    provides: "AW.S.get/set persistence seam + the CR-01 unrecognized-schema fall-through the ringSeed accessor + W1 guard build on"
provides:
  - "AW.ringSeed() — a lazy, mint-once 32-bit maker's-mark seed stored in awba_state.ringSeed via AW.S (no schema bump, no defaultState churn)"
  - "AW.ringSVG(cfg) — a deterministic, seeded (mulberry32) SVG generator: same seed + progress ⇒ byte-identical hand-inked tawaf fingerprint; 15 jittered pilgrim-rows banded into 4 circuits, thermal ink-by-state (navy→ember→cream→gold), a 4-arc gold thread that closes at circuitsDone=4, and a static gold head-dot; reduced-motion-static; 265 path nodes at full progress; no <filter>"
  - "the ink-draw (Orbit draw verb) @keyframes + .ring wrapper in @layer motion (additive)"
  - "W1 memFallback persist-guard in the STATE seam: set() no longer clobbers an unrecognized-future-schema blob on disk"
  - "scripts/tests/ring.test.js — 8 node:test cases pinning determinism, seed-uniqueness, progression, reduced-motion static render, the ≤600-node/no-filter budget, and the W1 guard"
affects: [08 (icons share the black Orbit ground the ring renders on), 11 (preview.html injects AW.ringSVG output + wires the progressive-inking demo), 12 (the human §9 visual gate judges the ring reads as a hand-inked tawaf)]

# Tech tracking
tech-stack:
  added: []
  patterns: [seed-only-entropy deterministic generator (geometry drawn from mulberry32 in a fixed order, progress-independent; colour/animation applied after), fixed-decimal coordinate formatting (Math.round(x*100)/100 .toString) for byte-stable SVG strings, lazy accessor over schema-bump for a per-learner persisted value, draw-verb applied only to the in-progress frontier row so the established ring never re-draws, reduced-motion handled by omitting animation nodes at generation time (not CSS), persist-guard flag on an in-memory-fallback state]

key-files:
  created: [scripts/tests/ring.test.js, .planning/phases/03-components-icon-kit-motion-language/03-07-SUMMARY.md]
  modified: [shared/awba-engine.js, shared/awba-engine.css]

key-decisions:
  - "AW.ringSeed() is a lazy accessor, NOT a schemaVersion bump — deliberate per the plan's CONTRACT NOTE: adding a random field to defaultState() would rewrite legacy blobs on load and break the CR-01/WR-01 blob-survival tests. CURRENT stays 1, defaultState byte-unchanged."
  - "The W1 guard WAS implementable cleanly in ≤10 lines: a memFallback flag set by load()'s unrecognized-schema fall-through, consulted by set() to skip persist(). Implemented + proved with a new test. The state layer was NOT otherwise touched."
  - "Geometry is a pure function of seed and INDEPENDENT of progress; progress only recolours dabs and toggles the draw animation. This makes the ring a stable 'fingerprint' that inks in place, and guarantees the seed-difference test passes while determinism holds."
  - "The draw (ink-draw) animation attaches ONLY to the in-progress frontier row's ember dabs — the deterministic proxy for 'newly inked'. Completed (cream/gold) rows are static, so 'the existing ring never re-draws' (law 9 / §6.4) holds without a previous-state input."
  - "Course order inks outer-row → inner-row (circuit 0 = outermost). The tawaf inks from the outside in; the gold thread rides just outside the outermost row."
  - "Reduced motion is handled in the generator (omit stroke-dasharray + the ink-draw style) per §6.5's call-time gate, not via a CSS quieting rule — the SVG string itself carries no animation nodes under reduce."

patterns-established:
  - "Deterministic SVG: seed→mulberry32→fixed draw order + fixed-decimal formatting = byte-identical markup; determinism is unit-testable via string equality"
  - "Gated-literal hygiene held: no retired token names or gated font names authored into the new RING code or the ink-draw CSS comments; the @layer order line (:16) count stayed exactly 1 and the Gen-3 keyframes (fall/bob/breathe/glow/popIn) were left untouched for plan 09"

requirements-completed: [MOT-01]

# Metrics
duration: 17 min
completed: 2026-07-12
---

# Phase 3 Plan 07: Ring Generator Spike — the Tawaf Fingerprint Summary

**Built the SPOF: `AW.ringSVG(cfg)` in `shared/awba-engine.js` — a seeded (mulberry32) deterministic SVG generator that draws a hand-inked tawaf fingerprint (15 jittered concentric pilgrim-rows banded into 4 circuits of short round-capped 2–4-point dab-strokes, per-dab stroke-width [1.8,4.1] and opacity [0.45,0.95], ink-bleed by variance never a blur), thermally inked by progress (faint navy → warm ember in-progress → bright cream complete → sealed gold), closed by a 4-arc gold thread and marked by a single static gold head-dot; same seed + progress yields byte-identical markup (no `Date`/`Math.random` in the path), reduced motion returns the final state static, and full progress emits 265 `<path>` nodes with no `<filter>`. Paired with a lazy `AW.ringSeed()` maker's-mark accessor (no schema bump), a ≤10-line W1 persist-guard that stops `set()` clobbering an unrecognized-future-schema blob, and the `ink-draw` Orbit-draw keyframe + `.ring` wrapper added additively to `@layer motion`. Suite rose 37 → 45, fail 0.**

## Performance

- **Duration:** ~17 min
- **Started:** 2026-07-12T21:58:00Z
- **Completed:** 2026-07-12T22:15:19Z
- **Tasks:** 3 (+ the W1 guard test)
- **Files modified:** 3 (2 modified, 1 test created)

## Accomplishments
- `AW.ringSVG(cfg)` — the deterministic tawaf-fingerprint generator, visually validated at 0/20/40/65 progress and across two seeds (renders as an organic hand-inked ring, not a spirograph)
- `AW.ringSeed()` — the mint-once persisted maker's mark, with zero churn to the 37-test state baseline
- The `ink-draw` Orbit-draw keyframe + `.ring` wrapper, additive in `@layer motion` (Gen-3 keyframes and the immutable layer-order line untouched)
- The W1 gap closed: a `memFallback` guard so a from-the-future `awba_state` blob survives a `ringSeed()` write untouched on disk
- `scripts/tests/ring.test.js` — 8 tests; full suite 45 pass / 0 fail

## Task Commits

Each task was committed atomically:

1. **Task 1: AW.ringSeed() lazy accessor + W1 memFallback persist-guard** - `c943437` (feat)
2. **Task 2: AW.ringSVG deterministic generator + ink-draw keyframe** - `63e64c3` (feat)
3. **Task 3: ring.test.js — determinism/seed/progression/reduced-motion/budget** - `e219c90` (test)
4. **W1 guard proving test (future-schema blob survives ringSeed())** - `c6eab7a` (test)

**Plan metadata:** _(this SUMMARY + STATE + ROADMAP, final commit)_

_Note: this plan is tdd-typed at the task level; Tasks 1 & 2's determinism/behaviour were proven by the inline `node -e` verify one-liners the plan specifies, with the formal `node:test` file landing as Task 3 (the plan's chosen shape)._

## Files Created/Modified
- `shared/awba-engine.js` - New RING section (above the RUNNERS banner): `AW.ringSeed()`, inline `mulberry32`, `AW.ringSVG(cfg)`. Plus the STATE-seam W1 guard (`memFallback` flag, set() skips persist on the unrecognized-schema fallback).
- `shared/awba-engine.css` - `@keyframes ink-draw` + `.ring` wrapper added inside `@layer motion` (additive; Gen-3 keyframes untouched).
- `scripts/tests/ring.test.js` - 8 node:test cases (determinism, seed-difference, progression + closed thread, reduced-motion static, node budget / no filter, no-seed stability, W1 guard).

## Decisions Made
See `key-decisions` in frontmatter. Headline: the lazy-accessor-over-schema-bump contract (kept CR-01/WR-01 green), seed-only geometry with progress-driven colour, draw-only-on-frontier for law 9, and the ≤10-line W1 guard (implemented cleanly, so implemented + tested rather than deferred).

## Deviations from Plan

### Auto-added / auto-fixed

**1. [Rule 2 - Missing Critical, invited by the plan] W1 memFallback persist-guard**
- **Found during:** Task 1 (AW.ringSeed accessor)
- **Issue:** `AW.S.set()` persisted unconditionally, so `ringSeed()`'s first lazy write could clobber an unrecognized-future-schema blob that `load()` deliberately declined to persist (the CR-01 protection).
- **Fix:** Added a `memFallback` flag set by `load()`'s unrecognized-schema fall-through and consulted by `set()` to skip `persist()` — 6 lines net, entirely inside the STATE seam. Added a proving test.
- **Files modified:** shared/awba-engine.js, scripts/tests/ring.test.js
- **Verification:** New test seeds a `schemaVersion:2` blob, calls `ringSeed()`, asserts the on-disk blob is byte-untouched and the seed is stable in-session. Full suite 45/0.
- **Committed in:** c943437 (guard) + c6eab7a (proving test)

**2. [Housekeeping] Stale line references in the plan's `<interfaces>`**
- The plan cited `@layer motion (:742-810)` and the CSS insertion points by pre-03-06 line numbers; 03-06's rewrite shifted them. Resolved by locating `@layer motion` (now :843) by content, not line number. No behavioural impact.

---

**Total deviations:** 1 auto-added (the plan-invited W1 guard) + 1 housekeeping note.
**Impact on plan:** The W1 guard was explicitly sanctioned by the plan's KNOWN LIMITATION note and closes a real (if rare) data-loss footgun in ≤10 lines with its own test. No scope creep; the state layer was otherwise untouched, no schema bump, defaultState byte-unchanged.

## Issues Encountered
None blocking. The reduced-motion branch is exercised in tests by overriding `AW.reducedMotion` in the probe (the vm sandbox has no `window`/`document`, so the gate is false by default) — a clean, deterministic way to prove both branches.

## SPOF self-assessment (owner-visual, §6.6 #5)

This is the named single point of failure, judged on visual output. I rasterised the generated SVG (via `qlmanage`) on the black Orbit ground at several states and inspected the pixels:

- **atomsDone 0** — concentric jittered rows of faint navy dabs, an open centre, and a single gold head-dot. Reads as an un-inked, hand-drawn ring — organic, not mechanical.
- **atomsDone 40 / circuitsDone 2** — outer rows sealed gold, an ember (warm) in-progress band, faint navy inner rows still to come, the gold thread sweeping the completed half. Clear thermal progression.
- **atomsDone 65 / circuitsDone 4** — every dab gold, the outer thread closed into a full ring, head-dot at the frontier. Reads as a finished maker's-mark poster.
- **seed 1 vs seed 2 at the same progress** — visibly different fingerprints (row jitter, arc openings, gaps, head position all differ). No two learners would share a ring.

**Verdict:** it READS as a hand-inked tawaf fingerprint, not a geometric spirograph — the short broken dab-strokes, per-dab stroke/opacity variance, round caps, radial wobble and broken arcs carry a genuinely hand-drawn feel. The determinism that makes it trustworthy is unit-pinned (byte-equality).

**Doubts for the orchestrator to weigh before the preview wave (11) and the human gate (12):**
1. **The gold thread is a clean geometric arc** (per §6.3 "the earned thread"), which deliberately contrasts the hand-inked dabs. On a large render this could read slightly machine-clean against the organic rows — worth an owner eyeball; a touch of seeded jitter on the thread is a trivial follow-up if wanted.
2. **The ember (#E8502A) frontier dabs are the boldest colour note** and pop hard against navy/gold. Intentional ("warming"), but at the preview scale confirm it doesn't read as an error/alert red rather than "in progress."
3. **Inking direction is outer-row → inner-row.** Defensible (inks from the outside in) but is a design choice the owner may have an opinion on.
4. **The draw animation was verified structurally (nodes present/absent), not motion-tested in a browser** — the preview wave (11) is where the actual `ink-draw` sweep + the "only the frontier draws" behaviour should be watched live.

## Next Phase Readiness
- The SPOF is de-risked early and testably: deterministic per seed, hand-inked read confirmed on pixels, reduced-motion static, within the perf budget.
- Ready for plan 08 (icons on the same ground), plan 11 (preview injects `AW.ringSVG` + wires progressive inking), and the plan 12 human visual gate.
- No blockers. Working tree clean, 45/0.

## Self-Check: PASSED

---
*Phase: 03-components-icon-kit-motion-language*
*Completed: 2026-07-12*
