# Game Group Chat UI Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the `/game` assessment page from a card-based layout into an immersive group chat interface where NPC characters send questions as messages and the student replies to the group.

**Architecture:** Replace Game.jsx's existing card/banner layout with a full-height chat thread. Each game question becomes an NPC message bubble (left-aligned, character-colored avatar). Student answers appear as right-aligned navy bubbles. A typing indicator appears for 600ms before each new NPC message. The existing API calls (`getGameState`, `submitResponse`) are preserved unchanged — only the UI layer changes.

**Tech Stack:** React, Material-UI v5, Framer Motion, existing `client` API helpers in Game.jsx

---

### Task 1: Replace Game.jsx layout with group chat shell

**Files:**
- Modify: `frontend/src/pages/Game.jsx`

The goal is to replace the existing JSX return value with a new chat-based layout while keeping all state and logic identical. Do NOT change any API calls, state variables, or handlers.

**Step 1: Read the current file**

Read `frontend/src/pages/Game.jsx` fully before making any changes.

**Step 2: Replace the return value with this shell**

Replace everything inside the `return (...)` with:

```jsx
<Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', maxHeight: '100vh', overflow: 'hidden', bgcolor: 'background.default' }}>
  {/* HEADER */}
  {/* CHAT THREAD */}
  {/* INPUT AREA */}
</Box>
```

Keep all existing imports, state, and handlers above the return untouched for now.

**Step 3: Verify the app doesn't crash**

Run the dev server (`cd frontend && npm run dev`) and visit `/game`. Expect a blank page — no errors in console.

---

### Task 2: Add AVATAR_MAP and COLOR_MAP constants

**Files:**
- Modify: `frontend/src/pages/Game.jsx`

The existing Game.jsx uses `state.speaker_avatar` for one character at a time. The new chat UI needs per-character color coding from the start.

**Step 1: Add constants at the top of the file (after imports)**

```javascript
const AVATAR_MAP = {
  'Ms. Mabrouki': 'mabrouki.svg',
  'SKANDER': 'skander.svg',
  'Skander': 'skander.svg',
  'Emna': 'emna.svg',
  'Ryan': 'ryan.svg',
  'Lilia': 'lilia.svg',
}

const COLOR_MAP = {
  'Ms. Mabrouki': '#1e3a8a',
  'SKANDER': '#0e7490',
  'Skander': '#0e7490',
  'Emna': '#7c3aed',
  'Ryan': '#0369a1',
  'Lilia': '#047857',
}
```

**Step 2: Add CharAvatar component (after the constants, before the main component)**

```jsx
function CharAvatar({ speaker, size = 42 }) {
  const file = AVATAR_MAP[speaker]
  const color = COLOR_MAP[speaker] || '#64748b'
  return (
    <Avatar
      src={file ? `/static/images/avatars/${file}` : undefined}
      alt={speaker}
      sx={{
        width: size, height: size,
        border: `2px solid ${color}`,
        flexShrink: 0,
        bgcolor: color,
        fontSize: size * 0.38,
        fontWeight: 700,
      }}
    >
      {speaker?.[0] || '?'}
    </Avatar>
  )
}
```

**Step 3: Verify no errors**

Check browser console — no new errors expected.

---

### Task 3: Add chat message state and population logic

**Files:**
- Modify: `frontend/src/pages/Game.jsx`

The current `state` object from the API holds the *current* question only. We need a `messages` array that accumulates the full chat history.

**Step 1: Add new state variables inside the Game component**

```javascript
const [messages, setMessages] = useState([])    // chat history
const [isTyping, setIsTyping] = useState(false)  // typing indicator
const messagesEndRef = useRef(null)              // for auto-scroll
```

Add `useRef` to the React import if not already there.

**Step 2: Populate messages when state loads**

Find the existing `load` function (or `useEffect` that calls `getGameState`). After `setState(s)` (or equivalent), add logic to append the new question as an incoming message:

