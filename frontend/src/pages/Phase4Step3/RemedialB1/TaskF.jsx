import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container, LinearProgress } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import TimerIcon from '@mui/icons-material/Timer'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
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
 * Phase 4 Step 3 - Remedial B1 - Task F: Grammar Kahoot
 * Bonus task worth 6 points
 */

const QUESTIONS = [
  { id: 1, question: "Promotional ads ___ to sell?", options: ['is', 'are'], correctAnswer: 'are', explanation: "Use 'are' because 'ads' is plural" },
  { id: 2, question: "Persuasive ___ logos?", options: ['use', 'uses'], correctAnswer: 'uses', explanation: "Use 'uses' because 'persuasive' (advertising) is singular" },
  { id: 3, question: "Targeted group ___ specific?", options: ['is', 'are'], correctAnswer: 'is', explanation: "Use 'is' because 'group' is singular" },
  { id: 4, question: "Original idea ___ new?", options: ['is', 'are'], correctAnswer: 'is', explanation: "Use 'is' because 'idea' is singular" },
  { id: 5, question: "Creative ads ___ memorable?", options: ['make', 'makes'], correctAnswer: 'make', explanation: "Use 'make' because 'ads' is plural" },
  { id: 6, question: "Ethical advertising ___ fair?", options: ['is', 'are'], correctAnswer: 'is', explanation: "Use 'is' because 'advertising' is singular (uncountable noun)" }
]

const TIME_PER_QUESTION = 15

