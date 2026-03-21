import React, { useEffect, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import { Box, Paper, Typography, Stack, Button, LinearProgress, Chip, Grid, Divider, Dialog, DialogTitle, DialogContent, DialogActions, RadioGroup, FormControlLabel, Radio, TextField, Alert, Accordion, AccordionSummary, AccordionDetails, Tooltip, IconButton, Avatar } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import SchoolIcon from '@mui/icons-material/School'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import StarIcon from '@mui/icons-material/Star'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LockIcon from '@mui/icons-material/Lock'
import PsychologyIcon from '@mui/icons-material/Psychology'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import RefreshIcon from '@mui/icons-material/Refresh'
import DashboardIcon from '@mui/icons-material/Dashboard'

// ─── Clay palette ────────────────────────────────────────────────────────────
const CLAY_LIGHT = {
  pageBg: '#FFFDE7', cardBg: '#ffffff',
  heading: '#1A237E', body: '#37474F', muted: '#78909C', divider: '#E0E0E0',
  purple: { bg: '#E1BEE7', border: '#8E24AA', shadow: '#8E24AA', text: '#4A148C' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
  yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825', text: '#5D4037' },
  orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
  red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#C62828' },
}
const CLAY_DARK = {
  pageBg: '#0F0F1A', cardBg: '#1A1A2E',
  heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', divider: '#2A2A4A',
  purple: { bg: '#1E0A2E', border: '#CE93D8', shadow: '#7B1FA2', text: '#CE93D8' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#A06800', text: '#FFD54F' },
  orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
  red:    { bg: '#1F0000', border: '#EF9A9A', shadow: '#B71C1C' },
}

function ClayCard({ children, color, sx = {} }) {
  return (
    <Box sx={{
      bgcolor: '#ffffff',
      border: `2px solid ${color?.border || '#E0E0E0'}`,
      boxShadow: `4px 4px 0 ${color?.shadow || '#E0E0E0'}`,
      borderRadius: '16px',
      p: 3,
      ...sx,
    }}>
      {children}
    </Box>
  )
}

const CEFR_META = {
  A1: { name: 'Beginner', color: '#94a3b8', bg: '#f8fafc', workplace: 'Simple greetings and basic personal information', rank: 1 },
  A2: { name: 'Elementary', color: '#60a5fa', bg: '#eff6ff', workplace: 'Simple work conversations and basic instructions', rank: 2 },
  B1: { name: 'Intermediate', color: '#34d399', bg: '#ecfdf5', workplace: 'Meetings, customer service, simple reports', rank: 3 },
  B2: { name: 'Upper-Intermediate', color: '#f59e0b', bg: '#fffbeb', workplace: 'Lead meetings, present ideas, complex negotiations', rank: 4 },
  C1: { name: 'Advanced', color: '#a78bfa', bg: '#f5f3ff', workplace: 'Strategic discussions, complex documents, mentoring', rank: 5 },
  C2: { name: 'Proficient', color: '#fb7185', bg: '#fff1f2', workplace: 'Native-like proficiency in all professional situations', rank: 6 },
}

const SKILLS = [
  { label: 'Vocabulary', key: 'vocabulary', color: '#34d399' },
  { label: 'Grammar', key: 'grammar', color: '#60a5fa' },
  { label: 'Fluency', key: 'fluency', color: '#f59e0b' },
  { label: 'Spelling', key: 'spelling', color: '#fb7185' },
  { label: 'Comprehension', key: 'comprehension', color: '#a78bfa' },
]

const levelToPct = (lv) => ({ A1: 17, A2: 33, B1: 50, B2: 67, C1: 83, C2: 100 }[lv] || 0)

function LevelBadge({ level, size = 120 }) {
  const meta = CEFR_META[level] || { name: level, color: '#6366f1', bg: '#f5f3ff' }
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <Box sx={{
        width: size, height: size, borderRadius: '50%',
        background: `conic-gradient(${meta.color} ${levelToPct(level)}%, transparent 0%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        p: '4px'
      }}>
        <Box sx={{
          width: size - 12, height: size - 12, borderRadius: '50%',
          bgcolor: 'background.paper',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <Typography sx={{ fontSize: size * 0.28, fontWeight: 800, color: meta.color, lineHeight: 1 }}>{level}</Typography>
          <Typography sx={{ fontSize: size * 0.11, fontWeight: 600, color: 'text.secondary', mt: 0.5 }}>{meta.name}</Typography>
        </Box>
      </Box>
    </Box>
  )
}

function SkillBar({ label, level, color }) {
  const pct = levelToPct(level)
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.8 }}>
        <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#37474F' }}>{label}</Typography>
        <Box sx={{ px: 1.5, py: 0.3, borderRadius: '20px', bgcolor: color + '20', border: `1.5px solid ${color}`, boxShadow: `2px 2px 0 ${color}40` }}>
          <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color }}>{level || '—'}</Typography>
        </Box>
      </Stack>
      <Box sx={{ height: 10, borderRadius: '50px', bgcolor: color + '18', border: `1.5px solid ${color}40`, overflow: 'hidden' }}>
        <Box sx={{ height: '100%', borderRadius: '50px', bgcolor: color, width: `${pct}%`, transition: 'width 1s ease' }} />
      </Box>
    </Box>
  )
}

export default function Results() {
  const theme = useTheme()
  const C = theme.palette.mode === 'dark' ? CLAY_DARK : CLAY_LIGHT
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [challenge, setChallenge] = useState(null)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [coaching, setCoaching] = useState({})
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetch('/api/results', { credentials: 'include' })
      .then(async r => { if (!r.ok) throw new Error('Failed to load results'); return r.json() })
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!data) return
    fetch(`/api/next-challenge?level=${encodeURIComponent(data.overall_level)}`, { credentials: 'include' })
      .then(async r => r.json())
      .then(setChallenge)
      .catch(() => {})
  }, [data])

  // Confetti
  useEffect(() => {
    if (!data) return
    let rafId
    const canvas = document.createElement('canvas')
    Object.assign(canvas.style, { position: 'fixed', top: '0', left: '0', pointerEvents: 'none', zIndex: '1000' })
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    document.body.appendChild(canvas)
    const ctx = canvas.getContext('2d')
    const colors = ['#1e3a8a', '#6366f1', '#34d399', '#f59e0b', '#fb7185']
    const pieces = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width, y: -20 - Math.random() * 100,
      r: Math.random() * 7 + 3, rot: Math.random() * 360,
      v: Math.random() * 2 + 1, col: colors[Math.floor(Math.random() * colors.length)]
    }))
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      pieces.forEach(p => {
        p.y += p.v; p.rot += 3
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot * Math.PI / 180)
        ctx.fillStyle = p.col; ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r); ctx.restore()
        if (p.y > canvas.height + 20) { p.y = -20; p.x = Math.random() * canvas.width }
      })
      rafId = requestAnimationFrame(draw)
    }
    rafId = requestAnimationFrame(draw)
    const timer = setTimeout(() => { cancelAnimationFrame(rafId); canvas.remove() }, 4000)
    const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    window.addEventListener('resize', onResize)
    return () => { window.removeEventListener('resize', onResize); clearTimeout(timer); cancelAnimationFrame(rafId); canvas.remove() }
  }, [data])

  const getCoaching = async (idx) => {
    try {
      const r = data.responses[idx]
      if (!r) return
      const res = await fetch('/api/get-ai-feedback', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ question: r.question, response: r.response, speaker: r.speaker || 'Ms. Mabrouki', type: r.type })
      })
      const json = await res.json()
      setCoaching(prev => ({ ...prev, [idx]: json }))
    } catch {
      setCoaching(prev => ({ ...prev, [idx]: { error: 'Could not fetch coaching' } }))
    }
  }

  if (loading) return (
    <Box sx={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, bgcolor: C.pageBg }}>
      <Box sx={{ width: 220 }}>
        <Box sx={{ height: 10, borderRadius: '50px', bgcolor: C.purple.bg, border: `2px solid ${C.purple.border}`, boxShadow: `3px 3px 0 ${C.purple.shadow}`, overflow: 'hidden' }}>
          <LinearProgress sx={{ height: '100%', bgcolor: 'transparent', '& .MuiLinearProgress-bar': { bgcolor: C.purple.border, borderRadius: '50px' } }} />
        </Box>
        <Typography sx={{ textAlign: 'center', mt: 2, color: C.muted, fontWeight: 700, fontSize: '0.85rem' }}>Calculating your results…</Typography>
      </Box>
    </Box>
  )
  if (error) return (
    <Box sx={{ p: 4, textAlign: 'center', bgcolor: C.pageBg, minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ px: 3, py: 2, borderRadius: '16px', bgcolor: C.red.bg, border: `2px solid ${C.red.border}`, boxShadow: `3px 3px 0 ${C.red.shadow}` }}>
        <Typography sx={{ color: C.red.border, fontWeight: 700 }}>Could not load results: {error}</Typography>
      </Box>
    </Box>
  )
  if (!data) return null

  const skill = data.skill_levels || {}
  const aiWarn = data.ai_percentage > 50 ? 'warning' : (data.ai_percentage > 30 ? 'info' : 'success')
  const meta = CEFR_META[data.overall_level] || {}
  const allLevels = Object.keys(CEFR_META)
  const currentRank = meta.rank || 0

  const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'skills', label: 'Skills' },
    { id: 'feedback', label: 'Detailed Feedback' },
    { id: 'achievements', label: 'Achievements' },
  ]

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', px: { xs: 2, md: 3 }, py: 4, bgcolor: C.pageBg, minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <Box sx={{
        p: { xs: 3, md: 4 }, mb: 3,
        bgcolor: C.cardBg,
        border: `2px solid ${C.purple.border}`,
        boxShadow: `5px 5px 0 ${C.purple.shadow}`,
        borderRadius: '20px',
      }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7}>
            <Box sx={{ display: 'inline-flex', px: 2, py: 0.5, mb: 2, borderRadius: '20px', bgcolor: C.purple.bg, border: `1.5px solid ${C.purple.border}` }}>
              <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: C.purple.text }}>Assessment Complete</Typography>
            </Box>
            <Typography sx={{ fontSize: { xs: '1.8rem', md: '2.2rem' }, fontWeight: 800, color: C.heading, lineHeight: 1.2, mb: 1 }}>
              Well done, {data.player_name}! 🎉
            </Typography>
            <Typography sx={{ color: C.body, mb: 3, maxWidth: 500 }}>
              You've completed the Cultural Event Planning orientation. Here's your full language profile.
            </Typography>
            <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ gap: 1 }}>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 0.8, borderRadius: '12px', bgcolor: C.yellow.bg, border: `2px solid ${C.yellow.border}`, boxShadow: `3px 3px 0 ${C.yellow.shadow}` }}>
                <EmojiEventsIcon sx={{ color: C.yellow.border, fontSize: 18 }} />
                <Typography sx={{ fontWeight: 700, color: C.yellow.border, fontSize: '0.88rem' }}>{data.xp} XP Earned</Typography>
              </Box>
              {data.session_id && (
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 0.8, borderRadius: '12px', bgcolor: C.blue.bg, border: `2px solid ${C.blue.border}`, boxShadow: `3px 3px 0 ${C.blue.shadow}` }}>
                  <WorkspacePremiumIcon sx={{ color: C.blue.border, fontSize: 18 }} />
                  <Typography sx={{ fontWeight: 700, color: C.blue.border, fontSize: '0.88rem' }}>Certificate Available</Typography>
                </Box>
              )}
            </Stack>
          </Grid>
          <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <Box sx={{ textAlign: 'center' }}>
              <LevelBadge level={data.overall_level} size={160} />
              <Typography sx={{ mt: 2, color: C.muted, fontSize: '0.82rem' }}>Your CEFR Level</Typography>
              <Typography sx={{ fontWeight: 700, color: C.heading }}>{meta.name}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* ── QUICK STATS ROW ── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'CEFR Level', value: data.overall_level, sub: meta.name, c: C.purple },
          { label: 'XP Earned', value: data.xp, sub: 'experience points', c: C.yellow },
          { label: 'Responses', value: data.responses_length || (data.responses || []).length, sub: 'total answers', c: C.green },
          { label: 'AI Detection', value: `${data.ai_percentage || 0}%`, sub: 'AI-generated', c: aiWarn === 'success' ? C.green : aiWarn === 'info' ? C.orange : C.red },
        ].map(({ label, value, sub, c }) => (
          <Grid item xs={6} md={3} key={label}>
            <Box sx={{ p: 2.5, borderRadius: '16px', height: '100%', bgcolor: C.cardBg, border: `2px solid ${c.border}`, boxShadow: `4px 4px 0 ${c.shadow}` }}>
              <Typography sx={{ fontSize: '1.6rem', fontWeight: 800, color: c.border, lineHeight: 1 }}>{value}</Typography>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: C.heading, mt: 0.4 }}>{label}</Typography>
              <Typography sx={{ fontSize: '0.74rem', color: C.muted }}>{sub}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* ── TABS ── */}
      <Stack direction="row" spacing={0.8} sx={{ mb: 3, flexWrap: 'wrap', gap: 0.8 }}>
        {TABS.map(t => (
          <Button key={t.id} size="small" disableElevation onClick={() => setActiveTab(t.id)}
            sx={{
              borderRadius: '20px', px: 2.5, py: 0.8, fontWeight: 700, textTransform: 'none', fontSize: '0.85rem',
              bgcolor: activeTab === t.id ? C.purple.border : C.cardBg,
              color: activeTab === t.id ? '#ffffff' : C.body,
              border: `2px solid ${activeTab === t.id ? C.purple.border : C.divider}`,
              boxShadow: activeTab === t.id ? `3px 3px 0 ${C.purple.shadow}` : `3px 3px 0 ${C.divider}`,
              '&:hover': { bgcolor: activeTab === t.id ? C.purple.shadow : C.purple.bg, borderColor: C.purple.border },
              transition: 'all 0.15s',
            }}
          >{t.label}</Button>
        ))}
      </Stack>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === 'overview' && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            {/* CEFR Journey */}
            <ClayCard color={C.blue} sx={{ mb: 3 }}>
              <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: C.heading, mb: 0.5 }}>Your CEFR Journey</Typography>
              <Typography sx={{ fontSize: '0.82rem', color: C.muted, mb: 2.5 }}>The European Framework — see where you stand.</Typography>
              <Stack spacing={1}>
                {allLevels.map((lv) => {
                  const m = CEFR_META[lv]
                  const isCurrent = lv === data.overall_level
                  const isPast = m.rank < currentRank
                  const isLocked = m.rank > currentRank
                  return (
                    <Box key={lv} sx={{
                      display: 'flex', alignItems: 'center', gap: 2, p: 1.5, borderRadius: '12px',
                      bgcolor: isCurrent ? m.color + '15' : 'transparent',
                      border: `2px solid ${isCurrent ? m.color : 'transparent'}`,
                      boxShadow: isCurrent ? `3px 3px 0 ${m.color}40` : 'none',
                    }}>
                      <Box sx={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: isPast ? '#34d39922' : isCurrent ? m.color + '22' : C.divider, flexShrink: 0 }}>
                        {isPast ? <CheckCircleIcon sx={{ color: '#34d399', fontSize: 18 }} />
                          : isLocked ? <LockIcon sx={{ color: C.muted, fontSize: 16 }} />
                          : <Typography sx={{ fontWeight: 800, color: m.color, fontSize: '0.8rem' }}>{lv}</Typography>}
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography sx={{ fontSize: '0.88rem', fontWeight: isCurrent ? 700 : 500, color: isCurrent ? m.color : isLocked ? C.muted : C.body }}>
                            {lv} — {m.name}
                          </Typography>
                          {isCurrent && <Box sx={{ px: 1, py: 0.2, borderRadius: '10px', bgcolor: m.color, boxShadow: `2px 2px 0 ${m.color}80` }}><Typography sx={{ fontSize: '0.65rem', fontWeight: 800, color: '#fff' }}>YOU</Typography></Box>}
                        </Stack>
                        <Typography sx={{ fontSize: '0.75rem', color: isLocked ? C.muted : C.muted }} noWrap>{m.workplace}</Typography>
                      </Box>
                    </Box>
                  )
                })}
              </Stack>
            </ClayCard>

            {/* Next steps */}
            <ClayCard color={C.green}>
              <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: C.heading, mb: 2 }}>Next Steps</Typography>
              <Stack spacing={1.5}>
                {[
                  data.session_id && { label: 'Get Your Certificate', icon: WorkspacePremiumIcon, href: `/certificate?session_id=${data.session_id}`, c: C.purple },
                  { label: 'Go to Dashboard', icon: DashboardIcon, href: '/dashboard', c: C.blue },
                  { label: 'Start New Assessment', icon: RefreshIcon, href: '/start-game', c: C.green },
                ].filter(Boolean).map(({ label, icon: Icon, href, c }) => (
                  <Button key={label} href={href} fullWidth startIcon={<Icon sx={{ color: c.border }} />}
                    sx={{ justifyContent: 'flex-start', py: 1.2, px: 2, borderRadius: '12px', textTransform: 'none', fontWeight: 700, fontSize: '0.9rem', bgcolor: c.bg, border: `2px solid ${c.border}`, boxShadow: `3px 3px 0 ${c.shadow}`, color: c.border, '&:hover': { bgcolor: c.bg, opacity: 0.85 } }}>
                    {label}
                  </Button>
                ))}
              </Stack>
            </ClayCard>
          </Grid>

          <Grid item xs={12} md={5}>
            {/* Progress path */}
            <ClayCard color={C.orange} sx={{ mb: 3 }}>
              <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: C.heading, mb: 2 }}>Progress Path</Typography>
              <Stack spacing={1}>
                {(data.progress_levels || []).map((pl, idx) => (
                  <Box key={idx} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', p: 1.5, borderRadius: '12px', bgcolor: pl.is_unlocked ? C.green.bg : C.divider + '40', border: `1.5px solid ${pl.is_unlocked ? C.green.border : C.divider}` }}>
                    <Box sx={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, bgcolor: pl.is_unlocked ? C.green.border : C.muted, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {pl.is_unlocked ? <CheckCircleIcon sx={{ fontSize: 14, color: '#fff' }} /> : <LockIcon sx={{ fontSize: 12, color: '#fff' }} />}
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: pl.is_unlocked ? C.heading : C.muted }}>{pl.name}</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: C.muted }}>{pl.description}</Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </ClayCard>

            {/* Badge */}
            {data.badges?.[data.overall_level] && (
              <ClayCard color={C.yellow} sx={{ mb: 3, textAlign: 'center' }}>
                <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: C.heading, mb: 1.5 }}>Badge Earned</Typography>
                <img src={`/static/images/badges/${data.badges[data.overall_level].icon || ''}`} alt="badge" style={{ width: 80, height: 80, objectFit: 'contain' }} />
                <Typography sx={{ fontWeight: 700, color: meta.color || C.purple.border, mt: 1 }}>{data.badges[data.overall_level].name}</Typography>
                <Typography sx={{ fontSize: '0.82rem', color: C.muted, mt: 0.5 }}>{data.badges[data.overall_level].description}</Typography>
              </ClayCard>
            )}

            {/* Next challenge */}
            <ClayCard color={C.purple}>
              <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: C.heading, mb: 1.5 }}>Next Challenge</Typography>
              {!challenge ? (
                <Box sx={{ height: 8, borderRadius: '50px', bgcolor: C.purple.bg, border: `1.5px solid ${C.purple.border}`, overflow: 'hidden' }}>
                  <LinearProgress sx={{ height: '100%', bgcolor: 'transparent', '& .MuiLinearProgress-bar': { bgcolor: C.purple.border } }} />
                </Box>
              ) : (
                <>
                  <Box sx={{ display: 'inline-flex', px: 1.5, py: 0.3, mb: 1.5, borderRadius: '20px', bgcolor: C.purple.bg, border: `1.5px solid ${C.purple.border}` }}>
                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: C.purple.text }}>{challenge.level} Level</Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.88rem', color: C.body, mb: 2 }}>{challenge.challenge}</Typography>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: C.green.border }}>+{challenge.xp_reward} XP</Typography>
                    <Button size="small" endIcon={<NavigateNextIcon />} sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, bgcolor: C.purple.bg, color: C.purple.border, border: `2px solid ${C.purple.border}`, boxShadow: `2px 2px 0 ${C.purple.shadow}` }}>Accept</Button>
                  </Stack>
                </>
              )}
            </ClayCard>
          </Grid>
        </Grid>
      )}

      {/* ── SKILLS TAB ── */}
      {activeTab === 'skills' && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <ClayCard color={C.blue}>
              <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: C.heading, mb: 0.5 }}>Skill Breakdown</Typography>
              <Typography sx={{ fontSize: '0.82rem', color: C.muted, mb: 2.5 }}>Your performance across five core language skills.</Typography>
              <Stack spacing={2.5}>
                {SKILLS.map(s => (
                  <SkillBar key={s.key} label={s.label} level={skill[s.key] || data.overall_level} color={s.color} />
                ))}
              </Stack>
            </ClayCard>
          </Grid>
          <Grid item xs={12} md={6}>
            <ClayCard color={C.orange} sx={{ mb: 3 }}>
              <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: C.heading, mb: 1.5 }}>AI Usage Analysis</Typography>
              <Box sx={{ mb: 2 }}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">AI-generated responses</Typography>
                  <Typography variant="body2" fontWeight={700}>{data.ai_percentage || 0}%</Typography>
                </Stack>
                <Box sx={{ height: 12, borderRadius: 6, bgcolor: 'grey.100', overflow: 'hidden' }}>
                  <Box sx={{
                    height: '100%', borderRadius: 6, width: `${data.ai_percentage || 0}%`, transition: 'width 1s ease',
                    background: aiWarn === 'success' ? 'linear-gradient(90deg,#34d399,#059669)'
                      : aiWarn === 'info' ? 'linear-gradient(90deg,#f59e0b,#d97706)'
                      : 'linear-gradient(90deg,#fb7185,#dc2626)'
                  }} />
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  {data.ai_responses_count} of {data.responses_length} responses
                </Typography>
              </Box>
              <Alert severity={aiWarn} sx={{ borderRadius: 2 }}>
                {aiWarn === 'warning' && 'High AI usage detected. Try responding with your own words.'}
                {aiWarn === 'info' && 'Moderate AI usage. Personal responses improve learning outcomes.'}
                {aiWarn === 'success' && 'Excellent! Your responses were authentic and personal.'}
              </Alert>
              {data.ai_responses_count > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Flagged Responses</Typography>
                  <Stack spacing={1}>
                    {(data.responses || []).filter(r => r.ai_generated && r.ai_score > 0.5).map((r, idx) => (
                      <Box key={idx} sx={{ p: 1.5, bgcolor: 'grey.50', borderRadius: 2, borderLeft: '3px solid #fb7185' }}>
                        <Typography variant="body2"><strong>Step {r.step}</strong> — AI confidence: {Math.round(r.ai_score * 100)}%</Typography>
                        {Array.isArray(r.ai_reasons) && r.ai_reasons.length > 0 && (
                          <Typography variant="caption" color="text.secondary">{r.ai_reasons.slice(0, 2).join(' · ')}</Typography>
                        )}
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}
            </ClayCard>

            <ClayCard color={C.blue}>
              <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: C.heading, mb: 0.5 }}>Advanced Practice</Typography>
              <Typography sx={{ fontSize: '0.82rem', color: C.muted, mb: 2 }}>
                Strengthen your {data.overall_level} level with real team collaboration scenarios.
              </Typography>
              <Grid container spacing={1.5} sx={{ mb: 2 }}>
                {['Team Meetings', 'Project Planning', 'Problem Solving', 'Decision Making'].map((s, i) => (
                  <Grid item xs={6} key={i}>
                    <Box sx={{ p: 1.5, bgcolor: C.blue.bg, borderRadius: '10px', border: `1.5px solid ${C.blue.border}`, textAlign: 'center' }}>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: C.blue.border }}>{s}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <Button href="/phase2" fullWidth sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, bgcolor: C.blue.bg, color: C.blue.border, border: `2px solid ${C.blue.border}`, boxShadow: `3px 3px 0 ${C.blue.shadow}`, '&:hover': { opacity: 0.85, bgcolor: C.blue.bg } }}>
                Start Team Practice
              </Button>
            </ClayCard>
          </Grid>
        </Grid>
      )}

      {/* ── FEEDBACK TAB ── */}
      {activeTab === 'feedback' && (
        <ClayCard color={C.purple}>
          <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: C.heading, mb: 2 }}>Response-by-Response Analysis</Typography>
          {(!data.responses || data.responses.length === 0) ? (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <InfoOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
              <Typography color="text.secondary">Complete the assessment to see detailed feedback.</Typography>
            </Box>
          ) : (
            <Stack spacing={1.5}>
              {(data.responses || []).map((r, idx) => {
                const a = (data.assessments || [])[idx] || {}
                const hasAI = r.ai_generated && r.ai_score > 0.5
                return (
                  <Accordion key={idx} disableGutters elevation={0} sx={{
                    border: '1px solid', borderColor: 'divider', borderRadius: '12px !important',
                    '&:before': { display: 'none' },
                    '&.Mui-expanded': { borderColor: 'primary.main' }
                  }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2.5, py: 1 }}>
                      <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" sx={{ gap: 1 }}>
                        <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main', fontSize: 12, fontWeight: 700 }}>{r.step}</Avatar>
                        <Typography variant="body2" fontWeight={600}>Step {r.step}</Typography>
                        {a.level && <Chip size="small" label={a.level} sx={{ bgcolor: (CEFR_META[a.level]?.color || '#6366f1') + '20', color: CEFR_META[a.level]?.color || '#6366f1', fontWeight: 700 }} />}
                        {hasAI && <Chip size="small" label={`AI: ${Math.round(r.ai_score * 100)}%`} color="warning" />}
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 2.5, pb: 2.5, pt: 0 }}>
                      <Divider sx={{ mb: 2 }} />
                      <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, mb: 2 }}>
                        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>QUESTION</Typography>
                        <Typography variant="body2">{r.question}</Typography>
                      </Box>
                      <Box sx={{ p: 2, bgcolor: 'primary.main' + '08', borderRadius: 2, mb: 2, borderLeft: '3px solid', borderColor: 'primary.main' }}>
                        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>YOUR RESPONSE</Typography>
                        <Typography variant="body2">{r.response}</Typography>
                      </Box>
                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        {[
                          { key: 'vocabulary_assessment', label: 'Vocabulary' },
                          { key: 'grammar_assessment', label: 'Grammar' },
                          { key: 'spelling_assessment', label: 'Spelling' },
                          { key: 'comprehension_assessment', label: 'Comprehension' },
                          { key: 'fluency_assessment', label: 'Fluency' },
                        ].filter(f => a[f.key]).map(f => (
                          <Grid item xs={12} sm={6} key={f.key}>
                            <Typography variant="caption" color="text.secondary" display="block">{f.label.toUpperCase()}</Typography>
                            <Typography variant="body2">{a[f.key]}</Typography>
                          </Grid>
                        ))}
                        {Array.isArray(a.specific_strengths) && a.specific_strengths.length > 0 && (
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="success.main" display="block">STRENGTHS</Typography>
                            <Typography variant="body2">{a.specific_strengths.slice(0, 3).join(', ')}</Typography>
                          </Grid>
                        )}
                        {Array.isArray(a.specific_areas_for_improvement) && a.specific_areas_for_improvement.length > 0 && (
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="warning.main" display="block">FOCUS AREAS</Typography>
                            <Typography variant="body2">{a.specific_areas_for_improvement.slice(0, 3).join(', ')}</Typography>
                          </Grid>
                        )}
                        {a.tips_for_improvement && (
                          <Grid item xs={12}>
                            <Typography variant="caption" color="info.main" display="block">TIPS</Typography>
                            <Typography variant="body2">{a.tips_for_improvement}</Typography>
                          </Grid>
                        )}
                      </Grid>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Button size="small" variant="outlined" startIcon={<PsychologyIcon />}
                          onClick={() => getCoaching(idx)} disabled={!!coaching[idx]}>
                          {coaching[idx] ? 'Coaching Loaded' : 'Get AI Coaching'}
                        </Button>
                        {coaching[idx]?.feedback && <CheckCircleIcon sx={{ color: 'success.main', fontSize: 18 }} />}
                      </Stack>
                      {coaching[idx]?.feedback && (
                        <Alert severity="info" sx={{ mt: 1.5, borderRadius: 2 }}>{coaching[idx].feedback}</Alert>
                      )}
                    </AccordionDetails>
                  </Accordion>
                )
              })}
            </Stack>
          )}
        </ClayCard>
      )}

      {/* ── ACHIEVEMENTS TAB ── */}
      {activeTab === 'achievements' && (
        <Grid container spacing={2}>
          {Object.entries(data.achievements || {}).map(([key, ach]) => {
            const unlocked = (data.achievements_earned || []).includes(key)
            const c = unlocked ? C.green : { bg: C.divider + '60', border: C.divider, shadow: C.divider }
            return (
              <Grid item xs={12} sm={6} md={4} key={key}>
                <Box sx={{ p: 3, borderRadius: '16px', height: '100%', textAlign: 'center', bgcolor: C.cardBg, border: `2px solid ${c.border}`, boxShadow: `4px 4px 0 ${c.shadow}`, opacity: unlocked ? 1 : 0.6 }}>
                  <Box sx={{ width: 54, height: 54, borderRadius: '50%', mx: 'auto', mb: 2, bgcolor: unlocked ? C.green.bg : C.divider, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${c.border}` }}>
                    {unlocked
                      ? <EmojiEventsIcon sx={{ color: C.green.border, fontSize: 26 }} />
                      : <LockIcon sx={{ color: C.muted, fontSize: 22 }} />}
                  </Box>
                  <Typography sx={{ fontWeight: 700, color: C.heading, mb: 0.5 }}>{ach.name}</Typography>
                  <Typography sx={{ fontSize: '0.82rem', color: C.muted, mb: 2 }}>{ach.description}</Typography>
                  <Box sx={{ display: 'inline-flex', px: 1.5, py: 0.3, borderRadius: '20px', bgcolor: unlocked ? C.green.bg : C.divider, border: `1.5px solid ${c.border}` }}>
                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: unlocked ? C.green.border : C.muted }}>{unlocked ? 'Unlocked' : 'Locked'}</Typography>
                  </Box>
                </Box>
              </Grid>
            )
          })}
        </Grid>
      )}

      {/* ── FEEDBACK DIALOG ── */}
      <Dialog open={feedbackOpen} onClose={() => setFeedbackOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Share Your Feedback</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>How was your experience with FARDI?</Typography>
          <RadioGroup row defaultValue="5" sx={{ mb: 2 }}>
            {[1, 2, 3, 4, 5].map(n => (
              <FormControlLabel key={n} value={String(n)} control={<Radio size="small" />} label={`${n}★`} />
            ))}
          </RadioGroup>
          <TextField label="What did you enjoy?" fullWidth multiline minRows={2} sx={{ mb: 2 }} />
          <TextField label="How can we improve?" fullWidth multiline minRows={2} />
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 0 }}>
          <Button variant="outlined" onClick={() => setFeedbackOpen(false)}>Cancel</Button>
          <Button onClick={() => setFeedbackOpen(false)}>Submit Feedback</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
