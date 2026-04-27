# 06 — Frontend Components & Page Structure

This document is the authoritative reference for everything in `frontend/src/`. It covers how routes are wired up, how pages are organised on disk, what every shared component does, and how the API layer works.

---

## 1. Route Structure

All routing lives in `/Users/octa/Desktop/PROJECTS/FARDIM/FARDI/frontend/src/App.jsx`. The file registers ~1 400+ `<Route>` elements, grouped into two layout shells.

### 1.1 Layout shells

```
<ErrorBoundary>            ← top-level React error catcher
  <ApiProvider>            ← auth context
    <ConfettiCannon />     ← gamification overlay (always mounted)
    <Routes>
      <Route element={<LandingLayout />}>   ← public pages (SaaS top bar only)
      <Route element={<AppLayout />}>       ← authenticated pages (sidebar)
```

### 1.2 Public routes (inside `LandingLayout`)

| Path | Component |
|------|-----------|
| `/` | `Home` |
| `/login` | `Login` |
| `/signup` | `Signup` |
| `/forgot-password` | `ForgotPassword` |
| `/reset-password` | `ResetPassword` |

### 1.3 Authenticated routes (inside `AppLayout`)

`AppLayout` checks the auth context and redirects to `/login` if the user is not signed in.

#### Utility / account pages

| Path | Component |
|------|-----------|
| `/dashboard` | `Dashboard` |
| `/phase-journey` | `PhaseJourney` |
| `/characters` | `Characters` |
| `/profile` | `Profile` |
| `/profile/edit` | `EditProfile` |
| `/profile/password` | `ChangePassword` |
| `/profile/delete` | `DeleteAccount` |
| `/results` | `Results` |
| `/certificate` | `Certificate` |
| `/chat` | `StudentChat` |

#### Admin-only pages

| Path | Component |
|------|-----------|
| `/admin` | `AdminDashboard` |
| `/admin/analytics` | `AdminAnalytics` |
| `/admin/users` | `AdminUserList` |
| `/admin/users/:id` | `AdminUserViewer` |
| `/admin/chat` | `AdminChat` |

#### Phase 1 (CEFR Assessment Quiz)

| Path | Component |
|------|-----------|
| `/phase1` | `Phase1Intro` |
| `/game` | redirect → `/phase1/interaction/1` |
| `/phase1/interaction/:step` | `Game` |

#### Phase 2 (Cultural Planning)

| Path | Component |
|------|-----------|
| `/phase2` | `Phase2Intro` |
| `/phase2/step/:stepId` | `Phase2Step` |
| `/phase2/step/:stepId/results` | `Phase2StepResults` |
| `/phase2/remedial/:stepId/:level` | `Phase2Remedial` |
| `/phase2/complete` | `Phase2Complete` |

#### Phase 3 (Vendors & Budget — 4 steps)

Pattern: `/phase3/step/{N}/interaction/{1-3}` and `/phase3/step/{N}/score`

Each step also carries remedial routes:
- `/phase3/step/{N}/remedial/{level}/task{Letter}` where `level` ∈ `{a1, a2, b1, b2, c1}`
- All Phase 3 routes are duplicated under `/app/phase3/...` for Electron compatibility.

Steps: 1, 2, 3, 4. Steps 1–3 have three interactions; step 4 has two interactions.

#### Phase 4 (Marketing — two sub-phases)

**Sub-phase 1** (steps labelled 1–4 in the URL, backed by folders `Phase4Step1`–`Phase4Step4`):

| URL step | Folder | Theme |
|----------|--------|-------|
| `/phase4/step/1` | `Phase4Step1` | Marketing basics |
| `/phase4/step/2` | `Phase4Step2` | includes a `VocabularyWarmup` page |
| `/phase4/step/3` | `Phase4Step3` | |
| `/phase4/step/4` | `Phase4Step4` | |

**Sub-phase 1 remedials** at `/phase4/remedial/{level}/task{Letter}` (step 1) and `/phase4/step/{N}/remedial/{level}/task{Letter}` (steps 2-4).

**Sub-phase 2** (Social Media Marketing, `Phase4SubPhase2`, 5 steps):

Routes: `/phase4_2/step/{1-5}/interaction/{1-3}` and `/phase4_2/step/{N}/remedial/{level}/task{Letter}`.
Also duplicated under `/app/phase4_2/...`.

Phase 4 completion: `/phase4/complete`.

#### Phase 5 (Execution — 2 sub-phases × 5 steps)

