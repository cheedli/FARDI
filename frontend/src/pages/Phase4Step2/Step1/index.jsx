import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Grid, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import CampaignIcon from '@mui/icons-material/Campaign'
import TagIcon from '@mui/icons-material/Tag'

/**
 * Phase 4.2 Step 1: Engage - Social Media Promotion
 * Scenario setup for social media marketing
 */

export default function Phase4_2Step1Intro() {
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

  const handleStartActivities = () => {
    navigate('/phase4_2/step/1/interaction/1')
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>
              Phase 4.2: Marketing &amp; Promotion (Social Media Focus)
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.shadow }}>
              Step 1: Engage - Social Media Introduction
            </Typography>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}>
              Spark interest by connecting to social media promotion strategies
            </Typography>
          </Box>

          {/* Scenario Introduction */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.teal.shadow, mb: 2 }}>
              Scenario
            </Typography>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="We've planned the festival—now let's get people excited online! Look at these posts with strong captions, hashtags, and calls-to-action. We'll start with a quick game to activate vocabulary, then discuss how they work."
            />
            <Box sx={{
              mt: 3, p: 2,
              bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
              borderRadius: '12px',
            }}>
              <Typography variant="body2" sx={{ color: P.yellow.shadow }}>
                The Cultural Committee gathers to brainstorm social media promotion for the Global Cultures Festival. Ms. Mabrouki shares real examples of Instagram and Twitter/X posts for cultural events.
              </Typography>
            </Box>
          </Box>

          {/* Social Media Examples */}
          <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow, mb: 2 }}>
            Social Media Post Examples
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Instagram Example */}
            <Grid item xs={12} md={6}>
              <Box sx={{
                bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
                borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
                p: 3,
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CampaignIcon sx={{ fontSize: 40, color: P.orange.shadow, mr: 2 }} />
                  <Typography variant="h6" fontWeight="bold" sx={{ color: P.orange.shadow }}>
                    Instagram Post Example
                  </Typography>
                </Box>
                <Box sx={{
                  bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
                  borderRadius: '12px', p: 2,
                }}>
                  <Typography variant="body2" sx={{ mb: 2, color: P.orange.shadow, fontStyle: 'italic' }}>
                    "Experience the world in one place! 🌍✨ Join us for the Global Cultures Festival featuring food, music, and art from 20+ countries. Save the date! #GlobalCultures #CulturalFestival #DiversityMatters"
                  </Typography>
                  <Box component="span" sx={{
                    bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
                    borderRadius: '999px', px: 2, py: 0.5,
                    fontSize: '0.85rem', fontWeight: 700, color: P.orange.shadow,
                    display: 'inline-block'
                  }}>Key Elements: Short caption, emojis, call-to-action, hashtags</Box>
                </Box>
              </Box>
            </Grid>

            {/* Twitter/X Example */}
            <Grid item xs={12} md={6}>
              <Box sx={{
                bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
                borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`,
                p: 3,
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.purple.shadow}` }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TagIcon sx={{ fontSize: 40, color: P.purple.shadow, mr: 2 }} />
                  <Typography variant="h6" fontWeight="bold" sx={{ color: P.purple.shadow }}>
                    Twitter/X Thread Example
                  </Typography>
                </Box>
                <Box sx={{
                  bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
                  borderRadius: '12px', p: 2,
                }}>
                  <Typography variant="body2" sx={{ mb: 1, color: P.purple.shadow }}>
                    <strong>1/3:</strong> Breaking news! 🎉 Our university is hosting the Global Cultures Festival next month!
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, color: P.purple.shadow }}>
                    <strong>2/3:</strong> Experience authentic cuisine, traditional music, and cultural exhibitions. Free entry!
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, color: P.purple.shadow }}>
                    <strong>3/3:</strong> Tag a friend who loves culture! 👥 #GlobalCultures #UniversityEvent
                  </Typography>
                  <Box component="span" sx={{
                    bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
                    borderRadius: '999px', px: 2, py: 0.5,
                    fontSize: '0.85rem', fontWeight: 700, color: P.purple.shadow,
                    display: 'inline-block'
                  }}>Key Elements: Thread format, engagement hook, tagging strategy</Box>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Start Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Box component="button" onClick={handleStartActivities} sx={{
              bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
              borderRadius: '12px', boxShadow: `3px 3px 0 ${P.orange.shadow}`,
              px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
              cursor: 'pointer', color: P.orange.shadow,
              display: 'flex', alignItems: 'center', gap: 1,
              '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.orange.shadow}` },
              '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.orange.shadow}` }
            }}>
              <PlayArrowIcon /> Start Vocabulary Activities
            </Box>
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
