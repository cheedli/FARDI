# FARDI — CEFR English Language Assessment Platform

FARDI is a full-stack, gamified English language assessment platform built for Tunisian university students. It places learners inside a realistic cultural event-planning scenario where they converse with AI-powered team members in English, receiving immediate CEFR-aligned feedback and progressing through a structured remedial system.

---

## Table of Contents

1. [What is FARDI?](#1-what-is-fardi)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Prerequisites](#4-prerequisites)
5. [Installation & Local Setup](#5-installation--local-setup)
6. [Environment Variables](#6-environment-variables)
7. [Running the Application](#7-running-the-application)
8. [Production Build](#8-production-build)
9. [The Learning Journey](#9-the-learning-journey)
10. [CEFR Framework](#10-cefr-framework)
11. [Adaptive Scoring & Remedial System](#11-adaptive-scoring--remedial-system)
12. [Characters & NPCs](#12-characters--npcs)
13. [Gamification System](#13-gamification-system)
14. [Exercise Types](#14-exercise-types)
15. [Database Schema](#15-database-schema)
16. [API Overview](#16-api-overview)
17. [Anti-Cheating System](#17-anti-cheating-system)
18. [Admin Dashboard](#18-admin-dashboard)
19. [In-App Documentation](#19-in-app-documentation)
20. [Troubleshooting](#20-troubleshooting)
21. [Contributing](#21-contributing)

---

## 1. What is FARDI?

FARDI (Framework for Adaptive Real-world Dialogue Instruction) is a language assessment tool that disguises evaluation as gameplay. Students join a university committee tasked with organising a Tunisian cultural event. Through natural dialogue and structured tasks they demonstrate English proficiency across six progressive phases. The AI backend evaluates every response in real time against CEFR descriptors and routes the student either forward (if they meet the threshold) or into a remedial chain calibrated to their level.

**Key design principles:**

- **Authentic context** — all tasks are grounded in a coherent Tunisian cultural scenario rather than isolated grammar drills.
- **Adaptive routing** — scores per step automatically determine whether a student advances or enters A1 → A2 → B1 → B2 → C1 remedial practice.
- **AI-powered feedback** — every free-text response is evaluated by a large language model (Groq / Llama 3) using a detailed CEFR rubric.
- **Anti-cheating** — Sapling AI detection plus local heuristics flag AI-generated responses.
- **Gamification** — XP, CEFR badges, streak tracking, and achievements keep motivation high.

---

## 2. Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Frontend framework | React | 18.3 | Single-page application |
| Frontend build tool | Vite | 5.4 | Dev server and production bundler |
| UI library | Material-UI (MUI) | 6.1 | Component library and theming |
| Routing | React Router | 6.26 | Client-side navigation |
| Animation | Framer Motion | 12 | Page and element animations |
| Drag and drop | @dnd-kit | 6/10 | Interactive exercise components |
| Markdown rendering | react-markdown + remark-gfm | 10 / 4 | In-app documentation viewer |
| Charts | Chart.js + react-chartjs-2 | 4.5 | Analytics and progress charts |
| Backend framework | FastAPI | 0.109 | REST API server |
| ASGI server | Uvicorn | 0.27 | HTTP server for FastAPI |
| Database | SQLite (via raw `sqlite3`) | — | User data, progress, assessments |
| Authentication | JWT (python-jose) + HttpOnly cookies | 3.3 | Stateless auth |
| Password hashing | passlib[bcrypt] | 1.7 | Secure credential storage |
| AI assessment | Groq API (Llama 3.1 8B) | groq 0.31 | CEFR evaluation + NPC responses |
| AI detection | Sapling AI API | — | Detect AI-generated responses |
| Text-to-speech | Edge TTS (Microsoft) | 6.1 | Character voice generation |
| Environment config | python-dotenv | 1.0 | `.env` file loading |

---

## 3. Project Structure

```
FARDI/
├── backend/                        # FastAPI server
│   ├── main.py                     # App entry point: routers, CORS, static mounts, SPA catch-all
│   ├── config.py                   # Config classes (Dev / Prod / Testing)
│   ├── auth_utils.py               # JWT creation and verification helpers
│   ├── dependencies.py             # FastAPI dependencies (get_current_user, get_current_admin)
│   ├── requirements-fastapi.txt    # Python dependencies
│   ├── fardi.db                    # SQLite database (keep external in production)
│   │
│   ├── models/
│   │   ├── auth.py                 # DatabaseManager + all table DDL (13 tables)
│   │   ├── game_data.py            # NPCS, BADGES, DIALOGUE_QUESTIONS constants
│   │   ├── gamification_data.py    # Achievement definitions and XP tables
│   │   ├── gamification_models.py  # Gamification DB helpers
│   │   └── phase4_loader.py        # Phase 4 exercise data loader
│   │
│   ├── routers/
│   │   ├── auth.py                 # /api/login, /api/signup, /api/me, /api/profile, password reset
│   │   ├── api.py                  # /api/get-ai-feedback, /start-game, language tips, audio
│   │   ├── admin.py                # /api/admin/* — dashboard, user management, analytics
│   │   ├── evaluation.py           # /api/evaluate-* — CEFR evaluation endpoints
│   │   ├── gamification.py         # /api/gamification/* — XP, badges, achievements, streaks
│   │   ├── progress.py             # /api/progress/* — save and restore phase progress
│   │   ├── phase3.py               # /api/phase3/* — Phase 3 scoring and remedial routing
│   │   ├── phase4.py               # /api/phase4/* — Phase 4 scoring and remedial routing
│   │   ├── phase5.py               # /api/phase5/* — Phase 5 scoring and remedial routing
│   │   ├── phase6.py               # /api/phase6/* — Phase 6 scoring and remedial routing
│   │   └── chat.py                 # /api/chat/* — student/admin chat
│   │
│   ├── services/
│   │   ├── ai_service.py           # Groq API client, Sapling AI detection, local heuristics
│   │   ├── assessment_service.py   # CEFR rubric evaluation, listening assessment, Phase 2 logic
│   │   └── audio_service.py        # Edge TTS voice generation, character voice mapping
│   │
│   ├── utils/
│   │   └── helpers.py              # Level determination, XP calculation, skill assessment
│   │
│   ├── static/
│   │   ├── audio/                  # Generated TTS audio files
│   │   └── images/
│   │       ├── avatars/            # SVG character portraits (lilia.svg, ryan.svg, …)
│   │       └── badges/             # CEFR achievement badge images
│   │
│   ├── sessions/                   # Filesystem session storage (Phase 1 game state)
│   └── migrations/                 # One-off migration scripts
│
├── frontend/                       # React SPA (Vite)
│   ├── public/
│   │   ├── docs/                   # Markdown documentation files (served as static assets)
│   │   └── images/phase4/          # Flashcard vocabulary images
│   │
│   └── src/
│       ├── App.jsx                 # Root component: all React Router <Route> definitions (~2000 lines)
│       ├── theme.jsx               # MUI theme config + ColorModeContext
│       │
│       ├── lib/
│       │   └── api.jsx             # ApiProvider context, useAuth hook, all fetch helpers
│       │
│       ├── hooks/
│       │   ├── useProgressSave.jsx # Debounced progress persistence to backend
│       │   └── useUserStats.jsx    # Fetch and cache user stats for sidebar
│       │
│       ├── components/
│       │   ├── AppLayout.jsx       # App shell: sidebar navigation, dark mode toggle, auth guard
│       │   ├── Avatar.jsx          # Character avatar renderer
│       │   ├── ErrorBoundary.jsx   # React error boundary
│       │   ├── ExerciseRenderer.jsx # Dispatches Phase 1/2 exercise types
│       │   ├── DragDropGapFill.jsx  # Drag-and-drop gap-fill exercise
│       │   ├── DragDropMatchingGame.jsx # Matching game with drag-and-drop
│       │   ├── ChatChallengeGame.jsx    # Chat-style gap-fill (A1/A2)
│       │   ├── DebateDuelGame.jsx       # Debate-format writing exercise (B1)
│       │   ├── CompareQuestGame.jsx     # Comparison writing exercise (B2)
│       │   ├── CritiqueChallengeGame.jsx # Critical analysis writing (C1)
│       │   ├── BillboardDesigner.jsx    # Visual ad copy exercise
│       │   ├── EventPlannerBoard.jsx    # Event planning board exercise
│       │   └── exercises/
│       │       ├── DragAndDropExercise.jsx
│       │       ├── DialogueCompletionExercise.jsx
│       │       ├── SentenceBuilder.jsx
│       │       ├── SentenceGarden.jsx
│       │       ├── ChatMessengerSim.jsx
│       │       ├── PhoneCallSim.jsx
│       │       ├── DebateArena.jsx
│       │       ├── RhythmMatcher.jsx
│       │       └── ConversationTetris.jsx
│       │
│       └── pages/
│           ├── Home.jsx / Login.jsx / Signup.jsx   # Auth pages
│           ├── Dashboard.jsx                        # Student home with phase cards
│           ├── PhaseJourney.jsx                     # Visual phase progress map
│           ├── Game.jsx                             # Phase 1 chat interface
│           ├── Results.jsx / Certificate.jsx        # Assessment output pages
│           ├── Documentation.jsx                    # In-app docs viewer (/documentation)
│           ├── Phase3/ … Phase6/                    # Phase pages (step/interaction/remedial)
│           └── Admin*.jsx                           # Admin dashboard pages
│
├── documentation/                  # Source markdown documentation (10 files)
├── docs/plans/                     # Historical implementation plans
├── ROUTES.md                       # Complete route testing reference
└── visuals.md                      # Asset generation prompts (avatars, badges, scenes)
```

---

## 4. Prerequisites

| Requirement | Minimum version | Notes |
|-------------|----------------|-------|
| Python | 3.10 | 3.11+ recommended |
| pip | any recent | comes with Python |
| Node.js | 18.x | 20.x LTS recommended |
| npm | 9.x | comes with Node |
| Internet access | — | Required for Groq API and Edge TTS |

---

## 5. Installation & Local Setup

### 5.1 Clone the repository

```bash
git clone <repository-url>
cd FARDI
```

### 5.2 Backend setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # macOS / Linux
# venv\Scripts\activate         # Windows

# Install Python dependencies
pip install -r requirements-fastapi.txt
```

### 5.3 Configure environment variables

```bash
cp .env.example .env   # if the example file exists, otherwise create .env manually
```

Edit `.env` — see [Section 6](#6-environment-variables) for the full reference.

### 5.4 Frontend setup

```bash
cd ../frontend
npm install
```

---

## 6. Environment Variables

Create `backend/.env` with the following keys:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GROQ_API_KEY` | **Yes** | — | API key from [console.groq.com](https://console.groq.com). Powers all CEFR assessment and NPC dialogue. |
| `SECRET_KEY` | **Yes** | `dev-secret-key` | Random string used to sign JWT tokens. Use a long random value in production. |
| `SAPLING_API_KEY` | No | — | API key from [sapling.ai](https://sapling.ai). Enables AI-content detection. Falls back to local heuristics when absent. |
| `GROQ_MODEL` | No | `llama-3.1-8b-instant` | Groq model ID. Can be changed to any available Groq model. |
| `FARDI_DATA_DIR` | No | `backend/` directory | Set by Electron when running as a desktop app. Points to the directory containing `fardi.db`. |
| `FARDI_DB_PATH` | No | `<FARDI_DATA_DIR>/fardi.db` | Full path to the SQLite database file. Overrides `FARDI_DATA_DIR`. |

**Minimal `.env` for development:**

```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
SECRET_KEY=change-me-to-a-long-random-string
```

### Getting API keys

**Groq (required):**
1. Visit [console.groq.com](https://console.groq.com) and create a free account.
2. Go to **API Keys** → **Create API Key**.
3. Copy the key into `GROQ_API_KEY`.

**Sapling (optional):**
1. Visit [sapling.ai](https://sapling.ai) and sign up.
2. Navigate to your dashboard to get an API key.
3. Copy the key into `SAPLING_API_KEY`.

---

## 7. Running the Application

FARDI runs as two separate servers in development — one for the backend API and one for the frontend hot-reload dev server.

### Terminal 1 — Backend

```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

The API is now available at:
- **REST API:** `http://localhost:8000/api/`
- **Swagger UI (interactive docs):** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

The React app is available at **`http://localhost:5173`**.

Vite is configured to proxy `/api/*` requests to `http://localhost:8000`, so the frontend and backend communicate transparently without CORS issues in development.

---

## 8. Production Build

In production, the React app is compiled and served as static files directly from FastAPI.

```bash
# 1. Build the React app
cd frontend
npm run build
# Output goes to frontend/dist/

# 2. Copy the build into the backend
cp -r frontend/dist backend/frontend_dist

# 3. Start the production server
cd backend
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 5010
```

The entire application (API + frontend) is now served from `http://localhost:5010`.

FastAPI automatically:
- Serves the React SPA from `/` using a catch-all route
- Serves `/assets/*` (Vite-built JS/CSS bundles)
- Serves `/static/*` (avatars, audio, images)
- Returns the correct `index.html` for any unknown path so React Router handles navigation client-side

### PyInstaller / Electron desktop packaging

The backend detects when it is running inside a PyInstaller bundle via `sys.frozen` and `sys._MEIPASS`. The `FARDI_DATA_DIR` environment variable (set by Electron) controls where `fardi.db` is stored on the end-user's machine, keeping user data outside the frozen application bundle.

---

## 9. The Learning Journey

Students progress linearly through six phases. Each phase is divided into steps, and each step contains three scored interactions followed by a score calculation page that routes the student forward or into a remedial chain.

```
Register / Login
      │
      ▼
Phase 1 — Initial Assessment (9 free-text interactions)
      │   Score → CEFR level assigned (A1–C1)
      ▼
Phase 2 — Committee Roles (4 structured steps)
      │   Each step: 5 action items → score → remedial if needed
      ▼
Phase 3 — Cultural Event Finances & Scheduling (4 steps × 3 interactions)
      │   Step score → A1/A2/B1/B2/C1 remedial chain OR advance
      ▼
Phase 4 — Advertising & Marketing (5 steps × 3 interactions)
      │   Includes vocabulary warm-up + drag-drop and writing exercises
      ▼
Phase 4.2 — Social Media Marketing (5 steps × 3 interactions)
      │   Continuation of Phase 4 with more advanced marketing tasks
      ▼
Phase 5 — Advanced Communication (2 subphases × 5 steps each)
      │   Subphase 1: Presentation skills
      │   Subphase 2: Professional writing
      ▼
Phase 6 — Leadership & Evaluation (2 subphases × 5 steps each)
      │   Subphase 1: Leadership communication
      │   Subphase 2: Critical evaluation
      ▼
Certificate & Results
```

### Phase 1 — Initial Assessment

Nine sequential interactions inside a group chat interface. The student joins Ms. Mabrouki's cultural event planning committee and is prompted to:

1. Introduce themselves
2. Explain their motivation for joining
3. Discuss Tunisian cultural traditions
4. Listen to audio and demonstrate comprehension
5. Brainstorm ideas for cultural activities
6. Navigate a team collaboration scenario
7. Address a planning challenge
8. Discuss abstract cultural concepts
9. Draft a formal planning summary

Every response is evaluated by the Groq LLM using a detailed rubric covering vocabulary range, grammar accuracy, coherence, cultural sensitivity, and professional standards. The overall score determines the student's starting CEFR level.

### Phases 3–6 — Step Structure

Every step follows the same pattern:

```
Step Intro page
    ↓
Interaction 1  →  Interaction 2  →  Interaction 3
    ↓
Score Calculation
    ↓
Score ≥ threshold? ──Yes──→ Next step / Next phase
    ↓ No
Remedial level assigned (A1 / A2 / B1 / B2 / C1)
    ↓
Task A → Task B → Task C → (Task D … F for B1/B2/C1) → Results
    ↓
Results page routes back to the next step
```

---

## 10. CEFR Framework

FARDI uses the **Common European Framework of Reference for Languages** to describe and assess language ability.

| Level | Label | Description | Typical student |
|-------|-------|-------------|----------------|
| A1 | Beginner | Can use familiar everyday expressions and basic phrases | First-year students with minimal English exposure |
| A2 | Elementary | Can communicate in simple routine tasks and familiar situations | Students who have studied English for 1–2 years |
| B1 | Intermediate | Can deal with most situations while travelling; produce simple connected text | Mid-level students who can express opinions |
| B2 | Upper-Intermediate | Can interact fluently with native speakers; produce clear, detailed text | Students approaching professional proficiency |
| C1 | Advanced | Can express ideas fluently and spontaneously; use language flexibly | Students with near-native proficiency |

### Assessment criteria

Each free-text response is scored across these dimensions:

| Criterion | Weight | What is measured |
|-----------|--------|-----------------|
| Vocabulary range | 30 % | Complexity and variety of word choice |
| Grammar accuracy | 20 % | Sentence structure, tense, agreement |
| Fluency & coherence | 30 % | Logical organisation and natural flow |
| Relevance | 20 % | On-topic, appropriate to context |
| Cultural competency | bonus | Awareness of Tunisian context |
| Professional standards | penalty/bonus | Capitalisation, formality, business register |

---

## 11. Adaptive Scoring & Remedial System

### Score thresholds (per step)

| Phase | Advance threshold | A1 remedial | A2 remedial | B1+ remedial |
|-------|------------------|-------------|-------------|--------------|
| Phase 2 | ≥ 15 points | < 10 | 10–14 | — |
| Phase 3 Step 1 | ≥ 6 points | < 3 | 3–4 | 5 |
| Phase 3 Steps 2–4 | ≥ 6 points | < 3 | 3–4 | 5 |
| Phase 4 Step 3 | ≥ 6 points | < 3 | 3–4 | 5 (→ B1/B2/C1) |
| Phase 5 / 6 | ≥ 3 points | < 2 | 2 | (→ B1/B2/C1) |

> Exact thresholds are defined in each phase router (`backend/routers/phase3.py`, etc.) and in `backend/utils/helpers.py`.

### Remedial chains

Each CEFR level has a dedicated set of tasks. Tasks chain automatically: completing Task A unlocks Task B, and so on. A **Results** page at the end of the chain logs the score and navigates the student back to the main step flow.

| Level | Tasks | Typical exercise types |
|-------|-------|----------------------|
| A1 | 2–3 tasks | Vocabulary matching, simple gap-fill, basic sentence building |
| A2 | 3 tasks | Dialogue completion, guided writing, short reading comprehension |
| B1 | 4–6 tasks + Results | Extended dialogue, drag-and-drop gap-fill, paragraph writing |
| B2 | 4–6 tasks + Results | Comparison writing, error correction, formal email drafting |
| C1 | 6–8 tasks + Results | Critical analysis, debate writing, complex argumentation |

---

## 12. Characters & NPCs

All NPCs appear as AI-powered conversation partners in the Phase 1 chat interface and as instructors in exercise pages.

| Character | Role | Personality | Voice |
|-----------|------|-------------|-------|
| **Ms. Mabrouki** | Event Coordinator | Organised, encouraging, detail-oriented | `en-GB-SoniaNeural` |
| **Skander** | Student Council President | Charismatic, energetic, visionary | `en-US-GuyNeural` |
| **Emna** | Committee Member — Finance | Practical, precise, reliable | `en-US-JennyNeural` |
| **Ryan** | Committee Member — Social Media | Creative, tech-savvy, social | `en-AU-WilliamNeural` |
| **Lilia** | Committee Member — Arts | Artistic, thoughtful, culturally passionate | `en-US-AriaNeural` |

Character avatars are SVG files stored in `backend/static/images/avatars/`. Each NPC has a defined background story used to ground AI-generated responses in character.

---

## 13. Gamification System

### XP (Experience Points)

Students earn XP for completing interactions and steps. XP is tracked in the `assessment_results` table and displayed on the Dashboard and Profile pages.

### CEFR Badges

Badges are awarded based on the overall CEFR level reached at the end of Phase 1.

| Badge | CEFR Level | Image file |
|-------|-----------|-----------|
| Newcomer | A1 | `newcomer.jpg` |
| Explorer | A2 | `badge-a2.png` |
| Adventurer | B1 | `badge-b1.png` |
| Navigator | B2 | `badge-b2.png` |
| Ambassador | C1 | `badge-c1.png` |

### Achievements

Named achievements are unlocked by in-game events (completing a phase, achieving a perfect score on a step, maintaining a streak, etc.). Achievement definitions are in `backend/models/gamification_data.py`.

### Streaks

A daily login streak is tracked in the database. The streak counter is displayed in the sidebar and on the Dashboard.

### Phase progression levels

Progress through the platform maps to named progression milestones:

| Milestone | Required CEFR level |
|-----------|-------------------|
| Orientation | None |
| Planning | A2 |
| Coordination | B1 |
| Execution | B2 |
| Leadership | C1 |

---

## 14. Exercise Types

FARDI uses over 15 distinct exercise component types. Each is a self-contained React component.

| Component | Interaction type | Typical CEFR level |
|-----------|----------------|-------------------|
| `ChatChallengeGame` | Gap-fill in a chat interface | A1–A2 |
| `DragDropGapFill` | Drag words into blanks | A1–B1 |
| `DragDropMatchingGame` | Match pairs via drag-and-drop | A1–A2 |
| `DialogueCompletionExercise` | Choose/type the next line in a dialogue | A2–B1 |
| `SentenceBuilder` | Arrange word tiles to form sentences | A1–A2 |
| `SentenceGarden` | Plant words to grow complete sentences | A1–A2 |
| `DebateDuelGame` | Write arguments for a debate | B1–B2 |
| `CompareQuestGame` | Compare two items in formal writing | B2 |
| `CritiqueChallengeGame` | Critique and evaluate a text | C1 |
| `BillboardDesigner` | Write copy for an advertising billboard | B1–B2 |
| `EventPlannerBoard` | Organise tasks on a planning board | B1–B2 |
| `ChatMessengerSim` | Simulated chat conversation | B1–B2 |
| `PhoneCallSim` | Simulated phone call transcript | B1–C1 |
| `DebateArena` | Structured debate format | B2–C1 |
| `RhythmMatcher` | Match phrases to communicative functions | A2–B1 |
| `ConversationTetris` | Order conversation turns correctly | A2–B1 |

---

## 15. Database Schema

FARDI uses a single SQLite file (`fardi.db`). All tables are created automatically on first startup by `DatabaseManager.init_database()` in `backend/models/auth.py`.

| Table | Purpose |
|-------|---------|
| `users` | User accounts: credentials, profile, admin flag |
| `user_sessions` | Active session tokens with IP and expiry |
| `password_reset_tokens` | One-time tokens for password reset flow |
| `email_verification_tokens` | One-time tokens for email verification |
| `user_preferences` | Per-user settings (notifications, theme, difficulty) |
| `assessment_results` | Phase 1 assessment outcomes (CEFR level, XP, full JSON) |
| `phase2_progress` | Step-by-step progress through Phase 2 |
| `phase2_responses` | Individual responses in Phase 2 steps |
| `phase2_remedial` | Remedial activity completion records for Phase 2 |
| `user_phase_completion` | Top-level completion flag per user per phase |
| `phase5_progress` | Step and subphase progress for Phase 5 |
| `phase5_remedial` | Remedial task scores for Phase 5 |
| `phase6_progress` | Step and subphase progress for Phase 6 |
| `phase6_remedial` | Remedial task scores for Phase 6 |

Progress for Phases 3 and 4 is persisted via the generic `progress` router endpoints (`/api/progress/save` and `/api/progress/load`) and stored as JSON blobs.

### Resetting the database

Delete `backend/fardi.db` and restart the backend. All tables are recreated automatically. **This erases all user accounts and progress.**

---

## 16. API Overview

The backend exposes a REST API under `/api/`. Authentication uses **HttpOnly JWT cookies** — no `Authorization` header is required once logged in.

### Authentication

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/login` | Log in with username + password; sets `access_token` cookie (30-day expiry) |
| `POST` | `/api/signup` | Register a new user account |
| `GET` | `/api/me` | Return the currently authenticated user |
| `GET` | `/api/logout` | Clear the auth cookie |
| `GET` | `/api/profile` | Full profile data for the current user |
| `POST` | `/api/edit-profile` | Update first name, last name, email |
| `POST` | `/api/change-password` | Change password (requires current password) |
| `POST` | `/api/delete-account` | Permanently delete the current user account |
| `POST` | `/api/forgot-password` | Initiate password reset (generates a token) |
| `POST` | `/api/reset-password` | Complete password reset with token + new password |
| `GET` | `/api/check-username?username=…` | Check if a username is available |
| `GET` | `/api/check-email?email=…` | Check if an email is already registered |

### Game API

| Method | Path | Description |
|--------|------|-------------|
| `GET/POST` | `/start-game` | Start or resume a Phase 1 game session |
| `POST` | `/api/get-ai-feedback` | Submit a Phase 1 response; returns CEFR assessment + AI feedback |
| `GET` | `/api/language-tips` | Personalised language tips for the current user |
| `POST` | `/api/check-ai-response` | Run AI-detection check on a submitted response |
| `POST` | `/api/generate-audio` | Generate TTS audio for a given text string |

### Phase APIs

Each phase router follows the same pattern:

```
POST /api/phase{N}/step/{step}/calculate-score   → compute step score, determine remedial level
POST /api/phase{N}/step/{step}/interaction/{i}/evaluate  → evaluate a single interaction response
POST /api/phase{N}/step/{step}/remedial/{level}/log  → record remedial task completion
POST /api/phase{N}/step/{step}/remedial/{level}/final-score  → finalise remedial chain score
```

Phase 4 has additional vocabulary and writing-specific endpoints. Phase 4.2 routes are prefixed with `/api/phase4/4_2/`.

### Progress API

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/progress/save` | Persist a JSON blob of phase/step/interaction progress |
| `GET` | `/api/progress/load` | Retrieve previously saved progress for the current user |

### Gamification API

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/gamification/stats` | XP, streak, badges, achievements for current user |
| `POST` | `/api/gamification/award-xp` | Award XP for a completed action |
| `POST` | `/api/gamification/check-achievements` | Evaluate and unlock any newly earned achievements |
| `GET` | `/api/gamification/leaderboard` | Top users by XP |

### Admin API (requires `is_admin = 1`)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/admin/users` | List all users |
| `GET` | `/api/admin/users/{id}` | Detailed profile and progress for a specific user |
| `GET` | `/api/admin/analytics` | Aggregate platform statistics |
| `GET` | `/api/admin/progress/{user_id}` | Phase-by-phase progress for a specific user |
| `GET` | `/api/health` | Health check — returns `{"status": "ok"}` |

Full interactive API documentation is auto-generated by FastAPI and available at `http://localhost:8000/docs` when the backend is running.

---

## 17. Anti-Cheating System

FARDI employs a layered approach to detecting AI-generated student responses.

### Layer 1 — Sapling AI API

When `SAPLING_API_KEY` is configured, every free-text submission is sent to Sapling's `/aidetect` endpoint. The API returns a probability score (0–1). A score above the configured threshold flags the response.

### Layer 2 — Local heuristics (always active)

If Sapling is unavailable or the API key is not set, a local classifier runs instead. It analyses:

- **Response length** — suspiciously long, perfectly-formatted responses are flagged.
- **AI-typical phrasing** — a dictionary of common LLM phrases ("As an AI language model…", "Certainly!", etc.).
- **Type-token ratio** — unusually high lexical diversity relative to text length.
- **Sentence length variance** — AI text tends to have unusually consistent sentence lengths.
- **Trigram repetition** — detects paraphrased repetition across paragraphs.

### Response handling

When an AI-generated response is detected, the platform does not penalise harshly. Instead, the student receives guidance encouraging authentic expression. This maintains a supportive educational tone while discouraging shortcutting the learning process.

---

## 18. Admin Dashboard

Admin accounts can access the dashboard at `/admin`. An account is made an admin by setting `is_admin = 1` directly in the database:

```sql
UPDATE users SET is_admin = 1 WHERE username = 'your_username';
```

The admin dashboard provides:

- **User list** (`/admin/users`) — search, filter, and view all registered users.
- **User viewer** (`/admin/users/:id`) — full profile, assessment history, and phase progress for a specific student.
- **Analytics** (`/admin/analytics`) — aggregate statistics: user count, completion rates, average CEFR levels, XP distribution.
- **Student progress** (`/api/admin/progress/:id`) — detailed per-phase progress breakdown.
- **Chat** (`/admin/chat`) — view and respond to student messages.

---

## 19. In-App Documentation

A documentation viewer is built into the application at `/documentation`. It renders all 10 markdown documentation files in a two-panel layout (sidebar navigation + content area) with full clay/bento theme styling, code block highlighting, and table rendering.

The markdown source files live in `documentation/` and are served as static assets from `frontend/public/docs/`. If you update the source markdown files, copy them again:

```bash
cp documentation/*.md frontend/public/docs/
```

---

## 20. Troubleshooting

### Backend won't start

**Symptom:** `ModuleNotFoundError` or import errors.  
**Fix:** Ensure the virtual environment is activated (`source venv/bin/activate`) and dependencies are installed (`pip install -r requirements-fastapi.txt`).

### Groq API errors

**Symptom:** Assessment returns generic fallback scores; terminal shows `GroqError`.  
**Fix:** Verify `GROQ_API_KEY` in `.env`. Check your Groq console for quota limits. The application falls back to a simple word-count-based heuristic when Groq is unavailable.

### Audio not playing

**Symptom:** TTS audio requests fail or return empty.  
**Fix:** Edge TTS requires an active internet connection (it calls Microsoft's TTS service). Check network connectivity. The application degrades gracefully — exercises remain functional without audio.

### CORS errors in browser console

**Symptom:** Frontend requests fail with "blocked by CORS policy".  
**Fix:** In development, the Vite dev server proxies requests to the backend. Ensure the backend is running on port 8000 and the frontend on port 5173. In production, CORS is not an issue because both are served from the same origin.

### Database errors

**Symptom:** `OperationalError: no such table …`.  
**Fix:** The database is initialised on the first API request that touches the database. If the file is corrupted, delete `backend/fardi.db` and restart — tables are recreated automatically.

### Port conflicts

**Symptom:** `address already in use` on startup.  
**Fix:**
```bash
# Find and kill the process using port 8000 (backend)
lsof -ti:8000 | xargs kill
# Find and kill the process using port 5173 (frontend)
lsof -ti:5173 | xargs kill
```

### Frontend build fails

**Symptom:** Vite build errors referencing missing modules.  
**Fix:** Delete `node_modules` and reinstall:
```bash
cd frontend
rm -rf node_modules
npm install
```

---

## 21. Contributing

### Development workflow

1. Create a feature branch from `main`.
2. For backend changes: add or modify the relevant router in `backend/routers/`, add data in `backend/models/` if needed, and register any new router in `backend/main.py`.
3. For frontend changes: add the new page in `frontend/src/pages/`, add its import and `<Route>` in `frontend/src/App.jsx`, and follow the clay/bento theme patterns used in existing pages.
4. Test locally with both servers running.
5. Open a pull request with a description of the changes.

### Code conventions

- **Python:** PEP 8. All route handlers are `async`. Use `Depends(get_current_user)` for protected endpoints.
- **JavaScript/React:** Functional components with hooks only. Named exports for pages, default export for the component. MUI `sx` prop for all styling — no separate CSS files.
- **Clay/bento theme:** Every page defines a local `LIGHT` / `DARK` palette constant and uses `useTheme()` + `theme.palette.mode` to select it. Card style: `borderRadius: 3`, `border: 2px solid`, `boxShadow: 4px 4px 0px` with the border colour.
- **No comments** unless the reason is non-obvious.

### Adding a new phase step

1. **Backend:** Add a scoring endpoint to the relevant phase router. Add interaction data to `game_data.py` or the phase loader. Register in `main.py` if it's a new router.
2. **Frontend:** Create the step folder under `frontend/src/pages/Phase{N}/Step{X}/` with `index.jsx`, `Interaction1.jsx`–`Interaction3.jsx`, `ScoreCalculation.jsx`, and remedial subfolders. Add all imports and `<Route>` entries to `App.jsx`.

---

## License

This project is intended for academic and educational use. Contact the maintainers for licensing information.

---

*FARDI — Framework for Adaptive Real-world Dialogue Instruction*  
*Built for language learning and cultural exchange at Tunisian universities.*
