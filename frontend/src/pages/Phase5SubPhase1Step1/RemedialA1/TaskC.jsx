import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Button, Stack, TextField, LinearProgress, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { CheckCircle, Cancel } from '@mui/icons-material'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

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

/**
 * Phase 5 Step 1 - Level A1 - Task C: Simple Sentence Writing
 * Write 6 very simple sentences about the problem, gamified as "Sentence Builder"
 * Score: +1 for each correct sentence (6 total)
 */

const SENTENCE_PROMPTS = [
  {
    term: 'problem',
    hint: 'Singer has ___.',
    correctAnswer: 'Singer has problem.',
    alternativeAnswers: ['Singer has problem', 'Singer has a problem.', 'Singer has a problem']
  },
  {
    term: 'cancel',
    hint: 'We cancel ___.',
    correctAnswer: 'We cancel singer.',
    alternativeAnswers: ['We cancel the singer.', 'We cancel the singer', 'We cancel singer']
  },
  {
    term: 'change',
    hint: '___ time.',
    correctAnswer: 'Change time.',
    alternativeAnswers: ['Change the time.', 'Change the time', 'Change time']
  },
  {
    term: 'solution',
    hint: 'Find ___.',
    correctAnswer: 'Find solution.',
    alternativeAnswers: ['Find a solution.', 'Find a solution', 'Find solution']
  },
  {
    term: 'sorry',
    hint: 'Say ___.',
    correctAnswer: 'Say sorry.',
    alternativeAnswers: ['Say sorry', 'Say sorry.']
  },
  {
    term: 'fix',
    hint: '___ problem.',
    correctAnswer: 'Fix problem.',
    alternativeAnswers: ['Fix the problem.', 'Fix the problem', 'Fix problem']
  }
]

