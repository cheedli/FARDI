import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, RadioGroup, FormControlLabel, Radio, Alert } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const QUESTIONS = [
  { question: 'What does "feedback" mean?', options: ['Comments about your work', 'A type of food', 'A sports game'], correct: 0 },
  { question: 'What does "positive" mean in feedback?', options: ['Something negative', 'Good things', 'Something boring'], correct: 1 },
  { question: 'What is a "suggestion"?', options: ['A complaint', 'An idea to improve', 'A punishment'], correct: 1 },
  { question: 'What is a "strength" in a report?', options: ['A good part', 'A bad part', 'A spelling mistake'], correct: 0 },
  { question: 'What is a "weakness" in a report?', options: ['Something perfect', 'Something you need to improve', 'Something funny'], correct: 1 },
  { question: 'What does "improve" mean?', options: ['Make worse', 'Stop working', 'Make better'], correct: 2 }
]

export default function Phase6SP2Step1RemB1TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 1, interaction: 3, context: 'remedial_b1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    let correct = 0
    QUESTIONS.forEach((q, i) => { if (parseInt(answers[i]) === q.correct) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step1_remedial_b1_taskc_score', correct.toString())
    try { await phase6API.logRemedialActivity(1, 'B1', 'C', correct, QUESTIONS.length, 0, 2) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">Step 1: Remedial B1 - Task C</Typography>
        <Typography variant="body1">Quiz Game: Feedback Terms</Typography>
      </Paper>
      <Alert severity="info" sx={{ mb: 3 }}>Answer 6 questions about feedback words and their meanings.</Alert>
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
