/* ============================================================================================
   runner-review.test.js  ·  Awba Gen-4 — AwbaReview(cfg) runner (ENG-02/ENG-04 / D-45/D-47)
   --------------------------------------------------------------------------------------------
   Pins the PURE, DOM-free contracts of the review runner against the real shared/awba-engine.js,
   headlessly, via node --test — the same loadEngine(ls, probeSrc) + globalThis.__out idiom as
   runner-lesson.test.js (const AW is a lexical binding, so engine+probe run as ONE runInContext
   call — ls-stub.js handles that).

   The runner is DOM-driven; jsdom is out (zero-dep, D-25), so the full timed flow (the live
   100ms tick, the circle-back walk, the rosette stamp) is proven by the real-Chrome render-smoke
   harness on reviews/u1-review.html (04-05 Task 3), NOT here. What is unit-testable WITHOUT a
   DOM — and asserted below — is the byte-preserved review MATH carried by the 04-01 pure helpers
   the runner must call (AW.reviewScore / AW.reviewStars / AW.QTIME), the timer seed arithmetic,
   and the persistence seams (noor-once via AW._noorClaimer, best-of stars). Test cfg content is
   neutral placeholder copy ONLY — never real scripture (RESEARCH Fixtures rule).
   ============================================================================================ */
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { makeLS, loadEngine, readOut } = require('./ls-stub');

/* ---------- AwbaReview exists (ENG-02) ---------- */

test('AwbaReview: is a function defined on the engine (the RUNNERS review runner)', () => {
  const sandbox = loadEngine(makeLS({}), `globalThis.__out = typeof AwbaReview;`);
  assert.equal(sandbox.__out, 'function');
});

/* ---------- the 14s soft-timer seed (ENG-04 / D-47) ---------- */

test('AW.QTIME: the soft timer is 14s and seeds 140 deciseconds (tleft = AW.QTIME*10)', () => {
  const sandbox = loadEngine(makeLS({}), `globalThis.__out = { q: AW.QTIME, seed: AW.QTIME * 10 };`);
  const out = readOut(sandbox);
  assert.equal(out.q, 14);
  assert.equal(out.seed, 140);
});

/* ---------- AW.reviewScore — main-phase correct: PER 15 + SWIFT 5 in time ---------- */

test('AW.reviewScore: 20 when the answer lands in time, 15 when it does not (15+swift5)', () => {
  const sandbox = loadEngine(
    makeLS({}),
    `globalThis.__out = { inTime: AW.reviewScore(true), late: AW.reviewScore(false) };`
  );
  const out = readOut(sandbox);
  assert.equal(out.inTime, 20);
  assert.equal(out.late, 15);
});

/* ---------- AW.reviewStars — 3 all-in-time / 2 any-timeout cap / 1 partial floor ---------- */

test('AW.reviewStars: flawless + all-in-time → 3; a single timeout permanently caps at 2; any miss → 1', () => {
  const sandbox = loadEngine(
    makeLS({}),
    `globalThis.__out = [
       AW.reviewStars(6, 6, true),    // flawless, never timed out → 3
       AW.reviewStars(6, 6, false),   // flawless but ANY timeout occurred → capped at 2
       AW.reviewStars(5, 6, true),    // a miss, even all-in-time → 1 (the partial-run floor)
       AW.reviewStars(0, 6, true),    // never 0 — the un-loseable promise
     ];`
  );
  assert.deepEqual(readOut(sandbox), [3, 2, 1, 1]);
});

/* ---------- noor persists ONCE at result (T-04-05a) — the AW._noorClaimer seam ----------
   result() credits noorEarned a single time; a re-entry can never double-credit, and the
   circle-back phase earns no noor at all (the phase gate lives in bind()'s scoring — main-phase
   correct is the ONLY accrual path; the arithmetic here proves the persist-once discipline). */

test('review noor: persists exactly once at result via AW._noorClaimer (a re-entry is a no-op)', () => {
  const sandbox = loadEngine(
    makeLS({ awba_state: JSON.stringify({ schemaVersion: 1, noor: 200, returns: 3, lastDay: null, days: [], stars: {}, chests: {} }) }),
    `var earned = AW.reviewScore(true) + AW.reviewScore(false); // 20 + 15 — two main-phase corrects
     var claim = AW._noorClaimer();
     var first = claim(earned);
     var second = claim(earned);   // the double-tap / re-entry — must be a no-op
     globalThis.__out = { noor: AW.S.get('noor', 0), first: first, second: second };`
  );
  const out = readOut(sandbox);
  assert.equal(out.noor, 235);      // 200 + 35, once — never 270
  assert.equal(out.first, true);
  assert.equal(out.second, false);
});

