---
phase: 06-accessibility-rtl-typography-hardening
plan: 02
subsystem: testing
tags: [fonttools, cmap, glyph-coverage, rtl, bidi, unicode-bidi, headless-chrome, typography, fixture]

# Dependency graph
requires:
  - phase: 06-01
    provides: the a11y probe harness + the suite baseline (154 tests / 130 pass / 24 todo) this plan holds unchanged
  - phase: 03 (Athar re-cut)
    provides: the 14-face rationed roster + the CSS --font-* role-stacks + the shipped unicode-bidi isolate census
  - phase: 05
    provides: learn.html (the daily ayah — the live .ayah pin) + the 20 rendered lesson/review pages
provides:
  - "scripts/check-glyph-coverage.py — rewritten FND-03 glyph gate: 14-face roster, real-string codepoint harvest, cmap coverage proof, the encoded role-stack fallback law; exits 0"
  - "scripts/tests/rtl-audit.mjs — permanent CNT-04 exit-code gate: lang/dir/isolate + Quran-face + no-overflow census over 20 pages + the fixture"
  - "scripts/fixtures/typo-stress.html — neutral-copy typographic specimen: every face + the full diacritic/bracket/mark set + mixed-bidi, for the human tofu walk"
affects: [06-07 (phase gate re-runs these), 07 (PWA gate re-runs them; the fixture stays out of precache by location)]

# Tech tracking
tech-stack:
  added: []  # zero packages — python3 + fontTools + node + system Chrome all pre-present (zero-dep law)
  patterns:
    - "Real-string codepoint harvest via a character-level JS tokenizer that skips line/block comments — rendered text only, never code/prose notation"
    - "Role-stack union coverage + fallback law (readex ∪ inter; scripture-only marks exempt for display faces) as the cmap gate model"
    - "render-smoke-template exit-code gate with a read-only injected driver reading computed styles from all rendered pages"

key-files:
  created:
    - scripts/tests/rtl-audit.mjs
    - scripts/fixtures/typo-stress.html
  modified:
    - scripts/check-glyph-coverage.py

key-decisions:
  - "Harvest from quoted string literals + HTML text with comments stripped (tokenizer, not regex) — excludes commented arrows/set-symbols/sigma that a byte-scan would false-fail on"
  - "The display-face exemption marks are actually U+06D6–06E6 (Quranic annotation signs present in the shipped ayat), a correction to the plan's stated U+0657–065F — the principle (display faces never render scripture marks) is encoded for both ranges"
  - "Reference kickers (al-Ḥijr / aḏ-Ḏāriyāt with Ḥ/Ḏ) render in Courier marginalia; Courier must carry the macron vowels directly (proper nouns), and the dotted-diacritic refs resolve via the declared system-mono fallback, proven present by the workhorse Latin baseline"
  - "rtl-audit walks pages at their load state; learn.html's daily ayah + the fixture's 15 Arabic runs are the live isolate/Quran-face pins; the CSS census these prove is shared by all 5 emitter paths"

patterns-established:
  - "Glyph gate: harvest real strings → bucket by role-stack → cmap-prove with the fallback law, never a hand list or document.fonts.check"
  - "RTL audit: computed-style DOM walk via injected driver, exit-code-first, skips script/style source, honest about headless width clamp + glyph-visual-order limits"

requirements-completed: []  # ACC-03 (plan frontmatter tag) is NOT marked complete — this plan delivers the FND-03/CNT-04 typography/RTL portion; the ACC-03 contrast sweep is 06-03

# Metrics
duration: ~50min
completed: 2026-07-14
---

# Phase 6 Plan 02: Typography/RTL Gate Summary

**The FND-03 glyph gate rebuilt from a crash into a real cmap proof — 14-face roster, codepoints harvested from the actual app strings against their CSS role-stacks with the settled fallback law — plus a permanent rtl-audit.mjs census (lang/dir/isolate + Quran-face + no-overflow over 21 rendered targets) and a neutral-copy typo-stress specimen for the human tofu walk.**

## Performance

- **Duration:** ~50 min
- **Started:** 2026-07-14T03:52:00Z
- **Completed:** 2026-07-14T04:42:00Z (commit 635f5ef at 05:41 BST)
- **Tasks:** 3
- **Files modified:** 3 (1 rewritten, 2 created)

## Accomplishments

