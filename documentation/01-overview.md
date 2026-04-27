# FARDI — Platform Overview

## What Is FARDI?

FARDI is a full-stack, gamified language assessment platform designed for Tunisian university students who are learning English as a foreign language. The platform evaluates and develops English proficiency through a narrative-driven, multi-phase learning journey set around the planning of a cultural event at a Tunisian university.

Rather than administering a static test, FARDI places students inside an interactive scenario where they must communicate with AI-powered non-player characters (NPCs), complete tasks, write documents, negotiate with vendors, plan marketing campaigns, and reflect on outcomes — all in English. Every response is assessed in real time and used to determine the student's current CEFR proficiency level.

**Primary audience:** Tunisian university students (typically A1–B2 range) enrolled in English language courses.

**Pedagogical goal:** Move students toward measurable CEFR level improvement through contextual, task-based language use rather than rote drilling.

---

## The CEFR Framework

The Common European Framework of Reference for Languages (CEFR) is the international standard for describing language ability. It defines six levels:

| Level | Label       | Description                                                       |
|-------|-------------|-------------------------------------------------------------------|
| A1    | Beginner    | Can use familiar everyday expressions and very basic phrases      |
| A2    | Elementary  | Can understand frequently used expressions in routine situations  |
| B1    | Intermediate| Can deal with most situations encountered while travelling        |
| B2    | Upper-Int   | Can interact with a degree of fluency with native speakers        |
| C1    | Advanced    | Can express ideas fluently and spontaneously without much effort  |
| C2    | Mastery     | Can understand virtually everything heard or read (not used here) |

FARDI targets the A1–C1 range. Every student interaction is assessed against CEFR descriptors and assigned one of these five levels. The platform uses those levels to:

1. Determine an overall CEFR profile at the end of Phase 1 (Foundation).
2. Route students through the correct remedial chain when they struggle in later phases.
3. Award XP multipliers and badges that reflect demonstrated proficiency.
4. Generate a completion certificate that states the student's assessed level.

---

## Platform Learning Journey

FARDI is structured as six sequential phases. Each phase has its own theme, set of NPCs, and skill focus. Students must complete one phase before unlocking the next.

```
+------------------------------------------------------------------+
|                    FARDI STUDENT JOURNEY                         |
+------------------------------------------------------------------+

  [REGISTER / LOGIN]
         |
         v
  +------+------+
  |   PHASE 1   |  Foundation — Language Assessment
  |  8 NPC      |  Dialogue with Lilia, Ryan, Skander, Emna,
  |  questions  |  Ms. Mabrouki. Open-ended CEFR assessment.
  |             |  Groq AI assesses each response (A1→C1).
  +------+------+
         |
         | Overall CEFR level calculated (weighted avg)
         v
  +------+------+
  |   PHASE 2   |  Cultural Event Planning — Organization
  |  5 Steps    |  Written tasks: email drafting, proposals,
  |  scored /5  |  meeting agendas, invitations, schedules.
  |  each       |  Score < threshold → remedial chain.
  +------+------+
         |
         v
  +------+------+
  |   PHASE 3   |  Vendors & Budget — Negotiation
  |  4 Steps    |  Listening comprehension, gap-fill, matching,
  |  3 interact.|  dialogue completion with vendors.
  |  per step   |  Score triggers A1→A2→B1→B2→C1 remedial.
  +------+------+
         |
         v
  +------+------+
  |   PHASE 4   |  Marketing — Promotion & Outreach
  |  (SubPhase1)|  Vocabulary warm-up, sentence expansion,
  |  5 Steps    |  poster design language, slogan writing.
  +------+------+
         |
         v
  +------+------+
  |  PHASE 4.2  |  Social Media Marketing — Digital Promotion
  |  (SubPhase2)|  Social media post writing, campaign planning,
  |  5 Steps    |  error correction, evaluation tasks.
  +------+------+
         |
         v
  +------+------+
  |   PHASE 5   |  Event Execution — Problem Solving
  |  SubPhase   |  Real-time issue resolution during the event.
  |  1 & 2      |  5 Steps each subphase, remedial chains.
  |  5 steps ea.|
  +------+------+
         |
         v
  +------+------+
  |   PHASE 6   |  Reflection — Evaluation & Feedback
  |  SubPhase   |  Post-event analysis, written reflection,
  |  1 & 2      |  peer feedback, self-evaluation rubrics.
  |  5 steps ea.|
  +------+------+
         |
         v
  [CERTIFICATE GENERATED]  +  [FINAL XP & BADGE AWARDED]
```

---

