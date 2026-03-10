import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Stack, Alert, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 5 SubPhase 2 Step 2 - Remedial C1 - Task D: Critique Game
 * Critique 6 instructional approaches
 */

const APPROACHES = [
  { id: 1, issue: 'Impolite tone', critique: 'Reduces cooperation', fix: 'Add please/thank you' },
  { id: 2, issue: 'No sequencing', critique: 'Confuses order', fix: 'Use first/then' },
  { id: 3, issue: 'Vague safety', critique: 'Risks accidents', fix: 'Be specific' },
  { id: 4, issue: 'No empathy', critique: 'Feels cold', fix: 'Show understanding' },
  { id: 5, issue: 'Missing appreciation', critique: 'Low motivation', fix: 'Thank volunteers' },
  { id: 6, issue: 'Overly complex', critique: 'Confuses non-natives', fix: 'Simplify language' }
]

export default function Phase5SubPhase2Step2RemedialC1TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 2, interaction: 4, context: 'remedial_c1' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [critiques, setCritiques] = useState(Array(6).fill(''))
  const [fixes, setFixes] = useState(Array(6).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleCritiqueChange = (value) => {
    const newCritiques = [...critiques]
    newCritiques[currentIndex] = value
    setCritiques(newCritiques)
  }

  const handleFixChange = (value) => {
    const newFixes = [...fixes]
    newFixes[currentIndex] = value
    setFixes(newFixes)
  }

  const handleNext = () => {
    if (currentIndex < 5) setCurrentIndex(currentIndex + 1)
  }

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
  }

  const handleSubmit = async () => {
    // Evaluate: critique should contain key words from expected critique, fix should contain key words from expected fix
    let correctCount = 0
    APPROACHES.forEach((approach, idx) => {
      const critiqueLower = critiques[idx]?.toLowerCase() || ''
      const fixLower = fixes[idx]?.toLowerCase() || ''
      const expectedCritiqueWords = approach.critique.toLowerCase().split(' ')
      const expectedFixWords = approach.fix.toLowerCase().split(' ')
      
      const hasCritiqueKeyWords = expectedCritiqueWords.some(word => critiqueLower.includes(word))
      const hasFixKeyWords = expectedFixWords.some(word => fixLower.includes(word))
      
      if (hasCritiqueKeyWords && hasFixKeyWords) correctCount++
    })

    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_subphase2_step2_remedial_c1_taskD_score', correctCount.toString())

    try {
      await phase5API.logRemedialActivity(2, 'C1', 'D', correctCount, 6, 2) // step 2, subphase 2
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/2/step/3')
  }

  const progress = ((currentIndex + 1) / 6) * 100

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>SubPhase 2 Step 2: Remedial Practice - Level C1</Typography>
        <Typography variant="h6" gutterBottom>Task D: Critique Game</Typography>
        <Typography variant="body1">Critique 6 instructional approaches. Show nuanced analysis and problem-solving!</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Critique Game! For each instructional approach issue, write a critique explaining the problem and suggest a fix. Show your advanced analytical skills!" />
      </Paper>

      {!submitted ? (
        <>
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Approach {currentIndex + 1} of 6</Typography>
              <Typography variant="body2" color="primary" fontWeight="bold">{Math.round(progress)}% Complete</Typography>
            </Box>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 1 }} />
          </Paper>

          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Issue: {APPROACHES[currentIndex].issue}
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2"><strong>Expected Critique:</strong> {APPROACHES[currentIndex].critique}</Typography>
              <Typography variant="body2"><strong>Expected Fix:</strong> {APPROACHES[currentIndex].fix}</Typography>
            </Alert>
            
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Your Critique"
              variant="outlined"
              placeholder="Explain the problem..."
              value={critiques[currentIndex]}
              onChange={(e) => handleCritiqueChange(e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Your Fix"
              variant="outlined"
              placeholder="Suggest a solution..."
              value={fixes[currentIndex]}
              onChange={(e) => handleFixChange(e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Button variant="outlined" onClick={handlePrevious} disabled={currentIndex === 0}>← Previous</Button>
              {currentIndex === 5 ? (
                <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!critiques[currentIndex] || !fixes[currentIndex]}>
                  Submit All
                </Button>
              ) : (
                <Button variant="contained" color="primary" onClick={handleNext} disabled={!critiques[currentIndex] || !fixes[currentIndex]}>
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
            <Button variant="contained" color="success" onClick={handleContinue} size="large">Continue to Step 3 →</Button>
          </Stack>
        </>
      )}
    </Box>
  )
}
