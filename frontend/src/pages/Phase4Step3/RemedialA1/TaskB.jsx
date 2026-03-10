import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Alert } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import GapFillStory from '../../../components/GapFillStory.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 3 - Remedial A1 - Task B: Fill Quest
 * Fill in 8 gaps with advertising terms from the videos
 * Score: +1 for each correct answer (8 total)
 */

const WORD_BANK = [
  'promotional',
  'persuasive',
  'targeted',
  'original',
  'creative',
  'dramatisation',
  'goal',
  'obstacles'
]

const SENTENCES = [
  'Ad is _______.',
  '_______ to buy.',
  '_______ group.',
  'Be _______.',
  'Use _______.',
  '_______ story.',
  'Set _______.',
  'Face _______.'
]

const CORRECT_ANSWERS = [
  'promotional',
  'persuasive',
  'targeted',
  'original',
  'creative',
  'dramatisation',
  'goal',
  'obstacles'
]

export default function RemedialA1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 2, context: 'remedial_a1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerChange = (key, value) => {
    setAnswers(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const calculateScore = () => {
    let correctCount = 0
    SENTENCES.forEach((_, index) => {
      const key = `g_${index}_0`
      const userAnswer = answers[key]?.toLowerCase().trim()
      const correctAnswer = CORRECT_ANSWERS[index].toLowerCase()
      if (userAnswer === correctAnswer) {
        correctCount++
      }
    })
    return correctCount
  }

  const handleSubmit = async () => {
    const finalScore = calculateScore()
    setScore(finalScore)
    setSubmitted(true)

    // Store result for Step 3
    sessionStorage.setItem('remedial_step3_a1_taskB_score', finalScore)

    // Log to backend
    await logTaskCompletion(finalScore)
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
          level: 'A1',
          task: 'B',
          step: 2,
          score: score,
          max_score: SENTENCES.length,
          completed: true
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('Step 3 Task B completion logged to backend')
      }
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    // Navigate to Task C
    navigate('/phase4/step3/remedial/a1/taskC')
  }

  // Check if all blanks are filled
  const allFilled = SENTENCES.every((_, index) => {
    const key = `g_${index}_0`
    return answers[key]
  })

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
        <Typography variant="h4" gutterBottom>
          Phase 4 - Step 3: Remedial Activities
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level A1 - Task B: Fill Quest 🎯
        </Typography>
        <Typography variant="body1">
          Fill in the gaps with the correct advertising terms. Complete your quest through 8 levels!
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="MS. MABROUKI"
          message="Excellent work on the Treasure Hunt! Now it's time for the Fill Quest! 🎯 Click a word from the Word Bank, then click the blank space where it belongs. Each correct fill helps you advance through the quest levels. Fill all 8 gaps to complete your quest!"
        />
      </Paper>

      {/* Gap Fill Game */}
      {!submitted && (
        <Box>
          <GapFillStory
            templates={SENTENCES}
            wordBank={WORD_BANK}
            answers={answers}
            onChange={handleAnswerChange}
          />
        </Box>
      )}

      {/* Submit Button */}
      {!submitted && (
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            size="large"
            disabled={!allFilled}
          >
            {allFilled ? 'Submit Answers' : 'Fill All Gaps First'}
          </Button>
        </Stack>
      )}

      {/* Results */}
      {submitted && (
        <Box>
          <Paper elevation={6} sx={{ p: 4, mt: 3, textAlign: 'center', backgroundColor: 'success.light' }}>
            <Typography variant="h4" gutterBottom color="success.dark">
              {score === SENTENCES.length ? '🎯 Perfect Quest! 🎯' : '🌟 Quest Complete! 🌟'}
            </Typography>
            <Typography variant="h6" color="text.primary">
              You scored {score} out of {SENTENCES.length} points!
            </Typography>
            {score === SENTENCES.length && (
              <Typography variant="body1" sx={{ mt: 2 }} color="text.secondary">
                Amazing! You filled every gap correctly!
              </Typography>
            )}
          </Paper>

          {/* Show which answers were correct */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Answer Review:
            </Typography>
            <Stack spacing={2}>
              {SENTENCES.map((sentence, index) => {
                const key = `g_${index}_0`
                const userAnswer = answers[key]?.toLowerCase().trim()
                const correctAnswer = CORRECT_ANSWERS[index]
                const isCorrect = userAnswer === correctAnswer.toLowerCase()

                return (
                  <Alert
                    key={index}
                    severity={isCorrect ? 'success' : 'error'}
                    icon={isCorrect ? '✅' : '❌'}
                  >
                    <Typography variant="body2">
                      <strong>Sentence {index + 1}:</strong> {sentence.replace('_______', `"${userAnswer || '(empty)'}"`)}
                    </Typography>
                    {!isCorrect && (
                      <Typography variant="caption" color="text.secondary">
                        Correct answer: <strong>{correctAnswer}</strong>
                      </Typography>
                    )}
                  </Alert>
                )
              })}
            </Stack>
          </Paper>

          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleContinue}
              size="large"
            >
              Continue to Task C
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  )
}
