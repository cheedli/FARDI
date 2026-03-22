import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, CircularProgress, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import SchoolIcon from '@mui/icons-material/School'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

const LIGHT = {
  pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', divider: '#E0E0E0',
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
  yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825', text: '#5D4037' },
  teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
  orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
  red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#C62828' },
  purple: { bg: '#E1BEE7', border: '#8E24AA', shadow: '#8E24AA' },
}
const DARK = {
  pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', divider: '#2A2A4A',
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#A06800', text: '#FFD54F' },
  teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
  orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
  red:    { bg: '#1F0000', border: '#EF9A9A', shadow: '#B71C1C' },
  purple: { bg: '#1E0A2E', border: '#CE93D8', shadow: '#7B1FA2' },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' } }),
}

function clay(c) {
  return {
    bgcolor: c.bg,
    border: `2px solid ${c.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${c.shadow}`,
  }
}

export default function Phase3Step2ScoreCalculation() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [routing, setRouting] = useState(null)
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const D = isDark ? DARK : LIGHT

  useEffect(() => { calculateScore() }, [])

  const calculateScore = async () => {
    const i1 = parseInt(sessionStorage.getItem('phase3_step2_int1_score') || '0')
    const i2 = parseInt(sessionStorage.getItem('phase3_step2_int2_score') || '0')
    const i3 = parseInt(sessionStorage.getItem('phase3_step2_int3_score') || '0')

    try {
      const res = await fetch('/api/phase3/step/2/calculate-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ interaction1_score: i1, interaction2_score: i2, interaction3_score: i3 })
      })
      const result = await res.json()
      if (result.success) {
        setRouting(result.data.total)
      } else {
        setRouting({ should_proceed: i3 >= 3, remedial_level: determineLevel(i3) })
      }
    } catch {
      setRouting({ should_proceed: i3 >= 3, remedial_level: determineLevel(i3) })
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
    if (routing.should_proceed) {
      navigate('/phase3/step/3')
    } else {
      const level = (routing.remedial_level || 'a1').toLowerCase()
      navigate(`/phase3/step/2/remedial/${level}/taskA`)
    }
  }

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: D.pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ color: D.green.border, mb: 2 }} />
          <Typography variant="body1" fontWeight={700} sx={{ color: D.muted }}>
            Calculating your score...
          </Typography>
        </Box>
      </Box>
    )
  }

  const resultColor = routing?.should_proceed ? D.green : D.orange

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: D.pageBg }}>
      <Container maxWidth="md" sx={{ pt: { xs: 3, md: 4 }, pb: 6 }}>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Box sx={{ ...clay(D.green), p: 3, mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
            <SchoolIcon sx={{ fontSize: 40, color: D.green.border }} />
            <Box>
              <Typography variant="h5" fontWeight={800} sx={{ color: D.heading }}>
                Phase 3: Sponsorship &amp; Budgeting
              </Typography>
              <Typography variant="body2" sx={{ color: D.body, mt: 0.5 }}>
                Step 2: Score Summary
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Result Card */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Box sx={{ ...clay(resultColor), p: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: resultColor.border }} />
              <Box>
                <Typography variant="h5" fontWeight={800} sx={{ color: D.heading }}>
                  {routing?.should_proceed ? 'Great Progress!' : 'Practice Time'}
                </Typography>
                <Typography variant="body2" sx={{ color: D.muted, mt: 0.25 }}>
                  Assigned Level:{' '}
                  <Box component="span" sx={{
                    px: 1.25, py: 0.25, borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800,
                    bgcolor: resultColor.bg, color: resultColor.border,
                    border: `2px solid ${resultColor.border}`,
                    ml: 0.5,
                  }}>
                    {routing?.remedial_level}
                  </Box>
                </Typography>
              </Box>
            </Box>

            <Typography variant="body1" sx={{ color: D.body, mb: 2 }}>
              {routing?.should_proceed
                ? 'Well done! You are ready to move to the next step.'
                : `Let's strengthen your skills with ${routing?.remedial_level} level practice activities.`}
            </Typography>

            <Box sx={{
              p: 2,
              bgcolor: D.blue.bg,
              border: `1px solid ${D.blue.border}`,
              borderRadius: '12px',
              mb: 3,
            }}>
              <Typography variant="body2" sx={{ color: D.body }}>
                {routing?.should_proceed
                  ? 'You will proceed to Step 3: Budget Planning.'
                  : `You will complete remedial activities at ${routing?.remedial_level} level before moving forward.`}
              </Typography>
            </Box>

            <Box
              component="button"
              onClick={handleContinue}
              sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                width: '100%',
                bgcolor: resultColor.bg, color: resultColor.border,
                border: `2px solid ${resultColor.border}`,
                borderRadius: '14px',
                boxShadow: `4px 4px 0 ${resultColor.shadow}`,
                fontWeight: 800, fontSize: '1rem',
                py: 1.75, cursor: 'pointer',
                transition: 'all 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${resultColor.shadow}` },
              }}
            >
              {routing?.should_proceed
                ? 'Continue to Step 3'
                : `Continue to ${routing?.remedial_level} Remedial Activities`}
              <ArrowForwardIcon />
            </Box>
          </Box>
        </motion.div>

      </Container>
    </Box>
  )
}
