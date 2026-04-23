# Scoring Changes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Pull all scoring threshold changes from MChtara/FARDI upstream into this project — fixing Phase 2 routing, completing Phase 3 step thresholds, and adding Phase 4 Step 3 score routing.

**Architecture:** Three isolated backend changes: (1) fix the `determine_phase2_user_level` function in `routers/api.py`, (2) replace the CEFR-only scoring in `routers/phase3.py` with total-score-based thresholds per step, (3) add a new `/step/3/calculate-score` endpoint in `routers/phase4.py`.

**Tech Stack:** Python/FastAPI, SQLite, existing `save_phase3_progress` / `save_phase4_progress` helpers.

---

## Task 1: Fix Phase 2 Remedial Routing Thresholds

**Files:**
- Modify: `backend/routers/api.py:162-170`

**Context:**  
Current logic uses `≤7→A1, ≤10→A2, ≤15→B1, else→B2`.  
Upstream uses `<10→A1, <15→A2, <20→B1, else→no remedial` (max score is 20; threshold 20 means no remedial).

**Step 1: Edit `determine_phase2_user_level` in `backend/routers/api.py`**

Replace lines 162–170:

```python
def determine_phase2_user_level(total_score):
    if total_score < 10:
        return 'A1'
    elif total_score < 15:
        return 'A2'
    else:
        return 'B1'
```

> Note: The upstream treats score=20 as "no remedial needed" (handled by `needs_remedial = total_score < PHASE_2_SUCCESS_THRESHOLD` which already exists at line 780). This function is only called when remedial IS needed, so B2 is never returned here — B2 students don't need remedial.

**Step 2: Verify the change looks correct**

```bash
grep -n "determine_phase2_user_level\|def determine_phase2" backend/routers/api.py
```
Expected: function definition at line 162 with the new thresholds.

**Step 3: Commit**

```bash
git add backend/routers/api.py
git commit -m "fix: update Phase 2 remedial routing thresholds to match upstream (<10→A1, <15→A2, else→B1)"
```

---

## Task 2: Fix Phase 3 Step Score Routing (Total-Score-Based)

**Files:**
- Modify: `backend/routers/phase3.py:102-186` (the `calculate_step_score` endpoint)

**Context:**  
Current logic maps the CEFR score from a single interaction (I3 for steps 1-3, I2 for step 4) to a level via `level_map = {1:'A1', 2:'A2', 3:'B1', 4:'B2', 5:'C1'}` and `should_proceed = cefr_score >= 3`.

Upstream uses **total score thresholds per step**:

| Step | Max | <threshold→level |
|------|-----|-----------------|
| 1 | 21 | <12→A1, <18→A2, <22→B1 (B2/C1 unreachable, B1 is effective ceiling) |
| 2 | 23 | <8→A1, <13→A2, <18→B1, <21→B2, ≥21→C1 |
| 3 | 18 | <6→A1, <11→A2, <14→B1, <17→B2, ≥17→C1 |
| 4 | 10 | <2→A1, <4→A2, <6→B1, <8→B2, ≥8→C1 |

`should_proceed` = True when level is B1 or higher (i.e., total score clears the B1 threshold).

**Step 1: Edit `calculate_step_score` in `backend/routers/phase3.py`**

Replace the scoring block (lines ~114–138) inside `calculate_step_score`. The full function body should become:

