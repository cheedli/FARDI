import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, LinearProgress, Chip, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import TimerIcon from '@mui/icons-material/Timer'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import QuizIcon from '@mui/icons-material/Quiz'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 2 - Remedial C1 - Task F: Relative Clauses Quiz
 * Kahoot-style quiz with 6 multiple choice questions
 * Score: +1 for each correct answer = 6 points maximum
 */

const QUESTIONS = [
  { id: 1, question: 'Hashtags ___ boost reach are essential.', options: [{ id: 'A', text: 'that', correct: true, color: '#e21b3c' }, { id: 'B', text: 'which', correct: false, color: '#1368ce' }], correctAnswer: 'A', explanation: 'Defining relative clause - "that" specifies which hashtags' },
  { id: 2, question: 'Captions, ___ engage audiences, are crucial.', options: [{ id: 'A', text: 'which', correct: true, color: '#e21b3c' }, { id: 'B', text: 'that', correct: false, color: '#1368ce' }], correctAnswer: 'A', explanation: 'Non-defining relative clause - "which" adds extra info (use commas)' },
  { id: 3, question: 'Emojis ___ convey tone are effective.', options: [{ id: 'A', text: 'that', correct: true, color: '#e21b3c' }, { id: 'B', text: 'which', correct: false, color: '#1368ce' }], correctAnswer: 'A', explanation: 'Defining relative clause - "that" specifies which emojis' },
  { id: 4, question: 'CTAs, ___ drive action, are direct.', options: [{ id: 'A', text: 'which', correct: true, color: '#e21b3c' }, { id: 'B', text: 'that', correct: false, color: '#1368ce' }], correctAnswer: 'A', explanation: 'Non-defining relative clause - "which" provides additional info' },
  { id: 5, question: 'Tags ___ amplify reach are strategic.', options: [{ id: 'A', text: 'that', correct: true, color: '#e21b3c' }, { id: 'B', text: 'which', correct: false, color: '#1368ce' }], correctAnswer: 'A', explanation: 'Defining relative clause - "that" identifies which tags' },
  { id: 6, question: 'Viral posts, ___ spread fast, need quality.', options: [{ id: 'A', text: 'which', correct: true, color: '#e21b3c' }, { id: 'B', text: 'that', correct: false, color: '#1368ce' }], correctAnswer: 'A', explanation: 'Non-defining relative clause - "which" adds extra information' }
]

const TIME_PER_QUESTION = 20

