import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Select, MenuItem, FormControl, Alert, Chip } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

export default function Phase6SP2Step2RemB1TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 2, interaction: 1, context: 'remedial_b1' })
  const [ans1, setAns1] = useState('')
  const [ans2, setAns2] = useState('')
  const [ans3, setAns3] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    let correct = 0
    if (ans1 === 'positive') correct++
    if (ans2 === 'suggestion') correct++
    if (ans3 === 'feedback') correct++
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step2_remedial_b1_taska_score', correct.toString())
    try { await phase6API.logRemedialActivity(2, 'B1', 'A', correct, 3, 0, 2) } catch (e) { console.error(e) }
  }

  const isAns1Correct = ans1 === 'positive'
  const isAns2Correct = ans2 === 'suggestion'
  const isAns3Correct = ans3 === 'feedback'

  const lineBorderColor = (correct) => submitted ? (correct ? 'success.main' : 'error.main') : 'transparent'

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">Step 2: Remedial B1 - Task A</Typography>
        <Typography variant="body1">Negotiation Gap Fill: Peer Feedback Dialogue</Typography>
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        Complete the peer feedback dialogue by choosing the correct word for each blank.
      </Alert>

      {/* Line 1 — SKANDER */}
      <Paper elevation={1} sx={{ p: 2.5, mb: 2, borderRadius: 2, borderLeft: '4px solid #8e44ad' }}>
        <Chip label="SKANDER" size="small" sx={{ backgroundColor: '#8e44ad', color: 'white', mb: 1 }} />
        <Typography variant="body1" sx={{ fontStyle: 'italic' }}>"Your report?"</Typography>
      </Paper>

      {/* Line 2 — You: [BLANK1] is clear. */}
      <Paper
        elevation={1}
        sx={{
          p: 2.5,
          mb: 2,
          borderRadius: 2,
          borderLeft: '4px solid #27ae60',
          border: submitted ? '2px solid' : '1px solid #e0e0e0',
          borderColor: submitted ? lineBorderColor(isAns1Correct) : '#e0e0e0',
        }}
      >
        <Chip label="You" size="small" sx={{ backgroundColor: '#27ae60', color: 'white', mb: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <Select value={ans1} onChange={(e) => setAns1(e.target.value)} disabled={submitted} displayEmpty>
              <MenuItem value=""><em>choose...</em></MenuItem>
              {['positive', 'negative', 'bad'].map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
            </Select>
          </FormControl>
          <Typography variant="body1">is clear.</Typography>
        </Box>
        {submitted && !isAns1Correct && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            Correct: <strong>positive</strong>
          </Typography>
        )}
      </Paper>

      {/* Line 3 — EMNA */}
      <Paper elevation={1} sx={{ p: 2.5, mb: 2, borderRadius: 2, borderLeft: '4px solid #8e44ad' }}>
        <Chip label="Emna" size="small" sx={{ backgroundColor: '#8e44ad', color: 'white', mb: 1 }} />
        <Typography variant="body1" sx={{ fontStyle: 'italic' }}>"Improve?"</Typography>
      </Paper>

      {/* Line 4 — You: [BLANK2] is add [BLANK3] quotes. */}
      <Paper
        elevation={1}
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: 2,
          borderLeft: '4px solid #27ae60',
          border: submitted ? '2px solid' : '1px solid #e0e0e0',
          borderColor: submitted ? lineBorderColor(isAns2Correct && isAns3Correct) : '#e0e0e0',
        }}
      >
        <Chip label="You" size="small" sx={{ backgroundColor: '#27ae60', color: 'white', mb: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select value={ans2} onChange={(e) => setAns2(e.target.value)} disabled={submitted} displayEmpty>
              <MenuItem value=""><em>choose...</em></MenuItem>
              {['suggestion', 'problem', 'mistake'].map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
            </Select>
          </FormControl>
          <Typography variant="body1">is add</Typography>
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <Select value={ans3} onChange={(e) => setAns3(e.target.value)} disabled={submitted} displayEmpty>
              <MenuItem value=""><em>choose...</em></MenuItem>
              {['feedback', 'bad', 'none'].map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
            </Select>
          </FormControl>
          <Typography variant="body1">quotes.</Typography>
        </Box>
        {submitted && (!isAns2Correct || !isAns3Correct) && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            Correct: <strong>suggestion</strong> is add <strong>feedback</strong> quotes.
          </Typography>
        )}
      </Paper>

      {!submitted ? (
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!ans1 || !ans2 || !ans3}
          fullWidth
          size="large"
          sx={{ background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}
        >
          Submit
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" gutterBottom>
            Score: {score}/3
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {score === 3 ? 'Perfect! All blanks correct.' : `You got ${score} out of 3 correct.`}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/2/step/2/remedial/b1/task/b')}
            size="large"
            sx={{ background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}
          >
            Continue to Task B
          </Button>
        </Paper>
      )}
    </Box>
  )
}
