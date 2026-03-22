import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, LinearProgress, Container, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import TimerIcon from '@mui/icons-material/Timer'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import QuizIcon from '@mui/icons-material/Quiz'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 3 - Remedial C1 - Task C: Kahoot Quiz
 * Advanced quiz with 6 multiple choice questions
 * Score: +1 for each correct answer = 6 points maximum
 */

const LIGHT = {
  pageBg: '#FFFDE7',
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#1a1a2e',
  purple: { bg: '#2d1b4e', border: '#A855F7', shadow: '#7E22CE' },
  green: { bg: '#052e16', border: '#22C55E', shadow: '#15803D' },
  blue: { bg: '#1e3a5f', border: '#3B82F6', shadow: '#1D4ED8' },
  red: { bg: '#450a0a', border: '#EF4444', shadow: '#B91C1C' },
}

const cardSx = (color) => ({
  bgcolor: color.bg,
  border: `2px solid ${color.border}`,
  borderRadius: '20px',
  boxShadow: `4px 4px 0 ${color.shadow}`,
  p: 3,
})

const QUESTIONS = [
  { id: 1, question: 'Promotional?', options: [{ id: 'A', text: 'Drives sales', correct: true }, { id: 'B', text: 'Hides product', correct: false }], correctAnswer: 'A' },
  { id: 2, question: 'Persuasive core?', options: [{ id: 'A', text: 'Ethos/pathos/logos', correct: true }, { id: 'B', text: 'Only visuals', correct: false }], correctAnswer: 'A' },
  { id: 3, question: 'Targeted benefit?', options: [{ id: 'A', text: 'Relevance', correct: true }, { id: 'B', text: 'General appeal', correct: false }], correctAnswer: 'A' },
  { id: 4, question: 'Original value?', options: [{ id: 'A', text: 'Innovation', correct: true }, { id: 'B', text: 'Repetition', correct: false }], correctAnswer: 'A' },
  { id: 5, question: 'Creative role?', options: [{ id: 'A', text: 'Memorability', correct: true }, { id: 'B', text: 'Standard', correct: false }], correctAnswer: 'A' },
  { id: 6, question: 'Ethical priority?', options: [{ id: 'A', text: 'Honesty', correct: true }, { id: 'B', text: 'Exaggeration', correct: false }], correctAnswer: 'A' }
]

const TIME_PER_QUESTION = 20

