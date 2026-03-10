import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, LinearProgress, Alert, Stack } from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import MatchingGame from '../../components/MatchingGame.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 4 Step 1: Engage - Marketing & Promotion
 * Interaction 1: Vocabulary Matching Game
 */
// Vocabulary matching pairs from phase4.json
// Each pair has a word, definition, and image to match
const BASE_URL = import.meta.env.BASE_URL || '/'

const VOCABULARY_PAIRS = [
  {
    word: 'slogan',
    definition: 'Catchy phrase or short sentence for promotion',
    image: `${BASE_URL}images/phase4/slogan.png`
  },
  {
    word: 'billboard',
    definition: 'Large outdoor advertising sign',
    image: `${BASE_URL}images/phase4/billboard.jpg`
  },
  {
    word: 'commercial',
    definition: 'Short TV or radio advertisement',
    image: `${BASE_URL}images/phase4/commercial.png`
  },
  {
    word: 'eye-catcher',
    definition: 'Something bright or attractive that gets attention',
    image: `${BASE_URL}images/phase4/eye-catcher.png`
  },
  {
    word: 'feature',
    definition: 'Highlight or main part shown in an ad',
    image: `${BASE_URL}images/phase4/feature.png`
  },
  {
    word: 'ad',
    definition: 'Short for advertisement (any promotion)',
    image: `${BASE_URL}images/phase4/ad.png`
  },
  {
    word: 'poster',
    definition: 'Paper advertisement with pictures and words',
    image: `${BASE_URL}images/phase4/poster.png`
  },
  {
    word: 'video',
    definition: 'Moving advertisement or promotional clip',
    image: `${BASE_URL}images/phase4/video.png`
  }
]

export default function Phase4Step1Interaction1() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 1, context: 'main' })
  const [stepData, setStepData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentInteraction, setCurrentInteraction] = useState(0)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameProgress, setGameProgress] = useState({})

  useEffect(() => {
    loadStepData()
  }, [])

  const loadStepData = async () => {
    setLoading(true)
    try {
      // For now, we'll use the data from phase4.json structure
      // In the future, this can be an API call
      const response = await fetch('/api/phase4/step/1', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setStepData(data)
      } else {
        // Fallback to local data structure
        setStepData({
          step_id: 1,
          title: 'Engage',
          description: 'Spark interest by connecting to prior knowledge of event promotion',
          main_activity: {
            action_items: [
              {
                id: 'vocabulary_matching_game',
                title: 'Promotion Vocabulary Matching',
                instructor: 'Ms. Mabrouki',
                instruction: 'First, play an individual matching game to connect promotion words with their definitions. The game will show the words and definitions - match them correctly!',
                target_vocabulary: VOCABULARY_PAIRS.map(p => p.word)
              }
            ]
          }
        })
      }
    } catch (e) {
      console.error('Error loading step data:', e)
      // Use fallback data
      setStepData({
        step_id: 1,
        title: 'Engage',
        description: 'Spark interest by connecting to prior knowledge of event promotion',
        main_activity: {
          action_items: [
            {
              id: 'vocabulary_matching_game',
              title: 'Promotion Vocabulary Matching',
              instructor: 'Ms. Mabrouki',
              instruction: 'First, play an individual matching game to connect promotion words with their definitions. The game will show the words and definitions - match them correctly!',
              target_vocabulary: VOCABULARY_PAIRS.map(p => p.word)
            }
          ]
        }
      })
    } finally {
      setLoading(false)
    }
  }

  const handleMatchingComplete = (result) => {
    console.log('Matching completed:', result)

    // Store Interaction 1 score in sessionStorage
    const interaction1Score = result.totalCorrect || 0
    sessionStorage.setItem('phase4_step1_interaction1_score', interaction1Score)
    console.log('Interaction 1 Score stored:', interaction1Score)

    setGameCompleted(true)
    setGameProgress(result)
  }

  const handleMatchingProgress = (progress) => {
    console.log('Matching progress:', progress)
    setGameProgress(prev => ({ ...prev, ...progress }))
  }

  const handleNext = () => {
    console.log('handleNext called - navigating to Interaction 2')
    // Navigate to Interaction 2 (Wordshake game)
    // Use /app prefix to match Flask deployment base path
    navigate('/phase4/step/1/interaction/2')
  }

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    )
  }

  const currentItem = stepData?.main_activity?.action_items?.[currentInteraction]

  // Debug logging
  console.log('Step Data:', stepData)
  console.log('Current Item:', currentItem)
  console.log('Current Item ID:', currentItem?.id)

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
        <Typography variant="h4" gutterBottom>
          Phase 4: Marketing & Promotion
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 1: Engage - Interaction 1
        </Typography>
        <Typography variant="body1">
          Match promotion words with their definitions
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker={currentItem?.instructor || 'Ms. Mabrouki'}
          message={currentItem?.instruction || 'First, play an individual matching game to connect promotion words with their definitions. The game will show the words and definitions - match them correctly!'}
        />
      </Paper>

      {/* Matching Game - Always show */}
      <Box>
        <MatchingGame
          pairs={VOCABULARY_PAIRS}
          onComplete={handleMatchingComplete}
          onProgress={handleMatchingProgress}
        />
      </Box>

      {/* Navigation */}
      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
        {gameCompleted && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            size="large"
          >
            Continue to Next Activity
          </Button>
        )}
      </Stack>
    </Box>
  )
}
