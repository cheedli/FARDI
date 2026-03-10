import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 5 SubPhase 2 Step 5 - Remedial B2 - Task C: Matching Game
 * Match 8 error types to corrections
 */

const ERROR_PAIRS = [
  { error: '"Pleese"', errorType: 'Spelling', correction: 'please' },
  { error: '"Furst"', errorType: 'Spelling', correction: 'first' },
  { error: '"Guied"', errorType: 'Spelling', correction: 'guide' },
  { error: '"Cairful"', errorType: 'Spelling', correction: 'careful' },
  { error: '"Thankk"', errorType: 'Spelling', correction: 'thank' },
  { error: '"Peoples"', errorType: 'Grammar', correction: 'people' },
  { error: 'No sequencing', errorType: 'Structure', correction: 'Add first/then' },
  { error: 'No politeness', errorType: 'Tone', correction: 'Add please/thank you' }
]

const CORRECTIONS = ERROR_PAIRS.map(p => p.correction)

export default function Phase5SubPhase2Step5RemedialB2TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 5, interaction: 3, context: 'remedial_b2' })
  const [matches, setMatches] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleMatch = (error, correction) => {
    setMatches(prev => ({ ...prev, [error]: correction }))
  }

  const handleSubmit = async () => {
    let correctCount = 0
    ERROR_PAIRS.forEach(pair => {
      if (matches[pair.error] === pair.correction) correctCount++
    })

    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_subphase2_step5_remedial_b2_taskC_score', correctCount.toString())

    try {
      await phase5API.logRemedialActivity(5, 'B2', 'C', correctCount, 8, 2) // step 5, subphase 2
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/2/step/5/remedial/b2/task/d')
  }

  const allMatched = Object.keys(matches).length === ERROR_PAIRS.length

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>SubPhase 2 Step 5: Remedial Practice - Level B2</Typography>
        <Typography variant="h6" gutterBottom>Task C: Matching Game</Typography>
        <Typography variant="body1">Match 8 error types to corrections</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Matching Game! Match each error to its correction. Choose the best match!" />
      </Paper>

      {!submitted ? (
        <>
          <Stack spacing={3} sx={{ mb: 3 }}>
            {ERROR_PAIRS.map((pair, idx) => (
              <Paper key={idx} elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom><strong>{pair.error}</strong> ({pair.errorType}) → ?</Typography>
                <FormControl component="fieldset">
                  <RadioGroup value={matches[pair.error] || ''} onChange={(e) => handleMatch(pair.error, e.target.value)}>
                    {CORRECTIONS.map((corr, i) => (
                      <FormControlLabel key={i} value={corr} control={<Radio />} label={corr} />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Paper>
            ))}
          </Stack>
          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!allMatched} size="large" fullWidth>Submit Answers</Button>
        </>
      ) : (
        <>
          <Paper elevation={3} sx={{ p: 4, mb: 3, backgroundColor: 'success.lighter', textAlign: 'center' }}>
            <Typography variant="h5" color="success.dark" gutterBottom>✓ Task C Complete!</Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>Score: {score} / 8</Typography>
          </Paper>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="contained" color="success" onClick={handleContinue} size="large">Next: Task D →</Button>
          </Stack>
        </>
      )}
    </Box>
  )
}