export default function Phase4_2Step2RemedialC1TaskF() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const LIGHT = {
    pageBg: '#FFFDE7',
    blue:   { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
    green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
    yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
    purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
    teal:   { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
    orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
    red:    { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
  }
  const DARK = {
    pageBg: '#0F0F1A',
    blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
    green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
    yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
    purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
    teal:   { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
    orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
    red:    { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
  }
  const P = isDark ? DARK : LIGHT

  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 2, interaction: 6, context: 'remedial_c1' })
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
    } else {
      handleSubmitAnswer(null)
    }
  }, [timeLeft, gameStarted, gameFinished, showResult])

  const handleStartGame = () => { setGameStarted(true) }

  const handleAnswerSelect = (optionId) => {
    if (showResult) return
    setSelectedAnswer(optionId)
    setTimeout(() => { handleSubmitAnswer(optionId) }, 500)
  }

  const handleSubmitAnswer = (answer) => {
    const isCorrect = answer === currentQuestion.correctAnswer
    const newAnswers = [...answers, { questionId: currentQuestion.id, question: currentQuestion.question, userAnswer: answer, correctAnswer: currentQuestion.correctAnswer, explanation: currentQuestion.explanation, isCorrect }]
    setAnswers(newAnswers)
    if (isCorrect) setScore(score + 1)
    setShowResult(true)
    setTimeout(() => {
      if (currentQuestionIndex < QUESTIONS.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setSelectedAnswer(null)
        setShowResult(false)
        setTimeLeft(TIME_PER_QUESTION)
      } else {
        handleFinishQuiz(newAnswers)
      }
    }, 2000)
  }

  const handleFinishQuiz = (finalAnswers) => {
    setGameFinished(true)
    const rawScore = finalAnswers.filter(a => a.isCorrect).length
    sessionStorage.setItem('phase4_2_step2_remedial_c1_taskF_score', rawScore)
    sessionStorage.setItem('phase4_2_step2_remedial_c1_taskF_max', '6')
    logTaskCompletion(rawScore, rawScore)
  }

  const logTaskCompletion = async (finalScore, rawScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskF', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 2, level: 'C1', task: 'F', score: finalScore, max_score: 6, completed: true })
      })
    } catch (error) { console.error('Failed to log task completion:', error) }
  }

  const handleContinue = () => { navigate('/phase4_2/step/2/remedial/c1/results') }

  if (!gameStarted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

            <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>
                Phase 4.2 - Step 2: Remedial Activities
              </Typography>
              <Typography variant="h5" gutterBottom sx={{ color: P.orange.shadow }}>
                Level C1 - Task F: Relative Clauses Quiz
              </Typography>
              <Typography variant="body1" sx={{ color: P.orange.shadow }}>
                Fast-paced relative clause challenge!
              </Typography>
            </Box>

            <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
              <CharacterMessage
                speaker="Emna"
                message="Welcome to the Relative Clauses Quiz! Answer 6 rapid-fire questions about which vs that. You have 20 seconds per question. Select your answer quickly - choose between defining (that) and non-defining (which) relative clauses! Score: 1 point per correct answer = 6 points total. Ready? Let's go!"
              />
            </Box>

            {/* Kahoot-style splash — purple preserved */}
            <Paper elevation={6} sx={{ p: 4, textAlign: 'center', background: 'linear-gradient(135deg, #46178f 0%, #8e44ad 100%)', position: 'relative', overflow: 'hidden', borderRadius: '20px' }}>
              <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJzbWFsbEdyaWQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAyMCAwIEwgMCAwIDAgMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjc21hbGxHcmlkKSIvPjwvc3ZnPg==)', opacity: 0.3 }}/>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <QuizIcon sx={{ fontSize: 120, color: 'white', mb: 2 }} />
                <Typography variant="h3" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>kahoot!</Typography>
                <Typography variant="h5" sx={{ color: 'white', mb: 4 }}>6 Questions • 20 Seconds Each • Which vs That</Typography>
                <Button variant="contained" size="large" onClick={handleStartGame} sx={{ py: 3, px: 10, fontSize: '1.8rem', fontWeight: 'bold', backgroundColor: 'white', color: '#46178f', borderRadius: '50px', '&:hover': { backgroundColor: '#f0f0f0', transform: 'scale(1.05)' }, transition: 'all 0.2s' }}>
                  START
                </Button>
              </Box>
            </Paper>

          </motion.div>
        </Container>
      </Box>
    )
  }

  if (gameFinished) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

            <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.purple.shadow }}>
                Phase 4.2 - Step 2: Remedial Activities
              </Typography>
              <Typography variant="h5" sx={{ color: P.purple.shadow }}>
                Level C1 - Task F: Results
              </Typography>
            </Box>

            {/* Score */}
            <Box sx={{
              bgcolor: score === 6 ? P.green.bg : P.purple.bg,
              border: `3px solid ${score === 6 ? P.green.border : P.purple.border}`,
              borderRadius: '20px',
              boxShadow: `4px 4px 0 ${score === 6 ? P.green.shadow : P.purple.shadow}`,
              p: 5, mb: 3, textAlign: 'center'
            }}>
              <EmojiEventsIcon sx={{ fontSize: 100, color: score === 6 ? P.green.shadow : P.purple.shadow, mb: 2 }} />
              <Typography variant="h2" gutterBottom fontWeight="bold" sx={{ color: score === 6 ? P.green.shadow : P.purple.shadow }}>
                {score === 6 ? 'PERFECT!' : 'GREAT JOB!'}
              </Typography>
              <Box sx={{ bgcolor: isDark ? '#1a1a2e' : 'white', border: `2px solid ${score === 6 ? P.green.border : P.purple.border}`, borderRadius: '16px', p: 4, maxWidth: 350, mx: 'auto', my: 4 }}>
                <Typography variant="h1" fontWeight="bold" sx={{ color: score === 6 ? P.green.shadow : P.purple.shadow, fontSize: '5rem' }}>
                  {score}
                </Typography>
                <Typography variant="h4" sx={{ color: isDark ? '#aaa' : '#666' }} fontWeight="bold">out of {QUESTIONS.length}</Typography>
                <Typography variant="h6" sx={{ color: isDark ? '#aaa' : '#666', mt: 1 }}>
                  {Math.round((score / QUESTIONS.length) * 100)}% correct
                </Typography>
              </Box>
            </Box>

            {/* Answer Review */}
            <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow, mb: 3 }}>
                Answer Review
              </Typography>
              <Stack spacing={2}>
                {answers.map((answer, index) => {
                  const question = QUESTIONS[index]
                  const correctOptionText = question.options.find(opt => opt.id === answer.correctAnswer)?.text
                  const userOptionText = question.options.find(opt => opt.id === answer.userAnswer)?.text
                  return (
                    <Box key={index} sx={{
                      bgcolor: answer.isCorrect ? P.green.bg : P.red.bg,
                      border: `2px solid ${answer.isCorrect ? P.green.border : P.red.border}`,
                      borderRadius: '14px', p: 3,
                      borderLeft: `6px solid ${answer.isCorrect ? P.green.border : P.red.border}`
                    }}>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                        <Box sx={{ bgcolor: P.purple.bg, border: `1px solid ${P.purple.border}`, borderRadius: '8px', px: 1.5, py: 0.5 }}>
                          <Typography variant="body2" fontWeight="bold" sx={{ color: P.purple.shadow }}>Q{index + 1}</Typography>
                        </Box>
                        <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#eee' : '#2c3e50', flex: 1 }}>{answer.question}</Typography>
                        {answer.isCorrect ? <CheckCircleIcon sx={{ color: P.green.shadow, fontSize: 32 }} /> : <CancelIcon sx={{ color: P.red.shadow, fontSize: 32 }} />}
                      </Stack>
                      <Stack direction="row" spacing={3} sx={{ ml: 2, mb: 2 }}>
                        <Box>
                          <Typography variant="body2" sx={{ color: isDark ? '#aaa' : '#7f8c8d', fontWeight: 600, mb: 0.5 }}>Your answer:</Typography>
                          <Typography variant="h6" sx={{ color: answer.isCorrect ? P.green.shadow : P.red.shadow, fontWeight: 'bold' }}>
                            {userOptionText || 'No answer'}
                          </Typography>
                        </Box>
                        {!answer.isCorrect && (
                          <Box>
                            <Typography variant="body2" sx={{ color: isDark ? '#aaa' : '#7f8c8d', fontWeight: 600, mb: 0.5 }}>Correct answer:</Typography>
                            <Typography variant="h6" sx={{ color: P.green.shadow, fontWeight: 'bold' }}>{correctOptionText}</Typography>
                          </Box>
                        )}
                      </Stack>
                      <Box sx={{ ml: 2, p: 2, bgcolor: isDark ? '#1a1a2e' : 'rgba(255,255,255,0.7)', borderRadius: '10px' }}>
                        <Typography variant="body2" sx={{ color: isDark ? '#ccc' : '#2c3e50', fontStyle: 'italic' }}>
                          {answer.explanation}
                        </Typography>
                      </Box>
                    </Box>
                  )
                })}
              </Stack>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Box component="button" onClick={handleContinue} sx={{
                bgcolor: P.green.bg,
                border: `2px solid ${P.green.border}`,
                borderRadius: '12px',
                boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 6, py: 1.5,
                fontWeight: 700, fontSize: '1.3rem',
                cursor: 'pointer', color: P.green.shadow,
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
              }}>
                Continue to Results →
              </Box>
            </Box>

          </motion.div>
        </Container>
      </Box>
    )
  }

  // ───── Game in progress — Kahoot purple full-screen (preserved) ─────
  const progress = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100
  const currentAnswered = answers.filter(a => a.isCorrect).length

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #46178f 0%, #8e44ad 100%)', p: 3 }}>
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        {/* Top Bar */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Paper sx={{ px: 3, py: 1.5, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="h5" fontWeight="bold" sx={{ color: '#8e44ad' }}>
                Question {currentQuestionIndex + 1} / {QUESTIONS.length}
              </Typography>
            </Stack>
          </Paper>
          <Stack direction="row" spacing={2}>
            <Paper sx={{ px: 3, py: 1.5, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <EmojiEventsIcon sx={{ color: '#f39c12', fontSize: 28 }} />
                <Typography variant="h5" fontWeight="bold" sx={{ color: '#2c3e50' }}>{currentAnswered} / {QUESTIONS.length}</Typography>
              </Stack>
            </Paper>
            <Paper sx={{ px: 3, py: 1.5, backgroundColor: timeLeft <= 5 ? '#e74c3c' : 'rgba(255,255,255,0.95)', borderRadius: 2, animation: timeLeft <= 5 ? 'pulse 1s infinite' : 'none', '@keyframes pulse': { '0%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.05)' }, '100%': { transform: 'scale(1)' } } }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <TimerIcon sx={{ color: timeLeft <= 5 ? 'white' : '#e74c3c', fontSize: 28 }} />
                <Typography variant="h5" fontWeight="bold" sx={{ color: timeLeft <= 5 ? 'white' : '#2c3e50', minWidth: 50 }}>{timeLeft}s</Typography>
              </Stack>
            </Paper>
          </Stack>
        </Stack>

        {/* Progress Bar */}
        <LinearProgress variant="determinate" value={progress} sx={{ mb: 3, height: 12, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.3)', '& .MuiLinearProgress-bar': { backgroundColor: 'white', borderRadius: 2 } }} />

        {/* Question */}
        <Paper elevation={8} sx={{ p: 5, mb: 4, backgroundColor: 'white', borderRadius: 3, minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="h3" sx={{ color: '#2c3e50', fontWeight: 'bold', textAlign: 'center' }}>
            {currentQuestion.question}
          </Typography>
        </Paper>

        {/* Answer Options - Kahoot Style Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          {currentQuestion.options.map((option, index) => {
            const shapes = [{ shape: '▲', rotation: 0 }, { shape: '◆', rotation: 45 }]
            const shapeData = shapes[index]
            const isSelected = selectedAnswer === option.id
            const isCorrectOption = option.correct
            const showAnswer = showResult
            let backgroundColor = option.color
            if (showAnswer) { backgroundColor = isCorrectOption ? '#27ae60' : '#95a5a6' } else if (isSelected) { backgroundColor = option.color }
            return (
              <Paper key={option.id} elevation={isSelected ? 12 : 6} onClick={() => handleAnswerSelect(option.id)} sx={{ p: 4, backgroundColor, color: 'white', cursor: showResult ? 'default' : 'pointer', transform: isSelected ? 'scale(1.03)' : 'scale(1)', transition: 'all 0.2s', borderRadius: 3, minHeight: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', opacity: showResult && !isCorrectOption ? 0.6 : 1, '&:hover': { transform: showResult ? 'scale(1)' : 'scale(1.03)' } }}>
                <Stack spacing={2} alignItems="center" sx={{ width: '100%' }}>
                  <Typography variant="h2" sx={{ fontWeight: 'bold', transform: `rotate(${shapeData.rotation}deg)` }}>{shapeData.shape}</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center' }}>{option.text}</Typography>
                </Stack>
                {showAnswer && isCorrectOption && (
                  <CheckCircleIcon sx={{ position: 'absolute', top: 16, right: 16, fontSize: 48, color: 'white' }} />
                )}
              </Paper>
            )
          })}
        </Box>

        {showResult && (
          <Paper elevation={8} sx={{ mt: 3, p: 3, backgroundColor: selectedAnswer === currentQuestion.correctAnswer ? '#27ae60' : '#e74c3c', color: 'white', borderRadius: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
              {selectedAnswer === currentQuestion.correctAnswer ? '✓ Correct!' : selectedAnswer ? '✗ Incorrect' : "⏰ Time's up!"}
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  )
}
