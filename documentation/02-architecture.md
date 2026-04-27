# FARDI — Technical Architecture

This document is the definitive technical reference for the FARDI codebase. It is written for a developer who is new to the project and needs to understand how the pieces fit together before making changes.

---

## 1. Full Directory Tree

```
FARDI/
├── documentation/           # This directory — project docs
├── backend/                 # FastAPI application (Python)
│   ├── main.py              # App bootstrap: CORS, routers, static, SPA catch-all
│   ├── config.py            # Config classes (Dev / Prod / Test), env vars
│   ├── dependencies.py      # Module-level singletons: db_manager, user_manager
│   ├── auth_utils.py        # JWT creation, cookie helpers, FastAPI dependencies
│   ├── requirements-fastapi.txt
│   ├── fardi.db             # SQLite database (keep external for deployments)
│   ├── sessions/            # Filesystem session storage (legacy, minimal use)
│   ├── static/
│   │   ├── audio/           # Pre-generated Edge TTS MP3 files (NPC voices)
│   │   └── images/
│   │       └── avatars/     # NPC avatar images served at /static/images/avatars/
│   ├── models/
│   │   ├── auth.py          # DatabaseManager, User, AssessmentHistory classes + all DDL
│   │   ├── game_data.py     # NPCS, DIALOGUE_QUESTIONS, CEFR_LEVELS, BADGES, ACHIEVEMENTS,
│   │   │                    # PHASE_2_STEPS, PHASE_2_REMEDIAL_ACTIVITIES, scoring constants
│   │   └── gamification_data.py  # PLAYER_LEVELS, ACHIEVEMENTS catalog, RARITY_TIERS
│   ├── routers/
│   │   ├── auth.py          # /auth/* — register, login, logout, profile, password reset
│   │   ├── admin.py         # /admin/* — user management, system statistics
│   │   ├── api.py           # /api/* — game state, AI feedback, Phase 2 sessions, audio
│   │   ├── evaluation.py    # /api/evaluate-* — writing, gap-fill, sentence, expansion eval
│   │   ├── gamification.py  # /api/gamification/* — XP, achievements, streaks, dashboard
│   │   ├── progress.py      # /api/progress/* — save/resume/complete cross-phase progress
│   │   ├── phase3.py        # /api/phase3/* — Phase 3 scoring and remedial routing
│   │   ├── phase4.py        # /api/phase4/* — Phase 4 scoring and remedial routing
│   │   ├── phase5.py        # /api/phase5/* — Phase 5 scoring and remedial routing
│   │   ├── phase6.py        # /api/phase6/* — Phase 6 scoring and remedial routing
│   │   └── chat.py          # /api/chat/* — student ↔ NPC chat endpoints
│   ├── services/
│   │   ├── ai_service.py         # Groq API client, Sapling AI detection, local heuristics
│   │   ├── assessment_service.py # CEFR response assessment, listening eval, Phase 2 & remedial
│   │   ├── audio_service.py      # Edge TTS wrapper, NPC voice mapping, file management
│   │   ├── xp_service.py         # XP award, history, daily XP, player level progression
│   │   ├── achievement_service.py# Achievement unlock checks, unseen queue, catalog
│   │   ├── streak_service.py     # Daily streak tracking, freeze tokens, leaderboard
│   │   ├── adaptive_service.py   # Adaptive difficulty helpers
│   │   ├── avatar_service.py     # Avatar management
│   │   ├── collectible_service.py# Collectible items
│   │   └── powerup_service.py    # Power-up mechanics
│   └── utils/
│       └── helpers.py        # determine_overall_level, skill_levels_from_assessments,
│                             # calculate_achievements, calculate_xp, get_challenges_by_level,
│                             # get_tips_by_level, get_xp_reward_by_level
│
└── frontend/                # React SPA (Vite)
    ├── vite.config.js
    ├── package.json
    ├── dist/                # Production build output (git-ignored)
    └── src/
        ├── main.jsx         # React root: BrowserRouter + ThemeProvider wrapping <App/>
        ├── App.jsx          # All React Router <Route> definitions (~1400 lines)
        ├── theme.jsx        # MUI theme, ColorModeContext, useColorMode hook
        ├── index.css        # Global CSS resets
        ├── lib/
        │   ├── api.jsx      # ApiProvider context, useAuth, useApiContext; all fetch() calls
        │   ├── phase5_api.jsx  # Phase 5-specific API helpers
        │   └── phase6_api.jsx  # Phase 6-specific API helpers
        ├── hooks/
        │   └── useUserStats.jsx  # Hook for fetching user gamification stats
        ├── components/
        │   ├── AppLayout.jsx     # Authenticated shell: collapsible sidebar + Outlet
        │   ├── LandingLayout.jsx # Public shell: top bar + Outlet
        │   ├── ErrorBoundary.jsx # React error boundary wrapper
        │   └── gamification/     # ConfettiCannon, achievement popups, XP widgets
        ├── pages/
        │   ├── Home.jsx          # Landing / marketing page
        │   ├── Login.jsx         # Login form
        │   ├── Signup.jsx        # Registration form
        │   ├── Dashboard.jsx     # Student home: phase cards, XP, streak, achievements
        │   ├── Game.jsx          # Phase 1 interaction loop
        │   ├── Results.jsx       # Phase 1 results + certificate link
        │   ├── Certificate.jsx   # Printable CEFR certificate
        │   ├── Phase1Intro.jsx   # Phase 1 intro screen
        │   ├── Phase2*.jsx       # Phase 2 intro, steps, remedial, complete pages
        │   ├── Phase3/           # Phase 3 steps (Step1–Step4), each with:
        │   │   └── StepN/        #   index.jsx (intro), Interaction1-3.jsx,
        │   │       └── RemedialXX/  # ScoreCalculation.jsx, RemedialA1/…/C1 tasks
        │   ├── Phase4Step1/      # Phase 4.1 steps (same structure as Phase 3)
        │   ├── Phase4Step2-4/    # Additional Phase 4.1 steps
        │   ├── Phase4SubPhase2/  # Phase 4.2 steps (social media marketing)
        │   ├── Phase5*/          # Phase 5 SubPhase1 and SubPhase2, 5 steps each
        │   ├── Phase6*/          # Phase 6 SubPhase1 and SubPhase2, 5 steps each
        │   ├── PhaseJourney.jsx  # Visual map of all phases and completion status
        │   ├── Characters.jsx    # NPC character gallery
        │   ├── Profile.jsx       # User profile view
        │   ├── EditProfile.jsx   # Profile edit form
        │   ├── ChangePassword.jsx
        │   ├── DeleteAccount.jsx
        │   ├── AdminDashboard.jsx
        │   ├── AdminUserList.jsx
        │   ├── AdminUserViewer.jsx
        │   ├── AdminAnalytics.jsx
        │   ├── AdminChat.jsx
        │   └── StudentChat.jsx
        ├── animations/      # Lottie or CSS animation assets
        ├── services/        # Frontend-side service helpers
        ├── styles/          # Additional CSS modules
        └── utils/           # Frontend utility functions
```

