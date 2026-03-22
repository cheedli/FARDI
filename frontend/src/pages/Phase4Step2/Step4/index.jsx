import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Typography, Box } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'

function Phase4_2Step4Intro() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
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
  const P = isDark ? DARK : LIGHT

  const handleStart = () => {
    navigate('/phase4_2/step/4/interaction/1')
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3, textAlign: 'center',
          }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: P.blue.shadow, mb: 1 }}>
              Phase 4.2 - Step 4: Elaborate
            </Typography>
            <Typography variant="h5" sx={{ color: P.blue.border }}>
              Social Media Post Creation
            </Typography>
          </Box>

          <CharacterMessage
            character="Ms. Mabrouki"
            message="Now apply what we've learned by writing real social media posts for our Global Cultures Festival. Use the guided templates with examples, adapt them to your ideas, and self-check grammar, spelling, and structure before submitting."
          />

          {/* What You'll Create */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: P.teal.shadow }}>
              What You'll Create
            </Typography>
            <Typography variant="body1" paragraph sx={{ color: P.teal.shadow }}>
              In this step, you'll apply your knowledge by creating complete social media posts for the Global Cultures Festival:
            </Typography>
            <Box component="ul" sx={{ pl: 3, color: P.teal.shadow }}>
              <li><Typography variant="body1">Instagram caption with hashtags</Typography></li>
              <li><Typography variant="body1">Twitter/X thread (2-4 tweets)</Typography></li>
              <li><Typography variant="body1">Vocabulary integration using Sushi Spell game</Typography></li>
            </Box>
          </Box>

          {/* Writing Focus Areas */}
          <Box sx={{
            bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: P.purple.shadow }}>
              Writing Focus Areas
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              {[
                { label: 'Grammar', desc: 'Subject-verb agreement, tense consistency' },
                { label: 'Spelling', desc: 'Correct spelling of social media terms' },
                { label: 'Structure', desc: 'Logical flow, CTA placement' },
                { label: 'Vocabulary', desc: 'hashtag, caption, emoji, CTA, engagement' },
                { label: 'Persuasive Language', desc: 'Concise, engaging content' },
                { label: 'Strategic Elements', desc: 'Hashtags, emojis, CTAs, tagging' },
              ].map(({ label, desc }) => (
                <Box key={label}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: P.purple.shadow }}>{label}</Typography>
                  <Typography variant="body2" sx={{ color: P.purple.border }}>{desc}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Alert */}
          <Box sx={{
            bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1, color: P.yellow.shadow }}>
              Important: Use Guided Templates
            </Typography>
            <Typography variant="body2" sx={{ color: P.yellow.shadow }}>
              You'll be provided with templates and examples for each post type. Use them as models adapt the examples to your ideas while maintaining proper grammar, spelling, and structure.
            </Typography>
          </Box>

          {/* Three Writing Tasks */}
          <Box sx={{
            bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: P.orange.shadow }}>
              Three Writing Tasks
            </Typography>
            {[
              { title: 'Interaction 1: Instagram Post', desc: 'Write 4-8 sentence caption + 5-10 hashtags using guided template' },
              { title: 'Interaction 2: Twitter/X Thread', desc: 'Create 2-4 tweet thread with hashtags and CTAs' },
              { title: 'Interaction 3: Vocabulary Polish', desc: 'Play Sushi Spell and revise your posts using new vocabulary' },
            ].map(({ title, desc }, i) => (
              <Box key={i} sx={{ mb: i < 2 ? 2 : 0 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: P.orange.shadow }}>{title}</Typography>
                <Typography variant="body2" sx={{ color: P.orange.border }}>{desc}</Typography>
              </Box>
            ))}
          </Box>

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Box
              component="button"
              onClick={handleStart}
              sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 6, py: 2, fontWeight: 700, fontSize: '1.1rem',
                cursor: 'pointer', color: P.green.shadow,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` },
              }}
            >
              Start Step 4: Elaborate
            </Box>
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}

export default Phase4_2Step4Intro
