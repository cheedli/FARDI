import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApiContext } from '../lib/api.jsx'
import { Box, Typography, Button, Stack, Container, Avatar, useTheme } from '@mui/material'
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

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } })
}

const PHASES_PREVIEW = [
  { id: 1, title: 'Foundation', sub: 'Language Assessment', icon: SchoolIcon, color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
  { id: 2, title: 'Cultural Planning', sub: 'Event Organization', icon: GroupsIcon, color: '#0ea5e9', gradient: 'linear-gradient(135deg, #0ea5e9, #06b6d4)' },
  { id: 4, title: 'Marketing', sub: 'Promotion', icon: CampaignIcon, color: '#f97316', gradient: 'linear-gradient(135deg, #f97316, #fb923c)' },
  { id: 5, title: 'Execution', sub: 'Problem-Solving', icon: BuildIcon, color: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444, #f87171)' },
]

export default function Home() {
  const { user, client, loading } = useApiContext()
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const border = isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0'
  const borderSubtle = isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #f1f5f9'
  const cardBg = isDark ? theme.palette.background.paper : '#ffffff'
  const sectionBg = isDark ? 'rgba(255,255,255,0.02)' : '#fafafa'
  const muted = theme.palette.text.secondary
  const textPrimary = theme.palette.text.primary

  const onStart = async () => {
    try {
      await client.startGame()
      navigate('/game')
    } catch (e) {
      alert('Failed to start game')
    }
  }

  const isLoggedIn = !loading && user

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', overflowX: 'hidden' }}>

      {/* ── HERO ── */}
      <Box sx={{ position: 'relative', pt: { xs: 8, md: 12 }, pb: { xs: 10, md: 16 } }}>
        {/* Decorative blobs */}
        <Box sx={{ position: 'absolute', top: -120, right: -80, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: -100, left: -120, width: 450, height: 450, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', top: '30%', left: '50%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }} />

        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <Stack direction={{ xs: 'column', lg: 'row' }} spacing={{ xs: 6, lg: 8 }} alignItems="center">
            {/* Left text */}
            <Box sx={{ flex: 1, maxWidth: { lg: 560 } }}>
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
                <Box sx={{
                  display: 'inline-flex', alignItems: 'center', gap: 0.8,
                  px: 2, py: 0.8, borderRadius: 10,
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(14,165,233,0.08))',
                  border: '1px solid rgba(99,102,241,0.15)',
                  mb: 3.5,
                }}>
                  <AutoAwesomeIcon sx={{ fontSize: 16, color: '#6366f1' }} />
                  <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#4f46e5' }}>
                    AI-Powered CEFR Assessment
                  </Typography>
                </Box>
              </motion.div>

              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
                <Typography sx={{
                  fontSize: { xs: '2.6rem', sm: '3.2rem', md: '3.8rem' },
                  fontWeight: 800,
                  lineHeight: 1.08,
                  letterSpacing: '-0.03em',
                  color: textPrimary,
                  mb: 2.5,
                }}>
                  Discover your{' '}
                  <Box component="span" sx={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #0ea5e9 50%, #06b6d4 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    English level
                  </Box>
                  {' '}through real-world scenarios
                </Typography>
              </motion.div>

              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
                <Typography sx={{ fontSize: { xs: '1.05rem', md: '1.15rem' }, color: muted, lineHeight: 1.7, mb: 4, maxWidth: 480 }}>
                  Take a professional CEFR assessment, plan cultural events, create marketing campaigns, and solve real problems — all while improving your English.
                </Typography>
              </motion.div>

              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                  <Button
                    size="large"
                    component={isLoggedIn ? undefined : Link}
                    to={isLoggedIn ? undefined : '/signup'}
                    onClick={isLoggedIn ? onStart : undefined}
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      px: 4, py: 1.6,
                      background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                      color: 'white',
                      fontSize: '1rem',
                      boxShadow: '0 8px 32px rgba(99,102,241,0.35)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5856eb 0%, #4338ca 100%)',
                        boxShadow: '0 12px 40px rgba(99,102,241,0.45)',
                      }
                    }}
                  >
                    {isLoggedIn ? 'Continue Assessment' : 'Start Free Assessment'}
                  </Button>
                  <Button
                    size="large"
                    variant="outlined"
                    component={Link}
                    to={isLoggedIn ? '/dashboard' : '/login'}
                    sx={{
                      px: 4, py: 1.6,
                      borderColor: isDark ? 'rgba(255,255,255,0.15)' : '#e2e8f0',
                      color: 'text.primary',
                      fontSize: '1rem',
                      bgcolor: cardBg,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      '&:hover': { borderColor: isDark ? 'rgba(255,255,255,0.25)' : '#cbd5e1', bgcolor: sectionBg, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }
                    }}
                  >
                    {isLoggedIn ? 'Dashboard' : 'Sign In'}
                  </Button>
                </Stack>
              </motion.div>

              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
                <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
                  {[
                    { icon: <TimerIcon sx={{ fontSize: 15 }} />, text: '15 min assessment' },
                    { icon: <VerifiedIcon sx={{ fontSize: 15 }} />, text: 'CEFR certified' },
                    { icon: <AutoAwesomeIcon sx={{ fontSize: 15 }} />, text: 'AI feedback' },
                  ].map((item) => (
                    <Stack key={item.text} direction="row" alignItems="center" spacing={0.7}>
                      <Box sx={{ color: '#22c55e' }}>{item.icon}</Box>
                      <Typography sx={{ fontSize: '0.83rem', color: muted, fontWeight: 500 }}>{item.text}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </motion.div>
            </Box>

            {/* Right visual - Floating cards */}
            <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', position: 'relative', minHeight: 420 }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                style={{ position: 'relative', width: '100%', maxWidth: 420 }}
              >
                {/* Main card */}
                <Box sx={{
                  p: 4, borderRadius: 4,
                  bgcolor: cardBg,
                  border,
                  boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.4)' : '0 20px 60px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)',
                  position: 'relative', zIndex: 2,
                }}>
                  <Stack spacing={2.5}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ width: 48, height: 48, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                        <SchoolIcon sx={{ fontSize: 24 }} />
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: textPrimary, fontSize: '1.05rem' }}>CEFR Assessment</Typography>
                        <Typography sx={{ color: muted, fontSize: '0.8rem' }}>English Proficiency Test</Typography>
                      </Box>
                    </Stack>

                    {/* Fake level meter */}
                    <Box>
                      <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                        <Typography sx={{ fontSize: '0.78rem', color: muted, fontWeight: 500 }}>Your Level</Typography>
                        <Typography sx={{ fontSize: '0.78rem', color: '#6366f1', fontWeight: 700 }}>B2</Typography>
                      </Stack>
                      <Box sx={{ height: 8, borderRadius: 4, bgcolor: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9', overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: '0%' }}
                          animate={{ width: '72%' }}
                          transition={{ delay: 1, duration: 1.5, ease: 'easeOut' }}
                          style={{ height: '100%', borderRadius: 4, background: 'linear-gradient(90deg, #6366f1, #0ea5e9)' }}
                        />
                      </Box>
                      <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
                        {['A1', 'A2', 'B1', 'B2', 'C1'].map(l => (
                          <Typography key={l} sx={{ fontSize: '0.65rem', color: l === 'B2' ? '#6366f1' : muted, fontWeight: l === 'B2' ? 700 : 400 }}>{l}</Typography>
                        ))}
                      </Stack>
                    </Box>

                    {/* Skills */}
                    <Stack direction="row" spacing={1}>
                      {[
                        { label: 'Grammar', pct: 85, color: '#6366f1' },
                        { label: 'Vocabulary', pct: 72, color: '#0ea5e9' },
                        { label: 'Fluency', pct: 68, color: '#f97316' },
                      ].map(s => (
                        <Box key={s.label} sx={{ flex: 1, p: 1.5, borderRadius: 2, bgcolor: sectionBg, border: borderSubtle, textAlign: 'center' }}>
                          <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: s.color }}>{s.pct}%</Typography>
                          <Typography sx={{ fontSize: '0.65rem', color: muted, fontWeight: 500 }}>{s.label}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Stack>
                </Box>

                {/* Floating accent card */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ position: 'absolute', top: -20, right: -30, zIndex: 3 }}
                >
                  <Box sx={{
                    px: 2.5, py: 1.5, borderRadius: 3,
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    color: 'white',
                    boxShadow: '0 8px 24px rgba(34,197,94,0.3)',
                    display: 'flex', alignItems: 'center', gap: 1,
                  }}>
                    <VerifiedIcon sx={{ fontSize: 18 }} />
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 700 }}>Level Certified!</Typography>
                  </Box>
                </motion.div>

                {/* Floating XP card */}
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  style={{ position: 'absolute', bottom: 10, left: -35, zIndex: 3 }}
                >
                  <Box sx={{
                    px: 2.5, py: 1.5, borderRadius: 3,
                    bgcolor: cardBg,
                    border,
                    boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.4)' : '0 8px 24px rgba(0,0,0,0.08)',
                    display: 'flex', alignItems: 'center', gap: 1,
                  }}>
                    <AutoAwesomeIcon sx={{ fontSize: 18, color: '#f59e0b' }} />
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: textPrimary }}>+250 XP</Typography>
                  </Box>
                </motion.div>
              </motion.div>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* ── HOW IT WORKS ── */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: sectionBg, borderTop: borderSubtle, borderBottom: borderSubtle }}>
        <Container maxWidth="lg">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Box sx={{ textAlign: 'center', mb: 7 }}>
              <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.8rem', md: '2.3rem' }, color: textPrimary, mb: 1.5, letterSpacing: '-0.02em' }}>
                How it works
              </Typography>
              <Typography sx={{ color: muted, fontSize: '1.05rem', maxWidth: 450, mx: 'auto' }}>
                Three steps to assess and grow your English skills
              </Typography>
            </Box>
          </motion.div>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            {[
              { num: '01', title: 'Take Assessment', desc: 'Answer 9 real-world English scenarios evaluated by AI in about 15 minutes.', icon: <PsychologyIcon />, color: '#6366f1' },
              { num: '02', title: 'Get Your CEFR Level', desc: 'Receive detailed results with grammar, vocabulary, and fluency breakdown.', icon: <VerifiedIcon />, color: '#0ea5e9' },
              { num: '03', title: 'Grow Through Phases', desc: 'Progress through 4 hands-on phases with cultural events, marketing, and more.', icon: <TrendingUpIcon />, color: '#f97316' },
            ].map((step, i) => (
              <motion.div key={step.num} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i + 1} style={{ flex: 1 }}>
                <Box sx={{
                  p: 4, borderRadius: 4, bgcolor: cardBg,
                  border: borderSubtle,
                  height: '100%',
                  transition: 'all 0.3s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: `0 16px 40px ${step.color}15`, borderColor: `${step.color}30` }
                }}>
                  <Box sx={{
                    width: 48, height: 48, borderRadius: 2.5,
                    background: `${step.color}10`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    mb: 2.5,
                  }}>
                    {React.cloneElement(step.icon, { sx: { fontSize: 24, color: step.color } })}
                  </Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: textPrimary, mb: 1 }}>{step.title}</Typography>
                  <Typography sx={{ color: muted, fontSize: '0.9rem', lineHeight: 1.65 }}>{step.desc}</Typography>
                </Box>
              </motion.div>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* ── FEATURES BENTO ── */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Box sx={{ textAlign: 'center', mb: 7 }}>
              <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.8rem', md: '2.3rem' }, color: textPrimary, mb: 1.5, letterSpacing: '-0.02em' }}>
                Built for real learning
              </Typography>
              <Typography sx={{ color: muted, fontSize: '1.05rem', maxWidth: 480, mx: 'auto' }}>
                Not just another quiz — a complete assessment journey with real scenarios
              </Typography>
            </Box>
          </motion.div>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '5fr 4fr' }, gap: 3 }}>
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
              <Box sx={{
                p: { xs: 4, md: 5 }, borderRadius: 4,
                background: 'linear-gradient(145deg, #6366f1, #4f46e5)',
                color: 'white', height: '100%',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                position: 'relative', overflow: 'hidden',
              }}>
                <Box sx={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.08)' }} />
                <Box sx={{ position: 'absolute', bottom: -60, left: -20, width: 140, height: 140, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)' }} />
                <Box sx={{ position: 'relative' }}>
                  <Box sx={{ width: 52, height: 52, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                    <PsychologyIcon sx={{ fontSize: 28 }} />
                  </Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '1.5rem', mb: 1.5 }}>AI-Powered Assessment</Typography>
                  <Typography sx={{ opacity: 0.85, fontSize: '1rem', lineHeight: 1.65, maxWidth: 400 }}>
                    Advanced AI evaluates your grammar, vocabulary, and communication skills through realistic workplace and cultural scenarios. Get actionable feedback on every response.
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} sx={{ mt: 3, position: 'relative' }}>
                  {['Grammar', 'Vocabulary', 'Fluency', 'Coherence'].map(s => (
                    <Box key={s} sx={{ px: 1.5, py: 0.5, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.15)', fontSize: '0.73rem', fontWeight: 600 }}>{s}</Box>
                  ))}
                </Stack>
              </Box>
            </motion.div>

            <Stack spacing={3}>
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2}>
                <Box sx={{
                  p: 4, borderRadius: 4, bgcolor: cardBg,
                  border,
                  transition: 'all 0.3s',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 30px rgba(14,165,233,0.12)', borderColor: '#0ea5e930' }
                }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: 2.5, bgcolor: '#0ea5e910', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <GroupsIcon sx={{ fontSize: 22, color: '#0ea5e9' }} />
                  </Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: textPrimary, mb: 0.5 }}>Real-World Scenarios</Typography>
                  <Typography sx={{ color: muted, fontSize: '0.9rem', lineHeight: 1.6 }}>
                    Plan cultural events, create marketing campaigns, and coordinate teams — all while practicing English communication.
                  </Typography>
                </Box>
              </motion.div>
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={3}>
                <Box sx={{
                  p: 4, borderRadius: 4, bgcolor: cardBg,
                  border,
                  transition: 'all 0.3s',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 30px rgba(34,197,94,0.12)', borderColor: '#22c55e30' }
                }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: 2.5, bgcolor: '#22c55e10', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <TrendingUpIcon sx={{ fontSize: 22, color: '#22c55e' }} />
                  </Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: textPrimary, mb: 0.5 }}>Track Your Growth</Typography>
                  <Typography sx={{ color: muted, fontSize: '0.9rem', lineHeight: 1.6 }}>
                    Detailed XP tracking, CEFR level progress, and remedial activities tailored to your exact skill gaps.
                  </Typography>
                </Box>
              </motion.div>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* ── JOURNEY PREVIEW ── */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: sectionBg, borderTop: borderSubtle, borderBottom: borderSubtle }}>
        <Container maxWidth="lg">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Box sx={{ textAlign: 'center', mb: 5 }}>
              <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.8rem', md: '2.3rem' }, color: textPrimary, mb: 1.5, letterSpacing: '-0.02em' }}>
                Your learning journey
              </Typography>
              <Typography sx={{ color: muted, fontSize: '1.05rem' }}>
                4 phases of the Global Cultures Festival project
              </Typography>
            </Box>
          </motion.div>

          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
            gap: 2,
          }}>
            {PHASES_PREVIEW.map((phase, i) => (
              <motion.div key={phase.id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}>
                <Box sx={{
                  p: 3, borderRadius: 3, bgcolor: cardBg,
                  border: borderSubtle,
                  textAlign: 'center',
                  transition: 'all 0.3s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: `0 12px 32px ${phase.color}15`, borderColor: `${phase.color}25` }
                }}>
                  <Avatar sx={{
                    width: 56, height: 56, mx: 'auto', mb: 2,
                    background: phase.gradient,
                    boxShadow: `0 6px 20px ${phase.color}30`,
                  }}>
                    <phase.icon sx={{ fontSize: 26, color: 'white' }} />
                  </Avatar>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: textPrimary, mb: 0.3 }}>Phase {phase.id}</Typography>
                  <Typography sx={{ fontSize: '0.78rem', color: muted, fontWeight: 500 }}>{phase.title}</Typography>
                </Box>
              </motion.div>
            ))}
          </Box>

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              component={Link}
              to="/phase-journey"
              variant="outlined"
              endIcon={<ArrowForwardIcon />}
              sx={{
                borderColor: isDark ? 'rgba(255,255,255,0.15)' : '#e2e8f0', color: 'text.primary', bgcolor: cardBg,
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                '&:hover': { borderColor: isDark ? 'rgba(255,255,255,0.25)' : '#cbd5e1', bgcolor: sectionBg }
              }}
            >
              Explore the full journey
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ── FINAL CTA ── */}
      <Box sx={{ py: { xs: 10, md: 14 } }}>
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Typography sx={{ fontWeight: 800, fontSize: { xs: '2rem', md: '2.5rem' }, color: textPrimary, mb: 2, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              Ready to find out your level?
            </Typography>
            <Typography sx={{ color: muted, mb: 4, fontSize: '1.05rem', lineHeight: 1.6 }}>
              It's free, takes 15 minutes, and you get detailed AI feedback on your English proficiency.
            </Typography>
            <Button
              size="large"
              component={isLoggedIn ? undefined : Link}
              to={isLoggedIn ? undefined : '/signup'}
              onClick={isLoggedIn ? onStart : undefined}
              endIcon={<PlayArrowIcon />}
              sx={{
                px: 5, py: 1.8,
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: 'white', fontSize: '1.05rem',
                boxShadow: '0 8px 32px rgba(99,102,241,0.35)',
                '&:hover': { background: 'linear-gradient(135deg, #5856eb 0%, #4338ca 100%)', boxShadow: '0 12px 40px rgba(99,102,241,0.45)' }
              }}
            >
              {isLoggedIn ? 'Start Assessment' : 'Start Free Assessment'}
            </Button>
          </motion.div>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 4, borderTop: borderSubtle }}>
        <Container maxWidth="lg">
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography sx={{ color: muted, fontSize: '0.82rem' }}>FARDI Language Assessment</Typography>
            <Typography sx={{ color: muted, fontSize: '0.78rem' }}>CEFR A1-C1</Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}
