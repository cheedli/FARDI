import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Grid, Container, LinearProgress } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import HomeIcon from '@mui/icons-material/Home'
import RefreshIcon from '@mui/icons-material/Refresh'
import { requestPhase42FinalScore } from '../../shared/routing.js'

/**
 * Phase 4.2 Step 3 - Level A2 Remedial Results
 * Shows combined results from Tasks A, B, and C
 * Total: 22 points (8 + 8 + 6)
 * Pass threshold: 18/22 points
 */

const PASS_THRESHOLD = 18
const MAX_SCORE = 22

export default function Phase4_2Step3RemedialA2Results() {
  const navigate = useNavigate()
  const [results, setResults] = useState({ taskA: 0, taskB: 0, taskC: 0, total: 0, passed: false })

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

  useEffect(() => {
    const taskAScore = parseInt(sessionStorage.getItem('phase4_2_step3_a2_taskA') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('phase4_2_step3_a2_taskB') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('phase4_2_step3_a2_taskC') || '0')
    const totalScore = taskAScore + taskBScore + taskCScore
    const passed = totalScore >= PASS_THRESHOLD
    setResults({ taskA: taskAScore, taskB: taskBScore, taskC: taskCScore, total: totalScore, passed })
    logRemedialCompletion(totalScore, passed)
  }, [])

  const logRemedialCompletion = async (score) => {
    try {
      const data = await requestPhase42FinalScore(3, 'a2', { total_score: score })
      if (data.passed) sessionStorage.setItem('phase4_2_redirect_url', data.next_url)
      else sessionStorage.removeItem('phase4_2_redirect_url')
    } catch (error) {
      console.error('Failed to log remedial completion:', error)
    }
  }

  const handleContinue = () => {
    sessionStorage.removeItem('phase4_2_step3_a2_taskA')
    sessionStorage.removeItem('phase4_2_step3_a2_taskB')
    sessionStorage.removeItem('phase4_2_step3_a2_taskC')
    if (results.passed) {
      navigate('/phase4_2/step/3/remedial/b1/taskA')
    } else {
      navigate('/phase4_2/step/3/remedial/a2/taskA')
    }
  }

  const progressPercent = (results.total / MAX_SCORE) * 100

  const TASKS = [
    { label: 'Task A: Term Treasure Hunt', score: results.taskA, max: 8, pass: 6 },
    { label: 'Task B: Fill Quest', score: results.taskB, max: 8, pass: 6 },
    { label: 'Task C: Sentence Builder', score: results.taskC, max: 6, pass: 4 },
  ]

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: results.passed ? P.green.bg : P.red.bg,
            border: `2px solid ${results.passed ? P.green.border : P.red.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${results.passed ? P.green.shadow : P.red.shadow}`,
            p: 3, mb: 3
          }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: results.passed ? P.green.shadow : P.red.shadow }}>Phase 4.2 Step 3 - Level A2 Remedial</Typography>
            <Typography variant="h6" sx={{ color: results.passed ? P.green.shadow : P.red.shadow }}>Final Results</Typography>
          </Box>

          {/* Character */}
          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message={results.passed
              ? "Excellent work! You've mastered the A2 social media vocabulary. All your hard work has paid off - you can proceed!"
              : "Keep practicing! Review the vocabulary and try again. Remember the patterns: hashtag is #, caption is words under photo, emoji is a smile face. You can do it!"
            } />
          </Box>

          {/* Overall Score */}
          <Box sx={{
            bgcolor: results.passed ? P.green.bg : P.yellow.bg,
            border: `2px solid ${results.passed ? P.green.border : P.yellow.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${results.passed ? P.green.shadow : P.yellow.shadow}`,
            p: 4, mb: 3, textAlign: 'center'
          }}>
            {results.passed
              ? <CheckCircleIcon sx={{ fontSize: 64, color: P.green.border, mb: 1 }} />
              : <ErrorIcon sx={{ fontSize: 64, color: P.red.border, mb: 1 }} />
            }
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: results.passed ? P.green.shadow : P.red.shadow }}>
              {results.passed ? 'You Passed!' : 'Not Yet...'}
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 'bold', color: results.passed ? P.green.border : P.red.border }}>
              {results.total}/{MAX_SCORE}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.7, mt: 0.5 }}>Total Score</Typography>

            <Box sx={{ mt: 3, mb: 2 }}>
              <LinearProgress variant="determinate" value={progressPercent}
                sx={{ height: 12, borderRadius: 6, bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  '& .MuiLinearProgress-bar': { bgcolor: results.passed ? P.green.border : P.red.border, borderRadius: 6 } }}
              />
            </Box>

            <Box sx={{
              bgcolor: results.passed ? P.green.bg : P.yellow.bg,
              border: `1px solid ${results.passed ? P.green.border : P.yellow.border}`,
              borderRadius: '12px', p: 1.5, mt: 2
            }}>
              <Typography variant="body2">
                {results.passed
                  ? <>You scored <strong>{results.total}/{MAX_SCORE}</strong>, above the required <strong>{PASS_THRESHOLD}/{MAX_SCORE}</strong> to proceed!</>
                  : <>You scored <strong>{results.total}/{MAX_SCORE}</strong>. You need at least <strong>{PASS_THRESHOLD}/{MAX_SCORE}</strong> to proceed. Please try again!</>
                }
              </Typography>
            </Box>
          </Box>

          {/* Task Breakdown */}
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: P.blue.shadow }}>Task Breakdown:</Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {TASKS.map((task, idx) => {
              const passed = task.score >= task.pass
              return (
                <Grid item xs={12} md={4} key={idx}>
                  <Box sx={{
                    bgcolor: passed ? P.green.bg : P.red.bg,
                    border: `2px solid ${passed ? P.green.border : P.red.border}`,
                    borderRadius: '20px', boxShadow: `4px 4px 0 ${passed ? P.green.shadow : P.red.shadow}`,
                    p: 2, textAlign: 'center'
                  }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1, color: passed ? P.green.shadow : P.red.shadow }}>{task.label}</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: passed ? P.green.border : P.red.border }}>{task.score}/{task.max}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>(Pass: {task.pass}/{task.max})</Typography>
                    <Box sx={{ mt: 1 }}>
                      {passed ? <CheckCircleIcon sx={{ color: P.green.border }} /> : <ErrorIcon sx={{ color: P.red.border }} />}
                    </Box>
                  </Box>
                </Grid>
              )
            })}
          </Grid>

          {/* Tips */}
          {!results.passed && (
            <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: P.blue.shadow }}>Tips for Improvement:</Typography>
              {results.taskA < 6 && <Typography variant="body2" sx={{ mb: 0.5 }}>• Review Task A: Practice matching social media terms with their meanings</Typography>}
              {results.taskB < 6 && <Typography variant="body2" sx={{ mb: 0.5 }}>• Review Task B: Focus on understanding when to use each social media term</Typography>}
              {results.taskC < 4 && <Typography variant="body2">• Review Task C: Practice writing simple sentences with "is" and proper capitalization</Typography>}
            </Box>
          )}

          {/* Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Box component="button" onClick={handleContinue} sx={{
              bgcolor: results.passed ? P.green.bg : P.orange.bg,
              border: `2px solid ${results.passed ? P.green.border : P.orange.border}`,
              borderRadius: '12px', boxShadow: `3px 3px 0 ${results.passed ? P.green.shadow : P.orange.shadow}`,
              px: 6, py: 1.5, fontWeight: 700, fontSize: '1rem',
              cursor: 'pointer', color: results.passed ? P.green.shadow : P.orange.shadow,
              display: 'flex', alignItems: 'center', gap: 1,
              '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${results.passed ? P.green.shadow : P.orange.shadow}` }
            }}>
              {results.passed ? <><HomeIcon /> Return to Dashboard</> : <><RefreshIcon /> Try Again</>}
            </Box>
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
