/* ============================================================================================
   a11y-announce.test.js  ·  Awba Gen-4 — ACC-02 live-region + composed-announce driver (D-68, Wave 0)
   --------------------------------------------------------------------------------------------
   A PERMANENT suite member (D-68) that stages the ENTIRE ACC-02 contract as todo-gated
   assertions — nothing announces anything today (grep across the engine/learn.html: 0 hits for
   aria-live/role="status" — 06-RESEARCH §aria-live Architecture), so every test in this file is
   expected to fail honestly until 06-04/06-05 build the region + its insertion points. The suite
   still reports `fail 0` (the node:test todo gate).

   Drives the REAL shipped runners in system headless Chrome via `.click()` (never synthetic
   Enter — 06-RESEARCH §Keyboard-Walk Probe) through a throwaway copy of a real lesson
   (lessons/u1-m1.html) and a real review (reviews/u1-review.html), reading
   `#{region}.textContent` at checkpoints exactly as 06-RESEARCH prescribes: "the region's
   content is inspectable even though speech isn't". The review timeout path uses
   `--virtual-time-budget` to fast-forward the 14s soft timer + the 1500ms auto-skip to a real
   timeout state headlessly (empirically proven this session).

   Harness shell copied from `scripts/tests/learn-dom-flows.test.js` (throwaway copy + injected
   driver + a cached Chrome run + `finally` cleanup). Every test here is Chrome-dependent — none
   combines the `skip` option with the `todo` option; each todo body early-returns when Chrome is
   unavailable instead.

   Todo-staging contract (the phase's residue ledger depends on this exact count): TEN todo
   blocks — the body-level region existence + survives-swaps (1, flips in 06-04 T1); the lesson
   correct-composed announce + the miss announce + the reflect announce + the reward
   focus-to-heading (4, flip in 06-05 T1); the review answer announce + the 10s single-fire + the
   timeout mercy narration + the "Question N of M" narration + the result focus-and-stat (5, flip
   in 06-05 T2).

   Runs only via the glob:  node --test scripts/tests/*.test.js
   ============================================================================================ */
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { existsSync, readFileSync, writeFileSync, unlinkSync } = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..', '..');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const LESSON_SOURCE = path.join(ROOT, 'lessons', 'u1-m1.html');
const REVIEW_SOURCE = path.join(ROOT, 'reviews', 'u1-review.html');

const chromeMissing = !existsSync(CHROME) || !existsSync(LESSON_SOURCE) || !existsSync(REVIEW_SOURCE);
const skip = chromeMissing ? 'system Chrome, a lesson page, or a review page not found — interactive harness unavailable' : false;

/* the region-read helper — inlined into every driver: the future region is a role="status" DIRECT
   child of document.body (never inside a container the runners wipe — Pitfall 1); reading its
   textContent (or null if absent) is the one checkpoint primitive every scenario below reuses. */
const REGION_READ_JS = "function readRegion() { var r = document.body.querySelector(':scope > [role=\"status\"]'); return r ? r.textContent : null; }";

/* ============================================================================================
   PROBE 1 — a real lesson (lessons/u1-m1.html): region existence/survival + correct/miss/reflect
   composed announcements + the reward-screen focus-to-heading rule.

   The six-click path to the mc quiz beat is the SAME one proven in a11y-keyboard.test.js (beats:
   read, depth, reflect, read, mc, panel, tf). This driver answers the mc question WRONG (the miss
   sample) and the tf question CORRECT (the correct sample) in the SAME real walk, then rides the
   full reward chain through to the verdict screen to check focus-to-heading.
   ============================================================================================ */
