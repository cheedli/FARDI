import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  LinearProgress,
  Stack
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../lib/phase6_api.jsx'

/**
 * Phase 6 SubPhase 1 Step 1: Score Calculation and Remedial Routing
 * Reads scores from sessionStorage, calculates total, and routes to remedial level
 */

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

export default function Phase6SP1Step1ScoreCalculation() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const [loading, setLoading] = useState(true)
  const [calculating, setCalculating] = useState(false)
  const [scores, setScores] = useState({
    interaction1: 0,
    interaction2: 0,
    interaction3: 0,
    total: 0
  })
  const [routing, setRouting] = useState(null)

  useEffect(() => {
    calculateScore()
  }, [])

  /**
   * Determine remedial level based on interaction2_score (writing task).
   * 1 → A2, 2 → B1, 3 → B2, 4 → C1
   */
  const determineRemedialLevel = (i2Score) => {
    if (i2Score <= 1) return 'A1'
    if (i2Score <= 2) return 'A2'
    if (i2Score <= 3) return 'B1'
    if (i2Score <= 4) return 'B2'
    return 'C1'
  }

  const calculateScore = async () => {
    setCalculating(true)

    try {
      // Read scores from sessionStorage
      const interaction1Score = parseInt(sessionStorage.getItem('phase6_sp1_step1_interaction1_score') || '0')
      const interaction2Score = parseInt(sessionStorage.getItem('phase6_sp1_step1_interaction2_score') || '1')
      const interaction3Score = parseInt(sessionStorage.getItem('phase6_sp1_step1_interaction3_score') || '0')
      const totalScore = interaction1Score + interaction2Score + interaction3Score

      setScores({
        interaction1: interaction1Score,
        interaction2: interaction2Score,
        interaction3: interaction3Score,
        total: totalScore
      })

      // Send to backend for calculation
      let remedialLevel = determineRemedialLevel(interaction2Score)
      let shouldProceed = interaction2Score >= 3

      try {
        const result = await phase6API.calculateStepScore(1, {
          interaction1_score: interaction1Score,
          interaction2_score: interaction2Score,
          interaction3_score: interaction3Score
        }, 1)

        if (result && result.data) {
          const data = result.data
          remedialLevel = data.total?.remedial_level || data.interaction2?.level || determineRemedialLevel(interaction2Score)
          shouldProceed = data.total?.should_proceed ?? (interaction2Score >= 3)
        } else if (result && result.remedial_level) {
          remedialLevel = result.remedial_level
        }
      } catch (apiError) {
        console.warn('Backend score calculation failed, using local routing:', apiError)
      }

      // Store in sessionStorage
      sessionStorage.setItem('phase6_sp1_step1_total_score', totalScore.toString())
      sessionStorage.setItem('phase6_sp1_step1_remedial_level', remedialLevel)

      setRouting({ remedialLevel, totalScore, shouldProceed })

      console.log('\n' + '='.repeat(60))
      console.log('PHASE 6 SP1 STEP 1 - SCORE SUMMARY')
      console.log('='.repeat(60))
      console.log('Interaction 1 (Wordshake):', interaction1Score, '/1')
      console.log('Interaction 2 (Festival Reflection):', interaction2Score, '/4')
      console.log('Interaction 3 (Sushi Spell):', interaction3Score, '/1')
      console.log('-'.repeat(60))
      console.log('TOTAL SCORE:', totalScore, '/6')
      console.log('Assigned Level:', remedialLevel)
      console.log('='.repeat(60) + '\n')

    } catch (error) {
      console.error('Error calculating score:', error)
      // Fallback
      const interaction1Score = parseInt(sessionStorage.getItem('phase6_sp1_step1_interaction1_score') || '0')
      const interaction2Score = parseInt(sessionStorage.getItem('phase6_sp1_step1_interaction2_score') || '1')
      const interaction3Score = parseInt(sessionStorage.getItem('phase6_sp1_step1_interaction3_score') || '0')
      const totalScore = interaction1Score + interaction2Score + interaction3Score
      const remedialLevel = determineRemedialLevel(interaction2Score)

      setScores({
        interaction1: interaction1Score,
        interaction2: interaction2Score,
        interaction3: interaction3Score,
        total: totalScore
      })

      const shouldProceed = interaction2Score >= 3
      setRouting({ remedialLevel, totalScore, shouldProceed })
      sessionStorage.setItem('phase6_sp1_step1_total_score', totalScore.toString())
      sessionStorage.setItem('phase6_sp1_step1_remedial_level', remedialLevel)
    } finally {
      setCalculating(false)
      setLoading(false)
    }
  }

  const handleContinue = () => {
    if (!routing) return
    if (routing.shouldProceed) {
      navigate('/phase6/subphase/1/step/2')
    } else {
      const levelLower = routing.remedialLevel.toLowerCase()
      navigate(`/phase6/subphase/1/step/1/remedial/${levelLower}/task/a`)
    }
  }

  if (loading || calculating) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ mb: 3, color: P.green.border }} />
          <Typography variant="h6">Calculating your score...</Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{
            bgcolor: P.blue.bg,
            border: `2px solid ${P.blue.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3,
            mb: 3
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>
              Phase 6: Reflection and Evaluation
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.border }}>
              Step 1: Score Summary
            </Typography>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}>
              See how you performed across all three interactions
            </Typography>
          </Box>
        </motion.div>

        {/* Score Breakdown */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <Box sx={{
            bgcolor: P.yellow.bg,
            border: `2px solid ${P.yellow.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.yellow.shadow}`,
            p: 3,
            mb: 3
          }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.yellow.shadow }}>
              Your Performance Summary
            </Typography>

            <Stack spacing={2} sx={{ mt: 2 }}>
              {[
                { label: 'Interaction 1 (Wordshake)', score: scores.interaction1, max: 1 },
                { label: 'Interaction 2 (Festival Reflection)', score: scores.interaction2, max: 4 },
                { label: 'Interaction 3 (Sushi Spell)', score: scores.interaction3, max: 1 },
              ].map((item, idx) => (
                <Box key={idx} sx={{
                  bgcolor: P.blue.bg,
                  border: `2px solid ${P.blue.border}`,
                  borderRadius: '14px',
                  boxShadow: `2px 2px 0 ${P.blue.shadow}`,
                  p: 2
                }}>
                  <Typography variant="body1" gutterBottom sx={{ color: P.blue.shadow }}>
                    <strong>{item.label}:</strong> {item.score} / {item.max} point{item.max !== 1 ? 's' : ''}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(item.score / item.max) * 100}
                    sx={{ mt: 1, height: 8, borderRadius: 1, '& .MuiLinearProgress-bar': { backgroundColor: P.green.border } }}
                  />
                </Box>
              ))}

              {/* Total */}
              <Box sx={{
                bgcolor: P.green.bg,
                border: `3px solid ${P.green.border}`,
                borderRadius: '16px',
                boxShadow: `3px 3px 0 ${P.green.shadow}`,
                p: 2
              }}>
                <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.green.shadow }}>
                  Total Score: {scores.total} / 6 points
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(scores.total / 6) * 100}
                  sx={{
                    mt: 1,
                    height: 12,
                    borderRadius: 1,
                    '& .MuiLinearProgress-bar': { backgroundColor: P.green.border }
                  }}
                />
              </Box>
            </Stack>
          </Box>
        </motion.div>

        {/* Routing Decision */}
        {routing && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
            <Box sx={{
              bgcolor: P.teal.bg,
              border: `2px solid ${P.teal.border}`,
              borderRadius: '20px',
              boxShadow: `4px 4px 0 ${P.teal.shadow}`,
              p: 3,
              mb: 3
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 50, color: P.teal.border, mr: 2 }} />
                <Box>
                  <Typography variant="h5" sx={{ color: P.teal.shadow }}>
                    Practice Activities Ready
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Assigned Level: <strong>{routing.remedialLevel}</strong>
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body1" sx={{ mb: 2 }}>
                Based on your reflection writing (Interaction 2), you have been assigned to{' '}
                <strong>{routing.remedialLevel}</strong> level remedial activities. These exercises will
                strengthen your post-event report writing skills before moving to Step 2.
              </Typography>

              <Box sx={{
                bgcolor: P.blue.bg,
                border: `2px solid ${P.blue.border}`,
                borderRadius: '12px',
                p: 2,
                mt: 2,
                mb: 3
              }}>
                <Typography variant="body2" sx={{ color: P.blue.shadow }}>
                  <strong>Next Steps:</strong> You will complete remedial activities designed for{' '}
                  {routing.remedialLevel} level. These activities will help you practise reflection and
                  evaluation language for writing post-event reports.
                </Typography>
              </Box>

              <Box
                component="button"
                onClick={handleContinue}
                sx={{
                  cursor: 'pointer',
                  width: '100%',
                  py: 1.5,
                  bgcolor: P.green.bg,
                  border: `2px solid ${P.green.border}`,
                  borderRadius: '16px',
                  boxShadow: `4px 4px 0 ${P.green.shadow}`,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: P.green.shadow,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s'
                }}
              >
                {routing.shouldProceed ? 'Continue to Step 2' : `Continue to ${routing.remedialLevel} Remedial Activities`}
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
