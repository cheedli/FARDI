import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import DragDropMatchingGame from '../../../components/DragDropMatchingGame.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

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
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
        <Typography variant="h4" gutterBottom>
          Phase 4 Step 4: Apply - Remedial Practice
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level A1 - Task A: Term Treasure Hunt
        </Typography>
        <Typography variant="body1">
          Hunt and drag terms to match definitions - unlock gems by matching correctly!
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="MS. MABROUKI"
          message="Let's hunt for vocabulary treasures! Drag each term from the left to its matching definition on the right. Match all 8 pairs correctly to unlock gems. You have 1 minute - good luck!"
        />
      </Paper>

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
            <Button
              variant="contained"
              color="success"
              onClick={handleContinue}
              size="large"
            >
              Next: Task B →
            </Button>
          </Stack>
        )}
      </Box>
    </Box>
  )
}
