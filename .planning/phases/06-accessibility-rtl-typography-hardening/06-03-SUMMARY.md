---
phase: 06-accessibility-rtl-typography-hardening
plan: 03
subsystem: testing
tags: [wcag, contrast, a11y, headless-chrome, computed-style, permanent-gate]

requires:
  - phase: 06-accessibility-rtl-typography-hardening (06-01, 06-02)
    provides: the render-smoke/rtl-audit harness precedent (throwaway-copy + injected-driver +
      --dump-dom + JSON result block pattern), the learn-dom-flows seed/click driver verbs, the
      rewritten glyph gate + typo-stress fixture
provides:
  - scripts/tests/contrast-audit.mjs — the permanent ACC-03 computed-style WCAG contrast +
    non-text-UI-boundary sweep over all 20 rendered pages, joining the full-suite exit-code gates
  - one shared relativeLuminance/contrastRatio function + one effectiveBackground(el)
    ancestor-compositing resolver (register-ground fallback read live off CSS custom properties)
  - the full interaction-state forcing table (seeded done/stars/chests, popup variants, Festival,
    per-lesson generic walker incl. depth-lens expand + pre-check selection snapshot + wrong/
    correct resolution + full reward chain, review timer .low/timeout via virtual-time)
  - ONE real, confirmed, escalated contrast finding (`.ls-back` on the du'a-close Sky-night
    screen) — logged for 06-05/06-06, not fixed here (no product-source authority this plan)
affects: [06-05, 06-06, 06-07, phase-7-ship-gate]

tech-stack:
  added: []
  patterns:
    - "computed-style WCAG audit: throwaway-copy + injected driver + --dump-dom + JSON result
      block (the render-smoke/rtl-audit harness shape), never token-pairs-on-paper"
    - "effectiveBackground(el): ancestor-inclusive alpha-compositing walk; a register-ground
      ancestor is TERMINAL (never composited past into body/html, which may carry an unrelated
      opaque backgroundColor of its own) and resolves via the register class -> live CSS custom
      property, never a hardcoded hex"
    - "generic per-lesson walker: content-agnostic (.click() on whatever #cont/#check/.lens is
      currently present) drives ANY lesson beat-by-beat without hardcoding beat content"

key-files:
  created:
    - scripts/tests/contrast-audit.mjs
  modified: []

key-decisions:
  - "gold-as-shape-on-cream (~1.93:1, below the literal 3:1 SC 1.4.11 threshold) is a documented,
    non-gating CONTRAST NOTE, not a FAIL — the locked §2.1 design authority already cites this
    exact ratio as an accepted shape/border use (never text), and the shipped CSS itself compounds
    it with a --keyline edge + glyph everywhere it appears (.opt.correct, thermal mastered,
    .np-star.is-earned) — the audit computes+reports it but does not gate the exit code on it"
  - "the idle/default .opt/.tf/.tile border (--rule, a ~12%-alpha ink hairline) is excluded from
    the non-text 3:1 assertion — the engine CSS itself categorises it as a decorative 'jadwal
    hairline, card keyline, divider', identical on every unanswered option (never a differentiating
    state signal), and every .opt/.tf/.tile is already a native <button> identified by text+shadow
    +layout, not solely by its border"
  - "combo-3/flourish forcing is opportunistic, not deterministic — the generic walker always
    clicks the first quiz option (content-dependent correctness); both .opt.correct and .opt.wrong
    ARE guaranteed swept across the 15-lesson corpus, but 3-in-a-row is real-content-dependent"
  - "per the orchestrator's explicit directive, this plan carries NO product-source authority —
    the one real finding discovered by the forcing table (.ls-back on Sky-night) is reported, not
    fixed; contrast-audit.mjs currently exits 1 on the real, current shipped surface as an honest
    reflection of that finding"

