---
gsd_state_version: 1.0
milestone: v1.5
milestone_name: milestone
status: executing
stopped_at: Completed 03-08-PLAN.md (icon re-ink to currentColor + --icon-accent, lantern-gold deleted); next 03-09 (components re-skin)
last_updated: "2026-07-12T21:34:43.000Z"
last_activity: 2026-07-12
progress:
  total_phases: 7
  completed_phases: 2
  total_plans: 18
  completed_plans: 13
  percent: 29
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-07-11)

**Core value:** A learner opens the app, walks a beautiful winding path through the full Aqeedah course, and every screen feels world-class while every word of scripture stays verbatim, sourced, and scholar-gated.
**Current focus:** Phase 03 — Components, Icon Kit & Motion Language

## Current Position

Phase: 03 (Components, Icon Kit & Motion Language) — **RE-CUT UNDER ATHAR (Gate 2 locked 2026-07-12)**

- Design authority CHANGED: pure Athar System (`.planning/ATHAR-SYSTEM.md` + `docs/superpowers/specs/2026-07-12-athar-adoption-design.md`, commit cbdb7e9). Josh's Gen-3 look retired; content/engine contract untouched.
- Plans 03-01..03-04: complete and committed (their JS layer survives; their visual values are superseded).
- Plan 03-05 (old D-44 gate): **SUPERSEDED — never walk its checklist.**
- New design contract: `03-UI-SPEC-ATHAR.md` (supersedes 03-UI-SPEC.md). Athar font kit + grain vendored (b66b75a).
- **Plan 03-06 (tokens + base re-ground): COMPLETE 2026-07-12** — `@layer tokens` is the Athar sheet (Readex workhorse, 17 verbatim-hex colours + ink ramps, print radii, ink/edge depth, grain var, one-easing motion) and `@layer base` is the register architecture (four `.reg-*` grounds, `data-sky` tint, `data-state` map, ground focus, scripture law, Nightfall); `data-unit`/`--accent` colour theming dismantled CSS-side. Commits `2cf8ecd`, `15a2b48`. 37/37 tests green. `@layer components`/`@layer motion` keep retired token refs (accepted transient — plan 09 removes; whole-file `--accent`/`rgba(37,54,` closure gated at plan 12).
- **Plan 03-07 (Ring generator SPOF): COMPLETE 2026-07-12** — `AW.ringSVG(cfg)` is a seeded (mulberry32) DETERMINISTIC tawaf-fingerprint generator (15 jittered pilgrim-rows / 4 circuits, thermal ink navy→ember→cream→gold, 4-arc gold thread closing at 4, static gold head-dot; byte-identical per seed+progress, no Date/Math.random in path; reduced-motion static; 265 path nodes, no `<filter>`). Paired with a lazy `AW.ringSeed()` maker's mark (no schema bump) + a ≤10-line W1 `memFallback` persist-guard (future-schema blob no longer clobbered by `set()`), and the `ink-draw` Orbit-draw keyframe + `.ring` wrapper added additively to `@layer motion`. Commits `c943437`, `63e64c3`, `e219c90`, `c6eab7a`. Suite 37→45 green. Rasterised + visually confirmed it READS as a hand-inked tawaf (not a spirograph); doubts logged in 03-07-SUMMARY for the preview/human gate.
- **Plan 03-08 (icon re-inking): COMPLETE 2026-07-12** — `AW.KIT` (20 scenes) + `AW.GLYPHS` (13) re-inked to the Athar one-colour model per the deterministic §5.1/§5 maps: structural ink → `currentColor` (inherits the register ground), blob halos → `currentColor`@.12, lit panels → `.06` ink-wash or `fill="none"` (chosen per-icon by whether the quiet ink-line read survives — wash for focal ground surfaces like quran-stand pages + the calendar card, none for panels on solid ink bodies), kaaba/compass/dates dimensional blues → `currentColor`@.85/.62/.45, and the single sparkle/star mark → `var(--icon-accent)` (35 marks; scattered structural dots stay currentColor to hold the accent budget). `AW.KIT['lantern-gold']` DELETED (D-A6) — the one lantern renders gold on dark grounds automatically (rasterised + confirmed cream→crimson / dark→gold). Every `d="…"` byte-identical (proven vs HEAD), no runtime `.replace()` recolour; `AW.icon`/`AW.UNIT_ICON` untouched. Commits `5fcf52b`, `bc6057c`. `components.test.js` registry integrity → 20/13 (lantern-gold assertion dropped). Whole-file retired-blue-hex gate now closes for `shared/awba-engine.js`. Suite green 45/45.
- NEXT: 03-09 components re-skin + motion vocab rewrite (owns the retired-token cleanup) → 03-10 Sky → 03-11 new preview (injects `AW.ringSVG` + the re-inked registry) → 03-12 closure/human gate. Icons + Ring done; prayer-clock sky still lands in Phase 3, before Phase 4.

