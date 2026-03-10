import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import DragDropMatchingGame from '../../../components/DragDropMatchingGame.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const ERROR_PAIRS = [
  { word: 'Emergancy', definition: 'Spelling: emergency' },
  { word: 'Backup are', definition: 'Agreement: Backup is' },
  { word: 'We fix', definition: 'Tense: We are fixing' },
  { word: 'Announce people', definition: 'Structure: Announce to people' },
  { word: 'Thank you wait', definition: 'Politeness: Thank you for waiting' },
  { word: 'Festival ok', definition: 'Vocabulary: Festival is on schedule' },
  { word: 'Update later', definition: 'Coherence: We will provide updates' },
  { word: 'Sorry problem', definition: 'Tone: We apologize for the inconvenience' }
]

export default function Phase5Step5RemedialB2TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 5, interaction: 3, context: 'remedial_b2' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameResult, setGameResult] = useState(null)

  const handleGameComplete = async (result) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: result })
    setGameCompleted(true)
    setGameResult(result)
    const score = result.score || 0
    sessionStorage.setItem('phase5_step5_remedial_b2_taskC_score', score.toString())
    try {
      await phase5API.logRemedialActivity(5, 'B2', 'C', score, 8, result.timeTaken || 0)
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = async () => {
    const taskAScore = parseInt(sessionStorage.getItem('phase5_step5_remedial_b2_taskA_score') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('phase5_step5_remedial_b2_taskB_score') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('phase5_step5_remedial_b2_taskC_score') || '0')
    const totalScore = taskAScore + taskBScore + taskCScore
    const maxScore = 2 + 5 + 8
    const threshold = Math.ceil(maxScore * 0.8)
    const passed = totalScore >= threshold

    try {
      await phase5API.calculateRemedialScore(5, 'B2', {
        task_a_score: taskAScore, task_b_score: taskBScore, task_c_score: taskCScore
      })
    } catch (error) {
      console.error('Failed to log final score:', error)
    }

    if (passed) {
      navigate('/dashboard')
    } else {
      navigate('/phase5/subphase/1/step/5/remedial/b2/task/a')
    }
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>Step 5: Remedial Practice - Level B2</Typography>
        <Typography variant="h6" gutterBottom>Task C: Matching Game</Typography>
        <Typography variant="body1">Match 8 error types to corrections</Typography>
      </Paper>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Matching Game! Match each error to its correction type and fix!" />
      </Paper>
      <Box>
        <DragDropMatchingGame pairs={ERROR_PAIRS} duration={120} onComplete={handleGameComplete} />
        {gameCompleted && (
          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
            <Button variant="contained" color="success" onClick={handleContinue} size="large">Continue to Final Results →</Button>
          </Stack>
        )}
      </Box>
    </Box>
  )
}
