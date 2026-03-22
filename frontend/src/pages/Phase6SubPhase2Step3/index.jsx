import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Chip, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import WordshakeGame from '../../components/phase5/WordshakeGame.jsx'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' }, purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' } }
const DARK = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' }, purple: { bg: '#3B0764', border: '#C084FC', shadow: '#6B21A8' } }

const VOCABULARY = ['specific', 'actionable', 'clear', 'example', 'improve', 'understand', 'vague', 'general']
const WORDSHAKE_WORDS = ['feedback', 'constructive', 'positive', 'suggestion', 'specific', 'polite', 'empathy']

export default function Phase6SP2Step3Intro() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const [wordshakeDone, setWordshakeDone] = useState(false)

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: P.blue.border }}>Phase 6: Reflection and Evaluation</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.border }}>SubPhase 6.2: Peer Feedback Discussion</Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>Step 3: Explain - Specific vs General Feedback</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: P.teal.border }}>Scenario</Typography>
            <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>Mr. Karim introduces the activity for today's lesson.</Typography>
            <Typography variant="body1">"Watch this video about effective feedback, then explain what you learned."</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4 }}>
          <Box sx={{ ...cardSx(P.purple), mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: P.purple.border }}>Key Vocabulary</Typography>
            <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 2 }}>
              {VOCABULARY.map((word, idx) => (
                <Box key={idx} sx={{ px: 2, py: 0.5, bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '10px' }}>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: P.purple.border }}>{word}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </motion.div>

        <Box sx={{ mb: 3 }}>
          <WordshakeGame step={3} interaction={0} targetWords={WORDSHAKE_WORDS} onComplete={() => setWordshakeDone(true)} subphase={2} />
        </Box>

        {wordshakeDone && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Box component="button" onClick={() => navigate('/phase6/subphase/2/step/3/interaction/1')}
                sx={{ px: 6, py: 2, borderRadius: '16px', border: `2px solid ${P.orange.border}`, bgcolor: P.orange.bg, boxShadow: `4px 4px 0 ${P.orange.shadow}`, fontWeight: 'bold', fontSize: '1.1rem', fontFamily: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 1, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }, transition: 'all 0.15s' }}>
                <PlayArrowIcon /> Start Activities
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
