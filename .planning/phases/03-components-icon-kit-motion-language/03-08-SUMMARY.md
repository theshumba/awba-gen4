---
phase: 03-components-icon-kit-motion-language
plan: 08
subsystem: ui
tags: [icon-kit, currentColor, icon-accent, athar-reink, deterministic-transform, aw-kit, aw-glyphs, lantern-gold-deleted, register-inheritance, opacity-wash]

# Dependency graph
requires:
  - phase: 03-06
    provides: "the Athar @layer base register grounds that set color + --icon-accent per ground (.reg-orbit gold, .reg-page crimson, .reg-sky-night gold, .reg-festival harissa) — the CSS the re-inked icons inherit from at render"
  - phase: 03-02
    provides: "AW.KIT (20 scenes + lantern-gold) + AW.GLYPHS (13) + AW.UNIT_ICON — the single-source registry this plan re-inks in place"
  - phase: 03-03
    provides: "AW.icon accessor (reads AW.KIT then AW.GLYPHS) — left untouched; icons re-ink via markup, not the accessor"
provides:
  - "AW.KIT re-inked to the Athar one-colour model: 20 scene SVGs where structural ink → currentColor (inherits the register ground), blob halos → currentColor @ .12, lit panels → .06 wash or fill=none, dimensional blues → currentColor opacity steps, and the single sparkle/star mark → var(--icon-accent)"
  - "AW.GLYPHS (13) re-inked to Athar tokens (--ember/--gold/currentColor/--icon-accent) per the §5 glyph map"
  - "AW.KIT['lantern-gold'] deleted (D-A6) — the currentColor model renders the one lantern gold on any dark ground automatically; the last hex-literal art variant is gone; KIT returns to 20 scenes"
  - "components.test.js registry-integrity re-proven at KIT===20 / GLYPHS===13 (lantern-gold assertion dropped consciously)"
affects: [09 (components own the retired-token CSS cleanup; icons now inherit color/--icon-accent), 10 (Sky screens render these icons cream+gold), 11 (preview.html §1/§4 shows the re-inked registry on each ground), 12 (whole-file gated-hex closure + human §9 visual gate)]

# Tech tracking
tech-stack:
  added: []
  patterns: [author-time deterministic hex→token transform touching only fill/stroke/opacity values (every d="…" byte-identical — provable by diffing the unique d= set vs HEAD), one asset re-inks by ground via CSS currentColor + a register-scoped --icon-accent custom property (no runtime .replace() recolour), panel wash-vs-none chosen per whether the quiet ink-line read survives at UI size, dimensional-blue facets flattened to currentColor opacity steps rather than dropped]

key-files:
  created: [.planning/phases/03-components-icon-kit-motion-language/03-08-SUMMARY.md]
  modified: [shared/awba-engine.js, scripts/tests/components.test.js]

key-decisions:
  - "The transform is deterministic and authored — a scripted fill/stroke/opacity substitution keyed on the §5.1 source-hex map, run once and committed. It never touches d=\"…\" geometry (verified: the unique d= set is identical to HEAD, 111 values, zero added/removed), and introduces no runtime .replace() recolour (grep gate stays clean)."
  - "Sparkle discrimination by PATH signature, not by hex-and-transform: only the three decorative sparkle/star path shapes (M0 -6 C1…, M0 2 C-2…, M0 -18 L5.3…) with fill #2536CE become var(--icon-accent) (35 marks across the 20 icons). Scattered small <circle r=3> decorative dots stayed currentColor — this keeps the accent budget tight (law 7) and avoids mis-accenting genuinely structural circles (prayer beads, compass cardinal dots, quran-stand hook)."
  - "Panels sitting on a solid currentColor body (windows-on-dome, faces, doors, the compass inner disc) → fill=none: a .06 wash over solid ink is imperceptible, so none is the honest choice (true negative space). Panels that are focal lit surfaces on the transparent register ground (quran-stand book pages, the calendar card) → .06 wash, so the surface reads under its ink detail."
  - "Off-map hexes reconciled to the same intent: #FFFFFF (calendar card) treated as a lit panel (→ .06 wash); the compass needle facets #4E82F7/#3A54C6 flattened to currentColor @ .85/.62 like the kaaba dimensional greys; the kaaba's #DCE6FB ground-shadow ellipse → fill=none (Athar has no drop shadows)."
  - "The calendar's #F4F7FE header star fell to the panel rule (→ fill=none), NOT to accent — the deterministic map keys on the SOURCE HEX and that star is a lit-panel hex, not #2536CE. Promoting it to --icon-accent would break 'apply the map exactly'; it sits on a solid ink banner and vanishes either way."
  - "lantern-gold deletion also required rewording the AW.KIT banner comment (it referenced the now-deleted variant): kept as a Rule-3 hygiene edit so the string 'lantern-gold' and the retired blue hexes it named leave shared/ entirely — the whole-file absence gates grep comments too."

