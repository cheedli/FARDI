import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container, useTheme } from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { motion } from 'framer-motion'

/**
 * Phase 4 Step 3: Apply - Complete Poster and Video Description
 * Introduction to the main activity where students write complete descriptions
 * Updated: 2026-01-14
 */

export default function Phase4Step4Intro() {
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

  const handleStartActivities = () => {
    navigate('/phase4/step/3/interaction/1')
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
              Step 3: Apply
            </Typography>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}>
              Writing complete descriptions for posters and videos
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
              You've successfully completed the previous steps and are ready to apply what you've learned!
            </Typography>
          </Box>

          {/* Scenario Introduction */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.teal.shadow, mb: 2 }}>
              Main Activity (Scenario)
            </Typography>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Now apply what we've learned by writing a complete description of a poster first (using the guided template with examples), then a script for a video (using the guided template with examples), for the festival. Focus on grammar, spelling, and structure—follow the examples, adapt them, and self-check for mistakes before submitting."
            />
          </Box>

          {/* What You'll Do */}
          <Box sx={{
            bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>
              What You'll Do
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: P.orange.shadow }} gutterBottom>
                  1. Poster Description
                </Typography>
                <Typography variant="body1" sx={{ color: P.orange.shadow }}>
                  Write 4-8 sentences describing poster elements (layout, colors, slogan) using the guided template with examples. Adapt the examples to your ideas and check for grammar/spelling mistakes.
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: P.orange.shadow }} gutterBottom>
                  2. Video Script
                </Typography>
                <Typography variant="body1" sx={{ color: P.orange.shadow }}>
                  Write a complete script for a video using the guided template with examples. Focus on structure, grammar, and spelling.
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Assessment Focus */}
          <Box sx={{
            bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.purple.shadow }}>
              Assessment Focus
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body1" sx={{ mb: 1, color: P.purple.shadow }}>
                <strong>Writing Skills:</strong> Grammar, spelling, and structure
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1, color: P.purple.shadow }}>
                <strong>Vocabulary Use:</strong> Appropriate marketing and promotional terms
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1, color: P.purple.shadow }}>
                <strong>Template Adaptation:</strong> Following examples and making them your own
              </Typography>
              <Typography component="li" variant="body1" sx={{ color: P.purple.shadow }}>
                <strong>Self-Correction:</strong> Checking for mistakes before submitting
              </Typography>
            </Box>
          </Box>

          {/* Key Tips */}
          <Box sx={{
            bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`,
            p: 3, mb: 4,
          }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.yellow.shadow }}>
              Important Tips
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body1" sx={{ mb: 1, color: P.yellow.shadow }}>
                Use the examples as models, change words to make it your own
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1, color: P.yellow.shadow }}>
                Check for grammar mistakes (e.g., subject-verb agreement)
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1, color: P.yellow.shadow }}>
                Check for spelling mistakes (e.g., "gatefold")
              </Typography>
              <Typography component="li" variant="body1" sx={{ color: P.yellow.shadow }}>
                Ensure logical flow and structure in your writing
              </Typography>
            </Box>
          </Box>

          {/* Start Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Box component="button" onClick={handleStartActivities} sx={{
              bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
              borderRadius: '12px', boxShadow: `3px 3px 0 ${P.orange.shadow}`,
              px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
              cursor: 'pointer', color: P.orange.shadow,
              display: 'flex', alignItems: 'center', gap: 1,
              '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.orange.shadow}` },
              '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.orange.shadow}` }
            }}>
              <PlayArrowIcon />
              Start Writing Activities
            </Box>
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
