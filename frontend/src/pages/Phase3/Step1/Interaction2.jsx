import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import Avatar from '../../../components/Avatar.jsx'
import SushiSpellGame from '../../../components/SushiSpellGame.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'

const LIGHT = {
  pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', divider: '#E0E0E0',
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
  teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
  orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
}
const DARK = {
  pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', divider: '#2A2A4A',
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
  orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' } }),
}

const clay = (c) => ({
  bgcolor: c.bg,
  border: `2px solid ${c.border}`,
  borderRadius: '20px',
  boxShadow: `4px 4px 0 ${c.shadow}`,
})

const TARGET_WORDS = ['sponsor', 'budget', 'funding', 'expense', 'donation', 'ticket', 'profit', 'cost']

export default function Phase3Step1Interaction2() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const D = isDark ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 1, interaction: 2, context: 'main' })
  const [gameResult, setGameResult] = useState(null)

  const handleGameComplete = (result) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction2', is_correct: true, score: result })
    console.log('Sushi Spell Game completed:', result)
    setGameResult(result)

    const score = result.foundWords?.length || 0
    const timeElapsed = result.timeElapsed || 0
    sessionStorage.setItem('phase3_step1_int2_score', score)
    sessionStorage.setItem('phase3_step1_int2_time', timeElapsed)
    sessionStorage.setItem('phase3_step1_int2_words', JSON.stringify(result.foundWords || []))

    logGameCompletion(score, timeElapsed, result.foundWords || [])
  }

  const logGameCompletion = async (score, timeElapsed, foundWords) => {
    try {
      const response = await fetch('/api/phase3/interaction/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ step: 1, interaction: 2, score, max_score: 8, time_taken: timeElapsed, found_words: foundWords, completed: true })
      })
      const data = await response.json()
      if (data.success) console.log('Interaction 2 completion logged to backend')
    } catch (error) {
      console.error('Failed to log interaction completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/app/phase3/step/1/interaction/3')
  }

  const foundCount = gameResult?.foundWords?.length || 0
  const isExcellent = foundCount >= 5

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: D.pageBg }}>
      <Container maxWidth="md" sx={{ pt: { xs: 3, md: 4 }, pb: 6 }}>

        {/* Phase Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Box sx={{ ...clay(D.green), p: { xs: 2.5, md: 3 }, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <MonetizationOnIcon sx={{ fontSize: { xs: 32, md: 40 }, color: D.green.border }} />
            <Box>
              <Typography variant="h5" fontWeight={800} sx={{ color: D.heading, lineHeight: 1.2 }}>
                Phase 3: Sponsorship &amp; Budgeting
              </Typography>
              <Typography variant="body2" sx={{ color: D.body, mt: 0.5 }}>
                Step 1: Engage — Interaction 2: Sushi Spell
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Character Message */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Box sx={{ ...clay(D.blue), p: { xs: 2, md: 2.5 }, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Avatar character="SKANDER" size={48} />
              <Box>
                <Typography variant="caption" fontWeight={800} sx={{ color: D.blue.border, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Skander
                </Typography>
                <Typography variant="body1" sx={{ color: D.body, mt: 0.5 }}>
                  Time for a fun spelling challenge! Play Sushi Spell to practice your financial vocabulary. Create words from the letters that fall. The longer the word, the more points you earn!
                </Typography>
              </Box>
            </Box>
          </Box>
        </motion.div>

        {/* Instructions */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          <Box sx={{ ...clay(D.teal), p: { xs: 2, md: 2.5 }, mb: 3 }}>
            <Typography variant="subtitle2" fontWeight={800} sx={{ color: D.teal.border, mb: 1 }}>
              How to Play
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {[
                'Click letters as they fall to spell words',
                'Think of words related to sponsorship, budgets, and funding',
                'Longer words give more points!',
                'Click "Submit Word" when you\'re ready to check your spelling',
              ].map((tip, i) => (
                <Typography key={i} variant="body2" sx={{ color: D.body }}>• {tip}</Typography>
              ))}
            </Box>
          </Box>
        </motion.div>

        {/* Game */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
          <Box sx={{ mb: 4 }}>
            <SushiSpellGame onComplete={handleGameComplete} targetWords={TARGET_WORDS} />
          </Box>
        </motion.div>

        {/* Results */}
        {gameResult && (
          <>
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
              <Box sx={{ ...clay(isExcellent ? D.green : D.orange), p: { xs: 2.5, md: 3 }, mb: 3, textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                  <CheckCircleIcon sx={{ color: isExcellent ? D.green.border : D.orange.border, fontSize: 30 }} />
                  <Typography variant="h5" fontWeight={800} sx={{ color: D.heading }}>
                    Game Complete!
                  </Typography>
                </Box>

                <Typography variant="h2" fontWeight={800} sx={{ color: isExcellent ? D.green.border : D.orange.border }}>
                  {foundCount}
                </Typography>
                <Typography variant="body2" fontWeight={600} sx={{ color: D.muted, mb: 2 }}>Words Found</Typography>

                {gameResult.foundWords && gameResult.foundWords.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" fontWeight={800} sx={{ color: D.heading, mb: 1.5 }}>
                      Words You Spelled:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                      {gameResult.foundWords.map((word, index) => (
                        <Box
                          key={index}
                          sx={{
                            px: 1.75, py: 0.4, borderRadius: '50px',
                            bgcolor: D.green.bg,
                            border: `2px solid ${D.green.border}`,
                            fontSize: '0.8rem', fontWeight: 800, color: D.green.border,
                          }}
                        >
                          {word}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

                {isExcellent && (
                  <Typography variant="body2" fontWeight={800} sx={{ color: D.green.border, mt: 2 }}>
                    Excellent spelling skills!
                  </Typography>
                )}
              </Box>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Box
                  component="button"
                  onClick={handleContinue}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 1,
                    px: 3, py: 1.25,
                    bgcolor: D.green.bg, color: D.green.border,
                    border: `2px solid ${D.green.border}`,
                    borderRadius: '14px',
                    boxShadow: `4px 4px 0 ${D.green.shadow}`,
                    fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.green.shadow}` },
                  }}
                >
                  Continue to Next Activity
                  <ArrowForwardIcon fontSize="small" />
                </Box>
              </Box>
            </motion.div>
          </>
        )}

      </Container>
    </Box>
  )
}
