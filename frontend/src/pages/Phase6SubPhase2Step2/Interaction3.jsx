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

export default function Phase6SP2Step2Int3() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 2, interaction: 3, context: 'main' })

  const cardSx = (color) => ({
    bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3,
  })

  const handleGameComplete = async (gameData) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction3', is_correct: true, score: gameData })
    const score = gameData.score !== undefined ? gameData.score : (gameData.completed ? 1 : 0)
    sessionStorage.setItem('phase6_sp2_step2_interaction3_score', score.toString())
    try { await phase6API.trackGame(2, 3, gameData, 2) } catch (e) { console.error('Track failed:', e) }
    setTimeout(() => navigate('/phase6/subphase/2/step/2/score'), 2000)
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: P.blue.border }}>Phase 6: Reflection and Evaluation</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.shadow }}>Step 2: Explore — Interaction 3</Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>Sushi Spell — Spell vocabulary correctly</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>Emna: "Now revise your feedback after seeing examples of good peer feedback. Make it more specific and constructive!"</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }}>
          <SushiSpellGame step={2} interaction={3} targetTime={120} targetWords={TARGET_WORDS} onComplete={handleGameComplete} />
        </motion.div>
      </Container>
    </Box>
  )
}
