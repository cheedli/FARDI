import React, { useEffect, useState } from 'react'
import {
  Box, Typography, Stack, Grid, Card, CardContent, LinearProgress,
  Alert, Button, IconButton, Avatar, Chip, Paper
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
import { useColorMode } from '../theme.jsx'

ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
  ArcElement, LineElement, PointElement, Filler
)

const LIGHT = {
  pageBg: '#FFFDE7',
  cardBg: '#ffffff',
  heading: '#1A237E',
  body: '#37474F',
  muted: '#78909C',
  border: '#1A237E',
  purple: { bg: '#F3E5F5', border: '#7B1FA2', shadow: '#7B1FA2' },
  blue:   { bg: '#E3F2FD', border: '#1565C0', shadow: '#1565C0' },
  green:  { bg: '#E8F5E9', border: '#2E7D32', shadow: '#2E7D32' },
  yellow: { bg: '#FFFDE7', border: '#F57F17', shadow: '#F57F17' },
  orange: { bg: '#FFF3E0', border: '#E65100', shadow: '#E65100' },
  red:    { bg: '#FFEBEE', border: '#C62828', shadow: '#C62828' },
  teal:   { bg: '#E0F2F1', border: '#00695C', shadow: '#00695C' },
  indigo: { bg: '#E8EAF6', border: '#283593', shadow: '#283593' },
}
const DARK = {
  pageBg: '#0F0F1A',
  cardBg: '#1A1A2E',
  heading: '#E8EAFF',
  body: '#B0BEC5',
  muted: '#607D8B',
  border: '#3A3A5C',
  purple: { bg: '#1A0A2E', border: '#CE93D8', shadow: '#9C27B0' },
  blue:   { bg: '#0A1A2E', border: '#90CAF9', shadow: '#1565C0' },
  green:  { bg: '#0A1A0A', border: '#A5D6A7', shadow: '#2E7D32' },
  yellow: { bg: '#1A1A00', border: '#FFF176', shadow: '#F57F17' },
  orange: { bg: '#1A0F00', border: '#FFCC80', shadow: '#E65100' },
  red:    { bg: '#1A0A0A', border: '#EF9A9A', shadow: '#C62828' },
  teal:   { bg: '#0A1A18', border: '#80CBC4', shadow: '#00695C' },
  indigo: { bg: '#0A0E1A', border: '#9FA8DA', shadow: '#283593' },
}

const PHASE_CLAY = ['indigo', 'blue', 'green', 'orange', 'red', 'purple']
const PHASE_NAMES = ['Foundation', 'Cultural Planning', 'Vendors & Budget', 'Marketing', 'Execution', 'Reflection']

const clayCard = (D) => ({
  background: D.cardBg,
  border: `2px solid ${D.border}`,
  borderRadius: '20px',
  boxShadow: `4px 4px 0 ${D.border}`,
  backgroundImage: 'none',
  transition: 'all 0.15s ease',
  '&:hover': {
    transform: 'translate(-2px, -2px)',
    boxShadow: `6px 6px 0 ${D.border}`,
  },
})