patterns-established:
  - "register ground resolution: a small class -> CSS-custom-property-name map (reg-orbit ->
    --kiswah, reg-page/reg-festival -> --cream, reg-sky-night -> --lastthird, nightfall ->
    --nightfall), the live value always read off getComputedStyle(document.documentElement) at
    audit time — never a hardcoded hex anywhere in the compositor"

requirements-completed: [ACC-03]

duration: ~55min
completed: 2026-07-14
---

# Phase 6 Plan 3: Contrast Audit — WCAG Computed-Style Sweep + Forcing Table Summary

**Built `contrast-audit.mjs`, a permanent exit-code gate that walks computed styles (never token
pairs on paper) across all 20 rendered pages and every forceable interaction state, and it found
one real, pre-existing, narrow WCAG AA text-contrast failure the phase had not yet caught.**

## Performance

- **Duration:** ~55 min
- **Completed:** 2026-07-14T06:27:56+01:00
- **Tasks:** 2 completed
- **Files modified:** 1 created (`scripts/tests/contrast-audit.mjs`)

## Accomplishments

- One shared WCAG `relativeLuminance`/`contrastRatio` function (the stable WCAG 2.x sRGB
  definition), encoded exactly once, used by every page's injected driver.
- One `effectiveBackground(el)` ancestor-compositing resolver (srgb "over" operator) that correctly
  handles a gradient-painted register ground (`.reg-sky-night`, whose colour lives entirely in
  `background-image`, invisible to `backgroundColor`) by treating the closest register-ground
  ancestor as authoritative/terminal and resolving it via the live CSS custom-property token —
  never a hardcoded hex, and never accidentally falling through to `<body>`'s own unrelated opaque
  background (a real bug this session caught and fixed before it could report false negatives).
- A TreeWalker text sweep (4.5:1 normal / 3:1 large, skipping `.aw-sr`/`aria-hidden`/hidden content)
  plus a curated non-text UI-boundary sweep (`.opt/.tf/.tile` correct border, thermal
  `[data-state]` shapes, `.np-seed.is-inked`, the review `.rv-timer.low` fill, a rolling
  `:focus-visible` ring sample) at 3:1.
