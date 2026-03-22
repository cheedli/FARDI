import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container, Grid, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import SchoolIcon from '@mui/icons-material/School'
import CreateIcon from '@mui/icons-material/Create'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import CampaignIcon from '@mui/icons-material/Campaign'

// ── Clay palette ──────────────────────────────────────────────────────────────
const LIGHT = {
  pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F',
  muted: '#78909C', divider: '#E0E0E0',
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
  yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825', text: '#5D4037' },
  orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
  teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
}
const DARK = {
  pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5',
  muted: '#607D8B', divider: '#2A2A4A',
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#A06800', text: '#FFD54F' },
  orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
  teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' } }),
}

/**
 * Phase 3 Step 4: Apply - Sponsorship & Budgeting
 * Students create authentic outputs: mini budget and sponsor pitch
 */

export default function Phase3Step4Intro() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const D = isDark ? DARK : LIGHT

  const handleStartActivities = () => {
    navigate('/app/phase3/step/4/interaction/1')
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: D.pageBg }}>
      <Container maxWidth="md" sx={{ pt: { xs: 3, md: 4 }, pb: 6 }}>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Box sx={{
            bgcolor: D.yellow.bg,
            border: `2px solid ${D.yellow.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${D.yellow.shadow}`,
            p: 3, mb: 3,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Box sx={{ px: 1.75, py: 0.4, borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800,
                bgcolor: D.orange.bg, border: `2px solid ${D.orange.border}`, color: D.orange.border }}>
                Phase 3
              </Box>
              <Box sx={{ px: 1.75, py: 0.4, borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800,
                bgcolor: D.green.bg, border: `2px solid ${D.green.border}`, color: D.green.border }}>
                Step 4 — Apply
              </Box>
            </Box>
            <Typography variant="h4" fontWeight={800} sx={{ color: D.heading }}>
              Sponsorship &amp; Budgeting
            </Typography>
            <Typography variant="body1" sx={{ color: D.body, mt: 0.5 }}>
              Design a mini event budget and create a persuasive sponsor pitch
            </Typography>
          </Box>
        </motion.div>

        {/* Scenario Introduction */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Box sx={{
            bgcolor: D.cardBg,
            border: `2px solid ${D.divider}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${D.divider}`,
            p: 3, mb: 3,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <SchoolIcon sx={{ color: D.heading }} />
              <Typography variant="h6" fontWeight={800} sx={{ color: D.heading }}>Scenario</Typography>
            </Box>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Now that we understand budgets and sponsorship, it's time to create our own! You will design a budget and convince a sponsor to support the festival. This is your chance to apply everything you've learned about financial planning and persuasive communication."
            />
            <Box sx={{
              mt: 3, p: 2,
              bgcolor: D.yellow.bg,
              border: `2px solid ${D.yellow.border}`,
              borderRadius: '14px',
            }}>
              <Typography variant="body2" fontWeight={700} sx={{ color: D.body, mb: 1 }}>
                In this step, you will:
              </Typography>
              {[
                'Create a mini budget with costs and funding sources',
                'Write a persuasive sponsor pitch',
                'Justify your financial decisions clearly',
              ].map((item, i) => (
                <Box key={i} sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
                  <Typography sx={{ color: D.yellow.border, fontWeight: 800 }}>•</Typography>
                  <Typography variant="body2" sx={{ color: D.body }}>{item}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </motion.div>

        {/* What You Will Create */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <CreateIcon sx={{ color: D.heading }} />
            <Typography variant="h6" fontWeight={800} sx={{ color: D.heading }}>
              What You Will Create
            </Typography>
          </Box>
        </motion.div>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Task 1 */}
          <Grid item xs={12} md={6}>
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
              <Box sx={{
                bgcolor: D.blue.bg,
                border: `2px solid ${D.blue.border}`,
                borderRadius: '20px',
                boxShadow: `4px 4px 0 ${D.blue.shadow}`,
                p: 3, height: '100%',
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                  <AccountBalanceIcon sx={{ fontSize: 36, color: D.blue.border }} />
                  <Typography variant="h6" fontWeight={800} sx={{ color: D.heading }}>
                    Task 1: Budget Creation
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: D.body, mb: 2 }}>
                  Design a mini budget for the Global Cultures Festival including:
                </Typography>
                {[
                  'At least 4 cost items (venue, sound, promotion, logistics)',
                  'At least 1 funding source (sponsor, ticket sales, donation)',
                  'Clear categories and justifications',
                ].map((item, i) => (
                  <Box key={i} sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
                    <Typography sx={{ color: D.blue.border, fontWeight: 800 }}>•</Typography>
                    <Typography variant="body2" sx={{ color: D.body }}>{item}</Typography>
                  </Box>
                ))}
              </Box>
            </motion.div>
          </Grid>

          {/* Task 2 */}
          <Grid item xs={12} md={6}>
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
              <Box sx={{
                bgcolor: D.green.bg,
                border: `2px solid ${D.green.border}`,
                borderRadius: '20px',
                boxShadow: `4px 4px 0 ${D.green.shadow}`,
                p: 3, height: '100%',
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                  <CampaignIcon sx={{ fontSize: 36, color: D.green.border }} />
                  <Typography variant="h6" fontWeight={800} sx={{ color: D.heading }}>
                    Task 2: Sponsor Pitch
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: D.body, mb: 2 }}>
                  Write a persuasive pitch to convince a company to sponsor the festival:
                </Typography>
                {[
                  'Explain what the festival is',
                  'Justify why funding is needed',
                  'Show what the sponsor gains (visibility, image, values)',
                ].map((item, i) => (
                  <Box key={i} sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
                    <Typography sx={{ color: D.green.border, fontWeight: 800 }}>•</Typography>
                    <Typography variant="body2" sx={{ color: D.body }}>{item}</Typography>
                  </Box>
                ))}
              </Box>
            </motion.div>
          </Grid>
        </Grid>

        {/* Start Button */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Box
              component="button"
              onClick={handleStartActivities}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1,
                px: 4, py: 1.5,
                bgcolor: D.orange.bg,
                border: `2px solid ${D.orange.border}`,
                borderRadius: '14px',
                boxShadow: `4px 4px 0 ${D.orange.shadow}`,
                fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
                color: D.orange.border,
                transition: 'all 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.orange.shadow}` },
              }}
            >
              <PlayArrowIcon />
              Start Creating Your Budget &amp; Pitch
            </Box>
          </Box>
        </motion.div>

      </Container>
    </Box>
  )
}
