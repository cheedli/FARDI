import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import SushiSpellGame from '../../../components/SushiSpellGame.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 3 - Interaction 3: Sushi Spell Game
 * Practice spelling social media vocabulary using Sushi Spell
 */

const TARGET_WORDS = [
  'hashtag',
  'caption',
  'viral',
  'engagement',
  'emoji',
  'tag',
  'story',
  'call-to-action',
  'thread',
  'reach'
]

export default function Phase4_2Step3Interaction3() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 3, context: 'main' })
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
    sessionStorage.setItem('phase4_2_step3_int3_score', score)
    sessionStorage.setItem('phase4_2_step3_int3_time', timeElapsed)
    sessionStorage.setItem('phase4_2_step3_int3_words', JSON.stringify(result.foundWords || []))

    logGameCompletion(score, timeElapsed, result.foundWords || [])
  }

  const logGameCompletion = async (score, timeElapsed, foundWords) => {
    try {
      const response = await fetch('/api/phase4_2/interaction/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          step: 3,
          interaction: 3,
          score: score,
          max_score: TARGET_WORDS.length,
          time_taken: timeElapsed,
          found_words: foundWords,
          completed: true,
          game_type: 'sushi_spell'
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('Interaction 3 (Sushi Spell) logged to backend')
      }
    } catch (error) {
      console.error('Failed to log interaction completion:', error)
    }
  }

  const handleContinue = () => {
    const cumulativeScore = parseInt(sessionStorage.getItem('phase4_2_step3_score') || '0')
    const int3Score = parseInt(sessionStorage.getItem('phase4_2_step3_int3_score') || '0')

    const totalScore = cumulativeScore + int3Score
    const totalMax = 10 + TARGET_WORDS.length
    const percentage = (totalScore / totalMax) * 100

    sessionStorage.setItem('phase4_2_step3_total_score', totalScore.toString())
    sessionStorage.setItem('phase4_2_step3_total_max', totalMax.toString())
    sessionStorage.setItem('phase4_2_step3_percentage', percentage.toFixed(2))

    console.log(`[Phase 4.2 Step 3 - TOTAL] Score: ${totalScore}/${totalMax} (${percentage.toFixed(1)}%)`)

    if (percentage >= 80) {
      console.log('[Phase 4.2 Step 3] >=80% -> Proceeding to Step 4')
      navigate('/app/phase4_2/step/4/interaction/1')
    } else {
      console.log('[Phase 4.2 Step 3] <80% -> Need to retry')
      alert(`Your score was ${percentage.toFixed(1)}%. You need 80% or higher to proceed to Step 4. Please review the material and try again.`)
      navigate('/app/phase4_2/step/3/interaction/1')
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
            p: 3, mb: 3
          }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: P.blue.shadow }}>
              Phase 4.2: Marketing & Promotion (Social Media Focus)
            </Typography>
            <Typography variant="h5" sx={{ color: P.blue.border, mt: 1 }}>
              Step 3: Elaborate - Interaction 3
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Practice spelling social media vocabulary using Sushi Spell
            </Typography>
          </Box>

          {/* Character Message */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3
          }}>
            <CharacterMessage
              speaker="Ryan"
              message="Use a game to practise more social media terms from the videos! Let's play Sushi Spell!"
            />
          </Box>

          {/* Instructions */}
          <Box sx={{
            bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
            p: 3, mb: 3
          }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: P.orange.shadow }}>
              How to Play:
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2">• Click letters as they fall to spell words</Typography>
              <Typography variant="body2">• Think of words related to social media: hashtag, caption, viral, engagement, emoji, tag, story, call-to-action, thread, reach</Typography>
              <Typography variant="body2">• Longer words give more points!</Typography>
              <Typography variant="body2">• Click "Submit Word" when you're ready to check your spelling</Typography>
            </Stack>
          </Box>

          {/* Hint */}
          {!gameResult && (
            <Box sx={{
              bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
              p: 3, mb: 3
            }}>
              <Typography variant="body2">
                <strong>Hint:</strong> Try longer words like "call-to-action" or "engagement" for higher scores.
              </Typography>
            </Box>
          )}

          {/* Game */}
          <Box sx={{ mb: 4 }}>
            <SushiSpellGame onComplete={handleGameComplete} targetWords={TARGET_WORDS} />
          </Box>

          {/* Results */}
          {gameResult && (
            <>
              <Box sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
                p: 4, mb: 3, textAlign: 'center'
              }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: P.green.shadow, mb: 2 }}>
                  Game Complete!
                </Typography>
                <Typography variant="h5" sx={{ mb: 2 }}>Your Performance</Typography>
                <Typography variant="h2" sx={{ fontWeight: 'bold', color: P.green.border }}>
                  {gameResult.foundWords?.length || 0}
                </Typography>
                <Typography variant="h6" color="text.secondary">Words Found</Typography>

                {gameResult.foundWords && gameResult.foundWords.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                      Words You Spelled:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center" useFlexGap>
                      {gameResult.foundWords.map((word, index) => (
                        <Box key={index} component="span" sx={{
                          bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                          borderRadius: '999px', px: 2, py: 0.5,
                          fontSize: '0.85rem', fontWeight: 700, color: P.green.shadow,
                          display: 'inline-block', mb: 1
                        }}>
                          {word}
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}

                {gameResult.foundWords && gameResult.foundWords.length >= 5 && (
                  <Typography variant="h6" sx={{ color: P.green.shadow, mt: 2 }}>
                    Excellent spelling skills!
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Box component="button" onClick={handleContinue} sx={{
                  bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                  borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                  px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                  cursor: 'pointer', color: P.green.shadow, width: '100%',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                  '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` }
                }}>
                  Complete Step 3 - Return to Dashboard
                </Box>
              </Box>
            </>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
