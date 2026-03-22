import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, CircularProgress, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../lib/phase6_api.jsx'

const LIGHT = {
  pageBg: '#FEFCE8',
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
}
const DARK = {
  pageBg: '#0F0F1A',
  yellow: { bg: '#422006', border: '#FACC15', shadow: '#854D0E' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
}

const determineRemedialLevel = (i2Score) => {
  if (i2Score <= 1) return 'A1'
  if (i2Score <= 2) return 'A2'
  if (i2Score <= 3) return 'B1'
  if (i2Score <= 4) return 'B2'
  return 'C1'
}

export default function Phase6SP1Step5Score() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const [loading, setLoading] = useState(true)
  const [scores, setScores] = useState({ i1: 0, i2: 0, i3: 0, total: 0 })
  const [level, setLevel] = useState('A1')
  const [shouldProceed, setShouldProceed] = useState(false)

  useEffect(() => {
    const calc = async () => {
      const i1 = parseInt(sessionStorage.getItem('phase6_sp1_step5_interaction1_score') || '0')
      const i2 = parseInt(sessionStorage.getItem('phase6_sp1_step5_interaction2_score') || '1')
      const i3 = parseInt(sessionStorage.getItem('phase6_sp1_step5_interaction3_score') || '0')
      const total = i1 + i2 + i3
      setScores({ i1, i2, i3, total })

      let remedialLevel = determineRemedialLevel(i2)
      let proceed = i2 >= 3
      try {
        const result = await phase6API.calculateStepScore(5, { interaction1_score: i1, interaction2_score: i2, interaction3_score: i3 }, 1)
        if (result?.data) {
          const data = result.data
          remedialLevel = data.total?.remedial_level || data.interaction2?.level || determineRemedialLevel(i2)
          proceed = data.total?.should_proceed ?? (i2 >= 3)
        } else if (result?.remedial_level) {
          remedialLevel = result.remedial_level
        }
      } catch (e) { console.warn('Backend calc failed:', e) }

      setLevel(remedialLevel)
      setShouldProceed(proceed)
      sessionStorage.setItem('phase6_sp1_step5_total_score', total.toString())
      sessionStorage.setItem('phase6_sp1_step5_remedial_level', remedialLevel)
      setLoading(false)
    }
    calc()
  }, [])

  const handleContinue = () => {
    if (shouldProceed) {
      navigate('/phase6/subphase/2/step/1')
    } else {
      navigate(`/phase6/subphase/1/step/5/remedial/${level.toLowerCase()}/task/a`)
    }
  }

  const cardSx = (color) => ({
    bgcolor: P[color].bg,
    border: `2px solid ${P[color].border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${P[color].shadow}`,
    p: 3,
  })

  if (loading) return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ textAlign: 'center' }}>
        <CircularProgress size={60} sx={{ mb: 3, color: P.yellow.border }} />
        <Typography variant="h6">Calculating your score...</Typography>
      </Box>
    </Box>
  )

  const ITEMS = [
    { label: 'Interaction 1 (Spelling)', score: scores.i1, max: 1 },
    { label: 'Interaction 2 (Grammar Correction)', score: scores.i2, max: 4 },
    { label: 'Interaction 3 (Enhancement)', score: scores.i3, max: 1 },
  ]

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx('yellow'), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.yellow.border }}>
              Phase 6: Reflection &amp; Evaluation
            </Typography>
            <Typography variant="h5" sx={{ color: P.yellow.border }}>Step 5: Score Summary</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx('yellow'), mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: P.yellow.border, fontWeight: 'bold' }}>Performance Summary</Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              {ITEMS.map((item, idx) => (
                <Box key={idx}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" fontWeight="bold">{item.label}</Typography>
                    <Typography variant="body2" fontWeight="bold" sx={{ color: P.yellow.border }}>{item.score} / {item.max}</Typography>
                  </Box>
                  <Box sx={{ width: '100%', bgcolor: 'rgba(0,0,0,0.1)', borderRadius: '8px', height: 10 }}>
                    <Box sx={{
                      width: `${(item.score / item.max) * 100}%`,
                      bgcolor: P.yellow.border,
                      height: 10,
                      borderRadius: '8px',
                      transition: 'width 0.8s ease',
                    }} />
                  </Box>
                </Box>
              ))}
              <Box sx={{ mt: 1, pt: 2, borderTop: `2px solid ${P.yellow.border}` }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: P.yellow.border }}>Total</Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: P.yellow.border }}>{scores.total} / 6</Typography>
                </Box>
                <Box sx={{ width: '100%', bgcolor: 'rgba(0,0,0,0.1)', borderRadius: '8px', height: 14 }}>
                  <Box sx={{
                    width: `${(scores.total / 6) * 100}%`,
                    bgcolor: P.yellow.border,
                    height: 14,
                    borderRadius: '8px',
                    transition: 'width 0.8s ease',
                  }} />
                </Box>
              </Box>
            </Stack>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(shouldProceed ? 'green' : 'orange'), textAlign: 'center' }}>
            <CheckCircleIcon sx={{ fontSize: 50, color: shouldProceed ? P.green.border : P.orange.border, mb: 1 }} />
            <Typography variant="h5" sx={{ color: shouldProceed ? P.green.border : P.orange.border }} gutterBottom>
              {shouldProceed ? 'Well done! Ready to continue.' : 'Practice Activities Ready'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Assigned Level: <strong>{level}</strong>
            </Typography>
            <Box
              component="button"
              onClick={handleContinue}
              sx={{
                px: 6, py: 1.5,
                bgcolor: shouldProceed ? P.green.bg : P.orange.bg,
                border: `2px solid ${shouldProceed ? P.green.border : P.orange.border}`,
                borderRadius: '16px',
                boxShadow: `4px 4px 0 ${shouldProceed ? P.green.shadow : P.orange.shadow}`,
                cursor: 'pointer',
                fontWeight: 'bold', fontSize: '1rem',
                color: shouldProceed ? P.green.border : P.orange.border,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${shouldProceed ? P.green.shadow : P.orange.shadow}` },
                transition: 'all 0.15s ease',
              }}
            >
              {shouldProceed ? 'Continue to SubPhase 2' : `Continue to ${level} Remedial Activities`}
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}
