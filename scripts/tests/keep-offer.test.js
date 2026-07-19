/* ============================================================================================
   keep-offer.test.js  ·  Awba Gen-4 v2.4 — the keep-your-light offer (owner item 2)
   --------------------------------------------------------------------------------------------
   Safari can tidy away a page's saved things after ~7 quiet days; the mercy answer is ONE gentle
   offer at the first completed review — a quiet line + "Keep a travel code" on the result
   screen, opening a cream sheet with the code, a copy affordance, and one honest install lean.
   Pinned headlessly (AW._keepOfferRow is the pure test seam; the sheet/copy wiring is
   source-pinned — jsdom is out):
     · the row renders for a fresh, uninstalled, codeable profile — and ONLY then
     · offered once: the 'keepOffered' pref silences it forever (stamped by bindKeepOffer)
     · standalone (installed) profiles are never offered — the store is not evicted
     · an un-codeable blob (btoa-hostile foreign value) offers nothing rather than a dead sheet
     · result() composes the row + bind; the chest path carries NO hook (review always first)
     · the words export/import/token/base64 never surface — it is "a travel code"
     · no new storage-API literal (count stays 13)
   ============================================================================================ */
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { makeLS, loadEngine } = require('./ls-stub');

const ROOT = path.join(__dirname, '..', '..');
const ENGINE_SRC = fs.readFileSync(path.join(ROOT, 'shared', 'awba-engine.js'), 'utf8');
const LEARN_SRC = fs.readFileSync(path.join(ROOT, 'learn.html'), 'utf8');

function blob(over) {
  return JSON.stringify(Object.assign(
    { schemaVersion: 1, noor: 40, returns: 3, lastDay: null, days: [], stars: { u1m1: 3 }, chests: {} },
    over || {}
  ));
}

/* a minimal fake window for the standalone check — addEventListener must exist because the
   engine's multi-tab listeners register through any provided window. */
function fakeWindow(standaloneMatches) {
  return {
    addEventListener: function () {},
    matchMedia: function () { return { matches: !!standaloneMatches }; },
  };
}

test('keep-offer: a fresh, uninstalled, codeable profile is offered the row', () => {
  const sandbox = loadEngine(makeLS({ awba_state: blob() }), `globalThis.__out = AW._keepOfferRow();`);
  assert.ok(/kp-offer/.test(sandbox.__out), 'the row renders');
  assert.ok(/Keep a travel code/.test(sandbox.__out), 'with the calm ghost door');
  assert.ok(/your own hands/.test(sandbox.__out), 'and the honest line');
});

test('keep-offer: the keepOffered pref silences it forever (offered once, never re-nagged)', () => {
  const sandbox = loadEngine(
    makeLS({
      awba_state: blob(),
      awba_prefs: JSON.stringify({ schemaVersion: 1, soundMuted: false, motion: 'system', keepOffered: true }),
    }),
    `globalThis.__out = AW._keepOfferRow();`);
  assert.equal(sandbox.__out, '', 'the one offer was already made');
});

test('keep-offer: an installed (standalone) profile is never offered — its store is not evicted', () => {
  const sandbox = loadEngine(makeLS({ awba_state: blob() }),
    `globalThis.__out = AW._keepOfferRow();`, { window: fakeWindow(true) });
  assert.equal(sandbox.__out, '', 'standalone display-mode skips the offer');
});

test('keep-offer: an uninstalled browser window IS offered (matchMedia false)', () => {
  const sandbox = loadEngine(makeLS({ awba_state: blob() }),
    `globalThis.__out = AW._keepOfferRow();`, { window: fakeWindow(false) });
  assert.ok(/kp-offer/.test(sandbox.__out));
});

test('keep-offer: an un-codeable blob (btoa-hostile foreign value) offers nothing', () => {
  // the L-2 path: a legacy-migrated star value carrying non-Latin-1 makes exportToken return null
  const sandbox = loadEngine(makeLS({ awba_state: blob({ stars: { u1m1: 'ωμέγα' } }) }),
    `globalThis.__out = { row: AW._keepOfferRow(), code: AW.S.exportToken() };`);
  const out = sandbox.__out;
  assert.equal(out.code, null, 'the premise: this blob cannot mint a code');
  assert.equal(out.row, '', 'no code → no offer — never a door to an empty room');
});

test('keep-offer: result() composes the row and binds it; the pref is stamped at bind', () => {
  const reviewSlice = ENGINE_SRC.slice(ENGINE_SRC.indexOf('function AwbaReview'), ENGINE_SRC.indexOf('AW.practiceMemory'));
  assert.ok(/keepOfferRow\(\) \+/.test(reviewSlice), 'the result screen composes the row');
  assert.ok(/bindKeepOffer\(root\);/.test(reviewSlice), 'and binds it after the swap');
  const bindBody = ENGINE_SRC.slice(ENGINE_SRC.indexOf('function bindKeepOffer'), ENGINE_SRC.indexOf('function openKeepSheet'));
  assert.ok(/AW\.prefs\.set\(KEEP_PREF, true\)/.test(bindBody), 'the offered-once stamp rides the render, not the tap');
  assert.ok(/if \(!b\) return;/.test(bindBody), 'a rowless result is a clean no-op');
});

test('keep-offer: the sheet leans on install and points to More — mercy words only', () => {
  const sheetBody = ENGINE_SRC.slice(ENGINE_SRC.indexOf('function openKeepSheet'), ENGINE_SRC.indexOf('AW._keepOfferRow ='));
  assert.ok(/home screen/.test(sheetBody), 'the install lean is present');
  assert.ok(/More · Move to a new device/.test(sheetBody), 'the standing pointer to More');
  assert.ok(/Copy the code/.test(sheetBody), 'the copy affordance');
  // the user-visible copy never says export/import/base64 — pull the single-quoted UI strings and check
  const uiStrings = (sheetBody.match(/'[^']*'/g) || []).join(' ').toLowerCase();
  assert.equal(/base64|\bexport\b|\bimport\b/.test(uiStrings), false, 'engine-internal words never surface in the sheet');
});

test('keep-offer: the chest path carries NO hook — the review is always the first milestone', () => {
  assert.equal(/keepOffer|kpOpen|Keep a travel code/.test(LEARN_SRC), false,
    'learn.html (chest claim + Festival) is untouched by design (reopenable)');
});

test('keep-offer: the storage-API literal count stays 13', () => {
  const matches = ENGINE_SRC.match(/localStorage/g) || [];
  assert.equal(matches.length, 13);
});
