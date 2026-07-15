# C1 — Content-mining inventory: /Users/theshumba/Downloads/AWBA APP

Collection swept: the entire "AWBA APP" folder — `_MVP-BUILD/` (shipped source), `_BUILDS/` (incl. `_archive/`, `_GEN2-LAB/`, `_old-and-sukun/`, `NEW-MODULES/`), `_ORGANIZED/` (01_Research…06_Working-Docs + `_Archive/`), and `unorganised (me)/` (a near-duplicate mirror of `_ORGANIZED` + zips). Zips were not opened (their contents are duplicated unzipped elsewhere in the tree — `_ORGANIZED/05_Build-Handoffs/` and `unorganised (me)/Awba_Leaning_Build_V02_05072026/`). Per instructions, the 19 shipped lesson/review HTML files in `_MVP-BUILD/` were not re-inventoried beat-by-beat; only content outside them, and anything inside them not already in the shipped app, is reported.

---

## G1 — Quran 14:24 "good word / good tree" (Clear Quran, Khattab)

**ABSENT.** No occurrence of "14:24", "Ibrāhīm 14:24", "good tree", "good word", "kalimah ṭayyibah", "شجرة" or "طيبة" anywhere in the collection (checked every .md/.html, Arabic-script sweep included).

Near-miss found (do not substitute): **Ibrāhīm 14:27** (different ayah, same surah) is already shipped in `_MVP-BUILD/lessons/u3-m3.html` lines 15/30/34 — Clear Quran/Khattab, verbatim, tagged "pending review":
> `ar:'يُثَبِّتُ ٱللَّهُ ٱلَّذِينَ ءَامَنُوا۟ بِٱلْقَوْلِ ٱلثَّابِتِ فِى ٱلْحَيَوٰةِ ٱلدُّنْيَا وَفِى ٱلْـَٔاخِرَةِ'`
> `mean:'Allah makes the believers steadfast with the firm Word ˹of faith˺ in this worldly life and the Hereafter.'`
> `src:'The Clear Quran · Dr. Mustafa Khattab · pending review'`
This is already in the shipped app (u3-m3.html), so it's not a new find for the gap, but confirms 14:24 itself was never sourced/used by Josh's pipeline. **The learn.html epigraph placeholder gets nothing from this collection — needs sourcing elsewhere.**

Provenance of the whole pipeline is (b): a locked project *policy*, not a specific quote, found in `_BUILDS/00_PROGRESS_LOG.md` lines 30-39 (identical text repeated verbatim in every dated archive of this file, e.g. `_BUILDS/_archive/2026-07-10_0900/00_PROGRESS_LOG.md`, `_archive/2026-07-10_1037/…`, `_archive/2026-07-10_2021/…`):
> "**Verses:** we display the **direct, official translation only — The Clear Quran, Dr. Mustafa Khattab**. We never paraphrase, summarise, or generate a verse's meaning. Verbatim text only."
> "**Sourcing note:** The Clear Quran is no longer served by quran.com's free public API (removed, licensing). Exact verbatim Khattab text is currently pulled from `quranapi.pages.dev` (`/api/{surah}/{ayah}.json`, `english` field — verified to be the Khattab Clear Quran). If that source ever drifts, re-verify against the official Clear Quran before use."

This confirms *quranapi.pages.dev* as Josh's own verified-working route to exact Khattab text (useful lead for sourcing 14:24 elsewhere), but the actual 14:24 text is not present in any document here.

---

## G2 — Verified Arabic chapter/unit terms for the 4 course units

**ABSENT** (no Arabic unit/chapter names found), but the **English unit titles + the underlying source book's own unit structure** are present and load-bearing:

Shipped English titles, `_MVP-BUILD/learn.html` lines 120-143 (category b — already-shipped app data):
- Unit 1 (blue `#2E6BF5`): **"The Foundation"** — "What belief is, and how to hold it"
- Unit 2 (purple `#7C5CE0`): **"The Drift"** — "How belief slips, and how to guard it"
- Unit 3 (teal `#0FA3A3`): **"The Heart of It: Tawhid"** — "The one word everything else serves"
- Unit 4 (gold `#E8A400`): **"The Pillars"** — "Standing it up, and knowing it is true"