---

## 2. FastAPI Application Bootstrap

**File:** `backend/main.py`

The application is created with:

```python
app = FastAPI(title="FARDI API", version="1.0.0")
```

### CORS

CORS is configured to accept requests from the Vite dev server and the Electron-packaged app:

```python
allow_origins=["http://localhost:5173", "http://localhost:5010"]
allow_credentials=True   # required for httpOnly cookies
allow_methods=["*"]
allow_headers=["*"]
```

In the PyInstaller build, the frontend is bundled into the same process and served by FastAPI itself, so CORS is not strictly needed in production — but it is still present for dev compatibility.

### Router Registration Order

Routers are registered in this order (order matters because FastAPI matches routes top-to-bottom):

1. `auth_router` — prefix `/auth`
2. `admin_router` — prefix `/admin`
3. `gamification_router` — prefix `/api/gamification`
4. `evaluation_router` — prefix `/api`
5. `api_router` — prefix `/api`
6. `phase3_router` — prefix `/api/phase3`
7. `phase4_router` — prefix `/api/phase4`
8. `phase5_router` — prefix `/api/phase5`
9. `phase6_router` — prefix `/api/phase6`
10. `chat_router` — prefix `/api/chat`
11. `progress_router` — prefix `/api/progress`

A health check endpoint is registered at `/api/health` directly on `app`.

### Special Route: `/start-game`

The frontend calls `/start-game` (not `/api/start-game`) to initialize a game session. This route is registered at root level on `app` directly, borrowing the handler from `api_router`:

```python
@app.api_route("/start-game", methods=["GET", "POST"])
async def start_game_root(user: dict = Depends(get_current_user)):
    return await _start_game_handler(user=user)
```

### Static Files

```python
app.mount("/static", StaticFiles(directory=".../static"), name="static")
```

This serves NPC audio files (`/static/audio/*.mp3`) and avatar images.

### SPA Catch-All

When the frontend is built and copied into `frontend_dist/` (adjacent to `main.py` in the PyInstaller bundle), FastAPI serves it:

```python
app.mount("/assets", StaticFiles(directory="frontend_dist/assets"), name="assets")

@app.get("/{full_path:path}", include_in_schema=False)
async def serve_spa(full_path: str = ""):
    if full_path.startswith("api/") or full_path.startswith("static/"):
        raise HTTPException(status_code=404)
    return FileResponse("frontend_dist/index.html")
```

