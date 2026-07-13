#!/usr/bin/env node
/* ============================================================================================
   port-audit.mjs  ·  Awba Gen-4 — content port gate (Wave-0 harness, D-49 / CNT-01 / CNT-02)
   --------------------------------------------------------------------------------------------
   Not a node:test file — an explicit per-wave tool invoked directly:
     node scripts/port-audit.mjs

   For every ported page in lessons/ + reviews/:
     1. Byte-fidelity — locate the AwbaLesson({...})/AwbaReview({...}) cfg region, SHA-256 it, and
        assert equality against the SHA-256 of the byte-identical cfg region in the matching
        Gen-3 source file (verbatim-content law: splice, never retype). Prints `BYTES OK <page>`
        or `BYTES DRIFT <page>`.
     2. The CDN-absence gate — no ported page carries a third-party font stylesheet link (the
        zero-CDN law; every Gen-3 source file carries one and it must be stripped on port).
     3. The retired-element gate — no ported page reintroduces a retired Gen-3 celebration
        class/library (the Gate-2 Athar lock; D-45 re-voices these, never reintroduces them).
     4. The sensitive-holds pass (CNT-02) — asserts the U4-03 lesson file is NOT present (the
        absence IS the hold) and prints the 3 expected validate-content.js `note:` warnings as
        ACCEPTED so no future executor "resolves" them by editing content (that would violate D-49).

   Exits non-zero on any byte-drift / CDN leak / retired-element hit / hold violation. When
   lessons/ and reviews/ are both absent or empty (Wave 1, before the content port lands), exits 0
   with "no pages yet" — this becomes a real gate the moment the 19 files are ported (04-06).

   Zero-dependency: Node core only (child_process/crypto/fs/path/url) — no npm packages.
   ============================================================================================ */
'use strict';

import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SOURCE_ROOT = '/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD';

/* Matches from the `AwbaLesson(`/`AwbaReview(` call through the closing `);` right before the
   inline script tag ends — the whole cfg object-literal argument, byte for byte. */
const CFG_RE = /Awba(?:Lesson|Review)\(([\s\S]*)\);\s*<\/script>/;

function sha256(str) {
  return createHash('sha256').update(str, 'utf8').digest('hex');
}

function cfgRegion(src) {
  const m = src.match(CFG_RE);
  return m ? m[1] : null;
}

function listPages(dir) {
  const abs = path.join(ROOT, dir);
  if (!existsSync(abs)) return [];
  return readdirSync(abs)
    .filter((f) => f.endsWith('.html'))
    .map((f) => ({ name: f, dir, abs: path.join(abs, f) }));
}

function checkByteFidelity(pages) {
  let ok = true;
  for (const page of pages) {
    const portedSrc = readFileSync(page.abs, 'utf8');
    const portedCfg = cfgRegion(portedSrc);
    const sourcePath = path.join(SOURCE_ROOT, page.dir, page.name);

    if (!existsSync(sourcePath)) {
      console.log(`BYTES DRIFT ${page.name} — no matching Gen-3 source file found`);
      ok = false;
      continue;
    }
    const sourceCfg = cfgRegion(readFileSync(sourcePath, 'utf8'));

    if (portedCfg === null || sourceCfg === null) {
      console.log(`BYTES DRIFT ${page.name} — could not locate a cfg region to compare`);
      ok = false;
      continue;
    }
    if (sha256(portedCfg) !== sha256(sourceCfg)) {
      console.log(`BYTES DRIFT ${page.name}`);
      ok = false;
      continue;
    }
    console.log(`BYTES OK ${page.name}`);
  }
  return ok;
}

/* grepFindsMatch — true when `pattern` (case-insensitive, extended regex) appears anywhere in
   any existing target directory. Implemented via Node child_process rather than a shell `!`
   negation, so this file never needs the ugrep `--`-leading-pattern paren-wrap caution. */
function grepFindsMatch(pattern, dirs) {
  const targets = dirs.filter((d) => existsSync(path.join(ROOT, d)));
  if (targets.length === 0) return false;
  try {
    execSync(`grep -rqiE '${pattern}' ${targets.join(' ')}`, { cwd: ROOT });
    return true; // grep exit 0 = a match was found
  } catch (e) {
    return false; // grep exit 1 = no match
  }
}

function main() {
  const pages = [...listPages('lessons'), ...listPages('reviews')];
  if (pages.length === 0) {
    console.log('no pages yet');
    process.exit(0);
  }

  let allOk = true;

  if (!checkByteFidelity(pages)) allOk = false;

  if (grepFindsMatch('fonts\\.googleapis', ['lessons', 'reviews'])) {
    console.log('CDN LEAK — a third-party font stylesheet survived the port');
    allOk = false;
  }

  const retiredPattern = ['confetti', 'class="perfect"', 'class="combo"', 'poppins'].join('|');
  if (grepFindsMatch(retiredPattern, ['lessons', 'reviews'])) {
    console.log('RETIRED ELEMENT — a retired Gen-3 celebration class/library survived the port');
    allOk = false;
  }

  /* Sensitive holds (CNT-02 / D-49): U4-03 is absent entirely — the absence IS the hold. */
  const u403 = pages.find((p) => /u4-m4/i.test(p.name));
  if (u403) {
    console.log('HOLD VIOLATION — u4-m4 (U4-03) is present; this content must stay withheld');
    allOk = false;
  } else {
    console.log('HOLD OK — U4-03 absent');
  }

  /* These 3 validate-content.js `note:` warnings are hold-consistent and expected — never "fix"
     them by editing content (D-49). Printed here as a standing record for every wave that runs
     this audit against the real port. */
  console.log('NOTE ACCEPTED — u3-m1 unused ref baqarah-2-163');
  console.log('NOTE ACCEPTED — u3-m3 unused ref imran-3-19');
  console.log('NOTE ACCEPTED — u4-m2 unused term rububiyah');

  process.exit(allOk ? 0 : 1);
}

main();
