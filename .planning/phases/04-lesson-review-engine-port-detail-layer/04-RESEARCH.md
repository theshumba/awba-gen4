# Phase 4: Lesson & Review Engine Port + Detail Layer — Research

**Researched:** 2026-07-13
**Domain:** Porting a monolithic vanilla-JS lesson/review engine (Josh's Gen-3 machine) onto shipped Athar primitives; WAAPI reward choreography; verbatim content port under a validator gate. Zero-build, zero-dependency static site.
**Confidence:** HIGH — every mechanic below was read from source (`_MVP-BUILD/shared/awba-engine.js`, all 19 data files, the in-repo engine, the validator, the Athar contract) and the port gate was executed live against Josh's real 19 files (exit 0).

## Summary

This phase is a **port, not a design exercise**. The machine already exists and is fully specified: Josh's Gen-3 `awba-engine.js` (465 lines) contains `AwbaLesson(cfg)` + `AwbaReview(cfg)` with exact, readable mechanics (noor math, star math, 14s timer state-machine, combo/streak, praise pools, beat renderers, the four-moment reward flow). The target primitives also already exist and are gate-approved: the in-repo `shared/awba-engine.js` (1359 lines) ships STATE + KIT + COMPONENTS + RING + SKY with `AW.icon/cite/wire/sheet/sheetRef/sheetTerm/animate/ringSVG/ringSeed/reducedMotion/skyTemp` and the register CSS. **The RUNNERS banner section and the `@layer screens` CSS block are empty placeholders awaiting exactly this phase.** The job is to re-implement Gen-3's two runners inside gen-4, preserving every number byte-for-byte, expressed through the Athar registers per the D-45 translation table — nothing celebratory retired-Gen-3 (no confetti/PERFECT overlay/combo chip/companion mascot/amber).

The single highest-value finding: **the port gate is real and it already passes.** Running `node scripts/validate-content.js` against Josh's actual 15 lessons + 4 reviews returns **exit 0** with only 3 non-blocking `note:` warnings (unused refs/term) that are EXPECTED and must NOT be "fixed" (they are consistent with the scholar holds, D-49). The 19 files are contract-clean today; the port's content risk is not validity but **byte-fidelity of scripture** during copy and **not reintroducing the Google Fonts CDN** (all 19 Gen-3 files carry a `<link href="fonts.googleapis.com">` that violates the zero-CDN law).

**Primary recommendation:** Splice each data file's `AwbaLesson({...})` / `AwbaReview({...})` cfg call byte-identical into a fresh Athar-correct page shell (strip the CDN link, keep the identical `../shared/` relative paths), then re-author the two runners in the RUNNERS section consuming ONLY shipped `AW.*` primitives + new `@layer screens` classes. Gate every wave with `node scripts/validate-content.js` (exit 0) + `node --test scripts/tests/*.test.js` (64/64 held) + a headless-Chrome no-console-error load of representative pages. Reward choreography = chained `AW.animate(...).finished` awaits, ending on `AW.ringSVG({animateFrom: preLessonAtoms})`.

## Architectural Responsibility Map

Single-tier static browser app (no server/API/DB — device-local `localStorage` only). "Tiers" here are the engine's internal layers.

| Capability | Primary layer | Secondary | Rationale |
|------------|---------------|-----------|-----------|
| Lesson beat rendering (9 types) | RUNNERS `AwbaLesson` | COMPONENTS (`AW.icon/cite/wire`), `@layer screens` CSS | Renderers build DOM strings; primitives supply chips/icons/sheets |
| Quiz resolution + noor/star/combo math | RUNNERS (pure-ish counters) | STATE (`AW.S.set` persistence) | Math lives in the runner closure exactly as Gen-3; only persistence crosses to STATE |
| Review timer state-machine (14s → skip → circle-back) | RUNNERS `AwbaReview` | — | Self-contained `setInterval` loop; no primitive owns timing |
| Citation/term sheets | COMPONENTS `AW.sheetRef/sheetTerm` (shipped) | `AW.wire` | Already built + gate-approved; runners just call `AW.wire(root,cfg)` |
| Reward choreography (verdict→noor→returns→done→Ring) | RUNNERS (WAAPI via `AW.animate`) | RING (`AW.ringSVG`), SKY (du'a close) | Sequencing is runner logic; the Ring draw + du'a are the payoff primitives |
| Progress persistence (noor/stars/days/returns) | STATE `AW.S`/`AW.touchDay` (shipped) | — | ONLY `AW.S` may touch `localStorage` (D-24 grep gate) |
| Sound cues (silent v1) | RUNNERS `AW.sound(cue)` (new, to build) | prefs (`awba_prefs.soundMuted`) | New thin no-op layer; assets are an owner decision |
| Time-of-day tint / du'a warmth | SKY (shipped `AW.skyTemp`/`applySky`) | — | Already wired for home; lessons render on Page (cream), reward-close may borrow Sky |

## User Constraints (from CONTEXT.md)

### Locked Decisions

**D-45 — The binding Gen-3 → Athar translation table (mechanics identical, expression re-voiced).** This is the authoritative reading of every Gen-3 term still present in REQUIREMENTS (ENG-03/05, RWD-01/02/03, MOT-05):

| Gen-3 term (in REQUIREMENTS) | Preserved mechanic | Athar expression (locked) |
|---|---|---|
| combo chip at 2+ | 2+ streak accrual, same thresholds | accruing gold-dot chip (`.dab` gold at small scale), pops via `stamp`/`settle`, never mid-scripture |
| PERFECT at 3-streak / flawless | same trigger + noor numbers | quiet gold-thread flourish + praise copy on the quiz META surface (Page register); no full-screen overlay, no indigo |
| confetti | celebration at lesson/review completion | `.dab` drift (Circle `drift` verb) + Ring frontier draw; Festival `stamp` reserved for circuit thresholds |
| amber-never-red misses | wrongness never red, never punitive | Athar law 8: grey ink-blot fade + one-line explanation; Rose Ember frames ONLY the retry; amber retired |
| orange returns hero | returns prominence + week calendar never-miss grammar | warm hero via Sky's `--apricot` horizon warmth on cream; calendar days at lighter ink presence, never gaps/red |
| companion presence (lantern bob/glow) | a felt closing presence per session | RETIRED as mascot (aniconism). Presence = the Ring drawing your new frontier (`animateFrom`=pre-lesson count) + the Sky du'a close: one du'a in Amiri + "Alhamdulillah — continue." Lantern only as inert scene icon where content references it |
| gold legendary theme | review = elevated, rarer register | reviews open Orbit-dark + Hajar Gold accents: "the circle gathers" (dab-drift in), gold thread progress instead of lamp-path; gold rosette seal on mastery |
| stars 3/2/1 | identical star math, never 0 | shape-first gold dabs/rosettes (hollow/half/filled grammar consistent with `data-state`) |
| 3-Lens amber/blue/green | fixed order, opt-in accordion, never blocks Continue | Reality→Madder Wash · Revelation→Mihrab Crimson · Ruling→Za'atar Olive; each lens shape+label cued (never colour-only); scripture inside Revelation follows scripture law |

- **D-46:** `AwbaLesson`/`AwbaReview` accept Josh's cfg shape byte-unchanged; `scripts/validate-content.js` is the port gate (all 19 real files, exit 0 required). Beat renderers live in the engine's RUNNERS section, consuming ONLY shipped Phase-3 primitives. No new CSS tokens; no layer-order change; `@layer screens` content blocks only.
- **D-47:** Lessons render in the **Page register** (`.reg-page` cream): verse beats = scripture law; quiz beats = ink-bordered paper-press cards; per-beat progress = thermal `data-state` shapes. Reviews render Orbit-dark + gold. All numbers (+12/+15, 14s, +15/+5 swift, 2★ timeout cap, no back button) byte-preserved.
- **D-48:** Nightfall interstitial is NOT auto-triggered in Phase 4 (component ships from Phase 3, wiring deferred — no heuristic may pick "the weightiest ayah").
- **D-49:** All 19 files copied byte-verbatim from `_MVP-BUILD/`, validated + scripture byte-identity recorded in SUMMARY. Sensitive holds verified by explicit grep/diff (U4-03 absent, U3-13 not surfaced, U3-16 principle-only, group-namings held). NEVER regenerate or "fix" content — Josh's omissions ARE the holds.
- **D-50:** Arabic laws at render time: every Arabic span `lang="ar" dir="rtl"`; ayah→Amiri Quran; hadith/du'a→general Amiri; ﷺ + honorifics + ˹ ˺ brackets intact (˹ ˺ falls through to Inter fallback).
- **D-51:** Post-lesson sequence keeps Josh's four moments — verdict → noor claim → returns → done — as WAAPI-chained choreography (`AW.animate`); ends with the **Ring moment** `AW.ringSVG({animateFrom: preLessonAtoms})` then the du'a close. Celebration NEVER on/adjacent to a scripture beat (grep-gated).
- **D-52:** Sound (MOT-05): build full plumbing now — `AW.sound(cue)` slots correct/incorrect/complete/streak, visible mute toggle wired to `awba_prefs.soundMuted`, cues from `shared/sfx/` page-relative — ship v1 SILENT (missing file = clean no-op, zero console errors). Assets are an owner decision.

### Claude's Discretion
Beat renderer markup structure; WAAPI stagger timings within ≤300ms/token law; praise-copy pool wording (non-scripture); exact returns-hero composition within Sky-warmth ruling; review intro/result composition within Circle/gold ruling — all within locked registers + the 03-UI-SPEC-ATHAR component directives.

### Deferred Ideas (OUT OF SCOPE)
- Nightfall auto-triggering (D-48) — needs content/scholar judgement or data markers.
- Seed-rows + 15 plant stamps (Ink micro-progress) — lesson-index surface = Phase 5.
- Festival circuit plates + crowd-arrival — circuit-completion threshold = Phase 5 wiring.
- Gold-thread seeded jitter (owner taste follow-up) — revisit only if asked.
- Per-citation verified state — scholar-gate workflow.

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ENG-01 | `AwbaLesson(cfg)` accepts Gen-3 shape unchanged; all 9 beat types + refs/terms + markers + opener/recap/grew/next; verified by rendering all 15 real lessons | Beat contract read from `ENGINE-CONTRACT.md` + validator + live files; beat-frequency + renderer map below |
| ENG-02 | `AwbaReview(cfg)` accepts Gen-3 review shape; items MC/TF with explanation `t`, mastery, next; verified against 4 real reviews | Review runner (lines 339–464 Gen-3) fully read; item shapes inventoried |
| ENG-03 | Quiz mechanics exact: +12/correct, +15 reflect, combo at 2+, PERFECT at 3-streak, stars 3/2/1 (never 0), amber-never-red, varied praise, good/gentle | Exact Gen-3 `resolve()`/`starsFor()`/`firePerfect()` extracted below; D-45 re-voices expression |
| ENG-04 | Review mechanics exact: 14s soft timer, +15/+5 swift, timeout→auto-skip→untimed circle-back, any timeout caps 2★, lamp/gold progress, no back button | Exact timer state-machine (`startTimer/timeUp/advance/circleBackOffer`) extracted below |
| ENG-05 | 3-Lens depth = individually-expanding accordion (fixed order), opt-in, never blocks Continue | Gen-3 `depth` renderer + D-45 colour re-map (Madder/Crimson/Olive) |
| CNT-01 | 15 lessons + 4 reviews ported verbatim (NOT regenerated); scripture byte-identical | Port gate ran clean (exit 0); byte-splice + SHA recipe below |
| CNT-02 | Sensitive holds present: U4-03 absent, U3-13 not surfaced, U3-16 principle-only, group-namings held; diff/grep pass recorded | File inventory confirms only u4-m1/m2/m2b/m3 (no m4/U4-03 lesson); 3 unused-ref warnings are hold-consistent |
| CNT-04 | Every Arabic span `lang="ar" dir="rtl"`; ayah→Quran face; ﷺ after name; honorifics/brackets intact | `AW.sheetRef` already tags `.ayah`+lang/dir; verse/scard renderer must do same; 100 ˹˺ brackets present, 0 ﷺ in these 19 files |
| RWD-01 | verdict→noor→returns→done choreographed: staggered reveals, noor count-up, presence-as-sequence | `AW.animate().finished` chain pattern below; Gen-3 four-function flow preserved |
| RWD-02 | Returns screen: warm hero, big count, week calendar with no "miss" state | `AW.weekCal()` shipped (renders days, on/off dots); re-voice orange→apricot |
| RWD-03 | Combo/PERFECT/confetti "preserved and elevated" → re-voiced per D-45 (dab drift + thread + Ring, never over scripture); reward footer separation preserved | D-45 row-by-row; grep gate for celebration-not-adjacent-scripture |
| MOT-05 | Correct/incorrect/complete/streak sound cues, calm identity, visible mute; peaks on meta not scripture | `AW.sound(cue)` silent-no-op plumbing (D-52); prefs slot exists |

## Standard Stack

**No external packages. Zero-build, zero-dependency static site (hard constraint, CLAUDE.md).** Nothing is installed; the "stack" is the shipped in-repo primitives this phase consumes and the Node/browser platform APIs.

### Platform APIs used
| API | Where | Why |
|-----|-------|-----|
| Web Animations API (`element.animate()` + `.finished`) | reward choreography | Promise-sequenced verdict→noor→returns→done→Ring without setTimeout guesswork; runs on compositor `[CITED: CLAUDE.md STACK]` |
| CSS `@layer screens` | all new lesson/review/reward screen CSS | The reserved, empty layer this phase fills; order immutable `[VERIFIED: shared/awba-engine.css:16,923]` |
| `data-state` thermal attr | per-beat progress dots, stars | shape-first state (hollow/half/filled+check) `[VERIFIED: 03-UI-SPEC-ATHAR §3.3]` |
| `localStorage` via `AW.S` only | noor/stars/days/returns persistence | D-24 — only `AW.S` touches storage `[VERIFIED: awba-engine.js:23-25]` |
| `setInterval` | review 14s decisecond timer | Gen-3 `startTimer` uses 100ms tick; preserve exactly `[VERIFIED: _MVP-BUILD engine:364-370]` |

### Shipped primitives to consume (the real "core stack")
| Primitive | Signature | Purpose |
|-----------|-----------|---------|
| `AW.animate` | `(el, keyframes, durToken, easeToken) → Animation` | THE WAAPI exemplar to copy; reads ms+easing off `:root`, self-guards `dur=1` under reduced motion, returns awaitable `[VERIFIED: awba-engine.js:1090]` |
| `AW.ringSVG` | `({seed?, atomsDone, circuitsDone?, animateFrom?, size?}) → svg string` | The lesson-complete Ring moment; `animateFrom`=pre-lesson atoms draws ONLY the new frontier, never replays `[VERIFIED: awba-engine.js:1145-1169]` |
| `AW.ringSeed` | `() → int` | lazy per-learner seed (maker's mark); no schema bump `[VERIFIED: awba-engine.js:1114]` |
| `AW.icon` | `(name, {label?,size?}) → svg string` | 20 KIT scenes + 13 glyphs; decorative by default, `label` adds aria `[VERIFIED: awba-engine.js:925]` |
| `AW.cite` | `(id, label) → span` | citation chip; byte-shape frozen (validator depends) `[VERIFIED: awba-engine.js:942]` |
| `AW.wire` | `(root, cfg) → void` | binds `.cite[data-ref]`→`sheetRef`, `.term[data-term]`→`sheetTerm` on a rendered root `[VERIFIED: awba-engine.js:957]` |
| `AW.sheet` / `sheetRef` / `sheetTerm` | singleton bottom-sheet + citation/term faces | already gate-approved (ENG-06 done); face-split Amiri-Quran/Amiri, pending pill, olive grade pill `[VERIFIED: awba-engine.js:996-1082]` |
| `AW.reducedMotion` | `() → bool` | the one self-guard (OS matchMedia OR `data-motion=reduce`) `[VERIFIED: awba-engine.js:977]` |
| `AW.S` / `AW.state` / `AW.touchDay` / `AW.greetMode` / `AW.weekCal` | state layer (Phase 2) | noor/returns/stars/days/lastDay; `touchDay` increments returns once/day; `weekCal` renders Mon-first 7-day dots `[VERIFIED: awba-engine.js:362-435]` |
| `AW.prefs` | versioned prefs blob | `soundMuted`, motion override, prayerTimes/skyMode `[VERIFIED: awba-engine.js:284]` |

### KIT scene names available (20) — MAP Gen-3 icon calls to these
`mosque, carpet, lantern, lanterns, crescent, hijab, man, family, prostration, standing, quran-stand, beads, kaaba, dua, dates, compass, ewer, night, pattern, calendar` `[VERIFIED: node introspection]`

**Gen-3 → gen-4 icon rename map (renderers hardcode these — Gen-3 names differ):**
| Gen-3 call (in renderers) | Gen-4 KIT name | Used by |
|---|---|---|
| `AW.ill('quran','mini')` | `quran-stand` | verse beat |
| `AW.ill('beads','mini')` | `beads` (same) | depth beat |
| `AW.ill('dua','mini')` | `dua` (same) | reflect beat |
| `AW.ill('starpat','sm')` | `pattern` | rewardNoor screen |
| `AW.ill('crescent')` | `crescent` (same) | done screen |
| `AW.UNIT_ICON[u1..u4]` | `compass/lanterns/kaaba/mosque` | opener (unchanged, JS `AW.UNIT_ICON` survives) |

> **Note:** Gen-3 has an `AW.ill(name,cls)` helper; gen-4 does NOT — use `AW.icon(name)` and wrap in a `.ill` container in `@layer screens` if the illustration frame is wanted. Glyphs `AW.FLAME/SPARK/CHECK/HEART/BOLT/TARGET/CLOCK/STARG/STARE/LP` (Gen-3) map to `AW.icon('flame'|'spark'|'check'|...)` in gen-4 GLYPHS (`flame,spark,check,star,cite,lamp,lock,chest,trophy` + markers). There is no `HEART`/`BOLT`/`TARGET`/`CLOCK`/`STARG`/`STARE` glyph in gen-4 — the reward-stat and wrong-answer icons must be re-chosen from the shipped set (e.g., miss uses law-8 grey blot not a heart; stats use `spark`/`star`).

## Package Legitimacy Audit

**N/A — this phase installs zero external packages** (zero-build, zero-dependency static site per CLAUDE.md hard constraint; no `package.json`, no `node_modules` — verified absent). All code is authored in-repo and consumes only in-repo primitives + Node core (`node:fs/path/vm`) for dev tooling. No slopcheck/registry verification applies.

## Architecture Patterns

### System Architecture Diagram — lesson runtime data flow

```
  lesson HTML page (lessons/uX-mY.html)
    │  <link rel=stylesheet ../shared/awba-engine.css>   (self-hosted fonts, zero CDN)
    │  <script src="../shared/awba-engine.js">           (classic, parse-time; defines AW + AwbaLesson)
    │  <script> AwbaLesson({ id, journey, opener, beats[], refs{}, terms{}, recap, grew, next }) </script>
    ▼
  AwbaLesson(cfg)  [RUNNERS section]
    │
    ├─ build skeleton DOM (.reg-page cream ground; HUD marginalia; segbar/progress dots; #root; foot)
    │
    ├─ opener  ── AW.greetMode() → first/streak/returning greeting; Begin → AW.touchDay()
    │
    ├─ render(pos) ── switch(beat.t):
    │      read/frame/verse/panel/depth/reflect  → content beat → AW.wire(root,cfg) → Continue
    │      mc/tf/tile                            → quiz beat → Check → resolve(ok)
    │                                                              │
    │            resolve(ok):  ok→ correct++,combo++,noor+=12, combo≥2 dab-chip, combo===3 gold-thread flourish
    │                          miss→ mistakes++,combo=0, LAW-8 grey ink-blot + one-line why + rose retry frame
    │            (reflect: first tap reveals model +15 noor, second advances)
    │
    ▼ (pos >= beats.length)
  REWARD CHOREOGRAPHY  (WAAPI chain: await AW.animate(...).finished between moments)
    verdict  → stars(starsFor: 0mist=3★,1=2★,≥2=1★) + 3 stat reveals (settle, staggered)
    noor     → count-up in Marcellus numerals; AW.S.set('noor', +noorEarned)   ← persists here
    returns  → apricot-warm hero + big returns count + AW.weekCal() (never a miss state)
    done     → recap list + grew + next handoff;  AW.S stars best-of (never downgrade)
    RING     → AW.ringSVG({animateFrom: preLessonAtoms}) draws ONLY the new frontier
    du'a     → Sky close: one du'a (Amiri) + "Alhamdulillah — continue."     (D-51)

  ── celebration NEVER renders on/adjacent to a verse/scripture beat (grep-gated, D-51) ──
```

### Recommended file structure (this phase adds)
```
lessons/                    # 15 ported pages (byte-spliced cfg, CDN link stripped)
  u1-m1.html … u4-m3.html
reviews/                    # 4 ported pages
  u1-review.html … u4-review.html
shared/
  awba-engine.js            # RUNNERS section filled: AwbaLesson, AwbaReview, AW.sound
  awba-engine.css           # @layer screens filled: skeleton + beat + reward + review classes
  sfx/                      # created empty (or with silent placeholders); page-relative cues (D-52)
```

### Pattern 1: WAAPI reward sequencing (copy AW.animate, chain `.finished`)
**What:** Each reward "moment" is an `await`ed animation; the sequence is a plain async function.
**When:** the four-moment reward flow + the Ring draw.
```javascript
// Source: AW.animate exemplar [VERIFIED: shared/awba-engine.js:1090]; pattern per D-51 + CLAUDE.md STACK
async function reward() {
  // verdict — stagger star + stat reveals with the Page "settle" verb
  for (const el of statEls) {
    AW.animate(el, [{opacity:0, transform:'translateY(8px)'}, {opacity:1, transform:'none'}],
               '--dur-settle', '--ease');
    await new Promise(r => setTimeout(r, 60));         // stagger only; each anim self-guards reduced-motion
  }
  await AW.animate(noorEl, [...], '--dur-settle', '--ease').finished;  // noor count-up moment
  AW.S.set('noor', AW.S.get('noor',0) + noorEarned);   // persist at the noor moment (Gen-3 parity)
  // … returns, done …
  root.querySelector('.ring').innerHTML =
      AW.ringSVG({ atomsDone: preLessonAtoms + earnedAtoms, animateFrom: preLessonAtoms });
}
```
- `AW.animate` reads `--dur-settle`/`--ease` off `:root` and collapses to 1ms under reduced motion — never hand-roll duration parsing.
- The Ring draws ONLY `[animateFrom, atomsDone)`; passing `animateFrom = preLessonAtoms` is the whole point (WR-01). A plain reload with unchanged progress replays nothing.

### Pattern 2: Beat renderer → primitive consumption
**What:** each of the 9 renderers emits a DOM string using `@layer screens` classes, then calls `AW.wire(root, cfg)` so any inline `.cite`/`.term` becomes tappable.
```javascript
// verse beat — scripture law (CNT-04, D-47): Amiri Quran face, lang/dir, clean ground, nothing celebratory adjacent
'<div class="scard reg-page" style="--go:0">' +           // --go:0 = no grain behind scripture (law 3)
  '<div class="slabel">'+ it.label +'</div>' +
  '<div class="ayah" lang="ar" dir="rtl">'+ it.ar +'</div>' +
  '<div class="trans">'+ it.tr +'</div>' +
  '<div class="tsrc">Translation of the meaning: The Clear Quran, Dr. Mustafa Khattab · pending review</div>' +
'</div>'
```
**Anti-pattern:** rendering ayah text through `AW.cite`/general Amiri, or adding a dab/thread/stamp in the same panel as a `.ayah`/`.scripture` (violates law 3 + D-51 grep gate).

### Pattern 3: Reduced-motion & the "centre never animates"
Every JS animation goes through `AW.animate` (auto-guarded). CSS ambients already gate off. The Ring's `animateFrom` frontier is the only celebration draw at lesson-end; it must render its final inked state statically under reduced motion (already handled by `AW.ringSVG`).

### Anti-Patterns to Avoid
- **Re-introducing a retired element** (confetti / PERFECT overlay / combo chip / companion mascot / amber / gummy press / unit accent colour). `AW.confetti` was DELETED; do not re-add it. `AW.LANTERN/LANTERNG` art recolour is gone.
- **Re-declaring the `@layer` order line** — write only content blocks into `@layer screens` (line 923).
- **Touching `localStorage` outside `AW.S`** — grep-gated (D-24).
- **Retyping scripture** — splice byte-identical (law: splice, never retype).
- **New CSS tokens / layer-order changes** (D-46) — consume existing tokens only.

## Don't Hand-Roll

| Problem | Don't build | Use instead | Why |
|---------|-------------|-------------|-----|
| Duration/easing parsing for WAAPI | manual `getComputedStyle` + parseFloat | `AW.animate(el, kf, '--dur-*', '--ease')` | already reads `:root`, self-guards reduced motion, returns awaitable `[VERIFIED:1090]` |
| Citation/term bottom sheets | new sheet DOM | `AW.wire` + `AW.sheetRef/sheetTerm` | ENG-06 shipped + gate-approved; face-split + pending/grade pills done |
| Macro progress ring | any progress bar | `AW.ringSVG({animateFrom})` | deterministic tawaf fingerprint, no-replay, reduced-motion static `[VERIFIED:1145]` |
| Week calendar | new calendar HTML | `AW.weekCal()` | Mon-first 7-day dots from `awba_days`; re-voice styling only `[VERIFIED:415]` |
| Returns/day counting | manual date diff | `AW.touchDay()` / `AW.greetMode()` | once-per-day increment, toDateString boundaries `[VERIFIED:385-404]` |
| Icons | inline SVG literals | `AW.icon(name)` | one registry, aria defaults, `--icon-accent` per ground `[VERIFIED:925]` |
| Content validity | ad-hoc checks | `node scripts/validate-content.js` | the frozen ENG-07 gate; exit 0 = clean `[VERIFIED: ran live, exit 0]` |

**Key insight:** ~80% of this phase is wiring shipped primitives into two runners and re-styling in `@layer screens`. The genuinely new code is small: the two runner functions (port Gen-3 logic verbatim), the `@layer screens` classes, and `AW.sound` (a ~15-line silent no-op).

## Gen-3 Machine — Exact Mechanics to Preserve (byte-for-byte)

All extracted from `/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD/shared/awba-engine.js` `[VERIFIED: read in full]`.

### Constants
`PER=12` (noor/correct) · `REFLECT=15` (reflect reveal) · Review `PER=15`, `SWIFT=5`, `QTIME=14`s.

### Lesson quiz resolution (`resolve(ok,it)`, lines 274–287)
- **correct:** `correct++; combo++; comboBest=max(comboBest,combo); noorEarned+=12; bumpNoor()`. If `combo===3` → `firePerfect()` after 260ms (once per streak). `showCombo()` when `combo>=2`.
- **miss:** `mistakes++; combo=0`; hide combo.
- **praise pool (correct):** rotates `['That's it.','Beautiful.','Exactly right.','Masha'Allah.']` by `correct % 4`. Miss title = `'Nothing lost'`.
- **body copy:** `ok ? it.good : it.gentle`.
- **Athar re-voice (D-45):** combo chip → accruing `.dab` gold; PERFECT → quiet gold-thread flourish + praise on Page META surface (no overlay); miss → law-8 grey ink-blot + `it.gentle` one-liner + rose retry frame (NOT the Gen-3 amber footer).

### Star math (`starsFor()`, line 289) — NEVER 0
`mistakes===0 → 3★ · ===1 → 2★ · ≥2 → 1★`. Persisted best-of at `done()`: `if(now>prev) stars[cfg.id]=now` (never downgrades). Shared `awba_stars` namespace across lessons + reviews.

### Reflect beat (lines 212–223)
Private textarea (never persisted). First "Show a reflection" tap → reveals `it.model`, `noorEarned+=15`, `bumpNoor()`, button becomes "Continue". Second tap advances.

### Lesson flow / progress bar (critical detail)
`pos` (beat index, back decrements) is SEPARATE from `stepIndex` (progress-bar fill, only ever increments). Back button decrements `pos` and clamps `stepIndex=max(pos,0)` so **back never un-fills the bar**. Back hidden at opener (`pos<0`). Opener greet modes via `AW.greetMode()`: `first` / `streak` ("N returns" chip) / `returning` ("welcome back", copy override). `AW.touchDay()` fires on "Begin, gently" (NOT page load).

### Reward flow order (lines 292–330) — preserve the four moments + persistence points
1. `verdict()` — `starsFor()` stars + word (`Flawless`/`Beautifully done`/`You made it through`) + 3 stat tiles (Noor `+noorEarned`, Accuracy `%`, Best run `comboBest×`). Gen-3 fired `AW.confetti(26/14)` here → **replace with dab-drift + Ring, D-45.**
2. `rewardNoor()` — noor headline; **`AW.S.set('noor', +noorEarned)` persists HERE**; optional `cfg.grew` "What changed" box.
3. `rewardReturns()` — returns count + `dl` (day/days) + `AW.weekCal()`. Gen-3 orange → apricot Sky-warmth (D-45).
4. `done()` — best-of star persist; `cfg.recap` list; `cfg.next` handoff (`Next: label` link) + "Back to the path". **In gen-4 append the Ring moment + du'a close after/within done (D-51).**

### Review runner (`AwbaReview`, lines 339–464) — the timer state-machine (ENG-04)
- **No back button** (`awback.style.display='none'`). Progress = **lamp row** lit by count-correct, not per-question (`paintLamps()` lights `i<correct`). Gen-3 uses `.gold-bg` dark + gold lantern → gen-4 = Orbit-dark + Hajar Gold + gold thread (D-45).
- **Timer** (`startTimer`, 364): `tleft=14*10` deciseconds, 100ms tick, bar width `%`, `.low` class when `<28%`. On `tleft<=0` → `thisInTime=false; allInTime=false; timeUp()`.
- **`timeUp()`** (371): push question to `skipped`, note "time — it will wait at the end", disable options, show clock verdict, `setTimeout(advance,1500)` (auto-skip, no penalty).
- **`advance()`** (382): `qi++`; if queue exhausted and `phase==='main' && skipped.length` → `circleBackOffer()`; else `result()`.
- **`circleBackOffer()`** (388): untimed replay of skipped ("no noor this time, but a named answer still lights its lamp") OR straight to result. Sets `phase='back'`, `queue=skipped.slice()`.
- **Scoring** (`bind`, 438): correct in main phase → `noorEarned += 15 + (thisInTime?5:0)`; swift label when in-time. Circle-back phase → lamp lights, **no noor**.
- **Result stars** (451): `correct===all ? (allInTime?3:2) : 1`. **Any single timeout permanently kills `allInTime`** → caps at 2★. Verdict words: `Legendary`/`Mastered`/`Reviewed`. `AW.S.set('noor',…)` persists at result. `AW.touchDay()` on "Begin the review".

### Shared skeleton (Gen-3 `AW.skeleton()`, line 72)
Gen-3 injects `.phone/.hud/.segbar/.hstat/.timerwrap/.combo/.perfect/.confetti/.scrim/.sheet`. **gen-4 has NONE of these screen classes yet** (`.stage/.hero/.foot/.segbar/.seg/.scard/.qquote/.pnl/.lacc/.lamps/.weekcal/.noorbig/.grew/.masterbox/.kicker` all absent — verified). The runner must build its own Athar skeleton in `.reg-page` (lessons) / `.reg-orbit` (reviews) and author these classes in `@layer screens`. Retire `.combo/.perfect/.confetti` entirely; `.scrim/.sheet` are provided by the shipped singleton `AW.sheet` (do not rebuild).

## Content Port — the 19-file inventory + gate

### Beat-type frequency (across 15 lessons) `[VERIFIED: grep]`
`read ×17 · mc ×16 · depth ×14 · tf ×12 · panel ×12 · verse ×11 · reflect ×10 · tile ×4 · frame ×2`.
Per lesson: 5–7 beats, 2–3 quiz beats. **Every one of the 9 contract beat types is exercised — all 9 renderers must ship.**

### Panel variants used: `check ×7 · guard ×3 · pull ×1 · tell ×1` `[VERIFIED]`
(`guard`: u2-m3/u3-m3/u2-m3b · `tell`: u2-m1 · `pull`: u2-m2 · `check`: most). All 4 variants (`pull/tell/guard/check`) appear → all 4 must render distinctly.

### Marker types used: `remember ×13 · angle ×8 · fact ×4` (`fard` valid but unused) `[VERIFIED]`
Labels (Gen-3 `AW.MLAB`): fact="Worth knowing", remember="Worth remembering", fard="The first duty", angle="Another angle".

### Optional-field usage `[VERIFIED: grep]`
`n:` (panel item number) ×70 · `grew/doneTitle/doneLine` ×15 each (every lesson) · `intro:` (panel) ×12 · `thought:` (opener) ×9 · `tag:` ×9 · `quote:` (mc/review "Name it") ×5 · `tell:` ×5 · `kind:`/`grade:` (hadith refs) ×5 · `thoughtLabel:` ×1. **`icon:`/`ill:`/`after:` = 0** — no data file overrides the opener icon, no beat carries an inline illustration name, no verse uses `after`. All illustration choices are renderer-hardcoded.

### Review item shapes `[VERIFIED]`
| File | ~questions | tf items | "Name it" quotes |
|---|---|---|---|
| u1-review | 6 | 1 | 1 |
| u2-review | 7 | 1 | 3 |
| u3-review | 6 | 1 | 0 |
| u4-review | 7 | 2 | 0 |
Item = `{q, o[], c, t}` (MC) or `{tf:true, q, c, t}` (TF), `t` = explanation shown after answer. **Naming collision:** review item `t` = explanation text, but lesson beat `t` = beat type — the runner reads them in different contexts, no code conflict, but note it.

### Sensitive holds (CNT-02) `[VERIFIED: file listing]`
- **U4-03 absent entirely:** `lessons/u4-*` = `u4-m1, u4-m2, u4-m2b, u4-m3` — there is **no u4-m4 / U4-03 lesson file**. The absence IS the hold.
- U3 present: `u3-m1, u3-m2, u3-m3` (U3-13 not surfaced / U3-16 principle-only are content-level, verify by diff not file-count).
- The diff/grep pass (D-49) should confirm no new content appears vs source, not that anything is added.

### Port-gate result — RAN LIVE against Josh's real 19 files `[VERIFIED: exit 0]`
```
node scripts/validate-content.js <all 15 lessons + 4 reviews>   → EXIT 0
```
All 19 report `OK` except **3 non-blocking `note:` warnings that MUST NOT be "fixed"**:
- `u3-m1`: unused ref `baqarah-2-163`
- `u3-m3`: unused ref `imran-3-19`
- `u4-m2`: unused term `rububiyah`

These are warnings (exit unaffected). They are consistent with authored-but-uncited references (plausibly hold-adjacent). **Document them as accepted in the SUMMARY so no future executor "resolves" them by adding a citation — that would alter content (D-49).**

### The byte-fidelity / CDN pitfall (the real content risk)
- All 19 Gen-3 files carry `<link href="https://fonts.googleapis.com/css2?...Poppins...Amiri...">` `[VERIFIED: 19/19]` — this **violates the zero-CDN law** and references retired Poppins. It MUST be stripped on port.
- The `<script src="../shared/awba-engine.js">` and `<link ... ../shared/awba-engine.css>` relative paths are **IDENTICAL** to what gen-4 needs (lessons/ is a sibling of shared/) — no path change `[VERIFIED]`.
- **Recommended port recipe:** splice each file's `AwbaLesson({...})`/`AwbaReview({...})` inline-script body byte-identical into a fresh Athar page shell (correct `<head>`: charset, viewport, theme-color, self-hosted font preloads, engine CSS/JS, no CDN). Record a SHA/byte-diff of the cfg region in the SUMMARY (preview.html demoCfg precedent: SHA-verified). This satisfies "verbatim content" (the cfg is byte-identical) while producing a zero-CDN, Athar-correct page. Do NOT verbatim-copy the whole HTML file (it would carry the CDN link + retired Poppins).
- Scripture strings contain **100 `˹ ˺` corner brackets** (`U+02F9/02FA`) that must survive byte-identical `[VERIFIED]` — they render via the Inter fallback (D-50). **0 `ﷺ`** glyphs in these 19 files, so the ﷺ-after-name law is not exercised by this content (still honour it in renderer markup for future content).

## Common Pitfalls

### Pitfall 1: Load order — data file calls `AW.cite` at parse time
**What goes wrong:** data files call `AW.cite(...)` INSIDE their inline cfg (14/19 files do; e.g. u1-m1 depth revelation) `[VERIFIED: grep]`. If the engine `<script>` is `type=module`/`defer`/`async`, or loads after the data script, `AW` is undefined → the page throws.
**Avoid:** engine `<script src="../shared/awba-engine.js">` first, classic (no defer/async/module), data script second. This is FND-07 / already the gen-4 rule.
**Warning sign:** `AW is not defined` in console on page load.

### Pitfall 2: Reintroducing the CDN / retired elements
Byte-copying whole Gen-3 HTML brings back Google Fonts CDN + Poppins. Re-adding `AW.confetti`/PERFECT/combo-chip/companion/amber violates the Gate-2 lock.
**Avoid:** splice cfg only; grep-gate the ported pages for `googleapis`, `confetti`, `perfect`, `poppins`, unit-accent hexes.

### Pitfall 3: Celebration adjacent to scripture (D-51 / law 3)
A stray dab/thread/stamp in a verse panel, or animating the ayah, breaks scripture law.
**Avoid:** `--go:0` on scripture wrappers; a grep/DOM gate asserting no celebration class inside a `.ayah`/`.scripture` panel (like preview §5). The verdict/Ring/du'a fire only on the reward screens, never on a verse beat.

### Pitfall 4: node --test directory form crashes on this Node
`node --test scripts/tests/` throws `MODULE_NOT_FOUND` on Node v24.13.0 `[VERIFIED: STATE decision 02-01]`. **Use glob form only:** `node --test scripts/tests/*.test.js`.

### Pitfall 5: ugrep `--`-leading absence gates
Absence gates with `--`-leading patterns need paren-wrapping (`! grep -q -- '--pattern'`) `[VERIFIED: CONTEXT machine gotchas]`. Gated literals must never appear in comments/strings in `shared/`.

### Pitfall 6: Plan line refs go stale
The engine is ~1359 lines and grows; cite by content anchors (banner names, function names), not line numbers `[VERIFIED: CONTEXT]`.

### Pitfall 7: `animateFrom` misuse replays the whole Ring
Omitting `animateFrom` defaults it to `atomsDone` → an empty draw span → static (safe, but no celebration). Passing `0` or a too-small value re-draws established frontier (law 9 violation).
**Avoid:** pass `animateFrom = preLessonAtoms` captured BEFORE the lesson's atoms are added.

### Pitfall 8: Gen-3 icon/glyph names don't exist in gen-4
`quran`→`quran-stand`, `starpat`→`pattern`; `HEART/BOLT/TARGET/CLOCK/STARG/STARE` glyphs don't exist. Blindly porting `AW.ill('quran')`/`AW.STARG` → empty icon (silent).
**Avoid:** use the rename map above; re-choose reward-stat/wrong-answer marks from shipped GLYPHS.

## Runtime State Inventory

This is a build/port phase, not a rename — no stored strings need migrating. The relevant runtime state is the **progress keys the runners WRITE** (all through `AW.S`, the only storage-touching code):

| Category | Items | Action |
|----------|-------|--------|
| Stored data (localStorage) | `awba_noor` (+=noorEarned at noor-claim/result), `awba_stars[cfg.id]` (best-of, never downgrade), `awba_returns`/`awba_days`/`awba_lastDay` (via `AW.touchDay`), `awba_prefs.soundMuted` (mute toggle, D-52) | Write via `AW.S`/`AW.touchDay` only (shipped). No migration — these keys already exist in the versioned blob |
| Live service config | None — device-local static app, no external services | None |
| OS-registered state | None | None |
| Secrets/env vars | None — no network, no auth, no keys | None |
| Build artifacts | None — zero-build; `shared/sfx/` dir created empty (D-52), no compiled output | Create `shared/sfx/` dir; silent no-op when cue file absent |

**Nothing found** in service/OS/secrets/build categories — verified: the app is device-local, zero-build, no backend (REQUIREMENTS "Out of Scope": no accounts/backend/Supabase).

## Validation Architecture

`workflow.nyquist_validation: true` `[VERIFIED: config.json]` → section included.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Node core `node:test` + `node:assert` (zero npm deps) |
| Config file | none — glob invocation |
| Quick run | `node scripts/validate-content.js` (content gate, <1s) |
| Full suite | `node --test scripts/tests/*.test.js` (**glob form only**, 64/64 green baseline `[VERIFIED: ran]`) |
| DOM harness | `scripts/tests/ls-stub.js` = Map-backed localStorage + node:vm engine loader (pure/state logic); **headless Chrome** for DOM-heavy render verification (system Chrome present at `/Applications/Google Chrome.app/...` `[VERIFIED]`; Phase 3 used it for visual gates) |

### Phase Requirements → Test Map
| Req | Behavior | Test type | Command | File exists? |
|-----|----------|-----------|---------|-------------|
| CNT-01/02 | All 19 files contract-valid, exit 0 | content gate | `node scripts/validate-content.js` | ✅ validator shipped; ❌ Wave 0 needs the 19 ported files in `lessons/`+`reviews/` |
| ENG-03 | noor +12/correct, +15 reflect, stars 3/2/1 never 0, combo thresholds | unit | `node --test scripts/tests/runner-lesson.test.js` | ❌ Wave 0 — extract quiz/star math as testable helpers OR assert via vm+DOM stub |
| ENG-04 | 14s timer→skip→circle-back, +15/+5 swift, timeout caps 2★ | unit | `node --test scripts/tests/runner-review.test.js` | ❌ Wave 0 — the timer state-machine is the highest-value test target |
| ENG-01/02 | all 15 lessons + 4 reviews render without console error | smoke | headless Chrome load each page, assert 0 console errors + key DOM nodes | ❌ Wave 0 — add a `scripts/tests/render-smoke.*` Chrome harness |
| RWD-01/03 | reward sequence order; no celebration class inside `.ayah`/`.scripture` | integration/grep | DOM/grep gate on rendered reward + verse beats | ❌ Wave 0 |
| MOT-05 | missing sfx = clean no-op, zero console errors | smoke | Chrome console assertion (part of render-smoke) | ❌ Wave 0 |
| — | regression: engine primitives untouched | unit | `node --test scripts/tests/*.test.js` (64/64) | ✅ shipped |

### Sampling Rate
- **Per task commit:** `node scripts/validate-content.js && node --test scripts/tests/*.test.js`
- **Per wave merge:** full suite + headless-Chrome render smoke of representative pages
- **Phase gate:** all 19 files exit 0; full suite green; console-error-free load of every lesson + review; grep gates (no CDN / no retired element / no celebration-adjacent-scripture) pass before `/gsd:verify-work`.

### Wave 0 Gaps
- [ ] `lessons/` + `reviews/` populated (19 ported pages) — CNT-01 (blocks the content gate producing signal)
- [ ] `scripts/tests/runner-lesson.test.js` — ENG-03 noor/star/combo/reflect math (extract pure helpers to make testable without a DOM)
- [ ] `scripts/tests/runner-review.test.js` — ENG-04 timer state-machine (skip/circle-back/swift/2★ cap)
- [ ] `scripts/tests/render-smoke.*` — headless-Chrome loader asserting 0 console errors across all 19 pages (also covers MOT-05 silent-sfx + Pitfall-1 load order)
- [ ] Decision: how much runner logic to extract as pure functions vs. test via DOM stub. Gen-3 keeps math in a DOM-coupled closure; extracting `resolve`/`starsFor`/timer-scoring as pure helpers is the cheapest path to fast `node --test` coverage without adding a DOM dependency.

## Environment Availability

| Dependency | Required by | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | validator + test suite | ✓ | v24.13.0 | — (glob-form `node --test` mandatory) |
| System Chrome (headless) | render smoke / visual gate | ✓ | `/Applications/Google Chrome.app/...` | — |
| `_MVP-BUILD/` source | content port | ✓ | at `~/Downloads/AWBA APP/_MVP-BUILD/` | — |
| npm packages | — | N/A | — | zero-dependency by constraint |

**Missing dependencies:** none. No `node_modules`, no puppeteer — headless Chrome is invoked via CLI directly (`--headless --dump-dom` / CDP), matching Phase-3 practice.

## Security Domain

`security_enforcement` absent from config → treat as enabled. This is a **static, device-local, no-auth, no-network, no-backend** app (REQUIREMENTS Out of Scope), so most ASVS categories are structurally N/A.

| ASVS category | Applies | Standard control |
|---------------|---------|-----------------|
| V2 Authentication | no | no accounts/backend |
| V3 Session | no | device-local only |
| V4 Access Control | no | single local user |
| V5 Input Validation | partial | `AW.icon` uses `escapeAttr`/`escapeHtml` on `label`; `AW.cite` escapes labels; reflect textarea is **never persisted or re-rendered**; cfg content is author-controlled (T-03-03 accept — not user input) |
| V6 Cryptography | no | no secrets; ring seed is non-security PRNG (mulberry32) |

| Pattern | STRIDE | Mitigation |
|---------|--------|-----------|
| innerHTML injection from cfg | Tampering | cfg is author-controlled content (Josh's files), never runtime user input; the ONE user-input surface (reflect textarea) is never inserted into the DOM or stored → no reflected/stored XSS path |
| localStorage tampering | Tampering | non-security progress data; corruption at worst resets local progress; `AW.S` try/catches parse errors |

**Note:** the runners build DOM via string concatenation of author content (Gen-3 parity). This is acceptable because the content provenance is trusted (scholar-gated author files), NOT arbitrary user input — the only untrusted input (reflect text) is deliberately inert. Do not introduce any path that renders the reflect textarea value back into the DOM.

## Code Examples

### Silent sound plumbing (`AW.sound`, new — D-52)
```javascript
// Full plumbing now, silent v1: missing file = clean no-op, zero console errors.
AW.sound = function (cue) {                       // cue ∈ correct|incorrect|complete|streak
  if (AW.prefs.get('soundMuted', false)) return;  // visible mute toggle writes this pref
  try {
    var a = new Audio('shared/sfx/' + cue + '.mp3'); // page-relative (lessons/ → shared/sfx/)
    a.play().catch(function () {});                // missing asset / autoplay block → silent
  } catch (e) { /* no-op */ }
};
```
The mute toggle flips `awba_prefs.soundMuted` (slot already in the prefs blob). When owner delivers cues, they drop into `shared/sfx/` with zero code change.

### Grep gate — celebration never adjacent to scripture (D-51)
```bash
# assert no celebration primitive class appears inside a scripture panel in the rendered engine
! grep -qE '(dab|thread|plate|rosette)[^}]*\.(ayah|scripture)' shared/awba-engine.js
# assert no CDN survived the port
! grep -rq 'fonts.googleapis' lessons/ reviews/
# assert retired elements not reintroduced
! grep -rqiE 'confetti|class="perfect"|class="combo"|poppins' lessons/ reviews/ shared/awba-engine.js
```

## State of the Art

| Old (Gen-3) | New (gen-4 Athar) | Impact |
|---|---|---|
| `AW.confetti()` DOM-div burst | DELETED; `.dab` drift + `.thread` draw + Ring | no rainbow burst; celebration is ink |
| PERFECT full-stage overlay | quiet gold-thread flourish on Page META | no mid-quiz interruption |
| amber-never-red miss footer | law-8 grey ink-blot + one-line why + rose retry frame | wrongness is a strike, not a colour |
| companion lantern bob/glow | Ring `animateFrom` frontier + Sky du'a close | aniconism; presence without mascot |
| gummy 5px indigo press | one Athar paper-press (`translateY(1px)` + ink deepen) | already in `@layer components` |
| unit accent colour theming | thermal `data-state` ramp only | `unitColor` cfg field now inert (harmless) |
| `AW.ill()` helper + `AW.STARG` etc. | `AW.icon(name)` + shipped GLYPHS | renderer icon calls must be re-mapped |
| whole-page byte copy | cfg byte-splice into Athar shell | zero CDN, verbatim content |

**Deprecated/outdated:** `AW.ill`, `AW.LANTERN`/`LANTERNG` recolour, `AW.confetti`, Gen-3 icon names (`quran`/`starpat`), Poppins, Google Fonts CDN, `.gold-bg` (→ `.reg-orbit`).

## Assumptions Log

| # | Claim | Section | Risk if wrong |
|---|-------|---------|---------------|
| A1 | The 3 unused-ref/term validator warnings (u3-m1, u3-m3, u4-m2) are intentional/hold-consistent and must not be "fixed" | Content Port | If they were genuine authoring errors, keeping them preserves a defect — but D-49 forbids altering content regardless, so the safe action (leave + document) is unchanged; a scholar/owner review could confirm |
| A2 | ﷺ absent from these 19 files means the honorific-rendering law is simply un-exercised here (not that content is missing) | CNT-04 | Low — the render law still applies to future content; if a hold removed a ﷺ-bearing hadith that would be a content matter, not a render matter |
| A3 | Splicing cfg into a fresh shell (vs. whole-file copy) is the intended reading of "byte-verbatim" (content byte-identical, shell Athar-correct) | Port recipe | If owner intended literal whole-file copy, the CDN link + Poppins would ship — contradicting zero-CDN law, so splice is the only law-consistent reading; flag at plan-check |
| A4 | Runner quiz/timer math can be extracted into pure helpers for `node --test` without violating "preserve Gen-3 mechanics" (behaviour identical, just testable) | Validation | If extraction is disallowed, fall back to headless-Chrome-only verification of math (slower, still valid) |
| A5 | `shared/sfx/` cue format is `.mp3` (D-52 says "cue files"; format unspecified) | AW.sound | Trivial — change the extension/`<audio>` source when owner delivers assets; silent no-op holds regardless |

## Open Questions

1. **How much runner logic to extract as pure functions for testing?**
   - Known: Gen-3 keeps noor/star/timer math inside a DOM-coupled closure; `node --test` has no DOM.
   - Unclear: whether the plan prefers pure-helper extraction (fast unit tests) or headless-Chrome-only assertions.
   - Recommendation: extract `starsFor`, `resolve`-scoring, and the review timer-scoring as pure helpers callable from the runner; unit-test those; use Chrome smoke for the full render. Cheapest path to ENG-03/04 coverage.

2. **Reward-close register handoff (Page → Orbit/Sky).**
   - Known: lessons render on `.reg-page` (cream); the Ring lives on `.reg-orbit` (black); the du'a close is Sky.
   - Unclear: whether the reward choreography stays on one ground (law 1) or the done→Ring→du'a moment transitions grounds.
   - Recommendation: treat the reward flow as its own screen sequence — the verdict/noor/returns/done can stay Page-warm, and the terminal Ring+du'a moment is an Orbit/Sky screen (one ground per screen, transition between them). Owner-taste within Claude's discretion; the §9 gate reads it.

3. **Sound cue asset format + set** — owner ledger item (D-52), not build-blocking.

## Sources

### Primary (HIGH — read/executed this session)
- `/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD/shared/awba-engine.js` (465 lines, full) — Gen-3 mechanics ground truth
- All 19 Gen-3 data files (`lessons/*.html`, `reviews/*.html`) — inventoried via grep + full read of u1-m1, u1-review
- `shared/awba-engine.js` (gen-4, 1359 lines) — AW.* primitive signatures, RUNNERS placeholder
- `shared/awba-engine.css` (gen-4, 1016 lines) — `@layer screens` empty (line 923), component/celebration classes present
- `scripts/validate-content.js` (452 lines, full) — port-gate rules; **ran live against 19 files → exit 0**
- `node --test scripts/tests/*.test.js` → **64/64 green**; `node --version` → v24.13.0
- `.planning/ATHAR-SYSTEM.md`, `03-UI-SPEC-ATHAR.md` (§2–12), `ENGINE-CONTRACT.md`, `04-CONTEXT.md`, `REQUIREMENTS.md`, `STATE.md`, `config.json`, `CLAUDE.md`

### Secondary (MEDIUM — cited from in-repo research)
- CLAUDE.md STACK section (WAAPI, `linear()`, View Transitions, classic-script/file:// rationale) — verified against caniuse/MDN in Phase-1 research

## Metadata

**Confidence breakdown:**
- Gen-3 mechanics to preserve: **HIGH** — extracted line-by-line from source
- Shipped primitives / port targets: **HIGH** — read from in-repo engine + node introspection
- Port gate: **HIGH** — executed live (exit 0, 3 expected warnings)
- Content inventory / holds: **HIGH** — grep + file listing; hold-intent (A1) is the one MEDIUM inference
- Validation architecture: **MEDIUM** — framework/harness verified; the pure-extraction-vs-DOM test strategy is a planning choice (Open Q1)

**Research date:** 2026-07-13
**Valid until:** ~2026-08-13 (stable — no fast-moving external deps; only the in-repo engine could shift, and only via this phase's own work)
