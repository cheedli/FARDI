import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container, useTheme, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'
import { motion } from 'framer-motion'

/**
 * Phase 4 Step 4 - Remedial B1 - Task F: Grammar Kahoot
 * 6 questions, 20-second timer, 3-option MCQ
 */

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

const BUTTON_COLORS = [
  { bg: '#E11D48', shadow: '#9F1239' },
  { bg: '#2563EB', shadow: '#1D4ED8' },
  { bg: '#D97706', shadow: '#92400E' },
]

const QUIZ_QUESTIONS = [
  { id: 1, question: '"Gatefold are" - What type of error?', answers: ['Agreement', 'Spelling', 'Punctuation'], correctIndex: 0, explanation: 'This is a subject-verb agreement error: "Gatefold" is singular, so it should be "Gatefold is" not "are".' },
  { id: 2, question: '"Animation move" - What type of error?', answers: ['Verb form', 'Spelling', 'Punctuation'], correctIndex: 0, explanation: 'This is a verb form error: needs "is" or "moves" - should be "Animation moves".' },
  { id: 3, question: '"Slogan is words" - What type of error?', answers: ['Agreement', 'Spelling', 'Tense'], correctIndex: 0, explanation: 'This is a subject-verb-complement agreement error: "Slogan" is singular, so it should be "is word".' },
  { id: 4, question: '"Clip is parts" - What type of error?', answers: ['Agreement', 'Spelling', 'Tense'], correctIndex: 0, explanation: 'This is a subject-verb-complement agreement error: "Clip" is singular, so it should be "is part".' },
  { id: 5, question: '"Jingle is songs" - What type of error?', answers: ['Agreement', 'Spelling', 'Punctuation'], correctIndex: 0, explanation: 'This is a subject-verb-complement agreement error: "Jingle" is singular, so it should be "is song".' },
  { id: 6, question: '"Feature is highlights" - What type of error?', answers: ['Agreement', 'Spelling', 'Tense'], correctIndex: 0, explanation: 'This is a subject-verb-complement agreement error: "Feature" is singular, so it should be "is highlight".' },
]

