"""
Phase 4 API Routes - FastAPI migration of routes/phase4_routes.py
Marketing & Promotion phase endpoints.
Preserves exact response shapes expected by the frontend.
"""
import json
import re
import logging
import sqlite3

from fastapi import APIRouter, Request, Depends, HTTPException
from fastapi.responses import JSONResponse

from auth_utils import get_current_user, get_current_admin
from dependencies import db_manager, user_manager, assessment_history
from models.phase4_loader import get_phase4_step
from services.ai_service import AIService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/phase4", tags=["phase4"])

# Initialize AI service
ai_service = AIService()


def get_db_connection_p4():
    conn = sqlite3.connect('fardi.db')
    conn.row_factory = sqlite3.Row
    return conn


def save_phase4_progress(
    user_id,
    step,
    interaction=None,
    context='main',
    score=None,
    item_id=None,
    item_type=None,
    prompt=None,
    answer=None,
    is_correct=None,
    subphase=None,
):
    """Save progress and optionally a response for Phase 4."""
    conn = get_db_connection_p4()
    try:
        if step and step > 0:
            conn.execute(
                """INSERT INTO student_progress (user_id, phase, subphase, step, interaction, context, is_complete)
                   VALUES (?, 4, ?, ?, ?, ?, 0)
                   ON CONFLICT(user_id, phase) DO UPDATE SET
                       subphase = excluded.subphase,
                       step = excluded.step,
                       interaction = excluded.interaction,
                       context = excluded.context""",
                (user_id, subphase, step, interaction or 0, context)
            )
        if answer is not None:
            is_correct_int = None
            if is_correct is not None:
                is_correct_int = 1 if is_correct else 0
            answer_val = answer if isinstance(answer, str) else json.dumps(answer)
            conn.execute(
                """INSERT INTO student_responses
                    (user_id, phase, subphase, step, interaction, item_index, context, item_id, item_type, prompt, response, is_correct, score)
                   VALUES (?, 4, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?)""",
                (user_id, subphase, step, interaction or 0, context, item_id, item_type, prompt, answer_val, is_correct_int, score)
            )
        conn.commit()
    finally:
        conn.close()


def _phase4_total_to_level(total_score, thresholds):
    """Map a cumulative score to a remedial CEFR level."""
    for limit, level in thresholds:
        if total_score < limit:
            return level
    return 'C1'


def _phase4_step_path(step):
    return f"/phase4/step/{step}"


def _phase4_remedial_start_url(step, level):
    if step == 1:
        return f"/phase4/remedial/{level.lower()}/taskA"
    return f"/phase4/step/{step}/remedial/{level.lower()}/taskA"


def _phase4_retry_url(step, level):
    return _phase4_remedial_start_url(step, level)


def _phase4_next_step_url(step):
    if step == 1:
        return "/phase4_2/step/1"
    if step == 5:
        return "/phase4_2/step/1"
    return _phase4_step_path(step + 1)


def _phase4_normalize_to_cefr(score, max_score):
    """Normalize raw task scores into the 1-5 CEFR score band used by routing."""
    if max_score <= 0:
        return 1
    bounded = max(0, min(score, max_score))
    return min(5, max(1, round((bounded / max_score) * 4) + 1))


def _phase4_build_main_score_payload(interaction_scores, interaction_max_scores, total_score, total_max_score, remedial_level, next_url):
    level_to_name = {1: 'A1', 2: 'A2', 3: 'B1', 4: 'B2', 5: 'C1'}
    payload = {}
    for index, (score, max_score) in enumerate(zip(interaction_scores, interaction_max_scores), start=1):
        payload[f'interaction{index}'] = {
            'score': score,
            'max_score': max_score,
            'level': level_to_name.get(score, 'A1')
        }
    payload['total'] = {
        'score': total_score,
        'max_score': total_max_score,
        'remedial_level': f'Remedial {remedial_level}',
        'should_proceed': False,
        'next_url': next_url
    }
    return payload


_PHASE4_2_MAIN_CONFIG = {
    1: {
        'thresholds': [(4, 'A1'), (7, 'A2'), (10, 'B1'), (13, 'B2')],
        'max_scores': [8, 5, 8],
    },
    2: {
        'thresholds': [(7, 'A2'), (10, 'B1'), (13, 'B2')],
        'max_scores': [5, 5, 5],
    },
    3: {
        'thresholds': [(7, 'A2'), (10, 'B1'), (13, 'B2')],
        'max_scores': [5, 5, 5],
    },
    4: {
        'thresholds': [(7, 'A2'), (10, 'B1'), (13, 'B2')],
        'max_scores': [5, 5, 5],
    },
    5: {
        'thresholds': [(7, 'A2'), (10, 'B1'), (13, 'B2')],
        'max_scores': [5, 5, 5],
    },
}


_PHASE4_2_FINAL_CONFIG = {
    1: {
        'A1': {'threshold': 8, 'max_score': 10},
        'A2': {'threshold': 8, 'max_score': 10},
        'B1': {'threshold': 8, 'max_score': 10},
        'B2': {'threshold': 8, 'max_score': 10},
        'C1': {'threshold': 8, 'max_score': 10},
    },
    2: {
        'A2': {'threshold': 8, 'max_score': 10},
        'B1': {'threshold': 8, 'max_score': 10},
        'B2': {'threshold': 8, 'max_score': 10},
        'C1': {'threshold': 8, 'max_score': 10},
    },
    3: {
        'A2': {'threshold': 18, 'max_score': 22},
        'B1': {'threshold': 22, 'max_score': 28},
        'B2': {'threshold': 27, 'max_score': 34},
        'C1': {'threshold': 40, 'max_score': 50},
    },
    4: {
        'A2': {'threshold': 18, 'max_score': 22},
        'B1': {'threshold': 15, 'max_score': 19},
        'B2': {'threshold': 26, 'max_score': 33},
        'C1': {'threshold': 38, 'max_score': 48},
    },
    5: {
        'A2': {'threshold': 14, 'max_score': 20},
        'B1': {'threshold': 21, 'max_score': 30},
        'B2': {'threshold': 24, 'max_score': 34},
        'C1': {'threshold': 28, 'max_score': 40},
    },
}


def _phase4_2_step_path(step):
    return f"/phase4_2/step/{step}"


def _phase4_2_main_next_step_url(step):
    if step == 5:
        return "/dashboard"
    return _phase4_2_step_path(step + 1)


def _phase4_2_remedial_start_url(step, level):
    task_slug = "taska" if step == 5 else "taskA"
    return f"/phase4_2/step/{step}/remedial/{level.lower()}/{task_slug}"


def _phase4_2_retry_url(step, level):
    return _phase4_2_remedial_start_url(step, level)


def _phase4_2_count_sentences(text):
    return len([segment for segment in re.split(r'[.!?]+', text) if segment.strip()])


def _phase4_2_collect_keyword_hits(text, keywords):
    lowered = text.lower()
    return sum(1 for keyword in keywords if keyword in lowered)


def _phase4_2_score_guided_writing(text, *, max_score, min_sentences, min_words, core_keywords, advanced_keywords=None):
    sentence_count = _phase4_2_count_sentences(text)
    word_count = len(text.split())
    core_hits = _phase4_2_collect_keyword_hits(text, core_keywords)
    advanced_hits = _phase4_2_collect_keyword_hits(text, advanced_keywords or [])

    structure_score = min(3, round((sentence_count / max(min_sentences, 1)) * 3))
    length_score = min(2, round((word_count / max(min_words, 1)) * 2))
    keyword_score = min(3, core_hits)
    advanced_score = min(max(0, max_score - 8), advanced_hits)

    score = min(max_score, structure_score + length_score + keyword_score + advanced_score)

    if score >= max_score - 1:
        feedback = 'Strong response. Your writing is well developed and covers the expected ideas clearly.'
    elif score >= max_score - 3:
        feedback = 'Good effort. Add a bit more detail and coverage of the prompt to strengthen your answer.'
    else:
        feedback = 'Good start. Add more complete sentences and include more of the key social media ideas from the task.'

    return score, feedback


def _phase4_2_fallback_definition_feedback(definitions):
    results = []
    score = 0
    for item in definitions:
        term = str(item.get('term', '')).strip()
        definition = str(item.get('definition', '')).strip()
        words = definition.split()
        has_example = any(marker in definition.lower() for marker in ['for example', 'example', 'like', '#', '@'])
        correct = len(words) >= 4 and bool(term)
        if correct:
            score += 1
        if correct and has_example:
            comment = 'Clear definition with an example.'
        elif correct:
            comment = 'Good definition. Add an example next time for a stronger answer.'
        else:
            comment = f'Write a fuller definition for "{term}" using a short example.'
        results.append({'correct': correct, 'comment': comment})
    return score, results


def _phase4_2_fallback_proposal_feedback(proposals):
    results = []
    score = 0
    for item in proposals:
        answer = str(item.get('answer', '')).strip()
        correct = len(answer.split()) >= 3
        if correct:
            score += 1
            comment = 'Clear proposal.'
        else:
            comment = 'Write a more complete proposal.'
        results.append({'correct': correct, 'comment': comment})
    return score, results


@router.post("/4_2/step/{step}/remedial/{level}/task-b/evaluate")
async def evaluate_phase4_2_remedial_task_b(step: int, level: str, request: Request, user: dict = Depends(get_current_user)):
    """Evaluate Phase 4.2 remedial Task B activities through a single backend contract."""
    try:
        data = await request.json()
        normalized_level = level.upper()

        if step == 1 and normalized_level == 'B2':
            paragraph = str(data.get('paragraph', '')).strip()
            if not paragraph:
                return JSONResponse(status_code=400, content={'success': False, 'error': 'Paragraph is required'})

            system_prompt = (
                'You are evaluating a B2 student paragraph about effective social media posts. '
                'Score from 0 to 10. Reward clear organization, enough detail, and correct use of social media concepts. '
                'Respond ONLY in JSON: {"score": 0-10, "feedback": "brief feedback"}'
            )
            user_prompt = (
                f'Paragraph:\n"{paragraph}"\n'
                'Expected focus: hashtags, captions, engagement, calls-to-action, tagging, stories, viral content, posting best practices.'
            )
            result = await _ai_evaluate_json(system_prompt, user_prompt, max_tokens=250)
            if result:
                score = max(0, min(10, int(result.get('score', 0))))
                feedback = result.get('feedback', 'Your paragraph was evaluated successfully.')
            else:
                score, feedback = _phase4_2_score_guided_writing(
                    paragraph,
                    max_score=10,
                    min_sentences=8,
                    min_words=40,
                    core_keywords=['hashtag', 'caption', 'engagement', 'call-to-action', 'tag', 'story', 'viral', 'post'],
                    advanced_keywords=['strategy', 'audience'],
                )

            return {'success': True, 'score': score, 'feedback': feedback}

        if step == 2 and normalized_level == 'B2':
            paragraph = str(data.get('paragraph', '')).strip()
            if not paragraph:
                return JSONResponse(status_code=400, content={'success': False, 'error': 'Explanation is required'})

            guided_questions = data.get('guided_questions') or []
            system_prompt = (
                'You are evaluating a B2 student explanation about planning a social media post. '
                'Score from 0 to 10. Reward clear structure, coverage of the planning questions, and appropriate vocabulary. '
                'Respond ONLY in JSON: {"score": 0-10, "feedback": "brief feedback"}'
            )
            user_prompt = (
                f'Explanation:\n"{paragraph}"\n'
                f'Guided questions: {json.dumps(guided_questions)}'
            )
            result = await _ai_evaluate_json(system_prompt, user_prompt, max_tokens=250)
            if result:
                score = max(0, min(10, int(result.get('score', 0))))
                feedback = result.get('feedback', 'Your explanation was evaluated successfully.')
            else:
                score, feedback = _phase4_2_score_guided_writing(
                    paragraph,
                    max_score=10,
                    min_sentences=8,
                    min_words=40,
                    core_keywords=['hashtag', 'caption', 'emoji', 'call-to-action', 'post', 'engagement', 'viral', 'comments'],
                    advanced_keywords=['strategy', 'timing'],
                )

            return {'success': True, 'score': score, 'feedback': feedback}

        if step == 3 and normalized_level == 'B1':
            definitions = data.get('definitions') or []
            if not definitions:
                return JSONResponse(status_code=400, content={'success': False, 'error': 'Definitions are required'})

            system_prompt = (
                'You are evaluating eight B1-level social-media term definitions. '
                'For each answer decide if it is acceptable at B1 level. '
                'Respond ONLY in JSON with this shape: {"score": 0-8, "feedback": [{"correct": true|false, "comment": "brief comment"}]}'
            )
            user_prompt = f'Definitions:\n{json.dumps(definitions)}'
            result = await _ai_evaluate_json(system_prompt, user_prompt, max_tokens=900)
            feedback = result.get('feedback') if result else None
            if isinstance(feedback, list):
                normalized_feedback = []
                for item in feedback[:len(definitions)]:
                    normalized_feedback.append({
                        'correct': bool(item.get('correct')),
                        'comment': str(item.get('comment', 'Good effort.')),
                    })
                while len(normalized_feedback) < len(definitions):
                    normalized_feedback.append({'correct': False, 'comment': 'Add a clearer definition.'})
                score = max(0, min(8, int(result.get('score', 0))))
                return {'success': True, 'score': score, 'feedback': normalized_feedback}

            score, normalized_feedback = _phase4_2_fallback_definition_feedback(definitions)
            return {'success': True, 'score': score, 'feedback': normalized_feedback}

        if step == 3 and normalized_level == 'B2':
            paragraph = str(data.get('paragraph', '') or data.get('explanation', '')).strip()
            if not paragraph:
                return JSONResponse(status_code=400, content={'success': False, 'error': 'Explanation is required'})

            guided_questions = data.get('guided_questions') or []
            system_prompt = (
                'You are evaluating a B2 explanation about social media post elements. '
                'Score from 0 to 8. Reward complete coverage of the guided questions, clear examples, and accurate vocabulary. '
                'Respond ONLY in JSON: {"score": 0-8, "feedback": "brief feedback"}'
            )
            user_prompt = (
                f'Explanation:\n"{paragraph}"\n'
                f'Guided questions: {json.dumps(guided_questions)}'
            )
            result = await _ai_evaluate_json(system_prompt, user_prompt, max_tokens=250)
            if result:
                score = max(0, min(8, int(result.get('score', 0))))
                feedback = result.get('feedback', 'Your explanation was evaluated successfully.')
            else:
                score, feedback = _phase4_2_score_guided_writing(
                    paragraph,
                    max_score=8,
                    min_sentences=8,
                    min_words=35,
                    core_keywords=['hashtag', 'caption', 'emoji', 'call-to-action', 'tag', 'timing', 'visual', 'engagement'],
                )

            return {'success': True, 'score': score, 'feedback': feedback}

        if step == 3 and normalized_level == 'C1':
            text = str(data.get('text', '') or data.get('analysis', '')).strip()
            if not text:
                return JSONResponse(status_code=400, content={'success': False, 'error': 'Analysis is required'})

            system_prompt = (
                'You are evaluating a C1 analytical paragraph about social media effectiveness. '
                'Score from 0 to 8. Reward sophistication, cohesion, precise terminology, and analytical depth. '
                'Respond ONLY in JSON: {"score": 0-8, "feedback": "brief feedback"}'
            )
            user_prompt = f'Analysis:\n"{text}"'
            result = await _ai_evaluate_json(system_prompt, user_prompt, max_tokens=250)
            if result:
                score = max(0, min(8, int(result.get('score', 0))))
                feedback = result.get('feedback', 'Your analysis was evaluated successfully.')
            else:
                score, feedback = _phase4_2_score_guided_writing(
                    text,
                    max_score=8,
                    min_sentences=8,
                    min_words=45,
                    core_keywords=['reach', 'caption', 'emotional', 'call-to-action', 'tagging', 'timing', 'analytics', 'optimization'],
                )

            return {'success': True, 'score': score, 'feedback': feedback}

        if step == 4 and normalized_level == 'B1':
            proposals = data.get('proposals') or []
            if not proposals:
                return JSONResponse(status_code=400, content={'success': False, 'error': 'Proposals are required'})

            system_prompt = (
                'You are evaluating eight B1-level proposals for a social media post plan. '
                'For each answer decide if it is acceptable at B1 level. '
                'Respond ONLY in JSON with this shape: {"score": 0-8, "feedback": [{"correct": true|false, "comment": "brief comment"}]}'
            )
            user_prompt = f'Proposals:\n{json.dumps(proposals)}'
            result = await _ai_evaluate_json(system_prompt, user_prompt, max_tokens=900)
            feedback = result.get('feedback') if result else None
            if isinstance(feedback, list):
                normalized_feedback = []
                for item in feedback[:len(proposals)]:
                    normalized_feedback.append({
                        'correct': bool(item.get('correct')),
                        'comment': str(item.get('comment', 'Good effort.')),
                    })
                while len(normalized_feedback) < len(proposals):
                    normalized_feedback.append({'correct': False, 'comment': 'Add a clearer proposal.'})
                score = max(0, min(8, int(result.get('score', 0))))
                return {'success': True, 'score': score, 'feedback': normalized_feedback}

            score, normalized_feedback = _phase4_2_fallback_proposal_feedback(proposals)
            return {'success': True, 'score': score, 'feedback': normalized_feedback}

        if step == 4 and normalized_level == 'C1':
            text = str(data.get('text', '') or data.get('analysis', '')).strip()
            if not text:
                return JSONResponse(status_code=400, content={'success': False, 'error': 'Analysis is required'})

            system_prompt = (
                'You are evaluating a C1 analytical paragraph about post effectiveness. '
                'Score from 0 to 8. Reward sophistication, cohesion, and use of strategic social-media terminology. '
                'Respond ONLY in JSON: {"score": 0-8, "feedback": "brief feedback"}'
            )
            user_prompt = f'Analysis:\n"{text}"'
            result = await _ai_evaluate_json(system_prompt, user_prompt, max_tokens=250)
            if result:
                score = max(0, min(8, int(result.get('score', 0))))
                feedback = result.get('feedback', 'Your analysis was evaluated successfully.')
            else:
                score, feedback = _phase4_2_score_guided_writing(
                    text,
                    max_score=8,
                    min_sentences=8,
                    min_words=45,
                    core_keywords=['reach', 'caption', 'emojis', 'call-to-action', 'tagging', 'timing', 'analytics', 'optimization'],
                )

            return {'success': True, 'score': score, 'feedback': feedback}

        if step == 5 and normalized_level == 'B2':
            text = str(data.get('text', '') or data.get('rewrite', '')).strip()
            if not text:
                return JSONResponse(status_code=400, content={'success': False, 'error': 'Rewrite is required'})

            system_prompt = (
                'You are evaluating a B2 rewrite of a faulty social-media post. '
                'Score from 0 to 10. Reward grammar correction, coherence, suitable vocabulary, and an engaging tone. '
                'Respond ONLY in JSON: {"score": 0-10, "feedback": "brief feedback"}'
            )
            user_prompt = f'Rewritten post:\n"{text}"'
            result = await _ai_evaluate_json(system_prompt, user_prompt, max_tokens=250)
            if result:
                score = max(0, min(10, int(result.get('score', 0))))
                feedback = result.get('feedback', 'Your rewrite was evaluated successfully.')
            else:
                score, feedback = _phase4_2_score_guided_writing(
                    text,
                    max_score=10,
                    min_sentences=8,
                    min_words=35,
                    core_keywords=['festival', 'music', 'food', 'dance', 'friend', 'hashtag', 'share', 'event'],
                    advanced_keywords=['engage', 'audience'],
                )

            return {'success': True, 'score': score, 'feedback': feedback}

        if step == 5 and normalized_level == 'C1':
            text = str(data.get('text', '') or data.get('rewrite', '')).strip()
            if not text:
                return JSONResponse(status_code=400, content={'success': False, 'error': 'Rewrite is required'})

            system_prompt = (
                'You are evaluating a C1 rewrite of a faulty promotional post. '
                'Score from 0 to 12. Reward precise grammar correction, sophisticated vocabulary, coherent discourse markers, and professional register. '
                'Respond ONLY in JSON: {"score": 0-12, "feedback": "brief feedback"}'
            )
            user_prompt = f'Rewritten post:\n"{text}"'
            result = await _ai_evaluate_json(system_prompt, user_prompt, max_tokens=250)
            if result:
                score = max(0, min(12, int(result.get('score', 0))))
                feedback = result.get('feedback', 'Your rewrite was evaluated successfully.')
            else:
                score, feedback = _phase4_2_score_guided_writing(
                    text,
                    max_score=12,
                    min_sentences=8,
                    min_words=50,
                    core_keywords=['festival', 'participants', 'traditions', 'customs', 'share', 'hashtag', 'promote', 'website'],
                    advanced_keywords=['furthermore', 'moreover', 'additionally', 'visibility'],
                )

            return {'success': True, 'score': score, 'feedback': feedback}

        return JSONResponse(
            status_code=404,
            content={'success': False, 'error': f'No Phase 4.2 Task B evaluator for step {step} level {normalized_level}'}
        )

    except Exception as e:
        logger.error(f"Error evaluating Phase 4.2 remedial Task B: {e}")
        return JSONResponse(status_code=500, content={'success': False, 'error': str(e)})


@router.get("/step/{step_id}")
async def get_step(step_id: int, user: dict = Depends(get_current_user)):
    """Get Phase 4 step data"""
    try:
        step_data = get_phase4_step(step_id)

        if not step_data:
            return JSONResponse({
                'success': False,
                'error': f'Step {step_id} not found'
            }, status_code=404)

        return {
            'success': True,
            'data': step_data
        }
    except Exception as e:
        logger.error(f"Error getting Phase 4 step {step_id}: {e}")
        return JSONResponse({
            'success': False,
            'error': str(e)
        }, status_code=500)


@router.post("/step/{step_id}/submit")
async def submit_response(step_id: int, request: Request, user: dict = Depends(get_current_user)):
    """Submit Phase 4 step response"""
    try:
        user_id = user["user_id"]
        data = await request.json()

        # Save to DB
        save_phase4_progress(
            user_id, step=step_id, context='main',
            item_id=f'step{step_id}_submit', item_type='submit',
            prompt=f'Phase 4 Step {step_id} Submission', answer=json.dumps(data),
        )

        return {
            'success': True,
            'message': 'Response submitted successfully'
        }
    except Exception as e:
        logger.error(f"Error submitting Phase 4 step {step_id} response: {e}")
        return JSONResponse({
            'success': False,
            'error': str(e)
        }, status_code=500)


@router.post("/remedial/log")
async def log_remedial_task(request: Request, user: dict = Depends(get_current_user)):
    """
    Log remedial task completion
    """
    try:
        user_id = user["user_id"]
        data = await request.json()

        level = data.get('level', 'Unknown')
        task = data.get('task', 'Unknown')
        score = data.get('score', 0)
        max_score = data.get('max_score', 0)
        time_taken = data.get('time_taken', 0)

        # TERMINAL OUTPUT - Detailed logging
        print("\n" + "="*60)
        print(f"REMEDIAL PHASE - LEVEL {level} - TASK {task}")
        print("="*60)
        print(f"User ID: {user_id}")
        print(f"Score: {score}/{max_score} points")
        print(f"Time Taken: {time_taken} seconds")
        print(f"Success Rate: {(score/max_score)*100:.1f}%")
        print("="*60 + "\n")

        logger.info(f"Remedial {level} Task {task} - User {user_id}: Score={score}/{max_score}, Time={time_taken}s")

        # Save to DB
        save_phase4_progress(
            user_id, step=0, context=f'remedial_{level.lower()}',
            score=score, item_id=f'remedial_{level}_{task}', item_type='remedial',
            prompt=f'Phase 4 Remedial {level} Task {task}',
            answer=json.dumps({'score': score, 'max_score': max_score, 'time_taken': time_taken}),
            is_correct=score >= (max_score * 0.6) if max_score > 0 else None
        )

        return {
            'success': True,
            'message': 'Remedial task logged successfully'
        }

    except Exception as e:
        logger.error(f"Error logging remedial task: {e}")
        return JSONResponse({
            'success': False,
            'error': str(e)
        }, status_code=500)


@router.post("/step/1/calculate-score")
async def calculate_step1_score(request: Request, user: dict = Depends(get_current_user)):
    """
    Calculate Phase 4 Step 1 total score and route every student into the matching
    remedial path, following the upstream routing architecture.
    """
    try:
        user_id = user["user_id"]
        data = await request.json()

        interaction1_score = data.get('interaction1_score', 0)
        interaction2_score = data.get('interaction2_score', 0)
        interaction3_score = data.get('interaction3_score', 0)

        # Validate scores
        if not (0 <= interaction1_score <= 8):
            return JSONResponse({
                'success': False,
                'error': 'Interaction 1 score must be between 0 and 8'
            }, status_code=400)

        if not (0 <= interaction2_score <= 8):
            return JSONResponse({
                'success': False,
                'error': 'Interaction 2 score must be between 0 and 8'
            }, status_code=400)

        if not (1 <= interaction3_score <= 5):
            return JSONResponse({
                'success': False,
                'error': 'Interaction 3 score must be between 1 and 5'
            }, status_code=400)

        total_score = interaction1_score + interaction2_score + interaction3_score
        remedial_level = _phase4_total_to_level(total_score, [(7, 'A1'), (12, 'A2'), (16, 'B1'), (19, 'B2')])
        next_url = _phase4_remedial_start_url(1, remedial_level)

        # TERMINAL OUTPUT - Detailed logging for professor
        print("\n" + "="*60)
        print("PHASE 4 STEP 1 - SCORING RESULTS")
        print("="*60)
        print(f"User ID: {user_id}")
        print(f"I1={interaction1_score}/8, I2={interaction2_score}/8, I3={interaction3_score}/5")
        print(f"TOTAL SCORE: {total_score}/21 points")
        print(f"REMEDIAL LEVEL: Remedial {remedial_level}")
        print(f"ROUTING TO: {next_url}")
        print("="*60 + "\n")

        logger.info(f"Phase 4 Step 1 scoring - User {user_id}: I1={interaction1_score}, I2={interaction2_score}, I3={interaction3_score}, Total={total_score}, Level={remedial_level}")

        # Save to DB
        save_phase4_progress(
            user_id, step=1, interaction=1, context=f'remedial_{remedial_level.lower()}', subphase=1,
            score=total_score, item_id='step1_score', item_type='score',
            prompt='Phase 4 Step 1 Score',
            answer=json.dumps({'i1': interaction1_score, 'i2': interaction2_score, 'i3': interaction3_score}),
            is_correct=False
        )

        return {
            'success': True,
            'data': _phase4_build_main_score_payload(
                [interaction1_score, interaction2_score, interaction3_score],
                [8, 8, 5],
                total_score,
                21,
                remedial_level,
                next_url
            )
        }

    except Exception as e:
        logger.error(f"Error calculating Phase 4 Step 1 score: {e}")
        return JSONResponse({
            'success': False,
            'error': str(e)
        }, status_code=500)