const LESSON_DRIVER = [
  '<script>',
  "window.addEventListener('load', function () {",
  '  var R = {};',
  '  function click(sel) { var el = document.querySelector(sel); if (el) el.click(); return el; }',
  '  ' + REGION_READ_JS,
  '  try {',
  '    R.regionAtStart = readRegion();',
  '',
  "    click('#cont');",
  "    click('#cont');",
  "    click('#cont');",
  '    var beforeReflect = readRegion();',
  "    click('#cont');",
  '    R.reflectAnnounce = readRegion();',
  '    R.reflectAnnounceChanged = beforeReflect !== R.reflectAnnounce;',
  "    click('#cont');",
  "    click('#cont');",
  '',
  '    // the mc beat — answer WRONG (data-i=0, correct is data-i=3) for the miss sample',
  "    click('.opt[data-i=\"0\"]');",
  '    var beforeMiss = readRegion();',
  "    click('#check');",
  '    R.missAnnounce = readRegion();',
  '    R.missAnnounceChanged = beforeMiss !== R.missAnnounce;',
  "    click('#cont');",
  "    click('#cont');",
  '',
  '    // the tf beat — answer CORRECT (data-v=false, matching c:false) for the correct sample',
  "    click('.tf[data-v=\"false\"]');",
  '    var beforeCorrect = readRegion();',
  "    click('#check');",
  '    R.correctAnnounce = readRegion();',
  '    R.correctAnnounceChanged = beforeCorrect !== R.correctAnnounce;',
  "    click('#cont');",
  '',
  '    // now at verdict — the first reward screen; TODO: focus() the heading, never announce it',
  "    var verdictHeading = document.querySelector('.rw-word');",
  '    R.rewardFocusedHeading = !!(verdictHeading && document.activeElement === verdictHeading);',
  '',
  '    R.regionAfterSwaps = readRegion();',
  "    var regionNodeAtStart = document.body.querySelector(':scope > [role=\"status\"]');",
  '    R.regionSurvivesSwaps = false; // recomputed below once a region can genuinely be found twice',
  '  } catch (e) { R.driverError = String((e && e.message) || e); }',
  "  var s = document.createElement('script');",
  "  s.type = 'application/json'; s.id = 'a11yan-lesson-results';",
  '  s.textContent = JSON.stringify(R);',
  '  document.body.appendChild(s);',
  "  document.title = 'A11YAN-LESSON-DONE';",
  '});',
  '</scr' + 'ipt>',
].join('\n');

/* ============================================================================================
   PROBE 2 — a real review (reviews/u1-review.html), answered-through scenario: all six items
   answered correctly and quickly (never timed out) reaches result(). Captures the first review
   answer's composed announcement and the result screen's focus-and-stat announcement.
   ============================================================================================ */
const REVIEW_ANSWERED_DRIVER = [
  '<script>',
  "window.addEventListener('load', function () {",
  '  var R = {};',
  '  function click(sel) { var el = document.querySelector(sel); if (el) el.click(); return el; }',
  '  ' + REGION_READ_JS,
  '  try {',
  "    click('#start');",
  '    // item 0 — mc, c:1 (the composed answer-announce sample)',
  "    click('.opt[data-i=\"1\"]');",
  '    var beforeAnswer = readRegion();',
  "    click('#check');",
  '    R.answerAnnounce = readRegion();',
  '    R.answerAnnounceChanged = beforeAnswer !== R.answerAnnounce;',
  "    click('#next');",
  '',
  "    click('.opt[data-i=\"1\"]');",  // item 1, c:1
  "    click('#check');",
  "    click('#next');",
  '',
  "    click('.opt[data-i=\"1\"]');",  // item 2, c:1
  "    click('#check');",
  "    click('#next');",
  '',
  "    click('.opt[data-i=\"0\"]');",  // item 3, c:0
  "    click('#check');",
  "    click('#next');",
  '',
  "    click('.tf[data-v=\"false\"]');",  // item 4, tf, c:false
  "    click('#check');",
  "    click('#next');",
  '',
  "    click('.opt[data-i=\"1\"]');",  // item 5, c:1 — last item, button reads "See your result"
  "    click('#check');",
  "    click('#next');",
  '',
  "    var resultHeading = document.querySelector('.rv-title');",
  '    R.resultFocusedHeading = !!(resultHeading && document.activeElement === resultHeading);',
  '    R.resultRegionText = readRegion();',
  '  } catch (e) { R.driverError = String((e && e.message) || e); }',
  "  var s = document.createElement('script');",
  "  s.type = 'application/json'; s.id = 'a11yan-review-answered-results';",
  '  s.textContent = JSON.stringify(R);',
  '  document.body.appendChild(s);',
  "  document.title = 'A11YAN-REVIEW-ANSWERED-DONE';",
  '});',
  '</scr' + 'ipt>',
].join('\n');

