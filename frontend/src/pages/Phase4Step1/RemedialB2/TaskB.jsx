import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CompareQuestGame from '../../../components/CompareQuestGame.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Level B2 - Task B: Compare Quest Writing
 * Write an 8-sentence paragraph comparing promotion methods (posters and videos)
 * Each strong comparison unlocks an advanced vocabulary level
 */

const GUIDED_QUESTIONS = [
  {
    id: 1,
    question: 'How do posters and videos differ in reach?'
  },
  {
    id: 2,
    question: 'Compare eye-catchers in each.'
  },
  {
    id: 3,
    question: 'Slogan vs jingle?'
  },
  {
    id: 4,
    question: 'Cost and production.'
  },
  {
    id: 5,
    question: 'Audience engagement.'
  },
  {
    id: 6,
    question: 'Distribution differences.'
  },
  {
    id: 7,
    question: 'Long-term effect.'
  },
  {
    id: 8,
    question: 'When to choose one over the other.'
  }
]

const GLOSSARY_TERMS = [
  'billboard',
  'eye-catcher',
  'feature',
  'slogan',
  'jingle',
  'viral',
  'layout',
  'animation',
  'dramatisation',
  'commercial',
  'flyers',
  'leaflets',
  'penetration',
  'geotargeting',
  'influencer'
]

const EVALUATION_CRITERIA = {
  requiresB2Structure: true,
  requiresComparativeLanguage: ['while', 'whereas', 'better than', 'compared to', 'unlike', 'in contrast'],
  minGlossaryTerms: 6,
  requiresCoherence: true,
  requiresTopicSentence: true
}

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

export default function RemedialB2TaskB() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase4/remedial/b2/taskC') }, [])
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 2, context: 'remedial_b2' })

  const handleGameComplete = (result) => {
    console.log('B2 Compare Quest completed:', result)

    const score = result.score || 0
    const level = result.vocabularyLevel || 1
    const skipped = result.skipped || 0

    sessionStorage.setItem('remedial_b2_taskB_score', score)
    sessionStorage.setItem('remedial_b2_taskB_level', level)
    sessionStorage.setItem('remedial_b2_taskB_skipped', skipped)

    logTaskCompletion(score, level, result.answers)

    setTimeout(() => {
      navigate('/phase4/remedial/b2/taskC')
    }, 1500)
  }

  const logTaskCompletion = async (score, level, answers) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score: score })
    try {
      const response = await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          level: 'B2',
          task: 'B',
          score: score,
          max_score: GUIDED_QUESTIONS.length,
          vocabulary_level: level,
          answers: answers,
          completed: true
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('Task B completion logged to backend')
      }
    } catch (error) {
      console.error('Failed to log task completion:', error)
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
              Compare Quest: Posters vs Videos
            </Typography>
            <Typography variant="h6" gutterBottom fontWeight={700} color={isDark ? DARK.purple.border : LIGHT.purple.shadow}>
              Level B2 - Task B: Comparison Writing
            </Typography>
            <Typography variant="body1" color={isDark ? 'rgba(255,255,255,0.8)' : 'text.secondary'} sx={{ fontSize: '1.1rem' }}>
              Write strong comparisons to unlock advanced vocabulary levels and earn your comparison badge!
            </Typography>
          </Box>

          {/* Quest Instructions */}
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
              Your Quest
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: isDark ? 'rgba(255,255,255,0.9)' : 'text.primary' }}>
              Answer 8 guided questions to build a complete comparison paragraph about promotion methods. Each strong comparison unlocks a new vocabulary level!
            </Typography>
            <Typography variant="body1" fontWeight={700} sx={{ mb: 1, color: isDark ? DARK.blue.border : LIGHT.blue.shadow }}>
              Success Criteria:
            </Typography>
            <ul style={{ marginTop: 0, color: isDark ? 'rgba(255,255,255,0.85)' : 'inherit' }}>
              <li>Use comparative language (while, whereas, better than, compared to, etc.)</li>
              <li>Include at least 6 glossary terms in your answers</li>
              <li>Create coherent comparisons with clear logic</li>
              <li>Show understanding of both promotion methods</li>
            </ul>
            <Typography variant="body2" color={isDark ? 'rgba(255,255,255,0.6)' : 'text.secondary'} sx={{ mt: 2 }}>
              Tip: You can skip questions, but answered questions help you level up!
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
              message="This is advanced comparison writing! Think about the differences between posters and videos from multiple angles: reach, cost, engagement, distribution, and impact. Use comparative language and marketing terminology to build strong, professional comparisons."
            />
          </Box>

          {/* Compare Quest Game */}
          <Box>
            <CompareQuestGame
              questions={GUIDED_QUESTIONS}
              glossaryTerms={GLOSSARY_TERMS}
              onComplete={handleGameComplete}
              evaluationCriteria={EVALUATION_CRITERIA}
            />
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
