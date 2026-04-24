import React, { useState } from 'react'
import { Box, Typography, TextField, Button, Stack, LinearProgress, useTheme } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import StarIcon from '@mui/icons-material/Star'
import LockIcon from '@mui/icons-material/Lock'

/**
 * Compare Quest Game Component
 * Writing task with guided questions - each strong comparison unlocks an advanced vocabulary level
 * Students answer questions to build a complete comparison paragraph
 */

const LIGHT = {
  pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', divider: '#E0E0E0',
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#2E7D32' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1565C0' },
  teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#006064' },
  orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#E65100' },
  purple: { bg: '#E8EAF6', border: '#3949AB', shadow: '#283593' },
  red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#B71C1C' },
  yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F57F17' },
}
const DARK = {
  pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', divider: '#2A2A4A',
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
  orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
  purple: { bg: '#0D0D2B', border: '#7986CB', shadow: '#283593' },
  red:    { bg: '#2A0A0A', border: '#E57373', shadow: '#B71C1C' },
  yellow: { bg: '#2A2200', border: '#FFD54F', shadow: '#F57F17' },
}
const clay = (c, extra = {}) => ({
  bgcolor: c.bg,
  border: `2px solid ${c.border}`,
  borderRadius: '16px',
  boxShadow: `4px 4px 0 ${c.shadow}`,
  ...extra,
})

