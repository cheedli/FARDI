import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, CircularProgress, LinearProgress, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../lib/phase6_api.jsx'
import { getSubphase1MainRouting } from '../Phase6SubPhase1/shared/routing.js'
import { usePhase6ScoreResume } from '../Phase6/shared/useScoreResumeSave.js'

const LIGHT = { pageBg: '#FFFDE7', blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' } }
const DARK = { pageBg: '#0F0F1A', blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' } }

export default function Phase6SP1Step3Score() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const [loading, setLoading] = useState(true)
  const [scores, setScores] = useState({ i1: 0, i2: 0, i3: 0, total: 0 })
  const [level, setLevel] = useState('A2')
  const [shouldProceed, setShouldProceed] = useState(false)
  const [nextUrl, setNextUrl] = useState('')
  const routing = { remedialLevel: level, shouldProceed, totalScore: scores.total, nextUrl }

  usePhase6ScoreResume({ subphase: 1, step: 3, scores, routing })

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })

  useEffect(() => {
    const calc = async () => {
      const i1 = parseInt(sessionStorage.getItem('phase6_sp1_step3_interaction1_score') || '0')
      const i2 = parseInt(sessionStorage.getItem('phase6_sp1_step3_interaction2_score') || '2')
      const i3 = parseInt(sessionStorage.getItem('phase6_sp1_step3_interaction3_score') || '0')
      const total = i1 + i2 + i3
      setScores({ i1, i2, i3, total })
      const fallbackRouting = getSubphase1MainRouting(3, i2)
      let remedialLevel = fallbackRouting.remedialLevel
      let proceed = fallbackRouting.shouldProceed
      let resolvedNextUrl = fallbackRouting.nextUrl
      let resolvedTotal = total
      try {
        const result = await phase6API.calculateStepScore(3, { interaction1_score: i1, interaction2_score: i2, interaction3_score: i3 }, 1)
        if (result?.data) {
          const data = result.data
          remedialLevel = data.total?.remedial_level || data.interaction2?.level || fallbackRouting.remedialLevel
          proceed = data.total?.should_proceed ?? fallbackRouting.shouldProceed
          resolvedNextUrl = data.total?.next_url || data.next_url || fallbackRouting.nextUrl
          resolvedTotal = data.total?.score ?? data.total_score ?? total
        }
      } catch (e) { console.warn('Backend calc failed:', e) }
      setLevel(remedialLevel)
      setShouldProceed(proceed)
      setNextUrl(resolvedNextUrl)
      setScores({ i1, i2, i3, total: resolvedTotal })
      sessionStorage.setItem('phase6_sp1_step3_total_score', resolvedTotal.toString())
      sessionStorage.setItem('phase6_sp1_step3_remedial_level', remedialLevel)
      setLoading(false)
    }
    calc()
  }, [])

  const handleContinue = () => {
    navigate(nextUrl)
  }

  if (loading) return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ textAlign: 'center' }}>
        <CircularProgress size={60} sx={{ mb: 3, color: P.green.border }} />
        <Typography variant="h6">Calculating your score...</Typography>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.green), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.green.border }}>Phase 6: Reflection and Evaluation</Typography>
            <Typography variant="h5" sx={{ color: P.green.border }}>Step 3: Score Summary</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>Performance Summary</Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              {[{ label: 'Interaction 1', score: scores.i1, max: 1 }, { label: 'Interaction 2 (Balance Explanation)', score: scores.i2, max: 5 }, { label: 'Interaction 3', score: scores.i3, max: 1 }].map((item, idx) => (
                <Box key={idx} sx={{ ...cardSx(P.teal), p: 2 }}>
                  <Typography variant="body1"><strong>{item.label}:</strong> {item.score} / {item.max}</Typography>
                  <LinearProgress variant="determinate" value={(item.score / item.max) * 100} sx={{ mt: 1, height: 8, borderRadius: 4, bgcolor: P.teal.bg, '& .MuiLinearProgress-bar': { backgroundColor: P.teal.border, borderRadius: 4 } }} />
                </Box>
              ))}
              <Box sx={{ ...cardSx(P.green), p: 2, border: `3px solid ${P.green.border}` }}>
                <Typography variant="h5" fontWeight="bold" sx={{ color: P.green.border }}>Total: {scores.total} / 7</Typography>
                <LinearProgress variant="determinate" value={(scores.total / 7) * 100} sx={{ mt: 1, height: 12, borderRadius: 4, bgcolor: P.green.bg, '& .MuiLinearProgress-bar': { backgroundColor: P.green.border, borderRadius: 4 } }} />
              </Box>
            </Stack>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.teal.border, mr: 2 }} />
              <Box>
                <Typography variant="h5" sx={{ color: P.teal.border }}>{shouldProceed ? 'Ready for Step 4' : 'Practice Activities Ready'}</Typography>
                <Typography variant="body2" color="text.secondary">Assigned Level: <strong>{level}</strong></Typography>
              </Box>
            </Box>
            <Box component="button" onClick={handleContinue} sx={{ width: '100%', ...cardSx(P.green), p: 1.5, cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', color: P.green.border, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s ease' }}>
              {shouldProceed ? 'Continue to Step 4' : `Continue to ${level} Remedial Activities`}
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}
