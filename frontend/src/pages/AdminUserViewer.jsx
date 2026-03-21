import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Typography, Stack, Button, Grid,
  Avatar, Chip, LinearProgress, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ChatIcon from '@mui/icons-material/Chat'
import SchoolIcon from '@mui/icons-material/School'
import EmailIcon from '@mui/icons-material/Email'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import AssessmentIcon from '@mui/icons-material/Assessment'
import RefreshIcon from '@mui/icons-material/Refresh'
import CancelIcon from '@mui/icons-material/Cancel'
import TimelineIcon from '@mui/icons-material/Timeline'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useColorMode } from '../theme.jsx'

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

const PHASES = [
  { n: 1, label: 'Foundation', color: '#6366f1' },
  { n: 2, label: 'Cultural Planning', color: '#0ea5e9' },
  { n: 3, label: 'Vendors & Budget', color: '#10b981' },
  { n: 4, label: 'Marketing', color: '#f97316' },
  { n: 5, label: 'Execution', color: '#ef4444' },
  { n: 6, label: 'Reflection', color: '#8b5cf6' },
]

const LEVEL_COLORS = {
  A1: '#6366f1', A2: '#0ea5e9', B1: '#10b981',
  B2: '#f97316', C1: '#ef4444', C2: '#8b5cf6',
}

