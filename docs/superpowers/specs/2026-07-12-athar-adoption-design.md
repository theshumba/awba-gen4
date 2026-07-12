# Awba Gen-4 — Pure Athar Adoption (Gate 2 Lock)

_Date: 2026-07-12 · Status: **APPROVED by Melusi** ("pure Athar — forget all the old stuff") · Design contract: `.planning/ATHAR-SYSTEM.md` (copied verbatim from the locked `_STAGE3-UNIFIED-SYSTEM.md`)_

## Decision

Gen-4's visual identity is **replaced wholesale** by the Athar System (five registers, one app). Josh's Gen-3 look is retired as design authority for this repo. The full system — tokens + five registers + the Ring generator + the prayer-clock sky — lands **before Phase 4** (the lesson port), so lessons pour into the finished world.

This supersedes the "Design authority: Josh's Gen-3 direction" constraint in CLAUDE.md and the pending D-44 gate/checklist. Melusi owns this call; Josh's content (lessons, scripture, data-file shape) remains untouchable — his *look* is what's replaced.

## What survives — the invisible machine (unchanged)

- All 15 lessons + 4 reviews ported **verbatim** from `_MVP-BUILD/`; sensitive-atom holds; pending-review tags; scripture laws (never regenerated).
- `AwbaLesson(cfg)` / `AwbaReview(cfg)` data-file contract; `scripts/validate-content.js` contract freeze.
- State layer (`AW.S`, `awba_prefs`, migration), all 37 tests, `node --test scripts/tests/*.test.js`.
- Zero-build / zero-CDN / classic scripts / works from `file://` double-click; relative font URLs (never leading slash).
- Cascade architecture: `@layer tokens, base, components, screens, motion` declared once, order immutable; motion-layer reduced-motion supremacy; dual reduced-motion triggers (OS + `data-motion="reduce"`).
- A11y laws: `:focus-visible` everywhere, 44px targets, WCAG AA at real sizes; Arabic/RTL laws (letter-spacing 0, isolation, lh ≥1.8 → Athar tightens ayah lh to 1.9 and size to ≥1.35–1.5× Latin).
- Aniconism (already true) and "never red for learner error" (recoloured: amber retires; Athar law 8 = grey ink-blot + Rose Ember retry frame).

## What dies — the old look (all of it)

- The 4 unit accent scales (blue/purple/teal/gold `data-unit` colour theming). Units keep their *structure* and icons; their colour identity is gone. State colour everywhere = the thermal ramp (Powder Veil → Farag Ember → Hajar Gold, always shape-cued).
- Gummy press physics (5px hard-shadow drop), indigo shadows, cream-blue palette, `--overlay-hero` indigo.
- Poppins + Inter as design faces. (Inter *may* remain invisibly as a glyph-fallback for ˹ ˺ / ḥ-class diacritics **iff** Readex Pro lacks them — coverage check decides; it is never a design voice again.)
- Confetti, the PERFECT indigo overlay, the combo-chip styling, the companion bob/glow ambient (no mascot; the lantern survives only as a scene icon where content references it).
- The old `preview.html` §1–12 as gate material; the D-44 10-item checklist. Nobody walks it.

## What replaces it — the Athar System

`.planning/ATHAR-SYSTEM.md` is the design contract; `03-UI-SPEC-ATHAR.md` (Opus-authored) is its executable translation. Summary:

- **Five registers, one per screen** (law 1): Orbit (kiswah-black home/Ring/celebrations) · Page (haram-cream lessons/quizzes/Nightfall) · Sky (canvas follows the real prayer clock; Last-Third violet) · Circle (thermal state tokens + crowd moments) · Festival (thresholds only: 4 circuit plates, completion poster, Eid dressing).
- **Type:** Readex Pro = sole workhorse (both scripts) · Amiri = scripture (keeping **Amiri Quran** face for verbatim ayat — same family, purpose-built; hadith/du'a in general Amiri) · Marcellus, Aref Ruqaa, Courier Prime, Rakkas rationed per law 5.
- **17 colour tokens, register-scoped** (≤6 on any daily screen); Mihrab Crimson accent ≤10%; one grain tile over every ground.
- **Motion:** one easing family `cubic-bezier(0.23, 1, 0.32, 1)`, UI ≤300ms, ambient 4–6s; one verb per register (draw/settle/breathe/drift/stamp); reduced-motion gates all.
- **Implementation shape:** registers as scoped classes (`.reg-orbit`, `.reg-page`, `.reg-sky-night`, `.reg-festival`); thermal states as `data-state` attrs. The `data-unit` mechanism is repurposed: it keeps mapping unit → icon/term, never → colour scale. The "no half-themed page" guarantee transfers to register scoping.

## Two flagship features (built in re-cut Phase 3, before Phase 4)

1. **Ring generator** — the tawaf-fingerprint: seeded, deterministic SVG (jittered concentric pilgrim-rows, variable stroke, ink-bleed), progress inked per completed atom/lesson. Named single point of failure → it is the **first spike**. Reduced-motion renders the final state statically.
2. **Prayer-clock sky** — 5 canvas temperatures keyed to real prayer times (location-aware **or manually set**; manual is the v1 floor — no geolocation dependency). Course progress adds one degree of `--dawn` horizon warmth; the sky is ambient, never the metric.

## Build impact

- **Phase 3 is re-cut, not reverted.** Committed work 03-01..03-04 stands in git; the JS layer (AW.icon/cite/wire/sheet/reducedMotion/animate, tests) survives largely intact — it is skin-agnostic. New plans (03-06+) re-skin on top: fonts → token sheet rewrite in `awba-engine.css` → component re-skin → icon re-inking → new Athar `preview.html` → Ring spike → Sky spike → **new human visual gate** (fresh checklist, plain language).
- 03-05 (old gate) is marked superseded in `.planning` state.
- Phases 4–7 proceed as roadmapped, inheriting Athar. Sound-cue owner decision unchanged.
- **Orchestration:** Fable orchestrates; Opus = UI-SPEC authoring, Ring/Sky/flagship visual plans; Sonnet = font vendoring/subsetting, grain tile, mechanical execution; GSD planner/executor/verifier chain as established (sequential executors on the main tree).

## Risks & mitigations

- **Ring generator is the SPOF** → first spike, judged on visual output before anything depends on it.
- **Arabic subsetting** (Readex Pro/Aref Ruqaa/Rakkas): must keep joining forms + full tashkeel; existing `check-glyph-coverage.py` gates it.
- **˹ ˺ + ḥ-diacritic coverage** in Readex Pro unknown → coverage check; Inter retained as silent glyph-fallback only if needed.
- **Grain everywhere** must stay one tiled PNG (no runtime SVG turbulence) — perf law from the contract.
- **Contrast on kiswah black / haram cream** — every token pairing WCAG-AA-checked at real sizes in the UI-SPEC, as Phase 1 did.
