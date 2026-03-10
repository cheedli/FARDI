import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography } from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import SushiSpellGame from '../../components/phase5/SushiSpellGame.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 5 Step 1: Engage
 * Interaction 3: Sushi Spell Game
 * Play individually for 2 minutes to spell problem-solving words
 */

const TARGET_WORDS = ['problem', 'cancel', 'change', 'solution', 'sorry', 'alternative', 'fix', 'urgent']

export default function Phase5Step1Interaction3() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 1, interaction: 3, context: 'main' })

  const handleGameComplete = (gameData) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction3', is_correct: true, score: gameData })
    // Game completion is tracked automatically
    // Navigate to score calculation after a short delay
    setTimeout(() => {
      // Calculate step score and route to remedial if needed
      navigate('/phase5/subphase/1/step/1/score')
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
          Step 1: Engage - Interaction 3
        </Typography>
        <Typography variant="body1">
          Practice spelling problem-solving vocabulary
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Emna"
          message="To practise more problem-solving terms, let's play another quick individual game! Play 'Sushi Spell' for 2 minutes to spell problem-solving words. Try longer words like 'alternative' or 'solution' for higher scores!"
        />
      </Paper>

      {/* Game Component */}
      <SushiSpellGame
        step={1}
        interaction={3}
        targetTime={120} // 2 minutes
        targetWords={TARGET_WORDS}
        onComplete={handleGameComplete}
      />
    </Box>
  )
}
