import React, { useEffect, useState, useRef } from 'react'
import { useApiContext } from '../lib/api.jsx'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box, Typography, Button, Stack, Avatar, IconButton, Snackbar, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Fade, CircularProgress,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { keyframes } from '@mui/system'
import SendIcon from '@mui/icons-material/Send'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import QuizIcon from '@mui/icons-material/Quiz'
import TimerIcon from '@mui/icons-material/Timer'
import SecurityIcon from '@mui/icons-material/Security'
import ExerciseRenderer from '../components/ExerciseRenderer.jsx'
import Phase2Introduction from '../components/Phase2Introduction.jsx'

// ─── Theme palette (matches Dashboard clay style) ────────────────────────────
const LIGHT = {
  pageBg:  '#FFFDE7',
  cardBg:  '#ffffff',
  heading: '#1A237E',
  body:    '#37474F',
  muted:   '#78909C',
  divider: '#E8E0F0',
  purple:  '#8E24AA',
  purpleDark: '#6A1B9A',
  purpleLight: '#F3E8FF',
  chatIn:  '#F3E8FF',
  chatOut: '#8E24AA',
  chatInText: '#37474F',
  chatOutText: '#ffffff',
}
const DARK = {
  pageBg:  '#0F0F1A',
  cardBg:  '#1A1A2E',
  heading: '#E8EAFF',
  body:    '#B0BEC5',
  muted:   '#607D8B',
  divider: '#2A2A4A',
  purple:  '#CE93D8',
  purpleDark: '#AB47BC',
  purpleLight: '#1E0A2E',
  chatIn:  '#1E0A2E',
  chatOut: '#7B1FA2',
  chatInText: '#B0BEC5',
  chatOutText: '#ffffff',
}

const AVATAR_MAP = {
  'Ms. Mabrouki': 'mabrouki.svg',
  'SKANDER': 'skander.svg',
  'Skander': 'skander.svg',
  'Emna': 'emna.svg',
  'Ryan': 'ryan.svg',
  'Lilia': 'lilia.svg',
}

const COLOR_MAP = {
  'Ms. Mabrouki': '#1565C0',
  'SKANDER': '#00695C',
  'Skander': '#00695C',
  'Emna': '#8E24AA',
  'Ryan': '#1976D2',
  'Lilia': '#2E7D32',
}

function CharAvatar({ speaker, size = 42 }) {
  const file = AVATAR_MAP[speaker]
  const color = COLOR_MAP[speaker] || '#7B1FA2'
  const [imgError, setImgError] = React.useState(false)
  return (
    <Avatar
      src={(!imgError && file) ? `/static/images/avatars/${file}` : undefined}
      alt={speaker}
      onError={() => setImgError(true)}
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

function TypingIndicator({ speaker, D }) {
  const color = COLOR_MAP[speaker] || '#7B1FA2'
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
            bgcolor: D.chatIn,
            borderRadius: '20px 20px 20px 6px',
            px: 2, py: 1.5,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
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

const WAVEFORM = [3,5,8,5,10,7,12,9,6,14,10,8,5,12,7,10,4,8,11,6,9,5,7,3,10,8,6,4,9,7]

function ChatVoiceNote({ audioUrl, D }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = React.useState(false)
  const [currentTime, setCurrentTime] = React.useState(0)
  const [duration, setDuration] = React.useState(0)

  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    const onEnd = () => setPlaying(false)
    const onTime = () => setCurrentTime(el.currentTime)
    const onLoad = () => setDuration(el.duration || 0)
    el.addEventListener('ended', onEnd)
    el.addEventListener('timeupdate', onTime)
    el.addEventListener('loadedmetadata', onLoad)
    return () => {
      el.removeEventListener('ended', onEnd)
      el.removeEventListener('timeupdate', onTime)
      el.removeEventListener('loadedmetadata', onLoad)
    }
  }, [])

  const toggle = () => {
    const el = audioRef.current
    if (!el) return
    if (playing) { el.pause(); setPlaying(false) }
    else { el.play(); setPlaying(true) }
  }

  const fmt = (s) => `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`
  const progress = duration > 0 ? currentTime / duration : 0
  const active = Math.round(progress * WAVEFORM.length)

  return (
    <Box sx={{
      display: 'flex', alignItems: 'center', gap: 1.5,
      px: 2, py: 1.5,
      bgcolor: D.chatIn,
      border: `2px solid ${D.divider}`,
      boxShadow: `3px 3px 0 ${D.divider}`,
      borderRadius: '20px 20px 20px 6px',
      minWidth: 220, maxWidth: 320,
    }}>
      {audioUrl && <audio ref={audioRef} src={audioUrl} />}
      <IconButton onClick={toggle} sx={{
        width: 36, height: 36, flexShrink: 0,
        bgcolor: D.purple, color: '#fff',
        '&:hover': { bgcolor: D.purpleDark },
      }}>
        {playing ? <PauseIcon sx={{ fontSize: 18 }} /> : <PlayArrowIcon sx={{ fontSize: 18 }} />}
      </IconButton>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1 }}>
        {WAVEFORM.map((h, i) => (
          <Box key={i} sx={{
            width: 3, borderRadius: '2px', height: `${h}px`, flexShrink: 0,
            bgcolor: i < active ? D.purple : D.divider,
            transition: 'background-color 0.1s',
          }} />
        ))}
      </Box>
      <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: D.purple, flexShrink: 0, minWidth: 30 }}>
        {currentTime > 0 ? fmt(currentTime) : duration > 0 ? fmt(duration) : '0:00'}
      </Typography>
    </Box>
  )
}

