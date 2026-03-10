import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import DragDropMatchingGame from '../../../components/DragDropMatchingGame.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const MATCHING_PAIRS = [
  { word: 'emergency', definition: 'Urgent issue' },
  { word: 'contingency', definition: 'Backup plan' },
  { word: 'backup', definition: 'Reserve resource' },
  { word: 'announce', definition: 'Public notice' },
  { word: 'update', definition: 'Progress info' },
  { word: 'communicate', definition: 'Clear exchange' },
  { word: 'resolve', definition: 'Solve' },
  { word: 'transparent', definition: 'Honest' }
]

export default function Phase5Step4RemedialB2TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 4, interaction: 3, context: 'remedial_b2' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameResult, setGameResult] = useState(null)

  const handleGameComplete = async (result) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: result })
    setGameCompleted(true)
    setGameResult(result)
    const score = result.score || 0
    sessionStorage.setItem('phase5_step4_remedial_b2_taskC_score', score.toString())
    try {
      await phase5API.logRemedialActivity(4, 'B2', 'C', score, 8, result.timeTaken || 0)
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/1/step/4/remedial/b2/task/d')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>Step 4: Remedial Practice - Level B2</Typography>
        <Typography variant="h6" gutterBottom>Task C: Matching Game</Typography>
        <Typography variant="body1">Match 8 terms to definitions</Typography>
      </Paper>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Matching Game! Match each term to its definition. Drag and drop to make the matches!" />
      </Paper>
      <Box>
        <DragDropMatchingGame pairs={MATCHING_PAIRS} duration={120} onComplete={handleGameComplete} />
        {gameCompleted && (
          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
            <Button variant="contained" color="success" onClick={handleContinue} size="large">Next: Task D →</Button>
          </Stack>
        )}
      </Box>
    </Box>
  )
}
