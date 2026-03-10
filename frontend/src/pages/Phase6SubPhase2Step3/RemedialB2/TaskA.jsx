import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Select, MenuItem, FormControl, Alert, Chip, Stack } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const WORD_BANK = ['constructive', 'specific', 'balanced', 'suggestion', 'improve', 'polite']

export default function Phase6SP2Step3RemB2TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 3, interaction: 1, context: 'remedial_b2' })
  const [ans1, setAns1] = useState('')
  const [ans2, setAns2] = useState('')
  const [ans3, setAns3] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    let correct = 0
    if (ans1 === 'constructive') correct++
    if (ans2 === 'specific') correct++
    if (ans3 === 'improve') correct++
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step3_remedial_b2_taska_score', correct.toString())
    try { await phase6API.logRemedialActivity(3, 'B2', 'A', correct, 3, 0, 2) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">Step 3: Remedial B2 - Task A</Typography>
        <Typography variant="body1">Role-Play Dialogue: Explaining Effective Feedback</Typography>
      </Paper>
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: '#f3e5f5', borderRadius: 2 }}>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>Word Bank:</Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {WORD_BANK.map(w => <Box key={w} sx={{ px: 2, py: 0.5, backgroundColor: '#8e44ad', color: 'white', borderRadius: 1, mb: 1 }}><Typography variant="body2" fontWeight="bold">{w}</Typography></Box>)}
        </Stack>
      </Paper>
      <Alert severity="info" sx={{ mb: 3 }}>Complete the dialogue about why constructive feedback should be specific and balanced.</Alert>

      <Paper elevation={1} sx={{ p: 3, mb: 2, borderRadius: 2, borderLeft: '4px solid #e74c3c' }}>
        <Chip label="Ms. Mabrouki" size="small" sx={{ backgroundColor: '#e74c3c', color: 'white', mb: 1 }} />
        <Typography variant="body1" sx={{ fontStyle: 'italic' }}>"Why should feedback be constructive?"</Typography>
      </Paper>

      <Paper elevation={1} sx={{ p: 3, mb: 2, borderRadius: 2, borderLeft: '4px solid #27ae60', border: submitted ? '2px solid' : '1px solid #e0e0e0', borderColor: submitted ? (ans1 === 'constructive' ? 'success.main' : 'error.main') : '#e0e0e0' }}>
        <Chip label="You" size="small" sx={{ backgroundColor: '#27ae60', color: 'white', mb: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select value={ans1} onChange={(e) => setAns1(e.target.value)} disabled={submitted} displayEmpty>
              <MenuItem value=""><em>choose...</em></MenuItem>
              {['constructive', 'negative', 'harsh'].map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
            </Select>
          </FormControl>
          <Typography variant="body1">feedback helps people improve — it focuses on growth, not just on problems.</Typography>
        </Box>
        {submitted && ans1 !== 'constructive' && <Typography variant="body2" color="error" sx={{ mt: 1 }}>Correct: <strong>constructive</strong></Typography>}
      </Paper>

      <Paper elevation={1} sx={{ p: 3, mb: 2, borderRadius: 2, borderLeft: '4px solid #e74c3c' }}>
        <Chip label="Lilia" size="small" sx={{ backgroundColor: '#e74c3c', color: 'white', mb: 1 }} />
        <Typography variant="body1" sx={{ fontStyle: 'italic' }}>"And why does feedback need to be specific?"</Typography>
      </Paper>

      <Paper elevation={1} sx={{ p: 3, mb: 2, borderRadius: 2, borderLeft: '4px solid #27ae60', border: submitted ? '2px solid' : '1px solid #e0e0e0', borderColor: submitted ? (ans2 === 'specific' ? 'success.main' : 'error.main') : '#e0e0e0' }}>
        <Chip label="You" size="small" sx={{ backgroundColor: '#27ae60', color: 'white', mb: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select value={ans2} onChange={(e) => setAns2(e.target.value)} disabled={submitted} displayEmpty>
              <MenuItem value=""><em>choose...</em></MenuItem>
              {['specific', 'vague', 'silent'].map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
            </Select>
          </FormControl>
          <Typography variant="body1">feedback gives the person clear actions to take — not just "make it better" but exactly what to change.</Typography>
        </Box>
        {submitted && ans2 !== 'specific' && <Typography variant="body2" color="error" sx={{ mt: 1 }}>Correct: <strong>specific</strong></Typography>}
      </Paper>

      <Paper elevation={1} sx={{ p: 3, mb: 2, borderRadius: 2, borderLeft: '4px solid #e74c3c' }}>
        <Chip label="Ms. Mabrouki" size="small" sx={{ backgroundColor: '#e74c3c', color: 'white', mb: 1 }} />
        <Typography variant="body1" sx={{ fontStyle: 'italic' }}>"What is the purpose of the positive sandwich?"</Typography>
      </Paper>

      <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2, borderLeft: '4px solid #27ae60', border: submitted ? '2px solid' : '1px solid #e0e0e0', borderColor: submitted ? (ans3 === 'improve' ? 'success.main' : 'error.main') : '#e0e0e0' }}>
        <Chip label="You" size="small" sx={{ backgroundColor: '#27ae60', color: 'white', mb: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="body1">It motivates the person to</Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select value={ans3} onChange={(e) => setAns3(e.target.value)} disabled={submitted} displayEmpty>
              <MenuItem value=""><em>choose...</em></MenuItem>
              {['improve', 'quit', 'ignore'].map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
            </Select>
          </FormControl>
          <Typography variant="body1">by making the suggestion feel kind and supported, not discouraging.</Typography>
        </Box>
        {submitted && ans3 !== 'improve' && <Typography variant="body2" color="error" sx={{ mt: 1 }}>Correct: <strong>improve</strong></Typography>}
      </Paper>

      {!submitted ? (
        <Button variant="contained" onClick={handleSubmit} disabled={!ans1 || !ans2 || !ans3} fullWidth size="large"
          sx={{ background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}>Submit</Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark">Score: {score}/3</Typography>
          <Button variant="contained" onClick={() => navigate('/phase6/subphase/2/step/3/remedial/b2/task/b')} size="large"
            sx={{ mt: 2, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>Continue to Task B</Button>
        </Paper>
      )}
    </Box>
  )
}
