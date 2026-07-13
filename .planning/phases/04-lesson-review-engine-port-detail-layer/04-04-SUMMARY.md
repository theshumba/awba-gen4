---
phase: 04-lesson-review-engine-port-detail-layer
plan: 04
subsystem: engine
tags: [reward-choreography, WAAPI, ring-moment, animateFrom, dua-close, noor-persist-once, scripture-law, register-transition, vanilla-js]

# Dependency graph
requires:
  - phase: 04-03
    provides: "AwbaLesson(cfg) DOM runner (opener → 9 beats → quiz) + the plain verdict/noor/returns/done terminus this plan replaces + the noorClaimed once-only guard"
  - phase: 04-02
    provides: "the @layer screens reward CSS (.rw-verdict/.rw-stats/.rw-stat/.noorbig/.rw-returns/.weekcal/.rw-done/.recl/.rw-ring/.rcap/.rw-dua/.close) + the --apricot glow ::before + the register grounds"
  - phase: 03
    provides: "AW.animate (WAAPI + reduced-motion self-guard), AW.ringSVG/ringSeed (animateFrom no-replay), AW.weekCal, AW.state/AW.S, the .dab celebration primitive + [data-state] shapes, .reg-orbit/.reg-sky-night grounds"
provides:
  - "the six-moment reward choreography inside AwbaLesson (verdict → noor → returns → done → Ring → du'a), WAAPI-chained, one register per screen"
  - "AW._noorClaimer() — the pure, DOM-free persist-once claimer seam behind the noor moment (extracted from the 04-03 noorClaimed closure guard)"
  - "the Ring moment: animateFrom = preLessonAtoms captured at init, postAtoms recomputed after done()'s persist → only the new frontier draws, never a replay (Pitfall 7 / WR-01)"
  - "the du'a close on .reg-sky-night: cfg.dua rendered in Amiri under scripture law + the always-present 'Alhamdulillah — continue.' + the onward handoff"
affects: [04-05, 04-07, phase-05]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "WAAPI choreography: async reward functions chain AW.animate(el, kf, '--dur-settle', '--ease').finished with 60ms setTimeout stagger gaps; each anim self-guards reduced motion (dur→1ms); the click handler is wired BEFORE the stagger so the forward button works mid-reveal"
    - "Count-up rides the reveal's own progress (anim.effect.getComputedTiming().progress) — no raw ms, no hand-rolled duration; snaps to the exact final value on .finished"
    - "Persist-once as a closure factory (AW._noorClaimer) so the once-only invariant is unit-testable DOM-free — mirrors the AW._resolveScore / AW._beatHtml underscore-seam convention"
    - "Register-per-screen transition: a single .ls-shell carrier swaps reg-page → reg-orbit → reg-sky-night via setGround() (no rebuild, no new DOM)"
    - "animateFrom captured at INIT (before opener/touchDay/persist), recomputed AFTER the best-of star persist — the two-read discipline that makes the Ring draw only the new frontier and never replay"

key-files:
  created: []
  modified:
    - "shared/awba-engine.js — AW._noorClaimer() seam + the reward choreography rewrite inside AwbaLesson (verdict/rewardNoor/rewardReturns/done → WAAPI + Ring + du'a); preLessonAtoms captured at init"
    - "scripts/tests/runner-lesson.test.js — +1 DOM-free assertion: AW._noorClaimer() credits noorEarned exactly once (T-04-04a)"

key-decisions:
  - "noor persists once via a pure closure factory AW._noorClaimer() (replacing the 04-03 noorClaimed boolean) — the once-only invariant is now unit-testable headlessly; the RED→GREEN TDD test drives this seam rather than a fragile full-DOM walk (jsdom is out, D-25)"
  - "verdict stars moved from .ls-dab to the shipped .dab celebration primitive (hollow/filled per data-state) — the stars are now drifting gold ink (RWD hard-rule: celebration is ink), consistent with the 04-02 CSS .rw-stars intent"
  - "the onward path handoff (Next / Back to the path) moved OFF done() to the du'a terminal — the Ring (Orbit) and du'a (Sky) must render before any nav-away; done() now advances via Continue"
  - "the du'a Arabic is cfg-gated (cfg.dua), NOT authored here — a du'a is religious content: Josh's asset, never generated or retyped (splice-not-retype + CLAUDE.md content integrity); the reverent 'Alhamdulillah — continue.' close always renders; a default verbatim du'a is an owner/scholar-gate item"
  - "the Ring caption is honest about replay: 'A new mark, inked into your ring.' only when postAtoms > preLessonAtoms, else 'Your ring, as it stands.' — the copy never claims progress on a replay"

