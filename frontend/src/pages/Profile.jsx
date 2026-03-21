import React from 'react'
import { Box, Typography, Stack, Button, Avatar, Chip } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import EditIcon from '@mui/icons-material/Edit'
import LockIcon from '@mui/icons-material/Lock'
import SchoolIcon from '@mui/icons-material/School'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import EmailIcon from '@mui/icons-material/Email'
import PersonIcon from '@mui/icons-material/Person'
import BadgeIcon from '@mui/icons-material/Badge'
import AssessmentIcon from '@mui/icons-material/Assessment'
import StarIcon from '@mui/icons-material/Star'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { useAuth } from '../lib/api.jsx'
import { useUserStats } from '../hooks/useUserStats.jsx'
import { useColorMode } from '../theme.jsx'

const LIGHT = {
  pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', border: '#E0E0E0',
  purple: { bg: '#E1BEE7', border: '#8E24AA', shadow: '#8E24AA' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
  yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825' },
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
  orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
  red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#C62828' },
}
const DARK = {
  pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', border: '#2A2A4A',
  purple: { bg: '#1E0A2E', border: '#CE93D8', shadow: '#7B1FA2' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#A06800' },
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
  red:    { bg: '#1F0000', border: '#EF9A9A', shadow: '#B71C1C' },
}

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } })
}

