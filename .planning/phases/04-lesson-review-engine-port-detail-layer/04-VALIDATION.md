---
phase: 4
slug: lesson-review-engine-port-detail-layer
status: draft
nyquist_compliant: true
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

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 04-01-T1 | 04-01 | 1 | ENG-03, ENG-04 | T-04-01 | lessonStars/reviewScore/reviewStars/comboShow/comboPerfect pure + exact Gen-3 numbers | unit (node:test) | node:test glob on runner-math.test.js fail 0 + full suite fail 0 | ❌ W0 | ⬜ pending |
| 04-01-T2 | 04-01 | 1 | MOT-05 | T-04-01a | AW.sound silent no-op; soundMuted read; no throw | unit + grep gate | shared/sfx/.gitkeep exists + AW.sound/prefs.get/sfx-path grep + suite fail 0 | ❌ W0 | ⬜ pending |
| 04-01-T3 | 04-01 | 1 | ENG-03, ENG-04 (Wave-0 harness) | T-04-01b, T-04-01c | zero-console-error render check; cfg byte-fidelity SHA + CDN/retired/holds greps | harness (Chrome CLI + Node core) | render-smoke.mjs + port-audit.mjs file-exists, run to "no pages yet"/OK on empty dirs + suite fail 0 | ❌ W0 | ⬜ pending |
| 04-02-T1 | 04-02 | 2 | ENG-01 | T-04-02a | @layer order line untouched; no pill-fill HUD; thermal shape-first grammar | grep gate | order-line count==1 + class-presence grep (.stage/.ls-hud/.ls-prog) + poppins/--accent/rgba(37,54, negation + suite fail 0 | ✅ | ⬜ pending |
| 04-02-T2 | 04-02 | 2 | ENG-01, ENG-05, CNT-04 | T-04-02b | scripture-law scard (--go:0, no celebration class); 4 distinct panel variants; shape+label lens cues | grep gate | .scard/.v-guard/.v-pull/.v-tell/.v-check/.lacc presence + celebration-inside-scard negation + order-line==1 + poppins/confetti negation + suite fail 0 | ✅ | ⬜ pending |
| 04-02-T3 | 04-02 | 2 | ENG-01 | T-04-02b | apricot decorative glow only (never text); weekcal never-miss; crimson banned on Orbit | grep gate | .noorbig/.rw-verdict/.rw-returns/.weekcal/.rw-ring/.rw-dua presence + celebration-adjacent-scripture negation + order-line==1 + poppins/confetti/amber negation + --apricot token presence + suite fail 0 | ✅ | ⬜ pending |
| 04-03-T1 | 04-03 | 3 | ENG-01, ENG-05, CNT-04 | T-04-03b | 6 content beats render via shipped primitives; scripture law honored; no retired API reintroduced | unit + grep gate | function AwbaLesson exists + localStorage count==13 + order-line==1 + AW.skeleton/AW.ill/AW.STARG/AW.confetti negation + suite fail 0 | ✅ | ⬜ pending |
| 04-03-T2 | 04-03 | 3 | ENG-03, MOT-05 | T-04-03a | quiz math exact via 04-01 helpers; law-8 wrong-answer; mute toggle wired | unit + grep gate | AW.lessonStars/comboShow/comboPerfect + AW.sound('correct') + prefs.set('soundMuted') grep + confetti/PERFECT/combo/amber negation + localStorage==13 + suite fail 0 | ✅ | ⬜ pending |
| 04-03-T3 | 04-03 | 3 | CNT-01 | T-04-03c, T-04-03d | cfg byte-identical vs source; CDN stripped; zero console errors | validator + port-audit + render-smoke | file exists + no-CDN grep + validator exit-code-first (no `amber:`) + port-audit BYTES OK + render-smoke SMOKE OK | ✅ | ⬜ pending |
| 04-04-T1 | 04-04 | 4 | RWD-01, RWD-02 | T-04-04a | WAAPI-staggered reveals; noor persists exactly once; apricot decorative + weekcal never-miss | unit + grep gate | AW.animate/AW.S.set('noor')/rw-returns-class grep + localStorage==13 + confetti/PERFECT/amber negation + suite fail 0 | ✅ | ⬜ pending |
| 04-04-T2 | 04-04 | 4 | RWD-01, RWD-03 | T-04-04b, T-04-04c | Ring draws only new frontier (no replay); du'a under scripture law; celebration never on scripture | grep gate + render-smoke | AW.ringSVG/animateFrom/preLessonAtoms grep + celebration-adjacent-.ayah/.scard negation + render-smoke SMOKE OK + suite fail 0 | ✅ | ⬜ pending |
| 04-05-T1 | 04-05 | 5 | ENG-02, RWD-03 | — | Orbit-dark review surfaces; quiet ember `.low` state (never alarm); gold rosette mastery | grep gate | .rv-timer/.rv-thread/.rv-result/.rv-intro presence + order-line==1 + gold-bg/poppins/confetti/amber/rgba(37,54, negation + suite fail 0 | ✅ | ⬜ pending |
| 04-05-T2 | 04-05 | 5 | ENG-02, ENG-04, MOT-05 | T-04-05a | 14s timer/circle-back/2★-cap byte-preserved via 04-01 helpers; no back button; mute wired | unit + grep gate | function AwbaReview exists + reviewScore/reviewStars/setInterval/prefs.set grep + gold-bg/LANTERNG/confetti/amber negation + localStorage==13 + runner-review.test.js fail 0 + full suite fail 0 | ✅ | ⬜ pending |
| 04-05-T3 | 04-05 | 5 | CNT-01 | T-04-05b, T-04-05c | cfg byte-identical vs source; CDN stripped; zero console errors | validator + port-audit + render-smoke | file exists + no-CDN grep + validator exit-code-first (no `amber:`) + port-audit BYTES OK + render-smoke SMOKE OK | ✅ | ⬜ pending |
| 04-06-T1 | 04-06 | 6 | CNT-01, CNT-04 | T-04-06a, T-04-06b | 14 lessons spliced byte-verbatim; CDN stripped | validator + port-audit | file count==15 + no-CDN grep + validator exit-code-first (no `amber:`) + port-audit BYTES OK + no BYTES DRIFT | ✅ | ⬜ pending |
| 04-06-T2 | 04-06 | 6 | CNT-01, CNT-04 | T-04-06a, T-04-06b | 3 reviews spliced byte-verbatim; CDN stripped | validator + port-audit | file count==4 + no-CDN grep + validator exit-code-first (no `amber:`) + port-audit BYTES OK + no BYTES DRIFT | ✅ | ⬜ pending |
| 04-06-T3 | 04-06 | 6 | CNT-01, CNT-02, CNT-04 | T-04-06a, T-04-06c, T-04-06d | full-corpus validator exit 0 (3 accepted warnings); holds recorded (U4-03 absent); zero console errors corpus-wide | validator + grep gate + render-smoke | validator exit-code-first (no `amber:`) + U4-03/u4-04 absence grep + no-CDN/retired grep + render-smoke all SMOKE OK, no SMOKE FAIL + suite fail 0 | ✅ | ⬜ pending |
| 04-07-T1 | 04-07 | 7 | ENG-01..05, CNT-01/02/04, RWD-01..03, MOT-05 | T-04-07 | full phase precondition: suite, validator, self-test, port-audit, render-smoke, every grep gate, all green before the human is asked | validator + port-audit + render-smoke + grep gates | suite fail 0 + tests>=64 + validator exit-code-first (no `amber:`) + exactly 3 `note:` warnings + self-test OK + port-audit BYTES OK/no DRIFT + render-smoke all OK/no FAIL + CDN/retired/amber/rgba(37,54,/--accent/celebration-adjacency negation + localStorage==13 + order-line==1 | ✅ | ⬜ pending |
| 04-07-T2 | 04-07 | 7 | ENG-01..05, CNT-01/02/04, RWD-01..03, MOT-05 | T-04-07 | human plain-language ~10-item walk of 2-3 lessons + 1 review; BLOCKING, never auto-approved | manual (human checkpoint) | none automated — resume-signal "approved" or NO item list | ✅ | ⬜ pending |

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

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 10s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
