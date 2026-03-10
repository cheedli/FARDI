import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Select, MenuItem, FormControl, Alert, Chip, Stack } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const WORD_BANK = ['accountability', 'objectivity', 'evidence-based', 'growth mindset', 'nuanced', 'empathy']

const DIALOGUE = [
  {
    speaker: 'Critic',
    role: 'critic',
    text: 'Positive sandwich is just a way to soften criticism — it lacks honesty.',
    hasGap: false,
  },
  {
    speaker: 'You',
    role: 'student',
    text: 'Actually, ___ feedback that balances praise with critique requires more precision and ___ than purely negative feedback.',
    hasGap: true,
    gapIndices: [0, 1],
    corrects: ['nuanced', 'objectivity'],
  },
  {
    speaker: 'Critic',
    role: 'critic',
    text: 'But how do you ensure your feedback is credible rather than just polite?',
    hasGap: false,
  },
  {
    speaker: 'You',
    role: 'student',
    text: 'By making all suggestions ___ — linked to specific moments in the text — and framing them to foster a ___ rather than defensiveness.',
    hasGap: true,
    gapIndices: [2, 3],
    corrects: ['evidence-based', 'growth mindset'],
  },
]

const SPEAKER_COLORS = {
  critic: { bg: '#fce4ec', border: '#c62828', label: '#b71c1c' },
  student: { bg: '#e8f5e9', border: '#43a047', label: '#2e7d32' },
}

export default function Phase6SP2Step4RemC1TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 4, interaction: 1, context: 'remedial_c1' })
  const [answers, setAnswers] = useState({ 0: '', 1: '', 2: '', 3: '' })
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const correctAnswers = { 0: 'nuanced', 1: 'objectivity', 2: 'evidence-based', 3: 'growth mindset' }

  const handleSubmit = async () => {
    let correct = 0
    Object.keys(correctAnswers).forEach((k) => {
      if (answers[k] === correctAnswers[k]) correct++
    })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step4_remedial_c1_taska_score', correct.toString())
    try { await phase6API.logRemedialActivity(4, 'C1', 'A', correct, 4, 0, 2) } catch (e) { console.error(e) }
  }

  const allFilled = Object.values(answers).every((v) => v !== '')

  const renderTwoGapLine = (line, lineIdx) => {
    const colors = SPEAKER_COLORS[line.role]
    const [g1, g2] = line.gapIndices
    const parts = line.text.split('___')

    return (
      <Paper key={lineIdx} elevation={1} sx={{ p: 2, mb: 2, borderRadius: 2, borderLeft: `4px solid ${colors.border}`, backgroundColor: colors.bg }}>
        <Typography variant="caption" fontWeight="bold" sx={{ color: colors.label, textTransform: 'uppercase', letterSpacing: 1 }}>
          {line.speaker}
        </Typography>
        <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="body1">{parts[0]}</Typography>
          <FormControl size="small">
            <Select
              value={answers[g1]}
              onChange={(e) => setAnswers({ ...answers, [g1]: e.target.value })}
              disabled={submitted}
              displayEmpty
              sx={{
                minWidth: 160,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: submitted ? (answers[g1] === correctAnswers[g1] ? '#27ae60' : '#e74c3c') : undefined,
                  borderWidth: submitted ? 2 : 1,
                },
              }}
            >
              <MenuItem value=""><em>Choose...</em></MenuItem>
              {WORD_BANK.map((w) => <MenuItem key={w} value={w}>{w}</MenuItem>)}
            </Select>
          </FormControl>
          <Typography variant="body1">{parts[1]}</Typography>
          <FormControl size="small">
            <Select
              value={answers[g2]}
              onChange={(e) => setAnswers({ ...answers, [g2]: e.target.value })}
              disabled={submitted}
              displayEmpty
              sx={{
                minWidth: 160,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: submitted ? (answers[g2] === correctAnswers[g2] ? '#27ae60' : '#e74c3c') : undefined,
                  borderWidth: submitted ? 2 : 1,
                },
              }}
            >
              <MenuItem value=""><em>Choose...</em></MenuItem>
              {WORD_BANK.map((w) => <MenuItem key={w} value={w}>{w}</MenuItem>)}
            </Select>
          </FormControl>
          <Typography variant="body1">{parts[2]}</Typography>
        </Box>
        {submitted && (answers[g1] !== correctAnswers[g1] || answers[g2] !== correctAnswers[g2]) && (
          <Typography variant="body2" color="error.main" sx={{ mt: 1 }}>
            Correct: <strong>{correctAnswers[g1]}</strong> ... <strong>{correctAnswers[g2]}</strong>
          </Typography>
        )}
      </Paper>
    )
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">Step 4: Remedial C1 — Task A</Typography>
        <Typography variant="body1">Debate Simulation — Defending Positive Sandwich Feedback Writing</Typography>
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        A critic challenges your approach to peer feedback. Complete your responses by selecting the correct academic term from the word bank.
      </Alert>

      <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2, backgroundColor: '#faf5ff' }}>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, color: '#6c3483' }}>Word Bank</Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
          {WORD_BANK.map((w) => (
            <Chip key={w} label={w} sx={{ backgroundColor: '#8e44ad', color: 'white', fontWeight: 'bold' }} />
          ))}
        </Stack>
      </Paper>

      {DIALOGUE.map((line, idx) => {
        if (!line.hasGap) {
          const colors = SPEAKER_COLORS[line.role]
          return (
            <Paper key={idx} elevation={1} sx={{ p: 2, mb: 2, borderRadius: 2, borderLeft: `4px solid ${colors.border}`, backgroundColor: colors.bg }}>
              <Typography variant="caption" fontWeight="bold" sx={{ color: colors.label, textTransform: 'uppercase', letterSpacing: 1 }}>
                {line.speaker}
              </Typography>
              <Typography variant="body1" sx={{ mt: 0.5 }}>{line.text}</Typography>
            </Paper>
          )
        }
        return renderTwoGapLine(line, idx)
      })}

      {!submitted ? (
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!allFilled}
          fullWidth
          size="large"
          sx={{ background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}
        >
          Submit Debate Responses
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" gutterBottom>Task A Complete! Score: {score}/4</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {score === 4 ? 'Outstanding! You can defend positive sandwich feedback with precise C1 vocabulary.' : score >= 3 ? 'Well done! Review the highlighted gaps to consolidate your understanding.' : 'Study the C1 terms carefully — these are key for sophisticated academic debate.'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/2/step/4/remedial/c1/task/b')}
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
