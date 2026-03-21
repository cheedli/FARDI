import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Typography, Stack, Avatar, TextField, IconButton, InputAdornment,
  Badge, LinearProgress, Chip
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import SearchIcon from '@mui/icons-material/Search'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useColorMode } from '../theme.jsx'

const LIGHT = {
  pageBg: '#FFFDE7',
  cardBg: '#ffffff',
  heading: '#1A237E',
  body: '#37474F',
  muted: '#78909C',
  border: '#1A237E',
  chatOutBg: '#7B1FA2',
  chatOutText: '#ffffff',
  chatInBg: '#F3E5F5',
  chatInText: '#37474F',
  chatInBorder: '#7B1FA2',
  sidebarBg: '#ffffff',
  inputBg: '#ffffff',
  purple: { bg: '#F3E5F5', border: '#7B1FA2', shadow: '#7B1FA2' },
  blue:   { bg: '#E3F2FD', border: '#1565C0', shadow: '#1565C0' },
  green:  { bg: '#E8F5E9', border: '#2E7D32', shadow: '#2E7D32' },
  indigo: { bg: '#E8EAF6', border: '#283593', shadow: '#283593' },
}
const DARK = {
  pageBg: '#0F0F1A',
  cardBg: '#1A1A2E',
  heading: '#E8EAFF',
  body: '#B0BEC5',
  muted: '#607D8B',
  border: '#3A3A5C',
  chatOutBg: '#6A1B9A',
  chatOutText: '#ffffff',
  chatInBg: '#1E0A2E',
  chatInText: '#B0BEC5',
  chatInBorder: '#9C27B0',
  sidebarBg: '#1A1A2E',
  inputBg: '#1A1A2E',
  purple: { bg: '#1A0A2E', border: '#CE93D8', shadow: '#9C27B0' },
  blue:   { bg: '#0A1A2E', border: '#90CAF9', shadow: '#1565C0' },
  green:  { bg: '#0A1A0A', border: '#A5D6A7', shadow: '#2E7D32' },
  indigo: { bg: '#0A0E1A', border: '#9FA8DA', shadow: '#283593' },
}

