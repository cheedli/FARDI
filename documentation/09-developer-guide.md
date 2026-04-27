# 09 — Developer Guide

Practical reference for extending and maintaining the FARDI codebase. Covers backend and frontend patterns, AI assessment internals, scoring logic, session management, testing, and known technical debt.

---

## 1. How to Add a New Phase Step

A "phase step" is one complete exercise unit: an intro page, two or three scored interactions, a score-calculation endpoint, and up to five remedial branches (A1 → A2 → B1 → B2 → C1). Phase 3 Step 1 is the canonical template to copy from.

### 1a. Backend

**Add a scoring endpoint to the phase router.**

All phase routes follow the pattern `POST /api/phase{N}/step/{S}/calculate-score`. Open the relevant router (e.g. `backend/routers/phase4.py`) and add:

```python
@router.post("/step/{step_id}/calculate-score")
async def calculate_step_score(step_id: int, request: Request, user: dict = Depends(get_current_user)):
    """
    Sum interaction scores, map to remedial level, return next_url.
    """
    try:
        user_id = user["user_id"]
        data = await request.json()

        i1 = data.get("interaction1_score", 0)
        i2 = data.get("interaction2_score", 0)
        i3 = data.get("interaction3_score", 0)
        total = i1 + i2 + i3

        # Define thresholds for this step (see Section 5 for the full threshold table)
        if total < 12:
            level = "A1"
        elif total < 18:
            level = "A2"
        else:
            level = "B1"

        should_proceed = level not in ("A1", "A2")
        next_url = (
            f"/app/phase{N}/step/{step_id + 1}"
            if should_proceed
            else f"/app/phase{N}/step/{step_id}/remedial/{level.lower()}/task/a"
        )

        save_phase4_progress(user_id, step=step_id, ...)  # persist to DB

        return {"success": True, "data": {"total": {"score": total, "remedial_level": level, "next_url": next_url}}}
    except Exception as e:
        logger.error(e)
        return JSONResponse({"success": False, "error": str(e)}, status_code=500)
```

**Add exercise data.**

- For static content (word lists, questions, expected answers), add a dictionary to `backend/models/game_data.py` or create a new JSON file and a loader module modelled on `backend/models/phase4_loader.py`.
- For JSON-based data, the loader caches the parsed file in a module-level variable and resolves the path using `sys._MEIPASS` (frozen) or a relative path from `__file__` (development).

**Register the router (if it is a new phase).**

In `backend/main.py`:

```python
from routers.phase7 import router as phase7_router
app.include_router(phase7_router)
```

### 1b. Frontend

**Create the directory structure.**

Use the Phase 3 Step 1 folder as the template:

```
frontend/src/pages/Phase{N}/Step{S}/
├── index.jsx               # Intro / landing screen for this step
├── Interaction1.jsx        # First scored exercise
├── Interaction2.jsx        # Second scored exercise
├── Interaction3.jsx        # Third scored exercise (if applicable)
├── ScoreCalculation.jsx    # Calls the backend calculate-score endpoint, shows result
├── RemedialA1/
│   ├── TaskA.jsx
│   └── TaskB.jsx           # A1 gets extra tasks; higher levels may have fewer
├── RemedialA2/
│   ├── TaskA.jsx
│   └── ...
├── RemedialB1/TaskA.jsx
├── RemedialB2/TaskA.jsx
└── RemedialC1/TaskA.jsx
```

**Wire into App.jsx.**

Add one import per file at the top of `frontend/src/App.jsx`:

```jsx
import Phase7Step1Intro       from './pages/Phase7/Step1/index.jsx'
import Phase7Step1Interaction1 from './pages/Phase7/Step1/Interaction1.jsx'
// ... etc.
```

Then add routes inside `<Routes>`:

```jsx
<Route path="/app/phase7/step/1"                element={<Phase7Step1Intro />} />
<Route path="/app/phase7/step/1/interaction/1"  element={<Phase7Step1Interaction1 />} />
<Route path="/app/phase7/step/1/interaction/2"  element={<Phase7Step1Interaction2 />} />
<Route path="/app/phase7/step/1/score"          element={<Phase7Step1ScoreCalc />} />
<Route path="/app/phase7/step/1/remedial/a1/task/a" element={<Phase7Step1RemedialA1TaskA />} />
// ... repeat for all remedial levels and tasks
```

