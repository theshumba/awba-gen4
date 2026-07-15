/* ============================================================================================
   state-token.test.js  ·  Awba Gen-4 v2.2 — AW.S.exportToken / AW.S.importToken (seam S8, E1)
   --------------------------------------------------------------------------------------------
   Proves the travel-code seam against the real shared/awba-engine.js, headlessly, via
   node --test (zero deps — the ls-stub Map-backed localStorage). The contract (DESIGN-V2.2 E1):
     - exportToken() → "AWBA1.<base64>.<checksum>", PROGRESS ONLY (prefs can never leak),
       ringSeed rides along when present, read-only (no persist, no mutation),
     - importToken(raw) validates prefix → checksum → base64 → JSON → schemaVersion (future =
       refuse) → shape/types; clamps stars 1..3; drops unknown ids and COUNTS them; refuses
       under memFallback; gentle single-line `why` on every failure, never a throw,
     - apply() REPLACES the local blob wholesale via the existing persist seam (never a merge),
       carrying ringSeed — the same maker's mark re-inks on the new device,
     - S8 adds NO new storage-API literal — the engine's storage-word count stays exactly 13.
   ============================================================================================ */
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { makeLS, loadEngine, readOut } = require('./ls-stub');

const ENGINE_PATH = path.join(__dirname, '..', '..', 'shared', 'awba-engine.js');
const ENGINE_SRC = fs.readFileSync(ENGINE_PATH, 'utf8');

/* Mirror of the engine's private tokenSum (FNV-1a/32 → base36) — needed to hand-craft valid
   tokens for the refusal tests. Deterministic; kept in lockstep with the S8 spec. */
function fnv36(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(36);
}
function craftToken(blob) {
  const b64 = btoa(JSON.stringify(blob));
  return 'AWBA1.' + b64 + '.' + fnv36(b64);
}

/* A rich on-disk blob: lesson stars + a REVIEW star (u1r) + a chest (u1c) + ringSeed — the
   shapes E1.3.1 exists to protect (stars is a shared lessons+reviews namespace). */
const RICH = {
  schemaVersion: 1, noor: 120, returns: 5, lastDay: '2026-07-14',
  days: ['2026-07-13', '2026-07-14'],
  stars: { u1m1: 3, u1m2: 2, u1r: 2 }, chests: { u1c: true },
  ringSeed: 424242,
};

function exportFrom(seedBlob) {
  const ls = makeLS({ awba_state: JSON.stringify(seedBlob) });
  const sandbox = loadEngine(ls, `
    globalThis.__out = {
      token: AW.S.exportToken(),
      diskAfter: localStorage.getItem('awba_state'),
    };
  `);
  return readOut(sandbox);
}

/* ---------- (1) round-trip: export on device A → import + apply on a FRESH device B ---------- */

test('S8: round-trip — the full path (incl. a review star, a chest, ringSeed) arrives intact on a fresh device', () => {
  const { token } = exportFrom(RICH);
  assert.match(token, /^AWBA1\.[A-Za-z0-9+/=]+\.[a-z0-9]+$/, 'token grammar is AWBA1.<base64>.<base36sum>');

  const ls = makeLS({});                       // device B: nothing on disk
  const sandbox = loadEngine(ls, `
    var res = AW.S.importToken('${token}');
    var applied = res.ok ? res.apply() : false;
    globalThis.__out = {
      ok: res.ok, preview: res.preview, applied: applied,
      state: AW.state(),
      ringSeed: AW.ringSeed(),
      disk: JSON.parse(localStorage.getItem('awba_state')),
    };
  `);
  const out = readOut(sandbox);
  assert.equal(out.ok, true);
  assert.deepEqual(out.preview, { noor: 120, returns: 5, lessonsDone: 2, dropped: 0 },
    'lessonsDone counts the 2 lesson ids only — never the review star or the chest');
  assert.equal(out.applied, true);
  assert.deepEqual(out.state, {
    noor: 120, returns: 5, stars: { u1m1: 3, u1m2: 2, u1r: 2 },
    days: ['2026-07-13', '2026-07-14'], lastDay: '2026-07-14', chests: { u1c: true },
  }, 'the arrived state deep-equals the exported one — including the review star and the chest');
  assert.equal(out.ringSeed, 424242, 'the ring travels with its owner — the SAME maker\'s mark re-inks');
  assert.equal(out.disk.ringSeed, 424242, 'the replacement is persisted through the existing seam');
  assert.equal(out.disk.schemaVersion, 1, 'apply() runs runMigrations — the persisted blob is CURRENT');
});

/* ---------- (2) exportToken is read-only + progress-only (prefs can never leak) ---------- */

