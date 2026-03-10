# Response Persistence & Resume Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Save every student response/state at response-level granularity so admins can review full timelines and students can resume exactly where they stopped.

**Architecture:** Two new DB tables (`student_progress` + `student_responses`) backed by a shared `/api/progress` router. A reusable React hook `useProgressSave` wraps debounced auto-save (3s) + `beforeunload` flush. Each exercise component calls `saveResponse()` on every answer. The Dashboard "Continue" button reads resume state and navigates with pre-fill data via React Router state.

**Tech Stack:** FastAPI (Python), SQLite, React 18, React Router v6, MUI v6

---

## Task 1: Add DB Tables

**Files:**
- Modify: `backend/models/auth.py` (in `init_database` method, after existing tables)

**Step 1: Add the two new tables**

In `init_database`, after the last existing `conn.execute(...)` block, add:

```python
# Student progress resume pointer (one row per user per phase, upserted)
conn.execute('''
    CREATE TABLE IF NOT EXISTS student_progress (
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
''')

# Every individual response ever recorded
conn.execute('''
    CREATE TABLE IF NOT EXISTS student_responses (
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
''')
conn.commit()
```

**Step 2: Verify tables exist**
```bash
cd backend && python -c "
from models.auth import DatabaseManager
db = DatabaseManager()
conn = db.get_connection()
tables = conn.execute(\"SELECT name FROM sqlite_master WHERE type='table'\").fetchall()
print([t[0] for t in tables])
"
```
Expected output includes `student_progress` and `student_responses`.

**Step 3: Commit**
```bash
git add backend/models/auth.py
git commit -m "feat: add student_progress and student_responses tables"
```

---

## Task 2: Backend Progress Router

**Files:**
- Create: `backend/routers/progress.py`
- Modify: `backend/main.py` (register router)

**Step 1: Create `backend/routers/progress.py`**