**Navigation flow in a typical interaction file.**

```jsx
import { useNavigate } from 'react-router-dom'
import { useProgressSave } from '../../../../hooks/useProgressSave'

export default function Interaction1() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 7, step: 1, interaction: 1 })

  const handleSubmit = (answer, isCorrect, score) => {
    saveResponse({ item_index: 0, item_id: 'q1', item_type: 'text', prompt, answer, is_correct: isCorrect, score })
    navigate('/app/phase7/step/1/interaction/2')
  }
  // ...
}
```

---

## 2. How to Add a New Remedial Task Type

Remedial tasks vary considerably: matching games, gap fills, drag-and-drop, dialogue completion, flashcards. The frontend renders these through individual page components rather than a central exercise renderer — there is no shared `ExerciseRenderer` component at this time.

### 2a. Create the exercise component

Add a reusable UI component to `frontend/src/components/` if the widget will be used in more than one task:

```
frontend/src/components/exercises/
├── MatchingGame.jsx      # Drag-and-drop vocabulary matcher
├── GapFill.jsx           # Fill-in-the-blank
├── WordScramble.jsx      # Unscramble word letters
└── DialogueChoice.jsx    # Multiple-choice dialogue response
```

Each exercise component should accept props for the question data and an `onComplete(score)` callback that the parent task page uses to navigate forward.

### 2b. Create the task page

Task pages live under `frontend/src/pages/Phase{N}/Step{S}/Remedial{Level}/Task{X}.jsx`. A minimal task page:

```jsx
import { useNavigate } from 'react-router-dom'
import { useProgressSave } from '../../../../../hooks/useProgressSave'
import MyNewExercise from '../../../../../components/exercises/MyNewExercise'

export default function TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, step: 1, interaction: 10 })

  const handleComplete = (score, total) => {
    saveResponse({ item_index: 0, item_id: 'my-task', item_type: 'my_type', answer: score, is_correct: score >= total * 0.6, score })
    navigate('/app/phase4/step/1/remedial/a1/task/b')
  }

  return <MyNewExercise questions={questionData} onComplete={handleComplete} />
}
```

### 2c. Register the route

Add the import and route to `frontend/src/App.jsx` following the existing pattern.

### 2d. Backend: add task data

If the task requires server-side data or scoring, add a POST endpoint in the relevant phase router. Remedial final-score endpoints follow the pattern `/api/phase{N}/step/{S}/remedial/{level}/final-score`.

---

## 3. How to Add a New NPC Character

### 3a. Add the character to game_data.py

Open `backend/models/game_data.py` and add an entry to the `NPCS` dictionary:

```python
NPCS = {
    # ... existing characters ...
    "Yasmine": {
        "role": "Cultural Ambassador",
        "description": "Presents challenges related to cultural exchange.",
        "personality": "Warm, curious, and internationally minded",
        "avatar": "yasmine.svg",
        "background": "Exchange student with experience in three countries"
    },
}
```

The key (e.g. `"Yasmine"`) is the name used in dialogue question `speaker` fields and when calling `ai_service.get_ai_response(prompt, character="Yasmine")`.

### 3b. Add the avatar SVG

Place the SVG file at:

```
backend/static/images/avatars/yasmine.svg
```

The frontend fetches avatars via `/static/images/avatars/{name}`. The existing characters use flat-design SVG illustrations.

### 3c. Wire a voice in audio_service.py

Open `backend/services/audio_service.py` and add an entry to `_get_voice_for_speaker`:

```python
def _get_voice_for_speaker(self, speaker):
    voice_mapping = {
        "Ms. Mabrouki": "en-US-JennyNeural",
        "SKANDER":      "en-US-GuyNeural",
        "Emna":         "en-US-AriaNeural",
        "Ryan":         "en-US-BryanNeural",
        "Lilia":        "en-US-ElizabethNeural",
        "Yasmine":      "en-US-MichelleNeural",   # new
    }
    return voice_mapping.get(speaker, "en-US-AriaNeural")
```

Valid voice names can be listed with:

```bash
python -c "import asyncio, edge_tts; asyncio.run(edge_tts.list_voices())" | grep ShortName
```

### 3d. Use the character in a dialogue question

In `backend/models/game_data.py`, `DIALOGUE_QUESTIONS` (or the equivalent phase data), set `"speaker": "Yasmine"`. The AI service will automatically inject her personality prompt when generating responses.

