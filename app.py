from flask import Flask, render_template, request, redirect, url_for, session, jsonify, flash
import os
from dotenv import load_dotenv
import groq
import json
import logging
import random
from datetime import datetime
import asyncio
import edge_tts
from flask_session import Session
import re
import math
from collections import Counter


load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__, static_folder='static')
app.config['SECRET_KEY'] = os.getenv("SECRET_KEY", "dev-secret-key")
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_FILE_DIR'] = os.path.join(os.path.dirname(__file__), 'sessions')
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True
os.makedirs('sessions', exist_ok=True)
Session(app)

GROQ_API_KEY = os.getenv("f")
client = groq.Client(api_key=GROQ_API_KEY)

SAPLING_API_KEY = os.getenv("SAPLING_API_KEY")
SAPLING_API_URL = "https://api.sapling.ai/api/v1/aidetect"

MODEL = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")
MAX_TOKENS = 10000
TEMPERATURE = 0.7


POINTS_PER_LEVEL = {"A1": 1, "A2": 2, "B1": 3, "B2": 4, "C1": 5}
ACHIEVEMENTS = {
    "quick_thinker": {"name": "Quick Thinker", "description": "Completed the assessment in under 5 minutes"},
    "consistent_performer": {"name": "Consistent Performer", "description": "Achieved the same level across all questions"},
    "vocabulary_master": {"name": "Vocabulary Master", "description": "Used advanced vocabulary in responses"},
    "grammar_expert": {"name": "Grammar Expert", "description": "Showed excellent grammar skills"},
    "communicator": {"name": "Master Communicator", "description": "Excelled in the social interaction tasks"}
}

CEFR_LEVELS = {
    "A1": "Beginner - Can understand and use familiar everyday expressions and very basic phrases.",
    "A2": "Elementary - Can communicate in simple and routine tasks requiring a simple and direct exchange of information.",
    "B1": "Intermediate - Can deal with most situations likely to arise while traveling in an area where the language is spoken.",
    "B2": "Upper Intermediate - Can interact with a degree of fluency and spontaneity that makes regular interaction with native speakers quite possible.",
    "C1": "Advanced - Can express ideas fluently and spontaneously without much obvious searching for expressions.",
}

NPCS = {
    "Ms. Mabrouki": {
        "role": "Event Coordinator",
        "description": "Facilitates discussions, provides guidance.",
        "personality": "Organized, encouraging, and detail-oriented",
        "avatar": "mabrouki.svg",
        "background": "Has coordinated over 20 cultural events across Tunisia"
    },
    "SKANDER": {
        "role": "Student Council President",
        "description": "Engages players in team activities.",
        "personality": "Charismatic, energetic, and visionary",
        "avatar": "skander.svg",
        "background": "Third-year politics student with a passion for cultural heritage"
    },
    "Emna": {
        "role": "Committee Member",
        "description": "Manages finances and logistics",
        "personality": "Practical, precise, and reliable",
        "avatar": "emna.svg",
        "background": "Business student who has worked on several community projects"
    },
    "Ryan": {
        "role": "Committee Member",
        "description": "Coordinates social media and outreach",
        "personality": "Creative, tech-savvy, and social",
        "avatar": "ryan.svg",
        "background": "Communications major with experience in digital marketing"
    },
    "Lilia": {
        "role": "Committee Member",
        "description": "Handles artistic direction and cultural authenticity",
        "personality": "Artistic, thoughtful, and passionate about tradition",
        "avatar": "lilia.svg",
        "background": "Art history student and part-time tour guide at a local museum"
    }
}

BADGES = {
    "A1": {"name": "Newcomer", "icon": "newcomer.jpg", "description": "You've taken your first steps!"},
    "A2": {"name": "Explorer", "icon": "badge-a2.png", "description": "You're finding your way around."},
    "B1": {"name": "Adventurer", "icon": "badge-b1.png", "description": "You can navigate most situations."},
    "B2": {"name": "Navigator", "icon": "badge-b2.png", "description": "You communicate with confidence."},
    "C1": {"name": "Ambassador", "icon": "badge-c1.png", "description": "You express yourself with sophistication."},
}

PROGRESS_LEVELS = [
    {"name": "Orientation", "description": "Meet the team and get acquainted", "icon": "orientation.png"},
    {"name": "Planning", "description": "Contribute to event planning discussions",
        "icon": "planning.png", "required_level": "A2"},
    {"name": "Coordination", "description": "Coordinate with other team members",
        "icon": "coordination.png", "required_level": "B1"},
    {"name": "Execution", "description": "Help execute the cultural event", "icon": "execution.png", "required_level": "B2"},
    {"name": "Leadership", "description": "Take on leadership responsibilities",
        "icon": "leadership.png", "required_level": "C1"}
]

