import React from 'react'
import { Outlet, Link as RouterLink } from 'react-router-dom'
import { Box, Stack, Typography, IconButton, Tooltip, Drawer } from '@mui/material'
import LoginIcon from '@mui/icons-material/Login'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import DashboardIcon from '@mui/icons-material/Dashboard'
import { useColorMode } from '../theme.jsx'
import { useAuth } from '../lib/api.jsx'

// ─── Clay tokens — light + dark ──────────────────────────────────────────────
const TOKENS = {
  light: {
    pageBg: '#FFFDE7',
    borderColor: '#F9A825',
    heading: '#1A237E',
    purple: { bg: '#E1BEE7', border: '#8E24AA', shadow: '#8E24AA' },
    blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
    yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825' },
    red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#C62828' },
  },
  dark: {
    pageBg: '#0F0F1A',
    borderColor: '#F9A825',
    heading: '#E8EAFF',
    purple: { bg: '#1E0A2E', border: '#CE93D8', shadow: '#7B1FA2' },
    blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
    yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#A06800' },
    red:    { bg: '#1F0000', border: '#EF9A9A', shadow: '#B71C1C' },
  },
}

const clayBtn = (c, small = false) => ({
  display: 'inline-flex', alignItems: 'center', gap: 0.6,
  px: small ? 2 : 2.5,
  py: small ? 0.6 : 0.85,
  borderRadius: '12px',
  bgcolor: c.bg,
  border: `2.5px solid ${c.border}`,
  boxShadow: `3px 3px 0 ${c.shadow}`,
  color: c.border,
  fontWeight: 800,
  fontSize: small ? '0.82rem' : '0.88rem',
  textDecoration: 'none',
  cursor: 'pointer',
  userSelect: 'none',
  whiteSpace: 'nowrap',
  transition: 'transform 0.12s, box-shadow 0.12s',
  '&:hover': {
    bgcolor: c.bg,
    transform: 'translate(-2px, -2px)',
    boxShadow: `5px 5px 0 ${c.shadow}`,
    color: c.border,
  },
  '&:active': { transform: 'translate(1px,1px)', boxShadow: `1px 1px 0 ${c.shadow}` },
})

