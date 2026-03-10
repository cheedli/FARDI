import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Select,
  MenuItem,
  FormControl,
  Alert
} from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 3 - Level B1 - Task A
 * Negotiation Gap Fill: Fill gaps explaining report terms
 * Line 1 (Lilia): What is success?
 * Line 2 (You): Success is [good] [result].
 * Line 3 (Ryan): Why feedback?
 * Line 4 (You): [Feedback] helps us [improve].
 */

const WORD_BANK = ['good', 'result', 'Feedback', 'improve', 'challenge', 'balance']

const CORRECT_ANSWERS = {
  0: 'good',
  1: 'result',
  2: 'Feedback',
  3: 'improve'
}

export default function Phase6SP1Step3RemedialB1TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 3, interaction: 1, context: 'remedial_b1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    let correct = 0
    Object.entries(CORRECT_ANSWERS).forEach(([key, val]) => {
      if (answers[parseInt(key)] === val) correct++
    })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step3_remedial_b1_taska_score', correct.toString())
    try {
      await phase6API.logRemedialActivity(3, 'B1', 'A', correct, Object.keys(CORRECT_ANSWERS).length, 0, 1)
    } catch (e) {
      console.error('Failed to log task:', e)
    }
  }

  const allAnswered = Object.keys(CORRECT_ANSWERS).every(k => answers[parseInt(k)])

  const GapSelect = ({ gapIdx }) => {
    const correct = CORRECT_ANSWERS[gapIdx]
    const isCorrect = submitted && answers[gapIdx] === correct
    return (
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <Select
          value={answers[gapIdx] || ''}
          onChange={(e) => !submitted && setAnswers({ ...answers, [gapIdx]: e.target.value })}
          disabled={submitted}
          displayEmpty
          sx={{ backgroundColor: submitted ? (isCorrect ? '#f0faf4' : '#fff5f5') : 'white' }}
        >
          <MenuItem value=""><em>choose...</em></MenuItem>
          {WORD_BANK.map(w => <MenuItem key={w} value={w}>{w}</MenuItem>)}
        </Select>
      </FormControl>
    )
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection &amp; Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 3: Remedial Practice - Level B1</Typography>
        <Typography variant="h6">Task A: Negotiation Gap Fill</Typography>
        <Typography variant="body1">Fill gaps in a dialogue explaining report terms</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Read the dialogue. Fill in the missing words to explain report terms correctly." />
      </Paper>

      <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2, backgroundColor: '#f0faf4' }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: '#27ae60' }}>Word Bank:</Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
          {WORD_BANK.map(w => (
            <Paper key={w} elevation={1} sx={{ px: 2, py: 0.5, backgroundColor: '#27ae60', color: 'white', borderRadius: 1 }}>
              <Typography variant="body2" fontWeight="bold">{w}</Typography>
            </Paper>
          ))}
        </Stack>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Stack spacing={2}>
          {/* Lilia */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Box sx={{ width: 50, height: 50, borderRadius: '50%', backgroundColor: '#e67e22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Typography variant="body2" color="white" fontWeight="bold">LI</Typography>
            </Box>
            <Paper elevation={1} sx={{ p: 2, flex: 1, borderRadius: 2, backgroundColor: '#fef9e7' }}>
              <Typography variant="caption" color="text.secondary">Lilia</Typography>
              <Typography variant="body1" sx={{ mt: 0.5 }}>What is success?</Typography>
            </Paper>
          </Box>

          {/* You - gaps 0, 1 */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexDirection: 'row-reverse' }}>
            <Box sx={{ width: 50, height: 50, borderRadius: '50%', backgroundColor: '#27ae60', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Typography variant="body2" color="white" fontWeight="bold">You</Typography>
            </Box>
            <Paper elevation={1} sx={{ p: 2, flex: 1, borderRadius: 2, backgroundColor: '#f0faf4' }}>
              <Typography variant="caption" color="text.secondary">You</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                <Typography variant="body1">Success is</Typography>
                <GapSelect gapIdx={0} />
                <GapSelect gapIdx={1} />
                <Typography variant="body1">.</Typography>
              </Box>
              {submitted && (answers[0] !== 'good' || answers[1] !== 'result') && (
                <Typography variant="body2" color="error" sx={{ mt: 0.5 }}>Correct: "Success is good result."</Typography>
              )}
            </Paper>
          </Box>

          {/* Ryan */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Box sx={{ width: 50, height: 50, borderRadius: '50%', backgroundColor: '#2980b9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Typography variant="body2" color="white" fontWeight="bold">RY</Typography>
            </Box>
            <Paper elevation={1} sx={{ p: 2, flex: 1, borderRadius: 2, backgroundColor: '#ebf5fb' }}>
              <Typography variant="caption" color="text.secondary">Ryan</Typography>
              <Typography variant="body1" sx={{ mt: 0.5 }}>Why feedback?</Typography>
            </Paper>
          </Box>

          {/* You - gaps 2, 3 */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexDirection: 'row-reverse' }}>
            <Box sx={{ width: 50, height: 50, borderRadius: '50%', backgroundColor: '#27ae60', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Typography variant="body2" color="white" fontWeight="bold">You</Typography>
            </Box>
            <Paper elevation={1} sx={{ p: 2, flex: 1, borderRadius: 2, backgroundColor: '#f0faf4' }}>
              <Typography variant="caption" color="text.secondary">You</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                <GapSelect gapIdx={2} />
                <Typography variant="body1">helps us</Typography>
                <GapSelect gapIdx={3} />
                <Typography variant="body1">.</Typography>
              </Box>
              {submitted && (answers[2] !== 'Feedback' || answers[3] !== 'improve') && (
                <Typography variant="body2" color="error" sx={{ mt: 0.5 }}>Correct: "Feedback helps us improve."</Typography>
              )}
            </Paper>
          </Box>
        </Stack>
      </Paper>

      {!submitted ? (
        <Button variant="contained" onClick={handleSubmit} disabled={!allAnswered} fullWidth size="large"
          sx={{ backgroundColor: '#27ae60', '&:hover': { backgroundColor: '#1e8449' } }}>
          Check My Answers
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#f0faf4', border: '2px solid #27ae60', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" gutterBottom>Task A Complete! Score: {score}/4</Typography>
          <Button variant="contained" onClick={() => navigate('/phase6/subphase/1/step/3/remedial/b1/task/b')} size="large"
            sx={{ mt: 2, backgroundColor: '#27ae60', '&:hover': { backgroundColor: '#1e8449' } }}>
            Next: Task B →
          </Button>
        </Paper>
      )}
    </Box>
  )
}