DIALOGUE_QUESTIONS = [
    {
        "step": 1,
        "speaker": "Ms. Mabrouki",
        "question": "Welcome to the Cultural Event Planning Committee! I'm Ms. Mabrouki, the Event Coordinator. We're excited to have you onboard. Before we start, let's get to know you better and see how you can contribute to our event. Can you introduce yourself?",
        "type": "introduction",
        "skill": "self-expression",
        "xp_reward": 10,
        "scene": "meeting_room",
        "assessment_criteria": {
            "vocabulary_range": 0.3,
            "grammar_accuracy": 0.2,
            "fluency": 0.3,
            "relevance": 0.2
        },
        "example_responses": {
            "A1": "I am [Name]. I am happy to be here.",
            "A2": "Hi, I am [Name]. I like events, and I want to help.",
            "B1": "Hi, I'm [Name]. I have participated in student events before, and I am excited to join.",
            "B2": "Good morning, I'm [Name]. I have experience in event planning and I'm eager to contribute.",
            "C1": "I'm [Player]. I'm eager to contribute to the committee as I have a deep appreciation for cultural diversity and teamwork."
        }
    },
    {
        "step": 2,
        "speaker": "Ms. Mabrouki",
        "question": "Can you tell me why you want to join the committee?",
        "type": "motivation",
        "skill": "reasoning",
        "xp_reward": 15,
        "scene": "meeting_room",
        "assessment_criteria": {
            "vocabulary_range": 0.2,
            "grammar_accuracy": 0.2,
            "reasoning_depth": 0.4,
            "coherence": 0.2
        },
        "example_responses": {
            "A1": "I like events.",
            "A2": "I want to join because I like culture.",
            "B1": "I'd like to help with the event because I enjoy working with people.",
            "B2": "I'm interested in joining because I'm passionate about cultural traditions.",
            "C1": "I'm eager to contribute to the committee as I have a deep appreciation for cultural diversity and teamwork."
        }
    },
    {
        "step": 3,
        "speaker": "Ms. Mabrouki",
        "question": "What do you know about Tunisian culture?",
        "type": "cultural_knowledge",
        "skill": "world_knowledge",
        "xp_reward": 20,
        "scene": "meeting_room",
        "assessment_criteria": {
            "vocabulary_range": 0.2,
            "factual_accuracy": 0.4,
            "elaboration": 0.2,
            "cultural_sensitivity": 0.2
        },
        "example_responses": {
            "A1": "It is nice. They have food.",
            "A2": "Tunisian culture has good food and music.",
            "B1": "I know Tunisia has traditional dances and tasty dishes like couscous.",
            "B2": "Tunisian culture is rich with history, like Carthage, and famous for its music and cuisine.",
            "C1": "Tunisian culture is a vibrant blend of Arab, Berber, and Mediterranean influences, seen in its architecture and festivals."
        }
    },
    {
        "step": 4,
        "speaker": "SKANDER",
        "question": "Listen carefully and repeat exactly what I say: We could have a dance show or a food tasting.",
        "type": "listening",
        "skill": "listening_comprehension",
        "xp_reward": 15,
        "scene": "meeting_room",
        "audio_cue": "skander_suggestion.mp3",
        "assessment_criteria": {
            "accuracy": 0.8,
            "grammar_accuracy": 0.1,
            "rephrasing_ability": 0.1
        },
        "expected_sentence": "We could have a dance show or a food tasting.",
        "example_responses": {
            "A1": "Dance... food.",
            "A2": "Dance show or food.",
            "B1": "We could have a dance show or food tasting.",
            "B2": "We could have a dance show or a food tasting.",
            "C1": "We could have a dance show or a food tasting."
        }
    }, {
        "step": 5,
        "speaker": "Ms. Mabrouki",
        "question": "Imagine we need a theme for the event. What idea do you have?",
        "type": "creativity",
        "skill": "ideation",
        "xp_reward": 25,
        "scene": "meeting_room",
        "assessment_criteria": {
            "originality": 0.4,
            "vocabulary_range": 0.2,
            "coherence": 0.2,
            "elaboration": 0.2
        },
        "example_responses": {
            "A1": "A party with food.",
            "A2": "Maybe a theme with Tunisian food and colors.",
            "B1": "I suggest a theme about Tunisian traditions, like a market.",
            "B2": "How about a 'Tunisian Heritage Night' with music, food stalls, and crafts?",
            "C1": "I propose a 'Journey Through Tunisian Heritage' theme with interactive exhibits and live performances."
        }
    },
    {
        "step": 6,
        "speaker": "Emna",
        "question": "Hi there! I'm Emna, one of the committee members.",
        "instruction": "Greet Emna and ask her a question about the event.",
        "type": "social_interaction",
        "skill": "conversation",
        "xp_reward": 20,
        "scene": "coffee_break",
        "assessment_criteria": {
            "politeness": 0.3,
            "question_formation": 0.3,
            "grammar_accuracy": 0.2,
            "appropriateness": 0.2
        },
        "example_responses": {
            "A1": "Hi. You like event?",
            "A2": "Hello, Emna. What you do for event?",
            "B1": "Hi, Emna! What are you planning for the event?",
            "B2": "Hello, Emna! Could you tell me what role you're taking in the event?",
            "C1": "Hi, Emna! I'm curious—what specific contributions are you planning for this event?"
        }
    },
    {
        "step": 7,
        "speaker": "Ms. Mabrouki",
        "question": "If a problem happens, like a delay, what would you do?",
        "type": "problem_solving",
        "skill": "strategic_thinking",
        "xp_reward": 30,
        "scene": "meeting_room",
        "scenario_image": "delay_scenario.jpg",
        "assessment_criteria": {
            "solution_quality": 0.4,
            "conditional_expressions": 0.2,
            "coherence": 0.2,
            "proactivity": 0.2
        },
        "example_responses": {
            "A1": "I tell someone.",
            "A2": "I tell Ms. Mabrouki about the problem.",
            "B1": "I'd inform you and try to find a solution quickly.",
            "B2": "I'd report it to you immediately and suggest moving another activity forward.",
            "C1": "I'd promptly notify you, assess the situation, and propose rescheduling to keep things on track."
        }
    },
    {
        "step": 8,
        "speaker": "Ryan",
        "question": "What skills do you think are important for this committee?",
        "type": "skills_discussion",
        "skill": "abstract_thinking",
        "xp_reward": 20,
        "scene": "brainstorming_area",
        "assessment_criteria": {
            "vocabulary_range": 0.3,
            "concept_development": 0.3,
            "reasoning": 0.2,
            "relevance": 0.2
        },
        "example_responses": {
            "A1": "Talk and work.",
            "A2": "Talking good and working with people.",
            "B1": "I think communication and teamwork are important.",
            "B2": "Skills like effective communication, organization, and collaboration are key.",
            "C1": "In my view, strong interpersonal skills, organization, and adaptability are essential."
        }
    },
    {
        "step": 9,
        "speaker": "Lilia",
        "question": "Can you write a one-sentence invitation to the event?",
        "type": "writing",
        "skill": "written_expression",
        "xp_reward": 25,
        "scene": "creative_corner",
        "assessment_criteria": {
            "grammar_accuracy": 0.25,
            "vocabulary_range": 0.25,
            "style_appropriateness": 0.25,
            "conciseness": 0.25
        },
        "example_responses": {
            "A1": "Come to party.",
            "A2": "Please come to our event with food.",
            "B1": "Join us for a fun cultural event this weekend!",
            "B2": "We invite you to celebrate Tunisian culture with us on Saturday!",
            "C1": "You're cordially invited to experience an unforgettable celebration of Tunisian heritage this Saturday."
        }
    }
]

ASSESSMENT_CRITERIA = {
    "vocabulary_range": {
        "description": "Tracks word complexity and variety",
        "A1": "Uses very basic vocabulary (e.g., 'nice', 'good', 'bad')",
        "A2": "Uses common, everyday vocabulary with some topic-specific words",
        "B1": "Uses sufficient vocabulary for familiar topics with some circumlocution",
        "B2": "Uses a broad vocabulary with good command of idiomatic expressions",
        "C1": "Uses sophisticated vocabulary precisely and appropriately (e.g., 'cordially', 'vibrant')"
    },
    "grammar_accuracy": {
        "description": "Evaluates structure, tenses, and connectors",
        "A1": "Uses very simple structures with frequent errors (e.g., 'I tell someone')",
        "A2": "Uses basic patterns correctly but still makes systematic errors",
        "B1": "Shows reasonable accuracy in familiar contexts, uses present/past/future",
        "B2": "Shows good grammatical control with occasional slips (e.g., conditional forms)",
        "C1": "Maintains consistent grammatical control of complex language (e.g., 'I'd propose rescheduling')"
    },
    "fluency_detail": {
        "description": "Assesses coherence, elaboration, and flow",
        "A1": "Uses single words or very short, isolated phrases",
        "A2": "Uses simple phrases connected with basic linkers ('and', 'but', 'because')",
        "B1": "Produces straightforward connected text on familiar topics",
        "B2": "Produces clear, detailed text with appropriate connectors",
        "C1": "Produces fluent, well-structured discourse with controlled use of organizational patterns"
    },
    "comprehension_relevance": {
        "description": "Ensures responses match the task",
        "A1": "Shows minimal understanding of the question",
        "A2": "Shows basic understanding but may miss details",
        "B1": "Shows good understanding of the main points",
        "B2": "Shows detailed understanding and responds appropriately",
        "C1": "Shows complete understanding and responds with nuance and sophistication"
    }
}

# This function already exists in your code, but let's ensure it's used properly
def is_ai_generated(text):
    """
    Check if the text is generated by AI using simple heuristics.
    In a production version, you would use an API like Sapling or a more robust model.
    
    Returns a tuple (is_generated_by_ai, score, details).
    """
    # For a real application, implement here the call to an API like Sapling
    
    # Don't analyze texts that are too short
    if len(text) < 50:
        return (False, 0, "Text too short for reliable detection")
    
    # Score initialization and indicators
    total_score = 0
    reasons = []
    
    # 1. Check length (AI responses tend to be long and elaborate)
    if len(text) > 500:
        total_score += 0.15
        reasons.append("Unusually long response")
    
    # 2. Check for typical AI phrasings
    ai_phrases = [
        "en tant que", "je suis heureux de", "je suis ravi de", "il est important de noter que",
        "il convient de souligner", "comme mentionné précédemment", "pour résumer", 
        "en conclusion", "je n'ai pas accès à", "je ne peux pas", "en effet,", "par conséquent,"
    ]
    
    phrases_found = sum(1 for phrase in ai_phrases if phrase.lower() in text.lower())
    if phrases_found >= 2:
        total_score += min(0.25 * phrases_found / 3, 0.25)  # Capped at 0.25
        reasons.append(f"Contains {phrases_found} phrases often used by AI")
    
    # 3. Analyze sentence structure
    sentences = re.split(r'[.!?]+', text)
    sentences = [s.strip() for s in sentences if s.strip()]
    
    if len(sentences) > 3:
        # Calculate sentence length variability
        sentence_lengths = [len(s) for s in sentences]
        avg_length = sum(sentence_lengths) / len(sentence_lengths)
        
        # Standard deviation of lengths
        variance = sum((length - avg_length) ** 2 for length in sentence_lengths) / len(sentence_lengths)
        std_dev = math.sqrt(variance)
        
        # Coefficient of variation
        variation_coeff = std_dev / max(avg_length, 1)
        
        if variation_coeff < 0.4:
            total_score += 0.2
            reasons.append("Unusually consistent sentence structure")
    
    # 4. Analyze vocabulary diversity (TTR - Type-Token Ratio)
    words = re.findall(r'\b\w+\b', text.lower())
    unique_words = len(set(words))
    
    if len(words) > 30:
        ttr = unique_words / len(words)
        if ttr > 0.8:
            total_score += 0.2
            reasons.append("Unusually high vocabulary diversity")
    
    # 5. Check n-gram consistency (word triplets)
    if len(words) > 20:
        # Create word triplets
        triplets = [' '.join(words[i:i+3]) for i in range(len(words)-2)]
        # Count occurrences
        triplet_counts = Counter(triplets)
        # Check if certain triplets are repeated
        repeated_triplets = sum(1 for count in triplet_counts.values() if count > 1)
        
        if repeated_triplets == 0 and len(triplets) > 10:
            # Human texts tend to repeat certain patterns
            total_score += 0.1
            reasons.append("No repeated phrase patterns (unusual for human writing)")
    
    # Round the score for readability
    final_score = min(round(total_score, 2), 1.0)
    
    # Consider as AI-generated if score is above 0.5
    return (final_score > 0.5, final_score, reasons)

