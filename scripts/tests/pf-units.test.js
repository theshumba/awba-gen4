/* ============================================================================================
   pf-units.test.js  ·  Awba Gen-4 v2 — profile.html PF_UNITS integrity (Wave-C §9.4)
   --------------------------------------------------------------------------------------------
   profile.html carries its own PF_UNITS map (unit → lesson ids) to lay out the per-unit progress
   rail (an S6 fast-follow would hoist UNITS to a shared file and remove this duplication). Until
   then, this test pins PF_UNITS against the engine's NODE_ATOMS so the two can never drift: every
   PF_UNITS lesson id must be a real NODE_ATOMS key, and the lists must enumerate EXACTLY the 15
   course lessons — no typo id, no missing lesson, no duplicate. Zero deps (pure-literal eval).
   ============================================================================================ */
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..', '..');
const PROFILE_SRC = fs.readFileSync(path.join(ROOT, 'profile.html'), 'utf8');
const ENGINE_SRC = fs.readFileSync(path.join(ROOT, 'shared', 'awba-engine.js'), 'utf8');

/* Extract a well-delimited `var NAME = <literal>;` block and evaluate JUST that pure literal in an
   isolated function scope (PF_UNITS/NODE_ATOMS are plain array/object literals — no AW.*, no calls). */
function evalDecl(src, re, name) {
  const m = src.match(re);
  assert.ok(m, name + ' declaration not found in source');
  // eslint-disable-next-line no-new-func
  return new Function(m[0] + '\nreturn ' + name + ';')();
}

const PF_UNITS = evalDecl(PROFILE_SRC, /var PF_UNITS = \[[\s\S]*?\];/, 'PF_UNITS');
const NODE_ATOMS = evalDecl(ENGINE_SRC, /var NODE_ATOMS = \{[\s\S]*?\};/, 'NODE_ATOMS');

test('PF_UNITS: every lesson id is a real NODE_ATOMS key (no stray / typo id)', () => {
  const atomKeys = new Set(Object.keys(NODE_ATOMS));
  PF_UNITS.forEach((u) => {
    assert.ok(Array.isArray(u.lessons), 'unit ' + u.u + ' must carry a lessons array');
    u.lessons.forEach((id) => {
      assert.ok(atomKeys.has(id), 'PF_UNITS lesson id "' + id + '" (unit ' + u.u + ') must be a NODE_ATOMS key');
    });
  });
});

test('PF_UNITS: the per-unit lesson lists sum to exactly 15 lessons (the full course)', () => {
  const total = PF_UNITS.reduce((n, u) => n + u.lessons.length, 0);
  assert.equal(total, 15, 'PF_UNITS must enumerate exactly the 15 course lessons');
});

test('PF_UNITS: covers exactly the NODE_ATOMS lesson set — none missing, none duplicated', () => {
  const flat = PF_UNITS.flatMap((u) => u.lessons);
  assert.equal(new Set(flat).size, flat.length, 'no lesson id appears twice across units');
  assert.deepEqual(
    [...flat].sort(),
    Object.keys(NODE_ATOMS).sort(),
    'the flattened PF_UNITS lesson set must equal the NODE_ATOMS key set exactly'
  );
});
