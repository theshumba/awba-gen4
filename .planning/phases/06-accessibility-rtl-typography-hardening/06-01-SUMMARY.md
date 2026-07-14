---
phase: 06-accessibility-rtl-typography-hardening
plan: 01
subsystem: testing
tags: [node-test, headless-chrome, aria, accessibility, wcag, virtual-time-budget]

# Dependency graph
requires:
  - phase: 05-learn-page-cross-page-view-transitions
    provides: learn.html + the full lesson/review runner surface these probes drive
provides:
  - Three permanent node:test probe files (a11y-keyboard, a11y-dialogs, a11y-announce) pinning the shipped ACC-01/D-63 baseline as ACTIVE assertions and staging the ACC-01/D-63/ACC-02 gaps as exactly 24 todo-gated assertions (4 + 10 + 10)
  - The synthetic-cancelable-Tab + event.defaultPrevented technique for testing a not-yet-built focus-trap headlessly
  - The --virtual-time-budget polling pattern for capturing transient live-region state across a review's 14s timer + 1500ms auto-skip
affects: [06-04, 06-05, 06-06, 06-07]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "todo-gated contract staging: node:test's { todo: '...' } option lets a genuinely-failing assertion report as todo (not fail), so a permanent probe file can pin an unbuilt contract without breaking the suite; each downstream plan un-todos exactly its own assertions with a RED→GREEN flip"
    - "live-token focus-ring comparison: append a hidden reference element styled color:var(--token), read its computed color, and compare against the focused element's computed outlineColor — proves the register-aware ring resolves to the live CSS custom property, never a hardcoded hex"
    - "synthetic cancelable Tab as a trap-existence probe: dispatch a cancelable KeyboardEvent('keydown',{key:'Tab'}) at the overlay container and read event.defaultPrevented — a future AW._trapFocus listener attached to the overlay will intercept and preventDefault, flipping a currently-false probe true"
    - "virtual-time-budget polling: a 200ms setInterval logging {region,tnote} across an 18-20s --virtual-time-budget run captures transient live-region/timer state a single final --dump-dom would miss"

key-files:
  created:
    - scripts/tests/a11y-keyboard.test.js
    - scripts/tests/a11y-dialogs.test.js
    - scripts/tests/a11y-announce.test.js
  modified: []

key-decisions:
  - "The ACTIVE native-semantics sweep scopes to the shipped ✓ inventory rows only (.opt/.tf/.tile/.btn/.onode/.hstat/.tab/mute/course-chip/cc-go/ofest-close) — it deliberately excludes #streakStrip and #ayahHost, which are the two documented D-62 conversion gaps and are pinned separately as todo assertions, not folded into the active claim"
  - "u1-m1.html (the real first lesson) drives both the keyboard and announce probes rather than the scripts/fixtures/valid-lesson.html fixture — its 7-beat shape (read/depth/reflect/read/mc/panel/tf) reaches the mc quiz beat in 6 clicks and contains exactly one mc + one tf item, letting one real walk capture both a correct-answer sample and a miss sample"
  - "The Festival containment-wrap todo relies on event.defaultPrevented rather than activeElement-wrap-to-first, because Festival has only one focusable control (.ofest-close) — a self-loop is trivially true whether or not a real trap exists, so defaultPrevented is the only signal that actually distinguishes 'no trap' from 'a trap intercepted Tab'"
  - "The review-timeout probe answers nothing on question 1 and lets --virtual-time-budget=20000 fast-forward the real 14s AW.QTIME timer + the 1500ms auto-skip, polling every 200ms — this captures the 10s warning, the timeout mercy line, and the Question-2-of-6 narration in ONE Chrome run instead of three"

patterns-established:
  - "Pattern: a permanent a11y probe file pins today's shipped-correct baseline as real ACTIVE assertions in the SAME file as the not-yet-built contract (todo-gated) — the file is the executable spec for both what exists and what's coming, never a separate spec doc"
  - "Pattern: exact todo-count discipline — every todo test is authored as test('...', { todo: '...' }, ...) with { todo leading the options object and grep -c '{ todo' asserted to an exact integer in the plan's verify block; prose descriptions of the mechanism in header comments must avoid the literal substring '{ todo' (write 'todo-gated'/'the todo option' instead) to avoid inflating the count"

