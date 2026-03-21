import React, { useEffect, useState, useMemo } from 'react'
import { Box, Typography, LinearProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LockIcon from '@mui/icons-material/Lock'
import SchoolIcon from '@mui/icons-material/School'
import GroupIcon from '@mui/icons-material/Group'
import StorefrontIcon from '@mui/icons-material/Storefront'
import CampaignIcon from '@mui/icons-material/Campaign'
import BuildIcon from '@mui/icons-material/Build'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import StarIcon from '@mui/icons-material/Star'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { useColorMode } from '../theme.jsx'

const LIGHT = {
  pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', border: '#E0E0E0',
  yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825' },
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
}
const DARK = {
  pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', border: '#2A2A4A',
  yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#A06800' },
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
}

const PHASES = [
  {
    id: 1,
    title: 'Foundation',
    subtitle: 'Language Assessment',
    icon: SchoolIcon,
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    path: '/game',
    description: 'Assess your English level through interactive exercises',
  },
  {
    id: 2,
    title: 'Cultural Planning',
    subtitle: 'Event Organization',
    icon: GroupIcon,
    color: '#0ea5e9',
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
    path: '/phase2',
    description: 'Plan a Tunisian cultural celebration with your team',
  },
  {
    id: 3,
    title: 'Vendors & Budget',
    subtitle: 'Negotiation',
    icon: StorefrontIcon,
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
    path: '/phase3/step/1',
    description: 'Negotiate with vendors and manage your event budget',
  },
  {
    id: 4,
    title: 'Marketing',
    subtitle: 'Promotion & Outreach',
    icon: CampaignIcon,
    color: '#f97316',
    gradient: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
    path: '/phase4/step/1',
    description: 'Create marketing campaigns for the Global Cultures Festival',
  },
  {
    id: 5,
    title: 'Execution',
    subtitle: 'Problem-Solving',
    icon: BuildIcon,
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
    path: '/phase5/subphase/1/step/1',
    description: 'Handle last-minute issues and coordinate the event',
  },
  {
    id: 6,
    title: 'Reflection',
    subtitle: 'Evaluation & Feedback',
    icon: AutoStoriesIcon,
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
    path: '/phase6/subphase/1/step/1',
    description: 'Evaluate the event and reflect on your language growth',
  },
]

export default function PhaseJourney() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeNode, setActiveNode] = useState(null)

  const { mode } = useColorMode()
  const D = mode === 'dark' ? DARK : LIGHT

  useEffect(() => {
    fetch('/api/dashboard', { credentials: 'include' })
      .then(r => { if (!r.ok) throw new Error('Failed'); return r.json() })
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const phaseStates = useMemo(() => {
    if (!data) return {}
    const { user_stats, phase2_progress, phase5_progress } = data
    const totalAssessments = user_stats?.total_assessments || 0
    const p2Completed = user_stats?.phase2_completed_steps || 0
    const phaseCompletion = user_stats?.phase_completion || []
    const isComplete = (num) => phaseCompletion.some(pc => pc.phase_number === num && pc.completed)

    const hasCompletedPhase1 = totalAssessments > 0
    const hasCompletedPhase2 = isComplete(2) || p2Completed >= 9
    const hasCompletedPhase3 = isComplete(3)
    const hasCompletedPhase4 = isComplete(4)
    const hasCompletedPhase5 = isComplete(5)
    const hasCompletedPhase6 = isComplete(6)

    const hasPhase2Progress = phase2_progress?.responses?.length > 0 || phase2_progress?.steps?.length > 0
    const p5Sub1Steps = Object.keys(phase5_progress?.subphase1 || {}).length
    const p5Sub2Steps = Object.keys(phase5_progress?.subphase2 || {}).length
    const hasPhase5Progress = (p5Sub1Steps + p5Sub2Steps) > 0

    return {
      1: { completed: hasCompletedPhase1, unlocked: true, inProgress: !hasCompletedPhase1 && totalAssessments === 0 ? false : !hasCompletedPhase1 },
      2: { completed: hasCompletedPhase2, unlocked: hasCompletedPhase1, inProgress: hasCompletedPhase1 && !hasCompletedPhase2 && hasPhase2Progress },
      3: { completed: hasCompletedPhase3, unlocked: hasCompletedPhase2, inProgress: hasCompletedPhase2 && !hasCompletedPhase3 },
      4: { completed: hasCompletedPhase4, unlocked: hasCompletedPhase3, inProgress: hasCompletedPhase3 && !hasCompletedPhase4 },
      5: { completed: hasCompletedPhase5, unlocked: hasCompletedPhase4, inProgress: hasCompletedPhase4 && !hasCompletedPhase5 && hasPhase5Progress },
      6: { completed: hasCompletedPhase6, unlocked: hasCompletedPhase5, inProgress: hasCompletedPhase5 && !hasCompletedPhase6 },
    }
  }, [data])

  const currentPhaseIndex = useMemo(() => {
    if (!data) return 0
    for (let i = PHASES.length - 1; i >= 0; i--) {
      const state = phaseStates[PHASES[i].id]
      if (state?.unlocked && !state?.completed) return i
    }
    const allComplete = PHASES.every(p => phaseStates[p.id]?.completed)
    if (allComplete) return PHASES.length - 1
    return 0
  }, [data, phaseStates])

  const completedCount = PHASES.filter(p => phaseStates[p.id]?.completed).length
  const allDone = PHASES.every(p => phaseStates[p.id]?.completed)

  if (loading) return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: D.pageBg }}>
      <Box sx={{
        px: 3, py: 1.5, borderRadius: '50px',
        bgcolor: D.yellow.bg, border: `2px solid ${D.yellow.border}`,
        boxShadow: `3px 3px 0 ${D.yellow.shadow}`,
      }}>
        <LinearProgress sx={{
          width: 160, borderRadius: 4, height: 6,
          bgcolor: D.border,
          '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #6366f1, #0ea5e9)' }
        }} />
      </Box>
    </Box>
  )

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: D.pageBg,
      py: 4,
      px: { xs: 2, md: 4 },
    }}>
      <Box sx={{ maxWidth: 680, mx: 'auto' }}>

        {/* Header row */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography sx={{
                fontWeight: 900,
                fontSize: '1.8rem',
                color: D.heading,
                lineHeight: 1.1,
              }}>
                Learning Journey
              </Typography>
              <Typography sx={{ color: D.muted, fontSize: '0.88rem', mt: 0.5 }}>
                Track your progress
              </Typography>
            </Box>
            {/* Yellow clay pill */}
            <Box sx={{
              px: 2, py: 0.75, borderRadius: '50px',
              bgcolor: D.yellow.bg, border: `2px solid ${D.yellow.border}`,
              boxShadow: `3px 3px 0 ${D.yellow.shadow}`,
              display: 'flex', alignItems: 'center', gap: 0.75,
              flexShrink: 0, mt: 0.5,
            }}>
              <StarIcon sx={{ fontSize: 15, color: D.yellow.border }} />
              <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: D.yellow.border }}>
                {completedCount}/{PHASES.length}
              </Typography>
            </Box>
          </Box>

          {/* Progress bar */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ height: 8, borderRadius: 4, bgcolor: D.border, overflow: 'hidden' }}>
              <motion.div
                style={{
                  height: '100%',
                  borderRadius: 4,
                  background: 'linear-gradient(90deg, #6366f1, #0ea5e9, #f97316, #ef4444)',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${(completedCount / PHASES.length) * 100}%` }}
                transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
              />
            </Box>
          </Box>
        </motion.div>

        {/* Phase cards */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {PHASES.map((phase, index) => {
            const state = phaseStates[phase.id] || {}
            const isActive = currentPhaseIndex === index
            const isUnlocked = state.unlocked
            const isExpanded = activeNode === index
            const IconComp = phase.icon

            const cardBorderColor = isUnlocked ? phase.color : D.border
            const cardShadow = isUnlocked
              ? `4px 4px 0 ${phase.color}`
              : `4px 4px 0 ${D.border}`

            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2, duration: 0.4 }}
              >
                <Box
                  sx={{
                    bgcolor: D.cardBg,
                    border: `2px solid ${cardBorderColor}`,
                    boxShadow: cardShadow,
                    borderRadius: '20px',
                    overflow: 'hidden',
                    cursor: isUnlocked ? 'pointer' : 'default',
                    opacity: isUnlocked ? 1 : 0.6,
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    ...(isUnlocked && {
                      '&:hover': {
                        transform: 'translate(-2px, -2px)',
                        boxShadow: `6px 6px 0 ${phase.color}`,
                      },
                    }),
                  }}
                  onClick={() => {
                    if (!isUnlocked) return
                    if (isExpanded) {
                      setActiveNode(null)
                    } else {
                      setActiveNode(index)
                    }
                  }}
                >
                  {/* Always-visible row */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
                    {/* Icon box */}
                    <Box sx={{
                      width: 48, height: 48, borderRadius: '14px', flexShrink: 0,
                      bgcolor: state.completed
                        ? D.green.bg
                        : !isUnlocked
                        ? D.border
                        : `${phase.color}15`,
                      border: `2px solid ${state.completed ? D.green.border : !isUnlocked ? D.border : phase.color}`,
                      boxShadow: state.completed
                        ? `3px 3px 0 ${D.green.shadow}`
                        : !isUnlocked
                        ? `3px 3px 0 ${D.border}`
                        : `3px 3px 0 ${phase.color}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {state.completed ? (
                        <CheckCircleIcon sx={{ fontSize: 24, color: D.green.border }} />
                      ) : !isUnlocked ? (
                        <LockIcon sx={{ fontSize: 22, color: D.muted }} />
                      ) : isActive ? (
                        <PlayArrowIcon sx={{ fontSize: 24, color: phase.color }} />
                      ) : (
                        <IconComp sx={{ fontSize: 22, color: phase.color }} />
                      )}
                    </Box>

                    {/* Text middle */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{
                        color: D.muted, fontSize: '0.72rem', fontWeight: 600,
                        textTransform: 'uppercase', letterSpacing: '0.07em',
                      }}>
                        Phase {phase.id}
                      </Typography>
                      <Typography sx={{
                        color: D.heading, fontWeight: 800, fontSize: '1rem', lineHeight: 1.2,
                      }}>
                        {phase.title}
                      </Typography>
                      <Typography sx={{ color: D.muted, fontSize: '0.8rem', mt: 0.2 }}>
                        {phase.subtitle}
                      </Typography>
                    </Box>

                    {/* Status pill */}
                    <Box sx={{ flexShrink: 0 }}>
                      {state.completed ? (
                        <Box sx={{
                          px: 1.5, py: 0.4, borderRadius: '50px',
                          bgcolor: D.green.bg, border: `2px solid ${D.green.border}`,
                          boxShadow: `2px 2px 0 ${D.green.shadow}`,
                          display: 'flex', alignItems: 'center', gap: 0.5,
                        }}>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: D.green.border }}>
                            ✓ Done
                          </Typography>
                        </Box>
                      ) : state.inProgress ? (
                        <Box sx={{
                          px: 1.5, py: 0.4, borderRadius: '50px',
                          bgcolor: `${phase.color}15`, border: `2px solid ${phase.color}`,
                          boxShadow: `2px 2px 0 ${phase.color}`,
                          display: 'flex', alignItems: 'center', gap: 0.5,
                        }}>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: phase.color }}>
                            ● In Progress
                          </Typography>
                        </Box>
                      ) : !isUnlocked ? (
                        <Box sx={{
                          px: 1.5, py: 0.4, borderRadius: '50px',
                          bgcolor: D.border, border: `2px solid ${D.border}`,
                          boxShadow: `2px 2px 0 ${D.border}`,
                          display: 'flex', alignItems: 'center', gap: 0.5,
                        }}>
                          <LockIcon sx={{ fontSize: 11, color: D.muted }} />
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: D.muted }}>
                            Locked
                          </Typography>
                        </Box>
                      ) : (
                        <Box sx={{
                          px: 1.5, py: 0.4, borderRadius: '50px',
                          bgcolor: `${phase.color}15`, border: `2px solid ${phase.color}`,
                          boxShadow: `2px 2px 0 ${phase.color}`,
                          display: 'flex', alignItems: 'center', gap: 0.5,
                        }}>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: phase.color }}>
                            ▶ Start
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>

                  {/* Expandable panel */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        key="expand"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        style={{ overflow: 'hidden' }}
                      >
                        <Box sx={{
                          borderTop: `2px solid ${D.border}`,
                          px: 3, pt: 2, pb: 3,
                        }}
                          onClick={e => e.stopPropagation()}
                        >
                          <Typography sx={{ color: D.body, fontSize: '0.88rem', lineHeight: 1.6, mb: 2 }}>
                            {phase.description}
                          </Typography>

                          {/* Action button */}
                          {isUnlocked ? (
                            <motion.div whileTap={{ scale: 0.97 }}>
                              <Box
                                onClick={() => navigate(phase.path)}
                                sx={{
                                  width: '100%',
                                  py: 1.5,
                                  borderRadius: '14px',
                                  background: phase.gradient,
                                  color: 'white',
                                  fontWeight: 700,
                                  fontSize: '0.95rem',
                                  textAlign: 'center',
                                  cursor: 'pointer',
                                  border: `2px solid ${phase.color}`,
                                  boxShadow: `4px 4px 0 ${phase.color}`,
                                  transition: 'box-shadow 0.15s, transform 0.15s',
                                  '&:hover': { boxShadow: `6px 6px 0 ${phase.color}` },
                                  '&:active': { boxShadow: `1px 1px 0 ${phase.color}`, transform: 'translate(3px, 3px)' },
                                }}
                              >
                                {state.completed ? 'Review Phase' : state.inProgress ? 'Continue Phase' : 'Start Phase'}
                              </Box>
                            </motion.div>
                          ) : (
                            <Box sx={{
                              width: '100%',
                              py: 1.5,
                              borderRadius: '14px',
                              bgcolor: D.border,
                              border: `2px solid ${D.border}`,
                              color: D.muted,
                              fontWeight: 600,
                              fontSize: '0.9rem',
                              textAlign: 'center',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 1,
                            }}>
                              <LockIcon sx={{ fontSize: 18 }} />
                              Complete previous phase to unlock
                            </Box>
                          )}
                        </Box>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Box>
              </motion.div>
            )
          })}
        </Box>

        {/* Completion footer */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          {allDone ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Box sx={{
                bgcolor: D.yellow.bg,
                border: `2px solid ${D.yellow.border}`,
                boxShadow: `4px 4px 0 ${D.yellow.shadow}`,
                borderRadius: '20px',
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
              }}>
                <EmojiEventsIcon sx={{ fontSize: 36, color: D.yellow.border }} />
                <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: D.heading }}>
                  Journey Complete! 🎉
                </Typography>
                <Typography sx={{ color: D.muted, fontSize: '0.85rem' }}>
                  You've completed all phases of the learning journey.
                </Typography>
              </Box>
            </motion.div>
          ) : (
            <Typography sx={{ color: D.muted, fontSize: '0.82rem' }}>
              Complete all phases to finish your journey
            </Typography>
          )}
        </Box>

      </Box>
    </Box>
  )
}