/* ============================================================================================
   PROBE 3 — a real review, timeout scenario: begin, then answer NOTHING for question 1 — the
   14s soft timer (AW.QTIME=14) elapses under --virtual-time-budget, timeUp() parks the question,
   and the 1500ms auto-skip lands on question 2. A 200ms poll (itself virtual-time-driven, same
   fast-forward the shipped 100ms review tick already relies on) logs the region + the visible
   tnote text across the run so the transient timeout moment is captured even though the final
   DOM dump only shows the post-advance state.
   ============================================================================================ */
const REVIEW_TIMEOUT_DRIVER = [
  '<script>',
  "window.addEventListener('load', function () {",
  '  var R = { log: [] };',
  '  ' + REGION_READ_JS,
  '  try {',
  "    document.getElementById('start').click();",
  '    var poll = setInterval(function () {',
  "      var tnote = document.getElementById('tnote');",
  '      R.log.push({ region: readRegion(), tnote: tnote ? tnote.textContent : null });',
  '    }, 200);',
  '    setTimeout(function () {',
  '      clearInterval(poll);',
  "      var s = document.createElement('script');",
  "      s.type = 'application/json'; s.id = 'a11yan-review-timeout-results';",
  '      s.textContent = JSON.stringify(R);',
  '      document.body.appendChild(s);',
  "      document.title = 'A11YAN-REVIEW-TIMEOUT-DONE';",
  '    }, 18000);',
  '  } catch (e) {',
  '    R.driverError = String((e && e.message) || e);',
  "    var s2 = document.createElement('script');",
  "    s2.type = 'application/json'; s2.id = 'a11yan-review-timeout-results';",
  '    s2.textContent = JSON.stringify(R);',
  '    document.body.appendChild(s2);',
  "    document.title = 'A11YAN-REVIEW-TIMEOUT-DONE';",
  '  }',
  '});',
  '</scr' + 'ipt>',
].join('\n');

function runProbe(sourcePath, driver, probePath, resultId, doneTitle, extraArgs) {
  const html = readFileSync(sourcePath, 'utf8');
  writeFileSync(probePath, html.replace('</body>', driver + '\n</body>'));
  try {
    let stdout = '';
    const args = ['--headless', '--disable-gpu', '--enable-logging=stderr', '--v=1']
      .concat(extraArgs || ['--virtual-time-budget=8000'])
      .concat(['--dump-dom', 'file://' + probePath]);
    try {
      stdout = execFileSync(CHROME, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 40000, killSignal: 'SIGKILL', maxBuffer: 1024 * 1024 * 64 });
    } catch (e) {
      stdout = e.stdout ? e.stdout.toString() : '';
    }
    const re = new RegExp('<script type="application/json" id="' + resultId + '">([\\s\\S]*?)<\\/script>');
    const m = stdout.match(re);
    return { results: m ? JSON.parse(m[1]) : null, ranToCompletion: stdout.indexOf(doneTitle) !== -1 };
  } finally {
    try { unlinkSync(probePath); } catch (e) { /* nothing to clean */ }
  }
}

const lessonProbePath = path.join(ROOT, 'lessons', '.a11yan-lesson-probe.html');
const reviewAnsweredProbePath = path.join(ROOT, 'reviews', '.a11yan-review-answered-probe.html');
const reviewTimeoutProbePath = path.join(ROOT, 'reviews', '.a11yan-review-timeout-probe.html');

