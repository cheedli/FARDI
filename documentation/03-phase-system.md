# FARDI — Phase System Reference

This document describes the full phase/step/interaction/remedial architecture of the FARDI language assessment platform. Every phase is part of a continuous scenario: organising a **Global Cultures Festival** at a Tunisian university. Students interact with five recurring NPCs (Ms. Mabrouki, SKANDER, Emna, Ryan, Lilia) throughout all phases.

---

## 1. Phase Overview

| Phase | Label | Scenario / Topic | Steps | Subphases |
|-------|-------|------------------|-------|-----------|
| Phase 1 | Initial Assessment | Committee orientation — 9 NPC dialogues evaluating all four CEFR skills | 9 interactions (no remedials) | — |
| Phase 2 | Committee Roles | Students take on committee member roles and practise planning vocabulary | Multiple (loaded from `phase2.json`) | — |
| Phase 3 | Sponsorship & Budgeting | Financial planning, scheduling and sponsor pitching | 4 steps | — |
| Phase 4 (part 1) | Marketing & Promotion — Preparation | 5 backend steps mapped to 4 frontend steps; vocabulary, social media, evaluation | 5 backend / 4 frontend | — |
| Phase 4_2 (part 2) | Marketing & Promotion — Execution | Continuation of Phase 4 content; 5 steps | 5 steps | — |
| Phase 5 | Execution & Problem-Solving | On-the-day event management, handling last-minute crises | 5 steps × 2 subphases | SP1 + SP2 |
| Phase 6 | Reflection & Evaluation | Post-event report writing (SP1) + peer feedback discussion (SP2) | 5 steps × 2 subphases | SP1 + SP2 |

---

## 2. Step Structure (the repeating pattern)

Every step inside Phases 3–6 follows this flow:

```
Step N (Intro page)
  └── Interaction 1  (game / vocab warm-up — scored 0/1 for completion)
  └── Interaction 2  (AI-evaluated spoken or written response — scored 1–5 CEFR band)
  └── Interaction 3  (game / spelling / grammar — scored 0/1 for completion)
  └── Score page     (calls POST /calculate-score, receives remedial_level + next_url)
        ├── if should_proceed → next Step (or next Subphase / Phase)
        └── if not should_proceed → Remedial chain at assigned level
              └── TaskA → TaskB → [TaskC …] → Results
                    └── Results: pass → next Step; fail → restart remedial
```

**Phase 3 Step 4 is the only exception** — it has only two interactions (budget creation + sponsor pitch) because there is no third game.

---

## 3. Scoring Thresholds and Remedial Routing

### 3.1 Phase 3

The key variable is `interaction2_score`, which is the CEFR score for the AI-evaluated response (range 1–5 for steps 1–3; both interactions return 1–5 for step 4). Routing is based on `total_score = i1 + i2 + i3`.

#### Phase 3 — Step 1 (max 21 pts: I1 0–8, I2 0–8, I3 1–5)

| Total Score | Remedial Level |
|-------------|----------------|
| < 12 | A1 |
| 12–17 | A2 |
| 18–21 | B1 |
| 22–25 | B2 |
| ≥ 26 | C1 |

#### Phase 3 — Step 2 (max 23 pts: I1 0–10, I2 0–8, I3 1–5)

| Total Score | Remedial Level |
|-------------|----------------|
| < 8 | A1 |
| 8–12 | A2 |
| 13–17 | B1 |
| 18–20 | B2 |
| ≥ 21 | C1 |

#### Phase 3 — Step 3 (max 18 pts: I1 0–8, I2 0–5, I3 1–5)

| Total Score | Remedial Level |
|-------------|----------------|
| < 6 | A1 |
| 6–10 | A2 |
| 11–13 | B1 |
| 14–16 | B2 |
| ≥ 17 | C1 |

#### Phase 3 — Step 4 (max 10 pts: I1 1–5, I2 1–5, no I3)

