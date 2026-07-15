# C2 — Content-Mining Report: `/Users/theshumba/Downloads/muslim app`

**Collection:** the original Awba/Sukun concept, ethos, engine, audience, market-research, and brand-kit
documents (pre-dates the "Josh gamified MVP" build and the awba-gen4 codebase). 16 actual files (not 23 —
see inventory note at the end) read in full: 11 Markdown, 2 PDF (extracted via `pdftotext -layout`), 1
extensionless UTF-8 text file, plus 2 `.DS_Store`/empty dirs with no content.

**Overall provenance verdict: (a) — these are the owner's/Josh's own original strategy, ethos, and
architecture documents.** They are high-authority for *decisions, rules, taxonomy, and governance* — but
they are **almost entirely devoid of actual scripture/hadith/du'a TEXT**. Every one of the four working docs
that governs religious substance contains an explicit, repeated self-disclaimer that any religious-sounding
example inside it is **illustrative/placeholder, not verified**, and must not ship until a scholar anchor
(F-3) signs off. This collection is a *constitution*, not a *corpus*.

---

## GAP-BY-GAP FINDINGS

### G1 — Qur'an 14:24 ("good word … like a good tree"), Clear Quran/Khattab, with Arabic
**ABSENT.** No occurrence of "14:24", "Ibrahim"/"Ibrāhīm" (as a surah reference), "good tree", "good word",
or any Arabic verse text anywhere in the collection (full ripgrep sweep across all MD/text files + pdftotext
output of both brand-kit PDFs and the Formation Philosophy PDF — zero hits). The phrase "Clear Quran" itself
appears exactly once, naming it as an available *translation option inside the Quran Foundation API*, not
as quoted text:

> "Quran Foundation (quran.com) Content API v4. ... Provides: verse text, chapter data, multiple vetted
> translations (**including Clear Quran**), Tafsir Ibn Kathir, word-by-word morphology and transliteration,
> audio, and search."
> — `working docs (internal/Sukun-Workshop1-Learning-Engine-and-Corpus-Findings-v0_1.md`, §1.1, line 24

This confirms Khattab/Clear Quran was the **intended source API**, but no verse — 14:24 or otherwise — was
ever pulled into these docs. (b)/(c) not applicable; this is doc-type (a), simply empty on this point.

### G2 — Verified Arabic chapter/unit terms for the 4 course units
**ABSENT**, and structurally can't be present: this collection has no "4 units" concept at all. What it does
have is a **six-item discipline taxonomy** (English transliteration only, never Arabic script):
`tarbiyah, fiqh, tafsir, aqeedah, seerah, hadith` — explicitly named as "not an invented taxonomy... Zad
Academy's own semester structure" (`Sukun-Workshop1...md`, §2, line 62; also `HANDOFF-PROMPT.md` line 13).
A full ripgrep for Arabic-script equivalents (`عقيدة`, `تربية`, `تفسير`, `فقه`, `سيرة`, `حديث`, `قرآن`,
`توحيد`) across the entire collection returned **zero matches**. The only Arabic script anywhere in the
collection is (i) product/company naming-brainstorm words (`NAME-SHORTLIST-verified.md` — رفقة, مؤنسة, أوبة,
etc., meaning "companionship/return", nothing to do with course chapters) and (ii) two brand-kit typography
specimens using **بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ · الوَدُود** (Bismillah + the Name Al-Wadūd) purely
as an Amiri-font rendering sample, not a chapter/unit label. No usable G2 material here.

### G3 — Default closing du'a with source, for lesson-close screen
**ABSENT.** No du'a text of any kind is quoted anywhere. "Dua" is discussed only as a **node type in the
knowledge graph** ("duas" as a category alongside ayat/hadith/tafsir/Seerah moments) and as a **product
surface** ("the dua journal", "need-based dua search") — never with actual supplication text or a citation.
The single closest artifact is a *hadith-style* mockup in the Brand Kit's "Reason block" component (not a
du'a): `branding documents/old/Sukun-Brand-Kit-v1.1-Internal.pdf`, §05 (pdftotext line ~205):

> "**WHY THIS MATTERS** — The Prophet ﷺ said the one who prays Maghrib on time meets the dusk with a settled
> heart."

This is critically important as a **negative finding**: the *next* brand-kit revision explicitly retracted
this exact line. `branding documents/Sukun-Brand-Kit-v1_2-Internal_1.pdf`, §00 changelog (pdftotext line
~506):

> "FLAGGED — The Reason block's example hadith text marked as an illustrative placeholder, not a verified
> citation — it was unsourced in v1.1." ... "ADDED — A boundary rule: no unsourced scripture ships, even in
> drafts, without being marked illustrative."

**Do not reuse the v1.1 "Maghrib" hadith line anywhere in the shipped app — the owner's own later document
flags it as unsourced and retracts it.** This is provenance-type (c)-adjacent even though it's inside an (a)
document: a designer's illustrative mockup text, explicitly disowned once someone checked it.

