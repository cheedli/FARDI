import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container, FormControl, RadioGroup, FormControlLabel, Radio, Grid } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 - Level B1 - Task F: Subject-Verb Agreement Quiz
 * 6 multiple choice questions on subject-verb agreement
 */

const QUESTIONS = [
  {
    id: 1,
    question: 'The social media influencer ___ many followers.',
    options: ['have', 'has', 'having', 'haves'],
    correct: 1,
    explanation: 'Use "has" with third-person singular (he/she/it/influencer)'
  },
  {
    id: 2,
    question: 'My friends ___ photos every day on Instagram.',
    options: ['posts', 'post', 'posting', 'posted'],
    correct: 1,
    explanation: 'Use "post" with plural subject (friends)'
  },
  {
    id: 3,
    question: 'Each post ___ a unique caption.',
    options: ['need', 'needs', 'needing', 'are needing'],
    correct: 1,
    explanation: 'Use "needs" with "each" (singular)'
  },
  {
    id: 4,
    question: 'The team ___ working on the campaign together.',
    options: ['is', 'are', 'be', 'am'],
    correct: 0,
    explanation: 'Use "is" when referring to team as a single unit'
  },
  {
    id: 5,
    question: 'Everyone in the group ___ to share the video.',
    options: ['want', 'wants', 'wanting', 'are wanting'],
    correct: 1,
    explanation: 'Use "wants" with "everyone" (singular)'
  },
  {
    id: 6,
    question: 'The hashtags we use ___ very important for reach.',
    options: ['is', 'was', 'are', 'be'],
    correct: 2,
    explanation: 'Use "are" with plural subject (hashtags)'
  }
]

