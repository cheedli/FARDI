import React, { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Box, Typography, TextField, Stack } from '@mui/material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SendIcon from '@mui/icons-material/Send'
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

export default function ForgotPassword() {
  const { mode } = useColorMode()
  const D = mode === 'dark' ? DARK : LIGHT
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const r = await fetch('/auth/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email }),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'Something went wrong')
      setSent(true)
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
            bgcolor: D.blue.bg, border: `2px solid ${D.blue.border}`,
            boxShadow: `4px 4px 0 ${D.blue.shadow}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <AutoAwesomeIcon sx={{ fontSize: 28, color: D.blue.border }} />
          </Box>
          <Typography sx={{ fontWeight: 900, fontSize: '2.2rem', color: D.heading, letterSpacing: '-0.02em', mb: 1 }}>
            Reset Password
          </Typography>
          <Typography sx={{ color: D.muted, fontSize: '1rem', fontWeight: 600 }}>
            Enter your email and we'll send you a reset link
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
          {error && (
            <Box sx={{
              mb: 3, p: 2, borderRadius: '14px',
              bgcolor: D.red.bg, border: `2px solid ${D.red.border}`,
              boxShadow: `3px 3px 0 ${D.red.shadow}`,
            }}>
              <Typography sx={{ color: D.red.border, fontWeight: 700, fontSize: '0.9rem' }}>{error}</Typography>
            </Box>
          )}

          {sent ? (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Box sx={{
                width: 48, height: 48, borderRadius: '14px', mx: 'auto', mb: 2,
                bgcolor: D.green.bg, border: `2px solid ${D.green.border}`,
                boxShadow: `3px 3px 0 ${D.green.shadow}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem',
              }}>
                ✓
              </Box>
              <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: D.heading, mb: 1 }}>
                Check your email
              </Typography>
              <Typography sx={{ color: D.muted, fontSize: '0.9rem', fontWeight: 600, mb: 3 }}>
                If an account exists for <strong>{email}</strong>, you'll receive a password reset link shortly.
              </Typography>
              <Box
                component={RouterLink} to="/login"
                sx={{
                  display: 'inline-flex', alignItems: 'center', gap: 0.5,
                  color: D.purple.border, fontWeight: 800, fontSize: '0.9rem',
                  textDecoration: 'none',
                  borderBottom: `2px solid ${D.purple.border}`,
                  '&:hover': { color: D.blue.border, borderColor: D.blue.border },
                  transition: 'color 0.15s, border-color 0.15s',
                }}
              >
                <ArrowBackIcon sx={{ fontSize: 16 }} />
                Back to Sign in
              </Box>
            </Box>
          ) : (
            <Box component="form" onSubmit={onSubmit}>
              <Stack spacing={2.5}>
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required autoFocus fullWidth
                  sx={clayField(D)}
                />

                <Box
                  component="button"
                  type="submit"
                  disabled={loading || !email}
                  sx={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                    width: '100%', py: 1.75, borderRadius: '14px',
                    bgcolor: (loading || !email) ? D.border : D.blue.bg,
                    border: `2px solid ${(loading || !email) ? D.border : D.blue.border}`,
                    boxShadow: (loading || !email) ? 'none' : `4px 4px 0 ${D.blue.shadow}`,
                    color: (loading || !email) ? D.muted : D.blue.border,
                    fontWeight: 900, fontSize: '1rem',
                    cursor: (loading || !email) ? 'not-allowed' : 'pointer',
                    transition: 'transform 0.12s, box-shadow 0.12s',
                    '&:hover': !(loading || !email) ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.blue.shadow}` } : {},
                    '&:active': !(loading || !email) ? { transform: 'translate(1px,1px)', boxShadow: `2px 2px 0 ${D.blue.shadow}` } : {},
                  }}
                >
                  <SendIcon sx={{ fontSize: 18 }} />
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Box>
              </Stack>
            </Box>
          )}

          <Box sx={{ mt: 3.5, textAlign: 'center' }}>
            <Box
              component={RouterLink} to="/login"
              sx={{
                display: 'inline-flex', alignItems: 'center', gap: 0.5,
                fontSize: '0.875rem', color: D.muted, fontWeight: 700,
                textDecoration: 'none',
                '&:hover': { color: D.purple.border },
                transition: 'color 0.15s',
              }}
            >
              <ArrowBackIcon sx={{ fontSize: 16 }} />
              Back to Sign in
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
