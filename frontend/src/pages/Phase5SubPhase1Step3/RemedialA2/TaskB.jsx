import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import DragDropGapFill from '../../../components/DragDropGapFill.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

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
  'g_0_0': 'emergency',
  'g_1_0': 'contingency',
  'g_2_0': 'backup',
  'g_3_0': 'announce',
  'g_4_0': 'update',
  'g_5_0': 'communicate',
  'g_6_0': 'fix',
  'g_7_0': 'transparent'
}

export default function Phase5Step3RemedialA2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 3, interaction: 2, context: 'remedial_a2' })
  const [phase, setPhase] = useState(1)
  const [part1Score, setPart1Score] = useState(null)
  const [totalScore, setTotalScore] = useState(0)

  const handlePart1Complete = (result) => {
    setPart1Score(result.score)
  }

  const handlePart2Complete = async (result) => {
    const finalScore = part1Score + result.score
    setTotalScore(finalScore)
    sessionStorage.setItem('phase5_step3_remedial_a2_taskB_score', finalScore.toString())
    try {
      await phase5API.logRemedialActivity(3, 'A2', 'B', finalScore, 8, 0)
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
    navigate('/phase5/subphase/1/step/3/remedial/a2/task/c')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>Step 3: Remedial Practice - Level A2</Typography>
        <Typography variant="h6" gutterBottom>Task B: Fill Quest</Typography>
        <Typography variant="body1">Fill in 8 gaps with crisis terms</Typography>
      </Paper>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Fill Quest! Fill in the gaps to quest through levels. Correct answers advance you!" />
      </Paper>
      {phase === 1 && (
        <Box>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" color="primary" gutterBottom sx={{ mb: 3 }}>Part 1: Fill in the first 4 sentences</Typography>
            <DragDropGapFill wordBank={['emergency', 'contingency', 'backup', 'announce']} sentences={TEMPLATES.slice(0, 4)} answers={Object.fromEntries(Object.entries(ANSWERS).slice(0, 4))} onComplete={handlePart1Complete} />
          </Paper>
          {part1Score !== null && (
            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
              <Button variant="contained" color="success" size="large" onClick={handleNextToPart2} sx={{ px: 6 }}>Next: Part 2 →</Button>
            </Stack>
          )}
        </Box>
      )}
      {phase === 2 && (
        <Box>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" color="primary" gutterBottom sx={{ mb: 3 }}>Part 2: Fill in the next 4 sentences</Typography>
            <DragDropGapFill wordBank={['update', 'communicate', 'fix', 'transparent']} sentences={TEMPLATES.slice(4, 8)} answers={Object.fromEntries(Object.entries(ANSWERS).slice(4, 8))} onComplete={handlePart2Complete} startIndex={4} />
          </Paper>
          {totalScore > 0 && (
            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
              <Button variant="contained" color="success" size="large" onClick={handleFinishTaskB} sx={{ px: 6 }}>View Results & Continue →</Button>
            </Stack>
          )}
        </Box>
      )}
      {phase === 3 && (
        <>
          <Paper elevation={3} sx={{ p: 4, mb: 3, backgroundColor: 'success.lighter', textAlign: 'center' }}>
            <Typography variant="h5" color="success.dark" gutterBottom>✓ Task B Complete!</Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>Total Score: {totalScore} / 8</Typography>
          </Paper>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="contained" color="success" onClick={handleContinue} size="large">Next: Task C →</Button>
          </Stack>
        </>
      )}
    </Box>
  )
}
