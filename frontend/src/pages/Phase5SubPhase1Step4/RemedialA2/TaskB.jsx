import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import DragDropGapFill from '../../../components/DragDropGapFill.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' } }
const DARK = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' } }

const TEMPLATES = ['It is ___.', 'Use ___.', 'We ___.', 'Give ___.', '___ lights.', 'The ___ is lights.', 'Find ___.', '___ with team.']
const ANSWERS = { 'g_0_0': 'emergency', 'g_1_0': 'backup', 'g_2_0': 'announce', 'g_3_0': 'update', 'g_4_0': 'fix', 'g_5_0': 'problem', 'g_6_0': 'solution', 'g_7_0': 'communicate' }

export default function Phase5Step4RemedialA2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 4, interaction: 2, context: 'remedial_a2' })
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const [phase, setPhase] = useState(1)
  const [part1Score, setPart1Score] = useState(null)
  const [totalScore, setTotalScore] = useState(0)

  const clay = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })

  const handlePart1Complete = (result) => { setPart1Score(result.score) }
  const handlePart2Complete = async (result) => {
    const finalScore = part1Score + result.score
    setTotalScore(finalScore)
    sessionStorage.setItem('phase5_step4_remedial_a2_taskB_score', finalScore.toString())
    try { await phase5API.logRemedialActivity(4, 'A2', 'B', finalScore, 8, 0) } catch (e) { console.error(e) }
  }
  const handleFinishTaskB = () => { setPhase(3) }
  const handleNextToPart2 = () => { setPhase(2) }
  const handleContinue = () => { navigate('/phase5/subphase/1/step/4/remedial/a2/task/c') }
  window.__remedialSkip = handleContinue

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Phase 5: Execution & Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 4: Remedial Practice - Level A2</Typography>
            <Typography variant="h6" gutterBottom sx={{ color: P.orange.border }}>Task B: Fill Quest</Typography>
            <Typography variant="body1">Fill in 8 gaps with crisis terms</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...clay(P.teal), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Fill Quest! Fill in the gaps to quest through levels. Correct answers advance you!" />
          </Box>
        </motion.div>
        {phase === 1 && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Box>
              <Box sx={{ ...clay(P.blue), mb: 3 }}>
                <Typography variant="h6" sx={{ color: P.blue.border, mb: 3 }}>Part 1: Fill in the first 4 sentences</Typography>
                <DragDropGapFill wordBank={['emergency', 'backup', 'announce', 'update']} sentences={TEMPLATES.slice(0, 4)} answers={Object.fromEntries(Object.entries(ANSWERS).slice(0, 4))} onComplete={handlePart1Complete} />
              </Box>
              {part1Score !== null && (
                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                  <Box component="button" onClick={handleNextToPart2} sx={{ ...clay(P.green), cursor: 'pointer', px: 3, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s' }}>
                    <Typography variant="button" fontWeight="bold" sx={{ color: P.green.border }}>Next: Part 2 →</Typography>
                  </Box>
                </Stack>
              )}
            </Box>
          </motion.div>
        )}
        {phase === 2 && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box>
              <Box sx={{ ...clay(P.blue), mb: 3 }}>
                <Typography variant="h6" sx={{ color: P.blue.border, mb: 3 }}>Part 2: Fill in the next 4 sentences</Typography>
                <DragDropGapFill wordBank={['fix', 'problem', 'solution', 'communicate']} sentences={TEMPLATES.slice(4, 8)} answers={Object.fromEntries(Object.entries(ANSWERS).slice(4, 8))} onComplete={handlePart2Complete} startIndex={4} />
              </Box>
              {totalScore > 0 && (
                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                  <Box component="button" onClick={handleFinishTaskB} sx={{ ...clay(P.green), cursor: 'pointer', px: 3, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s' }}>
                    <Typography variant="button" fontWeight="bold" sx={{ color: P.green.border }}>View Results & Continue →</Typography>
                  </Box>
                </Stack>
              )}
            </Box>
          </motion.div>
        )}
        {phase === 3 && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...clay(P.green), mb: 3, textAlign: 'center' }}>
              <Typography variant="h5" sx={{ color: P.green.border }} gutterBottom>✓ Task B Complete!</Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>Total Score: {totalScore} / 8</Typography>
            </Box>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Box component="button" onClick={handleContinue} sx={{ ...clay(P.green), cursor: 'pointer', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s' }}>
                <Typography variant="button" fontWeight="bold" sx={{ color: P.green.border }}>Next: Task C →</Typography>
              </Box>
            </Stack>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
