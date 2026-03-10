import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography } from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import SushiSpellGame from '../../components/phase5/SushiSpellGame.jsx'
import { phase6API } from '../../lib/phase6_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 1: Engage
 * Interaction 3: Sushi Spell Game
 * Practise spelling key evaluation vocabulary
 */

const TARGET_WORDS = [
  'success', 'challenge', 'feedback', 'improve', 'achievement',
  'recommend', 'summary', 'positive'
]

export default function Phase6SP1Step1Interaction3() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 1, interaction: 3, context: 'main' })

  const handleGameComplete = async (gameData) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction3', is_correct: true, score: gameData })
    // Store score in sessionStorage
    const score = gameData.score !== undefined ? gameData.score : (gameData.completed ? 1 : 0)
    sessionStorage.setItem('phase6_sp1_step1_interaction3_score', score.toString())

    // Track game completion on backend
    try {
      await phase6API.trackGame(1, 3, gameData, 1)
    } catch (error) {
      console.error('Failed to track game:', error)
    }

    // Navigate to score calculation after a short delay
    setTimeout(() => {
      navigate('/phase6/subphase/1/step/1/score')
    }, 2000)
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)',
          color: 'white',
          borderRadius: 2
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 6: Reflection and Evaluation
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 1: Engage - Interaction 3
        </Typography>
        <Typography variant="body1">
          Sushi Spell - Practise spelling evaluation vocabulary
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="Emna"
          message="To practise more report words, let's play another quick individual game! Play 'Sushi Spell' individually for 2 minutes and spell reflection/reporting words. Try longer words like 'achievement' or 'recommend'!"
        />
      </Paper>

      {/* Game Component */}
      <SushiSpellGame
        step={1}
        interaction={3}
        targetTime={120}
        targetWords={TARGET_WORDS}
        onComplete={handleGameComplete}
      />
    </Box>
  )
}
