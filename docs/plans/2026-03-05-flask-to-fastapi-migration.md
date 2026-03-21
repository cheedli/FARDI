# Flask to FastAPI Migration Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate the FARDI Flask backend to FastAPI while keeping the React frontend as a separate dev server, resulting in a clean API-only FastAPI server + standalone React app architecture.

**Architecture:** FastAPI serves JSON APIs only (no templates, no static files). React runs independently via Vite dev server (dev) or is deployed separately (prod). Authentication moves from filesystem sessions to JWT tokens stored in httpOnly cookies. SQLite database and all service classes remain unchanged.

**Tech Stack:** FastAPI, Uvicorn, python-jose (JWT), passlib (password hashing stays), python-multipart (form data), starlette CORS middleware, sqlite3 (unchanged).

**Current State:**
- 296 endpoints across 11 blueprint files (~18,700 lines of route code)
- Filesystem sessions via flask-session
- 3 auth decorators: `@login_required`, `@admin_required`, `@guest_only`
- Jinja2 templates (legacy, all replaced by React SPA)
- Frontend uses `fetch()` with `credentials: 'include'` and relative paths
- No ORM — raw sqlite3 with `sqlite3.Row`
- Services: AIService, AudioService, AssessmentService + 7 gamification services

**Migration Strategy:** File-by-file, bottom-up. Start with foundation (deps, config, auth), then migrate route files one at a time from smallest to largest, then update frontend.

---

## Task 1: Set Up FastAPI Project Structure & Dependencies

**Files:**
- Create: `backend/requirements-fastapi.txt`
- Create: `backend/main.py` (new FastAPI entry point)

**Step 1: Create new requirements file**

```
fastapi==0.109.0
uvicorn[standard]==0.27.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
python-dotenv==1.0.0
groq==0.31.0
edge-tts==6.1.9
requests==2.31.0
```

**Step 2: Create minimal main.py**

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import logging

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="FARDI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=5010, reload=True)
```

**Step 3: Install deps and verify server starts**

```bash
cd backend
pip install -r requirements-fastapi.txt
python main.py
# Verify: curl http://localhost:5010/api/health → {"status":"ok"}
```

**Step 4: Commit**

```bash
git add backend/requirements-fastapi.txt backend/main.py
git commit -m "feat: add FastAPI project skeleton with health check"
```

---

## Task 2: Migrate Database Manager (No Changes Needed — Verify)

**Files:**
- Verify: `backend/models/auth.py` (DatabaseManager class, lines 14-521)

**Step 1: Verify DatabaseManager has no Flask imports in class body**

The `DatabaseManager` class uses only `sqlite3`, `hashlib`, `secrets`, `datetime`, `logging`. It does NOT import Flask. The Flask imports (`session`, `redirect`, `url_for`, `flash`) are only used by the auth decorators at the bottom of the file (lines 1480-1540) and the `User` class methods that reference session.

**Step 2: Create database dependency for FastAPI**

Create: `backend/dependencies.py`

```python
from models.auth import DatabaseManager, User, AssessmentHistory

# Singleton instances (same pattern as Flask app)
db_manager = DatabaseManager()
user_manager = User(db_manager)
assessment_history = AssessmentHistory(db_manager)
```

**Step 3: Verify DB init works outside Flask**

```bash
cd backend
python -c "from dependencies import db_manager; print('DB OK:', db_manager.db_path)"
```

**Step 4: Commit**

```bash
git add backend/dependencies.py
git commit -m "feat: add FastAPI dependency module for database singletons"
```

---

## Task 3: Implement JWT Authentication System

**Files:**
- Create: `backend/auth_utils.py`

This replaces Flask's filesystem sessions with JWT tokens in httpOnly cookies.

**Step 1: Create auth_utils.py**

```python
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from fastapi import Request, HTTPException, Depends, Response
from fastapi.responses import JSONResponse
import os

SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 30

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_token_from_cookie(request: Request) -> Optional[str]:
    return request.cookies.get("access_token")

def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

def set_auth_cookie(response: Response, token: str):
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        max_age=ACCESS_TOKEN_EXPIRE_DAYS * 24 * 3600,
        samesite="lax",
        secure=False,  # Set True in production with HTTPS
    )

def clear_auth_cookie(response: Response):
    response.delete_cookie(key="access_token")