Pattern: `/phase5/subphase/{1|2}/step/{1-5}/interaction/{1-3}`

Score pages: `/phase5/subphase/{SP}/step/{N}/score`

Remedial pages: `/phase5/subphase/{SP}/step/{N}/remedial/{level}/task/{letter}` (lowercase letter for Phase 5+)

Folder map:
- Sub-phase 1 steps → `Phase5SubPhase1Step{1-5}/`
- Sub-phase 2 steps → `Phase5SubPhase2Step{1-5}/`

Phase 5 completion: `/phase5/complete`.

#### Phase 6 (Reflection — 2 sub-phases × 5 steps)

Same URL pattern as Phase 5 but using `/phase6/...`.

Folder map:
- Sub-phase 1 steps → `Phase6SubPhase1Step{1-5}/`
- Sub-phase 2 steps → `Phase6SubPhase2Step{1-5}/`

Phase 6 completion: `/phase6/complete`.

---

## 2. Page Hierarchy

All page files live under `frontend/src/pages/`. The directory structure follows a strict naming convention.

### 2.1 Top-level flat pages

Single-file pages at the root of `pages/`:

```
Home.jsx, Dashboard.jsx, Game.jsx, Results.jsx, Certificate.jsx
Login.jsx, Signup.jsx, ForgotPassword.jsx, ResetPassword.jsx
Phase1Intro.jsx
Phase2Intro.jsx, Phase2Step.jsx, Phase2StepResults.jsx,
Phase2Remedial.jsx, Phase2Complete.jsx
Phase4Complete.jsx, Phase5Complete.jsx, Phase6Complete.jsx
PhaseJourney.jsx, Characters.jsx
Profile.jsx, EditProfile.jsx, ChangePassword.jsx, DeleteAccount.jsx
AdminDashboard.jsx, AdminUserList.jsx, AdminUserViewer.jsx,
AdminAnalytics.jsx, AdminChat.jsx, StudentChat.jsx
NotFound.jsx
```

### 2.2 Phase 3 — nested in `Phase3/`

```
Phase3/
  Step1/
    index.jsx          ← intro / step landing
    Interaction1.jsx
    Interaction2.jsx
    Interaction3.jsx
    ScoreCalculation.jsx
    RemedialA1/  TaskA.jsx  TaskB.jsx
    RemedialA2/  TaskA.jsx … TaskD.jsx
    RemedialB1/  TaskA.jsx
    RemedialB2/  TaskA.jsx
    RemedialC1/  TaskA.jsx
  Step2/ … Step4/    (same structure, fewer remedial tasks)
```

### 2.3 Phase 4 sub-phase 1 — flat folders at `pages/`

```
Phase4Step1/           ← step 1 of sub-phase 1
  index.jsx
  Interaction1.jsx  Interaction2.jsx  Interaction3.jsx
  RemedialA1/  TaskA.jsx  TaskB.jsx
  RemedialA2/  TaskA.jsx  TaskB.jsx
  RemedialB1/  TaskA.jsx … TaskD.jsx
  RemedialB2/  TaskA.jsx … TaskD.jsx
  RemedialC1/  TaskA.jsx … TaskD.jsx
Phase4Step2/           ← step 2 of sub-phase 1 (folder name mismatch: URL /step/2 → folder Phase4Step2)
Phase4Step3/           ← URL /step/3
Phase4Step4/           ← URL /step/4
```

### 2.4 Phase 4 sub-phase 2 — `Phase4SubPhase2/`

```
Phase4SubPhase2/
  shared/
  Step1/  index.jsx  Interaction{1-3}.jsx
          RemedialA1/  TaskA-C.jsx  Results.jsx
          RemedialA2/  TaskA-C.jsx  Results.jsx
          RemedialB1/  TaskA-F.jsx  Results.jsx
          RemedialB2/  TaskA-F.jsx  Results.jsx
          RemedialC1/  TaskA-H.jsx  Results.jsx
  Step2/ … Step5/    (same structure)
```

### 2.5 Phases 5 and 6 — flat folders

```
Phase5SubPhase1Step1/
  index.jsx
  Interaction{1-3}.jsx
  ScoreCalculation.jsx
  RemedialA1/  TaskA-C.jsx
  RemedialA2/  TaskA-C.jsx
  RemedialB1/  TaskA-F.jsx  Results.jsx
  RemedialB2/  TaskA-F.jsx  Results.jsx
  RemedialC1/  TaskA-H.jsx
Phase5SubPhase1Step{2-5}/   (same pattern, A1 remedial absent from steps 2-5)
Phase5SubPhase2Step{1-5}/   (same pattern)
Phase6SubPhase1Step{1-5}/
Phase6SubPhase2Step{1-5}/
```