```javascript
// After setting game state s:
if (s && s.question && !s.completed) {
  setIsTyping(true)
  await new Promise(r => setTimeout(r, 600))
  setIsTyping(false)
  setMessages(prev => {
    // avoid duplicating if already in history
    const lastMsg = prev[prev.length - 1]
    if (lastMsg?.type === 'incoming' && lastMsg?.text === s.question.question) return prev
    return [...prev, {
      type: 'incoming',
      speaker: s.question.speaker,
      text: s.question.question,
    }]
  })
}
```

**Step 3: Append outgoing message on submit**

Find `handleExerciseSubmit` or `submit`. Before the API call, append the student's answer:

```javascript
setMessages(prev => [...prev, { type: 'outgoing', text: responseText }])
```

**Step 4: Auto-scroll effect**

```javascript
useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
}, [messages, isTyping])
```

**Step 5: Verify in browser**

Visit `/game`. Open React DevTools and confirm `messages` grows as you submit answers.

---

### Task 4: Build the chat header

**Files:**
- Modify: `frontend/src/pages/Game.jsx`

**Step 1: Replace the `{/* HEADER */}` comment with this JSX**

```jsx
<Box sx={{
  background: mode === 'dark'
    ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
    : 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
  borderRadius: 3,
  mx: 2,
  mt: 2,
  px: { xs: 2.5, sm: 3.5 },
  py: { xs: 2, sm: 2.5 },
  flexShrink: 0,
}}>
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
    {/* Participant avatars */}
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {Object.keys(AVATAR_MAP).slice(0, 5).filter((v, i, a) => a.findIndex(x => AVATAR_MAP[x] === AVATAR_MAP[v]) === i).map(name => (
        <CharAvatar key={name} speaker={name} size={32} />
      ))}
    </Box>
    {/* Title + progress count */}
    <Box sx={{ textAlign: 'right' }}>
      <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.01em' }}>
        Workplace Chat
      </Typography>
      <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.75rem' }}>
        {state ? `${state.current_step} / ${state.total_steps}` : '...'}
      </Typography>
    </Box>
  </Box>
  {/* Progress bar */}
  <Box sx={{ height: 4, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.15)' }}>
    <Box sx={{
      height: '100%',
      borderRadius: 2,
      bgcolor: '#60a5fa',
      width: state ? `${(state.current_step / state.total_steps) * 100}%` : '0%',
      transition: 'width 0.5s ease',
    }} />
  </Box>
</Box>
```

**Note:** `mode` comes from `useTheme()` — check if it's already destructured in the component. If not, add:
```javascript
const theme = useTheme()
const mode = theme.palette.mode
```

**Step 2: Verify header renders correctly in light and dark mode.**

---

### Task 5: Build the chat thread

**Files:**
- Modify: `frontend/src/pages/Game.jsx`

**Step 1: Add TypingIndicator component (after CharAvatar, before Game component)**

```jsx
const typingBounce = keyframes`
  0%, 80%, 100% { transform: translateY(0); opacity: 0.35; }
  40% { transform: translateY(-6px); opacity: 1; }