export default function Game() {
  const { client } = useApiContext()
  const theme = useTheme()
  const mode = theme.palette.mode
  const D = mode === 'dark' ? DARK : LIGHT
  const { step } = useParams()
  const navigate = useNavigate()

  // Track step internally — no URL navigation between questions (avoids remount)
  const initialStep = step ? parseInt(step, 10) - 1 : 0
  const internalStep = useRef(initialStep)

  const [state, setState] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pasteWarn, setPasteWarn] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const messagesEndRef = useRef(null)
  const hasLoaded = useRef(false)

  const addQuestion = async (s) => {
    if (!s?.question || s.completed) return
    setIsTyping(true)
    await new Promise(r => setTimeout(r, 700))
    setIsTyping(false)
    if (s.question.type === 'listening') {
      setMessages(prev => [...prev, {
        type: 'voiceNote',
        speaker: s.question.speaker,
        audio_url: s.audio_url || s.question.audio_url,
      }])
    } else {
      setMessages(prev => [...prev, {
        type: 'incoming',
        speaker: s.question.speaker,
        text: s.question.question,
      }])
    }
  }

  const load = async (stepOverride) => {
    const stepToLoad = stepOverride !== undefined ? stepOverride : internalStep.current
    setLoading(true)
    setError('')
    try {
      const s = await client.getGameState(stepToLoad)
      if (s.completed) {
        setSubmitError('Assessment Complete! Calculating your results...')
        setTimeout(() => navigate('/results'), 2000)
      } else {
        setState(s)
        await addQuestion(s)
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!hasLoaded.current) {
      hasLoaded.current = true
      load(initialStep)
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleExerciseSubmit = async (responseText) => {
    if (!responseText?.trim()) return
    setMessages(prev => [...prev, { type: 'outgoing', text: responseText }])
    setSubmitting(true)
    setSubmitError('')
    try {
      await client.submitResponse({ response: responseText, type: state.question.type })
      const nextStep = internalStep.current + 1
      if (nextStep >= state.total_steps) {
        setSubmitError('Assessment Complete! Calculating your results...')
        setTimeout(() => navigate('/results'), 2000)
      } else {
        internalStep.current = nextStep
        await load(nextStep)
      }
    } catch (e) {
      if (e.message.includes('AI content detected')) {
        setSubmitError('Please rephrase your answer in your own words.')
      } else {
        setSubmitError('Unable to submit. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleChatSend = () => {
    if (!chatInput.trim() || submitting) return
    const text = chatInput.trim()
    setChatInput('')
    handleExerciseSubmit(text)
  }

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
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', bgcolor: D.pageBg }}>
      <CircularProgress sx={{ color: D.purple }} />
    </Box>
  )

  if (error) return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', bgcolor: D.pageBg, p: 3 }}>
      <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', maxHeight: '100vh', overflow: 'hidden', bgcolor: D.pageBg }}>

      {/* HEADER */}
      <Box sx={{
        bgcolor: D.cardBg,
        borderBottom: `1px solid ${D.divider}`,
        px: { xs: 2, sm: 3 },
        py: 1.5,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}>
        {/* Avatars */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {Object.keys(AVATAR_MAP)
            .filter((v, i, a) => a.findIndex(x => AVATAR_MAP[x] === AVATAR_MAP[v]) === i)
            .map((name, i) => (
              <Box key={name} sx={{ ml: i > 0 ? -1 : 0, zIndex: 5 - i }}>
                <CharAvatar speaker={name} size={34} />
              </Box>
            ))}
        </Box>

        {/* Title + progress */}
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: D.heading, lineHeight: 1.2 }}>
            Workplace Chat
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: D.muted }}>
            Question {state ? state.current_step + 1 : '–'} of {state?.total_steps ?? '–'}
          </Typography>
        </Box>

        {/* Step badge */}
        <Box sx={{
          px: 1.5, py: 0.4,
          borderRadius: '20px',
          bgcolor: D.purpleLight,
          border: `1px solid ${D.divider}`,
        }}>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: D.purple }}>
            {state ? `${state.current_step} / ${state.total_steps}` : '–'}
          </Typography>
        </Box>
      </Box>

      {/* Progress bar — slim, no border */}
      <Box sx={{ height: 3, bgcolor: D.divider, flexShrink: 0 }}>
        <Box sx={{
          height: '100%',
          bgcolor: D.purple,
          width: state ? `${(state.current_step / state.total_steps) * 100}%` : '0%',
          transition: 'width 0.5s ease',
        }} />
      </Box>

      {/* CHAT THREAD */}
      <Box sx={{
        flex: 1,
        overflowY: 'auto',
        px: { xs: 2, sm: 3 },
        py: 2.5,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
      }}>
        {messages.map((msg, i) => {
          const prevMsg = messages[i - 1]
          const showLabel = (msg.type === 'incoming' || msg.type === 'voiceNote') && prevMsg?.speaker !== msg.speaker
          if (msg.type === 'voiceNote') return (
            <Fade in key={i} timeout={350}>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, mb: 2 }}>
                <CharAvatar speaker={msg.speaker} size={38} />
                <Box sx={{ maxWidth: '72%' }}>
                  {showLabel && (
                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: COLOR_MAP[msg.speaker] || D.purple, mb: 0.4, ml: 0.5 }}>
                      {msg.speaker}
                    </Typography>
                  )}
                  <ChatVoiceNote audioUrl={msg.audio_url} D={D} />
                </Box>
              </Box>
            </Fade>
          )
          return (
            <Fade in key={i} timeout={350}>
              <Box sx={{
                display: 'flex',
                flexDirection: msg.type === 'outgoing' ? 'row-reverse' : 'row',
                alignItems: 'flex-end',
                gap: 1,
                mb: 2,
              }}>
                {msg.type === 'incoming' && <CharAvatar speaker={msg.speaker} size={38} />}
                <Box sx={{ maxWidth: '72%' }}>
                  {showLabel && (
                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: COLOR_MAP[msg.speaker] || D.purple, mb: 0.4, ml: 0.5 }}>
                      {msg.speaker}
                    </Typography>
                  )}
                  <Box sx={{
                    px: 2.5, py: 1.5,
                    bgcolor: msg.type === 'incoming' ? D.chatIn : D.chatOut,
                    color: msg.type === 'incoming' ? D.chatInText : D.chatOutText,
                    borderRadius: msg.type === 'incoming' ? '20px 20px 20px 6px' : '20px 20px 6px 20px',
                    border: msg.type === 'incoming' ? `2px solid ${D.divider}` : `2px solid ${D.purpleDark}`,
                    boxShadow: msg.type === 'incoming' ? `3px 3px 0 ${D.divider}` : `3px 3px 0 ${D.purpleDark}`,
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

        {isTyping && (
          <TypingIndicator speaker={state?.question?.speaker || messages[messages.length-1]?.speaker} D={D} />
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* INPUT AREA */}
      <Box sx={{
        borderTop: `1px solid ${D.divider}`,
        bgcolor: D.cardBg,
        px: { xs: 2, sm: 3 },
        pt: 1.5,
        pb: 2,
        flexShrink: 0,
      }}>
        {state?.skill_description && (
          <Box sx={{
            mb: 1.5,
            px: 2, py: 0.7,
            bgcolor: D.purpleLight,
            borderRadius: '10px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.8,
          }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: D.purple, flexShrink: 0 }} />
            <Typography sx={{ fontSize: '0.78rem', color: D.purple, fontWeight: 600 }}>
              {state.skill_description}
            </Typography>
          </Box>
        )}

        {state?.question && state.question.type === 'word_bank' && (
          <ExerciseRenderer
            question={{ ...state.question, audio_url: state.audio_url, hint: state.hint }}
            onSubmit={handleExerciseSubmit}
            loading={submitting}
          />
        )}

        {(!state?.question || state.question.type !== 'word_bank') && (
          <Box sx={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 1.5,
            bgcolor: mode === 'dark' ? '#0F0F1A' : '#F9F5FF',
            border: `1.5px solid ${D.divider}`,
            borderRadius: '16px',
            p: 1.5,
            '&:focus-within': {
              borderColor: D.purple,
              boxShadow: `0 0 0 3px ${D.purpleLight}`,
            },
            transition: 'border-color 0.2s, box-shadow 0.2s',
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
                  color: D.body,
                  '&::placeholder': { color: D.muted, opacity: 1 },
                },
              }}
            />
            <IconButton
              onClick={handleChatSend}
              disabled={!chatInput.trim() || submitting}
              sx={{
                width: 42, height: 42,
                bgcolor: chatInput.trim() && !submitting ? D.purple : 'transparent',
                color: chatInput.trim() && !submitting ? '#ffffff' : D.muted,
                borderRadius: '12px',
                '&:hover': { bgcolor: D.purpleDark, color: '#fff' },
                '&.Mui-disabled': { bgcolor: 'transparent', color: D.muted },
                flexShrink: 0,
                transition: 'all 200ms ease',
              }}
            >
              <SendIcon sx={{ fontSize: 20 }} />
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
        PaperProps={{ sx: { borderRadius: '16px', bgcolor: D.cardBg, border: `1.5px solid ${D.divider}`, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' } }}
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
