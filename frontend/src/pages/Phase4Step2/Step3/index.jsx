import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Typography, Box } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'

function Phase4_2Step3Intro() {
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
    navigate('/phase4_2/step/3/interaction/1')
  }

  const vocabTerms = [
    { term: 'Hashtag (#)', desc: 'Keyword tag to categorize content' },
    { term: 'Caption', desc: 'Text accompanying a post' },
    { term: 'Emoji', desc: 'Visual symbol to express emotion' },
    { term: 'Tag', desc: 'Mention another user (@username)' },
    { term: 'Call-to-Action (CTA)', desc: 'Prompt for audience action' },
    { term: 'Engagement', desc: 'Likes, comments, shares' },
    { term: 'Viral', desc: 'Content spreading rapidly' },
    { term: 'Story', desc: 'Temporary 24-hour post' },
    { term: 'Thread', desc: 'Series of connected posts' },
    { term: 'Reach', desc: 'Number of people who see content' },
  ]

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3, textAlign: 'center'
          }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: P.blue.shadow, mb: 1 }}>
              Phase 4.2 - Step 3: Explain
            </Typography>
            <Typography variant="h5" sx={{ color: P.blue.border, fontWeight: 700 }}>
              Social Media Post Creation
            </Typography>
          </Box>

          {/* Character Message */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3
          }}>
            <CharacterMessage
              character="Ms. Mabrouki"
              message="Now let's explain how to make great social media posts for our festival. We will watch three short videos: first on writing captions & hashtags, then two real post examples. Listen carefully and get ready to talk about the terms."
            />
          </Box>

          {/* What You'll Learn */}
          <Box sx={{
            bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
            p: 3, mb: 3
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: P.orange.shadow }}>
              What You'll Learn
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              In this step, you'll formalize your understanding of effective social media posts for event promotion. You'll explore:
            </Typography>
            <Box component="ul" sx={{ pl: 3, m: 0 }}>
              <li><Typography variant="body1">Writing effective Instagram captions</Typography></li>
              <li><Typography variant="body1">Creating Twitter/X threads</Typography></li>
              <li><Typography variant="body1">Facebook announcements</Typography></li>
              <li><Typography variant="body1">Key glossary terms: hashtag, caption, emoji, tag, call-to-action (CTA), engagement, viral, story, thread, reach</Typography></li>
            </Box>
          </Box>

          {/* Key Terms */}
          <Box sx={{
            bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`,
            p: 3, mb: 3
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: P.purple.shadow }}>
              Key Social Media Terms
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              {vocabTerms.map((item, idx) => (
                <Box key={idx}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{item.term}</Typography>
                  <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Start Button */}
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Box component="button" onClick={handleStart} sx={{
              bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
              borderRadius: '12px', boxShadow: `3px 3px 0 ${P.orange.shadow}`,
              px: 6, py: 2, fontWeight: 700, fontSize: '1.1rem',
              cursor: 'pointer', color: P.orange.shadow,
              '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.orange.shadow}` },
              '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.orange.shadow}` }
            }}>
              Start Step 3: Explain
            </Box>
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}

export default Phase4_2Step3Intro
