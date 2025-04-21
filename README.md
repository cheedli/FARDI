# FARDI

A Flask-based interactive language learning game where players join a cultural event planning committee in Tunisia and practice their language skills through realistic dialogues with AI characters.

## Features

- **Interactive Dialogue System**: Engage with multiple AI characters in realistic conversations
- **CEFR Level Assessment**: Automatically evaluates user responses across multiple language skills
- **Audio Integration**: Text-to-speech capabilities for listening comprehension exercises
- **Progress Tracking**: XP system, level progression, achievements, and badges
- **Personalized Feedback**: Tailored suggestions based on the player's language level
- **Certification**: Generate a completion certificate showing the player's CEFR level

## Installation

### Prerequisites

- Python 3.8 or higher
- pip package manager

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/cheedli/FARDI.git
   cd FARDI
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the project root with the following variables:
   ```
   SECRET_KEY=your_secret_key
   GROQ_API_KEY=your_groq_api_key
   GROQ_MODEL=llama-3.1-8b-instant
   ```

## Usage

1. Start the Flask development server:
   ```
   python app.py
   ```

2. Navigate to `http://localhost:5000` in your web browser

## Game Flow

1. **Introduction**: Players enter their name and are introduced to the cultural event planning committee
2. **Dialogue System**: Engage in conversations with NPC committee members
3. **Language Assessment**: Each response is evaluated for CEFR level proficiency
4. **Feedback**: Receive personalized language feedback from AI characters
5. **Progress**: Complete all stages to receive a final assessment and certificate

## Technical Components

### Language Assessment

The game uses the Groq API to assess player responses based on detailed CEFR criteria:
- Vocabulary range
- Grammar accuracy
- Fluency
- Comprehension
- Relevance

### Audio System

Edge TTS is used to generate speech for listening comprehension exercises:
- Different voice models for different characters
- Realistic audio playback for listening tasks

### Session Management

Flask-Session handles player progression:
- Responses
- Assessments
- XP and achievements
- Level progression

## CEFR Levels

The Common European Framework of Reference for Languages (CEFR) levels used in the game:

- **A1 (Beginner)**: Can understand and use familiar everyday expressions and very basic phrases
- **A2 (Elementary)**: Can communicate in simple and routine tasks requiring a direct exchange of information
- **B1 (Intermediate)**: Can deal with most situations likely to arise while traveling where the language is spoken
- **B2 (Upper Intermediate)**: Can interact with a degree of fluency that makes regular interaction with native speakers possible
- **C1 (Advanced)**: Can express ideas fluently and spontaneously without much obvious searching for expressions

## Key Functions

### Assessment Functions
- `assess_response(question, answer, question_type)`: Evaluates responses using Groq API with detailed CEFR criteria
- `assess_listening_response(expected_sentence, user_response)`: Specialized assessment for listening comprehension tasks using text similarity algorithms
- `determine_overall_level(assessment_data)`: Calculates final CEFR level using weighted scoring across all responses

### Text Analysis Functions
- `get_keyword_analysis(text)`: Analyzes vocabulary sophistication by counting basic, intermediate, and advanced words
- `get_grammar_analysis(text)`: Examines grammatical structures, conditional forms, and sentence complexity
- `get_level_assessment_prompt(question, answer, question_type)`: Creates detailed prompts for the AI assessment system

### Audio Generation Functions
- `generate_audio(text, output_path, voice)`: Creates spoken audio files using Edge TTS with character-specific voices
- `initialize_audio_files()`: Ensures all required audio files exist at application startup

### Game Logic Functions
- `calculate_achievements(assessments, start_time)`: Determines which achievements the player has earned
- `calculate_xp(assessments)`: Awards experience points based on performance and CEFR level
- `get_ai_response(prompt, character)`: Generates in-character AI responses for personalized feedback

## API Endpoints

- `/api/get-ai-feedback`: Get AI character feedback on responses
- `/api/language-tips`: Receive personalized language learning tips
- `/api/next-challenge`: Get bonus language challenges
- `/api/generate-audio`: Generate speech from text

## Dependencies

- Flask: Web framework
- Groq: Language model API for assessment
- Edge TTS: Text-to-speech synthesis
- Flask-Session: Server-side session management
- python-dotenv: Environment variable management

## Project Structure

```
FARDI/
├── app.py              # Main application file
├── static/             # Static assets (CSS, JS, images, audio)
│   ├── audio/          # Generated speech files
│   ├── css/            # Stylesheets
│   ├── js/             # JavaScript files
│   └── images/         # Game images and avatars
├── templates/          # HTML templates
│   ├── index.html      # Home page
│   ├── game.html       # Main game interface
│   └── results.html    # Assessment results page
├── sessions/           # User session data
└── requirements.txt    # Python dependencies
```

## License

MIT License