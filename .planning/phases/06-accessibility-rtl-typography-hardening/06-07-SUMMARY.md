# 06-07 SUMMARY — Phase 6 Accessibility Gate (prechecks + human checkpoint)

**Plan:** 06-07 (`type: execute`, `autonomous: false`) · **Status:** COMPLETE 2026-07-14
**Requirements:** ACC-01, ACC-02, ACC-03 (all → Complete)
**Executor:** orchestrator inline (verification-only plan — no source edits, no subagent; matches the 03-05/04-07/05-06 precedent).

---

## Task 1 — Full automated precheck set: ALL GREEN

Every precondition of the phase gate was run inline (in isolated stages to avoid Chrome-contention flakes on the three headless-Chrome audits) and passes. This is the hard precondition to the human checkpoint.

| Precheck | Command | Result |
|---|---|---|
| Full suite | `node --test scripts/tests/*.test.js` | exit 0 · **tests 154 / pass 154 / fail 0 / todo 0** (≥114 baseline, `todo 0` hard gate met) |
| Probe files un-todoed | `! grep -q '{ todo' scripts/tests/a11y-{keyboard,dialogs,announce}.test.js` | **0 / 0 / 0** — every a11y probe assertion is now ACTIVE |
| Content validator | `node scripts/validate-content.js lessons/*.html reviews/*.html` | exit 0 · exactly **3** accepted `note:` warnings (u3-m1 `baqarah-2-163`, u3-m3 `imran-3-19`, u4-m2 `rububiyah` — never "fixed", D-49) |
| Validator self-test | `node scripts/validate-content.js --self-test` | exit 0 (SELF-TEST OK) |
| Port fidelity | `node scripts/port-audit.mjs` | exit 0 · **20 BYTES OK / 0 DRIFT** + `HOLD OK — U4-03 absent` + `DAILY BYTES OK` |
| Render smoke | `node scripts/tests/render-smoke.mjs` | exit 0 · **21 SMOKE OK / 0 FAIL** (incl. `SMOKE OK learn.html`) |
| Contrast audit (D-68) | `node scripts/tests/contrast-audit.mjs` | exit 0 · **22 CONTRAST OK / 0 FAIL** (isolated run; the earlier transient exit-1 was concurrent-Chrome contention, reproduced green 5×) |
| RTL audit (D-68) | `node scripts/tests/rtl-audit.mjs` | exit 0 · **21 RTL OK / 0 FAIL** |
| Glyph gate (D-68) | `python3 scripts/check-glyph-coverage.py` | exit 0 · **84 harvested codepoints covered** (rewritten 14-face gate, no retired-font reference) |

**Standing grep gates (all PASS):**
- No gated literal in `learn.html` / `shared/awba-engine.js` / `shared/awba-engine.css` (`fonts.googleapis`, `confetti`, `class="perfect"`, `class="combo"`, `poppins`, `lantern-gold`, `gold-bg` all absent).
- No `amber` in `learn.html`; no `amber` / `rgba(37,54,` in the two shared files; no `--accent` in the shared CSS (04-07 precedent scope, now including the JS).
- No raw `localStorage` in `learn.html` (== 0); `grep -c localStorage shared/awba-engine.js` == **13**.
- `@layer tokens, base, components, screens, motion;` count == **1** (shared CSS); `learn.html` does **not** re-declare the order line (its one page-authored `<style>` uses `@layer screens` additively — 06-06 deviation, verified benign).
- `glyphCount` == 13 (enforced by `components.test.js`, suite green).
- `@view-transition` present + the reduced-motion `::view-transition-group(*)` kill block present in the shared CSS; **no `view-transition-name` in `learn.html`** (the shared-element morph is owned by the 05-04 engine).

**No precheck failed** → no route-back was needed. Per the plan, nothing was patched at the gate to force a pass.

---

## Task 2 — Human checkpoint (blocking): RESOLVED BY OWNER STANDING DIRECTIVE, walk carried forward

The plan's Task 2 is a BLOCKING ~11-item human walk (real keyboard + VoiceOver + type at 320px/desktop + mixed-bidi read), `autonomous: false`, never auto-approved.

**Resolution (recorded honestly):** The owner's standing directive for this build is *"finish executing everything until the entire app is finished; resolve human gates by that directive and carry the visual-walk items forward on the owner ledger."* This is the same resolution applied at the 04-07 and 05-06 gates. Accordingly:

