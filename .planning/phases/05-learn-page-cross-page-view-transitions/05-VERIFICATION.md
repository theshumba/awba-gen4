---
phase: 05-learn-page-cross-page-view-transitions
verified: 2026-07-14T02:50:00Z
status: passed
score: 5/5 must-haves verified
overrides_applied: 0
re_verification:
  previous_status: gaps_found
  previous_score: 4/5
  gaps_closed:
    - "SC5/MOT-02 shared-element morph: the pagereveal reveal-side selector ('.journey') matched zero elements in any real lesson/review page — fixed at 47cf7d2 by repointing to '.hero-ico' (the opener's unique 96px unit scene-icon square, the same unit icon the tapped node carries) + a committed selector↔template coherence regression test"
  gaps_remaining: []
  regressions: []
human_verification: []
---

# Phase 5: Learn Page & Cross-Page View Transitions Verification Report

**Phase Goal:** A learner walks a beautiful winding path through the full Aqeedah course — live node states, anchored popups, daily ayah, chest — with native page-to-page transitions between every screen.
**Verified:** 2026-07-14 (re-verification after gap closure at `47cf7d2`)
**Status:** passed
**Re-verification:** Yes — after closure of the SC5 morph gap found in the initial pass

## Method

Goal-backward, adversarial. Initial pass at `5873fa9`: re-ran the full gate battery myself (not
trusted from SUMMARY/REVIEW claims), read `learn.html` in full, read the relevant
`shared/awba-engine.js`/`.css` sections, diffed the Gen-3 source
(`~/Downloads/AWBA APP/_MVP-BUILD/learn.html`) against the ported `UNITS`/`nodeState` logic, and
independently drove the **real shipped pages** through headless Chrome `--dump-dom` to inspect actual
rendered DOM. That pass found one BLOCKER (SC5 morph reveal-side dead selector). Re-verification at
`47cf7d2` (tree clean): focused full re-check of the failed item + regression sanity on the battery;
SC1–SC4 evidence stands from the initial pass (no SC1–SC4 code path was touched by the fix — the
diff is the `pagereveal` selector + comments, one new test, and the initial verification report file).

**Re-verification battery (run at `47cf7d2`):** `node --test scripts/tests/*.test.js` → **114/114
green** (was 113, +1 coherence test); `node scripts/tests/render-smoke.mjs` → exit 0 (21/21 incl.
`vt-nav`); `node scripts/port-audit.mjs` → exit 0; `node scripts/validate-content.js --self-test` →
exit 0; engine `localStorage` count still exactly **13**.

## Goal Achievement

