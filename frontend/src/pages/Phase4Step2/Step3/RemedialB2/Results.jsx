import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container, LinearProgress, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'

/**
 * Phase 4.2 Step 3 - Remedial B2 - Results Page
 * Shows final scores and pass/fail status
 * Tasks: A (6) + B (8) + C (8) + D (12) = 34 points total
 * Pass threshold: 27/34 (79%)
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
  const isDark = theme.palette.mode === 'dark'
  const P = isDark ? DARK : LIGHT
  const [loading, setLoading] = useState(true)
  const [scores, setScores] = useState({
    taskA: 0,
    taskB: 0,
    taskC: 0,
    taskD: 0,
    total: 0,
    passed: false
  })
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
    // Get scores from sessionStorage
    const taskAScore = parseInt(sessionStorage.getItem('phase4_2_step3_b2_taskA') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('phase4_2_step3_b2_taskB') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('phase4_2_step3_b2_taskC') || '0')
    const taskDScore = parseInt(sessionStorage.getItem('phase4_2_step3_b2_taskD') || '0')

    // Calculate total (out of 34)
    const total = taskAScore + taskBScore + taskCScore + taskDScore
    const passed = total >= 27 // 27/34 = 79%

    console.log('\n' + '='.repeat(60))
    console.log('PHASE 4.2 STEP 3 - REMEDIAL B2 - FINAL RESULTS')
    console.log('='.repeat(60))
    console.log('Task A (Role-Play Saga):', taskAScore, '/ 6')
    console.log('Task B (Explain Expedition):', taskBScore, '/ 8')
    console.log('Task C (Kahoot Match):', taskCScore, '/ 8')
    console.log('Task D (Spell Quest):', taskDScore, '/ 12')
    console.log('-'.repeat(60))
    console.log('TOTAL SCORE:', total, '/ 34')
    console.log('PASS THRESHOLD: 27/34 (79%)')
    console.log('-'.repeat(60))
    if (passed) {
      console.log('PASSED - Student will proceed to next phase')
    } else {
      console.log('FAILED - Student will repeat Phase 4.2 Step 3 Remedial Level B2')
    }
    console.log('='.repeat(60) + '\n')

    setScores({
      taskA: taskAScore,
      taskB: taskBScore,
      taskC: taskCScore,
      taskD: taskDScore,
      total,
      passed
    })

    // Log final score to backend
    try {
      const response = await fetch('/api/phase4/remedial/final-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          phase: '4.2',
          step: 3,
          level: 'B2',
          task_a_score: taskAScore,
          task_b_score: taskBScore,
          task_c_score: taskCScore,
          task_d_score: taskDScore,
          total_score: total,
          max_score: 34,
          passed: passed
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('Phase 4.2 Step 3 B2 Final score logged to backend:', data.data)
      }
    } catch (error) {
      console.error('Failed to log final score:', error)
    }

    setLoading(false)
  }

  const handleRedirect = () => {
    // Clear B2 scores
    sessionStorage.removeItem('phase4_2_step3_b2_taskA')
    sessionStorage.removeItem('phase4_2_step3_b2_taskB')
    sessionStorage.removeItem('phase4_2_step3_b2_taskC')
    sessionStorage.removeItem('phase4_2_step3_b2_taskD')

    if (scores.passed) {
      navigate('/dashboard')
    } else {
      navigate('/phase4_2/step3/remedial/b2/taskA')
    }
  }

  const handleRedirectNow = () => {
    setCountdown(0)
  }

  const clayCard = (color) => ({
    bgcolor: P[color].bg,
    border: `2px solid ${P[color].border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${P[color].shadow}`,
    p: 3,
  })

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <Box sx={{ ...clayCard('blue'), textAlign: 'center' }}>
            <Typography variant="h5" sx={{ color: P.blue.border, mb: 2 }}>Calculating your final score...</Typography>
            <LinearProgress sx={{ borderRadius: 5, '& .MuiLinearProgress-bar': { bgcolor: P.blue.border } }} />
          </Box>
        </Container>
      </Box>
    )
  }

  const resultColor = scores.passed ? 'green' : 'orange'

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>

          {/* Header */}
          <Box sx={{ ...clayCard(resultColor), mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: P[resultColor].border }}>
              Phase 4.2 · Step 3 · Remedial B2
            </Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#fff' : '#1a252f', mt: 0.5 }}>
              Final Results
            </Typography>
          </Box>

          {/* Main Score Card */}
          <Box sx={{ ...clayCard(resultColor), mb: 3, textAlign: 'center' }}>
            <EmojiEventsIcon sx={{ fontSize: 80, color: P[resultColor].border, mb: 1 }} />
            <Typography variant="h3" fontWeight="bold" sx={{ color: P[resultColor].border }}>
              {scores.passed ? 'Congratulations!' : 'Keep Practicing!'}
            </Typography>

            <Box sx={{ ...clayCard('blue'), maxWidth: 320, mx: 'auto', my: 3, textAlign: 'center' }}>
              <Typography variant="h2" fontWeight="bold" sx={{ color: P.blue.border }}>
                {scores.total} / 34
              </Typography>
              <Typography variant="body1" sx={{ color: isDark ? '#ccc' : '#555' }}>Total Score</Typography>
              <Typography variant="caption" sx={{ color: isDark ? '#aaa' : '#777' }}>Pass Threshold: 27/34 (79%)</Typography>
            </Box>

            <Box sx={{ ...clayCard(scores.passed ? 'green' : 'yellow'), mt: 2 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: P[scores.passed ? 'green' : 'yellow'].border, mb: 0.5 }}>
                {scores.passed ? 'You have passed Phase 4.2 Step 3 Remedial B2!' : 'Score below passing threshold'}
              </Typography>
              <Typography variant="body1" sx={{ color: isDark ? '#ddd' : '#444' }}>
                {scores.passed
                  ? "Excellent work! You've mastered B2 level social media terminology with strong understanding of hashtags, captions, emojis, tags, calls-to-action, and content strategy."
                  : "Don't worry! You'll restart from Task A to improve your B2-level social media vocabulary and understanding."}
              </Typography>
            </Box>
          </Box>

          {/* Score Breakdown */}
          <Box sx={{ ...clayCard('blue'), mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: P.blue.border, mb: 2 }}>
              Score Breakdown
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {[
                { label: 'Task A: Role-Play Saga', score: scores.taskA, max: 6, pass: 5 },
                { label: 'Task B: Explain Expedition', score: scores.taskB, max: 8, pass: 6 },
                { label: 'Task C: Kahoot Match', score: scores.taskC, max: 8, pass: 6 },
                { label: 'Task D: Spell Quest', score: scores.taskD, max: 12, pass: 9 },
              ].map((row, i) => (
                <Box key={i} sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  bgcolor: isDark ? '#1a1a2e' : '#f8f9fa',
                  borderRadius: '12px',
                  p: 2,
                }}>
                  <Typography variant="body1" sx={{ color: isDark ? '#ddd' : '#2c3e50' }}>{row.label}</Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: row.score >= row.pass ? P.green.border : P.orange.border }}>
                    {row.score} / {row.max}
                  </Typography>
                </Box>
              ))}

              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                bgcolor: isDark ? '#2a2a3e' : '#34495e',
                borderRadius: '12px',
                p: 2,
              }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: 'white' }}>Total Score</Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>{scores.total} / 34</Typography>
              </Box>
            </Box>
          </Box>

          {/* Character Message */}
          <Box sx={{ ...clayCard('teal'), mb: 3 }}>
            <CharacterMessage
              character="MS. MABROUKI"
              message={scores.passed
                ? "Outstanding achievement! You've successfully completed the B2 level remedial activities for Step 3 with excellent social media terminology mastery. Your understanding of hashtags, captions, emojis, tags, calls-to-action, stories, engagement metrics, and viral content is impressive. You're ready for the next challenge!"
                : "Good effort! You're making progress, but let's work on strengthening your social media terminology. Remember to understand the role of hashtags for discoverability, captions for engagement, emojis for emotion, tags for networking, and calls-to-action for conversion. Practice makes perfect - you'll do even better next time!"}
            />
          </Box>

          {/* Countdown and Action */}
          <Box sx={{ ...clayCard(resultColor), textAlign: 'center' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: P[resultColor].border, mb: 0.5 }}>
              {scores.passed ? 'Proceeding to dashboard...' : 'Restarting B2 remedial activities...'}
            </Typography>
            <Typography variant="body1" sx={{ color: isDark ? '#ccc' : '#555', mb: 2 }}>
              Redirecting in {countdown} seconds
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(10 - countdown) * 10}
              sx={{
                height: 10,
                borderRadius: 5,
                mb: 3,
                bgcolor: isDark ? '#333' : '#e0e0e0',
                '& .MuiLinearProgress-bar': { bgcolor: P[resultColor].border, borderRadius: 5 }
              }}
            />
            <Box
              component="button"
              onClick={handleRedirectNow}
              sx={{
                ...clayCard(resultColor),
                cursor: 'pointer',
                px: 6, py: 1.5,
                fontSize: '1rem',
                fontWeight: 'bold',
                color: P[resultColor].border,
                display: 'inline-block',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P[resultColor].shadow}` },
                transition: 'all 0.15s ease',
              }}
            >
              {scores.passed ? 'Go to Dashboard Now' : 'Restart Now'}
            </Box>
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
