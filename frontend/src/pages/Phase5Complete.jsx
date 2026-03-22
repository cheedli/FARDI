import React, { useEffect, useState } from 'react'
import { Box, Typography, Stack, CircularProgress, Container } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import StarIcon from '@mui/icons-material/Star'
import HomeIcon from '@mui/icons-material/Home'
import BarChartIcon from '@mui/icons-material/BarChart'

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

export default function Phase5Complete() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const P = isDark ? DARK : LIGHT
  const [saving, setSaving] = useState(true)

  // Gather scores from sessionStorage
  const sub1Total = parseInt(sessionStorage.getItem('phase5_subphase1_overall_total') || '0')
  const sub2Total = parseInt(sessionStorage.getItem('phase5_subphase2_overall_total') || '0')
  const grandTotal = sub1Total + sub2Total

  useEffect(() => {
    // Mark Phase 5 as complete in DB
    fetch('/api/phase/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        phase_number: 5,
        overall_score: grandTotal,
        final_level: ''
      })
    })
      .catch(() => {})
      .finally(() => setSaving(false))
  }, [])

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header Card */}
          <Box sx={{
            bgcolor: P.teal.bg,
            border: `2px solid ${P.teal.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 4, mb: 3, textAlign: 'center',
          }}>
            <EmojiEventsIcon sx={{ fontSize: 80, mb: 2, color: P.yellow.shadow }} />
            <Typography variant="h3" gutterBottom fontWeight={700} color={P.teal.border}>
              All Phases Complete!
            </Typography>
            <Typography variant="h6" color={P.teal.border} sx={{ opacity: 0.85 }}>
              Phase 5: Execution &amp; Problem-Solving
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, color: isDark ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>
              You've completed the entire FARDI Language Assessment Journey
            </Typography>
          </Box>

          {/* Phase 5 Summary Card */}
          <Box sx={{
            bgcolor: P.blue.bg,
            border: `2px solid ${P.blue.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h6" gutterBottom fontWeight={700} color={P.blue.border}>
              Phase 5 Summary
            </Typography>
            <Stack spacing={2}>
              {[
                { label: 'SubPhase 1: Handling a Last-Minute Issue', score: sub1Total },
                { label: 'SubPhase 2: Giving Instructions', score: sub2Total },
              ].map((item, i) => (
                <Stack key={i} direction="row" justifyContent="space-between" alignItems="center" sx={{
                  p: 1.5,
                  bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  borderRadius: '12px',
                  border: `1px solid ${P.blue.border}`,
                }}>
                  <Typography variant="body1" fontWeight={600}>{item.label}</Typography>
                  <Box component="span" sx={{
                    bgcolor: P.green.bg,
                    border: `2px solid ${P.green.border}`,
                    borderRadius: '999px', px: 2, py: 0.5,
                    fontSize: '0.85rem', fontWeight: 700,
                    color: P.green.shadow,
                    display: 'inline-flex', alignItems: 'center', gap: 0.5,
                  }}>
                    <CheckCircleIcon sx={{ fontSize: 14 }} />
                    {item.score} pts
                  </Box>
                </Stack>
              ))}
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{
                p: 2,
                bgcolor: P.yellow.bg,
                border: `2px solid ${P.yellow.border}`,
                borderRadius: '12px',
              }}>
                <Typography variant="h6" fontWeight={700} color={P.yellow.shadow}>Phase 5 Total</Typography>
                <Box component="span" sx={{
                  bgcolor: P.yellow.bg,
                  border: `2px solid ${P.yellow.border}`,
                  borderRadius: '999px', px: 2, py: 0.5,
                  fontSize: '1rem', fontWeight: 700,
                  color: P.yellow.shadow,
                }}>
                  {grandTotal} points
                </Box>
              </Stack>
            </Stack>
          </Box>

          {/* Congratulations Card */}
          <Box sx={{
            bgcolor: P.green.bg,
            border: `2px solid ${P.green.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.green.shadow}`,
            p: 4, mb: 3, textAlign: 'center',
          }}>
            <Stack direction="row" justifyContent="center" spacing={0.5} sx={{ mb: 2 }}>
              {[1, 2, 3, 4, 5].map(i => (
                <StarIcon key={i} sx={{ fontSize: 40, color: P.yellow.shadow }} />
              ))}
            </Stack>
            <Typography variant="h5" fontWeight={700} color={P.green.shadow} gutterBottom>
              Congratulations on Completing the Full Journey!
            </Typography>
            <Typography variant="body1" sx={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>
              You've progressed through all phases of the Global Cultures Festival project:
              Foundation Assessment, Cultural Event Planning, Marketing &amp; Promotion,
              and Execution &amp; Problem-Solving. Your English communication skills have been
              assessed and developed across real-world scenarios.
            </Typography>
          </Box>

          {/* Navigation Buttons */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Box
              component="button"
              onClick={() => !saving && navigate('/dashboard')}
              disabled={saving}
              sx={{
                flex: 1,
                bgcolor: P.teal.bg,
                border: `2px solid ${P.teal.border}`,
                borderRadius: '12px',
                boxShadow: `3px 3px 0 ${P.teal.shadow}`,
                px: 3, py: 2,
                fontWeight: 700, fontSize: '1.1rem',
                cursor: saving ? 'not-allowed' : 'pointer',
                color: P.teal.shadow,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                transition: 'transform 0.15s, box-shadow 0.15s',
                opacity: saving ? 0.7 : 1,
                '&:hover': !saving ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.teal.shadow}` } : {},
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.teal.shadow}` }
              }}
            >
              {saving ? <CircularProgress size={20} /> : <HomeIcon />}
              Back to Dashboard
            </Box>
            <Box
              component="button"
              onClick={() => navigate('/results')}
              sx={{
                flex: 1,
                bgcolor: P.blue.bg,
                border: `2px solid ${P.blue.border}`,
                borderRadius: '12px',
                boxShadow: `3px 3px 0 ${P.blue.shadow}`,
                px: 3, py: 2,
                fontWeight: 700, fontSize: '1rem',
                cursor: 'pointer', color: P.blue.shadow,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.blue.shadow}` }
              }}
            >
              <BarChartIcon />
              View All Results
            </Box>
          </Stack>

        </motion.div>
      </Container>
    </Box>
  )
}
