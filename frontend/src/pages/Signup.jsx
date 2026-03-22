import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { useApiContext } from '../lib/api.jsx'
import { Box, Typography, TextField, Stack, InputAdornment, IconButton, CircularProgress } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { useColorMode } from '../theme.jsx'

const LIGHT = {
  pageBg:  '#FFFDE7',
  cardBg:  '#ffffff',
  heading: '#1A237E',
  body:    '#37474F',
  muted:   '#78909C',
  border:  '#E0E0E0',
  purple: { bg: '#E1BEE7', border: '#8E24AA', shadow: '#8E24AA' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
  yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825', text: '#5D4037' },
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
  orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
  teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
  red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#C62828' },
}
const DARK = {
  pageBg:  '#0F0F1A',
  cardBg:  '#1A1A2E',
  heading: '#E8EAFF',
  body:    '#B0BEC5',
  muted:   '#607D8B',
  border:  '#2A2A4A',
  purple: { bg: '#1E0A2E', border: '#CE93D8', shadow: '#7B1FA2' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#A06800', text: '#FFD54F' },
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
  teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
  red:    { bg: '#1F0000', border: '#EF9A9A', shadow: '#B71C1C' },
}

const clayField = (D) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '14px',
    bgcolor: D.pageBg,
    fontWeight: 600,
    '& fieldset': { border: `2px solid ${D.border}` },
    '&:hover fieldset': { border: `2px solid ${D.blue.border}` },
    '&.Mui-focused fieldset': {
      border: `2px solid ${D.purple.border}`,
      boxShadow: `3px 3px 0 ${D.purple.shadow}`,
    },
    '&.Mui-error fieldset': { border: `2px solid ${D.red.border}`, boxShadow: `2px 2px 0 ${D.red.shadow}` },
  },
  '& .MuiInputLabel-root': { fontWeight: 700, color: D.muted },
  '& .MuiInputLabel-root.Mui-focused': { color: D.purple.border },
  '& .MuiFormHelperText-root': { fontWeight: 600, mt: 0.5 },
})

