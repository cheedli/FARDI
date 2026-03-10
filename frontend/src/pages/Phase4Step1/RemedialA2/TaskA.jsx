import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Stack, Paper, Typography, LinearProgress } from '@mui/material'
import { PhoneCallSim } from '../../../components/exercises'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Level A2 - Task A: Chat Challenge (Dialogue Completion)
 * Complete dialogue about promotion ideas in WhatsApp messenger style
 * No navigation arrows - just the messenger interface
 */

// Exercise data in PhoneCallSim format
const EXERCISE_DATA = {
  type: 'dialogue_completion',
  instruction: 'Fill in 8 gaps in this dialogue.',
  dialogue_lines: [
    {
      speaker: 'Ms. Mabrouki',
      text: 'What can we use?'
    },
    {
      speaker: 'You',
      template: 'A ____ ____ it can ____ event with ____.',
      correct_answers: ['poster', 'because', 'show', 'slogan']
    },
    {
      speaker: 'Skander',
      template: 'Or ____ to ____ ____ like ____ big.',
      correct_answers: ['video', 'add', 'fun', 'billboard']
    }
  ],
  word_bank: [
    'poster',
    'because',
    'show',
    'video',
    'fun',
    'add',
    'slogan',
    'billboard'
  ]
}

export default function RemedialA2TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 1, context: 'remedial_a2' })
  const [exerciseCompleted, setExerciseCompleted] = useState(false)
  const [exerciseResult, setExerciseResult] = useState(null)
  const [currentScore, setCurrentScore] = useState(0)
  const [totalBlanks] = useState(8) // Total blanks to fill

  const handleExerciseComplete = (result) => {
    console.log('Chat Messenger completed:', result)
    setExerciseCompleted(true)
    setExerciseResult(result)

    // Store result
    const score = result.correctCount || 0
    setCurrentScore(score)
    sessionStorage.setItem('remedial_a2_taskA_score', score)

    // Log to backend
    logTaskCompletion(score)
  }

  const handleProgress = (progress) => {
    console.log('Progress:', progress)
    // Update score as user progresses
    if (progress.correctCount !== undefined) {
      setCurrentScore(progress.correctCount)
    }
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
          level: 'A2',
          task: 'A',
          score: score,
          max_score: 8, // 8 total blanks to fill
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
    navigate('/phase4/remedial/a2/taskB')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 2
        }}
      >
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
          Marketing & Promotion Practice
        </Typography>
        <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
          Task A: Chat Challenge
        </Typography>
        <Typography variant="body1" sx={{ color: 'white', opacity: 0.95 }}>
          Complete the dialogue about promotion ideas by filling in the blanks. Unlock the next dialogue level!
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="MS. MABROUKI"
          message="Great work on Task A! Now let's practice making longer sentences. Complete each line to unlock the next dialogue level - the more you complete, the taller your progress grows!"
        />
      </Paper>

      {/* Progress Bar */}
      <Paper
        elevation={3}
        sx={{
          p: 2,
          mb: 3,
          background: 'linear-gradient(90deg, #00b894 0%, #00cec9 100%)',
          borderRadius: 2
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', minWidth: 150 }}>
            Progress: {currentScore} / {totalBlanks}
          </Typography>
          <Box sx={{ flexGrow: 1 }}>
            <LinearProgress
              variant="determinate"
              value={(currentScore / totalBlanks) * 100}
              sx={{
                height: 10,
                borderRadius: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#2d3436',
                  borderRadius: 1
                }
              }}
            />
          </Box>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
              🌲 {currentScore}px
            </Typography>
          </Stack>
        </Stack>
      </Paper>

      {/* WhatsApp-style Chat Interface */}
      <PhoneCallSim
        exercise={EXERCISE_DATA}
        onComplete={handleExerciseComplete}
        onProgress={handleProgress}
      />

      {/* Continue Button (shown after completion) */}
      {exerciseCompleted && (
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="success"
            onClick={handleContinue}
            size="large"
            sx={{ minWidth: 250 }}
          >
            Continue to Task B
          </Button>
        </Stack>
      )}
    </Box>
  )
}
