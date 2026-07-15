/* ============================================================================================
   state-sheets.test.js  ·  Awba Gen-4 v2 — AW.streakSheet()/AW.noorSheet() (Wave-A seam S3)
   --------------------------------------------------------------------------------------------
   Proves the hoisted returns/noor stat sheets against the real shared/awba-engine.js, headlessly.
   They read ONLY AW.state()/AW.weekCal() and render via AW.sheet, so a stub over AW.sheet captures
   the exact (html, label) they produce for a known state — a byte-pin of the shipped .osh-* markup
   + copy. A second check proves PARITY with learn.html's still-inline openStreakSheet/openNoorSheet
   (the retired builders this hoist mirrors verbatim); it is conditional so it survives the Wave-C
   adoption that removes the inline copy. Zero deps (ls-stub Map-backed localStorage, D-25).
   ============================================================================================ */
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { makeLS, loadEngine } = require('./ls-stub');

const ROOT = path.join(__dirname, '..', '..');
const LEARN_SRC = fs.readFileSync(path.join(ROOT, 'learn.html'), 'utf8');

/* The verbatim copy this hoist mirrors (the byte source of truth is learn.html's inline builders). */
const STREAK_NOTE = 'This number can never break and never reset. Every return adds to it, however long the gap. That is the point of this place.';
const NOOR_NOTE = 'Light you collect as you learn. It is never spent against you, never dangled, and it never runs out.';

/* Run a sheet call against a seeded state with AW.sheet stubbed to capture (html, label). */
function runSheet(call, state) {
  const ls = makeLS({ awba_state: JSON.stringify(Object.assign({ schemaVersion: 1, noor: 0, returns: 0, lastDay: null, days: [], stars: {}, chests: {} }, state)) });
  const sb = loadEngine(ls, `
    var cap = {};
    AW.sheet = function (html, label) { cap.html = html; cap.label = label; return {}; };
    ${call};
    globalThis.__out = cap;
  `);
  return { html: sb.__out.html, label: sb.__out.label };
}

test('S3: AW.streakSheet() renders the shipped .osh-* markup, plural copy, week dots, and accessible name', () => {
  const { html, label } = runSheet('AW.streakSheet()', { returns: 5, days: [] });
  assert.equal(label, 'Your streak');
  assert.ok(html.startsWith('<div class="grip"></div>'), 'sheet opens with the grip handle');
  assert.ok(html.includes('<div class="osh-big">5</div>'), 'the returns count renders in .osh-big (no gold)');
  assert.ok(html.includes('<div class="osh-sub">days you came back</div>'), 'plural sub-copy for returns !== 1');
  assert.ok(html.includes('<div class="weekcal osh-week">'), 'the week row renders');
  assert.equal((html.match(/<span class="day"/g) || []).length, 7, 'seven day dots, none lit (days: [])');
  assert.ok(html.includes('<div class="osh-note">' + STREAK_NOTE + '</div>'), 'the never-breaks note copy is byte-exact');
});

test('S3: AW.streakSheet() uses the singular "day you came back" when returns === 1', () => {
  const { html } = runSheet('AW.streakSheet()', { returns: 1, days: [] });
  assert.ok(html.includes('<div class="osh-big">1</div>'));
  assert.ok(html.includes('<div class="osh-sub">day you came back</div>'), 'singular sub-copy for returns === 1');
});

test('S3: AW.noorSheet() renders the gold .osh-big count, the noor note, and accessible name', () => {
  const { html, label } = runSheet('AW.noorSheet()', { noor: 120 });
  assert.equal(label, 'Noor gathered');
  assert.ok(html.startsWith('<div class="grip"></div>'));
  assert.ok(html.includes('<div class="osh-big osh-gold">120</div>'), 'the noor count renders in the gold .osh-big');
  assert.ok(html.includes('<div class="osh-sub">noor gathered</div>'));
  assert.ok(html.includes('<div class="osh-note">' + NOOR_NOTE + '</div>'), 'the noor note copy is byte-exact');
});

test('S3: parity — while learn.html still carries the inline builders, their copy byte-matches the hoist', () => {
  // Conditional so this survives the Wave-C adoption that deletes the inline builders from learn.html.
  if (/function openStreakSheet\(/.test(LEARN_SRC)) {
    assert.ok(LEARN_SRC.includes(STREAK_NOTE), 'learn.html openStreakSheet note must byte-match AW.streakSheet');
    assert.ok(LEARN_SRC.includes("'Your streak'"), 'learn.html openStreakSheet label must byte-match AW.streakSheet');
  }
  if (/function openNoorSheet\(/.test(LEARN_SRC)) {
    assert.ok(LEARN_SRC.includes(NOOR_NOTE), 'learn.html openNoorSheet note must byte-match AW.noorSheet');
    assert.ok(LEARN_SRC.includes("'Noor gathered'"), 'learn.html openNoorSheet label must byte-match AW.noorSheet');
  }
});
