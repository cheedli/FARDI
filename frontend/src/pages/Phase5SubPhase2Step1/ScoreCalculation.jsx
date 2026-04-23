import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, CircularProgress, LinearProgress, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase5API } from '../../lib/phase5_api.jsx'
import { getSubphase2MainRouting } from '../Phase5SubPhase2/shared/routing.js'
import { usePhase5ScoreResume } from '../Phase5/shared/useScoreResumeSave.js'

const LIGHT = { pageBg: '#FFFDE7', blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' }, orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' } }
const DARK  = { pageBg: '#0F0F1A', blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' }, orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' } }
const clay  = (c) => ({ bgcolor: c.bg, border: `2px solid ${c.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${c.shadow}`, p: 3 })
const hoverLift = (c) => ({ '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${c.shadow}` } })

export default function Phase5SubPhase2Step1ScoreCalculation() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const [loading, setLoading] = useState(true)
  const [calculating, setCalculating] = useState(false)
  const [scores, setScores] = useState({ interaction1: 0, interaction2: 0, interaction3: 0, total: 0 })
  const [routing, setRouting] = useState(null)

  usePhase5ScoreResume({ subphase: 2, step: 1, scores, routing })

  useEffect(() => { calculateScore() }, [])

  const calculateScore = async () => {
    setCalculating(true)
    try {
      const i1 = parseInt(sessionStorage.getItem('phase5_subphase2_step1_interaction1_score') || '0')
      const i2 = parseInt(sessionStorage.getItem('phase5_subphase2_step1_interaction2_score') || '0')
      const i3 = parseInt(sessionStorage.getItem('phase5_subphase2_step1_interaction3_score') || '0')
      const total = i1 + i2 + i3
      const localRouting = getSubphase2MainRouting(1, { interaction1: i1, interaction2: i2, interaction3: i3, total })
      setScores({ interaction1: i1, interaction2: i2, interaction3: i3, total })
      const result = await phase5API.calculateStepScore(1, { interaction1_score: i1, interaction2_score: i2, interaction3_score: i3 }, 2)
      const remedialLevel = result.success && result.data ? (result.data.total?.remedial_level || localRouting.remedialLevel) : localRouting.remedialLevel
      const shouldProceed = result.success && result.data ? (result.data.total?.should_proceed ?? localRouting.shouldProceed) : localRouting.shouldProceed
      const finalTotal = result.success && result.data ? (result.data.total?.score || total) : total
      const nextUrl = result.success && result.data ? (result.data.total?.next_url || result.data.next_url || localRouting.nextUrl) : localRouting.nextUrl
      setRouting({ remedialLevel, shouldProceed, totalScore: finalTotal, nextUrl })
      sessionStorage.setItem('phase5_subphase2_step1_total_score', total.toString())
      sessionStorage.setItem('phase5_subphase2_step1_remedial_level', remedialLevel)
    } catch (error) {
      console.error('Error calculating score:', error)
      const i1 = parseInt(sessionStorage.getItem('phase5_subphase2_step1_interaction1_score') || '0')
      const i2 = parseInt(sessionStorage.getItem('phase5_subphase2_step1_interaction2_score') || '0')
      const i3 = parseInt(sessionStorage.getItem('phase5_subphase2_step1_interaction3_score') || '0')
      const total = i1 + i2 + i3
      const localRouting = getSubphase2MainRouting(1, { interaction1: i1, interaction2: i2, interaction3: i3, total })
      setScores({ interaction1: i1, interaction2: i2, interaction3: i3, total })
      setRouting({ ...localRouting, totalScore: total })
      sessionStorage.setItem('phase5_subphase2_step1_total_score', total.toString())
      sessionStorage.setItem('phase5_subphase2_step1_remedial_level', localRouting.remedialLevel)
    } finally { setCalculating(false); setLoading(false) }
  }

  const handleContinue = () => {
    if (!routing?.nextUrl) return
    navigate(routing.nextUrl)
  }

  if (loading || calculating) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: (theme.palette.mode === 'dark' ? DARK : LIGHT).pageBg, py: 4 }}>
        <Container maxWidth="md">
          <Box sx={{ ...clay((theme.palette.mode === 'dark' ? DARK : LIGHT).yellow), textAlign: 'center', py: 6 }}>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>Calculating your score...</Typography>
            <LinearProgress sx={{ mt: 2 }} />
          </Box>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...clay(P.blue), mb: 3 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: P.blue.border, mb: 1 }}>Phase 5: Execution &amp; Problem-Solving</Typography>
            <Typography variant="h5" sx={{ color: P.blue.border }}>SubPhase 2 Step 1: Score Summary</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...clay(P.yellow), mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: P.yellow.border, mb: 2 }}>Your Scores</Typography>
            <Stack spacing={2}>
              {[
                ['Interaction 1 (Wordshake Game)', scores.interaction1, 1, 'Vocabulary activation and engagement'],
                ['Interaction 2 (Volunteer Instructions)', scores.interaction2, 4, 'Main assessment - Writing clear, polite instructions'],
                ['Interaction 3 (Sushi Spell Game)', scores.interaction3, 1, 'Vocabulary spelling practice'],
              ].map(([label, score, max, desc], i) => (
                <Box key={i} sx={{ ...clay(P.blue) }}>
                  <Typography variant="body1" gutterBottom><strong>{label}:</strong> {score}/{max} point{max > 1 ? 's' : ''}</Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>{desc}</Typography>
                </Box>
              ))}
              <Box sx={{ ...clay(P.green) }}>
                <Typography variant="h6" fontWeight="bold">Total Score: {scores.total}/6 points</Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>Maximum possible: 6 points (1 + 4 + 1)</Typography>
              </Box>
            </Stack>
          </Box>
        </motion.div>

        {routing && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Box sx={{ ...clay(routing.shouldProceed ? P.green : P.orange), mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 36, color: routing.shouldProceed ? P.green.border : P.orange.border, mr: 2 }} />
                <Box>
                  <Typography variant="h6" sx={{ color: routing.shouldProceed ? P.green.border : P.orange.border }}>
                    {routing.shouldProceed ? 'Ready to Continue!' : 'Remedial Activities Recommended'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>Assigned Level: {routing.remedialLevel}</Typography>
                </Box>
              </Box>
              <Box sx={{ bgcolor: routing.shouldProceed ? P.green.bg : P.orange.bg, border: `1px solid ${routing.shouldProceed ? P.green.border : P.orange.border}`, borderRadius: '10px', p: 2, mb: 2 }}>
                {routing.shouldProceed ? (
                  <Typography variant="body1">Great work! You've demonstrated strong understanding. You can proceed to Step 2.</Typography>
                ) : (
                  <Typography variant="body1">Based on your performance, we recommend completing remedial activities at the <strong>{routing.remedialLevel}</strong> level to strengthen your skills before continuing.</Typography>
                )}
              </Box>
              <Box component="button" onClick={handleContinue}
                sx={{ ...clay(routing.shouldProceed ? P.green : P.orange), ...hoverLift(routing.shouldProceed ? P.green : P.orange), cursor: 'pointer', px: 4, py: 1.5, fontWeight: 'bold', fontSize: '1rem', color: routing.shouldProceed ? P.green.border : P.orange.border, transition: 'all 0.15s', width: '100%' }}>
                {routing.shouldProceed ? 'Continue to Step 2' : `Start ${routing.remedialLevel} Remedial Activities`}
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
