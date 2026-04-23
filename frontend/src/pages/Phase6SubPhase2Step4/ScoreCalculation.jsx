import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, CircularProgress, LinearProgress, Stack, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../lib/phase6_api.jsx'
import { getSubphase2MainRouting } from '../Phase6SubPhase2/shared/routing.js'
import { usePhase6ScoreResume } from '../Phase6/shared/useScoreResumeSave.js'

const LIGHT = {
  pageBg: '#FFFDE7',
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
}
const DARK = {
  pageBg: '#0F0F1A',
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
}

export default function Phase6SP2Step4Score() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const [loading, setLoading] = useState(true)
  const [scores, setScores] = useState({ i1: 0, i2: 0, i3: 0, total: 0 })
  const [level, setLevel] = useState('A2')
  const [shouldProceed, setShouldProceed] = useState(false)
  const [nextUrl, setNextUrl] = useState('')
  const routing = { remedialLevel: level, shouldProceed, totalScore: scores.total, nextUrl }

  usePhase6ScoreResume({ subphase: 2, step: 4, scores, routing })

  const cardSx = (color) => ({
    bgcolor: color.bg,
    border: `2px solid ${color.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${color.shadow}`,
    p: 3,
  })

  useEffect(() => {
    const calc = async () => {
      const i1 = parseInt(sessionStorage.getItem('phase6_sp2_step4_interaction1_score') || '0')
      const i2 = parseInt(sessionStorage.getItem('phase6_sp2_step4_interaction2_score') || '2')
      const i3 = parseInt(sessionStorage.getItem('phase6_sp2_step4_interaction3_score') || '0')
      const total = i1 + i2 + i3
      setScores({ i1, i2, i3, total })

      const fallbackRouting = getSubphase2MainRouting(4, i2)
      let remedialLevel = fallbackRouting.remedialLevel
      let proceed = fallbackRouting.shouldProceed
      let resolvedNextUrl = fallbackRouting.nextUrl
      let resolvedTotal = total
      try {
        const result = await phase6API.calculateStepScore(4, { interaction1_score: i1, interaction2_score: i2, interaction3_score: i3 }, 2)
        const data = result?.data || result || {}
        remedialLevel = data.total?.remedial_level || data.interaction2?.level || fallbackRouting.remedialLevel
        proceed = data.total?.should_proceed ?? fallbackRouting.shouldProceed
        resolvedNextUrl = data.total?.next_url || data.next_url || fallbackRouting.nextUrl
        resolvedTotal = data.total?.score ?? data.total_score ?? total
      } catch (e) { console.warn('Backend calc failed:', e) }

      setLevel(remedialLevel)
      setShouldProceed(proceed)
      setNextUrl(resolvedNextUrl)
      setScores({ i1, i2, i3, total: resolvedTotal })
      sessionStorage.setItem('phase6_sp2_step4_total_score', resolvedTotal.toString())
      sessionStorage.setItem('phase6_sp2_step4_remedial_level', remedialLevel)
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
        <CircularProgress size={60} sx={{ mb: 3, color: P.yellow.border }} />
        <Typography variant="h6">Calculating your score...</Typography>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>Phase 6: Reflection and Evaluation</Typography>
            <Typography variant="h5" sx={{ color: P.blue.shadow }}>Step 4: Score Summary</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.yellow), mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.yellow.border }}>Performance Summary</Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              {[{ label: 'Interaction 1', score: scores.i1, max: 1 }, { label: 'Interaction 2 (Feedback Response)', score: scores.i2, max: 5 }, { label: 'Interaction 3', score: scores.i3, max: 1 }].map((item, idx) => (
                <Box key={idx} sx={{ ...cardSx(P.yellow), p: 2 }}>
                  <Typography variant="body1"><strong>{item.label}:</strong> {item.score} / {item.max}</Typography>
                  <LinearProgress variant="determinate" value={(item.score / item.max) * 100} sx={{ mt: 1, height: 8, borderRadius: 1, bgcolor: `${P.yellow.border}30`, '& .MuiLinearProgress-bar': { bgcolor: P.yellow.border } }} />
                </Box>
              ))}
              <Box sx={{ ...cardSx(P.green), p: 2 }}>
                <Typography variant="h5" fontWeight="bold" sx={{ color: P.green.border }}>Total: {scores.total} / 7</Typography>
                <LinearProgress variant="determinate" value={(scores.total / 7) * 100} sx={{ mt: 1, height: 12, borderRadius: 1, bgcolor: `${P.green.border}30`, '& .MuiLinearProgress-bar': { bgcolor: P.green.border } }} />
              </Box>
            </Stack>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Box sx={{ ...cardSx(shouldProceed ? P.green : P.orange), mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: shouldProceed ? P.green.border : P.orange.border, mr: 2 }} />
              <Box>
                <Typography variant="h5" sx={{ color: shouldProceed ? P.green.shadow : P.orange.shadow, fontWeight: 'bold' }}>
                  {shouldProceed ? 'Great Job! Moving Forward' : 'Practice Activities Ready'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {shouldProceed ? 'You passed this step!' : `Assigned Level: ${level}`}
                </Typography>
              </Box>
            </Box>
            <Box
              component="button"
              onClick={handleContinue}
              sx={{
                width: '100%',
                bgcolor: shouldProceed ? P.green.border : P.orange.border,
                color: 'white',
                border: `2px solid ${shouldProceed ? P.green.shadow : P.orange.shadow}`,
                borderRadius: '14px',
                boxShadow: `4px 4px 0 ${shouldProceed ? P.green.shadow : P.orange.shadow}`,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${shouldProceed ? P.green.shadow : P.orange.shadow}` },
                transition: 'all 0.15s',
              }}
            >
              {shouldProceed ? 'Continue to Next Step' : `Continue to ${level} Remedial Activities`}
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}