test('S8: exportToken() is read-only and carries PROGRESS ONLY — no pref may ride along', () => {
  const ls = makeLS({
    awba_state: JSON.stringify(RICH),
    awba_prefs: JSON.stringify({
      schemaVersion: 1, soundMuted: true, motion: 'reduce', displayName: 'Melusi',
      prayerTimes: { fajr: '05:00' }, skyMode: 'manual', onboardingDone: true,
    }),
  });
  const before = ls.getItem('awba_state');
  const sandbox = loadEngine(ls, `
    globalThis.__out = { token: AW.S.exportToken(), diskAfter: localStorage.getItem('awba_state') };
  `);
  const out = readOut(sandbox);
  assert.equal(out.diskAfter, before, 'exportToken must not persist or mutate the on-disk blob');

  const decoded = JSON.parse(Buffer.from(out.token.split('.')[1], 'base64').toString('utf8'));
  assert.deepEqual(Object.keys(decoded).sort(),
    ['chests', 'days', 'lastDay', 'noor', 'returns', 'ringSeed', 'schemaVersion', 'stars'],
    'the blob is the explicit whitelist + ringSeed — nothing else');
  for (const k of ['soundMuted', 'motion', 'displayName', 'prayerTimes', 'skyMode', 'onboardingDone']) {
    assert.equal(k in decoded, false, `pref "${k}" must never leak into a travel code`);
  }
  assert.equal(decoded.ringSeed, 424242);
});

/* ---------- (3) tamper: one flipped character anywhere → refused ---------- */

test('S8: a flipped character in the payload OR the checksum is refused (corruption detector)', () => {
  const { token } = exportFrom(RICH);
  const parts = token.split('.');

  // flip one payload char (to a DIFFERENT base64 char)
  const p = parts[1];
  const flippedPayload = p.slice(0, 5) + (p[5] === 'A' ? 'B' : 'A') + p.slice(6);
  assert.notEqual(flippedPayload, p);
  const t1 = parts[0] + '.' + flippedPayload + '.' + parts[2];

  // flip one checksum char (to a DIFFERENT base36 char)
  const c = parts[2];
  const flippedSum = (c[0] === 'z' ? 'a' : 'z') + c.slice(1);
  const t2 = parts[0] + '.' + parts[1] + '.' + flippedSum;

  const ls = makeLS({});
  const sandbox = loadEngine(ls, `
    globalThis.__out = {
      payloadFlip: AW.S.importToken('${t1}'),
      sumFlip: AW.S.importToken('${t2}'),
    };
  `);
  const out = readOut(sandbox);
  assert.equal(out.payloadFlip.ok, false, 'a mangled payload must be refused');
  assert.ok(out.payloadFlip.why.length > 0);
  assert.equal(out.sumFlip.ok, false, 'a mangled checksum must be refused');
  assert.ok(out.sumFlip.why.length > 0);
});

/* ---------- (4) a FUTURE schemaVersion is refused (mirrors the memFallback law) ---------- */

test('S8: a token from a newer Awba (schemaVersion > CURRENT) is refused with the update line', () => {
  const future = craftToken({
    schemaVersion: 999, noor: 7, returns: 1, lastDay: null, days: [], stars: {}, chests: {},
  });
  const missing = craftToken({ noor: 7, returns: 1, lastDay: null, days: [], stars: {}, chests: {} });
  const ls = makeLS({});
  const sandbox = loadEngine(ls, `
    globalThis.__out = {
      future: AW.S.importToken('${future}'),
      missing: AW.S.importToken('${missing}'),
    };
  `);
  const out = readOut(sandbox);
  assert.equal(out.future.ok, false);
  assert.match(out.future.why, /newer version/i, 'the why names the real cause — update Awba, then bring it in');
  assert.equal(out.missing.ok, false, 'a missing/non-numeric schemaVersion is untrustworthy → refused');
});

/* ---------- (5) unknown ids are dropped AND counted; apply() carries none of them ---------- */

test('S8: unknown star/chest ids are dropped, counted in preview.dropped, and never persisted', () => {
  const dirty = craftToken({
    schemaVersion: 1, noor: 10, returns: 0, lastDay: null, days: [],
    stars: { u1m1: 3, bogus: 2, "':evil": 3 }, chests: { u1c: true, nope: true, u2c: 'yes' },
  });
  const ls = makeLS({});
  const sandbox = loadEngine(ls, `
    var res = AW.S.importToken('${dirty.replace(/'/g, "\\'")}');
    if (res.ok) res.apply();
    globalThis.__out = { ok: res.ok, preview: res.preview, state: AW.state() };
  `);
  const out = readOut(sandbox);
  assert.equal(out.ok, true);
  assert.deepEqual(out.state.stars, { u1m1: 3 }, 'only the known lesson id survives');
  assert.deepEqual(out.state.chests, { u1c: true }, 'unknown chest id + non-true value both dropped');
  assert.ok(out.preview.dropped >= 3, `dropped counts the discards (got ${out.preview.dropped})`);
  assert.equal(out.preview.lessonsDone, 1);
});

