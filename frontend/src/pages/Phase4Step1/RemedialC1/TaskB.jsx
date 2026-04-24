import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CritiqueChallengeGame from '../../../components/CritiqueChallengeGame.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const CRITIQUE_QUESTIONS = [
  { id: 1, question: 'Analyze poster effectiveness' },
  { id: 2, question: 'Compare poster and video reach' },
  { id: 3, question: 'Evaluate surrogate advertising strategy' },
  { id: 4, question: 'Critique guerilla marketing tactics' },
  { id: 5, question: 'Assess remarketing effectiveness' },
  { id: 6, question: 'Analyze geotargeting benefits' },
  { id: 7, question: 'Compare infomercial vs commercial' },
  { id: 8, question: 'Evaluate viral marketing potential' }
]

const GLOSSARY_TERMS = [
  'surrogate', 'guerilla', 'remarketing', 'geotargeting', 'infomercial', 'viral',
  'billboard', 'eye-catcher', 'slogan', 'targeted', 'engaging', 'commercial'
]

const LIGHT = {
  pageBg: '#FFFDE7',
  blue:   { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
  teal:   { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  red:    { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
  teal:   { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  red:    { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

export default function RemedialC1TaskB() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase4/remedial/c1/taskC') }, [])
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 2, context: 'remedial_c1' })

  const handleGameComplete = (result) => {
    console.log('C1 Critique Challenge completed:', result)

    sessionStorage.setItem('remedial_c1_taskB_score', result.score)
    sessionStorage.setItem('remedial_c1_taskB_badge', result.badgeLevel)

    console.log('✅ Task B Score stored in sessionStorage:', {
      score: sessionStorage.getItem('remedial_c1_taskB_score'),
      badge: sessionStorage.getItem('remedial_c1_taskB_badge')
    })

    logTaskCompletion(result.score, result.badgeLevel, result.answers)

    setTimeout(() => {
      navigate('/phase4/remedial/c1/taskC')
    }, 1500)
  }

  const logTaskCompletion = async (score, badgeLevel, answers) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: 'C1',
          task: 'B',
          score: score,
          max_score: CRITIQUE_QUESTIONS.length,
          badge_level: badgeLevel,
          answers: answers,
          completed: true
        })
      })
    } catch (error) {
      console.error('Failed to log:', error)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: isDark ? DARK.pageBg : LIGHT.pageBg, py: 4 }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: isDark ? DARK.purple.bg : LIGHT.purple.bg,
            border: `2px solid ${isDark ? DARK.purple.border : LIGHT.purple.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${isDark ? DARK.purple.shadow : LIGHT.purple.shadow}`,
            p: 4, mb: 3,
            transition: 'transform 0.15s, box-shadow 0.15s',
            '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${isDark ? DARK.purple.shadow : LIGHT.purple.shadow}` }
          }}>
            <Typography variant="h4" gutterBottom fontWeight={700} color={isDark ? DARK.purple.border : LIGHT.purple.shadow}>
              Critique Challenge
            </Typography>
            <Typography variant="body1" color={isDark ? 'rgba(255,255,255,0.8)' : 'text.secondary'} sx={{ fontSize: '1.1rem' }}>
              Write 8 sophisticated critiques using advanced marketing terminology. Earn badges with each excellent critique!
            </Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{
            bgcolor: isDark ? DARK.teal.bg : LIGHT.teal.bg,
            border: `2px solid ${isDark ? DARK.teal.border : LIGHT.teal.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${isDark ? DARK.teal.shadow : LIGHT.teal.shadow}`,
            p: 3, mb: 3,
            transition: 'transform 0.15s, box-shadow 0.15s',
            '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${isDark ? DARK.teal.shadow : LIGHT.teal.shadow}` }
          }}>
            <CharacterMessage
              character="EMNA"
              message="Write nuanced critiques with comparative analysis. Use C1-level vocabulary and demonstrate deep understanding of marketing concepts!"
            />
          </Box>

          <Box>
            <CritiqueChallengeGame
              questions={CRITIQUE_QUESTIONS}
              glossaryTerms={GLOSSARY_TERMS}
              onComplete={handleGameComplete}
            />
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
