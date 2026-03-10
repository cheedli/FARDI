import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Alert, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 1 - Level B1 - Task B
 * Writing Proposals: Write 6 sentences reflecting on the festival
 */

const GUIDED_QUESTIONS = [
  { id: 0, question: 'Best moment?', example: 'Best moment was dances.' },
  { id: 1, question: 'Why was it the best?', example: 'Because beautiful.' },
  { id: 2, question: 'What was difficult?', example: 'Lighting problem.' },
  { id: 3, question: 'How did you fix it?', example: 'Used backup.' },
  { id: 4, question: 'How did you feel?', example: 'I felt proud.' },
  { id: 5, question: 'How can you improve?', example: 'Plan better next time.' }
]

export default function Phase6SP1Step1RemB1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 1, interaction: 2, context: 'remedial_b1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const allAnswered = GUIDED_QUESTIONS.every(q => (answers[q.id] || '').trim().length > 0)

  const handleSubmit = async () => {
    // Score: 1 point per answered question with at least 2 words
    let correct = 0
    GUIDED_QUESTIONS.forEach(q => {
      const words = (answers[q.id] || '').trim().split(/\s+/).filter(w => w.length > 0).length
      if (words >= 2) correct++
    })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step1_remedial_b1_taskb_score', correct.toString())
    try { await phase6API.logRemedialActivity(1, 'B1', 'B', correct, GUIDED_QUESTIONS.length, 0, 1) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection and Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 1: Remedial Practice - Level B1</Typography>
        <Typography variant="h6" gutterBottom>Task B: Writing Proposals</Typography>
        <Typography variant="body1">Write 6 sentences reflecting on the festival using past tense</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="Emna"
          message="Now write 6 sentences about the festival! Answer each question below with a complete sentence. Use past tense (was, were, felt, fixed) and try to give reasons."
        />
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Instructions:</strong> Write a complete sentence to answer each question. Use past tense.
          Look at the example for each question to help you.
        </Typography>
      </Alert>

      <Stack spacing={2}>
        {GUIDED_QUESTIONS.map((q) => (
          <Paper key={q.id} elevation={1} sx={{ p: 2.5, borderRadius: 2 }}>
            <Typography variant="body1" fontWeight="bold" sx={{ mb: 0.5 }}>
              {q.id + 1}. {q.question}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontStyle: 'italic' }}>
              Example: {q.example}
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={answers[q.id] || ''}
              onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
              disabled={submitted}
              placeholder="Write your sentence here..."
            />
          </Paper>
        ))}
      </Stack>

      {!submitted ? (
        <Button variant="contained" onClick={handleSubmit} disabled={!allAnswered} fullWidth size="large"
          sx={{ mt: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}>
          Submit Writing
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, mt: 3, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" fontWeight="bold">Task B Complete!</Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>Score: {score}/{GUIDED_QUESTIONS.length}</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {score >= 5 ? 'Excellent! Great use of past tense and reflection language!' : 'Good work! Keep practising sentence writing.'}
          </Typography>
          <Button variant="contained" onClick={() => navigate('/phase6/subphase/1/step/1/remedial/b1/task/c')} size="large"
            sx={{ mt: 2, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>
            Next: Task C →
          </Button>
        </Paper>
      )}
    </Box>
  )
}
