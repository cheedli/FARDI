"""
Phase 6: Reflection & Evaluation API Routes - FastAPI migration
Sub-phase 6.1: Writing a Post-Event Report
Sub-phase 6.2: Peer Feedback Discussion

Migrated from routes/phase6_routes.py (Flask Blueprint).
63 endpoints preserving exact URL paths and response shapes.
"""

from fastapi import APIRouter, Depends, Request, HTTPException
from auth_utils import get_current_user
from services.ai_service import AIService
import json
import logging
import sqlite3
import re
import math

router = APIRouter(prefix="/api/phase6", tags=["phase6"])

logger = logging.getLogger(__name__)
ai_service = AIService()

# Phase 6 vocabulary
VOCAB_61 = ['success', 'challenge', 'feedback', 'improve', 'achievement',
            'strength', 'weakness', 'recommend', 'summary', 'positive',
            'negative', 'evidence', 'impact', 'lesson', 'report']

VOCAB_62 = ['feedback', 'constructive', 'positive', 'suggestion', 'strength',
            'weakness', 'improve', 'specific', 'actionable', 'polite',
            'balanced', 'empathy', 'helpful', 'sandwich', 'mindset']


def get_db_connection():
    """Get database connection"""
    conn = sqlite3.connect('fardi.db')
    conn.row_factory = sqlite3.Row
    return conn


# ============================================================
# SHARED HELPERS
# ============================================================

def _generic_fallback(response, vocabulary, min_level='A2'):
    """Generic fallback keyword-based CEFR evaluation"""
    response_lower = response.lower()
    word_count = len(response.split())
    terms_found = [t for t in vocabulary if t in response_lower]
    has_connector = any(w in response_lower for w in
                        ['because', 'since', 'however', 'therefore', 'so', 'thus', 'although'])
    has_advanced = any(w in response_lower for w in
                       ['demonstrate', 'facilitate', 'implement', 'achieve', 'strategic',
                        'evidence', 'credibility', 'accountability', 'transparency'])

    if word_count <= 8 and len(terms_found) == 0:
        score, level = 1, 'A1'
    elif word_count <= 15 and len(terms_found) >= 1 and not has_connector:
        score, level = 2, 'A2'
    elif word_count <= 30 and len(terms_found) >= 1 and has_connector:
        score, level = 3, 'B1'
    elif word_count <= 60 and len(terms_found) >= 2 and has_connector:
        score, level = 4, 'B2'
    else:
        score, level = 5, 'C1'

    return {
        'score': score,
        'level': level,
        'feedback': f'Your response shows {level} level understanding. '
                    f'{"Good vocabulary use!" if terms_found else "Try using more target vocabulary."}',
        'vocabulary_used': terms_found,
        'strengths': ['Relevant content'] if word_count > 5 else [],
        'improvements': ['Use more vocabulary terms', 'Add connectors like because/however']
                        if len(terms_found) < 2 else []
    }


def _build_game_track_response(user_id, step, interaction, subphase, data, min_time=120):
    """Build standard game track response"""
    time_played = data.get('time_played', 0)
    completed = data.get('completed', False)
    engagement_score = data.get('engagement_score', 0)
    score = 1 if (completed and time_played >= min_time) else 0
    logger.info(f"Phase 6 SP{subphase} Step {step} I{interaction} - User {user_id}: "
                f"Time={time_played}s, Score={score}")
    return {'success': True, 'data': {
        'time_played': time_played,
        'completed': completed,
        'engagement_score': engagement_score,
        'score': score,
        'message': 'Game completion tracked successfully'
    }}


def _build_score_response(user_id, step, subphase, interaction1_score, interaction2_score, interaction3_score):
    """Build standard calculate-score response"""
    total_score = interaction1_score + interaction2_score + interaction3_score
    level_map = {1: 'A1', 2: 'A2', 3: 'B1', 4: 'B2', 5: 'C1'}
    remedial_level = level_map.get(interaction2_score, 'A2')
    should_proceed = interaction2_score >= 3

    print(f"\n{'='*60}")
    print(f"PHASE 6 SP{subphase} STEP {step} - SCORING")
    print(f"User: {user_id}  I1={interaction1_score} I2={interaction2_score} I3={interaction3_score}")
    print(f"Total={total_score}/7  Level={remedial_level}  Proceed={should_proceed}")
    print(f"{'='*60}\n")

    return {'success': True, 'data': {
        'interaction1': {'score': interaction1_score, 'max_score': 1, 'type': 'completion'},
        'interaction2': {'score': interaction2_score, 'max_score': 5, 'level': remedial_level},
        'interaction3': {'score': interaction3_score, 'max_score': 1, 'type': 'completion'},
        'total': {
            'score': total_score,
            'max_score': 7,
            'remedial_level': remedial_level,
            'should_proceed': should_proceed
        }
    }}


def _build_remedial_log_response(data):
    """Build standard remedial log response"""
    return {'success': True, 'data': {
        'level': data.get('level'),
        'task': data.get('task'),
        'score': data.get('score', 0),
        'max_score': data.get('max_score', 8),
        'logged': True
    }}


def _build_final_score_response(level, task_scores):
    """Build standard remedial final score response"""
    total = sum(task_scores.values())
    level_max = {'A2': 24, 'B1': 24, 'B2': 32, 'C1': 32}
    max_score = level_max.get(level.upper(), 24)
    pass_threshold = math.ceil(max_score * 0.8)
    passed = total >= pass_threshold

    return {'success': True, 'data': {
        'level': level,
        'total_score': total,
        'max_score': max_score,
        'pass_threshold': pass_threshold,
        'passed': passed,
        'task_scores': task_scores
    }}


def _ai_evaluate(prompt, fallback_fn, response_text):
    """Run AI evaluation with fallback"""
    try:
        ai_resp = ai_service.get_ai_response(prompt)
        match = re.search(r'\{.*\}', ai_resp, re.DOTALL)
        if match:
            return json.loads(match.group())
        return fallback_fn(response_text)
    except Exception as e:
        logger.warning(f"AI evaluation failed, using fallback: {e}")
        return fallback_fn(response_text)


# ============================================================
# SUBPHASE 6.1 - STEP 1: ENGAGE
# ============================================================

@router.post('/step1/interaction1/track')
async def track_61_step1_interaction1(request: Request, user: dict = Depends(get_current_user)):
    """Track Wordshake game - Step 1 Interaction 1 (3 min target)"""
    try:
        user_id = user["user_id"]
        data = await request.json()
        return _build_game_track_response(user_id, 1, 1, 1, data, min_time=120)
    except Exception as e:
        return {'success': False, 'error': str(e)}


@router.post('/step1/interaction2/evaluate')
async def evaluate_61_step1_interaction2(request: Request, user: dict = Depends(get_current_user)):
    """
    Evaluate festival reflection - Step 1 Interaction 2
    SKANDER: Share 3-5 sentences about one success and one challenge
    Scoring: A2=2, B1=3, B2=4, C1=5
    """
    try:
        user_id = user["user_id"]
        data = await request.json()
        response = data.get('response', '').strip()
        if not response:
            raise HTTPException(status_code=400, detail='Response is required')

        prompt = f"""
Evaluate this student's festival reflection for CEFR level.

Student Response: "{response}"

Context: Student reflects on the Global Cultures Festival: a success and a challenge (past tense).
Target vocabulary: success, challenge, feedback, improve, achievement, strength, weakness

Scoring:
- A2 (2 pts): Very simple past tense sentences, 1+ vocabulary term
- B1 (3 pts): 3-5 sentences with past tense, basic connectors, 1-2 vocabulary terms
- B2 (4 pts): Detailed reflection with reasons ("because/however"), 2+ vocabulary terms
- C1 (5 pts): Sophisticated reflection with advanced analysis, 3+ vocabulary terms

Return JSON: {{"score": 2-5, "level": "A2"|"B1"|"B2"|"C1", "feedback": "...",
"vocabulary_used": [...], "strengths": [...], "improvements": [...]}}
"""
        def fallback(r):
            return _generic_fallback(r, VOCAB_61)

        evaluation = _ai_evaluate(prompt, fallback, response)
        score = max(2, min(5, evaluation.get('score', 2)))
        level = evaluation.get('level', 'A2')
        logger.info(f"Phase 6.1 Step 1 I2 - User {user_id}: Score={score}, Level={level}")

        return {'success': True, 'data': {
            'score': score, 'level': level,
            'feedback': evaluation.get('feedback', ''),
            'vocabulary_used': evaluation.get('vocabulary_used', []),
            'strengths': evaluation.get('strengths', []),
            'improvements': evaluation.get('improvements', [])
        }}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error evaluating 6.1 Step 1 I2: {e}")
        return {'success': False, 'error': str(e)}


