import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 5 SubPhase 2 Step 5 - Remedial C1 - Task D: Critique Game
 * Critique/fix 6 advanced error types in volunteer instructions
 */

const ERRORS = [
  { error: 'Impolite tone', critique: 'Reduces cooperation', fix: 'Add please/thank you' },
  { error: 'No sequencing', critique: 'Confuses order', fix: 'Use first/then/next' },
  { error: 'Vague safety', critique: 'Risks accidents', fix: 'Be specific' },
  { error: 'No empathy', critique: 'Feels cold', fix: 'Show understanding' },
  { error: 'Missing appreciation', critique: 'Low motivation', fix: 'Thank volunteers' },
  { error: 'Overly complex', critique: 'Confuses non-natives', fix: 'Simplify language' }
]

export default function Phase5SubPhase2Step5RemedialC1TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 5, interaction: 4, context: 'remedial_c1' })
  const [critiques, setCritiques] = useState(Array(6).fill(''))
  const [fixes, setFixes] = useState(Array(6).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleCritiqueChange = (index, value) => {
    const newCritiques = [...critiques]
    newCritiques[index] = value
    setCritiques(newCritiques)
  }

  const handleFixChange = (index, value) => {
    const newFixes = [...fixes]
    newFixes[index] = value
    setFixes(newFixes)
  }

  const handleSubmit = async () => {
    let correctCount = 0
    ERRORS.forEach((error, idx) => {
      const critiqueWords = critiques[idx].trim().split(/\s+/).filter(w => w.length > 0)
      const fixWords = fixes[idx].trim().split(/\s+/).filter(w => w.length > 0)
      if (critiqueWords.length >= 6 && fixWords.length >= 4) correctCount++
    })

    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_subphase2_step5_remedial_c1_taskD_score', correctCount.toString())

    try {
      await phase5API.logRemedialActivity(5, 'C1', 'D', correctCount, 6, 2) // step 5, subphase 2
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/2/step/5/score')
  }

  const allFilled = critiques.every(c => c.trim()) && fixes.every(f => f.trim())

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>SubPhase 2 Step 5: Remedial Practice - Level C1</Typography>
        <Typography variant="h6" gutterBottom>Task D: Critique Game</Typography>
        <Typography variant="body1">Critique/fix 6 advanced error types in volunteer instructions. Nuanced critiques!</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Critique Game! For each error type, write a nuanced critique (at least 6 words) and suggest a sophisticated fix (at least 4 words). Use advanced language!" />
      </Paper>

      {!submitted ? (
        <>
          <Stack spacing={3} sx={{ mb: 3 }}>
            {ERRORS.map((error, idx) => (
              <Paper key={idx} elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom><strong>{error.error}</strong></Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Example critique: "{error.critique}" | Example fix: "{error.fix}"</Typography>
                <TextField fullWidth multiline rows={2} label="Your critique (at least 6 words)" variant="outlined" value={critiques[idx]} onChange={(e) => handleCritiqueChange(idx, e.target.value)} sx={{ mb: 2 }} />
                <TextField fullWidth multiline rows={2} label="Your fix (at least 4 words)" variant="outlined" value={fixes[idx]} onChange={(e) => handleFixChange(idx, e.target.value)} />
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
