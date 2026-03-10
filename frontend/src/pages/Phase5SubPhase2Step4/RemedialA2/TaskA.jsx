import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 5 SubPhase 2 Step 4 - Level A2 - Task A: Term Treasure Hunt
 * Match 8 instruction terms to simple definitions/pictures
 */

const MATCHING_PAIRS = [
  { word: 'please', definition: 'Polite word' },
  { word: 'thank you', definition: 'Say thanks' },
  { word: 'first', definition: 'Step 1' },
  { word: 'then', definition: 'Next' },
  { word: 'careful', definition: 'Be safe' },
  { word: 'guide', definition: 'Show way' },
  { word: 'welcome', definition: 'Say hello' },
  { word: 'help', definition: 'Give hand' }
]

const DEFINITIONS = MATCHING_PAIRS.map(p => p.definition)

export default function Phase5SubPhase2Step4RemedialA2TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 4, interaction: 1, context: 'remedial_a2' })
  const [matches, setMatches] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleMatch = (word, definition) => {
    setMatches(prev => ({ ...prev, [word]: definition }))
  }

  const handleSubmit = async () => {
    let correctCount = 0
    MATCHING_PAIRS.forEach(pair => {
      if (matches[pair.word] === pair.definition) correctCount++
    })

    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_subphase2_step4_remedial_a2_taskA_score', correctCount.toString())

    try {
      await phase5API.logRemedialActivity(4, 'A2', 'A', correctCount, 8, 2) // step 4, subphase 2
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/2/step/4/remedial/a2/task/b')
  }

  const allMatched = Object.keys(matches).length === MATCHING_PAIRS.length

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>SubPhase 2 Step 4: Remedial Practice - Level A2</Typography>
        <Typography variant="h6" gutterBottom>Task A: Term Treasure Hunt</Typography>
        <Typography variant="body1">Match 8 instruction terms to their definitions. Hunt and drag to treasure chest!</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Term Treasure Hunt! Match each instruction term to its definition. Complete all matches to unlock the treasure!" />
      </Paper>

      {!submitted ? (
        <>
          <Stack spacing={3} sx={{ mb: 3 }}>
            {MATCHING_PAIRS.map((pair, idx) => (
              <Paper key={idx} elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom><strong>{pair.word}</strong></Typography>
                <FormControl component="fieldset">
                  <RadioGroup value={matches[pair.word] || ''} onChange={(e) => handleMatch(pair.word, e.target.value)}>
                    {DEFINITIONS.map((def, i) => (
                      <FormControlLabel key={i} value={def} control={<Radio />} label={def} />
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
