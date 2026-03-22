"""
Phase 3 API Routes - FastAPI migration of routes/phase3_routes.py
Sponsorship & Budgeting phase endpoints.
Preserves exact response shapes expected by the frontend.
"""
import json
import re
import logging
import sqlite3
from fastapi import APIRouter, Request, Depends, HTTPException
from fastapi.responses import JSONResponse

from auth_utils import get_current_user
from services.ai_service import AIService


def get_db_connection():
    conn = sqlite3.connect('fardi.db')
    conn.row_factory = sqlite3.Row
    return conn


def save_phase3_progress(user_id, step, interaction=None, context='main', score=None, item_id=None, item_type=None, prompt=None, answer=None, is_correct=None):
    """Save progress and optionally a response for Phase 3."""
    conn = get_db_connection()
    try:
        # Upsert resume pointer
        conn.execute(
            """INSERT INTO student_progress (user_id, phase, step, interaction, context, is_complete)
               VALUES (?, 3, ?, ?, ?, 0)
               ON CONFLICT(user_id, phase) DO UPDATE SET
                   step = excluded.step,
                   interaction = excluded.interaction,
                   context = excluded.context""",
            (user_id, step, interaction or 0, context)
        )
        # Insert response if answer provided
        if answer is not None:
            is_correct_int = None
            if is_correct is not None:
                is_correct_int = 1 if is_correct else 0
            answer_val = answer if isinstance(answer, str) else json.dumps(answer)
            conn.execute(
                """INSERT INTO student_responses
                    (user_id, phase, step, interaction, item_index, context, item_id, item_type, prompt, response, is_correct, score)
                   VALUES (?, 3, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?)""",
                (user_id, step, interaction or 0, context, item_id, item_type, prompt, answer_val, is_correct_int, score)
            )
        conn.commit()
    finally:
        conn.close()

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/phase3", tags=["phase3"])


@router.get('/step/{step_id}')
async def get_step(step_id: int, user: dict = Depends(get_current_user)):
    """Get Phase 3 step data"""
    try:
        # TODO: Implement step data loading
        # For now, return basic structure
        return {
            'success': True,
            'data': {
                'step_id': step_id,
                'title': f'Phase 3 - Step {step_id}: Sponsorship & Budgeting',
                'description': 'Financial planning and sponsorship activities'
            }
        }
    except Exception as e:
        logger.error(f"Error getting Phase 3 step {step_id}: {e}")
        return JSONResponse(
            status_code=500,
            content={'success': False, 'error': str(e)}
        )


@router.post('/step/{step_id}/submit')
async def submit_response(step_id: int, request: Request, user: dict = Depends(get_current_user)):
    """Submit Phase 3 step response"""
    try:
        user_id = user["user_id"]
        data = await request.json()

        # TODO: Implement response submission and AI assessment
        logger.info(f"Phase 3 Step {step_id} submission from user {user_id}")

        return {
            'success': True,
            'message': 'Response submitted successfully'
        }
    except Exception as e:
        logger.error(f"Error submitting Phase 3 step {step_id} response: {e}")
        return JSONResponse(
            status_code=500,
            content={'success': False, 'error': str(e)}
        )