### 2.6 Naming conventions

| Segment | Meaning |
|---------|---------|
| `Phase4Step1` | Phase 4, sub-phase 1, step 1 (flat folder name) |
| `Phase4SubPhase2` | Phase 4, sub-phase 2 (nested sub-folder) |
| `Phase5SubPhase1Step3` | Phase 5, sub-phase 1, step 3 |
| `RemedialA1` | Remedial track for students who scored at the A1 level |
| `RemedialB2` | Remedial track for B2 level |
| `TaskA`, `TaskB` … `TaskH` | Sequential tasks within one remedial level; more tasks = harder level |
| `Results.jsx` | End-of-remedial results/pass-fail screen (present in B1, B2, C1 remedials) |
| `ScoreCalculation.jsx` | Automated scoring page shown after an interaction set |
| `index.jsx` | Intro / step-landing page for a folder |
| `Interaction1.jsx` | The first AI-assisted conversation interaction within a step |

---

## 3. AppLayout Component

**File:** `frontend/src/components/AppLayout.jsx`

`AppLayout` is a React Router `<Outlet>` wrapper that provides the entire authenticated shell. It is registered as the parent `<Route element={<AppLayout />}>` and renders all authenticated child pages inside it.

### What it renders

```
<Box display="flex" minHeight="100vh">
  ← Desktop sidebar (fixed, collapsible, 260px expanded / 64px collapsed)
  ← Mobile Drawer (temporary, opens via hamburger)
  <main>
    ← Mobile header bar (hamburger + FARDI logo, sticky)
    <Outlet />   ← child page renders here
    ← Testing "Skip →" button (floating, bottom-right, conditional)
  </main>
</Box>
```

### Sidebar contents

1. **Logo** — "FARDI" wordmark with `AutoAwesomeIcon` in a clay-style purple box.
2. **Collapse button** — `ChevronLeft` / `ChevronRight` to toggle sidebar width.
3. **Navigation links** — differ by role:
   - Student: Dashboard, Messages, Profile, Learning Journey, Characters, then the six phases.
   - Admin: Dashboard, Analytics (Overview), All Students, Messages (Communication), Profile (Account).
4. **Phase list** — six phase items rendered from the `PHASES` constant. Each shows:
   - A coloured icon box (phase-specific colour).
   - Lock icon when `!unlocked`, checkmark when `completed`, phase icon otherwise.
   - A "Done" chip when complete.
   - Click handler calls `GET /api/progress/resume?phase=N` for phases 3+ and navigates to the resume URL.
5. **Theme toggle** — `DarkMode` / `LightMode` button in a clay yellow card.
6. **User section** — pinned at the bottom with avatar initials, username, CEFR level chip (or Admin chip), and a logout icon button.

### Auth guard

```js
if (!user) return <Navigate to="/login" replace />
```

If `useAuth()` returns no user the layout redirects immediately.

### Testing / Electron mode

A floating yellow "Skip →" button appears in the bottom-right corner on all remedial routes when `?testing=1` is appended to the URL, or when running inside Electron. Clicking it calls `window.__remedialSkip()`, a function each remedial page registers via `useEffect`.

### Phase unlock logic

```
Phase 1: always unlocked
Phase 2: unlocked after phase 1 assessment completed
Phase 3: unlocked after phase 2 has ≥9 completed steps or is in phase_completion
Phase 4: unlocked after phase 3 is complete
Phase 5: unlocked after phase 4 is complete
Phase 6: unlocked after phase 5 is complete
```

When `?testing=1` is present, all phases are unlocked regardless.

### Props / hooks consumed

| Hook | Source | Purpose |
|------|--------|---------|
| `useAuth()` | `lib/api.jsx` | Current user object |
| `useColorMode()` | `theme.jsx` | Current mode + toggle function |
| `useUserStats()` | `hooks/useUserStats.jsx` | Stats for CEFR level chip |

---

## 4. Shared Components Catalogue

All shared components live in `frontend/src/components/`.

### 4.1 AppLayout.jsx

Described in full in section 3 above.

### 4.2 Avatar.jsx

**Exports:** `default Avatar`, `CharacterMessage`

**`Avatar` component**

