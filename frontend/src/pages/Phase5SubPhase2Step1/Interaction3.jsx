import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography } from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import SushiSpellGame from '../../components/phase5/SushiSpellGame.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 5 SubPhase 2 Step 1: Engage
 * Interaction 3: Sushi Spell Game
 * Play individually for 2 minutes to spell instruction words
 */

const TARGET_WORDS = ['please', 'thank you', 'first', 'then', 'after', 'careful', 'help', 'guide', 'welcome', 'queue', 'safety', 'listen']

export default function Phase5SubPhase2Step1Interaction3() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 1, interaction: 3, context: 'main' })

  const handleGameComplete = (gameData) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction3', is_correct: true, score: gameData })
    // Store score
    sessionStorage.setItem('phase5_subphase2_step1_interaction3_score', gameData.score || '0')
    
    // Navigate to score calculation after a short delay
    setTimeout(() => {
      navigate('/phase5/subphase/2/step/1/score')
    }, 2000)
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 5: Execution & Problem-Solving
        </Typography>
        <Typography variant="h5" gutterBottom>
          SubPhase 2 Step 1: Engage - Interaction 3
        </Typography>
        <Typography variant="body1">
          Practice spelling instruction vocabulary
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Emna"
          message="To practise more instruction words, let's play another quick individual game! Play 'Sushi Spell' individually for 2 minutes to spell instruction words (target: please, thank you, first, then, after, careful, help, guide, welcome, queue, safety, listen). Link: https://learnenglishteens.britishcouncil.org/vocabulary/vocabulary-games/sushi-spell. Try longer words like 'thank you' or 'careful'."
        />
      </Paper>

      {/* Game Component */}
      <SushiSpellGame
        step={1}
        interaction={3}
        subphase={2}
        targetTime={120} // 2 minutes
        targetWords={TARGET_WORDS}
        onComplete={handleGameComplete}
      />
    </Box>
  )
}