def check_with_sapling_api(text):
    """
    Check if text is AI-generated using Sapling's AI Detector API
    Returns tuple of (is_ai_generated, score, reasons)
    """
    import requests
    import os
    
    # Skip API call for very short texts
    if len(text) < 50:
        return (False, 0, ["Text too short for reliable detection"])
    
    try:
        # Get API key from environment variables
        api_key = os.getenv("SAPLING_API_KEY")
        if not api_key:
            print("Sapling API key not found. Falling back to local detection.")
            return is_ai_generated(text)
            
        # Prepare the request
        url = "https://api.sapling.ai/api/v1/aidetect"
        payload = {
            "key": api_key,
            "text": text,
            "options": {
                "detail": True,  # Get detailed explanations
            }
        }
        
        # Make the API call
        response = requests.post(url, json=payload)
        
        if response.status_code == 200:
            result = response.json()
            
            # Process the response
            score = result.get("score", 0)  # AI probability score (0-1)
            is_ai = score > 0.5  # Consider as AI if score > 0.5
            
            # Extract reasons from the detailed response
            reasons = []
            
            # Extract detailed explanations if available
            if "detail" in result and "explanations" in result["detail"]:
                explanations = result["detail"]["explanations"]
                for explanation in explanations[:3]:  # Take the top 3 reasons
                    reasons.append(explanation.get("explanation", ""))
            
            # If no detailed explanations provided, create a generic reason
            if not reasons:
                reasons = [f"AI score: {score:.2f}"]
                
            # Add severity description
            if score > 0.9:
                reasons.append("Very high confidence of AI-generated content")
            elif score > 0.7:
                reasons.append("High confidence of AI-generated content")
            elif score > 0.5:
                reasons.append("Moderate confidence of AI-generated content")
            
            return (is_ai, score, reasons)
            
        else:
            # Handle API error
            print(f"Sapling API error: {response.status_code}")
            print(f"Response: {response.text}")
            
            # Fall back to local detection
            return is_ai_generated(text)
            
    except Exception as e:
        print(f"Error with Sapling API: {str(e)}")
        # Fall back to local detection
        return is_ai_generated(text)

async def generate_audio(text, output_path, voice="en-US-ChristopherNeural"):
    """Generate audio file using Edge TTS"""
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(output_path)


def assess_listening_response(expected_sentence, user_response):
    """
    Compare a user's listening response to the expected sentence and determine accuracy level
    """
    from difflib import SequenceMatcher
    
    # Clean up responses for comparison (lowercase, remove extra whitespace)
    expected_clean = " ".join(expected_sentence.lower().split())
    user_clean = " ".join(user_response.lower().split())
    
    # Calculate similarity ratio
    similarity = SequenceMatcher(None, expected_clean, user_clean).ratio()
    
    # Count words from original sentence that appear in response
    expected_words = set(expected_clean.split())
    user_words = set(user_clean.split())
    matching_words = expected_words.intersection(user_words)
    word_match_ratio = len(matching_words) / len(expected_words) if expected_words else 0
    
    # Determine CEFR level based on accuracy
    if similarity >= 0.9:  # Near perfect reproduction
        level = "C1"
        justification = "The response almost perfectly reproduces the original sentence."
    elif similarity >= 0.75:  # Good reproduction with minor variations
        level = "B2"
        justification = "The response accurately captures the original sentence with only minor variations."
    elif similarity >= 0.5 or word_match_ratio >= 0.6:  # Captures essence with some errors
        level = "B1"
        justification = "The response captures the main idea and most key words, but has notable differences."
    elif similarity >= 0.3 or word_match_ratio >= 0.3:  # Gets main idea but misses details
        level = "A2"
        justification = "The response captures some key words but misses significant details."
    else:  # Minimal comprehension
        level = "A1"
        justification = "The response shows minimal comprehension of the original sentence."
    
    # Detailed vocabulary assessment
    if len(user_response) < 5:
        vocabulary_assessment = "Unable to assess vocabulary as the response is too short."
    else:
        vocabulary_assessment = "Basic vocabulary usage is evident in the response." if level in ["A1", "A2"] else \
                               "Good vocabulary usage is evident in the response." if level == "B1" else \
                               "Strong vocabulary usage is evident in the response."
    
    # Detailed grammar assessment
    if len(user_response) < 5:
        grammar_assessment = "Unable to assess grammar as the response is too short."
    else:
        grammar_assessment = "Basic grammatical structures are present." if level in ["A1", "A2"] else \
                            "Good grammatical control is evident." if level == "B1" else \
                            "Strong grammatical control is demonstrated."
    
    # Detailed comprehension assessment
    comprehension_assessment = f"Similarity score: {similarity:.2f}. Captured {len(matching_words)}/{len(expected_words)} key words."
    
    # Detailed fluency assessment
    if len(user_response) < 5:
        fluency_assessment = "Unable to assess fluency as the response is too short."
    else:
        fluency_assessment = "Limited fluency is demonstrated." if level in ["A1", "A2"] else \
                            "Good fluency is demonstrated." if level == "B1" else \
                            "Excellent fluency is demonstrated."
    
    # Detailed spelling assessment
    if len(user_response) < 5:
        spelling_assessment = "Unable to assess spelling as the response is too short."
    else:
        spelling_assessment = "Basic spelling skills are demonstrated." if level in ["A1", "A2"] else \
                            "Good spelling accuracy is evident." if level == "B1" else \
                            "Excellent spelling accuracy is demonstrated."
    
    # Prepare assessment object
    assessment = {
        "level": level,
        "justification": justification,
        "vocabulary_assessment": vocabulary_assessment,
        "grammar_assessment": grammar_assessment,
        "spelling_assessment": spelling_assessment,  # Added spelling field
        "comprehension_assessment": comprehension_assessment,
        "fluency_assessment": fluency_assessment,
        "specific_strengths": [],
        "specific_areas_for_improvement": [],
        "tips_for_improvement": "Practice active listening and repeating phrases exactly as heard."
    }
    
    # Add specific strengths
    if similarity >= 0.9:
        assessment["specific_strengths"].append("Excellent recall of the complete sentence")
    elif word_match_ratio >= 0.7:
        assessment["specific_strengths"].append("Good recall of key vocabulary")
    elif len(user_response) > 0:
        assessment["specific_strengths"].append("Attempted to provide a response")
    
    # Add areas for improvement
    missing_words = expected_words - user_words
    if missing_words:
        assessment["specific_areas_for_improvement"].append(
            f"Did not include these key words: {', '.join(list(missing_words)[:3])}")
    if len(user_response) < 5:
        assessment["specific_areas_for_improvement"].append("Response is too short to demonstrate listening comprehension")
    
    # More specific tips based on performance
    if similarity < 0.5:
        assessment["tips_for_improvement"] = "Try repeating sentences immediately after hearing them to improve recall. Focus on remembering both the beginning and end of sentences."
    
    return assessment

