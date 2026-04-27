import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, LinearProgress, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import HomeIcon from '@mui/icons-material/Home'
import RefreshIcon from '@mui/icons-material/Refresh'
import { requestPhase42FinalScore } from '../../shared/routing.js'

/**
 * Phase 4.2 Step 2 - Level C1 Remedial Results
 * Shows combined results from Tasks A through H (8 tasks)
 * Pass threshold: 8/10 average
 */

const PASS_THRESHOLD = 8

export default function Phase4_2Step2RemedialC1Results() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
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
  const P = isDark ? DARK : LIGHT

  const [results, setResults] = useState({ taskA: 0, taskB: 0, taskC: 0, taskD: 0, taskE: 0, taskF: 0, taskG: 0, taskH: 0, average: 0, passed: false })

  useEffect(() => {
    const taskAScore = parseFloat(sessionStorage.getItem('phase4_2_step2_remedial_c1_taskA_score') || '0')
    const taskBScore = parseFloat(sessionStorage.getItem('phase4_2_step2_remedial_c1_taskB_score') || '0')
    const taskCScore = parseFloat(sessionStorage.getItem('phase4_2_step2_remedial_c1_taskC_score') || '0')
    const taskDScore = parseFloat(sessionStorage.getItem('phase4_2_step2_remedial_c1_taskD_score') || '0')
    const taskEScore = parseFloat(sessionStorage.getItem('phase4_2_step2_remedial_c1_taskE_score') || '0')
    const taskFScore = parseFloat(sessionStorage.getItem('phase4_2_step2_remedial_c1_taskF_score') || '0')
    const taskGScore = parseFloat(sessionStorage.getItem('phase4_2_step2_remedial_c1_taskG_score') || '0')
    const taskHScore = parseFloat(sessionStorage.getItem('phase4_2_step2_remedial_c1_taskH_score') || '0')

    const normalizedTaskA = (taskAScore / 6) * 10
    const totalScore = normalizedTaskA + taskBScore + taskCScore + taskDScore + taskEScore + taskFScore + taskGScore + taskHScore
    const averageScore = totalScore / 8
    const passed = averageScore >= PASS_THRESHOLD

    setResults({ taskA: normalizedTaskA, taskB: taskBScore, taskC: taskCScore, taskD: taskDScore, taskE: taskEScore, taskF: taskFScore, taskG: taskGScore, taskH: taskHScore, average: averageScore, passed })
    logRemedialCompletion(averageScore, passed)
  }, [])

  const logRemedialCompletion = async (score) => {
    try {
      const data = await requestPhase42FinalScore(2, 'c1', { total_score: score })
      if (data.passed) sessionStorage.setItem('phase4_2_redirect_url', data.next_url)
      else sessionStorage.removeItem('phase4_2_redirect_url')
    } catch (error) { console.error('Failed to log remedial completion:', error) }
  }

  const clearScores = () => {
    ['taskA', 'taskB', 'taskC', 'taskD', 'taskE', 'taskF', 'taskG', 'taskH'].forEach(t =>
      sessionStorage.removeItem(`phase4_2_step2_remedial_c1_${t}_score`)
    )
  }

  const handleContinue = () => {
    clearScores()
    navigate(results.passed ? '/phase4_2/step/3' : '/phase4_2/step/2/remedial/c1/taskA')
  }

  const progressPercent = (results.average / 10) * 100

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

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: results.passed ? P.green.bg : P.red.bg,
            border: `2px solid ${results.passed ? P.green.border : P.red.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${results.passed ? P.green.shadow : P.red.shadow}`,
            p: 3, mb: 3
          }}>
            <Typography variant="h5" gutterBottom sx={{ color: results.passed ? P.green.shadow : P.red.shadow }}>
              Phase 4.2 Step 2 - Level C1 Remedial
            </Typography>
            <Typography variant="h6" sx={{ color: results.passed ? P.green.shadow : P.red.shadow }}>
              Final Results
            </Typography>
          </Box>

          {/* Instructor */}
          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage
              character="EMNA"
              message={results.passed
                ? "Outstanding! You've mastered C1-level Instagram post language with sophisticated grammar, advanced vocabulary, and analytical thinking. You're ready to proceed!"
                : "You've made good progress, but C1 requires excellence in all areas. Review the advanced grammar, terminology, and analytical skills, then try again. You can achieve mastery!"}
            />
          </Box>

          {/* Overall Result */}
          <Box sx={{
            bgcolor: results.passed ? P.green.bg : P.red.bg,
            border: `2px solid ${results.passed ? P.green.border : P.red.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${results.passed ? P.green.shadow : P.red.shadow}`,
            p: 4, mb: 3, textAlign: 'center'
          }}>
            {results.passed
              ? <CheckCircleIcon sx={{ fontSize: 80, color: P.green.shadow, mb: 2 }} />
              : <ErrorIcon sx={{ fontSize: 80, color: P.red.shadow, mb: 2 }} />
            }
            <Typography variant="h4" gutterBottom fontWeight={700} sx={{ color: results.passed ? P.green.shadow : P.red.shadow }}>
              {results.passed ? '🎉 You Passed C1!' : '❌ Not Yet...'}
            </Typography>
            <Typography variant="h2" fontWeight={800} sx={{ color: results.passed ? P.green.shadow : P.red.shadow }}>
              {results.average.toFixed(1)}/10
            </Typography>
            <Typography variant="h6" sx={{ color: isDark ? '#aaa' : '#666', mt: 1, mb: 3 }}>
              Average Score Across 8 Tasks
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progressPercent}
              sx={{
                height: 14, borderRadius: 7, mb: 2,
                bgcolor: isDark ? '#333' : '#e0e0e0',
                '& .MuiLinearProgress-bar': { bgcolor: results.passed ? P.green.shadow : P.red.shadow }
              }}
            />
            <Box sx={{
              bgcolor: results.passed ? P.green.bg : P.yellow.bg,
              border: `1px solid ${results.passed ? P.green.border : P.yellow.border}`,
              borderRadius: '12px', p: 2, mt: 2
            }}>
              <Typography sx={{ color: results.passed ? P.green.shadow : P.yellow.shadow }}>
                {results.passed
                  ? <>You scored <strong>{results.average.toFixed(1)}/10</strong>, which is above the required <strong>{PASS_THRESHOLD}/10</strong> to proceed!</>
                  : <>You scored <strong>{results.average.toFixed(1)}/10</strong>. You need at least <strong>{PASS_THRESHOLD}/10</strong> to proceed. Please try again!</>
                }
              </Typography>
            </Box>
          </Box>

          {/* Task Breakdown */}
          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `3px 3px 0 ${P.blue.shadow}`, p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom fontWeight={700} sx={{ color: P.blue.shadow, mb: 2 }}>Task Breakdown:</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 2 }}>
              {TASKS.map(({ key, label }) => (
                <Box key={key} sx={{
                  bgcolor: isDark ? '#1a1a2e' : 'white',
                  border: `2px solid ${P.blue.border}`,
                  borderRadius: '14px',
                  boxShadow: `2px 2px 0 ${P.blue.shadow}`,
                  p: 2, textAlign: 'center'
                }}>
                  <Typography variant="body2" fontWeight={600} gutterBottom sx={{ color: isDark ? '#ccc' : '#2c3e50' }}>{label}</Typography>
                  <Typography variant="h5" fontWeight={700} sx={{ color: P.blue.shadow }}>{results[key].toFixed(1)}/10</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Action Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box component="button" onClick={handleContinue} sx={{
              bgcolor: results.passed ? P.green.bg : P.orange.bg,
              border: `2px solid ${results.passed ? P.green.border : P.orange.border}`,
              borderRadius: '14px',
              boxShadow: `4px 4px 0 ${results.passed ? P.green.shadow : P.orange.shadow}`,
              px: 6, py: 2, fontWeight: 700, fontSize: '1.2rem', cursor: 'pointer',
              color: results.passed ? P.green.shadow : P.orange.shadow,
              display: 'inline-flex', alignItems: 'center', gap: 1,
              transition: 'transform 0.15s, box-shadow 0.15s',
              '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${results.passed ? P.green.shadow : P.orange.shadow}` },
            }}>
              {results.passed ? <><HomeIcon /> Return to Dashboard</> : <><RefreshIcon /> Try Again</>}
            </Box>
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