| Total Score | Remedial Level |
|-------------|----------------|
| < 2 | A1 |
| 2–3 | A2 |
| 4–5 | B1 |
| 6–7 | B2 |
| ≥ 8 | C1 |

**Note:** In Phase 3 all four levels always route to remedials (`should_proceed` is always `false`). The remedial chain is mandatory regardless of score.

---

### 3.2 Phase 4 (part 1) and Phase 4_2 (part 2)

Phase 4 uses `_phase4_total_to_level(total_score, thresholds)` with per-step threshold lists. The routing always sends the student to remedials (`should_proceed = False`).

#### Phase 4_2 — Step 1 (max scores: I1=8, I2=5, I3=8 → 21 total)

| Total Score | Remedial Level |
|-------------|----------------|
| < 4 | A1 |
| 4–6 | A2 |
| 7–9 | B1 |
| 10–12 | B2 |
| ≥ 13 | C1 |

#### Phase 4_2 — Steps 2–5 (max scores: I1=5, I2=5, I3=5 → 15 total)

| Total Score | Remedial Level |
|-------------|----------------|
| < 7 | A2 |
| 7–9 | B1 |
| 10–12 | B2 |
| ≥ 13 | C1 |

Steps 2–5 of Phase 4_2 have **no A1 remedial** — the floor is A2.

After completing all five steps of Phase 4_2, the next URL is `/dashboard`.

---

### 3.3 Phase 5 and Phase 6

These phases use a simpler routing rule driven entirely by `interaction2_score` (the AI response, range 2–5):

```
interaction2_score → remedial_level
2   →  A2
3   →  B1
4   →  B2
5   →  C1
```

`should_proceed = True` when `interaction2_score >= 3`. Students scoring 3, 4 or 5 on interaction 2 advance directly to the next step without entering a remedial. Students scoring 2 are sent to the A2 remedial.

`total_score = i1 + i2 + i3`, max 7 (I1 0–1, I2 2–5, I3 0–1).

**Phase 5 completion check:** all 10 steps (SP1 steps 1–5 + SP2 steps 1–5) must be recorded in `phase5_progress`. Total score ≥ 12 per subphase to mark it complete.

**Phase 6 completion check:** same structure — all 10 steps in `phase6_progress`, total ≥ 12 per subphase.

---

## 4. Remedial Chain

### 4.1 Task sequence within a remedial level

The number of tasks per level varies by phase:

| Level | Phase 3 | Phase 4/4_2 | Phase 5/6 |
|-------|---------|-------------|-----------|
| A1 | TaskA → TaskB | TaskA → TaskB → TaskC | TaskA → TaskB → TaskC |
| A2 | TaskA → TaskB → TaskC → TaskD | TaskA → TaskB → TaskC | TaskA → TaskB → TaskC |
| B1 | TaskA | TaskA → TaskB → TaskC → TaskD → TaskE → TaskF → Results | TaskA → TaskB → TaskC → TaskD → TaskE → TaskF → Results |
| B2 | TaskA | TaskA → TaskB → TaskC → TaskD → TaskE → TaskF → Results | TaskA → TaskB → TaskC → TaskD → TaskE → TaskF → Results |
| C1 | TaskA | TaskA → … → TaskH → Results | TaskA → … → TaskH → Results |

> The exact task count for each level/step is encoded in the frontend page components.  The backend records completion via the remedial log endpoints and final-score endpoints.

### 4.2 Results page routing

After completing the last task in a remedial level, the student reaches a **Results page**. The backend `final-score` endpoint computes whether the student passed:

- If `total_score >= pass_threshold` → `next_url` points to the **next step** (or next subphase/phase).
- If `total_score < pass_threshold` → `next_url` loops back to **TaskA of the same remedial level** (retry).

The pass thresholds are level- and step-specific. Examples from Phase 6 Subphase 1:

