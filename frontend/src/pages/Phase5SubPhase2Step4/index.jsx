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

export default function Phase5SubPhase2Step4Intro() {
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
              SubPhase 2: Step 4 - Elaborate - Complete Instructions
            </Typography>
          </Box>

          {/* Character message */}
          <Box sx={{
            bgcolor: P.teal.bg,
            border: `2px solid ${P.teal.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3,
            mb: 3
          }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="The festival is tomorrow - our volunteers need clear instructions! Use the guided templates with examples, adapt them to different roles (entrance, booth, queue, etc.), and self-check grammar, spelling, politeness, sequencing, and clarity before submitting."
            />
          </Box>

          {/* Template Guide */}
          <Box sx={{
            bgcolor: P.orange.bg,
            border: `2px solid ${P.orange.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.orange.shadow}`,
            p: 3,
            mb: 4
          }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>
              Template-Based Writing Guide
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
              You'll use guided templates with examples to write complete sets of instructions for different volunteer roles:
            </Typography>
            <Box component="ul" sx={{ pl: 3, mb: 2 }}>
              <li><strong>Entrance Volunteer:</strong> Welcome guests, check tickets, guide them</li>
              <li><strong>Queue Manager:</strong> Manage lines, maintain order, ensure safety</li>
              <li><strong>Booth Assistant:</strong> Help at booths, engage guests, provide information</li>
            </Box>
            <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
              Each template includes step-by-step examples. Adapt them to your own writing style while keeping them clear, polite, and safe!
            </Typography>
          </Box>

          {/* Start button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Box
              component="button"
              onClick={() => navigate('/phase5/subphase/2/step/4/interaction/1')}
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
              Start Elaboration Activities
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}