```python
"""
Progress persistence router - save/resume student responses and state.
"""
import json
import uuid
import logging
from fastapi import APIRouter, Request, Depends, HTTPException
from fastapi.responses import JSONResponse
from auth_utils import get_current_user, require_admin
from dependencies import get_db_manager

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/progress", tags=["progress"])


def _get_db():
    db = get_db_manager()
    return db.get_connection()


@router.post("/save")
async def save_progress(request: Request, user: dict = Depends(get_current_user)):
    """
    Save a single response and upsert the resume pointer.
    Body: {
      phase, subphase (optional), step, interaction, item_index,
      session_id (optional),
      response: { item_id, item_type, prompt, answer, is_correct, score, ai_feedback }
    }
    """
    try:
        user_id = user["user_id"]
        data = await request.json()

        phase = data.get("phase")
        subphase = data.get("subphase")
        step = data.get("step")
        interaction = data.get("interaction")
        item_index = data.get("item_index", 0)
        session_id = data.get("session_id") or str(uuid.uuid4())
        resp = data.get("response", {})

        if phase is None or step is None or interaction is None:
            raise HTTPException(status_code=400, detail="phase, step, interaction are required")

        conn = _get_db()

        # Insert response record
        conn.execute(
            """INSERT INTO student_responses
               (user_id, phase, subphase, step, interaction, item_index,
                item_type, item_id, prompt, response, is_correct, score,
                ai_feedback, session_id)
               VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
            (
                user_id, phase, subphase, step, interaction, item_index,
                resp.get("item_type", "unknown"),
                resp.get("item_id"),
                resp.get("prompt"),
                json.dumps(resp.get("answer")) if not isinstance(resp.get("answer"), str) else resp.get("answer"),
                1 if resp.get("is_correct") else (0 if resp.get("is_correct") is False else None),
                resp.get("score"),
                resp.get("ai_feedback"),
                session_id,
            )
        )

        # Upsert resume pointer
        conn.execute(
            """INSERT INTO student_progress
               (user_id, phase, subphase, step, interaction, item_index, session_id, last_updated)
               VALUES (?,?,?,?,?,?,?, CURRENT_TIMESTAMP)
               ON CONFLICT(user_id, phase) DO UPDATE SET
                 subphase=excluded.subphase,
                 step=excluded.step,
                 interaction=excluded.interaction,
                 item_index=excluded.item_index,
                 session_id=excluded.session_id,
                 last_updated=CURRENT_TIMESTAMP""",
            (user_id, phase, subphase, step, interaction, item_index, session_id)
        )

        conn.commit()
        conn.close()

        return {"success": True, "session_id": session_id}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error saving progress: {e}")
        return JSONResponse(status_code=500, content={"success": False, "error": str(e)})


@router.get("/resume")
async def get_resume_state(phase: int, user: dict = Depends(get_current_user)):
    """
    Get the resume pointer for a phase.
    Returns: { phase, subphase, step, interaction, item_index, session_id, previous_responses }
    previous_responses: list of responses for current step/interaction (for pre-fill)
    """
    try:
        user_id = user["user_id"]
        conn = _get_db()

        row = conn.execute(
            """SELECT phase, subphase, step, interaction, item_index, session_id
               FROM student_progress WHERE user_id=? AND phase=?""",
            (user_id, phase)
        ).fetchone()

        if not row:
            conn.close()
            return {"success": True, "data": None}

        # Fetch responses for the current interaction to enable pre-fill
        responses = conn.execute(
            """SELECT item_index, item_type, item_id, prompt, response, is_correct, score
               FROM student_responses
               WHERE user_id=? AND phase=? AND step=? AND interaction=?
               ORDER BY item_index ASC""",
            (user_id, phase, row["step"], row["interaction"])
        ).fetchall()

        conn.close()

        return {
            "success": True,
            "data": {
                "phase": row["phase"],
                "subphase": row["subphase"],
                "step": row["step"],
                "interaction": row["interaction"],
                "item_index": row["item_index"],
                "session_id": row["session_id"],
                "previous_responses": [
                    {
                        "item_index": r["item_index"],
                        "item_type": r["item_type"],
                        "item_id": r["item_id"],
                        "prompt": r["prompt"],
                        "response": r["response"],
                        "is_correct": bool(r["is_correct"]) if r["is_correct"] is not None else None,
                        "score": r["score"],
                    }
                    for r in responses
                ],
            }
        }

    except Exception as e:
        logger.error(f"Error getting resume state: {e}")
        return JSONResponse(status_code=500, content={"success": False, "error": str(e)})


@router.post("/complete")
async def mark_phase_complete(request: Request, user: dict = Depends(get_current_user)):
    """Mark a phase as complete in student_progress."""
    try:
        user_id = user["user_id"]
        data = await request.json()
        phase = data.get("phase")

        if not phase:
            raise HTTPException(status_code=400, detail="phase is required")

        conn = _get_db()
        conn.execute(
            """UPDATE student_progress SET is_complete=1, last_updated=CURRENT_TIMESTAMP
               WHERE user_id=? AND phase=?""",
            (user_id, phase)
        )
        conn.commit()
        conn.close()

        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error marking phase complete: {e}")
        return JSONResponse(status_code=500, content={"success": False, "error": str(e)})
```

**Step 2: Register the router in `backend/main.py`**

After the existing router imports, add:
```python
from routers.progress import router as progress_router
```

After the existing `app.include_router(...)` calls, add:
```python
app.include_router(progress_router)
```

**Step 3: Verify endpoints register**
```bash
cd backend && python -c "
from main import app
routes = [r.path for r in app.routes]
progress_routes = [r for r in routes if 'progress' in r]
print(progress_routes)
"
```
Expected: `['/api/progress/save', '/api/progress/resume', '/api/progress/complete']`

**Step 4: Commit**
```bash
git add backend/routers/progress.py backend/main.py
git commit -m "feat: add progress persistence router (save/resume/complete)"
```

---

## Task 3: Admin Progress Endpoints

**Files:**
- Modify: `backend/routers/admin.py` (add two endpoints at the bottom)

**Step 1: Add admin progress endpoints to `backend/routers/admin.py`**

At the bottom of the file, add:

```python
# ─── Progress Review Endpoints ────────────────────────────────────────────────

@router.get("/admin/progress/{user_id}")
async def get_user_progress_summary(
    user_id: int,
    phase: int = None,
    user: dict = Depends(get_current_user)
):
    """
    Admin: get per-step summary + full timeline for a student.
    Returns: { summary: [...], timeline: [...] }
    """
    if not user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin required")

    try:
        conn = _get_db()  # use the same helper or inline sqlite3.connect('fardi.db')

        phase_filter = "AND sr.phase=?" if phase else ""
        params_summary = [user_id, phase] if phase else [user_id]
        params_timeline = [user_id, phase] if phase else [user_id]

        summary_rows = conn.execute(
            f"""SELECT sr.phase, sr.subphase, sr.step, sr.interaction,
                   COUNT(*) as response_count,
                   SUM(CASE WHEN sr.is_correct=1 THEN 1 ELSE 0 END) as correct_count,
                   SUM(sr.score) as total_score,
                   MIN(sr.timestamp) as started_at,
                   MAX(sr.timestamp) as completed_at
               FROM student_responses sr
               WHERE sr.user_id=? {phase_filter}
               GROUP BY sr.phase, sr.subphase, sr.step, sr.interaction
               ORDER BY sr.phase, sr.subphase, sr.step, sr.interaction""",
            params_summary
        ).fetchall()

        timeline_rows = conn.execute(
            f"""SELECT sr.phase, sr.subphase, sr.step, sr.interaction,
                   sr.item_index, sr.item_type, sr.item_id,
                   sr.prompt, sr.response, sr.is_correct, sr.score,
                   sr.ai_feedback, sr.timestamp
               FROM student_responses sr
               WHERE sr.user_id=? {phase_filter}
               ORDER BY sr.timestamp ASC""",
            params_timeline
        ).fetchall()

        conn.close()

        return {
            "success": True,
            "data": {
                "summary": [
                    {
                        "phase": r["phase"],
                        "subphase": r["subphase"],
                        "step": r["step"],
                        "interaction": r["interaction"],
                        "response_count": r["response_count"],
                        "correct_count": r["correct_count"],
                        "total_score": r["total_score"],
                        "started_at": r["started_at"],
                        "completed_at": r["completed_at"],
                    }
                    for r in summary_rows
                ],
                "timeline": [
                    {
                        "phase": r["phase"],
                        "subphase": r["subphase"],
                        "step": r["step"],
                        "interaction": r["interaction"],
                        "item_index": r["item_index"],
                        "item_type": r["item_type"],
                        "item_id": r["item_id"],
                        "prompt": r["prompt"],
                        "response": r["response"],
                        "is_correct": bool(r["is_correct"]) if r["is_correct"] is not None else None,
                        "score": r["score"],
                        "ai_feedback": r["ai_feedback"],
                        "timestamp": r["timestamp"],
                    }
                    for r in timeline_rows
                ],
            }
        }

    except Exception as e:
        logger.error(f"Admin progress error for user {user_id}: {e}")
        return JSONResponse(status_code=500, content={"success": False, "error": str(e)})
```

**Step 2: Commit**
```bash
git add backend/routers/admin.py
git commit -m "feat: add admin progress review endpoints"
```

---

## Task 4: Frontend `useProgressSave` Hook

**Files:**
- Create: `frontend/src/hooks/useProgressSave.js`

**Step 1: Create the hook**

