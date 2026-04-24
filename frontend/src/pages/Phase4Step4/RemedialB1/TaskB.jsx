import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, TextField, Stack, Container, useTheme, CircularProgress, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'
import { motion } from 'framer-motion'

/**
 * Phase 4 Step 4 - Remedial B1 - Task B: Definition Duel
 * Write 8 definitions with examples for advertising terms
 * Score: +1 for each correct definition (8 total)
 */

const GUIDED_QUESTIONS = [
  { id: 1, term: 'promotional', question: 'What does "promotional" mean?' },
  { id: 2, term: 'persuasive', question: 'What does "persuasive" mean?' },
  { id: 3, term: 'targeted', question: 'What does "targeted" mean?' },
  { id: 4, term: 'original', question: 'What does "original" mean?' },
  { id: 5, term: 'creative', question: 'What does "creative" mean?' },
  { id: 6, term: 'consistent', question: 'What does "consistent" mean?' },
  { id: 7, term: 'personalized', question: 'What does "personalized" mean?' },
  { id: 8, term: 'ethical', question: 'What does "ethical" mean?' }
]

export default function RemedialB1TaskB() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase4/step/4/remedial/b1/taskC') }, [])
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

  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 2, context: 'remedial_b1' })
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [error, setError] = useState(null)
  const [answers, setAnswers] = useState({
    promotional: '', persuasive: '', targeted: '', original: '',
    creative: '', consistent: '', personalized: '', ethical: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [evaluating, setEvaluating] = useState(false)
  const [results, setResults] = useState(null)

  const currentQuestion = GUIDED_QUESTIONS[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === GUIDED_QUESTIONS.length - 1
  const currentAnswer = answers[currentQuestion.term]

  const handleAnswerChange = (value) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.term]: value }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < GUIDED_QUESTIONS.length - 1) setCurrentQuestionIndex(prev => prev + 1)
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex(prev => prev - 1)
  }

  const handleSubmit = async () => {
    setEvaluating(true)
    setSubmitted(true)
    try {
      const definitions = GUIDED_QUESTIONS.map(q => ({ term: q.term, answer: answers[q.term] || '', example: '' }))

      const response = await fetch('/api/phase4/step4/remedial/b1/evaluate-definitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ definitions })
      })

      if (!response.ok) {
        const errorText = await response.text()
        if (response.status === 401) { window.location.href = '/auth/login'; return }
        throw new Error(`Server returned ${response.status}: ${errorText.substring(0, 100)}`)
      }

      const result = await response.json()
      setResults(result)
      sessionStorage.setItem('remedial_step4_b1_taskB_score', result.total_score)

      await fetch('/api/phase4/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ level: 'B1', task: 'B', step: 4, score: result.total_score, max_score: 8, time_taken: 0 })
      })
    } catch (err) {
      console.error('Evaluation error:', err)
      setError(`Failed to evaluate your answers. Error: ${err.message}`)
    } finally {
      setEvaluating(false)
    }
  }

  const canProceed = currentAnswer && currentAnswer.trim().length >= 20

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>Phase 4 - Step 4: Remedial Activities</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.shadow }}>Level B1 - Task B: Definition Duel</Typography>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}>Write 8 definitions for advertising terms. Each accurate definition wins a round!</Typography>
          </Box>

          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage character="MS. MABROUKI" message="Time for the Definition Duel! For each advertising term, write a clear definition. Write complete sentences with proper B1 grammar. Each good definition scores a point!" />
          </Box>

          {!submitted && (
            <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 4, mb: 3 }}>
              {/* Progress */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" gutterBottom sx={{ color: P.orange.shadow }}>
                  Question {currentQuestionIndex + 1} of {GUIDED_QUESTIONS.length}
                </Typography>
                <LinearProgress variant="determinate" value={((currentQuestionIndex + 1) / GUIDED_QUESTIONS.length) * 100} sx={{ height: 8, borderRadius: '999px', bgcolor: P.orange.border, '& .MuiLinearProgress-bar': { bgcolor: P.orange.shadow } }} />
              </Box>

              <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>
                {currentQuestionIndex + 1}. {currentQuestion.question}
              </Typography>

              <TextField
                fullWidth multiline rows={5}
                value={currentAnswer || ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="Write your definition here..."
                variant="outlined"
                sx={{ mt: 2 }}
                helperText={`${(currentAnswer || '').length} characters (minimum 20 recommended for a complete sentence)`}
                autoFocus
              />

              <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mt: 4 }}>
                <Box component="button" onClick={handlePrevious} disabled={currentQuestionIndex === 0} sx={{
                  bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                  borderRadius: '12px', boxShadow: currentQuestionIndex !== 0 ? `3px 3px 0 ${P.blue.shadow}` : 'none',
                  px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem',
                  cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer', color: P.blue.shadow,
                  opacity: currentQuestionIndex === 0 ? 0.5 : 1,
                }}>← Previous</Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  {!isLastQuestion ? (
                    <Box component="button" onClick={handleNext} disabled={!canProceed} sx={{
                      bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                      borderRadius: '12px', boxShadow: canProceed ? `3px 3px 0 ${P.green.shadow}` : 'none',
                      px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem',
                      cursor: !canProceed ? 'not-allowed' : 'pointer', color: P.green.shadow,
                      opacity: !canProceed ? 0.5 : 1,
                    }}>Next →</Box>
                  ) : (
                    <Box component="button" onClick={handleSubmit} disabled={!canProceed || evaluating} sx={{
                      bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                      borderRadius: '12px', boxShadow: (!canProceed || evaluating) ? 'none' : `3px 3px 0 ${P.green.shadow}`,
                      px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                      cursor: (!canProceed || evaluating) ? 'not-allowed' : 'pointer', color: P.green.shadow,
                      opacity: (!canProceed || evaluating) ? 0.5 : 1,
                    }}>Submit All Definitions</Box>
                  )}
                </Box>
              </Stack>

              {!canProceed && (
                <Typography variant="caption" display="block" sx={{ mt: 2, textAlign: 'center', color: P.red.shadow }}>
                  Please write at least 20 characters before proceeding
                </Typography>
              )}
            </Box>
          )}

          {evaluating && (
            <Box sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`, p: 4, textAlign: 'center' }}>
              <CircularProgress size={60} sx={{ mb: 2, color: P.yellow.shadow }} />
              <Typography variant="h6" gutterBottom sx={{ color: P.yellow.shadow }}>AI is evaluating your definitions...</Typography>
              <Typography variant="body2" sx={{ color: P.yellow.shadow }}>This may take a moment as we check all 8 definitions</Typography>
              <LinearProgress sx={{ mt: 2 }} />
            </Box>
          )}

          {submitted && !evaluating && results && (
            <Box sx={{ mt: 4 }}>
              <Box sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`, p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.green.shadow }}>Duel Results</Typography>

                <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '16px', boxShadow: `3px 3px 0 ${P.blue.shadow}`, p: 2, mb: 3, textAlign: 'center' }}>
                  <Typography variant="h3" fontWeight="bold" sx={{ color: P.blue.shadow }}>{results.total_score} / {results.max_score}</Typography>
                  <Typography variant="caption" sx={{ color: P.blue.shadow }}>Your Score</Typography>
                </Box>

                <Typography variant="h6" gutterBottom sx={{ color: P.green.shadow, mt: 3, mb: 2 }}>Detailed Feedback:</Typography>

                <Stack spacing={2}>
                  {results.results.map((item, index) => (
                    <Box key={index} sx={{
                      bgcolor: item.score === 1 ? P.green.bg : P.red.bg,
                      border: `2px solid ${item.score === 1 ? P.green.border : P.red.border}`,
                      borderRadius: '12px', boxShadow: `2px 2px 0 ${item.score === 1 ? P.green.shadow : P.red.shadow}`,
                      p: 2, borderLeft: `4px solid ${item.score === 1 ? P.green.shadow : P.red.shadow}`,
                    }}>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ color: item.score === 1 ? P.green.shadow : P.red.shadow }}>
                        {index + 1}. {item.term} - {item.score === 1 ? 'Correct' : 'Needs Improvement'}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1, color: item.score === 1 ? P.green.shadow : P.red.shadow }}>
                        Your answer: "{answers[item.term]}"
                      </Typography>
                      <Typography variant="body2" sx={{ color: item.score === 1 ? P.green.shadow : P.red.shadow }}>
                        {item.feedback}
                      </Typography>
                    </Box>
                  ))}
                </Stack>

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Box component="button" onClick={() => navigate('/phase4/step/4/remedial/b1/taskC')} sx={{
                    bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                    borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                    px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                    cursor: 'pointer', color: P.green.shadow,
                    '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                    '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` }
                  }}>Continue to Task C →</Box>
                </Box>
              </Box>
            </Box>
          )}

          {error && submitted && (
            <Box sx={{ bgcolor: P.red.bg, border: `2px solid ${P.red.border}`, borderRadius: '12px', p: 2, mt: 2 }}>
              <Typography sx={{ color: P.red.shadow }}>{error}</Typography>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
