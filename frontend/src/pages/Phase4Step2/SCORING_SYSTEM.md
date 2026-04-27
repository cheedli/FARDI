# Phase 4 Step 2 - Scoring System Documentation

## Overview
Phase 4 Step 2 uses a comprehensive CEFR-based scoring system across 3 interactions to assess student language proficiency and route them to appropriate remedial activities.

## Scoring Scale
- **A1**: 1 point per interaction
- **A2**: 2 points per interaction
- **B1**: 3 points per interaction
- **B2**: 4 points per interaction
- **C1**: 5 points per interaction

**Total Possible Score**: 15 points (3 interactions × 5 points max)

## Interaction Breakdown

### Interaction 1: Define "Persuasive" for Posters
**Video**: 10 Advertising Characteristics (4:30)
**Key Terms**: promotional, persuasive, targeted, original, creative, consistent, personalized, ethical

#### Evaluation Criteria

| Level | Score | Expected Response Example | Requirements |
|-------|-------|---------------------------|--------------|
| **A1** | 1 | "Persuasive is make buy. Video say convince." | Basic, fragmented; mentions convince or buy |
| **A2** | 2 | "Persuasive is to convince people to buy, like video say with feelings." | Simple with basic concepts; mentions convince + buy/video/feelings |
| **B1** | 3 | "Persuasive means using ethos, pathos, logos to make the poster convince viewers the product is better, as the video explained for ads." | Clear definition with ethos/pathos/logos mentioned; 12+ words |
| **B2** | 4 | "Persuasive advertising in posters involves emotional, logical, and credible appeals to demonstrate superiority over competitors, as detailed in the video's pathos/ethos/logos section." | Multiple rhetorical appeals + superiority; 15+ words |
| **C1** | 5 | "Persuasive techniques for posters draw on ethos (authority), pathos (emotions), and logos (logic) to influence purchasing habits by highlighting product superiority, mirroring the video's emphasis on convincing consumers effectively without overt pressure." | Sophisticated understanding with ethos/pathos/logos + influence/superiority; 20+ words |

---

### Interaction 2: Explain "Dramatisation" in Videos
**Videos**:
1. Film Drama Principles (3:30)
2. Successful Ad Keys (5:30)

**Key Terms**: dramatisation, character, goal, obstacles, small ideas, friction

#### Evaluation Criteria

| Level | Score | Expected Response Example | Requirements |
|-------|-------|---------------------------|--------------|
| **A1** | 1 | "Dramatisation is story. Video show people try." | Basic; mentions story or character trying |
| **A2** | 2 | "Dramatisation is story with goal in video, like first video say character try something." | Simple with goal; story + (goal/character) + video reference; 10+ words |
| **B1** | 3 | "Dramatisation is creating a sketch with relatable character, clear goal, and obstacles to engage, as the first video explained for short films." | Character + goal + obstacles; 15+ words |
| **B2** | 4 | "Dramatisation uses scripted scenes with character goals and visual obstacles for emotional impact, as illustrated in the first video's drama principles and second's small ideas for seamless ads." | Character + goal + obstacles + emotional impact/sketch; 20+ words |
| **C1** | 5 | "Dramatisation employs theatrical storytelling with relatable characters facing filmable goals and obstacles to captivate viewers persuasively, as the first video's principles demonstrate, aligning with the second video's advocacy for small, frictionless ideas that integrate products naturally." | Theatrical/persuasive + character + goal + obstacles + (filmable/frictionless/small ideas); 25+ words |

---

### Interaction 3: Game Connection Explanation
**Game**: Sushi Spell
**Vocabulary Words**: persuasive, targeted, creative, dramatisation, goal, obstacles, friction

#### Evaluation Criteria

