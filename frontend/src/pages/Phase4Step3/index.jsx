import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../components/Avatar.jsx'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'

/**
 * Phase 4 Step 3: Explain - Promotion Basics
 * Introduction to promotion basics before activities begin
 */

export default function Phase4Step3Intro() {
  const navigate = useNavigate()
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

  useEffect(() => { window.__remedialSkip = () => navigate('/phase4/step/3/vocabulary') }, [])

  const handleStartActivities = () => {
    navigate('/phase4/step/3/vocabulary')
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>
              Phase 4: Marketing & Promotion
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.shadow }}>
              Step 3: Explain
            </Typography>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}>
              Understanding promotion basics: posters and videos
            </Typography>
          </Box>

          {/* Congratulations Message */}
          <Box sx={{
            bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.green.shadow }}>
              Congratulations!
            </Typography>
            <Typography variant="body1" sx={{ color: P.green.shadow }}>
              You've successfully completed the remedial phase and are ready to move forward to Step 3!
            </Typography>
          </Box>

          {/* Scenario Introduction */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 4,
          }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.teal.shadow, mb: 2 }}>
              Scenario
            </Typography>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Let's explain posters first (e.g., promotional, persuasive), then videos (e.g., dramatisation, creative). We'll watch three short videos: first on ad characteristics, then two video ad examples. Listen for terms like 'promotional', 'persuasive', 'dramatisation', and note how they apply to posters/videos!"
            />
          </Box>

          {/* Key Terms to Listen For */}
          <Box sx={{
            bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`,
            p: 3, mb: 4,
          }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.purple.shadow }}>
              Key Terms to Listen For
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
              {['Promotional', 'Persuasive', 'Dramatisation', 'Creative'].map((term) => (
                <Box key={term} component="span" sx={{
                  bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
                  borderRadius: '999px', px: 2, py: 0.5,
                  fontSize: '0.85rem', fontWeight: 700, color: P.purple.shadow,
                  display: 'inline-block'
                }}>{term}</Box>
              ))}
            </Stack>
            <Typography variant="body2" sx={{ color: P.purple.shadow, opacity: 0.8 }}>
              Pay attention to how these terms are used in the context of posters and video advertisements.
            </Typography>
          </Box>

          {/* Learning Objectives */}
          <Box sx={{
            bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`,
            p: 3, mb: 4,
          }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.yellow.shadow }}>
              What You'll Learn
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              {[
                ['Poster Types:', 'Promotional vs. Persuasive approaches'],
                ['Video Types:', 'Dramatisation and creative techniques'],
                ['Ad Characteristics:', 'What makes advertisements effective'],
                ['Application:', 'How these concepts apply to both posters and videos'],
              ].map(([label, desc]) => (
                <Typography key={label} component="li" variant="body1" sx={{ mb: 1, color: P.yellow.shadow }}>
                  <strong>{label}</strong> {desc}
                </Typography>
              ))}
            </Box>
          </Box>

          {/* Start Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Box component="button" onClick={handleStartActivities} sx={{
              bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
              borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
              px: 5, py: 1.5, fontWeight: 700, fontSize: '1rem',
              cursor: 'pointer', color: P.green.shadow,
              display: 'flex', alignItems: 'center', gap: 1,
              '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
              '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` }
            }}>
              <PlayArrowIcon fontSize="small" />
              Start Learning Activities
            </Box>
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