/* ---------- (6) star values clamp to 1..3 ---------- */

test('S8: star values are clamped to 1..3 on import', () => {
  const t = craftToken({
    schemaVersion: 1, noor: 0, returns: 0, lastDay: null, days: [],
    stars: { u1m1: 0, u1m2: 9, u1m3: 2 }, chests: {},
  });
  const ls = makeLS({});
  const sandbox = loadEngine(ls, `
    var res = AW.S.importToken('${t}');
    if (res.ok) res.apply();
    globalThis.__out = { stars: AW.state().stars };
  `);
  const out = readOut(sandbox);
  assert.deepEqual(out.stars, { u1m1: 1, u1m2: 3, u1m3: 2 }, '0 lifts to 1, 9 caps at 3, 2 stays 2');
});

/* ---------- (6b) defensive normalisation: counter ceiling + days dedupe/sort ---------- */

test('S8: crafted counters are capped and days arrive sorted + unique', () => {
  const t = craftToken({
    schemaVersion: 1, noor: 1e308, returns: 123456789, lastDay: null,
    days: ['2026-07-14', '2026-07-14', '2026-07-12', '2026-07-13', '2026-07-14'],
    stars: {}, chests: {},
  });
  const ls = makeLS({});
  const sandbox = loadEngine(ls, `
    var res = AW.S.importToken('${t}');
    if (res.ok) res.apply();
    globalThis.__out = { preview: res.preview, state: AW.state() };
  `);
  const out = readOut(sandbox);
  assert.equal(out.state.noor, 9999999, 'a crafted astronomic noor caps at the ceiling');
  assert.equal(out.preview.noor, 9999999, 'the preview shows the same capped value the apply persists');
  assert.equal(out.state.returns, 9999999, 'returns caps too');
  assert.deepEqual(out.state.days, ['2026-07-12', '2026-07-13', '2026-07-14'],
    'days are deduped and chronologically sorted — the touchDay() invariant holds after import');
});

/* ---------- (7) memFallback: importing is refused (the protected blob is never clobbered) ---------- */

test('S8: under memFallback (a newer-schema blob on disk) importToken refuses politely', () => {
  const { token } = exportFrom(RICH);                    // a perfectly valid code
  const futureBlob = { schemaVersion: 2, noor: 77, returns: 9, stars: {}, chests: {}, ringSeed: 55 };
  const ls = makeLS({ awba_state: JSON.stringify(futureBlob) });
  const sandbox = loadEngine(ls, `
    var res = AW.S.importToken('${token}');
    globalThis.__out = {
      ok: res.ok, why: res.why,
      isFallback: AW.S.isFallback(),
      disk: JSON.parse(localStorage.getItem('awba_state')),
    };
  `);
  const out = readOut(sandbox);
  assert.equal(out.isFallback, true, 'a future-schema blob must trip memFallback');
  assert.equal(out.ok, false, 'a valid code is still refused while the session cannot persist');
  assert.ok(out.why.length > 0);
  assert.deepEqual(out.disk, futureBlob, 'the on-disk newer-schema blob is left untouched');
});

/* ---------- (8) empty / garbage pastes: gentle refusals, never a throw ---------- */

test('S8: empty and garbage pastes each get a gentle non-empty why — and never throw', () => {
  const ls = makeLS({});
  const sandbox = loadEngine(ls, `
    globalThis.__out = {
      empty: AW.S.importToken(''),
      blank: AW.S.importToken('   '),
      words: AW.S.importToken('hello'),
      twoPart: AW.S.importToken('AWBA1.zzz'),
      badSum: AW.S.importToken('AWBA1.zzz.zzz'),
      notString: AW.S.importToken(42),
    };
  `);
  const out = readOut(sandbox);
  for (const k of ['empty', 'blank', 'words', 'twoPart', 'badSum', 'notString']) {
    assert.equal(out[k].ok, false, `"${k}" paste must be refused`);
    assert.equal(typeof out[k].why, 'string');
    assert.ok(out[k].why.length > 0, `"${k}" refusal carries a gentle reason`);
    assert.doesNotMatch(out[k].why, /base64|JSON|checksum|prefix|schema/i,
      'the why is never technical');
  }
});

/* ---------- (9) source invariant: S8 added NO new storage-API literal (count stays 13) ---------- */

test('S8: the engine\'s storage-API literal count is unchanged at 13 (S8 reuses persist/defaultState/runMigrations)', () => {
  const matches = ENGINE_SRC.match(/localStorage/g) || [];
  assert.equal(matches.length, 13, 'exportToken/importToken must reuse the existing seams — no new raw storage literal');
});
