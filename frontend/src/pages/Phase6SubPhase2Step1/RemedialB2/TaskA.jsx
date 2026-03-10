import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Select, MenuItem, FormControl, Alert, Chip, Stack } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const WORD_BANK = ['positive', 'strength', 'weakness', 'suggestion', 'improve', 'feedback']

const GAPS = [
  { speaker: 'Peer', line: 'Can you give me feedback on my report?', isGap: false },
  { speaker: 'You', template: '[___] is your clear and well-organized summary.', correct: 'positive', options: ['positive', 'weakness', 'improve'], label: 'Gap 1' },
  { speaker: 'Peer', line: 'What is a weakness?', isGap: false },
  { speaker: 'You', template: 'A [___] is that there are not enough recommendations. My [___] is to add more specific ideas.', correct1: 'weakness', correct2: 'suggestion', options1: ['weakness', 'positive', 'improve'], options2: ['suggestion', 'feedback', 'strength'], label: 'Gap 2', isDouble: true }
]

export default function Phase6SP2Step1RemB2TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 1, interaction: 1, context: 'remedial_b2' })
  const [ans1, setAns1] = useState('')
  const [ans2, setAns2] = useState('')
  const [ans3, setAns3] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    let correct = 0
    if (ans1 === 'positive') correct++
    if (ans2 === 'weakness') correct++
    if (ans3 === 'suggestion') correct++
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step1_remedial_b2_taska_score', correct.toString())
    try { await phase6API.logRemedialActivity(1, 'B2', 'A', correct, 3, 0, 2) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">Step 1: Remedial B2 - Task A</Typography>
        <Typography variant="body1">Role-Play Dialogue: Giving Peer Feedback</Typography>
      </Paper>
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: '#f3e5f5', borderRadius: 2 }}>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>Word Bank:</Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {WORD_BANK.map(w => <Box key={w} sx={{ px: 2, py: 0.5, backgroundColor: '#8e44ad', color: 'white', borderRadius: 1, mb: 1 }}><Typography variant="body2" fontWeight="bold">{w}</Typography></Box>)}
        </Stack>
      </Paper>
      <Alert severity="info" sx={{ mb: 3 }}>Complete the peer feedback dialogue by choosing the correct feedback words.</Alert>

      <Paper elevation={1} sx={{ p: 3, mb: 2, borderRadius: 2, borderLeft: '4px solid #8e44ad' }}>
        <Chip label="Peer" size="small" sx={{ backgroundColor: '#8e44ad', color: 'white', mb: 1 }} />
        <Typography variant="body1" sx={{ fontStyle: 'italic' }}>"Can you give me feedback on my report?"</Typography>
      </Paper>

      <Paper elevation={1} sx={{ p: 3, mb: 2, borderRadius: 2, borderLeft: '4px solid #27ae60', border: submitted ? '2px solid' : '1px solid #e0e0e0', borderColor: submitted ? (ans1 === 'positive' ? 'success.main' : 'error.main') : '#e0e0e0' }}>
        <Chip label="You" size="small" sx={{ backgroundColor: '#27ae60', color: 'white', mb: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select value={ans1} onChange={(e) => setAns1(e.target.value)} disabled={submitted} displayEmpty>
              <MenuItem value=""><em>choose...</em></MenuItem>
              {['positive', 'weakness', 'improve'].map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
            </Select>
          </FormControl>
          <Typography variant="body1">is your clear and well-organized summary.</Typography>
        </Box>
        {submitted && ans1 !== 'positive' && <Typography variant="body2" color="error" sx={{ mt: 1 }}>Correct: <strong>positive</strong></Typography>}
      </Paper>

      <Paper elevation={1} sx={{ p: 3, mb: 2, borderRadius: 2, borderLeft: '4px solid #8e44ad' }}>
        <Chip label="Peer" size="small" sx={{ backgroundColor: '#8e44ad', color: 'white', mb: 1 }} />
        <Typography variant="body1" sx={{ fontStyle: 'italic' }}>"What is a weakness?"</Typography>
      </Paper>

      <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2, borderLeft: '4px solid #27ae60', border: submitted ? '2px solid' : '1px solid #e0e0e0', borderColor: submitted ? ((ans2 === 'weakness' && ans3 === 'suggestion') ? 'success.main' : 'error.main') : '#e0e0e0' }}>
        <Chip label="You" size="small" sx={{ backgroundColor: '#27ae60', color: 'white', mb: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="body1">A</Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select value={ans2} onChange={(e) => setAns2(e.target.value)} disabled={submitted} displayEmpty>
              <MenuItem value=""><em>choose...</em></MenuItem>
              {['weakness', 'positive', 'improve'].map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
            </Select>
          </FormControl>
          <Typography variant="body1">is that there are not enough recommendations. My</Typography>
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <Select value={ans3} onChange={(e) => setAns3(e.target.value)} disabled={submitted} displayEmpty>
              <MenuItem value=""><em>choose...</em></MenuItem>
              {['suggestion', 'feedback', 'strength'].map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
            </Select>
          </FormControl>
          <Typography variant="body1">is to add more specific ideas.</Typography>
        </Box>
        {submitted && (ans2 !== 'weakness' || ans3 !== 'suggestion') && <Typography variant="body2" color="error" sx={{ mt: 1 }}>Correct: <strong>weakness</strong> ... <strong>suggestion</strong></Typography>}
      </Paper>

      {!submitted ? (
        <Button variant="contained" onClick={handleSubmit} disabled={!ans1 || !ans2 || !ans3} fullWidth size="large"
          sx={{ background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}>Submit</Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark">Score: {score}/3</Typography>
          <Button variant="contained" onClick={() => navigate('/phase6/subphase/2/step/1/remedial/b2/task/b')} size="large"
            sx={{ mt: 2, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>Continue to Task B</Button>
        </Paper>
      )}
    </Box>
  )
}