```javascript
import { useRef, useCallback, useEffect } from 'react'

/**
 * useProgressSave - debounced auto-save hook for student responses.
 *
 * Usage:
 *   const { saveResponse, markComplete } = useProgressSave({ phase: 3, step: 1, interaction: 1 })
 *   saveResponse({ item_index: 0, item_id: 'q1', item_type: 'gap_fill', prompt: '...', answer: 'went', is_correct: true, score: 1 })
 */
export function useProgressSave({ phase, subphase = null, step, interaction }) {
  const sessionId = useRef(
    sessionStorage.getItem(`progress_session_${phase}`) || (() => {
      const id = crypto.randomUUID()
      sessionStorage.setItem(`progress_session_${phase}`, id)
      return id
    })()
  )

  const pendingRef = useRef(null)
  const timerRef = useRef(null)
  const DEBOUNCE_MS = 3000

  const flush = useCallback(async (payload) => {
    try {
      await fetch('/api/progress/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })
    } catch (e) {
      console.warn('[useProgressSave] save failed:', e)
    }
  }, [])

  const saveResponse = useCallback((responseData) => {
    const payload = {
      phase,
      subphase,
      step,
      interaction,
      item_index: responseData.item_index ?? 0,
      session_id: sessionId.current,
      response: {
        item_id: responseData.item_id,
        item_type: responseData.item_type,
        prompt: responseData.prompt,
        answer: responseData.answer,
        is_correct: responseData.is_correct,
        score: responseData.score ?? null,
        ai_feedback: responseData.ai_feedback ?? null,
      },
    }

    pendingRef.current = payload

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      if (pendingRef.current) {
        flush(pendingRef.current)
        pendingRef.current = null
      }
    }, DEBOUNCE_MS)
  }, [phase, subphase, step, interaction, flush])

  const markComplete = useCallback(async () => {
    // Flush any pending save first
    if (timerRef.current) clearTimeout(timerRef.current)
    if (pendingRef.current) {
      await flush(pendingRef.current)
      pendingRef.current = null
    }
    try {
      await fetch('/api/progress/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phase }),
      })
    } catch (e) {
      console.warn('[useProgressSave] markComplete failed:', e)
    }
  }, [phase, flush])

  // Flush on page unload via sendBeacon
  useEffect(() => {
    const handleUnload = () => {
      if (pendingRef.current) {
        const blob = new Blob([JSON.stringify(pendingRef.current)], { type: 'application/json' })
        navigator.sendBeacon('/api/progress/save', blob)
      }
    }
    window.addEventListener('beforeunload', handleUnload)
    return () => {
      window.removeEventListener('beforeunload', handleUnload)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return { saveResponse, markComplete }
}
```

**Step 2: Commit**
```bash
git add frontend/src/hooks/useProgressSave.js
git commit -m "feat: add useProgressSave hook with debounced auto-save and beacon flush"
```

---

## Task 5: Wire `useProgressSave` into Phase 3 Step 1 Interactions

**Files:**
- Modify: `frontend/src/pages/Phase3/Step1/Interaction1.jsx`
- Modify: `frontend/src/pages/Phase3/Step1/Interaction2.jsx`
- Modify: `frontend/src/pages/Phase3/Step1/Interaction3.jsx`

This task demonstrates the pattern. All other phase interactions follow the same approach.

### Interaction1.jsx (Vocabulary Matching)

**Step 1: Add import and hook at component top**

```jsx
import { useProgressSave } from '../../../../hooks/useProgressSave'

// Inside component:
const { saveResponse } = useProgressSave({ phase: 3, step: 1, interaction: 1 })
```

**Step 2: Call `saveResponse` when user makes a match**

Find where the match result is recorded (typically an `onMatch` or `onComplete` callback). Add:

```jsx
saveResponse({
  item_index: matchIndex,          // 0-based index of this match
  item_id: `match_${termId}`,
  item_type: 'matching',
  prompt: termText,
  answer: selectedDefinition,
  is_correct: isCorrect,
  score: isCorrect ? 1 : 0,
})
```

**Step 3: Also call on game completion (captures final score)**

```jsx
saveResponse({
  item_index: 99,                  // sentinel for "game complete"
  item_id: 'game_complete',
  item_type: 'matching_summary',
  prompt: 'Vocabulary matching game',
  answer: JSON.stringify({ score: finalScore, total: 8 }),
  is_correct: null,
  score: finalScore,
})
```

### Interaction2.jsx (Sushi Spell Game)

Same pattern — on each word spelled correctly:
```jsx
saveResponse({
  item_index: wordIndex,
  item_id: `word_${word}`,
  item_type: 'spelling',
  prompt: `Spell: ${word}`,
  answer: userInput,
  is_correct: true,
  score: 1,
})
```

### Interaction3.jsx (Sentence Production)

On sentence submission:
```jsx
saveResponse({
  item_index: 0,
  item_id: 'sentence_production',
  item_type: 'text',
  prompt: 'Write a sentence using the word "budget"',
  answer: sentenceText,
  is_correct: cefrScore >= 3,
  score: cefrScore,
  ai_feedback: aiFeedback || null,
})
```

