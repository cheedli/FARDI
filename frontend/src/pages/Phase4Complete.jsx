import React, { useEffect, useState } from 'react'
import { Box, Typography, Stack, CircularProgress, Container } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

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

export default function Phase4Complete() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const [saving, setSaving] = useState(true)

  // Gather scores from sessionStorage
  const step1Score = parseInt(sessionStorage.getItem('phase4_step1_total_score') || '0')
  const step3Score = parseInt(sessionStorage.getItem('phase4_step3_total_score') || '0')
  const step4Score = parseInt(sessionStorage.getItem('phase4_step4_total_score') || '0')
  const step5Score = parseInt(sessionStorage.getItem('phase4_step5_total_score') || '0')
  const totalScore = step1Score + step3Score + step4Score + step5Score

  useEffect(() => {
    // Mark Phase 4 as complete in DB
    fetch('/api/phase/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        phase_number: 4,
        overall_score: totalScore,
        final_level: ''
      })
    })
      .catch(() => {})
      .finally(() => setSaving(false))
  }, [])

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: isDark ? DARK.pageBg : LIGHT.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header Card */}
          <Box sx={{
            bgcolor: isDark ? DARK.orange.bg : LIGHT.orange.bg,
            border: `2px solid ${isDark ? DARK.orange.border : LIGHT.orange.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${isDark ? DARK.orange.shadow : LIGHT.orange.shadow}`,
            p: 4, mb: 3, textAlign: 'center',
          }}>
            <EmojiEventsIcon sx={{ fontSize: 80, mb: 2, color: isDark ? DARK.yellow.border : LIGHT.yellow.shadow }} />
            <Typography variant="h3" gutterBottom fontWeight={700} color={isDark ? DARK.orange.border : LIGHT.orange.shadow}>
              Phase 4 Complete!
            </Typography>
            <Typography variant="h6" color={isDark ? DARK.orange.border : LIGHT.orange.shadow} sx={{ opacity: 0.85 }}>
              Marketing &amp; Promotion
            </Typography>
          </Box>

          {/* Performance Card */}
          <Box sx={{
            bgcolor: isDark ? DARK.blue.bg : LIGHT.blue.bg,
            border: `2px solid ${isDark ? DARK.blue.border : LIGHT.blue.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${isDark ? DARK.blue.shadow : LIGHT.blue.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h6" gutterBottom fontWeight={700} color={isDark ? DARK.blue.border : LIGHT.blue.shadow}>
              Your Performance
            </Typography>
            <Stack spacing={2}>
              {[
                { label: 'Step 1: Engage', score: step1Score },
                { label: 'Step 3: Explain', score: step3Score },
                { label: 'Step 4: Elaborate', score: step4Score },
                { label: 'Step 5: Evaluate', score: step5Score },
              ].map((step, i) => (
                <Stack key={i} direction="row" justifyContent="space-between" alignItems="center" sx={{
                  p: 1.5,
                  bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  borderRadius: '12px',
                  border: `1px solid ${isDark ? DARK.blue.border : LIGHT.blue.border}`,
                }}>
                  <Typography variant="body1" fontWeight={600}>{step.label}</Typography>
                  <Box component="span" sx={{
                    bgcolor: isDark ? DARK.green.bg : LIGHT.green.bg,
                    border: `2px solid ${isDark ? DARK.green.border : LIGHT.green.border}`,
                    borderRadius: '999px', px: 2, py: 0.5,
                    fontSize: '0.85rem', fontWeight: 700,
                    color: isDark ? DARK.green.border : LIGHT.green.shadow,
                    display: 'inline-flex', alignItems: 'center', gap: 0.5,
                  }}>
                    <CheckCircleIcon sx={{ fontSize: 14 }} />
                    {step.score} pts
                  </Box>
                </Stack>
              ))}
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{
                p: 2,
                bgcolor: isDark ? DARK.yellow.bg : LIGHT.yellow.bg,
                border: `2px solid ${isDark ? DARK.yellow.border : LIGHT.yellow.border}`,
                borderRadius: '12px',
              }}>
                <Typography variant="h6" fontWeight={700} color={isDark ? DARK.yellow.border : LIGHT.yellow.shadow}>Total Score</Typography>
                <Box component="span" sx={{
                  bgcolor: isDark ? DARK.yellow.bg : LIGHT.yellow.bg,
                  border: `2px solid ${isDark ? DARK.yellow.border : LIGHT.yellow.border}`,
                  borderRadius: '999px', px: 2, py: 0.5,
                  fontSize: '1rem', fontWeight: 700,
                  color: isDark ? DARK.yellow.border : LIGHT.yellow.shadow,
                }}>
                  {totalScore} points
                </Box>
              </Stack>
            </Stack>
          </Box>

          {/* Unlock Card */}
          <Box sx={{
            bgcolor: isDark ? DARK.green.bg : LIGHT.green.bg,
            border: `2px solid ${isDark ? DARK.green.border : LIGHT.green.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${isDark ? DARK.green.shadow : LIGHT.green.shadow}`,
            p: 3, mb: 3, textAlign: 'center',
          }}>
            <CheckCircleIcon sx={{ fontSize: 48, color: isDark ? DARK.green.border : LIGHT.green.shadow, mb: 1 }} />
            <Typography variant="h6" fontWeight={700} color={isDark ? DARK.green.border : LIGHT.green.shadow}>
              Congratulations! You've unlocked Phase 5: Execution &amp; Problem-Solving
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: isDark ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>
              Handle last-minute issues and coordinate volunteers at the Global Cultures Festival
            </Typography>
          </Box>

          {/* Navigation Buttons */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Box
              component="button"
              onClick={() => !saving && navigate('/phase5/subphase/1/step/1')}
              disabled={saving}
              sx={{
                flex: 1,
                bgcolor: isDark ? DARK.orange.bg : LIGHT.orange.bg,
                border: `2px solid ${isDark ? DARK.orange.border : LIGHT.orange.border}`,
                borderRadius: '12px',
                boxShadow: `3px 3px 0 ${isDark ? DARK.orange.shadow : LIGHT.orange.shadow}`,
                px: 3, py: 2,
                fontWeight: 700, fontSize: '1.1rem',
                cursor: saving ? 'not-allowed' : 'pointer',
                color: isDark ? DARK.orange.border : LIGHT.orange.shadow,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                transition: 'transform 0.15s, box-shadow 0.15s',
                opacity: saving ? 0.7 : 1,
                '&:hover': !saving ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${isDark ? DARK.orange.shadow : LIGHT.orange.shadow}` } : {},
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${isDark ? DARK.orange.shadow : LIGHT.orange.shadow}` }
              }}
            >
              {saving ? <CircularProgress size={20} /> : <ArrowForwardIcon />}
              Continue to Phase 5
            </Box>
            <Box
              component="button"
              onClick={() => navigate('/dashboard')}
              sx={{
                flex: 1,
                bgcolor: isDark ? DARK.blue.bg : LIGHT.blue.bg,
                border: `2px solid ${isDark ? DARK.blue.border : LIGHT.blue.border}`,
                borderRadius: '12px',
                boxShadow: `3px 3px 0 ${isDark ? DARK.blue.shadow : LIGHT.blue.shadow}`,
                px: 3, py: 2,
                fontWeight: 700, fontSize: '1rem',
                cursor: 'pointer', color: isDark ? DARK.blue.border : LIGHT.blue.shadow,
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${isDark ? DARK.blue.shadow : LIGHT.blue.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${isDark ? DARK.blue.shadow : LIGHT.blue.shadow}` }
              }}
            >
              Back to Dashboard
            </Box>
          </Stack>

        </motion.div>
      </Container>
    </Box>
  )
}
