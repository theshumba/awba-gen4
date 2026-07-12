---
phase: 3
slug: components-icon-kit-motion-language
status: approved
nyquist_compliant: true
wave_0_complete: false
created: 2026-07-12
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | `node:test` + `node:assert` (Node core, zero npm deps) + grep gates + human visual gate (D-44) |
| **Config file** | none |
| **Quick run command** | `node --test scripts/tests/*.test.js` (NEVER the directory form — Node v24.13.0 gotcha) |
| **Full suite command** | `node --test scripts/tests/*.test.js && node scripts/validate-content.js --self-test && python3 scripts/check-glyph-coverage.py` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `node --test scripts/tests/*.test.js` (26 existing tests MUST stay green)
- **After every plan wave:** Run the full suite command + the plan's grep gates
- **Before `/gsd:verify-work`:** Full suite green + automated prechecks green; human D-44 visual gate LAST
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | MOT-01/03 | T-03-01 | components layer consumes only tokens; 4 new tokens declared in tokens layer; full press inventory incl. .sheet-row | grep gates + baseline | token/class greps + `node --test scripts/tests/*.test.js` | n/a | ⬜ pending |
| 03-01-02 | 01 | 1 | MOT-04 | T-03-01 | dual-trigger reduced-motion: loops `animation:none` under BOTH `@media` and `[data-motion=reduce]` | grep gates | reduced-motion greps + sed-range easing check | n/a | ⬜ pending |
| 03-02-01/02 | 02 | 1 | FND-04 | T-03-SC | 21 KIT scenes (20 + authored lantern-gold) + 13 GLYPHS, zero regex recolor | node -e assertions | KIT/GLYPHS count checks | n/a | ⬜ pending |
| 03-03-01 | 03 | 2 | FND-04, ENG-06 | T-03-V5 | AW.icon aria-hidden default + escaped labels; AW.cite byte-compat with validator stub | node -e + self-test | icon/cite assertions + `node scripts/validate-content.js --self-test` | n/a | ⬜ pending |
| 03-03-02 | 03 | 2 | ENG-06, MOT-04 | T-03-V5 | sheets: face split + always-on pending pill; confetti/animate self-guard; no localStorage from KIT banner onward (banner-anchored sed gate) | node -e + greps | reducedMotion probe + banner-anchored localStorage gate | n/a | ⬜ pending |
| 03-03-03 | 03 | 2 | FND-04, ENG-06, MOT-04 | — | ≥7 new unit tests; suite ≥33 pass, fail 0 (content-asserted, exit-code-safe) | node:test | `OUT=$(node --test scripts/tests/*.test.js 2>&1); … grep 'fail 0' && grep -E 'pass (3[3-9]|…)'` | ❌ W0 | ⬜ pending |
| 03-04-01/02 | 04 | 3 | FND-04, ENG-06, MOT-01/03/04 | T-03-V5 | preview §9–12 real engine output; verbatim scripture markers; mercy isolation; zero CDN | grep chains | section/content greps + suite green | n/a | ⬜ pending |
| 03-05-01 | 05 | 4 | all | — | automated prechecks then 10-item human D-44 checklist (u4 combo + both reduced-motion paths + full 8-class press inventory) | prechecks + human | precheck chain + reviewer verdict | n/a | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Existing 26-test suite stays green (regression baseline — every wave)
- [ ] Any new node:test files land under `scripts/tests/` per the Phase-2 convention

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| D-44 visual gate: icons crisp at UI sizes, gold lantern intentional, sheets premium, press gummy-not-mushy, reduced-motion collapses everything (both trigger paths) | FND-04, ENG-06, MOT-01/03/04 | Visual craft cannot be grep'd | Melusi opens preview.html over file://, walks the D-44 checklist; OS Reduce Motion toggle + `AW.prefs.set('motion','reduce')` console path both demonstrated |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references (components.test.js lands with its own plan)
- [x] No watch-mode flags
- [x] Feedback latency < 10s
- [x] `nyquist_compliant: true` set in frontmatter (after fixing the two no-op gates the plan-checker caught in 03-03 — localStorage gate now banner-anchored, test gate now content-asserted)

**Approval:** approved 2026-07-12 (plan-checker: 2 blockers fixed by orchestrator, empirically-verified fixes; 0 remaining blockers)
