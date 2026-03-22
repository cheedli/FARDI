import React, { useEffect, useState } from 'react'
import { Box, Typography, Stack, LinearProgress, Container, useTheme } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Avatar from '../components/Avatar.jsx'
import GroupIcon from '@mui/icons-material/Group'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const LIGHT = {
  pageBg:  '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', divider: '#E0E0E0',
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
  yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825', text: '#5D4037' },
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
  purple: { bg: '#E1BEE7', border: '#8E24AA', shadow: '#8E24AA' },
  teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
  orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
}
const DARK = {
  pageBg:  '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', divider: '#2A2A4A',
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#A06800', text: '#FFD54F' },
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  purple: { bg: '#1E0A2E', border: '#CE93D8', shadow: '#7B1FA2' },
  teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
  orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' } }),
}

export default function Phase2Complete() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const D = isDark ? DARK : LIGHT

  const card = (c, extra = {}) => ({
    bgcolor: c.bg, border: `2px solid ${c.border}`, borderRadius: '20px',
    boxShadow: `4px 4px 0 ${c.shadow}`, ...extra,
  })

  useEffect(() => {
    fetch('/api/phase2/overall', { credentials: 'include' })
      .then(async r => { if (!r.ok) throw new Error('No Phase 2 data'); return r.json() })
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: D.pageBg }}>
      <Box sx={{ width: 200 }}>
        <Box sx={{ height: 12, borderRadius: '50px', bgcolor: D.blue.bg, border: `2px solid ${D.blue.border}`, boxShadow: `3px 3px 0 ${D.blue.shadow}`, overflow: 'hidden' }}>
          <LinearProgress sx={{ height: '100%', bgcolor: 'transparent', '& .MuiLinearProgress-bar': { bgcolor: D.blue.border, borderRadius: '50px' } }} />
        </Box>
        <Typography sx={{ textAlign: 'center', mt: 2, color: D.muted, fontWeight: 700, fontSize: '0.85rem' }}>Loading...</Typography>
      </Box>
    </Box>
  )
  if (error) return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: D.pageBg }}>
      <Box sx={{ ...card(D.orange), px: 3, py: 2 }}><Typography sx={{ color: D.orange.border, fontWeight: 700 }}>Error: {error}</Typography></Box>
    </Box>
  )
  if (!data) return null

  const { overall_level, total_score, step_scores, total_responses, completion_rate } = data

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: D.pageBg }}>
      <Container maxWidth="md" sx={{ pt: { xs: 4, md: 5 }, pb: 8 }}>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: '14px', ...card(D.green) }}>
              <GroupIcon sx={{ fontSize: 26, color: D.green.border }} />
            </Box>
            <Typography sx={{ fontSize: { xs: '1.6rem', md: '2rem' }, fontWeight: 900, color: D.heading, letterSpacing: '-0.03em' }}>
              Phase 2 Complete
            </Typography>
          </Stack>
        </motion.div>

        {/* Ms. Mabrouki message */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Box sx={{ ...card(D.blue), p: { xs: 3, md: 4 }, mb: 3 }}>
            <Stack direction="row" spacing={2.5} alignItems="flex-start">
              <Avatar speaker="Ms. Mabrouki" size={56} showName={false} />
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: D.blue.border, mb: 0.25 }}>Ms. Mabrouki</Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: D.muted, mb: 1.5 }}>Event Coordinator</Typography>
                <Typography sx={{ color: D.body, fontSize: '1rem', lineHeight: 1.7 }}>
                  Congratulations, team! You've successfully completed Phase 2 of our cultural event planning. Your collaboration, creativity, and dedication have made this an incredible journey. The action plan you've created will bring our Tunisian cultural celebration to life!
                </Typography>
              </Box>
            </Stack>
          </Box>
        </motion.div>

        {/* Skander message */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          <Box sx={{ ...card(D.teal), p: { xs: 3, md: 4 }, mb: 4 }}>
            <Stack direction="row" spacing={2.5} alignItems="flex-start">
              <Avatar speaker="SKANDER" size={56} showName={false} />
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: D.teal.border, mb: 0.25 }}>Skander</Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: D.muted, mb: 1.5 }}>Student Council President</Typography>
                <Typography sx={{ color: D.body, fontSize: '1rem', lineHeight: 1.7 }}>
                  Amazing work, everyone! Your teamwork and cultural insights have impressed me. You've shown great leadership in planning this event. I'm excited to see how our celebration will showcase Tunisian traditions!
                </Typography>
              </Box>
            </Stack>
          </Box>
        </motion.div>

        {/* Stats */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
          <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ mb: 4 }}>
            {[
              { label: `Level: ${overall_level}`, c: D.purple },
              { label: `Total Score: ${total_score}`, c: D.blue },
              { label: `Responses: ${total_responses}`, c: D.teal },
              { label: `Completion: ${Math.round(completion_rate)}%`, c: D.green },
            ].map(({ label, c }) => (
              <Box key={label} sx={{ px: 1.75, py: 0.5, borderRadius: '50px', bgcolor: c.bg, border: `2px solid ${c.border}`, boxShadow: `2px 2px 0 ${c.shadow}` }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: c.border }}>{label}</Typography>
              </Box>
            ))}
          </Stack>
        </motion.div>

        {/* Step Scores */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
          <Box sx={{ ...card(D.yellow), p: { xs: 3, md: 4 }, mb: 4 }}>
            <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: D.yellow.text || D.yellow.border, mb: 2 }}>Step Scores</Typography>
            {Object.entries(step_scores || {}).map(([id, s]) => (
              <Stack key={id} direction="row" spacing={2} alignItems="center" sx={{ py: 1, borderBottom: `1px solid ${D.divider}40`, '&:last-child': { borderBottom: 'none' } }}>
                <Typography sx={{ minWidth: 140, fontWeight: 700, color: D.body, fontSize: '0.9rem' }}>{String(id).replaceAll('_', ' ')}</Typography>
                <Box sx={{ px: 1.25, py: 0.3, borderRadius: '50px', bgcolor: D.blue.bg, border: `2px solid ${D.blue.border}`, boxShadow: `2px 2px 0 ${D.blue.shadow}` }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, color: D.blue.border }}>{s.score} pts</Typography>
                </Box>
                <Typography sx={{ color: D.muted, fontSize: '0.8rem', fontWeight: 600 }}>({s.items} items &middot; avg {s.average})</Typography>
              </Stack>
            ))}
          </Box>
        </motion.div>

        {/* Action buttons */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Box
              component="button"
              onClick={() => {
                fetch('/api/phase/complete', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  credentials: 'include',
                  body: JSON.stringify({ phase_number: 2, overall_score: total_score || 0, final_level: overall_level || '' })
                }).catch(() => {})
                navigate('/phase4/step/1')
              }}
              sx={{
                display: 'inline-flex', alignItems: 'center', gap: 1,
                px: 3, py: 1.5, borderRadius: '14px', cursor: 'pointer',
                bgcolor: D.orange.border, color: '#fff',
                fontWeight: 800, fontSize: '0.95rem', fontFamily: 'inherit',
                border: `2px solid ${D.orange.border}`, boxShadow: `4px 4px 0 ${D.orange.shadow}`,
                transition: 'transform 0.12s, box-shadow 0.12s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.orange.shadow}` },
              }}
            >
              Continue to Phase 4: Marketing & Promotion <ArrowForwardIcon sx={{ fontSize: 18 }} />
            </Box>
            <Box component="button" onClick={() => navigate('/dashboard')} sx={{
              display: 'inline-flex', alignItems: 'center', gap: 0.75,
              px: 2.5, py: 1.5, borderRadius: '14px', cursor: 'pointer',
              bgcolor: D.cardBg, color: D.muted,
              fontWeight: 800, fontSize: '0.95rem', fontFamily: 'inherit',
              border: `2px solid ${D.divider}`, boxShadow: `3px 3px 0 ${D.divider}`,
              transition: 'transform 0.12s, box-shadow 0.12s',
              '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${D.divider}`, color: D.heading },
            }}>
              <ArrowBackIcon sx={{ fontSize: 16 }} /> Back to Dashboard
            </Box>
          </Stack>
        </motion.div>

      </Container>
    </Box>
  )
}
