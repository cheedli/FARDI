import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container, useTheme, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { CheckCircle, Cancel } from '@mui/icons-material'
import { useProgressSave } from '../../../hooks/useProgressSave'
import { motion } from 'framer-motion'

/**
 * Phase 4 Step 4 - Remedial B1 - Task F: Grammar Kahoot (Subject-Verb Agreement)
 * Choose the correct grammar in 6 sentences
 * Score: +1 for each correct answer (6 total)
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

const GRAMMAR_QUESTIONS = [
  { id: 1, question: 'Promotional ads ___ to sell?', options: ['is', 'are'], correctAnswer: 'are', explanation: 'We use "are" because "ads" is plural.' },
  { id: 2, question: 'Persuasive ___ logos?', options: ['use', 'uses'], correctAnswer: 'uses', explanation: 'We use "uses" because "Persuasive" (singular subject) takes a singular verb.' },
  { id: 3, question: 'Targeted group ___ specific?', options: ['is', 'are'], correctAnswer: 'is', explanation: 'We use "is" because "group" is singular.' },
  { id: 4, question: 'Original idea ___ new?', options: ['is', 'are'], correctAnswer: 'is', explanation: 'We use "is" because "idea" is singular.' },
  { id: 5, question: 'Creative ads ___ memorable?', options: ['make', 'makes'], correctAnswer: 'make', explanation: 'We use "make" because "ads" is plural.' },
  { id: 6, question: 'Ethical advertising ___ fair?', options: ['is', 'are'], correctAnswer: 'is', explanation: 'We use "is" because "advertising" is singular (uncountable noun).' }
]

const OPTION_COLORS = ['teal', 'purple', 'red', 'blue']

export default function RemedialB1TaskF() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
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

  const handleNext = () => { if (currentIndex < GRAMMAR_QUESTIONS.length - 1) setCurrentIndex(currentIndex + 1) }
  const handlePrevious = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1) }

  const handleSubmit = async () => {
    const checkResults = userAnswers.map((answer, index) => ({
      userAnswer: answer, correctAnswer: GRAMMAR_QUESTIONS[index].correctAnswer,
      isCorrect: answer === GRAMMAR_QUESTIONS[index].correctAnswer,
      explanation: GRAMMAR_QUESTIONS[index].explanation
    }))
    setResults(checkResults)
    const correctCount = checkResults.filter(r => r.isCorrect).length
    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('remedial_step4_b1_taskF_score', correctCount)
    await logTaskCompletion(correctCount)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskF', is_correct: true, score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ level: 'B1', task: 'F', step: 4, score, max_score: 6, completed: true })
      })
    } catch (error) { console.error('Failed to log task completion:', error) }
  }

  const handleContinue = () => navigate('/phase4/step/4/remedial/b1/results')
  const progress = ((currentIndex + 1) / GRAMMAR_QUESTIONS.length) * 100

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>

          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: P.orange.shadow }}>Phase 4 - Step 4: Remedial Activities</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Level B1 - Task F: Grammar Kahoot 🎯</Typography>
            <Typography variant="body2" sx={{ color: P.orange.shadow, mt: 0.5 }}>Choose the correct grammar for 6 sentences!</Typography>
          </Box>

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage character="MS. MABROUKI" message="Final challenge! Choose the correct verb form for each sentence. Pay attention to subject-verb agreement. Is the subject singular or plural? Choose wisely!" />
          </Box>

          {!submitted ? (
            <Box>
              {/* Progress */}
              <Box sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '16px', boxShadow: `3px 3px 0 ${P.yellow.shadow}`, p: 2, mb: 3 }}>
                <Typography variant="body2" sx={{ color: P.yellow.shadow, mb: 1 }}>Question {currentIndex + 1} of {GRAMMAR_QUESTIONS.length}</Typography>
                <LinearProgress variant="determinate" value={progress} sx={{ mb: 1, height: 8, borderRadius: 4, bgcolor: 'rgba(0,0,0,0.1)', '& .MuiLinearProgress-bar': { bgcolor: P.yellow.border, borderRadius: 4 } }} />
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  {GRAMMAR_QUESTIONS.map((_, idx) => (
                    <Box key={idx} sx={{ flex: 1, height: 8, borderRadius: 1, bgcolor: idx < currentIndex ? P.green.border : idx === currentIndex ? P.yellow.border : 'rgba(0,0,0,0.1)' }} />
                  ))}
                </Stack>
              </Box>

              {/* Question */}
              <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 4, mb: 3 }}>
                <Typography variant="h4" fontWeight="bold" textAlign="center" sx={{ color: P.purple.shadow, mb: 4 }}>
                  {currentIndex + 1}. {currentQuestion.question}
                </Typography>

                <Stack direction="row" spacing={3} justifyContent="center" sx={{ mb: 4 }}>
                  {currentQuestion.options.map((option, idx) => {
                    const colorKey = OPTION_COLORS[idx % OPTION_COLORS.length]
                    const isSelected = userAnswers[currentIndex] === option
                    return (
                      <Box key={option} component="button" onClick={() => handleAnswerSelect(option)} sx={{
                        width: 180, height: 180, borderRadius: '50%',
                        bgcolor: isSelected ? P[colorKey].border : P[colorKey].bg,
                        border: `3px solid ${P[colorKey].border}`,
                        boxShadow: `4px 4px 0 ${P[colorKey].shadow}`,
                        cursor: 'pointer', fontSize: '1.4rem', fontWeight: 'bold',
                        color: isSelected ? '#fff' : P[colorKey].shadow,
                        '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P[colorKey].shadow}` }
                      }}>
                        {option}
                      </Box>
                    )
                  })}
                </Stack>

                {/* Live score tracker */}
                <Box sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', p: 2, mb: 3, textAlign: 'center' }}>
                  <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" sx={{ mb: 1 }}>
                    {GRAMMAR_QUESTIONS.map((q, idx) => {
                      const answered = userAnswers[idx] !== ''
                      const isCorrect = answered && userAnswers[idx] === q.correctAnswer
                      return (
                        <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 50 }}>
                          <Typography variant="caption" sx={{ color: P.green.shadow }}>Q{idx + 1}</Typography>
                          <Typography variant="h6" fontWeight="bold" sx={{ color: !answered ? 'text.secondary' : isCorrect ? P.green.shadow : P.red.shadow }}>
                            {!answered ? '-' : isCorrect ? '+1' : '0'}
                          </Typography>
                        </Box>
                      )
                    })}
                  </Stack>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: P.green.shadow }}>
                    SCORE: {userAnswers.filter((a, idx) => a === GRAMMAR_QUESTIONS[idx].correctAnswer).length}
                  </Typography>
                </Box>

                <Stack direction="row" justifyContent="space-between">
                  <Box component="button" onClick={handlePrevious} disabled={currentIndex === 0} sx={{
                    bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '12px',
                    boxShadow: `3px 3px 0 ${P.blue.shadow}`, px: 3, py: 1, cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold', color: P.blue.shadow, opacity: currentIndex === 0 ? 0.4 : 1,
                    '&:hover': currentIndex > 0 ? { transform: 'translate(-2px,-2px)' } : {}
                  }}>← Previous</Box>

                  {currentIndex < GRAMMAR_QUESTIONS.length - 1 ? (
                    <Box component="button" onClick={handleNext} disabled={!userAnswers[currentIndex]} sx={{
                      bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '12px',
                      boxShadow: `3px 3px 0 ${P.teal.shadow}`, px: 3, py: 1,
                      cursor: userAnswers[currentIndex] ? 'pointer' : 'not-allowed',
                      fontWeight: 'bold', color: P.teal.shadow, opacity: userAnswers[currentIndex] ? 1 : 0.4,
                      '&:hover': userAnswers[currentIndex] ? { transform: 'translate(-2px,-2px)' } : {}
                    }}>Next →</Box>
                  ) : (
                    <Box component="button" onClick={handleSubmit} disabled={userAnswers.some(a => !a)} sx={{
                      bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px',
                      boxShadow: `3px 3px 0 ${P.green.shadow}`, px: 3, py: 1,
                      cursor: userAnswers.some(a => !a) ? 'not-allowed' : 'pointer',
                      fontWeight: 'bold', color: P.green.shadow, opacity: userAnswers.some(a => !a) ? 0.4 : 1,
                      '&:hover': !userAnswers.some(a => !a) ? { transform: 'translate(-2px,-2px)' } : {}
                    }}>Submit Grammar Quiz 🎯</Box>
                  )}
                </Stack>
              </Box>

              {/* Quick nav */}
              <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '16px', boxShadow: `3px 3px 0 ${P.teal.shadow}`, p: 2 }}>
                <Typography variant="body2" sx={{ color: P.teal.shadow, mb: 1 }}>Jump to question:</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {GRAMMAR_QUESTIONS.map((_, idx) => (
                    <Box key={idx} component="button" onClick={() => setCurrentIndex(idx)} sx={{
                      bgcolor: idx === currentIndex ? P.teal.border : P.teal.bg,
                      border: `2px solid ${P.teal.border}`, borderRadius: '8px',
                      boxShadow: `2px 2px 0 ${P.teal.shadow}`, minWidth: 40, py: 0.5, cursor: 'pointer',
                      fontWeight: 'bold', color: idx === currentIndex ? '#fff' : P.teal.shadow, fontSize: '0.85rem'
                    }}>
                      {idx + 1} {userAnswers[idx] && '✓'}
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Box>
          ) : (
            <Box>
              <Box sx={{
                bgcolor: score === 6 ? P.green.bg : P.yellow.bg,
                border: `2px solid ${score === 6 ? P.green.border : P.yellow.border}`,
                borderRadius: '20px', boxShadow: `4px 4px 0 ${score === 6 ? P.green.shadow : P.yellow.shadow}`,
                p: 4, textAlign: 'center', mb: 3
              }}>
                <Typography variant="h4" fontWeight="bold" sx={{ color: score === 6 ? P.green.shadow : P.yellow.shadow }}>
                  {score === 6 ? '🎯 Perfect Grammar! 🎯' : '🌟 Quiz Complete! 🌟'}
                </Typography>
                <Typography variant="h6" sx={{ color: score === 6 ? P.green.shadow : P.yellow.shadow }}>You scored {score} out of 6 points!</Typography>
              </Box>

              <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>Answer Review:</Typography>
                <Stack spacing={2}>
                  {results.map((result, index) => (
                    <Box key={index} sx={{
                      bgcolor: result.isCorrect ? P.green.bg : P.red.bg,
                      border: `2px solid ${result.isCorrect ? P.green.border : P.red.border}`,
                      borderRadius: '12px', p: 2
                    }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {result.isCorrect ? <CheckCircle sx={{ color: P.green.border }} /> : <Cancel sx={{ color: P.red.border }} />}
                        <Box>
                          <Typography variant="body2" fontWeight="bold" sx={{ color: result.isCorrect ? P.green.shadow : P.red.shadow }}>
                            {index + 1}. {GRAMMAR_QUESTIONS[index].question.replace('___', `[${result.userAnswer || '?'}]`)}
                          </Typography>
                          {!result.isCorrect && (
                            <Typography variant="body2" sx={{ color: P.red.shadow }}>
                              Your answer: <strong>{result.userAnswer}</strong> — Correct: <strong>{result.correctAnswer}</strong>
                            </Typography>
                          )}
                          <Typography variant="caption" sx={{ color: result.isCorrect ? P.green.shadow : P.red.shadow }}>{result.explanation}</Typography>
                        </Box>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </Box>

              <Stack direction="row" justifyContent="flex-end">
                <Box component="button" onClick={handleContinue} sx={{
                  bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '16px',
                  boxShadow: `4px 4px 0 ${P.green.shadow}`, px: 4, py: 1.5, cursor: 'pointer',
                  fontSize: '1rem', fontWeight: 'bold', color: P.green.shadow,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }
                }}>
                  View Final Results →
                </Box>
              </Stack>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
