import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, LinearProgress } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { phase5API } from '../../../lib/phase5_api.jsx'

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

export default function Phase5Step2RemedialB2Results() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const [loading, setLoading] = useState(true)
  const [scores, setScores] = useState({ taskA: 0, taskB: 0, taskC: 0, taskD: 0, total: 0, passed: false })
  const [countdown, setCountdown] = useState(10)
  const [nextUrl, setNextUrl] = useState('/phase5/subphase/1/step/2/remedial/b2/task/a')

  const cardSx = (color) => ({
    bgcolor: color.bg,
    border: `2px solid ${color.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${color.shadow}`,
    p: 3,
  })

  useEffect(() => { calculateFinalScore() }, [])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      handleRedirect()
    }
  }, [countdown])

  const calculateFinalScore = async () => {
    const taskAScore = parseInt(sessionStorage.getItem('phase5_step2_remedial_b2_taskA_score') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('phase5_step2_remedial_b2_taskB_score') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('phase5_step2_remedial_b2_taskC_score') || '0')
    const taskDScore = parseInt(sessionStorage.getItem('phase5_step2_remedial_b2_taskD_score') || '0')
    const total = taskAScore + taskBScore + taskCScore + taskDScore
    const passed = total >= 21
    setScores({ taskA: taskAScore, taskB: taskBScore, taskC: taskCScore, taskD: taskDScore, total, passed })
    setLoading(false)
    try {
      const result = await phase5API.calculateRemedialScore(2, 'B2', {
        task_a_score: taskAScore,
        task_b_score: taskBScore,
        task_c_score: taskCScore,
        task_d_score: taskDScore
      })
      const backendPassed = result?.data?.passed
      const backendNextUrl = result?.data?.next_url
      setScores(prev => ({ ...prev, passed: backendPassed ?? prev.passed }))
      setNextUrl(backendNextUrl || '/phase5/subphase/1/step/2/remedial/b2/task/a')
    } catch (e) {
      console.error(e)
    }
  }

  const handleRedirect = () => navigate(nextUrl)

  if (loading) return <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Typography>Loading results...</Typography></Box>

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Phase 5: Execution &amp; Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 2: Remedial Practice - Level B2</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Final Results</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(scores.passed ? P.green : P.orange), mb: 3, textAlign: 'center' }}>
            <EmojiEventsIcon sx={{ fontSize: 60, color: scores.passed ? P.green.border : P.orange.border, mb: 2 }} />
            <Typography variant="h4" fontWeight="bold" sx={{ color: scores.passed ? P.green.border : P.orange.border }} gutterBottom>
              {scores.passed ? 'Congratulations! You Passed!' : 'Keep Practicing!'}
            </Typography>
            <Typography variant="h5" sx={{ mt: 2 }} color="text.secondary">Total Score: {scores.total} / 26</Typography>
            <Typography variant="body1" sx={{ mt: 1 }} color="text.secondary">Pass Threshold: 21/26</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Box sx={{ ...cardSx(P.yellow), mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.yellow.border }}>Task Breakdown:</Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              {[
                { label: 'Task A (Role-Play Saga)', value: scores.taskA, max: 5 },
                { label: 'Task B (Instruction Odyssey)', value: scores.taskB, max: 8 },
                { label: 'Task C (Function Match)', value: scores.taskC, max: 8 },
                { label: 'Task D (Spell Quest)', value: scores.taskD, max: 6 },
              ].map((item, idx) => (
                <Box key={idx} sx={{ ...cardSx(P.blue), p: 2 }}>
                  <Typography variant="body1" gutterBottom>{item.label}: {item.value} / {item.max}</Typography>
                  <LinearProgress variant="determinate" value={(item.value / item.max) * 100} sx={{ height: 8, borderRadius: 4 }} />
                </Box>
              ))}
            </Stack>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Box sx={{ ...cardSx(scores.passed ? P.green : P.yellow), mb: 3 }}>
            <Typography variant="body1" sx={{ color: scores.passed ? P.green.border : P.yellow.border }}>
              {scores.passed ? 'You will proceed to the next step. Great work!' : `Redirecting to repeat B2 remedial in ${countdown} seconds...`}
            </Typography>
          </Box>
          <Box component="button" onClick={handleRedirect} sx={{ width: '100%', bgcolor: scores.passed ? P.green.bg : P.orange.bg, border: `2px solid ${scores.passed ? P.green.border : P.orange.border}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${scores.passed ? P.green.shadow : P.orange.shadow}`, py: 1.5, cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', color: scores.passed ? P.green.border : P.orange.border, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${scores.passed ? P.green.shadow : P.orange.shadow}` }, transition: 'all 0.15s ease' }}>
            {scores.passed ? 'Continue to Next Step' : 'Retry B2 Remedial'}
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}
