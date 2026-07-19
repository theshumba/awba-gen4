/* ============================================================================================
   state-resume.test.js  ·  Awba Gen-4 v2.4 — lesson resume: the kept place (AW._resumeKeeper)
   --------------------------------------------------------------------------------------------
   "Leaving a lesson mid-way keeps your place." The seam is AW._resumeKeeper(lessonId, steps) —
   one 'resume' map in awba_state through AW.S only, carrying the FULL session tally so a resumed
   run continues with the exact numbers it left (star/combo/noor math untouched). Transient by
   design: cleared at the verdict, NEVER in the travel code (export whitelist + import clean-blob
   both pinned), gone on AW.S.reset. Reviews are deliberately NOT resumable.
   ============================================================================================ */
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { makeLS, loadEngine, readOut } = require('./ls-stub');

const ENGINE_SRC = fs.readFileSync(path.join(__dirname, '..', '..', 'shared', 'awba-engine.js'), 'utf8');

function blob(over) {
  return JSON.stringify(Object.assign(
    { schemaVersion: 1, noor: 0, returns: 0, lastDay: null, days: [], stars: {}, chests: {} },
    over || {}
  ));
}

/* ---------- the keeper round-trip ---------- */

test('resume: save → read round-trips the full session tally, keyed per lesson', () => {
  const sandbox = loadEngine(makeLS({ awba_state: blob() }), `
    var k = AW._resumeKeeper('u1m2', 9);
    k.save({ p: 4, si: 4, correct: 2, combo: 2, comboBest: 2, mistakes: 1, noorEarned: 24 });
    globalThis.__out = { back: k.read(), other: AW._resumeKeeper('u1m3', 9).read() };`);
  const out = readOut(sandbox);
  assert.deepEqual(out.back, { p: 4, si: 4, correct: 2, combo: 2, comboBest: 2, mistakes: 1, noorEarned: 24 });
  assert.equal(out.other, null, 'another lesson id reads no place');
});

test('resume: the kept place survives on disk (a closed tab is the whole point)', () => {
  const ls = makeLS({ awba_state: blob() });
  loadEngine(ls, `AW._resumeKeeper('u1m2', 9).save({ p: 3, si: 3, correct: 1, combo: 1, comboBest: 1, mistakes: 0, noorEarned: 12 });`);
  // a fresh "session" (new engine load over the same disk) still finds the place
  const sandbox = loadEngine(ls, `globalThis.__out = AW._resumeKeeper('u1m2', 9).read();`);
  assert.equal(readOut(sandbox).p, 3);
});

test('resume: p 0 (barely begun) and p >= steps (a re-cut lesson) are never offered', () => {
  const sandbox = loadEngine(makeLS({ awba_state: blob() }), `
    var k = AW._resumeKeeper('u1m2', 9);
    k.save({ p: 0, si: 0, correct: 0, combo: 0, comboBest: 0, mistakes: 0, noorEarned: 0 });
    var atZero = k.read();
    k.save({ p: 8, si: 8, correct: 0, combo: 0, comboBest: 0, mistakes: 0, noorEarned: 0 });
    var shrunk = AW._resumeKeeper('u1m2', 5).read();   // the lesson was re-cut to 5 beats
    globalThis.__out = { atZero: atZero, shrunk: shrunk };`);
  const out = readOut(sandbox);
  assert.equal(out.atZero, null, 'a place at the first beat is noise, not an offer');
  assert.equal(out.shrunk, null, 'an out-of-range place simply starts fresh');
});

test('resume: corrupted map/entry shapes read as no place — never a throw, never NaN', () => {
  const sandbox = loadEngine(
    makeLS({ awba_state: blob({ resume: { u1m2: 'garbage', u1m3: [1, 2], u1m4: { p: 'x' } } }) }), `
    globalThis.__out = {
      str: AW._resumeKeeper('u1m2', 9).read(),
      arr: AW._resumeKeeper('u1m3', 9).read(),
      nanP: AW._resumeKeeper('u1m4', 9).read(),
    };`);
  const out = readOut(sandbox);
  assert.equal(out.str, null);
  assert.equal(out.arr, null);
  assert.equal(out.nanP, null, "p:'x' coerces to 0 → below the p>=1 floor → no offer");
});

test('resume: crafted negative/absurd tallies are floored at 0 and si is capped at steps', () => {
  const sandbox = loadEngine(
    makeLS({ awba_state: blob({ resume: { u1m2: { p: 3, si: 99, correct: -5, combo: -1, comboBest: -2, mistakes: -9, noorEarned: -100 } } }) }), `
    globalThis.__out = AW._resumeKeeper('u1m2', 9).read();`);
  const out = readOut(sandbox);
  assert.deepEqual(out, { p: 3, si: 9, correct: 0, combo: 0, comboBest: 0, mistakes: 0, noorEarned: 0 },
    'a corrupted entry can never seed negatives/NaN into the session tallies');
});