---

## 4. How the AI Assessment Works

### 4a. What prompt is sent to Groq

For non-listening questions, `AssessmentService._get_level_assessment_prompt()` in `backend/services/assessment_service.py` constructs the prompt. The key sections are:

1. **The question and student answer** — literal text.
2. **Assessment criteria** — per-question weights pulled from `DIALOGUE_QUESTIONS[i]["assessment_criteria"]` (e.g. `vocabulary_range: 0.3, grammar_accuracy: 0.2`).
3. **Example responses at each CEFR level** — also from `DIALOGUE_QUESTIONS[i]["example_responses"]`, so the model has concrete anchors.
4. **Preliminary analysis** — word count, average sentence length, counts of advanced/intermediate/basic vocabulary words, presence of conditional structures and complex connectors. Computed locally by `_get_keyword_analysis()` and `_get_grammar_analysis()`.
5. **Multilingual instructions** — tells the model that French/Arabic words are not errors and to assess regardless of language mixing (important for Tunisian student responses).
6. **Professional English standards** — instructs the model to flag missing capitalisation, inappropriate contractions, and formality mismatches as part of the assessment.

The system prompt is: `"You are an expert language assessor specializing in CEFR levels."` Temperature is set to `0.3` (lower than NPC responses, which use `0.7`) for more deterministic scoring.

### 4b. How the score is parsed from the AI response

The model is instructed to return **only** a JSON object:

```json
{
  "level": "B1",
  "justification": "...",
  "vocabulary_assessment": "...",
  "grammar_assessment": "...",
  "spelling_assessment": "...",
  "comprehension_assessment": "...",
  "fluency_assessment": "...",
  "specific_strengths": ["..."],
  "specific_areas_for_improvement": ["..."],
  "tips_for_improvement": "..."
}
```

The backend calls `json.loads(result)` directly. If that raises `json.JSONDecodeError` (the model included surrounding text), execution falls to `_fallback_assessment()`. The parsed `"level"` field is a string like `"B1"` which maps to a numeric score via `POINTS_PER_LEVEL` in `game_data.py` (`{"A1": 1, "A2": 2, "B1": 3, "B2": 4, "C1": 5}`).

### 4c. What happens when Groq is unavailable

`AssessmentService._fallback_assessment()` uses entirely local logic:

| Condition | Level assigned |
|-----------|---------------|
| Word count < 10 | A1 |
| Word count < 20 | A2 |
| Word count > 50 AND has complex connectors | B2 |
| Word count > 70 AND has conditionals AND advanced word count > 2 | C1 |
| Otherwise | B1 (default) |

This fallback is also triggered if the Groq API key is missing (`self.client` is `None`) or if any exception occurs during the API call.

For **listening questions**, Groq is not used at all. `assess_listening_response()` computes a `SequenceMatcher` similarity ratio against the expected sentence and maps the score to a CEFR level deterministically.

---

## 5. Scoring Thresholds and How to Change Them

### Phase 1 (Dialogue game)

**File:** `backend/utils/helpers.py`, function `determine_overall_level()`

The weighted average of per-question CEFR levels is mapped back to a level string:

```python
if average < 1.5:   return "A1"
elif average < 2.5: return "A2"
elif average < 3.5: return "B1"
elif average < 4.5: return "B2"
else:               return "C1"
```

Per-question-type weights are defined in the same function in `type_weights`:

```python
type_weights = {
    "listening": 1.2,
    "social_interaction": 1.2,
    "writing": 1.2,
    "problem_solving": 1.1,
    # ... others at 0.8–1.0
}
```

To change how much a question type affects the overall score, edit its weight here.

### Phase 2 remedial routing

**File:** `backend/routers/api.py`, function `determine_phase2_user_level()`

```python
def determine_phase2_user_level(total_score):
    if total_score < 10:  return 'A1'
    elif total_score < 15: return 'A2'
    else:                  return 'B1'
```

Maximum possible Phase 2 score is 20. A student scoring 20 bypasses remedial entirely (controlled separately by `needs_remedial = total_score < PHASE_2_SUCCESS_THRESHOLD`).

### Phase 3 per-step thresholds

**File:** `backend/routers/phase3.py`, inside `calculate_step_score()`

