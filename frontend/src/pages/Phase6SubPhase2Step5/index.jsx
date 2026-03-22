import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import WordshakeGame from '../../components/phase5/WordshakeGame.jsx'

const LIGHT = {
  pageBg: '#FFFDE7',
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
}

const VOCABULARY = ['spelling', 'correct', 'feedback', 'constructive', 'specific']
const WORDSHAKE_WORDS = ['constructive', 'specific', 'balanced', 'empathy', 'actionable', 'helpful']

export default function Phase6SP2Step5Intro() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const [wordshakeDone, setWordshakeDone] = useState(false)

  const cardSx = (color) => ({
    bgcolor: color.bg,
    border: `2px solid ${color.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${color.shadow}`,
    p: 3,
  })

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>Phase 6: Reflection and Evaluation</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.border }}>SubPhase 6.2: Peer Feedback Discussion</Typography>
            <Typography variant="h6" sx={{ color: P.blue.shadow }}>Step 5: Evaluate - Tone, Spelling, and Structure</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.teal.border }}>Scenario</Typography>
            <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic', color: P.teal.shadow }}>
              Mr. Karim introduces the activity for today's lesson.
            </Typography>
            <Typography variant="body1">
              "This feedback has tone problems. Make it more professional and polite."
            </Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Box sx={{ ...cardSx(P.purple), mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.purple.border }}>Key Vocabulary</Typography>
            <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 2 }}>
              {VOCABULARY.map((word, idx) => (
                <Box key={idx} sx={{
                  bgcolor: P.purple.border,
                  color: 'white',
                  fontWeight: 'bold',
                  px: 2,
                  py: 0.5,
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  border: `2px solid ${P.purple.shadow}`,
                  boxShadow: `2px 2px 0 ${P.purple.shadow}`,
                }}>
                  {word}
                </Box>
              ))}
            </Stack>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Box sx={{ mb: 3 }}>
            <WordshakeGame
              step={5}
              interaction={0}
              targetWords={WORDSHAKE_WORDS}
              onComplete={() => setWordshakeDone(true)}
              subphase={2}
            />
          </Box>
        </motion.div>

        {wordshakeDone && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Box
                component="button"
                onClick={() => navigate('/phase6/subphase/2/step/5/interaction/1')}
                sx={{
                  ...cardSx(P.green),
                  cursor: 'pointer',
                  border: `2px solid ${P.green.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 6,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  color: P.green.shadow,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s',
                }}
              >
                <PlayArrowIcon />
                Start Activities
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
