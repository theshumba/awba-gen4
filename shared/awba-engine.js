/* ============================================================================================
   awba-engine.js  ·  Awba Gen-4 — the one engine script
   --------------------------------------------------------------------------------------------
   The single shared classic-script every page (`index.html`, `learn.html`, every lesson/review
   data file) loads via `<script src="../shared/awba-engine.js"></script>` — never an ES module
   script type, no `defer`/`async` on this tag, ever. `window.AW` (below, `const AW = {}`) is defined the
   instant this script parses, synchronously, at the top level: Josh's 15 lesson + 4 review data
   files call `AW.cite(...)` and friends *inside* their own inline `<script>` the moment it runs,
   so `AW` must already exist. This is what makes every page work double-clicked from `file://`
   (FND-07 / D-22 / D-23).

   Sections land in this file, in this order, over the life of the project — ONE file, never
   split (every extra <script> tag would force edits into all 19 of Josh's data files):

     STATE       — Phase 2 (this phase). awba_state + awba_prefs versioned localStorage blobs,
                   the lossless Gen-3 migration chain, and the pure state-derivation helpers
                   (FND-05, FND-06, FND-07). DOM-independent by design.
     KIT         — Phase 3/4 placeholder. Icon kit (AW.KIT), companion lantern art, glyphs.
     COMPONENTS  — Phase 3/4 placeholder. Shared UI builders (sheets, cite chips, confetti).
     RUNNERS     — Phase 4 placeholder. AwbaLesson(cfg) / AwbaReview(cfg) engine runners.

   `AW.S`/`AW.prefs` (below) are the ONLY code in this codebase allowed to touch `localStorage`
   (D-24, enforced by a grep gate in every plan's verification). Every other page/section reads
   and writes progress exclusively through `AW.S.get(key, default)` / `AW.S.set(key, value)`.
   ============================================================================================ */

/* ============================================================
   STATE  ·  FND-05 (awba_state + migration) / FND-06 (awba_prefs)
              / FND-07 (parse-time AW namespace, classic script)
   ============================================================ */

const AW = {};

/* ---------- shared local-date helper (D-16: local YYYY-MM-DD, never a UTC-based ISO format) ----------
   Any UTC-serializing date-to-string conversion can silently return the WRONG calendar day
   depending on the reviewer's UTC offset (measured this session: 2026-07-11 local rendered as
   2026-07-10 via a UTC-based conversion in BST). Every date this file stores or compares is
   formatted from local getters (getFullYear/getMonth/getDate) instead — never from a UTC
   serialization method. */
function pad2(n) {
  return String(n).padStart(2, '0');
}
function toLocalYMD(d) {
  return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
}
function isValidDate(d) {
  return d instanceof Date && !isNaN(d.getTime());
}

/* ---------- AW.S — versioned awba_state blob + lazy Gen-3 migration (D-13/D-14/D-17) ----------
   External call shape is frozen: AW.S.get(key, default) / AW.S.set(key, value) — a generic
   key/value surface over the in-memory parsed blob. Callers never learn about `awba_state` or
   schema versions; the whole blob is re-persisted on every `set` (Pattern 1, verified). */
AW.S = (function () {
  var KEY = 'awba_state';
  var CURRENT = 1;
  var mem = null;
  /* memFallback (W1): set true when load() resolves from an in-memory COPY of an
     unrecognized-schema blob it deliberately declined to persist (the fall-through below).
     set() consults it to skip persist() so a later write (e.g. the ringSeed lazy accessor)
     can never clobber that untouched-on-disk blob. */
  var memFallback = false;

  function defaultState() {
    return { schemaVersion: CURRENT, noor: 0, returns: 0, lastDay: null, days: [], stars: {}, chests: {} };
  }

  /* Sequential migration chain seam for future schema bumps — empty at v1. migrations[n] takes
     a state object at schemaVersion n and returns one at schemaVersion n+1. */
  var migrations = [];

  function runMigrations(state) {
    var s = state;
    var guard = 0;
    while (s.schemaVersion < CURRENT) {
      if (++guard > 50) {
        // Safety valve — never trust a migration step blindly. 50 is far more than this app
        // will ever need (one bump per schema change), so hitting it means something is wrong.
        throw new Error('runMigrations: exceeded 50 iterations without reaching schemaVersion ' + CURRENT + ' — aborting to avoid an infinite loop');
      }
      var step = migrations[s.schemaVersion];
      if (typeof step !== 'function') break; // no migration registered — stop where we are
      var next = step(s);
      if (!next || typeof next.schemaVersion !== 'number' || next.schemaVersion <= s.schemaVersion) {
        // WR-02: a migration step that doesn't bump schemaVersion would otherwise spin this
        // while loop forever (a full synchronous main-thread hang, not a crash) — bail loudly
        // instead. The caller (load()) already wraps this in a try/catch and falls back to
        // legacy/default resolution.
        throw new Error('runMigrations: migration step for schemaVersion ' + s.schemaVersion + ' did not advance schemaVersion — aborting to avoid an infinite loop');
      }
      s = next;
    }
    if (s.schemaVersion !== CURRENT) s.schemaVersion = CURRENT;
    return s;
  }

  /* readLegacy: same silent-tolerant try/catch as Gen-3's AW.S.get — corrupted/missing legacy
     fields resolve to `undefined`, never throw (Pitfall 5/6). */
  function readLegacy(rawKey) {
    try {
      var v = localStorage.getItem(rawKey);
      return v === null ? undefined : JSON.parse(v);
    } catch (e) {
      return undefined;
    }
  }

  function migrateFromLegacy() {
    var s = defaultState();
    var found = false;

    try {
      var noor = readLegacy('awba_noor');
      if (typeof noor === 'number' && !isNaN(noor)) {
        s.noor = noor;
        found = true;
      }
    } catch (e) {}

    try {
      var ret = readLegacy('awba_returns');
      if (typeof ret === 'number' && !isNaN(ret)) {
        s.returns = ret;
        found = true;
      }
    } catch (e) {}

    try {
      var last = readLegacy('awba_lastDay');
      if (last != null) {
        var ld = new Date(last);
        if (isValidDate(ld)) {
          s.lastDay = toLocalYMD(ld);
          found = true;
        }
      }
    } catch (e) {}

    try {
      var days = readLegacy('awba_days');
      if (Array.isArray(days)) {
        s.days = days
          .map(function (d) {
            return new Date(d);
          })
          .filter(isValidDate)
          .map(toLocalYMD)
          .slice(-90);
        found = true;
      }
    } catch (e) {}

    try {
      var st = readLegacy('awba_stars');
      if (st && typeof st === 'object' && !Array.isArray(st)) {
        s.stars = st;
        found = true;
      }
    } catch (e) {}

    /* Enumerate awba_chest_<id> keys via the standard Storage length/key(i) API — portable
       across both real browser localStorage AND a plain-object test stub. (Object.keys() only
       works on real Storage instances, whose entries are exposed as enumerable own properties;
       a hand-written stub implementing just getItem/setItem/key/length would silently find
       nothing.) */
    try {
      var chestCount = localStorage.length;
      for (var ci = 0; ci < chestCount; ci++) {
        var chestKey = localStorage.key(ci);
        if (chestKey && chestKey.indexOf('awba_chest_') === 0) {
          var val = readLegacy(chestKey);
          if (val === true) {
            s.chests[chestKey.slice('awba_chest_'.length)] = true;
            found = true;
          }
        }
      }
    } catch (e) {}

    return found ? s : null;
  }

  function persist(s) {
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch (e) {
      /* quota exceeded / private-mode: session keeps working from `mem`, just isn't saved */
    }
  }

  function load() {
    var raw = null;
    try {
      raw = localStorage.getItem(KEY);
    } catch (e) {
      raw = null;
    }
    if (raw) {
      try {
        var s = JSON.parse(raw);
        if (s && s.schemaVersion === CURRENT) return s;
        if (s && typeof s.schemaVersion === 'number' && s.schemaVersion < CURRENT) {
          var migrated = runMigrations(s);
          persist(migrated);
          return migrated;
        }
        if (s) {
          /* Anything else for a successfully-parsed, truthy blob — schemaVersion missing,
             non-numeric (incl. NaN/string), or GREATER than CURRENT (a newer tab's build
             already wrote a higher schemaVersion, or a stray DevTools edit dropped the field).
             This build doesn't recognize the shape well enough to migrate it, but the existing
             blob may hold real noor/stars/days/chests progress that must never be silently
             wiped (non-destructive principle, D-15 extends here). Work this session from an
             in-memory COPY only — deliberately do NOT persist() over the untouched blob, so it
             survives on disk exactly as-is for a build that DOES recognize it (or a human) to
             resolve later. */
          var isPlainObj = typeof s === 'object' && !Array.isArray(s);
          if (isPlainObj) {
            memFallback = true; // W1: work from a copy; never persist over the untouched blob
            return Object.assign({}, s);
          }
          return defaultState();
        }
      } catch (e) {
        /* corrupted awba_state blob — fall through to legacy/default resolution */
      }
    }
    var fromLegacy = migrateFromLegacy();
    if (fromLegacy) {
      persist(fromLegacy); // write ONCE (D-14 step 3); legacy keys are NEVER deleted (D-15)
      return fromLegacy;
    }
    var def = defaultState();
    persist(def);
    return def;
  }

  /* defensiveCopy: WR-01 — never return a live reference into `mem` for object/array-valued
     keys (stars/days/chests). Without this, `AW.S.get('stars', {})[id] = 3` (or any future
     RUNNERS caller doing the same) would mutate `mem.stars` in place WITHOUT ever calling
     `AW.S.set()`, silently bypassing the get/set-only write contract this file's header
     documents as load-bearing. Values here are always small, JSON-safe (numbers/strings/
     booleans/plain objects/arrays), so a JSON round-trip is correct and cheap; `structuredClone`
     is used when available as the more direct native primitive. */
  function defensiveCopy(v) {
    if (v === null || typeof v !== 'object') return v;
    return typeof structuredClone === 'function' ? structuredClone(v) : JSON.parse(JSON.stringify(v));
  }

  return {
    get: function (k, d) {
      if (!mem) mem = load();
      return k in mem && mem[k] !== undefined ? defensiveCopy(mem[k]) : d;
    },
    set: function (k, v) {
      if (!mem) mem = load();
      mem[k] = v;
      if (!memFallback) persist(mem); // W1: skip persist over an unrecognized-schema blob
    },
  };
})();

