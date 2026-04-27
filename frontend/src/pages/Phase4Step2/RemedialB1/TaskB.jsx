import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container, LinearProgress, CircularProgress, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  blue:   { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  red:    { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  red:    { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

const GUIDED_QUESTIONS = [
  { id: 1, term: 'promotional', question: 'What is promotional?' },
  { id: 2, term: 'persuasive', question: 'What is persuasive?' },
  { id: 3, term: 'targeted', question: 'What is targeted?' },
  { id: 4, term: 'original', question: 'What is original?' },
  { id: 5, term: 'creative', question: 'What is creative?' },
  { id: 6, term: 'consistent', question: 'What is consistent?' },
  { id: 7, term: 'personalized', question: 'What is personalized?' },
  { id: 8, term: 'ethical', question: 'What is ethical?' }
]

export default function RemedialB1TaskB() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase4/step/2/remedial/b1/taskC') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 2, context: 'remedial_b1' })
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [error, setError] = useState(null)
  const [answers, setAnswers] = useState({ promotional: '', persuasive: '', targeted: '', original: '', creative: '', consistent: '', personalized: '', ethical: '' })
  const [submitted, setSubmitted] = useState(false)
  const [evaluating, setEvaluating] = useState(false)
  const [results, setResults] = useState(null)

  const currentQuestion = GUIDED_QUESTIONS[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === GUIDED_QUESTIONS.length - 1
  const currentAnswer = answers[currentQuestion.term]

  const cardSx = (color) => ({
    bgcolor: P[color].bg,
    border: `2px solid ${P[color].border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${P[color].shadow}`,
    p: 3,
  })

  const handleAnswerChange = (value) => setAnswers(prev => ({ ...prev, [currentQuestion.term]: value }))
  const handleNext = () => { if (currentQuestionIndex < GUIDED_QUESTIONS.length - 1) setCurrentQuestionIndex(prev => prev + 1) }
  const handlePrevious = () => { if (currentQuestionIndex > 0) setCurrentQuestionIndex(prev => prev - 1) }

  const handleSubmit = async () => {
    setEvaluating(true)
    setSubmitted(true)
    try {
      const definitions = GUIDED_QUESTIONS.map(q => ({ term: q.term, answer: answers[q.term] || '', example: '' }))
      const response = await fetch('/api/phase4/step3/remedial/b1/evaluate-definitions', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ definitions })
      })
      if (!response.ok) {
        const errorText = await response.text()
        if (response.status === 401) { window.location.href = '/auth/login'; return }
        throw new Error(`Server returned ${response.status}: ${errorText.substring(0, 100)}`)
      }
      const result = await response.json()
      setResults(result)
      sessionStorage.setItem('remedial_step3_b1_taskB_score', result.total_score)
      await fetch('/api/phase4/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ level: 'B1', task: 'B', step: 2, score: result.total_score, max_score: 8, time_taken: 0 })
      })
    } catch (err) {
      console.error('Evaluation error:', err)
      setError(`Failed to evaluate your answers. Error: ${err.message}`)
    } finally {
      setEvaluating(false)
    }
  }

  const canProceed = currentAnswer && currentAnswer.trim().length >= 10

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>

          {/* Header */}
          <Box sx={{ ...cardSx('orange'), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold">Phase 4 - Step 2: Remedial Activities</Typography>
            <Typography variant="h5" gutterBottom>Level B1 - Task B: Definition Duel 🥊</Typography>
            <Typography variant="body1">Write 8 definitions with examples from the videos. Each accurate definition wins a round!</Typography>
          </Box>

          {/* Character */}
          <Box sx={{ ...cardSx('blue'), mb: 3 }}>
            <CharacterMessage
              character="MS. MABROUKI"
              message="Time for the Definition Duel! For each term, write a clear definition AND provide an example that references the advertising video you watched. Write complete sentences with proper B1 grammar. Each good definition scores a point!"
            />
          </Box>

          {!submitted && (
            <Box sx={{ ...cardSx('blue'), mb: 3 }}>
              {/* Progress */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Question {currentQuestionIndex + 1} of {GUIDED_QUESTIONS.length}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={((currentQuestionIndex + 1) / GUIDED_QUESTIONS.length) * 100}
                  sx={{ height: 8, borderRadius: 4, '& .MuiLinearProgress-bar': { bgcolor: P.blue.border } }}
                />
              </Box>

              <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>
                {currentQuestionIndex + 1}. {currentQuestion.question}
              </Typography>

              <TextField
                fullWidth multiline rows={4}
                value={currentAnswer || ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="Write your definition and example here..."
                variant="outlined"
                sx={{ mt: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                helperText={`${(currentAnswer || '').length} characters (minimum 30 recommended)`}
                autoFocus
              />

              <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mt: 4 }}>
                <Box
                  component="button"
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  sx={{
                    ...cardSx('blue'), cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
                    px: 3, py: 1, fontWeight: 'bold', fontSize: '0.9rem', opacity: currentQuestionIndex === 0 ? 0.4 : 1,
                    transition: 'all 0.2s', '&:hover': !currentQuestionIndex === 0 ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` } : {}
                  }}
                >
                  ← Previous
                </Box>

                {!isLastQuestion ? (
                  <Box
                    component="button"
                    onClick={handleNext}
                    disabled={!canProceed}
                    sx={{
                      ...cardSx('green'), cursor: !canProceed ? 'not-allowed' : 'pointer',
                      px: 3, py: 1, fontWeight: 'bold', fontSize: '0.9rem', opacity: !canProceed ? 0.4 : 1,
                      color: P.green.border, transition: 'all 0.2s',
                      '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }
                    }}
                  >
                    Next →
                  </Box>
                ) : (
                  <Box
                    component="button"
                    onClick={handleSubmit}
                    disabled={!canProceed || evaluating}
                    sx={{
                      ...cardSx('green'), cursor: (!canProceed || evaluating) ? 'not-allowed' : 'pointer',
                      px: 4, py: 1.5, fontWeight: 'bold', fontSize: '1rem', opacity: (!canProceed || evaluating) ? 0.5 : 1,
                      color: P.green.border, transition: 'all 0.2s',
                      '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }
                    }}
                  >
                    Submit All Definitions 🥊
                  </Box>
                )}
              </Stack>

              {!canProceed && (
                <Typography variant="caption" display="block" sx={{ mt: 2, textAlign: 'center', color: P.red.border }}>
                  Please write at least 10 characters before proceeding
                </Typography>
              )}
            </Box>
          )}

          {evaluating && (
            <Box sx={{ ...cardSx('blue'), textAlign: 'center', p: 5 }}>
              <CircularProgress size={60} sx={{ mb: 2, color: P.blue.border }} />
              <Typography variant="h6" gutterBottom>AI is evaluating your definitions...</Typography>
              <Typography variant="body2" color="text.secondary">This may take a moment as we check all 8 definitions</Typography>
              <LinearProgress sx={{ mt: 2, borderRadius: 4, '& .MuiLinearProgress-bar': { bgcolor: P.blue.border } }} />
            </Box>
          )}

          {submitted && !evaluating && results && (
            <Box sx={{ mt: 4 }}>
              <Box sx={{ ...cardSx('green'), mb: 3 }}>
                <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.green.border }}>
                  Duel Results
                </Typography>
                <Box sx={{ ...cardSx('blue'), mb: 3, textAlign: 'center' }}>
                  <Typography variant="h3" fontWeight="bold" sx={{ color: P.blue.border }}>
                    {results.total_score} / {results.max_score}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Your Score</Typography>
                </Box>

                <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2 }}>Detailed Feedback:</Typography>
                <Stack spacing={2}>
                  {results.results.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        bgcolor: item.score === 1 ? P.green.bg : P.red.bg,
                        border: `2px solid ${item.score === 1 ? P.green.border : P.red.border}`,
                        borderRadius: '16px', p: 2,
                        boxShadow: `3px 3px 0 ${item.score === 1 ? P.green.shadow : P.red.shadow}`,
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        {index + 1}. {item.term} - {item.score === 1 ? '✅ Correct' : '❌ Needs Improvement'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Your answer: "{answers[item.term]}"
                      </Typography>
                      <Typography variant="body2" color="text.secondary">{item.feedback}</Typography>
                    </Box>
                  ))}
                </Stack>

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Box
                    component="button"
                    onClick={() => navigate('/phase4/step/2/remedial/b1/taskC')}
                    sx={{
                      ...cardSx('green'), cursor: 'pointer', px: 5, py: 1.5,
                      fontWeight: 'bold', fontSize: '1rem', color: P.green.border, transition: 'all 0.2s',
                      '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }
                    }}
                  >
                    Continue to Task C →
                  </Box>
                </Box>
              </Box>
            </Box>
          )}

          {error && submitted && (
            <Box sx={{ ...cardSx('red'), mt: 2 }}>
              <Typography color="error">{error}</Typography>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
