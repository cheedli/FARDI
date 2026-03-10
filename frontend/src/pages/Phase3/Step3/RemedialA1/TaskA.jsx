import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Card, CardContent, Alert, Stack, Chip } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ShuffleIcon from '@mui/icons-material/Shuffle'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 3 Step 3 - Level A1 - Task A: Sentence Building
 * Reorder words to make correct sentences
 */

const SENTENCE_EXERCISES = [
  {
    id: 1,
    correctOrder: ['We', 'need', 'a', 'sponsor'],
    hint: 'Subject + verb + object'
  },
  {
    id: 2,
    correctOrder: ['The', 'budget', 'is', 'important'],
    hint: 'Article + noun + verb + adjective'
  },
  {
    id: 3,
    correctOrder: ['Tickets', 'cost', 'money'],
    hint: 'What costs what?'
  },
  {
    id: 4,
    correctOrder: ['We', 'sell', 'tickets'],
    hint: 'Who does what?'
  },
  {
    id: 5,
    correctOrder: ['Sponsors', 'give', 'money'],
    hint: 'Who gives what?'
  }
]

// Shuffle array helper
const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function Phase3Step3RemedialA1TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 3, interaction: 1, context: 'remedial_a1' })

  // Initialize with shuffled words
  const [exercises, setExercises] = useState(
    SENTENCE_EXERCISES.map(ex => ({
      ...ex,
      shuffledWords: shuffleArray(ex.correctOrder),
      userOrder: []
    }))
  )

  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const handleWordClick = (exerciseIndex, word) => {
    if (showResults) return

    const newExercises = [...exercises]
    const exercise = newExercises[exerciseIndex]

    // Add word to user's order
    if (!exercise.userOrder.includes(word)) {
      exercise.userOrder = [...exercise.userOrder, word]
      setExercises(newExercises)
    }
  }

  const handleRemoveWord = (exerciseIndex, wordIndex) => {
    if (showResults) return

    const newExercises = [...exercises]
    const exercise = newExercises[exerciseIndex]

    // Remove word from user's order
    exercise.userOrder = exercise.userOrder.filter((_, idx) => idx !== wordIndex)
    setExercises(newExercises)
  }

  const handleReset = (exerciseIndex) => {
    if (showResults) return

    const newExercises = [...exercises]
    newExercises[exerciseIndex].userOrder = []
    setExercises(newExercises)
  }

  const handleSubmit = () => {
    // Calculate score
    let correctCount = 0

    exercises.forEach(exercise => {
      const isCorrect =
        exercise.userOrder.length === exercise.correctOrder.length &&
        exercise.userOrder.every((word, idx) => word === exercise.correctOrder[idx])

      if (isCorrect) {
        correctCount++
      }
    })

    setScore(correctCount)
    setShowResults(true)

    // Log to backend
    logTaskCompletion(correctCount, exercises.length)
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
          time_taken: 0,
          step: 3
        })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const handleNext = () => {
    navigate('/app/dashboard')
  }

  const allCompleted = exercises.every(ex => ex.userOrder.length === ex.correctOrder.length)
  const passThreshold = 4 // 4/5 to pass

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'warning.light', color: 'warning.contrastText' }}>
        <Typography variant="h5" gutterBottom>
          Phase 3 Step 3 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level A1 - Task A: Sentence Building
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Emna"
          message="Let's practice building sentences! Click on the words in the correct order to make a sentence. You can click 'Reset' to start over if you make a mistake."
        />
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1" gutterBottom>
          <strong>Instructions:</strong> Click the words in the correct order to build each sentence.
        </Typography>
        <Typography variant="body2">
          <strong>Passing score:</strong> Minimum 4/5 correct
        </Typography>
      </Paper>

      {/* Progress */}
      {!showResults && (
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="primary">
            Completed: {exercises.filter(ex => ex.userOrder.length === ex.correctOrder.length).length}/{exercises.length}
          </Typography>
        </Box>
      )}

      {/* Exercises */}
      <Box sx={{ mb: 4 }}>
        {exercises.map((exercise, exerciseIndex) => {
          const isCorrect = showResults &&
            exercise.userOrder.length === exercise.correctOrder.length &&
            exercise.userOrder.every((word, idx) => word === exercise.correctOrder[idx])

          return (
            <Card
              key={exercise.id}
              elevation={3}
              sx={{
                mb: 3,
                border: showResults ? (isCorrect ? 2 : 1) : 1,
                borderColor: showResults
                  ? isCorrect
                    ? 'success.main'
                    : 'error.main'
                  : 'grey.300',
                backgroundColor: showResults && isCorrect ? 'success.lighter' : 'white'
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {exerciseIndex + 1}. Build this sentence:
                </Typography>

                {/* Hint */}
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    💡 <strong>Hint:</strong> {exercise.hint}
                  </Typography>
                </Alert>

                {/* User's Answer Area */}
                <Paper
                  sx={{
                    p: 2,
                    mb: 2,
                    minHeight: 60,
                    backgroundColor: '#f5f5f5',
                    border: 2,
                    borderColor: 'primary.main',
                    borderStyle: 'dashed'
                  }}
                >
                  {exercise.userOrder.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                      Click words below to build your sentence...
                    </Typography>
                  ) : (
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {exercise.userOrder.map((word, wordIndex) => (
                        <Chip
                          key={wordIndex}
                          label={word}
                          onDelete={!showResults ? () => handleRemoveWord(exerciseIndex, wordIndex) : undefined}
                          color="primary"
                          sx={{ fontSize: '1rem' }}
                        />
                      ))}
                    </Stack>
                  )}
                </Paper>

                {/* Available Words */}
                {!showResults && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom color="text.secondary">
                      Available words (click to add):
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {exercise.shuffledWords.map((word, wordIndex) => (
                        <Chip
                          key={wordIndex}
                          label={word}
                          onClick={() => handleWordClick(exerciseIndex, word)}
                          variant="outlined"
                          disabled={exercise.userOrder.includes(word)}
                          sx={{
                            fontSize: '1rem',
                            cursor: exercise.userOrder.includes(word) ? 'not-allowed' : 'pointer',
                            opacity: exercise.userOrder.includes(word) ? 0.3 : 1
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}

                {/* Reset Button */}
                {!showResults && exercise.userOrder.length > 0 && (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<ShuffleIcon />}
                    onClick={() => handleReset(exerciseIndex)}
                  >
                    Reset
                  </Button>
                )}

                {/* Show Result */}
                {showResults && (
                  <Alert severity={isCorrect ? "success" : "error"} sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      {isCorrect ? (
                        <>✓ Correct! <strong>{exercise.correctOrder.join(' ')}</strong></>
                      ) : (
                        <>
                          ✗ Your answer: <strong>{exercise.userOrder.join(' ') || '(no answer)'}</strong>
                          <br />
                          Correct answer: <strong>{exercise.correctOrder.join(' ')}</strong>
                        </>
                      )}
                    </Typography>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )
        })}
      </Box>

      {/* Results */}
      {showResults && (
        <Alert
          severity={score >= passThreshold ? "success" : "warning"}
          sx={{ mb: 3 }}
        >
          <Typography variant="h6" gutterBottom>
            Task Complete!
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Score:</strong> {score}/{exercises.length}
          </Typography>
          <Typography>
            {score === exercises.length
              ? "Perfect score! Excellent work!"
              : score >= passThreshold
                ? `Great job! You passed with ${score} correct answers.`
                : `You need ${passThreshold} correct to pass. Review the answers above and try again if needed.`}
          </Typography>
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
            disabled={!allCompleted}
          >
            Submit Answers
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
            Complete A1 Task
          </Button>
        )}
      </Box>
    </Box>
  )
}