/* ---------- AW.prefs — separate versioned awba_prefs blob (D-20) ----------
   Same wrapper shape as AW.S, own key, never mixed into progress state so clearing/migrating
   one can never corrupt the other. */
AW.prefs = (function () {
  var KEY = 'awba_prefs';
  var CURRENT = 1;
  var mem = null;

  function defaultPrefs() {
    return { schemaVersion: CURRENT, soundMuted: false, motion: 'system' };
  }

  function persist(p) {
    try {
      localStorage.setItem(KEY, JSON.stringify(p));
    } catch (e) {}
  }

  function load() {
    var raw = null;
    try {
      raw = localStorage.getItem(KEY);
    } catch (e) {
      raw = null;
    }
    if (raw) {
      try {
        var p = JSON.parse(raw);
        if (p && p.schemaVersion === CURRENT) return p;
      } catch (e) {
        /* corrupted awba_prefs — fall through to default */
      }
    }
    var def = defaultPrefs();
    persist(def);
    return def;
  }

  return {
    get: function (k, d) {
      if (!mem) mem = load();
      return k in mem && mem[k] !== undefined ? mem[k] : d;
    },
    set: function (k, v) {
      if (!mem) mem = load();
      mem[k] = v;
      persist(mem);
    },
  };
})();

/* ---------- pure, DOM-free state helpers (D-18/D-19) ----------
   AW.state()/touchDay()/greetMode()/weekCal() read/write ONLY through AW.S (never localStorage
   directly). The node-state derivation helper further below is fully PURE — it takes progress
   as an argument and never touches AW.S/localStorage at all, so it is unit-testable with
   hand-built fixtures independent of any real course map (real-map unlock order is verified in
   Phase 5, CNT-03). */

/* parseLocalYMD: the inverse of toLocalYMD — parses "YYYY-MM-DD" from local parts. Constructing
   via `new Date(y, m-1, d)` (NOT `new Date(ymdString)`) matters: parsing a bare "YYYY-MM-DD"
   string is defined to land on UTC midnight, which would silently shift greetMode's day-diff in
   any non-zero UTC offset — the exact class of bug D-16 exists to avoid. */
function parseLocalYMD(ymd) {
  var parts = ymd.split('-');
  return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
}
function localMidnight(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

AW.todayStr = function () {
  return toLocalYMD(new Date());
};

/* AW.state() — one-read snapshot; consumers read once per render pass and never re-read inside
   loops (anti-pattern 3). Adds `chests` to the Gen-3 snapshot shape (D-13). Every field below is
   built from AW.S.get(), whose object/array-valued results are already defensive copies
   (WR-01) — so mutating the snapshot this returns (e.g. `AW.state().stars[id] = 3`) can never
   corrupt `mem` or bypass AW.S.set(). */
AW.state = function () {
  return {
    noor: AW.S.get('noor', 0),
    returns: AW.S.get('returns', 0),
    stars: AW.S.get('stars', {}),
    days: AW.S.get('days', []),
    lastDay: AW.S.get('lastDay', null),
    chests: AW.S.get('chests', {}),
  };
};

/* AW.touchDay() — the mercy-streak engine. Fires on lesson/review "begin", never on page load
   (callers wire that in Phase 4/5). returns++ only on the first activity of a new day; seeds
   returns at 1 on the first-ever visit (lastDay starts null, so `last !== t` on the first call). */
AW.touchDay = function () {
  var t = AW.todayStr();
  var last = AW.S.get('lastDay', null);
  var ret = AW.S.get('returns', 0);
  if (last !== t) {
    ret = ret + 1;
    AW.S.set('returns', ret);
    AW.S.set('lastDay', t);
    var days = AW.S.get('days', []);
    if (days.indexOf(t) < 0) {
      days.push(t);
      AW.S.set('days', days.slice(-90));
    }
  }
  return ret;
};

/* AW.greetMode() — first / streak (diff<=1) / returning. Both sides of the diff are constructed
   from local date parts (parseLocalYMD / localMidnight), never from `new Date(ymdString)`. */
AW.greetMode = function () {
  var last = AW.S.get('lastDay', null);
  if (!last) return 'first';
  var todayL = localMidnight(new Date());
  var lastL = parseLocalYMD(last);
  var diff = Math.round((todayL - lastL) / 86400000);
  return diff <= 1 ? 'streak' : 'returning';
};

/* AW.weekCal() — DOM-free Mon-Su week membership over `days` (internal YYYY-MM-DD format).
   Returns structured day data (array of {label, on}); building the markup half is Phase 3/5. */
AW.weekCal = function () {
  var days = AW.S.get('days', []);
  var labels = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  var now = new Date();
  var dow = (now.getDay() + 6) % 7; // Mon=0..Sun=6
  var week = [];
  for (var i = 0; i < 7; i++) {
    var d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dow + i);
    var on = days.indexOf(toLocalYMD(d)) >= 0;
    week.push({ label: labels[i], on: on });
  }
  return week;
};

/* AW.deriveNodeState(nodesFlat, progress) — PURE: this body reaches no storage layer of any
   kind; the caller passes progress.stars/progress.chests explicitly. Promoted from
   learn.html's nodeState() (Gen-3), rewritten as a pure function returning per-node state for
   the whole flat array: [{id, state}], state in {locked, active, done, available}.
   - chest node: 'available' if the immediately-preceding node has stars AND the chest is
     unopened; 'done' if opened; else 'locked'.
   - lesson/review node: 'done' if it has stars; else 'active' if every prior non-chest node has
     stars (strictly linear across all units); else 'locked'. */
  AW.deriveNodeState = function (nodesFlat, progress) {
    var stars = (progress && progress.stars) || {};
    var chests = (progress && progress.chests) || {};
    return nodesFlat.map(function (node, idx) {
      var state;
      if (node.chest) {
        var prev = nodesFlat[idx - 1];
        var prevHasStars = prev && stars[prev.id];
        if (!prevHasStars) {
          state = 'locked';
        } else {
          state = chests[node.id] ? 'done' : 'available';
        }
      } else if (stars[node.id]) {
        state = 'done';
      } else {
        var locked = false;
        for (var i = 0; i < idx; i++) {
          if (nodesFlat[i].chest) continue;
          if (!stars[nodesFlat[i].id]) {
            locked = true;
            break;
          }
        }
        state = locked ? 'locked' : 'active';
      }
      return { id: node.id, state: state };
    });
  };

/* ---------- boot-stamp — apply prefs to <html> at parse time (D-21) ----------
   Guarded so the headless migration test (no `document` global) never executes this block. */
if (typeof document !== 'undefined') {
  if (AW.prefs.get('motion', 'system') === 'reduce') {
    document.documentElement.setAttribute('data-motion', 'reduce');
  }
  if (AW.prefs.get('soundMuted', false)) {
    document.documentElement.setAttribute('data-sound', 'muted');
  }
}

/* Test ergonomics only (harmless in-browser): expose AW on globalThis so a headless test can
   read `ctx.AW` directly after a separate vm run, without needing the engine+probe
   concatenation trick. In-browser, data files already reference `AW` as a free identifier
   resolving against this script's lexical scope regardless of this line. */
if (typeof globalThis !== 'undefined') globalThis.AW = AW;

/* ============================================================
   KIT  ·  Phase 3/4 placeholder — icon kit, companion art, glyphs (D-22)
   ============================================================ */

/* AW.KIT — the ONE branded icon registry (FND-04 / D-31 / D-34). The 20 canonical scene
   icons, hand-transformed from _ORGANIZED/03_Branding/icon files/ (240x300 portrait, blob
   halo + structural body + accent mark). Re-inked to the Athar one-colour model (03-08 /
   D-A5, §5.1): structural ink -> currentColor (inherits the register ground), halos/panels ->
   currentColor at authored low opacity or fill="none", and the single sparkle/star mark ->
   var(--icon-accent). No runtime recolour — this is an authored, committed pass; geometry
   (every d="...") is byte-identical to the source. KEEP viewBox="0 0 240 300" so CSS scales
   without distorting the 0.8 portrait aspect. Backtick literals, one icon per entry with a
   naming comment. This is the only icon source going forward — Gen-3's embedded 12-icon KIT
   and the per-page duplicate constants are superseded. AW.GLYPHS joins this section below. */
