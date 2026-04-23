/**
 * Phase 2 Remedial Page - Gamified Exercise Interface (Clay Theme)
 * Supports all 20 task types from gamification-exercises.json
 */
import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import {
  Box, Typography, Stack, Button, Chip, LinearProgress,
  Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress, IconButton, Container, useTheme
} from '@mui/material'
import { motion } from 'framer-motion'
import GroupIcon from '@mui/icons-material/Group'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

// Import all gamified components
import PuzzleGame from '../components/PuzzleGame.jsx'
import WordSniper from '../components/WordSniper.jsx'
import BillboardDesigner from '../components/BillboardDesigner.jsx'
import PhraseExpander from '../components/PhraseExpander.jsx'
import GapFillStory from '../components/GapFillStory.jsx'
import EventPlannerBoard from '../components/EventPlannerBoard.jsx'
import {
  DebateArena,
  ConversationTetris,
  RhythmMatcher,
  SignalDecoder,
  ChatMessengerSim,
  PhoneCallSim,
  SocialPostMaker,
  SentenceGarden
} from '../components/exercises'

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
  orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
  red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#C62828' },
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
  orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
  red:    { bg: '#1F0000', border: '#EF9A9A', shadow: '#B71C1C' },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' } }),
}

// Task type to component mapping
const TASK_COMPONENT_MAP = {
  'drag_and_drop': 'PuzzleGame',
  'matching': 'PuzzleGame',
  'listening_drag_drop': 'RhythmMatcher',
  'gap_fill': 'WordSniper',
  'fill_gaps': 'WordSniper',
  'gap_fill_story': 'GapFillStory',
  'negotiation_gap_fill': 'DebateArena',
  'listening_negotiation': 'SocialPostMaker',
  'dialogue_completion': 'PhoneCallSim',
  'listening_dialogue_gap_fill': 'SignalDecoder',
  'listening_role_play': 'SocialPostMaker',
  'writing': 'SocialPostMaker',
  'listening_proposal_writing': 'SocialPostMaker',
  'listening_proposal': 'SocialPostMaker',
  'sentence_expansion': 'SentenceGarden',
  'reflection_gap_fill': 'SentenceGarden',
  'listening_expansion': 'SocialPostMaker',
  'listening_story_writing': 'ChatMessengerSim',
  'listening_research': 'SocialPostMaker',
  'listening_reflection': 'ChatMessengerSim',
  'listening_team_plan': 'SocialPostMaker',
  'listening_assignment': 'SocialPostMaker'
}

