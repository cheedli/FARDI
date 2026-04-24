import React, { useState } from 'react'
import { Box, Typography, LinearProgress, useTheme } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'

const LIGHT = {
  cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', divider: '#E0E0E0',
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#2E7D32' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1565C0' },
  teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#006064' },
  orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#E65100' },
  red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#B71C1C' },
  yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F57F17' },
}
const DARK = {
  cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', divider: '#2A2A4A',
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
  orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
  red:    { bg: '#2A0A0A', border: '#E57373', shadow: '#B71C1C' },
  yellow: { bg: '#2A2200', border: '#FFD54F', shadow: '#F57F17' },
}

const clay = (c, extra = {}) => ({
  bgcolor: c.bg,
  border: `2px solid ${c.border}`,
  borderRadius: '20px',
  boxShadow: `4px 4px 0 ${c.shadow}`,
  ...extra,
})

const QuizGameComponent = ({ questions = [], onComplete }) => {
  const muiTheme = useTheme()
  const D = muiTheme.palette.mode === 'dark' ? DARK : LIGHT

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const progress = questions.length > 0 ? (currentQuestionIndex / questions.length) * 100 : 0

  const handleSubmit = () => {
    const correct = selectedAnswer === currentQuestion.correctAnswer
    setIsCorrect(correct)
    setShowFeedback(true)
    if (correct) setCorrectCount(c => c + 1)
    setTimeout(() => {
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex(i => i + 1)
        setSelectedAnswer('')
        setShowFeedback(false)
        setIsCorrect(false)
      } else {
        setGameComplete(true)
        onComplete?.({ score: correctCount + (correct ? 1 : 0), totalQuestions: questions.length, passed: (correctCount + (correct ? 1 : 0)) === questions.length })
      }
    }, 1500)
  }

  if (gameComplete) {
    const passed = correctCount === questions.length
    return (
      <Box sx={{ ...clay(passed ? D.green : D.orange), p: { xs: 3, md: 5 }, textAlign: 'center' }}>
        <EmojiEventsIcon sx={{ fontSize: 64, color: passed ? D.green.border : D.orange.border, mb: 2 }} />
        <Typography variant="h4" fontWeight={900} sx={{ color: D.heading, mb: 1 }}>
          {passed ? 'Perfect Score!' : 'Quiz Complete!'}
        </Typography>
        <Typography fontWeight={700} sx={{ color: D.body, mb: 1 }}>
          You scored {correctCount} out of {questions.length}
        </Typography>
        <Typography variant="body2" sx={{ color: D.muted }}>
          {passed ? 'All answers correct! Excellent work!' : 'Keep practicing to get all answers correct!'}
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto' }}>

      {/* Progress header */}
      <Box sx={{ ...clay(D.blue), p: 2, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography fontWeight={800} sx={{ color: D.heading, whiteSpace: 'nowrap' }}>
          {currentQuestionIndex + 1} / {questions.length}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ flex: 1, height: 8, borderRadius: '6px', bgcolor: D.divider, '& .MuiLinearProgress-bar': { bgcolor: D.blue.border, borderRadius: '6px' } }}
        />
        <Box sx={{ px: 1.25, py: 0.25, borderRadius: '50px', bgcolor: D.green.bg, border: `2px solid ${D.green.border}`, fontWeight: 800, fontSize: '0.8rem', color: D.green.border, whiteSpace: 'nowrap' }}>
          ✓ {correctCount}
        </Box>
      </Box>

      {/* Question card */}
      <Box sx={{ ...clay(showFeedback ? (isCorrect ? D.green : D.red) : { bg: D.cardBg, border: D.divider, shadow: D.divider }), p: 3, mb: 3, transition: 'all 0.3s' }}>
        <Typography variant="h5" fontWeight={800} sx={{ color: D.heading, mb: 3 }}>
          {currentQuestion?.question}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {currentQuestion?.options?.map((option, i) => {
            const isSelected = selectedAnswer === option
            const isCorrectOption = showFeedback && option === currentQuestion.correctAnswer
            const isWrongSelected = showFeedback && isSelected && !isCorrect
            const c = isCorrectOption ? D.green : isWrongSelected ? D.red : isSelected ? D.blue : { bg: D.cardBg, border: D.divider, shadow: D.divider }

            return (
              <Box
                key={i}
                onClick={() => !showFeedback && setSelectedAnswer(option)}
                sx={{
                  ...clay(c),
                  p: 2, cursor: showFeedback ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  transition: 'all 0.15s',
                  '&:hover': !showFeedback ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${c.shadow || D.divider}` } : {},
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{
                    width: 24, height: 24, borderRadius: '50%',
                    border: `2px solid ${c.border || D.divider}`,
                    bgcolor: isSelected || isCorrectOption ? c.border : 'transparent',
                    flexShrink: 0,
                  }} />
                  <Typography fontWeight={isSelected ? 800 : 500} sx={{ color: D.body }}>
                    {option}
                  </Typography>
                </Box>
                {isCorrectOption && <CheckCircleIcon sx={{ color: D.green.border, fontSize: 24 }} />}
                {isWrongSelected && <CancelIcon sx={{ color: D.red.border, fontSize: 24 }} />}
              </Box>
            )
          })}
        </Box>
      </Box>

      {/* Submit */}
      {!showFeedback && (
        <Box
          component="button"
          onClick={handleSubmit}
          disabled={!selectedAnswer}
          sx={{
            ...clay(!selectedAnswer ? { bg: D.divider, border: D.divider, shadow: D.divider } : D.teal),
            width: '100%', py: 1.5, cursor: !selectedAnswer ? 'not-allowed' : 'pointer',
            fontWeight: 800, fontSize: '1rem',
            color: !selectedAnswer ? D.muted : D.teal.border,
            transition: 'all 0.15s',
            '&:hover': selectedAnswer ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.teal.shadow}` } : {},
          }}
        >
          Submit Answer
        </Box>
      )}

      {/* Feedback */}
      {showFeedback && (
        <Box sx={{ ...clay(isCorrect ? D.green : D.red), p: 2.5, textAlign: 'center' }}>
          <Typography fontWeight={800} sx={{ color: isCorrect ? D.green.border : D.red.border, fontSize: '1.1rem' }}>
            {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
          </Typography>
          {!isCorrect && (
            <Typography variant="body2" sx={{ color: D.body, mt: 0.75 }}>
              Correct answer: <strong>{currentQuestion.correctAnswer}</strong>
            </Typography>
          )}
        </Box>
      )}
    </Box>
  )
}

export default QuizGameComponent
