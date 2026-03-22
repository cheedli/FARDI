import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, useTheme, Grid } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { motion } from 'framer-motion'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import SchoolIcon from '@mui/icons-material/School'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import DescriptionIcon from '@mui/icons-material/Description'

/**
 * Phase 3 Step 3: Explain - Sponsorship & Budgeting
 * Students move from exploration to explicit understanding
 */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' } })
}

export default function Phase3Step3Intro() {
  const navigate = useNavigate()
  const muiTheme = useTheme()
  const dark = muiTheme.palette.mode === 'dark'

  const D = dark
    ? { pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', divider: '#2A2A4A' }
    : { pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', divider: '#E0E0E0' }

  const C = dark
    ? {
        green:  { bg: '#1B2E1B', border: '#388E3C', shadow: '#388E3C' },
        blue:   { bg: '#0D1B2A', border: '#1976D2', shadow: '#1976D2' },
        yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#F9A825', text: '#FFD54F' },
        purple: { bg: '#1E0A26', border: '#8E24AA', shadow: '#8E24AA' },
        teal:   { bg: '#002A2E', border: '#0097A7', shadow: '#0097A7' },
        orange: { bg: '#2A1500', border: '#F57C00', shadow: '#F57C00' },
        red:    { bg: '#2A0A0A', border: '#C62828', shadow: '#C62828' },
      }
    : {
        green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
        blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
        yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825', text: '#5D4037' },
        purple: { bg: '#E1BEE7', border: '#8E24AA', shadow: '#8E24AA' },
        teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
        orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
        red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#C62828' },
      }

  const handleStartActivities = () => {
    navigate('/app/phase3/step/3/interaction/1')
  }

  const card = (c) => ({
    bgcolor: c.bg,
    border: `2px solid ${c.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${c.shadow}`,
    p: 2.5,
  })

  const interactions = [
    { label: 'Interaction 1', title: 'Guided Explanation', desc: 'Identify and underline reasons in budget explanations', c: C.blue },
    { label: 'Interaction 2', title: 'Sentence Transformation', desc: 'Combine sentences using "because" or "so"', c: C.teal },
    { label: 'Interaction 3', title: 'Justification Practice', desc: 'Write explanations for budget items', c: C.purple },
  ]

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: D.pageBg }}>
      <Container maxWidth="md" sx={{ pt: { xs: 3, md: 4 }, pb: 6 }}>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Box sx={{ ...card(C.green), mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Box sx={{ px: 1.75, py: 0.4, borderRadius: '50px', bgcolor: C.green.border, fontSize: '0.8rem', fontWeight: 800, color: '#fff' }}>
                Phase 3 · Step 3
              </Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: D.heading, mb: 0.5 }}>
              Sponsorship &amp; Budgeting
            </Typography>
            <Typography variant="h6" sx={{ color: D.body, fontWeight: 700 }}>
              Step 3: Explain — Understanding Financial Concepts
            </Typography>
            <Typography sx={{ color: D.muted, mt: 0.5 }}>
              Learn to explain costs, justify funding choices, and use cause-effect language
            </Typography>
          </Box>
        </motion.div>

        {/* Scenario */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Box sx={{ ...card(C.blue), mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <SchoolIcon sx={{ color: C.blue.border }} />
              <Typography sx={{ fontWeight: 800, color: D.heading }}>Scenario</Typography>
            </Box>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="In this step, we move from exploration to explicit understanding. I'll explain how event budgets work using a simplified breakdown of the Global Cultures Festival. You'll learn why certain costs exist and how sponsors or ticket sales cover those costs. Then you'll practice explaining and justifying these financial decisions yourself."
            />
            <Box sx={{ mt: 2.5, bgcolor: dark ? '#0F2310' : '#F1F8E9', border: `1px solid ${C.green.border}`, borderRadius: '12px', p: 2 }}>
              <Typography sx={{ color: D.muted, fontSize: '0.85rem', mb: 1 }}>Today you will learn to:</Typography>
              <Box component="ul" sx={{ pl: 2.5, my: 0 }}>
                {['Explain why costs exist in event budgets', 'Justify funding choices clearly', 'Use cause-effect language accurately (because, so, due to)'].map((item, i) => (
                  <Typography key={i} component="li" sx={{ color: D.body, fontSize: '0.9rem', mb: 0.5 }}>{item}</Typography>
                ))}
              </Box>
            </Box>
          </Box>
        </motion.div>

        {/* Budget Breakdown */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <MonetizationOnIcon sx={{ color: C.orange.border }} />
            <Typography sx={{ fontWeight: 800, color: D.heading }}>Example: Festival Budget Breakdown</Typography>
          </Box>
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ ...card(C.red), height: '100%' }}>
                <Typography sx={{ fontWeight: 800, color: C.red.border, mb: 1.5 }}>Why We Need Money</Typography>
                <Box sx={{ bgcolor: dark ? '#200A0A' : '#FFF3E0', borderRadius: '12px', p: 2 }}>
                  <Typography sx={{ color: D.body, fontSize: '0.85rem', mb: 1.5, fontWeight: 700 }}>Example Explanation:</Typography>
                  {[
                    `"We need a sponsor because the stage and sound system are expensive."`,
                    `"The budget has many expenses, so we need funding from multiple sources."`,
                    `"Ticket sales are necessary due to the high venue rental costs."`,
                  ].map((line, i) => (
                    <Typography key={i} sx={{ color: D.body, fontSize: '0.85rem', fontStyle: 'italic', mb: i < 2 ? 1 : 0 }}
                      dangerouslySetInnerHTML={{ __html: line.replace(/because|so|due to/g, (m) => `<strong>${m}</strong>`) }}
                    />
                  ))}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ ...card(C.green), height: '100%' }}>
                <Typography sx={{ fontWeight: 800, color: C.green.border, mb: 1.5 }}>How We Get Money</Typography>
                <Box sx={{ bgcolor: dark ? '#0F2310' : '#E8F5E9', borderRadius: '12px', p: 2 }}>
                  <Typography sx={{ color: D.body, fontSize: '0.85rem', mb: 1.5, fontWeight: 700 }}>Funding Sources:</Typography>
                  {[
                    ['Sponsors', 'Companies that give money upfront'],
                    ['Ticket Sales', 'Money from attendees during the event'],
                    ['Grants', 'Money from institutions or organizations'],
                    ['Donations', 'Voluntary contributions from supporters'],
                  ].map(([label, desc], i) => (
                    <Typography key={i} sx={{ color: D.body, fontSize: '0.85rem', mb: 0.5 }}>
                      • <strong>{label}:</strong> {desc}
                    </Typography>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </motion.div>

        {/* Key Language Focus */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
          <Box sx={{ ...card(C.yellow), mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <DescriptionIcon sx={{ color: C.yellow.border }} />
              <Typography sx={{ fontWeight: 800, color: D.heading }}>Key Language Focus</Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography sx={{ color: D.body, fontWeight: 700, mb: 0.5, fontSize: '0.9rem' }}>Vocabulary:</Typography>
                <Typography sx={{ color: D.muted, fontSize: '0.88rem' }}>
                  budget, sponsor, funding, cost, expense, donation, ticket sales, profit, loss
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography sx={{ color: D.body, fontWeight: 700, mb: 0.5, fontSize: '0.9rem' }}>Connectors:</Typography>
                <Typography sx={{ color: D.muted, fontSize: '0.88rem' }}>
                  <strong>because</strong> (reason), <strong>so</strong> (result), <strong>due to</strong> (cause)
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </motion.div>

        {/* What You Will Practice */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
          <Typography sx={{ fontWeight: 800, color: D.heading, mb: 2 }}>What You Will Practice</Typography>
          <Grid container spacing={2.5} sx={{ mb: 4 }}>
            {interactions.map((item, i) => (
              <Grid item xs={12} sm={4} key={i}>
                <Box sx={{ ...card(item.c) }}>
                  <Box sx={{ px: 1.5, py: 0.3, borderRadius: '50px', bgcolor: item.c.border, color: '#fff', fontSize: '0.75rem', fontWeight: 800, display: 'inline-block', mb: 1 }}>
                    {item.label}
                  </Box>
                  <Typography sx={{ fontWeight: 700, color: D.heading, fontSize: '0.95rem', mb: 0.5 }}>{item.title}</Typography>
                  <Typography sx={{ color: D.muted, fontSize: '0.85rem' }}>{item.desc}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Start Button */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              component="button"
              onClick={handleStartActivities}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1,
                bgcolor: C.green.border, color: '#fff',
                px: 4, py: 1.5, borderRadius: '14px',
                border: `2px solid ${C.green.border}`,
                boxShadow: `4px 4px 0 #2E7D32`,
                fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
                transition: 'all 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 #2E7D32` },
              }}
            >
              <PlayArrowIcon />
              Start Learning Activities
            </Box>
          </Box>
        </motion.div>

      </Container>
    </Box>
  )
}
