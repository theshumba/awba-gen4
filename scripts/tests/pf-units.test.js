/* ============================================================================================
   pf-units.test.js  ·  Awba Gen-4 v2 — profile.html PF_UNITS integrity (Wave-C §9.4 · S6 update)
   --------------------------------------------------------------------------------------------
   profile.html no longer carries its own PF_UNITS literal — post-S6 it DERIVES PF_UNITS from the
   single source shared/course-structure.js (window.AWBA_COURSE). This test now reconstructs
   PF_UNITS exactly as profile.html does (filter lesson nodes → unit → lesson-id list), then runs
   the same three integrity assertions against the engine's NODE_ATOMS so the two can never drift:
   every lesson id must be a real NODE_ATOMS key, and the lists must enumerate EXACTLY the 15 course
   lessons — no typo id, no missing lesson, no duplicate. Zero deps (Node core + a window stub).
   ============================================================================================ */
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.join(__dirname, '..', '..');
const ENGINE_SRC = fs.readFileSync(path.join(ROOT, 'shared', 'awba-engine.js'), 'utf8');

/* Evaluate a well-delimited `var NAME = <literal>;` block in an isolated scope (NODE_ATOMS is a
   plain object literal — no AW.*, no calls). */
function evalDecl(src, re, name) {
  const m = src.match(re);
  assert.ok(m, name + ' declaration not found in source');
  // eslint-disable-next-line no-new-func
  return new Function(m[0] + '\nreturn ' + name + ';')();
}

/* Load the classic single source into a window stub, then derive PF_UNITS exactly as profile.html
   does post-S6 (§S6.2) — proving the derivation, not a copied literal. */
function derivePfUnits() {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'shared', 'course-structure.js'), 'utf8'), sandbox, {
    filename: 'shared/course-structure.js',
  });
  // JSON round-trip normalises the vm-realm object graph into this test realm (deepEqual checks
  // Array/Object prototype identity — see ls-stub.js readOut note).
  return JSON.parse(JSON.stringify(
    sandbox.window.AWBA_COURSE.units.map((u) => ({
      u: u.n,
      title: u.title,
      lessons: u.nodes.filter((nd) => nd.kind === 'lesson').map((nd) => nd.id),
    }))
  ));
}

const PF_UNITS = derivePfUnits();
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
