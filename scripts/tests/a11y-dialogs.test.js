/* ============================================================================================
   a11y-dialogs.test.js  ·  Awba Gen-4 — D-63 overlay-contract probe x3 (D-68, Wave 0)
   --------------------------------------------------------------------------------------------
   A PERMANENT suite member (D-68) that pins the three shipped overlay scaffolds — AW.sheet, the
   .npop node popup, the .ofest Festival interstitial — as ACTIVE assertions and stages the
   not-yet-built containment/name/focus-move/focus-return gaps as todo-gated assertions, so the
   suite reports `fail 0` today. Extends the SAME harness pattern `learn-dom-flows.test.js`
   proved (throwaway copy + injected driver + a cached Chrome run + `finally` cleanup) without
   forking or editing that file — this is a fresh, self-contained pinning.

   Automation boundary (06-RESEARCH §Keyboard-Walk Probe): synthetic Escape/Tab keydown events DO
   fire document/element LISTENERS even though they are untrusted — so Escape-closes-overlay and a
   future focus-trap's wrap logic are both synthetically testable. The containment probes below
   dispatch a cancelable synthetic Tab at the overlay (the trap's own future keydown target per
   06-RESEARCH §Focus Containment: "keydown listener ON THE OVERLAY, not document") and read
   `event.defaultPrevented` — today nothing calls preventDefault, so this fails honestly; once
   `AW._trapFocus` lands it will intercept and preventDefault at the boundary, flipping the probe.

   Todo-staging contract (the phase's residue ledger depends on this exact count): TEN todo
   blocks — sheet containment-wrap + sheet focus-into + sheet accessible-name (3, flip in 06-04);
   popup containment-wrap + popup aria-modal + popup accessible-name + popup focus-move-on-open +
   popup focus-return (5, flip in 06-06); Festival containment-wrap + Festival focus-return (2,
   flip in 06-06). No test here combines the `skip` option with the `todo` option — a todo
   assertion that needs Chrome early-returns in its own body instead.

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

const chromeMissing = !existsSync(CHROME) || !existsSync(LEARN);
const skip = chromeMissing ? 'system Chrome or learn.html not found — interactive harness unavailable' : false;

/* the driver — injected before </body> of a throwaway copy of learn.html, so the real inline
   script (popup lifecycle, __awbaClaimChest, openFestival/closeFestival) runs byte-for-byte
   unmodified, plus the real shared AW.sheet. Three scenarios, each self-contained and self-
   resetting; results land in one JSON block the DOM dump ships back. */
