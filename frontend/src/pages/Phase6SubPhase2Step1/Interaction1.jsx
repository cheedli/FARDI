import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import WordshakeGame from '../../components/phase5/WordshakeGame.jsx'
import { phase6API } from '../../lib/phase6_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' }, orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' } }
const DARK = { pageBg: '#0F0F1A', blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' }, orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' } }

const TARGET_WORDS = ['feedback', 'constructive', 'positive', 'suggestion', 'strength', 'weakness', 'improve', 'polite', 'listen', 'agree', 'disagree', 'helpful']

export default function Phase6SP2Step1Int1() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 1, interaction: 1, context: 'main' })

  const handleGameComplete = async (gameData) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction1', is_correct: true, score: gameData })
    const score = gameData.score !== undefined ? gameData.score : (gameData.completed ? 1 : 0)
    sessionStorage.setItem('phase6_sp2_step1_interaction1_score', score.toString())
    try { await phase6API.trackGame(1, 1, gameData, 2) } catch (e) { console.error('Track failed:', e) }
    setTimeout(() => navigate('/phase6/subphase/2/step/1/interaction/2'), 2000)
  }

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>Phase 6: Reflection and Evaluation</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.border }}>Step 1: Engage - Interaction 1</Typography>
            <Typography variant="body1" color="text.secondary">Wordshake - Find vocabulary words</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <Typography variant="body1" sx={{ fontStyle: 'italic' }} color="text.secondary">Ms. Mabrouki: "First, play Wordshake to activate feedback vocabulary. Words to form: feedback, constructive, positive, suggestion, strength, weakness, improve, polite, listen, agree, disagree, helpful."</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <WordshakeGame step={1} interaction={1} targetTime={180} targetWords={TARGET_WORDS} onComplete={handleGameComplete} />
        </motion.div>
      </Container>
    </Box>
  )
}
