import React, { useEffect, useState } from 'react'
import { useApiContext } from '../lib/api.jsx'
import { useNavigate } from 'react-router-dom'
import {
  Box, Typography, Button, Stack, LinearProgress, Avatar, Chip, IconButton, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material'
import { motion } from 'framer-motion'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import ReplayIcon from '@mui/icons-material/Replay'
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver'
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates'
import InfoIcon from '@mui/icons-material/Info'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import QuizIcon from '@mui/icons-material/Quiz'
import TimerIcon from '@mui/icons-material/Timer'
import SecurityIcon from '@mui/icons-material/Security'
import HelpIcon from '@mui/icons-material/Help'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import ExerciseRenderer from '../components/ExerciseRenderer.jsx'
import Phase2Introduction from '../components/Phase2Introduction.jsx'

export default function Game() {
  const { client } = useApiContext()
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
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const submit = async (e) => {
    if (e) e.preventDefault()
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
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'white' }}>
      <Box sx={{ width: 200 }}>
        <LinearProgress sx={{ borderRadius: 4, height: 4, bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #6366f1, #0ea5e9)' } }} />
      </Box>
    </Box>
  )
  if (error) return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'white' }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography sx={{ color: '#ef4444', fontWeight: 600, mb: 1 }}>Something went wrong</Typography>
        <Typography sx={{ color: '#94a3b8', fontSize: '0.88rem' }}>{error}</Typography>
      </Box>
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

  const { current_step, total_steps, xp, question } = state
  const progress = Math.round((current_step / total_steps) * 100)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'white', py: { xs: 2, md: 4 }, px: { xs: 2, md: 3 } }}>
      <Box sx={{ maxWidth: 860, mx: 'auto' }}>

        {/* ── Header bar ── */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
              <Box>
                <Typography sx={{ fontWeight: 750, fontSize: { xs: '1.2rem', md: '1.4rem' }, color: '#0f172a', lineHeight: 1.2 }}>
                  Business English Assessment
                </Typography>
                <Typography sx={{ color: '#94a3b8', fontSize: '0.85rem', mt: 0.3 }}>
                  Question {current_step + 1} of {total_steps}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip size="small" label={`${xp} XP`} sx={{
                  height: 26, fontSize: '0.75rem', fontWeight: 700,
                  bgcolor: '#6366f108', color: '#6366f1', border: '1px solid #6366f120',
                }} />
                <Chip size="small" icon={<TimerIcon sx={{ fontSize: 14 }} />} label={`~${Math.max(1, Math.round((total_steps - current_step) * 2))}m`} sx={{
                  height: 26, fontSize: '0.75rem', fontWeight: 600,
                  bgcolor: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0',
                  '& .MuiChip-icon': { color: '#94a3b8' },
                }} />
                <IconButton size="small" onClick={() => setShowInstructions(true)} sx={{ width: 30, height: 30, color: '#94a3b8', '&:hover': { bgcolor: '#f8fafc' } }}>
                  <HelpIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Stack>
            </Stack>

            {/* Progress bar */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ flex: 1, height: 6, borderRadius: 3, bgcolor: '#f1f5f9', overflow: 'hidden' }}>
                <motion.div
                  style={{ height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, #6366f1, #0ea5e9)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </Box>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', minWidth: 35, textAlign: 'right' }}>
                {progress}%
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* ── Scene banner ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
          <Box sx={{
            borderRadius: 3,
            overflow: 'hidden',
            mb: 2.5,
            position: 'relative',
            height: { xs: 100, md: 120 },
            backgroundImage: `url(/static/images/scenes/${question.scene}.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}>
            <Box sx={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(15,23,42,0.7) 0%, rgba(15,23,42,0.2) 100%)',
            }} />
            <Box sx={{ position: 'absolute', bottom: 0, left: 0, p: 2.5 }}>
              <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1rem', textTransform: 'capitalize', textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
                {String(question.scene || '').replaceAll('_', ' ')}
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem', mt: 0.2 }}>
                {state.scene_description}
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* ── Speaker + Skill info ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4 }}>
          <Box sx={{
            borderRadius: 3, border: '1px solid #f1f5f9', p: 2.5, mb: 2.5,
            display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2.5,
          }}>
            {/* Speaker */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 220 }}>
              <Avatar
                src={state.speaker_avatar ? `/static/images/avatars/${state.speaker_avatar}` : undefined}
                sx={{
                  width: 44, height: 44,
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  fontSize: '1rem', fontWeight: 700,
                }}
              >
                {(question.speaker || ' ')[0]}
              </Avatar>
              <Box>
                <Typography sx={{ fontWeight: 650, fontSize: '0.9rem', color: '#0f172a' }}>
                  {question.speaker}
                </Typography>
                <Typography sx={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  {state.speaker_role}
                </Typography>
              </Box>
            </Stack>

            {/* Divider */}
            <Box sx={{ width: { xs: '100%', md: '1px' }, height: { xs: '1px', md: 'auto' }, bgcolor: '#f1f5f9' }} />

            {/* Skill */}
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.5 }}>
                <RecordVoiceOverIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                <Typography sx={{ fontSize: '0.68rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Assessing
                </Typography>
              </Stack>
              <Typography sx={{ fontWeight: 650, fontSize: '0.9rem', color: '#0f172a', textTransform: 'capitalize' }}>
                {String(question.skill || '').replaceAll('_', ' ')}
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#64748b', mt: 0.3 }}>
                {state.skill_description}
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* ── Question / Dialogue ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }}>
          <Box sx={{ borderRadius: 3, border: '1px solid #f1f5f9', p: 3, mb: 2.5 }}>
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.06em', mb: 1 }}>
              {question.speaker} says:
            </Typography>
            <Typography sx={{ fontSize: '1.05rem', lineHeight: 1.7, color: '#334155', fontWeight: 450 }}>
              {question.question}
            </Typography>

            {question.instruction && (
              <Box sx={{
                mt: 2, p: 2, borderRadius: 2.5,
                bgcolor: '#eff6ff', border: '1px solid #dbeafe',
                display: 'flex', gap: 1.5, alignItems: 'flex-start',
              }}>
                <InfoIcon sx={{ fontSize: 18, color: '#3b82f6', mt: 0.2, flexShrink: 0 }} />
                <Typography sx={{ fontSize: '0.88rem', color: '#1e40af' }}>
                  {question.instruction}
                </Typography>
              </Box>
            )}

            {state.audio_url && (
              <Box sx={{
                mt: 2, p: 2, borderRadius: 2.5,
                bgcolor: '#f8fafc', border: '1px solid #f1f5f9',
              }}>
                <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
                  <audio src={state.audio_url} ref={(r) => setAudioRef(r)} />
                  <Button
                    size="small" startIcon={<PlayArrowIcon sx={{ fontSize: 16 }} />}
                    onClick={() => audioRef && audioRef.play()}
                    sx={{
                      borderRadius: 2.5, px: 2.5, py: 0.6, fontWeight: 600,
                      textTransform: 'none', fontSize: '0.82rem',
                      background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                      color: 'white', boxShadow: '0 2px 8px rgba(99,102,241,0.25)',
                      '&:hover': { background: 'linear-gradient(135deg, #5856eb, #4338ca)' },
                    }}
                  >
                    Play Audio
                  </Button>
                  <Button
                    size="small" startIcon={<ReplayIcon sx={{ fontSize: 16 }} />}
                    onClick={() => { if (audioRef) { audioRef.currentTime = 0; audioRef.play() } }}
                    sx={{
                      borderRadius: 2.5, px: 2.5, py: 0.6, fontWeight: 600,
                      textTransform: 'none', fontSize: '0.82rem',
                      color: '#475569', bgcolor: '#f8fafc', border: '1px solid #e2e8f0',
                      boxShadow: 'none',
                      '&:hover': { bgcolor: '#f1f5f9', boxShadow: 'none' },
                    }}
                  >
                    Replay
                  </Button>
                </Stack>
              </Box>
            )}
          </Box>
        </motion.div>

        {/* ── Exercise Renderer ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.4 }}>
          <ExerciseRenderer
            question={{
              ...question,
              audio_url: state.audio_url,
              hint: state.hint
            }}
            onSubmit={handleExerciseSubmit}
            loading={submitting}
          />
        </motion.div>

        {/* Submit Error Display */}
        {submitError && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{
              mt: 2, p: 2, borderRadius: 2.5,
              bgcolor: '#eff6ff', border: '1px solid #dbeafe',
              display: 'flex', alignItems: 'center', gap: 1.5,
            }}>
              <InfoIcon sx={{ fontSize: 18, color: '#3b82f6', flexShrink: 0 }} />
              <Typography sx={{ fontSize: '0.88rem', color: '#1e40af', flex: 1 }}>
                {submitError}
              </Typography>
              <IconButton size="small" onClick={() => setSubmitError('')} sx={{ color: '#94a3b8' }}>
                <Box component="span" sx={{ fontSize: '1.1rem', lineHeight: 1 }}>&times;</Box>
              </IconButton>
            </Box>
          </motion.div>
        )}

        {/* ── AI Feedback Section ── */}
        {!submitting && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }}>
            <Box sx={{ borderRadius: 3, border: '1px solid #f1f5f9', p: 2.5, mt: 2.5 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                <Button
                  size="small"
                  startIcon={<TipsAndUpdatesIcon sx={{ fontSize: 16 }} />}
                  onClick={getFeedback}
                  disabled={!response}
                  sx={{
                    borderRadius: 2.5, px: 2.5, py: 0.7, fontWeight: 600,
                    textTransform: 'none', fontSize: '0.82rem',
                    color: '#f59e0b', bgcolor: '#fef3c710', border: '1px solid #fde68a40',
                    boxShadow: 'none',
                    '&:hover': { bgcolor: '#fef3c730', boxShadow: 'none' },
                    '&.Mui-disabled': { opacity: 0.4 },
                  }}
                >
                  Get AI Feedback
                </Button>
                <Chip size="small" label={`${xp} XP earned`} sx={{
                  height: 24, fontSize: '0.72rem', fontWeight: 600,
                  bgcolor: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0',
                }} />
              </Stack>

              {feedback && (
                <Box sx={{ mt: 2.5, p: 2.5, borderRadius: 2.5, bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                    <AutoAwesomeIcon sx={{ fontSize: 16, color: '#6366f1' }} />
                    <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                      AI Feedback
                    </Typography>
                  </Stack>

                  {feedback.error && (
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#fef2f2', border: '1px solid #fecaca', mb: 1.5 }}>
                      <Typography sx={{ fontSize: '0.85rem', color: '#991b1b' }}>{feedback.error}</Typography>
                    </Box>
                  )}
                  {feedback.feedback && (
                    <Typography sx={{ fontSize: '0.9rem', lineHeight: 1.7, color: '#475569', mb: 1.5 }}>
                      {feedback.feedback}
                    </Typography>
                  )}
                  {feedback.assessment && (
                    <Box>
                      <Chip size="small" label={`CEFR ${feedback.assessment.level}`} sx={{
                        height: 26, fontWeight: 700, fontSize: '0.75rem', mb: 1.5,
                        bgcolor: '#6366f108', color: '#6366f1', border: '1px solid #6366f120',
                      }} />
                      {Array.isArray(feedback.assessment.strengths) && feedback.assessment.strengths.length > 0 && (
                        <Box sx={{ mb: 1 }}>
                          <Typography sx={{ fontSize: '0.78rem', fontWeight: 650, color: '#16a34a', mb: 0.3 }}>
                            Strengths
                          </Typography>
                          <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>
                            {feedback.assessment.strengths.slice(0, 3).join(', ')}
                          </Typography>
                        </Box>
                      )}
                      {Array.isArray(feedback.assessment.improvements) && feedback.assessment.improvements.length > 0 && (
                        <Box>
                          <Typography sx={{ fontSize: '0.78rem', fontWeight: 650, color: '#f59e0b', mb: 0.3 }}>
                            Areas for improvement
                          </Typography>
                          <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>
                            {feedback.assessment.improvements.slice(0, 3).join(', ')}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </motion.div>
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

      {/* ── Instructions Dialog ── */}
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
            {/* What to expect */}
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

            {/* How to succeed */}
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

            {/* AI detection */}
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
