# C3 — Content-mining report: awba-v3-build (87-screen v3 static demo)

**Collection:** `/Users/theshumba/Downloads/awba-v3-build` (101 files: 1 root MD, index.html, 87 `screens/*.html`, 6 `specs/*.md`, 5 `system/*` incl. css/py)

**Overall provenance verdict:** This collection is class **(b)** — a previous build that spliced content from an original curriculum source, PLUS its own class-(a)-adjacent transcription layer. Concretely:
- `specs/CONTENT-PACK.md` is a **verbatim transcription** of atom files (`aqeedah-unit2/3/4-atoms-v2.md`) that themselves derive from a real published book: **Zad Group, *Aqeedah (Islamic Creed) Level 1*, 1st ed. 1446/2024**. Those atom source files are NOT in this collection (they live in `/Users/theshumba/Downloads/files for melusi - build v3/` per the CONTENT-PACK's own citation) — so this report inventories the **transcription**, not the original, and cannot independently verify it against the book.
- All 87 screens (class b/c rendering layer) pull their religious copy **only** from CONTENT-PACK — screen-builders were under a hard rule ("never invent religious content") and largely followed it, including leaving explicit `[slot empty — API-ready]` placeholders and `﴿ … ﴾` ornamental brackets where no verified Arabic existed.
- Everything in this pack is self-labeled **`review_status: draft — scholar sign-off pending`**. Nothing here is scholar-verified. Treat all of it as "faithfully carried draft," not "ready to ship."
- One cross-reference to a file OUTSIDE this collection surfaced: `00-BUILD-STATE.md` records that the Arabic string تَوْحِيد (tawhid) used on screens C4/C5 was verified byte-identical against `Ayoub's awba-app.html design source` (a different prior build, not present here) — flagged only for completeness, not independently checked by me.

---

## G1 — Quran 14:24 (Ibrahim, "good word / good tree"), Khattab translation

**ABSENT.** Searched exhaustively ("14:24", "Ibrahim", "good tree", "good word", "طيبة", "كلمة", "Khattab", "Clear Quran") across all 101 files.
- The only "Khattab" hits are **Umar ibn al-Khattab** (the Companion, in the U2-01 athar about "knots of Islam") — a false-positive match, not Dr. Mustafa Khattab's translation.
- The only "Ibrahim" hit is **Ibrahim 14:22** (a different ayah, about Shaytan's admission of powerlessness — used in atom U2-09/C4), not 14:24.
- No Arabic Quran text of any kind appears anywhere in this collection except decorative bismillah (`بِسْمِ اللَّٰه`, partial/short form) and one ornamental `﴿ … ﴾` placeholder bracket (screen G8) explicitly marked as awaiting "the verified corpus."
- No translation-name attribution (Khattab/Sahih International/Pickthall/etc.) appears anywhere.

## G2 — Verified Arabic chapter/unit terms for the 4 course units

**ABSENT.** The 4 units are named only in **English** throughout:
- Unit 1 · Sound aqeedah (1a–1e) · Unit 2 · Drifting away (2a–2b) · Unit 3 · Tawhid (3a–3c) · Unit 4 · The pillars of Tawhid (4a–4d) — full breakdown in `specs/DIGEST-shell.md` lines 264-268.
- Screen `B3-unit-intro.html` title = `"Unit 3 · Tawhid"`; path map `B1-aqeedah-path.html` uses `ub-kicker` labels `"Unit 1"`…`"Unit 4"` — all English, no Arabic chapter glyph.
- Swept every screen for Arabic-script characters (`[\x{0600}-\x{06FF}]`): the only Arabic strings anywhere are (a) the brand name أوبة ("awba" = "a return"), (b) بِسْمِ اللَّٰه (bismillah, short form), (c) تقبّل الله / الحمد لله (unsourced closing dhikr phrases, see G3), (d) the 4 glossary terms (طَاغُوت / شِرْك / عَقِيدَة / إِيمَان), (e) one bare تَوْحِيد used as a term-sheet label (sourced from an external, out-of-collection file per 00-BUILD-STATE.md, not from anything in this collection). None of these are unit/chapter names.

## G3 — Default closing du'a with source

**ABSENT — and explicitly, deliberately removed.** This is the most load-bearing finding for G3: `00-BUILD-STATE.md` (lines 173, 201) documents that the build team **searched every given source doc** for جزاك (as in جزاك الله خيرا, "may Allah reward you") for the H5 "report a concern" screen's thank-you copy, found it **"not present anywhere,"** and finalized its **removal**, replacing it with plain English thanks. Verbatim:
> "H5 du'a — searched every given source doc for جزاك: not present anywhere, so the Phase G removal STANDS as final (English thanks stays)." … "CLOSED (Phase H): H5's جزاك الله خيرا exists in no given source — removal is final; the du'a can return only if a future verified corpus carries it."

Other Arabic phrases used as UI flourishes carry **no source/reference at all** (not even a hadith pointer) and should NOT be treated as G3 candidates without a citation:
- `تقبّل الله` ("May Allah accept it [from you]") — used as the ritual completion phrase on `D12-completion.html` and in the lesson-engine `done` state (`specs/DIGEST-lesson-engine.md` §2.13). No source cited anywhere.
- `الحمد لله` ("Praise be to Allah") — used as a doubt-flow end-card dhikr on `G10-end-card.html`. No source cited.
- Bismillah (`بِسْمِ اللَّٰه`, short form without the full الرَّحْمَٰنِ الرَّحِيمِ) — opening ritual, `screens/C1-bismillah.html` + lesson-engine §2.1. No source cited (it's Qur'an 1:1 / the basmalah formula generally, but the doc doesn't cite it as such).

**Conclusion: G3 has no qualifying candidate in this collection.** Anything shipped for `cfg.dua` must come from elsewhere; do not borrow تقبّل الله/الحمد لله as "the du'a" — they're unsourced UI dhikr, and the build's own audit trail shows the team already tried and failed to find a sourced du'a in the underlying documents.

## G4 — Additional verified daily-ayah candidates beyond the shipped 7

**PARTIAL — several verse *references* surface, but none carry a real, attributable translation; all are paraphrases explicitly marked unverified.** Candidates found (all as **paraphrase + ref**, not verbatim scripture, each already tagged "unverified" or "pending review" in its own source file):

1. **az-Zumar 39:65–66** — "Whoever associates others with Allah, his work becomes worthless and he is among the losers — rather, worship Allah alone and be grateful." — `specs/CONTENT-PACK.md` (atom U3-06/A4), reused verbatim-paraphrase on `screens/C12-verse-tafsir.html`.
2. **al-An'am 6:82 · al-Anʿām** — "Those who believe and do not stain that belief with shirk — theirs is security, and theirs is guidance." — `specs/DIGEST-lesson-engine.md` §2.5, sourced with tafsir note "Quran.com — tafsir," state `unverified`. (NOTE: this is from the prototype `awba-lesson-1b-v2.html`, a file NOT in this collection — digest is a full quoted extraction of it.)
3. **Yunus 10:36 · an-Najm 53:28** — "Most people follow only assumption — and assumption avails nothing against truth." — atom U2-15/D1, reused in the companion-chat mockup `screens/G8-verse-in-chat.html` (Arabic slot rendered as ornamental `﴿ … ﴾` placeholder, explicitly not real text).
4. **Qur'an 49:15 · al-Ḥujurāt** — appears only as a **citation-format example** in `specs/DIGEST-shell.md` (twice, lines 289 & 300) — `{t:'verse', ref:"Qur'an 49:15 · al-Ḥujurāt", text}` — the `text` field is a literal placeholder variable, no actual quoted content. Not usable as an ayah candidate, only as a citation-format model.
5. Every other surah:ayah pointer across all 48 indexed atoms in CONTENT-PACK (an-Nahl 16:36, Muhammad 47:19, adh-Dhariyat 51:56, al-Bayyinah 98:6, at-Tur 52:35–36, ar-Rum 30:30, al-Isra 17:67, al-Ankabut 29:65, an-Naml 27:62, al-Anbiya 21:76/21:87–88, al-Anfal 8:9/8:2, ash-Shu'ara 26:63, Aal Imran 3:49, al-Ma'idah 5:110/5:28, al-Qamar 54:1–2/54:10–11, as-Saffat 37:75, al-Baqarah 2:34/2:155–156/2:165/2:131/2:164, Nuh 71:23, an-Nisa 4:171/4:116, al-Hijr 15:39/15:42, Fatir 35:6/35:27–28, al-A'raf 7:16–17/7:54/7:23, Ibrahim 14:22, al-An'am 6:153/6:79, al-Jathiyah 45:18, Saad 38:26/38:82–83, al-Hashr 59:24, al-Hajj 22:73, Yunus 10:34/10:75, al-Mu'minun 23:14, Fussilat 41:15/41:36, Hud 11:56) are **doctrinal pointers only** — the CONTENT-PACK is explicit (line 10) that **"no verse translations exist in the atoms; only paraphrased meanings + surah:ayah pointers"** and screen-builders were told never to expand a ref into quoted verse text. None of these are ready-to-ship "daily ayah" cards — they're evidence citations for doctrinal points, unattributed to any named translation, and draft-status.

**Bottom line for G4:** no new fully-formed, translation-attributed daily-ayah candidate exists here beyond what's already in the shipped app. What exists is a rich list of surah:ayah *pointers* (48 atoms' worth) that a future verified-corpus pass could turn into ayah cards, but every single one needs (a) a real translation sourced from a named, licensed translation and (b) scholar sign-off — none of that exists in this collection.

## G5 — Real course content for Fiqh / Seerah / Qur'an tracks

**ABSENT — explicitly and deliberately.** This collection only ever built **Aqeedah** content (Units 2–4, per CONTENT-PACK) plus generic doubt/companion mockups layered on the same Aqeedah atoms. Direct evidence of exclusion:
- `screens/A5-module-menu.html`: the Fiqh module card renders with **no lessons**, string: *"Fiqh — Being prepared — source under preparation"*, labeled `Soon` — deliberately locked, "no padlock, no shame, just honest quiet."
- `system/SCREEN-MAP.md` (lines 159-161): *"Module set on every dashboard = the A5 canon: Aqeedah (active), Meeting Doubts (active), The Courtyard (active), Fiqh (Soon). No other modules exist; **never invent Ṣalāh/Sīrah/Qurʾān cards.**"* — this is a direct, explicit house rule in the collection itself confirming Seerah/Salah/standalone-Qur'an tracks don't exist and were never to be invented.
- Unit 1 (whichever foundational Aqeedah unit precedes Units 2-4) is also out of scope for this pack — `CONTENT-PACK.md` §4: *"Unit 1 is out of scope for this pack — its atoms live in the main bundle... never invent its lessons."* (that "main bundle" is not in this collection either).

## G6 — Other reusable religious material (du'a libraries, hadith+gradings, honorifics, glossary, atom lists)

**FOUND — several reusable items, all draft/unverified-status:**

1. **48-atom doctrinal index (Units 2–4), fully catalogued with sensitivity flags** — `specs/CONTENT-PACK.md` §1. This is the single richest artifact in the collection: id, title, concept_cluster, one-line point, point-strength, framing/stance flags, and demo-flow mapping for every atom U2-01…U2-15, U3-01…U3-16, U4-01…U4-17. 18 of the 48 are fully transcribed with read-passage/3-lens/quiz/think-prompt/write-in copy (Flows A–D). **4 atoms are marked 🔒 sensitive-do-not-use** (U2-02 following-misguided-leaders/Rafidis, U2-05 blind-following/Sufis+Rafidis, U3-13 salvation-from-Fire w/ cow-veneration anecdote, U3-16 "the three heavenly religions is incorrect" — interfaith-polemical) and **1 is ⛔ fully excluded/HOLD** (U4-03, contemporary-application content withheld at source). These flags are valuable signal for what NOT to resurface even if sourced.
2. **Hadith with gradings** (several, all "carried from the book," draft status):
   - Bitaqah/"slip of paper" hadith — Abdullah ibn Amr; at-Tirmidhi, graded **hasan** (U3-09/A5) — the fullest-quality hadith transcription in the pack, incl. Ibn Taymiyyah's commentary.
   - Fitrah hadith — al-Bukhari & Muslim ("every child is born upon the fitrah…") (U4-15/B2).
   - Muadh ibn Jabal "Allah's right over His slaves" — agreed upon (U3-07/A3); also "last words *Laa ilaaha illa Allah*" — Abu Dawud, sahih al-Albani (U3-04/A1).
   - Arrogance hadith — Muslim (U2-08/C3).
   - Whisperings ("who created your Lord?") hadith — agreed upon (U2-14/C5).
   - Extremes-in-religion hadith — Ahmad & an-Nasai, sahih al-Albani (U2-04/C2).
   - Separate, from the OUT-OF-COLLECTION lesson-engine prototype (quoted verbatim in `specs/DIGEST-lesson-engine.md` §2.6): "whoever meets Allah having associated nothing with Him enters Paradise…" — **Sahih Muslim 93 · via Sunnah.com**, grade **Sahih** — this is a real sunnah.com-style citation with an explicit sharh/commentary slot, but it originates in a file not present in this collection.
3. **Glossary — exactly 4 terms, fixed corpus, explicitly capped:** taghut (طَاغُوت/ṭāghūt), shirk (شِرْك/shirk), aqeedah (عَقِيدَة/ʿaqīdah), iman (إِيمَان/īmān) — full Arabic + translit + word + meaning + context, `specs/CONTENT-PACK.md` §2b, reproduced identically on `screens/H6-glossary.html` and in the lesson-engine digest. Every doc handling this repeats: **"these four entries are the entire gloss corpus... any term not listed has NO gloss yet."** Explicitly do not extend (e.g. fitrah, rububiyah, tawhid itself have no gloss anywhere).
4. **Honorific convention:** ﷺ after the Prophet's name, always (stated as house rule in `specs/DIGEST-lesson-engine.md` §3 and enforced via the build's "law sweep" per `00-BUILD-STATE.md`).
5. **Citation format conventions** (reusable as style, not content): `Qur'an 6:82 · al-Anʿām` (surah:ayah · surah-name, middot separator); hadith `Sahih Muslim 93 · via Sunnah.com`; atom refs `Muadh ibn Jabal (Abu Dawud — sahih al-Albani)`.
6. **Verified/unverified UI-trust conventions** (product pattern, not content per se): every piece of externally-sourced or draft content must carry a visible `unverified · pending review` teal pill until scholar sign-off flips it to a green `verified` pill + reviewer name; hadith carries a separate green "grade" pill (Sahih/Hasan) as an independent axis from verification status. See `screens/H1-about-content.html`, `H2-verified-states.html`, `H3-sources-drawer.html`, `H4-scholar-gate.html`.
7. **Global non-doctrinal delivery strings** (Awba's own tone, safe to reuse, NOT scripture): "Nothing lost — look again." (wrong-answer state) · "You came back to it. That's the whole practice." (completion) · "Content shown is in scholarly review." (footer disclaimer) · "references checked on quran.com" (footer disclaimer, appears on multiple screens).
8. **Brand-name Arabic**: أوبة (awba) glossed in-app as meaning "a return" (`screens/A9-onboarding-welcome.html`) — not scripture but relevant brand/etymology content, unsourced beyond the app's own claim.

---

## Full religious-content inventory (everything else found, for completeness)

- `specs/CONTENT-PACK.md` (836 lines) — the crown-jewel content artifact of this collection: full 48-atom index + 18 fully-transcribed demo flows (A "Why Tawhid Comes First" ×5, B "Meeting Doubt on Its Own Ground" ×5, C "How Belief Drifts" ×5, D "Three Conversations" ×3) + the 4-term glossary + the full unit/module path map with prerequisite edges. Source citation inside the file: Zad Group *Aqeedah (Islamic Creed) Level 1*, 1st ed. 1446/2024, transcribed from atom files in `/Users/theshumba/Downloads/files for melusi - build v3/` (outside this collection — the true original source, not independently inspected by this report).
- `specs/DIGEST-lesson-engine.md` (878 lines) — verbatim extraction of an EARLIER prototype (`awba-lesson-1b-v2.html`, not in this collection) covering a different lesson ("Aqeedah 1b — Why belief matters"): its own bismillah/read/story/term-gloss/verse/hadith/depth/reflect/mc/tf/recap/done components, each with fully worked example content (verse Qur'an 6:82, hadith Sahih Muslim 93, term corpus subset, MC/TF content). Self-contained "depth kit" reference, provenance class (b) one level further removed.
- `specs/DIGEST-pedagogy.md`, `specs/DIGEST-companion.md`, `specs/DIGEST-shell.md` — component/pattern digests (pedagogy taxonomy, companion-chat rules, shell/menu/lesson anatomy incl. the Unit 1–4 English title list at DIGEST-shell.md:264-268). No new scripture; DIGEST-shell.md is where the `Qur'an 49:15 · al-Ḥujurāt` citation-format example lives (placeholder text only).
- `specs/RESEARCH-muslim-apps.md`, `specs/RESEARCH-class-apps.md` — competitive/UX research (Tarteel, Quranly, Duolingo-style patterns, Arabic typography rules incl. UthmanicHafs vs Amiri font guidance). Design research only, not religious content, but useful for future Arabic-rendering decisions (class c, informational).
- `system/ASSETS.md` — icon library descriptions (e.g. icon 14 "hands cupped in dua"); decorative/iconographic, no text content.
- `system/DESIGN-SOT.md` — design tokens incl. `--arabic` (Amiri) vs `.ayah` (Uthmani) font-usage rule; restates "never invent Ṣalāh/Sīrah/Qurʾān."
- `system/SCREEN-MAP.md` — screen inventory + the explicit house rule "Content only from specs/CONTENT-PACK.md... NEVER draft religious content."
- `00-BUILD-STATE.md` — build log; contains the du'a-removal audit trail (G3) and the tawhid Arabic sourcing note (G2/G6) discussed above.
- 87 `screens/*.html` — render layer. All religious text on them traces back to CONTENT-PACK (or, for the design-research-only screens, is absent/placeholder). No screen contains religious content not already accounted for above.

---

## Recommendation for the parent process

- The 48-atom CONTENT-PACK (with its 18 full demo-flow transcriptions) is this collection's single most valuable asset for future Aqeedah content work — but it is **draft, scholar-sign-off-pending**, sourced from a real book (Zad Group), and carries explicit sensitivity/exclusion flags that must be preserved if ever reused.
- G1, G2, G3 are all **cleanly absent** here — no fabricated placeholder should be assumed to satisfy them; in G3's case this collection's own build log shows a due-diligence pass already failed to find one and removed an invented candidate.
- G4 has raw material (surah:ayah pointers) but nothing translation-attributed or ready to ship as-is.
- G5 is absent by explicit design decision recorded in-collection ("never invent Ṣalāh/Sīrah/Qurʾān cards"; Fiqh explicitly "Soon"/not built).