patterns-established:
  - "AW._noorClaimer() persist-once seam — 04-05 (AwbaReview) should mirror it for the review result's noor persist"
  - "The register-per-screen setGround() swap + WAAPI .finished chain — the review intro/timer/result choreography (04-05) reuses this shape in Orbit/gold"

requirements-completed: [RWD-01, RWD-02, RWD-03]

# Metrics
duration: ~40min
completed: 2026-07-13
---

# Phase 4 Plan 04: The Reward Choreography Flagship Summary

**The plain 04-03 terminus is now the six-moment WAAPI choreography — verdict → noor → returns → done on Page cream, the Ring moment inking only your newly-earned frontier on Orbit, and a du'a close on the Sky night ground — the emotional payoff of the Athar pivot, where the lesson closes on your own tawaf ring and a du'a, celebration that is ink and never touches scripture.**

## Performance

- **Duration:** ~40 min
- **Completed:** 2026-07-13
- **Tasks:** 2 (Task 1 TDD: RED → GREEN)
- **Files modified:** 2 (1 engine, 1 test)

## Accomplishments
- The reward terminus now plays as **six moments, one register per screen** (law 1): `verdict → noor → returns → done` on `.reg-page`, the **Ring moment** on `.reg-orbit`, the **du'a close** on `.reg-sky-night`. The single `.ls-shell` carrier swaps grounds via `setGround()` — no rebuild, no new DOM.
- Every staggered reveal chains through `AW.animate(el, kf, '--dur-settle', '--ease').finished` with 60ms `setTimeout` gaps; each anim self-guards reduced motion (collapses to 1ms) so **the centre never animates** (law 9). The forward click handler is wired *before* the stagger, so the button works mid-reveal.
- **Verdict:** shape-first gold `.dab` stars (hollow ring / filled+check per `AW.lessonStars`) drift in; three `.rw-stat` tiles (Noor / Accuracy / Best run, marks from shipped GLYPHS `spark`/`check`/`star`) settle in staggered; verdict word is Gen-3's `Flawless` / `Beautifully done` / `You made it through`.
- **Noor:** persists **exactly once** at the noor moment via the new `AW._noorClaimer()` seam + `AW.sound('complete')`; the `.noorbig` Marcellus count-up rides the settle reveal's own progress (no raw ms) and snaps to the exact final value on `.finished`.
- **Returns:** the big Marcellus `--kiswah` returns count over the decorative `--apricot` horizon glow (CSS `::before`, never apricot text) + `AW.weekCal()` days as lighter-ink presence dots — **never a gap/red/miss** (RWD-02).
- **The Ring:** `preLessonAtoms` captured at `AwbaLesson` INIT (before opener/`touchDay`/persist); `postAtoms` recomputed after `done()`'s best-of persist; `AW.ringSVG({atomsDone: postAtoms, animateFrom: preLessonAtoms})` draws **only the newly-earned frontier** on a genuine completion, and renders the established ring **static** on a replay (`postAtoms === preLessonAtoms`) — no phantom celebration (Pitfall 7 / WR-01).
- **The du'a close:** the du'a in Amiri under scripture law (`lang="ar" dir="rtl"`) rendered ONLY from `cfg.dua` (content integrity — see Deviations) + the always-present `Alhamdulillah — continue.` + the onward handoff; **no celebration primitive** authored in the du'a block (grep-gated).

## Task Commits

Each task committed atomically (Task 1 TDD, split RED/GREEN):

1. **Task 1 (TDD): WAAPI verdict → noor (persist once) → returns**
   - `7dee84d` (test — **RED**: suite 88 tests, 1 fail — `AW._noorClaimer is not a function`)
   - `70def09` (feat — **GREEN**: `AW._noorClaimer` + the Page choreography; suite 87→88)
2. **Task 2: The Ring moment (Orbit) + the du'a close (Sky)** — `b1bf771` (feat)

**Plan metadata:** (this commit) — docs: complete plan

## Verification Results (run verbatim)