requirements-completed: []  # ACC-01/ACC-02 stay Pending in REQUIREMENTS.md — this Wave-0 plan authors the executable contract only; the behavior it tests does not yet exist (24 of the pinned assertions are todo). Requirements complete when 06-04/06-05/06-06 un-todo them to zero.

# Metrics
duration: ~55min
completed: 2026-07-14
---

# Phase 6 Plan 1: A11y Probe Harness (keyboard/dialogs/announce) Summary

**Three permanent node:test probe files pin the shipped ACC-01/D-63 baseline (native semantics, register-aware focus ring, overlay role/aria-modal/Escape/focus-restore) as real passing assertions while staging the entire not-yet-built ACC-01/D-63/ACC-02 gap surface as exactly 24 `{ todo }`-gated assertions, so the suite grows 114→154 (130 pass / 0 fail / 24 todo) without a single product-source edit.**

## Performance

- **Duration:** ~55 min
- **Completed:** 2026-07-14
- **Tasks:** 3 (all `type="auto"`, fully autonomous)
- **Files modified:** 3 created, 0 modified (zero product source touched)

## Accomplishments

- `scripts/tests/a11y-keyboard.test.js` — 8 ACTIVE assertions pin: native `<button>`/`<a>` markup across every shipped interactive emitter (engine `.opt`/`.tf`/`.tile`/`.btn`/mute + learn.html `.onode`/`.hstat`/`.tab`/course-chip/`cc-go`/Festival-close), zero positive tabindex app-wide, the already-shipped reflect `<label for="lsrt">`, register-aware `:focus-visible` resolving to the LIVE `--gold` token on Orbit and the LIVE `--crimson` token on Page (via a hidden reference-element comparison, never a hardcoded hex), and the `.onode` DOM order matching the canonical 23-node CNT-03 journey. 4 todo assertions stage node state-in-name, the native streak-strip conversion, the native ayah citation button (R-9), and the `aria-pressed` selection cue.
- `scripts/tests/a11y-dialogs.test.js` — 5 ACTIVE assertions pin: `AW.sheet` role=dialog/aria-modal/Escape-close/invoker-focus-restore, `.npop` role=dialog/singleton/Escape/outside-tap-close, the Festival overlay role=dialog/aria-modal/name/focus-on-open, and the claim-before-open ordering (an immediate Escape after `__awbaClaimChest` still grants exactly +25 noor). 10 todo assertions stage the three overlays' focus-containment (via a synthetic cancelable Tab + `event.defaultPrevented`), the sheet's accessible name, the popup's `aria-modal`/`aria-labelledby`/focus-move-on-open/focus-return, and the Festival's focus-return-after-render.
- `scripts/tests/a11y-announce.test.js` — the entire ACC-02 contract staged as 10 todo assertions (nothing announces anything today — 0 grep hits for `aria-live`/`role="status"`): the body-level region existing and surviving screen swaps, the composed correct/miss/reflect lesson announcements, the reward focus-to-heading rule, the review answer announcement, the 10s single-fire warning, the timeout mercy narration, the "Question N of M" auto-skip narration, and the result focus-and-stat announcement — driven against real `lessons/u1-m1.html` and `reviews/u1-review.html` via `.click()`, with `--virtual-time-budget=20000` fast-forwarding the real 14s soft timer for the timeout scenario.
- Full suite: 114 → 154 tests (130 pass, 0 fail, 24 todo — exactly matching the mandated 4+10+10 ledger the rest of Phase 6 depends on). All standing gates (`render-smoke.mjs`, `port-audit.mjs`, `validate-content.js`) still exit 0. `grep -c localStorage shared/awba-engine.js` unchanged at 13. Zero gated literals in any probe file. Zero product source files touched.

## Task Commits

1. **Task 1: a11y-keyboard.test.js** — `72f0879` (test)
2. **Task 2: a11y-dialogs.test.js** — `4d71489` (test)
3. **Task 3: a11y-announce.test.js** — `4802036` (test)

**Plan metadata:** (this commit) — `docs(06-01): complete a11y probe harness plan`

## Files Created/Modified

- `scripts/tests/a11y-keyboard.test.js` — ACC-01 keyboard/focus probe (8 active, 4 todo)
- `scripts/tests/a11y-dialogs.test.js` — D-63 overlay-contract probe (5 active, 10 todo)
- `scripts/tests/a11y-announce.test.js` — ACC-02 live-region driver (0 active harness-completion checks aside, 10 todo — every substantive assertion is todo)

## Decisions Made

