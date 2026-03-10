import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Alert,
  Collapse,
  Chip,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const PROMPTS = [
  {
    question: 'Positive?',
    example: 'Your summary is good.',
  },
  {
    question: 'Strength?',
    example: 'Strength is clear writing.',
  },
  {
    question: 'Weakness?',
    example: 'Weakness is no numbers.',
  },
  {
    question: 'Suggestion?',
    example: 'Suggestion: add evidence.',
  },
  {
    question: 'Improve?',
    example: 'You can improve formality.',
  },
  {
    question: 'Thank?',
    example: 'Thank you for sharing.',
  },
]

const wordCount = (text) =>
  text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length

export default function Phase6SP2Step4RemB1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 4, interaction: 2, context: 'remedial_b1' })
  const [answers, setAnswers] = useState(PROMPTS.map(() => ''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    const correct = answers.filter((a) => wordCount(a) >= 3).length
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step4_remedial_b1_taskb_score', correct.toString())
    try {
      await phase6API.logRemedialActivity(4, 'B1', 'B', correct, 6, 0, 2)
    } catch (e) {
      console.error(e)
    }
  }

  const allAttempted = answers.every((a) => a.trim().length > 0)

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
          Step 4: Remedial B1 — Task B
        </Typography>
        <Typography variant="body1">Writing Proposals — 6 Sentences Giving Feedback</Typography>
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        Answer each guided question with a sentence giving feedback on a report. Write at least 3
        words per sentence. An example is shown after you submit.
      </Alert>

      {PROMPTS.map((p, idx) => {
        const wc = wordCount(answers[idx])
        const isSufficient = wc >= 3
        const isAttempted = answers[idx].trim().length > 0

        return (
          <Paper
            key={idx}
            elevation={2}
            sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid #e0d0f0' }}
          >
            {/* Question label */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Chip
                label={`${idx + 1}`}
                size="small"
                sx={{ backgroundColor: '#8e44ad', color: 'white', fontWeight: 'bold' }}
              />
              <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                {p.question}
              </Typography>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={2}
              value={answers[idx]}
              onChange={(e) => {
                const updated = [...answers]
                updated[idx] = e.target.value
                setAnswers(updated)
              }}
              disabled={submitted}
              placeholder="Write your sentence here..."
              sx={{ mb: 1 }}
            />

            <Typography
              variant="caption"
              color={submitted ? (isSufficient ? 'success.main' : 'error.main') : 'text.secondary'}
            >
              Words: {wc}{' '}
              {submitted
                ? isSufficient
                  ? '(correct — 3+ words)'
                  : '(needs 3+ words)'
                : '(aim for 3+ words)'}
            </Typography>

            {/* Show example hint button before submit */}
            {!submitted && (
              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <LightbulbIcon sx={{ color: '#f39c12', fontSize: 18 }} />
                <Typography variant="body2" color="text.secondary">
                  <strong>Example:</strong> {p.example}
                </Typography>
              </Box>
            )}

            {/* Show example after submit */}
            <Collapse in={submitted}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  mt: 2,
                  backgroundColor: '#e8f5e9',
                  borderRadius: 1,
                  borderLeft: '4px solid #27ae60',
                }}
              >
                <Typography variant="body2" fontWeight="bold" color="success.dark" gutterBottom>
                  Example answer:
                </Typography>
                <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                  {p.example}
                </Typography>
              </Paper>
            </Collapse>
          </Paper>
        )
      })}

      {!submitted ? (
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!allAttempted}
          fullWidth
          size="large"
          sx={{
            background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)',
            '&:hover': { opacity: 0.9 },
          }}
        >
          Submit All Sentences
        </Button>
      ) : (
        <Paper
          elevation={3}
          sx={{ p: 3, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2 }}
        >
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" gutterBottom>
            Task B Complete! Score: {score}/6
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {score === 6
              ? 'Excellent! All sentences met the minimum length.'
              : score >= 4
              ? 'Good effort! Compare your sentences with the examples above.'
              : 'Keep practising — review the example sentences to build confidence.'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/2/step/4/remedial/b1/task/c')}
            size="large"
            sx={{
              background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)',
              '&:hover': { opacity: 0.9 },
            }}
          >
            Continue to Task C
          </Button>
        </Paper>
      )}
    </Box>
  )
}