# --- FastAPI Dependencies (replace Flask decorators) ---

async def get_current_user(request: Request) -> dict:
    """Replaces @login_required"""
    token = get_token_from_cookie(request)
    if not token:
        raise HTTPException(status_code=401, detail="Authentication required. Please log in.")
    payload = decode_token(token)
    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload  # Contains: user_id, username, email, is_admin, role

async def get_current_admin(user: dict = Depends(get_current_user)) -> dict:
    """Replaces @admin_required"""
    if not user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return user

# Optional: get user if logged in, None if not
async def get_optional_user(request: Request) -> Optional[dict]:
    """For routes that work with or without auth"""
    token = get_token_from_cookie(request)
    if not token:
        return None
    try:
        return decode_token(token)
    except HTTPException:
        return None
```

**Step 2: Verify imports work**

```bash
cd backend
python -c "from auth_utils import create_access_token, get_current_user; print('Auth utils OK')"
```

**Step 3: Commit**

```bash
git add backend/auth_utils.py
git commit -m "feat: add JWT auth utilities replacing Flask session-based auth"
```

---

## Task 4: Migrate Auth Routes (backend/routes/auth_routes.py → backend/routers/auth.py)

**Files:**
- Create: `backend/routers/auth.py` (new FastAPI router)
- Modify: `backend/main.py` (register router)

The original has 14 endpoints. We only migrate the API endpoints (JSON responses). Template-rendering routes are dropped since React handles all UI.

**Step 1: Create routers directory and auth.py**

```python
from fastapi import APIRouter, Depends, Request, Response, HTTPException
from fastapi.responses import JSONResponse
from dependencies import db_manager, user_manager, assessment_history
from auth_utils import (
    create_access_token, set_auth_cookie, clear_auth_cookie,
    get_current_user, get_current_admin
)
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/api/login")
async def login(request: Request):
    data = await request.json()
    username = data.get("username", "").strip()
    password = data.get("password", "")

    if not username or not password:
        return JSONResponse({"success": False, "error": "Username and password required"}, status_code=400)

    user = user_manager.authenticate_user(username, password)
    if not user:
        return JSONResponse({"success": False, "error": "Invalid credentials"}, status_code=401)

    token = create_access_token({
        "user_id": user["id"],
        "username": user["username"],
        "email": user.get("email", ""),
        "first_name": user.get("first_name", ""),
        "last_name": user.get("last_name", ""),
        "is_admin": bool(user.get("is_admin", False)),
        "role": user.get("role", "user"),
    })

    redirect_url = "/admin" if user.get("is_admin") else "/dashboard"
    response = JSONResponse({
        "success": True,
        "redirect_url": redirect_url,
        "user": {
            "id": user["id"],
            "username": user["username"],
            "email": user.get("email"),
            "first_name": user.get("first_name"),
            "last_name": user.get("last_name"),
            "is_admin": bool(user.get("is_admin")),
        }
    })
    set_auth_cookie(response, token)
    return response

@router.post("/api/signup")
async def signup(request: Request):
    data = await request.json()
    username = data.get("username", "").strip()
    email = data.get("email", "").strip()
    password = data.get("password", "")
    first_name = data.get("first_name", "").strip()
    last_name = data.get("last_name", "").strip()

    if not username or not email or not password:
        return JSONResponse({"success": False, "error": "All fields are required"}, status_code=400)

    existing = user_manager.get_user_by_email(email)
    if existing:
        return JSONResponse({"success": False, "error": "Email already registered"}, status_code=409)

    user_id = user_manager.create_user(
        username=username, email=email, password=password,
        first_name=first_name, last_name=last_name
    )
    if not user_id:
        return JSONResponse({"success": False, "error": "Username already taken"}, status_code=409)

    token = create_access_token({
        "user_id": user_id,
        "username": username,
        "email": email,
        "first_name": first_name,
        "last_name": last_name,
        "is_admin": False,
        "role": "user",
    })

    response = JSONResponse({"success": True, "redirect_url": "/dashboard"})
    set_auth_cookie(response, token)
    return response

@router.get("/api/me")
async def get_me(user: dict = Depends(get_current_user)):
    return {
        "authenticated": True,
        "user": {
            "id": user["user_id"],
            "username": user["username"],
            "email": user.get("email"),
            "first_name": user.get("first_name"),
            "last_name": user.get("last_name"),
            "is_admin": user.get("is_admin", False),
        }
    }

