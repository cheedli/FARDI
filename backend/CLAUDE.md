# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development

```bash
# Navigate to backend directory
cd backend

# Start the FastAPI application
uvicorn main:app --reload --port 8000

# Install dependencies
pip install -r requirements-fastapi.txt

# Set up virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### Environment Setup

Copy `.env.example` to `.env` and configure:

- `GROQ_API_KEY`: Required for AI-powered language assessment
- `SAPLING_API_KEY`: Optional for AI content detection
- `SECRET_KEY`: JWT/session security

## Architecture Overview

This is a FastAPI-based CEFR (Common European Framework of Reference for Languages) assessment platform with a modular service-oriented architecture.

### Core Application Structure

- **`main.py`**: FastAPI application entry point — registers routers, CORS middleware, static file mounts
- **`config.py`**: Configuration classes for different environments (development, production, testing)
- **`dependencies.py`**: Shared FastAPI dependencies (DB session, auth)
- **`auth_utils.py`**: JWT token creation and verification helpers
- **`requirements-fastapi.txt`**: Python dependencies

### Service Layer (`services/`)

- **`ai_service.py`**: Groq API integration for AI responses and Sapling API for AI detection
- **`assessment_service.py`**: CEFR level assessment logic and listening comprehension evaluation
- **`audio_service.py`**: Edge TTS integration for text-to-speech generation

### Data Layer (`models/`)

- **`game_data.py`**: Game constants including NPCs, dialogue questions, CEFR levels, achievements, and badges
- **`auth.py`**: SQLAlchemy user models and database setup

### Routing (`routers/`)

- **`auth.py`**: Authentication endpoints (register, login, JWT)
- **`admin.py`**: Admin dashboard and user management
- **`api.py`**: AI feedback, language tips, and audio generation
- **`evaluation.py`**: CEFR evaluation endpoints
- **`gamification.py`**: XP, achievements, badges
- **`progress.py`**: User progress tracking
- **`phase3.py` – `phase6.py`**: Phase-specific assessment routers
- **`chat.py`**: Chat/dialogue interaction endpoints

### Utilities (`utils/`)

- **`helpers.py`**: Helper functions for level determination, skill assessment, and XP calculation

## Game Flow Architecture

1. User authentication via JWT
2. Multi-phase dialogue sequence with AI-powered NPCs
3. Real-time CEFR assessment of each response
4. AI-powered feedback generation
5. Overall assessment and certificate generation

## Key Technical Patterns

### Authentication

- JWT-based authentication using `python-jose`
- Tokens issued at login, verified via `dependencies.py` on protected routes

### AI Integration

- Groq API for language assessment and character responses
- Fallback mechanisms when API keys are unavailable
- Sapling API for AI-generated content detection

### Audio System

- Edge TTS for character voice generation
- Character-specific voice mapping
- Audio files stored in `static/audio/`

### Assessment System

- Multi-criteria CEFR evaluation (grammar, vocabulary, coherence)
- Specialized listening comprehension assessment
- Point-based scoring system with level thresholds

## Database and Persistence

- SQLite database (`fardi.db`) for user data and assessment history — keep this file external when distributing the app
- Filesystem sessions in `sessions/` for temporary game state
- Static file organization for avatars, audio, and assets

## API Documentation

FastAPI auto-generates interactive docs at runtime:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Frontend Development

### React SPA Architecture

- **Framework**: React 18 with Vite build system
- **UI Library**: Material-UI (MUI) v5 with custom theming
- **Routing**: React Router for client-side navigation
- **State Management**: Context API for authentication and global state

### Frontend Commands

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Development server (runs on :5173)
npm run dev

# Production build
npm run build

# Preview build
npm run preview
```

### Build Process

In production, build the React app and serve `dist/` as static files via FastAPI. After making frontend changes:

1. Run `npm run build` in the `frontend/` directory
2. Restart `uvicorn main:app` in the `backend/` directory
3. Access the app at `http://localhost:8000/`
