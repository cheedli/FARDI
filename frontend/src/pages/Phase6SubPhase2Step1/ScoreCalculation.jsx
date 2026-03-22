import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, CircularProgress, LinearProgress, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../lib/phase6_api.jsx'

const LIGHT = { pageBg: '#FFFDE7', blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' }, purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' }, orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' } }
const DARK = { pageBg: '#0F0F1A', blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' }, purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' }, orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' } }

const determineRemedialLevel = (i2Score) => {
  if (i2Score <= 1) return 'A1'
  if (i2Score <= 2) return 'A2'
  if (i2Score <= 3) return 'B1'
  if (i2Score <= 4) return 'B2'
  return 'C1'
}

export default function Phase6SP2Step1Score() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const [loading, setLoading] = useState(true)
  const [scores, setScores] = useState({ i1: 0, i2: 0, i3: 0, total: 0 })
  const [level, setLevel] = useState('A1')
  const [shouldProceed, setShouldProceed] = useState(false)

  useEffect(() => {
    const calc = async () => {
      const i1 = parseInt(sessionStorage.getItem('phase6_sp2_step1_interaction1_score') || '0')
      const i2 = parseInt(sessionStorage.getItem('phase6_sp2_step1_interaction2_score') || '1')
      const i3 = parseInt(sessionStorage.getItem('phase6_sp2_step1_interaction3_score') || '0')
      const total = i1 + i2 + i3
      setScores({ i1, i2, i3, total })

      let remedialLevel = determineRemedialLevel(i2)
      let proceed = i2 >= 3
      try {
        const result = await phase6API.calculateStepScore(1, { interaction1_score: i1, interaction2_score: i2, interaction3_score: i3 }, 2)
        const data = result?.data || result || {}
        remedialLevel = data.total?.remedial_level || data.interaction2?.level || determineRemedialLevel(i2)
        proceed = data.total?.should_proceed ?? (i2 >= 3)
      } catch (e) { console.warn('Backend calc failed:', e) }

      setLevel(remedialLevel)
      setShouldProceed(proceed)
      sessionStorage.setItem('phase6_sp2_step1_total_score', total.toString())
      sessionStorage.setItem('phase6_sp2_step1_remedial_level', remedialLevel)
      setLoading(false)
    }
    calc()
  }, [])

  const handleContinue = () => {
    if (shouldProceed) {
      navigate('/phase6/subphase/2/step/2')
    } else {
      navigate(`/phase6/subphase/2/step/1/remedial/${level.toLowerCase()}/task/a`)
    }
  }

  const cardSx = (color) => ({
    bgcolor: color.bg, border: `2px solid ${color.border}`,
    borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3
  })
  const hoverSx = (color) => ({
    '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${color.shadow}` }
  })

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
            <Typography variant="h5" sx={{ color: P.blue.border }}>Step 1: Score Summary</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.yellow), mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.yellow.border }}>Performance Summary</Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              {[{ label: 'Interaction 1', score: scores.i1, max: 1 }, { label: 'Interaction 2 (Feedback Experience)', score: scores.i2, max: 4 }, { label: 'Interaction 3', score: scores.i3, max: 1 }].map((item, idx) => (
                <Box key={idx} sx={{ p: 2, bgcolor: P.yellow.bg, borderRadius: '12px', border: `1px solid ${P.yellow.border}` }}>
                  <Typography variant="body1"><strong>{item.label}:</strong> {item.score} / {item.max}</Typography>
                  <LinearProgress variant="determinate" value={(item.score / item.max) * 100} sx={{ mt: 1, height: 8, borderRadius: 4, bgcolor: 'rgba(0,0,0,0.1)', '& .MuiLinearProgress-bar': { bgcolor: P.yellow.border } }} />
                </Box>
              ))}
              <Box sx={{ p: 2.5, bgcolor: P.green.bg, borderRadius: '12px', border: `2px solid ${P.green.border}` }}>
                <Typography variant="h5" fontWeight="bold" sx={{ color: P.green.border }}>Total: {scores.total} / 6</Typography>
                <LinearProgress variant="determinate" value={(scores.total / 6) * 100} sx={{ mt: 1, height: 12, borderRadius: 4, bgcolor: 'rgba(0,0,0,0.1)', '& .MuiLinearProgress-bar': { bgcolor: P.green.border } }} />
              </Box>
            </Stack>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Box sx={{ ...cardSx(shouldProceed ? P.green : P.orange), mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: shouldProceed ? P.green.border : P.orange.border, mr: 2 }} />
              <Box>
                <Typography variant="h5" fontWeight="bold" sx={{ color: shouldProceed ? P.green.border : P.orange.border }}>
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
                ...cardSx(shouldProceed ? P.green : P.orange),
                ...hoverSx(shouldProceed ? P.green : P.orange),
                cursor: 'pointer', width: '100%', border: `2px solid ${shouldProceed ? P.green.border : P.orange.border}`,
                background: 'none', fontFamily: 'inherit', fontSize: '1rem', fontWeight: 'bold',
                color: shouldProceed ? P.green.border : P.orange.border, transition: 'all 0.2s', mt: 1
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
