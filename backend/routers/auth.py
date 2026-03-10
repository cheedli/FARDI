"""
Authentication routes - FastAPI migration of routes/auth_routes.py
Preserves exact response shapes expected by frontend/src/lib/api.jsx
"""
from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi.responses import JSONResponse
from dependencies import db_manager, user_manager, assessment_history
from auth_utils import (
    create_access_token, set_auth_cookie, clear_auth_cookie,
    get_current_user, get_current_admin, get_optional_user
)
import re
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])


# --- Validation helpers (ported from auth_routes.py) ---

def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    if not re.search(r'\d', password):
        return False, "Password must contain at least one number"
    return True, "Password is valid"

def validate_username(username):
    if len(username) < 3:
        return False, "Username must be at least 3 characters long"
    if len(username) > 20:
        return False, "Username must not exceed 20 characters"
    if not re.match(r'^[a-zA-Z0-9_]+$', username):
        return False, "Username can only contain letters, numbers, and underscores"
    return True, "Username is valid"


# --- API Endpoints (JSON only, no templates) ---

@router.get("/api/me")
async def api_me(request: Request):
    """Get current user session info. Frontend calls this on app load."""
    user = await get_optional_user(request)
    if user:
        return {
            "authenticated": True,
            "user": {
                "id": user["user_id"],
                "username": user["username"],
                "email": user.get("email"),
                "first_name": user.get("first_name"),
                "last_name": user.get("last_name"),
                "is_admin": user.get("is_admin", False),
                "role": user.get("role", "user"),
            }
        }
    return {"authenticated": False, "user": None}


@router.post("/api/login")
async def api_login(request: Request):
    """SPA JSON login. Frontend sends username_or_email + password."""
    try:
        data = await request.json()
        username_or_email = (data.get("username_or_email") or "").strip()
        password = data.get("password") or ""

        if not username_or_email or not password:
            return JSONResponse({"success": False, "error": "Missing credentials"}, status_code=400)

        user = user_manager.authenticate_user(username_or_email, password)
        if not user:
            return JSONResponse({"success": False, "error": "Invalid username/email or password"}, status_code=401)

        token = create_access_token({
            "user_id": user["id"],
            "username": user["username"],
            "email": user.get("email", ""),
            "first_name": user.get("first_name", ""),
            "last_name": user.get("last_name", ""),
            "is_admin": bool(user.get("is_admin", False)),
            "role": user.get("role", "user"),
        })

        redirect_url = "/admin" if user.get("is_admin") else "/dashboard"
        response = JSONResponse({
            "success": True,
            "redirect_url": redirect_url,
            "user": {
                "id": user["id"],
                "username": user["username"],
                "email": user.get("email"),
                "first_name": user.get("first_name"),
                "last_name": user.get("last_name"),
                "is_admin": bool(user.get("is_admin", False)),
                "role": user.get("role", "user"),
            }
        })
        set_auth_cookie(response, token)
        return response
    except Exception as e:
        logger.error(f"Error in api_login: {str(e)}")
        return JSONResponse({"success": False, "error": "Server error"}, status_code=500)


@router.post("/api/signup")
async def api_signup(request: Request):
    """SPA JSON signup. Validates then creates user + auto-login."""
    try:
        data = await request.json()
        username = (data.get("username") or "").strip()
        email = (data.get("email") or "").strip().lower()
        password = data.get("password") or ""
        first_name = (data.get("first_name") or "").strip()
        last_name = (data.get("last_name") or "").strip()

        # Validation
        errors = []
        un_ok, un_msg = validate_username(username)
        if not un_ok:
            errors.append(un_msg)
        if not email:
            errors.append("Email is required")
        elif not validate_email(email):
            errors.append("Invalid email format")
        pw_ok, pw_msg = validate_password(password)
        if not pw_ok:
            errors.append(pw_msg)
        if errors:
            return JSONResponse({"success": False, "error": errors[0]}, status_code=400)

        user_data, error = user_manager.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name or None,
            last_name=last_name or None,
        )

        if not user_data:
            return JSONResponse({"success": False, "error": error or "Signup failed"}, status_code=400)

        # Auto-login via JWT
        token = create_access_token({
            "user_id": user_data["id"],
            "username": user_data["username"],
            "email": user_data["email"],
            "first_name": user_data.get("first_name", ""),
            "last_name": user_data.get("last_name", ""),
            "is_admin": False,
            "role": "user",
        })

        response = JSONResponse({
            "success": True,
            "user": {
                "id": user_data["id"],
                "username": user_data["username"],
                "email": user_data["email"],
                "first_name": user_data.get("first_name"),
                "last_name": user_data.get("last_name"),
                "is_admin": False,
                "role": "user",
            }
        })
        set_auth_cookie(response, token)
        return response
    except Exception as e:
        logger.error(f"Error in api_signup: {str(e)}")
        return JSONResponse({"success": False, "error": "Server error"}, status_code=500)


