import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, LinearProgress, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import SchoolIcon from '@mui/icons-material/School'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', divider: '#E0E0E0',
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
  teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
  orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
}
const DARK = {
  pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', divider: '#2A2A4A',
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
  orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' } }),
}

const clay = (c) => ({
  bgcolor: c.bg,
  border: `2px solid ${c.border}`,
  borderRadius: '20px',
  boxShadow: `4px 4px 0 ${c.shadow}`,
})

export default function Phase3Step1ScoreCalculation() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const D = isDark ? DARK : LIGHT
  const { saveNow } = useProgressSave({ phase: 3, subphase: null, step: 1, interaction: 0, context: 'score' })
  const [loading, setLoading] = useState(true)
  const [routing, setRouting] = useState(null)

  useEffect(() => { calculateScore() }, [])

  const calculateScore = async () => {
    const i1 = parseInt(sessionStorage.getItem('phase3_step1_int1_score') || '0')
    const i2 = parseInt(sessionStorage.getItem('phase3_step1_int2_score') || '0')
    const i3 = parseInt(sessionStorage.getItem('phase3_step1_int3_score') || '0')

    try {
      const res = await fetch('/api/phase3/step/1/calculate-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ interaction1_score: i1, interaction2_score: i2, interaction3_score: i3 })
      })
      const result = await res.json()
      if (result.success) {
        setRouting(result.data.total)
        await saveNow({ item_index: 0, item_id: 'score', item_type: 'task_complete', prompt: 'Score calculation', answer: result.data.total?.remedial_level || 'complete', is_correct: true, score: i1 + i2 + i3 })
      } else {
        const total = i1 + i2 + i3
        const level = total < 12 ? 'A1' : total < 18 ? 'A2' : total < 22 ? 'B1' : total < 26 ? 'B2' : 'C1'
        const r = { should_proceed: false, remedial_level: level, next_url: `/phase3/step/1/remedial/${level.toLowerCase()}/taskA` }
        setRouting(r)
        await saveNow({ item_index: 0, item_id: 'score', item_type: 'task_complete', prompt: 'Score calculation', answer: level, is_correct: true, score: total })
      }
    } catch {
      const total = i1 + i2 + i3
      const level = total < 12 ? 'A1' : total < 18 ? 'A2' : total < 22 ? 'B1' : total < 26 ? 'B2' : 'C1'
      setRouting({ should_proceed: false, remedial_level: level, next_url: `/phase3/step/1/remedial/${level.toLowerCase()}/taskA` })
      await saveNow({ item_index: 0, item_id: 'score', item_type: 'task_complete', prompt: 'Score calculation', answer: level, is_correct: true, score: total })
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
    navigate((routing.next_url || '/phase3/step/1/remedial/a1/taskA').replace(/^\/app/, ''))
  }

  useEffect(() => { window.__remedialSkip = handleContinue }, [handleContinue])

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: D.pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Container maxWidth="md" sx={{ pt: 4, pb: 6 }}>
          <Box sx={{ ...clay(D.blue), p: { xs: 3, md: 4 }, textAlign: 'center' }}>
            <MonetizationOnIcon sx={{ fontSize: 48, color: D.blue.border, mb: 2 }} />
            <Typography variant="h5" fontWeight={800} sx={{ color: D.heading, mb: 1 }}>
              Calculating Your Score...
            </Typography>
            <Typography variant="body2" sx={{ color: D.muted, mb: 3 }}>
              Please wait while we process your results
            </Typography>
            <LinearProgress
              sx={{
                borderRadius: '10px', height: 10,
                bgcolor: D.divider,
                '& .MuiLinearProgress-bar': { bgcolor: D.blue.border, borderRadius: '10px' },
              }}
            />
          </Box>
        </Container>
      </Box>
    )
  }

  const resultColor = routing?.should_proceed ? D.green : D.orange

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: D.pageBg }}>
      <Container maxWidth="md" sx={{ pt: { xs: 3, md: 4 }, pb: 6 }}>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Box sx={{ ...clay(D.green), p: { xs: 2.5, md: 3 }, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <MonetizationOnIcon sx={{ fontSize: { xs: 32, md: 40 }, color: D.green.border }} />
            <Box>
              <Typography variant="h5" fontWeight={800} sx={{ color: D.heading, lineHeight: 1.2 }}>
                Phase 3: Sponsorship &amp; Budgeting
              </Typography>
              <Typography variant="body2" sx={{ color: D.body, mt: 0.5 }}>
                Step 1: Score Summary
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Result Card */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Box sx={{ ...clay(resultColor), p: { xs: 2.5, md: 3.5 }, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <CheckCircleIcon sx={{ fontSize: 48, color: resultColor.border }} />
              <Box>
                <Typography variant="h5" fontWeight={800} sx={{ color: D.heading }}>
                  {routing?.should_proceed ? 'Great Progress!' : 'Practice Time'}
                </Typography>
                <Box sx={{
                  display: 'inline-block', mt: 0.5,
                  px: 1.75, py: 0.4, borderRadius: '50px',
                  bgcolor: resultColor.bg, border: `2px solid ${resultColor.border}`,
                  fontSize: '0.8rem', fontWeight: 800, color: resultColor.border,
                }}>
                  Assigned Level: {routing?.remedial_level}
                </Box>
              </Box>
            </Box>

            <Typography variant="body1" sx={{ color: D.body, mb: 2 }}>
              {routing?.should_proceed
                ? 'Well done! You are ready to move to the next step.'
                : `Let's strengthen your skills with ${routing?.remedial_level} level practice activities.`}
            </Typography>

            <Box sx={{ ...clay(D.teal), p: { xs: 1.5, md: 2 }, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SchoolIcon sx={{ fontSize: 18, color: D.teal.border }} />
                <Typography variant="body2" fontWeight={600} sx={{ color: D.body }}>
                  {routing?.should_proceed
                    ? 'You will proceed to Step 2: Funding Sources.'
                    : `You will complete remedial activities at ${routing?.remedial_level} level before moving forward.`}
                </Typography>
              </Box>
            </Box>

            <Box
              component="button"
              onClick={handleContinue}
              sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                width: '100%', px: 3, py: 1.5,
                bgcolor: resultColor.bg, color: resultColor.border,
                border: `2px solid ${resultColor.border}`,
                borderRadius: '14px',
                boxShadow: `4px 4px 0 ${resultColor.shadow}`,
                fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
                transition: 'all 0.15s ease',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${resultColor.shadow}` },
              }}
            >
              {routing?.should_proceed ? 'Continue to Step 2' : `Continue to ${routing?.remedial_level} Remedial Activities`}
              <ArrowForwardIcon fontSize="small" />
            </Box>
          </Box>
        </motion.div>

      </Container>
    </Box>
  )
}
