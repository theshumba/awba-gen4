---
phase: 01-foundation-design-tokens-responsive-shell-fonts
plan: 01
subsystem: infra
tags: [fonttools, woff2, self-hosted-fonts, glyph-coverage, static-assets]

# Dependency graph
requires: []
provides:
  - "scripts/check-glyph-coverage.py — fontTools cmap glyph-coverage gate for the 4 subset font families"
  - "11 self-hosted subset .woff2 fonts under shared/fonts/ (Poppins, Inter, Amiri, Amiri Quran)"
  - ".gitignore excluding shared/fonts/src/ raw TTF intermediates"
  - "Verified real-world glyph-coverage ground truth for Poppins vs Inter (corrects a RESEARCH.md false positive)"
affects: [01-02, 01-03, 01-04]

# Tech tracking
tech-stack:
  added: ["fontTools 4.60.2 (dev-tool only, python3 -m fontTools.subset — pyftsubset not on PATH)"]
  patterns:
    - "Font acquisition: curl fonts.googleapis.com/css2 (fresh URLs, never hardcoded) -> fonts.gstatic.com TTF download -> shared/fonts/src/ (gitignored)"
    - "Subsetting: python3 -m fontTools.subset --flavor=woff2, Latin range with --layout-features='*', Arabic range with NO custom --layout-features (preserves default Arabic shaping features)"
    - "Glyph-coverage gate: fontTools TTFont().getBestCmap() codepoint membership check, run after every subsetting pass"

key-files:
  created:
    - scripts/check-glyph-coverage.py
    - .gitignore
    - shared/fonts/poppins-{500,600,700,800}.woff2
    - shared/fonts/inter-{400,500,600,700}.woff2
    - shared/fonts/amiri-{400,700}.woff2
    - shared/fonts/amiri-quran-400.woff2
  modified: []

key-decisions:
  - "Corrected check-glyph-coverage.py's poppins-600.woff2 REQUIRED codepoint list after discovering RESEARCH.md's Google Fonts API glyph-existence check was a false positive for Poppins"
  - "Static per-weight Inter files (4x) used, not the Inter Variable font, for pipeline uniformity across all four families (matches RESEARCH.md's resolved Open Question #2)"

patterns-established:
  - "Font acquisition + subsetting pipeline is dev-time-only; raw TTFs never committed, only subset .woff2 outputs"
  - "Any future font-coverage claim must be verified by direct TTF/woff2 cmap inspection, not by a Google Fonts API 200-response alone"

requirements-completed: [FND-03]

# Metrics
duration: 20min
completed: 2026-07-12
---

# Phase 01 Plan 01: Font Asset Layer & Glyph-Coverage Gate Summary

**Self-hosted 11 subset .woff2 files (Poppins/Inter/Amiri/Amiri Quran) with a fontTools cmap glyph-coverage gate proving zero-CDN rendering of brackets, diacritics, and Arabic/Quranic marks — and corrected a real font-capability gap the phase research had wrongly verified as passing.**

## Performance

- **Duration:** ~20 min
- **Completed:** 2026-07-12T00:01:18Z
- **Tasks:** 2 completed
- **Files modified:** 13 (2 scaffold + 11 font binaries)

## Accomplishments
- Created `scripts/check-glyph-coverage.py`, the one automatable Wave-0 test for FND-03 (fontTools `getBestCmap()` codepoint membership check across 4 target `.woff2` files)
- Created `.gitignore` excluding `shared/fonts/src/` (raw TTF intermediates) and `.DS_Store`
- Confirmed the script correctly FAILED before any fonts existed (walking-skeleton RED step)
- Acquired all 11 raw TTFs from `fonts.gstatic.com` (fresh URLs fetched live this session, never hardcoded) via the Google Fonts CSS2 API
- Subset all 11 fonts to `.woff2` with `python3 -m fontTools.subset`: Poppins 500/600/700/800 and Inter 400/500/600/700 with the verified Latin range (`U+0000-00FF,U+0100-017F,U+1E00-1EFF,U+02B0-02FF,U+2000-206F`) and `--layout-features='*'`; Amiri 400/700 and Amiri Quran 400 with the verified Arabic range (`U+0600-06FF,U+FDFA`) and no custom `--layout-features` (preserves default Arabic shaping)
- Drove the glyph-coverage gate GREEN (exit 0, zero `MISSING` lines)
- Verified raw TTFs remain gitignored (`git status --porcelain shared/fonts/src` empty; `git check-ignore` confirms exclusion)

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold asset layer + create the (initially-failing) glyph-coverage gate** - `808f4c6` (feat)
2. **Task 2: Acquire + subset all four families → 11 committed .woff2, drive the gate GREEN** - `1d1b3df` (feat)

**Plan metadata:** (this commit)

## Files Created/Modified
- `scripts/check-glyph-coverage.py` - fontTools cmap glyph-coverage gate for Inter/Poppins/Amiri/Amiri Quran subsets
- `.gitignore` - excludes `shared/fonts/src/` raw TTF intermediates + `.DS_Store`
- `shared/fonts/poppins-{500,600,700,800}.woff2` - Poppins display subset (Latin + Latin-1 + Latin Ext-A/Additional + Spacing Modifier Letters + General Punctuation range)
- `shared/fonts/inter-{400,500,600,700}.woff2` - Inter body subset, same range (carries bracketed translations + full diacritic set)
- `shared/fonts/amiri-{400,700}.woff2` - Amiri general-Arabic subset (Arabic block + ﷺ)
- `shared/fonts/amiri-quran-400.woff2` - Amiri Quran `.ayah` subset (Arabic block + Quranic marks + ﷺ)

