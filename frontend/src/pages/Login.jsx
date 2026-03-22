import React, { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { useApiContext } from '../lib/api.jsx'
import { Box, Typography, TextField, Stack, InputAdornment, IconButton, FormControlLabel, Checkbox } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import LoginIcon from '@mui/icons-material/Login'
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

export default function Login() {
  const { client } = useApiContext()
  const { mode } = useColorMode()
  const D = mode === 'dark' ? DARK : LIGHT
  const [username_or_email, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const result = await client.login({ username_or_email, password, remember_me: remember })
      navigate(result.redirect_url || '/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '85vh', bgcolor: D.pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 6, px: 2 }}>
      <Box sx={{ width: '100%', maxWidth: 460 }}>

        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Box sx={{
            width: 56, height: 56, borderRadius: '16px', mx: 'auto', mb: 2.5,
            bgcolor: D.purple.bg, border: `2px solid ${D.purple.border}`,
            boxShadow: `4px 4px 0 ${D.purple.shadow}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <AutoAwesomeIcon sx={{ fontSize: 28, color: D.purple.border }} />
          </Box>
          <Typography sx={{ fontWeight: 900, fontSize: '2.2rem', color: D.heading, letterSpacing: '-0.02em', mb: 1 }}>
            Welcome back
          </Typography>
          <Typography sx={{ color: D.muted, fontSize: '1rem', fontWeight: 600 }}>
            Sign in to continue your English journey
          </Typography>
        </Box>

        {/* Card */}
        <Box sx={{
          bgcolor: D.cardBg,
          border: `2px solid ${D.blue.border}`,
          borderRadius: '24px',
          boxShadow: `6px 6px 0 ${D.blue.shadow}`,
          p: { xs: 3, sm: 4 },
        }}>
          {/* Error */}
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
              <TextField
                label="Username or Email"
                value={username_or_email}
                onChange={e => setUsername(e.target.value)}
                required autoFocus fullWidth
                sx={clayField(D)}
              />

              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required fullWidth
                sx={clayField(D)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(s => !s)}
                        edge="end"
                        sx={{ borderRadius: '10px', color: D.muted }}
                      >
                        {showPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <Box sx={{ textAlign: 'right', mt: -1 }}>
                <Box
                  component={RouterLink} to="/forgot-password"
                  sx={{
                    fontSize: '0.8rem', fontWeight: 700, color: D.muted,
                    textDecoration: 'none',
                    '&:hover': { color: D.purple.border },
                    transition: 'color 0.15s',
                  }}
                >
                  Forgot password?
                </Box>
              </Box>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                    sx={{
                      color: D.border,
                      '&.Mui-checked': { color: D.purple.border },
                    }}
                  />
                }
                label={<Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: D.body }}>Remember me</Typography>}
              />

              {/* Submit button */}
              <Box
                component="button"
                type="submit"
                disabled={loading}
                sx={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                  width: '100%', py: 1.75, borderRadius: '14px',
                  bgcolor: loading ? D.border : D.purple.bg,
                  border: `2px solid ${loading ? D.border : D.purple.border}`,
                  boxShadow: loading ? 'none' : `4px 4px 0 ${D.purple.shadow}`,
                  color: loading ? D.muted : D.purple.border,
                  fontWeight: 900, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'transform 0.12s, box-shadow 0.12s',
                  '&:hover': !loading ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.purple.shadow}` } : {},
                  '&:active': !loading ? { transform: 'translate(1px,1px)', boxShadow: `2px 2px 0 ${D.purple.shadow}` } : {},
                }}
              >
                <LoginIcon sx={{ fontSize: 19 }} />
                {loading ? 'Signing In...' : 'Sign In'}
              </Box>
            </Stack>
          </Box>

          {/* Footer link */}
          <Box sx={{ mt: 3.5, textAlign: 'center' }}>
            <Typography sx={{ fontSize: '0.875rem', color: D.muted, fontWeight: 600 }}>
              New to FARDI?{' '}
              <Box
                component={RouterLink} to="/signup"
                sx={{
                  color: D.blue.border, fontWeight: 800, textDecoration: 'none',
                  borderBottom: `2px solid ${D.blue.border}`,
                  '&:hover': { color: D.purple.border, borderColor: D.purple.border },
                  transition: 'color 0.15s, border-color 0.15s',
                }}
              >
                Create an account
              </Box>
            </Typography>
          </Box>
        </Box>

        {/* Feature pills */}
        <Stack direction="row" spacing={1.5} justifyContent="center" flexWrap="wrap" useFlexGap sx={{ mt: 4 }}>
          {[
            { label: 'AI-powered', color: D.purple },
            { label: 'CEFR certified', color: D.green },
            { label: 'Cultural immersion', color: D.blue },
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
