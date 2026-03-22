import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container, useTheme, LinearProgress } from '@mui/material'
import { motion } from 'framer-motion'

/**
 * Phase 4 Step 4 - Remedial C1 - Results Page
 * Total: 26 points (8+6+6+6)
 * Pass threshold: 21/26 (80%)
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
  { key: 'A', label: 'Task A - Analysis Odyssey', max: 8 },
  { key: 'B', label: 'Task B - Quizlet Live', max: 6 },
  { key: 'C', label: 'Task C - Tense Odyssey', max: 6 },
  { key: 'D', label: 'Task D - Clause Conquest', max: 6 },
]

export default function RemedialC1Results() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const [taskAScore, setTaskAScore] = useState(0)
  const [taskBScore, setTaskBScore] = useState(0)
  const [taskCScore, setTaskCScore] = useState(0)
  const [taskDScore, setTaskDScore] = useState(0)
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    const scoreA = parseInt(sessionStorage.getItem('remedial_step4_c1_taskA_score') || '0')
    const scoreB = parseInt(sessionStorage.getItem('remedial_step4_c1_taskB_score') || '0')
    const scoreC = parseInt(sessionStorage.getItem('remedial_step4_c1_taskC_score') || '0')
    const scoreD = parseInt(sessionStorage.getItem('remedial_step4_c1_taskD_score') || '0')
    setTaskAScore(scoreA); setTaskBScore(scoreB); setTaskCScore(scoreC); setTaskDScore(scoreD)

    const total = scoreA + scoreB + scoreC + scoreD
    const passed = total >= 21

    console.log('\n' + '='.repeat(60))
    console.log('PHASE 4 STEP 4 - REMEDIAL C1 - FINAL RESULTS')
    console.log('Total:', total, '/26 — Passed:', passed)
    console.log('='.repeat(60) + '\n')

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          sessionStorage.removeItem('remedial_step4_c1_taskA_score')
          sessionStorage.removeItem('remedial_step4_c1_taskB_score')
          sessionStorage.removeItem('remedial_step4_c1_taskC_score')
          sessionStorage.removeItem('remedial_step4_c1_taskD_score')
          navigate(passed ? '/dashboard' : '/phase4/step/4/remedial/c1/taskA')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [navigate])

  const total = taskAScore + taskBScore + taskCScore + taskDScore
  const passed = total >= 21
  const percentage = Math.round((total / 26) * 100)
  const scores = [taskAScore, taskBScore, taskCScore, taskDScore]

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>

          <Box sx={{ bgcolor: passed ? P.green.bg : P.orange.bg, border: `2px solid ${passed ? P.green.border : P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${passed ? P.green.shadow : P.orange.shadow}`, p: 5, textAlign: 'center', mb: 3 }}>
            <Typography variant="h3" fontWeight="bold" sx={{ color: passed ? P.green.shadow : P.orange.shadow }}>
              {passed ? '🎉 Outstanding! 🎉' : '💪 Keep Striving! 💪'}
            </Typography>
            <Typography variant="h5" sx={{ color: passed ? P.green.border : P.orange.border, mt: 2 }}>Phase 4 Step 4 - Remedial C1</Typography>

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

            <Box sx={{ bgcolor: 'rgba(255,255,255,0.3)', borderRadius: '12px', p: 3, mb: 3 }}>
              <Typography variant="h4" fontWeight="bold" sx={{ color: passed ? P.green.shadow : P.orange.shadow }}>Total Score</Typography>
              <Typography variant="h2" fontWeight="bold" sx={{ color: passed ? P.green.shadow : P.orange.shadow }}>{total} / 26</Typography>
              <Typography variant="h5" sx={{ color: passed ? P.green.border : P.orange.border }}>({percentage}%)</Typography>
              <Typography variant="body1" sx={{ mt: 1, color: passed ? P.green.shadow : P.orange.shadow }}>Pass Threshold: 21 / 26 (80%)</Typography>
            </Box>

            <Typography variant="h6" sx={{ color: passed ? P.green.shadow : P.orange.shadow }}>
              {passed ? '✅ You have passed Remedial C1!' : '❌ Score below passing threshold'}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, color: passed ? P.green.shadow : P.orange.shadow }}>
              {passed ? 'Exceptional performance! Mastery of C1-level skills demonstrated.' : 'Review feedback and try again!'}
            </Typography>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ color: passed ? P.green.shadow : P.orange.shadow }}>
                Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...
              </Typography>
              <LinearProgress variant="determinate" value={(countdown / 10) * 100} sx={{ mt: 1, height: 8, borderRadius: 4, bgcolor: 'rgba(0,0,0,0.1)', '& .MuiLinearProgress-bar': { bgcolor: passed ? P.green.border : P.orange.border } }} />
            </Box>
          </Box>

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>Performance Analysis</Typography>
            <Stack spacing={2}>
              {[
                { label: 'Task A - Analysis Odyssey', score: taskAScore, max: 8, tips: ['Excellent paragraph reconstruction and analytical thinking', 'Good, but review logical progression and cohesive devices', 'Practice identifying sophisticated analytical structures'] },
                { label: 'Task B - Quizlet Live', score: taskBScore, max: 6, tips: ['Excellent detailed responses with video references', 'Good, include more specific details and sophisticated vocabulary', 'Practice writing detailed answers with advanced vocabulary'] },
                { label: 'Task C - Tense Odyssey', score: taskCScore, max: 6, tips: ['Excellent mastery of mixed tenses and conditionals', 'Good, review perfect tenses and conditional structures', 'Study present/past perfect and conditional structures'] },
                { label: 'Task D - Clause Conquest', score: taskDScore, max: 6, tips: ['Excellent command of passive voice and relative clauses', 'Good, review passive constructions and clause structures', 'Practice passive voice forms and relative clauses'] },
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
