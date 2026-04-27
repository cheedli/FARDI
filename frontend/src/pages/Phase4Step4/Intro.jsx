import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../components/Avatar.jsx'
import SpellcheckIcon from '@mui/icons-material/Spellcheck'
import ArticleIcon from '@mui/icons-material/Article'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'

/**
 * Phase 4 Step 4 - Intro
 * Progressive Error Correction: Spelling → Grammar → Coherence/Vocabulary
 * Students correct faulty poster/video descriptions to build autonomous writing skills
 */

export default function Phase4Step5Intro() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const LIGHT = {
    pageBg:  '#FFFDE7',
    cardBg:  '#ffffff',
    heading: '#1A237E',
    body:    '#37474F',
    muted:   '#78909C',
    divider: '#E0E0E0',
    yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825', text: '#5D4037' },
    purple: { bg: '#E1BEE7', border: '#8E24AA', shadow: '#8E24AA' },
    green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
    blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
    orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
    pink:   { bg: '#FCE4EC', border: '#C2185B', shadow: '#C2185B' },
    teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
    red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#C62828' },
    indigo: { bg: '#E8EAF6', border: '#3949AB', shadow: '#3949AB' },
  }
  const DARK = {
    pageBg:  '#0F0F1A',
    cardBg:  '#1A1A2E',
    heading: '#E8EAFF',
    body:    '#B0BEC5',
    muted:   '#607D8B',
    divider: '#2A2A4A',
    yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#A06800', text: '#FFD54F' },
    purple: { bg: '#1E0A2E', border: '#CE93D8', shadow: '#7B1FA2' },
    green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
    blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
    orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
    pink:   { bg: '#1F0010', border: '#F48FB1', shadow: '#880E4F' },
    teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
    red:    { bg: '#1F0000', border: '#EF9A9A', shadow: '#B71C1C' },
    indigo: { bg: '#0D0D2B', border: '#7986CB', shadow: '#283593' },
  }
  const P = isDark ? DARK : LIGHT

  const handleStart = () => {
    navigate('/phase4/step/4/interaction/1')
  }

  const steps = [
    {
      icon: <SpellcheckIcon sx={{ fontSize: 36, color: P.red.shadow }} />,
      title: 'Step 1: Spelling Correction',
      desc: 'Identify and fix misspelled words like "gatefod", "slogen", "animasion"',
      color: P.red
    },
    {
      icon: <ArticleIcon sx={{ fontSize: 36, color: P.blue.shadow }} />,
      title: 'Step 2: Grammar Correction',
      desc: 'Fix subject-verb agreement, articles, tense consistency',
      color: P.blue
    },
    {
      icon: <AutoFixHighIcon sx={{ fontSize: 36, color: P.green.shadow }} />,
      title: 'Step 3: Coherence & Vocabulary Enhancement',
      desc: 'Add connectors, improve flow, upgrade vocabulary for sophistication',
      color: P.green
    }
  ]

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {/* Header */}
          <Box sx={{
            bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.purple.shadow }}>
              Phase 4: Marketing & Promotion
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.purple.shadow }}>
              Step 4: Evaluate - Error Correction & Refinement
            </Typography>
            <Typography variant="body1" sx={{ color: P.purple.shadow }}>
              Build autonomous writing skills through progressive error correction
            </Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3,
          }}>
            <CharacterMessage
              character="MS. MABROUKI"
              message="To evaluate your writing skills, I'll give you 'wrong' versions of poster descriptions and video scripts with mistakes (spelling, grammar, structure, vocabulary). Correct them step by step—no pictures, just text. We'll focus on one error type at a time to build your autonomous correction skills."
            />
          </Box>

          {/* Learning Overview */}
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>
              What You'll Learn
            </Typography>
            <Typography variant="body1" paragraph sx={{ color: P.blue.shadow }}>
              You'll progressively correct faulty texts by focusing on different error types:
            </Typography>

            <Stack spacing={2}>
              {steps.map((step, i) => (
                <Box key={i} sx={{
                  bgcolor: step.color.bg, border: `2px solid ${step.color.border}`,
                  borderRadius: '16px', boxShadow: `3px 3px 0 ${step.color.shadow}`,
                  p: 2, display: 'flex', alignItems: 'center', gap: 2,
                }}>
                  {step.icon}
                  <Box>
                    <Typography variant="h6" sx={{ color: step.color.shadow }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: step.color.shadow, opacity: 0.8 }}>
                      {step.desc}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Start Button */}
          <Stack direction="row" justifyContent="center">
            <Box component="button" onClick={handleStart} sx={{
              bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
              borderRadius: '12px', boxShadow: `3px 3px 0 ${P.orange.shadow}`,
              px: 5, py: 1.5, fontWeight: 700, fontSize: '1rem',
              cursor: 'pointer', color: P.orange.shadow, minWidth: 300,
              '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.orange.shadow}` },
              '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.orange.shadow}` },
              transition: 'all 0.15s ease',
            }}>
              Start Error Correction Challenge
            </Box>
          </Stack>
        </motion.div>
      </Container>
    </Box>
  )
}
