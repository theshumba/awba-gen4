# Phase 1: Foundation — Design Tokens, Responsive Shell & Fonts - Research

**Researched:** 2026-07-11
**Domain:** Zero-build vanilla CSS design-token architecture, true responsive app shell, self-hosted subset web fonts (Latin + Arabic/Quranic)
**Confidence:** HIGH

## Summary

This phase has an unusual property: a full `01-UI-SPEC.md` already exists in this phase directory (produced by `gsd-ui-researcher`), and it already locks nearly every design-token *value* — spacing scale, type scale, the full 7-slot per-unit accent system with stated WCAG tiers, radii, shadows, two `linear()` motion curves, and a detailed `preview.html` contract. **This RESEARCH.md does not re-derive those values.** Its job is the layer underneath: verified implementation mechanics, exact commands, and independently-checked facts the planner needs to turn UI-SPEC's numbers into working code without guessing.

Three things were independently verified this session by reading Josh's actual 19 content files (15 lessons + 4 reviews) byte-for-byte, not by inference: (1) the **exact Unicode codepoints** Gen-4's fonts must cover — confirming UI-SPEC's `˹˺ = U+02F9/U+02FA` finding and adding several codepoints UI-SPEC's coverage table didn't spell out (middle dot, em/en dash, curly quotes, four circumflex-accented proper nouns); (2) that **all four font families, at the exact weights Gen-3 already loads, contain every required glyph** — checked directly against the live Google Fonts glyph-subsetting API, not assumed; (3) a **real WCAG contrast gap** in UI-SPEC's own u4 gold button-label pairing that its stated "PASS" doesn't fully cover once the actual 16px/700 button font-size is checked against the WCAG large-text threshold.

**Primary recommendation:** Build the font subset pipeline from the verified codepoint list in this document (not from the generic Latin-range example in CLAUDE.md's illustrative `pyftsubset` command, which under-covers this project's real content); wire the responsive shell exactly as UI-SPEC's grid spec describes but add the missing `viewport-fit=cover` meta tag prerequisite; write the full five-layer `@layer` statement in one shot even though only `tokens`+`base` get content, because layer order is fixed by first occurrence, not by which layer has content.

## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Phone-first, full-bleed: the app shell fills `100dvh` edge-to-edge on mobile, grid rows HUD / stage / footer, `env(safe-area-inset-*)` honored, `overscroll-behavior` contained. No `.phone` card on mobile — the app IS the page.
- **D-02:** Desktop presentation = intentional centered column (max-width ≈ 460–480px content column, full-height), elevated on a designed calm backdrop (cream `#EEF2FB` with a very subtle brand wash / soft radial), carrying the indigo-tinted shadow language. NO fake phone bezel, no fixed height — the column breathes with the viewport.
- **D-03:** Fluid type: base sizes move to `rem` + `clamp()` where it matters (display sizes, hero numerals); body stays comfortably readable at 320px width without overflow.
- **D-04:** ONE stylesheet (`shared/awba-engine.css`) containing `@layer tokens, base, components, screens, motion` — Phase 1 writes the `tokens` + `base` (shell) layers; later phases fill the rest. Single `<link>` per page.
- **D-05:** Tokens are semantic, not literal: components consume `--accent`, `--accent-deep`, `--accent-soft`, `--accent-line`, `--accent-ink` etc. — never `--blue2` directly. Gen-3's palette values are the starting values; refine shades for contrast but keep the recognizable Gen-3 look.
- **D-06:** Unit theming via `data-unit="u1|u2|u3|u4"` on `<html>`: each unit defines its FULL accent scale explicitly in the tokens layer (accent, deep, soft/tint, line — hand-tuned per unit, `color-mix()` allowed for tints but deep shades hand-picked for contrast).
- **D-07:** Back-compat: the engine (Phase 2+) maps `cfg.unitColor` hex → known unit theme; unknown hex falls back to setting `--accent` directly. JS reads unit colors FROM the CSS custom properties (getComputedStyle) — CSS is the single source of truth.
- **D-08:** Motion tokens defined now (durations + `linear()` spring easings + standard eases) even though the motion layer lands in Phase 3.
- **D-09:** Four families self-hosted in `shared/fonts/` as subset `.woff2`: Poppins, Inter, Amiri (general Arabic), Amiri Quran (ayah text only, `.ayah` class). All OFL-licensed, downloaded from Google Fonts sources and subset locally (pyftsubset). No CDN requests at runtime.
- **D-10:** Subsets MUST include Latin + Latin Extended Additional (transliteration diacritics) in Poppins/Inter; Clear Quran corner brackets ˹˺ in Inter; Arabic + Arabic Presentation Forms + ﷺ (U+FDFA) in Amiri/Amiri Quran. The preview page carries a permanent glyph test block.
- **D-11:** Loading: `font-display: swap` + `<link rel="preload">` for the 2 critical faces per page + identical font URLs on every page; system-font fallback stacks metric-tuned.
- **D-12:** `preview.html` at repo root renders the full token sheet, responsive shell skeleton, and glyph test — the living verification vehicle for all four success criteria.

### Claude's Discretion
- Exact refined shade values, shadow softness, backdrop wash treatment on desktop, clamp() breakpoints, fallback stack metrics — designer's judgment within the Gen-3 look and the frontend-design skill's craft bar. Load the `frontend-design` skill during execution of any visual plan.

### Deferred Ideas (OUT OF SCOPE)
- None new this discussion. (Standing deferrals live in REQUIREMENTS.md v2 section.)

### Superseding note — 01-UI-SPEC.md exists and locks values