export default function RemedialC1TaskC() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 3, context: 'remedial_c1' })
  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [answers, setAnswers] = useState([])
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)

  const currentQuestion = QUESTIONS[currentQuestionIndex]

  useEffect(() => {
    if (!gameStarted || gameFinished || showResult) return
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else { handleSubmitAnswer(null) }
  }, [timeLeft, gameStarted, gameFinished, showResult])

  const handleAnswerSelect = (optionId) => {
    if (showResult) return
    setSelectedAnswer(optionId)
    setTimeout(() => handleSubmitAnswer(optionId), 500)
  }

  const handleSubmitAnswer = (answer) => {
    const isCorrect = answer === currentQuestion.correctAnswer
    const newAnswers = [...answers, { questionId: currentQuestion.id, question: currentQuestion.question, userAnswer: answer, correctAnswer: currentQuestion.correctAnswer, isCorrect }]
    setAnswers(newAnswers)
    if (isCorrect) setScore(score + 1)
    setShowResult(true)
    setTimeout(() => {
      if (currentQuestionIndex < QUESTIONS.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setSelectedAnswer(null)
        setShowResult(false)
        setTimeLeft(TIME_PER_QUESTION)
      } else { handleFinishQuiz(newAnswers) }
    }, 2000)
  }

  const handleFinishQuiz = (finalAnswers) => {
    setGameFinished(true)
    const finalScore = finalAnswers.filter(a => a.isCorrect).length
    sessionStorage.setItem('remedial_step3_c1_taskC_score', finalScore)
    logTaskCompletion(finalScore)
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ level: 'C1', task: 'C', step: 2, score: finalScore, max_score: 6, completed: true }) })
    } catch (error) { console.error('Failed to log task completion:', error) }
  }

  // Start screen
  if (!gameStarted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.purple), mb: 3 }}>
              <Typography variant="h4" fontWeight="bold" sx={{ color: P.purple.shadow, mb: 0.5 }}>Phase 4 - Step 3: Remedial Activities</Typography>
              <Typography variant="h5" sx={{ color: P.purple.border }}>Level C1 - Task C: Kahoot Quiz! 🎯</Typography>
            </Box>
            <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
              <CharacterMessage character="MS. MABROUKI" message="Welcome to the Kahoot Quiz! 🎯 Answer 6 rapid-fire questions about advertising concepts. You have 20 seconds per question. Select your answer quickly! Score: 1 point per correct answer = 6 points total. Ready? Let's go! 🚀" />
            </Box>
            <Box sx={{ ...cardSx(P.purple), textAlign: 'center', py: 5 }}>
              <QuizIcon sx={{ fontSize: 100, color: P.purple.shadow, mb: 2 }} />
              <Typography variant="h3" fontWeight="bold" sx={{ color: P.purple.shadow, mb: 1 }}>kahoot!</Typography>
              <Typography variant="h5" sx={{ color: P.purple.border, mb: 4 }}>6 Questions • 20 Seconds Each</Typography>
              <Box component="button" onClick={() => setGameStarted(true)}
                sx={{ px: 10, py: 2.5, fontSize: '1.8rem', fontWeight: 'bold', cursor: 'pointer', bgcolor: P.purple.border, color: '#fff', border: `2px solid ${P.purple.shadow}`, borderRadius: '50px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.purple.shadow}` } }}>
                START
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    )
  }

  // Results screen
  if (gameFinished) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.purple), mb: 3, textAlign: 'center' }}>
              <EmojiEventsIcon sx={{ fontSize: 80, color: P.purple.shadow, mb: 1 }} />
              <Typography variant="h2" fontWeight="bold" sx={{ color: P.purple.shadow }}>
                {score === 6 ? 'PERFECT! 🎉' : 'GREAT JOB! 🎊'}
              </Typography>
            </Box>
            <Box sx={{ ...cardSx(P.green), mb: 3, textAlign: 'center' }}>
              <Typography variant="h1" fontWeight="bold" sx={{ color: P.green.shadow, fontSize: '5rem' }}>{score}</Typography>
              <Typography variant="h4" color="text.secondary" fontWeight="bold">out of {QUESTIONS.length}</Typography>
              <Typography variant="h6" color="text.secondary">{Math.round((score / QUESTIONS.length) * 100)}% correct</Typography>
            </Box>
            <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.blue.shadow, mb: 2 }}>Answer Review</Typography>
              <Stack spacing={2}>
                {answers.map((answer, index) => (
                  <Box key={index} sx={{ p: 2, borderRadius: '14px', bgcolor: answer.isCorrect ? P.green.bg : P.red.bg, border: `2px solid ${answer.isCorrect ? P.green.border : P.red.border}` }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Box sx={{ px: 1.5, py: 0.25, borderRadius: '8px', bgcolor: P.purple.border, color: 'white', fontWeight: 'bold', fontSize: '0.85rem' }}>Q{index + 1}</Box>
                      <Typography variant="h6" fontWeight="bold">{answer.question}</Typography>
                      {answer.isCorrect ? <CheckCircleIcon sx={{ color: P.green.shadow, ml: 'auto' }} /> : <CancelIcon sx={{ color: P.red.shadow, ml: 'auto' }} />}
                    </Box>
                    <Typography variant="body2" sx={{ color: answer.isCorrect ? P.green.shadow : P.red.shadow, fontWeight: 'bold' }}>
                      Your answer: {answer.userAnswer || 'No answer'}
                    </Typography>
                    {!answer.isCorrect && <Typography variant="body2" sx={{ color: P.green.shadow, fontWeight: 'bold' }}>Correct: {answer.correctAnswer}</Typography>}
                  </Box>
                ))}
              </Stack>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Box component="button" onClick={() => navigate('/dashboard')}
                sx={{ px: 6, py: 2, fontSize: '1.3rem', fontWeight: 'bold', cursor: 'pointer', bgcolor: P.green.border, color: '#fff', border: `2px solid ${P.green.shadow}`, borderRadius: '50px', boxShadow: `4px 4px 0 ${P.green.shadow}`, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` } }}>
                Complete C1 Remedial →
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    )
  }

  // Game in progress - fullscreen purple Kahoot style
  const progress = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100
  const currentAnswered = answers.filter(a => a.isCorrect).length
  const shapes = ['▲', '◆', '●', '■']

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #46178f 0%, #8e44ad 100%)', p: 3 }}>
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        {/* Top bar */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Box sx={{ px: 3, py: 1.5, bgcolor: 'rgba(255,255,255,0.95)', borderRadius: '12px', border: '2px solid rgba(255,255,255,0.5)' }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: '#7E22CE' }}>
              Question {currentQuestionIndex + 1} / {QUESTIONS.length}
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Box sx={{ px: 3, py: 1.5, bgcolor: 'rgba(255,255,255,0.95)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmojiEventsIcon sx={{ color: '#EAB308' }} />
              <Typography variant="h5" fontWeight="bold" sx={{ color: '#2c3e50' }}>{currentAnswered} / {QUESTIONS.length}</Typography>
            </Box>
            <Box sx={{ px: 3, py: 1.5, bgcolor: timeLeft <= 5 ? '#EF4444' : 'rgba(255,255,255,0.95)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: 1 }}>
              <TimerIcon sx={{ color: timeLeft <= 5 ? 'white' : '#EF4444' }} />
              <Typography variant="h5" fontWeight="bold" sx={{ color: timeLeft <= 5 ? 'white' : '#2c3e50', minWidth: 40 }}>{timeLeft}s</Typography>
            </Box>
          </Stack>
        </Stack>

        <LinearProgress variant="determinate" value={progress} sx={{ mb: 3, height: 12, borderRadius: '6px', bgcolor: 'rgba(255,255,255,0.3)', '& .MuiLinearProgress-bar': { bgcolor: 'white', borderRadius: '6px' } }} />

        {/* Question */}
        <Box sx={{ p: 5, mb: 4, bgcolor: 'white', borderRadius: '20px', border: '3px solid rgba(255,255,255,0.5)', minHeight: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="h3" fontWeight="bold" sx={{ textAlign: 'center', color: '#2c3e50' }}>
            {currentQuestion.question}
          </Typography>
        </Box>

        {/* Options */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === option.id
            const isCorrectOption = option.correct
            let bg = index === 0 ? '#e21b3c' : '#1368ce'
            if (showResult) bg = isCorrectOption ? '#22C55E' : '#95a5a6'

            return (
              <Box key={option.id} onClick={() => handleAnswerSelect(option.id)}
                sx={{ p: 4, bgcolor: bg, color: 'white', cursor: showResult ? 'default' : 'pointer', transform: isSelected ? 'scale(1.03)' : 'scale(1)', transition: 'all 0.2s', borderRadius: '16px', minHeight: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', opacity: showResult && !isCorrectOption ? 0.6 : 1, border: '3px solid rgba(255,255,255,0.3)', '&:hover': { transform: showResult ? 'scale(1)' : 'scale(1.03)' } }}>
                <Stack spacing={2} alignItems="center">
                  <Typography variant="h2" fontWeight="bold">{shapes[index]}</Typography>
                  <Typography variant="h5" fontWeight="bold" sx={{ textAlign: 'center' }}>{option.text}</Typography>
                </Stack>
                {showResult && isCorrectOption && <CheckCircleIcon sx={{ position: 'absolute', top: 16, right: 16, fontSize: 48, color: 'white' }} />}
              </Box>
            )
          })}
        </Box>

        {showResult && (
          <Box sx={{ mt: 3, p: 3, bgcolor: selectedAnswer === currentQuestion.correctAnswer ? '#22C55E' : '#EF4444', color: 'white', borderRadius: '16px', border: '3px solid rgba(255,255,255,0.3)', textAlign: 'center' }}>
            <Typography variant="h4" fontWeight="bold">
              {selectedAnswer === currentQuestion.correctAnswer ? '✓ Correct!' : selectedAnswer ? '✗ Incorrect' : '⏰ Time\'s up!'}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}
