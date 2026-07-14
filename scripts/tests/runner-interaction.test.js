/* ============================================================================================
   runner-interaction.test.js  ·  Awba Gen-4 — regression pins for the two live-reproduced
   interaction defects (WR-02, WR-03) that node --test's pure seams and render-smoke's
   initial-paint load both missed.
   --------------------------------------------------------------------------------------------
   Context (WR-05): the flourish-timer bug (WR-02) and the depth-lens re-wire bug (WR-03) live
   inside DOM-driven closures of AwbaLesson(cfg) that can't be reached without a full DOM
   (root.innerHTML → getElementById), and jsdom is out (zero-dep, D-25). render-smoke.mjs only
   inspects each page's opener paint — it never clicks — so neither bug tripped a gate. These
   tests pin the fixes two ways that DO fail if the bugs return, with zero deps and zero flake:
     - a behavioural proof at the real AW.wire seam (the premise the WR-03 fix relies on), driven
       with a hand-built element stub (no innerHTML parser needed), and
     - source-invariant assertions against the exact shape of each fix inside shared/awba-engine.js
       (the flourish setTimeout is captured + cleared before it can write a later beat's slot;
       the lens-open handler no longer re-wires the body).
   No mechanics numbers are asserted-away: the Gen-3 260ms flourish delay is checked to still be
   present, not changed.
   ============================================================================================ */
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { loadEngine, makeLS } = require('./ls-stub');

const ENGINE_PATH = path.join(__dirname, '..', '..', 'shared', 'awba-engine.js');
const ENGINE_SRC = fs.readFileSync(ENGINE_PATH, 'utf8');

/* resolveBody — the AwbaLesson resolve() closure, bounded at the reward-choreography banner that
   follows it, so the ordering assertions below stay inside resolve() and can't drift. */
function resolveBody() {
  const start = ENGINE_SRC.indexOf('function resolve(ok, it)');
  assert.ok(start >= 0, 'the lesson runner must define resolve(ok, it)');
  const end = ENGINE_SRC.indexOf('the reward choreography', start);
  return ENGINE_SRC.slice(start, end > start ? end : start + 2400);
}

/* ---------- WR-02 — the 3-streak flourish timer is captured and cleared ---------- */

