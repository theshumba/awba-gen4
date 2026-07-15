/* ============================================================================================
   course-structure.test.js  ·  Awba Gen-4 v2.1 — shared/course-structure.js single source (S6)
   --------------------------------------------------------------------------------------------
   window.AWBA_COURSE is the ONE canonical 4-unit / 23-node structure that learn.html and
   profile.html now derive their local shapes from (no page carries its own copy). This gate pins
   it against the engine's NODE_ATOMS and a byte-exact label/href golden captured from the shipped
   UNITS, so it can never drift:
     1. The 23 node ids == the 15 NODE_ATOMS lesson keys ∪ {u1r..u4r} ∪ {u1c..u4c}; every lesson
        node id is a real NODE_ATOMS key; every lesson NODE_ATOMS key appears exactly once; no dup.
     2. The 4 / 4 / 3 / 4 = 15 lesson split, 4 reviews + 4 chests = 23 total nodes.
     3. Byte-exact label/href golden — freezes 'One religion, one thread', 'The deniers’ twist'
        (U+2019), 'The final review', 'The course gift' forever.
     4. Icon parity — AWBA_COURSE.units[i].icon === AW.UNIT_ICON['u'+n] for all 4 units.
   Loads the classic script by vm-eval into a window stub (like practice-pool-audit.mjs); reads
   NODE_ATOMS + AW.UNIT_ICON straight from the engine. Zero deps (Node core + ls-stub).
   ============================================================================================ */
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { makeLS, loadEngine } = require('./ls-stub');

const ROOT = path.join(__dirname, '..', '..');
const ENGINE_SRC = fs.readFileSync(path.join(ROOT, 'shared', 'awba-engine.js'), 'utf8');

/* Load the classic course-structure.js the way the browser does — assign to a window stub. */
function loadCourse() {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'shared', 'course-structure.js'), 'utf8'), sandbox, {
    filename: 'shared/course-structure.js',
  });
  return sandbox.window.AWBA_COURSE;
}

/* NODE_ATOMS lesson keys, parsed straight from the engine's module-private map (as the audits do). */
function nodeAtomKeys() {
  const m = ENGINE_SRC.match(/var NODE_ATOMS\s*=\s*\{([\s\S]*?)\};/);
  assert.ok(m, 'NODE_ATOMS not found in engine');
  const keys = [];
  const re = /([A-Za-z]\w*)\s*:/g;
  let k;
  while ((k = re.exec(m[1]))) keys.push(k[1]);
  return keys;
}

/* JSON round-trip normalises the vm-realm object graph into this test realm — required before
   assert.deepEqual, which checks Array/Object prototype identity (see ls-stub.js readOut note). */
const AWBA_COURSE = JSON.parse(JSON.stringify(loadCourse()));
const flat = AWBA_COURSE.units.flatMap((u) => u.nodes);

/* The byte-exact golden — 23 {id, kind, label, href?}, captured verbatim from the shipped UNITS
   (curly apostrophes intact). Any label/href drift fails deepEqual here. */
const GOLDEN = [
  { id: 'u1m1', kind: 'lesson', label: 'What sound belief is', href: 'lessons/u1-m1.html' },
  { id: 'u1m2', kind: 'lesson', label: 'Why belief matters', href: 'lessons/u1-m2.html' },
  { id: 'u1m3', kind: 'lesson', label: 'Where belief comes from', href: 'lessons/u1-m3.html' },
  { id: 'u1m4', kind: 'lesson', label: 'How we keep it sound', href: 'lessons/u1-m4.html' },
  { id: 'u1r', kind: 'review', label: 'Legendary review', href: 'reviews/u1-review.html' },
  { id: 'u1c', kind: 'chest', label: 'A gift' },
  { id: 'u2m1', kind: 'lesson', label: 'The causes within you', href: 'lessons/u2-m1.html' },
  { id: 'u2m2', kind: 'lesson', label: 'The pulls from outside', href: 'lessons/u2-m2.html' },
  { id: 'u2m3', kind: 'lesson', label: 'Protecting yourself I', href: 'lessons/u2-m3.html' },
  { id: 'u2m3b', kind: 'lesson', label: 'Protecting yourself II', href: 'lessons/u2-m3b.html' },
  { id: 'u2r', kind: 'review', label: 'Legendary review', href: 'reviews/u2-review.html' },
  { id: 'u2c', kind: 'chest', label: 'A gift' },
  { id: 'u3m1', kind: 'lesson', label: 'What Tawhid is', href: 'lessons/u3-m1.html' },
  { id: 'u3m2', kind: 'lesson', label: 'Worth more than everything', href: 'lessons/u3-m2.html' },
  { id: 'u3m3', kind: 'lesson', label: 'One religion, one thread', href: 'lessons/u3-m3.html' },
  { id: 'u3r', kind: 'review', label: 'Legendary review', href: 'reviews/u3-review.html' },
  { id: 'u3c', kind: 'chest', label: 'A gift' },
  { id: 'u4m1', kind: 'lesson', label: 'The two pillars', href: 'lessons/u4-m1.html' },
  { id: 'u4m2', kind: 'lesson', label: 'The Lord of everything', href: 'lessons/u4-m2.html' },
  { id: 'u4m2b', kind: 'lesson', label: 'The deniers’ twist', href: 'lessons/u4-m2b.html' },
  { id: 'u4m3', kind: 'lesson', label: 'How we know He is there', href: 'lessons/u4-m3.html' },
  { id: 'u4r', kind: 'review', label: 'The final review', href: 'reviews/u4-review.html' },
  { id: 'u4c', kind: 'chest', label: 'The course gift' },
];

