import React, { useMemo, useState } from 'react'
import { useNavigate, useSearchParams, Link as RouterLink } from 'react-router-dom'
import { Box, Typography, TextField, Stack, InputAdornment, IconButton } from '@mui/material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import LockResetIcon from '@mui/icons-material/LockReset'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
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
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
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
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
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
  },
  '& .MuiInputLabel-root': { fontWeight: 700, color: D.muted },
  '& .MuiInputLabel-root.Mui-focused': { color: D.purple.border },
})

export default function ResetPassword() {
  const { mode } = useColorMode()
  const D = mode === 'dark' ? DARK : LIGHT
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const pwRules = useMemo(() => {
    const v = password || ''
    return { len: v.length >= 8, up: /[A-Z]/.test(v), low: /[a-z]/.test(v), num: /\d/.test(v) }
  }, [password])

  const canSubmit = Boolean(
    token && password && confirmPassword &&
    password === confirmPassword &&
    pwRules.len && pwRules.up && pwRules.low && pwRules.num && !loading
  )

  const onSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) { setError('Passwords do not match'); return }
    setLoading(true); setError('')
    try {
      const r = await fetch('/auth/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token, password }),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.detail || 'Something went wrong')
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <Box sx={{ minHeight: '85vh', bgcolor: D.pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 6, px: 2 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: D.heading, mb: 2 }}>
            Invalid reset link
          </Typography>
          <Box component={RouterLink} to="/forgot-password" sx={{ color: D.purple.border, fontWeight: 700 }}>
            Request a new one
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '85vh', bgcolor: D.pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 6, px: 2 }}>
      <Box sx={{ width: '100%', maxWidth: 460 }}>

        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Box sx={{
            width: 56, height: 56, borderRadius: '16px', mx: 'auto', mb: 2.5,
            bgcolor: D.green.bg, border: `2px solid ${D.green.border}`,
            boxShadow: `4px 4px 0 ${D.green.shadow}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <AutoAwesomeIcon sx={{ fontSize: 28, color: D.green.border }} />
          </Box>
          <Typography sx={{ fontWeight: 900, fontSize: '2.2rem', color: D.heading, letterSpacing: '-0.02em', mb: 1 }}>
            New Password
          </Typography>
          <Typography sx={{ color: D.muted, fontSize: '1rem', fontWeight: 600 }}>
            Choose a strong password for your account
          </Typography>
        </Box>

        <Box sx={{
          bgcolor: D.cardBg,
          border: `2px solid ${D.green.border}`,
          borderRadius: '24px',
          boxShadow: `6px 6px 0 ${D.green.shadow}`,
          p: { xs: 3, sm: 4 },
        }}>
          {error && (
            <Box sx={{ mb: 3, p: 2, borderRadius: '14px', bgcolor: D.red.bg, border: `2px solid ${D.red.border}`, boxShadow: `3px 3px 0 ${D.red.shadow}` }}>
              <Typography sx={{ color: D.red.border, fontWeight: 700, fontSize: '0.9rem' }}>{error}</Typography>
            </Box>
          )}

          {success ? (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: D.green.border, mb: 1 }}>
                Password reset successfully!
              </Typography>
              <Typography sx={{ color: D.muted, fontSize: '0.9rem', fontWeight: 600 }}>
                Redirecting to sign in...
              </Typography>
            </Box>
          ) : (
            <Box component="form" onSubmit={onSubmit}>
              <Stack spacing={2.5}>
                <TextField
                  label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password} onChange={e => setPassword(e.target.value)}
                  required fullWidth autoFocus sx={clayField(D)}
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

                <TextField
                  label="Confirm Password"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  required fullWidth sx={clayField(D)}
                  error={confirmPassword.length > 0 && password !== confirmPassword}
                  helperText={confirmPassword.length > 0 && password !== confirmPassword ? 'Passwords do not match' : ''}
                />

                <Box sx={{ p: 2.5, borderRadius: '16px', bgcolor: D.pageBg, border: `2px solid ${D.border}` }}>
                  <Typography sx={{ fontWeight: 800, fontSize: '0.82rem', color: D.body, mb: 1.5 }}>
                    Password Requirements
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1 }}>
                    {[
                      { key: 'len', text: 'At least 8 characters' },
                      { key: 'up',  text: 'Uppercase letter' },
                      { key: 'low', text: 'Lowercase letter' },
                      { key: 'num', text: 'Number' },
                    ].map(rule => (
                      <Stack direction="row" spacing={1} alignItems="center" key={rule.key}>
                        {pwRules[rule.key]
                          ? <CheckCircleOutlineIcon sx={{ color: D.green.border, fontSize: 17 }} />
                          : <ErrorOutlineIcon sx={{ color: D.border, fontSize: 17 }} />
                        }
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: pwRules[rule.key] ? D.green.border : D.muted }}>
                          {rule.text}
                        </Typography>
                      </Stack>
                    ))}
                  </Box>
                </Box>

                <Box
                  component="button" type="submit" disabled={!canSubmit}
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
                  <LockResetIcon sx={{ fontSize: 19 }} />
                  {loading ? 'Resetting...' : 'Reset Password'}
                </Box>
              </Stack>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}