@router.post("/step/3/calculate-score")
async def calculate_step3_score(request: Request, user: dict = Depends(get_current_user)):
    """
    Calculate Phase 4 Step 3 total score and route to the matching remedial level.
    All three interactions are CEFR-scored from 1-5, for a total max score of 15.
    """
    try:
        user_id = user["user_id"]
        data = await request.json()

        interaction1_score = data.get('interaction1_score', 0)
        interaction2_score = data.get('interaction2_score', 0)
        interaction3_score = data.get('interaction3_score', 0)

        if not (1 <= interaction1_score <= 5):
            return JSONResponse({
                'success': False,
                'error': 'Interaction 1 score must be between 1 and 5'
            }, status_code=400)

        if not (1 <= interaction2_score <= 5):
            return JSONResponse({
                'success': False,
                'error': 'Interaction 2 score must be between 1 and 5'
            }, status_code=400)

        if not (1 <= interaction3_score <= 5):
            return JSONResponse({
                'success': False,
                'error': 'Interaction 3 score must be between 1 and 5'
            }, status_code=400)

        total_score = interaction1_score + interaction2_score + interaction3_score

        level_to_name = {1: 'A1', 2: 'A2', 3: 'B1', 4: 'B2', 5: 'C1'}
        interaction1_level = level_to_name.get(interaction1_score, 'A1')
        interaction2_level = level_to_name.get(interaction2_score, 'A1')
        interaction3_level = level_to_name.get(interaction3_score, 'A1')

        if total_score < 4:
            remedial_level = 'Remedial A1'
        elif total_score < 7:
            remedial_level = 'Remedial A2'
        elif total_score < 10:
            remedial_level = 'Remedial B1'
        elif total_score < 13:
            remedial_level = 'Remedial B2'
        else:
            remedial_level = 'Remedial C1'

        next_url = f"/app/phase4/step3/remedial/{remedial_level.split()[-1].lower()}/taskA"

        print("\n" + "="*60)
        print("PHASE 4 STEP 3 - SCORING RESULTS")
        print("="*60)
        print(f"User ID: {user_id}")
        print(f"I1={interaction1_score}, I2={interaction2_score}, I3={interaction3_score}")
        print(f"Total: {total_score}/15, Level: {remedial_level}")
        print(f"ROUTING TO: {next_url}")
        print("="*60 + "\n")

        logger.info(f"Phase 4 Step 3 - User {user_id}: I1={interaction1_score}, I2={interaction2_score}, I3={interaction3_score}, Total={total_score}, Level={remedial_level}")

        save_phase4_progress(
            user_id, step=3, interaction=1, context=f'remedial_{remedial_level.split()[-1].lower()}', subphase=1,
            score=total_score, item_id='step3_score', item_type='score',
            prompt='Phase 4 Step 3 Score',
            answer=json.dumps({'i1': interaction1_score, 'i2': interaction2_score, 'i3': interaction3_score}),
            is_correct=False
        )

        return {
            'success': True,
            'data': {
                'interaction1': {
                    'score': interaction1_score,
                    'max_score': 5,
                    'level': interaction1_level
                },
                'interaction2': {
                    'score': interaction2_score,
                    'max_score': 5,
                    'level': interaction2_level
                },
                'interaction3': {
                    'score': interaction3_score,
                    'max_score': 5,
                    'level': interaction3_level
                },
                'total': {
                    'score': total_score,
                    'max_score': 15,
                    'remedial_level': remedial_level,
                    'should_proceed': False,
                    'next_url': next_url
                }
            }
        }

    except Exception as e:
        logger.error(f"Error calculating Phase 4 Step 3 score: {e}")
        return JSONResponse({
            'success': False,
            'error': str(e)
        }, status_code=500)


@router.post("/remedial/a1/final-score")
async def calculate_a1_final_score(request: Request, user: dict = Depends(get_current_user)):
    """
    Calculate and log Remedial A1 final score
    Pass threshold: >= 13/16
    """
    try:
        user_id = user["user_id"]
        data = await request.json()

        task_a_score = data.get('task_a_score', 0)
        task_b_score = data.get('task_b_score', 0)
        total_score = task_a_score + task_b_score
        passed = total_score >= 13
        next_url = _phase4_next_step_url(1) if passed else _phase4_retry_url(1, 'A1')

        # TERMINAL OUTPUT - Detailed logging for professor
        print("\n" + "="*60)
        print("REMEDIAL A1 - FINAL ASSESSMENT")
        print("="*60)
        print(f"User ID: {user_id}")
        print(f"\nTask A (Drag-Drop Matching):")
        print(f"  Score: {task_a_score}/8 points")
        print(f"\nTask B (Wordle Game):")
        print(f"  Score: {task_b_score}/8 points")
        print(f"\n" + "-"*60)
        print(f"TOTAL SCORE: {total_score}/16 points")
        print(f"PASS THRESHOLD: 13/16 points")
        print(f"RESULT: {'PASSED' if passed else 'FAILED - RETRY REQUIRED'}")
        print("="*60 + "\n")

        logger.info(f"Remedial A1 Final - User {user_id}: TaskA={task_a_score}, TaskB={task_b_score}, Total={total_score}, Passed={passed}, Next={next_url}")

        return {
            'success': True,
            'data': {
                'task_a_score': task_a_score,
                'task_b_score': task_b_score,
                'total_score': total_score,
                'max_score': 16,
                'passed': passed,
                'pass_threshold': 13,
                'next_url': next_url
            }
        }

    except Exception as e:
        logger.error(f"Error calculating A1 final score: {e}")
        return JSONResponse({
            'success': False,
            'error': str(e)
        }, status_code=500)


@router.post("/remedial/a2/final-score")
async def calculate_a2_final_score(request: Request, user: dict = Depends(get_current_user)):
    """
    Calculate and log Remedial A2 final score
    Pass threshold: >= 13/16
    """
    try:
        user_id = user["user_id"]
        data = await request.json()

        task_a_score = data.get('task_a_score', 0)
        task_b_score = data.get('task_b_score', 0)
        total_score = task_a_score + task_b_score
        passed = total_score >= 13
        next_url = _phase4_next_step_url(1) if passed else _phase4_retry_url(1, 'A2')

        # TERMINAL OUTPUT - Detailed logging for professor
        print("\n" + "="*60)
        print("REMEDIAL A2 - FINAL ASSESSMENT")
        print("="*60)
        print(f"User ID: {user_id}")
        print(f"\nTask A (Chat Challenge):")
        print(f"  Score: {task_a_score}/8 points")
        print(f"\nTask B (Expand Quest):")
        print(f"  Score: {task_b_score}/8 points")
        print(f"\n" + "-"*60)
        print(f"TOTAL SCORE: {total_score}/16 points")
        print(f"PASS THRESHOLD: 13/16 points")
        print(f"RESULT: {'PASSED' if passed else 'FAILED - RETRY REQUIRED'}")
        print("="*60 + "\n")

        logger.info(f"Remedial A2 Final - User {user_id}: TaskA={task_a_score}, TaskB={task_b_score}, Total={total_score}, Passed={passed}, Next={next_url}")

        return {
            'success': True,
            'data': {
                'task_a_score': task_a_score,
                'task_b_score': task_b_score,
                'total_score': total_score,
                'max_score': 16,
                'passed': passed,
                'pass_threshold': 13,
                'next_url': next_url
            }
        }

    except Exception as e:
        logger.error(f"Error calculating A2 final score: {e}")
        return JSONResponse({
            'success': False,
            'error': str(e)
        }, status_code=500)


@router.post("/remedial/b1/final-score")
async def calculate_b1_final_score(request: Request, user: dict = Depends(get_current_user)):
    """
    Calculate and log Remedial B1 final score
    Pass threshold: >= 22/27
    """
    try:
        user_id = user["user_id"]
        data = await request.json()

        task_a_score = data.get('task_a_score', 0)
        task_b_score = data.get('task_b_score', 0)
        task_c_score = data.get('task_c_score', 0)
        task_d_score = data.get('task_d_score', 0)
        total_score = task_a_score + task_b_score + task_c_score + task_d_score
        passed = total_score >= 22
        next_url = _phase4_next_step_url(1) if passed else _phase4_retry_url(1, 'B1')

        # TERMINAL OUTPUT - Detailed logging for professor
        print("\n" + "="*60)
        print("REMEDIAL B1 - FINAL ASSESSMENT")
        print("="*60)
        print(f"User ID: {user_id}")
        print(f"\nTask A (Dialogue):")
        print(f"  Score: {task_a_score}/5 points")
        print(f"\nTask B (Proposals):")
        print(f"  Score: {task_b_score}/8 points")
        print(f"\nTask C (Quiz):")
        print(f"  Score: {task_c_score}/6 points")
        print(f"\nTask D (Matching):")
        print(f"  Score: {task_d_score}/8 points")
        print(f"\n" + "-"*60)
        print(f"TOTAL SCORE: {total_score}/27 points")
        print(f"PASS THRESHOLD: 22/27 points")
        print(f"RESULT: {'PASSED' if passed else 'FAILED - RETRY REQUIRED'}")
        print("="*60 + "\n")

        logger.info(f"Remedial B1 Final - User {user_id}: TaskA={task_a_score}, TaskB={task_b_score}, TaskC={task_c_score}, TaskD={task_d_score}, Total={total_score}, Passed={passed}, Next={next_url}")

        return {
            'success': True,
            'data': {
                'task_a_score': task_a_score,
                'task_b_score': task_b_score,
                'task_c_score': task_c_score,
                'task_d_score': task_d_score,
                'total_score': total_score,
                'max_score': 27,
                'passed': passed,
                'pass_threshold': 22,
                'next_url': next_url
            }
        }

    except Exception as e:
        logger.error(f"Error calculating B1 final score: {e}")
        return JSONResponse({
            'success': False,
            'error': str(e)
        }, status_code=500)


@router.post("/remedial/b2/final-score")
async def calculate_b2_final_score(request: Request, user: dict = Depends(get_current_user)):
    """
    Calculate and log Remedial B2 final score
    Pass threshold: >= 24/30
    """
    try:
        user_id = user["user_id"]
        data = await request.json()

        task_a_score = data.get('task_a_score', 0)
        task_b_score = data.get('task_b_score', 0)
        task_c_score = data.get('task_c_score', 0)
        task_d_score = data.get('task_d_score', 0)
        total_score = task_a_score + task_b_score + task_c_score + task_d_score
        passed = total_score >= 24
        next_url = _phase4_next_step_url(1) if passed else _phase4_retry_url(1, 'B2')

        # TERMINAL OUTPUT - Detailed logging for professor
        print("\n" + "="*60)
        print("REMEDIAL B2 - FINAL ASSESSMENT")
        print("="*60)
        print(f"User ID: {user_id}")
        print(f"\nTask A (Role-Play RPG):")
        print(f"  Score: {task_a_score}/8 points")
        print(f"\nTask B (Compare Quest):")
        print(f"  Score: {task_b_score}/8 points")
        print(f"\nTask C (Sushi Spell):")
        print(f"  Score: {task_c_score}/8 points")
        print(f"\nTask D (Kahoot Quiz):")
        print(f"  Score: {task_d_score}/6 points")
        print(f"\n" + "-"*60)
        print(f"TOTAL SCORE: {total_score}/30 points")
        print(f"PASS THRESHOLD: 24/30 points")
        print(f"RESULT: {'PASSED' if passed else 'FAILED - RETRY REQUIRED'}")
        print("="*60 + "\n")

        logger.info(f"Remedial B2 Final - User {user_id}: TaskA={task_a_score}, TaskB={task_b_score}, TaskC={task_c_score}, TaskD={task_d_score}, Total={total_score}, Passed={passed}, Next={next_url}")

        return {
            'success': True,
            'data': {
                'task_a_score': task_a_score,
                'task_b_score': task_b_score,
                'task_c_score': task_c_score,
                'task_d_score': task_d_score,
                'total_score': total_score,
                'max_score': 30,
                'passed': passed,
                'pass_threshold': 24,
                'next_url': next_url
            }
        }

    except Exception as e:
        logger.error(f"Error calculating B2 final score: {e}")
        return JSONResponse({
            'success': False,
            'error': str(e)
        }, status_code=500)


@router.post("/remedial/c1/final-score")
async def calculate_c1_final_score(request: Request, user: dict = Depends(get_current_user)):
    """
    Calculate and log Remedial C1 final score
    Pass threshold: >= 16/19
    """
    try:
        user_id = user["user_id"]
        data = await request.json()

        task_a_score = data.get('task_a_score', 0)
        task_b_score = data.get('task_b_score', 0)
        task_c_score = data.get('task_c_score', 0)
        task_d_score = data.get('task_d_score', 0)
        total_score = task_a_score + task_b_score + task_c_score + task_d_score
        passed = total_score >= 16
        next_url = _phase4_next_step_url(1) if passed else _phase4_retry_url(1, 'C1')

        # TERMINAL OUTPUT - Detailed logging for professor
        print("\n" + "="*60)
        print("REMEDIAL C1 - FINAL ASSESSMENT")
        print("="*60)
        print(f"User ID: {user_id}")
        print(f"\nTask A (Debate Duel):")
        print(f"  Score: {task_a_score}/4 points")
        print(f"\nTask B (Critique Challenge):")
        print(f"  Score: {task_b_score}/8 points")
        print(f"\nTask C (Wordshake):")
        print(f"  Score: {task_c_score}/6 points")
        print(f"\nTask D (Live Debate):")
        print(f"  Score: {task_d_score}/1 points")
        print(f"\n" + "-"*60)
        print(f"TOTAL SCORE: {total_score}/19 points")
        print(f"PASS THRESHOLD: 16/19 points")
        print(f"RESULT: {'PASSED' if passed else 'FAILED - RETRY REQUIRED'}")
        print("="*60 + "\n")

        logger.info(f"Remedial C1 Final - User {user_id}: TaskA={task_a_score}, TaskB={task_b_score}, TaskC={task_c_score}, TaskD={task_d_score}, Total={total_score}, Passed={passed}, Next={next_url}")

        return {
            'success': True,
            'data': {
                'task_a_score': task_a_score,
                'task_b_score': task_b_score,
                'task_c_score': task_c_score,
                'task_d_score': task_d_score,
                'total_score': total_score,
                'max_score': 19,
                'passed': passed,
                'pass_threshold': 16,
                'next_url': next_url
            }
        }

    except Exception as e:
        logger.error(f"Error calculating C1 final score: {e}")
        return JSONResponse({
            'success': False,
            'error': str(e)
        }, status_code=500)


@router.post("/evaluate-writing")
async def evaluate_writing(request: Request):
    """
    Evaluate B2 comparison writing with AI
    Returns score: 1 (correct) or 0 (incorrect)
    """
    try:
        data = await request.json()
        question = data.get('question', '')
        answer = data.get('answer', '').strip()
        level = data.get('level', 'B2')
        task_type = data.get('task', 'comparison')
        criteria = data.get('criteria', {})

        glossary_terms = criteria.get('glossaryTerms', [])
        requires_comparison = criteria.get('requiresComparison', True)

        if not answer:
            return {
                'score': 0,
                'feedback': 'Please write your comparison.'
            }

        # Check minimum length
        if len(answer.split()) < 5:
            return {
                'score': 0,
                'feedback': 'Your answer is too short. Please provide more detail.'
            }

        # Use AI evaluation if available
        if ai_service.client:
            try:
                system_prompt = f"""You are a CEFR {level} language assessment expert evaluating comparison writing.

Evaluate the student's answer based on:
1. Uses comparative language (while, whereas, compared to, unlike, in contrast, better than, etc.)
2. Addresses the question logically
3. Uses appropriate marketing/promotional vocabulary
4. Makes a clear comparison between two things
5. Is coherent and relevant

IMPORTANT:
- Be FLEXIBLE at {level} level - accept answers that show effort even if grammar isn't perfect
- Focus on whether they made a COMPARISON and used relevant terminology
- Score 1 (correct) if the answer shows understanding and attempts comparison
- Score 0 (incorrect) only if the answer is completely irrelevant, nonsensical, or shows no effort

Respond ONLY in JSON format:
{{
    "score": 1 or 0,
    "feedback": "Brief encouraging feedback (1-2 sentences, no examples)"
}}"""

                user_prompt = f"""
Question: {question}

Available glossary terms: {', '.join(glossary_terms)}

Student's Answer:
"{answer}"

Does this answer demonstrate comparison writing at {level} level?
Return ONLY valid JSON."""

                ai_response = ai_service.client.chat.completions.create(
                    model=ai_service.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    max_tokens=200,
                    temperature=0.3
                )

                result_text = ai_response.choices[0].message.content.strip()

                # Parse JSON
                if '```json' in result_text:
                    result_text = result_text.split('```json')[1].split('```')[0]
                elif '```' in result_text:
                    result_text = result_text.split('```')[1].split('```')[0]

                result = json.loads(result_text.strip())

                return {
                    'score': result.get('score', 1),
                    'feedback': result.get('feedback', 'Good comparison!')
                }

            except Exception as e:
                logger.error(f"AI evaluation error: {str(e)}")
                # Fall through to local evaluation

        # Fallback: Local evaluation
        answer_lower = answer.lower()

        # Check for comparative language
        comparative_words = ['while', 'whereas', 'compared to', 'unlike', 'in contrast', 'better than',
                            'worse than', 'more', 'less', 'differ', 'difference', 'but', 'however']
        has_comparison = any(word in answer_lower for word in comparative_words)

        # Check for glossary terms
        terms_used = sum(1 for term in glossary_terms if term.lower() in answer_lower)

        # Determine score
        if has_comparison and len(answer.split()) >= 5:
            score = 1
            if terms_used > 0:
                feedback = f"Good comparison! You used relevant terminology."
            else:
                feedback = "Good comparison! Try to include more marketing terms."
        else:
            score = 0
            if not has_comparison:
                feedback = "Try to make a clear comparison using words like 'while', 'whereas', or 'compared to'."
            else:
                feedback = "Please provide more detail in your comparison."

        return {
            'score': score,
            'feedback': feedback
        }

    except Exception as e:
        logger.error(f"Evaluation error: {str(e)}")
        return {
            'score': 0,
            'feedback': 'Unable to evaluate answer. Please try again.'
        }


@router.post("/step3/remedial/a1/final-score")
async def calculate_step3_a1_final_score(request: Request, user: dict = Depends(get_current_user)):
    """
    Calculate and log Phase 4 Step 3 Remedial A1 final score
    Pass threshold: >= 18/22 (~82%)
    """
    try:
        user_id = user["user_id"]
        data = await request.json()

        task_a_score = data.get('task_a_score', 0)
        task_b_score = data.get('task_b_score', 0)
        task_c_score = data.get('task_c_score', 0)
        total_score = task_a_score + task_b_score + task_c_score
        passed = total_score >= 18
        next_url = "/app/phase4/step/4" if passed else "/app/phase4/step3/remedial/a1/retry"

        # TERMINAL OUTPUT - Detailed logging for professor
        print("\n" + "="*60)
        print("PHASE 4 STEP 3 - REMEDIAL A1 - FINAL ASSESSMENT")
        print("="*60)
        print(f"User ID: {user_id}")
        print(f"\nTask A (Term Treasure Hunt):")
        print(f"  Score: {task_a_score}/8 points")
        print(f"\nTask B (Fill Quest):")
        print(f"  Score: {task_b_score}/8 points")
        print(f"\nTask C (Sentence Builder):")
        print(f"  Score: {task_c_score}/6 points")
        print(f"\n" + "-"*60)
        print(f"TOTAL SCORE: {total_score}/22 points")
        print(f"PASS THRESHOLD: 18/22 points (~82%)")
        print(f"RESULT: {'PASSED' if passed else 'FAILED - RETRY REQUIRED'}")
        print(f"NEXT URL: {next_url}")
        print("="*60 + "\n")

        logger.info(f"Phase 4 Step 3 Remedial A1 Final - User {user_id}: TaskA={task_a_score}, TaskB={task_b_score}, TaskC={task_c_score}, Total={total_score}, Passed={passed}")

        return {
            'success': True,
            'data': {
                'task_a_score': task_a_score,
                'task_b_score': task_b_score,
                'task_c_score': task_c_score,
                'total_score': total_score,
                'max_score': 22,
                'passed': passed,
                'pass_threshold': 18,
                'next_url': next_url
            }
        }

    except Exception as e:
        logger.error(f"Error calculating Step 3 A1 final score: {e}")
        return JSONResponse({
            'success': False,
            'error': str(e)
        }, status_code=500)


@router.post("/step3/remedial/a2/final-score")
async def calculate_step3_a2_final_score(request: Request, user: dict = Depends(get_current_user)):
    """
    Calculate and log Phase 4 Step 3 Remedial A2 final score
    Pass threshold: >= 18/22 (~82%)
    """
    try:
        user_id = user["user_id"]
        data = await request.json()

        task_a_score = data.get('task_a_score', 0)
        task_b_score = data.get('task_b_score', 0)
        task_c_score = data.get('task_c_score', 0)
        total_score = task_a_score + task_b_score + task_c_score
        passed = total_score >= 18
        next_url = "/app/phase4/step/4" if passed else "/app/phase4/step3/remedial/a2/retry"

        # TERMINAL OUTPUT - Detailed logging for professor
        print("\n" + "="*60)
        print("PHASE 4 STEP 3 - REMEDIAL A2 - FINAL ASSESSMENT")
        print("="*60)
        print(f"User ID: {user_id}")
        print(f"\nTask A (Dialogue Adventure):")
        print(f"  Score: {task_a_score}/8 points")
        print(f"\nTask B (Expand Empire):")
        print(f"  Score: {task_b_score}/8 points")
        print(f"\nTask C (Connector Quest):")
        print(f"  Score: {task_c_score}/6 points")
        print(f"\n" + "-"*60)
        print(f"TOTAL SCORE: {total_score}/22 points")
        print(f"PASS THRESHOLD: 18/22 points (~82%)")
        print(f"RESULT: {'PASSED' if passed else 'FAILED - RETRY REQUIRED'}")
        print(f"NEXT URL: {next_url}")
        print("="*60 + "\n")

        logger.info(f"Phase 4 Step 3 Remedial A2 Final - User {user_id}: TaskA={task_a_score}, TaskB={task_b_score}, TaskC={task_c_score}, Total={total_score}, Passed={passed}")

        return {
            'success': True,
            'data': {
                'task_a_score': task_a_score,
                'task_b_score': task_b_score,
                'task_c_score': task_c_score,
                'total_score': total_score,
                'max_score': 22,
                'passed': passed,
                'pass_threshold': 18,
                'next_url': next_url
            }
        }

    except Exception as e:
        logger.error(f"Error calculating Step 3 A2 final score: {e}")
        return JSONResponse({
            'success': False,
            'error': str(e)
        }, status_code=500)


@router.post("/evaluate-simple-sentences")
async def evaluate_simple_sentences(request: Request):
    """
    Evaluate multiple A1 sentences with AI in a single call
    Returns: list of {isCorrect: True/False} for each sentence
    """
    try:
        data = await request.json()
        sentences = data.get('sentences', [])

        if not sentences:
            return JSONResponse({
                'success': False,
                'error': 'No sentences provided'
            }, status_code=400)

        # Use AI evaluation if available
        if ai_service.client:
            try:
                # Build evaluation prompt for all sentences at once
                sentences_text = ""
                for idx, sent in enumerate(sentences, 1):
                    sentences_text += f"\nSentence {idx}:\n"
                    sentences_text += f"  Term: {sent.get('term', '')}\n"
                    sentences_text += f"  Hint: {sent.get('hint', '')}\n"
                    sentences_text += f"  Student Answer: \"{sent.get('userAnswer', '')}\"\n"

                system_prompt = """You are evaluating A1 level English sentences for a language learning exercise.

For EACH sentence, evaluate if it is correct based on these criteria:
1. Uses present simple tense correctly (is, has, be, are)
2. Contains the required term (IGNORE minor spelling mistakes - accept if 80%+ letters are correct)
3. Meaning is clear and makes sense

IMPORTANT - BE FLEXIBLE:
- Accept minor spelling mistakes (e.g., "promotinal" for "promotional")
- Accept simple grammar variations (e.g., "The ad is..." or "Ad is...")
- Focus on: Does it use the term? Does it use present simple? Is meaning clear?

Respond ONLY with valid JSON array with exactly one result per sentence:
{
    "results": [
        {"isCorrect": true},
        {"isCorrect": false},
        ...
    ]
}"""

                user_prompt = f"""Evaluate these {len(sentences)} A1 sentences:{sentences_text}

Return ONLY valid JSON with results array."""

                ai_response = ai_service.client.chat.completions.create(
                    model=ai_service.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    max_tokens=300,
                    temperature=0.2
                )

                result_text = ai_response.choices[0].message.content.strip()

                # Parse JSON
                if '```json' in result_text:
                    result_text = result_text.split('```json')[1].split('```')[0]
                elif '```' in result_text:
                    result_text = result_text.split('```')[1].split('```')[0]

                result = json.loads(result_text.strip())

                # Validate results length
                if 'results' in result and len(result['results']) == len(sentences):
                    return {
                        'success': True,
                        'results': result['results']
                    }
                else:
                    logger.warning(f"AI returned incorrect number of results: expected {len(sentences)}, got {len(result.get('results', []))}")
                    # Fall through to local evaluation

            except Exception as e:
                logger.error(f"AI batch sentence evaluation error: {str(e)}")
                # Fall through to local evaluation

        # Fallback: Local evaluation for all sentences
        results = []
        for sent in sentences:
            user_answer = sent.get('userAnswer', '').strip().lower()
            term = sent.get('term', '').lower()

            # Simple check
            has_term = term in user_answer
            has_verb = any(verb in user_answer for verb in ['is', 'are', 'has', 'have', 'be'])
            is_valid = has_term and has_verb and len(user_answer.split()) >= 3

            results.append({'isCorrect': is_valid})

        return {
            'success': True,
            'results': results
        }

    except Exception as e:
        logger.error(f"Batch sentence evaluation error: {str(e)}")
        return JSONResponse({
            'success': False,
            'error': str(e)
        }, status_code=500)


