#!/usr/bin/env node
/* ============================================================================================
   scripts/build-practice-pool.js  ·  Awba Gen-4 v2 — the practice item-pool generator (Wave-A data)
   --------------------------------------------------------------------------------------------
   A DEV-TIME data-preparation step (run by a developer like the font-subsetting pass — NOT a build
   pipeline). Extracts every mc/tf/tile quiz beat from the 15 LESSON cfgs BYTE-VERBATIM (native field
   names retained, reviews excluded — §B.2) into shared/practice-pool.js, a classic-script global the
   file://-openable practice session loads. It reuses validate-content.js's node:vm ingest() (the
   D-26 capture trick) — never a regex over the object literal (D-25/D-26) — so a beat that embeds an
   AW.cite(id, label) call is captured with the SAME stub markup the fidelity gate re-derives, making
   the pool provably unable to drift from Josh's byte-frozen content.

   Run:   node scripts/build-practice-pool.js
   Then:  node scripts/tests/practice-pool-audit.mjs   (must print PRACTICE-POOL BYTES OK)
   ============================================================================================ */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { ingest } = require('./validate-content.js');

const ROOT = path.join(__dirname, '..');
const LESSONS_DIR = path.join(ROOT, 'lessons');
const OUT = path.join(ROOT, 'shared', 'practice-pool.js');
const QUIZ_TYPES = ['mc', 'tf', 'tile'];

function lessonFiles() {
  return fs
    .readdirSync(LESSONS_DIR)
    .filter((f) => f.endsWith('.html'))
    .sort()
    .map((f) => path.join(LESSONS_DIR, f));
}

function build() {
  const lessons = {};
  const items = [];
  let quizCount = 0;

  lessonFiles().forEach((file) => {
    const { cfg, kind } = ingest(file);
    if (kind !== 'lesson') {
      throw new Error('build-practice-pool: ' + path.basename(file) + ' did not ingest as a lesson');
    }
    if (!cfg || typeof cfg.id !== 'string' || !cfg.id) {
      throw new Error('build-practice-pool: ' + path.basename(file) + ' has no cfg.id');
    }
    const id = cfg.id;
    // provenance for AW.wire — the lesson's own refs + terms, verbatim
    lessons[id] = { refs: cfg.refs || {}, terms: cfg.terms || {} };
    (cfg.beats || []).forEach((beat, idx) => {
      if (beat && QUIZ_TYPES.indexOf(beat.t) >= 0) {
        items.push({ lesson: id, idx: idx, item: beat }); // the beat is copied BYTE-VERBATIM (t retained)
        quizCount++;
      }
    });
  });

  return {
    generated: new Date().toISOString().slice(0, 10), // provenance stamp only (not compared by the gate)
    lessons: lessons,
    items: items,
    _quizCount: quizCount,
  };
}

function main() {
  const pool = build();
  const quizCount = pool._quizCount;
  delete pool._quizCount;

  const body =
    '/* ============================================================================================\n' +
    '   shared/practice-pool.js  ·  Awba Gen-4 v2 — GENERATED, DO NOT EDIT BY HAND.\n' +
    '   Rebuild: node scripts/build-practice-pool.js   ·   Verify: node scripts/tests/practice-pool-audit.mjs\n' +
    '   --------------------------------------------------------------------------------------------\n' +
    '   Every mc/tf/tile quiz beat from the 15 lesson cfgs, extracted BYTE-VERBATIM (native field\n' +
    '   names) via validate-content.js ingest() — reviews excluded (§B.2). A classic script assigning\n' +
    '   window.PRACTICE_POOL (file://-safe, no fetch, NO storage). The practice session filters\n' +
    '   items by completed-lesson star presence and feeds each beat to AW._beatHtml/AW.practiceRun;\n' +
    '   lessons[id].refs/terms wire the shipped citation/term sheets. Byte-fidelity is gate-proven\n' +
    '   (practice-pool-audit.mjs must print PRACTICE-POOL BYTES OK) — the pool cannot drift from\n' +
    '   Josh\'s SHA-frozen content.\n' +
    '   ============================================================================================ */\n' +
    'window.PRACTICE_POOL = ' + JSON.stringify(pool, null, 2) + ';\n';

  fs.writeFileSync(OUT, body);
  console.log(
    'practice-pool: wrote ' + path.relative(ROOT, OUT) + ' — ' +
      quizCount + ' items from ' + Object.keys(pool.lessons).length + ' lessons.'
  );
}

main();