@router.post('/step1/interaction3/track')
async def track_61_step1_interaction3(request: Request, user: dict = Depends(get_current_user)):
    """Track Sushi Spell game - Step 1 Interaction 3 (2 min target)"""
    try:
        user_id = user["user_id"]
        data = await request.json()
        return _build_game_track_response(user_id, 1, 3, 1, data, min_time=90)
    except Exception as e:
        return {'success': False, 'error': str(e)}


@router.post('/step1/calculate-score')
async def calculate_61_step1_score(request: Request, user: dict = Depends(get_current_user)):
    """Calculate Phase 6.1 Step 1 total score"""
    try:
        user_id = user["user_id"]
        data = await request.json()
        i1 = data.get('interaction1_score', 0)
        i2 = data.get('interaction2_score', 2)
        i3 = data.get('interaction3_score', 0)
        return _build_score_response(user_id, 1, 1, i1, i2, i3)
    except Exception as e:
        return {'success': False, 'error': str(e)}


@router.post('/step1/remedial/log')
async def log_61_step1_remedial(request: Request, user: dict = Depends(get_current_user)):
    """Log remedial task completion - Step 1"""
    try:
        data = await request.json()
        return _build_remedial_log_response(data)
    except Exception as e:
        return {'success': False, 'error': str(e)}


@router.post('/step1/remedial/{level}/final-score')
async def final_score_61_step1(level: str, request: Request, user: dict = Depends(get_current_user)):
    """Calculate remedial final score - Step 1"""
    try:
        data = await request.json()
        task_scores = {k: v for k, v in data.items() if k.startswith('task_')}
        return _build_final_score_response(level, task_scores)
    except Exception as e:
        return {'success': False, 'error': str(e)}


# ============================================================
# SUBPHASE 6.1 - STEP 2: EXPLORE
# ============================================================

@router.post('/step2/interaction1/track')
async def track_61_step2_interaction1(request: Request, user: dict = Depends(get_current_user)):
    """Track Sushi Spell game - Step 2 Interaction 1"""
    try:
        user_id = user["user_id"]
        data = await request.json()
        return _build_game_track_response(user_id, 2, 1, 1, data, min_time=90)
    except Exception as e:
        return {'success': False, 'error': str(e)}


@router.post('/step2/interaction2/evaluate')
async def evaluate_61_step2_interaction2(request: Request, user: dict = Depends(get_current_user)):
    """
    Evaluate writing choice explanation - Step 2 Interaction 2
    SKANDER: Why did you write your summary that way?
    """
    try:
        user_id = user["user_id"]
        data = await request.json()
        response = data.get('response', '').strip()
        if not response:
            raise HTTPException(status_code=400, detail='Response is required')

        prompt = f"""
Evaluate this student's explanation of their writing choices for a post-event report summary.

Student Response: "{response}"

Context: Student explains why they organised their summary a certain way (successes first/challenges/recommendations).
Target vocabulary: success, challenge, feedback, positive, recommend, evidence, summary

Scoring:
- A2 (2 pts): Very simple reason ("because good")
- B1 (3 pts): Simple reason with connector ("I wrote successes first because helpful")
- B2 (4 pts): Clear reasoning with report purpose ("balance/credibility/honest")
- C1 (5 pts): Sophisticated meta-reasoning about professional reporting standards

Return JSON: {{"score": 2-5, "level": "A2"|"B1"|"B2"|"C1", "feedback": "...",
"vocabulary_used": [...], "strengths": [...], "improvements": [...]}}
"""
        def fallback(r):
            return _generic_fallback(r, VOCAB_61)

        evaluation = _ai_evaluate(prompt, fallback, response)
        score = max(2, min(5, evaluation.get('score', 2)))
        level = evaluation.get('level', 'A2')
        logger.info(f"Phase 6.1 Step 2 I2 - User {user_id}: Score={score}, Level={level}")

        return {'success': True, 'data': {
            'score': score, 'level': level,
            'feedback': evaluation.get('feedback', ''),
            'vocabulary_used': evaluation.get('vocabulary_used', []),
            'strengths': evaluation.get('strengths', []),
            'improvements': evaluation.get('improvements', [])
        }}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error evaluating 6.1 Step 2 I2: {e}")
        return {'success': False, 'error': str(e)}


@router.post('/step2/interaction3/track')
async def track_61_step2_interaction3(request: Request, user: dict = Depends(get_current_user)):
    """Track Sushi Spell game - Step 2 Interaction 3"""
    try:
        user_id = user["user_id"]
        data = await request.json()
        return _build_game_track_response(user_id, 2, 3, 1, data, min_time=90)
    except Exception as e:
        return {'success': False, 'error': str(e)}


@router.post('/step2/calculate-score')
async def calculate_61_step2_score(request: Request, user: dict = Depends(get_current_user)):
    """Calculate Phase 6.1 Step 2 total score"""
    try:
        user_id = user["user_id"]
        data = await request.json()
        i1 = data.get('interaction1_score', 0)
        i2 = data.get('interaction2_score', 2)
        i3 = data.get('interaction3_score', 0)
        return _build_score_response(user_id, 2, 1, i1, i2, i3)
    except Exception as e:
        return {'success': False, 'error': str(e)}


@router.post('/step2/remedial/log')
async def log_61_step2_remedial(request: Request, user: dict = Depends(get_current_user)):
    """Log remedial task - Step 2"""
    try:
        data = await request.json()
        return _build_remedial_log_response(data)
    except Exception as e:
        return {'success': False, 'error': str(e)}


@router.post('/step2/remedial/{level}/final-score')
async def final_score_61_step2(level: str, request: Request, user: dict = Depends(get_current_user)):
    """Calculate remedial final score - Step 2"""
    try:
        data = await request.json()
        task_scores = {k: v for k, v in data.items() if k.startswith('task_')}
        return _build_final_score_response(level, task_scores)
    except Exception as e:
        return {'success': False, 'error': str(e)}


# ============================================================
# SUBPHASE 6.1 - STEP 3: EXPLAIN
# ============================================================

@router.post('/step3/interaction1/track')
async def track_61_step3_interaction1(request: Request, user: dict = Depends(get_current_user)):
    """Track Wordshake game - Step 3 Interaction 1"""
    try:
        user_id = user["user_id"]
        data = await request.json()
        return _build_game_track_response(user_id, 3, 1, 1, data, min_time=120)
    except Exception as e:
        return {'success': False, 'error': str(e)}


