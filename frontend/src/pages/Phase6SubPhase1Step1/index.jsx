import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, CircularProgress } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../components/Avatar.jsx'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import LockIcon from '@mui/icons-material/Lock'
import { phase6API } from '../../lib/phase6_api.jsx'
import WordshakeGame from '../../components/phase5/WordshakeGame.jsx'

/**
 * Phase 6 SubPhase 1 Step 1: Engage - Writing a Post-Event Report
 * Intro page with scenario setup and learning outcomes
 */

const LIGHT = {
  pageBg: '#FFFDE7',
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

const VOCABULARY_WORDS = [
  'success', 'challenge', 'feedback', 'improve', 'achievement',
  'strength', 'weakness', 'recommend', 'summary', 'positive', 'negative'
]

const LEARNING_OUTCOMES = [
  {
    title: 'Reflection Writing:',
    description: 'Write a brief reflection on festival success and challenges using past tense'
  },
  {
    title: 'Key Vocabulary:',
    description: 'Use vocabulary for reviewing events: success, challenge, achievement, strength, weakness'
  },
  {
    title: 'Sequencing Language:',
    description: 'Practice sequencing and evaluation language in written reflection'
  }
]

export default function Phase6SubPhase1Step1Intro() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const [checkingPhase5, setCheckingPhase5] = useState(true)
  const [phase5Complete, setPhase5Complete] = useState(false)
  const [wordshakeDone, setWordshakeDone] = useState(false)

  useEffect(() => {
    checkPhase5()
  }, [])

  const checkPhase5 = async () => {
    setCheckingPhase5(true)
    try {
      const result = await phase6API.checkPhase5Completion()
      if (result && result.completed) {
        setPhase5Complete(true)
      } else {
        setPhase5Complete(false)
      }
    } catch (error) {
      console.error('Error checking Phase 5 completion:', error)
      // Default to allowing access if check fails to avoid blocking
      setPhase5Complete(true)
    } finally {
      setCheckingPhase5(false)
    }
  }

  const handleStartInteraction1 = () => {
    navigate('/phase6/subphase/1/step/1/interaction/1')
  }

  if (checkingPhase5) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h6">Checking prerequisites...</Typography>
        </Box>
      </Box>
    )
  }

  if (!phase5Complete) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{
              bgcolor: P.orange.bg,
              border: `2px solid ${P.orange.border}`,
              borderRadius: '20px',
              boxShadow: `4px 4px 0 ${P.orange.shadow}`,
              p: 4,
              textAlign: 'center'
            }}>
              <LockIcon sx={{ fontSize: 80, color: P.orange.border, mb: 2 }} />
              <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>
                Phase 6 is Locked
              </Typography>
              <Typography variant="h6" gutterBottom sx={{ color: P.orange.border }}>
                You need to complete Phase 5 first
              </Typography>
              <Box sx={{
                bgcolor: P.yellow.bg,
                border: `2px solid ${P.yellow.border}`,
                borderRadius: '12px',
                p: 2,
                mt: 3,
                mb: 3,
                textAlign: 'left'
              }}>
                <Typography variant="body1" sx={{ color: P.yellow.shadow }}>
                  Phase 6 (Reflection and Evaluation) builds on the skills you developed in Phase 5
                  (Execution and Problem-Solving). Please complete all Phase 5 steps before proceeding.
                </Typography>
              </Box>
              <Box
                component="button"
                onClick={() => navigate('/phase5/subphase/1/step/1')}
                sx={{
                  cursor: 'pointer',
                  px: 4,
                  py: 1.5,
                  bgcolor: P.orange.bg,
                  border: `2px solid ${P.orange.border}`,
                  borderRadius: '16px',
                  boxShadow: `4px 4px 0 ${P.orange.shadow}`,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: P.orange.shadow,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` },
                  transition: 'all 0.15s'
                }}
              >
                Go to Phase 5
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{
            bgcolor: P.blue.bg,
            border: `2px solid ${P.blue.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3,
            mb: 3
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>
              Phase 6: Reflection and Evaluation
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.border }}>
              SubPhase 6.1: Writing a Post-Event Report
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ color: P.blue.shadow }}>
              Step 1: Engage - Reflecting on the Festival
            </Typography>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}>
              Look back on the Global Cultures Festival and reflect on what happened
            </Typography>
          </Box>
        </motion.div>

        {/* Scenario Introduction */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <Box sx={{
            bgcolor: P.teal.bg,
            border: `2px solid ${P.teal.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3,
            mb: 3
          }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.teal.shadow, mb: 2 }}>
              Scenario
            </Typography>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="The festival is over! Now it's time to reflect on what happened. Gather around, everyone — let's think about what went well, what was challenging, and how we can improve for next time. Writing a good post-event report is an important professional skill!"
            />
          </Box>
        </motion.div>

        {/* Learning Outcomes */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          <Box sx={{
            bgcolor: P.green.bg,
            border: `2px solid ${P.green.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.green.shadow}`,
            p: 3,
            mb: 3
          }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.green.shadow }}>
              What You'll Learn
            </Typography>
            <Box component="ul" sx={{ pl: 2, mt: 1 }}>
              {LEARNING_OUTCOMES.map((outcome, idx) => (
                <Typography key={idx} component="li" variant="body1" sx={{ mb: 1, color: P.green.shadow }}>
                  <strong>{outcome.title}</strong> {outcome.description}
                </Typography>
              ))}
            </Box>
          </Box>
        </motion.div>

        {/* Key Vocabulary Preview */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
          <Box sx={{
            bgcolor: P.teal.bg,
            border: `2px solid ${P.teal.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3,
            mb: 3
          }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.teal.shadow }}>
              Key Vocabulary You'll Practice
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 2 }}>
              {VOCABULARY_WORDS.map((word, idx) => (
                <Box
                  key={idx}
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    bgcolor: P.teal.bg,
                    border: `2px solid ${P.teal.border}`,
                    borderRadius: '12px',
                    boxShadow: `2px 2px 0 ${P.teal.shadow}`,
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    color: P.teal.shadow,
                    '&:hover': { transform: 'translate(-1px,-1px)', boxShadow: `3px 3px 0 ${P.teal.shadow}` },
                    transition: 'all 0.15s'
                  }}
                >
                  {word}
                </Box>
              ))}
            </Stack>
          </Box>
        </motion.div>

        {/* Activity Overview */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Box sx={{
            bgcolor: P.orange.bg,
            border: `2px solid ${P.orange.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.orange.shadow}`,
            p: 3,
            mb: 3
          }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>
              Today's Activities
            </Typography>
            <Stack spacing={2} sx={{ mt: 1 }}>
              {[
                { num: 1, title: 'Wordshake Game (3 min)', desc: 'Find words related to reviewing and reflecting on events' },
                { num: 2, title: 'Festival Reflection Writing', desc: 'Write 3-5 sentences about what went well and what was challenging' },
                { num: 3, title: 'Sushi Spell Game (2 min)', desc: 'Practise spelling key evaluation vocabulary correctly' }
              ].map((activity) => (
                <Box
                  key={activity.num}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    p: 2,
                    bgcolor: P.yellow.bg,
                    border: `2px solid ${P.yellow.border}`,
                    borderRadius: '14px',
                    boxShadow: `2px 2px 0 ${P.yellow.shadow}`,
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      bgcolor: P.orange.bg,
                      border: `2px solid ${P.orange.border}`,
                      boxShadow: `2px 2px 0 ${P.orange.shadow}`,
                      color: P.orange.shadow,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      flexShrink: 0
                    }}
                  >
                    {activity.num}
                  </Box>
                  <Box>
                    <Typography variant="body1" fontWeight="bold" sx={{ color: P.orange.shadow }}>
                      {activity.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: P.yellow.shadow }}>
                      {activity.desc}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
        </motion.div>

        {/* Wordshake Game */}
        <Box sx={{ mb: 3 }}>
          <WordshakeGame
            step={1}
            interaction={0}
            targetWords={VOCABULARY_WORDS}
            onComplete={() => setWordshakeDone(true)}
            subphase={1}
          />
        </Box>

        {/* Start Button */}
        {wordshakeDone && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Box
                component="button"
                onClick={handleStartInteraction1}
                sx={{
                  cursor: 'pointer',
                  px: 6,
                  py: 2,
                  bgcolor: P.green.bg,
                  border: `2px solid ${P.green.border}`,
                  borderRadius: '20px',
                  boxShadow: `4px 4px 0 ${P.green.shadow}`,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  color: P.green.shadow,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s'
                }}
              >
                <PlayArrowIcon />
                Start Reflection Activities
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
