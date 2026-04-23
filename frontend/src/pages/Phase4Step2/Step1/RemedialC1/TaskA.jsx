import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import DebateDuelGame from '../../../../components/DebateDuelGame.jsx'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 1 - Level C1 - Task A: Debate Simulation
 */

const DEBATE_LINES = [
  { speaker: 'Opponent', template: 'Why influencer marketing?', blanks: [] },
  { speaker: 'You', template: 'Influencers drive [____] through [____], creating [____] content that achieves [____] reach.', blanks: ['engagement', 'authenticity', 'viral', 'organic'] }
]

const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const WORD_BANK = shuffleArray(['engagement', 'authenticity', 'viral', 'organic', 'analytics', 'conversion', 'targeting', 'impressions'])

export default function Phase4_2RemedialC1TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 1, interaction: 1, context: 'remedial_c1' })
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const LIGHT = {
    pageBg: '#FFFDE7',
    orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
    teal:   { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  }
  const DARK = {
    pageBg: '#0F0F1A',
    orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
    teal:   { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  }
  const P = isDark ? DARK : LIGHT

  const handleGameComplete = (result) => {
    let correctWordsCount = 0
    if (result.completedLines) {
      result.completedLines.forEach(line => {
        if (line.validation) correctWordsCount += line.validation.filter(v => v === true).length
      })
    }
    sessionStorage.setItem('phase4_2_remedial_c1_taskA_score', correctWordsCount)
    sessionStorage.setItem('phase4_2_remedial_c1_taskA_won', result.won)
    logTaskCompletion(correctWordsCount, result.won)
    setTimeout(() => navigate('/phase4_2/step/1/remedial/c1/taskB'), 1500)
  }

  const logTaskCompletion = async (score, won) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 1, level: 'C1', task: 'A', score, max_score: 4, won, completed: true })
      })
    } catch (error) { console.error('Failed to log:', error) }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>Debate Simulation</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.shadow }}>Phase 4.2 Step 1 - Level C1 - Task A</Typography>
            <Typography variant="body1" sx={{ color: P.orange.shadow }}>Engage in an advanced debate about influencer marketing using sophisticated terminology!</Typography>
          </Box>

          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage character="EMNA" message="This is C1 level - the most advanced! Use sophisticated social media promotion terminology like engagement, authenticity, viral strategy, and organic reach. Each correct term wins you a round!" />
          </Box>

          <Box>
            <DebateDuelGame debateLines={DEBATE_LINES} wordBank={WORD_BANK} onComplete={handleGameComplete} />
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