export default function Phase4Step5RemedialB1TaskF() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 6, context: 'remedial_b1' })
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
      return { ...question, answers: shuffled, correctIndex: shuffled.findIndex(a => a === correctAnswer) }
    })
  }, [])

  const currentQuestion = shuffledQuestions[currentQuestionIndex]
  const totalQuestions = shuffledQuestions.length

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

  const handleTimeUp = () => {
    setShowResult(true)
    setTimeout(() => moveToNextQuestion(), 3000)
  }

  const handleAnswerClick = (answerIndex) => {
    if (showResult || selectedAnswer !== null) return
    setSelectedAnswer(answerIndex)
    const isCorrect = answerIndex === currentQuestion.correctIndex
    if (isCorrect) setScore(s => s + 1)
    setShowResult(true)
    setTimeout(() => moveToNextQuestion(), 3000)
  }

  const moveToNextQuestion = () => {
    if (currentQuestionIndex + 1 < totalQuestions) {
      setCurrentQuestionIndex(i => i + 1); setSelectedAnswer(null); setShowResult(false); setTimeLeft(20)
    } else {
      setQuizCompleted(true)
      const finalScore = score + (selectedAnswer === currentQuestion.correctIndex ? 1 : 0)
      sessionStorage.setItem('phase4_step5_remedial_b1_taskF_score', finalScore)
      logTaskCompletion(finalScore)
    }
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskF', is_correct: true, score: finalScore })
    try { await fetch('/api/phase4/step5/remedial/log', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ level: 'B1', task: 'F', score: finalScore, max_score: 6, completed: true }) }) } catch (e) { console.error(e) }
  }

  const handleContinue = () => navigate('/phase4/step/4/remedial/b1/results')
  window.__remedialSkip = handleContinue

  if (!gameStarted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.orange.shadow }}>Phase 4 Step 4: Evaluate - Remedial Practice</Typography>
              <Typography variant="h6" sx={{ color: P.orange.border }}>Level B1 - Task F: Grammar Kahoot 🎯</Typography>
              <Typography variant="body2" sx={{ color: P.orange.shadow, mt: 0.5 }}>Final challenge! Identify grammar error types in 6 sentences.</Typography>
            </Box>
            <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
              <CharacterMessage character="LILIA" message="Final task! Time for the Grammar Kahoot! 🎮 You'll see 6 sentences with errors. For each one, identify the error type. You have 20 seconds per question. Good luck! 🎮" />
            </Box>
            <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 5, textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" sx={{ color: P.purple.shadow, mb: 1 }}>Ready for the Final Challenge?</Typography>
              <Typography variant="h6" sx={{ color: P.purple.border, mb: 3 }}>6 Questions · 20 seconds each</Typography>
              <Box component="button" onClick={() => { setGameStarted(true); setTimeLeft(20) }} sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '16px', boxShadow: `4px 4px 0 ${P.green.shadow}`, px: 5, py: 2, cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold', color: P.green.shadow, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` } }}>Start Grammar Kahoot 🎯</Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    )
  }

  if (quizCompleted) {
    const finalScore = parseInt(sessionStorage.getItem('phase4_step5_remedial_b1_taskF_score') || String(score))
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.orange.shadow }}>Phase 4 Step 4: Evaluate - Remedial Practice</Typography>
              <Typography variant="h6" sx={{ color: P.orange.border }}>Level B1 - Task F: Grammar Kahoot 🎯</Typography>
            </Box>
            <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 5, textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" sx={{ color: P.purple.shadow, mb: 3 }}>All Tasks Complete! 🎉</Typography>
              <Box sx={{ bgcolor: P.pageBg, border: `2px solid ${P.green.border}`, borderRadius: '16px', boxShadow: `4px 4px 0 ${P.green.shadow}`, p: 4, maxWidth: 300, mx: 'auto', mb: 4 }}>
                <Typography variant="h2" fontWeight="bold" sx={{ color: P.green.shadow }}>{finalScore} / 6</Typography>
                <Typography variant="h6" sx={{ color: P.green.border }}>Final Task Score</Typography>
              </Box>
              <Box component="button" onClick={handleContinue} sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '16px', boxShadow: `4px 4px 0 ${P.green.shadow}`, px: 5, py: 2, cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', color: P.green.shadow, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` } }}>View Final Results →</Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 3, mb: 3 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight="bold" sx={{ color: P.purple.shadow }}>Question {currentQuestionIndex + 1} / {totalQuestions}</Typography>
            <Box sx={{ textAlign: 'center' }}>
              <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                <Typography variant="body2" sx={{ color: P.purple.border }}>⏱</Typography>
                <Typography variant="h3" fontWeight="bold" sx={{ color: timeLeft <= 5 ? P.red.border : P.purple.shadow, animation: timeLeft <= 5 ? 'pulse 1s infinite' : 'none', '@keyframes pulse': { '0%,100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.15)' } } }}>{timeLeft}</Typography>
              </Stack>
              <LinearProgress variant="determinate" value={(timeLeft / 20) * 100} sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(0,0,0,0.1)', '& .MuiLinearProgress-bar': { bgcolor: timeLeft <= 5 ? P.red.border : P.green.border } }} />
            </Box>
            <Typography variant="h5" fontWeight="bold" sx={{ color: P.purple.shadow }}>Score: {score} / 6</Typography>
          </Stack>
        </Box>

        <Box sx={{ bgcolor: P.purple.border, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 4, mb: 3, minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="h4" fontWeight="bold" align="center" sx={{ color: '#fff' }}>{currentQuestion?.question}</Typography>
        </Box>

        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          {currentQuestion?.answers.map((answer, index) => {
            const isSelected = selectedAnswer === index
            const isCorrect = index === currentQuestion.correctIndex
            const showCorrect = showResult && isCorrect
            const showIncorrect = showResult && isSelected && !isCorrect
            const btnColor = BUTTON_COLORS[index]
            return (
              <Box key={index} component="button" onClick={() => handleAnswerClick(index)} disabled={showResult}
                sx={{ flex: 1, py: 4, cursor: showResult ? 'not-allowed' : 'pointer', bgcolor: showCorrect ? '#16A34A' : showIncorrect ? '#DC2626' : btnColor.bg, border: '3px solid #fff', borderRadius: '16px', boxShadow: `4px 4px 0 ${showCorrect ? '#14532D' : showIncorrect ? '#991B1B' : btnColor.shadow}`, fontWeight: 'bold', fontSize: '1.1rem', color: '#fff', transition: 'all 0.2s', '&:hover': showResult ? {} : { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${btnColor.shadow}` } }}>
                <Stack spacing={1} alignItems="center">
                  {showCorrect && <Typography sx={{ fontSize: '1.5rem' }}>✓</Typography>}
                  {showIncorrect && <Typography sx={{ fontSize: '1.5rem' }}>✗</Typography>}
                  <Typography fontWeight="bold">{answer}</Typography>
                </Stack>
              </Box>
            )
          })}
        </Stack>

        {showResult && (
          <Box sx={{ bgcolor: selectedAnswer === currentQuestion.correctIndex ? P.green.bg : P.red.bg, border: `2px solid ${selectedAnswer === currentQuestion.correctIndex ? P.green.border : P.red.border}`, borderRadius: '16px', boxShadow: `3px 3px 0 ${selectedAnswer === currentQuestion.correctIndex ? P.green.shadow : P.red.shadow}`, p: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: selectedAnswer === currentQuestion.correctIndex ? P.green.shadow : P.red.shadow }}>
              {selectedAnswer === currentQuestion.correctIndex ? '✓ Correct!' : '✗ Incorrect'}
            </Typography>
            <Typography variant="body1" sx={{ color: selectedAnswer === currentQuestion.correctIndex ? P.green.shadow : P.red.shadow }}>
              <strong>Explanation:</strong> {currentQuestion.explanation}
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  )
}
