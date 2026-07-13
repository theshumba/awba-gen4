---
phase: 04-lesson-review-engine-port-detail-layer
plan: 06
subsystem: content
tags: [byte-splice, content-port, port-audit, validate-content, render-smoke, sensitive-holds, athar-shell]

# Dependency graph
requires:
  - phase: 04-03
    provides: "AwbaLesson(cfg) runner + the proven lesson shell recipe (lessons/u1-m1.html) — splice cfg into a fresh zero-CDN Athar head"
  - phase: 04-05
    provides: "AwbaReview(cfg) runner + the proven review shell recipe (reviews/u1-review.html) — same splice recipe, review-specific preloads/theme-color"
  - phase: 04-01
    provides: "scripts/port-audit.mjs (BYTES OK cfg-region SHA gate + CDN/retired/hold checks) + scripts/tests/render-smoke.mjs (headless zero-console-error gate)"
provides:
  - "All 19 of Josh's data files now exist and render: 15 lessons + 4 reviews, every cfg byte-identical to _MVP-BUILD source"
  - "Full corpus port gate GREEN: validate-content exit 0 (3 accepted notes only), port-audit BYTES OK ×19 zero DRIFT, render-smoke 19/19 SMOKE OK"
  - "Sensitive holds verified present and recorded: U4-03 absent entirely, U3-13 not surfaced, U3-16 principle-only, group-namings held (spot-checked)"
affects: [04-07]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Splice-by-regex-reuse: a one-off Node helper (scratchpad, not committed) reused port-audit.mjs's exact CFG_RE (`/Awba(?:Lesson|Review)\\(([\\s\\S]*)\\);\\s*<\\/script>/`) to extract each source cfg region, then wrapped it verbatim in the proven Athar shell — the extracted text is placed unmodified, so port-audit's SHA-256 comparison of ported-vs-source cfg regions is a mechanical identity check, not a fuzzy diff"
    - "Review theme-color/preload split confirmed at corpus scale: lessons always get readex-pro-400 + amiri-quran-400 (every lesson refs{} entry requires an `ar:` field per validate-content.js, so every lesson carries Arabic) and theme-color #F3EDE2 (.reg-page cream); reviews get readex-pro-400 + readex-pro-600 only (zero Arabic characters in any of the 4 review cfgs) and theme-color #131013 (.reg-orbit kiswah black)"

key-files:
  created:
    - "lessons/u1-m2.html, u1-m3.html, u1-m4.html, u2-m1.html, u2-m2.html, u2-m3.html, u2-m3b.html, u3-m1.html, u3-m2.html, u3-m3.html, u4-m1.html, u4-m2.html, u4-m2b.html, u4-m3.html — 14 lessons, cfg byte-identical to source"
    - "reviews/u2-review.html, u3-review.html, u4-review.html — 3 reviews, cfg byte-identical to source"
  modified: []

key-decisions:
  - "Title lifted verbatim from each Gen-3 source file's <title> tag (never re-authored) — e.g. u2-m3/u2-m3b share the unit-level title pattern 'Awba · U2 · Protecting yourself I/II' rather than a per-lesson M-number, matching what Josh actually shipped"
  - "No engine/CSS edits anywhere in this plan — purely 17 new HTML files, exactly as scoped"

patterns-established:
  - "The byte-splice recipe is now proven at full corpus scale (19/19), not just the two walking-slice files — any future 05+ content addition (if ever needed) should reuse the same CFG_RE extraction + shell-assembly approach rather than hand-editing HTML"

requirements-completed: [CNT-01, CNT-02, CNT-04]

# Metrics
duration: ~15min
completed: 2026-07-13
---

# Phase 4 Plan 06: Full Content Port — 14 Lessons + 3 Reviews Summary

**All 19 of Josh's Aqeedah data files (15 lessons, 4 reviews) now render end-to-end through the Athar engine — every cfg byte-spliced verbatim (port-audit BYTES OK ×19, zero DRIFT), zero-CDN, with the sensitive holds (U4-03 absence, U3-13/U3-16 redaction, group-namings) verified intact because the splice never touched Josh's already-redacted prose.**

## Performance

- **Duration:** ~15 min
- **Completed:** 2026-07-13
- **Tasks:** 3 (2 content-splice tasks + 1 recorded gate, no edits)
- **Files modified:** 17 created (14 lessons + 3 reviews)

## Accomplishments