| Level | Score | Expected Response Example | Requirements |
|-------|-------|---------------------------|--------------|
| **A1** | 1 | "Game help word." | Basic attempt |
| **A2** | 2 | "Sushi Spell practice 'persuasive' word." | Mentions vocabulary word; 5+ words |
| **B1** | 3 | "Sushi Spell helps practice spelling 'targeted' because game is timed." | Word + (game/practice); 8+ words |
| **B2** | 4 | "Use Sushi Spell to practice 'dramatisation' because the timed format helps remember how it was used in the first video." | Word + game + (video/practice); 12+ words |
| **C1** | 5 | "Sushi Spell reinforces spelling of 'persuasive' through timed practice, connecting to the first video's explanation of convincing techniques in advertising." | Word + game + video connection with explanation; 15+ words |

---

## Total Score Calculation & Remedial Routing

After all 3 interactions are completed, the total score is calculated and students are routed to level-appropriate remedial activities:

### Routing Logic

| Total Score | Assigned Level | Route Destination |
|-------------|----------------|-------------------|
| **0-3** | A1 | `/app/phase4/step/2/remedial/a1/task/a` |
| **4-6** | A2 | `/app/phase4/step/2/remedial/a2/task/a` |
| **7-9** | B1 | `/app/phase4/step/2/remedial/b1/task/a` |
| **10-12** | B2 | `/app/phase4/step/2/remedial/b2/task/a` |
| **13-15** | C1 | `/app/phase4/step/2/remedial/c1/task/a` |

### Remedial Activities Structure

- **A1 Remedial**: 3 tasks (TaskA, TaskB, TaskC)
- **A2 Remedial**: 3 tasks (TaskA, TaskB, TaskC)
- **B1 Remedial**: 6 tasks (TaskA-F) + Results page
- **B2 Remedial**: 6 tasks (TaskA-F) + Results page
- **C1 Remedial**: 8 tasks (TaskA-H)

---

## Technical Implementation

### Frontend (React)
- **Session Storage Keys**:
  - `phase4_step2_interaction1_score` (1-5)
  - `phase4_step2_interaction2_score` (1-5)
  - `phase4_step2_interaction3_score` (1-5)
  - `phase4_step2_total_score` (0-15)

### Backend (Flask)
- **API Endpoint**: `/api/phase4/evaluate-definition`
- **Evaluation Methods**:
  1. **AI Evaluation** (Primary): Uses Groq API with CEFR-specific prompts
  2. **Fallback Evaluation**: Keyword-based local scoring when AI unavailable

### Evaluation Flow
1. Student submits answer
2. Frontend calls `/api/phase4/evaluate-definition` with answer and context
3. Backend attempts AI evaluation with CEFR-specific criteria
4. If AI fails, uses fallback keyword-based evaluation
5. Score (1-5) and level returned to frontend
6. Score stored in sessionStorage
7. After Interaction 3, total score calculated
8. Student routed to appropriate remedial level

---

## Assessment Focus

### Interaction 1 (Persuasive)
- **Grammar**: Vocabulary accuracy
- **Content**: Understanding of ethos, pathos, logos
- **Listening**: Video comprehension and concept application

### Interaction 2 (Dramatisation)
- **Grammar**: Causal phrases, explanatory language
- **Content**: Character, goal, obstacles understanding
- **Listening**: Multi-video synthesis

### Interaction 3 (Game Connection)
- **Grammar**: Explanatory structures
- **Content**: Vocabulary retention and application
- **Meta-cognitive**: Learning strategy awareness

---

## Notes for Developers

1. **Score Validation**: All scores must be between 1-5 (never 0 unless error)
2. **Level Assignment**: Must match score (1=A1, 2=A2, 3=B1, 4=B2, 5=C1)
3. **Feedback**: Always encouraging, specific to level achieved
4. **Routing**: Total score calculation happens in Interaction3 `handleContinue()`
5. **Session Persistence**: Scores persist in sessionStorage throughout session
6. **AI Prompts**: Term-specific prompts in backend for "persuasive" and "dramatisation"