# **************************************
def assess_response(question, answer, question_type=None):
    """Use Groq or local model to assess the CEFR level of a response"""
    try:
        # Special handling for listening questions
        if question_type == "listening":
            # Get the expected sentence from DIALOGUE_QUESTIONS
            expected_sentence = ""
            for q in DIALOGUE_QUESTIONS:
                if q["type"] == "listening":
                    expected_sentence = q.get("expected_sentence", "We could have a dance show or a food tasting.")
                    break

            # Use specialized assessment for listening
            return assess_listening_response(expected_sentence, answer)

        # Get detailed prompt with example responses and criteria
        prompt = get_level_assessment_prompt(question, answer, question_type)

        logger.info(f"Sending prompt to Groq for assessment: {prompt[:100]}...")

        # Call Groq API for assessment
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": "You are an expert language assessor specializing in CEFR levels."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=MAX_TOKENS,
            temperature=0.3  # Lower temperature for more consistent assessments
        )

        result = response.choices[0].message.content
        logger.info(f"Groq response received, length: {len(result)}")

        # Parse the JSON response
        try:
            assessment = json.loads(result)

            # Extract what we need and ensure all fields exist
            clean_assessment = {
                "level": assessment.get("level", "B1"),
                "justification": assessment.get("justification", "No justification provided"),
                "vocabulary_assessment": assessment.get("vocabulary_assessment", ""),
                "grammar_assessment": assessment.get("grammar_assessment", ""),
                "spelling_assessment": assessment.get("spelling_assessment", ""),  # Make sure this is included
                "comprehension_assessment": assessment.get("comprehension_assessment", ""),
                "fluency_assessment": assessment.get("fluency_assessment", ""),
                "specific_strengths": assessment.get("specific_strengths", []),
                "specific_areas_for_improvement": assessment.get("specific_areas_for_improvement", []),
                "tips_for_improvement": assessment.get("tips_for_improvement", "")
            }
            return clean_assessment

        except json.JSONDecodeError:
            logger.error(f"Failed to parse JSON from Groq response: {result}")
            # Use fallback assessment method
            return fallback_assessment(answer)

    except Exception as e:
        logger.error(f"Error assessing response with Groq: {str(e)}")
        # Use fallback assessment method
        return fallback_assessment(answer)

def verify_audio_files():
    """Check if audio files exist and are readable"""
    audio_dir = os.path.join('static', 'audio')
    skander_audio_path = os.path.join(audio_dir, 'skander_suggestion.mp3')

    if os.path.exists(skander_audio_path):
        file_size = os.path.getsize(skander_audio_path)
        logger.info(f"Audio file exists: {skander_audio_path} (Size: {file_size} bytes)")

        # Try to read a few bytes to verify file is not corrupted
        try:
            with open(skander_audio_path, 'rb') as f:
                header = f.read(10)  # Read first 10 bytes
            logger.info(f"Successfully read audio file header: {header.hex()}")
            return True
        except Exception as e:
            logger.error(f"Error reading audio file: {str(e)}")
            return False
    else:
        logger.error(f"Audio file does not exist: {skander_audio_path}")
        return False


def generate_audio_sync(text, output_path, voice="en-US-ChristopherNeural"):
    """Synchronous wrapper for generate_audio"""
    asyncio.run(generate_audio(text, output_path, voice))


def generate_skander_audio():
    """Generate audio specifically for SKANDER's question in step 4"""
    audio_dir = os.path.join('static', 'audio')
    os.makedirs(audio_dir, exist_ok=True)

    # Generate audio for SKANDER's suggestion (step 4)
    skander_audio_path = os.path.join(audio_dir, 'skander_suggestion.mp3')

    # Get the text directly from the question in step 4
    step4_question = next((q for q in DIALOGUE_QUESTIONS if q["step"] == 4), None)
    if step4_question:
        # Extract the actual question text to convert to speech
        skander_text = "We could have a dance show or a food tasting."

        try:
            # Use a male voice for SKANDER
            generate_audio_sync(skander_text, skander_audio_path, voice="en-US-GuyNeural")
            logger.info(f"Generated audio file for SKANDER: {skander_audio_path}")
            return True
        except Exception as e:
            logger.error(f"Error generating SKANDER audio file: {str(e)}")

    return False


def initialize_audio_files():
    """Generate audio files for listening questions if they don't exist"""
    audio_dir = os.path.join('static', 'audio')
    os.makedirs(audio_dir, exist_ok=True)

    # Generate audio for SKANDER's suggestion
    skander_audio_path = os.path.join(audio_dir, 'skander_suggestion.mp3')
    if not os.path.exists(skander_audio_path):
        skander_text = "We could have a dance show or a food tasting."
        try:
            generate_audio_sync(skander_text, skander_audio_path, voice="en-US-GuyNeural")
            logger.info(f"Generated audio file: {skander_audio_path}")
        except Exception as e:
            logger.error(f"Error generating audio file: {str(e)}")

    # Generate additional audio for other dialogues if needed
    for idx, question in enumerate(DIALOGUE_QUESTIONS):
        if question.get('audio_cue') and question.get('audio_cue') != 'skander_suggestion.mp3':
            audio_path = os.path.join(audio_dir, question.get('audio_cue'))
            if not os.path.exists(audio_path):
                voice = "en-US-AriaNeural"  # Default female voice

                # Set appropriate voice based on speaker
                if question['speaker'] == "Ms. Mabrouki":
                    voice = "en-US-JennyNeural"
                elif question['speaker'] == "SKANDER":
                    voice = "en-US-GuyNeural"
                elif question['speaker'] == "Emna":
                    voice = "en-US-AriaNeural"
                elif question['speaker'] == "Ryan":
                    voice = "en-US-BryanNeural"
                elif question['speaker'] == "Lilia":
                    voice = "en-US-ElizabethNeural"

                try:
                    generate_audio_sync(question['question'], audio_path, voice=voice)
                    logger.info(f"Generated audio file: {audio_path}")
                except Exception as e:
                    logger.error(f"Error generating audio file: {str(e)}")


def get_keyword_analysis(text):
    """Analyze keywords in text to help determine vocabulary level"""
    # Advanced vocabulary (C1-B2)
    advanced_words = ['magnificent', 'sophisticated', 'extraordinary', 'consequently', 'nevertheless',
                      'furthermore', 'cordially', 'promptly', 'assess', 'vibrant', 'heritage',
                      'interactive', 'unforgettable', 'proposal', 'initiative', 'perspective']

    # Intermediate vocabulary (B1-B2)
    intermediate_words = ['suggest', 'celebrate', 'experience', 'traditional', 'important',
                          'specific', 'participate', 'inform', 'organization', 'coordination',
                          'immediately', 'effective', 'communication', 'collaboration', 'teamwork']

    # Basic vocabulary (A1-A2)
    basic_words = ['nice', 'good', 'bad', 'like', 'want', 'tell', 'see', 'food', 'help',
                   'work', 'talk', 'party', 'join', 'event', 'come', 'go', 'make', 'do']

    # Count occurrences
    text_lower = text.lower()
    advanced_count = sum(1 for word in advanced_words if word in text_lower)
    intermediate_count = sum(1 for word in intermediate_words if word in text_lower)
    basic_count = sum(1 for word in basic_words if word in text_lower)

    return {
        "advanced_count": advanced_count,
        "intermediate_count": intermediate_count,
        "basic_count": basic_count
    }


def get_grammar_analysis(text):
    """Analyze grammatical structures in text to help determine grammar level"""
    # Check for conditional structures (B2-C1)
    conditional_patterns = ['would', 'could', 'might', 'if i were', 'should']
    has_conditionals = any(pattern in text.lower() for pattern in conditional_patterns)

    # Check for complex sentences (B1-C1)
    complex_connectors = ['although', 'however', 'therefore', 'nevertheless', 'consequently',
                          'furthermore', 'moreover', 'meanwhile', 'whereas', 'despite']
    has_complex_sentences = any(connector in text.lower() for connector in complex_connectors)

    # Check for basic sentence structure (A1-A2)
    sentence_count = text.count('.') + text.count('!') + text.count('?')
    word_count = len(text.split())
    average_sentence_length = word_count / max(1, sentence_count)

    return {
        "has_conditionals": has_conditionals,
        "has_complex_sentences": has_complex_sentences,
        "average_sentence_length": average_sentence_length,
        "word_count": word_count
    }

