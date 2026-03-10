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
  'We ___.',
  'Give ___.',
  '___ now.',
  'The ___ is lights.',
  'Find ___.',
  'Be ___.'
]

const ANSWERS = {
  'g_0_0': 'emergency',
  'g_1_0': 'backup',
  'g_2_0': 'announce',
  'g_3_0': 'update',
  'g_4_0': 'fix',
  'g_5_0': 'problem',
  'g_6_0': 'solution',
  'g_7_0': 'transparent'
}

export default function Phase5Step5RemedialA2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 5, interaction: 2, context: 'remedial_a2' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameResult, setGameResult] = useState(null)

  const handleGameComplete = async (result) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score: result })
    setGameCompleted(true)
    setGameResult(result)
    const score = result.score || 0
    sessionStorage.setItem('phase5_step5_remedial_a2_taskB_score', score.toString())
    try {
      await phase5API.logRemedialActivity(5, 'A2', 'B', score, 8, result.timeTaken || 0)
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/1/step/5/remedial/a2/task/c')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>Step 5: Remedial Practice - Level A2</Typography>
        <Typography variant="h6" gutterBottom>Task B: Fill Quest</Typography>
        <Typography variant="body1">Fill 8 spelling-corrected gaps</Typography>
      </Paper>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Fill Quest! Fill in the gaps with correctly spelled words from the word bank!" />
      </Paper>
      <Box>
        <DragDropGapFill wordBank={['emergency', 'backup', 'announce', 'update', 'fix', 'problem', 'solution', 'transparent']} sentences={TEMPLATES} answers={ANSWERS} onComplete={handleGameComplete} />
        {gameCompleted && (
          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
            <Button variant="contained" color="success" onClick={handleContinue} size="large">Next: Task C →</Button>
          </Stack>
        )}
      </Box>
    </Box>
  )
}
