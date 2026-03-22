import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, LinearProgress, Container, useTheme } from '@mui/material'
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
  orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
  teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
  red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#C62828' },
}
const DARK = {
  pageBg:  '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', divider: '#2A2A4A',
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#A06800', text: '#FFD54F' },
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
  teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
  red:    { bg: '#1F0000', border: '#EF9A9A', shadow: '#B71C1C' },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' } }),
}

export default function Phase2StepResults() {
  const { stepId } = useParams()
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const D = isDark ? DARK : LIGHT
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const card = (c, extra = {}) => ({
    bgcolor: c.bg, border: `2px solid ${c.border}`, borderRadius: '20px',
    boxShadow: `4px 4px 0 ${c.shadow}`, ...extra,
  })

  useEffect(() => {
    setLoading(true)
    fetch(`/api/phase2/step-results?step_id=${encodeURIComponent(stepId)}`, { credentials: 'include' })
      .then(async r => { if (!r.ok) throw new Error('Failed to load step results'); return r.json() })
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [stepId])

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
      <Box sx={{ ...card(D.red), px: 3, py: 2 }}><Typography sx={{ color: D.red.border, fontWeight: 700 }}>Error: {error}</Typography></Box>
    </Box>
  )
  if (!data) return null

  const success = !!data.success

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: D.pageBg }}>
      <Container maxWidth="md" sx={{ pt: { xs: 4, md: 5 }, pb: 8 }}>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: '14px', ...card(D.blue) }}>
              <GroupIcon sx={{ fontSize: 26, color: D.blue.border }} />
            </Box>
            <Typography sx={{ fontSize: { xs: '1.6rem', md: '2rem' }, fontWeight: 900, color: D.heading, letterSpacing: '-0.03em' }}>
              Step Results
            </Typography>
          </Stack>
        </motion.div>

        {/* Score pills */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ mb: 4 }}>
            <Box sx={{ px: 1.75, py: 0.5, borderRadius: '50px', bgcolor: D.blue.bg, border: `2px solid ${D.blue.border}`, boxShadow: `2px 2px 0 ${D.blue.shadow}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: D.blue.border }}>Score: {data.total_score}</Typography>
            </Box>
            <Box sx={{ px: 1.75, py: 0.5, borderRadius: '50px', bgcolor: D.yellow.bg, border: `2px solid ${D.yellow.border}`, boxShadow: `2px 2px 0 ${D.yellow.shadow}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: D.yellow.text || D.yellow.border }}>Threshold: {data.success_threshold}</Typography>
            </Box>
            <Box sx={{ px: 1.75, py: 0.5, borderRadius: '50px', bgcolor: D.teal.bg, border: `2px solid ${D.teal.border}`, boxShadow: `2px 2px 0 ${D.teal.shadow}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: D.teal.border }}>{data.completed_items}/{data.total_items} items</Typography>
            </Box>
          </Stack>
        </motion.div>

        {/* Character feedback */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          {success ? (
            <Box sx={{ ...card(D.green), p: { xs: 3, md: 4 }, mb: 4 }}>
              <Stack direction="row" spacing={2.5} alignItems="flex-start">
                <Avatar speaker="Ms. Mabrouki" size={56} showName={false} />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: D.green.border, mb: 0.25 }}>Ms. Mabrouki</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: D.muted, mb: 1.5 }}>Event Coordinator</Typography>
                  <Typography sx={{ color: D.body, fontSize: '1rem', lineHeight: 1.7 }}>
                    {data.success_feedback || "Great job! You've successfully completed this step of our cultural event planning!"}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          ) : (
            <Box sx={{ ...card(D.orange), p: { xs: 3, md: 4 }, mb: 4 }}>
              <Stack direction="row" spacing={2.5} alignItems="flex-start">
                <Avatar speaker="SKANDER" size={56} showName={false} />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: D.orange.border, mb: 0.25 }}>Skander</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: D.muted, mb: 1.5 }}>Student Council President</Typography>
                  <Typography sx={{ color: D.body, fontSize: '1rem', lineHeight: 1.7 }}>
                    {data.remedial_feedback || "Great start! Let's do some fun practice activities to polish your skills before moving forward with our cultural event planning!"}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          )}
        </motion.div>

        {/* Action buttons */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            {success ? (
              <>
                {data.next_step ? (
                  <Box component="button" onClick={() => navigate(`/phase2/step/${data.next_step}`)} sx={{
                    display: 'inline-flex', alignItems: 'center', gap: 1,
                    px: 3, py: 1.5, borderRadius: '14px', cursor: 'pointer',
                    bgcolor: D.green.border, color: '#fff',
                    fontWeight: 800, fontSize: '0.95rem', fontFamily: 'inherit',
                    border: `2px solid ${D.green.border}`, boxShadow: `4px 4px 0 ${D.green.shadow}`,
                    transition: 'transform 0.12s, box-shadow 0.12s',
                    '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.green.shadow}` },
                  }}>
                    Go to {data.next_step_title} <ArrowForwardIcon sx={{ fontSize: 18 }} />
                  </Box>
                ) : (
                  <Box component="button" onClick={() => navigate('/phase2/complete')} sx={{
                    display: 'inline-flex', alignItems: 'center', gap: 1,
                    px: 3, py: 1.5, borderRadius: '14px', cursor: 'pointer',
                    bgcolor: D.green.border, color: '#fff',
                    fontWeight: 800, fontSize: '0.95rem', fontFamily: 'inherit',
                    border: `2px solid ${D.green.border}`, boxShadow: `4px 4px 0 ${D.green.shadow}`,
                    transition: 'transform 0.12s, box-shadow 0.12s',
                    '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.green.shadow}` },
                  }}>
                    Finish Phase 2 <ArrowForwardIcon sx={{ fontSize: 18 }} />
                  </Box>
                )}
              </>
            ) : (
              <Box component="button" onClick={() => navigate(`/phase2/remedial/${data.step_id}/${data.user_level}`)} sx={{
                display: 'inline-flex', alignItems: 'center', gap: 1,
                px: 3, py: 1.5, borderRadius: '14px', cursor: 'pointer',
                bgcolor: D.orange.border, color: '#fff',
                fontWeight: 800, fontSize: '0.95rem', fontFamily: 'inherit',
                border: `2px solid ${D.orange.border}`, boxShadow: `4px 4px 0 ${D.orange.shadow}`,
                transition: 'transform 0.12s, box-shadow 0.12s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.orange.shadow}` },
              }}>
                Start Practice <ArrowForwardIcon sx={{ fontSize: 18 }} />
              </Box>
            )}
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
