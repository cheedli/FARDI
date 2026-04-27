# FARDI API Reference

Complete backend API reference for the FARDI CEFR Language Assessment Platform.  
Backend: FastAPI (Python). Interactive docs auto-generated at `/docs` (Swagger UI) and `/redoc`.

---

## Base URLs

| Environment | Base URL |
|-------------|----------|
| Development | `http://localhost:8000` |
| Production  | `http://localhost:5010` (or the production host) |

All API endpoints are relative to the base URL. The frontend dev server runs on `:5173` and proxies API calls to the backend.

---

## Authentication Scheme

FARDI uses **JWT tokens stored in HttpOnly cookies** — not Authorization headers.

### How it works

1. Call `POST /auth/api/login` or `POST /auth/api/signup`.
2. On success, the server sets an HttpOnly cookie named `access_token` containing a signed JWT (HS256, 30-day expiry).
3. Every subsequent request automatically includes this cookie. No manual header required.
4. Call `GET /auth/logout` to clear the cookie.

### Token payload fields

| Field | Type | Description |
|-------|------|-------------|
| `user_id` | integer | Database primary key |
| `username` | string | Login username |
| `email` | string | User email |
| `first_name` | string | First name |
| `last_name` | string | Last name |
| `is_admin` | boolean | Admin flag |
| `role` | string | `"user"` or `"admin"` |
| `exp` | integer | Unix expiry timestamp |

### FastAPI dependencies (authentication levels)

| Dependency | Description | HTTP error if missing |
|------------|-------------|----------------------|
| `get_current_user` | Requires valid JWT cookie | 401 |
| `get_current_admin` | Requires valid JWT cookie **and** `is_admin = true` | 401 / 403 |
| `get_optional_user` | Returns user or `None` if not authenticated | — |

---

## Common Error Format

All error responses follow one of two shapes depending on whether the route uses FastAPI exceptions or manual JSON responses:

**HTTPException shape:**
```json
{ "detail": "Human-readable error message" }
```

**Manual JSONResponse shape:**
```json
{ "success": false, "error": "Human-readable error message" }
```

Common HTTP status codes:

| Code | Meaning |
|------|---------|
| 400 | Bad request / validation failure |
| 401 | Not authenticated (missing or invalid JWT) |
| 403 | Authenticated but insufficient privileges |
| 404 | Resource not found |
| 409 | Conflict (e.g. email already registered) |
| 500 | Unhandled server error |

---

## Section Index

