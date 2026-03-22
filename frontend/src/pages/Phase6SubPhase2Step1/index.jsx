import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Container, Typography, CircularProgress, Stack
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import LockIcon from '@mui/icons-material/Lock'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../lib/phase6_api.jsx'
import WordshakeGame from '../../components/phase5/WordshakeGame.jsx'

const LIGHT = { pageBg: '#FFFDE7', blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' }, purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' }, orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' } }
const DARK = { pageBg: '#0F0F1A', blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' }, purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' }, orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' } }

const WORDSHAKE_WORDS = ['feedback', 'constructive', 'positive', 'suggestion', 'strength', 'weakness', 'improve', 'polite', 'listen', 'agree', 'disagree', 'helpful']

const VOCABULARY_CHIPS = [
  'feedback', 'constructive', 'positive', 'suggestion', 'strength',
  'weakness', 'improve', 'polite', 'listen', 'agree', 'disagree', 'helpful'
]

const LEARNING_OUTCOMES = [
  { title: 'Share your feedback experience', desc: 'Reflect on times you gave or received feedback' },
  { title: 'Learn feedback vocabulary', desc: 'Master words like constructive, suggestion, strength, weakness' },
  { title: 'Practice giving and receiving feedback politely', desc: 'Use polite language to share opinions' }
]