export default function Profile() {
  const { user } = useAuth()
  const { stats } = useUserStats()
  const { mode } = useColorMode()
  const D = mode === 'dark' ? DARK : LIGHT

  const userName = user?.first_name || user?.username || 'User'
  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || userName
  const userLevel = stats?.best_level || stats?.overall_level || null
  const joinDate = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'
  const totalAssessments = stats?.total_assessments || 0
  const avgScore = stats?.average_score ? Math.round(stats.average_score) : null

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: D.pageBg, py: { xs: 3, md: 5 }, px: { xs: 2, md: 4 } }}>
      <Box sx={{ maxWidth: 860, mx: 'auto' }}>

        {/* ── Hero Card ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Box sx={{
            bgcolor: D.cardBg,
            border: `2px solid ${D.purple.border}`,
            borderRadius: '24px',
            boxShadow: `6px 6px 0 ${D.purple.shadow}`,
            overflow: 'hidden',
            mb: 3,
          }}>
            {/* Clay Banner */}
            <Box sx={{
              height: 100,
              bgcolor: D.purple.bg,
              borderBottom: `2px solid ${D.purple.border}`,
              position: 'relative',
            }} />

            <Box sx={{ px: { xs: 2.5, md: 4 }, pb: 3, pt: 0 }}>
              <Avatar sx={{
                width: 80, height: 80, mt: -5,
                bgcolor: D.purple.bg,
                fontSize: '1.8rem', fontWeight: 800,
                border: `3px solid ${D.cardBg}`,
                outline: `2px solid ${D.purple.border}`,
                color: D.purple.border,
              }}>
                {userName[0].toUpperCase()}
              </Avatar>

              <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'flex-end' }} justifyContent="space-between" sx={{ mt: 1.5 }}>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '1.4rem', color: D.heading, lineHeight: 1.2 }}>
                    {fullName}
                  </Typography>
                  <Typography sx={{ color: D.muted, fontSize: '0.85rem', mt: 0.3 }}>
                    @{user?.username}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1.2 }}>
                    {userLevel && (
                      <Chip
                        size="small"
                        icon={<SchoolIcon sx={{ fontSize: 13, color: `${D.purple.border} !important` }} />}
                        label={`CEFR ${userLevel}`}
                        sx={{
                          height: 26, fontSize: '0.72rem', fontWeight: 700,
                          bgcolor: D.purple.bg,
                          color: D.purple.border,
                          border: `2px solid ${D.purple.border}`,
                          borderRadius: '50px',
                          '& .MuiChip-icon': { color: D.purple.border },
                        }}
                      />
                    )}
                    <Chip
                      size="small"
                      icon={<CalendarTodayIcon sx={{ fontSize: 12, color: `${D.body} !important` }} />}
                      label={`Joined ${joinDate}`}
                      sx={{
                        height: 26, fontSize: '0.72rem', fontWeight: 500,
                        bgcolor: D.yellow.bg,
                        color: D.body,
                        border: `2px solid ${D.yellow.border}`,
                        borderRadius: '50px',
                        '& .MuiChip-icon': { color: D.body },
                      }}
                    />
                  </Stack>
                </Box>

                <Stack direction="row" spacing={1.5} sx={{ mt: { xs: 2, sm: 0 } }}>
                  <Button
                    component={RouterLink} to="/profile/edit" size="small"
                    startIcon={<EditIcon sx={{ fontSize: 15 }} />}
                    sx={{
                      px: 2, py: 0.8, fontWeight: 700, fontSize: '0.82rem',
                      bgcolor: D.purple.bg,
                      color: D.purple.border,
                      border: `2px solid ${D.purple.border}`,
                      borderRadius: '12px',
                      boxShadow: `3px 3px 0 ${D.purple.shadow}`,
                      transition: 'all 0.15s',
                      '&:hover': {
                        transform: 'translate(-2px, -2px)',
                        boxShadow: `6px 6px 0 ${D.purple.shadow}`,
                        bgcolor: D.purple.bg,
                      },
                      '&:active': {
                        transform: 'translate(1px, 1px)',
                        boxShadow: `2px 2px 0 ${D.purple.shadow}`,
                      },
                    }}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    component={RouterLink} to="/profile/change-password" size="small"
                    startIcon={<LockIcon sx={{ fontSize: 15 }} />}
                    sx={{
                      px: 2, py: 0.8, fontWeight: 700, fontSize: '0.82rem',
                      bgcolor: D.blue.bg,
                      color: D.blue.border,
                      border: `2px solid ${D.blue.border}`,
                      borderRadius: '12px',
                      boxShadow: `3px 3px 0 ${D.blue.shadow}`,
                      transition: 'all 0.15s',
                      '&:hover': {
                        transform: 'translate(-2px, -2px)',
                        boxShadow: `6px 6px 0 ${D.blue.shadow}`,
                        bgcolor: D.blue.bg,
                      },
                      '&:active': {
                        transform: 'translate(1px, 1px)',
                        boxShadow: `2px 2px 0 ${D.blue.shadow}`,
                      },
                    }}
                  >
                    Password
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Box>
        </motion.div>

        {/* ── Stats Row ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
            {[
              { label: 'CEFR Level',   value: userLevel || '—',          icon: TrendingUpIcon,  color: D.purple },
              { label: 'Assessments',  value: totalAssessments,           icon: AssessmentIcon,  color: D.blue   },
              { label: 'Avg Score',    value: avgScore ? `${avgScore}%` : '—', icon: StarIcon,   color: D.yellow },
            ].map((stat, i) => {
              const Icon = stat.icon
              return (
                <Box key={i} sx={{
                  flex: 1,
                  bgcolor: D.cardBg,
                  border: `2px solid ${stat.color.border}`,
                  borderRadius: '20px',
                  boxShadow: `4px 4px 0 ${stat.color.shadow}`,
                  p: 2.5,
                  display: 'flex', alignItems: 'center', gap: 2,
                  transition: 'all 0.15s',
                  '&:hover': {
                    transform: 'translate(-2px, -2px)',
                    boxShadow: `6px 6px 0 ${stat.color.shadow}`,
                  },
                  '&:active': {
                    transform: 'translate(1px, 1px)',
                    boxShadow: `2px 2px 0 ${stat.color.shadow}`,
                  },
                }}>
                  <Box sx={{
                    width: 44, height: 44,
                    bgcolor: stat.color.bg,
                    border: `2px solid ${stat.color.border}`,
                    borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon sx={{ fontSize: 22, color: stat.color.border }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: D.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {stat.label}
                    </Typography>
                    <Typography sx={{ fontSize: '1.3rem', fontWeight: 800, color: D.heading, lineHeight: 1.2, mt: 0.2 }}>
                      {stat.value}
                    </Typography>
                  </Box>
                </Box>
              )
            })}
          </Stack>
        </motion.div>

        {/* ── Account Info + Quick Actions ── */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2.5} sx={{ mb: 3 }}>

          {/* Account Info */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2} style={{ flex: 1 }}>
            <Box sx={{
              bgcolor: D.cardBg,
              border: `2px solid ${D.border}`,
              borderRadius: '20px',
              boxShadow: `4px 4px 0 ${D.border}`,
              p: 3,
              height: '100%',
            }}>
              <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: D.heading, mb: 2.5, letterSpacing: '-0.01em' }}>
                Account Information
              </Typography>
              <Stack spacing={2.5}>
                {[
                  { icon: EmailIcon,  label: 'Email',    value: user?.email || 'Not provided' },
                  { icon: PersonIcon, label: 'Username', value: user?.username },
                  { icon: BadgeIcon,  label: 'Role',     value: user?.is_admin ? 'Administrator' : 'Student', chip: true, chipColor: user?.is_admin ? D.purple : D.blue },
                ].map((item, i) => {
                  const Icon = item.icon
                  return (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{
                        width: 36, height: 36,
                        bgcolor: D.pageBg,
                        border: `2px solid ${D.border}`,
                        borderRadius: '10px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <Icon sx={{ fontSize: 17, color: D.muted }} />
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontSize: '0.66rem', fontWeight: 700, color: D.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          {item.label}
                        </Typography>
                        {item.chip ? (
                          <Chip size="small" label={item.value} sx={{
                            height: 22, mt: 0.3, fontSize: '0.72rem', fontWeight: 700,
                            bgcolor: item.chipColor.bg,
                            color: item.chipColor.border,
                            border: `2px solid ${item.chipColor.border}`,
                            borderRadius: '50px',
                          }} />
                        ) : (
                          <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: D.body, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.value}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  )
                })}
              </Stack>
            </Box>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3} style={{ flex: 1 }}>
            <Box sx={{
              bgcolor: D.cardBg,
              border: `2px solid ${D.border}`,
              borderRadius: '20px',
              boxShadow: `4px 4px 0 ${D.border}`,
              p: 3,
              height: '100%',
            }}>
              <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: D.heading, mb: 2, letterSpacing: '-0.01em' }}>
                Quick Actions
              </Typography>
              <Stack spacing={0.5}>
                {[
                  { label: 'Edit Profile',      desc: 'Update your name and details',      to: '/profile/edit',            icon: EditIcon,       color: D.purple },
                  { label: 'Change Password',   desc: 'Update your login credentials',     to: '/profile/change-password', icon: LockIcon,       color: D.blue   },
                  { label: 'Learning Journey',  desc: 'View your phase progress map',      to: '/phase-journey',           icon: TrendingUpIcon, color: D.green  },
                ].map((item, i) => {
                  const Icon = item.icon
                  return (
                    <Box
                      key={i}
                      component={RouterLink} to={item.to}
                      sx={{
                        display: 'flex', alignItems: 'center', gap: 1.5,
                        p: 1.4, borderRadius: '12px',
                        textDecoration: 'none',
                        transition: 'all 0.15s',
                        '&:hover': {
                          bgcolor: D.pageBg,
                          '& .arrow': { opacity: 1, transform: 'translateX(0)', color: D.blue.border },
                        },
                      }}
                    >
                      <Box sx={{
                        width: 36, height: 36,
                        bgcolor: item.color.bg,
                        border: `2px solid ${item.color.border}`,
                        borderRadius: '10px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <Icon sx={{ fontSize: 17, color: item.color.border }} />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: D.heading }}>
                          {item.label}
                        </Typography>
                        <Typography sx={{ fontSize: '0.72rem', color: D.muted }}>
                          {item.desc}
                        </Typography>
                      </Box>
                      <ArrowForwardIcon className="arrow" sx={{
                        fontSize: 15, color: D.muted, opacity: 0,
                        transform: 'translateX(-4px)', transition: 'all 0.2s',
                      }} />
                    </Box>
                  )
                })}
              </Stack>
            </Box>
          </motion.div>
        </Stack>

        {/* ── Danger Zone ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
          <Box sx={{
            bgcolor: D.red.bg,
            border: `2px solid ${D.red.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${D.red.shadow}`,
            p: 2.5,
          }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} justifyContent="space-between">
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                <Box sx={{
                  width: 36, height: 36,
                  bgcolor: D.red.bg,
                  border: `2px solid ${D.red.border}`,
                  borderRadius: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <WarningAmberIcon sx={{ fontSize: 18, color: D.red.border }} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: '0.88rem', color: D.red.border }}>
                    Delete Account
                  </Typography>
                  <Typography sx={{ fontSize: '0.78rem', color: D.muted, mt: 0.2 }}>
                    Permanently remove your account and all data. This cannot be undone.
                  </Typography>
                </Box>
              </Box>
              <Button
                component={RouterLink} to="/profile/delete-account" size="small"
                sx={{
                  px: 2.5, py: 0.8, fontWeight: 700, fontSize: '0.8rem',
                  bgcolor: D.red.bg,
                  color: D.red.border,
                  border: `2px solid ${D.red.border}`,
                  borderRadius: '12px',
                  boxShadow: `3px 3px 0 ${D.red.shadow}`,
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    transform: 'translate(-2px, -2px)',
                    boxShadow: `6px 6px 0 ${D.red.shadow}`,
                    bgcolor: D.red.bg,
                  },
                  '&:active': {
                    transform: 'translate(1px, 1px)',
                    boxShadow: `2px 2px 0 ${D.red.shadow}`,
                  },
                }}
              >
                Delete Account
              </Button>
            </Stack>
          </Box>
        </motion.div>

      </Box>
    </Box>
  )
}
