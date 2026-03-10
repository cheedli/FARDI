import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import DragDropGapFill from '../../../components/DragDropGapFill.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 5 Step 1 - Level A1 - Task B: Gap Fill
 * Fill in 8 gaps with problem-solving words, gamified as "Fill Frenzy"
 * Fill as items "frenzy" across screen; fast fills score higher
 */

const WORD_BANK = ['problem', 'cancel', 'change', 'solution', 'sorry', 'alternative', 'fix', 'urgent']

const TEMPLATES = [
  'Singer has ___.',
  'We must ___.',
  '___ time.',
  'Find ___.',
  'Say ___.',
  'Use ___.',
  '___ issue.',
  'It is ___.'
]

const ANSWERS = {
  'g_0_0': 'problem',      // Singer has problem
  'g_1_0': 'cancel',       // We must cancel
  'g_2_0': 'change',       // Change time
  'g_3_0': 'solution',     // Find solution
  'g_4_0': 'sorry',        // Say sorry
  'g_5_0': 'alternative',  // Use alternative
  'g_6_0': 'fix',          // Fix issue
  'g_7_0': 'urgent'        // It is urgent
}

export default function Phase5Step1RemedialA1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 1, interaction: 2, context: 'remedial_a1' })
  const [phase, setPhase] = useState(1)
  const [part1Score, setPart1Score] = useState(null)
  const [totalScore, setTotalScore] = useState(0)

  const handlePart1Complete = (result) => {
    console.log('[Phase 5 Step 1] A1 Task B - Part 1 completed:', result.score, '/', result.total)
    setPart1Score(result.score)
  }

  const handlePart2Complete = async (result) => {
    const finalScore = part1Score + result.score
    console.log('[Phase 5 Step 1] A1 Task B - Part 2 completed:', result.score, '/', result.total)
    console.log('[Phase 5 Step 1] A1 Task B - Total Score:', finalScore, '/ 8')

    setTotalScore(finalScore)
    sessionStorage.setItem('phase5_step1_remedial_a1_taskB_score', finalScore.toString())

    // Log to backend
    try {
      await phase5API.logRemedialActivity(1, 'A1', 'B', finalScore, 8, 0)
      console.log('[Phase 5 Step 1] A1 Task B completion logged to backend')
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleFinishTaskB = () => {
    setPhase(3)
  }

  const handleNextToPart2 = () => {
    setPhase(2)
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/1/step/1/remedial/a1/task/c')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 5: Execution & Problem-Solving
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 1: Remedial Practice - Level A1
        </Typography>
        <Typography variant="h6" gutterBottom>
          Task B: Fill Frenzy
        </Typography>
        <Typography variant="body1">
          Fill in 8 gaps with problem-solving words. Fast fills score higher!
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Great work on matching! Now let's fill in the missing words. Drag and drop words from the word bank to complete the sentences. Fill quickly for bonus points!"
        />
      </Paper>

      {/* Phase 1: First 4 Sentences */}
      {phase === 1 && (
        <Box>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" color="primary" gutterBottom sx={{ mb: 3 }}>
              Part 1: Fill in the first 4 sentences
            </Typography>

            <DragDropGapFill
              wordBank={['problem', 'cancel', 'change', 'solution']}
              sentences={TEMPLATES.slice(0, 4)}
              answers={Object.fromEntries(Object.entries(ANSWERS).slice(0, 4))}
              onComplete={handlePart1Complete}
            />
          </Paper>

          {part1Score !== null && (
            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="success"
                size="large"
                onClick={handleNextToPart2}
                sx={{ px: 6 }}
              >
                Next: Part 2 →
              </Button>
            </Stack>
          )}
        </Box>
      )}

      {/* Phase 2: Second 4 Sentences */}
      {phase === 2 && (
        <Box>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" color="primary" gutterBottom sx={{ mb: 3 }}>
              Part 2: Fill in the next 4 sentences
            </Typography>

            <DragDropGapFill
              wordBank={['sorry', 'alternative', 'fix', 'urgent']}
              sentences={TEMPLATES.slice(4, 8)}
              answers={Object.fromEntries(Object.entries(ANSWERS).slice(4, 8))}
              onComplete={handlePart2Complete}
              startIndex={4}
            />
          </Paper>

          {totalScore > 0 && (
            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="success"
                size="large"
                onClick={handleFinishTaskB}
                sx={{ px: 6 }}
              >
                View Results & Continue →
              </Button>
            </Stack>
          )}
        </Box>
      )}

      {/* Phase 3: Complete */}
      {phase === 3 && (
        <>
          <Paper elevation={3} sx={{ p: 4, mb: 3, backgroundColor: 'success.lighter', textAlign: 'center' }}>
            <Typography variant="h5" color="success.dark" gutterBottom>
              ✓ Task B Complete!
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Total Score: {totalScore} / 8
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              You've filled all the gaps! Let's continue to the final task.
            </Typography>
          </Paper>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="contained"
              color="success"
              onClick={handleContinue}
              size="large"
            >
              Next: Task C →
            </Button>
          </Stack>
        </>
      )}
    </Box>
  )
}
