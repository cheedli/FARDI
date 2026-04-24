import React, { useState, useEffect } from 'react'
import { Box, Typography, TextField, Button, Stack, useTheme } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'

/**
 * Wordle-style Game Component
 * Students guess promotion vocabulary words letter by letter
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

const WordleGame = ({ sentences = [], onComplete }) => {
  const muiTheme = useTheme()
  const D = muiTheme.palette.mode === 'dark' ? DARK : LIGHT

  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentGuess, setCurrentGuess] = useState('')
  const [attempts, setAttempts] = useState([])
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [wordCompleted, setWordCompleted] = useState(false)

  const MAX_ATTEMPTS = 6
  const currentWord = sentences[currentWordIndex]?.answer || ''
  const currentSentence = sentences[currentWordIndex]?.sentence || ''

  // Reset state when moving to next word
  useEffect(() => {
    setCurrentGuess('')
    setAttempts([])
    setWordCompleted(false)
  }, [currentWordIndex])

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmitGuess()
    }
  }

  const handleSubmitGuess = () => {
    if (currentGuess.length !== currentWord.length) {
      return // Must match word length
    }

    const guess = currentGuess.toLowerCase()
    const newAttempts = [...attempts, guess]
    setAttempts(newAttempts)

    // Check if guess is correct
    if (guess === currentWord.toLowerCase()) {
      // Correct guess!
      setScore(prev => prev + 1)
      setWordCompleted(true)

      // Move to next word after a delay
      setTimeout(() => {
        if (currentWordIndex < sentences.length - 1) {
          setCurrentWordIndex(prev => prev + 1)
        } else {
          // Game complete
          setGameOver(true)
          if (onComplete) {
            onComplete({
              score: score + 1,
              totalWords: sentences.length,
              completed: true
            })
          }
        }
      }, 1500)
    } else if (newAttempts.length >= MAX_ATTEMPTS) {
      // Out of attempts for this word
      setWordCompleted(true)

      setTimeout(() => {
        if (currentWordIndex < sentences.length - 1) {
          setCurrentWordIndex(prev => prev + 1)
        } else {
          // Game complete
          setGameOver(true)
          if (onComplete) {
            onComplete({
              score: score,
              totalWords: sentences.length,
              completed: true
            })
          }
        }
      }, 2000)
    }

    setCurrentGuess('')
  }

  const handleSkip = () => {
    // Skip this word without earning a point
    setWordCompleted(true)

    setTimeout(() => {
      if (currentWordIndex < sentences.length - 1) {
        setCurrentWordIndex(prev => prev + 1)
      } else {
        // Game complete
        setGameOver(true)
        if (onComplete) {
          onComplete({
            score: score,
            totalWords: sentences.length,
            completed: true
          })
        }
      }
    }, 1500)
  }

  const getLetterClayColor = (letter, index, guess) => {
    const targetWord = currentWord.toLowerCase()
    const guessLower = guess.toLowerCase()

    if (guessLower[index] === targetWord[index]) {
      return D.green
    } else if (targetWord.includes(guessLower[index])) {
      return D.yellow
    } else {
      return { bg: D.cardBg, border: D.divider, shadow: D.muted }
    }
  }

  if (gameOver) {
    return (
      <Box sx={{ ...clay(D.green), p: 6, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: D.heading }}>
          🎉 Game Complete!
        </Typography>
        <Typography variant="h5" sx={{ mb: 2, color: D.body }}>
          You guessed {score} out of {sentences.length} words correctly!
        </Typography>
        <Typography variant="body1" sx={{ color: D.muted }}>
          {score === sentences.length ? 'Perfect score! Amazing work!' : 'Great effort!'}
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Progress */}
      <Box sx={{ ...clay(D.blue), p: 2, mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" sx={{ color: D.heading }}>
            Word {currentWordIndex + 1} of {sentences.length}
          </Typography>
          <Typography variant="h6" sx={{ color: D.heading }}>
            Score: {score}/{sentences.length}
          </Typography>
        </Stack>
      </Box>

      {/* Sentence with gap */}
      <Box sx={{ ...clay(D.teal), p: 4, mb: 4 }}>
        <Typography variant="h5" textAlign="center" fontWeight="medium" sx={{ color: D.heading }}>
          {currentSentence}
        </Typography>
        <Typography variant="body2" textAlign="center" sx={{ mt: 2, color: D.muted }}>
          Fill in the blank with a {currentWord.length}-letter word
        </Typography>
      </Box>

      {/* Previous attempts */}
      <Box sx={{ mb: 3 }}>
        {attempts.map((guess, attemptIndex) => (
          <Stack
            key={attemptIndex}
            direction="row"
            spacing={1}
            justifyContent="center"
            sx={{ mb: 2 }}
          >
            {guess.split('').map((letter, letterIndex) => {
              const c = getLetterClayColor(letter, letterIndex, guess)
              return (
                <Box
                  key={letterIndex}
                  sx={{
                    width: 50,
                    height: 50,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: c.bg,
                    border: `2px solid ${c.border}`,
                    borderRadius: '10px',
                    boxShadow: `3px 3px 0 ${c.shadow}`,
                  }}
                >
                  <Typography variant="h5" fontWeight="bold" color="#000000">
                    {letter.toUpperCase()}
                  </Typography>
                </Box>
              )
            })}
          </Stack>
        ))}

        {/* Empty rows for remaining attempts */}
        {!wordCompleted && Array.from({ length: MAX_ATTEMPTS - attempts.length }).map((_, i) => (
          <Stack
            key={`empty-${i}`}
            direction="row"
            spacing={1}
            justifyContent="center"
            sx={{ mb: 2 }}
          >
            {Array.from({ length: currentWord.length }).map((_, j) => (
              <Box
                key={j}
                sx={{
                  width: 50,
                  height: 50,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: D.cardBg,
                  border: `2px solid ${D.divider}`,
                  borderRadius: '10px',
                }}
              >
                <Typography variant="h5" sx={{ color: D.muted }}>
                  _
                </Typography>
              </Box>
            ))}
          </Stack>
        ))}
      </Box>

      {/* Word completed message */}
      {wordCompleted && (() => {
        const lastGuess = attempts[attempts.length - 1]
        const isCorrect = lastGuess?.toLowerCase() === currentWord.toLowerCase()
        const isSkipped = attempts.length === 0
        const feedbackColor = isCorrect ? D.green : isSkipped ? D.yellow : D.red
        return (
          <Box sx={{ ...clay(feedbackColor), p: 3, mb: 3, textAlign: 'center' }}>
            {isCorrect ? (
              <>
                <CheckCircleIcon sx={{ fontSize: 48, color: D.green.border, mb: 1 }} />
                <Typography variant="h5" sx={{ color: D.heading }}>
                  Correct! The word is "{currentWord}"
                </Typography>
              </>
            ) : isSkipped ? (
              <>
                <Typography variant="h5" sx={{ color: D.heading }}>
                  Skipped! The word was "{currentWord}"
                </Typography>
              </>
            ) : (
              <>
                <CancelIcon sx={{ fontSize: 48, color: D.red.border, mb: 1 }} />
                <Typography variant="h5" sx={{ color: D.heading }}>
                  The correct word was "{currentWord}"
                </Typography>
              </>
            )}
          </Box>
        )
      })()}

      {/* Input area */}
      {!wordCompleted && attempts.length < MAX_ATTEMPTS && (
        <Box sx={{ ...clay(D.purple), p: 3 }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={`Type your ${currentWord.length}-letter guess...`}
              value={currentGuess}
              onChange={(e) => setCurrentGuess(e.target.value.toLowerCase())}
              onKeyPress={handleKeyPress}
              inputProps={{
                maxLength: currentWord.length,
                style: { fontSize: 24, textAlign: 'center', textTransform: 'uppercase' }
              }}
              autoFocus
            />
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleSubmitGuess}
                disabled={currentGuess.length !== currentWord.length}
                sx={{
                  flex: 1,
                  borderRadius: '12px',
                  boxShadow: `4px 4px 0 ${D.blue.shadow}`,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.blue.shadow}` }
                }}
              >
                Submit Guess ({attempts.length + 1}/{MAX_ATTEMPTS})
              </Button>
              <Button
                variant="outlined"
                color="warning"
                size="large"
                onClick={handleSkip}
                sx={{
                  minWidth: 120,
                  borderRadius: '12px',
                  '&:hover': { transform: 'translate(-2px,-2px)' }
                }}
              >
                Skip Word
              </Button>
            </Stack>
          </Stack>
        </Box>
      )}

      {/* Instructions */}
      <Box sx={{ ...clay(D.yellow), p: 2, mt: 3 }}>
        <Typography variant="body2" textAlign="center" sx={{ color: D.yellow.border }}>
          🟢 Green = Correct letter in correct position | 🟡 Yellow = Correct letter in wrong position | ⚫ Gray = Letter not in word
        </Typography>
      </Box>
    </Box>
  )
}

export default WordleGame
