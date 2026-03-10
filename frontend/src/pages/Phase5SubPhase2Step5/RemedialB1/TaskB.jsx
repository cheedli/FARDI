import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 5 SubPhase 2 Step 5 - Remedial B1 - Task B: Definition Duel
 * Correct 8 faulty sentences for coherence/vocabulary/tone
 */

const FAULTY_SENTENCES = [
  { faulty: 'Welcom gests.', correct: 'Please welcome guests.' },
  { faulty: 'Furst chek ticket.', correct: 'First, check the ticket.' },
  { faulty: 'Then guied.', correct: 'Then, guide them.' },
  { faulty: 'Be cairful.', correct: 'Be careful.' },
  { faulty: 'Help peoples.', correct: 'Help people politely.' },
  { faulty: 'Thankk you.', correct: 'Thank you for helping.' },
  { faulty: 'Smyle.', correct: 'Please smile.' },
  { faulty: 'Good job.', correct: 'You are doing a good job!' }
]

export default function Phase5SubPhase2Step5RemedialB1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 5, interaction: 2, context: 'remedial_b1' })
  const [corrections, setCorrections] = useState(Array(8).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleCorrectionChange = (index, value) => {
    const newCorrections = [...corrections]
    newCorrections[index] = value
    setCorrections(newCorrections)
  }

  const calculateScore = () => {
    let correctCount = 0
    corrections.forEach((correction, index) => {
      const userLower = correction.toLowerCase().trim()
      const expectedLower = FAULTY_SENTENCES[index].correct.toLowerCase().trim()
      // Check if key words match (at least 60% match)
      const expectedWords = expectedLower.split(' ')
      const matches = expectedWords.filter(word => userLower.includes(word)).length
      if (matches >= expectedWords.length * 0.6) correctCount++
    })
    return correctCount
  }

  const handleSubmit = async () => {
    const finalScore = calculateScore()
    setScore(finalScore)
    setSubmitted(true)
    sessionStorage.setItem('phase5_subphase2_step5_remedial_b1_taskB_score', finalScore.toString())

    try {
      await phase5API.logRemedialActivity(5, 'B1', 'B', finalScore, 8, 2) // step 5, subphase 2
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/2/step/5/remedial/b1/task/c')
  }

  const allFilled = corrections.every(c => c.trim().length > 0)

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>SubPhase 2 Step 5: Remedial Practice - Level B1</Typography>
        <Typography variant="h6" gutterBottom>Task B: Definition Duel</Typography>
        <Typography variant="body1">Correct 8 faulty sentences for coherence/vocabulary/tone. Duel with corrections for wins!</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Definition Duel! Correct each faulty sentence. Make them coherent, use better vocabulary, and add polite tone!" />
      </Paper>

      {!submitted ? (
        <>
          <Stack spacing={2} sx={{ mb: 3 }}>
            {FAULTY_SENTENCES.map((item, index) => (
              <Paper key={index} elevation={1} sx={{ p: 2 }}>
                <Typography variant="body2" color="error" gutterBottom><strong>Faulty:</strong> {item.faulty}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Example: "{item.correct}"</Typography>
                <TextField fullWidth variant="outlined" placeholder="Write corrected sentence..." value={corrections[index]} onChange={(e) => handleCorrectionChange(index, e.target.value)} disabled={submitted} />
              </Paper>
            ))}
          </Stack>
          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!allFilled} size="large" fullWidth>Submit Answers</Button>
        </>
      ) : (
        <>
          <Paper elevation={3} sx={{ p: 4, mb: 3, backgroundColor: 'success.lighter', textAlign: 'center' }}>
            <Typography variant="h5" color="success.dark" gutterBottom>✓ Task B Complete!</Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>Score: {score} / 8</Typography>
          </Paper>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="contained" color="success" onClick={handleContinue} size="large">Next: Task C →</Button>
          </Stack>
        </>
      )}
    </Box>
  )
}
