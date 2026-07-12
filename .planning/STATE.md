---
gsd_state_version: 1.0
milestone: v1.5
milestone_name: milestone
status: executing
stopped_at: "Phase 3 RE-CUT under Athar: 03-01..04 done, 03-05 SUPERSEDED, planning 03-06+ from 03-UI-SPEC-ATHAR.md"
last_updated: "2026-07-12T15:52:39.300Z"
last_activity: 2026-07-12
progress:
  total_phases: 7
  completed_phases: 2
  total_plans: 18
  completed_plans: 10
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
- NEXT: plan + execute re-skin waves 03-06+ (tokens rewrite → components/icons → new preview → Ring spike → Sky spike → NEW human gate). Ring + prayer-clock sky land in Phase 3, before Phase 4.
Status: Planning re-cut waves
Last activity: 2026-07-12

Progress: [█████████░] 91%

## Performance Metrics

**Velocity:**

- Total plans completed: 2
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

Last session: 2026-07-12T15:52:23.461Z
Stopped at: Phase 3 executing: plan 03-01 complete (1/5), next 03-02 KIT
Resume file: None
