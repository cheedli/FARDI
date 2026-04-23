import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, LinearProgress, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { phase5API } from '../../../lib/phase5_api.jsx'

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
 * Phase 5 Step 1 - Remedial B1 - Results Page
 * Shows final scores and pass/fail status
 * All 6 tasks: A-F = 37 points total (5+8+6+8+6+6)
 * Pass threshold: 30/37 (80%)
 */

export default function Phase5Step1RemedialB1Results() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const P = isDark ? DARK : LIGHT
  const [loading, setLoading] = useState(true)
  const [scores, setScores] = useState({
    taskA: 0, taskB: 0, taskC: 0, taskD: 0, taskE: 0, taskF: 0,
    total: 0, passed: false
  })
  const [countdown, setCountdown] = useState(10)
  const [nextUrl, setNextUrl] = useState('/phase5/subphase/1/step/1/remedial/b1/task/a')

  useEffect(() => {
    calculateFinalScore()
  }, [])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      handleRedirect()
    }
  }, [countdown])

  const calculateFinalScore = async () => {
    const taskAScore = parseInt(sessionStorage.getItem('phase5_step1_remedial_b1_taskA_score') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('phase5_step1_remedial_b1_taskB_score') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('phase5_step1_remedial_b1_taskC_score') || '0')
    const taskDScore = parseInt(sessionStorage.getItem('phase5_step1_remedial_b1_taskD_score') || '0')
    const taskEScore = parseInt(sessionStorage.getItem('phase5_step1_remedial_b1_taskE_score') || '0')
    const taskFScore = parseInt(sessionStorage.getItem('phase5_step1_remedial_b1_taskF_score') || '0')

    const total = taskAScore + taskBScore + taskCScore + taskDScore + taskEScore + taskFScore
    const passed = total >= 30 // 30/37 = 80%

    setScores({ taskA: taskAScore, taskB: taskBScore, taskC: taskCScore, taskD: taskDScore, taskE: taskEScore, taskF: taskFScore, total, passed })
    setLoading(false)

    try {
      const result = await phase5API.calculateRemedialScore(1, 'B1', {
        task_a_score: taskAScore, task_b_score: taskBScore, task_c_score: taskCScore,
        task_d_score: taskDScore, task_e_score: taskEScore, task_f_score: taskFScore
      })
      const backendPassed = result?.data?.passed
      const backendNextUrl = result?.data?.next_url
      setScores(prev => ({ ...prev, passed: backendPassed ?? prev.passed }))
      setNextUrl(backendNextUrl || '/phase5/subphase/1/step/1/remedial/b1/task/a')
    } catch (error) {
      console.error('Failed to log final score:', error)
    }
  }

  const handleRedirect = () => {
    navigate(nextUrl)
  }

  if (loading) return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography color={P.blue.shadow}>Loading results...</Typography>
    </Box>
  )

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: P.orange.bg,
            border: `2px solid ${P.orange.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.orange.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h4" gutterBottom fontWeight={700} color={P.orange.border}>Phase 5: Execution &amp; Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom color={P.orange.shadow}>Step 1: Remedial Practice - Level B1</Typography>
            <Typography variant="h6" color={P.orange.shadow}>Final Results</Typography>
          </Box>

          {/* Pass/Fail Card */}
          <Box sx={{
            bgcolor: scores.passed ? P.green.bg : P.red.bg,
            border: `2px solid ${scores.passed ? P.green.border : P.red.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${scores.passed ? P.green.shadow : P.red.shadow}`,
            p: 4, mb: 3, textAlign: 'center',
          }}>
            <EmojiEventsIcon sx={{ fontSize: 60, color: scores.passed ? P.green.border : P.red.border, mb: 2 }} />
            <Typography variant="h4" fontWeight={700} color={scores.passed ? P.green.shadow : P.red.shadow} gutterBottom>
              {scores.passed ? 'Congratulations! You Passed!' : 'Keep Practicing!'}
            </Typography>
            <Typography variant="h5" sx={{ mt: 2, color: scores.passed ? P.green.shadow : P.red.shadow }}>
              Total Score: {scores.total} / 37
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, color: isDark ? 'rgba(255,255,255,0.6)' : 'text.secondary' }}>
              Pass Threshold: 30/37 (80%)
            </Typography>
          </Box>

          {/* Task Breakdown */}
          <Box sx={{
            bgcolor: P.blue.bg,
            border: `2px solid ${P.blue.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h6" gutterBottom fontWeight={700} color={P.blue.shadow}>Task Breakdown:</Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              {[
                { label: 'Task A (Negotiation)', score: scores.taskA, max: 5 },
                { label: 'Task B (Proposals)', score: scores.taskB, max: 8 },
                { label: 'Task C (Quiz)', score: scores.taskC, max: 6 },
                { label: 'Task D (Flashcards)', score: scores.taskD, max: 8 },
                { label: 'Task E (Past Tense)', score: scores.taskE, max: 6 },
                { label: 'Task F (Grammar)', score: scores.taskF, max: 6 },
              ].map((item, i) => (
                <Box key={i}>
                  <Typography variant="body2" fontWeight={600} color={P.blue.shadow} sx={{ mb: 0.5 }}>
                    {item.label}: {item.score} / {item.max}
                  </Typography>
                  <LinearProgress variant="determinate" value={(item.score / item.max) * 100} sx={{ height: 6, borderRadius: 1 }} color="primary" />
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Alert */}
          <Box sx={{
            bgcolor: scores.passed ? P.green.bg : P.yellow.bg,
            border: `2px solid ${scores.passed ? P.green.border : P.yellow.border}`,
            borderRadius: '14px',
            p: 2, mb: 3,
          }}>
            <Typography variant="body2" fontWeight={600} color={scores.passed ? P.green.shadow : P.yellow.shadow}>
              {scores.passed
                ? 'You will proceed to the next step. Great work!'
                : `Redirecting to repeat B1 remedial in ${countdown} seconds...`}
            </Typography>
          </Box>

          <Box
            component="button"
            onClick={handleRedirect}
            sx={{
              width: '100%',
              bgcolor: scores.passed ? P.green.bg : P.blue.bg,
              border: `2px solid ${scores.passed ? P.green.border : P.blue.border}`,
              borderRadius: '12px',
              boxShadow: `3px 3px 0 ${scores.passed ? P.green.shadow : P.blue.shadow}`,
              py: 1.5,
              fontWeight: 700, fontSize: '1rem',
              cursor: 'pointer',
              color: scores.passed ? P.green.shadow : P.blue.shadow,
              transition: 'transform 0.15s, box-shadow 0.15s',
              '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${scores.passed ? P.green.shadow : P.blue.shadow}` },
            }}
          >
            {scores.passed ? 'Continue to Dashboard' : 'Retry B1 Remedial'}
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
