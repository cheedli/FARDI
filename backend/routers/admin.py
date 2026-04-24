"""
Admin routes for student progress tracking, analytics, user management,
and AI evaluation monitoring — migrated from Flask to FastAPI.
"""
import csv
import io
import logging
from datetime import datetime
from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
from dependencies import db_manager, user_manager, assessment_history
from auth_utils import get_current_user, get_current_admin

logger = logging.getLogger(__name__)
router = APIRouter(tags=["admin"])


# ──────────────────────────────────────────────────────────────────
#  Helper functions (ported from app.py module-level helpers)
# ──────────────────────────────────────────────────────────────────

def get_admin_statistics() -> dict:
    """Get comprehensive admin statistics"""
    try:
        conn = db_manager.get_connection()

        # Overall stats (simplified to work with existing tables)
        total_users = conn.execute(
            'SELECT COUNT(*) as count FROM users'
        ).fetchone()['count']
        total_assessments = conn.execute(
            'SELECT COUNT(*) as count FROM assessment_results'
        ).fetchone()['count']
        total_phase2_sessions = conn.execute(
            'SELECT COUNT(DISTINCT user_id) as count FROM phase2_responses'
        ).fetchone()['count']
        avg_xp = 0  # Simplified since user_stats table doesn't exist

        # Assessment stats by level (simplified)
        assessment_stats = []  # Empty since assessments table doesn't exist

        # Recent activity (simplified to show recent user registrations)
        recent_activity = conn.execute('''
            SELECT 'registration' as type, first_name, username, 'N/A' as level,
                   0 as points, created_at as timestamp
            FROM users
            ORDER BY created_at DESC
            LIMIT 10
        ''').fetchall()

        conn.close()

        return {
            'overall': {
                'total_users': total_users,
                'total_assessments': total_assessments,
                'total_phase2_sessions': total_phase2_sessions,
                'avg_xp': avg_xp
            },
            'assessment_stats': [dict(row) for row in assessment_stats],
            'recent_activity': [dict(row) for row in recent_activity]
        }
    except Exception as e:
        logger.error(f"Error getting admin statistics: {e}")
        return {
            'overall': {
                'total_users': 0,
                'total_assessments': 0,
                'total_phase2_sessions': 0,
                'avg_xp': 0
            },
            'assessment_stats': [],
            'recent_activity': []
        }


def get_users_with_stats(page=1, per_page=20, search='', role_filter=''):
    """Get users with their stats and pagination"""
    try:
        conn = db_manager.get_connection()

        # Build query conditions
        conditions = []
        params = []

        if search:
            conditions.append(
                '(u.username LIKE ? OR u.email LIKE ? '
                'OR u.first_name LIKE ? OR u.last_name LIKE ?)'
            )
            search_term = f'%{search}%'
            params.extend([search_term, search_term, search_term, search_term])

        if role_filter:
            conditions.append('u.role = ?')
            params.append(role_filter)

        where_clause = ' WHERE ' + ' AND '.join(conditions) if conditions else ''

        # Get total count
        total_query = f'SELECT COUNT(*) as count FROM users u{where_clause}'
        total = conn.execute(total_query, params).fetchone()['count']

        # Calculate pagination
        offset = (page - 1) * per_page

        # Get users with real assessment stats
        query = f'''
            SELECT u.*, u.id as user_id,
                   COALESCE(ar.total_assessments, 0) as total_assessments,
                   COALESCE(ar.latest_level, 'N/A') as best_level,
                   COALESCE(ar.total_xp, 0) as total_xp,
                   COALESCE(p2.steps_attempted, 0) as phase2_steps_attempted,
                   COALESCE(p2.steps_completed, 0) as phase2_steps_completed
            FROM users u
            LEFT JOIN (
                SELECT ar1.user_id,
                       COUNT(*) as total_assessments,
                       ar2.overall_level as latest_level,
                       SUM(ar1.xp_earned) as total_xp
                FROM assessment_results ar1
                LEFT JOIN (
                    SELECT user_id, overall_level,
                           ROW_NUMBER() OVER (
                               PARTITION BY user_id ORDER BY completed_at DESC
                           ) as rn
                    FROM assessment_results
                ) ar2 ON ar1.user_id = ar2.user_id AND ar2.rn = 1
                GROUP BY ar1.user_id, ar2.overall_level
            ) ar ON u.id = ar.user_id
            LEFT JOIN (
                SELECT user_id,
                       COUNT(DISTINCT step_id) as steps_attempted,
                       COUNT(DISTINCT CASE WHEN step_completed = 1
                             THEN step_id END) as steps_completed
                FROM phase2_progress
                GROUP BY user_id
            ) p2 ON u.id = p2.user_id
            {where_clause}
            ORDER BY u.created_at DESC
            LIMIT ? OFFSET ?
        '''

        params.extend([per_page, offset])
        users = conn.execute(query, params).fetchall()

        conn.close()

        # Create pagination object
        pagination = {
            'page': page,
            'per_page': per_page,
            'total': total,
            'pages': (total + per_page - 1) // per_page,
            'has_prev': page > 1,
            'has_next': page * per_page < total,
            'prev_num': page - 1 if page > 1 else None,
            'next_num': page + 1 if page * per_page < total else None
        }

        # Add iter_pages as a list instead of function (for JSON serialization)
        iter_pages_list = list(
            range(max(1, page - 2), min(pagination['pages'] + 1, page + 3))
        )
        pagination['iter_pages'] = iter_pages_list

        return [dict(row) for row in users], pagination

    except Exception as e:
        logger.error(f"Error getting users with stats: {e}")
        return [], {
            'page': 1, 'pages': 1, 'total': 0,
            'has_prev': False, 'has_next': False
        }


