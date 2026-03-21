import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApiContext } from '../lib/api.jsx'
import { Box, Typography, Button, Stack, Container } from '@mui/material'
import { motion } from 'framer-motion'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import SchoolIcon from '@mui/icons-material/School'
import GroupsIcon from '@mui/icons-material/Groups'
import PsychologyIcon from '@mui/icons-material/Psychology'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import CampaignIcon from '@mui/icons-material/Campaign'
import BuildIcon from '@mui/icons-material/Build'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import VerifiedIcon from '@mui/icons-material/Verified'
import TimerIcon from '@mui/icons-material/Timer'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { useColorMode } from '../theme.jsx'

// ─── Clay palette — light + dark variants ────────────────────────────────────
const LIGHT = {
  pageBg:   '#FFFDE7',
  sectionBg:'#E8EAF6',
  sectionBg2:'#FFF8E1',
  heading:  '#1A237E',
  body:     '#37474F',
  muted:    '#78909C',
  cardBg:   '#ffffff',
  yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825', text: '#5D4037' },
  purple: { bg: '#E1BEE7', border: '#8E24AA', shadow: '#8E24AA', text: '#4A148C' },
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C', text: '#1B5E20' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2', text: '#0D47A1' },
  orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00', text: '#E65100' },
  pink:   { bg: '#FCE4EC', border: '#C2185B', shadow: '#C2185B', text: '#880E4F' },
  teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7', text: '#006064' },
}

const DARK = {
  pageBg:   '#0F0F1A',
  sectionBg:'#14142B',
  sectionBg2:'#1A1A2E',
  heading:  '#E8EAFF',
  body:     '#B0BEC5',
  muted:    '#607D8B',
  cardBg:   '#1A1A2E',
  yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#A06800', text: '#FFD54F' },
  purple: { bg: '#1E0A2E', border: '#CE93D8', shadow: '#7B1FA2', text: '#E1BEE7' },
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32', text: '#A5D6A7' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0', text: '#BBDEFB' },
  orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100', text: '#FFE0B2' },
  pink:   { bg: '#1F0010', border: '#F48FB1', shadow: '#880E4F', text: '#FCE4EC' },
  teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C', text: '#B2EBF2' },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' } }),
}

const PHASES = [
  { id: 1, title: 'Foundation',        sub: 'Language Assessment', Icon: SchoolIcon,   colorKey: 'purple' },
  { id: 2, title: 'Cultural Planning',  sub: 'Event Organization',  Icon: GroupsIcon,   colorKey: 'blue'   },
  { id: 4, title: 'Marketing',          sub: 'Promotion',           Icon: CampaignIcon, colorKey: 'orange' },
  { id: 5, title: 'Execution',          sub: 'Problem-Solving',     Icon: BuildIcon,    colorKey: 'pink'   },
]