const DRIVER = [
  '<script>',
  "window.addEventListener('load', function () {",
  '  var R = { sheet: {}, popup: {}, festival: {} };',
  "  function noor() { return AW.S.get('noor', 0); }",
  "  function seedUnit1() { AW.S.set('stars', { u1m1: 3, u1m2: 3, u1m3: 3, u1m4: 3, u1r: 3 }); }",
  "  function escDoc() { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); }",
  '  function dismissFestival() {',
  "    var all = document.querySelectorAll('.ofest');",
  '    for (var i = 0; i < all.length; i++) {',
  "      var b = all[i].querySelector('.ofest-close');",
  '      if (b) b.click();',
  '    }',
  '  }',
  '  /* tabWrapProbe — the future-trap seam: focus the LAST focusable inside `container`, dispatch a',
  '     cancelable synthetic Tab AT the container (the documented trap attach point), and read whether',
  '     it called preventDefault + whether activeElement wrapped to the first focusable. */',
  '  function tabWrapProbe(container) {',
  '    if (!container) return { defaultPrevented: null, wrapped: null, focusableCount: 0 };',
  "    var focusables = container.querySelectorAll('button:not([disabled]), a[href], textarea, input, select, [tabindex]:not([tabindex=\"-1\"])');",
  '    var first = focusables[0] || null, last = focusables[focusables.length - 1] || null;',
  '    if (last && last.focus) last.focus();',
  "    var ev = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });",
  '    container.dispatchEvent(ev);',
  '    return {',
  '      defaultPrevented: ev.defaultPrevented,',
  '      wrapped: first ? document.activeElement === first : null,',
  '      focusableCount: focusables.length,',
  '    };',
  '  }',
  '',
  '  // ---------- Scenario 1: AW.sheet (the streak sheet, opened from #hudReturns) ----------',
  '  try {',
  "    AW.S.set('chests', {}); AW.S.set('noor', 0);",
  "    var invoker = document.getElementById('hudReturns');",
  '    invoker.focus();',
  '    invoker.click();',
  "    var sheetEl = document.querySelector('.sheet');",
  "    R.sheet.role = sheetEl ? sheetEl.getAttribute('role') : null;",
  "    R.sheet.ariaModal = sheetEl ? sheetEl.getAttribute('aria-modal') : null;",
  "    R.sheet.ariaLabel = sheetEl ? sheetEl.getAttribute('aria-label') : null;",
  "    R.sheet.closeBtnTag = sheetEl && sheetEl.querySelector('.sheet-x') ? sheetEl.querySelector('.sheet-x').tagName : null;",
  '    // TODO probe — focus-into on open (expected false today: nothing focuses .sheet-x on open)',
  "    R.sheet.focusedIntoCloseBtn = !!(sheetEl && sheetEl.querySelector('.sheet-x') && document.activeElement === sheetEl.querySelector('.sheet-x'));",
  '    // TODO probe — containment wrap (expected defaultPrevented:false today)',
  '    R.sheet.wrap = tabWrapProbe(sheetEl);',
  '    // ACTIVE — Escape closes + invoker focus restore (already shipped, js:1064/1081)',
  "    var scrimBefore = document.querySelector('.scrim');",
  "    R.sheet.openBeforeEsc = !!(scrimBefore && scrimBefore.classList.contains('open'));",
  '    escDoc();',
  "    var scrimAfter = document.querySelector('.scrim');",
  "    R.sheet.openAfterEsc = !!(scrimAfter && scrimAfter.classList.contains('open'));",
  '    R.sheet.activeAfterEsc = document.activeElement === invoker;',
  '  } catch (e) { R.sheetError = String((e && e.message) || e); }',
  '',
  '  // ---------- Scenario 2: the .npop node popup (u1m1 active w/ CTA, u1m2 locked no CTA) ----------',
  '  try {',
  "    var node1 = document.querySelector('.onode[data-id=\"u1m1\"]');",
  "    var node2 = document.querySelector('.onode[data-id=\"u1m2\"]');",
  '    node1.click();',
  "    var pop1 = document.querySelector('.npop');",
  "    R.popup.singletonRoleFirst = pop1 ? pop1.getAttribute('role') : null;",
  '    node2.click();',
  "    var popsAfterSecond = document.querySelectorAll('.npop');",
  '    R.popup.singletonCountAfterSecondOpen = popsAfterSecond.length;',
  '    escDoc();',
  "    R.popup.closedAfterEsc = document.querySelectorAll('.npop').length === 0;",
  '    // re-open node1 (has a real .np-cta anchor — a genuine focusable target) for the richer probes',
  '    node1.click();',
  "    var pop = document.querySelector('.npop');",
  "    R.popup.ariaModal = pop ? pop.getAttribute('aria-modal') : null;",
  "    var labelEl = pop ? pop.querySelector('.np-label') : null;",
  "    R.popup.labelledby = pop ? pop.getAttribute('aria-labelledby') : null;",
  '    R.popup.labelHasId = !!(labelEl && labelEl.id);',
  '    // TODO probe — focus-move-on-open (expected false today: nothing moves focus into the popup)',
  '    R.popup.focusMovedIn = !!(pop && pop.contains(document.activeElement) && document.activeElement !== node1);',
  '    // TODO probe — containment wrap',
  '    R.popup.wrap = tabWrapProbe(pop);',
  '    // ACTIVE — outside-tap closes (learn:344-347, shipped)',
  '    document.body.click();',
  "    R.popup.closedAfterOutsideTap = document.querySelectorAll('.npop').length === 0;",
  '    // TODO probe — focus-return on close (expected false today: closePop() never calls .focus())',
  '    R.popup.focusReturnedToTrigger = document.activeElement === node1;',
  '  } catch (e) { R.popupError = String((e && e.message) || e); }',
  '',
  '  // ---------- Scenario 3: the .ofest Festival + the claim-before-open Escape ordering ----------',
  '  try {',
  '    seedUnit1();',
  "    AW.S.set('chests', {}); AW.S.set('noor', 0);",
  '    var b1 = noor();',
  "    window.__awbaClaimChest('u1c');",
  "    var fest = document.querySelector('.ofest');",
  "    R.festival.role = fest ? fest.getAttribute('role') : null;",
  "    R.festival.ariaModal = fest ? fest.getAttribute('aria-modal') : null;",
  "    R.festival.ariaLabel = fest ? fest.getAttribute('aria-label') : null;",
  "    var closeBtn = fest ? fest.querySelector('.ofest-close') : null;",
  '    R.festival.focusedOnOpen = document.activeElement === closeBtn;',
  '    // TODO probe — containment wrap (the single-focusable self-loop; defaultPrevented is the',
  '    // meaningful signal since wrap-to-first is trivially true with only one focusable target)',
  '    R.festival.wrap = tabWrapProbe(fest);',
  '    // claim-before-open Escape ordering — an immediate Escape after the claim keeps the +25',
  '    escDoc();',
  '    var a1 = noor();',
  "    R.festival.deltaAfterImmediateEscape = a1 - b1;",
  "    R.festival.chestClaimed = !!AW.S.get('chests', {}).u1c;",
  '    dismissFestival();',
  '    // TODO probe — focus-return-after-render: closeFestival() re-renders the path THEN removes the',
  '    // overlay; focus should land back on the re-queried u1c chest node (expected false today).',
  "    var chestNode = document.querySelector('.onode[data-id=\"u1c\"]');",
  '    R.festival.focusReturnedToChestNode = document.activeElement === chestNode;',
  '  } catch (e) { R.festivalError = String((e && e.message) || e); }',
  '',
  "  var s = document.createElement('script');",
  "  s.type = 'application/json'; s.id = 'a11ydlg-results';",
  '  s.textContent = JSON.stringify(R);',
  '  document.body.appendChild(s);',
  "  document.title = 'A11YDLG-DONE';",
  '});',
  '</scr' + 'ipt>',
].join('\n');