- **Task 1 `<verify>`:** PASS — `AW\.animate\(` present, `AW.S.set('noor'` present, `rw-returns` present, `localStorage` count == **13**, no `confetti|>PERFECT<|amber`, suite `fail 0`.
- **Task 2 `<verify>`:** PASS — `AW.ringSVG(` + `animateFrom` + `preLessonAtoms` present, `reg-sky-night|rw-dua` present, no `(dab|thread|plate|rosette)…\.(ayah|scripture|scard)` (celebration never on scripture), `render-smoke lessons/u1-m1.html` → **SMOKE OK**, suite `fail 0`.
- **Suite:** `node --test scripts/tests/*.test.js` → **88/88** (fail 0). Baseline 87 never shrank; +1 new (the persist-once probe). **No plain-terminus assertion adjustments were needed** — the runner-lesson tests pin only the pure seams (`AW._beatHtml`/`AW._resolveScore`/`AW.MLAB`/`AW.lessonStars`) + persistence arithmetic; none pinned the plain terminus's static DOM, so the rewrite broke nothing.
- **Engine parses:** `node -c shared/awba-engine.js` → OK.
- **Content gate:** `node scripts/validate-content.js` → `OK lessons/u1-m1.html`; `--self-test` → OK.
- **RED→GREEN evidence:** RED run captured before implementation (`tests 88 / pass 87 / fail 1`, `TypeError: AW._noorClaimer is not a function`); GREEN after (`tests 88 / pass 88 / fail 0`).

### The two load-bearing lines (quoted verbatim)

- **Capture (AwbaLesson INIT, before opener/touchDay/persist):**
  `var preLessonAtoms = (Object.keys((AW.state().stars) || {}).length) * ATOMS_PER_NODE;`