export default function Phase5Step1RemedialA1TaskC() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase5/subphase/1/step/1/remedial/a1/task/a') }, [])
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const P = isDark ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 1, interaction: 3, context: 'remedial_a1' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState(Array(SENTENCE_PROMPTS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState([])
  const [score, setScore] = useState(0)

  const currentPrompt = SENTENCE_PROMPTS[currentIndex]

  const handleAnswerChange = (value) => {
    const newAnswers = [...userAnswers]
    newAnswers[currentIndex] = value
    setUserAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentIndex < SENTENCE_PROMPTS.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const checkAnswer = (userAnswer, prompt) => {
    const normalized = userAnswer.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[.,!?;:]/g, '')
    const termNormalized = prompt.term.toLowerCase()
    const hasTerm = normalized.includes(termNormalized)
    const hasBasicStructure = normalized.split(' ').length >= 2
    return hasTerm && hasBasicStructure
  }

  const handleSubmit = async () => {
    const checkResults = userAnswers.map((answer, index) => {
      const prompt = SENTENCE_PROMPTS[index]
      const isCorrect = checkAnswer(answer, prompt)
      return {
        userAnswer: answer,
        correctAnswer: prompt.correctAnswer,
        isCorrect
      }
    })

    const correctCount = checkResults.filter(r => r.isCorrect).length
    setResults(checkResults)
    setScore(correctCount)
    setSubmitted(true)

    sessionStorage.setItem('phase5_step1_remedial_a1_taskC_score', correctCount.toString())

    // Log to backend
    try {
      await phase5API.logRemedialActivity(1, 'A1', 'C', correctCount, 6, 0)
      console.log('[Phase 5 Step 1] A1 Task C completion logged to backend')
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = async () => {
    // Calculate total A1 score
    const taskAScore = parseInt(sessionStorage.getItem('phase5_step1_remedial_a1_taskA_score') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('phase5_step1_remedial_a1_taskB_score') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('phase5_step1_remedial_a1_taskC_score') || '0')
    const totalScore = taskAScore + taskBScore + taskCScore
    const maxScore = 8 + 8 + 6 // 22 total
    const threshold = Math.ceil(maxScore * 0.8) // 80% = 18

    console.log('\n' + '='.repeat(60))
    console.log('PHASE 5 STEP 1 - REMEDIAL A1 - FINAL RESULTS')
    console.log('='.repeat(60))
    console.log('Task A (Match Race):', taskAScore, '/8')
    console.log('Task B (Fill Frenzy):', taskBScore, '/8')
    console.log('Task C (Sentence Builder):', taskCScore, '/6')
    console.log('-'.repeat(60))
    console.log('TOTAL SCORE:', totalScore, '/', maxScore)
    console.log('PASS THRESHOLD:', threshold, '/', maxScore, '(80%)')
    console.log('-'.repeat(60))
    console.log(totalScore >= threshold
      ? '✅ PASSED - Student will proceed to the next step'
      : '❌ FAILED - Student will repeat Remedial Level A1')
    console.log('='.repeat(60) + '\n')

    // Log final score to backend
    let nextUrl = '/phase5/subphase/1/step/1/remedial/a1/task/a'
    try {
      const result = await phase5API.calculateRemedialScore(1, 'A1', {
        task_a_score: taskAScore,
        task_b_score: taskBScore,
        task_c_score: taskCScore
      })
      nextUrl = result?.data?.next_url || nextUrl
    } catch (error) {
      console.error('Failed to log final score:', error)
    }
    navigate(nextUrl)
  }

  const progress = ((currentIndex + 1) / SENTENCE_PROMPTS.length) * 100

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: P.orange.bg,
            border: `2px solid ${P.orange.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.orange.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h4" gutterBottom fontWeight={700} color={P.orange.border}>
              Phase 5: Execution &amp; Problem-Solving
            </Typography>
            <Typography variant="h5" gutterBottom color={P.orange.shadow}>
              Step 1: Remedial Practice - Level A1
            </Typography>
            <Typography variant="h6" gutterBottom color={P.orange.shadow}>
              Task C: Sentence Builder
            </Typography>
            <Typography variant="body1" color={isDark ? 'rgba(255,255,255,0.7)' : 'text.secondary'}>
              Write 6 very simple sentences about the problem
            </Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{
            bgcolor: P.teal.bg,
            border: `2px solid ${P.teal.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3,
          }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Excellent work! Now let's build sentences. Write a simple sentence for each term. Use the hint to help you. Remember: simple present tense and basic meaning!"
            />
          </Box>

          {!submitted ? (
            <>
              {/* Progress */}
              <Box sx={{
                bgcolor: P.yellow.bg,
                border: `2px solid ${P.yellow.border}`,
                borderRadius: '16px',
                p: 2, mb: 3,
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color={P.yellow.shadow}>
                    Sentence {currentIndex + 1} of {SENTENCE_PROMPTS.length}
                  </Typography>
                  <Typography variant="body2" fontWeight={700} color={P.yellow.shadow}>
                    {Math.round(progress)}% Complete
                  </Typography>
                </Box>
                <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 1 }} />
              </Box>

              {/* Current Sentence */}
              <Box sx={{
                bgcolor: P.blue.bg,
                border: `2px solid ${P.blue.border}`,
                borderRadius: '20px',
                boxShadow: `4px 4px 0 ${P.blue.shadow}`,
                p: 3, mb: 3,
              }}>
                <Typography variant="h6" gutterBottom fontWeight={700} color={P.blue.shadow}>
                  Term: <strong>{currentPrompt.term}</strong>
                </Typography>
                <Box sx={{
                  bgcolor: P.teal.bg,
                  border: `2px solid ${P.teal.border}`,
                  borderRadius: '12px',
                  p: 2, mb: 2,
                }}>
                  <Typography variant="body2" color={P.teal.shadow}>
                    <strong>Hint:</strong> {currentPrompt.hint}
                  </Typography>
                </Box>

                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  variant="outlined"
                  placeholder={`Write a simple sentence using "${currentPrompt.term}"...`}
                  value={userAnswers[currentIndex]}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  sx={{ mb: 2 }}
                />

                <Stack direction="row" spacing={2} justifyContent="space-between">
                  <Box
                    component="button"
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    sx={{
                      bgcolor: P.blue.bg,
                      border: `2px solid ${P.blue.border}`,
                      borderRadius: '10px',
                      px: 3, py: 1,
                      fontWeight: 600, fontSize: '0.9rem',
                      cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                      opacity: currentIndex === 0 ? 0.4 : 1,
                      color: P.blue.shadow,
                      transition: 'transform 0.15s',
                      '&:hover': currentIndex > 0 ? { transform: 'translate(-1px,-1px)' } : {},
                    }}
                  >
                    ← Previous
                  </Box>
                  {currentIndex === SENTENCE_PROMPTS.length - 1 ? (
                    <Box
                      component="button"
                      onClick={handleSubmit}
                      disabled={!userAnswers[currentIndex].trim()}
                      sx={{
                        bgcolor: P.green.bg,
                        border: `2px solid ${P.green.border}`,
                        borderRadius: '10px',
                        boxShadow: `2px 2px 0 ${P.green.shadow}`,
                        px: 3, py: 1,
                        fontWeight: 700, fontSize: '0.9rem',
                        cursor: !userAnswers[currentIndex].trim() ? 'not-allowed' : 'pointer',
                        opacity: !userAnswers[currentIndex].trim() ? 0.5 : 1,
                        color: P.green.shadow,
                        transition: 'transform 0.15s, box-shadow 0.15s',
                        '&:hover': userAnswers[currentIndex].trim() ? { transform: 'translate(-1px,-1px)', boxShadow: `3px 3px 0 ${P.green.shadow}` } : {},
                      }}
                    >
                      Submit All Sentences
                    </Box>
                  ) : (
                    <Box
                      component="button"
                      onClick={handleNext}
                      disabled={!userAnswers[currentIndex].trim()}
                      sx={{
                        bgcolor: P.blue.bg,
                        border: `2px solid ${P.blue.border}`,
                        borderRadius: '10px',
                        boxShadow: `2px 2px 0 ${P.blue.shadow}`,
                        px: 3, py: 1,
                        fontWeight: 700, fontSize: '0.9rem',
                        cursor: !userAnswers[currentIndex].trim() ? 'not-allowed' : 'pointer',
                        opacity: !userAnswers[currentIndex].trim() ? 0.5 : 1,
                        color: P.blue.shadow,
                        transition: 'transform 0.15s, box-shadow 0.15s',
                        '&:hover': userAnswers[currentIndex].trim() ? { transform: 'translate(-1px,-1px)', boxShadow: `3px 3px 0 ${P.blue.shadow}` } : {},
                      }}
                    >
                      Next →
                    </Box>
                  )}
                </Stack>
              </Box>
            </>
          ) : (
            <>
              {/* Results */}
              <Box sx={{
                bgcolor: P.yellow.bg,
                border: `2px solid ${P.yellow.border}`,
                borderRadius: '20px',
                boxShadow: `4px 4px 0 ${P.yellow.shadow}`,
                p: 3, mb: 3,
              }}>
                <Typography variant="h5" gutterBottom fontWeight={700} color={P.yellow.shadow}>
                  Results: {score} / {SENTENCE_PROMPTS.length} Correct
                </Typography>

                <Stack spacing={2} sx={{ mt: 2 }}>
                  {results.map((result, index) => (
                    <Box
                      key={index}
                      sx={{
                        bgcolor: result.isCorrect ? P.green.bg : P.red.bg,
                        border: `2px solid ${result.isCorrect ? P.green.border : P.red.border}`,
                        borderRadius: '14px',
                        p: 2,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        {result.isCorrect ? (
                          <CheckCircle sx={{ color: P.green.border, mr: 1 }} />
                        ) : (
                          <Cancel sx={{ color: P.red.border, mr: 1 }} />
                        )}
                        <Typography variant="subtitle2" fontWeight={700} color={result.isCorrect ? P.green.shadow : P.red.shadow}>
                          Sentence {index + 1}: {SENTENCE_PROMPTS[index].term}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Your answer:</strong> {result.userAnswer || '(empty)'}
                      </Typography>
                      {!result.isCorrect && (
                        <Typography variant="body2" color={P.green.shadow}>
                          <strong>Example:</strong> {result.correctAnswer}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Stack>
              </Box>

              <Box
                component="button"
                onClick={handleContinue}
                sx={{
                  width: '100%',
                  bgcolor: P.green.bg,
                  border: `2px solid ${P.green.border}`,
                  borderRadius: '12px',
                  boxShadow: `3px 3px 0 ${P.green.shadow}`,
                  py: 1.5,
                  fontWeight: 700, fontSize: '1rem',
                  cursor: 'pointer',
                  color: P.green.shadow,
                  transition: 'transform 0.15s, box-shadow 0.15s',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                }}
              >
                Continue to Final Results →
              </Box>
            </>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
