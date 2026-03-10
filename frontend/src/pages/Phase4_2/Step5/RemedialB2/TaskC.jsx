import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import SimpleLineMatchingGame from '../../../../components/SimpleLineMatchingGame.jsx'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 5 - Level B2 - Task C: Match Master
 * Timed matching game for error types
 */

const MATCHING_PAIRS = [
  {
    term: '"hashteg"',
    example: 'Spelling error'
  },
  {
    term: '"We has"',
    example: 'Grammar error'
  },
  {
    term: '"very good"',
    example: 'Vocabulary'
  },
  {
    term: '"you coming?"',
    example: 'Tone'
  },
  {
    term: '"Music food dance"',
    example: 'Coherence'
  },
  {
    term: '"#Festivel"',
    example: 'Hashtag error'
  },
  {
    term: '":-)"',
    example: 'Emoji'
  },
  {
    term: '"Click here"',
    example: 'CTA'
  }
]

export default function Phase4_2Step5RemedialB2TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 3, context: 'remedial_b2' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameResult, setGameResult] = useState(null)

  const handleGameComplete = (result) => {
    console.log('Match Master completed:', result)
    setGameCompleted(true)
    setGameResult(result)

    // Store result
    const score = result.score || 0
    sessionStorage.setItem('phase4_2_step5_remedial_b2_taskC_score', score)

    // Log to backend
    logTaskCompletion(score, result.timeElapsed)
  }

  const logTaskCompletion = async (score, timeElapsed) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: score })
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
          level: 'B2',
          task: 'C',
          score: score,
          max_score: MATCHING_PAIRS.length,
          time_taken: timeElapsed,
          completed: true
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('Task C completion logged to backend')
      }
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/app/phase4_2/step/5/remedial/b2/taskd')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 4.2 - Step 5: Remedial Activities
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level B2 - Task C: Error Type Match Master
        </Typography>
        <Typography variant="body1">
          Match error examples with their error types as fast as you can!
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Final challenge! Match each error example with its error type by drawing lines. Click an error on the left, then click its matching type on the right. Watch the line appear! The timer starts on your first click. This will help you identify different kinds of mistakes in social media posts. Go!"
        />
      </Paper>

      {/* Simple Line Matching Game */}
      {!gameCompleted && (
        <Box>
          <SimpleLineMatchingGame
            pairs={MATCHING_PAIRS}
            onComplete={handleGameComplete}
            leftTitle="Error Examples"
            rightTitle="Error Types"
            leftColor="#ffebee"
            rightColor="#e3f2fd"
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
              background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #c0392b 0%, #a93226 100%)'
              }
            }}
          >
            Continue to Task D →
          </Button>
        )}
      </Stack>
    </Box>
  )
}