def get_new_users_count(period='month') -> int:
    """Get count of new users in specified period"""
    try:
        conn = db_manager.get_connection()

        if period == 'month':
            date_filter = "DATE(created_at) >= DATE('now', '-30 days')"
        elif period == 'week':
            date_filter = "DATE(created_at) >= DATE('now', '-7 days')"
        else:  # today
            date_filter = "DATE(created_at) = DATE('now')"

        count = conn.execute(
            f'SELECT COUNT(*) as count FROM users WHERE {date_filter}'
        ).fetchone()['count']
        conn.close()
        return count
    except Exception as e:
        logger.error(f"Error getting new users count: {e}")
        return 0


def get_assessments_count(period='week') -> int:
    """Get count of assessments in specified period"""
    try:
        conn = db_manager.get_connection()

        if period == 'week':
            date_filter = "DATE(completed_at) >= DATE('now', '-7 days')"
        else:  # today
            date_filter = "DATE(completed_at) = DATE('now')"

        count = conn.execute(
            f'SELECT COUNT(*) as count FROM assessments WHERE {date_filter}'
        ).fetchone()['count']
        conn.close()
        return count
    except Exception as e:
        logger.error(f"Error getting assessments count: {e}")
        return 0


def get_active_users_count(period='today') -> int:
    """Get count of active users in specified period"""
    try:
        conn = db_manager.get_connection()

        if period == 'today':
            date_filter = "DATE(last_login) = DATE('now')"
        else:  # week
            date_filter = "DATE(last_login) >= DATE('now', '-7 days')"

        count = conn.execute(
            f'SELECT COUNT(*) as count FROM users WHERE {date_filter}'
        ).fetchone()['count']
        conn.close()
        return count
    except Exception as e:
        logger.error(f"Error getting active users count: {e}")
        return 0


# ──────────────────────────────────────────────────────────────────
#  API endpoints from app.py
# ──────────────────────────────────────────────────────────────────

