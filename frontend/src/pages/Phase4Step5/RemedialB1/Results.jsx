import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Paper, Typography, Button, Stack, LinearProgress, Divider,
  Avatar, Chip, useTheme
} from '@mui/material'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import RefreshIcon from '@mui/icons-material/Refresh'
import DashboardIcon from '@mui/icons-material/Dashboard'

/**
 * Phase 4 Step 5 - Remedial B1 - Results Page
 * Clean redesign with clear score breakdown and explicit user action
 */

const TASKS = [
  { key: 'taskA', label: 'Negotiation Battle', icon: '⚔️', max: 4 },
  { key: 'taskB', label: 'Definition Duel', icon: '🥊', max: 8 },
  { key: 'taskC', label: 'Wordshake Quiz', icon: '🎮', max: 6 },
  { key: 'taskD', label: 'Quizlet Flashcards', icon: '🃏', max: 8 },
  { key: 'taskE', label: 'Tense Time Travel', icon: '⏰', max: 6 },
  { key: 'taskF', label: 'Grammar Kahoot', icon: '🎯', max: 6 },
]
const MAX_TOTAL = 38
const PASS_THRESHOLD = 31

export default function Phase4Step5RemedialB1Results() {
  const navigate = useNavigate()
  const theme = useTheme()
  const [loading, setLoading] = useState(true)
  const [scores, setScores] = useState(null)

  useEffect(() => {
    calculateFinalScore()
  }, [])

  const calculateFinalScore = async () => {
    const taskScores = {}
    let total = 0
    TASKS.forEach(t => {
      const s = parseInt(sessionStorage.getItem(`phase4_step5_remedial_b1_${t.key}_score`) || '0')
      taskScores[t.key] = s
      total += s
    })
    const passed = total >= PASS_THRESHOLD

    try {
      await fetch('/api/phase4/step5/remedial/b1/final-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          task_a_score: taskScores.taskA,
          task_b_score: taskScores.taskB,
          task_c_score: taskScores.taskC,
          task_d_score: taskScores.taskD,
          task_e_score: taskScores.taskE,
          task_f_score: taskScores.taskF,
        })
      })
    } catch (err) {
      console.error('Failed to log final score:', err)
    }

    setScores({ ...taskScores, total, passed })
    setLoading(false)
  }

  const handleContinue = () => {
    TASKS.forEach(t => sessionStorage.removeItem(`phase4_step5_remedial_b1_${t.key}_score`))
    navigate(scores.passed ? '/phase4/complete' : '/phase4/step/5/remedial/b1/taskA')
  }

  if (loading) {
    return (
      <Box sx={{ maxWidth: 700, mx: 'auto', p: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>Calculating your results...</Typography>
        <LinearProgress sx={{ mt: 2, borderRadius: 1 }} />
      </Box>
    )
  }

  const percentage = Math.round((scores.total / MAX_TOTAL) * 100)
  const passed = scores.passed

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', p: { xs: 2, sm: 4 } }}>

      {/* Hero banner */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 5 },
          mb: 3,
          borderRadius: 3,
          textAlign: 'center',
          background: passed
            ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
            : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
        }}
      >
        <Avatar
          sx={{
            width: { xs: 72, sm: 96 },
            height: { xs: 72, sm: 96 },
            mx: 'auto',
            mb: 2,
            bgcolor: 'rgba(255,255,255,0.2)',
            fontSize: { xs: '2.5rem', sm: '3rem' }
          }}
        >
          {passed ? '🏆' : '💪'}
        </Avatar>

        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '1.6rem', sm: '2.2rem' } }}>
          {passed ? 'Level Cleared!' : 'Keep Going!'}
        </Typography>

        <Box sx={{ mb: 1 }}>
          <Typography component="span" variant="h2" fontWeight="black" sx={{ fontSize: { xs: '3.5rem', sm: '5rem' }, lineHeight: 1 }}>
            {scores.total}
          </Typography>
          <Typography component="span" variant="h5" sx={{ opacity: 0.7, ml: 1 }}>
            / {MAX_TOTAL}
          </Typography>
        </Box>

        <Chip
          label={`${percentage}% — ${passed ? 'PASSED' : 'NOT PASSED'}`}
          sx={{
            bgcolor: 'rgba(255,255,255,0.25)',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            height: 30
          }}
        />

        <Typography variant="body1" sx={{ mt: 2, opacity: 0.9, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
          {passed
            ? "Excellent work! You've mastered B1 spelling and grammar evaluation."
            : `You need ${PASS_THRESHOLD} points to pass (${PASS_THRESHOLD - scores.total} more needed).`}
        </Typography>
      </Paper>

      {/* Score progress bar */}
      <Paper elevation={1} sx={{ p: { xs: 2, sm: 2.5 }, mb: 3, borderRadius: 2 }}>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="body2" color="text.secondary">Your score</Typography>
          <Typography variant="body2" color="text.secondary">Pass line: {PASS_THRESHOLD}</Typography>
        </Stack>
        <Box sx={{ position: 'relative' }}>
          <LinearProgress
            variant="determinate"
            value={percentage}
            sx={{
              height: 14,
              borderRadius: 7,
              bgcolor: 'action.disabledBackground',
              '& .MuiLinearProgress-bar': {
                borderRadius: 7,
                background: passed
                  ? 'linear-gradient(90deg, #11998e, #38ef7d)'
                  : 'linear-gradient(90deg, #f093fb, #f5576c)'
              }
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: -3,
              left: `${(PASS_THRESHOLD / MAX_TOTAL) * 100}%`,
              width: 2,
              height: 20,
              bgcolor: theme.palette.text.primary,
              borderRadius: 1,
              transform: 'translateX(-50%)',
              opacity: 0.5
            }}
          />
        </Box>
      </Paper>

      {/* Task breakdown */}
      <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}>
        <Box sx={{ px: 2.5, py: 1.5, bgcolor: 'background.default', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle1" fontWeight="bold">Score Breakdown</Typography>
        </Box>

        {TASKS.map((task, idx) => {
          const s = scores[task.key]
          const pct = Math.round((s / task.max) * 100)
          const good = pct >= 75
          return (
            <Box key={task.key}>
              <Box sx={{ px: 2.5, py: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontSize: '1.3rem', lineHeight: 1, flexShrink: 0 }}>{task.icon}</Typography>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" fontWeight={600} noWrap sx={{ mr: 1 }}>{task.label}</Typography>
                    <Typography variant="body2" fontWeight="bold" color={good ? 'success.main' : 'warning.main'} sx={{ flexShrink: 0 }}>
                      {s}/{task.max}
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={pct}
                    sx={{
                      mt: 0.5,
                      height: 5,
                      borderRadius: 3,
                      bgcolor: 'action.disabledBackground',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 3,
                        bgcolor: good ? 'success.main' : 'warning.main'
                      }
                    }}
                  />
                </Box>
                {good
                  ? <CheckCircleIcon sx={{ color: 'success.main', fontSize: 18, flexShrink: 0 }} />
                  : <CancelIcon sx={{ color: 'warning.main', fontSize: 18, flexShrink: 0 }} />
                }
              </Box>
              {idx < TASKS.length - 1 && <Divider />}
            </Box>
          )
        })}

        <Divider />
        <Box sx={{ px: 2.5, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" fontWeight="bold">Total</Typography>
          <Chip
            label={`${scores.total} / ${MAX_TOTAL}`}
            color={passed ? 'success' : 'error'}
            sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}
          />
        </Box>
      </Paper>

      {/* Result message */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: 2,
          bgcolor: passed ? 'success.lighter' : 'warning.lighter',
          border: '1px solid',
          borderColor: passed ? 'success.light' : 'warning.light'
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          {passed
            ? <EmojiEventsIcon sx={{ color: 'success.main', flexShrink: 0 }} />
            : <RefreshIcon sx={{ color: 'warning.main', flexShrink: 0 }} />
          }
          <Box>
            <Typography variant="subtitle2" fontWeight="bold" color={passed ? 'success.dark' : 'warning.dark'}>
              {passed ? 'You passed!' : 'Almost there — try again!'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {passed
                ? "Great job mastering B1 evaluation skills. You're ready to move forward!"
                : 'Review tasks with scores below 75% and retry. You can do it!'}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* CTA */}
      <Button
        variant="contained"
        size="large"
        fullWidth
        startIcon={passed ? <DashboardIcon /> : <RefreshIcon />}
        onClick={handleContinue}
        sx={{
          py: 1.75,
          fontWeight: 'bold',
          fontSize: '1rem',
          borderRadius: 2,
          background: passed
            ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
            : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
          '&:hover': {
            background: passed
              ? 'linear-gradient(135deg, #0d7a6f 0%, #2fd669 100%)'
              : 'linear-gradient(135deg, #d97de0 0%, #d63d57 100%)'
          }
        }}
      >
        {passed ? 'Go to Dashboard' : 'Try Again from Task A'}
      </Button>
    </Box>
  )
}
