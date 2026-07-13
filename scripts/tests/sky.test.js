/* ============================================================================================
   sky.test.js  ·  Awba Gen-4 — prayer-clock Sky: five temperatures + manual/off behaviour (§7)
   --------------------------------------------------------------------------------------------
   Pins the pure now→temperature function (skyTemp) and the manual prayerTimes/skyMode contract
   against the real shared/awba-engine.js, headlessly, via `node --test`. No DOM, no timers, no
   device-location or network path is exercised — skyTemp is a pure function of (now, times, mode),
   so every case below is deterministic with fixed `now` fixtures.

   Runs only via the glob:  node --test scripts/tests/*.test.js
   ============================================================================================ */
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { makeLS, loadEngine } = require('./ls-stub');

const DEFAULT_TIMES = { fajr: '05:00', dhuhr: '13:00', asr: '16:30', maghrib: '19:30', isha: '21:00' };

/* tempAt — build a Date-like `now` (only getHours/getMinutes are read) and return AW.skyTemp's
   verdict for the given fixed hour/minute, times table and mode. One fresh engine load per call. */
function tempAt(hour, minute, times, mode) {
  const probe =
    'var T = ' + JSON.stringify(times) + ';' +
    'var now = { getHours: function(){ return ' + hour + '; }, getMinutes: function(){ return ' + (minute || 0) + '; } };' +
    'globalThis.__out = AW.skyTemp(now, T, ' + JSON.stringify(mode) + ');';
  return loadEngine(makeLS({}), probe).__out;
}

/* ---------- 1 · the five fixed-now → temperature fixtures (§7.1, acceptance 1) ---------- */

test('skyTemp: five fixed-now fixtures map to the five temperatures (default schedule)', () => {
  assert.equal(tempAt(2, 0, DEFAULT_TIMES, 'manual'), 'lastthird'); // 02:00 — after midnight, before Fajr
  assert.equal(tempAt(6, 0, DEFAULT_TIMES, 'manual'), 'dawn');      // 06:00 — after Fajr, before Dhuhr
  assert.equal(tempAt(14, 0, DEFAULT_TIMES, 'manual'), 'day');      // 14:00 — after Dhuhr, before Maghrib
  assert.equal(tempAt(20, 0, DEFAULT_TIMES, 'manual'), 'dusk');     // 20:00 — after Maghrib, before Isha
  assert.equal(tempAt(22, 0, DEFAULT_TIMES, 'manual'), 'night');    // 22:00 — after Isha, before midnight
});

test('skyTemp: window boundaries are inclusive of the start minute (Fajr/Dhuhr/Maghrib/Isha)', () => {
  assert.equal(tempAt(5, 0, DEFAULT_TIMES, 'manual'), 'dawn');      // exactly Fajr → dawn begins
  assert.equal(tempAt(4, 59, DEFAULT_TIMES, 'manual'), 'lastthird');// one minute before Fajr → still last third
  assert.equal(tempAt(13, 0, DEFAULT_TIMES, 'manual'), 'day');      // exactly Dhuhr → day begins
  assert.equal(tempAt(19, 30, DEFAULT_TIMES, 'manual'), 'dusk');    // exactly Maghrib → dusk begins
  assert.equal(tempAt(21, 0, DEFAULT_TIMES, 'manual'), 'night');    // exactly Isha → night begins
  assert.equal(tempAt(0, 0, DEFAULT_TIMES, 'manual'), 'lastthird'); // local midnight (00:00) → last third
});

/* ---------- 2 · a shifted prayerTimes moves a boundary (same now, different result) (§7.2, acc. 2) ---------- */

test('skyTemp: shifting Maghrib later moves the dusk boundary — same now yields a different temperature', () => {
  const shifted = Object.assign({}, DEFAULT_TIMES, { maghrib: '20:30' });
  // 20:00 is AFTER the default Maghrib (19:30) → dusk, but BEFORE the shifted Maghrib (20:30) → still day.
  assert.equal(tempAt(20, 0, DEFAULT_TIMES, 'manual'), 'dusk');
  assert.equal(tempAt(20, 0, shifted, 'manual'), 'day');
  assert.notEqual(tempAt(20, 0, DEFAULT_TIMES, 'manual'), tempAt(20, 0, shifted, 'manual'));
});

/* ---------- 3 · skyMode "off" ⇒ always day (§7.2, acceptance 3) ---------- */

test('skyTemp: skyMode "off" ⇒ always "day" regardless of the clock', () => {
  assert.equal(tempAt(2, 0, DEFAULT_TIMES, 'off'), 'day');
  assert.equal(tempAt(6, 0, DEFAULT_TIMES, 'off'), 'day');
  assert.equal(tempAt(22, 0, DEFAULT_TIMES, 'off'), 'day');
});

/* ---------- 4 · determinism + no device-location path (§7.2, acceptance 2/determinism) ---------- */

