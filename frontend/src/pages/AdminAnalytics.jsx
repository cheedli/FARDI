import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Typography, Grid, Card, CardContent, Alert, Stack, Button, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  LinearProgress, Avatar, IconButton, Divider, Tooltip
} from '@mui/material'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip, Legend,
  ArcElement, LineElement, PointElement, Filler
} from 'chart.js'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import RefreshIcon from '@mui/icons-material/Refresh'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import PeopleIcon from '@mui/icons-material/People'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import VisibilityIcon from '@mui/icons-material/Visibility'
import BoltIcon from '@mui/icons-material/Bolt'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { useColorMode } from '../theme.jsx'

ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend,
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

function SectionLabel({ children, D }) {
  return (
    <Typography sx={{
      fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em',
      textTransform: 'uppercase', color: D.muted, mb: 1.5,
    }}>
      {children}
    </Typography>
  )
}

export default function AdminAnalytics() {
  const navigate = useNavigate()
  const { mode } = useColorMode()
  const D = mode === 'dark' ? DARK : LIGHT

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)

  const loadAnalytics = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/analytics', { credentials: 'include' })
      if (!res.ok) throw new Error('Failed to load analytics')
      const result = await res.json()
      if (result.success) setData(result.data)
      else setError(result.error || 'Failed to load analytics')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadAnalytics() }, [])

  if (loading) return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: D.pageBg, minHeight: '100vh' }}>
      <LinearProgress sx={{ borderRadius: 2 }} />
      <Typography sx={{ mt: 2, color: D.muted, fontSize: '0.9rem' }}>Loading analytics...</Typography>
    </Box>
  )

  if (error) return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: D.pageBg, minHeight: '100vh' }}>
      <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      <Button onClick={loadAnalytics} startIcon={<RefreshIcon />}>Retry</Button>
    </Box>
  )

  if (!data) return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: D.pageBg, minHeight: '100vh' }}>
      <Typography sx={{ color: D.muted }}>No analytics data available</Typography>
    </Box>
  )

  const { learning_progress, engagement, quality, risk, system } = data
  const phaseKeys = ['phase1_completed', 'phase2_completed', 'phase3_completed', 'phase4_completed', 'phase5_completed', 'phase6_completed']

  const tooltipStyles = {
    backgroundColor: D.cardBg,
    titleColor: D.heading,
    bodyColor: D.body,
    borderColor: D.border,
    borderWidth: 1,
  }

  const tickColor = D.muted
  const gridLine = mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(26,35,126,0.07)'

  // ── Chart data ──
  const activityData = {
    labels: (engagement.daily_activity || []).slice().reverse().map(d =>
      new Date(d.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })
    ),
    datasets: [{
      label: 'Active Users',
      data: (engagement.daily_activity || []).slice().reverse().map(d => d.active_users),
      borderColor: D.indigo.border,
      backgroundColor: mode === 'dark' ? 'rgba(159,168,218,0.12)' : 'rgba(40,53,147,0.07)',
      tension: 0.4, fill: true, pointRadius: 3,
      pointBackgroundColor: D.indigo.border, borderWidth: 2,
    }]
  }

  const cefrData = {
    labels: (learning_progress.cefr_distribution || []).map(d => d.level),
    datasets: [{
      data: (learning_progress.cefr_distribution || []).map(d => d.count),
      backgroundColor: PHASE_CLAY.map(ck => D[ck].border),
      borderWidth: 0, hoverOffset: 6,
    }]
  }

  const scoreData = {
    labels: (quality.score_distribution || []).map(d => d.score_range),
    datasets: [{
      label: 'Students',
      data: (quality.score_distribution || []).map(d => d.count),
      backgroundColor: D.indigo.border,
      borderRadius: 6, borderSkipped: false,
    }]
  }

  const durationData = {
    labels: (engagement.session_duration_dist || []).map(d => d.duration_range),
    datasets: [{
      label: 'Sessions',
      data: (engagement.session_duration_dist || []).map(d => d.count),
      backgroundColor: D.blue.border,
      borderRadius: 6, borderSkipped: false,
    }]
  }

  const lineOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: tooltipStyles },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 10 }, color: tickColor } },
      y: { beginAtZero: true, grid: { color: gridLine }, ticks: { font: { size: 10 }, color: tickColor } },
    },
  }

  const barOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: tooltipStyles },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 10 }, color: tickColor } },
      y: { beginAtZero: true, grid: { color: gridLine }, ticks: { font: { size: 10 }, color: tickColor } },
    },
  }

  const doughnutOpts = {
    responsive: true, maintainAspectRatio: false, cutout: '62%',
    plugins: { legend: { display: false }, tooltip: tooltipStyles },
  }

  const noData = (label) => (
    <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography sx={{ color: D.muted, fontSize: '0.82rem' }}>{label || 'No data'}</Typography>
    </Box>
  )

  const kpiCards = [
    { label: 'Active (7d)', value: engagement.active_users_7d, icon: <TrendingUpIcon />, colorKey: 'indigo' },
    { label: 'Active (30d)', value: engagement.active_users_30d, icon: <PeopleIcon />, colorKey: 'green' },
    { label: 'Sessions (7d)', value: system.total_sessions_7d, icon: <BoltIcon />, colorKey: 'blue' },
    { label: 'AI Usage', value: `${quality.ai_detection.avg_ai_usage ? Math.round(quality.ai_detection.avg_ai_usage) : 0}%`, icon: <SmartToyIcon />, colorKey: 'orange' },
    { label: 'Errors', value: system.recent_errors, icon: <ErrorOutlineIcon />, colorKey: system.recent_errors > 0 ? 'red' : 'green' },
  ]

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1100, mx: 'auto', bgcolor: D.pageBg, minHeight: '100vh' }}>

      {/* ── Header ── */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 4 }}>
        <Box>
          <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: D.heading, lineHeight: 1.2 }}>
            Analytics
          </Typography>
          <Typography sx={{ fontSize: '0.85rem', color: D.muted, mt: 0.3 }}>
            Platform metrics and learning insights
          </Typography>
        </Box>
        <Tooltip title="Refresh">
          <IconButton
            onClick={loadAnalytics}
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
        </Tooltip>
      </Stack>

      {/* ── KPI strip ── */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {kpiCards.map(({ label, value, icon, colorKey }) => (
          <Grid item xs={6} sm={4} md key={label}>
            <Card sx={colorClayCard(D, colorKey)}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box sx={{
                    width: 38, height: 38, borderRadius: '12px', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    bgcolor: D.cardBg,
                    border: `2px solid ${D[colorKey].border}`,
                  }}>
                    {React.cloneElement(icon, { sx: { fontSize: 18, color: D[colorKey].border } })}
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '1.35rem', fontWeight: 800, color: D[colorKey].border, lineHeight: 1 }}>
                      {value}
                    </Typography>
                    <Typography sx={{ fontSize: '0.68rem', color: D.body, fontWeight: 600, mt: 0.2 }}>{label}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ── Activity + CEFR ── */}
      <SectionLabel D={D}>Engagement</SectionLabel>
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ ...clayCard(D), height: '100%' }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: D.heading }}>
                  Daily Active Users
                </Typography>
                <Chip label="Last 30 days" size="small" sx={{
                  fontSize: '0.65rem', fontWeight: 700,
                  bgcolor: D.indigo.bg,
                  color: D.indigo.border,
                  border: `1px solid ${D.indigo.border}`,
                }} />
              </Stack>
              <Box sx={{ height: 240 }}>
                {(engagement.daily_activity || []).length > 0
                  ? <Line data={activityData} options={lineOpts} />
                  : noData('No activity data')}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ ...clayCard(D), height: '100%' }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: D.heading, mb: 2 }}>
                CEFR Distribution
              </Typography>
              <Box sx={{ height: 160, display: 'flex', justifyContent: 'center' }}>
                {(learning_progress.cefr_distribution || []).length > 0
                  ? <Doughnut data={cefrData} options={doughnutOpts} />
                  : noData()}
              </Box>
              <Stack direction="row" flexWrap="wrap" gap={0.8} sx={{ mt: 2, justifyContent: 'center' }}>
                {(learning_progress.cefr_distribution || []).map((d, i) => {
                  const ck = PHASE_CLAY[i] || 'indigo'
                  return (
                    <Chip key={d.level} label={`${d.level}: ${d.count}`} size="small" sx={{
                      fontSize: '0.65rem', fontWeight: 700, height: 20,
                      bgcolor: D[ck].bg,
                      color: D[ck].border,
                      border: `1px solid ${D[ck].border}`,
                    }} />
                  )
                })}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ── Phase Funnel ── */}
      <SectionLabel D={D}>Learning Progress</SectionLabel>
      <Card sx={{ ...clayCard(D), mb: 4 }}>
        <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: D.heading }}>
              Phase Completion Funnel
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: D.muted }}>
              {learning_progress.phase_completion.total_users || 0} total students
            </Typography>
          </Stack>
          <Stack spacing={2}>
            {phaseKeys.map((key, i) => {
              const ck = PHASE_CLAY[i]
              const total = learning_progress.phase_completion.total_users || 1
              const value = learning_progress.phase_completion[key] || 0
              const pct = Math.round((value / total) * 100)
              return (
                <Stack key={key} direction="row" alignItems="center" spacing={2.5}>
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: 160, flexShrink: 0 }}>
                    <Box sx={{
                      width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                      bgcolor: D[ck].border,
                      boxShadow: `0 0 8px ${D[ck].shadow}`,
                    }} />
                    <Box>
                      <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: D.heading, lineHeight: 1.2 }}>
                        Phase {i + 1}
                      </Typography>
                      <Typography sx={{ fontSize: '0.62rem', color: D.muted }}>{PHASE_NAMES[i]}</Typography>
                    </Box>
                  </Stack>
                  <Box sx={{ flex: 1 }}>
                    <LinearProgress
                      variant="determinate" value={pct}
                      sx={{
                        height: 10, borderRadius: 5,
                        bgcolor: D[ck].bg,
                        border: `1px solid ${D[ck].border}`,
                        '& .MuiLinearProgress-bar': { bgcolor: D[ck].border, borderRadius: 5 },
                      }}
                    />
                  </Box>
                  <Stack direction="row" alignItems="baseline" spacing={0.5} sx={{ width: 72, flexShrink: 0, justifyContent: 'flex-end' }}>
                    <Typography sx={{ fontSize: '0.92rem', fontWeight: 800, color: D[ck].border }}>
                      {value}
                    </Typography>
                    <Typography sx={{ fontSize: '0.65rem', color: D.muted }}>
                      ({pct}%)
                    </Typography>
                  </Stack>
                </Stack>
              )
            })}
          </Stack>
        </CardContent>
      </Card>

      {/* ── Score + Duration ── */}
      <SectionLabel D={D}>Quality & Sessions</SectionLabel>
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={clayCard(D)}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: D.heading, mb: 2 }}>
                Score Distribution
              </Typography>
              <Box sx={{ height: 220 }}>
                {(quality.score_distribution || []).length > 0
                  ? <Bar data={scoreData} options={barOpts} />
                  : noData()}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={clayCard(D)}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: D.heading, mb: 2 }}>
                Session Duration
              </Typography>
              <Box sx={{ height: 220 }}>
                {(engagement.session_duration_dist || []).length > 0
                  ? <Bar data={durationData} options={barOpts} />
                  : noData()}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ── Challenging Steps ── */}
      {(quality.challenging_steps || []).length > 0 && (
        <>
          <SectionLabel D={D}>Step Difficulty</SectionLabel>
          <Card sx={{ ...clayCard(D), mb: 4 }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {['Step', 'Attempts', 'Success Rate', 'Status'].map((h, i) => (
                      <TableCell key={h} align={i > 0 ? 'right' : 'left'} sx={{
                        fontSize: '0.65rem', fontWeight: 800, color: D.heading,
                        textTransform: 'uppercase', letterSpacing: '0.07em',
                        bgcolor: D.indigo.bg,
                        borderBottom: `2px solid ${D.border}`,
                        py: 1.3,
                      }}>
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {quality.challenging_steps.map((step, i) => {
                    const sr = step.success_rate
                    const statusColorKey = sr > 70 ? 'green' : sr > 50 ? 'yellow' : 'red'
                    const statusLabel = sr > 70 ? 'Good' : sr > 50 ? 'Watch' : 'Critical'
                    return (
                      <TableRow key={i} sx={{
                        '&:last-child td': { border: 'none' },
                        '&:hover': { bgcolor: D.indigo.bg },
                        transition: 'background 0.15s',
                      }}>
                        <TableCell sx={{ py: 1.4 }}>
                          <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: D.heading }}>
                            {(step.step_id?.replace(/_/g, ' ') || 'UNKNOWN').toUpperCase()}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.8rem', color: D.muted, py: 1.4 }}>
                          {step.attempts}
                        </TableCell>
                        <TableCell align="right" sx={{ py: 1.4 }}>
                          <Typography sx={{ fontSize: '0.82rem', fontWeight: 800, color: D[statusColorKey].border }}>
                            {sr}%
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ py: 1.4 }}>
                          <Chip label={statusLabel} size="small" sx={{
                            fontSize: '0.62rem', fontWeight: 700, height: 20,
                            bgcolor: D[statusColorKey].bg,
                            color: D[statusColorKey].border,
                            border: `1px solid ${D[statusColorKey].border}`,
                          }} />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </>
      )}

      {/* ── At-Risk + Stuck ── */}
      <SectionLabel D={D}>Student Alerts</SectionLabel>
      <Grid container spacing={2.5}>
        {[
          {
            title: 'At-Risk Students',
            icon: <WarningAmberIcon sx={{ fontSize: 16 }} />,
            list: risk.at_risk_students,
            colorKey: 'red',
            empty: 'No at-risk students',
            sub: (s) => `Last active: ${s.last_activity ? new Date(s.last_activity).toLocaleDateString('en', { month: 'short', day: 'numeric' }) : 'Unknown'}`,
          },
          {
            title: 'Stuck Students',
            icon: <AccessTimeIcon sx={{ fontSize: 16 }} />,
            list: risk.stuck_students,
            colorKey: 'yellow',
            empty: 'No stuck students',
            sub: (s) => `${(s.step_id?.replace(/_/g, ' ') || 'Unknown').toUpperCase()} · ${s.days_stuck}d stuck`,
          },
        ].map(({ title, icon, list, colorKey, empty, sub }) => (
          <Grid item xs={12} md={6} key={title}>
            <Card sx={clayCard(D)}>
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  {React.cloneElement(icon, { sx: { fontSize: 16, color: D[colorKey].border } })}
                  <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: D.heading }}>
                    {title}
                  </Typography>
                  {list.length > 0 && (
                    <Chip label={list.length} size="small" sx={{
                      height: 18, fontSize: '0.62rem', fontWeight: 700,
                      bgcolor: D[colorKey].bg,
                      color: D[colorKey].border,
                      border: `1px solid ${D[colorKey].border}`,
                    }} />
                  )}
                </Stack>

                {list.length === 0 ? (
                  <Box sx={{
                    py: 3, textAlign: 'center', borderRadius: '14px',
                    bgcolor: D.green.bg,
                    border: `2px solid ${D.green.border}`,
                    boxShadow: `2px 2px 0 ${D.green.shadow}`,
                  }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: 22, color: D.green.border, mb: 0.5 }} />
                    <Typography sx={{ fontSize: '0.8rem', color: D.green.border, fontWeight: 700 }}>
                      {empty}
                    </Typography>
                  </Box>
                ) : (
                  <Stack spacing={1}>
                    {list.map((s, i) => (
                      <Stack
                        key={i} direction="row" alignItems="center" spacing={1.5}
                        sx={{
                          p: 1.5, borderRadius: '12px',
                          bgcolor: D[colorKey].bg,
                          border: `2px solid ${D[colorKey].border}`,
                          transition: 'all 0.15s ease',
                          '&:hover': { transform: 'translate(-1px,-1px)', boxShadow: `2px 2px 0 ${D[colorKey].shadow}` },
                        }}
                      >
                        <Avatar sx={{
                          width: 30, height: 30,
                          bgcolor: D.cardBg,
                          color: D[colorKey].border,
                          fontSize: '0.72rem', fontWeight: 800,
                          border: `2px solid ${D[colorKey].border}`,
                        }}>
                          {(s.first_name || '?')[0].toUpperCase()}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: D.heading, lineHeight: 1.2 }}>
                            {s.first_name} {s.last_name}
                          </Typography>
                          <Typography sx={{ fontSize: '0.67rem', color: D.muted, mt: 0.2 }}>
                            {sub(s)}
                          </Typography>
                        </Box>
                        <Tooltip title="View profile">
                          <IconButton size="small" onClick={() => navigate(`/admin/users/${s.id}`)}
                            sx={{ color: D.muted, '&:hover': { color: D.heading } }}
                          >
                            <VisibilityIcon sx={{ fontSize: 15 }} />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    ))}
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

    </Box>
  )
}