This must be registered last so it does not shadow any API routes.

### PyInstaller / Electron Mode

When bundled by PyInstaller:
- `sys._MEIPASS` is set to the extraction directory and is used as the base path for static assets.
- `FARDI_DATA_DIR` environment variable (set by Electron) points to the external data folder containing `fardi.db`.
- Uvicorn is started with the `app` object directly (not by string import) because module discovery does not work inside a frozen bundle.

---

## 3. Authentication Flow

FARDI uses **JWT tokens stored in httpOnly cookies** (not localStorage). This replaces an earlier Flask filesystem session system.

**File:** `backend/auth_utils.py`

### JWT Configuration

```
Algorithm: HS256
Expiry: 30 days
Secret: SECRET_KEY env var (falls back to "dev-secret-key")
Cookie name: access_token
Cookie flags: httpOnly=True, samesite="lax", secure=False (set True in prod with HTTPS)
```

### Registration Flow

```
POST /auth/api/signup
  |
  +-- Validate: username (3-20 chars, alphanumeric+underscore)
  |             email (regex)
  |             password (min 8, uppercase, lowercase, digit)
  |
  +-- user_manager.create_user(username, email, sha256_hash(password+salt))
  |   Creates user + default user_preferences row
  |
  +-- create_access_token({user_id, username, email, is_admin=False, role="user"})
  |
  +-- set_auth_cookie(response, token)   ← httpOnly cookie
  |
  --> JSONResponse({success: True, user: {...}})
```

### Login Flow

```
POST /auth/api/login
  |
  +-- user_manager.authenticate_user(username_or_email, password)
  |   (SHA-256 verify: stored "salt:hash" format)
  |
  +-- create_access_token({user_id, username, email, first_name, last_name, is_admin, role})
  |
  +-- set_auth_cookie(response, token)
  |
  --> JSONResponse({success: True, redirect_url: "/dashboard" or "/admin", user: {...}})
```

### Token Verification on Protected Routes

```python
# auth_utils.py
async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, ...)
    payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    return payload  # {user_id, username, email, is_admin, role}
```

This dependency is injected into protected route handlers via `Depends(get_current_user)`.

Three dependency variants exist:
- `get_current_user` — raises 401 if not authenticated
- `get_current_admin` — raises 403 if not admin (chains on `get_current_user`)
- `get_optional_user` — returns `None` if not authenticated (used for `/auth/api/me`)

### Session Check on App Load

On every app load, the frontend calls:

```
GET /auth/api/me   (with credentials: 'include')
```

This reads the cookie and returns `{authenticated: true, user: {...}}` or `{authenticated: false}`. The `ApiProvider` in `lib/api.jsx` stores the result in React state.

### Password Hashing

Passwords are hashed using Python's `hashlib.sha256` with a random 16-byte hex salt:

```python
salt = secrets.token_hex(16)
hash  = sha256(password + salt).hexdigest()
stored = f"{salt}:{hash}"
```

Note: this is a custom implementation. For a production deployment with a larger user base, consider migrating to `bcrypt` (already in requirements via `passlib[bcrypt]`).

### Password Reset

Tokens are generated with `secrets.token_urlsafe(32)`, stored in `password_reset_tokens` with a 1-hour expiry. The current implementation logs the token to stdout — an email-sending integration point is marked in the code.

---

## 4. Database Schema

**Driver:** Python `sqlite3` (raw SQL, no ORM)
**File:** `backend/fardi.db` (external in production, adjacent to `main.py` in dev)
**Initialization:** All `CREATE TABLE IF NOT EXISTS` statements run in `DatabaseManager.init_database()` on startup (`backend/models/auth.py`).

### Core Tables

#### `users`
| Column             | Type      | Notes                                   |
|--------------------|-----------|-----------------------------------------|
| id                 | INTEGER PK| Auto-increment                          |
| username           | TEXT UNIQUE| 3-20 chars, alphanumeric+underscore    |
| email              | TEXT UNIQUE|                                        |
| password_hash      | TEXT      | `"salt:sha256hash"` format             |
| first_name         | TEXT      |                                        |
| last_name          | TEXT      |                                        |
| created_at         | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP              |
| last_login         | TIMESTAMP |                                        |
| is_active          | BOOLEAN   | Default 1; set 0 on account deletion   |
| email_verified     | BOOLEAN   | Default 0                              |
| profile_picture    | TEXT      |                                        |
| preferred_language | TEXT      | Default 'en'                           |
| timezone           | TEXT      | Default 'UTC'                          |
| role               | TEXT      | 'user' or 'admin'                      |
| is_admin           | BOOLEAN   | Default 0                              |

