# C6 — Content-mining report: ~/Desktop/Projects/Awba

Collection: 500 files (node_modules excluded — there were none; one `.git` in `site/` excluded from content search). Skim-prioritized by filename; all markdown "content-shaped" docs read in full; HTML screens grepped + spot-read; one PDF (`Awba-Business-Plan.pdf`) NOT opened (out of budget — filename suggests business content only, low religious-content likelihood, flagging as unread rather than silently skipped).

**Collection shape:** this is a *design/business* bundle, not a raw-source bundle. It contains: (1) a genuine original curriculum sub-bundle (`awba-lovable/source/pedagogy/`) — atomized Aqeedah Level-1 content transcribed from a named external textbook — labelled **(a)**; (2) a "content pack" that re-renders those atoms into screen copy for a Lovable build — labelled **(a/b)** since it's a faithful re-transcription, not fresh invention; (3) ~90 static HTML screen mockups (`awba-lovable/source/awba-v3-build/screens/`) and a `stitch-creative-freedom/` gallery of PNG screenshots — labelled **(c)**, AI/design-tool output, religious text in these is illustrative only and explicitly flagged by the project's own docs as sometimes containing "non-verified test content"; (4) a business-plan HTML deck (`business-plan-source/business-plan.html`) — labelled **(c)**, AI-assisted investor-deck design artifact, NOT a content-pipeline document.

---

## G1 — Quran 14:24 (Ibrahim), Clear Quran / Khattab, verbatim + Arabic

**Status: PARTIAL — found, but not verified as verbatim Khattab, and the project's own research says Khattab's translation is NOT licensed.**

Found in `/Users/theshumba/Desktop/Projects/Awba/business-plan-source/business-plan.html`, lines 740–743 (closing section of the business plan deck):

```html
<div class="scripture">كَلِمَةٌ طَيِّبَةٌ كَشَجَرَةٍ طَيِّبَةٍ</div>
<div class="translit">kalimatun ṭayyibatun ka-shajaratin ṭayyibah</div>
<div class="translation">"A good word is like a good tree — its root firm, its branches in the sky."</div>
<div class="cite">Qur'an · Ibrāhīm 14 : 24</div>
```

Caveats — read before reusing:
- **Provenance = (c).** This is a business-plan design HTML (the closing "scripture" slide of an investor deck), not part of the pedagogy/content-pipeline bundle. No translator is cited (just "Qur'an").
- **Only the first clause of the ayah** is given — Arabic, transliteration and English all stop at "its branches [reach] the sky." The ayah continues ("...yielding its fruit all seasons by the will of its Lord...") — not present anywhere in this collection.
- **The English wording does not match Dr. Mustafa Khattab's Clear Quran** ("Do you not see how Allah compares a good word to a good tree? Its root is firm and its branches reach the sky"). This looks like a shortened paraphrase built for the deck's design, not a byte-verbatim translation import.
- **Directly relevant licensing finding**, from this same collection's own research (`research/interim-sources-full-swarm-output.json`, line 60, and `research/interim-sources-verdict.md` lines 7/35): the project's own commissioned research concludes **Dr. Mustafa Khattab's Clear Quran is copyright-locked** ("Furqaan Institute of Quranic Education has the exclusive license... THE CLEAR QURAN®"; QUL shows it as "© copyrighted" with no download button), while **Saheeh International, via QuranEnc.com, is the one translation route the research verdict calls "SOLVED"** — explicit written permission to reproduce verbatim, no commercial restriction, with named conditions (attribute publisher + QuranEnc, state version, keep info block, notify errata). **Net: this collection contains no cleared Khattab text for 14:24, and the project's own research recommends Saheeh International, not Khattab, as the licensed route.** Whoever fills G1 should treat the business-plan snippet as inspiration/placeholder only, not a source, and pull the full verse from QuranEnc's Saheeh International feed instead.
- The pedagogy atom files (unit2/3/4 — see below) reference **Ibrahim 14:22, 14:27, 14:35** for other purposes but never 14:24, and by explicit house policy (see G5/G6 below) never reproduce verse translations at all — only paraphrase + surah:ayah pointers. So no other candidate 14:24 text exists in this collection.

