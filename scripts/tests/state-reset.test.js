/* ============================================================================================
   state-reset.test.js  ·  Awba Gen-4 v2 — AW.S.reset() (Wave-A seam S2, More "Start over")
   --------------------------------------------------------------------------------------------
   Proves the Start-over storage operation against the real shared/awba-engine.js, headlessly,
   via node --test (zero deps — the ls-stub Map-backed localStorage, D-25). The contract (§8 / D.4):
     - rebuild awba_state to defaults, clearing noor/returns/lastDay/days/stars/chests,
     - PRESERVE ringSeed (law 10 — the maker's mark is minted once, never regenerated),
     - PRESERVE awba_prefs (a separate blob — settings/name/onboarding untouched),
     - persist a defaults blob so legacy re-migration never fires again (D-15 keys stay orphaned),
     - no-op the persist under memFallback (a newer-schema blob is never clobbered),
     - add NO new localStorage literal — the engine's storage-word count stays exactly 13.
   ============================================================================================ */
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { makeLS, loadEngine, readOut } = require('./ls-stub');

const ENGINE_PATH = path.join(__dirname, '..', '..', 'shared', 'awba-engine.js');
const ENGINE_SRC = fs.readFileSync(ENGINE_PATH, 'utf8');

/* ---------- (1) clears progress, preserves ringSeed AND awba_prefs, persists defaults ---------- */

test('S2: reset() clears progress to defaults, preserves ringSeed + awba_prefs, and persists a defaults blob', () => {
  const ls = makeLS({
    awba_state: JSON.stringify({
      schemaVersion: 1, noor: 120, returns: 5, lastDay: '2026-07-14',
      days: ['2026-07-13', '2026-07-14'], stars: { u1m1: 3, u1m2: 2 }, chests: { u1c: true },
      ringSeed: 424242,
    }),
    awba_prefs: JSON.stringify({
      schemaVersion: 1, soundMuted: true, motion: 'reduce',
      prayerTimes: { fajr: '05:00', dhuhr: '13:00', asr: '16:30', maghrib: '19:30', isha: '21:00' },
      skyMode: 'manual',
    }),
  });
  // reset() is the FIRST AW.S touch — proves the lazy load() captures the on-disk ringSeed.
  const sandbox = loadEngine(ls, `
    AW.S.reset();
    globalThis.__out = {
      isFn: typeof AW.S.reset === 'function',
      noor: AW.S.get('noor', -1),
      returns: AW.S.get('returns', -1),
      lastDay: AW.S.get('lastDay', 'x'),
      days: AW.S.get('days', ['x']),
      stars: AW.S.get('stars', { x: 1 }),
      chests: AW.S.get('chests', { x: 1 }),
      ringSeed: AW.ringSeed(),
      prefSound: AW.prefs.get('soundMuted', false),
      prefMotion: AW.prefs.get('motion', 'system'),
      disk: JSON.parse(localStorage.getItem('awba_state')),
      diskPrefs: JSON.parse(localStorage.getItem('awba_prefs')),
    };
  `);
  const out = readOut(sandbox);
  assert.equal(out.isFn, true, 'AW.S.reset must be a function');
  // progress cleared to defaults
  assert.equal(out.noor, 0);
  assert.equal(out.returns, 0);
  assert.equal(out.lastDay, null);
  assert.deepEqual(out.days, []);
  assert.deepEqual(out.stars, {});
  assert.deepEqual(out.chests, {});
  // identity preserved
  assert.equal(out.ringSeed, 424242, 'ringSeed (the maker\'s mark) must survive a reset — same fingerprint re-inks');
  // prefs (separate blob) untouched
  assert.equal(out.prefSound, true, 'awba_prefs.soundMuted must survive a reset');
  assert.equal(out.prefMotion, 'reduce', 'awba_prefs.motion must survive a reset');
  assert.equal(out.diskPrefs.soundMuted, true, 'the persisted awba_prefs blob is never touched by reset');
  // persisted a recognized defaults blob (schemaVersion CURRENT) → blocks legacy re-migration
  assert.equal(out.disk.schemaVersion, 1);
  assert.equal(out.disk.noor, 0);
  assert.equal(out.disk.returns, 0);
  assert.equal(out.disk.lastDay, null);
  assert.deepEqual(out.disk.days, []);
  assert.deepEqual(out.disk.stars, {});
  assert.deepEqual(out.disk.chests, {});
  assert.equal(out.disk.ringSeed, 424242, 'the persisted defaults blob carries the preserved ringSeed');
});

