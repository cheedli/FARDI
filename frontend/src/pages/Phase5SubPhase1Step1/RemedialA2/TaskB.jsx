import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, TextField, LinearProgress, CircularProgress, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { CheckCircle, Cancel } from '@mui/icons-material'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 5 Step 1 - Level A2 - Task B: Sentence Expansion
 * Expand 8 sentences with "because" or "and", gamified as "Expand Quest"
 */

const LIGHT = {
  pageBg: '#FFFDE7',
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

const SENTENCE_PROMPTS = [
  { prompt: 'Singer cancel.', expectedExpansion: 'Singer cancel because sick.', hint: 'Add "because" and a reason' },
  { prompt: 'Find solution.', expectedExpansion: 'Find solution and fix.', hint: 'Add "and" and an action' },
  { prompt: 'Say sorry.', expectedExpansion: 'Say sorry because problem.', hint: 'Add "because" and a reason' },
  { prompt: 'Use alternative.', expectedExpansion: 'Use alternative singer.', hint: 'Add a noun after "alternative"' },
  { prompt: 'Change time.', expectedExpansion: 'Change time and place.', hint: 'Add "and" and another noun' },
  { prompt: 'Problem urgent.', expectedExpansion: 'Problem urgent and big.', hint: 'Add "and" and another adjective' },
  { prompt: 'Fix issue.', expectedExpansion: 'Fix issue because festival.', hint: 'Add "because" and a reason' },
  { prompt: 'Tell people.', expectedExpansion: 'Tell people and apologize.', hint: 'Add "and" and another action' }
]

export default function Phase5Step1RemedialA2TaskB() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 1, interaction: 2, context: 'remedial_a2' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState(Array(SENTENCE_PROMPTS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState([])
  const [score, setScore] = useState(0)
  const [evaluating, setEvaluating] = useState(false)

  const currentPrompt = SENTENCE_PROMPTS[currentIndex]

  const handleAnswerChange = (value) => {
    const newAnswers = [...userAnswers]
    newAnswers[currentIndex] = value
    setUserAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentIndex < SENTENCE_PROMPTS.length - 1) setCurrentIndex(currentIndex + 1)
  }

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
  }

  const checkAnswer = (userAnswer, prompt) => {
    const normalized = userAnswer.toLowerCase().trim()
    const hasConnector = normalized.includes('because') || normalized.includes('and')
    const hasOriginalWords = normalized.includes(prompt.prompt.toLowerCase().split(' ')[0])
    const hasAdditionalWords = normalized.split(' ').length > prompt.prompt.split(' ').length
    return hasConnector && hasOriginalWords && hasAdditionalWords
  }

  const handleSubmit = async () => {
    setEvaluating(true)
    const expansions = userAnswers.map((answer, index) => ({
      prompt: SENTENCE_PROMPTS[index].prompt,
      userExpansion: answer,
      expectedExpansion: SENTENCE_PROMPTS[index].expectedExpansion
    }))
    try {
      const checkResults = expansions.map((expansion, index) => {
        const isCorrect = checkAnswer(expansion.userExpansion, SENTENCE_PROMPTS[index])
        return {
          userAnswer: expansion.userExpansion,
          expectedExpansion: expansion.expectedExpansion,
          isCorrect,
          feedback: isCorrect ? 'Good expansion!' : 'Try adding "because" or "and" with more detail.'
        }
      })
      const correctCount = checkResults.filter(r => r.isCorrect).length
      setResults(checkResults)
      setScore(correctCount)
      setSubmitted(true)
      sessionStorage.setItem('phase5_step1_remedial_a2_taskB_score', correctCount.toString())
      try {
        await phase5API.logRemedialActivity(1, 'A2', 'B', correctCount, 8, 0)
        console.log('[Phase 5 Step 1] A2 Task B completion logged to backend')
      } catch (error) {
        console.error('Failed to log task completion:', error)
      }
    } catch (error) {
      console.error('Evaluation error:', error)
    } finally {
      setEvaluating(false)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/1/step/1/remedial/a2/task/c')
  }

  const progress = ((currentIndex + 1) / SENTENCE_PROMPTS.length) * 100

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{
            bgcolor: P.orange.bg,
            border: `2px solid ${P.orange.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.orange.shadow}`,
            p: 3, mb: 3
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>
              Phase 5: Execution & Problem-Solving
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.shadow }}>
              Step 1: Remedial Practice - Level A2
            </Typography>
            <Typography variant="h6" gutterBottom fontWeight="bold">Task B: Expand Quest</Typography>
            <Typography variant="body1">Expand 8 sentences with "because" or "and". Grow your virtual tree!</Typography>
          </Box>
        </motion.div>

        {/* Instructor Message */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{
            bgcolor: P.blue.bg,
            border: `2px solid ${P.blue.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3
          }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Welcome to Expand Quest! Expand each sentence by adding 'because' or 'and' with more detail. Each correct expansion helps your virtual tree grow!"
            />
          </Box>
        </motion.div>

        {!submitted ? (
          <>
            {/* Progress */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Box sx={{
                bgcolor: P.teal.bg,
                border: `2px solid ${P.teal.border}`,
                borderRadius: '20px',
                boxShadow: `4px 4px 0 ${P.teal.shadow}`,
                p: 2, mb: 3
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Sentence {currentIndex + 1} of {SENTENCE_PROMPTS.length}</Typography>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: P.teal.border }}>{Math.round(progress)}% Complete</Typography>
                </Box>
                <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 1 }} />
              </Box>
            </motion.div>

            {/* Current Sentence */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Box sx={{
                bgcolor: P.blue.bg,
                border: `2px solid ${P.blue.border}`,
                borderRadius: '20px',
                boxShadow: `4px 4px 0 ${P.blue.shadow}`,
                p: 3, mb: 3
              }}>
                <Typography variant="h6" gutterBottom sx={{ color: P.blue.border }}>Expand this sentence:</Typography>
                <Box sx={{
                  bgcolor: P.teal.bg,
                  border: `2px solid ${P.teal.border}`,
                  borderRadius: '12px',
                  p: 2, mb: 2
                }}>
                  <Typography variant="body2"><strong>Original:</strong> {currentPrompt.prompt}</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}><strong>Hint:</strong> {currentPrompt.hint}</Typography>
                </Box>
                <TextField
                  fullWidth multiline rows={2} variant="outlined"
                  placeholder={`Expand: ${currentPrompt.prompt}...`}
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
                      bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
                      borderRadius: '12px', boxShadow: `3px 3px 0 ${P.orange.shadow}`,
                      px: 3, py: 1, fontWeight: 'bold', color: P.orange.border,
                      cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                      opacity: currentIndex === 0 ? 0.5 : 1,
                      transition: 'all 0.15s',
                      '&:hover': currentIndex !== 0 ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.orange.shadow}` } : {}
                    }}
                  >
                    ← Previous
                  </Box>
                  {currentIndex === SENTENCE_PROMPTS.length - 1 ? (
                    <Box
                      component="button"
                      onClick={handleSubmit}
                      disabled={!userAnswers[currentIndex].trim() || evaluating}
                      sx={{
                        bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                        borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
                        px: 3, py: 1, fontWeight: 'bold', color: P.blue.border,
                        cursor: (!userAnswers[currentIndex].trim() || evaluating) ? 'not-allowed' : 'pointer',
                        opacity: (!userAnswers[currentIndex].trim() || evaluating) ? 0.5 : 1,
                        display: 'flex', alignItems: 'center', gap: 1,
                        transition: 'all 0.15s',
                        '&:hover': (!userAnswers[currentIndex].trim() || evaluating) ? {} : { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` }
                      }}
                    >
                      {evaluating ? <CircularProgress size={16} /> : null}
                      {evaluating ? 'Evaluating...' : 'Submit All Expansions'}
                    </Box>
                  ) : (
                    <Box
                      component="button"
                      onClick={handleNext}
                      disabled={!userAnswers[currentIndex].trim()}
                      sx={{
                        bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                        borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
                        px: 3, py: 1, fontWeight: 'bold', color: P.blue.border,
                        cursor: !userAnswers[currentIndex].trim() ? 'not-allowed' : 'pointer',
                        opacity: !userAnswers[currentIndex].trim() ? 0.5 : 1,
                        transition: 'all 0.15s',
                        '&:hover': !userAnswers[currentIndex].trim() ? {} : { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` }
                      }}
                    >
                      Next →
                    </Box>
                  )}
                </Stack>
              </Box>
            </motion.div>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            {/* Results */}
            <Box sx={{
              bgcolor: P.green.bg,
              border: `2px solid ${P.green.border}`,
              borderRadius: '20px',
              boxShadow: `4px 4px 0 ${P.green.shadow}`,
              p: 3, mb: 3
            }}>
              <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.green.shadow }}>
                Results: {score} / {SENTENCE_PROMPTS.length} Correct
              </Typography>
              <Stack spacing={2} sx={{ mt: 2 }}>
                {results.map((result, index) => {
                  const col = result.isCorrect ? P.green : P.red
                  return (
                    <Box
                      key={index}
                      sx={{
                        bgcolor: col.bg,
                        border: `2px solid ${col.border}`,
                        borderRadius: '12px',
                        boxShadow: `3px 3px 0 ${col.shadow}`,
                        p: 2
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        {result.isCorrect
                          ? <CheckCircle sx={{ color: P.green.border, mr: 1 }} />
                          : <Cancel sx={{ color: P.red.border, mr: 1 }} />}
                        <Typography variant="subtitle2" fontWeight="bold">Sentence {index + 1}</Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Original:</strong> {SENTENCE_PROMPTS[index].prompt}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Your expansion:</strong> {result.userAnswer || '(empty)'}
                      </Typography>
                      {!result.isCorrect && (
                        <Typography variant="body2" sx={{ color: P.green.shadow }}>
                          <strong>Example:</strong> {result.expectedExpansion}
                        </Typography>
                      )}
                    </Box>
                  )
                })}
              </Stack>
            </Box>
            <Box
              component="button"
              onClick={handleContinue}
              sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
                px: 4, py: 1.5, fontSize: '1rem', fontWeight: 'bold',
                color: P.green.shadow, cursor: 'pointer', width: '100%',
                transition: 'all 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }
              }}
            >
              Next: Task C →
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