test('resume: clear() releases only its own lesson\'s place', () => {
  const sandbox = loadEngine(makeLS({ awba_state: blob() }), `
    AW._resumeKeeper('u1m2', 9).save({ p: 2, si: 2, correct: 1, combo: 1, comboBest: 1, mistakes: 0, noorEarned: 12 });
    AW._resumeKeeper('u1m3', 9).save({ p: 5, si: 5, correct: 3, combo: 3, comboBest: 3, mistakes: 0, noorEarned: 36 });
    AW._resumeKeeper('u1m2', 9).clear();
    globalThis.__out = { gone: AW._resumeKeeper('u1m2', 9).read(), kept: AW._resumeKeeper('u1m3', 9).read() };`);
  const out = readOut(sandbox);
  assert.equal(out.gone, null);
  assert.equal(out.kept.p, 5, 'the sibling lesson\'s place is untouched');
});

/* ---------- transient by design: never in the travel code, gone on reset ---------- */

test('resume: exportToken NEVER carries the resume map (the explicit whitelist holds)', () => {
  const sandbox = loadEngine(
    makeLS({ awba_state: blob({ noor: 50, resume: { u1m2: { p: 3, si: 3, correct: 1, combo: 1, comboBest: 1, mistakes: 0, noorEarned: 12 } } }) }),
    `globalThis.__out = AW.S.exportToken();`);
  const token = sandbox.__out;
  assert.ok(typeof token === 'string' && token.indexOf('AWBA1.') === 0, 'a normal token mints');
  const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf8'));
  assert.equal('resume' in payload, false, 'the kept place is this device\'s own — it never travels');
  assert.equal(payload.noor, 50, 'real progress still travels');
});

test('resume: importToken drops a crafted resume field — the clean blob never carries it', () => {
  const crafted = { schemaVersion: 1, noor: 5, returns: 1, lastDay: null, days: [], stars: {}, chests: {},
    resume: { u1m2: { p: 3 } } };
  const b64 = Buffer.from(JSON.stringify(crafted), 'utf8').toString('base64');
  const sandbox = loadEngine(makeLS({}), `
    var sum = (function (str) {
      var h = 0x811c9dc5;
      for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
      return h.toString(36);
    })('${b64}');
    var res = AW.S.importToken('AWBA1.${b64}.' + sum);
    if (res.ok) res.apply();
    globalThis.__out = { ok: res.ok, resume: AW.S.get('resume', null), noor: AW.S.get('noor', 0) };`);
  const out = readOut(sandbox);
  assert.equal(out.ok, true, 'the token itself is valid');
  assert.equal(out.resume, null, 'the crafted resume field never lands');
  assert.equal(out.noor, 5);
});

test('resume: AW.S.reset releases every kept place (defaults carry none)', () => {
  const sandbox = loadEngine(
    makeLS({ awba_state: blob({ resume: { u1m2: { p: 3, si: 3, correct: 1, combo: 1, comboBest: 1, mistakes: 0, noorEarned: 12 } } }) }), `
    AW.S.reset();
    globalThis.__out = AW._resumeKeeper('u1m2', 9).read();`);
  assert.equal(readOut(sandbox), null);
});

/* ---------- the runner wiring + the frozen counts ---------- */

test('resume: AwbaLesson saves the place on beat renders and releases it at the verdict', () => {
  const lessonSlice = ENGINE_SRC.slice(ENGINE_SRC.indexOf('function AwbaLesson'), ENGINE_SRC.indexOf('function AwbaReview'));
  assert.ok(/var keeper = AW\._resumeKeeper\(cfg\.id, steps\);/.test(lessonSlice), 'the keeper is minted at init');
  assert.ok(/keeper\.save\(\{ p: pos, si: stepIndex/.test(lessonSlice), 'every beat render keeps the place');
  assert.ok(/keeper\.clear\(\);/.test(lessonSlice), 'the verdict releases it');
  assert.ok(/Carry on where you were/.test(lessonSlice), 'the opener offers the kept place');
  assert.ok(/Start from the beginning/.test(lessonSlice), 'and the fresh start beside it');
  assert.ok(/Begin, gently/.test(lessonSlice), 'with no kept place, the shipped single Begin still renders');
});

test('resume: the review runner has NO resume — the soft timer is the point of that room', () => {
  const reviewSlice = ENGINE_SRC.slice(ENGINE_SRC.indexOf('function AwbaReview'));
  assert.equal(/_resumeKeeper/.test(reviewSlice), false, 'reviews deliberately keep no place');
});

test('resume: the engine\'s storage-API literal count is UNCHANGED at 13 (the keeper rides AW.S)', () => {
  const matches = ENGINE_SRC.match(/localStorage/g) || [];
  assert.equal(matches.length, 13);
});
