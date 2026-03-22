import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  CircularProgress,
  LinearProgress,
  Stack,
  Container
} from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase5API } from '../../lib/phase5_api.jsx'

const LIGHT = {
  pageBg: '#FFFDE7',
  blue:   { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
  teal:   { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  red:    { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
  teal:   { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  red:    { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

/**
 * Phase 5 Step 1: Score Calculation & Remedial Routing
 * Calculates total score from all 3 interactions and routes to appropriate remedial level
 */

export default function Phase5Step1ScoreCalculation() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const P = isDark ? DARK : LIGHT
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

  const calculateScore = async () => {
    setCalculating(true)

    try {
      // Get scores from sessionStorage
      const interaction1Score = parseInt(sessionStorage.getItem('phase5_step1_interaction1_score') || '0')
      const interaction2Score = parseInt(sessionStorage.getItem('phase5_step1_interaction2_score') || '0')
      const interaction3Score = parseInt(sessionStorage.getItem('phase5_step1_interaction3_score') || '0')

      const totalScore = interaction1Score + interaction2Score + interaction3Score

      setScores({
        interaction1: interaction1Score,
        interaction2: interaction2Score,
        interaction3: interaction3Score,
        total: totalScore
      })

      // Send to backend for calculation and routing decision
      const result = await phase5API.calculateStepScore(1, {
        interaction1_score: interaction1Score,
        interaction2_score: interaction2Score,
        interaction3_score: interaction3Score
      })

      if (result.success && result.data) {
        const data = result.data
        const remedialLevel = data.total?.remedial_level || data.interaction2?.level || determineRemedialLevel(interaction2Score)
        const shouldProceed = data.total?.should_proceed ?? (interaction2Score >= 3)

        setRouting({
          remedialLevel,
          shouldProceed,
          totalScore: data.total_score || totalScore
        })

        // Store in sessionStorage
        sessionStorage.setItem('phase5_step1_total_score', totalScore.toString())
        sessionStorage.setItem('phase5_step1_remedial_level', remedialLevel)

        console.log('\n' + '='.repeat(60))
        console.log('PHASE 5 STEP 1 - SCORE SUMMARY')
        console.log('='.repeat(60))
        console.log('Interaction 1 (Wordshake):', interaction1Score, '/5')
        console.log('Interaction 2 (Solution):', interaction2Score, '/5')
        console.log('Interaction 3 (Sushi Spell):', interaction3Score, '/5')
        console.log('-'.repeat(60))
        console.log('TOTAL SCORE:', totalScore, '/15')
        console.log('Assigned Level:', remedialLevel)
        console.log('Should Proceed:', shouldProceed)
        console.log('='.repeat(60) + '\n')
      } else {
        // Fallback routing
        const remedialLevel = determineRemedialLevel(interaction2Score)
        setRouting({
          remedialLevel,
          shouldProceed: interaction2Score >= 3,
          totalScore
        })
        sessionStorage.setItem('phase5_step1_total_score', totalScore.toString())
        sessionStorage.setItem('phase5_step1_remedial_level', remedialLevel)
      }
    } catch (error) {
      console.error('Error calculating score:', error)
      // Fallback: use sessionStorage scores
      const interaction1Score = parseInt(sessionStorage.getItem('phase5_step1_interaction1_score') || '0')
      const interaction2Score = parseInt(sessionStorage.getItem('phase5_step1_interaction2_score') || '0')
      const interaction3Score = parseInt(sessionStorage.getItem('phase5_step1_interaction3_score') || '0')
      const totalScore = interaction1Score + interaction2Score + interaction3Score
      const remedialLevel = determineRemedialLevel(totalScore)

      setScores({
        interaction1: interaction1Score,
        interaction2: interaction2Score,
        interaction3: interaction3Score,
        total: totalScore
      })

      setRouting({
        remedialLevel,
        shouldProceed: interaction2Score >= 3,
        totalScore
      })

      sessionStorage.setItem('phase5_step1_total_score', totalScore.toString())
      sessionStorage.setItem('phase5_step1_remedial_level', remedialLevel)
    } finally {
      setCalculating(false)
      setLoading(false)
    }
  }

  const determineRemedialLevel = (i2Score) => {
    // Remedial level based on Interaction 2 (CEFR assessment) score
    if (i2Score <= 1) return 'A1'
    if (i2Score <= 2) return 'A2'
    if (i2Score <= 3) return 'B1'
    if (i2Score <= 4) return 'B2'
    return 'C1'
  }

  const handleContinue = () => {
    if (!routing) return

    if (routing.shouldProceed) {
      navigate('/phase5/subphase/1/step/2')
    } else {
      const levelLower = routing.remedialLevel.toLowerCase()
      navigate(`/phase5/subphase/1/step/1/remedial/${levelLower}/task/a`)
    }
  }

  if (loading || calculating) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ mb: 3, color: P.yellow.border }} />
          <Typography variant="h6" color={P.yellow.shadow}>Calculating your score...</Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: P.blue.bg,
            border: `2px solid ${P.blue.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h4" gutterBottom fontWeight={700} color={P.blue.border}>
              Phase 5: Execution &amp; Problem-Solving
            </Typography>
            <Typography variant="h5" gutterBottom color={P.blue.shadow}>
              Step 1: Score Summary
            </Typography>
          </Box>

          {/* Score Summary */}
          <Box sx={{
            bgcolor: P.yellow.bg,
            border: `2px solid ${P.yellow.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.yellow.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h6" gutterBottom fontWeight={700} color={P.yellow.shadow}>
              Your Performance Summary
            </Typography>

            <Stack spacing={2} sx={{ mt: 2 }}>
              {[
                { label: 'Interaction 1 (Wordshake)', score: scores.interaction1, max: 5 },
                { label: 'Interaction 2 (Solution Suggestion)', score: scores.interaction2, max: 5 },
                { label: 'Interaction 3 (Sushi Spell)', score: scores.interaction3, max: 5 },
              ].map((item, i) => (
                <Box key={i} sx={{
                  bgcolor: P.blue.bg,
                  border: `2px solid ${P.blue.border}`,
                  borderRadius: '14px',
                  p: 2,
                }}>
                  <Typography variant="body1" gutterBottom fontWeight={600} color={P.blue.shadow}>
                    <strong>{item.label}:</strong> {item.score} / {item.max} points
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(item.score / item.max) * 100}
                    sx={{ mt: 1, height: 8, borderRadius: 1 }}
                    color="primary"
                  />
                </Box>
              ))}

              {/* Total */}
              <Box sx={{
                bgcolor: P.green.bg,
                border: `3px solid ${P.green.border}`,
                borderRadius: '14px',
                boxShadow: `3px 3px 0 ${P.green.shadow}`,
                p: 2,
              }}>
                <Typography variant="h5" gutterBottom fontWeight={700} color={P.green.shadow}>
                  Total Score: {scores.total} / 15 points
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(scores.total / 15) * 100}
                  sx={{ mt: 1, height: 10, borderRadius: 1 }}
                  color="success"
                />
              </Box>
            </Stack>
          </Box>

          {/* Routing Decision */}
          {routing && (
            <Box sx={{
              bgcolor: routing.shouldProceed ? P.green.bg : P.teal.bg,
              border: `2px solid ${routing.shouldProceed ? P.green.border : P.teal.border}`,
              borderRadius: '20px',
              boxShadow: `4px 4px 0 ${routing.shouldProceed ? P.green.shadow : P.teal.shadow}`,
              p: 3, mb: 3,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 50, color: routing.shouldProceed ? P.green.border : P.teal.border, mr: 2 }} />
                <Box>
                  <Typography variant="h5" fontWeight={700} color={routing.shouldProceed ? P.green.shadow : P.teal.shadow}>
                    {routing.shouldProceed ? 'Great Progress!' : 'Practice Time'}
                  </Typography>
                  <Typography variant="body2" color={isDark ? 'rgba(255,255,255,0.6)' : 'text.secondary'}>
                    Assigned Level: <strong>{routing.remedialLevel}</strong>
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body1" sx={{ mb: 2, color: isDark ? 'rgba(255,255,255,0.85)' : 'text.primary' }}>
                {routing.shouldProceed
                  ? `You've scored ${routing.totalScore} points! You'll proceed to remedial activities at ${routing.remedialLevel} level to strengthen your skills before moving forward.`
                  : `You've scored ${routing.totalScore} points. You'll complete remedial activities at ${routing.remedialLevel} level to build your problem-solving vocabulary and skills.`}
              </Typography>

              <Box sx={{
                bgcolor: P.blue.bg,
                border: `2px solid ${P.blue.border}`,
                borderRadius: '12px',
                p: 2, mb: 3,
              }}>
                <Typography variant="body2" color={P.blue.shadow}>
                  <strong>Next Steps:</strong> You'll complete remedial activities designed for {routing.remedialLevel} level.
                  These activities will help you practice problem-solving vocabulary and grammar.
                </Typography>
              </Box>

              <Box
                component="button"
                onClick={handleContinue}
                sx={{
                  width: '100%',
                  bgcolor: routing.shouldProceed ? P.green.bg : P.teal.bg,
                  border: `2px solid ${routing.shouldProceed ? P.green.border : P.teal.border}`,
                  borderRadius: '12px',
                  boxShadow: `3px 3px 0 ${routing.shouldProceed ? P.green.shadow : P.teal.shadow}`,
                  py: 1.5,
                  fontWeight: 700, fontSize: '1rem',
                  cursor: 'pointer',
                  color: routing.shouldProceed ? P.green.shadow : P.teal.shadow,
                  transition: 'transform 0.15s, box-shadow 0.15s',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${routing.shouldProceed ? P.green.shadow : P.teal.shadow}` },
                }}
              >
                Continue to {routing.remedialLevel} Remedial Activities
              </Box>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