- **The broken glyph gate is real again.** `scripts/check-glyph-coverage.py` no longer references the deleted retired-display-font subset (it crashed exit 1); it now maps the 14 declared `.woff2` faces to their CSS `--font-*` role-stacks, HARVESTS the required codepoint set from the real app strings (learn.html + 15 lessons + 4 reviews + engine emitters), and cmap-proves every harvested codepoint against its role-stack — exits 0 with a per-role coverage report. The stale-list gaps the old hand-list missed are now caught automatically: **Ḥ U+1E24 and Ḏ U+1E0E** (workhorse, via readex∪inter) and the **macron ā U+0101 in Courier Prime** (the marginalia proper-noun proof).
- **A permanent RTL/bidi gate.** `scripts/tests/rtl-audit.mjs` DOM-walks all 20 rendered pages + the fixture (21 targets) in headless Chrome, proving from computed styles: every rendered Arabic run sits inside `[lang="ar"]`; every `[lang="ar"]` computes `unicode-bidi: isolate`; every `.ayah`/`.scripture` computes `direction: rtl` + isolate; every `.ayah` asks for the `Amiri Quran` face first; and no horizontal overflow at narrow + desktop. Exit-code-first; exits 0 today (pins the shipped census forever).
- **A dignified specimen sheet.** `scripts/fixtures/typo-stress.html` renders every declared face weight, the full transliteration diacritic set (+ the uppercase Ḥ/Ḏ and the Courier ā case), the corner brackets (Readex→Inter fallback), the honorific + ornate frame marks, and mixed Arabic/Latin bidi lines — neutral copy only (common dictionary words + the 28-letter alphabet), no scripture, no gated literal.

## Task Commits

1. **Task 1: rewrite check-glyph-coverage.py** — `691c3cf` (fix)
2. **Task 2: typo-stress.html fixture** — `0e01539` (feat)
3. **Task 3: rtl-audit.mjs** — `635f5ef` (feat) — also carries the Rule-1 fixture caption fix

**Plan metadata:** (this commit) `docs(06-02): complete typography/RTL gate plan`

## Files Created/Modified

- `scripts/check-glyph-coverage.py` — REWRITTEN. 14-face role-stack roster; comment-skipping tokenizer harvest; workhorse Latin baseline (readex∪inter), scripture Arabic (Amiri Quran∪Amiri), Readex Arabic-UI minus scripture-only marks, Courier macron proof, display-face rare-mark exemption; per-role report; exit 0.
- `scripts/tests/rtl-audit.mjs` — NEW. render-smoke-template exit-code gate; read-only computed-style driver over 21 targets; skips script/style source; honest limits stated.
- `scripts/fixtures/typo-stress.html` — NEW. Zero-CDN neutral-copy specimen; loads only the engine stylesheet page-relative; out of any precache by location.

## Decisions Made

- **Harvest scope = rendered text only.** A naive byte-scan pulls in commented arrows/set-symbols/Σ (which no shipped face covers) and the invisible bidi marks (RLM U+200F, end-of-ayah U+06DD). A character-level tokenizer that skips `//` and `/* */` comments and reads only quoted string-literal + HTML-text content harvests exactly what the app renders; control/format chars (category Cf/Cc) are excluded because they need no glyph. This is what makes the gate honest and non-flaky.
- **Fallback law, empirically grounded.** Every harvested Latin codepoint is in readex∪inter (˹˺ via Inter, by design); every Arabic codepoint is in Amiri Quran∪Amiri; the 7 Quranic annotation marks present in the shipped ayat (U+06D6, 06DA, 06DF, 06E0, 06E2, 06E5, 06E6) are scripture-only and legitimately absent from Readex/Aref Ruqaa/Rakkas — so those faces are exempt, and the gate never requires a scripture mark of a display face.
- **Courier marginalia stance.** The daily-ayah kicker and citation source lines (`al-Ḥijr`, `aḏ-Ḏāriyāt`, `Ṣaḥīḥ Muslim`) render in Courier (`--font-marg`). Courier carries the macron vowels directly (the Ibrāhīm-style proper-noun case — proven), and the dotted transliteration letters resolve through Courier's declared `ui-monospace/…/monospace` fallback, proven to exist in the self-hosted set by the workhorse Latin baseline. Documented, not weakened.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] The plan's stated display-face exempt range was slightly off from the shipped reality**
- **Found during:** Task 1 (glyph gate design)
- **Issue:** The plan/research named the display-face exempt marks as U+0657–065F. The Quranic annotation marks actually present in the shipped ayat (and absent from Readex/Aref Ruqaa/Rakkas) are U+06D6–06E6.
- **Fix:** Encoded the exemption for both ranges (U+0610–061A, U+0656–065F, U+06D6–06ED, U+08D3–08FF) so the principle (display faces never render scripture marks) holds against the real corpus; bucketed by role so the marks only ever land in the scripture stack.
- **Files modified:** scripts/check-glyph-coverage.py
- **Verification:** Gate exits 0; the per-role report lists the 7 exempt marks explicitly.
- **Committed in:** 691c3cf (Task 1)

