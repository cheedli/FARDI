import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Chip, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import SushiSpellGame from '../../components/phase5/SushiSpellGame.jsx'

const LIGHT = {
  pageBg: '#FFFDE7',
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  purple: { bg: '#3B0764', border: '#C084FC', shadow: '#6B21A8' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
}

const VOCABULARY = ['sandwich', 'positive', 'suggestion', 'specific', 'encourage', 'constructive']
const SUSHI_WORDS = ['feedback', 'constructive', 'positive', 'suggestion', 'improve']

export default function Phase6SP2Step2Intro() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const [sushiDone, setSushiDone] = useState(false)

  const cardSx = (color) => ({
    bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3,
  })

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: P.blue.border }}>
              Phase 6: Reflection and Evaluation
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.shadow }}>
              SubPhase 6.2: Peer Feedback Discussion
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              Step 2: Explore — Feedback Sandwich Model
            </Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.teal.border }}>Scenario</Typography>
            <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic', color: 'text.secondary' }}>
              Mr. Karim introduces the activity for today's lesson.
            </Typography>
            <Typography variant="body1">"Spell these feedback vocabulary words!"</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }}>
          <Box sx={{ ...cardSx(P.purple), mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.purple.border }}>Key Vocabulary</Typography>
            <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 2 }}>
              {VOCABULARY.map((word, idx) => (
                <Chip
                  key={idx}
                  label={word}
                  sx={{
                    bgcolor: P.purple.bg,
                    border: `2px solid ${P.purple.border}`,
                    color: P.purple.border,
                    fontWeight: 'bold',
                  }}
                />
              ))}
            </Stack>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }}>
          <Box sx={{ mb: 3 }}>
            <SushiSpellGame step={2} interaction={0} targetWords={SUSHI_WORDS} onComplete={() => setSushiDone(true)} subphase={2} />
          </Box>
        </motion.div>

        {sushiDone && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Box
                component="button"
                onClick={() => navigate('/phase6/subphase/2/step/2/interaction/1')}
                sx={{
                  px: 6, py: 2,
                  borderRadius: '20px',
                  border: `2px solid ${P.orange.border}`,
                  bgcolor: P.orange.bg,
                  boxShadow: `4px 4px 0 ${P.orange.shadow}`,
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` },
                  transition: 'all 0.15s',
                }}
              >
                <PlayArrowIcon sx={{ color: P.orange.border }} />
                <span style={{ color: P.orange.border }}>Start Activities</span>
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
