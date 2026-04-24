"""
API routes for the CEFR assessment game - FastAPI migration of routes/api_routes.py + app.py API routes.
Session state is persisted to a game_sessions DB table instead of Flask filesystem sessions.
"""
import random
import logging
import uuid
import json
import re
import sqlite3
from datetime import datetime
from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi.responses import JSONResponse

from services.ai_service import AIService
from services.audio_service import AudioService
from services.assessment_service import AssessmentService
from utils.helpers import (
    get_challenges_by_level,
    get_tips_by_level,
    get_xp_reward_by_level,
    determine_overall_level,
    skill_levels_from_assessments,
    calculate_achievements,
)
from models.game_data import (
    NPCS,
    DIALOGUE_QUESTIONS,
    CEFR_LEVELS,
    BADGES,
    ACHIEVEMENTS,
    PROGRESS_LEVELS,
    PHASE_2_STEPS,
    PHASE_2_REMEDIAL_ACTIVITIES,
    PHASE_2_POINTS,
    PHASE_2_SUCCESS_THRESHOLD,
)
from dependencies import db_manager, user_manager, assessment_history
from auth_utils import get_current_user, get_current_admin, get_optional_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["api"])

# Initialize services
ai_service = AIService()
audio_service = AudioService()
assessment_service = AssessmentService()


# ======================================================================
# game_sessions table + helpers  (replaces Flask filesystem sessions)
# ======================================================================

