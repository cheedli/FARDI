import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import DragDropMatchingGame from '../../../components/DragDropMatchingGame.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' } }
const DARK = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' } }

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
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameResult, setGameResult] = useState(null)

  const clay = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })

  const handleGameComplete = async (result) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: result })
    setGameCompleted(true); setGameResult(result)
    const score = result.score || 0
    sessionStorage.setItem('phase5_step4_remedial_b2_taskC_score', score.toString())
    try { await phase5API.logRemedialActivity(4, 'B2', 'C', score, 8, result.timeTaken || 0) } catch (e) { console.error(e) }
  }

  const handleContinue = () => { navigate('/phase5/subphase/1/step/4/remedial/b2/task/d') }
  window.__remedialSkip = handleContinue

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Phase 5: Execution & Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 4: Remedial Practice - Level B2</Typography>
            <Typography variant="h6" gutterBottom sx={{ color: P.orange.border }}>Task C: Matching Game</Typography>
            <Typography variant="body1">Match 8 terms to definitions</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...clay(P.teal), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Matching Game! Match each term to its definition. Drag and drop to make the matches!" />
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Box>
            <DragDropMatchingGame pairs={MATCHING_PAIRS} duration={120} onComplete={handleGameComplete} />
            {gameCompleted && (
              <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
                <Box component="button" onClick={handleContinue} sx={{ ...clay(P.green), cursor: 'pointer', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s' }}>
                  <Typography variant="button" fontWeight="bold" sx={{ color: P.green.border }}>Next: Task D →</Typography>
                </Box>
              </Stack>
            )}
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}
