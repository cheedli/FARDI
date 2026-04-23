import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
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
  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 1, interaction: 1, context: 'main' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameResult, setGameResult] = useState(null)
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
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
  const P = isDark ? DARK : LIGHT

  const handleWordshakeComplete = (result) => {
    console.log('Wordshake completed:', result)

    const interaction1Score = result.score || 0
    sessionStorage.setItem('phase4_2_step1_interaction1_score', interaction1Score)
    console.log('Phase 4.2 Step 1 Interaction 1 Score stored:', interaction1Score)

    setGameCompleted(true)
    setGameResult(result)

    logGameCompletion(result)
  }

  const logGameCompletion = async (result) => {
    try {
      const response = await fetch('/api/phase4_2/interaction/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          step: 1, interaction: 1, completed: true,
          score: result.score, total_words: result.totalWords,
          found_words: result.foundWords, game_type: 'wordshake',
          target_words: TARGET_WORDS
        })
      })
      const data = await response.json()
      if (data.success) console.log('Interaction 1 (Wordshake) logged to backend')
    } catch (error) {
      console.error('Failed to log interaction completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase4_2/step/1/interaction/2')
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>
              Phase 4.2: Marketing &amp; Promotion (Social Media Focus)
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.shadow }}>
              Step 1: Engage - Interaction 1
            </Typography>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}>
              Vocabulary Activation: Wordshake Challenge
            </Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3,
          }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="To activate our social media vocabulary, play Wordshake for 3 minutes and form as many of the target words as you can: hashtag, caption, viral, engagement, emoji, tag, story, ad."
            />
          </Box>

          {/* Wordshake Game */}
          <Box sx={{
            bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
            p: 3, mb: 3,
          }}>
            <WordshakeGame
              targetWords={TARGET_WORDS}
              duration={180}
              onComplete={handleWordshakeComplete}
            />
          </Box>

          {/* Navigation */}
          {gameCompleted && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
              <Box component="button" onClick={handleContinue} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: 'pointer', color: P.green.shadow,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` }
              }}>
                Continue to Next Activity
              </Box>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