def init_game_sessions_table():
    conn = db_manager.get_connection()
    try:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS game_sessions (
                user_id INTEGER PRIMARY KEY,
                current_step INTEGER DEFAULT 0,
                responses TEXT DEFAULT '[]',
                assessments TEXT DEFAULT '[]',
                xp INTEGER DEFAULT 0,
                start_time TEXT,
                player_name TEXT,
                phase1_completed BOOLEAN DEFAULT 0,
                overall_level TEXT,
                phase2_session_id TEXT,
                phase2_responses TEXT DEFAULT '{}',
                phase2_assessments TEXT DEFAULT '{}',
                phase2_remedial_responses TEXT DEFAULT '{}',
                phase2_level_completed TEXT DEFAULT '{}',
                phase2_current_level TEXT DEFAULT '{}',
                phase2_level_progress TEXT DEFAULT '{}',
                remedial_completed TEXT DEFAULT '{}',
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        ''')
        conn.commit()
    finally:
        conn.close()

init_game_sessions_table()


def get_game_session(user_id):
    """Get game session data for user, creating if needed."""
    conn = db_manager.get_connection()
    try:
        row = conn.execute('SELECT * FROM game_sessions WHERE user_id = ?', (user_id,)).fetchone()
        if not row:
            conn.execute('INSERT INTO game_sessions (user_id) VALUES (?)', (user_id,))
            conn.commit()
            row = conn.execute('SELECT * FROM game_sessions WHERE user_id = ?', (user_id,)).fetchone()
        return dict(row)
    finally:
        conn.close()


def update_game_session(user_id, **kwargs):
    """Update game session fields. JSON fields are auto-serialized."""
    conn = db_manager.get_connection()
    try:
        json_fields = {
            'responses', 'assessments', 'phase2_responses', 'phase2_assessments',
            'phase2_remedial_responses', 'phase2_level_completed', 'phase2_current_level',
            'phase2_level_progress', 'remedial_completed',
        }
        sets = []
        values = []
        for key, val in kwargs.items():
            sets.append(f"{key} = ?")
            if key in json_fields and not isinstance(val, str):
                values.append(json.dumps(val))
            else:
                values.append(val)
        sets.append("updated_at = CURRENT_TIMESTAMP")
        values.append(user_id)
        conn.execute(f"UPDATE game_sessions SET {', '.join(sets)} WHERE user_id = ?", values)
        conn.commit()
    finally:
        conn.close()


def get_session_json(session_data, field, default):
    """Parse a JSON field from game session row."""
    val = session_data.get(field)
    if val is None:
        return default
    if isinstance(val, str):
        try:
            return json.loads(val)
        except Exception:
            return default
    return val


def replace_player_placeholders(text, player_name=None):
    """Replace [Player] placeholders with actual player name."""
    if not player_name:
        player_name = "Player"
    return text.replace('[Player]', player_name) if text else text


# ======================================================================
# Phase 2 helper functions  (ported from api_routes.py)
# ======================================================================

def get_next_phase2_step(current_step):
    steps = sorted(PHASE_2_STEPS.keys())
    try:
        idx = steps.index(current_step)
        if idx + 1 < len(steps):
            return steps[idx + 1]
    except ValueError:
        pass
    return None


def determine_phase2_user_level(total_score):
    if total_score < 10:
        return 'A1'
    elif total_score < 15:
        return 'A2'
    elif total_score < 20:
        return 'B1'
    else:
        return 'B2'


def get_next_remedial_level(current_level):
    level_order = ['A1', 'A2', 'B1']
    try:
        idx = level_order.index(current_level)
        if idx < len(level_order) - 1:
            return level_order[idx + 1]
    except ValueError:
        logger.warning(f"Invalid level: {current_level}")
    return None


def check_level_completion(gs, step_id, level):
    completed_key = f"{step_id}_{level}_completed"
    level_completed = get_session_json(gs, 'phase2_level_completed', {})
    completed_activities = level_completed.get(completed_key, [])
    remedial_activities = PHASE_2_REMEDIAL_ACTIVITIES.get(step_id, {}).get(level, [])
    total_activities = len(remedial_activities)
    logger.info(f"Level completion check: {step_id}/{level} - {len(completed_activities)}/{total_activities} completed: {completed_activities}")
    return len(completed_activities) >= total_activities


def mark_activity_completed(user_id, gs, step_id, level, activity_index):
    level_completed = get_session_json(gs, 'phase2_level_completed', {})
    completed_key = f"{step_id}_{level}_completed"
    if completed_key not in level_completed:
        level_completed[completed_key] = []
    if activity_index not in level_completed[completed_key]:
        level_completed[completed_key].append(activity_index)
        update_game_session(user_id, phase2_level_completed=level_completed)
        logger.info(f"Marked {level} activity {activity_index} as completed for step {step_id}")
    # Return updated gs
    gs['phase2_level_completed'] = json.dumps(level_completed)
    return gs


def get_current_level_for_step(user_id, gs, step_id, initial_level):
    current_level_map = get_session_json(gs, 'phase2_current_level', {})
    if step_id not in current_level_map:
        current_level_map[step_id] = initial_level
        update_game_session(user_id, phase2_current_level=current_level_map)
    return current_level_map[step_id]


def set_current_level_for_step(user_id, gs, step_id, level):
    current_level_map = get_session_json(gs, 'phase2_current_level', {})
    current_level_map[step_id] = level
    update_game_session(user_id, phase2_current_level=current_level_map)
    logger.info(f"Set current level for step {step_id} to {level}")


def get_phase2_step_progress_record(user_id, step_id):
    """Return the stored Phase 2 progress row for a specific step if it exists."""
    try:
        progress = assessment_history.get_phase2_progress(user_id) or {}
        for step in progress.get('steps', []):
            if step.get('step_id') == step_id:
                return step
    except Exception as e:
        logger.error(f"Error loading Phase 2 progress record for {step_id}: {str(e)}")
    return {}


WRITING_TASK_TYPES = {
    'writing',
    'sentence_expansion', 'reflection_gap_fill', 'negotiation_gap_fill',
    'listening_negotiation', 'listening_role_play',
    'listening_proposal_writing', 'listening_proposal', 'listening_expansion',
    'listening_research', 'listening_team_plan', 'listening_assignment',
}

def score_dialogue_completion(activity, responses):
    """Exact word-match scoring for dialogue_completion.
    Extracts expected words from correct_answer sentences by splitting on template fixed parts,
    then compares case-insensitively to the submitted words per blank."""
    import re as _re
    dialogue_lines = activity.get('dialogue_lines', [])
    correct_answers = activity.get('correct_answers', [])
    if not dialogue_lines or not correct_answers:
        return 0, 0

    user_lines = [(i, l) for i, l in enumerate(dialogue_lines)
                  if l.get('template') and '___' in l['template']]

    total_blanks = 0
    correct_count = 0

    for li, (orig_idx, line) in enumerate(user_lines):
        if li >= len(correct_answers):
            break
        template = line['template']
        correct_sentence = _re.sub(r'^\d+\.\s*', '', correct_answers[li])

        # Extract expected words by splitting template on blank sequences
        parts = _re.split(r'_{3,}', template)
        expected_words = []
        remaining = correct_sentence
        for i, part in enumerate(parts[:-1]):
            stripped = part.strip()
            if stripped:
                idx = remaining.lower().find(stripped.lower())
                if idx >= 0:
                    remaining = remaining[idx + len(stripped):].lstrip()
            next_part = parts[i + 1].strip() if parts[i + 1].strip() else None
            if next_part:
                idx = remaining.lower().find(next_part.lower())
                expected_words.append(remaining[:idx].strip() if idx >= 0 else remaining.strip())
                remaining = remaining[idx:] if idx >= 0 else ''
            else:
                expected_words.append(remaining.strip())

        # Get submitted words for this line
        line_key = f'line_{orig_idx}'
        submitted = responses.get(line_key, [])
        if isinstance(submitted, str):
            submitted = submitted.split()

        for j, expected in enumerate(expected_words):
            total_blanks += 1
            submitted_word = submitted[j] if j < len(submitted) else ''
            if submitted_word.strip().lower() == expected.strip().lower():
                correct_count += 1
            else:
                logger.info(f"Blank {j} line {li}: got '{submitted_word}' expected '{expected}'")

    logger.info(f"Dialogue scoring: {correct_count}/{total_blanks} correct")
    return correct_count, total_blanks


def ai_score_writing(activity, responses, max_score):
    """Call Groq to score a writing/dialogue exercise. Returns an int 0..max_score."""
    try:
        if not ai_service.client:
            return None

        learner_text = ' '.join(str(v) for v in responses.values() if v)
        if not learner_text.strip():
            return 0

        ai_eval = activity.get('ai_evaluation') or {}
        prompt_template = ai_eval.get('prompt', '')
        guided = activity.get('guided_questions', [])
        examples = activity.get('example_of_answers', []) or activity.get('correct_answers', [])

        if prompt_template:
            prompt = (prompt_template
                      .replace('{{TASK_INSTRUCTION}}', activity.get('instruction', ''))
                      .replace('{{GUIDED_QUESTIONS}}', '\n'.join(f'- {q}' for q in guided))
                      .replace('{{EXAMPLE_ANSWERS}}', '\n'.join(f'- {e}' for e in examples))
                      .replace('{{LEARNER_RESPONSE}}', learner_text))
        else:
            # Generic prompt for dialogue_completion and similar types
            examples_text = '\n'.join(f'- {e}' for e in examples) if examples else 'N/A'
            prompt = f"""You are a CEFR language evaluator.

Task: {activity.get('instruction', '')}
Example correct answers:
{examples_text}

Learner response:
{learner_text}

Evaluate whether the learner's response correctly completes the task. Consider meaning, grammar, and relevance. Minor spelling/grammar errors are acceptable if the meaning is clear.

Return JSON only:
{{
  "score": 0-100,
  "level_alignment": "below" | "meets" | "above",
  "strengths": ["..."],
  "improvements": ["..."],
  "feedback": "Short, encouraging, level-appropriate feedback."
}}"""

        completion = ai_service.client.chat.completions.create(
            model=ai_service.model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=300,
            temperature=0.2,
        )
        import re
        raw = completion.choices[0].message.content.strip()
        logger.info(f"AI writing raw response: {raw[:300]}")
        # Extract the first JSON object from the response regardless of fences or preamble
        match = re.search(r'\{[\s\S]*\}', raw)
        if not match:
            logger.error(f"No JSON object found in AI response: {raw[:200]}")
            return None
        result = json.loads(match.group())
        pct = float(result.get('score', 0)) / 100.0
        score = round(pct * max_score)
        logger.info(f"AI writing score: {result.get('score')}/100 → {score}/{max_score} | {result.get('level_alignment')}")
        return score
    except Exception as e:
        logger.error(f"AI writing scoring failed: {e}")
        return None


def sync_phase2_step_progress(user_id, session_id, step_id, **updates):
    """Merge resume-critical Phase 2 step state into the dedicated progress table."""
    existing = get_phase2_step_progress_record(user_id, step_id)
    action_items = PHASE_2_STEPS.get(step_id, {}).get('action_items', [])
    progress_data = {
        'current_item': existing.get('current_item', 0),
        'total_items': existing.get('total_items', len(action_items) or 5),
        'step_score': existing.get('step_score', 0),
        'step_completed': bool(existing.get('step_completed', False)),
        'needs_remedial': bool(existing.get('needs_remedial', False)),
        'remedial_level': existing.get('remedial_level'),
        'remedial_progress': existing.get('remedial_progress', {}) or {},
        'completed_at': existing.get('completed_at'),
    }
    progress_data.update(updates)
    return assessment_history.save_phase2_progress(user_id, session_id, step_id, progress_data)


def get_phase2_overall_assessment(gs):
    """Get overall Phase 2 assessment for storage."""
    try:
        p2_assessments = get_session_json(gs, 'phase2_assessments', {})
        if not p2_assessments:
            return None
        total_score = 0
        step_scores = {}
        level_counts = {'A1': 0, 'A2': 0, 'B1': 0, 'B2': 0}
        for step_id in ['step_1', 'step_2', 'step_3', 'final_writing']:
            step_score = 0
            step_items = 0
            for key, asmt in p2_assessments.items():
                if key.startswith(f"phase2_{step_id}_"):
                    points = asmt.get('points', 1)
                    lvl = asmt.get('level', 'A1')
                    step_score += points
                    step_items += 1
                    if lvl in level_counts:
                        level_counts[lvl] += 1
            if step_items > 0:
                step_scores[step_id] = {'score': step_score, 'items': step_items, 'average': round(step_score / step_items, 2)}
                total_score += step_score
        if level_counts['B2'] >= 2:
            overall_level = 'B2'
        elif level_counts['B1'] >= 3:
            overall_level = 'B1'
        elif level_counts['A2'] >= 3:
            overall_level = 'A2'
        else:
            overall_level = 'A1'
        return {
            'overall_level': overall_level,
            'total_score': total_score,
            'step_scores': step_scores,
            'level_distribution': level_counts,
            'total_responses': len(p2_assessments),
            'completion_rate': len(p2_assessments) / 20 * 100,
        }
    except Exception as e:
        logger.error(f"Error calculating Phase 2 assessment: {str(e)}")
        return None


# ======================================================================
# /start-game  (was on app.py, not on the api blueprint)
# ======================================================================

@router.api_route('/start-game', methods=["GET", "POST"])
async def start_game(user: dict = Depends(get_current_user)):
    """Initialize game session with player data - requires login."""
    user_id = user["user_id"]
    player_name = user.get("first_name") or user.get("username", "Player")

    update_game_session(
        user_id,
        player_name=player_name,
        current_step=0,
        responses=[],
        assessments=[],
        start_time=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        xp=0,
        phase1_completed=0,
    )
    return {"success": True, "redirect": "/game"}


# ======================================================================
# Phase 1 endpoints
# ======================================================================

@router.get('/results')
async def get_results(user: dict = Depends(get_current_user)):
    """Finalize current session results and return JSON mirroring the classic results page."""
    try:
        user_id = user["user_id"]
        gs = get_game_session(user_id)

        player_name = gs.get('player_name') or user.get('first_name') or user.get('username', 'Player')
        assessments = get_session_json(gs, 'assessments', [])
        responses = get_session_json(gs, 'responses', [])
        start_time_str = gs.get('start_time')
        xp = gs.get('xp') or 0

        if not assessments or len(assessments) == 0:
            raise HTTPException(status_code=404, detail="No assessment data found. Please complete Phase 1 assessment first.")

        total_responses = len(responses)
        ai_detected_count = sum(1 for r in responses if r.get('ai_generated', False))
        ai_percentage = round((ai_detected_count / total_responses * 100) if total_responses > 0 else 0)

        start_time = datetime.strptime(start_time_str, "%Y-%m-%d %H:%M:%S") if start_time_str else datetime.now()
        time_taken = (datetime.now() - start_time).total_seconds()

        overall_level = determine_overall_level(assessments)
        level_description = CEFR_LEVELS.get(overall_level, "Could not determine level")
        achievements_earned = calculate_achievements(assessments, start_time)
        skill_levels = skill_levels_from_assessments(assessments)

        progress_levels = []
        for level in PROGRESS_LEVELS:
            required_level = level.get('required_level')
            is_unlocked = True
            if required_level:
                level_values = {"A1": 1, "A2": 2, "B1": 3, "B2": 4, "C1": 5}
                player_level_value = level_values.get(overall_level, 0)
                required_level_value = level_values.get(required_level, 999)
                is_unlocked = player_level_value >= required_level_value
            progress_levels.append({
                "name": level.get('name'),
                "description": level.get('description'),
                "icon": level.get('icon'),
                "is_unlocked": is_unlocked,
                "required_level": required_level,
            })

        # Enrich responses with speaker
        try:
            step_map = {q.get('step'): q for q in DIALOGUE_QUESTIONS}
            for r in responses:
                st = r.get('step')
                if st in step_map and 'speaker' not in r:
                    r['speaker'] = step_map[st].get('speaker')
        except Exception:
            pass

        # Save assessment to DB
        assessment_data = {
            'overall_level': overall_level,
            'xp_earned': xp,
            'time_taken': int(time_taken),
            'skill_levels': skill_levels,
            'achievements': achievements_earned,
            'responses': responses,
            'assessments': assessments,
            'ai_usage_percentage': ai_percentage,
        }
        assessment_session_id = str(uuid.uuid4())
        save_ok = False
        if user_id:
            save_ok = assessment_history.save_assessment(user_id, assessment_session_id, assessment_data)

        # Mark completed
        update_game_session(user_id, phase1_completed=1, overall_level=overall_level)

        return {
            'player_name': player_name,
            'assessments': assessments,
            'responses': responses,
            'overall_level': overall_level,
            'level_description': level_description,
            'cefr_levels': CEFR_LEVELS,
            'achievements': ACHIEVEMENTS,
            'achievements_earned': achievements_earned,
            'xp': xp,
            'badges': BADGES,
            'progress_levels': progress_levels,
            'skill_levels': skill_levels,
            'ai_responses_count': ai_detected_count,
            'responses_length': total_responses,
            'ai_percentage': ai_percentage,
            'saved': bool(save_ok),
            'session_id': assessment_session_id,
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error building results: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get('/game/state')
async def get_game_state(user: dict = Depends(get_current_user), step: int = None):
    try:
        user_id = user["user_id"]
        gs = get_game_session(user_id)

        session_step = gs.get('current_step') or 0
        total_steps = len(DIALOGUE_QUESTIONS)
        # If a specific step is requested via URL param, serve that question
        # but only if it's within bounds and not beyond the session's progress
        current_step = step if (step is not None and 0 <= step < total_steps) else session_step
        xp = gs.get('xp') or 0

        if current_step >= total_steps:
            return {'completed': True, 'current_step': current_step, 'total_steps': total_steps, 'xp': xp}

        q = DIALOGUE_QUESTIONS[current_step]
        question = {
            'step': q.get('step'),
            'speaker': q.get('speaker'),
            'question': q.get('question'),
            'instruction': q.get('instruction'),
            'type': q.get('type'),
            'skill': q.get('skill'),
            'scene': q.get('scene'),
            'audio_cue': q.get('audio_cue'),
        }

        scene = q.get('scene', 'meeting_room')
        scene_description = {
            'meeting_room': 'A bright conference room with a large table and chairs. Maps of Tunisia and cultural artifacts decorate the walls.',
            'coffee_break': 'A casual seating area with comfortable sofas and a coffee table. Committee members are chatting and enjoying refreshments.',
            'brainstorming_area': 'A creative space with whiteboards, sticky notes, and colorful markers. Ideas for the event are posted all around.',
            'creative_corner': 'A quiet area with inspirational posters and design materials, perfect for writing and creative tasks.',
        }.get(scene, 'A room at the university')

        skill = q.get('skill', 'communication')
        skill_descriptions = {
            'self-expression': 'Ability to introduce yourself and express personal information',
            'reasoning': 'Ability to explain your thoughts and motivations',
            'world_knowledge': 'Knowledge about cultural topics and facts',
            'listening_comprehension': 'Ability to understand and process spoken language',
            'ideation': 'Creativity and ability to generate original ideas',
            'conversation': 'Social interaction skills and politeness',
            'strategic_thinking': 'Problem-solving abilities and forward planning',
            'abstract_thinking': 'Ability to discuss abstract concepts and ideas',
            'written_expression': 'Writing skills and ability to craft messages',
        }

        speaker = q.get('speaker')
        npc = NPCS.get(speaker, {})
        speaker_role = npc.get('role')
        speaker_avatar = npc.get('avatar')

        audio_url = None
        if q.get('audio_cue'):
            audio_url = f"/static/audio/{q.get('audio_cue')}"

        return {
            'completed': False,
            'current_step': current_step,
            'total_steps': total_steps,
            'xp': xp,
            'question': question,
            'npcs': list(NPCS.keys()),
            'scene_description': scene_description,
            'skill_description': skill_descriptions.get(skill, 'Communication skills'),
            'speaker_role': speaker_role,
            'speaker_avatar': speaker_avatar,
            'audio_url': audio_url,
        }
    except Exception as e:
        logger.error(f"Error in get_game_state: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post('/game/submit')
async def api_submit_response(request: Request, user: dict = Depends(get_current_user)):
    try:
        data = await request.json()
        response_text = data.get('response', '')
        question_type = data.get('question_type', '')
        if not response_text:
            raise HTTPException(status_code=400, detail="Response is required")

        user_id = user["user_id"]
        gs = get_game_session(user_id)
        current_step = gs.get('current_step') or 0

        if current_step >= len(DIALOGUE_QUESTIONS):
            return {"message": "completed"}

        question_data = DIALOGUE_QUESTIONS[current_step]
        question_text = question_data['question']

        # AI detection
        is_ai, ai_score, ai_reasons = assessment_service.check_ai_response(response_text)
        if is_ai and ai_score > 0.5:
            raise HTTPException(status_code=400, detail={
                "error": "AI content detected",
                "message": f"AI content detected ({ai_score:.0%}). Please provide your own authentic response.",
                "ai_score": ai_score,
                "ai_reasons": ai_reasons,
            })

        responses = get_session_json(gs, 'responses', [])
        responses.append({
            "step": current_step + 1,
            "question": question_text,
            "response": response_text,
            "type": question_type or question_data.get('type'),
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "ai_generated": is_ai,
            "ai_score": ai_score,
            "ai_reasons": ai_reasons,
        })

        assessment = assessment_service.assess_response(question_text, response_text, question_type or question_data.get('type'))
        assessment["type"] = question_type or question_data.get('type')
        assessment["step"] = current_step + 1
        assessment["ai_generated"] = is_ai
        assessment["ai_score"] = ai_score
        assessment["ai_reasons"] = ai_reasons

        assessments = get_session_json(gs, 'assessments', [])
        assessments.append(assessment)

        xp_earned = question_data.get('xp_reward', 10)
        level_multipliers = {"A1": 1.0, "A2": 1.2, "B1": 1.5, "B2": 1.8, "C1": 2.0}
        xp_earned = int(xp_earned * level_multipliers.get(assessment.get('level', 'B1'), 1.0))
        new_xp = (gs.get('xp') or 0) + xp_earned

        update_game_session(user_id, responses=responses, assessments=assessments, xp=new_xp, current_step=current_step + 1)

        return {"success": True, "xp_earned": xp_earned, "assessment": assessment}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in api_submit_response: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post('/get-ai-feedback')
async def get_ai_feedback(request: Request, user: dict = Depends(get_current_user)):
    """Get AI feedback on a response with detailed language assessment."""
    data = await request.json()
    question = data.get('question', '')
    response = data.get('response', '')
    speaker = data.get('speaker', 'Ms. Mabrouki')
    question_type = data.get('type', '')

    is_ai, ai_score, ai_reasons = assessment_service.check_ai_response(response)

    quick_assessment = assessment_service.assess_response(question, response, question_type)
    level = quick_assessment.get('level', 'B1')
    strengths = quick_assessment.get('specific_strengths', [])
    improvements = quick_assessment.get('specific_areas_for_improvement', [])

    if is_ai:
        improvements = ["Your response appears to use AI-generated patterns"] + improvements

    if strengths and improvements:
        coaching_notes = f"""
        This response is approximately at CEFR level {level}.
        Strengths: {', '.join(strengths[:2])}
        Areas for improvement: {', '.join(improvements[:2])}
        {'This response shows characteristics typical of AI-generated content. ' if is_ai else ''}
        Give encouraging feedback that acknowledges these strengths and provides one brief suggestion related to the top area for improvement. Make it sound natural and conversational.
        """
    else:
        coaching_notes = f"""
        This response is approximately at CEFR level {level}.
        {'This response shows characteristics typical of AI-generated content. ' if is_ai else ''}
        Give encouraging feedback appropriate for this level. If it's a lower level (A1-A2), focus on praising their effort and encourage more vocabulary. If it's a mid level (B1), suggest using more complex sentences. If it's a higher level (B2-C1), praise their sophistication and encourage continuing this level of expression.
        """

    prompt = f"""
    As {speaker}, you are providing feedback to a student in an English language learning game.

    Student's response to: "{question}"

    Their response: "{response}"

    {coaching_notes}

    CRITICAL FEEDBACK REQUIREMENTS:
    - Always check for basic capitalization errors, especially "i" instead of "I"
    - Check for inappropriate contractions in formal contexts
    - Point out professional English standards when needed
    - Use formal English in your own response (I am, do not, cannot - NO contractions)

    SPECIFIC ERRORS TO ALWAYS CATCH:
    - "i" instead of "I" -> Must be corrected every time
    - Missing capitalization at sentence beginnings
    - Informal contractions in formal contexts: "i'm" -> "I am", "don't" -> "do not", "can't" -> "cannot", "won't" -> "will not", "shouldn't" -> "should not", "couldn't" -> "could not", "wouldn't" -> "would not"
    - Missing punctuation

    IMPORTANT: Your response MUST BE IN ENGLISH ONLY, even if the student wrote in another language. This is an English language learning application.

    Your response should:
    1. Stay completely in character as {speaker}
    2. Be encouraging and supportive
    3. Be concise (2-3 sentences)
    4. ALWAYS correct "i" to "I" and contractions if you see these errors
    5. Include one brief, specific suggestion for improvement focusing on professional English
    6. Model correct formal English in your own response (use "I am", "do not", "cannot" etc.)
    7. End with a natural segue to the next part of the conversation
    8. ALWAYS RESPOND IN ENGLISH ONLY, regardless of what language the student used

    EXAMPLE CORRECTIONS:
    - If student writes "i am fine" -> Say "Remember to always capitalize 'I' - it should be 'I am fine'"
    - If student writes "i'm happy" -> Say "Great! Just remember to capitalize 'I' and use 'I am' instead of 'I'm' for more formal writing"
    - If student writes "i don't know" -> Say "Good effort! Remember to capitalize 'I' and use 'do not' instead of 'don't' - so 'I do not know'"
    """

    ai_response = ai_service.get_ai_response(prompt, speaker)

    return {
        "ai_response": ai_response,
        "assessment": {
            "level": level,
            "strengths": strengths[:2] if strengths else [],
            "improvements": improvements[:2] if improvements else [],
            "ai_generated": is_ai,
            "ai_score": ai_score,
            "ai_reasons": ai_reasons[:3] if ai_reasons else [],
        },
    }


@router.get('/language-tips')
async def language_tips(request: Request, user: dict = Depends(get_current_user)):
    level = request.query_params.get('level', 'B1')
    selected_tips = get_tips_by_level(level)
    tips_to_show = random.sample(selected_tips, min(2, len(selected_tips)))
    return {"level": level, "tips": tips_to_show}


@router.get('/next-challenge')
async def next_challenge(request: Request, user: dict = Depends(get_current_user)):
    level = request.query_params.get('level', 'B1')
    selected_challenges = get_challenges_by_level(level)
    challenge = random.choice(selected_challenges)
    xp_reward = get_xp_reward_by_level(level)
    return {"level": level, "challenge": challenge, "xp_reward": xp_reward}


@router.post('/check-ai-response')
async def check_ai_response(request: Request, user: dict = Depends(get_current_user)):
    try:
        data = await request.json()
        response_text = data.get('response', '')
        logger.info(f"Checking AI for text: {response_text[:100]}...")

        if len(response_text.strip()) < 20:
            return {"is_ai": False, "score": 0, "message": "Response too short for AI detection", "reasons": []}

        is_ai, ai_score, ai_reasons = assessment_service.check_ai_response(response_text)
        logger.info(f"AI Detection result - is_ai: {is_ai}, score: {ai_score}")

        return {
            "is_ai": is_ai,
            "score": ai_score,
            "message": f"AI detection score: {ai_score:.0%}",
            "reasons": ai_reasons[:3] if ai_reasons else [],
        }
    except Exception as e:
        logger.error(f"ERROR in check_ai_response: {str(e)}")
        return {"is_ai": False, "score": 0, "message": "Error in AI detection", "reasons": []}


@router.post('/generate-audio')
async def api_generate_audio(request: Request, user: dict = Depends(get_current_user)):
    data = await request.json()
    text = data.get('text', '')
    voice = data.get('voice', 'en-US-ChristopherNeural')
    filename = data.get('filename', f'custom_{int(datetime.now().timestamp())}.mp3')
    if not text:
        raise HTTPException(status_code=400, detail="No text provided")
    try:
        audio_url = audio_service.generate_custom_audio(text, filename, voice)
        return {"success": True, "audio_url": audio_url}
    except Exception as e:
        logger.error(f"Error generating audio: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ======================================================================
# Phase 2 endpoints
# ======================================================================

@router.post('/phase2/submit-response')
async def submit_phase2_response(request: Request, user: dict = Depends(get_current_user)):
    """Submit a Phase 2 response and get assessment."""
    try:
        data = await request.json()
        step_id = data.get('step_id')
        action_item_id = data.get('action_item_id')
        response_text = data.get('response', '')

        logger.info(f"Phase 2 submission - Step: {step_id}, Item: {action_item_id}")

        if not all([step_id, action_item_id, response_text]):
            raise HTTPException(status_code=400, detail="Missing required fields")
        if step_id not in PHASE_2_STEPS:
            raise HTTPException(status_code=400, detail="Invalid step ID")

        is_ai, ai_score, ai_reasons = assessment_service.check_ai_response(response_text)
        if is_ai and ai_score > 0.5:
            return JSONResponse(status_code=400, content={
                "error": "AI content detected",
                "message": f"AI content detected ({ai_score:.0%}). Please provide your own authentic response.",
                "ai_score": ai_score,
                "ai_reasons": ai_reasons,
            })

        assessment = assessment_service.assess_phase2_response(step_id, action_item_id, response_text)

        user_id = user["user_id"]
        gs = get_game_session(user_id)

        # Create phase2_session_id if needed
        phase2_session_id = gs.get('phase2_session_id')
        if not phase2_session_id:
            phase2_session_id = str(uuid.uuid4())
            update_game_session(user_id, phase2_session_id=phase2_session_id)

        session_key = f"phase2_{step_id}_{action_item_id}"

        p2_responses = get_session_json(gs, 'phase2_responses', {})
        p2_assessments = get_session_json(gs, 'phase2_assessments', {})

        p2_responses[session_key] = {
            'response': response_text,
            'timestamp': datetime.now().isoformat(),
            'ai_generated': is_ai,
            'ai_score': ai_score,
        }
        p2_assessments[session_key] = assessment

        update_game_session(user_id, phase2_responses=p2_responses, phase2_assessments=p2_assessments)

        # Save to database
        try:
            response_data = {
                'response_text': response_text,
                'assessment_data': assessment,
                'points_earned': assessment.get('points', 1),
                'cefr_level': assessment.get('cefr_level', 'A1'),
                'ai_detected': is_ai,
                'ai_score': ai_score,
            }
            assessment_history.save_phase2_response(user_id, phase2_session_id, step_id, action_item_id, response_data)
            logger.info(f"Phase 2 response saved to database for user {user_id}")
        except Exception as db_error:
            logger.error(f"Failed to save Phase 2 response to database: {str(db_error)}")

        # Determine progression logic
        step_data = PHASE_2_STEPS[step_id]
        action_items = step_data['action_items']
        current_index = 0
        for i, item in enumerate(action_items):
            if item['id'] == action_item_id:
                current_index = i
                break

        is_last_item = current_index >= len(action_items) - 1
        next_action_item = None
        if not is_last_item:
            next_action_item = action_items[current_index + 1]

        try:
            sync_phase2_step_progress(
                user_id,
                phase2_session_id,
                step_id,
                current_item=min(current_index + 1, len(action_items)),
                total_items=len(action_items),
                step_completed=False,
                completed_at=None,
            )
        except Exception as db_error:
            logger.error(f"Failed to sync Phase 2 current item for user {user_id}: {str(db_error)}")

        if is_last_item:
            total_items = len(action_items)
            completed_items = 0
            total_score = 0
            # Re-read updated assessments
            gs2 = get_game_session(user_id)
            all_assessments = get_session_json(gs2, 'phase2_assessments', {})
            for item in action_items:
                sk = f"phase2_{step_id}_{item['id']}"
                if sk in all_assessments:
                    completed_items += 1
                    assessment_data = all_assessments[sk]
                    lvl = assessment_data.get('level', 'A1')
                    total_score += PHASE_2_POINTS.get(lvl, 1)

            needs_remedial = total_score < PHASE_2_SUCCESS_THRESHOLD
            if needs_remedial:
                user_level = determine_phase2_user_level(total_score)
                next_action = "remedial_activities"
                next_url = f"/app/phase2/remedial/{step_id}/{user_level}"
                message = "Good work! Let's strengthen your skills with some practice activities before moving forward."
            else:
                next_step = get_next_phase2_step(step_id)
                if next_step:
                    next_action = "next_step"
                    next_url = f"/app/phase2/step/{next_step}"
                    message = "Excellent! You've completed this step. Ready for the next challenge?"
                else:
                    next_action = "phase2_complete"
                    next_url = "/app/phase2/complete"
                    message = "Congratulations! You've completed Phase 2!"
        else:
            next_action = "next_action_item"
            next_url = f"/app/phase2/step/{step_id}"
            message = "Great response! Let's continue with the next part."

        return {
            "success": True,
            "assessment": assessment,
            "points_earned": assessment.get('points', 1),
            "message": message,
            "progression": {
                "next_action": next_action,
                "next_url": next_url,
                "is_last_item": is_last_item,
                "next_action_item": next_action_item,
                "current_index": current_index,
                "total_items": len(action_items),
            },
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in Phase 2 response submission: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get('/phase2/get-step-state')
async def get_phase2_step_state(request: Request, user: dict = Depends(get_current_user)):
    """Get current state of a Phase 2 step."""
    try:
        step_id = request.query_params.get('step_id')
        if not step_id or step_id not in PHASE_2_STEPS:
            raise HTTPException(status_code=400, detail="Invalid step ID")

        step_data = PHASE_2_STEPS[step_id]
        action_items = step_data['action_items']

        user_id = user["user_id"]
        gs = get_game_session(user_id)
        p2_assessments = get_session_json(gs, 'phase2_assessments', {})

        current_index = 0
        for i, item in enumerate(action_items):
            sk = f"phase2_{step_id}_{item['id']}"
            if sk not in p2_assessments:
                current_index = i
                break
            current_index = i + 1

        if current_index >= len(action_items):
            current_index = len(action_items) - 1

        current_action_item = action_items[current_index] if current_index < len(action_items) else None
        completed_responses = sum(1 for item in action_items if f"phase2_{step_id}_{item['id']}" in p2_assessments)
        is_step_complete = completed_responses >= len(action_items)

        return {
            "step_id": step_id,
            "step_title": step_data['title'],
            "step_description": step_data['description'],
            "scenario": step_data['scenario'],
            "current_index": current_index,
            "current_action_item": current_action_item,
            "total_items": len(action_items),
            "completed_items": completed_responses,
            "is_step_complete": is_step_complete,
            "progress_percentage": round((completed_responses / len(action_items)) * 100),
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting Phase 2 step state: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post('/phase2/check-step-completion')
async def check_phase2_step_completion(request: Request, user: dict = Depends(get_current_user)):
    """Check if a Phase 2 step is completed and determine next action."""
    try:
        data = await request.json()
        step_id = data.get('step_id')
        if step_id not in PHASE_2_STEPS:
            raise HTTPException(status_code=400, detail="Invalid step ID")

        user_id = user["user_id"]
        gs = get_game_session(user_id)
        step_data = PHASE_2_STEPS[step_id]
        total_items = len(step_data['action_items'])

        p2_assessments = get_session_json(gs, 'phase2_assessments', {})
        completed_items = 0
        total_score = 0
        for i in range(total_items):
            action_item = step_data['action_items'][i]
            sk = f"phase2_{step_id}_{action_item['id']}"
            if sk in p2_assessments:
                completed_items += 1
                asmt = p2_assessments[sk]
                lvl = asmt.get('level', 'A1')
                total_score += PHASE_2_POINTS.get(lvl, 1)

        step_complete = completed_items >= total_items
        if not step_complete:
            return {
                "step_complete": False,
                "completed_items": completed_items,
                "total_items": total_items,
                "next_action": "continue_step",
            }

        needs_remedial = total_score < PHASE_2_SUCCESS_THRESHOLD

        # Save step completion to database
        try:
            phase2_session_id = gs.get('phase2_session_id') or str(uuid.uuid4())
            if not gs.get('phase2_session_id'):
                update_game_session(user_id, phase2_session_id=phase2_session_id)
            remedial_level = determine_phase2_user_level(total_score) if needs_remedial else None
            progress_data = {
                'current_item': completed_items,
                'total_items': total_items,
                'step_score': total_score,
                'step_completed': True,
                'needs_remedial': needs_remedial,
                'remedial_level': remedial_level,
                'remedial_progress': ({
                    'status': 'in_progress',
                    'level': remedial_level,
                    'activity_index': 0,
                } if needs_remedial else {}),
                'completed_at': datetime.now().isoformat(),
            }
            assessment_history.save_phase2_progress(user_id, phase2_session_id, step_id, progress_data)
            logger.info(f"Phase 2 step {step_id} completion saved to database for user {user_id}")
        except Exception as db_error:
            logger.error(f"Failed to save Phase 2 step completion to database: {str(db_error)}")

        if needs_remedial:
            user_level = determine_phase2_user_level(total_score)
            return {
                "step_complete": True,
                "needs_remedial": True,
                "total_score": total_score,
                "threshold": PHASE_2_SUCCESS_THRESHOLD,
                "user_level": user_level,
                "next_action": "remedial_activities",
                "remedial_url": f"/app/phase2/remedial/{step_id}/{user_level}",
            }
        else:
            next_step = get_next_phase2_step(step_id)
            return {
                "step_complete": True,
                "needs_remedial": False,
                "total_score": total_score,
                "success": True,
                "next_action": "next_step" if next_step else "phase2_complete",
                "next_step": next_step,
                "next_url": f"/app/phase2/step/{next_step}" if next_step else "/app/phase2/complete",
            }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error checking step completion: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post('/phase2/submit-remedial')
async def submit_remedial_activity(request: Request, user: dict = Depends(get_current_user)):
    """Submit a remedial activity response."""
    try:
        data = await request.json()
        step_id = data.get('step_id')
        level = data.get('level')
        activity_id = data.get('activity_id')
        responses = data.get('responses', {})
        score = data.get('score', 0)
        is_skip = data.get('skip', False)

        logger.info(f"Remedial submission - Step: {step_id}, Level: {level}, Activity: {activity_id}, Skip: {is_skip}")

        if not all([step_id, level, activity_id]):
            raise HTTPException(status_code=400, detail="Missing required fields")

        remedial_activities = PHASE_2_REMEDIAL_ACTIVITIES.get(step_id, {}).get(level, [])
        if not remedial_activities:
            raise HTTPException(status_code=400, detail="No remedial activities found")

        current_activity = None
        activity_index = 0
        for i, activity in enumerate(remedial_activities):
            if activity['id'] == activity_id:
                current_activity = activity
                activity_index = i
                break
        if not current_activity:
            raise HTTPException(status_code=400, detail="Activity not found")

        user_id = user["user_id"]
        gs = get_game_session(user_id)

        # Initialize gamification XP service
        xp_data = None
        try:
            from services.xp_service import XPService
            xp_service = XPService(db_manager.get_connection())
        except Exception:
            xp_service = None

        # Create phase2_session_id if needed
        session_id = gs.get('phase2_session_id')
        if not session_id:
            session_id = str(uuid.uuid4())
            update_game_session(user_id, phase2_session_id=session_id)

        # Override score based on task type (skipped activities bypass scoring)
        task_type = current_activity.get('task_type') or current_activity.get('type', '')
        if not is_skip and task_type == 'dialogue_completion':
            correct, total = score_dialogue_completion(current_activity, responses)
            score = correct
            logger.info(f"Dialogue completion — exact match score: {score}/{total}")
        elif not is_skip and task_type in WRITING_TASK_TYPES:
            max_score_for_ai = current_activity.get('success_threshold', 6)
            ai_score = ai_score_writing(current_activity, responses, max_score_for_ai)
            if ai_score is not None:
                score = ai_score
                logger.info(f"Writing exercise — AI score used: {score}/{max_score_for_ai}")

        activity_data = {
            'activity_id': activity_id,
            'activity_index': activity_index,
            'responses': responses,
            'score': score,
            'max_score': current_activity.get('success_threshold', 6),
            'completed': False,
        }

        # Store remedial response in game session
        session_key = f"remedial_{step_id}_{level}_{activity_id}"
        p2_remedial = get_session_json(gs, 'phase2_remedial_responses', {})
        p2_remedial[session_key] = {
            'responses': responses,
            'score': score,
            'timestamp': datetime.now().isoformat(),
        }

        # Track progression per level
        p2_level_progress = get_session_json(gs, 'phase2_level_progress', {})
        progress_key = f"{step_id}_{level}"
        current_highest = p2_level_progress.get(progress_key, -1)
        if activity_index > current_highest:
            p2_level_progress[progress_key] = activity_index
            logger.info(f"Updated progress for {level}: highest completed activity = {activity_index}")

        update_game_session(user_id, phase2_remedial_responses=p2_remedial, phase2_level_progress=p2_level_progress)

        # Sequential level progression
        max_score = current_activity.get('success_threshold', 6)
        passing_threshold = max(1, round(max_score * 0.60))
        activity_passed = score >= passing_threshold

        logger.info(f"=== SEQUENTIAL PROGRESSION LOGIC ===")
        logger.info(f"Current: {level} Activity {activity_index}, Score: {score}/{max_score}, Passed: {activity_passed}")

        activity_data['completed'] = activity_passed
        activity_data['performance_level'] = level
        assessment_history.save_phase2_remedial(user_id, session_id, step_id, level, activity_data)

        current_level = get_current_level_for_step(user_id, gs, step_id, level)

        def update_remedial_resume_state(next_level, next_activity_index, status='in_progress'):
            try:
                sync_phase2_step_progress(
                    user_id,
                    session_id,
                    step_id,
                    needs_remedial=(status != 'completed'),
                    remedial_level=next_level if status != 'completed' else current_level,
                    remedial_progress={
                        'status': status,
                        'level': next_level,
                        'activity_index': next_activity_index,
                    } if status != 'completed' else {
                        'status': 'completed',
                        'level': next_level,
                        'activity_index': None,
                    },
                )
            except Exception as db_error:
                logger.error(f"Failed to sync Phase 2 remedial resume state for user {user_id}: {str(db_error)}")

        next_activity_index = activity_index + 1
        is_last_activity_in_level = activity_index >= len(remedial_activities) - 1

        # Case 1: Score too low -> Retry
        retryable = task_type not in WRITING_TASK_TYPES
        if not activity_passed:
            update_remedial_resume_state(current_level, activity_index)
            return {
                "success": False,
                "activity_passed": False,
                "retryable": retryable,
                "score": score,
                "threshold": max_score,
                "passing_score": passing_threshold,
                "message": f"You scored {score}/{max_score}. You need at least {passing_threshold} to pass.",
                "next_action": "retry",
                "next_url": f"/app/phase2/remedial/{step_id}/{current_level}?activity={activity_index}",
            }

        # Activity passed - mark completed
        gs = get_game_session(user_id)  # Refresh
        # When skipping last activity, force-mark all activities in this level as done
        # so check_level_completion returns True regardless of session state
        if is_skip and is_last_activity_in_level:
            for i in range(len(remedial_activities)):
                gs = mark_activity_completed(user_id, gs, step_id, level, i)
            current_level = level  # ensure current_level matches submitted level
            set_current_level_for_step(user_id, gs, step_id, level)
        else:
            gs = mark_activity_completed(user_id, gs, step_id, current_level, activity_index)

        # Award XP
        try:
            if xp_service:
                is_perfect = score >= max_score
                activity_type = f"remedial_{current_level}_completed"
                xp_result = xp_service.award_activity_xp(
                    user_id=user_id,
                    activity_type=activity_type,
                    activity_id=f"{step_id}_{activity_id}",
                    is_perfect=is_perfect,
                    is_first_try=activity_index == 0,
                    speed_bonus=False,
                )
                xp_data = {
                    "xp_awarded": xp_result.get("total_xp_awarded", 0),
                    "level_up": xp_result.get("progression", {}).get("leveled_up", False),
                    "new_level": xp_result.get("progression", {}).get("current_level", 1),
                    "total_xp": xp_result.get("progression", {}).get("total_xp", 0),
                }
                logger.info(f"Awarded {xp_data['xp_awarded']} XP for {activity_type} (perfect: {is_perfect})")
        except Exception as xp_error:
            logger.error(f"Failed to award XP for remedial activity: {str(xp_error)}")
            xp_data = {"xp_awarded": 0, "level_up": False}

        if not xp_data:
            xp_data = {"xp_awarded": 0, "level_up": False}

        # Case 2: Not last activity -> next activity in same level
        if not is_last_activity_in_level:
            gs = get_game_session(user_id)
            lc = get_session_json(gs, 'phase2_level_completed', {})
            completed_count = len(lc.get(f"{step_id}_{current_level}_completed", []))
            update_remedial_resume_state(current_level, next_activity_index)

            resp = {
                "success": True,
                "activity_passed": True,
                "remedial_complete": False,
                "score": score,
                "threshold": max_score,
                "passing_score": passing_threshold,
                "message": f"Great! Let's continue with {current_level} exercise {next_activity_index + 1} of {len(remedial_activities)}.",
                "next_action": "next_activity",
                "next_url": f"/app/phase2/remedial/{step_id}/{current_level}?activity={next_activity_index}",
                "progress_update": f"Completed {completed_count}/{len(remedial_activities)} exercises in {current_level} level",
                "current_level": current_level,
                "level_progress": f"{completed_count}/{len(remedial_activities)}",
            }
            if xp_data:
                resp["xp_data"] = xp_data
            return resp

        # Case 3: Last activity in level AND passed -> Check overall performance
        gs = get_game_session(user_id)
        p2_remedial = get_session_json(gs, 'phase2_remedial_responses', {})
        overall_score = 0
        overall_max_score = 0
        for i, activity in enumerate(remedial_activities):
            activity_key = f"remedial_{step_id}_{level}_{activity['id']}"
            saved_response = p2_remedial.get(activity_key, {})
            activity_score = saved_response.get('score', 0)
            activity_max = activity.get('success_threshold', 6)
            overall_score += activity_score
            overall_max_score += activity_max
            logger.info(f"Activity {i}: Score {activity_score}/{activity_max}")

        overall_percentage = (overall_score / overall_max_score * 100) if overall_max_score > 0 else 0
        logger.info(f"Overall performance: {overall_score}/{overall_max_score} ({overall_percentage:.1f}%)")

        # Check revisit warning (skipped activities bypass this entirely)
        remedial_completed_data = get_session_json(gs, 'remedial_completed', {})
        revisit_warning_key = f"revisit_warning_{step_id}_{level}"
        has_been_warned = remedial_completed_data.get(revisit_warning_key, False)

        if not is_skip and overall_percentage < 50 and not has_been_warned:
            remedial_completed_data[revisit_warning_key] = True
            update_game_session(user_id, remedial_completed=remedial_completed_data)
            update_remedial_resume_state(current_level, 0)

            return {
                "success": True,
                "activity_passed": True,
                "overall_performance_low": True,
                "score": score,
                "threshold": max_score,
                "overall_score": overall_score,
                "overall_max_score": overall_max_score,
                "overall_percentage": round(overall_percentage, 1),
                "message": f"You've completed all activities, but your overall score is {overall_score}/{overall_max_score} ({overall_percentage:.0f}%). You need to revisit the activities where you made the most mistakes to improve.",
                "next_action": "revisit_activities",
                "next_url": f"/app/phase2/remedial/{step_id}/{current_level}?activity=0",
                "recommendation": "Review activities 0-3 and try to improve your answers. Aim for at least 50% overall to progress.",
                "xp_data": xp_data,
            }

        if overall_percentage < 50 and has_been_warned:
            logger.info("User already warned about low performance, allowing progression")
            remedial_completed_data[revisit_warning_key] = False
            update_game_session(user_id, remedial_completed=remedial_completed_data)

        # Check all activities for completion
        logger.info(f"=== CHECKING ALL ACTIVITIES FOR {step_id}/{level} ===")
        db_progress = assessment_history.get_phase2_progress(user_id) if user_id else {'remedial_activities': []}

        for i, activity in enumerate(remedial_activities):
            activity_key = f"remedial_{step_id}_{level}_{activity['id']}"
            act_id = activity['id']
            saved_response = p2_remedial.get(activity_key, {})
            activity_score = saved_response.get('score', 0)
            if activity_score == 0:
                for db_activity in db_progress.get('remedial_activities', []):
                    if (db_activity.get('step_id') == step_id and
                        db_activity.get('level') == level and
                        db_activity.get('activity_id') == act_id):
                        activity_score = db_activity.get('score', 0)
                        logger.info(f"  Found score in database: {activity_score}")
                        break
            activity_threshold = activity.get('success_threshold', 6)
            activity_passing = int(activity_threshold * 0.50)
            logger.info(f"Activity {i} ({act_id}): score={activity_score}, threshold={activity_threshold}, passing={activity_passing}")
            if activity_score >= activity_passing:
                gs = get_game_session(user_id)
                gs = mark_activity_completed(user_id, gs, step_id, current_level, i)
                logger.info(f"  -> Activity {i} PASSED and marked as completed")
            else:
                logger.info(f"  -> Activity {i} NOT PASSED")

        gs = get_game_session(user_id)
        level_complete = check_level_completion(gs, step_id, current_level)
        logger.info(f"Final level completion for {step_id}/{current_level}: {level_complete}")

        if level_complete:
            next_level = get_next_remedial_level(current_level)
            if next_level:
                next_level_activities = PHASE_2_REMEDIAL_ACTIVITIES.get(step_id, {}).get(next_level, [])
                if next_level_activities:
                    set_current_level_for_step(user_id, gs, step_id, next_level)
                    update_remedial_resume_state(next_level, 0)
                    return {
                        "success": True,
                        "activity_passed": True,
                        "level_complete": True,
                        "remedial_complete": False,
                        "score": score,
                        "threshold": max_score,
                        "passing_score": passing_threshold,
                        "message": f"Excellent! You've completed all {current_level} exercises. Moving to {next_level} level!",
                        "next_action": "level_advance",
                        "next_url": f"/app/phase2/remedial/{step_id}/{next_level}?activity=0",
                        "previous_level": current_level,
                        "current_level": next_level,
                        "celebration": True,
                        "progress_update": f"Advanced from {current_level} to {next_level}",
                        "xp_data": xp_data,
                    }

            # All remedial levels complete
            remedial_completed_data = get_session_json(gs, 'remedial_completed', {})
            remedial_completed_data[f'remedial_completed_{step_id}'] = True
            update_game_session(user_id, remedial_completed=remedial_completed_data)

            next_step = get_next_phase2_step(step_id)
            if next_step:
                next_url = f"/app/phase2/step/{next_step}"
                message = f"Outstanding! You've completed all remedial levels ({current_level} was the last). Moving to the next step!"
                next_action = "next_step"
            else:
                next_url = "/app/phase2/complete"
                message = "Congratulations! You've completed all remedial activities and Phase 2!"
                next_action = "phase2_complete"

            update_remedial_resume_state(current_level, None, status='completed')

            return {
                "success": True,
                "activity_passed": True,
                "level_complete": True,
                "remedial_complete": True,
                "score": score,
                "threshold": max_score,
                "passing_score": passing_threshold,
                "message": message,
                "next_action": next_action,
                "next_url": next_url,
                "celebration": True,
                "step_completed": True,
                "final_level": current_level,
                "xp_data": xp_data,
                "all_levels_complete": True,
            }

        # Fallback
        logger.error(f"FALLBACK HIT! level_complete was False for {step_id}/{current_level}")
        update_remedial_resume_state(current_level, activity_index)
        return {
            "success": True,
            "activity_passed": True,
            "score": score,
            "message": "Activity completed. Please refresh the page.",
            "next_action": "refresh",
            "next_url": f"/app/phase2/remedial/{step_id}/{current_level}",
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in remedial activity submission: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get('/phase2/get-remedial-state')
async def get_remedial_state(request: Request, user: dict = Depends(get_current_user)):
    """Get current state of remedial activities."""
    try:
        step_id = request.query_params.get('step_id')
        level = request.query_params.get('level')
        activity_param = request.query_params.get('activity', '0')

        if not step_id or not level:
            raise HTTPException(status_code=400, detail="Missing step_id or level")

        remedial_activities = PHASE_2_REMEDIAL_ACTIVITIES.get(step_id, {}).get(level, [])
        if not remedial_activities:
            raise HTTPException(status_code=400, detail="No remedial activities found")

        try:
            current_activity_index = int(activity_param)
        except (ValueError, TypeError):
            current_activity_index = 0

        if current_activity_index >= len(remedial_activities) or current_activity_index < 0:
            current_activity_index = 0

        user_id = user["user_id"]
        gs = get_game_session(user_id)
        p2_remedial = get_session_json(gs, 'phase2_remedial_responses', {})

        completed_activities = []
        for i, activity in enumerate(remedial_activities):
            sk = f"remedial_{step_id}_{level}_{activity['id']}"
            if sk in p2_remedial:
                response_data = p2_remedial[sk]
                success_threshold = activity.get('success_threshold', 6)
                if response_data.get('score', 0) >= success_threshold:
                    completed_activities.append(i)

        # Auto-advance if no specific activity was requested
        if activity_param == '0' and current_activity_index in completed_activities:
            for i in range(current_activity_index + 1, len(remedial_activities)):
                if i not in completed_activities:
                    current_activity_index = i
                    break
            else:
                return {
                    "step_id": step_id,
                    "level": level,
                    "all_completed": True,
                    "message": "All remedial activities completed! Ready to return to main step.",
                    "next_action": "return_to_step",
                    "next_url": f"/app/phase2/step/{step_id}",
                }

        if current_activity_index >= len(remedial_activities):
            current_activity_index = len(remedial_activities) - 1

        current_activity = remedial_activities[current_activity_index]

        return {
            "step_id": step_id,
            "level": level,
            "current_activity_index": current_activity_index,
            "current_activity": current_activity,
            "total_activities": len(remedial_activities),
            "completed_activities": len(completed_activities),
            "all_completed": False,
            "progress_percentage": round((len(completed_activities) / len(remedial_activities)) * 100),
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting remedial state: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get('/phase2/check-remedial-completion')
async def check_remedial_completion(request: Request, user: dict = Depends(get_current_user)):
    """Check if remedial activities are completed and determine next action."""
    try:
        step_id = request.query_params.get('step_id')
        level = request.query_params.get('level')
        if not step_id or not level:
            raise HTTPException(status_code=400, detail="Missing step_id or level")

        user_id = user["user_id"]
        gs = get_game_session(user_id)
        remedial_completed_data = get_session_json(gs, 'remedial_completed', {})
        remedial_done = remedial_completed_data.get(f'remedial_completed_{step_id}', False)

        if remedial_done:
            next_step = get_next_phase2_step(step_id)
            if next_step:
                return {
                    "remedial_completed": True,
                    "next_action": "next_step",
                    "next_url": f"/app/phase2/step/{next_step}",
                    "next_step": next_step,
                    "message": "Remedials completed! Moving to next step.",
                }
            else:
                return {
                    "remedial_completed": True,
                    "next_action": "phase2_complete",
                    "next_url": "/app/phase2/complete",
                    "message": "Phase 2 completed!",
                }
        else:
            return {"remedial_completed": False, "message": "Remedials not yet completed."}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error checking remedial completion: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


# Alias route for template compatibility
@router.post('/submit-remedial-activity')
async def submit_remedial_activity_alias(request: Request, user: dict = Depends(get_current_user)):
    return await submit_remedial_activity(request, user)


@router.post('/phase2/get-ai-feedback')
async def get_phase2_ai_feedback(request: Request, user: dict = Depends(get_current_user)):
    """Get AI feedback specifically for Phase 2 responses."""
    try:
        data = await request.json()
        step_id = data.get('step_id')
        action_item_id = data.get('action_item_id')
        response_text = data.get('response', '')

        if not all([step_id, action_item_id, response_text]):
            raise HTTPException(status_code=400, detail="Missing required fields")

        step_data = PHASE_2_STEPS.get(step_id, {})
        action_items = step_data.get('action_items', [])

        action_item = None
        for item in action_items:
            if item['id'] == action_item_id:
                action_item = item
                break
        if not action_item:
            raise HTTPException(status_code=400, detail="Action item not found")

        is_ai, ai_score, ai_reasons = assessment_service.check_ai_response(response_text)
        assessment = assessment_service.assess_phase2_response(step_id, action_item_id, response_text)

        speaker = action_item.get('speaker', 'Ms. Mabrouki')
        character_info = NPCS.get(speaker, {})

        feedback_prompt = f"""
        As {speaker} ({character_info.get('role', 'Team Member')}), provide encouraging feedback on this Phase 2 response.

        Character personality: {character_info.get('personality', 'Helpful and supportive')}

        Student's response to: "{action_item['question']}"
        Response: "{response_text}"

        Assessment level: {assessment.get('level', 'B1')}
        Assessment points: {assessment.get('points', 1)}/4

        {"Note: This response shows characteristics of AI-generated content. " if is_ai else ""}

        Give feedback that:
        1. Stays in character as {speaker}
        2. Is encouraging and team-focused
        3. Acknowledges strengths from the assessment
        4. Provides one specific suggestion for improvement
        5. Relates to the cultural event planning context
        6. Is 2-3 sentences maximum
        7. Uses formal English (no contractions)

        Example tone: "Great teamwork spirit! Your suggestion shows good understanding of our cultural goals. Try adding more specific details about how this would benefit our Tunisian event."
        """

        ai_feedback = ai_service.get_ai_response(feedback_prompt, speaker)

        return {
            "success": True,
            "feedback": ai_feedback,
            "assessment": {
                "level": assessment.get('level'),
                "points": assessment.get('points'),
                "strengths": assessment.get('strengths', []),
                "improvements": assessment.get('improvements', []),
            },
            "ai_detection": {
                "is_ai": is_ai,
                "score": ai_score,
                "reasons": ai_reasons[:3] if ai_reasons else [],
            },
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting Phase 2 AI feedback: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post('/phase2/generate-character-audio')
async def generate_character_audio(request: Request, user: dict = Depends(get_current_user)):
    """Generate audio for character dialogue in Phase 2."""
    try:
        data = await request.json()
        text = data.get('text', '')
        character = data.get('character', 'Ms. Mabrouki')
        step_id = data.get('step_id', '')
        action_item_id = data.get('action_item_id', '')

        if not text:
            raise HTTPException(status_code=400, detail="No text provided")

        character_voices = {
            'Ms. Mabrouki': 'en-US-AriaNeural',
            'SKANDER': 'en-US-ChristopherNeural',
            'Emna': 'en-US-JennyNeural',
            'Ryan': 'en-US-GuyNeural',
            'Lilia': 'en-US-AmberNeural',
        }
        voice = character_voices.get(character, 'en-US-AriaNeural')
        filename = f'phase2_{step_id}_{action_item_id}_{character.lower()}_{int(datetime.now().timestamp())}.mp3'
        audio_url = audio_service.generate_custom_audio(text, filename, voice)

        return {"success": True, "audio_url": audio_url, "character": character, "filename": filename}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating character audio: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get('/phase2/get-step-progress')
async def get_phase2_step_progress(request: Request, user: dict = Depends(get_current_user)):
    """Get current progress for a Phase 2 step."""
    try:
        step_id = request.query_params.get('step_id')
        if step_id not in PHASE_2_STEPS:
            raise HTTPException(status_code=400, detail="Invalid step ID")

        step_data = PHASE_2_STEPS[step_id]
        action_items = step_data['action_items']

        user_id = user["user_id"]
        gs = get_game_session(user_id)
        p2_assessments = get_session_json(gs, 'phase2_assessments', {})

        completed_count = 0
        total_score = 0
        item_scores = []

        for item in action_items:
            sk = f"phase2_{step_id}_{item['id']}"
            if sk in p2_assessments:
                completed_count += 1
                asmt = p2_assessments[sk]
                points = asmt.get('points', 1)
                total_score += points
                item_scores.append({'id': item['id'], 'level': asmt.get('level'), 'points': points, 'completed': True})
            else:
                item_scores.append({'id': item['id'], 'completed': False})

        return {
            "step_id": step_id,
            "total_items": len(action_items),
            "completed_items": completed_count,
            "total_score": total_score,
            "threshold": PHASE_2_SUCCESS_THRESHOLD,
            "progress_percentage": round((completed_count / len(action_items)) * 100),
            "item_scores": item_scores,
            "step_complete": completed_count >= len(action_items),
            "needs_remedial": completed_count >= len(action_items) and total_score < PHASE_2_SUCCESS_THRESHOLD,
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting step progress: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post('/phase2/reset-step')
async def reset_phase2_step(request: Request, user: dict = Depends(get_current_user)):
    """Reset a Phase 2 step (for testing or retrying)."""
    try:
        data = await request.json()
        step_id = data.get('step_id')
        if step_id not in PHASE_2_STEPS:
            raise HTTPException(status_code=400, detail="Invalid step ID")

        user_id = user["user_id"]
        gs = get_game_session(user_id)

        p2_responses = get_session_json(gs, 'phase2_responses', {})
        p2_assessments = get_session_json(gs, 'phase2_assessments', {})

        keys_to_remove_r = [k for k in p2_responses if k.startswith(f"phase2_{step_id}_")]
        for k in keys_to_remove_r:
            del p2_responses[k]

        keys_to_remove_a = [k for k in p2_assessments if k.startswith(f"phase2_{step_id}_")]
        for k in keys_to_remove_a:
            del p2_assessments[k]

        update_game_session(user_id, phase2_responses=p2_responses, phase2_assessments=p2_assessments)

        return {"success": True, "message": f"Step {step_id} has been reset"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error resetting step: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get('/phase2/step')
async def get_phase2_step_metadata(request: Request, user: dict = Depends(get_current_user)):
    """Get metadata for a Phase 2 step, including action items."""
    try:
        step_id = request.query_params.get('step_id')
        if step_id not in PHASE_2_STEPS:
            raise HTTPException(status_code=400, detail="Invalid step ID")

        step = PHASE_2_STEPS[step_id]
        user_id = user["user_id"]
        gs = get_game_session(user_id)

        # Initialize step progress in database if needed
        try:
            phase2_session_id = gs.get('phase2_session_id')
            if not phase2_session_id:
                phase2_session_id = str(uuid.uuid4())
                update_game_session(user_id, phase2_session_id=phase2_session_id)

            existing_progress = assessment_history.get_phase2_progress(user_id)
            step_exists = any(s.get('step_id') == step_id for s in existing_progress.get('steps', []))
            if not step_exists:
                progress_data = {
                    'current_item': 0,
                    'total_items': len(step.get('action_items', [])),
                    'step_score': 0,
                    'step_completed': False,
                    'needs_remedial': False,
                    'started_at': datetime.now().isoformat(),
                }
                assessment_history.save_phase2_progress(user_id, phase2_session_id, step_id, progress_data)
                logger.info(f"Phase 2 step {step_id} initialized for user {user_id}")
        except Exception as db_error:
            logger.error(f"Failed to initialize Phase 2 step progress: {str(db_error)}")

        action_items = []
        for item in step.get('action_items', []):
            action_items.append({
                'id': item.get('id'),
                'speaker': item.get('speaker'),
                'question': item.get('question'),
                'instruction': item.get('instruction'),
                'hint': item.get('hint'),
                'audio_text': item.get('audio_text'),
            })

        return {
            'step_id': step_id,
            'title': step.get('title'),
            'description': step.get('description'),
            'scenario': step.get('scenario'),
            'action_items': action_items,
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting phase2 step metadata: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get('/phase2/overall')
async def api_phase2_overall(user: dict = Depends(get_current_user)):
    try:
        user_id = user["user_id"]
        gs = get_game_session(user_id)
        data = get_phase2_overall_assessment(gs)
        if not data:
            raise HTTPException(status_code=404, detail="No Phase 2 data")
        return data
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting phase2 overall: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


def _sanitize_remedial_activity(activity, player_name="Player"):
    """Convert new JSON format to old format for backward compatibility."""
    task_type = activity.get('task_type') or activity.get('type', 'fill_gaps')
    matching_items = activity.get('matching_items')
    sentences = activity.get('sentences')
    word_bank = activity.get('word_bank', [])

    if task_type == 'drag_and_drop' and activity.get('pairs'):
        task_type = 'matching'
        matching_items = {pair['term']: pair['definition'] for pair in activity['pairs']}

    if task_type == 'gap_fill' and activity.get('templates'):
        task_type = 'fill_gaps'
        sentences = []
        templates = activity.get('templates', [])
        correct_answers = activity.get('correct_answers', [])
        for i, template in enumerate(templates):
            blank_count = template.count('___')
            blanks = []
            if i < len(correct_answers):
                answer_parts = correct_answers[i].split()
                template_parts = template.replace('___', '').split()
                blanks = [part for part in answer_parts if part not in template_parts]
            sentences.append({'text': template, 'blanks': blanks[:blank_count] if blanks else [''] * blank_count})

    if task_type == 'writing' and activity.get('templates'):
        templates = activity.get('templates', [])
        clean_templates = []
        for template in templates:
            clean = template
            if '. ' in template and template[0].isdigit():
                clean = template.split('. ', 1)[1] if len(template.split('. ', 1)) > 1 else template
            clean_templates.append(clean)
        activity['templates'] = clean_templates

    dialogue = activity.get('dialogue')
    if task_type == 'dialogue_completion' and activity.get('dialogue_lines'):
        dialogue = []
        correct_answers = activity.get('correct_answers', [])
        answer_index = 0
        for line in activity.get('dialogue_lines', []):
            if 'template' in line:
                template = line.get('template', '')
                blank_count = len(re.findall(r'_{3,}', template))
                blanks = []
                if answer_index < len(correct_answers):
                    answer_text = correct_answers[answer_index]
                    if answer_text and '. ' in answer_text:
                        answer_text = answer_text.split('. ', 1)[1] if len(answer_text.split('. ', 1)) > 1 else answer_text
                    answer_parts = answer_text.split() if answer_text else []
                    template_parts = re.sub(r'_{3,}', '', template).split()
                    blanks = [part for part in answer_parts if part not in template_parts]
                    answer_index += 1
                while len(blanks) < blank_count:
                    blanks.append('')
                dialogue.append({'type': 'user_input', 'speaker': line.get('speaker', 'You'), 'text': template, 'blanks': blanks[:blank_count]})
            else:
                dialogue.append({'type': 'character', 'speaker': line.get('speaker', ''), 'text': line.get('text', '')})
        activity['dialogue'] = dialogue

    return {
        'id': activity.get('id'),
        'title': activity.get('title', 'Practice Activity'),
        'speaker': activity.get('speaker', 'Mentor'),
        'instruction': activity.get('instruction', ''),
        'task_type': task_type,
        'matching_items': matching_items,
        'pairs': activity.get('pairs', []),
        'sentences': sentences,
        'dialogue': dialogue,
        'templates': activity.get('templates'),
        'word_bank': word_bank,
        'correct_answers': activity.get('correct_answers', []),
        'guided_questions': activity.get('guided_questions', []),
        'audio_text': activity.get('audio_text'),
        'audio_content': activity.get('audio_content'),
        'success_threshold': activity.get('success_threshold', 6),
        'expected_answers': activity.get('expected_answers', []),
        'success_feedback': replace_player_placeholders(activity.get('success_feedback'), player_name),
        'remedial_feedback': replace_player_placeholders(activity.get('remedial_feedback'), player_name),
        'expansion_exercises': activity.get('expansion_exercises'),
        'research_prompts': activity.get('research_prompts'),
        'planning_template': activity.get('planning_template'),
        'negotiation_dialogue': activity.get('negotiation_dialogue'),
        'report_template': activity.get('report_template'),
        'reflection_prompts': activity.get('reflection_prompts'),
        'proposal_framework': activity.get('proposal_framework'),
        'story_template': activity.get('story_template'),
        'story_framework': activity.get('story_framework'),
        'proposal_template': activity.get('proposal_template'),
        'writing_prompts': activity.get('writing_prompts'),
        'expansion_items': activity.get('expansion_items'),
        'listening_items': activity.get('listening_items'),
        'priority_template': activity.get('priority_template'),
        'planning_items': activity.get('planning_items'),
        'strategic_template': activity.get('strategic_template'),
        'analysis_template': activity.get('analysis_template'),
        'negotiation_items': activity.get('negotiation_items'),
        'roleplay_items': activity.get('roleplay_items'),
        'priority_items': activity.get('priority_items'),
        'strategic_items': activity.get('strategic_items'),
        'proposal_items': activity.get('proposal_items'),
        'analysis_items': activity.get('analysis_items'),
        'dialogue_lines': activity.get('dialogue_lines'),
    }


@router.get('/phase2/remedial')
async def get_phase2_remedial(request: Request, user: dict = Depends(get_current_user)):
    """Return remedial activities for a step/level with current index."""
    try:
        step_id = request.query_params.get('step_id')
        level = request.query_params.get('level')
        try_index_str = request.query_params.get('activity')
        try_index = int(try_index_str) if try_index_str is not None else None

        if not step_id or not level:
            raise HTTPException(status_code=400, detail="Missing step_id or level")

        activities = PHASE_2_REMEDIAL_ACTIVITIES.get(step_id, {}).get(level, [])
        if not activities:
            raise HTTPException(status_code=404, detail="No remedial activities found")

        user_id = user["user_id"]
        p = assessment_history.get_phase2_progress(user_id)
        completed_indices = []
        for ra in p.get('remedial_activities', []):
            if ra.get('step_id') == step_id and ra.get('level') == level and ra.get('completed'):
                completed_indices.append(ra.get('activity_index', 0))

        logger.info(f"Remedial progress for {step_id}/{level}: completed_indices={completed_indices}, try_index={try_index}")

        if try_index is not None:
            current_index = try_index
        else:
            current_index = 0
            for i in range(len(activities)):
                if i not in completed_indices:
                    current_index = i
                    break

        if current_index >= len(activities):
            current_index = 0

        logger.info(f"Final current_index for {step_id}/{level}: {current_index}")

        gs = get_game_session(user_id)
        player_name = gs.get('player_name') or user.get('first_name') or user.get('username', 'Player')

        activities_meta = [
            {'id': act.get('id'), 'title': act.get('title', f'Activity {i+1}'), 'index': i}
            for i, act in enumerate(activities)
        ]

        # Get saved responses from database
        current_activity_id = activities[current_index].get('id')
        saved_responses = {}
        try:
            progress = assessment_history.get_phase2_progress(user_id)
            for rem_activity in progress.get('remedial_activities', []):
                if (rem_activity.get('step_id') == step_id and
                    rem_activity.get('level') == level and
                    rem_activity.get('activity_id') == current_activity_id):
                    saved_responses = rem_activity.get('responses', {})
                    logger.info(f"Loaded saved responses for {current_activity_id}: {len(saved_responses)} answers")
                    break
        except Exception as e:
            logger.error(f"Error loading saved responses: {str(e)}")

        return {
            'step_id': step_id,
            'level': level,
            'current_index': current_index,
            'total': len(activities),
            'activity': _sanitize_remedial_activity(activities[current_index], player_name),
            'completed_indices': completed_indices,
            'activities_meta': activities_meta,
            'saved_responses': saved_responses,
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting remedial data: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get('/phase2/step-results')
async def get_phase2_step_results(request: Request, user: dict = Depends(get_current_user)):
    """Summarize a Phase 2 step outcome (success or remedial path)."""
    try:
        step_id = request.query_params.get('step_id')
        if step_id not in PHASE_2_STEPS:
            raise HTTPException(status_code=400, detail="Invalid step ID")

        step = PHASE_2_STEPS[step_id]
        total_items = len(step.get('action_items', []))

        user_id = user["user_id"]
        gs = get_game_session(user_id)
        p2_assessments = get_session_json(gs, 'phase2_assessments', {})
        player_name = gs.get('player_name') or user.get('first_name') or user.get('username', 'Player')

        total_score = 0
        completed_items = 0
        for item in step.get('action_items', []):
            key = f"phase2_{step_id}_{item['id']}"
            if key in p2_assessments:
                completed_items += 1
                pts = p2_assessments[key].get('points', 1)
                total_score += pts

        success_threshold = PHASE_2_SUCCESS_THRESHOLD
        success = completed_items >= total_items and total_score >= success_threshold

        result = {
            'step_id': step_id,
            'title': step.get('title'),
            'description': step.get('description'),
            'total_score': total_score,
            'success_threshold': success_threshold,
            'completed_items': completed_items,
            'total_items': total_items,
            'success': success,
        }

        if success:
            next_step = get_next_phase2_step(step_id)
            result.update({
                'next_step': next_step,
                'next_step_title': PHASE_2_STEPS[next_step]['title'] if next_step else 'Phase 2 Complete',
                'success_feedback': replace_player_placeholders(step.get('success_feedback'), player_name),
            })
        else:
            user_level = determine_phase2_user_level(total_score)
            result.update({
                'needs_remedial': True,
                'user_level': user_level,
                'remedial_feedback': replace_player_placeholders(step.get('remedial_feedback'), player_name),
            })

        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting phase2 step results: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post('/phase2/remedial/feedback')
async def get_phase2_remedial_feedback(request: Request, user: dict = Depends(get_current_user)):
    """Generate character-style feedback for a remedial activity performance."""
    try:
        data = await request.json()
        step_id = data.get('step_id')
        level = data.get('level')
        activity_id = data.get('activity_id')
        score = data.get('score', 0)

        if step_id not in PHASE_2_STEPS:
            raise HTTPException(status_code=400, detail="Invalid step ID")

        activities = PHASE_2_REMEDIAL_ACTIVITIES.get(step_id, {}).get(level, [])
        activity = next((a for a in activities if a.get('id') == activity_id), None)
        speaker = (activity or {}).get('speaker', 'Ms. Mabrouki')

        prompt = f"""
        As {speaker}, provide encouraging, concise feedback (2 sentences) on a student's practice activity.
        The student scored {score} on a remedial activity for {step_id.replace('_',' ')} at level {level}.
        Acknowledge effort, suggest one clear next improvement, and keep a supportive tone.
        """
        feedback_text = ai_service.get_ai_response(prompt, speaker)
        return {'feedback': feedback_text or 'Great effort--keep going! Focus on one detail to improve next time.'}
    except Exception as e:
        logger.error(f"Error generating remedial feedback: {str(e)}")
        return {"feedback": "Great effort--keep going! Focus on one detail to improve next time."}


# ======================================================================
# Dashboard endpoint
# ======================================================================

@router.get('/dashboard')
async def get_dashboard_data(user: dict = Depends(get_current_user)):
    """Return JSON data for the dashboard view."""
    try:
        user_id = user["user_id"]
        user_data = user_manager.get_user_by_id(user_id) or {}
        user_stats = assessment_history.get_user_stats(user_id) or {}
        recent_assessments = assessment_history.get_user_assessments(user_id, limit=5) or []
        phase2_progress = assessment_history.get_phase2_progress(user_id) or {}

        # Get Phase 5 progress
        phase5_progress = {'subphase1': {}, 'subphase2': {}}
        try:
            conn = assessment_history.db.get_connection()
            rows = conn.execute('''
                SELECT step_id, total_score, completed, remedial_level
                FROM phase5_progress WHERE user_id = ? AND subphase = 1 ORDER BY step_id
            ''', (user_id,)).fetchall()
            for row in rows:
                r = dict(row)
                phase5_progress['subphase1'][str(r['step_id'])] = r
            rows = conn.execute('''
                SELECT step_id, total_score, completed, remedial_level
                FROM phase5_progress WHERE user_id = ? AND subphase = 2 ORDER BY step_id
            ''', (user_id,)).fetchall()
            for row in rows:
                r = dict(row)
                phase5_progress['subphase2'][str(r['step_id'])] = r
            conn.close()
        except Exception as e:
            logger.error(f"Error getting Phase 5 progress: {e}")

        # Get Phase 6 progress
        phase6_progress = {'subphase1': {}, 'subphase2': {}}
        try:
            conn6 = assessment_history.db.get_connection()
            for sp in [1, 2]:
                rows6 = conn6.execute('''
                    SELECT step_id, total_score, completed, remedial_level
                    FROM phase6_progress WHERE user_id = ? AND subphase = ? ORDER BY step_id
                ''', (user_id, sp)).fetchall()
                key = f'subphase{sp}'
                for row in rows6:
                    r = dict(row)
                    phase6_progress[key][str(r['step_id'])] = r
            conn6.close()
        except Exception as e:
            logger.error(f"Error getting Phase 6 progress: {e}")

        # Get Phase 3 & 4 progress from student_progress table
        phase3_progress = None
        phase4_progress = None
        try:
            conn34 = sqlite3.connect('fardi.db')
            conn34.row_factory = sqlite3.Row
            for ph in [3, 4]:
                row = conn34.execute(
                    'SELECT phase, subphase, step, interaction, item_index, context, is_complete FROM student_progress WHERE user_id = ? AND phase = ?',
                    (user_id, ph)
                ).fetchone()
                if row:
                    d = dict(row)
                    # Count total responses for this phase
                    count = conn34.execute(
                        'SELECT COUNT(*) as cnt FROM student_responses WHERE user_id = ? AND phase = ?',
                        (user_id, ph)
                    ).fetchone()
                    d['total_responses'] = count['cnt'] if count else 0
                    if ph == 3:
                        phase3_progress = d
                    else:
                        phase4_progress = d
            conn34.close()
        except Exception as e:
            logger.error(f"Error getting Phase 3/4 progress: {e}")

        return {
            'user': user_data,
            'user_stats': user_stats,
            'recent_assessments': recent_assessments,
            'phase2_progress': phase2_progress,
            'phase3_progress': phase3_progress,
            'phase4_progress': phase4_progress,
            'phase5_progress': phase5_progress,
            'phase6_progress': phase6_progress,
        }
    except Exception as e:
        logger.error(f"Error building dashboard data: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post('/phase/complete')
async def mark_phase_complete(request: Request, user: dict = Depends(get_current_user)):
    """Mark a phase as completed."""
    try:
        user_id = user["user_id"]
        data = await request.json()
        phase_number = data.get('phase_number')
        overall_score = data.get('overall_score', 0)
        final_level = data.get('final_level', '')

        if not phase_number or phase_number not in [1, 2, 4, 5]:
            raise HTTPException(status_code=400, detail="Invalid phase number")

        assessment_history.update_phase_completion(user_id, phase_number, {
            'completed': True,
            'completion_date': datetime.now().isoformat(),
            'overall_score': overall_score,
            'final_level': final_level,
            'time_spent': data.get('time_spent', 0),
        })

        return {"success": True, "message": f"Phase {phase_number} marked as complete"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error marking phase complete: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


# ======================================================================
# Admin API endpoints (from app.py)
# ======================================================================

def _get_admin_statistics():
    """Get comprehensive admin statistics."""
    try:
        conn = db_manager.get_connection()
        total_users = conn.execute('SELECT COUNT(*) as count FROM users').fetchone()['count']
        total_assessments = conn.execute('SELECT COUNT(*) as count FROM assessment_results').fetchone()['count']
        total_phase2_sessions = conn.execute('SELECT COUNT(DISTINCT user_id) as count FROM phase2_responses').fetchone()['count']
        avg_xp = 0
        assessment_stats = []
        recent_activity = conn.execute('''
            SELECT 'registration' as type, first_name, username, 'N/A' as level,
                   0 as points, created_at as timestamp
            FROM users ORDER BY created_at DESC LIMIT 10
        ''').fetchall()
        conn.close()
        return {
            'overall': {
                'total_users': total_users,
                'total_assessments': total_assessments,
                'total_phase2_sessions': total_phase2_sessions,
                'avg_xp': avg_xp,
            },
            'assessment_stats': [dict(row) for row in assessment_stats],
            'recent_activity': [dict(row) for row in recent_activity],
        }
    except Exception as e:
        logger.error(f"Error getting admin statistics: {e}")
        return {
            'overall': {'total_users': 0, 'total_assessments': 0, 'total_phase2_sessions': 0, 'avg_xp': 0},
            'assessment_stats': [],
            'recent_activity': [],
        }


def _get_users_with_stats(page=1, per_page=20, search='', role_filter=''):
    """Get users with their stats and pagination."""
    try:
        conn = db_manager.get_connection()
        conditions = []
        params = []
        if search:
            conditions.append('(u.username LIKE ? OR u.email LIKE ? OR u.first_name LIKE ? OR u.last_name LIKE ?)')
            search_term = f'%{search}%'
            params.extend([search_term] * 4)
        if role_filter:
            conditions.append('u.role = ?')
            params.append(role_filter)
        where_clause = ' WHERE ' + ' AND '.join(conditions) if conditions else ''
        total = conn.execute(f'SELECT COUNT(*) as count FROM users u{where_clause}', params).fetchone()['count']
        offset = (page - 1) * per_page
        query = f'''
            SELECT u.*,
                   COALESCE(ar.total_assessments, 0) as total_assessments,
                   COALESCE(ar.latest_level, 'N/A') as best_level,
                   COALESCE(ar.total_xp, 0) as total_xp,
                   COALESCE(p2.steps_attempted, 0) as phase2_steps_attempted,
                   COALESCE(p2.steps_completed, 0) as phase2_steps_completed
            FROM users u
            LEFT JOIN (
                SELECT ar1.user_id,
                       COUNT(*) as total_assessments,
                       ar2.overall_level as latest_level,
                       SUM(ar1.xp_earned) as total_xp
                FROM assessment_results ar1
                LEFT JOIN (
                    SELECT user_id, overall_level,
                           ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY completed_at DESC) as rn
                    FROM assessment_results
                ) ar2 ON ar1.user_id = ar2.user_id AND ar2.rn = 1
                GROUP BY ar1.user_id, ar2.overall_level
            ) ar ON u.id = ar.user_id
            LEFT JOIN (
                SELECT user_id,
                       COUNT(DISTINCT step_id) as steps_attempted,
                       COUNT(DISTINCT CASE WHEN step_completed = 1 THEN step_id END) as steps_completed
                FROM phase2_progress GROUP BY user_id
            ) p2 ON u.id = p2.user_id
            {where_clause}
            ORDER BY u.created_at DESC
            LIMIT ? OFFSET ?
        '''
        params.extend([per_page, offset])
        users = conn.execute(query, params).fetchall()
        conn.close()
        pagination = {
            'page': page, 'per_page': per_page, 'total': total,
            'pages': (total + per_page - 1) // per_page,
            'has_prev': page > 1,
            'has_next': page * per_page < total,
            'prev_num': page - 1 if page > 1 else None,
            'next_num': page + 1 if page * per_page < total else None,
        }
        pagination['iter_pages'] = list(range(max(1, page - 2), min(pagination['pages'] + 1, page + 3)))
        return [dict(row) for row in users], pagination
    except Exception as e:
        logger.error(f"Error getting users with stats: {e}")
        return [], {'page': 1, 'pages': 1, 'total': 0, 'has_prev': False, 'has_next': False}


def _get_count(query_template, period):
    """Generic count helper for admin metrics."""
    try:
        conn = db_manager.get_connection()
        count = conn.execute(query_template).fetchone()['count']
        conn.close()
        return count
    except Exception:
        return 0


@router.get('/admin/dashboard')
async def api_admin_dashboard(user: dict = Depends(get_current_admin)):
    """API endpoint for admin dashboard data."""
    try:
        conn = db_manager.get_connection()
        current_user = conn.execute(
            'SELECT is_admin, first_name, last_name, username FROM users WHERE id = ?',
            (user["user_id"],)
        ).fetchone()
        conn.close()
        if not current_user or not current_user['is_admin']:
            raise HTTPException(status_code=403, detail="Access denied. Admin privileges required.")

        stats = _get_admin_statistics()

        # Additional metrics
        try:
            conn2 = db_manager.get_connection()
            new_users_this_month = conn2.execute("SELECT COUNT(*) as count FROM users WHERE DATE(created_at) >= DATE('now', '-30 days')").fetchone()['count']
            conn2.close()
        except Exception:
            new_users_this_month = 0
        try:
            conn3 = db_manager.get_connection()
            assessments_this_week = conn3.execute("SELECT COUNT(*) as count FROM assessment_results WHERE DATE(completed_at) >= DATE('now', '-7 days')").fetchone()['count']
            conn3.close()
        except Exception:
            assessments_this_week = 0
        try:
            conn4 = db_manager.get_connection()
            active_users_today = conn4.execute("SELECT COUNT(*) as count FROM users WHERE DATE(last_login) = DATE('now')").fetchone()['count']
            conn4.close()
        except Exception:
            active_users_today = 0

        return {
            'success': True,
            'data': {
                'admin': {
                    'name': f"{current_user['first_name']} {current_user['last_name']}" if current_user['first_name'] else current_user['username'],
                    'username': current_user['username'],
                },
                'stats': stats,
                'metrics': {
                    'new_users_this_month': new_users_this_month,
                    'assessments_this_week': assessments_this_week,
                    'active_users_today': active_users_today,
                },
            },
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in admin dashboard API: {e}")
        raise HTTPException(status_code=500, detail="Error loading admin dashboard")


@router.get('/admin/users')
async def api_admin_users(request: Request, user: dict = Depends(get_current_admin)):
    """API endpoint for admin users list."""
    try:
        page = int(request.query_params.get('page', 1))
        search = request.query_params.get('search', '')
        role_filter = request.query_params.get('role', '')
        users, pagination = _get_users_with_stats(page=page, search=search, role_filter=role_filter)
        return {'success': True, 'data': {'users': users, 'pagination': pagination}}
    except Exception as e:
        logger.error(f"Error in admin users API: {e}")
        raise HTTPException(status_code=500, detail="Error loading users data")


@router.get('/admin/analytics')
async def api_admin_analytics(user: dict = Depends(get_current_admin)):
    """API endpoint for comprehensive admin analytics."""
    try:
        conn = db_manager.get_connection()

        # 1. Learning Progress Analytics
        cefr_distribution = conn.execute('''
            SELECT overall_level as level, COUNT(*) as count
            FROM assessment_results ar
            INNER JOIN (
                SELECT user_id, MAX(completed_at) as latest_date
                FROM assessment_results GROUP BY user_id
            ) latest ON ar.user_id = latest.user_id AND ar.completed_at = latest.latest_date
            GROUP BY overall_level
            ORDER BY
                CASE overall_level
                    WHEN 'A1' THEN 1 WHEN 'A2' THEN 2 WHEN 'B1' THEN 3
                    WHEN 'B2' THEN 4 WHEN 'C1' THEN 5 WHEN 'C2' THEN 6
                END
        ''').fetchall()

        phase_completion = conn.execute('''
            SELECT
                COUNT(DISTINCT u.id) as total_users,
                COUNT(DISTINCT ar.user_id) as phase1_completed,
                COUNT(DISTINCT p2.user_id) as phase2_started,
                COUNT(DISTINCT CASE WHEN p2.steps_completed >= 4 THEN p2.user_id END) as phase2_completed,
                COUNT(DISTINCT pc3.user_id) as phase3_completed,
                COUNT(DISTINCT pc4.user_id) as phase4_completed,
                COUNT(DISTINCT pc5.user_id) as phase5_completed,
                COUNT(DISTINCT pc6.user_id) as phase6_completed
            FROM users u
            LEFT JOIN assessment_results ar ON u.id = ar.user_id
            LEFT JOIN (
                SELECT user_id, COUNT(DISTINCT CASE WHEN step_completed = 1 THEN step_id END) as steps_completed
                FROM phase2_progress GROUP BY user_id
            ) p2 ON u.id = p2.user_id
            LEFT JOIN (SELECT user_id FROM user_phase_completion WHERE phase_number = 3 AND completed = 1) pc3 ON u.id = pc3.user_id
            LEFT JOIN (SELECT user_id FROM user_phase_completion WHERE phase_number = 4 AND completed = 1) pc4 ON u.id = pc4.user_id
            LEFT JOIN (SELECT user_id FROM user_phase_completion WHERE phase_number = 5 AND completed = 1) pc5 ON u.id = pc5.user_id
            LEFT JOIN (SELECT user_id FROM user_phase_completion WHERE phase_number = 6 AND completed = 1) pc6 ON u.id = pc6.user_id
            WHERE u.is_admin = 0
        ''').fetchone()

        avg_assessment_times = conn.execute('''
            SELECT 'Phase 1' as phase, AVG(time_taken) / 60.0 as avg_minutes
            FROM assessment_results
            UNION ALL
            SELECT 'Phase 2 - ' || step_id as phase,
                   AVG(CAST((julianday(completed_at) - julianday(started_at)) * 24 * 60 AS INTEGER)) as avg_minutes
            FROM phase2_progress WHERE completed_at IS NOT NULL GROUP BY step_id
        ''').fetchall()

        # 2. Student Engagement Metrics
        active_users_7d = conn.execute('''
            SELECT COUNT(DISTINCT user_id) as count FROM (
                SELECT user_id, completed_at as activity_date FROM assessment_results WHERE completed_at >= datetime('now', '-7 days')
                UNION SELECT user_id, last_activity as activity_date FROM phase2_progress WHERE last_activity >= datetime('now', '-7 days')
                UNION SELECT user_id, updated_at as activity_date FROM phase5_progress WHERE updated_at >= datetime('now', '-7 days')
                UNION SELECT user_id, updated_at as activity_date FROM phase6_progress WHERE updated_at >= datetime('now', '-7 days')
            )
        ''').fetchone()

        active_users_30d = conn.execute('''
            SELECT COUNT(DISTINCT user_id) as count FROM (
                SELECT user_id, completed_at as activity_date FROM assessment_results WHERE completed_at >= datetime('now', '-30 days')
                UNION SELECT user_id, last_activity as activity_date FROM phase2_progress WHERE last_activity >= datetime('now', '-30 days')
                UNION SELECT user_id, updated_at as activity_date FROM phase5_progress WHERE updated_at >= datetime('now', '-30 days')
                UNION SELECT user_id, updated_at as activity_date FROM phase6_progress WHERE updated_at >= datetime('now', '-30 days')
            )
        ''').fetchone()

        daily_activity = conn.execute('''
            SELECT DATE(activity_date) as date, COUNT(DISTINCT user_id) as active_users FROM (
                SELECT user_id, completed_at as activity_date FROM assessment_results WHERE completed_at >= datetime('now', '-30 days')
                UNION SELECT user_id, last_activity as activity_date FROM phase2_progress WHERE last_activity >= datetime('now', '-30 days')
                UNION SELECT user_id, updated_at as activity_date FROM phase5_progress WHERE updated_at >= datetime('now', '-30 days')
                UNION SELECT user_id, updated_at as activity_date FROM phase6_progress WHERE updated_at >= datetime('now', '-30 days')
            ) GROUP BY DATE(activity_date) ORDER BY date DESC LIMIT 30
        ''').fetchall()

        session_duration_dist = conn.execute('''
            SELECT
                CASE
                    WHEN time_taken < 300 THEN '0-5 min'
                    WHEN time_taken < 600 THEN '5-10 min'
                    WHEN time_taken < 1200 THEN '10-20 min'
                    WHEN time_taken < 1800 THEN '20-30 min'
                    ELSE '30+ min'
                END as duration_range,
                COUNT(*) as count
            FROM assessment_results WHERE time_taken IS NOT NULL GROUP BY duration_range
        ''').fetchall()

        # 3. Assessment Quality Insights
        ai_detection_stats = conn.execute('''
            SELECT
                AVG(ai_usage_percentage) as avg_ai_usage,
                COUNT(CASE WHEN ai_usage_percentage > 30 THEN 1 END) as high_ai_count,
                COUNT(*) as total_assessments
            FROM assessment_results WHERE ai_usage_percentage IS NOT NULL
        ''').fetchone()

        score_distribution = conn.execute('''
            SELECT
                CASE
                    WHEN xp_earned < 200 THEN 'Low (0-199)'
                    WHEN xp_earned < 400 THEN 'Medium (200-399)'
                    WHEN xp_earned < 600 THEN 'High (400-599)'
                    ELSE 'Excellent (600+)'
                END as score_range,
                COUNT(*) as count
            FROM assessment_results GROUP BY score_range
        ''').fetchall()

        most_challenging_steps = conn.execute('''
            SELECT step_id, COUNT(*) as attempts,
                   COUNT(CASE WHEN step_completed = 1 THEN 1 END) as completions,
                   ROUND(CAST(COUNT(CASE WHEN step_completed = 1 THEN 1 END) AS FLOAT) / COUNT(*) * 100, 1) as success_rate
            FROM phase2_progress GROUP BY step_id HAVING attempts > 0 ORDER BY success_rate ASC
        ''').fetchall()

        # 4. Risk Identification
        at_risk_students = conn.execute('''
            SELECT u.id, u.username, u.first_name, u.last_name,
                   MAX(COALESCE(ar.completed_at, p2.last_activity, p5.updated_at, p6.updated_at, u.created_at)) as last_activity,
                   COUNT(DISTINCT ar.id) as assessments_completed,
                   COUNT(DISTINCT p2.step_id) as phase2_steps_attempted
            FROM users u
            LEFT JOIN assessment_results ar ON u.id = ar.user_id
            LEFT JOIN phase2_progress p2 ON u.id = p2.user_id
            LEFT JOIN phase5_progress p5 ON u.id = p5.user_id
            LEFT JOIN phase6_progress p6 ON u.id = p6.user_id
            WHERE u.is_admin = 0
            GROUP BY u.id, u.username, u.first_name, u.last_name
            HAVING last_activity < datetime('now', '-7 days') OR assessments_completed = 0
            ORDER BY last_activity ASC LIMIT 10
        ''').fetchall()

        stuck_students = conn.execute('''
            SELECT u.id, u.username, u.first_name, u.last_name, p2.step_id,
                   p2.started_at, p2.last_activity,
                   CAST((julianday('now') - julianday(p2.last_activity)) AS INTEGER) as days_stuck
            FROM users u
            INNER JOIN phase2_progress p2 ON u.id = p2.user_id
            WHERE p2.step_completed = 0 AND p2.last_activity < datetime('now', '-3 days') AND u.is_admin = 0
            ORDER BY days_stuck DESC LIMIT 10
        ''').fetchall()

        # 5. System Health
        recent_errors = conn.execute('''
            SELECT COUNT(*) as error_count FROM phase2_progress
            WHERE step_score = 0 AND started_at >= datetime('now', '-24 hours')
        ''').fetchone()

        total_sessions = conn.execute('''
            SELECT COUNT(DISTINCT session_id) as count FROM assessment_results
            WHERE completed_at >= datetime('now', '-7 days')
        ''').fetchone()

        conn.close()

        return {
            'success': True,
            'data': {
                'learning_progress': {
                    'cefr_distribution': [dict(row) for row in cefr_distribution],
                    'phase_completion': dict(phase_completion),
                    'avg_assessment_times': [dict(row) for row in avg_assessment_times],
                },
                'engagement': {
                    'active_users_7d': active_users_7d['count'],
                    'active_users_30d': active_users_30d['count'],
                    'daily_activity': [dict(row) for row in daily_activity],
                    'session_duration_dist': [dict(row) for row in session_duration_dist],
                },
                'quality': {
                    'ai_detection': dict(ai_detection_stats) if ai_detection_stats else {},
                    'score_distribution': [dict(row) for row in score_distribution],
                    'challenging_steps': [dict(row) for row in most_challenging_steps],
                },
                'risk': {
                    'at_risk_students': [dict(row) for row in at_risk_students],
                    'stuck_students': [dict(row) for row in stuck_students],
                },
                'system': {
                    'recent_errors': recent_errors['error_count'],
                    'total_sessions_7d': total_sessions['count'],
                },
            },
        }
    except Exception as e:
        logger.error(f"Error getting analytics data: {e}")
        raise HTTPException(status_code=500, detail="Error loading analytics data")


@router.get('/admin/users/{user_id}/details')
async def api_admin_user_details(user_id: int, user: dict = Depends(get_current_admin)):
    """API endpoint for detailed user information."""
    try:
        conn = db_manager.get_connection()

        target_user = conn.execute('''
            SELECT id, username, email, first_name, last_name, created_at, last_login,
                   is_active, email_verified, preferred_language, timezone, role, is_admin
            FROM users WHERE id = ?
        ''', (user_id,)).fetchone()

        if not target_user:
            conn.close()
            raise HTTPException(status_code=404, detail="User not found")

        user_assessments = conn.execute('''
            SELECT overall_level, xp_earned, completed_at, time_taken
            FROM assessment_results WHERE user_id = ? ORDER BY completed_at DESC
        ''', (user_id,)).fetchall()

        total_assessments = len(user_assessments)
        total_xp = sum(a['xp_earned'] for a in user_assessments if a['xp_earned'])
        latest_level = user_assessments[0]['overall_level'] if user_assessments else 'N/A'

        assessments_list = []
        for a in user_assessments:
            ad = dict(a)
            ad['duration_minutes'] = round(ad['time_taken'] / 60, 1) if ad['time_taken'] else None
            assessments_list.append(ad)

        user_stats = {
            'total_assessments': total_assessments,
            'total_xp': total_xp,
            'latest_level': latest_level,
            'assessments': assessments_list,
        }

        phase2_progress = conn.execute('''
            SELECT step_id, step_completed, started_at
            FROM phase2_progress WHERE user_id = ? ORDER BY started_at DESC
        ''', (user_id,)).fetchall()

        completed_steps = [p['step_id'] for p in phase2_progress if p['step_completed']]
        expected_steps = ['step_1', 'step_2', 'step_3', 'final_writing']
        phase2_completed = all(step in completed_steps for step in expected_steps)

        phase_completion_rows = conn.execute('''
            SELECT phase_number, completed, completion_date, final_level
            FROM user_phase_completion WHERE user_id = ? ORDER BY phase_number
        ''', (user_id,)).fetchall()
        phase_completion = {row['phase_number']: dict(row) for row in phase_completion_rows}

        user_progress = {
            'phase2_steps': [dict(p) for p in phase2_progress],
            'phase2_completed': phase2_completed,
            'phase3_completed': bool(phase_completion.get(3, {}).get('completed')),
            'phase4_completed': bool(phase_completion.get(4, {}).get('completed')),
            'phase5_completed': bool(phase_completion.get(5, {}).get('completed')),
            'phase6_completed': bool(phase_completion.get(6, {}).get('completed')),
            'phase_completion': [dict(row) for row in phase_completion_rows],
        }

        conn.close()

        user_dict = dict(target_user)
        user_dict['phase2_completed'] = phase2_completed
        user_dict['phase3_completed'] = user_progress['phase3_completed']
        user_dict['phase4_completed'] = user_progress['phase4_completed']
        user_dict['phase5_completed'] = user_progress['phase5_completed']
        user_dict['phase6_completed'] = user_progress['phase6_completed']

        return {
            'success': True,
            'data': {
                'user': user_dict,
                'stats': user_stats,
                'progress': user_progress,
            },
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting user details: {e}")
        raise HTTPException(status_code=500, detail="Error loading user details")


@router.post('/admin/users/{user_id}/toggle')
async def admin_toggle_user(user_id: int, request: Request, user: dict = Depends(get_current_admin)):
    """Toggle user active status."""
    try:
        data = await request.json()
        is_active = data.get('active', True)
        success = user_manager.update_user(user_id, is_active=is_active)
        if success:
            action = 'activated' if is_active else 'deactivated'
            logger.info(f"Admin {user.get('username')} {action} user {user_id}")
            return {'success': True, 'message': f'User {action} successfully'}
        else:
            raise HTTPException(status_code=400, detail="Failed to update user")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error toggling user: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get('/admin/export/users')
async def admin_export_users(request: Request, user: dict = Depends(get_current_admin)):
    """Export users data to CSV."""
    import csv
    import io
    from fastapi.responses import Response as FastAPIResponse

    try:
        search = request.query_params.get('search', '')
        role_filter = request.query_params.get('role', '')
        users, _ = _get_users_with_stats(page=1, per_page=10000, search=search, role_filter=role_filter)

        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow([
            'ID', 'Username', 'Email', 'First Name', 'Last Name',
            'Role', 'Active', 'Created At', 'Last Login',
            'Total Assessments', 'Best Level', 'Total XP', 'Phase2 Steps Completed', 'Phase2 Steps Attempted',
        ])
        for u in users:
            writer.writerow([
                u.get('id', ''), u.get('username', ''), u.get('email', ''),
                u.get('first_name', ''), u.get('last_name', ''),
                'Admin' if u.get('is_admin') else 'User',
                'Yes' if u.get('is_active') else 'No',
                u.get('created_at', ''), u.get('last_login', ''),
                u.get('total_assessments', 0), u.get('best_level', 'N/A'),
                u.get('total_xp', 0), u.get('phase2_steps_completed', 0),
                u.get('phase2_steps_attempted', 0),
            ])

        csv_content = output.getvalue()
        filename = f'fardi_users_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
        return FastAPIResponse(
            content=csv_content,
            media_type='text/csv',
            headers={'Content-Disposition': f'attachment; filename={filename}'},
        )
    except Exception as e:
        logger.error(f"Error exporting users: {str(e)}")
        raise HTTPException(status_code=500, detail="Error exporting users data")


# Alias for admin export
@router.get('/admin/export-data')
async def admin_export_data(request: Request, user: dict = Depends(get_current_admin)):
    return await admin_export_users(request, user)


# ======================================================================
# Chat System (from app.py)
# ======================================================================

def _init_chat_tables():
    """Create chat tables if they don't exist."""
    conn = db_manager.get_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS chat_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sender_id INTEGER NOT NULL,
            receiver_id INTEGER NOT NULL,
            message TEXT NOT NULL,
            is_read INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (sender_id) REFERENCES users(id),
            FOREIGN KEY (receiver_id) REFERENCES users(id)
        )
    ''')
    conn.commit()

