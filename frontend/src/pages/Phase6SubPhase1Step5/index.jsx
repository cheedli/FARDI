import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import EditIcon from '@mui/icons-material/Edit'
import SpellcheckIcon from '@mui/icons-material/Spellcheck'
import GrammarIcon from '@mui/icons-material/MenuBook'
import StarIcon from '@mui/icons-material/Star'
import { CharacterMessage } from '../../components/Avatar.jsx'
import WordshakeGame from '../../components/phase5/WordshakeGame.jsx'

const LIGHT = {
  pageBg: '#EFF6FF',
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1D4ED8' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
}

const WORDSHAKE_WORDS = ['balanced', 'evidence', 'recommend', 'objective', 'formal', 'credible']

const LEARNING_OUTCOMES = [
  'Identify and correct spelling errors in a post-event report',
  'Fix grammar and tense mistakes for accuracy',
  'Improve coherence, tone, and evidence quality to enhance the overall report'
]

const CORRECTION_STEPS = [
  {
    icon: <SpellcheckIcon />,
    title: 'Interaction 1: Fix Spelling Errors',
    description: 'Find and correct spelling mistakes in the report draft. Focus only on spelling - not grammar or style.',
    color: 'teal',
  },
  {
    icon: <GrammarIcon />,
    title: 'Interaction 2: Fix Grammar Errors',
    description: 'Correct grammar and tense mistakes in a report section. Focus on subject-verb agreement and verb tenses.',
    color: 'orange',
  },
  {
    icon: <StarIcon />,
    title: 'Interaction 3: Enhance Overall Quality',
    description: 'Improve vocabulary, add specific details and evidence, and raise the overall professionalism of the report.',
    color: 'purple',
  }
]

export default function Phase6SubPhase1Step5Intro() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const [wordshakeDone, setWordshakeDone] = useState(false)

  const cardSx = (color) => ({
    bgcolor: P[color].bg,
    border: `2px solid ${P[color].border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${P[color].shadow}`,
    p: 3,
  })

  const handleStart = () => {
    navigate('/phase6/subphase/1/step/5/interaction/1')
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx('blue'), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>
              Phase 6: Reflection &amp; Evaluation
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.border }}>
              SubPhase 6.1: Writing a Post-Event Report
            </Typography>
            <Typography variant="h6" sx={{ color: P.blue.border }}>
              Step 5: Evaluate — Error Correction and Enhancement
            </Typography>
          </Box>
        </motion.div>

        {/* Character message */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx('teal'), mb: 3 }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Let's review and improve your report! You'll fix spelling, grammar, and then enhance the overall quality. This is the final editing step before your report is complete - take your time and focus on each correction type one at a time."
            />
          </Box>
        </motion.div>

        {/* Learning Outcomes */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx('green'), mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LightbulbIcon sx={{ fontSize: 36, color: P.green.border, mr: 2 }} />
              <Typography variant="h6" sx={{ color: P.green.border, fontWeight: 'bold' }}>
                Learning Outcomes
              </Typography>
            </Box>
            <Stack spacing={1.5}>
              {LEARNING_OUTCOMES.map((outcome, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <Box sx={{ px: 1, py: 0.25, bgcolor: P.green.border, borderRadius: '8px', minWidth: 28, textAlign: 'center', flexShrink: 0 }}>
                    <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>{idx + 1}</Typography>
                  </Box>
                  <Typography variant="body1">{outcome}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </motion.div>

        {/* Three Tasks */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Box sx={{ ...cardSx('blue'), mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EditIcon sx={{ fontSize: 36, color: P.blue.border, mr: 2 }} />
              <Typography variant="h6" sx={{ color: P.blue.border, fontWeight: 'bold' }}>
                Your Three Tasks
              </Typography>
            </Box>
            <Stack spacing={2}>
              {CORRECTION_STEPS.map((step, idx) => (
                <Box
                  key={idx}
                  sx={{
                    ...cardSx(step.color),
                    display: 'flex', alignItems: 'center', gap: 1.5,
                  }}
                >
                  <Box sx={{ color: P[step.color].border }}>{step.icon}</Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ color: P[step.color].border }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">{step.description}</Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
        </motion.div>

        {/* Instructions */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Box sx={{ ...cardSx('orange'), mb: 3 }}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ color: P.orange.border, mb: 1 }}>How This Works:</Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>1. Read the faulty text carefully and find all spelling mistakes to correct.</Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>2. Then fix the grammar and tense errors in the corrected text.</Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>3. Finally, enhance the report by adding better vocabulary, specific evidence, and a professional tone.</Typography>
            <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold', color: P.orange.border }}>
              Tip: Focus on one error type at a time for more effective editing!
            </Typography>
          </Box>
        </motion.div>

        {/* Wordshake Game */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Box sx={{ mb: 3 }}>
            <WordshakeGame
              step={5}
              interaction={0}
              targetWords={WORDSHAKE_WORDS}
              onComplete={() => setWordshakeDone(true)}
              subphase={1}
            />
          </Box>
        </motion.div>

        {wordshakeDone && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Box
                component="button"
                onClick={handleStart}
                sx={{
                  px: 8, py: 2,
                  bgcolor: P.blue.bg,
                  border: `2px solid ${P.blue.border}`,
                  borderRadius: '20px',
                  boxShadow: `4px 4px 0 ${P.blue.shadow}`,
                  cursor: 'pointer',
                  fontWeight: 'bold', fontSize: '1.1rem',
                  color: P.blue.border,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` },
                  transition: 'all 0.15s ease',
                }}
              >
                Start Step 5: Evaluate
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
