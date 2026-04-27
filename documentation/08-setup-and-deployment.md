# 08 — Setup and Deployment

Complete guide for setting up, configuring, and deploying the FARDI CEFR language assessment platform.

---

## 1. Prerequisites

| Requirement | Minimum Version | Notes |
|-------------|----------------|-------|
| Python | 3.10+ | 3.11 recommended |
| pip | 23+ | Bundled with Python 3.10+ |
| Node.js | 18 LTS+ | 20 LTS preferred |
| npm | 9+ | Bundled with Node.js |
| Git | 2.x | For cloning the repo |

Verify your environment:

```bash
python --version    # Python 3.11.x
pip --version       # pip 23.x
node --version      # v20.x.x
npm --version       # 10.x.x
```

---

## 2. Full Local Development Setup

### 2a. Clone the repository

```bash
git clone <repo-url> FARDI
cd FARDI
```

The repository root contains two top-level directories that you work with directly:

```
FARDI/
├── backend/     # FastAPI server (Python)
└── frontend/    # React SPA (Vite)
```

### 2b. Backend setup

```bash
cd backend

# Create a virtual environment
python -m venv venv

# Activate it
source venv/bin/activate          # macOS / Linux
# venv\Scripts\activate           # Windows

# Install Python dependencies
pip install -r requirements-fastapi.txt

# Create your .env file from the example
cp .env.example .env
# Then edit .env and fill in at minimum GROQ_API_KEY (see Section 3)

# Start the development server
uvicorn main:app --reload --port 8000
```

The `--reload` flag enables hot-reload: the server restarts automatically when you save any `.py` file. Do not use `--reload` in production.

### 2c. Frontend setup

Open a second terminal (keep the backend terminal running):

```bash
cd frontend

# Install Node dependencies
npm install

# Start the Vite development server
npm run dev
```

### 2d. Access points in development

| Service | URL | Description |
|---------|-----|-------------|
| Backend API | `http://localhost:8000/api/` | FastAPI REST API |
| Swagger UI | `http://localhost:8000/docs` | Auto-generated interactive API docs |
| ReDoc | `http://localhost:8000/redoc` | Alternative API documentation |
| Frontend | `http://localhost:5173/` | React dev server (Vite) |

**How proxying works in development:** Vite is configured (`frontend/vite.config.js`) to proxy `/api`, `/auth`, `/start-game`, and `/static` requests to `http://localhost:5010`. This means the frontend dev server transparently forwards those paths to the backend. In practice, both the backend dev port (`8000`) and the production target port (`5010`) are referenced in the config — when running the backend with `--port 8000`, update the proxy target accordingly or just run both as-is and rely on the CORS allow-list in `main.py`.

---

## 3. Environment Variables

