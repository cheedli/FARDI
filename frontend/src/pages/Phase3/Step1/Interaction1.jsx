import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import Avatar from '../../../components/Avatar.jsx'
import SimpleLineMatchingGame from '../../../components/SimpleLineMatchingGame.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import TimerIcon from '@mui/icons-material/Timer'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'

const LIGHT = {
  pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', divider: '#E0E0E0',
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
  teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
  orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
}
const DARK = {
  pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', divider: '#2A2A4A',
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
  orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' } }),
}

const clay = (c) => ({
  bgcolor: c.bg,
  border: `2px solid ${c.border}`,
  borderRadius: '20px',
  boxShadow: `4px 4px 0 ${c.shadow}`,
})

const MATCHING_PAIRS = [
  { term: 'sponsor',  example: 'Person or company giving money' },
  { term: 'budget',   example: 'Plan for spending money' },
  { term: 'cost',     example: 'Price of something' },
  { term: 'funding',  example: 'Money for a project' },
  { term: 'expense',  example: 'Money that is spent' },
  { term: 'donation', example: 'Money given for free' },
  { term: 'ticket',   example: 'Paid entry to event' },
  { term: 'profit',   example: 'Money left after costs' },
]

export default function Phase3Step1Interaction1() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const D = isDark ? DARK : LIGHT
  const { saveNow } = useProgressSave({ phase: 3, subphase: null, step: 1, interaction: 1, context: 'main' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameResult, setGameResult] = useState(null)

  const handleGameComplete = (result) => {
    console.log('Vocabulary Matching completed:', result)
    setGameCompleted(true)
    setGameResult(result)

    const score = result.score || 0
    const timeElapsed = result.timeElapsed || 0
    sessionStorage.setItem('phase3_step1_int1_score', score)
    sessionStorage.setItem('phase3_step1_int1_time', timeElapsed)

    logTaskCompletion(score, timeElapsed)
  }

  const logTaskCompletion = async (score, timeElapsed) => {
    saveNow({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction1', is_correct: true, score: score })
    try {
      const response = await fetch('/api/phase3/interaction/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ step: 1, interaction: 1, score, max_score: MATCHING_PAIRS.length, time_taken: timeElapsed, completed: true })
      })
      const data = await response.json()
      if (data.success) console.log('Interaction 1 completion logged to backend')
    } catch (error) {
      console.error('Failed to log interaction completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase3/step/1/interaction/2')
  }

  useEffect(() => { window.__remedialSkip = handleContinue }, [])

  const isPerfect = gameResult && gameResult.score === MATCHING_PAIRS.length
  const resultColor = isPerfect ? D.green : D.orange

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: D.pageBg }}>
      <Container maxWidth="md" sx={{ pt: { xs: 3, md: 4 }, pb: 6 }}>

        {/* Phase Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Box sx={{ ...clay(D.green), p: { xs: 2.5, md: 3 }, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <MonetizationOnIcon sx={{ fontSize: { xs: 32, md: 40 }, color: D.green.border }} />
            <Box>
              <Typography variant="h5" fontWeight={800} sx={{ color: D.heading, lineHeight: 1.2 }}>
                Sponsorship &amp; Budgeting Practice
              </Typography>
              <Typography variant="body2" sx={{ color: D.body, mt: 0.5 }}>
                Interaction 1: Vocabulary Matching
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Character Message */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Box sx={{ ...clay(D.blue), p: { xs: 2, md: 2.5 }, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Avatar character="SKANDER" size={48} />
              <Box>
                <Typography variant="caption" fontWeight={800} sx={{ color: D.blue.border, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Skander
                </Typography>
                <Typography variant="body1" sx={{ color: D.body, mt: 0.5 }}>
                  Welcome to Phase 3! Let's start with vocabulary. Match each sponsorship and budgeting term with its meaning by drawing lines. Click a term on the left, then click its matching definition on the right. The timer starts on your first click. Ready? Go!
                </Typography>
              </Box>
            </Box>
          </Box>
        </motion.div>

        {/* Matching Game */}
        {!gameCompleted && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
            <Box sx={{ ...clay(D.teal), p: { xs: 2, md: 2.5 }, mb: 3 }}>
              <SimpleLineMatchingGame pairs={MATCHING_PAIRS} onComplete={handleGameComplete} />
            </Box>
          </motion.div>
        )}

        {/* Results */}
        {gameCompleted && gameResult && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
            <Box sx={{ ...clay(resultColor), p: { xs: 2.5, md: 3 }, mb: 3, textAlign: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                <CheckCircleIcon sx={{ color: resultColor.border, fontSize: 32 }} />
                <Typography variant="h5" fontWeight={800} sx={{ color: D.heading }}>
                  {isPerfect ? 'Perfect Score!' : 'Great Job!'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 1, my: 2 }}>
                <Typography variant="h2" fontWeight={800} sx={{ color: resultColor.border }}>
                  {gameResult.score}
                </Typography>
                <Typography variant="h4" sx={{ color: D.muted }}>/</Typography>
                <Typography variant="h2" fontWeight={800} sx={{ color: D.muted }}>
                  {MATCHING_PAIRS.length}
                </Typography>
              </Box>

              <Typography variant="body2" fontWeight={600} sx={{ color: D.muted }}>Correct Matches</Typography>

              {gameResult.timeElapsed && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.75, mt: 2 }}>
                  <TimerIcon sx={{ fontSize: 18, color: D.muted }} />
                  <Typography variant="body2" sx={{ color: D.muted }}>
                    Time: <Box component="span" fontWeight={800} sx={{ color: D.body }}>{gameResult.timeElapsed.toFixed(1)}s</Box>
                  </Typography>
                </Box>
              )}

              {isPerfect && (
                <Box sx={{
                  display: 'inline-block', mt: 2,
                  px: 1.75, py: 0.4, borderRadius: '50px',
                  bgcolor: D.green.bg, border: `2px solid ${D.green.border}`,
                  fontSize: '0.8rem', fontWeight: 800, color: D.green.border,
                }}>
                  Excellent work!
                </Box>
              )}
            </Box>
          </motion.div>
        )}

        {/* Continue Button */}
        {gameCompleted && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Box
                component="button"
                onClick={handleContinue}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1,
                  px: 3, py: 1.25,
                  bgcolor: D.green.bg, color: D.green.border,
                  border: `2px solid ${D.green.border}`,
                  borderRadius: '14px',
                  boxShadow: `4px 4px 0 ${D.green.shadow}`,
                  fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.green.shadow}` },
                }}
              >
                Continue to Next Activity
                <ArrowForwardIcon fontSize="small" />
              </Box>
            </Box>
          </motion.div>
        )}

      </Container>
    </Box>
  )
}
