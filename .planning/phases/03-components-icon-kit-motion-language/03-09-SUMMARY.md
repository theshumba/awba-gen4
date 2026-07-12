---
phase: 03-components-icon-kit-motion-language
plan: 09
subsystem: ui
tags: [css, cascade-layers, motion, keyframes, reduced-motion, athar, components, waapi]

# Dependency graph
requires:
  - phase: 03-06
    provides: "@layer tokens + @layer base rewritten to Athar (17 colours, ink ramps, print radii, ink/edge depth, --icon-accent register scopes, one-easing motion tokens, register grounds, data-state map, scripture law)"
  - phase: 03-07
    provides: "AW.ringSVG + the @keyframes ink-draw Orbit-draw verb and .ring wrapper (preserved untouched)"
  - phase: 03-08
    provides: "AW.KIT/AW.GLYPHS re-inked to currentColor + var(--icon-accent) (drives the re-skinned chrome's icon accent)"
provides:
  - "@layer components re-skinned to Athar: one paper-press across the tappable inventory; register-scoped chrome (.btn/.opt/.tf/.tile/.tab/.hstat); .cite rubrication + .term dotted-crimson; the re-skinned singleton sheet with the Qur'an/hadith face-split, always-on pending pill + olive grade pill; shape-first thermal states; the four celebration primitives .dab/.thread/.plate/.rosette"
  - "@layer motion rebuilt to the Athar vocabulary: settle/breathe/breathe-halo/drift/stamp on the one easing family; Gen-3 keyframes + mascot loops retired; ink-draw preserved; both reduced-motion triggers re-pointed to the new finite tokens + ambient classes"
  - "AW.confetti removed from the engine (D-A14); all other AW.* builders retained"
  - "the whole-file --accent and rgba(37,54, absence gates now CLOSE for shared/awba-engine.css; the AW.confetti gate closes for shared/awba-engine.js"
affects: [03-10-sky, 03-11-preview, 03-12-closure, phase-4-runners]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "One Athar paper-press (translateY(1px) + one-step ink deepen over --dur-press) shared across .btn/.opt/.tf/.tile/.tab/.hstat/.cite/.term — coherence over per-element flourish (MOT-03/D-A4)"
    - "Law-8 wrong-answer vocabulary: grey ink-blot mark (.opt.wrong::after) + one-line --ink-85 explanation (.opt-why) + --rose retry frame (.retry) — shape+text carry the signal, rose only frames (D-A12)"
    - "Shape-first thermal states on [data-state] (hollow ring / half-inked dab / filled dab+check) consuming --st, ground-recoloured for cream-contrast safety (D-A8)"
    - "Four celebration primitives driven by the register verbs: .dab(drift), .thread(ink-draw), .plate(stamp), .rosette(stamp) — CSS-driven, no JS burst"
    - "Dual reduced-motion quieting re-based on the Athar finite tokens (collapse to 1ms) + animation:none on the new ambients; --dur-amb/--dur-amb-drift never collapsed (MOT-04)"

key-files:
  created: []
  modified:
    - "shared/awba-engine.css — @layer components re-skinned + @layer motion rebuilt"
    - "shared/awba-engine.js — AW.confetti removed; COMPONENTS header banner cleaned"

key-decisions:
  - "Components+motion were a full re-skin (not surgical): 03-06 renamed every token, so each rule body was rewritten to live tokens — but selectors/structure were preserved and ink-draw/.ring left byte-untouched"
  - "The wrong-answer grey ink-blot is a calm persistent low-opacity stain (settle fade-in) rather than a bespoke fade-out keyframe — keeps the motion layer to the four sanctioned verbs while satisfying law 8 (a soft grey mark, nothing flashing)"
  - "The gold correct-dot and .opt-why reveal reuse the authored settle verb rather than adding a UI-scale draw keyframe (draw is reserved for the SVG ink-draw stroke)"
  - "components.test.js left intact — it has NO AW.confetti case, so there was nothing to consciously remove (never silently shrunk)"

patterns-established:
  - "CSS class hooks (.dab/.thread/.plate/.rosette/.opt.correct/.opt.wrong/.opt-why/.retry/.g-ar.chapter/.tab.active/.btn.ghost/.sky-breathe) are authored this phase for Phase-4 runner DOM to consume — the re-skin is CSS-only by design"

requirements-completed: [ENG-06, MOT-01, MOT-03, MOT-04]

# Metrics
duration: 20min
completed: 2026-07-12
---

# Phase 3 Plan 09: Components Re-skin + Motion Vocabulary Rewrite Summary