---

## G2 — Arabic chapter/unit terms for the 4 course units

**Status: ABSENT.**

The 4 units are named only in English throughout every document in this collection:
- Unit 1 — "Foundations" (content itself not in this bundle — see below)
- Unit 2 — "Drifting away from sound aqeedah" (`aqeedah-unit2-atoms-v2.md`)
- Unit 3 — "Tawhid" (`aqeedah-unit3-atoms-v2.md`)
- Unit 4 — "The pillars of Tawhid" (`aqeedah-unit4-atoms-v2.md`)

No Arabic-script chapter/unit title, no transliterated chapter title, appears anywhere — not in the atom files, not in `07-CONTENT-PACK.md`, not in the compartments map, not in the pedagogy master, not in any screen HTML. `awba-build-compartments-v4.md` (line 5) explicitly notes a prior **v3 compartments doc "added a full glossary" but "isn't in this bundle"** — that missing v3 file is the most likely place such Arabic unit names would have lived, and it is not present here. Also absent from this bundle: `aqeedah-unit1-atoms-v2.md` (Unit 1's own atom file — referenced constantly but not included), `awba-handoff.md`, `awba-app.html`, `awba-lesson-1b-v2.html`. Their absence is noted explicitly by the master handoff's own file manifest (`00_AWBA_MASTER_HANDOFF_v2.md` §B10) as "not in this bundle."

---

## G3 — Default closing du'a with source

**Status: ABSENT.**

No du'a text (Arabic, transliteration, or translation), no "closing supplication" screen copy, and no sunnah.com/hadith-style citation for a supplication was found anywhere in this collection. Checked specifically:
- `awba-lovable/source/awba-v3-build/screens/C1-bismillah.html` — only renders "Bismillah" as a lesson-opener ritual (Arabic "بِسْمِ اللَّٰه" + "In the name of Allah, the Most Gracious"); no closing du'a counterpart with content — it's a design mockup, category (c).
- `screen-shots/F5-duas.png` and `screen-shots/E9-dua.png` exist as **screenshots only** (PNG images, not source text) — visual mockups from an earlier app iteration; their on-screen du'a text (if any) is not extractable/verifiable and not present as source markdown/HTML anywhere in this collection.
- `07-CONTENT-PACK.md` §0 "Flow-close card" strings are explicitly **non-doctrinal delivery copy** ("You came back to it. That's the whole practice.") — not a du'a, and the doc is explicit that this is Awba's own engine text, not scripture.
- No file in `research/` addresses du'a sourcing/licensing at all (their research focus was Quran translations, tafsir, and hadith corpora — see G4/G6).

---

## G4 — Additional verified daily-ayah candidates (verse pool beyond the shipped 7)

**Status: PARTIAL — extensive surah:ayah reference pool exists, but NONE come with a translated verse text (house policy forbids reproducing translations); usable only as reference pointers, not verbatim text.**

The Aqeedah atom files (`aqeedah-unit{2,3,4}-atoms-v2.md`, `07-CONTENT-PACK.md`, `AWBA-ALL-IN-ONE.md`) cite **~90 distinct Quran references** across Units 2–4 alone (Unit 1's atoms are absent from this bundle). Every atom's `refs` field is a verbatim-transcribed surah:ayah pointer, but the project's own non-negotiable policy (stated identically in `00_AWBA_MASTER_HANDOFF_v2.md` §B0.3, `aqeedah-unit2-atoms-v2.md` header, and `awba-build-compartments-v4.md` line 14) is: **"No verse translations reproduced — meanings paraphrased, only surah:ayah and hadith pointers kept."** So this collection deliberately contains zero verbatim translated ayah text beyond the one business-plan fragment in G1.

A non-exhaustive sample of the reference pool (surah:ayah only, no translation attached — would need pulling from a cleared translation source like QuranEnc/Saheeh International to become usable daily-ayah candidates):
al-Baqarah 2:21, 2:34, 2:107, 2:130–132, 2:131, 2:135, 2:136, 2:155–156, 2:163, 2:164, 2:165, 2:256 · Aal Imran 3:7, 3:19, 3:26, 3:49, 3:52, 3:67, 3:85, 3:126, 3:151 · an-Nisa 4:36, 4:116, 4:171 · al-Ma'idah 5:14, 5:28, 5:48, 5:72, 5:77, 5:82, 5:110 · al-An'am 6:79, 6:153 · al-A'raf 7:3, 7:16–17, 7:23, 7:54, 7:126, 7:178, 7:179 · Yunus 10:3, 10:21, 10:31, 10:34, 10:36, 10:72, 10:75, 10:84 · Hud 11:26, 11:56 · Yusuf 12:101, 12:105 · Ibrahim 14:22, 14:27, 14:35 · al-Hijr 15:39, 15:42 · an-Nahl 16:20, 16:36, 16:43–44, 16:97, 16:99, 16:108, 16:123 · al-Isra 17:46, 17:67, 17:111 · Ta-Ha 20:85 · al-Anbiya 21:76, 21:87–88, 21:101–103 · al-Hajj 22:73 · al-Mu'minun 23:14, 23:88–89 · an-Nur 24:55 · al-Furqan (none found) · ash-Shu'ara 26:63 · an-Naml 27:38, 27:44, 27:62 · al-Qasas 28:41, 28:50, 28:56 · al-Ankabut 29:17, 29:61, 29:65 · ar-Rum 30:27, 30:30 · Luqman 31:25 · as-Sajdah 32:5 · Saba (none) · Fatir 35:2, 35:6, 35:27–28 · Ya-Seen 36:83 · as-Saffat 37:75 · Saad 38:26, 38:82–83 · az-Zumar 39:65–66 · Ghafir 40:12, 40:40 · Fussilat 41:15, 41:36 · ash-Shura (none) · az-Zukhruf 43:22, 43:26–27 · ad-Dukhan 44:8 · al-Jathiyah 45:18, 45:23 · Muhammad 47:14, 47:19 · al-Fath 48:11 · al-Hujurat (none) · Qaf (none) · adh-Dhariyat 51:56 · at-Tur 52:35–36 · an-Najm 53:28 · al-Qamar 54:1–2, 54:10–11 · al-Mulk 67:1–2 · al-Bayyinah 98:6 · al-Anfal 8:2, 8:9.

Also present: hadith pointers with narrator + collection + grading (e.g. "Muadh ibn Jabal (Abu Dawud — sahih al-Albani)"; "Ibn Mas'ud (Ahmad — sahih al-Arna'ut)"; "bitaqah hadith (Abdullah ibn Amr; at-Tirmidhi — hasan)"; multiple "(al-Bukhari & Muslim)" / "(agreed upon)"). These are graded, sourced hadith **pointers** in the same no-translation-reproduced regime — useful as a research map for where to pull real hadith text from a cleared corpus, not as ready-to-ship content.

---

## G5 — Real course content for Fiqh / Seerah / Qur'an tracks

**Status: ABSENT (Fiqh explicitly parked by the owner's own team; Seerah/Qur'an-track never started).**

`00_AWBA_MASTER_HANDOFF_v2.md` states directly (§A5, §A7, §B1, §B11):
> "**Fiqh book — parked.** The source PDF is a low-resolution scan with no text layer, so it can't be atomized reliably yet."
> "Copyright. The Zad source book is © all rights reserved. We paraphrase meanings + cite exact references; we never reproduce its text or a copyrighted translation."

`awba-build-compartments-v4.md` line 10 corroborates: "An early `fiqh-unit1-atoms-v2.md` draft exists but is on hold with the rest" — that draft file itself is **not present** in this collection (checked; absent).

No Seerah content, atoms, or curriculum plan exists anywhere in this collection. No dedicated "Qur'an track" (memorization/recitation curriculum, as opposed to verse-citation-as-evidence) exists either — Quran references appear only as supporting citations inside the Aqeedah atoms (see G4), never as a standalone Qur'an-study curriculum.

Everything that IS built is **Aqeedah Level 1 only**: Units 1–4, 65 atoms total (U1 17 · U2 15 · U3 16 · U4 17), sourced from *Aqeedah (Islamic Creed) Level 1*, Zad Group, 1st ed. 1446/2024 — but **only Units 2–4 (48 atoms) are physically present in this collection**; Unit 1's 17-atom file is referenced everywhere but not included in this bundle.

---

## G6 — Other reusable religious material found

**Status: FOUND — glossary terms (Arabic + transliteration + meaning), honorific-rendering convention, verified-content policy/schema, sensitive-content flag list.**

### Glossary — term glosses (highest-value find for this gap)
`07-CONTENT-PACK.md` §2b, labelled explicitly "**the ONLY gloss source**," transcribed "character-for-character from the source lesson engine's TERMS map" (a screen-render table with Arabic script, transliteration, English word, meaning, and usage context):

| key | Arabic | translit | word | meaning | context |
|---|---|---|---|---|---|
| taghut | طَاغُوت | ṭāghūt | false god | Any false object of worship — anyone or anything set up as a god beside Allah. | It covers idols, but also any authority obeyed in place of Allah. Rejecting ṭāghūt is the other half of believing in Allah. |
| shirk | شِرْك | shirk | associating partners | Associating partners with Allah — setting up anything as His equal in worship. | The opposite of Tawhid, and the one error the Qur'an singles out as emptying a deed of all its reward. |
| aqeedah | عَقِيدَة | ʿaqīdah | creed | The settled, certain beliefs a person's heart is bound to. | From a root meaning to tie or bind firmly — not a loose opinion, but a conviction fastened in the heart. |
| iman | إِيمَان | īmān | faith | Faith — belief held with certainty in the heart, spoken, and shown in action. | More than agreement: it's a trust that turns up in what a person actually does. |

The doc is explicit these four are **"the entire gloss corpus"** — any other term (fitrah, rububiyah, tawhid itself) has no gloss and must render `[slot empty — API-ready]`, never be filled from memory.

A second, wider term list (transliteration + short meaning, no Arabic script, no context sentence) is in `awba-build-compartments-v4.md` lines 154–163 ("Domain terms used in content *(as defined in our own atoms/materials; paraphrased, scholar-pending)*"):
ʿaqīdah, īmān, tawḥīd, shirk, ṭāghūt, fiṭrah, bidʿah, ijmāʿ, sunnah, rubūbiyyah/ulūhiyyah/al-asmāʾ wa'ṣ-ṣifāt — each with a one-line paraphrased definition, explicitly marked "scholar-pending."

A third, decorative single-word set appears in the **marketing site** `site/index.html` (calligraphy animation captions) — provenance (c)/marketing, lighter-weight but usable as simple vocabulary: niyyah نية "intention — the quiet intent that turns a habit into worship"; tawbah توبة "repentance"; rujue رجوع "return"; rahmah رحمة "mercy"; sakinah, qasd, dhikr also feature (poster filenames also list fajr, nur, qalb, sabr, salah, shukr, quran — these appear only as image filenames in `site/posters/`, no accompanying text confirmed).

### Honorific / citation conventions (verified house style, consistent across every doc)
- **"The Prophet's salutation ﷺ always follows the Prophet's name,"** rendered as the Arabic glyph inline, never "PBUH." If the glyph can't render, spell "peace be upon him" in full. Same principle for "Allah"/"SWT" — prefer full form over acronym. (`Awba-Master-Brand-Voice-and-Copywriting-Guide-v1.0.md` line 166; identically restated in `02-BRAND-VOICE-AND-CONTENT-LAWS.md` lines 145/158–159, `03-DESIGN-SYSTEM.md` line 222, `AWBA-ALL-IN-ONE.md` lines 348/361–362, `DESIGN-SOT.md` lines 111/636.)
- **Reference format:** middot-joined, e.g. `Qur'an 6:82 · al-Anʿām`; diacritics kept on transliterations (ʿaqīdah, ṭāghūt, īmān, sharḥ, tafsīr).
- **Banned copy patterns** (`02-BRAND-VOICE-AND-CONTENT-LAWS.md` line 145, verbatim): "streak/combo/level-up/leaderboard language on worship · manufactured urgency... · 'you missed / you failed'... · bare Latin-alphabet honorific acronyms (PBUH, SWT)... · **invented or paraphrased-from-memory scripture** · emoji anywhere near devotional content... · any joke, pun, or irony directed at the religion..."

### Verified-content policy / schema (governs everything above — copy this rule forward)
Stated identically across `00_AWBA_MASTER_HANDOFF_v2.md`, all three atom files, and `awba-build-compartments-v4.md`:
> "Invent nothing. No fabricated verses, hadith, rulings, or references. If unsure of an exact reference, flag it — never fill it from memory."
> "Scripture only from the verified schema, or from Quran.com / Sunnah.com tagged **unverified · pending review**. Paraphrase scripture, never reproduce a translation."
Two-tier tagging convention: verified content renders normally; unverified enrichment (only ever pulled from Quran.com/Sunnah.com, paraphrased) renders in a distinct blue with an "unverified · pending review" pill.

### Sensitive-content flag list (do-not-ship-without-scholar-review atoms — useful if any Unit 2–4 atom text is reused)
U1-15 (names Sufis) · U1-16 (names modernists/progressives/liberals) · U2-02 (names "extreme Rafidis," specific charges) · U2-05 (names Sufis + Rafidis as blind-following examples) · U2-04 (grave-worship comparative framing) · U3-13 (anecdote ridiculing cow-veneration) · U3-16 ("three heavenly religions" rejected — interfaith sensitivity) · **U4-03 — marked "DRAFT — HOLD," excluded from all screen-copy packs, a freedom-of-belief critique flagged as "highly sensitive... reads as opposing freedom of religion." Do not surface.**

### Sensitive licensing intel relevant to any future content sourcing (from `research/`)
`research/interim-sources-full-swarm-output.json` and `research/interim-sources-verdict.md`/`ummahapi-verdict.md`/`perplexity-cross-check.md`/`CONSOLIDATED-REPO-RESEARCH.md` contain a full commissioned licensing audit of Quran-translation/tafsir/hadith sourcing options (QUL/Tarteel, Tanzil, QuranEnc, sunnah.com, fawazahmed0, HadeethEnc, etc.). Headline verdicts: **Saheeh International via QuranEnc.com is cleared** for commercial reuse (verbatim, with 7 stated conditions); **Khattab's Clear Quran and Tanzil-hosted translations are NOT cleared** (non-commercial-only or exclusively licensed); English hadith translation is **largely uncleared** (Darussalam-edition wording embeds in most "open" hadith JSON repos, including fawazahmed0/sunnah.com-derived sources) — only Arabic hadith matn + gradings + HadeethEnc's own curated English subset are clean today. This is directly actionable for whoever eventually sources G3/G4 verbatim text.

---

## Full religious-content inventory (everything else found, for completeness)

- **`awba-lovable/source/pedagogy/00_AWBA_MASTER_HANDOFF_v2.md`** (a) — project thesis, non-negotiables, full status snapshot, file manifest confirming what is/isn't in this bundle. Confirms source book = *Aqeedah (Islamic Creed) Level 1*, Zad Group, 1st ed. 1446/2024, © all rights reserved.
- **`awba-lovable/source/pedagogy/aqeedah-unit2-atoms-v2.md`** (a) — Unit 2, 15 atoms, "Drifting away from sound aqeedah." Full paraphrase+refs per atom, sensitive-atom flags, quiz seeds. DRAFT — none approved.
- **`awba-lovable/source/pedagogy/aqeedah-unit3-atoms-v2.md`** (a) — Unit 3, 16 atoms, "Tawhid." Same schema.
- **`awba-lovable/source/pedagogy/aqeedah-unit4-atoms-v2.md`** (a) — Unit 4, 17 atoms, "The pillars of Tawhid." Includes the HOLD atom U4-03.
- **`awba-lovable/source/pedagogy/AWBA_Research_and_Pedagogy_Master.md`** (a) — pedagogy engine (not primarily religious content; component/assembly design, evidence-graded learning-science claims — skimmed, no additional scripture/du'a/glossary beyond what's captured above).
- **`awba-lovable/source/pedagogy/awba-build-compartments-v4.md`** (a) — compartment map + reconstructed glossary (see G6); explicitly flags its own glossary as a reconstruction, not the lost "v3" original.
- **`awba-lovable/07-CONTENT-PACK.md`** and its duplicate **`awba-lovable/source/awba-v3-build/specs/CONTENT-PACK.md`** (a/b) — 836-line render-ready pack: full atom index for Units 2–4 with sensitivity flags, 4 demo lesson flows (A/B/C/D) with full screen copy, the term-gloss table (G6), and the path/module map (confirms no Arabic unit names — see G2).
- **`awba-lovable/AWBA-ALL-IN-ONE.md`** (a/b) — appears to be a concatenation of the above docs into one file; spot-checked, matches CONTENT-PACK.md content verbatim where compared.
- **`awba-lovable/02-BRAND-VOICE-AND-CONTENT-LAWS.md`**, **`Awba-Master-Brand-Voice-and-Copywriting-Guide-v1.0.md`** (its duplicate in `awba-lovable/source/`) (a) — house style/content law docs; source of the honorific convention and banned-pattern list (G6).
- **`awba-lovable/03-DESIGN-SYSTEM.md`**, **`awba-lovable/source/awba-v3-build/system/DESIGN-SOT.md`** (a/b) — design tokens; each restates the ﷺ/diacritics/ref-format convention.
- **`awba-lovable/source/awba-v3-build/specs/DIGEST-lesson-engine.md`** (b) — the source-of-the-source for the term-gloss table; also contains illustrative (non-verified, design-mockup) verse/hadith snippets used to demo the lesson engine UI — explicitly NOT verified content, do not reuse as sourced scripture.
- **`awba-lovable/source/awba-v3-build/screens/*.html`** (~90 files) (c) — static HTML mockups (Stitch/Lovable-era build). Screens of religious interest: `C1-bismillah.html` (ritual opener, no du'a), `C12-verse-tafsir.html`, `C13-hadith-pills.html`, `F4-narrative-verse.html`, `H1-about-content.html`, `H2-verified-states.html`, `H3-sources-drawer.html`, `H4-scholar-gate.html`, `H6-glossary.html` — these render UI patterns (a glossary sheet, a sources drawer, a scholar-review-gate state) but the actual text inside them is placeholder/demo content, not verified source — treat as UI-pattern reference only, never as content source.
- **`stitch-creative-freedom/gallery.html`** + `screens/*.png` (c) — pure screenshots, no extractable text; not opened for OCR (out of scope — read-only skim per task instructions, and these are visual references, not text sources).
- **`business-plan-source/business-plan.html`** (c) — see G1; also contains general business/brand content, no other scripture found in a full grep of the file.
- **`research/*.md` + `research/interim-sources-full-swarm-output.json`** (a — genuine owner-commissioned research, not content itself) — licensing/sourcing intelligence for Quran translations, tafsir, hadith corpora, and word-by-word data (QUL/Tarteel, Tanzil, QuranEnc, sunnah.com, fawazahmed0, HadeethEnc, asellam Hisn al-Muslim, IIC duas). Directly informs future G3/G4 sourcing — see G6 above for the headline verdicts. Also flags (in `interim-sources-full-swarm-output.json`, "GAP 5") that a naive 99-Names-of-Allah feature building on the popular Tirmidhi 3507 hadith would embarrassingly self-destruct under the project's own "show the grading" rule, since that hadith is graded Da'if by three graders — worth flagging to whoever builds any "Names of Allah" feature.
- **`site/index.html`**, **`site/posters/*.png`**, **`site/awba-words.pdf`**, **`site/awba-stickers.zip`** (c, marketing) — decorative single Arabic-word branding (niyyah, tawbah, rujue, rahmah, sakinah, qasd, dhikr, fajr, nur, qalb, sabr, salah, shukr, quran per filenames); `awba-words.pdf` and `awba-stickers.zip` not opened (binary/archive, out of grep reach, low expected yield for a marketing asset — flagging as unread).
- **`Awba-Business-Plan.pdf`** — NOT opened (binary, business-plan filename, deprioritized versus the many higher-yield markdown/HTML content docs found; flagging as unread rather than silently skipped).
- No `.json`/database seed files with structured religious content were found anywhere in this collection (only the `interim-sources-full-swarm-output.json` research artifact, which is about *where to get* content, not content itself).