| Step | A2 threshold/max | B1 threshold/max | B2 threshold/max | C1 threshold/max |
|------|-----------------|-----------------|-----------------|-----------------|
| 1 | 15/18 | 12/14 | 23/28 | 21/26 |
| 2 | 15/18 | 11/13 | 22/27 | 13/16 |
| 3 | 18/22 | 13/16 | 22/27 | 18/22 |
| 4 | 15/18 | 11/13 | 20/25 | 19/23 |
| 5 | 15/18 | 13/16 | 16/19 | 19/23 |

---

## 5. CEFR Level Mapping

Points and labels used across all scoring:

| Score (1–5 band) | CEFR Level | Description |
|-----------------|------------|-------------|
| 1 | A1 | Beginner — very basic phrases |
| 2 | A2 | Elementary — simple routine exchanges |
| 3 | B1 | Intermediate — most familiar situations |
| 4 | B2 | Upper Intermediate — fluent interaction |
| 5 | C1 | Advanced — fluent, sophisticated expression |

Badge names (awarded at game end): Newcomer (A1), Explorer (A2), Adventurer (B1), Navigator (B2), Ambassador (C1).

---

## 6. Phase-by-Phase Detail

### 6.1 Phase 1 — Initial Assessment

- **9 interactions**, no remedials, no score gate.
- Each interaction is an open-text or listening response evaluated by the AI service.
- Interaction types in order: `introduction`, `motivation`, `cultural_knowledge`, `listening`, `creativity`, `social_interaction`, `problem_solving`, `skills_discussion`, `writing`.
- Scores feed into the overall CEFR profile stored in the database.
- After interaction 9 the student is shown the `/results` page.

Data source: `DIALOGUE_QUESTIONS` list in `backend/models/game_data.py`.

---

### 6.2 Phase 2 — Committee Roles

- Data loaded from `phase2.json` via `backend/models/phase2_loader.py`.
- Thresholds: score < 10 → A1 remedial, score < 15 → A2 remedial, else → B1 remedial.
- Entry: `/phase2`, completion: `/phase2/complete`.

---

### 6.3 Phase 3 — Sponsorship & Budgeting

**Scenario:** Planning the festival's finances, scheduling and sponsor pitching.

| Step | Name | Interaction 1 | Interaction 2 (AI) | Interaction 3 |
|------|------|--------------|-------------------|--------------|
| 1 | Finances Intro | Vocab game (0–8) | Budget concept response (0–8) | Sentence CEFR (1–5) |
| 2 | Scheduling | Planning game (0–10) | Scheduling response (0–8) | Sentence CEFR (1–5) |
| 3 | Tasks | Task game (0–8) | Task allocation response (0–5) | Sentence CEFR (1–5) |
| 4 | Sponsor Pitch | Budget creation (1–5) | Sponsor pitch text (1–5) | — |

**Remedial levels per step:** A1, A2, B1, B2, C1 for all 4 steps.

**Step 4 special endpoints:**
- `POST /api/phase3/step4/evaluate-budget` — evaluates budget cost/funding items
- `POST /api/phase3/step4/evaluate-pitch` — evaluates sponsor pitch text

**Frontend routes pattern:**
```
/phase3/step/{1-4}
/phase3/step/{1-4}/interaction/{1-3}
/phase3/step/{1-4}/score
/phase3/step/{1-4}/remedial/{a1|a2|b1|b2|c1}/task{A|B|C|D}
```

---

### 6.4 Phase 4 — Marketing & Promotion (Part 1, backend steps 1–5)

**Scenario:** Creating social media campaigns, vocabulary for digital marketing.

Backend steps map to frontend steps:

| Backend Step | Frontend Step | Topic |
|-------------|---------------|-------|
| 1 | 1 | Marketing introduction |
| 2 | 2 | Social media vocabulary |
| 3 | 2 | (continuation — vocabulary warm-up sub-step) |
| 4 | 3 | Campaign planning |
| 5 | 4 | Evaluation / review |

The mapping is: `{1:1, 2:2, 3:2, 4:3, 5:4}`.