Copy `backend/.env.example` to `backend/.env` and configure the following:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GROQ_API_KEY` | **Required** | — | API key for the Groq LLM service. Powers all AI assessment and NPC responses. Without it, the app falls back to rule-based scoring only. |
| `SAPLING_API_KEY` | Optional | — | API key for the Sapling AI detection service. When absent, the app uses a local heuristic fallback to detect AI-generated student responses. |
| `SECRET_KEY` | Recommended | `"dev-secret-key"` | Secret used for JWT signing and session security. Set a long random string in any non-local environment. |
| `GROQ_MODEL` | Optional | `"meta-llama/llama-4-scout-17b-16e-instruct"` | The Groq model ID to use for assessment calls. Change to try different models (e.g. `llama-3.1-8b-instant` for lower latency). Note: `config.py` defaults to `llama-3.1-8b-instant`; the `AIService` class in `ai_service.py` overrides this default. |
| `FARDI_DATA_DIR` | Desktop app only | Parent directory of `main.py` | Set by the Electron wrapper to point to the folder containing the external `fardi.db`. Irrelevant for plain web deployments. |
| `FARDI_DB_PATH` | Desktop app only | `<FARDI_DATA_DIR>/fardi.db` | Full path to the SQLite database file. Automatically derived from `FARDI_DATA_DIR` if not set explicitly. |

Example `.env` file:

```dotenv
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
SAPLING_API_KEY=your_sapling_key_here
SECRET_KEY=change-this-to-a-long-random-string-in-production
GROQ_MODEL=meta-llama/llama-4-scout-17b-16e-instruct
```

---

## 4. Database

### Location

In development, the SQLite database lives at `backend/fardi.db`. The path is controlled by the `FARDI_DB_PATH` environment variable; in web deployments this can be left unset and the file will be created next to `main.py`.

### Initialization

The database is initialized automatically on first run. `backend/models/auth.py` contains a `DatabaseManager` class whose `__init__` calls `init_database()`. This method creates all tables using `CREATE TABLE IF NOT EXISTS`, so it is safe to run repeatedly. Tables created automatically:

- `users` — registered student accounts
- `password_reset_tokens` — one-time reset tokens
- `user_sessions` — active session tracking
- `assessment_results` — CEFR level results from Phase 1
- `phase2_responses` — student responses from Phase 2 steps
- `student_progress` — resume pointer (one row per user per phase)
- `student_responses` — every individual scored answer across all phases

### Resetting the database

To start completely fresh, simply delete the file:

```bash
rm backend/fardi.db
# Then restart the backend — it will recreate the file automatically
uvicorn main:app --reload --port 8000
```

### Migrations

There is no formal migration framework. New tables are added directly in `init_database()` using `CREATE TABLE IF NOT EXISTS`. When adding a new column to an existing table, you must write and run a migration manually:

```bash
# Example: add a column to an existing table
sqlite3 backend/fardi.db "ALTER TABLE users ADD COLUMN student_id TEXT;"
```

Keep a record of these one-off commands in `backend/migrations/` (the directory exists but is currently ad-hoc).

---

## 5. Production Build

In production, the React app is compiled to static files and served directly by FastAPI. There is no need for the Vite dev server.

### 5a. Build the React app

```bash
cd frontend
npm run build
# Output goes to frontend/dist/
```

### 5b. Copy dist to backend

FastAPI looks for the frontend at `backend/frontend_dist/`. Copy the build output there:

```bash
cp -r frontend/dist/ backend/frontend_dist/
```

Or create a symlink during development to avoid re-copying:

```bash
ln -s "$(pwd)/frontend/dist" backend/frontend_dist
```

### 5c. Run the production server

```bash
cd backend
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 5010
```

The app is now accessible at `http://localhost:5010/`. FastAPI serves the React `index.html` for all non-API paths via the SPA catch-all route registered at the bottom of `main.py`.

**Port 5010** is the canonical production port. The CORS allow-list in `main.py` explicitly whitelists `http://localhost:5010` alongside `http://localhost:5173` (the Vite dev port).

---

## 6. PyInstaller + Electron Desktop Packaging

FARDI supports being bundled as a standalone desktop application using PyInstaller (Python backend) and Electron (browser shell). Understanding three variables in `main.py` is essential:

### `sys.frozen`

```python
if getattr(sys, 'frozen', False):
    # Running as a PyInstaller bundle
```

`sys.frozen` is set to `True` by PyInstaller at bundle time. The backend detects this to know whether it is running as a packaged executable or a normal Python process. When frozen, `reload=False` is forced and the app object is passed directly to uvicorn (string-based import does not work inside a frozen bundle).

### `sys._MEIPASS`

```python
_base = getattr(sys, '_MEIPASS', os.path.dirname(os.path.abspath(__file__)))
```

PyInstaller extracts bundled files to a temporary directory at runtime. `sys._MEIPASS` is the path to that directory. When not frozen, `_base` falls back to the directory containing `main.py`. All static file mounts (`/static`, `/assets`) use `_base` as their root so they work in both modes.

### `FARDI_DATA_DIR`

```python
_data_dir = os.environ.get("FARDI_DATA_DIR", os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault("FARDI_DB_PATH", os.path.join(_data_dir, "fardi.db"))
```