## Decisions Made
- **Static Inter (4 files) over Inter Variable**: keeps the subsetting command shape identical across all four font families (Poppins/Amiri/Amiri Quran are static-only regardless) — matches RESEARCH.md's resolved recommendation.
- **Corrected the glyph-coverage script's Poppins assertions rather than trying to force coverage that doesn't exist**: see Deviations below. This is the load-bearing decision of this plan.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Corrected `check-glyph-coverage.py`'s poppins-600.woff2 REQUIRED codepoint list — RESEARCH.md's glyph-verification method was a false positive**
- **Found during:** Task 2 (running the gate after subsetting — first real-world execution of the script)
- **Issue:** The verbatim script from 01-RESEARCH.md asserted Poppins-600 must contain `U+02F9`, `U+02FA` (Clear Quran corner brackets ˹˺) and `U+1E25` (ḥ, Latin Extended Additional). Running the gate against the real subset Poppins font failed with `MISSING U+02F9`, `MISSING U+02FA`, `MISSING U+1E25`. I independently verified via direct `fontTools` cmap inspection of all 4 raw Poppins TTF weights (500/600/700/800) that none of them contain these three codepoints anywhere in the font. I then re-ran RESEARCH.md's exact "live Google Fonts API" verification command (`curl "fonts.googleapis.com/css2?family=Poppins:wght@600&text=..."`) and additionally downloaded the actual font binary the API returned (`fonts.gstatic.com/l/font?kit=...`) — that real returned font contains only 11 glyphs, and the three disputed codepoints are absent from it too. This proves RESEARCH.md's verification method was flawed: a `200 OK` response from the Google Fonts CSS2 "text=" API does not prove per-glyph coverage — the API silently drops unavailable glyphs and returns a font anyway, rather than erroring. Inter (verified with the same method) has full coverage of every required codepoint across all 4 weights.
- **Fix:** Updated `scripts/check-glyph-coverage.py`'s `poppins-600.woff2` entry from `[0x02F9, 0x02FA, 0x0101, 0x1E25, 0x00B7, 0x2014]` to `[0x0101, 0x00B7, 0x2014]` — the three codepoints Poppins actually contains and needs (ā for transliteration, middle dot for citation/kicker separators, em dash for punctuation). The removed codepoints (brackets, ḥ) are covered by Inter's subset, which the CSS font-family fallback stack (`Poppins, Inter, ...`) will correctly substitute for any rare Poppins-styled string that needs them (e.g. a citation source line containing "Ḥujurāt") — this is standard, expected browser font-fallback behavior, not a workaround.
- **Files modified:** `scripts/check-glyph-coverage.py`
- **Verification:** `python3 scripts/check-glyph-coverage.py` now exits 0 with zero `MISSING` lines; re-ran `ast.parse` to confirm the file is still valid Python after the edit.
- **Committed in:** `1d1b3df` (Task 2 commit — the correction was made as part of driving the gate green, before that commit was created)

---

**Total deviations:** 1 auto-fixed (1 Rule 1 - bug in a research-supplied test assertion, corrected against real, independently-verified font binary data)
**Impact on plan:** Necessary for correctness — the plan's acceptance criteria required the gate to pass GREEN with the *real* subset fonts, and the real fonts cannot satisfy the original (incorrectly verified) assertion. No scope creep; the fix narrows a test assertion to match verified reality rather than expanding functionality. Flagging for later phases: 01-UI-SPEC.md's "Font Subset Contract" table also states Poppins should carry `U+02F9/02FA` — that table should be corrected in a future documentation pass, but Phase 1's actual shipped rendering behavior is unaffected because the font-family fallback stack handles it transparently.

## Issues Encountered
None beyond the deviation documented above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- `shared/fonts/` is complete: 11 subset `.woff2` files, glyph-coverage-verified, zero runtime CDN dependency established at the asset layer.
- `scripts/check-glyph-coverage.py` is ready to be re-run by any later phase that touches font subsets.
- Ready for 01-02 (design tokens / `@layer` stylesheet), which will consume these font files via `@font-face` declarations using the page-relative path rule documented in 01-RESEARCH.md Step 5.
- Flag for a future pass: 01-UI-SPEC.md's Font Subset Contract table's Poppins row should be corrected to remove the U+02F9/U+02FA/U+1E25 claim (documentation-only fix, not a build blocker — see Deviations above).

## Self-Check: PASSED

All 13 created files verified present on disk (`[ -f ]`); both task commits (`808f4c6`, `1d1b3df`) verified present in `git log`; all task-level `<acceptance_criteria>` and plan-level `<verification>` commands re-ran clean (`python3 scripts/check-glyph-coverage.py` exits 0, `ls shared/fonts/*.woff2 | wc -l` = 11, `git check-ignore shared/fonts/src/AnyFile.ttf` confirms exclusion).

---
*Phase: 01-foundation-design-tokens-responsive-shell-fonts*
*Completed: 2026-07-12*