_init_chat_tables()


@router.get('/chat/conversations')
async def chat_conversations(user: dict = Depends(get_current_user)):
    """Get all conversations for the current user."""
    try:
        user_id = user["user_id"]
        is_admin = user.get("is_admin", False)
        conn = db_manager.get_connection()

        if is_admin:
            conversations = conn.execute('''
                SELECT
                    u.id as user_id, u.username, u.first_name, u.last_name,
                    (SELECT message FROM chat_messages
                     WHERE (sender_id = u.id AND receiver_id = ?) OR (sender_id = ? AND receiver_id = u.id)
                     ORDER BY created_at DESC LIMIT 1) as last_message,
                    (SELECT created_at FROM chat_messages
                     WHERE (sender_id = u.id AND receiver_id = ?) OR (sender_id = ? AND receiver_id = u.id)
                     ORDER BY created_at DESC LIMIT 1) as last_message_at,
                    (SELECT COUNT(*) FROM chat_messages
                     WHERE sender_id = u.id AND receiver_id = ? AND is_read = 0) as unread_count
                FROM users u WHERE u.is_admin = 0
                ORDER BY last_message_at DESC NULLS LAST, u.first_name ASC
            ''', (user_id, user_id, user_id, user_id, user_id)).fetchall()
        else:
            conversations = conn.execute('''
                SELECT
                    u.id as user_id, u.username, u.first_name, u.last_name,
                    (SELECT message FROM chat_messages
                     WHERE (sender_id = u.id AND receiver_id = ?) OR (sender_id = ? AND receiver_id = u.id)
                     ORDER BY created_at DESC LIMIT 1) as last_message,
                    (SELECT created_at FROM chat_messages
                     WHERE (sender_id = u.id AND receiver_id = ?) OR (sender_id = ? AND receiver_id = u.id)
                     ORDER BY created_at DESC LIMIT 1) as last_message_at,
                    (SELECT COUNT(*) FROM chat_messages
                     WHERE sender_id = u.id AND receiver_id = ? AND is_read = 0) as unread_count
                FROM users u WHERE u.is_admin = 1
                ORDER BY last_message_at DESC NULLS LAST
            ''', (user_id, user_id, user_id, user_id, user_id)).fetchall()

        return {
            'success': True,
            'data': [{
                'user_id': c['user_id'],
                'username': c['username'],
                'first_name': c['first_name'],
                'last_name': c['last_name'],
                'last_message': c['last_message'],
                'last_message_at': c['last_message_at'],
                'unread_count': c['unread_count'] or 0,
            } for c in conversations],
        }
    except Exception as e:
        logger.error(f"Error getting conversations: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get('/chat/messages/{other_user_id}')
async def chat_get_messages(other_user_id: int, user: dict = Depends(get_current_user)):
    """Get messages between current user and another user."""
    try:
        user_id = user["user_id"]
        conn = db_manager.get_connection()

        messages = conn.execute('''
            SELECT id, sender_id, receiver_id, message, is_read, created_at
            FROM chat_messages
            WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
            ORDER BY created_at ASC
        ''', (user_id, other_user_id, other_user_id, user_id)).fetchall()

        # Mark messages from the other user as read
        conn.execute('''
            UPDATE chat_messages SET is_read = 1
            WHERE sender_id = ? AND receiver_id = ? AND is_read = 0
        ''', (other_user_id, user_id))
        conn.commit()

        return {
            'success': True,
            'data': [{
                'id': m['id'],
                'sender_id': m['sender_id'],
                'receiver_id': m['receiver_id'],
                'message': m['message'],
                'is_read': bool(m['is_read']),
                'created_at': m['created_at'],
                'is_mine': m['sender_id'] == user_id,
            } for m in messages],
        }
    except Exception as e:
        logger.error(f"Error getting messages: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post('/chat/send')
async def chat_send_message(request: Request, user: dict = Depends(get_current_user)):
    """Send a message to another user."""
    try:
        user_id = user["user_id"]
        data = await request.json()
        receiver_id = data.get('receiver_id')
        message = (data.get('message', '') or '').strip()

        if not receiver_id or not message:
            raise HTTPException(status_code=400, detail="receiver_id and message are required")
        if len(message) > 2000:
            raise HTTPException(status_code=400, detail="Message too long (max 2000 characters)")

        conn = db_manager.get_connection()
        receiver = conn.execute('SELECT id, is_admin FROM users WHERE id = ?', (receiver_id,)).fetchone()
        if not receiver:
            raise HTTPException(status_code=404, detail="User not found")

        conn.execute('''
            INSERT INTO chat_messages (sender_id, receiver_id, message) VALUES (?, ?, ?)
        ''', (user_id, receiver_id, message))
        conn.commit()

        return {'success': True}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error sending message: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get('/chat/unread-count')
async def chat_unread_count(user: dict = Depends(get_current_user)):
    """Get total unread message count for current user."""
    try:
        user_id = user["user_id"]
        conn = db_manager.get_connection()
        result = conn.execute(
            'SELECT COUNT(*) as count FROM chat_messages WHERE receiver_id = ? AND is_read = 0',
            (user_id,)
        ).fetchone()
        return {'success': True, 'count': result['count'] or 0}
    except Exception as e:
        logger.error(f"Error getting unread count: {e}")
        raise HTTPException(status_code=500, detail=str(e))
