import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Typography, Avatar as MuiAvatar, IconButton, LinearProgress,
  Fade, Container, useTheme
} from '@mui/material'
import { motion } from 'framer-motion'
import SendIcon from '@mui/icons-material/Send'
import GroupIcon from '@mui/icons-material/Group'

// ─── Clay palette ──────────────────────────────────────────────────────────────
const LIGHT = {
  pageBg:  '#FFFDE7',
  cardBg:  '#ffffff',
  heading: '#1A237E',
  body:    '#37474F',
  muted:   '#78909C',
  divider: '#E0E0E0',
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
  yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825', text: '#5D4037' },
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
  purple: { bg: '#E1BEE7', border: '#8E24AA', shadow: '#8E24AA' },
  teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
  red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#C62828' },
  chatBg: '#FFF8E1',
  bubbleIn: '#ffffff',
  bubbleOut: '#1976D2',
  inputBg: '#ffffff',
}
const DARK = {
  pageBg:  '#0F0F1A',
  cardBg:  '#1A1A2E',
  heading: '#E8EAFF',
  body:    '#B0BEC5',
  muted:   '#607D8B',
  divider: '#2A2A4A',
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#A06800', text: '#FFD54F' },
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  purple: { bg: '#1E0A2E', border: '#CE93D8', shadow: '#7B1FA2' },
  teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
  red:    { bg: '#1F0000', border: '#EF9A9A', shadow: '#B71C1C' },
  chatBg: '#12121F',
  bubbleIn: '#1A1A2E',
  bubbleOut: '#1565C0',
  inputBg: '#1A1A2E',
}

const AVATAR_MAP = {
  'Ms. Mabrouki': 'mabrouki.svg',
  'SKANDER': 'skander.svg',
  'Skander': 'skander.svg',
  'Emna': 'emna.svg',
  'Ryan': 'ryan.svg',
  'Lilia': 'lilia.svg',
}

const SPEAKER_COLORS = {
  'Ms. Mabrouki': { bg: '#BBDEFB', border: '#1976D2' },
  'SKANDER':      { bg: '#B2EBF2', border: '#0097A7' },
  'Skander':      { bg: '#B2EBF2', border: '#0097A7' },
  'Emna':         { bg: '#E1BEE7', border: '#8E24AA' },
  'Ryan':         { bg: '#BBDEFB', border: '#1565C0' },
  'Lilia':        { bg: '#C8E6C9', border: '#388E3C' },
}

const SPEAKER_COLORS_DARK = {
  'Ms. Mabrouki': { bg: '#0A1929', border: '#64B5F6' },
  'SKANDER':      { bg: '#001F22', border: '#4DD0E1' },
  'Skander':      { bg: '#001F22', border: '#4DD0E1' },
  'Emna':         { bg: '#1E0A2E', border: '#CE93D8' },
  'Ryan':         { bg: '#0A1929', border: '#64B5F6' },
  'Lilia':        { bg: '#0A1F0A', border: '#81C784' },
}

function CharAvatar({ speaker, size = 42 }) {
  const file = AVATAR_MAP[speaker]
  const color = SPEAKER_COLORS[speaker]?.border || '#64748b'
  return (
    <MuiAvatar
      src={file ? `/static/images/avatars/${file}` : undefined}
      alt={speaker}
      sx={{
        width: size, height: size,
        border: `2.5px solid ${color}`,
        boxShadow: `2px 2px 0 ${color}40`,
        flexShrink: 0,
        bgcolor: color,
        fontSize: size * 0.38,
        fontWeight: 700,
      }}
    >
      {speaker?.[0] || '?'}
    </MuiAvatar>
  )
}

function TypingIndicator({ speaker, isDark }) {
  const sc = isDark ? (SPEAKER_COLORS_DARK[speaker] || { border: '#64B5F6' }) : (SPEAKER_COLORS[speaker] || { border: '#1976D2' })
  return (
    <Fade in>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 3 }}>
        <CharAvatar speaker={speaker} />
        <Box sx={{ pt: 0.5 }}>
          <Typography variant="caption" sx={{ color: sc.border, fontWeight: 800, mb: 0.5, display: 'block', fontSize: '0.75rem' }}>
            {speaker}
          </Typography>
          <Box sx={{
            display: 'inline-flex', alignItems: 'center', gap: 0.6,
            bgcolor: isDark ? '#1A1A2E' : '#ffffff',
            borderRadius: '16px 16px 16px 4px',
            px: 2, py: 1.5,
            border: `2px solid ${isDark ? '#2A2A4A' : '#E0E0E0'}`,
            boxShadow: `3px 3px 0 ${isDark ? '#2A2A4A' : '#E0E0E0'}`,
          }}>
            {[0, 1, 2].map(i => (
              <Box key={i} sx={{
                width: 8, height: 8, borderRadius: '50%', bgcolor: sc.border,
                animation: 'typingBounce 1.2s infinite',
                animationDelay: `${i * 0.2}s`,
                '@keyframes typingBounce': {
                  '0%, 80%, 100%': { transform: 'translateY(0)', opacity: 0.35 },
                  '40%': { transform: 'translateY(-6px)', opacity: 1 }
                }
              }} />
            ))}
          </Box>
        </Box>
      </Box>
    </Fade>
  )
}