**2. [Rule 1 - Bug] The fixture captions carried bare Arabic glyphs (ﷺ ﴾ ﴿) in English prose, untagged**
- **Found during:** Task 3 (rtl-audit surfaced it — "untagged Arabic [p.ts-cap: …]")
- **Issue:** The caption text describing the honorific/ornate marks contained the literal glyphs outside any `[lang="ar"]`, which the audit correctly flags as a rendered Arabic run without language tagging.
- **Fix:** Wrapped those glyphs in `<span lang="ar" dir="rtl">` so no rendered Arabic sits untagged (fixture surface only — not product source).
- **Files modified:** scripts/fixtures/typo-stress.html
- **Verification:** rtl-audit RTL OK on the fixture (ar-nodes=15, lang-ar=15).
- **Committed in:** 635f5ef (Task 3)

**3. [Rule 1 - Bug] rtl-audit's TreeWalker read `<script>` source as rendered text**
- **Found during:** Task 3 (learn.html failed — "untagged Arabic [script: /* ====")
- **Issue:** The walker matched Arabic inside the inline `<script>` DAILY data (`ar:'…'`) — code, not rendered text.
- **Fix:** Skip text nodes inside `script, style, noscript, template` in the walker.
- **Files modified:** scripts/tests/rtl-audit.mjs
- **Verification:** learn.html RTL OK (ar-nodes=1, ayah=1 in Amiri Quran, rtl+isolate).
- **Committed in:** 635f5ef (Task 3)

---

**Total deviations:** 3 auto-fixed (all Rule 1, all self-caught). No product source touched.
**Impact on plan:** All three sharpen correctness of the new gates/fixture. No scope creep; no STOP condition; no asset gap (every shipped-face subset covers every codepoint it is responsible for).

## Issues Encountered

- **Headless Chrome clamps innerWidth to ~500px** regardless of `--window-size=320,800` (a documented headless limitation; a true 320px viewport needs the DevTools protocol / a dependency). The audit requests 320 per the prescribed method, asserts no-overflow at the effective narrow floor and at desktop (both pass), and states the clamp honestly — the true sub-500 visual is a human-gate item.
- **Driver reliability:** an initial double-`requestAnimationFrame` was flaky under `--virtual-time-budget`; stamping synchronously in the `load` handler (the proven learn-dom-flows pattern) made it deterministic (verified across two clean runs).

## Known Stubs

None. The gates and fixture are complete and passing; no placeholder data flows to any UI.

## Threat Flags

None. No new network endpoint, auth path, file-access pattern, or schema change is introduced — the gates read the repo + font files and render pages over `file://`, writing only throwaway probes that are cleaned in `finally`.

## Honest Limits (for the 06-07 gate walk)

- Glyph VISUAL ORDER (that runs do not scramble on screen) is best-effort; computed isolate + the human fixture walk are authoritative. Range-rect x-ordering is deliberately NOT used as a pass/fail lever.
- The "320px" render is exercised at the headless ~500px floor; the true sub-500 visual is a human-gate item.
- rtl-audit walks pages at their LOAD state. learn.html's daily ayah is a live `.ayah` pin and the fixture pins 15 Arabic runs; the interactive emitters (sheetRef/sheetTerm on click, verseHtml on a verse beat) are census-pinned via the shared CSS `.ayah`/`.scripture`/`[lang=ar]` rules these prove, with their live-interaction render deferred to the human walk + render-smoke. Consider driving one lesson to a verse beat / open a citation sheet in a future hardening pass if the gate wants live emitter coverage.
- The ornate frame marks ﴾ U+FD3E / ﴿ U+FD3F are NOT in the shipped Amiri subset (and not used by the app); in the fixture they render via system-Arabic fallback — an owner-ledger note, not a failure.

## Next Phase Readiness

- All three artifacts pass and join the standing gate chain (glyph gate + rtl-audit run alongside render-smoke/port-audit/validate-content). Suite held at 154/130/0/24; @layer order line ×1; localStorage 13; glyphCount 13.
- 06-03 (contrast-audit.mjs) is next; it completes the ACC-03 contrast portion this plan's frontmatter tag references.

## Self-Check: PASSED

- `scripts/check-glyph-coverage.py` — FOUND, exit 0
- `scripts/tests/rtl-audit.mjs` — FOUND, exit 0 (21 targets RTL OK)
- `scripts/fixtures/typo-stress.html` — FOUND, renders clean, all 18 required codepoints present
- Commits `691c3cf`, `0e01539`, `635f5ef` — FOUND in git log

---
*Phase: 06-accessibility-rtl-typography-hardening*
*Completed: 2026-07-14*