export default function AdminChat() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { mode } = useColorMode()
  const D = mode === 'dark' ? DARK : LIGHT

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

  if (loading) return (
    <Box sx={{ p: 4, bgcolor: D.pageBg, minHeight: '100vh' }}>
      <Typography sx={{ mb: 2, color: D.muted }}>Loading messages...</Typography>
      <LinearProgress sx={{ borderRadius: 1 }} />
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 1px)', overflow: 'hidden', bgcolor: D.pageBg }}>

      {/* ── Sidebar ── */}
      <Box sx={{
        width: { xs: '100%', md: 300 },
        flexShrink: 0,
        borderRight: { md: `2px solid ${D.border}` },
        flexDirection: 'column',
        bgcolor: D.pageBg,
        display: { xs: userId ? 'none' : 'flex', md: 'flex' },
      }}>
        {/* Sidebar header */}
        <Box sx={{ p: 2, borderBottom: `2px solid ${D.border}` }}>
          <Typography sx={{
            fontSize: '1rem',
            fontWeight: 700,
            color: D.heading,
            mb: 1.5,
          }}>
            Messages
          </Typography>
          <TextField
            fullWidth size="small" placeholder="Search students..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 17, color: D.muted }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '0.83rem',
                bgcolor: D.pageBg,
                borderRadius: '10px',
                '& fieldset': { borderColor: D.border, borderWidth: '2px' },
                '&:hover fieldset': { borderColor: D.border },
                '&.Mui-focused fieldset': { borderColor: D.border },
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
                  bgcolor: isSelected ? D.purple.bg : 'transparent',
                  borderLeft: `4px solid ${isSelected ? '#7B1FA2' : 'transparent'}`,
                  '&:hover': {
                    bgcolor: isSelected ? D.purple.bg : (mode === 'dark' ? 'rgba(255,255,255,0.04)' : '#fafafa'),
                  },
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
                        ? 'linear-gradient(135deg, #7B1FA2, #CE93D8)'
                        : (mode === 'dark' ? 'rgba(255,255,255,0.1)' : '#e0e0e0'),
                      color: isSelected ? 'white' : D.muted,
                      border: isSelected ? `2px solid #7B1FA2` : '2px solid transparent',
                    }}>
                      {(c.first_name || c.username || '?')[0].toUpperCase()}
                    </Avatar>
                  </Badge>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography sx={{
                        fontSize: '0.83rem', fontWeight: c.unread_count ? 700 : 600,
                        color: D.body,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {c.first_name} {c.last_name}
                      </Typography>
                      <Typography sx={{ fontSize: '0.62rem', color: D.muted, flexShrink: 0, ml: 1 }}>
                        {formatTime(c.last_message_at)}
                      </Typography>
                    </Stack>
                    <Typography sx={{
                      fontSize: '0.73rem',
                      color: c.unread_count ? D.body : D.muted,
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
              <Typography sx={{ color: D.muted, fontSize: '0.83rem' }}>
                {search ? 'No students match' : 'No students registered'}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* ── Chat area ── */}
      <Box sx={{ flex: 1, display: { xs: userId ? 'flex' : 'none', md: 'flex' }, flexDirection: 'column', bgcolor: D.pageBg, minWidth: 0 }}>
        {!userId ? (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 1 }}>
            <ChatBubbleOutlineIcon sx={{ fontSize: 44, color: D.muted, opacity: 0.4 }} />
            <Typography sx={{ fontSize: '0.92rem', color: D.muted }}>
              Select a student to start messaging
            </Typography>
          </Box>
        ) : (
          <>
            {/* Chat header — clay card */}
            <Box sx={{
              px: 2.5, py: 1.4,
              bgcolor: D.pageBg,
              borderBottom: `2px solid ${D.border}`,
              boxShadow: `0 2px 0 ${D.border}`,
              display: 'flex', alignItems: 'center', gap: 1.5,
            }}>
              <IconButton
                onClick={() => navigate('/admin/chat')}
                size="small"
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  color: D.muted,
                  mr: 0.5,
                  border: `2px solid ${D.border}`,
                  borderRadius: '10px',
                  '&:hover': { bgcolor: D.purple.bg },
                }}
              >
                <ArrowBackIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <Avatar sx={{
                width: 32, height: 32, fontSize: '0.78rem', fontWeight: 700,
                background: 'linear-gradient(135deg, #7B1FA2, #CE93D8)',
                border: `2px solid #7B1FA2`,
              }}>
                {activeUser ? (activeUser.first_name || activeUser.username || '?')[0].toUpperCase() : '?'}
              </Avatar>
              <Box>
                <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: D.heading, lineHeight: 1.2 }}>
                  {activeUser ? `${activeUser.first_name || ''} ${activeUser.last_name || ''}`.trim() : 'Student'}
                </Typography>
                <Typography sx={{ fontSize: '0.68rem', color: D.muted }}>
                  @{activeUser?.username || ''}
                </Typography>
              </Box>
            </Box>

            {/* Messages */}
            <Box sx={{ flex: 1, overflowY: 'auto', px: 2.5, py: 2 }}>
              {messages.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Typography sx={{ color: D.muted, fontSize: '0.85rem' }}>
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
                            fontSize: '0.62rem', fontWeight: 600,
                            bgcolor: D.cardBg,
                            color: D.muted,
                            border: `2px solid ${D.border}`,
                            borderRadius: '20px',
                            boxShadow: `2px 2px 0 ${D.border}`,
                          }}
                        />
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: msg.is_mine ? 'flex-end' : 'flex-start', mb: 1 }}>
                      <Box sx={{
                        px: 1.8, py: 1, maxWidth: '70%',
                        ...(msg.is_mine ? {
                          bgcolor: D.chatOutBg,
                          color: D.chatOutText,
                          borderRadius: '18px 18px 4px 18px',
                          boxShadow: '3px 3px 0 rgba(0,0,0,0.2)',
                        } : {
                          bgcolor: D.chatInBg,
                          color: D.chatInText,
                          border: `2px solid ${D.chatInBorder}`,
                          borderRadius: '18px 18px 18px 4px',
                          boxShadow: `2px 2px 0 ${D.chatInBorder}`,
                        }),
                      }}>
                        <Typography sx={{ fontSize: '0.86rem', lineHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                          {msg.message}
                        </Typography>
                        <Typography sx={{
                          fontSize: '0.58rem', mt: 0.4, textAlign: 'right',
                          color: msg.is_mine ? 'rgba(255,255,255,0.65)' : D.muted,
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

            {/* Input area — clay card bottom bar */}
            <Box sx={{
              px: 2.5, py: 1.5,
              bgcolor: D.pageBg,
              borderTop: `2px solid ${D.border}`,
            }}>
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
                      bgcolor: D.pageBg,
                      borderRadius: '12px',
                      '& fieldset': { borderColor: D.border, borderWidth: '2px' },
                      '&:hover fieldset': { borderColor: D.border },
                      '&.Mui-focused fieldset': { borderColor: '#7B1FA2', borderWidth: '2px' },
                    },
                  }}
                />
                <IconButton
                  onClick={handleSend}
                  disabled={!newMessage.trim() || sending}
                  sx={{
                    width: 42, height: 42,
                    borderRadius: '12px',
                    border: `2px solid ${newMessage.trim() ? '#7B1FA2' : D.border}`,
                    bgcolor: newMessage.trim() ? '#7B1FA2' : D.pageBg,
                    color: newMessage.trim() ? 'white' : D.muted,
                    boxShadow: newMessage.trim() ? `3px 3px 0 #4A0072` : `2px 2px 0 ${D.border}`,
                    '&:hover': {
                      bgcolor: newMessage.trim() ? '#6A1B9A' : D.purple.bg,
                      transform: 'translate(-1px, -1px)',
                      boxShadow: newMessage.trim() ? `4px 4px 0 #4A0072` : `3px 3px 0 ${D.border}`,
                    },
                    '&.Mui-disabled': {
                      bgcolor: D.cardBg,
                      color: D.muted,
                      border: `2px solid ${D.border}`,
                      boxShadow: 'none',
                    },
                    transition: 'all 0.15s',
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
