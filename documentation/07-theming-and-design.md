# 07 — Theming & Design System

This document describes the complete visual language of FARDI: the MUI theme configuration, the "clay/bento" card style, the colour system, typography, characters, badges, scenes, and everything else a designer or new frontend developer needs to follow the existing conventions.

---

## 1. Design Philosophy — "Clay / Bento"

The FARDI UI is built around what the team calls the **clay/bento** style. The two words describe two complementary things:

**Clay** refers to the card aesthetic. Every interactive surface looks slightly tactile — like a soft, colourful clay tile sitting on a desk. The key visual signature is the flat **offset shadow**: instead of a blurred drop shadow, cards have a solid `4px 4px 0` shift in the same colour as their border, giving the impression that the card is a few millimetres thick and casting a hard shadow on the surface beneath it. Cards also lift on hover by moving `translate(-2px, -2px)` so the shadow appears to grow, as if you are picking up the tile.

**Bento** refers to the grid layout. Content is arranged in an asymmetric grid — like a Japanese bento box — where some cells span two columns and others span one. On the Dashboard, for example, the six phases are laid out in a `3-column` grid with Phase 1 spanning 2 columns, Phase 2 spanning 1, Phase 3 spanning 1, Phase 4 spanning 2, and so on. This creates visual rhythm and hierarchy without a rigid equal-height row layout.

Together the style feels energetic, approachable, and slightly playful — matching a gamified learning platform — while staying clean and professional enough for a university setting.

---

## 2. Colour Palette

The palette is defined locally in every page component and in `AppLayout.jsx` as a `LIGHT` / `DARK` constant pair. There is **no central colour token file** — each component file re-declares the same palette. The token names and hex values below are the canonical set.

### 2.1 Light mode

| Token | Role | `bg` | `border` | `shadow` |
|-------|------|------|----------|---------|
| `pageBg` | Page background | `#FFFDE7` | — | — |
| `cardBg` | White card surface | `#ffffff` | — | — |
| `heading` | Heading text | `#1A237E` | — | — |
| `body` | Body text | `#37474F` | — | — |
| `muted` | Secondary/muted text | `#78909C` | — | — |
| `border` / `divider` | Dividers, separator lines | `#E0E0E0` | — | — |
| `purple` | Brand accent, sidebar logo | `#E1BEE7` | `#8E24AA` | `#8E24AA` |
| `blue` | Phase 2, headers, recent activity | `#BBDEFB` | `#1976D2` | `#1976D2` |
| `yellow` | Progress, XP, highlights | `#FFF9C4` | `#F9A825` | `#F9A825` |
| `green` | Success, completion | `#C8E6C9` | `#388E3C` | `#388E3C` |
| `orange` | Phase 4, exercises, warnings | `#FFE0B2` | `#F57C00` | `#F57C00` |
| `pink` | Phase 5 | `#FCE4EC` | `#C2185B` | `#C2185B` |
| `teal` | Profile, scenarios | `#B2EBF2` | `#0097A7` | `#0097A7` |
| `red` | Admin badge, errors | `#FFCDD2` | `#C62828` | `#C62828` |
| `indigo` | Phase 1, navigation active | `#C5CAE9` / `#E8EAF6` | `#3949AB` | `#3949AB` |

### 2.2 Dark mode

| Token | Role | `bg` | `border` | `shadow` |
|-------|------|------|----------|---------|
| `pageBg` | Page background | `#0F0F1A` | — | — |
| `cardBg` | Card surface | `#1A1A2E` | — | — |
| `heading` | Heading text | `#E8EAFF` | — | — |
| `body` | Body text | `#B0BEC5` | — | — |
| `muted` | Muted text | `#607D8B` | — | — |
| `border` | Dividers | `#2A2A4A` | — | — |
| `purple` | Brand accent | `#1E0A2E` | `#CE93D8` | `#7B1FA2` |
| `blue` | Phase 2 | `#0A1929` | `#64B5F6` | `#1565C0` |
| `yellow` | XP, progress | `#2A2200` | `#F9A825` | `#A06800` |
| `green` | Success | `#0A1F0A` | `#81C784` | `#2E7D32` |
| `orange` | Phase 4 | `#1F1000` | `#FFB74D` | `#E65100` |
| `pink` | Phase 5 | `#1F0010` | `#F48FB1` | `#880E4F` |
| `teal` | Scenarios | `#001F22` | `#4DD0E1` | `#00695C` |
| `red` | Errors | `#1F0000` | `#EF9A9A` | `#B71C1C` |
| `indigo` | Navigation | `#0D0F2A` / `#0D0D2B` | `#7986CB` | `#283593` |

