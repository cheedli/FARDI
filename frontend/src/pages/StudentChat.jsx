import React, { useEffect, useState, useRef } from 'react'
import {
  Box, Typography, Stack, Avatar, TextField, IconButton, Paper,
  LinearProgress, Chip
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import { useColorMode } from '../theme.jsx'

const LIGHT = {
  pageBg: '#FFFDE7', cardBg: '#ffffff', body: '#37474F', muted: '#78909C', border: '#E0E0E0',
  purple: { bg: '#E1BEE7', border: '#8E24AA', shadow: '#8E24AA' },
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
  yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825' },
  red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#C62828' },
}
const DARK = {
  pageBg: '#0F0F1A', cardBg: '#1A1A2E', body: '#B0BEC5', muted: '#607D8B', border: '#2A2A4A',
  purple: { bg: '#1E0A2E', border: '#CE93D8', shadow: '#7B1FA2' },
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#A06800' },
  red:    { bg: '#1F0000', border: '#EF9A9A', shadow: '#B71C1C' },
}

export default function StudentChat() {
  const { mode } = useColorMode()
  const D = mode === 'dark' ? DARK : LIGHT

  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [adminUser, setAdminUser] = useState(null)
  const messagesEndRef = useRef(null)
  const pollRef = useRef(null)

  const loadConversations = async () => {
    try {
      const res = await fetch('/api/chat/conversations', { credentials: 'include' })
      const data = await res.json()
      if (data.success && data.data.length > 0) {
        setConversations(data.data)
        // Auto-select first admin
        if (!adminUser) {
          setAdminUser(data.data[0])
        }
      }
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

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    if (adminUser) {
      loadMessages(adminUser.user_id)
    }
  }, [adminUser])

  // Poll for new messages
  useEffect(() => {
    if (!adminUser) return
    pollRef.current = setInterval(() => {
      loadMessages(adminUser.user_id)
    }, 5000)
    return () => clearInterval(pollRef.current)
  }, [adminUser])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!newMessage.trim() || !adminUser) return
    setSending(true)
    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ receiver_id: adminUser.user_id, message: newMessage.trim() }),
      })
      const data = await res.json()
      if (data.success) {
        setNewMessage('')
        loadMessages(adminUser.user_id)
      }
    } catch {}
    setSending(false)
  }

  if (loading) {
    return (
      <Box sx={{
        p: 4,
        bgcolor: D.pageBg,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
      }}>
        <Typography sx={{
          mb: 2,
          color: D.muted,
          fontWeight: 700,
          fontSize: '0.95rem',
          letterSpacing: '0.02em',
        }}>
          Loading messages...
        </Typography>
        <Box sx={{
          width: '100%',
          maxWidth: 320,
          border: `2px solid ${D.yellow.border}`,
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: `4px 4px 0 ${D.yellow.shadow}`,
        }}>
          <LinearProgress
            sx={{
              height: 10,
              bgcolor: D.yellow.bg,
              '& .MuiLinearProgress-bar': {
                bgcolor: D.yellow.border,
                borderRadius: 0,
              },
            }}
          />
        </Box>
      </Box>
    )
  }

  if (!adminUser) {
    return (
      <Box sx={{
        bgcolor: D.pageBg,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Box sx={{
          textAlign: 'center',
          p: 4,
          bgcolor: D.cardBg,
          border: `2px solid ${D.border}`,
          borderRadius: '20px',
          boxShadow: `4px 4px 0 ${D.border}`,
          maxWidth: 300,
        }}>
          <Box sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 64,
            height: 64,
            bgcolor: D.green.bg,
            border: `2px solid ${D.green.border}`,
            borderRadius: '16px',
            boxShadow: `3px 3px 0 ${D.green.shadow}`,
            mb: 2,
          }}>
            <SupportAgentIcon sx={{ fontSize: 32, color: D.green.border }} />
          </Box>
          <Typography sx={{ color: D.body, fontWeight: 700, fontSize: '0.95rem' }}>
            No instructor available for chat
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 1px)',
      overflow: 'hidden',
      bgcolor: D.pageBg,
    }}>
      {/* Header */}
      <Box sx={{
        px: 2.5,
        py: 1.5,
        borderBottom: `2px solid ${D.border}`,
        boxShadow: `0 3px 0 ${D.border}`,
        bgcolor: D.cardBg,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        flexShrink: 0,
      }}>
        <Box sx={{
          width: 40,
          height: 40,
          bgcolor: D.green.bg,
          border: `2px solid ${D.green.border}`,
          boxShadow: `2px 2px 0 ${D.green.shadow}`,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <SupportAgentIcon sx={{ fontSize: 20, color: D.green.border }} />
        </Box>
        <Box>
          <Typography sx={{
            fontSize: '1rem',
            fontWeight: 700,
            color: D.body,
            lineHeight: 1.2,
          }}>
            {adminUser.first_name} {adminUser.last_name}
          </Typography>
          <Typography sx={{
            fontSize: '0.72rem',
            color: D.green.border,
            fontWeight: 600,
          }}>
            Instructor
          </Typography>
        </Box>
      </Box>

      {/* Messages */}
      <Box sx={{
        flex: 1,
        overflowY: 'auto',
        px: 2.5,
        py: 2,
        bgcolor: D.pageBg,
      }}>
        {messages.length === 0 && (
          <Box sx={{
            textAlign: 'center',
            py: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
          }}>
            <Box sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              bgcolor: D.green.bg,
              border: `2px solid ${D.green.border}`,
              borderRadius: '16px',
              boxShadow: `3px 3px 0 ${D.green.shadow}`,
              mb: 1,
            }}>
              <SupportAgentIcon sx={{ fontSize: 28, color: D.green.border }} />
            </Box>
            <Typography sx={{
              color: D.body,
              fontSize: '0.95rem',
              fontWeight: 700,
            }}>
              Message your instructor
            </Typography>
            <Typography sx={{
              color: D.muted,
              fontSize: '0.78rem',
              fontWeight: 500,
            }}>
              Ask questions about your learning progress
            </Typography>
          </Box>
        )}
        {messages.map((msg, i) => {
          const showDate = i === 0 || new Date(messages[i-1].created_at).toDateString() !== new Date(msg.created_at).toDateString()
          return (
            <React.Fragment key={msg.id}>
              {showDate && (
                <Box sx={{ textAlign: 'center', my: 2 }}>
                  <Chip
                    label={new Date(msg.created_at).toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' })}
                    size="small"
                    sx={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      bgcolor: D.yellow.bg,
                      border: `2px solid ${D.yellow.border}`,
                      color: D.body,
                      borderRadius: '50px',
                      boxShadow: `2px 2px 0 ${D.yellow.shadow}`,
                      '& .MuiChip-label': { px: 1.5 },
                    }}
                  />
                </Box>
              )}
              <Box sx={{
                display: 'flex',
                justifyContent: msg.is_mine ? 'flex-end' : 'flex-start',
                mb: 1,
                alignItems: 'flex-end',
              }}>
                {!msg.is_mine && (
                  <Box sx={{
                    width: 28,
                    height: 28,
                    mr: 1,
                    mb: 0.5,
                    bgcolor: D.green.bg,
                    border: `2px solid ${D.green.border}`,
                    borderRadius: '8px',
                    boxShadow: `2px 2px 0 ${D.green.shadow}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <SupportAgentIcon sx={{ fontSize: 14, color: D.green.border }} />
                  </Box>
                )}
                <Box sx={{
                  px: 2,
                  py: 1,
                  maxWidth: '70%',
                  borderRadius: msg.is_mine
                    ? '18px 18px 6px 18px'
                    : '18px 18px 18px 6px',
                  bgcolor: msg.is_mine ? D.purple.bg : D.cardBg,
                  color: msg.is_mine ? D.purple.border : D.body,
                  border: msg.is_mine
                    ? `2px solid ${D.purple.border}`
                    : `2px solid ${D.border}`,
                  boxShadow: msg.is_mine
                    ? `3px 3px 0 ${D.purple.shadow}`
                    : `3px 3px 0 ${D.border}`,
                }}>
                  <Typography sx={{
                    fontSize: '0.88rem',
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    fontWeight: 500,
                  }}>
                    {msg.message}
                  </Typography>
                  <Typography sx={{
                    fontSize: '0.6rem',
                    mt: 0.5,
                    color: msg.is_mine ? D.purple.border : D.muted,
                    textAlign: 'right',
                    fontWeight: 600,
                    opacity: 0.75,
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
      <Box sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `2px solid ${D.border}`,
        boxShadow: `0 -3px 0 ${D.border}`,
        bgcolor: D.cardBg,
        flexShrink: 0,
      }}>
        <Stack direction="row" spacing={1} alignItems="flex-end">
          <TextField
            fullWidth
            multiline
            maxRows={4}
            size="small"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '14px',
                bgcolor: D.pageBg,
                fontSize: '0.88rem',
                fontWeight: 500,
                transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
                '& fieldset': {
                  border: `2px solid ${D.border}`,
                  borderRadius: '14px',
                },
                '&:hover fieldset': {
                  border: `2px solid ${D.purple.border}`,
                },
                '&.Mui-focused fieldset': {
                  border: `2px solid ${D.purple.border}`,
                },
                '&.Mui-focused': {
                  boxShadow: `3px 3px 0 ${D.purple.shadow}`,
                },
              },
              '& .MuiInputBase-input': {
                color: D.body,
              },
              '& .MuiInputBase-input::placeholder': {
                color: D.muted,
                opacity: 1,
              },
            }}
          />
          <IconButton
            onClick={handleSend}
            disabled={!newMessage.trim() || sending}
            sx={{
              width: 42,
              height: 42,
              borderRadius: '12px',
              flexShrink: 0,
              bgcolor: newMessage.trim() ? D.purple.bg : D.border,
              color: newMessage.trim() ? D.purple.border : D.muted,
              border: newMessage.trim()
                ? `2px solid ${D.purple.border}`
                : `2px solid ${D.border}`,
              boxShadow: newMessage.trim()
                ? `3px 3px 0 ${D.purple.shadow}`
                : 'none',
              transition: 'all 0.15s ease',
              '&:hover': newMessage.trim() ? {
                transform: 'translate(-2px, -2px)',
                boxShadow: `5px 5px 0 ${D.purple.shadow}`,
                bgcolor: D.purple.bg,
              } : {},
              '&.Mui-disabled': {
                bgcolor: D.border,
                color: D.muted,
                border: `2px solid ${D.border}`,
                boxShadow: 'none',
              },
            }}
          >
            <SendIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Stack>
      </Box>
    </Box>
  )
}
