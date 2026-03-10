import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Grid, Card, CardContent, CardActionArea, Alert, Chip } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 3 Step 2 - Interaction 1: Budget Observation
 * Guided Noticing: Circle items that cost money and underline items that bring money
 */

const BUDGET_ITEMS = [
  { id: 1, name: 'Venue rental', type: 'cost', amount: '$800', icon: '🏢' },
  { id: 2, name: 'Ticket sales', type: 'income', amount: '$1,000', icon: '🎫' },
  { id: 3, name: 'Sound equipment', type: 'cost', amount: '$500', icon: '🔊' },
  { id: 4, name: 'Sponsor donation (TechCorp)', type: 'income', amount: '$800', icon: '💼' },
  { id: 5, name: 'Catering', type: 'cost', amount: '$600', icon: '🍽️' },
  { id: 6, name: 'University grant', type: 'income', amount: '$300', icon: '🏛️' },
  { id: 7, name: 'Promotion & printing', type: 'cost', amount: '$200', icon: '📄' },
  { id: 8, name: 'Food sponsor (CaféPlus)', type: 'income', amount: '$400', icon: '☕' },
  { id: 9, name: 'Decoration', type: 'cost', amount: '$300', icon: '🎨' },
  { id: 10, name: 'Donations', type: 'income', amount: '$100', icon: '💝' }
]

export default function Phase3Step2Interaction1() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 2, interaction: 1, context: 'main' })
  const [selections, setSelections] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const handleItemClick = (itemId, selectedType) => {
    if (showResults) return

    // Toggle selection or change selection
    if (selections[itemId] === selectedType) {
      // Remove selection
      const newSelections = { ...selections }
      delete newSelections[itemId]
      setSelections(newSelections)
    } else {
      // Add or change selection
      setSelections({
        ...selections,
        [itemId]: selectedType
      })
    }
  }

  const handleSubmit = () => {
    // Calculate score
    let correctCount = 0
    BUDGET_ITEMS.forEach(item => {
      if (selections[item.id] === item.type) {
        correctCount++
      }
    })

    setScore(correctCount)
    setShowResults(true)

    // Store result
    sessionStorage.setItem('phase3_step2_int1_score', correctCount.toString())
    sessionStorage.setItem('phase3_step2_int1_max', BUDGET_ITEMS.length.toString())

    // Log to backend
    logTaskCompletion(correctCount, BUDGET_ITEMS.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction1', is_correct: true, score: score })
    try {
      await fetch('/api/phase3/interaction/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          step: 2,
          interaction: 1,
          score: score,
          max_score: maxScore,
          time_taken: 0,
          completed: true
        })
      })
    } catch (error) {
      console.error('Failed to log interaction:', error)
    }
  }

  const handleContinue = () => {
    navigate('/app/phase3/step/2/interaction/2')
  }

  const allItemsLabeled = Object.keys(selections).length === BUDGET_ITEMS.length

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'info.light', color: 'info.contrastText' }}>
        <Typography variant="h4" gutterBottom>
          Phase 3 Step 2: Explore
        </Typography>
        <Typography variant="h5" gutterBottom>
          Interaction 1: Budget Observation
        </Typography>
        <Typography variant="body1">
          Identify which items cost money and which items bring money
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Look at the budget table below. For each item, identify whether it costs money (expense) or brings money (income). Click 'COST' for items that require spending, and 'INCOME' for items that bring money to the event."
        />
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'warning.lighter' }}>
        <Typography variant="body1" gutterBottom>
          <strong>Instructions:</strong>
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • Look at each budget item below
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • Click <strong>COST</strong> if the item requires money to be spent
        </Typography>
        <Typography variant="body2">
          • Click <strong>INCOME</strong> if the item brings money to the event
        </Typography>
      </Paper>

      {/* Score Display */}
      {!showResults && (
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="primary">
            Items Labeled: {Object.keys(selections).length}/{BUDGET_ITEMS.length}
          </Typography>
        </Box>
      )}

      {/* Budget Items Grid */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {BUDGET_ITEMS.map(item => {
          const userSelection = selections[item.id]
          const isCorrect = showResults && userSelection === item.type
          const isIncorrect = showResults && userSelection && userSelection !== item.type

          return (
            <Grid item xs={12} sm={6} key={item.id}>
              <Card
                elevation={3}
                sx={{
                  border: showResults
                    ? isCorrect
                      ? 3
                      : isIncorrect
                        ? 3
                        : 1
                    : userSelection
                      ? 2
                      : 1,
                  borderColor: showResults
                    ? isCorrect
                      ? 'success.main'
                      : isIncorrect
                        ? 'error.main'
                        : 'grey.300'
                    : userSelection
                      ? 'primary.main'
                      : 'grey.300',
                  backgroundColor: showResults
                    ? isCorrect
                      ? 'success.lighter'
                      : isIncorrect
                        ? 'error.lighter'
                        : 'white'
                    : 'white'
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h4">{item.icon}</Typography>
                      <Box>
                        <Typography variant="h6">{item.name}</Typography>
                        <Typography variant="body1" color="text.secondary" fontWeight="bold">
                          {item.amount}
                        </Typography>
                      </Box>
                    </Box>
                    {showResults && isCorrect && <CheckCircleIcon color="success" fontSize="large" />}
                    {showResults && isIncorrect && <RemoveCircleIcon color="error" fontSize="large" />}
                  </Box>

                  {/* Selection Buttons */}
                  {!showResults && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant={userSelection === 'cost' ? 'contained' : 'outlined'}
                        color="error"
                        fullWidth
                        onClick={() => handleItemClick(item.id, 'cost')}
                        size="small"
                      >
                        COST
                      </Button>
                      <Button
                        variant={userSelection === 'income' ? 'contained' : 'outlined'}
                        color="success"
                        fullWidth
                        onClick={() => handleItemClick(item.id, 'income')}
                        size="small"
                      >
                        INCOME
                      </Button>
                    </Box>
                  )}

                  {/* Show correct answer if wrong */}
                  {showResults && userSelection !== item.type && (
                    <Alert severity="info" sx={{ mt: 1 }}>
                      <Typography variant="caption">
                        <strong>Correct:</strong> {item.type === 'cost' ? 'COST' : 'INCOME'}
                      </Typography>
                    </Alert>
                  )}

                  {/* Show user's selection */}
                  {showResults && userSelection && (
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={`You selected: ${userSelection === 'cost' ? 'COST' : 'INCOME'}`}
                        size="small"
                        color={isCorrect ? 'success' : 'error'}
                      />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      {/* Results */}
      {showResults && (
        <Alert severity={score === BUDGET_ITEMS.length ? "success" : score >= 8 ? "info" : "warning"} sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Results
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Score:</strong> {score}/{BUDGET_ITEMS.length} correct
          </Typography>
          <Typography>
            {score === BUDGET_ITEMS.length
              ? "Perfect! You correctly identified all budget items!"
              : score >= 8
                ? "Great job! You understand the difference between costs and income."
                : "Good try! Remember: costs are money spent, income is money received."}
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
            disabled={!allItemsLabeled}
          >
            Submit Answers
          </Button>
        )}
        {showResults && (
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={handleContinue}
            endIcon={<ArrowForwardIcon />}
          >
            Continue to Next Activity
          </Button>
        )}
      </Box>
    </Box>
  )
}
