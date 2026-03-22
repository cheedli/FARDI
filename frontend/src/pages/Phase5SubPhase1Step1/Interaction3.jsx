import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../components/Avatar.jsx'
import SushiSpellGame from '../../components/phase5/SushiSpellGame.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

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

/**
 * Phase 5 Step 1: Engage
 * Interaction 3: Sushi Spell Game
 * Play individually for 2 minutes to spell problem-solving words
 */

const TARGET_WORDS = ['problem', 'cancel', 'change', 'solution', 'sorry', 'alternative', 'fix', 'urgent']

export default function Phase5Step1Interaction3() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const P = isDark ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 1, interaction: 3, context: 'main' })

  const handleGameComplete = (gameData) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction3', is_correct: true, score: gameData })
    // Game completion is tracked automatically
    // Navigate to score calculation after a short delay
    setTimeout(() => {
      // Calculate step score and route to remedial if needed
      navigate('/phase5/subphase/1/step/1/score')
    }, 2000)
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: P.blue.bg,
            border: `2px solid ${P.blue.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h4" gutterBottom fontWeight={700} color={P.blue.border}>
              Phase 5: Execution &amp; Problem-Solving
            </Typography>
            <Typography variant="h5" gutterBottom color={P.blue.shadow}>
              Step 1: Engage - Interaction 3
            </Typography>
            <Typography variant="body1" color={isDark ? 'rgba(255,255,255,0.7)' : 'text.secondary'}>
              Practice spelling problem-solving vocabulary
            </Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{
            bgcolor: P.teal.bg,
            border: `2px solid ${P.teal.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3,
          }}>
            <CharacterMessage
              speaker="Emna"
              message="To practise more problem-solving terms, let's play another quick individual game! Play 'Sushi Spell' for 2 minutes to spell problem-solving words. Try longer words like 'alternative' or 'solution' for higher scores!"
            />
          </Box>

          {/* Game Component */}
          <SushiSpellGame
            step={1}
            interaction={3}
            targetTime={120}
            targetWords={TARGET_WORDS}
            onComplete={handleGameComplete}
          />

        </motion.div>
      </Container>
    </Box>
  )
}
