import React, { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Box, Typography, Stack, TextField, InputAdornment, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Avatar, IconButton, LinearProgress, Alert, Button, Paper, useTheme
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import VisibilityIcon from '@mui/icons-material/Visibility'
import PeopleIcon from '@mui/icons-material/People'
import RefreshIcon from '@mui/icons-material/Refresh'

const PHASE_COLORS = ['#6366f1', '#0ea5e9', '#10b981', '#f97316', '#ef4444', '#8b5cf6']

export default function AdminUserList() {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const loadUsers = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/users', { credentials: 'include' })
      if (!res.ok) throw new Error('Failed to load users')
      const data = await res.json()
      if (data.success) setUsers(data.data.users || [])
      else throw new Error(data.error || 'Failed')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadUsers() }, [])

  const filtered = users.filter(u => {
    if (!search) return !u.is_admin
    const q = search.toLowerCase()
    return !u.is_admin && (
      (u.first_name || '').toLowerCase().includes(q) ||
      (u.last_name || '').toLowerCase().includes(q) ||
      (u.username || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q)
    )
  })

  const getPhaseProgress = (user) => [
    !!(user.best_level || user.latest_level),
    user.phase2_percentage > 0,
    user.phase3_completed,
    user.phase4_completed,
    user.phase5_completed,
    user.phase6_completed,
  ]

  const border = isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0'
  const muted = theme.palette.text.secondary
  const headBg = isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc'
  const searchBg = isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc'
  const searchBorder = isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'

  if (loading) return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <LinearProgress sx={{ borderRadius: 1 }} />
    </Box>
  )

  if (error) return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      <Button onClick={loadUsers} startIcon={<RefreshIcon />}>Retry</Button>
    </Box>
  )

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <PeopleIcon sx={{ fontSize: 24, color: '#10b981' }} />
          <Typography sx={{ fontSize: '1.4rem', fontWeight: 700, color: 'text.primary' }}>
            Students
          </Typography>
          <Chip label={filtered.length} size="small" sx={{
            fontWeight: 700, fontSize: '0.7rem',
            bgcolor: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9',
            color: muted,
          }} />
        </Stack>
        <IconButton onClick={loadUsers} sx={{ color: muted, '&:hover': { color: '#6366f1' } }}>
          <RefreshIcon />
        </IconButton>
      </Stack>

      {/* Search */}
      <TextField
        fullWidth size="small"
        placeholder="Search by name, username, or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: muted, fontSize: 18 }} />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 2.5,
          '& .MuiOutlinedInput-root': {
            bgcolor: searchBg,
            '& fieldset': { borderColor: searchBorder },
            '&:hover fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#cbd5e1' },
          },
        }}
      />

      {/* Table */}
      <Paper sx={{ border, overflow: 'hidden', boxShadow: 'none', backgroundImage: 'none', bgcolor: isDark ? theme.palette.background.paper : '#ffffff' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: headBg }}>
                {['Student', 'Level', 'Phase Progress', 'Last Active', ''].map((h, i) => (
                  <TableCell key={i} sx={{
                    fontWeight: 700, color: muted, fontSize: '0.7rem',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                    borderBottom: border,
                    width: i === 4 ? 52 : undefined,
                  }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((user) => {
                const phases = getPhaseProgress(user)
                const hasLevel = !!(user.best_level || user.latest_level)
                return (
                  <TableRow key={user.user_id} hover sx={{ '&:last-child td': { border: 0 } }}>
                    <TableCell sx={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9' }}>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Avatar sx={{
                          width: 32, height: 32,
                          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                          fontSize: '0.78rem', fontWeight: 700,
                        }}>
                          {(user.first_name || user.username || '?')[0].toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: 'text.primary', lineHeight: 1.2 }}>
                            {user.first_name} {user.last_name}
                          </Typography>
                          <Typography sx={{ fontSize: '0.72rem', color: muted }}>
                            @{user.username}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9' }}>
                      <Chip
                        label={user.best_level || user.latest_level || 'N/A'}
                        size="small"
                        sx={{
                          fontWeight: 700, fontSize: '0.68rem', height: 20,
                          bgcolor: hasLevel ? '#6366f1' + (isDark ? '25' : '12') : (isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'),
                          color: hasLevel ? '#6366f1' : muted,
                          border: `1px solid ${hasLevel ? '#6366f130' : (isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0')}`,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9' }}>
                      <Stack direction="row" spacing={0.4}>
                        {phases.map((done, i) => (
                          <Box key={i} title={`Phase ${i + 1}: ${done ? 'Completed' : 'Not completed'}`} sx={{
                            width: 20, height: 5, borderRadius: 0.5,
                            bgcolor: done ? PHASE_COLORS[i] : (isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'),
                            transition: 'all 0.2s',
                          }} />
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9' }}>
                      <Typography sx={{ fontSize: '0.78rem', color: muted }}>
                        {user.last_login ? new Date(user.last_login).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Never'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9' }}>
                      <IconButton
                        component={RouterLink} to={`/admin/users/${user.user_id}`}
                        size="small"
                        sx={{ color: muted, '&:hover': { color: '#6366f1', bgcolor: '#6366f110' } }}
                      >
                        <VisibilityIcon sx={{ fontSize: 17 }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 6, border: 'none' }}>
                    <Typography sx={{ color: muted, fontSize: '0.85rem' }}>
                      {search ? 'No students match your search' : 'No students registered yet'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}
