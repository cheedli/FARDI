import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container, LinearProgress, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import TimerIcon from '@mui/icons-material/Timer'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import QuizIcon from '@mui/icons-material/Quiz'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 3 - Remedial C1 - Task F: Relative Clauses Quiz
 * Kahoot-style quiz with 6 multiple choice questions
 * Score: +1 for each correct answer = 6 points maximum
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

const QUESTIONS = [
  { id: 1, question: 'Hashtags ___ boost reach are essential.', options: [{ id: 'A', text: 'that', correct: true }, { id: 'B', text: 'which', correct: false }], correctAnswer: 'A', explanation: 'Defining relative clause - "that" specifies which hashtags' },
  { id: 2, question: 'Captions, ___ engage audiences, are crucial.', options: [{ id: 'A', text: 'which', correct: true }, { id: 'B', text: 'that', correct: false }], correctAnswer: 'A', explanation: 'Non-defining relative clause - "which" adds extra info (use commas)' },
  { id: 3, question: 'Emojis ___ convey tone are effective.', options: [{ id: 'A', text: 'that', correct: true }, { id: 'B', text: 'which', correct: false }], correctAnswer: 'A', explanation: 'Defining relative clause - "that" specifies which emojis' },
  { id: 4, question: 'CTAs, ___ drive action, are direct.', options: [{ id: 'A', text: 'which', correct: true }, { id: 'B', text: 'that', correct: false }], correctAnswer: 'A', explanation: 'Non-defining relative clause - "which" provides additional info' },
  { id: 5, question: 'Tags ___ amplify reach are strategic.', options: [{ id: 'A', text: 'that', correct: true }, { id: 'B', text: 'which', correct: false }], correctAnswer: 'A', explanation: 'Defining relative clause - "that" identifies which tags' },
  { id: 6, question: 'Viral posts, ___ spread fast, need quality.', options: [{ id: 'A', text: 'which', correct: true }, { id: 'B', text: 'that', correct: false }], correctAnswer: 'A', explanation: 'Non-defining relative clause - "which" adds extra information' }
]

const TIME_PER_QUESTION = 20

