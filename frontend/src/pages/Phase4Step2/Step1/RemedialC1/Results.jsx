import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import HomeIcon from '@mui/icons-material/Home'
import RefreshIcon from '@mui/icons-material/Refresh'

/**
 * Phase 4.2 Step 1 - Level C1 Remedial Results
 * Shows combined results from Tasks A through H (8 tasks)
 * Pass threshold: 8/10 average
 */

const PASS_THRESHOLD = 8

const TASKS = [
  { key: 'taskA', label: 'Task A: Debate Simulation' },
  { key: 'taskB', label: 'Task B: Analytical Writing' },
  { key: 'taskC', label: 'Task C: Advanced Quiz' },
  { key: 'taskD', label: 'Task D: Critique Game' },
  { key: 'taskE', label: 'Task E: Mixed Tenses' },
  { key: 'taskF', label: 'Task F: Advanced Grammar' },
  { key: 'taskG', label: 'Task G: Debate Grammar' },
  { key: 'taskH', label: 'Task H: Error Correction' },
]

export default function Phase4_2RemedialC1Results() {
  const navigate = useNavigate()
  const [results, setResults] = useState({ taskA: 0, taskB: 0, taskC: 0, taskD: 0, taskE: 0, taskF: 0, taskG: 0, taskH: 0, average: 0, passed: false })
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
    const taskAScore = parseFloat(sessionStorage.getItem('phase4_2_remedial_c1_taskA_score') || '0')
    const taskBScore = parseFloat(sessionStorage.getItem('phase4_2_remedial_c1_taskB_score') || '0')
    const taskCScore = parseFloat(sessionStorage.getItem('phase4_2_remedial_c1_taskC_score') || '0')
    const taskDScore = parseFloat(sessionStorage.getItem('phase4_2_remedial_c1_taskD_score') || '0')
    const taskEScore = parseFloat(sessionStorage.getItem('phase4_2_remedial_c1_taskE_score') || '0')
    const taskFScore = parseFloat(sessionStorage.getItem('phase4_2_remedial_c1_taskF_score') || '0')
    const taskGScore = parseFloat(sessionStorage.getItem('phase4_2_remedial_c1_taskG_score') || '0')
    const taskHScore = parseFloat(sessionStorage.getItem('phase4_2_remedial_c1_taskH_score') || '0')
    // Normalize Task A (out of 4) to /10
    const normalizedTaskA = (taskAScore / 4) * 10
    const totalScore = normalizedTaskA + taskBScore + taskCScore + taskDScore + taskEScore + taskFScore + taskGScore + taskHScore
    const averageScore = totalScore / 8
    const passed = averageScore >= PASS_THRESHOLD
    setResults({ taskA: normalizedTaskA, taskB: taskBScore, taskC: taskCScore, taskD: taskDScore, taskE: taskEScore, taskF: taskFScore, taskG: taskGScore, taskH: taskHScore, average: averageScore, passed })
    logRemedialCompletion(averageScore, passed)
  }, [])

  const logRemedialCompletion = async (score, passed) => {
    try {
      await fetch('/api/phase4/remedial/complete', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 1, level: 'C1', final_score: score, max_score: 10, passed })
      })
    } catch (error) { console.error('Failed to log remedial completion:', error) }
  }

  const handleContinue = () => {
    const keys = ['taskA','taskB','taskC','taskD','taskE','taskF','taskG','taskH'].map(t => `phase4_2_remedial_c1_${t}_score`)
    keys.forEach(k => sessionStorage.removeItem(k))
    navigate(results.passed ? '/dashboard' : '/phase4_2/step/1/remedial/c1/taskA')
  }

  const R = results.passed ? P.green : P.red

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          <Box sx={{ bgcolor: R.bg, border: `2px solid ${R.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${R.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ color: R.shadow }}>Phase 4.2 Step 1 - Level C1 Remedial</Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ color: R.shadow }}>Final Results</Typography>
          </Box>

          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage character="EMNA" message={results.passed
              ? "Outstanding! You've mastered C1-level social media promotion language with sophisticated grammar, advanced vocabulary, and analytical thinking. You're ready to proceed!"
              : "You've made good progress, but C1 requires excellence in all areas. Review the advanced grammar, terminology, and analytical skills, then try again. You can achieve mastery!"} />
          </Box>

          <Box sx={{ bgcolor: R.bg, border: `2px solid ${R.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${R.shadow}`, p: 5, mb: 3, textAlign: 'center' }}>
            {results.passed ? <CheckCircleIcon sx={{ fontSize: 90, color: R.shadow, mb: 2 }} /> : <ErrorIcon sx={{ fontSize: 90, color: R.shadow, mb: 2 }} />}
            <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ color: R.shadow }}>
              {results.passed ? 'You Passed C1!' : 'Not Yet...'}
            </Typography>
            <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'white', borderRadius: '20px', p: 4, maxWidth: 350, mx: 'auto', my: 3 }}>
              <Typography variant="h2" fontWeight="bold" sx={{ color: R.shadow }}>{results.average.toFixed(1)} / 10</Typography>
              <Typography variant="h6" sx={{ color: R.shadow }}>Average Score Across 8 Tasks</Typography>
              <Typography variant="caption" sx={{ color: R.shadow, display: 'block', mt: 0.5 }}>Pass Threshold: {PASS_THRESHOLD}/10</Typography>
            </Box>
            <Box sx={{ height: 12, borderRadius: '6px', bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', overflow: 'hidden', mb: 2 }}>
              <Box sx={{ height: '100%', width: `${(results.average / 10) * 100}%`, bgcolor: R.border, borderRadius: '6px', transition: 'width 0.5s' }} />
            </Box>
            <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.6)', borderRadius: '12px', p: 2, maxWidth: 500, mx: 'auto' }}>
              <Typography variant="body1" sx={{ color: R.shadow }}>
                {results.passed
                  ? `You scored ${results.average.toFixed(1)}/10, which is above the required ${PASS_THRESHOLD}/10 to proceed!`
                  : `You scored ${results.average.toFixed(1)}/10. You need at least ${PASS_THRESHOLD}/10 to proceed. Please try again!`}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: P.blue.shadow }}>Task Breakdown</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
              {TASKS.map(task => {
                const taskScore = results[task.key]
                const taskPassed = taskScore >= PASS_THRESHOLD
                return (
                  <Box key={task.key} sx={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    bgcolor: isDark ? 'rgba(255,255,255,0.05)' : (taskPassed ? P.green.bg : P.yellow.bg),
                    border: `1px solid ${taskPassed ? P.green.border : P.yellow.border}`,
                    borderRadius: '12px', p: 2
                  }}>
                    <Typography variant="body1" sx={{ color: taskPassed ? P.green.shadow : P.yellow.shadow }}>{task.label}</Typography>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: taskPassed ? P.green.shadow : P.yellow.shadow }}>{taskScore.toFixed(1)} / 10</Typography>
                  </Box>
                )
              })}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: P.blue.shadow, borderRadius: '12px', p: 2, mt: 1 }}>
                <Typography variant="h6" sx={{ color: 'white' }} fontWeight="bold">Average Score</Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>{results.average.toFixed(1)} / 10</Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Box component="button" onClick={handleContinue} sx={{
              bgcolor: R.bg, border: `2px solid ${R.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${R.shadow}`,
              px: 6, py: 2, fontWeight: 700, fontSize: '1rem', cursor: 'pointer', color: R.shadow,
              display: 'inline-flex', alignItems: 'center', gap: 1,
              '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${R.shadow}` }
            }}>
              {results.passed ? <><HomeIcon /> Return to Dashboard</> : <><RefreshIcon /> Try Again</>}
            </Box>
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
