"""
Evaluation routes - FastAPI migration of routes/evaluation_routes.py
AI-powered evaluation endpoints for Phase 2 writing tasks.
Preserves exact response shapes expected by the frontend.
"""
import json
import logging
from fastapi import APIRouter, Request
from services.ai_service import AIService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["evaluation"])

# Initialize AI service
ai_service = AIService()


def normalize_text(text):
    """Normalize text for comparison"""
    if not text:
        return ""
    return text.lower().strip().replace(".", "").replace(",", "").replace("!", "").replace("?", "")


def evaluate_locally(response_text, context, task_type):
    """
    Local fallback evaluation when AI is unavailable
    """
    if not response_text:
        return {
            'is_correct': False,
            'score': 0,
            'feedback': 'No response provided.',
            'suggestions': ['Please write your response.']
        }

    word_count = len(response_text.split())
    char_count = len(response_text)

    # Basic scoring
    score = 50

    # Word count scoring
    if word_count >= 20:
        score += 20
    elif word_count >= 10:
        score += 10

    # Character count scoring
    if char_count >= 100:
        score += 15
    elif char_count >= 50:
        score += 10

    # Check for basic sentence structure
    if response_text.endswith('.') or response_text.endswith('!') or response_text.endswith('?'):
        score += 5

    # Check capitalization
    if response_text[0].isupper():
        score += 5

    # Cap at 100
    score = min(100, score)

    # Generate feedback
    if score >= 80:
        feedback = "Great job! Your response is well-written."
        suggestions = []
    elif score >= 60:
        feedback = "Good effort! You're on the right track."
        suggestions = ["Try adding more detail to your response."]
    else:
        feedback = "Keep practicing! Your response needs more detail."
        suggestions = ["Add more sentences to fully address the task."]

    # Determine level
    if word_count >= 30 and score >= 80:
        level = "B2"
    elif word_count >= 20 and score >= 60:
        level = "B1"
    elif word_count >= 10:
        level = "A2"
    else:
        level = "A1"

    return {
        'is_correct': score >= 50,
        'score': score,
        'feedback': feedback,
        'suggestions': suggestions,
        'detected_level': level
    }


@router.post('/evaluate-writing')
async def evaluate_writing(request: Request):
    """
    Evaluate a writing response using AI

    Request body:
    {
        "response": "The student's written response",
        "prompt": "The evaluation prompt from the exercise config",
        "context": "Additional context (template, instruction, etc.)",
        "task_type": "The type of task (writing, sentence_expansion, etc.)"
    }

    Returns:
    {
        "is_correct": bool,
        "score": 0-100,
        "feedback": "AI-generated feedback",
        "suggestions": ["improvement suggestions"],
        "detected_level": "A1/A2/B1/B2"
    }
    """
    try:
        data = await request.json()
        response_text = data.get('response', '').strip()
        eval_prompt = data.get('prompt', '')
        context = data.get('context', '')
        task_type = data.get('task_type', 'writing')

        if not response_text:
            return {
                'is_correct': False,
                'score': 0,
                'feedback': 'No response provided.',
                'suggestions': ['Please write your response.']
            }

        # For very short responses, don't use AI
        if len(response_text) < 10:
            return {
                'is_correct': False,
                'score': 20,
                'feedback': 'Your response is too short.',
                'suggestions': ['Please provide a more detailed response.']
            }

        # Build AI evaluation prompt
        system_prompt = """You are a CEFR language assessment expert evaluating student responses.
Evaluate the response based on:
1. Task completion - Did they address what was asked?
2. Language accuracy - Grammar, vocabulary, spelling
3. Coherence - Is the response clear and logical?
4. CEFR level appropriateness

Respond in JSON format:
{
    "is_correct": true/false,
    "score": 0-100,
    "feedback": "brief encouraging feedback",
    "suggestions": ["specific improvement suggestion"],
    "detected_level": "A1/A2/B1/B2"
}"""

        user_prompt = f"""
Task Type: {task_type}
Context/Instructions: {context}
Evaluation Criteria: {eval_prompt}

Student Response:
"{response_text}"

Evaluate this response and provide JSON feedback.
"""

        # Try to get AI evaluation
        if ai_service.client:
            try:
                ai_response = ai_service.client.chat.completions.create(
                    model=ai_service.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    max_tokens=500,
                    temperature=0.3
                )

                result_text = ai_response.choices[0].message.content

                # Parse JSON from response
                try:
                    # Handle markdown code blocks
                    if '```json' in result_text:
                        result_text = result_text.split('```json')[1].split('```')[0]
                    elif '```' in result_text:
                        result_text = result_text.split('```')[1].split('```')[0]

                    result = json.loads(result_text)
                    return result
                except json.JSONDecodeError:
                    # Fallback if JSON parsing fails
                    pass

            except Exception as e:
                logger.error(f"AI evaluation error: {str(e)}")

        # Fallback local evaluation
        return evaluate_locally(response_text, context, task_type)

    except Exception as e:
        logger.error(f"Evaluation route error: {str(e)}")
        return {
            'is_correct': True,
            'score': 70,
            'feedback': 'Response recorded.',
            'suggestions': []
        }


