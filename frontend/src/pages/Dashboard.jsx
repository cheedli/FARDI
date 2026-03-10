import React, { useEffect, useState, useCallback } from 'react'
import {
  Box, Typography, Stack, Button, Chip, LinearProgress, Container, Avatar, useTheme
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import LockIcon from '@mui/icons-material/Lock'
import SchoolIcon from '@mui/icons-material/School'
import GroupIcon from '@mui/icons-material/Group'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CampaignIcon from '@mui/icons-material/Campaign'
import BuildIcon from '@mui/icons-material/Build'
import MapIcon from '@mui/icons-material/Map'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import AssessmentIcon from '@mui/icons-material/Assessment'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import StarIcon from '@mui/icons-material/Star'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } })
}

const PHASE_CONFIG = [
  { id: 1, title: 'Foundation', subtitle: 'Language Assessment', icon: SchoolIcon, color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
  { id: 2, title: 'Cultural Planning', subtitle: 'Event Organization', icon: GroupIcon, color: '#0ea5e9', gradient: 'linear-gradient(135deg, #0ea5e9, #06b6d4)' },
  { id: 4, title: 'Marketing', subtitle: 'Promotion & Outreach', icon: CampaignIcon, color: '#f97316', gradient: 'linear-gradient(135deg, #f97316, #fb923c)' },
  { id: 5, title: 'Execution', subtitle: 'Problem-Solving', icon: BuildIcon, color: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444, #f87171)' },
  { id: 6, title: 'Reflection', subtitle: 'Report & Peer Feedback', icon: StarIcon, color: '#8e44ad', gradient: 'linear-gradient(135deg, #8e44ad, #6c3483)' },
]

export default function Dashboard() {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const navigate = useNavigate()

  const bg = isDark ? '#0f172a' : 'white'
  const cardBg = isDark ? '#1e293b' : 'white'
  const border = isDark ? '#334155' : '#f1f5f9'
  const borderSubtle = isDark ? '#1e293b' : '#f1f5f9'
  const textPrimary = isDark ? '#f1f5f9' : '#0f172a'
  const textSecondary = isDark ? '#94a3b8' : '#64748b'
  const textMuted = isDark ? '#64748b' : '#94a3b8'
  const divider = isDark ? '#1e293b' : '#e2e8f0'
  const hoverBg = isDark ? '#273344' : '#fafafa'

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

  if (loading) return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: bg }}>
      <Box sx={{ width: 200 }}><LinearProgress sx={{ borderRadius: 4, height: 4, bgcolor: border, '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #6366f1, #0ea5e9)' } }} /></Box>
    </Box>
  )
  if (error) return <Box sx={{ p: 6, textAlign: 'center' }}><Typography color="error">Error: {error}</Typography></Box>
  if (!data) return null

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

  const p5Sub1Steps = Object.keys(phase5_progress?.subphase1 || {}).length
  const p5Sub2Steps = Object.keys(phase5_progress?.subphase2 || {}).length
  const p5TotalSteps = p5Sub1Steps + p5Sub2Steps

  const p6Sub1Steps = Object.keys(phase6_progress?.subphase1 || {}).length
  const p6Sub2Steps = Object.keys(phase6_progress?.subphase2 || {}).length
  const p6TotalSteps = p6Sub1Steps + p6Sub2Steps
  const hasCompletedPhase6 = isPhaseComplete(6)

  const hasPhase2Progress = phase2_progress?.responses?.length > 0 || phase2_progress?.steps?.length > 0 || phase2_progress?.remedial_activities?.length > 0

  const getCurrentPhase2Step = () => {
    if (phase2_progress?.remedial_activities?.length > 0) {
      const lastRemedial = phase2_progress.remedial_activities[phase2_progress.remedial_activities.length - 1]
      if (!lastRemedial.completed) {
        return { type: 'remedial', url: `/phase2/remedial/${lastRemedial.step_id}/${lastRemedial.level}` }
      }
    }
    if (!phase2_progress?.steps?.length) return null
    const incompleteStep = phase2_progress.steps.find(step => !step.completed_at)
    if (incompleteStep) return { type: 'step', stepId: incompleteStep.step_id }
    const lastStep = phase2_progress.steps[phase2_progress.steps.length - 1]
    return lastStep ? { type: 'step', stepId: lastStep.step_id } : null
  }
  const currentPhase2Step = getCurrentPhase2Step()

  const getPhaseState = (phaseId) => {
    switch (phaseId) {
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
      if (hasPhase2Progress && currentPhase2Step) {
        return currentPhase2Step.type === 'remedial' ? currentPhase2Step.url : `/phase2/step/${currentPhase2Step.stepId}`
      }
      return '/phase2'
    }
    if (phase.id === 6) return '/phase6/subphase/1/step/1'
    return phase.path
  }

  const getPhaseProgress = (phaseId) => {
    switch (phaseId) {
      case 1: return currentProgress ? ((currentProgress.current_step + 1) / currentProgress.total_steps) * 100 : (hasCompletedPhase1 ? 100 : 0)
      case 2: return (p2Completed / 9) * 100
      case 5: return (p5TotalSteps / 10) * 100
      case 6: return (p6TotalSteps / 10) * 100
      default: return getPhaseState(phaseId).completed ? 100 : 0
    }
  }

  // Resume helpers
  const getPhaseStartUrl = (phaseId) => {
    if (phaseId === 1) return '/game'
    if (phaseId === 2) return '/phase2'
    if (phaseId === 4) return '/phase4/step/1/interaction/1'
    if (phaseId === 5) return '/phase5/subphase/1/step/1/interaction/1'
    if (phaseId === 6) return '/phase6/subphase/1/step/1/interaction/1'
    return '/'
  }

  const buildResumeUrl = (resumeData) => {
    const { phase, subphase, step, interaction } = resumeData
    if (phase === 1 || phase === 2) return getPhaseStartUrl(phase)
    if (subphase) return `/phase${phase}/subphase/${subphase}/step/${step}/interaction/${interaction}`
    return `/phase${phase}/step/${step}/interaction/${interaction}`
  }

  const handlePhaseClick = useCallback(async (phase, state) => {
    const href = getPhaseHref(phase)
    // For phases 3-6 in progress, try to resume
    if (state.inProgress && phase.id >= 3) {
      try {
        const res = await fetch(`/api/progress/resume?phase=${phase.id}`, { credentials: 'include' })
        const data = await res.json()
        if (data.success && data.data) {
          const url = buildResumeUrl(data.data)
          navigate(url, {
            state: {
              resumeFrom: data.data.item_index,
              previousResponses: data.data.previous_responses,
              sessionId: data.data.session_id,
            }
          })
          return
        }
      } catch (e) {
        // Fall through to default href
      }
    }
    navigate(href)
  }, [navigate])

  const completedPhases = [hasCompletedPhase1, hasCompletedPhase2, hasCompletedPhase4, hasCompletedPhase5, hasCompletedPhase6].filter(Boolean).length
  const overallProgress = (completedPhases / 5) * 100

  const stats = [
    { label: 'CEFR Level', value: bestLevel, icon: <WorkspacePremiumIcon />, color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
    { label: 'Total XP', value: totalXp.toLocaleString(), icon: <AutoAwesomeIcon />, color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
    { label: 'Assessments', value: totalAssessments, icon: <AssessmentIcon />, color: '#0ea5e9', gradient: 'linear-gradient(135deg, #0ea5e9, #06b6d4)' },
    { label: 'Avg XP', value: Math.round(user_stats?.avg_xp || 0), icon: <TrendingUpIcon />, color: '#22c55e', gradient: 'linear-gradient(135deg, #22c55e, #16a34a)' },
  ]

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: bg }}>

      {/* ── HEADER WITH GRADIENT ACCENT ── */}
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        {/* Decorative blobs */}
        <Box sx={{ position: 'absolute', top: -80, right: -60, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: -40, left: -80, width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.06) 0%, transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }} />

        <Container maxWidth="lg" sx={{ pt: { xs: 4, md: 5 }, pb: { xs: 3, md: 4 }, position: 'relative' }}>
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
              <Box>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 0.5 }}>
                  <Typography sx={{ fontSize: { xs: '1.8rem', md: '2.2rem' }, fontWeight: 800, color: textPrimary, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                    Welcome back, {name}
                  </Typography>
                  {completedPhases === 5 && (
                    <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 1, delay: 0.8 }}>
                      <EmojiEventsIcon sx={{ fontSize: 28, color: '#f59e0b' }} />
                    </motion.div>
                  )}
                </Stack>
                <Typography sx={{ color: textSecondary, fontSize: '0.95rem' }}>
                  {completedPhases === 5 ? 'All phases completed — amazing work!' : completedPhases > 0 ? `${completedPhases} of 5 phases completed` : 'Start your learning journey today'}
                </Typography>
              </Box>
              <Button
                href="/phase-journey"
                startIcon={<MapIcon />}
                endIcon={<ArrowForwardIcon sx={{ fontSize: '16px !important' }} />}
                sx={{
                  px: 2.5, py: 1,
                  borderRadius: 3,
                  border: `1px solid ${divider}`,
                  color: textSecondary,
                  fontWeight: 600,
                  bgcolor: cardBg,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  '&:hover': { borderColor: border, bgcolor: hoverBg, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }
                }}
              >
                Learning Journey
              </Button>
            </Stack>
          </motion.div>

          {/* Overall progress bar */}
          {completedPhases > 0 && completedPhases < 4 && (
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
              <Box sx={{ mt: 3, p: 2.5, borderRadius: 3, bgcolor: hoverBg, border: `1px solid ${borderSubtle}` }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography sx={{ fontSize: '0.82rem', color: textSecondary, fontWeight: 600 }}>Overall Progress</Typography>
                  <Typography sx={{ fontSize: '0.82rem', color: '#6366f1', fontWeight: 700 }}>{completedPhases}/5 phases</Typography>
                </Stack>
                <Box sx={{ height: 6, borderRadius: 3, bgcolor: divider, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: `${overallProgress}%` }}
                    transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
                    style={{ height: '100%', borderRadius: 6, background: 'linear-gradient(90deg, #6366f1, #0ea5e9)' }}
                  />
                </Box>
              </Box>
            </motion.div>
          )}
        </Container>
        <Box sx={{ height: 1, background: `linear-gradient(90deg, transparent, ${divider} 20%, ${divider} 80%, transparent)` }} />
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>

        {/* ── STATS GRID ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
            gap: 2.5,
            mb: 4,
          }}>
            {stats.map((stat, i) => (
              <motion.div key={stat.label} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                <Box sx={{
                  p: 3,
                  borderRadius: 4,
                  bgcolor: cardBg,
                  border: `1px solid ${border}`,
                  transition: 'all 0.3s',
                  cursor: 'default',
                  '&:hover': { borderColor: `${stat.color}30`, boxShadow: `0 12px 32px ${stat.color}12` },
                }}>
                  <Stack spacing={1.5}>
                    <Avatar sx={{
                      width: 44, height: 44,
                      background: stat.gradient,
                      boxShadow: `0 4px 14px ${stat.color}30`,
                    }}>
                      {React.cloneElement(stat.icon, { sx: { fontSize: 22, color: 'white' } })}
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color: textPrimary, lineHeight: 1.1, letterSpacing: '-0.01em' }}>
                        {stat.value}
                      </Typography>
                      <Typography sx={{ color: textMuted, fontSize: '0.78rem', fontWeight: 500, mt: 0.3 }}>
                        {stat.label}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </motion.div>
            ))}
          </Box>
        </motion.div>

        {/* ── PHASE CARDS ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
            <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', color: textPrimary, letterSpacing: '-0.01em' }}>
              Assessment Phases
            </Typography>
            <Chip
              label={`${completedPhases}/5`}
              size="small"
              sx={{
                fontWeight: 700, fontSize: '0.75rem',
                bgcolor: completedPhases === 4 ? (isDark ? '#14532d' : '#f0fdf4') : (isDark ? '#1e293b' : '#f8fafc'),
                color: completedPhases === 4 ? '#16a34a' : textSecondary,
                border: `1px solid ${completedPhases === 4 ? '#bbf7d0' : divider}`,
              }}
            />
          </Stack>
        </motion.div>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
          gap: 2.5,
          mb: 4,
        }}>
          {PHASE_CONFIG.map((phase, i) => {
            const state = getPhaseState(phase.id)
            const progress = getPhaseProgress(phase.id)
            const IconComp = phase.icon

            return (
              <motion.div key={phase.id} variants={fadeUp} initial="hidden" animate="visible" custom={i + 4}>
                <motion.div whileHover={state.unlocked ? { y: -4, transition: { duration: 0.2 } } : {}}>
                  <Box sx={{
                    p: 3,
                    borderRadius: 4,
                    bgcolor: cardBg,
                    border: `1px solid ${border}`,
                    opacity: state.unlocked ? 1 : 0.5,
                    transition: 'all 0.3s',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': state.unlocked ? {
                      borderColor: `${phase.color}30`,
                      boxShadow: `0 16px 40px ${phase.color}12`,
                    } : {},
                  }}>
                    {/* Subtle gradient accent at top */}
                    {state.unlocked && (
                      <Box sx={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                        background: phase.gradient,
                        borderRadius: '16px 16px 0 0',
                      }} />
                    )}

                    <Stack spacing={2}>
                      {/* Header row */}
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar sx={{
                            width: 48, height: 48,
                            background: state.unlocked ? phase.gradient : '#f1f5f9',
                            boxShadow: state.unlocked ? `0 4px 14px ${phase.color}30` : 'none',
                          }}>
                            {state.completed ? (
                              <CheckCircleIcon sx={{ fontSize: 24, color: 'white' }} />
                            ) : !state.unlocked ? (
                              <LockIcon sx={{ fontSize: 22, color: '#cbd5e1' }} />
                            ) : (
                              <IconComp sx={{ fontSize: 24, color: 'white' }} />
                            )}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: state.unlocked ? textPrimary : textMuted, lineHeight: 1.2 }}>
                              Phase {phase.id}
                            </Typography>
                            <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: state.unlocked ? textSecondary : textMuted }}>
                              {phase.title}
                            </Typography>
                          </Box>
                        </Stack>

                        {state.completed && (
                          <Chip size="small" label="Completed" sx={{
                            height: 22, fontSize: '0.68rem', fontWeight: 700,
                            bgcolor: isDark ? '#14532d' : '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0',
                          }} />
                        )}
                        {state.inProgress && !state.completed && (
                          <Chip size="small" label="In Progress" sx={{
                            height: 22, fontSize: '0.68rem', fontWeight: 700,
                            bgcolor: `${phase.color}15`, color: phase.color, border: `1px solid ${phase.color}35`,
                          }} />
                        )}
                        {!state.unlocked && (
                          <Chip size="small" label="Locked" icon={<LockIcon sx={{ fontSize: '12px !important' }} />} sx={{
                            height: 22, fontSize: '0.68rem', fontWeight: 600,
                            bgcolor: isDark ? '#1e293b' : '#f8fafc', color: textMuted, border: `1px solid ${border}`,
                          }} />
                        )}
                      </Stack>

                      {/* Description */}
                      <Typography sx={{ color: textMuted, fontSize: '0.83rem', lineHeight: 1.5 }}>
                        {phase.subtitle}
                      </Typography>

                      {/* Progress bar */}
                      {state.unlocked && progress > 0 && !state.completed && (
                        <Box>
                          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                            <Typography sx={{ fontSize: '0.72rem', color: textMuted, fontWeight: 500 }}>Progress</Typography>
                            <Typography sx={{ fontSize: '0.72rem', color: phase.color, fontWeight: 700 }}>{Math.round(Math.min(progress, 100))}%</Typography>
                          </Stack>
                          <Box sx={{ height: 5, borderRadius: 3, bgcolor: isDark ? '#334155' : '#f1f5f9', overflow: 'hidden' }}>
                            <motion.div
                              initial={{ width: '0%' }}
                              animate={{ width: `${Math.min(progress, 100)}%` }}
                              transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                              style={{ height: '100%', borderRadius: 6, background: phase.gradient }}
                            />
                          </Box>
                        </Box>
                      )}

                      {/* Action button */}
                      {state.unlocked && (
                        <Button
                          onClick={() => handlePhaseClick(phase, state)}
                          fullWidth
                          endIcon={<ArrowForwardIcon sx={{ fontSize: '16px !important' }} />}
                          sx={{
                            py: 1.2,
                            borderRadius: 2.5,
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            ...(state.completed ? {
                              bgcolor: isDark ? '#1e293b' : '#fafafa',
                              color: textSecondary,
                              border: `1px solid ${divider}`,
                              '&:hover': { bgcolor: hoverBg },
                            } : {
                              background: phase.gradient,
                              color: 'white',
                              boxShadow: `0 4px 14px ${phase.color}30`,
                              '&:hover': { boxShadow: `0 6px 20px ${phase.color}40`, filter: 'brightness(1.05)' },
                            }),
                          }}
                        >
                          {state.completed ? 'Review' : state.inProgress ? 'Continue' : 'Start Phase'}
                        </Button>
                      )}
                    </Stack>
                  </Box>
                </motion.div>
              </motion.div>
            )
          })}
        </Box>

        {/* ── RECENT ACTIVITY ── */}
        {recent_assessments?.length > 0 && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={8}>
            <Box sx={{ mb: 4 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
                <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', color: textPrimary, letterSpacing: '-0.01em' }}>
                  Recent Activity
                </Typography>
                <Button
                  href="/results"
                  size="small"
                  endIcon={<ArrowForwardIcon sx={{ fontSize: '14px !important' }} />}
                  sx={{
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    bgcolor: '#6366f1',
                    px: 2,
                    py: 0.6,
                    borderRadius: 2,
                    '&:hover': { bgcolor: '#5356e8' }
                  }}
                >
                  View All
                </Button>
              </Stack>

              <Stack spacing={2}>
                {recent_assessments.slice(0, 3).map((assessment, idx) => (
                  <motion.div key={idx} whileHover={{ y: -2, transition: { duration: 0.2 } }}>
                    <Box sx={{
                      p: 2.5,
                      borderRadius: 3,
                      bgcolor: cardBg,
                      border: `1px solid ${border}`,
                      transition: 'all 0.3s',
                      '&:hover': { borderColor: '#6366f125', boxShadow: '0 8px 24px rgba(99,102,241,0.08)' },
                    }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar sx={{
                            width: 40, height: 40,
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            boxShadow: '0 2px 8px rgba(99,102,241,0.25)',
                          }}>
                            <SchoolIcon sx={{ fontSize: 20, color: 'white' }} />
                          </Avatar>
                          <Box>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Typography sx={{ fontWeight: 600, fontSize: '0.92rem', color: textPrimary }}>
                                Phase 1 Assessment
                              </Typography>
                              <Chip size="small" label={assessment.cefr_level} sx={{
                                height: 22, fontSize: '0.7rem', fontWeight: 700,
                                background: 'linear-gradient(135deg, #6366f110, #8b5cf610)',
                                color: '#6366f1', border: '1px solid #6366f120',
                              }} />
                            </Stack>
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 0.3 }}>
                              <Typography sx={{ color: textMuted, fontSize: '0.78rem' }}>
                                {assessment.completed_at ? new Date(assessment.completed_at).toLocaleDateString() : 'In Progress'}
                              </Typography>
                              <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: divider }} />
                              <Typography sx={{ color: '#f59e0b', fontSize: '0.78rem', fontWeight: 600 }}>
                                {assessment.total_xp} XP
                              </Typography>
                            </Stack>
                          </Box>
                        </Stack>
                        <Button
                          href={assessment.completed_at ? '/results' : '/game'}
                          size="small"
                          sx={{
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            bgcolor: '#6366f1',
                            px: 2,
                            py: 0.6,
                            borderRadius: 2,
                            whiteSpace: 'nowrap',
                            '&:hover': { bgcolor: '#5356e8' }
                          }}
                        >
                          {assessment.completed_at ? 'View' : 'Continue'}
                        </Button>
                      </Stack>
                    </Box>
                  </motion.div>
                ))}
              </Stack>
            </Box>
          </motion.div>
        )}

        {/* ── EMPTY STATE ── */}
        {totalAssessments === 0 && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
            <Box sx={{
              p: { xs: 5, md: 7 },
              borderRadius: 4,
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              background: isDark ? 'linear-gradient(145deg, #1a2438, #1e293b)' : 'linear-gradient(145deg, #fafafa, #ffffff)',
              border: `1px solid ${border}`,
            }}>
              {/* Decorative circles */}
              <Box sx={{ position: 'absolute', top: -30, right: -30, width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.06), transparent 70%)', pointerEvents: 'none' }} />
              <Box sx={{ position: 'absolute', bottom: -20, left: -20, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.05), transparent 70%)', pointerEvents: 'none' }} />

              <Box sx={{ position: 'relative' }}>
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Avatar sx={{
                    width: 72, height: 72,
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    boxShadow: '0 12px 32px rgba(99,102,241,0.3)',
                    mx: 'auto', mb: 3,
                  }}>
                    <RocketLaunchIcon sx={{ fontSize: 36, color: 'white' }} />
                  </Avatar>
                </motion.div>
                <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color: textPrimary, mb: 1, letterSpacing: '-0.02em' }}>
                  Ready to begin?
                </Typography>
                <Typography sx={{ color: textSecondary, mb: 4, maxWidth: 420, mx: 'auto', fontSize: '1rem', lineHeight: 1.6 }}>
                  Take a 15-minute CEFR assessment to discover your English level and unlock the full learning journey.
                </Typography>
                <Button
                  href="/game"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    px: 5, py: 1.6,
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
                  Start Assessment
                </Button>
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
