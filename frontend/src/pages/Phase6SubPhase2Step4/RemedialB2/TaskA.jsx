import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  Alert,
  Chip,
  Stack,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

// Spec word bank
const WORD_BANK = ['positive', 'strength', 'weakness', 'suggestion', 'improve', 'specific']

// Correct answers
// BLANK1: positive
// BLANK2: weakness
// BLANK3: specific
// BLANK4: suggestion
const CORRECT = {
  blank1: 'positive',
  blank2: 'weakness',
  blank3: 'specific',
  blank4: 'suggestion',
}

const SPEAKER_COLORS = {
  peer: { bg: '#e8eaf6', border: '#5c6bc0', label: '#3949ab' },
  student: { bg: '#e8f5e9', border: '#43a047', label: '#2e7d32' },
}

export default function Phase6SP2Step4RemB2TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 4, interaction: 1, context: 'remedial_b2' })
  const [answers, setAnswers] = useState({
    blank1: '',
    blank2: '',
    blank3: '',
    blank4: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    let correct = 0
    Object.keys(CORRECT).forEach((k) => {
      if (answers[k] === CORRECT[k]) correct++
    })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step4_remedial_b2_taska_score', correct.toString())
    try {
      await phase6API.logRemedialActivity(4, 'B2', 'A', correct, 4, 0, 2)
    } catch (e) {
      console.error(e)
    }
  }

  const allFilled = Object.values(answers).every((v) => v !== '')

  const selectSx = (key) => ({
    minWidth: 140,
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: submitted
        ? answers[key] === CORRECT[key]
          ? '#27ae60'
          : '#e74c3c'
        : undefined,
      borderWidth: submitted ? 2 : 1,
    },
  })

  const makeSelect = (key) => (
    <FormControl size="small">
      <Select
        value={answers[key]}
        onChange={(e) => !submitted && setAnswers({ ...answers, [key]: e.target.value })}
        disabled={submitted}
        displayEmpty
        sx={selectSx(key)}
      >
        <MenuItem value="">
          <em>Choose...</em>
        </MenuItem>
        {WORD_BANK.map((w) => (
          <MenuItem key={w} value={w}>
            {w}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)',
          color: 'white',
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Step 4: Remedial B2 — Task A
        </Typography>
        <Typography variant="body1">Role-Play Dialogue Gap Fill — Feedback on a Report</Typography>
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        Complete the dialogue by choosing the correct word from the word bank for each blank.
      </Alert>

      {/* Word Bank */}
      <Paper
        elevation={1}
        sx={{ p: 2, mb: 3, borderRadius: 2, backgroundColor: '#faf5ff' }}
      >
        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, color: '#6c3483' }}>
          Word Bank
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
          {WORD_BANK.map((w) => (
            <Chip
              key={w}
              label={w}
              sx={{ backgroundColor: '#8e44ad', color: 'white', fontWeight: 'bold' }}
            />
          ))}
        </Stack>
      </Paper>

      {/* Line 1: Peer */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2,
          borderLeft: `4px solid ${SPEAKER_COLORS.peer.border}`,
          backgroundColor: SPEAKER_COLORS.peer.bg,
        }}
      >
        <Typography
          variant="caption"
          fontWeight="bold"
          sx={{ color: SPEAKER_COLORS.peer.label, textTransform: 'uppercase', letterSpacing: 1 }}
        >
          PEER
        </Typography>
        <Typography variant="body1" sx={{ mt: 0.5 }}>
          My report?
        </Typography>
      </Paper>

      {/* Line 2: You — BLANK1 */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2,
          borderLeft: `4px solid ${SPEAKER_COLORS.student.border}`,
          backgroundColor: SPEAKER_COLORS.student.bg,
        }}
      >
        <Typography
          variant="caption"
          fontWeight="bold"
          sx={{
            color: SPEAKER_COLORS.student.label,
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          YOU
        </Typography>
        <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          {makeSelect('blank1')}
          <Typography variant="body1">is clear summary.</Typography>
          {submitted && answers.blank1 !== CORRECT.blank1 && (
            <Typography variant="body2" color="error.main">
              Correct: <strong>{CORRECT.blank1}</strong>
            </Typography>
          )}
          {submitted && answers.blank1 === CORRECT.blank1 && (
            <CheckCircleIcon sx={{ color: '#27ae60', fontSize: 20 }} />
          )}
        </Box>
      </Paper>

      {/* Line 3: Peer */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2,
          borderLeft: `4px solid ${SPEAKER_COLORS.peer.border}`,
          backgroundColor: SPEAKER_COLORS.peer.bg,
        }}
      >
        <Typography
          variant="caption"
          fontWeight="bold"
          sx={{ color: SPEAKER_COLORS.peer.label, textTransform: 'uppercase', letterSpacing: 1 }}
        >
          PEER
        </Typography>
        <Typography variant="body1" sx={{ mt: 0.5 }}>
          Weak?
        </Typography>
      </Paper>

      {/* Line 4: You — BLANK2 + BLANK3 + BLANK4 */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          borderLeft: `4px solid ${SPEAKER_COLORS.student.border}`,
          backgroundColor: SPEAKER_COLORS.student.bg,
        }}
      >
        <Typography
          variant="caption"
          fontWeight="bold"
          sx={{
            color: SPEAKER_COLORS.student.label,
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          YOU
        </Typography>
        <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          {makeSelect('blank2')}
          <Typography variant="body1">is few numbers,</Typography>
          {makeSelect('blank3')}
          {makeSelect('blank4')}
          <Typography variant="body1">is add attendance.</Typography>
        </Box>
        {submitted &&
          (answers.blank2 !== CORRECT.blank2 ||
            answers.blank3 !== CORRECT.blank3 ||
            answers.blank4 !== CORRECT.blank4) && (
            <Typography variant="body2" color="error.main" sx={{ mt: 1 }}>
              Correct:{' '}
              <strong>{CORRECT.blank2}</strong> is few numbers,{' '}
              <strong>{CORRECT.blank3}</strong>{' '}
              <strong>{CORRECT.blank4}</strong> is add attendance.
            </Typography>
          )}
        {submitted &&
          answers.blank2 === CORRECT.blank2 &&
          answers.blank3 === CORRECT.blank3 &&
          answers.blank4 === CORRECT.blank4 && (
            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CheckCircleIcon sx={{ color: '#27ae60', fontSize: 20 }} />
              <Typography variant="body2" color="success.dark">
                Correct!
              </Typography>
            </Box>
          )}
      </Paper>

      {!submitted ? (
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!allFilled}
          fullWidth
          size="large"
          sx={{
            background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)',
            '&:hover': { opacity: 0.9 },
          }}
        >
          Submit Answers
        </Button>
      ) : (
        <Paper
          elevation={3}
          sx={{ p: 3, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2 }}
        >
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" gutterBottom>
            Task A Complete! Score: {score}/4
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {score === 4
              ? 'Excellent! You can use all feedback vocabulary in context.'
              : score >= 3
              ? 'Well done! Review the highlighted answers above.'
              : 'Good effort! Study the word bank and try again next time.'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/2/step/4/remedial/b2/task/b')}
            size="large"
            sx={{
              background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)',
              '&:hover': { opacity: 0.9 },
            }}
          >
            Continue to Task B
          </Button>
        </Paper>
      )}
    </Box>
  )
}