After step 5 of Phase 4 (part 1), the `_phase4_next_step_url` function returns `/phase4_2/step/1`.

**Remedial levels:** A1, A2, B1, B2, C1 for step 1; A2, B1, B2, C1 for steps 2–5 (no A1 floor for Phase 4_2).

**Frontend routes pattern:**
```
/phase4/step/{1|3|4|5}
/phase4/step/{N}/interaction/{1-3}
/phase4/step/{N}/remedial/{level}/task{A-H}
/phase4_2/step/{1-5}
/phase4_2/step/{N}/interaction/{1-3}
/phase4_2/step/{N}/remedial/{level}/task{A-H}
```

---

### 6.5 Phase 5 — Execution & Problem-Solving

**Scenario — Subphase 1:** Handling a last-minute festival crisis (e.g., singer cancels).  
**Scenario — Subphase 2:** On-the-day event execution decisions.

Both subphases have 5 steps each with the same interaction structure. Steps follow the 5E model:

| Step | Name |
|------|------|
| 1 | Engage |
| 2 | Explore |
| 3 | Explain |
| 4 | Elaborate |
| 5 | Evaluate |

**Interaction patterns vary per step:**
- Interaction 1: game tracking (Wordshake or Sushi Spell), min time 90–120 s → score 0 or 1
- Interaction 2: AI-evaluated spoken/written response → score 2–5
- Interaction 3: game tracking (Sushi Spell), min time 90 s → score 0 or 1

**Vocabulary sets used for AI evaluation:**
- SP1: `alternative, urgent, solution, fix, problem, cancel, change, sorry` (step 1), expanding per step
- SP2: problem-solving and execution vocabulary

**Frontend routes pattern:**
```
/phase5/subphase/{1|2}/step/{1-5}
/phase5/subphase/{1|2}/step/{N}/interaction/{1-3}
/phase5/subphase/{1|2}/step/{N}/score
/phase5/subphase/{1|2}/step/{N}/remedial/{a1|a2|b1|b2|c1}/task/{a-h}
/phase5/subphase/{1|2}/step/{N}/remedial/{level}/results
/phase5/complete
```

---

### 6.6 Phase 6 — Reflection & Evaluation

**Scenario — Subphase 1 (6.1):** Writing a post-event report.  
**Scenario — Subphase 2 (6.2):** Peer feedback discussion using the sandwich technique.

**SP1 vocabulary:** `success, challenge, feedback, improve, achievement, strength, weakness, recommend, summary, positive, negative, evidence, impact, lesson, report`

**SP2 vocabulary:** `feedback, constructive, positive, suggestion, strength, weakness, improve, specific, actionable, polite, balanced, empathy, helpful, sandwich, mindset`

| Step | SP1 Interaction 2 task | SP2 Interaction 2 task |
|------|------------------------|------------------------|
| 1 (Engage) | Reflect on one success + one challenge | Share experience receiving/giving feedback |
| 2 (Explore) | Explain why you organised your summary that way | Explain why you wrote feedback that way |
| 3 (Explain) | Why include both strengths and weaknesses? | Why should feedback be specific? |
| 4 (Elaborate) | Write the Successes & Challenges section | Respond to peer feedback received |
| 5 (Evaluate) | I1: fix spelling; I2: fix grammar; I3: enhance full report | I1: fix spelling; I2: fix tone; I3: restructure into sandwich |

**Note on Step 5:** Interaction 2 is AI-evaluated (scored 2–5) and drives routing. Interactions 1 and 3 are also AI-evaluated (spelling/grammar/tone corrections, scored 2–5 individually but contribute 0/1 to total for routing).

**Remedial levels available:** A2, B1, B2, C1 only (no A1 in Phases 5–6).

**Frontend routes pattern:**
```
/phase6/subphase/{1|2}/step/{1-5}
/phase6/subphase/{1|2}/step/{N}/interaction/{1-3}
/phase6/subphase/{1|2}/step/{N}/score
/phase6/subphase/{1|2}/step/{N}/remedial/{a2|b1|b2|c1}/task/{a-d}
/phase6/complete
```