### G4 — Additional verified daily-ayah candidates (pool/list beyond the 7 shipped)
**ABSENT.** No list of candidate ayat, no verse pool, no "daily ayah" mechanic content exists anywhere in
this collection. The concept of a "Name of the Day" component exists (Brand Kit v1.1, §05: "Al-Wadūd — The
Loving. Not love earned, but love given first"), and the corpus architecture discusses ayat as a *node
type* generically, but there is no enumerated candidate list of specific verses anywhere to mine.

### G5 — Real course content for Fiqh / Seerah / Qur'an tracks
**ABSENT as delivered content — but there is directly relevant sourcing intel.** This collection contains
**zero actual lesson/atom/curriculum text** for any track. What it *does* contain is a detailed account of a
**separate corpus source (the "ZAD Academy" PDF pack) that is referenced but not included in this folder**:

> "Corpus material on hand (for Phase 3/4): a `ZAD ACADEMY` zip holds 10 Sunni PDFs — the six Level-1 course
> books (Aqeedah, Tarbiyah, Tafsir, **and Fiqh, Seerah, Al-Hadith which Workshop 1 thought were corrupted but
> are in fact intact here**) plus 7 booklets by Sheikh al-Munajjid, including *Interactions of the Greatest
> Leader* (~600pp — the primary Seerah source). Ask the user to drop this folder into the project when you
> reach corpus work." — `HANDOFF-PROMPT.md`, line 20

`find` confirms **no "zad" file exists anywhere inside this assigned collection** — it is explicitly a
*separate* folder the owner has not yet supplied here. `Sukun-Workshop1-Learning-Engine-and-Corpus-Findings-v0_1.md`
(§1.4, lines 42–50) gives a detailed audit of those 10 PDFs' condition (which ones are OCR-needed image
scans vs. near-empty failed uploads) but quotes no body text from them. **Licensing status is explicitly
unresolved and non-permissive for verbatim use:** "Using their text verbatim inside the shipped app is a
separate question Josh has explicitly deferred ('I'll deal with the license later' — W1-8). Nothing in this
doc should be read as green-lighting verbatim republication; all Zad/Munajjid-derived content in builds
should be marked illustrative/placeholder until that conversation happens." (§1.3, line 40). **Action
item for the owner, not content to mine:** if he wants Fiqh/Seerah/Qur'an content, the ZAD Academy zip is
the named candidate source, but it lives outside this folder and carries an open licensing question.

### G6 — Anything else religious and reusable (du'a libraries, hadith gradings, honorifics, glossary, atom lists)
**PARTIAL — governance/taxonomy material only, no reusable content strings.** See "Full inventory" below for
the complete list of what's usable as *rules and structure*, not text. Two items worth flagging specifically:
- **Honorific convention confirmed in use:** "ﷺ" appears consistently after every mention of the Prophet
  (e.g. Sukun-Workshop1 §1.3, §4 Movement 5; Brand Kit v1.1 Reason-block mockup). No other honorific
  conventions (رضي الله عنه etc.) appear anywhere in the collection.
- **A reusable "counterfeit pair" glossary fragment exists as a WORKED EXAMPLE, not a verified quote,** citing
  a named scholar (uncited primary source) — `Sukun-Workshop1...md`, §3, line 76:
  > "It quotes al-Hasan al-Basri's line about people who 'busied themselves with wishful thinking until they
  > departed from this life having performed not one good deed.'"
  This is presented as a finding *about* the Zad Academy source material (paraphrased description of what
  the booklet contains), not a byte-verbatim quote Claude extracted from a primary text — treat as
  provenance (b)-adjacent (a description of someone else's sourced content, several removes from the
  original), not directly citable.

---

## FULL RELIGIOUS-CONTENT INVENTORY (everything else found, non-gap-specific)

All of the below is **governance/rules/taxonomy**, useful for *how the app should be built*, not text to
paste into it:

1. **The keystone rule** (appears verbatim, near-identically, in 4+ documents): *"Generate pedagogy, never
   substance"* — substance (hadith text, tafsir, ruling, verse meaning) must be retrieved/verified/attributed,
   never authored; one fabricated hadith = permanent trust loss. Clearest statements:
   `ethos docs/Sukun-Master-Decision-Ethos-and-Formation-Philosophy.md` Part 0 & Part 1;
   `MASTER-BRIEF-what-this-is.md` §4; `working docs (internal/Engine-Database-and-Algorithm-Working-Doc-v0.1.md` §2.
2. **Corpus node-type taxonomy:** Names of Allah · ayat · tafsir · hadith · duas · Seerah moments · acts of
   worship · spiritual themes (the connective hub). Repeated identically across Master Brief, both Ethos
   docs, Engine doc, Concept & Architecture doc.
3. **Register axis** (how content should be *taught*, not what it says): `consolatory · juristic · virtue ·
   corrective · devotional` — with worked pedagogical examples per register in the Engine doc §4 and
   Workshop1 §2/§4.
4. **Discipline axis** (where a concept sits in Islamic knowledge, per Zad Academy's own curriculum):
   `tarbiyah, fiqh, tafsir, aqeedah, seerah, hadith` — English only, sourced explicitly to Zad Academy's
   real semester structure (Workshop1 §2).
5. **New graph edge type `counterfeit_of`** — pairs a virtue with its near-miss counterfeit (hope vs.
   wishful thinking / tamanni; sabr vs. passive resignation; tawakkul vs. fatalism; sincerity vs.
   performance) — derived from auditing the Zad Academy booklets (Workshop1 §2–3).
6. **The 11-movement learning-module spine** (DECIDED build spec) — Door → Hook → Definitional ladder →
   Web+counterfeit → Seerah moment → Perspective cards → Explain-back → Recall seal → Bridge to amal → Close
   → Afterlife. Full detail in Workshop1 §4. This is directly relevant to how awba-gen4's lesson structure
   should work, though it predates and doesn't necessarily match the already-shipped 15-lesson Aqeedah course.
7. **Corpus source APIs identified (not yet ingested):** Quran Foundation (quran.com) Content API v4 —
   verse text, chapter data, Clear Quran + other vetted translations, Tafsir Ibn Kathir, morphology/
   transliteration, audio, official SDK + MCP server. Sunnah.com REST API — Bukhari/Muslim/etc. with English
   translation + grading metadata, gated via GitHub-issue key request, offline dumps available. (Workshop1
   §1.1.) **Neither API was actually called — this is a sourcing plan, not pulled data.**
8. **Seerah sourcing plan:** primary candidate is *Interactions of the Greatest Leader* (Sheikh Muhammad
   Saalih al-Munajjid, ~600pp), organised by human situation not chronology — described as an asset but not
   quoted (Workshop1 §1.3).
9. **F-3 scholar-anchor gating dependency** — repeatedly named as the single blocker before ANY religious
   content (Reason block, Name of the Day, the whole corpus) can ship; Zad Academy/Sheikh al-Munajjid is the
   named lead candidate (Master Brief §11; Workshop1 §1.5).
10. **"Will-not-build" list** (Brand Kit v1.1 §08 and v1.2 equivalent) — includes explicitly: *"No generated
    religious substance — every source verified, retrieved, never invented"* and (added in v1.2) *"no
    unsourced scripture ships, even in drafts, without being marked illustrative."*
11. **Glossary of ethos/product terms** (not religious vocabulary with Arabic+transliteration, but company
    shorthand): ilm, amal, muhasaba, riya, bid'ah, "librarian not a mufti", mercy mechanics, the three honest
    tiers (Exposed/Retained/Lived), absorption memory. Full list in
    `ethos docs/Sukun-Master-Decision-Ethos-and-Formation-Philosophy.md` Part 19.
12. **Naming-brainstorm Arabic words** (NAME-SHORTLIST-verified.md) — رفقة (Rifaqa, companionship), مؤنسة
    (comfort), أوبة (Awba, "the return home to Allah" — became the product's actual name), زلفى (Zulfa,
    nearness), جليس (Jalis, "one who sits with you"), منيب (Munib, "one who turns back to God"). These are
    company-naming candidates with religious/linguistic roots, not app content, but the etymology notes
    (e.g. "the return home to Allah" for Awba) could inform in-app copy/voice since "Awba" is literally the
    shipped product's name.

---

## Provenance notes (per instructions)

- **Type (a) — owner's/Josh's original docs:** all 14 Markdown/PDF files except the two `old/` superseded
  versions, which are also (a) but explicitly retired (kept only for the v1.1 hadith-retraction evidence
  under G3).
- **Type (b) — spliced-from-originals-into-an-app:** none present in this collection.
- **Type (c) — AI-generated design mockups with untrusted religious text:** the Brand Kit's "Reason block"
  and "Name of the Day" component *examples* function as this even though the container document is
  type (a) — they are illustrative UI copy, and the v1.1 hadith line is explicitly flagged and retracted by
  the owner's own v1.2 revision. Treat any religious-sounding string inside a "component example" or
  "worked example" section of these docs as (c)-grade, not citable substance, regardless of which doc it's
  in.
- **Repeated, load-bearing owner directive across every governing doc:** *"All religious content referenced
  is illustrative and must be scholar-verified before reaching a user."* This sentence (or a close paraphrase)
  closes out the Ethos doc, the Concept & Architecture doc, and the Engine doc. It is the collection's own
  verdict on itself for content-sourcing purposes.

## Inventory / file-count note
The brief says "23 files"; this folder actually contains **16 non-`.DS_Store` files** (11 `.md`, 2 `.pdf`,
1 extensionless UTF-8 text file `research/Demographic research`, plus one nominally-empty `website files/`
folder holding only a `.DS_Store`, and one PDF inside `branding documents/old/`). All 16 were opened and
read in full (PDFs via `pdftotext -layout`). No hidden/zip/nested corpus material was found; the referenced
"ZAD ACADEMY" zip (§G5) is confirmed **absent** from this folder via `find -iname "*zad*"`.
