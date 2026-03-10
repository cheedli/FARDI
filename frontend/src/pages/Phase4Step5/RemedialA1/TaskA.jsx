import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import DragDropMatchingGame from '../../../components/DragDropMatchingGame.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 5 - Level A1 - Task A: Drag and Drop Matching
 * Match 8 common spelling mistakes to corrections for poster/video terms
 * Gamified as "Spelling Rescue" - Rescue words by matching before "errors explode"
 */

const BASE_URL = import.meta.env.BASE_URL || '/'

const SPELLING_PAIRS = [
  {
    word: 'gatfold',
    definition: 'gatefold',
    image: `${BASE_URL}images/phase4/gatefold.png`
  },
  {
    word: 'letering',
    definition: 'lettering',
    image: `${BASE_URL}images/phase4/lettering.png`
  },
  {
    word: 'animasion',
    definition: 'animation',
    image: `${BASE_URL}images/phase4/animation.png`
  },
  {
    word: 'jingel',
    definition: 'jingle',
    image: `${BASE_URL}images/phase4/jingle.png`
  },
  {
    word: 'dramatisation',
    definition: 'dramatisation',
    image: `${BASE_URL}images/phase4/dramatisation.png`
  },
  {
    word: 'clip',
    definition: 'clip',
    image: `${BASE_URL}images/phase4/clip.png`
  },
  {
    word: 'slogon',
    definition: 'slogan',
    image: `${BASE_URL}images/phase4/slogan.png`
  },
  {
    word: 'eyecatcher',
    definition: 'eye-catcher',
    image: `${BASE_URL}images/phase4/eye-catcher.png`
  }
]

export default function Phase4Step5RemedialA1TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 1, context: 'remedial_a1' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameResult, setGameResult] = useState(null)

  const handleGameComplete = (result) => {
    console.log('Phase 4 Step 5 - A1 Task A completed:', result)
    setGameCompleted(true)
    setGameResult(result)

    // Store result
    const score = result.score || 0
    sessionStorage.setItem('phase4_step5_remedial_a1_taskA_score', score)

    // Log to backend
    logTaskCompletion(score, result.timeTaken || 0)
  }

  const logTaskCompletion = async (score, timeTaken) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      const response = await fetch('/api/phase4/step5/remedial/log', {
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
        console.log('[Phase 4 Step 5] A1 Task A completion logged to backend')
      }
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    // Navigate to Task B
    navigate('/phase4/step/5/remedial/a1/taskB')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: '#e74c3c', color: 'white' }}>
        <Typography variant="h4" gutterBottom>
          Phase 4 Step 5: Evaluate - Remedial Practice
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level A1 - Task A: Spelling Rescue
        </Typography>
        <Typography variant="body1">
          Rescue words by matching spelling mistakes to corrections before errors explode!
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="LILIA"
          message="Welcome to Spelling Rescue! Drag each misspelled word from the left to its correct spelling on the right. Match all 8 pairs correctly to save the words! Correct matches earn you points. You have 1 minute - go!"
        />
      </Paper>

      {/* Drag and Drop Game */}
      <Box>
        <DragDropMatchingGame
          pairs={SPELLING_PAIRS}
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