The **original curriculum source** (category a — highest authority, the actual textbook these units are atomized from) names the units differently, in English, with page ranges, in the atom docs `_ORGANIZED/05_Build-Handoffs/build-v3-melusi_LATEST/aqeedah-unit{2,3,4}-atoms-v2.md` and `build-v2-transfer/aqeedah-unit1-atoms-v2.md`:
> Source line (repeated per unit doc): "*Aqeedah (Islamic Creed) Level 1*, Zad Academy Series / Zad Group (1st ed. 1446/2024)" — `CourseBook_Semester1_AlAqeedah.pdf`
- Unit 1 (p.11–31): untitled in the doc, covers "Foundations" (definition, why it matters, distinguishing features, the three sources, method of Ahl as-Sunnah)
- Unit 2 (p.33–49): **"Drifting away from sound aqeedah"**
- Unit 3 (p.49–62): **"Tawhid"**
- Unit 4 (p.63–83): **"The pillars of Tawhid"**

No Arabic-script unit/chapter titles (e.g. a Arabic name for "Unit 1" or "the four units") appear anywhere — not in the Zad source citations, not in the handoff docs, not in the shipped HTML. What Arabic *does* exist is technical vocabulary terms (see G6 below), notably **تَوْحِيد / tawḥīd** which is literally Unit 3's name in English — if an Arabic unit label is wanted, `_ORGANIZED/05_Build-Handoffs/build-v2-transfer/awba-handoff.md` line 482 has the verified diacritized spelling: `تَوْحِيد` (tawḥīd) — but this is a term gloss, not a stated "Unit 3 name in Arabic," so treat as a building block, not a verified answer.

**Status:** PARTIAL at best — English unit titles (both shipped and source-book) are solid; true Arabic unit/chapter names are not in this collection.

---

## G3 — Default closing du'a with source (cfg.dua)

**ABSENT.** Extensively searched for "dua", "du'a", "دعاء", "closing dua", "cfg.dua", "sunnah.com" near a supplication, "reflect...dua". Findings:

- The lesson-close **"reflect" beat** (shipped in every lesson, e.g. `_MVP-BUILD/lessons/u1-m1.html` line 29, and the engine `_MVP-BUILD/shared/awba-engine.js` lines 212-220) is internally *labelled* "reflect (dua)" in the build-record design docs (e.g. `_BUILDS/00_BUILDS_INDEX.md` "reflect (dua)"), but functionally it is a **private write-in reflection prompt** ("Where in your life does being certain of something change how you act…") with a generated "model reflection" shown after — **not an actual supplication text, and not sourced**. This is category (b) — shipped app mechanism, not a du'a library entry.
- The only du'a-adjacent Arabic string found is the lesson-completion screen phrase **"تقبّل الله"** ("may Allah accept") in `_ORGANIZED/05_Build-Handoffs/build-v2-transfer/awba-handoff.md` line 679 (category b, an earlier build's completion screen: `<div class="ar">تقبّل الله</div><div class="dt">Lesson complete</div>`) — a closing phrase, not a full supplication, and carries no cited source (no verse/hadith reference attached).
- No du'a library, no "default closing du'a" field, no sunnah.com-referenced supplication text exists anywhere in the collection.

**Conclusion: this gap must be filled from outside this folder.**

---

## G4 — Additional verified daily-ayah candidates beyond the 7 shipped

**ABSENT — no additional pool found; the 7 shipped verses are the only ones that exist anywhere in this collection**, and they are identical, byte-for-byte, across every version of `learn.html` found (shipped `_MVP-BUILD/learn.html` and every archived pre-version `_BUILDS/_archive/*/learn.html`). No draft/earlier/alternate DAILY array was ever different. Recording the exact shipped set for reference (category b, `_MVP-BUILD/learn.html` lines 152-161, "daily ayah library — verified Clear Quran, rotates by day"):