# **************************************


def get_level_assessment_prompt(question, answer, question_type=None):
    """Create a detailed prompt for the AI to assess the CEFR level of a response"""
    # Get the example responses for this question type if available
    example_responses = {}
    if question_type:
        for q in DIALOGUE_QUESTIONS:
            if q["type"] == question_type and "example_responses" in q:
                example_responses = q["example_responses"]
                break

    # Generate examples section if we have examples
    examples_section = ""
    if example_responses:
        examples_section = "Here are some example responses at different CEFR levels for this type of question:\n\n"
        for level, example in example_responses.items():
            examples_section += f"{level}: \"{example}\"\n"

    # Get assessment criteria for this question type
    assessment_criteria_section = ""
    if question_type:
        for q in DIALOGUE_QUESTIONS:
            if q["type"] == question_type and "assessment_criteria" in q:
                criteria = q["assessment_criteria"]
                assessment_criteria_section = "Assessment criteria for this question type:\n\n"
                for criterion, weight in criteria.items():
                    assessment_criteria_section += f"- {criterion.replace('_', ' ').title()}: {weight*100}% of the assessment\n"
                break

    # Special handling for listening type questions
    if question_type == "listening":
        # Extract the original sentence from the audio cue
        original_sentence = "We could have a dance show or a food tasting."

        # Calculate text similarity
        from difflib import SequenceMatcher

        def similar(a, b):
            return SequenceMatcher(None, a.lower(), b.lower()).ratio()

        similarity = similar(original_sentence, answer)

        return f"""
        You are an expert language assessor specializing in CEFR (Common European Framework of Reference for Languages) levels.
        
        This is a LISTENING COMPREHENSION assessment. The student listened to this sentence:
        "{original_sentence}"
        
        And responded with:
        "{answer}"
        
        This is a DIRECT LISTENING COMPREHENSION exercise, so please focus primarily on how accurately the student reproduced or paraphrased the original sentence.
        
        Text similarity score: {similarity:.2f} (0-1 scale, higher is better)
        
        Evaluation criteria:
        - For level A1: Can repeat a few key words from the sentence (e.g., "dance", "food")
        - For level A2: Can capture the main idea but may miss details (e.g., "Something about dance and food")
        - For level B1: Can accurately reproduce most of the sentence with minor variations
        - For level B2: Can perfectly repeat the sentence or accurately paraphrase it
        - For level C1: Can perfectly repeat the sentence or provide an elegant paraphrase
        
        Focus EXCLUSIVELY on comprehension accuracy rather than grammar or vocabulary usage.
        
        Format your response as a detailed JSON object:
        {{
            "level": "A1/A2/B1/B2/C1",
            "justification": "Your explanation focusing on listening comprehension",
            "comprehension_assessment": "Detail how well they reproduced the original sentence",
            "specific_strengths": ["Strength 1", "Strength 2"],
            "specific_areas_for_improvement": ["Area 1", "Area 2"],
            "tips_for_improvement": "Concrete suggestions for improving listening skills"
        }}
        
        Do not include any text outside of the JSON object.
        """

    # Perform preliminary analysis to help guide the AI for non-listening questions
    keyword_analysis = get_keyword_analysis(answer)
    grammar_analysis = get_grammar_analysis(answer)

    analysis_section = f"""
    Preliminary analysis:
    - Word count: {grammar_analysis['word_count']}
    - Average sentence length: {grammar_analysis['average_sentence_length']:.1f} words
    - Advanced vocabulary words: {keyword_analysis['advanced_count']}
    - Intermediate vocabulary words: {keyword_analysis['intermediate_count']}
    - Basic vocabulary words: {keyword_analysis['basic_count']}
    - Uses conditional structures: {'Yes' if grammar_analysis['has_conditionals'] else 'No'}
    - Uses complex sentence connectors: {'Yes' if grammar_analysis['has_complex_sentences'] else 'No'}
    """

    # Ajouter les instructions pour la reconnaissance multilingue
    multilingual_instructions = """
    IMPORTANT - MULTILINGUAL ASSESSMENT:
    
    Students may use words from other languages in their responses (such as French, Arabic, etc.). 
    This is NOT an error, but demonstrates linguistic awareness and should be viewed positively.
    
    When you encounter non-English words:
    1. Recognize them as intentional vocabulary from another language
    2. Use your multilingual knowledge to understand their meaning
    3. Consider this as a positive aspect in the assessment
    4. ALWAYS RESPOND IN ENGLISH ONLY, regardless of what language the student used
    
    Examples:
    - If a student writes "I am a fille", recognize that "fille" is the French word for "girl"
    - If they use "مرحبا" (Arabic for "hello"), acknowledge this as demonstrating multilingual awareness
    - If they write "I like couscous and tajine", recognize the cultural food terms
    
    Consider this code-switching as a demonstration of cultural and linguistic awareness.
    """

    # Instructions for spelling assessment
    spelling_instructions = """
    SPELLING ASSESSMENT CRITERIA:
    
    A1: Can spell their name and very basic everyday words (e.g., "car", "house"), but with frequent errors in less common words.
    
    A2: Can spell short, simple words related to immediate needs, though not necessarily with complete accuracy. May have issues with double letters and silent letters.
    
    B1: Can produce continuous writing with reasonably accurate spelling for familiar words, though may make errors with more complex words or patterns.
    
    B2: Shows good control of spelling with occasional slips. Can generally handle complex words accurately.
    
    C1: Has consistent and accurate spelling with only occasional minor errors or typos that don't interfere with meaning.
    """

    return f"""
    You are an expert language assessor specializing in CEFR (Common European Framework of Reference for Languages) levels, with particular expertise in applied linguistics and second language acquisition.
    
    Analyze the following response to a question in a language learning game and determine the CEFR level (A1, A2, B1, B2, or C1).
    
    Question: "{question}"
    
    Response: "{answer}"
    
    {assessment_criteria_section}
    
    {examples_section}
    
    {analysis_section}
    
    {multilingual_instructions}
    
    {spelling_instructions}
    
    Carefully assess the response using these six key criteria:
    
    1. VOCABULARY RANGE: Assess the complexity and variety of vocabulary used. Note specific examples of basic (A1-A2), intermediate (B1-B2), or advanced (C1) vocabulary. Recognize and give appropriate credit for vocabulary from other languages.
    
    2. GRAMMAR AND SYNTAX: Evaluate sentence structure, tense usage, and grammatical accuracy. Look for conditional forms, complex connectors, and error patterns.
    
    3. SPELLING ACCURACY: Assess the accuracy of spelling throughout the response. Note any patterns in spelling errors while considering the multilingual context.
    
    4. COMPREHENSION AND RELEVANCE: Determine if the response directly addresses the question with appropriate detail and understanding.
    
    5. FLUENCY AND DETAIL: Consider the coherence, elaboration, and natural flow of the response.
    
    6. OVERALL CEFR LEVEL: Based on the above, determine the most appropriate CEFR level.
    
    Format your response as a detailed JSON object:
    {{
        "level": "A1/A2/B1/B2/C1",
        "justification": "Your explanation here",
        "vocabulary_assessment": "Analysis of vocabulary with specific examples",
        "grammar_assessment": "Analysis of grammatical structures with specific examples",
        "spelling_assessment": "Analysis of spelling accuracy with specific examples",
        "comprehension_assessment": "Analysis of how well they understood and addressed the question",
        "fluency_assessment": "Analysis of coherence and detail",
        "specific_strengths": ["Strength 1", "Strength 2"],
        "specific_areas_for_improvement": ["Area 1", "Area 2"],
        "tips_for_improvement": "Concrete suggestions for improving language skills"
    }}
    
    Do not include any text outside of the JSON object.
    """



# **************************************


