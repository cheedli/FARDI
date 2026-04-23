import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Container
} from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 2 - Level A2 - Task B: Fill Frenzy
 * Fill in 6 sentences with social media vocabulary
 */

const WORD_BANK = ['hashtag', 'caption', 'emoji', 'tag', 'post', 'story']

const SENTENCES = [
  { id: 1, text: 'Use a ___ to make your post easy to find.', answer: 'hashtag' },
  { id: 2, text: 'Write a short ___ under your photo.', answer: 'caption' },
  { id: 3, text: 'Add a happy ___ to show your feeling.', answer: 'emoji' },
  { id: 4, text: 'Click to ___ your friend in the photo.', answer: 'tag' },
  { id: 5, text: 'Share a ___ on your profile page.', answer: 'post' },
  { id: 6, text: 'A ___ disappears after 24 hours.', answer: 'story' }
]

function generateOptions(correctAnswer, wordBank) {
  const incorrectOptions = wordBank.filter(word => word !== correctAnswer).sort(() => Math.random() - 0.5).slice(0, 3)
  return [...incorrectOptions, correctAnswer].sort(() => Math.random() - 0.5)
}

export default function Phase4_2Step2RemedialA2TaskB() {
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

  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 2, interaction: 2, context: 'remedial_a2' })
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [questionOptions, setQuestionOptions] = useState({})

  useEffect(() => {
    const options = {}
    SENTENCES.forEach(sentence => { options[sentence.id] = generateOptions(sentence.answer, WORD_BANK) })
    setQuestionOptions(options)
  }, [])

  const handleAnswerChange = (id, value) => setAnswers({ ...answers, [id]: value })

  const handleSubmit = () => {
    let correctCount = 0
    SENTENCES.forEach(sentence => { if (answers[sentence.id] === sentence.answer) correctCount++ })
    setScore(correctCount)
    setShowResults(true)
    const scoreOutOf10 = (correctCount / SENTENCES.length) * 10
    sessionStorage.setItem('phase4_2_step2_remedial_a2_taskB_score', scoreOutOf10.toString())
    sessionStorage.setItem('phase4_2_step2_remedial_a2_taskB_max', '10')
    logTaskCompletion(correctCount, SENTENCES.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 2, level: 'A2', task: 'B', score, max_score: maxScore, time_taken: 0 })
      })
    } catch (error) { console.error('Failed to log task:', error) }
  }

  const handleNext = () => navigate('/phase4_2/step/2/remedial/a2/taskC')

  const allAnswered = SENTENCES.every(s => answers[s.id]?.trim())

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`,
            p: 3, mb: 3
          }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.yellow.shadow }}>
              Phase 4.2 Step 2 - Remedial Practice
            </Typography>
            <Typography variant="h6" sx={{ color: P.yellow.shadow }}>
              Level A2 - Task B: Fill Frenzy
            </Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3
          }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Choose the correct word to complete each sentence! Select the best option from the choices given."
            />
          </Box>

          {/* Instructions */}
          <Box sx={{
            bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`,
            p: 2, mb: 3
          }}>
            <Typography variant="body1" sx={{ color: P.purple.shadow }}>
              <strong>Instructions:</strong> Read each sentence carefully and select the word that best completes it.
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: P.purple.shadow }}>
              <strong>Evaluation:</strong> Each correct answer = 1 point.
            </Typography>
          </Box>

          {/* Sentences */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {SENTENCES.map(sentence => {
              const isCorrect = answers[sentence.id] === sentence.answer
              const options = questionOptions[sentence.id] || []

              return (
                <Grid item xs={12} key={sentence.id}>
                  <Box sx={{
                    bgcolor: showResults ? (isCorrect ? P.green.bg : P.red.bg) : (isDark ? '#1a1a2e' : 'white'),
                    border: `2px solid ${showResults ? (isCorrect ? P.green.border : P.red.border) : P.blue.border}`,
                    borderRadius: '20px',
                    boxShadow: `3px 3px 0 ${showResults ? (isCorrect ? P.green.shadow : P.red.shadow) : P.blue.shadow}`,
                    p: 3
                  }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: showResults ? (isCorrect ? P.green.shadow : P.red.shadow) : P.blue.shadow }}>
                      {sentence.id}. {sentence.text.replace('___', '______')}
                    </Typography>

                    <FormControl component="fieldset" sx={{ mt: 2, width: '100%' }}>
                      <RadioGroup
                        value={answers[sentence.id] || ''}
                        onChange={(e) => handleAnswerChange(sentence.id, e.target.value)}
                      >
                        {options.map((option, index) => (
                          <FormControlLabel
                            key={index}
                            value={option}
                            control={<Radio disabled={showResults} />}
                            label={
                              <Typography
                                variant="body1"
                                sx={{
                                  fontWeight: showResults && option === sentence.answer ? 'bold' : 'normal',
                                  color: showResults && option === sentence.answer ? P.green.shadow : 'inherit'
                                }}
                              >
                                {option}
                              </Typography>
                            }
                            sx={{
                              p: 1.5, borderRadius: '8px',
                              bgcolor: isDark ? '#1a1a2e' : 'white',
                              mb: 1,
                              '&:hover': { bgcolor: showResults ? (isDark ? '#1a1a2e' : 'white') : (isDark ? '#2a2a3e' : '#f9fafb') }
                            }}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>

                    {showResults && (
                      <Box sx={{
                        mt: 2, p: 2,
                        bgcolor: isCorrect ? P.green.bg : P.red.bg,
                        border: `1px solid ${isCorrect ? P.green.border : P.red.border}`,
                        borderRadius: '8px',
                        display: 'flex', alignItems: 'center', gap: 1
                      }}>
                        {isCorrect && <CheckCircleIcon sx={{ color: P.green.shadow }} />}
                        <Typography variant="body2" sx={{ color: isCorrect ? P.green.shadow : P.red.shadow }}>
                          {isCorrect ? 'Correct!' : (
                            <>Your answer: <strong>{answers[sentence.id] || '(none selected)'}</strong> | Correct answer: <strong>{sentence.answer}</strong></>
                          )}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Grid>
              )
            })}
          </Grid>

          {/* Results Summary */}
          {showResults && (
            <Box sx={{
              bgcolor: score === SENTENCES.length ? P.green.bg : P.yellow.bg,
              border: `2px solid ${score === SENTENCES.length ? P.green.border : P.yellow.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${score === SENTENCES.length ? P.green.shadow : P.yellow.shadow}`,
              p: 3, mb: 3
            }}>
              {score === SENTENCES.length ? (
                <Typography sx={{ color: P.green.shadow, fontWeight: 700 }}>🎉 Perfect! All {SENTENCES.length} answers are correct!</Typography>
              ) : (
                <Typography sx={{ color: P.yellow.shadow }}>
                  You got {score}/{SENTENCES.length} correct. Review the correct answers and try to remember the meanings!
                </Typography>
              )}
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            {!showResults && (
              <Box component="button" onClick={handleSubmit} disabled={!allAnswered} sx={{
                bgcolor: !allAnswered ? (isDark ? '#2a2a3e' : '#e5e7eb') : P.blue.bg,
                border: `2px solid ${!allAnswered ? (isDark ? '#444' : '#d1d5db') : P.blue.border}`,
                borderRadius: '12px', boxShadow: !allAnswered ? 'none' : `3px 3px 0 ${P.blue.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: !allAnswered ? 'not-allowed' : 'pointer',
                color: !allAnswered ? (isDark ? '#555' : '#9ca3af') : P.blue.shadow,
                opacity: !allAnswered ? 0.6 : 1,
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover': !allAnswered ? {} : { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` },
                '&:active': !allAnswered ? {} : { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.blue.shadow}` }
              }}>
                Submit Answers
              </Box>
            )}
            {showResults && (
              <Box component="button" onClick={handleNext} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: 'pointer', color: P.green.shadow,
                display: 'flex', alignItems: 'center', gap: 1,
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` }
              }}>
                Continue to Task C <ArrowForwardIcon fontSize="small" />
              </Box>
            )}
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
