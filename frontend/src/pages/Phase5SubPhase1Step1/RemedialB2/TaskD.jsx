import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, TextField, Alert } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const TERMS = [
  { term: 'alternative', explanation: 'Another choice' },
  { term: 'urgent', explanation: 'Very important now' },
  { term: 'solution', explanation: 'Way to fix' },
  { term: 'sorry', explanation: 'Apology' },
  { term: 'fix', explanation: 'Solve problem' },
  { term: 'backup', explanation: 'Extra plan' }
]

export default function Phase5Step1RemedialB2TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 1, interaction: 4, context: 'remedial_b2' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [spellings, setSpellings] = useState(Array(6).fill(''))
  const [explanations, setExplanations] = useState(Array(6).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSpellingChange = (value) => {
    const newSpellings = [...spellings]
    newSpellings[currentIndex] = value
    setSpellings(newSpellings)
  }

  const handleExplanationChange = (value) => {
    const newExplanations = [...explanations]
    newExplanations[currentIndex] = value
    setExplanations(newExplanations)
  }

  const handleNext = () => { if (currentIndex < 5) setCurrentIndex(currentIndex + 1) }
  const handlePrevious = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1) }

  const handleSubmit = async () => {
    let correctCount = 0
    TERMS.forEach((term, idx) => {
      const spellingCorrect = spellings[idx].toLowerCase().trim() === term.term.toLowerCase()
      const explanationCorrect = explanations[idx].toLowerCase().includes(term.explanation.toLowerCase().split(' ')[0])
      if (spellingCorrect && explanationCorrect) correctCount++
    })

    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_step1_remedial_b2_taskD_score', correctCount.toString())
    try {
      await phase5API.logRemedialActivity(1, 'B2', 'D', correctCount, 6, 0)
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/1/step/1/remedial/b2/task/e')
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>Step 1: Remedial Practice - Level B2</Typography>
        <Typography variant="h6" gutterBottom>Task D: Spell Quest</Typography>
        <Typography variant="body1">Spell and explain 6 terms</Typography>
      </Paper>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Spell Quest! Spell each term correctly and explain what it means!" />
      </Paper>
      {!submitted ? (
        <>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">Term {currentIndex + 1} of 6</Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2"><strong>Expected explanation:</strong> {TERMS[currentIndex].explanation}</Typography>
            </Alert>
            <TextField fullWidth label="Spell the term" variant="outlined" value={spellings[currentIndex]} onChange={(e) => handleSpellingChange(e.target.value)} sx={{ mb: 2 }} />
            <TextField fullWidth multiline rows={2} label="Explain the term" variant="outlined" value={explanations[currentIndex]} onChange={(e) => handleExplanationChange(e.target.value)} sx={{ mb: 2 }} />
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Button variant="outlined" onClick={handlePrevious} disabled={currentIndex === 0}>← Previous</Button>
              {currentIndex === 5 ? (
                <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!spellings[currentIndex].trim() || !explanations[currentIndex].trim()}>Submit All</Button>
              ) : (
                <Button variant="contained" color="primary" onClick={handleNext} disabled={!spellings[currentIndex].trim() || !explanations[currentIndex].trim()}>Next →</Button>
              )}
            </Stack>
          </Paper>
        </>
      ) : (
        <>
          <Paper elevation={3} sx={{ p: 4, mb: 3, backgroundColor: 'success.lighter', textAlign: 'center' }}>
            <Typography variant="h5" color="success.dark" gutterBottom>✓ Task D Complete!</Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>Score: {score} / 6</Typography>
          </Paper>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="contained" color="success" onClick={handleContinue} size="large">Next: Task E →</Button>
          </Stack>
        </>
      )}
    </Box>
  )
}