### 2.3 Phase → colour mapping

Used in the sidebar and Dashboard to colour-code each phase:

| Phase | Colour token | Theme (light) |
|-------|-------------|----------------|
| 1 | `indigo` | `#3949AB` |
| 2 | `blue` | `#1976D2` |
| 3 | `green` | `#388E3C` |
| 4 | `orange` | `#F57C00` |
| 5 | `pink` / `red` | `#C2185B` / `#ef4444` |
| 6 | `purple` / `teal` | `#8b5cf6` |

### 2.4 Remedial page colour semantics

Within exercise pages the colour tokens map to exercise roles (not CEFR levels):

| Token | Typical use in exercise pages |
|-------|------------------------------|
| `orange` | Page header / task title card |
| `teal` | Instructor message / character speech card |
| `blue` | Instructions / exercise card |
| `green` | Success feedback / completion card |
| `yellow` | In-progress / partial score card |
| `red` | Error / failure state |
| `purple` | Vocabulary emphasis |

---

## 3. Typography

The global font is set in `theme.jsx`:

```
fontFamily: '"Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"'
```

Inter is not bundled — it should be loaded via a `<link>` tag in `index.html` or a local font import.

### MUI typography scale (from `theme.jsx`)

| Variant | Size | Weight | Line height | Letter spacing |
|---------|------|--------|-------------|----------------|
| `h1` | 3.5 rem | 700 | 1.2 | −0.025 em |
| `h2` | 2.25 rem | 600 | 1.25 | −0.025 em |
| `h3` | 1.875 rem | 600 | 1.375 | — |
| `h4` | 1.5 rem | 600 | 1.375 | — |
| `h5` | 1.25 rem | 500 | 1.375 | — |
| `h6` | 1.125 rem | 500 | 1.375 | — |
| `body1` | 1 rem | 400 | 1.625 | — |
| `body2` | 0.875 rem | 400 | 1.5 | — |
| `button` | inherited | 500 | — | 0.025 em, `textTransform: none` |

### Common inline overrides in clay pages

Individual pages frequently override MUI variant sizing via the `sx` prop to achieve the clay aesthetic:

| Use | Typical sx values |
|-----|------------------|
| Page heading | `fontWeight: 900`, `fontSize: '2.2rem'`, `letterSpacing: '-0.03em'` |
| Section label (caps) | `fontSize: '0.68rem'`, `fontWeight: 600`, `textTransform: 'uppercase'`, `letterSpacing: '0.08em'` |
| Stat number | `fontWeight: 900`, `fontSize: '1.6rem'`, `letterSpacing: '-0.02em'` |
| Card label | `fontWeight: 700`, `fontSize: '0.85rem'` |
| Muted caption | `fontSize: '0.72rem'`, `fontWeight: 700` |

---

## 4. MUI Theme Configuration

**File:** `frontend/src/theme.jsx`

`AppTheme` is the default export. It wraps the app in `ThemeProvider` + `CssBaseline` and exposes a `ColorModeContext`.

### 4.1 Theme tokens

```
shape.borderRadius: 8
```

### 4.2 Light palette (in `theme.jsx`)

```
primary.main:    #1e3a8a   (Navy blue)
secondary.main:  #6366f1   (Indigo)
success.main:    #059669
warning.main:    #d97706
error.main:      #dc2626
background.default: #ffffff
background.paper:   #ffffff
text.primary:    #1f2937
text.secondary:  #6b7280
```