const colorClayCard = (D, colorKey) => ({
  background: D[colorKey].bg,
  border: `2px solid ${D[colorKey].border}`,
  borderRadius: '20px',
  boxShadow: `4px 4px 0 ${D[colorKey].shadow}`,
  backgroundImage: 'none',
  transition: 'all 0.15s ease',
  '&:hover': {
    transform: 'translate(-2px, -2px)',
    boxShadow: `6px 6px 0 ${D[colorKey].shadow}`,
  },
})

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { mode } = useColorMode()
  const D = mode === 'dark' ? DARK : LIGHT

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
      <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: D.pageBg, minHeight: '100vh' }}>
        <Typography sx={{ fontSize: '1rem', color: D.muted, mb: 2 }}>Loading dashboard...</Typography>
        <LinearProgress sx={{ borderRadius: 2 }} />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: D.pageBg, minHeight: '100vh' }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button onClick={loadData} startIcon={<RefreshIcon />}>Retry</Button>
      </Box>
    )
  }

  if (!analytics) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: D.pageBg, minHeight: '100vh' }}>
        <Typography sx={{ color: D.muted }}>No analytics data available</Typography>
      </Box>
    )
  }

  const { learning_progress, engagement, quality, risk } = analytics
  const totalStudents = users.filter(u => !u.is_admin).length

  const activityData = {
    labels: (engagement.daily_activity || []).slice().reverse().slice(-14).map(d =>
      new Date(d.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })
    ),
    datasets: [{
      data: (engagement.daily_activity || []).slice().reverse().slice(-14).map(d => d.active_users),
      borderColor: D.indigo.border,
      backgroundColor: mode === 'dark' ? 'rgba(159,168,218,0.15)' : 'rgba(40,53,147,0.08)',
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
      backgroundColor: [
        D.indigo.border, D.blue.border, D.green.border,
        D.orange.border, D.red.border, D.purple.border,
      ],
      borderWidth: 0,
      hoverOffset: 4,
    }]
  }

  const tooltipStyles = {
    backgroundColor: D.cardBg,
    titleColor: D.heading,
    bodyColor: D.body,
    borderColor: D.border,
    borderWidth: 1,
  }

  const miniChartOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true, ...tooltipStyles },
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
      tooltip: { enabled: true, ...tooltipStyles },
    },
  }

  const phaseKeys = ['phase1_completed', 'phase2_completed', 'phase3_completed', 'phase4_completed', 'phase5_completed', 'phase6_completed']

  const kpiCards = [
    { label: 'Total Students', value: totalStudents, icon: <PeopleIcon />, colorKey: 'indigo' },
    { label: 'Active (7d)', value: engagement.active_users_7d, icon: <TrendingUpIcon />, colorKey: 'green' },
    { label: 'At Risk', value: risk.at_risk_students.length, icon: <WarningAmberIcon />, colorKey: risk.at_risk_students.length > 0 ? 'red' : 'green' },
    { label: 'Assessments', value: quality.ai_detection.total_assessments || 0, icon: <CheckCircleOutlineIcon />, colorKey: 'blue' },
  ]

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: D.pageBg, minHeight: '100vh' }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography sx={{ fontSize: '1.6rem', fontWeight: 800, color: D.heading, lineHeight: 1.2 }}>
            Dashboard
          </Typography>
          <Typography sx={{ fontSize: '0.88rem', color: D.muted, mt: 0.3 }}>
            Overview of your learning platform
          </Typography>
        </Box>
        <IconButton
          onClick={loadData}
          sx={{
            color: D.muted,
            border: `2px solid ${D.border}`,
            borderRadius: '12px',
            boxShadow: `3px 3px 0 ${D.border}`,
            '&:hover': { color: D.heading, transform: 'translate(-1px,-1px)', boxShadow: `4px 4px 0 ${D.border}` },
            transition: 'all 0.15s ease',
          }}
        >
          <RefreshIcon />
        </IconButton>
      </Stack>

      {/* KPI Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {kpiCards.map(({ label, value, icon, colorKey }) => (
          <Grid item xs={6} md={3} key={label}>
            <Card sx={colorClayCard(D, colorKey)}>
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box sx={{
                    width: 44, height: 44, borderRadius: '14px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    bgcolor: D[colorKey].bg,
                    border: `2px solid ${D[colorKey].border}`,
                  }}>
                    {React.cloneElement(icon, { sx: { fontSize: 22, color: D[colorKey].border } })}
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: D[colorKey].border, lineHeight: 1 }}>
                      {value}
                    </Typography>
                    <Typography sx={{ fontSize: '0.72rem', color: D.body, fontWeight: 600, mt: 0.2 }}>
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
          <Card sx={{ ...clayCard(D), height: '100%' }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography sx={{ fontSize: '0.92rem', fontWeight: 700, color: D.heading }}>
                  Activity Trend
                </Typography>
                <Chip label="Last 14 days" size="small" sx={{
                  fontSize: '0.68rem', fontWeight: 700,
                  bgcolor: D.indigo.bg,
                  color: D.indigo.border,
                  border: `1px solid ${D.indigo.border}`,
                }} />
              </Stack>
              <Box sx={{ height: 200 }}>
                {(engagement.daily_activity || []).length > 0 ? (
                  <Line data={activityData} options={miniChartOpts} />
                ) : (
                  <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography sx={{ color: D.muted, fontSize: '0.85rem' }}>No activity data</Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* CEFR Distribution */}
        <Grid item xs={12} md={4}>
          <Card sx={{ ...clayCard(D), height: '100%' }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Typography sx={{ fontSize: '0.92rem', fontWeight: 700, color: D.heading, mb: 2 }}>
                CEFR Distribution
              </Typography>
              <Box sx={{ height: 160, display: 'flex', justifyContent: 'center' }}>
                {(learning_progress.cefr_distribution || []).length > 0 ? (
                  <Doughnut data={cefrData} options={doughnutOpts} />
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ color: D.muted, fontSize: '0.85rem' }}>No data</Typography>
                  </Box>
                )}
              </Box>
              {(learning_progress.cefr_distribution || []).length > 0 && (
                <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1.5, justifyContent: 'center' }}>
                  {learning_progress.cefr_distribution.map((d, i) => {
                    const ck = PHASE_CLAY[i] || 'indigo'
                    return (
                      <Chip
                        key={d.level}
                        label={`${d.level}: ${d.count}`}
                        size="small"
                        sx={{
                          fontSize: '0.68rem', fontWeight: 700, height: 22,
                          bgcolor: D[ck].bg,
                          color: D[ck].border,
                          border: `1px solid ${D[ck].border}`,
                        }}
                      />
                    )
                  })}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Phase Completion Funnel */}
      <Card sx={{ ...clayCard(D), mb: 4 }}>
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
            <Typography sx={{ fontSize: '0.92rem', fontWeight: 700, color: D.heading }}>
              Phase Completion Funnel
            </Typography>
            <Button
              component={RouterLink} to="/admin/analytics"
              endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
              sx={{
                fontSize: '0.78rem', textTransform: 'none',
                color: D.indigo.border, fontWeight: 700,
                border: `2px solid ${D.indigo.border}`,
                borderRadius: '10px',
                boxShadow: `2px 2px 0 ${D.indigo.shadow}`,
                px: 1.5, py: 0.5,
                '&:hover': { transform: 'translate(-1px,-1px)', boxShadow: `3px 3px 0 ${D.indigo.shadow}` },
                transition: 'all 0.15s ease',
              }}
            >
              View Details
            </Button>
          </Stack>
          <Grid container spacing={1.5}>
            {phaseKeys.map((key, i) => {
              const ck = PHASE_CLAY[i]
              const total = learning_progress.phase_completion.total_users || 1
              const value = learning_progress.phase_completion[key] || 0
              const pct = Math.round((value / total) * 100)
              return (
                <Grid item xs={6} sm={4} md={2} key={key}>
                  <Box sx={{
                    textAlign: 'center', p: 1.5, borderRadius: '16px',
                    background: D[ck].bg,
                    border: `2px solid ${D[ck].border}`,
                    boxShadow: `3px 3px 0 ${D[ck].shadow}`,
                    transition: 'all 0.15s ease',
                    '&:hover': { transform: 'translate(-1px,-1px)', boxShadow: `4px 4px 0 ${D[ck].shadow}` },
                  }}>
                    <Box sx={{
                      width: 40, height: 40, borderRadius: '50%', mx: 'auto', mb: 1,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      bgcolor: D.cardBg,
                      border: `2px solid ${D[ck].border}`,
                    }}>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 800, color: D[ck].border }}>
                        {value}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: D.body, lineHeight: 1.2 }}>
                      Phase {i + 1}
                    </Typography>
                    <Typography sx={{ fontSize: '0.62rem', color: D.muted, mt: 0.2 }}>
                      {PHASE_NAMES[i]}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={pct}
                      sx={{
                        mt: 1, height: 6, borderRadius: 3,
                        bgcolor: D.cardBg,
                        '& .MuiLinearProgress-bar': { bgcolor: D[ck].border, borderRadius: 3 },
                      }}
                    />
                    <Typography sx={{ fontSize: '0.62rem', color: D[ck].border, fontWeight: 700, mt: 0.4 }}>
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
          <Card sx={{ ...clayCard(D), height: '100%' }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Typography sx={{ fontSize: '0.92rem', fontWeight: 700, color: D.heading, mb: 2 }}>
                Quick Actions
              </Typography>
              <Stack spacing={1.5}>
                {[
                  { label: 'View All Students', desc: `${totalStudents} registered`, to: '/admin/users', icon: <PeopleIcon />, colorKey: 'green' },
                  { label: 'Full Analytics', desc: 'Charts & reports', to: '/admin/analytics', icon: <BarChartIcon />, colorKey: 'blue' },
                  { label: 'Messages', desc: 'Chat with students', to: '/admin/chat', icon: <ChatBubbleOutlineIcon />, colorKey: 'orange' },
                ].map(({ label, desc, to, icon, colorKey }) => (
                  <Paper
                    key={to}
                    component={RouterLink}
                    to={to}
                    sx={{
                      p: 1.5, display: 'flex', alignItems: 'center', gap: 1.5,
                      textDecoration: 'none', borderRadius: '14px',
                      background: D[colorKey].bg,
                      border: `2px solid ${D[colorKey].border}`,
                      boxShadow: `3px 3px 0 ${D[colorKey].shadow}`,
                      backgroundImage: 'none',
                      transition: 'all 0.15s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translate(-1px,-1px)',
                        boxShadow: `4px 4px 0 ${D[colorKey].shadow}`,
                      },
                    }}
                  >
                    <Box sx={{
                      width: 38, height: 38, borderRadius: '10px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      bgcolor: D.cardBg,
                      border: `2px solid ${D[colorKey].border}`,
                    }}>
                      {React.cloneElement(icon, { sx: { fontSize: 18, color: D[colorKey].border } })}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: D.heading }}>
                        {label}
                      </Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: D.muted }}>
                        {desc}
                      </Typography>
                    </Box>
                    <ArrowForwardIcon sx={{ fontSize: 16, color: D[colorKey].border }} />
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* At-Risk & Stuck Students */}
        <Grid item xs={12} md={8}>
          <Card sx={{ ...clayCard(D), height: '100%' }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography sx={{ fontSize: '0.92rem', fontWeight: 700, color: D.heading }}>
                  Attention Required
                </Typography>
                <Stack direction="row" spacing={1}>
                  {risk.at_risk_students.length > 0 && (
                    <Chip
                      label={`${risk.at_risk_students.length} at risk`}
                      size="small"
                      sx={{
                        fontSize: '0.68rem', fontWeight: 700,
                        bgcolor: D.red.bg,
                        color: D.red.border,
                        border: `1px solid ${D.red.border}`,
                      }}
                    />
                  )}
                  {risk.stuck_students.length > 0 && (
                    <Chip
                      label={`${risk.stuck_students.length} stuck`}
                      size="small"
                      sx={{
                        fontSize: '0.68rem', fontWeight: 700,
                        bgcolor: D.yellow.bg,
                        color: D.yellow.border,
                        border: `1px solid ${D.yellow.border}`,
                      }}
                    />
                  )}
                </Stack>
              </Stack>

              {risk.at_risk_students.length === 0 && risk.stuck_students.length === 0 ? (
                <Box sx={{
                  py: 4, textAlign: 'center', borderRadius: '14px',
                  bgcolor: D.green.bg,
                  border: `2px solid ${D.green.border}`,
                  boxShadow: `3px 3px 0 ${D.green.shadow}`,
                }}>
                  <CheckCircleOutlineIcon sx={{ fontSize: 32, color: D.green.border, mb: 1 }} />
                  <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: D.green.border }}>
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
                        p: 1.5, borderRadius: '12px',
                        bgcolor: D.red.bg,
                        border: `2px solid ${D.red.border}`,
                        transition: 'all 0.15s ease',
                        '&:hover': { transform: 'translate(-1px,-1px)', boxShadow: `3px 3px 0 ${D.red.shadow}` },
                      }}
                    >
                      <Avatar sx={{
                        width: 30, height: 30,
                        bgcolor: D.cardBg,
                        color: D.red.border,
                        fontSize: '0.75rem', fontWeight: 800,
                        border: `2px solid ${D.red.border}`,
                      }}>
                        {(s.first_name || s.username || '?')[0].toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: D.heading }}>
                          {s.first_name} {s.last_name}
                        </Typography>
                        <Typography sx={{ fontSize: '0.68rem', color: D.muted }}>
                          Last active: {s.last_activity ? new Date(s.last_activity).toLocaleDateString() : 'Unknown'}
                        </Typography>
                      </Box>
                      <Chip label="At Risk" size="small" sx={{
                        fontSize: '0.62rem', fontWeight: 700, height: 20,
                        bgcolor: D.cardBg,
                        color: D.red.border,
                        border: `1px solid ${D.red.border}`,
                      }} />
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/admin/users/${s.id}`)}
                        sx={{ color: D.muted, '&:hover': { color: D.heading } }}
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
                        p: 1.5, borderRadius: '12px',
                        bgcolor: D.yellow.bg,
                        border: `2px solid ${D.yellow.border}`,
                        transition: 'all 0.15s ease',
                        '&:hover': { transform: 'translate(-1px,-1px)', boxShadow: `3px 3px 0 ${D.yellow.shadow}` },
                      }}
                    >
                      <Avatar sx={{
                        width: 30, height: 30,
                        bgcolor: D.cardBg,
                        color: D.yellow.border,
                        fontSize: '0.75rem', fontWeight: 800,
                        border: `2px solid ${D.yellow.border}`,
                      }}>
                        {(s.first_name || '?')[0].toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: D.heading }}>
                          {s.first_name} {s.last_name}
                        </Typography>
                        <Typography sx={{ fontSize: '0.68rem', color: D.muted }}>
                          Stuck on {(s.step_id?.replace('_', ' ') || 'unknown').toUpperCase()} for {s.days_stuck} days
                        </Typography>
                      </Box>
                      <Chip label="Stuck" size="small" sx={{
                        fontSize: '0.62rem', fontWeight: 700, height: 20,
                        bgcolor: D.cardBg,
                        color: D.yellow.border,
                        border: `1px solid ${D.yellow.border}`,
                      }} />
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/admin/users/${s.id}`)}
                        sx={{ color: D.muted, '&:hover': { color: D.heading } }}
                      >
                        <VisibilityIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Stack>
                  ))}
                  {(risk.at_risk_students.length > 3 || risk.stuck_students.length > 3) && (
                    <Button
                      component={RouterLink} to="/admin/analytics"
                      sx={{
                        fontSize: '0.78rem', textTransform: 'none',
                        color: D.indigo.border, fontWeight: 700, mt: 0.5,
                      }}
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
