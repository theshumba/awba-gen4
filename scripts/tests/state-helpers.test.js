/* ============================================================================================
   state-helpers.test.js  ·  Awba Gen-4 — touchDay / greetMode / weekCal / deriveNodeState
   --------------------------------------------------------------------------------------------
   Pins Gen-3 semantics (D-19) for the pure, DOM-free state helpers (D-18) against the real
   shared/awba-engine.js, headlessly, via node --test.

   Written RED (Task 1, Wave 0): shared/awba-engine.js does not exist yet, so `loadEngine` throws
   on the missing file and every test below fails — that failure IS the RED signal (D-30/TDD).
   ============================================================================================ */
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { makeLS, loadEngine } = require('./ls-stub');
const { ymd } = require('./date-helpers');

function seedState(overrides) {
  return Object.assign(
    { schemaVersion: 1, noor: 0, returns: 0, lastDay: null, days: [], stars: {}, chests: {} },
    overrides
  );
}

/* ---------- touchDay ---------- */

test('touchDay: bumps returns and appends today when lastDay is yesterday', () => {
  const ls = makeLS({ awba_state: JSON.stringify(seedState({ returns: 3, lastDay: ymd(-1), days: [ymd(-1)] })) });
  const sandbox = loadEngine(
    ls,
    `const ret = AW.touchDay(); globalThis.__out = { ret, after: AW.state() };`
  );
  const out = sandbox.__out;
  assert.equal(out.ret, 4);
  assert.equal(out.after.returns, 4);
  assert.equal(out.after.lastDay, ymd(0));
  assert.ok(out.after.days.includes(ymd(0)));
  assert.equal(out.after.days.length, 2);
});

test('touchDay: same-day second call is a no-op', () => {
  const today = ymd(0);
  const ls = makeLS({ awba_state: JSON.stringify(seedState({ returns: 5, lastDay: today, days: [today] })) });
  const sandbox = loadEngine(ls, `AW.touchDay(); AW.touchDay(); globalThis.__out = AW.state();`);
  assert.equal(sandbox.__out.returns, 5);
  assert.deepEqual(sandbox.__out.days, [today]);
});

test('touchDay: seeds returns at 1 on first-ever visit (lastDay null)', () => {
  const ls = makeLS({ awba_state: JSON.stringify(seedState()) });
  const sandbox = loadEngine(ls, `const ret = AW.touchDay(); globalThis.__out = { ret, after: AW.state() };`);
  assert.equal(sandbox.__out.ret, 1);
  assert.equal(sandbox.__out.after.returns, 1);
  assert.equal(sandbox.__out.after.lastDay, ymd(0));
});

test('touchDay: days caps at the most recent 90 entries', () => {
  const days = [];
  for (let i = 90; i >= 1; i--) days.push(ymd(-i)); // 90 entries, oldest..newest, none is today
  const ls = makeLS({ awba_state: JSON.stringify(seedState({ returns: 10, lastDay: ymd(-1), days })) });
  const sandbox = loadEngine(ls, `AW.touchDay(); globalThis.__out = AW.state();`);
  const out = sandbox.__out;
  assert.equal(out.days.length, 90);
  assert.ok(out.days.includes(ymd(0)), 'today must be present');
  assert.ok(!out.days.includes(ymd(-90)), 'oldest entry must be dropped by slice(-90)');
});

/* ---------- greetMode ---------- */

test('greetMode: first / streak / returning', () => {
  let ls = makeLS({ awba_state: JSON.stringify(seedState({ lastDay: null })) });
  let sandbox = loadEngine(ls, `globalThis.__out = AW.greetMode();`);
  assert.equal(sandbox.__out, 'first');

  ls = makeLS({ awba_state: JSON.stringify(seedState({ returns: 1, lastDay: ymd(-1), days: [ymd(-1)] })) });
  sandbox = loadEngine(ls, `globalThis.__out = AW.greetMode();`);
  assert.equal(sandbox.__out, 'streak');

  ls = makeLS({ awba_state: JSON.stringify(seedState({ returns: 1, lastDay: ymd(-5), days: [ymd(-5)] })) });
  sandbox = loadEngine(ls, `globalThis.__out = AW.greetMode();`);
  assert.equal(sandbox.__out, 'returning');
});

