import React, { useState } from 'react'
import { Box, Typography, TextField, LinearProgress, useTheme } from '@mui/material'
import GroupsIcon from '@mui/icons-material/Groups'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'

const LIGHT = {
  cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', divider: '#E0E0E0',
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#2E7D32' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1565C0' },
  teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#006064' },
  purple: { bg: '#E8EAF6', border: '#3949AB', shadow: '#283593' },
  red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#B71C1C' },
  yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F57F17' },
}
const DARK = {
  cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', divider: '#2A2A4A',
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
  purple: { bg: '#0D0D2B', border: '#7986CB', shadow: '#283593' },
  red:    { bg: '#2A0A0A', border: '#E57373', shadow: '#B71C1C' },
  yellow: { bg: '#2A2200', border: '#FFD54F', shadow: '#F57F17' },
}

const clay = (c, extra = {}) => ({
  bgcolor: c.bg,
  border: `2px solid ${c.border}`,
  borderRadius: '20px',
  boxShadow: `4px 4px 0 ${c.shadow}`,
  ...extra,
})

const QuizletLiveDebateGame = ({ debatePrompts = [], glossaryTerms = [], onComplete }) => {
  const muiTheme = useTheme()
  const D = muiTheme.palette.mode === 'dark' ? DARK : LIGHT

  const [currentPromptIndex, setCurrentPromptIndex] = useState(0)
  const [response, setResponse] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [evaluationResult, setEvaluationResult] = useState(null)
  const [responses, setResponses] = useState([])
  const [score, setScore] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)

  const currentPrompt = debatePrompts[currentPromptIndex]
  const progress = debatePrompts.length > 0 ? (currentPromptIndex / debatePrompts.length) * 100 : 0

  const handleSubmit = async () => {
    if (!response.trim()) return
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/phase4/evaluate-writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          question: currentPrompt.prompt, answer: response, level: 'C1', task: 'advanced_debate',
          criteria: { requiresNuance: true, glossaryTerms, minTermsRequired: 4 },
        }),
      })
      const result = await res.json()
      setEvaluationResult(result)
      const newScore = result.score === 1 ? score + 1 : score
      if (result.score === 1) setScore(newScore)
      const newResponses = [...responses, { prompt: currentPrompt.prompt, response, evaluation: result, isCorrect: result.score === 1 }]
      setResponses(newResponses)
      setTimeout(() => {
        if (currentPromptIndex + 1 < debatePrompts.length) {
          setCurrentPromptIndex(i => i + 1)
          setResponse('')
          setEvaluationResult(null)
        } else {
          setGameComplete(true)
          onComplete?.({ score: newScore, totalPrompts: debatePrompts.length, responses: newResponses, completed: true })
        }
      }, 2500)
    } catch {
      setEvaluationResult({ score: 0, feedback: 'Unable to evaluate.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (gameComplete) {
    return (
      <Box sx={{ ...clay(D.purple), p: { xs: 3, md: 5 }, textAlign: 'center' }}>
        <GroupsIcon sx={{ fontSize: 64, color: D.purple.border, mb: 2 }} />
        <Typography variant="h4" fontWeight={900} sx={{ color: D.heading, mb: 1 }}>Debate Complete!</Typography>
        <Typography fontWeight={700} sx={{ color: D.body }}>Score: {score} / {debatePrompts.length}</Typography>
      </Box>
    )
  }

  const feedbackC = evaluationResult ? (evaluationResult.score === 1 ? D.green : D.red) : null

  return (
    <Box sx={{ width: '100%' }}>

      {/* Header */}
      <Box sx={{ ...clay(D.purple), p: 2.5, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <GroupsIcon sx={{ color: D.purple.border }} />
            <Typography fontWeight={800} sx={{ color: D.heading }}>
              Prompt {currentPromptIndex + 1} / {debatePrompts.length}
            </Typography>
          </Box>
          <Box sx={{ px: 1.75, py: 0.4, borderRadius: '50px', bgcolor: D.yellow.border, color: '#fff', fontWeight: 800, fontSize: '0.85rem' }}>
            {score} pts
          </Box>
        </Box>
        <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: '6px', bgcolor: D.divider, '& .MuiLinearProgress-bar': { bgcolor: D.purple.border, borderRadius: '6px' } }} />
      </Box>

      {/* Prompt + answer */}
      <Box sx={{ ...clay(evaluationResult ? feedbackC : { bg: D.cardBg, border: D.divider, shadow: D.divider }), p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={800} sx={{ color: D.heading, mb: 2 }}>
          {currentPrompt?.prompt}
        </Typography>
        <TextField
          fullWidth multiline rows={5}
          value={response}
          onChange={e => setResponse(e.target.value)}
          placeholder="Provide a nuanced response using at least 4 advanced marketing terms…"
          disabled={isSubmitting || evaluationResult !== null}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px', bgcolor: D.cardBg,
              '& fieldset': { borderColor: D.divider, borderWidth: 2 },
              '&:hover fieldset': { borderColor: D.blue.border },
              '&.Mui-focused fieldset': { borderColor: D.blue.border },
            },
            '& .MuiInputBase-input': { color: D.body },
          }}
        />
        {evaluationResult && (
          <Box sx={{ ...clay(feedbackC), p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
              {evaluationResult.score === 1 ? <CheckCircleIcon sx={{ color: D.green.border }} /> : <CancelIcon sx={{ color: D.red.border }} />}
              <Typography fontWeight={800} sx={{ color: D.heading }}>
                {evaluationResult.score === 1 ? 'Excellent Response!' : 'Needs More Depth'}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: D.body }}>{evaluationResult.feedback}</Typography>
          </Box>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Box
            component="button"
            onClick={handleSubmit}
            disabled={!response.trim() || isSubmitting || evaluationResult !== null}
            sx={{
              ...clay(!response.trim() || isSubmitting || evaluationResult !== null
                ? { bg: D.divider, border: D.divider, shadow: D.divider } : D.blue),
              px: 3.5, py: 1.25, cursor: !response.trim() || isSubmitting || evaluationResult !== null ? 'not-allowed' : 'pointer',
              fontWeight: 800, fontSize: '0.95rem',
              color: !response.trim() || isSubmitting || evaluationResult !== null ? D.muted : D.blue.border,
              transition: 'all 0.15s',
              '&:hover': !response.trim() || isSubmitting || evaluationResult !== null ? {} : { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.blue.shadow}` },
            }}
          >
            {isSubmitting ? 'Evaluating…' : 'Submit Response'}
          </Box>
        </Box>
      </Box>

      {/* Glossary */}
      {glossaryTerms.length > 0 && (
        <Box sx={{ ...clay(D.teal), p: 2.5 }}>
          <Typography fontWeight={800} sx={{ color: D.teal.border, mb: 1.5, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: 1 }}>
            Use These Advanced Terms:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {glossaryTerms.map((term, i) => (
              <Box key={i} sx={{ px: 1.5, py: 0.4, borderRadius: '50px', bgcolor: D.cardBg, border: `2px solid ${D.teal.border}`, fontWeight: 700, fontSize: '0.8rem', color: D.teal.border }}>
                {term}
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default QuizletLiveDebateGame
