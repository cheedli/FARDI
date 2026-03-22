import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../components/Avatar.jsx'
import InfoIcon from '@mui/icons-material/Info'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import EditIcon from '@mui/icons-material/Edit'

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

const KEY_VOCABULARY = ['emergency', 'contingency', 'backup', 'announce', 'update', 'transparent', 'resolve', 'reassure']

const LEARNING_OUTCOMES = {
  A2: 'Can write simple guided announcements following examples (e.g., "Problem lights. We fix.")',
  B1: 'Can write structured messages with reasons following examples (e.g., "We use backup because emergency.")',
  B2: 'Can create detailed, polite crisis texts with logical flow following examples (e.g., "We are resolving... thank you for patience.")',
  C1: 'Can compose autonomous, nuanced crisis communications integrating strategic tone and multi-channel coordination following examples (e.g., "While we activate contingency measures... trust in our preparedness.")'
}

export default function Phase5Step4Intro() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT

  const handleStart = () => {
    navigate('/phase5/subphase/1/step/4/interaction/1')
  }

  const clay = (color) => ({
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
          <Box sx={{ ...clay(P.blue), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>
              Phase 5: Execution & Problem-Solving
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.border }}>
              Step 4: Elaborate
            </Typography>
            <Typography variant="body1">
              Complete Crisis Communication Texts - Writing full announcements and emails
            </Typography>
          </Box>
        </motion.div>

        {/* Scenario Intro */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...clay(P.teal), mb: 3 }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="The lighting has failed - now write real crisis responses! Use the guided templates with examples, adapt them to the festival situation, and self-check grammar, spelling, and structure before submitting."
            />
          </Box>
        </motion.div>

        {/* Learning Outcomes */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Box sx={{ ...clay(P.blue), mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LightbulbIcon sx={{ fontSize: 40, color: P.blue.border, mr: 2 }} />
              <Typography variant="h6" sx={{ color: P.blue.border }}>Learning Outcomes</Typography>
            </Box>
            <Stack spacing={1}>
              {Object.entries(LEARNING_OUTCOMES).map(([level, outcome]) => (
                <Box key={level}>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: P.blue.border }}>{level}:</Typography>
                  <Typography variant="body2" sx={{ ml: 2 }}>{outcome}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </motion.div>

        {/* Key Vocabulary */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Box sx={{ ...clay(P.teal), mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: P.teal.border }}>Key Vocabulary</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              {KEY_VOCABULARY.map((term, idx) => (
                <Box key={idx} sx={{
                  bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '12px',
                  boxShadow: `2px 2px 0 ${P.teal.shadow}`, px: 2, py: 0.5,
                }}>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: P.teal.border }}>{term}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </motion.div>

        {/* Writing Tasks */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EditIcon sx={{ fontSize: 40, color: P.orange.border, mr: 2 }} />
              <Typography variant="h6" sx={{ color: P.orange.border }}>Writing Tasks</Typography>
            </Box>
            <Stack spacing={1}>
              <Typography variant="body2"><strong>Interaction 1:</strong> Write an urgent social media announcement (4-8 sentences)</Typography>
              <Typography variant="body2"><strong>Interaction 2:</strong> Write an email to sponsors/team (5-10 sentences)</Typography>
              <Typography variant="body2"><strong>Interaction 3:</strong> Play Sushi Spell and revise one sentence using a spelled term</Typography>
            </Stack>
          </Box>
        </motion.div>

        {/* Instructions */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Box sx={{ ...clay(P.blue), mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <InfoIcon sx={{ color: P.blue.border, mr: 1 }} />
              <Typography variant="body2" fontWeight="bold" sx={{ color: P.blue.border }}>What You'll Do:</Typography>
            </Box>
            <Typography variant="body2">1. Write a social media announcement using the guided template</Typography>
            <Typography variant="body2">2. Write an email to sponsors/team using the guided template</Typography>
            <Typography variant="body2">3. Play Sushi Spell and revise one sentence with a spelled term</Typography>
            <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>Remember: Self-check for grammar, spelling, and structure mistakes!</Typography>
          </Box>
        </motion.div>

        {/* Start Button */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Box
              component="button"
              onClick={handleStart}
              sx={{
                ...clay(P.blue),
                cursor: 'pointer', px: 6, py: 1.5,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` },
                transition: 'all 0.15s',
              }}
            >
              <Typography variant="button" fontWeight="bold" sx={{ color: P.blue.border }}>
                Start Step 4: Elaborate
              </Typography>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}
