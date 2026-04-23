import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, CircularProgress, LinearProgress } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase5API } from '../../lib/phase5_api.jsx'
import { usePhase5ScoreResume } from '../Phase5/shared/useScoreResumeSave.js'

const LIGHT = {
  pageBg: '#FFFDE7',
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
}

export default function Phase5Step3ScoreCalculation() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const [loading, setLoading] = useState(true)
  const [calculating, setCalculating] = useState(false)
  const [scores, setScores] = useState({
    interaction1Game: 0,
    interaction1Definition: 0,
    interaction2: 0,
    interaction3Game: 0,
    interaction3Term: 0,
    total: 0
  })
  const [routing, setRouting] = useState(null)

  usePhase5ScoreResume({ subphase: 1, step: 3, scores, routing })

  const cardSx = (color) => ({
    bgcolor: color.bg,
    border: `2px solid ${color.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${color.shadow}`,
    p: 3,
  })

  useEffect(() => {
    calculateScore()
  }, [])

  const calculateScore = async () => {
    setCalculating(true)
    try {
      const interaction1GameScore = parseInt(sessionStorage.getItem('phase5_step3_interaction1_game_score') || '0')
      const interaction1DefinitionScore = parseInt(sessionStorage.getItem('phase5_step3_interaction1_definition_score') || '0')
      const interaction2Score = parseInt(sessionStorage.getItem('phase5_step3_interaction2_score') || '0')
      const interaction3GameScore = parseInt(sessionStorage.getItem('phase5_step3_interaction3_game_score') || '0')
      const interaction3TermScore = parseInt(sessionStorage.getItem('phase5_step3_interaction3_term_score') || '0')
      const totalScore = interaction1GameScore + interaction1DefinitionScore + interaction2Score + interaction3GameScore + interaction3TermScore

      setScores({ interaction1Game: interaction1GameScore, interaction1Definition: interaction1DefinitionScore, interaction2: interaction2Score, interaction3Game: interaction3GameScore, interaction3Term: interaction3TermScore, total: totalScore })

      const result = await phase5API.calculateStepScore(3, {
        interaction1_score: interaction1GameScore,
        interaction1_definition_score: interaction1DefinitionScore,
        interaction2_score: interaction2Score,
        interaction3_score: interaction3GameScore,
        interaction3_term_score: interaction3TermScore
      })

      if (result.success && result.data) {
        const data = result.data
        const remedialLevel = data.total?.remedial_level || data.interaction2?.level || determineRemedialLevel(interaction2Score)
        const shouldProceed = data.total?.should_proceed ?? (interaction2Score >= 3)
        const nextUrl = data.total?.next_url || data.next_url || (shouldProceed
          ? '/phase5/subphase/1/step/4'
          : `/phase5/subphase/1/step/3/remedial/${remedialLevel.toLowerCase()}/task/a`)
        setRouting({ remedialLevel, shouldProceed, totalScore: data.total?.score || data.total_score || totalScore, nextUrl })
        sessionStorage.setItem('phase5_step3_total_score', totalScore.toString())
        sessionStorage.setItem('phase5_step3_remedial_level', remedialLevel)
      } else {
        const remedialLevel = determineRemedialLevel(interaction2Score)
        const shouldProceed = interaction2Score >= 3
        setRouting({
          remedialLevel,
          shouldProceed,
          totalScore,
          nextUrl: shouldProceed
            ? '/phase5/subphase/1/step/4'
            : `/phase5/subphase/1/step/3/remedial/${remedialLevel.toLowerCase()}/task/a`
        })
        sessionStorage.setItem('phase5_step3_total_score', totalScore.toString())
        sessionStorage.setItem('phase5_step3_remedial_level', remedialLevel)
      }
    } catch (error) {
      console.error('Error calculating score:', error)
      const interaction2Score = parseInt(sessionStorage.getItem('phase5_step3_interaction2_score') || '2')
      const remedialLevel = determineRemedialLevel(interaction2Score)
      const shouldProceed = interaction2Score >= 3
      setRouting({
        remedialLevel,
        shouldProceed,
        totalScore,
        nextUrl: shouldProceed
          ? '/phase5/subphase/1/step/4'
          : `/phase5/subphase/1/step/3/remedial/${remedialLevel.toLowerCase()}/task/a`
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

  if (loading || calculating) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h6">Calculating your score...</Typography>
        </Box>
      </Box>
    )
  }

  const scoreItems = [
    { label: 'Interaction 1 (Game)', value: scores.interaction1Game, max: 1 },
    { label: 'Interaction 1 (Definition)', value: scores.interaction1Definition, max: 5 },
    { label: 'Interaction 2 (Transparent)', value: scores.interaction2, max: 5 },
    { label: 'Interaction 3 (Game)', value: scores.interaction3Game, max: 1 },
    { label: 'Interaction 3 (Term Explanation)', value: scores.interaction3Term, max: 5 },
  ]

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>Phase 5: Execution &amp; Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.border }}>Step 3: Score Summary</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.yellow), mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.yellow.border }}>Your Performance Summary</Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              {scoreItems.map((item, idx) => (
                <Box key={idx} sx={{ ...cardSx(P.blue), p: 2 }}>
                  <Typography variant="body1" gutterBottom><strong>{item.label}:</strong> {item.value} / {item.max} point{item.max !== 1 ? 's' : ''}</Typography>
                  <LinearProgress variant="determinate" value={(item.value / item.max) * 100} sx={{ mt: 1, height: 8, borderRadius: 4 }} color="primary" />
                </Box>
              ))}
              <Box sx={{ ...cardSx(P.yellow), p: 2 }}>
                <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.yellow.border }}>Total Score: {scores.total} / 17 points</Typography>
                <LinearProgress variant="determinate" value={(scores.total / 17) * 100} sx={{ mt: 1, height: 10, borderRadius: 4 }} color="warning" />
              </Box>
            </Stack>
          </Box>
        </motion.div>

        {routing && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Box sx={{ ...cardSx(routing.shouldProceed ? P.green : P.orange), mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 50, color: routing.shouldProceed ? P.green.border : P.orange.border, mr: 2 }} />
                <Box>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: routing.shouldProceed ? P.green.border : P.orange.border }}>
                    {routing.shouldProceed ? 'Great Progress!' : 'Practice Time'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Assigned Level: <strong>{routing.remedialLevel}</strong></Typography>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ mb: 2 }} color="text.secondary">
                {routing.shouldProceed
                  ? `You've scored ${routing.totalScore} points! You'll proceed directly to Step 4.`
                  : `You've scored ${routing.totalScore} points. You'll complete remedial activities at ${routing.remedialLevel} level.`}
              </Typography>
              <Box sx={{ ...cardSx(P.teal), mb: 2 }}>
                <Typography variant="body2" sx={{ color: P.teal.border }}>
                  <strong>Next Steps:</strong> {routing.shouldProceed
                    ? 'You will continue to Step 4.'
                    : `You'll complete remedial activities designed for ${routing.remedialLevel} level.`}
                </Typography>
              </Box>
              <Box
                component="button"
                onClick={handleContinue}
                sx={{
                  width: '100%',
                  bgcolor: routing.shouldProceed ? P.green.bg : P.orange.bg,
                  border: `2px solid ${routing.shouldProceed ? P.green.border : P.orange.border}`,
                  borderRadius: '14px',
                  boxShadow: `4px 4px 0 ${routing.shouldProceed ? P.green.shadow : P.orange.shadow}`,
                  py: 1.5,
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  color: routing.shouldProceed ? P.green.border : P.orange.border,
                  mt: 1,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${routing.shouldProceed ? P.green.shadow : P.orange.shadow}` },
                  transition: 'all 0.15s ease',
                }}
              >
                {routing.shouldProceed ? 'Continue to Step 4' : `Continue to ${routing.remedialLevel} Remedial Activities`}
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