### 4.3 Dark palette (in `theme.jsx`)

```
primary.main:    #3b82f6
secondary.main:  #818cf8
background.default: #0f172a
background.paper:   #1e293b
text.primary:    #f1f5f9
text.secondary:  #cbd5e1
```

### 4.4 Component overrides in the theme

| Component | Override |
|-----------|---------|
| `MuiButton` | `textTransform: none`, `borderRadius: 8`, `fontWeight: 600`, `disableElevation: true` |
| `MuiPaper` | `borderRadius: 8`, `backgroundImage: none` |
| `MuiCard` | `borderRadius: 8`, `backgroundImage: none`, `transition: all 200ms ease` |
| `MuiTextField` | Hover/focus ring in blue |
| `MuiChip` | `borderRadius: 6`, `fontWeight: 500` |
| `MuiAppBar` | `boxShadow: none` |
| `MuiCssBaseline` | Custom 8px scrollbar in theme colours |

Note: In practice, clay-style pages bypass MUI `Button`, `Card`, and `Chip` in favour of raw `<Box component="button">` and `<Box sx={...}>` elements. The MUI component overrides matter mainly for any legacy or admin pages that still use standard MUI components.

### 4.5 Color mode persistence

Mode is stored in `localStorage` under the key `fardi-theme-v2`. Default is `'light'`. The key `fardi-color-mode` (old) is deliberately ignored.

---

## 5. Clay/Bento Card Style

This is the core visual pattern. Every content card in the app uses the same formula.

### 5.1 The formula

```js
{
  bgcolor: colorToken.bg,
  border: `2px solid ${colorToken.border}`,
  borderRadius: '20px',
  boxShadow: `4px 4px 0 ${colorToken.shadow}`,
  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
  '&:hover': {
    transform: 'translate(-2px, -2px)',
    boxShadow: `6px 6px 0 ${colorToken.shadow}`,
  },
}
```

On hover the card shifts 2 pixels up-left and the shadow grows proportionally, simulating a "lift" effect.

### 5.2 Active / pressed state

```js
'&:active': {
  transform: 'translate(1px, 1px)',
  boxShadow: `2px 2px 0 ${colorToken.shadow}`,
},
```

### 5.3 Sizes

| Element | Border radius | Shadow offset |
|---------|---------------|---------------|
| Full-width feature card | `'20px'` | `4px 4px 0` |
| Sidebar nav item | `'10px'` | `3px 3px 0` |
| Pill / chip | `'50px'` | `2px 2px 0` |
| Small icon box | `'8px'` to `'14px'` | `2px 2px 0` or `3px 3px 0` |
| Logo box | `'11px'` | `3px 3px 0` |

### 5.4 Pill helper

The Dashboard defines a `pill()` helper, representative of how small status labels are styled:

```js
const pill = (c) => ({
  display: 'inline-flex', alignItems: 'center', gap: 0.5,
  px: 1.75, py: 0.4, borderRadius: '50px',
  bgcolor: c.bg, border: `2px solid ${c.border}`,
  boxShadow: `2px 2px 0 ${c.shadow}`,
  fontSize: '0.7rem', fontWeight: 800, color: c.border,
})
```

### 5.5 Icon box inside a card

Icon containers that sit inside a card have a white (`cardBg`) background so they stand out against the coloured card background:

```js
{
  width: 44, height: 44, borderRadius: '13px',
  bgcolor: D.cardBg,
  border: `2px solid ${c.border}`,
  boxShadow: `3px 3px 0 ${c.shadow}`,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}
```

### 5.6 Locked / disabled state

Cards and sidebar items for locked phases use:

```js
opacity: 0.45        // or 0.55
bgcolor: isDark ? '#16162A' : '#F5F5F5'
border: `2px solid ${D.divider}`
boxShadow: `3px 3px 0 ${D.divider}`
```

---

## 6. Character Avatars

**Location:** `backend/static/images/avatars/`

