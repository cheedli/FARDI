import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 5 SubPhase 2 Step 4 - Level A2 - Task C: Sentence Builder
 * Write 6 simple instructions for volunteers
 */

const EXPECTED_SENTENCES = [
  'Please welcome.',
  'First check ticket.',
  'Then guide.',
  'Be careful.',
  'Help people.',
  'Thank you.'
]

export default function Phase5SubPhase2Step4RemedialA2TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 4, interaction: 3, context: 'remedial_a2' })
  const [sentences, setSentences] = useState(['', '', '', '', '', ''])
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSentenceChange = (index, value) => {
    const newSentences = [...sentences]
    newSentences[index] = value
    setSentences(newSentences)
  }

  const calculateScore = () => {
    let correctCount = 0
    sentences.forEach((sentence, index) => {
      const userLower = sentence.toLowerCase().trim()
      const expectedLower = EXPECTED_SENTENCES[index].toLowerCase().trim()
      const expectedWords = expectedLower.split(' ')
      const matches = expectedWords.filter(word => userLower.includes(word)).length
      if (matches >= expectedWords.length * 0.6) {
        correctCount++
      }
    })
    return correctCount
  }

  const handleSubmit = async () => {
    const finalScore = calculateScore()
    setScore(finalScore)
    setSubmitted(true)
    sessionStorage.setItem('phase5_subphase2_step4_remedial_a2_taskC_score', finalScore.toString())

    try {
      await phase5API.logRemedialActivity(4, 'A2', 'C', finalScore, 6, 2) // step 4, subphase 2
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/2/step/5')
  }

  const allFilled = sentences.every(s => s.trim().length > 0)

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>SubPhase 2 Step 4: Remedial Practice - Level A2</Typography>
        <Typography variant="h6" gutterBottom>Task C: Sentence Builder</Typography>
        <Typography variant="body1">Write 6 simple instructions for volunteers</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Sentence Builder! Write 6 very simple instructions for volunteers. Use the examples as a guide!" />
      </Paper>

      {!submitted ? (
        <>
          <Stack spacing={2} sx={{ mb: 3 }}>
            {EXPECTED_SENTENCES.map((example, index) => (
              <Paper key={index} elevation={1} sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>Example: "{example}"</Typography>
                <TextField fullWidth variant="outlined" placeholder={`Write instruction ${index + 1}...`} value={sentences[index]} onChange={(e) => handleSentenceChange(index, e.target.value)} disabled={submitted} />
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
            <Button variant="contained" color="success" onClick={handleContinue} size="large">Continue to Step 5 →</Button>
          </Stack>
        </>
      )}
    </Box>
  )
}