Renders a character portrait using `<MuiAvatar src=... />`. Falls back to the first letter of the speaker name if the image fails to load.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `speaker` | string | — | Character name; mapped to an SVG file |
| `size` | number | `60` | Pixel size of the avatar circle |
| `showName` | boolean | `true` | Show the character name below the avatar |
| `showRole` | boolean | `false` | Show the character's role below the name |

Avatar image files are served from `/static/images/avatars/`:

| Name passed as `speaker` | File |
|--------------------------|------|
| `Ms. Mabrouki` / `Team` | `mabrouki.svg` |
| `SKANDER` / `Skander` | `skander.svg` |
| `Emna` | `emna.svg` |
| `Ryan` | `ryan.svg` |
| `Lilia` | `lilia.svg` |

**`CharacterMessage` component**

A speech-bubble-style wrapper pairing an `Avatar` with a message. Used extensively in exercise pages.

```jsx
<CharacterMessage character="MS. MABROUKI" message="Great job on Task A!" />
```

| Prop | Type | Description |
|------|------|-------------|
| `speaker` | string | Character name (same mapping as `Avatar`) |
| `message` | string | Text content (optional if using `children`) |
| `children` | node | Optional extra content below the message |
| `showRole` | boolean | Show role label |

### 4.3 ErrorBoundary.jsx

A class-based React error boundary that wraps the entire `App`. On error it renders a centred MUI `Paper` card with:
- An `ErrorOutlineIcon` (60px, red).
- "Oops! Something went wrong" heading.
- In development: raw error details inside an `<Alert severity="error">`.
- "Try Again" and "Go to Dashboard" buttons.

`handleGoHome` redirects to `/dashboard` via `window.location.href`.

### 4.4 LandingLayout.jsx

Top bar layout for public (unauthenticated) pages. Renders `<Outlet />` for child routes.

### 4.5 ExerciseRenderer.jsx

A generic router component that selects and renders the correct exercise component for Phase 1 game items based on the `question_type` field returned from the backend.

### 4.6 Phase2ExerciseRenderer.jsx

Same concept as `ExerciseRenderer` but specialised for Phase 2 exercise types.

### 4.7 Phase2Introduction.jsx

Renders the Phase 2 intro screen with scenario context and a "Begin" button.

### 4.8 Game mini-components

All of the following are self-contained interactive game/exercise components used directly inside remedial and assessment pages:

| File | Purpose |
|------|---------|
| `BillboardDesigner.jsx` | Drag-and-drop billboard layout exercise |
| `ChatChallengeGame.jsx` | Timed chat message categorisation game |
| `CompareQuestGame.jsx` | Side-by-side comparison exercise |
| `CritiqueChallengeGame.jsx` | Student critiques a sample piece of writing |
| `DebateDuelGame.jsx` | Two-sided debate turn-taking game |
| `DragDropGapFill.jsx` | Drag word tiles into sentence blanks |
| `DragDropMatchingGame.jsx` | Drag left-column items to match right-column targets |
| `EventPlannerBoard.jsx` | Interactive event schedule board |
| `ExpandQuestGame.jsx` | Expand abbreviated marketing ideas into full sentences |
| `GapFillStory.jsx` | Click-to-fill story with selectable word options |
| `KahootQuizGame.jsx` | Multiple-choice rapid-fire quiz (Kahoot style) |
| `MatchingGame.jsx` | Flip-card or list-based matching |
| `MatchMasterGame.jsx` | Timed matching with a live score counter |
| `ProposalBuilderGame.jsx` | Structured writing template that the student fills in |
| `PhraseExpander.jsx` | Expand abbreviated phrases using provided clues |
| `PuzzleGame.jsx` | Jigsaw-style sentence rearrangement |
| `QuizGameComponent.jsx` | Standard MCQ quiz |
| `QuizletLiveDebateGame.jsx` | Flashcard-style debate preparation activity |
| `RolePlayRPGGame.jsx` | Text-RPG conversation branching |
| `SentenceEvaluator.jsx` | AI-powered free-text evaluation |
| `SimpleLineMatchingGame.jsx` | Draw connecting lines between two columns |
| `SushiSpellAdvancedGame.jsx` | Advanced variant of the SushiSpell spelling game |
| `SushiSpellGame.jsx` | Conveyor-belt spelling game |
| `WordDashGame.jsx` | Rapid word-classification sprint |
| `WordleGame.jsx` | Wordle-style letter-by-letter word guessing |
| `WordshakeC1Game.jsx` | C1-level word-unscramble game |
| `WordshakeGame.jsx` | Standard word-unscramble game |
| `WordSniper.jsx` | Click-to-shoot correct words from a moving list |