#### `password_reset_tokens`
| Column     | Type      | Notes                     |
|------------|-----------|---------------------------|
| id         | INTEGER PK|                           |
| user_id    | INTEGER FK| → users.id ON DELETE CASCADE|
| token      | TEXT UNIQUE| `secrets.token_urlsafe(32)`|
| created_at | TIMESTAMP |                           |
| expires_at | TIMESTAMP | now + 1 hour              |
| used       | BOOLEAN   | Set 1 after use           |

#### `user_sessions`
Tracks active sessions with IP and user-agent for enhanced session management. Not used by the main JWT flow but available for audit.

#### `assessment_results`
Stores Phase 1 (Foundation) assessment outcomes.
| Column             | Type    | Notes                          |
|--------------------|---------|--------------------------------|
| id                 | INTEGER PK|                              |
| user_id            | INTEGER FK|                              |
| session_id         | TEXT    | UUID for the game session      |
| overall_level      | TEXT    | A1–C1                          |
| xp_earned          | INTEGER |                                |
| time_taken         | INTEGER | seconds                        |
| completed_at       | TIMESTAMP|                              |
| skill_levels       | TEXT    | JSON: {vocabulary, grammar, ...}|
| achievements       | TEXT    | JSON array of achievement IDs  |
| responses          | TEXT    | JSON array of raw responses    |
| assessments        | TEXT    | JSON array of assessment dicts |
| ai_usage_percentage| REAL    | % of responses flagged as AI   |

#### `game_sessions`
Phase 1 server-side session state, persisted per user (one row per user, upserted on each step).
| Column                    | Type    |
|---------------------------|---------|
| user_id                   | INTEGER PK (FK)|
| current_step              | INTEGER |
| responses                 | TEXT JSON|
| assessments               | TEXT JSON|
| xp                        | INTEGER |
| start_time                | TEXT    |
| player_name               | TEXT    |
| phase1_completed          | BOOLEAN |
| overall_level             | TEXT    |
| phase2_session_id         | TEXT    |
| phase2_responses          | TEXT JSON|
| phase2_assessments        | TEXT JSON|
| phase2_remedial_responses | TEXT JSON|
| phase2_level_completed    | TEXT JSON|
| phase2_current_level      | TEXT JSON|
| phase2_level_progress     | TEXT JSON|
| remedial_completed        | TEXT JSON|
| updated_at                | TIMESTAMP|

#### `phase2_progress` / `phase2_responses` / `phase2_remedial`
Phase 2-specific tracking tables with step-level granularity, remedial completion flags, and per-response CEFR assessments.

#### `student_progress`
Generic cross-phase resume pointer. One row per (user, phase) pair. Holds the last visited (subphase, step, interaction, item_index, context). The `UNIQUE(user_id, phase)` constraint means this is upserted on every save.

#### `student_responses`
Individual item responses across all phases. Every answered question, gap-fill, matching item, etc. is inserted here with full context metadata.

Key columns:
- `phase`, `subphase`, `step`, `interaction`, `context` — position in the learning tree
- `item_type` — e.g., "gap_fill", "matching", "writing"
- `item_id` — identifier within the interaction
- `response` — the student's answer (stored as string or JSON)
- `is_correct`, `score`, `ai_feedback` — evaluation results

Index: `idx_student_responses_lookup` on `(user_id, phase, step, interaction, context)`.

#### `phase5_progress` / `phase5_remedial` / `phase6_progress` / `phase6_remedial`
Phase-specific tables mirroring the Phase 2 structure, with `subphase` column to distinguish SubPhase 1 vs SubPhase 2.

#### `remedial_scores`
Per-step remedial task scores for Phases 4–6. One row per (user, phase, step, level) combination with individual task scores (task_a through task_f) and a `passed` boolean.

#### `user_phase_completion`
Canonical completion record. One row per (user, phase_number) with `completed`, `completion_date`, `final_level`, and `overall_score`. Used by the Dashboard to show which phases are unlocked.

#### `user_preferences`
One row per user, holds notification settings, difficulty preference, and theme preference.

#### Exercise Builder Tables (admin feature)
`workflows`, `exercise_instances`, `user_workflow_progress`, `exercise_responses`, `custom_characters`, `media_assets`, `workflow_templates`, `assessment_rubrics`, `exercises` — these support an admin-facing exercise builder system.

### Relationships Summary

```
users (1)
  ├── (N) assessment_results
  ├── (1) game_sessions
  ├── (N) phase2_progress
  ├── (N) phase2_responses
  ├── (N) phase2_remedial
  ├── (1 per phase) student_progress
  ├── (N) student_responses
  ├── (1 per phase) user_phase_completion
  ├── (1) user_preferences
  ├── (N) phase5_progress / phase5_remedial
  ├── (N) phase6_progress / phase6_remedial
  ├── (N) remedial_scores
  └── (N) password_reset_tokens
```

