import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../components/Avatar.jsx'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'

const LIGHT = { pageBg: '#FFFDE7', blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' } }
const DARK  = { pageBg: '#0F0F1A', blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' } }
const clay  = (c) => ({ bgcolor: c.bg, border: `2px solid ${c.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${c.shadow}`, p: 3 })
const hoverLift = (c) => ({ '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${c.shadow}` } })

export default function Phase5SubPhase2Step2Intro() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...clay(P.blue), mb: 3 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: P.blue.border, mb: 1 }}>Phase 5: Execution &amp; Problem-Solving</Typography>
            <Typography variant="h5" sx={{ color: P.blue.border, mb: 1 }}>SubPhase 2: Step 2 - Explore - Writing Instructions</Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>Explore real-world examples and experiment with writing clear, polite instructions</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...clay(P.teal), mb: 4 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Volunteers are the heart of our festival! Let's explore how to give them clear, polite instructions. Look at real volunteer task cards and briefings first (from cultural festivals and big events), then write your own short trial instructions for different roles using the templates. Try different styles and see what feels easy and friendly." />
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box component="button" onClick={() => navigate('/phase5/subphase/2/step/2/interaction/1')}
              sx={{ ...clay(P.blue), ...hoverLift(P.blue), cursor: 'pointer', px: 6, py: 2, fontWeight: 'bold', fontSize: '1.1rem', color: P.blue.border, transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 1 }}>
              <PlayArrowIcon /> Start Exploration Activities
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}
