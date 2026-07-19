/* ============================================================================================
   state-multitab.test.js  ·  Awba Gen-4 v2.4 — the multi-tab 'storage' invalidation seam
   --------------------------------------------------------------------------------------------
   Two open tabs share one on-disk blob; the engine's window 'storage' listeners (one inside
   AW.S, one inside AW.prefs) drop the stale in-memory copy when a SIBLING tab writes our keys,
   so the next read/write lazy-reloads from disk through the existing load() path. These suites
   drive the listeners by hand through a fake `window` (ls-stub loadEngine `extras`), proving:
     (1) a sibling awba_state write is visible after the event fires
     (2) an unrelated key's event never invalidates (the copy is kept — no churn)
     (3) a full clear (e.key === null) resolves to defaults on next read
     (4) a sibling write of a RECOGNISED blob lifts a stale memFallback (and writes persist again)
     (5) an unclaimed runner tally merges onto the sibling's write at claim time (never clobbers)
     (6) awba_prefs mirrors the same invalidation
     (7) the engine's storage-API literal count is UNCHANGED at 13 (invalidation only — the
         reload rides the existing load()/persist() seams, no new raw storage touch)
   ============================================================================================ */
'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { makeLS, loadEngine, readOut } = require('./ls-stub');

const ENGINE_PATH = path.join(__dirname, '..', '..', 'shared', 'awba-engine.js');
const ENGINE_SRC = fs.readFileSync(ENGINE_PATH, 'utf8');

/* a fake window whose addEventListener captures the engine's 'storage' listeners so the suite
   can fire them exactly as a real sibling-tab write would (the event never fires in the writing
   tab itself — the browser contract this seam is built on). */
function makeWindow() {
  const handlers = [];
  return {
    handlers,
    addEventListener: function (type, fn) { if (type === 'storage') handlers.push(fn); },
    fire: function (key) { handlers.forEach(function (fn) { fn({ key: key }); }); },
  };
}

function stateBlob(over) {
  return JSON.stringify(Object.assign(
    { schemaVersion: 1, noor: 10, returns: 2, lastDay: null, days: [], stars: {}, chests: {} },
    over || {}
  ));
}

test('multi-tab: the engine registers storage listeners only when a window exists (2: state + prefs)', () => {
  const win = makeWindow();
  loadEngine(makeLS({}), '', { window: win });
  assert.equal(win.handlers.length, 2, 'one listener inside AW.S, one inside AW.prefs');
});

test('multi-tab (1): a sibling tab\'s awba_state write is visible after the storage event', () => {
  const win = makeWindow();
  const ls = makeLS({ awba_state: stateBlob({ noor: 10 }) });
  const sandbox = loadEngine(ls, `globalThis.__probe = {
    before: AW.S.get('noor', 0),
    read: function () { return AW.S.get('noor', 0); },
  };`, { window: win });
  assert.equal(sandbox.__probe.before, 10, 'the seeded blob loads normally');
  ls.setItem('awba_state', stateBlob({ noor: 99, returns: 5 }));
  assert.equal(sandbox.__probe.read(), 10, 'before the event fires, the in-memory copy is (correctly) still served');
  win.fire('awba_state');
  assert.equal(sandbox.__probe.read(), 99, 'after the event, the next read reloads the sibling\'s write from disk');
});

test('multi-tab (2): an unrelated key\'s storage event never invalidates the in-memory copy', () => {
  const win = makeWindow();
  const ls = makeLS({ awba_state: stateBlob({ noor: 10 }) });
  const sandbox = loadEngine(ls, `globalThis.__probe = {
    before: AW.S.get('noor', 0),
    read: function () { return AW.S.get('noor', 0); },
  };`, { window: win });
  ls.setItem('awba_state', stateBlob({ noor: 99 }));
  win.fire('some_other_key');
  assert.equal(sandbox.__probe.read(), 10, 'a foreign key\'s event leaves the copy untouched (no reload churn)');
});

test('multi-tab (3): a full clear (e.key === null) resolves to defaults on the next read', () => {
  const win = makeWindow();
  const ls = makeLS({ awba_state: stateBlob({ noor: 10 }) });
  const sandbox = loadEngine(ls, `globalThis.__probe = {
    before: AW.S.get('noor', 0),
    read: function () { return AW.S.get('noor', 0); },
  };`, { window: win });
  ls.removeItem('awba_state');           // the sibling tab cleared storage
  win.fire(null);                        // clear() fires with key null
  assert.equal(sandbox.__probe.read(), 0, 'the next read walks the full load() resolution to a fresh default');
});

