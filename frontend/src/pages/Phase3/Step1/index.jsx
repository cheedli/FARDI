import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Grid, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import Avatar from '../../../components/Avatar.jsx'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'

const LIGHT = {
  pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', divider: '#E0E0E0',
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
  yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825', text: '#5D4037' },
  teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
  orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
  purple: { bg: '#E1BEE7', border: '#8E24AA', shadow: '#8E24AA' },
}
const DARK = {
  pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', divider: '#2A2A4A',
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#A06800', text: '#FFD54F' },
  teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
  orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
  purple: { bg: '#1E0A2E', border: '#CE93D8', shadow: '#7B1FA2' },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' } }),
}

const clay = (c) => ({
  bgcolor: c.bg,
  border: `2px solid ${c.border}`,
  borderRadius: '20px',
  boxShadow: `4px 4px 0 ${c.shadow}`,
})

export default function Phase3Step1Intro() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const D = isDark ? DARK : LIGHT

  const handleStartActivities = () => {
    navigate('/app/phase3/step/1/interaction/1')
  }

  const budgetItems = [
    { label: 'Food', amount: '$500' },
    { label: 'Music', amount: '$300' },
    { label: 'Decoration', amount: '$200' },
    { label: 'Promotion', amount: '$150' },
  ]

  const fundingSources = [
    { label: 'Sponsorship', desc: 'Companies give money or support' },
    { label: 'Ticket Sales', desc: 'Attendees pay entry fees' },
    { label: 'Donations', desc: 'Money given for free' },
    { label: 'University Grant', desc: 'Official funding from institution' },
  ]

  const concepts = [
    { term: 'Budget', def: 'A plan for how money will be spent' },
    { term: 'Cost / Expense', def: 'Money that is spent' },
    { term: 'Funding', def: 'Money given to support a project' },
    { term: 'Sponsor', def: 'Person/company that gives money or support' },
    { term: 'Donation', def: 'Money given for free' },
    { term: 'Profit', def: 'Money left after expenses' },
  ]

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: D.pageBg }}>
      <Container maxWidth="md" sx={{ pt: { xs: 3, md: 4 }, pb: 6 }}>

        {/* Phase Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Box sx={{ ...clay(D.green), p: { xs: 2.5, md: 3 }, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <MonetizationOnIcon sx={{ fontSize: { xs: 32, md: 40 }, color: D.green.border }} />
            <Box>
              <Typography variant="h5" fontWeight={800} sx={{ color: D.heading, lineHeight: 1.2 }}>
                Phase 3: Sponsorship &amp; Budgeting
              </Typography>
              <Typography variant="body2" sx={{ color: D.body, mt: 0.5 }}>
                Step 1: Engage — Financial Planning Introduction
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Character Message */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Box sx={{ ...clay(D.blue), p: { xs: 2, md: 2.5 }, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Avatar character="MS_MABROUKI" size={48} />
              <Box>
                <Typography variant="caption" fontWeight={800} sx={{ color: D.blue.border, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Ms. Mabrouki
                </Typography>
                <Typography variant="body1" sx={{ color: D.body, mt: 0.5 }}>
                  We have great ideas, but ideas alone don't pay for events. Before we talk about numbers or emails, let's think about how events get money and how that money is used.
                </Typography>
              </Box>
            </Box>
          </Box>
        </motion.div>

        {/* Scenario Context */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          <Box sx={{ ...clay(D.teal), p: { xs: 2, md: 2.5 }, mb: 3 }}>
            <Typography variant="subtitle2" fontWeight={800} sx={{ color: D.teal.border, mb: 1 }}>
              Scenario
            </Typography>
            <Typography variant="body2" sx={{ color: D.body, mb: 1 }}>
              The Cultural Committee meets for the first financial planning session. Ms. Mabrouki displays:
            </Typography>
            <Box component="ul" sx={{ pl: 3, m: 0 }}>
              <Typography component="li" variant="body2" sx={{ color: D.body, mb: 0.5 }}>
                A simple event budget table (food, music, decoration, promotion)
              </Typography>
              <Typography component="li" variant="body2" sx={{ color: D.body }}>
                A slide with logos of sponsors from a previous university event
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Financial Planning Examples */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
          <Typography variant="h6" fontWeight={800} sx={{ color: D.heading, mb: 2 }}>
            Financial Planning Examples
          </Typography>
        </motion.div>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* Budget Example */}
          <Grid item xs={12} md={6}>
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
              <Box sx={{ ...clay(D.green), p: 2.5, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <AttachMoneyIcon sx={{ color: D.green.border, fontSize: 28 }} />
                  <Typography variant="subtitle1" fontWeight={800} sx={{ color: D.heading }}>
                    Event Budget Example
                  </Typography>
                </Box>
                {budgetItems.map((item) => (
                  <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75, borderBottom: `1px solid ${D.divider}` }}>
                    <Typography variant="body2" fontWeight={600} sx={{ color: D.body }}>{item.label}</Typography>
                    <Typography variant="body2" fontWeight={800} sx={{ color: D.green.border }}>{item.amount}</Typography>
                  </Box>
                ))}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1 }}>
                  <Typography variant="body2" fontWeight={800} sx={{ color: D.heading }}>Total Budget</Typography>
                  <Typography variant="body2" fontWeight={800} sx={{ color: D.green.border }}>$1,150</Typography>
                </Box>
              </Box>
            </motion.div>
          </Grid>

          {/* Funding Sources */}
          <Grid item xs={12} md={6}>
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}>
              <Box sx={{ ...clay(D.purple), p: 2.5, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <AccountBalanceIcon sx={{ color: D.purple.border, fontSize: 28 }} />
                  <Typography variant="subtitle1" fontWeight={800} sx={{ color: D.heading }}>
                    Funding Sources
                  </Typography>
                </Box>
                {fundingSources.map((src) => (
                  <Box key={src.label} sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ color: D.body }}>
                      <Box component="span" fontWeight={800} sx={{ color: D.heading }}>{src.label}: </Box>
                      {src.desc}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </motion.div>
          </Grid>
        </Grid>

        {/* Key Concepts */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6}>
          <Box sx={{ ...clay(D.yellow), p: { xs: 2, md: 2.5 }, mb: 4 }}>
            <Typography variant="subtitle1" fontWeight={800} sx={{ color: D.heading, mb: 2 }}>
              Key Financial Concepts
            </Typography>
            <Grid container spacing={1.5}>
              {concepts.map((c) => (
                <Grid item xs={12} sm={6} key={c.term}>
                  <Typography variant="body2" sx={{ color: D.body }}>
                    <Box component="span" fontWeight={800} sx={{ color: D.heading }}>{c.term}: </Box>
                    {c.def}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Box>
        </motion.div>

        {/* Start Button */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={7}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              component="button"
              onClick={handleStartActivities}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1,
                px: 4, py: 1.5,
                bgcolor: D.green.bg,
                color: D.green.border,
                border: `2px solid ${D.green.border}`,
                borderRadius: '14px',
                boxShadow: `4px 4px 0 ${D.green.shadow}`,
                fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
                transition: 'all 0.15s ease',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.green.shadow}` },
              }}
            >
              <PlayArrowIcon />
              Start Vocabulary Activities
            </Box>
          </Box>
        </motion.div>

      </Container>
    </Box>
  )
}
