import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Grid,
  Container,
} from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import HomeIcon from '@mui/icons-material/Home'
import RefreshIcon from '@mui/icons-material/Refresh'

const PASS_THRESHOLD = 18
const MAX_SCORE = 22

export default function Phase4_2Step4RemedialA2Results() {
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

  const [results, setResults] = useState({ taskA: 0, taskB: 0, taskC: 0, total: 0, passed: false })

  useEffect(() => {
    const taskAScore = parseInt(sessionStorage.getItem('phase4_2_step4_a2_taskA') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('phase4_2_step4_a2_taskB') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('phase4_2_step4_a2_taskC') || '0')
    const totalScore = taskAScore + taskBScore + taskCScore
    const passed = totalScore >= PASS_THRESHOLD
    setResults({ taskA: taskAScore, taskB: taskBScore, taskC: taskCScore, total: totalScore, passed })
    logRemedialCompletion(totalScore, passed)
  }, [])

  const logRemedialCompletion = async (score, passed) => {
    try {
      await fetch('/api/phase4/4_2/interaction/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phase: '4_2', step: '4_remedial', level: 'A2', interaction_type: 'remedial_complete', details: { final_score: score, max_score: MAX_SCORE, passed } })
      })
    } catch (error) {
      console.error('Failed to log remedial completion:', error)
    }
  }

  const handleContinue = () => {
    sessionStorage.removeItem('phase4_2_step4_a2_taskA')
    sessionStorage.removeItem('phase4_2_step4_a2_taskB')
    sessionStorage.removeItem('phase4_2_step4_a2_taskC')
    if (results.passed) {
      navigate('/dashboard')
    } else {
      navigate('/phase4_2/step/4/remedial/a2/taskA')
    }
  }

  const progressPercent = (results.total / MAX_SCORE) * 100
  const R = results.passed ? P.green : P.red

  const tasks = [
    { label: 'Task A: Term Treasure Hunt', score: results.taskA, max: 8, pass: 6 },
    { label: 'Task B: Fill Quest', score: results.taskB, max: 8, pass: 6 },
    { label: 'Task C: Sentence Builder', score: results.taskC, max: 6, pass: 4 },
  ]

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          <Box sx={{ bgcolor: R.bg, border: `2px solid ${R.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${R.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: R.shadow }}>Phase 4.2 Step 4 - Level A2 Remedial</Typography>
            <Typography variant="h6" sx={{ color: R.shadow }}>Final Results</Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message={results.passed
              ? "Excellent work! You've mastered the A2 social media vocabulary. All your hard work has paid off - you can proceed!"
              : "Keep practicing! Review the vocabulary and try again. Remember: Use hashtag #Festival, Write caption, Add emoji, Tag friend, Use call-to-action, Make post, Watch story, Click like. You can do it!"
            } />
          </Box>

          {/* Score Card */}
          <Box sx={{ bgcolor: R.bg, border: `2px solid ${R.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${R.shadow}`, p: 4, mb: 3, textAlign: 'center' }}>
            {results.passed
              ? <CheckCircleIcon sx={{ fontSize: 64, color: R.shadow, mb: 1 }} />
              : <ErrorIcon sx={{ fontSize: 64, color: R.shadow, mb: 1 }} />
            }
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: R.shadow, mb: 1 }}>
              {results.passed ? 'You Passed!' : 'Not Yet...'}
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 'bold', color: R.shadow, mb: 1 }}>
              {results.total}/{MAX_SCORE}
            </Typography>
            <Typography variant="body2" sx={{ color: R.shadow }}>Total Score</Typography>

            {/* Progress bar */}
            <Box sx={{ mt: 3, bgcolor: 'rgba(0,0,0,0.1)', borderRadius: '999px', height: 14, overflow: 'hidden' }}>
              <Box sx={{ height: '100%', width: `${progressPercent}%`, bgcolor: R.border, borderRadius: '999px', transition: 'width 0.6s ease' }} />
            </Box>
            <Typography sx={{ mt: 2, color: R.shadow }}>
              {results.passed
                ? `You scored ${results.total}/${MAX_SCORE}, above the required ${PASS_THRESHOLD}/${MAX_SCORE}!`
                : `You scored ${results.total}/${MAX_SCORE}. Need ${PASS_THRESHOLD}/${MAX_SCORE} to proceed. Try again!`
              }
            </Typography>
          </Box>

          {/* Task Breakdown */}
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: P.blue.shadow, mb: 2 }}>Task Breakdown:</Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {tasks.map((task, i) => {
              const taskPassed = task.score >= task.pass
              const TC = taskPassed ? P.green : P.red
              return (
                <Grid item xs={12} md={4} key={i}>
                  <Box sx={{ bgcolor: TC.bg, border: `2px solid ${TC.border}`, borderRadius: '16px', boxShadow: `3px 3px 0 ${TC.shadow}`, p: 3, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: TC.shadow, mb: 1 }}>{task.label}</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: TC.shadow }}>{task.score}/{task.max}</Typography>
                    <Typography variant="caption" sx={{ color: TC.shadow }}>(Pass: {task.pass}/{task.max})</Typography>
                    <Box sx={{ mt: 1 }}>
                      {taskPassed
                        ? <CheckCircleIcon sx={{ color: TC.shadow }} />
                        : <ErrorIcon sx={{ color: TC.shadow }} />
                      }
                    </Box>
                  </Box>
                </Grid>
              )
            })}
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Box component="button" onClick={handleContinue} sx={{
              bgcolor: R.bg, border: `2px solid ${R.border}`,
              borderRadius: '12px', boxShadow: `3px 3px 0 ${R.shadow}`,
              px: 6, py: 1.5, fontWeight: 700, fontSize: '1rem',
              cursor: 'pointer', color: R.shadow, display: 'flex', alignItems: 'center', gap: 1,
              '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${R.shadow}` },
              '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${R.shadow}` },
            }}>
              {results.passed ? <><HomeIcon fontSize="small" /> Return to Dashboard</> : <><RefreshIcon fontSize="small" /> Try Again</>}
            </Box>
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
