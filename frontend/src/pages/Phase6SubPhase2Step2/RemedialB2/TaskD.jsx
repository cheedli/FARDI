import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Alert, Stack, LinearProgress } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const TERMS = [
  { term: 'feedback', meaning: 'Comments given to help someone improve their work' },
  { term: 'constructive', meaning: 'Helpful and focused on improvement' },
  { term: 'suggestion', meaning: 'An idea to make something better' },
  { term: 'strength', meaning: 'A positive quality in someone\'s work' },
  { term: 'weakness', meaning: 'An area in the report that needs improvement' },
  { term: 'polite', meaning: 'Being respectful and kind when giving feedback' }
]

export default function Phase6SP2Step2RemB2TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 2, interaction: 4, context: 'remedial_b2' })
  const [current, setCurrent] = useState(0)
  const [spelling, setSpelling] = useState('')
  const [explanation, setExplanation] = useState('')
  const [results, setResults] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleNext = () => {
    const isCorrectSpell = spelling.trim().toLowerCase() === TERMS[current].term.toLowerCase()
    const hasExplanation = explanation.trim().split(/\s+/).length >= 3
    const pts = (isCorrectSpell ? 0.5 : 0) + (hasExplanation ? 0.5 : 0)
    const newResults = [...results, { pts }]
    setResults(newResults)
    if (current < TERMS.length - 1) {
      setCurrent(current + 1)
      setSpelling('')
      setExplanation('')
    } else {
      const total = newResults.reduce((s, r) => s + r.pts, 0)
      const finalScore = Math.round(total)
      setScore(finalScore)
      setSubmitted(true)
      sessionStorage.setItem('phase6_sp2_step2_remedial_b2_taskd_score', finalScore.toString())
      phase6API.logRemedialActivity(2, 'B2', 'D', finalScore, TERMS.length, 0, 2).catch(e => console.error(e))
    }
  }

  if (submitted) {
    return (
      <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 60, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" gutterBottom>Task D Complete! Score: {score}/{TERMS.length}</Typography>
          <Button variant="contained" onClick={() => navigate('/phase6/subphase/2/step/3')} size="large"
            sx={{ mt: 2, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>Continue to Step 3</Button>
        </Paper>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">Step 2: Remedial B2 - Task D</Typography>
        <Typography variant="body1">Spell & Explain: Peer Feedback Terms</Typography>
      </Paper>
      <Alert severity="info" sx={{ mb: 3 }}>For each term: spell it correctly, then explain its meaning in your own words.</Alert>
      <LinearProgress variant="determinate" value={(current / TERMS.length) * 100} sx={{ mb: 3, height: 8, borderRadius: 4, backgroundColor: '#f3e5f5', '& .MuiLinearProgress-bar': { backgroundColor: '#8e44ad' } }} />
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Term {current + 1} of {TERMS.length}</Typography>
      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        <Alert severity="info" sx={{ mb: 3 }}>Hint: This word has {TERMS[current].term.length} letters and means: "{TERMS[current].meaning}"</Alert>
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>Spell the term:</Typography>
            <TextField fullWidth value={spelling} onChange={(e) => setSpelling(e.target.value)} placeholder="Type the spelling here..." />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>Explain the meaning:</Typography>
            <TextField fullWidth multiline rows={3} value={explanation} onChange={(e) => setExplanation(e.target.value)} placeholder="Write what this word means in feedback..." />
          </Box>
        </Stack>
        <Button variant="contained" onClick={handleNext} disabled={!spelling.trim() || !explanation.trim()} fullWidth size="large"
          sx={{ mt: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}>
          {current < TERMS.length - 1 ? 'Next Term' : 'Finish'}
        </Button>
      </Paper>
    </Box>
  )
}
