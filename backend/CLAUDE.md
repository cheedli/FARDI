# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
```bash
# Navigate to backend directory
cd backend

# Start the Flask application
python app.py

# Install dependencies
pip install -r requirements.txt

# Set up virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### Environment Setup
- Copy `.env.example` to `.env` and configure:
  - `GROQ_API_KEY`: Required for AI-powered language assessment
  - `SAPLING_API_KEY`: Optional for AI content detection
  - `SECRET_KEY`: Flask session security

## Architecture Overview

This is a Flask-based CEFR (Common European Framework of Reference for Languages) assessment game with a modular service-oriented architecture:

### Core Application Structure
- **`app.py`**: Main Flask application with route definitions and session management
- **`config.py`**: Configuration classes for different environments (development, production, testing)
- **`requirements.txt`**: Python dependencies (note: file appears to have encoding issues)

### Service Layer (`services/`)
- **`ai_service.py`**: Groq API integration for AI responses and Sapling API for AI detection
- **`assessment_service.py`**: CEFR level assessment logic and listening comprehension evaluation
- **`audio_service.py`**: Edge TTS integration for text-to-speech generation

### Data Layer (`models/`)
- **`game_data.py`**: Game constants including NPCs, dialogue questions, CEFR levels, achievements, and badges
- **`auth.py`**: User authentication and database models

### Routing (`routes/`)
- **`auth_routes.py`**: Authentication endpoints and user management
- **`api_routes.py`**: API endpoints for AI feedback, language tips, and audio generation

### Utilities (`utils/`)
- **`helpers.py`**: Helper functions for level determination, skill assessment, and XP calculation

## Game Flow Architecture

The application follows a structured assessment flow:
1. User authentication and session management
2. 9-step dialogue sequence with different NPCs
3. Real-time CEFR assessment of each response
4. AI-powered feedback generation
5. Overall assessment and certificate generation

## Key Technical Patterns

### Session Management
- Filesystem-based sessions stored in `sessions/` directory
- 30-day persistent sessions for "remember me" functionality
- Session data includes game state, user responses, and assessment results

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

- SQLite database (`fardi.db`) for user data and assessment history
- Filesystem sessions for temporary game state
- Static file organization for avatars, audio, and assets

## Development Notes

- The application uses a blueprint pattern for authentication routes
- Game data is centralized in `models/game_data.py` for easy modification
- Assessment prompts and criteria are defined in the service layer
- Character avatars are SVG files stored in `static/images/avatars/`
- The system supports multiple environments through config classes

## API Integration Points

- `/api/get-ai-feedback`: Real-time response evaluation
- `/api/language-tips`: Personalized learning recommendations
- `/api/check-ai-response`: AI content detection
- `/api/generate-audio`: Custom audio generation

This architecture supports a scalable language assessment platform with clear separation of concerns between game logic, AI services, and user management.

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

# Development server
npm run dev

# Production build
npm run build

# Preview build
npm run preview
```

### Design System Updates (Latest)
The frontend has been completely modernized with a professional design system:

#### Theme Enhancements (`frontend/src/theme.jsx`)
- **Modern Color Palette**: Blue and purple gradients with proper contrast ratios
- **Typography**: Inter font family with 8 weight variations (800, 700, 600, 400)
- **Shadows**: 24-level shadow system with theme-aware variations
- **Components**: Enhanced MUI component styling with modern aesthetics
- **Dark Mode**: Full dark mode support with proper color adaptations

#### Page Redesigns
- **Home Page** (`frontend/src/pages/Home.jsx`): 
  - Modern gradient hero section with professional typography
  - Feature showcase with hover animations and gradient cards
  - Call-to-action sections with glass morphism effects
  - Responsive design optimized for all devices
  
- **Welcome Page** (`frontend/src/pages/Welcome.jsx`):
  - Professional welcome hero with gradient backgrounds
  - Three-step process explanation with modern card design
  - Glass morphism effects and subtle animations
  - Optimized for conversion and user engagement

- **Layout Component** (`frontend/src/components/Layout.jsx`):
  - Modern navigation with blur backdrop effects
  - Hide-on-scroll functionality for better UX
  - User avatar and profile integration
  - Responsive navigation patterns

- **Authentication Pages**:
  - **Login** (`frontend/src/pages/Login.jsx`): Clean, centered design with gradient backgrounds
  - **Signup** (`frontend/src/pages/Signup.jsx`): Multi-step form with real-time validation

#### Technical Fixes Applied
- **Stack Overflow Resolution**: Removed complex animation components causing infinite loops
- **Performance**: Simplified component structure for better rendering performance  
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Mobile Optimization**: Touch-friendly interactions and responsive typography

### Routes Served by Flask
- **`/app/`**: Main React SPA entry point (Home page)
- **`/app/welcome`**: Welcome page for unauthenticated users
- **`/app/*`**: All other React routes served as SPA

### Build Process
The Flask application serves the React build from `../frontend/dist/` via the `/app` route. After making frontend changes:
1. Run `npm run build` in the frontend directory
2. Restart `python app.py` in the backend directory to serve updated build
3. Access modernized pages at `http://localhost:5010/app/` and `http://localhost:5010/app/welcome`

### Current Status
✅ **Completed**: Modern, professional design system implementation
✅ **Resolved**: Maximum call stack errors and performance issues
✅ **Ready**: Production-ready frontend with stable, modern design
🔄 **Next**: Dashboard modernization and additional page enhancements

<claude-mem-context>
# Recent Activity

<!-- This section is auto-generated by claude-mem. Edit content outside the tags. -->

*No recent activity*
</claude-mem-context>