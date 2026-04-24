import React, { useState, useEffect } from 'react'
import { Box, Typography, Button, Stack, LinearProgress, useTheme } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import TimerIcon from '@mui/icons-material/Timer'

/**
 * Sushi Spell Advanced Game Component
 * Spell advanced marketing terms by selecting letters, then match them to scenarios
 * Inspired by British Council's Sushi Spell game
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

const SushiSpellAdvancedGame = ({
  terms = [],
  onComplete
}) => {
  const muiTheme = useTheme()
  const D = muiTheme.palette.mode === 'dark' ? DARK : LIGHT
  const [currentTermIndex, setCurrentTermIndex] = useState(0)
  const [selectedLetters, setSelectedLetters] = useState([])
  const [availableLetters, setAvailableLetters] = useState([])
  const [spelledTerms, setSpelledTerms] = useState([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [wordTimeLeft, setWordTimeLeft] = useState(30) // 30 seconds per word
  const [gameStarted, setGameStarted] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const [score, setScore] = useState(0)

  const currentTerm = terms[currentTermIndex]

  // Global Timer
  useEffect(() => {
    if (gameStarted && !gameComplete) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [gameStarted, gameComplete])

  // Per-word 30-second countdown timer
  useEffect(() => {
    if (gameStarted && !gameComplete && !showFeedback) {
      setWordTimeLeft(30) // Reset to 30 seconds for new word

      const wordTimer = setInterval(() => {
        setWordTimeLeft(prev => {
          if (prev <= 1) {
            // Time's up! Move to next word
            clearInterval(wordTimer)
            moveToNextWord()
            return 30
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(wordTimer)
    }
  }, [currentTermIndex, gameStarted, gameComplete, showFeedback])

  const moveToNextWord = () => {
    if (currentTermIndex + 1 < terms.length) {
      setCurrentTermIndex(currentTermIndex + 1)
      setShowFeedback(false)
      setSelectedLetters([])
    } else {
      // Game complete
      setGameComplete(true)
      if (onComplete) {
        onComplete({
          score: score,
          totalTerms: terms.length,
          timeElapsed: timeElapsed,
          spelledTerms: spelledTerms,
          completed: true
        })
      }
    }
  }

  // Generate scrambled letters when term changes
  useEffect(() => {
    if (currentTerm) {
      const letters = currentTerm.term.toUpperCase().split('')

      // Add some extra random letters to make it challenging
      const extraLetters = ['A', 'E', 'I', 'O', 'R', 'S', 'T', 'N']
      const numExtras = Math.min(3, Math.floor(letters.length / 2))

      for (let i = 0; i < numExtras; i++) {
        const randomLetter = extraLetters[Math.floor(Math.random() * extraLetters.length)]
        letters.push(randomLetter)
      }

      // Shuffle letters
      const shuffled = shuffleArray(letters)
      setAvailableLetters(shuffled)
      setSelectedLetters([])
      setGameStarted(true)
    }
  }, [currentTerm])

  const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const handleLetterClick = (letter, index) => {
    // Add letter to selected
    setSelectedLetters([...selectedLetters, { letter, originalIndex: index }])

    // Remove from available
    const newAvailable = [...availableLetters]
    newAvailable.splice(index, 1)
    setAvailableLetters(newAvailable)
  }

  const handleRemoveLetter = (index) => {
    const letterToRemove = selectedLetters[index]

    // Remove from selected
    const newSelected = [...selectedLetters]
    newSelected.splice(index, 1)
    setSelectedLetters(newSelected)

    // Add back to available
    setAvailableLetters([...availableLetters, letterToRemove.letter])
  }

  const handleSubmit = () => {
    const spelledWord = selectedLetters.map(item => item.letter).join('').toLowerCase()
    const correctWord = currentTerm.term.toLowerCase()

    if (spelledWord === correctWord) {
      // Correct!
      setIsCorrect(true)
      setShowFeedback(true)
      setScore(score + 1)

      // Add to spelled terms
      const newSpelledTerms = [...spelledTerms, {
        term: currentTerm.term,
        scenario: currentTerm.scenario,
        isCorrect: true
      }]
      setSpelledTerms(newSpelledTerms)

      // Move to next term
      setTimeout(() => {
        if (currentTermIndex + 1 < terms.length) {
          setCurrentTermIndex(currentTermIndex + 1)
          setShowFeedback(false)
        } else {
          // Game complete
          setGameComplete(true)
          if (onComplete) {
            onComplete({
              score: score + 1,
              totalTerms: terms.length,
              timeElapsed: timeElapsed,
              spelledTerms: newSpelledTerms,
              completed: true
            })
          }
        }
      }, 1500)
    } else {
      // Incorrect
      setIsCorrect(false)
      setShowFeedback(true)

      setTimeout(() => {
        setShowFeedback(false)
        // Reset letters
        const letters = currentTerm.term.toUpperCase().split('')
        const extraLetters = ['A', 'E', 'I', 'O', 'R', 'S', 'T', 'N']
        const numExtras = Math.min(3, Math.floor(letters.length / 2))
        for (let i = 0; i < numExtras; i++) {
          const randomLetter = extraLetters[Math.floor(Math.random() * extraLetters.length)]
          letters.push(randomLetter)
        }
        setAvailableLetters(shuffleArray(letters))
        setSelectedLetters([])
      }, 1500)
    }
  }

  const handleClear = () => {
    // Move all selected letters back to available
    const letters = currentTerm.term.toUpperCase().split('')
    const extraLetters = ['A', 'E', 'I', 'O', 'R', 'S', 'T', 'N']
    const numExtras = Math.min(3, Math.floor(letters.length / 2))
    for (let i = 0; i < numExtras; i++) {
      const randomLetter = extraLetters[Math.floor(Math.random() * extraLetters.length)]
      letters.push(randomLetter)
    }
    setAvailableLetters(shuffleArray(letters))
    setSelectedLetters([])
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (gameComplete) {
    return (
      <Box sx={{ ...clay(D.purple), p: 6, textAlign: 'center' }}>
        <Typography variant="h2" gutterBottom fontWeight="bold" sx={{ fontSize: '4rem' }}>
          🍣
        </Typography>
        <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: D.purple.border }}>
          Sushi Spell Master!
        </Typography>
        <Typography variant="h5" sx={{ mb: 3, color: D.body }}>
          You've spelled all {terms.length} advanced marketing terms!
        </Typography>
        <Typography variant="h6" sx={{ color: D.body }}>
          Score: {score} / {terms.length}
        </Typography>
        <Typography variant="h6" sx={{ color: D.body }}>
          Time: {formatTime(timeElapsed)}
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
      {/* Header with Timer and Progress */}
      <Box sx={{ ...clay(D.green), p: 3, mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems="center">
          <Stack direction="row" alignItems="center" spacing={2}>
            <TimerIcon sx={{ color: D.green.border, fontSize: 30 }} />
            <Typography variant="h5" fontWeight="bold" sx={{ color: D.green.border }}>
              {formatTime(timeElapsed)}
            </Typography>
          </Stack>

          <Typography variant="h6" sx={{ color: D.heading }}>
            Term {currentTermIndex + 1} / {terms.length}
          </Typography>

          {/* 30-second countdown per word */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: D.body, mb: 0.5 }}>
              Time Left
            </Typography>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                color: wordTimeLeft <= 10 ? D.red.border : D.yellow.border,
                animation: wordTimeLeft <= 5 ? 'pulse 1s infinite' : 'none',
                '@keyframes pulse': {
                  '0%, 100%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.1)' }
                }
              }}
            >
              0:{wordTimeLeft.toString().padStart(2, '0')}
            </Typography>
          </Box>

          <Box sx={{ minWidth: 200 }}>
            <Typography variant="body2" sx={{ color: D.body, mb: 0.5 }}>
              Score: {score} / {currentTermIndex}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(currentTermIndex / terms.length) * 100}
              sx={{
                height: 10,
                borderRadius: 1,
                bgcolor: D.divider,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: D.green.border
                }
              }}
            />
          </Box>
        </Stack>
      </Box>

      {/* Scenario Display */}
      <Box sx={{ ...clay(D.orange), p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ color: D.heading }} gutterBottom>
          Match this scenario:
        </Typography>
        <Typography variant="h5" sx={{ color: D.orange.border, fontWeight: 'bold' }}>
          {currentTerm?.scenario}
        </Typography>
      </Box>

      {/* Sushi Belt - Spelled Word Area */}
      <Box
        sx={{
          ...(showFeedback
            ? clay(isCorrect ? D.green : D.red)
            : { bgcolor: D.cardBg, border: `4px solid ${D.divider}`, borderRadius: '16px', boxShadow: `4px 4px 0 ${D.blue.shadow}` }),
          p: 4,
          mb: 3,
          minHeight: 120,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          transition: 'all 0.3s ease'
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold" sx={{ color: D.heading }} gutterBottom align="center">
          Spell the term:
        </Typography>

        <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
          {selectedLetters.length === 0 ? (
            <Typography variant="h4" sx={{ color: D.muted, fontStyle: 'italic' }}>
              Select letters below...
            </Typography>
          ) : (
            selectedLetters.map((item, index) => (
              <Box
                key={index}
                component="span"
                onClick={() => !showFeedback && handleRemoveLetter(index)}
                sx={{
                  ...clay(D.blue),
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 50,
                  height: 50,
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: D.blue.border,
                  cursor: showFeedback ? 'default' : 'pointer',
                  '&:hover': {
                    transform: showFeedback ? 'none' : 'translate(-2px,-2px)',
                    boxShadow: showFeedback ? `4px 4px 0 ${D.blue.shadow}` : `6px 6px 0 ${D.blue.shadow}`
                  }
                }}
              >
                {item.letter}
              </Box>
            ))
          )}
        </Stack>

        {showFeedback && (
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
            {isCorrect ? (
              <>
                <CheckCircleIcon sx={{ color: D.green.border, fontSize: 30 }} />
                <Typography variant="h6" fontWeight="bold" sx={{ color: D.green.border }}>
                  Correct! "{currentTerm.term}"
                </Typography>
              </>
            ) : (
              <>
                <CancelIcon sx={{ color: D.red.border, fontSize: 30 }} />
                <Typography variant="h6" fontWeight="bold" sx={{ color: D.red.border }}>
                  Try again!
                </Typography>
              </>
            )}
          </Stack>
        )}
      </Box>

      {/* Available Letters - Sushi Conveyor Belt */}
      <Box sx={{ ...clay(D.teal), p: 3, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ color: D.heading, mb: 2 }} align="center">
          🍣 Sushi Letter Belt 🍣
        </Typography>
        <Stack direction="row" spacing={1.5} justifyContent="center" flexWrap="wrap" useFlexGap>
          {availableLetters.map((letter, index) => (
            <Box
              key={index}
              component="span"
              onClick={() => !showFeedback && handleLetterClick(letter, index)}
              sx={{
                ...clay(D.green),
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 50,
                height: 50,
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: D.green.border,
                cursor: showFeedback ? 'default' : 'grab',
                '&:hover': {
                  transform: showFeedback ? 'none' : 'translate(-2px,-2px)',
                  boxShadow: showFeedback ? `4px 4px 0 ${D.green.shadow}` : `6px 6px 0 ${D.green.shadow}`,
                  transition: 'all 0.2s ease'
                }
              }}
            >
              {letter}
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Action Buttons */}
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button
          variant="outlined"
          color="error"
          onClick={handleClear}
          disabled={selectedLetters.length === 0 || showFeedback}
          size="large"
          sx={{ px: 4 }}
        >
          Clear
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleSubmit}
          disabled={selectedLetters.length === 0 || showFeedback}
          size="large"
          sx={{ px: 6, fontSize: '1.1rem' }}
        >
          Submit
        </Button>
      </Stack>

      {/* Spelled Terms Progress */}
      {spelledTerms.length > 0 && (
        <Box sx={{ ...clay(D.blue), p: 2, mt: 3 }}>
          <Typography variant="subtitle2" sx={{ color: D.heading }} gutterBottom>
            Completed Terms:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {spelledTerms.map((item, index) => (
              <Box
                key={index}
                component="span"
                sx={{
                  px: 1.5,
                  py: 0.4,
                  borderRadius: '50px',
                  bgcolor: D.green.bg,
                  border: `2px solid ${D.green.border}`,
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  color: D.green.border,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 14 }} />
                {item.term}
              </Box>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  )
}

export default SushiSpellAdvancedGame
