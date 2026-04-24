"""
AI Service for handling Groq API interactions and AI-generated content detection
"""
import os
import json
import logging
import requests
import groq
from models.game_data import NPCS

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.groq_api_key = os.getenv("GROQ_API_KEY")
        self.sapling_api_key = os.getenv("SAPLING_API_KEY")
        self.sapling_api_url = "https://api.sapling.ai/api/v1/aidetect"
        self.model = os.getenv("GROQ_MODEL", "meta-llama/llama-4-scout-17b-16e-instruct")
        self.max_tokens = 500
        self.temperature = 0.7
        
        if self.groq_api_key:
            try:
                self.client = groq.Groq(api_key=self.groq_api_key)
            except Exception as e:
                logger.error(f"Error initializing Groq client: {str(e)}")
                logger.warning("Groq client unavailable. AI responses will be disabled.")
                self.client = None
        else:
            self.client = None
            logger.warning("Groq API key not found. AI responses will be disabled.")

    def get_ai_response(self, prompt, character=None):
        """Get a responsive, in-character response from Groq"""
        if not self.client:
            return "I'm sorry, I couldn't process that response."
            
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

            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": f"You are an AI language learning assistant in a game about planning a cultural event. {character_prompt}"},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=self.max_tokens,
                temperature=self.temperature
            )

            return response.choices[0].message.content

        except Exception as e:
            logger.error(f"Error getting AI response: {str(e)}")
            return "I'm sorry, I couldn't process that response."

    def check_with_sapling_api(self, text):
        """
        Check if text is AI-generated using Sapling's AI Detector API
        Returns tuple of (is_ai_generated, score, reasons)
        """
        # Skip API call for very short texts
        if len(text) < 50:
            return (False, 0, ["Text too short for reliable detection"])
        
        try:
            if not self.sapling_api_key:
                logger.info("Sapling API key not found. Falling back to local detection.")
                return self._is_ai_generated_local(text)
                
            # Prepare the request
            payload = {
                "key": self.sapling_api_key,
                "text": text,
                "options": {
                    "detail": True,  # Get detailed explanations
                }
            }
            
            # Make the API call
            response = requests.post(self.sapling_api_url, json=payload)
            
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
                logger.error(f"Sapling API error: {response.status_code}")
                logger.error(f"Response: {response.text}")
                
                # Fall back to local detection
                return self._is_ai_generated_local(text)
                
        except Exception as e:
            logger.error(f"Error with Sapling API: {str(e)}")
            # Fall back to local detection
            return self._is_ai_generated_local(text)

    def _is_ai_generated_local(self, text):
        """
        Local AI detection using simple heuristics as fallback
        Returns a tuple (is_generated_by_ai, score, details).
        """
        import re
        import math
        from collections import Counter
        
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