@router.post("/evaluate-simple-sentence")
async def evaluate_simple_sentence(request: Request):
    """
    Evaluate simple A1 sentence with AI
    Returns: isCorrect (True/False)
    """
    try:
        data = await request.json()
        term = data.get('term', '')
        hint = data.get('hint', '')
        user_answer = data.get('userAnswer', '').strip()
        correct_answer = data.get('correctAnswer', '')

        if not user_answer:
            return {
                'success': True,
                'isCorrect': False
            }

        # Check minimum length
        if len(user_answer.split()) < 3:
            return {
                'success': True,
                'isCorrect': False
            }

        # Use AI evaluation if available
        if ai_service.client:
            try:
                system_prompt = f"""You are evaluating A1 level English sentences for a language learning exercise.

Evaluate if the student's sentence is correct based on these criteria:
1. Uses present simple tense correctly (is, has, be, are)
2. Contains the term "{term}" (IGNORE minor spelling mistakes - accept if 80%+ letters are correct)
3. Meaning is clear and makes sense
4. Follows the hint: {hint}

IMPORTANT - BE FLEXIBLE:
- Accept minor spelling mistakes (e.g., "promotinal" for "promotional")
- Accept simple grammar variations (e.g., "The ad is..." or "Ad is...")
- Focus on: Does it use the term? Does it use present simple? Is meaning clear?

Example correct answers:
- "{correct_answer}"
- Variations with minor spelling/grammar differences

Respond ONLY with valid JSON:
{{
    "isCorrect": true or false
}}"""

                user_prompt = f"""
Term: {term}
Hint: {hint}
Student's Answer: "{user_answer}"

Is this sentence correct at A1 level? Remember to ignore minor spelling mistakes.
Return ONLY valid JSON."""

                ai_response = ai_service.client.chat.completions.create(
                    model=ai_service.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    max_tokens=100,
                    temperature=0.2
                )

                result_text = ai_response.choices[0].message.content.strip()

                # Parse JSON
                if '```json' in result_text:
                    result_text = result_text.split('```json')[1].split('```')[0]
                elif '```' in result_text:
                    result_text = result_text.split('```')[1].split('```')[0]

                result = json.loads(result_text.strip())

                return {
                    'success': True,
                    'isCorrect': result.get('isCorrect', False)
                }

            except Exception as e:
                logger.error(f"AI sentence evaluation error: {str(e)}")
                # Fall through to local evaluation

        # Fallback: Local evaluation
        answer_lower = user_answer.lower()
        term_lower = term.lower()

        # Check for term (flexible)
        has_term = term_lower in answer_lower

        # Check for present simple verbs
        has_verb = any(verb in answer_lower for verb in ['is', 'are', 'has', 'have', 'be'])

        # Simple evaluation
        is_correct = has_term and has_verb and len(user_answer.split()) >= 3

        return {
            'success': True,
            'isCorrect': is_correct
        }

    except Exception as e:
        logger.error(f"Simple sentence evaluation error: {str(e)}")
        return JSONResponse({
            'success': False,
            'isCorrect': False,
            'error': str(e)
        }, status_code=500)


@router.post("/evaluate-definition")
async def evaluate_definition(request: Request):
    """
    Evaluate vocabulary definition with AI (for Step 2 Interaction 1)
    Returns score: 1-5 (CEFR A1-C1)
    """
    try:
        data = await request.json()
        question = data.get('question', '')
        answer = data.get('answer', '').strip()
        term = data.get('term', 'persuasive')
        context = data.get('context', 'advertising')
        expected_concepts = data.get('expectedConcepts', [])
        target_level = data.get('level', 'B1')

        if not answer:
            return {
                'score': 0,
                'level': 'Below A1',
                'feedback': f'Please write your definition of "{term}".'
            }

        # Check minimum length
        if len(answer.split()) < 3:
            return {
                'score': 1,
                'level': 'A1',
                'feedback': 'Your answer is very short. Try to provide more detail.'
            }

        # Use AI evaluation if available
        if ai_service.client:
            try:
                # Specific prompts based on term
                if term.lower() == 'persuasive':
                    scoring_guide = """
CEFR Scoring Guidelines for "persuasive":
- A1 (score 1): "Persuasive is make buy. Video say convince." (basic, fragmented)
- A2 (score 2): "Persuasive is to convince people to buy, like video say with feelings." (simple with basic concepts)
- B1 (score 3): "Persuasive means using ethos, pathos, logos to make the poster convince viewers the product is better, as the video explained for ads." (clear with specific concepts)
- B2 (score 4): "Persuasive advertising in posters involves emotional, logical, and credible appeals to demonstrate superiority over competitors, as detailed in the video's pathos/ethos/logos section." (detailed with multiple appeals)
- C1 (score 5): "Persuasive techniques for posters draw on ethos (authority), pathos (emotions), and logos (logic) to influence purchasing habits by highlighting product superiority, mirroring the video's emphasis on convincing consumers effectively without overt pressure." (sophisticated, nuanced understanding)
"""
                elif term.lower() == 'dramatisation':
                    scoring_guide = """
CEFR Scoring Guidelines for "dramatisation":
- A1 (score 1): "Dramatisation is story. Video show people try." (basic, fragmented)
- A2 (score 2): "Dramatisation is story with goal in video, like first video say character try something." (simple with goal mentioned)
- B1 (score 3): "Dramatisation is creating a sketch with relatable character, clear goal, and obstacles to engage, as the first video explained for short films." (clear with character/goal/obstacles)
- B2 (score 4): "Dramatisation uses scripted scenes with character goals and visual obstacles for emotional impact, as illustrated in the first video's drama principles and second's small ideas for seamless ads." (detailed with emotional impact)
- C1 (score 5): "Dramatisation employs theatrical storytelling with relatable characters facing filmable goals and obstacles to captivate viewers persuasively, as the first video's principles demonstrate, aligning with the second video's advocacy for small, frictionless ideas that integrate products naturally." (sophisticated with both videos referenced)
"""
                else:
                    scoring_guide = f"""
CEFR Scoring Guidelines:
- A1 (score 1): Very simple, fragmented definition
- A2 (score 2): Simple definition with basic concepts
- B1 (score 3): Clear definition with specific concepts mentioned
- B2 (score 4): Detailed definition with multiple concepts and clear application
- C1 (score 5): Sophisticated definition with nuanced understanding
"""

                system_prompt = f"""You are a CEFR language assessment expert evaluating vocabulary definitions.

Evaluate the student's definition of "{term}" in the context of {context}.

{scoring_guide}

Expected concepts: {', '.join(expected_concepts)}

Respond ONLY in JSON format:
{{
    "score": 1-5,
    "level": "A1" | "A2" | "B1" | "B2" | "C1",
    "feedback": "Encouraging feedback (1-2 sentences)"
}}"""

                user_prompt = f"""
Question: {question}

Student's Answer:
"{answer}"

Evaluate this definition and assign a CEFR level.
Return ONLY valid JSON."""

                ai_response = ai_service.client.chat.completions.create(
                    model=ai_service.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    max_tokens=150,
                    temperature=0.3
                )

                result_text = ai_response.choices[0].message.content.strip()

                # Parse JSON
                if '```json' in result_text:
                    result_text = result_text.split('```json')[1].split('```')[0]
                elif '```' in result_text:
                    result_text = result_text.split('```')[1].split('```')[0]

                result = json.loads(result_text.strip())

                return {
                    'score': result.get('score', 3),
                    'level': result.get('level', 'B1'),
                    'feedback': result.get('feedback', 'Good definition!')
                }

            except Exception as e:
                logger.error(f"AI definition evaluation error: {str(e)}")
                # Fall through to local evaluation

        # Fallback: Local evaluation
        answer_lower = answer.lower()

        # Check for key concepts
        has_convince = 'convince' in answer_lower or 'persuade' in answer_lower
        has_ethos = 'ethos' in answer_lower or 'credible' in answer_lower or 'authority' in answer_lower
        has_pathos = 'pathos' in answer_lower or 'emotion' in answer_lower or 'feeling' in answer_lower
        has_logos = 'logos' in answer_lower or 'logic' in answer_lower or 'reason' in answer_lower

        # Count rhetorical appeals
        appeal_count = sum([has_ethos, has_pathos, has_logos])
        word_count = len(answer.split())

        # Determine score and level
        if appeal_count >= 2 and word_count >= 20:
            score = 5
            level = 'C1'
            feedback = 'Excellent! Your definition shows sophisticated understanding of persuasive techniques.'
        elif appeal_count >= 2 or (appeal_count == 1 and word_count >= 15):
            score = 4
            level = 'B2'
            feedback = 'Very good! You mentioned key persuasive concepts with good detail.'
        elif appeal_count >= 1 and has_convince:
            score = 3
            level = 'B1'
            feedback = 'Good definition! You mentioned key concepts from the video.'
        elif has_convince and word_count >= 7:
            score = 2
            level = 'A2'
            feedback = 'Good start! Try to include concepts like ethos, pathos, or logos.'
        else:
            score = 1
            level = 'A1'
            feedback = 'Basic definition. Watch the video again and include concepts like ethos, pathos, or logos.'

        return {
            'score': score,
            'level': level,
            'feedback': feedback
        }

    except Exception as e:
        logger.error(f"Definition evaluation error: {str(e)}")
        return {
            'score': 1,
            'level': 'A1',
            'feedback': 'Unable to evaluate answer. Please try again.'
        }


@router.post("/step3/remedial/b2/final-score")
async def calculate_step3_b2_final_score(request: Request, user: dict = Depends(get_current_user)):
    """
    Calculate and log Phase 4 Step 3 Remedial B2 final score
    Tasks: A-F
    Pass threshold: >= 35/44 (~80%)
    """
    try:
        user_id = user["user_id"]
        data = await request.json()

        task_a_score = data.get('task_a_score', 0)
        task_b_score = data.get('task_b_score', 0)
        task_c_score = data.get('task_c_score', 0)
        task_d_score = data.get('task_d_score', 0)
        task_e_score = data.get('task_e_score', 0)
        task_f_score = data.get('task_f_score', 0)
        total_score = task_a_score + task_b_score + task_c_score + task_d_score + task_e_score + task_f_score
        passed = total_score >= 35
        next_url = "/app/phase4/step/4" if passed else "/app/phase4/step3/remedial/b2/retry"

        # TERMINAL OUTPUT - Detailed logging for professor
        print("\n" + "="*60)
        print("PHASE 4 STEP 3 - REMEDIAL B2 - FINAL ASSESSMENT")
        print("="*60)
        print(f"User ID: {user_id}")
        print(f"\nTask A (Role-Play Saga):         {task_a_score}/10 points")
        print(f"Task B (Explain Expedition):     {task_b_score}/8 points")
        print(f"Task C:                          {task_c_score}/8 points")
        print(f"Task D:                          {task_d_score}/6 points")
        print(f"Task E:                          {task_e_score}/6 points")
        print(f"Task F:                          {task_f_score}/6 points")
        print(f"\n" + "-"*60)
        print(f"TOTAL SCORE: {total_score}/44 points")
        print(f"PASS THRESHOLD: 35/44 points (~80%)")
        print(f"RESULT: {'PASSED' if passed else 'FAILED - RETRY REQUIRED'}")
        print(f"NEXT URL: {next_url}")
        print("="*60 + "\n")

        logger.info(f"Phase 4 Step 3 Remedial B2 Final - User {user_id}: TaskA={task_a_score}, TaskB={task_b_score}, TaskC={task_c_score}, TaskD={task_d_score}, TaskE={task_e_score}, TaskF={task_f_score}, Total={total_score}, Passed={passed}")

        return {
            'success': True,
            'data': {
                'task_a_score': task_a_score,
                'task_b_score': task_b_score,
                'task_c_score': task_c_score,
                'task_d_score': task_d_score,
                'task_e_score': task_e_score,
                'task_f_score': task_f_score,
                'total_score': total_score,
                'max_score': 44,
                'passed': passed,
                'pass_threshold': 35,
                'next_url': next_url
            }
        }

    except Exception as e:
        logger.error(f"Error calculating Step 3 B2 final score: {e}")
        return JSONResponse({
            'success': False,
            'error': str(e)
        }, status_code=500)


@router.post("/step3/remedial/b1/final-score")
async def calculate_step3_b1_final_score(request: Request, user: dict = Depends(get_current_user)):
    """
    Calculate and log Phase 4 Step 3 Remedial B1 final score
    Pass threshold: >= 22/27 (~81%)
    Required tasks: A (5), B (8), C (6), D (8)
    Bonus tasks: E (6), F (6)
    """
    try:
        user_id = user["user_id"]
        data = await request.json()

        task_a_score = data.get('task_a_score', 0)  # Negotiation Battle
        task_b_score = data.get('task_b_score', 0)  # Definition Duel
        task_c_score = data.get('task_c_score', 0)  # Wordshake Quiz
        task_d_score = data.get('task_d_score', 0)  # Flashcard Game
        task_e_score = data.get('task_e_score', 0)  # Tense Time Travel (bonus)
        task_f_score = data.get('task_f_score', 0)  # Grammar Kahoot (bonus)

        # Calculate required task total (A-D)
        required_total = task_a_score + task_b_score + task_c_score + task_d_score

        # Calculate bonus total (E-F)
        bonus_total = task_e_score + task_f_score

        # Overall total
        total_score = required_total + bonus_total

        # Pass based on required tasks only
        passed = required_total >= 22
        next_url = "/app/phase4/step/4" if passed else "/app/phase4/step3/remedial/b1/retry"

        # TERMINAL OUTPUT - Detailed logging for professor
        print("\n" + "="*60)
        print("PHASE 4 STEP 3 - REMEDIAL B1 - FINAL ASSESSMENT")
        print("="*60)
        print(f"User ID: {user_id}")
        print(f"\nREQUIRED TASKS:")
        print(f"  Task A (Negotiation Battle):    {task_a_score}/5 points")
        print(f"  Task B (Definition Duel):        {task_b_score}/8 points")
        print(f"  Task C (Wordshake Quiz):         {task_c_score}/6 points")
        print(f"  Task D (Flashcard Game):         {task_d_score}/8 points")
        print(f"  Required Tasks Subtotal:         {required_total}/27 points")
        print(f"\nBONUS TASKS:")
        print(f"  Task E (Tense Time Travel):      {task_e_score}/6 points")
        print(f"  Task F (Grammar Kahoot):         {task_f_score}/6 points")
        print(f"  Bonus Tasks Subtotal:            {bonus_total}/12 points")
        print(f"\n" + "-"*60)
        print(f"TOTAL SCORE (Required + Bonus):  {total_score}/39 points")
        print(f"REQUIRED TASKS SCORE:             {required_total}/27 points")
        print(f"PASS THRESHOLD:                   22/27 points (~81%)")
        print(f"RESULT: {'PASSED' if passed else 'FAILED - RETRY REQUIRED'}")
        print(f"NEXT URL: {next_url}")
        print("="*60 + "\n")

        logger.info(f"Phase 4 Step 3 Remedial B1 Final - User {user_id}: TaskA={task_a_score}, TaskB={task_b_score}, TaskC={task_c_score}, TaskD={task_d_score}, TaskE={task_e_score}, TaskF={task_f_score}, Required={required_total}, Bonus={bonus_total}, Total={total_score}, Passed={passed}")

        return {
            'success': True,
            'data': {
                'task_a_score': task_a_score,
                'task_b_score': task_b_score,
                'task_c_score': task_c_score,
                'task_d_score': task_d_score,
                'task_e_score': task_e_score,
                'task_f_score': task_f_score,
                'required_total': required_total,
                'bonus_total': bonus_total,
                'total_score': total_score,
                'max_score_required': 27,
                'max_score_bonus': 12,
                'max_score_total': 39,
                'passed': passed,
                'pass_threshold': 22,
                'next_url': next_url
            }
        }

    except Exception as e:
        logger.error(f"Error calculating Step 3 B1 final score: {e}")
        return JSONResponse({
            'success': False,
            'error': str(e)
        }, status_code=500)


@router.post("/step3/remedial/c1/final-score")
async def calculate_step3_c1_final_score(request: Request, user: dict = Depends(get_current_user)):
    """
    Calculate and log Phase 4 Step 3 Remedial C1 final score
    Pass threshold: >= 43/54 (~80%)
    """
    try:
        user_id = user["user_id"]
        data = await request.json()

        task_a_score = data.get('task_a_score', 0)
        task_b_score = data.get('task_b_score', 0)
        task_c_score = data.get('task_c_score', 0)
        task_d_score = data.get('task_d_score', 0)
        task_e_score = data.get('task_e_score', 0)
        task_f_score = data.get('task_f_score', 0)
        task_g_score = data.get('task_g_score', 0)
        task_h_score = data.get('task_h_score', 0)
        total_score = task_a_score + task_b_score + task_c_score + task_d_score + task_e_score + task_f_score + task_g_score + task_h_score
        passed = total_score >= 43
        next_url = "/app/phase4/step/4" if passed else "/app/phase4/step3/remedial/c1/retry"

        print("\n" + "="*60)
        print("PHASE 4 STEP 3 - REMEDIAL C1 - FINAL ASSESSMENT")
        print("="*60)
        print(f"User ID: {user_id}")
        print(f"\nTask A:                          {task_a_score}/10 points")
        print(f"Task B:                          {task_b_score}/8 points")
        print(f"Task C:                          {task_c_score}/6 points")
        print(f"Task D:                          {task_d_score}/6 points")
        print(f"Task E:                          {task_e_score}/6 points")
        print(f"Task F:                          {task_f_score}/6 points")
        print(f"Task G:                          {task_g_score}/6 points")
        print(f"Task H:                          {task_h_score}/6 points")
        print(f"\n" + "-"*60)
        print(f"TOTAL SCORE: {total_score}/54 points")
        print(f"PASS THRESHOLD: 43/54 points (~80%)")
        print(f"RESULT: {'PASSED' if passed else 'FAILED - RETRY REQUIRED'}")
        print(f"NEXT URL: {next_url}")
        print("="*60 + "\n")

        logger.info(f"Phase 4 Step 3 Remedial C1 Final - User {user_id}: A={task_a_score}, B={task_b_score}, C={task_c_score}, D={task_d_score}, E={task_e_score}, F={task_f_score}, G={task_g_score}, H={task_h_score}, Total={total_score}, Passed={passed}")

        return {
            'success': True,
            'data': {
                'task_a_score': task_a_score,
                'task_b_score': task_b_score,
                'task_c_score': task_c_score,
                'task_d_score': task_d_score,
                'task_e_score': task_e_score,
                'task_f_score': task_f_score,
                'task_g_score': task_g_score,
                'task_h_score': task_h_score,
                'total_score': total_score,
                'max_score': 54,
                'passed': passed,
                'pass_threshold': 43,
                'next_url': next_url
            }
        }

    except Exception as e:
        logger.error(f"Error calculating Step 3 C1 final score: {e}")
        return JSONResponse({
            'success': False,
            'error': str(e)
        }, status_code=500)


@router.post("/step3/remedial/b1/evaluate-definitions")
async def evaluate_b1_definitions(request: Request, user: dict = Depends(get_current_user)):
    """
    Evaluate B1 Task B (Definition Duel) - 8 definitions with LLM
    """
    logger.info(f"=== B1 Definition Evaluation - User {user['user_id']} ===")
    try:
        data = await request.json()
        logger.info(f"Received request data: {data}")
        definitions = data.get('definitions', [])
        logger.info(f"Processing {len(definitions)} definitions")

        if not definitions:
            return JSONResponse({
                'success': False,
                'error': 'No definitions provided'
            }, status_code=400)

        results = []
        total_score = 0

        # Use AI evaluation if available
        if ai_service.client:
            for defn in definitions:
                term = defn.get('term', '')
                student_answer = defn.get('answer', '').strip()
                example_answer = defn.get('example', '')

                if not student_answer:
                    results.append({
                        'term': term,
                        'score': 0,
                        'feedback': 'Please provide a definition and example.'
                    })
                    continue

                try:
                    system_prompt = f"""You are evaluating a B1 level English definition for the term '{term}'.

The student should provide:
1) A clear definition of the term
2) An example that references a video about advertising characteristics
3) Complete sentences with B1-appropriate grammar
4) Logical connection between definition and example

IMPORTANT - BE FLEXIBLE at B1 level:
- Accept minor grammar mistakes if meaning is clear
- Accept varied sentence structures
- Focus on: Clear definition + Video reference + Logical example
- Score 1 if the answer shows understanding and effort
- Score 0 only if completely irrelevant or no effort shown

Respond ONLY in JSON format:
{{
    "score": 0 or 1,
    "feedback": "brief encouraging feedback (1-2 sentences)"
}}"""

                    user_prompt = f"""
Term: {term}
Example answer: {example_answer}

Student's answer: "{student_answer}"

Evaluate and return ONLY valid JSON."""

                    ai_response = ai_service.client.chat.completions.create(
                        model=ai_service.model,
                        messages=[
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_prompt}
                        ],
                        max_tokens=150,
                        temperature=0.3
                    )

                    result_text = ai_response.choices[0].message.content.strip()

                    # Parse JSON
                    if '```json' in result_text:
                        result_text = result_text.split('```json')[1].split('```')[0]
                    elif '```' in result_text:
                        result_text = result_text.split('```')[1].split('```')[0]

                    result = json.loads(result_text.strip())

                    score = result.get('score', 0)
                    feedback = result.get('feedback', 'Good effort!')

                    results.append({
                        'term': term,
                        'score': score,
                        'feedback': feedback
                    })
                    total_score += score

                except Exception as e:
                    logger.error(f"AI evaluation error for term '{term}': {str(e)}")
                    # Fallback to basic scoring
                    score = 1 if len(student_answer.split()) >= 10 else 0
                    results.append({
                        'term': term,
                        'score': score,
                        'feedback': 'Good effort!' if score == 1 else 'Try to provide more detail.'
                    })
                    total_score += score
        else:
            # Fallback: Local evaluation without AI
            for defn in definitions:
                term = defn.get('term', '')
                student_answer = defn.get('answer', '').strip()

                # Simple check: answer length and relevance
                word_count = len(student_answer.split())

                # Accept answer if it's at least 10 words (flexible for B1 level)
                score = 1 if word_count >= 10 else 0

                if score == 1:
                    feedback = 'Good effort! Your definition shows understanding.'
                else:
                    feedback = 'Try to provide more detail in your definition (at least 10 words).'

                results.append({
                    'term': term,
                    'score': score,
                    'feedback': feedback
                })
                total_score += score

        logger.info(f"B1 Definition Duel - User {user['user_id']}: Total Score={total_score}/8")

        return {
            'success': True,
            'results': results,
            'total_score': total_score,
            'max_score': 8
        }

    except Exception as e:
        logger.error(f"Error evaluating B1 definitions: {e}")
        return JSONResponse({
            'success': False,
            'error': str(e)
        }, status_code=500)


# ============================================================================
# STEP 3 REMEDIAL B2 EVALUATE EXPLANATIONS
# ============================================================================

@router.post("/step3/remedial/b2/evaluate-explanations")
async def evaluate_b2_explanations(request: Request, user: dict = Depends(get_current_user)):
    """Evaluate B2 Task B (Explain Expedition) - 8 explanations with LLM"""
    logger.info(f"=== B2 Explanation Evaluation - User {user['user_id']} ===")
    try:
        data = await request.json()
        explanations = data.get('explanations', [])
        if not explanations:
            return JSONResponse(status_code=400, content={'success': False, 'error': 'No explanations provided'})
        results = []
        total_score = 0
        if ai_service.client:
            valid_explanations = []
            for idx, expl in enumerate(explanations):
                term = expl.get('term', '')
                student_answer = expl.get('answer', '').strip()
                if not student_answer:
                    results.append({'term': term, 'score': 0, 'feedback': 'Please provide an explanation.'})
                    continue
                if len(student_answer.split()) < 10:
                    results.append({'term': term, 'score': 0, 'feedback': 'Your explanation is too short (at least 10 words).'})
                    continue
                valid_explanations.append({'index': idx, 'term': term, 'question': expl.get('question', ''), 'answer': student_answer, 'expected_concepts': expl.get('expectedConcepts', [])})
            if valid_explanations:
                try:
                    explanations_text = ""
                    for i, expl in enumerate(valid_explanations, 1):
                        explanations_text += f"\n--- Explanation {i} ---\nTerm: {expl['term']}\nQuestion: {expl['question']}\nExpected concepts: {', '.join(expl['expected_concepts'])}\nStudent's answer: \"{expl['answer']}\"\n"
                    system_prompt = "You are evaluating B2 level English explanations for advertising concepts.\nFor EACH explanation, evaluate based on: 1) B2-level depth 2) Video reference 3) Specific concepts 4) Clear paragraph 5) 2-3 sentences min.\nScore 1 if B2-level depth with video reference. Score 0 if too simple.\nRespond ONLY with valid JSON: {\"results\": [{\"score\": 0 or 1, \"feedback\": \"brief feedback\"}, ...]}"
                    user_prompt = f"Evaluate these {len(valid_explanations)} B2 explanations:{explanations_text}\nReturn ONLY valid JSON with results array."
                    ai_response = ai_service.client.chat.completions.create(model=ai_service.model, messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}], max_tokens=1500, temperature=0.3)
                    result_text = ai_response.choices[0].message.content.strip()
                    if '```json' in result_text:
                        result_text = result_text.split('```json')[1].split('```')[0]
                    elif '```' in result_text:
                        result_text = result_text.split('```')[1].split('```')[0]
                    result = json.loads(result_text.strip())
                    if 'results' in result and len(result['results']) == len(valid_explanations):
                        for i, ai_result in enumerate(result['results']):
                            original_idx = valid_explanations[i]['index']
                            while len(results) <= original_idx:
                                results.append(None)
                            results[original_idx] = {'term': valid_explanations[i]['term'], 'score': ai_result.get('score', 0), 'feedback': ai_result.get('feedback', 'Good effort!')}
                            total_score += ai_result.get('score', 0)
                    else:
                        raise ValueError("Incorrect number of results from AI")
                except Exception as e:
                    logger.error(f"Batch AI evaluation error: {str(e)}")
                    for i, expl in enumerate(valid_explanations):
                        original_idx = expl['index']
                        score = 1 if len(expl['answer'].split()) >= 15 else 0
                        while len(results) <= original_idx:
                            results.append(None)
                        results[original_idx] = {'term': expl['term'], 'score': score, 'feedback': 'Good effort!' if score == 1 else 'Try to provide more detail.'}
                        total_score += score
        else:
            for expl in explanations:
                term = expl.get('term', '')
                student_answer = expl.get('answer', '').strip()
                expected_concepts = expl.get('expectedConcepts', [])
                word_count = len(student_answer.split())
                has_video = 'video' in student_answer.lower()
                has_concept = any(c.lower() in student_answer.lower() for c in expected_concepts)
                score = 1 if (word_count >= 15 and has_video and has_concept) else 0
                results.append({'term': term, 'score': score, 'feedback': 'Good explanation!' if score == 1 else 'Try to reference the videos and include more concepts.'})
                total_score += score
        return {'success': True, 'results': results, 'total_score': total_score, 'max_score': 8}
    except Exception as e:
        logger.error(f"Error evaluating B2 explanations: {e}")
        return JSONResponse(status_code=500, content={'success': False, 'error': str(e)})


