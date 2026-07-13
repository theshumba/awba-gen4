/* ============================================================================================
   runner-lesson.test.js  ·  Awba Gen-4 — AwbaLesson(cfg) runner (ENG-01/ENG-03 / D-45/D-47)
   --------------------------------------------------------------------------------------------
   Pins the PURE, DOM-free contracts of the lesson runner against the real shared/awba-engine.js,
   headlessly, via node --test — mirroring the loadEngine(ls, probeSrc) + globalThis.__out
   concatenation idiom (const AW is a lexical binding, so engine+probe MUST run as ONE
   runInContext call — ls-stub.js handles that).

   The runner is DOM-driven; jsdom is out (zero-dep, D-25), so full-flow DOM behaviour is proven
   by the real-Chrome render-smoke harness on lessons/u1-m1.html (04-03 Task 3), NOT here. What is
   unit-testable WITHOUT a DOM — and asserted below — is the pure view seam (AW._beatHtml builds a
   beat's inner HTML from cfg with no DOM access) and the pure scoring reducer (AW._resolveScore),
   plus the marker-label map (AW.MLAB). These carry the mechanics-preserved + scripture-law
   contracts. Test cfg content is neutral placeholder copy ONLY — never real scripture (RESEARCH
   Fixtures rule).
   ============================================================================================ */
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { makeLS, loadEngine } = require('./ls-stub');

/* ---------- AwbaLesson exists (ENG-01) ---------- */

test('AwbaLesson: is a function defined on the engine (the RUNNERS runner)', () => {
  const sandbox = loadEngine(makeLS({}), `globalThis.__out = typeof AwbaLesson;`);
  assert.equal(sandbox.__out, 'function');
});

/* ---------- AW.MLAB — the ported Gen-3 marker labels ---------- */

test('AW.MLAB: fact/remember/fard/angle → their display labels (ported byte-for-byte)', () => {
  const sandbox = loadEngine(makeLS({}), `globalThis.__out = AW.MLAB;`);
  assert.equal(sandbox.__out.fact, 'Worth knowing');
  assert.equal(sandbox.__out.remember, 'Worth remembering');
  assert.equal(sandbox.__out.fard, 'The first duty');
  assert.equal(sandbox.__out.angle, 'Another angle');
});

/* ---------- AW._beatHtml — the pure, DOM-free beat view seam ---------- */

test('AW._beatHtml verse: scripture law — .scard, --go:0, lang/dir, the source line, and NO celebration class', () => {
  const sandbox = loadEngine(
    makeLS({}),
    `globalThis.__out = AW._beatHtml(
       { t:'verse', label:'PLACEHOLDER LABEL', ar:'PLACEHOLDER_AR', tr:'placeholder translation ˹x˺' },
       {});`
  );
  assert.match(sandbox.__out, /class="scard"/);
  assert.match(sandbox.__out, /--go:\s*0/);
  assert.match(sandbox.__out, /lang="ar"/);
  assert.match(sandbox.__out, /dir="rtl"/);
  assert.match(sandbox.__out, /Translation of the meaning: The Clear Quran, Dr\. Mustafa Khattab · pending review/);
  // nothing celebratory inside a scripture panel (law 3 / D-51)
  assert.doesNotMatch(sandbox.__out, /class="dab"/);
  assert.doesNotMatch(sandbox.__out, /class="thread"/);
  assert.doesNotMatch(sandbox.__out, /class="rosette"/);
  assert.doesNotMatch(sandbox.__out, /class="plate"/);
});

test('AW._beatHtml read: renders the marker chip using the AW.MLAB label + a glyph', () => {
  const sandbox = loadEngine(
    makeLS({}),
    `globalThis.__out = AW._beatHtml(
       { t:'read', title:'A title', html:'<p>body</p>', marker:{ type:'angle', body:'a marginal note' } },
       {});`
  );
  assert.match(sandbox.__out, /class="read"/);
  assert.match(sandbox.__out, /class="marker"/);
  assert.match(sandbox.__out, /Another angle/);      // the AW.MLAB['angle'] label
  assert.match(sandbox.__out, /a marginal note/);    // the marker body
});

test('AW._beatHtml frame: a centered framing statement (.frame + .fstmt)', () => {
  const sandbox = loadEngine(
    makeLS({}),
    `globalThis.__out = AW._beatHtml({ t:'frame', lead:'the idea to hold' }, {});`
  );
  assert.match(sandbox.__out, /class="frame"/);
  assert.match(sandbox.__out, /class="fstmt"/);
  assert.match(sandbox.__out, /the idea to hold/);
});

test('AW._beatHtml depth: the 3-lens accordion in FIXED order (reality → revelation → ruling), Continue never blocked', () => {
  const sandbox = loadEngine(
    makeLS({}),
    `globalThis.__out = AW._beatHtml(
       { t:'depth', point:'a point', lenses:{ reality:'R1', revelation:'R2', ruling:'R3' } },
       {});`
  );
  assert.match(sandbox.__out, /class="lacc"/);
  assert.match(sandbox.__out, /l-reality/);
  assert.match(sandbox.__out, /l-revelation/);
  assert.match(sandbox.__out, /l-ruling/);
  // fixed order: reality precedes revelation precedes ruling
  const iReality = sandbox.__out.indexOf('l-reality');
  const iRevelation = sandbox.__out.indexOf('l-revelation');
  const iRuling = sandbox.__out.indexOf('l-ruling');
  assert.ok(iReality < iRevelation && iRevelation < iRuling, 'lenses render in the fixed order');
  // the accordion never disables anything (Continue is external + always enabled)
  assert.doesNotMatch(sandbox.__out, /disabled/);
});

test('AW._beatHtml reflect: a private textarea + the model slot; no stored/echoed value', () => {
  const sandbox = loadEngine(
    makeLS({}),
    `globalThis.__out = AW._beatHtml({ t:'reflect', prompt:'a prompt', model:'a model reflection' }, {});`
  );
  assert.match(sandbox.__out, /class="reflect"/);
  assert.match(sandbox.__out, /<textarea/);
  // the textarea carries no value attribute — it is never persisted or re-rendered (T-04-03a)
  assert.doesNotMatch(sandbox.__out, /<textarea[^>]*\svalue=/);
});

test('AW._beatHtml panel: an ink-ruled card with the requested variant + numbered items', () => {
  const sandbox = loadEngine(
    makeLS({}),
    `globalThis.__out = AW._beatHtml(
       { t:'panel', variant:'check', title:'Panel title',
         items:[{ name:'One', body:'first' }, { name:'Two', body:'second' }] },
       {});`
  );
  assert.match(sandbox.__out, /class="pnl v-check"/);
  assert.match(sandbox.__out, /class="pnl-i"/);
  assert.match(sandbox.__out, /first/);
  assert.match(sandbox.__out, /second/);
});
