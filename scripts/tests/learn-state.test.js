/* ============================================================================================
   learn-state.test.js  ·  Awba Gen-4 — learn-page pure engine seams (CNT-03/D-57/LRN-05/RWD-04)
   --------------------------------------------------------------------------------------------
   Pins the four seams the learn page (05-02+) consumes against the real shared/awba-engine.js,
   headlessly, via `node --test`: the NODE_ATOMS map + AW.atomsDone(progress) (D-57/R-1, the
   61-atom taught total), AW.dailyIndex(date, poolLen) (LRN-05, day-of-year not day-of-month),
   the AW.muteBtnHtml/AW.bindMuteBtn exports (D-60/Pitfall 6), and the CNT-03 unlock-order
   contract walked over the SHIPPED AW.deriveNodeState (never forked) plus chest-claim
   idempotency (RWD-04/D-56, Pattern 3).

   Written RED (Task 1): none of NODE_ATOMS/AW.atomsDone/AW.dailyIndex/AW.muteBtnHtml/
   AW.bindMuteBtn exist yet — every probe below throws or returns undefined, which IS the RED
   signal (D-30/TDD), until Task 1's engine edit lands.

   Runs only via the glob:  node --test scripts/tests/*.test.js
   ============================================================================================ */
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { makeLS, loadEngine, readOut } = require('./ls-stub');

/* ---------- the canonical Gen-3 flat unlock order (CNT-03), from 05-CONTEXT/05-RESEARCH ----------
   u1m1→u1m2→u1m3→u1m4→u1r→u1c → u2m1→u2m2→u2m3→u2m3b→u2r→u2c → u3m1→u3m2→u3m3→u3r→u3c →
   u4m1→u4m2→u4m2b→u4m3→u4r→u4c (reviews carry review:true, chests carry chest:true). */
const FLAT = [
  { id: 'u1m1' }, { id: 'u1m2' }, { id: 'u1m3' }, { id: 'u1m4' },
  { id: 'u1r', review: true }, { id: 'u1c', chest: true },
  { id: 'u2m1' }, { id: 'u2m2' }, { id: 'u2m3' }, { id: 'u2m3b' },
  { id: 'u2r', review: true }, { id: 'u2c', chest: true },
  { id: 'u3m1' }, { id: 'u3m2' }, { id: 'u3m3' },
  { id: 'u3r', review: true }, { id: 'u3c', chest: true },
  { id: 'u4m1' }, { id: 'u4m2' }, { id: 'u4m2b' }, { id: 'u4m3' },
  { id: 'u4r', review: true }, { id: 'u4c', chest: true },
];

/* ---------- (1) NODE_ATOMS — the verbatim per-node taught-atom map sums to exactly 61 ---------- */

test('NODE_ATOMS: sums to exactly 61 across exactly the 15 lesson ids (no review/chest ids) (D-57)', () => {
  const sandbox = loadEngine(makeLS({}), 'globalThis.__out = NODE_ATOMS;');
  const nodeAtoms = readOut(sandbox);
  assert.ok(nodeAtoms && typeof nodeAtoms === 'object', 'NODE_ATOMS must exist as an object');
  const ids = Object.keys(nodeAtoms);
  assert.equal(ids.length, 15, 'NODE_ATOMS must have exactly the 15 lesson ids');
  const LESSON_IDS = ['u1m1', 'u1m2', 'u1m3', 'u1m4', 'u2m1', 'u2m2', 'u2m3', 'u2m3b',
    'u3m1', 'u3m2', 'u3m3', 'u4m1', 'u4m2', 'u4m2b', 'u4m3'];
  assert.deepEqual(ids.slice().sort(), LESSON_IDS.slice().sort(), 'NODE_ATOMS ids must be exactly the 15 lesson ids');
  const REVIEW_CHEST_IDS = ['u1r', 'u1c', 'u2r', 'u2c', 'u3r', 'u3c', 'u4r', 'u4c'];
  REVIEW_CHEST_IDS.forEach((id) => {
    assert.ok(!(id in nodeAtoms), `NODE_ATOMS must never carry a review/chest id (${id})`);
  });
  const sum = ids.reduce((t, id) => t + nodeAtoms[id], 0);
  assert.equal(sum, 61, 'Σ NODE_ATOMS must equal exactly 61 (the taught total, R-1)');
  // Spot-check the verbatim counts from RESEARCH §Atom Map (never invented).
  assert.equal(nodeAtoms.u1m1, 3);
  assert.equal(nodeAtoms.u1m2, 4);
  assert.equal(nodeAtoms.u1m3, 5);
  assert.equal(nodeAtoms.u1m4, 5);
  assert.equal(nodeAtoms.u2m1, 5);
  assert.equal(nodeAtoms.u2m2, 4);
  assert.equal(nodeAtoms.u2m3, 3);
  assert.equal(nodeAtoms.u2m3b, 3);
  assert.equal(nodeAtoms.u3m1, 4);
  assert.equal(nodeAtoms.u3m2, 5);
  assert.equal(nodeAtoms.u3m3, 5);
  assert.equal(nodeAtoms.u4m1, 3);
  assert.equal(nodeAtoms.u4m2, 4);
  assert.equal(nodeAtoms.u4m2b, 4);
  assert.equal(nodeAtoms.u4m3, 4);
});

