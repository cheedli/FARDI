import React, { useState, useEffect } from 'react'
import { Box, Typography, Grid, Stack, LinearProgress, Button, useTheme } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import TimerIcon from '@mui/icons-material/Timer'

/**
 * Drag and Drop Matching Game Component
 * Students drag images to match with definitions
 * True drag-and-drop functionality
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

const DragDropMatchingGame = ({ pairs = [], duration = 300, onComplete }) => {
  const muiTheme = useTheme()
  const D = muiTheme.palette.mode === 'dark' ? DARK : LIGHT
  const [timeLeft, setTimeLeft] = useState(duration)
  const [timerStarted, setTimerStarted] = useState(false)
  const [matches, setMatches] = useState({}) // { imageId: definitionId }
  const [draggedItem, setDraggedItem] = useState(null)
  const [shuffledImages, setShuffledImages] = useState([])
  const [shuffledDefinitions, setShuffledDefinitions] = useState([])
  const [score, setScore] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [correctMatches, setCorrectMatches] = useState(new Set())

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
      setShuffledImages(shuffleArray(pairs.map((p, i) => ({ ...p, id: i }))))
      setShuffledDefinitions(shuffleArray(pairs.map((p, i) => ({ ...p, id: i }))))
    }
  }, [pairs])

  // Timer countdown
  useEffect(() => {
    if (timerStarted && !gameComplete && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [timerStarted, gameComplete, timeLeft])

  // Start timer on first drag
  const handleDragStart = (e, item, type) => {
    if (!timerStarted) {
      setTimerStarted(true)
    }
    setDraggedItem({ item, type })
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, targetItem) => {
    e.preventDefault()

    if (!draggedItem || draggedItem.type !== 'image') {
      return
    }

    const imageId = draggedItem.item.id
    const definitionId = targetItem.id

    // Remove any existing match for this definition slot
    const updatedMatches = { ...matches }
    const existingImageId = Object.keys(updatedMatches).find(
      key => updatedMatches[key] === definitionId
    )
    if (existingImageId) {
      delete updatedMatches[existingImageId]
    }

    // Store the new match without showing feedback
    updatedMatches[imageId] = definitionId
    setMatches(updatedMatches)

    setDraggedItem(null)
  }

  const handleRemoveMatch = (imageId) => {
    if (submitted) return // Don't allow removal after submission

    setMatches(prev => {
      const updated = { ...prev }
      delete updated[imageId]
      return updated
    })
  }

  const handleSubmit = () => {
    // Calculate score based on correct matches
    let correctCount = 0
    const correct = new Set()

    console.log('=== DragDrop Matching - Scoring ===')
    console.log('Total matches made:', Object.keys(matches).length)

    Object.entries(matches).forEach(([imageId, definitionId]) => {
      const isCorrect = parseInt(imageId) === parseInt(definitionId)
      console.log(`Image ${imageId} → Definition ${definitionId}: ${isCorrect ? '✅ Correct (+1)' : '❌ Incorrect'}`)

      if (isCorrect) {
        correctCount++
        correct.add(parseInt(imageId))
      }
    })

    console.log('Total Correct Matches:', correctCount, '/', pairs.length)
    console.log('Final Score:', correctCount)

    setScore(correctCount)
    setCorrectMatches(correct)
    setSubmitted(true)

    // Don't auto-complete - let parent component handle navigation
    // User will see green/red colors and click Next button
    endGame(correctCount)
  }

  const endGame = (finalScore = null) => {
    // If finalScore is not provided, calculate it
    const calculatedScore = finalScore !== null ? finalScore : calculateScore()

    setGameComplete(true)
    if (onComplete) {
      onComplete({
        score: calculatedScore,
        totalPairs: pairs.length,
        timeTaken: duration - timeLeft
      })
    }
  }

  const calculateScore = () => {
    let correctCount = 0
    Object.entries(matches).forEach(([imageId, definitionId]) => {
      if (parseInt(imageId) === parseInt(definitionId)) {
        correctCount++
      }
    })
    return correctCount
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const isMatched = (id) => {
    return submitted && correctMatches.has(id)
  }

  const isIncorrect = (id) => {
    return submitted && matches[id] !== undefined && !correctMatches.has(id)
  }

  const hasMatch = (id) => {
    return matches[id] !== undefined
  }

  // Don't return null - keep showing the game with feedback colors

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
      {/* Header with Timer and Score */}
      <Box sx={{ ...clay(D.blue), p: 2, mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" alignItems="center" spacing={1}>
            <TimerIcon sx={{ color: timeLeft < 60 ? D.red.border : D.blue.border }} />
            <Typography variant="h5" fontWeight="bold" sx={{ color: timeLeft < 60 ? D.red.border : D.blue.border }}>
              {formatTime(timeLeft)}
            </Typography>
          </Stack>

          <Typography variant="h6" sx={{ color: D.body }}>
            Placed: {Object.keys(matches).length} / {pairs.length}
          </Typography>

          <LinearProgress
            variant="determinate"
            value={(Object.keys(matches).length / pairs.length) * 100}
            sx={{ width: 200, height: 10, borderRadius: 1 }}
          />
        </Stack>
      </Box>

      {/* Instructions */}
      <Box sx={{ ...clay(D.teal), p: 2, mb: 3 }}>
        <Typography variant="body1" textAlign="center" fontWeight="medium" sx={{ color: D.teal.border }}>
          🖱️ Drag images from the top row to the definition boxes below. Click a placed image to remove it.
        </Typography>
      </Box>

      {/* Drag and Drop Area */}
      <Stack spacing={4}>
        {/* Top Row - Images (Draggable) */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', mb: 2, color: D.heading }}>
            Drag these images to the matching definitions below
          </Typography>
          <Grid container spacing={{ xs: 1, sm: 2 }}>
            {shuffledImages.map((item) => {
              const placed = hasMatch(item.id)
              const correct = isMatched(item.id)
              const incorrect = isIncorrect(item.id)

              return (
                <Grid item xs={6} sm={4} md={3} key={item.id}>
                  <Box
                    draggable={!submitted && !placed}
                    onDragStart={(e) => handleDragStart(e, item, 'image')}
                    sx={{
                      ...clay(correct ? D.green : incorrect ? D.red : D.blue),
                      p: 2,
                      cursor: submitted ? 'default' : placed ? 'default' : 'grab',
                      opacity: placed && !submitted ? 0.3 : 1,
                      transition: 'all 0.3s',
                      pointerEvents: placed && !submitted ? 'none' : 'auto',
                      height: '100%',
                      '&:hover': {
                        transform: submitted || placed ? 'none' : 'translate(-2px,-2px)',
                        boxShadow: submitted || placed ? `4px 4px 0 ${D.blue.shadow}` : `6px 6px 0 ${D.blue.shadow}`
                      },
                      '&:active': {
                        cursor: submitted || placed ? 'default' : 'grabbing'
                      }
                    }}
                  >
                    <Stack spacing={1} alignItems="center">
                      <Box
                        component="img"
                        src={item.image}
                        alt={item.word}
                        sx={{
                          width: { xs: 70, sm: 100 },
                          height: { xs: 70, sm: 100 },
                          objectFit: 'cover',
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: 'grey.300'
                        }}
                      />
                      <Typography variant="body1" fontWeight="bold" sx={{ color: D.heading, textAlign: 'center' }}>
                        {item.word}
                      </Typography>
                      {correct && (
                        <CheckCircleIcon sx={{ color: D.green.border, fontSize: 24 }} />
                      )}
                      {incorrect && (
                        <CancelIcon sx={{ color: D.red.border, fontSize: 24 }} />
                      )}
                    </Stack>
                  </Box>
                </Grid>
              )
            })}
          </Grid>
        </Box>

        {/* Bottom Row - Definitions (Drop Zones) */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', mb: 2, color: D.heading }}>
            Drop images here to match with definitions
          </Typography>
          <Grid container spacing={{ xs: 1, sm: 2 }}>
            {shuffledDefinitions.map((item) => {
              const hasMatchHere = Object.values(matches).includes(item.id)
              const matchedImageId = Object.keys(matches).find(key => matches[key] === item.id)
              const matchedImage = matchedImageId ? shuffledImages.find(img => img.id === parseInt(matchedImageId)) : null
              const correct = submitted && matchedImageId && parseInt(matchedImageId) === item.id
              const incorrect = submitted && hasMatchHere && !correct

              return (
                <Grid item xs={6} sm={4} md={3} key={item.id}>
                  <Box
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, item)}
                    onClick={() => hasMatchHere && matchedImageId && handleRemoveMatch(parseInt(matchedImageId))}
                    sx={{
                      ...(correct ? clay(D.green) : incorrect ? clay(D.red) : {
                        bgcolor: D.cardBg,
                        border: `2px dashed ${D.divider}`,
                        borderRadius: '16px',
                        boxShadow: `4px 4px 0 ${D.blue.shadow}`,
                      }),
                      p: 2,
                      minHeight: hasMatchHere ? 220 : 140,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: hasMatchHere && !submitted ? 'pointer' : 'default',
                      transition: 'all 0.3s',
                      height: '100%',
                      '&:hover': {
                        bgcolor: submitted
                          ? (correct ? D.green.bg : incorrect ? D.red.bg : D.cardBg)
                          : D.blue.bg,
                        borderColor: submitted
                          ? (correct ? D.green.border : incorrect ? D.red.border : D.divider)
                          : D.blue.border
                      }
                    }}
                  >
                    <Stack spacing={1.5} alignItems="center" sx={{ width: '100%' }}>
                      {hasMatchHere && matchedImage && (
                        // Show the matched image with word label
                        <Stack spacing={1} alignItems="center">
                          <Box
                            component="img"
                            src={matchedImage.image}
                            alt={matchedImage.word}
                            sx={{
                              width: { xs: 56, sm: 80 },
                              height: { xs: 56, sm: 80 },
                              objectFit: 'cover',
                              borderRadius: 1,
                              border: '2px solid',
                              borderColor: correct ? D.green.border : incorrect ? D.red.border : D.divider
                            }}
                          />
                          <Typography variant="body2" fontWeight="bold" sx={{ color: correct ? D.green.border : incorrect ? D.red.border : D.body }}>
                            {matchedImage.word}
                          </Typography>
                          {correct && (
                            <CheckCircleIcon sx={{ color: D.green.border, fontSize: 24 }} />
                          )}
                          {incorrect && (
                            <CancelIcon sx={{ color: D.red.border, fontSize: 24 }} />
                          )}
                        </Stack>
                      )}
                      {/* Always show the definition text */}
                      <Typography
                        variant="body2"
                        textAlign="center"
                        sx={{
                          color: D.body,
                          fontWeight: 500,
                          borderTop: hasMatchHere ? '1px solid' : 'none',
                          borderColor: hasMatchHere ? D.divider : 'transparent',
                          pt: hasMatchHere ? 1.5 : 0,
                          fontSize: '0.875rem'
                        }}
                      >
                        {item.definition}
                      </Typography>
                    </Stack>
                  </Box>
                </Grid>
              )
            })}
          </Grid>
        </Box>
      </Stack>

      {/* Submit Button */}
      {!submitted && Object.keys(matches).length > 0 && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit}
            disabled={Object.keys(matches).length !== pairs.length}
          >
            Submit Answers
          </Button>
          {Object.keys(matches).length !== pairs.length && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Match all {pairs.length} pairs before submitting
            </Typography>
          )}
        </Box>
      )}
    </Box>
  )
}

export default DragDropMatchingGame
