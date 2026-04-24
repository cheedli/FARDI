import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container, LinearProgress } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import TimerIcon from '@mui/icons-material/Timer'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  blue:   { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  red:    { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  red:    { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
}

/**
 * Phase 4 Step 3 - Remedial B2 - Task C: Kahoot Match
 * Matching game - 8 terms to definitions
 * Score: 8 pts
 */

const TERMS = [
  { id: 1, term: 'promotional', definition: 'To promote/sell' },
  { id: 2, term: 'persuasive', definition: 'Convince with appeals' },
  { id: 3, term: 'targeted', definition: 'Specific audience' },
  { id: 4, term: 'original', definition: 'New/unique' },
  { id: 5, term: 'creative', definition: 'Imaginative/memorable' },
  { id: 6, term: 'consistent', definition: 'Same style' },
  { id: 7, term: 'personalized', definition: 'Customized' },
  { id: 8, term: 'ethical', definition: 'Honest/fair' }
]

const TIME_LIMIT = 120

export default function RemedialB2TaskC() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase4/step3/remedial/b2/taskD') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 3, context: 'remedial_b2' })
  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [matches, setMatches] = useState({})
  const [selectedTerm, setSelectedTerm] = useState(null)
  const [selectedDefinition, setSelectedDefinition] = useState(null)
  const [shuffledTerms, setShuffledTerms] = useState([])
  const [shuffledDefinitions, setShuffledDefinitions] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [lineRenderKey, setLineRenderKey] = useState(0)

  const cardSx = (color) => ({
    bgcolor: P[color].bg,
    border: `2px solid ${P[color].border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${P[color].shadow}`,
    p: 3,
  })

  useEffect(() => {
    if (gameStarted && shuffledTerms.length === 0) {
      setShuffledTerms([...TERMS].sort(() => Math.random() - 0.5))
      setShuffledDefinitions([...TERMS].sort(() => Math.random() - 0.5))
    }
  }, [gameStarted])

  useEffect(() => {
    if (!gameStarted || gameFinished || submitted) return
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else { handleSubmit() }
  }, [timeLeft, gameStarted, gameFinished, submitted])

  const handleTermClick = (termId) => {
    if (submitted) return
    if (matches[termId]) { const { [termId]: _, ...rest } = matches; setMatches(rest); return }
    setSelectedTerm(termId)
    if (selectedDefinition) {
      setMatches({ ...matches, [termId]: selectedDefinition })
      setSelectedTerm(null); setSelectedDefinition(null)
      setTimeout(() => setLineRenderKey(prev => prev + 1), 50)
    }
  }

  const handleDefinitionClick = (defId) => {
    if (submitted) return
    const matchedTermId = Object.keys(matches).find(key => matches[key] === defId)
    if (matchedTermId) { const { [matchedTermId]: _, ...rest } = matches; setMatches(rest); return }
    setSelectedDefinition(defId)
    if (selectedTerm) {
      setMatches({ ...matches, [selectedTerm]: defId })
      setSelectedTerm(null); setSelectedDefinition(null)
      setTimeout(() => setLineRenderKey(prev => prev + 1), 50)
    }
  }

  const handleSubmit = () => {
    let correctMatches = 0
    Object.keys(matches).forEach(termId => { if (matches[termId] === parseInt(termId)) correctMatches++ })
    setScore(correctMatches); setSubmitted(true); setGameFinished(true)
    sessionStorage.setItem('remedial_step3_b2_taskC_score', correctMatches)
    logTaskCompletion(correctMatches)
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ level: 'B2', task: 'C', step: 2, score: finalScore, max_score: 8, completed: true }) })
    } catch (error) { console.error('Failed to log task completion:', error) }
  }

  const allMatched = Object.keys(matches).length === 8
  const formatTime = (seconds) => { const m = Math.floor(seconds / 60); const s = seconds % 60; return `${m}:${s.toString().padStart(2, '0')}` }
  const getTermById = (id) => TERMS.find(t => t.id === id)

  if (!gameStarted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx('orange'), mb: 3 }}>
              <Typography variant="h4" gutterBottom fontWeight="bold">Phase 4 - Step 3: Remedial Activities</Typography>
              <Typography variant="h5" gutterBottom>Level B2 - Task C: Kahoot Match 🎯</Typography>
              <Typography variant="body1">Timed matching game - Link terms to definitions!</Typography>
            </Box>
            <Box sx={{ ...cardSx('blue'), mb: 3 }}>
              <CharacterMessage character="MS. MABROUKI" message="Welcome to Kahoot Match! 🎯 Match 8 advertising terms to their correct definitions in 2 minutes. Click a term, then click its matching definition. All correct matches = 8 points! Ready? Let's play! 🚀" />
            </Box>
            <Box sx={{ ...cardSx('purple'), textAlign: 'center', p: 5 }}>
              <SwapHorizIcon sx={{ fontSize: 80, mb: 2, color: P.purple.border }} />
              <Typography variant="h4" gutterBottom fontWeight="bold">Kahoot Match Challenge</Typography>
              <Typography variant="h6" sx={{ mb: 4 }}>8 Terms • 8 Definitions • 2 Minutes • Match Them All!</Typography>
              <Box component="button" onClick={() => setGameStarted(true)}
                sx={{
                  ...cardSx('green'), cursor: 'pointer', px: 8, py: 2,
                  fontSize: '1.4rem', fontWeight: 'bold', color: P.green.border, transition: 'all 0.2s',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }
                }}
              >
                START MATCHING! 🎮
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    )
  }

  if (gameFinished) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx('orange'), mb: 3 }}>
              <Typography variant="h4" gutterBottom fontWeight="bold">Phase 4 - Step 3: Remedial Activities</Typography>
              <Typography variant="h5">Level B2 - Task C: Kahoot Match - Results 🏆</Typography>
            </Box>
            <Box sx={{ ...cardSx(score === 8 ? 'green' : 'orange'), mb: 3, textAlign: 'center', p: 5 }}>
              <EmojiEventsIcon sx={{ fontSize: 80, mb: 2, color: score === 8 ? P.green.border : P.orange.border }} />
              <Typography variant="h3" gutterBottom fontWeight="bold">{score === 8 ? 'Perfect Match! 🎉' : 'Game Complete! 🎊'}</Typography>
              <Box sx={{ ...cardSx('yellow'), maxWidth: 300, mx: 'auto', my: 3 }}>
                <Typography variant="h2" fontWeight="bold" sx={{ color: P.orange.border }}>{score} / 8</Typography>
                <Typography variant="h6" color="text.secondary">Correct Matches</Typography>
              </Box>
              {score === 8 && <Box sx={{ ...cardSx('green'), mt: 2 }}><Typography variant="body1" fontWeight={500}>Amazing! You matched all terms perfectly! You're a vocabulary master! 🌟</Typography></Box>}
            </Box>

            {/* Match Review */}
            <Box sx={{ ...cardSx('blue'), mb: 3 }}>
              <Typography variant="h5" gutterBottom fontWeight="bold">Match Review</Typography>
              <Stack spacing={2} sx={{ mt: 2 }}>
                {TERMS.map((term) => {
                  const userMatchId = matches[term.id]
                  const userMatch = getTermById(userMatchId)
                  const isCorrect = userMatchId === term.id
                  return (
                    <Box key={term.id} sx={{
                      bgcolor: isCorrect ? P.green.bg : P.red.bg,
                      border: `2px solid ${isCorrect ? P.green.border : P.red.border}`,
                      borderRadius: '16px', p: 3,
                      boxShadow: `3px 3px 0 ${isCorrect ? P.green.shadow : P.red.shadow}`,
                    }}>
                      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>{term.term}</Typography>
                          <Typography variant="body1">Correct: <strong>{term.definition}</strong></Typography>
                          {!isCorrect && userMatch && <Typography variant="body1" sx={{ color: P.red.border, mt: 1 }}>Your match: {userMatch.definition}</Typography>}
                        </Box>
                        {isCorrect ? <CheckCircleIcon sx={{ color: P.green.border, fontSize: 36 }} /> : <CancelIcon sx={{ color: P.red.border, fontSize: 36 }} />}
                      </Stack>
                    </Box>
                  )
                })}
              </Stack>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Box component="button" onClick={() => navigate('/phase4/step3/remedial/b2/taskD')}
                sx={{
                  ...cardSx('green'), cursor: 'pointer', px: 6, py: 2,
                  fontSize: '1.2rem', fontWeight: 'bold', color: P.green.border, transition: 'all 0.2s',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }
                }}
              >
                Continue to Task D →
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    )
  }

  // Game in progress
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>

          {/* Header with timer */}
          <Box sx={{ ...cardSx('orange'), mb: 2, p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h5" fontWeight="bold">Kahoot Match 🎯</Typography>
              <Stack direction="row" spacing={3} alignItems="center">
                <Stack direction="row" spacing={1} alignItems="center">
                  <SwapHorizIcon sx={{ color: P.orange.border }} />
                  <Typography variant="h6">Matched: {Object.keys(matches).length} / 8</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TimerIcon sx={{ color: timeLeft <= 30 ? P.red.border : P.orange.border }} />
                  <Typography variant="h6" sx={{ color: timeLeft <= 30 ? P.red.border : 'inherit', fontWeight: timeLeft <= 30 ? 'bold' : 'normal' }}>
                    {formatTime(timeLeft)}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
            <LinearProgress variant="determinate" value={(Object.keys(matches).length / 8) * 100}
              sx={{ mt: 2, height: 8, borderRadius: 4, bgcolor: 'rgba(0,0,0,0.1)', '& .MuiLinearProgress-bar': { bgcolor: P.orange.border, borderRadius: 4 } }} />
          </Box>

          <Box sx={{ ...cardSx('teal'), mb: 3, p: 2 }}>
            <Typography variant="body1" fontWeight={500}>💡 How to play: Click a term on the left, then click its matching definition on the right. Click a matched pair to unmatch it.</Typography>
          </Box>

          {/* Matching Grid */}
          <Box sx={{ position: 'relative', mb: 3 }}>
            <Stack direction="row" spacing={3}>
              {/* Terms */}
              <Box sx={{ ...cardSx('orange'), flex: 1, p: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>Terms</Typography>
                <Stack spacing={2}>
                  {shuffledTerms.map(term => {
                    const isMatched = !!matches[term.id]
                    const isSelected = selectedTerm === term.id
                    return (
                      <Box key={term.id} id={`term-${term.id}`} component="button" onClick={() => handleTermClick(term.id)}
                        sx={{
                          bgcolor: isSelected ? P.blue.border : isMatched ? P.purple.bg : P.yellow.bg,
                          color: isSelected ? 'white' : isMatched ? P.purple.border : P.orange.shadow,
                          border: `2px solid ${isSelected ? P.blue.border : isMatched ? P.purple.border : P.orange.border}`,
                          borderRadius: '16px', p: 2, cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem',
                          boxShadow: isSelected ? `4px 4px 0 ${P.blue.shadow}` : `3px 3px 0 ${P.orange.shadow}`,
                          transition: 'all 0.2s', textAlign: 'left',
                          '&:hover': { transform: 'translate(-2px,-2px)' }
                        }}
                      >
                        {term.term}
                        {isMatched && <Box component="span" sx={{ ml: 1, fontSize: '0.75rem', opacity: 0.8 }}>✓ matched</Box>}
                      </Box>
                    )
                  })}
                </Stack>
              </Box>

              {/* Definitions */}
              <Box sx={{ ...cardSx('blue'), flex: 1, p: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>Definitions</Typography>
                <Stack spacing={2}>
                  {shuffledDefinitions.map(def => {
                    const isMatched = Object.values(matches).includes(def.id)
                    const isSelected = selectedDefinition === def.id
                    return (
                      <Box key={def.id} id={`def-${def.id}`} component="button" onClick={() => handleDefinitionClick(def.id)}
                        sx={{
                          bgcolor: isSelected ? P.blue.border : isMatched ? P.purple.bg : P.blue.bg,
                          color: isSelected ? 'white' : isMatched ? P.purple.border : P.blue.shadow,
                          border: `2px solid ${isSelected ? P.blue.border : isMatched ? P.purple.border : P.blue.border}`,
                          borderRadius: '16px', p: 2, cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem',
                          boxShadow: isSelected ? `4px 4px 0 ${P.blue.shadow}` : `3px 3px 0 ${P.blue.shadow}`,
                          transition: 'all 0.2s', textAlign: 'left',
                          '&:hover': { transform: 'translate(-2px,-2px)' }
                        }}
                      >
                        {def.definition}
                        {isMatched && <Box component="span" sx={{ ml: 1, fontSize: '0.75rem', opacity: 0.8 }}>✓ matched</Box>}
                      </Box>
                    )
                  })}
                </Stack>
              </Box>
            </Stack>

            {/* SVG connection lines */}
            <svg key={lineRenderKey} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
              {Object.keys(matches).map((termId) => {
                const defId = matches[termId]
                const termEl = document.getElementById(`term-${termId}`)
                const defEl = document.getElementById(`def-${defId}`)
                if (termEl && defEl) {
                  const termRect = termEl.getBoundingClientRect()
                  const defRect = defEl.getBoundingClientRect()
                  const containerRect = termEl.closest('.MuiBox-root')?.getBoundingClientRect()
                  if (containerRect) {
                    const x1 = termRect.right - containerRect.left
                    const y1 = termRect.top + termRect.height / 2 - containerRect.top
                    const x2 = defRect.left - containerRect.left
                    const y2 = defRect.top + defRect.height / 2 - containerRect.top
                    return <line key={`line-${termId}-${defId}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={DARK.purple.border} strokeWidth="3" strokeDasharray="6,4" />
                  }
                }
                return null
              })}
            </svg>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Box component="button" onClick={handleSubmit} disabled={!allMatched}
              sx={{
                ...cardSx(allMatched ? 'green' : 'blue'), cursor: !allMatched ? 'not-allowed' : 'pointer',
                opacity: !allMatched ? 0.5 : 1, px: 6, py: 2,
                fontSize: '1.2rem', fontWeight: 'bold', color: allMatched ? P.green.border : P.blue.border, transition: 'all 0.2s',
                '&:hover': allMatched ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` } : {}
              }}
            >
              {allMatched ? 'Submit Matches! 🎯' : `Match All Terms First (${Object.keys(matches).length}/8)`}
            </Box>
          </Box>

          {timeLeft <= 30 && (
            <Box sx={{ ...cardSx('red'), mt: 3, textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: P.red.border }}>⏰ Hurry! Only {timeLeft} seconds left!</Typography>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
