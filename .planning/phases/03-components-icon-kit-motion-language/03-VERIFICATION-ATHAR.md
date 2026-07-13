---
phase: 3
verified: 2026-07-13T00:53:28Z
status: human_needed
score: 5/5 must-haves verified in code (1 human re-confirmation item outstanding)
overrides_applied: 0
human_verification:
  - test: "Re-glance at preview.html §6 (the tawaf ring) against the CURRENT commit (3e71adf), specifically the 'Empty — 0/65, all faint' ring and the 'Animated — the frontier inks itself in' ring, and re-confirm §9 gate items 7 ('does the ring look hand-drawn...would two people's rings clearly look different') and 10 (reduced motion) still hold 'yes'."
    expected: "The Empty ring no longer shows a gold head-dot (WR-02 fix); the auto-playing ink-draw on load that ran on every ring with an ember frontier no longer plays except on the explicit 'Animated' demo card, which now requires clicking Replay or a fresh animateFrom prop (WR-01 fix). Melusi should confirm these post-fix renders still read as intended — the fixes correct the artifact toward the written spec (§6.4 'the established Ring never re-draws', §6.6 #3 'all-faint' at zero progress), but he approved the PRE-fix byte-state on 2026-07-13T01:02 local, roughly 40 minutes before the code-review fix wave (01:35–01:45 local) changed this behavior. No re-walk of the gate has been recorded since."
    why_human: "Visual appearance / product-owner judgment call — whether a corrected animation/head-dot behavior still 'reads as hand-inked' is exactly the kind of thing the §9 gate exists to catch, and it cannot be inferred from grep/tests alone. The functional/determinism/acceptance-criteria checks all pass (verified below), so this is a re-confirmation, not a suspected regression."
---

# Phase 3 (Athar re-cut): Components, Icon Kit & Motion Language — Verification Report

