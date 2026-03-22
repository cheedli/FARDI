import React, { useEffect, useState } from 'react'
import { Box, Container, Typography, Stack, CircularProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import StarIcon from '@mui/icons-material/Star'

const LIGHT = {
  pageBg: '#FFFDE7',
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

export default function Phase6Complete() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const [saving, setSaving] = useState(true)

  // Gather scores from sessionStorage
  const sp1Steps = [1, 2, 3, 4, 5].map(s => parseInt(sessionStorage.getItem(`phase6_sp1_step${s}_total_score`) || '0'))
  const sp2Steps = [1, 2, 3, 4, 5].map(s => parseInt(sessionStorage.getItem(`phase6_sp2_step${s}_total_score`) || '0'))
  const sp1Total = sp1Steps.reduce((a, b) => a + b, 0)
  const sp2Total = sp2Steps.reduce((a, b) => a + b, 0)
  const grandTotal = sp1Total + sp2Total

  useEffect(() => {
    fetch('/api/phase/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        phase_number: 6,
        overall_score: grandTotal,
        final_level: ''
      })
    })
      .catch(() => {})
      .finally(() => setSaving(false))
  }, [])

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        {/* Celebration Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{
            bgcolor: P.teal.bg,
            border: `2px solid ${P.teal.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 4,
            mb: 3,
            textAlign: 'center'
          }}>
            <EmojiEventsIcon sx={{ fontSize: 100, mb: 2, color: P.yellow.border }} />
            <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: P.teal.shadow }}>
              Phase 6 Complete!
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.teal.border }}>
              Reflection and Evaluation Mastered
            </Typography>
            <Typography variant="body1" sx={{ color: P.teal.shadow, maxWidth: 500, mx: 'auto' }}>
              You have successfully completed all reflection and evaluation activities.
              You can now write post-event reports and give constructive peer feedback!
            </Typography>
          </Box>
        </motion.div>

        {saving ? (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Saving your progress...</Typography>
          </Box>
        ) : (
          <>
            {/* Score Summary */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Box sx={{
                bgcolor: P.blue.bg,
                border: `2px solid ${P.blue.border}`,
                borderRadius: '20px',
                boxShadow: `4px 4px 0 ${P.blue.shadow}`,
                p: 3,
                mb: 3
              }}>
                <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>
                  Score Summary
                </Typography>
                <Stack spacing={2}>
                  {/* SubPhase 6.1 */}
                  <Box sx={{
                    bgcolor: P.green.bg,
                    border: `2px solid ${P.green.border}`,
                    borderRadius: '16px',
                    boxShadow: `3px 3px 0 ${P.green.shadow}`,
                    p: 2
                  }}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ color: P.green.shadow, mb: 1 }}>
                      SubPhase 6.1: Writing a Post-Event Report
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                      {sp1Steps.map((score, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.5,
                            px: 1.5,
                            py: 0.5,
                            bgcolor: score >= 4 ? P.green.bg : P.yellow.bg,
                            border: `2px solid ${score >= 4 ? P.green.border : P.yellow.border}`,
                            borderRadius: '12px',
                            boxShadow: `2px 2px 0 ${score >= 4 ? P.green.shadow : P.yellow.shadow}`,
                          }}
                        >
                          <CheckCircleIcon sx={{ fontSize: 16, color: score >= 4 ? P.green.border : P.yellow.border }} />
                          <Typography variant="body2" fontWeight="bold" sx={{ color: score >= 4 ? P.green.shadow : P.yellow.shadow }}>
                            Step {idx + 1}: {score}/6
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                    <Typography variant="h6" sx={{ mt: 1, color: P.green.shadow }}>
                      Total: {sp1Total}/30
                    </Typography>
                  </Box>

                  {/* SubPhase 6.2 */}
                  <Box sx={{
                    bgcolor: P.purple.bg,
                    border: `2px solid ${P.purple.border}`,
                    borderRadius: '16px',
                    boxShadow: `3px 3px 0 ${P.purple.shadow}`,
                    p: 2
                  }}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ color: P.purple.shadow, mb: 1 }}>
                      SubPhase 6.2: Peer Feedback Discussion
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                      {sp2Steps.map((score, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.5,
                            px: 1.5,
                            py: 0.5,
                            bgcolor: score >= 4 ? P.purple.bg : P.yellow.bg,
                            border: `2px solid ${score >= 4 ? P.purple.border : P.yellow.border}`,
                            borderRadius: '12px',
                            boxShadow: `2px 2px 0 ${score >= 4 ? P.purple.shadow : P.yellow.shadow}`,
                          }}
                        >
                          <CheckCircleIcon sx={{ fontSize: 16, color: score >= 4 ? P.purple.border : P.yellow.border }} />
                          <Typography variant="body2" fontWeight="bold" sx={{ color: score >= 4 ? P.purple.shadow : P.yellow.shadow }}>
                            Step {idx + 1}: {score}/6
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                    <Typography variant="h6" sx={{ mt: 1, color: P.purple.shadow }}>
                      Total: {sp2Total}/30
                    </Typography>
                  </Box>

                  {/* Grand Total */}
                  <Box sx={{
                    bgcolor: P.yellow.bg,
                    border: `2px solid ${P.yellow.border}`,
                    borderRadius: '16px',
                    boxShadow: `3px 3px 0 ${P.yellow.shadow}`,
                    p: 2,
                    textAlign: 'center'
                  }}>
                    <StarIcon sx={{ fontSize: 40, color: P.yellow.border }} />
                    <Typography variant="h5" fontWeight="bold" sx={{ color: P.yellow.shadow }}>
                      Grand Total: {grandTotal}/60
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </motion.div>

            {/* Action Buttons */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Stack direction="row" spacing={2} justifyContent="center">
                <Box
                  component="button"
                  onClick={() => navigate('/dashboard')}
                  sx={{
                    cursor: 'pointer',
                    px: 4,
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
                  Back to Dashboard
                </Box>
                <Box
                  component="button"
                  onClick={() => navigate('/journey')}
                  sx={{
                    cursor: 'pointer',
                    px: 4,
                    py: 1.5,
                    bgcolor: P.blue.bg,
                    border: `2px solid ${P.blue.border}`,
                    borderRadius: '16px',
                    boxShadow: `4px 4px 0 ${P.blue.shadow}`,
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    color: P.blue.shadow,
                    '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` },
                    transition: 'all 0.15s'
                  }}
                >
                  View Journey
                </Box>
              </Stack>
            </motion.div>
          </>
        )}
      </Container>
    </Box>
  )
}
