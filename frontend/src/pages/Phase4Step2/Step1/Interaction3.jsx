import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import SushiSpellGame from '../../../components/SushiSpellGame.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'
import { requestPhase42StepScore } from '../shared/routing.js'

/**
 * Phase 4.2 Step 1 - Interaction 3: Sushi Spell Game
 */

const TARGET_WORDS = [
  'hashtag', 'caption', 'viral', 'engagement',
  'emoji', 'tag', 'story', 'call-to-action'
]

export default function Phase4_2Step1Interaction3() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 1, interaction: 3, context: 'main' })
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

  const handleGameComplete = (result) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction3', is_correct: true, score: result })
    console.log('Sushi Spell Game completed:', result)
    setGameResult(result)
    const score = result.foundWords?.length || 0
    const timeElapsed = result.timeElapsed || 0
    sessionStorage.setItem('phase4_2_step1_int3_score', score)
    sessionStorage.setItem('phase4_2_step1_int3_time', timeElapsed)
    sessionStorage.setItem('phase4_2_step1_int3_words', JSON.stringify(result.foundWords || []))
    logGameCompletion(score, timeElapsed, result.foundWords || [])
  }

  const logGameCompletion = async (score, timeElapsed, foundWords) => {
    try {
      const response = await fetch('/api/phase4_2/interaction/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ step: 1, interaction: 3, score, max_score: TARGET_WORDS.length, time_taken: timeElapsed, found_words: foundWords, completed: true, game_type: 'sushi_spell' })
      })
      const data = await response.json()
      if (data.success) console.log('Interaction 3 (Sushi Spell) logged to backend')
    } catch (error) {
      console.error('Failed to log interaction completion:', error)
    }
  }

  const handleContinue = async () => {
    const int1Score = parseInt(sessionStorage.getItem('phase4_2_step1_interaction1_score') || '0')
    const int2Score = parseInt(sessionStorage.getItem('phase4_2_step1_int2_score') || '0')
    const int3Score = parseInt(sessionStorage.getItem('phase4_2_step1_int3_score') || '0')
    try {
      const data = await requestPhase42StepScore(1, {
        interaction1_score: int1Score,
        interaction1_max_score: 8,
        interaction2_score: int2Score,
        interaction2_max_score: 5,
        interaction3_score: int3Score,
        interaction3_max_score: TARGET_WORDS.length,
      })
      sessionStorage.setItem('phase4_2_step1_total_score', data.total.score.toString())
      sessionStorage.setItem('phase4_2_step1_total_max', data.total.max_score.toString())
      sessionStorage.setItem('phase4_2_step1_next_url', data.total.next_url)
      sessionStorage.setItem('phase4_2_step1_remedial_level', data.total.remedial_level)
      navigate(data.total.next_url)
    } catch (error) {
      console.error('Failed to calculate Phase 4.2 Step 1 routing:', error)
      alert('Unable to calculate the next route right now. Please try again.')
    }
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
              Step 1: Engage - Interaction 3
            </Typography>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}>
              Practice spelling social media vocabulary using Sushi Spell
            </Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3,
          }}>
            <CharacterMessage
              speaker="Emna"
              message="To practise more social media terms, let's play another quick individual game!"
            />
          </Box>

          {/* Instructions */}
          <Box sx={{
            bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ color: P.yellow.shadow }}>
              How to Play:
            </Typography>
            <Stack spacing={1}>
              {[
                '• Click letters as they fall to spell words',
                '• Think of words related to social media: hashtag, caption, viral, engagement, emoji, tag, story, call-to-action',
                '• Longer words give more points!',
                '• Click "Submit Word" when you\'re ready to check your spelling'
              ].map((line, i) => (
                <Typography key={i} variant="body2" sx={{ color: P.yellow.shadow }}>{line}</Typography>
              ))}
            </Stack>
          </Box>

          {/* Hint */}
          {!gameResult && (
            <Box sx={{
              bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
              p: 2, mb: 3,
            }}>
              <Typography variant="body2" sx={{ color: P.green.shadow }}>
                <strong>Hint:</strong> Try longer words like "call-to-action" or "engagement" for higher scores.
              </Typography>
            </Box>
          )}

          {/* Sushi Spell Game */}
          <Box sx={{
            bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
            p: 3, mb: 4,
          }}>
            <SushiSpellGame onComplete={handleGameComplete} targetWords={TARGET_WORDS} />
          </Box>

          {/* Results Display */}
          {gameResult && (
            <>
              <Box sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
                p: 4, mb: 3,
              }}>
                <Typography variant="h4" gutterBottom textAlign="center" fontWeight="bold" sx={{ color: P.green.shadow }}>
                  Game Complete!
                </Typography>

                <Box sx={{ textAlign: 'center', my: 2 }}>
                  <Typography variant="h2" fontWeight="bold" sx={{ color: P.green.shadow }}>
                    {gameResult.foundWords?.length || 0}
                  </Typography>
                  <Typography variant="h6" sx={{ color: P.green.shadow }}>
                    Words Found
                  </Typography>
                </Box>

                {gameResult.foundWords && gameResult.foundWords.length > 0 && (
                  <Box sx={{ my: 3 }}>
                    <Typography variant="subtitle1" gutterBottom textAlign="center" fontWeight="bold" sx={{ color: P.green.shadow }}>
                      Words You Spelled:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center" sx={{ mt: 2 }} useFlexGap>
                      {gameResult.foundWords.map((word, index) => (
                        <Box key={index} component="span" sx={{
                          bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                          borderRadius: '999px', px: 2, py: 0.5,
                          fontSize: '0.85rem', fontWeight: 700, color: P.green.shadow,
                          display: 'inline-block'
                        }}>{word}</Box>
                      ))}
                    </Stack>
                  </Box>
                )}

                {gameResult.foundWords && gameResult.foundWords.length >= 5 && (
                  <Typography variant="h6" textAlign="center" fontWeight="bold" sx={{ color: P.green.shadow, mt: 2 }}>
                    ✨ Excellent spelling skills!
                  </Typography>
                )}
              </Box>

              <Box component="button" onClick={handleContinue} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: 'pointer', color: P.green.shadow, width: '100%',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` }
              }}>
                Complete Step 1 - Return to Dashboard
              </Box>
            </>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
