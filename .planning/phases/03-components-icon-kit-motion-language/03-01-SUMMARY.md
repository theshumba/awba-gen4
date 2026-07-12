---
phase: 03-components-icon-kit-motion-language
plan: 01
subsystem: ui
tags: [css, "@layer", custom-properties, motion, prefers-reduced-motion, gummy-press, bottom-sheet, linear-easing]

# Dependency graph
requires:
  - phase: 01-foundation-design-tokens-responsive-shell-fonts
    provides: "@layer name-list + tokens layer (--dur-*/--ease-* motion tokens, --sp-*/--fs-*/colour+per-unit accent scales, --sh-*, --r-*, [data-register=night] hook), @layer base rule-authoring conventions"
  - phase: 02-state-layer-engine-contract-freeze
    provides: "awba_prefs boot-stamp that writes [data-motion=reduce] on the in-app override (the second reduced-motion trigger this CSS pairs with the OS media query)"
provides:
  - "4 depth/overlay tokens (--press-rest 5px, --press-active 2px, --scrim, --overlay-hero) in @layer tokens :root"
  - "@layer components: cite/term chips, singleton scrim+sheet primitive, citation-sheet content classes with Quran/hadith face-split (.r-ar.ayah), neutral pending pill + green grade pill, term-gloss classes, full gummy-press tappable inventory, gold combo chip, Poppins-700 PERFECT overlay, confetti chrome, elevated-lite sheet-row"
  - "@layer motion: five vocabulary keyframes (fall/bob/breathe/glow/popIn), ambient loop assignments, ONE dual-trigger reduced-motion block"
affects: [03-02-icon-kit, 03-03-components-js, 03-04-preview, phase-04-lesson-reward-choreography, phase-05-learn-path]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "ONE shared gummy press selector group (.btn/.opt/.tf/.tile/.tab/.hstat) — press depth derives as calc(--press-rest - --press-active), no third literal"
    - "Asymmetric CSS-transition sheet motion: gentle settle IN (--ease-gentle on .open), clean exit OUT (--ease-in on base)"
    - "Dual-trigger reduced-motion: token-collapse (--dur-1..6 → 1ms) for finite transitions + animation:none for enumerated infinite loops (never collapse --dur-amb)"
    - "Hover states gated behind @media (hover: hover) and (pointer: fine) so a touch tap never latches a hover fill"

key-files:
  created:
    - .planning/phases/03-components-icon-kit-motion-language/03-01-SUMMARY.md
  modified:
    - shared/awba-engine.css

key-decisions:
  - "Element-level transitions (press/hover/sheet/chip) authored in @layer components co-located with their rules; @layer motion holds only keyframes, ambient loops, and the reduced-motion quieting — the token-collapse still reaches component transitions because they reference var(--dur-*), which @layer motion (highest priority) overrides"
  - "Combo chip in the GOLD/noor register (color-mix gold2/gold/gold-deep), NOT amber — amber is the miss colour; a celebratory amber chip would conflate with a miss (mercy-coherence)"
  - "PERFECT heading at Poppins 700 + gold→flame gradient text-clip (honours Phase-1 800-quarantine); a color:var(--gold2) fallback guards the rare no-background-clip engine"
  - "popIn authored from scale(.9) not scale(0) (emil craft: nothing appears from nothing); combo entrance keeps the contract's scale(0)→scale(1) as a rare celebratory pop with --ease-press overshoot"
  - "Sheet bottom padding uses max(var(--sp-8), env(safe-area-inset-bottom)) — a fixed bottom sheet must clear the home indicator (Rule 2 correctness elevation over the spec's flat var(--sp-8))"

patterns-established:
  - "Gummy press: ONE token-defined shadow-collapse + translateY across the full tappable inventory"
  - "Bottom-sheet primitive chrome (scrim/sheet/grip/sheet-x/html.sheet-lock) reused by every sheet in the app (Phase 5)"
  - "Citation-sheet Quran/hadith face-split via .r-ar vs .r-ar.ayah"
  - "Dual-trigger reduced-motion quieting written once, both triggers sharing bodies"

requirements-completed: []  # MOT-01/03/04 are cross-plan (also claimed by 03-03/04/05); this plan ships their CSS foundation half only — marking deferred to the phase's final requirement-completing plan.