---

## 5. Exercise Components (`/components/exercises/`)

These are used primarily inside the Phase 1 `ExerciseRenderer`:

| File | Description |
|------|-------------|
| `ChatMessengerSim.jsx` | Simulated phone-messenger interface with scrolling chat history |
| `ConversationTetris.jsx` | Tetris-style dialogue sequencing |
| `DebateArena.jsx` | Two-character debate exercise with side-by-side panels |
| `DialogueCompletionExercise.jsx` | Fill-in-the-blank dialogue where context is shown |
| `DragAndDropExercise.jsx` | Generic drag-and-drop word ordering |
| `PhoneCallSim.jsx` | Simulated phone call with audio transcript |
| `RhythmMatcher.jsx` | Match sentence stress patterns |
| `SentenceBuilder.jsx` | Build a target sentence from scrambled tokens |
| `SentenceGarden.jsx` | Plant "word seeds" into sentence slots |
| `SignalDecoder.jsx` | Decode abbreviated messages into full forms |
| `SocialPostMaker.jsx` | Compose a social media post using constraints |
| `WordBuilder.jsx` | Drag morphemes together to build vocabulary items |
| `index.js` | Re-exports all exercise components |

Each exercise component has a corresponding `.css` file for any styles not achievable via MUI `sx`.

---

## 6. Gamification Components (`/components/gamification/`)

| File | Description |
|------|-------------|
| `AchievementShowcase.jsx` | Grid of earned badges/achievements |
| `CollectionGallery.jsx` | Visual gallery of collected items |
| `ConfettiCannon.jsx` | Always-mounted global confetti overlay; triggered programmatically |
| `FeedbackAnimations.jsx` | Correct/incorrect answer micro-animations |
| `GamificationDashboard.jsx` | Full gamification stats view |
| `GamificationHeader.jsx` | Compact header strip showing XP and streak |
| `LevelBadge.jsx` | Circular CEFR badge display |
| `PowerUpShop.jsx` | Power-up selection UI |
| `ProgressRing.jsx` | SVG circular progress indicator |
| `StreakDisplay.jsx` | Daily streak counter with flame icon |
| `XPCounter.jsx` | Animated XP number display |
| `index.js` | Re-exports all gamification components |

---

## 7. Phase 5 Components (`/components/phase5/`)

Utility components specific to Phase 5 execution exercises:

| File | Description |
|------|-------------|
| `SushiSpellGame.jsx` | Phase 5 variant of the sushi-spell game |
| `WordshakeGame.jsx` | Phase 5 variant of the wordshake game |
| `GameTracker.jsx` | Tracks score, time, and lives for mini-games |
| `ErrorMessage.jsx` | Inline error state display |
| `LoadingSpinner.jsx` | Spinner for async data loads |
| `index.js` | Re-exports |

---

## 8. Context Providers

### 8.1 `ApiProvider` (from `lib/api.jsx`)

Wraps the entire application. Provides authentication state and the API client object.

**Consumed via:**
- `useAuth()` → `{ user, loading }` — the currently signed-in user object or `null`.
- `useApiContext()` → full context value (rarely needed directly).

The `user` object shape (from `/auth/api/me`):
```js
{
  id, username, email, first_name, last_name,
  is_admin,   // 0 or 1
  role,       // 'admin' | 'student'
}
```

### 8.2 `ColorModeContext` (from `theme.jsx`)

Provides dark/light mode state.

**Consumed via:**
- `useColorMode()` → `{ mode: 'light'|'dark', toggle: () => void }`.

Preference is stored in `localStorage` under the key `fardi-theme-v2`. The `AppLayout` and all page components read `theme.palette.mode` via MUI's `useTheme()` hook to determine which local colour palette (`LIGHT` / `DARK`) to use.

---

## 9. API Integration Layer

**File:** `frontend/src/lib/api.jsx`

All backend communication is done via the native `fetch` API with `credentials: 'include'` (cookie-based sessions). There is no Axios or React Query. All endpoints return JSON.

### 9.1 Auth endpoints (via `ApiProvider` internal `client`)

| Method | Action | Endpoint |
|--------|--------|---------|
| Auto on mount | Load current user | `GET /auth/api/me` |
| `client.login(...)` | Log in | `POST /auth/api/login` |
| `client.signup(...)` | Register | `POST /auth/api/signup` |
| `client.logout()` | Log out | `GET /auth/logout` |

