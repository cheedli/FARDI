# FARDI Documentation

Complete documentation for the FARDI CEFR Language Assessment Platform.

## Documents

| File | Title | Size | Description |
|------|-------|------|-------------|
| [01-overview.md](01-overview.md) | Platform Overview | 15 KB | What FARDI is, CEFR framework, learning journey, gamification, tech stack |
| [02-architecture.md](02-architecture.md) | Technical Architecture | 40 KB | Directory structure, FastAPI bootstrap, auth flow, DB schema, services, frontend architecture |
| [03-phase-system.md](03-phase-system.md) | Phase & Scoring System | 21 KB | Phase/step/interaction structure, scoring thresholds, remedial chains, backend endpoints |
| [04-exercise-types.md](04-exercise-types.md) | Exercise Components | 55 KB | All 18+ exercise types: props, scoring logic, CEFR level usage, ASCII mockups |
| [05-api-reference.md](05-api-reference.md) | API Reference | 63 KB | Every backend endpoint: method, auth, request/response schema, errors |
| [06-frontend-components.md](06-frontend-components.md) | Frontend Components | 23 KB | Route structure, page hierarchy, shared components, context providers, hooks |
| [07-theming-and-design.md](07-theming-and-design.md) | Theming & Design System | 27 KB | Clay/bento theme, colors, typography, MUI config, avatars, badges, adding new pages |
| [08-setup-and-deployment.md](08-setup-and-deployment.md) | Setup & Deployment | 16 KB | Local dev setup, env vars, DB, production build, PyInstaller/Electron, troubleshooting |
| [09-developer-guide.md](09-developer-guide.md) | Developer Guide | 26 KB | How to add phases/exercises/NPCs, AI assessment internals, session management, technical debt |

## Quick Navigation

**New to the project?** Start with [01-overview.md](01-overview.md) → [02-architecture.md](02-architecture.md) → [08-setup-and-deployment.md](08-setup-and-deployment.md)

**Frontend developer?** Read [06-frontend-components.md](06-frontend-components.md) → [07-theming-and-design.md](07-theming-and-design.md) → [04-exercise-types.md](04-exercise-types.md)

**Backend developer?** Read [02-architecture.md](02-architecture.md) → [05-api-reference.md](05-api-reference.md) → [03-phase-system.md](03-phase-system.md)

**Adding new content?** Read [09-developer-guide.md](09-developer-guide.md)

## Stack at a Glance

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Material-UI v5, React Router |
| Backend | FastAPI (Python), SQLite, SQLAlchemy |
| AI | Groq API (Llama 3), Sapling AI detection |
| Audio | Edge TTS (Microsoft) |
| Auth | JWT via HttpOnly cookies |
| Packaging | PyInstaller + Electron (desktop) |