@router.post('/step3/interaction2/evaluate')
async def evaluate_61_step3_interaction2(request: Request, user: dict = Depends(get_current_user)):
    """
    Evaluate balance explanation - Step 3 Interaction 2
    Lilia: Why include both strengths and weaknesses in the report?
    """
    try:
        user_id = user["user_id"]
        data = await request.json()
        response = data.get('response', '').strip()
        if not response:
            raise HTTPException(status_code=400, detail='Response is required')

        prompt = f"""
Evaluate this student's explanation of why a balanced post-event report includes both strengths and weaknesses.

Student Response: "{response}"

Context: Student explains why including both successes and challenges builds credibility/trust.
Target vocabulary: strength, weakness, honest, credibility, trust, improve, balance, transparency

Scoring:
- A2 (2 pts): Simple reason ("honest good")
- B1 (3 pts): Basic reason with connector ("because it shows honesty")
- B2 (4 pts): Clear explanation referencing credibility/trust/improvement
- C1 (5 pts): Sophisticated analysis of transparency, accountability, stakeholder trust

Return JSON: {{"score": 2-5, "level": "A2"|"B1"|"B2"|"C1", "feedback": "...",
"vocabulary_used": [...], "strengths": [...], "improvements": [...]}}
"""
        def fallback(r):
            return _generic_fallback(r, VOCAB_61)

        evaluation = _ai_evaluate(prompt, fallback, response)
        score = max(2, min(5, evaluation.get('score', 2)))
        level = evaluation.get('level', 'A2')
        logger.info(f"Phase 6.1 Step 3 I2 - User {user_id}: Score={score}, Level={level}")

        return {'success': True, 'data': {
            'score': score, 'level': level,
            'feedback': evaluation.get('feedback', ''),
            'vocabulary_used': evaluation.get('vocabulary_used', []),
            'strengths': evaluation.get('strengths', []),
            'improvements': evaluation.get('improvements', [])
        }}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error evaluating 6.1 Step 3 I2: {e}")
        return {'success': False, 'error': str(e)}


@router.post('/step3/interaction3/track')
async def track_61_step3_interaction3(request: Request, user: dict = Depends(get_current_user)):
    """Track Sushi Spell game - Step 3 Interaction 3"""
    try:
        user_id = user["user_id"]
        data = await request.json()
        return _build_game_track_response(user_id, 3, 3, 1, data, min_time=90)
    except Exception as e:
        return {'success': False, 'error': str(e)}


@router.post('/step3/calculate-score')
async def calculate_61_step3_score(request: Request, user: dict = Depends(get_current_user)):
    """Calculate Phase 6.1 Step 3 total score"""
    try:
        user_id = user["user_id"]
        data = await request.json()
        i1 = data.get('interaction1_score', 0)
        i2 = data.get('interaction2_score', 2)
        i3 = data.get('interaction3_score', 0)
        return _build_score_response(user_id, 3, 1, i1, i2, i3)
    except Exception as e:
        return {'success': False, 'error': str(e)}


@router.post('/step3/remedial/log')
async def log_61_step3_remedial(request: Request, user: dict = Depends(get_current_user)):
    """Log remedial task - Step 3"""
    try:
        data = await request.json()
        return _build_remedial_log_response(data)
    except Exception as e:
        return {'success': False, 'error': str(e)}


@router.post('/step3/remedial/{level}/final-score')
async def final_score_61_step3(level: str, request: Request, user: dict = Depends(get_current_user)):
    """Calculate remedial final score - Step 3"""
    try:
        data = await request.json()
        task_scores = {k: v for k, v in data.items() if k.startswith('task_')}
        return _build_final_score_response(level, task_scores)
    except Exception as e:
        return {'success': False, 'error': str(e)}


# ============================================================
# SUBPHASE 6.1 - STEP 4: ELABORATE
# ============================================================

@router.post('/step4/interaction1/track')
async def track_61_step4_interaction1(request: Request, user: dict = Depends(get_current_user)):
    """Track Sushi Spell game - Step 4 Interaction 1"""
    try:
        user_id = user["user_id"]
        data = await request.json()
        return _build_game_track_response(user_id, 4, 1, 1, data, min_time=90)
    except Exception as e:
        return {'success': False, 'error': str(e)}


@router.post('/step4/interaction2/evaluate')
async def evaluate_61_step4_interaction2(request: Request, user: dict = Depends(get_current_user)):
    """
    Evaluate Successes & Challenges section - Step 4 Interaction 2
    Emna: Write 'Successes & Challenges' section using template
    """
    try:
        user_id = user["user_id"]
        data = await request.json()
        response = data.get('response', '').strip()
        if not response:
            raise HTTPException(status_code=400, detail='Response is required')

        prompt = f"""
Evaluate this student's 'Successes & Challenges' section of a post-event report.

Student Response: "{response}"

Context: Student writes a structured report section describing 3 successes and 2-3 challenges
from the Global Cultures Festival, with how challenges were handled.

Scoring:
- A2 (2 pts): Very simple list of successes/challenges, basic past tense
- B1 (3 pts): 4-6 sentences covering successes, at least 1 challenge with solution
- B2 (4 pts): 6-10 structured sentences, balanced evaluation, past tense, basic connectors
- C1 (5 pts): Sophisticated section with evidence (numbers/quotes), advanced connectors, formal tone

Return JSON: {{"score": 2-5, "level": "A2"|"B1"|"B2"|"C1", "feedback": "...",
"vocabulary_used": [...], "strengths": [...], "improvements": [...]}}
"""
        def fallback(r):
            return _generic_fallback(r, VOCAB_61)

        evaluation = _ai_evaluate(prompt, fallback, response)
        score = max(2, min(5, evaluation.get('score', 2)))
        level = evaluation.get('level', 'A2')
        logger.info(f"Phase 6.1 Step 4 I2 - User {user_id}: Score={score}, Level={level}")

        return {'success': True, 'data': {
            'score': score, 'level': level,
            'feedback': evaluation.get('feedback', ''),
            'vocabulary_used': evaluation.get('vocabulary_used', []),
            'strengths': evaluation.get('strengths', []),
            'improvements': evaluation.get('improvements', [])
        }}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error evaluating 6.1 Step 4 I2: {e}")
        return {'success': False, 'error': str(e)}


@router.post('/step4/interaction3/track')
async def track_61_step4_interaction3(request: Request, user: dict = Depends(get_current_user)):
    """Track Sushi Spell game - Step 4 Interaction 3"""
    try:
        user_id = user["user_id"]
        data = await request.json()
        return _build_game_track_response(user_id, 4, 3, 1, data, min_time=90)
    except Exception as e:
        return {'success': False, 'error': str(e)}


@router.post('/step4/calculate-score')
async def calculate_61_step4_score(request: Request, user: dict = Depends(get_current_user)):
    """Calculate Phase 6.1 Step 4 total score"""
    try:
        user_id = user["user_id"]
        data = await request.json()
        i1 = data.get('interaction1_score', 0)
        i2 = data.get('interaction2_score', 2)
        i3 = data.get('interaction3_score', 0)
        return _build_score_response(user_id, 4, 1, i1, i2, i3)
    except Exception as e:
        return {'success': False, 'error': str(e)}


@router.post('/step4/remedial/log')
async def log_61_step4_remedial(request: Request, user: dict = Depends(get_current_user)):
    """Log remedial task - Step 4"""
    try:
        data = await request.json()
        return _build_remedial_log_response(data)
    except Exception as e:
        return {'success': False, 'error': str(e)}


@router.post('/step4/remedial/{level}/final-score')
async def final_score_61_step4(level: str, request: Request, user: dict = Depends(get_current_user)):
    """Calculate remedial final score - Step 4"""
    try:
        data = await request.json()
        task_scores = {k: v for k, v in data.items() if k.startswith('task_')}
        return _build_final_score_response(level, task_scores)
    except Exception as e:
        return {'success': False, 'error': str(e)}


