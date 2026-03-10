import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Select, MenuItem, FormControl, Alert, Stack } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const GAPS = [
  { before: 'Give me', blank: '', after: '.', correct: 'feedback', hint: 'What people say about your work' },
  { before: 'You did', blank: '', after: 'work.', correct: 'positive', hint: 'Good' },
  { before: 'My', blank: '', after: 'is add more details.', correct: 'suggestion', hint: 'Idea to make better' },
  { before: '', blank: '', after: 'is good teamwork.', correct: 'strength', hint: 'Good part' },
  { before: '', blank: '', after: 'is time management.', correct: 'weakness', hint: 'Bad part' },
  { before: 'We can', blank: '', after: 'our report.', correct: 'improve', hint: 'Make better' }
]

const WORD_BANK = ['feedback', 'positive', 'suggestion', 'strength', 'weakness', 'improve']

export default function Phase6SP2Step1RemA2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 1, interaction: 2, context: 'remedial_a2' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    let correct = 0
    GAPS.forEach((g, i) => { if (answers[i] === g.correct) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step1_remedial_a2_taskb_score', correct.toString())
    try { await phase6API.logRemedialActivity(1, 'A2', 'B', correct, GAPS.length, 0, 2) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">Step 1: Remedial A2 - Task B</Typography>
        <Typography variant="body1">Fill Frenzy: Complete Feedback Sentences</Typography>
      </Paper>
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: '#f3e5f5', borderRadius: 2 }}>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>Word Bank:</Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {WORD_BANK.map(w => (
            <Box key={w} sx={{ px: 2, py: 0.5, backgroundColor: '#8e44ad', color: 'white', borderRadius: 1, mb: 1 }}>
              <Typography variant="body2" fontWeight="bold">{w}</Typography>
            </Box>
          ))}
        </Stack>
      </Paper>
      <Alert severity="info" sx={{ mb: 3 }}>Choose the correct feedback word for each blank.</Alert>
      {GAPS.map((g, idx) => (
        <Paper key={idx} elevation={1} sx={{ p: 3, mb: 2, borderRadius: 2, border: submitted ? '2px solid' : '1px solid #e0e0e0', borderColor: submitted ? (answers[idx] === g.correct ? 'success.main' : 'error.main') : '#e0e0e0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="body1" fontWeight="bold">{idx + 1}.</Typography>
            {g.before && <Typography variant="body1">{g.before}</Typography>}
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <Select value={answers[idx] || ''} onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })} disabled={submitted} displayEmpty>
                <MenuItem value=""><em>choose...</em></MenuItem>
                {WORD_BANK.map((opt) => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
              </Select>
            </FormControl>
            {g.after && <Typography variant="body1">{g.after}</Typography>}
          </Box>
          {submitted && answers[idx] !== g.correct && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>Correct answer: <strong>{g.correct}</strong></Typography>
          )}
        </Paper>
      ))}
      {!submitted ? (
        <Button variant="contained" onClick={handleSubmit} disabled={Object.keys(answers).length < GAPS.length} fullWidth size="large"
          sx={{ background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}>Submit Answers</Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark">Score: {score}/{GAPS.length}</Typography>
          <Button variant="contained" onClick={() => navigate('/phase6/subphase/2/step/1/remedial/a2/task/c')} size="large"
            sx={{ mt: 2, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>Continue to Task C</Button>
        </Paper>
      )}
    </Box>
  )
}
