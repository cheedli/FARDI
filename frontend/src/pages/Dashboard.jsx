import React, { useEffect, useState } from 'react'
import { Box, Typography, Stack, LinearProgress, Container, useTheme } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import SchoolIcon from '@mui/icons-material/School'
import GroupIcon from '@mui/icons-material/Group'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CampaignIcon from '@mui/icons-material/Campaign'
import BuildIcon from '@mui/icons-material/Build'
import StorefrontIcon from '@mui/icons-material/Storefront'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import MapIcon from '@mui/icons-material/Map'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import AssessmentIcon from '@mui/icons-material/Assessment'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import StarIcon from '@mui/icons-material/Star'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import LockIcon from '@mui/icons-material/Lock'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'

// ─── Clay palette ─────────────────────────────────────────────────────────────
const LIGHT = {
  pageBg:  '#FFFDE7',
  cardBg:  '#ffffff',
  heading: '#1A237E',
  body:    '#37474F',
  muted:   '#78909C',
  divider: '#E0E0E0',
  yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825', text: '#5D4037' },
  purple: { bg: '#E1BEE7', border: '#8E24AA', shadow: '#8E24AA' },
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
  orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
  pink:   { bg: '#FCE4EC', border: '#C2185B', shadow: '#C2185B' },
  teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
  red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#C62828' },
  indigo: { bg: '#E8EAF6', border: '#3949AB', shadow: '#3949AB' },
}
const DARK = {
  pageBg:  '#0F0F1A',
  cardBg:  '#1A1A2E',
  heading: '#E8EAFF',
  body:    '#B0BEC5',
  muted:   '#607D8B',
  divider: '#2A2A4A',
  yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#A06800', text: '#FFD54F' },
  purple: { bg: '#1E0A2E', border: '#CE93D8', shadow: '#7B1FA2' },
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
  pink:   { bg: '#1F0010', border: '#F48FB1', shadow: '#880E4F' },
  teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
  red:    { bg: '#1F0000', border: '#EF9A9A', shadow: '#B71C1C' },
  indigo: { bg: '#0D0D2B', border: '#7986CB', shadow: '#283593' },
}

// span: how many columns this card occupies in the 3-col bento grid
// Row 1: [Phase 1 — 2 cols] [Phase 2 — 1 col]
// Row 2: [Phase 3 — 1 col]  [Phase 4 — 2 cols]
// Row 3: [Phase 5 — 2 cols] [Phase 6 — 1 col]
const PHASE_CONFIG = [
  { id: 1, title: 'Foundation',       subtitle: 'Language Assessment',   Icon: SchoolIcon,      colorKey: 'purple', span: 2 },
  { id: 2, title: 'Cultural Planning',subtitle: 'Event Organization',    Icon: GroupIcon,       colorKey: 'blue',   span: 1 },
  { id: 3, title: 'Vendors & Budget', subtitle: 'Negotiation',           Icon: StorefrontIcon,  colorKey: 'green',  span: 1 },
  { id: 4, title: 'Marketing',        subtitle: 'Promotion & Outreach',  Icon: CampaignIcon,    colorKey: 'orange', span: 2 },
  { id: 5, title: 'Execution',        subtitle: 'Problem-Solving',       Icon: BuildIcon,       colorKey: 'pink',   span: 2 },
  { id: 6, title: 'Reflection',       subtitle: 'Report & Peer Feedback',Icon: AutoStoriesIcon, colorKey: 'teal',   span: 1 },
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' } }),
}