@router.get("/logout")
async def logout():
    response = JSONResponse({"success": True})
    clear_auth_cookie(response)
    return response

@router.post("/api/change-password")
async def change_password(request: Request, user: dict = Depends(get_current_user)):
    data = await request.json()
    current_password = data.get("current_password", "")
    new_password = data.get("new_password", "")

    if not current_password or not new_password:
        return JSONResponse({"success": False, "error": "All fields required"}, status_code=400)

    if len(new_password) < 8:
        return JSONResponse({"success": False, "error": "Password must be at least 8 characters"}, status_code=400)

    result = user_manager.change_password(user["user_id"], current_password, new_password)
    if result:
        return {"success": True, "message": "Password changed successfully"}
    return JSONResponse({"success": False, "error": "Current password is incorrect"}, status_code=400)

@router.get("/api/profile")
async def get_profile(user: dict = Depends(get_current_user)):
    user_data = user_manager.get_user_by_id(user["user_id"])
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "success": True,
        "user": {
            "id": user_data["id"],
            "username": user_data["username"],
            "email": user_data["email"],
            "first_name": user_data.get("first_name"),
            "last_name": user_data.get("last_name"),
            "created_at": user_data.get("created_at"),
            "role": user_data.get("role", "user"),
            "is_admin": bool(user_data.get("is_admin")),
        }
    }

@router.post("/api/edit-profile")
async def edit_profile(request: Request, user: dict = Depends(get_current_user)):
    data = await request.json()
    allowed_fields = ["first_name", "last_name", "email"]
    updates = {k: v for k, v in data.items() if k in allowed_fields and v}

    if not updates:
        return JSONResponse({"success": False, "error": "No valid fields to update"}, status_code=400)

    result = user_manager.update_user(user["user_id"], **updates)
    if result:
        return {"success": True, "message": "Profile updated"}
    return JSONResponse({"success": False, "error": "Update failed"}, status_code=500)
```

**Step 2: Register router in main.py**

Add to `backend/main.py`:
```python
from routers.auth import router as auth_router
app.include_router(auth_router)
```

**Step 3: Test auth endpoints**

```bash
# Start server
python main.py &

# Test signup
curl -X POST http://localhost:5010/auth/api/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"test1234","first_name":"Test","last_name":"User"}'

# Test login
curl -X POST http://localhost:5010/auth/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test1234"}' -c cookies.txt