export default function Phase2Remedial() {
  const { stepId, level } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const D = isDark ? DARK : LIGHT

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [answers, setAnswers] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [pasteWarn, setPasteWarn] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [audioPlayed, setAudioPlayed] = useState(false)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [exerciseCompleted, setExerciseCompleted] = useState(false)
  const [exerciseResult, setExerciseResult] = useState(null)

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
    setExerciseCompleted(false)
    setExerciseResult(null)
    setAudioPlayed(false)

    try {
      const idx = searchParams.get('activity')
      const url = `/api/phase2/remedial?step_id=${encodeURIComponent(stepId)}&level=${encodeURIComponent(level)}${idx ? `&activity=${idx}` : ''}`
      const r = await fetch(url, { credentials: 'include' })

      if (r.status === 302 || (r.status === 200 && r.headers.get('content-type')?.includes('text/html'))) {
        navigate('/login')
        return
      }

      if (!r.ok) throw new Error(`Failed to load remedial data (${r.status})`)

      const d = await r.json()
      setData(d)

      const storageKey = `remedial_${stepId}_${level}_${d.activity.id}`
      const sessionAnswers = sessionStorage.getItem(storageKey)

      if (d.saved_responses && Object.keys(d.saved_responses).length > 0) {
        setAnswers(d.saved_responses)
        sessionStorage.setItem(storageKey, JSON.stringify(d.saved_responses))
      } else if (sessionAnswers) {
        try {
          setAnswers(JSON.parse(sessionAnswers))
        } catch (e) {
          setAnswers({})
        }
      } else {
        setAnswers({})
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [stepId, level, searchParams])

  useEffect(() => {
    if (data?.activity?.id && Object.keys(answers).length > 0) {
      const storageKey = `remedial_${stepId}_${level}_${data.activity.id}`
      sessionStorage.setItem(storageKey, JSON.stringify(answers))
    }
  }, [answers, data, stepId, level])

  const setAnswer = (key, value) => setAnswers(prev => ({ ...prev, [key]: value }))

  const playAudio = (text) => {
    if (!text) return
    setAudioPlaying(true)
    try {
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel()
        const u = new SpeechSynthesisUtterance(text)
        u.rate = 0.9
        u.pitch = 1
        u.lang = 'en-US'
        u.onend = () => { setAudioPlaying(false); setAudioPlayed(true) }
        u.onerror = () => { setAudioPlaying(false); setAudioPlayed(true) }
        speechSynthesis.speak(u)
      } else {
        setTimeout(() => { setAudioPlaying(false); setAudioPlayed(true) }, 3000)
      }
    } catch (err) {
      console.warn('Speech synthesis failed:', err)
      setAudioPlaying(false)
      setAudioPlayed(true)
    }
  }

  const computeScore = () => {
    if (!data?.activity) return 0
    const a = data.activity
    let score = 0
    if (a.correct_answers && Array.isArray(a.correct_answers)) {
      const totalAnswers = Object.keys(answers).filter(k => answers[k]).length
      score = Math.min(totalAnswers, a.correct_answers.length)
    }
    if (a.pairs && Array.isArray(a.pairs)) {
      a.pairs.forEach((pair) => { if (answers[pair.term] === pair.term) score++ })
    }
    if (score === 0) {
      Object.values(answers).forEach(v => { if (v && v.toString().trim()) score++ })
    }
    return score
  }

  const handleExerciseComplete = (result) => {
    setExerciseCompleted(true)
    setExerciseResult(result)
  }

  const handleProgress = (progress) => {
    if (progress.answers) {
      setAnswers(prev => ({ ...prev, ...progress.answers }))
    } else if (progress.answer !== undefined) {
      setAnswers({ response: progress.answer })
    }
  }

  const onSubmit = async () => {
    if (!data?.activity) return
    setSubmitting(true)

    try {
      const score = exerciseResult?.correctCount || computeScore()
      const r = await fetch('/api/phase2/submit-remedial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          step_id: data.step_id,
          level: data.level,
          activity_id: data.activity.id,
          responses: answers,
          score
        })
      })

      const res = await r.json()
      if (!r.ok) throw new Error(res.error || 'Submission failed')

      const storageKey = `remedial_${data.step_id}_${data.level}_${data.activity.id}`
      sessionStorage.removeItem(storageKey)

      window.lastRemedialResult = res

      if (res.overall_performance_low) {
        setFeedback({
          title: 'Overall Performance Needs Improvement',
          message: res.message,
          success: false,
          score: res.overall_score,
          threshold: res.overall_max_score,
          overall_percentage: res.overall_percentage,
          recommendation: res.recommendation,
          isOverallPerformance: true
        })
      } else {
        try {
          const fbRes = await fetch('/api/phase2/remedial/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              step_id: data.step_id,
              level: data.level,
              activity_id: data.activity.id,
              score
            })
          })
          const fb = await fbRes.json()
          setFeedback({
            title: res.activity_passed ? 'Great Job!' : 'Keep Practicing!',
            message: fb.feedback || res.message,
            success: res.activity_passed,
            score: score,
            threshold: data.activity?.success_threshold || 6
          })
        } catch (fbErr) {
          setFeedback({
            title: res.activity_passed ? 'Great Job!' : 'Keep Practicing!',
            message: res.message,
            success: res.activity_passed,
            score: score,
            threshold: data.activity?.success_threshold || 6
          })
        }
      }

      setShowFeedback(true)
    } catch (e) {
      console.error('Submission error:', e)
      setError(e.message)
      setFeedback({
        title: 'Submission Error',
        message: 'There was a problem submitting your response. Please try again.',
        success: false
      })
      setShowFeedback(true)
    } finally {
      setSubmitting(false)
    }
  }

  const handleFeedbackClose = (proceed = false) => {
    setShowFeedback(false)

    if (proceed && feedback) {
      const lastResult = window.lastRemedialResult
      if (lastResult) {
        if (lastResult.remedial_complete) {
          navigate(`/phase2/step/${data.step_id}`)
        } else if (lastResult.next_url) {
          try {
            const u = new URL(lastResult.next_url, window.location.origin)
            const segs = u.pathname.split('/').filter(Boolean)
            const step = segs[3]
            const lvl = segs[4]
            const idx = u.searchParams.get('activity')
            navigate(`/phase2/remedial/${step}/${lvl}${idx ? `?activity=${idx}` : ''}`)
          } catch {
            load()
          }
        } else {
          load()
        }
      }
    }

    setFeedback(null)
  }

  const renderExerciseComponent = () => {
    if (!data?.activity) return null

    const a = data.activity
    const taskType = a.task_type || a.type
    const componentName = TASK_COMPONENT_MAP[taskType]

    const isListening = taskType?.startsWith('listening_')
    const hasAudio = a.audio_script || a.audio_text || a.audio_content

    if (isListening && hasAudio && !audioPlayed) {
      return (
        <Box sx={{ ...card(D.purple), p: 4, textAlign: 'center' }}>
          <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, color: D.purple.border, mb: 1 }}>Listening Exercise</Typography>
          <Typography sx={{ color: D.body, mb: 3, fontSize: '0.95rem' }}>
            {a.instruction || 'Listen to the audio carefully before completing the exercise.'}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, height: 60, alignItems: 'center', mb: 3 }}>
            {[...Array(15)].map((_, i) => (
              <Box
                key={i}
                sx={{
                  width: 6,
                  bgcolor: audioPlaying ? D.purple.border : D.divider,
                  borderRadius: 1,
                  height: audioPlaying ? `${20 + Math.random() * 40}px` : 10,
                  transition: 'height 0.1s',
                  animation: audioPlaying ? `wave 0.5s ease-in-out infinite ${i * 0.05}s` : 'none',
                  '@keyframes wave': {
                    '0%, 100%': { height: '10px' },
                    '50%': { height: '50px' }
                  }
                }}
              />
            ))}
          </Box>

          <Box
            component="button"
            onClick={() => playAudio(a.audio_script || a.audio_text || a.audio_content)}
            disabled={audioPlaying}
            sx={{
              display: 'inline-flex', alignItems: 'center', gap: 1,
              px: 3, py: 1.5, borderRadius: '14px', cursor: 'pointer',
              bgcolor: D.purple.border, color: '#fff',
              fontWeight: 800, fontSize: '0.95rem', fontFamily: 'inherit',
              border: `2px solid ${D.purple.border}`,
              boxShadow: `4px 4px 0 ${D.purple.shadow}`,
              transition: 'transform 0.12s, box-shadow 0.12s',
              '&:hover:not(:disabled)': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.purple.shadow}` },
              '&:disabled': { opacity: 0.6, cursor: 'not-allowed' },
            }}
          >
            {audioPlaying ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : null}
            {audioPlaying ? 'Playing...' : 'Play Audio'}
          </Box>
        </Box>
      )
    }

    const exerciseData = {
      type: taskType,
      instruction: a.instruction || '',
      audio_script: a.audio_script || a.audio_text || a.audio_content,
      word_bank: a.word_bank || [],
      templates: a.templates || [],
      pairs: a.pairs || [],
      matching_items: a.matching_items || {},
      dialogue_lines: a.dialogue_lines || [],
      correct_answers: a.correct_answers || [],
      guided_questions: a.guided_questions || (a.correct_answers && a.correct_answers.length > 0 ? ['Write your response based on the examples provided.'] : []),
      example_of_answers: a.example_of_answers || a.correct_answers || [],
      ai_evaluation_prompt: a.ai_evaluation?.prompt || ''
    }

    switch (componentName) {
      case 'PuzzleGame': {
        const hasPairs = exerciseData.pairs && exerciseData.pairs.length > 0
        const hasMatchingItems = exerciseData.matching_items && Object.keys(exerciseData.matching_items).length > 0
        let puzzleItems = []
        let puzzleDescriptions = {}
        if (hasPairs) {
          puzzleItems = exerciseData.pairs.map(p => p.term)
          puzzleDescriptions = exerciseData.pairs.reduce((acc, p) => ({ ...acc, [p.term]: p.definition }), {})
        } else if (hasMatchingItems) {
          puzzleItems = Object.keys(exerciseData.matching_items)
          puzzleDescriptions = exerciseData.matching_items
        }
        return (
          <PuzzleGame
            items={puzzleItems}
            descriptions={puzzleDescriptions}
            answers={answers}
            onChange={(key, value) => setAnswer(key, value)}
            onComplete={() => handleExerciseComplete({ isPerfect: true, correctCount: puzzleItems.length })}
          />
        )
      }
      case 'RhythmMatcher':
        return <RhythmMatcher exercise={exerciseData} onComplete={handleExerciseComplete} onProgress={handleProgress} />
      case 'WordSniper': {
        const sentences = exerciseData.templates.map((template) => {
          const blankCount = (template.match(/_{3,}/g) || []).length
          return { text: template, blanks: Array(blankCount).fill('blank') }
        })
        return (
          <WordSniper
            sentences={sentences}
            answers={answers}
            onChange={(key, value) => setAnswer(key, value)}
            globalWordBank={exerciseData.word_bank}
            correctAnswers={exerciseData.correct_answers}
          />
        )
      }
      case 'GapFillStory':
        return <GapFillStory templates={exerciseData.templates} wordBank={exerciseData.word_bank} answers={answers} onChange={(key, value) => setAnswer(key, value)} />
      case 'DebateArena':
        return <DebateArena exercise={exerciseData} onComplete={(result) => { handleExerciseComplete(result); if (result.isVictory) onSubmit() }} onProgress={handleProgress} />
      case 'ConversationTetris':
        return <ConversationTetris exercise={exerciseData} onComplete={handleExerciseComplete} onProgress={handleProgress} />
      case 'PhoneCallSim':
        return <PhoneCallSim exercise={exerciseData} onComplete={handleExerciseComplete} onProgress={handleProgress} />
      case 'SignalDecoder':
        return <SignalDecoder exercise={exerciseData} onComplete={handleExerciseComplete} onProgress={handleProgress} />
      case 'SocialPostMaker':
        return <SocialPostMaker exercise={exerciseData} onComplete={(result) => { handleExerciseComplete(result); setTimeout(() => onSubmit(), 500) }} onProgress={handleProgress} />
      case 'BillboardDesigner':
        return <BillboardDesigner templates={exerciseData.templates} guidedQuestions={exerciseData.guided_questions} exampleAnswers={exerciseData.example_of_answers} answers={answers} onChange={(key, value) => setAnswer(key, value)} />
      case 'SentenceGarden':
        return <SentenceGarden exercise={exerciseData} onComplete={(result) => { handleExerciseComplete(result); setTimeout(() => onSubmit(), 500) }} onProgress={handleProgress} />
      case 'PhraseExpander':
        return <PhraseExpander templates={exerciseData.templates} guidedQuestions={exerciseData.guided_questions} exampleAnswers={exerciseData.example_of_answers} answers={answers} onChange={(key, value) => setAnswer(key, value)} />
      case 'ChatMessengerSim':
        return <ChatMessengerSim exercise={exerciseData} onComplete={handleExerciseComplete} onProgress={handleProgress} />
      case 'EventPlannerBoard':
        return <EventPlannerBoard exercise={exerciseData} templates={exerciseData.templates} guidedQuestions={exerciseData.guided_questions} dialogueLines={exerciseData.dialogue_lines} wordBank={exerciseData.word_bank} answers={answers} onChange={(key, value) => setAnswer(key, value)} />
      default:
        return (
          <Box sx={{ ...card(D.orange), p: 3 }}>
            <Typography sx={{ fontWeight: 800, color: D.orange.border, mb: 1 }}>
              Task Type: {taskType}
            </Typography>
            <Typography sx={{ color: D.body, mt: 1 }}>{a.instruction}</Typography>
            {exerciseData.word_bank.length > 0 && (
              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {exerciseData.word_bank.map((word, i) => (
                  <Box key={i} sx={{
                    px: 1.5, py: 0.4, borderRadius: '50px',
                    bgcolor: D.yellow.bg, border: `2px solid ${D.yellow.border}`,
                    boxShadow: `2px 2px 0 ${D.yellow.shadow}`,
                    fontSize: '0.8rem', fontWeight: 700, color: D.yellow.text || D.yellow.border,
                  }}>{word}</Box>
                ))}
              </Box>
            )}
          </Box>
        )
    }
  }

  const isSelfSubmitting = () => {
    if (!data?.activity) return false
    const componentName = TASK_COMPONENT_MAP[data.activity.task_type || data.activity.type]
    return ['DebateArena', 'RhythmMatcher', 'SignalDecoder', 'ChatMessengerSim', 'SocialPostMaker', 'SentenceGarden', 'PhoneCallSim'].includes(componentName)
  }

  // ── Loading ────────────────────────────────────────────────────────────────
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

  if (error && !data) return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: D.pageBg }}>
      <Box sx={{ ...card(D.red), px: 3, py: 2 }}>
        <Typography sx={{ color: D.red.border, fontWeight: 700 }}>Error: {error}</Typography>
      </Box>
    </Box>
  )

  if (!data) return null

  const a = data.activity

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: D.pageBg }}>
      <Container maxWidth="md" sx={{ pt: { xs: 3, md: 4 }, pb: 6 }}>

        {/* ── Header ──────────────────────────────────────────────────────────── */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Box sx={{ ...card(D.blue), px: { xs: 2.5, sm: 3.5 }, py: { xs: 2.5, sm: 3 }, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <GroupIcon sx={{ color: D.blue.border, fontSize: 22 }} />
                <Typography sx={{ color: D.blue.border, fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 1.2 }}>
                  Practice · {level} Level
                </Typography>
              </Box>
              <Box sx={{
                display: 'inline-flex', alignItems: 'center',
                px: 1.5, py: 0.4, borderRadius: '50px',
                bgcolor: D.yellow.bg, border: `2px solid ${D.yellow.border}`,
                boxShadow: `2px 2px 0 ${D.yellow.shadow}`,
                fontSize: '0.7rem', fontWeight: 800, color: D.yellow.text || D.yellow.border,
              }}>
                {data.current_index + 1} / {data.total}
              </Box>
            </Box>

            {/* Navigation */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <IconButton
                disabled={data.current_index <= 0}
                onClick={() => navigate(`/phase2/remedial/${data.step_id}/${data.level}?activity=${Math.max(0, data.current_index - 1)}`)}
                sx={{
                  width: 40, height: 40, borderRadius: '12px',
                  bgcolor: data.current_index <= 0 ? `${D.divider}40` : D.cardBg,
                  border: `2px solid ${data.current_index <= 0 ? D.divider : D.blue.border}`,
                  boxShadow: data.current_index <= 0 ? 'none' : `2px 2px 0 ${D.blue.shadow}`,
                  color: data.current_index <= 0 ? D.muted : D.blue.border,
                  '&:hover:not(:disabled)': { transform: 'translate(-1px,-1px)', boxShadow: `3px 3px 0 ${D.blue.shadow}` },
                  transition: 'all 0.12s ease',
                }}
              >
                <ArrowBackIcon sx={{ fontSize: 20 }} />
              </IconButton>

              <Box sx={{
                px: 2, py: 0.5, borderRadius: '50px',
                bgcolor: D.purple.bg, border: `2px solid ${D.purple.border}`,
                boxShadow: `2px 2px 0 ${D.purple.shadow}`,
              }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: D.purple.border, textTransform: 'uppercase' }}>
                  {((a.task_type || a.type)?.replace(/_/g, ' ') || 'exercise')}
                </Typography>
              </Box>

              <IconButton
                disabled={data.current_index >= (data.total - 1)}
                onClick={() => navigate(`/phase2/remedial/${data.step_id}/${data.level}?activity=${Math.min(data.total - 1, data.current_index + 1)}`)}
                sx={{
                  width: 40, height: 40, borderRadius: '12px',
                  bgcolor: data.current_index >= (data.total - 1) ? `${D.divider}40` : D.cardBg,
                  border: `2px solid ${data.current_index >= (data.total - 1) ? D.divider : D.blue.border}`,
                  boxShadow: data.current_index >= (data.total - 1) ? 'none' : `2px 2px 0 ${D.blue.shadow}`,
                  color: data.current_index >= (data.total - 1) ? D.muted : D.blue.border,
                  '&:hover:not(:disabled)': { transform: 'translate(-1px,-1px)', boxShadow: `3px 3px 0 ${D.blue.shadow}` },
                  transition: 'all 0.12s ease',
                }}
              >
                <ArrowForwardIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Stack>
          </Box>
        </motion.div>

        {/* ── Instruction ─────────────────────────────────────────────────────── */}
        {(!(a.task_type || a.type)?.startsWith('listening_') || audioPlayed) && a.instruction && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
            <Box sx={{ ...card(D.teal), px: 3, py: 2, mb: 3 }}>
              <Typography sx={{ color: D.teal.border, fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.6, textAlign: 'center' }}>
                {a.instruction}
              </Typography>
            </Box>
          </motion.div>
        )}

        {/* ── Exercise Component ──────────────────────────────────────────────── */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          <Box sx={{ mb: 3 }}>
            {renderExerciseComponent()}
          </Box>
        </motion.div>

        {/* ── Submit Button ───────────────────────────────────────────────────── */}
        {!isSelfSubmitting() && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box
                component="button"
                onClick={onSubmit}
                disabled={submitting || Object.keys(answers).length === 0}
                sx={{
                  display: 'inline-flex', alignItems: 'center', gap: 1,
                  px: 4, py: 1.5, borderRadius: '14px', cursor: 'pointer',
                  bgcolor: D.green.border, color: '#fff',
                  fontWeight: 800, fontSize: '1rem', fontFamily: 'inherit',
                  border: `2px solid ${D.green.border}`,
                  boxShadow: `4px 4px 0 ${D.green.shadow}`,
                  transition: 'transform 0.12s, box-shadow 0.12s',
                  '&:hover:not(:disabled)': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.green.shadow}` },
                  '&:disabled': { opacity: 0.5, cursor: 'not-allowed' },
                }}
              >
                {submitting && <CircularProgress size={20} sx={{ color: '#fff' }} />}
                {submitting ? 'Submitting...' : 'Submit & Continue'}
              </Box>
            </Box>
          </motion.div>
        )}

      </Container>

      {/* ── Feedback Dialog ─────────────────────────────────────────────────── */}
      <Dialog
        open={showFeedback}
        onClose={() => handleFeedbackClose(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            border: `2px solid ${feedback?.success ? D.green.border : D.orange.border}`,
            boxShadow: `6px 6px 0 ${feedback?.success ? D.green.shadow : D.orange.shadow}`,
            bgcolor: D.cardBg,
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1, fontWeight: 800, color: D.heading, fontSize: '1.25rem' }}>
          {feedback?.title}
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 3 }}>
          <Typography sx={{ color: D.body, lineHeight: 1.7 }}>
            {feedback?.message}
          </Typography>
          {feedback?.isOverallPerformance ? (
            <Stack direction="column" spacing={2} sx={{ mt: 3 }}>
              <Box sx={{
                ...card(D.orange), px: 2, py: 1.5, mx: 'auto',
              }}>
                <Typography sx={{ fontWeight: 800, color: D.orange.border, fontSize: '1rem' }}>
                  Overall Score: {feedback.score}/{feedback.threshold} ({feedback.overall_percentage}%)
                </Typography>
              </Box>
              {feedback.recommendation && (
                <Typography sx={{ color: D.muted, fontSize: '0.9rem', fontStyle: 'italic', mt: 2 }}>
                  {feedback.recommendation}
                </Typography>
              )}
            </Stack>
          ) : feedback?.score !== undefined && (
            <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 2 }}>
              <Box sx={{
                ...card(feedback.success ? D.green : D.orange), px: 2, py: 0.75,
              }}>
                <Typography sx={{ fontWeight: 800, color: feedback.success ? D.green.border : D.orange.border, fontSize: '0.85rem' }}>
                  Score: {feedback.score}/{feedback.threshold}
                </Typography>
              </Box>
              {feedback.success && (
                <Box sx={{ ...card(D.green), px: 2, py: 0.75 }}>
                  <Typography sx={{ fontWeight: 800, color: D.green.border, fontSize: '0.85rem' }}>Passed</Typography>
                </Box>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Box
            component="button"
            onClick={() => handleFeedbackClose(true)}
            sx={{
              display: 'inline-flex', alignItems: 'center', gap: 1,
              px: 3, py: 1.25, borderRadius: '14px', cursor: 'pointer',
              bgcolor: D.blue.border, color: '#fff',
              fontWeight: 800, fontSize: '0.95rem', fontFamily: 'inherit',
              border: `2px solid ${D.blue.border}`,
              boxShadow: `4px 4px 0 ${D.blue.shadow}`,
              transition: 'transform 0.12s, box-shadow 0.12s',
              '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.blue.shadow}` },
            }}
          >
            Continue
          </Box>
        </DialogActions>
      </Dialog>

      {/* Paste Warning */}
      <Snackbar
        open={pasteWarn}
        autoHideDuration={2500}
        onClose={() => setPasteWarn(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="warning" variant="filled" onClose={() => setPasteWarn(false)}>
          Pasting is disabled. Please use your own words.
        </Alert>
      </Snackbar>
    </Box>
  )
}