### 9.2 Game / Phase 1 endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| `GET` | `/api/game/state` | Current game state |
| `GET` | `/api/game/state?step=N` | Game state at a specific step |
| `POST` | `/api/game/submit` | Submit a Phase 1 answer |
| `POST` | `/api/get-ai-feedback` | Get AI feedback on a free-text response |

### 9.3 Dashboard & stats endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| `GET` | `/api/dashboard` | Full dashboard payload including user stats, phase progress |
| `GET` | `/api/progress/resume?phase=N` | Get resume URL for an in-progress phase |

### 9.4 Progress save (via `useProgressSave` hook)

**File:** `frontend/src/hooks/useProgressSave.js`

The `useProgressSave` hook debounces individual response saves (3-second debounce) and flushes them to `POST /api/progress/save`. On page unload it uses `navigator.sendBeacon` as a fallback.

```js
const { saveResponse, saveNow, markComplete } = useProgressSave({
  phase: 4,
  subphase: null,  // or 1|2 for phases with sub-phases
  step: 1,
  interaction: 2,
  context: 'remedial_a1',  // 'main' | 'remedial_a1' | ... | 'remedial_c1'
})

// Call on every student answer:
saveResponse({
  item_index: 0,
  item_id: 'q1',
  item_type: 'gap_fill',
  prompt: 'She ___ to the store',
  answer: 'went',
  is_correct: true,
  score: 1,
})

// Navigate away only after this resolves:
await saveNow({ ... })

// Call once at the very end of a phase:
await markComplete()
```

Endpoints used by the hook:

| Endpoint | Description |
|---------|-------------|
| `POST /api/progress/save` | Save one interaction response |
| `POST /api/progress/complete` | Mark a phase as completed |

### 9.5 Phase-specific API calls (inline `fetch`)

Beyond the shared hook, individual exercise pages make direct `fetch` calls for phase-specific backend logic. Key patterns:

| Pattern | Example endpoint |
|---------|-----------------|
| Phase 4 remedial log | `POST /api/phase4/remedial/log` |
| Phase 4 A1 final score | `POST /api/phase4/remedial/a1/final-score` |
| Phase 2 step progress | `GET /api/phase2/get-step-progress?step_id=...` |

---

## 10. Custom Hooks

**File:** `frontend/src/hooks/useUserStats.jsx`

```js
const { stats, loading, error } = useUserStats()
```

Fetches `GET /api/dashboard` and returns `data.user_stats`. Used by `AppLayout` to show the CEFR level chip in the sidebar.

`stats` shape:
```js
{
  total_assessments, best_level, overall_level,
  total_xp, avg_xp, current_progress,
  phase_completion: [{ phase_number, completed }],
  phase2_completed_steps,
}
```

---

## 11. Naming Conventions Summary

### Files

- `index.jsx` — always the intro/landing page for a phase folder.
- `Interaction{N}.jsx` — the Nth AI-assisted conversation interaction within a step (N ∈ 1, 2, 3).
- `ScoreCalculation.jsx` — automated scoring that fires after all interactions complete.
- `Task{Letter}.jsx` — a remedial exercise task; letter increments A → H from easiest to hardest level.
- `Results.jsx` — pass/fail results page at the end of a remedial sequence (B1, B2, C1 only).

### Folders

- `Phase{N}Step{M}/` — flat folder for phase N, step M (used for Phase 4 sub-phase 1).
- `Phase{N}SubPhase{SP}/` — contains a sub-phase with its own step folders.
- `Phase{N}SubPhase{SP}Step{M}/` — flat folder for phase N, sub-phase SP, step M (used for Phases 5 & 6).
- `Remedial{Level}/` — A1, A2, B1, B2, or C1 remedial content inside a step folder.

### URL segments

- All phase numbers in URLs are numeric: `/phase3/`, `/phase4/`, `/phase5/`, `/phase6/`.
- Phase 4 sub-phase 2 uses an underscore: `/phase4_2/` (legacy naming, reflects folder `Phase4SubPhase2`).
- Remedial levels are lowercase in URLs: `remedial/a1/taskA` (note: task letter is uppercase in URL).
- Phase 5+ remedial task letters are lowercase in URL: `remedial/b1/task/a`.
- All routes under Phase 3 and some Phase 4.2 routes are duplicated with an `/app/` prefix for Electron desktop compatibility.