# ============================================================
# SUBPHASE 6.1 - STEP 5: EVALUATE
# ============================================================

@router.post('/step5/interaction1/evaluate-spelling')
async def evaluate_61_step5_interaction1(request: Request, user: dict = Depends(get_current_user)):
    """
    Evaluate spelling corrections - Step 5 Interaction 1
    Ms. Mabrouki: Correct spelling errors in faulty report
    """
    try:
        user_id = user["user_id"]
        data = await request.json()
        original_text = data.get('original_text', '').strip()
        corrected_text = data.get('corrected_text', '').strip()
        if not corrected_text:
            raise HTTPException(status_code=400, detail='Corrected text is required')

        prompt = f"""
Evaluate this student's spelling corrections in a post-event report excerpt.

Original (with errors): "{original_text}"
Student Corrections: "{corrected_text}"

Scoring based on accuracy of spelling fixes:
- A2 (2 pts): Fixed 1-2 basic spelling errors
- B1 (3 pts): Fixed 3-4 spelling errors correctly
- B2 (4 pts): Fixed 5-6 spelling errors with attention to detail
- C1 (5 pts): Fixed all spelling errors perfectly, no over-corrections

Common errors to look for: succes→success, challange→challenge, feedbak→feedback,
recomend→recommend, sumary→summary, achievment→achievement, evidance→evidence

Return JSON: {{"score": 2-5, "level": "A2"|"B1"|"B2"|"C1", "feedback": "...",
"corrections_found": [...], "strengths": [...], "improvements": [...]}}
"""
        def fallback(r):
            # Simple heuristic: count fixed errors
            error_words = ['succes', 'challange', 'feedbak', 'recomend', 'sumary', 'achievment']
            fixed = sum(1 for w in error_words if w not in r.lower())
            if fixed <= 1: score, level = 2, 'A2'
            elif fixed <= 3: score, level = 3, 'B1'
            elif fixed <= 5: score, level = 4, 'B2'
            else: score, level = 5, 'C1'
            return {'score': score, 'level': level,
                    'feedback': f'You fixed {fixed} spelling errors — {level} level.',
                    'corrections_found': [], 'strengths': [], 'improvements': []}

        evaluation = _ai_evaluate(prompt, fallback, corrected_text)
        score = max(2, min(5, evaluation.get('score', 2)))
        level = evaluation.get('level', 'A2')
        logger.info(f"Phase 6.1 Step 5 I1 - User {user_id}: Score={score}, Level={level}")

        return {'success': True, 'data': {
            'score': score, 'level': level,
            'feedback': evaluation.get('feedback', ''),
            'corrections_found': evaluation.get('corrections_found', []),
            'strengths': evaluation.get('strengths', []),
            'improvements': evaluation.get('improvements', [])
        }}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error evaluating 6.1 Step 5 I1: {e}")
        return {'success': False, 'error': str(e)}


@router.post('/step5/interaction2/evaluate-grammar')
async def evaluate_61_step5_interaction2(request: Request, user: dict = Depends(get_current_user)):
    """
    Evaluate grammar corrections - Step 5 Interaction 2
    Lilia: Fix grammar and tense mistakes
    """
    try:
        user_id = user["user_id"]
        data = await request.json()
        original_text = data.get('original_text', '').strip()
        corrected_text = data.get('corrected_text', '').strip()
        if not corrected_text:
            raise HTTPException(status_code=400, detail='Corrected text is required')

        prompt = f"""
Evaluate this student's grammar/tense corrections in a post-event report.

Original (with grammar errors): "{original_text}"
Student Grammar Corrections: "{corrected_text}"

Scoring based on grammar fix accuracy:
- A2 (2 pts): Fixed basic article/subject-verb errors
- B1 (3 pts): Correct past tense, fixed fragments
- B2 (4 pts): Consistent past tense, correct articles, proper sentence structure
- C1 (5 pts): Perfect grammar, formal register, all tense issues resolved

Return JSON: {{"score": 2-5, "level": "A2"|"B1"|"B2"|"C1", "feedback": "...",
"strengths": [...], "improvements": [...]}}
"""
        def fallback(r):
            word_count = len(r.split())
            has_past = any(w in r.lower() for w in ['was', 'were', 'came', 'had', 'took', 'fixed'])
            if word_count < 10: score, level = 2, 'A2'
            elif has_past and word_count < 25: score, level = 3, 'B1'
            elif has_past and word_count < 50: score, level = 4, 'B2'
            else: score, level = 5, 'C1'
            return {'score': score, 'level': level,
                    'feedback': f'Grammar correction at {level} level.',
                    'strengths': [], 'improvements': []}

        evaluation = _ai_evaluate(prompt, fallback, corrected_text)
        score = max(2, min(5, evaluation.get('score', 2)))
        level = evaluation.get('level', 'A2')
        logger.info(f"Phase 6.1 Step 5 I2 - User {user_id}: Score={score}, Level={level}")

        return {'success': True, 'data': {
            'score': score, 'level': level,
            'feedback': evaluation.get('feedback', ''),
            'strengths': evaluation.get('strengths', []),
            'improvements': evaluation.get('improvements', [])
        }}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error evaluating 6.1 Step 5 I2: {e}")
        return {'success': False, 'error': str(e)}


@router.post('/step5/interaction3/evaluate-enhancement')
async def evaluate_61_step5_interaction3(request: Request, user: dict = Depends(get_current_user)):
    """
    Evaluate full enhancement - Step 5 Interaction 3
    Ryan: Improve coherence, tone, formality, balance, evidence, recommendations
    """
    try:
        user_id = user["user_id"]
        data = await request.json()
        grammar_corrected_text = data.get('grammar_corrected_text', '').strip()
        enhanced_text = data.get('enhanced_text', '').strip()
        if not enhanced_text:
            raise HTTPException(status_code=400, detail='Enhanced text is required')

        prompt = f"""
Evaluate the quality of this enhanced post-event report compared to its grammar-corrected version.

Grammar-corrected: "{grammar_corrected_text}"
Enhanced version: "{enhanced_text}"

Assess improvements in: coherence, tone/formality, balance (positive+negative), evidence (numbers/quotes),
vocabulary precision, recommendations quality.

Scoring:
- A2 (2 pts): Minor improvement, mostly same content
- B1 (3 pts): Improved formality/vocabulary, added one new element
- B2 (4 pts): Balanced, formal, added connectors and some evidence
- C1 (5 pts): Sophisticated enhancement with evidence, formal tone, specific actionable recommendations

Return JSON: {{"score": 2-5, "level": "A2"|"B1"|"B2"|"C1", "feedback": "...",
"improvements_made": [...], "strengths": [...], "suggestions": [...]}}
"""
        def fallback(r):
            return _generic_fallback(r, VOCAB_61)

        evaluation = _ai_evaluate(prompt, fallback, enhanced_text)
        score = max(2, min(5, evaluation.get('score', 2)))
        level = evaluation.get('level', 'A2')
        logger.info(f"Phase 6.1 Step 5 I3 - User {user_id}: Score={score}, Level={level}")

        return {'success': True, 'data': {
            'score': score, 'level': level,
            'feedback': evaluation.get('feedback', ''),
            'improvements_made': evaluation.get('improvements_made', []),
            'strengths': evaluation.get('strengths', []),
            'suggestions': evaluation.get('suggestions', [])
        }}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error evaluating 6.1 Step 5 I3: {e}")
        return {'success': False, 'error': str(e)}