1. ar-Rūm 30:30 — `فَأَقِمْ وَجْهَكَ لِلدِّينِ حَنِيفًا ۚ فِطْرَتَ ٱللَّهِ ٱلَّتِى فَطَرَ ٱلنَّاسَ عَلَيْهَا` — "So be steadfast in faith in all uprightness ˹O Prophet˺—the natural Way of Allah which He has instilled in ˹all˺ people."
2. al-Ḥijr 15:9 — `إِنَّا نَحْنُ نَزَّلْنَا ٱلذِّكْرَ وَإِنَّا لَهُۥ لَحَـٰفِظُونَ` — "It is certainly We Who have revealed the Reminder, and it is certainly We Who will preserve it."
3. al-Anʿām 6:82 — `ٱلَّذِينَ ءَامَنُوا۟ وَلَمْ يَلْبِسُوٓا۟ إِيمَـٰنَهُم بِظُلْمٍ أُو۟لَـٰٓئِكَ لَهُمُ ٱلْأَمْنُ وَهُم مُّهْتَدُونَ` — "It is ˹only˺ those who are faithful and do not tarnish their faith with falsehood who are guaranteed security and are ˹rightly˺ guided."
4. al-Baqarah 2:163 — `وَإِلَـٰهُكُمْ إِلَـٰهٌ وَٰحِدٌ ۖ لَّآ إِلَـٰهَ إِلَّا هُوَ ٱلرَّحْمَـٰنُ ٱلرَّحِيمُ` — "Your God is ˹only˺ One God. There is no god ˹worthy of worship˺ except Him—the Most Compassionate, Most Merciful."
5. an-Naḥl 16:97 — `مَنْ عَمِلَ صَـٰلِحًا مِّن ذَكَرٍ أَوْ أُنثَىٰ وَهُوَ مُؤْمِنٌ فَلَنُحْيِيَنَّهُۥ حَيَوٰةً طَيِّبَةً` — "Whoever does good, whether male or female, and is a believer, We will surely bless them with a good life."
6. an-Naml 27:62 — `أَمَّن يُجِيبُ ٱلْمُضْطَرَّ إِذَا دَعَاهُ وَيَكْشِفُ ٱلسُّوٓءَ` — "Who responds to the distressed when they cry to Him, relieving ˹their˺ affliction?"
7. aḏ-Ḏāriyāt 51:56 — `وَمَا خَلَقْتُ ٱلْجِنَّ وَٱلْإِنسَ إِلَّا لِيَعْبُدُونِ` — "I did not create jinn and humans except to worship Me."

(All tagged "The Clear Quran · Dr. Mustafa Khattab · pending review" at point of use.)

The lesson bodies (already-shipped, ~30 scripture refs across the 19 files, per `_BUILDS/00_PROGRESS_LOG.md` line 57 "30 scripture references") do use *other* verses as headline/citation cards inside lessons (e.g. al-Kahf 18:110, al-Aʿraf 7:96/7:3, az-Zumar 39:65, an-Nahl 16:36/16:43/16:44, al-Anbiyāʾ 21:25, Luqmān 31:13/31:25, al-Baqarah 2:21/2:34/2:137, Yūsuf 12:2, an-Nūr 24:51/24:71(no)... etc.) — these are lesson-body citations, not daily-ayah-card candidates, and are already inside the shipped 19 HTML files (not re-inventoried per instructions). None of them is a *new, unused* pool distinct from what's shipped.

---

## G5 — Real course content for Fiqh / Seerah / Qur'an tracks

**ABSENT as usable content — confirmed placeholder-only**, with useful planning/sourcing notes:

