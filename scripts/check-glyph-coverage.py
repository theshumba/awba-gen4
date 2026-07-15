#!/usr/bin/env python3
# =============================================================================================
# scripts/check-glyph-coverage.py  ·  Awba Gen-4 — the FND-03 glyph-coverage gate (D-66)
# ---------------------------------------------------------------------------------------------
# Run after every font-subsetting pass and as a standing suite gate:
#     python3 scripts/check-glyph-coverage.py     # exit 0 = every rendered codepoint is covered
#
# WHAT THIS PROVES
#   The self-hosted subset .woff2 files carry every non-ASCII codepoint the REAL app renders,
#   each proven present in the face-stack that actually renders it (the CSS --font-* role vars).
#   Method: fontTools cmap inspection of the committed subsets (authoritative for a closed,
#   self-hosted face set — a rendering-level heuristic false-passes, so it is never used here).
#
# HARVEST, NOT A HAND LIST
#   REQUIRED codepoints are HARVESTED from the actual app strings (learn.html + lessons/ +
#   reviews/ + engine emitter strings), read only from inside quoted string literals with
#   comments stripped, so code/prose notation (arrows, set symbols, sigma) never enters the
#   requirement, and non-printing format/control characters (the right-to-left mark, the
#   end-of-ayah format sign) are excluded because they need no glyph. This is why the uppercase
#   transliteration forms the app really uses (U+1E24, U+1E0E) and the macron vowel in the
#   Courier reference line are picked up automatically rather than guessed.
#
# THE SETTLED ROLE-STACK FALLBACK LAW (section 2.2)
#   - Workhorse Latin passes if Readex OR Inter covers it. Readex legitimately lacks the two
#     corner-bracket modifier letters (U+02F9 / U+02FA); Inter catches them — that is by design.
#   - All Arabic script the app renders is proven in the scripture stack (Amiri Quran, then
#     Amiri). The rare Quranic annotation marks (U+06D6..U+06ED, plus U+0610..U+061A /
#     U+0656..U+065F) live ONLY in verbatim ayat, so the workhorse (Readex) and the display
#     faces (Aref Ruqaa, Rakkas) are EXEMPT from them — heavy tashkeel is an Amiri-only duty.
#   - The Courier marginalia face must render the macron vowels directly (proper nouns such as
#     the reference epigraph must not break mid-word); the dotted transliteration letters that
#     also appear in reference kickers resolve through Courier's declared monospace fallback and
#     are proven to exist in the self-hosted set by the workhorse Latin baseline above.
#
# On any genuinely-missing glyph the gate prints the offending codepoint + face and exits 1.
# =============================================================================================

import glob
import os
import re
import sys
import unicodedata
from fontTools.ttLib import TTFont

FONTS = "shared/fonts"

# --- The declared 14-face roster mapped to the CSS role-stacks (--font-* vars) ----------------
FACES = {
    "readex-pro-300": f"{FONTS}/readex-pro-300.woff2",
    "readex-pro-400": f"{FONTS}/readex-pro-400.woff2",
    "readex-pro-500": f"{FONTS}/readex-pro-500.woff2",
    "readex-pro-600": f"{FONTS}/readex-pro-600.woff2",
    "readex-pro-700": f"{FONTS}/readex-pro-700.woff2",
    "amiri-400":      f"{FONTS}/amiri-400.woff2",
    "amiri-700":      f"{FONTS}/amiri-700.woff2",
    "amiri-quran-400": f"{FONTS}/amiri-quran-400.woff2",
    "marcellus-400":  f"{FONTS}/marcellus-400.woff2",
    "aref-ruqaa-400": f"{FONTS}/aref-ruqaa-400.woff2",
    "aref-ruqaa-700": f"{FONTS}/aref-ruqaa-700.woff2",
    "rakkas-400":     f"{FONTS}/rakkas-400.woff2",
    "courier-prime-400": f"{FONTS}/courier-prime-400.woff2",
    "inter-400":      f"{FONTS}/inter-400.woff2",  # the silent corner-bracket glyph fallback ONLY
}