@router.post('/step5/calculate-score')
async def calculate_61_step5_score(request: Request, user: dict = Depends(get_current_user)):
    """Calculate Phase 6.1 Step 5 total score"""
    try:
        user_id = user["user_id"]
        data = await request.json()
        i1 = data.get('interaction1_score', 0)
        i2 = data.get('interaction2_score', 2)
        i3 = data.get('interaction3_score', 0)
        return _build_score_response(user_id, 5, 1, i1, i2, i3)
    except Exception as e:
        return {'success': False, 'error': str(e)}


@router.post('/step5/remedial/log')
async def log_61_step5_remedial(request: Request, user: dict = Depends(get_current_user)):
    """Log remedial task - Step 5"""
    try:
        data = await request.json()
        return _build_remedial_log_response(data)
    except Exception as e:
        return {'success': False, 'error': str(e)}


@router.post('/step5/remedial/{level}/final-score')
async def final_score_61_step5(level: str, request: Request, user: dict = Depends(get_current_user)):
    """Calculate remedial final score - Step 5"""
    try:
        data = await request.json()
        task_scores = {k: v for k, v in data.items() if k.startswith('task_')}
        return _build_final_score_response(level, task_scores)
    except Exception as e:
        return {'success': False, 'error': str(e)}


# ============================================================
# SUBPHASE 6.1 - COMPLETION CHECK
# ============================================================

@router.get('/subphase1/check-completion')
async def check_subphase1_completion(user: dict = Depends(get_current_user)):
    """Check if SubPhase 6.1 is complete (all 5 steps, total >= 12 points)"""
    try:
        user_id = user["user_id"]
        conn = get_db_connection()

        rows = conn.execute(
            'SELECT step_id, total_score FROM phase6_progress WHERE user_id = ? AND subphase = 1',
            (user_id,)
        ).fetchall()
        conn.close()

        completed_steps = {row['step_id']: row['total_score'] for row in rows}
        all_steps_done = all(s in completed_steps for s in range(1, 6))
        total_score = sum(completed_steps.values())
        is_complete = all_steps_done and total_score >= 12

        return {'success': True, 'data': {
            'is_complete': is_complete,
            'steps_completed': list(completed_steps.keys()),
            'total_score': total_score,
            'min_score_required': 12
        }}
    except Exception as e:
        logger.error(f"Error checking subphase1 completion: {e}")
        # Graceful fallback
        return {'success': True, 'data': {
            'is_complete': False, 'steps_completed': [], 'total_score': 0, 'min_score_required': 12
        }}


# ============================================================
# PHASE 5 COMPLETION CHECK (prerequisite)
# ============================================================

@router.get('/check-phase5-completion')
async def check_phase5_completion(user: dict = Depends(get_current_user)):
    """Check if Phase 5 is completed (prerequisite for Phase 6)"""
    try:
        user_id = user["user_id"]
        conn = get_db_connection()

        # Check phase5_progress for both subphases having 5 steps each
        sp1_rows = conn.execute(
            'SELECT COUNT(*) as cnt FROM phase5_progress WHERE user_id = ? AND subphase = 1',
            (user_id,)
        ).fetchone()
        sp2_rows = conn.execute(
            'SELECT COUNT(*) as cnt FROM phase5_progress WHERE user_id = ? AND subphase = 2',
            (user_id,)
        ).fetchone()
        conn.close()

        sp1_done = sp1_rows['cnt'] >= 5 if sp1_rows else False
        sp2_done = sp2_rows['cnt'] >= 5 if sp2_rows else False
        is_complete = sp1_done and sp2_done

        return {'success': True, 'data': {
            'is_complete': is_complete,
            'subphase1_done': sp1_done,
            'subphase2_done': sp2_done
        }}
    except Exception as e:
        logger.error(f"Error checking phase5 completion: {e}")
        return {'success': True, 'data': {
            'is_complete': True  # Graceful: don't block if DB error
        }}


# ============================================================
# SUBPHASE 6.2 - STEP 1: ENGAGE (Peer Feedback)
# ============================================================

@router.post('/subphase2/step1/interaction1/track')
async def track_62_step1_interaction1(request: Request, user: dict = Depends(get_current_user)):
    """Track Wordshake game - SP2 Step 1 Interaction 1"""
    try:
        user_id = user["user_id"]
        data = await request.json()
        return _build_game_track_response(user_id, 1, 1, 2, data, min_time=120)
    except Exception as e:
        return {'success': False, 'error': str(e)}


@router.post('/subphase2/step1/interaction2/evaluate')
async def evaluate_62_step1_interaction2(request: Request, user: dict = Depends(get_current_user)):
    """
    Evaluate feedback experience - SP2 Step 1 Interaction 2
    SKANDER: Share experience with receiving/giving feedback (past tense)
    """
    try:
        user_id = user["user_id"]
        data = await request.json()
        response = data.get('response', '').strip()
        if not response:
            raise HTTPException(status_code=400, detail='Response is required')

        prompt = f"""
Evaluate this student's personal experience with receiving or giving feedback.

Student Response: "{response}"

Context: Student shares a past experience with feedback (school/project/life).
Target vocabulary: feedback, positive, suggestion, improve, helpful, polite, listen

Scoring:
- A2 (2 pts): Very simple past sentences ("Teacher say better. I happy.")
- B1 (3 pts): 3-4 sentences with past tense, basic reasons ("because helpful")
- B2 (4 pts): Detailed experience with feelings and impact, connectors
- C1 (5 pts): Sophisticated reflection on feedback quality, critical analysis

Return JSON: {{"score": 2-5, "level": "A2"|"B1"|"B2"|"C1", "feedback": "...",
"vocabulary_used": [...], "strengths": [...], "improvements": [...]}}
"""
        def fallback(r):
            return _generic_fallback(r, VOCAB_62)

        evaluation = _ai_evaluate(prompt, fallback, response)
        score = max(2, min(5, evaluation.get('score', 2)))
        level = evaluation.get('level', 'A2')
        logger.info(f"Phase 6.2 Step 1 I2 - User {user_id}: Score={score}, Level={level}")

        return {'success': True, 'data': {
            'score': score, 'level': level,
            'feedback': evaluation.get('feedback', ''),
            'vocabulary_used': evaluation.get('vocabulary_used', []),
            'strengths': evaluation.get('strengths', []),
            'improvements': evaluation.get('improvements', [])
        }}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error evaluating 6.2 Step 1 I2: {e}")
        return {'success': False, 'error': str(e)}


@router.post('/subphase2/step1/interaction3/track')
async def track_62_step1_interaction3(request: Request, user: dict = Depends(get_current_user)):
    """Track Sushi Spell game - SP2 Step 1 Interaction 3"""
    try:
        user_id = user["user_id"]
        data = await request.json()
        return _build_game_track_response(user_id, 1, 3, 2, data, min_time=90)
    except Exception as e:
        return {'success': False, 'error': str(e)}


@router.post('/subphase2/step1/calculate-score')
async def calculate_62_step1_score(request: Request, user: dict = Depends(get_current_user)):
    """Calculate Phase 6.2 Step 1 total score"""
    try:
        user_id = user["user_id"]
        data = await request.json()
        i1 = data.get('interaction1_score', 0)
        i2 = data.get('interaction2_score', 2)
        i3 = data.get('interaction3_score', 0)
        return _build_score_response(user_id, 1, 2, i1, i2, i3)
    except Exception as e:
        return {'success': False, 'error': str(e)}


@router.post('/subphase2/step1/remedial/log')
async def log_62_step1_remedial(request: Request, user: dict = Depends(get_current_user)):
    """Log remedial task - SP2 Step 1"""
    try:
        data = await request.json()
        return _build_remedial_log_response(data)
    except Exception as e:
        return {'success': False, 'error': str(e)}