All avatars are flat SVG illustrations in a consistent bust-crop style (head and shoulders only, transparent background, 200×200 viewBox). They are served as static files from the FastAPI backend.

| File | Character | Role | Visual description |
|------|-----------|------|-------------------|
| `lilia.svg` | Lilia | Main Instructor | Light golden-brown skin, long dark curly hair, coral-red blazer, wide smile |
| `ryan.svg` | Ryan | Committee Member | Warm tan skin, caramel wavy hair, mustard yellow hoodie, relaxed expression |
| `skander.svg` | Skander | Student Council President | Deep brown skin, closely cropped dark hair, white dress shirt, serious expression |
| `emna.svg` | Emna | Committee Member | Medium olive skin, dark bob haircut, wire-frame glasses, forest-green turtleneck |
| `mabrouki.svg` | Ms. Mabrouki | Event Coordinator | Deep brown skin, silver-streaked hair in a high bun, burgundy blazer, pearl earrings |

**How avatars are mapped in code** (from `Avatar.jsx`):

```js
const AVATAR_MAPPING = {
  'Ms. Mabrouki': 'mabrouki.svg',
  'SKANDER': 'skander.svg',
  'Skander': 'skander.svg',
  'Emna': 'emna.svg',
  'Ryan': 'ryan.svg',
  'Lilia': 'lilia.svg',
  'Team': 'mabrouki.svg',  // default for group messages
}
```

Any unrecognised speaker name falls back to `mabrouki.svg`.

**Usage in exercise pages:**

```jsx
import { CharacterMessage } from '../../components/Avatar.jsx'

<CharacterMessage
  character="MS. MABROUKI"
  message="Great job! Now let's move on to the next exercise."
/>
```

Note: The `character` prop is passed as-is but the component calls it `speaker` internally. When using `CharacterMessage`, passing the name in caps (`"MS. MABROUKI"`) still works because the mapping lookup is case-sensitive — always use the exact strings listed in `AVATAR_MAPPING`.

---

## 7. Badge System

**Location:** `backend/static/images/badges/`

Badges are circular game-achievement emblems (200×200 px) awarded on the Results and Profile pages after completing Phase 1.

| File | Badge name | CEFR level | Description |
|------|-----------|------------|-------------|
| `newcomer.jpg` | Newcomer | Pre-A1 | Muted silver/grey, open door or first star icon |
| `a1.jpg` | A1 Starter | A1 | Warm bronze tones, seedling or bronze star |
| `a2.jpg` | A2 Explorer | A2 | Cool silver, compass or winding path |
| `b1.jpg` | B1 Achiever | B1 | Gold/amber, trophy or golden flame, laurel wreath border |
| `b2.jpg` | B2 Challenger | B2 | Deep blue/platinum, shield or mountain peak |
| `c1.jpg` | C1 Expert | C1 | Royal purple/diamond-white, sparkling diamond or eagle, ornate border |

The badge file name matches the CEFR level code lowercased. The `Results.jsx` page fetches the appropriate badge based on `best_level` returned from the backend.

---

## 8. Background Scenes

**Location:** `backend/static/images/scenes/`

Full-page background images (1280×720 px) shown behind the Phase 1 game/chat UI. They are served as static files from FastAPI. The directory was initially empty and images were to be generated separately.

| File | Scene | Used in |
|------|-------|---------|
| `office.jpg` | Modern open-plan office, Tunisia | Phase 1 professional interactions |
| `classroom.jpg` | Bright university classroom | Phase 1 academic context interactions |
| `meeting_room.jpg` | University committee/meeting room | Phase 2 cultural planning interactions |
| `cafeteria.jpg` | University cafeteria, warm tones | Casual/social interactions |
| `campus.jpg` | Sunny outdoor campus, palm trees | Outdoor scenario interactions |
| `event_hall.jpg` | Decorated event/conference hall | Phase 2 event organisation interactions |
| `library.jpg` | University library, warm lighting | Research/reading interactions |

All images should be slightly soft/blurred depth-of-field so the UI overlaid in front reads clearly.

