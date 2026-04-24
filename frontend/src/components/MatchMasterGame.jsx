import React, { useState, useEffect } from 'react'
import { Box, Typography, Grid, Stack, LinearProgress, useTheme } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import TimerIcon from '@mui/icons-material/Timer'

/**
 * Match Master Game Component
 * Timed matching game - click pairs to match terms with examples
 * Inspired by Quizlet Match
 */

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
  borderRadius: '16px',
  boxShadow: `4px 4px 0 ${c.shadow}`,
  ...extra,
})

const MatchMasterGame = ({ pairs = [], onComplete }) => {
  const muiTheme = useTheme()
  const D = muiTheme.palette.mode === 'dark' ? DARK : LIGHT
  const [shuffledTerms, setShuffledTerms] = useState([])
  const [shuffledExamples, setShuffledExamples] = useState([])
  const [selectedTerm, setSelectedTerm] = useState(null)
  const [selectedExample, setSelectedExample] = useState(null)
  const [matches, setMatches] = useState([])
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)

  // Shuffle array
  const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Initialize shuffled items
  useEffect(() => {
    if (pairs.length > 0) {
      setShuffledTerms(shuffleArray(pairs.map((p, i) => ({ ...p, id: i }))))
      setShuffledExamples(shuffleArray(pairs.map((p, i) => ({ ...p, id: i }))))
    }
  }, [pairs])

  // Timer
  useEffect(() => {
    if (gameStarted && !gameComplete) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1)
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [gameStarted, gameComplete])

  const handleTermClick = (term) => {
    if (isMatched(term.id)) return
    if (!gameStarted) setGameStarted(true)

    setSelectedTerm(term)

    // If example already selected, check match
    if (selectedExample) {
      checkMatch(term, selectedExample)
    }
  }

  const handleExampleClick = (example) => {
    if (isMatched(example.id)) return
    if (!gameStarted) setGameStarted(true)

    setSelectedExample(example)

    // If term already selected, check match
    if (selectedTerm) {
      checkMatch(selectedTerm, example)
    }
  }

  const checkMatch = (term, example) => {
    if (term.id === example.id) {
      // Correct match!
      setMatches([...matches, term.id])

      // Check if game complete
      if (matches.length + 1 === pairs.length) {
        setTimeout(() => {
          setGameComplete(true)
          if (onComplete) {
            onComplete({
              score: pairs.length,
              totalPairs: pairs.length,
              timeElapsed: timeElapsed,
              completed: true
            })
          }
        }, 500)
      }
    }

    // Clear selections
    setSelectedTerm(null)
    setSelectedExample(null)
  }

  const isMatched = (id) => {
    return matches.includes(id)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (gameComplete) {
    return (
      <Box sx={{ ...clay(D.green), p: 6, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: D.green.border }}>
          🎉 Match Master!
        </Typography>
        <Typography variant="h5" sx={{ mb: 2, color: D.body }}>
          You matched all {pairs.length} pairs correctly!
        </Typography>
        <Typography variant="h6" sx={{ color: D.body }}>
          Time: {formatTime(timeElapsed)}
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ ...clay(D.yellow), p: 2, mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" alignItems="center" spacing={1}>
            <TimerIcon sx={{ color: D.yellow.border }} />
            <Typography variant="h5" fontWeight="bold" sx={{ color: D.yellow.border }}>
              {formatTime(timeElapsed)}
            </Typography>
          </Stack>

          <Typography variant="h6" sx={{ color: D.body }}>
            Matched: {matches.length} / {pairs.length}
          </Typography>

          <LinearProgress
            variant="determinate"
            value={(matches.length / pairs.length) * 100}
            sx={{ width: 200, height: 10, borderRadius: 1 }}
          />
        </Stack>
      </Box>

      {/* Matching Grid */}
      <Grid container spacing={3}>
        {/* Left Column - Terms */}
        <Grid item xs={12} md={6}>
          <Box sx={{ ...clay(D.blue), p: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: D.heading }}>
              Terms
            </Typography>
            <Stack spacing={2}>
              {shuffledTerms.map((item) => (
                <Box
                  key={`term-${item.id}`}
                  onClick={() => handleTermClick(item)}
                  sx={{
                    ...(isMatched(item.id)
                      ? clay(D.green)
                      : selectedTerm?.id === item.id
                      ? clay(D.purple)
                      : clay(D.blue)),
                    px: 2,
                    py: 1.5,
                    cursor: isMatched(item.id) ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    '&:hover': {
                      transform: isMatched(item.id) ? 'none' : 'translate(-2px,-2px)',
                      boxShadow: isMatched(item.id) ? `4px 4px 0 ${D.green.shadow}` : `6px 6px 0 ${D.blue.shadow}`
                    }
                  }}
                >
                  {isMatched(item.id) && <CheckCircleIcon sx={{ color: D.green.border, fontSize: 20 }} />}
                  <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: D.body }}>
                    {item.term}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Grid>

        {/* Right Column - Examples */}
        <Grid item xs={12} md={6}>
          <Box sx={{ ...clay(D.teal), p: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: D.heading }}>
              Examples
            </Typography>
            <Stack spacing={2}>
              {shuffledExamples.map((item) => (
                <Box
                  key={`example-${item.id}`}
                  onClick={() => handleExampleClick(item)}
                  sx={{
                    ...(isMatched(item.id)
                      ? clay(D.green)
                      : selectedExample?.id === item.id
                      ? clay(D.purple)
                      : clay(D.teal)),
                    px: 2,
                    py: 1.5,
                    cursor: isMatched(item.id) ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    '&:hover': {
                      transform: isMatched(item.id) ? 'none' : 'translate(-2px,-2px)',
                      boxShadow: isMatched(item.id) ? `4px 4px 0 ${D.green.shadow}` : `6px 6px 0 ${D.teal.shadow}`
                    }
                  }}
                >
                  {isMatched(item.id) && <CheckCircleIcon sx={{ color: D.green.border, fontSize: 20 }} />}
                  <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: D.body }}>
                    {item.example}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default MatchMasterGame
