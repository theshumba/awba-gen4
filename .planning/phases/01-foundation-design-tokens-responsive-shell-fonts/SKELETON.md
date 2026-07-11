# Walking Skeleton — Awba Gen-4

**Phase:** 1
**Generated:** 2026-07-12

## Capability Proven End-to-End

> One sentence: the smallest user-visible capability that exercises the full stack.

A reviewer opens `preview.html` directly over `file://` and sees the entire design foundation render at world-class quality — the one-layer token sheet, a true responsive shell (full-bleed on phone, centered column on desktop), live per-unit theming that fully recolors on a `data-unit` switch, and self-hosted subset fonts rendering every Arabic/Quranic/transliteration glyph — with **zero** Google Fonts CDN requests and the `check-glyph-coverage.py` gate green.

**Why this is the honest "walking skeleton" for this project shape:** Awba Gen-4 is a zero-build static site. There is no server, DB, or auth to skeletonize. The equivalent "thinnest end-to-end stack" is the static-asset → stylesheet → rendered-page chain: subset fonts (the data/asset layer) → `shared/awba-engine.css` (the style engine, `@layer tokens, base`) → `preview.html` (the rendered, reviewable-by-`file://`, deployable-as-static-files surface). Every later phase links this exact stylesheet and inherits these exact shell classes and tokens.

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Runtime stack | Vanilla HTML/CSS/JS, zero build, no framework/bundler | Hard constraint (CLAUDE.md / FND-07); Josh reviews by opening files over `file://` |
| Script loading | Classic `<script src>` only — never `type="module"` | ES modules fail over `file://` in Chrome/Firefox (CORS) — deferred to Phase 2 when the engine lands |
| Style architecture | ONE stylesheet `shared/awba-engine.css`, `@layer tokens, base, components, screens, motion` — full order declared once in Phase 1 | CSS cascade-layer priority is fixed by first-occurrence; declaring the full 5-name order now makes it immutable for every later phase (01-RESEARCH Pattern 1 / Pitfall 3) |
| Token model | Semantic tokens (`--accent`, `--accent-deep`, …) + per-unit full 7-slot scale via `[data-unit="u1..u4"]` on `<html>`; no shared `--blue2`/`--blue3` | Structurally kills Gen-3's half-themed-page bug (FND-02 / D-05, D-06); JS later reads unit colors FROM these custom properties (D-07), CSS is the single source of truth |
| Responsive shell | `min-height:100dvh` grid `auto 1fr auto` on ONE `.app-shell`; mobile = undecorated full-bleed default, `@media (min-width:600px)` adds the centered ≤480px column | Kills the fixed `380×788` phone card (PLT-01 / D-01, D-02); native `dvh` (Baseline June 2025) — no JS viewport polyfill |
| Fonts | 4 families self-hosted as subset `.woff2` (Poppins, Inter, Amiri, Amiri Quran); acquired from `fonts.gstatic.com` once, subset with `pyftsubset`, committed | Zero-CDN offline-capable promise (FND-03 / D-09); Amiri Quran reserved for `.ayah` verbatim Qur'an only |
| Deployment target | Pure static files (GitHub Pages / Vercel), zero build step; `file://`-openable | CLAUDE.md constraint; full PWA/service-worker deferred to Phase 7 (PLT-02) |
| Directory layout | `shared/awba-engine.css`, `shared/fonts/*.woff2` (raw TTFs in `shared/fonts/src/`, gitignored), `scripts/check-glyph-coverage.py`, `preview.html` at repo root | 01-RESEARCH Recommended Project Structure |

## Stack Touched in Phase 1

- [x] Project scaffold — `shared/`, `shared/fonts/`, `scripts/` dirs, `.gitignore`, glyph-coverage check script (Plan 01)
- [x] "Data layer" — self-hosted subset font assets (the static-asset equivalent of a DB read/write), integrity-verified by `check-glyph-coverage.py` (Plan 01)
- [x] Style engine — `shared/awba-engine.css` `@layer tokens, base` (Plan 02)
- [x] UI wired to assets — `preview.html` links the stylesheet, preloads fonts, and runs a live `data-unit` switch (interactive element) that recolors the sample cluster (Plan 03)
- [x] Deployment — runs as static files over `file://` (no server needed for Phase 1); service-worker/install deferred to Phase 7

## Out of Scope (Deferred to Later Slices)

> Explicit, so future phases do not re-litigate Phase 1's minimalism.

- Engine logic, `AwbaLesson`/`AwbaReview`, state layer, validator — **Phase 2** (FND-05/06/07, ENG-07)
- The 20-SVG icon registry, citation/gloss sheets, the `components` + `motion` layers filled in — **Phase 3** (FND-04, ENG-06, MOT-01/03/04). Phase 1 declares the empty `components`/`screens`/`motion` layers and the motion *tokens*, but ships no component or motion behavior beyond `preview.html` demos.
- Lesson/review content, reward choreography — **Phase 4**
- Learn page, node path, view transitions — **Phase 5**
- Full keyboard/aria/contrast + RTL/typography stress-test at app scale — **Phase 6** (Phase 1 lays the `:focus-visible` + accessible-name + Arabic-law foundation only)
- PWA manifest, service worker, offline, README, regression gate — **Phase 7** (PLT-02..05)
- Automated visual/contrast re-verification — the ONE automated check this phase supports is `check-glyph-coverage.py`; all layout/recolor/render criteria are verified via `preview.html`'s manual D-12 checklist (expected for a token/shell phase, not a coverage gap)

## Subsequent Slice Plan

Each later phase adds one vertical slice on top of this skeleton **without altering** its architectural decisions (one stylesheet, `@layer` order, `[data-unit]` theming, classic scripts, self-hosted fonts, static deploy):

- Phase 2: State layer + frozen engine contract + validator (fills the `screens` layer's data contract, DOM-independent)
- Phase 3: Shared components, icon registry, motion language (fills `components` + `motion` layers, consumes Phase 1 tokens)
- Phase 4: All 19 lesson/review files render verbatim through the engine, with reward detail layer
- Phase 5: Learn page + winding node path + cross-page view transitions
- Phase 6: Accessibility / RTL / typography hardening across every screen
- Phase 7: PWA shell, offline, static deploy, Gen-3 regression ship-gate
