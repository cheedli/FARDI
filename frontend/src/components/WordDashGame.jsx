import React, { useState, useEffect, useRef } from 'react'
import { Box, Typography, Button, Stack, LinearProgress, useTheme } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import StarIcon from '@mui/icons-material/Star'

/**
 * Word Dash Game Component
 * Words "dash" across the screen, player clicks the correct one to fill gaps
 * A1 Level - Simple gap-fill with moving words
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

const WordDashGame = ({ sentences = [], onComplete }) => {
  const muiTheme = useTheme()
  const D = muiTheme.palette.mode === 'dark' ? DARK : LIGHT

  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameOver, setGameOver] = useState(false)
  const [movingWords, setMovingWords] = useState([])
  const [correctAnswer, setCorrectAnswer] = useState(false)
  const [wrongAnswer, setWrongAnswer] = useState(false)
  const [nextWordId, setNextWordId] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)

  const gameAreaRef = useRef(null)
  const wordSpawnIntervalRef = useRef(null)
  const wordUpdateIntervalRef = useRef(null)

  // Word bank for distractors
  const WORD_BANK = ['poster', 'video', 'slogan', 'billboard', 'commercial', 'eye-catcher', 'feature', 'ad']

  // Get current sentence
  const currentSentence = sentences[currentSentenceIndex]

  // Start spawning words
  useEffect(() => {
    if (gameStarted && !gameOver && currentSentence) {
      // Spawn words at random intervals (1-3 seconds)
      wordSpawnIntervalRef.current = setInterval(() => {
        spawnWord()
      }, Math.random() * 2000 + 1000) // 1-3 seconds

      return () => {
        if (wordSpawnIntervalRef.current) {
          clearInterval(wordSpawnIntervalRef.current)
        }
      }
    }
  }, [gameStarted, gameOver, currentSentenceIndex])

  // Update word positions
  useEffect(() => {
    if (gameStarted && !gameOver) {
      wordUpdateIntervalRef.current = setInterval(() => {
        setMovingWords(prev => {
          const updated = prev.map(word => ({
            ...word,
            position: word.position - 2 // Move 2px left every frame
          }))

          // Check for words that went off screen
          const offScreenWords = updated.filter(word => word.position < -150)
          if (offScreenWords.length > 0) {
            // Check if correct answer went off screen
            const correctWentOffScreen = offScreenWords.some(word => word.text === currentSentence?.answer)
            if (correctWentOffScreen) {
              handleMissedWord()
            }
          }

          // Remove words that are off screen
          return updated.filter(word => word.position > -150)
        })
      }, 30) // Update every 30ms for smooth animation

      return () => {
        if (wordUpdateIntervalRef.current) {
          clearInterval(wordUpdateIntervalRef.current)
        }
      }
    }
  }, [gameStarted, gameOver, currentSentenceIndex])

  const spawnWord = () => {
    if (!currentSentence) return

    const gameWidth = gameAreaRef.current?.offsetWidth || 800

    // Randomly decide: spawn correct answer or distractor
    const spawnCorrect = Math.random() > 0.6 // 40% chance for correct answer

    let wordText
    if (spawnCorrect) {
      wordText = currentSentence.answer
    } else {
      // Pick a random distractor (not the correct answer)
      const distractors = WORD_BANK.filter(w => w !== currentSentence.answer)
      wordText = distractors[Math.floor(Math.random() * distractors.length)]
    }

    // Random vertical position (top 20% to bottom 80% of game area)
    const randomTop = Math.random() * 60 + 10 // 10-70%

    const newWord = {
      id: nextWordId,
      text: wordText,
      position: gameWidth, // Start from right edge
      top: randomTop,
      isCorrect: wordText === currentSentence.answer
    }

    setMovingWords(prev => [...prev, newWord])
    setNextWordId(prev => prev + 1)
  }

  const handleWordClick = (word) => {
    if (word.isCorrect) {
      // Correct answer!
      setScore(prev => prev + 1)
      setCorrectAnswer(true)
      setMovingWords([]) // Clear all moving words

      // Show feedback briefly, then move to next sentence
      setTimeout(() => {
        setCorrectAnswer(false)
        if (currentSentenceIndex + 1 < sentences.length) {
          setCurrentSentenceIndex(prev => prev + 1)
        } else {
          // Game complete!
          endGame(true)
        }
      }, 1000)
    } else {
      // Wrong answer!
      handleWrongAnswer()
      // Remove the clicked word
      setMovingWords(prev => prev.filter(w => w.id !== word.id))
    }
  }

  const handleWrongAnswer = () => {
    setWrongAnswer(true)
    setLives(prev => {
      const newLives = prev - 1
      if (newLives <= 0) {
        endGame(false)
      }
      return newLives
    })

    setTimeout(() => {
      setWrongAnswer(false)
    }, 500)
  }

  const handleMissedWord = () => {
    setLives(prev => {
      const newLives = prev - 1
      if (newLives <= 0) {
        endGame(false)
      }
      return newLives
    })
  }

  const endGame = (completed) => {
    setGameOver(true)
    if (wordSpawnIntervalRef.current) clearInterval(wordSpawnIntervalRef.current)
    if (wordUpdateIntervalRef.current) clearInterval(wordUpdateIntervalRef.current)

    if (onComplete) {
      onComplete({
        score,
        totalSentences: sentences.length,
        completed
      })
    }
  }

  const handleRestart = () => {
    setCurrentSentenceIndex(0)
    setScore(0)
    setLives(3)
    setGameOver(false)
    setMovingWords([])
    setCorrectAnswer(false)
    setWrongAnswer(false)
    setNextWordId(0)
    setGameStarted(true)
  }

  const handleStart = () => {
    setGameStarted(true)
  }

  if (!sentences || sentences.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading game...</Typography>
      </Box>
    )
  }

  // Start screen
  if (!gameStarted && !gameOver) {
    return (
      <Box sx={{ ...clay(D.blue), p: 6, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: D.heading }}>
          Word Dash!
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ color: D.muted, mb: 4 }}>
          Click the correct word as it dashes across the screen!
        </Typography>

        <Stack spacing={2} sx={{ mb: 4, textAlign: 'left', maxWidth: 400, mx: 'auto' }}>
          <Typography variant="body1" sx={{ color: D.body }}>
            📝 Fill in {sentences.length} sentences
          </Typography>
          <Typography variant="body1" sx={{ color: D.body }}>
            ❤️ You have 3 lives
          </Typography>
          <Typography variant="body1" sx={{ color: D.body }}>
            ⭐ Get +1 point for each correct word
          </Typography>
          <Typography variant="body1" sx={{ color: D.body }}>
            ⚠️ Lose a life if you click wrong or miss the correct word
          </Typography>
        </Stack>

        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleStart}
          sx={{
            px: 6, py: 2, fontSize: '1.2rem',
            borderRadius: '12px',
            boxShadow: `4px 4px 0 ${D.blue.shadow}`,
            '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.blue.shadow}` }
          }}
        >
          Start Game
        </Button>
      </Box>
    )
  }

  // Game over screen
  if (gameOver) {
    const perfect = score === sentences.length
    return (
      <Box sx={{ ...clay(perfect ? D.green : D.red), p: 6, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: D.heading }}>
          {perfect ? '🎉 Perfect Score!' : '⏱️ Game Over!'}
        </Typography>
        <Typography variant="h4" sx={{ mb: 4, color: D.body }}>
          Final Score: {score} / {sentences.length}
        </Typography>
        <Button
          variant="contained"
          color={perfect ? 'success' : 'primary'}
          size="large"
          onClick={handleRestart}
          sx={{
            px: 6, py: 2,
            borderRadius: '12px',
            boxShadow: `4px 4px 0 ${perfect ? D.green.shadow : D.blue.shadow}`,
            '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${perfect ? D.green.shadow : D.blue.shadow}` }
          }}
        >
          Play Again
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Score and Lives Header */}
      <Box sx={{ ...clay(D.yellow), p: 2, mb: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          {/* Score */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <StarIcon sx={{ color: 'warning.main', fontSize: 30 }} />
            <Typography variant="h5" fontWeight="bold" sx={{ color: D.green.border }}>
              Score: {score}
            </Typography>
          </Stack>

          {/* Progress */}
          <Typography variant="body1" sx={{ color: D.muted }}>
            Sentence {currentSentenceIndex + 1} / {sentences.length}
          </Typography>

          {/* Lives */}
          <Stack direction="row" spacing={0.5}>
            {Array.from({ length: 3 }).map((_, i) => (
              <FavoriteIcon
                key={i}
                sx={{
                  color: i < lives ? 'error.main' : 'grey.300',
                  fontSize: 30
                }}
              />
            ))}
          </Stack>
        </Stack>
      </Box>

      {/* Current Sentence */}
      <Box
        sx={{
          ...clay(correctAnswer ? D.green : wrongAnswer ? D.red : D.blue),
          p: 3,
          mb: 2,
          textAlign: 'center',
          transition: 'background-color 0.3s',
          animation: wrongAnswer ? 'shake 0.5s' : 'none',
          '@keyframes shake': {
            '0%, 100%': { transform: 'translateX(0)' },
            '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
            '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' }
          }
        }}
      >
        <Typography variant="h4" fontWeight="medium" sx={{ color: D.body }}>
          {currentSentence?.sentence.split('[____]')[0]}
          <span style={{
            backgroundColor: correctAnswer ? D.green.border : D.blue.border,
            color: 'white',
            padding: '4px 16px',
            borderRadius: '8px',
            display: 'inline-block',
            minWidth: '150px'
          }}>
            {correctAnswer ? currentSentence?.answer : '____'}
          </span>
          {currentSentence?.sentence.split('[____]')[1]}
        </Typography>
      </Box>

      {/* Game Lane - where words move */}
      <Box
        ref={gameAreaRef}
        sx={{
          position: 'relative',
          height: 300,
          bgcolor: D.cardBg,
          overflow: 'hidden',
          border: `3px solid ${D.blue.border}`,
          borderRadius: '16px',
          boxShadow: `4px 4px 0 ${D.blue.shadow}`,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            color: D.muted,
            fontStyle: 'italic'
          }}
        >
          Click the correct word!
        </Typography>

        {/* Moving Words */}
        {movingWords.map(word => (
          <Box
            key={word.id}
            onClick={() => handleWordClick(word)}
            sx={{
              position: 'absolute',
              left: `${word.position}px`,
              top: `${word.top}%`,
              px: 2,
              py: 0.75,
              borderRadius: '50px',
              bgcolor: word.isCorrect ? D.teal.bg : D.orange.bg,
              border: `2px solid ${word.isCorrect ? D.teal.border : D.orange.border}`,
              boxShadow: `3px 3px 0 ${word.isCorrect ? D.teal.shadow : D.orange.shadow}`,
              fontWeight: 700,
              fontSize: '1.1rem',
              color: word.isCorrect ? D.teal.border : D.orange.border,
              cursor: 'pointer',
              userSelect: 'none',
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'center',
              transition: 'transform 0.1s',
              '&:hover': {
                transform: 'scale(1.1)',
              }
            }}
          >
            {word.text}
          </Box>
        ))}
      </Box>

      {/* Instructions */}
      <Box sx={{ ...clay(D.purple), p: 2, mt: 2 }}>
        <Typography variant="body2" sx={{ color: D.purple.border, textAlign: 'center' }}>
          💡 Click the moving word that correctly fills the gap. Be careful - wrong clicks cost lives!
        </Typography>
      </Box>
    </Box>
  )
}

export default WordDashGame
