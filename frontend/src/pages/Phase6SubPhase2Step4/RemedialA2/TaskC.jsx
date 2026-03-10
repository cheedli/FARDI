import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Alert, Stack } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const PROMPTS = [
  { prompt: 'Say something good about the report.', example: 'Good work.' },
  { prompt: "Use the word 'positive'.", example: 'Positive nice.' },
  { prompt: 'Give a suggestion.', example: 'Suggestion add.' },
  { prompt: 'Name a strength.', example: 'Strength good.' },
  { prompt: 'Name a weakness.', example: 'Weakness small.' },
  { prompt: "Use the word 'improve'.", example: 'Improve better.' }
]

export default function Phase6SP2Step4RemA2TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 4, interaction: 3, context: 'remedial_a2' })
  const [answers, setAnswers] = useState(Array(PROMPTS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    let correct = 0
    answers.forEach((ans) => {
      const trimmed = ans.trim()
      if (trimmed.split(/\s+/).filter(w => w.length > 0).length >= 1) correct++
    })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step4_remedial_a2_taskc_score', correct.toString())
    try { await phase6API.logRemedialActivity(4, 'A2', 'C', correct, PROMPTS.length, 0, 2) } catch (e) { console.error(e) }
  }

  const allAnswered = answers.every(a => a.trim().length > 0)

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">Step 4: Remedial A2 - Task C</Typography>
        <Typography variant="body1">Sentence Builder: Write Simple Feedback Sentences</Typography>
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>Write a simple sentence for each prompt. Any response with at least 1 word is accepted.</Alert>

      <Stack spacing={2}>
        {PROMPTS.map((item, idx) => (
          <Paper key={idx} elevation={1} sx={{ p: 3, borderRadius: 2, border: submitted ? '2px solid' : '1px solid #e0e0e0', borderColor: submitted ? (answers[idx].trim().split(/\s+/).filter(w => w.length > 0).length >= 1 ? 'success.main' : 'error.main') : '#e0e0e0' }}>
            <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>{idx + 1}. {item.prompt}</Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Write your sentence here..."
              value={answers[idx]}
              onChange={(e) => {
                const updated = [...answers]
                updated[idx] = e.target.value
                setAnswers(updated)
              }}
              disabled={submitted}
              multiline
              minRows={1}
            />
            {submitted && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Example answer: <em>{item.example}</em>
                </Typography>
              </Box>
            )}
          </Paper>
        ))}
      </Stack>

      <Box sx={{ mt: 3 }}>
        {!submitted ? (
          <Button variant="contained" onClick={handleSubmit} disabled={!allAnswered} fullWidth size="large"
            sx={{ background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}>Submit Sentences</Button>
        ) : (
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2 }}>
            <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
            <Typography variant="h5" color="success.dark">Task C Complete! Score: {score}/{PROMPTS.length}</Typography>
            <Button variant="contained" onClick={() => navigate('/phase6/subphase/2/step/4/remedial/b1/task/a')} size="large"
              sx={{ mt: 2, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>Continue to Remedial B1</Button>
          </Paper>
        )}
      </Box>
    </Box>
  )
}
