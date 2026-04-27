import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container, useTheme, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { motion } from 'framer-motion'

/**
 * Phase 4 Step 4 - Remedial B2 - Results Page
 * Total: 46 points
 * Pass threshold: 37/46
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
  { key: 'taskA', label: 'Task A - Role-Play Saga', icon: '🎭', max: 6 },
  { key: 'taskB', label: 'Task B - Analysis Odyssey', icon: '📝', max: 8 },
  { key: 'taskC', label: 'Task C - Kahoot Match', icon: '🎮', max: 8 },
  { key: 'taskD', label: 'Task D - Spell Quest', icon: '📝', max: 12 },
  { key: 'taskE', label: 'Task E - Conditional Challenge', icon: '🎯', max: 6 },
  { key: 'taskF', label: 'Task F - Grammar Role-Quest', icon: '🎭', max: 6 },
]
const MAX_TOTAL = 46
const PASS_THRESHOLD = 37

export default function Phase4Step5RemedialB2Results() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const [loading, setLoading] = useState(true)
  const [scores, setScores] = useState({ taskA: 0, taskB: 0, taskC: 0, taskD: 0, taskE: 0, taskF: 0, total: 0, passed: false })
  const [countdown, setCountdown] = useState(10)

  useEffect(() => { calculateFinalScore() }, [])

  useEffect(() => {
    if (!loading) {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(c => c - 1), 1000)
        return () => clearTimeout(timer)
      } else { handleRedirect() }
    }
  }, [countdown, loading])

  const calculateFinalScore = async () => {
    const taskAScore = parseInt(sessionStorage.getItem('phase4_step5_remedial_b2_taskA_score') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('phase4_step5_remedial_b2_taskB_score') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('phase4_step5_remedial_b2_taskC_score') || '0')
    const taskDScore = parseInt(sessionStorage.getItem('phase4_step5_remedial_b2_taskD_score') || '0')
    const taskEScore = parseInt(sessionStorage.getItem('phase4_step5_remedial_b2_taskE_score') || '0')
    const taskFScore = parseInt(sessionStorage.getItem('phase4_step5_remedial_b2_taskF_score') || '0')
    const total = taskAScore + taskBScore + taskCScore + taskDScore + taskEScore + taskFScore
    const passed = total >= PASS_THRESHOLD

    try {
      const response = await fetch('/api/phase4/step5/remedial/b2/final-score', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ task_a_score: taskAScore, task_b_score: taskBScore, task_c_score: taskCScore, task_d_score: taskDScore, task_e_score: taskEScore, task_f_score: taskFScore })
      })
      const data = await response.json()
      if (data.success) {
        sessionStorage.setItem('phase4_step5_b2_next_url', data.data.next_url || (passed ? '/phase4_2/step/1' : '/phase4/step/4/remedial/b2/taskA'))
      }
    } catch (err) { console.error('Failed to log final score:', err) }

    setScores({ taskA: taskAScore, taskB: taskBScore, taskC: taskCScore, taskD: taskDScore, taskE: taskEScore, taskF: taskFScore, total, passed })
    setLoading(false)
  }

  const handleRedirect = () => {
    TASKS.forEach(t => sessionStorage.removeItem(`phase4_step5_remedial_b2_${t.key}_score`))
    navigate(sessionStorage.getItem('phase4_step5_b2_next_url') || (scores.passed ? '/phase4/step/4/remedial/c1/taskA' : '/phase4/step/4/remedial/b2/taskA'))
  }

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: LIGHT.pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Calculating your final score...</Typography>
          <LinearProgress sx={{ width: 300, borderRadius: 1 }} />
        </Box>
      </Box>
    )
  }

  const passed = scores.passed
  const percentage = Math.round((scores.total / MAX_TOTAL) * 100)
  const taskScoreList = [scores.taskA, scores.taskB, scores.taskC, scores.taskD, scores.taskE, scores.taskF]

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>

          <Box sx={{ bgcolor: passed ? P.green.bg : P.orange.bg, border: `2px solid ${passed ? P.green.border : P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${passed ? P.green.shadow : P.orange.shadow}`, p: 5, textAlign: 'center', mb: 3 }}>
            <Typography variant="h3" fontWeight="bold" sx={{ color: passed ? P.green.shadow : P.orange.shadow }}>
              {passed ? '🎉 Congratulations! 🎉' : '💪 Keep Practicing! 💪'}
            </Typography>
            <Typography variant="h5" sx={{ color: passed ? P.green.border : P.orange.border, mt: 2 }}>Phase 4 Step 5 - Remedial B2</Typography>

            <Box sx={{ bgcolor: 'rgba(255,255,255,0.5)', borderRadius: '12px', p: 3, my: 3 }}>
              <Stack spacing={1.5}>
                {TASKS.map((task, i) => (
                  <Box key={task.key}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                      <Typography variant="body2" fontWeight="bold" sx={{ color: passed ? P.green.shadow : P.orange.shadow }}>{task.icon} {task.label}:</Typography>
                      <Typography variant="body2" fontWeight="bold" sx={{ color: passed ? P.green.shadow : P.orange.shadow }}>{taskScoreList[i]} / {task.max}</Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={(taskScoreList[i] / task.max) * 100} sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(0,0,0,0.1)', '& .MuiLinearProgress-bar': { bgcolor: passed ? P.green.border : P.orange.border } }} />
                  </Box>
                ))}
              </Stack>
            </Box>

            <Box sx={{ bgcolor: 'rgba(255,255,255,0.3)', borderRadius: '12px', p: 3, mb: 3 }}>
              <Typography variant="h4" fontWeight="bold" sx={{ color: passed ? P.green.shadow : P.orange.shadow }}>Total Score</Typography>
              <Typography variant="h2" fontWeight="bold" sx={{ color: passed ? P.green.shadow : P.orange.shadow }}>{scores.total} / {MAX_TOTAL}</Typography>
              <Typography variant="h5" sx={{ color: passed ? P.green.border : P.orange.border }}>({percentage}%)</Typography>
              <Typography variant="body1" sx={{ mt: 1, color: passed ? P.green.shadow : P.orange.shadow }}>Pass Threshold: {PASS_THRESHOLD} / {MAX_TOTAL} (80%)</Typography>
            </Box>

            <Typography variant="h6" sx={{ color: passed ? P.green.shadow : P.orange.shadow }}>
              {passed ? '✅ You have passed Step 4 Remedial B2!' : '❌ Score below passing threshold'}
            </Typography>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ color: passed ? P.green.shadow : P.orange.shadow }}>Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...</Typography>
              <LinearProgress variant="determinate" value={(countdown / 10) * 100} sx={{ mt: 1, height: 8, borderRadius: 4, bgcolor: 'rgba(0,0,0,0.1)', '& .MuiLinearProgress-bar': { bgcolor: passed ? P.green.border : P.orange.border } }} />
            </Box>
          </Box>

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage character="LILIA" message={passed ? "Fantastic work! 🌟 You've successfully completed the B2 level remedial activities. Your mastery of essay writing, conditionals, passive voice, and advanced vocabulary is excellent. You're ready to move forward!" : "Good effort! 💪 Let's practice a bit more to strengthen your skills. Focus on conditionals, passive voice, and essay coherence. Review the content and try again!"} />
          </Box>

          <Box component="button" onClick={handleRedirect} sx={{ display: 'block', width: '100%', bgcolor: passed ? P.green.bg : P.orange.bg, border: `2px solid ${passed ? P.green.border : P.orange.border}`, borderRadius: '16px', boxShadow: `4px 4px 0 ${passed ? P.green.shadow : P.orange.shadow}`, p: 2, cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', color: passed ? P.green.shadow : P.orange.shadow, textAlign: 'center', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${passed ? P.green.shadow : P.orange.shadow}` } }}>
            {passed ? '🏆 Continue to Phase 4.2' : '🔄 Restart Now'}
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
