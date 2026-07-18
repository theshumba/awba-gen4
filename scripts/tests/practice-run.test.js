/* ============================================================================================
   practice-run.test.js  ·  Awba Gen-4 v2 — AW.practiceRun(mountEl, items, opts) (Wave-A seam S4)
   --------------------------------------------------------------------------------------------
   The practice mini-runner is DOM-driven (renders into mountEl, wires real clicks), so its verdict
   behaviour is proven in system Chrome headless — the SAME harness as learn-dom-flows.test.js
   (system Chrome, --dump-dom, throwaway HTML at repo root removed in `finally`, zero npm packages).
   A driver seeds noor/returns/stars through the REAL AW.S, runs a full practiceRun, and publishes a
   JSON block the DOM dump carries back out. Pinned:
     - correct → single-source PRAISE verdict + AW.announce('Correct.') + advance; onDone {3,3}
     - wrong → grey .opt.wrong + gold .opt.correct + .opt-why "…gentle" + a --rose .btn.retry
       "Try again" (never red/flash/shake); retry re-attempts the same item; came-right-away = 0
     - ZERO awba_state writes: noor/returns/stars are byte-identical before and after a full run
     - empty items → onDone {0,0}
   Plus an always-run source invariant (no Chrome) that practiceRun contains no state-writing call.
   ============================================================================================ */
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { existsSync, readFileSync, writeFileSync, unlinkSync } = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..', '..');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ENGINE = path.join(ROOT, 'shared', 'awba-engine.js');
const ENGINE_SRC = readFileSync(ENGINE, 'utf8');

/* ---------- (A) source invariant — practiceRun writes nothing to awba_state (always runs) ---------- */

