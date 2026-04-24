import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Grid, Stack, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import ExploreIcon from '@mui/icons-material/Explore'
import CreateIcon from '@mui/icons-material/Create'

/**
 * Phase 4.2 Step 2: Explore - Social Media Post Writing
 * Students explore real posts and write trial captions
 */

export default function Phase4_2Step2Intro() {
  const navigate = useNavigate()
  useEffect(() => { window.__remedialSkip = () => navigate('/phase4_2/step/2/interaction/1') }, [])
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
    navigate('/phase4_2/step/2/interaction/1')
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>
              Phase 4.2: Marketing & Promotion (Social Media Focus)
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.shadow }}>
              Step 2: Explore - Real Social Media Posts
            </Typography>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}>
              Explore effective social media elements and write your own trial captions
            </Typography>
          </Box>

          {/* Scenario Introduction */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 4
          }}>
            <Typography variant="h6" gutterBottom sx={{ color: P.teal.shadow, mb: 2 }}>
              <ExploreIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Scenario
            </Typography>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Let's explore how real posts attract people! Look at these examples, then write your own short trial post for our festival."
            />
            <Box sx={{ mt: 3, p: 2, bgcolor: P.yellow.bg, border: `1px solid ${P.yellow.border}`, borderRadius: '12px' }}>
              <Typography variant="body2" sx={{ color: P.yellow.shadow }}>
                The committee explores real social media posts from successful cultural events to identify what makes them engaging and effective.
              </Typography>
            </Box>
          </Box>

          {/* Example Posts */}
          <Typography variant="h6" gutterBottom sx={{ color: P.blue.shadow, mb: 2 }}>
            <CreateIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            Real Social Media Post Examples
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Instagram Example */}
            <Grid item xs={12} md={6}>
              <Box sx={{
                bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
                borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
                p: 3, height: '100%',
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2
                  }}>
                    <Typography sx={{ color: 'white', fontWeight: 'bold' }}>IG</Typography>
                  </Box>
                  <Typography variant="h6" sx={{ color: P.orange.shadow, fontWeight: 'bold' }}>
                    Instagram Caption Example
                  </Typography>
                </Box>
                <Box sx={{ p: 2, bgcolor: P.yellow.bg, border: `1px solid ${P.yellow.border}`, borderRadius: '12px', mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 2, color: P.orange.shadow, whiteSpace: 'pre-line' }}>
                    "Experience the world in one place! 🌍✨{'\n\n'}Join us for the Global Cultures Festival featuring food, music, and art from 20+ countries.{'\n\n'}Save the date! March 8th 📅{'\n\n'}Tag a friend who loves culture! 👥{'\n\n'}#GlobalCultures #CulturalFestival #DiversityMatters #UniversityLife"
                  </Typography>
                </Box>
                <Box sx={{ p: 2, bgcolor: P.green.bg, border: `1px solid ${P.green.border}`, borderRadius: '12px' }}>
                  <Typography variant="caption" fontWeight="bold" sx={{ color: P.green.shadow }}>
                    Effective Elements:
                  </Typography>
                  <Stack spacing={1} sx={{ mt: 1 }}>
                    {['✓ Eye-catching emoji', '✓ Clear call-to-action', '✓ Multiple relevant hashtags', '✓ Direct audience engagement'].map(label => (
                      <Box key={label} component="span" sx={{
                        bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                        borderRadius: '999px', px: 2, py: 0.5,
                        fontSize: '0.85rem', fontWeight: 700, color: P.green.shadow,
                        display: 'inline-block'
                      }}>{label}</Box>
                    ))}
                  </Stack>
                </Box>
              </Box>
            </Grid>

            {/* Twitter/X Thread Example */}
            <Grid item xs={12} md={6}>
              <Box sx={{
                bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
                p: 3, height: '100%',
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{
                    width: 40, height: 40, borderRadius: '50%',
                    backgroundColor: '#1DA1F2',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2
                  }}>
                    <Typography sx={{ color: 'white', fontWeight: 'bold' }}>𝕏</Typography>
                  </Box>
                  <Typography variant="h6" sx={{ color: P.blue.shadow, fontWeight: 'bold' }}>
                    Twitter/X Thread Example
                  </Typography>
                </Box>
                <Box sx={{ p: 2, bgcolor: P.yellow.bg, border: `1px solid ${P.yellow.border}`, borderRadius: '12px', mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1.5, color: P.blue.shadow }}>
                    <strong>🧵 1/3:</strong> Breaking news! 🎉 Our university is hosting the Global Cultures Festival next month! Get ready for an unforgettable experience.
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1.5, color: P.blue.shadow }}>
                    <strong>2/3:</strong> Experience authentic cuisine, traditional music, and cultural exhibitions from around the world. Free entry for all students! 🎭🎵
                  </Typography>
                  <Typography variant="body2" sx={{ color: P.blue.shadow }}>
                    <strong>3/3:</strong> Mark your calendars: March 8th! Tag a friend who loves exploring new cultures 👥 #GlobalCultures #CampusEvent
                  </Typography>
                </Box>
                <Box sx={{ p: 2, bgcolor: P.teal.bg, border: `1px solid ${P.teal.border}`, borderRadius: '12px' }}>
                  <Typography variant="caption" fontWeight="bold" sx={{ color: P.teal.shadow }}>
                    Effective Elements:
                  </Typography>
                  <Stack spacing={1} sx={{ mt: 1 }}>
                    {['✓ Thread format for storytelling', '✓ Engaging hook (Breaking news!)', '✓ Specific details and benefits', '✓ Tag friends strategy'].map(label => (
                      <Box key={label} component="span" sx={{
                        bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
                        borderRadius: '999px', px: 2, py: 0.5,
                        fontSize: '0.85rem', fontWeight: 700, color: P.teal.shadow,
                        display: 'inline-block'
                      }}>{label}</Box>
                    ))}
                  </Stack>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Activity Preview */}
          <Box sx={{
            bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`,
            p: 3, mb: 4
          }}>
            <Typography variant="h6" gutterBottom sx={{ color: P.purple.shadow, fontWeight: 'bold' }}>
              What You'll Do:
            </Typography>
            <Stack spacing={2}>
              {[
                { num: '1', title: 'Play Sushi Spell & Write', desc: 'Activate vocabulary with Sushi Spell, then write your own 3–6 sentence Instagram post for the Global Cultures Festival' },
                { num: '2', title: 'Explain Engagement', desc: 'Identify one element (hashtag, emoji, or CTA) from your post and explain why it makes your post engaging' },
                { num: '3', title: 'Revise & Improve', desc: 'Play Sushi Spell again, then improve one sentence using a new social media term' },
              ].map(item => (
                <Box key={item.num} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box component="span" sx={{
                    bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
                    borderRadius: '999px', px: 2, py: 0.5,
                    fontSize: '1rem', fontWeight: 700, color: P.purple.shadow,
                    display: 'inline-block', minWidth: 36, textAlign: 'center'
                  }}>{item.num}</Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ color: P.purple.shadow }}>{item.title}</Typography>
                    <Typography variant="body2" sx={{ color: isDark ? '#ccc' : '#555' }}>{item.desc}</Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Start Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Box component="button" onClick={handleStartActivities} sx={{
              bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
              borderRadius: '12px', boxShadow: `3px 3px 0 ${P.orange.shadow}`,
              px: 5, py: 1.5, fontWeight: 700, fontSize: '1.1rem',
              cursor: 'pointer', color: P.orange.shadow,
              display: 'flex', alignItems: 'center', gap: 1,
              transition: 'transform 0.15s, box-shadow 0.15s',
              '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.orange.shadow}` },
              '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.orange.shadow}` }
            }}>
              <PlayArrowIcon />
              Start Exploring & Writing
            </Box>
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