export default function Phase4_2RemedialB1TaskF() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 1, interaction: 6, context: 'remedial_b1' })
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const LIGHT = {
    pageBg: '#FFFDE7',
    blue:   { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
    green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
    yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
    teal:   { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
    orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
    red:    { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
  }
  const DARK = {
    pageBg: '#0F0F1A',
    blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
    green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
    yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
    teal:   { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
    orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
    red:    { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
  }
  const P = isDark ? DARK : LIGHT

  const handleAnswerChange = (questionId, optionIndex) => {
    setAnswers({ ...answers, [questionId]: optionIndex })
  }

  const handleSubmit = () => {
    let correctCount = 0
    QUESTIONS.forEach(question => {
      if (answers[question.id] === question.correct) correctCount++
    })
    setScore(correctCount)
    setShowResults(true)
    const scoreOutOf10 = (correctCount / QUESTIONS.length) * 10
    sessionStorage.setItem('phase4_2_remedial_b1_taskF_score', scoreOutOf10.toFixed(1))
    sessionStorage.setItem('phase4_2_remedial_b1_taskF_max', '10')
    logTaskCompletion(correctCount, QUESTIONS.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskF', is_correct: true, score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 1, level: 'B1', task: 'F', score, max_score: maxScore, time_taken: 0 })
      })
    } catch (error) { console.error('Failed to log task:', error) }
  }

  const handleNext = () => { navigate('/phase4_2/step/1/remedial/b1/results') }
  window.__remedialSkip = handleNext
  const allAnswered = Object.keys(answers).length === QUESTIONS.length

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>Phase 4.2 Step 1: Engage - Remedial Practice</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.shadow }}>Level B1 - Task F: Subject-Verb Agreement Quiz</Typography>
            <Typography variant="body1" sx={{ color: P.orange.shadow }}>Choose the correct verb form for each sentence!</Typography>
          </Box>

          {/* Instructor */}
          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage character="MS_MABROUKI" message="Choose the correct verb form for each sentence. Remember: subjects and verbs must agree in number!" />
          </Box>

          {/* Rules Card */}
          <Box sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.yellow.shadow }}>Subject-Verb Agreement Rules:</Typography>
            <Typography variant="body2" sx={{ color: P.yellow.shadow, mb: 0.5 }}><strong>Singular subjects</strong> take singular verbs (is, has, wants)</Typography>
            <Typography variant="body2" sx={{ color: P.yellow.shadow, mb: 0.5 }}><strong>Plural subjects</strong> take plural verbs (are, have, want)</Typography>
            <Typography variant="body2" sx={{ color: P.yellow.shadow }}><strong>Special cases:</strong> "everyone", "each", "team" are usually singular</Typography>
          </Box>

          {/* Instructions */}
          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 2, mb: 3 }}>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}><strong>Instructions:</strong> Select the correct verb form to complete each sentence.</Typography>
            <Typography variant="body2" sx={{ mt: 1, color: P.blue.shadow }}><strong>Evaluation:</strong> Each correct answer earns points.</Typography>
          </Box>

          {/* Questions */}
          <Box sx={{ mb: 4 }}>
            {QUESTIONS.map((question, index) => {
              const isCorrect = answers[question.id] === question.correct
              const isAnswered = answers[question.id] !== undefined
              const cardColor = showResults ? (isCorrect ? P.green : P.orange) : P.blue
              return (
                <Box key={question.id} sx={{ bgcolor: cardColor.bg, border: `2px solid ${cardColor.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${cardColor.shadow}`, p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: cardColor.shadow }}>
                    Question {index + 1}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2, fontWeight: 'bold', color: cardColor.shadow }}>
                    {question.question}
                  </Typography>

                  <FormControl component="fieldset" fullWidth>
                    <RadioGroup
                      value={answers[question.id] !== undefined ? answers[question.id] : ''}
                      onChange={(e) => handleAnswerChange(question.id, parseInt(e.target.value))}
                    >
                      {question.options.map((option, optionIndex) => {
                        let optBg = 'transparent'
                        let optBorder = 'transparent'
                        if (showResults) {
                          if (optionIndex === question.correct) { optBg = P.green.bg; optBorder = P.green.border }
                          else if (answers[question.id] === optionIndex) { optBg = P.red.bg; optBorder = P.red.border }
                        }
                        return (
                          <FormControlLabel
                            key={optionIndex}
                            value={optionIndex}
                            control={<Radio disabled={showResults} sx={{ color: cardColor.border, '&.Mui-checked': { color: cardColor.shadow } }} />}
                            label={<Typography sx={{ color: cardColor.shadow, fontWeight: answers[question.id] === optionIndex ? 700 : 400 }}>{option}</Typography>}
                            sx={{ mb: 1, p: 1, borderRadius: '12px', bgcolor: optBg, border: `1px solid ${optBorder}`, transition: 'all 0.2s' }}
                          />
                        )
                      })}
                    </RadioGroup>
                  </FormControl>

                  {showResults && (
                    <Box sx={{ mt: 2, bgcolor: isCorrect ? P.green.bg : P.red.bg, border: `2px solid ${isCorrect ? P.green.border : P.red.border}`, borderRadius: '12px', p: 2 }}>
                      {isCorrect ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CheckCircleIcon sx={{ color: P.green.shadow }} />
                          <Typography sx={{ color: P.green.shadow, fontWeight: 600 }}>Correct! {question.explanation}</Typography>
                        </Box>
                      ) : (
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <CancelIcon sx={{ color: P.red.shadow }} />
                            <Typography sx={{ color: P.red.shadow, fontWeight: 600 }}>Incorrect. The correct answer is: <strong>{question.options[question.correct]}</strong></Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: P.red.shadow, ml: 4 }}>{question.explanation}</Typography>
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
              )
            })}
          </Box>

          {/* Summary */}
          {showResults && (
            <Box sx={{ bgcolor: score === QUESTIONS.length ? P.green.bg : P.yellow.bg, border: `2px solid ${score === QUESTIONS.length ? P.green.border : P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${score === QUESTIONS.length ? P.green.shadow : P.yellow.shadow}`, p: 3, mb: 3 }}>
              <Typography fontWeight="bold" sx={{ color: score === QUESTIONS.length ? P.green.shadow : P.yellow.shadow }}>
                {score === QUESTIONS.length
                  ? `Perfect! You got all ${QUESTIONS.length} questions correct!`
                  : `You got ${score}/${QUESTIONS.length} correct (${((score / QUESTIONS.length) * 100).toFixed(0)}%).`}
              </Typography>
            </Box>
          )}

          {/* Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            {!showResults && (
              <Box component="button" onClick={handleSubmit} disabled={!allAnswered} sx={{
                bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
                px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem', cursor: !allAnswered ? 'not-allowed' : 'pointer',
                color: P.blue.shadow, opacity: !allAnswered ? 0.6 : 1,
                '&:hover': !allAnswered ? {} : { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` }
              }}>Submit Answers</Box>
            )}
            {showResults && (
              <Box component="button" onClick={handleNext} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem', cursor: 'pointer', color: P.green.shadow,
                display: 'flex', alignItems: 'center', gap: 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` }
              }}><ArrowForwardIcon /> View Results</Box>
            )}
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