function IncomingBubble({ speaker, text, isDark }) {
  const sc = isDark ? (SPEAKER_COLORS_DARK[speaker] || { bg: '#1A1A2E', border: '#64B5F6' }) : (SPEAKER_COLORS[speaker] || { bg: '#BBDEFB', border: '#1976D2' })
  return (
    <Fade in timeout={350}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 3 }}>
        <CharAvatar speaker={speaker} />
        <Box sx={{ maxWidth: '75%', pt: 0.5 }}>
          <Typography variant="caption" sx={{ color: sc.border, fontWeight: 800, mb: 0.5, display: 'block', fontSize: '0.75rem' }}>
            {speaker}
          </Typography>
          <Box sx={{
            bgcolor: isDark ? '#1A1A2E' : '#ffffff',
            borderRadius: '16px 16px 16px 4px',
            px: 2.5, py: 1.5,
            border: `2px solid ${isDark ? '#2A2A4A' : '#E0E0E0'}`,
            boxShadow: `3px 3px 0 ${isDark ? '#2A2A4A' : '#E0E0E0'}`,
          }}>
            <Typography variant="body1" sx={{ lineHeight: 1.65, color: isDark ? '#E8EAFF' : '#37474F', fontSize: '0.95rem' }}>
              {text}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Fade>
  )
}

