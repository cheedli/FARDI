import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, useTheme, CircularProgress } from '@mui/material'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../hooks/useProgressSave'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' } })
}

export default function Phase3Step3ScoreCalculation() {
  const navigate = useNavigate()
  const muiTheme = useTheme()
  const dark = muiTheme.palette.mode === 'dark'

  const D = dark
    ? { pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', divider: '#2A2A4A' }
    : { pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', divider: '#E0E0E0' }

  const C = dark
    ? {
        green:  { bg: '#1B2E1B', border: '#388E3C', shadow: '#388E3C' },
        blue:   { bg: '#0D1B2A', border: '#1976D2', shadow: '#1976D2' },
        teal:   { bg: '#002A2E', border: '#0097A7', shadow: '#0097A7' },
      }
    : {
        green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
        blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
        teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
      }

  const { saveNow } = useProgressSave({ phase: 3, subphase: null, step: 3, interaction: 0, context: 'score' })
  const [loading, setLoading] = useState(true)
  const [routing, setRouting] = useState(null)

  useEffect(() => { calculateScore() }, [])

  const calculateScore = async () => {
    const i1 = parseInt(sessionStorage.getItem('phase3_step3_int1_score') || '0')
    const i2 = parseInt(sessionStorage.getItem('phase3_step3_int2_score') || '0')
    const i3 = parseInt(sessionStorage.getItem('phase3_step3_int3_score') || '0')
    try {
      const res = await fetch('/api/phase3/step/3/calculate-score', {
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
        const level = total < 6 ? 'A1' : total < 11 ? 'A2' : total < 14 ? 'B1' : total < 17 ? 'B2' : 'C1'
        setRouting({ should_proceed: false, remedial_level: level, next_url: `/phase3/step/3/remedial/${level.toLowerCase()}/taskA` })
        await saveNow({ item_index: 0, item_id: 'score', item_type: 'task_complete', prompt: 'Score calculation', answer: level, is_correct: true, score: total })
      }
    } catch {
      const total = i1 + i2 + i3
      const level = total < 6 ? 'A1' : total < 11 ? 'A2' : total < 14 ? 'B1' : total < 17 ? 'B2' : 'C1'
      setRouting({ should_proceed: false, remedial_level: level, next_url: `/phase3/step/3/remedial/${level.toLowerCase()}/taskA` })
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
    navigate((routing.next_url || '/phase3/step/3/remedial/a1/taskA').replace(/^\/app/, ''))
  }

  useEffect(() => { window.__remedialSkip = handleContinue }, [handleContinue])

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: D.pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={60} sx={{ color: C.green.border }} />
      </Box>
    )
  }

  const proceed = routing?.should_proceed
  const activeColor = proceed ? C.green : C.teal

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: D.pageBg }}>
      <Container maxWidth="md" sx={{ pt: { xs: 3, md: 4 }, pb: 6 }}>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Box sx={{
            bgcolor: activeColor.bg, border: `2px solid ${activeColor.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${activeColor.shadow}`,
            p: 2.5, mb: 3,
          }}>
            <Box sx={{ px: 1.75, py: 0.4, borderRadius: '50px', bgcolor: activeColor.border, color: '#fff', fontSize: '0.8rem', fontWeight: 800, display: 'inline-block', mb: 1 }}>
              Phase 3 · Sponsorship &amp; Budgeting
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: D.heading }}>Step 3: Score Summary</Typography>
          </Box>
        </motion.div>

        {/* Result Card */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Box sx={{
            bgcolor: activeColor.bg, border: `2px solid ${activeColor.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${activeColor.shadow}`,
            p: 3, mb: 3,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
              <CheckCircleIcon sx={{ fontSize: 52, color: activeColor.border, mr: 2 }} />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 900, color: D.heading }}>
                  {proceed ? 'Great Progress!' : 'Practice Time'}
                </Typography>
                <Typography sx={{ color: D.muted, fontSize: '0.9rem' }}>
                  Assigned Level: <strong>{routing?.remedial_level}</strong>
                </Typography>
              </Box>
            </Box>

            <Typography sx={{ color: D.body, mb: 2, fontSize: '0.95rem' }}>
              {proceed
                ? 'Well done! You are ready to move to the next step.'
                : `Let's strengthen your skills with ${routing?.remedial_level} level practice activities.`}
            </Typography>

            <Box sx={{
              bgcolor: C.blue.bg, border: `1px solid ${C.blue.border}`,
              borderRadius: '12px', p: 2, mb: 3,
            }}>
              <Typography sx={{ color: D.body, fontSize: '0.9rem' }}>
                {proceed
                  ? 'You will proceed to Step 4: Sponsor Pitch.'
                  : `You will complete remedial activities at ${routing?.remedial_level} level before moving forward.`}
              </Typography>
            </Box>

            <Box
              component="button"
              onClick={handleContinue}
              sx={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                bgcolor: activeColor.border, color: '#fff',
                px: 4, py: 1.5, borderRadius: '14px',
                border: `2px solid ${activeColor.border}`,
                boxShadow: `4px 4px 0 ${dark ? activeColor.shadow : (proceed ? '#2E7D32' : '#006064')}`,
                fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
                transition: 'all 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${proceed ? '#2E7D32' : '#006064'}` },
              }}
            >
              {proceed ? 'Continue to Step 4' : `Continue to ${routing?.remedial_level} Remedial Activities`}
              <ArrowForwardIcon fontSize="small" />
            </Box>
          </Box>
        </motion.div>

      </Container>
    </Box>
  )
}
