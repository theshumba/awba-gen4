'use strict';
/* scripts/tests/validate.test.js
   Self-test for scripts/validate-content.js (ENG-07, D-27/D-28).
   RED until scripts/validate-content.js exists and exports { ingest, validateCfg }.
   GREEN proof: both valid fixtures validate with zero errors; the broken fixture is
   flagged with specific, named errors for each of its three deliberate violations
   (unknown beat type, dangling ref id, out-of-range mc.c). */

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { ingest, validateCfg } = require('../validate-content.js');

const FIXTURES = path.join(__dirname, '..', 'fixtures');

test('valid-lesson.html fixture ingests as a lesson and validates with zero errors', () => {
  const { cfg, kind } = ingest(path.join(FIXTURES, 'valid-lesson.html'));
  assert.strictEqual(kind, 'lesson');
  const { errors } = validateCfg(cfg, kind);
  assert.deepStrictEqual(errors, [], `expected zero errors, got: ${errors.join(' | ')}`);
});

test('valid-review.html fixture ingests as a review and validates with zero errors', () => {
  const { cfg, kind } = ingest(path.join(FIXTURES, 'valid-review.html'));
  assert.strictEqual(kind, 'review');
  const { errors } = validateCfg(cfg, kind);
  assert.deepStrictEqual(errors, [], `expected zero errors, got: ${errors.join(' | ')}`);
});

test('broken-lesson.html fixture is flagged with specific, named errors for each violation', () => {
  const { cfg, kind } = ingest(path.join(FIXTURES, 'broken-lesson.html'));
  assert.strictEqual(kind, 'lesson');
  const { errors } = validateCfg(cfg, kind);

  assert.ok(
    errors.length >= 3,
    `expected >=3 errors (unknown beat, dangling ref, out-of-range mc.c), got ${errors.length}: ${errors.join(' | ')}`
  );

  assert.ok(
    errors.some((e) => e.includes('bogus')),
    `expected an error naming the unknown beat type "bogus", got: ${errors.join(' | ')}`
  );

  assert.ok(
    errors.some((e) => e.includes('missing-ref-id')),
    `expected an error naming the dangling ref id "missing-ref-id", got: ${errors.join(' | ')}`
  );

  assert.ok(
    errors.some((e) => e.includes('mc.c') && e.includes('9')),
    `expected an error naming the out-of-range mc.c (9), got: ${errors.join(' | ')}`
  );
});

/* ---------- WR-03: tile.good/tile.gentle + read marker.body enforcement ----------
   ENGINE-CONTRACT.md §1 lists tile's fields as prompt/bank/solution/good/gentle and markers as
   {type, body} — both were previously unchecked, so a tile beat missing good/gentle or a marker
   missing body validated with zero errors. */

test('tile beat missing "good"/"gentle" is flagged (WR-03)', () => {
  const cfg = {
    id: 'x',
    unitColor: '#000',
    journey: 'x',
    opener: { h2: 'x' },
    terms: {},
    refs: {},
    recap: [],
    beats: [{ t: 'tile', prompt: 'p', bank: ['a', 'b'], solution: ['a'] }],
  };
  const { errors } = validateCfg(cfg, 'lesson');
  assert.ok(
    errors.some((e) => e.includes('(tile)') && e.includes('"good"')),
    `expected a missing "good" error, got: ${errors.join(' | ')}`
  );
  assert.ok(
    errors.some((e) => e.includes('(tile)') && e.includes('"gentle"')),
    `expected a missing "gentle" error, got: ${errors.join(' | ')}`
  );
});

test('empty-string required top-level fields are flagged, not just undefined ones (IN-03)', () => {
  const lessonCfg = {
    id: '   ',
    unitColor: '#000',
    journey: 'x',
    opener: { h2: 'x' },
    terms: {},
    refs: {},
    recap: [],
    beats: [],
  };
  const { errors: lessonErrors } = validateCfg(lessonCfg, 'lesson');
  assert.ok(
    lessonErrors.some((e) => e.includes('"id"') && e.includes('must not be empty')),
    `expected an empty-"id" error for the lesson, got: ${lessonErrors.join(' | ')}`
  );

  const reviewCfg = { id: '', title: 'x', sub: 'x', mastery: 'x', items: [], next: { href: 'x', label: 'x' } };
  const { errors: reviewErrors } = validateCfg(reviewCfg, 'review');
  assert.ok(
    reviewErrors.some((e) => e.includes('"id"') && e.includes('must not be empty')),
    `expected an empty-"id" error for the review, got: ${reviewErrors.join(' | ')}`
  );
});

test('data-ref/data-term ID resolution matches single-quoted attributes too (WR-04)', () => {
  const cfg = {
    id: 'x',
    unitColor: '#000',
    journey: 'x',
    opener: { h2: 'x' },
    terms: { sampleterm: { ar: 'x', tl: 'x', word: 'x', def: 'x', ctx: 'x' } },
    refs: { 'sample-ref': { ref: 'x', ar: 'x', mean: 'x', src: 'x' } },
    recap: [],
    beats: [
      {
        t: 'read',
        html: "<p><span class='term' data-term='sampleterm'>x</span> <span class='cite' data-ref='sample-ref'>x</span></p>",
      },
    ],
  };
  const { errors, warnings } = validateCfg(cfg, 'lesson');
  assert.deepStrictEqual(errors, [], `expected zero errors, got: ${errors.join(' | ')}`);
  assert.ok(
    !warnings.some((w) => w.includes('unused term')),
    `single-quoted data-term must be recognized as used, got: ${warnings.join(' | ')}`
  );
  assert.ok(
    !warnings.some((w) => w.includes('unused ref')),
    `single-quoted data-ref must be recognized as used, got: ${warnings.join(' | ')}`
  );
});

test('read beat marker missing "body" is flagged (WR-03)', () => {
  const cfg = {
    id: 'x',
    unitColor: '#000',
    journey: 'x',
    opener: { h2: 'x' },
    terms: {},
    refs: {},
    recap: [],
    beats: [{ t: 'read', html: '<p>x</p>', marker: { type: 'fact' } }],
  };
  const { errors } = validateCfg(cfg, 'lesson');
  assert.ok(
    errors.some((e) => e.includes('marker.body')),
    `expected a missing "marker.body" error, got: ${errors.join(' | ')}`
  );
});