export default function RemedialB1TaskF() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase4/step3/remedial/b1/results') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 6, context: 'remedial_b1' })
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)

  const cardSx = (color) => ({
    bgcolor: P[color].bg,
    border: `2px solid ${P[color].border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${P[color].shadow}`,
    p: 3,
  })

  useEffect(() => {
    if (!gameStarted || gameFinished || showFeedback) return
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      handleTimeUp()
    }
  }, [timeLeft, gameStarted, gameFinished, showFeedback])

  const handleTimeUp = () => {
    if (selectedAnswer) {
      handleAnswerSubmit(selectedAnswer)
    } else {
      setAnswers([...answers, { questionId: QUESTIONS[currentQuestion].id, question: QUESTIONS[currentQuestion].question, selectedAnswer: null, correctAnswer: QUESTIONS[currentQuestion].correctAnswer, isCorrect: false, timedOut: true }])
      setShowFeedback(true)
      setTimeout(() => moveToNextQuestion(), 3000)
    }
  }

  const handleAnswerSubmit = (answer) => {
    const isCorrect = answer === QUESTIONS[currentQuestion].correctAnswer
    if (isCorrect) setScore(score + 1)
    setAnswers([...answers, { questionId: QUESTIONS[currentQuestion].id, question: QUESTIONS[currentQuestion].question, selectedAnswer: answer, correctAnswer: QUESTIONS[currentQuestion].correctAnswer, isCorrect, timedOut: false }])
    setShowFeedback(true)
    setTimeout(() => moveToNextQuestion(), 3000)
  }

  const moveToNextQuestion = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
      setTimeLeft(TIME_PER_QUESTION)
    } else {
      finishGame()
    }
  }

  const finishGame = () => {
    setGameFinished(true)
    const finalScore = answers.filter(a => a.isCorrect).length + (selectedAnswer === QUESTIONS[currentQuestion].correctAnswer ? 1 : 0)
    sessionStorage.setItem('remedial_step3_b1_taskF_score', finalScore)
    logTaskCompletion(finalScore)
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskF', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ level: 'B1', task: 'F', step: 2, score: finalScore, max_score: 6, completed: true })
      })
    } catch (error) { console.error('Failed to log task completion:', error) }
  }

  const handleAnswerClick = (answer) => {
    if (showFeedback) return
    setSelectedAnswer(answer)
    handleAnswerSubmit(answer)
  }

  const progressPercent = ((currentQuestion + 1) / QUESTIONS.length) * 100
  const currentQ = QUESTIONS[currentQuestion]

  if (!gameStarted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx('orange'), mb: 3 }}>
              <Typography variant="h4" gutterBottom fontWeight="bold">Phase 4 - Step 3: Remedial Activities</Typography>
              <Typography variant="h5" gutterBottom>Level B1 - Task F: Grammar Kahoot 🎯 (BONUS)</Typography>
              <Typography variant="body1">Timed quiz rounds - compete for the leaderboard!</Typography>
              <Box sx={{ ...cardSx('yellow'), mt: 2 }}>
                <Typography variant="body2" fontWeight="bold">
                  ⭐ Bonus Task: This is an optional task worth 6 bonus points. Complete it to boost your total score!
                </Typography>
              </Box>
            </Box>
            <Box sx={{ ...cardSx('blue'), mb: 3 }}>
              <CharacterMessage character="MS. MABROUKI" message="Welcome to Grammar Kahoot! 🎉 Test your subject-verb agreement skills with 6 timed questions. You have 15 seconds per question. Choose the correct grammar form to score points. All correct answers = 6 bonus points! Ready? Let's go! 🚀" />
            </Box>
            <Box sx={{ ...cardSx('purple'), textAlign: 'center', p: 5 }}>
              <EmojiEventsIcon sx={{ fontSize: 80, mb: 2, color: P.purple.border }} />
              <Typography variant="h4" gutterBottom fontWeight="bold">Grammar Kahoot Challenge</Typography>
              <Typography variant="h6" sx={{ mb: 4 }}>6 Questions • 15 Seconds Each • Subject-Verb Agreement</Typography>
              <Box
                component="button"
                onClick={() => setGameStarted(true)}
                sx={{
                  ...cardSx('orange'), cursor: 'pointer', px: 8, py: 2,
                  fontSize: '1.4rem', fontWeight: 'bold', color: P.orange.border, transition: 'all 0.2s',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }
                }}
              >
                START GAME! 🎮
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    )
  }

  if (gameFinished) {
    const finalScore = answers.filter(a => a.isCorrect).length
    const passedAll = finalScore === 6
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx('orange'), mb: 3 }}>
              <Typography variant="h4" gutterBottom fontWeight="bold">Phase 4 - Step 3: Remedial Activities</Typography>
              <Typography variant="h5">Level B1 - Task F: Grammar Kahoot - Results 🏆</Typography>
            </Box>
            <Box sx={{ ...cardSx('purple'), textAlign: 'center', p: 5, mb: 3 }}>
              <EmojiEventsIcon sx={{ fontSize: 72, mb: 2, color: P.purple.border }} />
              <Typography variant="h3" gutterBottom fontWeight="bold">{passedAll ? 'Perfect Score! 🎉' : 'Game Complete! 🎊'}</Typography>
              <Box sx={{ ...cardSx('yellow'), maxWidth: 280, mx: 'auto', my: 3 }}>
                <Typography variant="h2" fontWeight="bold" sx={{ color: P.purple.border }}>{finalScore} / 6</Typography>
                <Typography variant="h6" color="text.secondary">Bonus Points Earned</Typography>
              </Box>
              {passedAll && (
                <Box sx={{ ...cardSx('green'), mt: 2 }}>
                  <Typography fontWeight="bold">Amazing! You got all questions correct! You're a grammar master! 🌟</Typography>
                </Box>
              )}
            </Box>

            <Box sx={{ ...cardSx('blue'), mb: 3 }}>
              <Typography variant="h5" gutterBottom fontWeight="bold">Question Review</Typography>
              <Stack spacing={2} sx={{ mt: 2 }}>
                {answers.map((answer, index) => (
                  <Box
                    key={answer.questionId}
                    sx={{
                      bgcolor: answer.isCorrect ? P.green.bg : P.red.bg,
                      border: `2px solid ${answer.isCorrect ? P.green.border : P.red.border}`,
                      borderRadius: '16px', p: 3,
                      boxShadow: `3px 3px 0 ${answer.isCorrect ? P.green.shadow : P.red.shadow}`,
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold">Question {index + 1}</Typography>
                      {answer.isCorrect ? <CheckCircleIcon sx={{ color: P.green.border }} /> : <CancelIcon sx={{ color: P.red.border }} />}
                    </Stack>
                    <Typography variant="h6" sx={{ mb: 2 }}>{answer.question}</Typography>
                    {answer.timedOut ? (
                      <Box sx={{ ...cardSx('yellow'), p: 2 }}>
                        <Typography variant="body2">⏰ <strong>Time's up!</strong> No answer selected.</Typography>
                      </Box>
                    ) : (
                      <Typography variant="body1">
                        Your answer: <strong style={{ color: answer.isCorrect ? P.green.border : P.red.border }}>{answer.selectedAnswer}</strong>
                      </Typography>
                    )}
                    {!answer.isCorrect && (
                      <Box sx={{ ...cardSx('red'), mt: 2, p: 2 }}>
                        <Typography variant="body2"><strong>Correct Answer:</strong> {answer.correctAnswer}<br />{QUESTIONS[index].explanation}</Typography>
                      </Box>
                    )}
                    {answer.isCorrect && (
                      <Box sx={{ ...cardSx('green'), mt: 2, p: 2 }}>
                        <Typography variant="body2"><strong>Correct!</strong> {QUESTIONS[index].explanation}</Typography>
                      </Box>
                    )}
                  </Box>
                ))}
              </Stack>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Box
                component="button"
                onClick={() => navigate('/phase4/step3/remedial/b1/results')}
                sx={{
                  ...cardSx('green'), cursor: 'pointer', px: 6, py: 2,
                  fontWeight: 'bold', fontSize: '1.1rem', color: P.green.border, transition: 'all 0.2s',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }
                }}
              >
                View Final Results →
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    )
  }

  // Game in progress
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>

          <Box sx={{ ...cardSx('purple'), mb: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h5" fontWeight="bold">Question {currentQuestion + 1} / {QUESTIONS.length}</Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Stack direction="row" spacing={1} alignItems="center">
                  <EmojiEventsIcon />
                  <Typography variant="h6">Score: {score}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TimerIcon />
                  <Typography variant="h6" sx={{ color: timeLeft <= 5 ? P.red.border : 'inherit', fontWeight: timeLeft <= 5 ? 'bold' : 'normal' }}>
                    {timeLeft}s
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={progressPercent}
              sx={{ mt: 2, height: 8, borderRadius: 4, bgcolor: 'rgba(0,0,0,0.1)', '& .MuiLinearProgress-bar': { bgcolor: P.orange.border } }}
            />
          </Box>

          {/* Question Card */}
          <Box
            sx={{
              ...cardSx(showFeedback ? (selectedAnswer === currentQ.correctAnswer ? 'green' : 'red') : 'blue'),
              mb: 3, minHeight: 350, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 5
            }}
          >
            <Typography variant="h3" align="center" gutterBottom fontWeight="bold" sx={{ mb: 5 }}>
              {currentQ.question}
            </Typography>

            {!showFeedback ? (
              <Stack spacing={3} sx={{ width: '100%' }}>
                {currentQ.options.map((option, index) => (
                  <Box
                    key={index}
                    component="button"
                    onClick={() => handleAnswerClick(option)}
                    disabled={showFeedback}
                    sx={{
                      bgcolor: selectedAnswer === option ? P.blue.border : P.blue.bg,
                      border: `2px solid ${P.blue.border}`, borderRadius: '16px',
                      boxShadow: `4px 4px 0 ${P.blue.shadow}`,
                      py: 2.5, fontWeight: 'bold', fontSize: '1.4rem', cursor: 'pointer',
                      color: selectedAnswer === option ? 'white' : 'inherit', transition: 'all 0.2s',
                      '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` }
                    }}
                  >
                    {option}
                  </Box>
                ))}
              </Stack>
            ) : (
              <Box sx={{ textAlign: 'center' }}>
                {selectedAnswer === currentQ.correctAnswer ? (
                  <>
                    <CheckCircleIcon sx={{ fontSize: 80, mb: 2, color: P.green.border }} />
                    <Typography variant="h4" gutterBottom fontWeight="bold">Correct! 🎉</Typography>
                    <Typography variant="h6">{currentQ.explanation}</Typography>
                  </>
                ) : (
                  <>
                    <CancelIcon sx={{ fontSize: 80, mb: 2, color: P.red.border }} />
                    <Typography variant="h4" gutterBottom fontWeight="bold">{selectedAnswer ? 'Not quite!' : "Time's up!"}</Typography>
                    <Typography variant="h6" sx={{ mb: 2 }}>Correct answer: <strong>{currentQ.correctAnswer}</strong></Typography>
                    <Typography variant="body1">{currentQ.explanation}</Typography>
                  </>
                )}
              </Box>
            )}
          </Box>

          {timeLeft <= 5 && !showFeedback && (
            <Box sx={{ ...cardSx('orange') }}>
              <Typography fontWeight="bold">⚡ Hurry! Only {timeLeft} seconds left!</Typography>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
