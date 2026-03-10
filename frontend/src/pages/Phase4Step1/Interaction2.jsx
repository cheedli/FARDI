import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack } from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import WordshakeGame from '../../components/WordshakeGame.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 4 Step 1 Interaction 2: Wordshake Game
 * Direct access to the word formation game
 */

const VOCABULARY_WORDS = [
  'slogan',
  'billboard',
  'commercial',
  'eye-catcher',
  'feature',
  'ad',
  'poster',
  'video'
]

export default function Phase4Step1Interaction2() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 2, context: 'main' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameResult, setGameResult] = useState(null)

  const handleWordshakeComplete = (result) => {
    console.log('Wordshake completed:', result)

    // Store Interaction 2 score in sessionStorage
    const interaction2Score = result.score || 0
    sessionStorage.setItem('phase4_step1_interaction2_score', interaction2Score)
    console.log('Interaction 2 Score stored:', interaction2Score)

    setGameCompleted(true)
    setGameResult(result)
  }

  const handleCompleteStep = () => {
    // Go to Interaction 3: slogan sentence production
    // Use /app prefix to be compatible with deployed base path
    navigate('/phase4/step/1/interaction/3')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
        <Typography variant="h4" gutterBottom>
          Phase 4: Marketing & Promotion
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 1: Engage - Interaction 2
        </Typography>
        <Typography variant="body1">
          Wordshake Challenge: Form marketing vocabulary words
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Skander"
          message="Well done on matching! Now, play for 3 minutes to form as many of the target words as you can."
        />
      </Paper>

      {/* Wordshake Game */}
      <Box>
        <WordshakeGame
          targetWords={VOCABULARY_WORDS}
          duration={180}
          onComplete={handleWordshakeComplete}
        />
      </Box>

      {/* Navigation */}
      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
        {gameCompleted && (
          <Button
            variant="contained"
            color="success"
            onClick={handleCompleteStep}
            size="large"
          >
            Complete Activity
          </Button>
        )}
      </Stack>
    </Box>
  )
}
