import React, { useState } from 'react'
import { Box, Typography, TextField, Stack, IconButton, InputAdornment } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import LockIcon from '@mui/icons-material/Lock'
import { useColorMode } from '../theme.jsx'

const LIGHT = {
  pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', border: '#E0E0E0',
  purple: { bg: '#E1BEE7', border: '#8E24AA', shadow: '#8E24AA' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
  red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#C62828' },
}
const DARK = {
  pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', border: '#2A2A4A',
  purple: { bg: '#1E0A2E', border: '#CE93D8', shadow: '#7B1FA2' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  red:    { bg: '#1F0000', border: '#EF9A9A', shadow: '#B71C1C' },
}

export default function ChangePassword() {
  const navigate = useNavigate()
  const { mode } = useColorMode()
  const D = mode === 'dark' ? DARK : LIGHT

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (formData.new_password !== formData.confirm_password) {
      setError('New passwords do not match')
      setLoading(false)
      return
    }

    if (formData.new_password.length < 6) {
      setError('New password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/auth/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          current_password: formData.current_password,
          new_password: formData.new_password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password')
      }

      setSuccess('Password changed successfully!')
      setFormData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      })

      setTimeout(() => {
        navigate('/profile')
      }, 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const textFieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '14px',
      bgcolor: D.pageBg,
      fontWeight: 600,
      '& fieldset': { border: `2px solid ${D.border}` },
      '&:hover fieldset': { border: `2px solid ${D.blue.border}` },
      '&.Mui-focused fieldset': { border: `2px solid ${D.blue.border}`, boxShadow: `3px 3px 0 ${D.blue.shadow}` },
    },
    '& .MuiInputLabel-root': { color: D.muted },
    '& .MuiInputLabel-root.Mui-focused': { color: D.blue.border },
    '& .MuiFormHelperText-root': { color: D.muted },
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: D.pageBg,
        py: 5,
        px: 2,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          maxWidth: 500,
          width: '100%',
          bgcolor: D.cardBg,
          border: `2px solid ${D.blue.border}`,
          borderRadius: '24px',
          boxShadow: `6px 6px 0 ${D.blue.shadow}`,
          p: { xs: 3, sm: 4 },
        }}
      >
        {/* Header */}
        <Stack alignItems="center" spacing={2} sx={{ mb: 4 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '16px',
              bgcolor: D.blue.bg,
              border: `2px solid ${D.blue.border}`,
              boxShadow: `4px 4px 0 ${D.blue.shadow}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LockIcon sx={{ fontSize: 28, color: D.blue.border }} />
          </Box>
          <Typography
            sx={{
              color: D.heading,
              fontWeight: 900,
              fontSize: '1.8rem',
              lineHeight: 1.2,
              textAlign: 'center',
            }}
          >
            Change Password
          </Typography>
          <Typography
            sx={{
              color: D.muted,
              textAlign: 'center',
              fontSize: '0.95rem',
            }}
          >
            Choose a strong password to keep your account secure
          </Typography>
        </Stack>

        {/* Error box */}
        {error && (
          <Box
            sx={{
              bgcolor: D.red.bg,
              border: `2px solid ${D.red.border}`,
              boxShadow: `3px 3px 0 ${D.red.shadow}`,
              borderRadius: '14px',
              p: 2,
              color: D.red.border,
              mb: 3,
              fontWeight: 700,
              fontSize: '0.95rem',
            }}
          >
            ⚠ {error}
          </Box>
        )}

        {/* Success box */}
        {success && (
          <Box
            sx={{
              bgcolor: D.green.bg,
              border: `2px solid ${D.green.border}`,
              boxShadow: `3px 3px 0 ${D.green.shadow}`,
              borderRadius: '14px',
              p: 2,
              color: D.green.border,
              mb: 3,
              fontWeight: 700,
              fontSize: '0.95rem',
            }}
          >
            ✓ {success}
          </Box>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={3}>
            <TextField
              name="current_password"
              type={showPasswords.current ? 'text' : 'password'}
              label="Current Password"
              value={formData.current_password}
              onChange={handleChange}
              fullWidth
              required
              sx={textFieldSx}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility('current')}
                      edge="end"
                      sx={{ borderRadius: '10px', color: D.muted }}
                    >
                      {showPasswords.current ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <TextField
              name="new_password"
              type={showPasswords.new ? 'text' : 'password'}
              label="New Password"
              value={formData.new_password}
              onChange={handleChange}
              fullWidth
              required
              helperText="Must be at least 6 characters long"
              sx={textFieldSx}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility('new')}
                      edge="end"
                      sx={{ borderRadius: '10px', color: D.muted }}
                    >
                      {showPasswords.new ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <TextField
              name="confirm_password"
              type={showPasswords.confirm ? 'text' : 'password'}
              label="Confirm New Password"
              value={formData.confirm_password}
              onChange={handleChange}
              fullWidth
              required
              error={!!(formData.confirm_password && formData.new_password !== formData.confirm_password)}
              helperText={
                formData.confirm_password && formData.new_password !== formData.confirm_password
                  ? 'Passwords do not match'
                  : 'Re-type your new password'
              }
              sx={textFieldSx}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility('confirm')}
                      edge="end"
                      sx={{ borderRadius: '10px', color: D.muted }}
                    >
                      {showPasswords.confirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 2 }}>
              {/* Change Password button */}
              <Box
                component="button"
                type="submit"
                disabled={loading}
                sx={{
                  flex: 1,
                  bgcolor: D.blue.bg,
                  border: `2px solid ${D.blue.border}`,
                  boxShadow: `4px 4px 0 ${D.blue.shadow}`,
                  color: D.blue.border,
                  borderRadius: '14px',
                  py: 1.75,
                  px: 2,
                  fontWeight: 900,
                  fontSize: '1rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  transition: 'transform 0.1s, box-shadow 0.1s',
                  '&:hover': {
                    transform: loading ? 'none' : 'translateY(-2px)',
                    boxShadow: loading ? `4px 4px 0 ${D.blue.shadow}` : `6px 6px 0 ${D.blue.shadow}`,
                  },
                  '&:active': {
                    transform: 'translateY(2px)',
                    boxShadow: `2px 2px 0 ${D.blue.shadow}`,
                  },
                }}
              >
                {loading ? 'Changing...' : 'Change Password'}
              </Box>

              {/* Cancel button */}
              <Box
                component="button"
                type="button"
                disabled={loading}
                onClick={() => navigate('/profile')}
                sx={{
                  flex: 1,
                  bgcolor: 'transparent',
                  border: `2px solid ${D.border}`,
                  boxShadow: `3px 3px 0 ${D.border}`,
                  color: D.body,
                  borderRadius: '14px',
                  py: 1.75,
                  px: 2,
                  fontWeight: 700,
                  fontSize: '1rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  transition: 'transform 0.1s, box-shadow 0.1s',
                  '&:hover': {
                    transform: loading ? 'none' : 'translateY(-2px)',
                    boxShadow: loading ? `3px 3px 0 ${D.border}` : `5px 5px 0 ${D.border}`,
                  },
                  '&:active': {
                    transform: 'translateY(2px)',
                    boxShadow: `1px 1px 0 ${D.border}`,
                  },
                }}
              >
                Cancel
              </Box>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}
