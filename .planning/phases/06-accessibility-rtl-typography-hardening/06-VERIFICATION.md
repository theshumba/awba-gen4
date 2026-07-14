# 06-VERIFICATION — Phase 6 (Accessibility, RTL & Typography Hardening)

**Verifier:** orchestrator inline goal-backward (the background review/verify agents stalled twice on the stream watchdog this session; verification performed inline over the real codebase with independent gate re-runs, deep-diff review, and a non-vacuity audit of the probe suites).
**Method:** goal-backward — start from the phase goal + ACC-01/02/03 and confirm the *codebase delivers each*, not merely that tasks ran.
**Date:** 2026-07-14 · **Verdict: PASS** (human sensory walk carried forward per owner directive)

## Phase goal
*The whole app is keyboard-operable with a visible focus ring, announces in its own calm voice, passes WCAG AA contrast with non-colour signals, and renders every diacritic/bracket/mixed-bidi line correctly at every width — the same mercy, same calm (ACC-01/02/03).*

## Goal-backward checks

### ACC-01 — full keyboard operability + visible `:focus-visible` — DELIVERED
- Every interactive emitter is native `<button>`/`<a>` and there is zero positive `tabindex` app-wide (`a11y-keyboard.test.js`, ACTIVE assertions over the engine `.opt/.tf/.tile/.btn`/mute + learn `.onode/.hstat/.tab`/course-chip/`cc-go`/Festival-close).
- The register-aware `:focus-visible` ring resolves to the LIVE `--gold`/`--crimson` token per ground (probe compares against a hidden reference element — not a hardcoded hex); the one `[tabindex="-1"]:focus-visible{outline:none}` suppression is scoped to non-operable focus-landing headings only (review-confirmed: no `button/a/textarea/input` silenced).
- Resolved options, timeout-parked options, and the previously class-only `Check` now carry real `disabled` attributes (leave the tab order); the streak strip is a native `<button>`, the daily verse exposes a native `oayah-cite` button (06-06).
- **Evidence:** suite `a11y-keyboard` 0 todo / all ACTIVE / GREEN; RED→GREEN confirmed at 06-05 (selection) and 06-06 (conversions).

### ACC-02 — announcements + accessible names + labelled reflect — DELIVERED
- ONE body-level polite `.aw-sr role=status` region, `textContent`-only, lazily + DCL ensured, survives the runners' init `body.innerHTML` wipe and all subsequent child re-renders (`a11y-announce` asserts node identity + `isConnected`).
- Lesson: exactly one composed announce per `resolve()` (verdict + noor + combo folded) + `+15 noor — a reflection` + focus-to-heading on all six reward screens (focus for swaps, announce for in-place — no double-speak on the lesson side). Review: per-answer verdict announce + a single-fire `10 seconds` at `tleft===100` (the 100ms tick never announced) + timeout mercy + `Question N of M` + `result()` focus + stat.
- Icon-only controls named: mute `aria-label`, node state-in-name (`"{label}, {state phrase}"`), sheet accessible names, close buttons; the shipped `<label for="lsrt">` reflect label asserted ACTIVE.
- **Evidence:** suite `a11y-announce` 0 todo / GREEN, driving REAL `lessons/u1-m1.html` + `reviews/u1-review.html` flows (incl. `--virtual-time-budget` to reach the genuine timeout); `a11y-dialogs` sheet/popup/Festival names GREEN.

### ACC-03 — WCAG AA contrast + non-colour signal — DELIVERED
- `contrast-audit.mjs` proves every text (4.5:1 / 3:1 large) + non-text UI boundary (3:1) across 20 pages + 305 forced interaction states, exit 0 (the one real finding — `.ls-back` at ~1.2:1 on the Sky-night du'a terminal — is fixed to `--paper-62`, token-only).
- Non-colour selection channel: `aria-pressed` + a 2→3px held paper-press in BOTH runners (WCAG 1.4.1); miss/correct also carry the shape-first grammar, never colour-only.
- **Evidence:** `contrast-audit.mjs` exit 0 (22 OK / 0 FAIL, reproduced in isolation); `a11y-keyboard` selection-cue assertion GREEN. (Athar-bound per 06-CONTEXT: the requirement's legacy "amber/green/gold" reads as crimson/gold/ember.)

### RTL & typography hardening (the phase's other half) — DELIVERED
- `rtl-audit.mjs` (exit 0): every rendered Arabic run sits in `[lang=ar]`, every `[lang=ar]` computes `unicode-bidi:isolate`, `.ayah/.scripture` compute `direction:rtl`+isolate + ask for `Amiri Quran` first, no horizontal overflow at narrow+desktop across 20 pages + the fixture.
- `check-glyph-coverage.py` (exit 0): the rewritten 14-face gate (no retired-font reference) proves all 84 real-string-harvested codepoints are covered by their role-stack under the settled fallback law; it caught the stale Ḥ U+1E24 / Ḏ U+1E0E / Courier ā gaps.
- `scripts/fixtures/typo-stress.html` exists (neutral copy, every face + the diacritic set + brackets + honorific + mixed-bidi lines).

### Permanence, discipline, non-vacuity, review
- **Permanent gates:** the 3 new audits (contrast/rtl/glyph) are exit-code gates and the 3 probe suites are node:test members — all join the full gate; the baseline (114) never shrank (now 154, 0 fail, 0 todo).
- **Hardening discipline (D-67):** no mechanics/copy/schema/layout redesign; mechanics byte-preserved (PER_LESSON 12 / REFLECT 15 / QTIME 14 / 100ms + 1500ms untouched); zero new hex; `localStorage` 13 (engine) / 0 (learn); `@layer` order line ×1; glyphCount 13 — all re-verified green this session.
- **Non-vacuity:** the probe suites carry 39 / 46 / 34 substantive `assert` calls, 0 vacuous `assert(true)`; each asserts real DOM/computed state (activeElement, aria values, focus-return, defaultPrevented); RED→GREEN confirmed by three independent executors — a regression would fail them.
- **Code review:** 0 Critical / 1 Warning / 2 Suggestions. W1 (AW.sheet trap re-entrancy) FIXED + re-verified (7b805e1); S1/S2 documented.

## Gate re-run (this session, independent)
suite 154 pass / 0 fail / 0 todo · validator ×19 exit 0 (+3 accepted notes) + self-test · port-audit 20 BYTES OK / 0 DRIFT · render-smoke 21 OK · contrast-audit exit 0 (22/0, isolated) · rtl-audit exit 0 (21/0) · glyph gate exit 0 (84 cps) · every standing grep gate PASS.

## Honest caveat (not a gap — carried forward per owner directive)
The AUTOMATED accessibility proof is complete and permanent. The SUBJECTIVE on-device experience — real-keyboard feel, VoiceOver voice/timing, tofu/diacritic at true sub-500px, mixed-bidi visual order — is the 06-07 blocking human walk, resolved by the owner's standing directive and carried forward on the owner ledger (with S1's result-screen double-speak, R-8's visible-timer choice, and the wave taste-doubts). No owner walk has occurred; none is claimed.

## Verdict
**PASS.** Phase 6 delivers ACC-01/02/03 + RTL/typography hardening as permanent, independently-verified, gate-green mechanisms, with the one review Warning fixed. The human sensory walk is carried forward per directive. Phase 6 may close.
