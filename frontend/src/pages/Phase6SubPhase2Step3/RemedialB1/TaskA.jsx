import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Paper, Typography, Button, Alert,
  FormControl, InputLabel, Select, MenuItem, Chip, Stack
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const GAPS = [
  { id: 'ans1', answer: 'positive',    options: ['positive', 'negative', 'feedback'] },
  { id: 'ans2', answer: 'suggestion',  options: ['suggestion', 'problem', 'mistake'] },
  { id: 'ans3', answer: 'improve',     options: ['improve', 'fail', 'ignore'] },
]

export default function Phase6SP2Step3RemB1TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 3, interaction: 1, context: 'remedial_b1' })
  const [selections, setSelections] = useState({ ans1: '', ans2: '', ans3: '' })
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleChange = (id, value) => {
    setSelections(prev => ({ ...prev, [id]: value }))
  }

  const allFilled = Object.values(selections).every(v => v !== '')

  const handleSubmit = async () => {
    if (!allFilled) return
    const correct = GAPS.filter(g => selections[g.id] === g.answer).length
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step3_remedial_b1_taska_score', correct.toString())
    try { await phase6API.logRemedialActivity(3, 'B1', 'A', correct, 3, 0, 2) } catch (e) { console.error(e) }
  }

  const GapSelect = ({ id, label }) => {
    const gap = GAPS.find(g => g.id === id)
    const isCorrect = submitted && selections[id] === gap.answer
    const isWrong = submitted && selections[id] !== gap.answer
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
          {gap.options.map(o => (
            <MenuItem key={o} value={o}>{o}</MenuItem>
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
        <Typography variant="h5" gutterBottom fontWeight="bold">Step 3: Remedial B1 — Task A</Typography>
        <Typography variant="body1">Negotiation Gap Fill: Explaining Feedback Terms</Typography>
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        Complete the dialogue by selecting the correct word for each gap.
      </Alert>

      <Box sx={{ p: 2, bgcolor: '#f9f4fc', borderRadius: 2, border: '1px solid #d7bde2', mb: 3 }}>

        {/* Line 1 — Lilia */}
        <Box sx={{ mb: 2, p: 1.5, bgcolor: '#ede7f6', borderRadius: 1 }}>
          <Chip label="Lilia" size="small" sx={{ backgroundColor: '#8e44ad', color: 'white', mb: 1 }} />
          <Typography variant="body1" sx={{ fontStyle: 'italic' }}>"Why positive first?"</Typography>
        </Box>

        {/* Line 2 — You */}
        <Box sx={{ mb: 2, p: 1.5, bgcolor: '#f3e5f5', borderRadius: 1 }}>
          <Chip label="You" size="small" sx={{ backgroundColor: '#6c3483', color: 'white', mb: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap', gap: 0.5 }}>
            <GapSelect id="ans1" label="Gap 1" />
            <Typography variant="body1" component="span">&nbsp;makes feel good."</Typography>
          </Box>
        </Box>

        {/* Line 3 — Ryan */}
        <Box sx={{ mb: 2, p: 1.5, bgcolor: '#ede7f6', borderRadius: 1 }}>
          <Chip label="Ryan" size="small" sx={{ backgroundColor: '#8e44ad', color: 'white', mb: 1 }} />
          <Typography variant="body1" sx={{ fontStyle: 'italic' }}>"Suggestion?"</Typography>
        </Box>

        {/* Line 4 — You */}
        <Box sx={{ p: 1.5, bgcolor: '#f3e5f5', borderRadius: 1 }}>
          <Chip label="You" size="small" sx={{ backgroundColor: '#6c3483', color: 'white', mb: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap', gap: 0.5 }}>
            <GapSelect id="ans2" label="Gap 2" />
            <Typography variant="body1" component="span">&nbsp;tells how&nbsp;</Typography>
            <GapSelect id="ans3" label="Gap 3" />
            <Typography variant="body1" component="span">."</Typography>
          </Box>
        </Box>

      </Box>

      {submitted && (
        <Alert
          severity={score === 3 ? 'success' : score >= 2 ? 'warning' : 'error'}
          sx={{ mb: 2 }}
        >
          {score === 3
            ? 'Perfect! All 3 gaps correct. You understand the key feedback terms.'
            : `You got ${score}/3 correct. Remember: positive makes feel good; suggestion tells how to improve.`}
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
          <Typography variant="h5" sx={{ color: '#6c3483' }}>Task A Complete! Score: {score}/3</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {score === 3
              ? 'Excellent — you have mastered the feedback negotiation vocabulary!'
              : 'Good effort! Key terms: positive → makes feel good; suggestion → tells how to improve.'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/2/step/3/remedial/b1/task/b')}
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
