import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import DebateDuelGame from '../../../../components/DebateDuelGame.jsx'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 2 - Level C1 - Task A: Debate Simulation
 * Advanced dialogue on post strategies using 6 sophisticated terms
 */

const DEBATE_LINES = [
  {
    speaker: 'Opponent',
    template: 'Why focus on Instagram posts?',
    blanks: []
  },
  {
    speaker: 'You',
    template: 'Instagram posts maximize [____] through strategic [____], compelling [____], expressive [____], clear [____], and powerful [____].',
    blanks: ['hashtag', 'viral', 'engagement', 'caption', 'emoji', 'call-to-action']
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

const WORD_BANK = shuffleArray(['hashtag', 'viral', 'engagement', 'caption', 'emoji', 'call-to-action', 'impressions', 'conversion', 'analytics', 'targeting'])

export default function Phase4_2Step2RemedialC1TaskA() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
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
  const P = isDark ? DARK : LIGHT

  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 2, interaction: 1, context: 'remedial_c1' })

  const handleGameComplete = (result) => {
    console.log('C1 Debate Simulation completed:', result)
    let correctWordsCount = 0
    if (result.completedLines) {
      result.completedLines.forEach(line => {
        if (line.validation) {
          correctWordsCount += line.validation.filter(v => v === true).length
        }
      })
    }
    console.log(`Task A Score: ${correctWordsCount} correct words out of 6`)
    sessionStorage.setItem('phase4_2_step2_remedial_c1_taskA_score', correctWordsCount)
    sessionStorage.setItem('phase4_2_step2_remedial_c1_taskA_won', result.won)
    logTaskCompletion(correctWordsCount, result.won)
    setTimeout(() => { navigate('/phase4_2/step/2/remedial/c1/taskB') }, 1500)
  }

  const logTaskCompletion = async (score, won) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 2, level: 'C1', task: 'A', score: score, max_score: 6, won: won, completed: true })
      })
    } catch (error) {
      console.error('Failed to log:', error)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>
              Debate Simulation
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.shadow }}>
              Phase 4.2 Step 2 - Level C1 - Task A
            </Typography>
            <Typography variant="body1" sx={{ color: P.orange.shadow, fontSize: '1.1rem' }}>
              Engage in an advanced debate about Instagram post strategies using sophisticated terminology!
            </Typography>
          </Box>

          {/* Instructor */}
          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage
              character="EMNA"
              message="This is C1 level - the most advanced! Use sophisticated social media post terminology like hashtag, viral potential, engagement metrics, compelling captions, expressive emojis, and effective call-to-action. Each correct term wins you a round!"
            />
          </Box>

          {/* Game */}
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
