import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, CircularProgress, LinearProgress, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { phase5API } from '../../lib/phase5_api.jsx'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' } }
const DARK  = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' } }
const clay  = (c) => ({ bgcolor: c.bg, border: `2px solid ${c.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${c.shadow}`, p: 3 })
const hoverLift = (c) => ({ '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${c.shadow}` } })

const determineRemedialLevel = (i2Score) => {
  if (i2Score <= 1) return 'A1'
  if (i2Score <= 2) return 'A2'
  if (i2Score <= 3) return 'B1'
  if (i2Score <= 4) return 'B2'
  return 'C1'
}

export default function Phase5SubPhase2Step3ScoreCalculation() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const [loading, setLoading] = useState(true)
  const [scores, setScores] = useState({ interaction1: 0, interaction2: 0, interaction3: 0, total: 0 })
  const [routing, setRouting] = useState(null)

  useEffect(() => { calculateScore() }, [])

  const calculateScore = async () => {
    try {
      const i1 = parseInt(sessionStorage.getItem('phase5_subphase2_step3_interaction1_score') || '0')
      const i2 = parseInt(sessionStorage.getItem('phase5_subphase2_step3_interaction2_score') || '0')
      const i3 = parseInt(sessionStorage.getItem('phase5_subphase2_step3_interaction3_score') || '0')
      const total = i1 + i2 + i3
      setScores({ interaction1: i1, interaction2: i2, interaction3: i3, total })

      const result = await phase5API.calculateStepScore(3, { interaction1_score: i1, interaction2_score: i2, interaction3_score: i3 }, 2)
      if (result.success && result.data) {
        const data = result.data
        const remedialLevel = data.total?.remedial_level || data.interaction2?.level || determineRemedialLevel(i2)
        const shouldProceed = data.total?.should_proceed ?? (i2 >= 3)
        setRouting({ remedialLevel, shouldProceed, totalScore: data.total?.score || total })
        sessionStorage.setItem('phase5_subphase2_step3_total_score', total.toString())
        sessionStorage.setItem('phase5_subphase2_step3_remedial_level', remedialLevel)
      } else {
        const remedialLevel = determineRemedialLevel(i2)
        setRouting({ remedialLevel, shouldProceed: i2 >= 3, totalScore: total })
        sessionStorage.setItem('phase5_subphase2_step3_total_score', total.toString())
        sessionStorage.setItem('phase5_subphase2_step3_remedial_level', remedialLevel)
      }
    } catch (e) {
      console.error(e)
      const i1 = parseInt(sessionStorage.getItem('phase5_subphase2_step3_interaction1_score') || '0')
      const i2 = parseInt(sessionStorage.getItem('phase5_subphase2_step3_interaction2_score') || '0')
      const i3 = parseInt(sessionStorage.getItem('phase5_subphase2_step3_interaction3_score') || '0')
      const total = i1 + i2 + i3
      const remedialLevel = determineRemedialLevel(i2)
      setScores({ interaction1: i1, interaction2: i2, interaction3: i3, total })
      setRouting({ remedialLevel, shouldProceed: i2 >= 3, totalScore: total })
      sessionStorage.setItem('phase5_subphase2_step3_total_score', total.toString())
      sessionStorage.setItem('phase5_subphase2_step3_remedial_level', remedialLevel)
    } finally { setLoading(false) }
  }

  const handleContinue = () => {
    if (!routing) return
    if (routing.shouldProceed) navigate('/phase5/subphase/2/step/4')
    else navigate(`/phase5/subphase/2/step/3/remedial/${routing.remedialLevel.toLowerCase()}/task/a`)
  }

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: LIGHT.pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">Calculating your score...</Typography>
          <LinearProgress sx={{ mt: 2, width: 300 }} />
        </Box>
      </Box>
    )
  }

  const resultColor = routing?.shouldProceed ? P.green : P.yellow

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: P.orange.border, mb: 1 }}>Phase 5: Execution &amp; Problem-Solving</Typography>
            <Typography variant="h5" sx={{ color: P.orange.border }}>SubPhase 2 Step 3: Score Summary</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...clay(P.blue), mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: P.blue.border, mb: 2 }}>Your Scores</Typography>
            <Stack spacing={2}>
              {[['Interaction 1', scores.interaction1, 4], ['Interaction 2', scores.interaction2, 4], ['Interaction 3', scores.interaction3, 1]].map(([label, score, max]) => (
                <Box key={label} sx={{ ...clay(P.blue), p: 2 }}>
                  <Typography>{label}: {score}/{max}</Typography>
                </Box>
              ))}
              <Box sx={{ ...clay(P.orange), p: 2 }}>
                <Typography variant="h6" sx={{ color: P.orange.border }}>Total: {scores.total}/9</Typography>
              </Box>
            </Stack>
          </Box>
        </motion.div>
        {routing && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Box sx={{ ...clay(resultColor), mb: 3 }}>
              <Typography variant="h6" sx={{ color: resultColor.border, mb: 1 }}>
                {routing.shouldProceed ? 'Ready to Continue!' : 'Remedial Activities Recommended'}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
                {routing.shouldProceed
                  ? 'Great work! You\'ve demonstrated strong understanding. You can proceed to Step 4.'
                  : `Based on your performance, we recommend completing remedial activities at the ${routing.remedialLevel} level.`}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>Assigned Level: <strong>{routing.remedialLevel}</strong></Typography>
              <Box component="button" onClick={handleContinue}
                sx={{ ...clay(resultColor), ...hoverLift(resultColor), cursor: 'pointer', px: 4, py: 1.5, fontWeight: 'bold', fontSize: '1rem', color: resultColor.border, transition: 'all 0.15s', width: '100%' }}>
                {routing.shouldProceed ? 'Continue to Step 4 →' : `Start ${routing.remedialLevel} Remedial Activities →`}
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
