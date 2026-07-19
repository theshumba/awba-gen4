# Improvement Batch v2.4 — 2026-07-19

Owner directive: build all five improvements (item 6 = owner-external, skipped), product calls
delegated, every call logged reopenable in the commit messages, adversarial multi-lens verify
before done, deploy waits for the owner's word. Built inline on top of the unpushed 2026-07-18
commits (review fixes + swiftness pass); never rebased. Five atomic commits `fb8fd6e..4b03419`
+ this record.

## What landed

1. **Life after the Ring — the memory loop** (`60cb9c4`). `AW.practiceMemory`
   (key/dayStamp/order/mark): practice sets surface the questions resting longest —
   never-practised first, then oldest last-seen (local-day granularity), ties held in the
   shipped mulberry32(ringSeed^day^round) shuffle via an explicit tie-break. Marked at set
   COMPLETION through the one `seen` map in awba_state (AW.S only). practiceRun stays
   byte-write-free. Hub copy: "the ones resting longest come first."
2. **Keep your light — travel-code offer** (`4b03419`). The first completed review's result
   screen gains a quiet line + ghost "Keep a travel code" → cream sheet with the code
   (exportToken seam), copy affordance, one honest install lean, pointer to More. Offered ONCE
   (AW.prefs `keepOffered`, stamped at row render); skipped when standalone or un-codeable.
3. **Lesson resume** (`acb3a60`). `AW._resumeKeeper` — every beat render keeps
   {p, si, correct, combo, comboBest, mistakes, noorEarned} in a transient `resume` map;
   the opener offers "Carry on where you were" / "Start from the beginning" when a meaningful
   place exists (step ≥ 1). Cleared at the verdict; never exported/imported; reset drops it.
   Scoring/mechanics untouched — the tally rides whole.
4. **Two feel upgrades** (`2e89016`). (a) 8ms navigator.vibrate tick riding AW.sound('correct')
   only — feature-detected, below the mute gate (soundMuted = master quiet), incorrect gets
   NOTHING. (b) Review timer drain moved to transform scaleX (transform-origin:left, width
   stays 100%) — compositor-only; QTIME 14 / 100ms tick / <28% low / 10s announce byte-pinned.
5. **Multi-tab safety** (`fb8fd6e`). `window 'storage'` listeners inside AW.S + AW.prefs drop
   the in-memory copy on a sibling tab's write (or full clear) — next access lazy-reloads via
   load(). memFallback re-derived; runner tallies untouched; claims merge onto fresh state.
   Zero new storage-API literals (both 13-count gates hold).

## Reopenable product calls (also in the commit messages)

- LRU over graded intervals (SM-2 rejected — over-machinery for a 32-item pool); mark on
  completion, not start; `seen`/`resume` are device-local (never in the travel code).
- Reviews are NOT resumable (the soft timer is that room's point). Step-0 places never offered.
- Chest milestone carries no keep-offer hook (a chest only unlocks after its unit's review, so
  the review is always the first milestone). Offer stamps at render — walking past = dismissal.
- Standalone (installed) profiles never see the keep-offer (their store is not evicted).
- 8ms tick length; scaleX slightly squashes the bar's rounded ends (imperceptible at bar size).
- Page footers stay "2.3" — version stamping is an owner surface, not bumped by this batch.

## Verify panel (3 adversarial lenses, ~350k tokens, all read-only)

- **Regression/behaviour:** no Critical/Warning. Frozen timer mechanics byte-identical; default
  opener byte-equivalent; practiceRun write-free; determinism probed over 199 seeds (empty seen
  map ⇒ byte-identical to the old sampler); result screen focus/announce contract intact.
- **State-integrity (probe-proven):** no new data-loss path. The storage listener narrows every
  pre-existing last-write-wins race from session-wide to ~one event-loop turn; memFallback
  re-trips BEFORE any persist; export whitelist + import clean-blob hold under crafted tokens.
- **Laws/gates/skew:** zero new hex (tokens only); no new fonts/glyphs; law 9 holds (nothing
  new animates uninvited); copy is calm UI-only, no religious content; content files untouched
  (--stat proven); page storage-literal count 0; engine literal count 13; sw.js untouched —
  the batch rides the pending unpushed awba-cache-v6 (origin still serves v5; one push ships
  all); no new page → no precache/gate-list additions needed.

## Known-and-accepted (new entries for the standing ledger)

- **importToken.apply() no-reload edge (PRE-EXISTING, low):** apply() persists without
  re-loading, so a sibling newer-build write in the seconds between paste-validate and tap can
  be clobbered by the user's explicit wholesale replace. Not introduced or worsened by v2.4;
  if ever hardened, apply() re-checking load()/fallback before persist is the seam.
- **keepOffered stamps at render:** on a small phone the row can sit below the fold; a learner
  who leaves instantly consumes the one-ever offer sightlessly. Deliberate ("walking past is
  dismissal"); the feature stays permanently under More → Move to a new device.
- **practice.html hub sub-line** promises the memory loop one navigation before a stale cached
  engine delivers it (network-first HTML vs cache-first engine) — copy-only, self-heals.
- **Same-millisecond dual-tab writes** (two tabs, simultaneous writes, event not yet delivered)
  can still last-write-wins a shared-map entry; self-heals on the next beat save. Platform
  floor — localStorage has no transactions.
- **Resumed tally vs a re-cut lesson** could show >100% accuracy once (cosmetic, needs a
  content re-cut mid-resume; SG-01 family).

## Board after the batch

Suite **254/254/0** (was 204 — 50 new tests across state-multitab 8, sound-haptics 6,
runner-review +3, state-resume 12, practice-memory 11, keep-offer 9, and the ls-stub `extras`
param additively). validate-content exit 0 + self-test OK · port-audit BYTES/HOLD/EPIGRAPH/
DAILY OK · practice-pool-audit 32 OK · pwa-audit OK (54 precache, awba-cache-v6) ·
render-smoke OK · rtl-audit OK · contrast-audit 25 pages / 0 fail (3268 + 2567 pairings,
318 forced states).

**NOT pushed.** Deploy = owner's word; one push ships the 2026-07-18 fixes + swiftness pass +
this batch together under the single v6 cache bump.
