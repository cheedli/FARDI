import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Alert, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 1 - Level A2 - Task C
 * Simple Sentence Writing: Sentence Builder
 * Write 6 simple sentences about the festival
 */

const SENTENCE_PROMPTS = [
  { id: 0, prompt: 'Was the festival good or bad?', example: 'Festival good.' },
  { id: 1, prompt: 'How did people feel?', example: 'People happy.' },
  { id: 2, prompt: 'What was the challenge?', example: 'Challenge lighting.' },
  { id: 3, prompt: 'Did you fix the problem?', example: 'We fix it.' },
  { id: 4, prompt: 'Did you learn something?', example: 'I learn.' },
  { id: 5, prompt: 'What about next time?', example: 'Next time better.' }
]

export default function Phase6SP1Step1RemA2TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 1, interaction: 3, context: 'remedial_a2' })
  const [sentences, setSentences] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    // Score based on how many prompts were answered with at least 1 word
    let correct = 0
    SENTENCE_PROMPTS.forEach(p => {
      if ((sentences[p.id] || '').trim().split(/\s+/).filter(w => w.length > 0).length >= 1) {
        correct++
      }
    })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step1_remedial_a2_taskc_score', correct.toString())
    try {
      await phase6API.logRemedialActivity(1, 'A2', 'C', correct, SENTENCE_PROMPTS.length, 0, 1)
    } catch (e) {
      console.error(e)
    }
  }

  const allAnswered = SENTENCE_PROMPTS.every(p => (sentences[p.id] || '').trim().length > 0)

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection and Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 1: Remedial Practice - Level A2</Typography>
        <Typography variant="h6" gutterBottom>Task C: Sentence Builder</Typography>
        <Typography variant="body1">Write 6 simple sentences about the festival</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Sentence Builder! Write 6 simple sentences about the festival. Look at the question and write a simple sentence. You can use short sentences like the examples!"
        />
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Instructions:</strong> Write a simple sentence to answer each question.
          Short sentences are fine! Look at the example for each question.
        </Typography>
      </Alert>

      <Stack spacing={2}>
        {SENTENCE_PROMPTS.map((p) => (
          <Paper key={p.id} elevation={1} sx={{ p: 2.5, borderRadius: 2 }}>
            <Typography variant="body1" fontWeight="bold" sx={{ mb: 0.5 }}>
              {p.id + 1}. {p.prompt}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontStyle: 'italic' }}>
              Example: {p.example}
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={sentences[p.id] || ''}
              onChange={(e) => setSentences({ ...sentences, [p.id]: e.target.value })}
              disabled={submitted}
              placeholder="Write your sentence here..."
            />
          </Paper>
        ))}
      </Stack>

      {!submitted ? (
        <Button variant="contained" onClick={handleSubmit} disabled={!allAnswered} fullWidth size="large"
          sx={{ mt: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}>
          Submit Sentences
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, mt: 3, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" fontWeight="bold">Task C Complete!</Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>Score: {score}/{SENTENCE_PROMPTS.length}</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {score === SENTENCE_PROMPTS.length ? 'Perfect! All sentences written!' : 'Well done! You wrote your sentences.'}
          </Typography>
          <Button variant="contained" onClick={() => navigate('/phase6/subphase/1/step/2')} size="large"
            sx={{ mt: 2, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>
            Continue to Step 2 →
          </Button>
        </Paper>
      )}
    </Box>
  )
}