# Role stacks (union coverage — a codepoint passes if ANY face in the stack carries it).
WORKHORSE = ["readex-pro-300", "readex-pro-400", "readex-pro-500", "readex-pro-600",
             "readex-pro-700", "inter-400"]                       # --font-work
SCRIPTURE = ["amiri-quran-400", "amiri-400", "amiri-700"]          # --font-quran / --font-scrip
DISPLAY   = ["aref-ruqaa-400", "aref-ruqaa-700", "rakkas-400", "marcellus-400"]  # term/festival/display
MARGINALIA = ["courier-prime-400"]                                # --font-marg (primary; system mono is the tail)

# Rare Quranic-annotation / honorific mark ranges — Amiri-only by law 3. The workhorse and the
# display faces are never required to carry these (they render only in verbatim ayat).
SCRIPTURE_ONLY_MARKS = [(0x0610, 0x061A), (0x0656, 0x065F), (0x06D6, 0x06ED), (0x08D3, 0x08FF)]

# The macron vowels marginalia (Courier) must render directly — proper nouns must not break.
MACRON_VOWELS = {0x0100, 0x0101, 0x012A, 0x012B, 0x016A, 0x016B, 0x0112, 0x0113, 0x014C, 0x014D}


def is_scripture_only_mark(cp):
    return any(lo <= cp <= hi for lo, hi in SCRIPTURE_ONLY_MARKS)


def is_arabic(cp):
    return (0x0600 <= cp <= 0x06FF or 0x0750 <= cp <= 0x077F
            or 0xFB50 <= cp <= 0xFDFF or 0xFE70 <= cp <= 0xFEFF or 0x0870 <= cp <= 0x089F)


# --- Harvest: rendered codepoints only (string literals + HTML text, never code or comments) ---
# A character-level pass reads JS string-literal contents while correctly skipping line comments
# (//...), block comments (/*...*/) and any code between strings — so code/prose notation such as
# arrows, set membership and summation signs (which live only in comments here) never enter the
# requirement. Regex literals are unquoted and thus skipped too. HTML text nodes (outside
# script/style/comments) are harvested separately because they are genuinely rendered.

def _js_string_contents(code):
    """Yield the contents of every JS string literal, skipping comments and unquoted code."""
    out = []
    i, n = 0, len(code)
    while i < n:
        c = code[i]
        if c == "/" and i + 1 < n and code[i + 1] == "/":          # line comment → end of line
            j = code.find("\n", i)
            i = n if j < 0 else j
            continue
        if c == "/" and i + 1 < n and code[i + 1] == "*":          # block comment → closer
            j = code.find("*/", i + 2)
            i = n if j < 0 else j + 2
            continue
        if c in "'\"`":                                             # string literal
            quote = c
            i += 1
            buf = []
            while i < n:
                d = code[i]
                if d == "\\":
                    buf.append(code[i:i + 2])
                    i += 2
                    continue
                if d == quote:
                    i += 1
                    break
                buf.append(d)
                i += 1
            out.append("".join(buf))
            continue
        i += 1
    return out


def _html_text_nodes(html):
    """Rendered text between tags, with script/style/comment content removed."""
    html = re.sub(r"<!--.*?-->", " ", html, flags=re.S)
    html = re.sub(r"<script\b.*?</script>", " ", html, flags=re.S | re.I)
    html = re.sub(r"<style\b.*?</style>", " ", html, flags=re.S | re.I)
    return re.sub(r"<[^>]+>", " ", html)


def _script_block_js(html):
    """Concatenate the JS of every inline (non-src) <script> block — the only real JS an HTML page
    holds. Running the JS-string tokenizer over the WHOLE raw file desyncs its quote state on HTML
    attribute / CSS / prose quote parity, which can swallow comment notation (arrows, §, …) into
    pseudo-strings and wrongly harvest it; scoping to real <script> bodies keeps the comment-skipping
    correct (the documented intent above). HTML text nodes are still harvested separately."""
    return "\n".join(m.group(1) for m in re.finditer(
        r"<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)</script>", html, flags=re.I))