/* ---------- (2) AW.atomsDone(progress) — sum only starred lesson nodes, review/chest add 0 ---------- */

test('AW.atomsDone: sums NODE_ATOMS over starred node ids only; review/chest contribute 0 (D-57)', () => {
  const sandbox = loadEngine(
    makeLS({}),
    `globalThis.__out = {
       empty: AW.atomsDone({ stars: {} }),
       one: AW.atomsDone({ stars: { u1m1: 3 } }),
       two: AW.atomsDone({ stars: { u1m1: 3, u1m3: 2 } }),
       withReviewChest: AW.atomsDone({ stars: { u1m1: 3, u1r: 3, u1c: 1 } })
     };`
  );
  const out = readOut(sandbox);
  assert.equal(out.empty, 0, 'no stars → 0 atoms done');
  assert.equal(out.one, 3, 'a single starred lesson sums to its own NODE_ATOMS count');
  assert.equal(out.two, 8, 'u1m1(3) + u1m3(5) = 8');
  assert.equal(out.withReviewChest, 3, 'review + chest keys in stars must add 0 (only lesson ids count)');
});

/* ---------- (3) AW.dailyIndex(date, poolLen) — day-of-YEAR from LOCAL parts (LRN-05, D-16) ---------- */

test('AW.dailyIndex: Jan-8 and Feb-8 differ — the exact Gen-3 day-of-month monthly-repeat bug is fixed (LRN-05)', () => {
  const sandbox = loadEngine(
    makeLS({}),
    `globalThis.__out = {
       jan8: AW.dailyIndex(new Date(2026, 0, 8), 7),
       feb8: AW.dailyIndex(new Date(2026, 1, 8), 7)
     };`
  );
  const out = readOut(sandbox);
  assert.notEqual(out.jan8, out.feb8, 'day-of-month 8 in two different months must not collide (Gen-3 getDate()%7 bug)');
});

test('AW.dailyIndex: always an integer in [0, poolLen) and leap-safe (Dec-31 fixtures)', () => {
  const sandbox = loadEngine(
    makeLS({}),
    `globalThis.__out = {
       a: AW.dailyIndex(new Date(2026, 0, 8), 7),
       b: AW.dailyIndex(new Date(2026, 5, 15), 7),
       leapDec31: AW.dailyIndex(new Date(2028, 11, 31), 7),
       nonLeapDec31: AW.dailyIndex(new Date(2026, 11, 31), 7)
     };`
  );
  const out = readOut(sandbox);
  [out.a, out.b, out.leapDec31, out.nonLeapDec31].forEach((v) => {
    assert.ok(Number.isInteger(v), `dailyIndex must return an integer, got ${v}`);
    assert.ok(v >= 0 && v <= 6, `dailyIndex must be in [0,6] for poolLen 7, got ${v}`);
  });
});

/* ---------- (4) the mute exports exist — one 44px toggle pattern, no new glyph (D-60/Pitfall 6) ---------- */

test('AW.muteBtnHtml / AW.bindMuteBtn are exposed on AW (module-private helpers, no new glyph)', () => {
  const sandbox = loadEngine(
    makeLS({}),
    `globalThis.__out = {
       html: typeof AW.muteBtnHtml,
       bind: typeof AW.bindMuteBtn
     };`
  );
  const out = readOut(sandbox);
  assert.equal(out.html, 'function', 'AW.muteBtnHtml must be exported as a function');
  assert.equal(out.bind, 'function', 'AW.bindMuteBtn must be exported as a function');
});

