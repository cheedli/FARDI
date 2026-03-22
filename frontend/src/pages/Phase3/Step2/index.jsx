import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Grid, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import ExploreIcon from '@mui/icons-material/Explore'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'

const LIGHT = {
  pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', divider: '#E0E0E0',
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
  yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825', text: '#5D4037' },
  teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
  orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
  red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#C62828' },
  purple: { bg: '#E1BEE7', border: '#8E24AA', shadow: '#8E24AA' },
}
const DARK = {
  pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', divider: '#2A2A4A',
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#A06800', text: '#FFD54F' },
  teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
  orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
  red:    { bg: '#1F0000', border: '#EF9A9A', shadow: '#B71C1C' },
  purple: { bg: '#1E0A2E', border: '#CE93D8', shadow: '#7B1FA2' },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' } }),
}

function clay(c) {
  return {
    bgcolor: c.bg,
    border: `2px solid ${c.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${c.shadow}`,
  }
}

/**
 * Phase 3 Step 2: Explore - Sponsorship & Budgeting
 * Students actively explore how sponsorship and budgeting work in real events
 */

export default function Phase3Step2Intro() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const D = isDark ? DARK : LIGHT

  const handleStartActivities = () => {
    navigate('/app/phase3/step/2/interaction/1')
  }

  const sponsors = [
    { name: 'TechCorp', type: 'Technology company', offer: '$800 cash', wants: 'Logo on all promotional materials' },
    { name: 'CaféPlus', type: 'Local restaurant', offer: '$400 + free coffee', wants: 'Exclusive food vendor rights' },
    { name: 'PrintShop', type: 'Printing service', offer: 'Free poster printing', wants: 'Name mentioned in social media' },
  ]

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: D.pageBg }}>
      <Container maxWidth="md" sx={{ pt: { xs: 3, md: 4 }, pb: 6 }}>

        {/* Phase Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Box sx={{ ...clay(D.green), p: 3, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <ExploreIcon sx={{ fontSize: 40, color: D.green.border }} />
            <Box>
              <Typography variant="h5" fontWeight={800} sx={{ color: D.heading, lineHeight: 1.2 }}>
                Phase 3: Sponsorship &amp; Budgeting
              </Typography>
              <Typography variant="body1" sx={{ color: D.body, mt: 0.5 }}>
                Step 2: Explore — Financial Planning in Action
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Character Message */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Box sx={{ ...clay(D.blue), p: 3, mb: 3 }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="The organizing committee is reviewing sample sponsorship offers and a simplified festival budget. I'm sharing a basic budget table showing venue, logistics, and promotion costs, along with three sponsor profiles. Let's explore how money flows into and out of the event."
            />
          </Box>
        </motion.div>

        {/* Scenario Focus */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          <Box sx={{ ...clay(D.teal), p: 3, mb: 4 }}>
            <Typography variant="h6" fontWeight={800} sx={{ color: D.heading, mb: 1.5 }}>
              Today's session focuses on:
            </Typography>
            {[
              'Analyzing a sample budget table with costs and income',
              'Reviewing three different sponsor profiles and offers',
              'Understanding how to match funding sources to event needs',
            ].map((item, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 0.75 }}>
                <Typography sx={{ color: D.teal.border, fontWeight: 800, mt: 0.1 }}>•</Typography>
                <Typography variant="body2" sx={{ color: D.body }}>{item}</Typography>
              </Box>
            ))}
          </Box>
        </motion.div>

        {/* Budget Section Title */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
          <Typography variant="h6" fontWeight={800} sx={{ color: D.heading, mb: 2 }}>
            Sample Event Budget
          </Typography>
        </motion.div>

        {/* Budget Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
              <Box sx={{ ...clay(D.red), p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
                  <AttachMoneyIcon sx={{ fontSize: 36, color: D.red.border }} />
                  <Typography variant="h6" fontWeight={800} sx={{ color: D.red.border }}>
                    Event Costs (Money Out)
                  </Typography>
                </Box>
                {[
                  ['Venue rental', '$800'],
                  ['Sound equipment', '$500'],
                  ['Catering & refreshments', '$600'],
                  ['Promotion & printing', '$200'],
                  ['Decoration & setup', '$300'],
                ].map(([label, amount], i) => (
                  <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: D.body }}>{label}</Typography>
                    <Typography variant="body2" fontWeight={700} sx={{ color: D.body }}>{amount}</Typography>
                  </Box>
                ))}
                <Box sx={{ borderTop: `2px solid ${D.red.border}`, mt: 2, pt: 1.5 }}>
                  <Typography variant="body1" fontWeight={800} sx={{ color: D.red.border }}>
                    Total Expenses: $2,400
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}>
              <Box sx={{ ...clay(D.green), p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
                  <AccountBalanceIcon sx={{ fontSize: 36, color: D.green.border }} />
                  <Typography variant="h6" fontWeight={800} sx={{ color: D.green.border }}>
                    Income Sources (Money In)
                  </Typography>
                </Box>
                {[
                  ['Ticket sales', '$1,000 (estimated)'],
                  ['Main sponsor (TechCorp)', '$800'],
                  ['Food sponsor (CaféPlus)', '$400'],
                  ['University grant', '$300'],
                  ['Donations', '$100 (estimated)'],
                ].map(([label, amount], i) => (
                  <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: D.body }}>{label}</Typography>
                    <Typography variant="body2" fontWeight={700} sx={{ color: D.body }}>{amount}</Typography>
                  </Box>
                ))}
                <Box sx={{ borderTop: `2px solid ${D.green.border}`, mt: 2, pt: 1.5 }}>
                  <Typography variant="body1" fontWeight={800} sx={{ color: D.green.border }}>
                    Total Income: $2,600
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Grid>
        </Grid>

        {/* Sponsor Profiles Title */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6}>
          <Typography variant="h6" fontWeight={800} sx={{ color: D.heading, mb: 2 }}>
            Sample Sponsor Profiles
          </Typography>
        </motion.div>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          {sponsors.map((s, i) => (
            <Grid item xs={12} md={4} key={s.name}>
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={7 + i}>
                <Box sx={{ ...clay(D.blue), p: 2.5, height: '100%' }}>
                  <Typography variant="h6" fontWeight={800} sx={{ color: D.heading, mb: 1.5 }}>
                    {s.name}
                  </Typography>
                  {[['Type', s.type], ['Offer', s.offer], ['Wants', s.wants]].map(([k, v]) => (
                    <Box key={k} sx={{ mb: 0.75 }}>
                      <Typography component="span" variant="body2" fontWeight={700} sx={{ color: D.body }}>
                        {k}:{' '}
                      </Typography>
                      <Typography component="span" variant="body2" sx={{ color: D.muted }}>
                        {v}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Key Concepts */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={10}>
          <Box sx={{ ...clay(D.yellow), p: 3, mb: 4 }}>
            <Typography variant="h6" fontWeight={800} sx={{ color: D.heading, mb: 2 }}>
              Key Learning Focus
            </Typography>
            <Grid container spacing={2}>
              {[
                ['Recognition', 'Identify costs vs. income sources'],
                ['Selection', 'Choose appropriate funding for specific needs'],
                ['Explanation', 'Explain why sponsors are needed'],
                ['Connection', 'Link funding sources to budget items'],
              ].map(([k, v]) => (
                <Grid item xs={12} sm={6} key={k}>
                  <Typography variant="body2" sx={{ color: D.body }}>
                    <Box component="span" fontWeight={800}>{k}:</Box> {v}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Box>
        </motion.div>

        {/* Start Button */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={11}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              component="button"
              onClick={handleStartActivities}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1,
                bgcolor: D.green.bg, color: D.green.border,
                border: `2px solid ${D.green.border}`,
                borderRadius: '14px',
                boxShadow: `4px 4px 0 ${D.green.shadow}`,
                fontWeight: 800, fontSize: '1rem',
                px: 4, py: 1.5, cursor: 'pointer',
                transition: 'all 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.green.shadow}` },
              }}
            >
              <PlayArrowIcon />
              Start Exploration Activities
            </Box>
          </Box>
        </motion.div>

      </Container>
    </Box>
  )
}
