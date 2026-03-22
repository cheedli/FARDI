import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import SushiSpellGame from '../../components/phase5/SushiSpellGame.jsx'
import { phase6API } from '../../lib/phase6_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
}

const TARGET_WORDS = ['feedback', 'constructive', 'positive', 'suggestion', 'strength']

export default function Phase6SP2Step3Int3() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 3, interaction: 3, context: 'main' })

  const handleGameComplete = async (gameData) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction3', is_correct: true, score: gameData })
    const score = gameData.score !== undefined ? gameData.score : (gameData.completed ? 1 : 0)
    sessionStorage.setItem('phase6_sp2_step3_interaction3_score', score.toString())
    try { await phase6API.trackGame(3, 3, gameData, 2) } catch (e) { console.error('Track failed:', e) }
    setTimeout(() => navigate('/phase6/subphase/2/step/3/score'), 2000)
  }

  const cardSx = (color) => ({
    bgcolor: P[color].bg,
    border: `2px solid ${P[color].border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${P[color].shadow}`,
    p: 3,
  })

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx('blue'), mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: P.blue.border, mb: 1 }}>Phase 6: Reflection and Evaluation</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>Step 3: Explain - Interaction 3</Typography>
            <Typography>Sushi Spell - Spell vocabulary correctly</Typography>
          </Box>
          <Box sx={{ ...cardSx('teal'), mb: 3 }}>
            <Typography sx={{ fontStyle: 'italic' }}>Ryan: "Play Sushi Spell with feedback terms. Spell: feedback, constructive, positive, suggestion, polite. Then explain one term you spelled."</Typography>
          </Box>
          <SushiSpellGame step={3} interaction={3} targetTime={120} targetWords={TARGET_WORDS} onComplete={handleGameComplete} />
        </motion.div>
      </Container>
    </Box>
  )
}