**Retired the gummy press + the whole celebration menagerie (.combo/.perfect/.confetti/.companion/.breathing-ring + AW.confetti) and re-skinned @layer components/@layer motion to the Athar registers — one paper-press, register-scoped chrome, the law-8 gentle wrong-answer, the re-skinned face-split sheet, shape-first thermal states, and the four new celebration primitives on the settle/breathe/drift/stamp verbs — closing the whole-file --accent and rgba(37,54, gates plan 06 deferred.**

## Performance

- **Duration:** ~20 min
- **Started:** 2026-07-12T21:40:00Z
- **Completed:** 2026-07-12T22:00:00Z
- **Tasks:** 3
- **Files modified:** 2

## Accomplishments
- `@layer components` fully re-skinned to Athar tokens: the ONE paper-press across `.btn/.opt/.tf/.tile/.tab/.hstat/.cite/.term`; `.btn` crimson-ink-block on Page / cream-key + gold-ghost on dark; `.opt` law-8 wrong-answer (grey ink-blot + `--ink-85` explanation + `--rose` retry frame); `.cite` crimson rubrication (byte-shape preserved) + `.term` dotted-crimson; the re-skinned singleton sheet (warm-ink scrim, cream ground, `--r-4`, `--sh-3`, settle) with the Amiri-Quran/Amiri face-split, always-on `unverified · pending review` pill and olive grade pill (D-A9); shape-first thermal states (hollow/half/filled+check, D-A8); the four celebration primitives `.dab`/`.thread`/`.plate`/`.rosette`.
- `@layer motion` rebuilt to the Athar vocabulary — `settle`/`breathe`/`breathe-halo`/`drift`/`stamp` on the single `--ease` family; the Gen-3 `fall`/`bob`/`glow`/`popIn` + node-pulse `breathe` keyframes and the `.companion`/`.breathing-ring` mascot loops retired; the plan-07 `ink-draw` keyframe and `.ring` wrapper preserved byte-untouched; both reduced-motion triggers re-pointed to collapse the new finite tokens (1ms) and stop the new ambients (`.sky-breathe`/`.dab`/`[data-ambient]`), with `--dur-amb` deliberately never collapsed.
- `AW.confetti` removed from the engine (D-A14) with every other `AW.*` builder retained; the COMPONENTS header banner's confetti mention cleaned.
- **The whole-file `--accent` and `rgba(37,54,` absence gates now CLOSE for `shared/awba-engine.css`; the `AW.confetti` gate closes for `shared/awba-engine.js`.**

## Task Commits

Each task was committed atomically:

1. **Task 1: Re-skin @layer components** - `7d9a105` (feat)
2. **Task 2: Rebuild @layer motion** - `1e18df8` (feat)
3. **Task 3: Remove AW.confetti from the engine** - `ca35d4a` (feat)

**Plan metadata:** (this commit) (docs: complete plan)

## Files Created/Modified
- `shared/awba-engine.css` - `@layer components` re-skinned selector-by-selector to Athar (paper-press inventory, register chrome, chips, sheet, `r-*`/`g-*`, thermal shapes, `.dab`/`.thread`/`.plate`/`.rosette`); `@layer motion` rebuilt (settle/breathe/drift/stamp; Gen-3 keyframes + mascot loops retired; `ink-draw`/`.ring` preserved; dual reduced-motion re-based).
- `shared/awba-engine.js` - `AW.confetti` primitive + banner deleted; COMPONENTS section header reworded (no confetti reference).

## Decisions Made
- **Full re-skin, not surgical:** 03-06 renamed every token in the tokens layer, so the components/motion layers referenced dead names throughout — each rule body was rewritten to live Athar tokens while selectors, structure, and the AW.* markup contracts were preserved. `ink-draw` + `.ring` left byte-untouched.
- **Wrong-answer blot as a calm persistent stain** (settle fade-in to a low-opacity grey mark) rather than a bespoke fade-out keyframe — keeps `@layer motion` to the four sanctioned verbs while still delivering law 8 ("a soft grey mark ... nothing flashing").
- **Correct-dot + explanation reveal reuse `settle`** rather than adding a UI-scale `draw` keyframe (draw is reserved for the SVG `ink-draw` stroke).
- **`components.test.js` left intact** — verified it has NO `AW.confetti` case, so there was nothing to consciously remove (never silently shrunk). The plan's test-update instruction was a no-op on the test file.

## Deviations from Plan

None affecting scope — plan executed as written. Two in-scope authoring choices worth flagging for the reviewer (both within the plan's own instructions):

- **`.sheet-row` re-skinned (not named in retire/re-skin lists):** it still referenced the dead `--accent-soft`/`--dur-2`/`--ease-*` tokens, which would have kept the `--accent` gate open. Re-skinned to a faint crimson wash on the shared paper-press timing. (Rule 3 — blocking dead-token reference; required to close the wave's gate.)
- **JS COMPONENTS header banner cleaned:** line-19 section note listed "confetti"; reworded so no retired-name string survives in `shared/` per the wave's cleanup ownership. (Rule 1/3 — comment hygiene; the strict absence gates grep whole files.)

## Issues Encountered
- **ugrep `--` option quirk:** the environment's `grep` is ugrep, which misparses a `-qE '--press-rest|…'` pattern (leading `--`) as an option — the plan's Task-1 verify line therefore *errored* on that sub-check and the shell `!` flipped the error to a false pass. Confirmed the real absence independently with a paren-wrapped pattern (`grep -cnE '(--press-rest|--press-active|--overlay-hero)'` → 0). All genuine gates verified true, not accidentally.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Components + motion are Athar-clean; the CSS class hooks (`.dab`/`.thread`/`.plate`/`.rosette`/`.opt.correct`/`.opt.wrong`/`.opt-why`/`.retry`/`.btn.ghost`/`.tab.active`/`.g-ar.chapter`/`.sky-breathe`) are authored and awaiting Phase-4 runner DOM.
- 03-10 (prayer-clock Sky) can now wire `.sky-breathe`/`breathe-halo` ambients into the register grounds; 03-11 (preview) can render the full re-skinned inventory + `ringSVG`; 03-12 owns the human §9 visual gate (the paper-press, the face-split sheet, the gentle wrong-answer, and the reduced-motion stillness are the elevations to confirm on real screens).
- Suite green 45/45; `validate-content.js --self-test` green (AW.cite byte-shape intact).

## Self-Check: PASSED

---
*Phase: 03-components-icon-kit-motion-language*
*Completed: 2026-07-12*
