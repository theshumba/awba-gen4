---
phase: 1
slug: foundation-design-tokens-responsive-shell-fonts
status: mapped
nyquist_compliant: true
wave_0_complete: false
created: 2026-07-12
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution. Derived from 01-RESEARCH.md §Validation Architecture. Task IDs filled by the planner (Dimension 8).

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None (greenfield, zero package.json) — deliberately NOT introduced this phase; Python (already present) runs the one automatable check |
| **Config file** | none — Plan 01 Task 1 adds the script only |
| **Quick run command** | `python3 scripts/check-glyph-coverage.py` |
| **Full suite command** | `python3 scripts/check-glyph-coverage.py` (only one automated check this phase) |
| **Estimated runtime** | ~2 seconds |

---

## Sampling Rate

- **After every task commit:** Run `python3 scripts/check-glyph-coverage.py` (once font files exist, i.e. after Plan 01 Task 2)
- **After every plan wave:** Same + full manual `preview.html` walkthrough against the UI-SPEC D-12 8-item checklist
- **Before `/gsd:verify-work`:** Glyph script green + all 8 preview.html checklist items pass (Plan 04)
- **Max feedback latency:** ~60 seconds (manual walkthrough included)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 01-01-T1 | 01-01 | 1 | FND-03 (glyph gate scaffold — the "failing test first") | T-01-SC | subset-integrity gate exists | scaffold (Wave 0) | `python3 scripts/check-glyph-coverage.py` (expected RED — fonts absent) | ❌ → created here | ⬜ pending |
| 01-01-T2 | 01-01 | 1 | FND-03 (glyph coverage) | T-01-SC | corrupted/wrong font fails cmap check | unit (fontTools cmap) | `python3 scripts/check-glyph-coverage.py` (exit 0) | ✅ after task | ⬜ pending |
| 01-02-T1 | 01-02 | 2 | FND-01 (@layer once) + FND-02 (per-unit 7-slot scales) | T-01-ID | single token source; no shared --blue2/3 | lint (grep) | `grep -c '^@layer [a-z]*, ' shared/awba-engine.css` → 1; 4× `[data-unit]`; `#241A00` present, `#3A2B00` == 0 | ✅ after task | ⬜ pending |
| 01-02-T2 | 01-02 | 2 | PLT-01 (responsive shell grid) | — | N/A | lint (grep) | `grep -c '100dvh'` ≥1 + `min-width: ?600px` ≥1 + no `788px/380px` | ✅ after task | ⬜ pending |
| 01-03-T1 | 01-03 | 3 | FND-02 (recolor switch) + PLT-01 (shell skeleton) | — | N/A | lint + manual | `grep -c 'viewport-fit=cover' preview.html` → 1; `data-unit` switch mutates document element | ✅ after task | ⬜ pending |
| 01-03-T2 | 01-03 | 3 | FND-03 (zero-CDN + glyph render) | T-01-ID | zero runtime CDN font requests | lint (grep) | `grep -Ec 'fonts\.(googleapis\|gstatic)\.com' preview.html` → 0; bracket ˹ present | ✅ after task | ⬜ pending |
| 01-04-T1 | 01-04 | 4 | FND-01 · FND-02 · FND-03 · PLT-01 (visual gate) | T-01-VER | gates run before human sign-off | manual (D-12 8-item) | prechecks: glyph green + `viewport-fit=cover` + zero-CDN, then reviewer walkthrough | N/A visual | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky.*

---

## Wave 0 Requirements

- [ ] `scripts/check-glyph-coverage.py` — fontTools cmap check against the UI-SPEC subset contract (code provided verbatim in 01-RESEARCH.md). **Created in Plan 01 Task 1** (the walking-skeleton "failing test first"); goes green in Plan 01 Task 2.
- [ ] No test framework install — Python already present; Jest/Vitest deliberately deferred until Phase 2 (first JS logic)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions | Verified In |
|----------|-------------|------------|-------------------|-------------|
| Full unit recolor incl. secondary accents | FND-02 | Visual judgment of rendered CSS | preview.html unit-switch cluster; confirm all 7 accent slots + no residual indigo on u2/u3/u4 | 01-04-T1 |
| Responsive shell adaptation | PLT-01 | Layout behavior across widths | Resize 320→1440px; full-bleed below 600px, centered column above; zero horizontal scroll at 320px | 01-04-T1 |
| No FOUC / correct glyph rendering | FND-03 | Perceptual + render check | Reload preview.html; glyph-test block shows ˹ ˺ · î â û ﷺ + Arabic correctly in all 4 faces | 01-04-T1 |
| Zero CDN font requests | FND-03 | Network inspection | DevTools Network tab, "font" filter — all requests same-origin | 01-04-T1 |

*(Most Phase 1 success criteria are inherently visual/structural — verified via preview.html's manual checklist per UI-SPEC D-12; expected for a token/shell phase, not a coverage gap. The one objective automated gate is `check-glyph-coverage.py`; structural greps back the token/shell/CDN assertions.)*