export default function AdminUserViewer() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { mode } = useColorMode()
  const D = mode === 'dark' ? DARK : LIGHT

  const [userData, setUserData] = useState(null)
  const [assessments, setAssessments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [progressData, setProgressData] = useState(null)
  const [selectedSummaryRow, setSelectedSummaryRow] = useState(null)

  const loadUserData = async () => {
    setLoading(true)
    setError('')
    try {
      const userRes = await fetch(`/api/admin/users/${userId}/details`, { credentials: 'include' })
      if (!userRes.ok) throw new Error('Failed to load user data')
      const data = await userRes.json()
      if (data.success) {
        setUserData({
          ...data.data.user,
          total_assessments: data.data.stats.total_assessments,
          total_xp: data.data.stats.total_xp,
          latest_level: data.data.stats.latest_level,
          phase2_completed: data.data.progress?.phase2_completed,
          phase3_completed: data.data.progress?.phase3_completed,
          phase4_completed: data.data.progress?.phase4_completed,
          phase5_completed: data.data.progress?.phase5_completed,
          phase6_completed: data.data.progress?.phase6_completed,
        })
        setAssessments(data.data.stats.assessments || [])
      } else {
        throw new Error(data.error || 'Failed to load user data')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadProgressData = async () => {
    try {
      const res = await fetch(`/api/admin/progress/${userId}`, { credentials: 'include' })
      const data = await res.json()
      if (data.success) setProgressData(data.data)
    } catch (e) {
      console.error('Failed to load progress data:', e)
    }
  }

  useEffect(() => { if (userId) { loadUserData(); loadProgressData() } }, [userId])

  const claySx = {
    background: D.cardBg,
    border: `2px solid ${D.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${D.border}`,
    transition: 'all 0.15s ease',
    '&:hover': {
      transform: 'translate(-2px, -2px)',
      boxShadow: `6px 6px 0 ${D.border}`,
    },
  }

  if (loading) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: D.pageBg, minHeight: '100vh' }}>
        <LinearProgress sx={{ borderRadius: 2 }} />
        <Typography sx={{ mt: 2, color: D.muted, fontSize: '0.9rem' }}>Loading student profile...</Typography>
      </Box>
    )
  }

  if (error || !userData) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 }, textAlign: 'center', py: 10, bgcolor: D.pageBg, minHeight: '100vh' }}>
        <Typography sx={{ color: '#C62828', mb: 2, fontWeight: 600 }}>{error || 'User not found'}</Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin/users')}
          sx={{
            color: D.purple.border,
            border: `2px solid ${D.purple.border}`,
            borderRadius: '12px',
            fontWeight: 600,
          }}
        >
          Back to Students
        </Button>
      </Box>
    )
  }

  const displayName = [userData.first_name, userData.last_name].filter(Boolean).join(' ') || userData.username || 'User'
  const initials = (userData.first_name?.[0] || userData.username?.[0] || '?').toUpperCase()
  const level = userData.latest_level
  const levelColor = LEVEL_COLORS[level] || '#6366f1'
  const avgXP = assessments.length > 0
    ? Math.round(assessments.reduce((a, b) => a + (b.xp_earned || 0), 0) / assessments.length)
    : 0
  const phaseCompleted = (n) => n === 1 ? (userData.total_assessments || 0) > 0 : !!userData[`phase${n}_completed`]
  const completedCount = PHASES.filter(p => phaseCompleted(p.n)).length

  // KPI tile color map
  const kpiColors = {
    'Assessments': D.indigo,
    'Avg XP': D.orange,
    'Phases': D.green,
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, mx: 'auto', bgcolor: D.pageBg, minHeight: '100vh' }}>

      {/* ── Top nav ── */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin/users')}
          variant="text"
          sx={{ color: D.muted, fontWeight: 600, fontSize: '0.85rem', '&:hover': { color: D.heading } }}
        >
          All Students
        </Button>
        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title="Refresh">
            <IconButton
              onClick={loadUserData}
              size="small"
              sx={{
                color: D.muted,
                border: `2px solid ${D.border}`,
                borderRadius: '10px',
                boxShadow: `2px 2px 0 ${D.border}`,
                '&:hover': { transform: 'translate(-1px,-1px)', boxShadow: `3px 3px 0 ${D.border}` },
                '&:active': { transform: 'translate(1px,1px)', boxShadow: `1px 1px 0 ${D.border}` },
              }}
            >
              <RefreshIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          <Button
            startIcon={<ChatIcon sx={{ fontSize: 17 }} />}
            onClick={() => navigate(`/admin/chat/${userId}`)}
            sx={{
              bgcolor: D.purple.border,
              color: '#fff',
              border: `2px solid ${D.purple.shadow}`,
              borderRadius: '12px',
              boxShadow: `3px 3px 0 ${D.purple.shadow}`,
              fontWeight: 700,
              fontSize: '0.85rem',
              px: 2.5,
              '&:hover': { transform: 'translate(-1px,-1px)', boxShadow: `4px 4px 0 ${D.purple.shadow}` },
              '&:active': { transform: 'translate(1px,1px)', boxShadow: `2px 2px 0 ${D.purple.shadow}` },
            }}
          >
            Message
          </Button>
        </Stack>
      </Stack>

      {/* ── Hero card ── */}
      <Box sx={{ ...claySx, mb: 3, p: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'center', sm: 'flex-start' }} spacing={3}>

          {/* Avatar */}
          <Box sx={{ position: 'relative', flexShrink: 0 }}>
            <Avatar sx={{
              width: 80, height: 80, fontSize: '1.9rem', fontWeight: 700,
              background: `linear-gradient(135deg, ${levelColor}, ${levelColor}bb)`,
              border: `3px solid ${levelColor}`,
              boxShadow: `4px 4px 0 ${levelColor}`,
            }}>
              {initials}
            </Avatar>
            {level && (
              <Box sx={{
                position: 'absolute', bottom: -6, right: -6,
                bgcolor: levelColor, color: '#fff',
                borderRadius: '6px',
                px: 0.8, py: 0.2,
                fontSize: '0.6rem', fontWeight: 800,
                letterSpacing: '0.05em',
                border: `2px solid ${D.cardBg}`,
                boxShadow: `2px 2px 0 ${levelColor}`,
              }}>
                {level}
              </Box>
            )}
          </Box>

          {/* Name + meta */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" sx={{ mb: 0.5 }}>
              <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, color: D.heading }}>
                {displayName}
              </Typography>
              <Chip
                label={userData.is_admin ? 'Admin' : 'Student'}
                size="small"
                sx={{
                  fontWeight: 700, fontSize: '0.65rem', height: 20,
                  bgcolor: userData.is_admin ? D.red.bg : D.indigo.bg,
                  color: userData.is_admin ? D.red.border : D.indigo.border,
                  border: `1px solid ${userData.is_admin ? D.red.border : D.indigo.border}`,
                }}
              />
            </Stack>
            <Typography sx={{ fontSize: '0.82rem', color: D.muted, mb: 1.5 }}>@{userData.username}</Typography>

            <Stack direction="row" flexWrap="wrap" gap={2.5}>
              {[
                { icon: <EmailIcon sx={{ fontSize: 13 }} />, value: userData.email || '—' },
                { icon: <CalendarTodayIcon sx={{ fontSize: 13 }} />, value: userData.created_at ? `Joined ${new Date(userData.created_at).toLocaleDateString('en', { month: 'short', year: 'numeric' })}` : '—' },
                { icon: <AccessTimeIcon sx={{ fontSize: 13 }} />, value: userData.last_login ? `Active ${new Date(userData.last_login).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}` : 'Never active' },
              ].map(({ icon, value }, i) => (
                <Stack key={i} direction="row" alignItems="center" spacing={0.6}>
                  <Box sx={{ color: D.muted }}>{icon}</Box>
                  <Typography sx={{ fontSize: '0.78rem', color: D.body }}>{value}</Typography>
                </Stack>
              ))}
            </Stack>
          </Box>

          {/* KPI mini-tiles */}
          <Stack direction="row" spacing={1.5} flexShrink={0} flexWrap="wrap" justifyContent="flex-end">
            {[
              { label: 'Assessments', value: userData.total_assessments || 0, icon: <AssessmentIcon />, colorKey: 'indigo' },
              { label: 'Avg XP', value: avgXP, icon: <EmojiEventsIcon />, colorKey: 'orange' },
              { label: 'Level', value: level || '—', icon: <SchoolIcon />, colorKey: null, rawColor: levelColor },
              { label: 'Phases', value: `${completedCount}/6`, icon: <CheckCircleIcon />, colorKey: 'green' },
            ].map(({ label, value, icon, colorKey, rawColor }) => {
              const tileColor = colorKey ? D[colorKey] : { bg: levelColor + '22', border: levelColor, shadow: levelColor }
              return (
                <Box key={label} sx={{
                  textAlign: 'center', px: 1.5, py: 1.2,
                  borderRadius: '14px',
                  border: `2px solid ${tileColor.border}`,
                  boxShadow: `3px 3px 0 ${tileColor.shadow}`,
                  bgcolor: tileColor.bg,
                  minWidth: 68,
                }}>
                  <Box sx={{ color: tileColor.border, mb: 0.4 }}>{React.cloneElement(icon, { sx: { fontSize: 16 } })}</Box>
                  <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: D.heading, lineHeight: 1 }}>
                    {value}
                  </Typography>
                  <Typography sx={{ fontSize: '0.62rem', color: D.muted, mt: 0.3, fontWeight: 600 }}>{label}</Typography>
                </Box>
              )
            })}
          </Stack>

        </Stack>
      </Box>

      {/* ── Phase Progress ── */}
      <Box sx={{ ...claySx, mb: 3, p: 3 }}>
        <Typography sx={{ fontSize: '0.9rem', fontWeight: 800, color: D.heading, mb: 2 }}>
          Phase Progress
        </Typography>
        <Grid container spacing={1.5}>
          {PHASES.map(({ n, label, color }) => {
            const done = phaseCompleted(n)
            return (
              <Grid item xs={12} sm={6} key={n}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box sx={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    bgcolor: done ? color : D.cardBg,
                    border: `2px solid ${done ? color : D.border}`,
                    boxShadow: done ? `2px 2px 0 ${color}` : 'none',
                  }}>
                    {done
                      ? <CheckCircleIcon sx={{ fontSize: 14, color: '#fff' }} />
                      : <Typography sx={{ fontSize: '0.62rem', fontWeight: 700, color: D.muted }}>{n}</Typography>
                    }
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.4 }}>
                      <Typography sx={{ fontSize: '0.78rem', fontWeight: done ? 700 : 500, color: done ? D.heading : D.muted }}>
                        {label}
                      </Typography>
                      <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: done ? color : D.muted }}>
                        {done ? 'Done' : '—'}
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate" value={done ? 100 : 0}
                      sx={{
                        height: 5, borderRadius: 3,
                        bgcolor: D.border + '33',
                        '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 3 },
                      }}
                    />
                  </Box>
                </Stack>
              </Grid>
            )
          })}
        </Grid>
      </Box>

      {/* ── Assessment History ── */}
      <Box sx={{ ...claySx, mb: 3 }}>
        <Box sx={{ p: 3, pb: 1.5 }}>
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 800, color: D.heading }}>
            Assessment History
          </Typography>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {['Date', 'Level', 'XP Earned', 'Duration'].map(h => (
                  <TableCell key={h} sx={{
                    fontSize: '0.65rem', fontWeight: 700, color: D.muted,
                    textTransform: 'uppercase', letterSpacing: '0.07em',
                    bgcolor: D.indigo.bg,
                    borderBottom: `2px solid ${D.border}`,
                    py: 1.2,
                  }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {assessments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: 'center', py: 5, border: 'none' }}>
                    <Typography sx={{ color: D.muted, fontSize: '0.85rem' }}>No assessments yet</Typography>
                  </TableCell>
                </TableRow>
              ) : assessments.map((a, i) => {
                const xp = a.xp_earned || 0
                const xpColor = xp >= 800 ? '#10b981' : xp >= 400 ? '#f97316' : '#ef4444'
                const lvl = a.overall_level
                const lvlColor = LEVEL_COLORS[lvl] || '#6366f1'
                return (
                  <TableRow
                    key={i}
                    sx={{
                      '&:last-child td': { border: 'none' },
                      '&:hover': { bgcolor: D.indigo.bg },
                      transition: 'background 0.12s',
                    }}
                  >
                    <TableCell sx={{ fontSize: '0.82rem', color: D.body, py: 1.3 }}>
                      {a.completed_at ? new Date(a.completed_at).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                    </TableCell>
                    <TableCell sx={{ py: 1.3 }}>
                      {lvl ? (
                        <Chip label={lvl} size="small" sx={{
                          fontSize: '0.65rem', fontWeight: 700, height: 20,
                          bgcolor: lvlColor + '22', color: lvlColor,
                          border: `1px solid ${lvlColor}`,
                        }} />
                      ) : '—'}
                    </TableCell>
                    <TableCell sx={{ py: 1.3 }}>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: xpColor }}>+{xp} XP</Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.82rem', color: D.muted, py: 1.3 }}>
                      {a.duration_minutes ? `${a.duration_minutes} min` : '—'}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* ── RESPONSE HISTORY ── */}
      <Box sx={{ ...claySx, mt: 3, p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2.5 }}>
          <TimelineIcon sx={{ color: D.purple.border }} />
          <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: D.heading }}>Response History</Typography>
          <Box sx={{
            ml: 'auto',
            bgcolor: D.indigo.bg,
            border: `1px solid ${D.indigo.border}`,
            borderRadius: '10px',
            px: 1.2, py: 0.3,
            fontSize: '0.72rem', fontWeight: 700, color: D.indigo.border,
          }}>
            {progressData?.summary?.length || 0} interactions
          </Box>
        </Stack>

        {!progressData?.summary?.length ? (
          <Typography sx={{ color: D.muted, fontSize: '0.87rem', py: 3, textAlign: 'center' }}>
            No responses recorded yet.
          </Typography>
        ) : (
          <>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {['Phase', 'Step', 'Interaction', 'Context', 'Responses', 'Correct', 'Score', 'Started', 'Finished', ''].map(h => (
                      <TableCell key={h} sx={{
                        fontWeight: 700, fontSize: '0.65rem', color: D.muted,
                        textTransform: 'uppercase', letterSpacing: '0.07em',
                        bgcolor: D.indigo.bg,
                        borderBottom: `2px solid ${D.border}`,
                        pb: 1,
                      }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {progressData.summary.map((row, i) => {
                    const isSelected = selectedSummaryRow &&
                      selectedSummaryRow.phase === row.phase &&
                      selectedSummaryRow.step === row.step &&
                      selectedSummaryRow.interaction === row.interaction &&
                      selectedSummaryRow.context === row.context
                    return (
                      <TableRow
                        key={i}
                        onClick={() => setSelectedSummaryRow(isSelected ? null : row)}
                        sx={{
                          cursor: 'pointer',
                          bgcolor: isSelected ? D.indigo.bg : 'transparent',
                          '&:hover': { bgcolor: D.indigo.bg },
                          '&:last-child td': { border: 'none' },
                          transition: 'background 0.12s',
                        }}
                      >
                        <TableCell sx={{ fontSize: '0.82rem', color: D.body }}>Phase {row.phase}{row.subphase ? ` SP${row.subphase}` : ''}</TableCell>
                        <TableCell sx={{ fontSize: '0.82rem', color: D.body }}>Step {row.step}</TableCell>
                        <TableCell sx={{ fontSize: '0.82rem', color: D.body }}>Int {row.interaction}</TableCell>
                        <TableCell>
                          <Chip
                            label={row.context || 'main'}
                            size="small"
                            sx={{
                              fontSize: '0.7rem',
                              bgcolor: row.context === 'main' ? D.blue.bg : D.yellow.bg,
                              color: row.context === 'main' ? D.blue.border : D.yellow.border,
                              border: `1px solid ${row.context === 'main' ? D.blue.border : D.yellow.border}`,
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.82rem', color: D.body }}>{row.response_count}</TableCell>
                        <TableCell sx={{ fontSize: '0.82rem', color: D.body }}>{row.correct_count ?? '—'}</TableCell>
                        <TableCell sx={{ fontSize: '0.82rem', fontWeight: 700, color: D.heading }}>{row.total_score != null ? row.total_score.toFixed(1) : '—'}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem', color: D.muted }}>{row.started_at ? new Date(row.started_at).toLocaleTimeString() : '—'}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem', color: D.muted }}>
                          {row.completed_at
                            ? new Date(row.completed_at).toLocaleTimeString()
                            : <Chip label="In progress" size="small" sx={{ fontSize: '0.7rem', bgcolor: D.yellow.bg, color: D.yellow.border, border: `1px solid ${D.yellow.border}` }} />
                          }
                        </TableCell>
                        <TableCell>
                          <ExpandMoreIcon sx={{
                            fontSize: 18, color: D.muted,
                            transform: isSelected ? 'rotate(180deg)' : 'none',
                            transition: '0.2s',
                          }} />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Timeline drill-down */}
            {selectedSummaryRow && (
              <Box sx={{
                mt: 2, p: 2.5,
                borderRadius: '16px',
                bgcolor: D.purple.bg,
                border: `2px solid ${D.purple.border}`,
                boxShadow: `3px 3px 0 ${D.purple.shadow}`,
              }}>
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 800, color: D.purple.border }}>
                  Phase {selectedSummaryRow.phase} › Step {selectedSummaryRow.step} › Interaction {selectedSummaryRow.interaction} ({selectedSummaryRow.context}) — Full Timeline
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        {['Time', 'Type', 'Prompt', 'Answer', 'Result', 'Score'].map(h => (
                          <TableCell key={h} sx={{
                            fontWeight: 700, fontSize: '0.65rem', color: D.muted,
                            textTransform: 'uppercase', letterSpacing: '0.07em',
                            border: 'none', pb: 0.5,
                          }}>{h}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {progressData.timeline
                        .filter(r =>
                          r.phase === selectedSummaryRow.phase &&
                          r.step === selectedSummaryRow.step &&
                          r.interaction === selectedSummaryRow.interaction &&
                          r.context === selectedSummaryRow.context
                        )
                        .map((r, i) => (
                          <TableRow key={i} sx={{ '&:last-child td': { border: 'none' } }}>
                            <TableCell sx={{ fontSize: '0.75rem', color: D.muted, whiteSpace: 'nowrap' }}>
                              {new Date(r.timestamp).toLocaleTimeString()}
                            </TableCell>
                            <TableCell>
                              <Chip label={r.item_type} size="small" sx={{ fontSize: '0.7rem', bgcolor: D.indigo.bg, color: D.indigo.border, border: `1px solid ${D.indigo.border}` }} />
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.78rem', color: D.body, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.prompt || '—'}</TableCell>
                            <TableCell sx={{ fontSize: '0.78rem', color: D.body, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.response || '—'}</TableCell>
                            <TableCell>
                              {r.is_correct === true && <CheckCircleIcon sx={{ fontSize: 16, color: '#10b981' }} />}
                              {r.is_correct === false && <CancelIcon sx={{ fontSize: 16, color: '#ef4444' }} />}
                              {r.is_correct === null && <Typography sx={{ fontSize: '0.75rem', color: D.muted }}>—</Typography>}
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.82rem', fontWeight: 700, color: D.heading }}>{r.score ?? '—'}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </>
        )}
      </Box>

    </Box>
  )
}