---

## 5. Service Layer Deep Dive

### 5.1 `AIService` (`services/ai_service.py`)

Responsible for all Groq LLM calls and AI detection.

**Initialization:**
- Reads `GROQ_API_KEY` from env.
- Default model: `meta-llama/llama-4-scout-17b-16e-instruct` (overridable via `GROQ_MODEL`).
- If no API key, `self.client = None`. All code that calls Groq checks `if self.client:` and falls back gracefully.

**Key methods:**

`get_ai_response(prompt, character=None)`
- Builds a character-specific system prompt from `NPCS[character]` data.
- Calls `client.chat.completions.create(model, messages, max_tokens=500, temperature=0.7)`.
- Returns the raw string content. Used for NPC conversational replies.

`check_with_sapling_api(text)`
- Skips texts shorter than 50 characters.
- POSTs to `https://api.sapling.ai/api/v1/aidetect` with the student's text.
- Returns `(is_ai: bool, score: float, reasons: list[str])`.
- Falls back to `_is_ai_generated_local(text)` on any error or missing key.

`_is_ai_generated_local(text)`
- Pure heuristics fallback: length check, French AI phrase list, sentence length variance, type-token ratio, trigram repetition.
- Returns the same `(is_ai, score, reasons)` tuple.

### 5.2 `AssessmentService` (`services/assessment_service.py`)

Wraps `AIService` to produce structured CEFR assessments.

**`assess_response(question, answer, question_type=None)`**
- Dispatches to `assess_listening_response()` for `question_type == "listening"`.
- Otherwise, calls `_get_level_assessment_prompt()` to build a detailed prompt that includes:
  - Example responses at each CEFR level (from `DIALOGUE_QUESTIONS`).
  - Weighted assessment criteria.
  - Preliminary keyword and grammar analysis (pre-computed in Python, sent in prompt).
  - Multilingual awareness instructions (students may mix French/Arabic).
- Calls Groq. Expects JSON back with fields: `level`, `justification`, `vocabulary_assessment`, `grammar_assessment`, `spelling_assessment`, `comprehension_assessment`, `fluency_assessment`, `specific_strengths`, `specific_areas_for_improvement`, `tips_for_improvement`.
- Falls back to `_fallback_assessment()` (rule-based on word count + keyword counts) if Groq fails or key is absent.

**`assess_listening_response(expected_sentence, user_response)`**
- Uses Python's `difflib.SequenceMatcher` to compute string similarity.
- Also computes word-set intersection ratio.
- Maps similarity thresholds to CEFR levels: ≥0.9 → C1, ≥0.75 → B2, ≥0.5 → B1, ≥0.3 → A2, else A1.

**`assess_phase2_response(step_id, action_item_id, response)`**
- Looks up the action item in `PHASE_2_STEPS`.
- Adds cultural-keyword analysis (Tunisian, malouf, heritage, etc.) and teamwork-keyword analysis.
- Prompts Groq with a Phase 2-specific rubric that maps A1–B2 to 1–4 points.
- Post-processes: if cultural and teamwork keywords are present, upgrades the level by one step.

**`assess_remedial_activity(step_id, level, activity_id, responses, score)`**
- Used for Phase 2 remedial tasks.
- Maps `score / total_possible` percentage to an assessed CEFR level.
- Returns rich feedback including `passed` flag, progression recommendation, strengths/improvements.

### 5.3 `AudioService` (`services/audio_service.py`)

Wraps Microsoft Edge TTS for NPC voice generation.

**Voice mapping:**

| NPC           | Edge TTS Voice              |
|---------------|-----------------------------|
| Ms. Mabrouki  | en-US-JennyNeural           |
| SKANDER       | en-US-GuyNeural             |
| Emna          | en-US-AriaNeural            |
| Ryan          | en-US-BryanNeural           |
| Lilia         | en-US-ElizabethNeural       |

**Key methods:**

`generate_audio(text, output_path, voice)` — async; calls `edge_tts.Communicate(text, voice).save(path)`.

`generate_audio_sync(text, output_path, voice)` — synchronous wrapper using `asyncio.run()`.

`initialize_audio_files()` — called at startup to pre-generate audio for all listening questions in `DIALOGUE_QUESTIONS` that have an `audio_cue` field. Skips files that already exist.

`generate_skander_audio()` — generates the specific listening comprehension audio clip: `"We could have a dance show or a food tasting."` → `static/audio/skander_suggestion.mp3`.

