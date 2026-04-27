import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container, LinearProgress } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import TimerIcon from '@mui/icons-material/Timer'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  blue:   { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  red:    { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  red:    { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
  purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
}

/**
 * Phase 4 Step 2 - Remedial B1 - Task C: Wordshake Quiz
 */

const QUIZ_QUESTIONS = [
  { id: 1, question: 'What is promotional?', answers: ['To sell/promote', 'To hide', 'To copy'], correctIndex: 0, explanation: 'Promotional means to sell or promote a product or service.' },
  { id: 2, question: 'Persuasive uses what?', answers: ['Ethos, pathos, logos', 'Only pictures', 'No words'], correctIndex: 0, explanation: 'Persuasive advertising uses ethos (credibility), pathos (emotion), and logos (logic).' },
  { id: 3, question: 'Targeted means?', answers: ['For specific group', 'For everyone', 'For animals'], correctIndex: 0, explanation: 'Targeted advertising is aimed at a specific group of people.' },
  { id: 4, question: 'Original is?', answers: ['New idea', 'Copied', 'Old'], correctIndex: 0, explanation: "Original means a new, unique idea that hasn't been copied." },
  { id: 5, question: 'Creative means?', answers: ['Use imagination', 'Use same', 'No color'], correctIndex: 0, explanation: 'Creative means using imagination to create something new and interesting.' },
  { id: 6, question: 'Ethical is?', answers: ['Honest/fair', 'Lie', 'Expensive'], correctIndex: 0, explanation: 'Ethical advertising is honest and fair, following moral principles.' }
]

const ANSWER_COLORS = ['red', 'blue', 'yellow']

export default function RemedialB1TaskC() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase4/step/2/remedial/b1/taskD') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 3, context: 'remedial_b1' })
  const [gameStarted, setGameStarted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(20)
  const [quizCompleted, setQuizCompleted] = useState(false)

  const shuffledQuestions = useMemo(() => {
    return QUIZ_QUESTIONS.map(question => {
      const answers = [...question.answers]
      const correctAnswer = answers[question.correctIndex]
      const shuffled = answers.sort(() => Math.random() - 0.5)
      const newCorrectIndex = shuffled.findIndex(ans => ans === correctAnswer)
      return { ...question, answers: shuffled, correctIndex: newCorrectIndex }
    })
  }, [])

  const currentQuestion = shuffledQuestions[currentQuestionIndex]
  const totalQuestions = shuffledQuestions.length

  const cardSx = (color) => ({
    bgcolor: P[color].bg,
    border: `2px solid ${P[color].border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${P[color].shadow}`,
    p: 3,
  })

  useEffect(() => {
    if (gameStarted && !showResult && !quizCompleted) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) { clearInterval(timer); handleTimeUp(); return 0 }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [gameStarted, currentQuestionIndex, showResult, quizCompleted])

  const handleStartQuiz = () => { setGameStarted(true); setTimeLeft(20) }

  const handleTimeUp = () => {
    setShowResult(true)
    setTimeout(() => moveToNextQuestion(), 3000)
  }

  const handleAnswerClick = (answerIndex) => {
    if (showResult || selectedAnswer !== null) return
    setSelectedAnswer(answerIndex)
    const isCorrect = answerIndex === currentQuestion.correctIndex
    if (isCorrect) setScore(score + 1)
    setShowResult(true)
    setTimeout(() => moveToNextQuestion(), 3000)
  }

  const moveToNextQuestion = () => {
    if (currentQuestionIndex + 1 < totalQuestions) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setTimeLeft(20)
    } else {
      setQuizCompleted(true)
      const finalScore = score + (selectedAnswer === currentQuestion.correctIndex ? 1 : 0)
      sessionStorage.setItem('remedial_step3_b1_taskC_score', finalScore)
      logTaskCompletion(finalScore)
    }
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ level: 'B1', task: 'C', step: 2, score: finalScore, max_score: 6, completed: true })
      })
    } catch (error) { console.error('Failed to log task completion:', error) }
  }

  if (!gameStarted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx('orange'), mb: 3 }}>
              <Typography variant="h4" gutterBottom fontWeight="bold">Phase 4 - Step 2: Remedial Activities</Typography>
              <Typography variant="h5" gutterBottom>Level B1 - Task C: Wordshake Quiz 🎮</Typography>
              <Typography variant="body1">Test your knowledge! Answer 6 multiple-choice questions.</Typography>
            </Box>
            <Box sx={{ ...cardSx('blue'), mb: 3 }}>
              <CharacterMessage character="MS. MABROUKI" message="Excellent progress! Now test your knowledge with this quiz. Answer 6 questions about advertising terminology. You have 20 seconds per question. Good luck!" />
            </Box>
            <Box sx={{ ...cardSx('purple'), textAlign: 'center', p: 5 }}>
              <Typography variant="h3" gutterBottom fontWeight="bold">Ready to Start?</Typography>
              <Typography variant="h6" sx={{ mb: 4 }}>6 Questions · 20 seconds each · Score: X/6</Typography>
              <Box
                component="button"
                onClick={handleStartQuiz}
                sx={{
                  ...cardSx('green'), cursor: 'pointer', px: 6, py: 2,
                  fontSize: '1.4rem', fontWeight: 'bold', color: P.green.border, transition: 'all 0.2s',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }
                }}
              >
                Start Quiz
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    )
  }

  if (quizCompleted) {
    const finalScore = sessionStorage.getItem('remedial_step3_b1_taskC_score') || score
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx('orange'), mb: 3 }}>
              <Typography variant="h4" gutterBottom fontWeight="bold">Phase 4 - Step 2: Remedial Activities</Typography>
              <Typography variant="h5">Level B1 - Task C: Wordshake Quiz 🎮</Typography>
            </Box>
            <Box sx={{ ...cardSx('purple'), textAlign: 'center', p: 6 }}>
              <Typography variant="h3" gutterBottom fontWeight="bold">Quiz Complete! 🎉</Typography>
              <Box sx={{ ...cardSx('yellow'), maxWidth: 280, mx: 'auto', my: 4 }}>
                <Typography variant="h2" fontWeight="bold" sx={{ color: P.blue.border }}>{finalScore} / 6</Typography>
                <Typography variant="h6" color="text.secondary">Your Score</Typography>
              </Box>
              <Box
                component="button"
                onClick={() => navigate('/phase4/step/2/remedial/b1/taskD')}
                sx={{
                  ...cardSx('green'), cursor: 'pointer', px: 6, py: 2,
                  fontSize: '1.1rem', fontWeight: 'bold', color: P.green.border, transition: 'all 0.2s',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }
                }}
              >
                Continue to Task D →
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    )
  }

  // Quiz in progress
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>

          {/* Header with timer */}
          <Box sx={{ ...cardSx('purple'), mb: 3 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems="center">
              <Typography variant="h5" fontWeight="bold">
                Question {currentQuestionIndex + 1} / {totalQuestions}
              </Typography>
              <Box sx={{ textAlign: 'center' }}>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                  <TimerIcon />
                  <Typography variant="h3" fontWeight="bold" sx={{ color: timeLeft <= 5 ? P.red.border : 'inherit' }}>
                    {timeLeft}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={(timeLeft / 20) * 100}
                  sx={{ height: 8, borderRadius: 4, mt: 1, bgcolor: 'rgba(255,255,255,0.2)', '& .MuiLinearProgress-bar': { bgcolor: timeLeft <= 5 ? P.red.border : P.green.border } }}
                />
              </Box>
              <Typography variant="h5" fontWeight="bold">Score: {score} / 6</Typography>
            </Stack>
          </Box>

          {/* Question */}
          <Box sx={{ ...cardSx('blue'), mb: 3, minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h4" fontWeight="bold" align="center">{currentQuestion?.question}</Typography>
          </Box>

          {/* Answer options */}
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            {currentQuestion?.answers.map((answer, index) => {
              const isSelected = selectedAnswer === index
              const isCorrect = index === currentQuestion.correctIndex
              const showCorrect = showResult && isCorrect
              const showIncorrect = showResult && isSelected && !isCorrect
              const color = showCorrect ? 'green' : showIncorrect ? 'red' : ANSWER_COLORS[index]

              return (
                <Box
                  key={index}
                  component="button"
                  onClick={() => handleAnswerClick(index)}
                  disabled={showResult}
                  sx={{
                    flex: 1, bgcolor: P[color].bg, border: `2px solid ${P[color].border}`,
                    borderRadius: '16px', boxShadow: `4px 4px 0 ${P[color].shadow}`,
                    p: 3, cursor: showResult ? 'default' : 'pointer',
                    transition: 'all 0.2s', minHeight: 100,
                    '&:hover': !showResult ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P[color].shadow}` } : {}
                  }}
                >
                  <Stack spacing={1} alignItems="center">
                    {showCorrect && <CheckCircleIcon sx={{ fontSize: 32, color: P.green.border }} />}
                    {showIncorrect && <CancelIcon sx={{ fontSize: 32, color: P.red.border }} />}
                    <Typography variant="h6" fontWeight="bold" align="center">{answer}</Typography>
                  </Stack>
                </Box>
              )
            })}
          </Stack>

          {/* Explanation */}
          {showResult && (
            <Box sx={{ ...cardSx(selectedAnswer === currentQuestion.correctIndex ? 'green' : 'red') }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {selectedAnswer === currentQuestion.correctIndex ? '✓ Correct!' : '✗ Incorrect'}
              </Typography>
              <Typography variant="body1">
                <strong>Explanation:</strong> {currentQuestion.explanation}
              </Typography>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
