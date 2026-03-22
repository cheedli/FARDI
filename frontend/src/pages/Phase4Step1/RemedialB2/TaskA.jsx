import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import RolePlayRPGGame from '../../../components/RolePlayRPGGame.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Level B2 - Task A: Role-Play Dialogue (Advanced)
 * Complete an advanced dialogue on attraction with poster/video and terms
 * Gamified as "Role-Play RPG" - level up character with correct terms
 */

// Dialogue structure based on the requirements
const DIALOGUE_LINES = [
  {
    speaker: 'Ms. Mabrouki',
    template: 'Poster or video?',
    blanks: []
  },
  {
    speaker: 'You',
    template: '[____] as [____] with [____]; [____] for [____] [____] content.',
    blanks: ['poster', 'eye-catcher', 'slogan', 'video', 'feature', 'engaging']
  },
  {
    speaker: 'Ryan',
    template: 'Use [____] [____].',
    blanks: ['targeted', 'billboard']
  }
]

const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const WORD_BANK = shuffleArray([
  'poster',
  'eye-catcher',
  'video',
  'feature',
  'targeted',
  'engaging',
  'slogan',
  'billboard'
])

const LIGHT = {
  pageBg: '#FFFDE7',
  blue:   { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
  teal:   { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  red:    { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
  teal:   { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  red:    { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

export default function RemedialB2TaskA() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 1, context: 'remedial_b2' })

  const handleGameComplete = (result) => {
    console.log('B2 Role-Play RPG completed:', result)

    const score = result.score || 0
    const level = result.level || 1
    const xp = result.experiencePoints || 0

    sessionStorage.setItem('remedial_b2_taskA_score', score)
    sessionStorage.setItem('remedial_b2_taskA_level', level)
    sessionStorage.setItem('remedial_b2_taskA_xp', xp)

    logTaskCompletion(score, level, xp)

    setTimeout(() => {
      navigate('/phase4/remedial/b2/taskB')
    }, 1500)
  }

  const logTaskCompletion = async (score, level, xp) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      const response = await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          level: 'B2',
          task: 'A',
          score: score,
          max_score: 8,
          character_level: level,
          experience_points: xp,
          completed: true
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('Task A completion logged to backend')
      }
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: isDark ? DARK.pageBg : LIGHT.pageBg, py: 4 }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: isDark ? DARK.purple.bg : LIGHT.purple.bg,
            border: `2px solid ${isDark ? DARK.purple.border : LIGHT.purple.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${isDark ? DARK.purple.shadow : LIGHT.purple.shadow}`,
            p: 4, mb: 3,
            transition: 'transform 0.15s, box-shadow 0.15s',
            '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${isDark ? DARK.purple.shadow : LIGHT.purple.shadow}` }
          }}>
            <Typography variant="h4" gutterBottom fontWeight={700} color={isDark ? DARK.purple.border : LIGHT.purple.shadow}>
              Advanced Marketing Strategy
            </Typography>
            <Typography variant="h6" gutterBottom fontWeight={700} color={isDark ? DARK.purple.border : LIGHT.purple.shadow}>
              Level B2 - Task A: Role-Play RPG
            </Typography>
            <Typography variant="body1" color={isDark ? 'rgba(255,255,255,0.8)' : 'text.secondary'} sx={{ fontSize: '1.1rem' }}>
              Role-play a marketing strategy meeting and level up your character by using the correct professional terms!
            </Typography>
          </Box>

          {/* Mission Card */}
          <Box sx={{
            bgcolor: isDark ? DARK.blue.bg : LIGHT.blue.bg,
            border: `2px solid ${isDark ? DARK.blue.border : LIGHT.blue.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${isDark ? DARK.blue.shadow : LIGHT.blue.shadow}`,
            p: 3, mb: 3,
            transition: 'transform 0.15s, box-shadow 0.15s',
            '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${isDark ? DARK.blue.shadow : LIGHT.blue.shadow}` }
          }}>
            <Typography variant="h6" gutterBottom fontWeight={700} color={isDark ? DARK.blue.border : LIGHT.blue.shadow}>
              Your Mission
            </Typography>
            <Typography variant="body1" color={isDark ? 'rgba(255,255,255,0.85)' : 'text.primary'}>
              You're in a high-level marketing strategy meeting with Ms. Mabrouki and Ryan. Your goal is to complete the dialogue using advanced marketing terminology.
            </Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{
            bgcolor: isDark ? DARK.teal.bg : LIGHT.teal.bg,
            border: `2px solid ${isDark ? DARK.teal.border : LIGHT.teal.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${isDark ? DARK.teal.shadow : LIGHT.teal.shadow}`,
            p: 3, mb: 3,
            transition: 'transform 0.15s, box-shadow 0.15s',
            '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${isDark ? DARK.teal.shadow : LIGHT.teal.shadow}` }
          }}>
            <CharacterMessage
              character="EMNA"
              message="Welcome to B2 level! This is an advanced marketing discussion. Pay attention to how professionals discuss campaign strategies using specific terminology. Use the word bank to complete your responses and level up your character!"
            />
          </Box>

          {/* Role-Play RPG Game */}
          <Box>
            <RolePlayRPGGame
              dialogueLines={DIALOGUE_LINES}
              wordBank={WORD_BANK}
              onComplete={handleGameComplete}
              characterName="Marketing Expert"
              scenario="High-Level Marketing Campaign Strategy Meeting"
            />
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
