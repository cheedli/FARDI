import React from 'react'
import { Box, Typography, Stack, Button, Avatar, Chip, Divider, useTheme } from '@mui/material'
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

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } })
}

export default function Profile() {
  const { user } = useAuth()
  const { stats } = useUserStats()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const userName = user?.first_name || user?.username || 'User'
  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || userName
  const userLevel = stats?.best_level || stats?.overall_level || null
  const joinDate = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'
  const totalAssessments = stats?.total_assessments || 0
  const avgScore = stats?.average_score ? Math.round(stats.average_score) : null

  const border = isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #f1f5f9'
  const cardBg = isDark ? theme.palette.background.paper : '#ffffff'
  const muted = theme.palette.text.secondary
  const iconBg = isDark ? 'rgba(255,255,255,0.06)' : '#f8fafc'

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: { xs: 3, md: 5 }, px: { xs: 2, md: 4 } }}>
      <Box sx={{ maxWidth: 860, mx: 'auto' }}>

        {/* ── Hero Card ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Box sx={{ border, borderRadius: 2, overflow: 'hidden', mb: 3, bgcolor: cardBg }}>
            {/* Banner */}
            <Box sx={{
              height: 110,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)',
              position: 'relative',
            }}>
              <Box sx={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(circle at 70% 20%, rgba(255,255,255,0.12) 0%, transparent 60%)',
              }} />
            </Box>

            <Box sx={{ px: { xs: 2.5, md: 4 }, pb: 3, pt: 0 }}>
              <Avatar sx={{
                width: 80, height: 80, mt: -5,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                fontSize: '1.8rem', fontWeight: 800,
                border: `4px solid ${cardBg}`,
                boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
              }}>
                {userName[0].toUpperCase()}
              </Avatar>

              <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'flex-end' }} justifyContent="space-between" sx={{ mt: 1.5 }}>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '1.4rem', color: 'text.primary', lineHeight: 1.2 }}>
                    {fullName}
                  </Typography>
                  <Typography sx={{ color: muted, fontSize: '0.85rem', mt: 0.3 }}>
                    @{user?.username}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1.2 }}>
                    {userLevel && (
                      <Chip size="small" icon={<SchoolIcon sx={{ fontSize: 13 }} />} label={`CEFR ${userLevel}`} sx={{
                        height: 24, fontSize: '0.72rem', fontWeight: 700,
                        bgcolor: isDark ? 'rgba(99,102,241,0.2)' : '#6366f110',
                        color: '#6366f1', border: '1px solid #6366f125',
                        '& .MuiChip-icon': { color: '#6366f1' },
                      }} />
                    )}
                    <Chip size="small" icon={<CalendarTodayIcon sx={{ fontSize: 12 }} />} label={`Joined ${joinDate}`} sx={{
                      height: 24, fontSize: '0.72rem', fontWeight: 500,
                      bgcolor: isDark ? 'rgba(255,255,255,0.07)' : '#f8fafc',
                      color: muted,
                      border,
                      '& .MuiChip-icon': { color: muted },
                    }} />
                  </Stack>
                </Box>

                <Stack direction="row" spacing={1.5} sx={{ mt: { xs: 2, sm: 0 } }}>
                  <Button
                    component={RouterLink} to="/profile/edit" size="small"
                    startIcon={<EditIcon sx={{ fontSize: 15 }} />}
                    sx={{
                      px: 2, py: 0.7, fontWeight: 600, fontSize: '0.82rem',
                      background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                      color: 'white', boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
                      '&:hover': { background: 'linear-gradient(135deg, #5856eb, #4338ca)' },
                    }}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    component={RouterLink} to="/profile/change-password" size="small"
                    startIcon={<LockIcon sx={{ fontSize: 15 }} />}
                    sx={{
                      px: 2, py: 0.7, fontWeight: 600, fontSize: '0.82rem',
                      bgcolor: isDark ? 'rgba(255,255,255,0.07)' : '#f8fafc',
                      color: 'text.primary',
                      border,
                      boxShadow: 'none',
                      '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.1)' : '#f1f5f9', boxShadow: 'none' },
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
              { label: 'CEFR Level', value: userLevel || '—', icon: TrendingUpIcon, color: '#6366f1' },
              { label: 'Assessments', value: totalAssessments, icon: AssessmentIcon, color: '#0ea5e9' },
              { label: 'Avg Score', value: avgScore ? `${avgScore}%` : '—', icon: StarIcon, color: '#f59e0b' },
            ].map((stat, i) => {
              const Icon = stat.icon
              return (
                <Box key={i} sx={{
                  flex: 1, borderRadius: 1.5, p: 2.5,
                  border,
                  bgcolor: cardBg,
                  display: 'flex', alignItems: 'center', gap: 2,
                  transition: 'border-color 0.2s',
                  '&:hover': { borderColor: stat.color + '50' },
                }}>
                  <Box sx={{
                    width: 40, height: 40, borderRadius: 1.5,
                    bgcolor: stat.color + (isDark ? '22' : '10'),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon sx={{ fontSize: 20, color: stat.color }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.68rem', fontWeight: 600, color: muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {stat.label}
                    </Typography>
                    <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: 'text.primary', lineHeight: 1.2, mt: 0.2 }}>
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
            <Box sx={{ borderRadius: 1.5, border, p: 3, height: '100%', bgcolor: cardBg }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', color: 'text.primary', mb: 2.5 }}>
                Account Information
              </Typography>
              <Stack spacing={2.5}>
                {[
                  { icon: EmailIcon, label: 'Email', value: user?.email || 'Not provided' },
                  { icon: PersonIcon, label: 'Username', value: user?.username },
                  { icon: BadgeIcon, label: 'Role', value: user?.is_admin ? 'Administrator' : 'Student', chip: true, chipColor: user?.is_admin ? '#8b5cf6' : '#0ea5e9' },
                ].map((item, i) => {
                  const Icon = item.icon
                  return (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{
                        width: 34, height: 34, borderRadius: 1,
                        bgcolor: iconBg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <Icon sx={{ fontSize: 17, color: muted }} />
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontSize: '0.66rem', fontWeight: 600, color: muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          {item.label}
                        </Typography>
                        {item.chip ? (
                          <Chip size="small" label={item.value} sx={{
                            height: 20, mt: 0.3, fontSize: '0.72rem', fontWeight: 600,
                            bgcolor: `${item.chipColor}${isDark ? '22' : '12'}`,
                            color: item.chipColor,
                            border: `1px solid ${item.chipColor}25`,
                          }} />
                        ) : (
                          <Typography sx={{ fontSize: '0.88rem', fontWeight: 500, color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
            <Box sx={{ borderRadius: 1.5, border, p: 3, height: '100%', bgcolor: cardBg }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', color: 'text.primary', mb: 2 }}>
                Quick Actions
              </Typography>
              <Stack spacing={0.5}>
                {[
                  { label: 'Edit Profile', desc: 'Update your name and details', to: '/profile/edit', icon: EditIcon, color: '#6366f1' },
                  { label: 'Change Password', desc: 'Update your login credentials', to: '/profile/change-password', icon: LockIcon, color: '#0ea5e9' },
                  { label: 'Learning Journey', desc: 'View your phase progress map', to: '/phase-journey', icon: TrendingUpIcon, color: '#10b981' },
                ].map((item, i) => {
                  const Icon = item.icon
                  return (
                    <Box
                      key={i}
                      component={RouterLink} to={item.to}
                      sx={{
                        display: 'flex', alignItems: 'center', gap: 1.5,
                        p: 1.4, borderRadius: 1,
                        textDecoration: 'none',
                        transition: 'all 0.15s',
                        '&:hover': {
                          bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc',
                          '& .arrow': { opacity: 1, transform: 'translateX(0)' },
                        },
                      }}
                    >
                      <Box sx={{
                        width: 34, height: 34, borderRadius: 1,
                        bgcolor: item.color + (isDark ? '20' : '10'),
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <Icon sx={{ fontSize: 17, color: item.color }} />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: 'text.primary' }}>
                          {item.label}
                        </Typography>
                        <Typography sx={{ fontSize: '0.72rem', color: muted }}>
                          {item.desc}
                        </Typography>
                      </Box>
                      <ArrowForwardIcon className="arrow" sx={{
                        fontSize: 15, color: muted, opacity: 0,
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
            borderRadius: 1.5, p: 2.5,
            border: isDark ? '1px solid rgba(239,68,68,0.25)' : '1px solid #fecaca',
            bgcolor: isDark ? 'rgba(239,68,68,0.06)' : '#fef2f210',
          }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} justifyContent="space-between">
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                <Box sx={{
                  width: 34, height: 34, borderRadius: 1,
                  bgcolor: isDark ? 'rgba(239,68,68,0.15)' : '#fef2f2',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <WarningAmberIcon sx={{ fontSize: 17, color: '#ef4444' }} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#ef4444' }}>
                    Delete Account
                  </Typography>
                  <Typography sx={{ fontSize: '0.78rem', color: muted, mt: 0.2 }}>
                    Permanently remove your account and all data. This cannot be undone.
                  </Typography>
                </Box>
              </Box>
              <Button
                component={RouterLink} to="/profile/delete-account" size="small"
                sx={{
                  px: 2, py: 0.7, fontWeight: 600, fontSize: '0.8rem',
                  color: '#ef4444',
                  border: isDark ? '1px solid rgba(239,68,68,0.3)' : '1px solid #fecaca',
                  bgcolor: 'transparent', boxShadow: 'none',
                  '&:hover': { bgcolor: isDark ? 'rgba(239,68,68,0.1)' : '#fef2f2', boxShadow: 'none' },
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