@router.post('/subphase2/step1/remedial/{level}/final-score')
async def final_score_62_step1(level: str, request: Request, user: dict = Depends(get_current_user)):
    """Calculate remedial final score - SP2 Step 1"""
    try:
        data = await request.json()
        task_scores = {k: v for k, v in data.items() if k.startswith('task_')}
        return _build_final_score_response(level, task_scores)
    except Exception as e:
        return {'success': False, 'error': str(e)}


# ============================================================
# SUBPHASE 6.2 - STEP 2: EXPLORE
# ============================================================

@router.post('/subphase2/step2/interaction1/track')
async def track_62_step2_interaction1(request: Request, user: dict = Depends(get_current_user)):
    """Track Sushi Spell game - SP2 Step 2 Interaction 1"""
    try:
        user_id = user["user_id"]
        data = await request.json()
        return _build_game_track_response(user_id, 2, 1, 2, data, min_time=90)
    except Exception as e:
        return {'success': False, 'error': str(e)}


@router.post('/subphase2/step2/interaction2/evaluate')
async def evaluate_62_step2_interaction2(request: Request, user: dict = Depends(get_current_user)):
    """
    Evaluate feedback choice explanation - SP2 Step 2 Interaction 2
    SKANDER: Why did you write your feedback that way?
    """
    try:
        user_id = user["user_id"]
        data = await request.json()
        response = data.get('response', '').strip()
        if not response:
            raise HTTPException(status_code=400, detail='Response is required')

        prompt = f"""
Evaluate this student's explanation of why they wrote feedback a certain way.

Student Response: "{response}"

Context: Student explains feedback writing choices (starting positive, using suggestions, etc.)
Target vocabulary: positive, suggestion, constructive, feedback, improve, polite, helpful, because

Scoring:
- A2 (2 pts): Very simple reason ("I say good first because happy")
- B1 (3 pts): Simple reason with connector and basic explanation
- B2 (4 pts): Clear reasoning referencing feedback principles (sandwich technique)
- C1 (5 pts): Sophisticated meta-reasoning about psychological impact of feedback structure

Return JSON: {{"score": 2-5, "level": "A2"|"B1"|"B2"|"C1", "feedback": "...",
"vocabulary_used": [...], "strengths": [...], "improvements": [...]}}
"""
        def fallback(r):
            return _generic_fallback(r, VOCAB_62)

        evaluation = _ai_evaluate(prompt, fallback, response)
        score = max(2, min(5, evaluation.get('score', 2)))
        level = evaluation.get('level', 'A2')
        logger.info(f"Phase 6.2 Step 2 I2 - User {user_id}: Score={score}, Level={level}")

        return {'success': True, 'data': {
            'score': score, 'level': level,
            'feedback': evaluation.get('feedback', ''),
            'vocabulary_used': evaluation.get('vocabulary_used', []),
            'strengths': evaluation.get('strengths', []),
            'improvements': evaluation.get('improvements', [])
        }}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error evaluating 6.2 Step 2 I2: {e}")
        return {'success': False, 'error': str(e)}


@router.post('/subphase2/step2/interaction3/track')
async def track_62_step2_interaction3(request: Request, user: dict = Depends(get_current_user)):
    """Track Sushi Spell game - SP2 Step 2 Interaction 3"""
    try:
        user_id = user["user_id"]
        data = await request.json()
        return _build_game_track_response(user_id, 2, 3, 2, data, min_time=90)
    except Exception as e:
        return {'success': False, 'error': str(e)}


@router.post('/subphase2/step2/calculate-score')
async def calculate_62_step2_score(request: Request, user: dict = Depends(get_current_user)):
    """Calculate Phase 6.2 Step 2 total score"""
    try:
        user_id = user["user_id"]
        data = await request.json()
        i1 = data.get('interaction1_score', 0)
        i2 = data.get('interaction2_score', 2)
        i3 = data.get('interaction3_score', 0)
        return _build_score_response(user_id, 2, 2, i1, i2, i3)
    except Exception as e:
        return {'success': False, 'error': str(e)}


@router.post('/subphase2/step2/remedial/log')
async def log_62_step2_remedial(request: Request, user: dict = Depends(get_current_user)):
    """Log remedial task - SP2 Step 2"""
    try:
        data = await request.json()
        return _build_remedial_log_response(data)
    except Exception as e:
        return {'success': False, 'error': str(e)}


@router.post('/subphase2/step2/remedial/{level}/final-score')
async def final_score_62_step2(level: str, request: Request, user: dict = Depends(get_current_user)):
    """Calculate remedial final score - SP2 Step 2"""
    try:
        data = await request.json()
        task_scores = {k: v for k, v in data.items() if k.startswith('task_')}
        return _build_final_score_response(level, task_scores)
    except Exception as e:
        return {'success': False, 'error': str(e)}


# ============================================================
# SUBPHASE 6.2 - STEP 3: EXPLAIN
# ============================================================

@router.post('/subphase2/step3/interaction1/track')
async def track_62_step3_interaction1(request: Request, user: dict = Depends(get_current_user)):
    """Track Wordshake game - SP2 Step 3 Interaction 1"""
    try:
        user_id = user["user_id"]
        data = await request.json()
        return _build_game_track_response(user_id, 3, 1, 2, data, min_time=120)
    except Exception as e:
        return {'success': False, 'error': str(e)}


@router.post('/subphase2/step3/interaction2/evaluate')
async def evaluate_62_step3_interaction2(request: Request, user: dict = Depends(get_current_user)):
    """
    Evaluate specificity explanation - SP2 Step 3 Interaction 2
    Lilia: Why should feedback be specific (not general)?
    """
    try:
        user_id = user["user_id"]
        data = await request.json()
        response = data.get('response', '').strip()
        if not response:
            raise HTTPException(status_code=400, detail='Response is required')

        prompt = f"""
Evaluate this student's explanation of why feedback should be specific rather than general.

Student Response: "{response}"

Context: Student explains the importance of specific vs general feedback with an example.
Target vocabulary: specific, actionable, clear, improve, helpful, suggest, example, because

Scoring:
- A2 (2 pts): Simple statement ("specific is better because help")
- B1 (3 pts): Reason with connector and basic example
- B2 (4 pts): Clear explanation referencing "clear action" and providing example
- C1 (5 pts): Sophisticated analysis linking specificity to actionability and evidence-based learning

Return JSON: {{"score": 2-5, "level": "A2"|"B1"|"B2"|"C1", "feedback": "...",
"vocabulary_used": [...], "strengths": [...], "improvements": [...]}}
"""
        def fallback(r):
            return _generic_fallback(r, VOCAB_62)

        evaluation = _ai_evaluate(prompt, fallback, response)
        score = max(2, min(5, evaluation.get('score', 2)))
        level = evaluation.get('level', 'A2')
        logger.info(f"Phase 6.2 Step 3 I2 - User {user_id}: Score={score}, Level={level}")

        return {'success': True, 'data': {
            'score': score, 'level': level,
            'feedback': evaluation.get('feedback', ''),
            'vocabulary_used': evaluation.get('vocabulary_used', []),
            'strengths': evaluation.get('strengths', []),
            'improvements': evaluation.get('improvements', [])
        }}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error evaluating 6.2 Step 3 I2: {e}")
        return {'success': False, 'error': str(e)}


@router.post('/subphase2/step3/interaction3/track')
async def track_62_step3_interaction3(request: Request, user: dict = Depends(get_current_user)):
    """Track Sushi Spell game - SP2 Step 3 Interaction 3"""
    try:
        user_id = user["user_id"]
        data = await request.json()
        return _build_game_track_response(user_id, 3, 3, 2, data, min_time=90)
    except Exception as e:
        return {'success': False, 'error': str(e)}


