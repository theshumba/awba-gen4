/* ============================================================================================
   scripts/tests/practice-pool-audit.mjs  ·  Awba Gen-4 v2 — the practice-pool byte-fidelity gate
   --------------------------------------------------------------------------------------------
   The port-audit-style guarantee that shared/practice-pool.js can NEVER drift from Josh's byte-frozen
   lesson content (§B.2). Follows scripts/port-audit.mjs's checkDailyFidelity shape: re-ingest() the
   15 lesson cfgs at gate time, re-derive the item set, and assert
     (1) every pool item byte-matches cfg.beats[idx] for its claimed {lesson, idx},
     (2) the pool contains items ONLY from the 15 lesson files, and every lesson id is a real NODE_ATOMS
         star key,
     (3) the pool captured EVERY eligible mc/tf/tile beat (no silent omission).
   Prints  PRACTICE-POOL BYTES OK  /  PRACTICE-POOL BYTES DRIFT <lesson> #<idx>  and exits 0/1. Runs
   unconditionally — before the pool exists it prints the honest "not yet present" and passes.

   Run:  node scripts/tests/practice-pool-audit.mjs
   ============================================================================================ */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { ingest } = require('../validate-content.js');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', '..');
const POOL = path.join(ROOT, 'shared', 'practice-pool.js');
const LESSONS_DIR = path.join(ROOT, 'lessons');
const ENGINE = path.join(ROOT, 'shared', 'awba-engine.js');
const QUIZ_TYPES = ['mc', 'tf', 'tile'];

function fail(msg) {
  console.log('PRACTICE-POOL BYTES DRIFT ' + msg);
  process.exit(1);
}

/* Load the classic-script pool the same way the browser does — assign to a window stub. */
function loadPool() {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(readFileSync(POOL, 'utf8'), sandbox, { filename: POOL });
  return sandbox.window.PRACTICE_POOL;
}

/* The 15 lesson-id star keys, parsed straight from the engine's module-private NODE_ATOMS map. */
function nodeAtomKeys() {
  const m = readFileSync(ENGINE, 'utf8').match(/var NODE_ATOMS\s*=\s*\{([\s\S]*?)\};/);
  if (!m) return null;
  const keys = [];
  const re = /([A-Za-z]\w*)\s*:/g;
  let k;
  while ((k = re.exec(m[1]))) keys.push(k[1]);
  return keys;
}

/* Re-ingest the 15 lessons at gate time (the authoritative, byte-frozen source). */
function ingestLessons() {
  const cfgs = {};
  readdirSync(LESSONS_DIR)
    .filter((f) => f.endsWith('.html') && !f.startsWith('.')) // dot-prefixed = transient harness probes, never content
    .sort()
    .forEach((f) => {
      const { cfg, kind } = ingest(path.join(LESSONS_DIR, f));
      if (kind === 'lesson' && cfg && cfg.id) cfgs[cfg.id] = cfg;
    });
  return cfgs;
}

function main() {
  if (!existsSync(POOL)) {
    console.log('PRACTICE-POOL BYTES OK — not yet present');
    process.exit(0);
  }

  const pool = loadPool();
  if (!pool || !Array.isArray(pool.items)) fail('— shared/practice-pool.js has no items array');

  const cfgs = ingestLessons();
  const validIds = new Set(Object.keys(cfgs));
  const atomKeys = nodeAtomKeys();
  if (!atomKeys) fail('— could not read NODE_ATOMS from the engine');
  const atomSet = new Set(atomKeys);

  // (1) every pool item is byte-verbatim vs its claimed source beat
  for (const entry of pool.items) {
    const cfg = cfgs[entry.lesson];
    if (!cfg) fail(entry.lesson + ' — not one of the 15 lesson files');
    const src = cfg.beats && cfg.beats[entry.idx];
    if (!src) fail(entry.lesson + ' #' + entry.idx + ' — no source beat at that index');
    if (QUIZ_TYPES.indexOf(src.t) < 0) fail(entry.lesson + ' #' + entry.idx + ' — source beat is not a quiz type');
    if (JSON.stringify(entry.item) !== JSON.stringify(src)) fail(entry.lesson + ' #' + entry.idx);
  }

  // (2) items come ONLY from the 15 lesson files; every lesson id is a real NODE_ATOMS star key
  for (const id of new Set(pool.items.map((e) => e.lesson))) {
    if (!validIds.has(id)) fail(id + ' — not one of the 15 lesson files');
    if (!atomSet.has(id)) fail(id + ' — not a NODE_ATOMS star key');
  }

  // (3) no silent omission — the pool holds EVERY eligible quiz beat across the 15 lessons
  let expected = 0;
  for (const id of Object.keys(cfgs)) {
    (cfgs[id].beats || []).forEach((b) => {
      if (b && QUIZ_TYPES.indexOf(b.t) >= 0) expected++;
    });
  }
  if (expected !== pool.items.length) {
    fail('— pool has ' + pool.items.length + ' items but the 15 lessons hold ' + expected + ' quiz beats');
  }

  console.log(
    'PRACTICE-POOL BYTES OK — ' + pool.items.length + ' items across ' + validIds.size +
      ' lessons, byte-verbatim vs the frozen cfgs'
  );
  process.exit(0);
}

main();