test('S4: AW.practiceRun contains no awba_state write (no AW.S.set / touchDay / noor claim)', () => {
  const start = ENGINE_SRC.indexOf('AW.practiceRun = function');
  assert.ok(start >= 0, 'AW.practiceRun must be defined');
  const body = ENGINE_SRC.slice(start); // to EOF — practiceRun is the last definition in the file
  assert.ok(!/AW\.S\.set\(/.test(body), 'practiceRun must never call AW.S.set (no noor/stars/returns write)');
  assert.ok(!/AW\.touchDay\(/.test(body), 'practiceRun must never call AW.touchDay (practice does not credit returns)');
  assert.ok(!/_noorClaimer|claimNoor/.test(body), 'practiceRun must never claim noor');
  assert.ok(/PRAISE\[/.test(body), 'practiceRun must read the single-source module-level PRAISE');
});

/* ---------- (B) behavioural DOM proof in system Chrome ---------- */

const DRIVER = [
  '<script>',
  "window.addEventListener('load', function () {",
  '  var R = {};',
  '  var mount = document.getElementById("mount");',
  '  var ann = [];',
  '  AW.announce = function (t) { ann.push(t); };',        // capture announcements synchronously (no rAF)
  '  AW.prefs.set("soundMuted", true);',                    // no Audio attempts
  '  function q(sel){ return mount.querySelector(sel); }',
  '  function click(el){ if (el) el.click(); }',
  '  function verdict(){ var h = q("#prfoot .pintro"); return h ? h.textContent : null; }',
  '  function pickCorrect(it){',
  '    if (it.t === "mc") click(q(".opt[data-i=\\"" + it.c + "\\"]"));',
  '    else if (it.t === "tf") click(q(".tf[data-v=\\"" + (it.c ? "true" : "false") + "\\"]"));',
  '    else { it.solution.forEach(function(w){',
  '      var tiles = mount.querySelectorAll("#lsbank .tile");',
  '      for (var k = 0; k < tiles.length; k++){ if (tiles[k].textContent === w && !tiles[k].classList.contains("used")){ tiles[k].click(); break; } }',
  '    }); }',
  '    click(q("#prcheck"));',
  '  }',
  '  function cont(){ click(q("#prcont")); }',
  '  try {',
  // seed real progress state — the zero-writes proof compares before/after
  '    AW.S.set("noor", 100); AW.S.set("returns", 7); AW.S.set("stars", { u1m1: 3, u1m2: 2 });',
  '    var before = { noor: AW.S.get("noor",0), returns: AW.S.get("returns",0), stars: AW.S.get("stars",{}) };',
  '    var A = { t:"mc", q:"Q1", o:["a","b","c"], c:1, good:"good1", gentle:"gentle1" };',
  '    var B = { t:"tf", q:"Q2", c:true, good:"good2", gentle:"gentle2" };',
  '    var C = { t:"tile", prompt:"P3", bank:["one","two"], solution:["two","one"], good:"good3", gentle:"gentle3" };',
  '    var done1 = null; var praises = [];',
  '    AW.practiceRun(mount, [A,B,C], { onDone: function(r){ done1 = r; } });',
  '    R.progText = (q(".se-prog") ? q(".se-prog").textContent : null);',
  '    pickCorrect(A); praises.push(verdict()); cont();',
  '    pickCorrect(B); praises.push(verdict()); cont();',
  '    pickCorrect(C); praises.push(verdict()); cont();',
  '    var after = { noor: AW.S.get("noor",0), returns: AW.S.get("returns",0), stars: AW.S.get("stars",{}) };',
  '    R.happy = { done: done1, praises: praises, before: before, after: after };',
  '    R.annCorrect = ann.indexOf("Correct.") >= 0;',
  '  } catch (e) { R.happyError = String((e && e.message) || e); }',
  '  try {',
  '    ann = [];',
  '    var A2 = { t:"mc", q:"Q1", o:["a","b","c"], c:1, good:"good1", gentle:"the gentle mercy line" };',
  '    var done2 = null;',
  '    AW.practiceRun(mount, [A2], { onDone: function(r){ done2 = r; } });',
  '    click(q(".opt[data-i=\\"0\\"]"));',            // answer WRONG (correct is 1)
  '    click(q("#prcheck"));',
  '    R.mercy = {',
  '      wrongClass: q(".opt[data-i=\\"0\\"]") ? q(".opt[data-i=\\"0\\"]").className : null,',
  '      correctClass: q(".opt[data-i=\\"1\\"]") ? q(".opt[data-i=\\"1\\"]").className : null,',
  '      why: q(".opt-why") ? q(".opt-why").textContent : null,',
  '      retryLabel: q("#prcont") ? q("#prcont").textContent : null,',
  '      retryClass: q("#prcont") ? q("#prcont").className : null,',
  '      announced: ann.slice()',
  '    };',
  '    cont();',                                       // "Try again" → re-render same item
  '    pickCorrect(A2); cont();',                      // now correct → advance → onDone
  '    R.mercy.done = done2;',
  '  } catch (e) { R.mercyError = String((e && e.message) || e); }',
  '  try {',
  '    var done3 = null;',
  '    AW.practiceRun(mount, [], { onDone: function(r){ done3 = r; } });',
  '    R.empty = done3;',
  '  } catch (e) { R.emptyError = String((e && e.message) || e); }',
  '  var s = document.createElement("script");',
  '  s.type = "application/json"; s.id = "prac-results";',
  '  s.textContent = JSON.stringify(R);',
  '  document.body.appendChild(s);',
  '  document.title = "PRAC-DONE";',
  '});',
  '</scr' + 'ipt>',
].join('\n');

const HTML =
  '<!doctype html><html><head><meta charset="utf-8">' +
  '<link rel="stylesheet" href="shared/awba-engine.css">' +
  '<script src="shared/awba-engine.js"></scr' + 'ipt>' +
  '</head><body><main class="reg-page" id="app"><div id="mount"></div></main>\n' +
  DRIVER + '\n</body></html>';

const chromeMissing = !existsSync(CHROME) || !existsSync(ENGINE);
const skip = chromeMissing ? 'system Chrome or the engine not found — interactive harness unavailable' : false;

function runHarness() {
  const probe = path.join(ROOT, '.prac-run.html');
  writeFileSync(probe, HTML);
  try {
    let stdout = '';
    try {
      stdout = execFileSync(
        CHROME,
        // memory-lean flags: this file adds one more concurrent Chrome to the node --test glob (which
        // already spawns several at module load) — keeping its footprint small avoids starving the
        // other Chrome harnesses on a memory-constrained machine.
        ['--headless', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage',
         '--disable-software-rasterizer', '--renderer-process-limit=1', '--js-flags=--max-old-space-size=128',
         '--virtual-time-budget=5000', '--dump-dom', 'file://' + probe],
        { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 30000, killSignal: 'SIGKILL', maxBuffer: 1024 * 1024 * 64 }
      );
    } catch (e) {
      stdout = e.stdout ? e.stdout.toString() : '';
    }
    const m = stdout.match(/<script type="application\/json" id="prac-results">([\s\S]*?)<\/script>/);
    return { results: m ? JSON.parse(m[1]) : null, ranToCompletion: /PRAC-DONE/.test(stdout) };
  } finally {
    try { unlinkSync(probe); } catch (e) { /* nothing to clean */ }
  }
}

const run = chromeMissing ? null : runHarness();

test('the practiceRun harness drives to completion with no driver error', { skip }, () => {
  assert.ok(run, 'the harness produced a run');
  assert.equal(run.ranToCompletion, true, 'the driver reached its final stamp');
  assert.ok(run.results, 'the driver published a results block');
  assert.equal(run.results.happyError, undefined, 'happy scenario ran clean: ' + run.results.happyError);
  assert.equal(run.results.mercyError, undefined, 'mercy scenario ran clean: ' + run.results.mercyError);
  assert.equal(run.results.emptyError, undefined, 'empty scenario ran clean: ' + run.results.emptyError);
});

test('S4: a full correct run → onDone({correct:3,total:3}), single-source PRAISE, AW.announce("Correct.")', { skip }, () => {
  const h = run.results.happy;
  assert.deepEqual(h.done, { correct: 3, total: 3 }, 'onDone reports 3 of 3 came right away');
  const PRAISE = ['That’s it.', 'Beautiful.', 'Exactly right.', 'Masha’Allah.'];
  assert.equal(h.praises.length, 3);
  h.praises.forEach((p) => assert.ok(PRAISE.indexOf(p) >= 0, 'each verdict is a single-source PRAISE word, got: ' + p));
  assert.equal(run.results.annCorrect, true, 'a correct answer announces "Correct."');
  assert.ok(/Question 1 of 3/.test(run.results.progText || ''), 'the progress line reads "Question 1 of 3"');
});

test('S4: ZERO writes — noor/returns/stars are byte-identical before and after a full run', { skip }, () => {
  const h = run.results.happy;
  assert.deepEqual(h.after, h.before, 'practice writes nothing to awba_state');
  assert.equal(h.after.noor, 100, 'noor unchanged');
  assert.equal(h.after.returns, 7, 'returns unchanged (no touchDay)');
  assert.deepEqual(h.after.stars, { u1m1: 3, u1m2: 2 }, 'stars unchanged (no star write)');
});

test('S4: a wrong answer is grey mercy (never red/shake): .opt.wrong + .opt.correct + .opt-why + .btn.retry', { skip }, () => {
  const m = run.results.mercy;
  assert.ok(/\bwrong\b/.test(m.wrongClass), 'the chosen wrong option gets .wrong (grey ink-blot)');
  assert.ok(/\bcorrect\b/.test(m.correctClass), 'the right option is marked .correct (gold dot)');
  assert.equal(m.why, 'the gentle mercy line', 'the .opt-why shows the item\'s gentle line');
  assert.equal(m.retryLabel, 'Try again', 'the wrong-answer foot offers "Try again"');
  assert.ok(/\bretry\b/.test(m.retryClass), 'the retry button carries the --rose .retry frame');
  assert.ok(m.announced.indexOf('Not quite — nothing lost. Look again.') >= 0, 'the mercy announce fires');
});

test('S4: retry re-attempts the same item; a later correct is NOT "came right away" → onDone({0,1})', { skip }, () => {
  assert.deepEqual(run.results.mercy.done, { correct: 0, total: 1 }, 'first attempt was wrong → 0 came right away');
});

test('S4: an empty item set completes immediately → onDone({0,0})', { skip }, () => {
  assert.deepEqual(run.results.empty, { correct: 0, total: 0 });
});
