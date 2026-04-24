import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import WordshakeC1Game from '../../../components/WordshakeC1Game.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Level C1 - Task C: Advanced Wordshake + Sentence Writing
 * Find 6 advanced marketing terms, then use each in a contextual sentence
 * Two-phase game: Word finding + Sentence writing with AI evaluation
 */

const TARGET_WORDS = [
  'guerilla',
  'surrogate',
  'remarketing',
  'geotargeting',
  'infomercial',
  'viral'
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

export default function RemedialC1TaskC() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase4/remedial/c1/taskD') }, [])
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 3, context: 'remedial_c1' })

  const handleGameComplete = (result) => {
    console.log('C1 Wordshake Challenge completed:', result)

    const taskScore = result.wordFindingScore

    console.log(`Task C Score: ${taskScore} words found out of 6`)

    sessionStorage.setItem('remedial_c1_taskC_score', taskScore)
    sessionStorage.setItem('remedial_c1_taskC_wordScore', result.wordFindingScore)
    sessionStorage.setItem('remedial_c1_taskC_sentenceScore', result.sentenceScore)

    console.log('✅ Task C Score stored in sessionStorage:', {
      taskScore: sessionStorage.getItem('remedial_c1_taskC_score'),
      wordScore: sessionStorage.getItem('remedial_c1_taskC_wordScore'),
      sentenceScore: sessionStorage.getItem('remedial_c1_taskC_sentenceScore')
    })

    logTaskCompletion(taskScore, result)

    setTimeout(() => {
      navigate('/phase4/remedial/c1/taskD')
    }, 2000)
  }

  const logTaskCompletion = async (taskScore, result) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: taskScore })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: 'C1',
          task: 'C',
          score: taskScore,
          max_score: 6,
          word_finding_score: result.wordFindingScore,
          sentence_score: result.sentenceScore,
          sentences: result.sentences,
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
              Advanced Wordshake Challenge
            </Typography>
            <Typography variant="h6" gutterBottom fontWeight={700} color={isDark ? DARK.purple.border : LIGHT.purple.shadow}>
              Level C1 - Task C: Find Words &amp; Write Sentences
            </Typography>
            <Typography variant="body1" color={isDark ? 'rgba(255,255,255,0.8)' : 'text.secondary'} sx={{ fontSize: '1.1rem' }}>
              Find 6 advanced marketing terms in the grid, then use each in a professional marketing sentence!
            </Typography>
          </Box>

          {/* Instructions Card */}
          <Box sx={{
            bgcolor: isDark ? DARK.blue.bg : LIGHT.blue.bg,
            border: `2px solid ${isDark ? DARK.blue.border : LIGHT.blue.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${isDark ? DARK.blue.shadow : LIGHT.blue.shadow}`,
            p: 3, mb: 3,
            transition: 'transform 0.15s, box-shadow 0.15s',
            '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${isDark ? DARK.blue.shadow : LIGHT.blue.shadow}` }
          }}>
            <Typography variant="h6" gutterBottom fontWeight={700} color={isDark ? DARK.blue.border : LIGHT.blue.shadow}>
              Two-Phase Challenge
            </Typography>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 700, color: isDark ? 'rgba(255,255,255,0.9)' : 'text.primary' }}>
              Phase 1: Word Finding (5 minutes)
            </Typography>
            <ul style={{ marginTop: 0, marginBottom: 16, color: isDark ? 'rgba(255,255,255,0.8)' : 'inherit' }}>
              <li>Click adjacent letters in the grid to form words</li>
              <li>Find all 6 advanced marketing terms: guerilla, surrogate, remarketing, geotargeting, infomercial, viral</li>
              <li>Letters can be horizontal, vertical, or diagonal</li>
            </ul>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 700, color: isDark ? 'rgba(255,255,255,0.9)' : 'text.primary' }}>
              Phase 2: Sentence Writing
            </Typography>
            <ul style={{ marginTop: 0, color: isDark ? 'rgba(255,255,255,0.8)' : 'inherit' }}>
              <li>Write a sentence using each found word in a marketing context</li>
              <li>Your sentences will be evaluated by AI for contextual appropriateness</li>
              <li>Use C1-level vocabulary and professional language</li>
            </ul>
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
              message="Welcome to C1 Task C! First, find the 6 advanced marketing terms hidden in the grid. Then, demonstrate your mastery by using each term in a sophisticated marketing sentence. This combines vocabulary recognition with contextual application - essential skills for C1 level!"
            />
          </Box>

          {/* Wordshake Game */}
          <Box>
            <WordshakeC1Game
              targetWords={TARGET_WORDS}
              duration={300}
              onComplete={handleGameComplete}
            />
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
