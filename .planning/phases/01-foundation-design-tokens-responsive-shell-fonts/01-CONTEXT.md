# Phase 1: Foundation — Design Tokens, Responsive Shell & Fonts - Context

**Gathered:** 2026-07-11 (auto mode — owner directive: proceed autonomously; recommended options selected, logged in 01-DISCUSSION-LOG.md)
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver the visual/structural foundation everything else builds on: one CSS `@layer` token source (colors, type, radii, shadows, motion), a true full-viewport responsive shell (kills Gen-3's fixed 380×788 card), full per-unit theming (primary AND secondary accents), and self-hosted subset fonts (Poppins, Inter, Amiri, Amiri Quran) with a passing glyph test. No engine logic, no content, no Learn page — those are later phases. A token/shell preview page is the verification vehicle.

</domain>

<decisions>
## Implementation Decisions

### Shell & responsive strategy
- **D-01:** Phone-first, full-bleed: the app shell fills `100dvh` edge-to-edge on mobile, grid rows HUD / stage / footer, `env(safe-area-inset-*)` honored, `overscroll-behavior` contained. No `.phone` card on mobile — the app IS the page.
- **D-02:** Desktop presentation = **intentional centered column** (max-width ≈ 460–480px content column, full-height), elevated on a designed calm backdrop (cream `#EEF2FB` with a very subtle brand wash / soft radial), carrying the indigo-tinted shadow language. NO fake phone bezel, no fixed height — the column breathes with the viewport. A reviewer resizing the window sees graceful adaptation at every width.
- **D-03:** Fluid type: base sizes move to `rem` + `clamp()` where it matters (display sizes, hero numerals); body stays comfortably readable at 320px width without overflow.

### Token architecture
- **D-04:** ONE stylesheet (`shared/awba-engine.css`) containing `@layer tokens, base, components, screens, motion` — Phase 1 writes the `tokens` + `base` (shell) layers; later phases fill the rest. Single `<link>` per page (Josh's mental model, zero build step).
- **D-05:** Tokens are semantic, not literal: components consume `--accent`, `--accent-deep`, `--accent-soft`, `--accent-line`, `--accent-ink` etc. — never `--blue2` directly. Gen-3's palette values (from ENGINE-CONTRACT.md §4) are the starting values; refine shades for contrast but keep the recognizable Gen-3 look (cream field, blue primary, amber mercy, gold legendary, flame streak).
- **D-06:** Unit theming via `data-unit="u1|u2|u3|u4"` on `<html>`: each unit defines its FULL accent scale explicitly in the tokens layer (accent, deep, soft/tint, line — hand-tuned per unit, `color-mix()` allowed for tints but deep shades hand-picked for contrast). This kills the half-themed-page bug structurally: there is no fixed `blue2`/`blue3` for screens to accidentally use.
- **D-07:** Back-compat: the engine (Phase 2+) maps `cfg.unitColor` hex → known unit theme (`#2E6BF5`→u1, `#7C5CE0`→u2, `#0FA3A3`→u3, gold hexes→u4); unknown hex falls back to setting `--accent` directly. JS reads unit colors FROM the CSS custom properties (getComputedStyle) — CSS is the single source of truth; the learn page's JS color array duplication dies here.
- **D-08:** Motion tokens defined now (durations + `linear()` spring easings + standard eases) even though the motion layer lands in Phase 3 — so Phase 3 has a vocabulary to consume, not invent.

### Fonts
- **D-09:** Four families self-hosted in `shared/fonts/` as subset `.woff2`: Poppins (display/headings/buttons/numerals), Inter (body/UI), Amiri (general Arabic: hadith, terms, du'a), **Amiri Quran (ayah text only — the `.ayah` class binds to it)**. All OFL-licensed, downloaded from Google Fonts sources and subset locally (pyftsubset). No CDN requests at runtime.
- **D-10:** Subsets MUST include: Latin + Latin Extended Additional (U+1E00–1EFF — ʿ ā ī ū ṣ ḥ ḍ ṭ etc. for transliteration) in Poppins/Inter; the Clear Quran corner brackets ˹ ˺ (verify actual codepoints from Josh's lesson files — likely U+2E32-area or U+02F9/02FA; extract the real chars from source before subsetting) in Inter (body carries translations); Arabic + Arabic Presentation Forms + ﷺ (U+FDFA) in Amiri/Amiri Quran. The preview page carries a permanent glyph test block rendering all of these in every face.
- **D-11:** Loading: `font-display: swap` + `<link rel="preload">` for the 2 critical faces per page + identical font URLs on every page so the browser cache eliminates FOUC from the second page on; system-font fallback stacks metric-tuned so first-paint swap is gentle.

### Verification vehicle
- **D-12:** `preview.html` at repo root: renders the full token sheet (color chips incl. all 4 unit themes side by side, type scale, radii/shadows, motion easing demos), the responsive shell skeleton (HUD/stage/footer with placeholder content), and the glyph test. This page is how Phase 1's success criteria get checked (resize test, unit-switch test, network-tab zero-CDN test, glyph render test) and stays in the repo as the living style reference for Josh.

### Claude's Discretion
- Exact refined shade values, shadow softness, backdrop wash treatment on desktop, clamp() breakpoints, fallback stack metrics — designer's judgment within the Gen-3 look and the frontend-design skill's craft bar. Load the `frontend-design` skill during execution of any visual plan.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Contract & gaps (why this phase exists)
- `.planning/research/ENGINE-CONTRACT.md` — §4 Gen-3 token values (palette source of truth), §6 quality gaps (fixed-card, half-theming, font gaps are Phase-1-owned)
- `.planning/research/ASSETS.md` — canon note (Gen-3 is design authority), v3 token set (reference only), Arabic typography laws that bind

### Research
- `.planning/research/STACK.md` — modern CSS capabilities, `linear()` easing, font strategy, what NOT to use
- `.planning/research/ARCHITECTURE.md` — one-CSS-file/@layer decision, classic-scripts constraint, file layout
- `.planning/research/PITFALLS.md` — fixed-phone-card pitfall, FOUC/Arabic font flash, iOS viewport quirks (dvh, overscroll, tap-highlight)
- `.planning/research/SUMMARY.md` — synthesis + phase flags

### Source material (Josh's Gen-3 — the design authority)
- `/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD/shared/awba-engine.css` — Gen-3's actual CSS (palette, gummy buttons, radii — the look being elevated)
- `/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD/learn.html` — Gen-3 shell structure reference
- `/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD/lessons/u1-m1.html` — a real lesson data file (extract the actual ˹ ˺ bracket codepoints from its refs for the subset)
- `/Users/theshumba/Downloads/AWBA APP/_ORGANIZED/03_Branding/icon files/` — 20 canonical SVGs (Phase 3 consumes; Phase 1 should not inline them yet)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Greenfield repo (only `.planning/` + CLAUDE.md exist). The reference implementation lives in Josh's `_MVP-BUILD/` folder — its CSS is the palette/feel source, not code to copy wholesale.
- Gen-3 `awba-engine.css` (326 lines): cream/blue/amber/gold palette, gummy button physics, radii language — port the VALUES into the token layer, rebuild the structure.

### Established Patterns
- Zero build step, one CSS file per page link, classic scripts only (file:// review) — locked by FND-07/ARCHITECTURE.md.
- Indigo-tinted shadows (never grey/black) — carried from both Gen-3 and v3 traditions.

### Integration Points
- Phase 2 engine will read unit colors from the CSS custom properties defined here (D-07).
- Phase 3 motion layer consumes the motion tokens defined here (D-08).
- Every later page links `shared/awba-engine.css` and inherits shell classes.

</code_context>

<specifics>
## Specific Ideas

- The bar is explicit from the owner: "feels like the best UX/UI developers in the world made it." Phase 1 is where that bar gets structurally possible — token discipline + real responsive shell are prerequisites, and preview.html should already FEEL premium (spacing, shadows, type rhythm), not like a debug sheet.
- Keep the Gen-3 warmth: cream field, rounded, soft, gummy — elevated, not replaced with generic minimal SaaS aesthetics.

</specifics>

<deferred>
## Deferred Ideas

- None new this discussion. (Standing deferrals live in REQUIREMENTS.md v2 section.)

</deferred>
