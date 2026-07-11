# Phase 1 Discussion Log — auto mode

**Mode:** `--auto` (owner directive: build autonomously; recommended option selected per question, no interactive prompts)
**Date:** 2026-07-11

[--auto] Selected all gray areas: Desktop presentation, Unit theming mechanism, Token file architecture, Font subsetting & loading, Verification vehicle.

## Auto-selected decisions

[auto] Desktop presentation — Q: "How should the app present on desktop: centered column, fake phone bezel, or fluid desktop layout?" → Selected: "Intentional centered column (~460–480px) on a designed calm backdrop, indigo-tinted elevation, no bezel, no fixed height" (recommended: matches success criterion wording, keeps phone-first design integrity without the Gen-3 mockup feel)

[auto] Unit theming mechanism — Q: "Fix blue2/blue3 overrides, or move to semantic accent tokens?" → Selected: "Semantic accent scale per unit via data-unit attribute; full hand-tuned scale per unit; JS reads colors from CSS custom properties" (recommended: kills the half-theming bug structurally, single source of truth)

[auto] Token file architecture — Q: "Multiple CSS files per layer, or one engine stylesheet with @layer sections?" → Selected: "One shared/awba-engine.css with @layer tokens, base, components, screens, motion" (recommended by ARCHITECTURE.md: single link per page, zero-build, Josh's mental model)

[auto] Font subsetting & loading — Q: "Google Fonts CDN, full self-hosted families, or self-hosted subsets?" → Selected: "Self-hosted subset .woff2 ×4 families (incl. Amiri Quran for ayah), font-display swap + preload, glyph coverage verified for transliteration diacritics, Clear Quran brackets, ﷺ" (recommended: FND-03 requires it; offline PWA later depends on it)

[auto] Verification vehicle — Q: "How do we verify Phase 1 without the engine existing yet?" → Selected: "preview.html token/shell/glyph showcase page, kept permanently as the living style reference" (recommended: makes all 4 success criteria observably checkable)

## Notes
- No SPEC.md, no checkpoints, no matching todos (todo_count 0).
- No prior CONTEXT.md files (first phase).
- Scope creep: none encountered.
