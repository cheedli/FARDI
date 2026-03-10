import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import DragDropGapFill from '../../../../components/DragDropGapFill.jsx'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 - Level A1 - Task B: Fill Quest
 * Fill in 8 gaps with social media words, gamified as "Fill Quest"
 * Fill gaps to quest through levels - correct fills advance the quest
 */

const WORD_BANK = ['hashtag', 'caption', 'emoji', 'tag', 'like', 'share', 'post', 'story']

// First 4 sentences
const TEMPLATES_PART1 = [
  'Use ___ #Festival.',
  'Write ___ under photo.',
  'Add ___ smile.',
  '___ friend.'
]

const ANSWERS_PART1 = {
  'g_0_0': 'hashtag',
  'g_1_0': 'caption',
  'g_2_0': 'emoji',
  'g_3_0': 'tag'
}

// Second 4 sentences
const TEMPLATES_PART2 = [
  'Click ___.',
  '___ with friends.',
  'Make ___.',
  'Watch ___.'
]

const ANSWERS_PART2 = {
  'g_4_0': 'like',
  'g_5_0': 'share',
  'g_6_0': 'post',
  'g_7_0': 'story'
}

export default function Phase4_2RemedialA1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 2, context: 'remedial_a1' })
  const [phase, setPhase] = useState(1) // 1 = first 4 sentences, 2 = second 4 sentences, 3 = complete
  const [part1Score, setPart1Score] = useState(null)
  const [totalScore, setTotalScore] = useState(0)

  const handlePart1Complete = (result) => {
    console.log('[Phase 4.2 Step 1] A1 Task B - Part 1 completed:', result.score, '/', result.total)
    setPart1Score(result.score)
  }

  const handlePart2Complete = (result) => {
    const finalScore = part1Score + result.score
    console.log('[Phase 4.2 Step 1] A1 Task B - Part 2 completed:', result.score, '/', result.total)
    console.log('[Phase 4.2 Step 1] A1 Task B - Total Score:', finalScore, '/ 8')

    setTotalScore(finalScore)
    sessionStorage.setItem('phase4_2_remedial_a1_taskB_score', finalScore)
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
      const response = await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          phase: '4.2',
          step: 1,
          level: 'A1',
          task: 'B',
          score: score,
          max_score: 8,
          completed: true
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('[Phase 4.2 Step 1] A1 Task B completion logged to backend')
      }
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase4_2/step/1/remedial/a1/taskC')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: '#e74c3c', color: 'white' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'white' }}>
          Phase 4.2 Step 1: Engage - Remedial Practice
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 500, color: 'white' }}>
          Level A1 - Task B: Fill Quest
        </Typography>
        <Typography variant="body1" sx={{ color: 'white' }}>
          Fill gaps to quest through levels - correct fills advance the quest!
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="LILIA"
          message="Great work on Spelling Rescue! Now let's fill in the missing words. Drag and drop the correctly spelled social media words from the word bank to complete the sentences!"
        />
      </Paper>

      {/* Phase 1: First 4 Sentences */}
      {phase === 1 && (
        <Box>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" color="primary" gutterBottom sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
              Part 1: Fill in the first 4 sentences
            </Typography>

            <DragDropGapFill
              wordBank={['hashtag', 'caption', 'emoji', 'tag']}
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
            <Typography variant="h6" color="primary" gutterBottom sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
              Part 2: Fill in the next 4 sentences
            </Typography>

            <DragDropGapFill
              wordBank={['like', 'share', 'post', 'story']}
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
            <Typography variant="h5" sx={{ color: 'success.dark', fontWeight: 600 }} gutterBottom>
              ✓ Task B Complete!
            </Typography>
            <Typography variant="h6" sx={{ mt: 2, color: 'text.primary', fontWeight: 600 }}>
              Total Score: {totalScore} / 8
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, color: 'text.primary' }}>
              You've filled all the gaps with correct spelling! Let's continue to the final task.
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
