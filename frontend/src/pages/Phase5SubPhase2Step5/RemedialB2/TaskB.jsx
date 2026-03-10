import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Stack, Alert } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 5 SubPhase 2 Step 5 - Remedial B2 - Task B: Analysis Odyssey
 * Fully correct/rewrite 8-sentence faulty volunteer instructions
 */

const FAULTY_TEXT = 'Welcom gests. Chek ticket. Guied to booth. Be cairful. Help peoples. Thankk you. Smyle. Good job.'

const CORRECTED_EXAMPLE = `First, please warmly welcome guests: "Welcome to the Global Cultures Festival!" Then, politely check their tickets or registration. Next, guide them clearly to the correct booth or area. Be careful and safety-conscious with queues and pathways. Offer help if guests have questions. Thank each person for coming and for their cooperation. Smile and stay positive - your friendly attitude makes a big difference. You are doing a great job!`

export default function Phase5SubPhase2Step5RemedialB2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 5, interaction: 2, context: 'remedial_b2' })
  const [correctedText, setCorrectedText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    // Evaluate: should have 8+ sentences, coherent, polite, sequenced
    const sentences = correctedText.trim().split(/[.!?]+/).filter(s => s.trim().length > 0)
    let correctCount = 0
    if (sentences.length >= 8) correctCount++
    if (correctedText.toLowerCase().includes('please') || correctedText.toLowerCase().includes('thank')) correctCount++
    if (correctedText.toLowerCase().includes('first') || correctedText.toLowerCase().includes('then') || correctedText.toLowerCase().includes('next')) correctCount++

    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_subphase2_step5_remedial_b2_taskB_score', correctCount.toString())

    try {
      await phase5API.logRemedialActivity(5, 'B2', 'B', correctCount, 3, 2) // step 5, subphase 2
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/2/step/5/remedial/b2/task/c')
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>SubPhase 2 Step 5: Remedial Practice - Level B2</Typography>
        <Typography variant="h6" gutterBottom>Task B: Analysis Odyssey</Typography>
        <Typography variant="body1">Fully correct/rewrite 8-sentence faulty volunteer instructions. Coherent B2-level rewrite!</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Analysis Odyssey! Rewrite the faulty instructions completely. Make them coherent, polite, sequenced, and clear. Write at least 8 sentences!" />
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
          <TextField fullWidth multiline rows={10} variant="outlined" label="Your Corrected Version (at least 8 sentences)" placeholder="First, please warmly welcome guests..." value={correctedText} onChange={(e) => setCorrectedText(e.target.value)} sx={{ mb: 2 }} />
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
