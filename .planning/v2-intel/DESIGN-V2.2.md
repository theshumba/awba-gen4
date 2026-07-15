# DESIGN-V2.2.md — the BINDING v2.2 design spec (take-your-light-with-you · owner launch kit · sound audition)

**Author:** Fable (design authority for awba-gen4). **Date:** 2026-07-16.
**Method:** extends the shipped **DESIGN-V2.md** (v2 contract) and **DESIGN-V2.1.md** (S5/S6/S7) with
three net-new deliverables, each verified against ground truth: `shared/awba-engine.js` (the real `AW.S`
closure — `load`/`persist`/`defaultState`/`runMigrations`/`memFallback`/`isFallback`/`reset`, the S2
precedent this spec's export/import **reuses**), `shared/course-structure.js` (the authoritative node-id
registry), the shipped `more.html` (§D grammar + sheet/btn vocabulary), `sw.js` (currently `awba-cache-v3`),
`docs/scholar-pack.html` + `scripts/build-scholar-pack.js` (the *self-contained, not-precached,
not-gate-discovered* docs-artifact precedent), and the emil bar (*inevitable, not decorated*).

**Authority order (unchanged):** `ATHAR-SYSTEM.md` (canon) → `03-UI-SPEC-ATHAR.md` → R0 → **DESIGN-V2.md**
→ **DESIGN-V2.1.md** → **this doc** for the three v2.2 deliverables only. Nothing here overrides a v2/v2.1
ruling. Every authored string below is **final copy** for builders to paste.

**What v2.2 delivers:**
- **E1 — Progress export/import ("take your light with you").** One engine seam (**S8**: `AW.S.exportToken`
  / `AW.S.importToken`, reusing the existing `persist`/`defaultState`/`runMigrations` internals — **no new
  storage literal**) + a new **More** row + one two-half sheet + engine tests. The app's promise ("nothing
  is ever lost") stops being a lie the moment a device is lost/switched/evicted; a *travel code* keeps it.
- **E2 — Owner launch kit** (`docs/launch-kit.html`) — a self-contained, print-friendly, **not-precached,
  not-gate-discovered** owner document (the scholar-pack precedent): an interactive on-phone device-walk
  checklist, the `awba.app` DNS cutover, the licensing/scholar section, the open-decisions ledger.
- **E3 — Sound audition kit** (`scripts/build-sound-candidates.js` → `docs/sound-audition/*.wav` +
  `docs/sound-audition.html`) — **candidates only**; the app stays silent (D-52 remains owner-gated).

**What v2.2 does NOT touch:** the 19 SHA-frozen content files, the DAILY 7 + EPIGRAPH SHA pins, the
practice pool/seam, the tab bar, the first-run guard, `AW.GLYPHS`(13)/`AW.KIT`(20)/`NODE_ATOMS`(Σ61),
`AW.prefs` schema, onboarding/practice/profile surfaces. E1 is one additive engine seam + one More edit +
a cache bump; E2/E3 are docs/dev-tooling only.

---

## 0 · Global rulings that bind v2.2 (every v2 / v2.1 HARD LAW stands)

Carried forward verbatim; the load-bearing ones for v2.2:

- **Engine `localStorage`-literal count stays EXACTLY 13.** S8 reuses the existing `persist()` /
  `defaultState()` / `runMigrations()` internals inside the `AW.S` closure — it introduces **no new
  storage-API literal** (the `AW.S.reset()` precedent, verified: reset added 0). Every *page's* direct
  storage-word count stays **0** (More reads/writes only through `AW.S.exportToken`/`importToken`).
- **Exception, stated once:** `docs/launch-kit.html` is a **docs artifact, not an app surface** (the
  scholar-pack precedent). It legitimately uses **its own** single `localStorage` key for the checklist
  (the task mandates persistence). This is *outside* the app's storage-word gate because launch-kit.html
  is never precached and never in any gate's page discovery — an explicit source comment must say so. It
  still emits **zero gated literals**.
- **`@layer tokens, base, components, screens, motion;` appears exactly once repo-wide.** More adds only
  content to its existing `@layer screens { }` block; docs artifacts never `<link>` the engine CSS.
- **`AW.GLYPHS` = 13 / `AW.KIT` = 20 frozen; `NODE_ATOMS` Σ = 61.** S8 adds two module-private id lists
  (`REVIEW_IDS`, `CHEST_IDS`) beside `NODE_ATOMS` and a private checksum helper — **none is a glyph, kit,
  hex, or NODE_ATOMS mutation**; `components.test.js` pins are untouched. Any decorative mark the More UI
  wants (copy/paste affordance) is **inline `aria-hidden` SVG**, never a 14th glyph.
