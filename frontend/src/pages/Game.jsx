import React, { useEffect, useState, useRef } from 'react'
import { useApiContext } from '../lib/api.jsx'
import { useNavigate } from 'react-router-dom'
import {
  Box, Typography, Button, Stack, Avatar, IconButton, Snackbar, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Fade, CircularProgress,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { keyframes } from '@mui/system'
import SendIcon from '@mui/icons-material/Send'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import QuizIcon from '@mui/icons-material/Quiz'
import TimerIcon from '@mui/icons-material/Timer'
import SecurityIcon from '@mui/icons-material/Security'
import ExerciseRenderer from '../components/ExerciseRenderer.jsx'
import Phase2Introduction from '../components/Phase2Introduction.jsx'

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
    <Avatar
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
    </Avatar>
  )
}

const typingBounce = keyframes`
  0%, 80%, 100% { transform: translateY(0); opacity: 0.35; }
  40% { transform: translateY(-6px); opacity: 1; }
`

function TypingIndicator({ speaker }) {
  const color = COLOR_MAP[speaker] || '#64748b'
  return (
    <Fade in>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, mb: 2 }}>
        <CharAvatar speaker={speaker} size={36} />
        <Box>
          <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color, mb: 0.5 }}>
            {speaker}
          </Typography>
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 0.6,
            bgcolor: 'grey.100',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '18px 18px 18px 4px',
            px: 2, py: 1.5,
          }}>
            {[0, 1, 2].map(i => (
              <Box key={i} sx={{
                width: 8, height: 8, borderRadius: '50%', bgcolor: color,
                animation: `${typingBounce} 1.2s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }} />
            ))}
          </Box>
        </Box>
      </Box>
    </Fade>
  )
}

export default function Game() {
  const { client } = useApiContext()
  const theme = useTheme()
  const mode = theme.palette.mode
  const [state, setState] = useState(null)
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [audioRef, setAudioRef] = useState(null)
  const [pasteWarn, setPasteWarn] = useState(false)
  const [showIntro, setShowIntro] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const messagesEndRef = useRef(null)
  const navigate = useNavigate()

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const s = await client.getGameState()
      if (s.completed) {
        setSubmitError('Assessment Complete! Calculating your results...')
        setTimeout(() => { navigate('/results') }, 2000)
      } else {
        setState(s)
        if (s && s.question && !s.completed) {
          setIsTyping(true)
          await new Promise(r => setTimeout(r, 600))
          setIsTyping(false)
          setMessages(prev => {
            const lastMsg = prev[prev.length - 1]
            if (lastMsg?.type === 'incoming' && lastMsg?.text === s.question.question) return prev
            return [...prev, {
              type: 'incoming',
              speaker: s.question.speaker,
              text: s.question.question,
            }]
          })
        }
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const submit = async (e) => {
    if (e) e.preventDefault()
    setMessages(prev => [...prev, { type: 'outgoing', text: response }])
    setSubmitting(true)
    setSubmitError('')
    try {
      await client.submitResponse({ response, type: state.question.type })
      setResponse('')
      setFeedback(null)
      if (state.current_step === state.total_steps - 1) {
        setSubmitError('Final answer submitted! Preparing your results...')
      }
      await load()
    } catch (e) {
      if (e.message.includes('AI content detected')) {
        setSubmitError('Please rephrase your answer in your own words for the most accurate assessment.')
      } else {
        setSubmitError('Unable to submit response. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleExerciseSubmit = async (responseText) => {
    setMessages(prev => [...prev, { type: 'outgoing', text: responseText }])
    setSubmitting(true)
    setSubmitError('')
    try {
      await client.submitResponse({ response: responseText, type: state.question.type })
      setFeedback(null)
      const msgs = ["Great work! Moving on...", "Nice response! Let's continue...", "Well done! Next scenario...", "Excellent! Keep going...", "Perfect! Moving forward..."]
      setSubmitError(msgs[Math.floor(Math.random() * msgs.length)])
      setTimeout(() => setSubmitError(''), 2000)
      await load()
    } catch (e) {
      if (e.message.includes('AI content detected')) {
        setSubmitError('Please rephrase your answer in your own words for the most accurate assessment.')
      } else {
        setSubmitError('Unable to submit response. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleChatSend = () => {
    if (!chatInput.trim() || submitting) return
    handleExerciseSubmit(chatInput.trim())
    setChatInput('')
  }

  const handleIntroStart = () => { setShowIntro(false) }
  const handleIntroClose = () => { navigate('/dashboard') }

  const getFeedback = async () => {
    try {
      const data = await client.getFeedback({
        question: state.question.question,
        response,
        speaker: state.question.speaker,
        type: state.question.type
      })
      setFeedback(data)
    } catch (e) {
      setFeedback({ error: 'Could not get feedback' })
    }
  }

  const onPaste = (e) => { e.preventDefault(); setPasteWarn(true) }
  const onKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') { e.preventDefault(); setPasteWarn(true) }
  }

  if (loading) return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <CircularProgress />
    </Box>
  )

  if (error) return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', p: 3 }}>
      <Alert severity="error">{error}</Alert>
    </Box>
  )

  if (!state) return null

  if (showIntro && state.current_step === 0) {
    return (
      <Dialog open={true} maxWidth="lg" fullWidth>
        <Phase2Introduction onStart={handleIntroStart} onClose={handleIntroClose} />
      </Dialog>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', maxHeight: '100vh', overflow: 'hidden', bgcolor: 'background.default' }}>

      {/* HEADER */}
      <Box sx={{
        background: mode === 'dark'
          ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
          : 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
        borderRadius: 3,
        mx: 2,
        mt: 2,
        px: { xs: 2.5, sm: 3.5 },
        py: { xs: 2, sm: 2.5 },
        flexShrink: 0,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {Object.keys(AVATAR_MAP)
              .filter((v, i, a) => a.findIndex(x => AVATAR_MAP[x] === AVATAR_MAP[v]) === i)
              .map(name => (
                <CharAvatar key={name} speaker={name} size={32} />
              ))}
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.01em' }}>
              Workplace Chat
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.75rem' }}>
              {state ? `${state.current_step} / ${state.total_steps}` : '...'}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ height: 4, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.15)' }}>
          <Box sx={{
            height: '100%',
            borderRadius: 2,
            bgcolor: '#60a5fa',
            width: state ? `${(state.current_step / state.total_steps) * 100}%` : '0%',
            transition: 'width 0.5s ease',
          }} />
        </Box>
      </Box>

      {/* CHAT THREAD */}
      <Box sx={{
        flex: 1,
        overflowY: 'auto',
        mx: 2,
        my: 1.5,
        p: { xs: 2, sm: 3 },
        bgcolor: mode === 'dark' ? '#0f172a' : '#f8fafc',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
      }}>
        {messages.map((msg, i) => {
          const prevMsg = messages[i - 1]
          const showLabel = msg.type === 'incoming' && prevMsg?.speaker !== msg.speaker
          return (
            <Fade in key={i} timeout={350}>
              <Box sx={{
                display: 'flex',
                flexDirection: msg.type === 'outgoing' ? 'row-reverse' : 'row',
                alignItems: 'flex-end',
                gap: 1,
                mb: 1.5,
              }}>
                {msg.type === 'incoming' && <CharAvatar speaker={msg.speaker} size={36} />}
                <Box sx={{ maxWidth: '75%' }}>
                  {showLabel && (
                    <Typography sx={{
                      fontSize: '0.72rem', fontWeight: 700,
                      color: COLOR_MAP[msg.speaker] || '#64748b',
                      mb: 0.5,
                      ml: 0.5,
                    }}>
                      {msg.speaker}
                    </Typography>
                  )}
                  <Box sx={{
                    px: 2.5, py: 1.5,
                    bgcolor: msg.type === 'incoming'
                      ? (mode === 'dark' ? '#1e293b' : '#f1f5f9')
                      : '#1e3a8a',
                    color: msg.type === 'incoming'
                      ? (mode === 'dark' ? '#e2e8f0' : '#0f172a')
                      : '#ffffff',
                    borderRadius: msg.type === 'incoming'
                      ? '18px 18px 18px 4px'
                      : '18px 18px 4px 18px',
                    border: msg.type === 'incoming' ? '1px solid' : 'none',
                    borderColor: 'divider',
                    fontSize: '0.95rem',
                    lineHeight: 1.65,
                  }}>
                    {msg.text}
                  </Box>
                </Box>
              </Box>
            </Fade>
          )
        })}

        {isTyping && state?.question && (
          <TypingIndicator speaker={state.question.speaker} />
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* INPUT AREA */}
      <Box sx={{ mx: 2, mb: 2, flexShrink: 0 }}>
        {state?.skill_description && (
          <Box sx={{
            mb: 1,
            px: 2.5, py: 1,
            bgcolor: mode === 'dark' ? '#1e293b' : '#eff6ff',
            border: '1px solid',
            borderColor: mode === 'dark' ? '#334155' : '#bfdbfe',
            borderRadius: 2,
          }}>
            <Typography sx={{
              fontSize: '0.8rem',
              color: mode === 'dark' ? '#93c5fd' : '#1e40af',
              fontWeight: 500,
            }}>
              Assessing: {state.skill_description}
            </Typography>
          </Box>
        )}

        {state?.question && state.question.type !== 'open_ended' && state.question.type !== 'text' && (
          <ExerciseRenderer
            question={{ ...state.question, audio_url: state.audio_url, hint: state.hint }}
            onSubmit={handleExerciseSubmit}
            loading={submitting}
          />
        )}

        {(!state?.question || state.question.type === 'open_ended' || state.question.type === 'text') && (
          <Box sx={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 1.5,
            bgcolor: mode === 'dark' ? '#1e293b' : '#ffffff',
            border: '1px solid',
            borderColor: mode === 'dark' ? '#475569' : '#cbd5e1',
            borderRadius: 3,
            p: 1.5,
            boxShadow: mode === 'dark' ? 'none' : '0 1px 6px rgba(0,0,0,0.06)',
            '&:focus-within': {
              borderColor: '#1e3a8a',
              boxShadow: '0 0 0 3px rgba(30,58,138,0.1)',
            },
          }}>
            <TextField
              multiline
              minRows={2}
              maxRows={4}
              fullWidth
              placeholder="Type your reply…"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleChatSend()
                }
              }}
              disabled={submitting || !state?.question}
              variant="standard"
              InputProps={{ disableUnderline: true }}
              sx={{
                '& .MuiInputBase-input': {
                  fontSize: '0.95rem',
                  lineHeight: 1.65,
                  color: mode === 'dark' ? '#e2e8f0' : '#0f172a',
                  '&::placeholder': {
                    color: mode === 'dark' ? '#475569' : '#94a3b8',
                    opacity: 1,
                  },
                },
              }}
            />
            <IconButton
              onClick={handleChatSend}
              disabled={!chatInput.trim() || submitting}
              sx={{
                width: 44, height: 44,
                bgcolor: (!chatInput.trim() || submitting) ? 'transparent' : '#1e3a8a',
                color: (!chatInput.trim() || submitting)
                  ? (mode === 'dark' ? '#64748b' : '#94a3b8')
                  : '#ffffff',
                borderRadius: 2,
                '&:hover': { bgcolor: '#1e40af' },
                '&.Mui-disabled': {
                  bgcolor: mode === 'dark' ? '#334155' : '#e2e8f0',
                },
                flexShrink: 0,
                transition: 'all 200ms ease',
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* Paste warning */}
      <Snackbar
        open={pasteWarn}
        autoHideDuration={2500}
        onClose={() => setPasteWarn(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="warning" variant="filled" onClose={() => setPasteWarn(false)}
          sx={{ borderRadius: 3 }}
        >
          Pasting is disabled. Please type your own response.
        </Alert>
      </Snackbar>

      {/* Submit Error / Feedback Snackbar */}
      <Snackbar
        open={!!submitError}
        autoHideDuration={3000}
        onClose={() => setSubmitError('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="info" variant="filled" onClose={() => setSubmitError('')} sx={{ borderRadius: 3 }}>
          {submitError}
        </Alert>
      </Snackbar>

      {/* Instructions Dialog */}
      <Dialog
        open={showInstructions}
        onClose={() => setShowInstructions(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, border: '1px solid #f1f5f9', boxShadow: '0 16px 48px rgba(0,0,0,0.08)' } }}
      >
        <DialogTitle sx={{ textAlign: 'center', pt: 4, pb: 1 }}>
          <Box sx={{
            width: 56, height: 56, borderRadius: 3, mx: 'auto', mb: 2,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
          }}>
            <QuizIcon sx={{ fontSize: 28, color: 'white' }} />
          </Box>
          <Typography sx={{ fontWeight: 750, fontSize: '1.25rem', color: '#0f172a' }}>
            Assessment Instructions
          </Typography>
          <Typography sx={{ color: '#94a3b8', fontSize: '0.88rem', mt: 0.5 }}>
            Get ready for your CEFR level evaluation
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ px: 3 }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Box sx={{ p: 2, borderRadius: 2.5, bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                <TimerIcon sx={{ fontSize: 16, color: '#6366f1' }} />
                <Typography sx={{ fontWeight: 650, fontSize: '0.88rem', color: '#0f172a' }}>What to Expect</Typography>
              </Stack>
              <Stack spacing={0.8}>
                {['9 workplace scenarios — real business situations', '15-20 minutes total — take your time', 'Different NPCs — meet various characters'].map((t, i) => (
                  <Typography key={i} sx={{ fontSize: '0.85rem', color: '#475569', pl: 0.5 }}>
                    &bull;&ensp;{t}
                  </Typography>
                ))}
              </Stack>
            </Box>

            <Box sx={{ p: 2, borderRadius: 2.5, bgcolor: '#f0fdf408', border: '1px solid #bbf7d020' }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                <CheckCircleIcon sx={{ fontSize: 16, color: '#16a34a' }} />
                <Typography sx={{ fontWeight: 650, fontSize: '0.88rem', color: '#0f172a' }}>How to Succeed</Typography>
              </Stack>
              <Stack spacing={0.8}>
                {[
                  'Answer naturally in your own words',
                  'Use complete sentences when possible',
                  'Stay relaxed and be yourself',
                ].map((t, i) => (
                  <Typography key={i} sx={{ fontSize: '0.85rem', color: '#475569', pl: 0.5 }}>
                    &bull;&ensp;{t}
                  </Typography>
                ))}
              </Stack>
            </Box>

            <Box sx={{ p: 2, borderRadius: 2.5, bgcolor: '#fef3c708', border: '1px solid #fde68a20' }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <SecurityIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                <Typography sx={{ fontWeight: 650, fontSize: '0.88rem', color: '#0f172a' }}>AI Detection</Typography>
              </Stack>
              <Typography sx={{ fontSize: '0.85rem', color: '#475569' }}>
                If you see an AI warning, simply rephrase in your own words for the most accurate assessment.
              </Typography>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1.5 }}>
          <Button
            onClick={() => setShowInstructions(false)}
            sx={{
              borderRadius: 2.5, px: 2, py: 0.7, fontWeight: 600,
              textTransform: 'none', fontSize: '0.85rem',
              color: '#64748b', boxShadow: 'none',
              '&:hover': { bgcolor: '#f8fafc', boxShadow: 'none' },
            }}
          >
            I'll read later
          </Button>
          <Button
            startIcon={<PlayArrowIcon sx={{ fontSize: 16 }} />}
            onClick={() => setShowInstructions(false)}
            sx={{
              borderRadius: 2.5, px: 3, py: 0.7, fontWeight: 600,
              textTransform: 'none', fontSize: '0.85rem',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: 'white', boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
              '&:hover': { background: 'linear-gradient(135deg, #5856eb, #4338ca)' },
            }}
          >
            Start Assessment
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  )
}
