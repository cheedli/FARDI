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

// Spec: 2 blanks total across 2 "You" lines
// BLANK1: options positive/bad/wrong  correct: positive
// BLANK2: options suggestion/problem/mistake  correct: suggestion
// BLANK3: options numbers/nothing/problems  correct: numbers
// Total score: out of 3 (spec says logRemedialActivity(..., 3, 0, 2))

const BLANK1_OPTIONS = ['positive', 'bad', 'wrong']
const BLANK2_OPTIONS = ['suggestion', 'problem', 'mistake']
const BLANK3_OPTIONS = ['numbers', 'nothing', 'problems']

const SPEAKER_COLORS = {
  peer: { bg: '#e8eaf6', border: '#5c6bc0', label: '#3949ab' },
  student: { bg: '#e8f5e9', border: '#43a047', label: '#2e7d32' },
}

export default function Phase6SP2Step4RemB1TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 4, interaction: 1, context: 'remedial_b1' })
  const [answers, setAnswers] = useState({ blank1: '', blank2: '', blank3: '' })
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const correctAnswers = { blank1: 'positive', blank2: 'suggestion', blank3: 'numbers' }

  const handleSubmit = async () => {
    let correct = 0
    if (answers.blank1 === correctAnswers.blank1) correct++
    if (answers.blank2 === correctAnswers.blank2) correct++
    if (answers.blank3 === correctAnswers.blank3) correct++
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step4_remedial_b1_taska_score', correct.toString())
    try {
      await phase6API.logRemedialActivity(4, 'B1', 'A', correct, 3, 0, 2)
    } catch (e) {
      console.error(e)
    }
  }

  const allFilled =
    answers.blank1 !== '' && answers.blank2 !== '' && answers.blank3 !== ''

  const selectSx = (key) => ({
    minWidth: 140,
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: submitted
        ? answers[key] === correctAnswers[key]
          ? '#27ae60'
          : '#e74c3c'
        : undefined,
      borderWidth: submitted ? 2 : 1,
    },
  })

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
          Step 4: Remedial B1 — Task A
        </Typography>
        <Typography variant="body1">Negotiation Gap Fill — Giving Feedback on a Report</Typography>
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        Complete the dialogue by choosing the correct word from the options for each blank.
      </Alert>

      {/* Dialogue */}

      {/* Line 1: SKANDER */}
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
          SKANDER
        </Typography>
        <Typography variant="body1" sx={{ mt: 0.5 }}>
          Your report?
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
          <Typography variant="body1">It is</Typography>
          <FormControl size="small">
            <Select
              value={answers.blank1}
              onChange={(e) => setAnswers({ ...answers, blank1: e.target.value })}
              disabled={submitted}
              displayEmpty
              sx={selectSx('blank1')}
            >
              <MenuItem value="">
                <em>Choose...</em>
              </MenuItem>
              {BLANK1_OPTIONS.map((w) => (
                <MenuItem key={w} value={w}>
                  {w}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant="body1">.</Typography>
          {submitted && answers.blank1 !== correctAnswers.blank1 && (
            <Typography variant="body2" color="error.main">
              Correct: <strong>{correctAnswers.blank1}</strong>
            </Typography>
          )}
          {submitted && answers.blank1 === correctAnswers.blank1 && (
            <CheckCircleIcon sx={{ color: '#27ae60', fontSize: 20 }} />
          )}
        </Box>
      </Paper>

      {/* Line 3: Emna */}
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
          EMNA
        </Typography>
        <Typography variant="body1" sx={{ mt: 0.5 }}>
          Suggestion?
        </Typography>
      </Paper>

      {/* Line 4: You — BLANK2 + BLANK3 */}
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
          <FormControl size="small">
            <Select
              value={answers.blank2}
              onChange={(e) => setAnswers({ ...answers, blank2: e.target.value })}
              disabled={submitted}
              displayEmpty
              sx={selectSx('blank2')}
            >
              <MenuItem value="">
                <em>Choose...</em>
              </MenuItem>
              {BLANK2_OPTIONS.map((w) => (
                <MenuItem key={w} value={w}>
                  {w}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant="body1">is add</Typography>
          <FormControl size="small">
            <Select
              value={answers.blank3}
              onChange={(e) => setAnswers({ ...answers, blank3: e.target.value })}
              disabled={submitted}
              displayEmpty
              sx={selectSx('blank3')}
            >
              <MenuItem value="">
                <em>Choose...</em>
              </MenuItem>
              {BLANK3_OPTIONS.map((w) => (
                <MenuItem key={w} value={w}>
                  {w}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant="body1">.</Typography>
        </Box>
        {submitted &&
          (answers.blank2 !== correctAnswers.blank2 ||
            answers.blank3 !== correctAnswers.blank3) && (
            <Typography variant="body2" color="error.main" sx={{ mt: 1 }}>
              Correct:{' '}
              <strong>{correctAnswers.blank2}</strong> is add{' '}
              <strong>{correctAnswers.blank3}</strong>.
            </Typography>
          )}
        {submitted &&
          answers.blank2 === correctAnswers.blank2 &&
          answers.blank3 === correctAnswers.blank3 && (
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
            Task A Complete! Score: {score}/3
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {score === 3
              ? 'Perfect! You can identify key feedback vocabulary.'
              : score >= 2
              ? 'Well done! Review the highlighted answers above.'
              : 'Good effort! Study the feedback terms and try again next time.'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/2/step/4/remedial/b1/task/b')}
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