See `key-decisions` in frontmatter. In summary: the native-semantics sweep deliberately excludes the two known D-62 conversion targets (streak strip, ayah card) rather than falsely claiming they pass today; u1-m1.html (not the fixture) drives both the keyboard and announce lesson probes because its exact beat shape yields both a correct and a miss sample in one real walk; the Festival containment todo uses `event.defaultPrevented` rather than activeElement-wrap because its single-focusable self-loop makes wrap-based detection vacuous; the review-timeout probe polls every 200ms across a single 20s virtual-time run rather than three separate runs.

## Deviations from Plan

None — plan executed exactly as written. Every `<action>` and `<verify>` block ran as specified; no product source was touched; the todo counts landed exactly at the mandated 4/10/10.

### Self-caught authoring bugs (fixed before commit, not deviations from plan intent)

While authoring the driver arrays (JS-string-array-of-lines, the `learn-dom-flows.test.js` idiom), several lines were drafted with a leftover `.replace()` artifact or a mismatched quote style that broke Node's `--check` syntax parse (e.g. a single-quoted line containing an unescaped internal single quote). These were caught immediately by `node --check` before any commit and corrected to the double-quoted-line convention used elsewhere in the same file. No behavior or contract change resulted — purely a JS-string-escaping correction during drafting, verified via `node --check` + a full test run before each commit.

**Total deviations:** 0
**Impact on plan:** None — plan executed exactly as written.

## Issues Encountered

The `grep -c '{ todo'` count initially over-reported (7 instead of 4) in `a11y-keyboard.test.js` because the file-header comment block used the literal substring `` `{ todo }` `` three times in prose describing the mechanism. Reworded the header to say "todo-gated"/"the todo option" instead of the literal bracketed token, bringing the count back to exactly 4. Applied the same discipline preemptively in the other two files (verified via `grep -c` before commit in each case) — no similar issue occurred in `a11y-dialogs.test.js` or `a11y-announce.test.js`.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- The executable ACC-01/D-63/ACC-02 contract is fully written and running (`fail 0`, `todo 24`) — 06-02 through 06-06 can now un-todo their exact assertions with RED→GREEN flips, per the residue ledger: 06-04 T1 → announce todo 10→9; 06-04 T2 → dialogs todo 10→7; 06-05 T1 → announce todo 9→5; 06-05 T2 → announce todo 5→0; 06-05 T3 → keyboard todo 4→3; 06-06 T1 → keyboard todo 3→0; 06-06 T2 → dialogs todo 7→2; 06-06 T3 → dialogs todo 2→0; 06-07 asserts the suite summary reports `todo 0`.
- No blockers. The three probe files are permanent suite members (D-68) that Phase 7's gate re-runs.

## Doubts for the 06-07 gate

- The `event.defaultPrevented`-based containment-wrap probes assert that a future `AW._trapFocus` implementation attaches its keydown listener directly to the overlay element and calls `preventDefault()` on the wrapping Tab. If 06-04/06-06 implement containment differently (e.g., a document-level listener, or a `focusin`-based re-steer instead of `preventDefault` on `keydown`), these todo assertions will need updating — flagging so the un-todoing task can adjust the read, not just the outcome, if the implementation shape differs from what 06-RESEARCH describes.
- The `a11y-announce.test.js` "correct/miss/review-answer" assertions hardcode the exact composed strings from 06-UI-SPEC's Copywriting Contract table (e.g. `"Swift and sound. +20 noor"`, the `PRAISE` regex). If the implementing plan's micro-wording discretion (D-64) lands slightly differently within the calm-voice law, these exact-match assertions may need a wording tweak even though the underlying mechanism is correct — worth a quick diff-read at 06-05.
- The reward/result focus-to-heading todo assertions check `document.activeElement === <heading>` at a single checkpoint per screen (verdict for the lesson, result for the review) rather than at every one of the six reward moments — sufficient to prove the mechanism lands, but the 06-05/06-06 gate walk should still eyeball the other four moments (noor/returns/done/ring) since they share the same fix but aren't individually pinned here.

## Self-Check: PASSED

- FOUND: scripts/tests/a11y-keyboard.test.js
- FOUND: scripts/tests/a11y-dialogs.test.js
- FOUND: scripts/tests/a11y-announce.test.js
- FOUND: commit 72f0879
- FOUND: commit 4d71489
- FOUND: commit 4802036

---
*Phase: 06-accessibility-rtl-typography-hardening*
*Completed: 2026-07-14*
