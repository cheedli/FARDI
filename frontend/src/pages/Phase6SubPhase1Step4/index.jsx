import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Stack,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import EditIcon from '@mui/icons-material/Edit'
import InfoIcon from '@mui/icons-material/Info'
import ArticleIcon from '@mui/icons-material/Article'
import SushiSpellGame from '../../components/phase5/SushiSpellGame.jsx'

const SUSHI_WORDS = ['success', 'challenge', 'feedback', 'recommend', 'summary']

/**
 * Phase 6 SubPhase 1 Step 4: Elaborate
 * Writing a Post-Event Report - Full Report Sections
 */

const LIGHT = {
  pageBg: '#FFFDE7',
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

const KEY_VOCABULARY = [
  'executive', 'summary', 'successes', 'challenges', 'evidence',
  'impact', 'conclusion', 'recommendation', 'achieved', 'encountered'
]

const LEARNING_OUTCOMES = [
  'Write a structured Executive Summary with professional language',
  'Write a Successes & Challenges section with specific evidence',
  'Use formal register and appropriate linking words',
  'Organise report sections logically and coherently'
]

const REPORT_TEMPLATE = [
  {
    section: 'Executive Summary',
    description: 'A brief overview of the entire event (5-8 sentences)',
    elements: ['Event name, date, location', 'Main objectives', 'Key successes', 'Main challenges', 'Overall outcome']
  },
  {
    section: 'Successes & Challenges',
    description: 'Detailed account with specific evidence',
    elements: ['At least 2 successes with evidence', 'At least 2 challenges encountered', 'Past tense throughout', 'Specific details (numbers, names)']
  }
]

export default function Phase6SP1Step4Intro() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const [sushiDone, setSushiDone] = useState(false)

  const handleStart = () => {
    navigate('/phase6/subphase/1/step/4/interaction/1')
  }

  const cardSx = (color) => ({
    bgcolor: color.bg,
    border: `2px solid ${color.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${color.shadow}`,
    p: 3,
  })

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>
              Phase 6: Reflection & Evaluation
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.border }}>
              Step 4: Elaborate - Writing Full Report Sections
            </Typography>
            <Typography variant="body1" color="text.secondary">
              SubPhase 6.1: Writing a Post-Event Report
            </Typography>
          </Box>
        </motion.div>

        {/* Scenario / Character Message */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Box sx={{
                width: 50, height: 50, borderRadius: '50%',
                bgcolor: P.teal.border,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 'bold', fontSize: '1rem', flexShrink: 0
              }}>MM</Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Ms. Mabrouki</Typography>
                <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                  "Now it's time to write the full report sections. You'll write an Executive Summary
                  and then the Successes &amp; Challenges section. These are the most important parts
                  of your post-event report — they tell the story of what happened and what you learned."
                </Typography>
              </Box>
            </Box>
          </Box>
        </motion.div>

        {/* Learning Outcomes */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.green), mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LightbulbIcon sx={{ fontSize: 36, color: P.green.border, mr: 2 }} />
              <Typography variant="h6" sx={{ color: P.green.border }}>Learning Outcomes</Typography>
            </Box>
            <Stack spacing={1}>
              {LEARNING_OUTCOMES.map((outcome, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <Typography variant="body2" sx={{ color: P.green.border, fontWeight: 'bold', minWidth: 20 }}>
                    {idx + 1}.
                  </Typography>
                  <Typography variant="body2">{outcome}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </motion.div>

        {/* Report Template Structure */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ArticleIcon sx={{ fontSize: 36, color: P.blue.border, mr: 2 }} />
              <Typography variant="h6" sx={{ color: P.blue.border }}>Report Template Structure</Typography>
            </Box>
            <Stack spacing={2}>
              {REPORT_TEMPLATE.map((section, idx) => (
                <Box key={idx} sx={{
                  bgcolor: P.pageBg,
                  border: `2px solid ${P.blue.border}`,
                  borderRadius: '12px',
                  p: 2
                }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ color: P.blue.border, mb: 0.5 }}>
                    {section.section}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {section.description}
                  </Typography>
                  <Stack spacing={0.5}>
                    {section.elements.map((el, i) => (
                      <Typography key={i} variant="body2">• {el}</Typography>
                    ))}
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>
        </motion.div>

        {/* Key Vocabulary */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Box sx={{ ...cardSx(P.purple), mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: P.purple.border }}>Key Vocabulary</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {KEY_VOCABULARY.map((term, idx) => (
                <Box key={idx} sx={{
                  px: 1.5, py: 0.5,
                  bgcolor: P.purple.bg,
                  border: `2px solid ${P.purple.border}`,
                  borderRadius: '12px',
                  boxShadow: `2px 2px 0 ${P.purple.shadow}`,
                }}>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: P.purple.border }}>{term}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </motion.div>

        {/* Writing Tasks Overview */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EditIcon sx={{ fontSize: 36, color: P.orange.border, mr: 2 }} />
              <Typography variant="h6" sx={{ color: P.orange.border }}>What You Will Do</Typography>
            </Box>
            <Stack spacing={1}>
              <Typography variant="body2">
                <strong>Interaction 1:</strong> Write an Executive Summary using a guided template
              </Typography>
              <Typography variant="body2">
                <strong>Interaction 2:</strong> Write the Successes &amp; Challenges section with specific evidence
              </Typography>
              <Typography variant="body2">
                <strong>Interaction 3:</strong> Play Sushi Spell to reinforce formal report vocabulary
              </Typography>
            </Stack>
          </Box>
        </motion.div>

        {/* Tips */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <InfoIcon sx={{ color: P.teal.border, mr: 1 }} />
              <Typography variant="body2" fontWeight="bold" sx={{ color: P.teal.border }}>Writing Tips:</Typography>
            </Box>
            <Typography variant="body2">• Use past tense throughout (the event happened in the past)</Typography>
            <Typography variant="body2">• Be specific — include numbers, names, and events as evidence</Typography>
            <Typography variant="body2">• Use formal linking words: however, furthermore, consequently, despite</Typography>
            <Typography variant="body2">• Keep a professional, objective tone</Typography>
          </Box>
        </motion.div>

        {/* Sushi Spell Game */}
        <Box sx={{ mb: 3 }}>
          <SushiSpellGame
            step={4}
            interaction={0}
            targetWords={SUSHI_WORDS}
            onComplete={() => setSushiDone(true)}
            subphase={1}
          />
        </Box>

        {/* Start Button */}
        {sushiDone && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Box
                component="button"
                onClick={handleStart}
                sx={{
                  px: 6, py: 1.5,
                  bgcolor: P.green.bg,
                  border: `2px solid ${P.green.border}`,
                  borderRadius: '20px',
                  boxShadow: `4px 4px 0 ${P.green.shadow}`,
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  color: P.green.border,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s ease',
                }}
              >
                Start Step 4: Elaborate
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
