/* ============================================================================================
   dua-default.test.js  ·  Awba Gen-4 v2 — the G3 default closing-dua splice (Wave-A)
   --------------------------------------------------------------------------------------------
   Proves AW._duaBlock (the dua-close scripture-block builder duaClose() consumes) against the real
   shared/awba-engine.js, headlessly. The G3 ruling (CONTENT-DECISIONS §G3): when a lesson omits
   cfg.dua the engine renders a class-b, pending-review DEFAULT dua (Ibn Ḥibbān 974 · Sahih) plus its
   corroborated English translation as a quiet line under the Arabic; a per-lesson cfg.dua overrides
   the default entirely. The exact bytes are read from CONTENT-DECISIONS.md so this test is also a
   drift guard on the splice. Zero deps (ls-stub, D-25).
   ============================================================================================ */
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { makeLS, loadEngine } = require('./ls-stub');

const ROOT = path.join(__dirname, '..', '..');
const DECISIONS = fs.readFileSync(path.join(ROOT, '.planning', 'v2-intel', 'CONTENT-DECISIONS.md'), 'utf8');

/* The byte-exact source of truth (from CONTENT-DECISIONS §G3 / Implementation notes). */
const DUA_AR = DECISIONS.match(/dua:\s*\{\s*ar:\s*'([^']+)'/)[1];
const DUA_SRC = DECISIONS.match(/source:\s*'([^']+)'\s*\}/)[1];
const DUA_TR = DECISIONS.match(/translation `([^`]+)`/)[1];

function duaBlock(arg) {
  const sb = loadEngine(makeLS({}), `globalThis.__out = AW._duaBlock(${arg});`);
  return sb.__out;
}

test('G3: with no cfg.dua, the engine renders the DEFAULT dua (Arabic + translation + Ibn Ḥibbān source)', () => {
  const html = duaBlock('null');
  assert.ok(html.includes('<p class="scripture" lang="ar" dir="rtl">' + DUA_AR + '</p>'),
    'the default Arabic renders in .scripture (general Amiri), lang=ar dir=rtl');
  assert.ok(html.includes('<p class="close">' + DUA_TR + '</p>'),
    'the corroborated English translation renders as a quiet .close line under the Arabic');
  assert.ok(html.includes('<p class="close">' + DUA_SRC + ' · pending review</p>'),
    'the source line is "Ibn Ḥibbān 974 · Sahih · pending review" (engine appends the suffix)');
});

test('G3: the translation is NOT in the Quran face and no transliteration is surfaced', () => {
  const html = duaBlock('null');
  // the translation line uses .close (workhorse), never .ayah (Amiri Quran) — scripture-face law
  assert.ok(!/class="ayah"/.test(html), 'the dua default must not use the Amiri Quran (.ayah) face');
  // no transliteration string leaks in (the ruling: translation only, no transliteration)
  assert.ok(!/Allāhumma|jaʿaltahu/.test(html), 'no transliteration is rendered');
});

test('G3: the pending-review suffix is appended exactly once (never doubled)', () => {
  const html = duaBlock('null');
  assert.equal((html.match(/pending review/g) || []).length, 1, 'exactly one pending-review suffix');
  assert.ok(!DUA_SRC.includes('pending review'), 'the stored source must NOT already carry the suffix');
});

test('G3: a per-lesson cfg.dua overrides the default entirely (Arabic + source only, no translation)', () => {
  const html = duaBlock("{ ar: 'CUSTOM_AR', source: 'Custom 12 · Hasan' }");
  assert.ok(html.includes('<p class="scripture" lang="ar" dir="rtl">CUSTOM_AR</p>'), 'the lesson Arabic renders');
  assert.ok(html.includes('<p class="close">Custom 12 · Hasan · pending review</p>'), 'the lesson source renders');
  assert.ok(!html.includes(DUA_AR), 'the default Arabic must NOT appear when cfg.dua is present');
  assert.ok(!html.includes(DUA_TR), 'no translation line when cfg.dua overrides (override is entire)');
});

test('G3: a string cfg.dua renders Arabic only; an object with no ar renders nothing', () => {
  assert.equal(duaBlock("'JUST_ARABIC'"), '<p class="scripture" lang="ar" dir="rtl">JUST_ARABIC</p>');
  assert.equal(duaBlock("{ source: 'X' }"), '', 'no Arabic → empty block (never an orphan source line)');
});
