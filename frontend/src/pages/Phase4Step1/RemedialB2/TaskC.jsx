import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import SushiSpellAdvancedGame from '../../../components/SushiSpellAdvancedGame.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Level B2 - Task C: Sushi Spell Advanced
 * Spell and match 8 advanced marketing terms to scenarios
 * Gamified vocabulary matching game
 */

const ADVANCED_TERMS = [
  {
    term: 'viral',
    scenario: 'Video spread'
  },
  {
    term: 'slogan',
    scenario: 'Poster phrase'
  },
  {
    term: 'billboard',
    scenario: 'Outdoor advertising'
  },
  {
    term: 'jingle',
    scenario: 'Catchy tune'
  },
  {
    term: 'engaging',
    scenario: 'Holds attention'
  },
  {
    term: 'targeted',
    scenario: 'Specific audience'
  },
  {
    term: 'commercial',
    scenario: 'Paid advertisement'
  },
  {
    term: 'influencer',
    scenario: 'Social media promoter'
  }
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

export default function RemedialB2TaskC() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase4/remedial/b2/taskD') }, [])
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 3, context: 'remedial_b2' })

  const handleGameComplete = (result) => {
    console.log('B2 Sushi Spell completed:', result)

    const score = result.score || 0
    const timeElapsed = result.timeElapsed || 0

    sessionStorage.setItem('remedial_b2_taskC_score', score)
    sessionStorage.setItem('remedial_b2_taskC_time', timeElapsed)

    logTaskCompletion(score, timeElapsed, result.spelledTerms)

    setTimeout(() => {
      navigate('/phase4/remedial/b2/taskD')
    }, 1500)
  }

  const logTaskCompletion = async (score, timeElapsed, spelledTerms) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: score })
    try {
      const response = await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          level: 'B2',
          task: 'C',
          score: score,
          max_score: ADVANCED_TERMS.length,
          time_taken: timeElapsed,
          spelled_terms: spelledTerms,
          completed: true
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('Task C completion logged to backend')
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
            bgcolor: isDark ? DARK.green.bg : LIGHT.green.bg,
            border: `2px solid ${isDark ? DARK.green.border : LIGHT.green.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${isDark ? DARK.green.shadow : LIGHT.green.shadow}`,
            p: 4, mb: 3,
            transition: 'transform 0.15s, box-shadow 0.15s',
            '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${isDark ? DARK.green.shadow : LIGHT.green.shadow}` }
          }}>
            <Typography variant="h4" gutterBottom fontWeight={700} color={isDark ? DARK.green.border : LIGHT.green.shadow}>
              Sushi Spell Advanced
            </Typography>
            <Typography variant="h6" gutterBottom fontWeight={700} color={isDark ? DARK.green.border : LIGHT.green.shadow}>
              Level B2 - Task C: Vocabulary Matching
            </Typography>
            <Typography variant="body1" color={isDark ? 'rgba(255,255,255,0.8)' : 'text.secondary'} sx={{ fontSize: '1.1rem' }}>
              Spell advanced marketing terms by selecting letters, then match them to their scenarios!
            </Typography>
          </Box>

          {/* How to Play Card */}
          <Box sx={{
            bgcolor: isDark ? DARK.orange.bg : LIGHT.orange.bg,
            border: `2px solid ${isDark ? DARK.orange.border : LIGHT.orange.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${isDark ? DARK.orange.shadow : LIGHT.orange.shadow}`,
            p: 3, mb: 3,
            transition: 'transform 0.15s, box-shadow 0.15s',
            '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${isDark ? DARK.orange.shadow : LIGHT.orange.shadow}` }
          }}>
            <Typography variant="h6" gutterBottom fontWeight={700} color={isDark ? DARK.orange.border : LIGHT.orange.shadow}>
              How to Play
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: isDark ? 'rgba(255,255,255,0.9)' : 'text.primary' }}>
              This game is inspired by British Council's Sushi Spell. You'll see a scenario, and you need to spell the matching marketing term!
            </Typography>
            <Typography variant="body1" fontWeight={700} sx={{ mb: 1, color: isDark ? DARK.orange.border : LIGHT.orange.shadow }}>
              Game Rules:
            </Typography>
            <ul style={{ marginTop: 0, color: isDark ? 'rgba(255,255,255,0.85)' : 'inherit' }}>
              <li>Read the scenario carefully</li>
              <li>Click letters from the Sushi Belt to spell the term</li>
              <li>Click on spelled letters to remove them if you make a mistake</li>
              <li>Click Submit when you think you've spelled it correctly</li>
              <li>Complete all 8 terms to win!</li>
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
              message="Welcome to Sushi Spell Advanced! This game tests your spelling AND your understanding of marketing vocabulary. Match each scenario to the correct term by spelling it out. Pay attention - some letters are extras to make it more challenging!"
            />
          </Box>

          {/* Vocabulary Reference */}
          <Box sx={{
            bgcolor: isDark ? DARK.purple.bg : LIGHT.purple.bg,
            border: `2px solid ${isDark ? DARK.purple.border : LIGHT.purple.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${isDark ? DARK.purple.shadow : LIGHT.purple.shadow}`,
            p: 3, mb: 3,
            transition: 'transform 0.15s, box-shadow 0.15s',
            '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${isDark ? DARK.purple.shadow : LIGHT.purple.shadow}` }
          }}>
            <Typography variant="h6" gutterBottom fontWeight={700} color={isDark ? DARK.purple.border : LIGHT.purple.shadow}>
              Terms You'll Spell:
            </Typography>
            <Typography variant="body2" color={isDark ? 'rgba(255,255,255,0.7)' : 'text.secondary'}>
              viral • slogan • billboard • jingle • engaging • targeted • commercial • influencer
            </Typography>
          </Box>

          {/* Sushi Spell Game */}
          <Box>
            <SushiSpellAdvancedGame
              terms={ADVANCED_TERMS}
              onComplete={handleGameComplete}
            />
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
