/* ============================================================================================
   components.test.js  ·  Awba Gen-4 — AW.icon / AW.cite / escapeHtml / AW.reducedMotion + registry
   --------------------------------------------------------------------------------------------
   Pins the PURE-STRING / value contracts of the COMPONENTS layer (Phase 3, FND-04 / ENG-06 /
   MOT-04) against the real shared/awba-engine.js, headlessly, via node --test — mirroring the
   loadEngine(ls, probeSrc) + globalThis.__out concatenation idiom proven in state-helpers.test.js
   (const AW is a lexical binding, so engine+probe MUST run as ONE runInContext call — ls-stub.js
   handles that). DOM/sheet/motion BEHAVIOUR is not unit-tested here (grep gates + the D-44 human
   visual gate own that); these are string-shape + registry-integrity assertions only, so no
   readOut() JSON round-trip is needed (only primitive/string returns cross the vm boundary).
   ============================================================================================ */
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { makeLS, loadEngine } = require('./ls-stub');

/* ---------- AW.icon (FND-04 / D-32) ---------- */

test('AW.icon: default injects aria-hidden="true" + focusable="false"', () => {
  const sandbox = loadEngine(makeLS({}), `globalThis.__out = AW.icon('mosque');`);
  assert.match(sandbox.__out, /^<svg /);
  assert.match(sandbox.__out, /aria-hidden="true"/);
  assert.match(sandbox.__out, /focusable="false"/);
});

test('AW.icon: {label} injects role="img" + aria-label and NOT aria-hidden', () => {
  const sandbox = loadEngine(
    makeLS({}),
    `globalThis.__out = AW.icon('mosque', { label: 'Unit 1' });`
  );
  assert.match(sandbox.__out, /role="img"/);
  assert.match(sandbox.__out, /aria-label="Unit 1"/);
  assert.doesNotMatch(sandbox.__out, /aria-hidden/);
});

test('AW.icon: label carrying markup is HTML-escaped inside aria-label', () => {
  const sandbox = loadEngine(
    makeLS({}),
    `globalThis.__out = AW.icon('mosque', { label: '<b>&"x' });`
  );
  assert.match(sandbox.__out, /aria-label="&lt;b&gt;&amp;&quot;x"/);
});

test('AW.icon: missing name returns "" (a string, never undefined, never throws)', () => {
  const sandbox = loadEngine(
    makeLS({}),
    `globalThis.__out = { m: AW.icon('does-not-exist'), typ: typeof AW.icon('does-not-exist') };`
  );
  assert.equal(sandbox.__out.m, '');
  assert.equal(sandbox.__out.typ, 'string');
});

test('AW.icon: falls back to AW.GLYPHS when the name is not in AW.KIT', () => {
  const sandbox = loadEngine(makeLS({}), `globalThis.__out = AW.icon('cite');`);
  assert.match(sandbox.__out, /^<svg /);
  assert.match(sandbox.__out, /aria-hidden="true"/);
});

/* ---------- AW.cite (ENG-06 / D-37) ---------- */

test('AW.cite: preserves the validator-compatible <span class="cite" data-ref="…"> shape', () => {
  const sandbox = loadEngine(
    makeLS({}),
    `globalThis.__out = AW.cite('hujurat-49-15', 'al-Ḥujurāt 49:15');`
  );
  assert.match(sandbox.__out, /^<span class="cite" data-ref="hujurat-49-15">/);
  assert.match(sandbox.__out, /<\/span>$/);
});

test('AW.cite: escapes the label before concatenation', () => {
  const sandbox = loadEngine(makeLS({}), `globalThis.__out = AW.cite('x', '<b>&"');`);
  assert.match(sandbox.__out, /&lt;b&gt;&amp;&quot;/);
  assert.doesNotMatch(sandbox.__out, /<b>&"/);
});

/* ---------- escapeHtml (T-03-04 output-encoding) ---------- */

test('escapeHtml: entity-escapes & < > "', () => {
  const sandbox = loadEngine(makeLS({}), `globalThis.__out = escapeHtml('<b>&"');`);
  assert.equal(sandbox.__out, '&lt;b&gt;&amp;&quot;');
});

/* ---------- AW.reducedMotion (MOT-04 / D-42) ---------- */

test('AW.reducedMotion: true via matchMedia, true via [data-motion=reduce], false when neither', () => {
  // trigger 1 — OS "Reduce motion" via matchMedia
  let sandbox = loadEngine(
    makeLS({}),
    `globalThis.window = { matchMedia: function () { return { matches: true }; } };
     globalThis.__out = AW.reducedMotion();`
  );
  assert.equal(sandbox.__out, true);

  // trigger 2 — in-app awba_prefs override stamped [data-motion="reduce"]
  sandbox = loadEngine(
    makeLS({}),
    `globalThis.window = { matchMedia: function () { return { matches: false }; } };
     globalThis.document = { documentElement: { getAttribute: function () { return 'reduce'; } } };
     globalThis.__out = AW.reducedMotion();`
  );
  assert.equal(sandbox.__out, true);

  // neither — motion is allowed
  sandbox = loadEngine(
    makeLS({}),
    `globalThis.window = { matchMedia: function () { return { matches: false }; } };
     globalThis.document = { documentElement: { getAttribute: function () { return null; } } };
     globalThis.__out = AW.reducedMotion();`
  );
  assert.equal(sandbox.__out, false);
});

/* ---------- AW.KIT / AW.GLYPHS registry integrity (FND-04) ---------- */

test('AW.KIT: exactly 20 scene entries, every value starts with <svg', () => {
  const sandbox = loadEngine(
    makeLS({}),
    `globalThis.__out = {
       kitCount: Object.keys(AW.KIT).length,
       allSvg: Object.keys(AW.KIT).every(function (k) { return AW.KIT[k].indexOf('<svg') === 0; })
     };`
  );
  assert.equal(sandbox.__out.kitCount, 20);
  assert.equal(sandbox.__out.allSvg, true);
});

test('AW.GLYPHS: exactly 13 entries, every value starts with <svg', () => {
  const sandbox = loadEngine(
    makeLS({}),
    `globalThis.__out = {
       glyphCount: Object.keys(AW.GLYPHS).length,
       allSvg: Object.keys(AW.GLYPHS).every(function (k) { return AW.GLYPHS[k].indexOf('<svg') === 0; })
     };`
  );
  assert.equal(sandbox.__out.glyphCount, 13);
  assert.equal(sandbox.__out.allSvg, true);
});