### Observable Truths (ROADMAP Phase 5 Success Criteria)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Full journey renders — HUD/streak/daily ayah/4 unit headers/winding path/tab bar; "path animates as units complete" read through the W8 correction (node entrance stagger + thermal flips, earned thread ALWAYS static) | ✓ VERIFIED | `learn.html` render() (lines 525-810) composes all named surfaces; live headless dump of `learn.html` confirms 4 `.ounit` sections, 23 real `.onode` buttons, 5-tab `.otabs` bar, `.oayah`/`.oibrahim` present. `drawThreads()` (learn.html:141-173) sets `strokeDashoffset:'0'` unconditionally — the earned gold thread is provably static, never animated/re-drawn. Node entrance uses `animationDelay` stagger (learn.html:793-802); thermal `data-nstate` flips are read live from `AW.deriveNodeState`. No `SECTION 1/2` eyebrow, no `u.color` in rendered DOM (retired elements absent, grep-clean). |
| 2 | Node states derive live from storage; unlock order matches Gen-3 exactly (incl. m3/m3b, m2/m2b splits; chest after review) | ✓ VERIFIED | `AW.deriveNodeState` (shared/awba-engine.js:439-467) byte-matches Gen-3's `nodeState()` logic (chest available iff prev node starred + unopened, lesson/review done iff starred, else active iff every prior non-chest node starred, else locked) — read side-by-side and confirmed identical. `learn-state.test.js` exercises this pure function directly (3 dedicated tests, all green). Independently re-derived via a fresh-install headless DOM dump of the real `learn.html`: exactly 1 `data-nstate="active"` (u1m1) + 22 `data-nstate="locked"`, matching the documented fresh-install contract. |
| 3 | Anchored popups (clamping, singleton, outside-close, CTAs + noor hints); chest +25 exactly once idempotent | ✓ VERIFIED | `placePop` (learn.html:215-231) implements edge-clamping + arrow offset (`--ax`) + above/below flip; `openPopFor`/`closePop` (learn.html:210-246) is a true singleton; outside-tap + Esc close wired (learn.html:344-351). CTA copy matches the UI-SPEC copy table exactly (START · earn noor / REVIEW · improve your stars / START / LEGENDARY AGAIN / gentle locked microcopy, no CTA). Chest idempotency proven against the REAL shipped `window.__awbaClaimChest` in headless Chrome by `scripts/tests/learn-dom-flows.test.js` (+25 exactly once, second claim a no-op, non-vacuous via guard-revert proof). Independently re-run and passing. |
| 4 | Daily ayah rotates through the verified 7-verse pool by day-of-year (no monthly repeat), revealed reverently; one shared sheet implementation; every tab designed coming-soon | ✓ VERIFIED | `AW.dailyIndex` (shared/awba-engine.js:1416-1422) computes day-of-year from local date parts; dedicated tests prove Jan-8 vs Feb-8 differ + leap/non-leap Dec-31 safety. `port-audit.mjs` prints `DAILY BYTES OK` — the 7-verse pool is byte-identical to Gen-3 (SHA-gated). `openStreakSheet`/`openNoorSheet`/`openSwitcher`/`comingSoonSheet` (learn.html:367-421) are all single implementations riding the one `AW.sheet` singleton, wired from HUD + streak strip + Returns tab (one implementation). Tab bar live-dumped: 5 tabs, Learn active, Practice/Profile/More open `comingSoonSheet`, Returns opens the streak sheet — no dead taps. |
| 5 | Cross-document View Transitions wired on every page, graceful degradation; the ONE shared-element morph (node square → lesson opener square) | ✓ VERIFIED (gap closed at `47cf7d2`) | **Base wiring (unchanged from the initial pass):** `@view-transition { navigation: auto; }` top-level immediately after the immutable `@layer` order line (awba-engine.css:16/23), inherited by all 20 pages; reduced-motion VT kill block present under both triggers (css:2320-2324); `pageswap`/`pagereveal` guarded `if (!e.viewTransition) return` → `file://`/Firefox = clean plain nav (render-smoke `vt-nav` green). **Morph reveal side (the fixed gap):** `pagereveal` now queries `.hero-ico` (shared/awba-engine.js:560) — empirically confirmed via live headless-Chrome `--dump-dom` of REAL rendered pages: `lessons/u1-m1.html`, `lessons/u3-m2.html`, `lessons/u4-m3.html` each contain **exactly one** `.hero-ico` at page load (a real 96px SVG box: `<div class="hero-ico"><svg … style="width:96px …">`), satisfying the uniqueness rule. Handler re-read: stamp + clear-after-`finished` + null-VT guard all intact; scripture never named (source is only ever `.onode-mark`/`.cc-term`; reveal target is the icon square). Regression pin: `learn-dom-flows.test.js` test (7) extracts the reveal selector from the engine source and asserts the same class is rendered by the opener template — **proven non-vacuous**: the same check run against the pre-fix engine (`5873fa9`) returns false (`.journey` was rendered nowhere); against `47cf7d2` it passes. Suite 114/114. |

**Score:** 5/5 truths verified

### Gap Closure Detail (SC5)

The initial pass found the reveal-side selector `.journey` matched zero elements in any real page (the
Phase-4 opener renders `cfg.journey` as a `.kicker` breadcrumb; the styled `.journey` CSS class was
orphaned). Fix at `47cf7d2`, independently re-verified:

1. **Selector repointed** to `.hero-ico` — the opener's 96px unit scene-icon square, which is (a)
   unique in the document at page load (empirically confirmed: exactly 1 per page across 3 sampled
   lessons) and (b) semantically the true shared element — the SAME unit icon the tapped learn-page
   node carries.
