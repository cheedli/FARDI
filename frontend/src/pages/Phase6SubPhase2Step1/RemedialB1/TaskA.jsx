import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Select, MenuItem, FormControl, Alert, Chip } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

// BLANK1: correct = positive
const BLANK1_OPTIONS = ['positive', 'negative', 'boring']
// BLANK2: correct = suggestion
const BLANK2_OPTIONS = ['suggestion', 'problem', 'excuse']
// BLANK3: correct = feedback
const BLANK3_OPTIONS = ['feedback', 'silence', 'argument']

export default function Phase6SP2Step1RemB1TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 1, interaction: 1, context: 'remedial_b1' })
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
    sessionStorage.setItem('phase6_sp2_step1_remedial_b1_taska_score', correct.toString())
    try { await phase6API.logRemedialActivity(1, 'B1', 'A', correct, 3, 0, 2) } catch (e) { console.error(e) }
  }

  const allAnswered = ans1 && ans2 && ans3

  const gap = (value, setter, options, correct) => (
    <FormControl size="small" sx={{ minWidth: 130, mx: 0.5 }}>
      <Select
        value={value}
        onChange={(e) => setter(e.target.value)}
        disabled={submitted}
        displayEmpty
        sx={submitted ? {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: value === correct ? '#27ae60' : '#e74c3c',
            borderWidth: 2
          }
        } : {}}
      >
        <MenuItem value=""><em>choose...</em></MenuItem>
        {options.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
      </Select>
    </FormControl>
  )

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">Step 1: Remedial B1 — Task A</Typography>
        <Typography variant="body1">Negotiation Gap Fill: Feedback Dialogue</Typography>
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        Complete the feedback dialogue by choosing the correct words.
      </Alert>

      {/* Line 1: SKANDER */}
      <Paper elevation={1} sx={{ p: 2.5, mb: 2, borderRadius: 2, borderLeft: '4px solid #e74c3c' }}>
        <Chip label="SKANDER" size="small" sx={{ backgroundColor: '#e74c3c', color: 'white', mb: 1, fontWeight: 'bold' }} />
        <Typography variant="body1" sx={{ fontStyle: 'italic' }}>"Your report good?"</Typography>
      </Paper>

      {/* Line 2: You — BLANK1 */}
      <Paper
        elevation={1}
        sx={{
          p: 2.5, mb: 2, borderRadius: 2, borderLeft: '4px solid #8e44ad',
          border: submitted ? '2px solid' : undefined,
          borderColor: submitted ? (ans1 === 'positive' ? 'success.main' : 'error.main') : undefined
        }}
      >
        <Chip label="You" size="small" sx={{ backgroundColor: '#8e44ad', color: 'white', mb: 1, fontWeight: 'bold' }} />
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
          <Typography variant="body1">Yes,</Typography>
          {gap(ans1, setAns1, BLANK1_OPTIONS, 'positive')}
          <Typography variant="body1">parts.</Typography>
        </Box>
        {submitted && ans1 !== 'positive' && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>Correct: <strong>positive</strong></Typography>
        )}
      </Paper>

      {/* Line 3: Emna */}
      <Paper elevation={1} sx={{ p: 2.5, mb: 2, borderRadius: 2, borderLeft: '4px solid #e67e22' }}>
        <Chip label="Emna" size="small" sx={{ backgroundColor: '#e67e22', color: 'white', mb: 1, fontWeight: 'bold' }} />
        <Typography variant="body1" sx={{ fontStyle: 'italic' }}>"Improve?"</Typography>
      </Paper>

      {/* Line 4: You — BLANK2 + BLANK3 */}
      <Paper
        elevation={1}
        sx={{
          p: 2.5, mb: 3, borderRadius: 2, borderLeft: '4px solid #8e44ad',
          border: submitted ? '2px solid' : undefined,
          borderColor: submitted ? (ans2 === 'suggestion' && ans3 === 'feedback' ? 'success.main' : 'error.main') : undefined
        }}
      >
        <Chip label="You" size="small" sx={{ backgroundColor: '#8e44ad', color: 'white', mb: 1, fontWeight: 'bold' }} />
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
          {gap(ans2, setAns2, BLANK2_OPTIONS, 'suggestion')}
          <Typography variant="body1">is add</Typography>
          {gap(ans3, setAns3, BLANK3_OPTIONS, 'feedback')}
          <Typography variant="body1">quotes.</Typography>
        </Box>
        {submitted && (ans2 !== 'suggestion' || ans3 !== 'feedback') && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            Correct: <strong>suggestion</strong> is add <strong>feedback</strong> quotes.
          </Typography>
        )}
      </Paper>

      {!submitted ? (
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!allAnswered}
          fullWidth
          size="large"
          sx={{ background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}
        >
          Submit
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#f3e5f5', border: '2px solid #8e44ad', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#8e44ad', mb: 1 }} />
          <Typography variant="h5" sx={{ color: '#6c3483' }}>Task A Complete! Score: {score}/3</Typography>
          <Typography variant="body1" sx={{ mt: 1, mb: 2, color: '#555' }}>
            {score === 3 ? 'Perfect! You know the key feedback vocabulary.' : 'Good effort! Review the correct answers above.'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/2/step/1/remedial/b1/task/b')}
            size="large"
            sx={{ background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}
          >
            Continue to Task B →
          </Button>
        </Paper>
      )}
    </Box>
  )
}
