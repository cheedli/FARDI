# FARDI Exercise Types Reference

**Audience:** New developers who need to understand what each exercise component does, how it works, and how to add new ones.

**Last Updated:** 2026-04-27

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Shared Prop Contracts](#shared-prop-contracts)
3. [Exercise Components](#exercise-components)
   - [ExerciseRenderer](#1-exerciserenderer)
   - [DragDropGapFill](#2-dragdropgapfill)
   - [DragDropMatchingGame](#3-dragdropmatchinggame)
   - [ChatChallengeGame](#4-chatchallengegame)
   - [DebateDuelGame](#5-debateduegame)
   - [BillboardDesigner](#6-billboarddesigner)
   - [EventPlannerBoard](#7-eventplannerboard)
   - [CompareQuestGame](#8-comparequestgame)
   - [CritiqueChallengeGame](#9-critiquechallengegame)
   - [exercises/DragAndDropExercise](#10-exercisesdraganddropexercise)
   - [exercises/DialogueCompletionExercise](#11-exercisesdialoguecompletionexercise)
   - [exercises/SentenceBuilder](#12-exercisessentencebuilder)
   - [exercises/SentenceGarden](#13-exercisessentencegarden)
   - [exercises/ChatMessengerSim](#14-exerciseschatmessengersim)
   - [exercises/PhoneCallSim](#15-exercisesphonecallsim)
   - [exercises/DebateArena](#16-exercisesdebatearena)
   - [exercises/RhythmMatcher](#17-exercisesrythmmatcher)
   - [exercises/ConversationTetris](#18-exercisesconversationtetris)
4. [Adding a New Exercise](#adding-a-new-exercise)

---

## Architecture Overview

Exercise components live in two places:

```
frontend/src/components/
├── ExerciseRenderer.jsx         # Phase 1/2 generic dispatcher
├── DragDropGapFill.jsx          # Gap-fill with drag-drop (Phase 3/4)
├── DragDropMatchingGame.jsx     # Image↔definition matching (Phase 3/4)
├── ChatChallengeGame.jsx        # Chat-style gap-fill (Phase 4)
├── DebateDuelGame.jsx           # Debate gap-fill (Phase 4)
├── BillboardDesigner.jsx        # Poster sentence completion (Phase 4)
├── EventPlannerBoard.jsx        # Task card builder (Phase 4)
├── CompareQuestGame.jsx         # AI-graded comparison writing (Phase 4_2)
├── CritiqueChallengeGame.jsx    # AI-graded critique writing (Phase 4_2)
└── exercises/
    ├── DragAndDropExercise.jsx  # CSS-based drag-drop (legacy)
    ├── DialogueCompletionExercise.jsx  # Turn-by-turn chat (legacy)
    ├── SentenceBuilder.jsx      # Animated sentence assembly (Phase 5/6)
    ├── SentenceGarden.jsx       # Generative writing garden (Phase 5/6)
    ├── ChatMessengerSim.jsx     # Messenger with TTS audio (Phase 5/6)
    ├── PhoneCallSim.jsx         # Phone UI with TTS + word bank (Phase 5/6)
    ├── DebateArena.jsx          # Battle arena negotiation (Phase 5/6)
    ├── RhythmMatcher.jsx        # Audio-visual term matching (Phase 5/6)
    └── ConversationTetris.jsx   # Arcade word-catching game (Phase 5/6)
```

### Theming

All MUI-based components share a **clay/bento** design system:

| Token | Light mode | Dark mode |
|-------|-----------|----------|
| Page background | `#FFFDE7` | `#0F0F1A` |
| Card background | `#ffffff` | `#1A1A2E` |
| Heading text | `#1A237E` | `#E8EAFF` |
| Body text | `#37474F` | `#B0BEC5` |
| Card border | 2px solid accent color | 2px solid accent color |
| Card shadow | `4px 4px 0 <shadow-color>` | same |

Each component detects dark mode via `useTheme()` and switches palette accordingly.

---

## Shared Prop Contracts

Most exercise components accept a common subset of props:

```typescript
interface ExerciseProps {
  exercise: ExerciseData    // The exercise configuration object
  onComplete: (result: CompletionResult) => void  // Called when done
  onProgress?: (update: ProgressUpdate) => void   // Called on each step
}

interface CompletionResult {
  isPerfect?: boolean
  score?: number
  correctCount?: number
  totalCount?: number
  answers?: Record<string, any>
  // Component-specific extra fields
}
```

---

## Exercise Components

---

### 1. ExerciseRenderer

**File:** `frontend/src/components/ExerciseRenderer.jsx`

**Purpose:** Generic dispatcher used in Phase 1 and Phase 2 interactions. Reads `question.type` and renders the appropriate sub-UI. Not a standalone exercise — it renders one question at a time within an interaction page.

**What the student does:** Depends on question type (see table below).

**Props:**

```typescript
interface Props {
  question: {
    type: string              // Determines which sub-UI to render
    audio_url?: string        // For 'listening' type
    blanks?: string[]         // For 'word_bank' type
    template?: string         // Sentence template with ___ gaps
    hint?: string             // Optional hint text
    dialogue_context?: string // For 'dialogue' type
    skill?: string            // Metadata label
  }
  onSubmit: (answer: string | string[]) => void
  loading: boolean
}
```

**Rendering dispatch table:**

| `question.type` | Sub-UI rendered |
|-----------------|-----------------|
| `listening` | VoiceNoteBubble player + free-text answer textarea |
| `word_bank` | Template with `___` gaps replaced by dropdown `<select>` elements; each dropdown shows the `blanks` array options |
| `social_interaction` | Situation tips (parsed from `question.template`) + textarea |
| `problem_solving` | 2-step guide (assess → act) + textarea |
| `writing` | Plain textarea for a paragraph |
| `dialogue` | Dialogue context box + textarea |
| *(default)* | Label + textarea |

**Scoring logic:** None — scoring happens in the backend after `onSubmit` sends the answer to the phase router.

**CEFR levels / phases:** Phase 1 (all levels), Phase 2 (all levels).

**UI mockup (word_bank type):**

```
┌──────────────────────────────────────────────┐
│  Complete the sentence:                       │
│                                              │
│  "The event ______ very popular because       │
│   it was ______."                             │
│        [was ▼]              [free ▼]          │
│                                              │
│  [  Submit Answer  ]                         │
└──────────────────────────────────────────────┘
```

---

### 2. DragDropGapFill

**File:** `frontend/src/components/DragDropGapFill.jsx`

**Purpose:** Students drag words from a word bank into numbered gap slots inside sentences. Used in Phase 3 and Phase 4 remedial tasks.

**What the student does:** Reads sentences with `___` gaps. Drags words from a panel on the side (or below on mobile) into the correct gap positions.

**Props:**

```typescript
interface Props {
  wordBank: string[]           // Available words to drag
  sentences: string[]          // Sentences with ___ markers
  answers: Record<string, string> // { gapId: correctWord }
                               // gapId format: "g_{startIndex+i}_0"
  onComplete: (result: {
    score: number
    total: number
    placedWords: Record<string, string>
    correctAnswers: Record<string, string>
  }) => void
  startIndex?: number          // Used to compute gapId prefix (default 0)
}
```

**Scoring logic:** `score = count of gap slots where placedWord === correctWord`. Called immediately when all gaps are filled.

**Drag mechanism:** HTML5 Drag and Drop API (`draggable`, `onDragStart`, `onDrop`, `onDragOver`). Words can be dragged back out of a gap into the bank.

**CEFR levels / phases:** Phase 3 Steps 1–4 remedials (A1–C1), Phase 4 Step 1 remedials.

**UI mockup:**

```
┌────────────────────────────────────────────────────────┐
│  Word Bank                                             │
│  [planning] [budgeting] [organize] [schedule]          │
├────────────────────────────────────────────────────────┤
│  1. The team needs to _______ the venue booking.       │
│                        [        ]  ← drop zone         │
│                                                        │
│  2. We should start _______ for next month.            │
│                      [        ]  ← drop zone           │
│                                                        │
│  [  Check Answers  ]                                   │
└────────────────────────────────────────────────────────┘
```

---

### 3. DragDropMatchingGame

**File:** `frontend/src/components/DragDropMatchingGame.jsx`

**Purpose:** Students match image cards to definition cards by dragging. Timed game. Used in Phase 3 and Phase 4.

**What the student does:** See shuffled image cards on the top row. Read definition cards on the bottom row. Drag an image card onto the matching definition. Timer starts on the first drag action.

**Props:**

```typescript
interface Props {
  pairs: Array<{
    word: string
    image: string        // Image URL or emoji/icon identifier
    definition: string
  }>
  duration?: number      // Time limit in seconds (optional)
  onComplete: (result: {
    score: number
    total: number
    timeUsed: number
    isPerfect: boolean
  }) => void
}
```

**Scoring logic:** `score = number of correctly matched image→definition pairs`. Full score if all matched correctly.

**CEFR levels / phases:** Phase 3 remedials (B1–C1), Phase 4 remedials.

**UI mockup:**

```
┌──────────────────────────────────────────────────────┐
│  ⏱ 02:45 remaining                    Score: 2/5    │
├──────────────────────────────────────────────────────┤
│  Image Cards (draggable):                            │
│  [📅 Calendar] [🎵 Notes] [🎪 Tent] [💰 Coins]      │
├──────────────────────────────────────────────────────┤
│  Definition Drop Zones:                              │
│  ┌────────────────┐  ┌────────────────┐             │
│  │ Musical        │  │ An outdoor     │             │
│  │ notation       │  │ gathering      │             │
│  │ symbols        │  │ space          │             │
│  └────────────────┘  └────────────────┘             │
└──────────────────────────────────────────────────────┘
```

---

### 4. ChatChallengeGame

**File:** `frontend/src/components/ChatChallengeGame.jsx`

**Purpose:** Chat-style gap-fill exercise. The student sees a conversation history and must complete the current line using words from a word bank. Used in Phase 4 remedial tasks.

**What the student does:** Reads a running chat transcript. For each line with blanks, taps words from the word bank in the correct order to fill the `___` gaps. Can retry any line without penalty.

**Props:**

```typescript
interface Props {
  dialogueLines: Array<{
    speaker: string        // e.g. "SKANDER" or "You"
    template: string       // Sentence with ___ gaps
    blanks: string[]       // Array of correct words (in order)
  }>
  wordBank: string[]       // All available words (correct + distractors)
  onComplete: (result: {
    score: number
    total: number
    answers: Record<number, string[]>
  }) => void
}
```

**Scoring logic:** Per word: 1 point if the placed word matches `blanks[position]`. No penalty for wrong placements (can be removed and retried).

**CEFR levels / phases:** Phase 4 (A1–B2 remedials, all steps).

**UI mockup:**

```
┌─────────────────────────────────────────────────┐
│  [SKANDER]: "The budget for the event is ___."  │
│  [You]: "We should ___ the venue by Friday."    │
│  [SKANDER]: "Good plan! Can you also ___..."    │
├─────────────────────────────────────────────────┤
│  Current line to fill:                          │
│  "We need to ___ tickets for ___ guests."       │
│       [      ] for [      ]                     │
│                                                 │
│  Word Bank: [sell] [50] [print] [online] [100]  │
└─────────────────────────────────────────────────┘
```

---

### 5. DebateDuelGame

**File:** `frontend/src/components/DebateDuelGame.jsx`

**Purpose:** Debate simulation with word-bank gap-fill. Student and an opponent (SKANDER) alternate turns. Correct answers grow the student's score bar. Used in Phase 4 remedials.

**What the student does:** Reads SKANDER's debate argument. Fills in `___` blanks in their own rebuttal using words from the word bank. Correct fills advance the student's persuasion score.

**Props:**

```typescript
interface Props {
  debateLines: Array<{
    speaker: string        // "SKANDER" or "You"
    template: string       // Line with ___ gaps
    blanks: string[]       // Correct words in order
  }>
  wordBank: string[]
  onComplete: (result: {
    score: number
    total: number
  }) => void
}
```

**Scoring logic:** Same word-position matching as `ChatChallengeGame`. Dual score bars show student progress vs. opponent.

**CEFR levels / phases:** Phase 4 (B1–B2 remedials).

**UI mockup:**

```
┌────────────────────────────────────────────────┐
│  YOU ████████░░░░░░░░░░  SKANDER               │
│  42%                                     58%   │
├────────────────────────────────────────────────┤
│  SKANDER: "The event budget should be cut..."  │
│                                                │
│  YOUR REBUTTAL:                                │
│  "Cutting ___ would hurt the ___."             │
│      [      ]          [      ]                │
│                                                │
│  [music] [budget] [quality] [decorations]      │
└────────────────────────────────────────────────┘
```

---

### 6. BillboardDesigner

**File:** `frontend/src/components/BillboardDesigner.jsx`

**Purpose:** Students complete sentences that assemble into a festival event poster. Each completed sentence appears as a color-coded section of the poster. Used in Phase 4 remedials.

**What the student does:** Reads sentence templates with blanks. Types their completion into text fields. The poster preview updates live with each completed section.

**Props:**

```typescript
interface Props {
  templates: string[]          // Sentence templates with ___ gaps
  answers: Record<number, string>  // Student's current answers
  onChange: (answers: Record<number, string>) => void
  correctAnswers?: string[]    // Used for exact-string validation
}
```

**Scoring logic:** Exact normalized string match between student answer and `correctAnswers[i]`. Score = count of correct sections.

**Section color coding** (auto-detected by keywords in the template):
- Music → blue
- Decorations → purple
- Food → orange
- Promotion → green
- Event → teal
- General → yellow

**CEFR levels / phases:** Phase 4 remedials (A1–A2).

**UI mockup:**

```
┌──────────────────────────────────────────────────┐
│             🎪 EVENT BILLBOARD                    │
│  ┌──────────────────────────────────────────┐    │
│  │ 🎵 Music: Live performances by _________ │    │
│  └──────────────────────────────────────────┘    │
│  ┌──────────────────────────────────────────┐    │
│  │ 🎨 Decor: The theme will be ___________  │    │
│  └──────────────────────────────────────────┘    │
├──────────────────────────────────────────────────┤
│  Complete each section:                          │
│  Music: [_________________________]              │
│  Decor: [_________________________]              │
│  [  Submit Poster  ]                             │
└──────────────────────────────────────────────────┘
```

---

### 7. EventPlannerBoard

**File:** `frontend/src/components/EventPlannerBoard.jsx`

**Purpose:** Students create task cards for festival planning by writing sentences describing who does what and why. Used in Phase 4 remedials.

**What the student does:** Reads a planning prompt/template. Types a full sentence (minimum 10 characters) that describes a task. The component parses the sentence to extract character/task/reason.

**Props:**

```typescript
interface Props {
  exercise: {
    templates?: string[]
    planning_template?: string    // Single template string
    planning_items?: string[]     // Alternative source of templates
    instruction?: string
  }
  templates?: string[]           // Can override exercise.templates
  answers: Record<number, string>
  onChange: (answers: Record<number, string>) => void
}
```

**Scoring logic:** Minimum 10 characters required to proceed. No correctness validation — any non-trivial input advances the student. The parent component decides whether the board is "complete."

**Parsing:** Sentence structure is parsed for `character`, `task`, and `reason` to display as a formatted task card.

**CEFR levels / phases:** Phase 4 remedials (A1–B1).

**UI mockup:**

```
┌────────────────────────────────────────────────┐
│  📋 Festival Planning Board                    │
│                                                │
│  Task 1: Who will handle the decorations?      │
│  [Lilia will set up the stage decorations      │
│   because she has artistic experience.]        │
│                                                │
│  ┌────────────────────────┐                   │
│  │ 👤 Lilia               │                   │
│  │ Task: Set up stage     │                   │
│  │ Reason: artistic exp.  │                   │
│  └────────────────────────┘                   │
│                                                │
│  [  Add Task  ]                                │
└────────────────────────────────────────────────┘
```

---

### 8. CompareQuestGame

**File:** `frontend/src/components/CompareQuestGame.jsx`

**Purpose:** AI-graded comparison writing game. Students write comparative sentences in response to prompts. Each correct answer unlocks higher vocabulary level hints. Used in Phase 4_2 remedials (B2 level).

**What the student does:** Reads a comparison question (e.g., "Compare the benefits of online vs. in-person events"). Writes a paragraph or sentence using comparison structures and, ideally, at least one glossary term. Submits for AI grading. Can retry or skip.

**Props:**

```typescript
interface Props {
  questions: Array<{
    question: string
  }>
  glossaryTerms: string[]          // Vocabulary terms to encourage usage
  onComplete: (result: {
    answers: Record<number, AnswerRecord>
    score: number                  // Count of AI-approved answers
    totalQuestions: number
    skipped: number
    vocabularyLevel: number        // 1–maxLevel, increases with each correct
    completed: true
  }) => void
  evaluationCriteria?: object      // Forwarded to backend evaluation endpoint
}
```

**Scoring logic (backend-driven):** POSTs to `/api/phase4/evaluate-writing` with:
```json
{
  "question": "...",
  "answer": "...",
  "level": "B2",
  "task": "comparison",
  "criteria": {
    "requiresComparison": true,
    "glossaryTerms": [...],
    "minTermsRequired": 1
  }
}
```
Backend returns `{ score: 0|1, feedback: "..." }`. `score === 1` = pass, advance. `score === 0` = show feedback, allow retry or skip.

**Vocabulary level progression:** Starts at level 1. Each correct answer increments `vocabularyLevel` (capped at `questions.length`). Higher levels may unlock additional glossary terms or hints.

**CEFR levels / phases:** Phase 4_2 B2 remedials.

**UI mockup:**

```
┌──────────────────────────────────────────────────┐
│  Quest: Comparison Writing     Level: ⭐⭐⭐       │
│  ════════════════════════════════════════════════ │
│                                                  │
│  Q2/4: Compare the cost of a live band vs.       │
│  a DJ for a university event.                    │
│                                                  │
│  [_____________________________________________] │
│  [_____________________________________________] │
│  [_____________________________________________] │
│                                                  │
│  Advanced Terms: [whereas] [contrast] [whereas]  │
│                                                  │
│  [Submit]   [Skip]                               │
└──────────────────────────────────────────────────┘
```

---

### 9. CritiqueChallengeGame

**File:** `frontend/src/components/CritiqueChallengeGame.jsx`

**Purpose:** AI-graded critique writing game. Students write critical analyses of marketing strategies, events, or proposals. A badge level (Beginner → Master Critic) advances with each correct answer. Used in Phase 4_2 C1 remedials.

**What the student does:** Reads a critique prompt. Writes a critical analysis paragraph using at least 2 advanced marketing/event glossary terms. Submits for AI grading. Can move to next question after feedback.

**Props:**

```typescript
interface Props {
  questions: Array<{
    question: string
  }>
  glossaryTerms: string[]      // Must use at least 2 in each answer
  onComplete: (result: {
    answers: Record<number, AnswerRecord>
    score: number              // Count of AI-approved answers
    totalQuestions: number
    badgeLevel: number         // 0–totalQuestions
    completed: true
  }) => void
}
```

**Scoring logic (backend-driven):** POSTs to `/api/phase4/evaluate-writing` with:
```json
{
  "question": "...",
  "answer": "...",
  "level": "C1",
  "task": "critique",
  "criteria": {
    "minTermsRequired": 2,
    "glossaryTerms": [...]
  }
}
```
`score === 1` advances badge level.

**Badge labels by level:**

| Level | Badge Name |
|-------|-----------|
| 0 | (none) |
| 1 | Beginner Critic |
| 2 | Junior Critic |
| 3 | Critic |
| 4 | Senior Critic |
| 5 | Master Critic |

**CEFR levels / phases:** Phase 4_2 C1 remedials.

**UI mockup:**

```
┌──────────────────────────────────────────────────┐
│  Q1/3     Badge Level: 🏆 2 (Junior Critic)      │
│  ██████████████░░░░░░░░░░░░░░░░░░░░░░  (33%)    │
├──────────────────────────────────────────────────┤
│  Critique this marketing strategy for a          │
│  university festival...                          │
│                                                  │
│  [_____________________________________________] │
│  [_____________________________________________] │
│  [_____________________________________________] │
│  [_____________________________________________] │
│                                                  │
│  [  Submit Critique  ]                           │
├──────────────────────────────────────────────────┤
│  ADVANCED TERMS TO USE:                          │
│  [target audience] [ROI] [brand awareness]       │
└──────────────────────────────────────────────────┘
```

---

### 10. exercises/DragAndDropExercise

**File:** `frontend/src/components/exercises/DragAndDropExercise.jsx`

**Purpose:** Legacy CSS-based drag-and-drop component. Items (text or images) are dragged into labelled drop zones. Provides immediate per-drop feedback. Used in older Phase 3 remedial task files.

**What the student does:** Sees a set of draggable items and named drop zones. Drags each item to what they believe is the correct category/zone. Receives instant visual feedback on each drop.

**Props:**

```typescript
interface Props {
  exerciseData: {
    instruction?: string
    hint?: string
    items: Array<{
      content: string    // Text or image URL
      correctZone: string  // The drop zone id this item belongs to
      type: 'text' | 'image'
    }>
    dropZones: Array<{
      id: string
      label: string
    }>
  }
  onComplete: (result: {
    score: number
    total: number
    answers: Record<string, string>  // { itemId: zoneId }
  }) => void
  onProgress?: (update: { correct: number, total: number }) => void
}
```

**Scoring logic:** Immediate: each drop is checked against `item.correctZone`. Final score = count of correct placements. Auto-completes when all zones are filled.

**CEFR levels / phases:** Phase 3 remedials (A1–A2, legacy exercises).

**UI mockup:**

```
┌───────────────────────────────────────────────────┐
│  Instruction: Sort these words into categories    │
│                                                   │
│  ITEMS: [🎵 Music] [🎨 Art] [🍕 Food] [🎭 Drama]  │
│                                                   │
│  ┌──────────────┐   ┌──────────────┐             │
│  │  PERFORMING  │   │   VISUAL     │             │
│  │    ARTS      │   │    ARTS      │             │
│  │              │   │              │             │
│  └──────────────┘   └──────────────┘             │
└───────────────────────────────────────────────────┘
```

---

### 11. exercises/DialogueCompletionExercise

**File:** `frontend/src/components/exercises/DialogueCompletionExercise.jsx`

**Purpose:** Legacy CSS-based turn-by-turn chat exercise. Student must give the correct response to advance through a scripted dialogue with an NPC. Used in older Phase 3 remedial task files.

**What the student does:** Reads the NPC's message. Sees a multiple-choice list or text input. Selects or types the correct response. Only correct answers advance to the next turn; incorrect answers show the NPC's "incorrect" response and require retry.

**Props:**

```typescript
interface Props {
  exerciseData: {
    npcName: string
    npcAvatar?: string
    npcRole?: string
    initialMessage?: string
    turns: Array<{
      type: 'multiple_choice' | 'text_input'
      prompt: string
      options?: string[]           // For multiple_choice
      correctAnswer: string
      acceptedAnswers?: string[]   // For text_input fuzzy matching
      npcResponse: {
        correct: string            // NPC reply when student is right
        incorrect: string          // NPC reply when student is wrong
      }
    }>
  }
  onComplete: (result: {
    score: number
    total: number
    turns: Array<{ prompt: string, answer: string, correct: boolean }>
  }) => void
  onProgress?: (update: any) => void
}
```

**Scoring logic:** 1 point per correctly answered turn. Must get turn correct to advance (no skipping).

**CEFR levels / phases:** Phase 3 remedials (legacy tasks).

**UI mockup:**

```
┌───────────────────────────────────────────────────┐
│  Ms. MABROUKI (Event Coordinator)                 │
│  ┌────────────────────────────────────────┐       │
│  │ "What should we do first to plan the   │       │
│  │  festival?"                            │       │
│  └────────────────────────────────────────┘       │
│                                                   │
│  ○ Book the venue                                 │
│  ○ Design the posters                             │
│  ● Create a budget plan  ← correct                │
│  ○ Hire performers                                │
│                                                   │
│  [  Submit Answer  ]                              │
└───────────────────────────────────────────────────┘
```

---

### 12. exercises/SentenceBuilder

**File:** `frontend/src/components/exercises/SentenceBuilder.jsx`

**Purpose:** Animated word-scramble exercise. Students arrange words into correct sentence order. Dark game-board aesthetic. Used in Phase 5 and Phase 6 remedials and interactions.

**What the student does:** Sees a set of shuffled word tokens. Clicks words in the correct order to assemble a sentence. A star rating and confetti celebrate success. Multiple templates per exercise.

**Props:**

```typescript
interface Props {
  exercise: {
    templates: string[]         // Full correct sentences; gaps extracted from these
    correct_answers: string[]   // Corresponds to templates (same array, different field)
    instruction?: string
  }
  onComplete: (result: {
    score: number               // Correct sentences
    totalCount: number          // Total sentences
    stars: number               // 1–3
    isPerfect: boolean
    answers: string[]
  }) => void
  onProgress?: (update: any) => void
}
```

**Gap extraction:** `extractTargetWords(template, answer)` compares template vs. answer string and identifies which words are "target" words to arrange (words present in the answer but marked with `___` in the template).

**Scoring logic:**

| Condition | Stars |
|-----------|-------|
| All sentences correct | 3 |
| ≥ 60% correct | 2 |
| > 0 correct | 1 |
| 0 correct | 0 |

Score = count of correctly assembled sentences.

**Side effects:** Fires `xp-awarded` custom DOM event on completion.

**CEFR levels / phases:** Phase 5 and Phase 6 remedials (A2–B2).

**UI mockup:**

```
┌────────────────────────────────────────────────────────┐
│  ✦ Sentence Builder                    ⭐⭐☆  2/3     │
│                                                        │
│  Build: "The festival _____ _____ next week."          │
│                                                        │
│  Your sentence:                                        │
│  [ The ] [ festival ] [        ] [        ] [ week. ]  │
│                                                        │
│  Word tokens: [will] [be] [held] [today] [yesterday]   │
│                                                        │
│  [  Check  ]                                           │
└────────────────────────────────────────────────────────┘
```

---

### 13. exercises/SentenceGarden

**File:** `frontend/src/components/exercises/SentenceGarden.jsx`

**Purpose:** Generative open-writing exercise with a plant growth metaphor. Students write freely in response to guided prompts. No correctness validation — any non-trivial input (minimum 2 words) makes the plant grow. Used in Phase 5 and Phase 6 remedials.

**What the student does:** Reads a guided question. Types any response (at least 2 words). Presses Enter or clicks Submit. The "plant" visually grows through 5 stages as total word count increases.

**Props:**

```typescript
interface Props {
  exercise: {
    templates?: string[]         // Optional sentence starters shown as prompts
    guided_questions: string[]   // Array of open-ended prompts
    instruction?: string
  }
  onComplete: (result: {
    isPerfect: false             // Always false (no correctness check)
    answers: string[]            // Student's text for each prompt
    totalWords: number
  }) => void
  onProgress?: (update: any) => void
}
```

**Plant growth stages (by total word count):**

| Stage | Words | Plant stage |
|-------|-------|-------------|
| 0 | 0 | 🌱 Seed |
| 1 | 1–5 | 🌿 Sprouting |
| 2 | 6–15 | 🌲 Growing |
| 3 | 16–30 | 🌸 Blooming |
| 4 | 31+ | 🌺 Flourishing |

**Scoring logic:** None. Always calls `onComplete` with `isPerfect: false`. Parent component treats any submission as a pass.

**CEFR levels / phases:** Phase 5 and Phase 6 remedials (A2–B1, generative tasks).

**UI mockup:**

```
┌──────────────────────────────────────────────────┐
│           🌸 Your Writing Garden                 │
│                                                  │
│  [Blooming Stage 3/5 ── 24 words written]        │
│                                                  │
│  Prompt: "What kind of music would you           │
│  choose for a festival and why?"                 │
│                                                  │
│  [I would choose jazz music because it           │
│   creates a relaxed atmosphere and...]           │
│                                                  │
│  [  Next Prompt  ]                               │
└──────────────────────────────────────────────────┘
```

---

### 14. exercises/ChatMessengerSim

**File:** `frontend/src/components/exercises/ChatMessengerSim.jsx`

**Purpose:** Social media messenger simulation. First plays a TTS voice message (the audio stimulus), then opens a chat interface where the student writes a free-text response. Used in Phase 5 and Phase 6 interactions/remedials.

**What the student does:**
1. Tap the voice message bubble to hear the audio (TTS via `speechSynthesis`).
2. Read the chat history.
3. Type a free-text reply in the message box.
4. Submit; the component scores locally with keyword matching.

**Props:**

```typescript
interface Props {
  exercise: {
    audio_script: string         // Text read aloud via TTS
    templates?: string[]         // Message history templates
    guided_questions?: string[]  // Optional follow-up prompts
    instruction?: string
    example_of_answers?: string  // Shown as hint
  }
  onComplete: (result: {
    score: number
    isPerfect: boolean
    answers: string[]
  }) => void
  onProgress?: (update: any) => void
}
```

**Scoring logic (keyword-based):**
```
score = min(20, 5 + matchedKeywords.length * 3 + floor(answer.length / 20))
```
Keywords are extracted from `exercise.example_of_answers` or `exercise.audio_script`. The formula rewards both relevance (matched keywords) and response length.

**TTS:** Uses browser `speechSynthesis`. Prefers Microsoft Aria/Jenny, Google US English, then macOS voices.

**Features:**
- Typing indicator animation before NPC messages appear
- Emoji reactions to messages
- Message status icons (sent → delivered → read)

**CEFR levels / phases:** Phase 5 and Phase 6 remedials (B1–C1).

**UI mockup:**

```
┌─────────────────────────────────────────────┐
│  Ryan · Social Media  [🔊 Voice Message]    │
│                                             │
│  ┌────────────────────────────────────┐     │
│  │ 🔊 Voice Message (tap to play)    │     │
│  │    ▶ 00:12                        │     │
│  └────────────────────────────────────┘     │
│                                             │
│  [Ryan]: "Great! What else can we post?"    │
│  [Ryan is typing...]                        │
│                                             │
│  [_____________________________________]    │
│  [_____________________________________]    │
│                        [Send ➤]             │
└─────────────────────────────────────────────┘
```

---

### 15. exercises/PhoneCallSim

**File:** `frontend/src/components/exercises/PhoneCallSim.jsx`

**Purpose:** WhatsApp/phone-style UI where the student completes dialogue by selecting words from a word bank to fill blanks in their replies. Simulates a text conversation with typing indicators and TTS audio. Used in Phase 5 and Phase 6 remedials.

**What the student does:**
1. Reads the incoming messages (which appear with animated typing indicators).
2. When their turn comes, taps words from the word bank to fill `___` blanks in their reply template.
3. Can remove the last placed word. The conversation auto-advances after each completed reply.

**Props:**

```typescript
interface Props {
  exercise: {
    dialogue_lines: Array<{
      speaker: string            // NPC name or "You"
      text?: string              // For NPC lines (no blanks)
      template?: string          // For user lines — contains ___ gaps
      correct_answers?: string[] // Correct words in order for this line
      audio_text?: string        // TTS text for this line
    }>
    word_bank: string[]          // All available words
    guided_questions?: string[]
    correct_answers?: Array<string[]>  // Alternative location for answers
  }
  onComplete: (result: {
    isPerfect: false
    correctCount: undefined
    totalCount: number           // Total blank slots
  }) => void
  onProgress?: (update: { answers: object, correctCount: number }) => void
}
```

**Scoring logic:** Per blank slot: 1 point if placed word matches `line.correct_answers[position]`. Score is tracked incrementally via `onProgress`. Final `onComplete` does not include a score (deferred to backend).

**TTS:** Same voice priority as `ChatMessengerSim`. Audio is played per line when `audio_text` is present.

**Typing animation:** NPC messages appear one by one with a typing indicator (800–1500ms delay) before each message renders.

**CEFR levels / phases:** Phase 5 and Phase 6 remedials (A2–B2).

**UI mockup:**

```
┌────────────────────────────────────────────┐
│  ← Emna   🔊   📹   ⋮                     │
│  ─────────────────────────────────────     │
│  Emna: "Can you help with the budget?"  ✓✓ │
│                                            │
│  [typing...]                               │
│                                            │
│  Emna: "We need to ___ the expenses."   ✓✓ │
│  You: "Sure, I will ___ the ___."          │
│           [     ] the [     ]              │
│                                            │
│  [review] [prepare] [budget] [list]        │
│                        [⌫ Remove last]     │
└────────────────────────────────────────────┘
```

---

### 16. exercises/DebateArena

**File:** `frontend/src/components/exercises/DebateArena.jsx`

**Purpose:** Visual battle arena where the student debates against SKANDER. The student fills in their argument using a free-text input, and answers are scored by keyword matching. A "persuasion bar" shifts toward whichever side is winning. Power-ups (hint/skip/2x points) add game mechanics. Used in Phase 5 and Phase 6 remedials.

**What the student does:**
1. Reads SKANDER's argument in the chat log.
2. Types a rebuttal using free text (the template shown has `___` gaps for guidance, but the actual answer field is free-text).
3. Submits; keyword matching determines if the answer is correct (≥ 50% of expected keywords matched).
4. Can use power-ups: Hint (reveals part of answer), Skip (moves on), 2X (doubles points for next correct answer).

**Props:**

```typescript
interface Props {
  exercise: {
    dialogue_lines: Array<{
      speaker: string           // "You" or "SKANDER"
      text?: string             // SKANDER's visible argument
      template?: string         // Student's reply template with ___ gaps
    }>
    correct_answers: string[]   // Full correct answers for each student turn
    instruction?: string
  }
  onComplete: (result: {
    isVictory: boolean
    correctCount: number
    totalCount: number
    isPerfect: false
    answers: Record<string, string>   // { "answer_N": "student text" }
    xpEarned: number
    comboMax: number
    totalScore: number
  }) => void
  onProgress?: (update: any) => void
}
```

**Scoring logic:**
- Expected keywords extracted from `correct_answers[i]`: words > 2 characters, lowercased
- `matchPercentage = matchedWords.length / expectedWords.length`
- `isCorrect = matchPercentage >= 0.5`
- `isPartiallyCorrect = matchPercentage >= 0.3`
- Persuasion bar shifts +10 for correct, -5 for incorrect
- Victory: persuasion bar reaches 100%; Loss: bar reaches 0%
- XP earned: `isVictory ? 100 + (combo * 10) + totalScore : 25`
- Fires `xp-awarded` custom DOM event

**Power-ups:**

| Power-up | Effect |
|----------|--------|
| Hint | Reveals first 30 characters of the correct answer |
| Skip | Advances to next dialogue line without scoring |
| 2X Points | Doubles points earned for the next correct answer |

**Combo system:** Consecutive correct answers increment a combo multiplier. Wrong answer resets combo to 0.

**CEFR levels / phases:** Phase 5 and Phase 6 remedials (B1–C1).

**UI mockup:**

```
┌──────────────────────────────────────────────────────┐
│  YOU  ████████████░░░░░░░░░░░░░  SKANDER            │
│       60%                              40%           │
│       💡 HINT    ⏭ SKIP    ⭐ 2X                    │
├──────────────────────────────────────────────────────┤
│  SKANDER: "Online events are cheaper and reach       │
│  a wider audience than physical ones."               │
│                                                      │
│  YOUR TURN: "While that may be true, ___..."         │
│  [______________________________________________]    │
│                                                      │
│  [  SUBMIT ARGUMENT  ]            Combo: 🔥 x3       │
└──────────────────────────────────────────────────────┘
```

---

### 17. exercises/RhythmMatcher

**File:** `frontend/src/components/exercises/RhythmMatcher.jsx`

**Purpose:** Audio-visual term-to-definition matching game. Students first listen to an audio passage (TTS), then match vocabulary terms to their definitions by clicking. Combo points and card-flip animations reward speed and accuracy. Used in Phase 5 and Phase 6 remedials.

**What the student does:**
1. Listens to the TTS audio (optional; game can start without it).
2. Clicks a term card (it flips/highlights).
3. Clicks the matching definition card.
4. Correct matches are locked; wrong matches shake and reset.
5. Game ends when all pairs are matched.

**Props:**

```typescript
interface Props {
  exercise: {
    pairs: Array<{
      term: string
      definition: string
    }>
    audio_script?: string        // TTS text to play before game
    guided_questions?: string[]  // Optional supplementary prompts
  }
  onComplete: (result: {
    score: number                // Final accumulated score
    correctCount: number         // = pairs.length if all matched
    totalCount: number           // = pairs.length
    isPerfect: true              // Always true (game only ends on all-correct)
  }) => void
  onProgress?: (update: { correct: boolean, points: number }) => void
}
```

**Scoring logic:**
- Base: 10 points per correct match
- Combo bonus: `combo * 5` additional points per match
- Combo counter increments on consecutive correct matches, resets on wrong
- Points formula: `10 + (newCombo * 5)`
- Haptic feedback: `navigator.vibrate([50,30,50])` on correct, `[100,50,100]` on wrong

**Cards:** Terms are shuffled independently of definitions. The two columns are visually separated.

**CEFR levels / phases:** Phase 5 and Phase 6 remedials (A2–B2, vocabulary tasks).

**UI mockup:**

```
┌─────────────────────────────────────────────────────┐
│  🎵 RhythmMatcher   Score: 75    🔥 Combo: x3       │
│                                                     │
│  TERMS                    DEFINITIONS               │
│  ┌─────────────┐          ┌──────────────────────┐  │
│  │  logistics  │ ──────►  │ planning + movement  │  │
│  │  (matched ✓)│          │  of resources        │  │
│  └─────────────┘          └──────────────────────┘  │
│  ┌─────────────┐          ┌──────────────────────┐  │
│  │  venue      │          │ the amount of money  │  │
│  │  (selected) │          │ available            │  │
│  └─────────────┘          └──────────────────────┘  │
│  ┌─────────────┐          ┌──────────────────────┐  │
│  │  budget     │          │ the place where an   │  │
│  │             │          │ event is held        │  │
│  └─────────────┘          └──────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

### 18. exercises/ConversationTetris

**File:** `frontend/src/components/exercises/ConversationTetris.jsx`

**Purpose:** Arcade word-catching game. Words fall from the top of the screen; the student must click the correct word to fill the current gap in a dialogue template. Multiple lives; speed increases over time. Used in Phase 5 and Phase 6 remedials.

**What the student does:**
1. Sees the current dialogue template with `___` gaps.
2. Words fall from the top of the game area.
3. Clicks the correct word when it falls into reach.
4. Missing the correct word costs a life (3 lives total).
5. Filling all gaps in a line advances to the next dialogue line.
6. Game ends when all lines are complete (won) or lives reach 0 (lost).

**Props:**

```typescript
interface Props {
  exercise: {
    dialogue_lines: Array<{
      speaker: string
      template?: string          // Lines with ___ gaps are "user turns"
      text?: string              // Lines without gaps are shown as context
    }>
    word_bank: string[]          // All words (correct + distractors)
    correct_answers: string[]    // Full correct answer strings per user line
  }
  onComplete: (result: {
    score: number
    lives: number                // Remaining lives
    isVictory: boolean
    filledGaps: Record<string, string>
  }) => void
  onProgress?: (update: any) => void
}
```

**Scoring logic:**
- Correct catch: `+10 * combo` points
- Wrong catch: combo resets
- Speed increases every 5 correct catches
- Correct word spawn rate: 35% of all falling words; 65% are distractors from `word_bank`

**Target word extraction:** `getTargetWords` aligns `correct_answers[i]` with the template's `___` gaps, inferring which word belongs in each gap by string comparison.

**Game states:** `ready` → `playing` → `paused` / `won` / `lost`

**External CSS:** `ConversationTetris.css` handles falling word animations.

**CEFR levels / phases:** Phase 5 and Phase 6 remedials (A2–B1, gap-fill practice).

**UI mockup:**

```
┌──────────────────────────────────────────────────┐
│  Score: 120   ❤️❤️♡   🔥 Combo x2   Speed: 1.5x │
├──────────────────────────────────────────────────┤
│                                                  │
│    [prepare]         [budget]                    │
│                           [organize]             │
│         [review]                                 │
│                  [submit]                        │
│                                                  │
├──────────────────────────────────────────────────┤
│  Fill: "We need to _____ the event _____."       │
│         Gap 1: [        ]   Gap 2: [        ]    │
└──────────────────────────────────────────────────┘
```

---

## Adding a New Exercise

Follow these steps to add a new exercise type to FARDI:

### 1. Create the component file

Put it in `frontend/src/components/exercises/` (if it uses game mechanics / animation) or directly in `frontend/src/components/` (if it is a simpler UI pattern).

**Minimum template:**

```jsx
// frontend/src/components/exercises/MyNewExercise.jsx

import React, { useState } from 'react'
import { Box, Typography, Button, useTheme } from '@mui/material'

export default function MyNewExercise({ exercise, onComplete, onProgress }) {
  const theme = useTheme()
  const dark = theme.palette.mode === 'dark'

  // Clay/bento color palette
  const c = dark ? {
    pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5',
    blue: { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  } : {
    pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F',
    blue: { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
  }

  // Clay card style helper
  const clayCard = (color) => ({
    bgcolor: color.bg,
    border: `2px solid ${color.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${color.shadow}`,
  })

  const [score, setScore] = useState(0)

  const handleComplete = () => {
    onComplete({
      score,
      totalCount: exercise.items?.length ?? 0,
      isPerfect: score === exercise.items?.length,
    })
  }

  return (
    <Box sx={{ ...clayCard(c.blue), p: 3 }}>
      <Typography variant="h6" sx={{ color: c.heading, mb: 2 }}>
        {exercise.instruction}
      </Typography>
      {/* ... your exercise UI ... */}
      <Button onClick={handleComplete} sx={{ mt: 2 }}>
        Finish
      </Button>
    </Box>
  )
}
```

### 2. Define the exercise data shape

Your component receives data from the backend via `exercise.data` (or directly in props). Define what fields your exercise needs:

```json
{
  "type": "my_new_exercise",
  "instruction": "...",
  "items": [...],
  "correct_answers": [...]
}
```

### 3. Add a route to the backend (if needed)

If your exercise requires AI grading, add an endpoint to the relevant phase router:

```python
# In backend/routers/phaseN.py

@router.post("/evaluate-my-exercise")
async def evaluate_my_exercise(
    request: MyExerciseRequest,
    current_user: dict = Depends(get_current_user)
):
    # Grade the exercise
    score = grade_my_exercise(request.answer, request.correct)
    return {"score": score, "feedback": "..."}
```

### 4. Wire it into a remedial task page

Open the relevant Task file (e.g., `frontend/src/pages/Phase5/Step1/RemedialA1/TaskB.jsx`) and import + render your component:

```jsx
import MyNewExercise from '@/components/exercises/MyNewExercise'

// Inside the task component:
<MyNewExercise
  exercise={exerciseData}
  onComplete={(result) => {
    // Update task score and navigate to next task or Results
    setScore(result.score)
    navigate('/phase5/step/1/remedial/a1/results')
  }}
  onProgress={(update) => {
    // Optional: track progress
  }}
/>
```

### 5. Checklist before shipping

- [ ] Component accepts `{ exercise, onComplete, onProgress }` props
- [ ] `onComplete` is called with `{ score, totalCount, isPerfect }` at minimum
- [ ] Clay/bento theme applied (2px border, 4px shadow, dual light/dark palette)
- [ ] Mobile responsive (uses MUI `xs`/`sm` breakpoints or `useMediaQuery`)
- [ ] No hardcoded content — all text/data comes from `exercise` props
- [ ] Accessibility: interactive elements have `aria-label` or visible label
- [ ] If using TTS: graceful fallback when `speechSynthesis` is unavailable
- [ ] If using animations: `prefers-reduced-motion` CSS media query respected
- [ ] If AI-graded: POST to backend with `level` and `task` fields; handle fetch errors

---

*End of document. For the phase system and routing logic, see `03-phase-system.md`. For the overall architecture, see `01-overview.md`.*
