import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container, LinearProgress, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import HomeIcon from '@mui/icons-material/Home'
import RefreshIcon from '@mui/icons-material/Refresh'

/**
 * Phase 4.2 Step 3 - Level C1 Remedial Results
 * Shows combined results from Tasks A through H (8 tasks)
 * Total: 50 points, Pass threshold: 40/50
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

const PASS_THRESHOLD = 40

export default function Phase4_2Step3RemedialC1Results() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const P = isDark ? DARK : LIGHT
  const [results, setResults] = useState({
    taskA: 0, taskB: 0, taskC: 0, taskD: 0,
    taskE: 0, taskF: 0, taskG: 0, taskH: 0,
    total: 0, passed: false
  })

  useEffect(() => {
    const taskAScore = parseInt(sessionStorage.getItem('phase4_2_step3_c1_taskA_score') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('phase4_2_step3_c1_taskB_score') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('phase4_2_step3_c1_taskC_score') || '0')
    const taskDScore = parseInt(sessionStorage.getItem('phase4_2_step3_c1_taskD_score') || '0')
    const taskEScore = parseInt(sessionStorage.getItem('phase4_2_step3_c1_taskE_score') || '0')
    const taskFScore = parseInt(sessionStorage.getItem('phase4_2_step3_c1_taskF_score') || '0')
    const taskGScore = parseInt(sessionStorage.getItem('phase4_2_step3_c1_taskG_score') || '0')
    const taskHScore = parseInt(sessionStorage.getItem('phase4_2_step3_c1_taskH_score') || '0')

    const totalScore = taskAScore + taskBScore + taskCScore + taskDScore + taskEScore + taskFScore + taskGScore + taskHScore
    const passed = totalScore >= PASS_THRESHOLD

    setResults({ taskA: taskAScore, taskB: taskBScore, taskC: taskCScore, taskD: taskDScore, taskE: taskEScore, taskF: taskFScore, taskG: taskGScore, taskH: taskHScore, total: totalScore, passed })
    logRemedialCompletion(totalScore, passed)
  }, [])

  const logRemedialCompletion = async (score, passed) => {
    try {
      await fetch('/api/phase4/remedial/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 3, level: 'C1', final_score: score, max_score: 50, passed: passed })
      })
    } catch (error) {
      console.error('Failed to log remedial completion:', error)
    }
  }

  const handleContinue = () => {
    const keys = ['phase4_2_step3_c1_taskA_score','phase4_2_step3_c1_taskB_score','phase4_2_step3_c1_taskC_score','phase4_2_step3_c1_taskD_score','phase4_2_step3_c1_taskE_score','phase4_2_step3_c1_taskF_score','phase4_2_step3_c1_taskG_score','phase4_2_step3_c1_taskH_score']
    keys.forEach(k => sessionStorage.removeItem(k))
    if (results.passed) {
      navigate('/dashboard')
    } else {
      navigate('/phase4_2/step/3/remedial/c1/taskA')
    }
  }

  const clayCard = (color) => ({
    bgcolor: P[color].bg,
    border: `2px solid ${P[color].border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${P[color].shadow}`,
    p: 3,
  })

  const progressPercent = (results.total / 50) * 100
  const resultColor = results.passed ? 'green' : 'red'

  const TASK_DATA = [
    { label: 'Task A: Debate Dominion', score: results.taskA, max: 6 },
    { label: 'Task B: Analysis Odyssey', score: results.taskB, max: 8 },
    { label: 'Task C: Quizlet Live', score: results.taskC, max: 6 },
    { label: 'Task D: Critique Kahoot', score: results.taskD, max: 6 },
    { label: 'Task E: Tense Odyssey', score: results.taskE, max: 6 },
    { label: 'Task F: Clause Conquest', score: results.taskF, max: 6 },
    { label: 'Task G: Debate Duel Advanced', score: results.taskG, max: 6 },
    { label: 'Task H: Correction Crusade', score: results.taskH, max: 6 },
  ]

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>

          {/* Header */}
          <Box sx={{ ...clayCard('orange'), mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: P.orange.border }}>Phase 4.2 · Step 3 · Level C1 Remedial</Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#fff' : '#1a252f', mt: 0.5 }}>Final Results</Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{ ...clayCard('teal'), mb: 3 }}>
            <CharacterMessage
              character="EMNA"
              message={
                results.passed
                  ? "Outstanding! You've mastered C1-level social media language with sophisticated grammar, advanced vocabulary, and analytical thinking. You're ready to proceed!"
                  : "You've made good progress, but C1 requires excellence in all areas. Review the advanced grammar, terminology, and analytical skills, then try again. You can achieve mastery!"
              }
            />
          </Box>

          {/* Overall Result */}
          <Box sx={{ ...clayCard(resultColor), mb: 3, textAlign: 'center' }}>
            {results.passed
              ? <CheckCircleIcon sx={{ fontSize: 80, color: P.green.border, mb: 1 }} />
              : <ErrorIcon sx={{ fontSize: 80, color: P.red.border, mb: 1 }} />}
            <Typography variant="h4" fontWeight="bold" sx={{ color: P[resultColor].border, mb: 1 }}>
              {results.passed ? 'You Passed C1!' : 'Not Yet...'}
            </Typography>
            <Typography variant="h2" fontWeight="bold" sx={{ color: P[resultColor].border }}>
              {results.total}/50
            </Typography>
            <Typography variant="h6" sx={{ color: isDark ? '#ccc' : '#555', mt: 0.5 }}>
              Total Score Across 8 Tasks
            </Typography>

            <LinearProgress
              variant="determinate"
              value={progressPercent}
              sx={{ height: 12, borderRadius: 6, my: 2, bgcolor: isDark ? '#333' : '#e0e0e0', '& .MuiLinearProgress-bar': { bgcolor: P[resultColor].border, borderRadius: 6 } }}
            />

            <Box sx={{ ...clayCard(results.passed ? 'green' : 'yellow'), mt: 2, textAlign: 'left' }}>
              <Typography sx={{ color: P[results.passed ? 'green' : 'yellow'].border }}>
                {results.passed
                  ? <>You scored <strong>{results.total}/50</strong>, which is above the required <strong>{PASS_THRESHOLD}/50</strong> to proceed!</>
                  : <>You scored <strong>{results.total}/50</strong>. You need at least <strong>{PASS_THRESHOLD}/50</strong> to proceed. Please try again!</>
                }
              </Typography>
            </Box>
          </Box>

          {/* Task Breakdown */}
          <Typography variant="h6" fontWeight="bold" sx={{ color: P.blue.border, mb: 2 }}>Task Breakdown:</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 4 }}>
            {TASK_DATA.map((task, i) => (
              <Box key={i} sx={{ ...clayCard('blue'), textAlign: 'center', p: 2 }}>
                <Typography variant="subtitle2" sx={{ color: isDark ? '#ccc' : '#555', mb: 0.5 }}>{task.label}</Typography>
                <Typography variant="h5" fontWeight="bold" sx={{ color: P.blue.border }}>
                  {task.score}/{task.max}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Action Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              component="button"
              onClick={handleContinue}
              sx={{
                ...clayCard(results.passed ? 'green' : 'yellow'),
                cursor: 'pointer',
                px: 8, py: 2,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                color: P[results.passed ? 'green' : 'yellow'].border,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P[results.passed ? 'green' : 'yellow'].shadow}` },
                transition: 'all 0.15s ease',
              }}
            >
              {results.passed ? <><HomeIcon />Return to Dashboard</> : <><RefreshIcon />Try Again</>}
            </Box>
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
