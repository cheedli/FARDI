import React, { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Box, Typography, Stack, TextField, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Avatar, IconButton, LinearProgress, Alert, Button
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import VisibilityIcon from '@mui/icons-material/Visibility'
import PeopleIcon from '@mui/icons-material/People'
import RefreshIcon from '@mui/icons-material/Refresh'
import { useColorMode } from '../theme.jsx'

const LIGHT = {
  pageBg: '#FFFDE7',
  cardBg: '#ffffff',
  heading: '#1A237E',
  body: '#37474F',
  muted: '#78909C',
  border: '#1A237E',
  chatOutBg: '#7B1FA2',
  chatOutText: '#ffffff',
  chatInBg: '#F3E5F5',
  chatInText: '#37474F',
  chatInBorder: '#7B1FA2',
  sidebarBg: '#ffffff',
  inputBg: '#ffffff',
  purple: { bg: '#F3E5F5', border: '#7B1FA2', shadow: '#7B1FA2' },
  blue:   { bg: '#E3F2FD', border: '#1565C0', shadow: '#1565C0' },
  green:  { bg: '#E8F5E9', border: '#2E7D32', shadow: '#2E7D32' },
  indigo: { bg: '#E8EAF6', border: '#283593', shadow: '#283593' },
}
const DARK = {
  pageBg: '#0F0F1A',
  cardBg: '#1A1A2E',
  heading: '#E8EAFF',
  body: '#B0BEC5',
  muted: '#607D8B',
  border: '#3A3A5C',
  chatOutBg: '#6A1B9A',
  chatOutText: '#ffffff',
  chatInBg: '#1E0A2E',
  chatInText: '#B0BEC5',
  chatInBorder: '#9C27B0',
  sidebarBg: '#1A1A2E',
  inputBg: '#1A1A2E',
  purple: { bg: '#1A0A2E', border: '#CE93D8', shadow: '#9C27B0' },
  blue:   { bg: '#0A1A2E', border: '#90CAF9', shadow: '#1565C0' },
  green:  { bg: '#0A1A0A', border: '#A5D6A7', shadow: '#2E7D32' },
  indigo: { bg: '#0A0E1A', border: '#9FA8DA', shadow: '#283593' },
}

const PHASE_COLORS = ['#6366f1', '#0ea5e9', '#10b981', '#f97316', '#ef4444', '#8b5cf6']

const CEFR_COLORS = {
  A1: { bg: '#E8F5E9', border: '#2E7D32', text: '#1B5E20' },
  A2: { bg: '#E8F5E9', border: '#388E3C', text: '#2E7D32' },
  B1: { bg: '#E3F2FD', border: '#1565C0', text: '#0D47A1' },
  B2: { bg: '#E3F2FD', border: '#1976D2', text: '#1565C0' },
  C1: { bg: '#F3E5F5', border: '#7B1FA2', text: '#4A148C' },
  C2: { bg: '#F3E5F5', border: '#8E24AA', text: '#6A1B9A' },
}
const CEFR_COLORS_DARK = {
  A1: { bg: '#0A1A0A', border: '#A5D6A7', text: '#A5D6A7' },
  A2: { bg: '#0A1A0A', border: '#81C784', text: '#81C784' },
  B1: { bg: '#0A1A2E', border: '#90CAF9', text: '#90CAF9' },
  B2: { bg: '#0A1A2E', border: '#64B5F6', text: '#64B5F6' },
  C1: { bg: '#1A0A2E', border: '#CE93D8', text: '#CE93D8' },
  C2: { bg: '#1A0A2E', border: '#BA68C8', text: '#BA68C8' },
}

export default function AdminUserList() {
  const { mode } = useColorMode()
  const D = mode === 'dark' ? DARK : LIGHT

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

  const clayCard = {
    background: D.cardBg,
    border: `2px solid ${D.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${D.border}`,
  }

  if (loading) return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: D.pageBg, minHeight: '100vh' }}>
      <LinearProgress sx={{ borderRadius: 1 }} />
    </Box>
  )

  if (error) return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: D.pageBg, minHeight: '100vh' }}>
      <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      <Button
        onClick={loadUsers}
        startIcon={<RefreshIcon />}
        sx={{
          border: `2px solid ${D.border}`,
          borderRadius: '12px',
          boxShadow: `3px 3px 0 ${D.border}`,
          color: D.body,
          '&:hover': { bgcolor: D.purple.bg },
        }}
      >
        Retry
      </Button>
    </Box>
  )

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: D.pageBg, minHeight: '100vh' }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <PeopleIcon sx={{ fontSize: 26, color: D.green.border }} />
          <Typography sx={{ fontSize: '1.4rem', fontWeight: 700, color: D.heading }}>
            Students
          </Typography>
          {/* Count chip — clay green */}
          <Box sx={{
            px: 1.2, py: 0.2,
            bgcolor: D.green.bg,
            border: `2px solid ${D.green.border}`,
            borderRadius: '12px',
            boxShadow: `2px 2px 0 ${D.green.shadow}`,
          }}>
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: D.green.border }}>
              {filtered.length}
            </Typography>
          </Box>
        </Stack>
        {/* Refresh — clay icon button */}
        <IconButton
          onClick={loadUsers}
          sx={{
            color: D.muted,
            border: `2px solid ${D.border}`,
            borderRadius: '12px',
            boxShadow: `3px 3px 0 ${D.border}`,
            '&:hover': {
              color: D.heading,
              bgcolor: D.purple.bg,
              transform: 'translate(-1px, -1px)',
              boxShadow: `4px 4px 0 ${D.border}`,
            },
            transition: 'all 0.15s',
          }}
        >
          <RefreshIcon />
        </IconButton>
      </Stack>

      {/* Search field */}
      <TextField
        fullWidth size="small"
        placeholder="Search by name, username, or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: D.muted, fontSize: 18 }} />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 2.5,
          '& .MuiOutlinedInput-root': {
            bgcolor: D.cardBg,
            borderRadius: '12px',
            '& fieldset': { borderColor: D.border, borderWidth: '2px' },
            '&:hover fieldset': { borderColor: D.border },
            '&.Mui-focused fieldset': { borderColor: D.border, borderWidth: '2px' },
          },
        }}
      />

      {/* Table — clay card */}
      <Box sx={{ ...clayCard, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: D.pageBg }}>
                {['Student', 'Level', 'Phase Progress', 'Last Active', ''].map((h, i) => (
                  <TableCell key={i} sx={{
                    fontWeight: 700,
                    color: D.muted,
                    fontSize: '0.68rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    borderBottom: `2px solid ${D.border}`,
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
                const levelKey = user.best_level || user.latest_level
                const hasLevel = !!levelKey
                const cefrColors = (mode === 'dark' ? CEFR_COLORS_DARK : CEFR_COLORS)[levelKey] || null

                return (
                  <TableRow
                    key={user.user_id}
                    sx={{
                      '&:last-child td': { border: 0 },
                      '&:hover': { bgcolor: D.purple.bg },
                      transition: 'background 0.15s',
                    }}
                  >
                    {/* Student */}
                    <TableCell sx={{ borderColor: D.border, borderBottomWidth: '1px' }}>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Avatar sx={{
                          width: 34, height: 34,
                          background: 'linear-gradient(135deg, #7B1FA2, #CE93D8)',
                          fontSize: '0.78rem', fontWeight: 700,
                          border: `2px solid #7B1FA2`,
                          boxShadow: `2px 2px 0 #4A148C`,
                        }}>
                          {(user.first_name || user.username || '?')[0].toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: D.body, lineHeight: 1.2 }}>
                            {user.first_name} {user.last_name}
                          </Typography>
                          <Typography sx={{ fontSize: '0.72rem', color: D.muted }}>
                            @{user.username}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    {/* CEFR Level — clay chip */}
                    <TableCell sx={{ borderColor: D.border, borderBottomWidth: '1px' }}>
                      {cefrColors ? (
                        <Box sx={{
                          display: 'inline-flex',
                          px: 1.2, py: 0.3,
                          bgcolor: cefrColors.bg,
                          border: `2px solid ${cefrColors.border}`,
                          borderRadius: '10px',
                          boxShadow: `2px 2px 0 ${cefrColors.border}`,
                        }}>
                          <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: cefrColors.text }}>
                            {levelKey}
                          </Typography>
                        </Box>
                      ) : (
                        <Box sx={{
                          display: 'inline-flex',
                          px: 1.2, py: 0.3,
                          bgcolor: D.pageBg,
                          border: `2px solid ${D.border}`,
                          borderRadius: '10px',
                          boxShadow: `2px 2px 0 ${D.border}`,
                        }}>
                          <Typography sx={{ fontSize: '0.68rem', fontWeight: 600, color: D.muted }}>
                            N/A
                          </Typography>
                        </Box>
                      )}
                    </TableCell>

                    {/* Phase progress dots */}
                    <TableCell sx={{ borderColor: D.border, borderBottomWidth: '1px' }}>
                      <Stack direction="row" spacing={0.4}>
                        {phases.map((done, i) => (
                          <Box
                            key={i}
                            title={`Phase ${i + 1}: ${done ? 'Completed' : 'Not completed'}`}
                            sx={{
                              width: 20, height: 6, borderRadius: '3px',
                              bgcolor: done ? PHASE_COLORS[i] : (mode === 'dark' ? 'rgba(255,255,255,0.1)' : '#e0e0e0'),
                              border: done ? `1px solid ${PHASE_COLORS[i]}` : `1px solid transparent`,
                              transition: 'all 0.2s',
                            }}
                          />
                        ))}
                      </Stack>
                    </TableCell>

                    {/* Last active */}
                    <TableCell sx={{ borderColor: D.border, borderBottomWidth: '1px' }}>
                      <Typography sx={{ fontSize: '0.78rem', color: D.muted }}>
                        {user.last_login
                          ? new Date(user.last_login).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })
                          : 'Never'}
                      </Typography>
                    </TableCell>

                    {/* View button */}
                    <TableCell sx={{ borderColor: D.border, borderBottomWidth: '1px' }}>
                      <IconButton
                        component={RouterLink}
                        to={`/admin/users/${user.user_id}`}
                        size="small"
                        sx={{
                          color: D.muted,
                          border: `2px solid transparent`,
                          borderRadius: '10px',
                          '&:hover': {
                            color: D.heading,
                            bgcolor: D.purple.bg,
                            border: `2px solid ${D.purple.border}`,
                            boxShadow: `2px 2px 0 ${D.purple.shadow}`,
                          },
                          transition: 'all 0.15s',
                        }}
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
                    <Typography sx={{ color: D.muted, fontSize: '0.85rem' }}>
                      {search ? 'No students match your search' : 'No students registered yet'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  )
}
