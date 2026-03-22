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
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
}

const KEY_VOCABULARY = ['strength', 'weakness', 'calm', 'transparent', 'reassure', 'resolve', 'refine']

const LEARNING_OUTCOMES = {
  A2: 'Can spot and fix basic spelling/grammar in short crisis messages.',
  B1: 'Can correct grammar, simple structure, polite tone, and basic vocabulary.',
  B2: 'Can improve coherence, cohesion, calm tone, vocabulary precision, and logical crisis flow.',
  C1: 'Can deliver nuanced, professional-level corrections across all dimensions (tone, strategy, stakeholder sensitivity, persuasive reassurance), achieving full autonomy in crisis communication writing.'
}

export default function Phase5Step5Intro() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT

  const handleStart = () => {
    navigate('/phase5/subphase/1/step/5/interaction/1')
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
              Step 5: Evaluate
            </Typography>
            <Typography variant="body1">
              Progressive Error Correction - Correct faulty crisis communication texts
            </Typography>
          </Box>
        </motion.div>

        {/* Scenario Intro */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...clay(P.teal), mb: 3 }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Excellent crisis writing! Now we evaluate by fixing 'wrong' versions with common mistakes. I'll give faulty texts - correct them step by step. Focus on one error type at a time to sharpen your editing skills."
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
            <Typography variant="h6" gutterBottom sx={{ color: P.teal.border }}>Key Vocabulary (for Wordshake game)</Typography>
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

        {/* Correction Steps */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EditIcon sx={{ fontSize: 40, color: P.orange.border, mr: 2 }} />
              <Typography variant="h6" sx={{ color: P.orange.border }}>Correction Steps</Typography>
            </Box>
            <Stack spacing={1}>
              <Typography variant="body2"><strong>Interaction 1:</strong> Correct spelling errors only</Typography>
              <Typography variant="body2"><strong>Interaction 2:</strong> Correct grammar errors (using spelling-corrected version)</Typography>
              <Typography variant="body2"><strong>Interaction 3:</strong> Enhance overall quality (coherence, tone, vocabulary, politeness) + Play Wordshake</Typography>
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
            <Typography variant="body2">1. Correct spelling mistakes in faulty crisis texts</Typography>
            <Typography variant="body2">2. Correct grammar mistakes using your spelling-corrected version</Typography>
            <Typography variant="body2">3. Enhance overall quality and play Wordshake for feedback terms</Typography>
            <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>Remember: Focus on one error type at a time for better learning!</Typography>
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
                Start Step 5: Evaluate
              </Typography>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}
