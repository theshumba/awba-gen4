# C4 — awba-app repo content inventory

Collection: `/Users/theshumba/Documents/GitHub/awba-app` (git repo, v3 port, live demo).
Excluded: node_modules/, .git/, .vercel/, dist/, build/, .next/, coverage/.
Note: `corpus/sources/**` is present on disk but is listed in `.gitignore` (`corpus/sources/` — see `.gitignore` line referencing it) — these datasets are fetched locally (`scripts/fetch-corpus-sources.sh`), NOT committed to git history. They are real files sitting in the assigned collection right now, so reported here, but flag that a fresh clone of this repo would NOT have them without re-running the fetch script.

Provenance classing used below:
- **(a)** owner's/Josh's original curriculum doc
- **(b)** previously-built app (this repo) splicing/porting content from originals or from vetted third-party corpora
- **(c)** AI-generated design mock-up — none found in this collection (no Stitch/Lovable screens live here)

---

## G1 — Quran 14:24 (Ibrahim), "good word / good tree," Khattab translation + Arabic

**PARTIAL.** The exact Khattab ("Clear Quran") translation is **ABSENT** — nowhere in this repo. But the verse itself IS present, verbatim, in two vetted raw corpus datasets (class (b), un-curated raw source data — not yet used by any curriculum/UI file):

1. **Arabic (Tanzil Uthmani script)** — `/Users/theshumba/Documents/GitHub/awba-app/corpus/sources/quran-tanzil/quran-uthmani.txt`, line 1774:
   ```
   14|24|أَلَمْ تَرَ كَيْفَ ضَرَبَ ٱللَّهُ مَثَلًا كَلِمَةً طَيِّبَةً كَشَجَرَةٍ طَيِّبَةٍ أَصْلُهَا ثَابِتٌ وَفَرْعُهَا فِى ٱلسَّمَآءِ
   ```
   Format is `surah|ayah|text`, pipe-delimited, no header/license file in that directory (file is literally just the raw Tanzil text dump). `src/lib/data/quran-live.ts` documents this dataset as "Arabic is Tanzil Uthmani verbatim" and is the live app's actual Arabic source for the Qur'an reader.

2. **English (Saheeh International, via QuranEnc)** — `/Users/theshumba/Documents/GitHub/awba-app/corpus/sources/quran-quranenc/english_saheeh.csv`, row id 1774 (`sura,aya` = `14,24`):
   ```
   1774,14,24,"Have you not considered how Allāh presents an example, [making] a good word like a good tree, whose root is firmly fixed and its branches [high] in the sky?",""
   ```
   File header (lines 1–10) self-identifies the translation:
   ```
   # Translation of the meanings of the Noble Qur'an
   # Language: English
   # Translation ID: english_saheeh
   # Source: https://quranenc.com
   # URL: https://quranenc.com/en/browse/english_saheeh
   # Last update: 2025-06-24 16:37:27 (v1.1.2-csv.1)
   ```
   `src/lib/data/quran-live.ts` confirms this is the app's ONLY English Qur'an translation in production: `"the translation is Saheeh International (QuranEnc, official permission) verbatim including its [n] footnote markers, attribution always."` and `translation: "Saheeh International"` is hardcoded as the attribution string returned to every surah view.

**Conclusion for G1:** No Khattab text anywhere in this collection. If the owner is willing to accept Saheeh International instead of Khattab specifically, a byte-verbatim, properly-licensed, already-in-production translation of 14:24 exists here and could be lifted directly (Arabic from Tanzil line 1774, English from QuranEnc row 1774). If Khattab specifically is required, it must come from elsewhere — not in this repo, not in the corpus.

---

## G2 — Arabic chapter/unit terms for the 4 course units

**ABSENT** (for the actual unit/chapter headers). Searched all of `src/lib/data/*.ts` for "Unit N" — found English-only labels:
- `src/lib/data/aqeedah.ts:84` → `unit: "Unit 3 · Tawhid"`
- `src/lib/data/forgiveness.ts:70` → `unit: "Unit 3 · Tawhid"`
- `src/lib/data/story.ts` header comment → "Unit 2, Node 2A"
- `src/lib/data/doubt.ts` header comment → "Aqeedah Level 1, Unit 4"