**Step 4: Commit**
```bash
git add frontend/src/pages/Phase3/Step1/Interaction1.jsx
git add frontend/src/pages/Phase3/Step1/Interaction2.jsx
git add frontend/src/pages/Phase3/Step1/Interaction3.jsx
git commit -m "feat: wire useProgressSave into Phase 3 Step 1 interactions"
```

---

## Task 6: Wire `useProgressSave` into All Remaining Phase Interactions

**Files to modify** (follow same pattern as Task 5):

```
Phase 3:
  frontend/src/pages/Phase3/Step2/ - Interaction1, 2, 3
  frontend/src/pages/Phase3/Step3/ - Interaction1, 2, 3
  frontend/src/pages/Phase3/Step4/ - Interaction1, 2
  (all RemedialA1, A2, B1, B2, C1 TaskA-D files)

Phase 4:
  frontend/src/pages/Phase4Step1/ through Phase4Step5/
  (all Remedial task files)

Phase 5:
  frontend/src/pages/Phase5/SP1/Step1-5/
  frontend/src/pages/Phase5/SP2/Step1-5/

Phase 6:
  frontend/src/pages/Phase6/SP1/Step1-5/
  frontend/src/pages/Phase6/SP2/Step1-5/
```

**For each file**, the pattern is always:
1. `import { useProgressSave } from '../../../hooks/useProgressSave'` (adjust relative path)
2. `const { saveResponse } = useProgressSave({ phase: N, subphase: null, step: S, interaction: I })`
3. Call `saveResponse({...})` on each user action that produces a scorable response

**item_type values by interaction type:**
- Vocabulary matching → `'matching'`
- Spelling games → `'spelling'`
- Gap fill / drag-drop fill → `'gap_fill'`
- Drag-drop matching → `'drag_drop'`
- Sentence production / free text → `'text'`
- Flashcard → `'flashcard'`
- Multiple choice → `'multiple_choice'`
- Dialogue/chat response → `'dialogue'`

**Step 1: Wire Phase 3 remaining steps**
```bash
git add frontend/src/pages/Phase3/
git commit -m "feat: wire useProgressSave into all Phase 3 interactions"
```

**Step 2: Wire Phase 4**
```bash
git add frontend/src/pages/Phase4*/
git commit -m "feat: wire useProgressSave into all Phase 4 interactions"
```

**Step 3: Wire Phase 5**
```bash
git add frontend/src/pages/Phase5*/
git commit -m "feat: wire useProgressSave into all Phase 5 interactions"
```

**Step 4: Wire Phase 6**
```bash
git add frontend/src/pages/Phase6*/
git commit -m "feat: wire useProgressSave into all Phase 6 interactions"
```

---

## Task 7: Resume on Dashboard "Continue" Button

**Files:**
- Modify: `frontend/src/pages/Dashboard.jsx`

**Step 1: Add resume fetch utility**

At top of Dashboard.jsx, add a helper:

```jsx
const fetchResumeState = async (phase) => {
  try {
    const res = await fetch(`/api/progress/resume?phase=${phase}`, { credentials: 'include' })
    const data = await res.json()
    return data.success ? data.data : null
  } catch {
    return null
  }
}
```

**Step 2: Find the "Continue" button for each phase**

Look for buttons that navigate to a phase. Currently they likely do `navigate('/phase3/step/1')`. Replace with:

```jsx
const handleContinue = async (phaseNumber) => {
  const resume = await fetchResumeState(phaseNumber)
  if (!resume) {
    // No saved progress - start from beginning
    navigate(getPhaseStartUrl(phaseNumber))
    return
  }

  // Navigate to exact interaction with resume state
  const url = getPhaseInteractionUrl(resume)
  navigate(url, {
    state: {
      resumeFrom: resume.item_index,
      previousResponses: resume.previous_responses,
      sessionId: resume.session_id,
    }
  })
}
```

**Step 3: Add `getPhaseStartUrl` and `getPhaseInteractionUrl` helpers**