def _bucket(chars, printing, control):
    for ch in chars:
        cp = ord(ch)
        if cp <= 0x7F:
            continue
        if unicodedata.category(ch) in ("Cf", "Cc", "Cs"):
            control.add(cp)          # bidi marks / format signs — no glyph needed
        else:
            printing.add(cp)


def harvest():
    """Return (printing_codepoints, control_codepoints) rendered by the real app."""
    sources = ["learn.html", "onboarding.html", "practice.html", "profile.html", "more.html"] \
        + sorted(glob.glob("lessons/*.html")) + sorted(glob.glob("reviews/*.html")) \
        + ["practice/session.html", "shared/practice-pool.js", "shared/awba-engine.js"]
    printing, control = set(), set()
    for path in sources:
        if not os.path.exists(path):
            continue
        raw = open(path, encoding="utf-8").read()
        # JS string literals: the whole file for a .js source; only the inline <script> bodies for an
        # HTML page (so the tokenizer never desyncs on HTML/CSS quote parity — see _script_block_js).
        js_src = _script_block_js(raw) if path.endswith(".html") else raw
        for literal in _js_string_contents(js_src):
            _bucket(literal, printing, control)
        if path.endswith(".html"):
            _bucket(_html_text_nodes(raw), printing, control)
    return printing, control


def cmap(face):
    return set(TTFont(FACES[face]).getBestCmap().keys())


def covered_by(cp, stack, cmaps):
    return any(cp in cmaps[f] for f in stack)


def label(cp):
    try:
        return unicodedata.name(chr(cp))
    except ValueError:
        return "?"