export default function Signup() {
  const { client } = useApiContext()
  const { mode } = useColorMode()
  const D = mode === 'dark' ? DARK : LIGHT
  const [form, setForm] = useState({ username: '', email: '', password: '', first_name: '', last_name: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [uStatus, setUStatus] = useState({ loading: false, available: null, message: '' })
  const [eStatus, setEStatus] = useState({ loading: false, available: null, message: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  useEffect(() => {
    if (!form.username) { setUStatus({ loading: false, available: null, message: '' }); return }
    setUStatus(s => ({ ...s, loading: true }))
    const h = setTimeout(async () => {
      try {
        const r = await fetch(`/auth/api/check-username?username=${encodeURIComponent(form.username)}`, { credentials: 'include' })
        const data = await r.json()
        setUStatus({ loading: false, available: !!data.available, message: data.message || '' })
      } catch { setUStatus({ loading: false, available: null, message: 'Could not check username' }) }
    }, 400)
    return () => clearTimeout(h)
  }, [form.username])

  useEffect(() => {
    if (!form.email) { setEStatus({ loading: false, available: null, message: '' }); return }
    setEStatus(s => ({ ...s, loading: true }))
    const h = setTimeout(async () => {
      try {
        const r = await fetch(`/auth/api/check-email?email=${encodeURIComponent(form.email)}`, { credentials: 'include' })
        const data = await r.json()
        setEStatus({ loading: false, available: !!data.available, message: data.message || '' })
      } catch { setEStatus({ loading: false, available: null, message: 'Could not check email' }) }
    }, 400)
    return () => clearTimeout(h)
  }, [form.email])

  const pwRules = useMemo(() => {
    const v = form.password || ''
    return { len: v.length >= 8, up: /[A-Z]/.test(v), low: /[a-z]/.test(v), num: /\d/.test(v) }
  }, [form.password])

  const canSubmit = Boolean(
    form.username && form.email && form.password &&
    uStatus.available === true && eStatus.available === true &&
    pwRules.len && pwRules.up && pwRules.low && pwRules.num && !loading
  )

  const onSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('')
    try { await client.signup(form); navigate('/dashboard') }
    catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <Box sx={{ minHeight: '90vh', bgcolor: D.pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 6, px: 2 }}>
      <Box sx={{ width: '100%', maxWidth: 540 }}>

        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{
            width: 56, height: 56, borderRadius: '16px', mx: 'auto', mb: 2.5,
            bgcolor: D.green.bg, border: `2px solid ${D.green.border}`,
            boxShadow: `4px 4px 0 ${D.green.shadow}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <AutoAwesomeIcon sx={{ fontSize: 28, color: D.green.border }} />
          </Box>
          <Typography sx={{ fontWeight: 900, fontSize: '2.2rem', color: D.heading, letterSpacing: '-0.02em', mb: 1 }}>
            Join FARDI
          </Typography>
          <Typography sx={{ color: D.muted, fontSize: '1rem', fontWeight: 600, mb: 3 }}>
            Quick registration for your professional CEFR assessment
          </Typography>

          {/* Info banner */}
          <Box sx={{
            px: 3, py: 2, borderRadius: '16px',
            bgcolor: D.yellow.bg, border: `2px solid ${D.yellow.border}`,
            boxShadow: `3px 3px 0 ${D.yellow.shadow}`,
          }}>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 800, color: D.yellow.text || D.yellow.border, mb: 0.25 }}>
              ✦ Secure your results · Official certificates · Track progress
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: D.body }}>
              Registration takes 30 seconds. Your CEFR assessment is saved permanently.
            </Typography>
          </Box>
        </Box>

        {/* Card */}
        <Box sx={{
          bgcolor: D.cardBg,
          border: `2px solid ${D.purple.border}`,
          borderRadius: '24px',
          boxShadow: `6px 6px 0 ${D.purple.shadow}`,
          p: { xs: 3, sm: 4 },
        }}>
          {error && (
            <Box sx={{
              mb: 3, p: 2, borderRadius: '14px',
              bgcolor: D.red.bg, border: `2px solid ${D.red.border}`,
              boxShadow: `3px 3px 0 ${D.red.shadow}`,
            }}>
              <Typography sx={{ color: D.red.border, fontWeight: 700, fontSize: '0.9rem' }}>⚠ {error}</Typography>
            </Box>
          )}

          <Box component="form" onSubmit={onSubmit}>
            <Stack spacing={2.5}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField label="First name" value={form.first_name} onChange={onChange('first_name')} fullWidth sx={clayField(D)} />
                <TextField label="Last name" value={form.last_name} onChange={onChange('last_name')} fullWidth sx={clayField(D)} />
              </Stack>

              <TextField
                label="Username" value={form.username} onChange={onChange('username')}
                required fullWidth sx={clayField(D)}
                error={uStatus.available === false}
                helperText={uStatus.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {uStatus.loading && <CircularProgress size={18} sx={{ color: D.purple.border }} />}
                      {!uStatus.loading && uStatus.available === true && <CheckCircleOutlineIcon sx={{ color: D.green.border, fontSize: 20 }} />}
                      {!uStatus.loading && uStatus.available === false && <ErrorOutlineIcon sx={{ color: D.red.border, fontSize: 20 }} />}
                    </InputAdornment>
                  )
                }}
              />

              <TextField
                label="Email" type="email" value={form.email} onChange={onChange('email')}
                required fullWidth sx={clayField(D)}
                error={eStatus.available === false}
                helperText={eStatus.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {eStatus.loading && <CircularProgress size={18} sx={{ color: D.purple.border }} />}
                      {!eStatus.loading && eStatus.available === true && <CheckCircleOutlineIcon sx={{ color: D.green.border, fontSize: 20 }} />}
                      {!eStatus.loading && eStatus.available === false && <ErrorOutlineIcon sx={{ color: D.red.border, fontSize: 20 }} />}
                    </InputAdornment>
                  )
                }}
              />

              <TextField
                label="Password" type={showPassword ? 'text' : 'password'}
                value={form.password} onChange={onChange('password')}
                required fullWidth sx={clayField(D)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(s => !s)} edge="end" sx={{ borderRadius: '10px', color: D.muted }}>
                        {showPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              {/* Password rules */}
              <Box sx={{
                p: 2.5, borderRadius: '16px',
                bgcolor: D.pageBg, border: `2px solid ${D.border}`,
              }}>
                <Typography sx={{ fontWeight: 800, fontSize: '0.82rem', color: D.body, mb: 1.5 }}>
                  Password Requirements
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1 }}>
                  {[
                    { key: 'len', text: 'At least 8 characters' },
                    { key: 'up',  text: 'Uppercase letter'      },
                    { key: 'low', text: 'Lowercase letter'      },
                    { key: 'num', text: 'Number'                },
                  ].map(rule => (
                    <Stack direction="row" spacing={1} alignItems="center" key={rule.key}>
                      {pwRules[rule.key]
                        ? <CheckCircleOutlineIcon sx={{ color: D.green.border, fontSize: 17 }} />
                        : <ErrorOutlineIcon sx={{ color: D.border, fontSize: 17 }} />
                      }
                      <Typography sx={{
                        fontSize: '0.8rem', fontWeight: 700,
                        color: pwRules[rule.key] ? D.green.border : D.muted,
                      }}>
                        {rule.text}
                      </Typography>
                    </Stack>
                  ))}
                </Box>
              </Box>

              {/* Submit */}
              <Box
                component="button" type="submit"
                disabled={!canSubmit}
                sx={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                  width: '100%', py: 1.75, borderRadius: '14px',
                  bgcolor: !canSubmit ? D.border : D.green.bg,
                  border: `2px solid ${!canSubmit ? D.border : D.green.border}`,
                  boxShadow: !canSubmit ? 'none' : `4px 4px 0 ${D.green.shadow}`,
                  color: !canSubmit ? D.muted : D.green.border,
                  fontWeight: 900, fontSize: '1rem',
                  cursor: !canSubmit ? 'not-allowed' : 'pointer',
                  transition: 'transform 0.12s, box-shadow 0.12s',
                  '&:hover': canSubmit ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.green.shadow}` } : {},
                  '&:active': canSubmit ? { transform: 'translate(1px,1px)', boxShadow: `2px 2px 0 ${D.green.shadow}` } : {},
                }}
              >
                <PersonAddIcon sx={{ fontSize: 19 }} />
                {loading ? 'Creating Account...' : 'Create Account'}
              </Box>
            </Stack>
          </Box>

          <Box sx={{ mt: 3.5, textAlign: 'center' }}>
            <Typography sx={{ fontSize: '0.875rem', color: D.muted, fontWeight: 600 }}>
              Already have an account?{' '}
              <Box
                component={RouterLink} to="/login"
                sx={{
                  color: D.purple.border, fontWeight: 800, textDecoration: 'none',
                  borderBottom: `2px solid ${D.purple.border}`,
                  '&:hover': { color: D.blue.border, borderColor: D.blue.border },
                  transition: 'color 0.15s, border-color 0.15s',
                }}
              >
                Sign in
              </Box>
            </Typography>
          </Box>
        </Box>

        {/* Benefit pills */}
        <Stack direction="row" spacing={1.5} justifyContent="center" flexWrap="wrap" useFlexGap sx={{ mt: 4 }}>
          {[
            { label: 'Free CEFR assessment', color: D.purple },
            { label: 'AI-powered coaching',  color: D.teal   },
            { label: 'Progress tracking',    color: D.orange },
          ].map(({ label, color }) => (
            <Box key={label} sx={{
              px: 2, py: 0.6, borderRadius: '50px',
              bgcolor: color.bg, border: `2px solid ${color.border}`,
              boxShadow: `2px 2px 0 ${color.shadow}`,
              fontSize: '0.75rem', fontWeight: 800, color: color.border,
            }}>
              {label}
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