2. **Committed coherence regression test** (`learn-dom-flows.test.js` test 7) pins the selector ↔
   opener-template seam; repointing either side alone fails the test. Verified non-vacuous against the
   pre-fix tree.
3. **Battery green at the fix commit** (independently re-run): 114/114 · render-smoke 21/21 incl.
   `vt-nav` · port-audit exit 0 · validator self-test exit 0 · engine `localStorage` count 13 · no
   gated literals in the diff (selector + comments + test only).

**Scope note (spec-conformant, not a gap):** review pages render zero `.hero-ico` (the review runner
has no opener hero), so learn→review navigations take the default UA cross-fade — no reveal stamp
fires, no error. The D-58 / 05-UI-SPEC §S6 contract defines the morph pair as node square → **lesson
opener** square only; reviews were never in the morph contract, and the cross-fade is the specified
default for everything else.

### Required Artifacts

| Artifact | Expected | Status | Details |
|---|---|---|---|
| `learn.html` | net-new Orbit-register home page at repo root | ✓ VERIFIED | Exists at root; renders full composition; render-smoke + live dump confirm |
| `shared/awba-engine.js` — `AW.deriveNodeState`/`NODE_ATOMS`/`AW.atomsDone`/`AW.dailyIndex` | engine seams for Phase 5 | ✓ VERIFIED | All present, pure, unit-tested, independently re-derived against Gen-3 source |
| `shared/awba-engine.js` — `pageswap`/`pagereveal` VT handlers | shared-element morph stamping | ✓ VERIFIED | Source side (`.onode-mark`/`.cc-term`) and reveal side (`.hero-ico`) both confirmed to exist in real rendered DOM; guards + clear-after-finished intact |
| `scripts/tests/learn-state.test.js` | pure-function coverage for the new engine seams | ✓ VERIFIED | All pass, independently re-run |
| `scripts/tests/learn-dom-flows.test.js` | real-DOM coverage of popup/chest/Festival flows + VT coherence pin | ✓ VERIFIED | Drives the actual shipped `learn.html` in headless Chrome; non-vacuous (guard-revert + pre-fix-selector proofs); independently re-run and passing |

### Key Link Verification

| From | To | Via | Status | Details |
|---|---|---|---|---|
| Node tap (`learn.html`) | Node popup | `openPopFor`/`placePop` | ✓ WIRED | Delegated click listener on `#app`, singleton, clamped |
| Popup CTA (lesson/review) | `lessons/*.html` / `reviews/*.html` | `<a href>` + click-time `__awbaMorphEl` stamp | ✓ WIRED | Navigation + morph source both live |
| Popup chest CTA | `window.__awbaClaimChest` | `data-claim` click handler | ✓ WIRED | Confirmed live via learn-dom-flows.test.js |
| `AW.deriveNodeState` | node rendering (`data-nstate`) | `stById` lookup in `nodeHtml()` | ✓ WIRED | Live-dumped DOM matches derived states |
| Tapped node square (`pageswap`) | lesson opener `.hero-ico` square (`pagereveal`) | shared `circuit-term` `view-transition-name` pair | ✓ WIRED (fixed at `47cf7d2`) | Reveal target empirically present + unique on real lesson pages; coherence-test pinned |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|---|---|---|---|---|
| LRN-01 | 05-02 | HUD/streak/daily ayah/unit headers/path/tabs render | ✓ SATISFIED | Live DOM dump + code read |
| LRN-02 | 05-03 | Live node states, thermal grammar, review gold, chest gift-framed | ✓ SATISFIED | `AW.deriveNodeState` + rendered `data-nstate` |
| LRN-03 | 05-04 | Anchored popups, singleton, outside-close, CTAs+noor hints | ✓ SATISFIED | `placePop`/`openPopFor` read + copy table match |
| LRN-04 | 05-03 | Real visual journey, not alternating circles; animates per Athar (W8-corrected reading) | ✓ SATISFIED | Serpentine `--lane` offsets + Catmull-Rom `smoothPath`; entrance stagger + thermal flips |
| LRN-05 | 05-02 | Daily ayah day-of-year, reverent | ✓ SATISFIED | `AW.dailyIndex` tests + `DAILY BYTES OK` |
| LRN-06 | 05-05 | One shared sheet implementation | ✓ SATISFIED | Single `AW.sheet` call sites, verified |
| LRN-07 | 05-05 | Tab bar, no dead taps | ✓ SATISFIED | Live DOM dump, 5 tabs wired |
| CNT-03 | 05-03 | Unlock order matches Gen-3 exactly | ✓ SATISFIED | Byte-level Gen-3 comparison + tests + live walk |
| RWD-04 | 05-05 | Chest deterministic +25, idempotent, never randomized | ✓ SATISFIED | `learn-dom-flows.test.js` real-DOM proof (non-vacuous) |
| MOT-02 | 05-04 | Cross-document VT wired on every page, cross-fade/morph, graceful Firefox no-op | ✓ SATISFIED | Opt-in + kill block + guards verified initial pass; morph pair completed at `47cf7d2`, empirically confirmed |

