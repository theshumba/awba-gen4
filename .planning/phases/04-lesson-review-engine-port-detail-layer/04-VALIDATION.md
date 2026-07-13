---
phase: 4
slug: lesson-review-engine-port-detail-layer
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-07-13
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | node:test (built-in, Node v24.13.0) |
| **Config file** | none — zero-dep; tests in `scripts/tests/*.test.js` |
| **Quick run command** | `node --test scripts/tests/*.test.js` (glob form ONLY — directory form breaks on this Node) |
| **Full suite command** | `node --test scripts/tests/*.test.js && node scripts/validate-content.js && node scripts/validate-content.js --self-test` |
| **Estimated runtime** | ~2–5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `node --test scripts/tests/*.test.js`
- **After every plan wave:** Run the full suite command (tests + content validator + self-test)
- **Before `/gsd:verify-work`:** Full suite must be green (baseline entering phase: 64 pass / 0 fail)
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

*To be filled by the planner — every plan task must map here. Anchors established by research:*

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| (planner fills) | | | ENG-01..05, CNT-01/02/04, RWD-01..03, MOT-05 | T-04-* | scripture byte-fidelity; no CDN; holds intact | unit + validator + grep gates | see quick/full commands | | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `scripts/tests/runner-math.test.js` — stubs for extracted pure helpers (starsFor / scoring / timer-scoring / combo thresholds) per RESEARCH.md's recommendation (ENG-03/ENG-04 numbers pinned headlessly)
- [ ] Content byte-fidelity check harness — SHA compare of each spliced cfg region vs `_MVP-BUILD` source (CNT-01), runnable via node one-liner or a small script under scripts/
- [ ] Holds grep pass script/commands recorded (CNT-02: U4-03 absent, U3-13 not surfaced, U3-16 principle-only, group-namings held)

*Existing infrastructure (node:test + validate-content.js) covers contract-shape validation; Wave 0 adds mechanics-math and byte-fidelity pinning.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Reward choreography feel (staggered reveals, Ring frontier draw, du'a close) | RWD-01 | Motion feel is a human judgement; structure is automatable but "reads as a sequence of moments" is not | Open a completed lesson over file://, finish it, watch verdict→noor→returns→done; Ring draws only new frontier |
| Celebration never over scripture | RWD-03 | Placement is grep-gated, but visual adjacency needs eyes | During a lesson, confirm nothing celebratory renders on/beside a verse beat |
| Sound mute toggle visible; silent placeholders no-op cleanly | MOT-05 | Audio absence is silent by definition | Toggle mute; check console shows zero errors with no sfx files present |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
