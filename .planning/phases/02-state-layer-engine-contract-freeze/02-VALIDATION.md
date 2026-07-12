---
phase: 2
slug: state-layer-engine-contract-freeze
status: approved
nyquist_compliant: true
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
| 02-01-01 | 01 | 1 | FND-05/06 | T-02-01 | RED scaffold: seeds legacy keys, pins lossless/corrupt-tolerant contract | unit (RED) | `node --test scripts/tests/` (expected non-zero) | ❌ W0 | ⬜ pending |
| 02-01-02 | 01 | 1 | FND-05, FND-06 | T-02-01/02 | corrupted-JSON/quota-throw tolerated, no data loss; prefs isolated from progress blob | unit | `node --test scripts/tests/state-storage.test.js` | ❌ W0 | ⬜ pending |
| 02-01-03 | 01 | 1 | FND-05, FND-07 | T-02-04 | helpers pure/DOM-free; no ES modules; localStorage only in engine STATE section | unit + grep gate | `node --test scripts/tests/` + `! grep -q` gates | ❌ W0 | ⬜ pending |
| 02-02-01 | 02 | 2 | ENG-07 | T-02-06 | fixtures classic-script/no-storage/no-scripture; self-test RED pins error contract | fixture (RED) | `node --test scripts/tests/validate.test.js` (expected non-zero) | ❌ W0 | ⬜ pending |
| 02-02-02 | 02 | 2 | ENG-07 | T-02-03/06/07 | vm sandbox with 3 stubs only; malformed file = reported error not crash; raw-string id walk | self-test | `node scripts/validate-content.js --self-test && node --test scripts/tests/validate.test.js` | ❌ W0 | ⬜ pending |

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

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references (Task 1 of each plan is the RED scaffold)
- [x] No watch-mode flags
- [x] Feedback latency < 10s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-07-12 (plan-checker: 0 blockers; checks 8a–8d pass against final plan tasks)
