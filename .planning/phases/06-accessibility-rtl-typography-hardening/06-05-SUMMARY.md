---
phase: 06-accessibility-rtl-typography-hardening
plan: 05
subsystem: ui
tags: [accessibility, aria-live, aria-pressed, screen-reader, focus-management, wcag, runner, awba-engine]

# Dependency graph
requires:
  - phase: 06-01
    provides: a11y probe harnesses (a11y-announce/a11y-keyboard permanent suite members with todo-gated contract assertions)
  - phase: 06-04
    provides: AW.announce body-level polite region + [tabindex="-1"]:focus-visible suppression + register :focus-visible grammar
provides:
  - AwbaLesson composed resolve announce (correct/miss) + reflect announce, reusing the shipped praise word + AW.PER_LESSON/AW.REFLECT
  - Reward focus-to-heading on all six lesson-reward screens (verdict/noor/returns/done/ring/dua)
  - AwbaReview composed answer announce + a single-fire 10s warning + timeout mercy narration + "Question N of M" auto-skip/circle-back narration + result focus-and-stat
  - Non-colour quiz selection cue in BOTH runners (aria-pressed + a 2→3px held paper-press) closing the WCAG 1.4.1 hue-only gap
  - Real disabled attributes on resolved/parked options and the class-only Check (dead controls leave the tab order — Pitfall 4)
  - AW.announce now writes synchronously (immediate last-write-wins) so an in-place event's line is inspectable in the same task
affects: [06-06 learn.html a11y, 06-07 two-stage gate + human keyboard/VoiceOver walk]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "R-10 focus-vs-announce split: focus() for screen changes (tabindex=-1 headings), announce() for in-place events; a focused heading is never also announced"
    - "One composed AW.announce per resolve/answer built from shipped copy + shipped numbers via textContent (no injection, no per-frame flood)"
    - "Non-colour selection cue = aria-pressed (SR/colourblind channel) + a 2→3px border weight (paint-only under box-sizing:border-box → no reflow) + the shipped paper-press held static (translateY(1px), no new keyframe)"
    - "Real disabled attributes (not just pointer-events/class) so dead controls leave the keyboard tab order"

key-files:
  created: []
  modified:
    - shared/awba-engine.js
    - scripts/tests/a11y-announce.test.js
    - scripts/tests/a11y-keyboard.test.js

key-decisions:
  - "Made AW.announce synchronous (immediate last-write-wins) — the shipped 150ms trailing debounce could not satisfy the 06-01 synchronous-read contract this plan flips green (Rule 3 blocking; no test depended on the timing; the runners announce once per event so no flooding)"
  - "Reward focus targets: verdict/noor/done focus .rw-word; noor deliberately focuses the STATIC heading, not .noorbig (the countUp numeral must never be read); returns focuses .num (first content); ring focuses .rcap; dua focuses ONLY the reverent close line, never the Arabic scripture"
  - "result() follows the plan spec literally — focuses .rv-title AND announces the stat beginning with the same verdict word (a mild, spec-directed double-speak on the terminal screen; flagged for the 06-07 gate)"
  - "The .tile builder already carries a non-colour cue (placed token repositions + bank dims to .35); the 3px/held-press + aria-pressed is applied to each placed token for spec-completeness, but ACC-03's hue-only gap is genuinely an .opt/.tf concern"
  - "Extended real-disabled to the review timeout-parked options too (dead controls leave the tab order — Pitfall 4 consistency beyond the plan's stated 'resolved options')"

patterns-established:
  - "Pattern: register-scoped selection recolour stays shipped (--crimson on Page, --gold on Orbit) while the non-colour channel (aria-pressed + width + press) is added inline in JS — no CSS layer touched"

requirements-completed: [ACC-01, ACC-02, ACC-03]

# Metrics
duration: ~55 min
completed: 2026-07-14
---

# Phase 6 Plan 5: Runner A11y — Composed Announce, Focus-to-Heading & Non-Colour Selection Summary

**The lesson + timed-review runners now speak one calm line per verdict/noor/screen-change, land focus where each new screen begins, single-fire a soft 10s warning + a merciful timeout narration, and make each answer felt without colour (aria-pressed + a pushed-in, thicker paper-press) — every number and timer byte-preserved.**

## Performance

- **Duration:** ~55 min
- **Started:** 2026-07-14T11:12Z
- **Completed:** 2026-07-14T12:07Z
- **Tasks:** 3 (all TDD RED→GREEN)
- **Files modified:** 3

## Accomplishments