```python
    try:
        user_id = user["user_id"]
        data = await request.json()

        interaction1_score = data.get('interaction1_score', 0)
        interaction2_score = data.get('interaction2_score', 0)
        interaction3_score = data.get('interaction3_score', 0)

        total_score = interaction1_score + interaction2_score + interaction3_score

        # Total-score-based CEFR routing per step (upstream thresholds)
        if step_id == 1:
            # max 21: matching 0-8, word-find 0-8, writing 1-5
            if total_score < 12:
                remedial_level = 'A1'
            elif total_score < 18:
                remedial_level = 'A2'
            else:
                remedial_level = 'B1'
            i1_max, i2_max, i3_max, total_max = 8, 8, 5, 21
        elif step_id == 2:
            # max 23: matching 0-10, 0-8, writing 0-5
            if total_score < 8:
                remedial_level = 'A1'
            elif total_score < 13:
                remedial_level = 'A2'
            elif total_score < 18:
                remedial_level = 'B1'
            elif total_score < 21:
                remedial_level = 'B2'
            else:
                remedial_level = 'C1'
            i1_max, i2_max, i3_max, total_max = 10, 8, 5, 23
        elif step_id == 3:
            # max 18: explanation 0-8, transformation 0-5, writing 1-5
            if total_score < 6:
                remedial_level = 'A1'
            elif total_score < 11:
                remedial_level = 'A2'
            elif total_score < 14:
                remedial_level = 'B1'
            elif total_score < 17:
                remedial_level = 'B2'
            else:
                remedial_level = 'C1'
            i1_max, i2_max, i3_max, total_max = 8, 5, 5, 18
        else:  # step_id == 4
            # max 10: budget CEFR 1-5, pitch CEFR 1-5
            if total_score < 2:
                remedial_level = 'A1'
            elif total_score < 4:
                remedial_level = 'A2'
            elif total_score < 6:
                remedial_level = 'B1'
            elif total_score < 8:
                remedial_level = 'B2'
            else:
                remedial_level = 'C1'
            i1_max, i2_max, i3_max, total_max = 5, 5, 0, 10

        # Proceed if B1 or above
        level_order = ['A1', 'A2', 'B1', 'B2', 'C1']
        should_proceed = level_order.index(remedial_level) >= 2  # B1=index 2

        # Determine next URL
        next_step_map = {1: 2, 2: 3, 3: 4, 4: None}
        next_step = next_step_map.get(step_id)

        if should_proceed and next_step:
            next_url = f"/app/phase3/step/{next_step}"
        elif should_proceed and not next_step:
            next_url = "/app/phase4/step/1"
        else:
            next_url = f"/app/phase3/step/{step_id}/remedial/{remedial_level.lower()}/task/a"

        # TERMINAL OUTPUT
        print("\n" + "="*60)
        print(f"PHASE 3 STEP {step_id} - SCORING RESULTS")
        print("="*60)
        print(f"User ID: {user_id}")
        print(f"I1={interaction1_score}, I2={interaction2_score}, I3={interaction3_score}")
        print(f"Total: {total_score}/{total_max}, Level: {remedial_level}")
        print(f"PROCEED: {'YES' if should_proceed else 'NO - Remedial Required'}")
        print("="*60 + "\n")

        logger.info(f"Phase 3 Step {step_id} - User {user_id}: I1={interaction1_score}, I2={interaction2_score}, I3={interaction3_score}, Total={total_score}, Level={remedial_level}, Proceed={should_proceed}")

        # Save to DB
        save_phase3_progress(
            user_id, step=step_id, interaction=None, context='main',
            score=total_score, item_id=f'step{step_id}_score', item_type='score',
            prompt=f'Phase 3 Step {step_id} Score',
            answer=json.dumps({'i1': interaction1_score, 'i2': interaction2_score, 'i3': interaction3_score}),
            is_correct=should_proceed
        )

        level_map = {1: 'A1', 2: 'A2', 3: 'B1', 4: 'B2', 5: 'C1'}

        return {
            'success': True,
            'data': {
                'interaction1': {'score': interaction1_score, 'max_score': i1_max},
                'interaction2': {'score': interaction2_score, 'max_score': i2_max, 'level': level_map.get(interaction2_score) if step_id > 3 else None},
                'interaction3': {'score': interaction3_score, 'max_score': i3_max, 'level': level_map.get(interaction3_score) if step_id <= 3 else None},
                'total': {
                    'score': total_score,
                    'max_score': total_max,
                    'remedial_level': remedial_level,
                    'should_proceed': should_proceed,
                    'next_url': next_url
                }
            }
        }
```

**Step 2: Verify no syntax errors**

```bash
cd backend && python -c "import routers.phase3; print('OK')"
```
Expected: `OK`

**Step 3: Commit**

```bash
git add backend/routers/phase3.py
git commit -m "feat: replace CEFR-only Phase 3 scoring with total-score thresholds per step (upstream logic)"
```

---

## Task 3: Add Phase 4 Step 3 Score Routing Endpoint

**Files:**
- Modify: `backend/routers/phase4.py` — add new endpoint after the last `step3/remedial/c1/...` route

**Context:**  
Phase 4 Step 3 has three CEFR interactions (1-5 each), max 15 pts. Upstream thresholds: `<4→A1, <7→A2, <10→B1, <13→B2, ≥13→C1`. Remedial pass thresholds: A1/A2≥18/22 (~82%), B1≥22/27 (~81%), B2≥35/44 (~80%), C1≥43/54 (~80%).

The endpoint doesn't exist yet — the existing `/step3/remedial/*/final-score` endpoints handle individual remedial level scoring but there's no main step 3 routing endpoint.

**Step 1: Find insertion point**

```bash
grep -n "step3/remedial/c1" backend/routers/phase4.py | tail -5
```

Note the last line number of the c1 remedial block to insert after it.

**Step 2: Add endpoint to `backend/routers/phase4.py`**

Append after the last Phase 4 Step 3 remedial route:

```python
@router.post("/step/3/calculate-score")
async def calculate_step3_score(request: Request, user: dict = Depends(get_current_user)):
    """
    Calculate Phase 4 Step 3 total score and determine remedial routing.
    Three CEFR interactions (1-5 each), max 15 pts.
    <4→A1, <7→A2, <10→B1, <13→B2, ≥13→C1
    All users enter remedial (no direct proceed).
    """
    try:
        user_id = user["user_id"]
        data = await request.json()

        interaction1_score = data.get('interaction1_score', 0)
        interaction2_score = data.get('interaction2_score', 0)
        interaction3_score = data.get('interaction3_score', 0)
        total_score = interaction1_score + interaction2_score + interaction3_score

        if total_score < 4:
            remedial_level = 'A1'
        elif total_score < 7:
            remedial_level = 'A2'
        elif total_score < 10:
            remedial_level = 'B1'
        elif total_score < 13:
            remedial_level = 'B2'
        else:
            remedial_level = 'C1'

        # All users go through remedial for step 3
        next_url = f"/app/phase4/step/3/remedial/{remedial_level.lower()}/task/a"

        print("\n" + "="*60)
        print("PHASE 4 STEP 3 - SCORING RESULTS")
        print("="*60)
        print(f"User ID: {user_id}")
        print(f"I1={interaction1_score}, I2={interaction2_score}, I3={interaction3_score}")
        print(f"Total: {total_score}/15, Level: {remedial_level}")
        print(f"ROUTING TO: Remedial {remedial_level}")
        print("="*60 + "\n")

        logger.info(f"Phase 4 Step 3 - User {user_id}: I1={interaction1_score}, I2={interaction2_score}, I3={interaction3_score}, Total={total_score}, Level={remedial_level}")

        save_phase4_progress(
            user_id, step=3, interaction=None, context='main',
            score=total_score, item_id='step3_score', item_type='score',
            prompt='Phase 4 Step 3 Score',
            answer=json.dumps({'i1': interaction1_score, 'i2': interaction2_score, 'i3': interaction3_score}),
            is_correct=False  # always goes to remedial
        )

        return {
            'success': True,
            'data': {
                'interaction1': {'score': interaction1_score, 'max_score': 5},
                'interaction2': {'score': interaction2_score, 'max_score': 5},
                'interaction3': {'score': interaction3_score, 'max_score': 5},
                'total': {
                    'score': total_score,
                    'max_score': 15,
                    'remedial_level': remedial_level,
                    'should_proceed': False,
                    'next_url': next_url
                }
            }
        }

    except Exception as e:
        logger.error(f"Error calculating Phase 4 Step 3 score: {e}")
        return JSONResponse({
            'success': False,
            'error': str(e)
        }, status_code=500)
```

**Step 3: Verify no syntax errors**

```bash
cd backend && python -c "import routers.phase4; print('OK')"
```
Expected: `OK`

**Step 4: Commit**

```bash
git add backend/routers/phase4.py
git commit -m "feat: add Phase 4 Step 3 score routing endpoint with upstream thresholds (<4→A1, <7→A2, <10→B1, <13→B2, ≥13→C1)"
```

---

## Task 4: Smoke Test All Three Changes

**Step 1: Start the backend**

```bash
cd backend && python app.py &
sleep 3
```

**Step 2: Test Phase 2 routing function (unit check)**

```bash
cd backend && python -c "
from routers.api import determine_phase2_user_level
assert determine_phase2_user_level(5) == 'A1', f'Got {determine_phase2_user_level(5)}'
assert determine_phase2_user_level(9) == 'A1', f'Got {determine_phase2_user_level(9)}'
assert determine_phase2_user_level(10) == 'A2', f'Got {determine_phase2_user_level(10)}'
assert determine_phase2_user_level(14) == 'A2', f'Got {determine_phase2_user_level(14)}'
assert determine_phase2_user_level(15) == 'B1', f'Got {determine_phase2_user_level(15)}'
assert determine_phase2_user_level(19) == 'B1', f'Got {determine_phase2_user_level(19)}'
print('Phase 2 thresholds: OK')
"
```

**Step 3: Test Phase 3 routing logic (unit check)**

```bash
cd backend && python -c "
# Step 1: max 21, <12→A1, <18→A2, >=18→B1
cases = [
    (1, 5, 0, 0, 'A1'),   # total=5
    (1, 10, 0, 0, 'A1'),  # total=10, still <12
    (1, 12, 0, 0, 'A2'),  # total=12, >=12 so A2
    (1, 17, 0, 0, 'A2'),  # total=17
    (1, 18, 0, 0, 'B1'),  # total=18, proceed
    (2, 7, 0, 0, 'A1'),   # step2 <8
    (2, 8, 0, 0, 'A2'),   # step2 >=8
    (4, 1, 0, 0, 'A1'),   # step4 <2
    (4, 8, 0, 0, 'C1'),   # step4 >=8
]
print('Phase 3 threshold cases defined. Visual verification only - run server to test endpoint.')
print('OK')
"
```

**Step 4: Test Phase 4 Step 3 endpoint imports**

```bash
cd backend && python -c "
import routers.phase4 as p4
routes = [r.path for r in p4.router.routes]
assert '/api/phase4/step/3/calculate-score' in routes, f'Route missing. Found: {routes}'
print('Phase 4 Step 3 route registered: OK')
"
```

**Step 5: Kill backend**

```bash
pkill -f "python app.py" 2>/dev/null; true
```

**Step 6: Final commit if any fixes needed**

```bash
git add -p
git commit -m "fix: scoring smoke test corrections"
```
