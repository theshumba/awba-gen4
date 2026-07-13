---
phase: 5
slug: learn-page-cross-page-view-transitions
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-07-13
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | node:test (zero-dep, headless; ls-stub `loadEngine` harness) + headless system Chrome for render-smoke |
| **Config file** | none — scripts/tests/*.test.js discovered by glob |
| **Quick run command** | `node --test scripts/tests/*.test.js` (glob form ONLY — directory form breaks this Node v24.13.0) |
| **Full suite command** | `node --test scripts/tests/*.test.js && node scripts/validate-content.js lessons/*.html reviews/*.html && node scripts/validate-content.js --self-test && node scripts/port-audit.mjs && node scripts/tests/render-smoke.mjs` |
| **Estimated runtime** | ~15 seconds (suite <1s; render-smoke ~10s over 20 pages) |

---

## Sampling Rate

- **After every task commit:** Run `node --test scripts/tests/*.test.js`
- **After every plan wave:** Run the full suite command (validator runs are EXIT-CODE-FIRST — never piped into grep)
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 20 seconds

Baseline: **98/98** at phase open — the count never shrinks silently.

---

## Per-Task Verification Map

(Filled by the planner per plan; the requirement→test map from 05-RESEARCH.md §Validation Architecture applies:)

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| TBD | — | — | CNT-03 (unlock order) | — | node-state walk matches Gen-3 exactly | unit | `node --test scripts/tests/*.test.js` (learn-state test drives AW.deriveNodeState + chest rule through storage fixtures) | ❌ W0 | ⬜ pending |
| TBD | — | — | RWD-04 (chest +25 once) | — | idempotent claim, deterministic | unit | claim-twice probe: noor delta exactly 25 | ❌ W0 | ⬜ pending |
| TBD | — | — | LRN-05 (day-of-year) | — | pure `AW.dailyIndex` — local date parts, no toISOString | unit | fixed-date fixtures incl. Dec 31/Jan 1 + leap day | ❌ W0 | ⬜ pending |
| TBD | — | — | D-57 (atom map) | — | NODE_ATOMS sums to 61; AW.atomsDone(stars) exact | unit | sum + per-unit fixtures | ❌ W0 | ⬜ pending |
| TBD | — | — | LRN-01/02 (page renders) | — | zero console errors, reg-orbit root | smoke | `node scripts/tests/render-smoke.mjs learn.html` (extend to root pages) | ❌ W0 | ⬜ pending |
| TBD | — | — | MOT-02 (VT wiring) | — | @view-transition present once; reduced-motion kill block present; no view-transition-name on scripture | grep | static gates | ❌ W0 | ⬜ pending |
| TBD | — | — | DAILY pool byte-fidelity | — | 7 verses byte-identical to Gen-3 | sha | port-audit-style SHA check of the DAILY region | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `scripts/tests/learn-state.test.js` — stubs for CNT-03/RWD-04/LRN-05/D-57 (extend the ls-stub harness pattern from runner-*.test.js)
- [ ] `scripts/tests/render-smoke.mjs` — extend to scan root-level pages (learn.html) alongside lessons/ + reviews/
- [ ] No framework install needed — existing zero-dep infrastructure covers everything

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Path reads as a hand-inked journey (not re-skinned circles) | LRN-04 | aesthetic judgment | open learn.html over file://, judge at 375px + desktop |
| Popup anchoring/clamping feel at screen edges | LRN-03 | interaction feel | tap first/last nodes at 320px width |
| Cross-doc morph node→lesson (needs http origin) | MOT-02 | file:// no-ops by spec; morph only visible over http | `npx serve` once, walk path→lesson→back |
| Circuit-plate claim moment (Festival stamp + crowd arrival) | RWD-04/D-56 | choreography feel | complete a unit review, claim the gift |
| Daily ayah reverence on dark ground | LRN-05 | scripture presentation judgment | visual check, reduced-motion on/off |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 20s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
