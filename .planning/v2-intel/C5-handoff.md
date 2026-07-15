# C5 — Content-mining report: /Users/theshumba/Downloads/handoff

Collection contents:
- `README.md`, `COMPONENTS.md`, `DESIGN-DECISIONS.md`, `COPY.md` (top-level developer-handoff docs)
- `source/` — 10 `.dc.html` "design canvas" files: `Awba System Sheet.dc.html` + Zones A,B,C,D,E,F,G,H,I. These are the **original, hand-authored design-system documents** (per README: "the 10 approved `.dc.html` zone files" = "visual source of truth"). Provenance class **(a/b border)** — see CRITICAL CAVEAT below.
- `screens/` (149 files) and `screens-premium/` (150 files) — per-screen static HTML renders of the same content as `source/`, one file per screen-state/theme. Provenance class **(c)** for anything not already verified against `source/` — but in practice they just re-render the `source/` content, so citations found in them match `source/` 1:1 (I checked several; identical text).

## CRITICAL CAVEAT — read before using ANY religious text from this collection

`DESIGN-DECISIONS.md` §9 states explicitly, verbatim:

> "All religious content is illustrative until the scholar anchor (F-3) clears — ship nothing marked 'Pending review' as verified."

`Awba System Sheet.dc.html` footer states, verbatim:

> "Awba design system v1 · all scripture shown carries real attributions; 🔒 content wears the pending-review chip until the scholar anchor clears · next: Zone C — Today."

And `README.md` non-negotiables line states, verbatim:

> "no unsourced scripture (every verse/hadith carries the attribution block; unverified content wears the pending-review chip until the scholar anchor clears)"

So: every citation below **carries a real-looking reference** (book + number + grade, e.g. "Bukhari 574 · Sahih") and the design team's stated intent was that these be real, attributed, non-fabricated citations — this is a materially more careful provenance than pure AI-mockup screens. BUT the documents themselves flag the content as "illustrative," un-cleared by any scholar, and every instance in the UI carries a "Pending review" gold chip. Treat every citation below as **a strong, well-formatted candidate that still needs independent verification against the primary source** (sunnah.com / actual mushaf) before shipping as verified — do not copy straight to production as "verified."

---

## G1 — Quran 14:24 (Ibrahim, "good word / good tree"), Khattab translation

**ABSENT.** Ripgrep swept the whole collection for `14:24`, `Ibrahim`, `Ibrāhīm`, `good tree`, `good word`, `Khattab`, `Clear Quran` — zero hits anywhere (source/, screens/, screens-premium/, and all four top-level .md files). This collection does not contain this verse in any translation, Khattab or otherwise, and does not mention the Clear Quran translation at all. The only translation named anywhere in this collection is **Saheeh International** (used consistently for every Qur'an citation found — see G4).

## G2 — Verified Arabic chapter/unit terms for the 4 course units

**ABSENT / mismatched framework.** This collection's Learn zone (`Zone D - Learn.dc.html`) does not use a "4 units" structure at all. Instead it specs a **different curriculum model** — "Doors" (individual topical modules, e.g. Sabr صبر, Tawakkul توكل, Shukr شكر) organized under a **"knowledge map" of six regions**:
- Tarbiyah (التربية — "the heart's schooling") — no Arabic script shown in-doc, only the transliteration "Tarbiyah"
- Fiqh
- Seerah
- Tafsīr
- ʿAqīdah
- Hadith

None of these six region names appear with Arabic script in the document (only Latin transliteration with diacritics — ʿAqīdah, Tafsīr). The three "Door" topic names DO have Arabic script paired: **Sabr / صبر**, **Tawakkul / توكل**, **Shukr / شكر** (from `Zone D - Learn.dc.html` lines 67-91, D1 screen). A related "concept web" (D4) also names, without Arabic script: Riḍā, Yaqīn, Qadar, Tawbah, Istighfār, Duʿāʾ.

Verdict: this is a wholesale different content architecture (design-pivot artifact, likely superseded per your own memory note that "v3 blue / Josh Gen-3 look" were retired in favour of the pure-Athar system). It does not supply "the 4 course units" Arabic terms the shipped app needs — it supplies Arabic for three unrelated topical door names instead. Flagging as **PARTIAL** only in the sense that *some* Arabic-Islamic-term pairs exist, not because they answer G2's actual question.

## G3 — Default closing du'a with source, for lesson-close screen

**FOUND — strong candidate.** `source/Zone E - Find.dc.html`, screen **E9 "Dua detail"** (lines 500-522), labeled in-doc as "Dua · when it's heavy":

Arabic (byte-verbatim):
```
اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا
```
Transliteration (verbatim, italic caption): `Allāhumma lā sahla illā mā jaʿaltahu sahlan, wa anta tajʿalu l-ḥazna idhā shiʾta sahlan`
Translation (verbatim): "O Allah, nothing is easy except what You make easy — and You make the hard thing, when You will, easy."
**Source cited: "Ibn Ḥibbān 974 · Sahih"**

This is not built as *the* lesson-close du'a in the doc (it's filed under Zone E/Find as a "dua when it's heavy" result node), but it is the single most complete dua-with-full-citation package (Arabic + transliteration + translation + book/number/grade) in the whole collection and is a strong reusable candidate for G3's cfg.dua slot. Same screen is mirrored in `screens/E9-Dua-detail.html` and `screens-premium/E9-Dua-detail.html` — identical text in both.

