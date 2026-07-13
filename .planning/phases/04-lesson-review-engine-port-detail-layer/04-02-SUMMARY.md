---
phase: 04-lesson-review-engine-port-detail-layer
plan: 02
subsystem: ui
tags: [css, cascade-layers, athar, scripture-law, reward-choreography, thermal-state, manuscript]

# Dependency graph
requires:
  - phase: 03-components-icon-kit-motion-language
    provides: "@layer tokens/base/components/motion (Athar tokens, four register grounds, paper-press, law-8 wrong-answer, .dab/.thread/.plate/.rosette, thermal data-state, .ring, .ayah/.scripture)"
  - phase: 04-lesson-review-engine-port-detail-layer
    provides: "04-01 runner-math + AW.sound plumbing; 04-CONTEXT D-45 translation table; 04-UI-SPEC S1–S4"
provides:
  - "@layer screens content: the lesson shell (.stage/.ls-hud/.ls-prog/.hero/.foot) on the Page register"
  - "the 9 beat surfaces (.read/.frame/.scard/.pnl+4 variants/.lacc/.reflect + .opts/.tfrow/.tilebox/.bank quiz wrappers)"
  - "the scripture-law verse card (.scard --go:0, .ayah strongest ink, .slabel/.trans/.tsrc)"
  - "the 3-lens depth accordion (.lacc/.lens/.lh/.lb, shape+label cued: Reality/Revelation/Ruling)"
  - "the reward sequence surfaces across three registers: .rw-verdict/.noorbig/.rw-returns/.rw-done (Page), .rw-ring (Orbit), .rw-dua (Sky)"
affects: [04-03 lesson runner, 04-04 reward choreography, 04-06 review port, 06 hardening]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "All per-screen CSS lives inside the reserved @layer screens block; the :16 order line is never re-declared"
    - "Screen classes consume shipped primitives (.opt/.tf/.tile/.dab/.thread/.ring/.ayah/[data-state]/paper-press) and add only layout + surface"
    - "Token-only authoring: every colour is a var(--token) cited to 03-UI-SPEC-ATHAR §2.1; decorative apricot glow via color-mix(in srgb, var(--apricot) N%, transparent) — no new hex"

key-files:
  created:
    - .planning/phases/04-lesson-review-engine-port-detail-layer/04-02-SUMMARY.md
  modified:
    - shared/awba-engine.css

key-decisions:
  - "The revelation lens's scripture obeys the law via a NESTED .scard (--go:0, strongest ink) — no lens-specific scripture rule authored, so the one scripture-card surface stays the single source of scripture styling"
  - "The three depth lenses are shape-cued at the CSS layer via distinct left-rule STYLES (solid/double/dashed) in addition to per-lens ink + the runner's per-lens glyph + label — 'never colour only' holds even in greyscale"
  - "The returns horizon-warmth glow is a color-mix(var(--apricot)) radial gradient (the --dawn/.reg-sky-night::before recipe) rather than a raw rgba(240,165,131) — keeps the surface token-pure with zero new hex"
  - "The four Page reward screens share one grouped settle+centering rule; the Orbit Ring + Sky du'a are authored separately (no Page settle) so each register keeps its own verb (law 9)"

patterns-established:
  - "Pattern: scripture surfaces (.scard, .rw-dua) never name a celebration primitive on the same line — the grep gate (dab|thread|plate|rosette) vs (.ayah|.scard|.rw-dua) stays clean file-wide"
  - "Pattern: weekcal 'never-miss' grammar — absent days are a lighter --ink-40 presence dot, present days a gold fill; no gap/red/miss state exists"

requirements-completed: [ENG-01, ENG-05, CNT-04]

# Metrics
duration: ~30min
completed: 2026-07-13
---

# Phase 4 Plan 02: Lesson & Reward `@layer screens` Surfaces Summary