- **ACC-02 (lesson):** `resolve()` fires exactly ONE composed announce per answer — correct = the SAME praise word the foot shows + `+12 noor` with the combo/3-streak folded in; miss = `Nothing lost. {gentle}` — reusing `AW.PER_LESSON`, never wired onto the visible `#lsfoot` (Pitfall 9). The reflect reveal announces `+15 noor — a reflection` (AW.REFLECT verbatim). All six reward screens (verdict/noor/returns/done/ring/dua) move focus to their heading after the `innerHTML` swap (never double-announced; the noor screen focuses the static heading, not the animating countUp numeral).
- **ACC-02 (review):** `bind()` announces the composed verdict + swift-noor line (`Swift and sound. +20 noor`, reusing `AW.reviewScore`); the 100ms tick single-fires `10 seconds` at `tleft === 100` (monotonic) and is otherwise never announced; `timeUp()` narrates the mercy line; `renderQ()` narrates `Question N of M` on every swap (auto-skip / circle-back / first); `result()` focuses `.rv-title` and announces the stat once. `AW.QTIME=14`, the 100ms tick, and the 1500ms auto-skip are byte-preserved.
- **ACC-03/ACC-01 (both runners):** the quiz selection gained a non-colour channel — `aria-pressed="true"` (cleared on re-selection) + a 2→3px border weight on the held paper-press ("pushed in and thicker", static, zero reflow, zero new hex). Resolved/parked options + the placed tile tokens + the class-only Check now carry a real `disabled` attribute, so dead controls leave the tab order (Pitfall 4).
- Flipped the a11y-announce composed/reflect/reward-focus (T1, 4) + review answer/10s/timeout/Question/result (T2, 5) and the a11y-keyboard selection assertion (T3, 1) from `{ todo }` to GREEN — RED confirmed before each GREEN.

## Task Commits

Each task was committed atomically (TDD RED→GREEN, one commit per task):

1. **Task 1: AwbaLesson composed announce + reflect + reward focus-to-heading** — `3842beb` (feat)
2. **Task 2: AwbaReview announce + 10s single-fire + timeout narration + result focus** — `1878103` (feat)
3. **Task 3: non-colour selection cue (aria-pressed + 3px press) + real disabled states** — `0446c3f` (feat)

**Plan metadata:** _this SUMMARY commit_ (docs: complete plan)

## Files Created/Modified

- `shared/awba-engine.js` — AW.announce made synchronous; AwbaLesson resolve/reflect announce + reward focus-to-heading (focusHeading helper); AwbaReview answer announce + 10s single-fire + timeUp/renderQ narration + result focus; non-colour selection cue (aria-pressed + 3px + held press) + real disabled states in both runners.
- `scripts/tests/a11y-announce.test.js` — un-todo the 4 lesson-side (T1) then the 5 review-side (T2) ACC-02 assertions → residue 0.
- `scripts/tests/a11y-keyboard.test.js` — un-todo the aria-pressed selection assertion (T3) → residue 3.

## Emil design-eng review — the "pushed in and thicker" selection cue

| Before | After | Why |
| --- | --- | --- |
| selection = border recolour only (`borderColor: var(--crimson/gold)`) — a hue-only signal (WCAG 1.4.1) | + `aria-pressed="true"` + `border-width: 3px` + held `translateY(1px)` | Adds a non-colour channel a SR and a colourblind eye can read; reads as a genuine "selected" state, not just a tint |
| a 1px border-width bump risks internal reflow | `box-sizing: border-box` keeps the outer box identical → no layout shift of the option or its neighbours | "Static, no reflow" (law 9) — only the paint changes, siblings never move |
| a new keyframe for a "press" would restart-from-zero and add motion vocabulary | reuse the SHIPPED paper-press (`translateY(1px)`) held static, riding the existing `--dur-press` (140ms) transition | Coherence over per-element flourish; interruptible transition, not a keyframe; zero new hex, zero new motion |

## Decisions Made

See `key-decisions` in the frontmatter. In brief: AW.announce was made synchronous to satisfy the synchronous-read probe contract; reward focus targets were chosen to avoid the countUp numeral and never focus scripture; the review `result()` follows the plan's explicit "verdict + count + noor" announce even though it lightly overlaps the focused heading; the `.tile` builder's non-colour cue is spec-completed but ACC-03's real gap is `.opt/.tf`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Made `AW.announce` write synchronously**
- **Found during:** Task 1 (the composed-announce content assertions)
- **Issue:** The 06-04 `AW.announce` used a 150ms trailing debounce that never set `textContent` synchronously (empirically proven: an immediate read and a 0ms-later read both returned `""`; only a 200ms-later read flushed). The 06-01 a11y-announce lesson/review-answered drivers read the region SYNCHRONOUSLY right after `.click()`, so the composed/miss/reflect/answer/result-stat content assertions this plan must flip GREEN could not pass with a debounced write. The review-timeout assertions (async 200ms poll) worked either way.
- **Fix:** Rewrote `AW.announce` to write `textContent` synchronously (immediate last-write-wins), preserving the identical-repeat re-announce (clear-then-set-in-rAF) and dropping the trailing 150ms timer. Confirmed no test depends on the timing; the runners announce exactly once per resolve/answer so there is no burst to batch (T-06-05b anti-flood preserved). The change lives in `shared/awba-engine.js`, the plan's declared modified file.
- **Files modified:** shared/awba-engine.js
- **Verification:** a11y-announce content assertions flip RED→GREEN; full suite fail 0; no gate regressed.
- **Committed in:** 3842beb (Task 1 commit)

