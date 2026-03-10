import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Alert, Stack } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const PROMPTS = [
  { label: '1. Positive opening', example: 'Your report is well-organized and easy to follow.' },
  { label: '2. Strength 1', example: 'The successes section is clearly written.' },
  { label: '3. Strength 2', example: 'Good use of past tense throughout.' },
  { label: '4. Weakness 1', example: 'Weakness: the recommendations are few and general.' },
  { label: '5. Specific suggestion', example: 'Suggestion: add specific measurable targets.' },
  { label: '6. Overall impression', example: 'Overall, this is a very solid report.' },
  { label: '7. Encouragement', example: 'You can improve the level of evidence used.' },
  { label: '8. Closing', example: 'Thank you for letting me read your work.' }
]

export default function Phase6SP2Step2RemB2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 2, interaction: 2, context: 'remedial_b2' })
  const [answers, setAnswers] = useState(Array(PROMPTS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    const filled = answers.filter(a => a.trim().split(/\s+/).length >= 4).length
    const s = Math.round((filled / PROMPTS.length) * 8)
    setScore(s)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step2_remedial_b2_taskb_score', s.toString())
    try { await phase6API.logRemedialActivity(2, 'B2', 'B', s, 8, 0, 2) } catch (e) { console.error(e) }
  }

  const canSubmit = answers.every(a => a.trim().length > 0)

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">Step 2: Remedial B2 - Task B</Typography>
        <Typography variant="body1">Writing: 8-Sentence Trial Peer Feedback Paragraph</Typography>
      </Paper>
      <Alert severity="info" sx={{ mb: 3 }}>Write 8 balanced, polite trial peer feedback sentences using the positive sandwich structure. Be specific and constructive.</Alert>
      <Stack spacing={2}>
        {PROMPTS.map((p, idx) => (
          <Paper key={idx} elevation={1} sx={{ p: 3, borderRadius: 2, borderLeft: '4px solid #8e44ad' }}>
            <Typography variant="subtitle1" fontWeight="bold" color="#8e44ad" sx={{ mb: 0.5 }}>{p.label}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Example: <em>{p.example}</em></Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              value={answers[idx]}
              onChange={(e) => { const a = [...answers]; a[idx] = e.target.value; setAnswers(a) }}
              disabled={submitted}
              placeholder="Write your sentence here..."
            />
          </Paper>
        ))}
      </Stack>
      {!submitted ? (
        <Button variant="contained" onClick={handleSubmit} disabled={!canSubmit} fullWidth size="large" sx={{ mt: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}>Submit</Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2, mt: 3 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark">Task B Complete! Score: {score}/8</Typography>
          <Button variant="contained" onClick={() => navigate('/phase6/subphase/2/step/2/remedial/b2/task/c')} size="large"
            sx={{ mt: 2, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>Continue to Task C</Button>
        </Paper>
      )}
    </Box>
  )
}
