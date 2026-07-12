/* ============================================================================================
   state-storage.test.js  ·  Awba Gen-4 — migration losslessness / idempotency / prefs isolation
   --------------------------------------------------------------------------------------------
   Proves FND-05 (versioned awba_state blob + lossless Gen-3 migration) and FND-06 (awba_prefs
   isolated from progress) against the real shared/awba-engine.js, headlessly, via node --test.
   Seeds the exact legacy key names from 02-RESEARCH.md's Runtime State Inventory: awba_noor,
   awba_returns, awba_lastDay, awba_days, awba_stars, awba_chest_u1c.

   Written RED (Task 1, Wave 0): shared/awba-engine.js does not exist yet, so `loadEngine` throws
   on the missing file and every test below fails — that failure IS the RED signal (D-30/TDD).
   ============================================================================================ */
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { makeLS, loadEngine, readOut } = require('./ls-stub');

function pad(n) {
  return String(n).padStart(2, '0');
}
function ymd(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}

/* ---------- (1) lossless migration — every legacy field lands intact ---------- */

test('migration: legacy awba_* keys land losslessly in awba_state (all fields)', () => {
  const ls = makeLS({
    awba_noor: JSON.stringify(120),
    awba_returns: JSON.stringify(3),
    awba_lastDay: JSON.stringify('Sat Jul 11 2026'),
    awba_days: JSON.stringify(['Fri Jul 10 2026', 'Sat Jul 11 2026']),
    awba_stars: JSON.stringify({ u1m1: 3, u1m2: 2 }),
    awba_chest_u1c: JSON.stringify(true),
  });
  const sandbox = loadEngine(
    ls,
    `globalThis.__out = {
      noor: AW.S.get('noor', 0),
      returns: AW.S.get('returns', 0),
      stars: AW.S.get('stars', {}),
      chests: AW.S.get('chests', {}),
      lastDay: AW.S.get('lastDay', null),
      days: AW.S.get('days', []),
    };`
  );
  const out = readOut(sandbox);
  assert.equal(out.noor, 120);
  assert.equal(out.returns, 3);
  assert.deepEqual(out.stars, { u1m1: 3, u1m2: 2 });
  assert.deepEqual(out.chests, { u1c: true });
  assert.equal(out.lastDay, '2026-07-11');
  assert.deepEqual(out.days, ['2026-07-10', '2026-07-11']);
});

/* ---------- (2) non-destructive + idempotent ---------- */

test('migration: non-destructive (legacy keys survive) and idempotent (re-run is a no-op)', () => {
  const validDay = new Date(Date.now() - 86400000).toDateString();
  const seed = {
    awba_noor: JSON.stringify(120),
    awba_returns: JSON.stringify(3),
    awba_lastDay: JSON.stringify(validDay),
    awba_days: JSON.stringify([validDay]),
    awba_stars: JSON.stringify({ u1m1: 3, u1m2: 2 }),
    awba_chest_u1c: JSON.stringify(true),
  };
  const ls = makeLS(seed);
  const probe = `globalThis.__out = {
    noor: AW.S.get('noor', 0), returns: AW.S.get('returns', 0),
    stars: AW.S.get('stars', {}), chests: AW.S.get('chests', {}),
    lastDay: AW.S.get('lastDay', null), days: AW.S.get('days', []),
  };`;

  const first = loadEngine(ls, probe);
  const dumpAfterFirst = ls._dump();
  // D-15: legacy keys are read but NEVER deleted
  assert.ok('awba_noor' in dumpAfterFirst);
  assert.ok('awba_returns' in dumpAfterFirst);
  assert.ok('awba_lastDay' in dumpAfterFirst);
  assert.ok('awba_days' in dumpAfterFirst);
  assert.ok('awba_stars' in dumpAfterFirst);
  assert.ok('awba_chest_u1c' in dumpAfterFirst);
  assert.ok('awba_state' in dumpAfterFirst);
  const blobAfterFirst = dumpAfterFirst.awba_state;

  // Simulate a second page load against the SAME localStorage — must be a no-op.
  const second = loadEngine(ls, probe);
  const dumpAfterSecond = ls._dump();
  assert.equal(dumpAfterSecond.awba_state, blobAfterFirst);
  assert.deepEqual(readOut(second), readOut(first));
});

/* ---------- (3) local-date exactness — no toISOString off-by-one ---------- */

test('migration: awba_lastDay converts via local date parts (no toISOString off-by-one)', () => {
  const ls = makeLS({ awba_lastDay: JSON.stringify('Sat Jul 11 2026') });
  const sandbox = loadEngine(ls, `globalThis.__out = AW.S.get('lastDay', null);`);
  assert.equal(readOut(sandbox), '2026-07-11');
});

/* ---------- (4) corrupted-value tolerance ---------- */

test('migration: corrupted awba_days entry and non-JSON awba_stars are tolerated (no throw)', () => {
  const validDay = new Date(Date.now() - 86400000).toDateString();
  const ls = makeLS({
    awba_noor: JSON.stringify(50),
    awba_returns: JSON.stringify(1),
    awba_lastDay: JSON.stringify(validDay),
    awba_days: JSON.stringify(['not-a-real-date', validDay]),
    awba_stars: '{not valid json',
  });

  let sandbox;
  assert.doesNotThrow(() => {
    sandbox = loadEngine(
      ls,
      `globalThis.__out = {
        noor: AW.S.get('noor', 0), returns: AW.S.get('returns', 0),
        stars: AW.S.get('stars', {}), days: AW.S.get('days', []),
      };`
    );
  });
  const out = readOut(sandbox);
  assert.equal(out.noor, 50);
  assert.equal(out.returns, 1);
  assert.deepEqual(out.stars, {}); // non-JSON stars field dropped, falls back to default
  assert.equal(out.days.length, 1); // garbage date filtered, valid one kept
});

/* ---------- (5) prefs isolation from progress state ---------- */

test('AW.prefs isolates soundMuted/motion under awba_prefs, independent of awba_state', () => {
  const ls = makeLS({});
  const sandbox = loadEngine(
    ls,
    `AW.prefs.set('soundMuted', true);
     AW.prefs.set('motion', 'reduce');
     globalThis.__out = {
       prefs: { soundMuted: AW.prefs.get('soundMuted', false), motion: AW.prefs.get('motion', 'system') },
       stateSoundMuted: AW.S.get('soundMuted', undefined),
       stateMotion: AW.S.get('motion', undefined),
     };`
  );
  const dump = ls._dump();
  assert.ok('awba_prefs' in dump, 'awba_prefs key must exist');
  const out = readOut(sandbox);
  assert.equal(out.prefs.soundMuted, true);
  assert.equal(out.prefs.motion, 'reduce');
  assert.equal(out.stateSoundMuted, undefined);
  assert.equal(out.stateMotion, undefined);
  if (dump.awba_state) {
    const stateBlob = JSON.parse(dump.awba_state);
    assert.ok(!('soundMuted' in stateBlob), 'soundMuted must never appear in the progress blob');
    assert.ok(!('motion' in stateBlob), 'motion must never appear in the progress blob');
  }
});

// exported only so state-helpers.test.js can reuse the exact same local-date helper if desired
module.exports = { ymd };
