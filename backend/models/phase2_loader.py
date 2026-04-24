"""
Phase 2 JSON Data Loader
Loads Phase 2 data from phase2.json and provides same interface as old phase2_data.py
"""
import json
import os
import sys
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

# Cache for loaded data
_phase2_data = None
_phase2_steps = None
_phase2_remedial = None

def load_phase2_json():
    """Load Phase 2 data from JSON file"""
    global _phase2_data

    if _phase2_data is not None:
        return _phase2_data

    # When frozen by PyInstaller, data files are extracted to sys._MEIPASS
    if getattr(sys, 'frozen', False):
        base = Path(sys._MEIPASS)
    else:
        # Dev: project root is three levels up from models/
        base = Path(__file__).parent.parent.parent

    json_path = base / 'phase2.json'

    if not json_path.exists():
        raise FileNotFoundError(f"phase2.json not found at {json_path}")
    
    logger.info(f"Loading Phase 2 data from {json_path}")
    
    with open(json_path, 'r', encoding='utf-8') as f:
        _phase2_data = json.load(f)
    
    logger.info(f"Loaded {len(_phase2_data.get('steps', []))} Phase 2 steps")
    return _phase2_data

def convert_steps_to_old_format():
    """Convert JSON steps format to old Python dict format for backward compatibility"""
    global _phase2_steps

    if _phase2_steps is not None:
        return _phase2_steps

    data = load_phase2_json()
    steps = {}

    for step in data['steps']:
        step_id = f"step_{step['step_id']}"

        # Convert action items
        action_items = []
        for item in step['main_activity']['action_items']:
            # Use existing ID or generate from title
            item_id = item.get('id', item['title'].lower().replace(' ', '_').replace('-', '_'))

            action_items.append({
                'id': item_id,
                'speaker': item.get('instructor', 'Team'),
                'question': item['question'],
                'instruction': item['instruction'],
                'type': 'text_response',
                'expected_responses': item['cefr_responses'],
                'assessment_focus': item.get('assessment_focus', ['vocabulary', 'grammar', 'coherence', 'task_fulfillment']),
                'audio_script': item.get('audio_script', None),
                'hint': item.get('hint', None)
            })

        steps[step_id] = {
            'title': step['title'],
            'description': step['description'],
            'scenario': step['main_activity']['scenario'],
            'action_items': action_items,
            'success_threshold': 20,
            'success_feedback': f"Excellent work on {step['title']}! You've demonstrated great teamwork and planning skills. Ready for the next challenge!",
            'remedial_feedback': f"Good effort on {step['title']}! Let's practice some activities to strengthen your skills before moving forward."
        }

    _phase2_steps = steps
    logger.info(f"Converted {len(steps)} steps to old format")
    return steps

def convert_remedial_to_old_format():
    """Convert JSON remedial activities to old Python dict format"""
    global _phase2_remedial
    
    if _phase2_remedial is not None:
        return _phase2_remedial
    
    data = load_phase2_json()
    remedial = {}
    
    for step in data['steps']:
        step_id = f"step_{step['step_id']}"
        remedial[step_id] = {}
        
        for level in ['A1', 'A2', 'B1']:
            if level in step['remedial_activity']:
                remedial[step_id][level] = []
                
                for task in step['remedial_activity'][level]:
                    # Infer success_threshold from content
                    threshold = 6  # Default
                    
                    if 'pairs' in task:
                        threshold = len(task['pairs'])
                    elif 'correct_answers' in task:
                        threshold = len(task['correct_answers'])
                    elif 'templates' in task:
                        threshold = len(task['templates'])
                    elif 'dialogue_lines' in task:
                        # Count templates in dialogue
                        template_count = sum(1 for line in task['dialogue_lines'] if 'template' in line)
                        threshold = template_count if template_count > 0 else 6
                    
                    # Build remedial activity dict
                    activity = {
                        'id': f"{step_id}_{level}_{task['task_id']}",
                        'type': task['type'],
                        'instruction': task['instruction'],
                        'success_threshold': threshold,
                        'audio_script': task.get('audio_script', None)
                    }
                    
                    # Add all other fields from task
                    for key, value in task.items():
                        if key not in ['task_id', 'type', 'instruction', 'audio_script']:
                            activity[key] = value
                    
                    remedial[step_id][level].append(activity)
    
    _phase2_remedial = remedial
    logger.info(f"Converted remedial activities for {len(remedial)} steps")
    return remedial

# Load and convert data on module import
try:
    PHASE_2_STEPS = convert_steps_to_old_format()
    PHASE_2_REMEDIAL_ACTIVITIES = convert_remedial_to_old_format()
    
    # Scoring constants from JSON metadata
    PHASE_2_POINTS = {
        'A1': 1,
        'A2': 2,
        'B1': 3,
        'B2': 4
    }
    
    PHASE_2_SUCCESS_THRESHOLD = 20
    
    logger.info("Phase 2 JSON data loaded successfully")
    
except Exception as e:
    logger.error(f"Error loading Phase 2 JSON data: {e}")
    # Provide empty defaults to prevent import errors
    PHASE_2_STEPS = {}
    PHASE_2_REMEDIAL_ACTIVITIES = {}
    PHASE_2_POINTS = {'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4}
    PHASE_2_SUCCESS_THRESHOLD = 20