**The manuscript CSS for the whole lesson vertical slice: the Page-register lesson shell, all 9 beat surfaces (with a scripture-law `.scard` and a shape+label-cued 3-lens accordion), the quiz-state wrappers, and the verdict→noor→returns→done→Ring→du'a reward sequence across Page/Orbit/Sky — authored token-only inside the reserved `@layer screens` block, zero new tokens/faces/order-lines.**

## Performance

- **Duration:** ~30 min
- **Completed:** 2026-07-13
- **Tasks:** 3
- **Files modified:** 1 (`shared/awba-engine.css`)

## Accomplishments
- Filled the reserved `@layer screens` block (was an empty one-line placeholder at `:923`) with ~610 lines of per-screen Athar surface CSS — the order line at `:16` remains declared exactly once.
- Authored the lesson shell as a warm manuscript page: `.stage` beat container (settle mount), `.ls-hud` transparent marginalia row + 44px `.ls-mute` slot, `.ls-prog` thermal shape-first progress dabs + Courier `.ls-count`, the opener `.hero` with a `.journey` chapter-term in a Farag square (Aref Ruqaa, crimson), and a `.foot` with keyline separation + quiet `.ls-back`.
- Authored all 9 beat surfaces distinctly, including the law-3 `.scard` verse card (`--go:0`, strongest `--kiswah` ink) and the 3-lens `.lacc` depth accordion (Reality→`--madder`, Revelation→`--crimson` with nested scripture, Ruling→`--olive`), all four panel variants reading differently.
- Authored the six-surface reward sequence one register per screen: `.rw-verdict`/`.noorbig`/`.rw-returns`/`.rw-done` on Page, `.rw-ring` on Orbit (gold/ember only, crimson banned), `.rw-dua` on Sky under scripture law; the returns hero carries a decorative apricot horizon glow (never apricot text) and `.weekcal` presence dots with no miss state.

## Task Commits

Each task was committed atomically:

1. **Task 1: Lesson shell + HUD marginalia + progress-dab row + opener** — `14bdb7b` (feat)
2. **Task 2: The 9 beat surfaces + quiz wrappers + 3-lens depth accordion + scripture-law scard** — `69d919b` (feat)
3. **Task 3: Reward-screen surfaces — verdict/noor/returns/done (Page) + Ring (Orbit) + du'a (Sky)** — `4d058c6` (feat)

**Plan metadata:** committed separately with SUMMARY + STATE + ROADMAP.

## Files Created/Modified
- `shared/awba-engine.css` — filled the `@layer screens` block with the S1–S4 lesson/reward surfaces (all other layers untouched; order line unchanged).
- `.planning/phases/04-lesson-review-engine-port-detail-layer/04-02-SUMMARY.md` — this file.

## Decisions Made
- **Nested-scard scripture for the Revelation lens.** Rather than author a lens-specific ayah rule, the runner nests a `.scard` inside `.l-revelation .lb`; the single scripture-card surface remains the only place scripture styling lives (`--go:0`, strongest ink), so law 3 has one authority.
- **CSS-layer shape cue for the 3 lenses.** Each lens gets a distinct left-rule STYLE (Reality solid / Revelation double / Ruling dashed) on top of its ink colour and the runner's per-lens glyph + label — so "shape + label, never colour only" holds even in greyscale.
- **Token-pure apricot glow.** The returns horizon warmth is `color-mix(in srgb, var(--apricot) 34%…)` (the `--dawn`/`.reg-sky-night::before` recipe) rather than a raw `rgba(240,165,131,…)`, honouring "zero new hex" while satisfying the `--apricot` presence gate.
- **Per-register verb integrity for reward screens.** The four Page reward screens share one settle+centering rule; the Orbit Ring and Sky du'a are authored without the Page settle so each register keeps its own verb (the Ring's draw comes from the shipped `.ring`; the du'a's glow/breathe from `@layer base`/Sky).

## Deviations from Plan

None — plan executed exactly as written. Every task's `<verify>` command was run verbatim and passed; the suite held at exactly 70/70 across all three tasks (CSS-only change, as predicted).