---

## 9. Responsive Design Approach

FARDI uses MUI's responsive `sx` system with breakpoint shorthand. There is no custom breakpoint configuration — all breakpoints use MUI defaults (`xs`, `sm`, `md`, `lg`, `xl`).

### Sidebar behaviour

| Breakpoint | Sidebar |
|-----------|---------|
| `xs`, `sm` | Hidden; replaced by a sticky mobile header bar with a hamburger button |
| `md`+ | Fixed sidebar (260 px expanded, 64 px collapsed) |

The `md` breakpoint (900 px) is the single responsive split for the navigation.

### Content layout

Pages use `<Container maxWidth="lg">` or `maxWidth="md"` as the outer wrapper. Most content columns switch from single-column on `xs` to multi-column on `sm` or `md`:

```jsx
<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3,1fr)' }, gap: 2 }}>
```

Stats rows switch from 2 columns on `xs` to 4 on `sm`:

```jsx
gridTemplateColumns: { xs: 'repeat(2,1fr)', sm: 'repeat(4,1fr)' }
```

Phase card spans collapse on `xs` (all cards become single column):

```jsx
style={{ gridColumn: isWide ? 'span 2' : 'span 1' }}
// On xs grid is set to 1fr so span 2 has no effect — all cards stack
```

---

## 10. Icon System

FARDI uses two icon sources:

### 10.1 MUI icons (primary)

All navigation and UI icons come from `@mui/icons-material`. No custom icon component wraps them — they are used directly:

```jsx
import DashboardIcon from '@mui/icons-material/Dashboard'
<DashboardIcon sx={{ fontSize: 20 }} />
```

Common icons used:
- Navigation: `DashboardIcon`, `PersonIcon`, `MapIcon`, `GroupIcon`
- Phase icons: `SchoolIcon` (1), `GroupIcon` (2), `StorefrontIcon` (3), `CampaignIcon` (4), `BuildIcon` (5), `AutoStoriesIcon` (6)
- Admin: `AdminPanelSettingsIcon`, `BarChartIcon`, `PeopleIcon`, `SecurityIcon`
- State: `LockIcon`, `CheckCircleIcon`, `AutoAwesomeIcon`
- Actions: `LogoutIcon`, `MenuIcon`, `SkipNextIcon`
- Feedback: `RocketLaunchIcon`, `PlayArrowIcon`, `ArrowForwardIcon`, `EmojiEventsIcon`

### 10.2 SVG asset icons (gamification)

Inline SVG icons for the gamification system are described in `visuals.md` and intended to live in `frontend/src/assets/icons/`. These include:

| File | Use |
|------|-----|
| `streak-flame.svg` | Daily streak counter (`#FF6B35` outer, `#FFD700` inner) |
| `level-up-star.svg` | Level-up celebration (`#F5A623` gold) |
| `xp-target.svg` | Daily XP goal (concentric circles, `#1976d2` innermost) |
| `goal-check.svg` | Completed goal (`#4caf50` filled circle, white checkmark) |

Backend achievement icons are intended for `backend/static/assets/icons/`:

| File | Achievement |
|------|-------------|
| `first-step.svg` | First assessment completed |
| `streak-3.svg` | 3-day streak (three orange flames) |
| `streak-7.svg` | 7-day streak ("Week Warrior") |
| `phase-complete.svg` | Phase completed (graduation cap, `#1976d2`) |
| `perfect-score.svg` | 100% score (gold stars) |
| `speed-learner.svg` | Fastest completion (yellow lightning bolt) |
| `vocabulary-master.svg` | Vocabulary exercise mastery (blue open book) |

### 10.3 Phase 4 vocabulary flashcard images

**Location:** `frontend/public/images/phase4/`

PNG illustrations used in marketing vocabulary flashcard exercises. Each image represents one marketing term (e.g., `billboard.jpg`, `commercial.png`, `slogan.png`). Style: flat illustration, bold colours, white background, 400×300 px.

