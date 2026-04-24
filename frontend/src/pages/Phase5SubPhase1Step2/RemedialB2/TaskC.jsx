import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import DragDropMatchingGame from '../../../components/DragDropMatchingGame.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
}

const MATCHING_PAIRS = [
  { word: 'emergency', definition: 'Urgent issue' },
  { word: 'backup', definition: 'Extra plan' },
  { word: 'announce', definition: 'Inform' },
  { word: 'update', definition: 'New info' },
  { word: 'communicate', definition: 'Share' },
  { word: 'fix', definition: 'Resolve' },
  { word: 'solution', definition: 'Answer' },
  { word: 'problem', definition: 'Issue' }
]

export default function Phase5Step2RemedialB2TaskC() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase5/subphase/1/step/2/remedial/b2/task/d') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 2, interaction: 3, context: 'remedial_b2' })
  const [gameCompleted, setGameCompleted] = useState(false)

  const cardSx = (color) => ({
    bgcolor: color.bg,
    border: `2px solid ${color.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${color.shadow}`,
    p: 3,
  })

  const handleGameComplete = async (result) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: result })
    setGameCompleted(true)
    const score = result.score || 0
    sessionStorage.setItem('phase5_step2_remedial_b2_taskC_score', score.toString())
    try { await phase5API.logRemedialActivity(2, 'B2', 'C', score, 8, result.timeTaken || 0) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Phase 5: Execution &amp; Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 2: Remedial Practice - Level B2</Typography>
            <Typography variant="h6" gutterBottom sx={{ color: P.orange.border }}>Task C: Matching Game</Typography>
            <Typography variant="body1" color="text.secondary">Match 8 terms to definitions</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Matching Game! Match each term to its definition. Drag and drop to make the matches!" />
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
            <DragDropMatchingGame pairs={MATCHING_PAIRS} duration={120} onComplete={handleGameComplete} />
          </Box>
        </motion.div>
        {gameCompleted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box component="button" onClick={() => navigate('/phase5/subphase/1/step/2/remedial/b2/task/d')} sx={{ width: '100%', bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`, py: 1.5, cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', color: P.green.border, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s ease' }}>
              Next: Task D →
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