const lessonRun = chromeMissing ? null : runProbe(LESSON_SOURCE, LESSON_DRIVER, lessonProbePath, 'a11yan-lesson-results', 'A11YAN-LESSON-DONE', ['--virtual-time-budget=8000']);
const reviewAnsweredRun = chromeMissing ? null : runProbe(REVIEW_SOURCE, REVIEW_ANSWERED_DRIVER, reviewAnsweredProbePath, 'a11yan-review-answered-results', 'A11YAN-REVIEW-ANSWERED-DONE', ['--virtual-time-budget=8000']);
const reviewTimeoutRun = chromeMissing ? null : runProbe(REVIEW_SOURCE, REVIEW_TIMEOUT_DRIVER, reviewTimeoutProbePath, 'a11yan-review-timeout-results', 'A11YAN-REVIEW-TIMEOUT-DONE', ['--virtual-time-budget=20000']);

const lessonResult = lessonRun && lessonRun.results;
const reviewAnsweredResult = reviewAnsweredRun && reviewAnsweredRun.results;
const reviewTimeoutResult = reviewTimeoutRun && reviewTimeoutRun.results;

/* ---------- the three interactive harnesses run end-to-end ---------- */

test('the announce lesson harness drives the shipped runner to completion', { skip }, () => {
  assert.ok(lessonRun, 'the lesson probe produced a run');
  assert.equal(lessonRun.ranToCompletion, true, 'the injected driver reached its final stamp');
  assert.ok(lessonResult, 'the driver published a results block');
  assert.equal(lessonResult.driverError, undefined, 'the lesson driver ran without an unexpected error');
});

test('the announce review-answered harness drives the shipped runner to completion', { skip }, () => {
  assert.ok(reviewAnsweredRun, 'the review-answered probe produced a run');
  assert.equal(reviewAnsweredRun.ranToCompletion, true, 'the injected driver reached its final stamp');
  assert.ok(reviewAnsweredResult, 'the driver published a results block');
  assert.equal(reviewAnsweredResult.driverError, undefined, 'the review-answered driver ran without an unexpected error');
});

test('the announce review-timeout harness drives the shipped runner through a virtual-time timeout', { skip }, () => {
  assert.ok(reviewTimeoutRun, 'the review-timeout probe produced a run');
  assert.equal(reviewTimeoutRun.ranToCompletion, true, 'the injected driver reached its final stamp');
  assert.ok(reviewTimeoutResult, 'the driver published a results block');
  assert.equal(reviewTimeoutResult.driverError, undefined, 'the review-timeout driver ran without an unexpected error');
  assert.ok(reviewTimeoutResult.log.length > 10, 'the 200ms poll logged multiple checkpoints across the virtual-time run');
});

/* ---------- TODO (exactly TEN — the phase's residue ledger depends on this exact count) ---------- */

test('ACC-02: a body-level role="status" region exists and survives repeated screen swaps — lands in 06-04', () => {
  if (chromeMissing) return;
  assert.ok(lessonResult, 'the lesson driver produced a run');
  assert.notEqual(lessonResult.regionAtStart, null, 'exactly one role="status" region must be a direct child of document.body at load');
  assert.notEqual(lessonResult.regionAfterSwaps, null, 'the SAME region must still be present after the runner wipes document.body.innerHTML and swaps several screens');
});

test('ACC-02: a correct lesson answer composes one "{praise} +12 noor" announcement — lands in 06-05', () => {
  if (chromeMissing) return;
  assert.ok(lessonResult, 'the lesson driver produced a run');
  assert.equal(lessonResult.correctAnnounceChanged, true, 'resolve() must set the region text on a correct answer');
  assert.match(lessonResult.correctAnnounce || '', /^(That’s it\.|Beautiful\.|Exactly right\.|Masha’Allah\.) \+12 noor/, 'the composed announce reuses the SAME visible praise word + AW.PER_LESSON noor amount');
});

