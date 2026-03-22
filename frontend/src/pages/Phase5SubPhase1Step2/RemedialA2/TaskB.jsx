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
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
}

const TEMPLATES = [
  'Lights ___.',
  'It is ___.',
  'We ___.',
  'Use ___.',
  '___ now.',
  'Give ___.'
]

const ANSWERS = {
  'g_0_0': 'problem',
  'g_1_0': 'emergency',
  'g_2_0': 'fix',
  'g_3_0': 'backup',
  'g_4_0': 'announce',
  'g_5_0': 'update'
}

export default function Phase5Step2RemedialA2TaskB() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 2, interaction: 2, context: 'remedial_a2' })
  const [phase, setPhase] = useState(1)
  const [part1Score, setPart1Score] = useState(null)
  const [totalScore, setTotalScore] = useState(0)

  const cardSx = (color) => ({
    bgcolor: color.bg,
    border: `2px solid ${color.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${color.shadow}`,
    p: 3,
  })

  const handlePart1Complete = (result) => {
    setPart1Score(result.score)
  }

  const handlePart2Complete = async (result) => {
    const finalScore = part1Score + result.score
    setTotalScore(finalScore)
    sessionStorage.setItem('phase5_step2_remedial_a2_taskB_score', finalScore.toString())
    try {
      await phase5API.logRemedialActivity(2, 'A2', 'B', finalScore, 6, 0)
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleFinishTaskB = () => {
    setPhase(3)
  }

  const handleNextToPart2 = () => {
    setPhase(2)
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/1/step/2/remedial/a2/task/c')
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>
              Phase 5: Execution &amp; Problem-Solving
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>
              Step 2: Remedial Practice - Level A2
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ color: P.orange.border }}>Task B: Fill Frenzy</Typography>
            <Typography variant="body1" color="text.secondary">Fill 6 gaps with crisis words</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Fill Frenzy! Fill in the missing words. Drag and drop words from the word bank!" />
          </Box>
        </motion.div>

        {phase === 1 && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.blue.border, mb: 3 }}>
                Part 1: Fill in the first 3 sentences
              </Typography>
              <DragDropGapFill wordBank={['problem', 'emergency', 'fix']} sentences={TEMPLATES.slice(0, 3)} answers={Object.fromEntries(Object.entries(ANSWERS).slice(0, 3))} onComplete={handlePart1Complete} />
            </Box>
            {part1Score !== null && (
              <Box
                component="button"
                onClick={handleNextToPart2}
                sx={{
                  width: '100%',
                  bgcolor: P.green.bg,
                  border: `2px solid ${P.green.border}`,
                  borderRadius: '14px',
                  boxShadow: `4px 4px 0 ${P.green.shadow}`,
                  py: 1.5,
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  color: P.green.border,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s ease',
                }}
              >
                Next: Part 2 →
              </Box>
            )}
          </motion.div>
        )}

        {phase === 2 && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.blue.border, mb: 3 }}>
                Part 2: Fill in the next 3 sentences
              </Typography>
              <DragDropGapFill wordBank={['backup', 'announce', 'update']} sentences={TEMPLATES.slice(3, 6)} answers={Object.fromEntries(Object.entries(ANSWERS).slice(3, 6))} onComplete={handlePart2Complete} startIndex={3} />
            </Box>
            {totalScore > 0 && (
              <Box
                component="button"
                onClick={handleFinishTaskB}
                sx={{
                  width: '100%',
                  bgcolor: P.green.bg,
                  border: `2px solid ${P.green.border}`,
                  borderRadius: '14px',
                  boxShadow: `4px 4px 0 ${P.green.shadow}`,
                  py: 1.5,
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  color: P.green.border,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s ease',
                }}
              >
                View Results &amp; Continue →
              </Box>
            )}
          </motion.div>
        )}

        {phase === 3 && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), mb: 3, textAlign: 'center' }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.green.border }}>Task B Complete!</Typography>
              <Typography variant="h6" sx={{ mt: 2 }} color="text.secondary">Total Score: {totalScore} / 6</Typography>
            </Box>
            <Box
              component="button"
              onClick={handleContinue}
              sx={{
                width: '100%',
                bgcolor: P.green.bg,
                border: `2px solid ${P.green.border}`,
                borderRadius: '14px',
                boxShadow: `4px 4px 0 ${P.green.shadow}`,
                py: 1.5,
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem',
                color: P.green.border,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                transition: 'all 0.15s ease',
              }}
            >
              Next: Task C →
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
