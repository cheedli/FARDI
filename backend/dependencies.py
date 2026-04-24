"""
FastAPI dependency module - singleton instances for database access.
Replaces Flask's module-level imports from auth_routes.
"""
import os
from models.auth import DatabaseManager, User, AssessmentHistory

db_path = os.environ.get("FARDI_DB_PATH", "fardi.db")

db_manager = DatabaseManager(db_path=db_path)
user_manager = User(db_manager)
assessment_history = AssessmentHistory(db_manager)
