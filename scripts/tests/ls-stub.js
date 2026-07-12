/* ============================================================================================
   ls-stub.js  ·  Awba Gen-4 — Map-backed localStorage stub + engine loader for headless tests
   --------------------------------------------------------------------------------------------
   Backs the state-layer test suites (FND-05/06) with a tiny in-memory localStorage substitute
   so migration/prefs/helper behavior can be proven under `node --test`, with zero npm deps
   (Node core `node:vm`/`node:fs` only — D-25). Source: 02-RESEARCH.md Pattern 4 (verified POC
   executed against the real Gen-3 engine this session).
   ============================================================================================ */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

/**
 * makeLS(seed) — a Map-backed object matching the localStorage surface the engine touches:
 * getItem/setItem/removeItem/key/length, plus a `_dump()` test helper to inspect raw contents.
 * `seed` values are stored verbatim (already-JSON-stringified strings), mirroring real
 * localStorage where every value is a string.
 */
function makeLS(seed) {
  const m = new Map(Object.entries(seed || {}));
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
    key: (i) => [...m.keys()][i],
    get length() {
      return m.size;
    },
    _dump: () => Object.fromEntries(m),
  };
}

/**
 * loadEngine(ls, probeSrc) — runs shared/awba-engine.js concatenated with probeSrc as ONE
 * vm.runInContext call, then returns the sandbox (context) so the caller can read whatever the
 * probe assigned onto `globalThis.__out`.
 *
 * Mandatory concatenation: `const AW = {}` at the engine's top level is a lexical binding, NOT a
 * vm context property. Two separate runInContext calls would throw `AW is not defined` when the
 * probe tries to read AW.S — see 02-RESEARCH.md Pitfall 3 (verified this session against the
 * real _MVP-BUILD/shared/awba-engine.js).
 */
function loadEngine(ls, probeSrc) {
  const enginePath = path.join(__dirname, '..', '..', 'shared', 'awba-engine.js');
  const engineSrc = fs.readFileSync(enginePath, 'utf8');
  const sandbox = { localStorage: ls, Date, Math, JSON, console };
  vm.createContext(sandbox);
  vm.runInContext(engineSrc + '\n' + (probeSrc || ''), sandbox, { filename: enginePath });
  return sandbox;
}

/**
 * readOut(sandbox) — normalizes `sandbox.__out` (an object graph created inside the vm's own
 * realm) into a plain main-realm value via a JSON round-trip. Required before using
 * `assert.deepEqual`/`deepStrictEqual`: objects/arrays from a different vm context have a
 * different `Object.prototype`/`Array.prototype` than the test file's realm, so Node's strict
 * deep-equality (which checks prototype identity) fails even when the values are structurally
 * identical. Primitives pass through unaffected.
 */
function readOut(sandbox) {
  return sandbox.__out === undefined ? undefined : JSON.parse(JSON.stringify(sandbox.__out));
}

module.exports = { makeLS, loadEngine, readOut };