test('multi-tab (4): a sibling\'s RECOGNISED blob lifts a stale memFallback and writes persist again', () => {
  const win = makeWindow();
  // seed a FUTURE-schema blob → this build works from an un-persisted in-memory copy (W1)
  const ls = makeLS({ awba_state: JSON.stringify({ schemaVersion: 9, noor: 55, someFutureField: true }) });
  const sandbox = loadEngine(ls, `globalThis.__probe = {
    fallbackBefore: (AW.S.get('noor', 0), AW.S.isFallback()),
    read: function () { return AW.S.get('noor', 0); },
    fallback: function () { return AW.S.isFallback(); },
    write: function () { AW.S.set('noor', 123); },
  };`, { window: win });
  assert.equal(sandbox.__probe.fallbackBefore, true, 'the future-schema blob trips memFallback');
  ls.setItem('awba_state', stateBlob({ noor: 77 }));   // the newer-build tab resolved it to a v1 blob
  win.fire('awba_state');
  assert.equal(sandbox.__probe.read(), 77, 'the recognised sibling blob loads');
  assert.equal(sandbox.__probe.fallback(), false, 'memFallback is re-derived by the reload — lifted');
  sandbox.__probe.write();
  assert.equal(JSON.parse(ls.getItem('awba_state')).noor, 123, 'writes persist again after the lift');
});

test('multi-tab (4b): a sibling write that is STILL foreign re-trips memFallback before any write', () => {
  const win = makeWindow();
  const ls = makeLS({ awba_state: stateBlob({ noor: 10 }) });
  const sandbox = loadEngine(ls, `globalThis.__probe = {
    before: AW.S.get('noor', 0),
    write: function () { AW.S.set('noor', 123); },
    fallback: function () { return AW.S.isFallback(); },
  };`, { window: win });
  const foreign = JSON.stringify({ schemaVersion: 9, noor: 55 });
  ls.setItem('awba_state', foreign);     // a NEWER build's tab wrote a future-schema blob
  win.fire('awba_state');
  sandbox.__probe.write();               // this older build's write must not clobber it
  assert.equal(sandbox.__probe.fallback(), true, 'the reload re-trips memFallback before the write');
  assert.equal(ls.getItem('awba_state'), foreign, 'the future-schema blob survives on disk byte-for-byte');
});

test('multi-tab (5): an unclaimed runner tally MERGES onto the sibling\'s write at claim time', () => {
  const win = makeWindow();
  const ls = makeLS({ awba_state: stateBlob({ noor: 10 }) });
  const sandbox = loadEngine(ls, `globalThis.__probe = {
    // the runner boots: reads state, then holds its session tallies in ITS OWN closure
    before: AW.S.get('noor', 0),
    claim: AW._noorClaimer(),
    read: function () { return AW.S.get('noor', 0); },
  };`, { window: win });
  // meanwhile a sibling tab finishes its own lesson: +40 noor lands on disk
  ls.setItem('awba_state', stateBlob({ noor: 50 }));
  win.fire('awba_state');
  // now THIS tab's runner claims its unclaimed +36: it must add onto 50, never onto the stale 10
  sandbox.__probe.claim(36);
  assert.equal(sandbox.__probe.read(), 86, 'claim merges onto the sibling\'s write (50+36), never clobbers back to 46');
});

test('multi-tab (6): awba_prefs mirrors the invalidation', () => {
  const win = makeWindow();
  const ls = makeLS({ awba_prefs: JSON.stringify({ schemaVersion: 1, soundMuted: false, motion: 'system' }) });
  const sandbox = loadEngine(ls, `globalThis.__probe = {
    before: AW.prefs.get('soundMuted', false),
    read: function () { return AW.prefs.get('soundMuted', false); },
  };`, { window: win });
  assert.equal(sandbox.__probe.before, false);
  ls.setItem('awba_prefs', JSON.stringify({ schemaVersion: 1, soundMuted: true, motion: 'system' }));
  win.fire('awba_prefs');
  assert.equal(sandbox.__probe.read(), true, 'the sibling\'s mute lands on the next prefs read');
});

test('multi-tab (7): the engine\'s storage-API literal count is UNCHANGED at 13 (invalidation only)', () => {
  const matches = ENGINE_SRC.match(/localStorage/g) || [];
  assert.equal(matches.length, 13,
    'the storage listeners must only drop the in-memory copy — the reload rides load()/persist(), never a new raw storage touch');
});
