import React, { useState, useEffect } from 'react'
import { Box, Paper, Typography, Grid, Stack, LinearProgress, Button, useTheme } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import TimerIcon from '@mui/icons-material/Timer'

/**
 * Drag and Drop Matching Game Component
 * Students drag images to match with definitions
 * True drag-and-drop functionality
 */

const DragDropMatchingGame = ({ pairs = [], duration = 300, onComplete }) => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
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
      <Paper elevation={3} sx={{ p: 2, mb: 3, backgroundColor: 'primary.light' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" alignItems="center" spacing={1}>
            <TimerIcon sx={{ color: timeLeft < 60 ? 'error.main' : 'primary.dark' }} />
            <Typography variant="h5" fontWeight="bold" color={timeLeft < 60 ? 'error.main' : 'primary.dark'}>
              {formatTime(timeLeft)}
            </Typography>
          </Stack>

          <Typography variant="h6" color="text.primary">
            Placed: {Object.keys(matches).length} / {pairs.length}
          </Typography>

          <LinearProgress
            variant="determinate"
            value={(Object.keys(matches).length / pairs.length) * 100}
            sx={{ width: 200, height: 10, borderRadius: 1 }}
          />
        </Stack>
      </Paper>

      {/* Instructions */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: 'info.light' }}>
        <Typography variant="body1" textAlign="center" fontWeight="medium" color="info.dark">
          🖱️ Drag images from the top row to the definition boxes below. Click a placed image to remove it.
        </Typography>
      </Paper>

      {/* Drag and Drop Area */}
      <Stack spacing={4}>
        {/* Top Row - Images (Draggable) */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', mb: 2 }}>
            Drag these images to the matching definitions below
          </Typography>
          <Grid container spacing={{ xs: 1, sm: 2 }}>
            {shuffledImages.map((item) => {
              const placed = hasMatch(item.id)
              const correct = isMatched(item.id)
              const incorrect = isIncorrect(item.id)

              return (
                <Grid item xs={6} sm={4} md={3} key={item.id}>
                  <Paper
                    draggable={!submitted && !placed}
                    onDragStart={(e) => handleDragStart(e, item, 'image')}
                    elevation={placed ? 1 : 3}
                    sx={{
                      p: 2,
                      cursor: submitted ? 'default' : placed ? 'default' : 'grab',
                      opacity: placed && !submitted ? 0.3 : 1,
                      backgroundColor: correct ? 'success.light' : incorrect ? 'error.light' : 'white',
                      border: '2px solid',
                      borderColor: correct ? 'success.main' : incorrect ? 'error.main' : 'grey.300',
                      transition: 'all 0.3s',
                      pointerEvents: placed && !submitted ? 'none' : 'auto',
                      height: '100%',
                      '&:hover': {
                        transform: submitted || placed ? 'none' : 'scale(1.05)',
                        boxShadow: submitted || placed ? 1 : 6
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
                      <Typography variant="body1" fontWeight="bold" sx={{ color: '#000000', textAlign: 'center' }}>
                        {item.word}
                      </Typography>
                      {correct && (
                        <CheckCircleIcon sx={{ color: 'success.main', fontSize: 24 }} />
                      )}
                      {incorrect && (
                        <CancelIcon sx={{ color: 'error.main', fontSize: 24 }} />
                      )}
                    </Stack>
                  </Paper>
                </Grid>
              )
            })}
          </Grid>
        </Box>

        {/* Bottom Row - Definitions (Drop Zones) */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', mb: 2 }}>
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
                  <Paper
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, item)}
                    onClick={() => hasMatchHere && matchedImageId && handleRemoveMatch(parseInt(matchedImageId))}
                    elevation={hasMatchHere ? 1 : 3}
                    sx={{
                      p: 2,
                      minHeight: hasMatchHere ? 220 : 140,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: correct ? 'success.light' : incorrect ? 'error.light' : 'grey.50',
                      border: '2px dashed',
                      borderColor: correct ? 'success.main' : incorrect ? 'error.main' : 'grey.400',
                      cursor: hasMatchHere && !submitted ? 'pointer' : 'default',
                      transition: 'all 0.3s',
                      height: '100%',
                      '&:hover': {
                        backgroundColor: submitted ? (correct ? 'success.light' : incorrect ? 'error.light' : 'grey.50') : 'grey.100',
                        borderColor: submitted ? (correct ? 'success.main' : incorrect ? 'error.main' : 'grey.400') : 'primary.main'
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
                              borderColor: correct ? 'success.main' : incorrect ? 'error.main' : 'grey.400'
                            }}
                          />
                          <Typography variant="body2" fontWeight="bold" sx={{ color: correct ? 'success.dark' : incorrect ? 'error.dark' : 'text.primary' }}>
                            {matchedImage.word}
                          </Typography>
                          {correct && (
                            <CheckCircleIcon sx={{ color: 'success.main', fontSize: 24 }} />
                          )}
                          {incorrect && (
                            <CancelIcon sx={{ color: 'error.main', fontSize: 24 }} />
                          )}
                        </Stack>
                      )}
                      {/* Always show the definition text */}
                      <Typography
                        variant="body2"
                        textAlign="center"
                        sx={{
                          color: 'text.primary',
                          fontWeight: 500,
                          borderTop: hasMatchHere ? '1px solid' : 'none',
                          borderColor: hasMatchHere ? 'divider' : 'transparent',
                          pt: hasMatchHere ? 1.5 : 0,
                          fontSize: '0.875rem'
                        }}
                      >
                        {item.definition}
                      </Typography>
                    </Stack>
                  </Paper>
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
