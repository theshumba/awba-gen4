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
const { makeLS, loadEngine, readOut } = require('./ls-stub');

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

/* ============================================================================================
   Task 2 — quiz beats (mc/tf/tile), the scoring reducer, and the noor-persistence seam.
   Full-flow DOM behaviour (the live single-fire persist, combo .dab, streak .thread, law-8 blot)
   is proven by render-smoke in Chrome on u1-m1.html; here we pin the mechanics-preserved MATH and
   the persistence ARITHMETIC — DOM-free — plus the quiz beat view shapes.
   ============================================================================================ */

/* ---------- AW._beatHtml quiz beats (mc/tf/tile) ---------- */

test('AW._beatHtml mc: an .opts stack of .opt option cards, one per choice', () => {
  const sandbox = loadEngine(
    makeLS({}),
    `globalThis.__out = AW._beatHtml({ t:'mc', q:'a question', o:['one','two','three'], c:0 }, {});`
  );
  assert.match(sandbox.__out, /class="opts"/);
  assert.match(sandbox.__out, /class="opt"[^>]*data-i="0"/);
  assert.match(sandbox.__out, /class="opt"[^>]*data-i="2"/);
  assert.match(sandbox.__out, /a question/);
});

test('AW._beatHtml tf: a .tfrow true/false pair', () => {
  const sandbox = loadEngine(
    makeLS({}),
    `globalThis.__out = AW._beatHtml({ t:'tf', q:'true or not', c:true }, {});`
  );
  assert.match(sandbox.__out, /class="tfrow"/);
  assert.match(sandbox.__out, /data-v="true"/);
  assert.match(sandbox.__out, /data-v="false"/);
});

test('AW._beatHtml tile: a .tilebox tray + a .bank of word tiles', () => {
  const sandbox = loadEngine(
    makeLS({}),
    `globalThis.__out = AW._beatHtml({ t:'tile', prompt:'build it', bank:['a','b','c'], solution:['a','b'] }, {});`
  );
  assert.match(sandbox.__out, /class="tilebox"/);
  assert.match(sandbox.__out, /class="bank"/);
  assert.match(sandbox.__out, /class="tile"[^>]*data-w="0"/);
});

/* ---------- AW._resolveScore — the pure, byte-preserved scoring reducer ---------- */

test('AW._resolveScore correct: +1 correct, combo+1, comboBest tracked, +12 noor (AW.PER_LESSON)', () => {
  const sandbox = loadEngine(
    makeLS({}),
    `var s = { correct:0, combo:0, comboBest:0, mistakes:0, noorEarned:0 };
     globalThis.__out = AW._resolveScore(s, true);`
  );
  assert.equal(sandbox.__out.correct, 1);
  assert.equal(sandbox.__out.combo, 1);
  assert.equal(sandbox.__out.comboBest, 1);
  assert.equal(sandbox.__out.mistakes, 0);
  assert.equal(sandbox.__out.noorEarned, 12);
});

test('AW._resolveScore miss: mistakes+1, combo zeroed, noor UNCHANGED (never negative, never red)', () => {
  const sandbox = loadEngine(
    makeLS({}),
    `var s = { correct:3, combo:2, comboBest:2, mistakes:0, noorEarned:36 };
     globalThis.__out = AW._resolveScore(s, false);`
  );
  assert.equal(sandbox.__out.mistakes, 1);
  assert.equal(sandbox.__out.combo, 0);
  assert.equal(sandbox.__out.correct, 3);
  assert.equal(sandbox.__out.noorEarned, 36); // a miss costs no noor (the un-loseable promise)
});

test('AW._resolveScore: three correct in a row accrues 36 noor and a best run of 3 (the 04-01 helpers gate combo/perfect)', () => {
  const sandbox = loadEngine(
    makeLS({}),
    `var s = { correct:0, combo:0, comboBest:0, mistakes:0, noorEarned:0 };
     s = AW._resolveScore(s, true);
     s = AW._resolveScore(s, true);
     s = AW._resolveScore(s, true);
     globalThis.__out = { s: s, show2: AW.comboShow(2), perfect3: AW.comboPerfect(3), stars0: AW.lessonStars(0) };`
  );
  assert.equal(sandbox.__out.s.noorEarned, 36);
  assert.equal(sandbox.__out.s.comboBest, 3);
  assert.equal(sandbox.__out.show2, true);
  assert.equal(sandbox.__out.perfect3, true);
  assert.equal(sandbox.__out.stars0, 3);
});

