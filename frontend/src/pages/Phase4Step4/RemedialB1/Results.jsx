import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container, useTheme, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { motion } from 'framer-motion'

/**
 * Phase 4 Step 4 - Remedial B1 - Results Page
 * Shows final scores and pass/fail status
 * All 6 tasks: A-F = 38 points total
 * Pass threshold: 22/38
 */

export default function RemedialB1Results() {
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
  const [scores, setScores] = useState({
    taskA: 0, taskB: 0, taskC: 0, taskD: 0, taskE: 0, taskF: 0,
    total: 0, passed: false
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
    const taskAScore = parseInt(sessionStorage.getItem('remedial_step4_b1_taskA_score') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('remedial_step4_b1_taskB_score') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('remedial_step4_b1_taskC_score') || '0')
    const taskDScore = parseInt(sessionStorage.getItem('remedial_step4_b1_taskD_score') || '0')
    const taskEScore = parseInt(sessionStorage.getItem('remedial_step4_b1_taskE_score') || '0')
    const taskFScore = parseInt(sessionStorage.getItem('remedial_step4_b1_taskF_score') || '0')

    const total = taskAScore + taskBScore + taskCScore + taskDScore + taskEScore + taskFScore
    const passed = total >= 22

    console.log('\n' + '='.repeat(60))
    console.log('PHASE 4 STEP 4 - REMEDIAL B1 - FINAL RESULTS')
    console.log('='.repeat(60))
    console.log('Task A (Negotiation Battle):', taskAScore, '/4')
    console.log('Task B (Definition Duel):', taskBScore, '/8')
    console.log('Task C (Quiz Game):', taskCScore, '/6')
    console.log('Task D (Flashcard Game):', taskDScore, '/8')
    console.log('Task E (Tense Time Travel):', taskEScore, '/6')
    console.log('Task F (Grammar Kahoot):', taskFScore, '/6')
    console.log('-'.repeat(60))
    console.log('TOTAL SCORE:', total, '/38')
    console.log('PASS THRESHOLD: 22/38')
    console.log('-'.repeat(60))
    if (passed) {
      console.log('✅ PASSED - Student will proceed to next phase')
    } else {
      console.log('❌ FAILED - Student will repeat Step 4 Remedial Level B1')
    }
    console.log('='.repeat(60) + '\n')

    setScores({ taskA: taskAScore, taskB: taskBScore, taskC: taskCScore, taskD: taskDScore, taskE: taskEScore, taskF: taskFScore, total, passed })

    try {
      const response = await fetch('/api/phase4/step4/remedial/b1/final-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          task_a_score: taskAScore, task_b_score: taskBScore, task_c_score: taskCScore,
          task_d_score: taskDScore, task_e_score: taskEScore, task_f_score: taskFScore
        })
      })
      const data = await response.json()
      if (data.success) {
        console.log('Step 4 B1 Final score logged to backend:', data.data)
        sessionStorage.setItem('phase4_step4_b1_next_url', data.data.next_url || (passed ? '/phase4/step/5' : '/phase4/step/4/remedial/b1/taskA'))
      }
    } catch (error) {
      console.error('Failed to log final score:', error)
    }

    setLoading(false)
  }

  const handleRedirect = () => {
    sessionStorage.removeItem('remedial_step4_b1_taskA_score')
    sessionStorage.removeItem('remedial_step4_b1_taskB_score')
    sessionStorage.removeItem('remedial_step4_b1_taskC_score')
    sessionStorage.removeItem('remedial_step4_b1_taskD_score')
    sessionStorage.removeItem('remedial_step4_b1_taskE_score')
    sessionStorage.removeItem('remedial_step4_b1_taskF_score')

    navigate(sessionStorage.getItem('phase4_step4_b1_next_url') || (scores.passed ? '/phase4/step/5' : '/phase4/step/4/remedial/b1/taskA'))
  }

  const handleRedirectNow = () => setCountdown(0)

  const taskRows = [
    { label: 'Task A: Negotiation Battle', score: scores.taskA, max: 4 },
    { label: 'Task B: Definition Duel', score: scores.taskB, max: 8 },
    { label: 'Task C: Quiz Game', score: scores.taskC, max: 6 },
    { label: 'Task D: Flashcard Game', score: scores.taskD, max: 8 },
    { label: 'Task E: Tense Time Travel', score: scores.taskE, max: 6 },
    { label: 'Task F: Grammar Kahoot', score: scores.taskF, max: 6 },
  ]

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <Box sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`, p: 4, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ color: P.yellow.shadow }}>Calculating your final score...</Typography>
            <LinearProgress sx={{ mt: 2 }} />
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
          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>Phase 4 - Step 4: Remedial Activities</Typography>
            <Typography variant="h5" sx={{ color: P.blue.shadow }}>Level B1 - Final Results</Typography>
          </Box>

          {/* Main Result */}
          <Box sx={{
            bgcolor: scores.passed ? P.green.bg : P.orange.bg,
            border: `2px solid ${scores.passed ? P.green.border : P.orange.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${scores.passed ? P.green.shadow : P.orange.shadow}`,
            p: 4, mb: 3, textAlign: 'center',
          }}>
            <EmojiEventsIcon sx={{ fontSize: 80, color: scores.passed ? P.green.shadow : P.orange.shadow, mb: 2 }} />
            <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: scores.passed ? P.green.shadow : P.orange.shadow }}>
              {scores.passed ? 'Congratulations!' : 'Keep Practicing!'}
            </Typography>

            <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)', borderRadius: '16px', p: 3, maxWidth: 300, mx: 'auto', my: 3 }}>
              <Typography variant="h2" fontWeight="bold" sx={{ color: scores.passed ? P.green.shadow : P.orange.shadow }}>
                {scores.total} / 38
              </Typography>
              <Typography variant="body1" sx={{ color: scores.passed ? P.green.shadow : P.orange.shadow }}>Total Points</Typography>
              <Typography variant="caption" sx={{ display: 'block', mt: 1, color: scores.passed ? P.green.shadow : P.orange.shadow, opacity: 0.8 }}>
                Pass Threshold: 22/38
              </Typography>
            </Box>

            <Typography variant="h6" sx={{ color: scores.passed ? P.green.shadow : P.orange.shadow }}>
              {scores.passed ? 'You have passed Step 4 Remedial B1!' : 'Score below passing threshold'}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, color: scores.passed ? P.green.shadow : P.orange.shadow }}>
              {scores.passed
                ? "Excellent work! You've mastered the B1 level advertising skills."
                : "Don't worry! You'll restart from Task A to improve your skills."}
            </Typography>
          </Box>

          {/* Score Breakdown */}
          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>Score Breakdown</Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              {taskRows.map(({ label, score, max }, idx) => (
                <Box key={idx} sx={{
                  bgcolor: score >= Math.ceil(max * 0.75) ? P.green.bg : P.orange.bg,
                  border: `2px solid ${score >= Math.ceil(max * 0.75) ? P.green.border : P.orange.border}`,
                  borderRadius: '12px', boxShadow: `2px 2px 0 ${score >= Math.ceil(max * 0.75) ? P.green.shadow : P.orange.shadow}`,
                  p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <Typography variant="body1" sx={{ color: score >= Math.ceil(max * 0.75) ? P.green.shadow : P.orange.shadow }}>{label}</Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: score >= Math.ceil(max * 0.75) ? P.green.shadow : P.orange.shadow }}>{score} / {max}</Typography>
                </Box>
              ))}
              <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '12px', boxShadow: `2px 2px 0 ${P.purple.shadow}`, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: P.purple.shadow }}>Total Score</Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ color: P.purple.shadow }}>{scores.total} / 38</Typography>
              </Box>
            </Stack>
          </Box>

          {/* Instructor Message */}
          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage
              speaker="MS. MABROUKI"
              message={scores.passed
                ? "Fantastic work! You've successfully completed the B1 level remedial activities for advertising concepts. Your understanding of promotional materials, persuasive techniques, and advertising ethics is excellent. You're ready to move forward!"
                : "Good effort! You've made progress with advertising terminology, but let's practice a bit more to strengthen your B1 skills. Don't be discouraged - learning takes time and repetition. Review the video content and try again!"}
            />
          </Box>

          {/* Countdown */}
          <Box sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`, p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom sx={{ color: P.yellow.shadow }}>
              {scores.passed ? 'Proceeding to dashboard...' : 'Restarting B1 remedial activities...'}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: P.yellow.shadow }}>
              Redirecting in {countdown} seconds
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(10 - countdown) * 10}
              sx={{ height: 8, borderRadius: '999px', mb: 2, bgcolor: P.yellow.border, '& .MuiLinearProgress-bar': { bgcolor: P.yellow.shadow } }}
            />
            <Box component="button" onClick={handleRedirectNow} sx={{
              bgcolor: scores.passed ? P.green.bg : P.orange.bg,
              border: `2px solid ${scores.passed ? P.green.border : P.orange.border}`,
              borderRadius: '12px', boxShadow: `3px 3px 0 ${scores.passed ? P.green.shadow : P.orange.shadow}`,
              px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
              cursor: 'pointer', color: scores.passed ? P.green.shadow : P.orange.shadow,
              '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${scores.passed ? P.green.shadow : P.orange.shadow}` },
              '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${scores.passed ? P.green.shadow : P.orange.shadow}` }
            }}>
              {scores.passed ? 'Go to Dashboard Now' : 'Restart Now'}
            </Box>
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
