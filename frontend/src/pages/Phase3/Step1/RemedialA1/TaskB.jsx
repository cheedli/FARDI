import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Alert, MenuItem, Select, FormControl } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 3 - Level A1 - Task B: Gap Fill
 * Fill gaps using: money, sponsor, budget, ticket
 */

const GAP_FILL_SENTENCES = [
  {
    id: 1,
    sentence: 'We need ____ for food.',
    answer: 'money',
    options: ['money', 'sponsor', 'budget', 'ticket']
  },
  {
    id: 2,
    sentence: 'The ____ will help us pay for the event.',
    answer: 'sponsor',
    options: ['money', 'sponsor', 'budget', 'ticket']
  },
  {
    id: 3,
    sentence: 'Our ____ shows how we spend money.',
    answer: 'budget',
    options: ['money', 'sponsor', 'budget', 'ticket']
  },
  {
    id: 4,
    sentence: 'People buy a ____ to enter the festival.',
    answer: 'ticket',
    options: ['money', 'sponsor', 'budget', 'ticket']
  }
]

export default function Phase3RemedialA1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 1, interaction: 2, context: 'remedial_a1' })
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)

  // Track which words are already used in other sentences
  const usedWords = Object.values(answers).filter(Boolean)

  const handleAnswerChange = (sentenceId, value) => {
    setAnswers({
      ...answers,
      [sentenceId]: value
    })
  }

  const handleSubmit = () => {
    setShowResults(true)
    const score = GAP_FILL_SENTENCES.filter(s => answers[s.id] === s.answer).length
    logTaskCompletion(score, GAP_FILL_SENTENCES.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score: score })
    try {
      await fetch('/api/phase3/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: 'A1',
          task: 'B',
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
    navigate('/app/dashboard')
  }

  const correctCount = GAP_FILL_SENTENCES.filter(s => answers[s.id] === s.answer).length
  const isComplete = Object.keys(answers).length === GAP_FILL_SENTENCES.length
  const allCorrect = correctCount === GAP_FILL_SENTENCES.length

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'warning.light', color: 'warning.contrastText' }}>
        <Typography variant="h5" gutterBottom>
          Phase 3 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level A1 - Task B: Gap Fill
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Let's practice using financial words in sentences. Fill in the blanks with the correct word!"
        />
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1">
          <strong>Instructions:</strong> Choose the correct word to fill each gap.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Words to use:</strong> money, sponsor, budget, ticket
        </Typography>
      </Paper>

      {/* Gap Fill Sentences */}
      <Box sx={{ mb: 4 }}>
        {GAP_FILL_SENTENCES.map((sentence, index) => (
          <Paper key={sentence.id} elevation={2} sx={{ p: 3, mb: 2, backgroundColor: 'background.paper' }}>
            <Typography variant="body1" sx={{ mb: 2, fontSize: '1.1rem', color: 'text.primary', fontWeight: 500 }}>
              <strong>{index + 1}.</strong> {sentence.sentence.split('____')[0]}
              <FormControl sx={{ minWidth: 150, mx: 1 }}>
                <Select
                  value={answers[sentence.id] || ''}
                  onChange={(e) => handleAnswerChange(sentence.id, e.target.value)}
                  displayEmpty
                  disabled={showResults}
                  sx={{
                    backgroundColor: showResults
                      ? answers[sentence.id] === sentence.answer
                        ? 'success.lighter'
                        : 'error.lighter'
                      : 'white',
                    '& .MuiSelect-select': {
                      color: '#000000 !important',
                      fontWeight: 600
                    },
                    '& .MuiSelect-select em': {
                      color: '#555555',
                      fontWeight: 500
                    }
                  }}
                >
                  <MenuItem value="" disabled sx={{ color: '#555555' }}>
                    <em>Choose...</em>
                  </MenuItem>
                  {sentence.options.map((option) => {
                    // Disable words already used in another sentence
                    const usedElsewhere = usedWords.includes(option) && answers[sentence.id] !== option
                    return (
                      <MenuItem key={option} value={option} disabled={usedElsewhere} sx={{ color: usedElsewhere ? '#aaaaaa' : '#000000', fontWeight: 500 }}>
                        {option}{usedElsewhere ? ' (used)' : ''}
                      </MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
              {sentence.sentence.split('____')[1]}
              {showResults && answers[sentence.id] === sentence.answer && (
                <CheckCircleIcon color="success" sx={{ ml: 1, verticalAlign: 'middle' }} />
              )}
            </Typography>
            {showResults && answers[sentence.id] !== sentence.answer && (
              <Alert severity="error" sx={{ mt: 1 }}>
                Correct answer: <strong>{sentence.answer}</strong>
              </Alert>
            )}
          </Paper>
        ))}
      </Box>

      {/* Results */}
      {showResults && (
        <Alert severity={allCorrect ? "success" : "warning"} sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Results
          </Typography>
          <Typography>
            You got {correctCount} out of {GAP_FILL_SENTENCES.length} correct.
          </Typography>
          {allCorrect && (
            <Typography sx={{ mt: 1 }}>
              Excellent! You understand how to use these financial words!
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
            disabled={!isComplete}
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
            Complete A1 Tasks
          </Button>
        )}
      </Box>
    </Box>
  )
}
