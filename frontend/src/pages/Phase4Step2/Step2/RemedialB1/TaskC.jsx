import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Container,
  Stack
} from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 2 - Level B1 - Task C: Wordshake Quiz
 * 6 multiple-choice questions on social media concepts
 */

const QUESTIONS = [
  {
    id: 1,
    question: 'What is the main purpose of using a hashtag in a social media post?',
    options: ['To make the post viral', 'To categorize content and make it searchable', 'To add color to the post', 'To tag friends'],
    correct: 1
  },
  {
    id: 2,
    question: 'What does a good caption do for a social media post?',
    options: ['It replaces the image', 'It provides context and engages the audience', 'It deletes the post automatically', 'It blocks comments'],
    correct: 1
  },
  {
    id: 3,
    question: 'Why do people use emojis in social media posts?',
    options: ['To replace all words', 'To make posts longer', 'To express emotions and make posts more friendly', 'To hide the message'],
    correct: 2
  },
  {
    id: 4,
    question: 'When you tag someone in a post, what happens?',
    options: ['They receive a notification and can see the post', 'They get blocked from your account', 'The post is automatically deleted', 'Your account becomes private'],
    correct: 0
  },
  {
    id: 5,
    question: 'What is a call-to-action (CTA) in a social media post?',
    options: ['A way to delete comments', 'An instruction asking the audience to do something specific', 'A type of hashtag', 'A filter for photos'],
    correct: 1
  },
  {
    id: 6,
    question: 'What does it mean when a post "goes viral"?',
    options: ['The post gets deleted', 'The post spreads rapidly and reaches many people', 'The post becomes private', 'The post gets reported'],
    correct: 1
  }
]

export default function Phase4_2Step2RemedialB1TaskC() {
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

  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 2, interaction: 3, context: 'remedial_b1' })
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerChange = (questionId, optionIndex) => setAnswers({ ...answers, [questionId]: optionIndex })

  const handleSubmit = () => {
    let correctCount = 0
    QUESTIONS.forEach(question => { if (answers[question.id] === question.correct) correctCount++ })
    setScore(correctCount)
    setShowResults(true)
    const scoreOutOf10 = (correctCount / QUESTIONS.length) * 10
    sessionStorage.setItem('phase4_2_step2_remedial_b1_taskC_score', scoreOutOf10.toFixed(1))
    sessionStorage.setItem('phase4_2_step2_remedial_b1_taskC_max', '10')
    logTaskCompletion(correctCount, QUESTIONS.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 2, level: 'B1', task: 'C', score, max_score: maxScore, time_taken: 0 })
      })
    } catch (error) { console.error('Failed to log task:', error) }
  }

  const handleNext = () => navigate('/phase4_2/step/2/remedial/b1/results')

  const allAnswered = Object.keys(answers).length === QUESTIONS.length

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3
          }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>
              Phase 4.2 Step 2 - Remedial Practice
            </Typography>
            <Typography variant="h6" sx={{ color: P.blue.shadow }}>
              Level B1 - Task C: Wordshake Quiz
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
              message="Test your understanding of social media concepts! Choose the best answer for each question."
            />
          </Box>

          {/* Instructions */}
          <Box sx={{
            bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`,
            p: 2, mb: 3
          }}>
            <Typography variant="body1" sx={{ color: P.purple.shadow }}>
              <strong>Instructions:</strong> Answer all 6 multiple-choice questions about social media.
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: P.purple.shadow }}>
              <strong>Evaluation:</strong> Each correct answer earns points.
            </Typography>
          </Box>

          {/* Questions */}
          <Stack spacing={3} sx={{ mb: 3 }}>
            {QUESTIONS.map((question, index) => {
              const isCorrect = answers[question.id] === question.correct
              return (
                <Box key={question.id} sx={{
                  bgcolor: showResults ? (isCorrect ? P.green.bg : P.red.bg) : (isDark ? '#1a1a2e' : 'white'),
                  border: `2px solid ${showResults ? (isCorrect ? P.green.border : P.red.border) : P.orange.border}`,
                  borderRadius: '20px',
                  boxShadow: `3px 3px 0 ${showResults ? (isCorrect ? P.green.shadow : P.red.shadow) : P.orange.shadow}`,
                  p: 3
                }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: showResults ? (isCorrect ? P.green.shadow : P.red.shadow) : P.orange.shadow }}>
                    Question {index + 1}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2, fontWeight: 'bold', color: isDark ? '#e0e0e0' : '#1a1a2e' }}>
                    {question.question}
                  </Typography>

                  <FormControl component="fieldset" fullWidth>
                    <RadioGroup
                      value={answers[question.id] !== undefined ? answers[question.id] : ''}
                      onChange={(e) => handleAnswerChange(question.id, parseInt(e.target.value))}
                    >
                      {question.options.map((option, optionIndex) => (
                        <FormControlLabel
                          key={optionIndex}
                          value={optionIndex}
                          control={<Radio disabled={showResults} />}
                          label={option}
                          sx={{
                            mb: 1, p: 1, borderRadius: '8px',
                            bgcolor: showResults
                              ? (optionIndex === question.correct ? P.green.bg : (answers[question.id] === optionIndex ? P.red.bg : 'transparent'))
                              : 'transparent',
                            '& .MuiFormControlLabel-label': {
                              color: showResults && optionIndex === question.correct ? P.green.shadow : 'inherit',
                              fontWeight: showResults && optionIndex === question.correct ? 'bold' : 'normal',
                            },
                            '&:hover': { bgcolor: showResults ? undefined : (isDark ? '#2a2a3e' : '#f9fafb') }
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
                      borderRadius: '8px'
                    }}>
                      <Typography variant="body2" sx={{ color: isCorrect ? P.green.shadow : P.red.shadow }}>
                        {isCorrect ? `Correct! ${question.options[question.correct]}` : `Incorrect. The correct answer is: ${question.options[question.correct]}`}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )
            })}
          </Stack>

          {/* Results Summary */}
          {showResults && (
            <Box sx={{
              bgcolor: score === QUESTIONS.length ? P.green.bg : P.blue.bg,
              border: `2px solid ${score === QUESTIONS.length ? P.green.border : P.blue.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${score === QUESTIONS.length ? P.green.shadow : P.blue.shadow}`,
              p: 3, mb: 3
            }}>
              {score === QUESTIONS.length ? (
                <Typography sx={{ color: P.green.shadow, fontWeight: 700 }}>Perfect score! You got all {QUESTIONS.length} questions correct!</Typography>
              ) : (
                <Typography sx={{ color: P.blue.shadow }}>
                  You got {score}/{QUESTIONS.length} correct ({((score / QUESTIONS.length) * 100).toFixed(0)}%).
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
                View Results <ArrowForwardIcon fontSize="small" />
              </Box>
            )}
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
