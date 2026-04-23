import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, CircularProgress, LinearProgress, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import SchoolIcon from '@mui/icons-material/School'
import { phase6API } from '../../lib/phase6_api.jsx'
import { getSubphase1MainRouting } from '../Phase6SubPhase1/shared/routing.js'
import { usePhase6ScoreResume } from '../Phase6/shared/useScoreResumeSave.js'

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

export default function Phase6SP1Step2ScoreCalculation() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const [loading, setLoading] = useState(true)
  const [scores, setScores] = useState({ interaction1: 0, interaction2: 0, interaction3: 0, total: 0 })
  const [routing, setRouting] = useState(null)

  usePhase6ScoreResume({ subphase: 1, step: 2, scores, routing })

  useEffect(() => { calculateScore() }, [])

  const calculateScore = async () => {
    const interaction1Score = parseInt(sessionStorage.getItem('phase6_sp1_step2_interaction1_score') || '0')
    const interaction2Score = parseInt(sessionStorage.getItem('phase6_sp1_step2_interaction2_score') || '2')
    const interaction3Score = parseInt(sessionStorage.getItem('phase6_sp1_step2_interaction3_score') || '0')
    const totalScore = interaction1Score + interaction2Score + interaction3Score
    setScores({ interaction1: interaction1Score, interaction2: interaction2Score, interaction3: interaction3Score, total: totalScore })

    try {
      const fallbackRouting = getSubphase1MainRouting(2, interaction2Score)
      const result = await phase6API.calculateStepScore(2, {
        interaction1_score: interaction1Score, interaction2_score: interaction2Score, interaction3_score: interaction3Score
      }, 1)
      if (result && result.data) {
        const data = result.data
        const remedialLevel = data.total?.remedial_level || data.interaction2?.level || fallbackRouting.remedialLevel
        const shouldProceed = data.total?.should_proceed ?? fallbackRouting.shouldProceed
        const nextUrl = data.total?.next_url || data.next_url || fallbackRouting.nextUrl
        const resolvedTotalScore = data.total?.score ?? data.total_score ?? totalScore
        setRouting({ remedialLevel, totalScore: resolvedTotalScore, shouldProceed, nextUrl })
        sessionStorage.setItem('phase6_sp1_step2_total_score', resolvedTotalScore.toString())
        sessionStorage.setItem('phase6_sp1_step2_remedial_level', remedialLevel)
      } else throw new Error('No data')
    } catch (error) {
      console.error('Score calculation error:', error)
      const fallbackRouting = getSubphase1MainRouting(2, interaction2Score)
      setRouting({ ...fallbackRouting, totalScore })
      sessionStorage.setItem('phase6_sp1_step2_total_score', totalScore.toString())
      sessionStorage.setItem('phase6_sp1_step2_remedial_level', fallbackRouting.remedialLevel)
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    if (!routing) return
    navigate(routing.nextUrl)
  }

  const cardSx = (color) => ({
    bgcolor: color.bg,
    border: `2px solid ${color.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${color.shadow}`,
    p: 3
  })

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ mb: 3, color: P.yellow.border }} />
          <Typography variant="h6" color="text.secondary">Calculating your score...</Typography>
        </Box>
      </Box>
    )
  }

  const scorePercent = (scores.total / 7) * 100

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>
              Phase 6: Reflection &amp; Evaluation
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.border }}>Step 2: Score Summary</Typography>
            <Typography variant="body1" color="text.secondary">Writing a Post-Event Report - Explore Phase Results</Typography>
          </Box>
        </motion.div>

        {/* Score Breakdown */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx(P.yellow), mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SchoolIcon sx={{ fontSize: 36, color: P.yellow.border, mr: 2 }} />
              <Typography variant="h6" fontWeight="bold" sx={{ color: P.yellow.border }}>Your Performance Breakdown</Typography>
            </Box>
            <Stack spacing={2} sx={{ mt: 2 }}>
              {[
                { label: 'Interaction 1 (Sushi Spell)', score: scores.interaction1, max: 1 },
                { label: 'Interaction 2 (Writing Choice Explanation)', score: scores.interaction2, max: 5 },
                { label: 'Interaction 3 (Sushi Spell)', score: scores.interaction3, max: 1 }
              ].map((item, idx) => (
                <Box key={idx} sx={{ ...cardSx(P.blue), p: 2 }}>
                  <Typography variant="body1" gutterBottom>
                    <strong>{item.label}:</strong> {item.score} / {item.max} point{item.max > 1 ? 's' : ''}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(item.score / item.max) * 100}
                    sx={{ mt: 1, height: 8, borderRadius: 1, bgcolor: P.blue.bg, '& .MuiLinearProgress-bar': { bgcolor: P.blue.border } }}
                  />
                </Box>
              ))}

              <Box sx={{ ...cardSx(P.green), p: 2, border: `3px solid ${P.green.border}` }}>
                <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.green.border }}>
                  Total Score: {scores.total} / 7 points
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={scorePercent}
                  sx={{ mt: 1, height: 12, borderRadius: 1, bgcolor: P.green.bg, '& .MuiLinearProgress-bar': { bgcolor: P.green.border } }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{scorePercent.toFixed(0)}% of total points</Typography>
              </Box>
            </Stack>
          </Box>
        </motion.div>

        {/* Routing Card */}
        {routing && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Box sx={{ ...cardSx(routing.shouldProceed ? P.green : P.orange), mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 50, color: routing.shouldProceed ? P.green.border : P.orange.border, mr: 2 }} />
                <Box>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: routing.shouldProceed ? P.green.border : P.orange.border }}>
                    Step 2 Complete!
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Assigned Practice Level: <strong>{routing.remedialLevel}</strong>
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body1" sx={{ mb: 2 }}>
                {routing.shouldProceed
                  ? <>You scored <strong>{scores.total} / 7 points</strong> in the Explore phase and can continue directly to Step 3.</>
                  : <>You scored <strong>{scores.total} / 7 points</strong> in the Explore phase. You'll now complete tailored remedial activities at <strong>{routing.remedialLevel}</strong> level to strengthen your report writing skills.</>}
              </Typography>

              <Box sx={{ ...cardSx(P.blue), p: 2, mb: 3 }}>
                <Typography variant="body2">
                  <strong>Next Steps:</strong> {routing.shouldProceed ? 'Continue to Step 3.' : `Complete the remedial activities designed for your ${routing.remedialLevel} level. These activities will help you write a better post-event report.`}
                </Typography>
              </Box>

              <Box
                component="button"
                onClick={handleContinue}
                sx={{
                  width: '100%',
                  ...cardSx(routing.shouldProceed ? P.green : P.orange),
                  p: 2, cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem',
                  color: routing.shouldProceed ? P.green.border : P.orange.border,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${routing.shouldProceed ? P.green.shadow : P.orange.shadow}` },
                  transition: 'all 0.15s ease'
                }}
              >
                {routing.shouldProceed ? 'Continue to Step 3' : `Continue to ${routing.remedialLevel} Remedial Activities`}
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
