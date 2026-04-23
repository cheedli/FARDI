import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, CircularProgress, LinearProgress, Stack, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase5API } from '../../lib/phase5_api.jsx'
import { usePhase5ScoreResume } from '../Phase5/shared/useScoreResumeSave.js'

const LIGHT = {
  pageBg: '#FFFDE7',
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
}

export default function Phase5Step4ScoreCalculation() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const [loading, setLoading] = useState(true)
  const [calculating, setCalculating] = useState(false)
  const [scores, setScores] = useState({
    interaction1: 0,
    interaction2: 0,
    interaction3Game: 0,
    interaction3Revision: 0,
    total: 0
  })
  const [routing, setRouting] = useState(null)

  usePhase5ScoreResume({ subphase: 1, step: 4, scores, routing })

  useEffect(() => {
    calculateScore()
  }, [])

  const calculateScore = async () => {
    setCalculating(true)
    try {
      const interaction1Score = parseInt(sessionStorage.getItem('phase5_step4_interaction1_score') || '0')
      const interaction2Score = parseInt(sessionStorage.getItem('phase5_step4_interaction2_score') || '0')
      const interaction3GameScore = parseInt(sessionStorage.getItem('phase5_step4_interaction3_game_score') || '0')
      const interaction3RevisionScore = parseInt(sessionStorage.getItem('phase5_step4_interaction3_revision_score') || '0')
      const totalScore = interaction1Score + interaction2Score + interaction3GameScore + interaction3RevisionScore

      setScores({ interaction1: interaction1Score, interaction2: interaction2Score, interaction3Game: interaction3GameScore, interaction3Revision: interaction3RevisionScore, total: totalScore })

      const result = await phase5API.calculateStepScore(4, {
        interaction1_score: interaction1Score,
        interaction2_score: interaction2Score,
        interaction3_score: interaction3GameScore,
        interaction3_revision_score: interaction3RevisionScore
      })

      if (result.success && result.data) {
        const data = result.data
        const remedialLevel = data.total?.remedial_level || data.interaction2?.level || determineRemedialLevel(interaction2Score)
        const shouldProceed = data.total?.should_proceed ?? (interaction2Score >= 3)
        const nextUrl = data.total?.next_url || data.next_url || (shouldProceed
          ? '/phase5/subphase/1/step/5'
          : `/phase5/subphase/1/step/4/remedial/${remedialLevel.toLowerCase()}/task/a`)
        setRouting({ remedialLevel, shouldProceed, totalScore: data.total?.score || data.total_score || totalScore, nextUrl })
        sessionStorage.setItem('phase5_step4_total_score', totalScore.toString())
        sessionStorage.setItem('phase5_step4_remedial_level', remedialLevel)
      } else {
        const remedialLevel = determineRemedialLevel(interaction2Score)
        const shouldProceed = interaction2Score >= 3
        setRouting({
          remedialLevel,
          shouldProceed,
          totalScore,
          nextUrl: shouldProceed
            ? '/phase5/subphase/1/step/5'
            : `/phase5/subphase/1/step/4/remedial/${remedialLevel.toLowerCase()}/task/a`
        })
        sessionStorage.setItem('phase5_step4_total_score', totalScore.toString())
        sessionStorage.setItem('phase5_step4_remedial_level', remedialLevel)
      }
    } catch (error) {
      console.error('Error calculating score:', error)
      const interaction2Score = parseInt(sessionStorage.getItem('phase5_step4_interaction2_score') || '2')
      const remedialLevel = determineRemedialLevel(interaction2Score)
      const shouldProceed = interaction2Score >= 3
      setRouting({
        remedialLevel,
        shouldProceed,
        totalScore,
        nextUrl: shouldProceed
          ? '/phase5/subphase/1/step/5'
          : `/phase5/subphase/1/step/4/remedial/${remedialLevel.toLowerCase()}/task/a`
      })
    } finally {
      setCalculating(false)
      setLoading(false)
    }
  }

  const determineRemedialLevel = (i2Score) => {
    if (i2Score <= 1) return 'A1'
    if (i2Score <= 2) return 'A2'
    if (i2Score <= 3) return 'B1'
    if (i2Score <= 4) return 'B2'
    return 'C1'
  }

  const handleContinue = () => {
    if (!routing?.nextUrl) return
    navigate(routing.nextUrl)
  }

  const clay = (color) => ({
    bgcolor: color.bg, border: `2px solid ${color.border}`,
    borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3,
  })

  if (loading || calculating) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ mb: 3, color: P.yellow.border }} />
          <Typography variant="h6">Calculating your score...</Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...clay(P.blue), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>Phase 5: Execution & Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.border }}>Step 4: Score Summary</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...clay(P.yellow), mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: P.yellow.border }}>Your Performance Summary</Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              {[
                { label: 'Interaction 1 (Social Media)', val: scores.interaction1, max: 5 },
                { label: 'Interaction 2 (Email)', val: scores.interaction2, max: 5 },
                { label: 'Interaction 3 (Game)', val: scores.interaction3Game, max: 1 },
                { label: 'Interaction 3 (Revision)', val: scores.interaction3Revision, max: 5 },
              ].map((item, idx) => (
                <Box key={idx} sx={{ bgcolor: P.blue.bg, border: `1px solid ${P.blue.border}`, borderRadius: '12px', p: 2 }}>
                  <Typography variant="body1" gutterBottom><strong>{item.label}:</strong> {item.val} / {item.max} points</Typography>
                  <LinearProgress variant="determinate" value={(item.val / item.max) * 100} sx={{ mt: 1, height: 8, borderRadius: 1 }} color="primary" />
                </Box>
              ))}
              <Box sx={{ bgcolor: P.green.bg, border: `3px solid ${P.green.border}`, borderRadius: '12px', p: 2 }}>
                <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.green.border }}>Total Score: {scores.total} / 16 points</Typography>
                <LinearProgress variant="determinate" value={(scores.total / 16) * 100} sx={{ mt: 1, height: 10, borderRadius: 1 }} color="success" />
              </Box>
            </Stack>
          </Box>
        </motion.div>

        {routing && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Box sx={{ ...clay(routing.shouldProceed ? P.green : P.orange), mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 50, color: routing.shouldProceed ? P.green.border : P.orange.border, mr: 2 }} />
                <Box>
                  <Typography variant="h5" sx={{ color: routing.shouldProceed ? P.green.border : P.orange.border }}>
                    {routing.shouldProceed ? 'Great Progress!' : 'Practice Time'}
                  </Typography>
                  <Typography variant="body2">Assigned Level: <strong>{routing.remedialLevel}</strong></Typography>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {routing.shouldProceed
                  ? `You've scored ${routing.totalScore} points! You'll proceed directly to Step 5.`
                  : `You've scored ${routing.totalScore} points. You'll complete remedial activities at ${routing.remedialLevel} level.`}
              </Typography>
              <Box sx={{ bgcolor: P.blue.bg, border: `1px solid ${P.blue.border}`, borderRadius: '12px', p: 2, mt: 2 }}>
                <Typography variant="body2" sx={{ color: P.blue.border }}>
                  <strong>Next Steps:</strong> {routing.shouldProceed
                    ? 'You will continue to Step 5.'
                    : `You'll complete remedial activities designed for ${routing.remedialLevel} level.`}
                </Typography>
              </Box>
              <Box
                component="button"
                onClick={handleContinue}
                sx={{
                  ...clay(routing.shouldProceed ? P.green : P.blue),
                  cursor: 'pointer', width: '100%', mt: 3,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${routing.shouldProceed ? P.green.shadow : P.blue.shadow}` },
                  transition: 'all 0.15s',
                }}
              >
                <Typography variant="button" fontWeight="bold" sx={{ color: routing.shouldProceed ? P.green.border : P.blue.border }}>
                  {routing.shouldProceed ? 'Continue to Step 5' : `Continue to ${routing.remedialLevel} Remedial Activities`}
                </Typography>
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