AW.KIT = {
  // 01-mosque
  mosque: `<svg viewBox="0 0 240 300" fill="none">
<path d="M119 20 C174 12 212 58 205 120 C200 163 222 210 178 252 C142 286 80 290 52 250 C28 216 36 166 42 118 C48 72 66 28 119 20 Z" fill="currentColor" opacity=".12"></path>
        <rect x="44" y="230" width="152" height="12" rx="6" fill="currentColor"></rect>
        <rect x="55" y="120" width="15" height="112" rx="7" fill="currentColor"></rect>
        <rect x="170" y="120" width="15" height="112" rx="7" fill="currentColor"></rect>
        <circle cx="62.5" cy="116" r="9" fill="currentColor"></circle>
        <circle cx="177.5" cy="116" r="9" fill="currentColor"></circle>
        <circle cx="62.5" cy="100" r="3" fill="currentColor"></circle>
        <circle cx="177.5" cy="100" r="3" fill="currentColor"></circle>
        <rect x="80" y="150" width="80" height="82" rx="8" fill="currentColor"></rect>
        <path d="M84 152 C84 120 96 108 108 100 C114 96 116 90 120 84 C124 90 126 96 132 100 C144 108 156 120 156 152 Z" fill="currentColor"></path>
        <line x1="120" y1="86" x2="120" y2="74" stroke="currentColor" stroke-width="4" stroke-linecap="round"></line>
        <path d="M120 74 a5 5 0 1 1 4 2" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"></path>
        <path d="M110 232 L110 196 Q120 182 130 196 L130 232 Z" fill="none"></path>
        <path d="M90 196 L90 182 Q96 175 102 182 L102 196 Z" fill="none"></path>
        <path d="M138 196 L138 182 Q144 175 150 182 L150 196 Z" fill="none"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(42,72)"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(196,152) scale(0.8)"></path>
</svg>`,
  // 02-prayer-carpet
  carpet: `<svg viewBox="0 0 240 300" fill="none">
<path d="M119 20 C174 12 212 58 205 120 C200 163 222 210 178 252 C142 286 80 290 52 250 C28 216 36 166 42 118 C48 72 66 28 119 20 Z" fill="currentColor" opacity=".12"></path>
        <path d="M78 72 Q78 62 88 62 L152 62 Q162 62 162 72 L162 214 L78 214 Z" fill="currentColor"></path>
        <path d="M88 82 L152 82 L152 204 L88 204 Z" fill="none" stroke="currentColor" stroke-width="3"></path>
        <path d="M104 150 L104 116 Q104 100 120 100 Q136 100 136 116 L136 150 Z" fill="none"></path>
        <line x1="120" y1="112" x2="120" y2="128" stroke="currentColor" stroke-width="3" stroke-linecap="round"></line>
        <circle cx="120" cy="132" r="5" fill="currentColor"></circle>
        <path d="M108 170 l6 8 l-6 8 l-6 -8 Z" fill="currentColor"></path>
        <path d="M132 170 l6 8 l-6 8 l-6 -8 Z" fill="currentColor"></path>
        <g stroke="currentColor" stroke-width="3" stroke-linecap="round">
          <line x1="84" y1="214" x2="84" y2="224"></line><line x1="94" y1="214" x2="94" y2="225"></line><line x1="104" y1="214" x2="104" y2="224"></line><line x1="114" y1="214" x2="114" y2="225"></line><line x1="124" y1="214" x2="124" y2="224"></line><line x1="134" y1="214" x2="134" y2="225"></line><line x1="144" y1="214" x2="144" y2="224"></line><line x1="154" y1="214" x2="154" y2="225"></line>
        </g>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(178,88) scale(0.85)"></path>
</svg>`,
  // 03-lantern
  lantern: `<svg viewBox="0 0 240 300" fill="none">
<path d="M119 20 C174 12 212 58 205 120 C200 163 222 210 178 252 C142 286 80 290 52 250 C28 216 36 166 42 118 C48 72 66 28 119 20 Z" fill="currentColor" opacity=".12"></path>
        <circle cx="120" cy="46" r="6" fill="none" stroke="currentColor" stroke-width="3"></circle>
        <line x1="120" y1="52" x2="120" y2="66" stroke="currentColor" stroke-width="3"></line>
        <path d="M100 78 L140 78 L131 66 L109 66 Z" fill="currentColor"></path>
        <circle cx="120" cy="62" r="4" fill="currentColor"></circle>
        <path d="M98 82 L142 82 Q151 112 142 152 L133 170 L107 170 L98 152 Q89 112 98 82 Z" fill="currentColor"></path>
        <path d="M112 98 L128 98 L128 152 L112 152 Z" fill="none"></path>
        <path d="M120 116 c-5 5 -6 12 0 18 c6 -6 5 -13 0 -18 z" fill="currentColor"></path>
        <path d="M108 170 L132 170 L120 186 Z" fill="currentColor"></path>
        <circle cx="120" cy="190" r="4" fill="currentColor"></circle>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(168,110)"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(74,132) scale(0.8)"></path>
</svg>`,
  // 04-lanterns
  lanterns: `<svg viewBox="0 0 240 300" fill="none">
<path d="M119 20 C174 12 212 58 205 120 C200 163 222 210 178 252 C142 286 80 290 52 250 C28 216 36 166 42 118 C48 72 66 28 119 20 Z" fill="currentColor" opacity=".12"></path>
        <path d="M46 58 Q120 46 194 58" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"></path>
        <g>
          <line x1="72" y1="62" x2="72" y2="96" stroke="currentColor" stroke-width="3"></line>
          <path d="M60 100 L84 100 L79 92 L65 92 Z" fill="currentColor"></path>
          <path d="M60 102 L84 102 Q89 124 84 150 L78 162 L66 162 L60 150 Q55 124 60 102 Z" fill="currentColor"></path>
          <rect x="68" y="114" width="8" height="34" fill="none"></rect>
          <path d="M66 162 L78 162 L72 172 Z" fill="currentColor"></path>
        </g>
        <g>
          <line x1="120" y1="60" x2="120" y2="82" stroke="currentColor" stroke-width="3"></line>
          <path d="M106 86 L134 86 L128 78 L112 78 Z" fill="currentColor"></path>
          <path d="M106 88 L134 88 Q140 114 134 144 L127 158 L113 158 L106 144 Q100 114 106 88 Z" fill="currentColor"></path>
          <rect x="114" y="102" width="12" height="40" fill="none"></rect>
          <path d="M113 158 L127 158 L120 170 Z" fill="currentColor"></path>
        </g>
        <g>
          <line x1="168" y1="62" x2="168" y2="104" stroke="currentColor" stroke-width="3"></line>
          <path d="M156 108 L180 108 L175 100 L161 100 Z" fill="currentColor"></path>
          <path d="M156 110 L180 110 Q185 132 180 158 L174 170 L162 170 L156 158 Q151 132 156 110 Z" fill="currentColor"></path>
          <rect x="164" y="122" width="8" height="34" fill="none"></rect>
          <path d="M162 170 L174 170 L168 180 Z" fill="currentColor"></path>
        </g>
        <circle cx="46" cy="118" r="3" fill="currentColor"></circle>
        <circle cx="196" cy="150" r="3" fill="currentColor"></circle>
</svg>`,
  // 05-crescent-star
  crescent: `<svg viewBox="0 0 240 300" fill="none">
<path d="M119 20 C174 12 212 58 205 120 C200 163 222 210 178 252 C142 286 80 290 52 250 C28 216 36 166 42 118 C48 72 66 28 119 20 Z" fill="currentColor" opacity=".12"></path>
        <path d="M118 78 A72 72 0 1 0 118 222 A58 58 0 1 1 118 78 Z" fill="currentColor"></path>
        <path d="M0 -18 L5.3 -5.6 L18 -5.6 L7.6 2.7 L11.1 15 L0 7.4 L-11.1 15 L-7.6 2.7 L-18 -5.6 L-5.3 -5.6 Z" fill="var(--icon-accent)" transform="translate(168,150)"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(178,96)"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(160,210) scale(0.8)"></path>
        <circle cx="196" cy="150" r="3" fill="currentColor"></circle>
</svg>`,
  // 06-woman-hijab
  hijab: `<svg viewBox="0 0 240 300" fill="none">
<path d="M119 20 C174 12 212 58 205 120 C200 163 222 210 178 252 C142 286 80 290 52 250 C28 216 36 166 42 118 C48 72 66 28 119 20 Z" fill="currentColor" opacity=".12"></path>
        <rect x="62" y="250" width="116" height="10" rx="5" fill="currentColor"></rect>
        <path d="M120 52 C154 52 168 80 168 108 C168 132 158 152 152 164 L88 164 C82 152 72 132 72 108 C72 80 86 52 120 52 Z" fill="currentColor"></path>
        <ellipse cx="120" cy="96" rx="25" ry="29" fill="currentColor" opacity=".12"></ellipse>
        <path d="M92 152 L148 152 L172 250 L68 250 Z" fill="currentColor"></path>
        <path d="M104 152 L120 178 L136 152 Z" fill="currentColor" opacity="0.28"></path>
        <path d="M95 160 L80 210 Q78 218 86 218 Q92 218 92 210 L102 170 Z" fill="currentColor"></path>
        <path d="M145 160 L160 210 Q162 218 154 218 Q148 218 148 210 L138 170 Z" fill="currentColor"></path>
        <path d="M0 2 C-2 -2 -8 -2 -8 2 C-8 6 -3 8 0 11 C3 8 8 6 8 2 C8 -2 2 -2 0 2 Z" fill="var(--icon-accent)" transform="translate(120,116) scale(0.75)"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(186,138) scale(0.85)"></path>
</svg>`,
  // 07-man
  man: `<svg viewBox="0 0 240 300" fill="none">
<path d="M119 20 C174 12 212 58 205 120 C200 163 222 210 178 252 C142 286 80 290 52 250 C28 216 36 166 42 118 C48 72 66 28 119 20 Z" fill="currentColor" opacity=".12"></path>
        <rect x="62" y="250" width="116" height="10" rx="5" fill="currentColor"></rect>
        <ellipse cx="120" cy="94" rx="24" ry="27" fill="currentColor" opacity=".12"></ellipse>
        <path d="M96 88 Q120 56 144 88 Q120 80 96 88 Z" fill="currentColor"></path>
        <path d="M100 104 Q120 140 140 104 Q120 116 100 104 Z" fill="currentColor"></path>
        <path d="M94 152 L146 152 L156 250 L84 250 Z" fill="currentColor"></path>
        <line x1="120" y1="152" x2="120" y2="250" stroke="currentColor" stroke-width="2" opacity="0.5"></line>
        <path d="M96 158 L82 208 Q80 216 88 216 Q94 216 94 208 L102 168 Z" fill="currentColor"></path>
        <path d="M144 158 L158 208 Q160 216 152 216 Q146 216 146 208 L138 168 Z" fill="currentColor"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(54,84) scale(0.85)"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(184,120) scale(0.8)"></path>
</svg>`,
  // 08-family
  family: `<svg viewBox="0 0 240 300" fill="none">
<path d="M119 20 C174 12 212 58 205 120 C200 163 222 210 178 252 C142 286 80 290 52 250 C28 216 36 166 42 118 C48 72 66 28 119 20 Z" fill="currentColor" opacity=".12"></path>
        <rect x="34" y="252" width="172" height="10" rx="5" fill="currentColor"></rect>
        <ellipse cx="82" cy="150" rx="17" ry="19" fill="currentColor" opacity=".12"></ellipse>
        <path d="M65 146 Q82 126 99 146 Q82 139 65 146 Z" fill="currentColor"></path>
        <path d="M64 172 L102 172 L110 252 L56 252 Z" fill="currentColor"></path>
        <path d="M158 118 C178 118 186 136 186 156 C186 174 179 188 175 196 L141 196 C137 188 130 174 130 156 C130 136 138 118 158 118 Z" fill="currentColor"></path>
        <ellipse cx="158" cy="152" rx="15" ry="17" fill="currentColor" opacity=".12"></ellipse>
        <path d="M138 186 L178 186 L192 252 L124 252 Z" fill="currentColor"></path>
        <ellipse cx="120" cy="188" rx="13" ry="14" fill="currentColor" opacity=".12"></ellipse>
        <path d="M106 184 Q120 168 134 184 Q120 178 106 184 Z" fill="currentColor"></path>
        <path d="M104 200 L136 200 L142 252 L98 252 Z" fill="currentColor"></path>
        <path d="M0 2 C-2 -2 -8 -2 -8 2 C-8 6 -3 8 0 11 C3 8 8 6 8 2 C8 -2 2 -2 0 2 Z" fill="var(--icon-accent)" transform="translate(120,116) scale(0.8)"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(196,120) scale(0.8)"></path>
</svg>`,
  // 09-prostration
  prostration: `<svg viewBox="0 0 240 300" fill="none">
<path d="M119 20 C174 12 212 58 205 120 C200 163 222 210 178 252 C142 286 80 290 52 250 C28 216 36 166 42 118 C48 72 66 28 119 20 Z" fill="currentColor" opacity=".12"></path>
        <rect x="42" y="220" width="156" height="14" rx="7" fill="currentColor"></rect>
        <g stroke="currentColor" stroke-width="3" stroke-linecap="round">
          <line x1="182" y1="234" x2="182" y2="244"></line><line x1="190" y1="234" x2="190" y2="244"></line><line x1="174" y1="234" x2="174" y2="244"></line>
        </g>
        <path d="M64 222 C64 180 96 166 122 174 C154 184 168 202 178 222 Z" fill="currentColor"></path>
        <circle cx="70" cy="204" r="17" fill="currentColor"></circle>
        <path d="M55 200 Q70 182 85 200 Q70 192 55 200 Z" fill="currentColor"></path>
        <path d="M76 218 L124 210" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(150,110)"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(60,120) scale(0.75)"></path>
</svg>`,
  // 10-standing-prayer
  standing: `<svg viewBox="0 0 240 300" fill="none">
<path d="M119 20 C174 12 212 58 205 120 C200 163 222 210 178 252 C142 286 80 290 52 250 C28 216 36 166 42 118 C48 72 66 28 119 20 Z" fill="currentColor" opacity=".12"></path>
        <rect x="64" y="248" width="112" height="12" rx="6" fill="currentColor"></rect>
        <g stroke="currentColor" stroke-width="3" stroke-linecap="round">
          <line x1="70" y1="260" x2="70" y2="269"></line><line x1="80" y1="260" x2="80" y2="270"></line><line x1="160" y1="260" x2="160" y2="270"></line><line x1="170" y1="260" x2="170" y2="269"></line>
        </g>
        <ellipse cx="120" cy="88" rx="23" ry="26" fill="currentColor" opacity=".12"></ellipse>
        <path d="M97 84 Q120 56 143 84 Q120 76 97 84 Z" fill="currentColor"></path>
        <path d="M96 148 L144 148 L150 248 L90 248 Z" fill="currentColor"></path>
        <path d="M100 150 L118 194" fill="none" stroke="currentColor" stroke-width="15" stroke-linecap="round"></path>
        <path d="M140 150 L122 194" fill="none" stroke="currentColor" stroke-width="15" stroke-linecap="round"></path>
        <circle cx="120" cy="196" r="9" fill="currentColor"></circle>
        <line x1="120" y1="196" x2="120" y2="204" stroke="currentColor" stroke-width="2"></line>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(180,110) scale(0.85)"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(56,116) scale(0.75)"></path>
</svg>`,
  // 11-quran-stand
  'quran-stand': `<svg viewBox="0 0 240 300" fill="none">
<path d="M119 20 C174 12 212 58 205 120 C200 163 222 210 178 252 C142 286 80 290 52 250 C28 216 36 166 42 118 C48 72 66 28 119 20 Z" fill="currentColor" opacity=".12"></path>
        <path d="M78 246 L150 172" fill="none" stroke="currentColor" stroke-width="13" stroke-linecap="round"></path>
        <path d="M162 246 L90 172" fill="none" stroke="currentColor" stroke-width="13" stroke-linecap="round"></path>
        <rect x="62" y="236" width="116" height="10" rx="5" fill="currentColor"></rect>
        <path d="M56 176 L120 164 L184 176 L184 188 L120 176 L56 188 Z" fill="currentColor"></path>
        <path d="M58 180 L118 170 L118 210 Q88 214 58 210 Z" fill="currentColor" opacity=".06"></path>
        <path d="M182 180 L122 170 L122 210 Q152 214 182 210 Z" fill="currentColor" opacity=".06"></path>
        <path d="M117 170 L123 170 L123 210 L117 210 Z" fill="currentColor"></path>
        <g stroke="currentColor" stroke-opacity=".4" stroke-width="2.4" stroke-linecap="round">
          <line x1="68" y1="184" x2="110" y2="178"></line><line x1="68" y1="192" x2="110" y2="186"></line><line x1="68" y1="200" x2="108" y2="195"></line>
          <line x1="130" y1="178" x2="172" y2="184"></line><line x1="130" y1="186" x2="172" y2="192"></line><line x1="132" y1="195" x2="172" y2="200"></line>
        </g>
        <path d="M120 150 a6 6 0 1 1 4.5 2.3" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(184,140) scale(0.8)"></path>
</svg>`,
  // 12-prayer-beads
  beads: `<svg viewBox="0 0 240 300" fill="none">
<path d="M119 20 C174 12 212 58 205 120 C200 163 222 210 178 252 C142 286 80 290 52 250 C28 216 36 166 42 118 C48 72 66 28 119 20 Z" fill="currentColor" opacity=".12"></path>
        <path d="M96 82 Q60 118 74 168 Q84 200 120 206 Q156 200 166 168 Q180 118 144 82" fill="none" stroke="currentColor" stroke-opacity=".12" stroke-width="2"></path>
        <circle cx="120" cy="76" r="7" fill="none" stroke="currentColor" stroke-width="3"></circle>
        <g fill="currentColor">
          <circle cx="102" cy="88" r="7"></circle><circle cx="88" cy="104" r="7"></circle><circle cx="80" cy="124" r="7"></circle><circle cx="80" cy="146" r="7"></circle><circle cx="88" cy="166" r="7"></circle><circle cx="102" cy="182" r="7"></circle>
          <circle cx="138" cy="88" r="7"></circle><circle cx="152" cy="104" r="7"></circle><circle cx="160" cy="124" r="7"></circle><circle cx="160" cy="146" r="7"></circle><circle cx="152" cy="166" r="7"></circle><circle cx="138" cy="182" r="7"></circle>
        </g>
        <circle cx="120" cy="192" r="9" fill="currentColor"></circle>
        <g stroke="currentColor" stroke-width="3" stroke-linecap="round">
          <line x1="120" y1="200" x2="112" y2="224"></line><line x1="120" y1="201" x2="120" y2="226"></line><line x1="120" y1="200" x2="128" y2="224"></line>
        </g>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(184,120) scale(0.8)"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(52,120) scale(0.75)"></path>
</svg>`,
  // 13-kaaba
  kaaba: `<svg viewBox="0 0 240 300" fill="none">
<path d="M119 20 C174 12 212 58 205 120 C200 163 222 210 178 252 C142 286 80 290 52 250 C28 216 36 166 42 118 C48 72 66 28 119 20 Z" fill="currentColor" opacity=".12"></path>
        <ellipse cx="122" cy="220" rx="82" ry="15" fill="none"></ellipse>
        <path d="M86 118 L154 118 L154 214 L86 214 Z" fill="currentColor"></path>
        <path d="M86 118 L108 100 L176 100 L154 118 Z" fill="currentColor" opacity=".85"></path>
        <path d="M154 118 L176 100 L176 196 L154 214 Z" fill="currentColor" opacity=".62"></path>
        <rect x="86" y="150" width="68" height="13" fill="currentColor"></rect>
        <path d="M154 150 L176 137 L176 150 L154 163 Z" fill="currentColor" opacity=".45"></path>
        <rect x="112" y="168" width="18" height="46" fill="none"></rect>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(64,92)"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(190,78) scale(0.85)"></path>
</svg>`,
  // 14-hands-dua
  dua: `<svg viewBox="0 0 240 300" fill="none">
<path d="M119 20 C174 12 212 58 205 120 C200 163 222 210 178 252 C142 286 80 290 52 250 C28 216 36 166 42 118 C48 72 66 28 119 20 Z" fill="currentColor" opacity=".12"></path>
        <path d="M98 198 L88 248" fill="none" stroke="currentColor" stroke-width="20" stroke-linecap="round"></path>
        <path d="M142 198 L152 248" fill="none" stroke="currentColor" stroke-width="20" stroke-linecap="round"></path>
        <path d="M78 168 Q120 146 162 168 Q152 202 120 202 Q88 202 78 168 Z" fill="currentColor"></path>
        <line x1="120" y1="150" x2="120" y2="200" stroke="currentColor" stroke-width="2"></line>
        <circle cx="80" cy="164" r="7" fill="currentColor"></circle>
        <circle cx="160" cy="164" r="7" fill="currentColor"></circle>
        <g stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.5">
          <line x1="98" y1="156" x2="100" y2="176"></line><line x1="110" y1="152" x2="111" y2="174"></line><line x1="130" y1="152" x2="129" y2="174"></line><line x1="142" y1="156" x2="140" y2="176"></line>
        </g>
        <path d="M0 2 C-2 -2 -8 -2 -8 2 C-8 6 -3 8 0 11 C3 8 8 6 8 2 C8 -2 2 -2 0 2 Z" fill="var(--icon-accent)" transform="translate(120,104) scale(1.05)"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(88,118)"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(156,116) scale(0.85)"></path>
</svg>`,
  // 15-iftar-dates
  dates: `<svg viewBox="0 0 240 300" fill="none">
<path d="M119 20 C174 12 212 58 205 120 C200 163 222 210 178 252 C142 286 80 290 52 250 C28 216 36 166 42 118 C48 72 66 28 119 20 Z" fill="currentColor" opacity=".12"></path>
        <path d="M158 70 A34 34 0 1 0 158 138 A27 27 0 1 1 158 70 Z" fill="currentColor"></path>
        <ellipse cx="98" cy="168" rx="12" ry="7.5" fill="currentColor" transform="rotate(-16 98 168)"></ellipse>
        <ellipse cx="120" cy="164" rx="12" ry="7.5" fill="currentColor"></ellipse>
        <ellipse cx="142" cy="168" rx="12" ry="7.5" fill="currentColor" transform="rotate(16 142 168)"></ellipse>
        <ellipse cx="109" cy="158" rx="11" ry="7" fill="currentColor" opacity=".45"></ellipse>
        <ellipse cx="131" cy="158" rx="11" ry="7" fill="currentColor" opacity=".45"></ellipse>
        <path d="M74 172 Q120 216 166 172 Z" fill="currentColor"></path>
        <ellipse cx="120" cy="172" rx="46" ry="9" fill="currentColor" opacity=".85"></ellipse>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(66,96) scale(0.85)"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(196,150) scale(0.8)"></path>
</svg>`,
  // 16-qibla-compass
  compass: `<svg viewBox="0 0 240 300" fill="none">
<path d="M119 20 C174 12 212 58 205 120 C200 163 222 210 178 252 C142 286 80 290 52 250 C28 216 36 166 42 118 C48 72 66 28 119 20 Z" fill="currentColor" opacity=".12"></path>
        <circle cx="120" cy="150" r="68" fill="currentColor"></circle>
        <circle cx="120" cy="150" r="53" fill="none"></circle>
        <g fill="currentColor">
          <circle cx="120" cy="108" r="3.5"></circle><circle cx="162" cy="150" r="3.5"></circle><circle cx="120" cy="192" r="3.5"></circle><circle cx="78" cy="150" r="3.5"></circle>
        </g>
        <path d="M120 110 L133 150 L120 150 Z" fill="currentColor"></path>
        <path d="M120 190 L107 150 L120 150 Z" fill="currentColor" opacity=".85"></path>
        <path d="M120 110 L107 150 L120 150 Z" fill="currentColor"></path>
        <path d="M120 190 L133 150 L120 150 Z" fill="currentColor" opacity=".62"></path>
        <circle cx="120" cy="150" r="6" fill="none"></circle>
        <path d="M120 96 a5 5 0 1 1 4 2" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(194,146) scale(0.8)"></path>
</svg>`,
  // 17-water-ewer
  ewer: `<svg viewBox="0 0 240 300" fill="none">
<path d="M119 20 C174 12 212 58 205 120 C200 163 222 210 178 252 C142 286 80 290 52 250 C28 216 36 166 42 118 C48 72 66 28 119 20 Z" fill="currentColor" opacity=".12"></path>
        <rect x="96" y="230" width="48" height="10" rx="5" fill="currentColor"></rect>
        <path d="M104 218 L136 218 L142 230 L98 230 Z" fill="currentColor"></path>
        <path d="M96 152 Q96 220 120 220 Q144 220 144 152 Q144 128 120 128 Q96 128 96 152 Z" fill="currentColor"></path>
        <rect x="111" y="102" width="18" height="30" fill="currentColor"></rect>
        <path d="M107 104 Q120 88 133 104 Z" fill="currentColor"></path>
        <circle cx="120" cy="84" r="4" fill="currentColor"></circle>
        <path d="M144 156 Q178 150 174 118 Q172 106 162 110" fill="none" stroke="currentColor" stroke-width="12" stroke-linecap="round"></path>
        <path d="M96 148 Q68 152 72 186 Q74 204 96 200" fill="none" stroke="currentColor" stroke-width="12" stroke-linecap="round"></path>
        <path d="M120 168 Q114 176 120 184 Q126 176 120 168 Z" fill="none"></path>
        <path d="M166 122 c-4 4 -5 9 0 13 c5 -4 4 -9 0 -13 z" fill="currentColor"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(56,116) scale(0.8)"></path>
</svg>`,
  // 18-ramadan-night
  night: `<svg viewBox="0 0 240 300" fill="none">
<path d="M119 20 C174 12 212 58 205 120 C200 163 222 210 178 252 C142 286 80 290 52 250 C28 216 36 166 42 118 C48 72 66 28 119 20 Z" fill="currentColor" opacity=".12"></path>
        <path d="M74 62 A30 30 0 1 0 74 122 A24 24 0 1 1 74 62 Z" fill="currentColor"></path>
        <line x1="168" y1="66" x2="168" y2="92" stroke="currentColor" stroke-width="3"></line>
        <path d="M158 96 L178 96 L174 88 L162 88 Z" fill="currentColor"></path>
        <path d="M158 98 L178 98 Q182 120 178 142 L172 152 L164 152 L158 142 Q154 120 158 98 Z" fill="currentColor"></path>
        <rect x="164" y="110" width="8" height="30" fill="none"></rect>
        <path d="M162 152 L174 152 L168 162 Z" fill="currentColor"></path>
        <path d="M40 226 L40 208 Q40 194 54 194 Q68 194 68 208 L68 226 Z" fill="currentColor"></path>
        <path d="M84 226 L84 196 Q84 176 104 176 Q124 176 124 196 L124 226 Z" fill="currentColor"></path>
        <path d="M140 226 L140 204 Q140 188 156 188 Q172 188 172 204 L172 226 Z" fill="currentColor"></path>
        <rect x="34" y="224" width="146" height="8" rx="4" fill="currentColor"></rect>
        <line x1="104" y1="176" x2="104" y2="166" stroke="currentColor" stroke-width="3" stroke-linecap="round"></line>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(120,74)"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(196,120) scale(0.8)"></path>
        <circle cx="110" cy="110" r="3" fill="currentColor"></circle><circle cx="150" cy="70" r="3" fill="currentColor"></circle>
</svg>`,
  // 19-star-pattern
  pattern: `<svg viewBox="0 0 240 300" fill="none">
<path d="M119 20 C174 12 212 58 205 120 C200 163 222 210 178 252 C142 286 80 290 52 250 C28 216 36 166 42 118 C48 72 66 28 119 20 Z" fill="currentColor" opacity=".12"></path>
        <path d="M120 80 L132.3 120.4 L169.5 100.5 L149.6 137.8 L190 150 L149.6 162.3 L169.5 199.5 L132.3 179.6 L120 220 L107.8 179.6 L70.5 199.5 L90.4 162.3 L50 150 L90.4 137.8 L70.5 100.5 L107.8 120.4 Z" fill="currentColor"></path>
        <path d="M132.3 120.4 L169.5 100.5 L149.6 137.8 L190 150 L149.6 162.3 L169.5 199.5 L132.3 179.6 L120 220 L107.8 179.6 L70.5 199.5 L90.4 162.3 L50 150 L90.4 137.8 L70.5 100.5 L107.8 120.4 L120 80 Z" fill="none"></path>
        <path d="M132.3 120.4 L149.6 137.8 L149.6 162.3 L132.3 179.6 L107.8 179.6 L90.4 162.3 L90.4 137.8 L107.8 120.4 Z" fill="currentColor" opacity=".12"></path>
        <path d="M132.3 120.4 L149.6 137.8 L149.6 162.3 L132.3 179.6 L107.8 179.6 L90.4 162.3 L90.4 137.8 L107.8 120.4 Z" fill="none" stroke="currentColor" stroke-width="2.5"></path>
        <circle cx="120" cy="150" r="11" fill="currentColor"></circle>
        <circle cx="120" cy="150" r="4.5" fill="currentColor" opacity=".12"></circle>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(120,86) scale(0.7)"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(184,150) scale(0.7)"></path>
</svg>`,
  // 20-ramadan-calendar
  calendar: `<svg viewBox="0 0 240 300" fill="none">
<path d="M119 20 C174 12 212 58 205 120 C200 163 222 210 178 252 C142 286 80 290 52 250 C28 216 36 166 42 118 C48 72 66 28 119 20 Z" fill="currentColor" opacity=".12"></path>
        <rect x="86" y="78" width="6" height="18" rx="3" fill="currentColor"></rect>
        <rect x="148" y="78" width="6" height="18" rx="3" fill="currentColor"></rect>
        <rect x="60" y="86" width="120" height="148" rx="14" fill="currentColor" fill-opacity=".06" stroke="currentColor" stroke-opacity=".12" stroke-width="3"></rect>
        <path d="M60 100 Q60 86 74 86 L166 86 Q180 86 180 100 L180 122 L60 122 Z" fill="currentColor"></path>
        <path d="M126 96 A14 14 0 1 0 126 124 A11 11 0 1 1 126 96 Z" fill="none"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="none" transform="translate(146,110) scale(0.7)"></path>
        <g fill="currentColor" opacity=".12">
          <circle cx="80" cy="146" r="5"></circle><circle cx="104" cy="146" r="5"></circle><circle cx="128" cy="146" r="5"></circle><circle cx="152" cy="146" r="5"></circle>
          <circle cx="80" cy="170" r="5"></circle><circle cx="104" cy="170" r="5"></circle><circle cx="152" cy="170" r="5"></circle>
          <circle cx="80" cy="194" r="5"></circle><circle cx="104" cy="194" r="5"></circle><circle cx="128" cy="194" r="5"></circle><circle cx="152" cy="194" r="5"></circle>
          <circle cx="80" cy="218" r="5"></circle><circle cx="128" cy="218" r="5"></circle><circle cx="152" cy="218" r="5"></circle>
        </g>
        <circle cx="128" cy="170" r="9" fill="currentColor"></circle>
        <circle cx="104" cy="218" r="9" fill="none" stroke="currentColor" stroke-width="3"></circle>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(196,120) scale(0.8)"></path>
</svg>`,
};