**2. [Rule 2 - Missing critical a11y] Real `disabled` on the review timeout-parked options**
- **Found during:** Task 3 (real-disabled states)
- **Issue:** The plan's stated action covered "resolved options" (post-Check) getting a real `disabled`. The review `timeUp()` path parks a question and disables its options via `pointer-events:none` only — those dead controls stayed in the keyboard tab order (Pitfall 4), inconsistent with the plan's own done-criterion "dead controls leave the keyboard's path".
- **Fix:** Added `x.disabled = true` (and cleared the held-press inline styles) in the `timeUp()` option-disable loop.
- **Files modified:** shared/awba-engine.js
- **Verification:** full suite fail 0; render-smoke green; keyboard residue held at 3.
- **Committed in:** 0446c3f (Task 3 commit)

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 missing-critical)
**Impact on plan:** Deviation 1 was necessary for the ACC-02 contract to go green and touches only the announce primitive's flush timing (no mechanics/number/timer, no new copy). Deviation 2 is a one-line consistency extension of the plan's own Pitfall-4 intent. No scope creep; mechanics byte-preserved throughout.

## Issues Encountered

- The full-suite `node --test` command must use the glob form (`scripts/tests/*.test.js`); the directory form throws MODULE_NOT_FOUND on Node v24.13.0 (as flagged). No other issues.
- The RED confirmation for Task 3 was taken after implementation by backing up the T3 engine, restoring the T2-committed engine via `git show HEAD:… > file` (read-only, no stash/blanket-reset), running the un-todo'd assertion RED (fail 1: `null !== 'true'`), then restoring the T3 engine for GREEN.

## Known Stubs

None — all changes wire real announce strings (built from shipped copy + shipped numbers), focus, aria-pressed, and disabled attributes. No placeholder/empty data flows to any UI.

## Doubts for the 06-07 human gate

1. **Result-screen double-speak (R-10 tension):** `result()` focuses `.rv-title` (VoiceOver reads e.g. "Legendary") AND the stat announce begins with the same verdict word ("Legendary. 6 of 6 named. +N noor gathered."). This follows the plan's explicit truth-3 ("verdict + N of M + noor") and the test comment ("composes the verdict word"), but overlaps truth-2's general no-double-speak rule. Judge on-device whether the terminal recap is welcome or the verdict word should be trimmed from the announce.
2. **AW.announce synchronous change:** verify live VoiceOver still announces cleanly with the immediate write (the 150ms coalescer's flood-protection was belt-and-suspenders; runners announce once per event).
3. **`.tile` builder cue:** each placed token now carries aria-pressed + the 3px/held-press for spec-completeness — confirm it reads well (or is visual noise) in the sequence builder, where the real non-colour signal is already the token's repositioning + the bank dimming to .35.
4. **Held-press feel:** the "pushed in" selection rides the shipped `--dur-press` (140ms) transition — an on-real-hardware feel check (Emil: review animations on device / next-day).
5. **Untested reward-focus targets:** only the verdict `.rw-word` and review `.rv-title` focus are automated-verified; the noor/returns/done/ring/dua focus landings (and the dua reverent-close-not-scripture target) are implemented but should get a VoiceOver walk in the gate.

## Threat Flags

None — the announce strings are built from shipped copy + shipped numbers written via `textContent` (no user input, no injection); real `disabled` attributes only remove dead controls from the tab order. No new network endpoints, auth paths, file access, or schema changes. All surface is covered by the plan's existing `<threat_model>`.

## Next Phase Readiness

- ACC-02 (lesson/review announcements) + ACC-01 (real disabled, keyboard-clean) + ACC-03 (non-colour selection) are live in both runners with mechanics byte-preserved.
- a11y-announce residue is now 0; a11y-keyboard residue is 3 (node state-in-name, native streak strip, native ayah affordance — all land in 06-06); a11y-dialogs residue held at 7.
- Ready for 06-06 (learn.html a11y). The 06-07 gate should run the doubts above through the human keyboard/VoiceOver walk.

## Self-Check: PASSED

- `06-05-SUMMARY.md` exists on disk.
- Task commits `3842beb`, `1878103`, `0446c3f` all present in the log.
- Full suite: tests 154 / pass 144 / fail 0 / todo 10; residue a11y-announce 0 / a11y-dialogs 7 / a11y-keyboard 3; localStorage 13; @layer line 1; contrast-audit exit 0 (22 OK / 0 FAIL); render-smoke 21 OK / 0 FAIL; rtl-audit exit 0; glyph gate exit 0.

---
*Phase: 06-accessibility-rtl-typography-hardening*
*Completed: 2026-07-14*
