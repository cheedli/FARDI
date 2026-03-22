import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../components/Avatar.jsx'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'

const LIGHT = {
  pageBg: '#FFFDE7',
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
}

export default function Phase5SubPhase2Step5Intro() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <Box sx={{
            bgcolor: P.blue.bg,
            border: `2px solid ${P.blue.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3,
            mb: 3
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>
              Phase 5: Execution & Problem-Solving
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.shadow }}>
              SubPhase 2: Step 5 - Evaluate - Correct Faulty Instructions
            </Typography>
          </Box>

          {/* Character message */}
          <Box sx={{
            bgcolor: P.teal.bg,
            border: `2px solid ${P.teal.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3,
            mb: 4
          }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Excellent instructions for our volunteers! Now we evaluate by fixing 'wrong' versions with typical mistakes. I'll give faulty texts - correct them step by step. Focus on one error type at a time to sharpen your editing skills."
            />
          </Box>

          {/* Start button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Box
              component="button"
              onClick={() => navigate('/phase5/subphase/2/step/5/interaction/1')}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1,
                bgcolor: P.blue.bg,
                border: `2px solid ${P.blue.border}`,
                borderRadius: '16px',
                boxShadow: `4px 4px 0 ${P.blue.shadow}`,
                px: 6, py: 2,
                fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer',
                color: P.blue.shadow,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` },
                transition: 'all 0.15s ease'
              }}
            >
              <PlayArrowIcon />
              Start Evaluation Activities
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}
