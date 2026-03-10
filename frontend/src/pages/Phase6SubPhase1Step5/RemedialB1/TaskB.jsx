import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Alert, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 5 - Level B1 - Task B
 * Writing Proposals: "Definition Duel" — Correct 8 faulty sentences for coherence/vocabulary/tone
 */

const SENTENCES = [
  { id: 0, faulty: 'Festival good.', correct: 'The festival was successful.', hint: 'Use "successful" (formal) + past tense "was"' },
  { id: 1, faulty: 'Many people come.', correct: 'Over 200 people came.', hint: 'Use past tense "came" and add specific number' },
  { id: 2, faulty: 'Dances nice.', correct: 'Dances were very good.', hint: 'Add "were" (past tense) and "very good"' },
  { id: 3, faulty: 'Lights problem bad.', correct: 'There was a lighting challenge.', hint: 'Use formal "challenge" instead of "problem bad"' },
  { id: 4, faulty: 'We fix fast.', correct: 'We fixed it quickly.', hint: 'Use past tense "fixed" and adverb "quickly"' },
  { id: 5, faulty: 'People happy.', correct: 'Guests gave positive feedback.', hint: 'Use formal "guests" and "positive feedback"' },
  { id: 6, faulty: 'Improve time.', correct: 'We need to improve time management.', hint: 'Write a complete sentence with "management"' },
  { id: 7, faulty: 'More backup.', correct: 'I recommend more backup lights.', hint: 'Use "recommend" + complete phrase' }
]

export default function Phase6SP1Step5RemB1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 5, interaction: 2, context: 'remedial_b1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const allAnswered = SENTENCES.every(s => (answers[s.id] || '').trim().length > 0)

  const handleSubmit = async () => {
    let correct = 0
    SENTENCES.forEach(s => {
      const words = (answers[s.id] || '').trim().split(/\s+/).filter(w => w.length > 0).length
      if (words >= 3) correct++
    })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step5_remedial_b1_taskb_score', correct.toString())
    try { await phase6API.logRemedialActivity(5, 'B1', 'B', correct, SENTENCES.length, 0, 1) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection and Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 5: Remedial Practice - Level B1</Typography>
        <Typography variant="h6" gutterBottom>Task B: Definition Duel</Typography>
        <Typography variant="body1">Correct 8 faulty report sentences for coherence, vocabulary, and tone</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Definition Duel! Each sentence below has a formality, vocabulary, or coherence problem. Rewrite it correctly. Use past tense, formal vocabulary, and complete sentences!"
        />
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2"><strong>Instructions:</strong> Rewrite each faulty sentence correctly. Use past tense, formal vocabulary (successful/challenge/feedback/recommend), and add specific details where possible.</Typography>
      </Alert>

      <Stack spacing={2}>
        {SENTENCES.map((s) => (
          <Paper key={s.id} elevation={1} sx={{ p: 2.5, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap', mb: 1 }}>
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography variant="caption" color="error.main" fontWeight="bold">Faulty:</Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace', color: 'error.dark', mb: 1 }}>{s.faulty}</Typography>
                <Typography variant="caption" color="info.main" fontStyle="italic">Hint: {s.hint}</Typography>
              </Box>
              <Box sx={{ flex: 2, minWidth: 250 }}>
                <Typography variant="caption" color="success.main" fontWeight="bold">Your correction:</Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={answers[s.id] || ''}
                  onChange={(e) => setAnswers({ ...answers, [s.id]: e.target.value })}
                  disabled={submitted}
                  placeholder="Write the correct sentence..."
                  sx={{ mt: 0.5 }}
                />
              </Box>
            </Box>
            {submitted && (
              <Alert severity="info" sx={{ mt: 1 }}>
                <Typography variant="body2"><strong>Model answer:</strong> {s.correct}</Typography>
              </Alert>
            )}
          </Paper>
        ))}
      </Stack>

      {!submitted ? (
        <Button variant="contained" onClick={handleSubmit} disabled={!allAnswered} fullWidth size="large"
          sx={{ mt: 3, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>
          Submit Corrections
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, mt: 3, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" fontWeight="bold">Task B Complete!</Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>Score: {score}/{SENTENCES.length} sentences corrected</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {score >= 7 ? 'Excellent! You can improve report formality and vocabulary.' : score >= 5 ? 'Good work! Check the model answers above.' : 'Keep practicing — focus on past tense and formal vocabulary.'}
          </Typography>
          <Button variant="contained" onClick={() => navigate('/phase6/subphase/1/step/5/remedial/b1/task/c')} size="large"
            sx={{ mt: 2, background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}>
            Next: Task C →
          </Button>
        </Paper>
      )}
    </Box>
  )
}
