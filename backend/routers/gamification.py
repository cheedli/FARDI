"""
Gamification API Routes - FastAPI migration of routes/gamification_routes.py
Endpoints for XP, achievements, streaks, and progression.
Preserves exact response shapes and URL paths from Flask blueprint.
"""
from fastapi import APIRouter, Depends, Request, HTTPException, Query
from fastapi.responses import JSONResponse
from dependencies import db_manager
from auth_utils import get_current_user
from services.xp_service import XPService
from services.achievement_service import AchievementService
from services.streak_service import StreakService
from models.gamification_data import PLAYER_LEVELS, ACHIEVEMENTS, RARITY_TIERS
import sqlite3
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/gamification", tags=["gamification"])


def get_db_connection():
    """Get database connection"""
    conn = sqlite3.connect('fardi.db')
    conn.row_factory = sqlite3.Row
    return conn


# ============================================================
# PROGRESSION & XP ENDPOINTS
# ============================================================

@router.get('/progression')
async def get_progression(user: dict = Depends(get_current_user)):
    """Get user's current progression and XP"""
    user_id = user["user_id"]
    conn = get_db_connection()

    try:
        xp_service = XPService(conn)
        progression = xp_service.get_user_progression(user_id)
        return progression
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()


@router.get('/xp/history')
async def get_xp_history(
    user: dict = Depends(get_current_user),
    limit: int = Query(default=50)
):
    """Get user's XP transaction history"""
    user_id = user["user_id"]

    conn = get_db_connection()
    try:
        xp_service = XPService(conn)
        history = xp_service.get_xp_history(user_id, limit)
        return {"history": history, "total": len(history)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()


@router.get('/xp/daily')
async def get_daily_xp(user: dict = Depends(get_current_user)):
    """Get XP earned today"""
    user_id = user["user_id"]
    conn = get_db_connection()

    try:
        xp_service = XPService(conn)
        daily_xp = xp_service.get_daily_xp(user_id)
        return {"daily_xp": daily_xp}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()


@router.get('/levels')
async def get_all_levels():
    """Get information about all player levels"""
    return {"levels": PLAYER_LEVELS}


# ============================================================
# ACHIEVEMENT ENDPOINTS
# ============================================================

@router.get('/achievements')
async def get_achievements(
    user: dict = Depends(get_current_user),
    include_locked: str = Query(default="false")
):
    """Get user's achievements (unlocked and optionally locked)"""
    user_id = user["user_id"]
    include_locked_bool = include_locked.lower() == 'true'

    conn = get_db_connection()
    try:
        achievement_service = AchievementService(conn)
        achievements = achievement_service.get_user_achievements(user_id, include_locked_bool)
        return achievements
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()


@router.get('/achievements/unseen')
async def get_unseen_achievements(user: dict = Depends(get_current_user)):
    """Get achievements that haven't been shown to the user yet"""
    user_id = user["user_id"]
    conn = get_db_connection()

    try:
        achievement_service = AchievementService(conn)
        unseen = achievement_service.get_unseen_achievements(user_id)
        return {"achievements": unseen}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()


@router.post('/achievements/seen')
async def mark_achievements_seen(
    request: Request,
    user: dict = Depends(get_current_user)
):
    """Mark achievements as seen"""
    user_id = user["user_id"]
    data = await request.json()
    achievement_ids = data.get('achievement_ids', [])

    if not achievement_ids:
        raise HTTPException(status_code=400, detail="No achievement IDs provided")

    conn = get_db_connection()
    try:
        achievement_service = AchievementService(conn)
        achievement_service.mark_achievements_seen(user_id, achievement_ids)
        return {"success": True, "marked_seen": len(achievement_ids)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()


@router.get('/achievements/catalog')
async def get_achievement_catalog():
    """Get all available achievements with rarity info"""
    catalog = []
    for ach_id, ach_data in ACHIEVEMENTS.items():
        catalog.append({
            "achievement_id": ach_id,
            "name": ach_data["name"],
            "description": ach_data["description"],
            "icon": ach_data["icon"],
            "rarity": ach_data["rarity"],
            "xp_reward": ach_data["xp_reward"]
        })

    return {
        "achievements": catalog,
        "total": len(catalog),
        "rarity_tiers": RARITY_TIERS
    }


@router.get('/achievements/{achievement_id}/progress')
async def get_achievement_progress(
    achievement_id: str,
    user: dict = Depends(get_current_user)
):
    """Get progress toward a specific achievement"""
    user_id = user["user_id"]
    conn = get_db_connection()

    try:
        achievement_service = AchievementService(conn)
        progress = achievement_service.get_achievement_progress(user_id, achievement_id)
        return progress
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()


# ============================================================
# STREAK ENDPOINTS
# ============================================================

@router.get('/streak')
async def get_streak_status(user: dict = Depends(get_current_user)):
    """Get user's current streak status"""
    user_id = user["user_id"]
    conn = get_db_connection()

    try:
        streak_service = StreakService(conn)
        status = streak_service.get_streak_status(user_id)
        return status
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()


@router.post('/streak/record')
async def record_activity(user: dict = Depends(get_current_user)):
    """Record user activity and update streak"""
    user_id = user["user_id"]
    conn = get_db_connection()

    try:
        streak_service = StreakService(conn)
        result = streak_service.record_activity(user_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()


@router.post('/streak/freeze')
async def use_freeze_token(user: dict = Depends(get_current_user)):
    """Use a streak freeze token"""
    user_id = user["user_id"]
    conn = get_db_connection()

    try:
        streak_service = StreakService(conn)
        result = streak_service.use_freeze_token(user_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()


@router.post('/streak/freeze/purchase')
async def purchase_freeze_token(user: dict = Depends(get_current_user)):
    """Purchase a freeze token with XP"""
    user_id = user["user_id"]
    conn = get_db_connection()

    try:
        streak_service = StreakService(conn)
        result = streak_service.purchase_freeze_token(user_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()


@router.get('/streak/statistics')
async def get_streak_statistics(user: dict = Depends(get_current_user)):
    """Get detailed streak statistics"""
    user_id = user["user_id"]
    conn = get_db_connection()

    try:
        streak_service = StreakService(conn)
        stats = streak_service.get_streak_statistics(user_id)
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()


@router.get('/streak/leaderboard')
async def get_streak_leaderboard(limit: int = Query(default=10)):
    """Get streak leaderboard"""
    conn = get_db_connection()

    try:
        streak_service = StreakService(conn)
        leaderboard = streak_service.get_streak_leaderboard(limit)
        return {"leaderboard": leaderboard}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()


# ============================================================
# DASHBOARD ENDPOINT
# ============================================================

@router.get('/dashboard')
async def get_dashboard(user: dict = Depends(get_current_user)):
    """Get comprehensive gamification dashboard data"""
    user_id = user["user_id"]
    conn = get_db_connection()

    try:
        xp_service = XPService(conn)
        achievement_service = AchievementService(conn)
        streak_service = StreakService(conn)

        # Get all data
        progression = xp_service.get_user_progression(user_id)
        daily_xp = xp_service.get_daily_xp(user_id)
        achievements = achievement_service.get_user_achievements(user_id, include_locked=False)
        unseen_achievements = achievement_service.get_unseen_achievements(user_id)
        streak = streak_service.get_streak_status(user_id)

        dashboard = {
            "progression": progression,
            "daily_xp": daily_xp,
            "achievements": {
                "total_unlocked": achievements["total_unlocked"],
                "total_available": achievements["total_available"],
                "completion_percentage": (achievements["total_unlocked"] / achievements["total_available"] * 100)
                if achievements["total_available"] > 0 else 0,
                "recent": achievements["unlocked"][:5]  # Last 5 unlocked
            },
            "unseen_achievements": unseen_achievements,
            "streak": streak
        }

        return dashboard
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()


# ============================================================
# INTERNAL ENDPOINTS (for activity completion)
# ============================================================

@router.post('/internal/award-activity-xp')
async def award_activity_xp(
    request: Request,
    user: dict = Depends(get_current_user)
):
    """
    Internal endpoint to award XP when an activity is completed.
    Called by the main assessment routes.
    """
    user_id = user["user_id"]
    data = await request.json()

    activity_type = data.get('activity_type')
    activity_id = data.get('activity_id')
    is_perfect = data.get('is_perfect', False)
    is_first_try = data.get('is_first_try', False)
    speed_bonus = data.get('speed_bonus', False)

    if not activity_type or not activity_id:
        raise HTTPException(status_code=400, detail="Missing required fields")

    conn = get_db_connection()
    try:
        xp_service = XPService(conn)
        achievement_service = AchievementService(conn)

        # Award XP
        xp_result = xp_service.award_activity_xp(
            user_id=user_id,
            activity_type=activity_type,
            activity_id=activity_id,
            is_perfect=is_perfect,
            is_first_try=is_first_try,
            speed_bonus=speed_bonus
        )

        # Check for achievement unlocks
        event_data = {
            "activity_type": activity_type,
            "activity_id": activity_id,
            "is_perfect": is_perfect
        }

        new_achievements = achievement_service.check_and_unlock_achievements(
            user_id=user_id,
            event_type="action_item_completed",
            event_data=event_data
        )

        result = {
            **xp_result,
            "new_achievements": new_achievements
        }

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()
