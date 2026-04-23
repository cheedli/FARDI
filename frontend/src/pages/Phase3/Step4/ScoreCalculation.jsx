import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, CircularProgress, Container, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import SchoolIcon from '@mui/icons-material/School'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

// ── Clay palette ──────────────────────────────────────────────────────────────
const LIGHT = {
  pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F',
  muted: '#78909C', divider: '#E0E0E0',
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
  yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825', text: '#5D4037' },
  orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
  teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
}
const DARK = {
  pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5',
  muted: '#607D8B', divider: '#2A2A4A',
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#A06800', text: '#FFD54F' },
  orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
  teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' } }),
}

export default function Phase3Step4ScoreCalculation() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const D = isDark ? DARK : LIGHT

  const [loading, setLoading] = useState(true)
  const [routing, setRouting] = useState(null)

  useEffect(() => { calculateScore() }, [])

  const calculateScore = async () => {
    const i1 = parseInt(sessionStorage.getItem('phase3_step4_interaction1_score') || '0')
    const i2 = parseInt(sessionStorage.getItem('phase3_step4_interaction2_score') || '0')

    try {
      const res = await fetch('/api/phase3/step/4/calculate-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ interaction1_score: i1, interaction2_score: i2, interaction3_score: 0 })
      })
      const result = await res.json()
      if (result.success) {
        setRouting(result.data.total)
      } else {
        const total = i1 + i2
        const level = total < 2 ? 'A1' : total < 4 ? 'A2' : total < 6 ? 'B1' : total < 8 ? 'B2' : 'C1'
        setRouting({ should_proceed: false, remedial_level: level, next_url: `/phase3/step/4/remedial/${level.toLowerCase()}/taskA` })
      }
    } catch {
      const total = i1 + i2
      const level = total < 2 ? 'A1' : total < 4 ? 'A2' : total < 6 ? 'B1' : total < 8 ? 'B2' : 'C1'
      setRouting({ should_proceed: false, remedial_level: level, next_url: `/phase3/step/4/remedial/${level.toLowerCase()}/taskA` })
    } finally {
      setLoading(false)
    }
  }

  const determineLevel = (score) => {
    if (score <= 1) return 'A1'
    if (score <= 2) return 'A2'
    if (score <= 3) return 'B1'
    if (score <= 4) return 'B2'
    return 'C1'
  }

  const handleContinue = () => {
    if (!routing) return
    navigate((routing.next_url || '/phase3/step/4/remedial/a1/taskA').replace(/^\/app/, ''))
  }

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: D.pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={60} />
      </Box>
    )
  }

  const c = routing?.should_proceed ? D.green : D.blue

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: D.pageBg }}>
      <Container maxWidth="md" sx={{ pt: { xs: 3, md: 4 }, pb: 6 }}>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Box sx={{ bgcolor: D.green.bg, border: `2px solid ${D.green.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${D.green.shadow}`, p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Box sx={{ px: 1.75, py: 0.4, borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800, bgcolor: D.orange.bg, border: `2px solid ${D.orange.border}`, color: D.orange.border }}>Phase 3</Box>
            </Box>
            <Typography variant="h4" fontWeight={800} sx={{ color: D.heading }}>Sponsorship &amp; Budgeting</Typography>
            <Typography variant="h6" fontWeight={700} sx={{ color: D.body, mt: 0.5 }}>Step 4: Score Summary</Typography>
          </Box>
        </motion.div>

        {/* Result Card */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Box sx={{
            bgcolor: c.bg, border: `2px solid ${c.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${c.shadow}`,
            p: 4, mb: 3,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
              <CheckCircleIcon sx={{ fontSize: 56, color: c.border }} />
              <Box>
                <Typography variant="h5" fontWeight={800} sx={{ color: D.heading }}>
                  {routing?.should_proceed ? 'Phase 3 Complete!' : 'Practice Time'}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Box sx={{ display: 'inline-flex', px: 1.75, py: 0.4, borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800, bgcolor: D.cardBg, border: `2px solid ${c.border}`, color: c.border }}>
                    Assigned Level: {routing?.remedial_level}
                  </Box>
                </Box>
              </Box>
            </Box>

            <Typography variant="body1" sx={{ color: D.body, mb: 3 }}>
              {routing?.should_proceed
                ? 'Excellent work! You have completed all of Phase 3 and are ready for Phase 4: Marketing & Promotion.'
                : `Let's strengthen your sponsorship skills with ${routing?.remedial_level} level practice activities.`}
            </Typography>

            <Box sx={{ bgcolor: D.blue.bg, border: `2px solid ${D.blue.border}`, borderRadius: '14px', p: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SchoolIcon sx={{ color: D.blue.border, flexShrink: 0 }} />
                <Typography variant="body2" sx={{ color: D.body }}>
                  {routing?.should_proceed
                    ? 'You will proceed to Phase 4: Marketing & Promotion.'
                    : `You will complete remedial activities at ${routing?.remedial_level} level before moving forward.`}
                </Typography>
              </Box>
            </Box>

            <Box
              component="button"
              onClick={handleContinue}
              sx={{
                width: '100%', py: 1.5,
                bgcolor: c.bg, border: `2px solid ${c.border}`,
                borderRadius: '14px', boxShadow: `4px 4px 0 ${c.shadow}`,
                fontWeight: 800, fontSize: '1rem', cursor: 'pointer', color: c.border,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${c.shadow}` },
              }}
            >
              <ArrowForwardIcon />
              {routing?.should_proceed ? 'Continue to Phase 4' : `Continue to ${routing?.remedial_level} Remedial Activities`}
            </Box>
          </Box>
        </motion.div>

      </Container>
    </Box>
  )
}
