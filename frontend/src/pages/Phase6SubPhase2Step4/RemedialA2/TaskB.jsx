import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Select, MenuItem, FormControl, Alert, Chip, Stack } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const WORD_BANK = ['feedback', 'positive', 'suggestion', 'strength', 'weakness', 'improve']

const GAPS = [
  { sentence: 'Give ___.', correct: 'feedback' },
  { sentence: 'Say ___ things.', correct: 'positive' },
  { sentence: 'My ___ is...', correct: 'suggestion' },
  { sentence: '___ is good.', correct: 'strength' },
  { sentence: '___ is bad.', correct: 'weakness' },
  { sentence: 'We can ___.', correct: 'improve' }
]

export default function Phase6SP2Step4RemA2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 4, interaction: 2, context: 'remedial_a2' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    let correct = 0
    GAPS.forEach((g, i) => { if (answers[i] === g.correct) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step4_remedial_a2_taskb_score', correct.toString())
    try { await phase6API.logRemedialActivity(4, 'A2', 'B', correct, GAPS.length, 0, 2) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">Step 4: Remedial A2 - Task B</Typography>
        <Typography variant="body1">Fill Frenzy: Complete the Sentences</Typography>
      </Paper>

      <Alert severity="info" sx={{ mb: 2 }}>Choose the correct feedback word to fill each blank.</Alert>

      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom fontWeight="bold">Word Bank:</Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {WORD_BANK.map((w) => (
            <Chip key={w} label={w} variant="outlined" sx={{ borderColor: '#8e44ad', color: '#6c3483', fontWeight: 'bold' }} />
          ))}
        </Stack>
      </Paper>

      {GAPS.map((g, idx) => (
        <Paper key={idx} elevation={1} sx={{ p: 3, mb: 2, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', border: submitted ? '2px solid' : '1px solid #e0e0e0', borderColor: submitted ? (answers[idx] === g.correct ? 'success.main' : 'error.main') : '#e0e0e0' }}>
          <Typography variant="body1" fontWeight="bold">{idx + 1}.</Typography>
          <Typography variant="body1">{g.sentence}</Typography>
          <FormControl size="small" sx={{ minWidth: { xs: 110, sm: 160 } }}>
            <Select value={answers[idx] || ''} onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })} disabled={submitted} displayEmpty>
              <MenuItem value="" disabled><em>Choose word</em></MenuItem>
              {WORD_BANK.map((opt) => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
            </Select>
          </FormControl>
          {submitted && answers[idx] !== g.correct && (
            <Typography variant="body2" color="error">Correct: {g.correct}</Typography>
          )}
          {submitted && answers[idx] === g.correct && (
            <Typography variant="body2" color="success.main">Correct!</Typography>
          )}
        </Paper>
      ))}

      {!submitted ? (
        <Button variant="contained" onClick={handleSubmit} disabled={Object.keys(answers).length < GAPS.length} fullWidth size="large"
          sx={{ background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}>Submit Answers</Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark">Task B Complete! Score: {score}/{GAPS.length}</Typography>
          <Button variant="contained" onClick={() => navigate('/phase6/subphase/2/step/4/remedial/a2/task/c')} size="large"
            sx={{ mt: 2, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>Continue to Task C</Button>
        </Paper>
      )}
    </Box>
  )
}
