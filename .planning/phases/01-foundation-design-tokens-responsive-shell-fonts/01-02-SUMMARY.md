---
phase: 01-foundation-design-tokens-responsive-shell-fonts
plan: 02
subsystem: design-system
tags: [css-layers, design-tokens, responsive-shell, per-unit-theming, font-face, focus-visible, arabic-rtl]

# Dependency graph
requires:
  - "11 self-hosted subset .woff2 fonts under shared/fonts/ (from 01-01)"
provides:
  - "shared/awba-engine.css — the one engine stylesheet: @layer tokens+base declared, components/screens/motion reserved empty"
  - "The full tokens layer: font roles, spacing, fluid type + Arabic sizes, neutral+semantic color, 4 per-unit 7-slot accent scales, radii, indigo shadows, motion durations + linear() easings"
  - "The responsive shell: .app-shell 100dvh grid (auto 1fr auto), .app-hud/.app-stage/.app-foot regions, safe-area insets, >=600px centered column"
  - "Global :focus-visible treatment + night-register --gold2 variant"
  - "Arabic/RTL base laws: .ayah->Amiri Quran, general Arabic->Amiri via :not(.ayah), unicode-bidi:isolate, letter-spacing:0"
  - "The immutable five-name @layer cascade order every later phase consumes"
affects: [01-03, 01-04, 02, 03, 04, 05, 06, 07]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "@layer full-order declared once at top (tokens, base, components, screens, motion); later phases write only content blocks, never a new name-list statement"
    - "Per-unit theming via [data-unit] full 7-slot accent scale — no shared cross-unit accent triplet; :root default = u1"
    - "CSS-relative @font-face src (fonts/*.woff2) resolving from the stylesheet's own shared/ location — file://-safe, never root-absolute"
    - "Responsive shell = mobile-default full-bleed 100dvh grid + a single min-width:600px progressive enhancement to a centered column (no second DOM structure)"
    - "Metric-tuned font fallback stacks (curated system-face ordering); --font-disp trails Poppins with Inter for the Wave-1 glyph gap"

key-files:
  created:
    - shared/awba-engine.css
  modified: []

key-decisions:
  - "Shell region rows namespaced .app-hud/.app-stage/.app-foot so Phase-3 HUD chrome component classes stay unambiguous"
  - "--font-disp lists Inter immediately after Poppins (Wave-1 verified Poppins glyph gap: U+02F9/02FA brackets + h-class diacritics fall through to Inter)"
  - "Night/legendary focus ring switches to --gold2 via a forward-looking [data-register=night] hook that Phase 3/4 sets"

requirements-completed: [FND-01, FND-02, PLT-01]

# Metrics
duration: 2min
completed: 2026-07-12
---

# Phase 01 Plan 02: Design Tokens, Responsive Shell & Fonts Engine Summary

**The one engine stylesheet `shared/awba-engine.css` — a single `@layer` design constitution: 11 self-hosted `@font-face` faces, a complete tokens layer (color/type/radii/indigo-shadow/motion), four per-unit 7-slot accent scales that make Gen-3's half-themed-page bug structurally impossible, and a true `100dvh` responsive shell that kills the fixed 380x788 phone card.**

## Performance

- **Duration:** ~2 min
- **Completed:** 2026-07-12T00:15:24Z
- **Tasks:** 2 completed
- **Files created:** 1 (`shared/awba-engine.css`, 307 lines)

## Accomplishments