| Step | Max | A1 threshold | A2 threshold | B1 threshold | B2 threshold | C1 threshold |
|------|-----|-------------|-------------|-------------|-------------|-------------|
| 1 | 21 | < 12 | < 18 | ≥ 18 | — | — |
| 2 | 23 | < 8 | < 13 | < 18 | < 21 | ≥ 21 |
| 3 | 18 | < 6 | < 11 | < 14 | < 17 | ≥ 17 |
| 4 | 10 | < 2 | < 4 | < 6 | < 8 | ≥ 8 |

Students proceed to the next step when their level is B1 or higher (`level_order.index(level) >= 2`).

### Phase 4 Step 3 thresholds

**File:** `backend/routers/phase4.py`, function `calculate_step3_score()`

Max 15 points (three CEFR interactions, 1–5 each):

```python
if total_score < 4:   level = "A1"
elif total_score < 7:  level = "A2"
elif total_score < 10: level = "B1"
elif total_score < 13: level = "B2"
else:                  level = "C1"
```

All students enter remedial for Phase 4 Step 3 regardless of score (`should_proceed = False` always).

### Phase 4 helper function

**File:** `backend/routers/phase4.py`, function `_phase4_total_to_level(thresholds)`

Most Phase 4 score calculations use this shared helper rather than inline `if/elif` chains. The `thresholds` argument is a list of `(upper_limit, level)` tuples evaluated left to right.

---

## 6. Session Management

### Game state sessions (Phase 1)

Phase 1 (the group-chat dialogue game) stores transient state in the filesystem under `backend/sessions/`. This is controlled by `Config.SESSION_FILE_DIR` in `backend/config.py`:

```python
SESSION_FILE_DIR = os.path.join(os.path.dirname(__file__), 'sessions')
```

Each session is a serialised file. Session keys used during Phase 1:

| Key | Description |
|-----|-------------|
| `user_id` | Authenticated user's database ID |
| `current_step` | Which dialogue question the user is on (1–9) |
| `assessments` | List of per-question assessment results |
| `start_time` | ISO timestamp when the session began (used for Quick Thinker achievement) |
| `xp` | Accumulated XP for this session |

Sessions are not used for Phases 3–6. Those phases persist state directly to the `student_progress` and `student_responses` SQLite tables via the `useProgressSave` hook and `POST /api/progress/save` endpoint.

### Progress persistence (Phases 3–6)

**Database tables:**

`student_progress` — one row per `(user_id, phase)`, updated on every save. Acts as the resume pointer.

```sql
CREATE TABLE student_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    phase INTEGER NOT NULL,
    subphase INTEGER,
    step INTEGER NOT NULL,
    interaction INTEGER NOT NULL,
    item_index INTEGER NOT NULL DEFAULT 0,
    session_id TEXT,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_complete BOOLEAN DEFAULT 0,
    UNIQUE(user_id, phase),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
)
```

`student_responses` — append-only log of every scored answer.

```sql
CREATE TABLE student_responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    phase INTEGER NOT NULL,
    subphase INTEGER,
    step INTEGER NOT NULL,
    interaction INTEGER NOT NULL,
    item_index INTEGER NOT NULL,
    item_type TEXT NOT NULL,
    item_id TEXT,
    prompt TEXT,
    response TEXT NOT NULL,
    is_correct INTEGER,
    score REAL,
    ai_feedback TEXT,
    session_id TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
)
```

**Frontend hook:** `frontend/src/hooks/useProgressSave.js`

The hook debounces saves by 3 seconds so rapid answer changes do not flood the API. On page unload it flushes immediately using `navigator.sendBeacon`. The `session_id` is stored in `sessionStorage` so it persists within a browser tab but resets when the tab is closed.

**Phase/subphase mapping:**

| Phase | Subphase | Steps |
|-------|----------|-------|
| 1 | null | N/A (filesystem session) |
| 2 | null | 1–9 |
| 3 | null | 1–4 |
| 4 | null | 1–5 |
| 5 | 1 | 1–5 |
| 5 | 2 | 1–5 |
| 6 | 1 | 1–5 |
| 6 | 2 | 1–5 |

---

## 7. Admin Dashboard

### Access

The admin dashboard is accessible at `/app/admin` and is protected by `require_admin` (checks `user["is_admin"]` from the JWT). To make a user an admin, set `is_admin = 1` directly in the database:

