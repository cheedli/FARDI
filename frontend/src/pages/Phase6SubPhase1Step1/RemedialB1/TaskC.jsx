import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, RadioGroup, FormControlLabel, Radio, Alert } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const QUESTIONS = [
  { question: 'Success means?', options: ['Good result', 'Problem', 'Weakness'], correct: 0 },
  { question: 'Challenge means?', options: ['Easy task', 'Difficult thing', 'Good feeling'], correct: 1 },
  { question: 'Feedback means?', options: ['A game', 'Opinion', 'Success'], correct: 1 },
  { question: 'Improve means?', options: ['Make better', 'Give up', 'Challenge'], correct: 0 },
  { question: 'Positive means?', options: ['Bad feeling', 'Good feeling', 'Difficult thing'], correct: 1 },
  { question: 'Recommend means?', options: ['Suggest better', 'Make worse', 'Start again'], correct: 0 }
]

export default function Phase6SP1Step1RemB1TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 1, interaction: 3, context: 'remedial_b1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    let correct = 0
    QUESTIONS.forEach((q, i) => { if (parseInt(answers[i]) === q.correct) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step1_remedial_b1_taskc_score', correct.toString())
    try { await phase6API.logRemedialActivity(1, 'B1', 'C', correct, QUESTIONS.length, 0, 1) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">Step 1: Remedial B1 - Task C</Typography>
        <Typography variant="body1">Vocabulary Quiz</Typography>
      </Paper>
      {QUESTIONS.map((q, idx) => (
        <Paper key={idx} elevation={1} sx={{ p: 3, mb: 2, borderRadius: 2, border: submitted ? '2px solid' : 'none', borderColor: submitted ? (parseInt(answers[idx]) === q.correct ? 'success.main' : 'error.main') : 'transparent' }}>
          <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>{idx + 1}. {q.question}</Typography>
          <RadioGroup value={answers[idx] ?? ''} onChange={(e) => setAnswers({...answers, [idx]: e.target.value})}>
            {q.options.map((opt, oi) => (
              <FormControlLabel key={oi} value={oi.toString()} control={<Radio disabled={submitted} />} label={opt} />
            ))}
          </RadioGroup>
        </Paper>
      ))}
      {!submitted ? (
        <Button variant="contained" onClick={handleSubmit} disabled={Object.keys(answers).length < QUESTIONS.length} fullWidth size="large"
          sx={{ background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}>Submit Answers</Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark">Score: {score}/{QUESTIONS.length}</Typography>
          <Button variant="contained" onClick={() => navigate('/phase6/subphase/1/step/2')} size="large"
            sx={{ mt: 2, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>Continue</Button>
        </Paper>
      )}
    </Box>
  )
}
