import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Alert, Card, CardContent, Grid } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 3 Step 4 - Level A1 - Task A: Fill-in Budget Template
 * Simple budget template with basic cost words + sponsor
 */

const BUDGET_TEMPLATE = [
  { id: 'venue', label: 'Venue', placeholder: 'Cost for venue' },
  { id: 'sound', label: 'Sound', placeholder: 'Cost for sound' },
  { id: 'food', label: 'Food', placeholder: 'Cost for food' },
  { id: 'sponsor', label: 'Sponsor', placeholder: 'Money from sponsor' }
]

export default function Phase3Step4RemedialA1TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 4, interaction: 1, context: 'remedial_a1' })
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerChange = (id, value) => {
    setAnswers({
      ...answers,
      [id]: value
    })
  }

  const handleSubmit = () => {
    // Calculate score - award 1 point for each filled item (any reasonable text)
    let correctCount = 0
    BUDGET_TEMPLATE.forEach(item => {
      const answer = answers[item.id]?.trim()
      if (answer && answer.length >= 2) {
        correctCount++
      }
    })

    setScore(correctCount)
    setShowResults(true)

    // Log to backend
    logTaskCompletion(correctCount, BUDGET_TEMPLATE.length)
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
          step: 4
        })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const handleNext = () => {
    navigate('/app/dashboard')
  }

  const allAnswered = BUDGET_TEMPLATE.every(item => answers[item.id]?.trim()?.length >= 2)
  const passThreshold = 3 // 3/4 to pass

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'info.light', color: 'info.contrastText' }}>
        <Typography variant="h5" gutterBottom>
          Phase 3 Step 4 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level A1 - Task A: Fill-in Budget Template
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Emna"
          message="Let's create a very simple budget! Fill in the template below with costs and funding. You can use simple words or numbers like '100 TND' or 'money for stage'."
        />
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1" gutterBottom>
          <strong>Instructions:</strong> Complete each line of the budget template.
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • Write a cost or amount for each item
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • Use simple words: "100", "200 TND", "money for..."
        </Typography>
        <Typography variant="body2">
          <strong>Passing score:</strong> Minimum 3/4 items filled
        </Typography>
      </Paper>

      {/* Budget Template */}
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            Festival Budget Template
          </Typography>

          <Grid container spacing={2}>
            {BUDGET_TEMPLATE.map((item, index) => (
              <Grid item xs={12} key={item.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1" sx={{ minWidth: 120, fontWeight: 'bold' }}>
                    {item.label}:
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder={item.placeholder}
                    value={answers[item.id] || ''}
                    onChange={(e) => handleAnswerChange(item.id, e.target.value)}
                    disabled={showResults}
                    sx={{
                      backgroundColor: showResults
                        ? answers[item.id]?.trim()?.length >= 2
                          ? 'success.lighter'
                          : 'error.lighter'
                        : 'white',
                      '& .MuiInputBase-input': {
                        color: '#000'
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: '#666',
                        opacity: 1
                      }
                    }}
                  />
                </Box>

                {/* Show results */}
                {showResults && (
                  <Alert severity={answers[item.id]?.trim()?.length >= 2 ? "success" : "warning"} sx={{ mt: 1, mb: 2 }}>
                    <Typography variant="body2">
                      {answers[item.id]?.trim()?.length >= 2 ? (
                        <>✓ Good! You wrote: <strong>{answers[item.id]}</strong></>
                      ) : (
                        <>⚠ You need to fill in this item. Example: "100 TND" or "money from company"</>
                      )}
                    </Typography>
                  </Alert>
                )}
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

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
            <strong>Score:</strong> {score}/{BUDGET_TEMPLATE.length}
          </Typography>
          <Typography>
            {score === BUDGET_TEMPLATE.length
              ? "Perfect! You filled in all items!"
              : score >= passThreshold
                ? `Good job! You passed with ${score} items filled.`
                : `You need ${passThreshold} items filled to pass. Try filling in all the blanks.`}
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
            disabled={!allAnswered}
          >
            Submit Budget
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