Also worth noting: G2 Money zone (`Zone G - Money.dc.html` line 148) references "your name goes in the app's opening dua" — confirms the app design intends an "opening dua" concept exists, but the actual text of that specific opening dua is not written anywhere in this collection.

## G4 — Additional verified daily-ayah / hadith candidates beyond the shipped 7

**FOUND — a decent pool, all Saheeh International for Qur'an, mixed hadith collections.** Every citation below appears in `source/*.dc.html` (design-system source, higher trust than screens) and is echoed verbatim in the matching `screens/` and `screens-premium/` files. Listed with full text as found:

**Qur'an (translation: Saheeh International, consistently):**
1. **Qur'an 2:153** — Arabic shown: `إِنَّ ٱللَّهَ مَعَ ٱلصَّـٰبِرِينَ` ("Indeed, Allah is with the patient" — implied, English gloss not spelled out verbatim anywhere, only cited/labelled "ayah"). Appears in System Sheet (type-scale sample) and Zone E (E2 results-web node).
2. **Qur'an 16:127** — Arabic: `وَٱصْبِرْ وَمَا صَبْرُكَ إِلَّا بِٱللَّهِ` — Translation (verbatim): "Be patient — your patience is only through Allah." (`Awba System Sheet.dc.html` lines 173-177, both day/night variants)
3. **Qur'an 85:14** (Al-Burūj) — Arabic: `وَهُوَ ٱلْغَفُورُ ٱلْوَدُودُ` — Translation (verbatim): "And He is the Forgiving, the Loving." Used as the linked ayah for "Name of the Day: Al-Wadūd" (System Sheet lines 403-412; `Zone C - Today.dc.html` lines 648-658, screen C9).
4. **Qur'an 12:86** — referenced not quoted verbatim: "complaining to Allah never breaks it — that is Yaʿqūb's way (Qur'an 12:86)" (`Zone D - Learn.dc.html` line 736, D12 "scholarly difference" screen).

**Hadith:**
5. **Bukhari 574 · Sahih** — Arabic: `مَنْ صَلَّى الْبَرْدَيْنِ دَخَلَ الْجَنَّةَ` — Translation: "Whoever prays the two cool prayers will enter Paradise." (System Sheet lines 354-358; reused for "Why Fajr" reason-block copy)
6. **Bukhari 6309 · Sahih** — no Arabic given, only English: "Allah is more pleased with the repentance of His servant than one of you who finds his lost camel in the desert." (`Zone C - Today.dc.html` lines 452-455, C6 "quiet day mercy screen")
7. **Bukhari 3231 · Sahih — retold** (explicitly marked "retold," i.e. paraphrase not verbatim hadith text) — the Ṭāʾif story: "The city said no. Then it made sure he felt it... perhaps their children will carry what their parents threw away." (`Zone D - Learn.dc.html` lines 679-684, D10 "Seerah story mode")
8. **Muslim 2699 · Sahih** — Arabic: `مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ` — Translation: "Whoever walks a path seeking knowledge, Allah eases for him a path to Paradise." (`Zone D - Learn.dc.html` lines 1026-1031, D22 "milestone trophy")
9. **Muslim 2999 · hadith** (no grade word given, just "hadith") — English only: "How wondrous — all of it is good…" (`Zone E - Find.dc.html` lines 165-166, E2 results-web node for "patience")
10. **Abu Dawud 418 · Hasan** — Arabic: `لَا تَزَالُ أُمَّتِي بِخَيْرٍ مَا لَمْ يُؤَخِّرُوا الْمَغْرِبَ` — Translation: "My ummah will remain upon goodness so long as they do not delay Maghrib." (`Zone C - Today.dc.html` lines 203-207, C2 "pre-prayer" / C8 "why Maghrib" reason block)
11. **Ibn Ḥibbān 974 · Sahih** — the "when it's heavy" dua, see G3 above.

That's 4 Qur'an refs + 7 hadith refs = **11 additional candidates beyond the shipped 7**, all with citation, several with full Arabic + translation. All still carry the collection-wide "illustrative / pending scholar review" caveat (see CRITICAL CAVEAT above) — verify against sunnah.com/mushaf before use.

## G5 — Real course content for Fiqh / Seerah / Qur'an tracks

**ABSENT** as structured lessons/atoms/curricula. What exists is design-mockup framing only:
- Seasonal "Doors" teased on the D1 Learn-home screen: "The Hijrah, quietly" (Seerah · 20 min) and "A day that forgives a year" (Fiqh · 12 min) — titles + discipline tag + duration only, no lesson content.
- D10 "Seerah story mode" — one retold vignette (Ṭāʾif, see G4 #7) as a single-screen mock, not a lesson sequence.
- The "six regions" knowledge-map (Tarbiyah/Fiqh/Seerah/Tafsīr/ʿAqīdah/Hadith) is a progress-visualization mock with fake fill percentages (55%/30%/42%/18%/24%/8%) — no actual content behind them.
- No Fiqh ruling content, no Seerah lesson text, no Qur'an-track (tafsir/memorization) lesson content anywhere in the collection.

## G6 — Other reusable religious content (du'a libraries, hadith gradings, honorifics, glossary, atom lists)

**FOUND — several small but reusable items:**

1. **Honorific convention**: `Zone D - Learn.dc.html` line 662 shows the Prophet's name styled with the raised seal: "The Prophet **ﷺ** wept at his son's grave — and called it sabr." Confirms the app's honorific glyph convention is the ﷺ Unicode ligature inline after "the Prophet," not spelled-out "peace be upon him."

2. **Attribution/grading UI convention** (`COMPONENTS.md` §Trust & scripture, verbatim): "AttributionBlock — the trust signature. Gold seal (ring 2px #F2C879 + gold core dot) + source line 500 12–12.5 muted ('Qur'an 2:153 · Saheeh International' / 'Bukhari 574 · Sahih'). Always above-fold with its content... Never carries the pending chip itself." Plus "PendingReviewChip" variants: `compact` ("Pending review"), `full` ("Pending scholar review"), `cleared` ("Reviewed · date", green). This is a reusable **content-QA workflow pattern** (not itself religious text) worth carrying into awba-gen4's own content pipeline: every scripture/hadith line ships with a gold-seal citation + a "pending scholar review" chip until an actual scholar clears it, then flips to a green "Reviewed · [date]" state that displays once.

3. **Concept glossary (transliteration + short gloss, no Arabic script except three)**: Sabr صبر ("not gritting your teeth... what holds when nothing else does"), Tawakkul توكل ("Trust that works — planning like it depends on you, resting like it depends on Him"), Shukr شكر, Riḍā ("Contentment with the decree — sabr's quieter sibling... The scholars ranked riḍā above sabr — rarer, and unforced"), Yaqīn, Qadar, Tawbah, Istighfār, Duʿāʾ (all six-region + concept-web terms, `Zone D - Learn.dc.html`).

4. **Scholarly-difference sourcing pattern** (D12 screen, `Zone D - Learn.dc.html` lines 738-747) — a "positions, shelved" format citing named scholars/works directly:
   - "Ibn Qayyim, ʿUddat aṣ-Ṣābirīn" — for the position "describing your state to seek help or counsel doesn't break sabr — resentment of the decree does"
   - "reported of al-Fuḍayl b. ʿIyāḍ" — for the stricter position "the fullest sabr keeps the wound between you and Allah alone"
   - Also cites **Ibn Qayyim's Madārij as-Sālikīn, vol. 2** as source for the Riḍā concept-web node (`Zone E - Find.dc.html` line 542), plus a design-system provenance note there: "Reviewed · Awba scholar board — 12 Jun 2026" (i.e., this one node is marked as already scholar-cleared in the mock, unlike everything else which is "Pending review").
   - One explicit "modern window" citation used as illustrative parallel, NOT scripture: "cf. Frankl, Man's Search for Meaning (1946) — one window, not a proof" (`Zone D - Learn.dc.html` line 717) — shows the intended pattern for citing secular sources alongside scripture without conflating them.

5. **Reciter/reader-settings content**: Default reciter named as **Mishary Rashid Alafasy**; translation toggle defaults to **Saheeh International**; example surah audio-playback mock uses **Ash-Sharḥ (94), ayahs 1-3**, Arabic shown: `أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ ۝١` / `وَوَضَعْنَا عَنكَ وِزْرَكَ ۝٢` / `الَّذِي أَنقَضَ ظَهْرَكَ ۝٣` (`Zone E - Find.dc.html` lines 592-598) — a usable additional ayah-set candidate (no separate hadith-style citation beyond the surah/ayah reference itself, since it's primary Qur'an text).

6. **99 Names of Allah feature spec**: "Name of the Day" component shows position-not-progress framing ("12 of 99"), worked example **Al-Wadūd — The Loving** (الوَدُود) linked to Qur'an 85:14 (see G4 #3). This is a UI/content pattern (a Name-of-the-day rotation through the 99 Names) rather than a supplied list of all 99 — the other 98 names/meanings are NOT enumerated anywhere in this collection.

7. **ʿ/ayn and hamza transliteration convention** — consistent diacritic style used throughout for reuse in glossaries: Muḥarram, ʿĀshūrāʾ, Ṭāʾif, Yaʿqūb, ʿUddat aṣ-Ṣābirīn, al-Fuḍayl b. ʿIyāḍ, Aṣ-Ṣabūr, riḍā, yaqīn, qadar, tawbah, istighfār, duʿāʾ — full-macron/dot-under IJMES-style transliteration, not simplified.

8. **Root-word study feature concept** (not content): "ص-ب-ر across the Qur'an — 103 places" as a "go deeper" teaser (`Zone D - Learn.dc.html` line 908) — no actual list of the 103 occurrences supplied.

No du'a library beyond the single Ibn Ḥibbān 974 dua (G3) was found. No hadith-grading glossary/legend beyond the inline "Sahih / Hasan" labels used ad hoc per-citation. No additional atom lists beyond the 65 already known (not mentioned in this collection at all — "atom" as a term does not appear literally anywhere in these files; my initial grep hit on COMPONENTS.md was a false-positive substring match, not a real occurrence of the word "atom").

---

## Full non-gap inventory notes (design/product context, not religious content per se)

- This handoff is dated "3 July 2026" (`DESIGN-DECISIONS.md` header) and represents a **prior design iteration** of Awba — likely the "Premium redesign" or an early v3-adjacent pass, built around a "Doors" learning metaphor (not the "4 units / 65 atoms" architecture the shipped app actually uses per your own project memory). Treat its screens/IA as historical reference only, not as the current content model.
- Hard content-safety rules recorded in `README.md`/`DESIGN-DECISIONS.md` §7 (verbatim): "No streaks / no counting absence · no points/leaderboards on worship · no guilt copy · no countdowns or dark patterns · no crescents/mosques/green-on-white/stock photos · no infinite feeds · no unsourced scripture." Useful as product-policy reference even though not itself "content."
- `Zone F - Profile.dc.html` confirms journal privacy framing ("not even we can read it") and marks "Answered dua" as the app's "one gold act" in the journal — a UX pattern, no new religious text.
- Reference calendar/prayer-time data used throughout comps (`DESIGN-DECISIONS.md` §9): "London (Whitechapel), Fri 3 July 2026 = 18 Muḥarram 1448. Times: Fajr 2:57 · Jumuʿah 1:05 · ʿAsr 6:33 · Maghrib 9:19 · ʿIshā 10:37 (UK Moonsighting; ʿAsr standard)" — sample data only, not verified prayer-time content for production.