1. [Authentication](#1-authentication-authapi)
2. [Game API — Phase 1 & 2](#2-game-api-api)
3. [Evaluation](#3-evaluation-apievaluate-)
4. [Gamification](#4-gamification-apigamification)
5. [Progress](#5-progress-apiprogress)
6. [Chat](#6-chat-apichat)
7. [Phase 3](#7-phase-3-apiphase3)
8. [Phase 4](#8-phase-4-apiphase4)
9. [Phase 5](#9-phase-5-apiphase5)
10. [Phase 6](#10-phase-6-apiphase6)
11. [Admin](#11-admin-apiadmin--admin)
12. [Health & Misc](#12-health--misc)

---

## 1. Authentication (`/auth/api/...`)

Router prefix: `/auth`

---

### `GET /auth/api/me`

Check current session status. Called by the frontend on every app load.

**Auth:** None required (uses `get_optional_user`).

**Response:**
```json
// Authenticated
{
  "authenticated": true,
  "user": {
    "id": 1,
    "username": "alice",
    "email": "alice@example.com",
    "first_name": "Alice",
    "last_name": "Smith",
    "is_admin": false,
    "role": "user"
  }
}

// Not authenticated
{ "authenticated": false, "user": null }
```

---

### `POST /auth/api/login`

Authenticate a user and issue a JWT cookie.

**Auth:** None.

**Request body:**
```json
{
  "username_or_email": "alice",
  "password": "Secret123"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `username_or_email` | string | yes | Username or email address |
| `password` | string | yes | Plain-text password |

**Success response** — sets `access_token` HttpOnly cookie:
```json
{
  "success": true,
  "redirect_url": "/dashboard",
  "user": {
    "id": 1, "username": "alice", "email": "...",
    "first_name": "Alice", "last_name": "Smith",
    "is_admin": false, "role": "user"
  }
}
```
`redirect_url` is `/admin` for admins, `/dashboard` for regular users.

**Error responses:**

| Code | Condition |
|------|-----------|
| 400 | Missing `username_or_email` or `password` |
| 401 | Invalid credentials |
| 500 | Server error |

---

### `POST /auth/api/signup`

Register a new user account with auto-login.

**Auth:** None.

**Request body:**
```json
{
  "username": "alice",
  "email": "alice@example.com",
  "password": "Secret123",
  "first_name": "Alice",
  "last_name": "Smith"
}
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `username` | string | yes | 3–20 chars, alphanumeric + underscores |
| `email` | string | yes | Valid email format |
| `password` | string | yes | Min 8 chars, at least 1 uppercase, 1 lowercase, 1 digit |
| `first_name` | string | no | — |
| `last_name` | string | no | — |

**Success response** — sets `access_token` HttpOnly cookie:
```json
{
  "success": true,
  "user": { "id": 1, "username": "alice", "email": "...", ... }
}
```

**Error responses:**

| Code | Condition |
|------|-----------|
| 400 | Validation failure (returns first error message) |
| 400 | Username or email already taken |

---

### `GET /auth/logout`

Clear the JWT cookie and redirect to home.

**Auth:** None.

**Response:** HTTP 302 redirect to `/`.

---

### `POST /auth/api/change-password`

Change the authenticated user's password.

**Auth:** Required (`get_current_user`).

**Request body:**
```json
{
  "current_password": "OldSecret123",
  "new_password": "NewSecret456",
  "confirm_password": "NewSecret456"
}
```

| Field | Type | Required |
|-------|------|----------|
| `current_password` | string | yes |
| `new_password` | string | yes |
| `confirm_password` | string | no (checked if provided) |

**Success response:**
```json
{ "success": true, "message": "Password changed successfully" }
```

**Error responses:** 400 for missing/invalid password, wrong current password, or mismatch.

---

### `GET /auth/api/profile`

Get the authenticated user's profile and assessment statistics.

**Auth:** Required.

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1, "username": "alice", "email": "...",
    "first_name": "Alice", "last_name": "Smith",
    "created_at": "2025-01-15T10:00:00",
    "role": "user", "is_admin": false,
    "preferred_language": "en", "timezone": "UTC"
  },
  "stats": { /* AssessmentHistory.get_user_stats() */ },
  "recent_assessments": [ /* last 5 assessments */ ]
}
```

**Error responses:** 404 if user not found in DB.

---

### `POST /auth/api/edit-profile`

Update profile fields. Re-issues the JWT cookie with updated data.

**Auth:** Required.

**Request body:**
```json
{
  "first_name": "Alice",
  "last_name": "Smith",
  "email": "newemail@example.com",
  "preferred_language": "en",
  "timezone": "UTC"
}
```

All fields are optional. Email is validated if changed and checked for uniqueness.

**Success response** — refreshes `access_token` cookie:
```json
{ "success": true, "message": "Profile updated" }
```

**Error responses:** 400 invalid email, 409 email already registered, 500 update failed.

---

### `POST /auth/api/delete-account`

Deactivate (soft-delete) the authenticated user's account.

**Auth:** Required.

**Request body:**
```json
{
  "password": "Secret123",
  "confirmation": "DELETE"
}
```

`confirmation` must be the literal string `"DELETE"`.

**Success response** — clears cookie:
```json
{ "success": true, "message": "Account deleted" }
```

**Error responses:** 400 if confirmation text wrong or password incorrect.

---

### `GET /auth/api/check-username`

Check if a username is available (for real-time signup form validation).

**Auth:** None.

**Query parameters:**

| Param | Type | Required |
|-------|------|----------|
| `username` | string | yes |

**Response:**
```json
{ "available": true, "message": "Username is available" }
{ "available": false, "message": "Username is already taken" }
```

---

### `GET /auth/api/check-email`

Check if an email is available (for real-time signup form validation).

**Auth:** None.

**Query parameters:**

| Param | Type | Required |
|-------|------|----------|
| `email` | string | yes |

**Response:**
```json
{ "available": true, "message": "Email is available" }
{ "available": false, "message": "Email is already registered" }
```

---

### `POST /auth/api/forgot-password`

Request a password reset token (always returns success to prevent email enumeration).

**Auth:** None.

**Request body:**
```json
{ "email": "alice@example.com" }
```

**Response:**
```json
{ "message": "If an account exists with that email, a reset link has been sent." }
```

Note: In the current implementation, the token is only logged server-side. Email delivery is not yet wired up.

**Error responses:** 400 if email format invalid.

---

### `POST /auth/api/reset-password`

Reset password using a token obtained from the forgot-password flow.

**Auth:** None.

**Request body:**
```json
{
  "token": "<reset-token>",
  "password": "NewSecret123"
}
```

**Response:**
```json
{ "message": "Password reset successful" }
```

**Error responses:** 400 if token missing, password too weak, or token invalid/expired.

---

### `GET /auth/api/debug/db-test`

Debug endpoint — tests database connectivity and returns user count.

**Auth:** None.

**Response:**
```json
{
  "status": "success",
  "user_count": 42,
  "table_columns": ["id", "username", "email", ...],
  "message": "Database connection successful"
}
```

---

## 2. Game API (`/api/...`)

Router prefix: `/api`. Covers game session management, Phase 1 (dialogue assessment), and Phase 2 (writing tasks).

---

### `GET /api/start-game` or `POST /api/start-game`

Also mounted at the root as `GET/POST /start-game` for legacy compatibility.

Initialize or reset the current user's game session.

**Auth:** Required.

**Response:**
```json
{ "success": true, "redirect": "/game" }
```

Side effect: Resets `current_step`, `responses`, `assessments`, and `xp` for the user in the `game_sessions` table.

---

### `GET /api/game/state`

Get the current Phase 1 dialogue question and game state.

**Auth:** Required.

**Query parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `step` | integer | no | Force a specific step (0-indexed); defaults to session's current step |

**Response (in-progress):**
```json
{
  "completed": false,
  "current_step": 3,
  "total_steps": 10,
  "xp": 120,
  "question": {
    "step": 4,
    "speaker": "Ms. Mabrouki",
    "question": "What motivates you to learn English?",
    "instruction": "...",
    "type": "open_ended",
    "skill": "self-expression",
    "scene": "meeting_room",
    "audio_cue": "question_4.mp3"
  },
  "npcs": ["Ms. Mabrouki", "Dr. Ben Ali", ...],
  "scene_description": "A bright conference room...",
  "skill_description": "Ability to introduce yourself...",
  "speaker_role": "English Coordinator",
  "speaker_avatar": "/static/avatars/mabrouki.png",
  "audio_url": "/static/audio/question_4.mp3"
}
```

**Response (completed):**
```json
{ "completed": true, "current_step": 10, "total_steps": 10, "xp": 350 }
```

---

### `POST /api/game/submit`

Submit an answer to the current Phase 1 dialogue question.

**Auth:** Required.

**Request body:**
```json
{
  "response": "I want to improve my career prospects...",
  "question_type": "open_ended"
}
```

| Field | Type | Required |
|-------|------|----------|
| `response` | string | yes |
| `question_type` | string | no (falls back to question's type) |

**Success response:**
```json
{
  "success": true,
  "xp_earned": 18,
  "assessment": {
    "level": "B1",
    "points": 3,
    "type": "open_ended",
    "step": 4,
    "ai_generated": false,
    "ai_score": 0.02,
    "ai_reasons": []
  }
}
```

**Error responses:**

| Code | Condition |
|------|-----------|
| 400 | `response` is empty |
| 400 | AI content detected (score > 50%). Body includes `ai_score` and `ai_reasons`. |

---

### `GET /api/results`

Finalize Phase 1 and retrieve the full assessment results. Saves results to the database.

**Auth:** Required.

**Response:**
```json
{
  "player_name": "Alice",
  "overall_level": "B1",
  "level_description": "Independent user who can understand main ideas on familiar topics...",
  "assessments": [...],
  "responses": [...],
  "xp": 350,
  "skill_levels": { "grammar": "B1", "vocabulary": "A2", ... },
  "achievements_earned": ["first_assessment", "consistent_speaker"],
  "badges": { ... },
  "progress_levels": [ { "name": "Phase 2", "is_unlocked": true, ... } ],
  "cefr_levels": { "A1": "...", "A2": "...", ... },
  "ai_responses_count": 0,
  "responses_length": 10,
  "ai_percentage": 0,
  "saved": true,
  "session_id": "uuid-string"
}
```

**Error responses:** 404 if no assessment data exists for the user (Phase 1 not started).

---

### `POST /api/get-ai-feedback`

Get in-character AI feedback on a response during Phase 1 dialogue.

**Auth:** Required.

**Request body:**
```json
{
  "question": "What motivates you to learn English?",
  "response": "I want better job opportunities...",
  "speaker": "Ms. Mabrouki",
  "type": "open_ended"
}
```

**Response:**
```json
{
  "ai_response": "Excellent effort! Remember to capitalize 'I' — use 'I want' not 'i want'. Consider adding more detail about which job aspects interest you.",
  "assessment": {
    "level": "B1",
    "strengths": ["relevant vocabulary", "clear purpose"],
    "improvements": ["sentence complexity"],
    "ai_generated": false,
    "ai_score": 0.01,
    "ai_reasons": []
  }
}
```

---

### `GET /api/language-tips`

Get randomized language learning tips for a given CEFR level.

**Auth:** Required.

**Query parameters:**

| Param | Type | Default |
|-------|------|---------|
| `level` | string | `B1` |

**Response:**
```json
{ "level": "B1", "tips": ["Use 'because' to give reasons.", "Try compound sentences."] }
```

---

### `GET /api/next-challenge`

Get a random language challenge for a given CEFR level.

**Auth:** Required.

**Query parameters:**

| Param | Type | Default |
|-------|------|---------|
| `level` | string | `B1` |

**Response:**
```json
{ "level": "B1", "challenge": "Describe your ideal job in 3 sentences.", "xp_reward": 25 }
```

---

### `POST /api/check-ai-response`

Check if a response was AI-generated (Sapling API integration with heuristic fallback).

**Auth:** Required.

**Request body:**
```json
{ "response": "I am deeply passionate about..." }
```

**Response:**
```json
{
  "is_ai": false,
  "score": 0.05,
  "message": "AI detection score: 5%",
  "reasons": []
}
```

Note: Responses shorter than 20 characters always return `is_ai: false`.

---

### `POST /api/generate-audio`

Generate TTS audio for a given text using Edge TTS.

**Auth:** Required.

**Request body:**
```json
{
  "text": "Welcome to the Global Cultures Festival!",
  "voice": "en-US-ChristopherNeural",
  "filename": "custom_greeting.mp3"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `text` | string | yes | Text to synthesize |
| `voice` | string | no | Edge TTS voice name (default: `en-US-ChristopherNeural`) |
| `filename` | string | no | Output filename (default: timestamped) |

**Response:**
```json
{ "success": true, "audio_url": "/static/audio/custom_greeting.mp3" }
```

---

### `POST /api/phase2/submit-response`

Submit a Phase 2 writing response for AI assessment.

**Auth:** Required.

**Request body:**
```json
{
  "step_id": "step_1",
  "action_item_id": "item_1",
  "response": "I believe the event should focus on..."
}
```

| Field | Type | Required |
|-------|------|----------|
| `step_id` | string | yes — one of `step_1`, `step_2`, `step_3`, `final_writing` |
| `action_item_id` | string | yes |
| `response` | string | yes |

**Success response:**
```json
{
  "success": true,
  "assessment": {
    "level": "B1",
    "points": 3,
    "cefr_level": "B1",
    "feedback": "..."
  },
  "xp_earned": 30,
  "is_last_item": false,
  "next_action_item": { "id": "item_2", ... },
  "step_completed": false
}
```

**Error responses:**

| Code | Condition |
|------|-----------|
| 400 | Missing `step_id`, `action_item_id`, or `response` |
| 400 | Invalid `step_id` |
| 400 | AI content detected |

---

## 3. Evaluation (`/api/evaluate-...`, `/api/validate-...`, `/api/get-...`, `/api/evaluate/...`)

Router prefix: `/api`. No authentication required on any evaluation endpoint.

---

### `POST /api/evaluate-writing`

Evaluate a free-text writing response using AI (Groq), with local heuristic fallback.

**Auth:** None.

**Request body:**
```json
{
  "response": "The student's written text here...",
  "prompt": "Evaluation criteria from the exercise config",
  "context": "Additional context (template, instructions)",
  "task_type": "writing"
}
```

| Field | Type | Required |
|-------|------|----------|
| `response` | string | yes |
| `prompt` | string | no |
| `context` | string | no |
| `task_type` | string | no (default: `"writing"`) |

**Response:**
```json
{
  "is_correct": true,
  "score": 82,
  "feedback": "Great job! Your response is well-written.",
  "suggestions": [],
  "detected_level": "B1"
}
```

`detected_level` is one of `A1`, `A2`, `B1`, `B2`.

---

### `POST /api/evaluate-batch`

Evaluate multiple responses using the local heuristic evaluator (AI not used).

**Auth:** None.

**Request body:**
```json
{
  "responses": [
    { "response": "...", "context": "...", "task_type": "writing" },
    { "response": "...", "context": "...", "task_type": "writing" }
  ]
}
```

**Response:** Array of evaluation objects (same shape as `evaluate-writing` response).

---

### `POST /api/validate-gap-fill`

Validate a gap-fill answer against a correct answer using keyword matching.

**Auth:** None.

**Request body:**
```json
{
  "user_answer": "because of the weather",
  "correct_answer": "because of the bad weather conditions",
  "context": "optional context"
}
```

**Response:**
```json
{
  "is_correct": true,
  "is_acceptable": true,
  "feedback": "Good answer!"
}
```

Matching logic: exact match → `is_correct: true`; ≥80% keyword overlap → acceptable; ≥50% → `is_acceptable: true` but `is_correct: false`; below that → both false.

---

### `POST /api/get-writing-hint`

Get an AI-generated hint for a writing task (falls back to generic hint).

**Auth:** None.

**Request body:**
```json
{
  "template": "We need a _____ for the poster...",
  "instruction": "Complete the sentence about the poster.",
  "current_text": "We need a slogan"
}
```

**Response:**
```json
{
  "hint": "Good progress! Make sure to complete your thought.",
  "example_start": ""
}
```

---

### `POST /api/evaluate/sentence`

Evaluate a sentence and assign a CEFR level (A1–C1) using AI comparison against example sentences.

**Auth:** None.

**Request body:**
```json
{
  "sentence": "A strong slogan like 'Discover Global Cultures!' would make the poster memorable.",
  "targetWord": "slogan",
  "exampleSentences": {
    "A1": "Slogan good.",
    "A2": "The poster has slogan.",
    "B1": "We need a catchy slogan for the poster.",
    "B2": "A strong slogan like 'Discover...' makes the poster eye-catching.",
    "C1": "An effective slogan encapsulates the festival's ethos..."
  }
}
```

**Response:**
```json
{
  "success": true,
  "evaluation": {
    "level": "B2",
    "score": 4,
    "feedback": "Excellent work! Your sentence shows strong vocabulary and persuasive language."
  }
}
```

`score` maps levels A1→1, A2→2, B1→3, B2→4, C1→5.

**Error responses:** 400 if `sentence` empty or `targetWord` not found in sentence.

---

### `POST /api/evaluate-expansion`

Evaluate a sentence expansion exercise (connector-based: "because" or "and").

**Auth:** None.

**Request body:**
```json
{
  "prompt": "Make poster",
  "expansion": "Make poster because eye-catcher",
  "example": "Make poster because eye-catcher"
}
```

**Response:**
```json
{
  "isValid": 1,
  "feedback": "Good expansion! You added meaningful content."
}
```

`isValid` is `1` (valid) or `0` (invalid). Returns `0` immediately if neither "because" nor " and " is present.

---

## 4. Gamification (`/api/gamification/...`)

Router prefix: `/api/gamification`. All endpoints require authentication.

---

### `GET /api/gamification/progression`

Get the user's current XP, level, and progression data.

**Auth:** Required.

**Response:** Delegated to `XPService.get_user_progression()`. Shape depends on service implementation but generally includes `current_xp`, `current_level`, `next_level_xp`, `progress_percentage`.

---

### `GET /api/gamification/xp/history`

Get the user's XP transaction history.

**Auth:** Required.

**Query parameters:**

| Param | Type | Default |
|-------|------|---------|
| `limit` | integer | 50 |

**Response:**
```json
{ "history": [...], "total": 42 }
```

---

### `GET /api/gamification/xp/daily`

Get XP earned today.

**Auth:** Required.

**Response:**
```json
{ "daily_xp": 120 }
```

---

### `GET /api/gamification/levels`

Get all player level definitions (no auth required since it's static data).

**Auth:** Required (dependency present, but data is static).

**Response:**
```json
{ "levels": [ { "level": 1, "name": "Beginner", "min_xp": 0, ... }, ... ] }
```

---

### `GET /api/gamification/achievements`

Get the user's achievements (unlocked, and optionally locked ones too).

**Auth:** Required.

**Query parameters:**

| Param | Type | Default |
|-------|------|---------|
| `include_locked` | string | `"false"` |

Pass `"true"` to include locked achievements.

**Response:** Delegated to `AchievementService.get_user_achievements()`. Includes `unlocked`, `total_unlocked`, `total_available`.

---

### `GET /api/gamification/achievements/unseen`

Get achievements that have been unlocked but not yet shown to the user.

**Auth:** Required.

**Response:**
```json
{ "achievements": [ { "achievement_id": "first_assessment", "name": "...", ... } ] }
```

---

### `POST /api/gamification/achievements/seen`

Mark one or more achievements as seen.

**Auth:** Required.

**Request body:**
```json
{ "achievement_ids": ["first_assessment", "phase1_complete"] }
```

**Response:**
```json
{ "success": true, "marked_seen": 2 }
```

**Error responses:** 400 if `achievement_ids` is empty.

---

### `GET /api/gamification/achievements/catalog`

Get the full catalog of all available achievements with rarity information (public/static data).

**Auth:** Required.

**Response:**
```json
{
  "achievements": [
    {
      "achievement_id": "first_assessment",
      "name": "First Steps",
      "description": "Complete your first assessment",
      "icon": "🏆",
      "rarity": "common",
      "xp_reward": 50
    }
  ],
  "total": 25,
  "rarity_tiers": { "common": {...}, "rare": {...}, "legendary": {...} }
}
```

---

### `GET /api/gamification/achievements/{achievement_id}/progress`

Get progress toward a specific achievement.

**Auth:** Required.

**Path parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `achievement_id` | string | Achievement identifier |

**Response:** Delegated to `AchievementService.get_achievement_progress()`.

---

### `GET /api/gamification/streak`

Get the user's current learning streak status.

**Auth:** Required.

**Response:** Delegated to `StreakService.get_streak_status()`. Typically includes `current_streak`, `longest_streak`, `last_activity_date`, `freeze_tokens`.

---

### `POST /api/gamification/streak/record`

Record user activity and update the streak (call after completing any activity).

**Auth:** Required.

**Request body:** None.

**Response:** Delegated to `StreakService.record_activity()`.

---

### `POST /api/gamification/streak/freeze`

Use a streak freeze token to maintain a streak despite missed activity.

**Auth:** Required.

**Request body:** None.

**Response:** Delegated to `StreakService.use_freeze_token()`.

---

### `POST /api/gamification/streak/freeze/purchase`

Purchase a freeze token using XP.

**Auth:** Required.

**Request body:** None.

**Response:** Delegated to `StreakService.purchase_freeze_token()`.

---

### `GET /api/gamification/streak/statistics`

Get detailed streak statistics.

**Auth:** Required.

**Response:** Delegated to `StreakService.get_streak_statistics()`.

---

### `GET /api/gamification/streak/leaderboard`

Get the streak leaderboard.

**Auth:** Required.

**Query parameters:**

| Param | Type | Default |
|-------|------|---------|
| `limit` | integer | 10 |

**Response:**
```json
{ "leaderboard": [ { "username": "alice", "current_streak": 15 }, ... ] }
```

---

### `GET /api/gamification/dashboard`

Get a combined gamification dashboard (progression + XP + achievements + streak).

**Auth:** Required.

**Response:**
```json
{
  "progression": { ... },
  "daily_xp": 120,
  "achievements": {
    "total_unlocked": 5,
    "total_available": 25,
    "completion_percentage": 20.0,
    "recent": [ /* last 5 unlocked */ ]
  },
  "unseen_achievements": [ ... ],
  "streak": { ... }
}
```

---

### `POST /api/gamification/internal/award-activity-xp`

Award XP when an activity is completed and check for achievement unlocks.

**Auth:** Required.

**Request body:**
```json
{
  "activity_type": "phase2_step",
  "activity_id": "step_1",
  "is_perfect": false,
  "is_first_try": true,
  "speed_bonus": false
}
```

| Field | Type | Required |
|-------|------|----------|
| `activity_type` | string | yes |
| `activity_id` | string | yes |
| `is_perfect` | boolean | no (default: false) |
| `is_first_try` | boolean | no (default: false) |
| `speed_bonus` | boolean | no (default: false) |

**Response:** XP result merged with newly unlocked achievements.

---

## 5. Progress (`/api/progress/...`)

Router prefix: `/api/progress`. All endpoints require authentication.

---

### `POST /api/progress/save`

Save a single student response and update the resume pointer for a phase.

**Auth:** Required.

**Request body:**
```json
{
  "phase": 3,
  "subphase": 1,
  "step": 2,
  "interaction": 1,
  "item_index": 3,
  "context": "main",
  "session_id": "optional-uuid",
  "response": {
    "item_id": "vocab_q1",
    "item_type": "multiple_choice",
    "prompt": "Choose the correct word...",
    "answer": "sponsorship",
    "is_correct": true,
    "score": 1.0,
    "ai_feedback": null
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `phase` | integer | yes | Phase number (1–6) |
| `subphase` | integer | no | Sub-phase number |
| `step` | integer | no | Step within phase |
| `interaction` | integer | no | Interaction within step |
| `item_index` | integer | no | Item index within interaction |
| `context` | string | no | `"main"`, `"remedial_a1"`, etc. |
| `session_id` | string | no | UUID; auto-generated if absent |
| `response` | object | no | Response data (see fields below) |

Response object fields:

| Field | Type | Required |
|-------|------|----------|
| `item_id` | string | no |
| `item_type` | string | no |
| `prompt` | string | no |
| `answer` | any | no |
| `is_correct` | boolean | no |
| `score` | float | no |
| `ai_feedback` | string | no |

**Response:**
```json
{ "success": true, "session_id": "generated-or-provided-uuid" }
```

Side effects: Inserts into `student_responses`; upserts resume pointer in `student_progress`.

---

### `GET /api/progress/resume`

Get the resume pointer and previous responses for the current interaction.

**Auth:** Required.

**Query parameters:**

| Param | Type | Required |
|-------|------|----------|
| `phase` | integer | yes |

**Response:**
```json
{
  "success": true,
  "data": {
    "phase": 3,
    "subphase": 1,
    "step": 2,
    "interaction": 1,
    "item_index": 3,
    "context": "main",
    "session_id": "uuid-string",
    "previous_responses": [
      {
        "item_index": 0,
        "item_type": "multiple_choice",
        "item_id": "vocab_q1",
        "prompt": "...",
        "response": "sponsorship",
        "is_correct": true,
        "score": 1.0
      }
    ]
  }
}
```

Returns `{ "success": true, "data": null }` if no progress exists yet.

---

### `POST /api/progress/complete`

Mark a phase as complete.

**Auth:** Required.

**Request body:**
```json
{ "phase": 3 }
```

**Response:**
```json
{ "success": true }
```

---

## 6. Chat (`/api/chat/...`)

Router prefix: `/api/chat`. All endpoints require authentication.

---

### `GET /api/chat/conversations`

List all conversations for the current user. Admins see all student conversations; students see only admin conversations.

**Auth:** Required.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "user_id": 5,
      "username": "bob",
      "first_name": "Bob",
      "last_name": "Jones",
      "last_message": "Hello, I need help with...",
      "last_message_at": "2025-04-27T14:30:00",
      "unread_count": 2
    }
  ]
}
```

---

### `GET /api/chat/messages/{other_user_id}`

Get all messages between the current user and another user. Also marks all incoming messages from `other_user_id` as read.

**Auth:** Required.

**Path parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `other_user_id` | integer | The other participant's user ID |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 101,
      "sender_id": 5,
      "receiver_id": 1,
      "message": "Hello!",
      "is_read": true,
      "created_at": "2025-04-27T14:30:00",
      "is_mine": false
    }
  ]
}
```

`is_mine` is `true` when `sender_id` equals the current user's ID.

---

### `POST /api/chat/send`

Send a message to another user.

**Auth:** Required.

**Request body:**
```json
{
  "receiver_id": 1,
  "message": "Hello, I have a question about Phase 3."
}
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `receiver_id` | integer | yes | Must be an existing user ID |
| `message` | string | yes | Max 2000 characters |

**Response:**
```json
{ "success": true }
```

**Error responses:** 400 if missing fields or message too long, 404 if receiver not found.

---

### `GET /api/chat/unread-count`

Get the total number of unread messages for the current user.

**Auth:** Required.

**Response:**
```json
{ "success": true, "count": 3 }
```

---

## 7. Phase 3 (`/api/phase3/...`)

Router prefix: `/api/phase3`. Sponsorship & Budgeting phase. All endpoints require authentication.

---

### `GET /api/phase3/step/{step_id}`

Get Phase 3 step data (stub — content returned is a placeholder).

**Auth:** Required.

**Path parameters:** `step_id` (integer, 1–4).

**Response:**
```json
{
  "success": true,
  "data": {
    "step_id": 1,
    "title": "Phase 3 - Step 1: Sponsorship & Budgeting",
    "description": "Financial planning and sponsorship activities"
  }
}
```

---

### `POST /api/phase3/step/{step_id}/submit`

Submit a Phase 3 step response (stub — records submission).

**Auth:** Required.

**Path parameters:** `step_id` (integer).

**Request body:** Any JSON object.

**Response:**
```json
{ "success": true, "message": "Response submitted successfully" }
```

---

### `POST /api/phase3/step/{step_id}/calculate-score`

Calculate step score and determine remedial routing for Phase 3 steps 1–4.

**Auth:** Required.

**Path parameters:** `step_id` (integer, 1–4).

**Request body:**
```json
{
  "interaction1_score": 6,
  "interaction2_score": 5,
  "interaction3_score": 3
}
```

Scoring ranges and max scores by step:

| Step | I1 max | I2 max | I3 max | Total max |
|------|--------|--------|--------|-----------|
| 1    | 8      | 8      | 5      | 21        |
| 2    | 10     | 8      | 5      | 23        |
| 3    | 8      | 5      | 5      | 18        |
| 4    | 5      | 5      | 0      | 10        |

Remedial level thresholds:

| Step | A1 if total < | A2 if total < | B1 if total < | B2 if total < | C1 otherwise |
|------|---------------|---------------|---------------|---------------|--------------|
| 1    | 12            | 18            | 22            | 26            | — |
| 2    | 8             | 13            | 18            | 21            | — |
| 3    | 6             | 11            | 14            | 17            | — |
| 4    | 2             | 4             | 6             | 8             | — |

**Response:**
```json
{
  "success": true,
  "data": {
    "interaction1": { "score": 6, "max_score": 8 },
    "interaction2": { "score": 5, "max_score": 8 },
    "interaction3": { "score": 3, "max_score": 5, "level": "B1" },
    "total": {
      "score": 14,
      "max_score": 21,
      "remedial_level": "A2",
      "should_proceed": false,
      "next_url": "/app/phase3/step/1/remedial/a2/taskA"
    }
  }
}
```

---

### `POST /api/phase3/remedial/log`

Log remedial task completion for Phase 3.

**Auth:** Required.

**Request body:**
```json
{
  "level": "A2",
  "task": "A",
  "score": 4,
  "max_score": 5,
  "time_taken": 120
}
```

**Response:**
```json
{ "success": true, "message": "Remedial task logged successfully" }
```

---

### `POST /api/phase3/interaction/log`

Log an interaction completion for Phase 3.

**Auth:** Required.

**Request body:**
```json
{
  "step": 2,
  "interaction": 1,
  "score": 7,
  "max_score": 8,
  "time_taken": 95,
  "completed": true
}
```

**Response:**
```json
{ "success": true, "message": "Interaction logged successfully" }
```

---

### `POST /api/phase3/interaction/{interaction_id}/submit`

Submit an interaction response for AI assessment.

**Auth:** Required.

**Path parameters:** `interaction_id` (integer).

**Request body:**
```json
{
  "response": "Our budget allocation strategy is...",
  "type": "writing"
}
```

**Response:**
```json
{
  "success": true,
  "assessment": {
    "score": 3,
    "level": "B1",
    "feedback": "Good use of financial vocabulary!"
  }
}
```

---

### `POST /api/phase3/remedial/evaluate`

Evaluate remedial task answers using AI (Groq). Each answer is scored 0 or 1 based on logical reasoning quality.

**Auth:** Required.

**Request body:**
```json
{
  "level": "A2",
  "task": "B",
  "answers": {
    "1": "The company needs money because without funds we cannot buy materials.",
    "2": "We need a sponsor because events are expensive."
  },
  "prompts": {
    "1": "The event needs funding because ___",
    "2": "We seek sponsors because ___"
  }
}
```

**Response:**
```json
{
  "success": true,
  "evaluations": [
    {
      "id": "1",
      "score": 1,
      "feedback": "Great reasoning!",
      "evaluation": "Logical connection between funding and materials."
    }
  ],
  "total_score": 2,
  "max_score": 2
}
```

---

### `POST /api/phase3/step4/evaluate-budget`

Evaluate Step 4 Interaction 1: Budget Creation exercise.

**Auth:** Required.

**Request body:**
```json
{
  "costItems": [ { "category": "venue", "amount": 5000 } ],
  "fundingSources": [ { "source": "university", "amount": 3000 } ],
  "justification": "The venue cost is essential because..."
}
```

**Response:**
```json
{
  "success": true,
  "score": 4,
  "level": "B2",
  "feedback": "Budget evaluation complete at B2 level."
}
```

Score 1–5, mapped to A1–C1.

---

### `POST /api/phase3/step4/evaluate-pitch`

Evaluate Step 4 Interaction 2: Sponsor Pitch exercise.

**Auth:** Required.

**Request body:**
```json
{
  "pitch": "Dear Sponsor, your brand visibility would benefit greatly...",
  "sponsor": "TechCorp"
}
```

**Response:**
```json
{
  "success": true,
  "score": 3,
  "level": "B1",
  "feedback": "Sponsor pitch evaluation complete at B1 level."
}
```

---

## 8. Phase 4 (`/api/phase4/...`)

Router prefix: `/api/phase4`. Marketing & Promotion phase. All endpoints require authentication.

Phase 4 has two sub-phases:
- **Phase 4.1** (Steps 1–3): Standard routing via `/api/phase4/step/{id}/...` and `/api/phase4/remedial/...`
- **Phase 4.2** (Steps 1–5): Routes via `/api/phase4/4_2/...`

---

### `GET /api/phase4/step/{step_id}`

Get Phase 4 step data from the phase4 loader.

**Auth:** Required.

**Path parameters:** `step_id` (integer, 1–5 for 4.1).

**Response:**
```json
{ "success": true, "data": { /* step content from phase4_loader */ } }
```

**Error responses:** 404 if step not found.

---

### `POST /api/phase4/step/{step_id}/submit`

Submit a Phase 4 step response (saves to DB).

**Auth:** Required.

**Path parameters:** `step_id` (integer).

**Request body:** Any JSON object (saved as-is).

**Response:**
```json
{ "success": true, "message": "Response submitted successfully" }
```

---

### `POST /api/phase4/remedial/log`

Log a Phase 4 remedial task completion.

**Auth:** Required.

**Request body:**
```json
{
  "level": "B1",
  "task": "A",
  "score": 6,
  "max_score": 8,
  "time_taken": 180
}
```

**Response:**
```json
{ "success": true, "message": "Remedial task logged successfully" }
```

---

### `POST /api/phase4/step/1/calculate-score`

Calculate Phase 4 Step 1 score and route to remedial level.

**Auth:** Required.

**Request body:**
```json
{
  "interaction1_score": 6,
  "interaction2_score": 5,
  "interaction3_score": 4
}
```

Validation: I1 and I2 must be 0–8, I3 must be 1–5.

Routing thresholds (total out of 21):

| Total < | Remedial level |
|---------|----------------|
| 7       | A1             |
| 12      | A2             |
| 16      | B1             |
| 19      | B2             |
| ≥19     | C1             |

**Response:**
```json
{
  "success": true,
  "data": {
    "interaction1": { "score": 6, "max_score": 8, "level": "B2" },
    "interaction2": { "score": 5, "max_score": 8, "level": "B1" },
    "interaction3": { "score": 4, "max_score": 5, "level": "B2" },
    "total": {
      "score": 15,
      "max_score": 21,
      "remedial_level": "Remedial B1",
      "should_proceed": false,
      "next_url": "/phase4/remedial/b1/taskA"
    }
  }
}
```

---

### `POST /api/phase4/step/3/calculate-score`

Calculate Phase 4 Step 3 score (all 3 interactions scored 1–5 on CEFR scale).

**Auth:** Required.

**Request body:**
```json
{
  "interaction1_score": 3,
  "interaction2_score": 2,
  "interaction3_score": 3
}
```

All scores must be 1–5. Max total: 15.

Routing thresholds:

| Total < | Remedial level |
|---------|----------------|
| 4       | A1             |
| 7       | A2             |
| 10      | B1             |
| 13      | B2             |
| ≥13     | C1             |

**Response:** Same structure as Step 1 calculate-score, with `max_score: 15` and individual levels per interaction.

---

### `POST /api/phase4/remedial/a1/final-score`

Calculate Remedial A1 final score for Phase 4. Pass threshold: 13/16.

**Auth:** Required.

**Request body:**
```json
{
  "task_a_score": 7,
  "task_b_score": 7
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "task_a_score": 7,
    "task_b_score": 7,
    "total_score": 14,
    "max_score": 16,
    "passed": true,
    "pass_threshold": 13,
    "next_url": "/phase4/step/2"
  }
}
```

---

### `POST /api/phase4/remedial/a2/final-score`

Calculate Remedial A2 final score. Pass threshold: 13/16.

**Auth:** Required.

**Request body:** `{ "task_a_score": int, "task_b_score": int }`

**Response:** Same structure as A1 final-score.

---

### `POST /api/phase4/remedial/b1/final-score`

Calculate Remedial B1 final score. Pass threshold: 22/27.

**Auth:** Required.

**Request body:**
```json
{
  "task_a_score": 5,
  "task_b_score": 7,
  "task_c_score": 5,
  "task_d_score": 7
}
```

**Response:** Same structure; `max_score: 27`, `pass_threshold: 22`.

---

### `POST /api/phase4/remedial/b2/final-score`

Calculate Remedial B2 final score. Pass threshold: 24/30.

**Auth:** Required.

**Request body:** `{ "task_a_score": int, "task_b_score": int, "task_c_score": int, "task_d_score": int }`

**Response:** Same structure; `max_score: 30`, `pass_threshold: 24`.

---

### `POST /api/phase4/4_2/step/{step}/remedial/{level}/task-b/evaluate`

Evaluate Phase 4.2 remedial Task B for a specific step and CEFR level using AI.

**Auth:** Required.

**Path parameters:**

| Param | Type | Values |
|-------|------|--------|
| `step` | integer | 1–5 |
| `level` | string | `b2`, `b1`, `c1` (case-insensitive) |

**Request body varies by step/level combination:**

- **Step 1, B2:** `{ "paragraph": "..." }` → score 0–10
- **Step 2, B2:** `{ "paragraph": "...", "guided_questions": [...] }` → score 0–10
- **Step 3, B1:** `{ "definitions": [{"term": "...", "definition": "..."}] }` → score 0–8 with per-item feedback
- **Step 3, B2:** `{ "paragraph": "...", "guided_questions": [...] }` → score 0–8
- **Step 3, C1:** `{ "text": "..." }` → score 0–8
- **Step 4, B1:** `{ "proposals": [{"answer": "..."}] }` → score 0–8 with per-item feedback
- **Step 4, C1:** `{ "text": "..." }` → score 0–8
- **Step 5, B2:** `{ "text": "..." }` → score 0–10
- **Step 5, C1:** `{ "text": "..." }` → score 0–12

**Response:**
```json
{ "success": true, "score": 7, "feedback": "Good explanation..." }
```

For B1 steps with per-item feedback:
```json
{
  "success": true,
  "score": 6,
  "feedback": [
    { "correct": true, "comment": "Clear definition with an example." },
    { "correct": false, "comment": "Write a fuller definition." }
  ]
}
```

**Error responses:** 400 if required body fields are missing; 404 if the step/level combination has no evaluator.

---

## 9. Phase 5 (`/api/phase5/...`)

Router prefix: `/api/phase5`. Execution & Problem-Solving phase.  
Phase 5 has two sub-phases (Subphase 1: steps 1–5, Subphase 2: steps 1–5).  
All endpoints require authentication.

---

### Power-Up Endpoints

#### `GET /api/phase5/powerups`
Get all available power-ups. **Response:** `{ "success": true, "powerups": [...] }`

#### `GET /api/phase5/powerups/inventory`
Get the user's power-up inventory and active effects. **Response:** `{ "success": true, "inventory": [...], "active_effects": [...] }`

#### `POST /api/phase5/powerups/purchase`
Purchase a power-up with XP. **Body:** `{ "powerup_type": "hint_reveal" }`. **Response:** result from `PowerUpService.purchase_powerup()`.

#### `POST /api/phase5/powerups/use`
Use a power-up. **Body:** `{ "powerup_type": "hint_reveal", "activity_id": "step1_vocab" }`. **Response:** result from `PowerUpService.use_powerup()`.

---

### Collectible Endpoints

#### `GET /api/phase5/collectibles`
Get all available collectibles. **Response:** `{ "success": true, "collectibles": [...] }`

#### `GET /api/phase5/collectibles/collection`
Get the user's collectible collection and stats. **Response:** `{ "success": true, ..., "stats": {...} }`

#### `POST /api/phase5/collectibles/drop`
Award a random collectible after activity completion. **Body:** `{ "source": "activity" }`. **Response:** `{ "success": true, "dropped": true/false, "collectible": {...} }`

---

### Avatar Endpoints

#### `GET /api/phase5/avatar/items`
Get available avatar items. **Query param:** `category` (optional filter). **Response:** `{ "success": true, "items": [...] }`

#### `GET /api/phase5/avatar`
Get the user's current avatar and owned items. **Response:** `{ "success": true, "avatar": {...}, "owned_items": [...] }`

#### `POST /api/phase5/avatar/purchase`
Purchase an avatar item. **Body:** `{ "item_id": "outfit_robe_blue" }`.

#### `POST /api/phase5/avatar/customize`
Update avatar customization. **Body:** `{ "outfit_id": "...", "accessory_id": "...", "background_id": "..." }`.

---

### Adaptive Learning Endpoints

#### `GET /api/phase5/adaptive/performance`
Get overall performance summary. **Response:** `{ "success": true, ...summary }`

#### `POST /api/phase5/adaptive/track`
Track performance on an activity. **Body:** `{ "activity_id": "...", "success": true, "score": 0.85, "activity_type": "remedial" }`.

#### `GET /api/phase5/adaptive/review`
Get activities due for spaced-repetition review. **Response:** `{ "success": true, "activities": [...], "count": 3 }`

---

### Phase 5 Step Interaction Endpoints

Steps 1–5 follow a consistent pattern. Each step has three interactions and uses `calculate-score` to determine remedial routing. Remedial activities include a log endpoint and per-step final-score endpoints.

#### Step 1 — Engage: Handling a Last-Minute Issue

**`POST /api/phase5/step1/interaction1/track`** — Track Wordshake game completion.

**Body:**
```json
{ "time_played": 130, "completed": true, "engagement_score": 85 }
```

**Response:** `{ "success": true, "data": { "score": 1, "time_played": 130, "completed": true, "engagement_score": 85, "message": "..." } }`

Score is 1 if `completed AND time_played >= 120`, else 0.

---

**`POST /api/phase5/step1/interaction2/evaluate`** — Evaluate solution suggestion for a last-minute festival cancellation.

**Body:**
```json
{ "response": "We should find an alternative singer urgently because the show must go on." }
```

**Response:**
```json
{
  "success": true,
  "data": {
    "score": 4,
    "level": "B2",
    "feedback": "...",
    "vocabulary_used": ["alternative", "urgent"],
    "strengths": ["Clear solution"],
    "improvements": []
  }
}
```

Score 1–5, level A1–C1. Uses Groq AI with heuristic fallback.

---

**`POST /api/phase5/step1/interaction3/track`** — Track Sushi Spell game. Score is 1 if `completed AND time_played >= 90`.

---

**`POST /api/phase5/step1/calculate-score`** — Calculate Step 1 total and route.

**Body:** `{ "interaction1_score": 1, "interaction2_score": 3, "interaction3_score": 1 }`

Validation: I1 must be 0–1, I2 must be 1–5, I3 must be 0–1.

Routing: Based entirely on `interaction2_score` (I2). I2 score maps directly to CEFR level (1→A1, 2→A2, 3→B1, 4→B2, 5→C1). `should_proceed` = true if I2 ≥ 3.

**Response:**
```json
{
  "success": true,
  "data": {
    "total_score": 5,
    "max_score": 7,
    "remedial_level": "B1",
    "should_proceed": true,
    "next_url": "/phase5/subphase/1/step/2",
    "interaction1": { "score": 1, "max_score": 1, "type": "completion" },
    "interaction2": { "score": 3, "max_score": 5, "level": "B1" },
    "interaction3": { "score": 1, "max_score": 1, "type": "completion" },
    "total": { ... }
  }
}
```

---

#### Step 2 — Explore: Crisis Communication

**`POST /api/phase5/step2/interaction1/track`** — Track Sushi Spell game. Score 1 if `completed AND time_played >= 90`.

**`POST /api/phase5/step2/interaction1/evaluate-announcement`** — Evaluate an announcement for a festival lighting failure crisis.

**Body:** `{ "announcement": "Attention guests: due to a technical issue with our main lights, we have activated our backup lighting system..." }`

**`POST /api/phase5/step2/interaction2/evaluate`** — Evaluate an explanation of why backup lights were chosen as the solution.

**Body:** `{ "explanation": "Using backup lights is the best solution because it ensures the event continues safely." }`

**`POST /api/phase5/step2/interaction3/track`** — Track Sushi Spell game completion.

**`POST /api/phase5/step2/interaction3/evaluate-revision`** — Evaluate a revised announcement sentence incorporating a new vocabulary term.

**Body:**
```json
{
  "original_sentence": "We have a problem with the lights.",
  "revised_sentence": "We are activating our contingency backup lighting system immediately.",
  "new_term": "contingency"
}
```

**`POST /api/phase5/step2/calculate-score`** — Calculate Step 2 total.

**Body:**
```json
{
  "interaction1_score": 1,
  "interaction1_writing_score": 3,
  "interaction2_score": 3,
  "interaction3_score": 1,
  "interaction3_revision_score": 4
}
```

Routing driven by `interaction1_writing_score` (announcement score, 2–5).

**`POST /api/phase5/step2/remedial/log`** — Log remedial task completion.

**Body:** `{ "level": "B1", "task": "A", "step": 2, "score": 6, "max_score": 8, "completed": true }`

---

#### Steps 3–5

Steps 3–5 follow the same pattern as Steps 1–2:

- `POST /api/phase5/step{N}/interaction1/track` — game tracking
- `POST /api/phase5/step{N}/interaction2/evaluate` — AI writing evaluation  
- `POST /api/phase5/step{N}/interaction3/track` — game tracking
- `POST /api/phase5/step{N}/calculate-score` — score and routing
- `POST /api/phase5/step{N}/remedial/log` — remedial logging

For the final score at each remedial level (used after completing remedial tasks):

**`POST /api/phase5/subphase/1/step/{step}/remedial/{level}/final-score`**

**Body:** Task scores as `task_1_score`, `task_2_score`, etc. (or nested under `task_scores`).

**Response:**
```json
{
  "success": true,
  "data": {
    "level": "B1",
    "total_score": 31,
    "max_score": 37,
    "pass_threshold": 30,
    "passed": true,
    "percentage": 83.8,
    "next_url": "/phase5/subphase/1/step/2",
    "task_scores": { "task_1_score": 15, "task_2_score": 16 }
  }
}
```

Pass thresholds vary by step and level (configured in `_PHASE5_SUBPHASE1_FINAL_CONFIG`).

Subphase 2 endpoints follow the same pattern with prefix `/api/phase5/subphase/2/step/{step}/...`.

---

## 10. Phase 6 (`/api/phase6/...`)

Router prefix: `/api/phase6`. Reflection & Evaluation phase.  
Phase 6 has two sub-phases:
- **Sub-phase 6.1:** Post-event report writing (steps 1–5)
- **Sub-phase 6.2:** Peer feedback discussion (steps 1–5)

All endpoints require authentication. The pattern is identical to Phase 5: 3 interactions per step, calculate-score, remedial log, remedial final-score.

---

### Shared Routing Logic (both sub-phases)

All calculate-score endpoints accept:
```json
{
  "interaction1_score": 1,
  "interaction2_score": 3,
  "interaction3_score": 1
}
```

- I1: 0–1 (game completion)
- I2: 2–5 (AI-evaluated writing, maps to A2/B1/B2/C1)
- I3: 0–1 (game completion)

I2 score determines routing: 2→A2, 3→B1, 4→B2, 5→C1. `should_proceed` = true if I2 ≥ 3.

Response shape (all calculate-score endpoints):
```json
{
  "success": true,
  "data": {
    "total_score": 5, "max_score": 7,
    "remedial_level": "B1", "should_proceed": true,
    "next_url": "/phase6/subphase/1/step/2",
    "interaction1": { "score": 1, "max_score": 1, "type": "completion" },
    "interaction2": { "score": 3, "max_score": 5, "level": "B1" },
    "interaction3": { "score": 1, "max_score": 1, "type": "completion" },
    "total": { ... }
  }
}
```

---

### Sub-phase 6.1 — Writing a Post-Event Report

Target vocabulary: success, challenge, feedback, improve, achievement, strength, weakness, recommend, summary, positive, negative, evidence, impact, lesson, report.

#### Step 1 Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/phase6/step1/interaction1/track` | Track Wordshake game (3 min target, min_time=120) |
| POST | `/api/phase6/step1/interaction2/evaluate` | Evaluate festival reflection (3–5 sentences, success + challenge) |
| POST | `/api/phase6/step1/interaction3/track` | Track Sushi Spell game (2 min target, min_time=90) |
| POST | `/api/phase6/step1/calculate-score` | Calculate and route |
| POST | `/api/phase6/step1/remedial/log` | Log remedial task |
| POST | `/api/phase6/step1/remedial/{level}/final-score` | Calculate remedial final score |

`interaction2/evaluate` body: `{ "response": "The festival was successful because we had many visitors. The main challenge was the sound system." }`

---

#### Steps 2–5

All follow the same 6-endpoint pattern as Step 1. Interaction 2 topic varies:

| Step | Interaction 2 topic |
|------|---------------------|
| 1 | Share a success and a challenge from the festival |
| 2 | Explain why you organised your report summary a certain way |
| 3 | Explain why a balanced report includes both strengths and weaknesses |
| 4 | Write a recommendation for future event improvement |
| 5 | Summarise the festival's overall impact |

Remedial final-score pass thresholds (Sub-phase 6.1, configured in `_PHASE6_SUBPHASE1_FINAL_CONFIG`):

| Step | Level | Max score | Pass threshold |
|------|-------|-----------|----------------|
| 1 | A2 | 18 | 15 |
| 1 | B1 | 14 | 12 |
| 1 | B2 | 28 | 23 |
| 1 | C1 | 26 | 21 |
| 2 | A2 | 18 | 15 |
| ... (see config in source) | | | |

---

### Sub-phase 6.2 — Peer Feedback Discussion

Target vocabulary: feedback, constructive, positive, suggestion, strength, weakness, improve, specific, actionable, polite, balanced, empathy, helpful, sandwich, mindset.

Endpoints mirror sub-phase 6.1 with the same pattern for steps 1–5.

Generic evaluate-interaction2 endpoint for 6.2:
- **Body:** `{ "response": "..." }`
- Scoring: A2 (2pts) through C1 (5pts) based on quality of peer feedback explanation

---

### Remedial Final Score Endpoints

**`POST /api/phase6/step{N}/remedial/{level}/final-score`** (Sub-phase 6.1)
**`POST /api/phase6/sp2/step{N}/remedial/{level}/final-score`** (Sub-phase 6.2)

**Body:** Task scores under `task_scores` object or as top-level `task_N_score` fields:
```json
{ "task_scores": { "task_1_score": 12, "task_2_score": 10 } }
```

**Response:**
```json
{
  "success": true,
  "data": {
    "level": "B1",
    "total_score": 22,
    "max_score": 24,
    "pass_threshold": 18,
    "passed": true,
    "percentage": 91.7,
    "next_url": "/phase6/subphase/1/step/2",
    "task_scores": { "task_1_score": 12, "task_2_score": 10 }
  }
}
```

---

## 11. Admin (`/api/admin/...` and `/admin/...`)

All admin endpoints require the `get_current_admin` dependency (authenticated + `is_admin = true`).

---

### `GET /api/admin/dashboard`

Get the admin dashboard summary.

**Auth:** Admin required.

**Response:**
```json
{
  "success": true,
  "data": {
    "admin": { "name": "Prof. Ben Ali", "username": "admin" },
    "stats": {
      "overall": {
        "total_users": 145,
        "total_assessments": 320,
        "total_phase2_sessions": 98,
        "avg_xp": 0
      },
      "assessment_stats": [],
      "recent_activity": [
        {
          "type": "registration", "username": "alice",
          "first_name": "Alice", "level": "N/A",
          "points": 0, "timestamp": "2025-04-27T10:00:00"
        }
      ]
    },
    "metrics": {
      "new_users_this_month": 23,
      "assessments_this_week": 15,
      "active_users_today": 8
    }
  }
}
```

---

### `GET /api/admin/users`

List all users with stats and pagination.

**Auth:** Admin required.

**Query parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `search` | string | `""` | Search by username, email, first/last name |
| `role` | string | `""` | Filter by role (`user`, `admin`) |

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1, "username": "alice", "email": "...",
        "first_name": "Alice", "last_name": "Smith",
        "role": "user", "is_active": true,
        "created_at": "...", "last_login": "...",
        "total_assessments": 2, "best_level": "B1",
        "total_xp": 450,
        "phase2_steps_attempted": 3,
        "phase2_steps_completed": 2
      }
    ],
    "pagination": {
      "page": 1, "per_page": 20, "total": 145,
      "pages": 8, "has_prev": false, "has_next": true,
      "prev_num": null, "next_num": 2, "iter_pages": [1,2,3,4,5]
    }
  }
}
```

---

### `GET /api/admin/analytics`

Get comprehensive platform analytics.

**Auth:** Admin required.

**Response structure:**
```json
{
  "success": true,
  "data": {
    "learning_progress": {
      "cefr_distribution": [ { "level": "A1", "count": 20 }, ... ],
      "phase_completion": {
        "total_users": 145, "phase1_completed": 120,
        "phase2_started": 98, "phase2_completed": 45,
        "phase3_completed": 30, "phase4_completed": 15,
        "phase5_completed": 8, "phase6_completed": 3
      },
      "avg_assessment_times": [ { "phase": "Phase 1", "avg_minutes": 12.5 }, ... ]
    },
    "engagement": {
      "active_users_7d": 45,
      "active_users_30d": 98,
      "daily_activity": [ { "date": "2025-04-27", "active_users": 15 }, ... ],
      "session_duration_dist": [ { "duration_range": "10-20 min", "count": 35 }, ... ]
    },
    "quality": {
      "ai_detection": {
        "avg_ai_usage": 3.2,
        "high_ai_count": 5,
        "total_assessments": 320
      },
      "score_distribution": [ { "score_range": "High (400-599)", "count": 48 }, ... ],
      "challenging_steps": [ { "step_id": "step_3", "attempts": 90, "completions": 45, "success_rate": 50.0 }, ... ]
    },
    "risk": {
      "at_risk_students": [ { "id": 5, "username": "bob", "last_activity": "...", ... } ],
      "stuck_students": [ { "id": 7, "username": "carol", "step_id": "step_2", "days_stuck": 5, ... } ]
    },
    "system": {
      "recent_errors": 2,
      "total_sessions_7d": 85
    }
  }
}
```

---

### `GET /api/admin/users/{user_id}/details`

Get detailed information about a specific user.

**Auth:** Admin required.

**Path parameters:** `user_id` (integer).

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1, "username": "alice", "email": "...",
      "first_name": "Alice", "last_name": "Smith",
      "created_at": "...", "last_login": "...",
      "is_active": true, "email_verified": false,
      "preferred_language": "en", "timezone": "UTC",
      "role": "user", "is_admin": false,
      "phase2_completed": true, "phase3_completed": false,
      "phase4_completed": false, "phase5_completed": false, "phase6_completed": false
    },
    "stats": {
      "total_assessments": 2,
      "total_xp": 450,
      "latest_level": "B1",
      "assessments": [
        { "overall_level": "B1", "xp_earned": 350, "completed_at": "...", "time_taken": 720, "duration_minutes": 12.0 }
      ]
    },
    "progress": {
      "phase2_steps": [ { "step_id": "step_1", "step_completed": true, "started_at": "..." } ],
      "phase2_completed": true,
      "phase3_completed": false,
      "phase_completion": [...]
    }
  }
}
```

**Error responses:** 404 if user not found.

---

### `GET /api/admin/students`

Get all users with a simplified progress summary (no pagination).

**Auth:** Admin required.

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "user_id": 1, "username": "alice",
        "first_name": "Alice", "last_name": "Smith", "email": "...",
        "is_admin": false, "created_at": "...", "last_login": "...",
        "phase1_level": "B1", "phase1_date": "...",
        "phase2_score": 14, "phase2_percentage": 70.0,
        "phase2_steps_completed": 3,
        "total_remedial_activities": 2,
        "phase3_completed": false, "phase4_completed": false,
        "phase5_completed": false, "phase6_completed": false
      }
    ],
    "total_count": 145
  }
}
```

---

### `GET /api/admin/student/{user_id}/progress`

Get detailed Phase 2 progress and AI evaluations for a specific student.

**Auth:** Admin required.

**Path parameters:** `user_id` (string/integer).

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { "user_id": "1", "username": "alice", ... },
    "phase1_history": [...],
    "phase2_progress": { "steps": [...], "steps_completed": [...], "remedial_activities": [...] },
    "responses_with_ai": [
      {
        "step_id": "step_1",
        "action_item_id": "item_1",
        "timestamp": "...",
        "response_text": "...",
        "score": 3,
        "ai_evaluation": { ... },
        "cefr_level": "B1",
        "assessment_focus": "writing"
      }
    ],
    "remedial_with_ai": [...],
    "summary": {
      "total_phase1_attempts": 1,
      "current_level": "B1",
      "phase2_score": 14,
      "phase2_max": 20,
      "phase2_percentage": 70.0,
      "steps_completed": 3,
      "total_responses": 12,
      "total_remedial_activities": 2,
      "remedial_completed": 1
    }
  }
}
```

---

### `GET /api/admin/ai-evaluations`

Get all AI evaluations across all non-admin students.

**Auth:** Admin required.

**Response:**
```json
{
  "success": true,
  "data": {
    "evaluations": [
      {
        "user_id": 1, "username": "alice",
        "context": "Phase 2 Step Response",
        "step_id": "step_1", "action_item_id": "item_1",
        "timestamp": "...", "response_text": "...",
        "score": 3, "ai_evaluation": {...}, "cefr_level": "B1"
      }
    ],
    "total_count": 120
  }
}
```

---

### `GET /api/admin/progress/{user_id}`

Get a detailed progress summary and response timeline for a user. Admin-only despite using `get_current_user` (manual admin check inside).

**Auth:** Authenticated user with `is_admin = true`.

**Path parameters:** `user_id` (string).

**Query parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `phase` | integer | no | Filter to a specific phase |

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": [
      {
        "phase": 3, "subphase": 1, "step": 2, "interaction": 1,
        "context": "main", "response_count": 5, "correct_count": 4,
        "total_score": 4.5, "started_at": "...", "completed_at": "..."
      }
    ],
    "timeline": [
      {
        "phase": 3, "subphase": 1, "step": 2, "interaction": 1,
        "context": "main", "item_index": 0,
        "item_type": "multiple_choice", "item_id": "vocab_q1",
        "prompt": "Choose the correct word...",
        "response": "sponsorship", "is_correct": true,
        "score": 1.0, "ai_feedback": null, "timestamp": "..."
      }
    ]
  }
}
```

---

### `GET /admin/users/{user_id}`

Get detailed progress for a specific user (legacy admin route, JSON response).

**Auth:** Admin required.

**Path parameters:** `user_id` (integer).

**Response:**
```json
{ "success": true, "user": { /* detailed progress from AssessmentHistory */ } }
```

---

### `POST /admin/users/{user_id}/toggle`

Toggle a user's active status.

**Auth:** Admin required.

**Path parameters:** `user_id` (integer).

**Request body:**
```json
{ "active": false }
```

**Response:**
```json
{ "success": true, "message": "User deactivated successfully" }
```

---

### `GET /admin/export/users`

Export users data as a CSV file download.

**Auth:** Admin required.

**Query parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Filter by name/email |
| `role` | string | Filter by role |

**Response:** `Content-Type: text/csv` with `Content-Disposition: attachment; filename=fardi_users_YYYYMMDD_HHMMSS.csv`

CSV columns: ID, Username, Email, First Name, Last Name, Role, Active, Created At, Last Login, Total Assessments, Best Level, Total XP, Phase2 Steps Completed, Phase2 Steps Attempted.

---

### `GET /admin/export-data`

Alias for `GET /admin/export/users`. Same behavior.

---

## 12. Health & Misc

---

### `GET /api/health`

Health check endpoint. No authentication required.

**Response:**
```json
{ "status": "ok" }
```

---

### `GET /start-game` or `POST /start-game`

Root-level alias for `/api/start-game`. Initializes the game session.

**Auth:** Required.

**Response:**
```json
{ "success": true, "redirect": "/game" }
```

---

### Static Files

The following static paths are served directly (no API prefix):

| Path | Description |
|------|-------------|
| `/static/audio/...` | TTS audio files |
| `/static/avatars/...` | NPC avatar images |
| `/static/...` | Other static assets |
| `/assets/...` | Built React JS/CSS bundles |
| `/images/...` | Frontend image assets |

---

## Appendix: Database Tables Referenced by the API

| Table | Used by |
|-------|---------|
| `users` | Auth, Admin |
| `game_sessions` | Phase 1 & 2 game flow |
| `assessment_results` | Phase 1 results, Admin analytics |
| `phase2_responses` | Phase 2 response storage |
| `phase2_progress` | Phase 2 step tracking |
| `student_responses` | Progress API, Phase 3–6 |
| `student_progress` | Progress resume/complete |
| `phase5_progress` | Phase 5 adaptive tracking |
| `phase5_remedial` | Phase 5 remedial logging |
| `phase6_progress` | Phase 6 scoring |
| `user_phase_completion` | Phase 3–6 completion flags |
| `chat_messages` | Chat system |

---

*Document generated 2026-04-27. Source files: `backend/routers/*.py`, `backend/auth_utils.py`, `backend/dependencies.py`, `backend/main.py`.*
