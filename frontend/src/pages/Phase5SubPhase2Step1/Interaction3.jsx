import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../components/Avatar.jsx'
import SushiSpellGame from '../../components/phase5/SushiSpellGame.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' } }
const DARK  = { pageBg: '#0F0F1A', blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' } }
const clay  = (c) => ({ bgcolor: c.bg, border: `2px solid ${c.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${c.shadow}`, p: 3 })

const TARGET_WORDS = ['please', 'thank you', 'first', 'then', 'after', 'careful', 'help', 'guide', 'welcome', 'queue', 'safety', 'listen']

export default function Phase5SubPhase2Step1Interaction3() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 1, interaction: 3, context: 'main' })

  const handleGameComplete = (gameData) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction3', is_correct: true, score: gameData })
    sessionStorage.setItem('phase5_subphase2_step1_interaction3_score', gameData.score || '0')
    setTimeout(() => { navigate('/phase5/subphase/2/step/1/score') }, 2000)
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...clay(P.blue), mb: 3 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: P.blue.border, mb: 1 }}>Phase 5: Execution &amp; Problem-Solving</Typography>
            <Typography variant="h5" sx={{ color: P.blue.border, mb: 1 }}>SubPhase 2 Step 1: Engage - Interaction 3</Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>Practice spelling instruction vocabulary</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...clay(P.teal), mb: 3 }}>
            <CharacterMessage speaker="Emna" message="To practise more instruction words, let's play another quick individual game! Play 'Sushi Spell' individually for 2 minutes to spell instruction words (target: please, thank you, first, then, after, careful, help, guide, welcome, queue, safety, listen). Link: https://learnenglishteens.britishcouncil.org/vocabulary/vocabulary-games/sushi-spell. Try longer words like 'thank you' or 'careful'." />
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <SushiSpellGame step={1} interaction={3} subphase={2} targetTime={120} targetWords={TARGET_WORDS} onComplete={handleGameComplete} />
        </motion.div>
      </Container>
    </Box>
  )
}
