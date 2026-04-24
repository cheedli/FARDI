import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import DebateDuelGame from '../../../components/DebateDuelGame.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const DEBATE_LINES = [
  {
    speaker: 'Opponent',
    template: 'Poster best?',
    blanks: []
  },
  {
    speaker: 'You',
    template: 'Poster for [____] with [____]; video for [____] [____].',
    blanks: ['geotargeting', 'slogan', 'viral', 'remarketing']
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
  'surrogate',
  'guerilla',
  'remarketing',
  'geotargeting',
  'infomercial',
  'viral',
  'slogan'
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

export default function RemedialC1TaskA() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase4/remedial/c1/taskB') }, [])
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 1, context: 'remedial_c1' })

  const handleGameComplete = (result) => {
    console.log('C1 Debate Duel completed:', result)

    let correctWordsCount = 0
    if (result.completedLines) {
      result.completedLines.forEach(line => {
        if (line.validation) {
          correctWordsCount += line.validation.filter(v => v === true).length
        }
      })
    }

    console.log(`Task A Score: ${correctWordsCount} correct words out of 4`)

    sessionStorage.setItem('remedial_c1_taskA_score', correctWordsCount)
    sessionStorage.setItem('remedial_c1_taskA_won', result.won)

    console.log('✅ Stored in sessionStorage:', {
      score: sessionStorage.getItem('remedial_c1_taskA_score'),
      won: sessionStorage.getItem('remedial_c1_taskA_won')
    })

    logTaskCompletion(correctWordsCount, result.won)

    setTimeout(() => {
      navigate('/phase4/remedial/c1/taskB')
    }, 1500)
  }

  const logTaskCompletion = async (score, won) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: 'C1',
          task: 'A',
          score: score,
          max_score: 4,
          won: won,
          completed: true
        })
      })
    } catch (error) {
      console.error('Failed to log:', error)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: isDark ? DARK.pageBg : LIGHT.pageBg, py: 4 }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: isDark ? DARK.red.bg : LIGHT.red.bg,
            border: `2px solid ${isDark ? DARK.red.border : LIGHT.red.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${isDark ? DARK.red.shadow : LIGHT.red.shadow}`,
            p: 4, mb: 3,
            transition: 'transform 0.15s, box-shadow 0.15s',
            '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${isDark ? DARK.red.shadow : LIGHT.red.shadow}` }
          }}>
            <Typography variant="h4" gutterBottom fontWeight={700} color={isDark ? DARK.red.border : LIGHT.red.shadow}>
              Debate Duel
            </Typography>
            <Typography variant="h6" gutterBottom fontWeight={700} color={isDark ? DARK.red.border : LIGHT.red.shadow}>
              Level C1 - Task A: Advanced Marketing Debate
            </Typography>
            <Typography variant="body1" color={isDark ? 'rgba(255,255,255,0.8)' : 'text.secondary'} sx={{ fontSize: '1.1rem' }}>
              Duel with an AI opponent! Win rounds by using advanced marketing terms correctly.
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
              message="This is C1 level - the most advanced! Use sophisticated marketing terminology like geotargeting, remarketing, and viral strategy. Each correct term wins you a round!"
            />
          </Box>

          <Box>
            <DebateDuelGame
              debateLines={DEBATE_LINES}
              wordBank={WORD_BANK}
              onComplete={handleGameComplete}
            />
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
