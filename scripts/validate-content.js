#!/usr/bin/env node
'use strict';

/* scripts/validate-content.js — the executable AwbaLesson/AwbaReview contract freeze (ENG-07).

   Source of truth for every rule below: .planning/research/ENGINE-CONTRACT.md §1 (D-29) — this
   file IS the executable version of that document; no duplicate contract doc exists anywhere
   else in the repo. Ingestion runs each data file's inline `AwbaLesson({...})`/`AwbaReview({...})`
   call in a node:vm sandbox and validates the captured cfg — never regex-parsing the object
   literal, since cfg is real JS (AW.cite(...) calls, string concatenation, embedded HTML), not
   JSON (D-25/D-26). The ID-resolution check walks RAW captured strings, never
   JSON.stringify(cfg), because stringify escapes quotes and silently finds zero ids (Pitfall 2,
   verified against Josh's real _MVP-BUILD/ files during Phase 2 research, 02-RESEARCH.md
   Patterns 2-3).

   Zero npm dependencies — Node core only (node:fs, node:path, node:vm). No package.json. This is
   dev tooling, exactly like scripts/check-glyph-coverage.py — never a site dependency; the
   shipped app stays zero-build.

   Usage:
     node scripts/validate-content.js [file...]   # default: lessons/*.html + reviews/*.html
     node scripts/validate-content.js --self-test  # validates the 3 fixtures in scripts/fixtures/

   Output is a calm, specific, per-file report (file -> issue -> fix) — mercy laws bind dev
   tooling too: no alarm-red walls, amber tone only (D-28/D-30). Exit 0 when every file has zero
   errors; exit 1 if any file has at least one error. Warnings never affect the exit code. */

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const BEAT_TYPES = ['read', 'frame', 'verse', 'panel', 'depth', 'reflect', 'mc', 'tf', 'tile'];
const PANEL_VARIANTS = ['pull', 'tell', 'guard', 'check'];
const DEPTH_LENSES = ['reality', 'revelation', 'ruling'];
const MARKER_TYPES = ['fact', 'remember', 'fard', 'angle']; // fard is contract-valid though unused in shipped content

/* ---------- ingest(file): node:vm cfg capture (D-26) ---------- */
function ingest(file) {
  const src = fs.readFileSync(file, 'utf8');
  // Extract the inline (non-src) <script> only — each data file has exactly one such block.
  const m = src.match(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/i);
  if (!m) {
    throw new Error('no inline <script> found in ' + file);
  }
  let cfg = null;
  let kind = null;
  const sandbox = {
    AW: {
      // Mirrors the real AW.cite() markup shape exactly, so data-ref ids embedded in cfg
      // strings survive ingestion identically to how the real engine would render them.
      cite: function (id, label) {
        return '<span class="cite" data-ref="' + id + '">' + (label || '') + '</span>';
      },
    },
    AwbaLesson: function (c) {
      cfg = c;
      kind = 'lesson';
    },
    AwbaReview: function (c) {
      cfg = c;
      kind = 'review';
    },
  };
  vm.createContext(sandbox);
  vm.runInContext(m[1], sandbox, { filename: file });
  return { cfg: cfg, kind: kind };
}

/* ---------- collectStrings: raw-string walk for ID resolution (Pitfall 2 — never JSON.stringify) ---------- */
function collectStrings(o, acc) {
  if (typeof o === 'string') {
    acc.push(o);
  } else if (Array.isArray(o)) {
    o.forEach(function (x) {
      collectStrings(x, acc);
    });
  } else if (o && typeof o === 'object') {
    Object.keys(o).forEach(function (k) {
      collectStrings(o[k], acc);
    });
  }
  return acc;
}

function uniq(arr) {
  return Array.from(new Set(arr));
}

function isPlainObject(v) {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}

/* ---------- top-level required-field checks (D-27) ---------- */
function checkTopLevelLesson(cfg, errors) {
  if (!cfg || typeof cfg !== 'object') {
    errors.push('lesson cfg is missing or not an object');
    return;
  }
  ['id', 'unitColor', 'journey'].forEach(function (f) {
    if (cfg[f] === undefined) errors.push('missing required top-level field: "' + f + '"');
  });
  if (!isPlainObject(cfg.opener)) {
    errors.push('missing required top-level field: "opener" (object)');
  } else if (cfg.opener.h2 === undefined) {
    errors.push('missing required field: "opener.h2"');
  }
  if (!isPlainObject(cfg.terms)) errors.push('missing required top-level field: "terms" (object)');
  if (!isPlainObject(cfg.refs)) errors.push('missing required top-level field: "refs" (object)');
  if (!Array.isArray(cfg.beats)) errors.push('missing required top-level field: "beats" (array)');
  if (!Array.isArray(cfg.recap)) errors.push('missing required top-level field: "recap" (array)');
}

