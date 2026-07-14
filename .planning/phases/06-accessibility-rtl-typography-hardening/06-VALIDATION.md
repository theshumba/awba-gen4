---
phase: 6
slug: accessibility-rtl-typography-hardening
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-07-14
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | node:test (zero-dep) + headless system Chrome (learn-dom-flows/render-smoke harness pattern) + python3 (glyph cmap checks) |
| **Config file** | none — scripts/tests/*.test.js discovered by glob |
| **Quick run command** | `node --test scripts/tests/*.test.js` (glob form ONLY on this Node) |
| **Full suite command** | `node --test scripts/tests/*.test.js && node scripts/validate-content.js lessons/*.html reviews/*.html && node scripts/validate-content.js --self-test && node scripts/port-audit.mjs && node scripts/tests/render-smoke.mjs` |
| **Estimated runtime** | ~25 seconds (suite + smoke + the new audits) |

Baseline: **114/114** at phase open — never shrinks.

---

## Sampling Rate

- **After every task commit:** `node --test scripts/tests/*.test.js`
- **After every plan wave:** the full suite command (validator exit-code-first, never piped to grep)
- **Before verify:** full battery green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

(Planner fills per plan; the requirement→test map from 06-RESEARCH §Validation Architecture applies:)

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| TBD | — | — | ACC-01 keyboard | — | every interactive = native semantics; focus-trap wrap logic; :focus-visible rule assertable via el.matches after programmatic focus | headless probe | keyboard-walk test (learn-dom-flows pattern; synthetic-Tab limit on record — trap wrap logic tested directly, `.click()` not synthetic Enter) | ❌ W0 | ⬜ pending |
| TBD | — | — | ACC-02 announcements | — | one role="status" region OUTSIDE swapped containers; AW.announce fires on verdict/noor/timeout/etc.; no announce on timer tick | headless probe + unit seam | live-region content assertions after driven flows; `--virtual-time-budget` fast-forwards the 14s timeout | ❌ W0 | ⬜ pending |
| TBD | — | — | ACC-03 contrast + non-colour | — | computed-style audit over rendered pages with forced states; every failure fixed token-only | audit script (permanent) | `node scripts/tests/contrast-audit.mjs` (or equivalent) exit 0 | ❌ W0 | ⬜ pending |
| TBD | — | — | SC4 typography/RTL | — | rewritten glyph gate passes (current script exits 1 — Wave-0 rewrite); lang/dir/bidi-isolate census over rendered pages; fixture stress page (neutral copy, never scripture) | script + fixture | glyph gate exit 0 + rtl-census assertions | ❌ W0 | ⬜ pending |
| TBD | — | — | regressions | — | suite baseline 114 grows, never shrinks; all standing gates | suite | full battery | ✅ | ⬜ pending |

---

## Wave 0 Requirements

- [ ] **Rewrite `scripts/check-glyph-coverage.py`** — currently exits 1 (references the deleted retired-font file) and misses real-app codepoints (U+1E24 Ḥ, U+1E0E Ḏ, Courier ā). Must pass against the shipped font set + the real codepoint census before any typography task claims green.
- [ ] `scripts/tests/` keyboard/announce probe harness extension (learn-dom-flows pattern)
- [ ] contrast-audit script skeleton with the state-forcing table from RESEARCH
- [ ] `scripts/fixtures/typo-stress.html` (neutral copy — NEVER scripture, Phase-2 fixture law)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Visible focus ring aesthetics per register | ACC-01 | :focus-visible heuristics differ under real input | Tab through learn/lesson/review with a real keyboard |
| SR announcement timing/voice quality | ACC-02 | VoiceOver quirks not headless-testable | VoiceOver walk of one lesson + one review timeout |
| Tofu/diacritic rendering at pixel level | SC4 | automated pixel tofu detection ruled out (RESEARCH) | eyeball the stress fixture + real ayah pages at 320px/desktop |
| Mixed Arabic/Latin visual order | SC4/CNT-04 | visual-order judgment | read the daily ayah ref line + sheet source lines |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references (incl. the glyph-gate rewrite)
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
