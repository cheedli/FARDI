import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Grid, LinearProgress, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import HomeIcon from '@mui/icons-material/Home'
import { requestPhase42FinalScore } from '../../shared/routing.js'

/**
 * Phase 4.2 Step 1 - Level A2 Remedial Results
 */

const PASS_THRESHOLD = 8

export default function Phase4_2RemedialA2Results() {
  const navigate = useNavigate()
  const [results, setResults] = useState({ taskA: 0, taskB: 0, taskC: 0, total: 0, passed: false })
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const LIGHT = {
    pageBg: '#FFFDE7',
    blue:   { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
    green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
    yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
    teal:   { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
    orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
    red:    { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
  }
  const DARK = {
    pageBg: '#0F0F1A',
    blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
    green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
    yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
    teal:   { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
    orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
    red:    { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
  }
  const P = isDark ? DARK : LIGHT

  useEffect(() => {
    const taskAScore = parseFloat(sessionStorage.getItem('phase4_2_remedial_a2_taskA_score') || '0')
    const taskBScore = parseFloat(sessionStorage.getItem('phase4_2_remedial_a2_taskB_score') || '0')
    const taskCScore = parseFloat(sessionStorage.getItem('phase4_2_remedial_a2_taskC_score') || '0')
    const averageScore = (taskAScore + taskBScore + taskCScore) / 3
    const passed = averageScore >= PASS_THRESHOLD
    setResults({ taskA: taskAScore, taskB: taskBScore, taskC: taskCScore, total: averageScore, passed })
    logRemedialCompletion(averageScore, passed)
  }, [])

  const logRemedialCompletion = async (score) => {
    try {
      const data = await requestPhase42FinalScore(1, 'a2', { total_score: score })
      if (data.passed) sessionStorage.setItem('phase4_2_redirect_url', data.next_url)
      else sessionStorage.removeItem('phase4_2_redirect_url')
    } catch (error) { console.error('Failed to log remedial completion:', error) }
  }

  const handleContinue = () => {
    sessionStorage.removeItem('phase4_2_remedial_a2_taskA_score')
    sessionStorage.removeItem('phase4_2_remedial_a2_taskB_score')
    sessionStorage.removeItem('phase4_2_remedial_a2_taskC_score')
    navigate(results.passed ? '/dashboard' : '/phase4_2/step/1/remedial/a2/taskA')
  }

  const progressPercent = (results.total / 10) * 100
  const R = results.passed ? P.green : P.red
  const TASKS = [
    { label: 'Task A: Dialogue Adventure', score: results.taskA },
    { label: 'Task B: Expand Quest', score: results.taskB },
    { label: 'Task C: Connector Quest', score: results.taskC },
  ]

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          <Box sx={{ bgcolor: R.bg, border: `2px solid ${R.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${R.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: R.shadow }}>Phase 4.2 Step 1 - Level A2 Remedial</Typography>
            <Typography variant="h6" sx={{ color: R.shadow }}>Final Results</Typography>
          </Box>

          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message={results.passed ? "Excellent work! You've mastered the A2 social media vocabulary. You can proceed!" : "Keep practicing! Review the vocabulary and try again. You can do it!"} />
          </Box>

          <Box sx={{ bgcolor: R.bg, border: `2px solid ${R.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${R.shadow}`, p: 4, mb: 3 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              {results.passed ? <CheckCircleIcon sx={{ fontSize: 80, color: R.shadow, mb: 2 }} /> : <ErrorIcon sx={{ fontSize: 80, color: R.shadow, mb: 2 }} />}
              <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: R.shadow }}>{results.passed ? '🎉 You Passed!' : '❌ Not Yet...'}</Typography>
              <Typography variant="h2" fontWeight="bold" sx={{ color: R.shadow }}>{results.total.toFixed(1)}/10</Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>Average Score</Typography>
            </Box>
            <LinearProgress variant="determinate" value={progressPercent} color={results.passed ? 'success' : 'error'} sx={{ height: 12, borderRadius: 6, mb: 3 }} />
            <Box sx={{ bgcolor: R.bg, border: `2px solid ${R.border}`, borderRadius: '12px', p: 2 }}>
              <Typography sx={{ color: R.shadow }}>
                {results.passed
                  ? <>You scored <strong>{results.total.toFixed(1)}/10</strong>, which is above the required <strong>{PASS_THRESHOLD}/10</strong> to proceed!</>
                  : <>You scored <strong>{results.total.toFixed(1)}/10</strong>. You need at least <strong>{PASS_THRESHOLD}/10</strong> to proceed. Please try again!</>}
              </Typography>
            </Box>
          </Box>

          <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow, mb: 2 }}>Task Breakdown:</Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {TASKS.map((t, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, textAlign: 'center' }}>
                  <Typography variant="h6" gutterBottom sx={{ color: P.blue.shadow }}>{t.label}</Typography>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: P.blue.shadow }}>{t.score.toFixed(1)}/10</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Box component="button" onClick={handleContinue} sx={{
              bgcolor: R.bg, border: `2px solid ${R.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${R.shadow}`,
              px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem', cursor: 'pointer', color: R.shadow,
              display: 'flex', alignItems: 'center', gap: 1,
              '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${R.shadow}` }
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