Full list of files: `ad.png`, `animation.png`, `billboard.jpg`, `clip.png`, `commercial.png`, `creative.png`, `dramatisation.png`, `eye-catcher.png`, `feature.png`, `gatefold.png`, `goal.png`, `jingle.png`, `lettering.png`, `obstacles.png`, `original.png`, `persuasive.png`, `poster.png`, `promotional.png`, `reveal.png`, `sketch.png`, `slogan.png`, `storytelling.png`, `targeted.png`, `video.png`.

---

## 11. Animation Patterns

FARDI uses **Framer Motion** (`framer-motion` package) for all enter animations. There are no CSS animation keyframes.

### 11.1 Fade-up entrance (universal)

Every card and section on the Dashboard and most exercise pages fades up on mount:

```js
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' }
  }),
}

// Usage:
<motion.div variants={fadeUp} initial="hidden" animate="visible" custom={index}>
  {/* card content */}
</motion.div>
```

The `custom` prop passes a stagger index — each card's delay is `index × 0.08s`, so cards cascade in from top to bottom.

### 11.2 Progress bar animation

Progress bars use `motion.div` with animated `width`:

```js
<motion.div
  initial={{ width: '0%' }}
  animate={{ width: `${progressPercent}%` }}
  transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
  style={{ height: '100%', borderRadius: 50, background: c.border }}
/>
```

### 11.3 Trophy/icon float

The trophy icon shown when all phases are complete uses an infinite vertical float:

```js
<motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
```

### 11.4 Trophy trophy wag

When the completion trophy is shown, the `EmojiEventsIcon` does a single wag:

```js
<motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 1, delay: 0.8 }}>
```

### 11.5 Exercise page entrance

Exercise and remedial pages use a simpler single-card entrance:

```jsx
<motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
```

### 11.6 Clay hover / active (pure CSS via sx)

The hover lift and active press on clay cards are implemented as CSS transitions in the MUI `sx` prop, not Framer Motion:

```js
transition: 'transform 0.15s ease, box-shadow 0.15s ease',
'&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${shadow}` },
'&:active': { transform: 'translate(1px,1px)', boxShadow: `2px 2px 0 ${shadow}` },
```

---

## 12. Adding a New Phase Page — Step-by-Step

Follow these steps to create a new exercise page (e.g., a new interaction or remedial task) that fits the existing design system.

### Step 1 — Create the file in the right folder

Find the correct folder. For example, a new remedial C1 TaskE for Phase 5 Sub-phase 1 Step 3 goes in:

```
frontend/src/pages/Phase5SubPhase1Step3/RemedialC1/TaskE.jsx
```

### Step 2 — Start with the standard boilerplate

```jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