export default function Phase4_2Step3RemedialC1TaskF() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase4_2/step/3/remedial/c1/taskG') }, [])
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const P = isDark ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 3, interaction: 6, context: 'remedial_c1' })
  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [answers, setAnswers] = useState([])
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)

  const currentQuestion = QUESTIONS[currentQuestionIndex]

  const clayCard = (color) => ({
    bgcolor: P[color].bg,
    border: `2px solid ${P[color].border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${P[color].shadow}`,
    p: 3,
  })

  useEffect(() => {
    if (!gameStarted || gameFinished || showResult) return
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      handleSubmitAnswer(null)
    }
  }, [timeLeft, gameStarted, gameFinished, showResult])

  const handleAnswerSelect = (optionId) => {
    if (showResult) return
    setSelectedAnswer(optionId)
    setTimeout(() => { handleSubmitAnswer(optionId) }, 500)
  }

  const handleSubmitAnswer = (answer) => {
    const isCorrect = answer === currentQuestion.correctAnswer
    const newAnswers = [
      ...answers,
      {
        questionId: currentQuestion.id,
        question: currentQuestion.question,
        userAnswer: answer,
        correctAnswer: currentQuestion.correctAnswer,
        explanation: currentQuestion.explanation,
        isCorrect
      }
    ]
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
    sessionStorage.setItem('phase4_2_step3_remedial_c1_taskF_score', rawScore)
    sessionStorage.setItem('phase4_2_step3_remedial_c1_taskF_max', '6')
    logTaskCompletion(rawScore, rawScore)
  }

  const logTaskCompletion = async (finalScore, rawScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskF', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 3, level: 'C1', task: 'F', score: finalScore, max_score: 6, completed: true })
      })
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  if (!gameStarted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...clayCard('orange'), mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.orange.border }}>Phase 4.2 · Step 3 · Level C1 · Task F</Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#fff' : '#1a252f', mt: 0.5 }}>Relative Clauses Quiz</Typography>
              <Typography variant="body1" sx={{ color: isDark ? '#ccc' : '#555', mt: 0.5 }}>Fast-paced relative clause challenge!</Typography>
            </Box>
            <Box sx={{ ...clayCard('teal'), mb: 3 }}>
              <CharacterMessage speaker="Emna" message="Welcome to the Relative Clauses Quiz! Answer 6 rapid-fire questions about which vs that. You have 20 seconds per question. Select your answer quickly - choose between defining (that) and non-defining (which) relative clauses! Score: 1 point per correct answer = 6 points total. Ready? Let's go!" />
            </Box>
            <Box sx={{ ...clayCard('purple'), mb: 3, textAlign: 'center' }}>
              <QuizIcon sx={{ fontSize: 80, color: P.purple.border, mb: 2 }} />
              <Typography variant="h3" fontWeight="bold" sx={{ color: P.purple.border, mb: 1 }}>Kahoot-Style Quiz</Typography>
              <Typography variant="h6" sx={{ color: isDark ? '#ccc' : '#555', mb: 3 }}>6 Questions · 20 Seconds Each · Which vs That</Typography>
              <Box
                component="button"
                onClick={() => setGameStarted(true)}
                sx={{
                  ...clayCard('green'),
                  cursor: 'pointer',
                  px: 8, py: 2,
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: P.green.border,
                  display: 'inline-block',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s ease',
                }}
              >
                START
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    )
  }

  if (gameFinished) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...clayCard('orange'), mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.orange.border }}>Phase 4.2 · Step 3 · Level C1 · Task F</Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#fff' : '#1a252f' }}>Results</Typography>
            </Box>
            <Box sx={{ ...clayCard(score === 6 ? 'green' : 'yellow'), mb: 3, textAlign: 'center' }}>
              <EmojiEventsIcon sx={{ fontSize: 64, color: P[score === 6 ? 'green' : 'yellow'].border, mb: 1 }} />
              <Typography variant="h3" fontWeight="bold" sx={{ color: P[score === 6 ? 'green' : 'yellow'].border }}>
                {score === 6 ? 'PERFECT!' : 'GREAT JOB!'}
              </Typography>
              <Box sx={{ ...clayCard('blue'), maxWidth: 280, mx: 'auto', my: 3, textAlign: 'center' }}>
                <Typography variant="h1" fontWeight="bold" sx={{ color: P.blue.border, fontSize: '5rem' }}>{score}</Typography>
                <Typography variant="h5" sx={{ color: isDark ? '#ccc' : '#555' }}>out of {QUESTIONS.length}</Typography>
                <Typography variant="h6" sx={{ color: isDark ? '#aaa' : '#777' }}>{Math.round((score / QUESTIONS.length) * 100)}% correct</Typography>
              </Box>
            </Box>
            <Box sx={{ ...clayCard('purple'), mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.purple.border, mb: 2 }}>Answer Review</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {answers.map((answer, index) => {
                  const question = QUESTIONS[index]
                  const correctOptionText = question.options.find(opt => opt.id === answer.correctAnswer)?.text
                  const userOptionText = question.options.find(opt => opt.id === answer.userAnswer)?.text
                  return (
                    <Box key={index} sx={{ ...clayCard(answer.isCorrect ? 'green' : 'red') }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '12px', px: 1.5, py: 0.25, fontSize: '0.85rem', fontWeight: 'bold', color: P.purple.border }}>Q{index + 1}</Box>
                        <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#fff' : '#1a252f', flex: 1 }}>{answer.question}</Typography>
                        {answer.isCorrect ? <CheckCircleIcon sx={{ color: P.green.border, fontSize: 28 }} /> : <CancelIcon sx={{ color: P.red.border, fontSize: 28 }} />}
                      </Box>
                      <Box sx={{ display: 'flex', gap: 3, ml: 1, mb: 2 }}>
                        <Box>
                          <Typography variant="body2" fontWeight={600} sx={{ color: isDark ? '#aaa' : '#666', mb: 0.5 }}>Your answer:</Typography>
                          <Typography variant="h6" fontWeight="bold" sx={{ color: answer.isCorrect ? P.green.border : P.red.border }}>
                            {userOptionText || 'No answer'}
                          </Typography>
                        </Box>
                        {!answer.isCorrect && (
                          <Box>
                            <Typography variant="body2" fontWeight={600} sx={{ color: isDark ? '#aaa' : '#666', mb: 0.5 }}>Correct answer:</Typography>
                            <Typography variant="h6" fontWeight="bold" sx={{ color: P.green.border }}>{correctOptionText}</Typography>
                          </Box>
                        )}
                      </Box>
                      <Box sx={{ bgcolor: isDark ? '#1a1a2e' : 'rgba(255,255,255,0.7)', borderRadius: '12px', p: 2 }}>
                        <Typography variant="body2" sx={{ color: isDark ? '#ccc' : '#2c3e50', fontStyle: 'italic' }}>
                          {answer.explanation}
                        </Typography>
                      </Box>
                    </Box>
                  )
                })}
              </Box>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Box
                component="button"
                onClick={() => navigate('/phase4_2/step/3/remedial/c1/taskG')}
                sx={{
                  ...clayCard('green'),
                  cursor: 'pointer',
                  px: 6, py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: P.green.border,
                  display: 'inline-block',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s ease',
                }}
              >
                Continue to Task G
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    )
  }

  // Game in progress
  const progress = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100
  const currentAnswered = answers.filter(a => a.isCorrect).length

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          {/* Top Bar */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ ...clayCard('purple'), p: 2, display: 'inline-flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: P.purple.border }}>
                Question {currentQuestionIndex + 1} / {QUESTIONS.length}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ ...clayCard('yellow'), p: 2, display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                <EmojiEventsIcon sx={{ color: P.yellow.border }} />
                <Typography variant="h6" fontWeight="bold" sx={{ color: P.yellow.border }}>{currentAnswered} / {QUESTIONS.length}</Typography>
              </Box>
              <Box sx={{
                ...clayCard(timeLeft <= 5 ? 'red' : 'orange'),
                p: 2,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                animation: timeLeft <= 5 ? 'pulse 1s infinite' : 'none',
                '@keyframes pulse': { '0%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.05)' }, '100%': { transform: 'scale(1)' } }
              }}>
                <TimerIcon sx={{ color: timeLeft <= 5 ? P.red.border : P.orange.border }} />
                <Typography variant="h6" fontWeight="bold" sx={{ color: timeLeft <= 5 ? P.red.border : P.orange.border, minWidth: 40 }}>
                  {timeLeft}s
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Progress Bar */}
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ mb: 3, height: 12, borderRadius: 5, bgcolor: isDark ? '#333' : '#e0e0e0', '& .MuiLinearProgress-bar': { bgcolor: P.purple.border, borderRadius: 5 } }}
          />

          {/* Question */}
          <Box sx={{ ...clayCard('blue'), mb: 3, textAlign: 'center', minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h3" fontWeight="bold" sx={{ color: isDark ? '#fff' : '#1a252f', textAlign: 'center' }}>
              {currentQuestion.question}
            </Typography>
          </Box>

          {/* Answer Options */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
            {currentQuestion.options.map((option, index) => {
              const shapes = ['▲', '◆']
              const isSelected = selectedAnswer === option.id
              const showAnswer = showResult
              const bgColor = showAnswer
                ? option.correct ? 'green' : 'teal'
                : isSelected ? 'orange' : 'purple'

              return (
                <Box
                  key={option.id}
                  component="button"
                  onClick={() => handleAnswerSelect(option.id)}
                  sx={{
                    ...clayCard(bgColor),
                    cursor: showResult ? 'default' : 'pointer',
                    transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                    transition: 'all 0.2s',
                    minHeight: 120,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: 1,
                    opacity: showResult && !option.correct ? 0.6 : 1,
                    '&:hover': { transform: showResult ? 'scale(1)' : 'translate(-2px,-2px)', boxShadow: showResult ? `4px 4px 0 ${P[bgColor].shadow}` : `6px 6px 0 ${P[bgColor].shadow}` },
                    position: 'relative',
                  }}
                >
                  <Typography variant="h2" fontWeight="bold" sx={{ color: P[bgColor].border }}>
                    {shapes[index]}
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: P[bgColor].border }}>
                    {option.text}
                  </Typography>
                  {showAnswer && option.correct && (
                    <CheckCircleIcon sx={{ position: 'absolute', top: 12, right: 12, fontSize: 36, color: P.green.border }} />
                  )}
                </Box>
              )
            })}
          </Box>

          {showResult && (
            <Box sx={{
              ...clayCard(selectedAnswer === currentQuestion.correctAnswer ? 'green' : 'red'),
              textAlign: 'center',
            }}>
              <Typography variant="h4" fontWeight="bold" sx={{ color: selectedAnswer === currentQuestion.correctAnswer ? P.green.border : P.red.border }}>
                {selectedAnswer === currentQuestion.correctAnswer ? 'Correct!' : selectedAnswer ? 'Incorrect' : "Time's up!"}
              </Typography>
            </Box>
          )}
        </motion.div>
      </Container>
    </Box>
  )
}