**Phase Goal:** A shared component library, a single icon registry, and one motion vocabulary exist and are proven before the screen runners consume them — re-cut under the Athar System (`03-UI-SPEC-ATHAR.md`).
**Verified:** 2026-07-13T00:53:28Z
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths (the 5 re-voiced ROADMAP.md success criteria)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Icon registry: 20-SVG single source, inline `aria-hidden`, currentColor + `--icon-accent` model, no runtime recolour, no lantern-gold, no per-page icon constants | ✓ VERIFIED | `shared/awba-engine.js:536` `AW.KIT` = exactly 20 entries (node-verified: `mosque, carpet, lantern, lanterns, crescent, hijab, man, family, prostration, standing, quran-stand, beads, kaaba, dua, dates, compass, ewer, night, pattern, calendar`); `AW.icon()` at `:925-933` injects `aria-hidden="true" focusable="false"` by default; `178` `currentColor` + `35` `var(--icon-accent)` occurrences inside the KIT block; `grep -c '\.replace(/#' shared/awba-engine.js` = 0 (no runtime recolour); `grep -c "KIT\['lantern-gold'\]"` = 0 and no `lantern-gold` string anywhere in the repo; no old Gen-3 blue hex literals (`#2E6BF5`/`#2536CE`/etc.) anywhere in `shared/` or `preview.html` (only two harmless `unitColor:'#2E6BF5'` occurrences in `scripts/fixtures/*.html`, which are Josh's frozen ENG-07 content-shape metadata field, never read by the icon/render path — `grep -n unitColor scripts/validate-content.js` shows it's only a required-field presence check). No other page/HTML/JS files exist yet in the repo (Phase 4/5 runners not built), so "no per-page duplicate icon constants" holds vacuously-and-honestly (nothing to duplicate against). |
| 2 | Citation chip → bottom sheet (RTL Arabic, verbatim translation, source, olive grade pill for hadith, always-on pending pill); term → gloss sheet | ✓ VERIFIED | `AW.sheetRef` (`shared/awba-engine.js:1049-1066`): face-split via `isQuran = !r.grade` → `.ayah`/Amiri Quran for Qur'an, general Amiri for hadith; both carry `lang="ar" dir="rtl"`; renders `r.mean` (verbatim translation), `r.src` (source line), an unconditional `<span class="r-pill">unverified · pending review</span>`, and a `<span class="r-pill grade">` only when `r.grade` is set. `AW.sheetTerm` (`:1071-1082`) renders Arabic/transliteration/word/definition/context field-for-field. Grade pill colour is `var(--olive)` = `#6B682A` (`shared/awba-engine.css:109,599-601`, D-A9). `preview.html` §4/§5 wire real `AW.cite`/`AW.wire` calls against byte-verbatim scripture (`hujurat-49-15` Qur'an, `muslim-8` hadith Sahih) and a real term (`aqeedah`) — clicking opens the actual sheet, not a mock. |
| 3 | One paper-press + one Athar motion vocabulary (one easing family, register verbs) across every tappable surface | ✓ VERIFIED | Exactly one `cubic-bezier` definition in the whole CSS (`--ease: cubic-bezier(0.23,1,0.32,1)` at `:158`); no other easing curve, no stray `ease-in`/`ease-out`/second `cubic-bezier`/`linear()` anywhere in `shared/awba-engine.css` or `preview.html` (grep-checked). The one paper-press (`:772-785`, D-A4) is declared once on `.btn, .opt, .tf, .tile, .tab, .hstat, .cite, .term` (`translateY(1px)` + ink-deepen, no shadow drop) and again on `.sheet-row` (`:833-839`) — full tappable inventory covered. Register verbs `draw`/`settle`/`breathe`/`drift`/`stamp` are each declared once as `@keyframes` and consumed via `var(--dur-*) var(--ease)` (20 `var(--ease)` usages total). |
| 4 | Reduced-motion (both triggers) quiets everything; Ring renders final state statically | ✓ VERIFIED | `shared/awba-engine.css:1002-1016`: `@media (prefers-reduced-motion: reduce)` (OS trigger) and `[data-motion="reduce"]` (in-app `awba_prefs` boot-stamp trigger) both collapse `--dur-*` to `1ms` and stop `.sky-breathe`/`.dab`/`[data-ambient]` outright. `AW.reducedMotion()` (`:977-985`) checks both `window.matchMedia` and `document.documentElement.getAttribute('data-motion')`; unit-tested for all three branches (`components.test.js:86-112`). `AW.ringSVG` gates its `ink-draw` animation on `!reduce` (`:1145-1289`); `ring.test.js` (4 dedicated tests) proves reduced motion emits zero `ink-draw`/`stroke-dasharray` nodes and renders the exact final inked state. `preview.html` §8 has a live, working reduce-motion toggle that re-renders all mounted rings statically via `data-motion="reduce"`. |
| 5 | Ring generator (deterministic seeded, §6 acceptance) + prayer-clock sky (manual times, 5 temperatures, §7 acceptance) built and proven | ✓ VERIFIED | `AW.ringSVG` (`:1145-1289`): seeded `mulberry32` PRNG, no `Date`/`Math.random` in the generator path; `AW.ringSeed()` mints once into `awba_state.ringSeed`. `ring.test.js` (14 tests) proves: byte-identical output for identical `(seed, atomsDone, animateFrom)`; different seeds diverge; 0→65+4 progression draws the gold thread (exactly 4 arcs) and head-dot; reduced motion is static; the established ring never replays on an unchanged re-render (WR-01 fix); a partial/malformed `structure` object never emits `NaN` (WR-03 fix); numeric edge cases (negative/NaN `atomsDone`, seed 0/NaN/negative, `atomsDone` 999→65 clamp) never throw (WR-07 fix); ≤600 `<path>` nodes and no `<filter>`. `skyTemp(now, times, mode)` (`:1330-1343`) is a pure function verified against 5 fixed-`now` fixtures + boundary-inclusive tests + a shifted-boundary test + `skyMode:"off"`→always `"day"` + a static grep proving no `geolocation`/`fetch`/`XMLHttpRequest` symbol appears anywhere in the engine (`sky.test.js`, 11 tests). `skyDawn()`'s `/65` scaling and `0.6` ambient cap are pinned (WR-06 fix). `preview.html` §6/§7 render all of this live (three ring states + animated/static pair + two-seed comparison; five `data-sky` temperature cards + the `--dawn` degree card). |

**Score:** 5/5 truths verified in code. See "Human Verification Required" below for one outstanding re-confirmation that does not change the code-level verdict.

### §12 Grep Gates (ran directly, not trusted from SUMMARY)

All 12 gates re-run independently against the current HEAD (`3e71adf`), using `grep -cE '(...)'` paren-wrapping to route around the ugrep `--`-leading-pattern quirk on this machine:

