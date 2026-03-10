import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Stack, Alert } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 5 SubPhase 2 Step 5 - Remedial C1 - Task B: Analysis Odyssey
 * Fully correct/rewrite 8-sentence faulty volunteer instructions
 */

const FAULTY_TEXT = 'Welcom. Chek tiket. Guied. Be cairful. Help. Thank. Smyle. Good.'

const CORRECTED_EXAMPLE = `Begin each interaction with a warm, inclusive greeting: "Welcome to the Global Cultures Festival - we are delighted you are here!" Next, politely verify entry (tickets/registration) while maintaining eye contact and a friendly tone. Then, guide guests clearly to the appropriate booth or area, providing brief orientation if needed. Throughout, prioritize safety by reminding people to be careful with queues and pathways. Should questions arise, respond with patience and empathy. Conclude every interaction with sincere appreciation: "Thank you for joining us - enjoy the celebration!" This sequence ensures clarity, warmth, professionalism, and safety for everyone.`

export default function Phase5SubPhase2Step5RemedialC1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 5, interaction: 2, context: 'remedial_c1' })
  const [correctedText, setCorrectedText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    // Evaluate: should have 8+ sentences, sophisticated C1 language, coherent
    const sentences = correctedText.trim().split(/[.!?]+/).filter(s => s.trim().length > 0)
    let correctCount = 0
    if (sentences.length >= 8) correctCount++
    const words = correctedText.trim().split(/\s+/).filter(w => w.length > 0)
    if (words.length >= 100) correctCount++ // C1 should be sophisticated
    if (correctedText.toLowerCase().includes('warm') || correctedText.toLowerCase().includes('inclusive') || correctedText.toLowerCase().includes('empathy')) correctCount++

    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_subphase2_step5_remedial_c1_taskB_score', correctCount.toString())

    try {
      await phase5API.logRemedialActivity(5, 'C1', 'B', correctCount, 3, 2) // step 5, subphase 2
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/2/step/5/remedial/c1/task/c')
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>SubPhase 2 Step 5: Remedial Practice - Level C1</Typography>
        <Typography variant="h6" gutterBottom>Task B: Analysis Odyssey</Typography>
        <Typography variant="body1">Fully correct/rewrite 8-sentence faulty volunteer instructions. Sophisticated C1-level rewrite!</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Analysis Odyssey! Rewrite the faulty instructions completely using sophisticated C1-level language. Make them professional, empathetic, and coherent!" />
      </Paper>

      {!submitted ? (
        <>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight="bold">Faulty Text:</Typography>
            <Typography variant="body2" component="pre" sx={{ mt: 1, fontFamily: 'monospace' }}>{FAULTY_TEXT}</Typography>
          </Alert>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2"><strong>Example corrected version:</strong></Typography>
            <Typography variant="body2" component="pre" sx={{ mt: 1, fontFamily: 'monospace', fontSize: '0.85rem' }}>{CORRECTED_EXAMPLE}</Typography>
          </Alert>
          <TextField fullWidth multiline rows={12} variant="outlined" label="Your Sophisticated Corrected Version (at least 8 sentences, 100+ words)" placeholder="Begin each interaction with a warm, inclusive greeting..." value={correctedText} onChange={(e) => setCorrectedText(e.target.value)} sx={{ mb: 2 }} />
          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!correctedText.trim()} size="large" fullWidth>Submit Correction</Button>
        </>
      ) : (
        <>
          <Paper elevation={3} sx={{ p: 4, mb: 3, backgroundColor: 'success.lighter', textAlign: 'center' }}>
            <Typography variant="h5" color="success.dark" gutterBottom>✓ Task B Complete!</Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>Score: {score} / 3</Typography>
          </Paper>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="contained" color="success" onClick={handleContinue} size="large">Next: Task C →</Button>
          </Stack>
        </>
      )}
    </Box>
  )
}
