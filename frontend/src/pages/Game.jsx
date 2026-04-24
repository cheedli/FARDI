import React, { useEffect, useRef, useState } from 'react'
import { useApiContext } from '../lib/api.jsx'
import { useNavigate } from 'react-router-dom'
import {
  Box, Typography, Stack, Chip, IconButton, Snackbar, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, List,
  ListItem, ListItemText, TextField, CircularProgress,
} from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import SendIcon from '@mui/icons-material/Send'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import ReplayIcon from '@mui/icons-material/Replay'
import HelpIcon from '@mui/icons-material/Help'
import QuizIcon from '@mui/icons-material/Quiz'
import TimerIcon from '@mui/icons-material/Timer'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import SecurityIcon from '@mui/icons-material/Security'
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import Avatar from '../components/Avatar.jsx'
import Phase2Introduction from '../components/Phase2Introduction.jsx'

// ── Character colour palette (clay style) ─────────────────────────────────────
const CHAR_COLORS = {
  'Ms. Mabrouki': { bg: '#BBDEFB', border: '#1976D2', shadow: '#1565C0', text: '#0D47A1' },
  'SKANDER':      { bg: '#B2EBF2', border: '#0097A7', shadow: '#00695C', text: '#006064' },
  'Emna':         { bg: '#FFE0B2', border: '#F57C00', shadow: '#E65100', text: '#BF360C' },
  'Ryan':         { bg: '#C8E6C9', border: '#388E3C', shadow: '#2E7D32', text: '#1B5E20' },
  'Lilia':        { bg: '#E1BEE7', border: '#8E24AA', shadow: '#7B1FA2', text: '#4A148C' },
}
const DEFAULT_CHAR = { bg: '#F3E5F5', border: '#9C27B0', shadow: '#7B1FA2', text: '#4A148C' }

const STUDENT_COLOR = { bg: '#E8EAF6', border: '#3949AB', shadow: '#283593' }

function charColor(name) {
  return CHAR_COLORS[name] || DEFAULT_CHAR
}

// ── Typing indicator ────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ px: 1, py: 0.5 }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          style={{ width: 7, height: 7, borderRadius: '50%', background: '#94a3b8' }}
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
          transition={{ duration: 0.9, delay: i * 0.2, repeat: Infinity }}
        />
      ))}
    </Stack>
  )
}

// ── Single NPC message bubble ───────────────────────────────────────────────
function NpcBubble({ speaker, question, instruction, type, audioUrl, showAvatar, isNew }) {
  const C = charColor(speaker)
  const audioRef = useRef(null)

  // For listening questions, show only the instruction ("Listen carefully and repeat exactly what I say")
  // — not the sentence to repeat, which should come through audio only
  const displayText = type === 'listening'
    ? question.split(':')[0].trim()
    : question

  return (
    <motion.div
      initial={isNew ? { opacity: 0, x: -24 } : false}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.38, ease: 'easeOut' }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, mb: showAvatar ? 2 : 0.8, mt: showAvatar ? 1.5 : 0 }}>
        {/* Avatar column — always reserve space */}
        <Box sx={{ width: 36, flexShrink: 0 }}>
          {showAvatar && (
            <Avatar speaker={speaker} size={36} showName={false} />
          )}
        </Box>

        <Box sx={{ maxWidth: '72%' }}>
          {showAvatar && (
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: C.text, mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {speaker}
            </Typography>
          )}

          {/* Bubble */}
          <Box sx={{
            bgcolor: C.bg,
            border: `2px solid ${C.border}`,
            borderRadius: '18px 18px 18px 4px',
            boxShadow: `3px 3px 0 ${C.shadow}`,
            px: 2, py: 1.5,
          }}>
            <Typography sx={{ fontSize: '0.95rem', lineHeight: 1.65, color: '#1e293b', fontWeight: 450 }}>
              {displayText}
            </Typography>

            {instruction && (
              <Box sx={{
                mt: 1.2, pt: 1.2, borderTop: `1px dashed ${C.border}`,
                display: 'flex', gap: 1, alignItems: 'flex-start',
              }}>
                <Typography sx={{ fontSize: '0.78rem', color: C.text, fontWeight: 600, flexShrink: 0 }}>Task:</Typography>
                <Typography sx={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.5 }}>{instruction}</Typography>
              </Box>
            )}

            {audioUrl && (
              <Box sx={{ mt: 1.5 }}>
                <audio src={audioUrl} ref={audioRef} />
                <Stack direction="row" spacing={1}>
                  <Box
                    component="button"
                    onClick={() => audioRef.current?.play()}
                    sx={{
                      display: 'flex', alignItems: 'center', gap: 0.5,
                      px: 1.5, py: 0.5, borderRadius: '10px', cursor: 'pointer',
                      bgcolor: C.border, color: 'white', border: 'none',
                      fontSize: '0.75rem', fontWeight: 700,
                      '&:hover': { opacity: 0.85 },
                    }}
                  >
                    <PlayArrowIcon sx={{ fontSize: 15 }} /> Play
                  </Box>
                  <Box
                    component="button"
                    onClick={() => { if (audioRef.current) { audioRef.current.currentTime = 0; audioRef.current.play() } }}
                    sx={{
                      display: 'flex', alignItems: 'center', gap: 0.5,
                      px: 1.5, py: 0.5, borderRadius: '10px', cursor: 'pointer',
                      bgcolor: 'transparent', color: C.border, border: `1.5px solid ${C.border}`,
                      fontSize: '0.75rem', fontWeight: 700,
                      '&:hover': { bgcolor: C.bg },
                    }}
                  >
                    <ReplayIcon sx={{ fontSize: 14 }} /> Replay
                  </Box>
                </Stack>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </motion.div>
  )
}

