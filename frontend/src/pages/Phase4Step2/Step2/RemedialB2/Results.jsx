import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, LinearProgress, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import HomeIcon from '@mui/icons-material/Home'
import RefreshIcon from '@mui/icons-material/Refresh'
import { requestPhase42FinalScore } from '../../shared/routing.js'

/**
 * Phase 4.2 Step 2 - Remedial B2 - Results Page
 * Shows final scores and pass/fail status
 * Tasks: A-D (4 tasks) = 40 points total, average to /10 scale
 * Pass threshold: 8/10 (80%)
 */

export default function RemedialB2Results() {
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

  const [loading, setLoading] = useState(true)
  const [scores, setScores] = useState({ taskA: 0, taskB: 0, taskC: 0, taskD: 0, average: 0, passed: false })
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    calculateFinalScore()
  }, [])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      handleRedirect()
    }
  }, [countdown])

  const calculateFinalScore = async () => {
    const taskAScore = parseInt(sessionStorage.getItem('remedial_phase4_2_step2_b2_taskA_score') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('remedial_phase4_2_step2_b2_taskB_score') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('remedial_phase4_2_step2_b2_taskC_score') || '0')
    const taskDScore = parseInt(sessionStorage.getItem('remedial_phase4_2_step2_b2_taskD_score') || '0')
    const average = Math.round((taskAScore + taskBScore + taskCScore + taskDScore) / 4)
    const passed = average >= 8

    setScores({ taskA: taskAScore, taskB: taskBScore, taskC: taskCScore, taskD: taskDScore, average, passed })

    try {
      const data = await requestPhase42FinalScore(2, 'b2', { total_score: average })
      if (data.passed) sessionStorage.setItem('phase4_2_redirect_url', data.next_url)
      else sessionStorage.removeItem('phase4_2_redirect_url')
    } catch (error) { console.error('Failed to log final score:', error) }

    setLoading(false)
  }

  const handleRedirect = () => {
    sessionStorage.removeItem('remedial_phase4_2_step2_b2_taskA_score')
    sessionStorage.removeItem('remedial_phase4_2_step2_b2_taskB_score')
    sessionStorage.removeItem('remedial_phase4_2_step2_b2_taskC_score')
    sessionStorage.removeItem('remedial_phase4_2_step2_b2_taskD_score')
    if (scores.passed) { navigate('/dashboard') } else { navigate('/phase4_2/step/2/remedial/b2/taskA') }
  }

  const handleRedirectNow = () => { setCountdown(0) }

  const progressPercent = (scores.average / 10) * 100
  const C = scores.passed ? P.green : P.orange

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 4, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ color: P.blue.shadow }}>Calculating your final score...</Typography>
            <LinearProgress sx={{ mt: 2, borderRadius: 4 }} />
          </Box>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{ bgcolor: C.bg, border: `2px solid ${C.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${C.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: C.shadow }}>
              Phase 4.2 - Step 2: Remedial Activities
            </Typography>
            <Typography variant="h5" sx={{ color: C.shadow }}>
              Level B2 - Final Results
            </Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage
              character="MS. MABROUKI"
              message={scores.passed
                ? "Outstanding achievement! You've successfully completed the B2 level remedial activities with excellent social media post planning skills. Your understanding of hashtags, captions, engagement strategies, viral content, and professional communication is impressive. You're ready for the next challenge!"
                : "Good effort! You're making progress, but let's work on strengthening your social media post planning skills. Remember to use the correct terms for hashtags, engagement, calls-to-action, and understand how different elements work together to create effective posts. Practice makes perfect - you'll do even better next time!"}
            />
          </Box>

          {/* Main Result */}
          <Box sx={{ bgcolor: C.bg, border: `3px solid ${C.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${C.shadow}`, p: 4, mb: 3, textAlign: 'center' }}>
            <EmojiEventsIcon sx={{ fontSize: 80, color: C.shadow, mb: 2 }} />
            <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: C.shadow }}>
              {scores.passed ? 'Congratulations!' : 'Keep Practicing!'}
            </Typography>
            <Box sx={{ bgcolor: isDark ? '#1a1a2e' : 'white', border: `2px solid ${C.border}`, borderRadius: '16px', p: 3, maxWidth: 300, mx: 'auto', my: 3 }}>
              <Typography variant="h2" fontWeight="bold" sx={{ color: C.shadow }}>{scores.average} / 10</Typography>
              <Typography variant="h6" sx={{ color: isDark ? '#aaa' : '#666' }}>Average Score</Typography>
              <Typography variant="caption" sx={{ color: isDark ? '#888' : '#888', display: 'block', mt: 1 }}>Pass Threshold: 8/10 (80%)</Typography>
            </Box>

            <LinearProgress variant="determinate" value={progressPercent} sx={{ height: 12, borderRadius: 6, my: 2 }} />

            <Box sx={{ bgcolor: isDark ? '#1a1a2e' : 'white', border: `1px solid ${C.border}`, borderRadius: '12px', p: 2 }}>
              {scores.passed ? (
                <Typography sx={{ color: C.shadow }}>
                  You have passed Phase 4.2 Step 2 Remedial B2! Excellent work — you've mastered B2 level social media post planning skills.
                </Typography>
              ) : (
                <Typography sx={{ color: C.shadow }}>
                  Score below passing threshold. Don't worry! You'll restart from Task A to improve your B2-level social media vocabulary.
                </Typography>
              )}
            </Box>
          </Box>

          {/* Score Breakdown */}
          <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow, mb: 2 }}>Score Breakdown:</Typography>
          <Stack spacing={2} sx={{ mb: 4 }}>
            {[
              { label: 'Task A: Role-Play Dialogue', score: scores.taskA },
              { label: 'Task B: Explain Expedition', score: scores.taskB },
              { label: 'Task C: Matching Game', score: scores.taskC },
              { label: 'Task D: Spell & Explain', score: scores.taskD },
            ].map((task, i) => (
              <Box key={i} sx={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                borderRadius: '16px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
                p: 2.5,
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` }
              }}>
                <Typography variant="body1" sx={{ color: P.blue.shadow }}>{task.label}</Typography>
                <Typography variant="h6" fontWeight="bold" sx={{ color: task.score >= 8 ? P.green.shadow : P.orange.shadow }}>
                  {task.score} / 10
                </Typography>
              </Box>
            ))}
            <Box sx={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              bgcolor: isDark ? '#1a1a2e' : '#2c3e50', borderRadius: '16px', p: 2.5
            }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: 'white' }}>Average Score</Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>{scores.average} / 10</Typography>
            </Box>
          </Stack>

          {/* Countdown + Button */}
          <Box sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`, p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom sx={{ color: P.yellow.shadow }}>
              {scores.passed ? 'Proceeding to dashboard...' : 'Restarting B2 remedial activities...'}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: isDark ? '#aaa' : '#666' }}>
              Redirecting in {countdown} seconds
            </Typography>
            <LinearProgress variant="determinate" value={(10 - countdown) * 10} sx={{ height: 8, borderRadius: 4, mb: 3 }} />
            <Box component="button" onClick={handleRedirectNow} sx={{
              bgcolor: C.bg, border: `2px solid ${C.border}`,
              borderRadius: '12px', boxShadow: `3px 3px 0 ${C.shadow}`,
              px: 5, py: 1.5, fontWeight: 700, fontSize: '1.1rem',
              cursor: 'pointer', color: C.shadow,
              display: 'inline-flex', alignItems: 'center', gap: 1,
              transition: 'transform 0.15s, box-shadow 0.15s',
              '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${C.shadow}` },
              '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${C.shadow}` }
            }}>
              {scores.passed ? <HomeIcon /> : <RefreshIcon />}
              {scores.passed ? 'Go to Dashboard Now' : 'Restart Now'}
            </Box>
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
