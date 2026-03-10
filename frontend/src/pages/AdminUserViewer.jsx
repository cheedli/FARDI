import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Typography, Stack, Button, Grid, Card, CardContent,
  Avatar, Chip, Divider, LinearProgress, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, useTheme, IconButton, Tooltip
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
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

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

  const border = isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #f1f5f9'
  const cardBg = isDark ? theme.palette.background.paper : '#ffffff'
  const muted = isDark ? theme.palette.text.secondary : '#94a3b8'
  const subtle = isDark ? theme.palette.text.secondary : '#64748b'
  const cardSx = { border, borderRadius: 3, boxShadow: 'none', bgcolor: cardBg, backgroundImage: 'none' }

  if (loading) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <LinearProgress sx={{ borderRadius: 2 }} />
        <Typography sx={{ mt: 2, color: muted, fontSize: '0.9rem' }}>Loading student profile...</Typography>
      </Box>
    )
  }

  if (error || !userData) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 }, textAlign: 'center', py: 10 }}>
        <Typography sx={{ color: 'error.main', mb: 2, fontWeight: 600 }}>{error || 'User not found'}</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/users')} variant="outlined">
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

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, mx: 'auto' }}>

      {/* ── Top nav ── */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin/users')}
          variant="text"
          sx={{ color: muted, fontWeight: 500, fontSize: '0.85rem', '&:hover': { color: 'text.primary' } }}
        >
          All Students
        </Button>
        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title="Refresh">
            <IconButton onClick={loadUserData} size="small" sx={{ color: muted }}>
              <RefreshIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          <Button
            startIcon={<ChatIcon sx={{ fontSize: 17 }} />}
            onClick={() => navigate(`/admin/chat/${userId}`)}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white', fontWeight: 600, fontSize: '0.85rem',
              borderRadius: 1, px: 2.5, boxShadow: 'none',
              '&:hover': { background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', boxShadow: '0 4px 14px rgba(99,102,241,0.4)' },
            }}
          >
            Message
          </Button>
        </Stack>
      </Stack>

      {/* ── Hero card: avatar + info + KPIs in one row ── */}
      <Card sx={{ ...cardSx, mb: 3 }}>
        <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'center', sm: 'flex-start' }} spacing={3}>

            {/* Avatar */}
            <Box sx={{ position: 'relative', flexShrink: 0 }}>
              <Avatar sx={{
                width: 72, height: 72, fontSize: '1.7rem', fontWeight: 700,
                background: `linear-gradient(135deg, ${levelColor}, ${levelColor}bb)`,
                boxShadow: `0 4px 16px ${levelColor}40`,
              }}>
                {initials}
              </Avatar>
              {level && (
                <Box sx={{
                  position: 'absolute', bottom: -4, right: -4,
                  bgcolor: levelColor, color: 'white', borderRadius: 1.5,
                  px: 0.7, py: 0.15, fontSize: '0.6rem', fontWeight: 800,
                  letterSpacing: '0.05em', boxShadow: `0 2px 6px ${levelColor}50`,
                }}>
                  {level}
                </Box>
              )}
            </Box>

            {/* Name + meta */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" sx={{ mb: 0.5 }}>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: 'text.primary' }}>
                  {displayName}
                </Typography>
                <Chip
                  label={userData.is_admin ? 'Admin' : 'Student'}
                  size="small"
                  sx={{
                    fontWeight: 700, fontSize: '0.65rem', height: 20,
                    bgcolor: userData.is_admin ? 'rgba(239,68,68,0.12)' : 'rgba(99,102,241,0.12)',
                    color: userData.is_admin ? '#ef4444' : '#6366f1',
                    border: `1px solid ${userData.is_admin ? 'rgba(239,68,68,0.2)' : 'rgba(99,102,241,0.2)'}`,
                  }}
                />
              </Stack>
              <Typography sx={{ fontSize: '0.82rem', color: muted, mb: 1.5 }}>@{userData.username}</Typography>

              <Stack direction="row" flexWrap="wrap" gap={2.5}>
                {[
                  { icon: <EmailIcon sx={{ fontSize: 13 }} />, value: userData.email || '—' },
                  { icon: <CalendarTodayIcon sx={{ fontSize: 13 }} />, value: userData.created_at ? `Joined ${new Date(userData.created_at).toLocaleDateString('en', { month: 'short', year: 'numeric' })}` : '—' },
                  { icon: <AccessTimeIcon sx={{ fontSize: 13 }} />, value: userData.last_login ? `Active ${new Date(userData.last_login).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}` : 'Never active' },
                ].map(({ icon, value }, i) => (
                  <Stack key={i} direction="row" alignItems="center" spacing={0.6}>
                    <Box sx={{ color: muted }}>{icon}</Box>
                    <Typography sx={{ fontSize: '0.78rem', color: subtle }}>{value}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>

            {/* KPI mini-tiles */}
            <Stack direction="row" spacing={1.5} flexShrink={0} flexWrap="wrap" justifyContent="flex-end">
              {[
                { label: 'Assessments', value: userData.total_assessments || 0, icon: <AssessmentIcon />, color: '#6366f1' },
                { label: 'Avg XP', value: avgXP, icon: <EmojiEventsIcon />, color: '#f97316' },
                { label: 'Level', value: level || '—', icon: <SchoolIcon />, color: levelColor },
                { label: 'Phases', value: `${completedCount}/6`, icon: <CheckCircleIcon />, color: '#10b981' },
              ].map(({ label, value, icon, color }) => (
                <Box key={label} sx={{
                  textAlign: 'center', px: 1.5, py: 1.2,
                  borderRadius: 1, border,
                  minWidth: 64,
                  bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                }}>
                  <Box sx={{ color, mb: 0.4 }}>{React.cloneElement(icon, { sx: { fontSize: 16 } })}</Box>
                  <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: 'text.primary', lineHeight: 1 }}>
                    {value}
                  </Typography>
                  <Typography sx={{ fontSize: '0.62rem', color: muted, mt: 0.3 }}>{label}</Typography>
                </Box>
              ))}
            </Stack>

          </Stack>
        </CardContent>
      </Card>

      {/* ── Phase Progress ── */}
      <Card sx={{ ...cardSx, mb: 3 }}>
        <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
          <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: 'text.primary', mb: 2 }}>
            Phase Progress
          </Typography>
          <Grid container spacing={1.5}>
            {PHASES.map(({ n, label, color }) => {
              const done = phaseCompleted(n)
              return (
                <Grid item xs={12} sm={6} key={n}>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box sx={{
                      width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      bgcolor: done ? color : (isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9'),
                      border: `2px solid ${done ? color : (isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0')}`,
                    }}>
                      {done
                        ? <CheckCircleIcon sx={{ fontSize: 13, color: 'white' }} />
                        : <Typography sx={{ fontSize: '0.62rem', fontWeight: 700, color: muted }}>{n}</Typography>
                      }
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.4 }}>
                        <Typography sx={{ fontSize: '0.78rem', fontWeight: done ? 600 : 400, color: done ? 'text.primary' : muted }}>
                          {label}
                        </Typography>
                        <Typography sx={{ fontSize: '0.68rem', fontWeight: 600, color: done ? color : muted }}>
                          {done ? 'Done' : '—'}
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate" value={done ? 100 : 0}
                        sx={{
                          height: 4, borderRadius: 2,
                          bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
                          '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 2 },
                        }}
                      />
                    </Box>
                  </Stack>
                </Grid>
              )
            })}
          </Grid>
        </CardContent>
      </Card>

      {/* ── Assessment History ── */}
      <Card sx={cardSx}>
        <CardContent sx={{ p: 3, pb: '12px !important' }}>
          <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: 'text.primary' }}>
            Assessment History
          </Typography>
        </CardContent>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {['Date', 'Level', 'XP Earned', 'Duration'].map(h => (
                  <TableCell key={h} sx={{
                    fontSize: '0.65rem', fontWeight: 700, color: muted,
                    textTransform: 'uppercase', letterSpacing: '0.07em',
                    bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                    borderBottom: border, py: 1.2,
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
                    <Typography sx={{ color: muted, fontSize: '0.85rem' }}>No assessments yet</Typography>
                  </TableCell>
                </TableRow>
              ) : assessments.map((a, i) => {
                const xp = a.xp_earned || 0
                const xpColor = xp >= 800 ? '#10b981' : xp >= 400 ? '#f97316' : '#ef4444'
                const lvl = a.overall_level
                const lvlColor = LEVEL_COLORS[lvl] || '#6366f1'
                return (
                  <TableRow key={i} hover sx={{ '&:last-child td': { border: 'none' } }}>
                    <TableCell sx={{ fontSize: '0.82rem', color: 'text.primary', py: 1.3 }}>
                      {a.completed_at ? new Date(a.completed_at).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                    </TableCell>
                    <TableCell sx={{ py: 1.3 }}>
                      {lvl ? (
                        <Chip label={lvl} size="small" sx={{
                          fontSize: '0.65rem', fontWeight: 700, height: 18,
                          bgcolor: lvlColor + (isDark ? '25' : '15'), color: lvlColor,
                        }} />
                      ) : '—'}
                    </TableCell>
                    <TableCell sx={{ py: 1.3 }}>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: xpColor }}>+{xp} XP</Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.82rem', color: subtle, py: 1.3 }}>
                      {a.duration_minutes ? `${a.duration_minutes} min` : '—'}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* ── RESPONSE HISTORY ── */}
      <Card sx={{ ...cardSx, mt: 3 }}>
        <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2.5 }}>
            <TimelineIcon sx={{ color: '#8b5cf6' }} />
            <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>Response History</Typography>
            <Chip label={`${progressData?.summary?.length || 0} interactions`} size="small" sx={{ ml: 'auto', bgcolor: isDark ? '#1e293b' : '#f1f5f9' }} />
          </Stack>

          {!progressData?.summary?.length ? (
            <Typography sx={{ color: muted, fontSize: '0.87rem', py: 3, textAlign: 'center' }}>
              No responses recorded yet.
            </Typography>
          ) : (
            <>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      {['Phase', 'Step', 'Interaction', 'Context', 'Responses', 'Correct', 'Score', 'Started', 'Finished', ''].map(h => (
                        <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.75rem', color: muted, textTransform: 'uppercase', letterSpacing: '0.05em', border: 'none', pb: 1 }}>{h}</TableCell>
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
                          hover
                          onClick={() => setSelectedSummaryRow(isSelected ? null : row)}
                          sx={{ cursor: 'pointer', bgcolor: isSelected ? (isDark ? '#1e293b' : '#f8faff') : 'transparent', '&:last-child td': { border: 'none' } }}
                        >
                          <TableCell sx={{ fontSize: '0.82rem' }}>Phase {row.phase}{row.subphase ? ` SP${row.subphase}` : ''}</TableCell>
                          <TableCell sx={{ fontSize: '0.82rem' }}>Step {row.step}</TableCell>
                          <TableCell sx={{ fontSize: '0.82rem' }}>Int {row.interaction}</TableCell>
                          <TableCell><Chip label={row.context || 'main'} size="small" sx={{ fontSize: '0.7rem', bgcolor: row.context === 'main' ? '#e0f2fe' : '#fef3c7', color: row.context === 'main' ? '#0369a1' : '#92400e' }} /></TableCell>
                          <TableCell sx={{ fontSize: '0.82rem' }}>{row.response_count}</TableCell>
                          <TableCell sx={{ fontSize: '0.82rem' }}>{row.correct_count ?? '—'}</TableCell>
                          <TableCell sx={{ fontSize: '0.82rem', fontWeight: 600 }}>{row.total_score != null ? row.total_score.toFixed(1) : '—'}</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem', color: muted }}>{row.started_at ? new Date(row.started_at).toLocaleTimeString() : '—'}</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem', color: muted }}>{row.completed_at ? new Date(row.completed_at).toLocaleTimeString() : <Chip label="In progress" size="small" color="warning" sx={{ fontSize: '0.7rem' }} />}</TableCell>
                          <TableCell><ExpandMoreIcon sx={{ fontSize: 18, color: muted, transform: isSelected ? 'rotate(180deg)' : 'none', transition: '0.2s' }} /></TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Timeline drill-down */}
              {selectedSummaryRow && (
                <Box sx={{ mt: 2, p: 2, borderRadius: 2, bgcolor: isDark ? '#0f172a' : '#f8faff', border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}` }}>
                  <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, color: '#8b5cf6' }}>
                    Phase {selectedSummaryRow.phase} › Step {selectedSummaryRow.step} › Interaction {selectedSummaryRow.interaction} ({selectedSummaryRow.context}) — Full Timeline
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          {['Time', 'Type', 'Prompt', 'Answer', 'Result', 'Score'].map(h => (
                            <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.72rem', color: muted, textTransform: 'uppercase', letterSpacing: '0.05em', border: 'none', pb: 0.5 }}>{h}</TableCell>
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
                              <TableCell sx={{ fontSize: '0.75rem', color: muted, whiteSpace: 'nowrap' }}>
                                {new Date(r.timestamp).toLocaleTimeString()}
                              </TableCell>
                              <TableCell><Chip label={r.item_type} size="small" sx={{ fontSize: '0.7rem' }} /></TableCell>
                              <TableCell sx={{ fontSize: '0.78rem', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.prompt || '—'}</TableCell>
                              <TableCell sx={{ fontSize: '0.78rem', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.response || '—'}</TableCell>
                              <TableCell>
                                {r.is_correct === true && <CheckCircleIcon color="success" sx={{ fontSize: 16 }} />}
                                {r.is_correct === false && <CancelIcon color="error" sx={{ fontSize: 16 }} />}
                                {r.is_correct === null && <Typography sx={{ fontSize: '0.75rem', color: muted }}>—</Typography>}
                              </TableCell>
                              <TableCell sx={{ fontSize: '0.82rem', fontWeight: 600 }}>{r.score ?? '—'}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>

    </Box>
  )
}
