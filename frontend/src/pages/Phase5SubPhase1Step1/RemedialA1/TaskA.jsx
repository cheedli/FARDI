import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import DragDropMatchingGame from '../../../components/DragDropMatchingGame.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 5 Step 1 - Level A1 - Task A: Drag and Drop Matching
 * Match 8 problem-solving words to pictures/definitions, gamified as "Match Race"
 * Race timer to match before "explosion"; correct for bonus points
 */

const VOCABULARY_PAIRS = [
  {
    word: 'problem',
    definition: 'Sad face picture',
    image: null // Will use emoji or simple representation
  },
  {
    word: 'cancel',
    definition: 'Cross mark',
    image: null
  },
  {
    word: 'change',
    definition: 'Arrow switch',
    image: null
  },
  {
    word: 'solution',
    definition: 'Light bulb',
    image: null
  },
  {
    word: 'sorry',
    definition: 'Sad face + words',
    image: null
  },
  {
    word: 'alternative',
    definition: 'Two choices',
    image: null
  },
  {
    word: 'fix',
    definition: 'Tools picture',
    image: null
  },
  {
    word: 'urgent',
    definition: 'Clock + exclamation',
    image: null
  }
]

export default function Phase5Step1RemedialA1TaskA() {
  const navigate = useNavigate()
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
    // Navigate to Task B
    navigate('/phase5/subphase/1/step/1/remedial/a1/task/b')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 5: Execution & Problem-Solving
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 1: Remedial Practice - Level A1
        </Typography>
        <Typography variant="h6" gutterBottom>
          Task A: Match Race
        </Typography>
        <Typography variant="body1">
          Match 8 problem-solving words to pictures/definitions. Race against the timer!
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Welcome to Match Race! Drag each problem-solving word from the left to its matching picture/definition on the right. Match all 8 pairs correctly before time runs out to get bonus points! You have 1 minute - good luck!"
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