@router.post("/evaluate-game-explanation")
async def evaluate_game_explanation(request: Request):
    """Evaluate game explanation with AI (Sushi Spell). Returns score: 1-5 (CEFR A1-C1)"""
    try:
        data = await request.json()
        answer = data.get('answer', '').strip()
        vocabulary_words = data.get('vocabularyWords', [])
        expected_elements = data.get('expectedElements', [])
        if not answer:
            return {'score': 0, 'level': 'Below A1', 'feedback': 'Please explain how to use Sushi Spell with one of the vocabulary words.'}
        if len(answer.split()) < 3:
            return {'score': 1, 'level': 'A1', 'feedback': 'Your answer is very short. Try to explain in more detail.'}
        if ai_service.client:
            try:
                system_prompt = f"You are a CEFR language assessment expert evaluating explanations about game-based vocabulary learning.\nCEFR Scoring: A1(1): very basic. A2(2): mentions vocab word, 5+ words. B1(3): word + game element, 8+ words. B2(4): word + game + video ref, 12+ words. C1(5): sophisticated connection, 15+ words.\nExpected elements: {', '.join(expected_elements)}\nVocabulary words: {', '.join(vocabulary_words)}\nRespond ONLY in JSON: {{\"score\": 1-5, \"level\": \"A1\"|\"A2\"|\"B1\"|\"B2\"|\"C1\", \"feedback\": \"1-2 sentences\"}}"
                user_prompt = f"Question: {data.get('question', '')}\n\nStudent's Answer:\n\"{answer}\"\n\nReturn ONLY valid JSON."
                ai_response = ai_service.client.chat.completions.create(model=ai_service.model, messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}], max_tokens=150, temperature=0.3)
                result_text = ai_response.choices[0].message.content.strip()
                if '```json' in result_text:
                    result_text = result_text.split('```json')[1].split('```')[0]
                elif '```' in result_text:
                    result_text = result_text.split('```')[1].split('```')[0]
                result = json.loads(result_text.strip())
                return {'score': result.get('score', 3), 'level': result.get('level', 'B1'), 'feedback': result.get('feedback', 'Good explanation!')}
            except Exception as e:
                logger.error(f"AI game explanation evaluation error: {str(e)}")
        # Fallback
        answer_lower = answer.lower()
        mentions_word = any(w.lower() in answer_lower for w in vocabulary_words)
        mentions_game = any(w in answer_lower for w in ['sushi', 'spell', 'game'])
        mentions_video = any(w in answer_lower for w in ['video', 'first', 'second'])
        word_count = len(answer.split())
        if mentions_word and mentions_game and mentions_video and word_count >= 15:
            return {'score': 5, 'level': 'C1', 'feedback': 'Excellent explanation!'}
        elif mentions_word and mentions_game and word_count >= 12:
            return {'score': 4, 'level': 'B2', 'feedback': 'Very good explanation!'}
        elif mentions_word and word_count >= 8:
            return {'score': 3, 'level': 'B1', 'feedback': 'Good explanation!'}
        elif mentions_word and word_count >= 5:
            return {'score': 2, 'level': 'A2', 'feedback': 'Good start! Try to explain how the game helps.'}
        else:
            return {'score': 1, 'level': 'A1', 'feedback': 'Basic explanation. Try to explain how Sushi Spell helps you learn a specific word.'}
    except Exception as e:
        logger.error(f"Game explanation evaluation error: {str(e)}")
        return {'score': 1, 'level': 'A1', 'feedback': 'Unable to evaluate answer. Please try again.'}


@router.post("/step3/remedial/b2/evaluate-spell-explanation")
async def evaluate_b2_spell_explanation(request: Request, user: dict = Depends(get_current_user)):
    """Evaluate B2 Task D (Spell Quest) - Single explanation evaluation with LLM"""
    try:
        data = await request.json()
        term = data.get('term', '')
        explanation = data.get('explanation', '').strip()
        expected_concepts = data.get('expectedConcepts', [])
        if not explanation:
            return {'success': True, 'score': 0, 'feedback': 'Please provide an explanation.'}
        if len(explanation.split()) < 10:
            return {'success': True, 'score': 0, 'feedback': 'Your explanation is too short (at least 10 words).'}
        if ai_service.client:
            try:
                system_prompt = f"You are evaluating a B2 level English explanation for '{term}'.\nExpected concepts: {', '.join(expected_concepts)}\nScore 1 if B2-level depth with video reference. Score 0 if too simple.\nRespond ONLY in JSON: {{\"score\": 0 or 1, \"feedback\": \"brief feedback\"}}"
                user_prompt = f"Term: {term}\nStudent's explanation: \"{explanation}\"\nReturn ONLY valid JSON."
                ai_response = ai_service.client.chat.completions.create(model=ai_service.model, messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}], max_tokens=200, temperature=0.3)
                result_text = ai_response.choices[0].message.content.strip()
                if '```json' in result_text:
                    result_text = result_text.split('```json')[1].split('```')[0]
                elif '```' in result_text:
                    result_text = result_text.split('```')[1].split('```')[0]
                result = json.loads(result_text.strip())
                return {'success': True, 'score': result.get('score', 0), 'feedback': result.get('feedback', 'Good effort!')}
            except Exception as e:
                logger.error(f"AI evaluation error for term '{term}': {str(e)}")
                score = 1 if len(explanation.split()) >= 15 else 0
                return {'success': True, 'score': score, 'feedback': 'Good effort!' if score == 1 else 'Try to provide more detail.'}
        else:
            word_count = len(explanation.split())
            has_video = 'video' in explanation.lower()
            has_concept = any(c.lower() in explanation.lower() for c in expected_concepts)
            score = 1 if (word_count >= 15 and has_video and has_concept) else 0
            return {'success': True, 'score': score, 'feedback': 'Good explanation!' if score == 1 else 'Try to reference the videos.'}
    except Exception as e:
        logger.error(f"Error evaluating B2 spell explanation: {e}")
        return JSONResponse(status_code=500, content={'success': False, 'error': str(e)})


# ============================================================================
# STEP 3 REMEDIAL C1 EVALUATIONS
# ============================================================================

@router.post("/step3/remedial/c1/evaluate-analyses")
async def evaluate_c1_analyses(request: Request, user: dict = Depends(get_current_user)):
    """Evaluate C1 Task B (Analysis Odyssey) - 8 analyses with LLM"""
    try:
        data = await request.json()
        analyses = data.get('analyses', [])
        if not analyses:
            return JSONResponse(status_code=400, content={'success': False, 'error': 'No analyses provided'})
        results = []
        total_score = 0
        if ai_service.client:
            valid_analyses = []
            for idx, analysis in enumerate(analyses):
                term = analysis.get('term', '')
                student_answer = analysis.get('answer', '').strip()
                if not student_answer:
                    results.append({'term': term, 'score': 0, 'feedback': 'Please provide your analysis.'})
                    continue
                if len(student_answer.split()) < 5:
                    results.append({'term': term, 'score': 0, 'feedback': 'Your analysis is too short.'})
                    continue
                valid_analyses.append({'index': idx, 'term': term, 'question': analysis.get('question', ''), 'answer': student_answer, 'example': analysis.get('example', ''), 'expected_concepts': analysis.get('expectedConcepts', [])})
            if valid_analyses:
                try:
                    analyses_text = ""
                    for i, anal in enumerate(valid_analyses, 1):
                        analyses_text += f"\n--- Analysis {i} ---\nTerm: {anal['term']}\nQuestion: {anal['question']}\nExample: {anal['example']}\nExpected concepts: {', '.join(anal['expected_concepts'])}\nStudent's answer: \"{anal['answer']}\"\n"
                    system_prompt = "You are evaluating C1 level English analytical sentences for advertising concepts.\nFor EACH analysis, evaluate: 1) Nuanced understanding 2) Analytical depth 3) Video reference 4) Sophisticated vocabulary 5) Addresses complexity/trade-offs.\nScore 1 if C1-level sophistication. Score 0 if too simple.\nRespond ONLY with valid JSON: {\"results\": [{\"score\": 0 or 1, \"feedback\": \"brief feedback\"}, ...]}"
                    user_prompt = f"Evaluate these {len(valid_analyses)} C1 analytical sentences:{analyses_text}\nReturn ONLY valid JSON."
                    ai_response = ai_service.client.chat.completions.create(model=ai_service.model, messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}], max_tokens=1500, temperature=0.3)
                    result_text = ai_response.choices[0].message.content.strip()
                    if '```json' in result_text:
                        result_text = result_text.split('```json')[1].split('```')[0]
                    elif '```' in result_text:
                        result_text = result_text.split('```')[1].split('```')[0]
                    result = json.loads(result_text.strip())
                    if 'results' in result and len(result['results']) == len(valid_analyses):
                        for i, ai_result in enumerate(result['results']):
                            original_idx = valid_analyses[i]['index']
                            while len(results) <= original_idx:
                                results.append(None)
                            results[original_idx] = {'term': valid_analyses[i]['term'], 'score': ai_result.get('score', 0), 'feedback': ai_result.get('feedback', 'Good effort!')}
                            total_score += ai_result.get('score', 0)
                    else:
                        raise ValueError("Incorrect number of results")
                except Exception as e:
                    logger.error(f"Batch AI evaluation error: {str(e)}")
                    for i, anal in enumerate(valid_analyses):
                        original_idx = anal['index']
                        answer_lower = anal['answer'].lower()
                        has_nuance = any(w in answer_lower for w in ['but', 'yet', 'while', 'although', 'however'])
                        has_analytical = any(w in answer_lower for w in ['drives', 'enhances', 'raises', 'fosters', 'demands', 'risks'])
                        score = 1 if (has_nuance and has_analytical and len(anal['answer'].split()) >= 10) else 0
                        while len(results) <= original_idx:
                            results.append(None)
                        results[original_idx] = {'term': anal['term'], 'score': score, 'feedback': 'Good analytical depth!' if score == 1 else 'Try to add more nuance.'}
                        total_score += score
        else:
            for anal in analyses:
                term = anal.get('term', '')
                student_answer = anal.get('answer', '').strip()
                answer_lower = student_answer.lower()
                has_nuance = any(w in answer_lower for w in ['but', 'yet', 'while', 'although', 'however'])
                has_analytical = any(w in answer_lower for w in ['drives', 'enhances', 'raises', 'fosters', 'demands', 'risks'])
                has_concept = any(c.lower() in answer_lower for c in anal.get('expectedConcepts', []))
                score = 1 if (len(student_answer.split()) >= 10 and has_nuance and has_analytical and has_concept) else 0
                results.append({'term': term, 'score': score, 'feedback': 'Excellent analysis!' if score == 1 else 'Add more nuance and analytical language.'})
                total_score += score
        return {'success': True, 'results': results, 'total_score': total_score, 'max_score': 8}
    except Exception as e:
        logger.error(f"Error evaluating C1 analyses: {e}")
        return JSONResponse(status_code=500, content={'success': False, 'error': str(e)})


@router.post("/step3/remedial/c1/evaluate-justification")
async def evaluate_c1_justification(request: Request, user: dict = Depends(get_current_user)):
    """Evaluate C1 Task C (Quizlet Live) - Single justification evaluation"""
    try:
        data = await request.json()
        question = data.get('question', '')
        correct_answer = data.get('correctAnswer', '')
        justification = data.get('justification', '').strip()
        video_reference = data.get('videoReference', '')
        expected_concepts = data.get('expectedConcepts', [])
        if not justification or len(justification.split()) < 5:
            return {'success': True, 'score': 0, 'feedback': 'Justification is too short. Please provide more detail and reference the videos.'}
        if ai_service.client:
            try:
                system_prompt = "You are evaluating C1 level English justifications for quiz answers about advertising.\nScore 1 if has video reference + relevant concepts + explains why. Score 0 if missing.\nRespond ONLY with valid JSON: {\"score\": 0 or 1, \"feedback\": \"brief feedback\"}"
                user_prompt = f"Question: {question}\nCorrect Answer: {correct_answer}\nExpected video: {video_reference}\nExpected concepts: {', '.join(expected_concepts)}\nStudent's justification: \"{justification}\"\nReturn JSON."
                ai_response = ai_service.client.chat.completions.create(model=ai_service.model, messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}], max_tokens=200, temperature=0.3)
                result_text = ai_response.choices[0].message.content.strip()
                if '```json' in result_text:
                    result_text = result_text.split('```json')[1].split('```')[0]
                elif '```' in result_text:
                    result_text = result_text.split('```')[1].split('```')[0]
                result = json.loads(result_text.strip())
                return {'success': True, 'score': result.get('score', 0), 'feedback': result.get('feedback', 'Good effort!')}
            except Exception as e:
                logger.error(f"AI evaluation error: {str(e)}")
        # Fallback
        j_lower = justification.lower()
        has_video = 'video' in j_lower
        has_concept = any(c.lower() in j_lower for c in expected_concepts)
        score = 1 if (has_video and has_concept and len(justification.split()) >= 10) else 0
        feedback = 'Excellent justification!' if score == 1 else (f'Include a reference to {video_reference}.' if not has_video else 'Include more relevant concepts.')
        return {'success': True, 'score': score, 'feedback': feedback}
    except Exception as e:
        logger.error(f"Error evaluating C1 justification: {e}")
        return JSONResponse(status_code=500, content={'success': False, 'error': str(e)})


@router.post("/step3/remedial/c1/evaluate-critique")
async def evaluate_c1_critique(request: Request, user: dict = Depends(get_current_user)):
    """Evaluate C1 Task D (Critique Kahoot) - Single critique evaluation"""
    try:
        data = await request.json()
        term = data.get('term', '')
        critique = data.get('critique', '').strip()
        expected_concepts = data.get('expectedConcepts', [])
        video_reference = data.get('videoReference', '')
        if not critique or len(critique.split()) < 5:
            return {'success': True, 'score': 0, 'feedback': 'Critique is too short. Please provide more detail with nuanced analysis.'}
        if ai_service.client:
            try:
                system_prompt = "You are evaluating C1 level English critiques of advertising terms.\nA good critique must: 1) Show NUANCE 2) Address BOTH strengths AND weaknesses 3) Use relevant concepts 4) Show critical thinking.\nScore 1 if clear nuance with relevant concepts. Score 0 if too simple.\nRespond ONLY with valid JSON: {\"score\": 0 or 1, \"feedback\": \"brief feedback\"}"
                user_prompt = f"Term: {term}\nExpected concepts: {', '.join(expected_concepts)}\nVideo reference: {video_reference}\nStudent's critique: \"{critique}\"\nReturn JSON."
                ai_response = ai_service.client.chat.completions.create(model=ai_service.model, messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}], max_tokens=200, temperature=0.3)
                result_text = ai_response.choices[0].message.content.strip()
                if '```json' in result_text:
                    result_text = result_text.split('```json')[1].split('```')[0]
                elif '```' in result_text:
                    result_text = result_text.split('```')[1].split('```')[0]
                result = json.loads(result_text.strip())
                return {'success': True, 'score': result.get('score', 0), 'feedback': result.get('feedback', 'Good effort!')}
            except Exception as e:
                logger.error(f"AI evaluation error: {str(e)}")
        # Fallback
        c_lower = critique.lower()
        has_nuance = any(w in c_lower for w in ['but', 'yet', 'however', 'although', 'whereas', 'while'])
        concepts_found = sum(1 for c in expected_concepts if c.lower() in c_lower)
        score = 1 if (has_nuance and concepts_found >= 2 and len(critique.split()) >= 10) else 0
        feedback = 'Excellent nuanced critique!' if score == 1 else ('Add nuance using "but", "yet", or "however".' if not has_nuance else 'Include more relevant concepts.')
        return {'success': True, 'score': score, 'feedback': feedback}
    except Exception as e:
        logger.error(f"Error evaluating C1 critique: {e}")
        return JSONResponse(status_code=500, content={'success': False, 'error': str(e)})


@router.post("/step3/remedial/c1/evaluate-critiques-batch")
async def evaluate_c1_critiques_batch(request: Request, user: dict = Depends(get_current_user)):
    """Evaluate C1 Task D (Critique Kahoot) - Batch evaluation of all critiques in ONE API call"""
    try:
        data = await request.json()
        critiques = data.get('critiques', [])
        if not critiques:
            return JSONResponse(status_code=400, content={'success': False, 'error': 'No critiques provided'})
        results = []
        total_score = 0
        if ai_service.client:
            valid_critiques = []
            for idx, cd in enumerate(critiques):
                critique = cd.get('critique', '').strip()
                if not critique or len(critique.split()) < 5:
                    results.append({'score': 0, 'feedback': 'Critique is too short.'})
                    continue
                valid_critiques.append({'index': idx, 'term': cd.get('term', ''), 'critique': critique, 'expected_concepts': cd.get('expectedConcepts', []), 'video_reference': cd.get('videoReference', '')})
            if valid_critiques:
                try:
                    critiques_text = ""
                    for i, crit in enumerate(valid_critiques, 1):
                        critiques_text += f"\n--- Critique {i} ---\nTerm: {crit['term']}\nExpected concepts: {', '.join(crit['expected_concepts'])}\nStudent's critique: \"{crit['critique']}\"\n"
                    system_prompt = "You are evaluating C1 level English critiques of advertising terms.\nFor EACH critique: Score 1 if clear nuance (both pros and cons) with relevant concepts. Score 0 if too simple.\nRespond ONLY with valid JSON: {\"results\": [{\"score\": 0 or 1, \"feedback\": \"brief feedback\"}, ...]}"
                    user_prompt = f"Evaluate these {len(valid_critiques)} C1 critiques:{critiques_text}\nReturn ONLY valid JSON."
                    ai_response = ai_service.client.chat.completions.create(model=ai_service.model, messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}], max_tokens=1200, temperature=0.3)
                    result_text = ai_response.choices[0].message.content.strip()
                    if '```json' in result_text:
                        result_text = result_text.split('```json')[1].split('```')[0]
                    elif '```' in result_text:
                        result_text = result_text.split('```')[1].split('```')[0]
                    result = json.loads(result_text.strip())
                    if 'results' in result and len(result['results']) == len(valid_critiques):
                        for i, ai_result in enumerate(result['results']):
                            original_idx = valid_critiques[i]['index']
                            while len(results) <= original_idx:
                                results.append(None)
                            results[original_idx] = {'score': ai_result.get('score', 0), 'feedback': ai_result.get('feedback', 'Good effort!')}
                            total_score += ai_result.get('score', 0)
                    else:
                        raise ValueError("Incorrect number of results")
                except Exception as e:
                    logger.error(f"Batch AI evaluation error: {str(e)}")
                    for i, crit in enumerate(valid_critiques):
                        original_idx = crit['index']
                        c_lower = crit['critique'].lower()
                        has_nuance = any(w in c_lower for w in ['but', 'yet', 'however', 'although'])
                        concepts_found = sum(1 for c in crit['expected_concepts'] if c.lower() in c_lower)
                        score = 1 if (has_nuance and concepts_found >= 2) else 0
                        while len(results) <= original_idx:
                            results.append(None)
                        results[original_idx] = {'score': score, 'feedback': 'Good critique!' if score == 1 else 'Add more nuance.'}
                        total_score += score
        else:
            for cd in critiques:
                critique = cd.get('critique', '').strip()
                if not critique or len(critique.split()) < 5:
                    results.append({'score': 0, 'feedback': 'Critique is too short.'})
                    continue
                c_lower = critique.lower()
                has_nuance = any(w in c_lower for w in ['but', 'yet', 'however', 'although'])
                concepts_found = sum(1 for c in cd.get('expectedConcepts', []) if c.lower() in c_lower)
                score = 1 if (has_nuance and concepts_found >= 2) else 0
                results.append({'score': score, 'feedback': 'Excellent critique!' if score == 1 else 'Add more nuance.'})
                total_score += score
        return {'success': True, 'results': results, 'total_score': total_score}
    except Exception as e:
        logger.error(f"Error evaluating C1 critiques batch: {e}")
        return JSONResponse(status_code=500, content={'success': False, 'error': str(e)})


@router.post("/step3/remedial/c1/evaluate-clauses-batch")
async def evaluate_c1_clauses_batch(request: Request):
    """Evaluate C1 Task F - Clause Conquest sentences in batch"""
    try:
        data = await request.json()
        sentences = data.get('sentences', [])
        if not sentences:
            return JSONResponse(status_code=400, content={'success': False, 'error': 'No sentences provided'})
        sentences_text = ""
        for i, sent in enumerate(sentences, 1):
            sentences_text += f"\n--- Sentence {i} ---\nSentence: {sent.get('sentence', '')}\nGrammar Concept: {sent.get('concept', '')}\n"
        prompt = f"You are evaluating C1-level English grammar focusing on RELATIVE CLAUSES and PASSIVE VOICE.\n{sentences_text}\nFor EACH sentence, provide Score (1 or 0) and Feedback.\nFormat:\nSentence 1:\nScore: [0 or 1]\nFeedback: [brief feedback]\n..."
        ai_response = ai_service.client.chat.completions.create(model=ai_service.model, messages=[{"role": "system", "content": "You are an expert English grammar teacher specializing in C1-level evaluation."}, {"role": "user", "content": prompt}], max_tokens=1000, temperature=0.3)
        evaluation_text = ai_response.choices[0].message.content
        results = []
        sentence_blocks = evaluation_text.split('Sentence ')[1:]
        for block in sentence_blocks:
            lines = block.strip().split('\n')
            score = 0
            feedback = "Good effort!"
            for line in lines:
                if line.startswith('Score:'):
                    try:
                        score = int(line.replace('Score:', '').strip())
                    except:
                        score = 0
                elif line.startswith('Feedback:'):
                    feedback = line.replace('Feedback:', '').strip()
            results.append({'score': score, 'feedback': feedback})
        while len(results) < len(sentences):
            results.append({'score': 0, 'feedback': 'Could not evaluate this sentence.'})
        return {'success': True, 'results': results[:len(sentences)]}
    except Exception as e:
        logger.error(f"Error evaluating C1 clauses batch: {e}")
        return JSONResponse(status_code=500, content={'success': False, 'error': str(e)})


# ============================================================================
# HELPER: AI evaluation with JSON parsing and fallback
# ============================================================================

async def _ai_evaluate_json(system_prompt: str, user_prompt: str, max_tokens: int = 300, model: str = None):
    """Call AI service, parse JSON response. Returns parsed dict or None on failure."""
    if not ai_service.client:
        return None
    try:
        ai_response = ai_service.client.chat.completions.create(
            model=model or ai_service.model,
            messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}],
            max_tokens=max_tokens, temperature=0.3
        )
        result_text = ai_response.choices[0].message.content.strip()
        if '```json' in result_text:
            result_text = result_text.split('```json')[1].split('```')[0]
        elif '```' in result_text:
            result_text = result_text.split('```')[1].split('```')[0]
        return json.loads(result_text.strip())
    except Exception as e:
        logger.error(f"AI evaluation error: {str(e)}")
        return None


# ============================================================================
# PHASE 4 STEP 4: APPLY - POSTER AND VIDEO DESCRIPTION
# ============================================================================

@router.post("/step4/evaluate-poster-description")
async def evaluate_poster_description(request: Request):
    """Evaluate poster description writing with AI. Score 1-5 (CEFR)."""
    try:
        data = await request.json()
        description = data.get('description', '').strip()
        if not description:
            return {'success': False, 'score': 0, 'level': 'Below A1', 'feedback': 'Please write your poster description using the template.'}
        sentences = [s.strip() for s in description.replace('!', '.').replace('?', '.').split('.') if s.strip()]
        sentence_count = len(sentences)
        word_count = len(description.split())
        if word_count < 5:
            return {'success': False, 'score': 0, 'level': 'Below A1', 'feedback': 'Your description is too short.'}

        system_prompt = "You are a CEFR language assessment expert evaluating poster description writing.\nTemplate elements: 1) Title/Layout 2) Colors/Images as eye-catcher 3) Slogan/Lettering 4) Details/Call to Action.\nScoring: C1(5): sophisticated 60+ words. B2(4): detailed 40+ words. B1(3): complete 4+ sentences. A2(2): basic template use. A1(1): basic attempt.\nRespond ONLY in JSON: {\"score\": 1-5, \"level\": \"A1\"|\"A2\"|\"B1\"|\"B2\"|\"C1\", \"feedback\": \"2-3 sentences\", \"details\": {\"grammar\": \"...\", \"spelling\": \"...\", \"structure\": \"...\"}}"
        user_prompt = f"Student's Poster Description:\n\"{description}\"\nSentence count: {sentence_count}\nWord count: {word_count}\nReturn ONLY valid JSON."
        result = await _ai_evaluate_json(system_prompt, user_prompt)
        if result:
            score = max(1, min(5, result.get('score', 1)))
            return {'success': True, 'score': score, 'level': result.get('level', 'A1'), 'feedback': result.get('feedback', 'Good work!'), 'details': result.get('details', {})}

        # Fallback
        desc_lower = description.lower()
        has_layout = 'gatefold' in desc_lower or 'layout' in desc_lower
        has_title = 'title' in desc_lower or 'poster' in desc_lower
        has_colors = any(w in desc_lower for w in ['color', 'colour', 'bright', 'vibrant'])
        has_slogan = 'slogan' in desc_lower
        has_subject_verb = bool(re.search(r'\b(it|poster|slogan|layout)\s+(is|has|uses|features|employs)\b', description, re.IGNORECASE))
        has_advanced = any(w in desc_lower for w in ['unfold', 'narrative', 'hierarchy', 'ethos', 'authentic', 'persuasive', 'encapsulate', 'culminat'])
        has_b2 = any(w in desc_lower for w in ['vibrant', 'elegant', 'immersive', 'diverse', 'attract'])

        if sentence_count >= 4 and word_count >= 60 and has_layout and has_title and has_advanced:
            score, level = 5, 'C1'
        elif sentence_count >= 4 and word_count >= 40 and has_layout and has_title and has_colors and has_slogan and has_b2:
            score, level = 4, 'B2'
        elif sentence_count >= 4 and has_layout and has_title and has_colors and has_slogan:
            score, level = 3, 'B1'
        elif sentence_count >= 3 and (has_title or has_layout) and (has_colors or has_slogan):
            score, level = 2, 'A2'
        elif sentence_count >= 1 and (has_title or has_colors):
            score, level = 1, 'A1'
        else:
            score, level = 0, 'Below A1'
        return {'success': score > 0, 'score': score, 'level': level, 'feedback': f'Score: {score}/5. Follow the template more closely.', 'details': {}}
    except Exception as e:
        logger.error(f"Error evaluating poster description: {e}")
        return JSONResponse(status_code=500, content={'success': False, 'error': str(e)})