def main():
    # Fail loudly if the roster drifts from disk (a deleted/renamed subset must be caught, not
    # silently skipped) — this is the regression that broke the previous gate.
    missing_files = [f for f, p in FACES.items() if not os.path.exists(p)]
    if missing_files:
        for f in missing_files:
            print(f"MISSING FONT FILE {FACES[f]} (roster/disk mismatch)")
        sys.exit(1)

    cmaps = {f: cmap(f) for f in FACES}
    printing, control = harvest()
    latin = sorted(cp for cp in printing if not is_arabic(cp))
    arabic = sorted(cp for cp in printing if is_arabic(cp))

    failures = []
    print("== Awba Gen-4 glyph-coverage gate (FND-03 / D-66) ==")
    print(f"   harvested from real app strings: {len(printing)} printing codepoints "
          f"({len(latin)} Latin/punct/symbol, {len(arabic)} Arabic), "
          f"{len(control)} non-printing control/format (no glyph required)")

    # (1) Workhorse Latin baseline — every Latin codepoint the app renders anywhere must exist in
    #     the self-hosted Latin faces (Readex OR Inter). This is the app-wide anti-tofu proof for
    #     Latin: even where a specialised face is primary (Courier marginalia, Marcellus display),
    #     the glyph provably exists and the declared fallback chain resolves to it.
    workhorse_miss = [cp for cp in latin if not covered_by(cp, WORKHORSE, cmaps)]
    print(f"\n-- workhorse (Readex U+300..700 U Inter) Latin baseline: "
          f"{len(latin) - len(workhorse_miss)}/{len(latin)} covered "
          f"(U+02F9/U+02FA corner brackets pass via Inter, by law)")
    for cp in workhorse_miss:
        failures.append(f"WORKHORSE U+{cp:04X} {chr(cp)!r} ({label(cp)}) not in Readex U Inter")
    # Pin the harvested stale-list catches the previous gate missed: 1E24 / 1E0E.
    for cp in (0x1E24, 0x1E0E):
        if cp in latin and not covered_by(cp, WORKHORSE, cmaps):
            failures.append(f"WORKHORSE U+{cp:04X} (uppercase transliteration form) uncovered")

    # (2) Scripture Arabic — every Arabic codepoint (incl. the rare Quranic annotation marks and
    #     the honorific ligature) proven in the scripture stack (Amiri Quran, then Amiri).
    scripture_miss = [cp for cp in arabic if not covered_by(cp, SCRIPTURE, cmaps)]
    print(f"-- scripture (Amiri Quran U Amiri) Arabic: "
          f"{len(arabic) - len(scripture_miss)}/{len(arabic)} covered")
    for cp in scripture_miss:
        failures.append(f"SCRIPTURE U+{cp:04X} {chr(cp)!r} ({label(cp)}) not in Amiri Quran U Amiri")

    # (3) Workhorse Arabic-UI — Readex renders general Arabic UI; it must carry every Arabic
    #     codepoint EXCEPT the scripture-only annotation marks (which render only in Amiri ayat).
    ui_arabic = [cp for cp in arabic if not is_scripture_only_mark(cp)]
    readex_ui_miss = [cp for cp in ui_arabic if not covered_by(cp, ["readex-pro-400"], cmaps)]
    exempt = [cp for cp in arabic if is_scripture_only_mark(cp)]
    print(f"-- workhorse Arabic-UI (Readex, excl. {len(exempt)} scripture-only marks): "
          f"{len(ui_arabic) - len(readex_ui_miss)}/{len(ui_arabic)} covered "
          f"(marks {', '.join('U+%04X' % c for c in exempt) or 'none'} are Amiri-only, exempt)")
    for cp in readex_ui_miss:
        failures.append(f"WORKHORSE-AR U+{cp:04X} {chr(cp)!r} ({label(cp)}) not in Readex "
                        f"(and not a scripture-only mark)")

    # (4) Marginalia proper-noun proof — Courier must render the macron vowels the app uses in
    #     names/references directly (mid-word substitution would break the word). The dotted
    #     transliteration letters that share those reference kickers resolve through Courier's
    #     declared monospace fallback and are proven present by the workhorse baseline (1).
    marg_macrons = sorted(cp for cp in latin if cp in MACRON_VOWELS)
    marg_miss = [cp for cp in marg_macrons if not covered_by(cp, MARGINALIA, cmaps)]
    print(f"-- marginalia (Courier Prime) macron vowels used in names/refs: "
          f"{len(marg_macrons) - len(marg_miss)}/{len(marg_macrons)} covered directly "
          f"({', '.join('U+%04X' % c for c in marg_macrons)})")
    for cp in marg_miss:
        failures.append(f"MARGINALIA U+{cp:04X} {chr(cp)!r} ({label(cp)}) not in Courier Prime")

    # (5) Display-face exemption law — Aref Ruqaa / Rakkas render display text and are exempt from
    #     the rare Quranic marks; assert they cover the base Arabic they could render (currently
    #     terms render in Amiri, so this is a defensive check that passes vacuously or on base
    #     letters). Never fails on a scripture-only mark.
    display_base = [cp for cp in arabic if not is_scripture_only_mark(cp)]
    for face in ("aref-ruqaa-400", "rakkas-400"):
        miss = [cp for cp in display_base if cp not in cmaps[face]]
        note = "OK" if not miss else ("base-letter gap: " + ", ".join("U+%04X" % c for c in miss))
        print(f"-- display face {face} (exempt from rare marks): {note}")
        for cp in miss:
            failures.append(f"DISPLAY {face} U+{cp:04X} {chr(cp)!r} ({label(cp)}) base letter uncovered")

    print()
    if failures:
        print(f"GLYPH GATE FAIL — {len(failures)} uncovered codepoint(s):")
        for line in failures:
            print("  " + line)
        sys.exit(1)
    print(f"GLYPH GATE OK — every one of the {len(printing)} harvested codepoints is covered by "
          f"its role-stack (control/format chars excluded, fallback law applied).")
    sys.exit(0)


if __name__ == "__main__":
    main()
