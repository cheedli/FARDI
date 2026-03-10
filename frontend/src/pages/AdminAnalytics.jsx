import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Typography, Grid, Card, CardContent, Alert, Stack, Button, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  LinearProgress, Avatar, IconButton, useTheme, Divider, Tooltip
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

ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend,
  ArcElement, LineElement, PointElement, Filler
)

const PHASE_COLORS = ['#6366f1', '#0ea5e9', '#10b981', '#f97316', '#ef4444', '#8b5cf6']
const PHASE_NAMES = ['Foundation', 'Cultural Planning', 'Vendors & Budget', 'Marketing', 'Execution', 'Reflection']

function SectionLabel({ children }) {
  return (
    <Typography sx={{
      fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em',
      textTransform: 'uppercase', color: 'text.secondary', mb: 1.5,
    }}>
      {children}
    </Typography>
  )
}

export default function AdminAnalytics() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

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

  const border = isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid #f1f5f9'
  const cardBg = isDark ? theme.palette.background.paper : '#ffffff'
  const muted = theme.palette.text.secondary
  const trackBg = isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'
  const gridLine = isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9'
  const tickColor = isDark ? '#64748b' : '#94a3b8'
  const cardSx = { border, borderRadius: 3, boxShadow: 'none', bgcolor: cardBg, backgroundImage: 'none' }

  const tooltipStyles = {
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
    titleColor: isDark ? '#f1f5f9' : '#0f172a',
    bodyColor: isDark ? '#cbd5e1' : '#64748b',
    borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
    borderWidth: 1,
  }

  if (loading) return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <LinearProgress sx={{ borderRadius: 2 }} />
      <Typography sx={{ mt: 2, color: muted, fontSize: '0.9rem' }}>Loading analytics...</Typography>
    </Box>
  )

  if (error) return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      <Button onClick={loadAnalytics} startIcon={<RefreshIcon />}>Retry</Button>
    </Box>
  )

  if (!data) return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography color="text.secondary">No analytics data available</Typography>
    </Box>
  )

  const { learning_progress, engagement, quality, risk, system } = data
  const phaseKeys = ['phase1_completed', 'phase2_completed', 'phase3_completed', 'phase4_completed', 'phase5_completed', 'phase6_completed']

  // ── Chart data ──
  const activityData = {
    labels: (engagement.daily_activity || []).slice().reverse().map(d =>
      new Date(d.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })
    ),
    datasets: [{
      label: 'Active Users',
      data: (engagement.daily_activity || []).slice().reverse().map(d => d.active_users),
      borderColor: '#6366f1',
      backgroundColor: isDark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.07)',
      tension: 0.4, fill: true, pointRadius: 3,
      pointBackgroundColor: '#6366f1', borderWidth: 2,
    }]
  }

  const cefrData = {
    labels: (learning_progress.cefr_distribution || []).map(d => d.level),
    datasets: [{
      data: (learning_progress.cefr_distribution || []).map(d => d.count),
      backgroundColor: PHASE_COLORS,
      borderWidth: 0, hoverOffset: 6,
    }]
  }

  const scoreData = {
    labels: (quality.score_distribution || []).map(d => d.score_range),
    datasets: [{
      label: 'Students',
      data: (quality.score_distribution || []).map(d => d.count),
      backgroundColor: isDark ? 'rgba(99,102,241,0.7)' : '#6366f1',
      borderRadius: 6, borderSkipped: false,
    }]
  }

  const durationData = {
    labels: (engagement.session_duration_dist || []).map(d => d.duration_range),
    datasets: [{
      label: 'Sessions',
      data: (engagement.session_duration_dist || []).map(d => d.count),
      backgroundColor: isDark ? 'rgba(14,165,233,0.7)' : '#0ea5e9',
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
      <Typography sx={{ color: muted, fontSize: '0.82rem' }}>{label || 'No data'}</Typography>
    </Box>
  )

  const riskRowSx = (color) => ({
    p: 1.5, borderRadius: 2, border,
    bgcolor: isDark ? `${color}08` : 'transparent',
    '&:hover': { bgcolor: isDark ? `${color}12` : `${color}06` },
    transition: 'background 0.15s',
  })

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1100, mx: 'auto' }}>

      {/* ── Header ── */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 4 }}>
        <Box>
          <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }}>
            Analytics
          </Typography>
          <Typography sx={{ fontSize: '0.85rem', color: muted, mt: 0.3 }}>
            Platform metrics and learning insights
          </Typography>
        </Box>
        <Tooltip title="Refresh">
          <IconButton onClick={loadAnalytics} sx={{ color: muted, '&:hover': { color: '#6366f1' } }}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* ── KPI strip ── */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[
          { label: 'Active (7d)', value: engagement.active_users_7d, icon: <TrendingUpIcon />, color: '#6366f1' },
          { label: 'Active (30d)', value: engagement.active_users_30d, icon: <PeopleIcon />, color: '#10b981' },
          { label: 'Sessions (7d)', value: system.total_sessions_7d, icon: <BoltIcon />, color: '#0ea5e9' },
          { label: 'AI Usage', value: `${quality.ai_detection.avg_ai_usage ? Math.round(quality.ai_detection.avg_ai_usage) : 0}%`, icon: <SmartToyIcon />, color: '#f97316' },
          { label: 'Errors', value: system.recent_errors, icon: <ErrorOutlineIcon />, color: system.recent_errors > 0 ? '#ef4444' : '#10b981' },
        ].map(({ label, value, icon, color }) => (
          <Grid item xs={6} sm={4} md key={label}>
            <Card sx={{ ...cardSx, '&:hover': { borderColor: `${color}40` }, transition: 'border-color 0.2s' }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box sx={{
                    width: 36, height: 36, borderRadius: 2, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    bgcolor: color + (isDark ? '22' : '12'),
                  }}>
                    {React.cloneElement(icon, { sx: { fontSize: 18, color } })}
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '1.35rem', fontWeight: 700, color: 'text.primary', lineHeight: 1 }}>
                      {value}
                    </Typography>
                    <Typography sx={{ fontSize: '0.68rem', color: muted, mt: 0.2 }}>{label}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ── Activity + CEFR ── */}
      <SectionLabel>Engagement</SectionLabel>
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ ...cardSx, height: '100%' }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: 'text.primary' }}>
                  Daily Active Users
                </Typography>
                <Chip label="Last 30 days" size="small" sx={{
                  fontSize: '0.65rem', fontWeight: 600,
                  bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
                  color: muted,
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
          <Card sx={{ ...cardSx, height: '100%' }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: 'text.primary', mb: 2 }}>
                CEFR Distribution
              </Typography>
              <Box sx={{ height: 160, display: 'flex', justifyContent: 'center' }}>
                {(learning_progress.cefr_distribution || []).length > 0
                  ? <Doughnut data={cefrData} options={doughnutOpts} />
                  : noData()}
              </Box>
              <Stack direction="row" flexWrap="wrap" gap={0.8} sx={{ mt: 2, justifyContent: 'center' }}>
                {(learning_progress.cefr_distribution || []).map((d, i) => (
                  <Chip key={d.level} label={`${d.level}: ${d.count}`} size="small" sx={{
                    fontSize: '0.65rem', fontWeight: 600, height: 20,
                    bgcolor: PHASE_COLORS[i] + (isDark ? '22' : '14'),
                    color: PHASE_COLORS[i],
                  }} />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ── Phase Funnel ── */}
      <SectionLabel>Learning Progress</SectionLabel>
      <Card sx={{ ...cardSx, mb: 4 }}>
        <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: 'text.primary' }}>
              Phase Completion Funnel
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: muted }}>
              {learning_progress.phase_completion.total_users || 0} total students
            </Typography>
          </Stack>
          <Stack spacing={2}>
            {phaseKeys.map((key, i) => {
              const total = learning_progress.phase_completion.total_users || 1
              const value = learning_progress.phase_completion[key] || 0
              const pct = Math.round((value / total) * 100)
              return (
                <Stack key={key} direction="row" alignItems="center" spacing={2.5}>
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: 160, flexShrink: 0 }}>
                    <Box sx={{
                      width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                      bgcolor: PHASE_COLORS[i],
                      boxShadow: `0 0 6px ${PHASE_COLORS[i]}80`,
                    }} />
                    <Box>
                      <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: 'text.primary', lineHeight: 1.2 }}>
                        Phase {i + 1}
                      </Typography>
                      <Typography sx={{ fontSize: '0.62rem', color: muted }}>{PHASE_NAMES[i]}</Typography>
                    </Box>
                  </Stack>
                  <Box sx={{ flex: 1 }}>
                    <LinearProgress
                      variant="determinate" value={pct}
                      sx={{
                        height: 8, borderRadius: 4, bgcolor: trackBg,
                        '& .MuiLinearProgress-bar': { bgcolor: PHASE_COLORS[i], borderRadius: 4 },
                      }}
                    />
                  </Box>
                  <Stack direction="row" alignItems="baseline" spacing={0.5} sx={{ width: 72, flexShrink: 0, justifyContent: 'flex-end' }}>
                    <Typography sx={{ fontSize: '0.92rem', fontWeight: 700, color: PHASE_COLORS[i] }}>
                      {value}
                    </Typography>
                    <Typography sx={{ fontSize: '0.65rem', color: muted }}>
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
      <SectionLabel>Quality & Sessions</SectionLabel>
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ ...cardSx }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: 'text.primary', mb: 2 }}>
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
          <Card sx={{ ...cardSx }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: 'text.primary', mb: 2 }}>
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
          <SectionLabel>Step Difficulty</SectionLabel>
          <Card sx={{ ...cardSx, mb: 4 }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {['Step', 'Attempts', 'Success Rate', 'Status'].map((h, i) => (
                      <TableCell key={h} align={i > 0 ? 'right' : 'left'} sx={{
                        fontSize: '0.65rem', fontWeight: 700, color: muted,
                        textTransform: 'uppercase', letterSpacing: '0.07em',
                        bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                        borderBottom: border, py: 1.3,
                      }}>
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {quality.challenging_steps.map((step, i) => {
                    const sr = step.success_rate
                    const statusColor = sr > 70 ? '#10b981' : sr > 50 ? '#f59e0b' : '#ef4444'
                    const statusLabel = sr > 70 ? 'Good' : sr > 50 ? 'Watch' : 'Critical'
                    const statusBg = sr > 70
                      ? (isDark ? 'rgba(16,185,129,0.15)' : '#f0fdf4')
                      : sr > 50
                        ? (isDark ? 'rgba(245,158,11,0.15)' : '#fffbeb')
                        : (isDark ? 'rgba(239,68,68,0.15)' : '#fef2f2')
                    return (
                      <TableRow key={i} hover sx={{ '&:last-child td': { border: 'none' } }}>
                        <TableCell sx={{ py: 1.4 }}>
                          <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: 'text.primary' }}>
                            {(step.step_id?.replace(/_/g, ' ') || 'UNKNOWN').toUpperCase()}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.8rem', color: muted, py: 1.4 }}>
                          {step.attempts}
                        </TableCell>
                        <TableCell align="right" sx={{ py: 1.4 }}>
                          <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: statusColor }}>
                            {sr}%
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ py: 1.4 }}>
                          <Chip label={statusLabel} size="small" sx={{
                            fontSize: '0.62rem', fontWeight: 700, height: 20,
                            bgcolor: statusBg, color: statusColor,
                            border: `1px solid ${statusColor}30`,
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
      <SectionLabel>Student Alerts</SectionLabel>
      <Grid container spacing={2.5}>
        {[
          {
            title: 'At-Risk Students',
            icon: <WarningAmberIcon sx={{ fontSize: 16, color: '#ef4444' }} />,
            list: risk.at_risk_students,
            color: '#ef4444',
            empty: 'No at-risk students',
            sub: (s) => `Last active: ${s.last_activity ? new Date(s.last_activity).toLocaleDateString('en', { month: 'short', day: 'numeric' }) : 'Unknown'}`,
          },
          {
            title: 'Stuck Students',
            icon: <AccessTimeIcon sx={{ fontSize: 16, color: '#f59e0b' }} />,
            list: risk.stuck_students,
            color: '#f59e0b',
            empty: 'No stuck students',
            sub: (s) => `${(s.step_id?.replace(/_/g, ' ') || 'Unknown').toUpperCase()} · ${s.days_stuck}d stuck`,
          },
        ].map(({ title, icon, list, color, empty, sub }) => (
          <Grid item xs={12} md={6} key={title}>
            <Card sx={cardSx}>
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  {icon}
                  <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: 'text.primary' }}>
                    {title}
                  </Typography>
                  {list.length > 0 && (
                    <Chip label={list.length} size="small" sx={{
                      height: 18, fontSize: '0.62rem', fontWeight: 700,
                      bgcolor: color + (isDark ? '22' : '12'),
                      color,
                    }} />
                  )}
                </Stack>

                {list.length === 0 ? (
                  <Box sx={{
                    py: 3, textAlign: 'center', borderRadius: 2,
                    bgcolor: isDark ? 'rgba(16,185,129,0.07)' : '#f0fdf4',
                    border: `1px solid ${isDark ? 'rgba(16,185,129,0.15)' : '#bbf7d0'}`,
                  }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: 22, color: '#10b981', mb: 0.5 }} />
                    <Typography sx={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>
                      {empty}
                    </Typography>
                  </Box>
                ) : (
                  <Stack spacing={1}>
                    {list.map((s, i) => (
                      <Stack key={i} direction="row" alignItems="center" spacing={1.5} sx={riskRowSx(color)}>
                        <Avatar sx={{
                          width: 30, height: 30,
                          bgcolor: color + (isDark ? '22' : '15'),
                          color, fontSize: '0.72rem', fontWeight: 700,
                        }}>
                          {(s.first_name || '?')[0].toUpperCase()}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: 'text.primary', lineHeight: 1.2 }}>
                            {s.first_name} {s.last_name}
                          </Typography>
                          <Typography sx={{ fontSize: '0.67rem', color: muted, mt: 0.2 }}>
                            {sub(s)}
                          </Typography>
                        </Box>
                        <Tooltip title="View profile">
                          <IconButton size="small" onClick={() => navigate(`/admin/users/${s.id}`)}
                            sx={{ color: muted, '&:hover': { color: '#6366f1' } }}
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