Electron sets `FARDI_DATA_DIR` to the user's persistent data folder (outside `_MEIPASS`, which is temporary). This ensures that `fardi.db` survives app updates — the database lives in the data folder, not inside the PyInstaller bundle.

### Build steps (high level)

```bash
# 1. Build frontend
cd frontend && npm run build
cp -r dist/ ../backend/frontend_dist/

# 2. Bundle backend with PyInstaller
cd backend
pyinstaller --onedir main.py \
  --add-data "static:static" \
  --add-data "frontend_dist:frontend_dist" \
  --add-data "phase4.json:." \
  --name fardi-server

# 3. Wrap with Electron (see APP_DESK/ directory)
# Electron spawns fardi-server as a child process and sets FARDI_DATA_DIR
```

---

## 7. API Key Setup Guides

### Groq API Key

1. Go to [https://console.groq.com](https://console.groq.com) and sign up for a free account.
2. Navigate to **API Keys** in the left sidebar.
3. Click **Create API Key**, give it a name (e.g. `fardi-dev`), and copy the key.
4. Paste the key into `backend/.env` as `GROQ_API_KEY=gsk_...`.

The free tier provides generous limits suitable for development and small deployments. The default model (`meta-llama/llama-4-scout-17b-16e-instruct`) is fast and cheap; switch to `llama-3.1-8b-instant` for even lower latency at the cost of slightly weaker assessment quality.

### Sapling API Key

1. Go to [https://sapling.ai](https://sapling.ai) and create an account.
2. Navigate to **API** in your account dashboard.
3. Copy your API key and paste it into `backend/.env` as `SAPLING_API_KEY=...`.

Sapling is optional. Without it, the app uses a local heuristic detector (`_is_ai_generated_local` in `ai_service.py`) that checks for AI-typical phrases, sentence uniformity, and vocabulary diversity. The local detector is less accurate but has no external dependency.

---

## 8. Common Troubleshooting

### Port conflicts

**Symptom:** `[Errno 48] Address already in use` when starting uvicorn.

```bash
# Find what is using port 8000
lsof -i :8000
# Kill it
kill -9 <PID>

# Or just use a different port
uvicorn main:app --reload --port 8001
```

### Database issues

**Symptom:** `sqlite3.OperationalError: no such table: student_progress`

This means the database was created before the `student_progress` / `student_responses` tables were added. Run the missing `CREATE TABLE` statements manually:

```bash
sqlite3 backend/fardi.db < backend/migrations/<migration_file>.sql
```

Or delete `fardi.db` and let it be recreated fresh.

**Symptom:** `sqlite3.OperationalError: database is locked`

Only one process should access the SQLite database at a time. Make sure you do not have two backend instances running simultaneously. Kill extra processes:

```bash
pkill -f "uvicorn main:app"
```

### Audio / TTS issues

**Symptom:** No audio plays in the Phase 1 listening exercise.

Edge TTS requires an internet connection — it calls Microsoft's text-to-speech service to generate the MP3. The audio file is cached at `backend/static/audio/skander_suggestion.mp3` after first generation. If this file is missing:

```bash
cd backend
python -c "from services.audio_service import AudioService; AudioService().generate_skander_audio()"
```

**Symptom:** `ImportError: No module named 'werkzeug'`

The `generate_custom_audio` method in `audio_service.py` imports `werkzeug.utils.secure_filename`, a Flask dependency that is not in `requirements-fastapi.txt`. Either install it (`pip install werkzeug`) or avoid calling that method directly.

### CORS errors

**Symptom:** Browser console shows `CORS policy: No 'Access-Control-Allow-Origin' header`.

The CORS allow-list in `main.py` is:

```python
allow_origins=["http://localhost:5173", "http://localhost:5010"]
```

If you are accessing the app from a different origin (e.g. a different port, a hostname, or `127.0.0.1` instead of `localhost`), add it to the list. For development convenience you can temporarily allow all origins:

```python
allow_origins=["*"]
```

Do not use `allow_origins=["*"]` in production with `allow_credentials=True` — this combination is rejected by browsers.

### Frontend build not showing

**Symptom:** Visiting `http://localhost:5010/` returns 404.

Make sure `backend/frontend_dist/` exists and contains `index.html`:

```bash
ls backend/frontend_dist/index.html
```

If the directory is missing, re-run the build and copy steps from Section 5.

### Groq assessment returning fallback scores

**Symptom:** All students get B1 as their CEFR level regardless of their answer.

This means Groq is unavailable. Check:
1. `GROQ_API_KEY` is set in `.env` and the backend was restarted after editing the file.
2. The Groq model name in `GROQ_MODEL` is valid.
3. Your Groq account has not exceeded its rate limit.

The `_fallback_assessment` method in `assessment_service.py` uses word count and keyword analysis when Groq is down. Students will still get a score, but it will be less accurate.

---

## 9. Docker

No `Dockerfile` or `docker-compose.yml` currently exists in the repository. The application is designed to run as a local or packaged desktop app. If you need to containerize it, a minimal starting point:

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY backend/ ./backend/
COPY frontend/dist/ ./backend/frontend_dist/
WORKDIR /app/backend
RUN pip install -r requirements-fastapi.txt
ENV FARDI_DB_PATH=/data/fardi.db
EXPOSE 5010
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5010"]
```

Mount a volume to `/data` so the database persists across container restarts.

---

## 10. Development Workflow

### Adding a backend feature

The standard pattern follows: **router → service → model**.

1. **Define data** in `backend/models/game_data.py` (constants, exercise content) or create a loader in `backend/models/` if the data lives in JSON.

2. **Write business logic** in `backend/services/`. Each service is a plain Python class that is instantiated at import time. Example: `AIService`, `AssessmentService`, `AudioService`.

3. **Create the router** in `backend/routers/`. Use FastAPI's `APIRouter`:

```python
# backend/routers/my_feature.py
from fastapi import APIRouter, Depends
from auth_utils import get_current_user

router = APIRouter(prefix="/api/my-feature", tags=["my-feature"])

@router.get("/data")
async def get_data(user: dict = Depends(get_current_user)):
    return {"hello": "world"}
```

4. **Register the router** in `backend/main.py`:

```python
from routers.my_feature import router as my_feature_router
app.include_router(my_feature_router)
```

5. **Test immediately** via Swagger at `http://localhost:8000/docs`.

### Adding a frontend page

1. **Create the page file** under `frontend/src/pages/`. Follow the existing naming convention:
   - Main phase pages: `frontend/src/pages/Phase{N}/Step{S}/Interaction{I}.jsx`
   - Remedial tasks: `frontend/src/pages/Phase{N}/Step{S}/Remedial{Level}/Task{X}.jsx`
   - Intro pages (shown before interactions start): `frontend/src/pages/Phase{N}/Step{S}/index.jsx`

2. **Import the page** in `frontend/src/App.jsx` at the top with other imports.

3. **Add the route** in the `<Routes>` block in `App.jsx`:

```jsx
<Route path="/app/phase{N}/step/{S}/interaction/{I}" element={<MyNewPage />} />
```

4. **Wire navigation** — the previous page should call `navigate('/app/phase{N}/step/{S}/interaction/{I}')` when it is done.

5. **Save progress** — if the page contains a scored exercise, import and call `useProgressSave`:

```jsx
import { useProgressSave } from '../../hooks/useProgressSave'

const { saveResponse } = useProgressSave({ phase: N, step: S, interaction: I })

// When the student submits an answer:
saveResponse({
  item_index: currentIndex,
  item_id: 'unique-id',
  item_type: 'gap_fill',  // or matching, spelling, text, etc.
  prompt: questionText,
  answer: studentAnswer,
  is_correct: isCorrect,
  score: pointsAwarded,
})
```
