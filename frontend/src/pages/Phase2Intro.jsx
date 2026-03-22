import React, { useEffect } from 'react'
import { Box, Typography, Stack, Container, useTheme } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import GroupIcon from '@mui/icons-material/Group'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Avatar from '../components/Avatar.jsx'
import { useAuth } from '../lib/api.jsx'

const LIGHT = {
  pageBg:  '#FFFDE7',
  cardBg:  '#ffffff',
  heading: '#1A237E',
  body:    '#37474F',
  muted:   '#78909C',
  divider: '#E0E0E0',
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
  yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825', text: '#5D4037' },
}
const DARK = {
  pageBg:  '#0F0F1A',
  cardBg:  '#1A1A2E',
  heading: '#E8EAFF',
  body:    '#B0BEC5',
  muted:   '#607D8B',
  divider: '#2A2A4A',
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#A06800', text: '#FFD54F' },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' } }),
}

export default function Phase2Intro() {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const D = isDark ? DARK : LIGHT
  const { user } = useAuth()
  const name = user?.first_name || user?.username || 'team'

  useEffect(() => {
    fetch('/phase2', { credentials: 'include' }).catch(() => {})
  }, [])

  const card = (c, extra = {}) => ({
    bgcolor: c.bg,
    border: `2px solid ${c.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${c.shadow}`,
    ...extra,
  })

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: D.pageBg }}>
      <Container maxWidth="md" sx={{ pt: { xs: 4, md: 5 }, pb: 8 }}>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 4 }}>
            <Box sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 48, height: 48, borderRadius: '14px',
              ...card(D.blue),
            }}>
              <GroupIcon sx={{ fontSize: 26, color: D.blue.border }} />
            </Box>
            <Typography sx={{ fontSize: { xs: '1.6rem', md: '2rem' }, fontWeight: 900, color: D.heading, letterSpacing: '-0.03em' }}>
              Phase 2: Cultural Event Planning
            </Typography>
          </Stack>
        </motion.div>

        {/* Character message card */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Box sx={{ ...card(D.blue), p: { xs: 3, md: 4 }, mb: 4 }}>
            <Stack direction="row" spacing={2.5} alignItems="flex-start">
              <Avatar speaker="Ms. Mabrouki" size={56} showName={false} />
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: D.blue.border, mb: 0.25 }}>
                  Ms. Mabrouki
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: D.muted, mb: 1.5 }}>
                  Event Coordinator
                </Typography>
                <Typography sx={{ color: D.body, fontSize: '1rem', lineHeight: 1.7, mb: 1.5 }}>
                  Welcome, {name}! You're an essential member of our Cultural Event Planning Committee at the university. Together we'll create a vibrant celebration of Tunisian culture through teamwork and collaboration!
                </Typography>
                <Typography sx={{ color: D.muted, fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Work with your team to assign roles, schedule meetings, plan tasks, and create a final action plan. Respond concisely and authentically.
                </Typography>
              </Box>
            </Stack>
          </Box>
        </motion.div>

        {/* Action buttons */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Box
              component={RouterLink}
              to="/phase2/step/step_1"
              sx={{
                display: 'inline-flex', alignItems: 'center', gap: 1,
                px: 3, py: 1.5, borderRadius: '14px', textDecoration: 'none',
                bgcolor: D.blue.border,
                color: '#fff',
                fontWeight: 800, fontSize: '0.95rem',
                border: `2px solid ${D.blue.border}`,
                boxShadow: `4px 4px 0 ${D.blue.shadow}`,
                transition: 'transform 0.12s, box-shadow 0.12s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.blue.shadow}` },
              }}
            >
              Start Step 1: Assigning Roles <ArrowForwardIcon sx={{ fontSize: 18 }} />
            </Box>
            <Box
              component={RouterLink}
              to="/dashboard"
              sx={{
                display: 'inline-flex', alignItems: 'center', gap: 0.75,
                px: 2.5, py: 1.5, borderRadius: '14px', textDecoration: 'none',
                bgcolor: D.cardBg,
                border: `2px solid ${D.divider}`,
                boxShadow: `3px 3px 0 ${D.divider}`,
                color: D.muted, fontWeight: 800, fontSize: '0.95rem',
                transition: 'transform 0.12s, box-shadow 0.12s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${D.divider}`, color: D.heading },
              }}
            >
              <ArrowBackIcon sx={{ fontSize: 16 }} /> Back to Dashboard
            </Box>
          </Stack>
        </motion.div>

      </Container>
    </Box>
  )
}