function checkTopLevelReview(cfg, errors) {
  if (!cfg || typeof cfg !== 'object') {
    errors.push('review cfg is missing or not an object');
    return;
  }
  ['id', 'title', 'sub', 'mastery'].forEach(function (f) {
    if (cfg[f] === undefined) errors.push('missing required top-level field: "' + f + '"');
  });
  if (!Array.isArray(cfg.items)) errors.push('missing required top-level field: "items" (array)');
  if (!isPlainObject(cfg.next)) {
    errors.push('missing required top-level field: "next" (object)');
  } else {
    if (cfg.next.href === undefined) errors.push('missing required field: "next.href"');
    if (cfg.next.label === undefined) errors.push('missing required field: "next.label"');
  }
}

/* ---------- refs{} / terms{} dictionary field checks ---------- */
function checkRefs(refs, errors) {
  Object.keys(refs || {}).forEach(function (id) {
    const r = refs[id];
    ['ref', 'ar', 'mean', 'src'].forEach(function (f) {
      if (!r || r[f] === undefined) errors.push('refs["' + id + '"] missing required field: "' + f + '"');
    });
  });
}

function checkTerms(terms, errors) {
  Object.keys(terms || {}).forEach(function (id) {
    const t = terms[id];
    ['ar', 'tl', 'word', 'def', 'ctx'].forEach(function (f) {
      if (!t || t[f] === undefined) errors.push('terms["' + id + '"] missing required field: "' + f + '"');
    });
  });
}

/* ---------- per-beat contract checks (D-27 contract-check table) ---------- */
function checkBeats(beats, errors) {
  (beats || []).forEach(function (beat, i) {
    const label = 'beats[' + i + ']';
    if (!beat || typeof beat !== 'object') {
      errors.push(label + ': beat is missing or not an object');
      return;
    }
    const t = beat.t;
    if (BEAT_TYPES.indexOf(t) === -1) {
      errors.push(label + ': unknown beat type "' + t + '" (must be one of ' + BEAT_TYPES.join('/') + ')');
      return;
    }
    switch (t) {
      case 'read':
        if (beat.html === undefined) errors.push(label + ' (read): missing required field "html"');
        if (beat.marker !== undefined) {
          if (!isPlainObject(beat.marker) || MARKER_TYPES.indexOf(beat.marker.type) === -1) {
            errors.push(
              label + ' (read): marker.type must be one of ' + MARKER_TYPES.join('/') + ', got "' + (beat.marker && beat.marker.type) + '"'
            );
          } else if (beat.marker.body === undefined) {
            // ENGINE-CONTRACT.md §1: marker:{type: fact|remember|fard|angle, body} — body is
            // part of the documented shape, not optional (WR-03).
            errors.push(label + ' (read): missing required field "marker.body"');
          }
        }
        break;
      case 'frame':
        if (beat.lead === undefined) errors.push(label + ' (frame): missing required field "lead"');
        break;
      case 'verse':
        ['label', 'ar', 'tr'].forEach(function (f) {
          if (beat[f] === undefined) errors.push(label + ' (verse): missing required field "' + f + '"');
        });
        break;
      case 'panel':
        if (beat.title === undefined) errors.push(label + ' (panel): missing required field "title"');
        if (!Array.isArray(beat.items)) {
          errors.push(label + ' (panel): missing required field "items" (array)');
        } else {
          beat.items.forEach(function (item, j) {
            if (!item || item.name === undefined) errors.push(label + ' (panel): items[' + j + '] missing required field "name"');
            if (!item || item.body === undefined) errors.push(label + ' (panel): items[' + j + '] missing required field "body"');
          });
        }
        if (beat.variant !== undefined && PANEL_VARIANTS.indexOf(beat.variant) === -1) {
          errors.push(label + ' (panel): variant must be one of ' + PANEL_VARIANTS.join('/') + ', got "' + beat.variant + '"');
        }
        break;
      case 'depth':
        if (beat.point === undefined) errors.push(label + ' (depth): missing required field "point"');
        if (!isPlainObject(beat.lenses)) {
          errors.push(label + ' (depth): missing required field "lenses" (object)');
        } else {
          const keys = Object.keys(beat.lenses).sort();
          const expected = DEPTH_LENSES.slice().sort();
          if (keys.join(',') !== expected.join(',')) {
            errors.push(label + ' (depth): lenses keys must be exactly {' + DEPTH_LENSES.join(',') + '}, got {' + keys.join(',') + '}');
          }
        }
        break;
      case 'reflect':
        if (beat.prompt === undefined) errors.push(label + ' (reflect): missing required field "prompt"');
        if (beat.model === undefined) errors.push(label + ' (reflect): missing required field "model"');
        break;
      case 'mc':
        if (beat.q === undefined) errors.push(label + ' (mc): missing required field "q"');
        if (!Array.isArray(beat.o)) {
          errors.push(label + ' (mc): missing required field "o" (array)');
        }
        if (!Number.isInteger(beat.c)) {
          errors.push(label + ' (mc): missing or non-integer required field "c"');
        } else if (Array.isArray(beat.o) && (beat.c < 0 || beat.c >= beat.o.length)) {
          errors.push(
            label + ' (mc): mc.c=' + beat.c + ' is out of range for o[] (length ' + beat.o.length + ') — must be 0..' + (beat.o.length - 1)
          );
        }
        if (beat.good === undefined) errors.push(label + ' (mc): missing required field "good"');
        if (beat.gentle === undefined) errors.push(label + ' (mc): missing required field "gentle"');
        break;
      case 'tf':
        if (beat.q === undefined) errors.push(label + ' (tf): missing required field "q"');
        if (typeof beat.c !== 'boolean') errors.push(label + ' (tf): "c" must be a boolean, got ' + typeof beat.c);
        if (beat.good === undefined) errors.push(label + ' (tf): missing required field "good"');
        if (beat.gentle === undefined) errors.push(label + ' (tf): missing required field "gentle"');
        break;
      case 'tile':
        if (beat.prompt === undefined) errors.push(label + ' (tile): missing required field "prompt"');
        if (!Array.isArray(beat.bank)) errors.push(label + ' (tile): missing required field "bank" (array)');
        if (!Array.isArray(beat.solution) || beat.solution.length === 0) {
          errors.push(label + ' (tile): "solution" must be a non-empty array');
        } else if (Array.isArray(beat.bank)) {
          // Subset check ONLY — every solution word must exist in bank (distractors allowed).
          // solution.length is NOT required to equal bank.length (D-27 corrected reading).
          const missing = beat.solution.filter(function (word) {
            return beat.bank.indexOf(word) === -1;
          });
          if (missing.length) {
            errors.push(label + ' (tile): solution word(s) not found in bank: ' + missing.join(', '));
          }
        }
        // ENGINE-CONTRACT.md §1: tile | prompt, bank[], solution[], good, gentle — good/gentle
        // are part of the documented shape, same as mc/tf (WR-03).
        if (beat.good === undefined) errors.push(label + ' (tile): missing required field "good"');
        if (beat.gentle === undefined) errors.push(label + ' (tile): missing required field "gentle"');
        break;
    }
  });
}

