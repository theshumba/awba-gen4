---
phase: 01-foundation-design-tokens-responsive-shell-fonts
plan: 03
subsystem: design-system
tags: [preview-html, verification-vehicle, per-unit-theming, glyph-test, responsive-shell, zero-cdn, self-hosted-fonts, motion-demos]

# Dependency graph
requires:
  - "shared/awba-engine.css — the one engine stylesheet: tokens + base + per-unit accent scales + shell + Arabic laws (from 01-02)"
  - "11 self-hosted subset .woff2 fonts under shared/fonts/ (from 01-01)"
provides:
  - "preview.html at repo root — the D-12 living verification vehicle + style reference (841 lines, 8 required sections)"
  - "The canonical shared <head> boilerplate every later page repeats: viewport-fit=cover meta, 2 crossorigin page-relative font preloads, single engine stylesheet link, zero CDN"
  - "A working interactive data-unit switch proving full per-unit recolor (FND-02) across u1/u2/u3/u4 with zero residual accent leak"
  - "The permanent glyph-test block (FND-03): brackets ˹˺, full transliteration diacritic set, middle dot, punctuation, circumflex vowels, ﷺ, ayah/hadith face split, tofu FAIL exemplar"
  - "Reusable preview-chrome patterns (gummy button, citation chip, node ring, tinted panel, bottom-sheet demo) expressed purely in engine tokens — a Phase-3 component reference"
affects: [01-04, 02, 03, 04, 05, 06, 07]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "preview.html showcase chrome lives in an UNLAYERED <style> block that consumes engine tokens via var() and declares NO new custom properties; being unlayered it sits above @layer base, letting it override the engine's >=600px body-centering for the long reference doc without touching the token layer"
    - "All 4 unit accent scales rendered simultaneously by wrapping each column in its own [data-unit] container — CSS custom-property re-scoping resolves var(--accent) per column, no JS, no raw hex in swatch markup"
    - "Classic (non-module) inline JS, file://-safe: unit switch sets data-unit on <html> and reads the resolved --accent via getComputedStyle (D-07 single-source spirit); node-pop replay via reflow; bottom-sheet open/close"
    - "Shared <head> boilerplate: viewport-fit=cover + 2 crossorigin page-relative font preloads + single stylesheet link; every href is page-relative (no leading slash) so it resolves under file:// double-click review"

key-files:
  created:
    - preview.html
  modified: []

key-decisions:
  - "Showcase chrome is unlayered so it can neutralise the engine's >=600px body{display:flex} centered-column rule (meant for real app pages) without editing the engine — while section 6 still hosts a REAL .app-shell that adapts full-bleed<->centered-column on viewport resize"
  - "Each unit-scale column carries its own [data-unit] so all four themes show side-by-side, live, from var(--...) with zero literal hex — the same mechanism the page's focal unit-switch uses on <html>"
  - "Glyph test demonstrates the documented Poppins->Inter bracket fallback in situ (˹˺ inside a Poppins Clear-Quran string), renders ﷺ defensively in both Amiri and Amiri Quran, and colours the tofu FAIL cell amber (mercy law: never red)"

requirements-completed: [FND-01, FND-02, FND-03, PLT-01]

# Metrics
duration: 10min
completed: 2026-07-12
---

# Phase 01 Plan 03: preview.html — Living Verification Vehicle Summary

**`preview.html` at repo root — the D-12 verification vehicle and premium living style reference: eight sections against the one engine stylesheet, a live `data-unit` switch that recolors the whole sample cluster across all four units, the permanent glyph test (brackets, diacritics, ﷺ, ayah/hadith face split, tofu FAIL cell), a real responsive `.app-shell`, and a zero-CDN assertion — all consuming engine tokens, inventing no new hex/px, and loading clean from `file://` with no console errors.**

## Performance

- **Duration:** ~10 min
- **Completed:** 2026-07-12
- **Tasks:** 2 completed
- **Files created:** 1 (`preview.html`, 841 lines)

## Accomplishments