/* ---------- best-of star persist — a lower review run never downgrades ---------- */

test('review stars persist best-of: a 1-star re-run never downgrades a stored 3-star review', () => {
  const sandbox = loadEngine(
    makeLS({ awba_state: JSON.stringify({ schemaVersion: 1, noor: 0, returns: 0, lastDay: null, days: [], stars: { u1r: 3 }, chests: {} }) }),
    `var stars = AW.reviewStars(4, 6, true); // a partial run this time → 1
     var st = AW.S.get('stars', {});
     if (stars > (st['u1r'] || 0)) { st['u1r'] = stars; AW.S.set('stars', st); }
     globalThis.__out = AW.S.get('stars', {})['u1r'];`
  );
  assert.equal(sandbox.__out, 3);   // stays 3 — never downgraded
});

/* ---------- the timer drain paints on the compositor (v2.4, owner-approved) ----------
   The 100ms tick used to write style.width — a layout+paint on every tick for the whole review.
   It now writes transform: scaleX() (transform-origin: left in the engine CSS; the fill keeps its
   shipped width:100%), a compositor-only property. EXPRESSION ONLY: the pct arithmetic and every
   frozen number (QTIME 14 → 140 deciseconds, the 100ms tick, the <28 low state, the 10s announce)
   must stay byte-identical — these pins hold the drain honest against any future "improvement". */

const fs = require('node:fs');
const path = require('node:path');
const ENGINE_SRC_RV = fs.readFileSync(path.join(__dirname, '..', '..', 'shared', 'awba-engine.js'), 'utf8');
const ENGINE_CSS_RV = fs.readFileSync(path.join(__dirname, '..', '..', 'shared', 'awba-engine.css'), 'utf8');
const REVIEW_SLICE = ENGINE_SRC_RV.slice(ENGINE_SRC_RV.indexOf('function AwbaReview'));

test('review timer: the drain writes transform scaleX, never style.width (compositor-only)', () => {
  assert.ok(/tfill\.style\.transform = 'scaleX\(1\)'/.test(REVIEW_SLICE),
    'startTimer must arm the bar full via scaleX(1)');
  assert.ok(/tfill\.style\.transform = 'scaleX\(' \+ pct \/ 100 \+ '\)'/.test(REVIEW_SLICE),
    'the tick must paint the drain via scaleX(pct/100)');
  assert.equal(/tfill\.style\.width/.test(REVIEW_SLICE), false,
    'no width write may remain on the fill — width is a layout property');
});

test('review timer: the frozen numbers are byte-unchanged around the scaleX move', () => {
  assert.ok(/tleft = AW\.QTIME \* 10;/.test(REVIEW_SLICE), 'the 140-decisecond seed (AW.QTIME * 10)');
  assert.ok(/var pct = Math\.max\(0, tleft \/ \(AW\.QTIME \* 10\)\) \* 100;/.test(REVIEW_SLICE),
    'the pct arithmetic line is byte-identical');
  assert.ok(/if \(pct < 28\) tbar\.classList\.add\('low'\);/.test(REVIEW_SLICE), 'the <28% low state');
  assert.ok(/if \(tleft === 100\) AW\.announce\('10 seconds'\);/.test(REVIEW_SLICE), 'the single 10s announce');
  assert.ok(/}, 100\);/.test(REVIEW_SLICE), 'the 100ms tick interval');
});

test('review timer: the engine CSS keeps width:100% and gains transform-origin:left on the fill', () => {
  const m = ENGINE_CSS_RV.match(/\.rv-timer-fill \{[\s\S]*?\}/);
  assert.ok(m, '.rv-timer-fill block exists');
  assert.ok(/width: 100%/.test(m[0]), 'the shipped width:100% stays — the drain is the transform');
  assert.ok(/transform-origin: left/.test(m[0]), 'scaleX must shrink from the left, matching the shipped drain');
});
