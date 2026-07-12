---
phase: 03-components-icon-kit-motion-language
plan: 04
subsystem: ui
tags: [preview, vanilla-js, svg-icons, bottom-sheet, waapi, reduced-motion, verbatim-scripture, brand-moment, file-protocol]

# Dependency graph
requires:
  - phase: 03-01
    provides: "@layer components (8-class gummy press: .btn/.opt/.tf/.tile/.cite/.tab/.hstat/.sheet-row) + @layer motion (keyframes fall/bob/breathe/glow/popIn + dual-trigger reduced-motion) + 4 press/overlay tokens"
  - phase: 03-02
    provides: "AW.KIT (21 scenes incl. lantern-gold), AW.GLYPHS (13), AW.UNIT_ICON"
  - phase: 03-03
    provides: "AW.icon / AW.cite / AW.wire / AW.sheet+sheetRef+sheetTerm (face-split) / AW.confetti (guarded) / AW.reducedMotion / AW.animate"
provides:
  - "preview.html §9 — the branded 20-icon registry grid (56px) + 13 glyphs (20px) + lantern-gold (128px) on a night-register swatch, all real AW.icon() output; the FND-04 visual proof"
  - "preview.html §10 — real AW.cite/AW.wire chips opening the citation sheet (Quran .ayah / hadith grade pill) + aqeedah gloss from BYTE-VERBATIM scripture; the ENG-06 visual proof"
  - "preview.html §11 — one gummy press across the full real .btn/.opt/.tf/.tile/.cite/.tab/.hstat/.sheet-row inventory; the MOT-03 visual proof"
  - "preview.html §12 — the one motion vocabulary labelled by token + the confetti/PERFECT WAAPI exemplar + the dual reduced-motion toggle; the MOT-01/MOT-04 visual proof"
  - "a real page-relative classic <script src=\"shared/awba-engine.js\"> include so the preview demos the shipped engine over file://"
affects: [03-05 (the D-44 human visual gate walks §9-12), Phase 4 runners (this is the living reference of the real AW.* output they consume), Phase 5 learn path]

