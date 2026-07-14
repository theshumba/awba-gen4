---
phase: 06-accessibility-rtl-typography-hardening
plan: 04
subsystem: a11y
tags: [aria-live, focus-trap, aria-modal, wcag, engine-primitives]

# Dependency graph
requires:
  - phase: 06-01
    provides: "the a11y-announce.test.js and a11y-dialogs.test.js probe harnesses (todo-staged ACC-02/D-63 contracts) this plan flips to GREEN"
provides:
  - "AW.announce(text) — the one body-level polite live region, lazy + DOMContentLoaded ensured, 150ms coalesced, textContent-only"
  - "AW._trapFocus(overlayEl) — the one shared Tab-cycle focus-containment helper for all overlay families"
  - "AW.sheet(html, label) — backwards-compatible accessible name + focus-into-.sheet-x + trap application"
  - ".aw-sr visually-hidden utility in @layer base"
  - "the register :focus-visible grammar verified/unified + the one sanctioned [tabindex=-1] suppression"
affects: ["06-05", "06-06", "06-07"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "DOM-thin engine primitive pattern: lazy-ensure + DOMContentLoaded ensure (mirrors the shipped applySky/readyState==='loading' precedent) so a body-direct-child region survives every runner innerHTML wipe"
    - "Shared keydown-on-overlay focus-trap helper returning an untrap() disposer, reused by all three overlay families"

key-files:
  created: []
  modified:
    - shared/awba-engine.js
    - shared/awba-engine.css
    - scripts/tests/a11y-announce.test.js
    - scripts/tests/a11y-dialogs.test.js

key-decisions:
  - "AW.announce is defined inside the existing typeof-document-guarded boot-stamp block (not top-level like AW.reducedMotion) — it is a DOM-thin primitive with no purpose without a document, and the plan explicitly designates the boot-stamp block as its home"
  - "Fixed the pre-existing .ls-back WCAG AA contrast failure on reg-sky-night (flagged but deliberately not fixed by 06-03) because it directly blocked this plan's own Task 3 contrast-audit verify gate — applied the exact token-only fix 06-03 already specified (--paper-62), so no new judgment call was made"

requirements-completed: [ACC-01, ACC-02]

# Metrics
duration: ~25min
completed: 2026-07-14
---

# Phase 6 Plan 04: Engine A11y Primitives — announce, focus-trap, sheet name Summary

**AW.announce (one body-level polite live region), AW._trapFocus (shared Tab-cycle containment), and AW.sheet(html,label) accessible-name + focus-into + trap — built interface-first in shared/awba-engine.js for 06-05/06-06 to wire, plus the register :focus-visible grammar verified/unified with the one sanctioned focus-landing suppression.**

## Performance

- **Duration:** ~25 min
- **Started:** 2026-07-14T10:55:00Z (approx)
- **Completed:** 2026-07-14T11:17:00Z
- **Tasks:** 3
- **Files modified:** 4 (shared/awba-engine.js, shared/awba-engine.css, scripts/tests/a11y-announce.test.js, scripts/tests/a11y-dialogs.test.js)

## Accomplishments
- `AW.announce(text)` — lazy-ensured + DOMContentLoaded-ensured `.aw-sr role="status"` region as a direct child of `document.body`, textContent-only, 150ms trailing coalescer, clear-then-set-in-rAF for repeat strings
- `AW._trapFocus(overlayEl)` — the one shared Tab-cycle containment helper (verbatim focusable selector + `getClientRects()` filter, first↔last wrap), returning an `untrap()` disposer
- `AW.sheet(html, label)` — backwards-compatible accessible name (default `"Details"`), focus moves into `.sheet-x` and the trap attaches on open, trap disposes then the shipped invoker-restore fires on close; `sheetRef`/`sheetTerm` now pass `r.ref`/`t.word` as natural labels
- Verified the shipped register `:focus-visible` grammar already covers all five registers per the S1 palette table (no gap, no new ring added) and added the one sanctioned `[tabindex="-1"]:focus-visible { outline: none }` suppression
- Flipped the a11y-announce region-exists assertion and the three a11y-dialogs sheet-contract assertions from `{ todo }` to GREEN (RED confirmed first in both cases)

## Task Commits

Each task was committed atomically:

1. **Task 1: AW.announce + the .aw-sr region — un-todo a11y-announce region-exists (RED→GREEN)** - `5b0ecdb` (feat)
2. **Task 2: AW._trapFocus + AW.sheet(html,label) name + focus-into — un-todo a11y-dialogs sheet contract (RED→GREEN)** - `5d784d4` (feat)
3. **Task 3: verify + unify the register :focus-visible grammar + the focus-landing suppression** - `e49ef0a` (chore)

_No plan-metadata commit was made — per explicit executor instructions for this run, STATE.md/ROADMAP.md are hand-edited by the orchestrator and were not touched._

## Files Created/Modified
- `shared/awba-engine.js` - `AW.announce` (boot-stamp block), `AW._trapFocus`, extended `AW.sheet(html, label)`, `sheetRef`/`sheetTerm` label pass
- `shared/awba-engine.css` - `.aw-sr` utility in `@layer base`, the `[tabindex="-1"]:focus-visible` suppression, the `.reg-sky-night .ls-back`/`.nightfall .ls-back` contrast fix
- `scripts/tests/a11y-announce.test.js` - un-todo the region-exists assertion (residue now 9)
- `scripts/tests/a11y-dialogs.test.js` - un-todo the sheet containment-wrap/focus-into/accessible-name assertions (residue now 7)

## Decisions Made
- `AW.announce` lives inside the existing `if (typeof document !== 'undefined')` boot-stamp guard rather than top-level with internal guards (the `AW.reducedMotion` pattern) — the plan's `<interfaces>` block explicitly designates the boot-stamp block as its home, and the primitive has no meaning without `document`.
- The `.ls-back` contrast fix reuses the exact token (`--paper-62`) and exact selector 06-03's SUMMARY already specified as the "suggested fix (token-only, zero new hex, not applied here)" — no new design judgment was made, only the already-vetted fix was applied.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed the pre-existing `.ls-back` WCAG AA contrast failure on `.reg-sky-night`**
- **Found during:** Task 3 (running the plan's own `<verify>` block, which requires `contrast-audit.mjs` to exit 0)
- **Issue:** `06-03-SUMMARY.md` documented (but deliberately did not fix) a real WCAG AA text-contrast failure: `.ls-back` ("Back to the path") renders `var(--ink-62)` (dark ink) on the `reg-sky-night` du'a-close terminal screen's dark Last-Third gradient ground, computing to ~1.21:1 against the ≥4.5:1 requirement — 30 occurrences across all 15 lessons. The 06-03 SUMMARY explicitly flagged this as blocking a clean 06-07 gate and routed the fix to "06-05/06-06 or an explicit 06-07 exception." Since this plan's own Task 3 `<verify>` block runs `contrast-audit.mjs` and requires exit 0 with zero `CONTRAST FAIL` lines, the pre-existing failure was a direct blocker for completing Task 3 (Rule 3), and the fix itself is a genuine correctness bug (Rule 1) — a link a Sky-night-ground reader effectively cannot read.
- **Fix:** Added `.reg-sky-night .ls-back, .nightfall .ls-back { color: var(--paper-62); }` — the exact, already-precedented, token-only fix 06-03's SUMMARY specified (`--paper-62` is the existing dark-ground secondary-ink token already used for the identical purpose at `.rv-shell .ls-count`). Zero new hex, no layout change, no `@layer` order-line touch.
- **Files modified:** `shared/awba-engine.css`
- **Verification:** `node scripts/tests/contrast-audit.mjs` now exits 0 with zero `CONTRAST FAIL` lines (was 30 FAIL lines before the fix); the full node:test suite remains `fail 0`; render-smoke remains green.
- **Committed in:** `e49ef0a` (Task 3 commit)

---

**Total deviations:** 1 auto-fixed (1 pre-existing bug fix, Rule 1/3 — directly blocking this plan's own verify gate, fixed with the exact solution the prior plan already specified). **Impact on plan:** necessary to satisfy Task 3's own automated verification; no scope creep — the fix is a single CSS line reusing an existing token, and it closes a blocker the 06-03 plan explicitly left open for a downstream plan to close.

## Issues Encountered
None beyond the deviation above.

## User Setup Required
None - no external service configuration required.

## Known Stubs
None — this plan builds engine primitives with no UI surface of its own; `AW.announce`'s insertion points (composing the actual announce strings at `resolve()`, `reflect`, review timers, etc.) and the popup/Festival trap wiring are explicitly out of scope for 06-04 and land in 06-05/06-06 per the plan's own residue ledger (9 remaining `{ todo }` in a11y-announce.test.js, 7 in a11y-dialogs.test.js — both counts verified below).

## Threat Flags
None — `AW.announce` writes exclusively via `textContent` (never `innerHTML`, T-06-04a); `AW._trapFocus` only reads/wraps focus within the overlay it's attached to and never reaches outside it (T-06-04b); `grep -c localStorage shared/awba-engine.js` stays exactly 13 (T-06-04c). No new network endpoint, auth path, or schema surface.

## Doubts to Carry to the 06-07 Human Gate
- The focus-ring's *visual* quality (offset/width/legibility on the grain) and real Tab-order feel remain honest human-gate items per 06-RESEARCH D-68 — this plan only verified the grammar computationally, not visually.
- `AW._trapFocus`'s wrap-on-Tab behavior is verified via the synthetic-Tab-at-overlay probe pattern (06-RESEARCH D-68 confirms listeners fire on untrusted events); a real hardware Tab-key walk through the sheet is still a manual verification worth a spot-check at the 06-07 gate.
- The `.ls-back` fix was applied opportunistically to satisfy this plan's own verify gate rather than as a planned 06-04 task — flagging so the 06-07 reviewer knows it landed here instead of 06-05/06-06 as originally routed by 06-03.

## Next Phase Readiness
- `AW.announce`, `AW._trapFocus`, and the named/focus-managed `AW.sheet` are ready for 06-05 (runners) and 06-06 (learn.html popup/Festival) to wire — the shared implementation exists so announcements and dialog containment are one implementation, not three.
- `scripts/tests/a11y-announce.test.js` carries exactly 9 `{ todo }` (region-exists flipped this plan; the 9 announce/focus insertion points land in 06-05).
- `scripts/tests/a11y-dialogs.test.js` carries exactly 7 `{ todo }` (the 3 sheet assertions flipped this plan; popup ×5 + Festival ×2 land in 06-06).
- No blockers.

---
*Phase: 06-accessibility-rtl-typography-hardening*
*Completed: 2026-07-14*

## Self-Check: PASSED

- FOUND: `shared/awba-engine.js`
- FOUND: `shared/awba-engine.css`
- FOUND: `.planning/phases/06-accessibility-rtl-typography-hardening/06-04-SUMMARY.md`
- FOUND commit: `5b0ecdb` (Task 1)
- FOUND commit: `5d784d4` (Task 2)
- FOUND commit: `e49ef0a` (Task 3)
- Re-ran plan-level `<verification>`: node:test suite `tests 154 / pass 134 / fail 0 / todo 20` (exit 0); `render-smoke.mjs` exit 0, 21 SMOKE OK, 0 SMOKE FAIL; `contrast-audit.mjs` exit 0, 0 CONTRAST FAIL; `grep -c '{ todo' scripts/tests/a11y-announce.test.js` = 9; `grep -c '{ todo' scripts/tests/a11y-dialogs.test.js` = 7; `grep -c localStorage shared/awba-engine.js` = 13; `@layer` order-line count = 1; `port-audit.mjs` exit 0 (content byte-preservation intact)