@router.post("/step4/evaluate-video-script")
async def evaluate_video_script(request: Request):
    """Evaluate video script writing with AI. Score 1-5 (CEFR)."""
    try:
        data = await request.json()
        script = data.get('script', '').strip()
        if not script:
            return {'success': False, 'score': 0, 'level': 'Below A1', 'feedback': 'Please write your video script.'}
        sentences = [s.strip() for s in script.replace('!', '.').replace('?', '.').split('.') if s.strip()]
        sentence_count = len(sentences)
        word_count = len(script.split())
        if word_count < 5:
            return {'success': False, 'score': 0, 'level': 'Below A1', 'feedback': 'Your script is too short.'}

        system_prompt = "You are a CEFR language assessment expert evaluating video script writing.\nTemplate: Scene 1 (Opening/Sketch with animation/jingle), Scene 2 (Dramatisation with characters/goals/obstacles), Scene 3 (Features/Call to Action).\nScoring: C1(5): autonomous sophisticated 60+ words. B2(4): dynamic persuasive 40+ words. B1(3): complete 3+ scenes. A2(2): basic template. A1(1): basic attempt.\nRespond ONLY in JSON: {\"score\": 1-5, \"level\": \"A1\"|\"A2\"|\"B1\"|\"B2\"|\"C1\", \"feedback\": \"2-3 sentences\", \"details\": {\"grammar\": \"...\", \"spelling\": \"...\", \"structure\": \"...\"}}"
        user_prompt = f"Student's Video Script:\n\"{script}\"\nSentence count: {sentence_count}\nWord count: {word_count}\nReturn ONLY valid JSON."
        result = await _ai_evaluate_json(system_prompt, user_prompt)
        if result:
            score = max(1, min(5, result.get('score', 1)))
            return {'success': True, 'score': score, 'level': result.get('level', 'A1'), 'feedback': result.get('feedback', 'Good work!'), 'details': result.get('details', {})}

        # Fallback
        s_lower = script.lower()
        has_opening = 'video' in s_lower and any(w in s_lower for w in ['open', 'start', 'begin'])
        has_dramatisation = any(w in s_lower for w in ['dramatisation', 'dramatization', 'show'])
        has_features = any(w in s_lower for w in ['feature', 'detail'])
        has_cta = any(w in s_lower for w in ['come', 'join', "don't miss"])
        has_advanced = any(w in s_lower for w in ['autonomous', 'commence', 'seamless', 'nuanced', 'transformative'])

        if sentence_count >= 4 and word_count >= 60 and has_opening and has_dramatisation and has_advanced:
            score, level = 5, 'C1'
        elif sentence_count >= 4 and word_count >= 40 and has_opening and has_dramatisation and has_cta:
            score, level = 4, 'B2'
        elif sentence_count >= 3 and has_opening and has_dramatisation:
            score, level = 3, 'B1'
        elif sentence_count >= 2 and (has_opening or has_dramatisation):
            score, level = 2, 'A2'
        elif sentence_count >= 1:
            score, level = 1, 'A1'
        else:
            score, level = 0, 'Below A1'
        return {'success': score > 0, 'score': score, 'level': level, 'feedback': f'Score: {score}/5. Follow the template.', 'details': {}}
    except Exception as e:
        logger.error(f"Error evaluating video script: {e}")
        return JSONResponse(status_code=500, content={'success': False, 'error': str(e)})


@router.post("/step4/evaluate-vocabulary-integration")
async def evaluate_vocabulary_integration(request: Request):
    """Evaluate vocabulary integration with Sushi Spell game. Score 1-5 (CEFR)."""
    try:
        data = await request.json()
        spelled_terms = data.get('spelledTerms', '').strip()
        revised_sentence = data.get('revisedSentence', '').strip()
        if not spelled_terms or not revised_sentence:
            return {'success': False, 'score': 0, 'level': 'Below A1', 'feedback': 'Please list terms AND write a revised sentence.'}
        word_count = len(revised_sentence.split())
        if word_count < 3:
            return {'success': False, 'score': 0, 'level': 'Below A1', 'feedback': 'Your revised sentence is too short.'}

        system_prompt = "You are a CEFR language assessment expert evaluating vocabulary integration and writing revision.\nVocabulary terms: gatefold, dramatisation, animation, jingle, lettering, sketch.\nScoring: C1(5): complex clause structure, autonomous error detection, 15+ words. B2(4): well-structured revision, 10+ words. B1(3): uses term with basic revision, 8+ words. A2(2): basic use, 5+ words. A1(1): basic attempt.\nRespond ONLY in JSON: {\"score\": 1-5, \"level\": \"A1\"|\"A2\"|\"B1\"|\"B2\"|\"C1\", \"feedback\": \"2-3 sentences\", \"details\": {\"usedTerm\": \"...\", \"grammar\": \"...\", \"structure\": \"...\"}}"
        user_prompt = f"Spelled Terms: \"{spelled_terms}\"\nRevised Sentence: \"{revised_sentence}\"\nWord count: {word_count}\nReturn ONLY valid JSON."
        result = await _ai_evaluate_json(system_prompt, user_prompt)
        if result:
            score = max(1, min(5, result.get('score', 1)))
            return {'success': True, 'score': score, 'level': result.get('level', 'A1'), 'feedback': result.get('feedback', 'Good work!'), 'details': result.get('details', {})}

        # Fallback
        vocabulary_terms = ['gatefold', 'dramatisation', 'animation', 'jingle', 'lettering', 'sketch']
        sentence_lower = revised_sentence.lower()
        used_term = next((t for t in vocabulary_terms if t.lower() in sentence_lower), None)
        listed_term = next((t for t in vocabulary_terms if t.lower() in spelled_terms.lower()), None)
        if used_term and listed_term and word_count >= 15:
            score, level = 5, 'C1'
        elif used_term and listed_term and word_count >= 10:
            score, level = 4, 'B2'
        elif used_term and listed_term and word_count >= 8:
            score, level = 3, 'B1'
        elif used_term and word_count >= 5:
            score, level = 2, 'A2'
        elif used_term or listed_term:
            score, level = 1, 'A1'
        else:
            score, level = 0, 'Below A1'
        return {'success': score > 0, 'score': score, 'level': level, 'feedback': f'Score: {score}/5.', 'details': {'usedTerm': used_term or 'None detected'}}
    except Exception as e:
        logger.error(f"Error evaluating vocabulary integration: {e}")
        return JSONResponse(status_code=500, content={'success': False, 'error': str(e)})


# ============================================================================
# STEP 4 REMEDIAL
# ============================================================================

@router.post("/step/4/calculate-score")
async def calculate_step4_score(request: Request, user: dict = Depends(get_current_user)):
    """Calculate Phase 4 Step 4 total score and route to the matching remedial level."""
    try:
        user_id = user["user_id"]
        data = await request.json()

        interaction1_score = data.get('interaction1_score', 0)
        interaction2_score = data.get('interaction2_score', 0)
        interaction3_score = data.get('interaction3_score', 0)

        for index, score in enumerate([interaction1_score, interaction2_score, interaction3_score], start=1):
            if not (1 <= score <= 5):
                return JSONResponse(
                    {'success': False, 'error': f'Interaction {index} score must be between 1 and 5'},
                    status_code=400
                )

        total_score = interaction1_score + interaction2_score + interaction3_score
        remedial_level = _phase4_total_to_level(total_score, [(4, 'A1'), (7, 'A2'), (10, 'B1'), (13, 'B2')])
        next_url = _phase4_remedial_start_url(4, remedial_level)

        print("\n" + "="*60)
        print("PHASE 4 STEP 4 - SCORING RESULTS")
        print("="*60)
        print(f"User ID: {user_id}")
        print(f"I1={interaction1_score}, I2={interaction2_score}, I3={interaction3_score}")
        print(f"Total: {total_score}/15, Level: Remedial {remedial_level}")
        print(f"ROUTING TO: {next_url}")
        print("="*60 + "\n")

        save_phase4_progress(
            user_id, step=4, interaction=1, context=f'remedial_{remedial_level.lower()}', subphase=1,
            score=total_score, item_id='step4_score', item_type='score',
            prompt='Phase 4 Step 4 Score',
            answer=json.dumps({'i1': interaction1_score, 'i2': interaction2_score, 'i3': interaction3_score}),
            is_correct=False
        )

        return {
            'success': True,
            'data': _phase4_build_main_score_payload(
                [interaction1_score, interaction2_score, interaction3_score],
                [5, 5, 5],
                total_score,
                15,
                remedial_level,
                next_url
            )
        }
    except Exception as e:
        logger.error(f"Error calculating Phase 4 Step 4 score: {e}")
        return JSONResponse(status_code=500, content={'success': False, 'error': str(e)})

@router.post("/step4/remedial/log")
async def log_step4_remedial_task(request: Request):
    """Log Phase 4 Step 4 remedial task completion"""
    try:
        data = await request.json()
        user_id = 'anonymous'
        level = data.get('level', 'Unknown')
        task = data.get('task', 'Unknown')
        score = data.get('score', 0)
        max_score = data.get('max_score', 0)
        time_taken = data.get('time_taken', 0)
        print(f"\n{'='*60}\nPHASE 4 STEP 4 - REMEDIAL {level} - TASK {task}\n{'='*60}\nScore: {score}/{max_score} | Time: {time_taken}s | Rate: {(score/max_score)*100:.1f}%\n{'='*60}\n")
        logger.info(f"Phase 4 Step 4 - Remedial {level} Task {task}: Score={score}/{max_score}")
        return {'success': True, 'message': 'Phase 4 Step 4 remedial task logged successfully'}
    except Exception as e:
        logger.error(f"Error logging Phase 4 Step 4 remedial task: {e}")
        return JSONResponse(status_code=500, content={'success': False, 'error': str(e)})


@router.post("/step4/remedial/a1/final-score")
async def calculate_step4_a1_final_score(request: Request):
    """Calculate Phase 4 Step 4 Remedial A1 final score."""
    try:
        data = await request.json()
        task_a = data.get('task_a_score', 0)
        task_b = data.get('task_b_score', 0)
        task_c = data.get('task_c_score', 0)
        total = task_a + task_b + task_c
        passed = total >= 18
        next_url = _phase4_next_step_url(4) if passed else _phase4_retry_url(4, 'A1')
        print(f"\n{'='*60}\nPHASE 4 STEP 4 - REMEDIAL A1 - FINAL\n{'='*60}\nTask A: {task_a}/8 | Task B: {task_b}/8 | Task C: {task_c}/6\nTOTAL: {total}/22 | Pass: 18/22 | {'PASSED' if passed else 'FAILED'}\nNEXT: {next_url}\n{'='*60}\n")
        return {'success': True, 'data': {'task_a': task_a, 'task_b': task_b, 'task_c': task_c, 'total': total, 'max_score': 22, 'threshold': 18, 'passed': passed, 'next_url': next_url}}
    except Exception as e:
        logger.error(f"Error calculating Phase 4 Step 4 A1 final score: {e}")
        return JSONResponse(status_code=500, content={'success': False, 'error': str(e)})


@router.post("/step4/remedial/a2/final-score")
async def calculate_step4_a2_final_score(request: Request):
    """Calculate Phase 4 Step 4 Remedial A2 final score."""
    try:
        data = await request.json()
        task_a = data.get('task_a_score', 0)
        task_b = data.get('task_b_score', 0)
        task_c = data.get('task_c_score', 0)
        total = task_a + task_b + task_c
        passed = total >= 18
        next_url = _phase4_next_step_url(4) if passed else _phase4_retry_url(4, 'A2')
        print(f"\n{'='*60}\nPHASE 4 STEP 4 - REMEDIAL A2 - FINAL\n{'='*60}\nTask A: {task_a}/7 | Task B: {task_b}/8 | Task C: {task_c}/6\nTOTAL: {total}/21 | Pass: 18/21 | {'PASSED' if passed else 'FAILED'}\nNEXT: {next_url}\n{'='*60}\n")
        return {'success': True, 'data': {'task_a': task_a, 'task_b': task_b, 'task_c': task_c, 'total': total, 'max_score': 21, 'threshold': 18, 'passed': passed, 'next_url': next_url}}
    except Exception as e:
        logger.error(f"Error calculating Phase 4 Step 4 A2 final score: {e}")
        return JSONResponse(status_code=500, content={'success': False, 'error': str(e)})


@router.post("/step4/remedial/b1/evaluate-definitions")
async def evaluate_step4_b1_definitions(request: Request, user: dict = Depends(get_current_user)):
    """Evaluate Step 4 B1 Task B (Definition Duel) - 8 definitions with LLM"""
    try:
        data = await request.json()
        definitions = data.get('definitions', [])
        if not definitions:
            return JSONResponse(status_code=400, content={'success': False, 'error': 'No definitions provided'})
        results = []
        total_score = 0
        examples = {
            'promotional': 'Promotional means to advertise or sell something.',
            'persuasive': 'Persuasive means to convince people using feelings and logic.',
            'targeted': 'Targeted means the ad is for a specific group.',
            'original': 'Original means a new idea that is not copied.',
            'creative': 'Creative means using imagination to make the ad interesting.',
            'consistent': 'Consistent means the message and style stay the same.',
            'personalized': 'Personalized means the ad is made for one person or small group.',
            'ethical': 'Ethical means the ad is honest and fair.'
        }
        if ai_service.client:
            for defn in definitions:
                term = defn.get('term', '')
                student_answer = defn.get('answer', '').strip()
                if not student_answer:
                    results.append({'term': term, 'score': 0, 'feedback': 'Please provide a definition.'})
                    continue
                try:
                    example_answer = examples.get(term, '')
                    system_prompt = f"You are evaluating a B1 level English definition for '{term}' in advertising context.\nExample: {example_answer}\nBE FLEXIBLE. Score 1 if understanding shown. Score 0 if irrelevant.\nRespond ONLY in JSON: {{\"score\": 0 or 1, \"feedback\": \"brief feedback\"}}"
                    user_prompt = f"Term: {term}\nStudent's answer: \"{student_answer}\"\nReturn ONLY valid JSON."
                    ai_response = ai_service.client.chat.completions.create(model=ai_service.model, messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}], max_tokens=150, temperature=0.3)
                    response_text = ai_response.choices[0].message.content.strip()
                    evaluation = json.loads(response_text)
                    score = evaluation.get('score', 0)
                    results.append({'term': term, 'score': score, 'feedback': evaluation.get('feedback', 'Good effort!')})
                    total_score += score
                except json.JSONDecodeError:
                    score = 1 if len(student_answer) >= 20 else 0
                    results.append({'term': term, 'score': score, 'feedback': 'Good effort!' if score == 1 else 'Please write a more complete definition.'})
                    total_score += score
                except Exception as e:
                    logger.error(f"Error evaluating term '{term}': {e}")
                    results.append({'term': term, 'score': 0, 'feedback': 'Error evaluating. Please try again.'})
        else:
            for defn in definitions:
                term = defn.get('term', '')
                student_answer = defn.get('answer', '').strip()
                score = 1 if len(student_answer) >= 20 else 0
                results.append({'term': term, 'score': score, 'feedback': 'Good effort!' if score == 1 else 'Please write a more complete definition.'})
                total_score += score
        return {'success': True, 'results': results, 'total_score': total_score, 'max_score': 8}
    except Exception as e:
        logger.error(f"Error in Step 4 B1 definition evaluation: {e}")
        return JSONResponse(status_code=500, content={'success': False, 'error': str(e)})


@router.post("/step4/remedial/b1/final-score")
async def calculate_step4_b1_final_score(request: Request, user: dict = Depends(get_current_user)):
    """Calculate Phase 4 Step 4 Remedial B1 final score."""
    try:
        data = await request.json()
        task_a = data.get('task_a_score', 0)
        task_b = data.get('task_b_score', 0)
        task_c = data.get('task_c_score', 0)
        task_d = data.get('task_d_score', 0)
        task_e = data.get('task_e_score', 0)
        task_f = data.get('task_f_score', 0)
        total = task_a + task_b + task_c + task_d + task_e + task_f
        passed = total >= 22
        next_url = _phase4_next_step_url(4) if passed else _phase4_retry_url(4, 'B1')
        user_id = user["user_id"]
        logger.info(f"Step 4 B1 Scores - A:{task_a}/4, B:{task_b}/8, C:{task_c}/6, D:{task_d}/8, E:{task_e}/6, F:{task_f}/6 = {total}/38 {'PASS' if passed else 'FAIL'} -> {next_url}")
        try:
            db = sqlite3.connect('fardi.db')
            cursor = db.cursor()
            cursor.execute('INSERT INTO remedial_scores (user_id, phase, step, level, task_a_score, task_b_score, task_c_score, task_d_score, task_e_score, task_f_score, total_score, max_score, passed, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)', (user_id, 4, 4, 'B1', task_a, task_b, task_c, task_d, task_e, task_f, total, 38, passed))
            db.commit()
        except Exception as db_error:
            logger.error(f"Database error: {db_error}")
        return {'success': True, 'data': {'task_a': task_a, 'task_b': task_b, 'task_c': task_c, 'task_d': task_d, 'task_e': task_e, 'task_f': task_f, 'total': total, 'max_score': 38, 'threshold': 22, 'passed': passed, 'next_url': next_url}}
    except Exception as e:
        logger.error(f"Error calculating Phase 4 Step 4 B1 final score: {e}")
        return JSONResponse(status_code=500, content={'success': False, 'error': str(e)})


@router.post("/step4/remedial/b2/final-score")
async def calculate_step4_b2_final_score(request: Request):
    """Calculate Phase 4 Step 4 Remedial B2 final score."""
    try:
        data = await request.json()
        task_a = data.get('task_a_score', 0)
        task_b = data.get('task_b_score', 0)
        task_c = data.get('task_c_score', 0)
        task_d = data.get('task_d_score', 0)
        total = task_a + task_b + task_c + task_d
        passed = total >= 20
        next_url = _phase4_next_step_url(4) if passed else _phase4_retry_url(4, 'B2')
        return {'success': True, 'data': {'task_a': task_a, 'task_b': task_b, 'task_c': task_c, 'task_d': task_d, 'total': total, 'max_score': 24, 'threshold': 20, 'passed': passed, 'next_url': next_url}}
    except Exception as e:
        logger.error(f"Error calculating Phase 4 Step 4 B2 final score: {e}")
        return JSONResponse(status_code=500, content={'success': False, 'error': str(e)})


@router.post("/step4/remedial/c1/final-score")
async def calculate_step4_c1_final_score(request: Request):
    """Calculate Phase 4 Step 4 Remedial C1 final score."""
    try:
        data = await request.json()
        task_a = data.get('task_a_score', 0)
        task_b = data.get('task_b_score', 0)
        task_c = data.get('task_c_score', 0)
        task_d = data.get('task_d_score', 0)
        total = task_a + task_b + task_c + task_d
        passed = total >= 21
        next_url = _phase4_next_step_url(4) if passed else _phase4_retry_url(4, 'C1')
        return {'success': True, 'data': {'task_a': task_a, 'task_b': task_b, 'task_c': task_c, 'task_d': task_d, 'total': total, 'max_score': 26, 'threshold': 21, 'passed': passed, 'next_url': next_url}}
    except Exception as e:
        logger.error(f"Error calculating Phase 4 Step 4 C1 final score: {e}")
        return JSONResponse(status_code=500, content={'success': False, 'error': str(e)})


# ============================================================================
# STEP 5 REMEDIAL ENDPOINTS
# ============================================================================

@router.post("/step5/evaluate-spelling")
async def evaluate_step5_spelling(request: Request, user: dict = Depends(get_current_user)):
    """Evaluate Step 5 Interaction 1 and return a CEFR-band score from 1-5."""
    try:
        data = await request.json()
        corrected_text = (data.get('correctedText') or data.get('corrected_text') or '').strip()
        level = data.get('level', 'A1')
        if not corrected_text:
            return {'success': False, 'score': 0, 'level': 'Below A1', 'feedback': 'Please correct the spelling mistakes in the text.'}

        level_keywords = {
            'A1': ['has', 'title', 'festival', 'colours'],
            'A2': ['gatefold', 'lettering', 'title', 'global', 'festival'],
            'B1': ['features', 'gatefold', 'layout', 'lettering', 'slogan'],
            'B2': ['employs', 'design', 'immersive', 'elegant', 'lettering'],
            'C1': ['integrates', 'sophisticated', 'layout', 'precise', 'lettering', 'visual', 'hierarchy'],
        }
        keywords = level_keywords.get(level, level_keywords['A1'])
        found = sum(1 for word in keywords if word.lower() in corrected_text.lower())
        score = _phase4_normalize_to_cefr(found, len(keywords))
        level_name = {1: 'A1', 2: 'A2', 3: 'B1', 4: 'B2', 5: 'C1'}[score]
        return {
            'success': True,
            'score': score,
            'level': level_name,
            'feedback': f'Spelling score: {score}/5.',
            'details': {'matched_words': found, 'target_words': len(keywords)}
        }
    except Exception as e:
        logger.error(f"Error evaluating Phase 4 Step 5 spelling: {e}")
        return JSONResponse(status_code=500, content={'success': False, 'error': str(e)})


@router.post("/step5/evaluate-grammar")
async def evaluate_step5_grammar(request: Request, user: dict = Depends(get_current_user)):
    """Evaluate Step 5 Interaction 2 and return a CEFR-band score from 1-5."""
    try:
        data = await request.json()
        corrected_text = (data.get('correctedText') or data.get('grammar_corrected') or '').strip()
        level = data.get('level', 'A1')
        if not corrected_text:
            return {'success': False, 'score': 0, 'level': 'Below A1', 'feedback': 'Please correct the grammar mistakes in the text.'}

        grammar_targets = {
            'A1': ['a title', 'are red'],
            'A2': ['a gatefold', 'uses colours'],
            'B1': ['includes colorful images', 'includes images'],
            'B2': ['slogan is persuasive'],
            'C1': ['encapsulates the ethos'],
        }
        targets = grammar_targets.get(level, grammar_targets['A1'])
        lowered = corrected_text.lower()
        found = sum(1 for phrase in targets if phrase.lower() in lowered)
        score = _phase4_normalize_to_cefr(found, len(targets))
        level_name = {1: 'A1', 2: 'A2', 3: 'B1', 4: 'B2', 5: 'C1'}[score]
        return {
            'success': True,
            'score': score,
            'level': level_name,
            'feedback': f'Grammar score: {score}/5.',
            'details': {'matched_targets': found, 'target_count': len(targets)}
        }
    except Exception as e:
        logger.error(f"Error evaluating Phase 4 Step 5 grammar: {e}")
        return JSONResponse(status_code=500, content={'success': False, 'error': str(e)})


@router.post("/step5/evaluate-enhancement")
async def evaluate_step5_enhancement(request: Request, user: dict = Depends(get_current_user)):
    """Evaluate Step 5 Interaction 3 and return a CEFR-band score from 1-5."""
    try:
        data = await request.json()
        enhanced_text = (data.get('enhancedText') or data.get('enhanced_post') or '').strip()
        if not enhanced_text:
            return {'success': False, 'score': 0, 'level': 'Below A1', 'feedback': 'Please enhance the text with connectors and better vocabulary.'}

        lowered = enhanced_text.lower()
        word_count = len(enhanced_text.split())
        connectors = sum(1 for word in ['and', 'because', 'first', 'then', 'while', 'furthermore', 'moreover'] if word in lowered)
        advanced_vocab = sum(1 for word in ['eye-catching', 'persuasive', 'immersive', 'transitions', 'seamlessly', 'elevates', 'narrative'] if word in lowered)
        richness = min(5, connectors + advanced_vocab + (1 if word_count >= 20 else 0) + (1 if word_count >= 35 else 0))
        score = max(1, min(5, richness))
        level_name = {1: 'A1', 2: 'A2', 3: 'B1', 4: 'B2', 5: 'C1'}[score]
        return {
            'success': True,
            'score': score,
            'level': level_name,
            'feedback': f'Enhancement score: {score}/5.',
            'details': {'word_count': word_count, 'connector_hits': connectors, 'vocabulary_hits': advanced_vocab}
        }
    except Exception as e:
        logger.error(f"Error evaluating Phase 4 Step 5 enhancement: {e}")
        return JSONResponse(status_code=500, content={'success': False, 'error': str(e)})