// ── Student reply bubble ────────────────────────────────────────────────────
function StudentBubble({ text }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.32, ease: 'easeOut' }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1.5 }}>
        <Box sx={{
          maxWidth: '72%',
          bgcolor: STUDENT_COLOR.bg,
          border: `2px solid ${STUDENT_COLOR.border}`,
          borderRadius: '18px 18px 4px 18px',
          boxShadow: `3px 3px 0 ${STUDENT_COLOR.shadow}`,
          px: 2, py: 1.5,
        }}>
          <Typography sx={{ fontSize: '0.95rem', lineHeight: 1.65, color: '#1e293b' }}>
            {text}
          </Typography>
        </Box>
      </Box>
    </motion.div>
  )
}

export default function Game() {
  const { client } = useApiContext()
  const navigate = useNavigate()

  const [state, setState] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [response, setResponse] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [pasteWarn, setPasteWarn] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  const [showIntro, setShowIntro] = useState(false)
  const [notice, setNotice] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [feedbackOpen, setFeedbackOpen] = useState(false)

  // Full conversation history: [{role:'npc', speaker, question, instruction, audioUrl, isNew}, {role:'student', text}]
  const [history, setHistory] = useState([])

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => { scrollToBottom() }, [history, submitting])

  const load = async (isFirst = false) => {
    setLoading(true)
    setError('')
    try {
      const s = await client.getGameState()
      if (s.completed) {
        setNotice('Assessment complete! Calculating your results…')
        setTimeout(() => navigate('/results'), 2000)
        return
      }
      setState(s)
      // Push the new NPC message into history
      setHistory((prev) => {
        // Avoid duplicating if same step already in history
        const alreadyHas = prev.some(
          (m) => m.role === 'npc' && m.step === s.current_step
        )
        if (alreadyHas) return prev
        return [
          ...prev,
          {
            role: 'npc',
            step: s.current_step,
            speaker: s.question.speaker,
            question: s.question.question,
            instruction: s.question.instruction,
            type: s.question.type,
            audioUrl: s.audio_url,
            isNew: true,
          },
        ]
      })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(true) }, [])

  // After history updates, mark all as not-new so re-renders don't re-animate
  useEffect(() => {
    setHistory((prev) =>
      prev.map((m) => (m.isNew ? { ...m, isNew: false } : m))
    )
  }, [history.length])

  const submit = async () => {
    if (!response.trim() || submitting) return
    const text = response.trim()
    setResponse('')
    // Append student bubble immediately
    setHistory((prev) => [...prev, { role: 'student', text }])
    setSubmitting(true)
    try {
      await client.submitResponse({ response: text, type: state.question.type })
      await load()
    } catch (e) {
      if (e.message.includes('AI content detected')) {
        setNotice('Please rephrase in your own words for the most accurate assessment.')
      } else {
        setNotice('Unable to submit. Please try again.')
      }
    } finally {
      setSubmitting(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
      e.preventDefault()
      setPasteWarn(true)
    }
  }

  const getFeedback = async () => {
    if (!state) return
    try {
      const data = await client.getFeedback({
        question: state.question.question,
        response: history.filter((m) => m.role === 'student').at(-1)?.text || '',
        speaker: state.question.speaker,
        type: state.question.type,
      })
      setFeedback(data)
      setFeedbackOpen(true)
    } catch {
      setFeedback({ error: 'Could not get feedback.' })
      setFeedbackOpen(true)
    }
  }

  // ── Loading / Error states ────────────────────────────────────────────────
  if (loading && history.length === 0) return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#FAFAFA' }}>
      <CircularProgress size={28} sx={{ color: '#6366f1' }} />
    </Box>
  )
  if (error) return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#FAFAFA' }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography sx={{ color: '#ef4444', fontWeight: 600, mb: 1 }}>Something went wrong</Typography>
        <Typography sx={{ color: '#94a3b8', fontSize: '0.88rem' }}>{error}</Typography>
      </Box>
    </Box>
  )

  if (showIntro && state?.current_step === 0) return (
    <Dialog open maxWidth="lg" fullWidth>
      <Phase2Introduction
        onStart={() => setShowIntro(false)}
        onClose={() => navigate('/dashboard')}
      />
    </Dialog>
  )

  const { current_step = 0, total_steps = 9, xp = 0, question = {} } = state || {}
  const progress = Math.round((current_step / total_steps) * 100)
  const timeLeft = Math.max(1, Math.round((total_steps - current_step) * 2))

  // Group consecutive NPC messages so avatar only shows on first of a run
  const renderedHistory = history.map((msg, idx) => {
    if (msg.role !== 'npc') return { ...msg, showAvatar: false }
    const prev = history[idx - 1]
    const showAvatar = !prev || prev.role !== 'npc' || prev.speaker !== msg.speaker
    return { ...msg, showAvatar }
  })

  const lastStudentMsg = history.filter((m) => m.role === 'student').at(-1)

  return (
    <Box sx={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: '#FFFDE7',
      overflow: 'hidden',
    }}>

      {/* ── Fixed header ─────────────────────────────────────────────────── */}
      <Box sx={{
        flexShrink: 0,
        px: { xs: 2, md: 3 },
        py: 1.5,
        bgcolor: 'white',
        borderBottom: '1px solid #f1f5f9',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}>
        <Box sx={{ maxWidth: 720, mx: 'auto' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.2 }}>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: { xs: '1rem', md: '1.1rem' }, color: '#0f172a' }}>
                Business English Assessment
              </Typography>
              <Typography sx={{ color: '#94a3b8', fontSize: '0.78rem' }}>
                Question {current_step + 1} of {total_steps}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip size="small" label={`${xp} XP`} sx={{
                height: 24, fontSize: '0.72rem', fontWeight: 700,
                bgcolor: '#6366f108', color: '#6366f1', border: '1px solid #6366f120',
              }} />
              <Chip size="small" icon={<TimerIcon sx={{ fontSize: 13 }} />} label={`~${timeLeft}m`} sx={{
                height: 24, fontSize: '0.72rem', fontWeight: 600,
                bgcolor: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0',
                '& .MuiChip-icon': { color: '#94a3b8' },
              }} />
              <IconButton size="small" onClick={() => setShowInstructions(true)}
                sx={{ width: 28, height: 28, color: '#94a3b8', '&:hover': { bgcolor: '#f8fafc' } }}>
                <HelpIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Stack>
          </Stack>

          {/* Progress bar */}
          <Box sx={{ height: 5, borderRadius: 3, bgcolor: '#f1f5f9', overflow: 'hidden' }}>
            <motion.div
              style={{ height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, #6366f1, #0ea5e9)' }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </Box>
        </Box>
      </Box>

      {/* ── Scene pill ───────────────────────────────────────────────────── */}
      {question.scene && (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1.5, flexShrink: 0 }}>
          <Chip
            size="small"
            label={String(question.scene).replaceAll('_', ' ')}
            sx={{
              fontSize: '0.7rem', fontWeight: 700, textTransform: 'capitalize',
              bgcolor: '#e0e7ff', color: '#4338ca', border: '1px solid #c7d2fe',
              height: 22,
            }}
          />
        </Box>
      )}

      {/* ── Scrollable chat thread ────────────────────────────────────────── */}
      <Box sx={{
        flex: 1,
        overflowY: 'auto',
        px: { xs: 2, md: 3 },
        py: 2,
        '&::-webkit-scrollbar': { width: 6 },
        '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
        '&::-webkit-scrollbar-thumb': { bgcolor: '#e2e8f0', borderRadius: 3 },
      }}>
        <Box sx={{ maxWidth: 720, mx: 'auto' }}>
          <AnimatePresence>
            {renderedHistory.map((msg, idx) =>
              msg.role === 'npc' ? (
                <NpcBubble
                  key={`npc-${msg.step}-${idx}`}
                  speaker={msg.speaker}
                  question={msg.question}
                  instruction={msg.instruction}
                  type={msg.type}
                  audioUrl={msg.audioUrl}
                  showAvatar={msg.showAvatar}
                  isNew={msg.isNew}
                />
              ) : (
                <StudentBubble key={`student-${idx}`} text={msg.text} />
              )
            )}
          </AnimatePresence>

          {/* Typing indicator while submitting / loading next */}
          {submitting && (
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, mb: 1 }}>
              <Box sx={{ width: 36, flexShrink: 0 }} />
              <Box sx={{
                bgcolor: '#f1f5f9', border: '2px solid #e2e8f0',
                borderRadius: '18px 18px 18px 4px',
                boxShadow: '3px 3px 0 #cbd5e1',
                px: 2, py: 1,
              }}>
                <TypingDots />
              </Box>
            </Box>
          )}

          <div ref={messagesEndRef} />
        </Box>
      </Box>

      {/* ── Fixed input area ─────────────────────────────────────────────── */}
      <Box sx={{
        flexShrink: 0,
        bgcolor: 'white',
        borderTop: '1px solid #f1f5f9',
        px: { xs: 2, md: 3 },
        py: 1.5,
        boxShadow: '0 -2px 8px rgba(0,0,0,0.04)',
      }}>
        <Box sx={{ maxWidth: 720, mx: 'auto' }}>
          {/* Feedback toggle */}
          {lastStudentMsg && (
            <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ mb: 1 }}>
              <Box
                component="button"
                onClick={getFeedback}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 0.6,
                  px: 1.5, py: 0.5, borderRadius: '10px', cursor: 'pointer',
                  bgcolor: '#fef3c7', color: '#b45309',
                  border: '1.5px solid #fde68a',
                  fontSize: '0.75rem', fontWeight: 700,
                  '&:hover': { bgcolor: '#fde68a' },
                }}
              >
                <TipsAndUpdatesIcon sx={{ fontSize: 14 }} />
                AI Feedback
              </Box>
            </Stack>
          )}

          {/* Input row */}
          <Stack direction="row" spacing={1} alignItems="flex-end">
            <TextField
              inputRef={inputRef}
              multiline
              maxRows={4}
              fullWidth
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={(e) => { e.preventDefault(); setPasteWarn(true) }}
              placeholder="Type your reply…"
              disabled={submitting || loading}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '16px',
                  bgcolor: '#f8fafc',
                  fontSize: '0.92rem',
                  '& fieldset': { border: '2px solid #e2e8f0' },
                  '&:hover fieldset': { border: '2px solid #c7d2fe' },
                  '&.Mui-focused fieldset': { border: '2px solid #6366f1' },
                },
              }}
            />
            <Box
              component="button"
              onClick={submit}
              disabled={!response.trim() || submitting}
              sx={{
                width: 44, height: 44, borderRadius: '14px', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                border: 'none', cursor: 'pointer',
                boxShadow: '3px 3px 0 #4338ca',
                color: 'white',
                transition: 'all 0.15s',
                '&:hover:not(:disabled)': { transform: 'translate(-1px,-1px)', boxShadow: '4px 4px 0 #4338ca' },
                '&:disabled': { opacity: 0.45, cursor: 'not-allowed' },
              }}
            >
              <SendIcon sx={{ fontSize: 18 }} />
            </Box>
          </Stack>

          <Typography sx={{ fontSize: '0.68rem', color: '#cbd5e1', mt: 0.8, textAlign: 'center' }}>
            Press Enter to send · Shift+Enter for new line
          </Typography>
        </Box>
      </Box>

      {/* ── AI Feedback dialog ───────────────────────────────────────────── */}
      <Dialog
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, border: '1px solid #f1f5f9' } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <AutoAwesomeIcon sx={{ color: '#6366f1', fontSize: 20 }} />
            <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>AI Feedback</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {feedback?.error && (
            <Typography sx={{ color: '#ef4444', fontSize: '0.88rem' }}>{feedback.error}</Typography>
          )}
          {feedback?.feedback && (
            <Typography sx={{ fontSize: '0.92rem', lineHeight: 1.7, color: '#475569', mb: 1.5 }}>
              {feedback.feedback}
            </Typography>
          )}
          {feedback?.assessment && (
            <Box>
              <Chip size="small" label={`CEFR ${feedback.assessment.level}`} sx={{
                fontWeight: 700, fontSize: '0.75rem', mb: 1.5,
                bgcolor: '#6366f108', color: '#6366f1', border: '1px solid #6366f120',
              }} />
              {Array.isArray(feedback.assessment.strengths) && feedback.assessment.strengths.length > 0 && (
                <Box sx={{ mb: 1 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#16a34a', mb: 0.3 }}>Strengths</Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>
                    {feedback.assessment.strengths.slice(0, 3).join(', ')}
                  </Typography>
                </Box>
              )}
              {Array.isArray(feedback.assessment.improvements) && feedback.assessment.improvements.length > 0 && (
                <Box>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b', mb: 0.3 }}>Areas to improve</Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>
                    {feedback.assessment.improvements.slice(0, 3).join(', ')}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Box
            component="button"
            onClick={() => setFeedbackOpen(false)}
            sx={{
              px: 2.5, py: 0.7, borderRadius: '12px', cursor: 'pointer',
              bgcolor: '#6366f1', color: 'white', border: 'none',
              fontWeight: 700, fontSize: '0.85rem',
              '&:hover': { opacity: 0.88 },
            }}
          >
            Got it
          </Box>
        </DialogActions>
      </Dialog>

      {/* ── Instructions dialog ──────────────────────────────────────────── */}
      <Dialog
        open={showInstructions}
        onClose={() => setShowInstructions(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, border: '1px solid #f1f5f9' } }}
      >
        <DialogTitle sx={{ textAlign: 'center', pt: 3, pb: 1 }}>
          <Box sx={{
            width: 52, height: 52, borderRadius: 3, mx: 'auto', mb: 1.5,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
          }}>
            <QuizIcon sx={{ fontSize: 26, color: 'white' }} />
          </Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>Assessment Instructions</Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 3 }}>
          <List dense>
            {[
              { icon: <TimerIcon sx={{ fontSize: 16, color: '#6366f1' }} />, text: '9 workplace scenarios · ~15-20 minutes total' },
              { icon: <CheckCircleIcon sx={{ fontSize: 16, color: '#16a34a' }} />, text: 'Answer naturally in your own words' },
              { icon: <CheckCircleIcon sx={{ fontSize: 16, color: '#16a34a' }} />, text: 'Use complete sentences when possible' },
              { icon: <SecurityIcon sx={{ fontSize: 16, color: '#f59e0b' }} />, text: 'If AI is detected, rephrase in your own words' },
            ].map(({ icon, text }, i) => (
              <ListItem key={i} sx={{ px: 0, py: 0.6 }}>
                <Box sx={{ mr: 1.5, flexShrink: 0 }}>{icon}</Box>
                <ListItemText primary={text} primaryTypographyProps={{ fontSize: '0.88rem', color: '#475569' }} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Box
            component="button"
            onClick={() => setShowInstructions(false)}
            sx={{
              px: 3, py: 0.7, borderRadius: '12px', cursor: 'pointer',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: 'white', border: 'none', fontWeight: 700, fontSize: '0.85rem',
              boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
              '&:hover': { opacity: 0.9 },
            }}
          >
            Got it, let's go
          </Box>
        </DialogActions>
      </Dialog>

      {/* ── Paste warning ────────────────────────────────────────────────── */}
      <Snackbar
        open={pasteWarn}
        autoHideDuration={2500}
        onClose={() => setPasteWarn(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="warning" variant="filled" onClose={() => setPasteWarn(false)} sx={{ borderRadius: 3 }}>
          Pasting is disabled. Please type your own response.
        </Alert>
      </Snackbar>

      {/* ── General notice snackbar ──────────────────────────────────────── */}
      <Snackbar
        open={!!notice}
        autoHideDuration={3000}
        onClose={() => setNotice('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info" variant="filled" onClose={() => setNotice('')} sx={{ borderRadius: 3 }}>
          {notice}
        </Alert>
      </Snackbar>
    </Box>
  )
}