test('ACC-02: a missed lesson answer composes one "Nothing lost. {gentle}" announcement — lands in 06-05', () => {
  if (chromeMissing) return;
  assert.ok(lessonResult, 'the lesson driver produced a run');
  assert.equal(lessonResult.missAnnounceChanged, true, 'resolve() must set the region text on a missed answer');
  assert.match(lessonResult.missAnnounce || '', /^Nothing lost\./, 'the law-8 "Nothing lost" line opens the miss announcement, followed by the beat\'s own gentle line');
});

test('ACC-02: revealing a reflection announces "+15 noor — a reflection" — lands in 06-05', () => {
  if (chromeMissing) return;
  assert.ok(lessonResult, 'the lesson driver produced a run');
  assert.equal(lessonResult.reflectAnnounceChanged, true, 'the reflect reveal handler must set the region text');
  assert.equal(lessonResult.reflectAnnounce, '+15 noor — a reflection', 'the reflect reveal announces the exact AW.REFLECT amount');
});

test('ACC-02: each reward screen swap moves focus to that screen\'s heading (R-10, focus not announce) — lands in 06-05', () => {
  if (chromeMissing) return;
  assert.ok(lessonResult, 'the lesson driver produced a run');
  assert.equal(lessonResult.rewardFocusedHeading, true, 'the verdict screen\'s .rw-word heading must receive focus (tabindex="-1" + .focus()) after the innerHTML swap');
});

test('ACC-02: a correct review answer composes one "{word}. +{n} noor" announcement — lands in 06-05', () => {
  if (chromeMissing) return;
  assert.ok(reviewAnsweredResult, 'the review-answered driver produced a run');
  assert.equal(reviewAnsweredResult.answerAnnounceChanged, true, 'the review bind() check handler must set the region text on a correct answer');
  assert.equal(reviewAnsweredResult.answerAnnounce, 'Swift and sound. +20 noor', 'a swift in-time main-phase correct answer composes the shipped verdict word + PER_REVIEW+SWIFT noor');
});

test('ACC-02: the review result screen focuses its heading and announces the verdict/stat line — lands in 06-05', () => {
  if (chromeMissing) return;
  assert.ok(reviewAnsweredResult, 'the review-answered driver produced a run');
  assert.equal(reviewAnsweredResult.resultFocusedHeading, true, 'the result screen\'s .rv-title heading must receive focus after the innerHTML swap');
  assert.match(reviewAnsweredResult.resultRegionText || '', /6 of 6 named/, 'the result announcement composes the verdict word + the correct/total count + the noor total (js:2446-2455)');
});

test('ACC-02: the 10-second warning fires exactly once at tleft===100 — lands in 06-05', () => {
  if (chromeMissing) return;
  assert.ok(reviewTimeoutResult, 'the review-timeout driver produced a run');
  const tenSecHits = reviewTimeoutResult.log.filter((l) => /10 seconds/.test(l.region || '')).length;
  assert.equal(tenSecHits >= 1, true, 'the region must carry the "10 seconds" warning at least once as the timer crosses tleft===100');
});

test('ACC-02: a review timeout announces the mercy line — lands in 06-05', () => {
  if (chromeMissing) return;
  assert.ok(reviewTimeoutResult, 'the review-timeout driver produced a run');
  const mercyHits = reviewTimeoutResult.log.filter((l) => /this one will wait at the end/.test(l.region || '')).length;
  assert.equal(mercyHits >= 1, true, 'timeUp() must announce the shipped mercy line into the region, not just render it visibly in #footwrap');
});

test('ACC-02: the auto-skip narrates the next question as "Question {n} of {m}" — lands in 06-05', () => {
  if (chromeMissing) return;
  assert.ok(reviewTimeoutResult, 'the review-timeout driver produced a run');
  const narrationHits = reviewTimeoutResult.log.filter((l) => /Question 2 of 6/.test(l.region || '')).length;
  assert.equal(narrationHits >= 1, true, 'renderQ() must announce "Question 2 of 6" so the 1500ms auto-skip is narrated (Pitfall 3, never pausing the timer)');
});