@router.get('/api/admin/dashboard')
async def api_admin_dashboard(user: dict = Depends(get_current_admin)):
    """API endpoint for admin dashboard data"""
    try:
        conn = db_manager.get_connection()
        current_user = conn.execute(
            'SELECT is_admin, first_name, last_name, username '
            'FROM users WHERE id = ?',
            (user["user_id"],)
        ).fetchone()
        conn.close()

        if not current_user or not current_user['is_admin']:
            raise HTTPException(status_code=403,
                                detail='Access denied. Admin privileges required.')

        # Get admin statistics
        stats = get_admin_statistics()

        # Get additional metrics
        new_users_this_month = get_new_users_count('month')
        assessments_this_week = get_assessments_count('week')
        active_users_today = get_active_users_count('today')

        return {
            'success': True,
            'data': {
                'admin': {
                    'name': (
                        f"{current_user['first_name']} {current_user['last_name']}"
                        if current_user['first_name']
                        else current_user['username']
                    ),
                    'username': current_user['username']
                },
                'stats': stats,
                'metrics': {
                    'new_users_this_month': new_users_this_month,
                    'assessments_this_week': assessments_this_week,
                    'active_users_today': active_users_today
                }
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in admin dashboard API: {e}")
        return JSONResponse(
            status_code=500,
            content={'error': 'Error loading admin dashboard'}
        )


@router.get('/api/admin/users')
async def api_admin_users(request: Request, user: dict = Depends(get_current_admin)):
    """API endpoint for admin users list"""
    try:
        # Get query parameters
        page = int(request.query_params.get('page', 1))
        search = request.query_params.get('search', '')
        role_filter = request.query_params.get('role', '')

        # Get users with pagination
        users, pagination = get_users_with_stats(
            page=page, search=search, role_filter=role_filter
        )

        return {
            'success': True,
            'data': {
                'users': users,
                'pagination': pagination
            }
        }

    except Exception as e:
        logger.error(f"Error in admin users API: {e}")
        return JSONResponse(
            status_code=500,
            content={'error': 'Error loading users data'}
        )


@router.get('/api/admin/analytics')
async def api_admin_analytics(user: dict = Depends(get_current_admin)):
    """API endpoint for comprehensive admin analytics"""
    try:
        conn = db_manager.get_connection()

        # 1. Learning Progress Analytics
        cefr_distribution = conn.execute('''
            SELECT overall_level as level, COUNT(*) as count
            FROM assessment_results ar
            INNER JOIN (
                SELECT user_id, MAX(completed_at) as latest_date
                FROM assessment_results GROUP BY user_id
            ) latest ON ar.user_id = latest.user_id
                    AND ar.completed_at = latest.latest_date
            GROUP BY overall_level
            ORDER BY
                CASE overall_level
                    WHEN 'A1' THEN 1 WHEN 'A2' THEN 2 WHEN 'B1' THEN 3
                    WHEN 'B2' THEN 4 WHEN 'C1' THEN 5 WHEN 'C2' THEN 6
                END
        ''').fetchall()

        phase_completion = conn.execute('''
            SELECT
                COUNT(DISTINCT u.id) as total_users,
                COUNT(DISTINCT ar.user_id) as phase1_completed,
                COUNT(DISTINCT p2.user_id) as phase2_started,
                COUNT(DISTINCT CASE WHEN p2.steps_completed >= 4
                      THEN p2.user_id END) as phase2_completed,
                COUNT(DISTINCT pc3.user_id) as phase3_completed,
                COUNT(DISTINCT pc4.user_id) as phase4_completed,
                COUNT(DISTINCT pc5.user_id) as phase5_completed,
                COUNT(DISTINCT pc6.user_id) as phase6_completed
            FROM users u
            LEFT JOIN assessment_results ar ON u.id = ar.user_id
            LEFT JOIN (
                SELECT user_id,
                       COUNT(DISTINCT CASE WHEN step_completed = 1
                             THEN step_id END) as steps_completed
                FROM phase2_progress GROUP BY user_id
            ) p2 ON u.id = p2.user_id
            LEFT JOIN (SELECT user_id FROM user_phase_completion
                       WHERE phase_number = 3 AND completed = 1) pc3
                ON u.id = pc3.user_id
            LEFT JOIN (SELECT user_id FROM user_phase_completion
                       WHERE phase_number = 4 AND completed = 1) pc4
                ON u.id = pc4.user_id
            LEFT JOIN (SELECT user_id FROM user_phase_completion
                       WHERE phase_number = 5 AND completed = 1) pc5
                ON u.id = pc5.user_id
            LEFT JOIN (SELECT user_id FROM user_phase_completion
                       WHERE phase_number = 6 AND completed = 1) pc6
                ON u.id = pc6.user_id
            WHERE u.is_admin = 0
        ''').fetchone()

        avg_assessment_times = conn.execute('''
            SELECT
                'Phase 1' as phase,
                AVG(time_taken) / 60.0 as avg_minutes
            FROM assessment_results
            UNION ALL
            SELECT
                'Phase 2 - ' || step_id as phase,
                AVG(CAST(
                    (julianday(completed_at) - julianday(started_at))
                    * 24 * 60 AS INTEGER
                )) as avg_minutes
            FROM phase2_progress
            WHERE completed_at IS NOT NULL
            GROUP BY step_id
        ''').fetchall()

        # 2. Student Engagement Metrics
        active_users_7d = conn.execute('''
            SELECT COUNT(DISTINCT user_id) as count
            FROM (
                SELECT user_id, completed_at as activity_date
                FROM assessment_results
                WHERE completed_at >= datetime('now', '-7 days')
                UNION
                SELECT user_id, last_activity as activity_date
                FROM phase2_progress
                WHERE last_activity >= datetime('now', '-7 days')
                UNION
                SELECT user_id, updated_at as activity_date
                FROM phase5_progress
                WHERE updated_at >= datetime('now', '-7 days')
                UNION
                SELECT user_id, updated_at as activity_date
                FROM phase6_progress
                WHERE updated_at >= datetime('now', '-7 days')
            )
        ''').fetchone()

        active_users_30d = conn.execute('''
            SELECT COUNT(DISTINCT user_id) as count
            FROM (
                SELECT user_id, completed_at as activity_date
                FROM assessment_results
                WHERE completed_at >= datetime('now', '-30 days')
                UNION
                SELECT user_id, last_activity as activity_date
                FROM phase2_progress
                WHERE last_activity >= datetime('now', '-30 days')
                UNION
                SELECT user_id, updated_at as activity_date
                FROM phase5_progress
                WHERE updated_at >= datetime('now', '-30 days')
                UNION
                SELECT user_id, updated_at as activity_date
                FROM phase6_progress
                WHERE updated_at >= datetime('now', '-30 days')
            )
        ''').fetchone()

        daily_activity = conn.execute('''
            SELECT DATE(activity_date) as date,
                   COUNT(DISTINCT user_id) as active_users
            FROM (
                SELECT user_id, completed_at as activity_date
                FROM assessment_results
                WHERE completed_at >= datetime('now', '-30 days')
                UNION
                SELECT user_id, last_activity as activity_date
                FROM phase2_progress
                WHERE last_activity >= datetime('now', '-30 days')
                UNION
                SELECT user_id, updated_at as activity_date
                FROM phase5_progress
                WHERE updated_at >= datetime('now', '-30 days')
                UNION
                SELECT user_id, updated_at as activity_date
                FROM phase6_progress
                WHERE updated_at >= datetime('now', '-30 days')
            )
            GROUP BY DATE(activity_date)
            ORDER BY date DESC
            LIMIT 30
        ''').fetchall()

        session_duration_dist = conn.execute('''
            SELECT
                CASE
                    WHEN time_taken < 300 THEN '0-5 min'
                    WHEN time_taken < 600 THEN '5-10 min'
                    WHEN time_taken < 1200 THEN '10-20 min'
                    WHEN time_taken < 1800 THEN '20-30 min'
                    ELSE '30+ min'
                END as duration_range,
                COUNT(*) as count
            FROM assessment_results
            WHERE time_taken IS NOT NULL
            GROUP BY duration_range
        ''').fetchall()

        # 3. Assessment Quality Insights
        ai_detection_stats = conn.execute('''
            SELECT
                AVG(ai_usage_percentage) as avg_ai_usage,
                COUNT(CASE WHEN ai_usage_percentage > 30 THEN 1 END)
                    as high_ai_count,
                COUNT(*) as total_assessments
            FROM assessment_results
            WHERE ai_usage_percentage IS NOT NULL
        ''').fetchone()

        score_distribution = conn.execute('''
            SELECT
                CASE
                    WHEN xp_earned < 200 THEN 'Low (0-199)'
                    WHEN xp_earned < 400 THEN 'Medium (200-399)'
                    WHEN xp_earned < 600 THEN 'High (400-599)'
                    ELSE 'Excellent (600+)'
                END as score_range,
                COUNT(*) as count
            FROM assessment_results
            GROUP BY score_range
        ''').fetchall()

        most_challenging_steps = conn.execute('''
            SELECT
                step_id,
                COUNT(*) as attempts,
                COUNT(CASE WHEN step_completed = 1 THEN 1 END) as completions,
                ROUND(
                    CAST(COUNT(CASE WHEN step_completed = 1 THEN 1 END) AS FLOAT)
                    / COUNT(*) * 100, 1
                ) as success_rate
            FROM phase2_progress
            GROUP BY step_id
            HAVING attempts > 0
            ORDER BY success_rate ASC
        ''').fetchall()

        # 4. Risk Identification
        at_risk_students = conn.execute('''
            SELECT
                u.id, u.username, u.first_name, u.last_name,
                MAX(COALESCE(
                    ar.completed_at, p2.last_activity,
                    p5.updated_at, p6.updated_at, u.created_at
                )) as last_activity,
                COUNT(DISTINCT ar.id) as assessments_completed,
                COUNT(DISTINCT p2.step_id) as phase2_steps_attempted
            FROM users u
            LEFT JOIN assessment_results ar ON u.id = ar.user_id
            LEFT JOIN phase2_progress p2 ON u.id = p2.user_id
            LEFT JOIN phase5_progress p5 ON u.id = p5.user_id
            LEFT JOIN phase6_progress p6 ON u.id = p6.user_id
            WHERE u.is_admin = 0
            GROUP BY u.id, u.username, u.first_name, u.last_name
            HAVING last_activity < datetime('now', '-7 days')
                OR assessments_completed = 0
            ORDER BY last_activity ASC
            LIMIT 10
        ''').fetchall()

        stuck_students = conn.execute('''
            SELECT
                u.id, u.username, u.first_name, u.last_name, p2.step_id,
                p2.started_at, p2.last_activity,
                CAST(
                    (julianday('now') - julianday(p2.last_activity)) AS INTEGER
                ) as days_stuck
            FROM users u
            INNER JOIN phase2_progress p2 ON u.id = p2.user_id
            WHERE p2.step_completed = 0
              AND p2.last_activity < datetime('now', '-3 days')
              AND u.is_admin = 0
            ORDER BY days_stuck DESC
            LIMIT 10
        ''').fetchall()

        # 5. System Health (basic metrics)
        recent_errors = conn.execute('''
            SELECT COUNT(*) as error_count
            FROM phase2_progress
            WHERE step_score = 0
              AND started_at >= datetime('now', '-24 hours')
        ''').fetchone()

        total_sessions = conn.execute('''
            SELECT COUNT(DISTINCT session_id) as count
            FROM assessment_results
            WHERE completed_at >= datetime('now', '-7 days')
        ''').fetchone()

        conn.close()

        return {
            'success': True,
            'data': {
                'learning_progress': {
                    'cefr_distribution': [dict(row) for row in cefr_distribution],
                    'phase_completion': dict(phase_completion),
                    'avg_assessment_times': [
                        dict(row) for row in avg_assessment_times
                    ]
                },
                'engagement': {
                    'active_users_7d': active_users_7d['count'],
                    'active_users_30d': active_users_30d['count'],
                    'daily_activity': [dict(row) for row in daily_activity],
                    'session_duration_dist': [
                        dict(row) for row in session_duration_dist
                    ]
                },
                'quality': {
                    'ai_detection': (
                        dict(ai_detection_stats) if ai_detection_stats else {}
                    ),
                    'score_distribution': [
                        dict(row) for row in score_distribution
                    ],
                    'challenging_steps': [
                        dict(row) for row in most_challenging_steps
                    ]
                },
                'risk': {
                    'at_risk_students': [
                        dict(row) for row in at_risk_students
                    ],
                    'stuck_students': [dict(row) for row in stuck_students]
                },
                'system': {
                    'recent_errors': recent_errors['error_count'],
                    'total_sessions_7d': total_sessions['count']
                }
            }
        }

    except Exception as e:
        logger.error(f"Error getting analytics data: {e}")
        return JSONResponse(
            status_code=500,
            content={'error': 'Error loading analytics data'}
        )


@router.get('/api/admin/users/{user_id}/details')
async def api_admin_user_details(
    user_id: int,
    user: dict = Depends(get_current_admin)
):
    """API endpoint for detailed user information"""
    try:
        conn = db_manager.get_connection()

        # Get user details
        target_user = conn.execute('''
            SELECT id, username, email, first_name, last_name, created_at,
                   last_login, is_active, email_verified, preferred_language,
                   timezone, role, is_admin
            FROM users WHERE id = ?
        ''', (user_id,)).fetchone()

        if not target_user:
            conn.close()
            raise HTTPException(status_code=404, detail='User not found')

        # Get user statistics from assessment_results
        user_assessments = conn.execute('''
            SELECT overall_level, xp_earned, completed_at, time_taken
            FROM assessment_results
            WHERE user_id = ?
            ORDER BY completed_at DESC
        ''', (user_id,)).fetchall()

        # Calculate user stats and add duration in minutes
        total_assessments = len(user_assessments)
        total_xp = sum(
            a['xp_earned'] for a in user_assessments if a['xp_earned']
        )
        latest_level = (
            user_assessments[0]['overall_level'] if user_assessments else 'N/A'
        )

        # Convert assessments to dict and add duration_minutes
        assessments_list = []
        for assessment in user_assessments:
            assessment_dict = dict(assessment)
            # Convert time_taken from seconds to minutes
            if assessment_dict['time_taken']:
                assessment_dict['duration_minutes'] = round(
                    assessment_dict['time_taken'] / 60, 1
                )
            else:
                assessment_dict['duration_minutes'] = None
            assessments_list.append(assessment_dict)

        user_stats = {
            'total_assessments': total_assessments,
            'total_xp': total_xp,
            'latest_level': latest_level,
            'assessments': assessments_list
        }

        # Get Phase 2 progress
        phase2_progress = conn.execute('''
            SELECT step_id, step_completed, started_at
            FROM phase2_progress
            WHERE user_id = ?
            ORDER BY started_at DESC
        ''', (user_id,)).fetchall()

        # Check if Phase 2 is completed (all 4 steps completed)
        completed_steps = [
            p['step_id'] for p in phase2_progress if p['step_completed']
        ]
        expected_steps = ['step_1', 'step_2', 'step_3', 'final_writing']
        phase2_completed = all(step in completed_steps for step in expected_steps)

        # Get phase completion for phases 3-6
        phase_completion_rows = conn.execute('''
            SELECT phase_number, completed, completion_date, final_level
            FROM user_phase_completion
            WHERE user_id = ?
            ORDER BY phase_number
        ''', (user_id,)).fetchall()
        phase_completion = {
            row['phase_number']: dict(row) for row in phase_completion_rows
        }

        user_progress = {
            'phase2_steps': [dict(p) for p in phase2_progress],
            'phase2_completed': phase2_completed,
            'phase3_completed': bool(
                phase_completion.get(3, {}).get('completed')
            ),
            'phase4_completed': bool(
                phase_completion.get(4, {}).get('completed')
            ),
            'phase5_completed': bool(
                phase_completion.get(5, {}).get('completed')
            ),
            'phase6_completed': bool(
                phase_completion.get(6, {}).get('completed')
            ),
            'phase_completion': [dict(row) for row in phase_completion_rows],
        }

        conn.close()

        # Add phase completion to user data
        user_dict = dict(target_user)
        user_dict['phase2_completed'] = phase2_completed
        user_dict['phase3_completed'] = user_progress['phase3_completed']
        user_dict['phase4_completed'] = user_progress['phase4_completed']
        user_dict['phase5_completed'] = user_progress['phase5_completed']
        user_dict['phase6_completed'] = user_progress['phase6_completed']

        return {
            'success': True,
            'data': {
                'user': user_dict,
                'stats': user_stats,
                'progress': user_progress
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting user details: {e}")
        return JSONResponse(
            status_code=500,
            content={'error': 'Error loading user details'}
        )


# ──────────────────────────────────────────────────────────────────
#  Endpoints from app.py  /admin/* paths (non-API, JSON-returning)
# ──────────────────────────────────────────────────────────────────

@router.get('/admin/users/{user_id}')
async def admin_user_detail(
    user_id: int,
    user: dict = Depends(get_current_admin)
):
    """Get detailed information about a specific user for modal popup"""
    try:
        # Get comprehensive user details
        user_details = assessment_history.get_user_detailed_progress(user_id)

        if not user_details.get('user_info'):
            raise HTTPException(status_code=404, detail='User not found')

        return {'success': True, 'user': user_details}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting user details: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={'success': False, 'error': 'Internal server error'}
        )


@router.post('/admin/users/{user_id}/toggle')
async def admin_toggle_user(
    user_id: int,
    request: Request,
    user: dict = Depends(get_current_admin)
):
    """Toggle user active status"""
    try:
        data = await request.json()
        is_active = data.get('active', True)

        success = user_manager.update_user(user_id, is_active=is_active)

        if success:
            action = 'activated' if is_active else 'deactivated'
            logger.info(
                f"Admin {user.get('username')} {action} user {user_id}"
            )
            return {
                'success': True,
                'message': f'User {action} successfully'
            }
        else:
            return JSONResponse(
                status_code=400,
                content={
                    'success': False,
                    'error': 'Failed to update user'
                }
            )

    except Exception as e:
        logger.error(f"Error toggling user: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={'success': False, 'error': 'Internal server error'}
        )


@router.get('/admin/export/users')
async def admin_export_users(
    request: Request,
    user: dict = Depends(get_current_admin)
):
    """Export users data to CSV"""
    try:
        search = request.query_params.get('search', '')
        role_filter = request.query_params.get('role', '')

        # Use get_users_with_stats to get all users
        users, _ = get_users_with_stats(
            page=1, per_page=10000, search=search, role_filter=role_filter
        )

        # Create CSV
        output = io.StringIO()
        writer = csv.writer(output)

        # Headers
        writer.writerow([
            'ID', 'Username', 'Email', 'First Name', 'Last Name',
            'Role', 'Active', 'Created At', 'Last Login',
            'Total Assessments', 'Best Level', 'Total XP',
            'Phase2 Steps Completed', 'Phase2 Steps Attempted'
        ])

        # Write user data
        for u in users:
            writer.writerow([
                u.get('id', ''),
                u.get('username', ''),
                u.get('email', ''),
                u.get('first_name', ''),
                u.get('last_name', ''),
                'Admin' if u.get('is_admin') else 'User',
                'Yes' if u.get('is_active') else 'No',
                u.get('created_at', ''),
                u.get('last_login', ''),
                u.get('total_assessments', 0),
                u.get('best_level', 'N/A'),
                u.get('total_xp', 0),
                u.get('phase2_steps_completed', 0),
                u.get('phase2_steps_attempted', 0)
            ])

        filename = f'fardi_users_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'

        return StreamingResponse(
            iter([output.getvalue()]),
            media_type='text/csv',
            headers={
                'Content-Disposition': f'attachment; filename={filename}'
            }
        )

    except Exception as e:
        logger.error(f"Error exporting users: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={'error': 'Error exporting users data'}
        )


@router.get('/admin/export-data')
async def admin_export_data(
    request: Request,
    user: dict = Depends(get_current_admin)
):
    """Export all users data to CSV - alias for export/users"""
    return await admin_export_users(request=request, user=user)


# ──────────────────────────────────────────────────────────────────
#  Endpoints from routes/admin_routes.py (blueprint)
# ──────────────────────────────────────────────────────────────────

@router.get('/api/admin/students')
async def get_all_users_blueprint(user: dict = Depends(get_current_admin)):
    """
    Get all users with their progress summary.
    Ported from admin_bp blueprint's /api/admin/users.
    Exposed at /api/admin/students to avoid path collision with the
    paginated /api/admin/users from app.py.
    """
    try:
        all_users = user_manager.get_all_users()

        users_with_stats = []
        for u in all_users:
            uid = u.get('user_id')

            # Get Phase 1 progress
            phase1_history = assessment_history.get_user_assessments(uid)
            latest_phase1 = phase1_history[0] if phase1_history else None

            # Get Phase 2 progress
            phase2_progress = assessment_history.get_phase2_progress(uid)
            phase2_score = phase2_progress.get('overall_score', 0)
            phase2_total = phase2_progress.get('max_score', 100)

            # Get phase completion for all phases
            user_stats = assessment_history.get_user_stats(uid)
            phase_completion = {
                pc['phase_number']: pc['completed']
                for pc in user_stats.get('phase_completion', [])
            }

            users_with_stats.append({
                'user_id': uid,
                'username': u.get('username'),
                'first_name': u.get('first_name', ''),
                'last_name': u.get('last_name', ''),
                'email': u.get('email', ''),
                'is_admin': u.get('is_admin', False),
                'created_at': u.get('created_at'),
                'last_login': u.get('last_login'),
                'phase1_level': (
                    latest_phase1.get('overall_level')
                    if latest_phase1 else None
                ),
                'phase1_date': (
                    latest_phase1.get('timestamp')
                    if latest_phase1 else None
                ),
                'phase2_score': phase2_score,
                'phase2_percentage': round(
                    (phase2_score / phase2_total * 100)
                    if phase2_total > 0 else 0,
                    1
                ),
                'phase2_steps_completed': len(
                    phase2_progress.get('steps_completed', [])
                ),
                'total_remedial_activities': len(
                    phase2_progress.get('remedial_activities', [])
                ),
                'phase3_completed': bool(phase_completion.get(3)),
                'phase4_completed': bool(phase_completion.get(4)),
                'phase5_completed': bool(phase_completion.get(5)),
                'phase6_completed': bool(phase_completion.get(6)),
            })

        return {
            "success": True,
            "data": {
                "users": users_with_stats,
                "total_count": len(users_with_stats)
            }
        }
    except Exception as e:
        logger.error(f"Error getting users: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )


@router.get('/api/admin/student/{user_id}/progress')
async def get_student_progress(
    user_id: str,
    user: dict = Depends(get_current_admin)
):
    """Get detailed progress for a specific student"""
    try:
        # Get user info
        target_user = user_manager.get_user_by_id(user_id)
        if not target_user:
            raise HTTPException(status_code=404, detail="User not found")

        # Phase 1 history
        phase1_history = assessment_history.get_user_assessments(user_id)

        # Phase 2 detailed progress
        phase2_progress = assessment_history.get_phase2_progress(user_id)

        # Get all responses with AI evaluations
        responses_with_ai = []
        for step_data in phase2_progress.get('steps', []):
            for response in step_data.get('responses', []):
                responses_with_ai.append({
                    'step_id': step_data.get('step_id'),
                    'action_item_id': response.get('action_item_id'),
                    'timestamp': response.get('timestamp'),
                    'response_text': response.get('response'),
                    'score': response.get('score'),
                    'ai_evaluation': response.get('ai_evaluation'),
                    'cefr_level': response.get('cefr_level'),
                    'assessment_focus': response.get('assessment_focus')
                })

        # Get remedial activities with AI evaluations
        remedial_with_ai = []
        for activity in phase2_progress.get('remedial_activities', []):
            remedial_with_ai.append({
                'step_id': activity.get('step_id'),
                'level': activity.get('level'),
                'activity_id': activity.get('activity_id'),
                'activity_index': activity.get('activity_index'),
                'timestamp': activity.get('timestamp'),
                'completed': activity.get('completed'),
                'score': activity.get('score'),
                'responses': activity.get('responses', {}),
                'ai_evaluation': activity.get('ai_evaluation')
            })

        return {
            "success": True,
            "data": {
                "user": {
                    'user_id': user_id,
                    'username': target_user.get('username'),
                    'first_name': target_user.get('first_name', ''),
                    'last_name': target_user.get('last_name', ''),
                    'email': target_user.get('email', ''),
                    'created_at': target_user.get('created_at'),
                    'last_login': target_user.get('last_login')
                },
                "phase1_history": phase1_history,
                "phase2_progress": phase2_progress,
                "responses_with_ai": responses_with_ai,
                "remedial_with_ai": remedial_with_ai,
                "summary": {
                    'total_phase1_attempts': len(phase1_history),
                    'current_level': (
                        phase1_history[0].get('overall_level')
                        if phase1_history else None
                    ),
                    'phase2_score': phase2_progress.get('overall_score', 0),
                    'phase2_max': phase2_progress.get('max_score', 100),
                    'phase2_percentage': round(
                        (
                            phase2_progress.get('overall_score', 0)
                            / phase2_progress.get('max_score', 100)
                            * 100
                        )
                        if phase2_progress.get('max_score', 0) > 0
                        else 0,
                        1
                    ),
                    'steps_completed': len(
                        phase2_progress.get('steps_completed', [])
                    ),
                    'total_responses': len(responses_with_ai),
                    'total_remedial_activities': len(remedial_with_ai),
                    'remedial_completed': len(
                        [a for a in remedial_with_ai if a.get('completed')]
                    )
                }
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting student progress: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )


@router.get('/api/admin/ai-evaluations')
async def get_ai_evaluations(user: dict = Depends(get_current_admin)):
    """Get all AI evaluations across all students"""
    try:
        all_users = user_manager.get_all_users()
        all_evaluations = []

        for u in all_users:
            if u.get('is_admin'):
                continue

            uid = u.get('user_id')
            username = u.get('username')

            # Get Phase 2 progress
            phase2_progress = assessment_history.get_phase2_progress(uid)

            # Extract all responses with AI evaluations
            for step_data in phase2_progress.get('steps', []):
                for response in step_data.get('responses', []):
                    if response.get('ai_evaluation'):
                        all_evaluations.append({
                            'user_id': uid,
                            'username': username,
                            'context': 'Phase 2 Step Response',
                            'step_id': step_data.get('step_id'),
                            'action_item_id': response.get('action_item_id'),
                            'timestamp': response.get('timestamp'),
                            'response_text': response.get('response'),
                            'score': response.get('score'),
                            'ai_evaluation': response.get('ai_evaluation'),
                            'cefr_level': response.get('cefr_level')
                        })

            # Extract remedial activity AI evaluations
            for activity in phase2_progress.get('remedial_activities', []):
                if activity.get('ai_evaluation'):
                    all_evaluations.append({
                        'user_id': uid,
                        'username': username,
                        'context': 'Remedial Activity',
                        'step_id': activity.get('step_id'),
                        'level': activity.get('level'),
                        'activity_id': activity.get('activity_id'),
                        'timestamp': activity.get('timestamp'),
                        'responses': activity.get('responses', {}),
                        'score': activity.get('score'),
                        'ai_evaluation': activity.get('ai_evaluation')
                    })

        # Sort by timestamp
        all_evaluations.sort(
            key=lambda x: x.get('timestamp', ''), reverse=True
        )

        return {
            "success": True,
            "data": {
                "evaluations": all_evaluations,
                "total_count": len(all_evaluations)
            }
        }
    except Exception as e:
        logger.error(f"Error getting AI evaluations: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )


@router.get('/api/admin/progress/{user_id}')
async def get_user_progress(
    user_id: str,
    phase: int = None,
    user: dict = Depends(get_current_user)
):
    """Get detailed progress summary and timeline for a specific user"""
    if not user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin required")
    try:
        conn = db_manager.get_connection()

        # Build WHERE clause depending on optional phase filter
        if phase is not None:
            where_clause = "WHERE user_id=? AND phase=?"
            params = [user_id, phase]
        else:
            where_clause = "WHERE user_id=?"
            params = [user_id]

        # Summary query: grouped by phase/subphase/step/interaction/context
        summary_rows = conn.execute(
            f"""
            SELECT phase, subphase, step, interaction, context,
                   COUNT(*) as response_count,
                   SUM(CASE WHEN is_correct=1 THEN 1 ELSE 0 END) as correct_count,
                   SUM(score) as total_score,
                   MIN(timestamp) as started_at,
                   MAX(timestamp) as completed_at
            FROM student_responses
            {where_clause}
            GROUP BY phase, subphase, step, interaction, context
            ORDER BY phase, subphase, step, interaction
            """,
            params
        ).fetchall()

        # Timeline query: all individual responses ordered by timestamp
        timeline_rows = conn.execute(
            f"""
            SELECT phase, subphase, step, interaction, context,
                   item_index, item_type, item_id,
                   prompt, response, is_correct, score,
                   ai_feedback, timestamp
            FROM student_responses
            {where_clause}
            ORDER BY timestamp ASC
            """,
            params
        ).fetchall()

        summary = [
            {
                "phase": row["phase"],
                "subphase": row["subphase"],
                "step": row["step"],
                "interaction": row["interaction"],
                "context": row["context"],
                "response_count": row["response_count"],
                "correct_count": row["correct_count"],
                "total_score": row["total_score"],
                "started_at": row["started_at"],
                "completed_at": row["completed_at"],
            }
            for row in summary_rows
        ]

        timeline = [
            {
                "phase": row["phase"],
                "subphase": row["subphase"],
                "step": row["step"],
                "interaction": row["interaction"],
                "context": row["context"],
                "item_index": row["item_index"],
                "item_type": row["item_type"],
                "item_id": row["item_id"],
                "prompt": row["prompt"],
                "response": row["response"],
                "is_correct": bool(row["is_correct"]) if row["is_correct"] is not None else None,
                "score": row["score"],
                "ai_feedback": row["ai_feedback"],
                "timestamp": row["timestamp"],
            }
            for row in timeline_rows
        ]

        return {
            "success": True,
            "data": {
                "summary": summary,
                "timeline": timeline,
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting user progress: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )
