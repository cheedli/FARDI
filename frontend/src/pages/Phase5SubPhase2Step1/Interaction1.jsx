import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography } from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import WordshakeGame from '../../components/phase5/WordshakeGame.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 5 SubPhase 2 Step 1: Engage
 * Interaction 1: Wordshake Game
 * Play individually for 3 minutes to form instruction words
 */

const TARGET_WORDS = ['please', 'thank you', 'first', 'then', 'after', 'careful', 'help', 'guide', 'welcome', 'queue', 'safety', 'listen']

export default function Phase5SubPhase2Step1Interaction1() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 1, interaction: 1, context: 'main' })

  const handleGameComplete = (gameData) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction1', is_correct: true, score: gameData })
    // Store score
    sessionStorage.setItem('phase5_subphase2_step1_interaction1_score', gameData.score || '0')
    
    // Navigate to next interaction after a short delay
    setTimeout(() => {
      navigate('/phase5/subphase/2/step/1/interaction/2')
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
          SubPhase 2 Step 1: Engage - Interaction 1
        </Typography>
        <Typography variant="body1">
          Activate your instruction vocabulary
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="To activate instruction vocabulary, play 'Wordshake' individually for 3 minutes and form as many words as you can from these target words: please, thank you, first, then, after, careful, help, guide, welcome, queue, safety, listen. Link: https://learnenglishteens.britishcouncil.org/vocabulary/vocabulary-games/wordshake"
        />
      </Paper>

      {/* Game Component */}
      <WordshakeGame
        step={1}
        interaction={1}
        subphase={2}
        targetTime={180} // 3 minutes
        targetWords={TARGET_WORDS}
        onComplete={handleGameComplete}
      />
    </Box>
  )
}
