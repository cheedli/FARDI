import React, { useState, useEffect, useCallback } from 'react'
import {
  Box, Typography, Stack, Chip, CircularProgress, useTheme,
  Drawer, List, ListItemButton, ListItemText, IconButton, useMediaQuery,
} from '@mui/material'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const LIGHT = {
  pageBg:  '#FFFDE7',
  sidebar: '#ffffff',
  cardBg:  '#ffffff',
  heading: '#1A237E',
  body:    '#37474F',
  muted:   '#78909C',
  border:  '#E0E0E0',
  active:  '#BBDEFB',
  activeBorder: '#1976D2',
  codeBg:  '#F5F5F5',
  pre:     '#263238',
  preBg:   '#1A1A2E',
}
const DARK = {
  pageBg:  '#0F0F1A',
  sidebar: '#1A1A2E',
  cardBg:  '#1A1A2E',
  heading: '#E8EAFF',
  body:    '#B0BEC5',
  muted:   '#607D8B',
  border:  '#2A2A4A',
  active:  '#0A1929',
  activeBorder: '#64B5F6',
  codeBg:  '#12121F',
  pre:     '#90CAF9',
  preBg:   '#0A0A18',
}

const DOCS = [
  { id: 'README',                  label: 'Index',                    chip: 'Start' },
  { id: '01-overview',             label: '01 · Overview',            chip: 'Platform' },
  { id: '02-architecture',         label: '02 · Architecture',        chip: 'Tech' },
  { id: '03-phase-system',         label: '03 · Phase System',        chip: 'Phases' },
  { id: '04-exercise-types',       label: '04 · Exercise Types',      chip: 'UI' },
  { id: '05-api-reference',        label: '05 · API Reference',       chip: 'API' },
  { id: '06-frontend-components',  label: '06 · Frontend Components', chip: 'React' },
  { id: '07-theming-and-design',   label: '07 · Theming & Design',    chip: 'Design' },
  { id: '08-setup-and-deployment', label: '08 · Setup & Deployment',  chip: 'DevOps' },
  { id: '09-developer-guide',      label: '09 · Developer Guide',     chip: 'Dev' },
]

const CHIP_COLORS = {
  Start:    '#1976D2',
  Platform: '#8E24AA',
  Tech:     '#0097A7',
  Phases:   '#F57C00',
  UI:       '#388E3C',
  API:      '#C62828',
  React:    '#1565C0',
  Design:   '#AD1457',
  DevOps:   '#37474F',
  Dev:      '#558B2F',
}

const SIDEBAR_W = 240

