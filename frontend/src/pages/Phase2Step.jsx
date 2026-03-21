import React, { useEffect, useRef, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Typography, Avatar as MuiAvatar, IconButton, LinearProgress,
  Chip, Fade, useTheme
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import SchoolIcon from '@mui/icons-material/School'

const AVATAR_MAP = {
  'Ms. Mabrouki': 'mabrouki.svg',
  'SKANDER': 'skander.svg',
  'Skander': 'skander.svg',
  'Emna': 'emna.svg',
  'Ryan': 'ryan.svg',
  'Lilia': 'lilia.svg',
}

const COLOR_MAP = {
  'Ms. Mabrouki': '#1e3a8a',
  'SKANDER': '#0e7490',
  'Skander': '#0e7490',
  'Emna': '#7c3aed',
  'Ryan': '#0369a1',
  'Lilia': '#047857',
}

function CharAvatar({ speaker, size = 42 }) {
  const file = AVATAR_MAP[speaker]
  const color = COLOR_MAP[speaker] || '#64748b'
  return (
    <MuiAvatar
      src={file ? `/static/images/avatars/${file}` : undefined}
      alt={speaker}
      sx={{
        width: size, height: size,
        border: `2px solid ${color}`,
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

function TypingIndicator({ speaker }) {
  const color = COLOR_MAP[speaker] || '#64748b'
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  return (
    <Fade in>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 3 }}>
        <CharAvatar speaker={speaker} />
        <Box sx={{ pt: 0.5 }}>
          <Typography variant="caption" sx={{ color, fontWeight: 700, mb: 0.5, display: 'block' }}>
            {speaker}
          </Typography>
          <Box sx={{
            display: 'inline-flex', alignItems: 'center', gap: 0.6,
            bgcolor: isDark ? '#1e293b' : '#f1f5f9',
            borderRadius: '18px 18px 18px 4px',
            px: 2, py: 1.5,
            border: '1px solid',
            borderColor: isDark ? '#334155' : '#e2e8f0',
          }}>
            {[0, 1, 2].map(i => (
              <Box key={i} sx={{
                width: 8, height: 8, borderRadius: '50%', bgcolor: color,
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

function IncomingBubble({ speaker, text }) {
  const color = COLOR_MAP[speaker] || '#64748b'
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  return (
    <Fade in timeout={350}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 3 }}>
        <CharAvatar speaker={speaker} />
        <Box sx={{ maxWidth: '75%', pt: 0.5 }}>
          <Typography variant="caption" sx={{ color, fontWeight: 700, mb: 0.5, display: 'block' }}>
            {speaker}
          </Typography>
          <Box sx={{
            bgcolor: isDark ? '#1e293b' : '#f1f5f9',
            borderRadius: '18px 18px 18px 4px',
            px: 2.5, py: 1.5,
            border: '1px solid',
            borderColor: isDark ? '#334155' : '#e2e8f0',
          }}>
            <Typography variant="body1" sx={{ lineHeight: 1.65, color: isDark ? '#e2e8f0' : '#0f172a', fontSize: '0.95rem' }}>
              {text}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Fade>
  )
}

function OutgoingBubble({ text }) {
  return (
    <Fade in timeout={350}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Box sx={{ maxWidth: '75%' }}>
          <Box sx={{
            bgcolor: '#1e3a8a',
            borderRadius: '18px 18px 4px 18px',
            px: 2.5, py: 1.5,
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

export default function Phase2Step() {
  const { stepId } = useParams()
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

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

      // Find current item
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

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Auto-check completion
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
        // Reload progress and find next item
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

  if (loading) return (
    <Box sx={{ p: 4 }}>
      <LinearProgress sx={{ borderRadius: 4, height: 3 }} />
    </Box>
  )
  if (error) return <Box sx={{ p: 4, color: 'error.main' }}>Error: {error}</Box>
  if (!meta || !progress) return null

  const completedCount = progress.completed_items || 0
  const totalCount = progress.total_items || 0
  const progressPct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  return (
    <Box sx={{ maxWidth: 760, mx: 'auto', px: { xs: 1, sm: 2 }, pb: 4 }}>

      {/* Scene Banner */}
      <Box sx={{
        px: { xs: 2.5, sm: 3.5 }, py: { xs: 2.5, sm: 3 },
        background: isDark
          ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
          : 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
        borderRadius: 3,
        mb: 3,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SchoolIcon sx={{ color: '#93c5fd', fontSize: 20 }} />
            <Typography sx={{ color: '#93c5fd', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1.2 }}>
              Phase 2 · {meta.title}
            </Typography>
          </Box>
          <Chip
            label={`${completedCount} / ${totalCount}`}
            size="small"
            sx={{
              bgcolor: 'rgba(255,255,255,0.15)', color: '#e2e8f0',
              fontWeight: 700, height: 26, fontSize: '0.75rem',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          />
        </Box>
        <Typography sx={{ color: '#cbd5e1', lineHeight: 1.6, fontSize: '0.9rem', mb: 2 }}>
          {meta.scenario}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progressPct}
          sx={{
            height: 4, borderRadius: 4,
            bgcolor: 'rgba(255,255,255,0.15)',
            '& .MuiLinearProgress-bar': { bgcolor: '#60a5fa', borderRadius: 4 }
          }}
        />
      </Box>

      {/* Chat Area */}
      <Box sx={{
        minHeight: 420,
        maxHeight: 520,
        overflowY: 'auto',
        px: { xs: 2, sm: 3 },
        py: 3,
        bgcolor: isDark ? '#0f172a' : '#f8fafc',
        borderRadius: 3,
        border: '1px solid',
        borderColor: isDark ? '#1e293b' : '#e2e8f0',
        mb: 2,
        '&::-webkit-scrollbar': { width: 5 },
        '&::-webkit-scrollbar-thumb': { bgcolor: isDark ? '#334155' : '#cbd5e1', borderRadius: 4 },
      }}>
        {messages.map((msg, i) =>
          msg.type === 'incoming'
            ? <IncomingBubble key={i} speaker={msg.speaker} text={msg.text} />
            : <OutgoingBubble key={i} text={msg.text} />
        )}
        {isTyping && currentItem && <TypingIndicator speaker={currentItem.speaker} />}
        <div ref={messagesEndRef} />
      </Box>

      {/* Instruction hint */}
      {currentItem?.instruction && !submitting && (
        <Fade in>
          <Box sx={{
            px: 2.5, py: 1.2,
            bgcolor: isDark ? '#1e293b' : '#eff6ff',
            borderRadius: 2,
            border: '1px solid',
            borderColor: isDark ? '#334155' : '#bfdbfe',
            mb: 2,
          }}>
            <Typography variant="body2" sx={{ color: isDark ? '#93c5fd' : '#1e40af', lineHeight: 1.6, fontSize: '0.85rem' }}>
              💡 {currentItem.instruction}
            </Typography>
          </Box>
        </Fade>
      )}

      {/* Input bar */}
      <Box sx={{
        display: 'flex', gap: 1.5, alignItems: 'flex-end',
        bgcolor: isDark ? '#1e293b' : 'white',
        border: '1px solid',
        borderColor: isDark ? '#475569' : '#cbd5e1',
        borderRadius: 3,
        p: 1.5,
        boxShadow: isDark ? 'none' : '0 1px 6px rgba(0,0,0,0.06)',
        '&:focus-within': {
          borderColor: '#1e3a8a',
          boxShadow: '0 0 0 3px rgba(30,58,138,0.1)',
        },
        transition: 'border-color 0.15s, box-shadow 0.15s',
      }}>
        <Box
          component="textarea"
          ref={inputRef}
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={currentItem ? 'Type your response… (Enter to send)' : ''}
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
            color: isDark ? '#e2e8f0' : '#0f172a',
            p: 0.5,
            '&::placeholder': { color: isDark ? '#475569' : '#94a3b8' },
            '&:disabled': { cursor: 'not-allowed', opacity: 0.5 },
          }}
        />
        <IconButton
          onClick={handleSend}
          disabled={!inputValue.trim() || !currentItem || submitting}
          sx={{
            bgcolor: '#1e3a8a',
            color: 'white',
            width: 44, height: 44,
            flexShrink: 0,
            alignSelf: 'flex-end',
            '&:hover': { bgcolor: '#1e40af' },
            '&:disabled': {
              bgcolor: isDark ? '#334155' : '#e2e8f0',
              color: isDark ? '#64748b' : '#94a3b8',
            },
          }}
        >
          <SendIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

    </Box>
  )
}