```bash
sqlite3 backend/fardi.db "UPDATE users SET is_admin=1 WHERE username='yourname';"
```

### Pages and what they show

| Page | File | Description |
|------|------|-------------|
| Admin Dashboard | `AdminDashboard.jsx` | Overall statistics: total users, total assessments, Phase 2 session count |
| User List | `AdminUserList.jsx` | Paginated table of all registered students with last login |
| User Viewer | `AdminUserViewer.jsx` | Per-student detail: Phase 1 assessment results, Phase 2 responses, and a **Progress** tab showing the full `student_responses` timeline grouped by step/interaction |
| Analytics | `AdminAnalytics.jsx` | Aggregate charts (score distributions, level breakdowns) |
| Student Progress | `AdminStudentProgress.jsx` | Summary table of `student_progress` resume pointers |
| Chat | `AdminChat.jsx` | Admin-side view of game chat sessions |

### Backend admin endpoints

All admin endpoints are in `backend/routers/admin.py` and require `is_admin=True` in the JWT:

| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/stats` | Aggregate statistics |
| GET | `/admin/users` | List all users |
| GET | `/admin/users/{user_id}` | Single user detail with assessment history |
| GET | `/admin/progress/{user_id}` | Full response timeline for a student |
| GET | `/admin/export/csv` | CSV export of all assessment results |

---

## 8. Git Workflow and Branch Conventions

### Current branch structure

```
main          # stable, deployable
changed-design # active development (current branch)
```

### Commit message conventions

From the git log, the project follows conventional commits loosely:

| Prefix | Usage |
|--------|-------|
| `feat:` | New feature or page |
| `fix:` | Bug fix |
| `perf:` | Performance improvement |
| (none) | Miscellaneous / WIP |

Examples from the log:

```
feat: clay/bento theme redesign + Phase 5/6 updates + backend improvements
fix: remedial chain A1→A2→B1→B2→C1 across all Phase 3/4 steps + skip button fixes
feat: apply clay/bento theme across all phases + fix docs to reflect FastAPI
fix: update Phase 2 remedial routing thresholds to match upstream (<10→A1, <15→A2, else→B1)
feat: add progress persistence router (save/resume/complete)
```

Commits are often large, combining multiple features. There is no enforced PR review process at this stage of the project.

### Recommended workflow for new work

```bash
git checkout -b feat/my-feature main
# ... make changes ...
git add backend/routers/my_feature.py frontend/src/pages/MyPage.jsx
git commit -m "feat: add my feature description"
git checkout main
git merge feat/my-feature
```

---

## 9. Known Issues and Technical Debt

### Werkzeug dependency in a FastAPI project

`backend/services/audio_service.py`, line 113:

```python
from werkzeug.utils import secure_filename
```

`werkzeug` is a Flask library and is not listed in `requirements-fastapi.txt`. This import will fail if `generate_custom_audio()` is called and `werkzeug` is not installed. Either replace with a simple regex sanitiser or add `werkzeug` to the requirements file.

### config.py is Flask-legacy

`backend/config.py` contains `SESSION_TYPE = 'filesystem'` and `SESSION_USE_SIGNER = True` which are Flask-Session configuration keys. FastAPI does not use this class at runtime (it is referenced nowhere in the FastAPI application). The file is effectively dead code from the Flask-to-FastAPI migration and should either be cleaned up or repurposed to hold only the settings FastAPI actually uses.

### Phase directory naming mismatch (Phase 4)

In `frontend/src/App.jsx`, the Phase 4 steps are imported from directories that do not match their logical names:

```jsx
// "Phase 4 Step 3" is actually in Phase4Step2/
import Phase4Step3Intro from './pages/Phase4Step2/index.jsx'