```jsx
const getPhaseStartUrl = (phase) => {
  const starts = {
    1: '/phase1',
    2: '/phase2/step/1',
    3: '/phase3/step/1/interaction/1',
    4: '/phase4/step/1/interaction/1',
    5: '/phase5/sp1/step/1/interaction/1',
    6: '/phase6/sp1/step/1/interaction/1',
  }
  return starts[phase] || '/'
}

const getPhaseInteractionUrl = ({ phase, subphase, step, interaction }) => {
  if (phase <= 2) return getPhaseStartUrl(phase)  // Phase 1-2 handle their own routing
  const sp = subphase ? `/sp${subphase}` : ''
  return `/phase${phase}${sp}/step/${step}/interaction/${interaction}`
}
```

**Step 4: Commit**
```bash
git add frontend/src/pages/Dashboard.jsx
git commit -m "feat: Dashboard Continue button resumes at exact position"
```

---

## Task 8: Resume Pre-fill in Exercise Components

**Files:**
- Modify: `frontend/src/pages/Phase3/Step1/Interaction1.jsx` (as example)

**Step 1: Read resume state from router**

At the top of each exercise component:

```jsx
import { useLocation } from 'react-router-dom'

// Inside component:
const location = useLocation()
const resumeState = location.state || {}
const resumeFrom = resumeState.resumeFrom ?? 0
const previousResponses = resumeState.previousResponses ?? []
```

**Step 2: Skip to the correct item on mount**

```jsx
useEffect(() => {
  if (resumeFrom > 0) {
    setCurrentIndex(resumeFrom)
    // Pre-fill answers from previousResponses
    const prefilled = {}
    previousResponses.forEach(r => {
      prefilled[r.item_id] = r.response
    })
    setPreviousAnswers(prefilled)
  }
}, [])
```

**Step 3: Visual indicator for resumed state**

```jsx
{resumeFrom > 0 && (
  <Alert severity="info" sx={{ mb: 2 }}>
    Resuming from where you left off (question {resumeFrom + 1})
  </Alert>
)}
```

**Step 4: Commit**
```bash
git add frontend/src/pages/Phase3/Step1/Interaction1.jsx
git commit -m "feat: Phase 3 Step 1 Interaction 1 supports resume pre-fill"
```

Apply the same pattern to all other interaction files (same as Task 6 scope).

---

## Task 9: Admin Progress Tab in AdminUserViewer

**Files:**
- Modify: `frontend/src/pages/AdminUserViewer.jsx`

**Step 1: Add state and data fetch**

```jsx
const [progressData, setProgressData] = useState(null)
const [selectedSummaryRow, setSelectedSummaryRow] = useState(null)

const loadProgressData = async () => {
  const res = await fetch(`/api/admin/progress/${userId}`, { credentials: 'include' })
  const data = await res.json()
  if (data.success) setProgressData(data.data)
}

useEffect(() => { if (userId) loadProgressData() }, [userId])
```

**Step 2: Add "Progress" tab to existing tab list**

Find the existing tabs (likely `<Tabs>` component) and add:
```jsx
<Tab label="Progress" value="progress" icon={<TimelineIcon />} />
```

Import: `import TimelineIcon from '@mui/icons-material/Timeline'`

**Step 3: Add tab panel content**

