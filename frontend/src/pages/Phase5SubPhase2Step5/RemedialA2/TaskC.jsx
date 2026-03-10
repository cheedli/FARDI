import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 5 SubPhase 2 Step 5 - Level A2 - Task C: Sentence Builder
 * Correct 6 grammar mistakes in simple instructions
 */

const FAULTY_SENTENCES = [
  { faulty: 'Pleese welcom.', correct: 'Please welcome.' },
  { faulty: 'Furst chek.', correct: 'First check.' },
  { faulty: 'Then guied.', correct: 'Then guide.' },
  { faulty: 'Be cairful.', correct: 'Be careful.' },
  { faulty: 'Thankk you.', correct: 'Thank you.' },
  { faulty: 'Help peoples.', correct: 'Help people.' }
]

export default function Phase5SubPhase2Step5RemedialA2TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 5, interaction: 3, context: 'remedial_a2' })
  const [corrections, setCorrections] = useState(['', '', '', '', '', ''])
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
      if (userLower === expectedLower) correctCount++
    })
    return correctCount
  }

  const handleSubmit = async () => {
    const finalScore = calculateScore()
    setScore(finalScore)
    setSubmitted(true)
    sessionStorage.setItem('phase5_subphase2_step5_remedial_a2_taskC_score', finalScore.toString())

    try {
      await phase5API.logRemedialActivity(5, 'A2', 'C', finalScore, 6, 2) // step 5, subphase 2
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/2/step/5/score')
  }

  const allFilled = corrections.every(c => c.trim().length > 0)

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>SubPhase 2 Step 5: Remedial Practice - Level A2</Typography>
        <Typography variant="h6" gutterBottom>Task C: Sentence Builder</Typography>
        <Typography variant="body1">Correct 6 grammar mistakes in simple instructions</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Sentence Builder! Correct the grammar mistakes in each faulty sentence. Write the correct version!" />
      </Paper>

      {!submitted ? (
        <>
          <Stack spacing={2} sx={{ mb: 3 }}>
            {FAULTY_SENTENCES.map((item, index) => (
              <Paper key={index} elevation={1} sx={{ p: 2 }}>
                <Typography variant="body2" color="error" gutterBottom><strong>Faulty:</strong> {item.faulty}</Typography>
                <TextField fullWidth variant="outlined" placeholder="Write correct sentence..." value={corrections[index]} onChange={(e) => handleCorrectionChange(index, e.target.value)} disabled={submitted} />
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
            <Button variant="contained" color="success" onClick={handleContinue} size="large">Continue to Score Calculation →</Button>
          </Stack>
        </>
      )}
    </Box>
  )
}