# Tech tracking
tech-stack:
  added: []
  patterns: [icon-grid-from-registry-loop (Object.keys(AW.KIT/GLYPHS) → AW.icon() per cell), accent-tinted icon well that recolours on unit switch, byte-verbatim demoCfg reused from Josh's source object literals (no retype), iframe-harness + fragment-scroll headless self-check]

key-files:
  created: [.planning/phases/03-components-icon-kit-motion-language/03-04-SUMMARY.md]
  modified: [preview.html]

key-decisions:
  - "§9 recolour is demonstrated via an accent-soft WELL behind each authored (brand-locked) icon + a §9-local unit switch synced with §2 — the icon art stays brand-blue, the well carries the live unit identity"
  - "The 3 light-on-fill glyphs (check/chest/trophy) render on their real contextual plate (check→green, chest+trophy→gold) so all 13 are visible on the cream field instead of vanishing"
  - "demoCfg refs/terms are the EXACT object literals lifted from _MVP-BUILD/lessons/u1-m1.html via a byte-copy script (not retyped); RESEARCH and the source were diffed and agree byte-for-byte"
  - "§12 demos the REAL primitives wherever possible (live AW.sheet slide-in, engine popIn keyframe, .companion/.breathing-ring loops, AW.confetti, AW.animate) rather than preview mocks — §5's pv-* mocks stay as the Phase-1 token reference, superseded not deleted"
  - "The unit-switch handler in the closing IIFE was generalised to sync BOTH §2 and §9 controls; §1-8 section markup was left byte-untouched (only the script was refactored)"

patterns-established:
  - "Registry-driven preview grid: loop Object.keys(AW.KIT/GLYPHS), inject AW.icon(name) per cell — no hardcoded icon list, self-updates if the registry grows"
  - "Verbatim-content byte-copy: pull the author's exact object literals from the source file programmatically so scripture is never paraphrased through a retype"
  - "Mercy-law layout: celebration (confetti/PERFECT/combo) lives in a section strictly after the scripture block; a sed-range grep gate (/id=s10/,/id=s11/) enforces zero celebration adjacency"

requirements-completed: [FND-04, ENG-06, MOT-01, MOT-03, MOT-04]

# Metrics
duration: 25 min
completed: 2026-07-12
---

# Phase 3 Plan 04: Preview §9-12 — the Living Reference of the Real Engine Summary

**Extended preview.html from §1-8 to §1-12 loading the real classic engine script: §9 renders the branded 20-icon grid + 13 glyphs + the gold lantern glowing on its night register (a genuine brand moment, not an asset dump); §10 opens real citation sheets from byte-verbatim scripture (Quran `.ayah` / hadith grade pill / `aqeedah` gloss) with zero celebration adjacency; §11 proves one gummy press across the full real 8-class inventory; §12 labels the one motion vocabulary and proves BOTH reduced-motion paths quiet the confetti and stop the companion loop.**

## Performance

- **Duration:** 25 min
- **Started:** 2026-07-12T16:26Z
- **Completed:** 2026-07-12T16:51Z
- **Tasks:** 2
- **Files modified:** 1 (preview.html)

## Accomplishments
- Added the real engine include — page-relative, classic, no `defer`/`async`/`type="module"` — so §9-12 demo shipped `AW.*` output over `file://`.
- §9 (FND-04): all 20 `AW.KIT` scenes at scene-tile 56px in accent-tinted wells, the 13 `AW.GLYPHS` at 20px (check on green, chest/trophy on gold so every glyph is visible), and `lantern-gold` at scene-hero 128px on a dark night-register swatch that reads intentional and holds contrast. A §9-local unit switch (synced with §2) recolours the wells live.
- §10 (ENG-06): real `AW.cite` + `AW.wire` chips open the citation sheet for `hujurat-49-15` (Amiri Quran `.ayah`, no grade) and `muslim-8` (general Amiri + green `Sahih` grade pill), plus the `aqeedah` gloss; every citation carries the always-on `unverified · pending review` pill. Scripture is byte-verbatim from Josh's `u1-m1.html`, `˹true˺` brackets intact. Zero celebration in or beside the block.
- §11 (MOT-03): one coherent gummy `:active` across the full real inventory — `.btn`/`.opt`/`.tf`/`.tile`/`.cite`/`.tab`/`.hstat`/`.sheet-row` — with the hard `--accent-deep` offset, no `pv-gummy` mock.
- §12 (MOT-01/MOT-04): the one vocabulary labelled with its token pair per signature; the confetti burst + the PERFECT overlay driven by the `AW.animate` WAAPI exemplar (gold-gradient heading on `--overlay-hero`, scale-pop), spatially separate from §10; a `data-motion="reduce"` toggle + an OS-setting note proving both reduced-motion paths (confetti no-ops, companion bob/glow + breathing ring stop).

## Task Commits

Each task was committed atomically:

1. **Task 1: Engine include + §9 icon grid + §10 sheet demos (verbatim scripture)** — `cca6d9e` (feat)
2. **Task 2: §11 press inventory + §12 motion vocabulary + dual reduced-motion toggle** — `b32c3f1` (feat)

**Plan metadata:** _(this SUMMARY + STATE/ROADMAP/REQUIREMENTS — final docs commit)_

## Files Created/Modified
- `preview.html` — added the classic engine `<script>` include; four new sections (§9 icon grid, §10 sheet demos, §11 press inventory, §12 motion vocabulary + dual reduced-motion), their unlayered showcase CSS, and the closing-IIFE wiring (registry-loop icon fill, verbatim `demoCfg` + `AW.cite`/`AW.wire`, generalised unit switch, motion replays, confetti/PERFECT, `data-motion` toggle).
- `.planning/phases/03-components-icon-kit-motion-language/03-04-SUMMARY.md` — this summary.

## Decisions Made
- §9 recolour is proven via an accent-soft well behind each brand-locked icon (the icon art stays blue; the well carries unit identity) plus a §9-local unit switch synced with §2's.
- The three light-on-fill glyphs (check/chest/trophy) sit on their real contextual plate so all 13 render visibly on the cream field.
- `demoCfg` was assembled by byte-copying Josh's exact source object literals (diffed against RESEARCH — they agree byte-for-byte), never retyped.
- §12 demos the real primitives (live `AW.sheet`, engine `popIn` keyframe, `.companion`/`.breathing-ring` loops, `AW.confetti`, `AW.animate`) rather than mocks; §5's `pv-*` mocks remain as the Phase-1 token reference (superseded, not deleted).

## Deviations from Plan

None — plan executed exactly as written. All Task-1 and Task-2 acceptance gates passed on the first verification run (`PREVIEW_A_OK`, `PREVIEW_B_OK`), and the 37-test engine suite stayed green (no engine files were touched). No bugs, missing functionality, or blocking issues were encountered, so no deviation rules fired.

## Issues Encountered
- Headless-Chrome full-page `--screenshot` and `#fragment` navigation do not scroll to lower sections in `headless=new`; used the documented iframe-harness pattern (`contentDocument` + `scrollIntoView`, `--allow-file-access-from-files`) for the §9-12 visual self-checks — the truth-teller. Harness files were written to the repo root only transiently and removed before each commit (working tree stayed clean).

## Known Stubs
None — every new surface renders real `AW.*` engine output (20 scenes, 13 glyphs, gold lantern, two live citation sheets + a gloss, the full press inventory, and the motion/confetti/PERFECT primitives all populate from the engine at runtime, confirmed via headless DOM inspection: 20 scene tiles, 13 glyph cells, 2 wired cite chips, `Sahih` grade pill, `˹true˺` mean, confetti 24→0 under reduced motion, companion `bob`→`none`).

## User Setup Required
None — no external service configuration required. `preview.html` opens directly over `file://` (double-click), zero CDN, zero build.

## Next Phase Readiness
- 03-04 is the FLAGSHIP visual plan and the vehicle the D-44 human visual gate (03-05) now walks: §9 brand-moment grid, §10 premium sheets, §11 gummy-not-mushy press, §12 both reduced-motion paths — all render and behave as specified.
- Automated D-44 prechecks are green: engine include present/classic, §9-12 exist, verbatim markers (`hujurat-49-15`/`muslim-8`/`aqeedah`/`Sahih`/`˹true˺`) present, mercy isolation holds, zero CDN, 37/37 tests green.
- No blockers. The remaining gate is the irreducibly human visual walk in 03-05.

## Self-Check: PASSED

- FOUND: `preview.html`
- FOUND: `.planning/phases/03-components-icon-kit-motion-language/03-04-SUMMARY.md`
- FOUND commit: `cca6d9e` (Task 1)
- FOUND commit: `b32c3f1` (Task 2)

---
*Phase: 03-components-icon-kit-motion-language*
*Completed: 2026-07-12*
