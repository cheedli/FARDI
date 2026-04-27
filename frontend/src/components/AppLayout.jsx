import React from 'react'
import { Outlet, Link as RouterLink, useLocation, Navigate, useNavigate } from 'react-router-dom'
import {
  Box, Typography, Stack, Button, Avatar, Chip, IconButton, Tooltip,
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PersonIcon from '@mui/icons-material/Person'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import SchoolIcon from '@mui/icons-material/School'
import GroupIcon from '@mui/icons-material/Group'
import StorefrontIcon from '@mui/icons-material/Storefront'
import CampaignIcon from '@mui/icons-material/Campaign'
import BuildIcon from '@mui/icons-material/Build'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import LockIcon from '@mui/icons-material/Lock'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import MapIcon from '@mui/icons-material/Map'
import LogoutIcon from '@mui/icons-material/Logout'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import BarChartIcon from '@mui/icons-material/BarChart'
import PeopleIcon from '@mui/icons-material/People'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import SecurityIcon from '@mui/icons-material/Security'
import { useColorMode } from '../theme.jsx'
import { useAuth } from '../lib/api.jsx'
import { useUserStats } from '../hooks/useUserStats.jsx'

const LIGHT = {
  pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', border: '#E0E0E0',
  purple: { bg: '#E1BEE7', border: '#8E24AA', shadow: '#8E24AA' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
  yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825' },
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
  orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
  teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
  red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#C62828' },
  indigo: { bg: '#C5CAE9', border: '#3949AB', shadow: '#3949AB' },
}
const DARK = {
  pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', border: '#2A2A4A',
  purple: { bg: '#1E0A2E', border: '#CE93D8', shadow: '#7B1FA2' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#A06800' },
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
  teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
  red:    { bg: '#1F0000', border: '#EF9A9A', shadow: '#B71C1C' },
  indigo: { bg: '#0D0F2A', border: '#7986CB', shadow: '#283593' },
}

// Map legacy hex phase colors to palette keys
const PHASE_COLOR_KEY = ['indigo', 'blue', 'green', 'orange', 'red', 'purple']

const SIDEBAR_W = 260
const SIDEBAR_W_COLLAPSED = 64

const PHASES = [
  { id: 1, title: 'Foundation', subtitle: 'Language Assessment', icon: SchoolIcon, color: '#6366f1', path: '/phase1' },
  { id: 2, title: 'Cultural Planning', subtitle: 'Event Organization', icon: GroupIcon, color: '#0ea5e9', path: '/phase2' },
  { id: 3, title: 'Vendors & Budget', subtitle: 'Negotiation', icon: StorefrontIcon, color: '#10b981', path: '/phase3/step/1' },
  { id: 4, title: 'Marketing', subtitle: 'Promotion & Outreach', icon: CampaignIcon, color: '#f97316', path: '/phase4/step/1' },
  { id: 5, title: 'Execution', subtitle: 'Problem-Solving', icon: BuildIcon, color: '#ef4444', path: '/phase5/subphase/1/step/1' },
  { id: 6, title: 'Reflection', subtitle: 'Evaluation & Feedback', icon: AutoStoriesIcon, color: '#8b5cf6', path: '/phase6/subphase/1/step/1' },
]

export default function AppLayout() {
  const { user, loading } = useAuth()
  const { mode, toggle } = useColorMode()
  const { stats, loading: statsLoading } = useUserStats()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [collapsed, setCollapsed] = React.useState(false)
  const navigate = useNavigate()

  const D = mode === 'dark' ? DARK : LIGHT

  // Active when ?testing=1 is in the URL, or automatically when running inside Electron
  // (Electron serves on a random port, never 5173 which is the Vite dev server)
  const isElectron = window.location.port !== '5173' && window.location.protocol === 'http:'
  const isTesting = isElectron || new URLSearchParams(location.search).get('testing') === '1'
  const isRemedialRoute = location.pathname.includes('remedial') ||
    /\/phase[3-6]/.test(location.pathname) ||
    /\/app\/phase[3-6]/.test(location.pathname)

  const handleTestingSkip = () => {
    if (window.__remedialSkip) {
      window.__remedialSkip()
    }
  }

  // Close drawer on route change
  React.useEffect(() => { setMobileOpen(false) }, [location.pathname])

  if (loading || statsLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: D.pageBg }}>
        <Typography sx={{ color: D.muted }}>Loading...</Typography>
      </Box>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  const userName = user?.first_name || user?.username || 'User'
  const userLevel = stats?.best_level || stats?.overall_level || null
  const isAdmin = user?.is_admin === 1 || user?.role === 'admin'
  const hasCompletedPhase1 = stats?.total_assessments > 0
  const phaseCompletion = stats?.phase_completion || []
  const isPhaseComplete = (n) => phaseCompletion.some(pc => pc.phase_number === n && pc.completed)
  const hasCompletedPhase2 = isPhaseComplete(2) || (stats?.phase2_completed_steps || 0) >= 9
  const hasCompletedPhase3 = isPhaseComplete(3)
  const hasCompletedPhase4 = isPhaseComplete(4)
  const hasCompletedPhase5 = isPhaseComplete(5)

  const getPhaseUnlocked = (id) => {
    if (isTesting) return true
    switch (id) {
      case 1: return true
      case 2: return hasCompletedPhase1
      case 3: return hasCompletedPhase2
      case 4: return hasCompletedPhase3
      case 5: return hasCompletedPhase4
      case 6: return hasCompletedPhase5
      default: return false
    }
  }

  const getPhaseCompleted = (id) => {
    switch (id) {
      case 1: return hasCompletedPhase1
      case 2: return hasCompletedPhase2
      case 3: return hasCompletedPhase3
      case 4: return hasCompletedPhase4
      case 5: return hasCompletedPhase5
      case 6: return isPhaseComplete(6)
      default: return false
    }
  }

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  // Navigate to phase, resuming where the user left off for phases 3+
  const handlePhaseClick = async (phase) => {
    if (phase.id >= 3) {
      try {
        const res = await fetch(`/api/progress/resume?phase=${phase.id}`, { credentials: 'include' })
        const d = await res.json()
        if (d.success && d.data && !d.data.is_complete) {
          const { subphase, step, interaction } = d.data
          let url
          if (subphase) {
            url = `/phase${phase.id}/subphase/${subphase}/step/${step}/interaction/${interaction}`
          } else if (interaction) {
            url = `/phase${phase.id}/step/${step}/interaction/${interaction}`
          } else {
            url = `/phase${phase.id}/step/${step || 1}`
          }
          navigate(url, { state: { resumeFrom: d.data.item_index, previousResponses: d.data.previous_responses, sessionId: d.data.session_id } })
          return
        }
      } catch {}
    }
    navigate(phase.path)
  }

  // Clay nav item styles helper
  const navItemSx = (active, colorKey) => {
    const c = D[colorKey] || D.indigo
    return {
      borderRadius: '10px',
      py: 1,
      px: 1.5,
      mb: 0.5,
      border: active ? `2px solid ${c.border}` : '2px solid transparent',
      borderLeft: active ? `3px solid ${c.border}` : '3px solid transparent',
      bgcolor: active ? c.bg : 'transparent',
      boxShadow: active ? `3px 3px 0 ${c.shadow}` : 'none',
      transition: 'all 0.12s ease',
      '&:hover': active ? {} : {
        bgcolor: D.cardBg,
        border: `2px solid ${D.border}`,
        borderLeft: `3px solid ${D.border}`,
        boxShadow: `3px 3px 0 ${D.border}`,
        transform: 'translate(-1px,-1px)',
      },
      '&:active': {
        transform: 'translate(1px,1px)',
        boxShadow: active ? `2px 2px 0 ${c.shadow}` : `2px 2px 0 ${D.border}`,
      },
    }
  }

  // ── Sidebar content (shared desktop + mobile) ──
  const makeSidebar = (isCollapsible) => (
    <Box sx={{
      display: 'flex', flexDirection: 'column', height: '100%',
      bgcolor: D.pageBg,
    }}>
      {/* Logo */}
      <Box sx={{
        px: isCollapsible && collapsed ? 1 : 2.5, py: 2.5,
        borderBottom: `2px solid ${D.border}`,
        boxShadow: `0 2px 0 ${D.border}`,
        display: 'flex', alignItems: 'center',
        justifyContent: isCollapsible && collapsed ? 'center' : 'space-between',
      }}>
        <RouterLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Box sx={{
            width: 36, height: 36, borderRadius: '11px',
            bgcolor: D.purple.bg,
            border: `2px solid ${D.purple.border}`,
            boxShadow: `3px 3px 0 ${D.purple.shadow}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <AutoAwesomeIcon sx={{ fontSize: 18, color: D.purple.border }} />
          </Box>
          {(!isCollapsible || !collapsed) && (
            <Typography sx={{
              fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em',
              color: D.heading,
            }}>
              FARDI
            </Typography>
          )}
        </RouterLink>
        {isCollapsible && (
          <Tooltip title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} placement="right">
            <IconButton
              onClick={() => setCollapsed(c => !c)}
              size="small"
              sx={{
                width: 28, height: 28,
                borderRadius: '8px',
                color: D.muted,
                border: `2px solid transparent`,
                ml: collapsed ? 0 : 0.5,
                transition: 'all 0.12s ease',
                '&:hover': {
                  bgcolor: D.cardBg,
                  border: `2px solid ${D.border}`,
                  color: D.body,
                  boxShadow: `2px 2px 0 ${D.border}`,
                },
                '&:active': { transform: 'translate(1px,1px)', boxShadow: 'none' },
              }}
            >
              {collapsed
                ? <ChevronRightIcon sx={{ fontSize: 16 }} />
                : <ChevronLeftIcon sx={{ fontSize: 16 }} />}
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Nav links */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: isCollapsible && collapsed ? 0.5 : 1.5, py: 2 }}>
        {isAdmin ? (
          <>
            {/* Admin badge */}
            {(!isCollapsible || !collapsed) && (
              <Box sx={{ px: 1, mb: 2 }}>
                <Box sx={{
                  display: 'flex', alignItems: 'center', gap: 1,
                  px: 1.5, py: 0.8, borderRadius: '10px',
                  bgcolor: D.red.bg,
                  border: `2px solid ${D.red.border}`,
                  boxShadow: `3px 3px 0 ${D.red.shadow}`,
                }}>
                  <SecurityIcon sx={{ fontSize: 16, color: D.red.border }} />
                  <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: D.red.border, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Admin Panel
                  </Typography>
                </Box>
              </Box>
            )}

            {(!isCollapsible || !collapsed) && (
              <Typography sx={{ px: 1, mb: 1, fontSize: '0.68rem', fontWeight: 600, color: D.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Overview
              </Typography>
            )}
            <List disablePadding>
              {[
                { to: '/admin', icon: <DashboardIcon />, label: 'Dashboard', colorKey: 'indigo' },
                { to: '/admin/analytics', icon: <BarChartIcon />, label: 'Analytics', colorKey: 'blue' },
              ].map((item) => {
                const active = location.pathname === item.to
                const c = D[item.colorKey]
                const isCollapsed = isCollapsible && collapsed
                return (
                  <ListItem key={item.to} disablePadding sx={{ mb: 0.5 }}>
                    <Tooltip title={isCollapsed ? item.label : ''} placement="right">
                      <ListItemButton
                        component={RouterLink} to={item.to}
                        sx={{ ...navItemSx(active, item.colorKey), justifyContent: isCollapsed ? 'center' : 'flex-start', px: isCollapsed ? 1 : 1.5 }}
                      >
                        <ListItemIcon sx={{ color: active ? c.border : D.muted, minWidth: isCollapsed ? 0 : 36 }}>
                          {React.cloneElement(item.icon, { sx: { fontSize: 20 } })}
                        </ListItemIcon>
                        {!isCollapsed && (
                          <ListItemText primary={
                            <Typography sx={{ fontWeight: active ? 700 : 500, fontSize: '0.88rem', color: active ? c.border : D.body }}>
                              {item.label}
                            </Typography>
                          } />
                        )}
                      </ListItemButton>
                    </Tooltip>
                  </ListItem>
                )
              })}
            </List>

            {(!isCollapsible || !collapsed) && (
              <Typography sx={{ px: 1, mt: 2.5, mb: 1, fontSize: '0.68rem', fontWeight: 600, color: D.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Students
              </Typography>
            )}
            <List disablePadding>
              {[
                { to: '/admin/users', icon: <PeopleIcon />, label: 'All Students', colorKey: 'green', match: '/admin/users' },
              ].map((item) => {
                const active = isActive(item.match || item.to)
                const c = D[item.colorKey]
                const isCollapsed = isCollapsible && collapsed
                return (
                  <ListItem key={item.to} disablePadding sx={{ mb: 0.5 }}>
                    <Tooltip title={isCollapsed ? item.label : ''} placement="right">
                      <ListItemButton
                        component={RouterLink} to={item.to}
                        sx={{ ...navItemSx(active, item.colorKey), justifyContent: isCollapsed ? 'center' : 'flex-start', px: isCollapsed ? 1 : 1.5 }}
                      >
                        <ListItemIcon sx={{ color: active ? c.border : D.muted, minWidth: isCollapsed ? 0 : 36 }}>
                          {React.cloneElement(item.icon, { sx: { fontSize: 20 } })}
                        </ListItemIcon>
                        {!isCollapsed && (
                          <ListItemText primary={
                            <Typography sx={{ fontWeight: active ? 700 : 500, fontSize: '0.88rem', color: active ? c.border : D.body }}>
                              {item.label}
                            </Typography>
                          } />
                        )}
                      </ListItemButton>
                    </Tooltip>
                  </ListItem>
                )
              })}
            </List>

            {(!isCollapsible || !collapsed) && (
              <Typography sx={{ px: 1, mt: 2.5, mb: 1, fontSize: '0.68rem', fontWeight: 600, color: D.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Communication
              </Typography>
            )}
            <List disablePadding>
              {[
                { to: '/admin/chat', icon: <ChatBubbleOutlineIcon />, label: 'Messages', colorKey: 'orange', match: '/admin/chat' },
              ].map((item) => {
                const active = isActive(item.match || item.to)
                const c = D[item.colorKey]
                const isCollapsed = isCollapsible && collapsed
                return (
                  <ListItem key={item.to} disablePadding sx={{ mb: 0.5 }}>
                    <Tooltip title={isCollapsed ? item.label : ''} placement="right">
                      <ListItemButton
                        component={RouterLink} to={item.to}
                        sx={{ ...navItemSx(active, item.colorKey), justifyContent: isCollapsed ? 'center' : 'flex-start', px: isCollapsed ? 1 : 1.5 }}
                      >
                        <ListItemIcon sx={{ color: active ? c.border : D.muted, minWidth: isCollapsed ? 0 : 36 }}>
                          {React.cloneElement(item.icon, { sx: { fontSize: 20 } })}
                        </ListItemIcon>
                        {!isCollapsed && (
                          <ListItemText primary={
                            <Typography sx={{ fontWeight: active ? 700 : 500, fontSize: '0.88rem', color: active ? c.border : D.body }}>
                              {item.label}
                            </Typography>
                          } />
                        )}
                      </ListItemButton>
                    </Tooltip>
                  </ListItem>
                )
              })}
            </List>

            {(!isCollapsible || !collapsed) && (
              <Typography sx={{ px: 1, mt: 2.5, mb: 1, fontSize: '0.68rem', fontWeight: 600, color: D.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Account
              </Typography>
            )}
            <List disablePadding>
              {[
                { to: '/profile', icon: <PersonIcon />, label: 'Profile', colorKey: 'teal' },
              ].map((item) => {
                const active = isActive(item.to)
                const c = D[item.colorKey]
                const isCollapsed = isCollapsible && collapsed
                return (
                  <ListItem key={item.to} disablePadding sx={{ mb: 0.5 }}>
                    <Tooltip title={isCollapsed ? item.label : ''} placement="right">
                      <ListItemButton
                        component={RouterLink} to={item.to}
                        sx={{ ...navItemSx(active, item.colorKey), justifyContent: isCollapsed ? 'center' : 'flex-start', px: isCollapsed ? 1 : 1.5 }}
                      >
                        <ListItemIcon sx={{ color: active ? c.border : D.muted, minWidth: isCollapsed ? 0 : 36 }}>
                          {React.cloneElement(item.icon, { sx: { fontSize: 20 } })}
                        </ListItemIcon>
                        {!isCollapsed && (
                          <ListItemText primary={
                            <Typography sx={{ fontWeight: active ? 700 : 500, fontSize: '0.88rem', color: active ? c.border : D.body }}>
                              {item.label}
                            </Typography>
                          } />
                        )}
                      </ListItemButton>
                    </Tooltip>
                  </ListItem>
                )
              })}
            </List>
          </>
        ) : (
          <>
            {(!isCollapsible || !collapsed) && (
              <Typography sx={{ px: 1, mb: 1, fontSize: '0.68rem', fontWeight: 600, color: D.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Menu
              </Typography>
            )}
            <List disablePadding>
              {[
                { to: '/dashboard', icon: <DashboardIcon />, label: 'Dashboard', colorKey: 'indigo' },
                { to: '/chat', icon: <ChatBubbleOutlineIcon />, label: 'Messages', colorKey: 'orange' },
                { to: '/profile', icon: <PersonIcon />, label: 'Profile', colorKey: 'teal' },
                { to: '/phase-journey', icon: <MapIcon />, label: 'Learning Journey', colorKey: 'blue' },
                { to: '/characters', icon: <GroupIcon />, label: 'Characters', colorKey: 'purple' },
                { to: '/documentation', icon: <MenuBookIcon />, label: 'Documentation', colorKey: 'green' },
              ].map((item) => {
                const active = isActive(item.to)
                const c = D[item.colorKey]
                const isCollapsed = isCollapsible && collapsed
                return (
                  <ListItem key={item.to} disablePadding sx={{ mb: 0.5 }}>
                    <Tooltip title={isCollapsed ? item.label : ''} placement="right">
                      <ListItemButton
                        component={RouterLink} to={item.to}
                        sx={{ ...navItemSx(active, item.colorKey), justifyContent: isCollapsed ? 'center' : 'flex-start', px: isCollapsed ? 1 : 1.5 }}
                      >
                        <ListItemIcon sx={{ color: active ? c.border : D.muted, minWidth: isCollapsed ? 0 : 36 }}>
                          {React.cloneElement(item.icon, { sx: { fontSize: 20 } })}
                        </ListItemIcon>
                        {!isCollapsed && (
                          <ListItemText primary={
                            <Typography sx={{ fontWeight: active ? 700 : 500, fontSize: '0.88rem', color: active ? c.border : D.body }}>
                              {item.label}
                            </Typography>
                          } />
                        )}
                      </ListItemButton>
                    </Tooltip>
                  </ListItem>
                )
              })}
            </List>

            {/* Phases */}
            {(!isCollapsible || !collapsed) && (
              <Typography sx={{ px: 1, mt: 2.5, mb: 1, fontSize: '0.68rem', fontWeight: 600, color: D.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Phases
              </Typography>
            )}
            <List disablePadding>
              {PHASES.map((phase) => {
                const unlocked = getPhaseUnlocked(phase.id)
                const completed = getPhaseCompleted(phase.id)
                const IconComp = phase.icon
                const active = isActive(phase.path) ||
                  (phase.id === 1 && (isActive('/game') || isActive('/phase1'))) ||
                  (phase.id === 2 && isActive('/phase2')) ||
                  (phase.id === 3 && isActive('/phase3')) ||
                  (phase.id === 4 && isActive('/phase4')) ||
                  (phase.id === 5 && isActive('/phase5')) ||
                  (phase.id === 6 && isActive('/phase6'))
                const colorKey = PHASE_COLOR_KEY[phase.id - 1]
                const c = D[colorKey]
                const isCollapsed = isCollapsible && collapsed

                return (
                  <ListItem key={phase.id} disablePadding sx={{ mb: 0.5 }}>
                    <Tooltip title={isCollapsed ? `Phase ${phase.id}: ${phase.title}` : ''} placement="right">
                      <span style={{ width: '100%' }}>
                        <ListItemButton
                          onClick={unlocked ? () => handlePhaseClick(phase) : undefined}
                          disabled={!unlocked}
                          sx={{
                            borderRadius: '10px',
                            py: 1,
                            px: isCollapsed ? 1 : 1.5,
                            justifyContent: isCollapsed ? 'center' : 'flex-start',
                            opacity: unlocked ? 1 : 0.45,
                            border: active ? `2px solid ${c.border}` : '2px solid transparent',
                            borderLeft: active ? `3px solid ${c.border}` : '3px solid transparent',
                            bgcolor: active ? c.bg : 'transparent',
                            boxShadow: active ? `3px 3px 0 ${c.shadow}` : 'none',
                            transition: 'all 0.12s ease',
                            '&:hover': (unlocked && !active) ? {
                              bgcolor: D.cardBg,
                              border: `2px solid ${D.border}`,
                              borderLeft: `3px solid ${D.border}`,
                              boxShadow: `3px 3px 0 ${D.border}`,
                              transform: 'translate(-1px,-1px)',
                            } : {},
                            '&:active': unlocked ? {
                              transform: 'translate(1px,1px)',
                              boxShadow: `2px 2px 0 ${active ? c.shadow : D.border}`,
                            } : {},
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: isCollapsed ? 0 : 36 }}>
                            <Box sx={{
                              width: 28, height: 28,
                              borderRadius: '8px',
                              bgcolor: unlocked ? c.bg : D.border,
                              border: unlocked ? `2px solid ${c.border}` : `2px solid ${D.border}`,
                              boxShadow: unlocked ? `2px 2px 0 ${c.shadow}` : 'none',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              {completed ? (
                                <CheckCircleIcon sx={{ fontSize: 14, color: c.border }} />
                              ) : !unlocked ? (
                                <LockIcon sx={{ fontSize: 13, color: D.muted }} />
                              ) : (
                                <IconComp sx={{ fontSize: 14, color: c.border }} />
                              )}
                            </Box>
                          </ListItemIcon>
                          {!isCollapsed && (
                            <>
                              <ListItemText
                                primary={
                                  <Typography sx={{ fontWeight: active ? 700 : 500, fontSize: '0.85rem', color: unlocked ? (active ? c.border : D.body) : D.muted }}>
                                    Phase {phase.id}
                                  </Typography>
                                }
                                secondary={
                                  <Typography sx={{ fontSize: '0.72rem', color: D.muted }}>
                                    {phase.title}
                                  </Typography>
                                }
                              />
                              {completed && (
                                <Chip size="small" label="Done" sx={{
                                  height: 20,
                                  fontSize: '0.6rem',
                                  fontWeight: 700,
                                  bgcolor: D.green.bg,
                                  border: `2px solid ${D.green.border}`,
                                  color: D.green.border,
                                  borderRadius: '50px',
                                  boxShadow: `2px 2px 0 ${D.green.shadow}`,
                                }} />
                              )}
                            </>
                          )}
                        </ListItemButton>
                      </span>
                    </Tooltip>
                  </ListItem>
                )
              })}
            </List>
          </>
        )}

        {/* Theme toggle */}
        <Box sx={{ my: 2, mx: 0.5, height: '2px', bgcolor: D.border }} />
        <ListItem disablePadding>
          <Tooltip title={(isCollapsible && collapsed) ? (mode === 'light' ? 'Dark Mode' : 'Light Mode') : ''} placement="right">
            <ListItemButton
              onClick={toggle}
              sx={{
                borderRadius: '12px',
                py: 1, px: isCollapsible && collapsed ? 1 : 1.5,
                justifyContent: isCollapsible && collapsed ? 'center' : 'flex-start',
                bgcolor: D.yellow.bg,
                border: `2px solid ${D.yellow.border}`,
                boxShadow: `4px 4px 0 ${D.yellow.shadow}`,
                transition: 'all 0.12s ease',
                '&:hover': {
                  transform: 'translate(-2px,-2px)',
                  boxShadow: `6px 6px 0 ${D.yellow.shadow}`,
                },
                '&:active': {
                  transform: 'translate(1px,1px)',
                  boxShadow: `2px 2px 0 ${D.yellow.shadow}`,
                },
              }}
            >
              <ListItemIcon sx={{ color: D.yellow.border, minWidth: isCollapsible && collapsed ? 0 : 36 }}>
                {mode === 'light' ? <DarkModeIcon sx={{ fontSize: 20 }} /> : <LightModeIcon sx={{ fontSize: 20 }} />}
              </ListItemIcon>
              {(!isCollapsible || !collapsed) && (
                <ListItemText primary={
                  <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: D.yellow.border }}>
                    {mode === 'light' ? 'Dark Mode' : 'Light Mode'}
                  </Typography>
                } />
              )}
            </ListItemButton>
          </Tooltip>
        </ListItem>
      </Box>

      {/* User section (pinned bottom) */}
      <Box sx={{
        borderTop: `2px solid ${D.border}`,
        p: isCollapsible && collapsed ? 1 : 2,
        bgcolor: D.cardBg,
      }}>
        {isCollapsible && collapsed ? (
          <Stack alignItems="center" spacing={1}>
            <Tooltip title={userName} placement="right">
              <Avatar sx={{
                width: 36, height: 36,
                bgcolor: D.purple.bg,
                border: `2px solid ${D.purple.border}`,
                boxShadow: `3px 3px 0 ${D.purple.shadow}`,
                fontSize: '0.85rem', fontWeight: 700,
                color: D.purple.border,
              }}>
                {userName[0].toUpperCase()}
              </Avatar>
            </Tooltip>
            <Tooltip title="Logout" placement="right">
              <IconButton
                href="/auth/logout"
                size="small"
                sx={{
                  width: 32, height: 32, borderRadius: '8px',
                  color: D.muted,
                  border: `2px solid transparent`,
                  transition: 'all 0.12s ease',
                  '&:hover': {
                    bgcolor: D.red.bg,
                    border: `2px solid ${D.red.border}`,
                    color: D.red.border,
                    boxShadow: `2px 2px 0 ${D.red.shadow}`,
                  },
                  '&:active': { transform: 'translate(1px,1px)', boxShadow: 'none' },
                }}
              >
                <LogoutIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Stack>
        ) : (
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar sx={{
              width: 36, height: 36,
              bgcolor: D.purple.bg,
              border: `2px solid ${D.purple.border}`,
              boxShadow: `3px 3px 0 ${D.purple.shadow}`,
              fontSize: '0.85rem', fontWeight: 700,
              color: D.purple.border,
            }}>
              {userName[0].toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontWeight: 600, fontSize: '0.88rem', color: D.heading, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {userName}
              </Typography>
              {isAdmin ? (
                <Chip size="small" label="Admin" sx={{
                  height: 20, mt: 0.3, fontSize: '0.6rem', fontWeight: 700,
                  bgcolor: D.red.bg,
                  color: D.red.border,
                  border: `2px solid ${D.red.border}`,
                  borderRadius: '50px',
                  boxShadow: `2px 2px 0 ${D.red.shadow}`,
                }} />
              ) : userLevel ? (
                <Chip size="small" label={`CEFR ${userLevel}`} sx={{
                  height: 20, mt: 0.3, fontSize: '0.6rem', fontWeight: 700,
                  bgcolor: D.purple.bg,
                  color: D.purple.border,
                  border: `2px solid ${D.purple.border}`,
                  borderRadius: '50px',
                  boxShadow: `2px 2px 0 ${D.purple.shadow}`,
                }} />
              ) : null}
            </Box>
            <Tooltip title="Logout">
              <IconButton
                href="/auth/logout"
                size="small"
                sx={{
                  width: 32, height: 32, borderRadius: '8px',
                  color: D.muted,
                  border: `2px solid transparent`,
                  transition: 'all 0.12s ease',
                  '&:hover': {
                    bgcolor: D.red.bg,
                    border: `2px solid ${D.red.border}`,
                    color: D.red.border,
                    boxShadow: `2px 2px 0 ${D.red.shadow}`,
                  },
                  '&:active': { transform: 'translate(1px,1px)', boxShadow: 'none' },
                }}
              >
                <LogoutIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      </Box>
    </Box>
  )

  const sidebarW = collapsed ? SIDEBAR_W_COLLAPSED : SIDEBAR_W

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: D.pageBg }}>
      {/* Desktop sidebar — fixed, collapsible */}
      <Box component="nav" sx={{ width: sidebarW, flexShrink: 0, display: { xs: 'none', md: 'block' }, transition: 'width 0.2s ease' }}>
        <Box sx={{
          width: sidebarW, height: '100vh', position: 'fixed', top: 0, left: 0,
          borderRight: `2px solid ${D.border}`,
          boxShadow: `3px 0 0 ${D.border}`,
          overflowY: 'auto',
          overflowX: 'hidden',
          bgcolor: D.pageBg,
          transition: 'width 0.2s ease',
        }}>
          {makeSidebar(true)}
        </Box>
      </Box>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: SIDEBAR_W,
            border: 'none',
            borderRight: `2px solid ${D.border}`,
            bgcolor: D.pageBg,
          },
        }}
      >
        {makeSidebar(false)}
      </Drawer>

      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1, minHeight: '100vh', width: { xs: '100%', md: `calc(100% - ${sidebarW}px)` }, transition: 'width 0.2s ease', bgcolor: D.pageBg }}>
        {/* Mobile header bar */}
        <Box sx={{
          display: { xs: 'flex', md: 'none' },
          alignItems: 'center',
          px: 2, py: 1.5,
          borderBottom: `2px solid ${D.border}`,
          boxShadow: `0 2px 0 ${D.border}`,
          bgcolor: D.pageBg,
          position: 'sticky', top: 0, zIndex: 1000,
        }}>
          <IconButton
            onClick={() => setMobileOpen(true)}
            sx={{
              mr: 1.5,
              width: 36, height: 36,
              borderRadius: '10px',
              bgcolor: D.purple.bg,
              border: `2px solid ${D.purple.border}`,
              boxShadow: `3px 3px 0 ${D.purple.shadow}`,
              color: D.purple.border,
              transition: 'all 0.12s ease',
              '&:hover': {
                transform: 'translate(-2px,-2px)',
                boxShadow: `5px 5px 0 ${D.purple.shadow}`,
              },
              '&:active': {
                transform: 'translate(1px,1px)',
                boxShadow: `2px 2px 0 ${D.purple.shadow}`,
              },
            }}
          >
            <MenuIcon sx={{ fontSize: 20 }} />
          </IconButton>
          <RouterLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Box sx={{
              width: 28, height: 28, borderRadius: '9px',
              bgcolor: D.purple.bg,
              border: `2px solid ${D.purple.border}`,
              boxShadow: `2px 2px 0 ${D.purple.shadow}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <AutoAwesomeIcon sx={{ fontSize: 14, color: D.purple.border }} />
            </Box>
            <Typography sx={{
              fontWeight: 800, fontSize: '1rem',
              color: D.heading,
            }}>
              FARDI
            </Typography>
          </RouterLink>
        </Box>

        <Outlet />

        {/* Testing skip button — shown on all remedial routes when ?testing=1 */}
        {isTesting && isRemedialRoute && (
          <Box sx={{
            position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          }}>
            <Button
              onClick={handleTestingSkip}
              variant="contained"
              endIcon={<SkipNextIcon />}
              sx={{
                bgcolor: '#f59e0b', color: '#fff',
                fontWeight: 800, fontSize: '0.85rem', textTransform: 'none',
                borderRadius: '14px', px: 2.5, py: 1,
                border: '2px solid #d97706',
                boxShadow: '4px 4px 0 #d97706',
                '&:hover': { bgcolor: '#d97706', transform: 'translate(-2px,-2px)', boxShadow: '6px 6px 0 #b45309' },
                transition: 'all 0.12s ease',
              }}
            >
              Skip →
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  )
}
