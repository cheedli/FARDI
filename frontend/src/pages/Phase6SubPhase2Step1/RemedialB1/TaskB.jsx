import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Alert, Stack } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const PROMPTS = [
  { label: 'Positive?', example: 'Your summary is good.' },
  { label: 'Strength?', example: 'Strength is clear writing.' },
  { label: 'Weakness?', example: 'Weakness is no numbers.' },
  { label: 'Suggestion?', example: 'Suggestion: add evidence.' },
  { label: 'Improve?', example: 'You can improve formality.' },
  { label: 'Overall?', example: 'Overall helpful report.' }
]

export default function Phase6SP2Step1RemB1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 1, interaction: 2, context: 'remedial_b1' })
  const [answers, setAnswers] = useState(Array(PROMPTS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    const filled = answers.filter(a => a.trim().split(/\s+/).length >= 3).length
    const s = Math.round((filled / PROMPTS.length) * 6)
    setScore(s)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step1_remedial_b1_taskb_score', s.toString())
    try { await phase6API.logRemedialActivity(1, 'B1', 'B', s, 6, 0, 2) } catch (e) { console.error(e) }
  }

  const canSubmit = answers.every(a => a.trim().length > 0)

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">Step 1: Remedial B1 - Task B</Typography>
        <Typography variant="body1">Writing Proposals: Give Feedback on a Report</Typography>
      </Paper>
      <Alert severity="info" sx={{ mb: 3 }}>Write 6 sentences giving feedback on a classmate's report. Use polite language. Each prompt guides one sentence.</Alert>
      <Stack spacing={2}>
        {PROMPTS.map((p, idx) => (
          <Paper key={idx} elevation={1} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" color="primary" sx={{ mb: 0.5 }}>{idx + 1}. {p.label}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Example: {p.example}</Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              value={answers[idx]}
              onChange={(e) => { const a = [...answers]; a[idx] = e.target.value; setAnswers(a) }}
              disabled={submitted}
              placeholder={`Write your sentence about "${p.label.toLowerCase().replace('?', '')}"...`}
            />
          </Paper>
        ))}
      </Stack>
      {!submitted ? (
        <Button variant="contained" onClick={handleSubmit} disabled={!canSubmit} fullWidth size="large" sx={{ mt: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}>Submit</Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2, mt: 3 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark">Task B Complete! Score: {score}/6</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>{score >= 5 ? 'Excellent polite feedback!' : 'Good effort! Keep practicing polite language.'}</Typography>
          <Button variant="contained" onClick={() => navigate('/phase6/subphase/2/step/1/remedial/b1/task/c')} size="large"
            sx={{ mt: 2, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>Continue to Task C</Button>
        </Paper>
      )}
    </Box>
  )
}
