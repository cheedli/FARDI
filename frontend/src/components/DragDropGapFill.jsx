import { useState, useEffect } from 'react'
import { Box, Paper, Typography, Button, Stack } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'

/**
 * Drag and Drop Gap Fill Component
 * Students drag words from a word bank to fill in gaps
 */

const DragDropGapFill = ({ wordBank = [], sentences = [], answers = {}, onComplete, startIndex = 0 }) => {
  const [placedWords, setPlacedWords] = useState({}) // { gapId: word }
  const [draggedWord, setDraggedWord] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(new Set())
  const [shuffledWordBank, setShuffledWordBank] = useState([])

  // Shuffle word bank on mount
  useEffect(() => {
    const shuffled = [...wordBank].sort(() => Math.random() - 0.5)
    setShuffledWordBank(shuffled)
  }, [wordBank])

  const handleDragStart = (e, word) => {
    setDraggedWord(word)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, gapId) => {
    e.preventDefault()

    if (!draggedWord || submitted) {
      return
    }

    // Place the word in the gap
    setPlacedWords(prev => ({
      ...prev,
      [gapId]: draggedWord
    }))

    setDraggedWord(null)
  }

  const handleRemoveWord = (gapId) => {
    if (submitted) return

    setPlacedWords(prev => {
      const updated = { ...prev }
      delete updated[gapId]
      return updated
    })
  }

  const handleSubmit = () => {
    // Calculate score and mark correct/incorrect
    const correct = new Set()
    let score = 0

    Object.entries(placedWords).forEach(([gapId, word]) => {
      const correctAnswer = answers[gapId]
      if (word.toLowerCase() === correctAnswer.toLowerCase()) {
        correct.add(gapId)
        score++
      }
    })

    setCorrectAnswers(correct)
    setSubmitted(true)

    if (onComplete) {
      onComplete({
        score,
        total: Object.keys(answers).length,
        placedWords,
        correctAnswers: correct
      })
    }
  }

  const isWordUsed = (word) => {
    return Object.values(placedWords).includes(word)
  }

  const isCorrect = (gapId) => {
    return submitted && correctAnswers.has(gapId)
  }

  const isIncorrect = (gapId) => {
    return submitted && placedWords[gapId] && !correctAnswers.has(gapId)
  }

  const allGapsFilled = Object.keys(answers).every(gapId => {
    return placedWords[gapId] !== undefined && placedWords[gapId] !== null && placedWords[gapId] !== ''
  })

  const renderSentence = (sentence, index) => {
    const gapId = `g_${startIndex + index}_0`
    const placedWord = placedWords[gapId]
    const correct = isCorrect(gapId)
    const incorrect = isIncorrect(gapId)

    const parts = sentence.split('___')

    return (
      <Box
        key={gapId}
        sx={{
          mb: 3,
          p: 2,
          backgroundColor: submitted ? (correct ? 'success.lighter' : incorrect ? 'error.lighter' : 'grey.50') : 'grey.50',
          borderRadius: 2,
          border: submitted ? '2px solid' : '1px solid',
          borderColor: submitted ? (correct ? 'success.main' : incorrect ? 'error.main' : 'grey.300') : 'grey.300',
          transition: 'all 0.3s'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          {parts[0] && <Typography variant="h6" sx={{ color: 'text.primary' }}>{parts[0]}</Typography>}

          {/* Drop Zone */}
          <Paper
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, gapId)}
            onClick={() => placedWord && handleRemoveWord(gapId)}
            elevation={placedWord ? 3 : 1}
            sx={{
              minWidth: 150,
              px: 2,
              py: 1,
              backgroundColor: placedWord
                ? (submitted ? (correct ? 'success.light' : 'error.light') : 'primary.light')
                : 'white',
              border: '2px dashed',
              borderColor: submitted
                ? (correct ? 'success.main' : incorrect ? 'error.main' : 'grey.400')
                : placedWord ? 'primary.main' : 'grey.400',
              cursor: placedWord && !submitted ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 40,
              transition: 'all 0.3s',
              '&:hover': {
                backgroundColor: placedWord && !submitted ? 'primary.lighter' : undefined,
                borderColor: !submitted && !placedWord ? 'primary.light' : undefined
              }
            }}
          >
            {placedWord ? (
              <Typography variant="body1" fontWeight="bold" sx={{ color: '#000000' }}>
                {placedWord}
              </Typography>
            ) : (
              <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#666666' }}>
                Drop word here
              </Typography>
            )}
          </Paper>

          {parts[1] && <Typography variant="h6" sx={{ color: 'text.primary' }}>{parts[1]}</Typography>}

          {/* Feedback Icon */}
          {submitted && (
            <Box sx={{ ml: 2 }}>
              {correct ? (
                <CheckCircleIcon sx={{ color: 'success.main', fontSize: 30 }} />
              ) : incorrect ? (
                <CancelIcon sx={{ color: 'error.main', fontSize: 30 }} />
              ) : null}
            </Box>
          )}
        </Box>

        {/* Show correct answer if wrong */}
        {submitted && incorrect && (
          <Box sx={{ mt: 2, p: 1, backgroundColor: 'error.lighter', borderRadius: 1 }}>
            <Typography variant="body2" color="error.dark">
              Correct answer: <strong>{answers[gapId]}</strong>
            </Typography>
          </Box>
        )}
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
      {/* Word Bank */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="primary">
          Word Bank - Drag words to fill the gaps:
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
          {shuffledWordBank.map((word, index) => {
            const used = isWordUsed(word)
            return (
              <Paper
                key={index}
                draggable={!used && !submitted}
                onDragStart={(e) => handleDragStart(e, word)}
                elevation={used ? 1 : 3}
                sx={{
                  px: 3,
                  py: 1.5,
                  backgroundColor: used ? 'grey.300' : 'white',
                  border: '2px solid',
                  borderColor: used ? 'grey.400' : 'primary.main',
                  borderRadius: 2,
                  cursor: used || submitted ? 'not-allowed' : 'grab',
                  opacity: used ? 0.4 : 1,
                  transition: 'all 0.3s',
                  pointerEvents: used || submitted ? 'none' : 'auto',
                  '&:hover': {
                    transform: used || submitted ? 'none' : 'scale(1.05)',
                    boxShadow: used || submitted ? 1 : 6
                  },
                  '&:active': {
                    cursor: used || submitted ? 'not-allowed' : 'grabbing'
                  }
                }}
              >
                <Typography variant="body1" fontWeight="bold" sx={{ color: used ? '#999999' : '#000000' }}>
                  {word}
                </Typography>
              </Paper>
            )
          })}
        </Box>
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.light' }}>
        <Typography variant="body1" textAlign="center" fontWeight="medium" color="info.dark">
          🖱️ Drag words from the word bank above to the gaps in the sentences. Click a placed word to remove it.
        </Typography>
      </Paper>

      {/* Sentences */}
      <Box>
        {sentences.map((sentence, index) => renderSentence(sentence, index))}
      </Box>

      {/* Submit Button */}
      {!submitted && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit}
            disabled={!allGapsFilled}
            sx={{ px: 6 }}
          >
            Submit Answers
          </Button>
          {!allGapsFilled && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Fill all gaps before submitting
            </Typography>
          )}
        </Box>
      )}
    </Box>
  )
}

export default DragDropGapFill
