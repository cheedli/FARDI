import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, RadioGroup, FormControlLabel, Radio, Alert } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const QUESTIONS = [
  { question: 'Which sentence about giving feedback is correct?', options: ['Feedback is good.', 'Feedback bad!', 'No feedback.'], correct: 0 },
  { question: 'Which sentence is correct?', options: ['Positive bad.', 'Positive nice.', 'No positive.'], correct: 1 },
  { question: 'Which sentence about a suggestion is correct?', options: ['Suggestion add.', 'Suggestion bad.', 'No suggestion.'], correct: 0 },
  { question: 'Which sentence about strength is correct?', options: ['No good strength.', 'Strength bad.', 'Strength good.'], correct: 2 },
  { question: 'Which sentence about weakness is correct?', options: ['Weakness bad.', 'Weakness great!', 'Weakness fun.'], correct: 0 },
  { question: 'Which sentence about improving is correct?', options: ['Improve bad.', 'Improve never.', 'Improve better.'], correct: 2 }
]

export default function Phase6SP2Step1RemA2TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 1, interaction: 3, context: 'remedial_a2' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    let correct = 0
    QUESTIONS.forEach((q, i) => { if (parseInt(answers[i]) === q.correct) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step1_remedial_a2_taskc_score', correct.toString())
    try { await phase6API.logRemedialActivity(1, 'A2', 'C', correct, QUESTIONS.length, 0, 2) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">Step 1: Remedial A2 - Task C</Typography>
        <Typography variant="body1">Sentence Builder: Choose the Correct Feedback Sentence</Typography>
      </Paper>
      <Alert severity="info" sx={{ mb: 3 }}>Choose the correct simple sentence about peer feedback.</Alert>
      {QUESTIONS.map((q, idx) => (
        <Paper key={idx} elevation={1} sx={{ p: 3, mb: 2, borderRadius: 2, border: submitted ? '2px solid' : '1px solid #e0e0e0', borderColor: submitted ? (parseInt(answers[idx]) === q.correct ? 'success.main' : 'error.main') : '#e0e0e0' }}>
          <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>{idx + 1}. {q.question}</Typography>
          <RadioGroup value={answers[idx] ?? ''} onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })}>
            {q.options.map((opt, oi) => (
              <FormControlLabel key={oi} value={oi.toString()} control={<Radio disabled={submitted} />} label={opt} />
            ))}
          </RadioGroup>
          {submitted && parseInt(answers[idx]) !== q.correct && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>Correct: <strong>{q.options[q.correct]}</strong></Typography>
          )}
        </Paper>
      ))}
      {!submitted ? (
        <Button variant="contained" onClick={handleSubmit} disabled={Object.keys(answers).length < QUESTIONS.length} fullWidth size="large"
          sx={{ background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}>Submit Answers</Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark">Score: {score}/{QUESTIONS.length}</Typography>
          <Button variant="contained" onClick={() => navigate('/phase6/subphase/2/step/2')} size="large"
            sx={{ mt: 2, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>Continue to Step 2</Button>
        </Paper>
      )}
    </Box>
  )
}
