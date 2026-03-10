import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Stack, Alert, CircularProgress, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

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

  const handleAnswerChange = (value) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.term]: value }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < GUIDED_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setEvaluating(true)
    setSubmitted(true)
    try {
      const definitions = GUIDED_QUESTIONS.map(q => ({
        term: q.term,
        answer: answers[q.term] || '',
        example: '' // No example needed for evaluation
      }))

      const response = await fetch('/api/phase4/step3/remedial/b1/evaluate-definitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ definitions })
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response:', errorText)

        if (response.status === 401) {
          // Not logged in - redirect to login
          window.location.href = '/auth/login'
          return
        }

        throw new Error(`Server returned ${response.status}: ${errorText.substring(0, 100)}`)
      }

      const result = await response.json()
      console.log('Evaluation result:', result)
      setResults(result)
      sessionStorage.setItem('remedial_step3_b1_taskB_score', result.total_score)

      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
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
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
        <Typography variant="h4" gutterBottom>Phase 4 - Step 3: Remedial Activities</Typography>
        <Typography variant="h5" gutterBottom>Level B1 - Task B: Definition Duel 🥊</Typography>
        <Typography variant="body1">Write 8 definitions with examples from the videos. Each accurate definition wins a round!</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="MS. MABROUKI"
          message="Time for the Definition Duel! For each term, write a clear definition AND provide an example that references the advertising video you watched. Write complete sentences with proper B1 grammar. Each good definition scores a point!"
        />
      </Paper>

      {!submitted && (
        <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
          {/* Progress indicator */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Question {currentQuestionIndex + 1} of {GUIDED_QUESTIONS.length}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={((currentQuestionIndex + 1) / GUIDED_QUESTIONS.length) * 100}
              sx={{ height: 8, borderRadius: 1 }}
            />
          </Box>

          {/* Current question */}
          <Box>
            <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
              {currentQuestionIndex + 1}. {currentQuestion.question}
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={4}
              value={currentAnswer || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Write your definition and example here..."
              variant="outlined"
              sx={{ mt: 2 }}
              helperText={`${(currentAnswer || '').length} characters (minimum 30 recommended)`}
              autoFocus
            />
          </Box>

          {/* Navigation buttons */}
          <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mt: 4 }}>
            <Button
              variant="outlined"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              ← Previous
            </Button>

            <Box sx={{ display: 'flex', gap: 2 }}>
              {!isLastQuestion ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!canProceed}
                >
                  Next →
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSubmit}
                  disabled={!canProceed || evaluating}
                  size="large"
                >
                  Submit All Definitions 🥊
                </Button>
              )}
            </Box>
          </Stack>

          {!canProceed && (
            <Typography variant="caption" display="block" color="error" sx={{ mt: 2, textAlign: 'center' }}>
              Please write at least 10 characters before proceeding
            </Typography>
          )}
        </Paper>
      )}

      {evaluating && (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" gutterBottom>AI is evaluating your definitions...</Typography>
          <Typography variant="body2" color="text.secondary">This may take a moment as we check all 8 definitions</Typography>
          <LinearProgress sx={{ mt: 2 }} />
        </Paper>
      )}

      {submitted && !evaluating && results && (
        <Box sx={{ mt: 4 }}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom color="primary">Duel Results</Typography>

            <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: 'primary.light', textAlign: 'center' }}>
              <Typography variant="h3" fontWeight="bold" color="primary.dark">
                {results.total_score} / {results.max_score}
              </Typography>
              <Typography variant="caption" color="text.secondary">Your Score</Typography>
            </Paper>

            <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2 }}>Detailed Feedback:</Typography>

            <Stack spacing={2}>
              {results.results.map((item, index) => (
                <Paper key={index} elevation={1} sx={{ p: 2, borderLeft: `4px solid ${item.score === 1 ? '#4caf50' : '#f44336'}` }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    {index + 1}. {item.term} - {item.score === 1 ? '✅ Correct' : '❌ Needs Improvement'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Your answer: "{answers[item.term]}"
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.feedback}
                  </Typography>
                </Paper>
              ))}
            </Stack>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button variant="contained" color="primary" onClick={() => navigate('/phase4/step3/remedial/b1/taskC')} size="large">
                Continue to Task C →
              </Button>
            </Box>
          </Paper>
        </Box>
      )}

      {error && submitted && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  )
}
