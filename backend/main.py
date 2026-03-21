from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
import os
import logging

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="FARDI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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

# Serve static files (avatars, audio, images)
app.mount("/static", StaticFiles(directory="static"), name="static")

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=5010, reload=True)
