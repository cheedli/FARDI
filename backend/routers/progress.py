"""
Progress API Routes - Save/resume student responses and phase completion.
"""
import json
import uuid
import sqlite3
import logging
from typing import Optional, Any
from fastapi import APIRouter, Depends, Request, Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from auth_utils import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/progress", tags=["progress"])


def get_db_connection():
    """Get database connection"""
    conn = sqlite3.connect('fardi.db')
    conn.row_factory = sqlite3.Row
    return conn


class ResponsePayload(BaseModel):
    item_id: Optional[str] = None
    item_type: Optional[str] = None
    prompt: Optional[str] = None
    answer: Optional[Any] = None
    is_correct: Optional[bool] = None
    score: Optional[float] = None
    ai_feedback: Optional[str] = None


class SaveProgressRequest(BaseModel):
    phase: int
    subphase: Optional[int] = None
    step: Optional[int] = None
    interaction: Optional[int] = None
    item_index: Optional[int] = None
    context: Optional[str] = None
    session_id: Optional[str] = None
    response: Optional[ResponsePayload] = None


class CompleteRequest(BaseModel):
    phase: int


@router.post('/save')
async def save_progress(body: SaveProgressRequest, user: dict = Depends(get_current_user)):
    """Save a single student response and upsert the resume pointer."""
    try:
        user_id = user["user_id"]
        session_id = body.session_id or str(uuid.uuid4())

        conn = get_db_connection()
        try:
            # Insert into student_responses
            if body.response is not None:
                r = body.response
                answer_val = r.answer
                if answer_val is not None and not isinstance(answer_val, str):
                    answer_val = json.dumps(answer_val)
                is_correct_int = None
                if r.is_correct is not None:
                    is_correct_int = 1 if r.is_correct else 0

                conn.execute(
                    """
                    INSERT INTO student_responses
                        (user_id, phase, subphase, step, interaction, item_index,
                         context, session_id, item_id, item_type, prompt, response,
                         is_correct, score, ai_feedback)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        user_id, body.phase, body.subphase, body.step,
                        body.interaction, body.item_index, body.context,
                        session_id, r.item_id, r.item_type, r.prompt,
                        answer_val, is_correct_int, r.score, r.ai_feedback,
                    )
                )

            # Upsert resume pointer into student_progress
            conn.execute(
                """
                INSERT INTO student_progress
                    (user_id, phase, subphase, step, interaction, item_index,
                     context, session_id, is_complete)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
                ON CONFLICT(user_id, phase) DO UPDATE SET
                    subphase    = excluded.subphase,
                    step        = excluded.step,
                    interaction = excluded.interaction,
                    item_index  = excluded.item_index,
                    context     = excluded.context,
                    session_id  = excluded.session_id
                """,
                (
                    user_id, body.phase, body.subphase, body.step,
                    body.interaction, body.item_index, body.context, session_id,
                )
            )

            conn.commit()
        finally:
            conn.close()

        return {"success": True, "session_id": session_id}

    except Exception as e:
        logger.error(f"Error saving progress: {e}")
        return JSONResponse(status_code=500, content={"success": False, "error": str(e)})


@router.get('/resume')
async def resume_progress(phase: int = Query(...), user: dict = Depends(get_current_user)):
    """Return the resume pointer + previous responses for the current interaction."""
    try:
        user_id = user["user_id"]

        conn = get_db_connection()
        try:
            row = conn.execute(
                """
                SELECT phase, subphase, step, interaction, item_index, context, session_id
                FROM student_progress
                WHERE user_id = ? AND phase = ?
                """,
                (user_id, phase)
            ).fetchone()

            if row is None:
                return {"success": True, "data": None}

            data = dict(row)

            # Fetch previous responses for the current interaction
            previous_responses = []
            if data.get("session_id") and data.get("interaction") is not None:
                rows = conn.execute(
                    """
                    SELECT item_index, item_type, item_id, prompt, answer, is_correct, score
                    FROM student_responses
                    WHERE user_id = ? AND phase = ? AND session_id = ? AND interaction = ?
                    ORDER BY item_index ASC
                    """,
                    (user_id, phase, data["session_id"], data["interaction"])
                ).fetchall()

                for r in rows:
                    previous_responses.append({
                        "item_index": r["item_index"],
                        "item_type": r["item_type"],
                        "item_id": r["item_id"],
                        "prompt": r["prompt"],
                        "response": r["answer"],
                        "is_correct": bool(r["is_correct"]) if r["is_correct"] is not None else None,
                        "score": r["score"],
                    })

            data["previous_responses"] = previous_responses
        finally:
            conn.close()

        return {"success": True, "data": data}

    except Exception as e:
        logger.error(f"Error fetching resume progress: {e}")
        return JSONResponse(status_code=500, content={"success": False, "error": str(e)})


@router.post('/complete')
async def complete_phase(body: CompleteRequest, user: dict = Depends(get_current_user)):
    """Mark a phase as complete."""
    try:
        user_id = user["user_id"]

        conn = get_db_connection()
        try:
            conn.execute(
                "UPDATE student_progress SET is_complete = 1 WHERE user_id = ? AND phase = ?",
                (user_id, body.phase)
            )
            conn.commit()
        finally:
            conn.close()

        return {"success": True}

    except Exception as e:
        logger.error(f"Error completing phase: {e}")
        return JSONResponse(status_code=500, content={"success": False, "error": str(e)})
