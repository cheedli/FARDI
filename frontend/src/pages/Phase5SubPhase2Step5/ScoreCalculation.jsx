import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, CircularProgress, LinearProgress, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase5API } from '../../lib/phase5_api.jsx'

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

export default function Phase5SubPhase2Step5ScoreCalculation() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const [loading, setLoading] = useState(true)
  const [calculating, setCalculating] = useState(false)
  const [scores, setScores] = useState({ interaction1: 0, interaction2: 0, interaction3: 0, total: 0 })
  const [routing, setRouting] = useState(null)
  const [overall, setOverall] = useState(null)

  useEffect(() => { calculateScore() }, [])

  const calculateScore = async () => {
    setCalculating(true)
    try {
      const interaction1Score = parseInt(sessionStorage.getItem('phase5_subphase2_step5_interaction1_score') || '0')
      const interaction2Score = parseInt(sessionStorage.getItem('phase5_subphase2_step5_interaction2_score') || '0')
      const interaction3Score = parseInt(sessionStorage.getItem('phase5_subphase2_step5_interaction3_score') || '0')
      const totalScore = interaction1Score + interaction2Score + interaction3Score

      setScores({ interaction1: interaction1Score, interaction2: interaction2Score, interaction3: interaction3Score, total: totalScore })

      const result = await phase5API.calculateStepScore(5, {
        interaction1_score: interaction1Score,
        interaction2_score: interaction2Score,
        interaction3_score: interaction3Score
      }, 2)

      if (result.success && result.data) {
        const data = result.data
        const remedialLevel = data.total?.remedial_level || data.interaction2?.level || determineRemedialLevel(interaction2Score)
        const shouldProceed = data.total?.should_proceed ?? (interaction2Score >= 3)

        const overallTotal = data.overall?.total_score || (() => {
          const step1Score = parseInt(sessionStorage.getItem('phase5_subphase2_step1_total_score') || '0')
          const step2Score = parseInt(sessionStorage.getItem('phase5_subphase2_step2_total_score') || '0')
          const step3Score = parseInt(sessionStorage.getItem('phase5_subphase2_step3_total_score') || '0')
          const step4Score = parseInt(sessionStorage.getItem('phase5_subphase2_step4_total_score') || '0')
          return step1Score + step2Score + step3Score + step4Score + totalScore
        })()

        setOverall({
          total_score: overallTotal,
          required_score: data.overall?.required_score || 12,
          should_proceed: data.overall?.should_proceed ?? (overallTotal >= 12)
        })
        setRouting({ remedialLevel, shouldProceed, totalScore: data.total?.score || totalScore })
        sessionStorage.setItem('phase5_subphase2_step5_total_score', totalScore.toString())
        sessionStorage.setItem('phase5_subphase2_step5_remedial_level', remedialLevel)
        sessionStorage.setItem('phase5_subphase2_overall_total', overallTotal.toString())
      } else {
        const remedialLevel = determineRemedialLevel(interaction2Score)
        setRouting({ remedialLevel, shouldProceed: interaction2Score >= 3, totalScore })
        sessionStorage.setItem('phase5_subphase2_step5_total_score', totalScore.toString())
        sessionStorage.setItem('phase5_subphase2_step5_remedial_level', remedialLevel)
      }
    } catch (error) {
      console.error('Error calculating score:', error)
      const interaction1Score = parseInt(sessionStorage.getItem('phase5_subphase2_step5_interaction1_score') || '0')
      const interaction2Score = parseInt(sessionStorage.getItem('phase5_subphase2_step5_interaction2_score') || '0')
      const interaction3Score = parseInt(sessionStorage.getItem('phase5_subphase2_step5_interaction3_score') || '0')
      const totalScore = interaction1Score + interaction2Score + interaction3Score
      const remedialLevel = determineRemedialLevel(interaction2Score)
      setScores({ interaction1: interaction1Score, interaction2: interaction2Score, interaction3: interaction3Score, total: totalScore })
      setRouting({ remedialLevel, shouldProceed: interaction2Score >= 3, totalScore })
      sessionStorage.setItem('phase5_subphase2_step5_total_score', totalScore.toString())
      sessionStorage.setItem('phase5_subphase2_step5_remedial_level', remedialLevel)
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
    if (!routing) return
    if (routing.shouldProceed) {
      navigate('/phase5/complete')
    } else {
      const levelLower = routing.remedialLevel.toLowerCase()
      navigate(`/phase5/subphase/2/step/5/remedial/${levelLower}/task/a`)
    }
  }

  if (loading || calculating) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <Box sx={{
            bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`,
            p: 4, textAlign: 'center'
          }}>
            <CircularProgress size={60} sx={{ mb: 2, color: P.yellow.border }} />
            <Typography variant="h6" sx={{ color: P.yellow.shadow }}>Calculating your score...</Typography>
            <LinearProgress sx={{ mt: 2, borderRadius: 4 }} />
          </Box>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>
              Phase 5: Execution & Problem-Solving
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.shadow }}>
              SubPhase 2 Step 5: Final Score Summary
            </Typography>
          </Box>

          {/* Step 5 Scores */}
          <Box sx={{
            bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`,
            p: 3, mb: 3
          }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.yellow.shadow }}>
              Step 5 Scores
            </Typography>
            <Stack spacing={2}>
              {[
                { label: 'Interaction 1', value: scores.interaction1, max: 4 },
                { label: 'Interaction 2', value: scores.interaction2, max: 4 },
                { label: 'Interaction 3', value: scores.interaction3, max: 4 },
              ].map((item) => (
                <Box key={item.label} sx={{
                  bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                  borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`, p: 2
                }}>
                  <Typography>{item.label}: {item.value}/{item.max}</Typography>
                </Box>
              ))}
              <Box sx={{
                bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.yellow.shadow}`, p: 2
              }}>
                <Typography variant="h6">Step 5 Total: {scores.total}/12</Typography>
              </Box>
            </Stack>
          </Box>

          {/* Overall */}
          {overall && (
            <Box sx={{
              bgcolor: overall.should_proceed ? P.green.bg : P.orange.bg,
              border: `2px solid ${overall.should_proceed ? P.green.border : P.orange.border}`,
              borderRadius: '20px',
              boxShadow: `4px 4px 0 ${overall.should_proceed ? P.green.shadow : P.orange.shadow}`,
              p: 3, mb: 3
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 40, color: overall.should_proceed ? P.green.border : P.orange.border, mr: 2 }} />
                <Box>
                  <Typography variant="h6" sx={{ color: overall.should_proceed ? P.green.shadow : P.orange.shadow }}>
                    Overall SubPhase 2 Score
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total: {overall.total_score}/{overall.required_score} points
                  </Typography>
                </Box>
              </Box>
              <Box sx={{
                border: `1px solid ${overall.should_proceed ? P.green.border : P.orange.border}`,
                borderRadius: '12px', p: 2
              }}>
                {overall.should_proceed ? (
                  <Typography variant="body1">
                    Congratulations! You've completed SubPhase 2 with {overall.total_score} points. You can proceed to the next phase!
                  </Typography>
                ) : (
                  <Typography variant="body1">
                    You have {overall.total_score} points. You need {overall.required_score} points total to proceed. Complete remedial activities to improve your score.
                  </Typography>
                )}
              </Box>
            </Box>
          )}

          {/* Routing */}
          {routing && (
            <Box sx={{
              bgcolor: routing.shouldProceed ? P.green.bg : P.orange.bg,
              border: `2px solid ${routing.shouldProceed ? P.green.border : P.orange.border}`,
              borderRadius: '20px',
              boxShadow: `4px 4px 0 ${routing.shouldProceed ? P.green.shadow : P.orange.shadow}`,
              p: 3, mb: 3
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 40, color: routing.shouldProceed ? P.green.border : P.orange.border, mr: 2 }} />
                <Box>
                  <Typography variant="h6" sx={{ color: routing.shouldProceed ? P.green.shadow : P.orange.shadow }}>
                    {routing.shouldProceed ? 'Ready to Complete Phase 5!' : 'Remedial Activities Recommended'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Assigned Level: {routing.remedialLevel}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{
                border: `1px solid ${routing.shouldProceed ? P.green.border : P.orange.border}`,
                borderRadius: '12px', p: 2, mb: 2
              }}>
                {routing.shouldProceed ? (
                  <Typography variant="body1">
                    Great work! You've demonstrated strong understanding. You can proceed to complete Phase 5!
                  </Typography>
                ) : (
                  <Typography variant="body1">
                    Based on your performance, we recommend completing remedial activities at the <strong>{routing.remedialLevel}</strong> level to strengthen your skills before continuing.
                  </Typography>
                )}
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
                  py: 2, fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer',
                  color: routing.shouldProceed ? P.green.shadow : P.orange.shadow,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${routing.shouldProceed ? P.green.shadow : P.orange.shadow}` },
                  transition: 'all 0.15s ease'
                }}
              >
                {routing.shouldProceed ? 'Complete Phase 5 - View Final Results' : `Start ${routing.remedialLevel} Remedial Activities`}
              </Box>
            </Box>
          )}
        </motion.div>
      </Container>
    </Box>
  )
}