const CompareQuestGame = ({
  questions = [],
  glossaryTerms = [],
  onComplete,
  evaluationCriteria = {}
}) => {
  const muiTheme = useTheme()
  const D = muiTheme.palette.mode === 'dark' ? DARK : LIGHT

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [skippedQuestions, setSkippedQuestions] = useState(new Set())
  const [vocabularyLevel, setVocabularyLevel] = useState(1)
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [evaluationResult, setEvaluationResult] = useState(null)
  const [gameComplete, setGameComplete] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const answeredCount = Object.keys(answers).length
  const totalQuestions = questions.length
  const maxLevel = totalQuestions

  const handleAnswerChange = (event) => {
    setCurrentAnswer(event.target.value)
  }

  const handleSubmit = async () => {
    if (!currentAnswer.trim()) return

    setIsSubmitting(true)

    try {
      // Submit answer for LLM evaluation
      const response = await fetch('/api/phase4/evaluate-writing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          question: currentQuestion.question,
          answer: currentAnswer,
          level: 'B2',
          task: 'comparison',
          criteria: {
            requiresComparison: true,
            glossaryTerms: glossaryTerms,
            minTermsRequired: 1
          }
        })
      })

      const result = await response.json()

      setEvaluationResult(result)

      // If correct (score === 1), save answer and move to next
      if (result.score === 1) {
        // Store correct answer
        const newAnswers = {
          ...answers,
          [currentQuestionIndex]: {
            question: currentQuestion.question,
            answer: currentAnswer,
            evaluation: result,
            isCorrect: true
          }
        }
        setAnswers(newAnswers)

        // Level up
        setVocabularyLevel(Math.min(vocabularyLevel + 1, maxLevel))

        // Move to next question after showing feedback
        setTimeout(() => {
          if (currentQuestionIndex + 1 < totalQuestions) {
            setCurrentQuestionIndex(currentQuestionIndex + 1)
            setCurrentAnswer('')
            setEvaluationResult(null)
          } else {
            // All questions answered - complete game
            completeGame(newAnswers)
          }
        }, 2000)
      }
      // If incorrect (score === 0), show feedback but allow retry or skip
      // Don't auto-advance - user must choose to retry or skip

    } catch (error) {
      console.error('Evaluation error:', error)
      setEvaluationResult({
        score: 0,
        feedback: 'Unable to evaluate answer. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRetry = () => {
    // Clear evaluation result to allow editing and resubmission
    setEvaluationResult(null)
    // Keep the current answer so user can edit it
  }

  const handleSkip = () => {
    // If there was an incorrect answer, save it with score 0
    if (evaluationResult && evaluationResult.score === 0) {
      const newAnswers = {
        ...answers,
        [currentQuestionIndex]: {
          question: currentQuestion.question,
          answer: currentAnswer,
          evaluation: evaluationResult,
          isCorrect: false
        }
      }
      setAnswers(newAnswers)
    }

    // Mark as skipped
    const newSkipped = new Set(skippedQuestions)
    newSkipped.add(currentQuestionIndex)
    setSkippedQuestions(newSkipped)

    // Move to next question
    if (currentQuestionIndex + 1 < totalQuestions) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setCurrentAnswer('')
      setEvaluationResult(null)
    } else {
      // All questions processed - complete game
      const finalAnswers = evaluationResult && evaluationResult.score === 0
        ? {
            ...answers,
            [currentQuestionIndex]: {
              question: currentQuestion.question,
              answer: currentAnswer,
              evaluation: evaluationResult,
              isCorrect: false
            }
          }
        : answers
      completeGame(finalAnswers)
    }
  }

  const completeGame = (finalAnswers) => {
    const answeredQuestions = Object.values(finalAnswers)
    const correctAnswers = answeredQuestions.filter(a => a.isCorrect).length
    const finalLevel = vocabularyLevel
    const skippedCount = skippedQuestions.size

    setGameComplete(true)

    if (onComplete) {
      onComplete({
        answers: finalAnswers,
        score: correctAnswers,
        totalQuestions: totalQuestions,
        skipped: skippedCount,
        vocabularyLevel: finalLevel,
        completed: true
      })
    }
  }

  if (gameComplete) {
    const answeredQuestions = Object.values(answers)
    const correctAnswers = answeredQuestions.filter(a => a.isCorrect).length

    return (
      <Box sx={{ ...clay(D.purple), p: 6, textAlign: 'center' }}>
        <StarIcon sx={{ fontSize: 80, mb: 2, color: '#ffd700' }} />
        <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: D.heading }}>
          Quest Complete!
        </Typography>
        <Typography variant="h5" sx={{ mb: 3, color: D.body }}>
          You've mastered comparison writing!
        </Typography>

        <Box sx={{ ...clay(D.blue), maxWidth: 600, mx: 'auto', mb: 3, p: 3 }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="h6" sx={{ color: D.heading }} gutterBottom>
                Vocabulary Level Achieved
              </Typography>
              <Stack direction="row" spacing={1} justifyContent="center">
                {[...Array(vocabularyLevel)].map((_, i) => (
                  <StarIcon key={i} sx={{ color: '#ffd700', fontSize: 40 }} />
                ))}
              </Stack>
              <Typography variant="h4" sx={{ color: D.heading }} fontWeight="bold">
                Level {vocabularyLevel}
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ color: D.muted }}>
                Correct Answers
              </Typography>
              <Typography variant="h3" sx={{ color: D.green.border }} fontWeight="bold">
                {correctAnswers} / {answeredQuestions.length}
              </Typography>
            </Box>

            {skippedQuestions.size > 0 && (
              <Box>
                <Typography variant="body2" sx={{ color: D.muted }}>
                  Skipped: {skippedQuestions.size}
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
      {/* Progress Header */}
      <Box sx={{ ...clay(D.yellow), p: 3, mb: 3 }}>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight="bold" sx={{ color: D.yellow.border }}>
              Vocabulary Level {vocabularyLevel}
            </Typography>
            <Typography variant="h6" sx={{ color: D.heading }}>
              Question {currentQuestionIndex + 1} / {totalQuestions}
            </Typography>
          </Stack>

          <Box>
            <Stack direction="row" spacing={0.5} sx={{ mb: 1 }}>
              {[...Array(maxLevel)].map((_, i) => (
                <StarIcon
                  key={i}
                  sx={{
                    color: i < vocabularyLevel ? '#ffd700' : D.muted,
                    fontSize: 28
                  }}
                />
              ))}
            </Stack>
            <LinearProgress
              variant="determinate"
              value={((answeredCount + skippedQuestions.size) / totalQuestions) * 100}
              sx={{
                height: 10,
                borderRadius: 1,
                backgroundColor: D.divider,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: D.green.border
                }
              }}
            />
          </Box>
        </Stack>
      </Box>

      {/* Completed Questions Summary */}
      {answeredCount > 0 && (
        <Box sx={{ ...clay(D.blue), p: 2, mb: 3 }}>
          <Typography variant="subtitle2" sx={{ color: D.muted }} gutterBottom>
            Your Progress:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {questions.map((q, index) => {
              const answer = answers[index]
              const isSkipped = skippedQuestions.has(index)
              const isAnswered = answer !== undefined
              const color = isAnswered
                ? (answer.isCorrect ? D.green : D.red)
                : D.blue

              return (
                <Box
                  key={index}
                  component="span"
                  sx={{
                    px: 1.5, py: 0.4, borderRadius: '50px',
                    bgcolor: color.bg,
                    border: `2px solid ${color.border}`,
                    fontWeight: 700, fontSize: '0.8rem', color: color.border,
                    opacity: isAnswered || isSkipped ? 1 : 0.4,
                    display: 'inline-flex', alignItems: 'center', gap: 0.5
                  }}
                >
                  {isAnswered ? (
                    answer.isCorrect ? <CheckCircleIcon sx={{ fontSize: 14 }} /> : <CancelIcon sx={{ fontSize: 14 }} />
                  ) : isSkipped ? (
                    <CancelIcon sx={{ fontSize: 14 }} />
                  ) : (
                    <LockIcon sx={{ fontSize: 14 }} />
                  )}
                  Q{index + 1}
                </Box>
              )
            })}
          </Stack>
        </Box>
      )}

      {/* Current Question */}
      <Box
        sx={{
          ...clay(evaluationResult ? (evaluationResult.score === 1 ? D.green : D.red) : D.blue),
          p: 4,
          mb: 3,
          transition: 'all 0.3s ease'
        }}
      >
        <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: D.heading }}>
          {currentQuestion.question}
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={4}
          value={currentAnswer}
          onChange={handleAnswerChange}
          placeholder="Write your comparison here... (Use terms like: while, whereas, better than, etc.)"
          disabled={isSubmitting || (evaluationResult !== null && evaluationResult.score === 1)}
          InputProps={{
            style: {
              color: '#000000',
              fontSize: '16px',
              fontWeight: 400
            }
          }}
          sx={{
            mt: 2,
            mb: 2,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white',
              '& fieldset': {
                borderColor: D.blue.border,
                borderWidth: 2
              }
            },
            '& .MuiInputBase-input': {
              color: '#000000 !important',
              WebkitTextFillColor: '#000000 !important',
              opacity: '1 !important'
            },
            '& .MuiInputBase-input.Mui-disabled': {
              WebkitTextFillColor: '#000000 !important'
            }
          }}
        />

        {evaluationResult && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              ...clay(evaluationResult.score === 1 ? D.green : D.red),
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              {evaluationResult.score === 1 ? (
                <>
                  <CheckCircleIcon sx={{ color: D.green.border }} />
                  <Typography variant="h6" fontWeight="bold" sx={{ color: D.green.border }}>
                    Excellent! ✓
                  </Typography>
                </>
              ) : (
                <>
                  <CancelIcon sx={{ color: D.red.border }} />
                  <Typography variant="h6" fontWeight="bold" sx={{ color: D.red.border }}>
                    Not quite ✕
                  </Typography>
                </>
              )}
            </Stack>
            <Typography variant="body2" sx={{ color: D.body }}>
              {evaluationResult.feedback}
            </Typography>
          </Box>
        )}

        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
          {evaluationResult && evaluationResult.score === 0 ? (
            // Show Retry and Skip buttons when answer is incorrect
            <>
              <Button
                variant="outlined"
                color="error"
                onClick={handleSkip}
                disabled={isSubmitting}
                startIcon={<CancelIcon />}
              >
                Skip (Accept 0)
              </Button>
              <Button
                variant="contained"
                onClick={handleRetry}
                disabled={isSubmitting}
                sx={{
                  px: 4,
                  bgcolor: D.orange.border, color: '#fff', borderRadius: '12px',
                  boxShadow: '4px 4px 0 ' + D.orange.shadow, fontWeight: 800,
                  '&:hover': { bgcolor: D.orange.border, transform: 'translate(-2px,-2px)', boxShadow: '6px 6px 0 ' + D.orange.shadow }
                }}
              >
                Retry
              </Button>
            </>
          ) : (
            // Show Submit and Skip buttons normally
            <>
              <Button
                variant="outlined"
                color="error"
                onClick={handleSkip}
                disabled={isSubmitting || (evaluationResult !== null && evaluationResult.score === 1)}
                startIcon={<CancelIcon />}
              >
                Skip
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!currentAnswer.trim() || isSubmitting || (evaluationResult !== null && evaluationResult.score === 1)}
                sx={{
                  px: 4,
                  bgcolor: D.blue.border, color: '#fff', borderRadius: '12px',
                  boxShadow: '4px 4px 0 ' + D.blue.shadow, fontWeight: 800,
                  '&:hover': { bgcolor: D.blue.border, transform: 'translate(-2px,-2px)', boxShadow: '6px 6px 0 ' + D.blue.shadow }
                }}
              >
                {isSubmitting ? 'Evaluating...' : 'Submit'}
              </Button>
            </>
          )}
        </Stack>
      </Box>

      {/* Glossary Terms Reference */}
      <Box sx={{ ...clay(D.teal), p: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ color: D.teal.border }} gutterBottom>
          Suggested Terms to Use:
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {glossaryTerms.map((term, index) => (
            <Box
              key={index}
              component="span"
              sx={{
                px: 1.5, py: 0.4, borderRadius: '50px',
                bgcolor: D.teal.bg,
                border: `2px solid ${D.teal.border}`,
                fontWeight: 700, fontSize: '0.8rem', color: D.teal.border
              }}
            >
              {term}
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}

export default CompareQuestGame
