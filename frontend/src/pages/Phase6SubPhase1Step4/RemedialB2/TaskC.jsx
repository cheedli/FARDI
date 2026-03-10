import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Paper, Typography, Button, Select, MenuItem, FormControl, Alert, Stack
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 4 — Level B2 — Task C
 * Error Matching Game: match each report error to its correct fix
 */

const PAIRS = [
  { error: '"The event was good and nice."', correct: '"The event was well-received and highly praised by participants."' },
  { error: '"Many people come to the event."', correct: '"A significant number of participants attended the event."' },
  { error: '"We had problem with time."', correct: '"Time management presented a notable challenge during the final session."' },
  { error: '"Speakers talk about many things."', correct: '"Speakers addressed a range of topics relevant to the event\'s theme."' },
  { error: '"The food was not good enough."', correct: '"The catering arrangements did not fully meet participants\' expectations."' },
  { error: '"Next time we will do better."', correct: '"It is recommended that future events incorporate more thorough planning."' },
]

// Shuffle the right column options
const SHUFFLED_CORRECT = [
  '"The catering arrangements did not fully meet participants\' expectations."',
  '"A significant number of participants attended the event."',
  '"It is recommended that future events incorporate more thorough planning."',
  '"The event was well-received and highly praised by participants."',
  '"Speakers addressed a range of topics relevant to the event\'s theme."',
  '"Time management presented a notable challenge during the final session."',
]

export default function Phase6SP1Step4RemB2TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 4, interaction: 3, context: 'remedial_b2' })
  const [answers, setAnswers] = useState(Array(PAIRS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    const correct = PAIRS.filter((p, i) => answers[i] === p.correct).length
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step4_remedial_b2_taskc_score', correct.toString())
    try { await phase6API.logRemedialActivity(4, 'B2', 'C', correct, PAIRS.length, 0, 1) } catch (e) { console.error(e) }
  }

  const allFilled = answers.every(a => a !== '')

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', color: 'white', borderRadius: 2 }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection &amp; Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 4: Remedial Practice — Level B2</Typography>
        <Typography variant="h6">Task C: Error Matching Game</Typography>
        <Typography variant="body1">Match each informal/incorrect sentence to its formal correction</Typography>
      </Paper>

      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        For each informal or incorrect report sentence on the left, select the matching formal correction from the dropdown.
      </Alert>

      <Stack spacing={2} sx={{ mb: 3 }}>
        {PAIRS.map((p, idx) => {
          const isCorrect = submitted && answers[idx] === p.correct
          const isWrong = submitted && answers[idx] !== p.correct
          return (
            <Paper
              key={idx}
              elevation={1}
              sx={{
                p: 2.5,
                borderRadius: 2,
                border: '2px solid',
                borderColor: submitted ? (isCorrect ? '#27ae60' : '#f44336') : '#e0e0e0',
                backgroundColor: submitted ? (isCorrect ? '#f0faf4' : '#fff5f5') : 'white'
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Error {idx + 1}:</Typography>
              <Typography variant="body1" fontWeight="bold" sx={{ mb: 1.5, color: '#c0392b' }}>
                {p.error}
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={answers[idx]}
                  onChange={(e) => {
                    const updated = [...answers]
                    updated[idx] = e.target.value
                    setAnswers(updated)
                  }}
                  disabled={submitted}
                  displayEmpty
                >
                  <MenuItem value=""><em>Select the correct formal version...</em></MenuItem>
                  {SHUFFLED_CORRECT.map((opt, oi) => (
                    <MenuItem key={oi} value={opt}>{opt}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              {isWrong && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  Correct: <strong>{p.correct}</strong>
                </Typography>
              )}
            </Paper>
          )
        })}
      </Stack>

      {!submitted ? (
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!allFilled}
          fullWidth
          size="large"
          sx={{ backgroundColor: '#27ae60', '&:hover': { backgroundColor: '#1e8449' } }}
        >
          Submit Matches
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#f0faf4', border: '2px solid #27ae60', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" gutterBottom>
            Task C Complete! Score: {score}/{PAIRS.length}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {score >= 5 ? 'Excellent! You can identify and fix report errors at B2 level.' : 'Good effort! Review the correct matches above.'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/1/step/4/remedial/b2/task/d')}
            size="large"
            sx={{ backgroundColor: '#27ae60', '&:hover': { backgroundColor: '#1e8449' } }}
          >
            Continue to Task D →
          </Button>
        </Paper>
      )}
    </Box>
  )
}