@router.post('/step/{step_id}/calculate-score')
async def calculate_step_score(step_id: int, request: Request, user: dict = Depends(get_current_user)):
    """
    Calculate Phase 3 step score and determine remedial routing.
    Steps 1-3: I1 (vocab game, 0-8), I2 (game, 0-8), I3 (sentence CEFR, 1-5)
    Step 4: I1 (budget, 1-5), I2 (pitch CEFR, 1-5)
    The CEFR score (I3 for steps 1-3, I2 for step 4) drives remedial level.
    """
    try:
        user_id = user["user_id"]
        data = await request.json()

        interaction1_score = data.get('interaction1_score', 0)
        interaction2_score = data.get('interaction2_score', 0)
        interaction3_score = data.get('interaction3_score', 0)

        total_score = interaction1_score + interaction2_score + interaction3_score

        # CEFR assessment score determines remedial level
        # Steps 1-3: I3 is the sentence production (1-5 CEFR)
        # Step 4: I2 is the pitch (1-5 CEFR)
        cefr_score = interaction3_score if step_id <= 3 else interaction2_score

        level_map = {1: 'A1', 2: 'A2', 3: 'B1', 4: 'B2', 5: 'C1'}
        remedial_level = level_map.get(cefr_score, 'A1')
        should_proceed = cefr_score >= 3

        # Determine next URL
        next_step_map = {1: 2, 2: 3, 3: 4, 4: None}
        next_step = next_step_map.get(step_id)

        if should_proceed and next_step:
            next_url = f"/app/phase3/step/{next_step}"
        elif should_proceed and not next_step:
            next_url = "/app/phase4/step/1"
        else:
            next_url = f"/app/phase3/step/{step_id}/remedial/{remedial_level.lower()}/task/a"

        # TERMINAL OUTPUT
        print("\n" + "="*60)
        print(f"PHASE 3 STEP {step_id} - SCORING RESULTS")
        print("="*60)
        print(f"User ID: {user_id}")
        print(f"I1={interaction1_score}, I2={interaction2_score}, I3={interaction3_score}")
        print(f"Total: {total_score}, CEFR Score: {cefr_score}, Level: {remedial_level}")
        print(f"PROCEED: {'YES' if should_proceed else 'NO - Remedial Required'}")
        print("="*60 + "\n")

        logger.info(f"Phase 3 Step {step_id} - User {user_id}: I1={interaction1_score}, I2={interaction2_score}, I3={interaction3_score}, Total={total_score}, Level={remedial_level}, Proceed={should_proceed}")

        # Save to DB
        save_phase3_progress(
            user_id, step=step_id, interaction=None, context='main',
            score=total_score, item_id=f'step{step_id}_score', item_type='score',
            prompt=f'Phase 3 Step {step_id} Score', answer=json.dumps({'i1': interaction1_score, 'i2': interaction2_score, 'i3': interaction3_score}),
            is_correct=should_proceed
        )

        # Max scores depend on step
        if step_id <= 3:
            i1_max, i2_max, i3_max, total_max = 8, 8, 5, 21
        else:
            i1_max, i2_max, i3_max, total_max = 5, 5, 0, 10

        return {
            'success': True,
            'data': {
                'interaction1': {'score': interaction1_score, 'max_score': i1_max},
                'interaction2': {'score': interaction2_score, 'max_score': i2_max, 'level': level_map.get(interaction2_score, 'A1') if step_id > 3 else None},
                'interaction3': {'score': interaction3_score, 'max_score': i3_max, 'level': level_map.get(interaction3_score, 'A1') if step_id <= 3 else None},
                'total': {
                    'score': total_score,
                    'max_score': total_max,
                    'remedial_level': remedial_level,
                    'should_proceed': should_proceed,
                    'next_url': next_url
                }
            }
        }

    except Exception as e:
        logger.error(f"Error calculating Phase 3 Step {step_id} score: {e}")
        return JSONResponse(
            status_code=500,
            content={'success': False, 'error': str(e)}
        )


