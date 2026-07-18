/* ============================================================================================
   learn-dom-flows.test.js  ·  Awba Gen-4 — REAL learn-page interactive DOM flows (WR-04)
   --------------------------------------------------------------------------------------------
   Phase-5 review WR-04: the popup / chest-claim / Festival flows had ZERO automated coverage of
   their REAL implementation — only a hand-reimplemented stand-in was pinned in learn-state.test.js,
   which is why WR-01 (an uncaught throw on a corrupted chests blob) shipped undetected.

   This file closes that gap without jsdom (D-25 stands): it drives the ACTUAL shipped learn.html
   inline script in system Chrome headless — the SAME harness pattern as render-smoke.mjs (system
   Chrome, --dump-dom, throwaway probe at repo root removed in `finally`, zero npm packages). A
   driver injected before </body> seeds an in-memory state through the real AW.S, calls the real
   window.__awbaClaimChest, inspects the real Festival overlay, and publishes its findings as a
   JSON data-block the DOM dump carries back out.

   Pinned here against the real code:
     - a chest claim grants EXACTLY +25 noor once; a second claim is a no-op (RWD-04/D-56)
     - the Festival overlay mounts on document.body as an aria-modal dialog and dismisses cleanly
     - WR-01: a corrupted chests:null blob now claims cleanly instead of throwing (+25, marked)
     - NON-VACUOUS PROOF: the same run against a guard-REVERTED copy of learn.html reintroduces the
       uncaught TypeError — so the WR-01 pin genuinely fails if the fix is ever reverted.

   Runs only via the glob:  node --test scripts/tests/*.test.js
   ============================================================================================ */
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { existsSync, readFileSync, writeFileSync, unlinkSync } = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..', '..');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const LEARN = path.join(ROOT, 'learn.html');

/* The exact WR-01 guard as it must appear in the shipped source. Removing this one line reverts
   the fix — that is how the non-vacuous proof simulates the regression. */
const GUARD_RE = /if \(!chests \|\| typeof chests !== 'object'\) chests = \{\};/;
const GUARD_LINE_RE = /[ \t]*if \(!chests \|\| typeof chests !== 'object'\) chests = \{\};[^\n]*\n/;

/* The driver — injected before </body> of a THROWAWAY copy of learn.html so the real inline script
   (popup lifecycle, __awbaClaimChest, openFestival, closeFestival) runs byte-for-byte unmodified.
   It runs on `load` (after the IIFE has defined everything + rendered), exercises the flows through
   the real functions, and stamps the outcome into a JSON <script> the DOM dump ships back. */
const DRIVER = [
  '<script>',
  "window.addEventListener('load', function () {",
  '  var R = { happy: {}, corrupt: {} };',
  "  function noor() { return AW.S.get('noor', 0); }",
  "  function seedUnit1() { AW.S.set('stars', { u1m1: 3, u1m2: 3, u1m3: 3, u1m4: 3, u1r: 3 }); }",
  '  function dismissFestival() {',
  '    // dismiss EVERY open overlay: an overlay from a prior scenario is not removed synchronously',
  '    // (its removal is a 500ms timer), so we must close each one to schedule its teardown.',
  "    var all = document.querySelectorAll('.ofest');",
  '    for (var i = 0; i < all.length; i++) {',
  "      var b = all[i].querySelector('.ofest-close');",
  '      if (b) b.click();',
  '    }',
  '  }',
  '  try {',
  '    seedUnit1();',
  "    AW.S.set('chests', {});",
  "    AW.S.set('noor', 0);",
  '    var b1 = noor(), t1 = false;',
  "    try { window.__awbaClaimChest('u1c'); } catch (e) { t1 = String((e && e.message) || e); }",
  '    var a1 = noor();',
  "    var fest = document.querySelector('.ofest');",
  '    R.festivalMountedOnBody = !!(fest && fest.parentNode === document.body);',
  "    R.festivalRole = fest ? fest.getAttribute('role') : null;",
  "    R.festivalAriaModal = fest ? fest.getAttribute('aria-modal') : null;",
  '    dismissFestival();',
  "    var festAfter = document.querySelector('.ofest');",
  "    R.festivalOpenAfterClose = festAfter ? festAfter.classList.contains('open') : false;",
  '    var t2 = false;',
  "    try { window.__awbaClaimChest('u1c'); } catch (e) { t2 = String((e && e.message) || e); }",
  '    var a2 = noor();',
  '    R.happy = { deltaFirst: a1 - b1, deltaSecond: a2 - a1, threwFirst: t1, threwSecond: t2,',
  "                chestClaimed: !!AW.S.get('chests', {}).u1c };",
  '  } catch (e) { R.happyError = String((e && e.message) || e); }',
  '  try {',
  '    seedUnit1();',
  "    AW.S.set('chests', null);",
  "    AW.S.set('noor', 0);",
  '    var bc = noor(), tc = false;',
  "    try { window.__awbaClaimChest('u1c'); } catch (e) { tc = String((e && e.message) || e); }",
  '    var ac = noor();',
  "    var cc = AW.S.get('chests', {});",
  '    R.corrupt = { threw: tc, delta: ac - bc, chestClaimed: !!(cc && cc.u1c) };',
  '    dismissFestival();',
  '  } catch (e) { R.corruptError = String((e && e.message) || e); }',
  "  var s = document.createElement('script');",
  "  s.type = 'application/json';",
  "  s.id = 'wr04-results';",
  '  s.textContent = JSON.stringify(R);',
  '  document.body.appendChild(s);',
  "  document.title = 'WR04-DONE';",
  '});',
  '</scr' + 'ipt>',
].join('\n');

