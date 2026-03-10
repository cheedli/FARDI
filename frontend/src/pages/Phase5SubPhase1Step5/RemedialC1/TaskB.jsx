import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Stack, Alert } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const FAULTY_TEXT = 'Lighting fail bad. We fix soon but maybe delay. Announce now. Backup use but not sure work. Thank patience. Festival maybe ok. Update later. Sorry issue.'

const CORRECTED_EXAMPLE = 'A temporary technical malfunction has affected the main stage lighting system. Our response team has promptly engaged the contingency protocol, with the backup array now deployed-restoration is anticipated within 20-25 minutes. We are communicating this transparently to eliminate uncertainty. While minor delays are possible, the festival program remains fundamentally intact. We sincerely thank you for your patience and understanding during this brief interruption. We remain fully committed to delivering the high-quality experience you expect. Further updates will be provided in real time. We apologize for any inconvenience and appreciate your continued support.'

export default function Phase5Step5RemedialC1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 5, interaction: 2, context: 'remedial_c1' })
  const [correctedText, setCorrectedText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    const words = correctedText.trim().split(/\s+/).filter(w => w.length > 0)
    const wordCount = words.length
    const hasAdvancedVocab = ['malfunction', 'contingency', 'protocol', 'deployed', 'anticipated', 'transparently', 'fundamentally', 'committed', 'stakeholder'].some(word => correctedText.toLowerCase().includes(word))
    const hasPolite = ['sincerely', 'appreciate', 'apologize', 'patience', 'understanding', 'value'].some(word => correctedText.toLowerCase().includes(word))
    const hasCoherence = ['while', 'with', 'furthermore', 'however', 'therefore', 'meanwhile'].some(word => correctedText.toLowerCase().includes(word))
    const hasTimeline = ['within', 'minutes', 'anticipated', 'expected', 'shortly'].some(word => correctedText.toLowerCase().includes(word))

    let correctCount = 0
    if (wordCount >= 80) correctCount++
    if (hasAdvancedVocab) correctCount++
    if (hasPolite) correctCount++
    if (hasCoherence) correctCount++
    if (hasTimeline) correctCount++
    if (correctedText.split(/[.!?]+/).filter(s => s.trim().length > 0).length >= 6) correctCount++

    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_step5_remedial_c1_taskB_score', correctCount.toString())
    try {
      await phase5API.logRemedialActivity(5, 'C1', 'B', correctCount, 6, 0)
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/1/step/5/remedial/c1/task/c')
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>Step 5: Remedial Practice - Level C1</Typography>
        <Typography variant="h6" gutterBottom>Task B: Analysis Odyssey</Typography>
        <Typography variant="body1">Fully correct/rewrite 8-sentence faulty crisis message with C1 sophistication</Typography>
      </Paper>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Welcome! Fully rewrite the faulty crisis message with C1-level sophistication, strategic tone, and nuanced language!" />
      </Paper>
      {!submitted ? (
        <>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="error">Faulty Text:</Typography>
            <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic' }}>"{FAULTY_TEXT}"</Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2"><strong>Example corrected version:</strong> {CORRECTED_EXAMPLE}</Typography>
            </Alert>
            <TextField fullWidth multiline rows={12} variant="outlined" label="Your Sophisticated Corrected/Enhanced Text" placeholder="Write your C1-level corrected and enhanced version here (8+ sentences, 80+ words, advanced vocabulary)..." value={correctedText} onChange={(e) => setCorrectedText(e.target.value)} sx={{ mb: 2 }} />
            <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!correctedText.trim()} size="large" fullWidth>Submit</Button>
          </Paper>
        </>
      ) : (
        <>
          <Paper elevation={3} sx={{ p: 4, mb: 3, backgroundColor: 'success.lighter', textAlign: 'center' }}>
            <Typography variant="h5" color="success.dark" gutterBottom>✓ Task B Complete!</Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>Score: {score} / 6</Typography>
          </Paper>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="contained" color="success" onClick={handleContinue} size="large">Next: Task C →</Button>
          </Stack>
        </>
      )}
    </Box>
  )
}
