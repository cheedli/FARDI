import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import WordshakeGame from '../../../components/WordshakeGame.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 1 - Interaction 1: Wordshake Game
 * Students play Wordshake individually to activate social media vocabulary
 */

const TARGET_WORDS = [
  'hashtag',
  'caption',
  'viral',
  'engagement',
  'emoji',
  'tag',
  'story',
  'ad'
]

export default function Phase4_2Step1Interaction1() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 1, context: 'main' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameResult, setGameResult] = useState(null)

  const handleWordshakeComplete = (result) => {
    console.log('Wordshake completed:', result)

    // Store Interaction 1 score in sessionStorage
    const interaction1Score = result.score || 0
    sessionStorage.setItem('phase4_2_step1_interaction1_score', interaction1Score)
    console.log('Phase 4.2 Step 1 Interaction 1 Score stored:', interaction1Score)

    setGameCompleted(true)
    setGameResult(result)

    // Log to backend
    logGameCompletion(result)
  }

  const logGameCompletion = async (result) => {
    try {
      const response = await fetch('/api/phase4_2/interaction/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          step: 1,
          interaction: 1,
          completed: true,
          score: result.score,
          total_words: result.totalWords,
          found_words: result.foundWords,
          game_type: 'wordshake',
          target_words: TARGET_WORDS
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('Interaction 1 (Wordshake) logged to backend')
      }
    } catch (error) {
      console.error('Failed to log interaction completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase4_2/step/1/interaction/2')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'primary.main', color: 'white' }}>
        <Typography variant="h4" gutterBottom>
          Phase 4.2: Marketing & Promotion (Social Media Focus)
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 1: Engage - Interaction 1
        </Typography>
        <Typography variant="body1">
          Vocabulary Activation: Wordshake Challenge
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="To activate our social media vocabulary, play Wordshake for 3 minutes and form as many of the target words as you can: hashtag, caption, viral, engagement, emoji, tag, story, ad."
        />
      </Paper>

      {/* Wordshake Game */}
      <Box>
        <WordshakeGame
          targetWords={TARGET_WORDS}
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
            onClick={handleContinue}
            size="large"
          >
            Continue to Next Activity
          </Button>
        )}
      </Stack>
    </Box>
  )
}