patterns-established:
  - "One-colour icon model: an icon carries no colour of its own — currentColor inherits the register ground ink and a single var(--icon-accent) mark supplies the one expressive spot; the same asset is kiswah+crimson on Page and cream+gold on Orbit/Sky with zero per-ground assets"
  - "Geometry-safe re-ink: prove a colour-only transform by diffing the extracted d= set against HEAD (must be identical) rather than eyeballing — makes 'byte-identical geometry' a checkable gate"

requirements-completed: [FND-04]

# Metrics
duration: 15 min
completed: 2026-07-12
---

# Phase 3 Plan 08: Icon re-inking (currentColor + --icon-accent) Summary

**AW.KIT (20) + AW.GLYPHS (13) re-inked to the Athar one-colour model — structural ink → `currentColor`, halos/panels → low-opacity ink-wash or `fill="none"`, the one sparkle/star per icon → `var(--icon-accent)` — and the redundant `lantern-gold` variant deleted; every `d="…"` path byte-identical, no runtime recolour, suite green 45/0.**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-07-12T21:19Z
- **Completed:** 2026-07-12T21:34Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Re-authored all 20 `AW.KIT` scene icons to the currentColor + `--icon-accent` model per the deterministic §5.1 hex→Athar map — the one registry now re-inks by ground with no runtime recolour.
- Deleted `AW.KIT['lantern-gold']` (D-A6) and rewrote its banner comment — the last hex-literal art variant is gone; the single lantern renders gold on dark grounds automatically (visually confirmed below).
- Re-inked all 13 `AW.GLYPHS` to the Athar tokens (`--ember`/`--gold`/`currentColor`/`--icon-accent`) per the §5 glyph map.
- Closed the whole-file retired-blue-hex absence gate; updated `components.test.js` registry integrity to 20/13 consciously; suite stays green at 45/0 (37 base + 8 ring).

## Task Commits

Each task was committed atomically:

1. **Task 1: Re-ink AW.KIT (20 scenes) + delete lantern-gold** — `5fcf52b` (feat)
2. **Task 2: Re-ink AW.GLYPHS (13) + update components.test.js counts** — `bc6057c` (feat)

**Plan metadata:** (this SUMMARY + STATE + ROADMAP) — final docs commit below.

## Files Created/Modified
- `shared/awba-engine.js` — `AW.KIT` 20 scenes re-inked; `lantern-gold` entry + its banner comment deleted; KIT banner comment reworded to the Athar model; `AW.GLYPHS` 13 re-inked. `AW.icon`/`AW.UNIT_ICON` untouched.
- `scripts/tests/components.test.js` — KIT assertion 21→20 (title renamed to "20 scene entries"), `'lantern-gold' in AW.KIT` assertion dropped; GLYPHS===13 + all-start-`<svg` checks kept.
- `.planning/phases/03-components-icon-kit-motion-language/03-08-SUMMARY.md` — this file.

## Per-icon craft choices (wash `.06` vs `fill="none"`)

The §5.1 map fixes everything except the lit-panel decision (low-opacity ink wash vs negative space). Chosen per whether the "quiet ink line-drawing" read survives at UI size:

| Icon | Panel(s) | Choice | Why |
|------|----------|--------|-----|
| quran-stand | open-book pages (×2) | **wash .06** | pages are the focal surface on the ground; a faint page tint lets the `#A9BCEB`→currentColor@.4 text lines read as sitting on paper |
| calendar | card face (`#FFFFFF`) | **wash .06** (fill-opacity) + keyline `.12` | the card is the focal surface holding the day-dots; a faint panel + `.12` keyline gives it an edge |
| mosque | 3 dome windows | none | sit on the solid currentColor dome — a wash is imperceptible, so honest negative space |
| carpet | mihrab niche | none | on the solid carpet body |
| lantern | inner light window | none | on the solid lantern body |
| lanterns | 3 windows | none | each on a solid lantern body |
| compass | inner face (r53) + centre (r6) | none | on the solid disc |
| ewer | water drop | none | on the solid ewer body |
| night | lantern window | none | on the solid lantern body |
| kaaba | ground-shadow ellipse + door | none | shadow dropped (no drop shadows in Athar); door on the solid front face |
| calendar | header crescent + star (`#F4F7FE`) | none | on the solid ink header banner; a lit-panel hex, kept out of the accent (map keys on source hex) |

Icons with **no lit panels** (halo `.12` + structural currentColor + one `--icon-accent` mark only): crescent, hijab, man, family, prostration, standing, beads, dua, dates, pattern.

Deterministic (not a choice), recorded for completeness:
- **Blob halos / face ellipses / calendar day-dots / beads string** (`#C9D7F5`) → `currentColor` @ **.12** ink-wash.
- **Dimensional-blue facets** flattened to `currentColor` opacity steps (keeps the light/dark reading in ink): kaaba top `.85` / right `.62` / band `.45`; compass needle facets `.85`/`.62`; dates bowl-rim `.85` / back-dates `.45`.
- **quran-stand text lines** (`#A9BCEB`) → `currentColor` @ **.4**.

## Visual self-check (rasterised)

