---
phase: 3
slug: components-icon-kit-motion-language
status: draft
nyquist_compliant: false
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
| (filled by planner) | | | FND-04 | | 20 canonical icons + gold variant + glyphs, one source, aria-hidden default | grep gates | icon-count/aria-hidden greps per plan | n/a | ⬜ pending |
| (filled by planner) | | | ENG-06 | | cite markup byte-compatible with validator stub; sheets escape nothing over scripture | grep + node:test | `node --test scripts/tests/*.test.js` | ❌ W0 | ⬜ pending |
| (filled by planner) | | | MOT-01/03 | | motion layer consumes only Phase-1 tokens; no new easing/hex literals in components | grep gates | `! grep` assertions per plan | n/a | ⬜ pending |
| (filled by planner) | | | MOT-04 | | ambient loops `animation:none` under BOTH media query and `[data-motion=reduce]`; JS motion self-guards at call time | grep + human | reduced-motion rule greps + D-44 item | n/a | ⬜ pending |

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

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
