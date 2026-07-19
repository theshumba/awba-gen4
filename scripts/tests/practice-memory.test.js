/* ============================================================================================
   practice-memory.test.js  ·  Awba Gen-4 v2.4 — the gentle memory loop (AW.practiceMemory)
   --------------------------------------------------------------------------------------------
   "Life after the Ring": when practice is OPENED, the set that gathers is the one whose
   questions have rested longest — a simple, deterministic, on-device spaced-repetition rhythm.
   Pinned here headlessly:
     · key/dayStamp determinism (local-day granularity — no clocks in ordering paths)
     · order(): never-seen first, then oldest last-seen; ties held in the seeded shuffle's own
       order via an EXPLICIT tie-break (never engine-sort-internals); same inputs → same output
     · mark(): stamps walked items through the ONE 'seen' map via AW.S; corrupted maps tolerated
     · the rhythm is device-local — exportToken never carries 'seen'; AW.S.reset releases it
     · session.html wiring: guard includes practiceMemory; order feeds the set; mark rides onDone
     · AW.practiceRun stays byte-write-free (the seam sits ABOVE it — the existing no-writes pin
       keeps its full force) and the storage-API literal count stays 13
   ============================================================================================ */
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { makeLS, loadEngine, readOut } = require('./ls-stub');

const ROOT = path.join(__dirname, '..', '..');
const ENGINE_SRC = fs.readFileSync(path.join(ROOT, 'shared', 'awba-engine.js'), 'utf8');
const SESSION_SRC = fs.readFileSync(path.join(ROOT, 'practice', 'session.html'), 'utf8');

function blob(over) {
  return JSON.stringify(Object.assign(
    { schemaVersion: 1, noor: 0, returns: 0, lastDay: null, days: [], stars: {}, chests: {} },
    over || {}
  ));
}

/* the shipped mulberry32, replicated for deterministic test rnd streams */
function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    var t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

const ITEMS = [
  { lesson: 'u1m1', idx: 4 }, { lesson: 'u1m1', idx: 6 }, { lesson: 'u1m2', idx: 2 },
  { lesson: 'u1m2', idx: 7 }, { lesson: 'u1m3', idx: 1 }, { lesson: 'u1m4', idx: 3 },
];

test('memory: key is the stable lesson:idx identity', () => {
  const sandbox = loadEngine(makeLS({}), `globalThis.__out = AW.practiceMemory.key({ lesson: 'u1m2', idx: 7 });`);
  assert.equal(sandbox.__out, 'u1m2:7');
});

test('memory: dayStamp is local-day granular and deterministic within a day', () => {
  const sandbox = loadEngine(makeLS({}), `
    var pm = AW.practiceMemory;
    globalThis.__out = {
      morning: pm.dayStamp(new Date(2026, 6, 19, 0, 0, 1)),
      night:   pm.dayStamp(new Date(2026, 6, 19, 23, 59, 59)),
      next:    pm.dayStamp(new Date(2026, 6, 20, 0, 0, 1)),
    };`);
  const out = readOut(sandbox);
  assert.equal(out.morning, out.night, 'one stamp per local day — the rhythm has no clock');
  assert.equal(out.next, out.morning + 1, 'the next local day is exactly one step on');
});

test('memory: order() surfaces never-seen first, then the longest-rested', () => {
  const sandbox = loadEngine(makeLS({}), `
    var items = ${JSON.stringify(ITEMS)};
    var seen = { 'u1m1:4': 20659, 'u1m2:2': 20655, 'u1m3:1': 20657 };   // three seen, three never
    var rnd = (${mulberry32.toString()})(42);
    globalThis.__out = AW.practiceMemory.order(items, seen, rnd).map(AW.practiceMemory.key);`);
  const out = readOut(sandbox);
  assert.deepEqual(out.slice(3).sort(), ['u1m1:4', 'u1m2:2', 'u1m3:1'].sort(), 'the three seen items sink behind every never-seen one');
  assert.deepEqual(out.slice(0, 3).sort(), ['u1m1:6', 'u1m2:7', 'u1m4:3'].sort(), 'the three never-seen items surface');
  assert.deepEqual(out.slice(3), ['u1m2:2', 'u1m3:1', 'u1m1:4'], 'seen items order oldest-rest first (20655 < 20657 < 20659)');
});

test('memory: order() is fully deterministic — same items, same rhythm, same seed → same set', () => {
  const probe = `
    var items = ${JSON.stringify(ITEMS)};
    var seen = { 'u1m1:4': 20659 };
    var m32 = ${mulberry32.toString()};
    var a = AW.practiceMemory.order(items, seen, m32(7)).map(AW.practiceMemory.key);
    var b = AW.practiceMemory.order(items, seen, m32(7)).map(AW.practiceMemory.key);
    globalThis.__out = { a: a, b: b };`;
  const out = readOut(loadEngine(makeLS({}), probe));
  assert.deepEqual(out.a, out.b, 'byte-identical runs — no hidden entropy in the ordering path');
});

