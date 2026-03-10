import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Alert, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 5 - Level B2 - Task B
 * Writing: "Analysis Odyssey" — Fully correct/rewrite 8-sentence faulty report section
 */

const FAULTY_TEXT = 'Festival good. Many people. Dances nice. Food good. Lights problem bad. We fix. People happy. Next time good.'

const MODEL_ANSWER = `The Global Cultures Festival was successful, attracting many attendees on March 8. Performances were well-received and generated positive feedback. The food stalls were also popular. However, a lighting problem occurred, although it was fixed quickly with backup systems. Guests generally expressed satisfaction with the event. The main strength was good teamwork. One weakness was tight scheduling. I recommend adding more time buffers for future events.`

const GUIDED_POINTS = [
  { id: 0, point: 'Overall success (with date/number)', placeholder: 'The Global Cultures Festival was successful...' },
  { id: 1, point: 'Performances were well-received', placeholder: 'Performances were well-received and...' },
  { id: 2, point: 'Food stalls were popular', placeholder: 'The food stalls were also...' },
  { id: 3, point: 'Lighting problem + quick fix', placeholder: 'However, a lighting problem occurred...' },
  { id: 4, point: 'Guest satisfaction', placeholder: 'Guests generally expressed...' },
  { id: 5, point: 'Main strength', placeholder: 'The main strength was...' },
  { id: 6, point: 'One weakness', placeholder: 'One weakness was...' },
  { id: 7, point: 'Recommendation for next time', placeholder: 'I recommend...' }
]

export default function Phase6SP1Step5RemB2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 5, interaction: 2, context: 'remedial_b2' })
  const [sentences, setSentences] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const allAnswered = GUIDED_POINTS.every(s => (sentences[s.id] || '').trim().length > 0)

  const handleSubmit = async () => {
    let correct = 0
    GUIDED_POINTS.forEach(s => {
      const words = (sentences[s.id] || '').trim().split(/\s+/).filter(w => w.length > 0).length
      if (words >= 5) correct++
    })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step5_remedial_b2_taskb_score', correct.toString())
    try { await phase6API.logRemedialActivity(5, 'B2', 'B', correct, GUIDED_POINTS.length, 0, 1) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection and Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 5: Remedial Practice - Level B2</Typography>
        <Typography variant="h6" gutterBottom>Task B: Analysis Odyssey</Typography>
        <Typography variant="body1">Rewrite an 8-sentence faulty report section with proper B2-level language</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Analysis Odyssey! Below is a faulty, informal report. Rewrite it sentence by sentence with proper formality, past tense, connectors, and balanced evaluation. Use 'However', 'well-received', 'recommend', and add specific details!"
        />
      </Paper>

      <Paper elevation={2} sx={{ p: 2.5, mb: 3, backgroundColor: '#fff5f5', borderLeft: '4px solid #e74c3c', borderRadius: 2 }}>
        <Typography variant="subtitle2" color="error.main" fontWeight="bold" gutterBottom>Faulty Text to Rewrite:</Typography>
        <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>{FAULTY_TEXT}</Typography>
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2"><strong>Instructions:</strong> Write one corrected sentence per point. Use past tense, formal vocabulary, connectors (however, although, overall), and add evidence where possible.</Typography>
      </Alert>

      <Stack spacing={2}>
        {GUIDED_POINTS.map((s) => (
          <Paper key={s.id} elevation={1} sx={{ p: 2.5, borderRadius: 2 }}>
            <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>
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
          sx={{ mt: 3, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>
          Submit Rewrite
        </Button>
      ) : (
        <Box>
          <Paper elevation={2} sx={{ p: 3, mt: 3, backgroundColor: '#f0faf4', borderLeft: '4px solid #27ae60', borderRadius: 2 }}>
            <Typography variant="subtitle2" color="success.main" fontWeight="bold" gutterBottom>Model Answer:</Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.8 }}>{MODEL_ANSWER}</Typography>
          </Paper>
          <Paper elevation={3} sx={{ p: 3, mt: 2, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2 }}>
            <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
            <Typography variant="h5" color="success.dark" fontWeight="bold">Task B Complete!</Typography>
            <Typography variant="h6" sx={{ mt: 1 }}>Score: {score}/{GUIDED_POINTS.length} sentences</Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {score >= 7 ? 'Excellent! A well-structured and formal report paragraph.' : score >= 5 ? 'Good work! Compare your sentences with the model answer.' : 'Good effort! Focus on using formal vocabulary and connectors.'}
            </Typography>
            <Button variant="contained" onClick={() => navigate('/phase6/subphase/1/step/5/remedial/b2/task/c')} size="large"
              sx={{ mt: 2, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>
              Next: Task C →
            </Button>
          </Paper>
        </Box>
      )}
    </Box>
  )
}
