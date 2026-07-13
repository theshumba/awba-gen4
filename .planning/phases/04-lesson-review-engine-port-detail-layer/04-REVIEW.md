---
phase: 4
slug: lesson-review-engine-port-detail-layer
doc: REVIEW
reviewed: 2026-07-13T20:15:31Z
depth: deep
scope: "Phase 4 commits 8b5d02d..225aac9: shared/awba-engine.js (RUNNERS banner), shared/awba-engine.css (@layer screens block), scripts/tests/runner-math.test.js, runner-lesson.test.js, runner-review.test.js, scripts/port-audit.mjs, scripts/tests/render-smoke.mjs, the 19 lessons/*.html + reviews/*.html shells (head/script structure only, not cfg bodies)"
files_reviewed:
  - shared/awba-engine.js
  - shared/awba-engine.css
  - scripts/tests/runner-math.test.js
  - scripts/tests/runner-lesson.test.js
  - scripts/tests/runner-review.test.js
  - scripts/port-audit.mjs
  - scripts/tests/render-smoke.mjs
  - lessons/u1-m1.html
  - lessons/u1-m2.html
  - lessons/u1-m3.html
  - lessons/u1-m4.html
  - lessons/u2-m1.html
  - lessons/u2-m2.html
  - lessons/u2-m3.html
  - lessons/u2-m3b.html
  - lessons/u3-m1.html
  - lessons/u3-m2.html
  - lessons/u3-m3.html
  - lessons/u4-m1.html
  - lessons/u4-m2.html
  - lessons/u4-m2b.html
  - lessons/u4-m3.html
  - reviews/u1-review.html
  - reviews/u2-review.html
  - reviews/u3-review.html
  - reviews/u4-review.html
findings:
  critical: 0
  warning: 5
  suggestion: 3
  total: 8
status: issues_found
---

# Phase 4 — Code Review Report

