import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import ProposalBuilderGame from '../../../components/ProposalBuilderGame.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Level B1 - Task B: Proposal Builder
 * Write proposals about promotion methods with reasons
 */

const QUESTIONS = [
  { question: 'Poster with slogan?' },
  { question: 'Video feature - why?' },
  { question: 'Billboard placement?' },
  { question: 'TV commercial timing?' },
  { question: 'Social media advertising?' },
  { question: 'Eye-catching poster design?' },
  { question: 'Video advertisement length?' },
  { question: 'Memorable slogan creation?' }
]

export default function RemedialB1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 2, context: 'remedial_b1' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameResult, setGameResult] = useState(null)

  const handleGameComplete = (result) => {
    console.log('Proposal Builder completed:', result)
    setGameCompleted(true)
    setGameResult(result)

    // Store result
    const score = result.score || 0
    sessionStorage.setItem('remedial_b1_taskB_score', score)

    // Log to backend
    logTaskCompletion(score)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score: score })
    try {
      const response = await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          level: 'B1',
          task: 'B',
          score: score,
          max_score: QUESTIONS.length,
          completed: true
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('Task B completion logged to backend')
      }
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    // Navigate to Task C
    navigate('/phase4/remedial/b1/taskC')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'warning.light', color: 'warning.contrastText' }}>
        <Typography variant="h4" gutterBottom>
          Marketing & Promotion Practice
        </Typography>
        <Typography variant="h5" gutterBottom>
          Task B: Proposal Builder
        </Typography>
        <Typography variant="body1">
          Write promotion proposals with clear reasons. Build them like puzzle pieces to reveal the picture!
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="EMNA"
          message="Excellent work on Task A! Now let's write detailed proposals. For each question, explain your promotion idea and why it works. Use 'because' to give your reasons. Each completed proposal reveals part of a picture!"
        />
      </Paper>

      {/* Proposal Builder Game */}
      {!gameCompleted && (
        <Box>
          <ProposalBuilderGame
            questions={QUESTIONS}
            onComplete={handleGameComplete}
          />
        </Box>
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
            Complete and Continue
          </Button>
        )}
      </Stack>
    </Box>
  )
}