Baked the `lantern` and `crescent` assets onto both grounds by resolving `currentColor`/`var(--icon-accent)` exactly as each register's CSS would (Page: cream ground, kiswah ink, crimson accent · Orbit: kiswah ground, cream ink, gold accent), rasterised with ImageMagick, and viewed:
- **lantern** — kiswah silhouette + crimson sparkles on cream; **cream silhouette + gold sparkles on dark**, with the `.12` halo reading subtly on both. This directly confirms the deleted `lantern-gold` is redundant: the one asset inks gold-on-dark automatically.
- **crescent** — a slim ink crescent (geometry untouched) with the 5-point star as the single expressive spot: crimson on cream, gold on dark, plus two accent sparkles. Both read as quiet ink line-drawings.

**Result: PASS on both cream and dark grounds.**

## Decisions Made
See `key-decisions` in the frontmatter — the load-bearing ones are: (1) authored scripted transform that never touches `d=` geometry (proven by diffing the unique `d=` set vs HEAD); (2) sparkle-accent by path signature only, structural circles stay currentColor to protect the accent budget; (3) panel wash-vs-none by whether the panel sits on a solid ink body (→ none) or is a focal ground surface (→ wash .06); (4) off-map hexes reconciled to their obvious §5.1 family.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking hygiene] Reworded the AW.KIT banner comment that named the deleted lantern-gold variant + retired blue hexes**
- **Found during:** Task 1 (delete lantern-gold)
- **Issue:** After deleting `AW.KIT['lantern-gold']`, the KIT banner comment still said "The lantern-gold variant + AW.GLYPHS join this section below" and described the icons as "brand-blue + sparkle" — leaving the string `lantern-gold` (and, in the deleted entry's own banner, the retired blue hexes) in `shared/`. The project's absence gates grep comments too.
- **Fix:** Rewrote the KIT banner comment to describe the Athar one-colour re-ink (03-08 / D-A5) and dropped the lantern-gold reference. Confirmed `grep -c 'lantern-gold' shared/awba-engine.js` → 0.
- **Files modified:** shared/awba-engine.js
- **Verification:** Task 1 gates re-run green; whole-file gated-hex gate closes in Task 2.
- **Committed in:** `5fcf52b` (Task 1 commit)

**2. [Rule 2 - Map completeness] Reconciled off-map hexes to their §5.1 family**
- **Found during:** Task 1 (KIT re-ink)
- **Issue:** Three KIT hexes are not literally in the §5.1 table: `#FFFFFF` (calendar card), `#4E82F7` + `#3A54C6` (compass needle facets). Leaving them would have failed the "no raw art hex" intent and broken those icons.
- **Fix:** Applied the map's obvious families — `#FFFFFF` as a lit panel (→ `.06` wash), the two compass facets as dimensional blues (→ `currentColor` @ `.85`/`.62`, matching the kaaba grey treatment).
- **Files modified:** shared/awba-engine.js
- **Verification:** KIT slice contains zero source art hexes after the transform (reported by the transform script); Task 1 in-registry hex probe passes.
- **Committed in:** `5fcf52b` (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (1 blocking-hygiene, 1 map-completeness). No scope creep — both are inside the deterministic transform's remit; no geometry changed, no new asset invented.
**Impact on plan:** None to the plan's shape; both were necessary to leave `shared/` gate-clean and to re-ink every art hex.

## Issues Encountered
None. The two-step sequencing (Task 1 leaves GLYPHS source hexes so the whole-file gate stays open until Task 2) behaved exactly as the plan-checker noted; the KIT in-registry hex probe passed at Task 1 while the whole-file gate closed at Task 2.

## Known Stubs
None — this is a colour-only re-ink of existing, fully-drawn art. No placeholder data, no empty renders.

## Threat Flags
None — only `fill`/`stroke`/`opacity` attribute values changed on author-controlled static SVG; no new endpoint, auth path, file access, or dynamic-data surface (matches the plan's T-03-08 `mitigate` disposition: geometry byte-identical, no runtime `.replace()`).

## Next Phase Readiness
- Icons now inherit `color` + `--icon-accent` from the register grounds that 03-06 established. Ready for 03-09 (components own the retired-token CSS cleanup), 03-10 (Sky), and 03-11 (preview injects the re-inked registry + `AW.ringSVG`).
- The whole-file retired-blue-hex gate is closed for `shared/awba-engine.js`; the remaining `--accent`/`rgba(37,54,` closure for the CSS still lands at plan 12 (unchanged).
- Note for the human §9 visual gate: filled-illustration icons that were built as solid blue shapes read as **solid ink silhouettes** under the one-colour model (e.g., compass, lantern) — this is the faithful transform, not a bug; the sparkle/star accent is the one spot of colour. Flagged for owner eyes at the preview.

---
*Phase: 03-components-icon-kit-motion-language*
*Completed: 2026-07-12*

## Self-Check: PASSED
- Files present: shared/awba-engine.js, scripts/tests/components.test.js, 03-08-SUMMARY.md
- Commits present: 5fcf52b (Task 1), bc6057c (Task 2)