@router.post('/evaluate-batch')
async def evaluate_batch(request: Request):
    """
    Evaluate multiple responses in batch
    """
    try:
        data = await request.json()
        responses = data.get('responses', [])

        results = []
        for resp in responses:
            result = evaluate_locally(
                resp.get('response', ''),
                resp.get('context', ''),
                resp.get('task_type', 'writing')
            )
            results.append(result)

        return results

    except Exception as e:
        logger.error(f"Batch evaluation error: {str(e)}")
        return []


@router.post('/validate-gap-fill')
async def validate_gap_fill(request: Request):
    """
    Validate a gap-fill answer
    """
    try:
        data = await request.json()
        user_answer = normalize_text(data.get('user_answer', ''))
        correct_answer = normalize_text(data.get('correct_answer', ''))
        context = data.get('context', '')

        if not user_answer:
            return {
                'is_correct': False,
                'is_acceptable': False,
                'feedback': 'Please provide an answer.'
            }

        # Exact match
        if user_answer == correct_answer:
            return {
                'is_correct': True,
                'is_acceptable': True,
                'feedback': 'Correct!'
            }

        # Partial match - check keywords
        correct_words = set(correct_answer.split())
        user_words = set(user_answer.split())
        common_words = correct_words.intersection(user_words)

        if len(common_words) >= len(correct_words) * 0.8:
            return {
                'is_correct': True,
                'is_acceptable': True,
                'feedback': 'Good answer!'
            }
        elif len(common_words) >= len(correct_words) * 0.5:
            return {
                'is_correct': False,
                'is_acceptable': True,
                'feedback': 'Close, but not quite.'
            }
        else:
            return {
                'is_correct': False,
                'is_acceptable': False,
                'feedback': 'Try again.'
            }

    except Exception as e:
        logger.error(f"Gap-fill validation error: {str(e)}")
        return {
            'is_correct': False,
            'is_acceptable': False,
            'feedback': 'Validation error.'
        }


@router.post('/get-writing-hint')
async def get_writing_hint(request: Request):
    """
    Get AI-generated hint for writing tasks
    """
    try:
        data = await request.json()
        template = data.get('template', '')
        instruction = data.get('instruction', '')
        current_text = data.get('current_text', '')

        # Simple hint generation
        if not current_text:
            hint = f"Start with the key information from the template."
        elif len(current_text) < 20:
            hint = "Try to include more details in your response."
        else:
            hint = "Good progress! Make sure to complete your thought."

        # Try AI-generated hint
        if ai_service.client and template:
            try:
                prompt = f"""
Template: {template}
Instruction: {instruction}
Current text: {current_text}

Provide a brief, encouraging hint (1 sentence) to help complete this writing task.
"""
                ai_response = ai_service.client.chat.completions.create(
                    model=ai_service.model,
                    messages=[
                        {"role": "system", "content": "You are a helpful language learning assistant. Provide brief, encouraging hints."},
                        {"role": "user", "content": prompt}
                    ],
                    max_tokens=100,
                    temperature=0.7
                )
                hint = ai_response.choices[0].message.content.strip()
            except Exception as e:
                logger.error(f"Hint generation error: {str(e)}")

        return {
            'hint': hint,
            'example_start': ''
        }

    except Exception as e:
        logger.error(f"Get hint error: {str(e)}")
        return {
            'hint': 'Try to complete the template with relevant details.',
            'example_start': ''
        }


