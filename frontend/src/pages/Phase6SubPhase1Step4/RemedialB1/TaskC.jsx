import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Paper, Typography, Button, Stack, Alert
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 4 — Level B1 — Task C
 * Quiz Game: 6 MCQ on report terms
 */

const QUESTIONS = [
  {
    question: 'Success means?',
    options: ['Good result', 'Bad event', 'Challenge'],
    correct: 0
  },
  {
    question: 'Challenge means?',
    options: ['Problem', 'Achievement', 'Positive'],
    correct: 0
  },
  {
    question: 'Feedback means?',
    options: ['What people say', 'Bad news', 'A failure'],
    correct: 0
  },
  {
    question: 'Improve means?',
    options: ['Make worse', 'Make better', 'Stay same'],
    correct: 1
  },
  {
    question: 'Recommend means?',
    options: ['Suggest', 'Ignore', 'Delete'],
    correct: 0
  },
  {
    question: 'Summary means?',
    options: ['Long report', 'Short overview', 'Challenge'],
    correct: 1
  }
]

export default function Phase6SP1Step4RemB1TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 4, interaction: 3, context: 'remedial_b1' })
  const [selected, setSelected] = useState(Array(QUESTIONS.length).fill(null))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSelect = (qIdx, optIdx) => {
    if (submitted) return
    const updated = [...selected]
    updated[qIdx] = optIdx
    setSelected(updated)
  }

  const handleSubmit = async () => {
    let correct = 0
    QUESTIONS.forEach((q, i) => { if (selected[i] === q.correct) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step4_remedial_b1_taskc_score', correct.toString())
    try { await phase6API.logRemedialActivity(4, 'B1', 'C', correct, QUESTIONS.length, 0, 1) } catch (e) { console.error(e) }
  }

  const allAnswered = selected.every(s => s !== null)

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection &amp; Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 4: Remedial Practice — Level B1</Typography>
        <Typography variant="h6">Task C: Quiz Game</Typography>
        <Typography variant="body1">Choose the correct definition for each report term</Typography>
      </Paper>

      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        Select the best answer for each question about report vocabulary.
      </Alert>

      <Stack spacing={3} sx={{ mb: 3 }}>
        {QUESTIONS.map((q, qIdx) => (
          <Paper
            key={qIdx}
            elevation={1}
            sx={{
              p: 3,
              borderRadius: 2,
              borderLeft: '4px solid #8e44ad',
              border: submitted ? '2px solid' : undefined,
              borderColor: submitted
                ? (selected[qIdx] === q.correct ? 'success.main' : 'error.main')
                : undefined
            }}
          >
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
              Question {qIdx + 1} of {QUESTIONS.length}
            </Typography>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#4a235a' }}>
              {q.question}
            </Typography>
            <Stack spacing={1.5}>
              {q.options.map((opt, optIdx) => {
                let bgColor = 'white'
                let borderColor = '#e0e0e0'
                let textColor = 'text.primary'

                if (!submitted && selected[qIdx] === optIdx) {
                  bgColor = '#f3e5f5'
                  borderColor = '#8e44ad'
                }
                if (submitted) {
                  if (optIdx === q.correct) {
                    bgColor = '#e8f8f0'
                    borderColor = '#27ae60'
                    textColor = '#1e8449'
                  } else if (selected[qIdx] === optIdx && optIdx !== q.correct) {
                    bgColor = '#fdecea'
                    borderColor = '#e74c3c'
                    textColor = '#c0392b'
                  }
                }

                return (
                  <Box
                    key={optIdx}
                    onClick={() => handleSelect(qIdx, optIdx)}
                    sx={{
                      p: 1.5,
                      borderRadius: 1.5,
                      border: '2px solid',
                      borderColor,
                      backgroundColor: bgColor,
                      cursor: submitted ? 'default' : 'pointer',
                      transition: 'all 0.15s ease',
                      '&:hover': submitted ? {} : { backgroundColor: '#f3e5f5', borderColor: '#8e44ad' }
                    }}
                  >
                    <Typography variant="body1" sx={{ color: textColor, fontWeight: selected[qIdx] === optIdx || (submitted && optIdx === q.correct) ? 'bold' : 'normal' }}>
                      {String.fromCharCode(65 + optIdx)}. {opt}
                    </Typography>
                  </Box>
                )
              })}
            </Stack>
            {submitted && selected[qIdx] !== q.correct && (
              <Typography variant="body2" color="error" sx={{ mt: 1.5 }}>
                Correct answer: <strong>{q.options[q.correct]}</strong>
              </Typography>
            )}
          </Paper>
        ))}
      </Stack>

      {!submitted ? (
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!allAnswered}
          fullWidth
          size="large"
          sx={{ background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}
        >
          Submit Answers
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', backgroundColor: '#f3e5f5', border: '2px solid #8e44ad', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 60, color: '#8e44ad', mb: 1 }} />
          <Typography variant="h5" sx={{ color: '#6c3483' }} gutterBottom>
            Task C Complete! Score: {score}/{QUESTIONS.length}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, color: '#555' }}>
            {score >= 5 ? 'Excellent! You know your report vocabulary.' : 'Good effort! Review the correct answers above.'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/1/step/4/remedial/b2/task/a')}
            size="large"
            sx={{ background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}
          >
            Continue →
          </Button>
        </Paper>
      )}
    </Box>
  )
}