@router.post("/step/5/calculate-score")
async def calculate_step5_score(request: Request, user: dict = Depends(get_current_user)):
    """Calculate Phase 4 Step 5 total score and route to the matching remedial level."""
    try:
        user_id = user["user_id"]
        data = await request.json()

        interaction1_score = data.get('interaction1_score', 0)
        interaction2_score = data.get('interaction2_score', 0)
        interaction3_score = data.get('interaction3_score', 0)

        for index, score in enumerate([interaction1_score, interaction2_score, interaction3_score], start=1):
            if not (1 <= score <= 5):
                return JSONResponse(
                    {'success': False, 'error': f'Interaction {index} score must be between 1 and 5'},
                    status_code=400
                )

        total_score = interaction1_score + interaction2_score + interaction3_score
        remedial_level = _phase4_total_to_level(total_score, [(4, 'A1'), (7, 'A2'), (10, 'B1'), (13, 'B2')])
        next_url = _phase4_remedial_start_url(5, remedial_level)

        print("\n" + "="*60)
        print("PHASE 4 STEP 5 - SCORING RESULTS")
        print("="*60)
        print(f"User ID: {user_id}")
        print(f"I1={interaction1_score}, I2={interaction2_score}, I3={interaction3_score}")
        print(f"Total: {total_score}/15, Level: Remedial {remedial_level}")
        print(f"ROUTING TO: {next_url}")
        print("="*60 + "\n")

        save_phase4_progress(
            user_id, step=5, interaction=1, context=f'remedial_{remedial_level.lower()}', subphase=1,
            score=total_score, item_id='step5_score', item_type='score',
            prompt='Phase 4 Step 5 Score',
            answer=json.dumps({'i1': interaction1_score, 'i2': interaction2_score, 'i3': interaction3_score}),
            is_correct=False
        )

        return {
            'success': True,
            'data': _phase4_build_main_score_payload(
                [interaction1_score, interaction2_score, interaction3_score],
                [5, 5, 5],
                total_score,
                15,
                remedial_level,
                next_url
            )
        }
    except Exception as e:
        logger.error(f"Error calculating Phase 4 Step 5 score: {e}")
        return JSONResponse(status_code=500, content={'success': False, 'error': str(e)})


@router.post("/step5/remedial/log")
async def log_step5_remedial_task(request: Request):
    """Log Phase 4 Step 5 remedial task completion."""
    try:
        data = await request.json()
        level = data.get('level', 'Unknown')
        task = data.get('task', 'Unknown')
        score = data.get('score', 0)
        max_score = data.get('max_score', data.get('maxScore', 0))
        print(f"\n{'='*60}\nPHASE 4 STEP 5 - REMEDIAL {level} - TASK {task}\n{'='*60}\nScore: {score}/{max_score}\n{'='*60}\n")
        return {'success': True, 'message': 'Phase 4 Step 5 remedial task logged successfully'}
    except Exception as e:
        logger.error(f"Error logging Phase 4 Step 5 remedial task: {e}")
        return JSONResponse(status_code=500, content={'success': False, 'error': str(e)})


@router.post("/step5/remedial/a1/final-score")
async def calculate_step5_a1_final_score(request: Request):
    """Calculate Phase 4 Step 5 Remedial A1 final score."""
    try:
        data = await request.json()
        task_a = data.get('task_a_score', 0)
        task_b = data.get('task_b_score', 0)
        task_c = data.get('task_c_score', 0)
        total = task_a + task_b + task_c
        passed = total >= 17
        next_url = _phase4_next_step_url(5) if passed else _phase4_retry_url(5, 'A1')
        return {'success': True, 'data': {'task_a': task_a, 'task_b': task_b, 'task_c': task_c, 'total': total, 'max_score': 22, 'threshold': 17, 'passed': passed, 'next_url': next_url}}
    except Exception as e:
        logger.error(f"Error calculating Phase 4 Step 5 A1 final score: {e}")
        return JSONResponse(status_code=500, content={'success': False, 'error': str(e)})


@router.post("/step5/remedial/a2/final-score")
async def calculate_step5_a2_final_score(request: Request):
    """Calculate Phase 4 Step 5 Remedial A2 final score."""
    try:
        data = await request.json()
        task_a = data.get('task_a_score', 0)
        task_b = data.get('task_b_score', 0)
        task_c = data.get('task_c_score', 0)
        total = task_a + task_b + task_c
        passed = total >= 15
        next_url = _phase4_next_step_url(5) if passed else _phase4_retry_url(5, 'A2')
        return {'success': True, 'data': {'task_a': task_a, 'task_b': task_b, 'task_c': task_c, 'total': total, 'max_score': 18, 'threshold': 15, 'passed': passed, 'next_url': next_url}}
    except Exception as e:
        logger.error(f"Error calculating Phase 4 Step 5 A2 final score: {e}")
        return JSONResponse(status_code=500, content={'success': False, 'error': str(e)})


@router.post("/step5/remedial/b1/final-score")
async def calculate_step5_b1_final_score(request: Request):
    """Calculate Phase 4 Step 5 Remedial B1 final score."""
    try:
        data = await request.json()
        task_a = data.get('task_a_score', 0)
        task_b = data.get('task_b_score', 0)
        task_c = data.get('task_c_score', 0)
        task_d = data.get('task_d_score', 0)
        task_e = data.get('task_e_score', 0)
        task_f = data.get('task_f_score', 0)
        required_score = task_a + task_b + task_c + task_d
        total = required_score + task_e + task_f
        passed = required_score >= 22
        next_url = _phase4_next_step_url(5) if passed else _phase4_retry_url(5, 'B1')
        return {'success': True, 'data': {'task_a': task_a, 'task_b': task_b, 'task_c': task_c, 'task_d': task_d, 'task_e': task_e, 'task_f': task_f, 'required_score': required_score, 'required_threshold': 22, 'total': total, 'max_score': 39, 'passed': passed, 'next_url': next_url}}
    except Exception as e:
        logger.error(f"Error calculating Phase 4 Step 5 B1 final score: {e}")
        return JSONResponse(status_code=500, content={'success': False, 'error': str(e)})


@router.post("/step5/remedial/b2/final-score")
async def calculate_step5_b2_final_score(request: Request):
    """Calculate Phase 4 Step 5 Remedial B2 final score."""
    try:
        data = await request.json()
        task_a = data.get('task_a_score', 0)
        task_b = data.get('task_b_score', 0)
        task_c = data.get('task_c_score', 0)
        task_d = data.get('task_d_score', 0)
        task_e = data.get('task_e_score', 0)
        task_f = data.get('task_f_score', 0)
        total = task_a + task_b + task_c + task_d + task_e + task_f
        passed = total >= 37
        next_url = _phase4_next_step_url(5) if passed else _phase4_retry_url(5, 'B2')
        return {'success': True, 'data': {'task_a': task_a, 'task_b': task_b, 'task_c': task_c, 'task_d': task_d, 'task_e': task_e, 'task_f': task_f, 'total': total, 'max_score': 46, 'threshold': 37, 'passed': passed, 'next_url': next_url}}
    except Exception as e:
        logger.error(f"Error calculating Phase 4 Step 5 B2 final score: {e}")
        return JSONResponse(status_code=500, content={'success': False, 'error': str(e)})


@router.post("/step5/remedial/c1/final-score")
async def calculate_step5_c1_final_score(request: Request):
    """Calculate Phase 4 Step 5 Remedial C1 final score."""
    try:
        data = await request.json()
        task_a = data.get('task_a_score', 0)
        task_b = data.get('task_b_score', 0)
        task_c = data.get('task_c_score', 0)
        task_d = data.get('task_d_score', 0)
        task_e = data.get('task_e_score', 0)
        task_f = data.get('task_f_score', 0)
        task_g = data.get('task_g_score', 0)
        total = task_a + task_b + task_c + task_d + task_e + task_f + task_g
        passed = total >= 34
        next_url = _phase4_next_step_url(5) if passed else _phase4_retry_url(5, 'C1')
        return {'success': True, 'data': {'task_a': task_a, 'task_b': task_b, 'task_c': task_c, 'task_d': task_d, 'task_e': task_e, 'task_f': task_f, 'task_g': task_g, 'total': total, 'max_score': 42, 'threshold': 34, 'passed': passed, 'next_url': next_url}}
    except Exception as e:
        logger.error(f"Error calculating Phase 4 Step 5 C1 final score: {e}")
        return JSONResponse(status_code=500, content={'success': False, 'error': str(e)})

@router.post("/step5/remedial/evaluate-expansion")
async def evaluate_step5_remedial_expansion(request: Request, user: dict = Depends(get_current_user)):
    """Evaluate sentence correction for B2/C1 Task B (Analysis Odyssey)"""
    try:
        data = await request.json()
        level = data.get('level', 'B2')
        faulty_sentence = data.get('faultySentence', '')
        user_answer = data.get('userAnswer', '').strip()
        sentence_index = data.get('sentenceIndex', 0)

        if not user_answer:
            return {'correct': False, 'feedback': 'Please provide your correction.'}

        if ai_service.client:
            try:
                if level == 'B2':
                    system_prompt = """You are a CEFR B2-level language evaluator for sentence correction exercises.

Evaluate if the student's corrected sentence meets B2 requirements:
1. **Grammar**: Proper subject-verb agreement, verb forms, tenses
2. **Articles**: Correct use of a/an/the
3. **Vocabulary**: Upgraded vocabulary (good→effective, bad→poorly executed, ok→acceptable, nice→pleasant)
4. **Connectors**: Proper use of although, even though, but
5. **Coherence**: Logical flow and clear meaning
6. **Spelling**: No spelling errors

IMPORTANT: Be flexible. Accept variations if they demonstrate B2-level improvements.
Do NOT require exact matches to expected answers.

Respond ONLY in JSON format:
{
    "correct": true or false,
    "feedback": "Brief encouraging feedback (1-2 sentences)"
}"""
                else:  # C1
                    system_prompt = """You are a CEFR C1-level language evaluator for sentence correction exercises.

Evaluate if the student's corrected sentence meets C1 requirements:
1. **Grammar**: Perfect subject-verb agreement, precise verb forms, complex tenses
2. **Vocabulary**: Sophisticated words (hinges, rooted, compelling, fosters, exemplifies, captivates, determines)
3. **Syntax**: Complex structures with dashes (—), commas, subordinate clauses
4. **Connectors**: Precise connectors (although, yet, rather than, regarding, ensuring, through)
5. **Nuance**: Adds detail, context, and sophisticated meaning
6. **Coherence**: Elegant, flowing sentences with clear logical relationships

IMPORTANT: Be flexible with structure but require C1-level sophistication.
Do NOT require exact matches to expected answers.

Respond ONLY in JSON format:
{
    "correct": true or false,
    "feedback": "Brief encouraging feedback (1-2 sentences)"
}"""

                user_prompt = f"""
Faulty sentence: "{faulty_sentence}"
Student's correction: "{user_answer}"

Evaluate if this correction meets {level}-level requirements.
Return ONLY valid JSON."""

                ai_response = ai_service.client.chat.completions.create(
                    model=ai_service.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    max_tokens=200, temperature=0.3
                )
                result_text = ai_response.choices[0].message.content.strip()
                if '```json' in result_text:
                    result_text = result_text.split('```json')[1].split('```')[0]
                elif '```' in result_text:
                    result_text = result_text.split('```')[1].split('```')[0]
                result = json.loads(result_text.strip())
                return {'correct': result.get('correct', False), 'feedback': result.get('feedback', 'Keep practicing!')}
            except Exception as e:
                logger.error(f"AI evaluation error: {str(e)}")

        # Fallback: Accept if meaningful changes were made
        if len(user_answer) >= len(faulty_sentence):
            return {'correct': True, 'feedback': 'Good correction! Keep up the good work.'}
        else:
            return {'correct': False, 'feedback': 'Try to expand and improve the sentence more.'}

    except Exception as e:
        logger.error(f"Error evaluating expansion: {e}")
        return {'correct': True, 'feedback': 'Correction recorded.'}


@router.post("/step5/remedial/evaluate-question")
async def evaluate_step5_remedial_question(request: Request, user: dict = Depends(get_current_user)):
    """Evaluate question answers for C1 Task C (Quizlet Live)"""
    try:
        data = await request.json()
        level = data.get('level', 'C1')
        question = data.get('question', '')
        user_answer = data.get('userAnswer', '').strip()
        expected_answer = data.get('expectedAnswer', '')
        keywords = data.get('keywords', [])

        if not user_answer:
            return {'correct': False, 'feedback': 'Please provide your answer.'}

        if ai_service.client:
            try:
                system_prompt = """You are a CEFR C1-level language evaluator for advanced comprehension questions.

Evaluate if the student's answer meets C1 requirements:
1. **Video References**: Mentions specific videos (video 1, video 2)
2. **Key Concepts**: Includes relevant keywords from expected answer
3. **Sophisticated Vocabulary**: Uses advanced words and precise expressions
4. **Detail**: Provides complete explanations (minimum 30 characters)
5. **Nuance**: Explains both advantages and drawbacks where applicable
6. **Coherence**: Clear, flowing sentences with logical connections

IMPORTANT: Be flexible. Accept answers that demonstrate understanding even if worded differently.
Do NOT require exact matches to expected answers.

Respond ONLY in JSON format:
{
    "correct": true or false,
    "feedback": "Brief encouraging feedback (1-2 sentences)"
}"""

                user_prompt = f"""
Question: "{question}"
Expected answer: "{expected_answer}"
Key concepts: {', '.join(keywords)}

Student's answer: "{user_answer}"

Evaluate if this answer meets C1-level requirements and demonstrates understanding.
Return ONLY valid JSON."""

                ai_response = ai_service.client.chat.completions.create(
                    model=ai_service.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    max_tokens=200, temperature=0.3
                )
                result_text = ai_response.choices[0].message.content.strip()
                if '```json' in result_text:
                    result_text = result_text.split('```json')[1].split('```')[0]
                elif '```' in result_text:
                    result_text = result_text.split('```')[1].split('```')[0]
                result = json.loads(result_text.strip())
                return {'correct': result.get('correct', False), 'feedback': result.get('feedback', 'Keep practicing!')}
            except Exception as e:
                logger.error(f"AI evaluation error: {str(e)}")

        # Fallback: Check for keywords
        user_lower = user_answer.lower()
        keyword_matches = sum(1 for kw in keywords if kw.lower() in user_lower)
        keyword_threshold = len(keywords) * 0.6

        if keyword_matches >= keyword_threshold and len(user_answer) >= 30:
            return {'correct': True, 'feedback': 'Good answer! You covered the key concepts.'}
        else:
            return {'correct': False, 'feedback': 'Try to include more key concepts and details in your answer.'}

    except Exception as e:
        logger.error(f"Error evaluating question: {e}")
        return {'correct': True, 'feedback': 'Answer recorded.'}


@router.post("/step5/remedial/evaluate-tense")
async def evaluate_step5_remedial_tense(request: Request, user: dict = Depends(get_current_user)):
    """Evaluate tense correction for C1 Task D (Tense Odyssey)"""
    try:
        data = await request.json()
        level = data.get('level', 'C1')
        faulty_sentence = data.get('faultySentence', '')
        user_answer = data.get('userAnswer', '').strip()
        expected_answer = data.get('expectedAnswer', '')
        key_elements = data.get('keyElements', [])

        if not user_answer:
            return {'correct': False, 'feedback': 'Please provide your correction.'}

        if ai_service.client:
            try:
                system_prompt = """You are a CEFR C1-level language evaluator for mixed tense/grammar correction exercises.

Evaluate if the student's corrected sentence meets C1 requirements:
1. **Tense Accuracy**: Proper use of perfect tenses (has been used, have become, have proven), past perfect (had been, had it been)
2. **Conditionals**: Complex conditionals (would be, would have been, would have felt, if it incorporated, had it been)
3. **Subject-Verb Agreement**: Correct agreement (are→is, were→was, has→have, stand→stands)
4. **Sophisticated Vocabulary**: Advanced words (employed, portrayed, illustrates, oversaturated, authentic)
5. **Complex Syntax**: Uses commas, subordinate clauses, relative clauses (which, although, yet)
6. **Video References**: Includes references like "as video 1 suggests", "in video 2"

IMPORTANT: Be flexible with exact wording but require C1-level tense sophistication.
Do NOT require exact matches - accept variations that demonstrate C1-level understanding.

Respond ONLY in JSON format:
{
    "correct": true or false,
    "feedback": "Brief encouraging feedback (1-2 sentences)"
}"""

                user_prompt = f"""
Faulty sentence: "{faulty_sentence}"
Expected correction: "{expected_answer}"
Key elements needed: {', '.join(key_elements)}

Student's correction: "{user_answer}"

Evaluate if this correction meets C1-level requirements for tense, grammar, and structure.
Return ONLY valid JSON."""

                ai_response = ai_service.client.chat.completions.create(
                    model=ai_service.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    max_tokens=200, temperature=0.3
                )
                result_text = ai_response.choices[0].message.content.strip()
                if '```json' in result_text:
                    result_text = result_text.split('```json')[1].split('```')[0]
                elif '```' in result_text:
                    result_text = result_text.split('```')[1].split('```')[0]
                result = json.loads(result_text.strip())
                return {'correct': result.get('correct', False), 'feedback': result.get('feedback', 'Keep practicing!')}
            except Exception as e:
                logger.error(f"AI evaluation error: {str(e)}")

        # Fallback: Check for key elements
        user_lower = user_answer.lower()
        has_key_elements = all(elem.lower() in user_lower for elem in key_elements)
        has_proper_length = len(user_answer) >= 80
        has_punctuation = ',' in user_answer
        is_not_faulty = user_answer.lower() != faulty_sentence.lower()

        if has_key_elements and has_proper_length and has_punctuation and is_not_faulty:
            return {'correct': True, 'feedback': 'Good correction! You used the required tenses and structures.'}
        else:
            return {'correct': False, 'feedback': 'Remember to use perfect tenses, conditionals, and complex structures.'}

    except Exception as e:
        logger.error(f"Error evaluating tense correction: {e}")
        return {'correct': True, 'feedback': 'Correction recorded.'}


@router.post("/step5/remedial/evaluate-clause")
async def evaluate_step5_remedial_clause(request: Request, user: dict = Depends(get_current_user)):
    """Evaluate clause analysis for C1 Task E (Clause Conquest). All sentences are CORRECT."""
    try:
        data = await request.json()
        level = data.get('level', 'C1')
        original_sentence = data.get('originalSentence', '')
        user_answer = data.get('userAnswer', '').strip()
        correct_answer = data.get('correctAnswer', '')

        if not user_answer:
            return {'correct': False, 'feedback': 'Please provide your answer.'}

        if ai_service.client:
            try:
                system_prompt = """You are a CEFR C1-level language evaluator for clause analysis exercises.

IMPORTANT CONTEXT: All sentences in this task are grammatically CORRECT. The student's task is to analyze each sentence and recognize that it has proper structure.

Evaluate if the student correctly identified the sentence as correct. Accept if they:
1. Wrote "correct", "this is correct", "already correct", "no errors", or similar recognition
2. Copied the entire sentence accurately (showing they recognized it's correct and preserved it)
3. Made only minor typos while copying but clearly tried to preserve the correct sentence

REJECT if they:
- Wrote nonsense or random characters (e.g., "hhhhhhh", "asdfasdf")
- Tried to "fix" a sentence that was already correct
- Wrote incomplete fragments
- Provided an answer that shows they misunderstood the task

The original sentence has:
- Proper relative clauses (which, by which)
- Correct passive voice constructions
- Accurate tense usage (present perfect, conditionals)
- Complex subordination

Respond ONLY in JSON format:
{
    "correct": true or false,
    "feedback": "Brief feedback (1 sentence)"
}"""

                user_prompt = f"""
Original sentence (which is CORRECT): "{original_sentence}"
Student's answer: "{user_answer}"

Did the student correctly recognize this sentence as grammatically correct?
Return ONLY valid JSON."""

                ai_response = ai_service.client.chat.completions.create(
                    model=ai_service.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    max_tokens=150, temperature=0.3
                )
                result_text = ai_response.choices[0].message.content.strip()
                if '```json' in result_text:
                    result_text = result_text.split('```json')[1].split('```')[0]
                elif '```' in result_text:
                    result_text = result_text.split('```')[1].split('```')[0]
                result = json.loads(result_text.strip())
                return {'correct': result.get('correct', False), 'feedback': result.get('feedback', 'Keep practicing!')}
            except Exception as e:
                logger.error(f"AI evaluation error: {str(e)}")

        # Fallback: Check for "correct" keyword or exact copy
        user_lower = user_answer.lower().strip()
        recognized_correct = user_lower in ['correct', 'this is correct', 'already correct', 'no errors', 'no error', 'sentence is correct']

        # Check if they copied the sentence (at least 80% match)
        correct_lower = correct_answer.lower().strip()
        if len(user_answer) > 50:
            copied_correctly = user_lower == correct_lower or correct_lower in user_lower
        else:
            copied_correctly = False

        if recognized_correct or copied_correctly:
            return {'correct': True, 'feedback': 'Correct! You recognized the sentence has proper structure.'}
        else:
            return {'correct': False, 'feedback': 'This sentence is actually correct. Try to recognize proper C1-level structures.'}

    except Exception as e:
        logger.error(f"Error evaluating clause: {e}")
        return {'correct': False, 'feedback': 'Evaluation error occurred.'}


# ============================================================================
# STEP 5 REMEDIAL: EVALUATE-MODAL
# ============================================================================

@router.post("/step5/remedial/evaluate-modal")
async def evaluate_step5_remedial_modal(request: Request, user: dict = Depends(get_current_user)):
    """Evaluate modal/subjunctive analysis for C1 Task F (Debate Duel Advanced)"""
    try:
        data = await request.json()
        level = data.get('level', 'C1')
        original_sentence = data.get('originalSentence', '')
        user_answer = data.get('userAnswer', '').strip()
        correct_answer = data.get('correctAnswer', '')
        grammar_type = data.get('grammarType', '')

        if not user_answer:
            return {'correct': False, 'feedback': 'Please provide your answer.'}

        if ai_service.client:
            try:
                system_prompt = """You are a CEFR C1-level language evaluator for subjunctive and modal analysis exercises.

IMPORTANT CONTEXT: All sentences in this task are grammatically CORRECT. The student's task is to analyze each sentence and recognize that it uses subjunctive/modal structures correctly.

Evaluate if the student correctly identified the sentence as correct. Accept if they:
1. Wrote "correct", "this is correct", "already correct", "no errors", or similar recognition
2. Copied the entire sentence accurately (showing they recognized it's correct and preserved it)
3. Made only minor typos while copying but clearly tried to preserve the correct sentence

REJECT if they:
- Wrote nonsense or random characters
- Tried to "fix" a sentence that was already correct
- Wrote incomplete fragments
- Provided an answer that shows they misunderstood the task

Respond ONLY in JSON format:
{
    "correct": true or false,
    "feedback": "Brief feedback (1 sentence)"
}"""

                user_prompt = f"""
Original sentence (which is CORRECT): "{original_sentence}"
Grammar type: {grammar_type}
Student's answer: "{user_answer}"

Did the student correctly recognize this sentence has proper subjunctive/modal usage?
Return ONLY valid JSON."""

                ai_response = ai_service.client.chat.completions.create(
                    model=ai_service.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    max_tokens=150,
                    temperature=0.3
                )

                result_text = ai_response.choices[0].message.content.strip()
                if '```json' in result_text:
                    result_text = result_text.split('```json')[1].split('```')[0]
                elif '```' in result_text:
                    result_text = result_text.split('```')[1].split('```')[0]
                result = json.loads(result_text.strip())
                return {'correct': result.get('correct', False), 'feedback': result.get('feedback', 'Keep practicing!')}

            except Exception as e:
                logger.error(f"AI evaluation error: {str(e)}")

        # Fallback
        user_lower = user_answer.lower().strip()
        recognized_correct = user_lower in ['correct', 'this is correct', 'already correct', 'no errors', 'no error', 'sentence is correct']
        correct_lower = correct_answer.lower().strip()
        copied_correctly = (len(user_answer) > 50 and (user_lower == correct_lower or correct_lower in user_lower))

        if recognized_correct or copied_correctly:
            return {'correct': True, 'feedback': 'Correct! You recognized proper subjunctive/modal usage.'}
        else:
            return {'correct': False, 'feedback': 'This sentence is actually correct. Recognize C1-level subjunctive and modal structures.'}

    except Exception as e:
        logger.error(f"Error evaluating modal: {e}")
        return {'correct': False, 'feedback': 'Evaluation error occurred.'}


# ============================================================================
# STEP 5 REMEDIAL: EVALUATE-CORRECTION
# ============================================================================

@router.post("/step5/remedial/evaluate-correction")
async def evaluate_step5_remedial_correction(request: Request, user: dict = Depends(get_current_user)):
    """Evaluate comprehensive error correction for C1 Task G (Correction Crusade)"""
    try:
        data = await request.json()
        level = data.get('level', 'C1')
        faulty_sentence = data.get('faultySentence', '')
        user_answer = data.get('userAnswer', '').strip()
        correct_answer = data.get('correctAnswer', '')
        errors = data.get('errors', [])

        if not user_answer:
            return {'correct': False, 'feedback': 'Please provide your correction.'}

        if ai_service.client:
            try:
                system_prompt = """You are a CEFR C1-level language evaluator for comprehensive error correction exercises.

Evaluate if the student's corrected sentence fixes ALL the errors and meets C1 requirements:
1. **Subject-Verb Agreement**: All subjects and verbs must agree
2. **Relative Clauses**: Proper commas around non-restrictive clauses
3. **Tenses**: Correct verb tenses throughout
4. **Vocabulary**: C1-level word choices (employed, highly effective, etc.)
5. **Connectors**: Sophisticated connectors (although, yet, etc.)
6. **Completeness**: All necessary objects, articles, modals added
7. **Punctuation**: Proper comma usage

IMPORTANT: Be flexible with exact wording but ensure all major errors are fixed.

Respond ONLY in JSON format:
{
    "correct": true or false,
    "feedback": "Brief encouraging feedback (1-2 sentences)"
}"""

                user_prompt = f"""
Faulty sentence: "{faulty_sentence}"
Errors to fix: {', '.join(errors)}
Expected correction: "{correct_answer}"

Student's correction: "{user_answer}"

Did the student successfully fix all the errors at C1 level?
Return ONLY valid JSON."""

                ai_response = ai_service.client.chat.completions.create(
                    model=ai_service.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    max_tokens=200,
                    temperature=0.3
                )

                result_text = ai_response.choices[0].message.content.strip()
                if '```json' in result_text:
                    result_text = result_text.split('```json')[1].split('```')[0]
                elif '```' in result_text:
                    result_text = result_text.split('```')[1].split('```')[0]
                result = json.loads(result_text.strip())
                return {'correct': result.get('correct', False), 'feedback': result.get('feedback', 'Keep practicing!')}

            except Exception as e:
                logger.error(f"AI evaluation error: {str(e)}")

        # Fallback
        user_lower = user_answer.lower().strip()
        has_proper_agreement = 'are to sell' not in user_lower and 'which provide' not in user_lower
        has_length = len(user_answer) >= len(correct_answer) * 0.75
        is_not_faulty = user_lower != faulty_sentence.lower()

        if has_proper_agreement and has_length and is_not_faulty:
            return {'correct': True, 'feedback': 'Good correction! You fixed the major errors.'}
        else:
            return {'correct': False, 'feedback': 'Make sure to fix ALL errors: grammar, vocabulary, tenses, punctuation, and structure.'}

    except Exception as e:
        logger.error(f"Error evaluating correction: {e}")
        return {'correct': True, 'feedback': 'Correction recorded.'}