- **ZERO new hex in app surfaces** — the More additions are `var(--token)` only, annotated with the
  `/* §2.1 --token on ground, X.XX:1 */` convention. Docs artifacts carry their own self-contained plain
  palette (like scholar-pack.html's `#111111`/`#ffffff`) but still **zero gated literals**.
- **Relative paths, no leading slash, classic `<script>`s, no `Math.random`/`Date.now` in app behaviour.**
  The travel-code checksum is deterministic (no entropy, no clock — `Math.imul`-based FNV-1a). The sound
  generator takes **no runtime clock** (its provenance date is a passed-in constant, default `'2026-07-16'`).
- **Mercy voice, no jargon.** In the UI the words *export / import / token / base64* NEVER appear — it is
  **"a travel code."** Wrongness is a strike never a colour; keep = default on every destructive/replacing
  flow; native controls, 44px, real labels-in-name, `AW.announce`, focus management.
- **Engine JS is CACHE-FIRST in `sw.js`.** The S8 engine change therefore **requires the cache bump
  `awba-cache-v3` → `awba-cache-v4`** (the only trigger for the activate-time purge + fresh pickup). No
  precache *additions* — docs/ artifacts are deliberately excluded (scholar-pack precedent). More is
  network-first (its edit needs no bump on its own, but the engine change forces v4 regardless).
- **Never `git add -A`;** atomic commits in repo voice, each body ending
  `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`; never push. `ugrep` needs `--` before
  leading-dash patterns; celebration-class greps stay class-scoped (`class="…\b(dab|thread|plate|rosette)\b`)
  to dodge the `One religion, one thread` false positive.
- **Test command is always** `node --test scripts/tests/*.test.js` (glob form). Chrome-spawning gates run
  serial/isolated, `contrast-audit` LAST and alone. v2.2 adds **no new Chrome gate** and **no new
  page/codepoint** to render-smoke/contrast/rtl/glyph discovery (More is already discovered; docs are
  excluded). The 19 content files stay SHA-frozen; `validate-content` keeps its 3 accepted notes;
  `port-audit` + the DAILY/EPIGRAPH pins stay green (S8 reads no content).

---

# E1 · PROGRESS EXPORT/IMPORT — "take your light with you"

**The problem, plainly.** Awba promises *nothing is ever lost* — un-loseable noor, an unbreakable streak.
But every gram of that light lives in **one browser's `localStorage`**. Lose the phone, switch devices, or
let the browser evict storage, and the promise breaks silently. There are no accounts (out of scope,
permanently) — so the honest fix is a **travel code**: the learner carries their own light across, by hand,
on-device, with no server, no sign-in, nothing sent anywhere.

**The poetry (the one memorable note).** It is not a "backup." It is *the same person's light arriving.*
The ring travels with its owner — the maker's mark (`ringSeed`) rides inside the code, so the fingerprint
that inks on the new device is the **same hand**, not a stranger's. Copy reads: *take it with you* /
*bring it here* / *your light has arrived.*

## E1.1 · Seam S8 — the travel-code grammar (engine JS, inside the `AW.S` closure)

A single-line, copy-pasteable string. Three dot-separated segments (base64 never contains `.`, base36
never contains `.`, the fixed tag never contains `.` — so `raw.split('.')` yields exactly 3 parts, always):

```
AWBA1.<base64>.<checksum>
  │      │         └─ base36 FNV-1a hash of <base64> (accidental-corruption detector, NOT crypto)
  │      └─────────── btoa(JSON.stringify(blob))  — blob = PROGRESS ONLY (never prefs)
  └────────────────── the fixed version tag "AWBA1" (bumps only if the token grammar itself changes)
```

- **`blob` = progress state ONLY**, an explicit whitelist so prefs/name can never ride along:
  `{ schemaVersion, noor, returns, lastDay, days, stars, chests }` **+ `ringSeed`** when present. (Never
  `soundMuted`/`motion`/`prayerTimes`/`skyMode`/`displayName`/`onboardingDone` — those live in the separate
  `awba_prefs` blob and stay put; a travel code moves *the path*, not *the device settings*.)
- **base64 = `btoa` / `atob`** (file://-safe, universal in target browsers). The blob is **ASCII by
  construction** (schemaVersion/noor/returns/ringSeed are numbers, lastDay/days are `YYYY-MM-DD`, star &
  chest keys are ASCII ids, values `1|2|3`/`true`) — so plain `btoa` never throws on export. On import,
  `atob` is wrapped in try/catch → a malformed payload refuses politely, never throws to the console.
- **checksum = deterministic FNV-1a/32 over the base64 payload string, rendered base36** (~6–7 chars). No
  entropy, no clock — `Math.imul` keeps the multiply 32-bit-exact (the naive `h*prime` overflows 2^53 and
  silently corrupts; `Math.imul` is the required primitive and is not a clock/entropy source):
  ```js
  function tokenSum(str) {                 // AW.S-private; corruption detection only, NOT security
    var h = 0x811c9dc5;                    // FNV offset basis
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;  // FNV prime, held to 32-bit unsigned
    }
    return h.toString(36);
  }
  ```
  One flipped character anywhere in the base64 changes both the decoded blob **and** the recomputed sum →
  refused. One flipped character in the checksum → sum mismatch → refused. (This is not tamper-*proofing*;
  it catches the real-world failure — a truncated/mangled paste — which is the whole job.)

## E1.2 · `AW.S.exportToken()` — exact contract

Added to the object `AW.S` returns (so it shares `mem`/`defaultState`/`persist`/`memFallback` directly):

```js
exportToken: function () {
  if (!mem) mem = load();                                  // same lazy contract as get/set/reset
  var blob = {                                             // explicit whitelist — prefs can NEVER leak
    schemaVersion: mem.schemaVersion,                      // === CURRENT for a normal blob
    noor:    (typeof mem.noor    === 'number') ? mem.noor    : 0,
    returns: (typeof mem.returns === 'number') ? mem.returns : 0,
    lastDay: (mem.lastDay != null) ? mem.lastDay : null,
    days:    Array.isArray(mem.days) ? mem.days : [],
    stars:   (mem.stars  && typeof mem.stars  === 'object') ? mem.stars  : {},
    chests:  (mem.chests && typeof mem.chests === 'object') ? mem.chests : {}
  };
  if (mem.ringSeed != null) blob.ringSeed = mem.ringSeed;  // the ring travels with its owner (law 10)
  var b64 = btoa(JSON.stringify(blob));
  return 'AWBA1.' + b64 + '.' + tokenSum(b64);
}
```
- **Read-only** — allowed even under `memFallback` (exporting the real on-disk future-schema blob verbatim
  is honest; a newer build could import it). No persist, no mutation.
- The blob is serialized immediately, so no live `mem` reference escapes.

## E1.3 · `AW.S.importToken(raw)` — exact contract

Returns **`{ ok:true, preview:{noor, returns, lessonsDone, dropped}, apply:fn }`** on success, or
**`{ ok:false, why:<gentle single line> }`** on any failure. The validation pipeline, in order:

```js
importToken: function (raw) {
  if (!mem) mem = load();

  // (0) isFallback refusal — the session is working from an un-persisted copy of a newer-schema blob;
  //     applying could not be saved AND must not clobber the protected blob → refuse politely.
  if (memFallback) return { ok:false,
    why: "This copy of Awba can't take in a code right now. Reopen the app and try again." };

  // (1) shape / prefix — empty & garbage paste land here
  if (typeof raw !== 'string') return NOT_A_CODE;
  var s = raw.trim();
  if (!s) return { ok:false, why: 'Paste a travel code to bring your path here.' };
  var parts = s.split('.');
  if (parts.length !== 3 || parts[0] !== 'AWBA1')
    return { ok:false, why: "That doesn't look like an Awba travel code." };
  var payload = parts[1], sum = parts[2];

  // (2) integrity — corruption / truncated paste
  if (tokenSum(payload) !== sum)
    return { ok:false, why: 'This code looks incomplete. Copy the whole code and try again.' };

  // (3) base64 → JSON
  var json; try { json = atob(payload); } catch (e) {
    return { ok:false, why: 'This code looks incomplete. Copy the whole code and try again.' }; }
  var blob; try { blob = JSON.parse(json); } catch (e) {
    return { ok:false, why: 'This code looks incomplete. Copy the whole code and try again.' }; }
  if (!blob || typeof blob !== 'object' || Array.isArray(blob))
    return { ok:false, why: "That doesn't look like an Awba travel code." };

  // (4) schemaVersion — a FUTURE version is refused (mirrors the fallback law: never import a shape this
  //     build can't be trusted to understand). A missing/non-numeric version is untrustworthy → refuse.
  var sv = blob.schemaVersion;
  if (typeof sv !== 'number' || isNaN(sv))
    return { ok:false, why: "That doesn't look like an Awba travel code." };
  if (sv > CURRENT)
    return { ok:false, why: 'This code is from a newer version of Awba. Update Awba, then bring it in.' };

  // (5) shape + types → build a CLEAN blob (defensive whitelist; drop everything unrecognised, count it)
  var dropped = 0;
  var clean = defaultState();                 // schemaVersion CURRENT + zeroed fields
  clean.schemaVersion = sv;                   // keep source sv; runMigrations() lifts it at apply()
  clean.noor    = (typeof blob.noor    === 'number' && isFinite(blob.noor)    && blob.noor    >= 0) ? Math.floor(blob.noor)    : 0;
  clean.returns = (typeof blob.returns === 'number' && isFinite(blob.returns) && blob.returns >= 0) ? Math.floor(blob.returns) : 0;
  clean.lastDay = (typeof blob.lastDay === 'string' && YMD.test(blob.lastDay)) ? blob.lastDay : null;
  clean.days    = Array.isArray(blob.days)
    ? blob.days.filter(function (d) { return typeof d === 'string' && YMD.test(d); }).slice(-90) : [];

  clean.stars = {};
  if (blob.stars && typeof blob.stars === 'object' && !Array.isArray(blob.stars)) {
    for (var id in blob.stars) { if (!own(blob.stars, id)) continue;
      if (isKnownStarId(id)) {                                  // lesson OR review id
        var v = Math.round(blob.stars[id]);
        if (isFinite(v)) clean.stars[id] = Math.min(3, Math.max(1, v));  // clamp to 1..3
        else dropped++;
      } else dropped++;                                          // unknown id — drop, count
    }
  }
  clean.chests = {};
  if (blob.chests && typeof blob.chests === 'object' && !Array.isArray(blob.chests)) {
    for (var cid in blob.chests) { if (!own(blob.chests, cid)) continue;
      if (isKnownChestId(cid) && blob.chests[cid] === true) clean.chests[cid] = true;
      else dropped++;
    }
  }
  if (typeof blob.ringSeed === 'number' && isFinite(blob.ringSeed)) clean.ringSeed = blob.ringSeed >>> 0;

  // preview — lessonsDone counts ONLY the 15 lesson ids (NODE_ATOMS keys), never reviews/chests
  var lessonsDone = 0;
  for (var lid in clean.stars) if (own(clean.stars, lid) && NODE_ATOMS.hasOwnProperty(lid)) lessonsDone++;

  return {
    ok: true,
    preview: { noor: clean.noor, returns: clean.returns, lessonsDone: lessonsDone, dropped: dropped },
    apply: function () {
      var applied = runMigrations(clean);      // no-op at v1 (schemaVersion===CURRENT); future-proof
      mem = applied;                           // REPLACE the local blob (never a merge) — see §E1.4
      if (!memFallback) persist(mem);          // reuse the existing persist seam → NO new storage literal
      return true;
    }
  };
}
```

Supporting module-private members (co-located with the id registry / inside `AW.S`):
- `var YMD = /^\d{4}-\d{2}-\d{2}$/;` and `function own(o,k){ return Object.prototype.hasOwnProperty.call(o,k); }`.
- **The id registries** (added at file level **right after `NODE_ATOMS` (~line 496)**, the natural home,
  reachable by the `AW.S` closures at call-time exactly as `AW.atomsDone` already resolves `NODE_ATOMS`):
  ```js
  var REVIEW_IDS = ['u1r', 'u2r', 'u3r', 'u4r'];   // the 4 legendary-review star keys (course-structure.js)
  var CHEST_IDS  = ['u1c', 'u2c', 'u3c', 'u4c'];   // the 4 unit chest keys
  function isKnownStarId(id)  { return NODE_ATOMS.hasOwnProperty(id) || REVIEW_IDS.indexOf(id) !== -1; }
  function isKnownChestId(id) { return CHEST_IDS.indexOf(id) !== -1; }
  ```

### E1.3.1 — id-registry ruling (a deliberate, load-bearing correction of the brief's shorthand)
The brief says *"ids checked against `NODE_ATOMS` keys."* Taken literally that would **drop every review
star (`u1r`..`u4r`) and every chest** on import — and the mandated round-trip test (§E1.9, *export→import→
state equal incl. ringSeed*) would then **fail** for any learner who has finished a review or opened a
chest, because `stars` is a **shared lessons+reviews namespace** (verified against `course-structure.js`
and the review files: review star keys are `u1r`..`u4r`, chest keys `u1c`..`u4c`; `NODE_ATOMS` holds the
**15 lesson ids only**). The faithful design therefore validates `stars` against **lessons ∪ reviews** and
`chests` against the **chest ids**, via the two tiny lists above. They mirror the existing `NODE_ATOMS`
hardcode (the engine already enumerates the course's lesson ids inline) and touch **no frozen count**.
*Fast-follow (logged, not built):* fold `REVIEW_IDS`/`CHEST_IDS` into a shared node-id registry derived
from `course-structure.js` so the engine has a single id source — deferred to keep S8 a pure additive seam.

## E1.4 · MORE vs LESS progress — the REPLACE ruling (never a silent merge)

**Ruling: a valid code REPLACES the local blob, wholesale — never merges — behind a calm preview + a
one-step keep/replace confirm (keep = primary, replace = quiet ghost).** Why:
1. **Merging invents a third state neither device ever had.** Whose `noor` wins — the max, the sum? Union
   the stars but keep the higher of two ratings per id? Every answer fabricates a ledger the learner never
   earned on either device. REPLACE is the only honest, explainable operation.
2. **It matches the poetry and the law.** It is *the same person's light arriving*; the local copy steps
   aside for the copy that travelled. `ringSeed` rides in the code, so the **same** maker's mark re-inks —
   the local seed is replaced *deliberately* (law 10 holds: one hand, not two).
3. **Loss is guarded by consent, not by cleverness.** The preview states exactly what the code carries; the
   confirm defaults to **keep**; Escape cancels. A learner with a *more*-complete local copy sees the smaller
   incoming numbers in the preview and simply keeps. This is the Start-over mercy pattern (D.4) applied to a
   replacement: never a silent surprise.

## E1.5 · More-page UI (§D grammar) — the new row + the one sheet

### E1.5.1 — new row, in the existing **§ Your device** section (between install and Start over)
```
install row … → [Move to a new device] → Start over row
```
```html
<button class="mr-row sheet-row" type="button" id="rowMove">
  <span class="mr-rowtext">
    <span class="mr-label">Move to a new device</span>
    <span class="mr-sub">Carry your light — your noor, returns and finished lessons — to another phone.</span>
  </span>
  <!-- CHEV (the existing inline aria-hidden chevron; no new glyph) -->
</button>
```
Wire `rowMove` → `openMoveSheet()`.

### E1.5.2 — the ONE sheet (shipped `AW.sheet`, cream; label `Move to a new device`), two calm halves
Built from the existing `.mr-sheet` / `.mr-sheet-h` / `.mr-sheet-p` / `.btn` / `.btn.ghost` vocabulary plus
one new composition class `.mr-code-field` (§E1.6). A thin `.mr-rule` hairline separates the halves.

```
┌───────────────────────────────────────────────┐
│ ▬▬  (grip)                                     │
│ Take it with you                     (h)       │
│ This code holds your whole path. Open Awba on  │
│ your new device, come back here, and paste it  │
│ under “Bring it here.”                (p)      │
│ [ AWBA1.………………………………  ] (readonly, 1-line)     │
│ [ Copy the code ]                    (.btn)    │
│ ───────────────────────────────────  (rule)   │
│ Bring it here                        (h)       │
│ Paste a code from your other device to carry   │
│ its path onto this one.               (p)      │
│ [ paste here…                    ] (1-line)    │
│ [ Check the code ]                   (.btn)    │
│ (reason line appears here on an invalid check) │
└───────────────────────────────────────────────┘
```

**Take it with you (final copy):**
- heading (`.mr-sheet-h`): `Take it with you`
- line (`.mr-sheet-p`): `This code holds your whole path. Open Awba on your new device, come back here, and paste it under “Bring it here.”`
- field: `<input class="mr-code-field" id="moveCode" type="text" readonly aria-label="Your travel code" spellcheck="false" autocomplete="off">` — value = `AW.S.exportToken()`
- button (`.btn`): `Copy the code` (`id="moveCopy"`)
- copy behaviour:
  ```js
  function copyCode() {
    var f = document.getElementById('moveCode');
    var done = function () { AW.announce('Copied.'); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(f.value).then(done, selectFallback);
    } else { selectFallback(); }
    function selectFallback() {
      f.focus(); f.select();
      try { if (document.execCommand && document.execCommand('copy')) { done(); return; } } catch (e) {}
      AW.announce('Select the code, then copy it.');    // leaves it selected — never a dead end
    }
  }
  ```

**Bring it here (final copy):**
- heading: `Bring it here`
- line: `Paste a code from your other device to carry its path onto this one.`
- field: `<input class="mr-code-field" id="moveIn" type="text" aria-label="Paste your travel code" spellcheck="false" autocomplete="off">`
- button (`.btn`): `Check the code` (`id="moveCheck"`)
- reason slot: `<p class="mr-sub" id="moveWhy" role="alert" hidden></p>` (shows `res.why` verbatim, single line, never technical)
- check behaviour:
  ```js
  function checkCode() {
    var res = AW.S.importToken(document.getElementById('moveIn').value);
    var why = document.getElementById('moveWhy');
    if (!res.ok) { why.textContent = res.why; why.hidden = false; AW.announce(res.why); return; }
    why.hidden = true;
    moveConfirm(res);                                   // valid → the keep/replace confirm (below)
  }
  ```

### E1.5.3 — the keep/replace confirm (Start-over pattern; keep = primary, replace = quiet ghost)
On a valid check, replace the sheet content (same singleton, `AW.sheet(html, 'Bring this path here?')`):
- heading (`.mr-sheet-h`): `Bring this path here?`
- preview line (`.mr-sheet-p`): `This code carries {noor} noor, {returns} returns, {n} lessons finished.`
  (singulars: `1 noor` / `1 return` / `1 lesson finished`; `0 lessons finished` is fine)
- replace warning (`.mr-sheet-p`): `It will replace what's on this device — the light here steps aside for the light that's arriving. This can't be undone.`
- *(only if `preview.dropped > 0`, a quiet Courier `.mr-sub`)*: `A few unrecognised marks were left out.`
- buttons: `.btn` `Keep what's here` (primary, `id="moveKeep"` → `AW.sheet.close()`) · `.btn.ghost`
  `Bring it in` (`id="moveApply"`)
- `Bring it in`:
  ```js
  function applyMove(res) {
    res.apply();                                        // REPLACE via the persist seam
    AW.announce('Your light has arrived.');
    render();                                           // re-render More (idempotent; keeps state coherent)
    AW.sheet(doneHtml, 'Your light has arrived.');      // the arrival confirmation (below)
  }
  ```
- arrival confirmation:
  - heading: `Your light has arrived.`
  - line: `Your path is now here, exactly as it was. Welcome back.`
  - button (`.btn`): `Back to the path` (`id="moveBack"` → `window.location.href = 'learn.html'`)
- **focus:** on entering the confirm, move focus to its heading (`tabindex="-1"` + `.focus()`), so the
  preview is announced by the SR before the keep/replace choice; `Keep what's here` is **first in source**
  so Tab reaches the safe action first; Escape closes (= keep).

### E1.5.4 — version footer bump
`more.html`'s `.mr-about` colophon: `Awba · version 2.1` → **`Awba · version 2.2`** (the `A companion, not
a cop.` and `Every citation is pending scholarly review.` lines stay).

## E1.6 · More-page CSS (one `@layer screens` addition — composition only, zero new hex/token)
```css
@layer screens {
  .mr-code-field {
    width: 100%;
    padding: var(--sp-2s) var(--sp-3);
    border: 1px solid var(--rule);
    border-radius: var(--r-2);
    background: var(--cream);
    color: var(--ink);                 /* §2.1 --kiswah on cream, 16.22:1 */
    font: var(--fs-ui) var(--font-marg);  /* a code reads as marginalia — the sanctioned mono */
    white-space: nowrap;
    overflow-x: auto;                  /* the long readonly token scrolls in place, never wraps the sheet */
  }
  .mr-code-field:read-only { color: var(--ink-85); }   /* §2.1 strong body ink on cream */
  .mr-rule { height: 1px; background: var(--rule); margin: var(--sp-2s) 0; border: 0; }
}
```
No new token, no new hex, no new glyph. The crimson `:focus-visible` ring on the fields/buttons rides in
automatically from the engine grammar (cream Page ground).

## E1.7 · A11y contract (the v2 bar)
- The sheet is the shipped `AW.sheet` — focus trap + `Escape` + cream, one `role="dialog" aria-modal="true"`.
- Both fields carry a real accessible name (`aria-label` — the visible heading is the section title, so an
  explicit label is cleared, not decorative). Readonly token field is reachable + selectable for the copy
  fallback. `Copy the code` / `Check the code` are native `<button>`s with visible text labels
  (label-in-name holds). `moveWhy` is `role="alert"` so an invalid reason is announced without stealing
  focus. On copy → `AW.announce('Copied.')`; on apply → `AW.announce('Your light has arrived.')`.
- Confirm: `Keep what's here` (primary) is first in source order; focus lands on the confirm heading; Escape
  = keep. All controls 44px; crimson `:focus-visible` (auto on Page).

## E1.8 · Motion
Sheet = shipped `AW.sheet` settle (`--dur-sheet`). Content-replace (check → confirm → arrival) rides the
same singleton (no bespoke transition). No ambient loop, no celebration primitive. Reduced-motion settles
instantly via the engine `@layer motion` collapse — no page override.

## E1.9 · Edge states
- **`AW.S.isFallback()` true** → *Take it with you* still yields a valid code (read-only, honest); *Bring it
  here* refuses with the calm §E1.3(0) reason.
- **Empty / garbage paste** → the §E1.3(1) reasons, never technical, never a console throw.
- **Future schema** → refuse with the "update Awba" line.
- **Storage entirely off** → export produces a code from the in-memory default; apply() updates `mem` but
  `persist` no-ops (progress not saved) — the arrival confirmation still shows. Acceptable rare edge,
  consistent with the app's existing storage-off degradation; no storage API is touched to detect it.
- **Clipboard API absent (old browser / some file:// contexts)** → the `execCommand` select-fallback; if
  that also fails the field is left selected + a calm announce (never a silent no-op).

## E1.10 · Component manifest
| Element | Source |
|---|---|
| `AW.sheet` / `.mr-sheet*` / `.btn` / `.btn.ghost` / `.sheet-row` press / `CHEV` / `AW.announce` / crimson focus | **shipped** |
| `AW.S.exportToken()` / `AW.S.importToken(raw)` + `REVIEW_IDS`/`CHEST_IDS`/`tokenSum`/`YMD`/`own` | **new — seam S8 (engine JS, additive; reuses `persist`/`defaultState`/`runMigrations`)** |
| `.mr-code-field` / `.mr-rule` + the Move sheet markup/wiring + footer bump | **new page-CSS/JS (`@layer screens` + inline classic script; zero new hex/token/glyph)** |

## E1.11 · Tests (§E1(c))
**REQUIRED — one new `node --test` file `scripts/tests/state-token.test.js`** (Map-backed `ls-stub`,
zero-dep, headless, real engine — the `state-reset.test.js` shape):
- **Round-trip:** seed a rich blob (noor/returns/lastDay/days/`stars` incl. a **review id `u1r`** and a
  chest `u1c`/**ringSeed**); `t = AW.S.exportToken()`; a **fresh** engine load in a fresh stub;
  `AW.S.importToken(t).apply()`; assert `AW.state()` deep-equals the original **including `ringSeed`** (via
  `AW.ringSeed()`) and including the review star + chest.
- **No-prefs-leak:** assert the exported blob JSON has no `soundMuted`/`motion`/`displayName`/`prayerTimes`
  key (decode the middle segment and check keys).
- **Tamper:** flip one char of the base64 payload → `importToken` returns `{ok:false}`; flip one char of
  the checksum → `{ok:false}`.
- **Future-schema refusal:** hand-craft a token whose blob has `schemaVersion: 999` (recompute a valid
  checksum for it) → `{ok:false}` with the "newer version" `why`.
- **Unknown-id dropping + count:** blob with `stars:{ u1m1:3, bogus:2, "':evil":3 }` → clean keeps `u1m1`,
  `preview.dropped >= 2`, `apply()` leaves no `bogus`/`':evil` in `stars`.
- **Clamps:** `stars:{ u1m1:0, u1m2:9, u1m3:2 }` → after import `u1m1===1`, `u1m2===3`, `u1m3===2`.
- **isFallback refusal:** load with an on-disk `schemaVersion:2` blob (trips `memFallback`);
  `AW.S.importToken(validToken)` → `{ok:false}`.
- **Empty/garbage:** `importToken('')` / `importToken('hello')` / `importToken('AWBA1.zzz')` → `{ok:false}`
  with a non-empty `why`, no throw.
- **Storage-word count guard:** re-assert the engine's `localStorage` literal count is **exactly 13** after
  S8 (a string-scan on the engine source, as `state-reset.test.js` does).

**OPTIONAL — a More-page DOM flow test: SKIP, justified.** The entire logic lives in the S8 seam and is
fully covered headlessly above; the More UI is thin wiring (native `<button>`/`<input>` + `AW.sheet` +
`AW.announce`) already swept by the standing gates — `render-smoke` (More renders with no console error),
`a11y-keyboard` (native controls + zero positive tabindex on more.html), and the gated-literal sweep.
Adding a Chrome DOM-flow test would spawn a fourth serial Chrome process for coverage the seam test + the
existing sweeps already provide. (If a smoke is later wanted, extend `learn-dom-flows`'s harness to
more.html rather than a new Chrome gate.)

## E1.12 · Acceptance checklist + exact deltas
- [ ] `AW.S.exportToken()` returns `AWBA1.<b64>.<sum>`; blob is progress-only (**no prefs**); `ringSeed`
      included when present; read-only (no persist).
- [ ] `AW.S.importToken(raw)` validates prefix → checksum → base64 → JSON → schemaVersion (**future =
      refuse**) → shape/types; clamps stars **1..3**; drops unknown ids and **reports the count**; refuses
      under `isFallback`; returns gentle `why` on empty/garbage; `apply()` **REPLACES** via `persist`
      (never merges) and carries `ringSeed`.
- [ ] Engine `localStorage` literal count **stays exactly 13** (S8 reuses `persist`/`defaultState`/
      `runMigrations`); `AW.GLYPHS` 13 / `AW.KIT` 20 / `NODE_ATOMS` Σ61 unchanged; `REVIEW_IDS`/`CHEST_IDS`
      added beside `NODE_ATOMS`, on no frozen pin.
- [ ] More: new **Move to a new device** row in *Your device*; one two-half sheet; the words
      *export/import/token/base64* never appear (it is "a travel code"); keep/replace confirm (keep =
      primary, Escape = keep); copy uses `navigator.clipboard` + `execCommand` fallback + `Copied.`
      announce; `Your light has arrived.` announce + re-render on apply; **footer `Awba · version 2.2`**.
- [ ] More page direct storage-word count **stays 0**; new CSS in one `@layer screens` block, zero new
      hex/token/glyph; crimson focus rings auto; 44px; label-in-name.
- [ ] New test `scripts/tests/state-token.test.js` covers round-trip (incl. `ringSeed` + a review star),
      tamper, future-schema, unknown-id drop + count, clamps, isFallback refusal, no-prefs-leak, empty/garbage.

**Exact deltas (E1):**
1. `shared/awba-engine.js` — **seam S8**: add `exportToken`/`importToken` to the `AW.S` return object;
   add `REVIEW_IDS`/`CHEST_IDS`/`isKnownStarId`/`isKnownChestId` after `NODE_ATOMS`; add the private
   `tokenSum`/`YMD`/`own` helpers. **No new `localStorage` literal.** *(CACHE-FIRST → forces the sw.js bump.)*
2. `more.html` — the Move row + sheet + wiring + `.mr-code-field`/`.mr-rule` CSS + footer `2.1`→`2.2`.
3. `sw.js` — **`var CACHE = 'awba-cache-v3'` → `'awba-cache-v4'`** (engine bytes changed under cache-first).
   **No PRECACHE additions** (docs artifacts excluded; more.html/engine already listed). Bump the entry-count
   comment only if it enumerates a count (it says 53 — unchanged).
4. `scripts/tests/state-token.test.js` — new (added to the `node --test` glob automatically).
5. README/gate-board — add `state-token.test.js` to the suite note (no new *command*; the glob covers it).

---

# E2 · OWNER LAUNCH KIT — `docs/launch-kit.html`

**Nature (the scholar-pack precedent, restated):** one **self-contained** HTML file — **system fonts, own
plain palette, no engine CSS/JS `<link>`, print-friendly (`@media print`), NOT precached in `sw.js`, NOT in
any gate's page discovery**, **zero gated literals**. Dated **2026-07-16**. It is the owner's single
pre-launch page: an on-phone checklist that remembers itself, the DNS cutover, the licensing/scholar
truth, and the open-decisions ledger. It is authored by hand (or by a tiny `scripts/build-launch-kit.js` if
the owner prefers regeneration — optional; the page is static content, so a hand-written file is the
simplest lawful shape, exactly like a hand-authored doc).

## E2.1 · The interactive device-walk checklist (the carried-forward human-walk ledger)
Usable on a phone. Each item is a **labelled `<input type="checkbox" id=…>` + `<label for=…>`** with a
one-line **"what good looks like."** A live `N of M steps done` line + a `Reset checklist` button. State
persists via **THIS PAGE'S OWN single `localStorage` key** — with the mandated explicit comment:

```html
<script>
  /* launch-kit.html is a DOCS ARTIFACT, deliberately outside the app's storage laws: it is never
     precached and never in any gate's page discovery, so this single localStorage key is legitimate
     here and does NOT count against the app's storage-word gate (which covers app surfaces only).
     Key is namespaced to avoid ever colliding with awba_state / awba_prefs. */
  var LK_KEY = 'awba_launchkit_v1';
  /* load → check the boxes; on change → save the id→bool map; Reset → clear the key. Try/catch-guarded
     so a storage-off browser still lets the owner walk (state just won't persist). */
</script>
```

**The items (final labels + "what good looks like"):**
| # | Label (checkbox) | What good looks like |
|---|---|---|
| 1 | Install to the home screen | The Add-to-Home-Screen prompt/menu works; Awba opens full-screen from its own icon, no browser chrome. |
| 2 | Offline airplane-mode walk | Turn on airplane mode, reopen Awba from the home screen, walk a lesson end to end — every screen, font and icon loads; nothing 404s. |
| 3 | Keyboard-only lesson walk | Tab / Enter / Space / Escape move through a whole lesson — reach every option, Check, Continue and the sheets — with no mouse and a visible focus ring on each stop. |
| 4 | Screen-reader (VoiceOver) pass | Turn on VoiceOver and walk a lesson: headings read in order; each verdict speaks ("Correct." / "Not quite — nothing lost. Look again."); noor and returns are announced; the travel-code "Copied." and "Your light has arrived." announce; the name-saved announce fires. |
| 5 | 320px typography glance | At 320px width nothing overflows sideways; Marcellus headlines clamp to their floor; Arabic keeps its line-height and never collides. |
| 6 | Icon-scale glance | Scene icons and glyphs stay crisp and centred at their rendered sizes — no clipping, no blur, no stray keyline. |
| 7 | Reduced-motion toggle | More → Reduce motion On: animations settle instantly across Awba; the Ring never redraws; turning it off restores motion; the device's own Reduce-Motion setting is honoured on its own. |
| 8 | Practice tap-walk | Practice opens, a set runs, a wrong answer is a grey blot + "Nothing lost." with Try again, the calm completion reads — and no noor/stars are awarded. |
| 9 | Profile tap-walk | The Ring renders (static), stats read true, the week never shows a gap or red, adding/editing/removing a name works and stays on-device. |
| 10 | More tap-walk | Every row works: sound toggle, reduce-motion switch, the explainer sheets, install help, and Start over's calm two-step (keep is always the default). |
| 11 | Onboarding tap-walk | Both Begin and Skip land on the path (`learn.html`); the back button never loops back into onboarding. |
| 12 | Move-to-a-new-device round-trip | On device A: More → Move to a new device → Copy the code. On device B: paste under "Bring it here" → Check → Bring it in → "Your light has arrived." — the path arrives intact (noor, returns, finished lessons, the same ring). |

## E2.2 · The `awba.app` DNS cutover
> **Do this only after the site is live at `theshumba.github.io/awba-gen4/` and you're ready to switch the
> custom domain.** Adding the `CNAME` file before DNS resolves triggers GitHub's "domain not properly
> configured" error.

**1 — At the `awba.app` DNS host, add four `A` records for the apex (`@`):**
```
@   A   185.199.108.153
@   A   185.199.108.109
@   A   185.199.108.110
@   A   185.199.108.111
```
**2 — Add the `www` subdomain as a `CNAME`:**
```
www CNAME theshumba.github.io
```
**3 — Tell GitHub Pages the domain (one command, from the repo root):**
```sh
printf 'awba.app\n' > CNAME && git add CNAME && git commit -m "Point Pages at awba.app" && git push
```
(Then in the repo: Settings → Pages → Custom domain = `awba.app`, and tick **Enforce HTTPS** once the
certificate provisions — it can take a few minutes to an hour.)
**4 — Propagation check:**
```sh
dig +short awba.app            # → the four 185.199.108.x addresses above
dig +short www.awba.app        # → theshumba.github.io (then the same four IPs)
curl -sI https://awba.app/     # → HTTP/2 200, and a valid TLS cert (no warning)
```
> The relative-path law means the exact same commit serves correctly at the Pages subpath **and** at the
> `awba.app` root — no code change accompanies the cutover. `start_url`/`scope` stay relative.

## E2.3 · Licensing & the scholar gate
**Clear Quran translation licensing — UNRESOLVED (owner action; not a build blocker, never silently
cleared).** Awba shows the Clear Quran (Dr. Mustafa Khattab) *translation of the meaning* **verbatim**, with
the fixed source line and an `unverified · pending review` pill on every citation. The launch-text source
was drawn against the **quran.com / quranapi.pages.dev API**, whose public translation endpoints have signalled
**withdrawal/deprecation for third-party redistribution** — so relying on that API as a live source is not
safe for a commercial launch, and redistributing the Clear Quran text itself likely needs a **publisher
licence from the rights holder**. *Before commercial launch:* confirm a licence (or an explicitly permitted
source) for the Clear Quran text, and stop depending on the withdrawn API. The app is already self-contained
(text is embedded verbatim, not fetched), so this is a rights question, not a technical one.

**Scholar sign-off — the pack and what it unlocks.** `docs/scholar-pack.html` is the printable, verbatim,
fully-sourced review document (every verse + hadith + the engine du'a, each marked *pending review*). When a
scholar signs it off:
- Removing the `unverified · pending review` pills is a **FUTURE code change**, listed as such — it is *not*
  done in v2.2. Today the pill is a **blanket, global** posture (every citation, unconditionally). A signed
  pack would motivate either a global "reviewed" flip or a finer per-citation verified state; either way it
  is an engine/CSS change to `AW.sheetRef` + the pill markup, gated behind the actual sign-off. Until then,
  **no surface may imply scripture has been cleared.**

**R-6 Arabic chapter-terms — the slot the scholar fills.** The 4 unit "chapter-term" labels (the Aref Ruqaa
squares) currently render an **English fallback** pending owner-supplied Arabic. Ask the scholar/owner to
supply, per unit, exactly this shape (paste-ready), and it drops into the term registry:
```
Unit 1  ·  Arabic term: «………» (fully vowelled / tashkeel)  ·  transliteration: «………»  ·  English gloss: «………»
Unit 2  ·  …
Unit 3  ·  …
Unit 4  ·  …
```
Do **not** invent these Arabic terms; the square stays on its English fallback until the vowelled Arabic
arrives. (Same law for the R-7 Ibrahim 14:24 epigraph — a Courier fallback line, never paraphrased.)

## E2.4 · Open product-decisions ledger (v2.2 does NOT resolve these — recorded for the owner)
| Decision | Status / recommendation |
|---|---|
| **Practice noor** | Practice awards **none** (read-only). *Recommend keep none* — matches the review circle-back precedent, can't distort the shipped economy, un-farmable. |
| **R-8 visible review timer** | Whether the 14s review timer shows a visible readout is an owner-ledger item — **unresolved**; don't redesign the review timer without deciding this. |
| **Reviews in the practice pool** | The pool is **lessons-only** in v2. Adding review items needs item-shape normalisation (review `items[]` differ from lesson `mc/tf/tile`) — **deferred fast-follow**. |
| **Sound** | The app ships **silent** (D-52). The owner picks a family from `docs/sound-audition.html` **or rejects all**; wiring the chosen cues is a later step. Sound **effects**, not music. |
| *Also open* | 61-vs-65 denominator (show **61**; a change is a one-line `structure.atoms` engine edit); compound reward-clause CTAs kept as calm Courier sub-lines, not shouty labels; default du'a undecided (never invent). |

## E2.5 · Acceptance checklist (E2)
- [ ] `docs/launch-kit.html` is self-contained (system fonts, own palette, no engine `<link>`),
      print-friendly, **not** in `sw.js` PRECACHE, **not** in any gate's page discovery, **zero gated
      literals**, dated **2026-07-16**.
- [ ] The 12-item device-walk checklist persists via one namespaced `localStorage` key **with the explicit
      docs-artifact comment**; `N of M` + Reset work; storage-off degrades gracefully.
- [ ] DNS section carries the exact **four A records** + the **`www` CNAME** + the **one `printf … > CNAME`**
      command + the **`dig`/`curl` propagation checks**, gated on "only after ready."
- [ ] Licensing section is honest: Clear Quran licence unresolved + the quran.com-API-withdrawal signal;
      scholar-pack link + pill-removal named as a **future** code change; the R-6 Arabic-terms slot shape.
- [ ] Open-decisions ledger lists practice-noor, R-8 timer, reviews-in-pool, sound (+ the "also open" set).

**Exact deltas (E2):** add `docs/launch-kit.html` (new file). **No** `sw.js`, engine, gate, or app-surface
change. (Optional: `scripts/build-launch-kit.js` if regeneration is wanted — dev tool, not a build step.)

---

# E3 · SOUND AUDITION KIT — candidates only (the app stays silent)

**Nature.** `scripts/build-sound-candidates.js` synthesizes short, dignified candidate cues as **`.wav`**
files into `docs/sound-audition/`, plus a self-contained `docs/sound-audition.html` to hear them. **Nothing
is wired** — D-52 stays owner-gated; the app is silent until the owner picks a family (or rejects all).
Both the generator and the page are **zero-dependency**, use **no runtime clock** (`Date.now`/`Math.random`
forbidden — pure deterministic sample math; the provenance date is a passed-in constant, default
`'2026-07-16'`), and emit **zero gated literals**. The `.wav` files and the HTML are docs artifacts — **not
precached, not in gate discovery.**

## E3.1 · `scripts/build-sound-candidates.js` — the generator
- **Zero deps** (Node core `fs`/`path` only). Writes **16-bit PCM, mono, 44.1 kHz** WAV files by pure sample
  math — sine/triangle partials under a **fast exponential decay** envelope. **NEVER melodies, NEVER
  chimes-as-music** — each cue is a **single dignified sound event**, not a tune.
- **Three families × three cues = 9 files**, written as `docs/sound-audition/<family>-<cue>.wav`:
  `wood-correct.wav`, `wood-incorrect.wav`, `wood-complete.wav`, `string-correct.wav`, `string-incorrect.wav`,
  `string-complete.wav`, `thump-correct.wav`, `thump-incorrect.wav`, `thump-complete.wav`.
- **Timing / character laws (per cue, across families):**
  - `correct` — **≤180 ms**, a single soft mid note, gentle.
  - `incorrect` — **≤140 ms**, and **quieter + lower** than that family's correct, **never harsh** — a soft
    downward acknowledgement, not a buzzer (law 8: *a soft acknowledgement*).
  - `complete` — **≤350 ms**, a touch fuller (the correct note with one low partial + a slightly longer
    decay tail), still a single dignified event — **never a rising jingle/fanfare.**
- **Loudness — normalized LOW:** compute float samples in `[-1, 1]`, then scale so the **peak ≤ -12 dBFS**
  (a peak magnitude of ≈ `0.251`; the int16 peak ≈ `8225`). `incorrect` is quieter still (peak ≈ `-16 dBFS`,
  ≈ `0.16`). No clipping, ever.
- **Deterministic:** fixed partial sets, frequencies and decay constants — same input, byte-identical WAV.
  No entropy, no clock (a `--date=YYYY-MM-DD` CLI arg or a hardcoded constant supplies the stamp shown in
  the HTML; never `new Date()`).
- **Suggested per-family recipes (a starting point for the builder, not scripture):**
  | Family | Timbre | correct | incorrect | complete |
  |---|---|---|---|---|
  | **wood** | soft wood tap (muted, woody) | ~260 Hz sine + faint 2× partial, τ≈45 ms | ~180 Hz, τ≈35 ms, ×0.6 gain | ~260 Hz + a ~130 Hz low partial, τ≈90 ms |
  | **string** | muted string pluck (single note) | ~220 Hz + integer partials (½, ¼ amp), τ≈70 ms | ~165 Hz, fewer partials, τ≈45 ms, ×0.6 | ~220 Hz + soft low octave, τ≈120 ms |
  | **thump** | low warm thump (felt, not heard) | ~120 Hz sine with a fast downward pitch glide, τ≈50 ms | ~90 Hz, τ≈35 ms, ×0.6 | ~120 Hz + a hair more body, τ≈110 ms |
- **WAV writing (spec):** a 44-byte canonical RIFF/`WAVE` header (`fmt ` chunk: PCM=1, channels=1,
  sampleRate=44100, bitsPerSample=16, derived byteRate/blockAlign) followed by little-endian int16 samples
  (`Buffer.writeInt16LE`), each float clamped to `[-1,1]` then `Math.round(f * 32767)`. A tiny (~2–3 ms)
  linear fade-in and fade-out on every cue removes click/pop at the edges.
- **Run:** `node scripts/build-sound-candidates.js` → writes the 9 `.wav`s (and, optionally, refreshes the
  audition HTML).

## E3.2 · `docs/sound-audition.html` — the audition page (self-contained)
- Play buttons **per cue** (a `<button>` calling `new Audio('<family>-<cue>.wav').play()` on click — the
  WAVs are same-folder relative; a small inline classic script; no autoplay, tap to hear).
- **Family descriptions** (final copy): *Wood — a soft wooden tap: dry, close, unhurried.* / *String — a
  single muted pluck: warm, human, one note only.* / *Thump — a low warm body: felt more than heard, the
  quietest of the three.*
- **A recommendation line** (honest, a suggestion not a verdict): *"If one must be chosen: **Wood** — its
  correct is the calmest, its incorrect the least like a buzzer, and its complete stays a single soft note
  rather than a flourish. But all three are candidates; rejecting every one is a valid answer."*
- **The honest "nothing is wired" note** (final copy): *"Awba is silent today, on purpose. Nothing here is
  connected to the app. These are candidates only — pick a family, or reject them all. If a family is
  chosen, its three cues would later be converted and placed at `shared/sfx/correct.mp3`,
  `shared/sfx/incorrect.mp3` and `shared/sfx/complete.mp3` — the exact slots `AW.sound(cue)` already
  resolves — and only then would sound reach a learner."* (Note in passing: `AW.sound` also has a `streak`
  slot; it can reuse the chosen `complete`, or gain a softer variant later — out of scope for this audition.)
- Self-contained: system fonts, own plain palette, no engine `<link>`, **zero gated literals**, dated
  `2026-07-16` (the passed-in constant).

## E3.3 · Acceptance checklist (E3)
- [ ] `scripts/build-sound-candidates.js` is zero-dep, uses **no runtime clock / no `Math.random`**, and
      writes **9** WAVs (3 families × correct/incorrect/complete) as 16-bit PCM mono 44.1 kHz.
- [ ] `correct ≤180 ms`, `incorrect ≤140 ms` **and quieter + lower**, `complete ≤350 ms`; **no melodies /
      no chimes-as-music**; peak **≤ -12 dBFS** (incorrect quieter); tiny fades kill clicks; deterministic.
- [ ] `docs/sound-audition.html` is self-contained, plays each cue, carries family descriptions, the
      recommendation line, and the honest **nothing-is-wired** note pointing at `shared/sfx/{cue}.mp3`;
      dated 2026-07-16; **zero gated literals**.
- [ ] Neither the WAVs nor the HTML are added to `sw.js` PRECACHE or any gate's page discovery; the app
      stays silent (no `AW.sound` change, no `shared/sfx/` file wired).

**Exact deltas (E3):** add `scripts/build-sound-candidates.js` (dev tool), `docs/sound-audition/*.wav` (9
files, generated), `docs/sound-audition.html` (new). **No** `sw.js`, engine, gate, or app-surface change.

---

## Consolidated deltas (all three deliverables)
| Area | Change | Cache / gate consequence |
|---|---|---|
| `shared/awba-engine.js` | **Seam S8** — `AW.S.exportToken`/`importToken` + `REVIEW_IDS`/`CHEST_IDS` + `tokenSum`/`YMD`/`own` (additive; reuses `persist`/`defaultState`/`runMigrations`; **no new `localStorage` literal**) | **CACHE-FIRST → `sw.js` `awba-cache-v3` → `awba-cache-v4`** |
| `more.html` | Move row + two-half sheet + wiring + `.mr-code-field`/`.mr-rule` CSS + footer `2.1`→`2.2` | network-first (covered by the v4 bump anyway); storage-word count stays 0 |
| `sw.js` | **CACHE bump only** — `awba-cache-v3` → `awba-cache-v4` | **No PRECACHE additions** (docs artifacts excluded) |
| `scripts/tests/state-token.test.js` | New engine unit test (round-trip, tamper, future-schema, unknown-id drop+count, clamps, isFallback, no-prefs-leak, empty/garbage, 13-literal guard) | joins the `node --test scripts/tests/*.test.js` glob automatically; add to README's suite note |
| `docs/launch-kit.html` | New self-contained owner doc | **not** precached, **not** gate-discovered, own `localStorage` key (documented) |
| `scripts/build-sound-candidates.js` + `docs/sound-audition/*.wav` (9) + `docs/sound-audition.html` | New dev tool + candidate WAVs + audition page | **not** precached, **not** gate-discovered; app stays silent |

**Invariant ledger (UNCHANGED by v2.2):** engine `localStorage` literal = **13**; every page direct
storage-word count = **0**; `AW.GLYPHS` = **13**; `AW.KIT` = **20**; `NODE_ATOMS` Σ = **61**; the
`@layer …` order line appears exactly once; 19 content files + DAILY/EPIGRAPH SHA pins untouched;
`validate-content` keeps its 3 accepted notes. Chrome gates run serial/isolated, `contrast-audit` last +
alone; **no new Chrome gate, no new precached page**. Only the `sw.js` cache version moves (v3 → v4).

*End DESIGN-V2.2.md. Every authored string above is final copy for builders to paste. No scripture is
invented; the pending-review posture is unchanged; all app-surface colour is `var(--token)` (zero new hex);
the travel code carries progress only (never prefs) and the ring travels with its owner.*
