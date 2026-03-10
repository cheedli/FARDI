import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Paper, Typography, Button, Select, MenuItem, FormControl,
  Alert, Chip, Stack
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 4 — Level C1 — Task A
 * Debate Simulation: defend report-writing decisions using C1-level vocabulary
 */

const WORD_BANK = ['objectivity', 'credibility', 'stakeholder', 'evidence-based', 'nuanced', 'accountability']

// correct: ans1=evidence-based, ans2=credibility, ans3=stakeholder, ans4=accountability
export default function Phase6SP1Step4RemC1TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 4, interaction: 1, context: 'remedial_c1' })
  const [ans1, setAns1] = useState('')
  const [ans2, setAns2] = useState('')
  const [ans3, setAns3] = useState('')
  const [ans4, setAns4] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    let correct = 0
    if (ans1 === 'evidence-based') correct++
    if (ans2 === 'credibility') correct++
    if (ans3 === 'stakeholder') correct++
    if (ans4 === 'accountability') correct++
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step4_remedial_c1_taska_score', correct.toString())
    try { await phase6API.logRemedialActivity(4, 'C1', 'A', correct, 4, 0, 1) } catch (e) { console.error(e) }
  }

  const allFilled = ans1 && ans2 && ans3 && ans4

  const gap = (value, setter, options) => (
    <FormControl size="small" sx={{ minWidth: 160, mx: 0.5 }}>
      <Select value={value} onChange={(e) => setter(e.target.value)} disabled={submitted} displayEmpty>
        <MenuItem value=""><em>choose...</em></MenuItem>
        {options.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
      </Select>
    </FormControl>
  )

  const exchangeBg = (correct) => submitted
    ? correct ? 'success.main' : 'error.main'
    : undefined

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', color: 'white', borderRadius: 2 }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection &amp; Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 4: Remedial Practice — Level C1</Typography>
        <Typography variant="h6">Task A: Debate Simulation</Typography>
        <Typography variant="body1">Defend your report-writing decisions using sophisticated vocabulary</Typography>
      </Paper>

      {/* Word Bank */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: '#f0faf4', borderRadius: 2 }}>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>Word Bank:</Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {WORD_BANK.map(w => (
            <Chip key={w} label={w} sx={{ backgroundColor: '#27ae60', color: 'white', fontWeight: 'bold', mb: 1 }} />
          ))}
        </Stack>
      </Paper>

      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        A critic is questioning your report choices. Complete your responses using the correct C1-level word from the word bank.
      </Alert>

      {/* Exchange 1 */}
      <Paper elevation={1} sx={{ p: 3, mb: 2, borderRadius: 2, borderLeft: '4px solid #c0392b' }}>
        <Chip label="Critic" size="small" sx={{ backgroundColor: '#c0392b', color: 'white', mb: 1 }} />
        <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
          "Your Successes section sounds too positive. Why should readers trust it?"
        </Typography>
      </Paper>
      <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2, borderLeft: '4px solid #27ae60', border: submitted ? '2px solid' : undefined, borderColor: exchangeBg(ans1 === 'evidence-based' && ans2 === 'credibility') }}>
        <Chip label="You" size="small" sx={{ backgroundColor: '#27ae60', color: 'white', mb: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
          <Typography variant="body1">The section is</Typography>
          {gap(ans1, setAns1, ['nuanced', 'evidence-based', 'objectivity'])}
          <Typography variant="body1">, drawing on survey data and attendance figures to ensure</Typography>
          {gap(ans2, setAns2, ['stakeholder', 'credibility', 'accountability'])}
          <Typography variant="body1">.</Typography>
        </Box>
        {submitted && (ans1 !== 'evidence-based' || ans2 !== 'credibility') && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            Correct: <strong>evidence-based</strong> ... <strong>credibility</strong>
          </Typography>
        )}
      </Paper>

      {/* Exchange 2 */}
      <Paper elevation={1} sx={{ p: 3, mb: 2, borderRadius: 2, borderLeft: '4px solid #c0392b' }}>
        <Chip label="Critic" size="small" sx={{ backgroundColor: '#c0392b', color: 'white', mb: 1 }} />
        <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
          "Who is this report actually for, and why does that matter for how you write it?"
        </Typography>
      </Paper>
      <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2, borderLeft: '4px solid #27ae60', border: submitted ? '2px solid' : undefined, borderColor: exchangeBg(ans3 === 'stakeholder' && ans4 === 'accountability') }}>
        <Chip label="You" size="small" sx={{ backgroundColor: '#27ae60', color: 'white', mb: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
          <Typography variant="body1">This is a</Typography>
          {gap(ans3, setAns3, ['stakeholder', 'nuanced', 'objectivity'])}
          <Typography variant="body1">report, so the language must promote transparency and</Typography>
          {gap(ans4, setAns4, ['credibility', 'accountability', 'evidence-based'])}
          <Typography variant="body1">by clearly linking outcomes to stated objectives.</Typography>
        </Box>
        {submitted && (ans3 !== 'stakeholder' || ans4 !== 'accountability') && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            Correct: <strong>stakeholder</strong> ... <strong>accountability</strong>
          </Typography>
        )}
      </Paper>

      {!submitted ? (
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!allFilled}
          fullWidth
          size="large"
          sx={{ backgroundColor: '#27ae60', '&:hover': { backgroundColor: '#1e8449' } }}
        >
          Submit
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#f0faf4', border: '2px solid #27ae60', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" gutterBottom>
            Task A Complete! Score: {score}/4
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {score === 4 ? 'Perfect! You can defend report choices with C1-level precision.' : 'Good effort! Review the correct answers above.'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/1/step/4/remedial/c1/task/b')}
            size="large"
            sx={{ backgroundColor: '#27ae60', '&:hover': { backgroundColor: '#1e8449' } }}
          >
            Continue to Task B →
          </Button>
        </Paper>
      )}
    </Box>
  )
}
