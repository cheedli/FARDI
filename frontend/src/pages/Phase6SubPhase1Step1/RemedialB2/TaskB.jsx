import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Alert, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 1 - Level B2 - Task B
 * Writing: "Report Builder Odyssey"
 * Write an 8-sentence paragraph for a post-event report
 */

const GUIDED_STRUCTURE = [
  { id: 0, point: 'Overall success of the festival', placeholder: 'The Global Cultures Festival was a great success with over 200 attendees.' },
  { id: 1, point: 'Most positive moment / achievement', placeholder: 'The multicultural performances were the highlight and received strong applause.' },
  { id: 2, point: 'Biggest challenge / difficulty', placeholder: 'The main challenge was the last-minute lighting failure...' },
  { id: 3, point: 'How the challenge was handled', placeholder: '...but quick use of backup lights saved the day.' },
  { id: 4, point: 'One strength of the organization', placeholder: 'Our strength was excellent teamwork under pressure.' },
  { id: 5, point: 'One area that needs improvement', placeholder: 'However, time management needs improvement.' },
  { id: 6, point: 'Piece of feedback received', placeholder: 'Many guests gave positive feedback about the food and dances.' },
  { id: 7, point: 'One concrete recommendation for next time', placeholder: 'I recommend better time buffers and more volunteer training for future events.' }
]

export default function Phase6SP1Step1RemB2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 1, interaction: 2, context: 'remedial_b2' })
  const [sentences, setSentences] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const allAnswered = GUIDED_STRUCTURE.every(s => (sentences[s.id] || '').trim().length > 0)

  const handleSubmit = async () => {
    let correct = 0
    GUIDED_STRUCTURE.forEach(s => {
      const words = (sentences[s.id] || '').trim().split(/\s+/).filter(w => w.length > 0).length
      if (words >= 5) correct++
    })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step1_remedial_b2_taskb_score', correct.toString())
    try { await phase6API.logRemedialActivity(1, 'B2', 'B', correct, GUIDED_STRUCTURE.length, 0, 1) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection and Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 1: Remedial Practice - Level B2</Typography>
        <Typography variant="h6" gutterBottom>Task B: Report Builder Odyssey</Typography>
        <Typography variant="body1">Write an 8-sentence paragraph for a post-event report</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Report Builder Odyssey! Build a strong report paragraph step by step. Write one sentence for each point below. Use past tense, connectors (however, but, overall), and evaluation vocabulary!"
        />
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Instructions:</strong> Write one sentence for each point. Use past tense and evaluation words
          (success, challenge, feedback, strength, weakness, recommend). Aim for at least 5 words per sentence.
        </Typography>
      </Alert>

      <Stack spacing={2}>
        {GUIDED_STRUCTURE.map((s) => (
          <Paper key={s.id} elevation={1} sx={{ p: 2.5, borderRadius: 2 }}>
            <Typography variant="body1" fontWeight="bold" sx={{ mb: 0.5 }}>
              {s.id + 1}. {s.point}
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={sentences[s.id] || ''}
              onChange={(e) => setSentences({ ...sentences, [s.id]: e.target.value })}
              disabled={submitted}
              placeholder={s.placeholder}
            />
          </Paper>
        ))}
      </Stack>

      {!submitted ? (
        <Button variant="contained" onClick={handleSubmit} disabled={!allAnswered} fullWidth size="large"
          sx={{ mt: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}>
          Submit Report Paragraph
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, mt: 3, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" fontWeight="bold">Task B Complete!</Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>Score: {score}/{GUIDED_STRUCTURE.length} sentences</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {score >= 7 ? 'Excellent! A well-structured report paragraph!' : score >= 5 ? 'Good work! Keep building your report writing skills.' : 'Good effort! Try to write at least 5 words per sentence next time.'}
          </Typography>
          <Button variant="contained" onClick={() => navigate('/phase6/subphase/1/step/1/remedial/b2/task/c')} size="large"
            sx={{ mt: 2, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>
            Next: Task C →
          </Button>
        </Paper>
      )}
    </Box>
  )
}