function runProbe() {
  const html = readFileSync(LEARN, 'utf8');
  const probe = path.join(ROOT, '.a11ydlg-probe.html');
  writeFileSync(probe, html.replace('</body>', DRIVER + '\n</body>'));
  try {
    let stdout = '';
    try {
      stdout = execFileSync(
        CHROME,
        ['--headless', '--disable-gpu', '--enable-logging=stderr', '--v=1', '--virtual-time-budget=5000', '--dump-dom', 'file://' + probe],
        { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 30000, maxBuffer: 1024 * 1024 * 64 }
      );
    } catch (e) {
      stdout = e.stdout ? e.stdout.toString() : '';
    }
    const m = stdout.match(/<script type="application\/json" id="a11ydlg-results">([\s\S]*?)<\/script>/);
    return { results: m ? JSON.parse(m[1]) : null, ranToCompletion: stdout.indexOf('A11YDLG-DONE') !== -1 };
  } finally {
    try { unlinkSync(probe); } catch (e) { /* nothing to clean */ }
  }
}

const run = chromeMissing ? null : runProbe();
const result = run && run.results;

/* ---------- the interactive harness runs end-to-end ---------- */

test('the dialogs interactive harness drives the shipped inline script + shared engine to completion', { skip }, () => {
  assert.ok(run, 'the probe produced a run');
  assert.equal(run.ranToCompletion, true, 'the injected driver reached its final stamp');
  assert.ok(result, 'the driver published a results block');
  assert.equal(result.sheetError, undefined, 'the sheet scenario ran without an unexpected error');
  assert.equal(result.popupError, undefined, 'the popup scenario ran without an unexpected error');
  assert.equal(result.festivalError, undefined, 'the Festival scenario ran without an unexpected error');
});

/* ---------- ACTIVE: AW.sheet — role/aria-modal + Escape-closes + invoker focus restore ---------- */

test('AW.sheet renders role="dialog" + aria-modal="true", closes on Escape, and restores focus to the invoker (D-63, shipped)', { skip }, () => {
  assert.ok(result, 'the driver produced a run');
  assert.equal(result.sheet.role, 'dialog', 'the sheet carries role="dialog"');
  assert.equal(result.sheet.ariaModal, 'true', 'the sheet carries aria-modal="true"');
  assert.equal(result.sheet.openBeforeEsc, true, 'the sheet is open before Escape is dispatched');
  assert.equal(result.sheet.openAfterEsc, false, 'Escape closes the sheet');
  assert.equal(result.sheet.activeAfterEsc, true, 'focus is restored to the triggering HUD button on close');
});

/* ---------- ACTIVE: the .npop node popup — role + singleton + Escape + outside-tap ---------- */

test('the .npop node popup is role="dialog", singleton, and closes on Escape and on an outside tap (D-63, shipped)', { skip }, () => {
  assert.ok(result, 'the driver produced a run');
  assert.equal(result.popup.singletonRoleFirst, 'dialog', 'the popup carries role="dialog"');
  assert.equal(result.popup.singletonCountAfterSecondOpen, 1, 'opening a second popup closes the first — exactly one .npop ever exists');
  assert.equal(result.popup.closedAfterEsc, true, 'Escape closes the open popup');
  assert.equal(result.popup.closedAfterOutsideTap, true, 'an outside tap closes the open popup');
});

/* ---------- ACTIVE: the Festival overlay — role/aria-modal/name + focus-on-open + claim ordering ---------- */

test('the Festival overlay is role="dialog" + aria-modal + named + moves focus to its close control on open (D-63, shipped)', { skip }, () => {
  assert.ok(result, 'the driver produced a run');
  assert.equal(result.festival.role, 'dialog', 'the Festival overlay carries role="dialog"');
  assert.equal(result.festival.ariaModal, 'true', 'the Festival overlay carries aria-modal="true"');
  assert.equal(result.festival.ariaLabel, 'A gift of light', 'the Festival overlay carries its shipped accessible name');
  assert.equal(result.festival.focusedOnOpen, true, 'focus moves to .ofest-close on open');
});

