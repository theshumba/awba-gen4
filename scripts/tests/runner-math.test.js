/* ============================================================================================
   runner-math.test.js  ·  Awba Gen-4 — pure RUNNER MATH contracts (ENG-03 / ENG-04)
   --------------------------------------------------------------------------------------------
   Pins the byte-faithful Gen-3 quiz/star/review numbers as PURE, DOM-free `AW.*` helpers,
   headlessly, via node --test — the same loadEngine(ls, probeSrc) + globalThis.__out
   concatenation idiom proven in components.test.js/state-helpers.test.js (const AW is a lexical
   binding, so engine+probe MUST run as ONE runInContext call — ls-stub.js handles that).

   Ground truth (byte-copied, never invented): `_MVP-BUILD/shared/awba-engine.js` resolve()
   274-287, starsFor() 289, reflect 219, review bind() 438, review result() 451/369 (D-47/ENG-03,
   D-47/ENG-04). These helpers are the contracts the runners (04-03 lesson / 04-05 review) call
   instead of re-deriving the math inline.
   ============================================================================================ */
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { makeLS, loadEngine } = require('./ls-stub');

/* ---------- AW.lessonStars (ENG-03) — never 0 ---------- */

test('AW.lessonStars: 0 mistakes -> 3, 1 mistake -> 2, >=2 mistakes -> 1 (never 0)', () => {
  const sandbox = loadEngine(
    makeLS({}),
    `globalThis.__out = {
       zero: AW.lessonStars(0),
       one: AW.lessonStars(1),
       two: AW.lessonStars(2),
       five: AW.lessonStars(5),
     };`
  );
  assert.equal(sandbox.__out.zero, 3);
  assert.equal(sandbox.__out.one, 2);
  assert.equal(sandbox.__out.two, 1);
  assert.equal(sandbox.__out.five, 1);
});

/* ---------- exposed noor/timer constants (ENG-03/ENG-04) ---------- */

test('AW constants: PER_LESSON=12, REFLECT=15, PER_REVIEW=15, SWIFT=5, QTIME=14', () => {
  const sandbox = loadEngine(
    makeLS({}),
    `globalThis.__out = {
       perLesson: AW.PER_LESSON,
       reflect: AW.REFLECT,
       perReview: AW.PER_REVIEW,
       swift: AW.SWIFT,
       qtime: AW.QTIME,
     };`
  );
  assert.equal(sandbox.__out.perLesson, 12);
  assert.equal(sandbox.__out.reflect, 15);
  assert.equal(sandbox.__out.perReview, 15);
  assert.equal(sandbox.__out.swift, 5);
  assert.equal(sandbox.__out.qtime, 14);
});

/* ---------- AW.comboShow / AW.comboPerfect (ENG-03) ---------- */

test('AW.comboShow: false at 1, true at 2, true at 3', () => {
  const sandbox = loadEngine(
    makeLS({}),
    `globalThis.__out = { one: AW.comboShow(1), two: AW.comboShow(2), three: AW.comboShow(3) };`
  );
  assert.equal(sandbox.__out.one, false);
  assert.equal(sandbox.__out.two, true);
  assert.equal(sandbox.__out.three, true);
});

test('AW.comboPerfect: false at 2, true at 3, false at 4 (fires once, at exactly 3)', () => {
  const sandbox = loadEngine(
    makeLS({}),
    `globalThis.__out = { two: AW.comboPerfect(2), three: AW.comboPerfect(3), four: AW.comboPerfect(4) };`
  );
  assert.equal(sandbox.__out.two, false);
  assert.equal(sandbox.__out.three, true);
  assert.equal(sandbox.__out.four, false);
});

/* ---------- AW.reviewScore (ENG-04) ---------- */

test('AW.reviewScore: 20 in time (15+5 swift), 15 not in time', () => {
  const sandbox = loadEngine(
    makeLS({}),
    `globalThis.__out = { inTime: AW.reviewScore(true), late: AW.reviewScore(false) };`
  );
  assert.equal(sandbox.__out.inTime, 20);
  assert.equal(sandbox.__out.late, 15);
});

/* ---------- AW.reviewStars (ENG-04) — a single timeout caps mastery at 2 ---------- */

test('AW.reviewStars: all-correct+inTime=3, all-correct+timeout=2, partial=1 regardless of timing', () => {
  const sandbox = loadEngine(
    makeLS({}),
    `globalThis.__out = {
       flawlessInTime: AW.reviewStars(6, 6, true),
       flawlessWithTimeout: AW.reviewStars(6, 6, false),
       partialInTime: AW.reviewStars(5, 6, true),
       partialWithTimeout: AW.reviewStars(5, 6, false),
     };`
  );
  assert.equal(sandbox.__out.flawlessInTime, 3);
  assert.equal(sandbox.__out.flawlessWithTimeout, 2);
  assert.equal(sandbox.__out.partialInTime, 1);
  assert.equal(sandbox.__out.partialWithTimeout, 1);
});