export default function Phase6SubPhase2Step1Intro() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const [loading, setLoading] = useState(true)
  const [subphase1Complete, setSubphase1Complete] = useState(false)
  const [subphase1Score, setSubphase1Score] = useState(0)
  const [requiredScore, setRequiredScore] = useState(12)
  const [wordshakeDone, setWordshakeDone] = useState(false)

  useEffect(() => {
    checkSubPhase1Completion()
  }, [])

  const checkSubPhase1Completion = async () => {
    try {
      const result = await phase6API.checkSubPhase1Completion()
      if (result.success && result.data) {
        setSubphase1Complete(result.data.is_complete)
        setSubphase1Score(result.data.total_score || 0)
        setRequiredScore(result.data.required_score || 12)
      }
    } catch (error) {
      console.error('Error checking SubPhase 1 completion:', error)
      setSubphase1Complete(true)
    } finally {
      setLoading(false)
    }
  }

  const handleStart = () => {
    navigate('/phase6/subphase/2/step/1/interaction/1')
  }

  const videoId = 'wtl5UrrgU8c'

  const cardSx = (color) => ({
    bgcolor: color.bg,
    border: `2px solid ${color.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${color.shadow}`,
    p: 3
  })

  const hoverSx = (color) => ({
    '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${color.shadow}` }
  })

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>
              Phase 6: Reflection &amp; Evaluation
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.border }}>
              SubPhase 2: Peer Feedback Discussion
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ color: P.blue.border }}>
              Step 1: Engage
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Learn how to give and receive feedback professionally and constructively
            </Typography>
          </Box>
        </motion.div>

        {/* Scenario */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.teal.border }}>
              Scenario
            </Typography>
            <Box sx={{ p: 2, bgcolor: P.teal.bg, borderRadius: '12px', borderLeft: `4px solid ${P.teal.border}` }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: P.teal.border }} gutterBottom>
                Mr. Karim
              </Typography>
              <Typography variant="body1" sx={{ fontStyle: 'italic' }} color="text.secondary">
                "Congratulations on your reports! Now let's learn how to give and receive feedback
                professionally. Feedback is a gift - when it's constructive and polite, it helps
                everyone grow. Today we'll explore how to share our thoughts in a helpful way."
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Video */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>
              Watch: Understanding Feedback Culture
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Mr. Karim shares a video about why feedback matters and how to give it effectively.
            </Typography>
            <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px', bgcolor: '#000', mb: 2 }}>
              <iframe
                width="100%" height="100%"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="Feedback Culture Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              <strong>Think about:</strong> What makes feedback helpful? How do you feel when you receive feedback?
            </Typography>
          </Box>
        </motion.div>

        {/* Learning Outcomes */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Box sx={{ ...cardSx(P.purple), mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.purple.border }}>
              What You'll Learn in This Step
            </Typography>
            <Stack spacing={2} sx={{ mt: 1 }}>
              {LEARNING_OUTCOMES.map((outcome, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <CheckCircleIcon sx={{ color: P.purple.border, mt: 0.3, flexShrink: 0 }} />
                  <Box>
                    <Typography variant="body1" fontWeight="bold">{outcome.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{outcome.desc}</Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
        </motion.div>

        {/* Vocabulary Preview */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.teal.border }}>
              Key Vocabulary You'll Practice
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {VOCABULARY_CHIPS.map((word, idx) => (
                <Box key={idx} sx={{ px: 2, py: 0.5, bgcolor: P.teal.border, color: 'white', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.85rem' }}>
                  {word}
                </Box>
              ))}
            </Box>
          </Box>
        </motion.div>

        {/* Activities Overview */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>
              Step 1 Activities
            </Typography>
            <Stack spacing={2}>
              {[
                { title: 'Activity 1 - Wordshake Game (3 min)', desc: 'Activate feedback vocabulary by forming as many words as possible' },
                { title: 'Activity 2 - Share Your Feedback Experience', desc: 'Write 3-5 sentences about a time you received feedback and how it made you feel' },
                { title: 'Activity 3 - Sushi Spell Game (2 min)', desc: 'Practise spelling key feedback vocabulary words correctly' }
              ].map((act, idx) => (
                <Box key={idx} sx={{ p: 2, bgcolor: P.orange.bg, borderRadius: '12px', border: `1px solid ${P.orange.border}` }}>
                  <Typography variant="subtitle1" fontWeight="bold">{act.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{act.desc}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </motion.div>

        {/* Progression Check */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <CircularProgress sx={{ color: P.blue.border }} />
          </Box>
        ) : !subphase1Complete ? (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <Box sx={{ ...cardSx(P.orange), mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LockIcon sx={{ fontSize: 40, color: P.orange.border, mr: 2 }} />
                <Typography variant="h5" fontWeight="bold" sx={{ color: P.orange.border }}>
                  SubPhase 2 Locked
                </Typography>
              </Box>
              <Box sx={{ p: 2, bgcolor: P.yellow.bg, borderRadius: '12px', border: `1px solid ${P.yellow.border}`, mb: 2 }}>
                <Typography variant="body1" gutterBottom fontWeight="bold">
                  Complete SubPhase 6.1 (Writing a Post-Event Report) first!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  You need to complete Phase 6 SubPhase 1 with a total score of at least {requiredScore} points
                  across all 5 steps before accessing SubPhase 2.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Your current SubPhase 1 score: <strong>{subphase1Score} / {requiredScore}</strong>
                </Typography>
              </Box>
              <Box
                component="button"
                onClick={() => navigate('/phase6/subphase/1/step/1')}
                sx={{
                  ...cardSx(P.orange), ...hoverSx(P.orange),
                  border: `2px solid ${P.orange.border}`,
                  cursor: 'pointer', display: 'inline-block',
                  background: 'none', transition: 'all 0.2s',
                  fontFamily: 'inherit', fontSize: '1rem', fontWeight: 'bold',
                  color: P.orange.border, mt: 1
                }}
              >
                Go to SubPhase 6.1
              </Box>
            </Box>
          </motion.div>
        ) : (
          <>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <Box sx={{ mb: 3 }}>
                <WordshakeGame
                  step={1}
                  interaction={0}
                  targetWords={WORDSHAKE_WORDS}
                  onComplete={() => setWordshakeDone(true)}
                  subphase={2}
                />
              </Box>
            </motion.div>
            {wordshakeDone && (
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 4 }}>
                  <Box
                    component="button"
                    onClick={handleStart}
                    sx={{
                      ...cardSx(P.green), ...hoverSx(P.green),
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 1,
                      background: 'none', border: `2px solid ${P.green.border}`,
                      fontFamily: 'inherit', fontSize: '1.1rem', fontWeight: 'bold',
                      color: P.green.border, transition: 'all 0.2s', px: 4, py: 1.5
                    }}
                  >
                    <PlayArrowIcon />
                    Start Feedback Activities
                  </Box>
                </Box>
              </motion.div>
            )}
          </>
        )}
      </Container>
    </Box>
  )
}
