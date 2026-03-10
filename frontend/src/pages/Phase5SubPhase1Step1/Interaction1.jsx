import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography } from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import WordshakeGame from '../../components/phase5/WordshakeGame.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 5 Step 1: Engage
 * Interaction 1: Wordshake Game
 * Play individually for 3 minutes to form problem-solving words
 */

const TARGET_WORDS = ['problem', 'cancel', 'change', 'solution', 'sorry', 'alternative', 'fix', 'urgent']

export default function Phase5Step1Interaction1() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 1, interaction: 1, context: 'main' })

  const handleGameComplete = (gameData) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction1', is_correct: true, score: gameData })
    // Game completion is tracked automatically
    // Navigate to next interaction after a short delay
    setTimeout(() => {
      navigate('/phase5/subphase/1/step/1/interaction/2')
    }, 2000)
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 5: Execution & Problem-Solving
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 1: Engage - Interaction 1
        </Typography>
        <Typography variant="body1">
          Activate your problem-solving vocabulary
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="To activate our problem-solving vocabulary, play 'Wordshake' individually for 3 minutes and form as many words as you can from these target words: problem, cancel, change, solution, sorry, alternative, fix, urgent. Focus on forming the target words like 'cancel' or 'solution' to prepare for the discussion."
        />
      </Paper>

      {/* Game Component */}
      <WordshakeGame
        step={1}
        interaction={1}
        targetTime={180} // 3 minutes
        targetWords={TARGET_WORDS}
        onComplete={handleGameComplete}
      />
    </Box>
  )
}