/* AW.UNIT_ICON — u1..u4 scene mapping (Gen-3 semantics preserved so runner defaults resolve). */
AW.UNIT_ICON = { u1: 'compass', u2: 'lanterns', u3: 'kaaba', u4: 'mosque' };

/* AW.GLYPHS — the 13 small UI glyphs Gen-3 scattered as standalone + per-page constants,
   re-homed into ONE ~24x24 square sub-map (D-33). Single source, no per-page constants: these
   replace every duplicate per-page icon constant. Path data ported from Gen-3's standalone
   glyph + marker constants; each value is a self-contained <svg …>. */
AW.GLYPHS = {
  // flame — streak flame
  flame: '<svg viewBox="0 0 24 24"><path d="M12 2 C13 6 17 7 16.5 12 C16 16 13 16 13 13 C12 15 10 15.5 10.5 18 C8 16.5 7 14 8 11 C9 13 10.5 12 10 9 C11 8 12 6 12 2Z" fill="#F0730B"/></svg>',
  // spark — combo/noor spark (gold)
  spark: '<svg viewBox="0 0 24 24"><path d="M12 3 C13 8 16 11 21 12 C16 13 13 16 12 21 C11 16 8 13 3 12 C8 11 11 8 12 3Z" fill="#E8A400"/></svg>',
  // check — verdict tick
  check: '<svg viewBox="0 0 24 24"><path d="M5 12.5 L10 17.5 L19 7" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  // star — earned star (gold)
  star: '<svg viewBox="0 0 24 24"><path d="M12 2.5 L14.9 9 L22 9.7 L16.7 14.4 L18.3 21.4 L12 17.6 L5.7 21.4 L7.3 14.4 L2 9.7 L9.1 9 Z" fill="#FFD34D" stroke="#E8A400" stroke-width="1"/></svg>',
  // cite — citation bookmark
  cite: '<svg viewBox="0 0 24 24"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-3.2L5 21V4a1 1 0 0 1 1-1Z" fill="#2536CE"/></svg>',
  // lamp — small lantern glyph
  lamp: '<svg viewBox="0 0 20 24"><path d="M10 2 L13 5 L13 8 Q16 12 13 17 L13 20 L7 20 L7 17 Q4 12 7 8 L7 5 Z" fill="#E8A400"/><path d="M8.5 9 h3 v7 h-3 z" fill="#FFF3CC"/></svg>',
  // lock — locked node
  lock: '<svg viewBox="0 0 24 24"><path d="M7 10 V8 a5 5 0 0 1 10 0 v2" fill="none" stroke="#AAB4CC" stroke-width="2.2"/><rect x="5.5" y="10" width="13" height="9.5" rx="2.5" fill="#AAB4CC"/></svg>',
  // chest — reward chest
  chest: '<svg viewBox="0 0 24 24"><path d="M4 8 a4 4 0 0 1 4-4 h8 a4 4 0 0 1 4 4 v2 H4 Z" fill="#fff"/><path d="M4 11 h16 v7 a2 2 0 0 1 -2 2 H6 a2 2 0 0 1 -2-2 Z" fill="#fff" opacity=".75"/><rect x="10.6" y="9" width="2.8" height="5" rx="1.2" fill="#B4720C"/></svg>',
  // trophy — legendary review
  trophy: '<svg viewBox="0 0 24 24"><path d="M7 3 h10 v3 a5 5 0 0 1 -3.2 4.66 L13 13 h2 l1 4 H8 l1-4 h2 l-.8-2.34 A5 5 0 0 1 7 6 Z" fill="#fff"/><path d="M7 4 H4 v2 a3 3 0 0 0 3 3 M17 4 h3 v2 a3 3 0 0 1 -3 3" fill="none" stroke="#fff" stroke-width="1.6"/><rect x="7" y="18.5" width="10" height="2.6" rx="1.3" fill="#fff"/></svg>',
  // fact — "worth knowing" marker
  fact: '<svg viewBox="0 0 24 24"><path d="M12 3 C13 8 16 11 21 12 C16 13 13 16 12 21 C11 16 8 13 3 12 C8 11 11 8 12 3Z" fill="#2E6BF5"/></svg>',
  // remember — "worth remembering" marker
  remember: '<svg viewBox="0 0 24 24"><path d="M7 3h10a1 1 0 0 1 1 1v17l-6-4-6 4V4a1 1 0 0 1 1-1Z" fill="#2E6BF5"/></svg>',
  // fard — "the first duty" marker
  fard: '<svg viewBox="0 0 24 24"><path d="M17 4 A9 9 0 1 0 17 20 A7 7 0 1 1 17 4Z" fill="#2E6BF5"/></svg>',
  // angle — "another angle" marker
  angle: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="#2E6BF5" stroke-width="2"/><path d="M12 7 L14.5 12 L12 17 L9.5 12Z" fill="#2E6BF5"/></svg>',
};

