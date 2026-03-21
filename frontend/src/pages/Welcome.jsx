import React from 'react'
import { Box, Typography, Stack, Button, Container, Grid } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import SchoolIcon from '@mui/icons-material/School'
import PsychologyIcon from '@mui/icons-material/Psychology'
import BarChartIcon from '@mui/icons-material/BarChart'
import QuizIcon from '@mui/icons-material/Quiz'
import LanguageIcon from '@mui/icons-material/Language'
import SpeedIcon from '@mui/icons-material/Speed'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import GroupsIcon from '@mui/icons-material/Groups'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import TimelineIcon from '@mui/icons-material/Timeline'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'

// ─── Clay design tokens ───────────────────────────────────────────────────────
const CLAY = {
  bg: '#eef2ff',
  surface: '#ffffff',
  blue:   { bg: '#dbeafe', border: '#93c5fd', icon: '#2563eb' },
  indigo: { bg: '#e0e7ff', border: '#a5b4fc', icon: '#4338ca' },
  violet: { bg: '#ede9fe', border: '#c4b5fd', icon: '#7c3aed' },
  green:  { bg: '#dcfce7', border: '#86efac', icon: '#16a34a' },
  sky:    { bg: '#e0f2fe', border: '#7dd3fc', icon: '#0284c7' },
  navy:   '#1e3a8a',
}

// ─── Shared clay box-shadow ───────────────────────────────────────────────────
const clayShadow = (color = 'rgba(99,102,241,0.18)') =>
  `0 8px 32px ${color}, 0 2px 8px rgba(30,58,138,0.08), inset 0 1.5px 0 rgba(255,255,255,0.75)`

const clayPress = (color = 'rgba(99,102,241,0.22)') =>
  `0 4px 12px ${color}, 0 1px 4px rgba(30,58,138,0.1), inset 0 1.5px 0 rgba(255,255,255,0.75)`

