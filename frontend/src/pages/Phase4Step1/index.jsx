import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Grid, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../components/Avatar.jsx'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

/**
 * Phase 4 Step 1: Intro - Scenario Setup
 * Shows the context with poster and video examples before activities begin
 */

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

export default function Phase4Step1Intro() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const handleStartActivities = () => {
    navigate('/phase4/step/1/interaction/1')
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: isDark ? DARK.pageBg : LIGHT.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: isDark ? DARK.blue.bg : LIGHT.blue.bg,
            border: `2px solid ${isDark ? DARK.blue.border : LIGHT.blue.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${isDark ? DARK.blue.shadow : LIGHT.blue.shadow}`,
            p: 3, mb: 3,
            transition: 'transform 0.15s, box-shadow 0.15s',
            '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${isDark ? DARK.blue.shadow : LIGHT.blue.shadow}` }
          }}>
            <Typography variant="h5" gutterBottom fontWeight={700} color={isDark ? DARK.blue.border : LIGHT.blue.shadow}>
              Phase 4: Marketing &amp; Promotion
            </Typography>
            <Typography variant="h6" gutterBottom fontWeight={700} color={isDark ? DARK.blue.border : LIGHT.blue.shadow}>
              Step 1: Engage
            </Typography>
            <Typography variant="body1" color={isDark ? 'rgba(255,255,255,0.8)' : 'text.secondary'}>
              Spark interest by connecting to prior knowledge of event promotion
            </Typography>
          </Box>

          {/* Scenario Introduction */}
          <Box sx={{
            bgcolor: isDark ? DARK.teal.bg : LIGHT.teal.bg,
            border: `2px solid ${isDark ? DARK.teal.border : LIGHT.teal.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${isDark ? DARK.teal.shadow : LIGHT.teal.shadow}`,
            p: 3, mb: 4,
            transition: 'transform 0.15s, box-shadow 0.15s',
            '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${isDark ? DARK.teal.shadow : LIGHT.teal.shadow}` }
          }}>
            <Typography variant="h6" gutterBottom fontWeight={700} color={isDark ? DARK.teal.border : LIGHT.teal.shadow} sx={{ mb: 2 }}>
              Scenario
            </Typography>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="We've planned the event—now let's get people excited! Look at this poster with its bold slogan and eye-catching colors, and this video teaser showing quick clips of dances and music. We'll start with a quick individual game to activate vocabulary, then discuss what you notice in these examples and how they promote events."
            />
          </Box>

          {/* Examples Section */}
          <Typography variant="h6" gutterBottom fontWeight={700} color={isDark ? DARK.purple.border : LIGHT.purple.shadow} sx={{ mb: 2 }}>
            Promotion Examples
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Poster Example */}
            <Grid item xs={12} md={6}>
              <Box sx={{
                bgcolor: isDark ? DARK.purple.bg : LIGHT.purple.bg,
                border: `2px solid ${isDark ? DARK.purple.border : LIGHT.purple.border}`,
                borderRadius: '20px',
                boxShadow: `4px 4px 0 ${isDark ? DARK.purple.shadow : LIGHT.purple.shadow}`,
                overflow: 'hidden',
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${isDark ? DARK.purple.shadow : LIGHT.purple.shadow}` }
              }}>
                <Box
                  component="img"
                  src="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/e7dd90239337541.67f47284ce71c.png"
                  alt="Cultural Festival Poster Example"
                  sx={{ width: '100%', height: 300, objectFit: 'contain', backgroundColor: isDark ? '#111' : '#f5f5f5' }}
                />
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom fontWeight={700} color={isDark ? DARK.purple.border : LIGHT.purple.shadow}>
                    Festival Poster Example
                  </Typography>
                  <Typography variant="body2" color={isDark ? 'rgba(255,255,255,0.7)' : 'text.secondary'} sx={{ mb: 2 }}>
                    Notice the bold colors, clear slogan, and eye-catching design that draws attention to the event.
                  </Typography>
                  <Box
                    component="a"
                    href="https://www.behance.net/gallery/239337541/Backdrop-design"
                    target="_blank"
                    sx={{
                      bgcolor: isDark ? DARK.purple.bg : LIGHT.purple.bg,
                      border: `2px solid ${isDark ? DARK.purple.border : LIGHT.purple.border}`,
                      borderRadius: '12px',
                      boxShadow: `3px 3px 0 ${isDark ? DARK.purple.shadow : LIGHT.purple.shadow}`,
                      px: 2, py: 1,
                      fontWeight: 700, fontSize: '0.9rem',
                      cursor: 'pointer', color: isDark ? DARK.purple.border : LIGHT.purple.shadow,
                      textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 0.5,
                      transition: 'transform 0.15s, box-shadow 0.15s',
                      '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${isDark ? DARK.purple.shadow : LIGHT.purple.shadow}` },
                    }}
                  >
                    <OpenInNewIcon sx={{ fontSize: 16 }} />
                    View Full Poster
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Video Example */}
            <Grid item xs={12} md={6}>
              <Box sx={{
                bgcolor: isDark ? DARK.purple.bg : LIGHT.purple.bg,
                border: `2px solid ${isDark ? DARK.purple.border : LIGHT.purple.border}`,
                borderRadius: '20px',
                boxShadow: `4px 4px 0 ${isDark ? DARK.purple.shadow : LIGHT.purple.shadow}`,
                overflow: 'hidden',
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${isDark ? DARK.purple.shadow : LIGHT.purple.shadow}` }
              }}>
                <Box
                  onClick={() => window.open('https://www.youtube.com/watch?v=Vc9UQoPk0EI', '_blank')}
                  sx={{ position: 'relative', cursor: 'pointer' }}
                >
                  <Box
                    component="img"
                    src="https://img.youtube.com/vi/Vc9UQoPk0EI/maxresdefault.jpg"
                    alt="Cultural Festival Video Thumbnail"
                    sx={{ width: '100%', height: 300, objectFit: 'cover', backgroundColor: '#000', display: 'block' }}
                    onError={(e) => {
                      e.target.src = 'https://img.youtube.com/vi/Vc9UQoPk0EI/hqdefault.jpg'
                    }}
                  />
                  <Box sx={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    transition: 'background-color 0.3s',
                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.5)' }
                  }}>
                    <PlayCircleOutlineIcon sx={{ fontSize: 80, color: 'white', filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))' }} />
                  </Box>
                </Box>
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom fontWeight={700} color={isDark ? DARK.purple.border : LIGHT.purple.shadow}>
                    Promotional Video Teaser
                  </Typography>
                  <Typography variant="body2" color={isDark ? 'rgba(255,255,255,0.7)' : 'text.secondary'} sx={{ mb: 2 }}>
                    Watch how the video uses dynamic clips of dances, music, and festivities to create excitement.
                  </Typography>
                  <Box
                    component="button"
                    onClick={() => window.open('https://www.youtube.com/watch?v=Vc9UQoPk0EI', '_blank')}
                    sx={{
                      width: '100%',
                      bgcolor: isDark ? DARK.orange.bg : LIGHT.orange.bg,
                      border: `2px solid ${isDark ? DARK.orange.border : LIGHT.orange.border}`,
                      borderRadius: '12px',
                      boxShadow: `3px 3px 0 ${isDark ? DARK.orange.shadow : LIGHT.orange.shadow}`,
                      px: 3, py: 1.5,
                      fontWeight: 700, fontSize: '0.9rem',
                      cursor: 'pointer', color: isDark ? DARK.orange.border : LIGHT.orange.shadow,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                      transition: 'transform 0.15s, box-shadow 0.15s',
                      '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${isDark ? DARK.orange.shadow : LIGHT.orange.shadow}` },
                      '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${isDark ? DARK.orange.shadow : LIGHT.orange.shadow}` }
                    }}
                  >
                    <PlayCircleOutlineIcon sx={{ fontSize: 18 }} />
                    Watch Video
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Key Observations */}
          <Box sx={{
            bgcolor: isDark ? DARK.teal.bg : LIGHT.teal.bg,
            border: `2px solid ${isDark ? DARK.teal.border : LIGHT.teal.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${isDark ? DARK.teal.shadow : LIGHT.teal.shadow}`,
            p: 3, mb: 4,
            transition: 'transform 0.15s, box-shadow 0.15s',
            '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${isDark ? DARK.teal.shadow : LIGHT.teal.shadow}` }
          }}>
            <Typography variant="h6" gutterBottom fontWeight={700} color={isDark ? DARK.teal.border : LIGHT.teal.shadow}>
              What to Notice
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <Typography component="li" variant="body1" sx={{ mb: 1, color: isDark ? 'rgba(255,255,255,0.9)' : 'text.primary' }}>
                <strong>Slogans:</strong> Catchy phrases that communicate the event's message
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1, color: isDark ? 'rgba(255,255,255,0.9)' : 'text.primary' }}>
                <strong>Eye-catchers:</strong> Bold colors, images, and design elements that grab attention
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1, color: isDark ? 'rgba(255,255,255,0.9)' : 'text.primary' }}>
                <strong>Features:</strong> Highlighted activities, performances, and attractions
              </Typography>
              <Typography component="li" variant="body1" sx={{ color: isDark ? 'rgba(255,255,255,0.9)' : 'text.primary' }}>
                <strong>Format:</strong> Different media (posters, videos, ads) reach different audiences
              </Typography>
            </Box>
          </Box>

          {/* Start Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Box
              component="button"
              onClick={handleStartActivities}
              sx={{
                bgcolor: isDark ? DARK.orange.bg : LIGHT.orange.bg,
                border: `2px solid ${isDark ? DARK.orange.border : LIGHT.orange.border}`,
                borderRadius: '12px',
                boxShadow: `3px 3px 0 ${isDark ? DARK.orange.shadow : LIGHT.orange.shadow}`,
                px: 6, py: 2,
                fontWeight: 700, fontSize: '1.1rem',
                cursor: 'pointer', color: isDark ? DARK.orange.border : LIGHT.orange.shadow,
                display: 'flex', alignItems: 'center', gap: 1,
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${isDark ? DARK.orange.shadow : LIGHT.orange.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${isDark ? DARK.orange.shadow : LIGHT.orange.shadow}` }
              }}
            >
              <PlayArrowIcon />
              Start Activities
            </Box>
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
