import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Grid, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../components/Avatar.jsx'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

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

/**
 * Phase 5 Step 1: Engage - Handling a Last-Minute Issue
 * Intro page with scenario setup and real examples
 */

export default function Phase5Step1Intro() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const P = isDark ? DARK : LIGHT

  const handleStartActivities = () => {
    navigate('/phase5/subphase/1/step/1/interaction/1')
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: P.blue.bg,
            border: `2px solid ${P.blue.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h4" gutterBottom fontWeight={700} color={P.blue.border}>
              Phase 5: Execution &amp; Problem-Solving
            </Typography>
            <Typography variant="h5" gutterBottom color={P.blue.shadow}>
              Step 1: Engage - Handling a Last-Minute Issue
            </Typography>
            <Typography variant="body1" color={isDark ? 'rgba(255,255,255,0.7)' : 'text.secondary'}>
              Develop problem-solving skills by managing unexpected challenges during the Global Cultures Festival
            </Typography>
          </Box>

          {/* Scenario Introduction */}
          <Box sx={{
            bgcolor: P.teal.bg,
            border: `2px solid ${P.teal.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h6" gutterBottom fontWeight={700} color={P.teal.shadow} sx={{ mb: 2 }}>
              Scenario
            </Typography>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="We have a big problem! The main singer just canceled due to illness, and the Global Cultures Festival starts soon. We need to solve this quickly and professionally. Let's discuss how to handle this last-minute issue and keep the festival running smoothly."
            />
          </Box>

          {/* Real Examples Section */}
          <Typography variant="h6" gutterBottom fontWeight={700} color={P.blue.shadow} sx={{ mb: 1 }}>
            Real-World Examples
          </Typography>
          <Typography variant="body2" color={isDark ? 'rgba(255,255,255,0.6)' : 'text.secondary'} sx={{ mb: 2 }}>
            Before we start, let's look at how real events handle last-minute problems:
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Festival Cancellation Email Example */}
            <Grid item xs={12} md={6}>
              <Box sx={{
                bgcolor: P.orange.bg,
                border: `2px solid ${P.orange.border}`,
                borderRadius: '20px',
                boxShadow: `4px 4px 0 ${P.orange.shadow}`,
                p: 3, height: '100%',
              }}>
                <Typography variant="h6" gutterBottom fontWeight={700} color={P.orange.shadow}>
                  Festival Cancellation Email
                </Typography>
                <Typography variant="body2" color={isDark ? 'rgba(255,255,255,0.7)' : 'text.secondary'} sx={{ mb: 2 }}>
                  See how professional event organizers communicate cancellations and changes to attendees.
                </Typography>
                <Box
                  component="a"
                  href="https://theeventscalendar.com/blog/event-cancellation-announcement-examples/"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: 'inline-flex', alignItems: 'center', gap: 0.5,
                    bgcolor: P.orange.bg,
                    border: `2px solid ${P.orange.border}`,
                    borderRadius: '10px',
                    boxShadow: `2px 2px 0 ${P.orange.shadow}`,
                    px: 2, py: 1,
                    fontWeight: 600, fontSize: '0.85rem',
                    color: P.orange.shadow,
                    textDecoration: 'none',
                    cursor: 'pointer',
                    transition: 'transform 0.15s, box-shadow 0.15s',
                    '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `4px 4px 0 ${P.orange.shadow}` },
                  }}
                >
                  <OpenInNewIcon sx={{ fontSize: 16 }} />
                  View Cancellation Examples
                </Box>
              </Box>
            </Grid>

            {/* Last-Minute Change Announcement */}
            <Grid item xs={12} md={6}>
              <Box sx={{
                bgcolor: P.orange.bg,
                border: `2px solid ${P.orange.border}`,
                borderRadius: '20px',
                boxShadow: `4px 4px 0 ${P.orange.shadow}`,
                p: 3, height: '100%',
              }}>
                <Typography variant="h6" gutterBottom fontWeight={700} color={P.orange.shadow}>
                  Social Media Change Announcement
                </Typography>
                <Typography variant="body2" color={isDark ? 'rgba(255,255,255,0.7)' : 'text.secondary'} sx={{ mb: 2 }}>
                  Learn how events use social media to quickly inform people about last-minute changes.
                </Typography>
                <Box
                  component="a"
                  href="https://twitter.com/example/status/change-post"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: 'inline-flex', alignItems: 'center', gap: 0.5,
                    bgcolor: P.orange.bg,
                    border: `2px solid ${P.orange.border}`,
                    borderRadius: '10px',
                    boxShadow: `2px 2px 0 ${P.orange.shadow}`,
                    px: 2, py: 1,
                    fontWeight: 600, fontSize: '0.85rem',
                    color: P.orange.shadow,
                    textDecoration: 'none',
                    cursor: 'pointer',
                    transition: 'transform 0.15s, box-shadow 0.15s',
                    '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `4px 4px 0 ${P.orange.shadow}` },
                  }}
                >
                  <OpenInNewIcon sx={{ fontSize: 16 }} />
                  View Social Media Examples
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Learning Outcomes */}
          <Box sx={{
            bgcolor: P.teal.bg,
            border: `2px solid ${P.teal.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h6" gutterBottom fontWeight={700} color={P.teal.shadow}>
              What You'll Learn
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              {[
                { label: 'Problem-Solving Vocabulary', desc: 'problem, cancel, change, solution, sorry, alternative, fix, urgent' },
                { label: 'Solution Strategies', desc: 'How to suggest and explain solutions professionally' },
                { label: 'Communication Skills', desc: 'Writing clear messages and announcements' },
                { label: 'Professional Tone', desc: 'Maintaining calm and professional communication during crises' },
              ].map((item, i) => (
                <Typography key={i} component="li" variant="body1" sx={{ mb: 1, color: isDark ? 'rgba(255,255,255,0.85)' : 'text.primary' }}>
                  <strong>{item.label}:</strong> {item.desc}
                </Typography>
              ))}
            </Box>
          </Box>

          {/* Key Vocabulary Preview */}
          <Box sx={{
            bgcolor: P.yellow.bg,
            border: `2px solid ${P.yellow.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.yellow.shadow}`,
            p: 3, mb: 4,
          }}>
            <Typography variant="h6" gutterBottom fontWeight={700} color={P.yellow.shadow}>
              Key Vocabulary You'll Practice
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              {['problem', 'cancel', 'change', 'solution', 'sorry', 'alternative', 'fix', 'urgent'].map((word, idx) => (
                <Box key={idx} sx={{
                  bgcolor: P.orange.bg,
                  border: `2px solid ${P.orange.border}`,
                  borderRadius: '999px',
                  boxShadow: `2px 2px 0 ${P.orange.shadow}`,
                  px: 2, py: 0.5,
                  fontWeight: 700, fontSize: '0.85rem',
                  color: P.orange.shadow,
                }}>
                  {word}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Start Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              component="button"
              onClick={handleStartActivities}
              sx={{
                bgcolor: P.blue.bg,
                border: `2px solid ${P.blue.border}`,
                borderRadius: '14px',
                boxShadow: `4px 4px 0 ${P.blue.shadow}`,
                px: 6, py: 2,
                fontWeight: 700, fontSize: '1.1rem',
                cursor: 'pointer',
                color: P.blue.shadow,
                display: 'inline-flex', alignItems: 'center', gap: 1,
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.blue.shadow}` },
              }}
            >
              <PlayArrowIcon />
              Start Problem-Solving Activities
            </Box>
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
