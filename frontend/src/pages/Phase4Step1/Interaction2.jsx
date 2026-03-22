import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
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

export default function Phase4Step1Interaction2() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 2, context: 'main' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameResult, setGameResult] = useState(null)

  const handleWordshakeComplete = (result) => {
    console.log('Wordshake completed:', result)

    const interaction2Score = result.score || 0
    sessionStorage.setItem('phase4_step1_interaction2_score', interaction2Score)
    console.log('Interaction 2 Score stored:', interaction2Score)

    setGameCompleted(true)
    setGameResult(result)
  }

  const handleCompleteStep = () => {
    navigate('/phase4/step/1/interaction/3')
  }

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
              Step 1: Engage - Interaction 2
            </Typography>
            <Typography variant="body1" color={isDark ? 'rgba(255,255,255,0.8)' : 'text.secondary'}>
              Wordshake Challenge: Form marketing vocabulary words
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
              speaker="Skander"
              message="Well done on matching! Now, play for 3 minutes to form as many of the target words as you can."
            />
          </Box>

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
              <Box
                component="button"
                onClick={handleCompleteStep}
                sx={{
                  bgcolor: isDark ? DARK.green.bg : LIGHT.green.bg,
                  border: `2px solid ${isDark ? DARK.green.border : LIGHT.green.border}`,
                  borderRadius: '12px',
                  boxShadow: `3px 3px 0 ${isDark ? DARK.green.shadow : LIGHT.green.shadow}`,
                  px: 3, py: 1.5,
                  fontWeight: 700, fontSize: '1rem',
                  cursor: 'pointer', color: isDark ? DARK.green.border : LIGHT.green.shadow,
                  transition: 'transform 0.15s, box-shadow 0.15s',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${isDark ? DARK.green.shadow : LIGHT.green.shadow}` },
                  '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${isDark ? DARK.green.shadow : LIGHT.green.shadow}` }
                }}
              >
                Complete Activity
              </Box>
            )}
          </Stack>

        </motion.div>
      </Container>
    </Box>
  )
}