test('skyTemp: deterministic — identical (now, times, mode) yields the identical temperature', () => {
  const a = tempAt(6, 0, DEFAULT_TIMES, 'manual');
  const b = tempAt(6, 0, DEFAULT_TIMES, 'manual');
  const c = tempAt(6, 0, DEFAULT_TIMES, 'manual');
  assert.equal(a, 'dawn');
  assert.equal(a, b);
  assert.equal(b, c);
});

test('engine references no device-location or network lookup for the Sky', () => {
  const src = fs.readFileSync(
    path.join(__dirname, '..', '..', 'shared', 'awba-engine.js'),
    'utf8'
  );
  // The prayer clock is manual-only (T-03-10): the sky must reveal nothing about the learner's
  // whereabouts, so neither the location API nor a network fetch may appear anywhere in the engine.
  assert.ok(!/geo\x6cocation|getCurrentPosition/.test(src), 'no location API symbol may appear');
  assert.ok(!/\bfetch\s*\(|XMLHttpRequest/.test(src), 'no network call may appear');
});

/* ---------- 4b · the --dawn progress degree: scaling + the 0.6 ambient cap (§7.3/§7.5 acc. 6) ----------
   skyDawn(atomsDone) = min(0.6, atomsDone/61). WR-06: the whole --dawn contract had zero coverage.
   These pin BOTH the linear scaling below the cap AND the cap itself, so a future edit that removes/
   raises SKY_DAWN_CAP, breaks the /61 scaling, or reintroduces a Math.random()/Date dependency fails
   loudly instead of passing node --test silently. 61 = the taught-atom total (D-57/R-1). */

/* skyDawnAt — evaluate AW.skyDawn(atomsDone) against the real engine, one fresh load per call. */
function skyDawnAt(atomsDone) {
  return loadEngine(makeLS({}), 'globalThis.__out = AW.skyDawn(' + atomsDone + ');').__out;
}

test('skyDawn: 0 progress → 0 warmth; the /61 scaling below the cap is exact (WR-06)', () => {
  assert.equal(skyDawnAt(0), 0, 'no progress → no dawn warmth');
  assert.equal(skyDawnAt(26), 26 / 61, 'below the cap, warmth scales linearly as atomsDone/61');
  assert.ok(skyDawnAt(26) < 0.6, 'the mid value sits below the ambient cap (the scaling, not the cap, is pinned here)');
});

test('skyDawn: caps at 0.6 so it stays ambient and never competes with the prayer clock / Ring (WR-06)', () => {
  assert.equal(skyDawnAt(61), 0.6, 'full progress caps at 0.6 — NOT 1.0 (§7.5 acceptance 6)');
  assert.equal(skyDawnAt(45), 0.6, 'any progress past the 0.6 crossing is clamped to the cap');
});

test('skyDawn: negative / NaN atomsDone are defensively floored to 0 (WR-06)', () => {
  assert.equal(skyDawnAt(-5), 0, 'a negative atom count floors to 0');
  assert.equal(skyDawnAt(NaN), 0, 'NaN floors to 0 (never NaN warmth)');
});

/* ---------- 5 · manual prayerTimes/skyMode defaults, NO schema bump (§7.2 / D-A13) ---------- */

test('prefs: fresh install seeds the default prayerTimes schedule + skyMode "manual"', () => {
  const s = loadEngine(
    makeLS({}),
    'globalThis.__out = { pt: AW.prefs.get("prayerTimes", null), sm: AW.prefs.get("skyMode", null) };'
  );
  assert.equal(s.__out.pt.fajr, '05:00');
  assert.equal(s.__out.pt.dhuhr, '13:00');
  assert.equal(s.__out.pt.maghrib, '19:30');
  assert.equal(s.__out.pt.isha, '21:00');
  assert.equal(s.__out.sm, 'manual');
});

test('prefs: an existing v1 awba_prefs blob (no Sky fields) still loads — Sky reads fall back to defaults (no schema bump)', () => {
  const v1 = JSON.stringify({ schemaVersion: 1, soundMuted: true, motion: 'reduce' });
  const s = loadEngine(
    makeLS({ awba_prefs: v1 }),
    'globalThis.__out = {' +
      ' muted: AW.prefs.get("soundMuted", false),' +
      ' motion: AW.prefs.get("motion", "system"),' +
      ' pt: AW.prefs.get("prayerTimes", { fajr: "SENTINEL" }),' +
      ' sm: AW.prefs.get("skyMode", "manual")' +
    ' };'
  );
  // The pre-existing v1 fields survive untouched...
  assert.equal(s.__out.muted, true);
  assert.equal(s.__out.motion, 'reduce');
  // ...and absent Sky keys fall back to the provided default (get-with-default tolerates absence).
  assert.equal(s.__out.pt.fajr, 'SENTINEL');
  assert.equal(s.__out.sm, 'manual');
});
