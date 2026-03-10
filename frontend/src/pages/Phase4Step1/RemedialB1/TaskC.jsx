import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import QuizGameComponent from '../../../components/QuizGameComponent.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Level B1 - Task C: Wordshake Challenge (Quiz Game)
 * Multiple choice quiz on marketing vocabulary definitions
 */

const QUIZ_QUESTIONS = [
  {
    question: 'What is a billboard?',
    options: [
      'A large outdoor sign',
      'A small flyer',
      'A TV advertisement',
      'A radio message'
    ],
    correctAnswer: 'A large outdoor sign'
  },
  {
    question: 'What is an eye-catcher?',
    options: [
      'A boring poster',
      'A bright, attractive advertisement',
      'A hidden message',
      'A simple text'
    ],
    correctAnswer: 'A bright, attractive advertisement'
  },
  {
    question: 'What is a slogan?',
    options: [
      'A long story',
      'A catchy phrase for promotion',
      'A product name',
      'A website address'
    ],
    correctAnswer: 'A catchy phrase for promotion'
  },
  {
    question: 'What is a commercial?',
    options: [
      'A business building',
      'A short TV or radio advertisement',
      'A magazine article',
      'A product manual'
    ],
    correctAnswer: 'A short TV or radio advertisement'
  },
  {
    question: 'What is a feature in advertising?',
    options: [
      'The price tag',
      'A highlighted product characteristic',
      'The company logo',
      'The shop location'
    ],
    correctAnswer: 'A highlighted product characteristic'
  },
  {
    question: 'What is a poster?',
    options: [
      'A video clip',
      'A radio show',
      'A paper advertisement with pictures and words',
      'An email message'
    ],
    correctAnswer: 'A paper advertisement with pictures and words'
  }
]

export default function RemedialB1TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 3, context: 'remedial_b1' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameResult, setGameResult] = useState(null)

  const handleGameComplete = (result) => {
    console.log('Quiz completed:', result)
    setGameCompleted(true)
    setGameResult(result)

    // Store result
    const score = result.score || 0
    sessionStorage.setItem('remedial_b1_taskC_score', score)

    // Log to backend
    logTaskCompletion(score, result.passed)
  }

  const logTaskCompletion = async (score, passed) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: score })
    try {
      const response = await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          level: 'B1',
          task: 'C',
          score: score,
          max_score: QUIZ_QUESTIONS.length,
          passed: passed,
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
    // Navigate to Task D
    navigate('/phase4/remedial/b1/taskD')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'warning.light', color: 'warning.contrastText' }}>
        <Typography variant="h4" gutterBottom>
          Marketing & Promotion Practice
        </Typography>
        <Typography variant="h5" gutterBottom>
          Task C: Wordshake Challenge
        </Typography>
        <Typography variant="body1">
          Test your knowledge of marketing vocabulary with this quiz!
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="SKANDER"
          message="Time to test what you've learned! Answer these multiple choice questions about marketing terms. You need all answers correct to pass. Good luck!"
        />
      </Paper>

      {/* Quiz Game */}
      {!gameCompleted && (
        <Box>
          <QuizGameComponent
            questions={QUIZ_QUESTIONS}
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
