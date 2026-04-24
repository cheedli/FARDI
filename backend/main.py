from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from dotenv import load_dotenv
import os
import sys
import logging

load_dotenv()

# When packaged with PyInstaller, FARDI_DATA_DIR is set by Electron to the
# folder containing the external fardi.db. Fall back to the local file in dev.
_data_dir = os.environ.get("FARDI_DATA_DIR", os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault("FARDI_DB_PATH", os.path.join(_data_dir, "fardi.db"))

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="FARDI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5010"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Register routers ---
from routers.auth import router as auth_router
from routers.admin import router as admin_router
from routers.gamification import router as gamification_router
from routers.evaluation import router as evaluation_router
from routers.api import router as api_router
from routers.phase3 import router as phase3_router
from routers.phase4 import router as phase4_router
from routers.phase5 import router as phase5_router
from routers.phase6 import router as phase6_router
from routers.chat import router as chat_router
from routers.progress import router as progress_router

app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(gamification_router)
app.include_router(evaluation_router)
app.include_router(api_router)
app.include_router(phase3_router)
app.include_router(phase4_router)
app.include_router(phase5_router)
app.include_router(phase6_router)
app.include_router(chat_router)
app.include_router(progress_router)

# Resolve base dir: sys._MEIPASS when frozen by PyInstaller, else backend/
_base = getattr(sys, '_MEIPASS', os.path.dirname(os.path.abspath(__file__)))

# Serve static assets (avatars, audio, images)
app.mount("/static", StaticFiles(directory=os.path.join(_base, "static")), name="static")

# API-level routes must be registered before the SPA catch-all

@app.get("/api/health")
def health_check():
    return {"status": "ok"}


# /start-game must be at root level (not /api/start-game) because frontend calls it directly
from routers.api import start_game as _start_game_handler
from auth_utils import get_current_user
from fastapi import Depends


@app.api_route("/start-game", methods=["GET", "POST"])
async def start_game_root(user: dict = Depends(get_current_user)):
    return await _start_game_handler(user=user)


# Serve React SPA — must come last so the catch-all doesn't shadow API routes
_frontend_dist = os.path.join(_base, "frontend_dist")
if os.path.isdir(_frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(_frontend_dist, "assets")), name="assets")

    _frontend_images = os.path.join(_frontend_dist, "images")
    if os.path.isdir(_frontend_images):
        app.mount("/images", StaticFiles(directory=_frontend_images), name="frontend_images")

    @app.get("/", include_in_schema=False)
    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa(full_path: str = ""):
        if full_path.startswith("api/") or full_path.startswith("static/"):
            from fastapi import HTTPException
            raise HTTPException(status_code=404)
        index = os.path.join(_frontend_dist, "index.html")
        return FileResponse(index)

if __name__ == "__main__":
    import argparse
    import uvicorn
    parser = argparse.ArgumentParser()
    parser.add_argument("--host", default="0.0.0.0")
    parser.add_argument("--port", type=int, default=5010)
    args = parser.parse_args()
    if getattr(sys, 'frozen', False):
        # In a PyInstaller bundle, pass the app object directly — string import doesn't work
        uvicorn.run(app, host=args.host, port=args.port, reload=False)
    else:
        uvicorn.run("main:app", host=args.host, port=args.port, reload=True)