export default function LandingLayout() {
  const { user, loading } = useAuth()
  const { mode, toggle } = useColorMode()
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const T = TOKENS[mode]

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: T.pageBg }}>

      {/* ── Clay Navbar ────────────────────────────────────────────────────── */}
      <Box
        component="nav"
        sx={{
          position: 'sticky', top: 0, zIndex: 1100,
          bgcolor: T.pageBg,
          borderBottom: `2px solid ${T.borderColor}`,
          boxShadow: `0 3px 0 ${T.borderColor}`,
        }}
      >
        <Stack
          direction="row" alignItems="center"
          sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 2, md: 4 }, height: { xs: 58, md: 66 } }}
        >
          {/* Logo */}
          <RouterLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, marginRight: 'auto' }}>
            <Box sx={{
              width: 36, height: 36, borderRadius: '11px',
              bgcolor: T.purple.bg, border: `2px solid ${T.purple.border}`,
              boxShadow: `3px 3px 0 ${T.purple.shadow}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'transform 0.12s, box-shadow 0.12s',
              '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${T.purple.shadow}` },
            }}>
              <AutoAwesomeIcon sx={{ fontSize: 19, color: T.purple.border }} />
            </Box>
            <Typography sx={{ fontWeight: 900, fontSize: '1.2rem', letterSpacing: '-0.02em', color: T.heading }}>
              FARDI
            </Typography>
          </RouterLink>

          {/* Desktop actions */}
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ display: { xs: 'none', sm: 'flex' } }}>
            <Tooltip title={mode === 'light' ? 'Dark mode' : 'Light mode'}>
              <IconButton onClick={toggle} size="small" sx={{
                width: 35, height: 35, borderRadius: '10px',
                bgcolor: T.yellow.bg, border: `2px solid ${T.yellow.border}`,
                boxShadow: `2px 2px 0 ${T.yellow.shadow}`, color: T.yellow.border,
                transition: 'transform 0.12s, box-shadow 0.12s',
                '&:hover': { bgcolor: T.yellow.bg, transform: 'translate(-2px,-2px)', boxShadow: `4px 4px 0 ${T.yellow.shadow}` },
              }}>
                {mode === 'light' ? <DarkModeIcon sx={{ fontSize: 17 }} /> : <LightModeIcon sx={{ fontSize: 17 }} />}
              </IconButton>
            </Tooltip>

            {!loading && !user && (
              <>
                <Box component={RouterLink} to="/login" sx={clayBtn(T.blue)}>
                  <LoginIcon sx={{ fontSize: 15 }} /> Sign In
                </Box>
                <Box component={RouterLink} to="/signup" sx={clayBtn(T.purple)}>
                  <PersonAddIcon sx={{ fontSize: 15 }} /> Sign Up
                </Box>
              </>
            )}
            {!loading && user && (
              <Box component={RouterLink} to="/dashboard" sx={clayBtn(T.purple)}>
                <DashboardIcon sx={{ fontSize: 15 }} /> Dashboard
              </Box>
            )}
          </Stack>

          {/* Mobile hamburger */}
          <IconButton
            onClick={() => setDrawerOpen(true)}
            sx={{
              display: { xs: 'flex', sm: 'none' }, width: 36, height: 36, borderRadius: '10px',
              bgcolor: T.purple.bg, border: `2px solid ${T.purple.border}`,
              boxShadow: `3px 3px 0 ${T.purple.shadow}`, color: T.purple.border,
              '&:hover': { bgcolor: T.purple.bg },
            }}
          >
            <MenuIcon sx={{ fontSize: 19 }} />
          </IconButton>
        </Stack>
      </Box>

      {/* ── Mobile Drawer ───────────────────────────────────────────────────── */}
      <Drawer
        anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            width: 280, bgcolor: T.pageBg,
            borderLeft: `2px solid ${T.borderColor}`,
            boxShadow: `-5px 0 0 ${T.borderColor}`,
            p: 2,
          },
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', color: T.heading }}>Menu</Typography>
          <IconButton
            onClick={() => setDrawerOpen(false)}
            sx={{
              width: 34, height: 34, borderRadius: '10px',
              bgcolor: T.red.bg, border: `2px solid ${T.red.border}`,
              boxShadow: `2px 2px 0 ${T.red.shadow}`, color: T.red.border,
              '&:hover': { bgcolor: T.red.bg },
            }}
          >
            <CloseIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Stack>

        <Stack spacing={1.5}>
          {!loading && !user && (
            <>
              <Box component={RouterLink} to="/login" onClick={() => setDrawerOpen(false)}
                sx={{ ...clayBtn(T.blue), justifyContent: 'center', py: 1.25, fontSize: '0.95rem' }}>
                <LoginIcon sx={{ fontSize: 17 }} /> Sign In
              </Box>
              <Box component={RouterLink} to="/signup" onClick={() => setDrawerOpen(false)}
                sx={{ ...clayBtn(T.purple), justifyContent: 'center', py: 1.25, fontSize: '0.95rem' }}>
                <PersonAddIcon sx={{ fontSize: 17 }} /> Sign Up
              </Box>
            </>
          )}
          {!loading && user && (
            <Box component={RouterLink} to="/dashboard" onClick={() => setDrawerOpen(false)}
              sx={{ ...clayBtn(T.purple), justifyContent: 'center', py: 1.25, fontSize: '0.95rem' }}>
              <DashboardIcon sx={{ fontSize: 17 }} /> Dashboard
            </Box>
          )}
          <Box onClick={() => { toggle(); setDrawerOpen(false) }}
            sx={{ ...clayBtn(T.yellow), justifyContent: 'center', py: 1.25, fontSize: '0.95rem', cursor: 'pointer' }}>
            {mode === 'light' ? <DarkModeIcon sx={{ fontSize: 17 }} /> : <LightModeIcon sx={{ fontSize: 17 }} />}
            {mode === 'light' ? 'Dark Mode' : 'Light Mode'}
          </Box>
        </Stack>
      </Drawer>

      {/* Page content */}
      <Outlet />
    </Box>
  )
}