// ─── Clay palette (copy from any existing sibling file) ──────────────────────
const LIGHT = {
  pageBg: '#FFFDE7',
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  teal:   { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  red:    { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  teal:   { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  red:    { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

export default function MyNewPage() {
  const navigate = useNavigate()

  // Register the testing skip target (points to the NEXT page in the flow)
  React.useEffect(() => {
    window.__remedialSkip = () => navigate('/next/url')
  }, [])

  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const P = isDark ? DARK : LIGHT

  // Progress save hook — adjust phase/subphase/step/interaction/context
  const { saveResponse } = useProgressSave({
    phase: 5, subphase: 1, step: 3, interaction: 5, context: 'remedial_c1'
  })

  const [completed, setCompleted] = useState(false)

  const handleComplete = () => {
    saveResponse({ item_index: 0, item_id: 'done', item_type: 'task_complete', answer: 'TaskE', is_correct: true, score: 1 })
    setCompleted(true)
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* ── Header card ─── */}
          <Box sx={{
            bgcolor: P.orange.bg,
            border: `2px solid ${P.orange.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.orange.shadow}`,
            p: 3, mb: 3,
            transition: 'transform 0.15s, box-shadow 0.15s',
            '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` },
          }}>
            <Typography variant="h5" fontWeight={700} color={P.orange.shadow}>
              Phase 5 — Remedial C1
            </Typography>
            <Typography variant="h6" fontWeight={700} color={P.orange.shadow}>
              Task E: [Exercise title]
            </Typography>
            <Typography variant="body1" color={isDark ? 'rgba(255,255,255,0.8)' : 'text.secondary'}>
              [Exercise description]
            </Typography>
          </Box>

          {/* ── Instructor message card ─── */}
          <Box sx={{
            bgcolor: P.teal.bg,
            border: `2px solid ${P.teal.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3,
            transition: 'transform 0.15s, box-shadow 0.15s',
            '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.teal.shadow}` },
          }}>
            <CharacterMessage
              character="Lilia"
              message="Here is your task for today..."
            />
          </Box>

          {/* ── Exercise content ─── */}
          {/* Insert your game component here */}

          {/* ── Continue button ─── */}
          {completed && (
            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
              <Box
                component="button"
                onClick={() => navigate('/next/url')}
                sx={{
                  bgcolor: P.green.bg,
                  border: `2px solid ${P.green.border}`,
                  borderRadius: '12px',
                  boxShadow: `3px 3px 0 ${P.green.shadow}`,
                  px: 3, py: 1.5,
                  fontWeight: 700, fontSize: '1rem',
                  cursor: 'pointer', color: isDark ? P.green.border : P.green.shadow,
                  transition: 'transform 0.15s, box-shadow 0.15s',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                  '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` },
                }}
              >
                Continue →
              </Box>
            </Stack>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
```

### Step 3 — Register the route in `App.jsx`

Open `frontend/src/App.jsx`, find the block for your phase, and add the import and route:

```jsx
// Near the top with other phase 5 imports:
import MyNewPage from './pages/Phase5SubPhase1Step3/RemedialC1/TaskE.jsx'

// Inside <Route element={<AppLayout />}>:
<Route path="/phase5/subphase/1/step/3/remedial/c1/task/e" element={<MyNewPage />} />
```

### Step 4 — Wire the skip target in the previous task

In the preceding task file, update the `window.__remedialSkip` target:

```js
React.useEffect(() => {
  window.__remedialSkip = () => navigate('/phase5/subphase/1/step/3/remedial/c1/task/e')
}, [])
```

### Step 5 — Choose your colour tokens

Use the semantic colour guidelines:

| Card role | Token |
|-----------|-------|
| Page header / task title | `orange` |
| Instructor message | `teal` |
| Exercise container | `blue` or phase-specific colour |
| Success / complete | `green` |
| Failure / try again | `red` or `yellow` |

### Step 6 — Dark mode

Always derive from `theme.palette.mode`:

```js
const isDark = theme.palette.mode === 'dark'
const P = isDark ? DARK : LIGHT
```

Never hard-code colours. Always use `P.orange.border`, `P.teal.bg`, etc.

### Step 7 — Progress save

Call `saveResponse(...)` from `useProgressSave` whenever the student submits an answer. Call `saveNow(...)` if you need to guarantee the save fires before navigating away.

### Step 8 — Build check

```bash
cd frontend
npm run build
```

Fix any TypeScript/ESLint errors before committing.

---

## 13. Dark / Light Mode — Quick Reference for Components

```jsx
// Read current mode in any component:
import { useTheme } from '@mui/material'
const theme = useTheme()
const isDark = theme.palette.mode === 'dark'

// Or use the FARDI context for the toggle:
import { useColorMode } from '../theme.jsx'
const { mode, toggle } = useColorMode()
```

The `toggle()` function flips the mode and persists it to `localStorage['fardi-theme-v2']`.

---

## 14. Sound Effects

**Location:** `backend/static/assets/sounds/`

Short audio cues for gamification events (to be sourced from Freesound.org or Pixabay Audio):

| File | Trigger |
|------|---------|
| `xp-gain.mp3` | Earning XP after correct answer |
| `level-up.mp3` | Phase completion |
| `achievement.mp3` | Badge unlocked |
| `streak.mp3` | Streak milestone reached |