# ============================================================================
# STEP 5 REMEDIAL: EVALUATE-SUBJUNCTIVE
# ============================================================================

@router.post("/step5/remedial/evaluate-subjunctive")
async def evaluate_step5_remedial_subjunctive(request: Request, user: dict = Depends(get_current_user)):
    """Evaluate subjunctive/modal corrections for C1 Task F (Debate Duel Advanced)"""
    try:
        data = await request.json()
        level = data.get('level', 'C1')
        faulty_sentence = data.get('faultySentence', '')
        user_answer = data.get('userAnswer', '').strip()
        correct_answer = data.get('correctAnswer', '')
        errors = data.get('errors', [])

        if not user_answer:
            return {'correct': False, 'feedback': 'Please provide your correction.'}

        if ai_service.client:
            try:
                system_prompt = """You are a CEFR C1-level language evaluator for subjunctive and modal correction exercises.

Evaluate if the student's corrected sentence fixes the subjunctive/modal errors and meets C1 requirements:
1. **Present Subjunctive**: Base form "be" after "it is crucial/essential that" (not "is" or "are")
2. **Modals + Base Form**: Modal verbs (should, could, might, must) must be followed by BASE VERB (incorporate, not incorporates)
3. **Second Conditional**: Use "were" (not "was") in if-clauses
4. **Advanced Structures**: "lest" + base form, implied subjunctive

IMPORTANT: Be flexible with minor wording changes but ensure the core grammatical errors are corrected.

Respond ONLY in JSON format:
{
    "correct": true or false,
    "feedback": "Brief encouraging feedback (1-2 sentences)"
}"""

                user_prompt = f"""
Faulty sentence: "{faulty_sentence}"
Error to fix: {', '.join(errors)}
Expected correction: "{correct_answer}"

Student's correction: "{user_answer}"

Did the student successfully fix the subjunctive/modal error at C1 level?
Return ONLY valid JSON."""

                ai_response = ai_service.client.chat.completions.create(
                    model=ai_service.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    max_tokens=200,
                    temperature=0.3
                )

                result_text = ai_response.choices[0].message.content.strip()
                if '```json' in result_text:
                    result_text = result_text.split('```json')[1].split('```')[0]
                elif '```' in result_text:
                    result_text = result_text.split('```')[1].split('```')[0]
                result = json.loads(result_text.strip())
                return {'correct': result.get('correct', False), 'feedback': result.get('feedback', 'Keep practicing!')}

            except Exception as e:
                logger.error(f"AI evaluation error: {str(e)}")

        # Fallback
        user_lower = user_answer.lower().strip()
        fixed_subjunctive = 'is balanced' not in user_lower and 'is prioritized' not in user_lower
        fixed_modals = 'incorporates' not in user_lower and 'captivates' not in user_lower and 'remains' not in user_lower
        fixed_conditional = 'was applied' not in user_lower
        has_proper_length = len(user_answer) >= 50

        if fixed_subjunctive and fixed_modals and fixed_conditional and has_proper_length:
            return {'correct': True, 'feedback': 'Good correction! You fixed the subjunctive/modal errors.'}
        else:
            return {'correct': False, 'feedback': 'Make sure to fix the subjunctive/modal errors: use base forms after modals and "that" clauses.'}

    except Exception as e:
        logger.error(f"Error evaluating subjunctive: {e}")
        return {'correct': True, 'feedback': 'Correction recorded.'}


# ===================================
# Phase 4.2 Routes - Social Media Marketing
# ===================================

@router.post("/4_2/interaction/log")
async def log_phase4_2_interaction(request: Request, user: dict = Depends(get_current_user)):
    """Log Phase 4.2 interaction completion (Wordshake, Sushi Spell, etc.)"""
    try:
        user_id = user['user_id']
        data = await request.json()

        step = data.get('step', 1)
        interaction = data.get('interaction', 1)
        completed = data.get('completed', False)
        score = data.get('score', 0)
        max_score = data.get('max_score', 0)
        time_taken = data.get('time_taken', 0)
        game_type = data.get('game_type', 'unknown')

        print("\n" + "="*60)
        print(f"PHASE 4.2 STEP {step} - INTERACTION {interaction}")
        print("="*60)
        print(f"User ID: {user_id}")
        print(f"Game Type: {game_type}")
        print(f"Score: {score}/{max_score}")
        print(f"Time Taken: {time_taken} seconds")
        print(f"Completed: {completed}")
        print("="*60 + "\n")

        logger.info(f"Phase 4.2 Step {step} Interaction {interaction} - User {user_id}: {game_type} - Score={score}/{max_score}, Time={time_taken}s")

        # Save to DB
        save_phase4_progress(
            user_id, step=step, interaction=interaction, context='main', subphase=2,
            score=score, item_id=f'step{step}_i{interaction}_{game_type}', item_type=game_type,
            prompt=f'Phase 4.2 Step {step} Interaction {interaction}',
            answer=json.dumps({'score': score, 'max_score': max_score, 'time_taken': time_taken}),
            is_correct=completed
        )

        return {'success': True, 'message': 'Interaction logged successfully'}

    except Exception as e:
        logger.error(f"Error logging Phase 4.2 interaction: {e}")
        return JSONResponse(status_code=500, content={'success': False, 'error': str(e)})


@router.post("/4_2/step1/evaluate-response")
async def evaluate_phase4_2_step1_response(request: Request, user: dict = Depends(get_current_user)):
    """Evaluate Phase 4.2 Step 1 Interaction 2 response (Social Media Post Discussion)"""
    try:
        user_id = user['user_id']
        data = await request.json()

        interaction = data.get('interaction', 2)
        response = data.get('response', '').strip()

        if not response:
            return JSONResponse(status_code=400, content={'success': False, 'error': 'Response cannot be empty'})

        print("\n" + "="*60)
        print(f"PHASE 4.2 STEP 1 - INTERACTION {interaction} EVALUATION")
        print("="*60)
        print(f"User ID: {user_id}")
        print(f"Response: {response[:100]}...")
        print("="*60)

        try:
            system_prompt = """You are evaluating a student's social media post idea for the Global Cultures Festival.

The student should suggest an idea for a social media post (Instagram, Twitter, etc.) and explain why it works, using terms like: hashtag, caption, call-to-action, engagement, viral, tag, emoji, story.

Evaluate based on CEFR levels:
- A1 (1 point): Very basic attempt mentioning posts or hashtags
- A2 (2 points): Simple idea with connector (because/so) and basic social media elements
- B1 (3 points): Clear explanation with reasoning and at least one key term, mentioning specific elements
- B2 (4 points): Detailed explanation with comparison or strategic thinking about engagement
- C1 (5 points): Sophisticated analysis using advanced terminology about discoverability, conversions, or emotional connection

Return a JSON object with:
{
    "score": <1-5>,
    "level": "<A1|A2|B1|B2|C1>",
    "feedback": "<constructive feedback>",
    "details": {
        "terms_used": <count of social media terms used>,
        "reasoning_quality": "<basic|good|excellent>"
    }
}"""

            user_prompt = f"Student response:\n{response}"

            ai_response = ai_service.client.chat.completions.create(
                model="llama-3.1-70b-versatile",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                max_tokens=300,
                temperature=0.3
            )

            result_text = ai_response.choices[0].message.content.strip()
            if '```json' in result_text:
                result_text = result_text.split('```json')[1].split('```')[0]
            elif '```' in result_text:
                result_text = result_text.split('```')[1].split('```')[0]
            result = json.loads(result_text.strip())

            score = result.get('score', 1)
            level = result.get('level', 'A1')
            feedback = result.get('feedback', 'Good work!')
            details = result.get('details', {})

            logger.info(f"Phase 4.2 Step 1 Int 2 - User {user_id}: Level={level}, Score={score}/5")

            return {'success': True, 'score': score, 'level': level, 'feedback': feedback, 'details': details}

        except Exception as ai_error:
            logger.error(f"AI evaluation error: {ai_error}")
            word_count = len(response.split())
            has_social_term = any(term in response.lower() for term in ['hashtag', 'caption', 'post', 'emoji', 'tag'])

            if word_count < 5:
                score, level = 1, 'A1'
            elif word_count < 10:
                score, level = 2, 'A2'
            elif word_count < 20:
                score, level = 3, 'B1'
            else:
                score, level = 4, 'B2'

            return {'success': True, 'score': score, 'level': level, 'feedback': 'Good effort! Try to use more social media vocabulary terms and explain your reasoning.', 'details': {}}

    except Exception as e:
        logger.error(f"Error evaluating Phase 4.2 Step 1 response: {e}")
        return JSONResponse(status_code=500, content={'success': False, 'error': str(e)})


@router.post("/4_2/step/{step}/calculate-score")
async def calculate_phase4_2_step_score(step: int, request: Request, user: dict = Depends(get_current_user)):
    """Route Phase 4.2 steps into the matching remedial path using CEFR-normalized totals."""
    try:
        config = _PHASE4_2_MAIN_CONFIG.get(step)
        if not config:
            return JSONResponse(status_code=404, content={'success': False, 'error': f'Unsupported Phase 4.2 step: {step}'})

        data = await request.json()
        raw_scores = []
        normalized_scores = []
        interaction_max_scores = []

        for index, default_max in enumerate(config['max_scores'], start=1):
            raw_score = float(data.get(f'interaction{index}_score', 0))
            max_score = float(data.get(f'interaction{index}_max_score', default_max))
            normalized_score = _phase4_normalize_to_cefr(raw_score, max_score)
            raw_scores.append(raw_score)
            interaction_max_scores.append(max_score)
            normalized_scores.append(normalized_score)

        total_score = sum(normalized_scores)
        total_max_score = 15
        remedial_level = _phase4_total_to_level(total_score, config['thresholds'])
        next_url = _phase4_2_remedial_start_url(step, remedial_level)

        logger.info(
            f"Phase 4.2 Step {step} scoring - User {user['user_id']}: "
            f"Raw={raw_scores}, Normalized={normalized_scores}, Total={total_score}, Level={remedial_level}, Next={next_url}"
        )

        save_phase4_progress(
            user['user_id'],
            step=step,
            interaction=1,
            context=f'remedial_{remedial_level.lower()}',
            subphase=2,
            score=total_score,
            item_id=f'phase4_2_step{step}_score',
            item_type='score',
            prompt=f'Phase 4.2 Step {step} Score',
            answer=json.dumps({'raw_scores': raw_scores, 'normalized_scores': normalized_scores}),
            is_correct=False,
        )

        return {
            'success': True,
            'data': _phase4_build_main_score_payload(
                normalized_scores,
                [5, 5, 5],
                total_score,
                total_max_score,
                remedial_level,
                next_url,
            )
        }
    except Exception as e:
        logger.error(f"Error calculating Phase 4.2 Step {step} score: {e}")
        return JSONResponse(status_code=500, content={'success': False, 'error': str(e)})


@router.post("/4_2/step/{step}/remedial/{level}/final-score")
async def calculate_phase4_2_remedial_final_score(step: int, level: str, request: Request, user: dict = Depends(get_current_user)):
    """Evaluate Phase 4.2 remedial completion and return the next route."""
    try:
        level_key = level.upper()
        config = _PHASE4_2_FINAL_CONFIG.get(step, {}).get(level_key)
        if not config:
            return JSONResponse(
                status_code=404,
                content={'success': False, 'error': f'Unsupported Phase 4.2 remedial path: step {step} level {level_key}'}
            )

        data = await request.json()
        total_score = float(data.get('total_score', 0))
        passed = total_score >= config['threshold']
        next_url = _phase4_2_main_next_step_url(step) if passed else _phase4_2_retry_url(step, level_key)

        logger.info(
            f"Phase 4.2 Step {step} remedial {level_key} - User {user['user_id']}: "
            f"Total={total_score}/{config['max_score']}, Threshold={config['threshold']}, Passed={passed}, Next={next_url}"
        )

        return {
            'success': True,
            'data': {
                'total': total_score,
                'max_score': config['max_score'],
                'threshold': config['threshold'],
                'passed': passed,
                'next_url': next_url,
            }
        }
    except Exception as e:
        logger.error(f"Error calculating Phase 4.2 Step {step} remedial {level} final score: {e}")
        return JSONResponse(status_code=500, content={'success': False, 'error': str(e)})


@router.post("/4_2/step2/evaluate-caption")
async def evaluate_phase4_2_step2_caption(request: Request, user: dict = Depends(get_current_user)):
    """Evaluate Phase 4.2 Step 2 Interaction 1 caption writing."""
    try:
        data = await request.json()
        caption = data.get('caption', '').strip()

        if not caption:
            return JSONResponse(status_code=400, content={'success': False, 'error': 'Caption cannot be empty'})

        try:
            system_prompt = """You are evaluating a student's Instagram caption for the Global Cultures Festival.

The caption should mention the event, include at least some social-media style elements, and grow in sophistication by CEFR band.

Score using:
- A1 (1): Minimal attempt
- A2 (2): Simple caption with basic event info
- B1 (3): Clear caption with event details plus a hashtag or CTA
- B2 (4): Engaging caption with multiple details, hashtags, and a stronger CTA
- C1 (5): Sophisticated promotional caption with strategic, vivid language

Return ONLY JSON:
{
  "score": <1-5>,
  "level": "<A1|A2|B1|B2|C1>",
  "feedback": "<constructive feedback>"
}"""

            ai_response = ai_service.client.chat.completions.create(
                model="llama-3.1-70b-versatile",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": caption}
                ],
                max_tokens=250,
                temperature=0.3
            )
            result_text = ai_response.choices[0].message.content.strip()
            if '```json' in result_text:
                result_text = result_text.split('```json')[1].split('```')[0]
            elif '```' in result_text:
                result_text = result_text.split('```')[1].split('```')[0]
            result = json.loads(result_text.strip())

            return {
                'success': True,
                'score': result.get('score', 1),
                'level': result.get('level', 'A1'),
                'feedback': result.get('feedback', 'Good work!'),
                'details': {}
            }
        except Exception as ai_error:
            logger.warning(f"Phase 4.2 Step 2 caption AI fallback: {ai_error}")
            caption_lower = caption.lower()
            word_count = len(caption.split())
            sentence_count = len([sentence for sentence in re.split(r'[.!?]+', caption) if sentence.strip()])
            has_hashtag = '#' in caption
            has_cta = any(term in caption_lower for term in ['join', 'tag', 'come', 'save the date', 'don\'t miss'])
            has_event_detail = any(term in caption_lower for term in ['festival', 'march', 'music', 'food', 'dance', 'culture'])
            has_advanced_vocab = any(term in caption_lower for term in ['immersive', 'authentic', 'celebrate', 'experience', 'vibrant'])

            if word_count >= 35 and sentence_count >= 4 and has_hashtag and has_cta and has_event_detail and has_advanced_vocab:
                score, level = 5, 'C1'
            elif word_count >= 25 and sentence_count >= 3 and has_hashtag and has_cta and has_event_detail:
                score, level = 4, 'B2'
            elif word_count >= 15 and sentence_count >= 2 and has_event_detail and (has_hashtag or has_cta):
                score, level = 3, 'B1'
            elif word_count >= 8 and has_event_detail:
                score, level = 2, 'A2'
            else:
                score, level = 1, 'A1'

            return {
                'success': True,
                'score': score,
                'level': level,
                'feedback': 'Good effort! Add clearer event details, a hashtag, and a stronger call-to-action to improve your caption.',
                'details': {}
            }
    except Exception as e:
        logger.error(f"Error evaluating Phase 4.2 Step 2 caption: {e}")
        return JSONResponse(status_code=500, content={'success': False, 'error': str(e)})


@router.post("/4_2/step2/evaluate-explanation")
async def evaluate_phase4_2_step2_explanation(request: Request, user: dict = Depends(get_current_user)):
    """Evaluate Phase 4.2 Step 2 Interaction 2 - Explain Engagement Element"""
    try:
        user_id = user['user_id']
        data = await request.json()
        interaction = data.get('interaction', 2)
        explanation = data.get('explanation', '').strip()
        caption = data.get('caption', '').strip()

        if not explanation:
            return JSONResponse(status_code=400, content={'success': False, 'error': 'Explanation cannot be empty'})

        try:
            system_prompt = """You are evaluating a student's explanation of what makes their Instagram post engaging.

The student should explain ONE element (hashtag, emoji, or call-to-action) and provide reasoning for why it works, using social media vocabulary.

Expected responses by level:
- A2 (2 points): "Hashtag because people see." - Basic mention with simple reasoning
- B1 (3 points): "I used #Festival because it makes post viral." - Clear explanation with reasoning
- B2 (4 points): "The call-to-action 'Tag a friend!' increases engagement and reach." - Strategic explanation with vocabulary
- C1 (5 points): "Strategic hashtags combined with a direct CTA create a viral loop, amplifying organic reach through network effects." - Sophisticated analysis

Return a JSON object with:
{
    "score": <1-5>,
    "level": "<A1|A2|B1|B2|C1>",
    "feedback": "<constructive feedback>",
    "details": {
        "element_mentioned": "<yes|no>",
        "has_reasoning": "<yes|no>",
        "social_vocab_count": <count>
    }
}"""

            user_prompt = f"Original caption:\n{caption}\n\nStudent explanation:\n{explanation}"

            ai_response = ai_service.client.chat.completions.create(
                model="llama-3.1-70b-versatile",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                max_tokens=300,
                temperature=0.3
            )

            result_text = ai_response.choices[0].message.content.strip()
            if '```json' in result_text:
                result_text = result_text.split('```json')[1].split('```')[0]
            elif '```' in result_text:
                result_text = result_text.split('```')[1].split('```')[0]
            result = json.loads(result_text.strip())

            score = result.get('score', 1)
            level = result.get('level', 'A1')
            logger.info(f"Phase 4.2 Step 2 Int 2 - User {user_id}: Level={level}, Score={score}/5")
            return {'success': True, 'score': score, 'level': level, 'feedback': result.get('feedback', 'Good work!'), 'details': result.get('details', {})}

        except Exception as ai_error:
            logger.error(f"AI evaluation error: {ai_error}")
            word_count = len(explanation.split())
            has_element = any(term in explanation.lower() for term in ['hashtag', 'emoji', 'call-to-action', 'cta', 'tag'])
            has_reasoning = any(term in explanation.lower() for term in ['because', 'since', 'so', 'helps', 'makes'])

            if word_count >= 15 and has_element and has_reasoning:
                score, level = 4, 'B2'
            elif word_count >= 10 and has_element and has_reasoning:
                score, level = 3, 'B1'
            elif word_count >= 5 and has_element:
                score, level = 2, 'A2'
            else:
                score, level = 1, 'A1'

            return {'success': True, 'score': score, 'level': level, 'feedback': 'Good effort! Try to use more social media vocabulary and explain your reasoning clearly.', 'details': {}}

    except Exception as e:
        logger.error(f"Error evaluating Phase 4.2 Step 2 explanation: {e}")
        return JSONResponse(status_code=500, content={'success': False, 'error': str(e)})


@router.post("/4_2/step2/evaluate-revision")
async def evaluate_phase4_2_step2_revision(request: Request, user: dict = Depends(get_current_user)):
    """Evaluate Phase 4.2 Step 2 Interaction 3 - Revise & Improve"""
    try:
        user_id = user['user_id']
        data = await request.json()
        interaction = data.get('interaction', 3)
        revision = data.get('revision', '').strip()
        original_caption = data.get('original_caption', '').strip()

        if not revision:
            return JSONResponse(status_code=400, content={'success': False, 'error': 'Revision cannot be empty'})

        try:
            system_prompt = """You are evaluating a student's revision of their Instagram caption.

The student should show how to improve ONE sentence from their original caption using new social media vocabulary.

Expected responses by level:
- A2 (2 points): "Add emoji 😊" - Basic improvement attempt
- B1 (3 points): "Add call-to-action: 'Join us!'" - Clear improvement with new element
- B2 (4 points): "Replace 'fun' with 'immersive experience' for stronger appeal." - Strategic revision with sophisticated vocabulary
- C1 (5 points): "Integrate 'network effects' into CTA: 'Tag friends to expand our global community!'" - Advanced revision with marketing concepts

Return a JSON object with:
{
    "score": <1-5>,
    "level": "<A1|A2|B1|B2|C1>",
    "feedback": "<constructive feedback>",
    "details": {
        "shows_improvement": "<yes|no>",
        "uses_new_term": "<yes|no>",
        "sophistication": "<basic|good|excellent>"
    }
}"""

            user_prompt = f"Original caption:\n{original_caption}\n\nStudent revision:\n{revision}"

            ai_response = ai_service.client.chat.completions.create(
                model="llama-3.1-70b-versatile",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                max_tokens=300,
                temperature=0.3
            )

            result_text = ai_response.choices[0].message.content.strip()
            if '```json' in result_text:
                result_text = result_text.split('```json')[1].split('```')[0]
            elif '```' in result_text:
                result_text = result_text.split('```')[1].split('```')[0]
            result = json.loads(result_text.strip())

            score = result.get('score', 1)
            level = result.get('level', 'A1')
            logger.info(f"Phase 4.2 Step 2 Int 3 - User {user_id}: Level={level}, Score={score}/5")
            return {'success': True, 'score': score, 'level': level, 'feedback': result.get('feedback', 'Good work!'), 'details': result.get('details', {})}

        except Exception as ai_error:
            logger.error(f"AI evaluation error: {ai_error}")
            word_count = len(revision.split())
            has_social_term = any(term in revision.lower() for term in ['hashtag', 'emoji', 'tag', 'call-to-action', 'engagement', 'viral', 'immersive', 'experience'])
            shows_improvement = any(term in revision.lower() for term in ['add', 'replace', 'improve', 'change', 'integrate'])

            if word_count >= 12 and has_social_term and shows_improvement:
                score, level = 4, 'B2'
            elif word_count >= 8 and has_social_term and shows_improvement:
                score, level = 3, 'B1'
            elif word_count >= 5 and (has_social_term or shows_improvement):
                score, level = 2, 'A2'
            else:
                score, level = 1, 'A1'

            return {'success': True, 'score': score, 'level': level, 'feedback': 'Good effort! Try to be more specific about how you would improve the caption.', 'details': {}}

    except Exception as e:
        logger.error(f"Error evaluating Phase 4.2 Step 2 revision: {e}")
        return JSONResponse(status_code=500, content={'success': False, 'error': str(e)})


# ==================== PHASE 4.2 STEP 3 ROUTES ====================

@router.post("/4_2/step3/evaluate-caption-definition")
async def evaluate_phase4_2_step3_caption_definition(request: Request, user: dict = Depends(get_current_user)):
    """Evaluate caption definition in Phase 4.2 Step 3 Interaction 1"""
    try:
        data = await request.json()
        definition = data.get('definition', '').strip()

        if not definition:
            return JSONResponse(status_code=400, content={'success': False, 'error': 'Definition is required'})

        logger.info(f"Phase 4.2 Step 3 - Caption definition: {definition[:100]}")

        ai_prompt = f"""Evaluate this student's definition of "caption" in social media posts.

Student's definition: "{definition}"

Scoring criteria (CEFR-aligned):
- A2 (1 point): Basic definition like "words under photo"
- B1 (2 points): Simple explanation with examples, mentions text under photo/video to explain or attract
- B2 (3-4 points): Describes caption as descriptive/persuasive text providing context, engaging viewers, including CTAs
- C1 (5 points): Analyzes caption as narrative hook contextualizing visuals, driving engagement through storytelling

Return ONLY a JSON object:
{{
  "score": <1-5>,
  "level": "<A2/B1/B2/C1>",
  "feedback": "<specific feedback on their definition>"
}}"""

        try:
            ai_response = ai_service.evaluate_response(ai_prompt, max_tokens=300)
            result = json.loads(ai_response)
            return {'success': True, 'score': result.get('score', 1), 'level': result.get('level', 'A2'), 'feedback': result.get('feedback', 'Good effort!'), 'details': {}}
        except Exception as ai_error:
            logger.warning(f"AI evaluation failed, using fallback: {ai_error}")
            definition_lower = definition.lower()
            word_count = len(definition.split())

            has_basic_def = any(term in definition_lower for term in ['words', 'text', 'under', 'photo', 'post'])
            has_function = any(term in definition_lower for term in ['explain', 'attract', 'attention', 'describe'])
            has_strategic = any(term in definition_lower for term in ['engage', 'engagement', 'cta', 'call-to-action', 'context'])
            has_advanced = any(term in definition_lower for term in ['narrative', 'hook', 'storytelling', 'strategic', 'conversions', 'reach', 'maximize'])

            if word_count >= 25 and has_advanced and has_strategic:
                score, level, feedback = 5, 'C1', 'Excellent! Sophisticated understanding of captions as strategic narrative tools.'
            elif word_count >= 15 and has_strategic and has_function:
                score = 4 if word_count >= 20 else 3
                level, feedback = 'B2', 'Great work! You understand captions as persuasive text that provides context and engages viewers.'
            elif word_count >= 10 and has_function and has_basic_def:
                score, level, feedback = 2, 'B1', 'Good! You correctly explain that a caption is text under photos/videos to explain or attract attention.'
            elif has_basic_def:
                score, level, feedback = 1, 'A2', 'Correct basic definition! Try to add more detail about what captions do.'
            else:
                score, level, feedback = 1, 'A2', 'Good effort! A caption is the text written under a photo or video.'

            return {'success': True, 'score': score, 'level': level, 'feedback': feedback, 'details': {}}

    except Exception as e:
        logger.error(f"Error evaluating Phase 4.2 Step 3 caption definition: {e}")
        return JSONResponse(status_code=500, content={'success': False, 'error': str(e)})


