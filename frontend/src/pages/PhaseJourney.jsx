import React, { useEffect, useState, useMemo } from 'react'
import { Box, Typography, LinearProgress, Chip, useMediaQuery, useTheme } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LockIcon from '@mui/icons-material/Lock'
import SchoolIcon from '@mui/icons-material/School'
import GroupIcon from '@mui/icons-material/Group'
import CampaignIcon from '@mui/icons-material/Campaign'
import BuildIcon from '@mui/icons-material/Build'
import StarIcon from '@mui/icons-material/Star'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'

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
  }
]

const NODE_OFFSETS = [-1, 1, -1, 1]

export default function PhaseJourney() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeNode, setActiveNode] = useState(null)

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
    const hasCompletedPhase4 = isComplete(4)
    const hasCompletedPhase5 = isComplete(5)

    const hasPhase2Progress = phase2_progress?.responses?.length > 0 || phase2_progress?.steps?.length > 0
    const p5Sub1Steps = Object.keys(phase5_progress?.subphase1 || {}).length
    const p5Sub2Steps = Object.keys(phase5_progress?.subphase2 || {}).length
    const hasPhase5Progress = (p5Sub1Steps + p5Sub2Steps) > 0

    return {
      1: { completed: hasCompletedPhase1, unlocked: true, inProgress: !hasCompletedPhase1 && totalAssessments === 0 ? false : !hasCompletedPhase1 },
      2: { completed: hasCompletedPhase2, unlocked: hasCompletedPhase1, inProgress: hasCompletedPhase1 && !hasCompletedPhase2 && hasPhase2Progress },
      4: { completed: hasCompletedPhase4, unlocked: hasCompletedPhase2, inProgress: hasCompletedPhase2 && !hasCompletedPhase4 },
      5: { completed: hasCompletedPhase5, unlocked: hasCompletedPhase4, inProgress: hasCompletedPhase4 && !hasCompletedPhase5 && hasPhase5Progress }
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

  const isDark = theme.palette.mode === 'dark'
  const bg = isDark ? '#0f172a' : 'white'
  const cardBg = isDark ? '#1e293b' : 'white'
  const border = isDark ? '#334155' : '#e2e8f0'
  const textPrimary = isDark ? '#f1f5f9' : '#0f172a'
  const textSecondary = isDark ? '#94a3b8' : '#64748b'
  const textMuted = isDark ? '#64748b' : '#94a3b8'
  const lockedNodeBg = isDark ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' : 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)'
  const lockedBorder = isDark ? '#475569' : '#f1f5f9'
  const progressTrack = isDark ? '#1e293b' : '#f1f5f9'

  const completedCount = PHASES.filter(p => phaseStates[p.id]?.completed).length

  if (loading) return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: bg }}>
      <Box sx={{ width: 200 }}>
        <LinearProgress sx={{ borderRadius: 4, height: 4, bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #6366f1, #0ea5e9)' } }} />
      </Box>
    </Box>
  )

  const nodeSize = isMobile ? 68 : 80
  const rowHeight = isMobile ? 170 : 190
  const xShift = isMobile ? 55 : 80

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: bg,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle background decoration */}
      <Box sx={{
        position: 'absolute', top: -200, right: -200,
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, #6366f106 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <Box sx={{
        position: 'absolute', bottom: -100, left: -100,
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, #0ea5e906 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <Box sx={{
        px: { xs: 2.5, md: 4 },
        pt: { xs: 3, md: 4 },
        pb: 1,
        maxWidth: 600,
        mx: 'auto',
      }}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.4rem', md: '1.6rem' }, color: textPrimary, lineHeight: 1.2 }}>
                Learning Journey
              </Typography>
              <Typography sx={{ color: textMuted, fontSize: '0.88rem', mt: 0.5 }}>
                Track your progress through all phases
              </Typography>
            </Box>
            <Chip
              icon={<StarIcon sx={{ fontSize: 14, color: '#f59e0b !important' }} />}
              label={`${completedCount}/${PHASES.length}`}
              sx={{
                height: 30, fontWeight: 700, fontSize: '0.82rem',
                bgcolor: isDark ? '#451a0320' : '#fef3c710', color: isDark ? '#fbbf24' : '#92400e',
                border: '1px solid #fde68a40',
              }}
            />
          </Box>

          {/* Progress bar */}
          <Box sx={{ mt: 2, mb: 1 }}>
            <Box sx={{
              height: 6, borderRadius: 3, bgcolor: progressTrack,
              overflow: 'hidden',
            }}>
              <motion.div
                style={{
                  height: '100%',
                  borderRadius: 3,
                  background: 'linear-gradient(90deg, #6366f1, #0ea5e9, #f97316, #ef4444)',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${(completedCount / PHASES.length) * 100}%` }}
                transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
              />
            </Box>
          </Box>
        </motion.div>
      </Box>

      {/* Journey path container */}
      <Box sx={{
        position: 'relative',
        maxWidth: 500,
        mx: 'auto',
        px: 3,
        pt: 3,
        pb: 16,
      }}>
        {/* Connecting path lines between nodes */}
        <svg
          viewBox={`0 0 200 ${PHASES.length * 100 + 20}`}
          preserveAspectRatio="xMidYMid meet"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: PHASES.length * rowHeight + 40,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          <defs>
            <linearGradient id="lineGradLight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="33%" stopColor="#0ea5e9" />
              <stop offset="66%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
          {PHASES.map((_, i) => {
            if (i === PHASES.length - 1) return null
            const svgShift = 36
            const fromX = 100 + NODE_OFFSETS[i] * svgShift
            const fromY = i * 100 + 28
            const toX = 100 + NODE_OFFSETS[i + 1] * svgShift
            const toY = (i + 1) * 100 + 28

            const midY = (fromY + toY) / 2
            const nextState = phaseStates[PHASES[i + 1].id] || {}
            const isReached = nextState.unlocked || nextState.completed

            return (
              <g key={`line-${i}`}>
                <path
                  d={`M ${fromX} ${fromY} C ${fromX} ${midY}, ${toX} ${midY}, ${toX} ${toY}`}
                  fill="none"
                  stroke={border}
                  strokeWidth="2"
                  strokeDasharray="6 6"
                />
                {isReached && (
                  <motion.path
                    d={`M ${fromX} ${fromY} C ${fromX} ${midY}, ${toX} ${midY}, ${toX} ${toY}`}
                    fill="none"
                    stroke="url(#lineGradLight)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: i * 0.4 + 0.5, ease: 'easeOut' }}
                  />
                )}
              </g>
            )
          })}
        </svg>

        {/* Phase nodes */}
        {PHASES.map((phase, index) => {
          const state = phaseStates[phase.id] || {}
          const isActive = currentPhaseIndex === index
          const IconComp = phase.icon
          const xOffset = NODE_OFFSETS[index]

          return (
            <motion.div
              key={phase.id}
              style={{
                position: 'relative',
                height: rowHeight,
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                zIndex: 5,
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 + 0.2, duration: 0.5 }}
            >
              <Box
                onClick={() => {
                  if (!state.unlocked) return
                  if (activeNode === index) {
                    navigate(phase.path)
                  } else {
                    setActiveNode(index)
                  }
                }}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: state.unlocked ? 'pointer' : 'default',
                  transform: `translateX(${xOffset * xShift}px)`,
                  position: 'relative',
                }}
              >
                {/* Character hovering above active node */}
                {isActive && (
                  <motion.div
                    style={{
                      position: 'absolute',
                      top: -44,
                      zIndex: 20,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Box sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                      border: `3px solid ${isDark ? '#334155' : 'white'}`,
                      boxShadow: '0 4px 16px rgba(251,191,36,0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.1rem',
                    }}>
                      🧑‍🎓
                    </Box>
                    <Box sx={{
                      width: 0, height: 0,
                      borderLeft: '5px solid transparent',
                      borderRight: '5px solid transparent',
                      borderTop: `6px solid ${isDark ? '#334155' : 'white'}`,
                      mt: '-1px',
                    }} />
                  </motion.div>
                )}

                {/* Pulse ring */}
                {isActive && (
                  <motion.div
                    style={{
                      position: 'absolute',
                      top: nodeSize * -0.15,
                      width: nodeSize * 1.3,
                      height: nodeSize * 1.3,
                      borderRadius: '50%',
                      border: `2px solid ${phase.color}40`,
                      zIndex: -1,
                    }}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  />
                )}

                {/* Main node circle */}
                <motion.div
                  style={{
                    width: nodeSize,
                    height: nodeSize,
                    borderRadius: '50%',
                    background: state.unlocked ? phase.gradient : lockedNodeBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: state.unlocked
                      ? `0 4px 20px ${phase.color}25, 0 8px 25px rgba(0,0,0,0.08)`
                      : '0 2px 8px rgba(0,0,0,0.06)',
                    border: state.completed
                      ? '4px solid #22c55e'
                      : isActive
                      ? `4px solid ${phase.color}`
                      : state.unlocked
                      ? `4px solid ${isDark ? '#334155' : 'white'}`
                      : `4px solid ${lockedBorder}`,
                    position: 'relative',
                    flexShrink: 0,
                  }}
                  whileHover={state.unlocked ? { scale: 1.08 } : {}}
                  whileTap={state.unlocked ? { scale: 0.95 } : {}}
                >
                  {state.completed ? (
                    <CheckCircleIcon sx={{ fontSize: nodeSize * 0.45, color: 'white' }} />
                  ) : !state.unlocked ? (
                    <LockIcon sx={{ fontSize: nodeSize * 0.38, color: '#94a3b8' }} />
                  ) : isActive ? (
                    <PlayArrowIcon sx={{ fontSize: nodeSize * 0.45, color: 'white' }} />
                  ) : (
                    <IconComp sx={{ fontSize: nodeSize * 0.4, color: 'white' }} />
                  )}

                  {/* Star badge for completed */}
                  {state.completed && (
                    <motion.div
                      style={{
                        position: 'absolute',
                        top: -2,
                        right: -2,
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: '#22c55e',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `2px solid ${isDark ? '#0f172a' : 'white'}`,
                      }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.2 + 0.6, type: 'spring' }}
                    >
                      <StarIcon sx={{ fontSize: 13, color: '#ffd740' }} />
                    </motion.div>
                  )}
                </motion.div>

                {/* Phase label */}
                <Box sx={{ textAlign: 'center', mt: 1.5, maxWidth: 130 }}>
                  <Typography sx={{
                    color: state.unlocked ? textPrimary : (isDark ? '#475569' : '#cbd5e1'),
                    fontWeight: 700,
                    fontSize: isMobile ? '0.8rem' : '0.88rem',
                    lineHeight: 1.2,
                  }}>
                    {phase.title}
                  </Typography>
                  <Typography sx={{
                    color: state.unlocked ? textMuted : (isDark ? '#374151' : '#e2e8f0'),
                    fontSize: '0.72rem',
                    mt: 0.3,
                    fontWeight: 500,
                  }}>
                    Phase {phase.id}
                  </Typography>
                  {state.completed && (
                    <Chip
                      size="small"
                      label="Done"
                      sx={{
                        mt: 0.5,
                        height: 20,
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        bgcolor: isDark ? '#14532d' : '#f0fdf4',
                        color: isDark ? '#4ade80' : '#16a34a',
                        border: isDark ? '1px solid #166534' : '1px solid #bbf7d0',
                      }}
                    />
                  )}
                  {state.inProgress && !state.completed && (
                    <Chip
                      size="small"
                      label="In Progress"
                      sx={{
                        mt: 0.5,
                        height: 20,
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        bgcolor: `${phase.color}08`,
                        color: phase.color,
                        border: `1px solid ${phase.color}20`,
                      }}
                    />
                  )}
                </Box>
              </Box>
            </motion.div>
          )
        })}

        {/* Finish flag at the bottom */}
        <motion.div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: 10,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <Box sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: PHASES.every(p => phaseStates[p.id]?.completed)
              ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
              : (isDark ? '#1e293b' : '#f8fafc'),
            border: PHASES.every(p => phaseStates[p.id]?.completed)
              ? '3px solid #fde68a'
              : `3px solid ${border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: PHASES.every(p => phaseStates[p.id]?.completed)
              ? '0 4px 16px rgba(251,191,36,0.3)'
              : 'none',
          }}>
            <EmojiEventsIcon sx={{
              fontSize: 22,
              color: PHASES.every(p => phaseStates[p.id]?.completed) ? 'white' : (isDark ? '#475569' : '#cbd5e1'),
            }} />
          </Box>
          <Typography sx={{
            color: PHASES.every(p => phaseStates[p.id]?.completed) ? (isDark ? '#fbbf24' : '#92400e') : (isDark ? '#475569' : '#cbd5e1'),
            fontSize: '0.75rem', mt: 1, fontWeight: 600,
          }}>
            Journey Complete
          </Typography>
        </motion.div>
      </Box>

      {/* Bottom detail card */}
      <AnimatePresence>
        {activeNode !== null && (
          <>
            {/* Backdrop */}
            <motion.div
              style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                zIndex: 40,
                background: 'rgba(15,23,42,0.3)',
                backdropFilter: 'blur(4px)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveNode(null)}
            />
            {/* Card */}
            <motion.div
              key={`card-${activeNode}`}
              style={{
                position: 'fixed',
                bottom: 0, left: 0, right: 0,
                zIndex: 50,
              }}
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 300 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            >
              {(() => {
                const phase = PHASES[activeNode]
                const state = phaseStates[phase.id] || {}
                const IconComp = phase.icon
                return (
                  <Box sx={{
                    background: cardBg,
                    borderTop: `3px solid ${phase.color}`,
                    borderRadius: '20px 20px 0 0',
                    p: 3, pb: 4,
                    boxShadow: '0 -8px 40px rgba(0,0,0,0.1)',
                  }}>
                    {/* Drag handle */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                      <Box sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: border }} />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                      <Box sx={{
                        width: 56, height: 56,
                        borderRadius: 3,
                        background: phase.gradient,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: `0 4px 16px ${phase.color}30`,
                      }}>
                        <IconComp sx={{ fontSize: 26, color: 'white' }} />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ color: textMuted, fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                          Phase {phase.id} · {phase.subtitle}
                        </Typography>
                        <Typography sx={{ color: textPrimary, fontWeight: 750, fontSize: '1.15rem', mt: 0.3 }}>
                          {phase.title}
                        </Typography>
                        <Typography sx={{ color: textSecondary, fontSize: '0.85rem', mt: 0.5 }}>
                          {phase.description}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Action button */}
                    <Box sx={{ mt: 3 }}>
                      {state.unlocked ? (
                        <motion.div whileTap={{ scale: 0.97 }}>
                          <Box
                            onClick={() => navigate(phase.path)}
                            sx={{
                              py: 1.6,
                              borderRadius: 3,
                              background: phase.gradient,
                              color: 'white',
                              fontWeight: 700,
                              fontSize: '0.95rem',
                              textAlign: 'center',
                              cursor: 'pointer',
                              boxShadow: `0 4px 16px ${phase.color}30`,
                              transition: 'box-shadow 0.2s',
                              '&:hover': { boxShadow: `0 6px 24px ${phase.color}40` },
                            }}
                          >
                            {state.completed ? 'Review Phase' : state.inProgress ? 'Continue Phase' : 'Start Phase'}
                          </Box>
                        </motion.div>
                      ) : (
                        <Box sx={{
                          py: 1.6,
                          borderRadius: 3,
                          bgcolor: isDark ? '#1e293b' : '#f8fafc',
                          color: isDark ? '#475569' : '#94a3b8',
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          textAlign: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 1,
                          border: `1px solid ${border}`,
                        }}>
                          <LockIcon sx={{ fontSize: 18 }} />
                          Complete previous phase to unlock
                        </Box>
                      )}
                    </Box>
                  </Box>
                )
              })()}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Box>
  )
}