@router.post('/remedial/log')
async def log_remedial_task(request: Request, user: dict = Depends(get_current_user)):
    """
    Log remedial task completion for Phase 3
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
        print(f"PHASE 3 REMEDIAL - LEVEL {level} - TASK {task}")
        print("="*60)
        print(f"User ID: {user_id}")
        print(f"Score: {score}/{max_score} points")
        print(f"Time Taken: {time_taken} seconds")
        print(f"Success Rate: {(score/max_score)*100:.1f}%" if max_score > 0 else "N/A")
        print("="*60 + "\n")

        logger.info(f"Phase 3 Remedial {level} Task {task} - User {user_id}: Score={score}/{max_score}, Time={time_taken}s")

        # Save to DB
        save_phase3_progress(
            user_id, step=0, interaction=None, context=f'remedial_{level.lower()}',
            score=score, item_id=f'remedial_{level}_{task}', item_type='remedial',
            prompt=f'Phase 3 Remedial {level} Task {task}',
            answer=json.dumps({'score': score, 'max_score': max_score, 'time_taken': time_taken}),
            is_correct=score >= (max_score * 0.6) if max_score > 0 else None
        )

        return {
            'success': True,
            'message': 'Remedial task logged successfully'
        }

    except Exception as e:
        logger.error(f"Error logging Phase 3 remedial task: {e}")
        return JSONResponse(
            status_code=500,
            content={'success': False, 'error': str(e)}
        )


@router.post('/interaction/log')
async def log_interaction(request: Request, user: dict = Depends(get_current_user)):
    """
    Log interaction completion for Phase 3
    """
    try:
        user_id = user["user_id"]
        data = await request.json()

        step = data.get('step', 0)
        interaction = data.get('interaction', 0)
        score = data.get('score', 0)
        max_score = data.get('max_score', 0)
        time_taken = data.get('time_taken', 0)
        completed = data.get('completed', False)

        # TERMINAL OUTPUT - Detailed logging
        print("\n" + "="*60)
        print(f"PHASE 3 STEP {step} - INTERACTION {interaction}")
        print("="*60)
        print(f"User ID: {user_id}")
        print(f"Score: {score}/{max_score} points")
        print(f"Time Taken: {time_taken} seconds")
        print(f"Completed: {completed}")
        print(f"Success Rate: {(score/max_score)*100:.1f}%" if max_score > 0 else "N/A")
        print("="*60 + "\n")

        logger.info(f"Phase 3 Step {step} Interaction {interaction} - User {user_id}: Score={score}/{max_score}, Time={time_taken}s")

        # Save to DB
        save_phase3_progress(
            user_id, step=step, interaction=interaction, context='main',
            score=score, item_id=f'step{step}_i{interaction}', item_type='interaction',
            prompt=f'Phase 3 Step {step} Interaction {interaction}',
            answer=json.dumps({'score': score, 'max_score': max_score, 'time_taken': time_taken}),
            is_correct=completed
        )

        return {
            'success': True,
            'message': 'Interaction logged successfully'
        }

    except Exception as e:
        logger.error(f"Error logging Phase 3 interaction: {e}")
        return JSONResponse(
            status_code=500,
            content={'success': False, 'error': str(e)}
        )


@router.post('/interaction/{interaction_id}/submit')
async def submit_interaction(interaction_id: int, request: Request, user: dict = Depends(get_current_user)):
    """
    Submit interaction response for AI assessment
    """
    try:
        user_id = user["user_id"]
        data = await request.json()

        user_response = data.get('response', '')
        interaction_type = data.get('type', 'unknown')

        logger.info(f"Phase 3 Interaction {interaction_id} from user {user_id}: {interaction_type}")

        # TODO: Implement AI assessment using services/ai_service.py
        # For now, return mock assessment

        assessment = {
            'score': 3,  # Mock B1 level
            'level': 'B1',
            'feedback': 'Good use of financial vocabulary!'
        }

        # Save to DB
        save_phase3_progress(
            user_id, step=0, interaction=interaction_id, context='main',
            score=assessment['score'], item_id=f'interaction_{interaction_id}', item_type=interaction_type,
            prompt=f'Phase 3 Interaction {interaction_id}', answer=user_response,
        )

        return {
            'success': True,
            'assessment': assessment
        }

    except Exception as e:
        logger.error(f"Error submitting Phase 3 interaction {interaction_id}: {e}")
        return JSONResponse(
            status_code=500,
            content={'success': False, 'error': str(e)}
        )


@router.post('/remedial/evaluate')
async def evaluate_remedial_answers(request: Request, user: dict = Depends(get_current_user)):
    """
    Evaluate remedial task answers using LLM
    Returns individual feedback and scores for each answer
    """
    try:
        user_id = user["user_id"]
        data = await request.json()

        level = data.get('level', 'A2')
        task = data.get('task', 'A')
        answers = data.get('answers', {})
        prompts = data.get('prompts', {})

        logger.info(f"Evaluating Phase 3 Remedial {level} Task {task} for user {user_id}")

        # Initialize AI service
        ai_service = AIService()

        # Evaluation results
        evaluations = []
        total_score = 0

        # Evaluate each answer
        for answer_id, answer_text in answers.items():
            if not answer_text or len(answer_text.strip()) < 5:
                evaluations.append({
                    'id': answer_id,
                    'score': 0,
                    'feedback': 'Answer too short or empty.',
                    'evaluation': 'Please provide a more complete answer.'
                })
                continue

            # Get the original prompt/sentence for context
            original_prompt = prompts.get(str(answer_id), "Complete the sentence")

            # Create evaluation prompt
            prompt = f"""
You are evaluating a CEFR {level} level English language learning task.

Task: Complete the sentence using "because" to give a reason.

The sentence to complete: "{original_prompt}"

Student wrote: "{answer_text}"

