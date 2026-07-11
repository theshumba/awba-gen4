# Source: derived from the verified codepoint inventory in
# .planning/phases/01-foundation-design-tokens-responsive-shell-fonts/01-RESEARCH.md
# (Font Subset Pipeline / Code Examples section) — used verbatim per 01-PATTERNS.md.
#
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
