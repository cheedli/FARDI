import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Stack, Alert } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const FAULTY_TEXT = 'Lights problem bad. We fix soon. Announce people now. Backup use. Thank you wait. Festival ok. Update later. Sorry problem.'

const CORRECTED_EXAMPLE = 'A technical lighting issue has occurred on the main stage. Our team is actively working on a resolution and expects to restore full lighting shortly. We are announcing this immediately to keep everyone informed. The backup system is being used as a temporary measure. Thank you for your patience while we address this. The festival remains on schedule. We will provide further updates as soon as possible. We sincerely apologize for any inconvenience.'

export default function Phase5Step5RemedialB2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 5, interaction: 2, context: 'remedial_b2' })
  const [correctedText, setCorrectedText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    const words = correctedText.trim().split(/\s+/).filter(w => w.length > 0)
    const wordCount = words.length
    const hasPolite = ['thank', 'appreciate', 'sincerely', 'apologize', 'patience'].some(word => correctedText.toLowerCase().includes(word))
    const hasVocab = ['technical', 'issue', 'resolution', 'restore', 'temporary', 'measure'].some(word => correctedText.toLowerCase().includes(word))
    const hasCoherence = ['while', 'and', 'as', 'this', 'that'].some(word => correctedText.toLowerCase().includes(word))

    let correctCount = 0
    if (wordCount >= 50) correctCount++
    if (hasPolite) correctCount++
    if (hasVocab) correctCount++
    if (hasCoherence) correctCount++
    if (correctedText.split(/[.!?]+/).filter(s => s.trim().length > 0).length >= 6) correctCount++

    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_step5_remedial_b2_taskB_score', correctCount.toString())
    try {
      await phase5API.logRemedialActivity(5, 'B2', 'B', correctCount, 5, 0)
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/1/step/5/remedial/b2/task/c')
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>Step 5: Remedial Practice - Level B2</Typography>
        <Typography variant="h6" gutterBottom>Task B: Analysis Odyssey</Typography>
        <Typography variant="body1">Fully correct/rewrite 8-sentence faulty crisis message</Typography>
      </Paper>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Welcome! Fully rewrite the faulty crisis message with B2-level coherence, calm tone, and proper structure!" />
      </Paper>
      {!submitted ? (
        <>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="error">Faulty Text:</Typography>
            <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic' }}>"{FAULTY_TEXT}"</Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2"><strong>Example corrected version:</strong> {CORRECTED_EXAMPLE}</Typography>
            </Alert>
            <TextField fullWidth multiline rows={10} variant="outlined" label="Your Corrected/Enhanced Text" placeholder="Write your fully corrected and enhanced version here (8+ sentences, 50+ words)..." value={correctedText} onChange={(e) => setCorrectedText(e.target.value)} sx={{ mb: 2 }} />
            <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!correctedText.trim()} size="large" fullWidth>Submit</Button>
          </Paper>
        </>
      ) : (
        <>
          <Paper elevation={3} sx={{ p: 4, mb: 3, backgroundColor: 'success.lighter', textAlign: 'center' }}>
            <Typography variant="h5" color="success.dark" gutterBottom>✓ Task B Complete!</Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>Score: {score} / 5</Typography>
          </Paper>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="contained" color="success" onClick={handleContinue} size="large">Next: Task C →</Button>
          </Stack>
        </>
      )}
    </Box>
  )
}