---

## 7. Backend API Endpoints

### 7.1 Phase 3 (`/api/phase3`)

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/step/{step_id}` | Fetch step metadata |
| POST | `/step/{step_id}/submit` | Submit step response |
| POST | `/step/{step_id}/calculate-score` | Compute total score and determine remedial level |
| POST | `/remedial/log` | Log remedial task completion (analytics) |
| POST | `/remedial/evaluate` | AI-grade free-text remedial answers |
| POST | `/interaction/log` | Log interaction completion |
| POST | `/interaction/{interaction_id}/submit` | Submit interaction response for AI assessment |
| POST | `/step4/evaluate-budget` | Evaluate Step 4 budget creation |
| POST | `/step4/evaluate-pitch` | Evaluate Step 4 sponsor pitch |

### 7.2 Phase 4 (`/api/phase4`)

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/step/{step_id}` | Fetch step data (loads from `phase4.json` for step 1) |
| POST | `/step/{step_id}/interaction/{n}/submit` | Submit interaction response |
| POST | `/step/{step_id}/calculate-score` | Compute score and route to remedial |
| POST | `/4_2/step/{step}/interaction/{n}/submit` | Phase 4_2 interaction submission |
| POST | `/4_2/step/{step}/calculate-score` | Phase 4_2 score calculation and routing |
| POST | `/4_2/step/{step}/remedial/{level}/task-b/evaluate` | AI-grade Phase 4_2 remedial Task B (paragraph, definitions) |
| POST | `/4_2/step/{step}/remedial/{level}/final-score` | Remedial pass/fail computation |
| POST | `/evaluate-writing` | Generic writing evaluation (used by CompareQuestGame, CritiqueChallengeGame) |

### 7.3 Phase 5 (`/api/phase5`)

Phase 5 also hosts gamification sub-services:

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/powerups` | List available power-ups |
| GET | `/powerups/inventory` | Get user power-up inventory |
| POST | `/powerups/purchase` | Purchase power-up with XP |
| POST | `/powerups/use` | Activate a power-up |
| GET | `/collectibles` | List all collectibles |
| GET | `/collectibles/collection` | Get user collection |
| POST | `/collectibles/drop` | Award random collectible after activity |
| GET | `/avatar/items` | List avatar items |
| GET | `/avatar` | Get current avatar |
| POST | `/avatar/purchase` | Purchase avatar item |
| POST | `/avatar/customize` | Update avatar appearance |
| GET | `/adaptive/performance` | Performance summary |
| POST | `/adaptive/track` | Track activity performance |
| GET | `/adaptive/review` | Spaced-repetition review queue |
| POST | `/step{N}/interaction1/track` | Track game completion (I1) |
| POST | `/step{N}/interaction2/evaluate` | AI-evaluate spoken response (I2) |
| POST | `/step{N}/interaction3/track` | Track game completion (I3) |
| POST | `/step{N}/calculate-score` | Compute total + route |
| POST | `/step{N}/remedial/log` | Log remedial task |
| POST | `/step{N}/remedial/{level}/final-score` | Remedial pass/fail |
| GET | `/subphase1/check-completion` | Check if all SP1 steps done (≥12 pts total) |

> Subphase 2 routes use prefix `/subphase2/step{N}/…`

### 7.4 Phase 6 (`/api/phase6`)

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/step{N}/interaction1/track` | Track Wordshake game (SP1) |
| POST | `/step{N}/interaction2/evaluate` | AI-evaluate written response (SP1) |
| POST | `/step{N}/interaction3/track` | Track Sushi Spell game (SP1) |
| POST | `/step{N}/calculate-score` | Compute total + route (SP1) |
| POST | `/step{N}/remedial/log` | Log remedial (SP1) |
| POST | `/step{N}/remedial/{level}/final-score` | Remedial pass/fail (SP1) |
| GET | `/subphase1/check-completion` | SP1 complete? (all 5 steps, ≥12 pts) |
| GET | `/check-phase5-completion` | Phase 5 prerequisite check |
| POST | `/subphase2/step{N}/interaction1/track` | Track game (SP2) |
| POST | `/subphase2/step{N}/interaction2/evaluate` | AI-evaluate response (SP2) |
| POST | `/subphase2/step{N}/interaction3/track` | Track game (SP2) |
| POST | `/subphase2/step{N}/calculate-score` | Compute total + route (SP2) |
| POST | `/subphase2/step{N}/remedial/log` | Log remedial (SP2) |
| POST | `/subphase2/step{N}/remedial/{level}/final-score` | Remedial pass/fail (SP2) |
| GET | `/subphase2/check-completion` | SP2 complete? |

