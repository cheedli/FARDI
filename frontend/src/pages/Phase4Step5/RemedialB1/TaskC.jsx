import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, LinearProgress, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import TimerIcon from '@mui/icons-material/Timer'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 5 - Remedial B1 - Task C: Wordshake Quiz
 * Identify error type in 6 sentences
 * Score: +1 for each correct answer (6 total)
 */

const QUIZ_QUESTIONS = [
  { id: 1, question: '"Gatfold is" - What type of error?', answers: ['Spelling', 'Grammar', 'Punctuation'], correctIndex: 0, explanation: 'This is a spelling error: "Gatfold" should be "Gatefold" (missing the second "e").' },
  { id: 2, question: '"Poster hav" - What type of error?', answers: ['Spelling', 'Grammar', 'Punctuation'], correctIndex: 1, explanation: 'This is a grammar error: "hav" should be "has" (subject-verb agreement).' },
  { id: 3, question: '"Colors red" - What type of error?', answers: ['Spelling', 'Grammar', 'Punctuation'], correctIndex: 1, explanation: 'This is a grammar error: missing the verb "are" - should be "Colors are red".' },
  { id: 4, question: '"Titel is Festival" - What type of error?', answers: ['Spelling', 'Grammar', 'Punctuation'], correctIndex: 0, explanation: 'This is a spelling error: "Titel" should be "Title".' },
  { id: 5, question: '"Animation move" - What type of error?', answers: ['Spelling', 'Grammar', 'Punctuation'], correctIndex: 1, explanation: 'This is a grammar error: missing the verb "is" or needs "moves".' },
  { id: 6, question: '"Jingle is songs" - What type of error?', answers: ['Spelling', 'Grammar', 'Punctuation'], correctIndex: 1, explanation: 'This is a grammar error: "songs" should be singular "song".' }
]

