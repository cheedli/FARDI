import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import HomeIcon from '@mui/icons-material/Home'
import RefreshIcon from '@mui/icons-material/Refresh'
import { requestPhase42FinalScore } from '../../shared/routing.js'

/**
 * Phase 4.2 Step 4 - Remedial B2 - Results Page
 * Shows final scores and pass/fail status
 * Tasks: A-D (4 tasks)
 * Total: 33 points (5+8+8+12)
 * Pass threshold: 26/33 (approximately 79%)
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

export default function RemedialB2Results() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT

  const [loading, setLoading] = useState(true)
  const [scores, setScores] = useState({ taskA: 0, taskB: 0, taskC: 0, taskD: 0, total: 0, passed: false })
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
    const taskAScore = parseInt(sessionStorage.getItem('phase4_2_step4_b2_taskA') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('phase4_2_step4_b2_taskB') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('phase4_2_step4_b2_taskC') || '0')
    const taskDScore = parseInt(sessionStorage.getItem('phase4_2_step4_b2_taskD') || '0')

    const total = taskAScore + taskBScore + taskCScore + taskDScore
    const passed = total >= 26

    setScores({ taskA: taskAScore, taskB: taskBScore, taskC: taskCScore, taskD: taskDScore, total, passed })

    try {
      const data = await requestPhase42FinalScore(4, 'b2', { total_score: total })
      if (data.passed) sessionStorage.setItem('phase4_2_redirect_url', data.next_url)
      else sessionStorage.removeItem('phase4_2_redirect_url')
    } catch (error) {
      console.error('Failed to log final score:', error)
    }

    setLoading(false)
  }

  const handleRedirect = () => {
    sessionStorage.removeItem('phase4_2_step4_b2_taskA')
    sessionStorage.removeItem('phase4_2_step4_b2_taskB')
    sessionStorage.removeItem('phase4_2_step4_b2_taskC')
    sessionStorage.removeItem('phase4_2_step4_b2_taskD')
    if (scores.passed) navigate('/phase4_2/step/4/remedial/c1/taskA')
    else navigate('/phase4_2/step/4/remedial/b2/taskA')
  }

  const handleRedirectNow = () => setCountdown(0)

  const percentage = Math.round((scores.total / 33) * 100)

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, textAlign: 'center',
          }}>
            <Typography variant="h5" sx={{ color: P.blue.shadow }}>Calculating your final score...</Typography>
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
          <Box sx={{
            bgcolor: scores.passed ? P.green.bg : P.orange.bg,
            border: `2px solid ${scores.passed ? P.green.border : P.orange.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${scores.passed ? P.green.shadow : P.orange.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: scores.passed ? P.green.shadow : P.orange.shadow }}>
              Phase 4.2 Step 4 - Remedial Activities
            </Typography>
            <Typography variant="h6" sx={{ color: scores.passed ? P.green.shadow : P.orange.shadow }}>
              Level B2 - Final Results
            </Typography>
          </Box>

          {/* Main Results Card */}
          <Box sx={{
            bgcolor: scores.passed ? P.green.bg : P.orange.bg,
            border: `2px solid ${scores.passed ? P.green.border : P.orange.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${scores.passed ? P.green.shadow : P.orange.shadow}`,
            p: 4, mb: 3, textAlign: 'center',
          }}>
            <EmojiEventsIcon sx={{ fontSize: 72, color: scores.passed ? P.green.border : P.orange.border, mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: scores.passed ? P.green.shadow : P.orange.shadow, mb: 2 }}>
              {scores.passed ? 'Congratulations!' : 'Keep Practicing!'}
            </Typography>

            <Box sx={{
              bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
              borderRadius: '16px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
              p: 3, display: 'inline-block', mb: 2,
            }}>
              <Typography variant="h2" sx={{ fontWeight: 'bold', color: scores.passed ? P.green.shadow : P.orange.shadow }}>
                {scores.total} / 33
              </Typography>
              <Typography variant="body2" sx={{ color: P.blue.shadow }}>
                {percentage}% • Pass Threshold: 26/33 (79%)
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ color: scores.passed ? P.green.shadow : P.orange.shadow, mt: 1 }}>
              {scores.passed
                ? 'You have passed Phase 4.2 Step 4 Remedial B2! Excellent work mastering B2 level social media vocabulary and post creation strategies.'
                : "Don't worry! You'll restart from Task A to strengthen your B2-level social media vocabulary and post creation skills."}
            </Typography>
          </Box>

          {/* Score Breakdown */}
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: P.blue.shadow, mb: 2 }}>Score Breakdown</Typography>

            {[
              { label: 'Task A: Role-Play Dialogue', score: scores.taskA, max: 5, pass: 4 },
              { label: 'Task B: Writing (8 Questions)', score: scores.taskB, max: 8, pass: 6 },
              { label: 'Task C: Matching Game', score: scores.taskC, max: 8, pass: 6 },
              { label: 'Task D: Spelling & Explain', score: scores.taskD, max: 12, pass: 9 },
            ].map(({ label, score, max, pass }) => (
              <Box key={label} sx={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                p: 2, mb: 1, borderRadius: '12px',
                bgcolor: score >= pass ? P.green.bg : P.yellow.bg,
                border: `2px solid ${score >= pass ? P.green.border : P.yellow.border}`,
              }}>
                <Typography variant="body1" sx={{ color: score >= pass ? P.green.shadow : P.yellow.shadow, fontWeight: 600 }}>
                  {label}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: score >= pass ? P.green.shadow : P.yellow.shadow }}>
                  {score} / {max}
                </Typography>
              </Box>
            ))}

            {/* Total row */}
            <Box sx={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              p: 3, borderRadius: '12px',
              bgcolor: scores.passed ? P.green.bg : P.orange.bg,
              border: `2px solid ${scores.passed ? P.green.border : P.orange.border}`,
              boxShadow: `3px 3px 0 ${scores.passed ? P.green.shadow : P.orange.shadow}`,
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: scores.passed ? P.green.shadow : P.orange.shadow }}>
                Total Score
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: scores.passed ? P.green.shadow : P.orange.shadow }}>
                {scores.total} / 33
              </Typography>
            </Box>
          </Box>

          {/* Message from Instructor */}
          <Box sx={{ mb: 3 }}>
            <CharacterMessage
              character="MS. MABROUKI"
              message={scores.passed
                ? "Outstanding achievement! You've successfully completed the B2 level remedial activities with excellent social media vocabulary and post creation skills. You're ready for the next challenge!"
                : "Good effort! Let's work on strengthening your social media vocabulary and post creation strategies. Remember to use correct terms for hashtags, engagement, CTAs, and practice your spelling. Keep practicing!"}
            />
          </Box>

          {/* Countdown and Action */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, textAlign: 'center',
          }}>
            <Typography variant="h6" sx={{ color: P.teal.shadow, mb: 1 }}>
              {scores.passed ? 'Proceeding to C1 practice...' : 'Restarting B2 remedial activities...'}
            </Typography>
            <Typography variant="body2" sx={{ color: P.teal.shadow, mb: 2 }}>
              Redirecting in {countdown} seconds
            </Typography>

            {/* Countdown progress bar */}
            <Box sx={{
              bgcolor: P.teal.border,
              borderRadius: '999px', height: 8, mb: 3, overflow: 'hidden',
            }}>
              <Box sx={{
                bgcolor: scores.passed ? P.green.shadow : P.orange.border, height: '100%', borderRadius: '999px',
                width: `${(10 - countdown) * 10}%`, transition: 'width 0.5s',
              }} />
            </Box>

            <Box component="button" onClick={handleRedirectNow} sx={{
              bgcolor: scores.passed ? P.green.bg : P.orange.bg,
              border: `2px solid ${scores.passed ? P.green.border : P.orange.border}`,
              borderRadius: '12px', boxShadow: `3px 3px 0 ${scores.passed ? P.green.shadow : P.orange.shadow}`,
              px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
              cursor: 'pointer', color: scores.passed ? P.green.shadow : P.orange.shadow,
              display: 'flex', alignItems: 'center', gap: 1, mx: 'auto',
              '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${scores.passed ? P.green.shadow : P.orange.shadow}` },
              '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${scores.passed ? P.green.shadow : P.orange.shadow}` },
            }}>
              {scores.passed ? <HomeIcon fontSize="small" /> : <RefreshIcon fontSize="small" />}
              {scores.passed ? 'Go to Dashboard Now' : 'Restart Now'}
            </Box>
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
