import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Grid,
  Container,
  LinearProgress
} from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import HomeIcon from '@mui/icons-material/Home'
import { requestPhase42FinalScore } from '../../shared/routing.js'

/**
 * Phase 4.2 Step 2 - Level A2 Remedial Results
 * Shows combined results from Tasks A, B, and C
 * Pass threshold: 8/10
 */

const PASS_THRESHOLD = 8

export default function Phase4_2Step2RemedialA2Results() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
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
  const P = isDark ? DARK : LIGHT

  const [results, setResults] = useState({ taskA: 0, taskB: 0, taskC: 0, total: 0, passed: false })

  useEffect(() => {
    const taskAScore = parseFloat(sessionStorage.getItem('phase4_2_step2_remedial_a2_taskA_score') || '0')
    const taskBScore = parseFloat(sessionStorage.getItem('phase4_2_step2_remedial_a2_taskB_score') || '0')
    const taskCScore = parseFloat(sessionStorage.getItem('phase4_2_step2_remedial_a2_taskC_score') || '0')
    const totalScore = taskAScore + taskBScore + taskCScore
    const averageScore = totalScore / 3
    const passed = averageScore >= PASS_THRESHOLD
    setResults({ taskA: taskAScore, taskB: taskBScore, taskC: taskCScore, total: averageScore, passed })
    logRemedialCompletion(averageScore, passed)
  }, [])

  const logRemedialCompletion = async (score) => {
    try {
      const data = await requestPhase42FinalScore(2, 'a2', { total_score: score })
      if (data.passed) sessionStorage.setItem('phase4_2_redirect_url', data.next_url)
      else sessionStorage.removeItem('phase4_2_redirect_url')
    } catch (error) { console.error('Failed to log remedial completion:', error) }
  }

  const handleContinue = () => {
    if (results.passed) {
      sessionStorage.removeItem('phase4_2_step2_remedial_a2_taskA_score')
      sessionStorage.removeItem('phase4_2_step2_remedial_a2_taskB_score')
      sessionStorage.removeItem('phase4_2_step2_remedial_a2_taskC_score')
      navigate('/phase4_2/step/2/remedial/b1/taskA')
    } else {
      sessionStorage.removeItem('phase4_2_step2_remedial_a2_taskA_score')
      sessionStorage.removeItem('phase4_2_step2_remedial_a2_taskB_score')
      sessionStorage.removeItem('phase4_2_step2_remedial_a2_taskC_score')
      navigate('/phase4_2/step/2/remedial/a2/taskA')
    }
  }

  const progressPercent = (results.total / 10) * 100

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: results.passed ? P.green.bg : P.red.bg,
            border: `2px solid ${results.passed ? P.green.border : P.red.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${results.passed ? P.green.shadow : P.red.shadow}`,
            p: 3, mb: 3
          }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: results.passed ? P.green.shadow : P.red.shadow }}>
              Phase 4.2 Step 2 - Level A2 Remedial
            </Typography>
            <Typography variant="h6" sx={{ color: results.passed ? P.green.shadow : P.red.shadow }}>
              Final Results
            </Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3
          }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message={
                results.passed
                  ? "Excellent work! You've mastered the A2 social media vocabulary. You can proceed!"
                  : "Keep practicing! Review the vocabulary and try again. You can do it!"
              }
            />
          </Box>

          {/* Overall Result */}
          <Box sx={{
            bgcolor: results.passed ? P.green.bg : P.red.bg,
            border: `3px solid ${results.passed ? P.green.border : P.red.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${results.passed ? P.green.shadow : P.red.shadow}`,
            p: 4, mb: 3, textAlign: 'center'
          }}>
            {results.passed ? (
              <CheckCircleIcon sx={{ fontSize: 80, color: P.green.shadow, mb: 2 }} />
            ) : (
              <ErrorIcon sx={{ fontSize: 80, color: P.red.shadow, mb: 2 }} />
            )}
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: results.passed ? P.green.shadow : P.red.shadow }}>
              {results.passed ? 'You Passed!' : 'Not Yet...'}
            </Typography>
            <Typography variant="h2" fontWeight="bold" sx={{ color: results.passed ? P.green.shadow : P.red.shadow }}>
              {results.total.toFixed(1)}/10
            </Typography>
            <Typography variant="h6" sx={{ mt: 1, color: isDark ? '#aaa' : '#666' }}>
              Average Score
            </Typography>

            <LinearProgress
              variant="determinate"
              value={progressPercent}
              color={results.passed ? 'success' : 'error'}
              sx={{ height: 12, borderRadius: 6, my: 2 }}
            />

            <Box sx={{
              p: 2, mt: 1,
              bgcolor: results.passed ? P.green.bg : P.yellow.bg,
              border: `1px solid ${results.passed ? P.green.border : P.yellow.border}`,
              borderRadius: '12px'
            }}>
              {results.passed ? (
                <Typography sx={{ color: P.green.shadow }}>
                  You scored <strong>{results.total.toFixed(1)}/10</strong>, which is above the required <strong>{PASS_THRESHOLD}/10</strong> to proceed!
                </Typography>
              ) : (
                <Typography sx={{ color: P.yellow.shadow }}>
                  You scored <strong>{results.total.toFixed(1)}/10</strong>. You need at least <strong>{PASS_THRESHOLD}/10</strong> to proceed. Please try again!
                </Typography>
              )}
            </Box>
          </Box>

          {/* Task Breakdown */}
          <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow, mb: 2 }}>
            Task Breakdown:
          </Typography>

          <Grid container spacing={2} sx={{ mb: 4 }}>
            {[
              { label: 'Task A: Match Race', score: results.taskA },
              { label: 'Task B: Fill Frenzy', score: results.taskB },
              { label: 'Task C: Sentence Builder', score: results.taskC },
            ].map((task, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Box sx={{
                  bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                  borderRadius: '20px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
                  p: 3, textAlign: 'center',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` }
                }}>
                  <Typography variant="h6" gutterBottom sx={{ color: P.blue.shadow }}>
                    {task.label}
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: P.blue.shadow }}>
                    {task.score.toFixed(1)}/10
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Action Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Box component="button" onClick={handleContinue} sx={{
              bgcolor: results.passed ? P.green.bg : P.yellow.bg,
              border: `2px solid ${results.passed ? P.green.border : P.yellow.border}`,
              borderRadius: '12px', boxShadow: `3px 3px 0 ${results.passed ? P.green.shadow : P.yellow.shadow}`,
              px: 6, py: 2, fontWeight: 700, fontSize: '1.1rem',
              cursor: 'pointer', color: results.passed ? P.green.shadow : P.yellow.shadow,
              display: 'flex', alignItems: 'center', gap: 1,
              transition: 'transform 0.15s, box-shadow 0.15s',
              '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${results.passed ? P.green.shadow : P.yellow.shadow}` },
              '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${results.passed ? P.green.shadow : P.yellow.shadow}` }
            }}>
              {results.passed && <HomeIcon />}
              {results.passed ? 'Return to Dashboard' : 'Try Again'}
            </Box>
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
