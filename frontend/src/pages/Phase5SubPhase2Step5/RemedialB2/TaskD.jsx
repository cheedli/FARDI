import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 5 SubPhase 2 Step 5 - Remedial B2 - Task D: Spelling & Explain
 * Spell and explain 6 terms
 */

const TERMS = [
  { term: 'please', explanation: 'Polite ask' },
  { term: 'thank you', explanation: 'Say thanks' },
  { term: 'careful', explanation: 'Be safe' },
  { term: 'guide', explanation: 'Show way' },
  { term: 'welcome', explanation: 'Greet' },
  { term: 'queue', explanation: 'Line' }
]

export default function Phase5SubPhase2Step5RemedialB2TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 5, interaction: 4, context: 'remedial_b2' })
  const [spellings, setSpellings] = useState(Array(6).fill(''))
  const [explanations, setExplanations] = useState(Array(6).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSpellingChange = (index, value) => {
    const newSpellings = [...spellings]
    newSpellings[index] = value
    setSpellings(newSpellings)
  }

  const handleExplanationChange = (index, value) => {
    const newExplanations = [...explanations]
    newExplanations[index] = value
    setExplanations(newExplanations)
  }

  const handleSubmit = async () => {
    let correctCount = 0
    TERMS.forEach((term, idx) => {
      const spellingCorrect = spellings[idx].toLowerCase().trim() === term.term.toLowerCase()
      const explanationFilled = explanations[idx].trim().length > 0
      if (spellingCorrect && explanationFilled) correctCount++
    })

    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_subphase2_step5_remedial_b2_taskD_score', correctCount.toString())

    try {
      await phase5API.logRemedialActivity(5, 'B2', 'D', correctCount, 6, 2) // step 5, subphase 2
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/2/step/5/score')
  }

  const allFilled = spellings.every(s => s.trim()) && explanations.every(e => e.trim())

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>SubPhase 2 Step 5: Remedial Practice - Level B2</Typography>
        <Typography variant="h6" gutterBottom>Task D: Spelling & Explain</Typography>
        <Typography variant="body1">Spell and explain 6 instruction terms</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Welcome! Spell each term correctly and write a short explanation. Use the example explanations as a guide!" />
      </Paper>

      {!submitted ? (
        <>
          <Stack spacing={3} sx={{ mb: 3 }}>
            {TERMS.map((term, idx) => (
              <Paper key={idx} elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Term {idx + 1}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Example explanation: "{term.explanation}"</Typography>
                <TextField fullWidth label="Spell the term" variant="outlined" value={spellings[idx]} onChange={(e) => handleSpellingChange(idx, e.target.value)} sx={{ mb: 2 }} />
                <TextField fullWidth multiline rows={2} label="Explain what it means" variant="outlined" value={explanations[idx]} onChange={(e) => handleExplanationChange(idx, e.target.value)} />
              </Paper>
            ))}
          </Stack>
          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!allFilled} size="large" fullWidth>Submit Answers</Button>
        </>
      ) : (
        <>
          <Paper elevation={3} sx={{ p: 4, mb: 3, backgroundColor: 'success.lighter', textAlign: 'center' }}>
            <Typography variant="h5" color="success.dark" gutterBottom>✓ Task D Complete!</Typography>
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
