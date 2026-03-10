import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Paper, Typography, Button, Alert,
  FormControl, InputLabel, Select, MenuItem, Chip, Stack
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const WORD_BANK = ['positive', 'suggestion', 'specific', 'balanced', 'polite']

const GAPS = [
  { id: 'ans1', answer: 'positive' },
  { id: 'ans2', answer: 'specific' },
  { id: 'ans3', answer: 'suggestion' },
  { id: 'ans4', answer: 'polite' },
]

export default function Phase6SP2Step5RemB2TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 5, interaction: 1, context: 'remedial_b2' })
  const [selections, setSelections] = useState({ ans1: '', ans2: '', ans3: '', ans4: '' })
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleChange = (id, value) => {
    setSelections(prev => ({ ...prev, [id]: value }))
  }

  const allFilled = Object.values(selections).every(v => v !== '')

  const handleSubmit = async () => {
    if (!allFilled) return
    const correct = GAPS.filter(g => selections[g.id].toLowerCase() === g.answer).length
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step5_remedial_b2_taska_score', correct.toString())
    try { await phase6API.logRemedialActivity(5, 'B2', 'A', correct, 4, 0, 2) } catch (e) { console.error(e) }
  }

  const GapSelect = ({ id, label }) => {
    const gap = GAPS.find(g => g.id === id)
    const isCorrect = submitted && selections[id].toLowerCase() === gap.answer
    const isWrong = submitted && selections[id].toLowerCase() !== gap.answer
    return (
      <FormControl size="small" sx={{ minWidth: 140, display: 'inline-flex', verticalAlign: 'middle', mx: 0.5 }}>
        <InputLabel>{label}</InputLabel>
        <Select
          value={selections[id]}
          label={label}
          onChange={e => handleChange(id, e.target.value)}
          disabled={submitted}
          sx={{
            bgcolor: submitted
              ? (isCorrect ? '#e8f5e9' : '#fdecea')
              : 'white'
          }}
        >
          {WORD_BANK.map(w => (
            <MenuItem key={w} value={w}>{w}</MenuItem>
          ))}
        </Select>
        {isWrong && (
          <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
            Correct: <strong>{gap.answer}</strong>
          </Typography>
        )}
      </FormControl>
    )
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">Step 5: Remedial B2 — Task A</Typography>
        <Typography variant="body1">Role-Play Dialogue Gap Fill: Discussing Peer Feedback Quality</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Word Bank</Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3 }}>
          {WORD_BANK.map(w => (
            <Chip key={w} label={w} variant="outlined" sx={{ borderColor: '#8e44ad', color: '#8e44ad', fontWeight: 'bold', mb: 1 }} />
          ))}
        </Stack>

        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Complete the dialogue by selecting the correct word for each gap.
        </Typography>

        <Box sx={{ p: 2, bgcolor: '#f9f4fc', borderRadius: 2, border: '1px solid #d7bde2' }}>

          {/* Line 1 — Peer */}
          <Box sx={{ mb: 2, p: 1.5, bgcolor: '#ede7f6', borderRadius: 1 }}>
            <Chip label="Peer" size="small" sx={{ backgroundColor: '#8e44ad', color: 'white', mb: 1 }} />
            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>"Feedback too negative?"</Typography>
          </Box>

          {/* Line 2 — You */}
          <Box sx={{ mb: 2, p: 1.5, bgcolor: '#f3e5f5', borderRadius: 1 }}>
            <Chip label="You" size="small" sx={{ backgroundColor: '#6c3483', color: 'white', mb: 1 }} />
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap', gap: 0.5 }}>
              <Typography variant="body1" component="span">"Yes - add&nbsp;</Typography>
              <GapSelect id="ans1" label="Gap 1" />
              <Typography variant="body1" component="span">&nbsp;first."</Typography>
            </Box>
          </Box>

          {/* Line 3 — Peer */}
          <Box sx={{ mb: 2, p: 1.5, bgcolor: '#ede7f6', borderRadius: 1 }}>
            <Chip label="Peer" size="small" sx={{ backgroundColor: '#8e44ad', color: 'white', mb: 1 }} />
            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>"How?"</Typography>
          </Box>

          {/* Line 4 — You */}
          <Box sx={{ p: 1.5, bgcolor: '#f3e5f5', borderRadius: 1 }}>
            <Chip label="You" size="small" sx={{ backgroundColor: '#6c3483', color: 'white', mb: 1 }} />
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap', gap: 0.5 }}>
              <Typography variant="body1" component="span">"Use&nbsp;</Typography>
              <GapSelect id="ans2" label="Gap 2" />
              <GapSelect id="ans3" label="Gap 3" />
              <Typography variant="body1" component="span">&nbsp;and be&nbsp;</Typography>
              <GapSelect id="ans4" label="Gap 4" />
              <Typography variant="body1" component="span">."</Typography>
            </Box>
          </Box>

        </Box>
      </Paper>

      {submitted && (
        <Alert
          severity={score === 4 ? 'success' : score >= 3 ? 'warning' : 'error'}
          sx={{ mb: 2 }}
        >
          {score === 4
            ? 'Perfect! All 4 gaps correct. You understand how to give quality peer feedback.'
            : `You got ${score}/4 correct. Remember: add positive first, then use specific suggestion and be polite.`}
        </Alert>
      )}

      {!submitted ? (
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!allFilled}
          fullWidth
          size="large"
          sx={{ background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}
        >
          Submit Answers
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#f9f0ff', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#8e44ad', mb: 1 }} />
          <Typography variant="h5" sx={{ color: '#6c3483' }}>Task A Complete! Score: {score}/4</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {score === 4
              ? 'Excellent — you have mastered the peer feedback dialogue structure!'
              : 'Good effort! Key sequence: positive first → specific suggestion → be polite.'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/2/step/5/remedial/b2/task/b')}
            size="large"
            sx={{ mt: 2, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}
          >
            Continue to Task B
          </Button>
        </Paper>
      )}
    </Box>
  )
}
