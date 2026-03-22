import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../components/Avatar.jsx'
import InfoIcon from '@mui/icons-material/Info'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import ArticleIcon from '@mui/icons-material/Article'
import SushiSpellGame from '../../components/phase5/SushiSpellGame.jsx'

const LIGHT = {
  pageBg: '#FFFDE7',
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
}

const KEY_VOCABULARY = ['summary', 'evidence', 'achievement', 'positive', 'negative', 'impact', 'lesson', 'recommend']
const SUSHI_WORDS = ['success', 'challenge', 'feedback', 'improve', 'recommend']

const LEARNING_OUTCOMES = [
  'Explore the structure of a post-event report',
  'Practice writing a trial summary section',
  'Understand what makes effective reporting'
]

const REPORT_SECTIONS = [
  { title: 'Executive Summary', description: 'A brief overview of the entire event and its main outcomes. This is the first thing readers see.', icon: '📋' },
  { title: 'Successes', description: 'What went well during the event. Include specific achievements and positive outcomes.', icon: '✅' },
  { title: 'Challenges', description: 'What was difficult or did not go as planned. Be honest and objective.', icon: '⚠️' },
  { title: 'Recommendations', description: 'Ideas and suggestions for improving future events based on lessons learned.', icon: '💡' }
]

export default function Phase6SP1Step2Intro() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const [sushiDone, setSushiDone] = useState(false)

  const handleStart = () => navigate('/phase6/subphase/1/step/2/interaction/1')

  const cardSx = (color) => ({
    bgcolor: color.bg,
    border: `2px solid ${color.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${color.shadow}`,
    p: 3
  })

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>
              Phase 6: Reflection &amp; Evaluation
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.border }}>
              SubPhase 6.1 - Step 2: Explore
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
              Writing a Post-Event Report - Exploring Report Structure
            </Typography>
          </Box>
        </motion.div>

        {/* Scenario Intro */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Let's explore how professional event reports are written. I'm going to show you a sample post-event report structure. Understanding this structure will help you write your own complete report for our Global Cultures Festival!"
            />
          </Box>
        </motion.div>

        {/* Learning Outcomes */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.green), mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LightbulbIcon sx={{ fontSize: 36, color: P.green.border, mr: 2 }} />
              <Typography variant="h6" fontWeight="bold" sx={{ color: P.green.border }}>
                Learning Outcomes
              </Typography>
            </Box>
            <Stack spacing={1}>
              {LEARNING_OUTCOMES.map((outcome, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{
                    width: 24, height: 24, borderRadius: '50%',
                    bgcolor: P.green.border, color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 'bold', flexShrink: 0
                  }}>
                    {idx + 1}
                  </Box>
                  <Typography variant="body2">{outcome}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </motion.div>

        {/* Report Structure */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ArticleIcon sx={{ fontSize: 36, color: P.blue.border, mr: 2 }} />
              <Typography variant="h6" fontWeight="bold" sx={{ color: P.blue.border }}>
                Sample Post-Event Report Structure
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              A professional post-event report follows a clear structure. Here are the main sections:
            </Typography>
            <Stack spacing={2}>
              {REPORT_SECTIONS.map((section, idx) => (
                <Box key={idx} sx={{
                  ...cardSx(P.teal),
                  p: 2,
                  borderLeft: `4px solid ${P.teal.border}`
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <Typography sx={{ fontSize: '1.5rem', lineHeight: 1.2 }}>{section.icon}</Typography>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ color: P.teal.border }}>
                        {idx + 1}. {section.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">{section.description}</Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
        </motion.div>

        {/* Key Vocabulary */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>
              Key Vocabulary for This Step
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {KEY_VOCABULARY.map((term, idx) => (
                <Box
                  key={idx}
                  sx={{
                    bgcolor: P.orange.border, color: 'white', fontWeight: 'bold',
                    px: 1.5, py: 0.5, borderRadius: '12px', fontSize: '0.85rem',
                    boxShadow: `2px 2px 0 ${P.orange.shadow}`
                  }}
                >
                  {term}
                </Box>
              ))}
            </Box>
          </Box>
        </motion.div>

        {/* What You'll Do */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Box sx={{ ...cardSx(P.yellow), mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <InfoIcon sx={{ color: P.yellow.border }} />
              <Typography variant="body2" fontWeight="bold" sx={{ color: P.yellow.border }}>
                What You'll Do in This Step:
              </Typography>
            </Box>
            <Typography variant="body2">1. Play Sushi Spell to activate report writing vocabulary</Typography>
            <Typography variant="body2">2. Write a trial executive summary for the festival</Typography>
            <Typography variant="body2">3. Explain your writing choices using "because" to give reasons</Typography>
            <Typography variant="body2">4. Play Sushi Spell again to reinforce vocabulary</Typography>
          </Box>
        </motion.div>

        {/* Sushi Spell Game */}
        <Box sx={{ mb: 3 }}>
          <SushiSpellGame
            step={2}
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
                  ...cardSx(P.green),
                  px: 6, py: 1.5,
                  fontSize: '1rem', fontWeight: 'bold',
                  color: P.green.border, cursor: 'pointer', border: `2px solid ${P.green.border}`,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s ease'
                }}
              >
                Start Step 2: Explore
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