`generate_custom_audio(text, filename, voice)` — on-demand generation used by the API. Returns the URL path `/static/audio/<filename>`.

**Note:** The import of `werkzeug.utils.secure_filename` in `generate_custom_audio` is a Flask legacy. It still works as a general filename sanitizer but the Flask dependency is not needed.

### 5.4 Gamification Services

**`XPService` (`services/xp_service.py`)**
- `award_activity_xp(user_id, activity_type, activity_id, is_perfect, is_first_try, speed_bonus)` — inserts an XP transaction and updates the user's total XP.
- `get_user_progression(user_id)` — returns current XP, player level, and XP needed for next level.
- `get_xp_history(user_id, limit)` — returns recent XP transactions.

**`AchievementService` (`services/achievement_service.py`)**
- `check_and_unlock_achievements(user_id, event_type, event_data)` — evaluates which achievements are newly unlocked based on an event.
- `get_user_achievements(user_id, include_locked)` — returns unlocked achievements and optionally the full catalog.
- `get_unseen_achievements(user_id)` — returns achievements unlocked but not yet displayed.
- `mark_achievements_seen(user_id, achievement_ids)` — marks as seen after frontend displays them.

**`StreakService` (`services/streak_service.py`)**
- `record_activity(user_id)` — records today's activity, increments or resets streak.
- `get_streak_status(user_id)` — returns current streak, longest streak, freeze token count.
- `use_freeze_token(user_id)` / `purchase_freeze_token(user_id)` — streak freeze mechanics.

---

## 6. Frontend Architecture

### 6.1 Entry Point and Providers

**`frontend/src/main.jsx`** renders:

```jsx
<BrowserRouter>
  <ThemeProvider theme={...}>
    <App />
  </ThemeProvider>
</BrowserRouter>
```

**`frontend/src/App.jsx`** wraps everything in:

```jsx
<ErrorBoundary>
  <ApiProvider>           // Auth state + fetch client
    <ConfettiCannon />    // Gamification overlay
    <Routes>
      ...
    </Routes>
  </ApiProvider>
</ErrorBoundary>
```

### 6.2 Layout Shells

Two layout components define the shell for different route groups:

**`LandingLayout`** — used for public routes (`/`, `/login`, `/signup`, `/forgot-password`, `/reset-password`). Renders a top navigation bar with login/signup buttons.

**`AppLayout`** (`frontend/src/components/AppLayout.jsx`) — used for all authenticated routes. Renders:
- A collapsible left sidebar (260px expanded, 64px collapsed).
- Phase navigation links with completion status (lock icons for locked phases).
- User XP chip and avatar in the sidebar header.
- Dark/light mode toggle.
- A testing/skip button visible in Electron or when `?testing=1` is in the URL.
- `<Outlet />` for the current page.

The sidebar detects the Electron environment by checking `window.location.port !== '5173'` (Vite dev server port).

### 6.3 Route Structure

Routes are declared in `App.jsx`. The full tree is large (the file is ~1400 lines), but the pattern is consistent:

```
Public (LandingLayout):
  /                → Home
  /login           → Login
  /signup          → Signup
  /forgot-password → ForgotPassword
  /reset-password  → ResetPassword

Authenticated (AppLayout):
  /dashboard       → Dashboard
  /phase-journey   → PhaseJourney
  /characters      → Characters
  /profile         → Profile
  /edit-profile    → EditProfile
  /change-password → ChangePassword
  /delete-account  → DeleteAccount

  /phase1                         → Phase1Intro
  /phase1/interaction/:step       → Game          (1 route handles steps 1-8)
  /results                        → Results
  /certificate                    → Certificate

  /phase2                         → Phase2Intro
  /phase2/step/:stepId            → Phase2Step
  /phase2/step/:stepId/results    → Phase2StepResults
  /phase2/remedial/:stepId/:level → Phase2Remedial
  /phase2/complete                → Phase2Complete

  Phases 3-6 follow the pattern:
  /phaseN/step/S                         → StepIntro
  /phaseN/step/S/interaction/I           → InteractionI
  /phaseN/step/S/score                   → ScoreCalculation
  /phaseN/step/S/remedial/<level>/taskX  → RemedialTask

  Phase 5 and 6 add a subphase segment:
  /phase5/subphase/:sp/step/:s           → (intro)
  /phase5/subphase/:sp/step/:s/interaction/:i

  Admin:
  /admin           → AdminDashboard
  /admin/users     → AdminUserList
  /admin/users/:id → AdminUserViewer
  /admin/analytics → AdminAnalytics
  /admin/chat      → AdminChat

  Chat:
  /chat            → StudentChat
```

