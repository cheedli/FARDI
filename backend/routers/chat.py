"""
Chat System — migrated from Flask inline routes (app.py) to FastAPI.
Student-admin messaging with conversations, messages, and unread counts.
"""

import logging
from fastapi import APIRouter, Depends, Request, HTTPException
from dependencies import db_manager
from auth_utils import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/chat", tags=["chat"])

# ──────────────────────────────────────────────────────────────────
#  Table initialization (runs at import time, same as Flask version)
# ──────────────────────────────────────────────────────────────────

def init_chat_tables():
    """Create chat tables if they don't exist"""
    conn = db_manager.get_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS chat_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sender_id INTEGER NOT NULL,
            receiver_id INTEGER NOT NULL,
            message TEXT NOT NULL,
            is_read INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (sender_id) REFERENCES users(id),
            FOREIGN KEY (receiver_id) REFERENCES users(id)
        )
    ''')
    conn.commit()
    conn.close()

init_chat_tables()

# ──────────────────────────────────────────────────────────────────
#  Endpoints
# ──────────────────────────────────────────────────────────────────

@router.get("/conversations")
async def chat_conversations(user: dict = Depends(get_current_user)):
    """Get all conversations for the current user (admin sees all students, student sees admin)"""
    try:
        user_id = user["user_id"]
        is_admin = user.get("is_admin")
        conn = db_manager.get_connection()

        if is_admin:
            # Admin sees all students they have conversations with, plus all students for starting new convos
            conversations = conn.execute('''
                SELECT
                    u.id as user_id,
                    u.username,
                    u.first_name,
                    u.last_name,
                    (SELECT message FROM chat_messages
                     WHERE (sender_id = u.id AND receiver_id = ?) OR (sender_id = ? AND receiver_id = u.id)
                     ORDER BY created_at DESC LIMIT 1) as last_message,
                    (SELECT created_at FROM chat_messages
                     WHERE (sender_id = u.id AND receiver_id = ?) OR (sender_id = ? AND receiver_id = u.id)
                     ORDER BY created_at DESC LIMIT 1) as last_message_at,
                    (SELECT COUNT(*) FROM chat_messages
                     WHERE sender_id = u.id AND receiver_id = ? AND is_read = 0) as unread_count
                FROM users u
                WHERE u.is_admin = 0
                ORDER BY last_message_at DESC NULLS LAST, u.first_name ASC
            ''', (user_id, user_id, user_id, user_id, user_id)).fetchall()
        else:
            # Student sees only admin conversations
            conversations = conn.execute('''
                SELECT
                    u.id as user_id,
                    u.username,
                    u.first_name,
                    u.last_name,
                    (SELECT message FROM chat_messages
                     WHERE (sender_id = u.id AND receiver_id = ?) OR (sender_id = ? AND receiver_id = u.id)
                     ORDER BY created_at DESC LIMIT 1) as last_message,
                    (SELECT created_at FROM chat_messages
                     WHERE (sender_id = u.id AND receiver_id = ?) OR (sender_id = ? AND receiver_id = u.id)
                     ORDER BY created_at DESC LIMIT 1) as last_message_at,
                    (SELECT COUNT(*) FROM chat_messages
                     WHERE sender_id = u.id AND receiver_id = ? AND is_read = 0) as unread_count
                FROM users u
                WHERE u.is_admin = 1
                ORDER BY last_message_at DESC NULLS LAST
            ''', (user_id, user_id, user_id, user_id, user_id)).fetchall()

        return {
            'success': True,
            'data': [{
                'user_id': c['user_id'],
                'username': c['username'],
                'first_name': c['first_name'],
                'last_name': c['last_name'],
                'last_message': c['last_message'],
                'last_message_at': c['last_message_at'],
                'unread_count': c['unread_count'] or 0,
            } for c in conversations]
        }
    except Exception as e:
        logger.error(f"Error getting conversations: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/messages/{other_user_id}")
async def chat_get_messages(other_user_id: int, user: dict = Depends(get_current_user)):
    """Get messages between current user and another user"""
    try:
        user_id = user["user_id"]
        conn = db_manager.get_connection()

        messages = conn.execute('''
            SELECT id, sender_id, receiver_id, message, is_read, created_at
            FROM chat_messages
            WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
            ORDER BY created_at ASC
        ''', (user_id, other_user_id, other_user_id, user_id)).fetchall()

        # Mark messages from the other user as read
        conn.execute('''
            UPDATE chat_messages SET is_read = 1
            WHERE sender_id = ? AND receiver_id = ? AND is_read = 0
        ''', (other_user_id, user_id))
        conn.commit()

        return {
            'success': True,
            'data': [{
                'id': m['id'],
                'sender_id': m['sender_id'],
                'receiver_id': m['receiver_id'],
                'message': m['message'],
                'is_read': bool(m['is_read']),
                'created_at': m['created_at'],
                'is_mine': m['sender_id'] == user_id,
            } for m in messages]
        }
    except Exception as e:
        logger.error(f"Error getting messages: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/send")
async def chat_send_message(request: Request, user: dict = Depends(get_current_user)):
    """Send a message to another user"""
    try:
        user_id = user["user_id"]
        data = await request.json()
        receiver_id = data.get('receiver_id')
        message = data.get('message', '').strip()

        if not receiver_id or not message:
            raise HTTPException(status_code=400, detail="receiver_id and message are required")

        if len(message) > 2000:
            raise HTTPException(status_code=400, detail="Message too long (max 2000 characters)")

        conn = db_manager.get_connection()

        # Verify receiver exists
        receiver = conn.execute('SELECT id, is_admin FROM users WHERE id = ?', (receiver_id,)).fetchone()
        if not receiver:
            raise HTTPException(status_code=404, detail="User not found")

        conn.execute('''
            INSERT INTO chat_messages (sender_id, receiver_id, message)
            VALUES (?, ?, ?)
        ''', (user_id, receiver_id, message))
        conn.commit()

        return {'success': True}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error sending message: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/unread-count")
async def chat_unread_count(user: dict = Depends(get_current_user)):
    """Get total unread message count for current user"""
    try:
        user_id = user["user_id"]
        conn = db_manager.get_connection()
        result = conn.execute(
            'SELECT COUNT(*) as count FROM chat_messages WHERE receiver_id = ? AND is_read = 0',
            (user_id,)
        ).fetchone()
        return {'success': True, 'count': result['count'] or 0}
    except Exception as e:
        logger.error(f"Error getting unread count: {e}")
        raise HTTPException(status_code=500, detail=str(e))
