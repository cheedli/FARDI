import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import ChatChallengeGame from '../../../components/ChatChallengeGame.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Level B1 - Task A: Gap Fill Dialogue
 * Complete dialogue about promotion methods with reasoning
 */

const DIALOGUE_LINES = [
  {
    speaker: 'SKANDER',
    template: 'What about poster?',
    blanks: [] // No blanks
  },
  {
    speaker: 'You',
    template: 'Poster good [____] [____].',
    blanks: ['because', 'eye-catcher']
  },
  {
    speaker: 'Emna',
    template: 'Or video [____].',
    blanks: ['feature']
  },
  {
    speaker: 'You',
    template: 'Video reaches [____] with [____].',
    blanks: ['more', 'slogan']
  }
]

// Randomize the word bank order each time
const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const WORD_BANK = shuffleArray([
  'because',
  'eye-catcher',
  'feature',
  'more',
  'slogan'
])

export default function RemedialB1TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 1, context: 'remedial_b1' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameResult, setGameResult] = useState(null)

  const handleGameComplete = (result) => {
    console.log('B1 Gap Fill completed:', result)
    setGameCompleted(true)
    setGameResult(result)

    // Store result
    const score = result.score || 0
    sessionStorage.setItem('remedial_b1_taskA_score', score)

    // Log to backend
    logTaskCompletion(score)

    // Auto-navigate to Task B after 2 seconds
    setTimeout(() => {
      navigate('/phase4/remedial/b1/taskB')
    }, 2000)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      const response = await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          level: 'B1',
          task: 'A',
          score: score,
          max_score: 5, // 5 total blanks across all lines
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
    // Navigate to Task B
    navigate('/phase4/remedial/b1/taskB')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'warning.light', color: 'warning.contrastText' }}>
        <Typography variant="h4" gutterBottom>
          Marketing & Promotion Practice
        </Typography>
        <Typography variant="h5" gutterBottom>
          Task A: Dialogue Completion
        </Typography>
        <Typography variant="body1">
          Complete the conversation about promotion methods by filling in the gaps!
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="EMNA"
          message="Let's discuss different promotion methods! Complete the dialogue by choosing the right words from the word bank. Think about why each method works."
        />
      </Paper>

      {/* Gap Fill Dialogue Game */}
      {!gameCompleted && (
        <Box>
          <ChatChallengeGame
            dialogueLines={DIALOGUE_LINES}
            wordBank={WORD_BANK}
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
            Continue to Next Task
          </Button>
        )}
      </Stack>
    </Box>
  )
}
