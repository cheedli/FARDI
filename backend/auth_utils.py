"""
JWT authentication utilities for FastAPI.
Replaces Flask's filesystem session-based auth with JWT tokens in httpOnly cookies.
"""
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from fastapi import Request, HTTPException, Depends, Response
from fastapi.responses import JSONResponse
import os

SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 30


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_token_from_cookie(request: Request) -> Optional[str]:
    return request.cookies.get("access_token")


def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


def set_auth_cookie(response: Response, token: str):
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        max_age=ACCESS_TOKEN_EXPIRE_DAYS * 24 * 3600,
        samesite="lax",
        secure=False,  # Set True in production with HTTPS
    )


def clear_auth_cookie(response: Response):
    response.delete_cookie(key="access_token")


# --- FastAPI Dependencies (replace Flask decorators) ---

async def get_current_user(request: Request) -> dict:
    """Replaces @login_required. Returns user payload from JWT."""
    token = get_token_from_cookie(request)
    if not token:
        raise HTTPException(status_code=401, detail="Authentication required. Please log in.")
    payload = decode_token(token)
    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload  # Contains: user_id, username, email, is_admin, role


async def get_current_admin(user: dict = Depends(get_current_user)) -> dict:
    """Replaces @admin_required. Requires authenticated admin user."""
    if not user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return user


async def get_optional_user(request: Request) -> Optional[dict]:
    """For routes that work with or without auth. Returns None if not logged in."""
    token = get_token_from_cookie(request)
    if not token:
        return None
    try:
        return decode_token(token)
    except HTTPException:
        return None