@router.get("/logout")
async def logout():
    """Logout by clearing the JWT cookie and redirecting to home."""
    from fastapi.responses import RedirectResponse
    response = RedirectResponse(url="/", status_code=302)
    clear_auth_cookie(response)
    return response


@router.post("/api/change-password")
async def api_change_password(request: Request, user: dict = Depends(get_current_user)):
    """Change password for authenticated user."""
    try:
        data = await request.json()
        current_password = data.get("current_password", "")
        new_password = data.get("new_password", "")
        confirm_password = data.get("confirm_password", "")

        if not current_password:
            return JSONResponse({"success": False, "error": "Please enter your current password"}, status_code=400)

        pw_ok, pw_msg = validate_password(new_password)
        if not pw_ok:
            return JSONResponse({"success": False, "error": pw_msg}, status_code=400)

        if confirm_password and new_password != confirm_password:
            return JSONResponse({"success": False, "error": "New passwords do not match"}, status_code=400)

        success, message = user_manager.change_password(user["user_id"], current_password, new_password)
        if success:
            return {"success": True, "message": "Password changed successfully"}
        return JSONResponse({"success": False, "error": message}, status_code=400)
    except Exception as e:
        logger.error(f"Error in change_password: {str(e)}")
        return JSONResponse({"success": False, "error": "Server error"}, status_code=500)