- The full interaction-state forcing table: a pre-IIFE seed on learn.html (done/stars/gold-thread/
  review-rosette/chest-available, never touching real storage), popup variants per node
  state/kind, `__awbaClaimChest` + the Festival threshold surface; a generic, content-agnostic
  per-lesson walker that drives every real lesson beat-by-beat (depth-lens force-expand via the
  shipped `.open` class, a SELECTED-BUT-NOT-YET-CHECKED pre-`#check` snapshot on every quiz beat,
  the resolved correct/wrong state, and the full reward chain to the du'a-close terminal); a review
  driver that lets the real 14s timer expire once (virtual-time fast-forwarded) to reach the
  genuine `.low` bar + timeout mercy copy, then answers the rest quickly through circle-back/result.
- §2.1 ground-truth reproduction confirmed (gold-on-Kiswah ~8.40:1 via the focus-ring sweep,
  ember-on-Kiswah ~5.05:1 via the thermal-progress border and the review timer fill) and the
  banned-cell check confirmed (no shipped text node lands in any of the four §2.1-banned cells).
- **Coverage (full forced sweep):** 20 pages, 2972 text pairings, 2568 non-text UI boundary
  pairings, 305 distinct forced states swept.
- Suite health held throughout: `node --test` 154 tests (fail 0), `render-smoke.mjs` exit 0,
  `rtl-audit.mjs` exit 0, `check-glyph-coverage.py` exit 0 (84/84 codepoints), `port-audit.mjs`
  exit 0, `localStorage` count 13, `@layer` order line count 1 — zero product source touched.

## Task Commits

1. **Task 1: contrast-audit.mjs — the WCAG computed-style sweep + shared luminance fn +
   effective-bg compositor** — `30967a7` (feat) — static-state sweep over all 20 pages, exit 0.
2. **Task 2: the state-forcing table — drive every interaction-only state + prove no banned cell,
   fix stragglers token-only** — `77d8f97` (feat) — full forcing table; exit 1 due to the one real
   finding below (documented in the commit body and here — no token-only fix applied per this
   plan's scope).

_No plan-metadata commit yet — pending this SUMMARY + STATE/ROADMAP update, committed separately
per the standard docs commit._

## Files Created/Modified

- `scripts/tests/contrast-audit.mjs` — the permanent ACC-03 exit-code gate (713 lines): the shared
  WCAG math, the ancestor-compositing background resolver, the text + non-text sweeps, the
  per-page-type forcing drivers (learn/lesson/review), and the ground-truth/banned-cell
  confirmation.

## Decisions Made

- **Gold-as-shape-on-cream is a documented NOTE, not a gating FAIL.** §2.1 (the locked design
  authority) explicitly cites "gold-on-cream 1.93:1 (never text)" as an accepted value, and the
  shipped CSS uses this exact token as a shape fill/border everywhere (`.opt.correct`, thermal
  `mastered`, `.np-star.is-earned`), always compounded with a `--keyline` edge. The audit computes
  and prints every such pairing as `CONTRAST NOTE` (visible, not hidden) but does not fail the exit
  code on it — flagged here explicitly for the 06-07 gate reviewer, since it is a genuine WCAG
  1.4.11 interpretation call, not a silent pass.
- **The idle `.opt/.tf/.tile` border (`--rule`, ~12% ink) is excluded from the 3:1 assertion.** The
  engine CSS's own comment categorises it as a decorative "jadwal hairline, card keyline, divider"
  — identical on every unanswered option, never a differentiating state signal, and every
  `.opt/.tf/.tile` is already identifiable as a control via native `<button>` semantics + text +
  shadow, not solely via this border.
- **No product-source changes in this plan**, per the orchestrator's explicit directive for this
  execution. The plan's own frontmatter (`files_modified: [scripts/tests/contrast-audit.mjs]`)
  supports this: only the audit script is in scope. The one real finding below is reported, not
  fixed.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed a false-negative in `effectiveBackground`'s register-ground fallback**
- **Found during:** Task 2, first full run of the forcing table (the du'a-close screen sweep)
- **Issue:** The ancestor-compositing walk terminated at `<body>`'s own opaque cream
  `background-color` (a global page-level default) before ever reaching the register-ground
  fallback, because `.reg-sky-night`'s gradient ground carries no `backgroundColor` of its own
  (only `background-image`). This silently misreported every Sky-night-ground text/UI pairing as
  "on cream" instead of "on Last Third" — a false pass/fail risk that could have hidden the real
  finding below (or wrongly flagged unrelated Sky-night text as failing against the wrong ground).
- **Fix:** Reaching a register-ground-class ancestor during the walk is now TERMINAL: its own
  (possibly transparent, gradient-painted) `backgroundColor` is composited onto the resolved live
  token value and the walk stops there, never continuing past it to `<body>`/`<html>`.
- **Files modified:** `scripts/tests/contrast-audit.mjs` (part of the same Task 2 build, not a
  separate commit — caught and fixed during iterative testing before the Task 2 commit landed)
- **Verification:** Re-ran the full forced sweep; the du'a-close screen's background now correctly
  resolves to `rgba(37,29,70,1)` (`--lastthird` / `#251D46`), matching the live CSS token exactly.
- **Committed in:** `77d8f97` (part of the Task 2 commit — this was a build-time bug in the audit
  itself, fixed before the commit, not a separate deviation commit)

---

**Total deviations:** 1 auto-fixed (audit-script bug, Rule 1). **Impact on plan:** necessary for
audit correctness; no scope creep; zero product-source touched.

## Real Contrast Finding (escalated, not fixed — routes to 06-05/06-06)

**`.ls-back` ("Back to the path") on the du'a-close Sky-night terminal screen — WCAG AA text
failure, ~1.2:1 (needs 4.5:1).**

- **Where:** `shared/awba-engine.css` — `.ls-back { color: var(--ink-62); ... }` (css:1054-1061,
  comment reads "§2.1 --ink-62 on cream — a quiet return, not a second CTA"). Triggered from
  `shared/awba-engine.js` `duaClose()` (js:2172-2192), which renders
  `<a class="ls-back" href="../learn.html">Back to the path</a>` on the `reg-sky-night` (Last
  Third) register with no dark-ground override.
- **Why it's real:** `.ls-back` is shared between two very different contexts — the mid-lesson
  "Back a step" button (always on the Page/cream ground, where `ink-62` is 5.02:1, fine) and this
  ONE `<a>` on the terminal du'a-close screen (Sky-night/dark ground), where the SAME dark ink on a
  dark background computes to ~1.2:1. No register-scoped override exists for `.ls-back` anywhere in
  the stylesheet (confirmed by grep — only the two rules at css:1054/1064 exist).
- **Reproducibility:** found identically on all 15 lesson pages (every lesson reaches this same
  shared `duaClose()` screen), 30 occurrences total (each lesson swept twice — once as
  `lesson-step-N` immediately on arrival, once again as `lesson-terminal-N+1` on the next loop
  iteration, both the same DOM state).
- **Suggested fix (token-only, zero new hex, not applied here):** add
  `.reg-sky-night .ls-back, .nightfall .ls-back { color: var(--paper-62); }` — `--paper-62` is the
  EXISTING dark-ground secondary-ink token already used for the identical purpose elsewhere
  (`.rv-shell .ls-count { color: var(--paper-62); }`, css:1555, cited "Orbit-sanctioned secondary
  (§2.1 Orbit table)"). This is a one-line, narrow, already-precedented fix.
- **Coverage note:** this is the ONLY finding. Every other one of 2972 text pairings and 2568
  non-text UI boundary pairings across 305 forced states, on all 20 pages, passes.

## Known Stubs

None — this plan builds a testing/verification script, not application UI; there is no data-source
stub concern.

## Threat Flags

None — the audit only reads the repo and writes throwaway `file://` probes (removed in `finally`);
no new network endpoint, auth path, or schema surface is introduced.

## Issues Encountered

Extensive design work was needed to correctly interpret two ambiguous non-text-contrast scope
questions (the idle `.opt/.tf/.tile` keyline, and gold-as-shape-on-cream) before the audit's
pass/fail boundary was defensible — both resolved by citing the shipped CSS's own comments and the
locked §2.1 table as evidence, documented in the audit file's header rather than silently decided.
See "Real Contrast Finding" above for the one item that could not be resolved this way (a genuine
defect, not an interpretation question).

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- `contrast-audit.mjs` is built, correct, and ready to join the full-suite command as a permanent
  gate. It currently exits 1 on the real shipped surface due to the one `.ls-back` finding above.
- **Blocker for a clean 06-07 gate:** either 06-05/06-06 applies the one-line `--paper-62` fix
  above (after which the audit is expected to exit 0 — every other pairing already passes), or the
  06-07 gate explicitly accepts this as a known, logged exception before Phase 6 closes.
- **For the 06-07 gate reviewer specifically:** the gold-as-shape-on-cream NOTE-vs-FAIL
  classification (see Decisions Made) is a judgment call worth a second look — it is grounded in
  the locked §2.1 table + the shipped CSS's own keyline precedent, but it is an interpretation, not
  a certainty.
- 06-05 (adding the new 2→3px quiz-selection border) can safely re-run this audit afterward: the
  pre-check selection state is already snapshotted per quiz beat on every lesson/review page, so
  the new cue will be genuinely re-swept without any audit changes.

---
*Phase: 06-accessibility-rtl-typography-hardening*
*Completed: 2026-07-14*

## Self-Check: PASSED

- FOUND: `scripts/tests/contrast-audit.mjs` (713 lines)
- FOUND commit: `30967a7`
- FOUND commit: `77d8f97`