export default function Home() {
  const { user, client, loading } = useApiContext()
  const navigate = useNavigate()
  const { mode } = useColorMode()
  const D = mode === 'dark' ? DARK : LIGHT
  const isLoggedIn = !loading && user

  const onStart = async () => {
    try { await client.startGame(); navigate('/game') }
    catch { alert('Failed to start game') }
  }

  // ── clay helpers (use D for colors) ───────────────────────────────────────
  const card = (c, extra = {}) => ({
    bgcolor: c.bg,
    border: `2px solid ${c.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${c.shadow}`,
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
    '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${c.shadow}` },
    ...extra,
  })

  const btn = (c) => ({
    display: 'inline-flex', alignItems: 'center', gap: 0.75,
    px: 3.5, py: 1.5, borderRadius: '14px', fontWeight: 800,
    fontSize: '0.95rem', textTransform: 'none', textDecoration: 'none',
    bgcolor: c.bg, color: c.border,
    border: `2px solid ${c.border}`,
    boxShadow: `3px 3px 0 ${c.shadow}`,
    cursor: 'pointer',
    transition: 'transform 0.12s, box-shadow 0.12s',
    '&:hover': { bgcolor: c.bg, color: c.border, transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${c.shadow}` },
    '&:active': { transform: 'translate(1px,1px)', boxShadow: `1px 1px 0 ${c.shadow}` },
  })

  const iconBox = (c, size = 52) => ({
    width: size, height: size, borderRadius: '14px', flexShrink: 0,
    bgcolor: D.cardBg,
    border: `2px solid ${c.border}`,
    boxShadow: `3px 3px 0 ${c.shadow}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  })

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: D.pageBg, overflowX: 'hidden' }}>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <Container maxWidth="lg" sx={{ pt: { xs: 8, md: 12 }, pb: { xs: 8, md: 10 } }}>
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={6} alignItems="center">

          {/* Left copy */}
          <Box sx={{ flex: 1, maxWidth: { lg: 580 } }}>
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
              <Box sx={{
                display: 'inline-flex', alignItems: 'center', gap: 0.75,
                px: 2.5, py: 0.9, mb: 4, borderRadius: '50px',
                bgcolor: D.purple.bg,
                border: `2px solid ${D.purple.border}`,
                boxShadow: `3px 3px 0 ${D.purple.shadow}`,
              }}>
                <AutoAwesomeIcon sx={{ fontSize: 15, color: D.purple.border }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: D.purple.border }}>
                  AI-Powered CEFR Assessment
                </Typography>
              </Box>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
              <Typography sx={{
                fontSize: { xs: '2.8rem', sm: '3.4rem', md: '4rem' },
                fontWeight: 900, lineHeight: 1.06, letterSpacing: '-0.03em',
                color: D.heading, mb: 2.5,
              }}>
                Discover your{' '}
                <Box component="span" sx={{
                  display: 'inline-block',
                  bgcolor: D.yellow.bg,
                  border: `2px solid ${D.yellow.border}`,
                  borderRadius: '10px',
                  boxShadow: `3px 3px 0 ${D.yellow.shadow}`,
                  px: 1.5, py: 0.2,
                  color: D.yellow.text,
                }}>
                  English
                </Box>
                {' '}level
              </Typography>
              <Typography sx={{ fontSize: { xs: '1.6rem', md: '2rem' }, fontWeight: 900, color: D.heading, mb: 3, lineHeight: 1.1 }}>
                through real-world scenarios
              </Typography>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
              <Typography sx={{ fontSize: '1.05rem', color: D.body, lineHeight: 1.75, mb: 4.5, maxWidth: 480, fontWeight: 500 }}>
                Take a professional CEFR assessment, plan cultural events, create marketing campaigns,
                and solve real problems — all while improving your English.
              </Typography>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} sx={{ mb: 4 }}>
                <Box
                  component={isLoggedIn ? 'button' : Link}
                  to={isLoggedIn ? undefined : '/signup'}
                  onClick={isLoggedIn ? onStart : undefined}
                  sx={{ ...btn(D.purple), fontSize: '1rem', px: 4, py: 1.75 }}
                >
                  {isLoggedIn ? 'Continue Assessment' : 'Start Free Assessment'}
                  <ArrowForwardIcon sx={{ fontSize: 19 }} />
                </Box>
                <Box
                  component={Link}
                  to={isLoggedIn ? '/dashboard' : '/login'}
                  sx={{ ...btn(D.blue) }}
                >
                  {isLoggedIn ? 'Dashboard' : 'Sign In'}
                </Box>
              </Stack>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
              <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                {[
                  { icon: <TimerIcon sx={{ fontSize: 14 }} />,      text: '15 min',        color: D.green  },
                  { icon: <VerifiedIcon sx={{ fontSize: 14 }} />,    text: 'CEFR certified', color: D.teal  },
                  { icon: <AutoAwesomeIcon sx={{ fontSize: 14 }} />, text: 'AI feedback',    color: D.orange },
                ].map(item => (
                  <Box key={item.text} sx={{
                    display: 'inline-flex', alignItems: 'center', gap: 0.75,
                    px: 2, py: 0.65, borderRadius: '50px',
                    bgcolor: item.color.bg,
                    border: `2px solid ${item.color.border}`,
                    boxShadow: `2px 2px 0 ${item.color.shadow}`,
                    color: item.color.border,
                    fontSize: '0.78rem', fontWeight: 800,
                  }}>
                    {item.icon} {item.text}
                  </Box>
                ))}
              </Stack>
            </motion.div>
          </Box>

          {/* Right score card */}
          <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', position: 'relative', minHeight: 400 }}>
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
              style={{ position: 'relative', width: '100%', maxWidth: 420 }}
            >
              <Box sx={{
                p: 4, borderRadius: '24px',
                bgcolor: D.cardBg,
                border: `2px solid ${D.blue.border}`,
                boxShadow: `6px 6px 0 ${D.blue.shadow}`,
              }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                  <Box sx={iconBox(D.purple, 52)}>
                    <SchoolIcon sx={{ fontSize: 26, color: D.purple.border }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 900, fontSize: '1.05rem', color: D.heading }}>CEFR Assessment</Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: D.muted, fontWeight: 600 }}>English Proficiency Test</Typography>
                  </Box>
                </Stack>

                <Box sx={{ mb: 3 }}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: D.body }}>Your Level</Typography>
                    <Typography sx={{ fontSize: '0.78rem', fontWeight: 900, color: D.blue.border }}>B2</Typography>
                  </Stack>
                  <Box sx={{
                    height: 12, borderRadius: '50px',
                    bgcolor: D.blue.bg,
                    border: `2px solid ${D.blue.border}`,
                    overflow: 'hidden',
                    boxShadow: `2px 2px 0 ${D.blue.shadow}`,
                  }}>
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: '72%' }}
                      transition={{ delay: 0.9, duration: 1.4, ease: 'easeOut' }}
                      style={{ height: '100%', borderRadius: 50, background: D.blue.border }}
                    />
                  </Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.75 }}>
                    {['A1','A2','B1','B2','C1'].map(l => (
                      <Typography key={l} sx={{ fontSize: '0.67rem', fontWeight: l === 'B2' ? 900 : 600, color: l === 'B2' ? D.blue.border : D.muted }}>{l}</Typography>
                    ))}
                  </Stack>
                </Box>

                <Stack direction="row" spacing={1.5}>
                  {[
                    { label: 'Grammar',    pct: 85, color: D.purple },
                    { label: 'Vocabulary', pct: 72, color: D.blue   },
                    { label: 'Fluency',    pct: 68, color: D.orange },
                  ].map(s => (
                    <Box key={s.label} sx={{
                      flex: 1, py: 2, borderRadius: '14px', textAlign: 'center',
                      bgcolor: s.color.bg,
                      border: `2px solid ${s.color.border}`,
                      boxShadow: `3px 3px 0 ${s.color.shadow}`,
                    }}>
                      <Typography sx={{ fontSize: '1.2rem', fontWeight: 900, color: s.color.border }}>{s.pct}%</Typography>
                      <Typography sx={{ fontSize: '0.66rem', fontWeight: 700, color: D.body }}>{s.label}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ position: 'absolute', top: -20, right: -26, zIndex: 3 }}
              >
                <Box sx={{
                  display: 'flex', alignItems: 'center', gap: 0.75,
                  px: 2.5, py: 1.25, borderRadius: '50px',
                  bgcolor: D.green.bg, border: `2px solid ${D.green.border}`,
                  boxShadow: `3px 3px 0 ${D.green.shadow}`,
                }}>
                  <VerifiedIcon sx={{ fontSize: 15, color: D.green.border }} />
                  <Typography sx={{ fontSize: '0.78rem', fontWeight: 900, color: D.green.border }}>Level Certified!</Typography>
                </Box>
              </motion.div>

              <motion.div
                animate={{ y: [0, 7, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                style={{ position: 'absolute', bottom: 14, left: -32, zIndex: 3 }}
              >
                <Box sx={{
                  display: 'flex', alignItems: 'center', gap: 0.75,
                  px: 2.5, py: 1.25, borderRadius: '50px',
                  bgcolor: D.yellow.bg, border: `2px solid ${D.yellow.border}`,
                  boxShadow: `3px 3px 0 ${D.yellow.shadow}`,
                }}>
                  <AutoAwesomeIcon sx={{ fontSize: 15, color: D.yellow.border }} />
                  <Typography sx={{ fontSize: '0.78rem', fontWeight: 900, color: D.yellow.text }}>+250 XP</Typography>
                </Box>
              </motion.div>
            </motion.div>
          </Box>
        </Stack>
      </Container>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────────── */}
      <Box sx={{ bgcolor: D.sectionBg, borderTop: `2px solid ${D.purple.border}`, borderBottom: `2px solid ${D.purple.border}`, py: { xs: 8, md: 10 } }}>
        <Container maxWidth="lg">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Typography sx={{ fontWeight: 900, fontSize: { xs: '2rem', md: '2.5rem' }, color: D.heading, mb: 1.5, textAlign: 'center', letterSpacing: '-0.02em' }}>
              How it works
            </Typography>
            <Typography sx={{ color: D.body, fontSize: '1.05rem', textAlign: 'center', mb: 7, maxWidth: 440, mx: 'auto', fontWeight: 600 }}>
              Three steps to assess and grow your English skills
            </Typography>
          </motion.div>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            {[
              { num: '01', title: 'Take Assessment',    desc: 'Answer 9 real-world English scenarios evaluated by AI in about 15 minutes.', Icon: PsychologyIcon, color: D.purple },
              { num: '02', title: 'Get Your CEFR Level', desc: 'Receive detailed results with grammar, vocabulary, and fluency breakdown.',   Icon: VerifiedIcon,   color: D.green  },
              { num: '03', title: 'Grow Through Phases', desc: 'Progress through 4 hands-on phases with cultural events, marketing, and more.', Icon: TrendingUpIcon, color: D.orange },
            ].map((step, i) => (
              <motion.div key={step.num} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i + 1} style={{ flex: 1 }}>
                <Box sx={{ ...card(step.color), p: 4, height: '100%', position: 'relative' }}>
                  <Typography sx={{ position: 'absolute', top: 14, right: 20, fontSize: '3.5rem', fontWeight: 900, color: `${step.color.border}28`, lineHeight: 1 }}>
                    {step.num}
                  </Typography>
                  <Box sx={iconBox(step.color, 52)}>
                    <step.Icon sx={{ fontSize: 26, color: step.color.border }} />
                  </Box>
                  <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', color: D.heading, mt: 2.5, mb: 1 }}>{step.title}</Typography>
                  <Typography sx={{ color: D.body, fontSize: '0.9rem', lineHeight: 1.7, fontWeight: 500 }}>{step.desc}</Typography>
                </Box>
              </motion.div>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* ── FEATURES ─────────────────────────────────────────────────────────── */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 10 } }}>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <Typography sx={{ fontWeight: 900, fontSize: { xs: '2rem', md: '2.5rem' }, color: D.heading, mb: 1.5, textAlign: 'center', letterSpacing: '-0.02em' }}>
            Built for real learning
          </Typography>
          <Typography sx={{ color: D.body, fontSize: '1.05rem', textAlign: 'center', mb: 7, maxWidth: 460, mx: 'auto', fontWeight: 600 }}>
            Not just another quiz — a complete assessment journey
          </Typography>
        </motion.div>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '5fr 4fr' }, gap: 3 }}>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
            <Box sx={{
              p: { xs: 4, md: 5 }, borderRadius: '24px', height: '100%',
              bgcolor: D.purple.bg,
              border: `2px solid ${D.purple.border}`,
              boxShadow: `6px 6px 0 ${D.purple.shadow}`,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              '&:hover': { transform: 'translate(-3px,-3px)', boxShadow: `9px 9px 0 ${D.purple.shadow}` },
              transition: 'all 0.15s ease',
            }}>
              <Box>
                <Box sx={iconBox(D.purple, 56)}>
                  <PsychologyIcon sx={{ fontSize: 28, color: D.purple.border }} />
                </Box>
                <Typography sx={{ fontWeight: 900, fontSize: '1.5rem', color: D.heading, mt: 2.5, mb: 1.5 }}>AI-Powered Assessment</Typography>
                <Typography sx={{ color: D.body, fontSize: '1rem', lineHeight: 1.7, fontWeight: 500, maxWidth: 400 }}>
                  Advanced AI evaluates your grammar, vocabulary, and communication through realistic workplace and cultural scenarios.
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} sx={{ mt: 3, flexWrap: 'wrap', gap: 1 }}>
                {['Grammar', 'Vocabulary', 'Fluency', 'Coherence'].map(s => (
                  <Box key={s} sx={{
                    px: 2, py: 0.6, borderRadius: '50px',
                    bgcolor: D.cardBg,
                    border: `2px solid ${D.purple.border}`,
                    boxShadow: `2px 2px 0 ${D.purple.shadow}`,
                    fontSize: '0.73rem', fontWeight: 800, color: D.purple.border,
                  }}>{s}</Box>
                ))}
              </Stack>
            </Box>
          </motion.div>

          <Stack spacing={3}>
            {[
              { Icon: GroupsIcon,     title: 'Real-World Scenarios', desc: 'Plan cultural events, create campaigns, and coordinate teams — all in English.', color: D.teal  },
              { Icon: TrendingUpIcon, title: 'Track Your Growth',    desc: 'XP tracking, CEFR progress, and remedial activities tailored to your skill gaps.', color: D.green },
            ].map(({ Icon, title, desc, color }, i) => (
              <motion.div key={title} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i + 2}>
                <Box sx={{ ...card(color), p: 4 }}>
                  <Box sx={iconBox(color, 48)}>
                    <Icon sx={{ fontSize: 24, color: color.border }} />
                  </Box>
                  <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', color: D.heading, mt: 2, mb: 0.75 }}>{title}</Typography>
                  <Typography sx={{ color: D.body, fontSize: '0.9rem', lineHeight: 1.65, fontWeight: 500 }}>{desc}</Typography>
                </Box>
              </motion.div>
            ))}
          </Stack>
        </Box>
      </Container>

      {/* ── JOURNEY ──────────────────────────────────────────────────────────── */}
      <Box sx={{ bgcolor: D.sectionBg2, borderTop: `2px solid ${D.yellow.border}`, borderBottom: `2px solid ${D.yellow.border}`, py: { xs: 8, md: 10 } }}>
        <Container maxWidth="lg">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Typography sx={{ fontWeight: 900, fontSize: { xs: '2rem', md: '2.5rem' }, color: D.heading, mb: 1.5, textAlign: 'center', letterSpacing: '-0.02em' }}>
              Your learning journey
            </Typography>
            <Typography sx={{ color: D.body, fontSize: '1.05rem', textAlign: 'center', mb: 6, fontWeight: 600 }}>
              4 phases of the Global Cultures Festival project
            </Typography>
          </motion.div>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2,1fr)', sm: 'repeat(4,1fr)' }, gap: 2.5 }}>
            {PHASES.map((phase, i) => (
              <motion.div key={phase.id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}>
                <Box sx={{ ...card(D[phase.colorKey]), p: 3.5, textAlign: 'center' }}>
                  <Box sx={{ ...iconBox(D[phase.colorKey], 60), mx: 'auto', mb: 2 }}>
                    <phase.Icon sx={{ fontSize: 30, color: D[phase.colorKey].border }} />
                  </Box>
                  <Typography sx={{ fontWeight: 900, fontSize: '0.92rem', color: D.heading, mb: 0.25 }}>Phase {phase.id}</Typography>
                  <Typography sx={{ fontSize: '0.78rem', color: D.body, fontWeight: 700 }}>{phase.title}</Typography>
                </Box>
              </motion.div>
            ))}
          </Box>

          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Box component={Link} to="/phase-journey" sx={{ ...btn(D.yellow), display: 'inline-flex' }}>
              Explore the full journey <ArrowForwardIcon sx={{ fontSize: 17 }} />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 10, md: 14 }, px: 2 }}>
        <Container maxWidth="md">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Box sx={{
              bgcolor: mode === 'dark' ? '#1A1A3E' : '#1A237E',
              border: `3px solid ${D.yellow.border}`,
              borderRadius: '28px',
              boxShadow: `8px 8px 0 ${D.yellow.shadow}`,
              p: { xs: 5, md: 8 },
              textAlign: 'center',
            }}>
              <Typography sx={{ fontWeight: 900, fontSize: { xs: '2.2rem', md: '2.8rem' }, color: '#fff', mb: 2, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                Ready to find out{' '}
                <Box component="span" sx={{
                  display: 'inline-block',
                  bgcolor: D.yellow.bg, color: D.yellow.text,
                  border: `2px solid ${D.yellow.border}`,
                  borderRadius: '8px',
                  boxShadow: `3px 3px 0 ${D.yellow.shadow}`,
                  px: 1, py: 0.1,
                }}>
                  your level?
                </Box>
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.75)', mb: 5, fontSize: '1.05rem', lineHeight: 1.7, fontWeight: 600, maxWidth: 440, mx: 'auto' }}>
                It's free, takes 15 minutes, and you get detailed AI feedback on your English proficiency.
              </Typography>
              <Box
                component={isLoggedIn ? 'button' : Link}
                to={isLoggedIn ? undefined : '/signup'}
                onClick={isLoggedIn ? onStart : undefined}
                sx={{ ...btn(D.green), display: 'inline-flex', fontSize: '1.05rem', px: 5, py: 1.75 }}
              >
                {isLoggedIn ? 'Start Assessment' : 'Start Free Assessment'}
                <PlayArrowIcon sx={{ fontSize: 21 }} />
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <Box sx={{
        bgcolor: mode === 'dark' ? '#0A0A1A' : '#1A237E',
        borderTop: `3px solid ${D.yellow.border}`,
        boxShadow: `0 -3px 0 ${D.yellow.shadow}`,
        pt: 7, pb: 5,
      }}>
        <Container maxWidth="lg">
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} sx={{ mb: 4 }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box sx={{
                width: 40, height: 40, borderRadius: '12px',
                bgcolor: D.purple.bg, border: `2px solid ${D.purple.border}`,
                boxShadow: `3px 3px 0 ${D.purple.shadow}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <AutoAwesomeIcon sx={{ fontSize: 20, color: D.purple.border }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 900, fontSize: '1.15rem', color: '#fff' }}>FARDI</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#90CAF9', fontWeight: 600 }}>Language Assessment Platform</Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
              {[
                { label: '✦ Free Forever',   bg: D.yellow.bg, border: D.yellow.border },
                { label: '✦ CEFR A1–C1',     bg: D.green.bg,  border: D.green.border  },
                { label: '✦ AI-Powered',      bg: D.purple.bg, border: D.purple.border },
                { label: '✦ Instant Results', bg: D.teal.bg,   border: D.teal.border   },
              ].map(b => (
                <Box key={b.label} sx={{
                  px: 2, py: 0.5, bgcolor: b.bg,
                  border: `2px solid ${b.border}`, borderRadius: '50px',
                  boxShadow: `2px 2px 0 ${b.border}`,
                  fontSize: '0.73rem', fontWeight: 800, color: b.border,
                }}>
                  {b.label}
                </Box>
              ))}
            </Stack>
          </Stack>

          <Box sx={{ height: '2px', bgcolor: 'rgba(255,255,255,0.08)', mb: 4 }} />

          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
            <Typography sx={{ color: '#7986CB', fontSize: '0.82rem', fontWeight: 600 }}>
              © 2026 FARDI Language Assessment. All rights reserved.
            </Typography>
            <Stack direction="row" spacing={2.5}>
              {['Privacy', 'Terms', 'Contact'].map(l => (
                <Typography key={l} sx={{ color: '#90CAF9', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', '&:hover': { color: D.yellow.border }, transition: 'color 0.15s' }}>
                  {l}
                </Typography>
              ))}
            </Stack>
          </Stack>
        </Container>
      </Box>

    </Box>
  )
}
