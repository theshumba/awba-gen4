---
phase: 2
slug: state-layer-engine-contract-freeze
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-07-12
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | `node:test` + `node:assert` (Node core, zero npm deps — verified on Node v24.13.0) |
| **Config file** | none — no package.json required; plain `node --test` |
| **Quick run command** | `node --test scripts/tests/` |
| **Full suite command** | `node --test scripts/tests/ && node scripts/validate-content.js --self-test` |
| **Estimated runtime** | ~2–5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `node --test scripts/tests/`
- **After every plan wave:** Run the full suite command
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| (filled by planner) | | | FND-05 | | corrupted-JSON/quota-throw tolerated, no data loss | unit | `node --test scripts/tests/` | ❌ W0 | ⬜ pending |
| (filled by planner) | | | FND-06 | | prefs isolated from progress blob | unit | `node --test scripts/tests/` | ❌ W0 | ⬜ pending |
| (filled by planner) | | | FND-07 | | no ES modules / no raw localStorage outside state section | grep gate | `! grep` assertions per plan | n/a | ⬜ pending |
| (filled by planner) | | | ENG-07 | | vm sandbox executes untrusted-shaped data files with stubs only | self-test | `node scripts/validate-content.js --self-test` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `scripts/tests/` directory with `node:test` test files for state layer (migration losslessness, prefs isolation, date formatting) — created by the plan that builds the state layer
- [ ] `scripts/fixtures/` — valid lesson + valid review + deliberately-broken lesson fixtures (neutral placeholder copy, never scripture)
- [ ] No framework install needed — Node core only

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Real-browser `file://` load: double-click a page, `window.AW` defined, no console errors | FND-07 | Browser file:// security context can't be fully reproduced in node | Double-click the harness/preview page; check DevTools console; run the seeded-console migration recipe from the plan SUMMARY |
| Reviewer seeds legacy Gen-3 `awba_*` keys in DevTools, reloads, sees values preserved | FND-05 | Success criterion is defined as a human-reproducible browser check | Console recipe recorded in the executing plan's SUMMARY |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
