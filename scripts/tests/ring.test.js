/* ============================================================================================
   ring.test.js  ·  Awba Gen-4 — the Ring generator (MOT-01, the tawaf fingerprint / SPOF)
   --------------------------------------------------------------------------------------------
   Pins the DETERMINISM contract (spec §6.2/§6.6) the whole macro-progress artefact rests on:
   same seed + same progress ⇒ byte-identical SVG; two seeds ⇒ different fingerprints; progressive
   inking from all-faint to inked-and-sealed; the reduced-motion branch returns the final state
   static (zero animation nodes); and the ≤600-node / no-<filter> perf budget.

   Acceptance criterion 5 ("reads as a hand-inked tawaf, not a mechanical ring") is the human §9
   visual gate, not a unit test — every assertion below is a pure string/value check.

   Run ONLY via the glob form: `node --test scripts/tests/*.test.js` (the directory form breaks
   on this Node build).
   ============================================================================================ */
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { makeLS, loadEngine } = require('./ls-stub');

/* ---------- (1) determinism — same seed + progress ⇒ byte-identical markup ---------- */

test('ringSVG: same seed + same progress → byte-identical SVG (determinism, §6.2)', () => {
  const sandbox = loadEngine(
    makeLS({}),
    `globalThis.__out = {
       a: AW.ringSVG({ seed: 7, atomsDone: 20, circuitsDone: 1 }),
       b: AW.ringSVG({ seed: 7, atomsDone: 20, circuitsDone: 1 })
     };`
  );
  const out = sandbox.__out;
  assert.equal(out.a, out.b, 'identical inputs must produce a byte-for-byte identical string');
  assert.equal(out.a.indexOf('<svg'), 0, 'output must start with <svg');
});

/* ---------- (2) seed difference — no two learners share a fingerprint ---------- */

test('ringSVG: different seed at identical progress → different fingerprint (§6.6 #2)', () => {
  const sandbox = loadEngine(
    makeLS({}),
    `globalThis.__out = {
       s7: AW.ringSVG({ seed: 7, atomsDone: 20, circuitsDone: 1 }),
       s8: AW.ringSVG({ seed: 8, atomsDone: 20, circuitsDone: 1 })
     };`
  );
  const out = sandbox.__out;
  assert.notEqual(out.s7, out.s8, 'two seeds must yield visibly different markup');
});

/* ---------- (3) progression — all-faint → inked + closed gold thread ---------- */

test('ringSVG: atomsDone 0 differs from 65+4, and full progress carries thread + head (§6.6 #3)', () => {
  const sandbox = loadEngine(
    makeLS({}),
    `globalThis.__out = {
       none: AW.ringSVG({ seed: 3, atomsDone: 0, circuitsDone: 0 }),
       full: AW.ringSVG({ seed: 3, atomsDone: 65, circuitsDone: 4 })
     };`
  );
  const out = sandbox.__out;
  assert.notEqual(out.none, out.full, 'progress must change the rendered state');
  // Full progress: the gold thread is drawn (4 arcs) and the head-dot is present.
  assert.ok(out.full.indexOf('ring-thread') !== -1, 'full progress must draw the gold thread');
  assert.ok(out.full.indexOf('ring-head') !== -1, 'full progress must place the head-dot');
  const threadArcs = (out.full.match(/ring-thread/g) || []).length;
  assert.equal(threadArcs, 4, 'four completed circuits → four gold thread arcs (a closed ring)');
  // Zero progress: no circuit complete → no thread arc yet; the head still exists (static).
  assert.equal(out.none.indexOf('ring-thread'), -1, 'no completed circuit → no gold thread arc');
  assert.ok(out.none.indexOf('ring-head') !== -1, 'the head-dot exists even at zero progress');
});

/* ---------- (4) reduced motion — the final state, zero animation nodes ---------- */

