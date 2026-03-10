"""
User authentication models and database operations
"""
import sqlite3
import hashlib
import secrets
from datetime import datetime, timedelta
from functools import wraps
from flask import session, redirect, url_for, flash
import logging

logger = logging.getLogger(__name__)

class DatabaseManager:
    def __init__(self, db_path='fardi.db'):
        self.db_path = db_path
        self.init_database()
    
    def get_connection(self):
        """Get database connection with row factory"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn
    
    def init_database(self):
        """Initialize database tables"""
        conn = self.get_connection()
        try:
            # Users table
            conn.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    first_name TEXT,
                    last_name TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    last_login TIMESTAMP,
                    is_active BOOLEAN DEFAULT 1,
                    email_verified BOOLEAN DEFAULT 0,
                    profile_picture TEXT,
                    preferred_language TEXT DEFAULT 'en',
                    timezone TEXT DEFAULT 'UTC',
                    role TEXT DEFAULT 'user',
                    is_admin BOOLEAN DEFAULT 0
                )
            ''')
            
            # User sessions table for enhanced session management
            conn.execute('''
                CREATE TABLE IF NOT EXISTS user_sessions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    session_token TEXT UNIQUE NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    expires_at TIMESTAMP NOT NULL,
                    ip_address TEXT,
                    user_agent TEXT,
                    is_active BOOLEAN DEFAULT 1,
                    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
                )
            ''')
            
            # Assessment results table
            conn.execute('''
                CREATE TABLE IF NOT EXISTS assessment_results (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER,
                    session_id TEXT NOT NULL,
                    overall_level TEXT NOT NULL,
                    xp_earned INTEGER DEFAULT 0,
                    time_taken INTEGER, -- in seconds
                    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    skill_levels TEXT, -- JSON string
                    achievements TEXT, -- JSON string
                    responses TEXT, -- JSON string
                    assessments TEXT, -- JSON string
                    ai_usage_percentage REAL DEFAULT 0,
                    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
                )
            ''')
            
            # Password reset tokens
            conn.execute('''
                CREATE TABLE IF NOT EXISTS password_reset_tokens (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    token TEXT UNIQUE NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    expires_at TIMESTAMP NOT NULL,
                    used BOOLEAN DEFAULT 0,
                    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
                )
            ''')
            
            # Email verification tokens
            conn.execute('''
                CREATE TABLE IF NOT EXISTS email_verification_tokens (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    token TEXT UNIQUE NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    expires_at TIMESTAMP NOT NULL,
                    used BOOLEAN DEFAULT 0,
                    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
                )
            ''')
            
            # User preferences
            conn.execute('''
                CREATE TABLE IF NOT EXISTS user_preferences (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER UNIQUE NOT NULL,
                    email_notifications BOOLEAN DEFAULT 1,
                    progress_reminders BOOLEAN DEFAULT 1,
                    difficulty_level TEXT DEFAULT 'adaptive',
                    theme_preference TEXT DEFAULT 'auto',
                    language_goals TEXT, -- JSON string
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
                )
            ''')
            
            # Phase 2 progress tracking
            conn.execute('''
                CREATE TABLE IF NOT EXISTS phase2_progress (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    session_id TEXT NOT NULL,
                    step_id TEXT NOT NULL,
                    current_item INTEGER DEFAULT 0,
                    total_items INTEGER DEFAULT 5,
                    step_score INTEGER DEFAULT 0,
                    step_completed BOOLEAN DEFAULT 0,
                    needs_remedial BOOLEAN DEFAULT 0,
                    remedial_level TEXT,
                    remedial_progress TEXT, -- JSON string
                    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    completed_at TIMESTAMP,
                    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
                )
            ''')
            
            # Phase 2 responses tracking
            conn.execute('''
                CREATE TABLE IF NOT EXISTS phase2_responses (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    session_id TEXT NOT NULL,
                    step_id TEXT NOT NULL,
                    action_item_id TEXT NOT NULL,
                    response_text TEXT NOT NULL,
                    assessment_data TEXT, -- JSON string
                    points_earned INTEGER DEFAULT 1,
                    cefr_level TEXT DEFAULT 'A1',
                    ai_detected BOOLEAN DEFAULT 0,
                    ai_score REAL DEFAULT 0,
                    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
                )
            ''')
            
            # Phase 2 remedial activity tracking
            conn.execute('''
                CREATE TABLE IF NOT EXISTS phase2_remedial (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    session_id TEXT NOT NULL,
                    step_id TEXT NOT NULL,
                    level TEXT NOT NULL,
                    activity_id TEXT NOT NULL,
                    activity_index INTEGER NOT NULL,
                    responses TEXT, -- JSON string
                    score INTEGER DEFAULT 0,
                    max_score INTEGER DEFAULT 6,
                    completed BOOLEAN DEFAULT 0,
                    attempts INTEGER DEFAULT 1,
                    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
                )
            ''')
            
            # Overall phase completion tracking
            conn.execute('''
                CREATE TABLE IF NOT EXISTS user_phase_completion (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    phase_number INTEGER NOT NULL,
                    completed BOOLEAN DEFAULT 0,
                    completion_date TIMESTAMP,
                    overall_score INTEGER DEFAULT 0,
                    final_level TEXT,
                    time_spent INTEGER DEFAULT 0, -- in seconds
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
                    UNIQUE(user_id, phase_number)
                )
            ''')
            
            # Phase 5 progress tracking
            conn.execute('''
                CREATE TABLE IF NOT EXISTS phase5_progress (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    subphase INTEGER DEFAULT 1, -- 1 = SubPhase 1 (5.1), 2 = SubPhase 2 (5.2)
                    step_id INTEGER NOT NULL,
                    interaction_scores TEXT, -- JSON: {interaction1: 1, interaction2: 3, interaction3: 1}
                    total_score INTEGER DEFAULT 0,
                    completed BOOLEAN DEFAULT 0,
                    remedial_level TEXT,
                    should_proceed BOOLEAN DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
                    UNIQUE(user_id, subphase, step_id)
                )
            ''')
            
            # Phase 5 remedial progress tracking
            conn.execute('''
                CREATE TABLE IF NOT EXISTS phase5_remedial (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    subphase INTEGER DEFAULT 1, -- 1 = SubPhase 1 (5.1), 2 = SubPhase 2 (5.2)
                    step_id INTEGER NOT NULL,
                    level TEXT NOT NULL, -- A1, A2, B1, B2, C1
                    task_scores TEXT, -- JSON: {taskA: 8, taskB: 7, ...}
                    total_score INTEGER DEFAULT 0,
                    max_score INTEGER DEFAULT 0,
                    passed BOOLEAN DEFAULT 0,
                    attempts INTEGER DEFAULT 1,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
                )
            ''')
            
            # Migrate existing data: add subphase = 1 to existing records (must happen before index creation)
            try:
                conn.execute('ALTER TABLE phase5_progress ADD COLUMN subphase INTEGER DEFAULT 1')
            except sqlite3.OperationalError:
                pass  # Column already exists
            
            try:
                conn.execute('ALTER TABLE phase5_remedial ADD COLUMN subphase INTEGER DEFAULT 1')
            except sqlite3.OperationalError:
                pass  # Column already exists
            
            # Update existing records to have subphase = 1
            conn.execute('UPDATE phase5_progress SET subphase = 1 WHERE subphase IS NULL')
            conn.execute('UPDATE phase5_remedial SET subphase = 1 WHERE subphase IS NULL')
            
            # Create indexes for Phase 5 (after ensuring columns exist)
            conn.execute('CREATE INDEX IF NOT EXISTS idx_phase5_progress_user ON phase5_progress(user_id)')
            conn.execute('CREATE INDEX IF NOT EXISTS idx_phase5_progress_subphase ON phase5_progress(user_id, subphase, step_id)')
            conn.execute('CREATE INDEX IF NOT EXISTS idx_phase5_remedial_user ON phase5_remedial(user_id)')
            conn.execute('CREATE INDEX IF NOT EXISTS idx_phase5_remedial_step ON phase5_remedial(step_id, level)')
            conn.execute('CREATE INDEX IF NOT EXISTS idx_phase5_remedial_subphase ON phase5_remedial(user_id, subphase, step_id, level)')
            
            # Phase 6 progress tracking
            conn.execute('''
                CREATE TABLE IF NOT EXISTS phase6_progress (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    subphase INTEGER DEFAULT 1, -- 1 = SubPhase 1 (6.1), 2 = SubPhase 2 (6.2)
                    step_id INTEGER NOT NULL,
                    interaction_scores TEXT, -- JSON: {interaction1: 1, interaction2: 3, interaction3: 1}
                    total_score INTEGER DEFAULT 0,
                    completed BOOLEAN DEFAULT 0,
                    remedial_level TEXT,
                    should_proceed BOOLEAN DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
                    UNIQUE(user_id, subphase, step_id)
                )
            ''')

            # Phase 6 remedial progress tracking
            conn.execute('''
                CREATE TABLE IF NOT EXISTS phase6_remedial (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    subphase INTEGER DEFAULT 1, -- 1 = SubPhase 1 (6.1), 2 = SubPhase 2 (6.2)
                    step_id INTEGER NOT NULL,
                    level TEXT NOT NULL, -- A2, B1, B2, C1
                    task_scores TEXT, -- JSON: {taskA: 8, taskB: 7, ...}
                    total_score INTEGER DEFAULT 0,
                    max_score INTEGER DEFAULT 0,
                    passed BOOLEAN DEFAULT 0,
                    attempts INTEGER DEFAULT 1,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
                )
            ''')

            # Create indexes for Phase 6
            conn.execute('CREATE INDEX IF NOT EXISTS idx_phase6_progress_user ON phase6_progress(user_id)')
            conn.execute('CREATE INDEX IF NOT EXISTS idx_phase6_progress_subphase ON phase6_progress(user_id, subphase, step_id)')
            conn.execute('CREATE INDEX IF NOT EXISTS idx_phase6_remedial_user ON phase6_remedial(user_id)')
            conn.execute('CREATE INDEX IF NOT EXISTS idx_phase6_remedial_step ON phase6_remedial(step_id, level)')
            conn.execute('CREATE INDEX IF NOT EXISTS idx_phase6_remedial_subphase ON phase6_remedial(user_id, subphase, step_id, level)')

            # Exercise Builder System Tables
            
            # Workflows table - stores workflow definitions
            conn.execute('''
                CREATE TABLE IF NOT EXISTS workflows (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    description TEXT,
                    workflow_data TEXT,  -- JSON data of the workflow
                    creator_id INTEGER,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    version TEXT DEFAULT '1.0',
                    is_active BOOLEAN DEFAULT 1,
                    difficulty_level TEXT DEFAULT 'intermediate',
                    estimated_time INTEGER DEFAULT 30,
                    cultural_themes TEXT,  -- JSON array of theme IDs
                    tags TEXT,  -- JSON array of tags
                    FOREIGN KEY (creator_id) REFERENCES users (id)
                )
            ''')
            
            # Exercise instances table - stores specific exercise configurations
            conn.execute('''
                CREATE TABLE IF NOT EXISTS exercise_instances (
                    id TEXT PRIMARY KEY,
                    workflow_id TEXT,
                    exercise_type TEXT NOT NULL,
                    configuration TEXT,  -- JSON configuration
                    metadata TEXT,  -- JSON metadata
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (workflow_id) REFERENCES workflows (id)
                )
            ''')
            
            # User workflow progress - tracks user progress through workflows
            conn.execute('''
                CREATE TABLE IF NOT EXISTS user_workflow_progress (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    workflow_id TEXT NOT NULL,
                    current_node_id TEXT,
                    progress_data TEXT,  -- JSON data tracking progress
                    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    completed_at TIMESTAMP,
                    status TEXT DEFAULT 'in_progress',  -- 'in_progress', 'completed', 'abandoned'
                    total_score INTEGER DEFAULT 0,
                    FOREIGN KEY (user_id) REFERENCES users (id),
                    FOREIGN KEY (workflow_id) REFERENCES workflows (id),
                    UNIQUE(user_id, workflow_id)
                )
            ''')
            
            # Exercise responses - stores user responses to exercises
            conn.execute('''
                CREATE TABLE IF NOT EXISTS exercise_responses (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    workflow_id TEXT NOT NULL,
                    exercise_id TEXT NOT NULL,
                    node_id TEXT,
                    response_data TEXT,  -- JSON response data
                    assessment_data TEXT,  -- JSON assessment results
                    score INTEGER DEFAULT 0,
                    level_achieved TEXT,
                    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    time_spent INTEGER DEFAULT 0,  -- Time in seconds
                    FOREIGN KEY (user_id) REFERENCES users (id),
                    FOREIGN KEY (workflow_id) REFERENCES workflows (id)
                )
            ''')
            
            # Custom characters - allows admins to create custom characters
            conn.execute('''
                CREATE TABLE IF NOT EXISTS custom_characters (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    role TEXT,
                    personality TEXT,
                    avatar_url TEXT,
                    voice_id TEXT,
                    cultural_background TEXT,
                    specialties TEXT,  -- JSON array of specialties
                    creator_id INTEGER,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    is_active BOOLEAN DEFAULT 1,
                    FOREIGN KEY (creator_id) REFERENCES users (id)
                )
            ''')
            
            # Media assets - manages uploaded media files
            conn.execute('''
                CREATE TABLE IF NOT EXISTS media_assets (
                    id TEXT PRIMARY KEY,
                    filename TEXT NOT NULL,
                    original_name TEXT,
                    file_type TEXT,  -- 'audio', 'image', 'video', 'document'
                    file_url TEXT,
                    file_size INTEGER,
                    uploader_id INTEGER,
                    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    metadata TEXT,  -- JSON metadata (dimensions, duration, etc.)
                    tags TEXT,  -- JSON array of tags
                    is_public BOOLEAN DEFAULT 0,
                    FOREIGN KEY (uploader_id) REFERENCES users (id)
                )
            ''')
            
            # Workflow templates - pre-built workflow templates
            conn.execute('''
                CREATE TABLE IF NOT EXISTS workflow_templates (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    description TEXT,
                    template_data TEXT,  -- JSON template structure
                    category TEXT,  -- 'language_learning', 'cultural_education', etc.
                    difficulty_level TEXT,
                    preview_image TEXT,
                    creator_id INTEGER,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    is_public BOOLEAN DEFAULT 0,
                    usage_count INTEGER DEFAULT 0,
                    FOREIGN KEY (creator_id) REFERENCES users (id)
                )
            ''')
            
            # Assessment rubrics - custom scoring rubrics
            conn.execute('''
                CREATE TABLE IF NOT EXISTS assessment_rubrics (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    description TEXT,
                    criteria TEXT,  -- JSON array of criteria
                    scoring_scale TEXT,  -- JSON scoring scale definition
                    exercise_types TEXT,  -- JSON array of applicable exercise types
                    creator_id INTEGER,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    is_default BOOLEAN DEFAULT 0,
                    FOREIGN KEY (creator_id) REFERENCES users (id)
                )
            ''')

            # Exercises table - stores individual exercises created by admins
            conn.execute('''
                CREATE TABLE IF NOT EXISTS exercises (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    description TEXT,
                    exercise_type TEXT NOT NULL,
                    difficulty_levels TEXT,  -- JSON object with A1, A2, B1, B2 content
                    correct_answers TEXT,    -- JSON object with correct answers
                    wrong_answers TEXT,      -- JSON object with wrong answer options
                    ai_instructions TEXT,    -- Instructions for AI assistance
                    parameters TEXT,         -- JSON object with exercise-specific parameters
                    cultural_themes TEXT,    -- JSON array of theme IDs
                    tags TEXT,              -- JSON array of tags
                    creator_id INTEGER,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    is_active BOOLEAN DEFAULT 1,
                    usage_count INTEGER DEFAULT 0,
                    FOREIGN KEY (creator_id) REFERENCES users (id)
                )
            ''')

            # Remedial scores table - tracks Phase 4 Step 4 remedial activity scores
            conn.execute('''
                CREATE TABLE IF NOT EXISTS remedial_scores (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    phase INTEGER NOT NULL,
                    step INTEGER NOT NULL,
                    level TEXT NOT NULL,
                    task_a_score INTEGER DEFAULT 0,
                    task_b_score INTEGER DEFAULT 0,
                    task_c_score INTEGER DEFAULT 0,
                    task_d_score INTEGER DEFAULT 0,
                    task_e_score INTEGER DEFAULT 0,
                    task_f_score INTEGER DEFAULT 0,
                    total_score INTEGER DEFAULT 0,
                    max_score INTEGER DEFAULT 0,
                    passed BOOLEAN DEFAULT 0,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
                )
            ''')

            # Database migrations - Add missing columns to existing tables
            try:
                # Check if role and is_admin columns exist, add them if not
                cursor = conn.execute("PRAGMA table_info(users)")
                columns = [column[1] for column in cursor.fetchall()]
                
                if 'role' not in columns:
                    conn.execute('ALTER TABLE users ADD COLUMN role TEXT DEFAULT "user"')
                    logger.info("Added 'role' column to users table")
                
                if 'is_admin' not in columns:
                    conn.execute('ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT 0')
                    logger.info("Added 'is_admin' column to users table")
                    
            except Exception as e:
                logger.warning(f"Migration warning (non-critical): {str(e)}")
            
            # Student progress tracking - generic cross-phase progress
            conn.execute('''
                CREATE TABLE IF NOT EXISTS student_progress (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    phase INTEGER NOT NULL,
                    subphase INTEGER,
                    step INTEGER NOT NULL,
                    interaction INTEGER NOT NULL,
                    item_index INTEGER NOT NULL DEFAULT 0,
                    session_id TEXT,
                    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    is_complete BOOLEAN DEFAULT 0,
                    UNIQUE(user_id, phase),
                    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
                )
            ''')

            # Student responses - stores individual item responses across phases
            conn.execute('''
                CREATE TABLE IF NOT EXISTS student_responses (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    phase INTEGER NOT NULL,
                    subphase INTEGER,
                    step INTEGER NOT NULL,
                    interaction INTEGER NOT NULL,
                    item_index INTEGER NOT NULL,
                    item_type TEXT NOT NULL,
                    item_id TEXT,
                    prompt TEXT,
                    response TEXT NOT NULL,
                    is_correct INTEGER,
                    score REAL,
                    ai_feedback TEXT,
                    session_id TEXT,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
                )
            ''')

            conn.commit()
            logger.info("Database tables initialized successfully")

        except Exception as e:
            conn.rollback()
            logger.error(f"Error initializing database: {str(e)}")
            raise
        finally:
            conn.close()

class User:
    def __init__(self, db_manager):
        self.db = db_manager
    
    @staticmethod
    def hash_password(password):
        """Hash password using SHA-256 with salt"""
        salt = secrets.token_hex(16)
        password_hash = hashlib.sha256((password + salt).encode()).hexdigest()
        return f"{salt}:{password_hash}"
    
    @staticmethod
    def verify_password(password, stored_hash):
        """Verify password against stored hash"""
        try:
            salt, hash_value = stored_hash.split(':')
            password_hash = hashlib.sha256((password + salt).encode()).hexdigest()
            return hash_value == password_hash
        except ValueError:
            return False
    
    def create_user(self, username, email, password, first_name=None, last_name=None):
        """Create a new user"""
        conn = self.db.get_connection()
        try:
            # Check if user already exists
            existing = conn.execute(
                'SELECT id FROM users WHERE username = ? OR email = ?',
                (username, email)
            ).fetchone()
            
            if existing:
                return None, "Username or email already exists"
            
            # Hash password
            password_hash = self.hash_password(password)
            
            # Insert user
            cursor = conn.execute('''
                INSERT INTO users (username, email, password_hash, first_name, last_name)
                VALUES (?, ?, ?, ?, ?)
            ''', (username, email, password_hash, first_name, last_name))
            
            user_id = cursor.lastrowid
            
            # Create default preferences
            conn.execute('''
                INSERT INTO user_preferences (user_id)
                VALUES (?)
            ''', (user_id,))
            
            conn.commit()
            
            # Return user data
            user_data = self.get_user_by_id(user_id)
            return user_data, None
            
        except Exception as e:
            conn.rollback()
            logger.error(f"Error creating user: {str(e)}")
            return None, "An error occurred while creating the account"
        finally:
            conn.close()
    
    def authenticate_user(self, username_or_email, password):
        """Authenticate user with username/email and password"""
        conn = self.db.get_connection()
        try:
            user = conn.execute('''
                SELECT * FROM users 
                WHERE (username = ? OR email = ?) AND is_active = 1
            ''', (username_or_email, username_or_email)).fetchone()
            
            if user and self.verify_password(password, user['password_hash']):
                # Update last login
                conn.execute(
                    'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
                    (user['id'],)
                )
                conn.commit()
                
                return dict(user)
            
            return None
            
        except Exception as e:
            logger.error(f"Error authenticating user: {str(e)}")
            return None
        finally:
            conn.close()
    
    def get_user_by_id(self, user_id):
        """Get user by ID"""
        conn = self.db.get_connection()
        try:
            user = conn.execute(
                'SELECT * FROM users WHERE id = ? AND is_active = 1',
                (user_id,)
            ).fetchone()
            
            return dict(user) if user else None
            
        except Exception as e:
            logger.error(f"Error getting user by ID: {str(e)}")
            return None
        finally:
            conn.close()
    
    def get_user_by_email(self, email):
        """Get user by email"""
        conn = self.db.get_connection()
        try:
            user = conn.execute(
                'SELECT * FROM users WHERE email = ? AND is_active = 1',
                (email,)
            ).fetchone()
            
            return dict(user) if user else None
            
        except Exception as e:
            logger.error(f"Error getting user by email: {str(e)}")
            return None
        finally:
            conn.close()
    
    def update_user(self, user_id, **kwargs):
        """Update user information"""
        conn = self.db.get_connection()
        try:
            # Build dynamic update query
            allowed_fields = ['first_name', 'last_name', 'email', 'preferred_language', 'timezone', 'profile_picture', 'role', 'is_admin', 'is_active']
            updates = []
            values = []
            
            for field, value in kwargs.items():
                if field in allowed_fields:
                    updates.append(f"{field} = ?")
                    values.append(value)
            
            if not updates:
                return False
            
            values.append(user_id)
            query = f"UPDATE users SET {', '.join(updates)} WHERE id = ?"
            
            conn.execute(query, values)
            conn.commit()
            
            return True
            
        except Exception as e:
            conn.rollback()
            logger.error(f"Error updating user: {str(e)}")
            return False
        finally:
            conn.close()
    
    def get_all_users(self, limit=None, offset=0, search=None, role=None):
        """Get all users with optional filtering and pagination"""
        conn = self.db.get_connection()
        try:
            query = "SELECT * FROM users WHERE 1=1"
            params = []
            
            if search:
                query += " AND (username LIKE ? OR email LIKE ? OR first_name LIKE ? OR last_name LIKE ?)"
                search_param = f"%{search}%"
                params.extend([search_param, search_param, search_param, search_param])
            
            if role:
                query += " AND role = ?"
                params.append(role)
            
            query += " ORDER BY created_at DESC"
            
            if limit:
                query += " LIMIT ? OFFSET ?"
                params.extend([limit, offset])
            
            users = conn.execute(query, params).fetchall()
            return [dict(user) for user in users] if users else []
            
        except Exception as e:
            logger.error(f"Error getting all users: {str(e)}")
            return []
        finally:
            conn.close()
    
    def get_user_count(self, search=None, role=None):
        """Get total count of users with optional filtering"""
        conn = self.db.get_connection()
        try:
            query = "SELECT COUNT(*) as count FROM users WHERE 1=1"
            params = []
            
            if search:
                query += " AND (username LIKE ? OR email LIKE ? OR first_name LIKE ? OR last_name LIKE ?)"
                search_param = f"%{search}%"
                params.extend([search_param, search_param, search_param, search_param])
            
            if role:
                query += " AND role = ?"
                params.append(role)
            
            result = conn.execute(query, params).fetchone()
            return result['count'] if result else 0
            
        except Exception as e:
            logger.error(f"Error getting user count: {str(e)}")
            return 0
        finally:
            conn.close()
    
    def create_admin_user(self, username, email, password, first_name=None, last_name=None):
        """Create an admin user"""
        conn = self.db.get_connection()
        try:
            # Check if user already exists
            existing = conn.execute(
                'SELECT id FROM users WHERE username = ? OR email = ?',
                (username, email)
            ).fetchone()
            
            if existing:
                return None, "Username or email already exists"
            
            # Hash password
            password_hash = self.hash_password(password)
            
            # Insert admin user
            cursor = conn.execute('''
                INSERT INTO users (username, email, password_hash, first_name, last_name, role, is_admin, email_verified)
                VALUES (?, ?, ?, ?, ?, 'admin', 1, 1)
            ''', (username, email, password_hash, first_name, last_name))
            
            user_id = cursor.lastrowid
            
            # Create default preferences
            conn.execute('''
                INSERT INTO user_preferences (user_id)
                VALUES (?)
            ''', (user_id,))
            
            conn.commit()
            
            # Return user data
            user_data = self.get_user_by_id(user_id)
            return user_data, None
            
        except Exception as e:
            conn.rollback()
            logger.error(f"Error creating admin user: {str(e)}")
            return None, "An error occurred while creating the admin account"
        finally:
            conn.close()
    
    def change_password(self, user_id, old_password, new_password):
        """Change user password"""
        conn = self.db.get_connection()
        try:
            # Verify old password
            user = conn.execute(
                'SELECT password_hash FROM users WHERE id = ?',
                (user_id,)
            ).fetchone()
            
            if not user or not self.verify_password(old_password, user['password_hash']):
                return False, "Current password is incorrect"
            
            # Hash new password
            new_hash = self.hash_password(new_password)
            
            # Update password
            conn.execute(
                'UPDATE users SET password_hash = ? WHERE id = ?',
                (new_hash, user_id)
            )
            conn.commit()
            
            return True, "Password updated successfully"
            
        except Exception as e:
            conn.rollback()
            logger.error(f"Error changing password: {str(e)}")
            return False, "An error occurred while updating the password"
        finally:
            conn.close()
    
    def deactivate_user(self, user_id):
        """Deactivate user account"""
        conn = self.db.get_connection()
        try:
            conn.execute(
                'UPDATE users SET is_active = 0 WHERE id = ?',
                (user_id,)
            )
            conn.commit()
            return True
            
        except Exception as e:
            conn.rollback()
            logger.error(f"Error deactivating user: {str(e)}")
            return False
        finally:
            conn.close()

class AssessmentHistory:
    def __init__(self, db_manager):
        self.db = db_manager
    
    def save_assessment(self, user_id, session_id, assessment_data):
        """Save assessment results to database"""
        conn = self.db.get_connection()
        try:
            import json
            
            conn.execute('''
                INSERT INTO assessment_results (
                    user_id, session_id, overall_level, xp_earned, time_taken,
                    skill_levels, achievements, responses, assessments, ai_usage_percentage
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                user_id,
                session_id,
                assessment_data.get('overall_level'),
                assessment_data.get('xp_earned', 0),
                assessment_data.get('time_taken', 0),
                json.dumps(assessment_data.get('skill_levels', {})),
                json.dumps(assessment_data.get('achievements', [])),
                json.dumps(assessment_data.get('responses', [])),
                json.dumps(assessment_data.get('assessments', [])),
                assessment_data.get('ai_usage_percentage', 0)
            ))
            
            conn.commit()
            return True
            
        except Exception as e:
            conn.rollback()
            logger.error(f"Error saving assessment: {str(e)}")
            return False
        finally:
            conn.close()
    
    def get_user_assessments(self, user_id, limit=10):
        """Get user's assessment history"""
        conn = self.db.get_connection()
        try:
            import json
            assessments = conn.execute('''
                SELECT * FROM assessment_results 
                WHERE user_id = ? 
                ORDER BY completed_at DESC 
                LIMIT ?
            ''', (user_id, limit)).fetchall()
            
            result = []
            for assessment in assessments:
                assessment_dict = dict(assessment)
                
                # Parse JSON fields if they exist
                try:
                    if assessment_dict.get('skill_levels'):
                        assessment_dict['skill_levels'] = json.loads(assessment_dict['skill_levels'])
                except (json.JSONDecodeError, TypeError):
                    assessment_dict['skill_levels'] = {}
                
                try:
                    if assessment_dict.get('achievements'):
                        assessment_dict['achievements'] = json.loads(assessment_dict['achievements'])
                except (json.JSONDecodeError, TypeError):
                    assessment_dict['achievements'] = []
                
                try:
                    if assessment_dict.get('responses'):
                        assessment_dict['responses'] = json.loads(assessment_dict['responses'])
                except (json.JSONDecodeError, TypeError):
                    assessment_dict['responses'] = []
                
                try:
                    if assessment_dict.get('assessments'):
                        assessment_dict['assessments'] = json.loads(assessment_dict['assessments'])
                except (json.JSONDecodeError, TypeError):
                    assessment_dict['assessments'] = []
                
                result.append(assessment_dict)
            
            return result
            
        except Exception as e:
            logger.error(f"Error getting user assessments: {str(e)}")
            return []
        finally:
            conn.close()
    
    def get_user_stats(self, user_id):
        """Get comprehensive user statistics"""
        conn = self.db.get_connection()
        try:
            # Phase 1 stats
            phase1_stats = conn.execute('''
                SELECT 
                    COUNT(*) as total_assessments,
                    MAX(overall_level) as best_level,
                    AVG(xp_earned) as avg_xp,
                    SUM(xp_earned) as total_xp,
                    AVG(ai_usage_percentage) as avg_ai_usage
                FROM assessment_results 
                WHERE user_id = ?
            ''', (user_id,)).fetchone()
            
            # Phase 2 stats
            phase2_stats = conn.execute('''
                SELECT 
                    COUNT(DISTINCT step_id) as completed_steps,
                    SUM(step_score) as total_phase2_score,
                    AVG(step_score) as avg_step_score,
                    MAX(last_activity) as last_phase2_activity
                FROM phase2_progress 
                WHERE user_id = ? AND step_completed = 1
            ''', (user_id,)).fetchone()
            
            # Phase completion status
            phase_completion = conn.execute('''
                SELECT phase_number, completed, completion_date, final_level
                FROM user_phase_completion 
                WHERE user_id = ?
                ORDER BY phase_number
            ''', (user_id,)).fetchall()
            
            # Current progress
            current_progress = conn.execute('''
                SELECT step_id, current_item, total_items, needs_remedial, remedial_level
                FROM phase2_progress 
                WHERE user_id = ? AND step_completed = 0
                ORDER BY last_activity DESC
                LIMIT 1
            ''', (user_id,)).fetchone()
            
            stats = dict(phase1_stats) if phase1_stats else {}
            phase2_data = dict(phase2_stats) if phase2_stats else {}
            
            stats.update({
                'phase2_completed_steps': phase2_data.get('completed_steps', 0),
                'phase2_total_score': phase2_data.get('total_phase2_score', 0),
                'phase2_avg_score': phase2_data.get('avg_step_score', 0),
                'last_phase2_activity': phase2_data.get('last_phase2_activity'),
                'phase_completion': [dict(pc) for pc in phase_completion] if phase_completion else [],
                'current_progress': dict(current_progress) if current_progress else None
            })
            
            return stats
            
        except Exception as e:
            logger.error(f"Error getting user stats: {str(e)}")
            return {}
        finally:
            conn.close()
    
    def save_phase2_progress(self, user_id, session_id, step_id, progress_data):
        """Save or update Phase 2 step progress"""
        conn = self.db.get_connection()
        try:
            import json
            
            # Check if progress exists
            existing = conn.execute('''
                SELECT id FROM phase2_progress 
                WHERE user_id = ? AND session_id = ? AND step_id = ?
            ''', (user_id, session_id, step_id)).fetchone()
            
            if existing:
                # Update existing
                conn.execute('''
                    UPDATE phase2_progress SET
                        current_item = ?,
                        step_score = ?,
                        step_completed = ?,
                        needs_remedial = ?,
                        remedial_level = ?,
                        remedial_progress = ?,
                        completed_at = ?,
                        last_activity = CURRENT_TIMESTAMP
                    WHERE id = ?
                ''', (
                    progress_data.get('current_item', 0),
                    progress_data.get('step_score', 0),
                    progress_data.get('step_completed', False),
                    progress_data.get('needs_remedial', False),
                    progress_data.get('remedial_level'),
                    json.dumps(progress_data.get('remedial_progress', {})),
                    progress_data.get('completed_at'),
                    existing['id']
                ))
            else:
                # Insert new
                conn.execute('''
                    INSERT INTO phase2_progress (
                        user_id, session_id, step_id, current_item, total_items,
                        step_score, step_completed, needs_remedial, remedial_level,
                        remedial_progress
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    user_id, session_id, step_id,
                    progress_data.get('current_item', 0),
                    progress_data.get('total_items', 5),
                    progress_data.get('step_score', 0),
                    progress_data.get('step_completed', False),
                    progress_data.get('needs_remedial', False),
                    progress_data.get('remedial_level'),
                    json.dumps(progress_data.get('remedial_progress', {}))
                ))
            
            conn.commit()
            return True
            
        except Exception as e:
            conn.rollback()
            logger.error(f"Error saving Phase 2 progress: {str(e)}")
            return False
        finally:
            conn.close()
    
    def save_phase2_response(self, user_id, session_id, step_id, action_item_id, response_data):
        """Save Phase 2 response"""
        conn = self.db.get_connection()
        try:
            import json
            
            conn.execute('''
                INSERT INTO phase2_responses (
                    user_id, session_id, step_id, action_item_id, response_text,
                    assessment_data, points_earned, cefr_level, ai_detected, ai_score
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                user_id, session_id, step_id, action_item_id,
                response_data.get('response_text', ''),
                json.dumps(response_data.get('assessment_data', {})),
                response_data.get('points_earned', 1),
                response_data.get('cefr_level', 'A1'),
                response_data.get('ai_detected', False),
                response_data.get('ai_score', 0)
            ))
            
            conn.commit()
            return True
            
        except Exception as e:
            conn.rollback()
            logger.error(f"Error saving Phase 2 response: {str(e)}")
            return False
        finally:
            conn.close()
    
    def save_phase2_remedial(self, user_id, session_id, step_id, level, activity_data):
        """Save Phase 2 remedial activity"""
        conn = self.db.get_connection()
        try:
            import json
            
            # Check if this activity was already attempted
            existing = conn.execute('''
                SELECT id, attempts FROM phase2_remedial 
                WHERE user_id = ? AND session_id = ? AND step_id = ? 
                AND level = ? AND activity_id = ?
            ''', (user_id, session_id, step_id, level, activity_data.get('activity_id'))).fetchone()
            
            if existing:
                # Update existing attempt
                conn.execute('''
                    UPDATE phase2_remedial SET
                        responses = ?,
                        score = ?,
                        completed = ?,
                        attempts = ?,
                        submitted_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                ''', (
                    json.dumps(activity_data.get('responses', {})),
                    activity_data.get('score', 0),
                    activity_data.get('completed', False),
                    existing['attempts'] + 1,
                    existing['id']
                ))
            else:
                # Insert new attempt
                conn.execute('''
                    INSERT INTO phase2_remedial (
                        user_id, session_id, step_id, level, activity_id,
                        activity_index, responses, score, max_score, completed
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    user_id, session_id, step_id, level,
                    activity_data.get('activity_id'),
                    activity_data.get('activity_index', 0),
                    json.dumps(activity_data.get('responses', {})),
                    activity_data.get('score', 0),
                    activity_data.get('max_score', 6),
                    activity_data.get('completed', False)
                ))
            
            conn.commit()
            return True
            
        except Exception as e:
            conn.rollback()
            logger.error(f"Error saving Phase 2 remedial: {str(e)}")
            return False
        finally:
            conn.close()
    
    def get_phase2_progress(self, user_id):
        """Get user's Phase 2 progress"""
        conn = self.db.get_connection()
        try:
            import json
            
            # Get step progress
            steps = conn.execute('''
                SELECT * FROM phase2_progress 
                WHERE user_id = ?
                ORDER BY started_at
            ''', (user_id,)).fetchall()
            
            # Get responses
            responses = conn.execute('''
                SELECT * FROM phase2_responses 
                WHERE user_id = ?
                ORDER BY submitted_at
            ''', (user_id,)).fetchall()
            
            # Get remedial activities
            remedial = conn.execute('''
                SELECT * FROM phase2_remedial 
                WHERE user_id = ?
                ORDER BY submitted_at
            ''', (user_id,)).fetchall()
            
            result = {
                'steps': [],
                'responses': [],
                'remedial_activities': []
            }
            
            for step in steps:
                step_dict = dict(step)
                try:
                    if step_dict.get('remedial_progress'):
                        step_dict['remedial_progress'] = json.loads(step_dict['remedial_progress'])
                except (json.JSONDecodeError, TypeError):
                    step_dict['remedial_progress'] = {}
                result['steps'].append(step_dict)
            
            for response in responses:
                response_dict = dict(response)
                try:
                    if response_dict.get('assessment_data'):
                        response_dict['assessment_data'] = json.loads(response_dict['assessment_data'])
                except (json.JSONDecodeError, TypeError):
                    response_dict['assessment_data'] = {}
                result['responses'].append(response_dict)
            
            for rem in remedial:
                rem_dict = dict(rem)
                try:
                    if rem_dict.get('responses'):
                        rem_dict['responses'] = json.loads(rem_dict['responses'])
                except (json.JSONDecodeError, TypeError):
                    rem_dict['responses'] = {}
                result['remedial_activities'].append(rem_dict)
            
            return result
            
        except Exception as e:
            logger.error(f"Error getting Phase 2 progress: {str(e)}")
            return {'steps': [], 'responses': [], 'remedial_activities': []}
        finally:
            conn.close()
    
    def update_phase_completion(self, user_id, phase_number, completion_data):
        """Update or insert phase completion status"""
        conn = self.db.get_connection()
        try:
            # Check if record exists
            existing = conn.execute('''
                SELECT id FROM user_phase_completion 
                WHERE user_id = ? AND phase_number = ?
            ''', (user_id, phase_number)).fetchone()
            
            if existing:
                # Update existing
                conn.execute('''
                    UPDATE user_phase_completion SET
                        completed = ?,
                        completion_date = ?,
                        overall_score = ?,
                        final_level = ?,
                        time_spent = ?,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                ''', (
                    completion_data.get('completed', False),
                    completion_data.get('completion_date'),
                    completion_data.get('overall_score', 0),
                    completion_data.get('final_level'),
                    completion_data.get('time_spent', 0),
                    existing['id']
                ))
            else:
                # Insert new
                conn.execute('''
                    INSERT INTO user_phase_completion (
                        user_id, phase_number, completed, completion_date,
                        overall_score, final_level, time_spent
                    ) VALUES (?, ?, ?, ?, ?, ?, ?)
                ''', (
                    user_id, phase_number,
                    completion_data.get('completed', False),
                    completion_data.get('completion_date'),
                    completion_data.get('overall_score', 0),
                    completion_data.get('final_level'),
                    completion_data.get('time_spent', 0)
                ))
            
            conn.commit()
            return True
            
        except Exception as e:
            conn.rollback()
            logger.error(f"Error updating phase completion: {str(e)}")
            return False
        finally:
            conn.close()
    
    def get_system_statistics(self):
        """Get comprehensive system statistics for admin dashboard"""
        conn = self.db.get_connection()
        try:
            import json
            
            # Overall statistics
            overall_stats = conn.execute('''
                SELECT 
                    COUNT(DISTINCT u.id) as total_users,
                    COUNT(DISTINCT ar.id) as total_assessments,
                    COUNT(DISTINCT p2p.id) as total_phase2_sessions,
                    AVG(ar.xp_earned) as avg_xp,
                    MAX(ar.completed_at) as last_assessment
                FROM users u
                LEFT JOIN assessment_results ar ON u.id = ar.user_id
                LEFT JOIN phase2_progress p2p ON u.id = p2p.user_id
            ''').fetchone()
            
            # User activity by month
            user_activity = conn.execute('''
                SELECT 
                    strftime('%Y-%m', created_at) as month,
                    COUNT(*) as new_users
                FROM users 
                WHERE created_at >= date('now', '-12 months')
                GROUP BY strftime('%Y-%m', created_at)
                ORDER BY month
            ''').fetchall()
            
            # Assessment statistics
            assessment_stats = conn.execute('''
                SELECT 
                    overall_level,
                    COUNT(*) as count,
                    AVG(xp_earned) as avg_xp,
                    AVG(time_taken) as avg_time
                FROM assessment_results 
                GROUP BY overall_level
                ORDER BY overall_level
            ''').fetchall()
            
            # Phase 2 progress stats
            phase2_stats = conn.execute('''
                SELECT 
                    step_id,
                    COUNT(*) as attempts,
                    COUNT(CASE WHEN step_completed = 1 THEN 1 END) as completions,
                    AVG(step_score) as avg_score
                FROM phase2_progress 
                GROUP BY step_id
                ORDER BY step_id
            ''').fetchall()
            
            # Recent activity
            recent_activity = conn.execute('''
                SELECT 
                    'assessment' as type,
                    ar.overall_level as level,
                    ar.completed_at as timestamp,
                    u.username,
                    u.first_name,
                    ar.xp_earned as points
                FROM assessment_results ar
                JOIN users u ON ar.user_id = u.id
                WHERE ar.completed_at >= date('now', '-7 days')
                
                UNION ALL
                
                SELECT 
                    'phase2_response' as type,
                    p2r.cefr_level as level,
                    p2r.submitted_at as timestamp,
                    u.username,
                    u.first_name,
                    p2r.points_earned as points
                FROM phase2_responses p2r
                JOIN users u ON p2r.user_id = u.id
                WHERE p2r.submitted_at >= date('now', '-7 days')
                
                ORDER BY timestamp DESC
                LIMIT 20
            ''').fetchall()
            
            return {
                'overall': dict(overall_stats) if overall_stats else {},
                'user_activity': [dict(ua) for ua in user_activity] if user_activity else [],
                'assessment_stats': [dict(astat) for astat in assessment_stats] if assessment_stats else [],
                'phase2_stats': [dict(p2stat) for p2stat in phase2_stats] if phase2_stats else [],
                'recent_activity': [dict(ra) for ra in recent_activity] if recent_activity else []
            }
            
        except Exception as e:
            logger.error(f"Error getting system statistics: {str(e)}")
            return {}
        finally:
            conn.close()
    
    def get_user_detailed_progress(self, user_id):
        """Get detailed progress for a specific user"""
        conn = self.db.get_connection()
        try:
            import json
            
            # User basic info
            user_info = conn.execute('''
                SELECT * FROM users WHERE id = ?
            ''', (user_id,)).fetchone()
            
            # Phase 1 assessments
            phase1_assessments = conn.execute('''
                SELECT * FROM assessment_results 
                WHERE user_id = ? 
                ORDER BY completed_at DESC
            ''', (user_id,)).fetchall()
            
            # Phase 2 progress
            phase2_steps = conn.execute('''
                SELECT * FROM phase2_progress 
                WHERE user_id = ? 
                ORDER BY started_at
            ''', (user_id,)).fetchall()
            
            # Phase 2 responses
            phase2_responses = conn.execute('''
                SELECT * FROM phase2_responses 
                WHERE user_id = ? 
                ORDER BY submitted_at DESC
            ''', (user_id,)).fetchall()
            
            # Remedial activities
            remedial_activities = conn.execute('''
                SELECT * FROM phase2_remedial 
                WHERE user_id = ? 
                ORDER BY submitted_at DESC
            ''', (user_id,)).fetchall()
            
            # Parse JSON fields for Phase 1 assessments
            parsed_phase1 = []
            for assessment in phase1_assessments:
                assessment_dict = dict(assessment)
                for field in ['skill_levels', 'achievements', 'responses', 'assessments']:
                    try:
                        if assessment_dict.get(field):
                            assessment_dict[field] = json.loads(assessment_dict[field])
                    except (json.JSONDecodeError, TypeError):
                        assessment_dict[field] = {} if field in ['skill_levels'] else []
                parsed_phase1.append(assessment_dict)
            
            # Parse JSON fields for Phase 2 responses
            parsed_phase2_responses = []
            for response in phase2_responses:
                response_dict = dict(response)
                try:
                    if response_dict.get('assessment_data'):
                        response_dict['assessment_data'] = json.loads(response_dict['assessment_data'])
                except (json.JSONDecodeError, TypeError):
                    response_dict['assessment_data'] = {}
                parsed_phase2_responses.append(response_dict)
            
            # Parse JSON fields for remedial activities  
            parsed_remedial = []
            for remedial in remedial_activities:
                remedial_dict = dict(remedial)
                try:
                    if remedial_dict.get('responses'):
                        remedial_dict['responses'] = json.loads(remedial_dict['responses'])
                except (json.JSONDecodeError, TypeError):
                    remedial_dict['responses'] = {}
                parsed_remedial.append(remedial_dict)
            
            return {
                'user_info': dict(user_info) if user_info else {},
                'phase1_assessments': parsed_phase1,
                'phase2_steps': [dict(p) for p in phase2_steps] if phase2_steps else [],
                'phase2_responses': parsed_phase2_responses,
                'remedial_activities': parsed_remedial
            }
            
        except Exception as e:
            logger.error(f"Error getting user detailed progress: {str(e)}")
            return {}
        finally:
            conn.close()
    
    def get_all_users_progress_summary(self, limit=50, offset=0):
        """Get progress summary for all users"""
        conn = self.db.get_connection()
        try:
            users_progress = conn.execute('''
                SELECT 
                    u.id,
                    u.username,
                    u.first_name,
                    u.last_name,
                    u.email,
                    u.created_at,
                    u.last_login,
                    u.is_active,
                    COUNT(DISTINCT ar.id) as total_assessments,
                    MAX(ar.overall_level) as best_level,
                    SUM(ar.xp_earned) as total_xp,
                    COUNT(DISTINCT p2p.step_id) as phase2_steps_attempted,
                    COUNT(DISTINCT CASE WHEN p2p.step_completed = 1 THEN p2p.step_id END) as phase2_steps_completed,
                    MAX(p2p.last_activity) as last_phase2_activity,
                    MAX(ar.completed_at) as last_assessment_date
                FROM users u
                LEFT JOIN assessment_results ar ON u.id = ar.user_id
                LEFT JOIN phase2_progress p2p ON u.id = p2p.user_id
                WHERE u.role != 'admin'
                GROUP BY u.id
                ORDER BY u.created_at DESC
                LIMIT ? OFFSET ?
            ''', (limit, offset)).fetchall()
            
            return [dict(user) for user in users_progress] if users_progress else []
            
        except Exception as e:
            logger.error(f"Error getting all users progress summary: {str(e)}")
            return []
        finally:
            conn.close()

# Authentication decorators
def login_required(f):
    """Decorator to require login for routes"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        from flask import request, jsonify

        if 'user_id' not in session:
            # Check if this is an API request
            if request.path.startswith('/api/') or request.headers.get('Content-Type') == 'application/json':
                return jsonify({'success': False, 'error': 'Authentication required. Please log in.'}), 401
            flash('Please log in to access this page.', 'warning')
            return redirect(url_for('auth.login'))
        return f(*args, **kwargs)
    return decorated_function

def guest_only(f):
    """Decorator to allow only guests (not logged in users)"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' in session:
            return redirect('/app/dashboard')
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    """Decorator to require admin privileges"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        from flask import request, jsonify
        
        if 'user_id' not in session:
            # Check if this is an API request
            if request.path.startswith('/api/') or request.headers.get('Content-Type') == 'application/json':
                return jsonify({'error': 'Authentication required'}), 401
            flash('Please log in to access this page.', 'warning')
            return redirect(url_for('auth.login'))
        
        # Check if user is admin
        user_id = session.get('user_id')
        is_admin = session.get('is_admin', False)
        
        if not is_admin:
            # Double-check from database
            db_manager = DatabaseManager()
            user_manager_instance = User(db_manager)
            user_data = user_manager_instance.get_user_by_id(user_id)
            
            if not user_data or not user_data.get('is_admin'):
                # Check if this is an API request
                if request.path.startswith('/api/') or request.headers.get('Content-Type') == 'application/json':
                    return jsonify({'error': 'Admin privileges required'}), 403
                flash('Access denied. Admin privileges required.', 'error')
                return redirect('/dashboard')
            
            # Update session with admin status
            session['is_admin'] = True
            session['role'] = user_data.get('role', 'user')
        
        return f(*args, **kwargs)
    return decorated_function