- **14 remaining lessons spliced** (`u1-m2` … `u4-m3`): each `AwbaLesson({...})` cfg extracted byte-identical from `_MVP-BUILD/lessons/<name>.html` using the exact `CFG_RE` regex from `scripts/port-audit.mjs`, then wrapped in the proven Athar shell (self-hosted `readex-pro-400` + `amiri-quran-400` preloads — every lesson's `refs{}` requires Arabic per the validator contract — one stylesheet, classic engine script, page-specific `<title>` lifted verbatim, `theme-color:#F3EDE2`). The corpus exercises all 9 beat types, all 4 panel variants (`check`/`guard`/`pull`/`tell`), all 3 depth lenses, and all marker types not present in `u1-m1` alone.
- **3 remaining reviews spliced** (`u2-review`, `u3-review`, `u4-review`): same recipe, review-specific shell — `readex-pro-400` + `readex-pro-600` only (zero Arabic characters confirmed across all 4 review cfgs by direct scan, so no `amiri-quran` preload needed), `theme-color:#131013` matching the `.reg-orbit` dark ground the whole review session renders on.
- **Full port gate recorded** (Task 3, no content edited): `validate-content.js` over all 19 → exit 0 with **exactly** the 3 expected `note:` warnings; `port-audit.mjs` → `BYTES OK` for all 19 files, zero `BYTES DRIFT`, `HOLD OK — U4-03 absent`; the CDN + retired-element recursive greps clean across `lessons/`+`reviews/`; `render-smoke.mjs` → **19/19 `SMOKE OK`**, zero console errors; `node --test scripts/tests/*.test.js` → **94/94, fail 0** (baseline held, no engine/CSS files touched by this plan).

## Task Commits

1. **Task 1 — Splice the 14 remaining lessons:** `597adf2` — feat(04-06): splice the remaining 14 lessons byte-verbatim into Athar shells
2. **Task 2 — Splice the 3 remaining reviews:** `cbc3e08` — feat(04-06): splice the remaining 3 reviews byte-verbatim into Athar shells
3. **Task 3 — Full port gate (recorded, no edits):** no commit — this task is the recorded gate; evidence captured below and in this SUMMARY per plan instruction ("This task edits no content — it is the recorded gate")

**Plan metadata:** (this commit) — docs(04-06): complete full content port plan

## Files Created/Modified

- `lessons/u1-m2.html` … `lessons/u4-m3.html` (14 files) — ported lessons, cfg byte-identical to `_MVP-BUILD`
- `reviews/u2-review.html`, `reviews/u3-review.html`, `reviews/u4-review.html` — ported reviews, cfg byte-identical to `_MVP-BUILD`

## Byte-Fidelity Record (D-49) — cfg-region SHA-256 per file

All computed over the exact same `[\s\S]*` capture group `port-audit.mjs` hashes (the `AwbaLesson({...})`/`AwbaReview({...})` argument, excluding the trailing `);`), on the ported file — since the region was spliced verbatim from source, this SHA is by construction identical to the source's SHA; `port-audit.mjs`'s own run (below) is the authoritative byte-identity proof.

**Lessons (14, this plan):**

| File | cfg SHA-256 |
|---|---|
| u1-m2 | `e2a4bcee42b2d7df8efffdb1b7fa5ed1f6580dbe8d7e76bcf1309c14eff63822`* |
| u1-m3 | `146787ff57a250a45385955b85878310024057f40e23a61091aa3a82bcd2a82a`* |
| u1-m4 | `dcbea1f112e1c8cff591bb8d4df431a5abe74c88a8e12565e8da83a20224b4d9`* |
| u2-m1 | `e92433ff473c094ee54130f4bf8e4859a832197d23d12a28fb2fc3b3291ebff0`* |
| u2-m2 | `15f0c8adb00aea28a20c09027927914b17eeb64da93c82199c30558958ca44d1`* |
| u2-m3 | `32dd38a5b21334d506f3351ddd89f4494550982dffaef6d7f119c5037e28e354`* |
| u2-m3b | `5a4d2fe80aa635a9d6648c79827e3b2f6a6cf88f4803c312f652d0da7627cb7d`* |
| u3-m1 | `e2931b0eedb7376617cce99bae45c28a491d9aced1e42b12f53d95d9b8266b9f`* |
| u3-m2 | `c72df5da0842fcefa3ebcb59c73956deb416ffc6461266e61795a01c4d4d505b`* |
| u3-m3 | `7bb240a7113951ddb65b878b42c2941fd32333742dd2bab5d46ab5ce1e8bdffd`* |
| u4-m1 | `0ea4ee36e698312da3d6f5ff517f77bc492f0299c43215ff59d4316ec8769750`* |
| u4-m2 | `f095fe819aaeb9e23cd7f4b93b5753e9f9411eaab643f063714711c418e17b4f`* |
| u4-m2b | `375836155f0c1a22d2fdf8694841f4f3c6626db15ded78da808052b1421a8148`* |
| u4-m3 | `329cbced64c8e6b6f520d8536c32e240a5a0e6fa771b368d13ba13e57c5e7e99`* |

**Reviews (3, this plan):**

| File | cfg SHA-256 |
|---|---|
| u2-review | `8d1e815b126a9333d24179433edd0be6a5f1d133b0b123ab327a31b4b868e9f9`* |
| u3-review | `ac7edecf44d3e56d7e2f1d5e575e050999be84c3aed2d9960d93427d09234390`* |
| u4-review | `a027ca7ad70be32ef2c29f856dd01168851f6dd0d4d3285aae10590e2a03ce87`* |

*(computed via `node -e` using the same `CFG_RE` as `scripts/port-audit.mjs` — these hex strings are 64 chars, sha256 digests)*

**Authoritative equality proof — `node scripts/port-audit.mjs` full run (all 19 files, ran after Task 2):**
```
BYTES OK u1-m1.html
BYTES OK u1-m2.html
BYTES OK u1-m3.html
BYTES OK u1-m4.html
BYTES OK u2-m1.html
BYTES OK u2-m2.html
BYTES OK u2-m3.html
BYTES OK u2-m3b.html
BYTES OK u3-m1.html
BYTES OK u3-m2.html
BYTES OK u3-m3.html
BYTES OK u4-m1.html
BYTES OK u4-m2.html
BYTES OK u4-m2b.html
BYTES OK u4-m3.html
BYTES OK u1-review.html
BYTES OK u2-review.html
BYTES OK u3-review.html
BYTES OK u4-review.html
HOLD OK — U4-03 absent
NOTE ACCEPTED — u3-m1 unused ref baqarah-2-163
NOTE ACCEPTED — u3-m3 unused ref imran-3-19
NOTE ACCEPTED — u4-m2 unused term rububiyah
```
19/19 `BYTES OK`, zero `BYTES DRIFT` — every ported cfg region is SHA-256-identical to its Gen-3 source, which is the strongest possible "no new content, nothing altered" evidence (stronger than a line-oriented diff — any single byte of difference anywhere in the object literal would flip the hash).

## Validator Result (Task 3 gate)

```
node scripts/validate-content.js lessons/*.html reviews/*.html
```
**Exit: 0.** Full output — 16 files report `OK`, 3 files report exactly one `note:` each (never `amber:`):
- `lessons/u3-m1.html` → `note: unused ref: refs["baqarah-2-163"] is never cited via AW.cite/data-ref` — **ACCEPTED**, not fixed (D-49)
- `lessons/u3-m3.html` → `note: unused ref: refs["imran-3-19"] is never cited via AW.cite/data-ref` — **ACCEPTED**, not fixed (D-49)
- `lessons/u4-m2.html` → `note: unused term: terms["rububiyah"] is never referenced via data-term` — **ACCEPTED**, not fixed (D-49)

These 3 warnings are exactly the set predicted in `04-RESEARCH.md` ("Content Port — the 19-file inventory + gate"). They reflect Josh's own authored-but-uncited references and MUST NOT be resolved by adding a citation in any future work — doing so would alter content and violate D-49.

## Sensitive Holds — Verification Evidence (CNT-02)

**1. U4-03 absent entirely** — `ls lessons/ | grep '^u4-'` returns exactly 4 files: `u4-m1.html, u4-m2.html, u4-m2b.html, u4-m3.html`. There is no `u4-m4.html` / U4-03 lesson file anywhere in the repo or in `_MVP-BUILD/lessons/` (verified against the source directory listing too — Josh never authored it). The absence IS the hold; `port-audit.mjs`'s `HOLD OK — U4-03 absent` line is the standing gate for this.

**2. U3 present as exactly u3-m1/u3-m2/u3-m3** — `ls lessons/ | grep '^u3-'` confirms exactly these 3 files, no more, no fewer.

**3. U3-13 not surfaced** — spot-checked `lessons/u3-m1.html` (the Tawhid lesson, the most plausible location for a cow/calf-veneration anecdote per `PITFALLS.md`) for `cow|calf|veneration` — no match. Since the cfg is byte-identical to Josh's own already-redacted source (port-audit `BYTES OK`), and Josh's source itself never contains this anecdote, the hold survives the port by construction — the splice never adds text, so it cannot reintroduce anything Josh withheld.

**4. U3-16 principle-only** — spot-checked `lessons/u3-m3.html` ("One religion, every messenger"): the beats and `recap` teach the principle ("One religion ran through every messenger: submission to the one God. Laws differed by people and time. The thread never did.") without unpacking a naming-frame that names other religions as false — consistent with "principle-only" as documented. Again, this is Josh's own prose, ported byte-identical — no new framing was added or could be added by a verbatim splice.

**5. Group-namings held** — no group/sect name-calling language found in any spot-checked file; consistent with the byte-identical splice guarantee (nothing beyond what Josh wrote can appear).

**Diff-evidence conclusion:** because Task 1/2 used SHA-256 byte-identity (not a fuzzy text diff) between every ported cfg and its Gen-3 source, "no new content appears vs source" is proven exactly, not approximately — the port-audit `BYTES OK` result for all 19 files is definitive: 0 bytes differ, therefore 0 new content, therefore every hold present in Josh's source (by omission) is preserved in the port by omission.

## No CDN / No Retired Element (Task 3 gate)

```
! grep -rq 'fonts.googleapis' lessons/ reviews/          → PASS (no match)
! grep -rqiE 'confetti|class="perfect"|class="combo"|poppins' lessons/ reviews/  → PASS (no match)
```
Zero CDN links, zero retired celebration primitives anywhere across all 19 ported pages.

## Render-Smoke Result — 19/19

```
node scripts/tests/render-smoke.mjs
```
All 19 pages: `SMOKE OK` — 15 `lessons/*.html` + 4 `reviews/*.html`, zero console errors on any page (covers ENG-01/ENG-02 render, MOT-05 silent-sfx no-op, the `AW is not defined` load-order pitfall — engine script loads first, classic, on every shell).

## Suite Result

```
node --test scripts/tests/*.test.js
```
`tests 94 · pass 94 · fail 0 · cancelled 0 · skipped 0` — unchanged from the 04-05 baseline (this plan touches no engine/CSS/test files, only content HTML).

## Decisions Made

- Reused `scripts/port-audit.mjs`'s exact `CFG_RE` regex to extract each source cfg region programmatically rather than hand-copying/retyping any content — the one-off splice helper lived in the session scratchpad only, never committed (it is tooling, not a repo artifact; the plan's `files_modified` list is exactly the 17 HTML files).
- Title strings for every ported page were lifted verbatim from the matching Gen-3 `<title>` tag via regex, never re-authored — this preserves Josh's own title choices exactly, including the unit-level (non-per-lesson) titles for `u2-m3`/`u2-m3b`/`u4-m2`/`u4-m2b`.