```jsx
{activeTab === 'progress' && (
  <Box>
    <Typography variant="h6" sx={{ mb: 2 }}>Response History</Typography>

    {/* Summary Table */}
    <TableContainer component={Paper} sx={{ mb: 3, ...cardSx }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Phase</TableCell>
            <TableCell>Step</TableCell>
            <TableCell>Interaction</TableCell>
            <TableCell>Responses</TableCell>
            <TableCell>Correct</TableCell>
            <TableCell>Score</TableCell>
            <TableCell>Started</TableCell>
            <TableCell>Completed</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {progressData?.summary?.map((row, i) => (
            <TableRow
              key={i}
              hover
              onClick={() => setSelectedSummaryRow(
                selectedSummaryRow?.step === row.step &&
                selectedSummaryRow?.interaction === row.interaction ? null : row
              )}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell>Phase {row.phase}{row.subphase ? ` SP${row.subphase}` : ''}</TableCell>
              <TableCell>Step {row.step}</TableCell>
              <TableCell>Int {row.interaction}</TableCell>
              <TableCell>{row.response_count}</TableCell>
              <TableCell>{row.correct_count ?? '—'}</TableCell>
              <TableCell>{row.total_score?.toFixed(1) ?? '—'}</TableCell>
              <TableCell>{row.started_at ? new Date(row.started_at).toLocaleTimeString() : '—'}</TableCell>
              <TableCell>{row.completed_at ? new Date(row.completed_at).toLocaleTimeString() : 'In progress'}</TableCell>
              <TableCell><ExpandMoreIcon /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    {/* Timeline drill-down */}
    {selectedSummaryRow && (
      <Box sx={{ ...cardSx, p: 2, borderRadius: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Phase {selectedSummaryRow.phase} › Step {selectedSummaryRow.step} › Interaction {selectedSummaryRow.interaction} — Full Timeline
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Prompt</TableCell>
                <TableCell>Answer</TableCell>
                <TableCell>Result</TableCell>
                <TableCell>Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {progressData?.timeline
                ?.filter(r =>
                  r.step === selectedSummaryRow.step &&
                  r.interaction === selectedSummaryRow.interaction
                )
                .map((r, i) => (
                  <TableRow key={i}>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      {new Date(r.timestamp).toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      <Chip label={r.item_type} size="small" />
                    </TableCell>
                    <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {r.prompt}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {r.response}
                    </TableCell>
                    <TableCell>
                      {r.is_correct === true && <CheckCircleIcon color="success" fontSize="small" />}
                      {r.is_correct === false && <CancelIcon color="error" fontSize="small" />}
                      {r.is_correct === null && '—'}
                    </TableCell>
                    <TableCell>{r.score ?? '—'}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    )}
  </Box>
)}
```

Import `CancelIcon from '@mui/icons-material/Cancel'` and `ExpandMoreIcon from '@mui/icons-material/ExpandMore'`.

**Step 4: Commit**
```bash
git add frontend/src/pages/AdminUserViewer.jsx
git commit -m "feat: add Progress tab with timeline drill-down to AdminUserViewer"
```

---

## Task 10: Smoke Test End-to-End

**Step 1: Start backend**
```bash
cd backend && python main.py
```

**Step 2: Start frontend**
```bash
cd frontend && npm run dev
```

**Step 3: Manual test checklist**
- [ ] Login as a student
- [ ] Navigate to Phase 3 Step 1 Interaction 1
- [ ] Answer 2-3 vocabulary matches
- [ ] Close the tab (simulate page unload)
- [ ] Re-open the app and login again
- [ ] Click "Continue" on Dashboard for Phase 3
- [ ] Verify it navigates to Interaction 1 at item_index 2 with previous answers shown
- [ ] Login as admin
- [ ] Navigate to AdminUserViewer for that student
- [ ] Click "Progress" tab
- [ ] Verify summary shows Phase 3 › Step 1 › Interaction 1 with correct response count
- [ ] Click a row and verify timeline shows individual answers with timestamps

**Step 4: Final commit**
```bash
git add .
git commit -m "feat: complete response persistence and resume system"
```

---

## Implementation Notes

### Pattern for every interaction file

```jsx
// 1. Import
import { useProgressSave } from '../../../hooks/useProgressSave'  // adjust path

// 2. Inside component
const { saveResponse } = useProgressSave({ phase: N, step: S, interaction: I })

// 3. On every answer
saveResponse({
  item_index: currentIndex,
  item_id: uniqueId,
  item_type: 'gap_fill',  // see item_type table above
  prompt: questionText,
  answer: userAnswer,
  is_correct: checkAnswer(userAnswer),
  score: calculateScore(userAnswer),
})
```

### Phase/Subphase values
| Phase | Subphase | Steps |
|-------|----------|-------|
| 1 | null | N/A (dialogue game) |
| 2 | null | 1-9 |
| 3 | null | 1-4 |
| 4 | null | 1-5 |
| 5 | 1 | 1-5 |
| 5 | 2 | 1-5 |
| 6 | 1 | 1-5 |
| 6 | 2 | 1-5 |

### URL pattern for resume navigation
```
/phase{N}/step/{S}/interaction/{I}
/phase{N}/sp{SP}/step/{S}/interaction/{I}  (for phases 5-6 with subphases)
```
Verify these match the actual routes in `frontend/src/App.jsx` before wiring the Dashboard resume logic.
