import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import DragDropMatchingGame from '../../../components/DragDropMatchingGame.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 3 - Remedial A1 - Task A: Term Treasure Hunt
 * Drag and drop matching game for advertising terminology
 * Score: +1 for each correct match (8 total)
 */

const BASE_URL = import.meta.env.BASE_URL || '/'

const TERM_PAIRS = [
  { word: 'promotional', definition: 'Sell thing', image: `${BASE_URL}images/phase4/promotional.png` },
  { word: 'persuasive', definition: 'Convince buy', image: `${BASE_URL}images/phase4/persuasive.png` },
  { word: 'targeted', definition: 'Specific people', image: `${BASE_URL}images/phase4/targeted.png` },
  { word: 'original', definition: 'New idea', image: `${BASE_URL}images/phase4/original.png` },
  { word: 'creative', definition: 'Make memorable', image: `${BASE_URL}images/phase4/creative.png` },
  { word: 'dramatisation', definition: 'Video story', image: `${BASE_URL}images/phase4/dramatisation.png` },
  { word: 'goal', definition: 'What character want', image: `${BASE_URL}images/phase4/goal.png` },
  { word: 'obstacles', definition: 'Problems in way', image: `${BASE_URL}images/phase4/obstacles.png` }
]

export default function RemedialA1TaskA() {
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

  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 1, context: 'remedial_a1' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameResult, setGameResult] = useState(null)

  const handleGameComplete = (result) => {
    console.log('Step 3 Remedial A1 Task A completed:', result)
    setGameCompleted(true)
    setGameResult(result)

    const score = result.score || 0
    sessionStorage.setItem('remedial_step3_a1_taskA_score', score)
    logTaskCompletion(score, result.timeTaken || 0)
  }

  const logTaskCompletion = async (score, timeTaken) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      const response = await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ level: 'A1', task: 'A', step: 2, score: score, max_score: 8, time_taken: timeTaken })
      })
      const data = await response.json()
      if (data.success) console.log('Step 3 Task A completion logged to backend')
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase4/step3/remedial/a1/taskB')
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>
              Phase 4 - Step 3: Remedial Activities
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.shadow }}>
              Level A1 - Task A: Term Treasure Hunt
            </Typography>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}>
              Hunt for terms from the videos and drag them to the treasure chest! Match 8 advertising terms to their simple definitions.
            </Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3,
          }}>
            <CharacterMessage
              character="MS. MABROUKI"
              message="Welcome to the Term Treasure Hunt! You watched videos about advertising and promotion. Now, let's match the important words you learned! Drag each term from the left to its matching definition on the right. When you match correctly, you unlock gems! You have 1 minute to complete all 8 matches, then click Submit. Good luck, treasure hunter!"
            />
          </Box>

          {/* Drag and Drop Game */}
          {!gameCompleted && (
            <Box>
              <DragDropMatchingGame
                pairs={TERM_PAIRS}
                duration={60}
                onComplete={handleGameComplete}
              />
            </Box>
          )}

          {/* Results */}
          {gameCompleted && gameResult && (
            <Box sx={{ mt: 4 }}>
              <Box sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
                p: 3,
              }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={3}>
                  <Box sx={{
                    bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
                    borderRadius: '12px', boxShadow: `3px 3px 0 ${P.yellow.shadow}`,
                    p: 2, minWidth: 120, textAlign: 'center',
                  }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: P.yellow.shadow }}>
                      {gameResult.score} / {TERM_PAIRS.length}
                    </Typography>
                    <Typography variant="caption" sx={{ color: P.yellow.shadow, opacity: 0.8 }}>
                      Score
                    </Typography>
                  </Box>

                  <Box component="button" onClick={handleContinue} sx={{
                    bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                    borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
                    px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                    cursor: 'pointer', color: P.blue.shadow,
                    '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` },
                    '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.blue.shadow}` },
                  }}>
                    Next →
                  </Box>
                </Stack>
              </Box>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
