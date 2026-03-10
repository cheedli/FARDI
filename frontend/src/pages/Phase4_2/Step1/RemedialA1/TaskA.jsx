import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Grid, Card, CardContent, CardActionArea, Alert, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import TimerIcon from '@mui/icons-material/Timer'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 - Level A1 - Task A: Match Race
 * Match 8 social media words to pictures/definitions
 */

const WORD_IMAGE_PAIRS = [
  {
    word: 'hashtag',
    image: '#️⃣',
    description: '# symbol picture'
  },
  {
    word: 'caption',
    image: '📝',
    description: 'Text under photo'
  },
  {
    word: 'emoji',
    image: '😊',
    description: 'Smiley face'
  },
  {
    word: 'tag',
    image: '🏷️',
    description: '@name'
  },
  {
    word: 'like',
    image: '❤️',
    description: 'Heart button'
  },
  {
    word: 'share',
    image: '↗️',
    description: 'Arrow button'
  },
  {
    word: 'post',
    image: '🖼️',
    description: 'Square picture'
  },
  {
    word: 'story',
    image: '⭕',
    description: 'Circle icon'
  }
]

export default function Phase4_2RemedialA1TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 1, context: 'remedial_a1' })
  const [matches, setMatches] = useState({})
  const [selectedWord, setSelectedWord] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [correctMatches, setCorrectMatches] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [shuffledImages, setShuffledImages] = useState([])
  const [timeLeft, setTimeLeft] = useState(60) // 60 seconds timer
  const [timerActive, setTimerActive] = useState(true)

  // Shuffle images on mount
  useEffect(() => {
    const shuffled = [...WORD_IMAGE_PAIRS].sort(() => Math.random() - 0.5)
    setShuffledImages(shuffled)
  }, [])

  // Timer countdown
  useEffect(() => {
    if (timerActive && timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showResults) {
      // Time's up - auto submit
      handleSubmit()
    }
  }, [timeLeft, timerActive, showResults])

  const handleWordClick = (word) => {
    if (correctMatches.includes(word)) return
    setSelectedWord(word)

    // If image already selected, try to match
    if (selectedImage !== null) {
      checkMatch(word, selectedImage)
    }
  }

  const handleImageClick = (image) => {
    if (Object.values(matches).includes(image)) return
    setSelectedImage(image)

    // If word already selected, try to match
    if (selectedWord !== null) {
      checkMatch(selectedWord, image)
    }
  }

  const checkMatch = (word, image) => {
    const correctPair = WORD_IMAGE_PAIRS.find(pair => pair.word === word)

    // Allow ALL matches (correct or incorrect)
    setMatches({ ...matches, [word]: image })

    // Track which matches are actually correct
    if (correctPair && correctPair.image === image) {
      setCorrectMatches([...correctMatches, word])
    }

    // Reset selection
    setSelectedWord(null)
    setSelectedImage(null)
  }

  const handleSubmit = () => {
    setTimerActive(false)
    setShowResults(true)

    // Calculate score with time bonus
    const baseScore = correctMatches.length
    const timeBonus = timeLeft > 30 ? 2 : timeLeft > 10 ? 1 : 0
    const finalScore = Math.min(baseScore + timeBonus, 10)

    // Store score for combined evaluation
    sessionStorage.setItem('phase4_2_remedial_a1_taskA_score', finalScore.toString())
    sessionStorage.setItem('phase4_2_remedial_a1_taskA_max', '10')

    logTaskCompletion(correctMatches.length, WORD_IMAGE_PAIRS.length, 60 - timeLeft)
  }

  const logTaskCompletion = async (score, maxScore, timeTaken) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          phase: '4.2',
          step: 1,
          level: 'A1',
          task: 'A',
          score: score,
          max_score: maxScore,
          time_taken: timeTaken
        })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const handleNext = () => {
    navigate('/phase4_2/step/1/remedial/a1/taskB')
  }

  const isComplete = correctMatches.length === WORD_IMAGE_PAIRS.length
  const allPairsMatched = Object.keys(matches).length === WORD_IMAGE_PAIRS.length
  const timerProgress = (timeLeft / 60) * 100

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'warning.light', color: 'warning.contrastText' }}>
        <Typography variant="h5" gutterBottom>
          Phase 4.2 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level A1 - Task A: Match Race
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Race against the timer to match social media words to their pictures! Match correctly before time runs out for bonus points!"
        />
      </Paper>

      {/* Timer */}
      {!showResults && (
        <Paper elevation={3} sx={{ p: 2, mb: 3, backgroundColor: timeLeft < 10 ? 'error.lighter' : 'primary.lighter' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <TimerIcon color={timeLeft < 10 ? 'error' : 'primary'} />
            <Typography variant="h5" fontWeight="bold" color={timeLeft < 10 ? 'error.main' : 'primary.main'}>
              {timeLeft}s
            </Typography>
            <Typography variant="body2" color="text.secondary">
              remaining
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={timerProgress}
            color={timeLeft < 10 ? 'error' : 'primary'}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Paper>
      )}

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1">
          <strong>Instructions:</strong> Click on a word, then click on its matching picture/definition. Race against the timer!
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Evaluation:</strong> All pairs must match exactly. Finish faster for bonus points!
        </Typography>
      </Paper>

      {/* Score */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="success.main">
          Matched: {correctMatches.length}/{WORD_IMAGE_PAIRS.length}
        </Typography>
      </Box>

      {/* Matching Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Words Column */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', mb: 2 }}>
            Social Media Words
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {WORD_IMAGE_PAIRS.map(pair => (
              <Card
                key={pair.word}
                elevation={selectedWord === pair.word ? 4 : 2}
                sx={{
                  cursor: correctMatches.includes(pair.word) ? 'default' : 'pointer',
                  backgroundColor: correctMatches.includes(pair.word)
                    ? 'success.lighter'
                    : selectedWord === pair.word
                      ? 'primary.lighter'
                      : 'white',
                  border: selectedWord === pair.word ? 2 : 0,
                  borderColor: 'primary.main'
                }}
              >
                <CardActionArea
                  onClick={() => handleWordClick(pair.word)}
                  disabled={correctMatches.includes(pair.word)}
                >
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {pair.word}
                      </Typography>
                      {correctMatches.includes(pair.word) && (
                        <CheckCircleIcon color="success" />
                      )}
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        </Grid>

        {/* Images Column */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', mb: 2 }}>
            Pictures/Definitions
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {shuffledImages.map(pair => {
              const isMatched = Object.values(matches).includes(pair.image)
              const matchedWord = Object.keys(matches).find(word => matches[word] === pair.image)
              const isCorrectMatch = matchedWord && correctMatches.includes(matchedWord)

              return (
                <Card
                  key={pair.image}
                  elevation={selectedImage === pair.image ? 4 : 2}
                  sx={{
                    cursor: isMatched ? 'default' : 'pointer',
                    backgroundColor: isMatched
                      ? (isCorrectMatch ? 'success.lighter' : 'error.lighter')
                      : selectedImage === pair.image
                        ? 'primary.lighter'
                        : 'white',
                    border: selectedImage === pair.image ? 2 : 0,
                    borderColor: 'primary.main'
                  }}
                >
                  <CardActionArea
                    onClick={() => handleImageClick(pair.image)}
                    disabled={isMatched}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h1" sx={{ fontSize: '3rem' }}>
                          {pair.image}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {pair.description}
                        </Typography>
                        {isMatched && matchedWord && (
                          <>
                            <Typography
                              variant="h6"
                              color={isCorrectMatch ? 'success.main' : 'error.main'}
                              fontWeight="bold"
                            >
                              {matchedWord}
                            </Typography>
                            {isCorrectMatch ? (
                              <CheckCircleIcon color="success" />
                            ) : (
                              <Typography variant="caption" color="error">✗ Incorrect</Typography>
                            )}
                          </>
                        )}
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              )
            })}
          </Box>
        </Grid>
      </Grid>

      {/* Results */}
      {showResults && (
        <Alert severity={isComplete ? "success" : "warning"} sx={{ mb: 3 }}>
          {isComplete ? (
            <Typography>
              🎉 Perfect! You matched all {WORD_IMAGE_PAIRS.length} pairs correctly! {timeLeft > 30 && '⚡ Time bonus awarded!'}
            </Typography>
          ) : (
            <Typography>
              You matched {correctMatches.length}/{WORD_IMAGE_PAIRS.length} correctly. Keep practicing!
            </Typography>
          )}
        </Alert>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
        {!showResults && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit}
            disabled={!allPairsMatched}
          >
            Submit Matches
          </Button>
        )}
        {showResults && (
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={handleNext}
            endIcon={<ArrowForwardIcon />}
          >
            Continue to Task B
          </Button>
        )}
      </Box>
    </Box>
  )
}
