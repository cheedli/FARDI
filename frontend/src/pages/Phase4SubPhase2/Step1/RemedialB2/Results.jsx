import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { requestPhase42FinalScore } from '../../shared/routing.js'

/**
 * Phase 4.2 Step 1 - Remedial B2 - Results Page
 * Shows final scores and pass/fail status with 10s countdown
 */

const TASKS = [
  { key: 'taskA', label: 'Task A: Role-Play Dialogue', storage: 'remedial_phase4_2_step1_b2_taskA_score' },
  { key: 'taskB', label: 'Task B: Writing', storage: 'remedial_phase4_2_step1_b2_taskB_score' },
  { key: 'taskC', label: 'Task C: Matching Game', storage: 'remedial_phase4_2_step1_b2_taskC_score' },
  { key: 'taskD', label: 'Task D: Spelling & Explain', storage: 'remedial_phase4_2_step1_b2_taskD_score' },
  { key: 'taskE', label: 'Task E: Conditionals', storage: 'remedial_phase4_2_step1_b2_taskE_score' },
  { key: 'taskF', label: 'Task F: Passives', storage: 'remedial_phase4_2_step1_b2_taskF_score' },
]

export default function RemedialB2Results() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [scores, setScores] = useState({ taskA: 0, taskB: 0, taskC: 0, taskD: 0, taskE: 0, taskF: 0, average: 0, passed: false })
  const [countdown, setCountdown] = useState(10)
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

  useEffect(() => { calculateFinalScore() }, [])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else { handleRedirect() }
  }, [countdown])

  const calculateFinalScore = async () => {
    const taskAScore = parseInt(sessionStorage.getItem('remedial_phase4_2_step1_b2_taskA_score') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('remedial_phase4_2_step1_b2_taskB_score') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('remedial_phase4_2_step1_b2_taskC_score') || '0')
    const taskDScore = parseInt(sessionStorage.getItem('remedial_phase4_2_step1_b2_taskD_score') || '0')
    const taskEScore = parseInt(sessionStorage.getItem('remedial_phase4_2_step1_b2_taskE_score') || '0')
    const taskFScore = parseInt(sessionStorage.getItem('remedial_phase4_2_step1_b2_taskF_score') || '0')
    const average = Math.round((taskAScore + taskBScore + taskCScore + taskDScore + taskEScore + taskFScore) / 6)
    const passed = average >= 8

    setScores({ taskA: taskAScore, taskB: taskBScore, taskC: taskCScore, taskD: taskDScore, taskE: taskEScore, taskF: taskFScore, average, passed })

    try {
      const data = await requestPhase42FinalScore(1, 'b2', { total_score: average })
      if (data.passed) sessionStorage.setItem('phase4_2_redirect_url', data.next_url)
      else sessionStorage.removeItem('phase4_2_redirect_url')
    } catch (error) { console.error('Failed to log final score:', error) }

    setLoading(false)
  }

  const handleRedirect = () => {
    TASKS.forEach(t => sessionStorage.removeItem(t.storage))
    if (scores.passed) navigate('/phase4_2/step/1/remedial/c1/taskA')
    else navigate('/phase4_2/step/1/remedial/b2/taskA')
  }

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', p: 4, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ color: P.blue.shadow }}>Calculating your final score...</Typography>
            <Box sx={{ mt: 2, height: 8, borderRadius: '4px', bgcolor: isDark ? 'rgba(255,255,255,0.1)' : '#e0e0e0', overflow: 'hidden' }}>
              <Box sx={{ height: '100%', width: '60%', bgcolor: P.blue.border, borderRadius: '4px', animation: 'progress 1s infinite' }} />
            </Box>
          </Box>
        </Container>
      </Box>
    )
  }

  const R = scores.passed ? P.green : P.orange

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{ bgcolor: R.bg, border: `2px solid ${R.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${R.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: R.shadow }}>Phase 4.2 - Step 1: Remedial Activities</Typography>
            <Typography variant="h5" sx={{ color: R.shadow }}>Level B2 - Final Results</Typography>
          </Box>

          {/* Main Score Card */}
          <Box sx={{ bgcolor: R.bg, border: `2px solid ${R.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${R.shadow}`, p: 5, mb: 3, textAlign: 'center' }}>
            <EmojiEventsIcon sx={{ fontSize: 90, color: R.shadow, mb: 2 }} />
            <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: R.shadow }}>
              {scores.passed ? 'Congratulations!' : 'Keep Practicing!'}
            </Typography>
            <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'white', borderRadius: '20px', p: 4, maxWidth: 350, mx: 'auto', my: 3 }}>
              <Typography variant="h2" fontWeight="bold" sx={{ color: R.shadow }}>{scores.average} / 10</Typography>
              <Typography variant="h6" sx={{ color: R.shadow }}>Average Score</Typography>
              <Typography variant="caption" sx={{ color: R.shadow, display: 'block', mt: 0.5 }}>Pass Threshold: 8/10 (80%)</Typography>
            </Box>
            <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.6)', borderRadius: '12px', p: 2, maxWidth: 500, mx: 'auto' }}>
              <Typography variant="h6" sx={{ color: R.shadow, fontWeight: 600 }}>
                {scores.passed
                  ? 'You have passed Phase 4.2 Step 1 Remedial B2!'
                  : 'Score below passing threshold'}
              </Typography>
              <Typography variant="body2" sx={{ color: R.shadow, mt: 0.5 }}>
                {scores.passed
                  ? "Excellent work! You've mastered the B2 level social media skills."
                  : "Don't worry! You'll restart from Task A to improve your vocabulary and grammar."}
              </Typography>
            </Box>
          </Box>

          {/* Score Breakdown */}
          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>Score Breakdown</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
              {TASKS.map(task => {
                const taskScore = scores[task.key]
                const taskPassed = taskScore >= 8
                return (
                  <Box key={task.key} sx={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    bgcolor: isDark ? 'rgba(255,255,255,0.05)' : (taskPassed ? P.green.bg : P.yellow.bg),
                    border: `1px solid ${taskPassed ? P.green.border : P.yellow.border}`,
                    borderRadius: '12px', p: 2
                  }}>
                    <Typography variant="body1" sx={{ color: taskPassed ? P.green.shadow : P.yellow.shadow }}>{task.label}</Typography>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: taskPassed ? P.green.shadow : P.yellow.shadow }}>{taskScore} / 10</Typography>
                  </Box>
                )
              })}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: P.blue.shadow, borderRadius: '12px', p: 2, mt: 1 }}>
                <Typography variant="h6" sx={{ color: 'white' }} fontWeight="bold">Average Score</Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>{scores.average} / 10</Typography>
              </Box>
            </Box>
          </Box>

          {/* Instructor Message */}
          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage character="MS_MABROUKI" message={scores.passed
              ? "Outstanding achievement! You've successfully completed the B2 level remedial activities with excellent social media vocabulary and grammar skills. Your understanding of hashtags, captions, engagement strategies, and professional communication is impressive. You're ready for the next challenge!"
              : "Good effort! You're making progress, but let's work on strengthening your social media vocabulary and grammar structures. Remember to use the correct terms for hashtags, engagement, and calls-to-action, and practice your conditional and passive voice forms. Practice makes perfect - you'll do even better next time!"} />
          </Box>

          {/* Countdown + Action */}
          <Box sx={{ bgcolor: R.bg, border: `2px solid ${R.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${R.shadow}`, p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom sx={{ color: R.shadow }}>
              {scores.passed ? 'Proceeding to C1 practice...' : 'Restarting B2 remedial activities...'}
            </Typography>
            <Typography variant="body1" sx={{ color: R.shadow, mb: 2 }}>Redirecting in {countdown} seconds</Typography>
            <Box sx={{ height: 8, borderRadius: '4px', bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', overflow: 'hidden', mb: 2 }}>
              <Box sx={{ height: '100%', width: `${(10 - countdown) * 10}%`, bgcolor: R.border, borderRadius: '4px', transition: 'width 1s' }} />
            </Box>
            <Box component="button" onClick={() => setCountdown(0)} sx={{
              bgcolor: R.bg, border: `2px solid ${R.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${R.shadow}`,
              px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem', cursor: 'pointer', color: R.shadow,
              '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${R.shadow}` }
            }}>{scores.passed ? 'Go to Dashboard Now' : 'Restart Now'}</Box>
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
