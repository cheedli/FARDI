import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import SimpleLineMatchingGame from '../../../components/SimpleLineMatchingGame.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 3 Step 1 - Interaction 1: Vocabulary Matching
 * Timed matching game for sponsorship and budgeting terms
 */

const MATCHING_PAIRS = [
  {
    term: 'sponsor',
    example: 'Person or company giving money'
  },
  {
    term: 'budget',
    example: 'Plan for spending money'
  },
  {
    term: 'cost',
    example: 'Price of something'
  },
  {
    term: 'funding',
    example: 'Money for a project'
  },
  {
    term: 'expense',
    example: 'Money that is spent'
  },
  {
    term: 'donation',
    example: 'Money given for free'
  },
  {
    term: 'ticket',
    example: 'Paid entry to event'
  },
  {
    term: 'profit',
    example: 'Money left after costs'
  }
]

export default function Phase3Step1Interaction1() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 1, interaction: 1, context: 'main' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameResult, setGameResult] = useState(null)

  const handleGameComplete = (result) => {
    console.log('Vocabulary Matching completed:', result)
    setGameCompleted(true)
    setGameResult(result)

    // Store result
    const score = result.score || 0
    const timeElapsed = result.timeElapsed || 0
    sessionStorage.setItem('phase3_step1_int1_score', score)
    sessionStorage.setItem('phase3_step1_int1_time', timeElapsed)

    // Log to backend
    logTaskCompletion(score, timeElapsed)
  }

  const logTaskCompletion = async (score, timeElapsed) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction1', is_correct: true, score: score })
    try {
      const response = await fetch('/api/phase3/interaction/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          step: 1,
          interaction: 1,
          score: score,
          max_score: MATCHING_PAIRS.length,
          time_taken: timeElapsed,
          completed: true
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('Interaction 1 completion logged to backend')
      }
    } catch (error) {
      console.error('Failed to log interaction completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/app/phase3/step/1/interaction/2')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'success.light', color: 'success.contrastText' }}>
        <Typography variant="h4" gutterBottom>
          Sponsorship & Budgeting Practice
        </Typography>
        <Typography variant="h5" gutterBottom>
          Interaction 1: Vocabulary Matching
        </Typography>
        <Typography variant="body1">
          Match financial terms with their meanings as fast as you can!
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="SKANDER"
          message="Welcome to Phase 3! Let's start with vocabulary. Match each sponsorship and budgeting term with its meaning by drawing lines. Click a term on the left, then click its matching definition on the right. The timer starts on your first click. Ready? Go!"
        />
      </Paper>

      {/* Simple Line Matching Game */}
      {!gameCompleted && (
        <Box>
          <SimpleLineMatchingGame
            pairs={MATCHING_PAIRS}
            onComplete={handleGameComplete}
          />
        </Box>
      )}

      {/* Results Display */}
      {gameCompleted && gameResult && (
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mt: 3,
            backgroundColor: 'success.lighter',
            border: 2,
            borderColor: 'success.main'
          }}
        >
          <Typography variant="h4" gutterBottom textAlign="center" color="success.dark">
            🎉 Great Job!
          </Typography>

          <Box sx={{ my: 3 }}>
            <Typography variant="h5" gutterBottom textAlign="center">
              Your Score
            </Typography>

            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
              my: 2
            }}>
              <Typography variant="h2" fontWeight="bold" color="success.main">
                {gameResult.score}
              </Typography>
              <Typography variant="h3" color="text.secondary">
                /
              </Typography>
              <Typography variant="h2" fontWeight="bold" color="text.secondary">
                {MATCHING_PAIRS.length}
              </Typography>
            </Box>

            <Typography variant="h6" textAlign="center" color="text.secondary">
              Correct Matches
            </Typography>
          </Box>

          <Box sx={{ my: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              ⏱️ Time Taken: <strong>{gameResult.timeElapsed ? `${gameResult.timeElapsed.toFixed(1)}s` : 'N/A'}</strong>
            </Typography>
          </Box>

          {gameResult.score === MATCHING_PAIRS.length && (
            <Typography variant="h6" textAlign="center" color="success.dark" sx={{ mt: 2 }}>
              ✨ Perfect Score! Excellent work!
            </Typography>
          )}
        </Paper>
      )}

      {/* Navigation */}
      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
        {gameCompleted && (
          <Button
            variant="contained"
            color="success"
            onClick={handleContinue}
            size="large"
          >
            Continue to Next Activity
          </Button>
        )}
      </Stack>
    </Box>
  )
}
