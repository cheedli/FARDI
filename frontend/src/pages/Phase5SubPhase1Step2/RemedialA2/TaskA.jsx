import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import DragDropMatchingGame from '../../../components/DragDropMatchingGame.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 5 Step 2 - Level A2 - Task A: Match Race
 * Match 6 crisis words to pictures/definitions
 */

const VOCABULARY_PAIRS = [
  { word: 'problem', definition: 'Something wrong' },
  { word: 'emergency', definition: 'Urgent' },
  { word: 'fix', definition: 'Make good' },
  { word: 'backup', definition: 'Extra' },
  { word: 'announce', definition: 'Tell' },
  { word: 'update', definition: 'New info' }
]

export default function Phase5Step2RemedialA2TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 2, interaction: 1, context: 'remedial_a2' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameResult, setGameResult] = useState(null)

  const handleGameComplete = async (result) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: result })
    setGameCompleted(true)
    setGameResult(result)
    const score = result.score || 0
    sessionStorage.setItem('phase5_step2_remedial_a2_taskA_score', score.toString())
    try {
      await phase5API.logRemedialActivity(2, 'A2', 'A', score, 6, result.timeTaken || 0)
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/1/step/2/remedial/a2/task/b')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>Step 2: Remedial Practice - Level A2</Typography>
        <Typography variant="h6" gutterBottom>Task A: Match Race</Typography>
        <Typography variant="body1">Match 6 crisis words to pictures/definitions</Typography>
      </Paper>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Match Race! Drag each crisis word to its matching definition. Match all 6 pairs correctly!" />
      </Paper>
      <Box>
        <DragDropMatchingGame pairs={VOCABULARY_PAIRS} duration={60} onComplete={handleGameComplete} />
        {gameCompleted && (
          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
            <Button variant="contained" color="success" onClick={handleContinue} size="large">Next: Task B →</Button>
          </Stack>
        )}
      </Box>
    </Box>
  )
}
