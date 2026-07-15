/* ============================================================================================
   sprouts.test.js  ·  Awba Gen-4 v2.1 — AW.SPROUTS / AW.sproutFor (S5 engine hoist)
   --------------------------------------------------------------------------------------------
   The byte-identical proof for the S5 hoist: the D-55 decorative-doodle pool + its deterministic
   per-node picker were MOVED byte-for-byte from learn.html's inline SPROUTS/sproutFor into engine
   members AW.SPROUTS / AW.sproutFor, so the learn path and the profile garden read ONE source.

   Pins (against the real shared/awba-engine.js, headlessly, via the ls-stub loadEngine idiom):
     1. Shape — AW.SPROUTS is an array of exactly 20 strings, each an aria-hidden gold-ink <svg>.
     2. Determinism + stability — AW.sproutFor(id) is invariant across calls (no entropy).
     3. The immortal golden — a FROZEN SHA-256, captured once from the PRE-hoist inline bytes, of
        AW.SPROUTS.join(' ') AND of the 15 lesson ids (NODE_ATOMS order) mapped through
        AW.sproutFor(' '-joined). Proves (a) the 20 doodles survived the move byte-for-byte and
        (b) no id's plant shifted — each lesson keeps ITS signature plant across path AND garden.
     4. Conditional parity — if learn.html still carries an inline sproutFor (i.e. before the
        adoption edit lands), its SPROUTS bytes must match AW.SPROUTS; after adoption this no-ops
        (mirrors state-sheets.test.js's conditional parity check).
   Zero deps (Node core + ls-stub, D-25).
   ============================================================================================ */
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { makeLS, loadEngine } = require('./ls-stub');

const ROOT = path.join(__dirname, '..', '..');
const LEARN_SRC = fs.readFileSync(path.join(ROOT, 'learn.html'), 'utf8');

/* The 15 lesson ids in NODE_ATOMS declaration order (u1m1…u4m3) — the order the golden was frozen in. */
const LESSON_IDS = [
  'u1m1', 'u1m2', 'u1m3', 'u1m4',
  'u2m1', 'u2m2', 'u2m3', 'u2m3b',
  'u3m1', 'u3m2', 'u3m3',
  'u4m1', 'u4m2', 'u4m2b', 'u4m3',
];

/* Frozen once from the PRE-hoist inline learn.html bytes (never recompute from the live engine —
   that would make the pin tautological). Any drift in a doodle OR a shifted id-hash fails here. */
const POOL_SHA = '2570c147cd231e351d0b8a8b72736fc28cd3f673bcf82eb01502dbeffe71d050';
const MAP_SHA = '75b75bf2ec91177ea4143d8b52874fd858fe9722fc5150900ef3aa68d1b5aeb6';

function sha256(s) {
  return crypto.createHash('sha256').update(s, 'utf8').digest('hex');
}

/* Read the live-engine values across the vm boundary as strings/primitives (no JSON round-trip
   needed — only strings + a length cross the boundary). */
function probe() {
  const sb = loadEngine(
    makeLS({}),
    `var ids = ${JSON.stringify(LESSON_IDS)};
     globalThis.__out = {
       len: AW.SPROUTS.length,
       allSvg: AW.SPROUTS.every(function (s) { return typeof s === 'string' && s.indexOf('<svg') === 0; }),
       allHidden: AW.SPROUTS.every(function (s) { return s.indexOf('aria-hidden="true"') !== -1; }),
       allGold: AW.SPROUTS.every(function (s) { return s.indexOf('var(--gold)') !== -1; }),
       pool: AW.SPROUTS.join(' '),
       map: ids.map(function (id) { return AW.sproutFor(id); }).join(' '),
       stable: ids.every(function (id) { return AW.sproutFor(id) === AW.sproutFor(id); }),
       isFn: typeof AW.sproutFor === 'function'
     };`
  );
  return sb.__out;
}

test('S5: AW.SPROUTS is an array of exactly 20 aria-hidden gold-ink <svg> strings', () => {
  const out = probe();
  assert.equal(out.len, 20, 'the pool holds exactly 20 doodles');
  assert.equal(out.allSvg, true, 'every entry is a self-contained <svg …> string');
  assert.equal(out.allHidden, true, 'every entry is decorative (aria-hidden="true")');
  assert.equal(out.allGold, true, 'every entry inks in var(--gold) only (zero new hex)');
});

test('S5: AW.sproutFor is a deterministic, stable per-id pick (no entropy)', () => {
  const out = probe();
  assert.equal(out.isFn, true, 'AW.sproutFor is exposed as a function');
  assert.equal(out.stable, true, 'AW.sproutFor(id) === AW.sproutFor(id) for every lesson id');
});

test('S5: the immortal golden — pool bytes + the 15-id map match the pre-hoist SHA (each lesson keeps its plant)', () => {
  const out = probe();
  assert.equal(sha256(out.pool), POOL_SHA, 'the 20 doodles survived the hoist byte-for-byte');
  assert.equal(sha256(out.map), MAP_SHA, 'no id\'s plant shifted — the signature plant is permanent across path + garden');
});

test('S5: conditional parity — while learn.html still carries an inline sproutFor, its pool matches AW.SPROUTS', () => {
  // Conditional so this survives the S5 adoption that deletes the inline pool from learn.html.
  if (/function sproutFor\(/.test(LEARN_SRC)) {
    const m = LEARN_SRC.match(/var SPD = [\s\S]*?function sproutFor\(id\) \{[\s\S]*?\n {2}\}/);
    assert.ok(m, 'inline SPROUTS/sproutFor block should be locatable while it still exists');
    // eslint-disable-next-line no-new-func
    const inline = new Function(m[0] + '\nreturn SPROUTS;')();
    assert.equal(sha256(inline.join(' ')), POOL_SHA, 'the still-inline pool must byte-match AW.SPROUTS');
  }
});