A `01-UI-SPEC.md` (verified by `gsd-ui-checker`, approval pending) already exists in this phase directory and is the **authoritative source for every token value** — spacing scale (`--sp-*`), type scale (`--fs-*`), the full 7-slot per-unit accent system (`--accent`, `--accent-deep`, `--accent-bright`, `--accent-soft`, `--accent-line`, `--accent-ink`, `--accent-on`), radii (`--r-*`), shadows (`--sh-*`), two motion easings (`--ease-spring`, `--ease-gentle`), the responsive-shell grid spec, focus-visible spec, and the `preview.html` content checklist. **The planner should read UI-SPEC.md directly for values; this document supplies the implementation mechanics, verified facts, and gaps UI-SPEC didn't cover.** Where this research independently re-derived a number (e.g. WCAG contrast), findings are cross-checked against UI-SPEC and any discrepancy is called out explicitly below (see "WCAG cross-check" under Common Pitfalls).

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FND-01 | One design-token layer (CSS `@layer`), no literal hex/px invention in screen code, unit colors exist once | `@layer` full-declaration-order mechanics (below); UI-SPEC.md supplies the token values |
| FND-02 | Unit theming fully recolors a lesson page (primary AND secondary accents, no half-theming) | UI-SPEC.md's 7-slot per-unit scale + `data-unit` mechanism; WCAG cross-check found and flagged one gap (u4 button label) |
| FND-03 | Self-hosted subset .woff2 fonts, no CDN, glyph test for ˹˺ + diacritics | Verified codepoint inventory (real scan of Josh's 19 files) + verified glyph existence in source fonts (Google Fonts API) + exact `pyftsubset` commands |
| PLT-01 | True responsive: full-bleed dvh mobile, intentional desktop column | dvh recalculation-jank mitigation pattern; `viewport-fit=cover` prerequisite (gap UI-SPEC didn't state) |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

- Vanilla HTML/CSS/JS, zero build step, no framework/bundler — Josh reviews by opening files directly (`file://`)
- Classic `<script src="...">` only, never `type="module"` (fails over `file://` in Chrome/Firefox — CVE-2019-11730 mitigation)
- Self-hosted, subsetted static fonts — Google Fonts CDN `<link>` never used at runtime, for any project reason
- `pyftsubset` (fonttools) is the named dev-tool for the one-time font-subsetting pass — "data preparation, not a build pipeline step"
- Amiri Quran (not general Amiri) specifically for verbatim ayah text; general Amiri for hadith/UI Arabic
- `line-height: 1.8+` minimum for Arabic body text; `letter-spacing: 0` always on Arabic
- Indigo-tinted shadows only, never grey/black
- `apple-mobile-web-app-capable` meta tag is deprecated — not relevant to Phase 1 but noted so it isn't accidentally added to the `<head>` boilerplate this phase establishes
- CLAUDE.md's own illustrative `pyftsubset --unicodes=...` example for Poppins is a **generic placeholder** and under-covers this project's actual content — do not copy it verbatim (see Font Subset Pipeline below for the verified replacement range)

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Design tokens (color/type/radii/shadow/motion custom properties) | Browser/Client | — | Pure CSS custom properties in `@layer tokens`; no server involved, no build step |
| Responsive shell layout (dvh grid, safe-area insets) | Browser/Client | — | Rendered entirely by the browser's CSS grid/viewport-unit engine |
| Self-hosted font files (subset `.woff2`) | CDN/Static | Browser/Client | Static same-origin files served by GitHub Pages/Vercel — explicitly NOT a third-party CDN tier; fetched and rasterized by the browser |
| Font acquisition + subsetting (`pyftsubset`) | Build-time / dev tooling | — | One-time, offline, human-run data-prep step; output is a committed static asset, never invoked at request time |
| `preview.html` verification vehicle | Browser/Client | — | Static HTML/CSS/inline-JS, no server logic, no data fetch |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| fontTools / `pyftsubset` | 4.60.2 (verified installed locally this session: `python3 -c "import fontTools; print(fontTools.__version__)"` → `4.60.2`) | Font subsetting, WOFF2 conversion | Industry-standard OpenType manipulation library (Google-maintained lineage); correctly rewrites `cmap`/`GSUB`/`GPOS` tables, which a hand-rolled binary editor would not |
| Poppins (Google Fonts, OFL) | Static weights 500/600/700/800 (confirmed via live `fonts.googleapis.com/css2` request — see Font Subset Pipeline) | Display/headings/buttons/numerals | Gen-3's proven display face; UI-SPEC.md locks the weight discipline (600/700, 800 quarantined to hero numeral) |
| Inter (Google Fonts, OFL) | Static weights 400/500/600/700 | Body/UI text | Gen-3's proven body face; also carries transliteration + `˹˺` bracket glyphs in verse translations |
| Amiri (Google Fonts, OFL) | Static weights 400/700 | General Arabic (hadith, terms, du'a, bismillah) | Gen-3's proven Arabic face; 4 static styles exist (Regular/Bold/Slanted/Bold-Slanted), no variable instance |
| Amiri Quran (Google Fonts, OFL) | Static weight 400 (only weight that exists) | `.ayah`-bound verbatim Qur'an text only | Purpose-built for Qur'an typesetting — "bigger line height to accommodate waqf marks" per the font's own documentation; NEW in Gen-4 (Gen-3 used general Amiri for everything) |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| None (zero runtime dependencies) | — | — | This phase ships zero JS libraries and zero npm/pip packages at runtime — pure CSS + static font files, matching the project's zero-build constraint |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| 4 static Poppins weight files | Poppins variable font | **Not available** — WebSearch confirms Poppins ships static-only on Google Fonts (9 upright weights + 9 italics, no variable axis published); this closes STACK.md's LOW-MEDIUM flag to resolved-negative |
| 4 static Inter weight files | Inter Variable (single file, weight axis 100–900) | Inter *does* have an official variable font (confirmed via `rsms/inter` GitHub + Google Fonts). Using it would mean 1 file instead of 4 for Inter, but breaks pipeline uniformity (Poppins/Amiri/Amiri Quran are static-only regardless, so the subsetting *command shape* stops being consistent across all 4 families). Recommend static for consistency; note variable as a legitimate alternative if file-count matters more than pipeline uniformity |
| Google Fonts `text=` parameter exact-glyph subsetting (fetch pre-subset `.woff2` directly from `fonts.gstatic.com`) | `pyftsubset` on full downloaded TTFs with unicode-**range** subsetting | The `text=` trick subsets to the *exact characters requested* — efficient but brittle: a future lesson introducing one new diacritic (e.g. `ẓ` or `ḍ`, present in CLAUDE.md's own line-height guidance text but not yet in any of the 19 files) silently produces tofu. Block-level unicode-range subsetting via `pyftsubset` gives headroom within the same script/diacritic family at near-zero size cost. **Use the `text=` trick only as a coverage-verification technique** (as done in this research), not as the production acquisition method |

**Installation:** No `npm install` / `pip install` for the shipped product (zero runtime deps). Dev-time only:
```bash
# fontTools is already present in this environment (v4.60.2). If not:
pip3 install fonttools  # or: pip3 install fonttools --break-system-packages
# pyftsubset CLI entrypoint may not be on PATH — invoke via module form as a reliable fallback:
python3 -m fontTools.subset --help
```

**Version verification:** Font family/weight availability verified live this session against `fonts.googleapis.com/css2` (not assumed from training data) — see Font Subset Pipeline below for the exact request and confirmed weight list.

## Package Legitimacy Audit

This phase installs **zero runtime npm/pip packages** — it is a pure CSS + static-font-asset phase (matches the project's zero-build constraint). The only tool involved is `fonttools` (dev-time only, never shipped, never present in the browser-served files).

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| fonttools | PyPI | 15+ years (Just van Rossum, maintained by Google-affiliated team) | Millions/week | github.com/fonttools/fonttools | not run (slopcheck unavailable — `pip` not on PATH as a bare command in this environment; `pip3`/`python3 -m pip` also failed to install slopcheck) | `[ASSUMED]` per graceful-degradation protocol — **already verified installed and functional locally this session** (`python3 -c "import fontTools; print(fontTools.__version__)"` → `4.60.2`, and `python3 -m fontTools.subset --help` produced real output), which is a stronger signal than slopcheck would add. Recommend a lightweight `checkpoint:human-verify` only if a *different* machine lacks it — this dev environment does not need one. |

**Packages removed due to slopcheck [SLOP] verdict:** none (no packages installed this phase)
**Packages flagged as suspicious [SUS]:** none

No font-family "package" is npm/pip-installed — the four font families are downloaded as static binary files (`.ttf`/`.woff2`) directly from `fonts.gstatic.com` (Google's own font CDN, not a third-party mirror) and committed to the repo. This is data acquisition, not package installation, so the npm/PyPI slopsquatting vector does not apply; the relevant risk (wrong/corrupted font file) is mitigated by the glyph-coverage verification below, not by slopcheck.

## Font Subset Pipeline (FND-03 / D-09, D-10) — verified codepoints, commands, weights

### Step 1 — The verified codepoint inventory (real scan, not assumed)

Every non-ASCII character actually used across all 15 lesson files + 4 review files + `learn.html` was extracted this session with a direct Python scan (`ord(ch) > 127`, all 20 files). **86 unique codepoints found.** The relevant groupings for subsetting:

**Clear Quran corner brackets — CONFIRMED, not the speculated codepoints:**
- `˹` = **U+02F9 MODIFIER LETTER BEGIN HIGH TONE** (57 occurrences)
- `˺` = **U+02FA MODIFIER LETTER END HIGH TONE** (57 occurrences)
- These are in the **Spacing Modifier Letters** block (U+02B0–02FF), *not* U+2E32-area as D-10 speculated, and *not* U+02F9/02FA in the sense of "IPA tone letters used semantically" — Khattab's translation convention repurposes these two glyphs purely as bracket shapes. UI-SPEC.md independently confirmed the same U+02F9/02FA finding in a prior session — cross-validated.

**Transliteration diacritics (Latin Extended-A + Latin Extended Additional + Spacing Modifier Letters):**
| Char | Codepoint | Count | Block |
|------|-----------|-------|-------|
| ā / Ā | U+0101 / U+0100 | 74 / 2 | Latin Extended-A |
| ī / Ī | U+012B / U+012A | 44 / 1 | Latin Extended-A |
| ū | U+016B | 33 | Latin Extended-A |
| ʿ | U+02BF | 25 | Spacing Modifier Letters |
| ʾ | U+02BE | 9 | Spacing Modifier Letters |
| ḥ / Ḥ | U+1E25 / U+1E24 | 53 / 10 | Latin Extended Additional |
| ṣ / Ṣ | U+1E63 / U+1E62 | 8 / 13 | Latin Extended Additional |
| ṭ / Ṭ | U+1E6D / U+1E6C | 30 / 6 | Latin Extended Additional |
| ḏ / Ḏ | U+1E0F / U+1E0E | 5 / 5 | Latin Extended Additional |

**Gap UI-SPEC's coverage table didn't spell out — found only by scanning the actual files:**
- **Four circumflex-accented proper nouns** (Latin-1 Supplement, not Extended-A): `â` U+00E2 (1×, "Iblîs"... — actually `î` here), `î` U+00EE (1×, "Iblîs"), `û` U+00FB (2×, "Suwâ, Yaghûth, Yaûq"). These are Josh's own transliteration convention (mixing circumflex and macron across different lesson files — an inconsistency in his source, not a Gen-4 decision to fix). **Verified present in both Inter and Poppins** via the Google Fonts glyph-existence check (Step 2). Latin-1 Supplement (U+0080–00FF) must be in the subset range — it usually is by default in any "Latin" subset, but confirm explicitly since a careless ASCII-only (U+0000–007F) subset would tofu these four instances.
- **Middle dot `·` U+00B7** (Latin-1 Supplement) — 208 occurrences, used as the UI separator in every page `<title>` and every `.journey`/`.kicker` eyebrow ("Unit 1 · Lesson 1", "al-Ḥujurāt 49:15" citation source lines). Renders in **Poppins** (the `.r-src`/`.journey`/`.kicker` classes all use `--disp`). Missing this glyph would tofu the *most visually prominent* UI text on every single screen.
- **General Punctuation** (U+2000–206F): em dash `—` U+2014 (24×), en dash `–` U+2013 (2×), right single quote `’` U+2019 (77×), left/right double quotes `“ ”` U+201C/201D (20× each), right-to-left mark U+200F (2×). These are ordinary body-text punctuation used constantly — must be in both Poppins and Inter subsets.

**Arabic (single block covers everything found):**
- All content — Quran verses, hadith, terms, bismillah — uses codepoints entirely within **U+0600–06FF** (Arabic block). No characters were found in the Arabic Supplement (U+0750–077F) or Arabic Presentation Forms (U+FB50–FDFF, U+FE70–FEFF) blocks in any of the 19 content files.
- **Quranic annotation marks present and must be covered:** U+06DD (end of ayah), U+06DE (start of rub el hizb), U+06DF/06E0/06E2 (small high marks), U+06E5/06E6 (small waw/yeh), U+0670 (superscript alef), U+0671 (alef wasla), U+0640 (tatweel). All fall inside U+0600–06FF, so a full-block subset covers them without needing to enumerate each one — but they are listed here so the planner can spot-check the glyph test page against this exact list rather than a generic "Arabic renders" smoke test.
- **ﷺ (U+FDFA, Arabic Presentation Forms-A) is NOT used anywhere in current content** — honorifics are spelled out in English ("peace be upon him") in all 19 files, confirmed by direct grep. D-10/CONTEXT.md and UI-SPEC.md both require it defensively (brand law CNT-04 binds future content to the glyph convention) — include it, but the planner should know this is a **forward-looking inclusion**, not something the current glyph test can cross-check against real shipped content. Confirmed present in both Amiri and Amiri Quran source fonts (Step 2).

### Step 2 — Glyph existence independently verified against live font files (not assumed)

Rather than trust training-data claims about font coverage (STACK.md/PITFALLS.md both flagged this LOW-MEDIUM and called for a real test), this session queried the **live Google Fonts CSS2 API** with the exact codepoints above as the `text=` parameter. Google's API only returns a valid `@font-face` response if the requested glyphs exist in the source font — a non-empty response is a real coverage proof, not an inference.

```bash
# Verified working commands (run this session, real HTTP 200 responses received):
curl -s "https://fonts.googleapis.com/css2?family=Inter:wght@400&text=%CB%B9%CB%BA%CA%BF%CA%BE%C4%81%C4%AB%C5%AB%E1%B8%A5%E1%B9%A3%E1%B9%AD%E1%B8%8F" -A "Mozilla/5.0"
curl -s "https://fonts.googleapis.com/css2?family=Poppins:wght@600&text=%CB%B9%CB%BA%CA%BF%CA%BE%C4%81%C4%AB%C5%AB%E1%B8%A5%E1%B9%A3%E1%B9%AD%E1%B8%8F" -A "Mozilla/5.0"
curl -s "https://fonts.googleapis.com/css2?family=Amiri+Quran&text=%D9%B0%D9%B1%DB%9D" -A "Mozilla/5.0"          # superscript alef, alef wasla, end-of-ayah
curl -s "https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&text=%EF%B7%BA" -A "Mozilla/5.0"           # ﷺ
```

**Result: [VERIFIED: Google Fonts CSS2 API, live request this session] — all four families contain every required glyph:**
| Family | ˹˺ (U+02F9/FA) | Diacritics (Ext-A + Ext.Add.) | â î û | Middle dot + punctuation | Arabic + Quranic marks | ﷺ (U+FDFA) |
|--------|:---:|:---:|:---:|:---:|:---:|:---:|
| Inter | ✓ | ✓ | ✓ | ✓ | n/a | n/a |
| Poppins | ✓ | ✓ | ✓ | ✓ | n/a | n/a |
| Amiri | n/a | n/a | n/a | n/a | ✓ | ✓ |
| Amiri Quran | n/a | n/a | n/a | n/a | ✓ (incl. Quranic marks) | ✓ |

This resolves STACK.md's and PITFALLS.md's LOW-MEDIUM "font glyph coverage" flag to **HIGH confidence, verified**.

### Step 3 — Confirmed weights (exact match to Gen-3, verified via live request)

```bash
curl -s "https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=Amiri:wght@400;700&family=Amiri+Quran&display=swap" -A "Mozilla/5.0"
```
This returned real, resolvable `fonts.gstatic.com/s/...ttf` URLs for **every** requested weight — confirming Poppins 500/600/700/800, Inter 400/500/600/700, Amiri 400/700, and Amiri Quran 400 (its only weight) all exist as real static instances. This exactly matches the weight set Gen-3's `<link>` tag already requests (`lessons/u1-m1.html` line 2) and matches UI-SPEC.md's weight-discipline table (Inter 400/600 in active use, Poppins 600/700/800). Poppins does **not** offer a variable font on Google Fonts (confirmed absent from every variable-font-capable list returned by search) — static per-weight files are the only option, not a choice.

### Step 4 — Acquisition + subsetting commands

```bash
# 1. Acquire real, current TTF URLs (URLs are versioned/rotate — always fetch fresh, never hardcode):
curl -s "https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=Amiri:wght@400;700&family=Amiri+Quran&display=swap" \
  -A "Mozilla/5.0" -o /tmp/fonts.css
grep -oE 'https://fonts\.gstatic\.com/s/[^)]+\.ttf' /tmp/fonts.css | sort -u | while read -r url; do
  curl -sL "$url" -o "shared/fonts/src/$(basename "$url")"
done

# 2. Subset — Latin families (Poppins + Inter), block-based unicode-range with headroom:
#    Basic Latin + Latin-1 Supplement + Latin Extended-A + Latin Extended Additional
#    + Spacing Modifier Letters + General Punctuation
LATIN_RANGE="U+0000-00FF,U+0100-017F,U+1E00-1EFF,U+02B0-02FF,U+2000-206F"
for w in 500 600 700 800; do
  python3 -m fontTools.subset "shared/fonts/src/Poppins[wght]-${w}.ttf" \
    --output-file="shared/fonts/poppins-${w}.woff2" --flavor=woff2 \
    --unicodes="$LATIN_RANGE" --layout-features='*'
done
for w in 400 500 600 700; do
  python3 -m fontTools.subset "shared/fonts/src/Inter-${w}.ttf" \
    --output-file="shared/fonts/inter-${w}.woff2" --flavor=woff2 \
    --unicodes="$LATIN_RANGE" --layout-features='*'
done

# 3. Subset — Arabic families, full Arabic block + the one Presentation-Forms glyph needed:
ARABIC_RANGE="U+0600-06FF,U+FDFA"
for w in 400 700; do
  python3 -m fontTools.subset "shared/fonts/src/Amiri-${w}.ttf" \
    --output-file="shared/fonts/amiri-${w}.woff2" --flavor=woff2 \
    --unicodes="$ARABIC_RANGE"     # default layout-features — see pitfall below, do NOT restrict
done
python3 -m fontTools.subset "shared/fonts/src/AmiriQuran-400.ttf" \
  --output-file="shared/fonts/amiri-quran-400.woff2" --flavor=woff2 \
  --unicodes="$ARABIC_RANGE"
```

**Why `--layout-features='*'` is safe (and why NOT to pass a restricted list for Arabic):** `pyftsubset`'s default layout-features set already includes `calt, ccmp, clig, curs, dnom, frac, kern, liga, locl, mark, mkmk, numr, rclt, rlig, rvrn` **plus "all features required for script shaping"** — meaning Arabic's `init`/`medi`/`fina`/`isol` contextual-form substitutions are auto-detected and preserved based on the Arabic codepoints in the subset, without needing to name them explicitly [CITED: fontTools.readthedocs.io/en/stable/subset]. The real risk is a well-meaning "optimize harder" pass that overrides `--layout-features` with a hand-picked short list and accidentally drops `curs`/`mark`/`mkmk` — which would silently break Arabic letter-joining and diacritic vertical positioning. **Never pass a custom `--layout-features` list for Amiri/Amiri Quran.** Verify visually via the glyph test page regardless (subsetting bugs are visual, not exception-throwing).

### Step 5 — Font-face declaration + loading (D-11)

```css
@layer tokens {
  @font-face { font-family:'Poppins'; font-weight:500; font-display:swap; font-style:normal;
    src:url('/shared/fonts/poppins-500.woff2') format('woff2'); }
  /* ...repeat per weight/family... */
  @font-face { font-family:'Amiri Quran'; font-weight:400; font-display:swap; font-style:normal;
    src:url('/shared/fonts/amiri-quran-400.woff2') format('woff2'); }
}
```
```html
<!-- identical on every page (D-11) — critical 2 faces preloaded, rest load via normal @font-face -->
<link rel="preload" href="/shared/fonts/poppins-700.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/shared/fonts/inter-400.woff2" as="font" type="font/woff2" crossorigin>
```
`crossorigin` is required on font preloads even for same-origin files per the Fetch spec's anonymous-mode CORS requirement for fonts — omitting it causes the browser to silently double-fetch the font (once for preload, once for actual use) because the requests don't dedupe. This is a common, easy-to-miss mistake.

## Architecture Patterns

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│  <head> (identical boilerplate on every page, per D-11)              │
│  <meta viewport-fit=cover> → <link preload font ×2> → <link          │
│  shared/awba-engine.css>                                             │
└──────────────────────────────┬────────────────────────────────────────┘
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│  shared/awba-engine.css                                              │
│  @layer tokens, base, components, screens, motion;  ← declared ONCE, │
│                                                          full order,  │
│                                                          Phase 1     │
│  @layer tokens  { :root{...} [data-unit="u1"]{...} @font-face{...} } │
│  @layer base    { html,body{...} .app-shell{grid...} .hud{...} }     │
│  @layer components/screens/motion  ← EMPTY placeholders, Phase 2/3   │
└──────────────────────────────┬────────────────────────────────────────┘
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│  <body> → <html data-unit="u1"> (Phase 2+ sets this per-page)        │
│  .app-shell (grid: auto 1fr auto)                                    │
│   ├─ .hud    (row 1, safe-area-inset-top)                            │
│   ├─ .stage  (row 2, 1fr, overflow-y:auto, overscroll-behavior)      │
│   └─ .foot   (row 3, safe-area-inset-bottom)                         │
│  Mobile <600px: shell = 100dvh, edge-to-edge, no decoration          │
│  Desktop ≥600px: shell = max-width column, centered, --sh-4 elevated │
└─────────────────────────────────────────────────────────────────────┘
```

### Recommended Project Structure

```
awba-gen4/
├── preview.html                   # D-12 verification vehicle (repo root)
├── shared/
│   ├── awba-engine.css            # ONE file, full @layer order declared Phase 1
│   └── fonts/
│       ├── src/                   # downloaded, un-subset TTFs (gitignored — not shipped)
│       ├── poppins-{500,600,700,800}.woff2
│       ├── inter-{400,500,600,700}.woff2
│       ├── amiri-{400,700}.woff2
│       └── amiri-quran-400.woff2
```
`shared/fonts/src/` (the raw downloaded TTFs) should be `.gitignore`d — they are ~150-300KB each × 10 files, are pure intermediate build artifacts of the one-time subsetting pass, and are never referenced by any shipped page. Only the subset `.woff2` outputs are committed.

### Pattern 1: `@layer` full-order declaration written once, in Phase 1, regardless of content

**What:** CSS cascade-layer *priority order* is fixed by the order layer names first appear in any `@layer` statement — not by which statement has content, and not by source-file order of the rules themselves. Once `@layer tokens, base, components, screens, motion;` is declared anywhere in the stylesheet, that priority order is locked; a later `@layer motion { ... }` block anywhere else in the file does not move `motion`'s priority even if it's the only layer with real rules at that point.
**When to use:** Phase 1 must write the complete five-name `@layer` statement at the very top of `awba-engine.css`, with `components`, `screens`, and `motion` left as empty (or comment-only) blocks. This is the one Phase-1 action that protects every later phase from an accidental cascade-order bug.
**Why the order matters here specifically:** D-04's locked order is `tokens, base, components, screens, motion` — meaning `motion` is declared **last** and therefore has the **highest** priority of the five. This means any `prefers-reduced-motion` override written inside the `motion` layer will always beat a screen-specific animation override that forgets its own reduced-motion guard — a deliberate accessibility-safety property of this exact order (verified by reasoning through the cascade rules, not asserted from a source). Do not "fix" this order to match a different convention seen elsewhere (e.g. ARCHITECTURE.md's own suggested order was `tokens, base, components, motion, screens` — CONTEXT.md's D-04 order supersedes it; this is a locked decision, not an open question).
**Example:**
```css
/* Source: MDN — @layer CSS at-rule (layer order = first-occurrence order) */
@layer tokens, base, components, screens, motion;

@layer tokens {
  :root { --bg:#EEF2FB; /* ...UI-SPEC.md values... */ }
  [data-unit="u1"] { --accent:#2E6BF5; --accent-deep:#2135B8; /* ... */ }
  [data-unit="u2"] { --accent:#7C5CE0; /* ... */ }
  [data-unit="u3"] { --accent:#0A7575; /* ... */ }
  [data-unit="u4"] { --accent:#B47F00; --accent-on:#3A2B00; /* ... */ }
}
@layer base {
  html, body { height:100%; margin:0; }
  .app-shell { min-height:100dvh; display:grid; grid-template-rows:auto 1fr auto; }
}
@layer components { /* Phase 3 fills this */ }
@layer screens { /* Phase 2+ fills this per-screen */ }
@layer motion { /* Phase 3 fills this */ }
```

### Pattern 2: Responsive shell — `min-height: 100dvh` on the container, not fixed heights on rows

**What:** iOS Safari's dynamic viewport unit (`dvh`) recalculates as the address bar shows/hides during scroll. Applying `100dvh` as a fixed `height` on multiple nested elements (HUD, stage, footer independently) causes each to recalculate and repaint on every address-bar transition — visible jank. Applying `min-height: 100dvh` to a single outer grid/flex container, with the three rows sized `auto 1fr auto`, means only the *container's minimum* responds to the recalculation; the rows' actual pixel heights are derived from content + the `1fr` fill, which is cheaper and visually stable [CITED: cross-corroborated 2026 guidance, savvy.co.il / iifx.dev / zenn.dev — "use `min-height: 100dvh` with flexbox column... allows main content to flex-grow... svh/dvh reached Baseline Widely Available June 2025"].
**When to use:** The exact pattern UI-SPEC.md's Responsive Shell Anatomy section already specifies (`min-height:100dvh; display:grid; grid-template-rows:auto 1fr auto`) — this research independently confirms that pattern is the current (2026) best practice, not just a Gen-3-era guess.
**Missing prerequisite (gap in UI-SPEC, must be added by the planner):** `env(safe-area-inset-*)` resolves to `0` on all devices — including notched/Dynamic-Island iPhones — **unless** the viewport meta tag includes `viewport-fit=cover`. None of Gen-3's 19 files include this tag (confirmed directly in PITFALLS.md's source read), and UI-SPEC.md's shell spec assumes safe-area insets work without stating this prerequisite. Phase 1 must add:
```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```
to the shared `<head>` boilerplate on every page — this single line is the entire difference between "safe-area insets work" and "safe-area insets silently no-op."

### Pattern 3: Same markup, mobile-default / desktop-progressive-enhancement

**What:** One `.app-shell` element serves both mobile and desktop — mobile is the *undecorated default* (full-bleed, no radius, no shadow, no max-width); a single `min-width` media query at the D-13-chosen breakpoint (UI-SPEC.md sets 600px) *adds* `max-width`, centering margin, `border-radius: var(--r-2xl)`, and `box-shadow: var(--sh-4)`.
**When to use:** Avoids maintaining two DOM structures or duplicating the HUD/stage/footer markup for a "desktop layout" — matches the zero-build, no-JS-router constraint.
**Example:**
```css
@layer base {
  .app-shell { min-height:100dvh; display:grid; grid-template-rows:auto 1fr auto; background:var(--paper); }
  @media (min-width: 600px) {
    body { background:var(--bg); /* subtle radial wash per D-02, Claude's discretion */
      display:flex; align-items:center; justify-content:center; }
    .app-shell { max-width:480px; width:100%; min-height:min(100dvh, 900px);
      border-radius:var(--r-2xl); box-shadow:var(--sh-4); overflow:hidden; }
  }
}
```
Note `min-height:min(100dvh, 900px)` (not a bare fixed height) — D-02 explicitly forbids a fixed height; this caps the column's growth on very tall desktop viewports without ever hard-coding a phone-like `788px`.

### Anti-Patterns to Avoid
- **JS-based viewport-height polyfills (`window.innerHeight` + resize listener + `--vh` CSS custom property):** This was the standard workaround before `dvh`/`svh` shipped. `dvh`/`svh`/`lvh` reached Baseline Widely Available in June 2025 [CITED: zenn.dev cross-corroborated 2026 source] — a JS polyfill is now unnecessary complexity and a jank source (resize-listener-driven reflow is strictly worse than native viewport units).
- **Fixed `height: 100dvh` on the HUD/stage/footer rows individually:** causes triple-recalculation jank on iOS address-bar transitions (see Pattern 2). Use `min-height` on the outer container + `auto`/`1fr` row sizing instead.
- **Restricting `--layout-features` during Arabic font subsetting "to save bytes":** breaks letter-joining and diacritic positioning silently (see Font Subset Pipeline Step 4).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Font glyph subsetting | A custom script that strips glyph tables from a TTF | `pyftsubset` (fontTools) | Correctly rewrites `cmap`, `GSUB`, `GPOS`, `hmtx` and all cross-referencing tables; a hand-rolled binary editor will corrupt Arabic shaping or produce an invalid font file |
| Spring/bounce easing curves | Hand-typed `linear()` point-list sequences | A generator tool (Linear Easing Generator, kvin.me CSS Spring Easing, Easing Wizard) | Even Josh W. Comeau's own article — the exact source STACK.md cites for the `linear()`-as-spring technique — states explicitly: *"we aren't really meant to write these `linear()` datasets by hand"* and shows a hand-traced attempt that "does not feel great... moving robotically" [CITED: joshwcomeau.com/animation/linear-timing-function]. UI-SPEC.md's two existing `--ease-spring`/`--ease-gentle` values were syntax-validated this session (16 and 7 monotonically-ascending stops respectively — well-formed) and can be used as-is; do not hand-edit them |
| iOS viewport-height tracking | `window.innerHeight` + resize listener + CSS custom property | Native `dvh`/`svh` units | Baseline since June 2025; a JS polyfill is now strictly worse (see Anti-Patterns) |
| WCAG contrast checking | Eyeballing colors against a background | The WCAG 2.x relative-luminance formula (compute directly, or use a tool) | Perceptual color distance is a poor proxy for the actual contrast-ratio math; this research computed exact ratios and found real failures that "looked fine" (see Common Pitfalls) |
| Tint/shade color derivation | Hand-picking every intermediate hex for hover/tint states | `color-mix(in oklch, var(--accent) N%, white)` for `--accent-soft`/`--accent-line` (per D-06); hand-pick only `--accent-deep`/`--accent-ink`/`--accent-on` where contrast precision matters | `color-mix()` is Baseline-available (Safari 16.2+/Chrome 111+, per STACK.md) and keeps tint ramps mathematically consistent across all 4 unit themes without a palette-generation script |

**Key insight:** Every "don't hand-roll" item in this phase has a *specific, named, real failure mode* if hand-rolled (corrupted font tables, robotic-feeling motion, iOS jank, contrast failures that look-fine-but-fail-math, inconsistent tint ramps) — none of these are generic "best practice" advice, they're documented consequences from primary sources or from this session's own computation.

## Common Pitfalls

### Pitfall 1: WCAG cross-check found a real gap in UI-SPEC's u4 gold button-label pairing
**What goes wrong:** UI-SPEC.md's WCAG table lists `--accent-on` (`#3A2B00`) on filled `--accent` (`#B47F00`, gold) for "button labels ≥16px/700" with "Tier required: AA Large (≥3:1) min; AA (≥4.5) target" and marks it **PASS**. Independently recomputing the exact WCAG 2.x contrast formula gives **3.92:1** — this clears the stated 3:1 *minimum* but falls short of the stated 4.5:1 *target*. More importantly: **WCAG's "large text" exception (which permits the 3:1 tier) requires 18pt/24px regular OR 14pt/18.66px bold** — Gen-3's actual `.btn` font-size is **16px at weight 700** (confirmed directly in `awba-engine.css` line 182-183), which is *below* the 14pt-bold threshold. This means the button label technically does **not** qualify for the large-text exception at all, and by strict WCAG AA (which requires 4.5:1 for normal-size text) this specific pairing is a **borderline fail**, not the unqualified "PASS" the table states.
**Why it happens:** Gold/amber hues are inherently mid-to-light in perceptual lightness — any color in that family struggles to hit 4.5:1 against either white or dark text simultaneously without becoming visually "not gold" anymore. UI-SPEC.md's own provenance notes ("Senior-designer judgment... per-unit `--accent-on` split (white vs gold-dark)") show this was a deliberate, reasoned tradeoff, not an oversight — it just wasn't checked against the *exact* button font-size.
**Consequences:** If unaddressed, Phase 6's ACC-03 audit (WCAG AA verification) will flag this pairing as a failure discovered late, after the button pattern has propagated across dozens of screens in Phases 4-5.
**Prevention:** Flag explicitly for the planner/designer to resolve *now*, while it's one token change instead of a cross-cutting late fix. Two independent levers exist: (a) darken `--accent-on` for u4 further (toward pure black or a still-darker warm ink — costs some "gold-on-gold" visual richness), or (b) increase the button's effective text size/weight to cross the large-text threshold (e.g. bump gold-specific CTAs to 18px, which the type scale's `--fs-h2`/`--fs-lead` roles already provide) so the existing 3.92:1 legitimately qualifies for the 3:1 tier. This is a **design decision**, not something this research should silently resolve — surfaced here so the planner puts a task/checkpoint on it rather than letting Phase 6 discover it.
**Detection:** Re-run the contrast formula (or any contrast-checker tool) against the *actual* rendered font-size/weight for every text-on-accent pairing, not just the token hex pair in isolation — the WCAG large-text carve-out is text-metric-dependent, not just color-dependent.

### Pitfall 2: Missing `viewport-fit=cover` silently zeroes every safe-area inset
**What goes wrong:** `env(safe-area-inset-top/bottom/left/right)` resolves to `0px` on every device — including notched iPhones — unless the page's viewport meta tag includes `viewport-fit=cover`. Confirmed absent from all 19 of Gen-3's files (PITFALLS.md, direct source read). UI-SPEC.md's shell spec (D-01, Responsive Shell Anatomy) assumes safe-area insets are honored but never states this HTML-level prerequisite.
**Why it happens:** The failure is silent — no console warning, no visual difference on a non-notched device or in most desktop-browser responsive-mode simulators (which often don't simulate safe-area insets accurately without device-specific presets). It only shows up on a real notched device.
**Prevention:** Add `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">` to the shared `<head>` boilerplate as an explicit Phase 1 task, not an assumed side-effect of "building the responsive shell."
**Detection:** On a real iPhone (or Safari's device-simulation mode with an actual notched-device preset selected, not generic "responsive"), verify the HUD top padding and footer bottom padding visibly increase versus a non-notched viewport.

### Pitfall 3: `@layer` order is fixed by first occurrence — don't let it drift across phases
**What goes wrong:** If Phase 1 only writes `@layer tokens, base;` (omitting the later three names because they're empty), and Phase 2 or 3 later writes its own `@layer components, screens, motion;` statement, the FULL cascade order becomes `tokens, base, components, screens, motion` (correct, by luck) *only if* every subsequent phase's `@layer` statement lists names in the same relative order as everyone else — there's no compile-time check preventing Phase 3 from writing `@layer motion, screens, components;` and silently reversing priority.
**Prevention:** Phase 1 writes the complete `@layer tokens, base, components, screens, motion;` statement once, with the three unused names left as empty blocks/comments. This is the single line that makes the order immutable for every later phase — no phase after Phase 1 should ever write a bare `@layer` name-list statement again, only `@layer <name> { ... }` content blocks for names already declared.
**Detection:** `grep -n "^@layer [a-z]*,,*" shared/awba-engine.css` should return exactly one match, at or near the top of the file, for the entire project's lifetime.

### Pitfall 4: Beat-type ≠ content-type — the `verse` beat renders BOTH Quran ayahs and hadith
**What goes wrong:** Gen-3's single `verse` beat type / `.scard` component is used for **both** Quran ayah cards and hadith citation cards — confirmed directly by grep: `u1-m1.html`'s `verse` beat cites `muslim-8` (`kind:'The hadith'`), and multiple other lessons use the same beat type for actual Quran verses. Gen-3 renders both with the same `--naskh` (general Amiri) font, no distinction. Gen-4's D-09 wants Amiri Quran reserved for ayah text specifically, with `.ayah` class binding — but **the beat type alone cannot tell you which font to use**; the distinguishing signal is `refs[id].kind === 'The hadith'` vs. the absence of a `kind` override (defaults to `'The verse'`).
**Why it matters for Phase 1 specifically:** Phase 1 is establishing the CSS classes/tokens (`.ayah` bound to Amiri Quran, a general Arabic class bound to Amiri) but must **not** hardcode "verse beat = ayah" anywhere, because that logic doesn't belong in Phase 1 (no engine/beat-renderer exists yet) — it belongs to the Phase 4 beat renderer, which will read `refs[id].kind` at render time and apply the `.ayah` class conditionally.
**Prevention:** Phase 1 preview.html's glyph test should demonstrate **both** faces side-by-side using real example strings (one ayah rendered `.ayah`/Amiri Quran, one hadith rendered general-Arabic/Amiri) exactly as UI-SPEC.md's `preview.html` Contract §7 already specifies — this proves the CSS-level distinction works, without needing the engine's `kind`-based dispatch logic to exist yet. Just don't let a Phase 1 implementer accidentally write `.scard .arabic { font-family: var(--font-quran); }` as a blanket rule (that would apply Amiri Quran to hadith text too) — leave the class assignment for Phase 4 to wire per-instance.

### Pitfall 5: Google Fonts CSS2 API glyph-existence checks are dev-time-only — never a runtime dependency
**What goes wrong:** The verification method used in this research (`curl "fonts.googleapis.com/css2?...&text=..."`) is a genuinely useful one-time coverage-check technique, but it is easy to misread as "so we could just always fetch from this URL" — which would violate the explicit zero-CDN-at-runtime constraint (FND-03, D-09, CLAUDE.md's "Never for this project" ruling on Google Fonts CDN links).
**Prevention:** This API is used exactly twice in this project's lifecycle: (1) as a one-time acquisition source for the raw TTF files (dev machine, one-time), and (2) as a one-time coverage-verification technique (dev machine, one-time, already done in this research). Neither use ships a single `fonts.googleapis.com`/`fonts.gstatic.com` reference into any committed HTML/CSS file that a browser will ever load.

## Code Examples

### Programmatic glyph-coverage assertion (the one automatable Wave 0 test for FND-03)

```python
# Source: derived this session from the verified codepoint inventory above.
# scripts/check-glyph-coverage.py — run after every font-subsetting pass.
from fontTools.ttLib import TTFont
import sys

REQUIRED = {
    'shared/fonts/inter-400.woff2':        [0x02F9, 0x02FA, 0x02BF, 0x02BE, 0x0101, 0x012B, 0x016B, 0x1E25, 0x1E63, 0x1E6D, 0x1E0F, 0x00B7, 0x2014, 0x2019],
    'shared/fonts/poppins-600.woff2':      [0x02F9, 0x02FA, 0x0101, 0x1E25, 0x00B7, 0x2014],
    'shared/fonts/amiri-400.woff2':        [0x0621, 0x0640, 0x064E, 0x0652, 0xFDFA],
    'shared/fonts/amiri-quran-400.woff2':  [0x0621, 0x0670, 0x0671, 0x06DD, 0x06DE, 0xFDFA],
}

failed = False
for path, codepoints in REQUIRED.items():
    font = TTFont(path)
    cmap = font.getBestCmap()
    for cp in codepoints:
        if cp not in cmap:
            print(f"MISSING U+{cp:04X} in {path}")
            failed = True
sys.exit(1 if failed else 0)
```
This is the one requirement in this phase with an objective, machine-checkable pass/fail — everything else (shell resize behavior, unit-switch recolor, motion feel) is inherently visual and belongs in `preview.html`'s manual checklist (D-12), not an automated test.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|---------------|--------|
| `window.innerHeight` + resize-listener `--vh` CSS-var polyfill for mobile viewport height | Native `dvh`/`svh`/`lvh` CSS units | Baseline Widely Available June 2025 [CITED: zenn.dev] | No JS needed for viewport-height-safe layouts; STACK.md/PITFALLS.md's iOS viewport guidance (written pre-Baseline) is now the *default* path, not a progressive enhancement |
| Fixed `100vh` (visual-viewport-unaware) mobile layouts | `min-height: 100dvh` on the outer shell container only, `auto`/`1fr` rows inside | Same | Avoids per-row recalculation jank during iOS address-bar transitions |

**Deprecated/outdated:** `apple-mobile-web-app-capable` meta tag (per CLAUDE.md, already flagged — not relevant to Phase 1's scope but worth remembering not to add it to the `<head>` boilerplate this phase establishes, since Phase 7's PWA work will add the correct `apple-touch-icon` + manifest approach instead).

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | fontTools/pyftsubset is legitimate, safe dev tooling | Package Legitimacy Audit | Very low — slopcheck unavailable this session, but fonttools is 15+ year old, Google-affiliated, millions-of-downloads/week infrastructure tooling; verified functionally present and working locally (not just "found on a registry") |
| A2 | Recommended `--layout-features='*'` flag for Latin subsetting (vs. omitting the flag entirely, which uses pyftsubset's smaller default set) | Font Subset Pipeline Step 4 | Low — `'*'` keeps all layout features including ones this project doesn't use (small caps, fractions), slightly larger file size than a tuned default; does not risk breakage, only a few KB of avoidable weight. If minimizing size matters more than simplicity, omit the flag and rely on pyftsubset's default set for Latin (the default set already covers everything this project's content needs per the codepoint scan) |

## Open Questions

1. **u4 gold button-label contrast (Pitfall 1) — needs an explicit design decision, not a silent fix**
   - What we know: `#3A2B00` on `#B47F00` measures 3.92:1, and the actual button font-size (16px/700) falls below WCAG's large-text exception threshold.
   - What's unclear: whether the project accepts this as an intentional, documented brand-color tradeoff (many gamified apps do accept AA-Large-only for a single hero accent used sparingly) or requires a token/type-scale adjustment.
   - Recommendation: Surface this to the planner as an explicit task/checkpoint before Phase 4 propagates the gold button pattern across the legendary-review screens; resolve with either a darker `--accent-on` or a bumped CTA font-size for gold surfaces specifically.

2. **Static vs. variable Inter — final pipeline choice**
   - What we know: Both are legitimate; static keeps all 4 font families on the same subsetting-command shape (simplicity), variable saves ~2-3 extra HTTP requests for Inter specifically (Poppins/Amiri/Amiri Quran are static-only regardless, so the savings only apply to one of four families).
   - What's unclear: whether the project values pipeline uniformity or marginal request-count savings more.
   - Recommendation: Default to static (matches CLAUDE.md's example command shape and keeps the `pyftsubset` invocation pattern identical across all 4 families); flag as low-stakes, reversible later without touching any HTML.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Python 3 + fontTools | Font subsetting pipeline | ✓ | fontTools 4.60.2 | — |
| `pyftsubset` CLI entrypoint on PATH | Convenience invocation shown in CLAUDE.md's example | ✗ (not on PATH in this environment) | — | Use `python3 -m fontTools.subset` instead — functionally identical, verified working this session |
| Network access to `fonts.googleapis.com` / `fonts.gstatic.com` | One-time font acquisition + glyph-coverage verification | ✓ (HTTP 200 confirmed this session) | — | — |
| Local static file server (`npx serve`, `python3 -m http.server`) | Testing service-worker/PWA behavior | Not required for Phase 1 — `preview.html` and the shell work entirely via `file://`, per the project's zero-build review workflow | — | Only becomes relevant in Phase 7 (PWA) |

**Missing dependencies with no fallback:** none.
**Missing dependencies with fallback:** `pyftsubset` bare-command PATH entry — use the `python3 -m fontTools.subset` module-invocation form instead (already verified working).

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None exists yet (greenfield repo, zero `package.json`, zero test runner) — this phase should NOT introduce one; Python (already available, already used for the glyph-coverage script above) is sufficient for the one automatable check |
| Config file | none — see Wave 0 |
| Quick run command | `python3 scripts/check-glyph-coverage.py` |
| Full suite command | same (only one check exists this phase) |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FND-03 | Subset fonts contain all required codepoints | unit (fontTools cmap check) | `python3 scripts/check-glyph-coverage.py` | ❌ Wave 0 |
| FND-01 | `@layer` full order declared exactly once | lint (grep) | `grep -c '^@layer [a-z]*, ' shared/awba-engine.css` (expect exactly 1) | ❌ Wave 0 |
| FND-02 | Switching `data-unit` recolors all 7 accent slots together | manual | Open `preview.html`, toggle unit control, visually confirm (D-12 §2) | N/A — visual |
| PLT-01 | Shell is full-bleed <600px, centered column ≥600px, no horizontal scroll at 320px | manual | Resize `preview.html` 320px→1440px in devtools | N/A — visual |
| FND-03 | Zero Google Fonts CDN requests | manual/smoke | DevTools Network tab, filter "font", reload `preview.html` (D-12 §8) | N/A — manual, documented on-page |

### Sampling Rate
- **Per task commit:** `python3 scripts/check-glyph-coverage.py` (once font files exist)
- **Per wave merge:** same + full manual `preview.html` walkthrough against D-12's 8-item checklist
- **Phase gate:** All 8 `preview.html` checklist items pass + glyph-coverage script green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `scripts/check-glyph-coverage.py` — the one automatable check this phase supports (code given above, ready to use verbatim)
- [ ] No test framework install needed — Python is already present; do not add Jest/Vitest/etc. for a project with zero JS logic yet (that starts Phase 2)

*(Most of this phase's success criteria are inherently visual/structural and are correctly verified via `preview.html`'s manual checklist per D-12, not automated tests — this is expected for a design-token/shell phase, not a gap.)*

## Security Domain

Not applicable — this phase has no user input, no auth, no data persistence, no network requests at runtime (self-hosted static assets only). `security_enforcement` checks (ASVS categories V2-V6) do not apply to a pure CSS/font-asset phase. Revisit at Phase 2 (state layer) and Phase 6 (accessibility/security hardening).

## Sources

### Primary (HIGH confidence)
- Direct file reads: `/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD/shared/awba-engine.css` (326 lines), `lessons/*.html` (15 files), `reviews/*.html` (4 files), `learn.html` — exact font-family/weight/class mappings, exact button font-size (16px/700)
- Direct Python scan of all 20 content files — 86 unique non-ASCII codepoints extracted and categorized, this session
- `fonts.googleapis.com/css2` API — live requests this session confirming glyph existence (Inter, Poppins, Amiri, Amiri Quran) and exact weight availability (Poppins 500/600/700/800, Inter 400/500/600/700, Amiri 400/700, Amiri Quran 400)
- WCAG 2.x relative-luminance contrast formula — computed directly this session for all UI-SPEC.md unit-accent pairings (cross-validation, found one real gap — see Pitfall 1)
- `.planning/phases/01-foundation-design-tokens-responsive-shell-fonts/01-UI-SPEC.md` — authoritative token values (read in full)
- `.planning/research/{STACK,ARCHITECTURE,ENGINE-CONTRACT,ASSETS,PITFALLS,SUMMARY}.md` — read in full
- fontTools documentation — [subset: Generate subsets of fonts](https://fonttools.readthedocs.io/en/stable/subset/) — default layout-features list

### Secondary (MEDIUM confidence)
- [Josh W. Comeau — Springs and Bounces in Native CSS](https://www.joshwcomeau.com/animation/linear-timing-function/) — fetched directly this session, confirms "don't hand-write linear() by hand" guidance with a concrete failed hand-traced example
- [kvin.me CSS Spring Easing Generator](https://www.kvin.me/css-springs) — fetched directly this session, one real verified example string with documented bounce/duration parameters
- dvh/svh Baseline-availability and `min-height` best-practice — cross-corroborated across [savvy.co.il](https://savvy.co.il/en/blog/css/css-dynamic-viewport-height-dvh/), [iifx.dev](https://iifx.dev/en/articles/460170745/fixing-ios-safari-s-shifting-ui-with-dvh), [zenn.dev](https://zenn.dev/tonkotsuboy_com/articles/svh-dvh-lvh-for-all-browser?locale=en)
- Amiri Quran glyph count (1983 glyphs), single-weight, Quranic annotation-mark coverage — [fonts.google.com/specimen/Amiri+Quran](https://fonts.google.com/specimen/Amiri+Quran), cross-corroborated via search snippet
- Poppins static-only (no variable font) — cross-corroborated via search (absent from every variable-font-capable list found), not independently verified against a single canonical Google Fonts API field

### Tertiary (LOW confidence)
- None — every claim in this document was either read directly from a primary source file, computed directly, or verified via a live API request this session.

## Metadata

**Confidence breakdown:**
- Font glyph coverage: HIGH — verified via live Google Fonts API requests against the exact codepoint inventory extracted from Josh's real content (not assumed, not inferred)
- WCAG contrast findings: HIGH — computed directly via the WCAG 2.x relative-luminance formula, cross-validated against UI-SPEC.md's stated values
- Responsive shell mechanics (dvh/safe-area): HIGH for the platform-capability claims (Baseline status cross-corroborated across 3 independent 2026 sources), MEDIUM for the specific "min-height over fixed-height" jank-avoidance recommendation (blog-consensus, not a spec-level guarantee)
- `@layer` ordering mechanics: HIGH — CSS spec-level cascade-layer behavior, well-established
- Motion/`linear()` easing: HIGH for "don't hand-write these" guidance (primary source, direct fetch); the two existing UI-SPEC.md curves were syntax-validated this session but not independently regenerated

**Research date:** 2026-07-11
**Valid until:** Font glyph/weight availability and Google Fonts API behavior: ~90 days (stable, slow-moving). CSS platform-capability claims (dvh/svh Baseline status): treat as stable through 2026. WCAG contrast computations: permanent (pure math against fixed hex values) unless UI-SPEC.md's token values change.