# Test /me with cookie
curl http://localhost:5010/auth/api/me -b cookies.txt
```

**Step 4: Commit**

```bash
git add backend/routers/auth.py backend/main.py
git commit -m "feat: migrate auth routes to FastAPI with JWT cookies"
```

---

## Task 5: Migrate Admin Routes (backend/routes/admin_routes.py → backend/routers/admin.py)

**Files:**
- Create: `backend/routers/admin.py`
- Modify: `backend/main.py` (register router)

Port the admin API endpoints from `admin_routes.py` (312 lines, 4 endpoints) and admin endpoints currently in `app.py` (dashboard, users, analytics, user details).

**Step 1: Read current admin_routes.py and app.py admin endpoints to understand exact response shapes**

Read `backend/routes/admin_routes.py` fully, and `backend/app.py` lines 346-500 (admin API endpoints).

**Step 2: Create routers/admin.py**

Migrate all `/api/admin/*` endpoints. Replace `@admin_required` with `Depends(get_current_admin)`. Replace `session['user_id']` with `user["user_id"]`. Replace `jsonify()` with direct dict returns. Keep exact same response JSON shapes so frontend doesn't break.

**Step 3: Register in main.py**

```python
from routers.admin import router as admin_router
app.include_router(admin_router)
```

**Step 4: Commit**

```bash
git add backend/routers/admin.py backend/main.py
git commit -m "feat: migrate admin routes to FastAPI"
```

---

## Task 6: Migrate Gamification Routes (backend/routes/gamification_routes.py → backend/routers/gamification.py)

**Files:**
- Create: `backend/routers/gamification.py`
- Modify: `backend/main.py`

Port 17 endpoints (403 lines). These are pure JSON API endpoints — no templates.

**Step 1: Read current gamification_routes.py fully**

**Step 2: Create routers/gamification.py**

Pattern for each endpoint:
- `@bp.route('/path', methods=['POST'])` → `@router.post('/path')`
- `session['user_id']` → `user["user_id"]` from `Depends(get_current_user)`
- `jsonify(data)` → return `data` dict directly
- `request.json` → `await request.json()`

**Step 3: Register in main.py, test, commit**

```bash
git commit -m "feat: migrate gamification routes to FastAPI"
```

---

## Task 7: Migrate Evaluation Routes (backend/routes/evaluation_routes.py → backend/routers/evaluation.py)

**Files:**
- Create: `backend/routers/evaluation.py`
- Modify: `backend/main.py`

Port 6 POST endpoints (664 lines). AI evaluation — pure JSON.

**Step 1-4: Same pattern as Task 6**

```bash
git commit -m "feat: migrate evaluation routes to FastAPI"
```

---

## Task 8: Migrate API Routes (backend/routes/api_routes.py → backend/routers/api.py)

**Files:**
- Create: `backend/routers/api.py`
- Modify: `backend/main.py`

This is the core game API — 26 endpoints, 2,168 lines. Phase 1 game flow, Phase 2 submission, results, AI feedback, audio generation, dashboard.

**Critical:** This file uses `session` heavily for game state (current_step, responses, assessments, xp). In FastAPI, game state must be stored in the database instead of sessions. The JWT token only carries user identity.

**Step 1: Read api_routes.py fully to catalog all session keys used for game state**

Session keys used:
- `session['current_step']`, `session['responses']`, `session['assessments']` — Phase 1 game state
- `session['xp']`, `session['overall_level']` — Game progress
- `session['phase1_completed']` — Completion flag
- `session['phase2_*']` — Phase 2 state

**Step 2: Create a game state helper**

For Phase 1 game state that was in sessions, store in database or pass via request. The simplest approach: store game state in a `game_sessions` table keyed by user_id.

**Step 3: Create routers/api.py migrating each endpoint**

Replace session reads/writes with database operations. Keep response shapes identical.

**Step 4: Register in main.py, test, commit**

```bash
git commit -m "feat: migrate core API routes to FastAPI with DB-backed game state"
```

---

## Task 9: Migrate Phase 3 Routes (backend/routes/phase3_routes.py → backend/routers/phase3.py)

**Files:**
- Create: `backend/routers/phase3.py`
- Modify: `backend/main.py`

Port 9 endpoints (460 lines).

**Step 1-4: Same pattern. Replace session access, register router, commit.**

```bash
git commit -m "feat: migrate phase 3 routes to FastAPI"
```

---

## Task 10: Migrate Phase 4 Routes (backend/routes/phase4_routes.py → backend/routers/phase4.py)

**Files:**
- Create: `backend/routers/phase4.py`
- Modify: `backend/main.py`

Port 53 endpoints (6,361 lines). Largest route file — mostly mechanical conversion.

```bash
git commit -m "feat: migrate phase 4 routes to FastAPI"
```

---

## Task 11: Migrate Phase 5 Routes (backend/routes/phase5_routes.py → backend/routers/phase5.py)

**Files:**
- Create: `backend/routers/phase5.py`
- Modify: `backend/main.py`

Port 82 endpoints (4,872 lines).

```bash
git commit -m "feat: migrate phase 5 routes to FastAPI"
```

---

## Task 12: Migrate Phase 6 Routes (backend/routes/phase6_routes.py → backend/routers/phase6.py)

**Files:**
- Create: `backend/routers/phase6.py`
- Modify: `backend/main.py`

Port 63 endpoints (1,638 lines).

```bash
git commit -m "feat: migrate phase 6 routes to FastAPI"
```

---

## Task 13: Migrate Exercise Builder & Workflow Routes

**Files:**
- Create: `backend/routers/exercise_builder.py`
- Create: `backend/routers/workflow.py`
- Modify: `backend/main.py`

Port exercise_builder_routes.py (20 endpoints, 851 lines) and workflow_importer.py (2 endpoints, 406 lines).

```bash
git commit -m "feat: migrate exercise builder and workflow routes to FastAPI"
```

---

## Task 14: Migrate Chat System

**Files:**
- Create: `backend/routers/chat.py`
- Modify: `backend/main.py`

Chat endpoints are currently inline in app.py (lines 1518-1691). Port 5 endpoints.

```bash
git commit -m "feat: migrate chat system to FastAPI"
```

---

## Task 15: Update Frontend — Vite Proxy Configuration

**Files:**
- Modify: `frontend/vite.config.js`

The frontend currently uses relative paths (`/api/...`, `/auth/...`). In the new architecture, React runs on :5173 and FastAPI runs on :5010. Add a Vite proxy so relative paths keep working in dev.

**Step 1: Update vite.config.js**

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5010',
        changeOrigin: true,
      },
      '/auth': {
        target: 'http://localhost:5010',
        changeOrigin: true,
      },
      '/start-game': {
        target: 'http://localhost:5010',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 5173,
  },
  base: '/'
})
```

**Step 2: Test frontend can still reach API through proxy**

```bash
cd frontend && npm run dev
# In another terminal: cd backend && python main.py
# Open http://localhost:5173 — login should work through proxy
```

**Step 3: Commit**

```bash
git add frontend/vite.config.js
git commit -m "feat: add Vite proxy for FastAPI backend"
```

---

## Task 16: Clean Up & Final Verification

**Files:**
- Modify: `backend/main.py` (final state with all routers)
- Keep: `backend/app.py` (do NOT delete — keep as reference until fully verified)

**Step 1: Verify all routers are registered in main.py**

```python
# main.py should include:
from routers.auth import router as auth_router
from routers.admin import router as admin_router
from routers.api import router as api_router
from routers.gamification import router as gamification_router
from routers.evaluation import router as evaluation_router
from routers.phase3 import router as phase3_router
from routers.phase4 import router as phase4_router
from routers.phase5 import router as phase5_router
from routers.phase6 import router as phase6_router
from routers.exercise_builder import router as exercise_builder_router
from routers.workflow import router as workflow_router
from routers.chat import router as chat_router

app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(api_router)
app.include_router(gamification_router)
app.include_router(evaluation_router)
app.include_router(phase3_router)
app.include_router(phase4_router)
app.include_router(phase5_router)
app.include_router(phase6_router)
app.include_router(exercise_builder_router)
app.include_router(workflow_router)
app.include_router(chat_router)
```

**Step 2: Start FastAPI and test key flows**

```bash
cd backend && python main.py
# Test: signup → login → dashboard → start game → submit response → results
```

**Step 3: Verify frontend works end-to-end**

```bash
cd frontend && npm run dev
# Full test: register, login, play through Phase 1, check Phase 2, admin dashboard
```

**Step 4: Final commit**

```bash
git commit -m "feat: complete Flask to FastAPI migration"
```

---

## Migration Order Summary

| # | Component | Endpoints | Lines | Difficulty |
|---|-----------|-----------|-------|------------|
| 1 | Project setup | 1 | ~30 | Easy |
| 2 | DB dependency | 0 | ~10 | Easy |
| 3 | JWT auth utils | 0 | ~80 | Medium |
| 4 | Auth routes | 8 | ~150 | Medium |
| 5 | Admin routes | 8 | ~200 | Easy |
| 6 | Gamification | 17 | ~350 | Easy |
| 7 | Evaluation | 6 | ~600 | Easy |
| 8 | Core API | 26 | ~2000 | **Hard** (session→DB) |
| 9 | Phase 3 | 9 | ~400 | Easy |
| 10 | Phase 4 | 53 | ~6000 | Medium (volume) |
| 11 | Phase 5 | 82 | ~4500 | Medium (volume) |
| 12 | Phase 6 | 63 | ~1500 | Medium |
| 13 | Exercise/Workflow | 22 | ~1200 | Easy |
| 14 | Chat | 5 | ~170 | Easy |
| 15 | Frontend proxy | 0 | ~20 | Easy |
| 16 | Cleanup | 0 | ~50 | Easy |

**Key Risk:** Task 8 (Core API) is the hardest because Phase 1 game state lives in Flask sessions. Need to move to DB-backed state.

**What stays unchanged:**
- All `backend/models/*.py` (except removing Flask imports from auth decorators)
- All `backend/services/*.py`
- All `backend/utils/*.py`
- SQLite database schema
- Frontend React components (only vite.config.js changes)
