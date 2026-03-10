import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Radio, RadioGroup, FormControlLabel, FormControl, Grid, Card, CardContent } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 5 SubPhase 2 Step 1 - Remedial B2 - Task C: Matching Game
 * Match 8 instruction words/phrases to functions
 */

const MATCHING_PAIRS = [
  { id: 1, term: 'please', function: 'Makes request polite' },
  { id: 2, term: 'first', function: 'Shows step 1' },
  { id: 3, term: 'then', function: 'Shows next step' },
  { id: 4, term: 'after that', function: 'Shows later step' },
  { id: 5, term: 'be careful', function: 'Safety warning' },
  { id: 6, term: 'help', function: 'Offer support' },
  { id: 7, term: 'guide', function: 'Show direction' },
  { id: 8, term: 'thank you', function: 'Show gratitude' }
]

export default function Phase5SubPhase2Step1RemedialB2TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 1, interaction: 3, context: 'remedial_b2' })
  const [matches, setMatches] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const shuffledFunctions = [...MATCHING_PAIRS].sort(() => Math.random() - 0.5).map(p => p.function)

  const handleMatch = (termId, functionText) => {
    setMatches(prev => ({
      ...prev,
      [termId]: functionText
    }))
  }

  const calculateScore = () => {
    let correctCount = 0
    MATCHING_PAIRS.forEach(pair => {
      if (matches[pair.id] === pair.function) {
        correctCount++
      }
    })
    return correctCount
  }

  const handleSubmit = async () => {
    const finalScore = calculateScore()
    setScore(finalScore)
    setSubmitted(true)
    sessionStorage.setItem('phase5_subphase2_step1_remedial_b2_taskC_score', finalScore.toString())

    try {
      await phase5API.logRemedialActivity(1, 'B2', 'C', finalScore, 8, 2) // subphase 2
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/2/step/1/remedial/b2/task/d')
  }

  const allMatched = MATCHING_PAIRS.every(pair => matches[pair.id])

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>SubPhase 2 Step 1: Remedial Practice - Level B2</Typography>
        <Typography variant="h6" gutterBottom>Task C: Matching Game</Typography>
        <Typography variant="body1">Match 8 instruction words/phrases to their functions. Match correctly to win!</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Matching Game! Match each instruction word or phrase to its function. Drag or select the correct function for each term!" />
      </Paper>

      {!submitted ? (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {MATCHING_PAIRS.map((pair) => (
              <Grid item xs={12} md={6} key={pair.id}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      {pair.term}
                    </Typography>
                    <FormControl component="fieldset" fullWidth>
                      <RadioGroup
                        value={matches[pair.id] || ''}
                        onChange={(e) => handleMatch(pair.id, e.target.value)}
                      >
                        {shuffledFunctions.map((func, idx) => (
                          <FormControlLabel
                            key={idx}
                            value={func}
                            control={<Radio />}
                            label={func}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!allMatched} size="large" fullWidth>
            Submit Matches
          </Button>
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
