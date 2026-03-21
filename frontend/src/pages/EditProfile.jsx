import React, { useState } from 'react'
import { Box, Typography, TextField, Stack, Avatar } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import { useAuth } from '../lib/api.jsx'
import { useColorMode } from '../theme.jsx'

const LIGHT = {
  pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', border: '#E0E0E0',
  purple: { bg: '#E1BEE7', border: '#8E24AA', shadow: '#8E24AA' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
  red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#C62828' },
  yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825' },
}
const DARK = {
  pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', border: '#2A2A4A',
  purple: { bg: '#1E0A2E', border: '#CE93D8', shadow: '#7B1FA2' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  red:    { bg: '#1F0000', border: '#EF9A9A', shadow: '#B71C1C' },
  yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#A06800' },
}

const clayFieldSx = (D) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '14px', bgcolor: D.pageBg, fontWeight: 600,
    '& fieldset': { border: `2px solid ${D.border}` },
    '&:hover fieldset': { border: `2px solid ${D.blue.border}` },
    '&.Mui-focused fieldset': { border: `2px solid ${D.purple.border}`, boxShadow: `3px 3px 0 ${D.purple.shadow}` },
  },
  '& .MuiInputLabel-root': { fontWeight: 700, color: D.muted },
  '& .MuiInputLabel-root.Mui-focused': { color: D.purple.border },
  '& .MuiFormHelperText-root': { fontWeight: 600 },
})

export default function EditProfile() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { mode } = useColorMode()
  const D = mode === 'dark' ? DARK : LIGHT

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    username: user?.username || ''
  })

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/auth/api/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile')
      }

      setSuccess('Profile updated successfully!')
      setTimeout(() => {
        navigate('/profile')
      }, 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const userName = formData.first_name || formData.username || 'User'

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: D.pageBg,
      py: 5,
      px: 2,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
    }}>
      <Box sx={{
        maxWidth: 540,
        width: '100%',
        bgcolor: D.cardBg,
        border: `2px solid ${D.purple.border}`,
        borderRadius: '24px',
        boxShadow: `6px 6px 0 ${D.purple.shadow}`,
        p: { xs: 3, sm: 4 },
      }}>
        {/* Header */}
        <Stack alignItems="center" spacing={1.5} sx={{ mb: 4 }}>
          <Avatar
            sx={{
              bgcolor: D.purple.bg,
              border: `2px solid ${D.purple.border}`,
              boxShadow: `4px 4px 0 ${D.purple.shadow}`,
              width: 72,
              height: 72,
              fontSize: '1.6rem',
              fontWeight: 800,
              color: D.purple.border,
            }}
          >
            {userName[0].toUpperCase()}
          </Avatar>
          <Typography sx={{ fontWeight: 900, fontSize: '1.8rem', color: D.heading, lineHeight: 1.2 }}>
            Edit Profile
          </Typography>
          <Typography sx={{ color: D.muted, fontWeight: 500, fontSize: '0.95rem' }}>
            Update your personal information
          </Typography>
        </Stack>

        {/* Error box */}
        {error && (
          <Box sx={{
            bgcolor: D.red.bg,
            border: `2px solid ${D.red.border}`,
            boxShadow: `3px 3px 0 ${D.red.shadow}`,
            borderRadius: '14px',
            p: 2,
            mb: 3,
          }}>
            <Typography sx={{ color: D.red.border, fontWeight: 700, fontSize: '0.9rem' }}>
              ⚠ {error}
            </Typography>
          </Box>
        )}

        {/* Success box */}
        {success && (
          <Box sx={{
            bgcolor: D.green.bg,
            border: `2px solid ${D.green.border}`,
            boxShadow: `3px 3px 0 ${D.green.shadow}`,
            borderRadius: '14px',
            p: 2,
            mb: 3,
          }}>
            <Typography sx={{ color: D.green.border, fontWeight: 700, fontSize: '0.9rem' }}>
              ✓ {success}
            </Typography>
          </Box>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={3}>
            <TextField
              name="first_name"
              label="First Name"
              value={formData.first_name}
              onChange={handleChange}
              fullWidth
              required
              sx={clayFieldSx(D)}
            />

            <TextField
              name="last_name"
              label="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              fullWidth
              required
              sx={clayFieldSx(D)}
            />

            <TextField
              name="username"
              label="Username"
              value={formData.username}
              onChange={handleChange}
              fullWidth
              required
              helperText="This will be your unique identifier"
              sx={clayFieldSx(D)}
            />

            <TextField
              name="email"
              type="email"
              label="Email Address"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
              sx={clayFieldSx(D)}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 2 }}>
              {/* Save Changes button */}
              <Box
                component="button"
                type="submit"
                disabled={loading}
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  bgcolor: D.purple.bg,
                  border: `2px solid ${D.purple.border}`,
                  boxShadow: `4px 4px 0 ${D.purple.shadow}`,
                  color: D.purple.border,
                  borderRadius: '14px',
                  py: 1.75,
                  fontWeight: 900,
                  fontSize: '1rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  transition: 'transform 0.1s, box-shadow 0.1s',
                  '&:hover:not(:disabled)': {
                    transform: 'translate(-2px, -2px)',
                    boxShadow: `6px 6px 0 ${D.purple.shadow}`,
                  },
                  '&:active:not(:disabled)': {
                    transform: 'translate(1px, 1px)',
                    boxShadow: `2px 2px 0 ${D.purple.shadow}`,
                  },
                }}
              >
                <SaveIcon sx={{ fontSize: '1.1rem' }} />
                {loading ? 'Saving...' : 'Save Changes'}
              </Box>

              {/* Cancel button */}
              <Box
                component="button"
                type="button"
                disabled={loading}
                onClick={() => navigate('/profile')}
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  bgcolor: D.blue.bg,
                  border: `2px solid ${D.blue.border}`,
                  boxShadow: `4px 4px 0 ${D.blue.shadow}`,
                  color: D.blue.border,
                  borderRadius: '14px',
                  py: 1.75,
                  fontWeight: 900,
                  fontSize: '1rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  transition: 'transform 0.1s, box-shadow 0.1s',
                  '&:hover:not(:disabled)': {
                    transform: 'translate(-2px, -2px)',
                    boxShadow: `6px 6px 0 ${D.blue.shadow}`,
                  },
                  '&:active:not(:disabled)': {
                    transform: 'translate(1px, 1px)',
                    boxShadow: `2px 2px 0 ${D.blue.shadow}`,
                  },
                }}
              >
                <CancelIcon sx={{ fontSize: '1.1rem' }} />
                Cancel
              </Box>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}