Each remedial route exists in two forms: `/phaseN/step/S/remedial/...` and `/app/phaseN/step/S/remedial/...`. The `/app/` prefix is used when the app is served from within Electron to avoid conflicts with operating system paths.

### 6.4 State Management

FARDI uses React Context API — there is no Redux or Zustand.

**`ApiProvider` / `ApiContext` (`lib/api.jsx`)**

This is the single global context. It exposes:

- `user` — the authenticated user object (`null` when logged out)
- `loading` — true while the initial `/auth/api/me` call is in flight
- `client` — a memoized object of async API methods (`login`, `signup`, `logout`, `getGameState`, `startGame`, `submitResponse`, `getFeedback`, `getPhase2Step`)

`useAuth()` and `useApiContext()` are the two hooks consumers use.

**Local state in page components**

Each phase page manages its own local state (current interaction step, responses collected so far, score, which remedial level to show). This state is not persisted in React — it is persisted to the backend via `POST /api/progress/save` after each response and retrieved via `GET /api/progress/resume?phase=N` when the page mounts.

**`useUserStats` hook (`hooks/useUserStats.jsx`)**

Fetches gamification data for the sidebar and dashboard. Calls `/api/gamification/dashboard`.

---

## 7. State Persistence Pattern (Frontend ↔ Backend)

The game state flow for a typical phase interaction:

```
1. Student navigates to /phase3/step/1/interaction/1
   |
2. Component mounts → calls GET /api/progress/resume?phase=3
   |    Backend looks up student_progress WHERE user_id=X AND phase=3
   |    Returns: {subphase, step, interaction, item_index, context, previous_responses}
   |
3. Component restores state from resume data
   (re-renders already-answered items as read-only)
   |
4. Student answers an item → component calls:
   POST /api/progress/save
   {phase: 3, subphase: null, step: 1, interaction: 1, item_index: 2,
    context: "main", response: {item_id, item_type, prompt, answer, score, ...}}
   |    Backend: INSERT INTO student_responses + UPSERT student_progress
   |
5. After all items in interaction 1 are done → navigate to interaction/2
   (repeat from step 2)
   |
6. After interaction 3 → navigate to /phase3/step/1/score
   |    ScoreCalculation component calls phase-specific scoring endpoint
   |    e.g., POST /api/phase3/step/1/score
   |    Backend: reads student_responses for this session, totals score,
   |    determines remedial level, returns {total_score, remedial_level}
   |
7. If remedial needed → navigate to /phase3/step/1/remedial/a1/taskA
   |    Each remedial task also saves via /api/progress/save (context="remedial_a1")
   |
8. After remedial → navigate to /phase3/step/2 (next step)
   |
9. After all steps → POST /api/progress/complete {phase: 3}
   |    Backend: UPDATE student_progress SET is_complete=1
   |    Also updates user_phase_completion table
```

---

## 8. Build and Deployment Pipeline

### Development Mode

**Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
```
Serves API at `http://localhost:8000`. Hot-reload on Python file changes.

**Frontend:**
```bash
cd frontend
npm run dev
```
Serves React at `http://localhost:5173` with Vite HMR. The Vite proxy (`vite.config.js`) forwards API requests to `:8000`.

### Production (FastAPI serves React)

```bash
cd frontend
npm run build
# Output: frontend/dist/
cp -r frontend/dist backend/frontend_dist
uvicorn main:app --host 0.0.0.0 --port 5010
```

FastAPI detects `frontend_dist/` at startup and mounts it. All unknown paths are served `index.html` (SPA catch-all). The app is fully accessible at `http://localhost:5010`.

### Desktop App (PyInstaller + Electron)

The `APP_DESK/` directory at project root contains the Electron wrapper. The packaging process:

1. Build the React SPA into `frontend/dist/`.
2. Run PyInstaller on `backend/main.py` with all Python dependencies bundled.
3. Copy `frontend/dist/` into the PyInstaller output as `frontend_dist/`.
4. Electron starts the bundled Python executable (`main` binary) as a child process on a random port.
5. Electron sets `FARDI_DATA_DIR` environment variable to point to the user's data directory, so `fardi.db` is stored outside the app bundle and persists across updates.
6. The Electron `BrowserWindow` navigates to `http://localhost:<port>`.

The app detects it is running inside Electron via the port number: if `window.location.port !== '5173'` and the protocol is `http:`, it enables the testing skip button in `AppLayout`.

---

## 9. Environment Variables Reference

All variables are read in `backend/` via `python-dotenv` loading `.env`.

