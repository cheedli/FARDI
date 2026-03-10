import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Paper, Typography, Button, TextField, Alert, Stack, Chip
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 4 — Level B1 — Task B
 * Writing Proposals: 6 guided sentences for a report summary
 */

const QUESTIONS = [
  {
    prompt: 'Success?',
    example: 'Festival was success.',
    placeholder: 'Write about success...'
  },
  {
    prompt: 'People?',
    example: 'Many people came.',
    placeholder: 'Write about attendance...'
  },
  {
    prompt: 'Good part?',
    example: 'Dances were good.',
    placeholder: 'Write about the best part...'
  },
  {
    prompt: 'Challenge?',
    example: 'Lighting challenge.',
    placeholder: 'Write about a challenge...'
  },
  {
    prompt: 'Fix?',
    example: 'We fixed it.',
    placeholder: 'Write about the solution...'
  },
  {
    prompt: 'Recommend?',
    example: 'Recommend more backup.',
    placeholder: 'Write your recommendation...'
  }
]

export default function Phase6SP1Step4RemB1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 4, interaction: 2, context: 'remedial_b1' })
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(''))
  const [showExamples, setShowExamples] = useState(Array(QUESTIONS.length).fill(false))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerChange = (idx, value) => {
    const updated = [...answers]
    updated[idx] = value
    setAnswers(updated)
  }

  const handleSubmit = async () => {
    // Score: ≥3 words = correct
    const filled = answers.filter(a => a.trim().split(/\s+/).filter(w => w.length > 0).length >= 3).length
    setScore(filled)
    setSubmitted(true)
    // Reveal all examples after submission
    setShowExamples(Array(QUESTIONS.length).fill(true))
    sessionStorage.setItem('phase6_sp1_step4_remedial_b1_taskb_score', filled.toString())
    try { await phase6API.logRemedialActivity(4, 'B1', 'B', filled, QUESTIONS.length, 0, 1) } catch (e) { console.error(e) }
  }

  const allFilled = answers.every(a => a.trim().length > 0)

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection &amp; Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 4: Remedial Practice — Level B1</Typography>
        <Typography variant="h6">Task B: Writing Proposals</Typography>
        <Typography variant="body1">Answer each guided question to build a report summary</Typography>
      </Paper>

      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        Answer each question with at least 3 words. Examples will be shown after you submit.
      </Alert>

      <Stack spacing={3} sx={{ mb: 3 }}>
        {QUESTIONS.map((q, idx) => {
          const wordCount = answers[idx].trim().split(/\s+/).filter(w => w.length > 0).length
          const isCorrect = submitted && wordCount >= 3

          return (
            <Paper
              key={idx}
              elevation={1}
              sx={{
                p: 3,
                borderRadius: 2,
                borderLeft: '4px solid #8e44ad',
                border: submitted ? '2px solid' : undefined,
                borderColor: submitted ? (isCorrect ? 'success.main' : 'error.main') : undefined
              }}
            >
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                Question {idx + 1} of {QUESTIONS.length}
              </Typography>
              <Chip
                label={q.prompt}
                sx={{ mb: 1.5, backgroundColor: '#8e44ad', color: 'white', fontWeight: 'bold', fontSize: '0.95rem' }}
              />
              <TextField
                fullWidth
                multiline
                rows={2}
                value={answers[idx]}
                onChange={(e) => handleAnswerChange(idx, e.target.value)}
                disabled={submitted}
                placeholder={q.placeholder}
                sx={{ mb: 1.5 }}
              />
              {submitted && (
                <Paper sx={{ p: 1.5, backgroundColor: '#f3e5f5', borderRadius: 1, border: '1px solid #8e44ad' }}>
                  <Typography variant="body2" sx={{ color: '#6c3483', fontWeight: 'bold' }}>
                    Example: "{q.example}"
                  </Typography>
                  {!isCorrect && (
                    <Typography variant="body2" color="error" sx={{ mt: 0.5 }}>
                      Try to write at least 3 words.
                    </Typography>
                  )}
                </Paper>
              )}
            </Paper>
          )
        })}
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
          Submit Proposals
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', backgroundColor: '#f3e5f5', border: '2px solid #8e44ad', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 60, color: '#8e44ad', mb: 1 }} />
          <Typography variant="h5" sx={{ color: '#6c3483' }} gutterBottom>
            Task B Complete! Score: {score}/{QUESTIONS.length}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, color: '#555' }}>
            {score >= 5 ? 'Excellent! Your report proposals look great.' : 'Good effort! Compare your answers with the examples above.'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/1/step/4/remedial/b1/task/c')}
            size="large"
            sx={{ background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}
          >
            Continue to Task C →
          </Button>
        </Paper>
      )}
    </Box>
  )
}
