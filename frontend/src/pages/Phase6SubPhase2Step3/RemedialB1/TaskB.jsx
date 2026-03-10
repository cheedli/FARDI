import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Alert, Stack } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const PROMPTS = [
  { label: 'Feedback?', example: 'Feedback is comments from people about your work.' },
  { label: 'Positive?', example: 'Positive means saying good things about the report.' },
  { label: 'Suggestion?', example: 'A suggestion is an idea to make the work better.' },
  { label: 'Strength?', example: 'A strength is a good part of the report.' },
  { label: 'Weakness?', example: 'A weakness is a bad part that needs improving.' },
  { label: 'Improve?', example: 'To improve means to make something better.' },
  { label: 'Polite?', example: 'Polite feedback is kind and respectful.' },
  { label: 'Helpful?', example: 'Helpful feedback gives useful ideas.' }
]

export default function Phase6SP2Step3RemB1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 3, interaction: 2, context: 'remedial_b1' })
  const [answers, setAnswers] = useState(Array(PROMPTS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    const filled = answers.filter(a => a.trim().split(/\s+/).length >= 3).length
    const s = Math.round((filled / PROMPTS.length) * 8)
    setScore(s)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step3_remedial_b1_taskb_score', s.toString())
    try { await phase6API.logRemedialActivity(3, 'B1', 'B', s, 8, 0, 2) } catch (e) { console.error(e) }
  }

  const canSubmit = answers.every(a => a.trim().length > 0)

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">Step 3: Remedial B1 - Task B</Typography>
        <Typography variant="body1">Writing Proposals: Define 8 Feedback Terms with Examples</Typography>
      </Paper>
      <Alert severity="info" sx={{ mb: 3 }}>Write 8 sentences defining feedback terms with simple examples. Use complete sentences like "Feedback is..." or "A suggestion is..."</Alert>
      <Stack spacing={2}>
        {PROMPTS.map((p, idx) => (
          <Paper key={idx} elevation={1} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" color="primary" sx={{ mb: 0.5 }}>{idx + 1}. {p.label}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Example: <em>{p.example}</em></Typography>
            <TextField fullWidth multiline rows={2} value={answers[idx]}
              onChange={(e) => { const a = [...answers]; a[idx] = e.target.value; setAnswers(a) }}
              disabled={submitted} placeholder="Write your definition here..." />
          </Paper>
        ))}
      </Stack>
      {!submitted ? (
        <Button variant="contained" onClick={handleSubmit} disabled={!canSubmit} fullWidth size="large" sx={{ mt: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}>Submit</Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2, mt: 3 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark">Task B Complete! Score: {score}/8</Typography>
          <Button variant="contained" onClick={() => navigate('/phase6/subphase/2/step/3/remedial/b1/task/c')} size="large"
            sx={{ mt: 2, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>Continue to Task C</Button>
        </Paper>
      )}
    </Box>
  )
}
