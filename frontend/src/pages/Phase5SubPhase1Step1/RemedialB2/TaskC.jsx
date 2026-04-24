import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import DragDropMatchingGame from '../../../components/DragDropMatchingGame.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
}

const MATCHING_PAIRS = [
  { word: 'alternative', definition: 'Another singer' },
  { word: 'urgent', definition: 'Do now' },
  { word: 'solution', definition: 'Fix problem' },
  { word: 'sorry', definition: 'Apology' },
  { word: 'fix', definition: 'Solve' },
  { word: 'change', definition: 'New time' },
  { word: 'backup', definition: 'Extra plan' },
  { word: 'update', definition: 'New information' }
]

export default function Phase5Step1RemedialB2TaskC() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase5/subphase/1/step/1/remedial/b2/task/d') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 1, interaction: 3, context: 'remedial_b2' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameResult, setGameResult] = useState(null)

  const handleGameComplete = async (result) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: result })
    setGameCompleted(true)
    setGameResult(result)
    const score = result.score || 0
    sessionStorage.setItem('phase5_step1_remedial_b2_taskC_score', score.toString())
    try {
      await phase5API.logRemedialActivity(1, 'B2', 'C', score, 8, result.timeTaken || 0)
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/1/step/1/remedial/b2/task/d')
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{
            bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
            p: 3, mb: 3
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Phase 5: Execution & Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.shadow }}>Step 1: Remedial Practice - Level B2</Typography>
            <Typography variant="h6" gutterBottom fontWeight="bold">Task C: Kahoot Match</Typography>
            <Typography variant="body1">Match 8 terms to scenarios</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3
          }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Kahoot Match! Match each term to its scenario. Drag and drop to make the matches!" />
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Box>
            <DragDropMatchingGame pairs={MATCHING_PAIRS} duration={120} onComplete={handleGameComplete} />
            {gameCompleted && (
              <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
                <Box
                  component="button"
                  onClick={handleContinue}
                  sx={{
                    bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                    borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
                    px: 4, py: 1.5, fontSize: '1rem', fontWeight: 'bold',
                    color: P.green.shadow, cursor: 'pointer',
                    transition: 'all 0.15s',
                    '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }
                  }}
                >
                  Next: Task D →
                </Box>
              </Stack>
            )}
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}