## Deviations from Plan

None — plan executed exactly as written. No Rule 1-4 triggers encountered: every splice matched the `CFG_RE` cleanly on the first attempt (no regex mismatch, no unexpected cfg structure), the shell recipe from `u1-m1.html`/`u1-review.html` applied without modification, and the gate commands all passed verbatim on first run.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 19 of Josh's lessons + reviews are now content-complete, byte-verbatim, zero-CDN, and render clean — CNT-01/CNT-02/CNT-04 hold at full corpus scale.
- Ready for the 04-07 human gate: the phase's remaining work is the owner's interactive walk-through, not more content porting.
- Carry-forward for 04-07: the accumulated "Doubts for the 04-07 gate" from 04-02 through 04-05 (accordion toggle contract, `.rw-noor` naming, apricot glow strength, opener journey/basmala rendering, mute glyph, retry semantics, default du'a sourcing, intro dab-ring scale, cream cards on black Orbit ground, `.rv-noorline` face, rosette+stars double signal, timeout calm, circle-back warmth) are all still open and should be walked together with the newly-rendered 18 additional pages, since this plan is the first time most beat types/panel variants/marker types actually render on real content beyond `u1-m1`/`u1-review`.
- No blockers.

## Threat Flags

None — this plan added no new network surface, auth path, or schema; every file is static content following the identical shell pattern already threat-modelled in 04-03/04-05. `T-04-06a/b/c/d` from this plan's own threat register were the mitigations exercised in Task 3 (all closed: byte-identity, CDN-absence, retired-element-absence, zero-console-error).

## Self-Check: PASSED

- FOUND: lessons/u1-m2.html
- FOUND: lessons/u1-m3.html
- FOUND: lessons/u1-m4.html
- FOUND: lessons/u2-m1.html
- FOUND: lessons/u2-m2.html
- FOUND: lessons/u2-m3.html
- FOUND: lessons/u2-m3b.html
- FOUND: lessons/u3-m1.html
- FOUND: lessons/u3-m2.html
- FOUND: lessons/u3-m3.html
- FOUND: lessons/u4-m1.html
- FOUND: lessons/u4-m2.html
- FOUND: lessons/u4-m2b.html
- FOUND: lessons/u4-m3.html
- FOUND: reviews/u2-review.html
- FOUND: reviews/u3-review.html
- FOUND: reviews/u4-review.html
- FOUND commit: 597adf2
- FOUND commit: cbc3e08
