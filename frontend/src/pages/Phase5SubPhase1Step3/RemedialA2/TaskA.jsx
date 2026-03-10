import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import DragDropMatchingGame from '../../../components/DragDropMatchingGame.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 5 Step 3 - Level A2 - Task A: Term Treasure Hunt
 * Match 8 crisis communication terms to simple definitions
 */

const VOCABULARY_PAIRS = [
  { word: 'emergency', definition: 'Big problem' },
  { word: 'contingency', definition: 'Extra plan' },
  { word: 'backup', definition: 'Other thing' },
  { word: 'announce', definition: 'Tell people' },
  { word: 'update', definition: 'New information' },
  { word: 'communicate', definition: 'Talk' },
  { word: 'fix', definition: 'Make good' },
  { word: 'transparent', definition: 'Tell truth' }
]

export default function Phase5Step3RemedialA2TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 3, interaction: 1, context: 'remedial_a2' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameResult, setGameResult] = useState(null)

  const handleGameComplete = async (result) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: result })
    setGameCompleted(true)
    setGameResult(result)
    const score = result.score || 0
    sessionStorage.setItem('phase5_step3_remedial_a2_taskA_score', score.toString())
    try {
      await phase5API.logRemedialActivity(3, 'A2', 'A', score, 8, result.timeTaken || 0)
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/1/step/3/remedial/a2/task/b')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>Step 3: Remedial Practice - Level A2</Typography>
        <Typography variant="h6" gutterBottom>Task A: Term Treasure Hunt</Typography>
        <Typography variant="body1">Match 8 crisis communication terms to simple definitions</Typography>
      </Paper>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Term Treasure Hunt! Drag each term to its matching definition. Correct matches unlock gems!" />
      </Paper>
      <Box>
        <DragDropMatchingGame pairs={VOCABULARY_PAIRS} duration={120} onComplete={handleGameComplete} />
        {gameCompleted && (
          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
            <Button variant="contained" color="success" onClick={handleContinue} size="large">Next: Task B →</Button>
          </Stack>
        )}
      </Box>
    </Box>
  )
}
