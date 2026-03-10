import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Alert,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl
} from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 2 - Level A2 - Task B: Fill Frenzy
 * Fill in 6 sentences with social media vocabulary
 */

const WORD_BANK = ['hashtag', 'caption', 'emoji', 'tag', 'post', 'story']

const SENTENCES = [
  {
    id: 1,
    text: 'Use a ___ to make your post easy to find.',
    answer: 'hashtag'
  },
  {
    id: 2,
    text: 'Write a short ___ under your photo.',
    answer: 'caption'
  },
  {
    id: 3,
    text: 'Add a happy ___ to show your feeling.',
    answer: 'emoji'
  },
  {
    id: 4,
    text: 'Click to ___ your friend in the photo.',
    answer: 'tag'
  },
  {
    id: 5,
    text: 'Share a ___ on your profile page.',
    answer: 'post'
  },
  {
    id: 6,
    text: 'A ___ disappears after 24 hours.',
    answer: 'story'
  }
]

// Function to generate random options for each sentence
function generateOptions(correctAnswer, wordBank) {
  // Get 3 random incorrect options
  const incorrectOptions = wordBank
    .filter(word => word !== correctAnswer)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)

  // Combine with correct answer and shuffle
  const allOptions = [...incorrectOptions, correctAnswer]
    .sort(() => Math.random() - 0.5)

  return allOptions
}

export default function Phase4_2Step2RemedialA2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 2, interaction: 2, context: 'remedial_a2' })
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [questionOptions, setQuestionOptions] = useState({})

  // Generate random options for each question on component mount
  useEffect(() => {
    const options = {}
    SENTENCES.forEach(sentence => {
      options[sentence.id] = generateOptions(sentence.answer, WORD_BANK)
    })
    setQuestionOptions(options)
  }, [])

  const handleAnswerChange = (id, value) => {
    setAnswers({
      ...answers,
      [id]: value
    })
  }

  const handleSubmit = () => {
    let correctCount = 0

    SENTENCES.forEach(sentence => {
      if (answers[sentence.id] === sentence.answer) {
        correctCount++
      }
    })

    setScore(correctCount)
    setShowResults(true)

    const scoreOutOf10 = (correctCount / SENTENCES.length) * 10
    sessionStorage.setItem('phase4_2_step2_remedial_a2_taskB_score', scoreOutOf10.toString())
    sessionStorage.setItem('phase4_2_step2_remedial_a2_taskB_max', '10')

    logTaskCompletion(correctCount, SENTENCES.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          phase: '4.2',
          step: 2,
          level: 'A2',
          task: 'B',
          score: score,
          max_score: maxScore,
          time_taken: 0
        })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const handleNext = () => {
    navigate('/phase4_2/step/2/remedial/a2/taskC')
  }

  const allAnswered = SENTENCES.every(s => answers[s.id]?.trim())

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'warning.light', color: 'warning.contrastText' }}>
        <Typography variant="h5" gutterBottom>
          Phase 4.2 Step 2 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level A2 - Task B: Fill Frenzy
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Choose the correct word to complete each sentence! Select the best option from the choices given."
        />
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1">
          <strong>Instructions:</strong> Read each sentence carefully and select the word that best completes it.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Evaluation:</strong> Each correct answer = 1 point.
        </Typography>
      </Paper>

      {/* Sentences */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {SENTENCES.map(sentence => {
          const isCorrect = answers[sentence.id] === sentence.answer
          const isAnswered = answers[sentence.id]
          const options = questionOptions[sentence.id] || []

          return (
            <Grid item xs={12} key={sentence.id}>
              <Card
                elevation={2}
                sx={{
                  backgroundColor: showResults
                    ? (isCorrect ? 'success.lighter' : 'error.lighter')
                    : 'white'
                }}
              >
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {sentence.id}. {sentence.text.replace('___', '______')}
                  </Typography>

                  <FormControl component="fieldset" sx={{ mt: 2, width: '100%' }}>
                    <RadioGroup
                      value={answers[sentence.id] || ''}
                      onChange={(e) => handleAnswerChange(sentence.id, e.target.value)}
                    >
                      {options.map((option, index) => (
                        <FormControlLabel
                          key={index}
                          value={option}
                          control={<Radio disabled={showResults} />}
                          label={
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: showResults && option === sentence.answer ? 'bold' : 'normal',
                                color: showResults && option === sentence.answer ? 'success.main' : 'inherit'
                              }}
                            >
                              {option}
                            </Typography>
                          }
                          sx={{
                            p: 1.5,
                            borderRadius: 1,
                            backgroundColor: 'white',
                            mb: 1,
                            '&:hover': {
                              backgroundColor: showResults ? 'white' : 'grey.50'
                            }
                          }}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>

                  {showResults && (
                    <Alert
                      severity={isCorrect ? 'success' : 'error'}
                      icon={isCorrect ? <CheckCircleIcon /> : undefined}
                      sx={{ mt: 2 }}
                    >
                      {isCorrect ? (
                        <Typography>Correct!</Typography>
                      ) : (
                        <Typography>
                          Your answer: <strong>{answers[sentence.id] || '(none selected)'}</strong> |
                          Correct answer: <strong>{sentence.answer}</strong>
                        </Typography>
                      )}
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      {/* Results */}
      {showResults && (
        <Alert severity={score === SENTENCES.length ? "success" : "warning"} sx={{ mb: 3 }}>
          {score === SENTENCES.length ? (
            <Typography>🎉 Perfect! All {SENTENCES.length} answers are correct!</Typography>
          ) : (
            <Typography>
              You got {score}/{SENTENCES.length} correct. Review the correct answers and try to remember the meanings!
            </Typography>
          )}
        </Alert>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
        {!showResults && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit}
            disabled={!allAnswered}
          >
            Submit Answers
          </Button>
        )}
        {showResults && (
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={handleNext}
            endIcon={<ArrowForwardIcon />}
          >
            Continue to Task C
          </Button>
        )}
      </Box>
    </Box>
  )
}