**Phase 6 Step 5 has unique evaluation endpoints (not just track):**

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/step5/interaction1/evaluate-spelling` | AI grades spelling corrections (SP1) |
| POST | `/step5/interaction2/evaluate-grammar` | AI grades grammar corrections (SP1) |
| POST | `/step5/interaction3/evaluate-enhancement` | AI grades full report enhancement (SP1) |
| POST | `/subphase2/step5/interaction1/evaluate` | AI grades spelling correction in feedback (SP2) |
| POST | `/subphase2/step5/interaction2/evaluate` | AI grades tone/politeness improvement (SP2) |
| POST | `/subphase2/step5/interaction3/evaluate` | AI grades feedback restructure into sandwich (SP2) |

---

## 8. Session and State Persistence

### 8.1 Database tables

Progress is stored in SQLite (`backend/fardi.db`) using these tables:

**`student_progress`** — one row per user per phase; tracks the current resume pointer.

```
user_id, phase, subphase, step, interaction, context, is_complete
```

The row is upserted (`ON CONFLICT DO UPDATE`) on every step/interaction start. Context values: `'main'` for normal flow, `'score'` for score pages, `'remedial_{level}'` for remedial tasks.

**`student_responses`** — append-only log of every scored response.

```
user_id, phase, subphase, step, interaction, item_index, context,
item_id, item_type, prompt, response, is_correct, score
```

**`phase5_progress`** and **`phase6_progress`** — dedicated tables for the newer phases.

```
user_id, subphase, step_id, interaction_scores (JSON), total_score,
completed, remedial_level, should_proceed, updated_at
```

### 8.2 Score calculation flow

1. Frontend completes all interactions for a step, storing each score in local React state.
2. Frontend calls `POST /api/phaseN/stepN/calculate-score` with `{interaction1_score, interaction2_score, interaction3_score}`.
3. Backend computes `total_score`, looks up the threshold table, and returns `{remedial_level, should_proceed, next_url}`.
4. Frontend navigates to `next_url` (either next step or first remedial task).
5. After each remedial task, the frontend calls `POST /remedial/log` (analytics only).
6. After the last remedial task, the frontend calls `POST /remedial/{level}/final-score` with `{task_scores: {task_A_score, task_B_score, …}}`.
7. Backend computes pass/fail and returns `{passed, next_url}`.
8. Frontend navigates accordingly.

### 8.3 Authentication

All API routes require a valid JWT Bearer token. The token is issued on login (`POST /api/auth/login`) and must be present in the `Authorization: Bearer <token>` header. The `get_current_user` dependency in FastAPI extracts `user_id` from the token on every protected request.

---

## 9. NPC Reference

| NPC | Role | Typical Phase |
|-----|------|--------------|
| Ms. Mabrouki | Event Coordinator — facilitates, provides guidance | All phases |
| SKANDER | Student Council President — challenges, debates | All phases |
| Emna | Finance & Logistics — budget, scheduling | Phase 3 |
| Ryan | Social Media & Outreach — marketing, digital | Phase 4 |
| Lilia | Artistic Direction — report writing, cultural | Phase 6 |