| Gate | Command | Result | Status |
|---|---|---|---|
| No indigo shadows | `grep -cE '(rgba\(37,54,)' shared/awba-engine.css` | 0 | PASS |
| No per-unit colour blocks | `grep -cE '(\[data-unit="u[1-4]"\])' shared/awba-engine.css` | 0 | PASS |
| No `--accent` scale | `grep -cE '(--accent)' shared/awba-engine.css` | 0 | PASS |
| Poppins retired | `grep -ciE '(poppins)' shared/awba-engine.css` | 0 | PASS (font files also physically deleted from `shared/fonts/`) |
| `'Inter'` exactly 2 | `grep -c "'Inter'" shared/awba-engine.css` | 2 | PASS |
| No `AW.confetti` | `grep -c 'AW.confetti' shared/awba-engine.js` | 0 | PASS |
| No `lantern-gold` variant | `grep -cE "(KIT\['lantern-gold'\])" shared/awba-engine.js` | 0 | PASS |
| No runtime `.replace(/#` recolour | `grep -cE '(\.replace\(/#)' shared/awba-engine.js` | 0 | PASS |
| No leading-slash `url()` | `grep -cE "(url\(['\"]?/)" shared/awba-engine.css` | 0 | PASS |
| Zero CDN in preview.html | `grep -cE 'https?://(fonts\.googleapis\|cdn)' preview.html` | 0 | PASS |
| Single `@layer` declaration | `grep -c '@layer tokens, base, components, screens, motion;' shared/awba-engine.css` | 1 | PASS |
| `AW.cite('x','y')` byte-shape | manual inspection `:942-951` | `<span class="cite" data-ref="x">…</span>` | PASS |

12/12 grep gates pass.

### Test Suite & Validator

| Check | Command | Result | Status |
|---|---|---|---|
| Full unit suite | `node --test scripts/tests/*.test.js` | **64 pass / 0 fail** (components 11, ring 14, sky 11, state-helpers 9, state-storage 12, validate 7 = 64, matches exactly) | PASS |
| Content validator self-test | `node scripts/validate-content.js --self-test` | `valid-lesson.html` 0 errors, `valid-review.html` 0 errors, `broken-lesson.html` 3 errors named | PASS |
| CSS brace balance | manual node check | 158 open / 158 close | PASS |
| JS parseability | `new Function(source)` | parses without error | PASS |

### Required Artifacts

| Artifact | Expected | Status | Details |
|---|---|---|---|
| `shared/awba-engine.js` — `AW.KIT`/`AW.GLYPHS`/`AW.icon` | 20-scene icon registry | ✓ VERIFIED | 20 KIT + 13 GLYPHS entries, `components.test.js` pins both counts |
| `shared/awba-engine.js` — `AW.cite`/`AW.sheetRef`/`AW.sheetTerm`/`AW.wire` | citation + gloss sheets | ✓ VERIFIED | Full field-for-field implementation, wired and demoed live in `preview.html` |
| `shared/awba-engine.css` — `@layer motion` + paper-press | one motion vocabulary | ✓ VERIFIED | one `--ease`, 5 register-verb keyframes, one press rule set |
| `shared/awba-engine.js` — `AW.ringSVG`/`AW.ringSeed` | deterministic Ring | ✓ VERIFIED | 14 dedicated tests, §6.6 acceptance criteria 1–4 and 6 machine-verified (5 is the §9 human item) |
| `shared/awba-engine.js` — `skyTemp`/`skyDawn` | prayer-clock sky | ✓ VERIFIED | 11 dedicated tests, §7.5 acceptance criteria 1–4 and 6 machine-verified (5 is a real-clock/§9 human item by nature) |
| `preview.html` | the Athar living reference, §8 structure | ✓ VERIFIED | All 8 sections present and driven by real `AW.*` calls, not mocked markup; zero CDN |
| `.planning/phases/.../03-REVIEW-ATHAR.md` FIXES section | 9/9 Warnings fixed | ✓ VERIFIED | All 9 commits (`fb8b8bd`…`3ceb152`) exist in git history and their diffs match the claimed fix (contrast tokens, Ring `animateFrom`/head-dot/structure-validation, `AW.skyDawn`/Ring edge-case tests, Sky demo copy, `AW.S.isFallback()`) |
| `.planning/phases/.../03-12-SUMMARY.md` | human gate record, APPROVED | ✓ VERIFIED (with caveat) | File exists, records "approved" / all ten items YES, dated 2026-07-13. See Human Verification below — the approval predates 9 subsequent code fixes by ~35–45 minutes. |