- Declared the immutable five-name cascade order **once**, at the top: `@layer tokens, base, components, screens, motion;` — priority is now fixed by first-occurrence for the life of the project; `motion` is last (highest priority) so Phase-3 reduced-motion guards always win (FND-01, D-04).
- Wrote **11 `@font-face` rules** with CSS-relative `src:url('fonts/<name>.woff2')` — file://-safe, zero-CDN, `font-display:swap`, `font-style:normal`, correct per-weight `font-weight` (FND-03 consumed).
- Filled the full **`tokens` layer** entirely from 01-UI-SPEC values: four `--font-*` role vars with metric-tuned fallback stacks; the `--sp-*` spacing scale (incl. the 2px hairline exception); the 7-role `--fs-*` type scale with `clamp()` fluidity plus the three Arabic sizes; all neutral + semantic color tokens (amber/green/flame/gold + `--danger` safety-only); `--r-*` radii; `--sh-*` indigo-tinted shadows; `--dur-*` durations + easings including both `linear()` spring curves copied **verbatim**.
- Defined **four `[data-unit]` accent scales**, each with all seven slots (`--accent`, `--accent-deep`, `--accent-bright`, `--accent-soft`, `--accent-line`, `--accent-ink`, `--accent-on`); `:root` carries u1 as the default so a page without the attribute still themes fully. There is **no shared cross-unit accent triplet** to inherit — the structural death of the half-theming bug (FND-02, D-05/D-06).
- Applied both baked-in contrast corrections: **u4 `--accent-on: #241A00`** (warm near-black, the only non-white on-fill, 4.89:1 AA at 16px/700) and **u3 `--accent: #0A7575`** (deepened teal). The failing Gen-3 gold ink appears nowhere (grep-gated to zero).
- Built the **`base` layer**: reset with global tap-highlight suppression; `.app-shell` `min-height:100dvh` grid (`auto 1fr auto`) with `.app-hud`/`.app-stage`/`.app-foot` regions; safe-area insets on HUD top, footer bottom, and side gutters; stage `overflow-y:auto` + `overscroll-behavior:contain` + `min-height:0`; a single `@media (min-width:600px)` enhancement to an intentional `<=480px` centered column (`--r-2xl` corners, `--sh-4` + `--sh-inset`, `min(100dvh,900px)`, subtle radial brand wash) — never a fixed card (PLT-01, D-01/D-02).
- Wired the **global `:focus-visible`** treatment (3px `--accent` outline + `--accent-soft` companion ring), with the `--gold2` night-register variant.
- Established the **Arabic/RTL base laws**: `.ayah` binds `--font-quran` only; general Arabic binds `--font-ar` via `:not(.ayah)` (so the ayah-vs-hadith choice stays per-instance Phase-4 logic, per 01-RESEARCH Pitfall 4); `unicode-bidi:isolate`; `letter-spacing:0` on all Arabic.
- Left `components`/`screens`/`motion` as declared, comment-only blocks — no rules, reserved for later phases.

## Task Commits

Each task was committed atomically:

1. **Task 1: @layer order + full tokens layer** — `ac77092` (feat)
2. **Task 2: base layer — responsive shell grid, focus-visible + Arabic/RTL foundation** — `4bb1646` (feat)

**Plan metadata:** (final commit)

## Files Created/Modified

- `shared/awba-engine.css` — the one engine stylesheet (307 lines): `@layer` order + `tokens` + `base` filled; `components`/`screens`/`motion` reserved empty.

## Decisions Made

- **Shell region rows namespaced `.app-hud`/`.app-stage`/`.app-foot`** (not bare `.hud`/`.stage`/`.foot`): keeps the Phase-3 HUD *chrome* component classes unambiguous while this base layer owns the grid-row skeleton + safe-area padding. Within the plan's "three region classes" instruction.
- **`--font-disp` trails Poppins with Inter** before the system fallbacks, honoring Wave-1's verified finding that the subset Poppins faces lack U+02F9/02FA brackets and h-class diacritics — those glyphs now fall through to Inter, never a random system face. Documented in a comment at the faces block.
- **Night-register focus ring uses a forward-looking `[data-register="night"]` hook.** UI-SPEC requires the gold/night register to switch the ring to `--gold2` but doesn't name the selector; Phase 3/4 sets the attribute on the legendary-review shell. A soft companion ring is derived with `color-mix(in srgb, var(--gold2) 32%, transparent)` (D-06 permits `color-mix` for tints).
- **"Metric-tuned fallback stacks" realized as curated system-face ordering**, not `size-adjust` override faces — per Claude's-discretion (01-RESEARCH), this avoids fabricating unverified metric-override numbers for a subset while still replacing Gen-3's bare `system-ui,...` chain with metrically-close faces.
- **Line-heights documented per `--fs-*` role in comments** rather than minted as separate `--lh-*` tokens — the plan scopes the type tokens to `--fs-*`; the line-height values (from UI-SPEC) are preserved for the Phase-3 component layer without inventing token names.

