import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 5 SubPhase 2 Step 3 - Remedial B2 - Task C: Kahoot Match
 * Match 8 terms to advanced definitions
 */

const MATCHING_PAIRS = [
  { term: 'please', definition: 'Polite request marker' },
  { term: 'thank you', definition: 'Expression of gratitude' },
  { term: 'first', definition: 'Initial step indicator' },
  { term: 'then', definition: 'Sequential connector' },
  { term: 'careful', definition: 'Safety reminder' },
  { term: 'guide', definition: 'Direction provider' },
  { term: 'welcome', definition: 'Warm greeting' },
  { term: 'help', definition: 'Assistance offer' }
]

const DEFINITIONS = MATCHING_PAIRS.map(p => p.definition)

export default function Phase5SubPhase2Step3RemedialB2TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 3, interaction: 3, context: 'remedial_b2' })
  const [matches, setMatches] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleMatch = (term, definition) => {
    setMatches(prev => ({ ...prev, [term]: definition }))
  }

  const handleSubmit = async () => {
    let correctCount = 0
    MATCHING_PAIRS.forEach(pair => {
      if (matches[pair.term] === pair.definition) correctCount++
    })

    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_subphase2_step3_remedial_b2_taskC_score', correctCount.toString())

    try {
      await phase5API.logRemedialActivity(3, 'B2', 'C', correctCount, 8, 2) // step 3, subphase 2
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/2/step/3/remedial/b2/task/d')
  }

  const allMatched = Object.keys(matches).length === MATCHING_PAIRS.length

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>SubPhase 2 Step 3: Remedial Practice - Level B2</Typography>
        <Typography variant="h6" gutterBottom>Task C: Kahoot Match</Typography>
        <Typography variant="body1">Match 8 terms to advanced definitions</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Kahoot Match! Match each instruction term to its advanced definition. Choose the best match for each term!" />
      </Paper>

      {!submitted ? (
        <>
          <Stack spacing={3} sx={{ mb: 3 }}>
            {MATCHING_PAIRS.map((pair, idx) => (
              <Paper key={idx} elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom><strong>{pair.term}</strong></Typography>
                <FormControl component="fieldset">
                  <RadioGroup value={matches[pair.term] || ''} onChange={(e) => handleMatch(pair.term, e.target.value)}>
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