@router.post('/subphase2/step3/calculate-score')
async def calculate_62_step3_score(request: Request, user: dict = Depends(get_current_user)):
    """Calculate Phase 6.2 Step 3 total score"""
    try:
        user_id = user["user_id"]
        data = await request.json()
        i1 = data.get('interaction1_score', 0)
        i2 = data.get('interaction2_score', 2)
        i3 = data.get('interaction3_score', 0)
        return _build_score_response(user_id, 3, 2, i1, i2, i3)
    except Exception as e:
        return {'success': False, 'error': str(e)}


@router.post('/subphase2/step3/remedial/log')
async def log_62_step3_remedial(request: Request, user: dict = Depends(get_current_user)):
    """Log remedial task - SP2 Step 3"""
    try:
        data = await request.json()
        return _build_remedial_log_response(data)
    except Exception as e:
        return {'success': False, 'error': str(e)}


@router.post('/subphase2/step3/remedial/{level}/final-score')
async def final_score_62_step3(level: str, request: Request, user: dict = Depends(get_current_user)):
    """Calculate remedial final score - SP2 Step 3"""
    try:
        data = await request.json()
        task_scores = {k: v for k, v in data.items() if k.startswith('task_')}
        return _build_final_score_response(level, task_scores)
    except Exception as e:
        return {'success': False, 'error': str(e)}


# ============================================================
# SUBPHASE 6.2 - STEP 4: ELABORATE
# ============================================================

@router.post('/subphase2/step4/interaction1/track')
async def track_62_step4_interaction1(request: Request, user: dict = Depends(get_current_user)):
    """Track Sushi Spell game - SP2 Step 4 Interaction 1"""
    try:
        user_id = user["user_id"]
        data = await request.json()
        return _build_game_track_response(user_id, 4, 1, 2, data, min_time=90)
    except Exception as e:
        return {'success': False, 'error': str(e)}


@router.post('/subphase2/step4/interaction2/evaluate')
async def evaluate_62_step4_interaction2(request: Request, user: dict = Depends(get_current_user)):
    """
    Evaluate response to received feedback - SP2 Step 4 Interaction 2
    SKANDER: How did feedback make you feel? What will you change?
    """
    try:
        user_id = user["user_id"]
        data = await request.json()
        response = data.get('response', '').strip()
        if not response:
            raise HTTPException(status_code=400, detail='Response is required')

        prompt = f"""
Evaluate this student's response to peer feedback they received.

Student Response: "{response}"

Context: Student responds to feedback received from a classmate about their report,
explaining what they agree with and what they will change.
Target vocabulary: thank, agree, improve, feedback, suggestion, polite, helpful, change

Scoring:
- A2 (2 pts): Very simple ("Thank you. I add words.")
- B1 (3 pts): Polite acknowledgement + one specific change stated
- B2 (4 pts): Reflective response agreeing with reasoning, specific improvement plan
- C1 (5 pts): Sophisticated growth-oriented response with specific actionable revisions

Return JSON: {{"score": 2-5, "level": "A2"|"B1"|"B2"|"C1", "feedback": "...",
"vocabulary_used": [...], "strengths": [...], "improvements": [...]}}
"""
        def fallback(r):
            return _generic_fallback(r, VOCAB_62)

        evaluation = _ai_evaluate(prompt, fallback, response)
        score = max(2, min(5, evaluation.get('score', 2)))
        level = evaluation.get('level', 'A2')
        logger.info(f"Phase 6.2 Step 4 I2 - User {user_id}: Score={score}, Level={level}")

        return {'success': True, 'data': {
            'score': score, 'level': level,
            'feedback': evaluation.get('feedback', ''),
            'vocabulary_used': evaluation.get('vocabulary_used', []),
            'strengths': evaluation.get('strengths', []),
            'improvements': evaluation.get('improvements', [])
        }}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error evaluating 6.2 Step 4 I2: {e}")
        return {'success': False, 'error': str(e)}


@router.post('/subphase2/step4/interaction3/track')
async def track_62_step4_interaction3(request: Request, user: dict = Depends(get_current_user)):
    """Track Sushi Spell game - SP2 Step 4 Interaction 3"""
    try:
        user_id = user["user_id"]
        data = await request.json()
        return _build_game_track_response(user_id, 4, 3, 2, data, min_time=90)
    except Exception as e:
        return {'success': False, 'error': str(e)}


@router.post('/subphase2/step4/calculate-score')
async def calculate_62_step4_score(request: Request, user: dict = Depends(get_current_user)):
    """Calculate Phase 6.2 Step 4 total score"""
    try:
        user_id = user["user_id"]
        data = await request.json()
        i1 = data.get('interaction1_score', 0)
        i2 = data.get('interaction2_score', 2)
        i3 = data.get('interaction3_score', 0)
        return _build_score_response(user_id, 4, 2, i1, i2, i3)
    except Exception as e:
        return {'success': False, 'error': str(e)}


@router.post('/subphase2/step4/remedial/log')
async def log_62_step4_remedial(request: Request, user: dict = Depends(get_current_user)):
    """Log remedial task - SP2 Step 4"""
    try:
        data = await request.json()
        return _build_remedial_log_response(data)
    except Exception as e:
        return {'success': False, 'error': str(e)}


@router.post('/subphase2/step4/remedial/{level}/final-score')
async def final_score_62_step4(level: str, request: Request, user: dict = Depends(get_current_user)):
    """Calculate remedial final score - SP2 Step 4"""
    try:
        data = await request.json()
        task_scores = {k: v for k, v in data.items() if k.startswith('task_')}
        return _build_final_score_response(level, task_scores)
    except Exception as e:
        return {'success': False, 'error': str(e)}


# ============================================================
# SUBPHASE 6.2 - STEP 5: EVALUATE
# ============================================================

@router.post('/subphase2/step5/interaction1/evaluate')
async def evaluate_62_step5_interaction1(request: Request, user: dict = Depends(get_current_user)):
    """
    Evaluate spelling correction in faulty feedback - SP2 Step 5 Interaction 1
    """
    try:
        user_id = user["user_id"]
        data = await request.json()
        faulty_text = data.get('faulty_text', '').strip()
        corrected_text = data.get('corrected_text', '').strip()
        if not corrected_text:
            raise HTTPException(status_code=400, detail='Corrected text is required')

        prompt = f"""
Evaluate spelling corrections in this feedback text.

Original (faulty): "{faulty_text}"
Student Corrections: "{corrected_text}"

Common feedback spelling errors: feedbak->feedback, sugestion->suggestion,
improv->improve, strenght->strength, weknes->weakness, polight->polite

Scoring by number of correct fixes:
- A2 (2 pts): 1-2 correct fixes
- B1 (3 pts): 3-4 correct fixes
- B2 (4 pts): 5-6 correct fixes
- C1 (5 pts): All errors fixed perfectly

Return JSON: {{"score": 2-5, "level": "A2"|"B1"|"B2"|"C1", "feedback": "...",
"strengths": [...], "improvements": [...]}}
"""
        def fallback(r):
            errors = ['feedbak', 'sugestion', 'improv', 'strenght', 'weknes', 'polight']
            fixed = sum(1 for e in errors if e not in r.lower())
            if fixed <= 1: score, level = 2, 'A2'
            elif fixed <= 3: score, level = 3, 'B1'
            elif fixed <= 5: score, level = 4, 'B2'
            else: score, level = 5, 'C1'
            return {'score': score, 'level': level,
                    'feedback': f'Fixed {fixed} spelling errors — {level} level.',
                    'strengths': [], 'improvements': []}

        evaluation = _ai_evaluate(prompt, fallback, corrected_text)
        score = max(2, min(5, evaluation.get('score', 2)))
        level = evaluation.get('level', 'A2')
        logger.info(f"Phase 6.2 Step 5 I1 - User {user_id}: Score={score}, Level={level}")

        return {'success': True, 'data': {
            'score': score, 'level': level,
            'feedback': evaluation.get('feedback', ''),
            'strengths': evaluation.get('strengths', []),
            'improvements': evaluation.get('improvements', [])
        }}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error evaluating 6.2 Step 5 I1: {e}")
        return {'success': False, 'error': str(e)}


