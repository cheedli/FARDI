import React, { useState } from 'react'
import { Box, Typography, TextField, LinearProgress, useTheme } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'

const LIGHT = {
  pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', divider: '#E0E0E0',
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#2E7D32' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1565C0' },
  teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#006064' },
  orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#E65100' },
  purple: { bg: '#E8EAF6', border: '#3949AB', shadow: '#283593' },
  red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#B71C1C' },
  yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F57F17' },
}
const DARK = {
  pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', divider: '#2A2A4A',
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
  orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
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

const getBadgeName = (level) => {
  if (level >= 8) return 'Master Critic'
  if (level >= 6) return 'Expert Analyst'
  if (level >= 4) return 'Skilled Reviewer'
  if (level >= 2) return 'Novice Critic'
  return 'Beginner'
}

const CritiqueChallengeGame = ({ questions = [], glossaryTerms = [], onComplete }) => {
  const muiTheme = useTheme()
  const D = muiTheme.palette.mode === 'dark' ? DARK : LIGHT

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [evaluationResult, setEvaluationResult] = useState(null)
  const [gameComplete, setGameComplete] = useState(false)
  const [badgeLevel, setBadgeLevel] = useState(0)

  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length
  const progress = totalQuestions > 0 ? (currentQuestionIndex / totalQuestions) * 100 : 0

  const handleSubmit = async () => {
    if (!currentAnswer.trim()) return
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/phase4/evaluate-writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          question: currentQuestion.question,
          answer: currentAnswer,
          level: 'C1', task: 'critique',
          criteria: { requiresComparison: true, requiresNuance: true, glossaryTerms, minTermsRequired: 2 },
        }),
      })
      const result = await res.json()
      const newAnswers = {
        ...answers,
        [currentQuestionIndex]: { question: currentQuestion.question, answer: currentAnswer, evaluation: result, isCorrect: result.score === 1 },
      }
      setAnswers(newAnswers)
      const newBadge = result.score === 1 ? Math.min(badgeLevel + 1, totalQuestions) : badgeLevel
      if (result.score === 1) setBadgeLevel(newBadge)
      setEvaluationResult(result)
      setTimeout(() => {
        if (currentQuestionIndex + 1 < totalQuestions) {
          setCurrentQuestionIndex(i => i + 1)
          setCurrentAnswer('')
          setEvaluationResult(null)
        } else {
          setGameComplete(true)
          onComplete?.({
            answers: newAnswers,
            score: Object.values(newAnswers).filter(a => a.isCorrect).length,
            totalQuestions,
            badgeLevel: newBadge,
            completed: true,
          })
        }
      }, 2000)
    } catch {
      setEvaluationResult({ score: 0, feedback: 'Unable to evaluate. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (gameComplete) {
    const correct = Object.values(answers).filter(a => a.isCorrect).length
    return (
      <Box sx={{ ...clay(D.purple), p: { xs: 3, md: 5 }, textAlign: 'center' }}>
        <EmojiEventsIcon sx={{ fontSize: 72, color: D.yellow.border, mb: 2 }} />
        <Typography variant="h4" fontWeight={900} sx={{ color: D.heading, mb: 1 }}>
          Challenge Complete!
        </Typography>
        <Typography fontWeight={700} sx={{ color: D.body, mb: 1 }}>
          Score: {correct} / {totalQuestions}
        </Typography>
        <Box sx={{ display: 'inline-block', px: 2.5, py: 0.75, borderRadius: '50px', bgcolor: D.yellow.border, color: '#fff', fontWeight: 800, fontSize: '1rem', mt: 1 }}>
          {getBadgeName(badgeLevel)}
        </Box>
      </Box>
    )
  }

  const feedbackColor = evaluationResult ? (evaluationResult.score === 1 ? D.green : D.red) : null

  return (
    <Box sx={{ width: '100%' }}>

      {/* Header */}
      <Box sx={{ ...clay(D.purple), p: 2.5, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Typography fontWeight={800} sx={{ color: D.heading }}>
            Question {currentQuestionIndex + 1} / {totalQuestions}
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: D.muted, display: 'block' }}>Badge Level</Typography>
            <Typography variant="h5" fontWeight={900} sx={{ color: D.yellow.border, lineHeight: 1 }}>
              {badgeLevel}
            </Typography>
          </Box>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8, borderRadius: '6px',
            bgcolor: D.divider,
            '& .MuiLinearProgress-bar': { bgcolor: D.purple.border, borderRadius: '6px' },
          }}
        />
      </Box>

      {/* Question + answer */}
      <Box sx={{ ...clay(evaluationResult ? feedbackColor : { bg: D.cardBg, border: D.divider, shadow: D.divider }), p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={800} sx={{ color: D.heading, mb: 2 }}>
          {currentQuestion?.question}
        </Typography>

        <TextField
          fullWidth multiline rows={6}
          value={currentAnswer}
          onChange={e => setCurrentAnswer(e.target.value)}
          placeholder="Write your critique using advanced marketing terminology…"
          disabled={isSubmitting || evaluationResult !== null}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              bgcolor: D.cardBg,
              '& fieldset': { borderColor: D.divider, borderWidth: 2 },
              '&:hover fieldset': { borderColor: D.blue.border },
              '&.Mui-focused fieldset': { borderColor: D.blue.border },
            },
            '& .MuiInputBase-input': { color: D.body },
          }}
        />

        {evaluationResult && (
          <Box sx={{ ...clay(feedbackColor), p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
              {evaluationResult.score === 1
                ? <CheckCircleIcon sx={{ color: D.green.border }} />
                : <CancelIcon sx={{ color: D.red.border }} />}
              <Typography fontWeight={800} sx={{ color: D.heading }}>
                {evaluationResult.score === 1 ? 'Excellent!' : 'Needs Improvement'}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: D.body }}>{evaluationResult.feedback}</Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Box
            component="button"
            onClick={handleSubmit}
            disabled={!currentAnswer.trim() || isSubmitting || evaluationResult !== null}
            sx={{
              ...clay(!currentAnswer.trim() || isSubmitting || evaluationResult !== null
                ? { bg: D.divider, border: D.divider, shadow: D.divider }
                : D.blue),
              px: 3.5, py: 1.25, cursor: !currentAnswer.trim() || isSubmitting || evaluationResult !== null ? 'not-allowed' : 'pointer',
              fontWeight: 800, fontSize: '0.95rem',
              color: !currentAnswer.trim() || isSubmitting || evaluationResult !== null ? D.muted : D.blue.border,
              transition: 'all 0.15s',
              '&:hover': !currentAnswer.trim() || isSubmitting || evaluationResult !== null ? {} : { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.blue.shadow}` },
            }}
          >
            {isSubmitting ? 'Evaluating…' : 'Submit Critique'}
          </Box>
        </Box>
      </Box>

      {/* Glossary terms */}
      {glossaryTerms.length > 0 && (
        <Box sx={{ ...clay(D.teal), p: 2.5 }}>
          <Typography fontWeight={800} sx={{ color: D.teal.border, mb: 1.5, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: 1 }}>
            Advanced Terms to Use:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {glossaryTerms.map((term, i) => (
              <Box key={i} sx={{
                px: 1.5, py: 0.4, borderRadius: '50px',
                bgcolor: D.cardBg, border: `2px solid ${D.teal.border}`,
                fontWeight: 700, fontSize: '0.8rem', color: D.teal.border,
              }}>
                {term}
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default CritiqueChallengeGame
