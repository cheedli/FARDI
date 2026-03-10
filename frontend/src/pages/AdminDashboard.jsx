import React, { useEffect, useState } from 'react'
import {
  Box, Typography, Stack, Grid, Card, CardContent, LinearProgress,
  Alert, Button, IconButton, Avatar, Chip, Paper, useTheme
} from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
  ArcElement, LineElement, PointElement, Filler
} from 'chart.js'
import { Doughnut, Line } from 'react-chartjs-2'
import PeopleIcon from '@mui/icons-material/People'
import RefreshIcon from '@mui/icons-material/Refresh'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import BarChartIcon from '@mui/icons-material/BarChart'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import VisibilityIcon from '@mui/icons-material/Visibility'

ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
  ArcElement, LineElement, PointElement, Filler
)

const PHASE_COLORS = ['#6366f1', '#0ea5e9', '#10b981', '#f97316', '#ef4444', '#8b5cf6']
const PHASE_NAMES = ['Foundation', 'Cultural Planning', 'Vendors & Budget', 'Marketing', 'Execution', 'Reflection']

export default function AdminDashboard() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const [analytics, setAnalytics] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const [usersRes, analyticsRes] = await Promise.all([
        fetch('/api/admin/users', { credentials: 'include' }),
        fetch('/api/admin/analytics', { credentials: 'include' })
      ])
      if (!usersRes.ok || !analyticsRes.ok) throw new Error('Failed to load admin data')
      const [usersData, analyticsData] = await Promise.all([usersRes.json(), analyticsRes.json()])
      setUsers(usersData.success ? usersData.data.users || [] : [])
      setAnalytics(analyticsData.success ? analyticsData.data : null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  if (loading) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Typography sx={{ fontSize: '1rem', color: 'text.secondary', mb: 2 }}>Loading dashboard...</Typography>
        <LinearProgress sx={{ borderRadius: 2 }} />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button onClick={loadData} startIcon={<RefreshIcon />}>Retry</Button>
      </Box>
    )
  }

  if (!analytics) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Typography color="text.secondary">No analytics data available</Typography>
      </Box>
    )
  }

  const { learning_progress, engagement, quality, risk, system } = analytics
  const totalStudents = users.filter(u => !u.is_admin).length

  const cardBorder = isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #f1f5f9'
  const cardBg = isDark ? theme.palette.background.paper : '#ffffff'
  const textMuted = isDark ? theme.palette.text.secondary : '#94a3b8'
  const textPrimary = theme.palette.text.primary
  const textSubtle = isDark ? theme.palette.text.secondary : '#475569'
  const trackBg = isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9'

  const activityData = {
    labels: (engagement.daily_activity || []).slice().reverse().slice(-14).map(d =>
      new Date(d.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })
    ),
    datasets: [{
      data: (engagement.daily_activity || []).slice().reverse().slice(-14).map(d => d.active_users),
      borderColor: '#6366f1',
      backgroundColor: isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)',
      tension: 0.4,
      fill: true,
      pointRadius: 0,
      borderWidth: 2,
    }]
  }

  const cefrData = {
    labels: (learning_progress.cefr_distribution || []).map(d => d.level),
    datasets: [{
      data: (learning_progress.cefr_distribution || []).map(d => d.count),
      backgroundColor: ['#6366f1', '#0ea5e9', '#10b981', '#f97316', '#ef4444', '#8b5cf6'],
      borderWidth: 0,
      hoverOffset: 4,
    }]
  }

  const chartTextColor = isDark ? theme.palette.text.secondary : '#64748b'

  const miniChartOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        titleColor: isDark ? '#f1f5f9' : '#0f172a',
        bodyColor: isDark ? '#cbd5e1' : '#64748b',
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
        borderWidth: 1,
      }
    },
    scales: {
      x: { display: false },
      y: { display: false, beginAtZero: true },
    },
  }

  const doughnutOpts = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        titleColor: isDark ? '#f1f5f9' : '#0f172a',
        bodyColor: isDark ? '#cbd5e1' : '#64748b',
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
        borderWidth: 1,
      },
    },
  }

  const phaseKeys = ['phase1_completed', 'phase2_completed', 'phase3_completed', 'phase4_completed', 'phase5_completed', 'phase6_completed']

  const cardSx = {
    border: cardBorder,
    borderRadius: 3,
    boxShadow: 'none',
    bgcolor: cardBg,
    backgroundImage: 'none',
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography sx={{ fontSize: '1.6rem', fontWeight: 700, color: textPrimary, lineHeight: 1.2 }}>
            Dashboard
          </Typography>
          <Typography sx={{ fontSize: '0.88rem', color: textMuted, mt: 0.3 }}>
            Overview of your learning platform
          </Typography>
        </Box>
        <IconButton onClick={loadData} sx={{ color: textMuted, '&:hover': { color: '#6366f1' } }}>
          <RefreshIcon />
        </IconButton>
      </Stack>

      {/* KPI Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {[
          { label: 'Total Students', value: totalStudents, icon: <PeopleIcon />, color: '#6366f1', bg: '#6366f1' },
          { label: 'Active (7d)', value: engagement.active_users_7d, icon: <TrendingUpIcon />, color: '#10b981', bg: '#10b981' },
          { label: 'At Risk', value: risk.at_risk_students.length, icon: <WarningAmberIcon />, color: risk.at_risk_students.length > 0 ? '#ef4444' : '#10b981', bg: risk.at_risk_students.length > 0 ? '#ef4444' : '#10b981' },
          { label: 'Assessments', value: quality.ai_detection.total_assessments || 0, icon: <CheckCircleOutlineIcon />, color: '#0ea5e9', bg: '#0ea5e9' },
        ].map(({ label, value, icon, color, bg }) => (
          <Grid item xs={6} md={3} key={label}>
            <Card sx={{ ...cardSx, '&:hover': { borderColor: color + '40', boxShadow: `0 2px 12px ${color}20` }, transition: 'all 0.2s' }}>
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box sx={{
                    width: 40, height: 40, borderRadius: 1, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    bgcolor: bg + (isDark ? '25' : '12'),
                  }}>
                    {React.cloneElement(icon, { sx: { fontSize: 20, color } })}
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '1.4rem', fontWeight: 700, color: textPrimary, lineHeight: 1 }}>
                      {value}
                    </Typography>
                    <Typography sx={{ fontSize: '0.72rem', color: textMuted, fontWeight: 500, mt: 0.2 }}>
                      {label}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {/* Activity Trend */}
        <Grid item xs={12} md={8}>
          <Card sx={{ ...cardSx, height: '100%' }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography sx={{ fontSize: '0.92rem', fontWeight: 600, color: textPrimary }}>
                  Activity Trend
                </Typography>
                <Chip label="Last 14 days" size="small" sx={{
                  fontSize: '0.68rem', fontWeight: 600,
                  bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
                  color: textMuted,
                }} />
              </Stack>
              <Box sx={{ height: 200 }}>
                {(engagement.daily_activity || []).length > 0 ? (
                  <Line data={activityData} options={miniChartOpts} />
                ) : (
                  <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography sx={{ color: textMuted, fontSize: '0.85rem' }}>No activity data</Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* CEFR Distribution */}
        <Grid item xs={12} md={4}>
          <Card sx={{ ...cardSx, height: '100%' }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Typography sx={{ fontSize: '0.92rem', fontWeight: 600, color: textPrimary, mb: 2 }}>
                CEFR Distribution
              </Typography>
              <Box sx={{ height: 160, display: 'flex', justifyContent: 'center' }}>
                {(learning_progress.cefr_distribution || []).length > 0 ? (
                  <Doughnut data={cefrData} options={doughnutOpts} />
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ color: textMuted, fontSize: '0.85rem' }}>No data</Typography>
                  </Box>
                )}
              </Box>
              {(learning_progress.cefr_distribution || []).length > 0 && (
                <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1.5, justifyContent: 'center' }}>
                  {learning_progress.cefr_distribution.map((d, i) => (
                    <Chip
                      key={d.level}
                      label={`${d.level}: ${d.count}`}
                      size="small"
                      sx={{
                        fontSize: '0.68rem', fontWeight: 600, height: 22,
                        bgcolor: PHASE_COLORS[i] + (isDark ? '25' : '15'),
                        color: PHASE_COLORS[i],
                      }}
                    />
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Phase Completion Funnel */}
      <Card sx={{ ...cardSx, mb: 4 }}>
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
            <Typography sx={{ fontSize: '0.92rem', fontWeight: 600, color: textPrimary }}>
              Phase Completion Funnel
            </Typography>
            <Button
              component={RouterLink} to="/admin/analytics"
              endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
              sx={{ fontSize: '0.78rem', textTransform: 'none', color: '#6366f1', fontWeight: 600 }}
            >
              View Details
            </Button>
          </Stack>
          <Grid container spacing={1.5}>
            {phaseKeys.map((key, i) => {
              const total = learning_progress.phase_completion.total_users || 1
              const value = learning_progress.phase_completion[key] || 0
              const pct = Math.round((value / total) * 100)
              return (
                <Grid item xs={6} sm={4} md={2} key={key}>
                  <Box sx={{
                    textAlign: 'center', p: 1.5, borderRadius: 1,
                    border: cardBorder,
                    '&:hover': { borderColor: PHASE_COLORS[i] + '50' },
                    transition: 'all 0.2s',
                  }}>
                    <Box sx={{
                      width: 40, height: 40, borderRadius: '50%', mx: 'auto', mb: 1,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      bgcolor: PHASE_COLORS[i] + (isDark ? '25' : '15'),
                      border: `2px solid ${PHASE_COLORS[i]}30`,
                    }}>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: PHASE_COLORS[i] }}>
                        {value}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: textSubtle, lineHeight: 1.2 }}>
                      Phase {i + 1}
                    </Typography>
                    <Typography sx={{ fontSize: '0.62rem', color: textMuted, mt: 0.2 }}>
                      {PHASE_NAMES[i]}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={pct}
                      sx={{
                        mt: 1, height: 4, borderRadius: 2, bgcolor: trackBg,
                        '& .MuiLinearProgress-bar': { bgcolor: PHASE_COLORS[i], borderRadius: 2 },
                      }}
                    />
                    <Typography sx={{ fontSize: '0.62rem', color: textMuted, mt: 0.4 }}>
                      {pct}%
                    </Typography>
                  </Box>
                </Grid>
              )
            })}
          </Grid>
        </CardContent>
      </Card>

      {/* Bottom Row: Quick Actions + Alerts */}
      <Grid container spacing={2.5}>
        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card sx={{ ...cardSx, height: '100%' }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Typography sx={{ fontSize: '0.92rem', fontWeight: 600, color: textPrimary, mb: 2 }}>
                Quick Actions
              </Typography>
              <Stack spacing={1.5}>
                {[
                  { label: 'View All Students', desc: `${totalStudents} registered`, to: '/admin/users', icon: <PeopleIcon />, color: '#10b981' },
                  { label: 'Full Analytics', desc: 'Charts & reports', to: '/admin/analytics', icon: <BarChartIcon />, color: '#0ea5e9' },
                  { label: 'Messages', desc: 'Chat with students', to: '/admin/chat', icon: <ChatBubbleOutlineIcon />, color: '#f97316' },
                ].map(({ label, desc, to, icon, color }) => (
                  <Paper
                    key={to}
                    component={RouterLink}
                    to={to}
                    sx={{
                      p: 1.5, display: 'flex', alignItems: 'center', gap: 1.5,
                      textDecoration: 'none', borderRadius: 1,
                      border: cardBorder,
                      bgcolor: cardBg,
                      backgroundImage: 'none',
                      '&:hover': { borderColor: color + '50', bgcolor: color + (isDark ? '12' : '06') },
                      transition: 'all 0.2s', cursor: 'pointer',
                    }}
                  >
                    <Box sx={{
                      width: 36, height: 36, borderRadius: 2,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      bgcolor: color + (isDark ? '25' : '15'),
                    }}>
                      {React.cloneElement(icon, { sx: { fontSize: 18, color } })}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: textPrimary }}>
                        {label}
                      </Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: textMuted }}>
                        {desc}
                      </Typography>
                    </Box>
                    <ArrowForwardIcon sx={{ fontSize: 16, color: textMuted }} />
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* At-Risk & Stuck Students */}
        <Grid item xs={12} md={8}>
          <Card sx={{ ...cardSx, height: '100%' }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography sx={{ fontSize: '0.92rem', fontWeight: 600, color: textPrimary }}>
                  Attention Required
                </Typography>
                <Stack direction="row" spacing={1}>
                  {risk.at_risk_students.length > 0 && (
                    <Chip
                      label={`${risk.at_risk_students.length} at risk`}
                      size="small"
                      sx={{
                        fontSize: '0.68rem', fontWeight: 600,
                        bgcolor: isDark ? 'rgba(239,68,68,0.15)' : '#fef2f2',
                        color: '#ef4444',
                        border: `1px solid ${isDark ? 'rgba(239,68,68,0.3)' : '#fecaca'}`,
                      }}
                    />
                  )}
                  {risk.stuck_students.length > 0 && (
                    <Chip
                      label={`${risk.stuck_students.length} stuck`}
                      size="small"
                      sx={{
                        fontSize: '0.68rem', fontWeight: 600,
                        bgcolor: isDark ? 'rgba(245,158,11,0.15)' : '#fffbeb',
                        color: '#f59e0b',
                        border: `1px solid ${isDark ? 'rgba(245,158,11,0.3)' : '#fde68a'}`,
                      }}
                    />
                  )}
                </Stack>
              </Stack>

              {risk.at_risk_students.length === 0 && risk.stuck_students.length === 0 ? (
                <Box sx={{
                  py: 4, textAlign: 'center', borderRadius: 2,
                  bgcolor: isDark ? 'rgba(16,185,129,0.08)' : '#f0fdf4',
                  border: `1px solid ${isDark ? 'rgba(16,185,129,0.2)' : '#bbf7d0'}`,
                }}>
                  <CheckCircleOutlineIcon sx={{ fontSize: 32, color: '#10b981', mb: 1 }} />
                  <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: '#10b981' }}>
                    All students are on track!
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={1}>
                  {risk.at_risk_students.slice(0, 3).map((s, i) => (
                    <Stack
                      key={`risk-${i}`}
                      direction="row" alignItems="center" spacing={1.5}
                      sx={{
                        p: 1.5, borderRadius: 2,
                        border: `1px solid ${isDark ? 'rgba(239,68,68,0.2)' : '#fef2f2'}`,
                        bgcolor: isDark ? 'rgba(239,68,68,0.06)' : '#fef2f204',
                        '&:hover': { bgcolor: isDark ? 'rgba(239,68,68,0.1)' : '#fef2f2' },
                        transition: 'all 0.2s',
                      }}
                    >
                      <Avatar sx={{ width: 30, height: 30, bgcolor: isDark ? 'rgba(239,68,68,0.15)' : '#fef2f2', color: '#ef4444', fontSize: '0.75rem', fontWeight: 700 }}>
                        {(s.first_name || s.username || '?')[0].toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: textPrimary }}>
                          {s.first_name} {s.last_name}
                        </Typography>
                        <Typography sx={{ fontSize: '0.68rem', color: textMuted }}>
                          Last active: {s.last_activity ? new Date(s.last_activity).toLocaleDateString() : 'Unknown'}
                        </Typography>
                      </Box>
                      <Chip label="At Risk" size="small" sx={{
                        fontSize: '0.62rem', fontWeight: 700, height: 20,
                        bgcolor: isDark ? 'rgba(239,68,68,0.15)' : '#fef2f2',
                        color: '#ef4444',
                        border: `1px solid ${isDark ? 'rgba(239,68,68,0.3)' : '#fecaca'}`,
                      }} />
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/admin/users/${s.id}`)}
                        sx={{ color: textMuted, '&:hover': { color: '#6366f1' } }}
                      >
                        <VisibilityIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Stack>
                  ))}
                  {risk.stuck_students.slice(0, 3).map((s, i) => (
                    <Stack
                      key={`stuck-${i}`}
                      direction="row" alignItems="center" spacing={1.5}
                      sx={{
                        p: 1.5, borderRadius: 2,
                        border: `1px solid ${isDark ? 'rgba(245,158,11,0.2)' : '#fffbeb'}`,
                        bgcolor: isDark ? 'rgba(245,158,11,0.06)' : '#fffbeb04',
                        '&:hover': { bgcolor: isDark ? 'rgba(245,158,11,0.1)' : '#fffbeb' },
                        transition: 'all 0.2s',
                      }}
                    >
                      <Avatar sx={{ width: 30, height: 30, bgcolor: isDark ? 'rgba(245,158,11,0.15)' : '#fffbeb', color: '#f59e0b', fontSize: '0.75rem', fontWeight: 700 }}>
                        {(s.first_name || '?')[0].toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: textPrimary }}>
                          {s.first_name} {s.last_name}
                        </Typography>
                        <Typography sx={{ fontSize: '0.68rem', color: textMuted }}>
                          Stuck on {(s.step_id?.replace('_', ' ') || 'unknown').toUpperCase()} for {s.days_stuck} days
                        </Typography>
                      </Box>
                      <Chip label="Stuck" size="small" sx={{
                        fontSize: '0.62rem', fontWeight: 700, height: 20,
                        bgcolor: isDark ? 'rgba(245,158,11,0.15)' : '#fffbeb',
                        color: '#f59e0b',
                        border: `1px solid ${isDark ? 'rgba(245,158,11,0.3)' : '#fde68a'}`,
                      }} />
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/admin/users/${s.id}`)}
                        sx={{ color: textMuted, '&:hover': { color: '#6366f1' } }}
                      >
                        <VisibilityIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Stack>
                  ))}
                  {(risk.at_risk_students.length > 3 || risk.stuck_students.length > 3) && (
                    <Button
                      component={RouterLink} to="/admin/analytics"
                      sx={{ fontSize: '0.78rem', textTransform: 'none', color: '#6366f1', fontWeight: 600, mt: 0.5 }}
                    >
                      View all in Analytics
                    </Button>
                  )}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
