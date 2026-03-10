import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import SimpleLineMatchingGame from '../../../../components/SimpleLineMatchingGame.jsx'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 5 - Level A2 - Task A: Match Master
 * Timed matching game for social media spelling terms
 */

const MATCHING_PAIRS = [
  {
    term: 'hashteg',
    example: 'hashtag'
  },
  {
    term: 'capshun',
    example: 'caption'
  },
  {
    term: 'emogi',
    example: 'emoji'
  },
  {
    term: 'taged',
    example: 'tagged'
  },
  {
    term: 'freind',
    example: 'friend'
  },
  {
    term: 'liek',
    example: 'like'
  },
  {
    term: 'shaer',
    example: 'share'
  },
  {
    term: 'coment',
    example: 'comment'
  }
]

export default function Phase4_2Step5RemedialA2TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 1, context: 'remedial_a2' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameResult, setGameResult] = useState(null)

  const handleGameComplete = (result) => {
    console.log('Match Master completed:', result)
    setGameCompleted(true)
    setGameResult(result)

    // Store result
    const score = result.score || 0
    sessionStorage.setItem('phase4_2_step5_remedial_a2_taskA_score', score)

    // Log to backend
    logTaskCompletion(score, result.timeElapsed)
  }

  const logTaskCompletion = async (score, timeElapsed) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      const response = await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          phase: '4.2',
          step: 5,
          level: 'A2',
          task: 'A',
          score: score,
          max_score: MATCHING_PAIRS.length,
          time_taken: timeElapsed,
          completed: true
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('Task A completion logged to backend')
      }
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/app/phase4_2/step/5/remedial/a2/taskb')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 4.2 - Step 5: Remedial Activities
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level A2 - Task A: Spelling Match Master
        </Typography>
        <Typography variant="body1">
          Match spelling mistakes with their correct forms as fast as you can!
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Welcome to Spelling Match Master! Match each spelling mistake on the left with its correct version on the right by drawing lines. Click a mistake, then click its correct spelling. Watch the line appear! The timer starts on your first click. Ready, set, go!"
        />
      </Paper>

      {/* Simple Line Matching Game */}
      {!gameCompleted && (
        <Box>
          <SimpleLineMatchingGame
            pairs={MATCHING_PAIRS}
            onComplete={handleGameComplete}
            leftTitle="Spelling Mistakes"
            rightTitle="Correct Spellings"
            leftColor="#ffebee"
            rightColor="#e8f5e9"
          />
        </Box>
      )}

      {/* Navigation */}
      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
        {gameCompleted && (
          <Button
            variant="contained"
            size="large"
            onClick={handleContinue}
            sx={{
              py: 2,
              px: 6,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
              }
            }}
          >
            Continue to Task B →
          </Button>
        )}
      </Stack>
    </Box>
  )
}
