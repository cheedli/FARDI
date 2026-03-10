import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Grid, Card, CardContent, CardActionArea, Alert } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 3 - Level A1 - Task A: Picture Matching
 * Match words (sponsor, money, ticket, food) to images
 */

const WORD_IMAGE_PAIRS = [
  {
    word: 'sponsor',
    image: '💼',
    description: 'A company or person who gives money'
  },
  {
    word: 'money',
    image: '💵',
    description: 'Cash or currency'
  },
  {
    word: 'ticket',
    image: '🎫',
    description: 'Entry pass to an event'
  },
  {
    word: 'food',
    image: '🍽️',
    description: 'Meals and snacks'
  }
]

export default function Phase3RemedialA1TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 1, interaction: 1, context: 'remedial_a1' })
  const [matches, setMatches] = useState({})
  const [selectedWord, setSelectedWord] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [correctMatches, setCorrectMatches] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [shuffledImages, setShuffledImages] = useState([])

  // Shuffle images on mount
  useEffect(() => {
    const shuffled = [...WORD_IMAGE_PAIRS].sort(() => Math.random() - 0.5)
    setShuffledImages(shuffled)
  }, [])

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
    setShowResults(true)

    // Store score for combined Task A + Task B evaluation
    const scoreOutOf10 = (correctMatches.length / WORD_IMAGE_PAIRS.length) * 10
    sessionStorage.setItem('phase3_remedial_a1_taskA_score', scoreOutOf10.toString())
    sessionStorage.setItem('phase3_remedial_a1_taskA_max', '10')

    logTaskCompletion(correctMatches.length, WORD_IMAGE_PAIRS.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      await fetch('/api/phase3/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: 'A1',
          task: 'A',
          score: score,
          max_score: maxScore,
          time_taken: 0
        })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const handleNext = () => {
    navigate('/app/phase3/step/1/remedial/a1/taskB')
  }

  const isComplete = correctMatches.length === WORD_IMAGE_PAIRS.length
  const allPairsMatched = Object.keys(matches).length === WORD_IMAGE_PAIRS.length

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'warning.light', color: 'warning.contrastText' }}>
        <Typography variant="h5" gutterBottom>
          Phase 3 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level A1 - Task A: Picture Matching
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Let's practice some basic financial vocabulary! Match each word to its picture."
        />
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1">
          <strong>Instructions:</strong> Click on a word, then click on its matching picture.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Evaluation:</strong> All pairs must be correct to proceed.
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
            Words
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
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
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
            Pictures
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {shuffledImages.map(pair => {
              const isMatched = Object.values(matches).includes(pair.image)
              // Find which word was matched to this image
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
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h1" sx={{ fontSize: '4rem' }}>
                          {pair.image}
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
              Perfect! You matched all {WORD_IMAGE_PAIRS.length} pairs correctly!
            </Typography>
          ) : (
            <Typography>
              You matched {correctMatches.length}/{WORD_IMAGE_PAIRS.length}. Try to match all pairs!
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
            Submit
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
