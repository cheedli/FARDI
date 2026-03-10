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
 * Phase 6 SubPhase 1 Step 2 - Level B1 - Task A
 * Negotiation Gap Fill: Fill gaps in dialogue planning a report summary
 */

const WORD_BANK = ['success', 'challenge', 'feedback', 'recommend', 'summary', 'improve']

// Dialogue with gaps - gaps identified by blank arrays
const DIALOGUE = [
  {
    speaker: 'SKANDER',
    text: 'What write first?',
    isGap: false
  },
  {
    speaker: 'You',
    textBefore: 'Write about',
    gap: 0,
    correct: 'success',
    textAfter: 'first.',
    isGap: true
  },
  {
    speaker: 'Emna',
    text: 'Then?',
    isGap: false
  },
  {
    speaker: 'You',
    textBefore: 'Then write',
    gap: 1,
    correct: 'challenge',
    textMiddle: 'and',
    gap2: 2,
    correct2: 'recommend',
    textAfter: '.',
    isGap: true,
    hasTwoGaps: true
  }
]

export default function Phase6SP1Step2RemedialB1TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 2, interaction: 1, context: 'remedial_b1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    let correct = 0
    if (answers[0] === 'success') correct++
    if (answers[1] === 'challenge') correct++
    if (answers[2] === 'recommend') correct++
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step2_remedial_b1_taska_score', correct.toString())
    try {
      await phase6API.logRemedialActivity(2, 'B1', 'A', correct, 3, 0, 1)
    } catch (e) {
      console.error('Failed to log task:', e)
    }
  }

  const allAnswered = answers[0] && answers[1] && answers[2]

  const getSelectColor = (gapIdx, correctAnswer) => {
    if (!submitted) return {}
    return answers[gapIdx] === correctAnswer
      ? { borderColor: '#27ae60', backgroundColor: '#f0faf4' }
      : { borderColor: '#f44336', backgroundColor: '#fff5f5' }
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)',
          color: 'white',
          borderRadius: 2
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection &amp; Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 2: Remedial Practice - Level B1</Typography>
        <Typography variant="h6">Task A: Negotiation Gap Fill</Typography>
        <Typography variant="body1">Fill gaps in a dialogue planning a report summary</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Read the dialogue between students planning their report. Fill in the missing words to complete the conversation correctly."
        />
      </Paper>

      {/* Word Bank */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2, backgroundColor: '#f0faf4' }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: '#27ae60' }}>
          Word Bank:
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
          {WORD_BANK.map(w => (
            <Paper key={w} elevation={1} sx={{ px: 2, py: 0.5, backgroundColor: '#27ae60', color: 'white', borderRadius: 1 }}>
              <Typography variant="body2" fontWeight="bold">{w}</Typography>
            </Paper>
          ))}
        </Stack>
      </Paper>

      {/* Dialogue */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: '#27ae60' }}>
          Dialogue:
        </Typography>
        <Stack spacing={2}>
          {/* Line 1: SKANDER */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Box sx={{
              width: 50, height: 50, borderRadius: '50%',
              backgroundColor: '#8e44ad', display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <Typography variant="body2" color="white" fontWeight="bold">SK</Typography>
            </Box>
            <Paper elevation={1} sx={{ p: 2, flex: 1, borderRadius: 2, backgroundColor: '#f3e5f5' }}>
              <Typography variant="caption" color="text.secondary">SKANDER</Typography>
              <Typography variant="body1">What write first?</Typography>
            </Paper>
          </Box>

          {/* Line 2: You - gap 0 */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexDirection: 'row-reverse' }}>
            <Box sx={{
              width: 50, height: 50, borderRadius: '50%',
              backgroundColor: '#27ae60', display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <Typography variant="body2" color="white" fontWeight="bold">You</Typography>
            </Box>
            <Paper elevation={1} sx={{ p: 2, flex: 1, borderRadius: 2, backgroundColor: '#f0faf4', ...getSelectColor(0, 'success') }}>
              <Typography variant="caption" color="text.secondary">You</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                <Typography variant="body1">Write about</Typography>
                <FormControl size="small" sx={{ minWidth: 130 }}>
                  <Select
                    value={answers[0] || ''}
                    onChange={(e) => setAnswers({ ...answers, 0: e.target.value })}
                    disabled={submitted}
                    displayEmpty
                    sx={{ backgroundColor: 'white' }}
                  >
                    <MenuItem value=""><em>choose...</em></MenuItem>
                    {WORD_BANK.map(w => <MenuItem key={w} value={w}>{w}</MenuItem>)}
                  </Select>
                </FormControl>
                <Typography variant="body1">first.</Typography>
              </Box>
              {submitted && answers[0] !== 'success' && (
                <Typography variant="body2" color="error" sx={{ mt: 0.5 }}>Correct: success</Typography>
              )}
            </Paper>
          </Box>

          {/* Line 3: Emna */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Box sx={{
              width: 50, height: 50, borderRadius: '50%',
              backgroundColor: '#e67e22', display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <Typography variant="body2" color="white" fontWeight="bold">EM</Typography>
            </Box>
            <Paper elevation={1} sx={{ p: 2, flex: 1, borderRadius: 2, backgroundColor: '#fef9e7' }}>
              <Typography variant="caption" color="text.secondary">Emna</Typography>
              <Typography variant="body1">Then?</Typography>
            </Paper>
          </Box>

          {/* Line 4: You - gap 1 and gap 2 */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexDirection: 'row-reverse' }}>
            <Box sx={{
              width: 50, height: 50, borderRadius: '50%',
              backgroundColor: '#27ae60', display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <Typography variant="body2" color="white" fontWeight="bold">You</Typography>
            </Box>
            <Paper elevation={1} sx={{ p: 2, flex: 1, borderRadius: 2, backgroundColor: '#f0faf4' }}>
              <Typography variant="caption" color="text.secondary">You</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                <Typography variant="body1">Then write</Typography>
                <FormControl size="small" sx={{ minWidth: 130 }}>
                  <Select
                    value={answers[1] || ''}
                    onChange={(e) => setAnswers({ ...answers, 1: e.target.value })}
                    disabled={submitted}
                    displayEmpty
                    sx={{ backgroundColor: 'white' }}
                  >
                    <MenuItem value=""><em>choose...</em></MenuItem>
                    {WORD_BANK.map(w => <MenuItem key={w} value={w}>{w}</MenuItem>)}
                  </Select>
                </FormControl>
                <Typography variant="body1">and</Typography>
                <FormControl size="small" sx={{ minWidth: 130 }}>
                  <Select
                    value={answers[2] || ''}
                    onChange={(e) => setAnswers({ ...answers, 2: e.target.value })}
                    disabled={submitted}
                    displayEmpty
                    sx={{ backgroundColor: 'white' }}
                  >
                    <MenuItem value=""><em>choose...</em></MenuItem>
                    {WORD_BANK.map(w => <MenuItem key={w} value={w}>{w}</MenuItem>)}
                  </Select>
                </FormControl>
                <Typography variant="body1">.</Typography>
              </Box>
              {submitted && (answers[1] !== 'challenge' || answers[2] !== 'recommend') && (
                <Typography variant="body2" color="error" sx={{ mt: 0.5 }}>
                  Correct: challenge and recommend
                </Typography>
              )}
            </Paper>
          </Box>
        </Stack>
      </Paper>

      {!submitted ? (
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!allAnswered}
          fullWidth
          size="large"
          sx={{ backgroundColor: '#27ae60', '&:hover': { backgroundColor: '#1e8449' } }}
        >
          Check My Answers
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#f0faf4', border: '2px solid #27ae60', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" gutterBottom>
            Task A Complete! Score: {score}/3
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {score === 3 ? 'Perfect! Excellent sequencing!' : 'Good effort! Review the correct terms and continue.'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/1/step/2/remedial/b1/task/b')}
            size="large"
            sx={{ backgroundColor: '#27ae60', '&:hover': { backgroundColor: '#1e8449' } }}
          >
            Next: Task B →
          </Button>
        </Paper>
      )}
    </Box>
  )
}
