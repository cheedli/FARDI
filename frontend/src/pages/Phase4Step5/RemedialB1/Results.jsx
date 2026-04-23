import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container, useTheme, LinearProgress } from '@mui/material'
import { motion } from 'framer-motion'

/**
 * Phase 4 Step 5 - Remedial B1 - Results Page
 * Total: 39 points with a required-task threshold of 22/27
 */

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

const TASKS = [
  { key: 'taskA', label: 'Task A - Negotiation Battle', icon: '⚔️', max: 4 },
  { key: 'taskB', label: 'Task B - Definition Duel', icon: '🥊', max: 8 },
  { key: 'taskC', label: 'Task C - Wordshake Quiz', icon: '🎮', max: 6 },
  { key: 'taskD', label: 'Task D - Quizlet Flashcards', icon: '🃏', max: 8 },
  { key: 'taskE', label: 'Task E - Tense Time Travel', icon: '⏰', max: 6 },
  { key: 'taskF', label: 'Task F - Grammar Kahoot', icon: '🎯', max: 6 },
]
const MAX_TOTAL = 39
const PASS_THRESHOLD = 22

export default function Phase4Step5RemedialB1Results() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const [loading, setLoading] = useState(true)
  const [scores, setScores] = useState(null)

  useEffect(() => {
    calculateFinalScore()
  }, [])

  const calculateFinalScore = async () => {
    const taskScores = {}
    let total = 0
    TASKS.forEach(t => {
      const s = parseInt(sessionStorage.getItem(`phase4_step5_remedial_b1_${t.key}_score`) || '0')
      taskScores[t.key] = s; total += s
    })
    const requiredScore = taskScores.taskA + taskScores.taskB + taskScores.taskC + taskScores.taskD
    const passed = requiredScore >= PASS_THRESHOLD

    try {
      const response = await fetch('/api/phase4/step5/remedial/b1/final-score', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ task_a_score: taskScores.taskA, task_b_score: taskScores.taskB, task_c_score: taskScores.taskC, task_d_score: taskScores.taskD, task_e_score: taskScores.taskE, task_f_score: taskScores.taskF })
      })
      const data = await response.json()
      if (data.success) {
        sessionStorage.setItem('phase4_step5_b1_next_url', data.data.next_url || (passed ? '/phase4_2/step/1' : '/phase4/step/5/remedial/b1/taskA'))
      }
    } catch (err) { console.error('Failed to log final score:', err) }

    setScores({ ...taskScores, total, requiredScore, passed }); setLoading(false)
  }

  const handleContinue = () => {
    TASKS.forEach(t => sessionStorage.removeItem(`phase4_step5_remedial_b1_${t.key}_score`))
    navigate(sessionStorage.getItem('phase4_step5_b1_next_url') || (scores.passed ? '/phase4_2/step/1' : '/phase4/step/5/remedial/b1/taskA'))
  }

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: LIGHT.pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Calculating your results...</Typography>
          <LinearProgress sx={{ width: 300, borderRadius: 1 }} />
        </Box>
      </Box>
    )
  }

  const percentage = Math.round((scores.total / MAX_TOTAL) * 100)
  const passed = scores.passed

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>

          <Box sx={{ bgcolor: passed ? P.green.bg : P.orange.bg, border: `2px solid ${passed ? P.green.border : P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${passed ? P.green.shadow : P.orange.shadow}`, p: 5, textAlign: 'center', mb: 3 }}>
            <Typography variant="h3" fontWeight="bold" sx={{ color: passed ? P.green.shadow : P.orange.shadow }}>
              {passed ? '🏆 Level Cleared! 🏆' : '💪 Keep Going! 💪'}
            </Typography>
            <Typography variant="h2" fontWeight="bold" sx={{ color: passed ? P.green.shadow : P.orange.shadow, mt: 2 }}>{scores.total} <Typography component="span" variant="h4" sx={{ color: passed ? P.green.border : P.orange.border }}>/ {MAX_TOTAL}</Typography></Typography>
            <Typography variant="h5" sx={{ color: passed ? P.green.border : P.orange.border }}>({percentage}%) — {passed ? 'PASSED' : 'NOT PASSED'}</Typography>
            <Typography variant="body1" sx={{ mt: 2, color: passed ? P.green.shadow : P.orange.shadow }}>
              {passed ? "Excellent work! You've cleared the required B1 tasks." : `You need ${PASS_THRESHOLD} points on required tasks A-D (${Math.max(0, PASS_THRESHOLD - scores.requiredScore)} more needed).`}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, color: passed ? P.green.shadow : P.orange.shadow }}>Required Threshold: {PASS_THRESHOLD} / 27 on tasks A-D</Typography>
          </Box>

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>Score Breakdown</Typography>
            <Stack spacing={1.5}>
              {TASKS.map((task) => {
                const s = scores[task.key]
                const pct = Math.round((s / task.max) * 100)
                const good = pct >= 75
                return (
                  <Box key={task.key}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                      <Typography variant="body2" fontWeight="bold" sx={{ color: P.blue.shadow }}>{task.icon} {task.label}:</Typography>
                      <Typography variant="body2" fontWeight="bold" sx={{ color: good ? P.green.shadow : P.yellow.shadow }}>{s} / {task.max}</Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={pct} sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(0,0,0,0.1)', '& .MuiLinearProgress-bar': { bgcolor: good ? P.green.border : P.yellow.border } }} />
                  </Box>
                )
              })}
            </Stack>
          </Box>

          <Box sx={{ bgcolor: passed ? P.green.bg : P.yellow.bg, border: `2px solid ${passed ? P.green.border : P.yellow.border}`, borderRadius: '16px', boxShadow: `3px 3px 0 ${passed ? P.green.shadow : P.yellow.shadow}`, p: 2.5, mb: 3 }}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ color: passed ? P.green.shadow : P.yellow.shadow }}>
              {passed ? '✅ You passed!' : '⚠️ Almost there — try again!'}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, color: passed ? P.green.shadow : P.yellow.shadow }}>
              {passed ? "Great job mastering B1 evaluation skills. You're ready to move forward!" : 'Review tasks with scores below 75% and retry. You can do it!'}
            </Typography>
          </Box>

          <Box component="button" onClick={handleContinue} sx={{ display: 'block', width: '100%', bgcolor: passed ? P.green.bg : P.orange.bg, border: `2px solid ${passed ? P.green.border : P.orange.border}`, borderRadius: '16px', boxShadow: `4px 4px 0 ${passed ? P.green.shadow : P.orange.shadow}`, p: 2, cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', color: passed ? P.green.shadow : P.orange.shadow, textAlign: 'center', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${passed ? P.green.shadow : P.orange.shadow}` } }}>
            {passed ? '🏆 Continue to Phase 4.2' : '🔄 Try Again from Task A'}
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
