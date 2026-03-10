import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Alert, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { CheckCircle, Cancel } from '@mui/icons-material'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 4 - Remedial B1 - Task F: Grammar Kahoot (Subject-Verb Agreement)
 * Choose the correct grammar in 6 sentences
 * Score: +1 for each correct answer (6 total)
 */

const GRAMMAR_QUESTIONS = [
  {
    id: 1,
    question: 'Promotional ads ___ to sell?',
    options: ['is', 'are'],
    correctAnswer: 'are',
    explanation: 'We use "are" because "ads" is plural.'
  },
  {
    id: 2,
    question: 'Persuasive ___ logos?',
    options: ['use', 'uses'],
    correctAnswer: 'uses',
    explanation: 'We use "uses" because "Persuasive" (singular subject) takes a singular verb.'
  },
  {
    id: 3,
    question: 'Targeted group ___ specific?',
    options: ['is', 'are'],
    correctAnswer: 'is',
    explanation: 'We use "is" because "group" is singular.'
  },
  {
    id: 4,
    question: 'Original idea ___ new?',
    options: ['is', 'are'],
    correctAnswer: 'is',
    explanation: 'We use "is" because "idea" is singular.'
  },
  {
    id: 5,
    question: 'Creative ads ___ memorable?',
    options: ['make', 'makes'],
    correctAnswer: 'make',
    explanation: 'We use "make" because "ads" is plural.'
  },
  {
    id: 6,
    question: 'Ethical advertising ___ fair?',
    options: ['is', 'are'],
    correctAnswer: 'is',
    explanation: 'We use "is" because "advertising" is singular (uncountable noun).'
  }
]

