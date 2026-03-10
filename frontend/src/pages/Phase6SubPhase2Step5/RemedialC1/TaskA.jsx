import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Paper, Typography, Button, Alert,
  FormControl, InputLabel, Select, MenuItem, Chip, Stack
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const WORD_BANK = ['credibility', 'accountability', 'nuanced', 'objectivity', 'evidence-based', 'growth mindset']

const GAPS = [
  { id: 'ans1', answer: 'credibility' },
  { id: 'ans2', answer: 'objectivity' },
  { id: 'ans3', answer: 'nuanced' },
  { id: 'ans4', answer: 'accountability' },
]

export default function Phase6SP2Step5RemC1TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 5, interaction: 1, context: 'remedial_c1' })
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
    sessionStorage.setItem('phase6_sp2_step5_remedial_c1_taska_score', correct.toString())
    try { await phase6API.logRemedialActivity(5, 'C1', 'A', correct, 4, 0, 2) } catch (e) { console.error(e) }
  }

  const GapSelect = ({ id, label }) => {
    const gap = GAPS.find(g => g.id === id)
    return (
      <FormControl size="small" sx={{ minWidth: 160, display: 'inline-flex', verticalAlign: 'middle', mx: 0.5 }}>
        <InputLabel>{label}</InputLabel>
        <Select
          value={selections[id]}
          label={label}
          onChange={e => handleChange(id, e.target.value)}
          disabled={submitted}
          sx={{
            bgcolor: submitted
              ? (selections[id].toLowerCase() === gap.answer ? '#e8f5e9' : '#fdecea')
              : 'white'
          }}
        >
          {WORD_BANK.map(w => (
            <MenuItem key={w} value={w}>{w}</MenuItem>
          ))}
        </Select>
      </FormControl>
    )
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">Step 5: Remedial C1 — Task A</Typography>
        <Typography variant="body1">Debate Simulation — Peer Feedback Revision at C1 Level (Gap Fill)</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Word Bank</Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3 }}>
          {WORD_BANK.map(w => (
            <Chip
              key={w}
              label={w}
              variant="outlined"
              sx={{ borderColor: '#8e44ad', color: '#8e44ad', fontWeight: 'bold', mb: 1 }}
            />
          ))}
        </Stack>

        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Complete the debate dialogue by selecting the correct C1-level term for each gap.
        </Typography>

        <Box sx={{ p: 2, bgcolor: '#f9f4fc', borderRadius: 2, border: '1px solid #d7bde2' }}>
          {/* Turn 1 */}
          <Box sx={{ mb: 2, p: 1.5, bgcolor: '#ede7f6', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>Critic:</Typography>
            <Typography variant="body1">"Does it really matter if there are a few spelling errors in peer feedback?"</Typography>
          </Box>

          {/* Turn 2 */}
          <Box sx={{ mb: 2, p: 1.5, bgcolor: '#f3e5f5', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>You:</Typography>
            <Typography variant="body1" component="span">
              "Absolutely — errors undermine the&nbsp;
              <GapSelect id="ans1" label="Gap 1" />
              &nbsp;of your critique and signal a lack of care for the writer's work."
            </Typography>
          </Box>

          {/* Turn 3 */}
          <Box sx={{ mb: 2, p: 1.5, bgcolor: '#ede7f6', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>Critic:</Typography>
            <Typography variant="body1">"And why does tone matter so much in feedback?"</Typography>
          </Box>

          {/* Turn 4 */}
          <Box sx={{ p: 1.5, bgcolor: '#f3e5f5', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>You:</Typography>
            <Typography variant="body1" component="span">
              "Because feedback must maintain&nbsp;
              <GapSelect id="ans2" label="Gap 2" />
              &nbsp;while being&nbsp;
              <GapSelect id="ans3" label="Gap 3" />
              &nbsp;enough to promote growth rather than discouragement — that requires&nbsp;
              <GapSelect id="ans4" label="Gap 4" />
              &nbsp;for how your words affect others."
            </Typography>
          </Box>
        </Box>
      </Paper>

      {submitted && (
        <Alert
          severity={score === 4 ? 'success' : score >= 3 ? 'warning' : 'error'}
          sx={{ mb: 2 }}
        >
          {score === 4
            ? 'Perfect! All 4 gaps correct. You demonstrate strong C1-level conceptual vocabulary.'
            : `You got ${score}/4 correct. Remember the key terms: credibility → objectivity → nuanced → accountability.`}
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
              ? 'Excellent — your command of C1 peer feedback vocabulary is strong!'
              : 'Good effort! Focus on these key concepts: credibility, objectivity, nuanced, accountability.'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/2/step/5/remedial/c1/task/b')}
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