test('claim-before-open ordering: an immediate Escape after a chest claim keeps the +25 (06-RESEARCH §Focus Containment)', { skip }, () => {
  assert.ok(result, 'the driver produced a run');
  assert.equal(result.festival.deltaAfterImmediateEscape, 25, 'the chest claim grants exactly +25 noor even with an immediate Escape dismissal');
  assert.equal(result.festival.chestClaimed, true, 'the chest is marked claimed regardless of the immediate Escape');
});

/* ---------- TODO (exactly TEN — the phase's residue ledger depends on this exact count) ---------- */

test('D-63: the sheet trap wraps Tab focus within itself — lands in 06-04', { todo: 'D-63: sheet containment-wrap lands in 06-04' }, () => {
  if (chromeMissing) return;
  assert.ok(result, 'the driver produced a run');
  assert.equal(result.sheet.wrap.defaultPrevented, true, 'a Tab dispatched at the sheet boundary must be intercepted by the shared focus-trap helper');
});

test('D-63: focus moves into the sheet on open (.sheet-x) — lands in 06-04', { todo: 'D-63: sheet focus-into lands in 06-04' }, () => {
  if (chromeMissing) return;
  assert.ok(result, 'the driver produced a run');
  assert.equal(result.sheet.focusedIntoCloseBtn, true, 'opening the sheet must move focus onto .sheet-x');
});

test('D-63: AW.sheet carries an accessible name — lands in 06-04', { todo: 'D-63: sheet accessible-name lands in 06-04' }, () => {
  if (chromeMissing) return;
  assert.ok(result, 'the driver produced a run');
  assert.ok(result.sheet.ariaLabel, 'AW.sheet(html, label) must set an aria-label on the sheet (default "Details")');
});

test('D-63: the popup trap wraps Tab focus within itself — lands in 06-06', { todo: 'D-63: popup containment-wrap lands in 06-06' }, () => {
  if (chromeMissing) return;
  assert.ok(result, 'the driver produced a run');
  assert.equal(result.popup.wrap.defaultPrevented, true, 'a Tab dispatched at the popup boundary must be intercepted by the shared focus-trap helper');
});

test('D-63: the popup carries aria-modal="true" — lands in 06-06', { todo: 'D-63: popup aria-modal lands in 06-06' }, () => {
  if (chromeMissing) return;
  assert.ok(result, 'the driver produced a run');
  assert.equal(result.popup.ariaModal, 'true', 'the .npop element must carry aria-modal="true"');
});

test('D-63: the popup carries an accessible name (aria-labelledby → .np-label) — lands in 06-06', { todo: 'D-63: popup accessible-name lands in 06-06' }, () => {
  if (chromeMissing) return;
  assert.ok(result, 'the driver produced a run');
  assert.ok(result.popup.labelledby, 'the popup must carry aria-labelledby pointing at .np-label');
  assert.equal(result.popup.labelHasId, true, '.np-label must carry the id the aria-labelledby reference targets');
});

test('D-63: focus moves onto the popup dialog on open — lands in 06-06', { todo: 'D-63: popup focus-move-on-open lands in 06-06' }, () => {
  if (chromeMissing) return;
  assert.ok(result, 'the driver produced a run');
  assert.equal(result.popup.focusMovedIn, true, 'opening the popup must move focus onto the dialog (tabindex="-1" self-focus per S4, since a locked popup has no CTA)');
});

test('D-63: focus returns to the triggering node when the popup closes — lands in 06-06', { todo: 'D-63: popup focus-return lands in 06-06' }, () => {
  if (chromeMissing) return;
  assert.ok(result, 'the driver produced a run');
  assert.equal(result.popup.focusReturnedToTrigger, true, 'closing the popup must restore focus to the .onode that opened it');
});

test('D-63: the Festival trap wraps Tab focus within itself — lands in 06-06', { todo: 'D-63: Festival containment-wrap lands in 06-06' }, () => {
  if (chromeMissing) return;
  assert.ok(result, 'the driver produced a run');
  assert.equal(result.festival.wrap.defaultPrevented, true, 'a Tab dispatched at the Festival boundary must be intercepted by the shared focus-trap helper, even in its single-focusable self-loop');
});

test('D-63: focus returns to the re-rendered chest node after the Festival closes — lands in 06-06', { todo: 'D-63: Festival focus-return lands in 06-06' }, () => {
  if (chromeMissing) return;
  assert.ok(result, 'the driver produced a run');
  assert.equal(result.festival.focusReturnedToChestNode, true, 'closeFestival() must re-query the chest node by data-id AFTER render() and focus it (Pitfall 6)');
});