export default function Dashboard() {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const D = isDark ? DARK : LIGHT
  const navigate = useNavigate()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/dashboard', { credentials: 'include' })
      .then(async r => { if (!r.ok) throw new Error('Failed to load dashboard'); return r.json() })
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: D.pageBg }}>
      <Box sx={{ width: 200 }}>
        <Box sx={{
          height: 12, borderRadius: '50px',
          bgcolor: D.yellow.bg, border: `2px solid ${D.yellow.border}`,
          boxShadow: `3px 3px 0 ${D.yellow.shadow}`, overflow: 'hidden',
        }}>
          <LinearProgress sx={{ height: '100%', bgcolor: 'transparent', '& .MuiLinearProgress-bar': { bgcolor: D.yellow.border, borderRadius: '50px' } }} />
        </Box>
        <Typography sx={{ textAlign: 'center', mt: 2, color: D.muted, fontWeight: 700, fontSize: '0.85rem' }}>Loading...</Typography>
      </Box>
    </Box>
  )
  if (error) return (
    <Box sx={{ p: 6, textAlign: 'center', bgcolor: D.pageBg, minHeight: '100vh' }}>
      <Box sx={{ display: 'inline-block', px: 3, py: 2, borderRadius: '16px', bgcolor: D.red.bg, border: `2px solid ${D.red.border}`, boxShadow: `3px 3px 0 ${D.red.shadow}` }}>
        <Typography sx={{ color: D.red.border, fontWeight: 700 }}>Error: {error}</Typography>
      </Box>
    </Box>
  )
  if (!data) return null

  // ── Data extraction ────────────────────────────────────────────────────────
  const { user, user_stats, recent_assessments, phase2_progress, phase5_progress, phase6_progress } = data
  const name = user?.first_name || user?.username || 'User'
  const totalAssessments = user_stats?.total_assessments || 0
  const bestLevel = user_stats?.best_level || 'A1'
  const totalXp = user_stats?.total_xp || 0
  const p2Completed = user_stats?.phase2_completed_steps || 0
  const currentProgress = user_stats?.current_progress || null

  const phaseCompletion = user_stats?.phase_completion || []
  const isPhaseComplete = (num) => phaseCompletion.some(pc => pc.phase_number === num && pc.completed)
  const hasCompletedPhase1 = totalAssessments > 0
  const hasCompletedPhase2 = isPhaseComplete(2) || p2Completed >= 9
  const hasCompletedPhase4 = isPhaseComplete(4)
  const hasCompletedPhase5 = isPhaseComplete(5)
  const hasCompletedPhase6 = isPhaseComplete(6)

  const p5TotalSteps = Object.keys(phase5_progress?.subphase1 || {}).length + Object.keys(phase5_progress?.subphase2 || {}).length
  const p6TotalSteps = Object.keys(phase6_progress?.subphase1 || {}).length + Object.keys(phase6_progress?.subphase2 || {}).length
  const hasPhase2Progress = phase2_progress?.responses?.length > 0 || phase2_progress?.steps?.length > 0 || phase2_progress?.remedial_activities?.length > 0

  const getCurrentPhase2Step = () => {
    if (phase2_progress?.remedial_activities?.length > 0) {
      const last = phase2_progress.remedial_activities[phase2_progress.remedial_activities.length - 1]
      if (!last.completed) return { type: 'remedial', url: `/phase2/remedial/${last.step_id}/${last.level}` }
    }
    if (!phase2_progress?.steps?.length) return null
    const inc = phase2_progress.steps.find(s => !s.completed_at)
    if (inc) return { type: 'step', stepId: inc.step_id }
    const last = phase2_progress.steps[phase2_progress.steps.length - 1]
    return last ? { type: 'step', stepId: last.step_id } : null
  }
  const currentPhase2Step = getCurrentPhase2Step()

  const getPhaseState = (id) => {
    switch (id) {
      case 1: return { unlocked: true, completed: hasCompletedPhase1, inProgress: currentProgress != null }
      case 2: return { unlocked: hasCompletedPhase1, completed: hasCompletedPhase2, inProgress: hasPhase2Progress && !hasCompletedPhase2 }
      case 4: return { unlocked: hasCompletedPhase2, completed: hasCompletedPhase4, inProgress: hasCompletedPhase2 && !hasCompletedPhase4 }
      case 5: return { unlocked: hasCompletedPhase4, completed: hasCompletedPhase5, inProgress: p5TotalSteps > 0 && !hasCompletedPhase5 }
      case 6: return { unlocked: hasCompletedPhase5, completed: hasCompletedPhase6, inProgress: p6TotalSteps > 0 && !hasCompletedPhase6 }
      default: return { unlocked: false, completed: false, inProgress: false }
    }
  }

  const getPhaseHref = (phase) => {
    if (phase.id === 1) return '/game'
    if (phase.id === 2) {
      if (hasPhase2Progress && currentPhase2Step)
        return currentPhase2Step.type === 'remedial' ? currentPhase2Step.url : `/phase2/step/${currentPhase2Step.stepId}`
      return '/phase2'
    }
    if (phase.id === 6) return '/phase6/subphase/1/step/1'
    return phase.path
  }

  const getPhaseProgress = (id) => {
    switch (id) {
      case 1: return currentProgress ? ((currentProgress.current_step + 1) / currentProgress.total_steps) * 100 : (hasCompletedPhase1 ? 100 : 0)
      case 2: return (p2Completed / 9) * 100
      case 5: return (p5TotalSteps / 10) * 100
      case 6: return (p6TotalSteps / 10) * 100
      default: return getPhaseState(id).completed ? 100 : 0
    }
  }

  const getPhaseStartUrl = (id) => {
    if (id === 1) return '/game'
    if (id === 2) return '/phase2'
    if (id === 4) return '/phase4/step/1/interaction/1'
    if (id === 5) return '/phase5/subphase/1/step/1/interaction/1'
    if (id === 6) return '/phase6/subphase/1/step/1/interaction/1'
    return '/'
  }

  const buildResumeUrl = ({ phase, subphase, step, interaction }) => {
    if (phase === 1 || phase === 2) return getPhaseStartUrl(phase)
    if (subphase) return `/phase${phase}/subphase/${subphase}/step/${step}/interaction/${interaction}`
    return `/phase${phase}/step/${step}/interaction/${interaction}`
  }

  const handlePhaseClick = async (phase, state) => {
    if (state.inProgress && phase.id >= 3) {
      try {
        const res = await fetch(`/api/progress/resume?phase=${phase.id}`, { credentials: 'include' })
        const d = await res.json()
        if (d.success && d.data) {
          navigate(buildResumeUrl(d.data), { state: { resumeFrom: d.data.item_index, previousResponses: d.data.previous_responses, sessionId: d.data.session_id } })
          return
        }
      } catch {}
    }
    navigate(getPhaseHref(phase))
  }

  const hasCompletedPhase3 = isPhaseComplete(3)
  const completedPhases = [hasCompletedPhase1, hasCompletedPhase2, hasCompletedPhase3, hasCompletedPhase4, hasCompletedPhase5, hasCompletedPhase6].filter(Boolean).length
  const overallProgress = (completedPhases / 6) * 100

  // ── clay helpers ───────────────────────────────────────────────────────────
  const card = (c, extra = {}) => ({
    bgcolor: c.bg,
    border: `2px solid ${c.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${c.shadow}`,
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
    '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${c.shadow}` },
    ...extra,
  })

  const pill = (c) => ({
    display: 'inline-flex', alignItems: 'center', gap: 0.5,
    px: 1.75, py: 0.4, borderRadius: '50px',
    bgcolor: c.bg, border: `2px solid ${c.border}`,
    boxShadow: `2px 2px 0 ${c.shadow}`,
    fontSize: '0.7rem', fontWeight: 800, color: c.border,
  })

  const stats = [
    { label: 'CEFR Level',  value: bestLevel,                         Icon: WorkspacePremiumIcon, color: D.purple },
    { label: 'Total XP',    value: totalXp.toLocaleString(),          Icon: AutoAwesomeIcon,      color: D.yellow },
    { label: 'Assessments', value: totalAssessments,                  Icon: AssessmentIcon,       color: D.blue   },
    { label: 'Avg XP',      value: Math.round(user_stats?.avg_xp||0), Icon: TrendingUpIcon,       color: D.green  },
  ]

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: D.pageBg }}>
      <Container maxWidth="lg" sx={{ pt: { xs: 4, md: 5 }, pb: 8 }}>

        {/* ── HEADER ────────────────────────────────────────────────────────── */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} sx={{ mb: 4 }}>
            <Box>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 0.5 }}>
                <Typography sx={{ fontSize: { xs: '1.8rem', md: '2.2rem' }, fontWeight: 900, color: D.heading, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                  Welcome back,{' '}
                  <Box component="span" sx={{
                    display: 'inline-block',
                    bgcolor: D.yellow.bg, color: D.yellow.text || D.yellow.border,
                    border: `2px solid ${D.yellow.border}`,
                    borderRadius: '10px', boxShadow: `3px 3px 0 ${D.yellow.shadow}`,
                    px: 1.25, py: 0.1,
                  }}>
                    {name}
                  </Box>
                </Typography>
                {completedPhases === 6 && (
                  <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 1, delay: 0.8 }}>
                    <EmojiEventsIcon sx={{ fontSize: 28, color: D.yellow.border }} />
                  </motion.div>
                )}
              </Stack>
              <Typography sx={{ color: D.muted, fontSize: '0.95rem', fontWeight: 600 }}>
                {completedPhases === 6 ? 'All phases completed — amazing work! 🎉' : completedPhases > 0 ? `${completedPhases} of 6 phases completed` : 'Start your learning journey today'}
              </Typography>
            </Box>

            <Box
              component="a" href="/phase-journey"
              sx={{
                display: 'inline-flex', alignItems: 'center', gap: 0.75,
                px: 2.5, py: 1.1, borderRadius: '12px', textDecoration: 'none',
                bgcolor: D.cardBg,
                border: `2px solid ${D.divider}`,
                boxShadow: `3px 3px 0 ${D.divider}`,
                color: D.muted, fontWeight: 800, fontSize: '0.85rem',
                transition: 'transform 0.12s, box-shadow 0.12s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${D.divider}`, color: D.heading },
              }}
            >
              <MapIcon sx={{ fontSize: 17 }} /> Learning Journey <ArrowForwardIcon sx={{ fontSize: 15 }} />
            </Box>
          </Stack>
        </motion.div>

        {/* ── OVERALL PROGRESS ──────────────────────────────────────────────── */}
        {completedPhases > 0 && completedPhases < 6 && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
            <Box sx={{ ...card(D.indigo), p: 3, mb: 4 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography sx={{ fontSize: '0.85rem', color: D.body, fontWeight: 800 }}>Overall Progress</Typography>
                <Box sx={pill(D.indigo)}>{completedPhases}/6 phases</Box>
              </Stack>
              <Box sx={{ height: 12, borderRadius: '50px', bgcolor: D.pageBg, border: `2px solid ${D.indigo.border}`, overflow: 'hidden', boxShadow: `inset 0 2px 4px rgba(0,0,0,0.08)` }}>
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
                  style={{ height: '100%', borderRadius: 50, background: D.indigo.border }}
                />
              </Box>
            </Box>
          </motion.div>
        )}

        {/* ── STATS ─────────────────────────────────────────────────────────── */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2,1fr)', sm: 'repeat(4,1fr)' }, gap: 2.5, mb: 5 }}>
            {stats.map((stat, i) => (
              <Box key={stat.label} sx={{ ...card(stat.color), p: 3 }}>
                <Box sx={{
                  width: 44, height: 44, borderRadius: '13px', mb: 2,
                  bgcolor: D.cardBg,
                  border: `2px solid ${stat.color.border}`,
                  boxShadow: `3px 3px 0 ${stat.color.shadow}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <stat.Icon sx={{ fontSize: 22, color: stat.color.border }} />
                </Box>
                <Typography sx={{ fontWeight: 900, fontSize: '1.6rem', color: D.heading, lineHeight: 1, letterSpacing: '-0.02em', mb: 0.4 }}>
                  {stat.value}
                </Typography>
                <Typography sx={{ color: D.muted, fontSize: '0.78rem', fontWeight: 700 }}>
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </motion.div>

        {/* ── PHASES HEADER ─────────────────────────────────────────────────── */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
            <Typography sx={{ fontWeight: 900, fontSize: '1.4rem', color: D.heading, letterSpacing: '-0.02em' }}>
              Assessment Phases
            </Typography>
            <Box sx={pill(completedPhases === 6 ? D.green : D.indigo)}>
              {completedPhases}/6 completed
            </Box>
          </Stack>
        </motion.div>

        {/* ── PHASE BENTO GRID ──────────────────────────────────────────────── */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          gap: 2,
          mb: 5,
        }}>
          {PHASE_CONFIG.map((phase, i) => {
            const state = getPhaseState(phase.id)
            const progress = getPhaseProgress(phase.id)
            const c = D[phase.colorKey]
            const isWide = phase.span === 2

            return (
              <motion.div
                key={phase.id}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={i + 4}
                style={{ gridColumn: isWide ? 'span 2' : 'span 1' }}
              >
                <Box sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: isWide ? 'row' : 'column',
                  gap: isWide ? 3 : 0,
                  bgcolor: state.unlocked ? c.bg : (isDark ? '#16162A' : '#F5F5F5'),
                  border: `2px solid ${state.unlocked ? c.border : D.divider}`,
                  borderRadius: '20px',
                  boxShadow: state.unlocked ? `4px 4px 0 ${c.shadow}` : `3px 3px 0 ${D.divider}`,
                  p: isWide ? 3 : 2.5,
                  opacity: state.unlocked ? 1 : 0.55,
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  ...(state.unlocked ? { '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${c.shadow}` } } : {}),
                }}>

                  {/* Left section (wide cards) or full content (narrow cards) */}
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {/* Icon + label row */}
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box sx={{
                        width: isWide ? 52 : 44, height: isWide ? 52 : 44,
                        borderRadius: '14px', flexShrink: 0,
                        bgcolor: D.cardBg,
                        border: `2px solid ${state.unlocked ? c.border : D.divider}`,
                        boxShadow: state.unlocked ? `3px 3px 0 ${c.shadow}` : 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {state.completed
                          ? <CheckCircleIcon sx={{ fontSize: isWide ? 24 : 20, color: D.green.border }} />
                          : !state.unlocked
                          ? <LockIcon sx={{ fontSize: isWide ? 22 : 18, color: D.muted }} />
                          : <phase.Icon sx={{ fontSize: isWide ? 24 : 20, color: c.border }} />
                        }
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 800, fontSize: '0.7rem', color: D.muted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                          Phase {phase.id}
                        </Typography>
                        <Typography sx={{ fontWeight: 900, fontSize: isWide ? '1.05rem' : '0.92rem', color: state.unlocked ? D.heading : D.muted, lineHeight: 1.2 }}>
                          {phase.title}
                        </Typography>
                      </Box>
                      {/* Status pill — only on narrow cards (wide cards show it separately) */}
                      {!isWide && state.completed && <Box sx={pill(D.green)}>✓ Done</Box>}
                      {!isWide && state.inProgress && !state.completed && <Box sx={pill(c)}>● Active</Box>}
                    </Stack>

                    {/* Subtitle */}
                    <Typography sx={{ color: D.muted, fontSize: '0.82rem', fontWeight: 600 }}>
                      {phase.subtitle}
                    </Typography>

                    {/* Progress bar (only if in progress) */}
                    {state.unlocked && progress > 0 && !state.completed && (
                      <Box>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                          <Typography sx={{ fontSize: '0.68rem', color: D.muted, fontWeight: 700 }}>Progress</Typography>
                          <Typography sx={{ fontSize: '0.68rem', color: c.border, fontWeight: 900 }}>{Math.round(Math.min(progress, 100))}%</Typography>
                        </Stack>
                        <Box sx={{ height: 8, borderRadius: '50px', bgcolor: D.pageBg, border: `2px solid ${c.border}`, overflow: 'hidden', boxShadow: `2px 2px 0 ${c.shadow}` }}>
                          <motion.div
                            initial={{ width: '0%' }}
                            animate={{ width: `${Math.min(progress, 100)}%` }}
                            transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                            style={{ height: '100%', borderRadius: 50, background: c.border }}
                          />
                        </Box>
                      </Box>
                    )}

                    {/* Action button for narrow cards */}
                    {!isWide && (
                      <Box
                        component={state.unlocked ? 'button' : 'div'}
                        onClick={state.unlocked ? () => handlePhaseClick(phase, state) : undefined}
                        sx={{
                          mt: 'auto',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                          width: '100%', py: 1.25, borderRadius: '12px',
                          fontWeight: 900, fontSize: '0.82rem',
                          cursor: state.unlocked ? 'pointer' : 'default',
                          transition: 'transform 0.12s, box-shadow 0.12s',
                          ...(state.unlocked
                            ? state.completed
                              ? { bgcolor: D.cardBg, border: `2px solid ${D.divider}`, boxShadow: `2px 2px 0 ${D.divider}`, color: D.muted }
                              : { bgcolor: c.bg, border: `2px solid ${c.border}`, boxShadow: `3px 3px 0 ${c.shadow}`, color: c.border }
                            : { bgcolor: isDark ? '#1A1A2E' : '#F0F0F0', border: `2px solid ${D.divider}`, boxShadow: 'none', color: D.muted }
                          ),
                        }}
                      >
                        {state.unlocked
                          ? state.completed ? <><AssessmentIcon sx={{ fontSize: 15 }} /> Review</> : state.inProgress ? <><PlayArrowIcon sx={{ fontSize: 15 }} /> Continue</> : <><RocketLaunchIcon sx={{ fontSize: 15 }} /> Start</>
                          : <><LockIcon sx={{ fontSize: 14 }} /> Locked</>
                        }
                      </Box>
                    )}
                  </Box>

                  {/* Right section — only for wide cards: big action button */}
                  {isWide && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 180, gap: 2 }}>
                      {/* Status pill */}
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {state.completed && <Box sx={pill(D.green)}>✓ Done</Box>}
                        {state.inProgress && !state.completed && <Box sx={pill(c)}>● Active</Box>}
                      </Box>

                      {/* Big action button */}
                      <Box
                        component={state.unlocked ? 'button' : 'div'}
                        onClick={state.unlocked ? () => handlePhaseClick(phase, state) : undefined}
                        sx={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                          width: '100%', py: 1.6, borderRadius: '14px',
                          fontWeight: 900, fontSize: '0.92rem',
                          cursor: state.unlocked ? 'pointer' : 'default',
                          transition: 'transform 0.12s, box-shadow 0.12s',
                          ...(state.unlocked
                            ? state.completed
                              ? { bgcolor: D.cardBg, border: `2px solid ${D.divider}`, boxShadow: `3px 3px 0 ${D.divider}`, color: D.muted, '&:hover': { transform: 'translate(-1px,-1px)', boxShadow: `4px 4px 0 ${D.divider}` } }
                              : { bgcolor: c.bg, border: `2px solid ${c.border}`, boxShadow: `4px 4px 0 ${c.shadow}`, color: c.border, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${c.shadow}` }, '&:active': { transform: 'translate(1px,1px)', boxShadow: `1px 1px 0 ${c.shadow}` } }
                            : { bgcolor: isDark ? '#1A1A2E' : '#F0F0F0', border: `2px solid ${D.divider}`, boxShadow: 'none', color: D.muted }
                          ),
                        }}
                      >
                        {state.unlocked
                          ? state.completed ? <><AssessmentIcon sx={{ fontSize: 17 }} /> Review <ArrowForwardIcon sx={{ fontSize: 15 }} /></> : state.inProgress ? <><PlayArrowIcon sx={{ fontSize: 17 }} /> Continue <ArrowForwardIcon sx={{ fontSize: 15 }} /></> : <><RocketLaunchIcon sx={{ fontSize: 17 }} /> Start Phase <ArrowForwardIcon sx={{ fontSize: 15 }} /></>
                          : <><LockIcon sx={{ fontSize: 15 }} /> Locked</>
                        }
                      </Box>
                    </Box>
                  )}
                </Box>
              </motion.div>
            )
          })}
        </Box>

        {/* ── RECENT ACTIVITY ───────────────────────────────────────────────── */}
        {recent_assessments?.length > 0 && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={9}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
              <Typography sx={{ fontWeight: 900, fontSize: '1.4rem', color: D.heading, letterSpacing: '-0.02em' }}>
                Recent Activity
              </Typography>
              <Box component="a" href="/results" sx={{
                display: 'inline-flex', alignItems: 'center', gap: 0.5,
                textDecoration: 'none', ...pill(D.purple),
                px: 2, py: 0.6, fontSize: '0.78rem',
              }}>
                View All <ArrowForwardIcon sx={{ fontSize: 13 }} />
              </Box>
            </Stack>

            <Stack spacing={2}>
              {recent_assessments.slice(0, 3).map((a, idx) => (
                <motion.div key={idx} variants={fadeUp} initial="hidden" animate="visible" custom={10 + idx}>
                  <Box sx={{ ...card(D.blue), p: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{
                          width: 44, height: 44, borderRadius: '13px',
                          bgcolor: D.cardBg, border: `2px solid ${D.purple.border}`,
                          boxShadow: `3px 3px 0 ${D.purple.shadow}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <SchoolIcon sx={{ fontSize: 22, color: D.purple.border }} />
                        </Box>
                        <Box>
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.3 }}>
                            <Typography sx={{ fontWeight: 800, fontSize: '0.92rem', color: D.heading }}>Phase 1 Assessment</Typography>
                            <Box sx={pill(D.purple)}>{a.cefr_level}</Box>
                          </Stack>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Typography sx={{ color: D.muted, fontSize: '0.78rem', fontWeight: 600 }}>
                              {a.completed_at ? new Date(a.completed_at).toLocaleDateString() : 'In Progress'}
                            </Typography>
                            <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: D.divider }} />
                            <Box sx={{ ...pill(D.yellow), px: 1.5, py: 0.3, fontSize: '0.72rem' }}>
                              ✦ {a.total_xp} XP
                            </Box>
                          </Stack>
                        </Box>
                      </Stack>
                      <Box
                        component="a"
                        href={a.completed_at ? '/results' : '/game'}
                        sx={{
                          display: 'inline-flex', alignItems: 'center', gap: 0.5,
                          textDecoration: 'none', ...pill(D.purple),
                          px: 2, py: 0.75, fontSize: '0.8rem',
                        }}
                      >
                        {a.completed_at ? 'View' : 'Continue'} <ArrowForwardIcon sx={{ fontSize: 13 }} />
                      </Box>
                    </Stack>
                  </Box>
                </motion.div>
              ))}
            </Stack>
          </motion.div>
        )}

        {/* ── EMPTY STATE ───────────────────────────────────────────────────── */}
        {totalAssessments === 0 && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
            <Box sx={{
              ...card(D.purple),
              p: { xs: 5, md: 7 }, textAlign: 'center',
              boxShadow: `8px 8px 0 ${D.purple.shadow}`,
            }}>
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                <Box sx={{
                  width: 72, height: 72, borderRadius: '22px', mx: 'auto', mb: 3,
                  bgcolor: D.cardBg, border: `2px solid ${D.purple.border}`,
                  boxShadow: `4px 4px 0 ${D.purple.shadow}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <RocketLaunchIcon sx={{ fontSize: 36, color: D.purple.border }} />
                </Box>
              </motion.div>
              <Typography sx={{ fontWeight: 900, fontSize: '1.6rem', color: D.heading, mb: 1, letterSpacing: '-0.02em' }}>
                Ready to begin?
              </Typography>
              <Typography sx={{ color: D.body, mb: 4, maxWidth: 420, mx: 'auto', fontSize: '1rem', lineHeight: 1.7, fontWeight: 500 }}>
                Take a 15-minute CEFR assessment to discover your English level and unlock the full learning journey.
              </Typography>
              <Box
                component="a" href="/game"
                sx={{
                  display: 'inline-flex', alignItems: 'center', gap: 1,
                  px: 4.5, py: 1.75, borderRadius: '14px', textDecoration: 'none',
                  bgcolor: D.green.bg, border: `2px solid ${D.green.border}`,
                  boxShadow: `5px 5px 0 ${D.green.shadow}`,
                  color: D.green.border, fontWeight: 900, fontSize: '1rem',
                  transition: 'transform 0.12s, box-shadow 0.12s',
                  '&:hover': { transform: 'translate(-3px,-3px)', boxShadow: `8px 8px 0 ${D.green.shadow}` },
                }}
              >
                <RocketLaunchIcon sx={{ fontSize: 20 }} /> Start Assessment <ArrowForwardIcon sx={{ fontSize: 18 }} />
              </Box>
            </Box>
          </motion.div>
        )}

      </Container>
    </Box>
  )
}