@router.post('/subphase2/step5/interaction2/evaluate')
async def evaluate_62_step5_interaction2(request: Request, user: dict = Depends(get_current_user)):
    """
    Evaluate tone/politeness correction - SP2 Step 5 Interaction 2
    Lilia: Fix tone & politeness (make it kind, not harsh)
    """
    try:
        user_id = user["user_id"]
        data = await request.json()
        original_text = data.get('original_text', '').strip()
        corrected_text = data.get('corrected_text', '').strip()
        if not corrected_text:
            raise HTTPException(status_code=400, detail='Corrected text is required')

        prompt = f"""
Evaluate the tone/politeness improvement in this peer feedback.

Original (harsh/impolite): "{original_text}"
Student Improved Version: "{corrected_text}"

Assess: politeness (please/thank you), softened language (could->could be stronger),
empathy (I think/perhaps/well done), encouraging tone.

Scoring:
- A2 (2 pts): Added "please" or "thank you", minor change
- B1 (3 pts): Softened one harsh phrase, added polite opening/closing
- B2 (4 pts): Overall tone shift from negative to constructive, multiple polite elements
- C1 (5 pts): Sophisticated empathetic tone with encouraging language throughout

Return JSON: {{"score": 2-5, "level": "A2"|"B1"|"B2"|"C1", "feedback": "...",
"strengths": [...], "improvements": [...]}}
"""
        def fallback(r):
            polite = ['please', 'thank', 'well done', 'good', 'could', 'perhaps', 'i think']
            polite_count = sum(1 for p in polite if p in r.lower())
            if polite_count <= 1: score, level = 2, 'A2'
            elif polite_count <= 3: score, level = 3, 'B1'
            elif polite_count <= 5: score, level = 4, 'B2'
            else: score, level = 5, 'C1'
            return {'score': score, 'level': level,
                    'feedback': f'Tone improvement at {level} level.',
                    'strengths': [], 'improvements': []}

        evaluation = _ai_evaluate(prompt, fallback, corrected_text)
        score = max(2, min(5, evaluation.get('score', 2)))
        level = evaluation.get('level', 'A2')
        logger.info(f"Phase 6.2 Step 5 I2 - User {user_id}: Score={score}, Level={level}")

        return {'success': True, 'data': {
            'score': score, 'level': level,
            'feedback': evaluation.get('feedback', ''),
            'strengths': evaluation.get('strengths', []),
            'improvements': evaluation.get('improvements', [])
        }}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error evaluating 6.2 Step 5 I2: {e}")
        return {'success': False, 'error': str(e)}


@router.post('/subphase2/step5/interaction3/evaluate')
async def evaluate_62_step5_interaction3(request: Request, user: dict = Depends(get_current_user)):
    """
    Evaluate full feedback restructure - SP2 Step 5 Interaction 3
    Ryan: Restructure into positive sandwich + make specific/actionable
    """
    try:
        user_id = user["user_id"]
        data = await request.json()
        original_text = data.get('original_text', '').strip()
        improved_text = data.get('improved_text', '').strip()
        if not improved_text:
            raise HTTPException(status_code=400, detail='Improved text is required')

        prompt = f"""
Evaluate the quality of this restructured peer feedback.

Original (weak/problematic): "{original_text}"
Student Restructured Version: "{improved_text}"

Assess: positive sandwich structure (positive->suggestion->positive), specificity of suggestion,
actionability, politeness, empathy, overall helpfulness.

Scoring:
- A2 (2 pts): Added simple positive and basic suggestion
- B1 (3 pts): Positive + suggestion + closing positive, somewhat polite
- B2 (4 pts): Full sandwich structure, specific suggestion, balanced and polite
- C1 (5 pts): Sophisticated empathetic feedback with actionable specific suggestions, growth-oriented

Return JSON: {{"score": 2-5, "level": "A2"|"B1"|"B2"|"C1", "feedback": "...",
"improvements_made": [...], "strengths": [...], "suggestions": [...]}}
"""
        def fallback(r):
            return _generic_fallback(r, VOCAB_62)

        evaluation = _ai_evaluate(prompt, fallback, improved_text)
        score = max(2, min(5, evaluation.get('score', 2)))
        level = evaluation.get('level', 'A2')
        logger.info(f"Phase 6.2 Step 5 I3 - User {user_id}: Score={score}, Level={level}")

        return {'success': True, 'data': {
            'score': score, 'level': level,
            'feedback': evaluation.get('feedback', ''),
            'improvements_made': evaluation.get('improvements_made', []),
            'strengths': evaluation.get('strengths', []),
            'suggestions': evaluation.get('suggestions', [])
        }}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error evaluating 6.2 Step 5 I3: {e}")
        return {'success': False, 'error': str(e)}


@router.post('/subphase2/step5/calculate-score')
async def calculate_62_step5_score(request: Request, user: dict = Depends(get_current_user)):
    """Calculate Phase 6.2 Step 5 total score"""
    try:
        user_id = user["user_id"]
        data = await request.json()
        i1 = data.get('interaction1_score', 0)
        i2 = data.get('interaction2_score', 2)
        i3 = data.get('interaction3_score', 0)
        return _build_score_response(user_id, 5, 2, i1, i2, i3)
    except Exception as e:
        return {'success': False, 'error': str(e)}


@router.post('/subphase2/step5/remedial/log')
async def log_62_step5_remedial(request: Request, user: dict = Depends(get_current_user)):
    """Log remedial task - SP2 Step 5"""
    try:
        data = await request.json()
        return _build_remedial_log_response(data)
    except Exception as e:
        return {'success': False, 'error': str(e)}


@router.post('/subphase2/step5/remedial/{level}/final-score')
async def final_score_62_step5(level: str, request: Request, user: dict = Depends(get_current_user)):
    """Calculate remedial final score - SP2 Step 5"""
    try:
        data = await request.json()
        task_scores = {k: v for k, v in data.items() if k.startswith('task_')}
        return _build_final_score_response(level, task_scores)
    except Exception as e:
        return {'success': False, 'error': str(e)}


# ============================================================
# SUBPHASE 6.2 - COMPLETION CHECK
# ============================================================

@router.get('/subphase2/check-completion')
async def check_subphase2_completion(user: dict = Depends(get_current_user)):
    """Check if SubPhase 6.2 is complete (all 5 steps, total >= 12 points)"""
    try:
        user_id = user["user_id"]
        conn = get_db_connection()

        rows = conn.execute(
            'SELECT step_id, total_score FROM phase6_progress WHERE user_id = ? AND subphase = 2',
            (user_id,)
        ).fetchall()
        conn.close()

        completed_steps = {row['step_id']: row['total_score'] for row in rows}
        all_steps_done = all(s in completed_steps for s in range(1, 6))
        total_score = sum(completed_steps.values())
        is_complete = all_steps_done and total_score >= 12

        return {'success': True, 'data': {
            'is_complete': is_complete,
            'steps_completed': list(completed_steps.keys()),
            'total_score': total_score,
            'min_score_required': 12
        }}
    except Exception as e:
        logger.error(f"Error checking subphase2 completion: {e}")
        return {'success': True, 'data': {
            'is_complete': False, 'steps_completed': [], 'total_score': 0, 'min_score_required': 12
        }}