/* ============================================================
   COMPONENTS  ·  Phase 3 — shared UI builders (D-22)
   ============================================================ */

/* ---------- escapeHtml / escapeAttr — output-encoding for the dynamic string params this phase
   controls (AW.icon `label` → aria-label, AW.cite `label`). Closes the ENGINE-CONTRACT §6
   no-escaping gap for exactly these params (T-03-04 mitigate); author-content scripture injected
   verbatim by sheetRef/sheetTerm stays as-is per the accept disposition (T-03-03). `&` is escaped
   FIRST so the entities the later passes introduce are never double-escaped. */
function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
function escapeAttr(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/* ---------- AW.icon(name, {size?, label?}) — the ONE a11y icon accessor (FND-04 / D-32).
   Resolves the raw SVG from AW.KIT first, AW.GLYPHS second; a missing/malformed name returns ''
   (never a broken image or tofu, never throws). Injects attributes immediately after the first
   `<svg` — String.prototype.replace with a STRING first-arg replaces only the first match, so a
   nested `<svg>` can never be hit. Decorative by default (`aria-hidden="true" focusable="false"`),
   or an accessible image (`role="img" aria-label="…"`, label escaped) when `label` is passed.
   `size` sets width + height:auto so the viewBox preserves each icon's aspect (portrait scenes
   stay 0.8, square glyphs accept a square size). Raw AW.KIT[name] access stays available for
   legacy runner code. */
AW.icon = function (name, opts) {
  opts = opts || {};
  var raw = (AW.KIT && AW.KIT[name]) || (AW.GLYPHS && AW.GLYPHS[name]) || '';
  if (raw.indexOf('<svg') !== 0) return ''; // missing/malformed → empty, never throw
  var attrs = opts.label
    ? 'role="img" aria-label="' + escapeAttr(opts.label) + '"' // ACC-02 forward-compat
    : 'aria-hidden="true" focusable="false"'; // default: decorative
  if (opts.size) attrs += ' style="width:' + escapeAttr(opts.size) + ';height:auto"';
  return raw.replace('<svg', '<svg ' + attrs); // string first-arg = first match only
};

/* ---------- AW.cite(id, label) — synchronous, DOM-free, parse-time (Josh's data files call it
   inside cfg string concatenation, so it must resolve at author time with no DOM). The outer
   `<span class="cite" data-ref="ID">…</span>` shape is BYTE-preserved so the Phase-2 validator
   stub and its /data-ref=["']([^"']+)["']/g extractor keep matching — breaking it breaks the
   Phase-4 port gate. The leading cite glyph precedes the escaped label (id is an author slug key,
   left verbatim to stay byte-identical to the validator stub). */
AW.cite = function (id, label) {
  return (
    '<span class="cite" data-ref="' +
    id +
    '">' +
    AW.icon('cite') +
    escapeHtml(label == null ? '' : label) +
    '</span>'
  );
};

/* ---------- AW.wire(root, cfg) — binds citation + term chips on a rendered DOM root to their
   sheets: `.cite[data-ref]` → AW.sheetRef(cfg.refs, id); `.term[data-term]` → AW.sheetTerm(
   cfg.terms, id). sheetRef/sheetTerm are defined below and resolved at click time, so forward
   reference is safe. Runs entirely at call time (no parse-time DOM access). */
AW.wire = function (root, cfg) {
  cfg = cfg || {};
  root.querySelectorAll('.cite[data-ref]').forEach(function (el) {
    el.addEventListener('click', function () {
      AW.sheetRef(cfg.refs || {}, el.dataset.ref);
    });
  });
  root.querySelectorAll('.term[data-term]').forEach(function (el) {
    el.addEventListener('click', function () {
      AW.sheetTerm(cfg.terms || {}, el.dataset.term);
    });
  });
};

/* ---------- AW.reducedMotion() — the ONE self-guard every JS-driven motion primitive calls
   (D-42). True when the OS asks for reduced motion (matchMedia) OR the in-app awba_prefs override
   stamped `data-motion="reduce"` onto <html> (the boot-stamp above writes only the override, never
   the OS setting — so BOTH triggers are checked here). Guarded so bare window/document access can
   never throw headless (the engine loads in node:vm with neither global). matchMedia is read off
   the window object (not a bare global) so a stubbed `window` in tests resolves it. */
AW.reducedMotion = function () {
  return (
    (typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) ||
    (typeof document !== 'undefined' &&
      document.documentElement.getAttribute('data-motion') === 'reduce')
  );
};

/* ---------- AW.sheet(html) — ONE lazily-created singleton bottom-sheet (D-35). Mirrors the
   AW.prefs/AW.S closure idiom: private scrim/sheet/invoker, an ensure() that builds the scrim +
   role="dialog"/aria-modal sheet on <body> once and wires outside-tap + Escape close, and an
   `api` with open(html)/close(). Opening REPLACES content (singleton — one element), captures the
   invoker for Phase-6 focus-restore, adds the in-sheet close button (D-35) and the <html>
   .sheet-lock scroll-lock. close() is idempotent. All DOM access is inside functions, so the IIFE
   is parse-time-safe (no DOM touched at definition). DEFERRED to Phase 6 (deliberately NOT built
   here): focus-trap, inert/aria-hidden on the background, full iOS position-fixed scroll lock —
   the scrim-wraps-sheet structure leaves room for the trap. */
AW.sheet = (function () {
  var scrim, sheet, invoker;
  function ensure() {
    if (scrim) return;
    scrim = document.createElement('div');
    scrim.className = 'scrim';
    sheet = document.createElement('div');
    sheet.className = 'sheet';
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-modal', 'true');
    scrim.appendChild(sheet);
    document.body.appendChild(scrim);
    scrim.addEventListener('click', function (e) {
      if (e.target === scrim) api.close(); // outside-tap closes
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') api.close();
    });
  }
  var api = {
    open: function (html) {
      ensure();
      invoker = document.activeElement; // Phase-6 hook: restore focus on close
      sheet.innerHTML = '<button class="sheet-x" aria-label="Close">×</button>' + html;
      sheet.querySelector('.sheet-x').addEventListener('click', api.close);
      scrim.classList.add('open'); // singleton: one element ⇒ opening replaces any open content
      document.documentElement.classList.add('sheet-lock'); // scroll-lock while open
    },
    close: function () {
      if (!scrim) return; // idempotent — safe before any open
      scrim.classList.remove('open');
      document.documentElement.classList.remove('sheet-lock');
      if (invoker && invoker.focus) invoker.focus(); // Phase-6-ready focus restore
    },
  };
  var open = function (html) {
    api.open(html);
    return api;
  };
  open.close = api.close; // AW.sheet.close()
  return open;
})();
AW.sheetClose = function () {
  AW.sheet.close();
};

/* ---------- AW.sheetRef(refs, id) — the citation sheet (ENG-06 / D-36). Unknown id → no-op (never
   an error). The load-bearing elevation over Gen-3 is the FACE-SPLIT: a Qur'an ref (no `grade`)
   tags its Arabic block `.ayah` so it renders in Amiri Quran; a hadith ref (grade present) renders
   in general Amiri and surfaces its grade. The `unverified · pending review` pill is appended on
   EVERY citation (global pending state); the green grade pill joins the pill row only when the ref
   carries a grade. Scripture/translation/provenance fields inject verbatim (T-03-03 accept —
   author-controlled data, never user input). Nothing celebratory ever renders in this sheet. */
AW.sheetRef = function (refs, id) {
  var r = refs && refs[id];
  if (!r) return; // unknown id → no-op
  var isQuran = !r.grade; // Qur'an ref carries no grade → Amiri Quran (.ayah); hadith → general Amiri
  var arClass = isQuran ? 'r-ar ayah' : 'r-ar';
  var gradePill = r.grade ? '<span class="r-pill grade">' + r.grade + '</span>' : '';
  var html =
    '<div class="grip"></div>' +
    '<div class="r-src">' + (r.kind || 'The verse') + ' · ' + r.ref + '</div>' +
    '<div class="' + arClass + '" lang="ar" dir="rtl">' + r.ar + '</div>' +
    '<div class="r-mean">' + r.mean + '</div>' +
    '<div class="r-ref">' + r.src + '</div>' +
    '<div class="r-pills">' +
    '<span class="r-pill">unverified · pending review</span>' +
    gradePill +
    '</div>';
  return AW.sheet(html);
};

/* ---------- AW.sheetTerm(terms, id) — the term gloss sheet (ENG-06 / D-36). Unknown id → no-op.
   Field-for-field per ENGINE-CONTRACT §1: Arabic (Amiri, large, RTL) · transliteration · gloss
   word · definition · context. */
AW.sheetTerm = function (terms, id) {
  var t = terms && terms[id];
  if (!t) return; // unknown id → no-op
  var html =
    '<div class="grip"></div>' +
    '<div class="g-ar" lang="ar" dir="rtl">' + t.ar + '</div>' +
    '<div class="g-tl">' + t.tl + '</div>' +
    '<div class="g-wd">' + t.word + '</div>' +
    '<div class="g-df">' + t.def + '</div>' +
    '<div class="g-cx">' + t.ctx + '</div>';
  return AW.sheet(html);
};

/* ---------- AW.confetti(n) — the reward burst primitive (D-41). Its FIRST executable line is the
   reduced-motion guard (Gen-3 had none — this is the day-one elevation): under reduced motion no
   div is ever spawned. Lazily creates/finds a `.confetti` overlay on <body> (decoupled from any
   lesson skeleton), then spawns a capped count of `.cf` divs — random left, colour drawn from the
   brand tokens (--gold2/--flame2/--accent-bright/--green) via getComputedStyle, transform-only
   fall of 1.6–2.7s — each self-removing on animationend (setTimeout fallback). Mercy: the caller
   never fires it over scripture (RWD-03); components read prefs via data attributes / AW.prefs,
   never the storage layer directly (D-24). */
AW.confetti = function (n) {
  if (AW.reducedMotion()) return; // day-one guard — nothing spawns under reduced motion
  var layer = document.querySelector('.confetti');
  if (!layer) {
    layer = document.createElement('div');
    layer.className = 'confetti';
    document.body.appendChild(layer);
  }
  var cs = getComputedStyle(document.documentElement);
  var cols = ['--gold2', '--flame2', '--accent-bright', '--green'].map(function (tok) {
    return cs.getPropertyValue(tok).trim();
  });
  var count = Math.min(Math.max(1, n || 24), 30); // performance bound — Gen-3 counts ~16–30
  for (var i = 0; i < count; i++) {
    var d = document.createElement('div');
    d.className = 'cf';
    d.style.left = Math.random() * 100 + '%';
    d.style.background = cols[i % cols.length];
    var dur = 1.6 + (i % 7) * 0.18; // 1.6–2.7s
    d.style.animationDuration = dur + 's';
    d.style.animationDelay = (i % 5) * 0.05 + 's';
    (function (node, ms) {
      node.addEventListener('animationend', function () {
        node.remove();
      });
      setTimeout(function () {
        node.remove();
      }, ms);
    })(d, (dur + 0.4) * 1000);
    layer.appendChild(d);
  }
};

/* ---------- AW.animate(el, keyframes, durToken, easeToken) — the WAAPI orchestration exemplar
   Phase 4 COPIES rather than invents (D-41). Reads the ms duration + the linear()/cubic-bezier
   easing straight off :root via getComputedStyle (`"600ms"` → 600; the linear(…) string is a
   valid WAAPI easing verbatim), self-guards `dur = 1` under reduced motion (JS snapshots at call
   time and never sees the CSS token-collapse), and returns the Animation so `.finished` is
   awaitable for sequencing. */
AW.animate = function (el, keyframes, durToken, easeToken) {
  var cs = getComputedStyle(document.documentElement);
  var dur = parseFloat(cs.getPropertyValue(durToken)) || 300; // "600ms" → 600 (ms)
  var ease = cs.getPropertyValue(easeToken).trim() || 'ease'; // linear(…) passes straight through
  if (AW.reducedMotion()) dur = 1; // self-guard — WAAPI won't see the CSS collapse
  return el.animate(keyframes, { duration: dur, easing: ease, fill: 'both' }); // .finished awaitable
};

/* ============================================================
   RING  ·  MOT-01 — the tawaf fingerprint (macro progress; the maker's mark, law 10)
   --------------------------------------------------------------------------------------------
   The Orbit `draw` verb realised as progressive inking. A seeded, DETERMINISTIC SVG generator:
   the same `seed` + same `atomsDone`/`circuitsDone` yield BYTE-IDENTICAL markup across reloads
   and machines. The seed is the only entropy — minted once (below) and stored; the generator
   path never touches `Date` or `Math.random`. Ink-bleed is stroke/opacity variance + round
   caps, never a blur filter (perf + no runtime turbulence). See spec §6.
   ============================================================ */

/* AW.ringSeed() — the learner's stable maker's mark. Read once from awba_state.ringSeed; if
   absent, mint a 32-bit unsigned int and persist it ONCE through the AW.S seam (D-24 — never
   localStorage directly). A lazy accessor BY DESIGN, not a schemaVersion bump: adding a random
   field to defaultState() would rewrite legacy blobs on load and break the blob-survives-
   untouched state tests. Math.random here mints the seed only (call-time, once); the generator
   below is seeded from it and never calls Math.random itself. Parse-time-safe (no DOM). */
AW.ringSeed = function () {
  var s = AW.S.get('ringSeed', null);
  if (s === null || typeof s !== 'number') {
    s = (Math.random() * 0x100000000) >>> 0;
    AW.S.set('ringSeed', s);
  }
  return s;
};

/* mulberry32 — a tiny, fast, seedable PRNG (~6 lines, inline). Returns a closure producing
   floats in [0,1). This is the ONLY entropy in the generator: every jitter is pulled from it in
   a FIXED order, so a given seed reproduces the exact same geometry byte-for-byte. */
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    var t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* AW.ringSVG(cfg) — the deterministic tawaf-fingerprint generator (spec §6.2–§6.5).
   GEOMETRY is a pure function of `seed`, drawn from mulberry32 in a fixed order and INDEPENDENT
   of progress. PROGRESS (`atomsDone`/`circuitsDone`) only decides each dab's colour-by-state and
   which frontier dabs carry the `draw` (ink-draw) animation. Concentric jittered pilgrim-rows
   (15 lessons banded into 4 circuits) of short round-capped dab-strokes with per-dab stroke-width
   in [1.8,4.1] and opacity in [0.45,0.95]; ink-bleed is that variance + round caps, NEVER a blur.
   One outer gold thread (up to 4 arcs, one per completed circuit) and a single static gold
   head-dot at the frontier (the centre never animates, law 9). Reduced motion → the final state,
   static. Returns an inline <svg> string. No Date, no Math.random in this path. */
AW.ringSVG = function (cfg) {
  cfg = cfg || {};
  var struct = cfg.structure || { circuits: 4, lessons: 15, atoms: 65 };
  var CIRCUITS = struct.circuits, LESSONS = struct.lessons, ATOMS = struct.atoms;
  var seed = (typeof cfg.seed === 'number') ? (cfg.seed >>> 0) : AW.ringSeed();
  var atomsDone = Math.max(0, Math.min(ATOMS, cfg.atomsDone | 0));
  var size = cfg.size || 300;
  var reduce = AW.reducedMotion();
  var rnd = mulberry32(seed);

  // Colour-by-state tokens (§6.3): faint navy → warm ember → bright cream → sealed gold.
  var C_UNINK = '#4A5C82', C_EMBER = '#E8502A', C_CREAM = '#F3EDE2', C_GOLD = '#D9A441';
  var TAU = Math.PI * 2, cx = size / 2, cy = size / 2, i;
  var f = function (x) { return (Math.round(x * 100) / 100).toString(); };

  // Course shape: distribute atoms across lessons, band lessons into circuits.
  var b = Math.floor(ATOMS / LESSONS), extra = ATOMS - b * LESSONS;
  var lessonAtoms = [], lessonStart = [], acc = 0;
  for (i = 0; i < LESSONS; i++) {
    var na = b + (i < extra ? 1 : 0);
    lessonAtoms.push(na); lessonStart.push(acc); acc += na;
  }
  var perC = Math.floor(LESSONS / CIRCUITS), cExtra = LESSONS - perC * CIRCUITS;
  var lessonCircuit = [], cc = 0, rem = perC + (0 < cExtra ? 1 : 0);
  for (i = 0; i < LESSONS; i++) {
    while (rem === 0 && cc < CIRCUITS - 1) { cc++; rem = perC + (cc < cExtra ? 1 : 0); }
    lessonCircuit.push(cc); rem--;
  }
  var circuitEnd = new Array(CIRCUITS).fill(0);
  for (i = 0; i < LESSONS; i++) circuitEnd[lessonCircuit[i]] = lessonStart[i] + lessonAtoms[i];
  var circuitsDone;
  if (typeof cfg.circuitsDone === 'number') {
    circuitsDone = Math.max(0, Math.min(CIRCUITS, cfg.circuitsDone | 0));
  } else { // derive from atomsDone when the caller supplies only progress count
    circuitsDone = 0;
    for (i = 0; i < CIRCUITS; i++) if (atomsDone >= circuitEnd[i]) circuitsDone = i + 1;
  }

  // Radii: pilgrim-rows march inward; the gold thread rides just outside them.
  var rOuter = size * 0.42, rInner = size * 0.155, span = rOuter - rInner;

  // Build every dab's geometry (seed-driven, progress-INDEPENDENT) in a fixed rnd() order.
  var dabs = [], frontier = null;
  for (i = 0; i < LESSONS; i++) {
    var rowT = LESSONS > 1 ? i / (LESSONS - 1) : 0;
    var rowR = (rOuter - span * rowT) + (rnd() - 0.5) * (span / LESSONS) * 0.7;
    var start = rnd() * TAU;                     // where this row's broken arc opens
    var sweep = (0.60 + rnd() * 0.30) * TAU;      // < full circle → a gap remains
    var dabCount = 14 + Math.floor(rnd() * 9);    // 14..22
    var atomN = lessonAtoms[i], atom0 = lessonStart[i];
    for (var j = 0; j < dabCount; j++) {
      var t = dabCount > 1 ? j / (dabCount - 1) : 0;
      var ang = start + sweep * t + (rnd() - 0.5) * (sweep / dabCount) * 0.55;
      var r = rowR + (rnd() - 0.5) * 3.2;
      var px = cx + Math.cos(ang) * r, py = cy + Math.sin(ang) * r;
      var pts = 2 + Math.floor(rnd() * 3);        // 2..4 points per dab
      var tx = -Math.sin(ang), ty = Math.cos(ang);
      var lenPx = size * (0.018 + rnd() * 0.022);
      var coords = [], segLen = 0, prevx = null, prevy = null;
      for (var k = 0; k < pts; k++) {
        var along = (pts > 1 ? k / (pts - 1) - 0.5 : 0) * lenPx;
        var pw = (rnd() - 0.5) * 2.4;             // perpendicular ink wobble
        var dx = px + tx * along + Math.cos(ang) * pw;
        var dy = py + ty * along + Math.sin(ang) * pw;
        coords.push(f(dx) + ' ' + f(dy));
        if (prevx !== null) segLen += Math.hypot(dx - prevx, dy - prevy);
        prevx = dx; prevy = dy;
      }
      var sw = 1.8 + rnd() * (4.1 - 1.8);
      var op = 0.45 + rnd() * (0.95 - 0.45);
      var atomIdx = atom0 + (atomN > 0 ? Math.floor(j * atomN / dabCount) : 0);
      var dab = { d: 'M' + coords.join(' L'), sw: sw, op: op, lesson: i, atom: atomIdx, x: px, y: py, len: segLen };
      dabs.push(dab);
      if (atomIdx < atomsDone) frontier = dab;    // last inked dab in course order = the head
    }
  }

  // Emit dab paths: colour-by-state, with the draw animation ONLY on the in-progress frontier row.
  var parts = [];
  for (i = 0; i < dabs.length; i++) {
    var db = dabs[i];
    var inked = db.atom < atomsDone;
    var lessonDone = atomsDone >= (lessonStart[db.lesson] + lessonAtoms[db.lesson]);
    var sealed = lessonCircuit[db.lesson] < circuitsDone;
    var col, animate = false;
    if (!inked) col = C_UNINK;
    else if (sealed) col = C_GOLD;
    else if (lessonDone) col = C_CREAM;
    else { col = C_EMBER; animate = !reduce; }     // freshly-inked → the only dabs that draw
    var a = 'd="' + db.d + '" stroke="' + col + '" stroke-width="' + f(db.sw) +
      '" stroke-opacity="' + f(db.op) + '" stroke-linecap="round" fill="none"';
    if (animate) {
      var L = f(Math.max(1, db.len));
      a += ' stroke-dasharray="' + L + '" style="--len:' + L + ';animation:ink-draw var(--dur-draw) var(--ease) both"';
    }
    parts.push('<path ' + a + '/>');
  }

  // Outer gold thread: one arc per completed circuit; at CIRCUITS the thread closes the ring.
  var threadR = rOuter + size * 0.045;
  for (i = 0; i < circuitsDone; i++) {
    var a0 = -Math.PI / 2 + (i / CIRCUITS) * TAU, a1 = -Math.PI / 2 + ((i + 1) / CIRCUITS) * TAU;
    var x0 = cx + Math.cos(a0) * threadR, y0 = cy + Math.sin(a0) * threadR;
    var x1 = cx + Math.cos(a1) * threadR, y1 = cy + Math.sin(a1) * threadR;
    parts.push('<path class="ring-thread" d="M' + f(x0) + ' ' + f(y0) + 'A' + f(threadR) + ' ' + f(threadR) +
      ' 0 0 1 ' + f(x1) + ' ' + f(y1) + '" stroke="' + C_GOLD + '" stroke-width="1.9" stroke-opacity="0.95" stroke-linecap="round" fill="none"/>');
  }

  // Head-dot: a single static gold circle at the inking frontier (the tawaf head).
  var head = frontier || dabs[0];
  var headSVG = head ? '<circle class="ring-head" cx="' + f(head.x) + '" cy="' + f(head.y) +
    '" r="' + f(size * 0.013) + '" fill="' + C_GOLD + '"/>' : '';

  var label = 'Tawaf ring — ' + atomsDone + ' of ' + ATOMS + ' inked';
  return '<svg xmlns="http://www.w3.org/2000/svg" class="ring" viewBox="0 0 ' + size + ' ' + size +
    '" width="' + size + '" height="' + size + '" role="img" aria-label="' + label +
    '" data-seed="' + seed + '" data-atoms="' + atomsDone + '" data-circuits="' + circuitsDone +
    '"><g class="ring-dabs">' + parts.join('') + '</g>' + headSVG + '</svg>';
};

/* ============================================================
   RUNNERS  ·  Phase 4 placeholder — AwbaLesson(cfg) / AwbaReview(cfg) (D-22)
   ============================================================ */