- Built the **shared `<head>` boilerplate** every later page will repeat identically (D-11): `charset`, the `viewport-fit=cover` viewport meta (PLT-01 safe-area prerequisite), two `<link rel="preload" as="font" type="font/woff2" crossorigin>` for the 2 critical faces (`shared/fonts/poppins-700.woff2`, `shared/fonts/inter-400.woff2` — page-relative, no leading slash), then the single `<link rel="stylesheet" href="shared/awba-engine.css">`. No Google-Fonts CDN link; no deprecated `apple-mobile-web-app-capable` tag.
- **Section 1 — Color token sheet:** neutral surface/ink/line swatches + the four semantics (amber/green/flame/gold + `--danger` safety-only) + **all four per-unit 7-slot accent scales side-by-side** (accent/deep/bright/soft/line/ink/on), each with a hex label; every text-bearing pairing (on-fill, ink-on-soft, deep-on-cream, ring) carries an **AA-contrast badge** with the measured ratio, and an on-page note documents the `--accent-on` white-vs-`#241A00`-gold split.
- **Section 2 — Live per-unit recolor (the focal point):** a segmented `data-unit` switch whose handler calls `document.documentElement.setAttribute('data-unit', …)` and recolors the whole sample cluster (gummy "Begin, gently" button, citation chip, active node ring, inline link, tinted panel, progress fill). A live readout shows the resolved `--accent` via `getComputedStyle`. Zero residual blue survives on u2/u3/u4.
- **Section 3 — Type scale:** all seven Latin roles at their token size/weight/line-height with labels, a `clamp()` fluid-resize demo, and Arabic samples at `--fs-ar-body` (Amiri) and `--fs-ayah` (`.ayah` → Amiri Quran).
- **Section 4 — Radii + elevation:** one labelled tile per `--r-*` and per `--sh-*` (indigo-tinted), values referenced via `var()`.
- **Section 5 — Motion demos:** gummy press, node pop-in, and bottom-sheet-in, each labelled with its easing/duration token, all collapsed to instant under `@media (prefers-reduced-motion: reduce)`.
- **Section 6 — Responsive shell skeleton:** a **real `.app-shell`** grid (HUD with named close control + progress segments + streak/noor stats, scrolling stage with placeholder lesson cards, footer with the single accent CTA) that adapts full-bleed edge-to-edge below 600px and to a centered column with `--r-2xl` corners + `--sh-4` above it — the resize-test target.
- **Section 7 — Permanent glyph test:** corner brackets ˹˺ (U+02F9/02FA) shown **inside a Poppins string to prove the documented Poppins→Inter fallback renders cleanly**, the full transliteration diacritic set in both Poppins and Inter, the middle dot in a "Unit 1 · Lesson 1" exemplar, the punctuation set, the circumflex "Iblîs · Suwâ · Yaghûth · Yaûq" exemplar, ﷺ (U+FDFA) in both Amiri and Amiri Quran, the **ayah/hadith face split** (verbatim Basmala in `.ayah`/Amiri Quran beside a hadith in general Amiri — no blanket rule forces the Qur'an face onto hadith), and a deliberate **amber tofu FAIL exemplar** ("Glyph missing — re-subset this face.").
- **Section 8 — Zero-CDN assertion note:** the DevTools › Network instruction, phrased **without** the literal `fonts.googleapis.com`/`fonts.gstatic.com` host substrings so the automated gate stays unambiguous.
- **Premium bar:** consumes engine tokens throughout (`var(--sp-*)` spacing rhythm, `var(--sh-*)` indigo elevation, `var(--r-*)` warm corners, Poppins/Inter type rhythm on the cream field), with the saturated unit-switch cluster as the clear focal point — a living style reference, not a debug dump. Invents no new tokens and no raw hex/px for anything the token layer already defines.

## Task Commits

Each task was committed atomically:

1. **Task 1: Head boilerplate + token sheet + unit-switch + shell skeleton + motion demos (sections 1–6)** — `cd8c127` (feat)
2. **Task 2: Permanent glyph-test block + zero-CDN note + premium polish (sections 7–8)** — `3c27e23` (feat)

**Plan metadata:** (final commit)

## Files Created/Modified

- `preview.html` — the D-12 verification vehicle (841 lines): shared head boilerplate, 8 required sections, unlayered preview-chrome `<style>`, classic file://-safe inline JS.

## Decisions Made

- **Showcase chrome is an unlayered `<style>` block.** The engine's `>=600px body{display:flex; …}` rule (correct for real app pages) would otherwise centre-column the entire long reference doc. Because the preview's `<style>` is unlayered, it sits above `@layer base` and cleanly overrides that body rule for the document — while section 6 still hosts a **real** `.app-shell` that demonstrates the genuine full-bleed↔centered-column behaviour on viewport resize. No engine edits, no new tokens.
- **All four unit scales render simultaneously via per-column `[data-unit]`.** Each column wraps its swatches in its own `data-unit="uN"` container, so `var(--accent)` (and the whole 7-slot scale) resolves to that unit's values by CSS custom-property re-scoping — the same mechanism the focal switch applies to `<html>`. This shows the full recolor side-by-side with zero JS and zero literal hex in the swatch markup (satisfying the "reference `var()` not raw hex" acceptance rule).
- **Glyph test proves the fallback in situ.** Per 01-01's verified finding that the Poppins subset lacks U+02F9/02FA and the h-class diacritics, the brackets are shown inside a Poppins-styled Clear-Quran string so the Poppins→Inter fall-through is visibly clean, alongside a pure-Inter row. ﷺ is rendered defensively in both Arabic faces (forward-looking, per brand law CNT-04). The tofu FAIL cell uses amber, honouring the mercy law that reserves red for safety only.
- **Shell showcase height capped for scannability.** The real `.app-shell` min-height is capped to 540px via preview chrome so the reference page stays scannable, while the engine's actual responsive contract (max-width 480px, `--r-2xl` corners, `--sh-4` elevation on the cream wash) is left intact and visibly demonstrated on resize.

## Deviations from Plan

None — the plan executed exactly as written. Both tasks were built and committed as specified; every task-level and plan-level acceptance grep passes; all token/class consumption is from `shared/awba-engine.css` with no invented tokens. The decisions above are discretionary implementation choices explicitly permitted by the plan ("Claude's Discretion" in 01-RESEARCH: fallback stacks, showcase treatment), not departures from it.

## Threat Model Compliance

The single `mitigate` disposition in the plan's STRIDE register is honoured:
- **T-01-ID** (Google-Fonts CDN reference / information disclosure): `grep -Ec 'fonts\.(googleapis|gstatic)\.com' preview.html` == 0 **and** the same == 0 over `shared/awba-engine.css`; all font references are page-relative same-origin `shared/fonts/…` preloads (no leading slash — file://-safe). The section-8 note is phrased to avoid the literal host strings so the gate is unambiguous.
- **T-01-SI** (inline JS, disposition `accept`): the only script is a few lines of classic vanilla JS toggling a `data-unit` attribute and two demo helpers — no third-party script, no `eval`, no remote fetch. No new trust boundary introduced.

No Threat Flags — the page adds no network endpoint, auth path, file-access pattern, or schema; it is a static same-origin showcase.

## Known Stubs

None that block the plan's goal. The shell skeleton (section 6) and stage cards carry deliberate **placeholder** copy ("placeholder content stands in for the real lesson beats that Phase 4 ports from Josh's data files") — this is intentional and in-contract: `preview.html` is a token/shell/glyph *reference*, not a product screen; real lesson content is ported in Phase 4. All showcase elements paint from live engine tokens (no empty/mock data pipeline), so there is no data stub to wire.

## Verification

All plan `<verification>` and both tasks' `<acceptance_criteria>` re-ran clean:
- `grep -c 'viewport-fit=cover' preview.html` → **1** (PLT-01 safe-area prerequisite).
- `grep -c 'shared/awba-engine.css'` → **1** (single stylesheet, D-04); `grep -c 'rel="preload"'` → **2** (both crossorigin); root-absolute path gate `! grep -Eq '"/(shared|fonts)'` → **PASS**.
- `grep -c 'data-unit'` → **16**, incl. one `setAttribute('data-unit', …)` (FND-02 recolor proof); `grep -c 'prefers-reduced-motion'` → **2**.
- `grep -Ec 'fonts\.(googleapis|gstatic)\.com'` → **0** on both `preview.html` and `shared/awba-engine.css` (FND-03 zero-CDN, T-01-ID).
- Glyph test: `grep -c '˹'` → **2**; `grep -c 'class="ayah"'` → **2**; `grep -c 'lang="ar"'` → **6** (ayah + hadith + ﷺ pair + Arabic type samples); FAIL copy, "Iblîs · Suwâ · Yaghûth · Yaûq", "Unit 1 · Lesson 1", and ﷺ all present.
- `python3 scripts/check-glyph-coverage.py` → **exit 0**.
- **Headless render (Chrome `--headless=new`, `file://`):** page parses (55 KB DOM), all 8 sections render, the inline classic JS executes with **no console errors and no font 404s**, and `#pv-unit-readout` populates with `U1 · --accent #2E6BF5` — confirming `getComputedStyle` reads the engine custom property over `file://`.

## Issues Encountered

None. (Two SDK-invocation quirks during state updates — `state.record-metric` and `state.add-decision` required flag form rather than positional args — were resolved without affecting the artifact.)

## User Setup Required

None — pure static HTML/CSS + classic inline JS; opens directly via double-click over `file://`.

## Next Phase Readiness

- **01-04** (the human verification gate) can open `preview.html` directly and confirm: the unit switch fully recolors the cluster across all four units; every glyph renders in the correct face with no tofu; the shell adapts full-bleed↔column on window resize; and DevTools › Network shows only same-origin `shared/fonts/…` requests.
- The shared `<head>` boilerplate established here is the copy-forward template for every later page (nested pages use `../shared/fonts/…` / `../shared/awba-engine.css`, which resolve to the same URLs so the D-11 font cache still dedupes).
- Carry-forward (documentation-only, unchanged from 01-01/01-02): 01-UI-SPEC's Font Subset Contract table still lists Poppins carrying U+02F9/02FA — the shipped page proves this is handled by the `--font-disp` Poppins→Inter fallback, which section 7 now visibly demonstrates.

## Self-Check: PASSED

- File verified present on disk: `preview.html` (841 lines, `[ -f ]` → FOUND; min_lines ≥ 200 → PASS).
- Both task commits verified in git log: `cd8c127`, `3c27e23` (both FOUND).
- All task-level and plan-level acceptance greps re-ran clean (values recorded under Verification above).
- Headless Chrome render over `file://` produced no console errors and no font load failures.

## Post-Plan Follow-up (Deviations addendum)

**1. [Rule 1 - Bug] Fixed +36px horizontal overflow at a true 320px viewport (PLT-01 violation)**
- **Found during:** Orchestrator visual QA after plan completion, before the Wave-4 human gate.
- **Issue:** At 320px, `document.scrollingElement.scrollWidth` measured **356** (should be 320). Primary offender: the section-2 segmented unit-switch (`.pv-seg` — four fixed-padding buttons + readout don't compress). Root-causing with an element-walk harness surfaced a **second** offender the original report's chain masked: the section-3 type-scale Display specimen ("Beautifully done." at 32px) blowing out the `.pv-typerow` `1fr` track via the grid item's implicit `min-width:auto` (residual scrollWidth 344 after the seg fix alone).
- **Fix (preview chrome only — `shared/awba-engine.css` untouched):** `.pv-seg` gets `max-width:100%`; a `@media (max-width:519px)` block makes it a full-width flex row of equal shrinkable segments (`flex:1 1 0`, `min-width:0`, kicker size, tighter padding) with the accent readout wrapping to its own row and `.pv-focal` stepping its padding down one spacing token. `.pv-typerow`'s specimen cell gets `min-width:0` + `overflow-wrap:break-word`, and rows stack label-above-specimen at ≤519px so display samples get the full row width. The 519px threshold is deliberately generous so the compact pill only appears where its natural width genuinely fits, whatever the font metrics.
- **Verification (iframe harness — headless Chrome `--allow-file-access-from-files`, reading `contentDocument.scrollingElement.scrollWidth`; window-size screenshots are unreliable because Chrome clamps minimum window width):**
  - 320px viewport → scrollWidth **320** exactly (was 356, then 344 after seg fix alone)
  - 390px viewport → scrollWidth **390** exactly
  - 600px viewport → scrollWidth **600** exactly
  - Segment buttons report `scrollWidth == clientWidth` at all three widths — no label bleed, the control reads intentional (compressed, not crushed).
  - All plan/task acceptance greps re-ran with identical values; headless console still clean.
- **Files modified:** `preview.html`
- **Commit:** `ad75c47` (fix)

---
*Phase: 01-foundation-design-tokens-responsive-shell-fonts*
*Completed: 2026-07-12*