test('AWBA_COURSE: the 23 node ids == the NODE_ATOMS lesson keys ∪ review ids ∪ chest ids', () => {
  const atomKeys = nodeAtomKeys();
  const reviewIds = ['u1r', 'u2r', 'u3r', 'u4r'];
  const chestIds = ['u1c', 'u2c', 'u3c', 'u4c'];
  const expected = [...atomKeys, ...reviewIds, ...chestIds].sort();
  const actual = flat.map((n) => n.id).sort();
  assert.equal(actual.length, 23, 'exactly 23 nodes');
  assert.equal(new Set(actual).size, 23, 'no id is duplicated');
  assert.deepEqual(actual, expected, 'ids must equal the 15 lesson keys ∪ 4 reviews ∪ 4 chests');

  // every lesson node id is a real NODE_ATOMS key; every lesson key appears exactly once as a lesson node.
  const atomSet = new Set(atomKeys);
  const lessonNodeIds = flat.filter((n) => n.kind === 'lesson').map((n) => n.id);
  lessonNodeIds.forEach((id) => assert.ok(atomSet.has(id), id + ' is not a NODE_ATOMS key'));
  assert.deepEqual([...lessonNodeIds].sort(), [...atomKeys].sort(), 'every lesson NODE_ATOMS key appears exactly once');
});

test('AWBA_COURSE: the 4 / 4 / 3 / 4 = 15 lesson split, 4 reviews + 4 chests = 23 nodes', () => {
  const splits = AWBA_COURSE.units.map((u) => u.nodes.filter((n) => n.kind === 'lesson').length);
  assert.deepEqual(splits, [4, 4, 3, 4], 'the per-unit lesson split is 4/4/3/4');
  assert.equal(splits.reduce((a, b) => a + b, 0), 15, '15 lessons total');
  assert.equal(flat.filter((n) => n.kind === 'review').length, 4, '4 reviews');
  assert.equal(flat.filter((n) => n.kind === 'chest').length, 4, '4 chests');
  assert.equal(flat.length, 23, '23 nodes total');
});

test('AWBA_COURSE: byte-exact label/href golden (curly apostrophes + hold-adjacent labels frozen)', () => {
  const actual = flat.map((n) => {
    const o = { id: n.id, kind: n.kind, label: n.label };
    if (n.href !== undefined) o.href = n.href;
    return o;
  });
  assert.deepEqual(actual, GOLDEN, 'flattened AWBA_COURSE nodes must byte-match the frozen golden');
  // explicit spot-pins on the byte-immutable / hold-adjacent labels
  assert.equal(flat.find((n) => n.id === 'u3m3').label, 'One religion, one thread');
  assert.equal(flat.find((n) => n.id === 'u4m2b').label, 'The deniers’ twist', 'U+2019 curly apostrophe intact');
  assert.equal(flat.find((n) => n.id === 'u4r').label, 'The final review');
  assert.equal(flat.find((n) => n.id === 'u4c').label, 'The course gift');
});

test('AWBA_COURSE: icon parity with AW.UNIT_ICON — no icon drift', () => {
  const sb = loadEngine(makeLS({}), 'globalThis.__out = JSON.stringify(AW.UNIT_ICON);');
  const unitIcon = JSON.parse(sb.__out);
  AWBA_COURSE.units.forEach((u) => {
    assert.equal(u.icon, unitIcon['u' + u.n], 'unit ' + u.n + ' icon must mirror AW.UNIT_ICON');
  });
});