`

function TypingIndicator({ speaker }) {
  const color = COLOR_MAP[speaker] || '#64748b'
  return (
    <Fade in>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, mb: 2 }}>
        <CharAvatar speaker={speaker} size={36} />
        <Box>
          <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color, mb: 0.5 }}>
            {speaker}
          </Typography>
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 0.6,
            bgcolor: 'grey.100',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '18px 18px 18px 4px',
            px: 2, py: 1.5,
          }}>
            {[0, 1, 2].map(i => (
              <Box key={i} sx={{
                width: 8, height: 8, borderRadius: '50%', bgcolor: color,
                animation: `${typingBounce} 1.2s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }} />
            ))}
          </Box>
        </Box>
      </Box>
    </Fade>
  )
}
```

Add `keyframes` to the MUI imports: `import { keyframes } from '@mui/system'` or `import { keyframes } from '@emotion/react'`.
Add `Fade` to MUI imports.

**Step 2: Replace `{/* CHAT THREAD */}` comment with**

```jsx
<Box sx={{
  flex: 1,
  overflowY: 'auto',
  mx: 2,
  my: 1.5,
  p: { xs: 2, sm: 3 },
  bgcolor: 'mode' === 'dark' ? '#0f172a' : '#f8fafc',
  bgcolor: theme.palette.mode === 'dark' ? '#0f172a' : '#f8fafc',
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 3,
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
}}>
  {messages.map((msg, i) => {
    const prevMsg = messages[i - 1]
    const showLabel = msg.type === 'incoming' && prevMsg?.speaker !== msg.speaker
    return (
      <Fade in key={i} timeout={350}>
        <Box sx={{
          display: 'flex',
          flexDirection: msg.type === 'outgoing' ? 'row-reverse' : 'row',
          alignItems: 'flex-end',
          gap: 1,
          mb: 1.5,
        }}>
          {msg.type === 'incoming' && <CharAvatar speaker={msg.speaker} size={36} />}
          <Box sx={{ maxWidth: '75%' }}>
            {showLabel && (
              <Typography sx={{
                fontSize: '0.72rem', fontWeight: 700,
                color: COLOR_MAP[msg.speaker] || '#64748b',
                mb: 0.5,
                ml: 0.5,
              }}>
                {msg.speaker}
              </Typography>
            )}
            <Box sx={{
              px: 2.5, py: 1.5,
              bgcolor: msg.type === 'incoming'
                ? (theme.palette.mode === 'dark' ? '#1e293b' : '#f1f5f9')
                : '#1e3a8a',
              color: msg.type === 'incoming'
                ? (theme.palette.mode === 'dark' ? '#e2e8f0' : '#0f172a')
                : '#ffffff',
              borderRadius: msg.type === 'incoming'
                ? '18px 18px 18px 4px'
                : '18px 18px 4px 18px',
              border: msg.type === 'incoming' ? '1px solid' : 'none',
              borderColor: 'divider',
              fontSize: '0.95rem',
              lineHeight: 1.65,
            }}>
              {msg.text}
            </Box>
          </Box>
        </Box>
      </Fade>
    )
  })}

  {isTyping && state?.question && (
    <TypingIndicator speaker={state.question.speaker} />
  )}

  <div ref={messagesEndRef} />