// ─── ClayCard ────────────────────────────────────────────────────────────────
function ClayCard({ children, sx = {}, color = CLAY.blue, ...props }) {
  return (
    <Box
      sx={{
        bgcolor: color.bg,
        border: `2px solid ${color.border}`,
        borderRadius: '24px',
        boxShadow: clayShadow(),
        p: 4,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px) scale(1.01)',
          boxShadow: `0 16px 48px rgba(99,102,241,0.22), 0 4px 12px rgba(30,58,138,0.1), inset 0 1.5px 0 rgba(255,255,255,0.8)`,
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  )
}

// ─── ClayIcon ────────────────────────────────────────────────────────────────
function ClayIcon({ icon, color = CLAY.blue, size = 56 }) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '16px',
        bgcolor: color.bg,
        border: `2px solid ${color.border}`,
        boxShadow: `0 4px 12px ${color.border}55, inset 0 1px 0 rgba(255,255,255,0.8)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {React.cloneElement(icon, { sx: { fontSize: size * 0.48, color: color.icon } })}
    </Box>
  )
}

// ─── ClayButton ──────────────────────────────────────────────────────────────
function ClayButton({ children, variant = 'primary', href, endIcon, sx = {} }) {
  const isPrimary = variant === 'primary'
  return (
    <Button
      component="a"
      href={href}
      endIcon={endIcon}
      sx={{
        px: 4,
        py: 1.75,
        borderRadius: '16px',
        fontSize: '1rem',
        fontWeight: 700,
        textTransform: 'none',
        letterSpacing: 0,
        ...(isPrimary
          ? {
              bgcolor: CLAY.navy,
              color: '#fff',
              border: '2px solid #1e40af',
              boxShadow: `0 6px 20px rgba(30,58,138,0.35), inset 0 1px 0 rgba(255,255,255,0.15)`,
              '&:hover': {
                bgcolor: '#1d4ed8',
                boxShadow: clayPress('rgba(30,58,138,0.4)'),
                transform: 'translateY(-2px)',
              },
            }
          : {
              bgcolor: 'rgba(255,255,255,0.7)',
              color: CLAY.navy,
              border: `2px solid rgba(147,197,253,0.8)`,
              backdropFilter: 'blur(8px)',
              boxShadow: clayShadow('rgba(147,197,253,0.4)'),
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)',
                transform: 'translateY(-2px)',
              },
            }),
        transition: 'all 0.2s ease',
        ...sx,
      }}
    >
      {children}
    </Button>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Welcome() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: CLAY.bg, fontFamily: 'Inter, sans-serif' }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          pt: { xs: 10, md: 14 },
          pb: { xs: 8, md: 12 },
          // Soft radial blobs
          '&::before': {
            content: '""',
            position: 'absolute',
            width: 600, height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(165,180,252,0.35) 0%, transparent 70%)',
            top: -200, left: -200,
            pointerEvents: 'none',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            width: 500, height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(125,211,252,0.3) 0%, transparent 70%)',
            bottom: -100, right: -100,
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            {/* Left copy */}
            <Grid item xs={12} lg={6}>
              {/* Badge chips */}
              <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ mb: 4, gap: 1.5 }}>
                {[
                  { label: '✦ AI-Powered', color: CLAY.violet },
                  { label: '✦ CEFR Certified', color: CLAY.sky },
                  { label: '✦ Professional Grade', color: CLAY.green },
                ].map(({ label, color }) => (
                  <Box
                    key={label}
                    sx={{
                      px: 2.5, py: 0.75,
                      bgcolor: color.bg,
                      border: `2px solid ${color.border}`,
                      borderRadius: '50px',
                      boxShadow: `0 3px 10px ${color.border}66, inset 0 1px 0 rgba(255,255,255,0.8)`,
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: color.icon,
                    }}
                  >
                    {label}
                  </Box>
                ))}
              </Stack>

              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '3rem', md: '4.25rem' },
                  fontWeight: 900,
                  lineHeight: 1.08,
                  mb: 3,
                  color: CLAY.navy,
                  letterSpacing: '-0.02em',
                }}
              >
                Master English
                <Box
                  component="span"
                  sx={{
                    display: 'block',
                    background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  with FARDI
                </Box>
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  color: '#475569',
                  mb: 5,
                  lineHeight: 1.7,
                  maxWidth: 520,
                }}
              >
                Professional English language assessment powered by advanced AI and internationally recognized CEFR standards.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                <ClayButton href="/auth/signup" endIcon={<ArrowForwardIcon />} variant="primary">
                  Get Started Free
                </ClayButton>
                <ClayButton href="/auth/login" variant="secondary">
                  Sign In
                </ClayButton>
              </Stack>

              <Stack direction="row" flexWrap="wrap" gap={2}>
                {['Free Forever', '10 Min Assessment', 'Instant Results', 'Professional Report'].map(b => (
                  <Stack key={b} direction="row" alignItems="center" spacing={0.75}>
                    <CheckCircleIcon sx={{ fontSize: 18, color: '#16a34a' }} />
                    <Typography sx={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>
                      {b}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Grid>

            {/* Right clay panel */}
            <Grid item xs={12} lg={6}>
              <Box
                sx={{
                  bgcolor: '#ffffff',
                  border: '2.5px solid #bfdbfe',
                  borderRadius: '32px',
                  boxShadow: `0 20px 60px rgba(37,99,235,0.15), 0 4px 16px rgba(30,58,138,0.08), inset 0 2px 0 rgba(255,255,255,0.9)`,
                  p: { xs: 4, md: 5 },
                }}
              >
                {/* Header row */}
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
                  <Box
                    sx={{
                      width: 60, height: 60, borderRadius: '18px',
                      bgcolor: CLAY.blue.bg,
                      border: `2px solid ${CLAY.blue.border}`,
                      boxShadow: `0 4px 12px ${CLAY.blue.border}55, inset 0 1px 0 rgba(255,255,255,0.8)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <SchoolIcon sx={{ fontSize: 30, color: CLAY.blue.icon }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: CLAY.navy }}>
                      FARDI Assessment
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>
                      AI-powered · CEFR aligned
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      ml: 'auto', px: 2, py: 0.5,
                      bgcolor: CLAY.green.bg,
                      border: `2px solid ${CLAY.green.border}`,
                      borderRadius: '50px',
                      fontSize: '0.75rem', fontWeight: 700,
                      color: CLAY.green.icon,
                      boxShadow: `0 2px 8px ${CLAY.green.border}55`,
                    }}
                  >
                    ● Live
                  </Box>
                </Stack>

                {/* Level cards */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {[
                    { level: 'A1–A2', label: 'Beginner',     color: CLAY.green,  pct: 100 },
                    { level: 'B1–B2', label: 'Intermediate', color: CLAY.blue,   pct: 100 },
                    { level: 'C1–C2', label: 'Advanced',     color: CLAY.violet, pct: 100 },
                  ].map(({ level, label, color, pct }) => (
                    <Grid item xs={4} key={level}>
                      <Box
                        sx={{
                          bgcolor: color.bg,
                          border: `2px solid ${color.border}`,
                          borderRadius: '16px',
                          p: 2, textAlign: 'center',
                          boxShadow: `0 4px 12px ${color.border}44, inset 0 1px 0 rgba(255,255,255,0.8)`,
                        }}
                      >
                        <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: color.icon }}>
                          {level}
                        </Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, mt: 0.25 }}>
                          {label}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                {/* Progress bars */}
                {[
                  { label: 'Vocabulary',   pct: 92, color: CLAY.blue   },
                  { label: 'Grammar',      pct: 85, color: CLAY.violet },
                  { label: 'Fluency',      pct: 78, color: CLAY.sky    },
                ].map(({ label, pct, color }) => (
                  <Box key={label} sx={{ mb: 2 }}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
                        {label}
                      </Typography>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: color.icon }}>
                        {pct}%
                      </Typography>
                    </Stack>
                    <Box
                      sx={{
                        height: 10, borderRadius: '50px',
                        bgcolor: color.bg,
                        border: `1.5px solid ${color.border}`,
                        overflow: 'hidden',
                        boxShadow: `inset 0 2px 4px rgba(0,0,0,0.06)`,
                      }}
                    >
                      <Box
                        sx={{
                          width: `${pct}%`, height: '100%',
                          background: `linear-gradient(90deg, ${color.icon}cc, ${color.icon})`,
                          borderRadius: '50px',
                          boxShadow: `0 2px 6px ${color.icon}44`,
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={3}>
          {[
            { number: '5,000+', label: 'Active Users',    icon: <GroupsIcon />,       color: CLAY.blue   },
            { number: '98%',    label: 'Accuracy Rate',   icon: <SpeedIcon />,        color: CLAY.green  },
            { number: '15 min', label: 'Avg Duration',    icon: <TimelineIcon />,     color: CLAY.violet },
            { number: '24/7',   label: 'AI Availability', icon: <AutoAwesomeIcon />,  color: CLAY.sky    },
          ].map(({ number, label, icon, color }) => (
            <Grid item xs={6} md={3} key={label}>
              <ClayCard color={color} sx={{ textAlign: 'center', py: 4 }}>
                <ClayIcon icon={icon} color={color} size={52} />
                <Typography sx={{ fontWeight: 900, fontSize: '2rem', color: CLAY.navy, mt: 2, lineHeight: 1 }}>
                  {number}
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600, mt: 0.5 }}>
                  {label}
                </Typography>
              </ClayCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h2"
            sx={{ fontWeight: 900, color: CLAY.navy, fontSize: { xs: '2rem', md: '2.75rem' }, mb: 2 }}
          >
            How FARDI Works
          </Typography>
          <Typography sx={{ color: '#64748b', fontSize: '1.1rem', maxWidth: 500, mx: 'auto' }}>
            Three simple steps to professional language results
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {[
            {
              step: '01',
              title: 'Take Assessment',
              description: 'Complete our interactive English assessment through AI-powered conversations that evaluate all language skills.',
              icon: <QuizIcon />,
              color: CLAY.blue,
            },
            {
              step: '02',
              title: 'AI Analysis',
              description: 'Our AI analyzes grammar, vocabulary, pronunciation, and fluency against internationally recognized CEFR standards.',
              icon: <PsychologyIcon />,
              color: CLAY.violet,
            },
            {
              step: '03',
              title: 'Get Results',
              description: 'Receive a detailed professional report with your CEFR level and personalized improvement recommendations.',
              icon: <BarChartIcon />,
              color: CLAY.green,
            },
          ].map(({ step, title, description, icon, color }) => (
            <Grid item xs={12} md={4} key={step}>
              <ClayCard color={color} sx={{ height: '100%', position: 'relative' }}>
                <Typography
                  sx={{
                    position: 'absolute', top: 20, right: 24,
                    fontSize: '3.5rem', fontWeight: 900,
                    color: color.border, lineHeight: 1,
                    userSelect: 'none',
                  }}
                >
                  {step}
                </Typography>
                <ClayIcon icon={icon} color={color} size={60} />
                <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', color: CLAY.navy, mt: 2.5, mb: 1.5 }}>
                  {title}
                </Typography>
                <Typography sx={{ color: '#475569', lineHeight: 1.7, fontSize: '0.95rem' }}>
                  {description}
                </Typography>
              </ClayCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h2"
            sx={{ fontWeight: 900, color: CLAY.navy, fontSize: { xs: '2rem', md: '2.75rem' }, mb: 2 }}
          >
            Why Choose FARDI
          </Typography>
          <Typography sx={{ color: '#64748b', fontSize: '1.1rem', maxWidth: 500, mx: 'auto' }}>
            Professional features designed for accurate language assessment
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {[
            { icon: <LanguageIcon />,    title: 'CEFR Standards',      description: 'Internationally recognized framework ensuring accurate and reliable language proficiency assessment.',  color: CLAY.sky    },
            { icon: <PsychologyIcon />,  title: 'AI Technology',       description: 'Advanced artificial intelligence provides comprehensive evaluation of all language skills.',              color: CLAY.violet },
            { icon: <SpeedIcon />,       title: 'Quick Results',       description: 'Get detailed assessment results in minutes with a comprehensive skill-by-skill breakdown.',               color: CLAY.blue   },
            { icon: <EmojiEventsIcon />, title: 'Professional Reports', description: 'Receive certificates and detailed reports suitable for academic and professional applications.',          color: CLAY.green  },
          ].map(({ icon, title, description, color }) => (
            <Grid item xs={12} sm={6} key={title}>
              <ClayCard color={color} sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                <ClayIcon icon={icon} color={color} size={52} />
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: CLAY.navy, mb: 1 }}>
                    {title}
                  </Typography>
                  <Typography sx={{ color: '#475569', lineHeight: 1.7, fontSize: '0.9rem' }}>
                    {description}
                  </Typography>
                </Box>
              </ClayCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <Box sx={{ py: 12 }}>
        <Container maxWidth="md">
          <Box
            sx={{
              bgcolor: CLAY.navy,
              borderRadius: '32px',
              border: '2.5px solid #1d4ed8',
              boxShadow: `0 24px 64px rgba(30,58,138,0.35), inset 0 2px 0 rgba(255,255,255,0.12)`,
              p: { xs: 5, md: 8 },
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                width: 400, height: 400,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(165,180,252,0.15) 0%, transparent 60%)',
                top: -150, right: -100,
                pointerEvents: 'none',
              },
            }}
          >
            <Typography
              variant="h2"
              sx={{ fontWeight: 900, color: '#fff', fontSize: { xs: '2rem', md: '2.75rem' }, mb: 2 }}
            >
              Ready to Get Started?
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', mb: 5, lineHeight: 1.7 }}>
              Join thousands of professionals and students who trust FARDI for accurate English assessment.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} justifyContent="center" sx={{ mb: 5 }}>
              <Button
                component="a"
                href="/auth/signup"
                endIcon={<PlayCircleOutlineIcon />}
                sx={{
                  px: 5, py: 1.75,
                  borderRadius: '16px',
                  bgcolor: '#fff',
                  color: CLAY.navy,
                  fontWeight: 800,
                  fontSize: '1rem',
                  textTransform: 'none',
                  border: '2px solid rgba(255,255,255,0.9)',
                  boxShadow: `0 6px 20px rgba(255,255,255,0.25), inset 0 1px 0 rgba(255,255,255,0.8)`,
                  '&:hover': { bgcolor: '#f0f4ff', transform: 'translateY(-2px)' },
                  transition: 'all 0.2s ease',
                }}
              >
                Start Free Assessment
              </Button>
              <Button
                component="a"
                href="/auth/login"
                sx={{
                  px: 5, py: 1.75,
                  borderRadius: '16px',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '1rem',
                  textTransform: 'none',
                  border: '2px solid rgba(255,255,255,0.35)',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(8px)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.18)', transform: 'translateY(-2px)' },
                  transition: 'all 0.2s ease',
                }}
              >
                Sign In
              </Button>
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="center" spacing={4} flexWrap="wrap">
              {['Free Forever', 'Professional Reports', 'Instant Results', 'CEFR Certified'].map(f => (
                <Stack key={f} direction="row" alignItems="center" spacing={1}>
                  <CheckCircleIcon sx={{ fontSize: 16, color: '#86efac' }} />
                  <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem', fontWeight: 500 }}>
                    {f}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        </Container>
      </Box>

    </Box>
  )
}