test('WR-02: the engine clears its flourish timer (clearTimeout was absent when the bug shipped)', () => {
  // The defect fingerprint the review pinned: grep clearTimeout → 0 matches. Any clear at all is
  // the minimum evidence the uncleared-setTimeout path is gone.
  assert.ok(/clearTimeout\(/.test(ENGINE_SRC),
    'engine must clearTimeout the flourish schedule — a stale streak callback must not survive into a later beat');
});

test('WR-02: resolve() captures the flourish setTimeout and clears any pending one before rescheduling', () => {
  const body = resolveBody();
  // 1) the streak flourish must be CAPTURED into a timer var, not a fire-and-forget setTimeout.
  assert.ok(/flourishTimer\s*=\s*setTimeout\(/.test(body),
    'the comboPerfect flourish setTimeout must be captured into flourishTimer so it can be cancelled');
  // 2) the clear must run BEFORE the (re)schedule, so a streak flourish still pending from an
  //    earlier beat is cancelled before this resolve rebuilds #lsflourish.
  const clearIdx = body.indexOf('clearTimeout(flourishTimer)');
  const schedIdx = body.indexOf('flourishTimer = setTimeout(');
  assert.ok(clearIdx >= 0, 'resolve() must clearTimeout(flourishTimer)');
  assert.ok(clearIdx < schedIdx,
    'the clear must precede the reschedule so a phantom flourish cannot paint a later, unrelated answer');
  // 3) the Gen-3 260ms delay must be PRESERVED (the fix must not touch the mechanic).
  assert.ok(/,\s*260\)/.test(body), 'the Gen-3 260ms flourish delay must remain unchanged');
});

/* ---------- WR-03 — the depth-lens open handler no longer re-wires the body ---------- */

test('WR-03: the depth-lens open handler does not re-wire the lens body', () => {
  // Anchor on the brace-form handler in the RUNNER (`if (it.t === 'depth') {` + the lens forEach),
  // NOT the pure-seam branch `if (it.t === 'depth') return depthHtml(it);` in AW._beatHtml above it.
  const depthIdx = ENGINE_SRC.indexOf("if (it.t === 'depth') {");
  assert.ok(depthIdx >= 0, 'the depth beat handler must exist in the lesson runner');
  const forEachIdx = ENGINE_SRC.indexOf("root.querySelectorAll('.lens')", depthIdx);
  assert.ok(forEachIdx >= 0 && forEachIdx - depthIdx < 60,
    'the depth handler must wire the lenses via root.querySelectorAll(.lens) (confirms we anchored the runner block, not the view seam)');
  const depthBlock = ENGINE_SRC.slice(depthIdx, depthIdx + 900);
  assert.ok(!/AW\.wire\(body/.test(depthBlock),
    'no per-open re-wire of the lens body — the top-level AW.wire(root, cfg) already covers hidden lens bodies');
  // the top-level per-beat wire that makes the re-wire redundant must still be there.
  assert.ok(/AW\.wire\(root, cfg\)/.test(ENGINE_SRC),
    'the per-beat AW.wire(root, cfg) must remain — it is what binds the (hidden) lens chips once');
});

test('WR-03: one AW.wire pass binds a hidden citation chip exactly once → one sheet open per click', () => {
  // Behavioural proof of the premise the fix relies on: AW.wire binds via querySelectorAll, which
  // matches elements regardless of visibility, and adds exactly ONE listener per element per call.
  // So the single per-beat wire is sufficient, and a chip click opens the sheet exactly once.
  const probe = `
    var opens = 0;
    var handlers = [];
    // a citation chip that is "hidden" (inside a display:none lens body) — querySelectorAll still finds it
    var citeEl = { hidden: true, dataset: { ref: 'r1' },
      addEventListener: function (t, fn) { if (t === 'click') handlers.push(fn); } };
    var root = { querySelectorAll: function (sel) { return sel.indexOf('.cite') === 0 ? [citeEl] : []; } };
    AW.sheetRef = function () { opens++; };     // stub the DOM sheet away — count opens only
    AW.wire(root, { refs: { r1: {} } });        // ONE wire pass, exactly as render() does per beat
    handlers.forEach(function (fn) { fn(); });  // the learner clicks the chip once
    globalThis.__out = { boundListeners: handlers.length, sheetOpens: opens };
  `;
  const sb = loadEngine(makeLS({}), probe);
  assert.equal(sb.__out.boundListeners, 1, 'one AW.wire pass binds exactly one click listener on the (hidden) chip');
  assert.equal(sb.__out.sheetOpens, 1, 'that single listener opens the citation sheet exactly once');
});

/* ---------- ADDED (07-03 / PLT-05 D-74): the back-button rules (Gen-3 348) ----------
   The Gen-3 owner fix has two halves: a lesson carries a BOUNDED "Back a step" control that is
   hidden at the opener and never steps below it, while a review has NO back affordance on ANY
   screen. Neither half had an automated pin (the ship-checklist expected coverage here). These
   source invariants against shared/awba-engine.js fail if either rule regresses — a lesson losing
   its bounded step-back (or showing it at the opener), or a review ever growing a back control. */
test('WR-05 / PLT-05: the lesson runner carries a BOUNDED "Back a step" control, hidden at the opener', () => {
  assert.match(ENGINE_SRC, /<button class="ls-back" id="lsback" type="button"/,
    'AwbaLesson must render the .ls-back "Back a step" control');
  assert.match(ENGINE_SRC, /id="lsback" type="button"' \+ \(pos < 0 \? ' hidden' : ''\)/,
    'the .ls-back control must be hidden at the opener (pos < 0)');
  assert.match(ENGINE_SRC, /if \(pos >= 0\) \{ pos--; stepIndex = Math\.max\(pos, 0\)/,
    'a step-back must move to the previous beat and clamp at the opener (never below pos 0)');
});
test('WR-05 / PLT-05: the review runner has NO back affordance on any screen (Gen-3 348)', () => {
  assert.match(ENGINE_SRC, /No back button, ever \(Gen-3 348\)/,
    'AwbaReview must keep the "No back button, ever" intent anchor');
  assert.match(ENGINE_SRC, /getElementById\('awback'\); if \(rb\) rb\.style\.display = 'none';/,
    'AwbaReview must actively suppress any stray #awback back affordance');
  // Non-vacuous: the lesson step-back markup must NOT live inside the AwbaReview body.
  const rvStart = ENGINE_SRC.indexOf('function AwbaReview');
  assert.ok(rvStart > -1, 'AwbaReview must exist');
  assert.equal(/id="lsback"|>Back a step</.test(ENGINE_SRC.slice(rvStart)), false,
    'the review runner must never emit the lesson step-back control');
});