const chromeMissing = !existsSync(CHROME) || !existsSync(LEARN);
const skip = chromeMissing ? 'system Chrome or learn.html not found — interactive harness unavailable' : false;

/* Run one harness copy in headless Chrome and read back the driver's JSON results block. */
function runHarness(html, tag) {
  const probe = path.join(ROOT, '.wr04-' + tag + '.html');
  writeFileSync(probe, html.replace('</body>', DRIVER + '\n</body>'));
  try {
    let stdout = '';
    try {
      stdout = execFileSync(
        CHROME,
        [
          '--headless',
          '--disable-gpu',
          '--enable-logging=stderr',
          '--v=1',
          '--virtual-time-budget=5000',
          '--dump-dom',
          // ?begin=1 short-circuits learn.html's §0.4 first-run redirect guard (else the probe bounces
          // to onboarding.html before the injected driver runs).
          'file://' + probe + '?begin=1',
        ],
        { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 30000, killSignal: 'SIGKILL', maxBuffer: 1024 * 1024 * 64 }
      );
    } catch (e) {
      stdout = e.stdout ? e.stdout.toString() : '';
    }
    const m = stdout.match(/<script type="application\/json" id="wr04-results">([\s\S]*?)<\/script>/);
    return {
      results: m ? JSON.parse(m[1]) : null,
      ranToCompletion: /WR04-DONE/.test(stdout),
      lingeringOpenFestival: /class="ofest[^"]*\bopen\b[^"]*"/.test(stdout),
    };
  } finally {
    try { unlinkSync(probe); } catch (e) { /* nothing to clean */ }
  }
}

/* Compute both runs once (Chrome is slow); the pins below assert against the cached outcomes. */
const realHtml = existsSync(LEARN) ? readFileSync(LEARN, 'utf8') : '';
const revertedHtml = realHtml.replace(GUARD_LINE_RE, '');
const real = chromeMissing ? null : runHarness(realHtml, 'real');
const reverted = chromeMissing ? null : runHarness(revertedHtml, 'reverted');

/* ---------- (1) the WR-01 guard is actually present in the shipped source (no Chrome needed) ---------- */

test('WR-01 guard is present in the shipped learn.html (a corrupted/null chests blob is coerced to {})', () => {
  assert.match(realHtml, GUARD_RE, 'learn.html must guard the chests read before indexing it');
  assert.doesNotMatch(revertedHtml, GUARD_RE, 'the revert simulation must actually remove the guard line');
  assert.notEqual(revertedHtml, realHtml, 'the reverted copy must differ from the real source');
});

/* ---------- (2) the real learn.html harness runs end-to-end ---------- */

test('the real learn.html interactive harness drives the shipped inline script to completion', { skip }, () => {
  assert.ok(real, 'the real harness produced a run');
  assert.equal(real.ranToCompletion, true, 'the injected driver reached its final stamp on the real learn.html');
  assert.ok(real.results, 'the driver published a results block');
  assert.equal(real.results.happyError, undefined, 'the happy-path scenario ran without an unexpected driver error');
  assert.equal(real.results.corruptError, undefined, 'the corrupted-blob scenario ran without an unexpected driver error');
});

