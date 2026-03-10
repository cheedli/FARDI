import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import DragDropGapFill from '../../../../components/DragDropGapFill.jsx'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 - Level B1 - Task A: Fill Quest
 * Fill in 6 gaps with social media words, gamified as "Fill Quest"
 * Fill gaps to quest through levels - correct fills advance the quest
 */

const WORD_BANK = ['hashtag', 'because', 'viral', 'caption', 'emoji', 'call-to-action']

// First 3 sentences
const TEMPLATES_PART1 = [
  'We need post that could go ___.',
  'We should use popular ___ to reach people.',
  'We need strong ___ under photo.'
]

const ANSWERS_PART1 = {
  'g_0_0': 'viral',
  'g_1_0': 'hashtag',
  'g_2_0': 'caption'
}

// Second 3 sentences
const TEMPLATES_PART2 = [
  'Add ___ to make it friendly!',
  '___ people respond better to emotional content.',
  'End with clear ___ for audience.'
]

const ANSWERS_PART2 = {
  'g_3_0': 'emoji',
  'g_4_0': 'because',
  'g_5_0': 'call-to-action'
}

export default function Phase4_2RemedialB1TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 1, context: 'remedial_b1' })
  const [phase, setPhase] = useState(1) // 1 = first 3 sentences, 2 = second 3 sentences, 3 = complete
  const [part1Score, setPart1Score] = useState(null)
  const [totalScore, setTotalScore] = useState(0)

  const handlePart1Complete = (result) => {
    console.log('[Phase 4.2 Step 1] B1 Task A - Part 1 completed:', result.score, '/', result.total)
    setPart1Score(result.score)
  }

  const handlePart2Complete = (result) => {
    const finalScore = part1Score + result.score
    console.log('[Phase 4.2 Step 1] B1 Task A - Part 2 completed:', result.score, '/', result.total)
    console.log('[Phase 4.2 Step 1] B1 Task A - Total Score:', finalScore, '/ 6')

    setTotalScore(finalScore)
    sessionStorage.setItem('phase4_2_remedial_b1_taskA_score', finalScore)
    logTaskCompletion(finalScore)
    // Don't immediately switch to phase 3 - let user see the feedback first
  }

  const handleFinishTaskA = () => {
    setPhase(3)
  }

  const handleNextToPart2 = () => {
    setPhase(2)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      const response = await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          phase: '4.2',
          step: 1,
          level: 'B1',
          task: 'A',
          score: score,
          max_score: 6,
          completed: true
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('[Phase 4.2 Step 1] B1 Task A completion logged to backend')
      }
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase4_2/step/1/remedial/b1/taskB')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: '#e74c3c', color: 'white' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'white' }}>
          Phase 4.2 Step 1: Engage - Remedial Practice
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 500, color: 'white' }}>
          Level B1 - Task A: Fill Quest
        </Typography>
        <Typography variant="body1" sx={{ color: 'white' }}>
          Fill gaps to quest through levels - correct fills advance the quest!
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="LILIA"
          message="Complete this negotiation dialogue about creating a social media post! Drag and drop the words from the word bank to fill in the blanks."
        />
      </Paper>

      {/* Phase 1: First 3 Sentences */}
      {phase === 1 && (
        <Box>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" color="primary" gutterBottom sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
              Part 1: Fill in the first 3 sentences
            </Typography>

            <DragDropGapFill
              wordBank={['viral', 'hashtag', 'caption']}
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

      {/* Phase 2: Second 3 Sentences */}
      {phase === 2 && (
        <Box>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" color="primary" gutterBottom sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
              Part 2: Fill in the next 3 sentences
            </Typography>

            <DragDropGapFill
              wordBank={['emoji', 'because', 'call-to-action']}
              sentences={TEMPLATES_PART2}
              answers={ANSWERS_PART2}
              onComplete={handlePart2Complete}
              startIndex={3}
            />
          </Paper>

          {/* Show Next button after Part 2 is completed */}
          {totalScore > 0 && (
            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="success"
                size="large"
                onClick={handleFinishTaskA}
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
            <Typography variant="h5" sx={{ color: 'success.dark', fontWeight: 600 }} gutterBottom>
              ✓ Task A Complete!
            </Typography>
            <Typography variant="h6" sx={{ mt: 2, color: 'text.primary', fontWeight: 600 }}>
              Total Score: {totalScore} / 6
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, color: 'text.primary' }}>
              You've filled all the gaps with correct social media terms! Let's continue to the next task.
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
