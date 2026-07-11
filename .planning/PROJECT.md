# Awba Gen-4

## What This Is

Awba Gen-4 is the from-scratch, production-quality rebuild of Josh's Gen-3 gamified MVP: a Duolingo-style Islamic micro-learning web app teaching the complete Aqeedah Level 1 course (4 units, 15 lessons, 4 gold "legendary" reviews, all 65 verified atoms). It borrows Duolingo's engagement mechanics and rejects its guilt layer — a companion, not a cop. The target bar: it should look and feel like the best UX/UI developers in the world built it.

## Core Value

A learner opens `learn.html`, walks a beautiful winding path through the full Aqeedah course, and every screen — path, lesson, reward, review — feels world-class while every word of scripture stays verbatim, sourced, and scholar-gated.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Learn page: HUD (course chip, returns flame, noor), daily ayah card, streak band, 4 colour-coded unit sections, winding zigzag node path with locked/available/active/done states, node-anchored popups, streak/noor bottom sheets, course switcher, tab bar
- [ ] Lesson engine (`AwbaLesson`-compatible): renders Josh's 15 lesson data files verbatim — all beat types (read, frame, verse, panel variants, depth 3-Lens accordion, reflect, mc, tf, tile), personalised openers, term glosses, citation chips + bottom sheets
- [ ] Reward choreography: verdict (stars + stat cards) → noor claim → returns screen (orange hero + weekly calendar) → done (recap + next-lesson handoff), with combo pill + PERFECT confetti (never over scripture)
- [ ] Legendary review engine (`AwbaReview`-compatible): gold theme, timed rounds with auto-skip + untimed circle-back, lamp-path progress, mastery result
- [ ] Mercy mechanics preserved exactly: un-loseable noor, unbreakable returns streak, amber-never-red, no hearts/blocking, stars 0–3 replayable
- [ ] Shared localStorage state (noor, returns, stars, days, chests) driving all pages; Josh's key schema honoured or migrated
- [ ] World-class motion + polish: springy micro-interactions, screen transitions, path animations, reward choreography with real feel — Duolingo-grade
- [ ] Fully responsive (phone-first, works desktop) + installable PWA shell (manifest + icons; simple offline-friendly caching)
- [ ] Accessibility pass: keyboard operable, focus management, aria/sr announcements on quiz verdicts and screen changes
- [ ] Scripture rendering: verbatim Clear Quran + official Sunnah.com hadith, Arabic + translation, tappable citation sheets, `unverified · pending review` pills everywhere
- [ ] Deployable as pure static site (GitHub Pages/Vercel), zero build step, Josh can open files directly to review

### Out of Scope

- Accounts / backend / Supabase / Stripe — v1 is device-local by design; the awba-app Next.js repo remains the infra reserve for when the owner un-pauses Supabase
- Chat/speak-back companion layer (Gen-2 V2) — Josh parked it for the MVP; revisit after v1 ships
- Practice hub, quests/badges, profile page, leagues/friend streaks — Josh's MVP scope excludes them; tab bar shows them as polished coming-soon states only
- Fiqh/Seerah/Qur'an courses — course switcher shows them as coming soon; content doesn't exist yet
- New religious content of any kind — we generate nothing; only Josh's verified atom-derived lesson data ships
- Streak freeze mechanics — unnecessary; returns cannot break

## Context

- **Source of truth for content + mechanics:** `/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD/` — Josh's working Gen-3 MVP (v1.5): `learn.html`, `shared/awba-engine.js|css` (~800 lines), 15 lesson data files, 4 review files, `00_MVP-PLAN.md` + `00_BUILD-RECORD.md`. Built and iterated through 5 live owner-review rounds on 2026-07-10 — this is the owner-approved product direction.
- **Design references:** Josh's Gen-2 lab (`_BUILDS/_GEN2-LAB/`) for reward-choreography lineage; branded icon kit (12 official icons, embedded as AW.KIT in his engine); Sukun Brand Kit v1.2 PDF; Duolingo's actual UX patterns (Josh's build is a Duolingo teardown translation).
- **Pedagogy constraints:** `AWBA_Research_and_Pedagogy_Master.md` + Gen-2 research brief (mercy framing, no casino juice over scripture, depth always opt-in, confetti never over ayahs).
- **Prior work being superseded:** the awba-app Next.js v3 companion app (87 screens) stays live but is NOT the design authority for Gen-4; the Lovable package (v3 canon) is superseded by this pivot.
- **Session intel (written during init):** `.planning/research/ENGINE-CONTRACT.md` (exact AwbaLesson/AwbaReview config schema so Josh's data files port verbatim) and `.planning/research/ASSETS.md` (icon kit, Gen-2 patterns, compartments taxonomy, v3 tokens, pedagogy checklist) — produced by exploration agents from Josh's folder.
- **Known licensing flag (owner-level, not build-blocking):** Clear Quran verbatim text was pulled from `quranapi.pages.dev`; Quran.com dropped it from their free API for licensing reasons — commercial launch likely needs a publisher licence. Logged for Josh + Melusi.
- **Scholar gate:** every atom is `draft — none approved`. Sensitive holds carry over exactly: U4-03 HOLD (absent entirely), U3-13 not surfaced, U3-16 principle-only, group-namings held for scholar.

## Constraints

- **Tech stack**: Vanilla HTML/CSS/JS, zero build step, no framework, no bundler — Josh reviews by opening files; deploys to GitHub Pages/Vercel as static files
- **Compatibility**: Lesson/review pages must keep Josh's data-file shape (`AwbaLesson(cfg)` / `AwbaReview(cfg)` config objects) so his 15 lessons + 4 reviews port with zero content edits — content is Josh's asset, the engine is ours
- **Content integrity**: Scripture verbatim only (Clear Quran/Khattab, official Sunnah.com); no generated religious content; pending-review tags on everything; sensitive-atom holds enforced
- **Design authority**: Josh's Gen-3 direction (unit colours U1 `#2E6BF5` blue / U2 purple / U3 teal / U4 gold, gold legendary, lantern companion, Poppins/Inter/Amiri) — elevated in execution, not redirected
- **Reward stance**: points-forward as Josh shipped it (noor per correct answer everywhere); the overjustification question is an owner decision, not a build decision
- **Orchestration**: Fable orchestrates; Opus for deep reasoning (planning, design decisions, flagship UI); Sonnet for exploration/research/mechanical execution

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Fresh repo (`awba-gen4`), not a port into awba-app | Josh wants a clean rebuild; v1 needs no backend; static + zero-build keeps Josh's open-and-review workflow and free hosting | — Pending |
| Josh's Gen-3 MVP is the design + product authority | It's the owner-built, owner-reviewed direction (5 review rounds in one day); Gen-4 elevates execution, not direction | — Pending |
| Engine API stays `AwbaLesson`/`AwbaReview`-compatible | Josh's 15 lesson data files are the content asset; they must port verbatim and stay editable by him | — Pending |
| Points-forward rewards kept as shipped | Owner preference; Gen-2 research's overjustification concern is logged for Josh/Melusi, not silently overridden | — Pending |
| localStorage-only progress, no accounts | Matches Josh's MVP; ships fastest; awba-app repo holds the future account/back-end path | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-07-11 after initialization*
