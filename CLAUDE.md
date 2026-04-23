# FARDI - Language Assessment Platform

This is a full-stack CEFR (Common European Framework of Reference for Languages) assessment platform with separate frontend and backend components.

## Project Structure

```text
FARDI/
├── backend/          # FastAPI server
│   ├── main.py       # Main FastAPI application entry point
│   ├── config.py     # Environment and app configuration
│   ├── models/       # Database models and game data
│   ├── routers/      # API route handlers
│   ├── services/     # AI, audio, and assessment services
│   ├── utils/        # Helper functions
│   ├── static/       # Static assets
│   ├── sessions/     # Session storage
│   ├── fardi.db      # SQLite database (keep external for deployments)
│   ├── requirements-fastapi.txt
│   └── CLAUDE.md     # Backend-specific documentation
│
└── frontend/         # React SPA (Vite)
    ├── src/          # React source code
    ├── dist/         # Built files
    ├── package.json
    └── vite.config.js
```

## Quick Start

### Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements-fastapi.txt
uvicorn main:app --reload --port 8000
```

### Frontend (React SPA)

```bash
cd frontend
npm install
npm run build  # For production
# OR
npm run dev    # For development (Vite dev server on :5173)
```

## Development Workflow

1. **Backend Development**: Work in `backend/` directory
2. **Frontend Development**: Work in `frontend/` directory
3. **Full Stack**: Run backend on `:8000` and frontend dev server on `:5173`, or build frontend and serve statically via FastAPI

## Access Points

- **Backend API**: `http://localhost:8000/api/`
- **API Docs**: `http://localhost:8000/docs` (Swagger UI, auto-generated)
- **Frontend Dev**: `http://localhost:5173/`

## Documentation

- See `backend/CLAUDE.md` for backend-specific documentation
- See `frontend/CLAUDE.md` for frontend-specific documentation

## Environment Setup

Copy `backend/.env.example` to `backend/.env` and configure:

- `GROQ_API_KEY`: Required for AI-powered language assessment
- `SAPLING_API_KEY`: Optional for AI content detection
- `SECRET_KEY`: JWT/session security
