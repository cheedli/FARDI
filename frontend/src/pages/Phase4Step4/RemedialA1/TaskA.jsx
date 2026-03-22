import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container, useTheme } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import DragDropMatchingGame from '../../../components/DragDropMatchingGame.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'
import { motion } from 'framer-motion'

/**
 * Phase 4 Step 4 - Level A1 - Task A: Drag and Drop Matching
 * Match 8 terms to definitions for writing practice, gamified as "Term Treasure Hunt"
 */

const BASE_URL = import.meta.env.BASE_URL || '/'

const VOCABULARY_PAIRS = [
  {
    word: 'gatefold',
    definition: 'Fold space',
    image: `${BASE_URL}images/phase4/gatefold.png`
  },
  {
    word: 'lettering',
    definition: 'Text style',
    image: `${BASE_URL}images/phase4/lettering.png`
  },
  {
    word: 'animation',
    definition: 'Move picture',
    image: `${BASE_URL}images/phase4/animation.png`
  },
  {
    word: 'jingle',
    definition: 'Short song',
    image: `${BASE_URL}images/phase4/jingle.png`
  },
  {
    word: 'dramatisation',
    definition: 'Story act',
    image: `${BASE_URL}images/phase4/dramatisation.png`
  },
  {
    word: 'sketch',
    definition: 'Plan draw',
    image: `${BASE_URL}images/phase4/sketch.png`
  },
  {
    word: 'clip',
    definition: 'Short part',
    image: `${BASE_URL}images/phase4/clip.png`
  },
  {
    word: 'storytelling',
    definition: 'Tell story',
    image: `${BASE_URL}images/phase4/storytelling.png`
  }
]

export default function Phase4Step4RemedialA1TaskA() {
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

  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 1, context: 'remedial_a1' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameResult, setGameResult] = useState(null)

  const handleGameComplete = (result) => {
    console.log('Phase 4 Step 4 - A1 Task A completed:', result)
    setGameCompleted(true)
    setGameResult(result)

    // Store result
    const score = result.score || 0
    sessionStorage.setItem('phase4_step4_remedial_a1_taskA_score', score)

    // Log to backend
    logTaskCompletion(score, result.timeTaken || 0)
  }

  const logTaskCompletion = async (score, timeTaken) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      const response = await fetch('/api/phase4/step4/remedial/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          level: 'A1',
          task: 'A',
          score: score,
          max_score: 8,
          time_taken: timeTaken
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('[Phase 4 Step 4] A1 Task A completion logged to backend')
      }
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    // Navigate to Task B
    navigate('/phase4/step/4/remedial/a1/taskB')
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>
              Phase 4 Step 4: Apply - Remedial Practice
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.shadow }}>
              Level A1 - Task A: Term Treasure Hunt
            </Typography>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}>
              Hunt and drag terms to match definitions - unlock gems by matching correctly!
            </Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3,
          }}>
            <CharacterMessage
              speaker="MS. MABROUKI"
              message="Let's hunt for vocabulary treasures! Drag each term from the left to its matching definition on the right. Match all 8 pairs correctly to unlock gems. You have 1 minute - good luck!"
            />
          </Box>

          {/* Drag and Drop Game */}
          <Box sx={{
            bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
            p: 3, mb: 3,
          }}>
            <DragDropMatchingGame
              pairs={VOCABULARY_PAIRS}
              duration={60}
              onComplete={handleGameComplete}
            />
          </Box>

          {/* Navigation - Show Next button after game is completed */}
          {gameCompleted && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
              <Box component="button" onClick={handleContinue} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: 'pointer', color: P.green.shadow,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` }
              }}>
                Next: Task B →
              </Box>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
