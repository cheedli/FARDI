import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import DragDropMatchingGame from '../../../components/DragDropMatchingGame.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' } }
const DARK = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' } }

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
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase5/subphase/1/step/5/remedial/b2/task/a') }, [])
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 5, interaction: 3, context: 'remedial_b2' })
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameResult, setGameResult] = useState(null)

  const clay = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })

  const handleGameComplete = async (result) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: result })
    setGameCompleted(true); setGameResult(result)
    const score = result.score || 0
    sessionStorage.setItem('phase5_step5_remedial_b2_taskC_score', score.toString())
    try { await phase5API.logRemedialActivity(5, 'B2', 'C', score, 8, result.timeTaken || 0) } catch (e) { console.error(e) }
  }

  const handleContinue = async () => {
    const a = parseInt(sessionStorage.getItem('phase5_step5_remedial_b2_taskA_score') || '0')
    const b = parseInt(sessionStorage.getItem('phase5_step5_remedial_b2_taskB_score') || '0')
    const c = parseInt(sessionStorage.getItem('phase5_step5_remedial_b2_taskC_score') || '0')
    let nextUrl = '/phase5/subphase/1/step/5/remedial/b2/task/a'
    try {
      const result = await phase5API.calculateRemedialScore(5, 'B2', { task_a_score: a, task_b_score: b, task_c_score: c })
      nextUrl = result?.data?.next_url || nextUrl
    } catch (e) {
      console.error(e)
    }
    navigate(nextUrl)
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Phase 5: Execution & Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 5: Remedial Practice - Level B2</Typography>
            <Typography variant="h6" gutterBottom sx={{ color: P.orange.border }}>Task C: Matching Game</Typography>
            <Typography variant="body1">Match 8 error types to corrections</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...clay(P.teal), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Matching Game! Match each error to its correction type and fix!" />
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Box>
            <DragDropMatchingGame pairs={ERROR_PAIRS} duration={120} onComplete={handleGameComplete} />
            {gameCompleted && (
              <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
                <Box component="button" onClick={handleContinue} sx={{ ...clay(P.green), cursor: 'pointer', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s' }}>
                  <Typography variant="button" fontWeight="bold" sx={{ color: P.green.border }}>Continue to Final Results →</Typography>
                </Box>
              </Stack>
            )}
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}