Status: Executing re-cut waves — 03-08 (icons) done, next 03-09 (components re-skin)
Last activity: 2026-07-12

Progress: [███████░░░] 72%

## Performance Metrics

**Velocity:**

- Total plans completed: 3
- Average duration: — min
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 02 | 2 | - | - |

**Recent Trend:**

- Last 5 plans: —
- Trend: —

*Updated after each plan completion*
| Phase 01 P01 | 20 min | 2 tasks | 13 files |
| Phase 01 P02 | 2 | 2 tasks | 1 files |
| Phase 01 P03 | 10 | 2 tasks | 1 files |
| Phase 02 P01 | 15min | 3 tasks | 4 files |
| Phase 02 P02 | 7min | 2 tasks | 5 files |
| Phase 03-components-icon-kit-motion-language P02 | ~18min | 2 tasks | 1 files |
| Phase 03 P04 | 25min | 2 tasks | 1 files |
| Phase 03 P06 | 14 min | 2 tasks | 1 files |
| Phase 03 P07 | ~17 min | 3 tasks | 3 files |
| Phase 03 P08 | ~15 min | 2 tasks | 2 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Roadmap: 7 phases derived from research build order (irreversible/high-blast-radius decisions first — responsive shell in Phase 1, engine/state contract freeze in Phase 2).
- Roadmap: `AwbaLesson`/`AwbaReview` cfg contract + validator (ENG-07) is frozen in Phase 2, BEFORE the 19 content files are ported in Phase 4.
- Roadmap: Content is ported verbatim from Josh's redacted Gen-3 output — never regenerated from atoms (protects scholar holds).
- Roadmap: PWA/service worker last (Phase 7) — precache paths depend on stable assets from all prior phases.
- [Phase 01]: Corrected check-glyph-coverage.py's poppins-600.woff2 REQUIRED codepoint list after direct TTF cmap inspection proved RESEARCH.md's Google Fonts API glyph-existence check was a false positive for U+02F9/U+02FA/U+1E25 — Poppins genuinely lacks these glyphs in every weight; Inter has full coverage and the CSS font-family fallback stack handles the rare cases
- [Phase 01]: Static per-weight Inter files (4x) used instead of Inter Variable font — Keeps the subsetting command shape identical across all four font families since Poppins/Amiri/Amiri Quran are static-only regardless
- [Phase ?]: [Phase 01-02] --font-disp lists Inter immediately after Poppins (Wave-1 verified Poppins glyph gap for U+02F9/02FA + h-class diacritics), so those glyphs fall through to Inter not a system face.
- [Phase ?]: [Phase 01-02] Shell region rows namespaced .app-hud/.app-stage/.app-foot so Phase-3 HUD chrome component classes stay unambiguous; safe-area insets applied at the base layer.
- [Phase ?]: [Phase 01-02] Night/legendary focus ring switches to --gold2 via a forward-looking [data-register=night] hook (Phase 3/4 sets the attribute) since the calm-field --accent ring loses contrast on the dark gradient.
- [Phase ?]: [Phase 01-03] preview.html showcase chrome is an UNLAYERED <style> block that overrides the engine's >=600px body{display:flex} centering (unlayered beats @layer base) so the long reference doc isn't hijacked into a centered column — while section 6's real .app-shell still adapts full-bleed<->column on viewport resize.
- [Phase ?]: [Phase 01-03] All four unit accent scales render simultaneously by scoping each column with its own [data-unit] container (CSS custom-property re-scoping), so var(--accent) resolves per-column with zero JS and zero raw hex in swatch markup.
- [Phase ?]: [Phase 01-03] Glyph test proves the documented Poppins->Inter fallback by rendering brackets ˹˺ inside a Poppins Clear-Quran string; ﷺ rendered defensively in Amiri + Amiri Quran; tofu FAIL cell uses amber (mercy law: never red).
- [Phase 02-01]: AW.deriveNodeState(nodesFlat, progress) returns [{id, state}] for the whole flat array (matching its 2-arg signature, no index param) rather than a single-node lookup — DOM-free, one-read-per-pass, real-map wiring deferred to Phase 5 (CNT-03)
- [Phase 02-01]: Chest-key legacy migration enumerates via localStorage.length/key(i) instead of Object.keys(localStorage) — Object.keys only works on real browser Storage instances, not a plain-object test stub, so this fix is portable to both
- [Phase 02-01]: node --test <directory> throws MODULE_NOT_FOUND on this Node v24.13.0 build (reproduced in an isolated scratch dir, not repo-specific); use node --test scripts/tests/*.test.js (glob) or explicit file paths for all future Phase 2+ test runs
- [Phase 02-02]: Validator error-message wording co-designed with the self-test so assertions target exact substrings (mc.c=9, missing-ref-id, unknown beat type bogus) — Keeps the contract's failure surface precisely specified rather than fails-somehow
- [Phase 02-02]: checkBeats() returns immediately after an unknown-beat-type error, skipping further per-type checks for that beat — Beat shape is undefined by the contract once t is unknown; keeps broken-lesson.html error count exactly 3 with no cascading noise
- [Phase 02-02]: tile.solution validated via array-membership subset check only, no bank-order requirement — Matches D-27 corrected reading (subset of bank, not length-equal); real content's distractor-bearing tiles pass cleanly
- [Phase 02-02]: Default CLI file discovery for lessons/*.html and reviews/*.html tolerates missing directories via try/catch — Those directories do not exist until Phase 4; validator degrades to nothing-to-validate exit 0 instead of crashing
- [Phase ?]: 03-02: lantern-gold is an authored, committed AW.KIT entry hand-recoloured against the dark .gold-bg night gradient (dark-field highlights lifted to --gold2 #FFD34D), never a runtime regex recolour (D-33)
- [Phase ?]: 03-02: 20 scene icons + lantern-gold + 13 glyphs form ONE inline single-source registry (AW.KIT/AW.GLYPHS/AW.UNIT_ICON); per-page UIC/IC_* constants superseded (FND-04)
- [Phase 03]: 03-06: dismantled data-unit/--accent colour theming CSS-side; AW.UNIT_ICON JS untouched so data-unit survives as the unit-to-icon key only
- [Phase 03]: 03-06: @layer components/motion keep retired token references as the accepted transient (plan 09 removes them; whole-file closure gated at plan 12)
- [Phase 03]: 03-07: AW.ringSeed() is a lazy accessor (mint-once into awba_state.ringSeed via AW.S), NOT a schemaVersion bump — keeps defaultState byte-unchanged and CR-01/WR-01 blob-survival tests green (plan CONTRACT NOTE)
- [Phase 03]: 03-07: ringSVG geometry is a pure fn of seed and progress-INDEPENDENT; progress only recolours dabs + toggles the draw animation — the ring is a stable fingerprint that inks in place
- [Phase 03]: 03-07: the draw (ink-draw) animation attaches ONLY to the in-progress frontier row's ember dabs — the deterministic proxy for "newly inked" so the established ring never re-draws (law 9) without a previous-state input
- [Phase 03]: 03-07: W1 gap closed with a ≤10-line memFallback guard (set() skips persist when working from an unrecognized-schema in-memory copy); proved with a test that a from-the-future blob survives a ringSeed() call untouched on disk
- [Phase 03]: 03-08: icons re-inked to the ONE currentColor + --icon-accent model via an authored scripted fill/stroke/opacity transform (no runtime .replace() recolour); every d="…" byte-identical, proven by diffing the unique d= set vs HEAD (111 values, zero added/removed)
- [Phase 03]: 03-08: sparkle-accent by PATH signature only (the three decorative sparkle/star shapes → var(--icon-accent), 35 marks); scattered structural <circle r=3> dots stay currentColor to keep the ≤10% accent budget (law 7) and not mis-accent beads/compass cardinal dots
- [Phase 03]: 03-08: lit-panel wash-vs-none is the only craft choice — .06 ink-wash for focal surfaces on the ground (quran-stand pages, calendar card), fill="none" for panels on solid ink bodies (windows/faces/doors/inner-disc, imperceptible either way); off-map hexes reconciled to their §5.1 family (#FFFFFF=panel, compass facets=dimensional blue, #DCE6FB kaaba shadow→none since Athar has no drop shadows)
- [Phase 03]: 03-08: AW.KIT['lantern-gold'] DELETED (D-A6) — currentColor renders the one lantern gold on dark grounds automatically (rasterised + confirmed); last hex-literal art variant gone; KIT===20; whole-file retired-blue-hex gate now closes for shared/awba-engine.js (CSS --accent/rgba(37,54, closure still at plan 12)

### Pending Todos

None yet.

### Blockers/Concerns

Carried from research (owner-level, not build-blocking):

- iOS Safari 7-day idle storage eviction threatens the "un-loseable" promise for un-installed users — mitigation (install nudge) lands Phase 7 (PLT-03); flagged as a known v1 limitation for owner decision.
- Clear Quran commercial licensing (text pulled from quranapi.pages.dev) — owner-level item for Josh + Melusi; not build-blocking (verbatim text embedded at authoring time, no live API).
- Font glyph coverage (diacritics + `˹˺` brackets in Poppins/Inter/Amiri) flagged LOW-MEDIUM — needs a real rendering stress-test (Phase 1 glyph test / Phase 6 hardening), not an assumption.
- Sound cue sourcing (calm, dignified, non-arcade cue set) is an open creative decision to resolve before Phase 4 sound wiring.

## Deferred Items

Items acknowledged and carried forward:

| Category | Item | Status | Deferred At |
|----------|------|--------|-------------|
| Motion | V2-01 chest anticipation, V2-04 shared-element morphs, V2-06 legendary gold shimmer | Deferred to v2 | Roadmap (2026-07-11) |
| Companion | V2-02 companion reaction states | Deferred to v2 | Roadmap (2026-07-11) |
| Returns | V2-03 returns-as-heatmap presence view | Deferred to v2 | Roadmap (2026-07-11) |
| Content | V2-05 tap-to-hear ayah recitation (licensed audio) | Deferred to v2 | Roadmap (2026-07-11) |
| Surfaces | V2-07 practice hub / profile / quests | Deferred to v2 (coming-soon states only) | Roadmap (2026-07-11) |

## Session Continuity

Last session: 2026-07-12T21:34:43Z
Stopped at: Completed 03-08-PLAN.md (icon re-ink to currentColor + --icon-accent, lantern-gold deleted, suite 45/45); next 03-09 (components re-skin)
Resume file: None