export default function Phase4Step5RemedialB1TaskC() {
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

  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 3, context: 'remedial_b1' })
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

  const answerColors = [P.red, P.blue, P.yellow]

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
      sessionStorage.setItem('phase4_step5_remedial_b1_taskC_score', finalScore)
      logTaskCompletion(finalScore)
    }
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/step5/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ level: 'B1', task: 'C', score: finalScore, max_score: 6, completed: true })
      })
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => { navigate('/phase4/step/5/remedial/b1/taskD') }
  window.__remedialSkip = handleContinue

  if (!gameStarted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Box sx={{
              bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
              p: 3, mb: 3,
            }}>
              <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>
                Phase 4 Step 5: Evaluate - Remedial Practice
              </Typography>
              <Typography variant="h5" gutterBottom sx={{ color: P.blue.shadow }}>
                Level B1 - Task C: Wordshake Quiz
              </Typography>
              <Typography variant="body1" sx={{ color: P.blue.shadow }}>
                Test your error detection skills! Identify error types in 6 sentences.
              </Typography>
            </Box>

            <Box sx={{
              bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
              p: 3, mb: 3,
            }}>
              <CharacterMessage character="LILIA" message="Excellent progress! Now test your knowledge with the Wordshake Quiz. You'll see 6 sentences with errors. For each one, identify whether it's a SPELLING, GRAMMAR, or PUNCTUATION error. You have 20 seconds per question. Good luck!" />
            </Box>

            <Box sx={{
              bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`,
              p: 6, textAlign: 'center',
            }}>
              <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: P.purple.shadow }}>
                Ready to Start?
              </Typography>
              <Typography variant="h6" sx={{ color: P.purple.shadow, mb: 4, opacity: 0.8 }}>
                6 Questions · 20 seconds each
              </Typography>
              <Box component="button" onClick={handleStartQuiz} sx={{
                bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.orange.shadow}`,
                px: 6, py: 1.5, fontWeight: 700, fontSize: '1.2rem',
                cursor: 'pointer', color: P.orange.shadow,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.orange.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.orange.shadow}` },
                transition: 'all 0.15s ease',
              }}>
                Start Wordshake Quiz
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    )
  }

  if (quizCompleted) {
    const finalScore = sessionStorage.getItem('phase4_step5_remedial_b1_taskC_score') || score
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Box sx={{
              bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
              p: 3, mb: 3,
            }}>
              <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>
                Phase 4 Step 5: Evaluate - Remedial Practice
              </Typography>
              <Typography variant="h5" sx={{ color: P.blue.shadow }}>
                Level B1 - Task C: Wordshake Quiz
              </Typography>
            </Box>

            <Box sx={{
              bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
              p: 6, textAlign: 'center', mb: 3,
            }}>
              <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: P.green.shadow }}>
                Quiz Complete!
              </Typography>
              <Box sx={{
                bgcolor: isDark ? '#1a1a2e' : '#fff',
                border: `2px solid ${P.green.border}`,
                borderRadius: '16px', p: 3, maxWidth: 300, mx: 'auto', my: 3,
              }}>
                <Typography variant="h2" fontWeight="bold" sx={{ color: P.green.shadow }}>{finalScore} / 6</Typography>
                <Typography variant="h6" sx={{ color: P.green.shadow, opacity: 0.7 }}>Your Score</Typography>
              </Box>
              <Box component="button" onClick={handleContinue} sx={{
                bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.orange.shadow}`,
                px: 6, py: 1.5, fontWeight: 700, fontSize: '1.2rem',
                cursor: 'pointer', color: P.orange.shadow,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.orange.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.orange.shadow}` },
                transition: 'all 0.15s ease',
              }}>
                Continue to Task D →
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {/* Header with timer and score */}
          <Box sx={{
            bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`,
            p: 3, mb: 3,
          }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems="center">
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.purple.shadow }}>
                Question {currentQuestionIndex + 1} / {totalQuestions}
              </Typography>
              <Box sx={{ textAlign: 'center' }}>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                  <TimerIcon sx={{ fontSize: 30, color: P.purple.shadow }} />
                  <Typography variant="h3" fontWeight="bold" sx={{
                    color: timeLeft <= 5 ? P.red.shadow : P.purple.shadow,
                    animation: timeLeft <= 5 ? 'pulse 1s infinite' : 'none',
                    '@keyframes pulse': { '0%, 100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.15)' } }
                  }}>
                    {timeLeft}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={(timeLeft / 20) * 100}
                  sx={{
                    height: 8, borderRadius: 1, mt: 1,
                    bgcolor: isDark ? '#3B1F6E' : '#E9D5FF',
                    '& .MuiLinearProgress-bar': { bgcolor: timeLeft <= 5 ? P.red.shadow : P.purple.shadow }
                  }}
                />
              </Box>
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.purple.shadow }}>
                Score: {score} / 6
              </Typography>
            </Stack>
          </Box>

          {/* Question Display */}
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 4, mb: 3, minHeight: 120,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Typography variant="h4" fontWeight="bold" align="center" sx={{ color: P.blue.shadow }}>
              {currentQuestion?.question}
            </Typography>
          </Box>

          {/* Answer Options */}
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            {currentQuestion?.answers.map((answer, index) => {
              const isSelected = selectedAnswer === index
              const isCorrect = index === currentQuestion.correctIndex
              const showCorrect = showResult && isCorrect
              const showIncorrect = showResult && isSelected && !isCorrect
              const color = showCorrect ? P.green : showIncorrect ? P.red : answerColors[index]

              return (
                <Box component="button" key={index} onClick={() => handleAnswerClick(index)} disabled={showResult} sx={{
                  flex: 1, py: 4, fontSize: '1.2rem', fontWeight: 'bold',
                  bgcolor: color.bg, border: `2px solid ${color.border}`,
                  borderRadius: '16px', boxShadow: `3px 3px 0 ${color.shadow}`,
                  cursor: showResult ? 'default' : 'pointer', color: color.shadow,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
                  '&:hover': !showResult ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${color.shadow}` } : {},
                  transition: 'all 0.2s ease',
                }}>
                  {showCorrect && <CheckCircleIcon sx={{ fontSize: 32 }} />}
                  {showIncorrect && <CancelIcon sx={{ fontSize: 32 }} />}
                  <Typography variant="h6" fontWeight="bold" sx={{ color: color.shadow }}>{answer}</Typography>
                </Box>
              )
            })}
          </Stack>

          {showResult && (
            <Box sx={{
              bgcolor: selectedAnswer === currentQuestion.correctIndex ? P.green.bg : P.red.bg,
              border: `2px solid ${selectedAnswer === currentQuestion.correctIndex ? P.green.border : P.red.border}`,
              borderRadius: '16px', p: 3,
            }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: selectedAnswer === currentQuestion.correctIndex ? P.green.shadow : P.red.shadow }}>
                {selectedAnswer === currentQuestion.correctIndex ? '✓ Correct!' : '✗ Incorrect'}
              </Typography>
              <Typography variant="body1" sx={{ color: selectedAnswer === currentQuestion.correctIndex ? P.green.shadow : P.red.shadow }}>
                <strong>Explanation:</strong> {currentQuestion.explanation}
              </Typography>
            </Box>
          )}
        </motion.div>
      </Container>
    </Box>
  )
}