Evaluate this answer based on:
1. Does it provide a logical reason? (grammar doesn't need to be perfect)
2. Is the meaning clear and makes sense?
3. Is it appropriate for {level} level?

Respond ONLY with a JSON object in this exact format:
{{
  "score": 1 or 0 (1 if the answer provides a reasonable explanation, 0 if it doesn't),
  "feedback": "Brief encouraging feedback (1-2 sentences)",
  "evaluation": "Brief explanation of why you gave this score"
}}
"""

            try:
                # Get AI evaluation
                response = ai_service.get_ai_response(prompt)

                # Extract JSON from response (in case there's extra text)
                json_match = re.search(r'\{.*\}', response, re.DOTALL)
                if json_match:
                    evaluation = json.loads(json_match.group())
                    score = int(evaluation.get('score', 0))
                    feedback = evaluation.get('feedback', 'Good effort!')
                    eval_text = evaluation.get('evaluation', '')
                else:
                    # Fallback if JSON parsing fails
                    score = 1 if len(answer_text.strip()) > 10 else 0
                    feedback = "Your answer has been recorded."
                    eval_text = "Unable to parse detailed evaluation."

                total_score += score

                evaluations.append({
                    'id': answer_id,
                    'score': score,
                    'feedback': feedback,
                    'evaluation': eval_text
                })

            except Exception as e:
                logger.error(f"Error evaluating answer {answer_id}: {e}")
                # Fallback scoring
                score = 1 if len(answer_text.strip()) > 10 else 0
                total_score += score
                evaluations.append({
                    'id': answer_id,
                    'score': score,
                    'feedback': 'Your answer has been recorded.',
                    'evaluation': 'Evaluation completed.'
                })

        # Terminal output
        print("\n" + "="*60)
        print(f"PHASE 3 REMEDIAL EVALUATION - LEVEL {level} - TASK {task}")
        print("="*60)
        print(f"User ID: {user_id}")
        print(f"Total Score: {total_score}/{len(answers)}")
        for eval_result in evaluations:
            print(f"\nAnswer {eval_result['id']}: {eval_result['score']}/1")
            print(f"  Feedback: {eval_result['feedback']}")
        print("="*60 + "\n")

        # Save evaluations to DB
        save_phase3_progress(
            user_id, step=0, interaction=None, context=f'remedial_{level.lower()}',
            score=total_score, item_id=f'remedial_eval_{level}_{task}', item_type='remedial_eval',
            prompt=f'Phase 3 Remedial {level} Task {task} Evaluation',
            answer=json.dumps({'evaluations': evaluations, 'total_score': total_score, 'max_score': len(answers)}),
            is_correct=total_score >= (len(answers) * 0.6) if len(answers) > 0 else None
        )

        return {
            'success': True,
            'evaluations': evaluations,
            'total_score': total_score,
            'max_score': len(answers)
        }

    except Exception as e:
        logger.error(f"Error evaluating remedial answers: {e}")
        return JSONResponse(
            status_code=500,
            content={'success': False, 'error': str(e)}
        )


@router.post('/step4/evaluate-budget')
async def evaluate_budget(request: Request, user: dict = Depends(get_current_user)):
    """
    Evaluate Step 4 Interaction 1: Budget Creation
    """
    try:
        user_id = user["user_id"]
        data = await request.json()

        cost_items = data.get('costItems', [])
        funding_sources = data.get('fundingSources', [])
        justification = data.get('justification', '')

        logger.info(f"Phase 3 Step 4 Budget from user {user_id}: {len(cost_items)} costs, {len(funding_sources)} funding sources")

        # Simple fallback evaluation (frontend has detailed evaluation)
        score = min(len(cost_items), 3) + (1 if len(funding_sources) >= 1 else 0) + (1 if len(justification) > 20 else 0)
        score = min(score, 5)

        level_map = {1: 'A1', 2: 'A2', 3: 'B1', 4: 'B2', 5: 'C1'}
        level = level_map.get(score, 'A1')

        # Save to DB
        save_phase3_progress(
            user_id, step=4, interaction=1, context='main',
            score=score, item_id='step4_budget', item_type='budget',
            prompt='Budget Creation', answer=json.dumps({'cost_items': cost_items, 'funding_sources': funding_sources}),
        )

        return {
            'success': True,
            'score': score,
            'level': level,
            'feedback': f'Budget evaluation complete at {level} level.'
        }

    except Exception as e:
        logger.error(f"Error evaluating budget: {e}")
        return JSONResponse(
            status_code=500,
            content={'success': False, 'error': str(e)}
        )


@router.post('/step4/evaluate-pitch')
async def evaluate_pitch(request: Request, user: dict = Depends(get_current_user)):
    """
    Evaluate Step 4 Interaction 2: Sponsor Pitch
    """
    try:
        user_id = user["user_id"]
        data = await request.json()

        pitch = data.get('pitch', '')
        sponsor = data.get('sponsor', '')

        logger.info(f"Phase 3 Step 4 Pitch from user {user_id} for sponsor {sponsor}: {len(pitch)} chars")

        # Simple fallback evaluation (frontend has detailed evaluation)
        word_count = len(pitch.split())
        score = 1
        if word_count >= 25:
            score = 2
        if word_count >= 40:
            score = 3
        if 'visibility' in pitch.lower() or 'brand' in pitch.lower():
            score += 1
        score = min(score, 5)

        level_map = {1: 'A1', 2: 'A2', 3: 'B1', 4: 'B2', 5: 'C1'}
        level = level_map.get(score, 'A1')

        # Save to DB
        save_phase3_progress(
            user_id, step=4, interaction=2, context='main',
            score=score, item_id='step4_pitch', item_type='pitch',
            prompt=f'Sponsor Pitch - {sponsor}', answer=pitch,
        )

        return {
            'success': True,
            'score': score,
            'level': level,
            'feedback': f'Sponsor pitch evaluation complete at {level} level.'
        }

    except Exception as e:
        logger.error(f"Error evaluating pitch: {e}")
        return JSONResponse(
            status_code=500,
            content={'success': False, 'error': str(e)}
        )