function OutgoingBubble({ text, isDark, D }) {
  return (
    <Fade in timeout={350}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Box sx={{ maxWidth: '75%' }}>
          <Box sx={{
            bgcolor: D.blue.border,
            borderRadius: '16px 16px 4px 16px',
            px: 2.5, py: 1.5,
            border: `2px solid ${D.blue.border}`,
            boxShadow: `3px 3px 0 ${D.blue.shadow}`,
          }}>
            <Typography variant="body1" sx={{ lineHeight: 1.65, color: '#fff', fontSize: '0.95rem' }}>
              {text}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Fade>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' } }),
}

export default function Phase2Step() {
  const { stepId } = useParams()
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const D = isDark ? DARK : LIGHT

  const [meta, setMeta] = useState(null)
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const initDoneRef = useRef(false)

  const card = (c, extra = {}) => ({
    bgcolor: c.bg,
    border: `2px solid ${c.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${c.shadow}`,
    ...extra,
  })

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const [mRes, pRes] = await Promise.all([
        fetch(`/api/phase2/step?step_id=${encodeURIComponent(stepId)}`, { credentials: 'include' }),
        fetch(`/api/phase2/get-step-progress?step_id=${encodeURIComponent(stepId)}`, { credentials: 'include' })
      ])
      if (!mRes.ok) throw new Error('Failed to load step data')
      if (!pRes.ok) throw new Error('Failed to load progress')
      const m = await mRes.json()
      const p = await pRes.json()
      setMeta(m)
      setProgress(p)

      const completedIds = new Set((p.item_scores || []).filter(i => i.completed).map(i => i.id))
      const next = (m.action_items || []).find(it => !completedIds.has(it.id)) || null
      return { m, p, next }
    } catch (e) {
      setError(e.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    const init = async () => {
      const result = await load()
      if (!result || cancelled) return
      const { next } = result
      if (!next) return

      setCurrentItem(next)
      initDoneRef.current = true
      setIsTyping(true)
      await new Promise(r => setTimeout(r, 1000))
      if (cancelled) return
      setIsTyping(false)
      setMessages([{ type: 'incoming', speaker: next.speaker, text: next.question }])
      setTimeout(() => inputRef.current?.focus(), 100)
    }
    init()
    return () => { cancelled = true }
  }, [stepId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    if (!meta || !progress || currentItem) return
    if (progress.completed_items < progress.total_items) return
    const check = async () => {
      try {
        const c = await fetch('/api/phase2/check-step-completion', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
          body: JSON.stringify({ step_id: stepId })
        })
        const cData = await c.json()
        if (c.ok && cData.step_complete) {
          if (cData.needs_remedial) navigate(`/phase2/remedial/${stepId}/${cData.user_level}`)
          else if (cData.next_action === 'next_step' && cData.next_url) navigate(cData.next_url)
          else if (cData.next_action === 'phase2_complete') navigate('/phase2/complete')
          else navigate(`/phase2/step/${stepId}/results`)
        }
      } catch (e) { console.error(e) }
    }
    check()
  }, [meta, progress, currentItem, stepId, navigate])

  const handleSend = async () => {
    if (!inputValue.trim() || !currentItem || submitting) return
    const text = inputValue.trim()
    setInputValue('')
    setSubmitting(true)
    setMessages(prev => [...prev, { type: 'outgoing', text }])

    try {
      const r = await fetch('/api/phase2/submit-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ step_id: stepId, action_item_id: currentItem.id, response: text })
      })
      const data = await r.json()
      if (!r.ok || data.error) throw new Error(data.error || 'Submit failed')

      const c = await fetch('/api/phase2/check-step-completion', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ step_id: stepId })
      })
      const cData = await c.json()

      if (!cData.step_complete) {
        const mRes = await fetch(`/api/phase2/step?step_id=${encodeURIComponent(stepId)}`, { credentials: 'include' })
        const pRes = await fetch(`/api/phase2/get-step-progress?step_id=${encodeURIComponent(stepId)}`, { credentials: 'include' })
        const m = await mRes.json()
        const p = await pRes.json()
        setMeta(m)
        setProgress(p)

        const completedIds = new Set((p.item_scores || []).filter(i => i.completed).map(i => i.id))
        const nextItem = (m.action_items || []).find(it => !completedIds.has(it.id))
        if (nextItem) {
          setCurrentItem(nextItem)
          setIsTyping(true)
          await new Promise(r => setTimeout(r, 1200))
          setIsTyping(false)
          setMessages(prev => [...prev, { type: 'incoming', speaker: nextItem.speaker, text: nextItem.question }])
          setTimeout(() => inputRef.current?.focus(), 100)
        } else {
          setCurrentItem(null)
        }
      } else {
        setCurrentItem(null)
        if (cData.needs_remedial) navigate(`/phase2/remedial/${stepId}/${cData.user_level}`)
        else if (cData.next_action === 'next_step' && cData.next_url) navigate(cData.next_url)
        else if (cData.next_action === 'phase2_complete') navigate('/phase2/complete')
        else navigate(`/phase2/step/${stepId}/results`)
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: D.pageBg }}>
      <Box sx={{ width: 200 }}>
        <Box sx={{
          height: 12, borderRadius: '50px',
          bgcolor: D.blue.bg, border: `2px solid ${D.blue.border}`,
          boxShadow: `3px 3px 0 ${D.blue.shadow}`, overflow: 'hidden',
        }}>
          <LinearProgress sx={{ height: '100%', bgcolor: 'transparent', '& .MuiLinearProgress-bar': { bgcolor: D.blue.border, borderRadius: '50px' } }} />
        </Box>
        <Typography sx={{ textAlign: 'center', mt: 2, color: D.muted, fontWeight: 700, fontSize: '0.85rem' }}>Loading...</Typography>
      </Box>
    </Box>
  )

  if (error) return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: D.pageBg }}>
      <Box sx={{ ...card(D.red), px: 3, py: 2 }}>
        <Typography sx={{ color: D.red.border, fontWeight: 700 }}>Error: {error}</Typography>
      </Box>
    </Box>
  )

  if (!meta || !progress) return null

  const completedCount = progress.completed_items || 0
  const totalCount = progress.total_items || 0
  const progressPct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: D.pageBg }}>
      <Container maxWidth="md" sx={{ pt: { xs: 3, md: 4 }, pb: 6 }}>

        {/* ── Header ──────────────────────────────────────────────────────────── */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Box sx={{ ...card(D.blue), px: { xs: 2.5, sm: 3.5 }, py: { xs: 2.5, sm: 3 }, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <GroupIcon sx={{ color: D.blue.border, fontSize: 22 }} />
                <Typography sx={{ color: D.blue.border, fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 1.2 }}>
                  Phase 2 · {meta.title}
                </Typography>
              </Box>
              <Box sx={{
                display: 'inline-flex', alignItems: 'center',
                px: 1.5, py: 0.4, borderRadius: '50px',
                bgcolor: D.yellow.bg, border: `2px solid ${D.yellow.border}`,
                boxShadow: `2px 2px 0 ${D.yellow.shadow}`,
                fontSize: '0.7rem', fontWeight: 800, color: D.yellow.text || D.yellow.border,
              }}>
                {completedCount} / {totalCount}
              </Box>
            </Box>
            <Typography sx={{ color: isDark ? D.body : D.body, lineHeight: 1.6, fontSize: '0.9rem', mb: 2 }}>
              {meta.scenario}
            </Typography>
            <Box sx={{
              height: 10, borderRadius: '50px',
              bgcolor: isDark ? '#0A192940' : '#ffffff60',
              border: `2px solid ${D.blue.border}40`,
              overflow: 'hidden',
            }}>
              <Box sx={{
                height: '100%', width: `${progressPct}%`,
                bgcolor: D.blue.border, borderRadius: '50px',
                transition: 'width 0.4s ease',
              }} />
            </Box>
          </Box>
        </motion.div>

        {/* ── Chat Area ───────────────────────────────────────────────────────── */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Box sx={{
            minHeight: 420,
            maxHeight: 520,
            overflowY: 'auto',
            px: { xs: 2, sm: 3 },
            py: 3,
            bgcolor: D.chatBg,
            borderRadius: '20px',
            border: `2px solid ${D.divider}`,
            boxShadow: `4px 4px 0 ${D.divider}`,
            mb: 2,
            '&::-webkit-scrollbar': { width: 6 },
            '&::-webkit-scrollbar-thumb': { bgcolor: D.divider, borderRadius: 4 },
          }}>
            {messages.map((msg, i) =>
              msg.type === 'incoming'
                ? <IncomingBubble key={i} speaker={msg.speaker} text={msg.text} isDark={isDark} />
                : <OutgoingBubble key={i} text={msg.text} isDark={isDark} D={D} />
            )}
            {isTyping && currentItem && <TypingIndicator speaker={currentItem.speaker} isDark={isDark} />}
            <div ref={messagesEndRef} />
          </Box>
        </motion.div>

        {/* ── Instruction hint ────────────────────────────────────────────────── */}
        {currentItem?.instruction && !submitting && (
          <Fade in>
            <Box sx={{
              ...card(D.teal),
              px: 2.5, py: 1.5,
              mb: 2,
            }}>
              <Typography variant="body2" sx={{ color: D.teal.border, lineHeight: 1.6, fontSize: '0.85rem', fontWeight: 600 }}>
                {currentItem.instruction}
              </Typography>
            </Box>
          </Fade>
        )}

        {/* ── Input bar ───────────────────────────────────────────────────────── */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          <Box sx={{
            display: 'flex', gap: 1.5, alignItems: 'flex-end',
            bgcolor: D.inputBg,
            border: `2px solid ${D.divider}`,
            borderRadius: '16px',
            boxShadow: `4px 4px 0 ${D.divider}`,
            p: 1.5,
            '&:focus-within': {
              borderColor: D.blue.border,
              boxShadow: `4px 4px 0 ${D.blue.shadow}`,
            },
            transition: 'border-color 0.15s, box-shadow 0.15s',
          }}>
            <Box
              component="textarea"
              ref={inputRef}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={currentItem ? 'Type your response... (Enter to send)' : ''}
              disabled={!currentItem || submitting}
              rows={3}
              sx={{
                flex: 1,
                border: 'none',
                outline: 'none',
                resize: 'none',
                bgcolor: 'transparent',
                fontFamily: 'inherit',
                fontSize: '0.95rem',
                lineHeight: 1.65,
                color: isDark ? D.heading : D.body,
                p: 0.5,
                '&::placeholder': { color: D.muted },
                '&:disabled': { cursor: 'not-allowed', opacity: 0.5 },
              }}
            />
            <IconButton
              onClick={handleSend}
              disabled={!inputValue.trim() || !currentItem || submitting}
              sx={{
                bgcolor: D.blue.border,
                color: 'white',
                width: 44, height: 44,
                flexShrink: 0,
                alignSelf: 'flex-end',
                border: `2px solid ${D.blue.border}`,
                boxShadow: `2px 2px 0 ${D.blue.shadow}`,
                borderRadius: '12px',
                '&:hover': { bgcolor: D.blue.shadow, transform: 'translate(-1px,-1px)', boxShadow: `3px 3px 0 ${D.blue.shadow}` },
                '&:disabled': {
                  bgcolor: isDark ? '#2A2A4A' : '#E0E0E0',
                  color: D.muted,
                  border: `2px solid ${D.divider}`,
                  boxShadow: `2px 2px 0 ${D.divider}`,
                },
                transition: 'all 0.12s ease',
              }}
            >
              <SendIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        </motion.div>

      </Container>
    </Box>
  )
}