/* ---------- review items[] checks ---------- */
function checkReviewItems(items, errors) {
  (items || []).forEach(function (item, i) {
    const label = 'items[' + i + ']';
    if (!item || typeof item !== 'object') {
      errors.push(label + ': item is missing or not an object');
      return;
    }
    if (item.t === undefined) errors.push(label + ': missing required explanation field "t"');
    if (item.tf === true) {
      if (item.q === undefined) errors.push(label + ' (tf): missing required field "q"');
      if (typeof item.c !== 'boolean') errors.push(label + ' (tf): "c" must be a boolean, got ' + typeof item.c);
    } else {
      if (item.q === undefined) errors.push(label + ' (mc): missing required field "q"');
      if (!Array.isArray(item.o)) {
        errors.push(label + ' (mc): missing required field "o" (array)');
      }
      if (!Number.isInteger(item.c)) {
        errors.push(label + ' (mc): missing or non-integer required field "c"');
      } else if (Array.isArray(item.o) && (item.c < 0 || item.c >= item.o.length)) {
        errors.push(label + ' (mc): c=' + item.c + ' is out of range for o[] (length ' + item.o.length + ') — must be 0..' + (item.o.length - 1));
      }
    }
  });
}

/* ---------- ID resolution: data-ref / data-term (Pattern 3, Pitfall 2) ---------- */
function checkIdResolution(cfg, errors, warnings) {
  const blob = collectStrings(cfg, []).join('\n'); // RAW strings, never JSON.stringify
  // WR-04: match both quote styles. AW.cite()'s sandbox stub always emits double-quoted
  // data-ref="...", but .term[data-term] spans are hand-authored directly in lesson HTML
  // strings and may use single quotes — a single-quote-only author would otherwise silently
  // escape both the dangling-citation check AND get a false "unused term" warning.
  const refIds = uniq(
    Array.from(blob.matchAll(/data-ref=["']([^"']+)["']/g)).map(function (m) {
      return m[1];
    })
  );
  const termIds = uniq(
    Array.from(blob.matchAll(/data-term=["']([^"']+)["']/g)).map(function (m) {
      return m[1];
    })
  );
  const refs = cfg.refs || {};
  const terms = cfg.terms || {};

  refIds.forEach(function (id) {
    if (!refs[id]) errors.push('dangling citation: data-ref "' + id + '" has no matching entry in refs{}');
  });
  termIds.forEach(function (id) {
    if (!terms[id]) errors.push('dangling term: data-term "' + id + '" has no matching entry in terms{}');
  });
  Object.keys(refs).forEach(function (id) {
    if (refIds.indexOf(id) === -1) warnings.push('unused ref: refs["' + id + '"] is never cited via AW.cite/data-ref');
  });
  Object.keys(terms).forEach(function (id) {
    if (termIds.indexOf(id) === -1) warnings.push('unused term: terms["' + id + '"] is never referenced via data-term');
  });
}