export default function RemedialB1TaskF() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 6, context: 'remedial_b1' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState(Array(GRAMMAR_QUESTIONS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState([])
  const [score, setScore] = useState(0)

  const currentQuestion = GRAMMAR_QUESTIONS[currentIndex]

  const handleAnswerSelect = (answer) => {
    const newAnswers = [...userAnswers]
    newAnswers[currentIndex] = answer
    setUserAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentIndex < GRAMMAR_QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleSubmit = async () => {
    // Check all answers
    const checkResults = userAnswers.map((answer, index) => {
      const isCorrect = answer === GRAMMAR_QUESTIONS[index].correctAnswer
      return {
        userAnswer: answer,
        correctAnswer: GRAMMAR_QUESTIONS[index].correctAnswer,
        isCorrect,
        explanation: GRAMMAR_QUESTIONS[index].explanation
      }
    })

    setResults(checkResults)
    const correctCount = checkResults.filter(r => r.isCorrect).length
    setScore(correctCount)
    setSubmitted(true)

    // Store result
    sessionStorage.setItem('remedial_step4_b1_taskF_score', correctCount)

    // Log to backend
    await logTaskCompletion(correctCount)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskF', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: 'B1',
          task: 'F',
          step: 4,
          score: score,
          max_score: 6,
          completed: true
        })
      })
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase4/step/4/remedial/b1/results')
  }

  const progress = ((currentIndex + 1) / GRAMMAR_QUESTIONS.length) * 100

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
        <Typography variant="h4" gutterBottom>
          Phase 4 - Step 4: Remedial Activities
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level B1 - Task F: Grammar Kahoot 🎯
        </Typography>
        <Typography variant="body1">
          Choose the correct grammar for 6 sentences!
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="MS. MABROUKI"
          message="Final challenge! Choose the correct verb form for each sentence. Pay attention to subject-verb agreement. Is the subject singular or plural? Choose wisely!"
        />
      </Paper>

      {!submitted ? (
        <Box>
          {/* Progress Bar */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Question {currentIndex + 1} of {GRAMMAR_QUESTIONS.length}
            </Typography>
            <LinearProgress variant="determinate" value={progress} sx={{ mb: 1 }} />
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              {GRAMMAR_QUESTIONS.map((_, idx) => (
                <Box
                  key={idx}
                  sx={{
                    width: '100%',
                    height: 8,
                    borderRadius: 1,
                    backgroundColor: idx < currentIndex ? 'success.main' :
                                    idx === currentIndex ? 'primary.main' : 'grey.300'
                  }}
                />
              ))}
            </Box>
          </Paper>

          {/* Current Question */}
          <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
            {/* Question Display */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h3" gutterBottom color="primary" fontWeight="bold">
                {currentIndex + 1}. {currentQuestion.question}
              </Typography>
            </Box>

            {/* Answer Buttons (Circular design like A2 Task C) */}
            <Stack direction="row" spacing={3} justifyContent="center" sx={{ mb: 4 }}>
              {currentQuestion.options.map((option, idx) => {
                const isSelected = userAnswers[currentIndex] === option
                const colors = ['success', 'warning', 'error', 'info']
                const color = colors[idx % colors.length]

                return (
                  <Button
                    key={option}
                    variant={isSelected ? 'contained' : 'outlined'}
                    onClick={() => handleAnswerSelect(option)}
                    sx={{
                      width: 200,
                      height: 200,
                      borderRadius: '50%',
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      backgroundColor: isSelected ? `${color}.main` : 'white',
                      color: isSelected ? 'white' : 'primary.main',
                      border: '4px solid',
                      borderColor: isSelected ? `${color}.dark` : 'primary.main',
                      '&:hover': {
                        backgroundColor: isSelected ? `${color}.dark` : `${color}.light`,
                        transform: 'scale(1.05)',
                        transition: 'all 0.2s'
                      }
                    }}
                  >
                    {option}
                  </Button>
                )
              })}
            </Stack>

            {/* Real-time Score Display */}
            <Paper
              elevation={2}
              sx={{
                p: 2,
                backgroundColor: 'success.light',
                textAlign: 'center',
                mb: 3
              }}
            >
              <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
                {GRAMMAR_QUESTIONS.map((question, idx) => {
                  const userAnswer = userAnswers[idx]
                  const isCorrect = userAnswer === question.correctAnswer
                  const isAnswered = userAnswer !== ''

                  return (
                    <Box
                      key={idx}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        minWidth: 60
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Q{idx + 1}
                      </Typography>
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        sx={{
                          color: !isAnswered ? 'grey.400' : isCorrect ? 'success.dark' : 'error.main'
                        }}
                      >
                        {!isAnswered ? '-' : isCorrect ? '+1' : '0'}
                      </Typography>
                    </Box>
                  )
                })}
              </Stack>
              <Typography variant="h4" fontWeight="bold" sx={{ mt: 2, color: 'success.dark' }}>
                SCORE: {userAnswers.filter((answer, idx) => answer === GRAMMAR_QUESTIONS[idx].correctAnswer).length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Answered: {userAnswers.filter(a => a).length} / {GRAMMAR_QUESTIONS.length}
              </Typography>
            </Paper>

            {/* Navigation */}
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Button
                variant="outlined"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                ← Previous
              </Button>

              {currentIndex < GRAMMAR_QUESTIONS.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!userAnswers[currentIndex]}
                >
                  Next →
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSubmit}
                  disabled={userAnswers.some(answer => !answer)}
                >
                  Submit Grammar Quiz 🎯
                </Button>
              )}
            </Stack>
          </Paper>

          {/* Quick Navigation */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Jump to question:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {GRAMMAR_QUESTIONS.map((_, idx) => (
                <Button
                  key={idx}
                  size="small"
                  variant={idx === currentIndex ? 'contained' : 'outlined'}
                  onClick={() => setCurrentIndex(idx)}
                  sx={{ minWidth: 40 }}
                >
                  {idx + 1} {userAnswers[idx] && '✓'}
                </Button>
              ))}
            </Stack>
          </Paper>
        </Box>
      ) : (
        <Box>
          {/* Results */}
          <Paper elevation={6} sx={{ p: 4, mb: 3, textAlign: 'center', backgroundColor: score === 6 ? 'success.light' : 'warning.light' }}>
            <Typography variant="h4" gutterBottom color={score === 6 ? 'success.dark' : 'warning.dark'}>
              {score === 6 ? '🎯 Perfect Grammar! 🎯' : '🌟 Quiz Complete! 🌟'}
            </Typography>
            <Typography variant="h6" color="text.primary">
              You scored {score} out of 6 points!
            </Typography>
          </Paper>

          {/* Answer Review */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Answer Review:
            </Typography>
            <Stack spacing={2}>
              {results.map((result, index) => (
                <Alert
                  key={index}
                  severity={result.isCorrect ? 'success' : 'error'}
                  icon={result.isCorrect ? <CheckCircle /> : <Cancel />}
                >
                  <Typography variant="body2" fontWeight="bold" gutterBottom>
                    {index + 1}. {GRAMMAR_QUESTIONS[index].question.replace('___', `[${result.userAnswer || '?'}]`)}
                  </Typography>
                  {!result.isCorrect && (
                    <Typography variant="body2" color="error.dark" sx={{ mt: 1 }}>
                      Your answer: <strong>{result.userAnswer}</strong> - Correct answer: <strong>{result.correctAnswer}</strong>
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    {result.explanation}
                  </Typography>
                </Alert>
              ))}
            </Stack>
          </Paper>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="contained"
              color="success"
              onClick={handleContinue}
              size="large"
            >
              View Final Results →
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  )
}
