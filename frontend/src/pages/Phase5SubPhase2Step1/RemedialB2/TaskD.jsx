import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Stack, Alert, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 5 SubPhase 2 Step 1 - Remedial B2 - Task D: Spelling & Explain
 * Spell and explain 6 instruction words
 */

const TERMS = [
  { id: 1, term: 'please', explanation: 'Polite request' },
  { id: 2, term: 'thank you', explanation: 'Show thanks' },
  { id: 3, term: 'careful', explanation: 'Be safe' },
  { id: 4, term: 'guide', explanation: 'Show way' },
  { id: 5, term: 'welcome', explanation: 'Greet nicely' },
  { id: 6, term: 'queue', explanation: 'Line of people' }
]

export default function Phase5SubPhase2Step1RemedialB2TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 1, interaction: 4, context: 'remedial_b2' })
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

  const handleNext = () => {
    if (currentIndex < 5) setCurrentIndex(currentIndex + 1)
  }

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
  }

  const handleSubmit = async () => {
    // Evaluate: spelling must match exactly (case-insensitive), explanation should contain key words
    let correctCount = 0
    TERMS.forEach((term, idx) => {
      const spellingMatch = spellings[idx]?.toLowerCase().trim() === term.term.toLowerCase()
      const explanationLower = explanations[idx]?.toLowerCase() || ''
      const hasKeyWords = term.explanation.toLowerCase().split(' ').some(word => 
        explanationLower.includes(word)
      )
      if (spellingMatch && hasKeyWords) correctCount++
    })

    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_subphase2_step1_remedial_b2_taskD_score', correctCount.toString())

    try {
      await phase5API.logRemedialActivity(1, 'B2', 'D', correctCount, 6, 2) // subphase 2
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/2/step/2')
  }

  const progress = ((currentIndex + 1) / 6) * 100

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>SubPhase 2 Step 1: Remedial Practice - Level B2</Typography>
        <Typography variant="h6" gutterBottom>Task D: Spelling & Explain</Typography>
        <Typography variant="body1">Spell and explain 6 instruction words. Show your understanding!</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Spelling & Explain! For each term, spell it correctly and write an explanation of what it means. Use the example explanations as a guide!" />
      </Paper>

      {!submitted ? (
        <>
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Term {currentIndex + 1} of 6</Typography>
              <Typography variant="body2" color="primary" fontWeight="bold">{Math.round(progress)}% Complete</Typography>
            </Box>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 1 }} />
          </Paper>

          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Term {currentIndex + 1}: {TERMS[currentIndex].term}
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2"><strong>Example Explanation:</strong> {TERMS[currentIndex].explanation}</Typography>
            </Alert>
            
            <TextField
              fullWidth
              label="Spell the word"
              variant="outlined"
              value={spellings[currentIndex]}
              onChange={(e) => handleSpellingChange(e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Explain what it means"
              variant="outlined"
              value={explanations[currentIndex]}
              onChange={(e) => handleExplanationChange(e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Button variant="outlined" onClick={handlePrevious} disabled={currentIndex === 0}>← Previous</Button>
              {currentIndex === 5 ? (
                <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!spellings[currentIndex] || !explanations[currentIndex]}>
                  Submit All
                </Button>
              ) : (
                <Button variant="contained" color="primary" onClick={handleNext} disabled={!spellings[currentIndex] || !explanations[currentIndex]}>
                  Next →</Button>
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
            <Button variant="contained" color="success" onClick={handleContinue} size="large">Continue to Step 2 →</Button>
          </Stack>
        </>
      )}
    </Box>
  )
}