- Shipped app: `_MVP-BUILD/learn.html` lines 299-300 — course switcher shows `Fiqh · Level 1` and `Seerah` both tagged **"COMING SOON"**, greyed out, non-functional. Line 223: `'<div class="finish">۞ The foundation, complete. Fiqh comes next. ۞</div>'` — aspirational copy only, no Fiqh content exists.
- Earlier builds (`_ORGANIZED/_Archive/duplicates/awba-handoff__dup-from-awba-claude-context.md` line 758, and its duplicates) show placeholders for **Ṣalāh, Sīrah, Qur'ān** as greyed "Soon" module cards — again, no content.
- **Planning-stage findings only** (category b/working-doc, not usable content), in `_ORGANIZED/06_Working-Docs/Sukun-Workshop1-Learning-Engine-and-Corpus-Findings-v0_1.md`:
  - Line 50: "**Failed upload — need re-uploading:** *Fiqh* course book, *Seerah* course book, and *Al-Hadith* course book all came through as near-empty files (a few hundred bytes / copyright page only)." — i.e. Josh has/had these Zad Academy course books but the digital exports failed; no text was ever recovered in this collection.
  - Line 38: candidate Seerah source identified but not yet used: *"Interactions of the Greatest Leader"* (Muhammad Saalih al-Munajjid, ~600pp) — organised by life-situation, not chronology. Not present as actual text, only as a citation/plan.
  - `_BUILDS/_archive/2026-07-10_0844/awba-build-compartments-v4.md` line 10: "**Fiqh is parked.** Its source PDF is a low-resolution scan with no text layer; atomization is on hold pending clean text. (An early `fiqh-unit1-atoms-v2.md` draft exists but is on hold with the rest.)" — **this referenced `fiqh-unit1-atoms-v2.md` file does NOT exist anywhere in this collection** (searched by name; not found). If it exists, it's not in this folder.
  - `_ORGANIZED/05_Build-Handoffs/build-v2-transfer/jibreel_lesson_teardown_v3.md` and `AWBA_Research_and_Pedagogy_Master.md` name the planned core Fiqh text as ***Ascent to Felicity* (Hanafi)** — again a citation/plan, not actual content.

**Conclusion: Fiqh/Seerah/Qur'an have zero real lesson content in this collection — confirmed absent, with the specific candidate source books/authors named above for future sourcing.**

---

## G6 — Other reusable religious content (du'a libraries, hadith gradings, honorifics, glossary, atoms beyond 65)

### 6a. Term glossary with Arabic + transliteration + gloss (category b, shipped-adjacent but from an earlier build not in current shipped app)
Found in `_ORGANIZED/05_Build-Handoffs/build-v2-transfer/awba-handoff.md` (and its exact duplicates: `unorganised (me)/awba claude context/awba-handoff.md`, `unorganised (me)/Awba_Leaning_Build_V02_05072026/awba transfer files for build v2/awba-handoff.md`, `_ORGANIZED/_Archive/duplicates/awba-handoff__dup-from-awba-claude-context.md`). Sample entries (byte-verbatim `term` objects, lines as in the file):
- L398: `{t:'term',ar:"عَقِيدَة",tl:"ʿaqīdah",en:"creed — firm belief the heart is bound to",rt:"Root ʿaqada: to tie or bind firmly."}`
- L402: `{t:'term',ar:"إِيمَان",tl:"īmān",en:"faith — the six articles of belief"}`
- L406: `{t:'mc',q:"'Sound' (ṣaḥīḥ — صَحِيح) aqeedah means it is —",...}`
- L412: `{t:'term',ar:"شِرْك",tl:"shirk",en:"associating partners with Allah",rt:"The opposite of Tawhid — the gravest error in belief."}`
- L415: `{t:'term',ar:"طَاغُوت",tl:"ṭāghūt",en:"any false object of worship (a false deity)"}`
- L427: `{t:'term',ar:"فِطْرَة",tl:"fiṭrah",en:"the innate nature we're born with",rt:"The natural disposition inclined to know its Creator."}`
- L437: `{t:'term',ar:"سُنَّة",tl:"sunnah",en:"the Prophet's way — his words, deeds, and approvals"}`
- L439: `{t:'term',ar:"إِجْمَاع",tl:"ijmāʿ",en:"the consensus of the scholars",rt:"Here: the agreement of the salaf — the early generations."}`
- L451: `{t:'term',ar:"بِدْعَة",tl:"bidʿah",en:"innovation in religion — a newly-invented matter with no basis"}`
- L482: `{t:'term',ar:"تَوْحِيد",tl:"tawḥīd",en:"affirming the oneness of Allah",rt:"Root wahhada: to make one, to unify."}`
- L485: `{t:'term',ar:"إِلَٰه",tl:"ilāh",en:"a god — one who is worshipped"}`
- L487: `{t:'term',ar:"لَا إِلَٰهَ إِلَّا اللَّٰه",tl:"lā ilāha illā Allāh",en:"there is no god worthy of worship but Allah",rt:"The word (kalimah) of Tawhid."}`
- L514: `{t:'term',ar:"طَاغُوت",tl:"ṭāghūt",en:"any false object of worship",rt:"What the 'no' rejects."}`
- L524: `{t:'term',ar:"رُبُوبِيَّة",tl:"rubūbiyyah",en:"Lordship — Allah alone creates and controls"}`
- L525: `{t:'term',ar:"أُلُوهِيَّة",tl:"ulūhiyyah",en:"divinity — Allah alone is worshipped"}`
- L526: `{t:'term',ar:"أَسْمَاء وَصِفَات",tl:"al-asmāʾ wa'ṣ-ṣifāt",en:"Allah's names and attributes"}`
- L543: `{t:'term',ar:"فِطْرَة",tl:"fiṭrah",en:"the innate inclination to the Creator"}`
- L590: opening screen Arabic — `<div class="barb">بِسْمِ اللَّٰه</div>` (bismillah)
- L761: brand line — `<div class="brand"><span class="brand-name">awba</span><span class="bsub">أوبة · return</span></div>`
- L24: name etymology — "**Awba** (أوبة), root ء–و–ب, meaning **"return"** — with a warm "welcome home" connotation (distinct from the more formal *tawbah*/repentance)."