test('memory: a different seed varies only WITHIN the rest bands (variety without breaking the rhythm)', () => {
  const probe = `
    var items = ${JSON.stringify(ITEMS)};
    var seen = { 'u1m1:4': 20659, 'u1m2:2': 20655, 'u1m3:1': 20657 };
    var m32 = ${mulberry32.toString()};
    var a = AW.practiceMemory.order(items, seen, m32(1)).map(AW.practiceMemory.key);
    var b = AW.practiceMemory.order(items, seen, m32(2)).map(AW.practiceMemory.key);
    globalThis.__out = { a: a, b: b };`;
  const out = readOut(loadEngine(makeLS({}), probe));
  assert.deepEqual(out.a.slice(0, 3).sort(), out.b.slice(0, 3).sort(), 'the never-seen band holds its members under any seed');
  assert.deepEqual(out.a.slice(3), out.b.slice(3), 'distinct rest days order identically under any seed');
});

test('memory: order() tolerates a corrupted seen map (array/garbage → everything is "resting")', () => {
  const probe = `
    var items = ${JSON.stringify(ITEMS)};
    var m32 = ${mulberry32.toString()};
    var arr = AW.practiceMemory.order(items, [1, 2, 3], m32(9)).map(AW.practiceMemory.key);
    var garb = AW.practiceMemory.order(items, { 'u1m1:4': 'soon' }, m32(9)).map(AW.practiceMemory.key);
    globalThis.__out = { n: arr.length, same: JSON.stringify(arr) === JSON.stringify(garb) };`;
  const out = readOut(loadEngine(makeLS({}), probe));
  assert.equal(out.n, 6, 'never a throw, never a dropped item');
  assert.equal(out.same, true, "a garbage stamp coerces to 0 — the same as never-seen");
});

test('memory: mark() stamps the walked items through AW.S and later sets reach past them', () => {
  const sandbox = loadEngine(makeLS({ awba_state: blob() }), `
    var pm = AW.practiceMemory;
    var items = ${JSON.stringify(ITEMS)};
    pm.mark(items.slice(0, 2), new Date(2026, 6, 19));         // today's set walked two items
    var m32 = ${mulberry32.toString()};
    var next = pm.order(items, AW.S.get('seen', {}), m32(3)).map(pm.key);
    globalThis.__out = {
      seen: AW.S.get('seen', {}),
      lastTwo: next.slice(4).sort(),
    };`);
  const out = readOut(sandbox);
  assert.deepEqual(out.seen, { 'u1m1:4': 20653, 'u1m1:6': 20653 }, 'the two walked keys carry the local day stamp');
  assert.deepEqual(out.lastTwo, ['u1m1:4', 'u1m1:6'], 'the freshly-walked pair rests at the back of the next set');
});

test('memory: mark() heals a corrupted stored map instead of throwing', () => {
  const sandbox = loadEngine(makeLS({ awba_state: blob({ seen: 'garbage' }) }), `
    AW.practiceMemory.mark([{ lesson: 'u1m1', idx: 4 }], new Date(2026, 6, 19));
    globalThis.__out = AW.S.get('seen', {});`);
  assert.deepEqual(readOut(sandbox), { 'u1m1:4': 20653 });
});

test('memory: the rhythm is device-local — exportToken never carries seen; reset releases it', () => {
  const sandbox = loadEngine(
    makeLS({ awba_state: blob({ noor: 9, seen: { 'u1m1:4': 20653 } }) }), `
    var token = AW.S.exportToken();
    AW.S.reset();
    globalThis.__out = { token: token, after: AW.S.get('seen', null) };`);
  const out = readOut(sandbox);
  const payload = JSON.parse(Buffer.from(out.token.split('.')[1], 'base64').toString('utf8'));
  assert.equal('seen' in payload, false, 'the rhythm belongs to the device\'s own hands');
  assert.equal(payload.noor, 9, 'real progress still travels');
  assert.equal(out.after, null, 'a fresh start rests everything again');
});

test('memory: session.html wiring — guard, order into the set, mark on completion only', () => {
  assert.ok(/!AW\.practiceMemory/.test(SESSION_SRC), 'the engine-freshness guard covers the new seam');
  assert.ok(/AW\.practiceMemory\.order\(eligible, AW\.S\.get\('seen', \{\}\), rnd\)/.test(SESSION_SRC),
    'the sampled set rides the memory ordering');
  assert.ok(/AW\.practiceMemory\.mark\(items\);/.test(SESSION_SRC), 'the walked set is stamped');
  const markAt = SESSION_SRC.indexOf('AW.practiceMemory.mark(items)');
  const onDoneAt = SESSION_SRC.indexOf('onDone: function (res)');
  assert.ok(onDoneAt >= 0 && markAt > onDoneAt, 'the stamp rides completion (onDone), never the set\'s start');
});

test('memory: the seam sits ABOVE practiceRun (its no-writes pin keeps full force) and the literal count stays 13', () => {
  assert.ok(ENGINE_SRC.indexOf('AW.practiceMemory = {') < ENGINE_SRC.indexOf('AW.practiceRun = function'),
    'practiceRun must stay the last definition so its slice-to-EOF write pin covers it alone');
  const matches = ENGINE_SRC.match(/localStorage/g) || [];
  assert.equal(matches.length, 13);
});
