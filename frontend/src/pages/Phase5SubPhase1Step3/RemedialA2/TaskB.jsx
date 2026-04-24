import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import DragDropGapFill from '../../../components/DragDropGapFill.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
}

const TEMPLATES = [
  'It is ___.',
  'Use ___.',
  'We have ___.',
  '___ to everyone.',
  'Give ___.',
  '___ with team.',
  '___ the problem.',
  'Be ___.'
]
const ANSWERS = {
  'g_0_0': 'emergency', 'g_1_0': 'contingency', 'g_2_0': 'backup', 'g_3_0': 'announce',
  'g_4_0': 'update', 'g_5_0': 'communicate', 'g_6_0': 'fix', 'g_7_0': 'transparent'
}

export default function Phase5Step3RemedialA2TaskB() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase5/subphase/1/step/3/remedial/a2/task/c') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 3, interaction: 2, context: 'remedial_a2' })
  const [phase, setPhase] = useState(1)
  const [part1Score, setPart1Score] = useState(null)
  const [totalScore, setTotalScore] = useState(0)

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })

  const handlePart1Complete = (result) => setPart1Score(result.score)

  const handlePart2Complete = async (result) => {
    const finalScore = part1Score + result.score
    setTotalScore(finalScore)
    sessionStorage.setItem('phase5_step3_remedial_a2_taskB_score', finalScore.toString())
    try { await phase5API.logRemedialActivity(3, 'A2', 'B', finalScore, 8, 0) } catch (e) { console.error(e) }
  }

  const btnSx = (color, disabled = false) => ({
    width: '100%', bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '14px',
    boxShadow: `4px 4px 0 ${color.shadow}`, py: 1.5, cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: 'bold', fontSize: '1rem', color: color.border, opacity: disabled ? 0.5 : 1,
    '&:hover': !disabled ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${color.shadow}` } : {},
    transition: 'all 0.15s ease'
  })

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Phase 5: Execution &amp; Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 3: Remedial Practice - Level A2</Typography>
            <Typography variant="h6" gutterBottom sx={{ color: P.orange.border }}>Task B: Fill Quest</Typography>
            <Typography variant="body1" color="text.secondary">Fill in 8 gaps with crisis terms</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Fill Quest! Fill in the gaps to quest through levels. Correct answers advance you!" />
          </Box>
        </motion.div>
        {phase === 1 && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.blue.border, mb: 3 }}>Part 1: Fill in the first 4 sentences</Typography>
              <DragDropGapFill wordBank={['emergency', 'contingency', 'backup', 'announce']} sentences={TEMPLATES.slice(0, 4)} answers={Object.fromEntries(Object.entries(ANSWERS).slice(0, 4))} onComplete={handlePart1Complete} />
            </Box>
            {part1Score !== null && (
              <Box component="button" onClick={() => setPhase(2)} sx={btnSx(P.green)}>Next: Part 2 →</Box>
            )}
          </motion.div>
        )}
        {phase === 2 && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.blue.border, mb: 3 }}>Part 2: Fill in the next 4 sentences</Typography>
              <DragDropGapFill wordBank={['update', 'communicate', 'fix', 'transparent']} sentences={TEMPLATES.slice(4, 8)} answers={Object.fromEntries(Object.entries(ANSWERS).slice(4, 8))} onComplete={handlePart2Complete} startIndex={4} />
            </Box>
            {totalScore > 0 && (
              <Box component="button" onClick={() => setPhase(3)} sx={btnSx(P.green)}>View Results &amp; Continue →</Box>
            )}
          </motion.div>
        )}
        {phase === 3 && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), mb: 3, textAlign: 'center' }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.green.border }}>Task B Complete!</Typography>
              <Typography variant="h6" sx={{ mt: 2 }} color="text.secondary">Total Score: {totalScore} / 8</Typography>
            </Box>
            <Box component="button" onClick={() => navigate('/phase5/subphase/1/step/3/remedial/a2/task/c')} sx={btnSx(P.green)}>Next: Task C →</Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
