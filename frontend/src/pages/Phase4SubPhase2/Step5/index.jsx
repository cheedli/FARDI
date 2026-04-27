import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Typography, Box } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'

function Phase4_2Step5Intro() {
  const navigate = useNavigate()
  useEffect(() => { window.__remedialSkip = () => navigate('/phase4_2/step/5/interaction/1') }, [])
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const LIGHT = {
    pageBg: '#FFFDE7',
    blue:   { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
    green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
    yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
    purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
    teal:   { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
    orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
    red:    { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
  }
  const DARK = {
    pageBg: '#0F0F1A',
    blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
    green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
    yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
    purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
    teal:   { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
    orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
    red:    { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
  }
  const P = isDark ? DARK : LIGHT

  const handleStart = () => {
    sessionStorage.setItem('phase4_2_step5_score', '0')
    navigate('/phase4_2/step/5/interaction/1')
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: 'bold', color: P.blue.shadow }}>
              Phase 4.2 - Step 5: Evaluate
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.border }}>
              Assess Learning by Correcting Faulty Social Media Posts
            </Typography>
          </Box>

          <CharacterMessage
            character="MS. MABROUKI"
            message="Great job writing your posts! Now it's time to evaluate and polish them. I'll give you 'wrong' versions with mistakes (spelling, grammar, structure, vocabulary, tone). Correct them step by step—no images, just text. We'll focus on one error type at a time to build your editing skills."
          />

          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: P.teal.shadow, mb: 2 }}>
              Three-Step Correction Process
            </Typography>
            <Typography variant="body1" paragraph sx={{ color: P.teal.shadow }}>
              You'll correct faulty social media posts in three focused steps:
            </Typography>
            <Box component="ul" sx={{ pl: 3 }}>
              <li>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Step 1: Spelling Mistakes</strong> - Identify and correct misspelled words
                </Typography>
              </li>
              <li>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Step 2: Grammar Mistakes</strong> - Fix subject-verb agreement, articles, tense, prepositions
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <strong>Step 3: Enhancement</strong> - Improve coherence, tone, vocabulary, hashtags, emojis, and calls-to-action
                </Typography>
              </li>
            </Box>
          </Box>

          <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: P.purple.shadow, mb: 2 }}>
              What You'll Practice
            </Typography>
            <Typography variant="body1" paragraph>
              This evaluation step helps you develop critical editing skills essential for professional social media communication:
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Error Detection</Typography>
                <Typography variant="body2" color="text.secondary">Spot spelling and grammar mistakes</Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Correction Skills</Typography>
                <Typography variant="body2" color="text.secondary">Apply proper grammar rules</Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Enhancement</Typography>
                <Typography variant="body2" color="text.secondary">Improve tone and vocabulary</Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Strategic Thinking</Typography>
                <Typography variant="body2" color="text.secondary">Optimize hashtags and CTAs</Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Engagement</Typography>
                <Typography variant="body2" color="text.secondary">Use emojis and connectors effectively</Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Professionalism</Typography>
                <Typography variant="body2" color="text.secondary">Polish posts for impact</Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Box component="button" onClick={handleStart} sx={{
              bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
              borderRadius: '12px', boxShadow: `3px 3px 0 ${P.orange.shadow}`,
              px: 6, py: 2, fontWeight: 700, fontSize: '1.1rem',
              cursor: 'pointer', color: P.orange.shadow,
              '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.orange.shadow}` },
              '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.orange.shadow}` }
            }}>
              Start Step 5: Evaluate
            </Box>
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}

export default Phase4_2Step5Intro
