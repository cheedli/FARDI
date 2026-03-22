import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import DragDropMatchingGame from '../../../components/DragDropMatchingGame.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

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
 * Phase 5 Step 1 - Level A1 - Task A: Drag and Drop Matching
 * Match 8 problem-solving words to pictures/definitions, gamified as "Match Race"
 * Race timer to match before "explosion"; correct for bonus points
 */

const VOCABULARY_PAIRS = [
  { word: 'problem', definition: 'Sad face picture', image: null },
  { word: 'cancel', definition: 'Cross mark', image: null },
  { word: 'change', definition: 'Arrow switch', image: null },
  { word: 'solution', definition: 'Light bulb', image: null },
  { word: 'sorry', definition: 'Sad face + words', image: null },
  { word: 'alternative', definition: 'Two choices', image: null },
  { word: 'fix', definition: 'Tools picture', image: null },
  { word: 'urgent', definition: 'Clock + exclamation', image: null }
]

export default function Phase5Step1RemedialA1TaskA() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const P = isDark ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 1, interaction: 1, context: 'remedial_a1' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameResult, setGameResult] = useState(null)

  const handleGameComplete = async (result) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: result })
    console.log('Phase 5 Step 1 - A1 Task A completed:', result)
    setGameCompleted(true)
    setGameResult(result)

    // Store result
    const score = result.score || 0
    sessionStorage.setItem('phase5_step1_remedial_a1_taskA_score', score.toString())

    // Log to backend
    try {
      await phase5API.logRemedialActivity(1, 'A1', 'A', score, 8, result.timeTaken || 0)
      console.log('[Phase 5 Step 1] A1 Task A completion logged to backend')
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/1/step/1/remedial/a1/task/b')
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: P.orange.bg,
            border: `2px solid ${P.orange.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.orange.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h4" gutterBottom fontWeight={700} color={P.orange.border}>
              Phase 5: Execution &amp; Problem-Solving
            </Typography>
            <Typography variant="h5" gutterBottom color={P.orange.shadow}>
              Step 1: Remedial Practice - Level A1
            </Typography>
            <Typography variant="h6" gutterBottom color={P.orange.shadow}>
              Task A: Match Race
            </Typography>
            <Typography variant="body1" color={isDark ? 'rgba(255,255,255,0.7)' : 'text.secondary'}>
              Match 8 problem-solving words to pictures/definitions. Race against the timer!
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
              speaker="Ms. Mabrouki"
              message="Welcome to Match Race! Drag each problem-solving word from the left to its matching picture/definition on the right. Match all 8 pairs correctly before time runs out to get bonus points! You have 1 minute - good luck!"
            />
          </Box>

          {/* Drag and Drop Game */}
          <Box>
            <DragDropMatchingGame
              pairs={VOCABULARY_PAIRS}
              duration={60}
              onComplete={handleGameComplete}
            />

            {/* Navigation - Show Next button after game is completed */}
            {gameCompleted && (
              <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
                <Box
                  component="button"
                  onClick={handleContinue}
                  sx={{
                    bgcolor: P.green.bg,
                    border: `2px solid ${P.green.border}`,
                    borderRadius: '12px',
                    boxShadow: `3px 3px 0 ${P.green.shadow}`,
                    px: 4, py: 1.5,
                    fontWeight: 700, fontSize: '1rem',
                    cursor: 'pointer',
                    color: P.green.shadow,
                    transition: 'transform 0.15s, box-shadow 0.15s',
                    '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                  }}
                >
                  Next: Task B →
                </Box>
              </Stack>
            )}
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
