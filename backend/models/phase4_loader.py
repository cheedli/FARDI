"""
Phase 4 JSON Data Loader
Loads Phase 4 data from phase4.json
"""
import json
import os
import sys
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

# Cache for loaded data
_phase4_data = None

def load_phase4_json():
    """Load Phase 4 data from JSON file"""
    global _phase4_data

    if _phase4_data is not None:
        return _phase4_data

    if getattr(sys, 'frozen', False):
        base = Path(sys._MEIPASS)
    else:
        base = Path(__file__).parent.parent.parent

    json_path = base / 'phase4.json'
    
    if not json_path.exists():
        logger.warning(f"phase4.json not found at {json_path}")
        return None
    
    logger.info(f"Loading Phase 4 data from {json_path}")
    
    with open(json_path, 'r', encoding='utf-8') as f:
        _phase4_data = json.load(f)
    
    return _phase4_data

def get_phase4_step(step_id):
    """Get Phase 4 step data by step_id"""
    data = load_phase4_json()
    if not data:
        return None
    
    # For now, we only have step 1
    if step_id == 1:
        return data
    
    return None

