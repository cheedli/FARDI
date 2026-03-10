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
 * Phase 6 SubPhase 1 Step 4 — Level B2 — Task A
 * Role-Play Dialogue Gap Fill:
 * Word bank: success, challenge, feedback, improve, recommend, evidence
 *
 * Line 1 (Ms. Mabrouki): "Why balance?"
 * Line 2 (You): "Show [BLANK1] and [BLANK2] [BLANK3] honest."
 *   BLANK1: success/failure/nothing  → correct: success
 *   BLANK2: challenge/easy/good      → correct: challenge
 *   BLANK3: because/and/but          → correct: because
 * Line 3 (Lilia): "Evidence?"
 * Line 4 (You): "Use [BLANK4] like numbers and [BLANK5]."
 *   BLANK4: evidence/opinion/guess   → correct: evidence
 *   BLANK5: feedback/silence/errors  → correct: feedback
 */

const WORD_BANK = ['success', 'challenge', 'feedback', 'improve', 'recommend', 'evidence']

const BLANK1_OPTIONS = ['success', 'failure', 'nothing']
const BLANK2_OPTIONS = ['challenge', 'easy', 'good']
const BLANK3_OPTIONS = ['because', 'and', 'but']
const BLANK4_OPTIONS = ['evidence', 'opinion', 'guess']
const BLANK5_OPTIONS = ['feedback', 'silence', 'errors']

export default function Phase6SP1Step4RemB2TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 4, interaction: 1, context: 'remedial_b2' })
  const [blank1, setBlank1] = useState('')
  const [blank2, setBlank2] = useState('')
  const [blank3, setBlank3] = useState('')
  const [blank4, setBlank4] = useState('')
  const [blank5, setBlank5] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    let correct = 0
    if (blank1 === 'success') correct++
    if (blank2 === 'challenge') correct++
    if (blank3 === 'because') correct++
    if (blank4 === 'evidence') correct++
    if (blank5 === 'feedback') correct++
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step4_remedial_b2_taska_score', correct.toString())
    try { await phase6API.logRemedialActivity(4, 'B2', 'A', correct, 5, 0, 1) } catch (e) { console.error(e) }
  }

  const allFilled = blank1 && blank2 && blank3 && blank4 && blank5

  const gap = (value, setter, options, correct) => (
    <FormControl size="small" sx={{ minWidth: 120, mx: 0.5 }}>
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

  const line2Correct = blank1 === 'success' && blank2 === 'challenge' && blank3 === 'because'
  const line4Correct = blank4 === 'evidence' && blank5 === 'feedback'

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection &amp; Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 4: Remedial Practice — Level B2</Typography>
        <Typography variant="h6">Task A: Role-Play Dialogue Gap Fill</Typography>
        <Typography variant="body1">Complete the dialogue using the word bank</Typography>
      </Paper>

      {/* Word Bank */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: '#f3e5f5', borderRadius: 2, border: '1px solid #ce93d8' }}>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, color: '#6c3483' }}>Word Bank:</Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {WORD_BANK.map(w => (
            <Chip
              key={w}
              label={w}
              sx={{ backgroundColor: '#8e44ad', color: 'white', fontWeight: 'bold', mb: 1 }}
            />
          ))}
        </Stack>
      </Paper>

      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        Complete the role-play dialogue by choosing the correct word for each gap.
      </Alert>

      <Stack spacing={2} sx={{ mb: 3 }}>
        {/* Line 1: Ms. Mabrouki */}
        <Paper elevation={1} sx={{ p: 2.5, borderRadius: 2, borderLeft: '4px solid #e74c3c' }}>
          <Chip label="Ms. Mabrouki" size="small" sx={{ backgroundColor: '#e74c3c', color: 'white', mb: 1, fontWeight: 'bold' }} />
          <Typography variant="body1" sx={{ fontStyle: 'italic', fontSize: '1.05rem' }}>
            "Why balance?"
          </Typography>
        </Paper>

        {/* Line 2: You — BLANK1, BLANK2, BLANK3 */}
        <Paper
          elevation={1}
          sx={{
            p: 2.5,
            borderRadius: 2,
            borderLeft: '4px solid #8e44ad',
            border: submitted ? '2px solid' : undefined,
            borderColor: submitted ? (line2Correct ? 'success.main' : 'error.main') : undefined
          }}
        >
          <Chip label="You" size="small" sx={{ backgroundColor: '#8e44ad', color: 'white', mb: 1, fontWeight: 'bold' }} />
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
            <Typography variant="body1">Show</Typography>
            {gap(blank1, setBlank1, BLANK1_OPTIONS, 'success')}
            <Typography variant="body1">and</Typography>
            {gap(blank2, setBlank2, BLANK2_OPTIONS, 'challenge')}
            {gap(blank3, setBlank3, BLANK3_OPTIONS, 'because')}
            <Typography variant="body1">honest.</Typography>
          </Box>
          {submitted && !line2Correct && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              Correct: Show <strong>success</strong> and <strong>challenge</strong> <strong>because</strong> honest.
            </Typography>
          )}
        </Paper>

        {/* Line 3: Lilia */}
        <Paper elevation={1} sx={{ p: 2.5, borderRadius: 2, borderLeft: '4px solid #e67e22' }}>
          <Chip label="Lilia" size="small" sx={{ backgroundColor: '#e67e22', color: 'white', mb: 1, fontWeight: 'bold' }} />
          <Typography variant="body1" sx={{ fontStyle: 'italic', fontSize: '1.05rem' }}>
            "Evidence?"
          </Typography>
        </Paper>

        {/* Line 4: You — BLANK4, BLANK5 */}
        <Paper
          elevation={1}
          sx={{
            p: 2.5,
            borderRadius: 2,
            borderLeft: '4px solid #8e44ad',
            border: submitted ? '2px solid' : undefined,
            borderColor: submitted ? (line4Correct ? 'success.main' : 'error.main') : undefined
          }}
        >
          <Chip label="You" size="small" sx={{ backgroundColor: '#8e44ad', color: 'white', mb: 1, fontWeight: 'bold' }} />
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
            <Typography variant="body1">Use</Typography>
            {gap(blank4, setBlank4, BLANK4_OPTIONS, 'evidence')}
            <Typography variant="body1">like numbers and</Typography>
            {gap(blank5, setBlank5, BLANK5_OPTIONS, 'feedback')}
            <Typography variant="body1">.</Typography>
          </Box>
          {submitted && !line4Correct && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              Correct: Use <strong>evidence</strong> like numbers and <strong>feedback</strong>.
            </Typography>
          )}
        </Paper>
      </Stack>

      {!submitted ? (
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!allFilled}
          fullWidth
          size="large"
          sx={{ background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}
        >
          Submit
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', backgroundColor: '#f3e5f5', border: '2px solid #8e44ad', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 60, color: '#8e44ad', mb: 1 }} />
          <Typography variant="h5" sx={{ color: '#6c3483' }} gutterBottom>
            Task A Complete! Score: {score}/5
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, color: '#555' }}>
            {score === 5 ? 'Perfect! You understand how to balance a report.' : 'Review the correct answers above and keep practicing.'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/1/step/4/remedial/b2/task/b')}
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
