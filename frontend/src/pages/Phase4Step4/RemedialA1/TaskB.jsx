import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import DragDropGapFill from '../../../components/DragDropGapFill.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 4 - Level A1 - Task B: Gap Fill Exercise
 * Fill in 8 gaps for poster/video descriptions in two phases (4+4), gamified as "Fill Quest"
 */

const WORD_BANK = ['gatefold', 'lettering', 'animation', 'jingle', 'dramatisation', 'sketch', 'clip', 'storytelling']

// First 4 sentences
const TEMPLATES_PART1 = [
  'Poster has ___.',
  '___ on poster.',
  'Video uses ___.',
  '___ in video.'
]

const ANSWERS_PART1 = {
  'g_0_0': 'gatefold',     // Poster has gatefold
  'g_1_0': 'lettering',    // lettering on poster
  'g_2_0': 'animation',    // Video uses animation
  'g_3_0': 'jingle'        // jingle in video
}

// Second 4 sentences
const TEMPLATES_PART2 = [
  '___ is story.',
  '___ for plan.',
  'Short ___.',
  'Use ___.'
]

const ANSWERS_PART2 = {
  'g_4_0': 'dramatisation', // dramatisation is story
  'g_5_0': 'sketch',        // sketch for plan
  'g_6_0': 'clip',          // Short clip
  'g_7_0': 'storytelling'   // Use storytelling
}

export default function Phase4Step4RemedialA1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 2, context: 'remedial_a1' })
  const [phase, setPhase] = useState(1) // 1 = first 4 sentences, 2 = second 4 sentences, 3 = complete
  const [part1Score, setPart1Score] = useState(null)
  const [totalScore, setTotalScore] = useState(0)

  const handlePart1Complete = (result) => {
    console.log('[Phase 4 Step 4] A1 Task B - Part 1 completed:', result.score, '/', result.total)
    setPart1Score(result.score)
  }

  const handlePart2Complete = (result) => {
    const finalScore = part1Score + result.score
    console.log('[Phase 4 Step 4] A1 Task B - Part 2 completed:', result.score, '/', result.total)
    console.log('[Phase 4 Step 4] A1 Task B - Total Score:', finalScore, '/ 8')

    setTotalScore(finalScore)
    sessionStorage.setItem('phase4_step4_remedial_a1_taskB_score', finalScore)
    logTaskCompletion(finalScore)
    // Don't immediately switch to phase 3 - let user see the feedback first
  }

  const handleFinishTaskB = () => {
    setPhase(3)
  }

  const handleNextToPart2 = () => {
    setPhase(2)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score: score })
    try {
      const response = await fetch('/api/phase4/step4/remedial/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          level: 'A1',
          task: 'B',
          score: score,
          max_score: 8,
          completed: true
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('[Phase 4 Step 4] A1 Task B completion logged to backend')
      }
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase4/step/4/remedial/a1/taskC')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
        <Typography variant="h4" gutterBottom>
          Phase 4 Step 4: Apply - Remedial Practice
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level A1 - Task B: Fill Quest
        </Typography>
        <Typography variant="body1">
          Fill gaps to quest through levels - advance with correct answers!
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="MS. MABROUKI"
          message="Great work on the treasure hunt! Now let's fill in the missing words. Drag and drop words from the word bank to complete the sentences!"
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
              wordBank={['gatefold', 'lettering', 'animation', 'jingle']}
              sentences={TEMPLATES_PART1}
              answers={ANSWERS_PART1}
              onComplete={handlePart1Complete}
            />
          </Paper>

          {/* Show Next button after Part 1 is completed */}
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
              wordBank={['dramatisation', 'sketch', 'clip', 'storytelling']}
              sentences={TEMPLATES_PART2}
              answers={ANSWERS_PART2}
              onComplete={handlePart2Complete}
              startIndex={4}
            />
          </Paper>

          {/* Show Next button after Part 2 is completed */}
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