| Variable          | Required | Default                          | Description                                    |
|-------------------|----------|----------------------------------|------------------------------------------------|
| `GROQ_API_KEY`    | Yes*     | (none)                           | API key for Groq LLM. *Without it, all AI assessment falls back to heuristics. |
| `GROQ_MODEL`      | No       | `meta-llama/llama-4-scout-17b-16e-instruct` | Groq model ID                   |
| `SAPLING_API_KEY` | No       | (none)                           | API key for Sapling AI detection. Falls back to local heuristics if absent. |
| `SECRET_KEY`      | Yes      | `dev-secret-key`                 | JWT signing key. Must be changed in production. |
| `FARDI_DB_PATH`   | No       | `<backend_dir>/fardi.db`         | Override the SQLite database file path.        |
| `FARDI_DATA_DIR`  | No       | (none)                           | Set by Electron to the user data directory; `FARDI_DB_PATH` is derived from it. |

Copy `backend/.env.example` to `backend/.env` and set at minimum `GROQ_API_KEY` and `SECRET_KEY`.

---

## 10. Data Flow Diagram: User Action → API → AI → Response

The following traces a student submitting a Phase 1 dialogue response:

```
BROWSER                        FASTAPI                      GROQ API
  |                               |                              |
  |  POST /api/game/submit        |                              |
  |  {response: "...", type: "motivation"}                       |
  |-----------------------------> |                              |
  |                               |                              |
  |                    Verify JWT cookie                         |
  |                    get_current_user()                        |
  |                               |                              |
  |                    Get game session from DB                  |
  |                    get_game_session(user_id)                 |
  |                               |                              |
  |                    AI detection check                        |
  |                    ai_service.check_with_sapling_api(text)   |
  |                         |   Sapling API (if key set)         |
  |                         |   or local heuristics              |
  |                               |                              |
  |                    assessment_service.assess_response(       |
  |                        question, answer, question_type)       |
  |                               |                              |
  |                               |  POST chat/completions       |
  |                               |  system: "CEFR assessor..."  |
  |                               |  user: <detailed prompt>     |
  |                               |----------------------------> |
  |                               |                              |
  |                               |  {level, justification,      |
  |                               |   vocabulary_assessment,     |
  |                               |   grammar_assessment, ...}   |
  |                               | <--------------------------- |
  |                               |                              |
  |                    Parse JSON from Groq response             |
  |                    (fallback to heuristics on parse error)   |
  |                               |                              |
  |                    Get NPC feedback (ai_service.get_ai_response)
  |                               |  POST chat/completions       |
  |                               |  system: "You are Lilia..."  |
  |                               |  user: <student's response>  |
  |                               |----------------------------> |
  |                               |                              |
  |                               |  "Great idea! I think..."    |
  |                               | <--------------------------- |
  |                               |                              |
  |                    Update game_sessions table                 |
  |                    Append to responses[] + assessments[]      |
  |                               |                              |
  |                    Calculate XP                              |
  |                    xp_service.award_activity_xp(...)         |
  |                               |                              |
  |  {                            |                              |
  |    assessment: {level, ...},  |                              |
  |    npc_response: "...",       |                              |
  |    xp_earned: 25,             |                              |
  |    next_step: 3,              |                              |
  |    ai_detected: false         |                              |
  |  }                            |                              |
  | <---------------------------- |                              |
  |                               |                              |
  |  React updates UI:            |                              |
  |  - Shows NPC dialogue bubble  |                              |
  |  - Shows CEFR feedback card   |                              |
  |  - Animates XP gain           |                              |
  |  - Navigates to next step     |                              |
```

### Remedial Routing Data Flow (Phases 3–6)

```
BROWSER                        FASTAPI                      DATABASE
  |                               |                              |
  |  POST /api/phase3/step/1/score|                              |
  |  {session_id: "..."}          |                              |
  |-----------------------------> |                              |
  |                               |                              |
  |                    SELECT student_responses                   |
  |                    WHERE user_id=X AND phase=3               |
  |                    AND step=1 AND session_id=...             |
  |                               |----------------------------> |
  |                               |   [{score: 3}, {score: 1},  |
  |                               |    {score: 2}]              |
  |                               | <--------------------------- |
  |                               |                              |
  |                    total = 6  (out of possible ~15)          |
  |                               |                              |
  |                    Threshold check:                           |
  |                    < 5  → remedial_level = "A1"              |
  |                    < 8  → remedial_level = "A2"              |
  |                    < 11 → remedial_level = "B1"              |
  |                    < 13 → remedial_level = "B2"              |
  |                    < 15 → remedial_level = "C1"              |
  |                    else → proceed                            |
  |                               |                              |
  |  {total_score: 6,             |                              |
  |   remedial_level: "A2",       |                              |
  |   should_proceed: false}      |                              |
  | <---------------------------- |                              |
  |                               |                              |
  |  Navigate to:                 |                              |
  |  /phase3/step/1/remedial/a2/taskA                            |
```