def fallback_assessment(answer):
    """Fallback method when Groq API is unavailable - with multilingual support and spelling assessment"""
    # Perform basic analysis
    keyword_analysis = get_keyword_analysis(answer)
    grammar_analysis = get_grammar_analysis(answer)

    # Simple rule-based assessment
    level = "B1"  # Default

    # Word count heuristics
    word_count = grammar_analysis['word_count']

    # Apply multilingual bonus to the assessment
    multilingual_bonus = keyword_analysis.get('multilingual_bonus', 0)
    french_count = keyword_analysis.get('french_count', 0)
    arabic_count = keyword_analysis.get('arabic_count', 0)

    # Modify the assessment based on word count and multilingual awareness
    if word_count < 10:
        level = "A1"
    elif word_count < 20:
        level = "A2"
    elif word_count > 50 and grammar_analysis['has_complex_sentences']:
        level = "B2"
    elif word_count > 70 and grammar_analysis['has_conditionals'] and keyword_analysis['advanced_count'] > 2:
        level = "C1"

    # Potentially increase level based on multilingual usage (showing language awareness)
    if multilingual_bonus >= 2 and level in ["A1", "A2"]:
        # Bump up one level if they show good multilingual awareness at beginner levels
        if level == "A1":
            level = "A2"
        elif level == "A2":
            level = "B1"

    # Prepare multilingual notes if foreign words were detected
    multilingual_notes = ""
    if french_count > 0 or arabic_count > 0:
        multilingual_notes = f"Response includes {french_count} French words and {arabic_count} Arabic words, demonstrating multilingual awareness."

    # Basic spelling assessment based on level
    spelling_assessment = "Unable to perform detailed spelling assessment in fallback mode."
    if level == "A1":
        spelling_assessment = "Spelling expected to be basic with frequent errors."
    elif level == "A2":
        spelling_assessment = "Spelling expected to be reasonably accurate for simple, common words."
    elif level == "B1":
        spelling_assessment = "Spelling expected to be mostly accurate with some errors in complex words."
    elif level == "B2":
        spelling_assessment = "Spelling expected to be generally accurate with occasional errors."
    elif level == "C1":
        spelling_assessment = "Spelling expected to be consistently accurate with minimal errors."

    return {
        "level": level,
        "justification": f"Assessment based on basic metrics: {word_count} words, {keyword_analysis['advanced_count']} advanced terms, complex structures: {'yes' if grammar_analysis['has_complex_sentences'] else 'no'}. {multilingual_notes}",
        "vocabulary_assessment": f"Basic: {keyword_analysis['basic_count']}, Intermediate: {keyword_analysis['intermediate_count']}, Advanced: {keyword_analysis['advanced_count']}. Foreign language usage: {multilingual_bonus}/3",
        "grammar_assessment": f"Average sentence length: {grammar_analysis['average_sentence_length']:.1f}",
        "spelling_assessment": spelling_assessment,
        "comprehension_assessment": "Unable to determine comprehension without context",
        "fluency_assessment": f"Text length suggests {'limited' if word_count < 20 else 'reasonable' if word_count < 50 else 'good'} fluency",
        "specific_strengths": [
            "Shows multilingual awareness" if multilingual_bonus > 0 else "Attempts to communicate effectively",
            "Uses vocabulary appropriately for level"
        ],
        "specific_areas_for_improvement": [],
        "tips_for_improvement": "Continue practicing with more complex sentences and vocabulary"
    }


def get_ai_response(prompt, character=None):
    """Get a responsive, in-character response from Groq"""
    try:
        character_prompt = ""
        if character and character in NPCS:
            npc = NPCS[character]
            character_prompt = f"""
            You are {character}, {npc['role']} at the Cultural Event Planning Committee.
            Your personality: {npc['personality']}
            Background: {npc['background']}
            
            Respond in character based on this persona. Keep your response encouraging but authentic to your character.
            """

        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": f"You are an AI language learning assistant in a game about planning a cultural event. {character_prompt}"},
                {"role": "user", "content": prompt}
            ],
            max_tokens=MAX_TOKENS,
            temperature=0.7
        )

        return response.choices[0].message.content

    except Exception as e:
        logger.error(f"Error getting AI response: {str(e)}")
        return "I'm sorry, I couldn't process that response."


# **************************************
def determine_overall_level(assessment_data):
    """Determine the overall CEFR level based on all responses with weighted scoring"""
    # Convert CEFR levels to numeric values
    level_values = {
        "A1": 1,
        "A2": 2,
        "B1": 3,
        "B2": 4,
        "C1": 5
    }

    # Question type weights (some skills may be weighted more heavily)
    type_weights = {
        "introduction": 0.8,
        "motivation": 1.0,
        "cultural_knowledge": 1.0,
        "listening": 1.2,
        "creativity": 0.9,
        "social_interaction": 1.2,
        "problem_solving": 1.1,
        "skills_discussion": 0.9,
        "writing": 1.2
    }

    # Calculate weighted average score
    total_weighted = 0
    total_weights = 0

    for assessment in assessment_data:
        level = assessment.get("level")
        assessment_type = assessment.get("type", "")

        if level in level_values:
            weight = type_weights.get(assessment_type, 1.0)
            total_weighted += level_values[level] * weight
            total_weights += weight

    if total_weights == 0:
        return "B1"  # Default

    average = total_weighted / total_weights

    # Convert back to CEFR level
    if average < 1.5:
        return "A1"
    elif average < 2.5:
        return "A2"
    elif average < 3.5:
        return "B1"
    elif average < 4.5:
        return "B2"
    else:
        return "C1"


def skill_levels_from_assessments(assessments):
    """Extract skill levels from assessment data"""
    # Initialize skill assessment collections
    skill_assessments = {
        "vocabulary": [],
        "grammar": [],
        "spelling": [],  # Added spelling
        "fluency": [],
        "comprehension": []
    }

    # Collect assessments by skill type
    for assessment in assessments:
        if "vocabulary_assessment" in assessment:
            skill_assessments["vocabulary"].append(assessment)
        if "grammar_assessment" in assessment:
            skill_assessments["grammar"].append(assessment)
        if "spelling_assessment" in assessment:
            skill_assessments["spelling"].append(assessment)
        if "fluency_assessment" in assessment:
            skill_assessments["fluency"].append(assessment)
        if "comprehension_assessment" in assessment:
            skill_assessments["comprehension"].append(assessment)

    # Determine level for each skill
    skill_levels = {}
    for skill, skill_assessments_list in skill_assessments.items():
        if skill_assessments_list:
            skill_levels[skill] = determine_overall_level(skill_assessments_list)
        else:
            skill_levels[skill] = "B1"  # Default to B1 if no assessments

    return skill_levels

def calculate_achievements(assessments, start_time):
    """Calculate achievements based on user performance"""
    achievements_earned = []

    # Calculate time spent
    time_spent = (datetime.now() - start_time).total_seconds() / 60  # in minutes
    if time_spent < 5:
        achievements_earned.append("quick_thinker")

    # Check for consistent performance
    levels = [a.get("level") for a in assessments if "level" in a]
    if len(set(levels)) == 1 and len(levels) > 3:
        achievements_earned.append("consistent_performer")

    # Check for vocabulary mastery
    vocab_strengths = sum(1 for a in assessments if a.get("vocabulary_assessment", "").lower().find("advanced") >= 0)
    if vocab_strengths >= 3:
        achievements_earned.append("vocabulary_master")

    # Check for grammar expertise
    grammar_strengths = sum(1 for a in assessments if a.get("grammar_assessment", "").lower().find("excellent") >= 0)
    if grammar_strengths >= 3:
        achievements_earned.append("grammar_expert")

    # Check for communication skills
    if any(a.get("level") in ["B2", "C1"] for a in assessments if a.get("type") == "social_interaction"):
        achievements_earned.append("communicator")

    return achievements_earned