@router.post("/4_2/step3/evaluate-cta-explanation")
async def evaluate_phase4_2_step3_cta_explanation(request: Request, user: dict = Depends(get_current_user)):
    """Evaluate CTA explanation in Phase 4.2 Step 3 Interaction 2"""
    try:
        data = await request.json()
        explanation = data.get('explanation', '').strip()

        if not explanation:
            return JSONResponse(status_code=400, content={'success': False, 'error': 'Explanation is required'})

        logger.info(f"Phase 4.2 Step 3 - CTA explanation: {explanation[:100]}")

        ai_prompt = f"""Evaluate this student's explanation of "call-to-action" (CTA) in social media posts.

Student's explanation: "{explanation}"

Scoring criteria (CEFR-aligned):
- A2 (1 point): Very basic like "CTA is do something. Like 'come'"
- B1 (2 points): Explains CTA as post saying "do this" with example
- B2 (3-4 points): Defines CTA as direct instruction prompting specific action, mentions engagement/conversions
- C1 (5 points): Analyzes CTA as strategic conversion trigger directing behavior to amplify reach

Return ONLY a JSON object:
{{
  "score": <1-5>,
  "level": "<A2/B1/B2/C1>",
  "feedback": "<specific feedback>"
}}"""

        try:
            ai_response = ai_service.evaluate_response(ai_prompt, max_tokens=300)
            result = json.loads(ai_response)
            return {'success': True, 'score': result.get('score', 1), 'level': result.get('level', 'A2'), 'feedback': result.get('feedback', 'Good effort!'), 'details': {}}
        except Exception as ai_error:
            logger.warning(f"AI evaluation failed, using fallback: {ai_error}")
            explanation_lower = explanation.lower()
            word_count = len(explanation.split())

            has_basic = any(term in explanation_lower for term in ['do', 'action', 'tell', 'come', 'join'])
            has_instruction = any(term in explanation_lower for term in ['instruction', 'prompt', 'direct', 'ask', 'request'])
            has_purpose = any(term in explanation_lower for term in ['engage', 'engagement', 'conversion', 'boost', 'interact'])
            has_example = any(term in explanation_lower for term in ['tag', 'friend', 'join us', 'click', 'visit', 'share'])
            has_strategic = any(term in explanation_lower for term in ['strategic', 'trigger', 'amplify', 'reach', 'network', 'behavior', 'measurable'])

            if word_count >= 25 and has_strategic and has_purpose and has_example:
                score, level, feedback = 5, 'C1', 'Outstanding! Sophisticated understanding of CTAs as strategic conversion triggers.'
            elif word_count >= 15 and has_instruction and has_purpose and has_example:
                score = 4 if word_count >= 20 else 3
                level, feedback = 'B2', 'Excellent! You clearly explain CTAs as direct instructions that prompt specific actions.'
            elif word_count >= 8 and has_basic and has_example:
                score, level, feedback = 2, 'B1', 'Good! You understand that CTAs tell people to do something and you provided an example.'
            elif has_basic:
                score, level, feedback = 1, 'A2', 'Correct basic idea! Try to explain why CTAs are used and give an example.'
            else:
                score, level, feedback = 1, 'A2', 'Good try! A call-to-action tells people to do something, like "Join us!" or "Tag a friend!"'

            return {'success': True, 'score': score, 'level': level, 'feedback': feedback, 'details': {}}

    except Exception as e:
        logger.error(f"Error evaluating Phase 4.2 Step 3 CTA explanation: {e}")
        return JSONResponse(status_code=500, content={'success': False, 'error': str(e)})


@router.post("/4_2/step3/evaluate-term-explanation")
async def evaluate_phase4_2_step3_term_explanation(request: Request, user: dict = Depends(get_current_user)):
    """Evaluate social media term explanation in Phase 4.2 Step 3 Interaction 3"""
    try:
        data = await request.json()
        explanation = data.get('explanation', '').strip()

        if not explanation:
            return JSONResponse(status_code=400, content={'success': False, 'error': 'Explanation is required'})

        logger.info(f"Phase 4.2 Step 3 - Term explanation: {explanation[:100]}")

        ai_prompt = f"""Evaluate this student's explanation of a social media term after playing Sushi Spell.

Student's explanation: "{explanation}"

They should explain one term (hashtag, caption, emoji, call-to-action, engagement, viral, thread, reach) and relate it to the videos watched.

Scoring criteria (CEFR-aligned):
- A2 (1 point): Minimal like "Game for hashtag"
- B1 (2 points): Uses game for term with simple reasoning from video
- B2 (3-4 points): Incorporates game for rapid spelling with video example showing strategic use
- C1 (5 points): Leverages game to master term through competitive spelling, relates to strategic metrics/effects

Return ONLY a JSON object:
{{
  "score": <1-5>,
  "level": "<A2/B1/B2/C1>",
  "feedback": "<specific feedback>"
}}"""

        try:
            ai_response = ai_service.evaluate_response(ai_prompt, max_tokens=300)
            result = json.loads(ai_response)
            return {'success': True, 'score': result.get('score', 1), 'level': result.get('level', 'A2'), 'feedback': result.get('feedback', 'Good effort!'), 'details': {}}
        except Exception as ai_error:
            logger.warning(f"AI evaluation failed, using fallback: {ai_error}")
            explanation_lower = explanation.lower()
            word_count = len(explanation.split())

            terms = ['hashtag', 'caption', 'emoji', 'call-to-action', 'cta', 'engagement', 'viral', 'thread', 'reach', 'tag', 'story']
            mentions_term = any(term in explanation_lower for term in terms)
            has_reasoning = any(word in explanation_lower for word in ['because', 'since', 'so', 'makes', 'helps', 'boost'])
            has_video_ref = any(word in explanation_lower for word in ['video', 'example', 'instagram', 'twitter', 'post', 'shown'])
            has_strategic = any(word in explanation_lower for word in ['strategic', 'metrics', 'competitive', 'master', 'leverage', 'interaction', 'conversion'])

            if word_count >= 20 and mentions_term and has_strategic and has_video_ref:
                score, level, feedback = 5, 'C1', 'Exceptional! Sophisticated understanding linking game to strategic vocabulary mastery.'
            elif word_count >= 12 and mentions_term and has_reasoning and has_video_ref:
                score = 4 if word_count >= 16 else 3
                level, feedback = 'B2', 'Excellent! You effectively incorporate the game for rapid spelling and connect it to video examples.'
            elif word_count >= 6 and mentions_term and has_reasoning:
                score, level, feedback = 2, 'B1', 'Good! You explain how the game helps with the term and provide simple reasoning.'
            elif mentions_term:
                score, level, feedback = 1, 'A2', 'Good start! Try to explain WHY the term is important and how it relates to the videos.'
            else:
                score, level, feedback = 1, 'A2', 'Good effort! Please mention a specific social media term and explain why it matters.'

            return {'success': True, 'score': score, 'level': level, 'feedback': feedback, 'details': {}}

    except Exception as e:
        logger.error(f"Error evaluating Phase 4.2 Step 3 term explanation: {e}")
        return JSONResponse(status_code=500, content={'success': False, 'error': str(e)})


# ==================== PHASE 4.2 STEP 4 ROUTES ====================

@router.post("/4_2/step4/evaluate-instagram-post")
async def evaluate_phase4_2_step4_instagram_post(request: Request, user: dict = Depends(get_current_user)):
    """Evaluate Instagram post in Phase 4.2 Step 4 Interaction 1"""
    try:
        data = await request.json()
        caption = data.get('caption', '').strip()
        hashtags = data.get('hashtags', '').strip()

        if not caption or not hashtags:
            return JSONResponse(status_code=400, content={'success': False, 'error': 'Both caption and hashtags are required'})

        logger.info(f"Phase 4.2 Step 4 - Instagram post: Caption length={len(caption)}, Hashtags={hashtags[:50]}")

        ai_prompt = f"""Evaluate this student's Instagram post for the Global Cultures Festival.

Caption: "{caption}"
Hashtags: "{hashtags}"

Scoring criteria (CEFR-aligned):
- A2 (1-2 points): Simple guided post with basic words
- B1 (3 points): Structured post with hashtags/CTAs following examples
- B2 (4 points): Engaging multi-sentence post with strategic elements
- C1 (5 points): Sophisticated autonomous post with storytelling and strategic hashtags

Return ONLY a JSON object:
{{
  "score": <1-5>,
  "level": "<A2/B1/B2/C1>",
  "feedback": "<specific feedback>"
}}"""

        try:
            ai_response = ai_service.evaluate_response(ai_prompt, max_tokens=300)
            result = json.loads(ai_response)
            return {'success': True, 'score': result.get('score', 1), 'level': result.get('level', 'A2'), 'feedback': result.get('feedback', 'Good effort!'), 'details': {}}
        except Exception as ai_error:
            logger.warning(f"AI evaluation failed, using fallback: {ai_error}")
            caption_lower = caption.lower()
            sentence_count = len([s for s in caption.split('.') if s.strip()])
            word_count = len(caption.split())
            hashtag_count = len([h for h in hashtags.split('#') if h.strip()])

            has_date = any(term in caption_lower for term in ['march', 'date', '8', 'march 8'])
            has_location = any(term in caption_lower for term in ['student center', 'campus', 'tunis'])
            has_cta = any(term in caption_lower for term in ['join', 'tag', 'come', 'rsvp', 'visit', "don't miss"])
            has_details = any(term in caption_lower for term in ['music', 'food', 'dance', 'workshop', 'culture', 'performance'])
            has_advanced_vocab = any(term in caption_lower for term in ['immersive', 'authentic', 'diversity', 'unity', 'celebration', 'vibrant', 'foster', 'microcosm'])

            if word_count >= 80 and sentence_count >= 5 and hashtag_count >= 8 and has_advanced_vocab and has_cta and has_details:
                score, level, feedback = 5, 'C1', 'Exceptional! Sophisticated writing with storytelling, strategic hashtags, and compelling narrative.'
            elif word_count >= 50 and sentence_count >= 4 and hashtag_count >= 5 and has_cta and has_details and (has_date or has_location):
                score, level, feedback = 4, 'B2', 'Great work! Engaging post with multiple strategic elements.'
            elif word_count >= 20 and sentence_count >= 3 and hashtag_count >= 3 and has_cta and (has_date or has_location):
                score, level, feedback = 3, 'B1', 'Good! Structured post following the template with clear details and CTAs.'
            elif word_count >= 10 and hashtag_count >= 2:
                score = 2 if has_cta else 1
                level, feedback = 'A2', 'Correct basic structure! Try to add more details and use 5-10 hashtags.'
            else:
                score, level, feedback = 1, 'A2', 'Good start! Follow the template more closely.'

            return {'success': True, 'score': score, 'level': level, 'feedback': feedback, 'details': {}}

    except Exception as e:
        logger.error(f"Error evaluating Phase 4.2 Step 4 Instagram post: {e}")
        return JSONResponse(status_code=500, content={'success': False, 'error': str(e)})


@router.post("/4_2/step4/evaluate-twitter-thread")
async def evaluate_phase4_2_step4_twitter_thread(request: Request, user: dict = Depends(get_current_user)):
    """Evaluate Twitter/X thread in Phase 4.2 Step 4 Interaction 2"""
    try:
        data = await request.json()
        tweets = data.get('tweets', [])

        if not tweets or len(tweets) < 2:
            return JSONResponse(status_code=400, content={'success': False, 'error': 'At least 2 tweets are required'})

        logger.info(f"Phase 4.2 Step 4 - Twitter thread: {len(tweets)} tweets")

        ai_prompt = f"""Evaluate this student's Twitter/X thread for the Global Cultures Festival.

Tweets:
{chr(10).join([f"Tweet {i+1}: {tweet}" for i, tweet in enumerate(tweets)])}

Scoring criteria (CEFR-aligned):
- A2 (1-2 points): Very simple thread
- B1 (3 points): Structured thread with basic details and hashtags
- B2 (4 points): Engaging thread with multiple tweets, strategic elements, good flow
- C1 (5 points): Sophisticated thread with compelling narrative, strategic numbering, advanced vocabulary

Return ONLY a JSON object:
{{
  "score": <1-5>,
  "level": "<A2/B1/B2/C1>",
  "feedback": "<specific feedback>"
}}"""

        try:
            ai_response = ai_service.evaluate_response(ai_prompt, max_tokens=300)
            result = json.loads(ai_response)
            return {'success': True, 'score': result.get('score', 1), 'level': result.get('level', 'A2'), 'feedback': result.get('feedback', 'Good effort!'), 'details': {}}
        except Exception as ai_error:
            logger.warning(f"AI evaluation failed, using fallback: {ai_error}")
            full_thread = ' '.join(tweets).lower()
            tweet_count = len(tweets)

            has_numbering = any(char in tweets[0] for char in ['1/', '1 /'])
            has_hashtag = '#' in full_thread
            has_cta = any(term in full_thread for term in ['join', 'tag', 'rsvp', 'visit', 'come', "don't miss"])
            has_details = any(term in full_thread for term in ['music', 'food', 'dance', 'workshop', 'performance', 'culture'])
            has_advanced = any(term in full_thread for term in ['immersive', 'catalyst', 'mosaic', 'authentic', 'dialogue', 'unity', 'empathy'])
            over_limit = any(len(tweet) > 280 for tweet in tweets)

            if over_limit:
                score, level, feedback = 1, 'A2', "Some tweets exceed 280 characters. Please shorten them."
            elif tweet_count >= 4 and has_numbering and has_advanced and has_cta and has_hashtag and has_details:
                score, level, feedback = 5, 'C1', 'Outstanding! Sophisticated thread with compelling narrative flow.'
            elif tweet_count >= 3 and has_numbering and has_cta and has_hashtag and has_details:
                score, level, feedback = 4, 'B2', 'Excellent! Engaging thread with good structure and strategic elements.'
            elif tweet_count >= 2 and has_cta and has_hashtag:
                score, level, feedback = 3, 'B1', 'Good! Structured thread with hashtags and call-to-action.'
            elif tweet_count >= 2:
                score = 2 if has_hashtag else 1
                level, feedback = 'A2', 'Basic thread structure! Add more details, numbering, and hashtags.'
            else:
                score, level, feedback = 1, 'A2', 'Write at least 2-3 tweets with thread numbering and hashtags.'

            return {'success': True, 'score': score, 'level': level, 'feedback': feedback, 'details': {}}

    except Exception as e:
        logger.error(f"Error evaluating Phase 4.2 Step 4 Twitter thread: {e}")
        return JSONResponse(status_code=500, content={'success': False, 'error': str(e)})


@router.post("/4_2/step4/evaluate-vocabulary-revision")
async def evaluate_phase4_2_step4_vocabulary_revision(request: Request, user: dict = Depends(get_current_user)):
    """Evaluate vocabulary revision in Phase 4.2 Step 4 Interaction 3"""
    try:
        data = await request.json()
        spelled_term = data.get('spelled_term', '').strip()
        revised_sentence = data.get('revised_sentence', '').strip()

        if not spelled_term or not revised_sentence:
            return JSONResponse(status_code=400, content={'success': False, 'error': 'Both spelled term and revised sentence are required'})

        logger.info(f"Phase 4.2 Step 4 - Vocabulary revision: Term={spelled_term}")

        ai_prompt = f"""Evaluate this student's vocabulary integration and sentence revision after playing Sushi Spell.

Spelled Term: "{spelled_term}"
Revised Sentence: "{revised_sentence}"

Scoring criteria (CEFR-aligned):
- A2 (1-2 points): Basic term use
- B1 (3 points): Uses term with simple revision showing error detection
- B2 (4 points): Incorporates term with structure improvement and clear error correction
- C1 (5 points): Leverages term with sophisticated revision, detecting grammar/structure errors autonomously

Return ONLY a JSON object:
{{
  "score": <1-5>,
  "level": "<A2/B1/B2/C1>",
  "feedback": "<specific feedback>"
}}"""

        try:
            ai_response = ai_service.evaluate_response(ai_prompt, max_tokens=300)
            result = json.loads(ai_response)
            return {'success': True, 'score': result.get('score', 1), 'level': result.get('level', 'A2'), 'feedback': result.get('feedback', 'Good effort!'), 'details': {}}
        except Exception as ai_error:
            logger.warning(f"AI evaluation failed, using fallback: {ai_error}")
            sentence_lower = revised_sentence.lower()
            term_lower = spelled_term.lower()
            valid_terms = ['hashtag', 'caption', 'call-to-action', 'cta', 'engagement', 'viral']
            term_is_valid = any(term in term_lower for term in valid_terms)
            term_in_sentence = term_lower in sentence_lower
            has_error_mention = any(word in sentence_lower for word in ['error', 'mistake', 'wrong', 'incorrect', 'fragment', 'missing'])
            word_count = len(revised_sentence.split())
            has_complete_sentence = revised_sentence[0].isupper() if revised_sentence else False

            if term_is_valid and term_in_sentence and has_error_mention and word_count >= 15 and has_complete_sentence:
                score, level, feedback = 5, 'C1', 'Excellent! Sophisticated autonomous error detection and revision.'
            elif term_is_valid and term_in_sentence and word_count >= 10:
                score, level, feedback = 4, 'B2', 'Great work! Good vocabulary integration with clear error correction.'
            elif term_is_valid and term_in_sentence and word_count >= 6:
                score, level, feedback = 3, 'B1', 'Good! You used the spelled term in a revised sentence.'
            elif term_is_valid and term_in_sentence:
                score, level, feedback = 2, 'A2', 'Correct basic use! Try to write a complete sentence showing revision.'
            elif term_is_valid:
                score, level, feedback = 1, 'A2', 'Good term choice! Make sure to use it in your revised sentence.'
            else:
                score, level, feedback = 1, 'A2', 'Please use one of the social media terms in your revision.'

            return {'success': True, 'score': score, 'level': level, 'feedback': feedback, 'details': {}}

    except Exception as e:
        logger.error(f"Error evaluating Phase 4.2 Step 4 vocabulary revision: {e}")
        return JSONResponse(status_code=500, content={'success': False, 'error': str(e)})


# ==================== PHASE 4.2 STEP 5 ROUTES ====================

@router.post("/4_2/step5/evaluate-spelling")
async def evaluate_phase4_2_step5_spelling(request: Request, user: dict = Depends(get_current_user)):
    """Evaluate spelling correction in Phase 4.2 Step 5 Interaction 1"""
    try:
        data = await request.json()
        original_post = data.get('original_post', '').strip()
        corrected_post = data.get('corrected_post', '').strip()
        level = data.get('level', 'B1')

        if not corrected_post:
            return JSONResponse(status_code=400, content={'success': False, 'error': 'Corrected post is required'})

        logger.info(f"Phase 4.2 Step 5 - Spelling correction ({level}): {corrected_post[:100]}")

        ai_prompt = f"""Evaluate this student's spelling corrections for a social media post at {level} CEFR level.

Original faulty post: "{original_post}"
Student's corrected post: "{corrected_post}"

Scoring: 5=all errors fixed, 4=most fixed, 3=several fixed, 2=few fixed, 1=minimal fixes.

Return ONLY a JSON object:
{{
  "score": <1-5>,
  "feedback": "<specific feedback on spelling corrections>"
}}"""

        try:
            ai_response = ai_service.evaluate_response(ai_prompt, max_tokens=300)
            result = json.loads(ai_response)
            return {'success': True, 'score': result.get('score', 3), 'feedback': result.get('feedback', 'Good spelling corrections!'), 'details': {}}
        except Exception as ai_error:
            logger.warning(f"AI evaluation failed, using fallback: {ai_error}")
            corrected_lower = corrected_post.lower()
            corrections = 0
            if 'global' in corrected_lower: corrections += 1
            if 'festival' in corrected_lower: corrections += 1
            if 'friend' in corrected_lower or 'friends' in corrected_lower: corrections += 1
            if 'fellow' in corrected_lower: corrections += 1
            if 'events' in corrected_lower or 'event' in corrected_lower: corrections += 1

            score = min(5, max(1, corrections))
            if score >= 4: feedback = 'Excellent spelling corrections! You caught all the major errors.'
            elif score == 3: feedback = 'Good work! You corrected several spelling errors. Double-check for remaining misspellings.'
            elif score == 2: feedback = 'You made some corrections. Look for more misspelled words.'
            else: feedback = 'Check all words carefully for spelling errors.'

            return {'success': True, 'score': score, 'feedback': feedback, 'details': {}}

    except Exception as e:
        logger.error(f"Error evaluating Phase 4.2 Step 5 spelling: {e}")
        return JSONResponse(status_code=500, content={'success': False, 'error': str(e)})


@router.post("/4_2/step5/evaluate-grammar")
async def evaluate_phase4_2_step5_grammar(request: Request, user: dict = Depends(get_current_user)):
    """Evaluate grammar correction in Phase 4.2 Step 5 Interaction 2"""
    try:
        data = await request.json()
        spelling_corrected = data.get('spelling_corrected', '').strip()
        grammar_corrected = data.get('grammar_corrected', '').strip()
        level = data.get('level', 'B1')

        if not grammar_corrected:
            return JSONResponse(status_code=400, content={'success': False, 'error': 'Grammar-corrected post is required'})

        logger.info(f"Phase 4.2 Step 5 - Grammar correction ({level}): {grammar_corrected[:100]}")

        ai_prompt = f"""Evaluate this student's grammar corrections for a social media post at {level} CEFR level.

Spelling-corrected post: "{spelling_corrected}"
Student's grammar-corrected post: "{grammar_corrected}"

Scoring: 5=all errors fixed, 4=most fixed, 3=several fixed, 2=few fixed, 1=minimal fixes.

Return ONLY a JSON object:
{{
  "score": <1-5>,
  "feedback": "<specific feedback on grammar corrections>"
}}"""

        try:
            ai_response = ai_service.evaluate_response(ai_prompt, max_tokens=300)
            result = json.loads(ai_response)
            return {'success': True, 'score': result.get('score', 3), 'feedback': result.get('feedback', 'Good grammar corrections!'), 'details': {}}
        except Exception as ai_error:
            logger.warning(f"AI evaluation failed, using fallback: {ai_error}")
            corrections = 0
            if ' the ' in grammar_corrected.lower() or grammar_corrected.lower().startswith('the '): corrections += 1
            if ' a ' in grammar_corrected.lower(): corrections += 1
            if ' on ' in grammar_corrected.lower() or ' at ' in grammar_corrected.lower() or ' in ' in grammar_corrected.lower(): corrections += 1
            if ' is ' in grammar_corrected.lower(): corrections += 1
            spelling_words = len(spelling_corrected.split())
            grammar_words = len(grammar_corrected.split())
            if grammar_words > spelling_words: corrections += 1

            score = min(5, max(1, corrections))
            if score >= 4: feedback = 'Excellent grammar corrections! You added proper articles, prepositions, and fixed verb agreement.'
            elif score == 3: feedback = 'Good work! You made several grammar improvements.'
            elif score == 2: feedback = 'You made some corrections. Remember to add articles and prepositions.'
            else: feedback = 'Focus on adding missing words: articles like "the" and "a", and prepositions like "on".'

            return {'success': True, 'score': score, 'feedback': feedback, 'details': {}}

    except Exception as e:
        logger.error(f"Error evaluating Phase 4.2 Step 5 grammar: {e}")
        return JSONResponse(status_code=500, content={'success': False, 'error': str(e)})


@router.post("/4_2/step5/evaluate-enhancement")
async def evaluate_phase4_2_step5_enhancement(request: Request, user: dict = Depends(get_current_user)):
    """Evaluate enhancement (coherence, tone, vocabulary) in Phase 4.2 Step 5 Interaction 3"""
    try:
        data = await request.json()
        grammar_corrected = data.get('grammar_corrected', '').strip()
        enhanced_post = data.get('enhanced_post', '').strip()
        level = data.get('level', 'B1')

        if not enhanced_post:
            return JSONResponse(status_code=400, content={'success': False, 'error': 'Enhanced post is required'})

        logger.info(f"Phase 4.2 Step 5 - Enhancement ({level}): {enhanced_post[:100]}")

        ai_prompt = f"""Evaluate this student's enhancement of a social media post at {level} CEFR level.

Grammar-corrected post: "{grammar_corrected}"
Student's enhanced post: "{enhanced_post}"

Scoring: 5=excellent enhancements (emojis, connectors, rich vocabulary, CTA, hashtags), 4=good, 3=moderate, 2=minor, 1=minimal.

Return ONLY a JSON object:
{{
  "score": <1-5>,
  "feedback": "<specific feedback on enhancements>"
}}"""

        try:
            ai_response = ai_service.evaluate_response(ai_prompt, max_tokens=300)
            result = json.loads(ai_response)
            return {'success': True, 'score': result.get('score', 3), 'feedback': result.get('feedback', 'Good enhancements!'), 'details': {}}
        except Exception as ai_error:
            logger.warning(f"AI evaluation failed, using fallback: {ai_error}")
            import re as re_module
            enhancements = 0
            emoji_pattern = re_module.compile("[\U00010000-\U0010ffff]", flags=re_module.UNICODE)
            if emoji_pattern.search(enhanced_post): enhancements += 1
            if '!' in enhanced_post: enhancements += 1
            connectors = ['and', 'because', 'so', 'with', 'join us', 'come']
            if any(connector in enhanced_post.lower() for connector in connectors): enhancements += 1
            if enhanced_post.count('#') >= 3: enhancements += 1
            enhanced_words = ['immersive', 'authentic', 'catalyst', 'global', 'cultural', 'diversity', 'experience', 'celebration']
            if any(word in enhanced_post.lower() for word in enhanced_words): enhancements += 1

            score = min(5, max(1, enhancements))
            if score >= 4: feedback = 'Excellent enhancements! You added emojis, connectors, rich vocabulary, and strategic hashtags.'
            elif score == 3: feedback = 'Good work! Consider adding more emojis, connectors, or a stronger call-to-action.'
            elif score == 2: feedback = 'You made some improvements. Try adding emojis, connectors, and more hashtags.'
            else: feedback = 'Add more engagement elements: emojis, exclamation marks, connectors, and hashtags.'

            return {'success': True, 'score': score, 'feedback': feedback, 'details': {}}

    except Exception as e:
        logger.error(f"Error evaluating Phase 4.2 Step 5 enhancement: {e}")
        return JSONResponse(status_code=500, content={'success': False, 'error': str(e)})