One naming note (not a deviation, a hard-rule compliance choice): the plan prose refers to the "combo/streak META surface", but the retired literal is banned everywhere in `shared/`, so the accrual surface is named `.meta` and the counter reuses the shipped `.ls-count` ("N in a row"); the accruing chip consumes the shipped gold `.dab`. No banned literal appears in the file (verified: `poppins|confetti|amber|lantern-gold|PERFECT|.combo|.perfect|rgba(37,54,|--accent` all clean).

## Issues Encountered
- First insertion attempt for Task 2 mis-anchored because a blank line sits between the `@layer screens` closing brace and `@layer motion {`. Re-anchored on the exact three-line boundary (declaration + `}` + blank + `@layer motion {`) and the edit applied cleanly. No content impact.

## Known Stubs / Intentional Deferral
- These surfaces are authored but not yet emitted or animated — **by design**. The plan is the CSS half of a deliberate horizontal split: 04-03 wires `AwbaLesson`/`AwbaReview` to emit these class names on the real u1-m1 page, and 04-04 adds the WAAPI reward choreography. No runner currently references `.scard`/`.lacc`/`.noorbig` etc., so there is no walkable page from this plan alone. This is not a hidden stub (no hardcoded empty data flows to a UI); it is the architecture's own `@layer screens` / RUNNERS seam. Resolved by 04-03 (runner) + 04-04 (choreography).

## Verify Outcomes
- **Task 1:** PASS — order line count == 1; `.stage|.ls-prog|.ls-hud` present; no `poppins`/`--accent`/`rgba(37,54,`; suite `fail 0`.
- **Task 2:** PASS — `.scard` present; all four `.v-check/.v-guard/.v-pull/.v-tell`; `.lacc` present; no celebration primitive on a `.ayah`/`.scard` line; order line == 1; no `poppins`/`confetti`; suite `fail 0`.
- **Task 3:** PASS — `.noorbig/.rw-verdict/.rw-returns/.weekcal` + `.rw-ring/.rw-dua` present; no celebration on a `.ayah`/`.rw-dua` line; order line == 1; no `poppins`/`confetti`/`amber`; `--apricot` present; suite `fail 0`.
- **Whole-file cross-checks:** brace balance 249/249; no crimson in the Orbit `.rw-ring` block; all retired-literal gates clean.

## Doubts to carry to the 04-07 human gate
- **Accordion open/collapsed contract is provisional.** `.lb` is hidden by default and shown via `.lens.open > .lb` OR `.lens[open] > .lb`. If 04-03's runner uses a different toggle mechanism (e.g. `aria-expanded` or `[hidden]` on `.lb`), the reveal rule may need a one-line adjust. Flagged so the runner and this CSS agree.
- **Reward-screen container names.** I introduced `.rw-noor` as the noor-screen container alongside the plan-named `.noorbig` headline, and grouped the four Page reward screens (`.rw-verdict/.rw-noor/.rw-returns/.rw-done`) for the shared settle. If 04-04 emits a different container name for the noor moment, the grouped rule needs that class added.
- **`.rw-stat .num` at `--fs-display` in a 1/3-width tile.** Marcellus 28→46px numerals fit small counts in a ~120px tile; a 4-digit noor total could crowd. Worth an eye at the visual gate — a `--fs-h1` fallback for the stat tiles (keeping `.noorbig` at full display) is a low-risk tweak if it reads tight.
- **The apricot glow strength (34%/8% stops) is my discretion** within D-45's "horizon warmth, never text" ruling — the visual gate should confirm it reads as ambient warmth, not a coloured panel.

## Next Phase Readiness
- The full manuscript surface vocabulary now exists for 04-03 to emit and 04-04 to choreograph. `@layer screens` is populated; all other layers untouched; suite green at 70/70; tree clean.
- No blockers introduced. The runner/CSS class contract (accordion toggle, reward container names) should be confirmed as 04-03 lands — captured above.

## Self-Check: PASSED

---
*Phase: 04-lesson-review-engine-port-detail-layer*
*Completed: 2026-07-13*