This is an earlier build's (v2, pre-MVP) term set; some terms overlap with what's shipped in `_MVP-BUILD` lesson files, others (rubūbiyyah, ulūhiyyah, al-asmāʾ wa'ṣ-ṣifāt, bidʿah, ṭāghūt, ijmāʿ) may not all be in the current shipped 19 files — worth a term-by-term diff against the live app if a full glossary is being assembled.

### 6b. Hadith gradings — the richest new find, from the original curriculum source
`_ORGANIZED/05_Build-Handoffs/build-v2-transfer/aqeedah-unit1-atoms-v2.md` (category a — atomized directly from the Zad Academy print textbook, **status: DRAFT — none approved**, "every reference is transcribed from the book and must be verified against the mushaf/hadith collections before use"). Verbatim graded-hadith citations (line refs from that file):
- L169: "Abu Rafi hadith (four [collections] except an-Nasai; **sahih per Ibn Hibban**)"
- L169: "al-Miqdam hadith (Ahmad; **sahih per al-Arna'ut**)"
- L183: "the report that the ummah will not unite upon misguidance (at-Tirmidhi, from Ibn Umar; **graded sahih by al-Albani**)"
- L183: "the 73-sects report (Muawiyah ibn Abi Sufyan; Ahmad & at-Tirmidhi, **graded hasan by al-Albani**)"
- L232: "The Prophet warned against using parts of scripture to contradict other parts (report of Abdullah ibn Amr; Ahmad, **graded sahih by al-Arna'ut**)"
- L264: "best-generations report (Imran ibn Husayn; al-Bukhari & Muslim)" and "al-Irbad hadith" (Sunnah/rightly-guided caliphs charge)
- L135 (U1-08): "the hadith that every child is born upon the fitrah… (**al-Bukhari & Muslim**, Abu Hurayrah); and the report of Iyad ibn Himar (**Muslim**) that people were created inclined to the truth (hunafa)."
- L23 (U1-01): "the hadith of Jibril (**Muslim**, from Umar ibn al-Khattab): belief in Allah, His angels, Books, Messengers, the Last Day, and the decree, good and bad."

Important: these are the atom-doc's own **paraphrased summaries of hadith content with grading attributions**, not verbatim hadith translations (the doc explicitly states: "No verse translations reproduced — meanings paraphrased, only surah:ayah pointers kept" — same rule applied to hadith). So they are usable as **grading/sourcing metadata** (which hadith, which grader, which collection) but NOT as verbatim quotable hadith text — the actual wording would still need to be pulled from Sunnah.com per the locked scripture-text policy (G1 section above).

Same pattern continues in `aqeedah-unit2/3/4-atoms-v2.md` (`_ORGANIZED/05_Build-Handoffs/build-v3-melusi_LATEST/`) — all DRAFT, all "content is Zad's; delivery framing is Awba's engine applied on top," all explicitly requiring scholar sign-off before use. Unit 2 doc even notes its refs were transcribed "via OCR of the image-based PDF, cross-checked on the page" — an extra fidelity caveat.

### 6c. The locked scripture-sourcing policy itself (methodology, reusable as-is)
`_BUILDS/00_PROGRESS_LOG.md` lines 30-39 (repeated verbatim across every dated archive) — the full policy is quoted in G1 above. Key operational fact for future sourcing: **quranapi.pages.dev** (`/api/{surah}/{ayah}.json`, `english` field) is Josh's verified-working route to exact Khattab Clear Quran text, used because quran.com's public API dropped Clear Quran licensing.

### 6d. Full atomized curriculum (65 atoms across 4 units) — status and unit summaries
Confirmed exactly 4 unit-atom docs exist (in two locations, `build-v2-transfer` has only Unit 1; `build-v3-melusi_LATEST` has Units 2-4 — together the complete "4 units, 65 atoms" referenced in `_BUILDS/00_PROGRESS_LOG.md` line 26: "Content source of truth for all four modules: `aqeedah-unit1-atoms-v2.md` (17 atoms, all `draft — none approved`, behind the scholar gate)."):
- Unit 1 (17 atoms, U1-01…U1-17): Foundations — definition, other names for aqeedah, why it matters (4 atoms), distinguishing features, fitrah, the three sources (Quran/Sunnah/ijmāʿ), role of reason, five method-of-verification principles. **Two atoms flagged high-sensitivity for brand fit: U1-15 (names Sufis as example of deviation), U1-16 (names "modernists/progressives/liberals" as deviant) — both explicitly flagged "scholar review the framing (tone/brand fit)" and "highly sensitive for a UK/US audience."**
- Unit 2: "Drifting away from sound aqeedah" — Part A (U2-01…U2-09, nine causes: ignorance, following promoters of evil, whims/desires, exaggeration about the righteous, blind following, paths of misguidance, heedlessness, arrogance, following Shaytan) + Part B (U2-10…U2-15, six means of protection).
- Unit 3: "Tawhid" — Part A definition/importance (U3-01…U3-10), Part B impact on the individual (U3-11…U3-13), Part C "Tawhid is Islam, religion of all messengers" (U3-14…U3-16).
- Unit 4: "The pillars of Tawhid" — Part A the two pillars, negation & affirmation (U4-01…U4-03), Part B categories of Tawhid with rubūbiyyah in depth (U4-04…U4-13; ulūhiyyah and al-asmāʾ wa'ṣ-ṣifāt named but not detailed), Part C non-textual evidence for Allah's existence (U4-14…U4-17).

All four docs carry identical provenance: **Source = *Aqeedah (Islamic Creed) Level 1*, Zad Academy Series (Zad Group, 1st ed. 1446/2024)**, status **DRAFT — none approved**, policy "faithful to source, flagged for scholar" (polemical/method-specific framing preserved and tagged, not removed). This is category (a) — the actual original curriculum, one level removed (paraphrased from a real published Islamic studies textbook, not AI-invented) — the highest-authority content source in the whole folder for course material, but explicitly unapproved/unverified pending scholar review.

A duplicate `aqeedah-unit2-atoms-v2 (1).md` exists in `unorganised (me)/Awba_Leaning_Build_V02_05072026/files for melusi - build v3/` — not diffed line-by-line, but file size/header identical to the canonical copy; treat as a redundant copy, not a variant.

### 6e. Fiqh atom draft referenced but not found
`_BUILDS/_archive/2026-07-10_0844/awba-build-compartments-v4.md` line 10 references "An early `fiqh-unit1-atoms-v2.md` draft" as existing "on hold." **This file was searched for by name across the entire collection and does not exist here.** Flag as a possible missing file (may exist only in Josh's original source, not in this Downloads copy) — worth asking the owner directly rather than assuming it's lost.

### 6f. Competitive/design teardown documents (category c-adjacent — NOT content, but shapes what "good" looks like)
`_ORGANIZED/05_Build-Handoffs/build-v2-transfer/jibreel_lesson_teardown_v3.md` (+ duplicate in `unorganised (me)/...`) — a teardown of a *competitor* app ("Jibreel," a Duolingo-style fard-ʿayn app, 1M+ users), used purely for UX/pedagogy pattern-mining. Contains no original religious content of its own — references to hadith/verse there are about the competitor's display patterns, not usable text. Correctly excluded from G1-G6 content, noted here only so it isn't mistaken for a content source.

### 6g. Icon/illustration kit (non-textual, for completeness)
`_ORGANIZED/03_Branding/icon files/` — 20 SVG icons including `14-hands-dua.svg` (dua-gesture icon, no text), `13-kaaba.svg`, `11-quran-stand.svg`, `09-prostration.svg`, `10-standing-prayer.svg`, `16-qibla-compass.svg`, `18-ramadan-night.svg`, `20-ramadan-calendar.svg`. Purely visual brand assets, already ported into the shipped engine as `AW.KIT` (confirmed via `_MVP-BUILD/shared/awba-engine.js`).

---

## Full religious-content inventory (everything else found, for completeness)

| Item | Location | Category | Notes |
|---|---|---|---|
| Scripture-sourcing locked policy | `_BUILDS/00_PROGRESS_LOG.md` L30-39 (+ every dated archive copy) | b | See G1/G6c |
| 7 shipped daily-ayah verses | `_MVP-BUILD/learn.html` L152-161 (+ all archived learn.html, identical) | b | See G4 |
| ~30 lesson-body scripture citations, verbatim Clear Quran + Sunnah.com hadith | `_MVP-BUILD/lessons/*.html`, `_MVP-BUILD/reviews/*.html` | b | Already shipped; not re-inventoried per instructions; summarized in `_BUILDS/00_PROGRESS_LOG.md` changelog entries (e.g. L82, L91, L100) |
| 65-atom Aqeedah curriculum (4 units) | `_ORGANIZED/05_Build-Handoffs/build-v2-transfer/aqeedah-unit1-atoms-v2.md` + `build-v3-melusi_LATEST/aqeedah-unit{2,3,4}-atoms-v2.md` | a | DRAFT, none approved; source = Zad Academy *Aqeedah (Islamic Creed) Level 1* textbook |
| Term glossary (Arabic + transliteration + gloss), ~16 terms | `_ORGANIZED/05_Build-Handoffs/build-v2-transfer/awba-handoff.md` (+3 exact duplicates) | b | Earlier v2 build, pre-MVP; some terms may not be in current shipped app |
| Hadith gradings (attribution + grader) | Same atom docs as above | a | Paraphrased summaries with grading metadata only, not verbatim hadith text |
| Fiqh/Seerah/Qur'an course content | — | — | ABSENT everywhere; only placeholders + sourcing notes (Zad course books "failed upload," *Ascent to Felicity* Hanafi fiqh text named, *Interactions of the Greatest Leader* Seerah source named) |
| `fiqh-unit1-atoms-v2.md` | Referenced in `awba-build-compartments-v4.md` L10 | — | File does not exist in this collection — possible gap in what was copied to Downloads |
| Competitor teardown ("Jibreel") | `jibreel_lesson_teardown_v3.md` | c (non-content) | UX pattern-mining only, no original religious text |
| Brand name etymology (Awba/أوبة) | `awba-handoff.md` L24 | b | Not scripture but a verified Arabic root gloss, could feed a glossary |
| Icon kit | `_ORGANIZED/03_Branding/icon files/*.svg` | b | Visual only |
| Ethos/architecture docs mentioning a future "knowledge graph" of duas/ayat/tafsir/seerah/hadith (aspirational, not built) | `_ORGANIZED/06_Working-Docs/Engine-Database-and-Algorithm-Working-Doc-v0.1.md`, `Sukun-Workshop1-Learning-Engine-and-Corpus-Findings-v0_1.md`, `02_Ethos/Sukun-Master-Decision-Ethos-and-Formation-Philosophy.md` | b | Design vision only, zero actual du'a/hadith/seerah node data exists yet |

**Bottom line:** This collection's single highest-value asset for future gap-filling is the **4-unit / 65-atom Aqeedah curriculum** (category a, Zad Academy-sourced, DRAFT/unapproved) — rich in hadith gradings and structured teaching points, but explicitly not verbatim-quotable scripture and not yet scholar-approved. For G1 (14:24), G2 (Arabic unit names), G3 (sourced closing du'a), and G5 (Fiqh/Seerah/Qur'an real content), this collection is a clean, confirmed **absent** — none of it exists here and must be sourced from elsewhere.