// "Phase 4 Step 4" is actually in Phase4Step3/
import Phase4Step4Intro from './pages/Phase4Step3/index.jsx'
```

This off-by-one mapping exists because the Phase 4 Step 2 directory was renamed mid-development but the import aliases were not updated. Be careful when editing Phase 4 Step 2–5 files: the folder name and the logical step number differ by one.

### No central ExerciseRenderer

Each remedial task page is a standalone component that directly renders its exercise UI. There is no shared `ExerciseRenderer` dispatch table. This means adding a new exercise type requires creating a new component and wiring every instance separately. A registry-based renderer would reduce boilerplate significantly but has not been implemented.

### AI assessment returns JSON parsing failures silently

When the Groq API returns a response that includes text outside the JSON object (e.g. a preamble like "Here is the assessment:"), `json.loads()` raises `JSONDecodeError` and the system silently falls back to rule-based scoring. The student sees a result but it may not reflect actual Groq output. A regex extraction of the first `{...}` block before JSON parsing would make this more robust.

### `context` column inconsistency in student_responses

The `save_phase4_progress` helper in `phase4.py` writes a `context` column to `student_responses`. The table schema created in `models/auth.py` does not declare a `context` column. This works in SQLite (which is permissive about this) but will silently drop data if the schema is ever enforced strictly. The `student_responses` table should be updated to declare `context TEXT` explicitly.

### Edge TTS requires internet access

The `edge_tts` library calls Microsoft's neural TTS cloud service. There is no offline fallback. If the deployment environment has no internet access (air-gapped lab), audio generation will fail silently and the listening exercise in Phase 1 will have no audio.

### Large App.jsx

`frontend/src/App.jsx` currently imports hundreds of page components and defines all routes in a single file. It is over 800 lines long. Route code-splitting with `React.lazy()` and `<Suspense>` would improve initial bundle load time and editor experience.

### Sessions directory grows unbounded

Flask-style session files in `backend/sessions/` are never cleaned up. Long-running deployments will accumulate stale session files. A cron job or startup cleanup (delete files older than N days) should be added.

---

## 10. Testing

### Backend testing with curl

Start the backend, then use curl to smoke-test key endpoints. Get a JWT token first:

**Register a user:**
```bash
curl -s -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"test1234","first_name":"Test","last_name":"User"}' | python3 -m json.tool
```

**Login and capture token:**
```bash
TOKEN=$(curl -s -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test1234"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")
echo $TOKEN
```

**Health check:**
```bash
curl -s http://localhost:8000/api/health
# Expected: {"status":"ok"}
```

**Start game:**
```bash
curl -s -X POST http://localhost:8000/start-game \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
```

**Submit a Phase 1 assessment response:**
```bash
curl -s -X POST http://localhost:8000/api/assess-response \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Can you introduce yourself?",
    "answer": "I am a student interested in cultural events and I enjoy working in teams.",
    "question_type": "introduction"
  }' | python3 -m json.tool
```

**Test Phase 3 Step 1 score calculation:**
```bash
curl -s -X POST http://localhost:8000/api/phase3/step/1/calculate-score \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"interaction1_score": 6, "interaction2_score": 7, "interaction3_score": 4}' | python3 -m json.tool
# total=17 → A2 remedial
```

**Test Phase 2 remedial routing (unit-level):**
```bash
cd backend && python -c "
from routers.api import determine_phase2_user_level
assert determine_phase2_user_level(5) == 'A1'
assert determine_phase2_user_level(10) == 'A2'
assert determine_phase2_user_level(15) == 'B1'
print('Phase 2 thresholds OK')
"
```

**Verify all routes are registered:**
```bash
cd backend && python -c "
from main import app
for r in sorted(str(r.path) for r in app.routes):
    print(r)
"
```

**Verify database tables exist:**
```bash
sqlite3 backend/fardi.db ".tables"
# Expected tables: assessment_results, password_reset_tokens, phase2_responses,
#                  student_progress, student_responses, user_sessions, users
```

### Frontend testing

There are currently no automated frontend tests (no Jest, no Vitest, no Cypress). The recommended manual smoke-test checklist after any significant change:

1. `npm run build` in `frontend/` — must complete without errors.
2. Login as a student and progress through Phase 1 all the way to the certificate page.
3. Login as an admin and verify the Admin Dashboard loads and shows user count.
4. Navigate to Phase 3 Step 1, complete all three interactions, and verify the score calculation redirects to either the next step or a remedial page.
5. Answer a remedial task and verify the chain progresses A1 → A2 → B1 → B2 → C1 → (return to main step).

**Check for build warnings** — Vite outputs unused import warnings and React key prop warnings that indicate component issues:

```bash
cd frontend
npm run build 2>&1 | grep -E "warn|error" | head -40
```

**Run Vite preview** to test the production build locally before copying to the backend:

```bash
npm run preview
# Serves the dist/ folder on http://localhost:5173
```
