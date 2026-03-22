import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container, Stack, TextField, Alert } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

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
  { id: 1, question: 'How do hashtags help posts?', example: 'Example: Use relevant hashtags for discoverability' },
  { id: 2, question: 'What makes a good caption length?', example: 'Example: Keep captions concise but engaging' },
  { id: 3, question: 'Why use emojis in posts?', example: 'Example: Emojis add visual emotion and personality' },
  { id: 4, question: 'What is a call-to-action?', example: 'Example: A CTA prompts followers to take action' },
  { id: 5, question: 'How does tagging help reach?', example: 'Example: Tagging people expands your post reach' },
  { id: 6, question: 'When is the best time to post?', example: 'Example: Post when your audience is most active' },
  { id: 7, question: 'Why are visuals important?', example: 'Example: Strong visuals attract attention and engagement' },
  { id: 8, question: 'How do analytics help?', example: 'Example: Analytics show what content performs best' }
]

export default function RemedialB2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 2, context: 'remedial_b2' })
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT

  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [evaluating, setEvaluating] = useState(false)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState({})

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const handleSubmit = async () => {
    setEvaluating(true)
    let calculatedScore = 0
    const newFeedback = {}
    Object.keys(answers).forEach(qId => {
      const answer = answers[qId] || ''
      if (answer.trim().length >= 20) {
        calculatedScore++
        newFeedback[qId] = 'Good answer!'
      } else {
        newFeedback[qId] = 'Too short. Add more detail.'
      }
    })
    setScore(calculatedScore)
    setFeedback(newFeedback)
    setSubmitted(true)
    setEvaluating(false)
    sessionStorage.setItem('phase4_2_step4_b2_taskB', calculatedScore)
    await fetch('/api/phase4/remedial/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ phase: '4.2', level: 'B2', task: 'B', step: 4, score: calculatedScore, max_score: 8, completed: true })
    }).catch(err => console.error('Log error:', err))
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score: calculatedScore })
  }

  const handleContinue = () => { navigate('/phase4_2/step4/remedial/b2/taskC') }

  const answeredCount = Object.keys(answers).filter(key => (answers[key] || '').trim().length >= 20).length
  const canSubmit = answeredCount === 8
  const passed = score >= 6

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: P.orange.shadow }}>Phase 4.2 - Step 4: Remedial Activities</Typography>
            <Typography variant="h6" sx={{ color: P.orange.shadow }}>Level B2 - Task B: Writing (8 Questions)</Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <CharacterMessage character="MS. MABROUKI" message="Answer each question about effective social media post elements. Write at least 20 characters for each answer. Use the examples as guidance. Each correct answer earns 1 point. Total: 8 points!" />
          </Box>

          {/* Instructions */}
          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="body1" sx={{ color: P.teal.shadow }}><strong>Instructions:</strong> Answer all 8 questions below. Each answer should be at least 20 characters.</Typography>
          </Box>

          {/* Questions */}
          <Stack spacing={3} sx={{ mb: 3 }}>
            {QUESTIONS.map((q, index) => {
              const answer = answers[q.id] || ''
              const isAnswered = answer.trim().length >= 20
              const questionFeedback = feedback[q.id]

              return (
                <Box key={q.id} sx={{
                  bgcolor: submitted ? (isAnswered ? P.green.bg : P.yellow.bg) : P.teal.bg,
                  border: `2px solid ${submitted ? (isAnswered ? P.green.border : P.yellow.border) : P.teal.border}`,
                  borderRadius: '16px', boxShadow: `3px 3px 0 ${submitted ? (isAnswered ? P.green.shadow : P.yellow.shadow) : P.teal.shadow}`,
                  p: 3,
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: P.blue.shadow, mb: 0.5 }}>{index + 1}. {q.question}</Typography>
                  <Typography variant="body2" sx={{ fontStyle: 'italic', color: P.teal.shadow, mb: 2 }}>{q.example}</Typography>

                  <TextField
                    fullWidth multiline rows={2}
                    value={answer}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    placeholder="Write your answer here..."
                    variant="outlined"
                    disabled={submitted}
                    sx={{ mb: 1 }}
                  />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box component="span" sx={{
                      bgcolor: isAnswered ? P.green.bg : P.yellow.bg,
                      border: `2px solid ${isAnswered ? P.green.border : P.yellow.border}`,
                      borderRadius: '999px', px: 2, py: 0.5, fontSize: '0.8rem', fontWeight: 700,
                      color: isAnswered ? P.green.shadow : P.yellow.shadow, display: 'inline-block',
                    }}>{answer.length} characters</Box>
                    {submitted && questionFeedback && (
                      <Alert severity={isAnswered ? 'success' : 'warning'} sx={{ py: 0, px: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>{questionFeedback}</Typography>
                      </Alert>
                    )}
                  </Box>
                </Box>
              )
            })}
          </Stack>

          {/* Progress */}
          {!submitted && (
            <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 1, color: P.blue.shadow, fontWeight: 600 }}>
                Progress: {answeredCount} / 8 questions answered
              </Typography>
              <Box sx={{ bgcolor: 'rgba(0,0,0,0.1)', borderRadius: '999px', height: 10, overflow: 'hidden' }}>
                <Box sx={{ height: '100%', width: `${(answeredCount / 8) * 100}%`, bgcolor: P.blue.border, borderRadius: '999px', transition: 'width 0.3s ease' }} />
              </Box>
            </Box>
          )}

          {/* Results */}
          {submitted && (
            <Box sx={{
              bgcolor: passed ? P.green.bg : P.yellow.bg,
              border: `2px solid ${passed ? P.green.border : P.yellow.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${passed ? P.green.shadow : P.yellow.shadow}`,
              p: 4, mb: 3, textAlign: 'center',
            }}>
              <CheckCircleIcon sx={{ fontSize: 48, color: passed ? P.green.shadow : P.yellow.shadow, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: passed ? P.green.shadow : P.yellow.shadow, mb: 1 }}>
                {passed ? 'Excellent Work!' : 'Good Effort!'}
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 'bold', color: passed ? P.green.shadow : P.yellow.shadow }}>
                {score} / 8
              </Typography>
              <Typography variant="body1" sx={{ color: passed ? P.green.shadow : P.yellow.shadow, mt: 1 }}>
                {passed ? 'You passed this task! Great understanding of post elements.' : 'Keep practicing to improve your answers.'}
              </Typography>
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            {!submitted && (
              <Box component="button" onClick={handleSubmit} disabled={!canSubmit || evaluating} sx={{
                bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: !canSubmit || evaluating ? 'not-allowed' : 'pointer',
                color: P.blue.shadow, opacity: !canSubmit || evaluating ? 0.5 : 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.blue.shadow}` },
              }}>
                {evaluating ? 'Evaluating...' : canSubmit ? 'Submit Answers' : `Answer ${8 - answeredCount} More Questions`}
              </Box>
            )}
            {submitted && (
              <Box component="button" onClick={handleContinue} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: 'pointer', color: P.green.shadow, display: 'flex', alignItems: 'center', gap: 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` },
              }}>Continue to Task C: Matching Game <ArrowForwardIcon fontSize="small" /></Box>
            )}
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
