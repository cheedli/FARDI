import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Typography, Stack, Avatar, TextField, IconButton, InputAdornment,
  Badge, Paper, LinearProgress, Chip, useTheme
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import SearchIcon from '@mui/icons-material/Search'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

export default function AdminChat() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [activeUser, setActiveUser] = useState(null)
  const messagesEndRef = useRef(null)
  const pollRef = useRef(null)

  const loadConversations = async () => {
    try {
      const res = await fetch('/api/chat/conversations', { credentials: 'include' })
      const data = await res.json()
      if (data.success) setConversations(data.data)
    } catch {}
    setLoading(false)
  }

  const loadMessages = async (uid) => {
    try {
      const res = await fetch(`/api/chat/messages/${uid}`, { credentials: 'include' })
      const data = await res.json()
      if (data.success) setMessages(data.data)
    } catch {}
  }

  useEffect(() => { loadConversations() }, [])

  useEffect(() => {
    if (userId) {
      const user = conversations.find(c => String(c.user_id) === String(userId))
      setActiveUser(user || null)
      loadMessages(userId)
    } else {
      setActiveUser(null)
      setMessages([])
    }
  }, [userId, conversations])

  useEffect(() => {
    if (!userId) return
    pollRef.current = setInterval(() => {
      loadMessages(userId)
      loadConversations()
    }, 5000)
    return () => clearInterval(pollRef.current)
  }, [userId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!newMessage.trim() || !userId) return
    setSending(true)
    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ receiver_id: parseInt(userId), message: newMessage.trim() }),
      })
      const data = await res.json()
      if (data.success) {
        setNewMessage('')
        loadMessages(userId)
        loadConversations()
      }
    } catch {}
    setSending(false)
  }

  const filtered = conversations.filter(c => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      (c.first_name || '').toLowerCase().includes(q) ||
      (c.last_name || '').toLowerCase().includes(q) ||
      (c.username || '').toLowerCase().includes(q)
    )
  })

  const formatTime = (ts) => {
    if (!ts) return ''
    const d = new Date(ts)
    const now = new Date()
    const diffDays = Math.floor((now - d) / 86400000)
    if (diffDays === 0) return d.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return d.toLocaleDateString('en', { weekday: 'short' })
    return d.toLocaleDateString('en', { month: 'short', day: 'numeric' })
  }

  const border = isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #f1f5f9'
  const sideBg = isDark ? theme.palette.background.paper : '#ffffff'
  const chatBg = isDark ? theme.palette.background.default : '#f8fafc'
  const inputBg = isDark ? theme.palette.background.paper : '#ffffff'
  const muted = theme.palette.text.secondary
  const searchBg = isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc'
  const searchBorder = isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'

  if (loading) return (
    <Box sx={{ p: 4 }}>
      <Typography sx={{ mb: 2, color: muted }}>Loading messages...</Typography>
      <LinearProgress sx={{ borderRadius: 1 }} />
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 1px)', overflow: 'hidden' }}>

      {/* ── Sidebar ── */}
      <Box sx={{
        width: 300, flexShrink: 0,
        borderRight: border,
        display: 'flex', flexDirection: 'column',
        bgcolor: sideBg,
        ...(userId ? { display: { xs: 'none', md: 'flex' } } : {}),
      }}>
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: border }}>
          <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: 'text.primary', mb: 1.5 }}>
            Messages
          </Typography>
          <TextField
            fullWidth size="small" placeholder="Search students..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 17, color: muted }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '0.83rem',
                bgcolor: searchBg,
                '& fieldset': { borderColor: searchBorder },
                '&:hover fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#cbd5e1' },
              },
            }}
          />
        </Box>

        {/* Conversation list */}
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          {filtered.map((c) => {
            const isSelected = String(c.user_id) === String(userId)
            return (
              <Box
                key={c.user_id}
                onClick={() => navigate(`/admin/chat/${c.user_id}`)}
                sx={{
                  px: 2, py: 1.4, cursor: 'pointer',
                  bgcolor: isSelected ? (isDark ? 'rgba(99,102,241,0.12)' : '#6366f106') : 'transparent',
                  borderLeft: `3px solid ${isSelected ? '#6366f1' : 'transparent'}`,
                  '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc' },
                  transition: 'all 0.15s',
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Badge
                    badgeContent={c.unread_count || 0} color="error"
                    sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', minWidth: 16, height: 16 } }}
                  >
                    <Avatar sx={{
                      width: 36, height: 36, fontSize: '0.8rem', fontWeight: 700,
                      background: isSelected
                        ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                        : (isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'),
                      color: isSelected ? 'white' : muted,
                    }}>
                      {(c.first_name || c.username || '?')[0].toUpperCase()}
                    </Avatar>
                  </Badge>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography sx={{
                        fontSize: '0.83rem', fontWeight: c.unread_count ? 700 : 600,
                        color: 'text.primary',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {c.first_name} {c.last_name}
                      </Typography>
                      <Typography sx={{ fontSize: '0.62rem', color: muted, flexShrink: 0, ml: 1 }}>
                        {formatTime(c.last_message_at)}
                      </Typography>
                    </Stack>
                    <Typography sx={{
                      fontSize: '0.73rem',
                      color: c.unread_count ? 'text.primary' : muted,
                      fontWeight: c.unread_count ? 600 : 400,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {c.last_message || 'No messages yet'}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            )
          })}
          {filtered.length === 0 && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography sx={{ color: muted, fontSize: '0.83rem' }}>
                {search ? 'No students match' : 'No students registered'}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* ── Chat area ── */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: chatBg, minWidth: 0 }}>
        {!userId ? (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 1 }}>
            <ChatBubbleOutlineIcon sx={{ fontSize: 44, color: muted, opacity: 0.4 }} />
            <Typography sx={{ fontSize: '0.92rem', color: muted }}>
              Select a student to start messaging
            </Typography>
          </Box>
        ) : (
          <>
            {/* Chat header */}
            <Box sx={{
              px: 2.5, py: 1.4, borderBottom: border, bgcolor: inputBg,
              display: 'flex', alignItems: 'center', gap: 1.5,
            }}>
              <IconButton
                onClick={() => navigate('/admin/chat')}
                size="small"
                sx={{ display: { xs: 'flex', md: 'none' }, color: muted, mr: 0.5 }}
              >
                <ArrowBackIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <Avatar sx={{
                width: 32, height: 32, fontSize: '0.78rem', fontWeight: 700,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              }}>
                {activeUser ? (activeUser.first_name || activeUser.username || '?')[0].toUpperCase() : '?'}
              </Avatar>
              <Box>
                <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: 'text.primary', lineHeight: 1.2 }}>
                  {activeUser ? `${activeUser.first_name || ''} ${activeUser.last_name || ''}`.trim() : 'Student'}
                </Typography>
                <Typography sx={{ fontSize: '0.68rem', color: muted }}>
                  @{activeUser?.username || ''}
                </Typography>
              </Box>
            </Box>

            {/* Messages */}
            <Box sx={{ flex: 1, overflowY: 'auto', px: 2.5, py: 2 }}>
              {messages.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Typography sx={{ color: muted, fontSize: '0.85rem' }}>
                    No messages yet. Send the first message!
                  </Typography>
                </Box>
              )}
              {messages.map((msg, i) => {
                const showDate = i === 0 || new Date(messages[i - 1].created_at).toDateString() !== new Date(msg.created_at).toDateString()
                return (
                  <React.Fragment key={msg.id}>
                    {showDate && (
                      <Box sx={{ textAlign: 'center', my: 2 }}>
                        <Chip
                          label={new Date(msg.created_at).toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' })}
                          size="small"
                          sx={{
                            fontSize: '0.62rem', fontWeight: 500,
                            bgcolor: isDark ? 'rgba(255,255,255,0.07)' : '#f1f5f9',
                            color: muted,
                          }}
                        />
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: msg.is_mine ? 'flex-end' : 'flex-start', mb: 1 }}>
                      <Box sx={{
                        px: 1.8, py: 1, maxWidth: '70%',
                        borderRadius: 2,
                        borderBottomRightRadius: msg.is_mine ? 4 : 16,
                        borderBottomLeftRadius: msg.is_mine ? 16 : 4,
                        bgcolor: msg.is_mine
                          ? '#6366f1'
                          : (isDark ? 'rgba(255,255,255,0.07)' : '#ffffff'),
                        color: msg.is_mine ? 'white' : 'text.primary',
                        border: msg.is_mine ? 'none' : border,
                        boxShadow: msg.is_mine
                          ? '0 1px 4px rgba(99,102,241,0.25)'
                          : (isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.04)'),
                      }}>
                        <Typography sx={{ fontSize: '0.86rem', lineHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                          {msg.message}
                        </Typography>
                        <Typography sx={{
                          fontSize: '0.58rem', mt: 0.4, textAlign: 'right',
                          color: msg.is_mine ? 'rgba(255,255,255,0.65)' : muted,
                        }}>
                          {new Date(msg.created_at).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      </Box>
                    </Box>
                  </React.Fragment>
                )
              })}
              <div ref={messagesEndRef} />
            </Box>

            {/* Input */}
            <Box sx={{ px: 2.5, py: 1.5, borderTop: border, bgcolor: inputBg }}>
              <Stack direction="row" spacing={1} alignItems="flex-end">
                <TextField
                  fullWidth multiline maxRows={4} size="small"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '0.86rem',
                      bgcolor: searchBg,
                      '& fieldset': { borderColor: searchBorder },
                      '&:hover fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#cbd5e1' },
                      '&.Mui-focused fieldset': { borderColor: '#6366f1' },
                    },
                  }}
                />
                <IconButton
                  onClick={handleSend}
                  disabled={!newMessage.trim() || sending}
                  sx={{
                    width: 38, height: 38, borderRadius: 1,
                    bgcolor: newMessage.trim() ? '#6366f1' : (isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'),
                    color: newMessage.trim() ? 'white' : muted,
                    '&:hover': { bgcolor: newMessage.trim() ? '#4f46e5' : (isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0') },
                    '&.Mui-disabled': { bgcolor: isDark ? 'rgba(255,255,255,0.04)' : '#f1f5f9', color: isDark ? 'rgba(255,255,255,0.2)' : '#cbd5e1' },
                    transition: 'all 0.2s',
                  }}
                >
                  <SendIcon sx={{ fontSize: 17 }} />
                </IconButton>
              </Stack>
            </Box>
          </>
        )}
      </Box>
    </Box>
  )
}
