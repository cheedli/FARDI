import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Alert } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import GapFillStory from '../../../components/GapFillStory.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 5 SubPhase 2 Step 2 - Level A2 - Task A: Match Race
 * Match 6 instruction words to simple definitions/pictures
 * Gamified as "Match Race" - Race timer to match before time runs out
 */

const WORD_BANK = ['please', 'thank you', 'first', 'then', 'careful', 'help']

const MATCHING_PAIRS = [
  { word: 'please', definition: 'Polite word' },
  { word: 'thank you', definition: 'Say after help' },
  { word: 'first', definition: 'Number 1 step' },
  { word: 'then', definition: 'Next step' },
  { word: 'careful', definition: 'Be safe' },
  { word: 'help', definition: 'Give hand' }
]

export default function Phase5SubPhase2Step2RemedialA2TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 2, interaction: 1, context: 'remedial_a2' })
  const [matches, setMatches] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleMatch = (word, definition) => {
    setMatches(prev => ({
      ...prev,
      [word]: definition
    }))
  }

  const calculateScore = () => {
    let correctCount = 0
    MATCHING_PAIRS.forEach(pair => {
      if (matches[pair.word] === pair.definition) {
        correctCount++
      }
    })
    return correctCount
  }

  const handleSubmit = async () => {
    const finalScore = calculateScore()
    setScore(finalScore)
    setSubmitted(true)
    sessionStorage.setItem('phase5_subphase2_step2_remedial_a2_taskA_score', finalScore.toString())

    try {
      await phase5API.logRemedialActivity(2, 'A2', 'A', finalScore, 6, 2) // step 2, subphase 2
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/2/step/2/remedial/a2/task/b')
  }

  const allMatched = Object.keys(matches).length === MATCHING_PAIRS.length

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 5: Execution & Problem-Solving
        </Typography>
        <Typography variant="h5" gutterBottom>
          SubPhase 2 Step 2: Remedial Practice - Level A2
        </Typography>
        <Typography variant="h6" gutterBottom>
          Task A: Match Race
        </Typography>
        <Typography variant="body1">
          Match 6 instruction words to their definitions. Race against time!
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Welcome to Match Race! Match each instruction word to its definition. Click a word, then click its matching definition. Complete all matches to finish!"
        />
      </Paper>

      {!submitted && (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Match the Words to Definitions
          </Typography>
          <Stack spacing={2}>
            {MATCHING_PAIRS.map((pair, idx) => (
              <Paper key={idx} elevation={1} sx={{ p: 2 }}>
                <Typography variant="body1" gutterBottom>
                  <strong>{pair.word}</strong> → {matches[pair.word] || '______'}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  {MATCHING_PAIRS.map((p, i) => (
                    <Button
                      key={i}
                      variant={matches[pair.word] === p.definition ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => handleMatch(pair.word, p.definition)}
                      disabled={submitted}
                    >
                      {p.definition}
                    </Button>
                  ))}
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Box>
      )}

      {!submitted && (
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit}
            disabled={!allMatched}
            sx={{ px: 6 }}
          >
            Submit Answers
          </Button>
        </Stack>
      )}

      {submitted && (
        <>
          <Paper elevation={3} sx={{ p: 4, mb: 3, backgroundColor: 'success.lighter', textAlign: 'center' }}>
            <Typography variant="h5" color="success.dark" gutterBottom>
              ✓ Task A Complete!
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Score: {score} / 6
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {score >= 6 ? 'Excellent! All matches correct!' : 'Good work! Let\'s continue to the next task.'}
            </Typography>
          </Paper>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="contained"
              color="success"
              onClick={handleContinue}
              size="large"
            >
              Next: Task B →
            </Button>
          </Stack>
        </>
      )}
    </Box>
  )
}