## Deviations from Plan

None — the plan executed exactly as written. All token values were taken verbatim from 01-UI-SPEC; both baked-in contrast corrections were applied; every task and plan-level acceptance grep passes. The decisions above are discretionary interpretations explicitly permitted by the plan/RESEARCH ("Claude's Discretion"), not departures from it.

## Threat Model Compliance

Both `mitigate` dispositions in the plan's STRIDE register are honored:
- **T-01-ID** (font URL information disclosure): every `@font-face src` is CSS-relative `fonts/*.woff2` -> same-origin `shared/fonts/`; zero `fonts.googleapis.com`/`fonts.gstatic.com` at runtime. Grep-verified: no root-absolute URLs.
- **T-01-A11Y** (keyboard users stranded by suppressed tap-highlight): global `:focus-visible` is defined in the `base` layer now, inherited by every later component.

No new trust boundary or security surface is introduced (pure static CSS). No Threat Flags.

## Known Stubs

None. The `components`, `screens`, and `motion` `@layer` blocks are **intentionally** declared-empty (comment-only) — this is the plan's explicit output ("components/screens/motion present as empty declared layers"), required so the cascade order is locked immutable now. Each names the phase that fills it (components/motion -> Phase 3; screens -> Phase 2+). This is a deliberate architectural placeholder, not incomplete work.

## Issues Encountered

None.

## User Setup Required

None — pure static CSS, no external service or configuration.

## Next Phase Readiness

- `shared/awba-engine.css` is ready for **01-03** (`preview.html` — the verification vehicle): every token, unit theme, font role, and shell region it must showcase now exists to be `var()`-referenced. Pages link it via the single `<link rel="stylesheet" href="shared/awba-engine.css">` line and preload the 2 critical faces with page-relative `shared/fonts/...` URLs + `crossorigin`.
- The `@layer` order is immutable: no later phase may write a bare name-list statement again — only `@layer <name> { ... }` content blocks.
- Phase 2's engine will read unit colors from these CSS custom properties via `getComputedStyle` (D-07) — CSS is the single source of truth; the `cfg.unitColor` hex->data-unit mapping keys off `--accent` (#2E6BF5->u1, #7C5CE0->u2, #0A7575->u3, gold->u4).
- Carry-forward flag (from 01-01, unchanged): 01-UI-SPEC's Font Subset Contract table still lists Poppins carrying U+02F9/02FA/U+1E25 — a documentation-only correction for a future pass; shipped rendering is unaffected because `--font-disp` falls through to Inter for those glyphs.

## Self-Check: PASSED

- File verified present on disk: `shared/awba-engine.css` (`[ -f ]` -> FOUND).
- Both task commits verified in git log: `ac77092`, `4bb1646` (both FOUND).
- All Task 1 acceptance greps re-ran clean: `@layer` order == 1, `@font-face` == 11, 4 `[data-unit]` themes, `#241A00` present, `#3A2B00` absent, no root-absolute `url()`, `--accent-on` >= 4, `linear(` >= 2, no `--blue2`/`--blue3`.
- All Task 2 acceptance greps re-ran clean: `100dvh`, `grid-template-rows`, `safe-area-inset` (9), `min-width:600px`, `:focus-visible`, `unicode-bidi` (3), `overscroll-behavior`; no `788px`/`380px`; `max-width:480px` + `border-radius:var(--r-2xl)` + `box-shadow:var(--sh-4)` + `min(100dvh,900px)` present; `.ayah` binds `--font-quran`; braces balanced (36/36).

---
*Phase: 01-foundation-design-tokens-responsive-shell-fonts*
*Completed: 2026-07-12*