## The Core Scenario

The entire platform is framed around a single narrative: **planning and executing a cultural event at a Tunisian university**. This grounds all language tasks in a realistic, culturally relevant context that students can relate to.

### Non-Player Characters (NPCs)

Students interact with five recurring characters throughout all phases:

| Character       | Role                              | Voice (Edge TTS)         |
|-----------------|-----------------------------------|--------------------------|
| **Lilia**       | Student committee organizer       | en-US-ElizabethNeural    |
| **Ryan**        | International exchange student    | en-US-BryanNeural        |
| **Skander**     | Tech-savvy committee member       | en-US-GuyNeural          |
| **Emna**        | Creative arts coordinator         | en-US-AriaNeural         |
| **Ms. Mabrouki**| Faculty advisor / supervisor      | en-US-JennyNeural        |

Each NPC has a defined personality, background, and role. When Groq AI generates character dialogue, it is prompted to stay in character using these descriptors. Audio files for NPC speech are pre-generated using Microsoft Edge TTS and served from `static/audio/`.

### Phase Themes

- **Phase 1 — Foundation:** An initial meeting where the student introduces themselves and discusses the event concept with the team.
- **Phase 2 — Cultural Planning:** Writing emails, proposals, and agendas to organize the event logistics.
- **Phase 3 — Vendors & Budget:** Negotiating with external suppliers, discussing budgets, listening to vendor pitches.
- **Phase 4 — Marketing (SubPhase 1):** Designing posters, writing slogans, creating promotional language.
- **Phase 4.2 — Marketing (SubPhase 2):** Social media content creation, campaign management, error correction.
- **Phase 5 — Execution:** Handling real-time problems that arise during the event (technical issues, guest complaints, schedule conflicts).
- **Phase 6 — Reflection:** Writing post-event evaluations, giving peer feedback, and conducting self-assessment.

---

## Adaptive Learning: Scoring and Remedial Chains

FARDI's central pedagogical mechanism is the **adaptive remedial system**. After each scored interaction block (typically 3 interactions per step), the student's total score is compared against thresholds to decide whether they proceed forward or enter a remedial chain.

### Scoring Thresholds (Phases 3–6)

Each interaction block produces a score out of a maximum (typically 5 or 10 points). The thresholds vary slightly by phase but follow this general pattern:

```
Score < threshold_A1  →  Remedial A1  (most support)
Score < threshold_A2  →  Remedial A2
Score < threshold_B1  →  Remedial B1
Score < threshold_B2  →  Remedial B2
Score < threshold_C1  →  Remedial C1  (lightest support)
Score >= all           →  Proceed to next step
```

### Remedial Chain Structure

A remedial set at any given level consists of 2–8 sequential tasks (TaskA, TaskB, …, TaskH). Task types include:

- **Matching** — connect concepts to definitions
- **Gap-fill** — fill in missing words in sentences or dialogues
- **Dialogue completion** — choose the appropriate conversational response
- **Sentence expansion** — expand simple prompts using connectors
- **Writing tasks** — short written outputs assessed by AI

After completing a remedial chain, the student returns to the main step flow and proceeds forward. **The remedial chain itself is also assessed** — students who score below the success threshold in remedial may be prompted to retry or continue anyway.

### Remedial Chain Progression (A1 → A2 → B1 → B2 → C1)

The chains form a cascade. A student who scores in the A1 range gets the A1 remedial set. If they then score well in subsequent steps they may be routed to A2 remedial next time, and so on. This creates an implicit upward trajectory even for struggling students.

---

## Gamification System

FARDI uses a full gamification layer to motivate sustained engagement.

### Experience Points (XP)

XP is awarded after every completed activity. The amount depends on:

- The CEFR level achieved in that activity (A1 = 15 XP up to C1 = 40 XP per question in Phase 1)
- Bonus multipliers for first-try completion, perfect scores, and speed

XP accumulates across the entire platform and is displayed on the Dashboard with a progress bar toward the next player level.

### Player Levels and CEFR Badges

Students earn titled badges that correspond to CEFR milestones:

| Badge Name       | Milestone                        |
|------------------|----------------------------------|
| Newcomer         | Account created / Phase 1 started|
| A1 Starter       | First A1-level assessment passed |
| A2 Explorer      | Demonstrated A2 proficiency      |
| B1 Achiever      | Demonstrated B1 proficiency      |
| B2 Challenger    | Demonstrated B2 proficiency      |
| C1 Expert        | Demonstrated C1 proficiency      |

### Achievements

Discrete achievements are unlocked by specific in-platform behaviors, for example:

- **quick_thinker** — Complete Phase 1 in under 5 minutes
- **consistent_performer** — Receive the same CEFR level across 4+ consecutive responses
- **vocabulary_master** — Show advanced vocabulary in 3+ assessed responses
- **grammar_expert** — Receive "excellent" grammar feedback on 3+ responses
- **communicator** — Achieve B2 or C1 on a social interaction question

Newly unlocked achievements are surfaced to the student via an in-app notification and confetti animation (`ConfettiCannon` component). Unseen achievements are tracked in the database and marked as seen once displayed.

### Streaks

A daily activity streak is tracked via `StreakService`. Students who engage on consecutive days build a streak count shown on the Dashboard. Streak freeze tokens can be purchased with XP to protect a streak during an absence.

---

## Anti-Cheating: AI Content Detection

FARDI implements a two-layer system to detect AI-generated responses (e.g., copy-pasted ChatGPT output):

**Layer 1 — Sapling API (external):** When `SAPLING_API_KEY` is configured, written responses above 50 characters are sent to Sapling's AI detection endpoint. The API returns a score from 0 to 1. Responses scoring above 0.5 are flagged as likely AI-generated.

**Layer 2 — Local heuristics (fallback):** When Sapling is unavailable, `AIService._is_ai_generated_local()` applies a set of lexical and structural rules:

- Unusual response length (>500 chars) → +0.15
- Presence of typical AI phrasing patterns → up to +0.25
- Low sentence length variability (coefficient of variation < 0.4) → +0.20
- Unusually high type-token ratio (>0.8) → +0.20
- Zero repeated trigram patterns in a long text → +0.10

The combined score is returned alongside the CEFR assessment. Flagged responses are stored in the database with an `ai_detected` flag and reported in the admin dashboard.

---

## Technology Stack Summary

| Layer            | Technology                                         |
|------------------|----------------------------------------------------|
| Frontend         | React 18, Vite 5, React Router v6, Material-UI v5  |
| State management | React Context API (`ApiProvider`, `useAuth`)       |
| Backend          | FastAPI 0.109 (Python), Uvicorn ASGI server        |
| Database         | SQLite via direct `sqlite3` driver (no ORM)        |
| AI assessment    | Groq API — `meta-llama/llama-4-scout-17b` model   |
| AI detection     | Sapling AI API + local heuristics fallback         |
| Text-to-speech   | Microsoft Edge TTS (`edge-tts` 6.1.9)             |
| Authentication   | JWT via `python-jose`, stored in httpOnly cookies  |
| Packaging        | PyInstaller + Electron (desktop distribution)      |
| Deployment       | FastAPI serves built React SPA as static files     |

---

## ASCII Student Journey Flowchart (Detailed)

```
Student Opens App
      |
      +--[Not logged in]--> /login or /signup
      |                          |
      |                    JWT cookie set
      |                          |
      +<-------------------------+
      |
      v
  /dashboard  (XP, streak, phase progress cards)
      |
      v
  /phase1  -->  /phase1/interaction/1  -->  /phase1/interaction/2  --> ...
                   (NPC dialogue, free-text response)
                   (Groq assesses each response: A1-C1)
                          |
                    All 8 questions done
                          |
                          v
                     /results  (overall CEFR, skill breakdown, XP, achievements)
                          |
                          v
  /phase2  -->  /phase2/step/1  -->  score calculated
                    |                      |
              [score < 10]         [score >= 15]
                    |                      |
              Remedial A1/A2        Proceed to Step 2
                    |                      |
              Return to main         /phase2/step/2 ...
                          |
                    5 steps complete
                          v
                   /phase2/complete
                          |
                          v
  /phase3/step/1  -->  Interaction1  -->  Interaction2  -->  Interaction3
                              |
                        ScoreCalculation
                              |
                 +----+----+----+----+-----+
                 |    |    |    |    |     |
                A1   A2   B1   B2   C1  Proceed
                 |    |    |    |    |
              remedial chain tasks
                 |
              Return & proceed to Step 2 ... Step 4
                          |
                   Phase 3 complete
                          |
                          v
  Phase 4 (SubPhase 1)  --  5 Steps (vocabulary, slogans, posters)
                          |
  Phase 4.2 (SubPhase 2) -- 5 Steps (social media, error correction)
                          |
                          v
  Phase 5 (SubPhase 1 + 2) -- 5 steps each (event execution)
                          |
  Phase 6 (SubPhase 1 + 2) -- 5 steps each (reflection)
                          |
                          v
                   /certificate  (CEFR level, XP total, date)
```