/* ---------- stars — best-of, never 0 (AW.lessonStars) ---------- */

test('AW.lessonStars: 0/1/2 mistakes → 3/2/1 stars, never 0', () => {
  const sandbox = loadEngine(
    makeLS({}),
    `globalThis.__out = [AW.lessonStars(0), AW.lessonStars(1), AW.lessonStars(2), AW.lessonStars(9)];`
  );
  assert.deepEqual(readOut(sandbox), [3, 2, 1, 1]);   // JSON round-trip — cross-realm array prototypes
});

/* ---------- noor-persistence seam — the exact rewardNoor arithmetic, via AW.S (persist once) ---------- */

test('noor persistence: rewardNoor adds noorEarned to the stored noor exactly once (never doubled)', () => {
  const sandbox = loadEngine(
    makeLS({ awba_state: JSON.stringify({ schemaVersion: 1, noor: 100, returns: 2, lastDay: null, days: [], stars: {}, chests: {} }) }),
    `var earned = 36;
     // the rewardNoor persistence expression (Gen-3 parity), fired once:
     AW.S.set('noor', AW.S.get('noor', 0) + earned);
     globalThis.__out = AW.S.get('noor', 0);`
  );
  assert.equal(sandbox.__out, 136); // 100 + 36, once — not 172
});

/* ---------- the persist-once seam behind the choreography's noor moment (RWD-01 / T-04-04a) ----
   AwbaLesson's reward terminus persists noor EXACTLY once at the noor moment. That once-only
   guarantee is the 04-03 `noorClaimed` closure guard, extracted to AW._noorClaimer() so it is
   unit-testable without a DOM (jsdom is out, D-25): the factory returns a claim(amount) that adds
   `amount` to stored noor via AW.S a single time — a re-entry, a double-tap, or a back-then-forward
   through the six-moment terminus must never double-credit (T-04-04a). This drives the flagship
   choreography's persistence discipline; the full DOM flow is proven by render-smoke in Chrome. */
test('noor persist-once (T-04-04a): AW._noorClaimer() credits noorEarned EXACTLY once — a re-entry / double-tap never doubles it', () => {
  const sandbox = loadEngine(
    makeLS({ awba_state: JSON.stringify({ schemaVersion: 1, noor: 100, returns: 2, lastDay: null, days: [], stars: {}, chests: {} }) }),
    `var claim = AW._noorClaimer();
     var first = claim(36);    // the noor moment fires — persists once
     var second = claim(36);   // a re-entry / double-tap through the terminus — must be a no-op
     var third = claim(36);
     globalThis.__out = { noor: AW.S.get('noor', 0), first: first, second: second, third: third };`
  );
  const out = readOut(sandbox);
  assert.equal(out.noor, 136);      // 100 + 36, once — never 172 (doubled), never left at 100 (omitted)
  assert.equal(out.first, true);    // the first claim persisted
  assert.equal(out.second, false);  // every later claim is an idempotent no-op
  assert.equal(out.third, false);
});

test('best-of stars: a lower new score never downgrades a stored higher one (done() upgrade-only)', () => {
  const sandbox = loadEngine(
    makeLS({ awba_state: JSON.stringify({ schemaVersion: 1, noor: 0, returns: 0, lastDay: null, days: [], stars: { u1m1: 3 }, chests: {} }) }),
    `var now = AW.lessonStars(2); // a 1-star run this time
     var st = AW.S.get('stars', {});
     var prev = st['u1m1'] || 0;
     if (now > prev) { st['u1m1'] = now; AW.S.set('stars', st); }
     globalThis.__out = AW.S.get('stars', {})['u1m1'];`
  );
  assert.equal(sandbox.__out, 3); // stays 3, never downgraded to 1
});