**Reviewed:** 2026-07-13
**Depth:** deep (cross-file, plus live reproduction in headless Chrome for the two dynamic-DOM findings — not just read-through)
**Files reviewed:** the RUNNERS banner in `shared/awba-engine.js` (AW.lessonStars/comboShow/comboPerfect/reviewScore/reviewStars, AW.sound, AW.MLAB, the beat-view seams, `AwbaLesson(cfg)`, `AwbaReview(cfg)`, the shared mute-toggle), the `@layer screens` block in `shared/awba-engine.css`, `scripts/tests/runner-math.test.js`/`runner-lesson.test.js`/`runner-review.test.js`, `scripts/port-audit.mjs`, `scripts/tests/render-smoke.mjs`, and all 19 lesson/review HTML shells (head + script includes only — cfg bodies are Josh's SHA-pinned verbatim content and were not evaluated as content)
**Status:** issues found — 0 Critical, 5 Warning, 3 Suggestion

## Summary

Verified first, before reviewing: `node --test scripts/tests/*.test.js` → **94/94 green**. `node scripts/validate-content.js` → all 19 files OK, exactly the 3 accepted `note:` warnings (u3-m1 unused ref, u3-m3 unused ref, u4-m2 unused term). `node scripts/validate-content.js --self-test` → OK. `node scripts/port-audit.mjs` → all 19 files `BYTES OK`, `HOLD OK — U4-03 absent`. `node scripts/tests/render-smoke.mjs` → all 19 pages `SMOKE OK`. The mechanics numbers were diffed directly against `/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD/shared/awba-engine.js` line-for-line: `AW.PER_LESSON=12`, `AW.REFLECT=15`, `AW.PER_REVIEW=15`, `AW.SWIFT=5`, `AW.QTIME=14`, `comboShow>=2`, `comboPerfect===3` + 260ms, `lessonStars`/`reviewStars` (3/2/1, never 0, 2★ timeout cap), the 1500ms auto-skip, and the circle-back no-noor rule all match Gen-3 exactly — no mechanics drift found. The Ring `animateFrom` contract (`preLessonAtoms` captured at init, `postAtoms` recomputed after `done()`'s best-of star persist) is wired correctly for the "replay draws nothing" law. Scripture-law adjacency (nothing celebratory in `.scard`/`.ayah`/the du'a block) is clean by inspection and matches the shipped `AW._beatHtml` unit tests.

None of the above is where the real defects are. The green suite and the "all SMOKE OK" pass do **not** exercise a single click — `node:test` only proves the DOM-free pure helpers, and `render-smoke.mjs` loads each page **once** and inspects the *initial* (opener) screen only; it never simulates an interaction. This review went past that boundary and drove the real engine through actual click sequences in headless Chrome (not a mock DOM) to test the exact things the task asked for — double-tap/back-nav edge cases, event-listener rebinding across screen swaps, and the accordion/reward choreography — and found two live-reproducible defects in exactly those areas, plus a CSS register-purity leak and a contrast regression that mirror an already-fixed Phase-3 finding. Nothing below breaks noor/star persistence or a scripture law (why nothing is Critical), but two are real, provably-reproduced state-machine bugs that a fast or repeat-interacting learner will actually hit.

## Critical Issues

None found. See Warnings WR-02 and WR-03 for the two live-reproduced defects — both are cosmetic/robustness issues (a misplaced decorative flourish; redundant, currently-harmless listener accumulation), not persistence or mechanics corruption, which is why neither is classified Critical.

## Warnings

### WR-01: Crimson leaks onto the Orbit review register via the shared `.opt:active`/`.tf:active`/`.tile:active` press state — no register override exists

**File:** `shared/awba-engine.css:786` (the unscoped rule); consumed for the first time on Orbit by `shared/awba-engine.js:2310-2349` (`AwbaReview`'s `bind()`, which renders `.opt`/`.tf` inside `.rv-stage` under `.reg-orbit .rv-shell`)

**Issue:** The Phase-3-shipped paper-press rule `.opt:active, .tf:active, .tile:active { border-color: var(--crimson); }` (line 786) is global — there is no `.reg-orbit .opt:active` / `.rv-shell .opt:active` override anywhere in the file (confirmed by grepping every `:active` selector in `shared/awba-engine.css:781-837` — only the one unscoped rule touches `.opt`/`.tf`/`.tile`). `AwbaReview` is the **first** caller in this codebase to ever place `.opt`/`.tf` inside the Orbit register: `preview.html` only ever demos `.opt`/`.tf`/`.tile` inside `.reg-page` (`preview.html:344-367`), never `.reg-orbit`, so Phase 3's §9 gate never exercised this pairing. The file's own comments state the law explicitly and repeatedly: *"Crimson is BANNED on Orbit (§2.1 2.65:1)"* (`shared/awba-engine.css:1491-1492`, `1533-1536`). Pressing (mousedown/touch-down) any option or true/false button on any of the 4 review pages briefly borders it in the banned crimson instead of the register's gold, on every single review-question interaction.

**Fix:** Add a register-scoped override before/after the shared rule, e.g. `.rv-shell .opt:active, .rv-shell .tf:active, .rv-shell .tile:active { border-color: var(--gold); }` (mirroring the gold selection cue `AwbaReview.bind()` already applies on `click` at `shared/awba-engine.js:2318`). Recommend also adding a grep gate (`! grep -q ':active.*crimson'` scoped check, or a computed-style probe in render-smoke) so this class of shared-component/register-mismatch can't reappear silently the next time a Page-authored primitive is reused on Orbit.

---

### WR-02: The 3-streak "PERFECT" flourish's 260ms `setTimeout` is never cleared and writes into a reused element ID — live-reproduced to render a phantom flourish on an unrelated answer

**File:** `shared/awba-engine.js:1898-1911` (the `id="lsflourish"` span + the uncleared `setTimeout`)

**Issue:** Every correct-answer resolve screen renders `<span class="flourish" id="lsflourish">` (line 1903), regardless of whether this particular answer is a 3-streak. When `AW.comboPerfect(combo)` is true (line 1905), a `setTimeout(..., 260)` (line 1907) is scheduled to write the gold-thread SVG into `document.getElementById('lsflourish')` — **there is no `clearTimeout` anywhere in the file** (confirmed via `grep -n "clearTimeout" shared/awba-engine.js` → zero matches) and no guard checking that the DOM hasn't moved on. Because `id="lsflourish"` is recreated by *every* correct-answer resolve (not just comboPerfect ones), a stale callback from an earlier 3-streak can write into a **different, later, unrelated** answer's flourish slot if the learner advances quickly enough. This is an architecture regression versus Gen-3: Gen-3's `firePerfect()` (`_MVP-BUILD/shared/awba-engine.js:137-138`) targets a page-persistent overlay element (`perfectEl`, created once by `AW.skeleton()`, never replaced by `root.innerHTML` swaps), so the same 260ms delay there is immune to this class of bug.

**Reproduced live** (headless Chrome, real DOM, no mocks — 4 consecutive correct MC answers):
```
after beat3 resolve (combo=3, flourish scheduled)  :: lsfoot has .thread = false
after beat4 resolve (combo=4, should NOT have thread), +20ms :: lsfoot has .thread = false   ← correct so far
300ms after beat3 resolve (past the 260ms window), +350ms   :: lsfoot has .thread = true     ← BUG: beat 4's resolve screen now shows the flourish, despite combo=4 (not a 3-streak)
```
Continuing to the next question within ~240ms of a 3-streak (a fast learner double-tapping "Continue", or simply reading quickly) causes the gold-thread "PERFECT" cue to render on an answer that did not earn it — a false celebratory signal, and a direct (if narrow-window) violation of D-45's "fires once, at exactly combo===3."

**Fix:** Capture the timeout id and clear it defensively on the next `resolve()`/`next()` call (`var flourishTimer = null; ... if (AW.comboPerfect(combo)) { clearTimeout(flourishTimer); flourishTimer = setTimeout(...) }`, plus `clearTimeout(flourishTimer)` at the top of `resolve()`), or — better, matching Gen-3's isolation — mount the flourish in a fixed screen-level element that isn't recreated per-beat (e.g., a lesson-scoped overlay `div` outside `#root`) instead of the resolve screen's own swapped subtree.

---

### WR-03: `AW.wire()` is invoked redundantly on every depth-lens open, stacking duplicate click listeners on `.cite`/`.term` chips — live-reproduced at 4× on a single element

**File:** `shared/awba-engine.js:1779-1780` (the unconditional `AW.wire(root, cfg)` on every beat render) and `1782-1791` (the depth-lens open handler's `if (open) AW.wire(body, cfg);`)

**Issue:** `render()` calls `AW.wire(root, cfg)` unconditionally for every beat (line 1780), and `AW.wire` does `root.querySelectorAll('.cite[data-ref]')`/`'.term[data-term]'` (`shared/awba-engine.js:959-968`) — a `querySelectorAll` traversal that matches elements regardless of CSS visibility. Because the depth beat's three `.lb` lens bodies are only *hidden* (`display:none`), not absent, from the DOM at render time (`shared/awba-engine.js:1513-1529`), that first `AW.wire(root, cfg)` call already binds every citation/term inside all three (still-closed) lenses. The lens-open handler (line 1788) then calls `AW.wire(body, cfg)` **again** every time that lens is opened, on the same `body` reference (`lens.querySelector('.lb')`, captured once and never reassigned across toggles) — each additional open adds one more listener, on top of the one from initial render.

**Reproduced live** (headless Chrome): opening/closing the same lens 5 times, then clicking a citation chip inside it once, fired `AW.sheetRef` **4 times** for that single click (1 from the initial full-root wire + 3 from the 3 "open" transitions). This is currently invisible to a learner because `AW.sheet()` is an idempotent singleton (`shared/awba-engine.js:996-1037`: `open()` always fully overwrites the same sheet's content), but it is unbounded listener accumulation with no cleanup — exactly the "event-listener leaks/double-binding across screen swaps" class this review was asked to check for — and it will misbehave the instant anything non-idempotent (e.g., a future counter, a WAAPI-animated reveal, an analytics ping) is wired through this same `AW.wire()` seam.

**Fix:** Drop the redundant re-wire — since the top-level `AW.wire(root, cfg)` already covers hidden lens bodies, the `if (open) AW.wire(body, cfg);` line at 1788 is unnecessary and should be removed; if lazy-wiring on open was actually intended (to avoid wiring hidden content), invert it instead: skip `.lens .lb` in the initial `AW.wire(root, cfg)` pass and wire lens bodies only once, guarded by a `data-wired` marker set on first open.

---

### WR-04: `.weekcal .day` (the "not returned" week-calendar dot) computes to 2.56:1 on cream — the same token pairing Phase 3's WR-04 already fixed elsewhere in this file, not applied here

**File:** `shared/awba-engine.css:1455-1459`

**Issue:** `.weekcal .day { background: var(--ink-40); }` — computed (WCAG relative-luminance, `rgba(19,16,19,.40)` over `#F3EDE2`): **2.56:1** (verified by direct computation, matching Phase 3's own WR-04 finding for the identical token pair). This fails WCAG 1.4.11's 3:1 non-text/UI-component threshold. It is the exact `--ink-40`-on-cream pairing Phase 3's WR-04 identified and fixed (`shared/awba-engine.css:859`, bumped to `--ink-62` = 5.02:1) for the near-identical "quiet, non-text UI-shape state" role (`[data-state="not-yet"]`) — but the fix wasn't carried over to this new Phase-4 surface. Worse: unlike `.weekcal .day.here` (line 1460-1463, gold fill, only **1.93:1** on cream by computation — even lower — but compensated with an explicit `box-shadow: var(--keyline)` edge, matching the same compensation pattern used for `[data-state="mastered"]` at line 868-873) and `[data-state="not-yet"]`'s explicit 2px border, the baseline `.weekcal .day` gets **no edge-definition at all**: it's a flat, low-contrast fill with no border and no keyline. RWD-02/D-45's own stated intent is that week-calendar days must read as *"lighter-ink presence... never a gap"* — a dot at 2.56:1 with no edge is close to imperceptible against cream for low-vision users, which undermines exactly that promise on the reward screen every lesson ends on.

**Fix:** Either bump to `--ink-62` (5.02:1, already the established fix for this exact pairing elsewhere in this file) or add the same `box-shadow: var(--keyline)` edge-definition treatment the `.here` variant and `[data-state="mastered"]` already use.

---

### WR-05: The interactive DOM flows of both runners have zero automated coverage — the two live-reproduced bugs above (WR-02, WR-03) passed `node --test` (94/94) and `render-smoke.mjs` (19/19 SMOKE OK) cleanly

**File:** `scripts/tests/runner-lesson.test.js:9-15` (the coverage-intent comment); `scripts/tests/render-smoke.mjs` (whole file)

**Issue:** `runner-lesson.test.js`'s own header comment states: *"The runner is DOM-driven; jsdom is out (zero-dep, D-25), so full-flow DOM behaviour is proven by the real-Chrome render-smoke harness on lessons/u1-m1.html (04-03 Task 3), NOT here."* This overstates what `render-smoke.mjs` actually does: it loads each page **exactly once** via `--dump-dom` with a `--virtual-time-budget=4000`, and only ever inspects the *initial* (opener) screen's rendered DOM + stderr for console errors (`scripts/tests/render-smoke.mjs:47-91`) — it never clicks a button, never advances a beat, never resolves a quiz, never opens an accordion lens, and never reaches the reward choreography or the review timer. Both `node:test` (94/94 green) and `render-smoke.mjs` (all 19 `SMOKE OK`) pass cleanly on the current tree despite WR-02 and WR-03 both being real, provable, live-reproducible defects in exactly the interaction flows (double-tap/rapid-continue, accordion re-open) this phase's own review priorities called out — because nothing in the automated suite ever actually interacts with a page after its first paint.

**Fix:** Not asking for jsdom (D-25 stands) — but either (a) extend `render-smoke.mjs` to drive a minimal click-through per page type (advance past the opener, answer one quiz question, open/close one depth lens) using real DOM events before dumping, or (b) add a small number of targeted Chrome-CLI-driven interaction probes (mirroring this review's reproduction harness) as a new `scripts/tests/*-interaction.mjs` gate, so the "proven by render-smoke" claim in the unit-test comments becomes true rather than aspirational.

## Suggestions

### SG-01: Back-nav across an already-answered quiz beat re-triggers `resolve()` and re-applies the scoring reducer — inherited unchanged from Gen-3, not a Phase-4 regression

**File:** `shared/awba-engine.js:1727-1735` (`next()`/`bindBack()`), `1886-1920` (`resolve()`)

Because `pos` (not `stepIndex`) drives which beat renders, and the "Back a step" control is active on both pre-answer and post-resolve quiz screens, a learner can resolve quiz beat N, back up to N-1, then Continue forward into N again — which re-renders it fully unanswered and calls `resolve()`/`AW._resolveScore` a second time on the same beat, incrementing `correct`/`combo`/`noorEarned`/`mistakes` again. Traced this against the Gen-3 source of truth (`_MVP-BUILD/shared/awba-engine.js:143-146, 274-287`) and confirmed the identical structure exists there byte-for-byte (`backBtn` is a single always-active global listener with the same `pos--` logic, and `resolve()` has no "already answered this beat" guard) — this is faithfully preserved Gen-3 behavior, not something Phase 4 introduced, and D-46 explicitly mandates byte-preserved mechanics. Flagging for awareness only (a learner can theoretically farm noor/stars by ping-ponging back-and-forth across a quiz beat), not as a Phase-4 defect.

### SG-02: `data-sound` is written twice but never read anywhere — dead/write-only state

**File:** `shared/awba-engine.js:474` (STATE boot-stamp), `1652` (RUNNERS `bindMuteBtn`)

`document.documentElement.setAttribute('data-sound', ...)` is set both at boot and on every mute-toggle click, but `grep -n "data-sound" shared/awba-engine.css shared/awba-engine.js` finds no CSS selector and no other JS read anywhere — the actual mute-gating logic in `AW.sound()` reads `AW.prefs.get('soundMuted', false)` directly (`shared/awba-engine.js:1411`), not this attribute. Harmless today; either wire a CSS/JS consumer (e.g., a `[data-sound="muted"]` visual state for a future non-icon mute indicator) or drop the attribute writes as dead code.

### SG-03: `.lens[open] > .lb` is an unreachable CSS selector

**File:** `shared/awba-engine.css:1241-1245`

The rule `.lens.open > .lb, .lens[open] > .lb { display: block; ... }` includes an attribute-selector branch (`[open]`) that can never match — the JS driver only ever does `lens.classList.toggle('open')` (`shared/awba-engine.js:1786`), never sets/toggles an `open` DOM attribute. Harmless (the `.open` class branch always covers it), but dead selector surface worth pruning or reconciling if a future `<details>`-style markup pattern was intended.

---

## FIXES (applied 2026-07-13)

**All 5 Warnings fixed.** Unit suite 94/94 → **98/98 green** (+4 regression tests; no existing test changed). Full gate battery re-verified after all fixes: `node --test scripts/tests/*.test.js` → 98 pass / 0 fail; `node scripts/validate-content.js lessons/*.html reviews/*.html` → exit 0 (exactly the 3 accepted notes: u3-m1 unused ref, u3-m3 unused ref, u4-m2 unused term); `node scripts/port-audit.mjs` → exit 0 (BYTES OK ×19, HOLD OK — U4-03 absent, 3 NOTE ACCEPTED); `node scripts/tests/render-smoke.mjs` → exit 0, 19/19 SMOKE OK. Athar invariants held: token-only CSS, zero new hex, the `@layer` order line still appears exactly once, `localStorage` grep count still 13, no cfg body touched (edits confined to `shared/awba-engine.css`, `shared/awba-engine.js`, `scripts/tests/`), and every mechanics number (260ms preserved) untouched. Each fix committed atomically. Suggestions: **0 applied, 3 documented** (Phase-3 precedent — documented-not-applied).

| Finding | Fix applied | Commit |
|---|---|---|
| **WR-01** | Added a register-scoped press override `.rv-shell .opt:active, .rv-shell .tf:active, .rv-shell .tile:active { border-color: var(--gold); }` inside `@layer screens`, next to the `.rv-stage` question surface. The one unscoped `.opt:active`/`.tf:active`/`.tile:active` rule still inks to `--crimson` on Page, but on the Orbit review register (`.rv-shell`, where AwbaReview is the first caller to place these primitives) the press cue now re-inks to `--gold` (8.40:1) — matching the gold selection cue `bind()` applies on click. Crimson no longer leaks onto Orbit. Token-only; no re-declaration of the `@layer` order. | `4b561c2` |
| **WR-02** | Captured the comboPerfect flourish `setTimeout` into a closure-scoped `flourishTimer` and added `clearTimeout(flourishTimer)` at the top of `resolve()`, before it rebuilds `#lsflourish`. A stale 3-streak callback can no longer paint the gold-thread into a later, unrelated answer's slot when the learner advances within the 260ms window (the live-reproduced bug). The genuine `combo===3` case is unchanged — the flourish still fires at 260ms when the learner stays on the resolve screen. **Gen-3 260ms delay preserved**; no schema/mechanics/storage change. `clearTimeout` count 0 → 1 (the bug's fingerprint was zero clears). | `9272349` |
| **WR-03** | Removed the redundant `if (open) AW.wire(body, cfg);` from the depth-lens open handler (and its now-unused `body` binding). The per-beat `AW.wire(root, cfg)` already binds every `.cite`/`.term` inside the still-hidden (`display:none`) lens bodies — `querySelectorAll` ignores visibility — so re-wiring on each toggle only stacked duplicate listeners (live-reproduced: 4× `AW.sheetRef` for one click after 3 opens). A citation chip inside a lens now opens its sheet exactly once. | `20f2e11` |
| **WR-04** | Repointed `.weekcal .day` fill from `--ink-40` (**2.56:1** on cream, failed WCAG 1.4.11) to **`--ink-62`** (**5.02:1**) — the same precedent Phase 3's WR-04 established for the identical token pair at `[data-state="not-yet"]`. Design intent held: it stays a quiet, neutral ink presence (never a gap/miss), while the `.here` dot's gold fill reads warmer/earned, so a present day still reads quieter than a returned one. Token-only; no new hex. | `5fd1149` |
| **WR-05** | (a) Corrected the false coverage comment in `runner-lesson.test.js` (it claimed "full-flow DOM behaviour is proven by render-smoke" — render-smoke only inspects each page's opener paint and never clicks). (b) Added `scripts/tests/runner-interaction.test.js` (**+4 tests, 94→98**) pinning the two fixes. Because both bugs live in DOM-driven `AwbaLesson` closures unreachable without a full DOM (jsdom is out, D-25) and render-smoke never interacts, the review's sanctioned fallback was used: a **behavioural** proof at the real `AW.wire` seam (one wire pass binds a hidden citation chip exactly once → one sheet open per click — the premise the WR-03 fix relies on, driven with a hand-built element stub, no innerHTML parser), plus **source-invariant** assertions that fail if either fix is reverted (flourish `setTimeout` captured + cleared before reschedule; lens-open handler carries no `AW.wire(body`). The WR-03 assertion anchors on the brace-form runner handler, not the same-named `AW._beatHtml` view seam. Both pins were verified **non-vacuous** — each fails when its bug is reintroduced. | `9bb3fa0` |

### Suggestions — documented, not applied (Phase-3 precedent)

- **SG-01** (back-nav re-triggers `resolve()` / re-scores an already-answered quiz beat) — the review itself traced this byte-for-byte to the Gen-3 source of truth and confirmed it is faithfully-preserved Gen-3 behaviour, not a Phase-4 regression; D-46 mandates byte-preserved mechanics. A guard would be a **mechanics change** beyond the finding. **Not applied** (out of scope by hard rule).
- **SG-02** (`data-sound` written twice, never read) — either wiring a consumer or deleting the writes is a design call (a future non-icon mute indicator vs. dead-code removal); harmless today. **Documented, deferred.**
- **SG-03** (`.lens[open] > .lb` unreachable selector) — harmless dead selector surface; pruning vs. reconciling to a future `<details>` markup is a design call. **Documented, deferred.**

_Fixed: 2026-07-13 · Fixer: Claude (gsd-code-fixer) · Iteration 1_

---

_Reviewed: 2026-07-13T20:15:31Z_
_Reviewer: Claude (adversarial code review)_
_Depth: deep — cross-file, with live reproduction in headless Chrome (real DOM, real click() dispatch, no mocks) for WR-02 and WR-03, direct WCAG contrast computation for WR-04, and a line-by-line mechanics diff against the Gen-3 source of truth (`_MVP-BUILD/shared/awba-engine.js`) for every noor/timer/star number_
