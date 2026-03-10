import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Select, MenuItem, FormControl, Alert, Chip, Stack } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const WORD_BANK = ['constructive', 'specific', 'balanced', 'empathy', 'actionable', 'growth mindset']

export default function Phase6SP2Step1RemC1TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 1, interaction: 1, context: 'remedial_c1' })
  const [ans1, setAns1] = useState('')
  const [ans2, setAns2] = useState('')
  const [ans3, setAns3] = useState('')
  const [ans4, setAns4] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    let correct = 0
    if (ans1 === 'constructive') correct++
    if (ans2 === 'growth mindset') correct++
    if (ans3 === 'specific') correct++
    if (ans4 === 'empathy') correct++
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step1_remedial_c1_taska_score', correct.toString())
    try { await phase6API.logRemedialActivity(1, 'C1', 'A', correct, 4, 0, 2) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">Step 1: Remedial C1 - Task A</Typography>
        <Typography variant="body1">Debate Simulation: Defending Effective Peer Feedback Principles</Typography>
      </Paper>
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: '#f3e5f5', borderRadius: 2 }}>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>Word Bank:</Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {WORD_BANK.map(w => <Box key={w} sx={{ px: 2, py: 0.5, backgroundColor: '#8e44ad', color: 'white', borderRadius: 1, mb: 1 }}><Typography variant="body2" fontWeight="bold">{w}</Typography></Box>)}
        </Stack>
      </Paper>
      <Alert severity="info" sx={{ mb: 3 }}>Complete the debate dialogue about effective peer feedback using C1-level vocabulary.</Alert>

      <Paper elevation={1} sx={{ p: 3, mb: 2, borderRadius: 2, borderLeft: '4px solid #e74c3c' }}>
        <Chip label="Peer" size="small" sx={{ backgroundColor: '#e74c3c', color: 'white', mb: 1 }} />
        <Typography variant="body1" sx={{ fontStyle: 'italic' }}>"Why does feedback need to be constructive? Can't we just say what we think?"</Typography>
      </Paper>

      <Paper elevation={1} sx={{ p: 3, mb: 2, borderRadius: 2, borderLeft: '4px solid #27ae60', border: submitted ? '2px solid' : '1px solid #e0e0e0', borderColor: submitted ? ((ans1 === 'constructive' && ans2 === 'growth mindset') ? 'success.main' : 'error.main') : '#e0e0e0' }}>
        <Chip label="You" size="small" sx={{ backgroundColor: '#27ae60', color: 'white', mb: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select value={ans1} onChange={(e) => setAns1(e.target.value)} disabled={submitted} displayEmpty>
              <MenuItem value=""><em>choose...</em></MenuItem>
              {['constructive', 'harsh', 'vague'].map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
            </Select>
          </FormControl>
          <Typography variant="body1">feedback drives a</Typography>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select value={ans2} onChange={(e) => setAns2(e.target.value)} disabled={submitted} displayEmpty>
              <MenuItem value=""><em>choose...</em></MenuItem>
              {['growth mindset', 'fixed mindset', 'negative attitude'].map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
            </Select>
          </FormControl>
          <Typography variant="body1">— it motivates people to improve rather than feel attacked.</Typography>
        </Box>
        {submitted && (ans1 !== 'constructive' || ans2 !== 'growth mindset') && <Typography variant="body2" color="error" sx={{ mt: 1 }}>Correct: <strong>constructive</strong> ... <strong>growth mindset</strong></Typography>}
      </Paper>

      <Paper elevation={1} sx={{ p: 3, mb: 2, borderRadius: 2, borderLeft: '4px solid #e74c3c' }}>
        <Chip label="Peer" size="small" sx={{ backgroundColor: '#e74c3c', color: 'white', mb: 1 }} />
        <Typography variant="body1" sx={{ fontStyle: 'italic' }}>"But how do you make feedback actually useful and not just nice words?"</Typography>
      </Paper>

      <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2, borderLeft: '4px solid #27ae60', border: submitted ? '2px solid' : '1px solid #e0e0e0', borderColor: submitted ? ((ans3 === 'specific' && ans4 === 'empathy') ? 'success.main' : 'error.main') : '#e0e0e0' }}>
        <Chip label="You" size="small" sx={{ backgroundColor: '#27ae60', color: 'white', mb: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="body1">Be</Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select value={ans3} onChange={(e) => setAns3(e.target.value)} disabled={submitted} displayEmpty>
              <MenuItem value=""><em>choose...</em></MenuItem>
              {['specific', 'vague', 'harsh'].map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
            </Select>
          </FormControl>
          <Typography variant="body1">and balanced in your comments, and use</Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select value={ans4} onChange={(e) => setAns4(e.target.value)} disabled={submitted} displayEmpty>
              <MenuItem value=""><em>choose...</em></MenuItem>
              {['empathy', 'anger', 'sarcasm'].map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
            </Select>
          </FormControl>
          <Typography variant="body1">to understand how the person might feel when receiving it.</Typography>
        </Box>
        {submitted && (ans3 !== 'specific' || ans4 !== 'empathy') && <Typography variant="body2" color="error" sx={{ mt: 1 }}>Correct: <strong>specific</strong> ... <strong>empathy</strong></Typography>}
      </Paper>

      {!submitted ? (
        <Button variant="contained" onClick={handleSubmit} disabled={!ans1 || !ans2 || !ans3 || !ans4} fullWidth size="large"
          sx={{ background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}>Submit</Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark">Score: {score}/4</Typography>
          <Button variant="contained" onClick={() => navigate('/phase6/subphase/2/step/1/remedial/c1/task/b')} size="large"
            sx={{ mt: 2, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>Continue to Task B</Button>
        </Paper>
      )}
    </Box>
  )
}
