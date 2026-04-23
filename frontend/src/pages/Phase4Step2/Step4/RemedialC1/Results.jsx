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
import { requestPhase42FinalScore } from '../../shared/routing.js'

/**
 * Phase 4.2 Step 4 - Level C1 Remedial Results
 * Shows combined results from Tasks A through H (8 tasks)
 * Total: 48 points (4+8+6+6+6+6+6+6), Pass threshold: 38/48
 */

const PASS_THRESHOLD = 38

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

const TASK_BREAKDOWN = [
  { key: 'taskA', label: 'Task A: Debate Simulation', max: 4 },
  { key: 'taskB', label: 'Task B: Analysis Writing', max: 8 },
  { key: 'taskC', label: 'Task C: Advanced Quiz', max: 6 },
  { key: 'taskD', label: 'Task D: Critique Game', max: 6 },
  { key: 'taskE', label: 'Task E: Mixed Tenses', max: 6 },
  { key: 'taskF', label: 'Task F: Complex Sentences', max: 6 },
  { key: 'taskG', label: 'Task G: Subjunctives/Modals', max: 6 },
  { key: 'taskH', label: 'Task H: Error Correction', max: 6 },
]

export default function Phase4_2Step4RemedialC1Results() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT

  const [results, setResults] = useState({
    taskA: 0, taskB: 0, taskC: 0, taskD: 0,
    taskE: 0, taskF: 0, taskG: 0, taskH: 0,
    total: 0, passed: false
  })

  useEffect(() => {
    const taskAScore = parseInt(sessionStorage.getItem('phase4_2_step4_c1_taskA_score') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('phase4_2_step4_c1_taskB_score') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('phase4_2_step4_c1_taskC_score') || '0')
    const taskDScore = parseInt(sessionStorage.getItem('phase4_2_step4_c1_taskD_score') || '0')
    const taskEScore = parseInt(sessionStorage.getItem('phase4_2_step4_c1_taskE_score') || '0')
    const taskFScore = parseInt(sessionStorage.getItem('phase4_2_step4_c1_taskF_score') || '0')
    const taskGScore = parseInt(sessionStorage.getItem('phase4_2_step4_c1_taskG_score') || '0')
    const taskHScore = parseInt(sessionStorage.getItem('phase4_2_step4_c1_taskH_score') || '0')

    const totalScore = taskAScore + taskBScore + taskCScore + taskDScore + taskEScore + taskFScore + taskGScore + taskHScore
    const passed = totalScore >= PASS_THRESHOLD

    setResults({ taskA: taskAScore, taskB: taskBScore, taskC: taskCScore, taskD: taskDScore, taskE: taskEScore, taskF: taskFScore, taskG: taskGScore, taskH: taskHScore, total: totalScore, passed })
    logRemedialCompletion(totalScore, passed)
  }, [])

  const logRemedialCompletion = async (score) => {
    try {
      const data = await requestPhase42FinalScore(4, 'c1', { total_score: score })
      if (data.passed) sessionStorage.setItem('phase4_2_redirect_url', data.next_url)
      else sessionStorage.removeItem('phase4_2_redirect_url')
    } catch (error) {
      console.error('Failed to log remedial completion:', error)
    }
  }

  const handleContinue = () => {
    const keys = ['phase4_2_step4_c1_taskA_score', 'phase4_2_step4_c1_taskB_score', 'phase4_2_step4_c1_taskC_score', 'phase4_2_step4_c1_taskD_score', 'phase4_2_step4_c1_taskE_score', 'phase4_2_step4_c1_taskF_score', 'phase4_2_step4_c1_taskG_score', 'phase4_2_step4_c1_taskH_score']
    keys.forEach(k => sessionStorage.removeItem(k))
    if (results.passed) navigate('/dashboard')
    else navigate('/phase4_2/step/4/remedial/c1/taskA')
  }

  const progressPercent = (results.total / 48) * 100

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: results.passed ? P.green.bg : P.orange.bg,
            border: `2px solid ${results.passed ? P.green.border : P.orange.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${results.passed ? P.green.shadow : P.orange.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: results.passed ? P.green.shadow : P.orange.shadow }}>
              Phase 4.2 Step 4 - Level C1 Remedial
            </Typography>
            <Typography variant="h6" sx={{ color: results.passed ? P.green.shadow : P.orange.shadow }}>
              Final Results
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <CharacterMessage
              character="EMNA"
              message={results.passed
                ? "Outstanding! You've mastered C1-level social media language with sophisticated grammar, advanced vocabulary, and analytical thinking. You're ready to proceed!"
                : "You've made good progress, but C1 requires excellence in all areas. Review the advanced grammar, terminology, and analytical skills, then try again. You can achieve mastery!"}
            />
          </Box>

          {/* Overall Result */}
          <Box sx={{
            bgcolor: results.passed ? P.green.bg : P.red.bg,
            border: `2px solid ${results.passed ? P.green.border : P.red.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${results.passed ? P.green.shadow : P.red.shadow}`,
            p: 4, mb: 3, textAlign: 'center',
          }}>
            {results.passed
              ? <CheckCircleIcon sx={{ fontSize: 72, color: P.green.border, mb: 1 }} />
              : <ErrorIcon sx={{ fontSize: 72, color: P.red.border, mb: 1 }} />
            }
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: results.passed ? P.green.shadow : P.red.shadow, mb: 1 }}>
              {results.passed ? 'You Passed C1!' : 'Not Yet...'}
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 'bold', color: results.passed ? P.green.shadow : P.red.shadow }}>
              {results.total}/48
            </Typography>
            <Typography variant="body1" sx={{ color: results.passed ? P.green.shadow : P.red.shadow, mt: 1 }}>
              Total Score Across 8 Tasks
            </Typography>

            {/* Progress bar */}
            <Box sx={{
              bgcolor: results.passed ? P.green.border : P.red.bg,
              border: `2px solid ${results.passed ? P.green.border : P.red.border}`,
              borderRadius: '999px', height: 12, mt: 2, overflow: 'hidden',
            }}>
              <Box sx={{
                bgcolor: results.passed ? P.green.shadow : P.red.border, height: '100%', borderRadius: '999px',
                width: `${progressPercent}%`, transition: 'width 0.5s',
              }} />
            </Box>

            <Typography variant="body2" sx={{ mt: 2, color: results.passed ? P.green.shadow : P.red.shadow }}>
              {results.passed
                ? `You scored ${results.total}/48, above the required ${PASS_THRESHOLD}/48 to proceed!`
                : `You scored ${results.total}/48. You need at least ${PASS_THRESHOLD}/48 to proceed. Please try again!`}
            </Typography>
          </Box>

          {/* Task Breakdown */}
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: P.blue.shadow, mb: 2 }}>Task Breakdown:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {TASK_BREAKDOWN.map(({ key, label, max }) => (
                <Box key={key} sx={{
                  flex: '1 1 200px',
                  bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
                  borderRadius: '12px', boxShadow: `3px 3px 0 ${P.yellow.shadow}`,
                  p: 2, textAlign: 'center',
                }}>
                  <Typography variant="body2" sx={{ color: P.yellow.shadow, fontWeight: 600, mb: 0.5 }}>
                    {label}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: P.blue.shadow }}>
                    {results[key]}/{max}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Action Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Box component="button" onClick={handleContinue} sx={{
              bgcolor: results.passed ? P.green.bg : P.orange.bg,
              border: `2px solid ${results.passed ? P.green.border : P.orange.border}`,
              borderRadius: '12px', boxShadow: `3px 3px 0 ${results.passed ? P.green.shadow : P.orange.shadow}`,
              px: 6, py: 1.5, fontWeight: 700, fontSize: '1rem',
              cursor: 'pointer', color: results.passed ? P.green.shadow : P.orange.shadow,
              display: 'flex', alignItems: 'center', gap: 1,
              '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${results.passed ? P.green.shadow : P.orange.shadow}` },
              '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${results.passed ? P.green.shadow : P.orange.shadow}` },
            }}>
              {results.passed ? <HomeIcon fontSize="small" /> : <RefreshIcon fontSize="small" />}
              {results.passed ? 'Return to Dashboard' : 'Try Again'}
            </Box>
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
