# CONTENT-DECISIONS.md — Binding gap-fill ruling (Provenance Judge)

**Date:** 2026-07-15 · **Role:** Provenance Judge, Awba Gen-4 v2 religious content
**Inputs judged:** C1–C6 mining inventories + R0 orchestrator brief (all read in full) + internal cross-check against the shipped gen-4 corpus (`learn.html`, `shared/awba-engine.js`, `lessons/`).

## Governing law (as amended by the owner, 2026-07-15)
- Verbatim splices **from the owner's own provided documents ARE authorized**. Fabrication and training-memory recall remain **forbidden**.
- Every spliced line keeps the **"pending review"** honesty posture until scholar sign-off.
- **Trust order:** class-a (owner/Josh originals) preferred → class-b acceptable **only** when it carries an explicit canonical citation (surah:verse + named translation, or hadith collection + number + grade) **and** does not conflict with class-a → class-c **never alone**, corroboration only.
- **Disagreement rule:** class-a wins on wording conflict; if only class-b/c exist and they disagree → **CANNOT FILL** (owner decides).
- **Internal-consistency rule (this app):** the entire shipped corpus is **one translation — The Clear Quran / Dr. Mustafa Khattab**, rendered with **`˹ ˺` interpolation brackets**, **"Allah" (no macron)**, **em-dash clause joins**, **Uthmani orthography** (Amiri Quran face for ayat; general Amiri for hadith/du'a). A candidate that mismatches this voice is flagged and may not silently enter the pool.

Every ruling below is traceable: verdict → source file path → byte-verbatim quote → provenance class → why. **No app file was modified in producing this ruling.**

---

## G1 — Qur'an 14:24 (Ibrāhīm, "good word / good tree"), Clear Quran / Khattab

### VERDICT: **CANNOT FILL** — stays on the owner ledger.

**Reason:** The verbatim **Khattab / Clear Quran** text of 14:24 does **not exist in any of the six collections**. C1, C2, C3, C5 return a clean **ABSENT** (exhaustive sweeps: "14:24", "Ibrāhīm", "good tree", "good word", "طيبة", "شجرة", "Khattab", "Clear Quran" — zero hits). The only two candidates found both fail the trust rules:

**Candidate A — business-plan fragment (DISQUALIFIED, class-c, alone).**
Source: `/Users/theshumba/Desktop/Projects/Awba/business-plan-source/business-plan.html` L740–743 (via C6):
> `<div class="scripture">كَلِمَةٌ طَيِّبَةٌ كَشَجَرَةٍ طَيِّبَةٍ</div>`
> `<div class="translation">"A good word is like a good tree — its root firm, its branches in the sky."</div>`
> `<div class="cite">Qur'an · Ibrāhīm 14 : 24</div>`
- Provenance **class-c** (investor-deck design slide) → **never usable alone**, no corroboration anywhere.
- **Only the first clause** of the ayah (the rest — "…yielding its fruit all seasons by the will of its Lord…" — is absent everywhere).
- Translation is a **design paraphrase, not Khattab** (Khattab reads "Do you not see how Allah compares a good word to a good tree? Its root is firm and its branches reach the sky"), **no translator cited**, no `˹ ˺` brackets, standard (non-Uthmani) orthography. Fails on completeness, provenance, and voice.

**Candidate B — Saheeh International (DISQUALIFIED for this slot: wrong translation, conflicts with class-a corpus).**
Source: `/Users/theshumba/Documents/GitHub/awba-app/corpus/sources/quran-quranenc/english_saheeh.csv` row 1774 + `.../quran-tanzil/quran-uthmani.txt` L1774 (via C4):
> Arabic (Tanzil Uthmani): `أَلَمْ تَرَ كَيْفَ ضَرَبَ ٱللَّهُ مَثَلًا كَلِمَةً طَيِّبَةً كَشَجَرَةٍ طَيِّبَةٍ أَصْلُهَا ثَابِتٌ وَفَرْعُهَا فِى ٱلسَّمَآءِ`
> English (Saheeh International): `Have you not considered how Allāh presents an example, [making] a good word like a good tree, whose root is firmly fixed and its branches [high] in the sky?`
- This is complete, licensed (QuranEnc official permission), and class-b with an explicit citation — **but it is Saheeh International, not Clear Quran/Khattab.** Internal cross-check against the shipped DAILY pool (`learn.html` L210–216) shows three hard mismatches: **`[ ]` square brackets vs the app's `˹ ˺`**, **"Allāh" (macron) vs the app's "Allah"**, and a different translation voice. The epigraph slot itself is authored as **"the verbatim Clear-Quran Ibrahim 14:24"** (`learn.html` L917). Splicing a Saheeh verse here would break the app's one-translation integrity — a **conflict with the class-a corpus voice** → disqualified for auto-fill.

**Cross-check vs shipped corpus:** neither candidate matches the shipped Khattab/`˹ ˺`/Uthmani/"Allah" register. Confirmed.

**Owner ledger action (not ours):** pull the **verbatim Khattab 14:24** from **`quranapi.pages.dev`** (`/api/14/24.json`, `english` field) — Josh's own verified route to exact Clear Quran text, documented in `.../AWBA APP/_BUILDS/00_PROGRESS_LOG.md` L30–39 (via C1) — at scholar sign-off. Alternatively the owner may consciously adopt Saheeh International app-wide, but that is a **translation-policy decision, not a gap-fill**, and would require re-voicing the whole corpus.

**Slot stays as the honest fallback** (`learn.html` L922–926): framing line + "Ibrāhīm 14:24 · translation pending review".

---

## G2 — Verified Arabic chapter/unit terms for the 4 course units (R-6 Farag squares)

### VERDICT: **CANNOT FILL** — as a coherent 4-unit Arabic set. Owner ledger.

**Reason:** **No source contains Arabic unit/chapter NAMES for the four units.** C1, C2, C3, C4, C5, C6 all confirm the four units are named **English-only** everywhere. The shipped titles (`learn.html` L173–196) are the app's own framing: **"The Foundation" / "The Drift" / "The Heart of It: Tawhid" / "The Pillars"** — even the underlying Zad textbook names them differently in English ("Drifting away from sound aqeedah" / "Tawhid" / "The pillars of Tawhid"), never in Arabic script (C1 G2).

The only Arabic that exists is **individual technical-term glosses**, and only **one** maps to a unit:
- `تَوْحِيد` (tawḥīd) — corroborated class-b **across four collections** (`awba-handoff.md` L482 via C1; C3 term-sheet label; C4 concept glossary; C6 domain-terms list). But per C1 it is a **term gloss, not a stated "Unit 3 name in Arabic,"** and Unit 3's actual app title is **"The Heart of It: Tawhid,"** not bare "Tawhid" — so even this one is an imperfect map.
- Units 1, 2, 4 ("The Foundation" / "The Drift" / "The Pillars") have **no single Arabic equivalent in any source** — they are authorial English framings, not translatable terms.

**Cannot half-fill the row.** The R-6 squares are one register across one screen (Athar law: one register per screen); filling one of four squares with Arabic and leaving three in English breaks the set. `تَوْحِيد` is recorded here as the **one available building block**, not a sanctioned answer.

**Slot already handles this correctly:** `learn.html` L818–820 renders the English unit title in the cream Farag square with the explicit rule *"R-6: Arabic terms are owner-sourced, never invented."* Keep the English fallback. Owner supplies a verified, scholar-checked 4-term Arabic set (or decides the squares stay English) at sign-off.

---

## G3 — Default closing du'a with source (`cfg.dua`, du'a-close screen)

### VERDICT: **FILL** — splice the Ibn Ḥibbān du'a. Strongest-corroborated ruling in this exercise.

**Chosen text (BYTE-VERBATIM):**
- **Arabic (`cfg.dua.ar`):** `اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا`
- **Source (`cfg.dua.source`):** `Ibn Ḥibbān 974 · Sahih`
- (Transliteration `Allāhumma lā sahla illā mā jaʿaltahu sahlan, wa anta tajʿalu l-ḥazna idhā shiʾta sahlan` and translation `O Allah, nothing is easy except what You make easy — and You make the hard thing, when You will, easy.` are carried verbatim for reference — see engine note below.)

**Source files (two independent owner collections, byte-identical):**
- `/Users/theshumba/Documents/GitHub/awba-app/src/lib/data/find.ts` L139–145 (via C4) — shipped live in production through the app's mandatory-attribution `ScriptureBlock`, ships `pending_review`.
- `/Users/theshumba/Downloads/handoff/source/Zone E - Find.dc.html` E9 "Dua detail" L500–522 (via C5) — same Arabic + transliteration + translation + **"Ibn Ḥibbān 974 · Sahih"**, mirrored identically in `screens/E9-Dua-detail.html`.

**Provenance class:** **b** (the owner's own prior builds), and a real, well-known prophetic supplication.

**Why this candidate wins:**
1. **Explicit canonical citation** — Ibn Ḥibbān 974, graded **Sahih** — a checkable hadith reference (satisfies the class-b bar exactly).
2. **Corroborated byte-for-byte across two independent owner collections** (C4 built app + C5 design handoff) — the only fully-formed du'a package (Arabic + translit + translation + collection + number + grade) in the entire six-collection corpus.
3. **No class-a conflict** — no class-a du'a exists anywhere; nothing to contradict it.
4. **Passes internal cross-check** — it correctly uses **standard orthography** (not Uthmani wasla), which is *right* for a hadith-sourced du'a rendered in the general Amiri face (Uthmani/Amiri Quran is reserved for ayat only per the font-rationing law). Transliteration uses the app's IJMES `ʿ`/macron convention; "Ibn Ḥibbān 974 · Sahih" matches the middot citation convention. Fully consistent with shipped style.

**Rejected alternatives (documented so the owner sees the due diligence):**
- `تقبّل الله` / `الحمد لله` / `جزاك الله خيرا` — unsourced UI dhikr; C3's own build log records the team **searched every source doc for `جزاك` and found it "not present anywhere," making removal final** (`00-BUILD-STATE.md` L173/201). Not candidates.
- The v1.1 "Maghrib … settled heart" hadith line — **explicitly retracted by the owner's own v1.2 brand kit as unsourced** (C2 G3). Must not be used.
- Hisn al-Muslim full corpus (`corpus/sources/duas-hisn-asellam/hisn.json`, C4) — Arabic-only, **no vetted English**; using it would require translating scripture (forbidden). Not drop-in.

**Thematic note for the owner (does not affect the ruling):** in both source docs this du'a is filed as "Dua · when it's heavy," not as a lesson-completion du'a. It reads aptly at a lesson close (asking Allah to make the path easy), but the owner may substitute a different sourced du'a at scholar sign-off — the pending-review pill stays until then.

---

## G4 — Additional verified daily-ayah candidates beyond the shipped 7

### VERDICT: **CANNOT FILL** — do **NOT** expand the pool. The 7 shipped Khattab verses stand.

**Qualifying bar (from the brief):** verbatim text + surah:verse + translation provenance, class-a or corroborated class-b, **same translation as shipped (Clear Quran / Khattab)**.

**Qualifying verses found: ZERO.**
- C1 confirms the **7 shipped Khattab verses are the only Clear-Quran daily-ayah verses in existence** across the AWBA APP collection — byte-identical across every archived `learn.html`, no alternate/expanded pool ever existed.
- C4 holds the **entire Qur'an verbatim** — but in **Saheeh International** (`english_saheeh.csv`) + Tanzil Uthmani Arabic. **Wrong translation.** Mixing it into the Khattab pool breaks single-translation integrity (identical `[ ]`-vs-`˹ ˺` / "Allāh"-vs-"Allah" mismatch documented under G1). Disqualified by the "same translation" bar.
- C5 daily-ayah/hadith pool — also **Saheeh International** for Qur'an. Disqualified, same reason.
- C3, C6, C1 lesson bodies — **surah:ayah POINTERS only**, no verbatim Khattab text; the atom docs' own house policy was *"No verse translations reproduced — meanings paraphrased, only surah:ayah pointers kept"* (C1/C3/C6). Nothing ready to ship.

**Ruling:** the DAILY pool remains **exactly the 7 shipped verses** (`learn.html` L209–217). **No SHA change** to the `scripts/port-audit.mjs` "DAILY BYTES OK" pin. Owner route: source additional **verbatim Khattab** verses via `quranapi.pages.dev` at scholar sign-off, matching the shipped `˹ ˺`/Uthmani/"Allah" voice. (If the owner ever adopts Saheeh International app-wide, the C4 corpus becomes usable — but that is a corpus-wide translation-policy decision, not a gap-fill.)

---

## G5 — Real course content for Fiqh / Seerah / Qur'an tracks

### VERDICT: **CANNOT FILL** — confirmed absent across all six collections. Courses stay coming-soon.

**Reason:** Every collection returns the same result — **only Aqeedah Level 1 has real lesson content** (already shipped, sourced from Zad Group's *Aqeedah (Islamic Creed) Level 1*, 1st ed. 1446/2024, draft/scholar-pending). Fiqh / Seerah / Qur'an / Tafsīr / Hadith exist **only as menu labels, teaser lines, and "Soon" cards** with zero lesson bodies (C1 G5, C2 G5, C3 G5, C4 G5, C5 G5, C6 G5). C3 even records the explicit in-collection house rule *"never invent Ṣalāh/Sīrah/Qurʾān cards"* (`system/SCREEN-MAP.md`).

**Named candidate source books, reported for the owner (not content — sourcing leads):**
- **Fiqh:** Zad Academy Level-1 Fiqh course book — "**parked**," source PDF is a **low-resolution scan with no text layer** (C1, C6); an early `fiqh-unit1-atoms-v2.md` draft is referenced but **does not exist in any collection**. Named alternative fiqh text: ***Ascent to Felicity* (Hanafi)** (C1).
- **Seerah:** ***Interactions of the Greatest Leader*** by Sh. Muhammad Sāliḥ al-Munajjid (~600pp, organised by life-situation) — named as the primary Seerah candidate in C1 and C2, present as a citation only, not as text.
- **The Zad "failed upload" set** (Fiqh / Seerah / Al-Hadith Level-1 books) — C2 notes these are in fact **intact in a separate `ZAD ACADEMY` zip the owner has not yet supplied to any assigned folder**; C1 saw them as near-empty/corrupt exports.
- **Licensing caveat (C6 research):** even the Zad Aqeedah source is **© all-rights-reserved** (paraphrase-only); verbatim course content requires a licensing conversation Josh explicitly deferred, plus scholar sign-off.

**Ruling:** no course content to splice. Course switcher stays unchanged (Fiqh/Seerah "COMING SOON").

---

## G6 — Other reusable religious content (du'a libraries, hadith gradings, honorifics, glossary, atoms beyond 65)

### VERDICT: **CANNOT FILL any v2 slot** — informational; owner ledger for future scholar-gated work.

**Reason:** v2 builds **onboarding / practice / profile / more** — none introduces a new religious-content slot, and R0 forbids new religious content on those surfaces (Practice reuses Josh's quiz items byte-verbatim; the other three are UI/state). So G6's inventory has **no v2 target to fill**. The one actionable item (the Ibn Ḥibbān du'a) is already ruled under **G3**. Everything else is recorded for the owner's future content pipeline:

- **16-term glossary** (Arabic + transliteration + gloss) — `.../build-v2-transfer/awba-handoff.md` L398–543 (C1 6a): ʿaqīdah, īmān, shirk, ṭāghūt, fiṭrah, sunnah, ijmāʿ, bidʿah, tawḥīd, ilāh, lā ilāha illā Allāh, rubūbiyyah, ulūhiyyah, al-asmāʾ wa'ṣ-ṣifāt. Earlier build; some overlap the shipped 4-term gloss (ṭāghūt/shirk/ʿaqīdah/īmān, capped per C3/C6). Class-b, draft.
- **Hadith gradings metadata** (which hadith / grader / collection, NOT verbatim text) — the Zad atom docs (C1 6b, C3 G6, C4 G6): e.g. bitāqah hadith (at-Tirmidhi, **hasan**); fitrah hadith (Bukhari & Muslim); Muʿādh ibn Jabal (Abu Dawud, **sahih al-Albani**); Ibn Masʿūd straight-line (Ahmad, **sahih al-Arnaʾūṭ**). Usable as sourcing map only; verbatim wording still needs Sunnah.com pull + scholar sign-off.
- **13-entry Names-of-Allah glossary** (Arabic + translit + gloss + mechanically-gated anchor ayah) — `awba-app/scripts/seed/seed-names-batch.mjs` L61–182 (C4 G6). Note its own governing caveat: the Tirmidhi 3507 99-name enumeration is **Daʿīf** and is deliberately not cited for ordering.
- **Conventions to carry forward** (not content): honorific **ﷺ** inline after "the Prophet" (all collections); **grade pill and verification pill stay two separate axes, never merged** (C4/C5); "unverified · pending review" chip until scholar sign-off (all collections); middot citation format `Qur'an 6:82 · al-Anʿām` / `Sahih Muslim 93 · via Sunnah.com`; IJMES `ʿ`/hamza/macron transliteration.
- **Sensitive-atom HOLD list** (must never surface if any Unit 2–4 atom is reused): U1-15, U1-16, U2-02, U2-04, U2-05, U3-13, U3-16, and **U4-03 (DRAFT — HOLD, fully excluded)** (C1 6d, C3 G6, C6 G6).

**Ruling:** nothing to wire into v2; all of the above stays on the owner's future-content ledger, scholar-gated.

---

## Implementation notes (for the build agents)

### The single FILL — G3 du'a → `cfg.dua` → `duaClose()`
- **Where it lands:** the engine's `duaClose()` at `shared/awba-engine.js` L2290–2311 already consumes `cfg.dua` = `{ ar, source }` and renders `ar` in a `.scripture` block + `source` in a `.close` line, **auto-appending " · pending review"** (L2300). So the source string must be **`Ibn Ḥibbān 974 · Sahih`** with **no** trailing " · pending review" (the engine adds it).
- **Exact object to splice:**
  ```js
  dua: { ar: 'اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا',
         source: 'Ibn Ḥibbān 974 · Sahih' }
  ```
- **SHA / content-file caution:** the 19 shipped lesson/review files are **SHA-immutable in v2**. Do **not** hand-edit `cfg.dua` into individual lesson files (that changes a content-file SHA and violates the immutability law). Land it as a **single engine-level default inside `duaClose()`** (used when a lesson omits `cfg.dua`), which keeps all 19 content files byte-frozen. This is an engine change → **shared-seams wave**, engine storage-word/glyph invariants re-proven, no new hex, token-only.
- **Engine surfacing limit:** `duaClose()` currently renders only `ar` + `source` (no transliteration/translation). The verified du'a *has* both; if the designer wants them shown, that is a small `duaClose()` extension (still shared-seams wave), not a content change. Otherwise ship `ar` + `source` only — still complete and honest.
- **Gate update (honest):** whatever gate audits du'a/scripture provenance must record this line as **class-b, corroborated (awba-app find.ts + handoff Zone E9), Ibn Ḥibbān 974 · Sahih, pending review** — never as "verified."

### The three CANNOT-FILLs — nothing to wire, slots already honest
- **G1 epigraph (R-7, `learn.html` L922–926):** unchanged — framing line + "Ibrāhīm 14:24 · translation pending review". No splice.
- **G2 unit-header Farag squares (R-6, `learn.html` L818–820):** unchanged — English unit title fallback. No Arabic. No splice.
- **G4 DAILY pool (`learn.html` L209–217):** unchanged — 7 Khattab verses. **`scripts/port-audit.mjs` "DAILY BYTES OK" SHA pin stays as-is** (do not touch; any change here would be a red flag).

### Gate board expectations
- No new scripture enters `learn.html`, the DAILY pool, or the 19 content files → their SHAs/port-audit pins are **unchanged**.
- The only new religious literal repo-wide is the G3 du'a Arabic + `Ibn Ḥibbān 974 · Sahih` in the engine → the provenance/port-audit gate's expected-provenance list gains **exactly one** class-b, pending-review entry; everything else stays frozen.

---

## Summary of the six verdicts

| Gap | Verdict | One-line basis |
|---|---|---|
| **G1** — Qur'an 14:24 Khattab (epigraph R-7) | **CANNOT FILL** | Khattab text absent in all six sources; only candidates are a class-c partial paraphrase (business plan) and full Saheeh Int'l (wrong translation, `[ ]`/"Allāh" clash with the shipped `˹ ˺`/"Allah"/Clear-Quran corpus). Owner ledger; pull verbatim Khattab via quranapi.pages.dev. |
| **G2** — Arabic unit/chapter terms (R-6 squares) | **CANNOT FILL** | No Arabic unit NAMES exist anywhere; only `تَوْحِيد` maps (imperfectly) to one of four units — can't half-fill the row. English fallback already sanctioned. |
| **G3** — Default closing du'a (`cfg.dua`) | **FILL** | Ibn Ḥibbān 974 · Sahih du'a — class-b, explicit canonical grade, **byte-identical across C4 (find.ts) + C5 (handoff E9)**, no class-a conflict, passes internal style check. The one solid splice. |
| **G4** — Daily-ayah pool expansion | **CANNOT FILL** (do not expand) | No additional verbatim **Khattab** verse exists; the only full-Qur'an corpus is Saheeh Int'l (wrong translation). Pool stays at 7; SHA pin untouched. |
| **G5** — Fiqh / Seerah / Qur'an course content | **CANNOT FILL** | Zero lesson content in all six; only "Soon" labels + named source books (Zad failed-upload set, *Ascent to Felicity*, *Interactions of the Greatest Leader*) — sourcing leads, licensing + scholar-gated. |
| **G6** — Other reusable religious content | **CANNOT FILL** (informational) | No v2 slot needs it (onboarding/practice/profile/more add no religious content). Glossaries, hadith-grading metadata, Names-of-Allah set, conventions, and the sensitive-atom HOLD list are logged for the owner's future scholar-gated pipeline. |

**Net for v2:** exactly **one** authorized splice (G3 du'a, class-b, pending-review), landed as an engine-level default in `duaClose()` without touching any SHA-frozen content file. G1/G2/G4/G5/G6 stay on the owner ledger with their honest placeholders intact. No fabrication, no training-memory recall, no translation-mixing.