### Anti-Patterns Found

No `TBD`/`FIXME`/`XXX`/`HACK`/`PLACEHOLDER` markers in any Phase-5-touched file (re-checked at
`47cf7d2` — the fix diff introduces none). No retired-vocabulary leaks (`u.color`, `SECTION 1`,
`IC_CHEST`, `AW.LANTERN`, `confetti`, `PERFECT`, `amber`, gummy press, mascot) in `learn.html` or the
new `@layer screens` CSS. Crimson does not leak onto `.reg-orbit`. WR-01/02/03/04 fixes from
05-REVIEW.md all independently confirmed present (`__awbaClaimChest` null-blob hardening at
learn.html:513-514; `.np-star` at `--ink-62`; locked label + `.oib-ref` at `--paper-62`;
`learn-dom-flows.test.js` real-DOM coverage). The `.journey` CSS class at awba-engine.css:1020 remains
styled-but-unrendered (a Phase-4 authoring leftover, now decoupled from the morph and harmless) —
noted for a future cleanup, not a Phase-5 gap.

### Accepted Deviations (on record, not counted against the phase)

- **R-6** — English chapter-terms ship as the fallback; the 15 verified Arabic terms are owner/scholar-sourced (never invented). Owner-ledger.
- **R-7** — Ibrahim 14:24 verbatim line absent from Josh's corpus; a non-scripture framing line ships with an honest "translation pending review" marker; the verified splice is an owner drop-in. Confirmed live: no scripture was generated.
- **D-55 / R-3** — single-sprout MVP on done nodes; the ~20-doodle pool is a logged fast-follow.
- **Served-origin-only morph visibility** — file:// navigations plain by spec (opaque origin); the on-screen morph aesthetic walk is a carried-forward owner item over `http(s)` (05-06-SUMMARY ledger).
- **SG-01** — popup/Festival focus-trap deferred to Phase 6 (on record since Phase 3; Phase 6 scope confirmed in 05-CONTEXT Integration Points).
- **05-06 human checkpoint** — resolved by the standing owner directive of 2026-07-13, walk carried forward (recorded in 05-06-SUMMARY).

### Human Verification Required

None blocking. The visual/taste items (morph calmness over a served origin, 320px checks, Festival
plate moment, ayah glow reverence, etc.) are already carried forward as the owner's deferred walk under
the standing directive (05-06-SUMMARY) — an accepted deviation on record, not a verification
precondition for this phase.

### Gaps Summary

None remaining. The initial pass's single BLOCKER (SC5 morph reveal-side dead selector) is closed at
`47cf7d2`, empirically confirmed against real rendered DOM, and pinned by a committed, proven
non-vacuous regression test. No regressions: the fix diff touches only the `pagereveal` selector +
comments and adds one test; the full battery is green at the fix commit (114/114 · render-smoke 21/21
· port-audit 0 · validator self-test 0 · localStorage 13).

---

_Verified: 2026-07-14 (initial `5873fa9` → gaps_found 4/5; re-verified `47cf7d2` → passed 5/5)_
_Verifier: Claude (gsd-verifier)_
