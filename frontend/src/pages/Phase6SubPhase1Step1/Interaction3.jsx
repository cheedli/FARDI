import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../components/Avatar.jsx'
import SushiSpellGame from '../../components/phase5/SushiSpellGame.jsx'
import { phase6API } from '../../lib/phase6_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 1: Engage
 * Interaction 3: Sushi Spell Game
 * Practise spelling key evaluation vocabulary
 */

const LIGHT = {
  pageBg: '#FFFDE7',
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
}

const TARGET_WORDS = [
  'success', 'challenge', 'feedback', 'improve', 'achievement',
  'recommend', 'summary', 'positive'
]

export default function Phase6SP1Step1Interaction3() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 1, interaction: 3, context: 'main' })

  const handleGameComplete = async (gameData) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction3', is_correct: true, score: gameData })
    // Store score in sessionStorage
    const score = gameData.score !== undefined ? gameData.score : (gameData.completed ? 1 : 0)
    sessionStorage.setItem('phase6_sp1_step1_interaction3_score', score.toString())

    // Track game completion on backend
    try {
      await phase6API.trackGame(1, 3, gameData, 1)
    } catch (error) {
      console.error('Failed to track game:', error)
    }

    // Navigate to score calculation after a short delay
    setTimeout(() => {
      navigate('/phase6/subphase/1/step/1/score')
    }, 2000)
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{
            bgcolor: P.blue.bg,
            border: `2px solid ${P.blue.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3,
            mb: 3
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>
              Phase 6: Reflection and Evaluation
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.border }}>
              Step 1: Engage - Interaction 3
            </Typography>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}>
              Sushi Spell - Practise spelling evaluation vocabulary
            </Typography>
          </Box>
        </motion.div>

        {/* Instructor Message */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <Box sx={{
            bgcolor: P.teal.bg,
            border: `2px solid ${P.teal.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3,
            mb: 3
          }}>
            <CharacterMessage
              speaker="Emna"
              message="To practise more report words, let's play another quick individual game! Play 'Sushi Spell' individually for 2 minutes and spell reflection/reporting words. Try longer words like 'achievement' or 'recommend'!"
            />
          </Box>
        </motion.div>

        {/* Game Component */}
        <SushiSpellGame
          step={1}
          interaction={3}
          targetTime={120}
          targetWords={TARGET_WORDS}
          onComplete={handleGameComplete}
        />
      </Container>
    </Box>
  )
}