@router.get("/api/profile")
async def api_profile(user: dict = Depends(get_current_user)):
    """Get user profile data."""
    try:
        user_data = user_manager.get_user_by_id(user["user_id"])
        if not user_data:
            raise HTTPException(status_code=404, detail="User not found")

        # Get user statistics
        try:
            user_stats = assessment_history.get_user_stats(user["user_id"])
        except Exception as e:
            logger.error(f"Error getting user stats: {str(e)}")
            user_stats = {}

        try:
            recent_assessments = assessment_history.get_user_assessments(user["user_id"], limit=5)
        except Exception as e:
            logger.error(f"Error getting recent assessments: {str(e)}")
            recent_assessments = []

        return {
            "success": True,
            "user": {
                "id": user_data["id"],
                "username": user_data["username"],
                "email": user_data["email"],
                "first_name": user_data.get("first_name"),
                "last_name": user_data.get("last_name"),
                "created_at": user_data.get("created_at"),
                "role": user_data.get("role", "user"),
                "is_admin": bool(user_data.get("is_admin")),
                "preferred_language": user_data.get("preferred_language", "en"),
                "timezone": user_data.get("timezone", "UTC"),
            },
            "stats": user_stats,
            "recent_assessments": recent_assessments,
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in profile: {str(e)}")
        return JSONResponse({"success": False, "error": "Server error"}, status_code=500)


@router.post("/api/edit-profile")
async def api_edit_profile(request: Request, user: dict = Depends(get_current_user)):
    """Edit user profile fields."""
    try:
        data = await request.json()
        first_name = (data.get("first_name") or "").strip()
        last_name = (data.get("last_name") or "").strip()
        email = (data.get("email") or "").strip().lower()
        preferred_language = data.get("preferred_language", "en")
        timezone = data.get("timezone", "UTC")

        # Validate email if changed
        user_data = user_manager.get_user_by_id(user["user_id"])
        if email and email != user_data.get("email"):
            if not validate_email(email):
                return JSONResponse({"success": False, "error": "Invalid email format"}, status_code=400)
            existing = user_manager.get_user_by_email(email)
            if existing and existing["id"] != user["user_id"]:
                return JSONResponse({"success": False, "error": "Email already registered"}, status_code=409)

        success = user_manager.update_user(
            user["user_id"],
            first_name=first_name or None,
            last_name=last_name or None,
            email=email or user_data.get("email"),
            preferred_language=preferred_language,
            timezone=timezone,
        )

        if success:
            # Return updated token with new user data so frontend stays in sync
            updated_user = user_manager.get_user_by_id(user["user_id"])
            token = create_access_token({
                "user_id": updated_user["id"],
                "username": updated_user["username"],
                "email": updated_user["email"],
                "first_name": updated_user.get("first_name", ""),
                "last_name": updated_user.get("last_name", ""),
                "is_admin": bool(updated_user.get("is_admin", False)),
                "role": updated_user.get("role", "user"),
            })
            response = JSONResponse({"success": True, "message": "Profile updated"})
            set_auth_cookie(response, token)
            return response
        return JSONResponse({"success": False, "error": "Update failed"}, status_code=500)
    except Exception as e:
        logger.error(f"Error in edit_profile: {str(e)}")
        return JSONResponse({"success": False, "error": "Server error"}, status_code=500)


@router.post("/api/delete-account")
async def api_delete_account(request: Request, user: dict = Depends(get_current_user)):
    """Delete (deactivate) user account."""
    try:
        data = await request.json()
        password = data.get("password", "")
        confirmation = data.get("confirmation", "")

        if confirmation != "DELETE":
            return JSONResponse({"success": False, "error": 'Please type "DELETE" to confirm'}, status_code=400)

        user_data = user_manager.get_user_by_id(user["user_id"])
        if not user_manager.verify_password(password, user_data["password_hash"]):
            return JSONResponse({"success": False, "error": "Incorrect password"}, status_code=400)

        success = user_manager.deactivate_user(user["user_id"])
        if success:
            response = JSONResponse({"success": True, "message": "Account deleted"})
            clear_auth_cookie(response)
            return response
        return JSONResponse({"success": False, "error": "Deletion failed"}, status_code=500)
    except Exception as e:
        logger.error(f"Error in delete_account: {str(e)}")
        return JSONResponse({"success": False, "error": "Server error"}, status_code=500)


@router.get("/api/check-username")
async def check_username(request: Request):
    """Check username availability (no auth required)."""
    try:
        username = (request.query_params.get("username") or "").strip()
        if not username:
            return {"available": False, "message": "Username is required"}

        un_ok, un_msg = validate_username(username)
        if not un_ok:
            return {"available": False, "message": un_msg}

        conn = db_manager.get_connection()
        try:
            cursor = conn.execute("SELECT id FROM users WHERE LOWER(username) = LOWER(?)", (username,))
            existing = cursor.fetchone()
            available = existing is None
            return {"available": available, "message": "Username is available" if available else "Username is already taken"}
        finally:
            conn.close()
    except Exception as e:
        logger.error(f"Error checking username: {str(e)}")
        return {"available": False, "message": "Server error"}


@router.get("/api/check-email")
async def check_email(request: Request):
    """Check email availability (no auth required)."""
    try:
        email = (request.query_params.get("email") or "").strip().lower()
        if not email:
            return {"available": False, "message": "Email is required"}

        if not validate_email(email):
            return {"available": False, "message": "Invalid email format"}

        conn = db_manager.get_connection()
        try:
            cursor = conn.execute("SELECT id FROM users WHERE LOWER(email) = LOWER(?)", (email,))
            existing = cursor.fetchone()
            available = existing is None
            return {"available": available, "message": "Email is available" if available else "Email is already registered"}
        finally:
            conn.close()
    except Exception as e:
        logger.error(f"Error checking email: {str(e)}")
        return {"available": False, "message": "Server error"}


@router.get("/api/debug/db-test")
async def debug_db_test():
    """Debug endpoint to test database connectivity."""
    try:
        conn = db_manager.get_connection()
        try:
            cursor = conn.execute("SELECT COUNT(*) as count FROM users")
            result = cursor.fetchone()
            user_count = result["count"] if result else 0

            cursor = conn.execute("PRAGMA table_info(users)")
            columns = [row["name"] for row in cursor.fetchall()]

            return {
                "status": "success",
                "user_count": user_count,
                "table_columns": columns,
                "message": "Database connection successful",
            }
        finally:
            conn.close()
    except Exception as e:
        logger.error(f"Debug endpoint error: {str(e)}")
        return JSONResponse({"status": "error", "message": f"Connection error: {str(e)}"}, status_code=500)