### Key Link Verification

| From | To | Via | Status | Details |
|---|---|---|---|---|
| `preview.html` §4/§5 | `AW.cite`/`AW.sheetRef`/`AW.sheetTerm` | `AW.wire(root, demoCfg)` click binding | WIRED | Live click handlers proven present, not mocked HTML |
| `preview.html` §6 | `AW.ringSVG` | `mountRing()`/`mountRingStatic()` helpers | WIRED | 7 distinct ring mounts (empty/mid/full/animated/static/seedA/seedB), all real calls |
| `preview.html` §7 | `AW.skyTemp` (via boot stamp) / static demo cards | `data-sky` attribute + `.reg-orbit[data-sky]::after` CSS painter | WIRED | boot stamps both `<html>` and the `.reg-orbit` home shell (per `03-10-SUMMARY`); demo cards hardcode all 5 states for side-by-side comparison, which is the documented §8 spec intent, not a stub |
| `preview.html` §8 | `AW.reducedMotion()` / `data-motion` | live toggle button re-renders all `ringSlots` | WIRED | functional toggle, not decorative |
| Ring/Sky generators | `AwbaLesson`/`AwbaReview` runners | — | NOT YET WIRED (by design) | `RUNNERS` section (`shared/awba-engine.js:1357-1359`) is explicitly empty — Phase 4 scope; matches the roadmap's "before Phase 4 consumes them" framing, not a gap |

### Requirements Coverage

| Requirement | Source | Description | Status | Evidence |
|---|---|---|---|---|
| FND-04 | REQUIREMENTS.md / ROADMAP Phase 3 | One icon registry, inline, aria-hidden, single source | ✓ SATISFIED | See Truth 1. Note: REQUIREMENTS.md's literal wording ("gold lantern is a properly authored variant, not a regex recolor") is stale — the Athar re-cut deliberately *deletes* `lantern-gold` (D-A6) rather than authoring it, since currentColor auto-inks the one `lantern` icon gold on dark grounds. ROADMAP.md's Phase 3 design-authority note explicitly supersedes `03-UI-SPEC.md` with the Athar contract, so this is intentional, documented drift in a doc that wasn't rewritten for the re-cut — not a functional gap. Recommend a follow-up doc pass to reword REQUIREMENTS.md FND-04/MOT-01/MOT-03/MOT-04 to match the Athar vocabulary (no code action needed). |
| ENG-06 | REQUIREMENTS.md / ROADMAP Phase 3 | Citation/gloss sheets | ✓ SATISFIED | See Truth 2 |
| MOT-01 | REQUIREMENTS.md / ROADMAP Phase 3 | One motion vocabulary | ✓ SATISFIED | See Truth 3. Same stale-wording note: REQUIREMENTS.md says "`linear()` spring easings" but Athar deliberately uses one `cubic-bezier` "paper press," not a spring — a documented Athar decision (D-A4), not a miss. |
| MOT-03 | REQUIREMENTS.md / ROADMAP Phase 3 | Paper-press across full tappable inventory | ✓ SATISFIED | See Truth 3. REQUIREMENTS.md says "gummy shadow-collapse" — gummy press was explicitly retired for the Athar paper-press (D-A4); same stale-wording pattern. |
| MOT-04 | REQUIREMENTS.md / ROADMAP Phase 3 | Reduced motion, both triggers | ✓ SATISFIED | See Truth 4. REQUIREMENTS.md mentions "confetti, PERFECT" quietening — both are retired outright under Athar (D-A14), so there's nothing left to quieten there; the actual quietening surface (Sky breathe, dab drift, Ring draw, UI transitions) is fully covered. |