/* ---------- weekCal ---------- */

test('weekCal: returns structured DOM-free day data, membership via YYYY-MM-DD `days`', () => {
  const today = ymd(0);
  const ls = makeLS({ awba_state: JSON.stringify(seedState({ returns: 1, lastDay: today, days: [today] })) });
  const sandbox = loadEngine(ls, `globalThis.__out = AW.weekCal();`);
  const week = sandbox.__out;
  assert.ok(Array.isArray(week), 'weekCal must return structured data (array), not an HTML string (D-18)');
  assert.equal(week.length, 7);
  week.forEach((entry) => {
    assert.ok(entry && typeof entry === 'object');
    assert.ok('label' in entry);
    assert.ok('on' in entry);
  });
  const dow = (new Date().getDay() + 6) % 7; // Mon=0..Sun=6, today's position in the Mon-Su week
  assert.equal(week[dow].on, true, "today's slot must be on since it is in `days`");
  const otherIdx = (dow + 3) % 7; // guaranteed different index, not seeded into `days`
  assert.equal(week[otherIdx].on, false);
});

/* ---------- deriveNodeState ---------- */

test('deriveNodeState: locked/active/done branching is strictly linear across units', () => {
  const flat = [{ id: 'u1m1' }, { id: 'u1m2' }, { id: 'u1r' }, { id: 'u1c', chest: true }, { id: 'u2m1' }];
  const progress = { stars: { u1m1: 2 }, chests: {} };
  const ls = makeLS({});
  const sandbox = loadEngine(
    ls,
    `globalThis.__out = AW.deriveNodeState(${JSON.stringify(flat)}, ${JSON.stringify(progress)});`
  );
  const states = Object.fromEntries(sandbox.__out.map((n) => [n.id, n.state]));
  assert.equal(states.u1m1, 'done');
  assert.equal(states.u1m2, 'active');
  assert.equal(states.u1r, 'locked');
  assert.equal(states.u1c, 'locked');
  assert.equal(states.u2m1, 'locked');
});

test('deriveNodeState: first node is always active with no priors', () => {
  const flat = [{ id: 'u1m1' }, { id: 'u1m2' }];
  const progress = { stars: {}, chests: {} };
  const ls = makeLS({});
  const sandbox = loadEngine(
    ls,
    `globalThis.__out = AW.deriveNodeState(${JSON.stringify(flat)}, ${JSON.stringify(progress)});`
  );
  const states = Object.fromEntries(sandbox.__out.map((n) => [n.id, n.state]));
  assert.equal(states.u1m1, 'active');
  assert.equal(states.u1m2, 'locked');
});

test('deriveNodeState: chest is available only when the preceding node has stars and unopened, done when opened', () => {
  const flat = [{ id: 'a' }, { id: 'b', chest: true }];

  let ls = makeLS({});
  let sandbox = loadEngine(
    ls,
    `globalThis.__out = AW.deriveNodeState(${JSON.stringify(flat)}, ${JSON.stringify({ stars: { a: 3 }, chests: {} })});`
  );
  let states = Object.fromEntries(sandbox.__out.map((n) => [n.id, n.state]));
  assert.equal(states.a, 'done');
  assert.equal(states.b, 'available');

  ls = makeLS({});
  sandbox = loadEngine(
    ls,
    `globalThis.__out = AW.deriveNodeState(${JSON.stringify(flat)}, ${JSON.stringify({ stars: { a: 3 }, chests: { b: true } })});`
  );
  states = Object.fromEntries(sandbox.__out.map((n) => [n.id, n.state]));
  assert.equal(states.b, 'done');

  ls = makeLS({});
  sandbox = loadEngine(
    ls,
    `globalThis.__out = AW.deriveNodeState(${JSON.stringify(flat)}, ${JSON.stringify({ stars: {}, chests: {} })});`
  );
  states = Object.fromEntries(sandbox.__out.map((n) => [n.id, n.state]));
  assert.equal(states.a, 'active');
  assert.equal(states.b, 'locked');
});
