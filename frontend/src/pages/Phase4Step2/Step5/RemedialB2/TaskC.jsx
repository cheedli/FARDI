import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import SimpleLineMatchingGame from '../../../../components/SimpleLineMatchingGame.jsx'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 5 - Level B2 - Task C: Match Master
 */

const MATCHING_PAIRS = [
  { term: '"hashteg"', example: 'Spelling error' },
  { term: '"We has"', example: 'Grammar error' },
  { term: '"very good"', example: 'Vocabulary' },
  { term: '"you coming?"', example: 'Tone' },
  { term: '"Music food dance"', example: 'Coherence' },
  { term: '"#Festivel"', example: 'Hashtag error' },
  { term: '":-)"', example: 'Emoji' },
  { term: '"Click here"', example: 'CTA' }
]

export default function Phase4_2Step5RemedialB2TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 3, context: 'remedial_b2' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameResult, setGameResult] = useState(null)

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

  const handleGameComplete = (result) => {
    console.log('Match Master completed:', result)
    setGameCompleted(true)
    setGameResult(result)
    const score = result.score || 0
    sessionStorage.setItem('phase4_2_step5_remedial_b2_taskC_score', score)
    logTaskCompletion(score, result.timeElapsed)
  }

  const logTaskCompletion = async (score, timeElapsed) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: score })
    try {
      const response = await fetch('/api/phase4/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 5, level: 'B2', task: 'C', score: score, max_score: MATCHING_PAIRS.length, time_taken: timeElapsed, completed: true })
      })
      const data = await response.json()
      if (data.success) console.log('Task C completion logged to backend')
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => navigate('/app/phase4_2/step/5/remedial/b2/taskd')

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          <Box sx={{ bgcolor: P.red.bg, border: `2px solid ${P.red.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.red.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.red.shadow }}>
              Phase 4.2 - Step 5: Remedial Activities
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.red.border }}>
              Level B2 - Task C: Error Type Match Master
            </Typography>
            <Typography variant="body1">Match error examples with their error types as fast as you can!</Typography>
          </Box>

          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Final challenge! Match each error example with its error type by drawing lines. Click an error on the left, then click its matching type on the right. Watch the line appear! The timer starts on your first click. This will help you identify different kinds of mistakes in social media posts. Go!"
            />
          </Box>

          {!gameCompleted && (
            <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
              <SimpleLineMatchingGame
                pairs={MATCHING_PAIRS}
                onComplete={handleGameComplete}
                leftTitle="Error Examples"
                rightTitle="Error Types"
                leftColor={P.red.bg}
                rightColor={P.blue.bg}
              />
            </Box>
          )}

          {gameCompleted && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
              <Box component="button" onClick={handleContinue} sx={{
                bgcolor: P.red.bg, border: `2px solid ${P.red.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.red.shadow}`,
                px: 6, py: 2, fontWeight: 700, fontSize: '1.1rem',
                cursor: 'pointer', color: P.red.shadow,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.red.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.red.shadow}` }
              }}>
                Continue to Task D →
              </Box>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