export default function Documentation() {
  const theme = useTheme()
  const dark = theme.palette.mode === 'dark'
  const C = dark ? DARK : LIGHT
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [activeDoc, setActiveDoc] = useState('README')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const loadDoc = useCallback(async (id) => {
    setLoading(true)
    setContent('')
    try {
      const res = await fetch(`/docs/${id}.md`)
      if (!res.ok) throw new Error('Not found')
      const text = await res.text()
      setContent(text)
    } catch {
      setContent('*Documentation file could not be loaded.*')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDoc(activeDoc)
  }, [activeDoc, loadDoc])

  const handleSelect = (id) => {
    setActiveDoc(id)
    if (isMobile) setDrawerOpen(false)
  }

  const sidebarContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: C.sidebar }}>
      {/* Sidebar header */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 2, py: 2, borderBottom: `1px solid ${C.border}` }}>
        <MenuBookIcon sx={{ color: C.activeBorder, fontSize: 20 }} />
        <Typography variant="subtitle1" fontWeight={700} sx={{ color: C.heading, letterSpacing: 0.3 }}>
          Docs
        </Typography>
        {isMobile && (
          <IconButton size="small" onClick={() => setDrawerOpen(false)} sx={{ ml: 'auto' }}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Stack>

      {/* Nav list */}
      <List disablePadding sx={{ flex: 1, overflowY: 'auto', py: 1 }}>
        {DOCS.map((doc) => {
          const isActive = doc.id === activeDoc
          return (
            <ListItemButton
              key={doc.id}
              selected={isActive}
              onClick={() => handleSelect(doc.id)}
              sx={{
                mx: 1, mb: 0.5, borderRadius: 2,
                borderLeft: isActive ? `3px solid ${C.activeBorder}` : '3px solid transparent',
                bgcolor: isActive ? C.active : 'transparent',
                '&:hover': { bgcolor: C.active },
                transition: 'all 0.15s',
              }}
            >
              <ListItemText
                primary={doc.label}
                primaryTypographyProps={{
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 400,
                  color: isActive ? C.activeBorder : C.body,
                }}
              />
              <Chip
                label={doc.chip}
                size="small"
                sx={{
                  fontSize: 9, height: 16, fontWeight: 700,
                  bgcolor: CHIP_COLORS[doc.chip] + '22',
                  color: CHIP_COLORS[doc.chip],
                  border: `1px solid ${CHIP_COLORS[doc.chip]}44`,
                }}
              />
            </ListItemButton>
          )
        })}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', height: '100%', bgcolor: C.pageBg, minHeight: '100vh' }}>

      {/* Sidebar — permanent on desktop, drawer on mobile */}
      {isMobile ? (
        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{ sx: { width: SIDEBAR_W, bgcolor: C.sidebar } }}
        >
          {sidebarContent}
        </Drawer>
      ) : (
        <Box sx={{
          width: SIDEBAR_W, flexShrink: 0, borderRight: `1px solid ${C.border}`,
          position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
        }}>
          {sidebarContent}
        </Box>
      )}

      {/* Main content */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: { xs: 2, md: 4 } }}>
        {/* Mobile header */}
        {isMobile && (
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <IconButton onClick={() => setDrawerOpen(true)} size="small">
              <MenuIcon />
            </IconButton>
            <Typography variant="subtitle2" sx={{ color: C.muted }}>
              {DOCS.find(d => d.id === activeDoc)?.label}
            </Typography>
          </Stack>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{
            maxWidth: 860, mx: 'auto',
            '& h1': {
              fontSize: '2rem', fontWeight: 800, color: C.heading,
              borderBottom: `2px solid ${C.border}`, pb: 1, mb: 2, mt: 0,
            },
            '& h2': {
              fontSize: '1.4rem', fontWeight: 700, color: C.heading,
              mt: 4, mb: 1.5, borderBottom: `1px solid ${C.border}`, pb: 0.5,
            },
            '& h3': { fontSize: '1.1rem', fontWeight: 700, color: C.heading, mt: 3, mb: 1 },
            '& h4': { fontSize: '1rem', fontWeight: 600, color: C.heading, mt: 2, mb: 0.5 },
            '& p':  { color: C.body, lineHeight: 1.8, mb: 1.5 },
            '& li': { color: C.body, lineHeight: 1.8, mb: 0.5 },
            '& ul, & ol': { pl: 3, mb: 1.5 },
            '& a':  { color: C.activeBorder },
            '& strong': { color: C.heading, fontWeight: 700 },
            '& blockquote': {
              borderLeft: `4px solid ${C.activeBorder}`,
              pl: 2, ml: 0, my: 2,
              color: C.muted,
              fontStyle: 'italic',
            },
            '& code': {
              fontFamily: 'monospace',
              fontSize: '0.85em',
              bgcolor: C.codeBg,
              color: dark ? '#90CAF9' : '#B71C1C',
              px: 0.5, py: 0.1, borderRadius: 0.5,
            },
            '& pre': {
              bgcolor: C.preBg,
              border: `1px solid ${C.border}`,
              borderRadius: 2,
              p: 2,
              overflowX: 'auto',
              mb: 2,
              '& code': {
                bgcolor: 'transparent',
                color: dark ? '#90CAF9' : '#E3F2FD',
                fontSize: '0.82rem',
              },
            },
            '& table': {
              width: '100%', borderCollapse: 'collapse', mb: 2,
              fontSize: '0.88rem',
            },
            '& th': {
              bgcolor: dark ? '#12121F' : '#EDE7F6',
              color: C.heading, fontWeight: 700,
              border: `1px solid ${C.border}`,
              px: 1.5, py: 0.75, textAlign: 'left',
            },
            '& td': {
              border: `1px solid ${C.border}`,
              px: 1.5, py: 0.75, color: C.body,
            },
            '& tr:nth-of-type(even) td': {
              bgcolor: dark ? '#12121F' : '#FAFAFA',
            },
            '& hr': { borderColor: C.border, my: 3 },
          }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </Box>
        )}
      </Box>
    </Box>
  )
}
