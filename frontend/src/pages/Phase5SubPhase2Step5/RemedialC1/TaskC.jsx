import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 5 SubPhase 2 Step 5 - Remedial C1 - Task C: Advanced Quiz
 * Identify/fix errors in 6 complex instruction sentences
 */

const QUESTIONS = [
  { id: 1, faulty: 'Pleese welcom', errorType: 'Spelling', correct: 'Please welcome' },
  { id: 2, faulty: 'Furst chek tiket', errorType: 'Spelling & structure', correct: 'First, check the ticket' },
  { id: 3, faulty: 'No sequencing', errorType: 'Structure', correct: 'Add first/then/next' },
  { id: 4, faulty: 'No politeness', errorType: 'Tone', correct: 'Add please/thank you' },
  { id: 5, faulty: 'Vague safety', errorType: 'Clarity', correct: 'Be specific about safety' },
  { id: 6, faulty: 'No empathy', errorType: 'Tone', correct: 'Show understanding and empathy' }
]

export default function Phase5SubPhase2Step5RemedialC1TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 5, interaction: 3, context: 'remedial_c1' })
  const [corrections, setCorrections] = useState(Array(6).fill(''))
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
      const expectedLower = QUESTIONS[index].correct.toLowerCase().trim()
      // Check if key words match (at least 50% match for C1)
      const expectedWords = expectedLower.split(' ')
      const matches = expectedWords.filter(word => userLower.includes(word)).length
      if (matches >= expectedWords.length * 0.5) correctCount++
    })
    return correctCount
  }

  const handleSubmit = async () => {
    const finalScore = calculateScore()
    setScore(finalScore)
    setSubmitted(true)
    sessionStorage.setItem('phase5_subphase2_step5_remedial_c1_taskC_score', finalScore.toString())

    try {
      await phase5API.logRemedialActivity(5, 'C1', 'C', finalScore, 6, 2) // step 5, subphase 2
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/2/step/5/remedial/c1/task/d')
  }

  const allFilled = corrections.every(c => c.trim().length > 0)

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>SubPhase 2 Step 5: Remedial Practice - Level C1</Typography>
        <Typography variant="h6" gutterBottom>Task C: Advanced Quiz</Typography>
        <Typography variant="body1">Identify/fix errors in 6 complex instruction sentences. Detailed answers!</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Advanced Quiz! For each error, identify the error type and provide a detailed fix. Use sophisticated language!" />
      </Paper>

      {!submitted ? (
        <>
          <Stack spacing={2} sx={{ mb: 3 }}>
            {QUESTIONS.map((q, index) => (
              <Paper key={q.id} elevation={1} sx={{ p: 2 }}>
                <Typography variant="body2" color="error" gutterBottom><strong>Error:</strong> {q.faulty} ({q.errorType})</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Example fix: "{q.correct}"</Typography>
                <TextField fullWidth variant="outlined" placeholder="Write your detailed fix..." value={corrections[index]} onChange={(e) => handleCorrectionChange(index, e.target.value)} disabled={submitted} />
              </Paper>
            ))}
          </Stack>
          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!allFilled} size="large" fullWidth>Submit Answers</Button>
        </>
      ) : (
        <>
          <Paper elevation={3} sx={{ p: 4, mb: 3, backgroundColor: 'success.lighter', textAlign: 'center' }}>
            <Typography variant="h5" color="success.dark" gutterBottom>✓ Task C Complete!</Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>Score: {score} / 6</Typography>
          </Paper>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="contained" color="success" onClick={handleContinue} size="large">Next: Task D →</Button>
          </Stack>
        </>
      )}
    </Box>
  )
}