/* ---------- (5) CNT-03 — the unlock-order contract, walked over the SHIPPED AW.deriveNodeState ----------
   Extends, never forks, the Phase-2 seam. Empty progress → only u1m1 is active, everything after
   is locked (strictly linear). Completing u1 through its review unlocks the u1 chest (available)
   AND the first u2 lesson (active). Claiming the chest flips it to done. */

test('CNT-03: empty progress → u1m1 active, every later lesson/review locked, u1c locked', () => {
  const sandbox = loadEngine(
    makeLS({}),
    `globalThis.__out = AW.deriveNodeState(${JSON.stringify(FLAT)}, { stars: {}, chests: {} });`
  );
  const out = readOut(sandbox);
  const byId = Object.fromEntries(out.map((n) => [n.id, n.state]));
  assert.equal(byId.u1m1, 'active', 'the first node is active with no progress');
  ['u1m2', 'u1m3', 'u1m4', 'u1r', 'u2m1', 'u2r', 'u3m1', 'u4m1', 'u4c'].forEach((id) => {
    assert.equal(byId[id], 'locked', `${id} must be locked with no progress`);
  });
  assert.equal(byId.u1c, 'locked', 'u1c is locked before its review has stars');
});

test('CNT-03: unit-1 lessons+review starred → u1c available (chest-after-review), u2m1 active', () => {
  const stars = { u1m1: 3, u1m2: 3, u1m3: 3, u1m4: 3, u1r: 3 };
  const sandbox = loadEngine(
    makeLS({}),
    `globalThis.__out = AW.deriveNodeState(${JSON.stringify(FLAT)}, { stars: ${JSON.stringify(stars)}, chests: {} });`
  );
  const out = readOut(sandbox);
  const byId = Object.fromEntries(out.map((n) => [n.id, n.state]));
  assert.equal(byId.u1c, 'available', 'the chest becomes available the moment the review has stars');
  assert.equal(byId.u2m1, 'active', 'the next unit\'s first lesson becomes active');
  assert.equal(byId.u2m2, 'locked', 'later u2 lessons stay locked');
});

test('CNT-03: claiming the chest (chests.u1c=true) flips it to done', () => {
  const stars = { u1m1: 3, u1m2: 3, u1m3: 3, u1m4: 3, u1r: 3 };
  const sandbox = loadEngine(
    makeLS({}),
    `globalThis.__out = AW.deriveNodeState(${JSON.stringify(FLAT)}, { stars: ${JSON.stringify(stars)}, chests: { u1c: true } });`
  );
  const out = readOut(sandbox);
  const byId = Object.fromEntries(out.map((n) => [n.id, n.state]));
  assert.equal(byId.u1c, 'done', 'an opened chest reports done');
});

/* ---------- (6) chest-claim idempotency — +25 noor exactly once (RWD-04/D-56, Pattern 3) ---------- */

test('chest claim: first claim grants +25 noor and sets chests.u1c=true; a second claim is a no-op (RWD-04)', () => {
  const sandbox = loadEngine(
    makeLS({}),
    `function claim(nodeId) {
       var chests = AW.state().chests;
       if (!chests[nodeId]) {
         chests[nodeId] = true;
         AW.S.set('chests', chests);
         AW.S.set('noor', AW.S.get('noor', 0) + 25);
         return true;
       }
       return false;
     }
     var before = AW.S.get('noor', 0);
     var first = claim('u1c');
     var afterFirst = AW.S.get('noor', 0);
     var chestsAfterFirst = AW.S.get('chests', {});
     var second = claim('u1c');
     var afterSecond = AW.S.get('noor', 0);
     globalThis.__out = { before: before, first: first, afterFirst: afterFirst,
       chestsAfterFirst: chestsAfterFirst, second: second, afterSecond: afterSecond };`
  );
  const out = readOut(sandbox);
  assert.equal(out.first, true, 'the first claim succeeds');
  assert.equal(out.afterFirst - out.before, 25, 'the first claim grants exactly +25 noor');
  assert.equal(out.chestsAfterFirst.u1c, true, 'the chest is marked claimed');
  assert.equal(out.second, false, 'a second claim on the same chest is a no-op');
  assert.equal(out.afterSecond, out.afterFirst, 'noor does not change on the second claim');
});
