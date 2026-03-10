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
 * Phase 6 SubPhase 1 Step 4 — Level B1 — Task A
 * Negotiation Gap Fill: Complete a dialogue with correct report vocabulary
 */

// BLANK1: correct = success
const BLANK1_OPTIONS = ['success', 'failure', 'problem']
// BLANK2: correct = challenge
const BLANK2_OPTIONS = ['challenge', 'nothing', 'fun']
// BLANK3: correct = recommend
const BLANK3_OPTIONS = ['recommend', 'ignore', 'delete']

export default function Phase6SP1Step4RemB1TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 4, interaction: 1, context: 'remedial_b1' })
  const [blank1, setBlank1] = useState('')
  const [blank2, setBlank2] = useState('')
  const [blank3, setBlank3] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    let correct = 0
    if (blank1 === 'success') correct++
    if (blank2 === 'challenge') correct++
    if (blank3 === 'recommend') correct++
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step4_remedial_b1_taska_score', correct.toString())
    try { await phase6API.logRemedialActivity(4, 'B1', 'A', correct, 3, 0, 1) } catch (e) { console.error(e) }
  }

  const allFilled = blank1 && blank2 && blank3

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
      {/* Header */}
      <Paper
        elevation={0}
        sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection &amp; Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 4: Remedial Practice — Level B1</Typography>
        <Typography variant="h6">Task A: Negotiation Gap Fill</Typography>
        <Typography variant="body1">Complete the dialogue with the correct report vocabulary</Typography>
      </Paper>

      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        Choose the correct word for each blank to complete the negotiation dialogue.
      </Alert>

      <Stack spacing={2} sx={{ mb: 3 }}>
        {/* Line 1: SKANDER */}
        <Paper elevation={1} sx={{ p: 2.5, borderRadius: 2, borderLeft: '4px solid #e74c3c' }}>
          <Chip label="SKANDER" size="small" sx={{ backgroundColor: '#e74c3c', color: 'white', mb: 1, fontWeight: 'bold' }} />
          <Typography variant="body1" sx={{ fontStyle: 'italic', fontSize: '1.05rem' }}>
            "What write first?"
          </Typography>
        </Paper>

        {/* Line 2: You — BLANK1 */}
        <Paper
          elevation={1}
          sx={{
            p: 2.5, borderRadius: 2, borderLeft: '4px solid #8e44ad',
            border: submitted ? '2px solid' : undefined,
            borderColor: submitted ? (blank1 === 'success' ? 'success.main' : 'error.main') : undefined
          }}
        >
          <Chip label="You" size="small" sx={{ backgroundColor: '#8e44ad', color: 'white', mb: 1, fontWeight: 'bold' }} />
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
            <Typography variant="body1">Write about</Typography>
            {gap(blank1, setBlank1, BLANK1_OPTIONS, 'success')}
            <Typography variant="body1">first.</Typography>
          </Box>
          {submitted && blank1 !== 'success' && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              Correct: <strong>success</strong>
            </Typography>
          )}
        </Paper>

        {/* Line 3: Emna */}
        <Paper elevation={1} sx={{ p: 2.5, borderRadius: 2, borderLeft: '4px solid #e67e22' }}>
          <Chip label="Emna" size="small" sx={{ backgroundColor: '#e67e22', color: 'white', mb: 1, fontWeight: 'bold' }} />
          <Typography variant="body1" sx={{ fontStyle: 'italic', fontSize: '1.05rem' }}>
            "Then?"
          </Typography>
        </Paper>

        {/* Line 4: You — BLANK2 + BLANK3 */}
        <Paper
          elevation={1}
          sx={{
            p: 2.5, borderRadius: 2, borderLeft: '4px solid #8e44ad',
            border: submitted ? '2px solid' : undefined,
            borderColor: submitted
              ? (blank2 === 'challenge' && blank3 === 'recommend' ? 'success.main' : 'error.main')
              : undefined
          }}
        >
          <Chip label="You" size="small" sx={{ backgroundColor: '#8e44ad', color: 'white', mb: 1, fontWeight: 'bold' }} />
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
            <Typography variant="body1">Then write</Typography>
            {gap(blank2, setBlank2, BLANK2_OPTIONS, 'challenge')}
            <Typography variant="body1">and</Typography>
            {gap(blank3, setBlank3, BLANK3_OPTIONS, 'recommend')}
            <Typography variant="body1">.</Typography>
          </Box>
          {submitted && (blank2 !== 'challenge' || blank3 !== 'recommend') && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              Correct: <strong>challenge</strong> and <strong>recommend</strong>
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
            Task A Complete! Score: {score}/3
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, color: '#555' }}>
            {score === 3 ? 'Perfect! You know what to include in a report.' : 'Good effort! Review the correct answers above.'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/1/step/4/remedial/b1/task/b')}
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
