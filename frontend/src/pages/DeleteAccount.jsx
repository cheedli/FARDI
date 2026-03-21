import React, { useState } from 'react'
import { Box, Typography, TextField, Stack, Checkbox, FormControlLabel } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import DeleteIcon from '@mui/icons-material/Delete'
import CancelIcon from '@mui/icons-material/Cancel'
import WarningIcon from '@mui/icons-material/Warning'
import { useAuth } from '../lib/api.jsx'
import { useColorMode } from '../theme.jsx'

const LIGHT = {
  pageBg: '#FFFDE7',
  cardBg: '#ffffff',
  heading: '#1A237E',
  body: '#37474F',
  muted: '#78909C',
  border: '#E0E0E0',
  red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#C62828' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
  yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825' },
}

const DARK = {
  pageBg: '#0F0F1A',
  cardBg: '#1A1A2E',
  heading: '#E8EAFF',
  body: '#B0BEC5',
  muted: '#607D8B',
  border: '#2A2A4A',
  red:    { bg: '#1F0000', border: '#EF9A9A', shadow: '#B71C1C' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#A06800' },
}

export default function DeleteAccount() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { mode } = useColorMode()
  const D = mode === 'dark' ? DARK : LIGHT

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [confirmationText, setConfirmationText] = useState('')
  const [acknowledged, setAcknowledged] = useState(false)

  const requiredText = 'DELETE MY ACCOUNT'
  const isConfirmationValid = confirmationText === requiredText && acknowledged

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isConfirmationValid) {
      setError('Please complete all confirmation steps')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/auth/api/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          confirmation: confirmationText
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete account')
      }

      // Redirect to goodbye page or home
      window.location.href = '/auth/logout'
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
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
          maxWidth: 560,
          width: '100%',
          bgcolor: D.cardBg,
          border: `2px solid ${D.red.border}`,
          borderRadius: '24px',
          boxShadow: `6px 6px 0 ${D.red.shadow}`,
          p: { xs: 3, sm: 4 },
        }}
      >
        {/* Header */}
        <Stack alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: '16px',
              bgcolor: D.red.bg,
              border: `2px solid ${D.red.border}`,
              boxShadow: `4px 4px 0 ${D.red.shadow}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <WarningIcon sx={{ fontSize: 30, color: D.red.border }} />
          </Box>
          <Typography
            sx={{
              color: D.red.border,
              fontWeight: 900,
              fontSize: '1.8rem',
              lineHeight: 1.2,
            }}
          >
            Delete Account
          </Typography>
        </Stack>

        {/* Warning panel */}
        <Box
          sx={{
            bgcolor: D.red.bg,
            border: `2px solid ${D.red.border}`,
            boxShadow: `3px 3px 0 ${D.red.shadow}`,
            borderRadius: '16px',
            p: 2.5,
            mb: 3,
          }}
        >
          <Typography
            sx={{
              color: D.red.border,
              fontWeight: 800,
              fontSize: '0.95rem',
              mb: 1,
            }}
          >
            This action is permanent and cannot be undone!
          </Typography>
          <Typography sx={{ color: D.body, fontSize: '0.875rem', mb: 1 }}>
            Deleting your account will permanently remove:
          </Typography>
          {[
            'Your profile information',
            'All assessment results and progress',
            'Learning history and achievements',
            'Any certificates earned',
          ].map((item) => (
            <Typography
              key={item}
              sx={{ color: D.body, fontSize: '0.875rem', lineHeight: 1.8 }}
            >
              {'• '}
              {item}
            </Typography>
          ))}
        </Box>

        {/* Error box */}
        {error && (
          <Box
            sx={{
              bgcolor: D.red.bg,
              border: `2px solid ${D.red.border}`,
              borderRadius: '14px',
              p: 2,
              mb: 3,
            }}
          >
            <Typography sx={{ color: D.red.border, fontWeight: 700, fontSize: '0.875rem' }}>
              ⚠ {error}
            </Typography>
          </Box>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={3}>
            {/* User info section */}
            <Box
              sx={{
                bgcolor: D.yellow.bg,
                border: `2px solid ${D.yellow.border}`,
                boxShadow: `3px 3px 0 ${D.yellow.shadow}`,
                borderRadius: '14px',
                p: 2,
              }}
            >
              <Typography
                sx={{
                  color: D.muted,
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  mb: 0.75,
                }}
              >
                Account to be deleted
              </Typography>
              <Typography sx={{ color: D.body, fontWeight: 700, fontSize: '1rem' }}>
                {user?.first_name} {user?.last_name} (@{user?.username})
              </Typography>
              <Typography sx={{ color: D.body, fontSize: '0.875rem' }}>
                {user?.email}
              </Typography>
            </Box>

            {/* Acknowledgement checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={acknowledged}
                  onChange={(e) => setAcknowledged(e.target.checked)}
                  sx={{
                    color: D.muted,
                    '&.Mui-checked': { color: D.red.border },
                  }}
                />
              }
              label={
                <Typography sx={{ color: D.body, fontSize: '0.9rem' }}>
                  I understand that this action is permanent and cannot be undone
                </Typography>
              }
            />

            {/* Confirmation text field */}
            <Box>
              <Typography sx={{ color: D.body, fontWeight: 700, fontSize: '0.875rem', mb: 1 }}>
                Type &ldquo;{requiredText}&rdquo; to confirm:
              </Typography>
              <TextField
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                fullWidth
                placeholder={requiredText}
                error={Boolean(confirmationText && confirmationText !== requiredText)}
                helperText={
                  confirmationText && confirmationText !== requiredText
                    ? `Please type exactly: ${requiredText}`
                    : ''
                }
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '14px',
                    bgcolor: D.pageBg,
                    fontWeight: 700,
                    '& fieldset': { border: `2px solid ${D.border}` },
                    '&.Mui-error fieldset': {
                      border: `2px solid ${D.red.border}`,
                      boxShadow: `2px 2px 0 ${D.red.shadow}`,
                    },
                    '&.Mui-focused fieldset': {
                      border: `2px solid ${D.red.border}`,
                      boxShadow: `3px 3px 0 ${D.red.shadow}`,
                    },
                  },
                }}
              />
            </Box>

            {/* Action buttons */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 1 }}>
              {/* Cancel button — blue clay */}
              <Box
                component="button"
                type="button"
                onClick={() => navigate('/profile')}
                disabled={loading}
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  bgcolor: D.blue.bg,
                  border: `2px solid ${D.blue.border}`,
                  boxShadow: `3px 3px 0 ${D.blue.shadow}`,
                  color: D.blue.border,
                  borderRadius: '14px',
                  py: 1.75,
                  px: 2,
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  transition: 'transform 150ms ease, box-shadow 150ms ease',
                  '&:hover:not(:disabled)': {
                    transform: 'translateY(-2px)',
                    boxShadow: `5px 5px 0 ${D.blue.shadow}`,
                  },
                  '&:active:not(:disabled)': {
                    transform: 'translateY(0)',
                    boxShadow: `1px 1px 0 ${D.blue.shadow}`,
                  },
                }}
              >
                <CancelIcon sx={{ fontSize: 18 }} />
                Cancel
              </Box>

              {/* Delete button — red clay */}
              <Box
                component="button"
                type="submit"
                disabled={loading || !isConfirmationValid}
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  bgcolor: isConfirmationValid ? D.red.bg : D.border,
                  border: `2px solid ${isConfirmationValid ? D.red.border : D.border}`,
                  boxShadow: isConfirmationValid ? `4px 4px 0 ${D.red.shadow}` : 'none',
                  color: isConfirmationValid ? D.red.border : D.muted,
                  borderRadius: '14px',
                  py: 1.75,
                  px: 2,
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  cursor: loading || !isConfirmationValid ? 'not-allowed' : 'pointer',
                  transition: 'transform 150ms ease, box-shadow 150ms ease',
                  '&:hover': isConfirmationValid && !loading ? {
                    transform: 'translateY(-2px)',
                    boxShadow: `6px 6px 0 ${D.red.shadow}`,
                  } : {},
                  '&:active': isConfirmationValid && !loading ? {
                    transform: 'translateY(0)',
                    boxShadow: `1px 1px 0 ${D.red.shadow}`,
                  } : {},
                }}
              >
                <DeleteIcon sx={{ fontSize: 18 }} />
                {loading ? 'Deleting...' : 'Delete Account'}
              </Box>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}
