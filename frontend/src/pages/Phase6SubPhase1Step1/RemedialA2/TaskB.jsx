import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Alert
} from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 1 - Level A2 - Task B
 * Gap Fill: Choose the correct word for each blank in festival sentences
 */

const GAP_FILL_ITEMS = [
  {
    id: 0,
    sentence: 'Festival was ___.',
    options: ['success', 'failure', 'mistake'],
    correct: 'success',
    explanation: '"Success" means a good result.'
  },
  {
    id: 1,
    sentence: 'Lighting was ___.',
    options: ['easy', 'challenge', 'positive'],
    correct: 'challenge',
    explanation: '"Challenge" means a difficult thing.'
  },
  {
    id: 2,
    sentence: 'Give ___.',
    options: ['feedback', 'problem', 'activity'],
    correct: 'feedback',
    explanation: '"Feedback" means what people say about something.'
  },
  {
    id: 3,
    sentence: 'We can ___.',
    options: ['negative', 'improve', 'success'],
    correct: 'improve',
    explanation: '"Improve" means to make something better.'
  },
  {
    id: 4,
    sentence: 'I feel ___.',
    options: ['positive', 'challenge', 'feedback'],
    correct: 'positive',
    explanation: '"Positive" means a good feeling.'
  },
  {
    id: 5,
    sentence: 'Some parts ___.',
    options: ['improve', 'success', 'negative'],
    correct: 'negative',
    explanation: '"Negative" means a bad feeling or result.'
  }
]

export default function Phase6SP1Step1RemedialA2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 1, interaction: 2, context: 'remedial_a2' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswer = (id, value) => {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async () => {
    let correctCount = 0
    GAP_FILL_ITEMS.forEach(item => {
      if (answers[item.id] === item.correct) {
        correctCount++
      }
    })

    setScore(correctCount)
    setSubmitted(true)

    sessionStorage.setItem('phase6_sp1_step1_remedial_a2_taskB_score', correctCount.toString())

    try {
      await phase6API.logRemedialActivity(1, 'A2', 'B', correctCount, 6, 0, 1)
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase6/subphase/1/step/1/remedial/a2/task/c')
  }

  const allAnswered = GAP_FILL_ITEMS.every(item => answers[item.id] !== undefined)

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)',
          color: 'white',
          borderRadius: 2
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 6: Reflection and Evaluation
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 1: Remedial Practice - Level A2
        </Typography>
        <Typography variant="h6" gutterBottom>
          Task B: Gap Fill
        </Typography>
        <Typography variant="body1">
          Choose the correct word to complete each sentence about the festival
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Fill Frenzy! Fill 6 gaps with reflection words. Choose the correct word from the word bank for each sentence about the festival."
        />
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Instructions:</strong> For each sentence, select the word that best fills the blank.
          There is only one correct answer for each question.
        </Typography>
      </Alert>

      {/* Gap Fill Questions */}
      <Stack spacing={3}>
        {GAP_FILL_ITEMS.map((item) => {
          const userAnswer = answers[item.id]
          const isCorrect = submitted && userAnswer === item.correct
          const isIncorrect = submitted && userAnswer !== item.correct

          return (
            <Paper
              key={item.id}
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 2,
                border: '2px solid',
                borderColor: submitted
                  ? (isCorrect ? 'success.main' : 'error.main')
                  : 'divider'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  sx={{ color: '#8e44ad', minWidth: 24 }}
                >
                  {item.id + 1}.
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {item.sentence}
                </Typography>
                {submitted && (
                  isCorrect
                    ? <CheckCircleIcon sx={{ color: 'success.main', ml: 'auto' }} />
                    : <CancelIcon sx={{ color: 'error.main', ml: 'auto' }} />
                )}
              </Box>

              <FormControl component="fieldset" disabled={submitted}>
                <RadioGroup
                  value={userAnswer || ''}
                  onChange={(e) => handleAnswer(item.id, e.target.value)}
                >
                  {item.options.map((option) => (
                    <FormControlLabel
                      key={option}
                      value={option}
                      control={
                        <Radio
                          sx={{
                            color: submitted && option === item.correct ? 'success.main' : undefined,
                            '&.Mui-checked': {
                              color: submitted && option === item.correct
                                ? 'success.main'
                                : submitted && option !== item.correct
                                ? 'error.main'
                                : '#8e44ad'
                            }
                          }}
                        />
                      }
                      label={
                        <Typography
                          variant="body1"
                          sx={{
                            color: submitted
                              ? option === item.correct
                                ? 'success.dark'
                                : option === userAnswer && option !== item.correct
                                ? 'error.dark'
                                : 'text.secondary'
                              : 'text.primary'
                          }}
                        >
                          {option}
                          {submitted && option === item.correct && ' ✓'}
                        </Typography>
                      }
                      sx={{
                        backgroundColor: submitted && option === item.correct
                          ? 'success.lighter'
                          : submitted && option === userAnswer && option !== item.correct
                          ? 'error.lighter'
                          : 'transparent',
                        borderRadius: 1,
                        px: 1,
                        mb: 0.5
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>

              {submitted && (
                <Alert
                  severity={isCorrect ? 'success' : 'error'}
                  sx={{ mt: 2 }}
                >
                  {isCorrect
                    ? `Correct! ${item.explanation}`
                    : `The correct answer is "${item.correct}". ${item.explanation}`}
                </Alert>
              )}
            </Paper>
          )
        })}
      </Stack>

      {/* Submit */}
      {!submitted && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={!allAnswered}
            sx={{
              px: 6,
              background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)',
              '&:hover': { background: 'linear-gradient(135deg, #6c3483 0%, #5b2c6f 100%)' }
            }}
          >
            Submit Answers
          </Button>
        </Box>
      )}

      {/* Results */}
      {submitted && (
        <>
          <Paper elevation={3} sx={{ p: 3, mt: 3, mb: 3, backgroundColor: '#e8f8f0', textAlign: 'center', borderRadius: 2 }}>
            <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
            <Typography variant="h5" color="success.dark" fontWeight="bold">
              Task B Complete!
            </Typography>
            <Typography variant="h6" sx={{ mt: 1 }}>
              Score: {score} / {GAP_FILL_ITEMS.length}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {score === GAP_FILL_ITEMS.length
                ? 'Perfect! You chose all the correct words!'
                : score >= 2
                ? 'Well done! Keep practising these vocabulary words.'
                : 'Good effort! Review the correct answers above.'}
            </Typography>
          </Paper>

          <Stack direction="row" justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={handleContinue}
              size="large"
              sx={{
                background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)',
                '&:hover': { background: 'linear-gradient(135deg, #1e8449 0%, #196f3d 100%)' }
              }}
            >
              Next: Task C →
            </Button>
          </Stack>
        </>
      )}
    </Box>
  )
}