@router.post('/evaluate/sentence')
async def evaluate_sentence(request: Request):
    """
    Evaluate a sentence and determine CEFR level (A1-C1)
    Compares against example sentences for each level

    Request body:
    {
        "sentence": "User's sentence",
        "targetWord": "The word that should be used",
        "exampleSentences": {
            "A1": "Example A1 sentence",
            "A2": "Example A2 sentence",
            ...
        }
    }

    Returns:
    {
        "success": true,
        "evaluation": {
            "level": "B1",
            "score": 3,
            "feedback": "AI feedback"
        }
    }
    """
    try:
        data = await request.json()
        sentence = data.get('sentence', '').strip()
        target_word = data.get('targetWord', 'slogan')
        example_sentences = data.get('exampleSentences', {})

        if not sentence:
            return {
                'success': False,
                'error': 'Please provide a sentence.'
            }

        # Check if target word is used
        if target_word.lower() not in sentence.lower():
            return {
                'success': False,
                'error': f'Your sentence must include the word "{target_word}".'
            }

        # Use AI to evaluate if available
        if ai_service.client:
            try:
                system_prompt = """You are a CEFR language level expert. Evaluate the student's sentence and determine which CEFR level it matches (A1, A2, B1, B2, or C1).

Compare their sentence against the example sentences for each level:
- A1: Very simple, basic vocabulary, short (e.g., "Slogan good.")
- A2: Simple sentences, basic grammar (e.g., "The poster has slogan.")
- B1: More complex, explains purpose/reason (e.g., "We need a catchy slogan for the poster to attract students.")
- B2: Advanced vocabulary, persuasive language (e.g., "A strong slogan like 'Discover Global Cultures!' would make the poster more eye-catching and memorable.")
- C1: Sophisticated language, nuanced expression (e.g., "An effective slogan, such as 'Unite in Diversity: Experience the World,' would encapsulate the festival's ethos...")

IMPORTANT: Do NOT mention the CEFR level (A1, A2, B1, B2, C1) in the feedback. Only provide encouraging comments about the sentence quality.

Respond ONLY in JSON format:
{
    "level": "A1/A2/B1/B2/C1",
    "feedback": "Brief encouraging feedback about the sentence quality WITHOUT mentioning the level"
}"""

                user_prompt = f"""
Target Word: {target_word}

Example Sentences:
A1: {example_sentences.get('A1', '')}
A2: {example_sentences.get('A2', '')}
B1: {example_sentences.get('B1', '')}
B2: {example_sentences.get('B2', '')}
C1: {example_sentences.get('C1', '')}

Student's Sentence:
"{sentence}"

Evaluate this sentence and assign a CEFR level. Consider:
1. Complexity of sentence structure
2. Vocabulary range and appropriateness
3. Grammar accuracy
4. How well it explains the use of the word

Return ONLY valid JSON."""

                ai_response = ai_service.client.chat.completions.create(
                    model=ai_service.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    max_tokens=300,
                    temperature=0.3
                )

                result_text = ai_response.choices[0].message.content.strip()

                # Parse JSON
                if '```json' in result_text:
                    result_text = result_text.split('```json')[1].split('```')[0]
                elif '```' in result_text:
                    result_text = result_text.split('```')[1].split('```')[0]

                result = json.loads(result_text.strip())
                level = result.get('level', 'A2')

                # Assign score based on level
                score_map = {'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4, 'C1': 5}
                score = score_map.get(level, 2)

                return {
                    'success': True,
                    'evaluation': {
                        'level': level,
                        'score': score,
                        'feedback': result.get('feedback', 'Good effort!')
                    }
                }

            except Exception as e:
                logger.error(f"AI sentence evaluation error: {str(e)}")
                # Fall through to local evaluation

        # Fallback: Simple local evaluation
        word_count = len(sentence.split())
        has_punctuation = sentence.strip()[-1] in '.!?'
        starts_capital = sentence[0].isupper()

        # Simple heuristics
        if word_count <= 3 and not has_punctuation:
            level = 'A1'
        elif word_count <= 6 and has_punctuation and starts_capital:
            level = 'A2'
        elif word_count <= 12:
            level = 'B1'
        elif word_count <= 20:
            level = 'B2'
        else:
            level = 'C1'

        score_map = {'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4, 'C1': 5}
        score = score_map.get(level, 2)

        # Generate feedback without mentioning level
        feedback_messages = {
            'A1': 'Your sentence is simple and clear. Good start with basic vocabulary!',
            'A2': 'Good sentence structure! You used the word correctly in a complete sentence.',
            'B1': 'Well done! Your sentence explains the concept clearly with good detail.',
            'B2': 'Excellent work! Your sentence shows strong vocabulary and persuasive language.',
            'C1': 'Outstanding! Your sentence demonstrates sophisticated language and nuanced expression.'
        }

        return {
            'success': True,
            'evaluation': {
                'level': level,
                'score': score,
                'feedback': feedback_messages.get(level, 'Good work!')
            }
        }

    except Exception as e:
        logger.error(f"Sentence evaluation error: {str(e)}")
        return {
            'success': False,
            'error': 'An error occurred during evaluation.'
        }


@router.post('/evaluate-expansion')
async def evaluate_expansion(request: Request):
    """
    Evaluate a sentence expansion using AI
    Returns 1 (valid) or 0 (invalid) based on:
    - Must include connector ("because" or "and")
    - Logical addition of meaningful content
    - Should include promotional vocabulary (poster, video, etc.)

    Request body:
    {
        "prompt": "Make poster",
        "expansion": "Make poster because eye-catcher",
        "example": "Make poster because eye-catcher"
    }

    Returns:
    {
        "isValid": 1 or 0,
        "feedback": "AI feedback message"
    }
    """
    try:
        data = await request.json()
        prompt = data.get('prompt', '').strip()
        expansion = data.get('expansion', '').strip()
        example = data.get('example', '')

        if not expansion:
            return {
                'isValid': 0,
                'feedback': 'Please write your expansion.'
            }

        # Basic checks first
        expansion_lower = expansion.lower()
        has_connector = 'because' in expansion_lower or ' and ' in expansion_lower

        if not has_connector:
            return {
                'isValid': 0,
                'feedback': 'Please use "because" or "and" to connect your ideas.'
            }

        # Use AI to evaluate quality
        if ai_service.client:
            try:
                system_prompt = """You are a CEFR A2-level language evaluator for sentence expansion exercises.

Evaluate if the student's expansion is valid based on:
1. Uses connector "because" or "and" correctly
2. Adds logical, meaningful content (not just random words)
3. Makes grammatical sense
4. Stays relevant to promotional/marketing context

IMPORTANT: Be flexible with grammar at A2 level. Accept expansions that show effort even if not perfect.
Examples of VALID expansions:
- "Make poster because eye-catcher" (simple but logical)
- "Create video and feature cultures" (good expansion)
- "Video with music because fun" (acceptable at A2 level)

Examples of INVALID expansions:
- "Make poster because and" (no real content added)
- "Create video and xyz random" (nonsensical)
- "Billboard because poster because" (incoherent)

IMPORTANT: In your feedback, DO NOT mention specific examples. Just provide general guidance like:
- "Try to add more meaningful content related to promotional/marketing."
- "Please connect your ideas more logically."
- "Make sure your expansion makes sense in the marketing context."

Respond ONLY in JSON format:
{
    "isValid": 1 or 0,
    "feedback": "Brief encouraging feedback (1 sentence, NO specific examples)"
}"""

                user_prompt = f"""
Original prompt: "{prompt}"
Example expansion: "{example}"
Student's expansion: "{expansion}"

Is this expansion valid? Remember to be flexible for A2 level students.
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
                    'isValid': result.get('isValid', 1),
                    'feedback': result.get('feedback', 'Good expansion!')
                }

            except Exception as e:
                logger.error(f"AI expansion evaluation error: {str(e)}")
                # Fall through to local evaluation

        # Fallback: Local evaluation
        # If has connector and is longer than prompt, accept it
        prompt_words = len(prompt.split())
        expansion_words = len(expansion.split())

        if expansion_words > prompt_words + 1:
            return {
                'isValid': 1,
                'feedback': 'Good expansion! You added meaningful content.'
            }
        else:
            return {
                'isValid': 0,
                'feedback': 'Please add more detail to expand the sentence.'
            }

    except Exception as e:
        logger.error(f"Expansion evaluation error: {str(e)}")
        return {
            'isValid': 1,  # Accept by default if error
            'feedback': 'Expansion recorded.'
        }