- The gate is resolved **by directive to proceed autonomously** — **NOT** by any owner having walked the ~11 items and said "approved." No human keyboard/VoiceOver/typography walk has occurred; **no owner approval is claimed or implied.**
- The full ~11-item walk is **carried forward as an owner follow-up on the finished app** (owner ledger below), together with every accumulated executor taste/behaviour doubt from waves 06-01…06-06.
- The automated proof underneath the walk is complete and permanent: the whole app is keyboard-operable with register-scoped focus rings, announces via one polite live region, passes WCAG AA contrast (text + UI boundaries) with non-colour selection signals, and renders every diacritic/bracket/mixed-bidi run correctly across 20 pages + the stress fixture — all as permanent suite/audit members that cannot silently regress.

### The ~11-item walk carried forward (owner does on the finished app)
1. Complete a whole LESSON by keyboard with an always-visible focus ring on the grain.
2. Complete a timed REVIEW + claim a CHEST by keyboard (incl. Escape), focus always sensible.
3. On the PATH: Tab in journey order; every popup/sheet contains focus then hands it back.
4. (VoiceOver) Lesson verdict / noor / screen-change spoken in the calm voice, never doubled, never debug-like. *(Note: 06-05 flagged a mild, spec-directed result-screen double-speak + the synchronous-announce behaviour to spot-check.)*
5. (VoiceOver) Review: single soft "10 seconds", merciful timeout line, next-question announced; the 100ms tick never spoken.
6. (VoiceOver) Every node says its state in its name; icon-only controls (mute, HUD, closes) named.
7. Selection felt without colour — "pushed in and thicker", resolved options leave the tab order. *(06-05: `.tile` placed-token cue + held-press on-device feel to eyeball.)*
8. `scripts/fixtures/typo-stress.html` at 320px + desktop: all diacritics + `˹ ˺` + `ﷺ` + ornate `﴾ ﴿` render as real glyphs, no tofu. *(06-02: sub-500px is a true human-gate item — headless floor is ~500px; ornate `﴾﴿` render via system-Arabic fallback in the fixture and are unused by the app.)*
9. Real ayah page + daily verse at 320px/desktop: Quran face, RTL, no line runs off-edge.
10. Mixed Arabic+Latin line (ayah ref, sheet source) sits in correct visual order.
11. Whole app still feels like the same calm, world-class book — no surface got louder, no colour invented, no word of scripture changed.

*(Route-back map if any item is a NO — from the plan: 1/2/3 → 06-04/05/06; 4/5 → 06-05; 6 → 06-06; 7 → 06-05; 8 → 06-02; 9/10 → 06-02/owning surface; 11 → owning surface.)*

---

## Owner ledger (surfaced at this gate — none are build-blockers)

- **R-8** — the review timer is **announcement-only** (a single spoken "10 seconds" + the timeout mercy line). A **visible Courier seconds readout remains a deferred owner choice** — the one new gate-walk ledger item this phase.
- **R-6** — the 15 verified Arabic chapter-terms (unit Farag-square headers currently the English fallback).
- **R-7** — the verified Ibrahim 14:24 "good word / good tree" splice (currently an authorial framing line + "translation pending review").
- **D-52 / MOT-05** — sound-cue assets (engine ships silent plumbing + a mute toggle).
- Scholar gate on all 65 atoms; Clear Quran commercial licensing.
- Carry-forwards from earlier phases: ember vividness at lesson scale, thread-jitter taste follow-up.
- Minor DOM note (06-06): `#streakStrip` is a `<button>` wrapping `<div>` children — valid, renders + tests GREEN, kept to preserve the shipped block structure; revisit only if a real SR reports awkward phrasing.

---

## Deviations at this gate

None. Verification-only; no source was touched. The one interpretive call (contrast-audit's earlier transient exit-1) was diagnosed as Chrome contention and disproved by isolated re-runs — not a real finding.

## Result

Phase 6's accessibility contract is **automatically proven green** (ACC-01/02/03 as permanent suite + audit members) and the blocking human walk is **resolved by the owner's standing directive and carried forward on the owner ledger** — never auto-approved as owner-confirmed. Phase 6 proceeds to code-review → verifier → close.
