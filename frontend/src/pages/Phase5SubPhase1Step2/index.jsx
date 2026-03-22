import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../components/Avatar.jsx'
import InfoIcon from '@mui/icons-material/Info'
import LightbulbIcon from '@mui/icons-material/Lightbulb'

const LIGHT = {
  pageBg: '#FFFDE7',
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
}

const KEY_VOCABULARY = ['emergency', 'backup', 'announce', 'update', 'communicate']

const LEARNING_OUTCOMES = {
  A2: 'Write 2-3 sentence announcements',
  B1: 'Write 4-6 sentence updates with reasons',
  B2: 'Write structured emails/announcements with polite language',
  C1: 'Write multi-channel crisis responses with strategic tone'
}

export default function Phase5Step2Intro() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT

  const handleStart = () => {
    navigate('/phase5/subphase/1/step/2/interaction/1')
  }

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
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" color={P.blue.border}>
              Phase 5: Execution &amp; Problem-Solving
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.border }}>
              Step 2: Explore
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Crisis Communication - Writing announcements and updates
            </Typography>
          </Box>
        </motion.div>

        {/* Scenario Intro */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="One hour before the Global Cultures Festival opens, the main stage lights fail! We need to write quick solutions: announcement to audience, email to sponsors, social media update. Let's explore real examples first."
            />
          </Box>
        </motion.div>

        {/* Learning Outcomes */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Box sx={{ ...cardSx(P.yellow), mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LightbulbIcon sx={{ fontSize: 36, color: P.yellow.border, mr: 2 }} />
              <Typography variant="h6" fontWeight="bold" sx={{ color: P.yellow.border }}>
                Learning Outcomes
              </Typography>
            </Box>
            <Stack spacing={1}>
              {Object.entries(LEARNING_OUTCOMES).map(([level, outcome]) => (
                <Box key={level}>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: P.yellow.border }}>
                    {level}:
                  </Typography>
                  <Typography variant="body2" sx={{ ml: 2 }} color="text.secondary">
                    {outcome}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </motion.div>

        {/* Key Vocabulary */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>
              Key Vocabulary
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              {KEY_VOCABULARY.map((term, idx) => (
                <Box
                  key={idx}
                  sx={{
                    bgcolor: P.blue.bg,
                    border: `2px solid ${P.blue.border}`,
                    borderRadius: '12px',
                    boxShadow: `3px 3px 0 ${P.blue.shadow}`,
                    px: 2, py: 0.5,
                  }}
                >
                  <Typography variant="body2" fontWeight="bold" sx={{ color: P.blue.border }}>
                    {term}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </motion.div>

        {/* Instructions */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <InfoIcon sx={{ color: P.teal.border, mr: 1 }} />
              <Typography variant="body2" fontWeight="bold" sx={{ color: P.teal.border }}>
                What You'll Do:
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">1. Play Sushi Spell to activate vocabulary (emergency, backup, announce, update, communicate)</Typography>
            <Typography variant="body2" color="text.secondary">2. Write a short announcement (3-6 sentences) about the lighting problem</Typography>
            <Typography variant="body2" color="text.secondary">3. Explain why you chose your solution</Typography>
            <Typography variant="body2" color="text.secondary">4. Play Sushi Spell again and revise your announcement with a new term</Typography>
          </Box>
        </motion.div>

        {/* Start Button */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Box
              component="button"
              onClick={handleStart}
              sx={{
                bgcolor: P.blue.bg,
                border: `2px solid ${P.blue.border}`,
                borderRadius: '16px',
                boxShadow: `4px 4px 0 ${P.blue.shadow}`,
                px: 6, py: 1.5,
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem',
                color: P.blue.border,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` },
                transition: 'all 0.15s ease',
              }}
            >
              Start Step 2: Explore
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}
