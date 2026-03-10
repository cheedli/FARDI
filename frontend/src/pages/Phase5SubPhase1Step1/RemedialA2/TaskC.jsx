import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Alert, Chip } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 5 Step 1 - Level A2 - Task C: Grammar Exercise (Connectors)
 * Add "because" or "and" to 6 sentences, gamified as "Connector Quest"
 */

const SENTENCES = [
  {
    id: 0,
    text: 'Singer cancel _______ sick.',
    answer: 'because',
    options: ['because', 'and']
  },
  {
    id: 1,
    text: 'Find solution _______ fix.',
    answer: 'and',
    options: ['because', 'and']
  },
  {
    id: 2,
    text: 'Say sorry _______ problem.',
    answer: 'because',
    options: ['because', 'and']
  },
  {
    id: 3,
    text: 'Use alternative _______ new singer.',
    answer: 'and',
    options: ['because', 'and']
  },
  {
    id: 4,
    text: 'Change time _______ urgent.',
    answer: 'because',
    options: ['because', 'and']
  },
  {
    id: 5,
    text: 'Tell people _______ apologize.',
    answer: 'and',
    options: ['because', 'and']
  }
]

export default function Phase5Step1RemedialA2TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 1, interaction: 3, context: 'remedial_a2' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerSelect = (sentenceId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [sentenceId]: answer
    }))
  }

  const handleSubmit = async () => {
    let correctCount = 0
    SENTENCES.forEach(sentence => {
      if (answers[sentence.id] === sentence.answer) {
        correctCount++
      }
    })

    setScore(correctCount)
    setSubmitted(true)

    sessionStorage.setItem('phase5_step1_remedial_a2_taskC_score', correctCount.toString())

    // Log to backend
    try {
      await phase5API.logRemedialActivity(1, 'A2', 'C', correctCount, 6, 0)
      console.log('[Phase 5 Step 1] A2 Task C completion logged to backend')
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = async () => {
    // Calculate total A2 score
    const taskAScore = parseInt(sessionStorage.getItem('phase5_step1_remedial_a2_taskA_score') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('phase5_step1_remedial_a2_taskB_score') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('phase5_step1_remedial_a2_taskC_score') || '0')
    const totalScore = taskAScore + taskBScore + taskCScore
    const maxScore = 7 + 8 + 6 // 21 total
    const threshold = Math.ceil(maxScore * 0.8) // 80% = 17
    const passed = totalScore >= threshold

    // Log final score
    try {
      await phase5API.calculateRemedialScore(1, 'A2', {
        task_a_score: taskAScore,
        task_b_score: taskBScore,
        task_c_score: taskCScore
      })
    } catch (error) {
      console.error('Failed to log final score:', error)
    }

    if (passed) {
      navigate('/dashboard')
    } else {
      navigate('/phase5/subphase/1/step/1/remedial/a2/task/a')
    }
  }

  const allAnswered = SENTENCES.every(sentence => answers[sentence.id])

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 5: Execution & Problem-Solving
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 1: Remedial Practice - Level A2
        </Typography>
        <Typography variant="h6" gutterBottom>
          Task C: Connector Quest
        </Typography>
        <Typography variant="body1">
          Add "because" or "and" to 6 sentences
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Welcome to Connector Quest! Choose the correct connector ('because' or 'and') for each sentence. 'Because' shows a reason, 'and' adds more information!"
        />
      </Paper>

      {!submitted ? (
        <>
          {/* Sentences */}
          <Stack spacing={3} sx={{ mb: 3 }}>
            {SENTENCES.map((sentence) => (
              <Paper key={sentence.id} elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Sentence {sentence.id + 1}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, fontSize: '1.1rem' }}>
                  {sentence.text.replace('_______', '_______')}
                </Typography>
                <Stack direction="row" spacing={2}>
                  {sentence.options.map((option) => (
                    <Chip
                      key={option}
                      label={option}
                      onClick={() => handleAnswerSelect(sentence.id, option)}
                      color={answers[sentence.id] === option ? 'primary' : 'default'}
                      variant={answers[sentence.id] === option ? 'filled' : 'outlined'}
                      sx={{
                        fontSize: '1rem',
                        padding: '12px 24px',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'primary.lighter'
                        }
                      }}
                    />
                  ))}
                </Stack>
                {answers[sentence.id] && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    Selected: <strong>{answers[sentence.id]}</strong>
                  </Alert>
                )}
              </Paper>
            ))}
          </Stack>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!allAnswered}
            size="large"
            fullWidth
          >
            Submit Answers
          </Button>
        </>
      ) : (
        <>
          {/* Results */}
          <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: 'grey.50' }}>
            <Typography variant="h5" gutterBottom color="primary">
              Results: {score} / {SENTENCES.length} Correct
            </Typography>

            <Stack spacing={2} sx={{ mt: 2 }}>
              {SENTENCES.map((sentence) => {
                const isCorrect = answers[sentence.id] === sentence.answer
                return (
                  <Paper
                    key={sentence.id}
                    elevation={1}
                    sx={{
                      p: 2,
                      backgroundColor: isCorrect ? 'success.lighter' : 'error.lighter',
                      border: '1px solid',
                      borderColor: isCorrect ? 'success.main' : 'error.main'
                    }}
                  >
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {sentence.text.replace('_______', `[${answers[sentence.id] || 'not answered'}]`)}
                    </Typography>
                    <Typography variant="body2" color={isCorrect ? 'success.dark' : 'error.dark'}>
                      {isCorrect ? '✓ Correct!' : `✗ Incorrect. Correct answer: ${sentence.answer}`}
                    </Typography>
                  </Paper>
                )
              })}
            </Stack>
          </Paper>

          <Button
            variant="contained"
            color="success"
            onClick={handleContinue}
            size="large"
            fullWidth
          >
            Continue to Final Results →
          </Button>
        </>
      )}
    </Box>
  )
}
