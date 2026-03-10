import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack } from '@mui/material'
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
  {
    word: 'promotional',
    definition: 'Sell thing',
    image: `${BASE_URL}images/phase4/promotional.png`
  },
  {
    word: 'persuasive',
    definition: 'Convince buy',
    image: `${BASE_URL}images/phase4/persuasive.png`
  },
  {
    word: 'targeted',
    definition: 'Specific people',
    image: `${BASE_URL}images/phase4/targeted.png`
  },
  {
    word: 'original',
    definition: 'New idea',
    image: `${BASE_URL}images/phase4/original.png`
  },
  {
    word: 'creative',
    definition: 'Make memorable',
    image: `${BASE_URL}images/phase4/creative.png`
  },
  {
    word: 'dramatisation',
    definition: 'Video story',
    image: `${BASE_URL}images/phase4/dramatisation.png`
  },
  {
    word: 'goal',
    definition: 'What character want',
    image: `${BASE_URL}images/phase4/goal.png`
  },
  {
    word: 'obstacles',
    definition: 'Problems in way',
    image: `${BASE_URL}images/phase4/obstacles.png`
  }
]

export default function RemedialA1TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 1, context: 'remedial_a1' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameResult, setGameResult] = useState(null)

  const handleGameComplete = (result) => {
    console.log('Step 3 Remedial A1 Task A completed:', result)
    setGameCompleted(true)
    setGameResult(result)

    // Store result for Step 3
    const score = result.score || 0
    sessionStorage.setItem('remedial_step3_a1_taskA_score', score)

    // Log to backend
    logTaskCompletion(score, result.timeTaken || 0)
  }

  const logTaskCompletion = async (score, timeTaken) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      const response = await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          level: 'A1',
          task: 'A',
          step: 2,
          score: score,
          max_score: 8,
          time_taken: timeTaken
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('Step 3 Task A completion logged to backend')
      }
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    // Navigate to Task B
    navigate('/phase4/step3/remedial/a1/taskB')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
        <Typography variant="h4" gutterBottom>
          Phase 4 - Step 3: Remedial Activities
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level A1 - Task A: Term Treasure Hunt 💎
        </Typography>
        <Typography variant="body1">
          Hunt for terms from the videos and drag them to the treasure chest! Match 8 advertising terms to their simple definitions.
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="MS. MABROUKI"
          message="Welcome to the Term Treasure Hunt! You watched videos about advertising and promotion. Now, let's match the important words you learned! Drag each term from the left to its matching definition on the right. When you match correctly, you unlock gems! 💎 You have 1 minute to complete all 8 matches, then click Submit. Good luck, treasure hunter!"
        />
      </Paper>

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

      {/* Results and Navigation together */}
      {gameCompleted && gameResult && (
        <Box sx={{ mt: 4 }}>
          <Paper elevation={3} sx={{ p: 3, backgroundColor: 'grey.50' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={3}>
              {/* Score */}
              <Paper elevation={2} sx={{ p: 2, backgroundColor: 'primary.light', minWidth: 120, textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" color="primary.dark">
                  {gameResult.score} / {TERM_PAIRS.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Score
                </Typography>
              </Paper>

              {/* Next button */}
              <Button
                variant="contained"
                color="primary"
                onClick={handleContinue}
                size="large"
              >
                Next →
              </Button>
            </Stack>
          </Paper>
        </Box>
      )}
    </Box>
  )
}