test('ringSVG: reduced motion returns the final state statically — no draw animation (§6.5)', () => {
  const sandbox = loadEngine(
    makeLS({}),
    // Stub the call-time gate ON, then generate a mid-progress ring (which under normal motion
    // would carry the ink-draw animation on its in-progress frontier dabs).
    `AW.reducedMotion = function () { return true; };
     globalThis.__out = { reduced: AW.ringSVG({ seed: 5, atomsDone: 30, circuitsDone: 1 }) };`
  );
  const reduced = sandbox.__out.reduced;
  assert.equal(reduced.indexOf('ink-draw'), -1, 'reduced motion must omit the ink-draw animation');
  assert.equal(reduced.indexOf('stroke-dasharray'), -1, 'reduced motion must omit stroke-dasharray');
  assert.equal(reduced.indexOf('<svg'), 0, 'still a well-formed inline SVG');
});

test('ringSVG: under normal motion the same mid-progress ring DOES draw its frontier (branch proof)', () => {
  // Headless has no window/document, so AW.reducedMotion() is false by default — the animation
  // branch is exercised. This proves the reduced-motion test above is a real difference, not a
  // state that never animates in the first place.
  const sandbox = loadEngine(
    makeLS({}),
    `globalThis.__out = { normal: AW.ringSVG({ seed: 5, atomsDone: 30, circuitsDone: 1 }) };`
  );
  const normal = sandbox.__out.normal;
  assert.ok(normal.indexOf('ink-draw') !== -1, 'a mid-progress ring must draw its newly-inked dabs');
  assert.ok(normal.indexOf('stroke-dasharray') !== -1, 'draw animation is wired via stroke-dasharray + --len');
});

/* ---------- (5) perf budget — ≤600 path nodes, zero <filter> ---------- */

test('ringSVG: full-progress output is ≤600 <path nodes and carries no <filter> (§6.6 #6)', () => {
  const sandbox = loadEngine(
    makeLS({}),
    `globalThis.__out = { full: AW.ringSVG({ seed: 42, atomsDone: 65, circuitsDone: 4 }) };`
  );
  const full = sandbox.__out.full;
  const nodes = (full.match(/<path/g) || []).length;
  assert.ok(nodes > 0, 'the ring must actually emit path nodes');
  assert.ok(nodes <= 600, `path-node budget: ${nodes} must be ≤ 600`);
  assert.equal(full.indexOf('<filter'), -1, 'ink-bleed is stroke/opacity variance — never a filter');
});

/* ---------- (6) no-seed call uses the stored ringSeed (stable within a session) ---------- */

test('ringSVG: with no explicit seed, repeated calls are stable via the stored ringSeed', () => {
  const sandbox = loadEngine(
    makeLS({}),
    `globalThis.__out = {
       a: AW.ringSVG({ atomsDone: 10 }),
       b: AW.ringSVG({ atomsDone: 10 }),
       seed: AW.ringSeed()
     };`
  );
  const out = sandbox.__out;
  assert.equal(out.a, out.b, 'without a seed arg the generator falls back to the stable ringSeed');
  assert.ok(out.a.indexOf('data-seed="' + out.seed + '"') !== -1, 'the maker\'s mark seed is stamped into the markup');
});

/* ---------- (W1) the ringSeed lazy write must NOT clobber an unrecognized-future-schema blob ----------
   AW.ringSeed()'s first call is a new AW.S.set() site. load() deliberately refuses to persist over
   a from-the-future blob (CR-01), so set() must not either — the memFallback guard skips persist
   while working from that in-memory copy. This closes the plan-checker W1 gap; the seed is still
   stable within the degraded session, it just isn't written back over the untouched real blob. */
test('ringSeed: a from-the-future awba_state blob survives untouched on disk across a ringSeed() call (W1/CR-01)', () => {
  const rawBlob = JSON.stringify({ schemaVersion: 2, noor: 500, returns: 9, stars: { u4r: 3 }, days: [], chests: {} });
  const ls = makeLS({ awba_state: rawBlob });
  const sandbox = loadEngine(ls, `globalThis.__out = { s1: AW.ringSeed(), s2: AW.ringSeed() };`);
  assert.equal(sandbox.__out.s1, sandbox.__out.s2, 'the seed is stable within the session');
  assert.equal(ls._dump().awba_state, rawBlob, 'the future-schema blob must survive untouched on disk');
});