None of these carry an Arabic string for the unit/chapter name itself — no `arabic:`/`arabic_text:` field is attached to any `unit:` value anywhere in the repo. No component named `unit-header` exists in this repo either (that UI element is specific to the awba-gen4 static build, not this codebase) — so there is nothing here confirming or supplying what the gen4 unit-header squares need.

**Adjacent but NOT what G2 asks for:** `src/lib/data/learn-home-live.ts` shows the *discipline/region* labels (Tarbiyah, Fiqh, Seerah, Tafsīr, ʿAqīdah, Hadith) do carry partial Arabic-script transliteration in their display labels (e.g. `tafsir: "Tafsīr"`, `aqeedah: "ʿAqīdah"` — these are Romanized-with-diacritics, not Arabic script) — and per-concept-node Arabic terms exist (see G6 below) but these are individual vocabulary words (Sabr, Shukr…), not the 4 unit/chapter names.

**Conclusion for G2:** Absent. No Arabic name exists anywhere in this repo for "Unit 1/2/3/4" (or Aqeedah Level 1's chapter structure) as a whole.

---

## G3 — Default closing du'a WITH source, for lesson-close screen

**FOUND — strong candidate.** `src/lib/data/find.ts:139-145`, class (b) but sourced from a specific hadith citation with grading, already rendered live in production at `/find/dua`:

```ts
export const DUA = {
  overline: "Dua · when it's heavy",
  arabic: "اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا",
  transliteration: "Allāhumma lā sahla illā mā jaʿaltahu sahlan, wa anta tajʿalu l-ḥazna idhā shiʾta sahlan",
  translation: "O Allah, nothing is easy except what You make easy — and You make the hard thing, when You will, easy.",
  source: "Ibn Ḥibbān 974 · Sahih",
};
```
Rendered in `src/app/(app)/find/dua/page.tsx` through the app's mandatory-attribution `ScriptureBlock` component; the page's own header comment calls it "a checked, attributed prophetic supplication" and notes it ships `pending_review` in beta (i.e., not yet `scholar_verified` in the DB, but the citation itself — Ibn Ḥibbān 974, graded Sahih — is a real, checkable hadith reference, the well-known "nothing is easy but what You make easy" du'a).

This is a ready-made, fully-formed du'a object (Arabic + transliteration + translation + source-with-grading) that matches the shape `cfg.dua` would need. No `cfg.dua` key exists anywhere in this repo (that config surface belongs to the gen4 static app, not this one) — so this is a *content* match, not a wiring match.

**Also found — a much larger raw pool**, if a different closing du'a is wanted: `corpus/sources/duas-hisn-asellam/hisn.json` — the complete **Hisn al-Muslim** ("Fortress of the Muslim" by Saʿīd ibn ʿAlī al-Qaḥṭānī) book, ingested as JSON, 133 top-level categories (each an Arabic-script section title, e.g. `"أَذْكَارُ الِاسْتِيقَاظِ مِنَ النَّوْمِ"`), each holding an array of `{Text, Count, Reference}` triples where `Reference` is an Arabic-language hadith citation (e.g. `"البخاري مع الفتح 11/ 113 ومسلم 4/ 2083"` = Bukhari + Muslim). Arabic only, no English translation shipped with this dataset. MIT-licensed (`corpus/sources/duas-hisn-asellam/LICENSE.md`, © 2021 Abdellah Sellam), README (`corpus/sources/duas-hisn-asellam/README.md`, in Arabic) states the text was manually transcribed from the printed Hisn al-Muslim and cross-checked via Levenshtein-distance diffing against another digital copy. This is provenance class (b)/well-known-published-source hybrid — a legitimate, widely-used reference work, but note it is Arabic-only text with no vetted English rendering in this repo, so it is not directly drop-in for an English-first du'a-of-the-day without translating it (which would violate "never author/paraphrase scripture" unless a vetted English Hisn al-Muslim translation is sourced separately).

---

## G4 — Additional verified daily-ayah candidates (pool beyond the 7 shipped)

**FOUND — a large, already-verified set exists, though not packaged as a "daily ayah" feature.** Two tiers:

**Tier 1 — curriculum-anchor ayat, individually cited with mechanical verification gates** (from `scripts/seed/*.mjs`, class (b), pending_review pedagogy wrapped around verified corpus anchors):
- `ayah-17-78` — Isra 17:78, "Indeed the recitation of Fajr is witnessed" (`أَقِمِ ٱلصَّلَوٰةَ لِدُلُوكِ ٱلشَّمْسِ إِلَىٰ غَسَقِ ٱلَّيْلِ وَقُرْءَانَ ٱلْفَجْرِ ۖ إِنَّ قُرْءَانَ ٱلْفَجْرِ كَانَ مَشْهُودًا` — full ayah), used as the Fajr anchor in `scripts/seed/seed-prayer-reasons.mjs:82`.
- `ayah-85-14` — Al-Burūj 85:14, backs the Name "Al-Wadūd" in `scripts/seed/seed-today-content.mjs:81` (`source_ref: "Qur'an 85:14"`), also re-used as the attestation ayah for Ar-Raḥmān/Ar-Raḥīm/Al-Ghafūr entries in `scripts/seed/seed-names-batch.mjs`.
- `ayah-2-37`, `ayah-2-127`, `ayah-67-14`, `ayah-51-58`, `ayah-34-26`, `ayah-35-30`, `ayah-2-225`, `ayah-1-3` — each is a mechanically-attested anchor ayah for one of the 13 "Names of Allah" entries in `scripts/seed/seed-names-batch.mjs:61-182` (full list below under G6). Each entry's Arabic Name string is verified (via Unicode-normalization substring match) to actually occur inside its anchor ayah's real Tanzil text before the seed script will write it — a real mechanical gate, not asserted by hand.
- `adh-Dhariyat 51:56`, `an-Nisa 4:171`, `al-Baqarah 2:34`, `Yunus 10:75`, `Fussilat 41:15`, `al-Hijr 15:39`, `al-A'raf 7:16–17`, `Ibrahim 14:22`, `Fatir 35:6`, `al-Hijr 15:42`, `an-Nahl 16:99`, `Fussilat 41:36`, `Nuh 71:23`, `an-Nisa 4:116`, `an-Nahl 16:36`, `Muhammad 47:19`, `az-Zumar 39:65–66`, `at-Tur 52:35–36`, `al-A'raf 7:54`, `an-Nahl 16:20`, `al-Hajj 22:73`, `Yunus 10:34`, `al-Mu'minun 23:14`, `an-Naml 27:62`, `al-Qamar 54:1–2`, `ar-Rum 30:30`, `al-Isra 17:67`, `al-Ankabut 29:65` — all appear as `{ ref: "(...)" }` citations inside `src/lib/data/{aqeedah,doubt,forgiveness,story}.ts`, explicitly labeled as verbatim transcriptions from "Zad Group, 'Aqeedah (Islamic Creed) Level 1', 1st ed. 1446/2024" (a real published curriculum, referenced via `specs/CONTENT-PACK.md` — that spec file itself lives in `~/Downloads/awba-v3-build/`, NOT in this repo, so its full atom text isn't here, only these transcribed excerpts/refs). Header comments repeatedly stress these are **draft — scholar sign-off pending**.

**Tier 2 — the entire Qur'an, ingested and queryable, verified verbatim.** `src/lib/data/quran-live.ts` confirms the corpus holds **every surah's every ayah** as `ayah` nodes with `arabic_text` (Tanzil Uthmani) + `english_text` (Saheeh International/QuranEnc) + `source_ref`, retrievable by `surah`/`ayah` metadata keys. This means the raw material for "any additional daily-ayah candidate, with translation + source" already exists for all 6,236 ayat, not just a curated shortlist — the gap is a *curation* one (which ayat to pick), not a *sourcing* one.

Full raw datasets on disk backing all of this: `corpus/sources/quran-tanzil/quran-uthmani.txt` (Arabic, whole Qur'an) and `corpus/sources/quran-quranenc/english_saheeh.csv` (Saheeh International, whole Qur'an, 6,540 lines incl. header).

---

## G5 — Real course content for Fiqh / Seerah / Qur'an tracks

**MOSTLY ABSENT — only Aqeedah has real built-out lesson content.** What exists:
- **Aqeedah**: substantial, real, sourced lesson content — `src/lib/data/aqeedah.ts` (Flow A, "Why Tawhid Comes First," Unit 3), `src/lib/data/doubt.ts` (Unit 4, evidence for Allah's existence + a creation objection), `src/lib/data/forgiveness.ts` (Unit 3, atom A5), `src/lib/data/story.ts` (Unit 2, "How Belief Drifts"), `src/lib/data/courtyard.ts` (a scripted dialogue, Unit 2/Unit 4 atoms). All explicitly cite **"Zad Group, Aqeedah (Islamic Creed) Level 1, 1st ed. 1446/2024"** as their source and are labeled **draft, scholar sign-off pending** in every file's header comment. This is class (b) — a port/transcription of a real external curriculum doc (the doc itself is not in this repo).
- **Fiqh / Seerah / Tafsīr / Hadith**: only appear as **discipline labels and teaser/meta strings** — e.g. `src/lib/data/learn.ts:10-11` ("The Hijrah, quietly" / Seerah · 20 min; "A day that forgives a year" / Fiqh · 12 min), `src/lib/data/learn-home-live.ts` discipline label map. These are UI-copy teasers for door cards, not actual lesson bodies — no atom-level Fiqh, Seerah, or Tafsīr lesson content (paragraphs, evidences, quizzes) was found anywhere in `src/lib/data/`. `src/lib/data/learn.ts:220-221` has one Qur'an-track item pointing at `ayah_slug: "ayah-2-153"` (root ص-ب-ر study, Sabr) but it's a single word-study reference, not a built lesson.
- **Qur'an track**: the "Sabr" module (`scripts/seed/seed-sabr-module.mjs`) is the one fully-built module with real movements/content (see G6), classed under `tarbiyah`+`aqeedah` disciplines, not a "Qur'an" track per se — it's built around the concept Sabr with a root-letter study, not a tafsir/memorization curriculum.

**Conclusion for G5:** Confirmed largely absent as the owner suspected. Aqeedah is real and sourced (draft/pending scholar review); Fiqh/Seerah/Tafsīr/Hadith exist only as menu labels and single-line teasers with no lesson bodies.

---

## G6 — Everything else religious/reusable (du'a libraries, hadith w/ gradings, honorifics, glossary, atom lists)

### Names of Allah glossary (Arabic + transliteration + gloss + anchor ayah) — 13 entries, class (b)
`scripts/seed/seed-names-batch.mjs:61-182` + `scripts/seed/seed-today-content.mjs:74-92`. Each entry mechanically gated (Name's Arabic string verified as a real substring of its anchor ayah's Tanzil text before write):

| pos | slug | Arabic | Translit | Gloss | Anchor ayah |
|---|---|---|---|---|---|
| 1 | name-ar-rahman | الرَّحْمَٰن | Ar-Raḥmān | The Entirely Merciful | 1:3 |
| 2 | name-ar-rahim | الرَّحِيم | Ar-Raḥīm | The Especially Merciful | 1:3 |
| 3 | name-al-ghafur | الغَفُور | Al-Ghafūr | The Forgiving | 85:14 |
| 4 | name-at-tawwab | التَّوَّاب | At-Tawwāb | The Accepting of Repentance | 2:37 |
| 5 | name-as-sami | السَّمِيع | As-Samīʿ | The Hearing | 2:127 |
| 6 | name-al-alim | العَلِيم | Al-ʿAlīm | The Knowing | 2:127 |
| 7 | name-al-latif | اللَّطِيف | Al-Laṭīf | The Subtle | 67:14 |
| 8 | name-al-khabir | الخَبِير | Al-Khabīr | The Aware | 67:14 |
| 9 | name-ar-razzaq | الرَّزَّاق | Ar-Razzāq | The Provider | 51:58 |
| 10 | name-al-fattah | الفَتَّاح | Al-Fattāḥ | The Opener | 34:26 |
| 11 | name-ash-shakur | الشَّكُور | Ash-Shakūr | The Appreciative | 35:30 |
| 12 | name-al-wadud | الوَدُود | Al-Wadūd | The Loving | 85:14 |
| 13 | name-al-halim | الحَلِيم | Al-Ḥalīm | The Forbearing | 2:225 |

Explicit governing note in both files: **"The classical 99-name enumeration (Tirmidhi 3507) is Da'if per its graders and is not cited for this ordering — positions are Awba curriculum order."** The "meaning" prose lines are marked as "Awba's own pedagogy," `pending_review`, not scripture.

### Concept-term glossary (Arabic + transliteration, no meaning line) — class (b), from `scripts/seed/seed-sabr-module.mjs`
- Sabr — صبر (discipline: tarbiyah, this is the one fully-built module, `pending_review`)
- Shukr — شكر (tarbiyah)
- Tawakkul — توكل (tarbiyah)
- Riḍā — رضا (tarbiyah)
- Tawbah — توبة (tarbiyah)
- Qadar — قدر (aqeedah)
- Root-letter breakdown for Sabr: `"ص · ب · ر"` (line 198)

### Riḍā glossary card with real scholarly citation — `src/lib/data/find.ts:147-155`
```ts
export const NODE_RIDA = {
  overline: "Idea · from the web",
  name: "Riḍā",
  arabic: "رضا",
  tagline: "Contentment with the decree — sabr's quieter sibling",
  body: "Sabr holds through the thing; riḍā stops wrestling it. The scholars ranked riḍā above sabr — rarer, and unforced. It cannot be demanded of anyone; it can only be grown into.",
  source: "Madārij as-Sālikīn, Ibn Qayyim · vol. 2",
  related: ["Sabr", "Qadar", "Shukr"],
};
```

### Hadith with sunnah.com-grade citations + gradings actually used in the shipped app (class b, verified/gated in seed scripts)
- **hadith-bukhari-555** (Sahih) — "Angels come to you in succession by night and day and all of them get together at the time of the Fajr and ʿAsr prayers." Used as Fajr + ʿAsr anchor.
- **hadith-tirmidhi-478** — "It is an hour in which the gates of the heavens are opened…" Dhuhr anchor. Grading explicitly noted as non-uniform: *"grading comes from node.grading — 'Graded variously', per-grader detail in metadata.grades, never flattened."*
- **hadith-muslim-1491**, canonical **Sahih Muslim 656a** — "He who observed the ʿIshāʾ prayer in congregation, it was as if he prayed up to midnight…" ʿIshā anchor. `scripts/fix/fix-muslim-citations.mjs` documents a real corpus-wide citation correction: the ingest pipeline had used fawazahmed0's sequential hadith numbers instead of sunnah.com's canonical Abd al-Baqi numbering for Sahih Muslim, and this script re-derives + fixes canonical refs (`source_url` → `https://sunnah.com/muslim:<canonical>`), sample-verified against sunnah.com content matches.
- **hadith-abudawud-418** — "My community will remain well… so long as it would not delay the evening prayer until the stars shine brightly…" Maghrib anchor.
- **hadith-bukhari-6309** — "Allah is more pleased with the repentance of His slave than anyone of you is pleased with finding his camel which he had lost in the desert." "On returning" card.
- Athar of ʿUmar ibn al-Khaṭṭāb (not the Qur'an translator — the second caliph), "the knots of Islam" — `src/lib/data/story.ts:48,59`.
- Prophetic hadith on arrogance: "rejecting the truth and scorning people" (Muslim) — `story.ts:112`.
- Ibn Masʿūd's "straight line" report — graded **Sahih** (per Shu'ayb al-Arna'ūṭ), source "Ahmad — sahih al-Arna'ut" — `story.ts:125-130`.
- "those before us were destroyed by going to extremes in religion" — Ahmad & an-Nasai, **classed sahih by al-Albani** — `story.ts:88`.
- Bitāqah (card) hadith — Abdullah ibn Amr; at-Tirmidhi, **hasan** — `forgiveness.ts:95,131,231`.
- Muʿādh ibn Jabal narration — Abu Dawud, **sahih al-Albani** — `aqeedah.ts:112,367`.

### Bulk raw hadith corpora present on disk (unfiltered, not yet curated into the app — huge additional pool for future picks)
- `corpus/sources/hadith-fawazahmed0/` — Bukhari, Muslim, Tirmidhi, Abu Dawud, Nasai, Ibn Majah, each in English AND Arabic (`eng-*.json` / `ara-*.json`), one file per collection.
- `corpus/sources/hadith-islamware/` — Sahih Bukhari, Sahih Muslim, Sunan Abu Dawud, Sunan al-Tirmidhi, Sunan al-Nasai, Sunan Ibn Majah, Musnad Ahmad ibn Hanbal, Sunan al-Darimi, Malik's Muwatta — CSV + UTF8 CSV + GPG-signed (`.asc`) variants, with its own `LICENSE` and `README.md` present.
- `corpus/sources/duas-hisn-asellam/hisn.json` — full Hisn al-Muslim, 133 categories (see G3).

### Honorific/typography conventions observed (consistent across all files — reusable convention, not sourced content per se)
- ﷺ (peace-be-upon-him glyph) always attached directly after "the Prophet" in body text, e.g. `"the Prophet ﷺ drew a straight line"`.
- Diacritical transliteration is used consistently: ʿ for ʿayn, ʾ for hamza, macrons for long vowels (Aḥmad, Ṣaḥīḥ-style spellings appear as "Sahih" plain in some places, "sahih al-Albani"/"sahih al-Arna'ut" in others — inconsistent macron use between files, not a single house style).
- Grading and verification are kept as two separate concepts/pills throughout (`story.ts:120-121`: *"grade (green) and verification (teal) stay two separate pills, never merged"*) — i.e. a hadith's classical grade (Sahih/Hasan/Da'if) is distinct from the app's own internal `pending_review`/`api_verified`/`scholar_verified` DB verification state. Worth carrying forward as a convention for gen4: never conflate "this hadith is graded Sahih" with "our app/scholar has verified this content."

---

## Summary table

| Gap | Status |
|---|---|
| G1 | PARTIAL — Khattab absent; Saheeh Int'l (English) + Tanzil (Arabic) verbatim text of 14:24 found in raw corpus, already the app's production translation choice |
| G2 | ABSENT — no Arabic term exists anywhere for the 4 unit/chapter headers |
| G3 | FOUND — ready-made du'a object w/ grading (Ibn Ḥibbān 974, Sahih) at `src/lib/data/find.ts:139-145`; plus a much larger Arabic-only Hisn al-Muslim pool if a different one is wanted |
| G4 | FOUND — ~30 individually-cited curriculum-anchor ayat + the entire Qur'an ingested verbatim (Tanzil + Saheeh Int'l) as a queryable pool |
| G5 | MOSTLY ABSENT — only Aqeedah has real (draft, scholar-pending) lesson content sourced from Zad Group's published curriculum; Fiqh/Seerah/Tafsīr/Hadith are menu labels + teaser lines only, no lesson bodies |
| G6 | FOUND — 13-name Names-of-Allah glossary, 6-term Tarbiyah concept glossary, Riḍā card w/ Ibn Qayyim citation, ~10 individually-vetted hadith w/ gradings, bulk raw hadith/dua corpora, honorific/grading-vs-verification conventions |
