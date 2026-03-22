import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../components/Avatar.jsx'
import SushiSpellGame from '../../components/phase5/SushiSpellGame.jsx'
import { phase6API } from '../../lib/phase6_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
}

const TARGET_WORDS = ['summary', 'report', 'evidence', 'recommend', 'achieve', 'positive', 'improve']

export default function Phase6SP1Step2Interaction3() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 2, interaction: 3, context: 'main' })
  const [gameCompleted, setGameCompleted] = useState(false)

  const cardSx = (color) => ({
    bgcolor: color.bg,
    border: `2px solid ${color.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${color.shadow}`,
    p: 3
  })

  const handleGameComplete = async (gameData) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction3', is_correct: true, score: gameData })
    setGameCompleted(true)
    sessionStorage.setItem('phase6_sp1_step2_interaction3_score', '1')
    try { await phase6API.trackGame(2, 3, gameData, 1) } catch (error) { console.error('Failed to track game:', error) }
    setTimeout(() => { navigate('/phase6/subphase/1/step/2/score') }, 2000)
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>
              Phase 6: Reflection &amp; Evaluation
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.border }}>Step 2: Explore - Interaction 3</Typography>
            <Typography variant="body1" color="text.secondary">Vocabulary Reinforcement - Sushi Spell</Typography>
          </Box>
        </motion.div>

        {/* Character Message */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <CharacterMessage
              speaker="Emna"
              message="Now revise your summary after seeing real report examples and playing the game again! Play Sushi Spell once more (2 minutes), then improve one or two sentences in your summary using a new spelled term (e.g., 'feedback', 'recommend', 'strength')."
            />
          </Box>
        </motion.div>

        {/* Game Info */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.yellow), mb: 3 }}>
            <Typography variant="body2">
              Spell these report writing words: <strong>{TARGET_WORDS.join(', ')}</strong>. You have 2 minutes!
            </Typography>
          </Box>
        </motion.div>

        {/* Game Section */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <SushiSpellGame step={2} interaction={3} targetTime={120} targetWords={TARGET_WORDS} onComplete={handleGameComplete} />
          </Box>
        </motion.div>

        {/* Completion Message */}
        {gameCompleted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), mb: 3 }}>
              <Typography variant="body2" fontWeight="bold">
                Excellent! You've completed all interactions for Step 2. Calculating your score now...
              </Typography>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
