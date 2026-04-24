import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, LinearProgress, Alert, Stack, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
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

const LIGHT = {
  pageBg: '#FFFDE7',
  blue:   { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
  teal:   { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  red:    { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
  teal:   { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  red:    { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

export default function Phase4Step1Interaction1() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 1, context: 'main' })
  const [stepData, setStepData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentInteraction, setCurrentInteraction] = useState(0)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameProgress, setGameProgress] = useState({})

  useEffect(() => { window.__remedialSkip = () => navigate('/phase4/step/1/interaction/2') }, [])

  useEffect(() => {
    loadStepData()
  }, [])

  const loadStepData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/phase4/step/1', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setStepData(data)
      } else {
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
    navigate('/phase4/step/1/interaction/2')
  }

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: isDark ? DARK.pageBg : LIGHT.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <LinearProgress />
        </Container>
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: isDark ? DARK.pageBg : LIGHT.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <Alert severity="error">{error}</Alert>
        </Container>
      </Box>
    )
  }

  const currentItem = stepData?.main_activity?.action_items?.[currentInteraction]

  console.log('Step Data:', stepData)
  console.log('Current Item:', currentItem)
  console.log('Current Item ID:', currentItem?.id)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: isDark ? DARK.pageBg : LIGHT.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: isDark ? DARK.blue.bg : LIGHT.blue.bg,
            border: `2px solid ${isDark ? DARK.blue.border : LIGHT.blue.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${isDark ? DARK.blue.shadow : LIGHT.blue.shadow}`,
            p: 3, mb: 3,
            transition: 'transform 0.15s, box-shadow 0.15s',
            '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${isDark ? DARK.blue.shadow : LIGHT.blue.shadow}` }
          }}>
            <Typography variant="h5" gutterBottom fontWeight={700} color={isDark ? DARK.blue.border : LIGHT.blue.shadow}>
              Phase 4: Marketing &amp; Promotion
            </Typography>
            <Typography variant="h6" gutterBottom fontWeight={700} color={isDark ? DARK.blue.border : LIGHT.blue.shadow}>
              Step 1: Engage - Interaction 1
            </Typography>
            <Typography variant="body1" color={isDark ? 'rgba(255,255,255,0.8)' : 'text.secondary'}>
              Match promotion words with their definitions
            </Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{
            bgcolor: isDark ? DARK.teal.bg : LIGHT.teal.bg,
            border: `2px solid ${isDark ? DARK.teal.border : LIGHT.teal.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${isDark ? DARK.teal.shadow : LIGHT.teal.shadow}`,
            p: 3, mb: 3,
            transition: 'transform 0.15s, box-shadow 0.15s',
            '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${isDark ? DARK.teal.shadow : LIGHT.teal.shadow}` }
          }}>
            <CharacterMessage
              speaker={currentItem?.instructor || 'Ms. Mabrouki'}
              message={currentItem?.instruction || 'First, play an individual matching game to connect promotion words with their definitions. The game will show the words and definitions - match them correctly!'}
            />
          </Box>

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
              <Box
                component="button"
                onClick={handleNext}
                sx={{
                  bgcolor: isDark ? DARK.orange.bg : LIGHT.orange.bg,
                  border: `2px solid ${isDark ? DARK.orange.border : LIGHT.orange.border}`,
                  borderRadius: '12px',
                  boxShadow: `3px 3px 0 ${isDark ? DARK.orange.shadow : LIGHT.orange.shadow}`,
                  px: 3, py: 1.5,
                  fontWeight: 700, fontSize: '1rem',
                  cursor: 'pointer', color: isDark ? DARK.orange.border : LIGHT.orange.shadow,
                  transition: 'transform 0.15s, box-shadow 0.15s',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${isDark ? DARK.orange.shadow : LIGHT.orange.shadow}` },
                  '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${isDark ? DARK.orange.shadow : LIGHT.orange.shadow}` }
                }}
              >
                Continue to Next Activity
              </Box>
            )}
          </Stack>

        </motion.div>
      </Container>
    </Box>
  )
}
