import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Alert
} from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import SushiSpellGame from '../../components/phase5/SushiSpellGame.jsx'
import { phase6API } from '../../lib/phase6_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 2: Explore - Interaction 3
 * Sushi Spell - vocabulary reinforcement
 */

const TARGET_WORDS = ['summary', 'report', 'evidence', 'recommend', 'achieve', 'positive', 'improve']

export default function Phase6SP1Step2Interaction3() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 2, interaction: 3, context: 'main' })
  const [gameCompleted, setGameCompleted] = useState(false)

  const handleGameComplete = async (gameData) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction3', is_correct: true, score: gameData })
    setGameCompleted(true)
    sessionStorage.setItem('phase6_sp1_step2_interaction3_score', '1')
    try {
      await phase6API.trackGame(2, 3, gameData, 1)
    } catch (error) {
      console.error('Failed to track game:', error)
    }
    // Auto-navigate after a short delay
    setTimeout(() => {
      navigate('/phase6/subphase/1/step/2/score')
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
          Phase 6: Reflection &amp; Evaluation
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 2: Explore - Interaction 3
        </Typography>
        <Typography variant="body1">
          Vocabulary Reinforcement - Sushi Spell
        </Typography>
      </Paper>

      {/* Character Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="Emna"
          message="Now revise your summary after seeing real report examples and playing the game again! Play Sushi Spell once more (2 minutes), then improve one or two sentences in your summary using a new spelled term (e.g., 'feedback', 'recommend', 'strength')."
        />
      </Paper>

      {/* Game Info */}
      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        <Typography variant="body2">
          Spell these report writing words: <strong>{TARGET_WORDS.join(', ')}</strong>. You have 2 minutes!
        </Typography>
      </Alert>

      {/* Game Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <SushiSpellGame
          step={2}
          interaction={3}
          targetTime={120}
          targetWords={TARGET_WORDS}
          onComplete={handleGameComplete}
        />
      </Paper>

      {/* Completion Message */}
      {gameCompleted && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          <Typography variant="body2" fontWeight="bold">
            Excellent! You've completed all interactions for Step 2. Calculating your score now...
          </Typography>
        </Alert>
      )}
    </Box>
  )
}
