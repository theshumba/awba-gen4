---
phase: 05-learn-page-cross-page-view-transitions
verified: 2026-07-14T00:00:00Z
status: gaps_found
score: 4/5 must-haves verified
overrides_applied: 0
gaps:
  - truth: "Navigating path↔lesson↔review cross-fades/morphs via Cross-Document View Transitions wired on every page, degrading gracefully to a normal navigation on browsers without support (ROADMAP SC5 / MOT-02 / D-58 / 05-04-PLAN must-have #4)"
    status: partial
    reason: >
      The base @view-transition opt-in (default cross-fade + graceful file:///unsupported no-op) IS
      correctly wired and independently verified. But the ONE shared-element morph that D-58, the
      05-UI-SPEC §S6 contract, and 05-04-PLAN's own must-have explicitly require ("pagereveal handler
      ... stamps ... the lesson opener's .journey square") does not fire on any real page: the CSS
      class `.journey` (shared/awba-engine.css:1020, "the chapter key-term — Aref Ruqaa in a Farag
      square") is never applied to any rendered DOM element. The lesson-opener runner
      (shared/awba-engine.js:1825) renders the chapter-term text inside `<div class="kicker">`, not
      `<div class="journey">` — confirmed by a live headless-Chrome --dump-dom of the real
      lessons/u1-m1.html (grep for `journey` in the rendered DOM returns zero matches; the actual
      markup is `<div class="hero"><div class="kicker">Unit 1 · Lesson 1 · Where it all begins</div>...`).
      Because `pagereveal`'s `document.querySelector('.journey')` (shared/awba-engine.js:560) always
      returns null on every lesson/review page, the reveal-side of the shared-element pair is never
      stamped. The tapped node's Farag square (the pageswap/source side, which IS correctly stamped)
      has no matching element on the incoming page, so the browser cannot morph it into the lesson
      header — it just becomes an unmatched outgoing box under the default cross-fade. This is silent
      (no thrown error, no broken navigation — the base page transition still degrades gracefully), so
      it was never caught by render-smoke.mjs's vt-nav check (which only asserts zero console errors
      over file://, not that the named pair actually matches) or by 05-REVIEW.md's deep pass (which
      did not independently re-derive the reveal-side selector against the real DOM). The 05-04-SUMMARY's
      "revealStamped=circuit-term" claim traces to an uncommitted "synthetic-event probe" that is not
      part of the repo or the test suite and could not be re-run or verified against the real page.
    artifacts:
      - path: "shared/awba-engine.js"
        issue: "pagereveal handler (line 560) queries document.querySelector('.journey'), a selector that matches zero elements in any real lesson/review page"
      - path: "shared/awba-engine.js"
        issue: "opener() (line 1825) renders the chapter-term text as <div class=\"kicker\">, never <div class=\"journey\">, so the CSS Farag-square treatment at awba-engine.css:1020 is itself orphaned/unused (a pre-existing Phase-4 authoring mismatch that Phase 5 built the VT morph on top of without re-verifying)"
    missing:
      - "Wire the actual chapter-term element on the lesson/review opener to carry class=\"journey\" (or update the pagereveal selector to the real class the opener renders) so the reveal-side of the circuit-term pair genuinely matches an element on the incoming page"
      - "Add a regression check (e.g. a render-smoke or dom-flows assertion) that loads a real lesson page and asserts document.querySelector('.journey') is non-null, so a future refactor of the opener markup cannot silently break the morph target again"
      - "Note: the base cross-fade + graceful degradation requirement of SC5/MOT-02 is unaffected and does not need rework — only the shared-element morph target needs the fix"
human_verification: []
---

# Phase 5: Learn Page & Cross-Page View Transitions Verification Report

**Phase Goal:** A learner walks a beautiful winding path through the full Aqeedah course — live node states, anchored popups, daily ayah, chest — with native page-to-page transitions between every screen.
**Verified:** 2026-07-14
**Status:** gaps_found
**Re-verification:** No — initial verification

## Method

Goal-backward, adversarial. Tree confirmed clean at `5873fa9`; re-ran the full gate battery myself
(not trusted from SUMMARY/REVIEW claims): `node --test scripts/tests/*.test.js` → **113/113 green**;
`node scripts/validate-content.js` → exit 0 (3 accepted notes only); `node scripts/port-audit.mjs` →
exit 0, `DAILY BYTES OK`, `BYTES OK` ×19, `HOLD OK`; `node scripts/tests/render-smoke.mjs` → exit 0,
21/21 `SMOKE OK` incl. `vt-nav`. All match the SUMMARY/REVIEW claims exactly — the suite is genuinely
green. Read `learn.html` in full, read the relevant `shared/awba-engine.js`/`.css` sections
(`AW.deriveNodeState`, `NODE_ATOMS`/`AW.atomsDone`, `AW.dailyIndex`, the `@view-transition` opt-in, the
`pageswap`/`pagereveal` handlers, the reduced-motion VT kill block), diffed the Gen-3 source
(`~/Downloads/AWBA APP/_MVP-BUILD/learn.html`) against the ported `UNITS`/`nodeState` logic byte-by-byte,
and independently drove the **real, shipped** `learn.html` + `lessons/u1-m1.html` + `reviews/u1-review.html`
through headless Chrome `--dump-dom` to inspect actual rendered DOM rather than trusting code comments
or SUMMARY narration.

## Goal Achievement

### Observable Truths (ROADMAP Phase 5 Success Criteria)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Full journey renders — HUD/streak/daily ayah/4 unit headers/winding path/tab bar; "path animates as units complete" read through the W8 correction (node entrance stagger + thermal flips, earned thread ALWAYS static) | ✓ VERIFIED | `learn.html` render() (lines 525-810) composes all named surfaces; live headless dump of `learn.html` confirms 4 `.ounit` sections, 23 real `.onode` buttons, 5-tab `.otabs` bar, `.oayah`/`.oibrahim` present. `drawThreads()` (learn.html:141-173) sets `strokeDashoffset:'0'` unconditionally — the earned gold thread is provably static, never animated/re-drawn. Node entrance uses `animationDelay` stagger (learn.html:793-802); thermal `data-nstate` flips are read live from `AW.deriveNodeState`. No `SECTION 1/2` eyebrow, no `u.color` in rendered DOM (retired elements absent, grep-clean). |
| 2 | Node states derive live from storage; unlock order matches Gen-3 exactly (incl. m3/m3b, m2/m2b splits; chest after review) | ✓ VERIFIED | `AW.deriveNodeState` (shared/awba-engine.js:439-467) byte-matches Gen-3's `nodeState()` logic (`~/Downloads/AWBA APP/_MVP-BUILD/learn.html`: chest available iff prev node starred + unopened, lesson/review done iff starred, else active iff every prior non-chest node starred, else locked) — read side-by-side and confirmed identical. `learn-state.test.js` exercises this pure function directly (3 dedicated tests, all green). Independently re-derived via a fresh-install headless DOM dump of the real `learn.html`: exactly 1 `data-nstate="active"` (u1m1) + 22 `data-nstate="locked"`, matching the documented fresh-install contract. |
| 3 | Anchored popups (clamping, singleton, outside-close, CTAs + noor hints); chest +25 exactly once idempotent | ✓ VERIFIED | `placePop` (learn.html:215-231) implements edge-clamping (`Math.max(half+m, Math.min(innerWidth-half-m, nx))`) + arrow offset (`--ax`) + above/below flip; `openPopFor`/`closePop` (learn.html:210-246) is a true singleton; outside-tap + Esc close wired (learn.html:344-351). CTA copy matches the UI-SPEC copy table exactly (START · earn noor / REVIEW · improve your stars / START / LEGENDARY AGAIN / gentle locked microcopy, no CTA). Chest idempotency is **not** merely claimed — `scripts/tests/learn-dom-flows.test.js` drives the REAL shipped `window.__awbaClaimChest` in headless Chrome (not a hand-reimplemented stand-in) and proves +25 exactly once, second claim a no-op, AND a non-vacuous regression proof (reverting the WR-01 guard reintroduces the throw). Re-ran this suite myself — all pass. |
| 4 | Daily ayah rotates through the verified 7-verse pool by day-of-year (no monthly repeat), revealed reverently; one shared sheet implementation; every tab designed coming-soon | ✓ VERIFIED | `AW.dailyIndex` (shared/awba-engine.js:1416-1422) computes day-of-year from local date parts (never `toISOString`); dedicated tests prove Jan-8 vs Feb-8 differ (fixing Gen-3's day-of-month bug) and leap/non-leap Dec-31 safety. `port-audit.mjs` prints `DAILY BYTES OK` — the 7-verse pool is byte-identical to Gen-3 (SHA-gated). `openStreakSheet`/`openNoorSheet`/`openSwitcher`/`comingSoonSheet` (learn.html:367-421) are all single implementations riding the one `AW.sheet` singleton, wired from HUD + streak strip + Returns tab (one implementation, confirmed by shared function references in the wiring block, learn.html:744-773). Tab bar live-dumped: 5 tabs, Learn active, Practice/Profile/More open `comingSoonSheet`, Returns opens the streak sheet — no dead taps. |
| 5 | Cross-document View Transitions wired on every page, graceful degradation; the ONE shared-element morph (node square → lesson opener square) | ✗ **FAILED** (partial — base wiring verified, the morph itself is dead) | `@view-transition { navigation: auto; }` correctly placed top-level, immediately after the immutable `@layer` order line (awba-engine.css:16/23) — inherited by all 20 pages, confirmed by render-smoke's 21/21 pass incl. `vt-nav` (file:// no-ops cleanly, zero console errors). **But** the shared-element morph target does not exist: `pagereveal` queries `document.querySelector('.journey')` (shared/awba-engine.js:560), and a live headless-Chrome `--dump-dom` of the real `lessons/u1-m1.html` proves zero elements in the rendered page carry class `journey` — the opener actually renders `<div class="kicker">…</div>` (shared/awba-engine.js:1825). The reveal-side stamp silently never fires; the morph promised by D-58/05-UI-SPEC §S6/05-04-PLAN's own must-have does not function on any real page (served origin or not). See Gaps below. |

**Score:** 4/5 truths verified (Truth 5 is a BLOCKER — the base cross-fade/degradation half of the
truth is real, but the explicitly-required shared-element morph half is not wired to any real DOM
target).

### Required Artifacts

| Artifact | Expected | Status | Details |
|---|---|---|---|
| `learn.html` | net-new Orbit-register home page at repo root | ✓ VERIFIED | Exists at root; renders full composition; render-smoke + live dump confirm |
| `shared/awba-engine.js` — `AW.deriveNodeState`/`NODE_ATOMS`/`AW.atomsDone`/`AW.dailyIndex` | engine seams for Phase 5 | ✓ VERIFIED | All present, pure, unit-tested (learn-state.test.js), independently read and re-derived against Gen-3 source |
| `shared/awba-engine.js` — `pageswap`/`pagereveal` VT handlers | shared-element morph stamping | ⚠️ PARTIAL (STUB-like on the reveal side) | `pageswap` correctly stamps a real element (`.onode-mark`/`.cc-term`, confirmed to exist); `pagereveal`'s target selector matches nothing in any real page — see gap above |
| `shared/awba-engine.css` — `.journey` (css:1020) | the lesson-opener Farag square that the morph reveals into | ⚠️ ORPHANED | Styled but never applied by any HTML the runner emits (pre-existing Phase-4 mismatch, confirmed via live DOM dump of 3 different lesson/review pages) |
| `scripts/tests/learn-state.test.js` | pure-function coverage for the new engine seams | ✓ VERIFIED | 9+ tests, all pass, independently re-run |
| `scripts/tests/learn-dom-flows.test.js` | real-DOM coverage of popup/chest/Festival flows (WR-04 fix) | ✓ VERIFIED | Drives the actual shipped `learn.html` in headless Chrome, non-vacuous (proven via guard-revert), independently re-run and passing |

### Key Link Verification

| From | To | Via | Status | Details |
|---|---|---|---|---|
| Node tap (`learn.html`) | Node popup | `openPopFor`/`placePop` | ✓ WIRED | Delegated click listener on `#app`, singleton, clamped |
| Popup CTA (lesson/review) | `lessons/*.html` / `reviews/*.html` | `<a href>` + click-time `__awbaMorphEl` stamp | ✓ WIRED (navigation) / ✗ NOT WIRED (morph reveal side, see Truth 5) | Navigation itself works; the morph continuity does not |
| Popup chest CTA | `window.__awbaClaimChest` | `data-claim` click handler | ✓ WIRED | Confirmed live via learn-dom-flows.test.js |
| `AW.deriveNodeState` | node rendering (`data-nstate`) | `stById` lookup in `nodeHtml()` | ✓ WIRED | Live-dumped DOM matches derived states |
| Tapped node square (`pageswap`) | lesson opener square (`pagereveal`) | shared `circuit-term` `view-transition-name` pair | ✗ NOT_WIRED | Source stamped; target selector (`.journey`) matches no element in any real page — confirmed by direct DOM inspection, not inference |

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
| MOT-02 | 05-04 | Cross-document VT wired on every page, cross-fade/morph, graceful Firefox no-op | ⚠️ **PARTIALLY SATISFIED** | Cross-fade + graceful degradation: SATISFIED. Shared-element morph: **BLOCKED** — see gap |

### Anti-Patterns Found

No `TBD`/`FIXME`/`XXX`/`HACK`/`PLACEHOLDER` markers in any Phase-5-touched file. No retired-vocabulary
leaks (`u.color`, `SECTION 1`, `IC_CHEST`, `AW.LANTERN`, `confetti`, `PERFECT`, `amber`, gummy press,
mascot) found in `learn.html` or the new `@layer screens` CSS. Crimson does not leak onto `.reg-orbit`
(only appears inside cream Page objects and the R-5 tab-bar comment). WR-01/02/03/04 fixes from
05-REVIEW.md all independently re-confirmed present in the current tree (`chests = st.chests || {}`
hardening at learn.html:513-514 — actually the more defensive `if (!chests || typeof chests !== 'object')`
form; `.np-star` at `--ink-62`; `.onode[data-nstate="locked"] .onode-label`/`.oib-ref` at `--paper-62`).

One new finding this pass (not in 05-REVIEW.md): the `.journey`/`pagereveal` selector mismatch
documented above as the Truth-5 gap — a silent, non-crashing dead feature that the deep code review's
own methodology (live headless-Chrome reproduction) was applied to WR-01 but was not applied to the
VT morph's reveal side.

### Human Verification Required

None required to resolve this gap — it is independently, deterministically verifiable by DOM inspection
(already done in this verification) and does not depend on visual/subjective judgment. The pre-existing,
already-accepted deferral ("served-origin walk required for the morph," recorded in 05-06-SUMMARY as an
owner-ledger item) covers a *different* concern — confirming the morph's on-screen calmness/timing once
it works, over `http(s)`, not whether the morph fires at all. That deferral does not cover, and does not
excuse, the fact that the reveal-side target never matches on any origin.

### Gaps Summary

Phase 5 delivers a genuinely strong, live, storage-driven Learn page: node states, unlock order, popup
anchoring, chest idempotency, the daily ayah rotation fix, and the shared-sheet/tab-bar family are all
independently verified against the real shipped code (not SUMMARY narration) and hold up. The gate
battery (113 tests, validator, port-audit, render-smoke) is genuinely green, matching every claim.

The one confirmed gap is narrow but real: Cross-Document View Transitions are correctly opted in (base
cross-fade + graceful degradation works everywhere), but the phase's own explicitly-required "ONE
shared-element morph" (D-58, 05-UI-SPEC §S6, and 05-04-PLAN's own must-have) is non-functional because
its reveal-side target (`document.querySelector('.journey')`) matches zero elements in any real
lesson/review page — the opener actually renders the chapter-term inside `<div class="kicker">`, not
`<div class="journey">` (a pre-existing Phase-4 authoring mismatch between the CSS's intent and the JS
implementation that Phase 5 built the morph wiring on top of without re-verifying against the real DOM).
This was not caught by `render-smoke.mjs`'s `vt-nav` check (asserts only "no console errors over
file://"), nor by 05-REVIEW.md's deep pass, nor by the 05-04-SUMMARY's own "synthetic-event probe"
(uncommitted, unverifiable, and evidently not run against the real page). The fix is narrow: give the
lesson/review opener's actual chapter-term element the `journey` class (or repoint the selector), plus
a committed regression check that a real lesson page contains a `.journey` element.

This looks like an honest miss, not an intentional deviation, so it is reported as a gap rather than
suggested for an override.

---

_Verified: 2026-07-14_
_Verifier: Claude (gsd-verifier)_