</Box>
```

**Step 3: Test in browser** — messages should appear as chat bubbles, typing indicator shows briefly before each new question.

---

### Task 6: Build the input area

**Files:**
- Modify: `frontend/src/pages/Game.jsx`

The current Game.jsx uses ExerciseRenderer for all question types. For the chat UI, open-ended text questions should use the chat input. Other question types (multiple choice, gap-fill, etc.) still use ExerciseRenderer.

**Step 1: Add local input state**

```javascript
const [chatInput, setChatInput] = useState('')
```

**Step 2: Add handleChatSend**

```javascript
const handleChatSend = () => {
  if (!chatInput.trim() || submitting) return
  handleExerciseSubmit(chatInput.trim())
  setChatInput('')
}
```

**Step 3: Replace `{/* INPUT AREA */}` comment with**

```jsx
<Box sx={{
  mx: 2,
  mb: 2,
  flexShrink: 0,
}}>
  {/* Skill hint strip */}
  {state?.skill_description && (
    <Box sx={{
      mb: 1,
      px: 2.5, py: 1,
      bgcolor: theme.palette.mode === 'dark' ? '#1e293b' : '#eff6ff',
      border: '1px solid',
      borderColor: theme.palette.mode === 'dark' ? '#334155' : '#bfdbfe',
      borderRadius: 2,
    }}>
      <Typography sx={{
        fontSize: '0.8rem',
        color: theme.palette.mode === 'dark' ? '#93c5fd' : '#1e40af',
        fontWeight: 500,
      }}>
        Assessing: {state.skill_description}
      </Typography>
    </Box>
  )}

  {/* ExerciseRenderer for non-text question types */}
  {state?.question && state.question.type !== 'open_ended' && state.question.type !== 'text' && (
    <ExerciseRenderer
      question={{ ...state.question, audio_url: state.audio_url, hint: state.hint }}
      onSubmit={handleExerciseSubmit}
      loading={submitting}
    />
  )}

  {/* Chat text input for open-ended questions */}
  {(!state?.question || state.question.type === 'open_ended' || state.question.type === 'text') && (
    <Box sx={{
      display: 'flex',
      alignItems: 'flex-end',
      gap: 1.5,
      bgcolor: theme.palette.mode === 'dark' ? '#1e293b' : '#ffffff',
      border: '1px solid',
      borderColor: theme.palette.mode === 'dark' ? '#475569' : '#cbd5e1',
      borderRadius: 3,
      p: 1.5,
      boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 1px 6px rgba(0,0,0,0.06)',
      '&:focus-within': {
        borderColor: '#1e3a8a',
        boxShadow: '0 0 0 3px rgba(30,58,138,0.1)',
      },
    }}>
      <TextField
        multiline
        minRows={2}
        maxRows={4}
        fullWidth
        placeholder="Type your reply…"
        value={chatInput}
        onChange={e => setChatInput(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleChatSend()
          }
        }}
        disabled={submitting || !state?.question}
        variant="standard"
        InputProps={{ disableUnderline: true }}
        sx={{
          '& .MuiInputBase-input': {
            fontSize: '0.95rem',
            lineHeight: 1.65,
            color: theme.palette.mode === 'dark' ? '#e2e8f0' : '#0f172a',
            '&::placeholder': {
              color: theme.palette.mode === 'dark' ? '#475569' : '#94a3b8',
              opacity: 1,
            },
          },
        }}
      />
      <IconButton
        onClick={handleChatSend}
        disabled={!chatInput.trim() || submitting}
        sx={{
          width: 44, height: 44,
          bgcolor: (!chatInput.trim() || submitting) ? 'transparent' : '#1e3a8a',
          color: (!chatInput.trim() || submitting)
            ? (theme.palette.mode === 'dark' ? '#64748b' : '#94a3b8')
            : '#ffffff',
          borderRadius: 2,
          '&:hover': { bgcolor: '#1e40af' },
          '&.Mui-disabled': {
            bgcolor: theme.palette.mode === 'dark' ? '#334155' : '#e2e8f0',
          },
          flexShrink: 0,
          transition: 'all 200ms ease',
        }}
      >
        <SendIcon />
      </IconButton>
    </Box>
  )}
</Box>
```

**Step 4: Add SendIcon import**

```javascript
import SendIcon from '@mui/icons-material/Send'
```

**Step 5: Test full flow** — type a message, press Enter or Send, message appears in thread, typing indicator shows, next question arrives.

---

### Task 7: Handle loading, error and completed states

**Files:**
- Modify: `frontend/src/pages/Game.jsx`

**Step 1: Wrap the full chat shell in a conditional**

The loading/error/completed states should still show a clean centered view. Before the main chat Box, add:

```jsx
if (loading) return (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
)

if (error) return (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', p: 3 }}>
    <Alert severity="error">{error}</Alert>
  </Box>
)
```

The `completed` state navigation already exists in the existing `load()` function (navigates to `/results`), so no change needed there.

**Step 2: Remove all old JSX** that is no longer referenced — scene banner image, speaker card, skill card, audio player section, old submit button, AI feedback button. These should all be gone since we're using the new chat layout. Read the file and delete any remaining old JSX fragments.

**Step 3: Final browser test**

- Visit `/game`
- First NPC message appears after typing indicator
- Type a reply and send
- Reply appears on right, typing indicator, next message on left
- Progress bar fills
- Dark mode toggle works

---

### Task 8: Commit

```bash
cd /Users/octa/Desktop/PROJECTS/FARDIM/FARDI
git add frontend/src/pages/Game.jsx
git commit -m "feat: redesign /game as group chat interface"
```
