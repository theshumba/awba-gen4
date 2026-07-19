/* ============================================================================================
   sound-haptics.test.js  ·  Awba Gen-4 v2.4 — the haptic ack riding AW.sound (owner-approved)
   --------------------------------------------------------------------------------------------
   One tiny 8ms navigator.vibrate tick lands WITH the 'correct' cue — and nowhere else. The law
   here is mercy-shaped: an incorrect answer gets NOTHING (a buzz is a punishment), the meta cues
   ('complete'/'streak') stay audio-only, soundMuted is the one master "quiet" switch, and a
   platform without vibrate (iOS/desktop/headless) is a silent no-op. Driven through the ls-stub
   `extras` sandbox param with a spy navigator.
   ============================================================================================ */
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { makeLS, loadEngine } = require('./ls-stub');

function makeNav() {
  const calls = [];
  return { calls, navigator: { vibrate: function (ms) { calls.push(ms); return true; } } };
}

test('haptics: AW.sound("correct") fires ONE tiny 8ms vibrate tick', () => {
  const spy = makeNav();
  loadEngine(makeLS({}), `AW.sound('correct');`, { navigator: spy.navigator });
  assert.deepEqual(spy.calls, [8], 'exactly one 8ms tick at the correct answer');
});

test('haptics: incorrect gets NOTHING — never a punishment buzz (law 8)', () => {
  const spy = makeNav();
  loadEngine(makeLS({}), `AW.sound('incorrect');`, { navigator: spy.navigator });
  assert.deepEqual(spy.calls, [], 'an incorrect answer must never vibrate');
});

test('haptics: the meta cues (complete/streak) stay audio-only', () => {
  const spy = makeNav();
  loadEngine(makeLS({}), `AW.sound('complete'); AW.sound('streak');`, { navigator: spy.navigator });
  assert.deepEqual(spy.calls, [], 'haptics ride answer feedback only');
});

test('haptics: soundMuted is the master quiet switch — muted means no tick either', () => {
  const spy = makeNav();
  loadEngine(
    makeLS({ awba_prefs: JSON.stringify({ schemaVersion: 1, soundMuted: true, motion: 'system' }) }),
    `AW.sound('correct');`,
    { navigator: spy.navigator }
  );
  assert.deepEqual(spy.calls, [], 'the mute gate sits above the haptic tick');
});

test('haptics: no navigator at all (headless / no support) — AW.sound stays a clean no-op', () => {
  const sandbox = loadEngine(makeLS({}), `
    var threw = false;
    try { AW.sound('correct'); } catch (e) { threw = true; }
    globalThis.__out = threw;`);
  assert.equal(sandbox.__out, false, 'feature-detection keeps the call silent where vibrate is absent');
});

test('haptics: a navigator whose vibrate throws is swallowed — never surfaces to the learner', () => {
  const sandbox = loadEngine(makeLS({}), `
    var threw = false;
    try { AW.sound('correct'); } catch (e) { threw = true; }
    globalThis.__out = threw;`,
    { navigator: { vibrate: function () { throw new Error('blocked'); } } });
  assert.equal(sandbox.__out, false, 'the tick has its own try/catch');
});
