---
phase: 1
slug: foundation-design-tokens-responsive-shell-fonts
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-07-12
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution. Derived from 01-RESEARCH.md §Validation Architecture.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None (greenfield, zero package.json) — deliberately NOT introduced this phase; Python (already present) runs the one automatable check |
| **Config file** | none — Wave 0 adds the script only |
| **Quick run command** | `python3 scripts/check-glyph-coverage.py` |
| **Full suite command** | `python3 scripts/check-glyph-coverage.py` (only one automated check this phase) |
| **Estimated runtime** | ~2 seconds |

---

## Sampling Rate

- **After every task commit:** Run `python3 scripts/check-glyph-coverage.py` (once font files exist)
- **After every plan wave:** Same + full manual `preview.html` walkthrough against the UI-SPEC D-12 8-item checklist
- **Before `/gsd:verify-work`:** Glyph script green + all 8 preview.html checklist items pass
- **Max feedback latency:** ~60 seconds (manual walkthrough included)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| TBD | TBD | W0+ | FND-03 (glyph coverage) | — | N/A | unit (fontTools cmap) | `python3 scripts/check-glyph-coverage.py` | ❌ W0 | ⬜ pending |
| TBD | TBD | 1 | FND-01 (@layer declared once) | — | N/A | lint (grep) | `grep -c '^@layer [a-z]*, ' shared/awba-engine.css` → exactly 1 | ❌ W0 | ⬜ pending |
| TBD | TBD | 1 | FND-02 (unit recolor, all 7 slots) | — | N/A | manual | preview.html unit toggle (D-12 §2) | N/A visual | ⬜ pending |
| TBD | TBD | 1 | PLT-01 (full-bleed <600px, column ≥600px, no h-scroll @320px) | — | N/A | manual | Resize preview.html 320→1440px | N/A visual | ⬜ pending |
| TBD | TBD | 1 | FND-03 (zero font CDN requests) | — | N/A | manual/smoke | DevTools Network filter "font" on preview.html (D-12 §8) | N/A manual | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky. Planner fills Task IDs (Dimension 8).*

---

## Wave 0 Requirements

- [ ] `scripts/check-glyph-coverage.py` — fontTools cmap check against the UI-SPEC subset contract (code provided verbatim in 01-RESEARCH.md)
- [ ] No test framework install — Python already present; Jest/Vitest deliberately deferred until Phase 2 (first JS logic)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Full unit recolor incl. secondary accents | FND-02 | Visual judgment of rendered CSS | preview.html unit-switch cluster; confirm all 7 accent slots + no residual indigo on u2/u3 |
| Responsive shell adaptation | PLT-01 | Layout behavior across widths | Resize 320→1440px; full-bleed below 600px, centered column above; zero horizontal scroll at 320px |
| No FOUC / correct glyph rendering | FND-03 | Perceptual + render check | Reload preview.html; glyph-test block shows ˹ ˺ · î â û ﷺ + Arabic correctly in all 4 faces |
| Zero CDN font requests | FND-03 | Network inspection | DevTools Network tab, "font" filter — all requests same-origin |

*(Most Phase 1 success criteria are inherently visual/structural — verified via preview.html's manual checklist per UI-SPEC D-12; expected for a token/shell phase, not a coverage gap.)*