No orphaned requirements found for Phase 3 in REQUIREMENTS.md beyond the five listed above.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|---|---|---|---|---|
| `shared/awba-engine.js` | 18-21, 523, 1358 | "Phase 3/4 placeholder" / "Phase 4 placeholder" section-header comments (KIT/COMPONENTS/RUNNERS map) | ℹ️ Info | Not a stub in scope — KIT/COMPONENTS are fully built (20 icons, all components); only `RUNNERS` (`AwbaLesson`/`AwbaReview`) is genuinely empty, and that is explicitly Phase 4's deliverable, not this phase's. Correctly scoped, not misleading. |
| `scripts/fixtures/valid-lesson.html`, `broken-lesson.html` | 6 | `unitColor:'#2E6BF5'` (Gen-3 blue hex) | ℹ️ Info | Content-shape test fixture data mirroring Josh's frozen `unitColor` metadata field (checked only for presence by the ENG-07 validator); never read by the icon/render path. Not "old-look residue" in the visual sense the spec's §12 gates are guarding against. |

No `TBD`/`FIXME`/`XXX`/`HACK` debt markers found in any file touched by this phase.

### Human Verification Required

### 1. Re-confirm the §9 gate on the current (post-fix) preview.html Ring behaviour

**Test:** Open `preview.html` over `file://` at the current commit (`3e71adf`) and look specifically at §6 (the tawaf ring): the "Empty — 0/65, all faint" card and the "Animated — the frontier inks itself in" card (plus the masthead hero ring, which shares the same generator).
**Expected:** Confirm these still satisfy §9 gate items 7 ("does the ring look hand-drawn and personal... would two people's rings clearly look different") and 10 (reduced motion) with a "yes." Two things changed after the original 2026-07-13T01:02 approval, both landing 01:35–01:45 the same day via the code-review fix wave (commits `ab60978` WR-02, `16638dc` WR-01): (a) the Empty ring no longer shows a gold head-dot at zero progress (previously it fell back to `dabs[0]`, contradicting "all-faint"); (b) rings other than the explicit "Animated" demo no longer auto-play their ink-draw on every page load/reload — only the frontier span between an explicit `animateFrom` and the current `atomsDone` draws, and by default that span is empty (static). Both changes correct the implementation toward the written §6.3/§6.4/§6.6 spec language Melusi was already approving in principle, but the exact bytes he clicked through are not the exact bytes now in the repo, and no re-walk was recorded.
**Why human:** This is a product-owner visual/feel judgment ("does it look hand-drawn," "does it feel calm not mechanical") — exactly what the §9 gate exists to catch, and it cannot be inferred from grep or unit tests. The automated/determinism/acceptance-criteria layer (ring.test.js, 14 tests) fully covers the *technical* correctness of both changes; this item is solely about re-confirming the *feel* of the corrected artifact.

### Gaps Summary

No functional gaps. All five re-voiced Athar success criteria are proven in code: the icon registry (20 SVGs, currentColor/`--icon-accent`, zero runtime recolour, lantern-gold deleted), the citation/gloss sheet mechanism (RTL, verbatim, olive grade pill, always-on pending pill), the one motion vocabulary (single easing family, one paper-press across the full tappable inventory, named register verbs), reduced motion (both triggers, Ring renders final state statically), and the Ring/Sky generators (deterministic, tested against every machine-checkable acceptance criterion in §6.6/§7.5). All 12 §12 grep gates pass independently-reproduced. The full test suite is 64/64 green (exact file-by-file test-count reconciliation confirms no hidden skips). `validate-content.js --self-test` is OK. All 9 code-review Warnings have corresponding commits that exist in git history and whose diffs match the claimed fix.

The one open item is procedural rather than functional: the §9 human visual gate (03-12-SUMMARY.md, "APPROVED," recorded 2026-07-13T01:02 local) was walked and signed off on a byte-state of `preview.html`/`shared/awba-engine.js` that was then modified ~35–45 minutes later by the code-review fix wave (03-REVIEW-ATHAR.md FIXES, commits `fb8b8bd`…`3ceb152`, recorded 2026-07-13T01:45 local). Two of those nine fixes (WR-01, WR-02) visibly change what the Ring renders in the exact section (§6) the gate was scored against, and no re-walk was recorded afterward. Both changes are corrections toward the already-approved written spec (not new/different design direction), which lowers the risk this would flip a "yes" to a "no," but it has not been re-confirmed by the product owner against the artifact that will actually ship. Routing this as a human-verification item per the Escalation Gate pattern rather than silently accepting the SUMMARY's "no items routed back" framing, since that framing was written before the fix wave existed.

---

_Verified: 2026-07-13T00:53:28Z_
_Verifier: Claude (gsd-verifier)_