/* ---------- (2) legacy re-migration never fires after a reset (a recognized blob short-circuits it) ---------- */

test('S2: after reset(), stale Gen-3 legacy keys are NOT re-migrated (defaults blob short-circuits migrateFromLegacy)', () => {
  const ls = makeLS({
    // a live blob + orphaned legacy keys (never deleted, D-15)
    awba_state: JSON.stringify({
      schemaVersion: 1, noor: 90, returns: 4, lastDay: '2026-07-14', days: ['2026-07-14'],
      stars: { u1m1: 3 }, chests: {}, ringSeed: 7,
    }),
    awba_noor: JSON.stringify(999),
    awba_returns: JSON.stringify(88),
    awba_stars: JSON.stringify({ u4m3: 3 }),
  });
  const sandbox = loadEngine(ls, `
    AW.S.reset();
    globalThis.__out = { noor: AW.S.get('noor', -1), returns: AW.S.get('returns', -1), stars: AW.S.get('stars', { x: 1 }) };
  `);
  const out = readOut(sandbox);
  assert.equal(out.noor, 0, 'legacy awba_noor=999 must NOT resurrect after a reset');
  assert.equal(out.returns, 0, 'legacy awba_returns=88 must NOT resurrect after a reset');
  assert.deepEqual(out.stars, {}, 'legacy awba_stars must NOT resurrect after a reset');
});

/* ---------- (3) memFallback: reset never clobbers a newer-schema blob on disk ---------- */

test('S2: reset() no-ops the persist under memFallback (a newer-schema blob is never overwritten)', () => {
  const futureBlob = { schemaVersion: 999, noor: 77, returns: 9, stars: { u1m1: 3 }, chests: {}, ringSeed: 55 };
  const ls = makeLS({ awba_state: JSON.stringify(futureBlob) });
  const sandbox = loadEngine(ls, `
    var wasFallback = AW.S.isFallback();     // trips memFallback (future schemaVersion), no persist
    AW.S.reset();
    globalThis.__out = {
      wasFallback: wasFallback,
      stillFallback: AW.S.isFallback(),
      memNoor: AW.S.get('noor', -1),         // session copy is reset in-memory
      memRingSeed: AW.ringSeed(),            // seed still preserved in the session copy
      disk: JSON.parse(localStorage.getItem('awba_state')),   // must be the UNTOUCHED 999 blob
    };
  `);
  const out = readOut(sandbox);
  assert.equal(out.wasFallback, true, 'a future-schema blob must trip memFallback');
  assert.equal(out.stillFallback, true, 'reset must not clear the memFallback state');
  assert.equal(out.memNoor, 0, 'the in-memory session copy is reset to defaults');
  assert.equal(out.memRingSeed, 55, 'ringSeed is preserved even in the session copy');
  assert.deepEqual(out.disk, futureBlob, 'the on-disk newer-schema blob is left byte-for-byte untouched (no persist under memFallback)');
});

/* ---------- (4) source invariant: reset added NO new storage-API literal (count stays 13) ---------- */

test('S2: the engine\'s storage-API literal count is unchanged at 13 (reset reuses persist/defaultState)', () => {
  const matches = ENGINE_SRC.match(/localStorage/g) || [];
  assert.equal(matches.length, 13, 'AW.S.reset must reuse persist()/defaultState() — no new raw storage literal');
});
