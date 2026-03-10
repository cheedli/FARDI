"""
FastAPI dependency module - singleton instances for database access.
Replaces Flask's module-level imports from auth_routes.
"""
from models.auth import DatabaseManager, User, AssessmentHistory

# Singleton instances (same pattern as Flask app)
db_manager = DatabaseManager()
user_manager = User(db_manager)
assessment_history = AssessmentHistory(db_manager)
