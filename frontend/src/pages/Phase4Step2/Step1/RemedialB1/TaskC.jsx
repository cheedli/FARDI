import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Grid, Container, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 - Level B1 - Task C: Quiz Game
 * 6 multiple-choice questions on social media terms
 */

const QUESTIONS = [
  { id: 1, question: 'What is a "hashtag" used for?', options: ['To send private messages', 'To categorize and search content', 'To delete posts', 'To block users'], correct: 1 },
  { id: 2, question: 'What does "viral" mean in social media?', options: ['Content that spreads very quickly', 'A computer virus', 'A deleted post', 'A private account'], correct: 0 },
  { id: 3, question: 'What is a "caption"?', options: ['A profile picture', 'Text that describes a photo or video', 'A type of filter', 'A notification sound'], correct: 1 },
  { id: 4, question: 'What does "engagement" measure?', options: ['How many followers you have', 'How long you spend online', 'How people interact with your content (likes, comments, shares)', 'How many posts you make per day'], correct: 2 },
  { id: 5, question: 'What is a "call-to-action"?', options: ['A phone number', 'An instruction asking audience to do something (like, share, buy)', 'A video call feature', 'A complaint system'], correct: 1 },
  { id: 6, question: 'What does it mean to "tag" someone?', options: ['To block them', 'To mention them in a post using @username', 'To report them', 'To unfollow them'], correct: 1 }
]

export default function Phase4_2RemedialB1TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 1, interaction: 3, context: 'remedial_b1' })
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

  const handleAnswerChange = (questionId, optionIndex) => { setAnswers({ ...answers, [questionId]: optionIndex }) }

  const handleSubmit = () => {
    let correctCount = 0
    QUESTIONS.forEach(q => { if (answers[q.id] === q.correct) correctCount++ })
    setScore(correctCount)
    setShowResults(true)
    const scoreOutOf10 = (correctCount / QUESTIONS.length) * 10
    sessionStorage.setItem('phase4_2_remedial_b1_taskC_score', scoreOutOf10.toFixed(1))
    sessionStorage.setItem('phase4_2_remedial_b1_taskC_max', '10')
    logTaskCompletion(correctCount, QUESTIONS.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 1, level: 'B1', task: 'C', score, max_score: maxScore, time_taken: 0 })
      })
    } catch (error) { console.error('Failed to log task:', error) }
  }

  const handleNext = () => { navigate('/phase4_2/step/1/remedial/b1/taskD') }
  const allAnswered = Object.keys(answers).length === QUESTIONS.length

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>Phase 4.2 - Remedial Practice</Typography>
            <Typography variant="h6" sx={{ color: P.blue.shadow }}>Level B1 - Task C: Quiz Game</Typography>
          </Box>

          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Test your knowledge of social media terminology! Choose the best answer for each question." />
          </Box>

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 2, mb: 3 }}>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}><strong>Instructions:</strong> Answer all 6 multiple-choice questions about social media terms.</Typography>
          </Box>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {QUESTIONS.map((question, index) => {
              const isAnsweredCorrect = showResults && answers[question.id] === question.correct
              const isAnsweredWrong = showResults && answers[question.id] !== question.correct
              return (
                <Grid item xs={12} key={question.id}>
                  <Box sx={{
                    bgcolor: showResults ? (isAnsweredCorrect ? P.green.bg : P.red.bg) : P.orange.bg,
                    border: `2px solid ${showResults ? (isAnsweredCorrect ? P.green.border : P.red.border) : P.orange.border}`,
                    borderRadius: '20px', boxShadow: `4px 4px 0 ${showResults ? (isAnsweredCorrect ? P.green.shadow : P.red.shadow) : P.orange.shadow}`,
                    p: 3,
                  }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: showResults ? (isAnsweredCorrect ? P.green.shadow : P.red.shadow) : P.orange.shadow }}>
                      Question {index + 1}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, fontWeight: 'bold', color: showResults ? (isAnsweredCorrect ? P.green.shadow : P.red.shadow) : P.orange.shadow }}>
                      {question.question}
                    </Typography>

                    <FormControl component="fieldset" fullWidth>
                      <RadioGroup value={answers[question.id] !== undefined ? answers[question.id] : ''} onChange={(e) => handleAnswerChange(question.id, parseInt(e.target.value))}>
                        {question.options.map((option, optionIndex) => (
                          <FormControlLabel key={optionIndex} value={optionIndex} control={<Radio disabled={showResults} />} label={option}
                            sx={{
                              mb: 1, p: 1, borderRadius: '12px',
                              bgcolor: showResults
                                ? (optionIndex === question.correct ? P.green.bg : (answers[question.id] === optionIndex ? P.red.bg : 'transparent'))
                                : 'transparent',
                            }}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>

                    {showResults && (
                      <Box sx={{ mt: 2, bgcolor: isAnsweredCorrect ? P.green.bg : P.red.bg, border: `2px solid ${isAnsweredCorrect ? P.green.border : P.red.border}`, borderRadius: '12px', p: 2 }}>
                        {isAnsweredCorrect ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckCircleIcon sx={{ color: P.green.shadow }} />
                            <Typography sx={{ color: P.green.shadow, fontWeight: 600 }}>Correct! {question.options[question.correct]}</Typography>
                          </Box>
                        ) : (
                          <Typography sx={{ color: P.red.shadow, fontWeight: 600 }}>Incorrect. The correct answer is: <strong>{question.options[question.correct]}</strong></Typography>
                        )}
                      </Box>
                    )}
                  </Box>
                </Grid>
              )
            })}
          </Grid>

          {showResults && (
            <Box sx={{ bgcolor: score === QUESTIONS.length ? P.green.bg : P.yellow.bg, border: `2px solid ${score === QUESTIONS.length ? P.green.border : P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${score === QUESTIONS.length ? P.green.shadow : P.yellow.shadow}`, p: 3, mb: 3 }}>
              <Typography fontWeight="bold" sx={{ color: score === QUESTIONS.length ? P.green.shadow : P.yellow.shadow }}>
                {score === QUESTIONS.length ? `Perfect score! You got all ${QUESTIONS.length} questions correct!` : `You got ${score}/${QUESTIONS.length} correct (${((score / QUESTIONS.length) * 100).toFixed(0)}%).`}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            {!showResults && (
              <Box component="button" onClick={handleSubmit} disabled={!allAnswered} sx={{
                bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
                px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem', cursor: !allAnswered ? 'not-allowed' : 'pointer',
                color: P.blue.shadow, opacity: !allAnswered ? 0.6 : 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` }
              }}>Submit Answers</Box>
            )}
            {showResults && (
              <Box component="button" onClick={handleNext} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem', cursor: 'pointer', color: P.green.shadow,
                display: 'flex', alignItems: 'center', gap: 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` }
              }}><ArrowForwardIcon /> Continue to Task D</Box>
            )}
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
