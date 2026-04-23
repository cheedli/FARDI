import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container, LinearProgress, CircularProgress } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'

const LIGHT = {
  pageBg: '#FFFDE7',
  blue:   { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  red:    { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  red:    { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

/**
 * Phase 4 Step 3 - Remedial B1 - Results Page
 * Shows final scores and pass/fail status
 * Required tasks A-D determine pass: 22/27 required points.
 */

export default function RemedialB1Results() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const [loading, setLoading] = useState(true)
  const [scores, setScores] = useState({
    taskA: 0, taskB: 0, taskC: 0, taskD: 0, taskE: 0, taskF: 0, total: 0, passed: false
  })
  const [countdown, setCountdown] = useState(10)

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
    const taskAScore = parseInt(sessionStorage.getItem('remedial_step3_b1_taskA_score') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('remedial_step3_b1_taskB_score') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('remedial_step3_b1_taskC_score') || '0')
    const taskDScore = parseInt(sessionStorage.getItem('remedial_step3_b1_taskD_score') || '0')
    const taskEScore = parseInt(sessionStorage.getItem('remedial_step3_b1_taskE_score') || '0')
    const taskFScore = parseInt(sessionStorage.getItem('remedial_step3_b1_taskF_score') || '0')
    const requiredTotal = taskAScore + taskBScore + taskCScore + taskDScore
    const bonusTotal = taskEScore + taskFScore
    const total = requiredTotal + bonusTotal
    const passed = requiredTotal >= 22

    setScores({ taskA: taskAScore, taskB: taskBScore, taskC: taskCScore, taskD: taskDScore, taskE: taskEScore, taskF: taskFScore, total, passed })

    try {
      const response = await fetch('/api/phase4/step3/remedial/b1/final-score', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ task_a_score: taskAScore, task_b_score: taskBScore, task_c_score: taskCScore, task_d_score: taskDScore, task_e_score: taskEScore, task_f_score: taskFScore })
      })
      const data = await response.json()
      if (data.success) console.log('Step 3 B1 Final score logged to backend:', data.data)
    } catch (error) { console.error('Failed to log final score:', error) }

    setLoading(false)
  }

  const handleRedirect = () => {
    sessionStorage.removeItem('remedial_step3_b1_taskA_score')
    sessionStorage.removeItem('remedial_step3_b1_taskB_score')
    sessionStorage.removeItem('remedial_step3_b1_taskC_score')
    sessionStorage.removeItem('remedial_step3_b1_taskD_score')
    sessionStorage.removeItem('remedial_step3_b1_taskE_score')
    sessionStorage.removeItem('remedial_step3_b1_taskF_score')
    if (scores.passed) navigate('/phase4/step/4')
    else navigate('/phase4/step3/remedial/b1/taskA')
  }

  const handleRedirectNow = () => setCountdown(0)

  const cardSx = (color) => ({
    bgcolor: P[color].bg,
    border: `2px solid ${P[color].border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${P[color].shadow}`,
    p: 3,
  })

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ ...cardSx('blue'), textAlign: 'center', p: 5 }}>
          <CircularProgress sx={{ mb: 2, color: P.blue.border }} />
          <Typography variant="h5" fontWeight="bold">Calculating your final score...</Typography>
          <LinearProgress sx={{ mt: 2, borderRadius: 1, '& .MuiLinearProgress-bar': { bgcolor: P.blue.border } }} />
        </Box>
      </Box>
    )
  }

  const resultColor = scores.passed ? 'green' : 'orange'

  const taskRows = [
    { label: 'Task A: Negotiation Battle', score: scores.taskA, max: 7, threshold: 6 },
    { label: 'Task B: Definition Duel', score: scores.taskB, max: 7, threshold: 6 },
    { label: 'Task C: Wordshake Quiz', score: scores.taskC, max: 6, threshold: 5 },
    { label: 'Task D: Flashcard Game', score: scores.taskD, max: 7, threshold: 6 },
    { label: 'Task E: Tense Time Travel', score: scores.taskE, max: 6, threshold: 5 },
    { label: 'Task F: Grammar Kahoot', score: scores.taskF, max: 6, threshold: 5 },
  ]

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>

          {/* Header */}
          <Box sx={{ ...cardSx(resultColor), mb: 3, textAlign: 'center' }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>Phase 4 - Step 3: Remedial Activities</Typography>
            <Typography variant="h5">Level B1 - Final Results 🏆</Typography>
          </Box>

          {/* Main Results */}
          <Box sx={{ ...cardSx(resultColor), mb: 3, textAlign: 'center' }}>
            <EmojiEventsIcon sx={{ fontSize: 80, mb: 2, color: P[resultColor].border }} />
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              {scores.passed ? '🎉 Congratulations!' : '💪 Keep Practicing!'}
            </Typography>
            <Box sx={{ ...cardSx('yellow'), maxWidth: 320, mx: 'auto', my: 3 }}>
              <Typography variant="h2" fontWeight="bold" sx={{ color: scores.passed ? P.green.border : P.orange.border }}>
                {scores.total} / 39
              </Typography>
              <Typography variant="body1" color="text.secondary">Total Points</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Pass Threshold: 22/27 required points (~81%)
              </Typography>
            </Box>
            <Box sx={{ ...cardSx(scores.passed ? 'green' : 'red'), mt: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                {scores.passed ? '✅ You have passed Step 3 Remedial B1!' : '❌ Score below passing threshold'}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {scores.passed
                  ? "Excellent work! You've mastered the B1 level skills."
                  : "Don't worry! You'll restart from Task A to improve your skills."}
              </Typography>
            </Box>
          </Box>

          {/* Score Breakdown */}
          <Box sx={{ ...cardSx('blue'), mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>Score Breakdown</Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              {taskRows.map((row, i) => (
                <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', borderRadius: '12px' }}>
                  <Typography variant="body1">{row.label}</Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: row.score >= row.threshold ? P.green.border : P.orange.border }}>
                    {row.score} / {row.max}
                  </Typography>
                </Box>
              ))}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, ...cardSx(resultColor) }}>
                <Typography variant="h6" fontWeight="bold">Total Score</Typography>
                <Typography variant="h4" fontWeight="bold">{scores.total} / 39</Typography>
              </Box>
            </Stack>
          </Box>

          {/* Instructor Message */}
          <Box sx={{ ...cardSx('blue'), mb: 3 }}>
            <CharacterMessage
              character="MS. MABROUKI"
              message={scores.passed
                ? "Fantastic work! 🌟 You've successfully completed the B1 level remedial activities. Your dedication and effort have paid off. You're ready to move forward to the next challenge!"
                : "Good effort! 💪 You've made progress, but let's practice a bit more to strengthen your B1 skills. Don't be discouraged - learning takes time and repetition. You'll do even better on the next attempt!"}
            />
          </Box>

          {/* Countdown */}
          <Box sx={{ ...cardSx('yellow'), textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              {scores.passed ? 'Proceeding to dashboard...' : 'Restarting B1 remedial activities...'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Redirecting in {countdown} seconds
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(10 - countdown) * 10}
              sx={{ height: 8, borderRadius: 4, mb: 3, bgcolor: 'rgba(0,0,0,0.1)', '& .MuiLinearProgress-bar': { bgcolor: P[resultColor].border, borderRadius: 4 } }}
            />
            <Box
              component="button"
              onClick={handleRedirectNow}
              sx={{
                ...cardSx(resultColor),
                cursor: 'pointer', border: `2px solid ${P[resultColor].border}`,
                px: 4, py: 1.5, fontSize: '1rem', fontWeight: 'bold',
                color: P[resultColor].border, transition: 'all 0.2s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P[resultColor].shadow}` }
              }}
            >
              {scores.passed ? 'Go to Dashboard Now' : 'Restart Now'}
            </Box>
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