- **Recompute (ringMoment, AFTER done()'s best-of persist) + the call:**
  `var postAtoms = (Object.keys((AW.state().stars) || {}).length) * ATOMS_PER_NODE;`
  `AW.ringSVG({ atomsDone: postAtoms, animateFrom: preLessonAtoms })`

`ATOMS_PER_NODE = 3` (documented Phase-4 proxy; Phase-5 CNT-03 wires exact atoms). On a genuine first completion `done()` adds this node's star KEY → `postAtoms > preLessonAtoms` → only the new frontier draws. On a replay the key already exists at init → `postAtoms === preLessonAtoms` → empty span → static ring, no phantom celebration.

## Deviations from Plan

All Rule 1 (self-caught, fixed inline, noted). No new token / schema / layer-order / CSS change. No STOP.

**1. [Rule 1 - TDD adaptation] persist-once tested at the AW._noorClaimer() seam, not a full-DOM "drive to done"**
- **Found during:** Task 1 (the TDD RED test).
- **Issue:** The plan's suggested "complete a stub lesson through a probe … drive to done" cannot run under `node --test` — the runner is DOM-driven and jsdom is out (zero-dep, D-25); `root.innerHTML = string` then `querySelectorAll` needs a real HTML parser, plus WAAPI/`getComputedStyle`/`matchMedia`.
- **Fix:** Extracted the 04-03 `noorClaimed` closure guard into `AW._noorClaimer()` (matching the `AW._resolveScore`/`AW._beatHtml` underscore-seam convention) and tested the **exact load-bearing invariant** DOM-free: `claim(36)` once → noor 100→136; every later `claim(36)` a no-op (never 172, never left at 100). This is the T-04-04a mitigation and is stronger/less fragile than a hand-rolled DOM shim. The full interactive walk is proven by render-smoke in Chrome.
- **Files:** shared/awba-engine.js, scripts/tests/runner-lesson.test.js — **Commits:** 7dee84d (RED), 70def09 (GREEN)

**2. [Rule 1 - Renderer discretion] verdict stars .ls-dab → .dab celebration primitive**
- **Issue:** 04-03 rendered the verdict stars as the `.ls-dab` sizing shell; RWD-01/S4 + the hard rules call for shape-first gold **`.dab`/`.rosette`** (celebration is ink).
- **Fix:** The star row now emits the shipped `.dab` primitive carrying `[data-state]` (mastered = gold+check / not-yet = hollow ring), with per-star `--dx/--dy` so they drift in (Circle verb); under reduced motion `.dab` animation is `none` (rests static, law 9). Grade still reads by SHAPE; gold is only the fill.
- **Commit:** 70def09

**3. [Rule 1 - Sequence composition] the onward handoff moved off done() to the du'a terminal**
- **Issue:** 04-03's `done()` was terminal and carried the "Next / Back to the path" nav. In the six-moment choreography the Ring (5) and du'a (6) must render AFTER done() — a nav-away on done() would skip them.
- **Fix:** `done()` now advances via a `Continue` button into `ringMoment()`; the path handoff lives on the du'a close (the true terminal — "Alhamdulillah — continue." is the continue affordance). Within D-45 "Claude's Discretion: composition"; flagged for the 04-07 gate.
- **Commit:** b1bf771

**4. [Rule 1 - Content integrity] the du'a Arabic is cfg-gated, not authored here**
- **Issue:** RWD-03/D-51 require "the du'a in Amiri (verbatim, scripture law)", but there is **no verbatim du'a in-repo or in Gen-3 to splice**, and CLAUDE.md forbids generated religious content + the splice-not-retype law forbids retyping Arabic scripture from memory.
- **Fix:** `duaClose()` renders `cfg.dua` (string or `{ar, source}`) in Amiri under scripture law with a pending-review source line WHEN present; the reverent `Alhamdulillah — continue.` close + the onward handoff always render. u1-m1 has no `cfg.dua`, so its Sky terminus is the close line alone — no fabricated Arabic. Shipping a default verbatim du'a is deferred to the owner/scholar gate (identical pattern to D-52 sound: build the plumbing, defer the sensitive asset). CLAUDE.md content integrity takes precedence over the plan's literal wording.
- **Commit:** b1bf771

---
**Total deviations:** 4 (all Rule 1 / discretion; 0 architectural, 0 STOPs, 0 CSS/token/schema/layer-order changes).
**Impact on plan:** No scope creep. The mechanics stayed byte-preserved (noor once, best-of stars); every choreography choice is expression within the locked registers.

## Known Stubs
- **The du'a Arabic (`cfg.dua`) is dormant** — no current data file carries one, so u1-m1's Sky close renders "Alhamdulillah — continue." alone. This is an intentional content-integrity gate (a du'a is scholar-gated religious content), not a data stub: the render path is fully wired and drops a verbatim du'a in with zero code change the moment `cfg.dua` lands. Owner/scholar-ledger item, not build-blocking.

## Doubts to carry to the 04-07 human gate
1. **Default du'a sourcing** — the Sky close currently shows only "Alhamdulillah — continue." (u1-m1 has no `cfg.dua`). Does the owner want a scholar-approved default verbatim du'a (e.g. a well-attested closing du'a) added to the cfg / a shared default, or is the transliterated close line sufficient for the walking slice? (Sensitive: scripture, scholar-gate.)
2. **The honest replay caption** — the Ring caption reads "A new mark, inked into your ring." on a genuine completion and "Your ring, as it stands." on a replay. Confirm this honest split reads well, or whether the replay should carry no caption at all.
3. **The path handoff on the du'a terminal** — confirm moving "Next / Back to the path" onto the du'a close (so the Ring + du'a render before nav) is the intended terminal, rather than the handoff on `done()`.
4. **Verdict `.dab` star scale** — the verdict stars are now 20px drifting gold `.dab`s (hollow/filled). Confirm this reads as "your grade" at reward scale, or whether a larger/starrier treatment is wanted.
5. **The human interactive walk** — the full six-moment choreography (verdict → … → Ring → du'a, register transitions, WAAPI stagger, reduced-motion static, the animateFrom no-replay on a second walk of u1-m1) is human-verifiable only; render-smoke proves the load + zero console errors, not the interaction. The 04-07 gate should walk u1-m1 to the du'a close, then re-walk it to confirm the Ring does NOT re-draw (no phantom celebration).

## Next Phase Readiness
- The lesson vertical slice is **fully world-class end-to-end** (opener → beats → quiz → the flagship reward choreography → Ring → du'a).
- **04-05** (`AwbaReview`) mirrors the `AW._beatHtml`/`AW._resolveScore`/`AW._noorClaimer` seam pattern + the `setGround()` register-swap + WAAPI `.finished` chain, in the Orbit register + Hajar Gold (D-45 legendary).
- No blockers. Sound-cue assets + a default verbatim du'a remain the standing owner-ledger items (silent v1 / close-line-only unchanged until they land).

## Self-Check: PASSED
- `shared/awba-engine.js` contains `AW._noorClaimer` — FOUND
- `shared/awba-engine.js` contains `AW.ringSVG({ atomsDone: postAtoms, animateFrom: preLessonAtoms })` — FOUND
- `shared/awba-engine.js` contains `preLessonAtoms` capture at init + `reg-sky-night`/`rw-dua` du'a close — FOUND
- `scripts/tests/runner-lesson.test.js` contains the `AW._noorClaimer` persist-once probe — FOUND
- commits `7dee84d`, `70def09`, `b1bf771` — FOUND
- suite 88/88; both `<verify>` blocks PASS verbatim; render-smoke SMOKE OK; localStorage count == 13; no retired element

---
*Phase: 04-lesson-review-engine-port-detail-layer*
*Completed: 2026-07-13*
