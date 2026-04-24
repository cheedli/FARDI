import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container, useTheme, LinearProgress } from '@mui/material'
import { motion } from 'framer-motion'

/**
 * Phase 4 Step 4 - Remedial B2 - Results Page
 * Shows scores from all 4 tasks (A, B, C, D)
 * Total: 24 points
 * Pass threshold: 20/24
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
  { key: 'A', label: 'Task A - Debate Simulation', max: 6 },
  { key: 'B', label: 'Task B - Critique Game', max: 6 },
  { key: 'C', label: 'Task C - Debate Grammar Game', max: 6 },
  { key: 'D', label: 'Task D - Error Correction Game', max: 6 },
]

export default function RemedialB2Results() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const [taskAScore, setTaskAScore] = useState(0)
  const [taskBScore, setTaskBScore] = useState(0)
  const [taskCScore, setTaskCScore] = useState(0)
  const [taskDScore, setTaskDScore] = useState(0)
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    const scoreA = parseInt(sessionStorage.getItem('remedial_step4_b2_taskA_score') || '0')
    const scoreB = parseInt(sessionStorage.getItem('remedial_step4_b2_taskB_score') || '0')
    const scoreC = parseInt(sessionStorage.getItem('remedial_step4_b2_taskC_score') || '0')
    const scoreD = parseInt(sessionStorage.getItem('remedial_step4_b2_taskD_score') || '0')
    setTaskAScore(scoreA); setTaskBScore(scoreB); setTaskCScore(scoreC); setTaskDScore(scoreD)

    const total = scoreA + scoreB + scoreC + scoreD
    const passed = total >= 20

    console.log('\n' + '='.repeat(60))
    console.log('PHASE 4 STEP 4 - REMEDIAL B2 - FINAL RESULTS')
    console.log('Total:', total, '/24 — Passed:', passed)
    console.log('='.repeat(60) + '\n')

    fetch('/api/phase4/step4/remedial/b2/final-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        task_a_score: scoreA,
        task_b_score: scoreB,
        task_c_score: scoreC,
        task_d_score: scoreD
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          sessionStorage.setItem('phase4_step4_b2_next_url', data.data.next_url || (passed ? '/phase4/step/5' : '/phase4/step/4/remedial/b2/taskA'))
        }
      })
      .catch(err => console.error('Failed to log Step 4 B2 final score:', err))

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          sessionStorage.removeItem('remedial_step4_b2_taskA_score')
          sessionStorage.removeItem('remedial_step4_b2_taskB_score')
          sessionStorage.removeItem('remedial_step4_b2_taskC_score')
          sessionStorage.removeItem('remedial_step4_b2_taskD_score')
          navigate(sessionStorage.getItem('phase4_step4_b2_next_url') || (passed ? '/phase4/step/4/remedial/c1/taskA' : '/phase4/step/4/remedial/b2/taskA'))
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [navigate])

  const total = taskAScore + taskBScore + taskCScore + taskDScore
  const passed = total >= 20
  const percentage = Math.round((total / 24) * 100)
  const scores = [taskAScore, taskBScore, taskCScore, taskDScore]

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>

          {/* Hero */}
          <Box sx={{
            bgcolor: passed ? P.green.bg : P.orange.bg,
            border: `2px solid ${passed ? P.green.border : P.orange.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${passed ? P.green.shadow : P.orange.shadow}`,
            p: 5, textAlign: 'center', mb: 3
          }}>
            <Typography variant="h3" fontWeight="bold" sx={{ color: passed ? P.green.shadow : P.orange.shadow }}>
              {passed ? '🎉 Congratulations! 🎉' : '💪 Keep Practicing! 💪'}
            </Typography>
            <Typography variant="h5" sx={{ color: passed ? P.green.border : P.orange.border, mt: 2 }}>Phase 4 Step 4 - Remedial B2</Typography>

            {/* Score breakdown */}
            <Box sx={{ bgcolor: 'rgba(255,255,255,0.5)', borderRadius: '12px', p: 3, my: 3 }}>
              <Stack spacing={1.5}>
                {TASKS.map((t, i) => (
                  <Box key={t.key}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                      <Typography variant="body1" fontWeight="bold" sx={{ color: passed ? P.green.shadow : P.orange.shadow }}>{t.label}:</Typography>
                      <Typography variant="body1" fontWeight="bold" sx={{ color: passed ? P.green.shadow : P.orange.shadow }}>{scores[i]} / {t.max}</Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={(scores[i] / t.max) * 100} sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(0,0,0,0.1)', '& .MuiLinearProgress-bar': { bgcolor: passed ? P.green.border : P.orange.border } }} />
                  </Box>
                ))}
              </Stack>
            </Box>

            {/* Total */}
            <Box sx={{ bgcolor: 'rgba(255,255,255,0.3)', borderRadius: '12px', p: 3, mb: 3 }}>
              <Typography variant="h4" fontWeight="bold" sx={{ color: passed ? P.green.shadow : P.orange.shadow }}>Total Score</Typography>
              <Typography variant="h2" fontWeight="bold" sx={{ color: passed ? P.green.shadow : P.orange.shadow }}>{total} / 24</Typography>
              <Typography variant="h5" sx={{ color: passed ? P.green.border : P.orange.border }}>({percentage}%)</Typography>
              <Typography variant="body1" sx={{ mt: 1, color: passed ? P.green.shadow : P.orange.shadow }}>Pass Threshold: 20 / 24</Typography>
            </Box>

            <Typography variant="h6" sx={{ color: passed ? P.green.shadow : P.orange.shadow }}>
              {passed ? '✅ You have passed Remedial B2!' : '❌ Score below passing threshold'}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, color: passed ? P.green.shadow : P.orange.shadow }}>
              {passed ? 'Excellent work! Advanced language skills demonstrated.' : 'Review the feedback and try again!'}
            </Typography>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ color: passed ? P.green.shadow : P.orange.shadow }}>
                Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...
              </Typography>
              <LinearProgress variant="determinate" value={(countdown / 10) * 100} sx={{ mt: 1, height: 8, borderRadius: 4, bgcolor: 'rgba(0,0,0,0.1)', '& .MuiLinearProgress-bar': { bgcolor: passed ? P.green.border : P.orange.border } }} />
            </Box>
          </Box>

          {/* Performance analysis */}
          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>Performance Analysis</Typography>
            <Stack spacing={2}>
              {[
                { label: 'Task A - Debate Simulation', score: taskAScore, max: 6, tips: ['Excellent argumentation and vocabulary', 'Good effort, but needs more nuanced reasoning', 'Practice writing longer, more detailed responses with video references'] },
                { label: 'Task B - Critique Game', score: taskBScore, max: 6, tips: ['Excellent balanced critiques', 'Good, but remember both strengths AND weaknesses', 'Practice balanced critiques with connecting words'] },
                { label: 'Task C - Debate Grammar Game', score: taskCScore, max: 6, tips: ['Excellent grammar mastery', 'Good, review subjunctives and modals', 'Study subjunctives and modals'] },
                { label: 'Task D - Error Correction Game', score: taskDScore, max: 6, tips: ['Excellent error detection', 'Good, pay attention to subject-verb agreement', 'Practice identifying grammar errors'] },
              ].map((item, i) => (
                <Box key={i}>
                  <Typography variant="subtitle2" sx={{ color: P.blue.border }}>{item.label} ({item.score}/{item.max})</Typography>
                  <Typography variant="body2" sx={{ color: P.blue.shadow }}>
                    {item.score >= item.max - 1 ? `✅ ${item.tips[0]}` : item.score >= Math.floor(item.max / 2) ? `⚠️ ${item.tips[1]}` : `❌ ${item.tips[2]}`}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
