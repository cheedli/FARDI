import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 5 SubPhase 2 Step 5 - Level A2 - Task A: Spelling Rescue
 * Match 8 common spelling mistakes to corrections
 */

const MATCHING_PAIRS = [
  { mistake: 'pleese', correction: 'please' },
  { mistake: 'thak you', correction: 'thank you' },
  { mistake: 'furst', correction: 'first' },
  { mistake: 'thenn', correction: 'then' },
  { mistake: 'cairful', correction: 'careful' },
  { mistake: 'guied', correction: 'guide' },
  { mistake: 'welcom', correction: 'welcome' },
  { mistake: 'que', correction: 'queue' }
]

const CORRECTIONS = MATCHING_PAIRS.map(p => p.correction)

export default function Phase5SubPhase2Step5RemedialA2TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 5, interaction: 1, context: 'remedial_a2' })
  const [matches, setMatches] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleMatch = (mistake, correction) => {
    setMatches(prev => ({ ...prev, [mistake]: correction }))
  }

  const handleSubmit = async () => {
    let correctCount = 0
    MATCHING_PAIRS.forEach(pair => {
      if (matches[pair.mistake] === pair.correction) correctCount++
    })

    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_subphase2_step5_remedial_a2_taskA_score', correctCount.toString())

    try {
      await phase5API.logRemedialActivity(5, 'A2', 'A', correctCount, 8, 2) // step 5, subphase 2
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/2/step/5/remedial/a2/task/b')
  }

  const allMatched = Object.keys(matches).length === MATCHING_PAIRS.length

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>SubPhase 2 Step 5: Remedial Practice - Level A2</Typography>
        <Typography variant="h6" gutterBottom>Task A: Spelling Rescue</Typography>
        <Typography variant="body1">Match 8 common spelling mistakes to corrections in volunteer instructions</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Spelling Rescue! Match each spelling mistake to its correct spelling. Complete all matches to rescue the instructions!" />
      </Paper>

      {!submitted ? (
        <>
          <Stack spacing={3} sx={{ mb: 3 }}>
            {MATCHING_PAIRS.map((pair, idx) => (
              <Paper key={idx} elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom><strong>{pair.mistake}</strong> → ?</Typography>
                <FormControl component="fieldset">
                  <RadioGroup value={matches[pair.mistake] || ''} onChange={(e) => handleMatch(pair.mistake, e.target.value)}>
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
            <Typography variant="h5" color="success.dark" gutterBottom>✓ Task A Complete!</Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>Score: {score} / 8</Typography>
          </Paper>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="contained" color="success" onClick={handleContinue} size="large">Next: Task B →</Button>
          </Stack>
        </>
      )}
    </Box>
  )
}