/* ---------- validateCfg(cfg, kind): the full D-27 contract ---------- */
function validateCfg(cfg, kind) {
  const errors = [];
  const warnings = [];

  if (kind === 'lesson') {
    checkTopLevelLesson(cfg, errors);
    if (cfg) {
      checkRefs(cfg.refs, errors);
      checkTerms(cfg.terms, errors);
      checkBeats(cfg.beats, errors);
    }
  } else if (kind === 'review') {
    checkTopLevelReview(cfg, errors);
    if (cfg) checkReviewItems(cfg.items, errors);
  } else {
    errors.push('unrecognized cfg kind (expected a call to AwbaLesson(cfg) or AwbaReview(cfg))');
  }

  if (cfg) checkIdResolution(cfg, errors, warnings);

  return { errors: errors, warnings: warnings };
}

/* ---------- CLI ---------- */
function defaultFiles() {
  const dirs = ['lessons', 'reviews'];
  const files = [];
  dirs.forEach(function (dir) {
    try {
      fs.readdirSync(dir)
        .filter(function (f) {
          return f.toLowerCase().endsWith('.html');
        })
        .forEach(function (f) {
          files.push(path.join(dir, f));
        });
    } catch (e) {
      /* directory doesn't exist yet (pre-Phase-4) — nothing to validate from it */
    }
  });
  return files;
}

function reportFile(file, errors, warnings) {
  if (errors.length === 0 && warnings.length === 0) {
    console.log('OK    ' + file);
    return;
  }
  console.log(file + ':');
  errors.forEach(function (e) {
    console.log('  amber: ' + e);
  });
  warnings.forEach(function (w) {
    console.log('  note:  ' + w);
  });
}

function runGate(files) {
  let anyErrors = false;
  files.forEach(function (file) {
    try {
      const ingested = ingest(file);
      const result = validateCfg(ingested.cfg, ingested.kind);
      reportFile(file, result.errors, result.warnings);
      if (result.errors.length) anyErrors = true;
    } catch (e) {
      // T-02-06 mitigation: a malformed/no-inline-script file becomes a reported error, never a
      // crash — the gate reports every file cleanly and still exits non-zero on real problems.
      console.log(file + ':');
      console.log('  amber: could not ingest file — ' + e.message);
      anyErrors = true;
    }
  });
  return anyErrors;
}

function selfTest() {
  const fixturesDir = path.join(__dirname, 'fixtures');
  let ok = true;

  [
    ['valid-lesson.html', 'lesson'],
    ['valid-review.html', 'review'],
  ].forEach(function (pair) {
    const file = path.join(fixturesDir, pair[0]);
    const ingested = ingest(file);
    const result = validateCfg(ingested.cfg, ingested.kind);
    if (ingested.kind !== pair[1] || result.errors.length !== 0) {
      console.log('SELF-TEST FAIL: ' + file + ' expected 0 errors, got ' + result.errors.length + ': ' + result.errors.join(' | '));
      ok = false;
    } else {
      console.log('SELF-TEST OK: ' + file + ' (0 errors)');
    }
  });

  const brokenFile = path.join(fixturesDir, 'broken-lesson.html');
  const brokenIngested = ingest(brokenFile);
  const brokenResult = validateCfg(brokenIngested.cfg, brokenIngested.kind);
  if (brokenResult.errors.length < 3) {
    console.log('SELF-TEST FAIL: ' + brokenFile + ' expected >=3 errors, got ' + brokenResult.errors.length);
    ok = false;
  } else {
    console.log('SELF-TEST OK: ' + brokenFile + ' (' + brokenResult.errors.length + ' errors named)');
  }

  return ok;
}

if (require.main === module) {
  const argv = process.argv.slice(2);
  if (argv.indexOf('--self-test') !== -1) {
    const ok = selfTest();
    process.exit(ok ? 0 : 1);
  } else {
    const files = argv.length ? argv : defaultFiles();
    if (!files.length) {
      console.log('No data files found to validate (expected argv paths, or lessons/*.html + reviews/*.html).');
      process.exit(0);
    }
    const anyErrors = runGate(files);
    process.exit(anyErrors ? 1 : 0);
  }
}

module.exports = { ingest: ingest, validateCfg: validateCfg };