/* ---------- (3) chest claim: +25 exactly once, second is a no-op (RWD-04/D-56) ---------- */

test('real chest claim grants exactly +25 noor once; a second claim is a no-op', { skip }, () => {
  const h = real.results.happy;
  assert.equal(h.threwFirst, false, 'the first claim does not throw');
  assert.equal(h.deltaFirst, 25, 'the first claim grants exactly +25 noor');
  assert.equal(h.chestClaimed, true, 'the chest is marked claimed');
  assert.equal(h.threwSecond, false, 'the second claim does not throw');
  assert.equal(h.deltaSecond, 0, 'the second claim grants no further noor (idempotent)');
});

/* ---------- (4) the Festival overlay mounts on body as an aria-modal dialog and dismisses ---------- */

test('the Festival overlay mounts on document.body as an aria-modal dialog and dismisses cleanly', { skip }, () => {
  const r = real.results;
  assert.equal(r.festivalMountedOnBody, true, 'the Festival overlay is appended to document.body, never inside the Orbit register');
  assert.equal(r.festivalRole, 'dialog', 'the Festival overlay is role="dialog"');
  assert.equal(r.festivalAriaModal, 'true', 'the Festival overlay is aria-modal');
  assert.equal(r.festivalOpenAfterClose, false, 'dismissing the Festival drops its open state');
  assert.equal(real.lingeringOpenFestival, false, 'no open Festival overlay lingers in the final DOM');
});

/* ---------- (5) WR-01: a corrupted chests:null blob claims cleanly instead of throwing ---------- */

test('WR-01: a corrupted chests:null blob claims cleanly instead of throwing (+25, chest marked)', { skip }, () => {
  const c = real.results.corrupt;
  assert.equal(c.threw, false, 'the corrupted-blob claim does not throw against the fixed code');
  assert.equal(c.delta, 25, 'the corrupted-blob claim still grants exactly +25 noor');
  assert.equal(c.chestClaimed, true, 'the corrupted-blob claim marks the chest claimed (repairing the blob)');
});

/* ---------- (6) NON-VACUOUS PROOF: reverting the guard reintroduces the uncaught TypeError ---------- */

test('non-vacuous: reverting the WR-01 guard reintroduces the uncaught TypeError on a null chests blob', { skip }, () => {
  assert.ok(reverted, 'the reverted-guard harness produced a run');
  assert.equal(reverted.ranToCompletion, true, 'the reverted harness itself still runs the driver to completion');
  // The healthy path is unaffected by the revert — proves the harness is sound, not broken.
  assert.equal(reverted.results.happy.deltaFirst, 25, 'without the null blob, the reverted code still claims +25 once');
  // The corrupted path THROWS once the guard is gone — this is what pin (5) protects against.
  assert.notEqual(reverted.results.corrupt.threw, false, 'without the guard, the corrupted-blob claim throws');
  assert.match(
    String(reverted.results.corrupt.threw),
    /null/i,
    'the reverted throw is the null-index TypeError WR-01 documented'
  );
  assert.equal(reverted.results.corrupt.delta, 0, 'the reverted throw blocks the claim — no noor granted');
});

/* ---------- (7) VT MORPH COHERENCE: the pagereveal selector must match a class the real opener renders ----------
   05-VERIFICATION gap: the reveal-side selector pointed at a class no real lesson page renders,
   so the shared-element morph silently never fired. This pin extracts the selector from the
   engine's pagereveal handler and asserts the SAME class name appears as a rendered class in the
   engine's opener template — if either side drifts (selector repoint or template rename), it fails. */

test('vt morph coherence: pagereveal selector matches a class the opener template actually renders', () => {
  const src = readFileSync(path.join(ROOT, 'shared', 'awba-engine.js'), 'utf8');
  const reveal = src.match(/pagereveal[\s\S]{0,400}?querySelector\('([^']+)'\)/);
  assert.ok(reveal, 'the pagereveal handler has a querySelector selector');
  const sel = reveal[1];
  assert.ok(sel.startsWith('.'), 'the reveal selector is a class selector: ' + sel);
  const cls = sel.slice(1);
  assert.ok(
    new RegExp('class="[^"]*\\b' + cls + '\\b[^"]*"').test(src),
    'the opener template renders class "' + cls + '" (selector ↔ template coherence)'
  );
});
