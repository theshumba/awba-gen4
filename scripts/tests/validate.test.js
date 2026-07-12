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