# Metrics
duration: ~18min
completed: 2026-07-12
---

# Phase 3 Plan 01: Component & Motion CSS Layers Summary

**Filled the two empty CSS layers — `@layer components` (every shared surface's static chrome + one token-defined gummy press) and `@layer motion` (five vocabulary keyframes, ambient loops, and one dual-trigger reduced-motion block) — plus 4 depth/overlay tokens, growing `awba-engine.css` from 307 to 810 lines with the layer-order line byte-identical and 26 tests green.**

## Performance

- **Duration:** ~18 min
- **Started:** 2026-07-12T13:13Z (approx.)
- **Completed:** 2026-07-12T13:31:34Z
- **Tasks:** 2
- **Files modified:** 1 (`shared/awba-engine.css`)

## Accomplishments
- Added the 4 Phase-3 tokens (`--press-rest`, `--press-active`, `--scrim`, `--overlay-hero`) to `:root` in the same comment-above-group/trailing-purpose format as the motion tokens — no layer-order redeclare.
- Authored the full `@layer components` chrome: citation/term chips, the singleton scrim+sheet system, citation-sheet content with the Quran-vs-hadith face-split (`.r-ar` general Amiri / `.r-ar.ayah` Amiri Quran), calm-neutral pending pill + green grade pill, term-gloss classes, the gold combo chip, the Poppins-700 gradient PERFECT overlay, and confetti chrome.
- Established ONE shared gummy press across `.btn/.opt/.tf/.tile/.tab/.hstat`: rest `0 var(--press-rest) 0 var(--accent-deep)` over a soft `--sh-1`, `:active` drops `calc(--press-rest - --press-active)` = 3px — the drop derives from the two tokens with no third literal. Inline chips (`.cite`/`.term`) and `.sheet-row` reconciled at `translateY(1px)` sharing the same `--dur-2/--ease-press` timing.
- Authored `@layer motion`: five transform/opacity/filter-only keyframes (`fall`, `bob`, `breathe`, `glow`, `popIn`), the three ambient loop assignments on `--dur-amb`/`--ease-gentle`, and ONE dual-trigger reduced-motion block whose `@media (prefers-reduced-motion: reduce)` and `[data-motion="reduce"]` triggers share bodies (collapse `--dur-1..6` to 1ms + `animation:none` on the enumerated loops).
- Every colour/spacing/radius/shadow/timing value is a `var(--token)`; zero raw easing literal escapes the tokens layer (verified from `@layer components` to EOF).

## Task Commits

Each task was committed atomically:

1. **Task 1: 4 tokens + @layer components chrome and gummy press** — `9025f6d` (feat)
2. **Task 2: @layer motion — vocabulary keyframes + dual-trigger reduced-motion** — `fd89dfc` (feat)

**Plan metadata:** _(this commit)_ (docs: complete plan)

## Files Created/Modified
- `shared/awba-engine.css` — filled `@layer components` (~330 lines) and `@layer motion` (~70 lines); added 4 tokens to `:root`; layer-order line 16 and `@layer base`/`@layer screens` untouched.
- `.planning/phases/03-components-icon-kit-motion-language/03-01-SUMMARY.md` — this summary.

## Decisions Made
- **Transition placement:** element-level transitions live in `@layer components` co-located with their rules; `@layer motion` holds only keyframes, loop assignments, and the reduced-motion quieting. The plan permits either location (executor discretion); co-location keeps interruptible press/sheet transitions with their components, and the token-collapse in `@layer motion` still reaches them because they reference `var(--dur-*)` (the motion layer, being highest-priority, wins the `--dur-*` override).
- **Combo = gold, not amber** — mercy-coherence (amber is the miss colour), per UI-SPEC decision.
- **PERFECT = Poppins 700 + gradient text-clip** — honours the Phase-1 800-quarantine; a `color: var(--gold2)` fallback guards the rare engine without `background-clip: text`.
- **`popIn` from `scale(.9)`** (emil craft: nothing appears from nothing); the combo keeps the contract's `scale(0)→scale(1)` as a rare celebratory pop with `--ease-press` overshoot.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Safe-area padding on the fixed bottom sheet**
- **Found during:** Task 1 (sheet primitive chrome)
- **Issue:** The spec's flat `padding: var(--sp-6) var(--sp-6) var(--sp-8)` leaves sheet content under the iOS home indicator, since `.sheet` is a `position:fixed` element pinned to the viewport bottom (outside the `.app-foot` safe-area handling from Phase 1).
- **Fix:** Bottom padding uses `max(var(--sp-8), env(safe-area-inset-bottom))` — never less than the spec's `--sp-8`, but clears the home bar on notched phones.
- **Files modified:** `shared/awba-engine.css`
- **Verification:** Value degrades to exactly `var(--sp-8)` where `env()` is 0; no token replaced, no new literal.
- **Committed in:** `9025f6d` (Task 1 commit)

**2. [Rule 3 - Blocking] Reworded an explanatory comment to clear the easing-literal gate**
- **Found during:** Task 1 (post-authoring gate check)
- **Issue:** A `@layer components` header comment contained the literal strings `cubic-bezier()`/`linear()` (describing the law), which the Task-2 absence gate `! sed -n '/@layer components {/,$ p' | grep -qE 'cubic-bezier|linear\('` would flag as a raw easing literal.
- **Fix:** Reworded to "never a raw easing curve or spring literal" — same meaning, no gated substring.
- **Files modified:** `shared/awba-engine.css`
- **Verification:** `sed -n '/@layer components {/,$ p' | grep -qE 'cubic-bezier|linear\('` returns clean.
- **Committed in:** `9025f6d` (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (1 missing-critical, 1 blocking)
**Impact on plan:** Both minor and within-scope. Safe-area padding is a correctness elevation for a fixed bottom sheet; the comment reword prevents a self-inflicted gate failure. No scope creep, no token discipline broken.

## Issues Encountered
None beyond the two auto-fixes above. All plan gates passed on first authoring pass (after the comment reword).

## Forward Seeds (intentional — not stubs)
Per D-40/D-41 the following are fully-authored CSS chrome that later plans wire, NOT incomplete stubs:
- `.combo` / `.perfect` / `.confetti`+`.cf` — complete chrome; Phase-4 JS (`AW.confetti`, `AW.animate`, combo/PERFECT triggers) drives them.
- `.sheet-row:active` — seeded press for the Phase-5 course-switcher.
- `.companion` / `.breathing-ring` / `[data-ambient]` loops — assigned here; Phase-4/5 render the elements.
This plan's own goal (fill the two CSS layers) is fully achieved; no data stub blocks it.

## Requirements Status
- **MOT-03** (gummy press on the full inventory) — CSS-complete here; the shared press + inline/sheet-row reconciliation ships in `@layer components`.
- **MOT-01** (one motion vocabulary) — CSS half complete (`@layer motion` keyframes + loops + token discipline); the WAAPI orchestration exemplar (plan 03) and preview demos (plan 04) complete it.
- **MOT-04** (global reduced motion) — CSS half complete (dual-trigger block); the JS self-guards + in-app preference override (plan 03) complete it.

`requirements.mark-complete` intentionally NOT run: MOT-01/03/04 are also claimed by plans 03-03/04/05, so marking them off in REQUIREMENTS.md now would be premature. Left for the phase's final requirement-completing plan.

## Next Phase Readiness
- Every class name and token the Phase-3 JS (KIT/COMPONENTS, plans 02–03) and preview (plan 04) render against now exists in the engine stylesheet.
- The bottom-sheet primitive chrome, gummy-press inventory, face-split sheet, and dual-trigger reduced-motion are ready for plan 03's `AW.sheet`/`AW.cite`/`AW.wire`/`AW.confetti`/`AW.animate` to bind to.
- No blockers. `node --test scripts/tests/*.test.js` → 26/26.

## Self-Check

_(appended below after verification)_

---
*Phase: 03-components-icon-kit-motion-language*
*Completed: 2026-07-12*

## Orchestrator close-out note (2026-07-12)

The executor was terminated by a session limit AFTER both task commits landed (`9025f6d` tokens+components, `fd89dfc` motion+reduced-motion) but before committing this SUMMARY. The orchestrator re-ran the plan's FULL automated gate set post-mortem: all token greps, all 13 component-class greps (incl. `.sheet-row`), ayah face-split, layer-order line untouched, both reduced-motion triggers present, 26/26 tests green → **ALL 03-01 GATES GREEN**. Plan complete.

## Self-Check: PASSED (orchestrator-verified post-interrupt)