def calculate_xp(assessments):
    """Calculate experience points based on user performance"""
    base_xp = 0

    # Base XP from question types
    for assessment in assessments:
        for question in DIALOGUE_QUESTIONS:
            if question["type"] == assessment.get("type"):
                base_xp += question.get("xp_reward", 10)
                break

    # Level multiplier
    level_multipliers = {
        "A1": 1.0,
        "A2": 1.2,
        "B1": 1.5,
        "B2": 1.8,
        "C1": 2.0
    }

    level_bonus = 0
    for assessment in assessments:
        level = assessment.get("level")
        if level in level_multipliers:
            level_bonus += level_multipliers[level] * 5

    return int(base_xp + level_bonus)

@app.route('/')
def index():
    """Home page route with game introduction"""
    return render_template('index.html', npcs=NPCS)

@app.route('/start-game', methods=['POST'])
def start_game():
    """Initialize game session with player data"""
    player_name = request.form.get('player_name', 'Player')

    # Initialize session data
    session['player_name'] = player_name
    session['current_step'] = 0
    session['responses'] = []
    session['assessments'] = []
    session['start_time'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    session['xp'] = 0
    session['progress_level'] = 0  # Start at orientation level
    session['achievements'] = []

    return redirect(url_for('game'))


@app.route('/game')
def game():
    """Main game page with interactive dialogue"""
    player_name = session.get('player_name', 'Player')
    current_step = session.get('current_step', 0)
    xp = session.get('xp', 0)

    # Check if game is completed
    if current_step >= len(DIALOGUE_QUESTIONS):
        return redirect(url_for('results'))

    # Get current question
    question_data = DIALOGUE_QUESTIONS[current_step]

    # Get current scene information
    scene = question_data.get('scene', 'meeting_room')
    scene_description = {
        'meeting_room': 'A bright conference room with a large table and chairs. Maps of Tunisia and cultural artifacts decorate the walls.',
        'coffee_break': 'A casual seating area with comfortable sofas and a coffee table. Committee members are chatting and enjoying refreshments.',
        'brainstorming_area': 'A creative space with whiteboards, sticky notes, and colorful markers. Ideas for the event are posted all around.',
        'creative_corner': 'A quiet area with inspirational posters and design materials, perfect for writing and creative tasks.'
    }.get(scene, 'A room at the university')

    # Get skill being assessed
    skill = question_data.get('skill', 'communication')
    skill_descriptions = {
        'self-expression': 'Ability to introduce yourself and express personal information',
        'reasoning': 'Ability to explain your thoughts and motivations',
        'world_knowledge': 'Knowledge about cultural topics and facts',
        'comprehension': 'Ability to understand and process spoken language',
        'ideation': 'Creativity and ability to generate original ideas',
        'conversation': 'Social interaction skills and politeness',
        'strategic_thinking': 'Problem-solving abilities and forward planning',
        'abstract_thinking': 'Ability to discuss abstract concepts and ideas',
        'written_expression': 'Writing skills and ability to craft messages'
    }

    return render_template(
        'game.html',
        player_name=player_name,
        question=question_data,
        npcs=NPCS,
        current_step=current_step,
        total_steps=len(DIALOGUE_QUESTIONS),
        xp=xp,
        scene=scene,
        scene_description=scene_description,
        skill=skill,
        skill_description=skill_descriptions.get(skill, 'Communication skills')
    )

@app.route('/results')
def results():
    """Show game results, CEFR level assessment, and achievements"""
    player_name = session.get('player_name', 'Player')
    assessments = session.get('assessments', [])
    responses = session.get('responses', [])
    start_time_str = session.get('start_time')
    xp = session.get('xp', 0)

    # Calculate AI usage statistics
    total_responses = len(responses)
    ai_detected_count = sum(1 for r in responses if r.get('ai_generated', False))
    ai_percentage = round((ai_detected_count / total_responses * 100) if total_responses > 0 else 0)

    # Parse start time
    start_time = datetime.strptime(start_time_str, "%Y-%m-%d %H:%M:%S") if start_time_str else datetime.now()

    # Determine overall CEFR level
    overall_level = determine_overall_level(assessments)
    level_description = CEFR_LEVELS.get(overall_level, "Could not determine level")

    # Calculate achievements
    achievements_earned = calculate_achievements(assessments, start_time)

    # Calculate skill levels from assessments
    skill_levels = skill_levels_from_assessments(assessments)
    progress_levels = []
    for level in PROGRESS_LEVELS:
        required_level = level.get('required_level')
        is_unlocked = True  # Orientation is always unlocked

        if required_level:
            # Convert levels to numeric values for comparison
            level_values = {"A1": 1, "A2": 2, "B1": 3, "B2": 4, "C1": 5}
            player_level_value = level_values.get(overall_level, 0)
            required_level_value = level_values.get(required_level, 999)
            is_unlocked = player_level_value >= required_level_value

        progress_levels.append({
            "name": level.get('name'),
            "description": level.get('description'),
            "icon": level.get('icon'),
            "is_unlocked": is_unlocked,
            "required_level": required_level
        })

    # Calculate skill levels based on assessment types
    skill_assessments = {
        "vocabulary": [],
        "grammar": [],
        "spelling": [],
        "fluency": [],
        "comprehension": []
    }

    for assessment in assessments:
        if "vocabulary_assessment" in assessment:
            skill_assessments["vocabulary"].append(assessment)
        if "grammar_assessment" in assessment:
            skill_assessments["grammar"].append(assessment)
        if "spelling_assessment" in assessment:
            skill_assessments["spelling"].append(assessment)
        if "fluency_assessment" in assessment:
            skill_assessments["fluency"].append(assessment)
        if "comprehension_assessment" in assessment:
            skill_assessments["comprehension"].append(assessment)

    # Determine level for each skill
    skill_levels = {}
    for skill, skill_assessments_list in skill_assessments.items():
        if skill_assessments_list:
            skill_levels[skill] = determine_overall_level(skill_assessments_list)
        else:
            skill_levels[skill] = overall_level  # Default to overall level

    return render_template(
        'results.html',
        player_name=player_name,
        responses=responses,
        assessments=assessments,
        overall_level=overall_level,
        level_description=level_description,
        cefr_levels=CEFR_LEVELS,
        achievements=ACHIEVEMENTS,
        achievements_earned=achievements_earned,
        xp=xp,
        badges=BADGES,
        progress_levels=progress_levels,
        skill_levels=skill_levels,
        ai_responses_count=ai_detected_count,
        responses_length=total_responses,
        ai_percentage=ai_percentage
    )

@app.route('/api/get-ai-feedback', methods=['POST'])
def get_ai_feedback():
    """API endpoint to get AI feedback on a response with detailed language assessment"""
    data = request.json
    question = data.get('question', '')
    response = data.get('response', '')
    speaker = data.get('speaker', 'Ms. Mabrouki')
    question_type = data.get('type', '')
    
    # Check if the response was generated by AI using Sapling
    is_ai, ai_score, ai_reasons = check_with_sapling_api(response)
    
    # First, run a quick assessment to identify level and issues
    quick_assessment = assess_response(question, response, question_type)
    level = quick_assessment.get('level', 'B1')
    strengths = quick_assessment.get('specific_strengths', [])
    improvements = quick_assessment.get('specific_areas_for_improvement', [])
    
    # Add information about AI detection if necessary
    if is_ai:
        improvements = ["Your response appears to use AI-generated patterns"] + improvements
    
    # Create a coaching prompt based on assessment
    coaching_notes = ""
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
    
    # Create a prompt based on the question, response and coaching notes
    prompt = f"""
    As {speaker}, you are providing feedback to a student in an English language learning game.

    Student's response to: "{question}"

    Their response: "{response}"

    {coaching_notes}

    IMPORTANT: Your response MUST BE IN ENGLISH ONLY, even if the student wrote in another language. This is an English language learning application.

    Your response should:
    1. Stay completely in character as {speaker}
    2. Be encouraging and supportive
    3. Be concise (2-3 sentences)
    4. Include one brief, specific suggestion for improvement if appropriate
    5. End with a natural segue to the next part of the conversation
    6. ALWAYS RESPOND IN ENGLISH ONLY, regardless of what language the student used
    """
    
    ai_response = get_ai_response(prompt, speaker)
    
    # Also return assessment data for UI features
    return jsonify({
        "ai_response": ai_response,
        "assessment": {
            "level": level,
            "strengths": strengths[:2] if strengths else [],
            "improvements": improvements[:2] if improvements else [],
            "ai_generated": is_ai,
            "ai_score": ai_score,
            "ai_reasons": ai_reasons[:3] if ai_reasons else []
        }
    })

@app.route('/api/language-tips', methods=['GET'])
def language_tips():
    """API endpoint to get personalized language tips based on assessment history"""
    level = request.args.get('level', 'B1')

    # Get tips appropriate for the user's level
    tips_by_level = {
        "A1": [
            "Try to learn 5-10 new vocabulary words each day",
            "Practice using simple present tense ('I go', 'She likes')",
            "Use conjunctions like 'and' and 'but' to connect simple sentences",
            "Learn common everyday phrases like 'How are you?' and 'I would like'"
        ],
        "A2": [
            "Practice using the past tense to talk about completed actions",
            "Use 'because' to give reasons for your opinions",
            "Learn vocabulary related to specific topics like travel or food",
            "Try asking more complex questions using 'why' and 'how'"
        ],
        "B1": [
            "Practice using conditional sentences with 'if' and 'would'",
            "Express opinions using phrases like 'I believe that' or 'In my opinion'",
            "Use connecting words like 'however', 'therefore', and 'moreover'",
            "Replace basic adjectives with more specific ones (e.g., 'fascinating' instead of 'interesting')"
        ],
        "B2": [
            "Use a variety of tenses to add complexity to your sentences",
            "Practice using passive voice when appropriate",
            "Include idiomatic expressions in your responses",
            "Develop arguments with clear supporting points and examples"
        ],
        "C1": [
            "Incorporate sophisticated vocabulary and academic language",
            "Use complex sentence structures with multiple clauses",
            "Express subtle nuances of meaning through precise word choice",
            "Practice using specialized vocabulary in your field of interest"
        ]
    }

    # Get tips for the selected level
    selected_tips = tips_by_level.get(level, tips_by_level["B1"])

    # Randomly select 2 tips to return
    import random
    tips_to_show = random.sample(selected_tips, min(2, len(selected_tips)))

    return jsonify({
        "level": level,
        "tips": tips_to_show
    })


@app.route('/api/next-challenge', methods=['GET'])
def next_challenge():
    """API endpoint to get a bonus challenge based on the user's current level"""
    level = request.args.get('level', 'B1')

    # Challenges appropriate for each level
    challenges_by_level = {
        "A1": [
            "Introduce yourself and mention three hobbies you enjoy",
            "Describe your favorite food using at least 5 adjectives",
            "Talk about your daily routine using present tense"
        ],
        "A2": [
            "Describe your last vacation using past tense",
            "Explain why you like or dislike a particular type of music",
            "Give directions from your home to the nearest store"
        ],
        "B1": [
            "Discuss the advantages and disadvantages of social media",
            "Describe a problem in your community and suggest a solution",
            "Talk about your plans for the future using different future forms"
        ],
        "B2": [
            "Discuss how technology has changed education in the last decade",
            "Present arguments for and against working from home",
            "Describe a book or film that made a strong impression on you and explain why"
        ],
        "C1": [
            "Discuss the impact of climate change on future generations",
            "Analyze the cultural significance of a traditional celebration",
            "Present your views on how to balance economic growth with environmental protection"
        ]
    }

    # Get challenges for the selected level
    selected_challenges = challenges_by_level.get(level, challenges_by_level["B1"])

    # Randomly select a challenge
    challenge = random.choice(selected_challenges)

    return jsonify({
        "level": level,
        "challenge": challenge,
        "xp_reward": {"A1": 15, "A2": 20, "B1": 25, "B2": 30, "C1": 40}.get(level, 25)
    })


@app.route('/certificate')
def certificate():
    """Generate a certificate of completion with CEFR level"""
    player_name = session.get('player_name', 'Player')
    overall_level = session.get('overall_level', determine_overall_level(session.get('assessments', [])))
    level_description = CEFR_LEVELS.get(overall_level, "")
    completion_date = datetime.now().strftime("%B %d, %Y")

    return render_template(
        'certificate.html',
        player_name=player_name,
        overall_level=overall_level,
        level_description=level_description,
        completion_date=completion_date
    )

@app.route('/submit-response', methods=['POST'])
def submit_response():
    """Process player response, assess language level, and update game state"""
    current_step = session.get('current_step', 0)
    player_response = request.form.get('response', '')
    
    # Check if response is AI-generated using Sapling API
    is_ai, ai_score, ai_reasons = check_with_sapling_api(player_response)
    
    # If detected as AI-generated, display a message but continue the process
    if is_ai:
        flash(f"Attention: Your response was detected as potentially AI-generated (score: {ai_score:.2f}). Personal responses are encouraged for better learning.", "warning")
        
        # Store the information in the session for reference
        ai_responses = session.get('ai_responses', [])
        ai_responses.append({
            "step": current_step + 1,
            "score": ai_score,
            "reasons": ai_reasons,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        })
        session['ai_responses'] = ai_responses
    
    if current_step < len(DIALOGUE_QUESTIONS):
        question_data = DIALOGUE_QUESTIONS[current_step]
        question_text = question_data['question']
        question_type = question_data['type']
        
        # Store the response
        responses = session.get('responses', [])
        responses.append({
            "step": current_step + 1,
            "question": question_text,
            "response": player_response,
            "type": question_type,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "ai_generated": is_ai,
            "ai_score": ai_score,
            "ai_reasons": ai_reasons
        })
        session['responses'] = responses
        
        # Assess the response
        assessment = assess_response(question_text, player_response, question_type)
        
        # Add the type to the assessment for easier filtering
        assessment["type"] = question_type
        assessment["step"] = current_step + 1
        assessment["ai_generated"] = is_ai
        assessment["ai_score"] = ai_score
        assessment["ai_reasons"] = ai_reasons
        
        # Store the assessment
        assessments = session.get('assessments', [])
        assessments.append(assessment)
        session['assessments'] = assessments
        
        # Calculate and assign XP
        xp_earned = question_data.get('xp_reward', 10)
        # XP bonus based on level
        level_multipliers = {"A1": 1.0, "A2": 1.2, "B1": 1.5, "B2": 1.8, "C1": 2.0}
        xp_earned = int(xp_earned * level_multipliers.get(assessment.get('level', 'B1'), 1.0))
        
        # Reduce XP if AI-generated
        if is_ai:
            xp_earned = int(xp_earned * 0.5)  # 50% of normal XP
        
        session['xp'] = session.get('xp', 0) + xp_earned
        
        # Move to next step
        session['current_step'] = current_step + 1
        
        # Display message about earned XP
        if is_ai:
            flash(f"Response submitted! You earned {xp_earned} XP (reduced because it was detected as AI-generated).", "success")
        else:
            flash(f"Response submitted! You earned {xp_earned} XP.", "success")
    
    return redirect(url_for('game'))

@app.route('/api/generate-audio', methods=['POST'])
def api_generate_audio():
    """API endpoint to generate audio from text using Edge TTS"""
    data = request.json
    text = data.get('text', '')
    voice = data.get('voice', 'en-US-ChristopherNeural')
    filename = data.get('filename', f'custom_{int(datetime.now().timestamp())}.mp3')

    if not text:
        return jsonify({"error": "No text provided"}), 400

    # Make sure the filename is safe
    from werkzeug.utils import secure_filename
    filename = secure_filename(filename)

    # Generate audio file
    output_path = os.path.join('static', 'audio', filename)
    try:
        generate_audio_sync(text, output_path, voice=voice)
        return jsonify({
            "success": True,
            "audio_url": f"/static/audio/{filename}"
        })
    except Exception as e:
        logger.error(f"Error generating audio: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/play-audio/<filename>')
def play_audio(filename):
    """Direct route to play audio files"""
    from flask import send_from_directory
    return send_from_directory('static/audio', filename)


if __name__ == '__main__':
    os.makedirs('static/images/avatars', exist_ok=True)
    initialize_audio_files()
    generate_skander_audio()

    app.run(debug=True)
