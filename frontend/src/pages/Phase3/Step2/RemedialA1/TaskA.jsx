import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Grid, Card, CardContent, CardActionArea, Alert } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 3 Step 2 - Level A1 - Task A: Picture Sorting
 * Sort images into "Costs" (money out) and "Money In" (income)
 */

const ITEMS = [
  { id: 1, name: 'Venue rental', type: 'cost', icon: '🏢', description: 'Pay for building' },
  { id: 2, name: 'Ticket sales', type: 'income', icon: '🎫', description: 'People buy tickets' },
  { id: 3, name: 'Food costs', type: 'cost', icon: '🍽️', description: 'Buy food' },
  { id: 4, name: 'Sponsor money', type: 'income', icon: '💼', description: 'Company gives money' },
  { id: 5, name: 'Sound equipment', type: 'cost', icon: '🔊', description: 'Pay for speakers' },
  { id: 6, name: 'Donations', type: 'income', icon: '💝', description: 'People give money' },
  { id: 7, name: 'Decoration', type: 'cost', icon: '🎨', description: 'Buy decorations' },
  { id: 8, name: 'University grant', type: 'income', icon: '🏛️', description: 'School gives money' }
]

export default function Phase3Step2RemedialA1TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 2, interaction: 1, context: 'remedial_a1' })
  const [sortedItems, setSortedItems] = useState({
    cost: [],
    income: []
  })
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const handleItemClick = (item) => {
    if (showResults) return

    // Check if item is already sorted
    const inCost = sortedItems.cost.find(i => i.id === item.id)
    const inIncome = sortedItems.income.find(i => i.id === item.id)

    if (inCost) {
      // Remove from cost
      setSortedItems({
        ...sortedItems,
        cost: sortedItems.cost.filter(i => i.id !== item.id)
      })
    } else if (inIncome) {
      // Remove from income
      setSortedItems({
        ...sortedItems,
        income: sortedItems.income.filter(i => i.id !== item.id)
      })
    }
    // Item is not sorted anywhere, do nothing (wait for drop zone click)
  }

  const handleDropZoneClick = (zone, item) => {
    if (showResults) return
    if (!item) return

    // Remove item from both zones first
    const newSorted = {
      cost: sortedItems.cost.filter(i => i.id !== item.id),
      income: sortedItems.income.filter(i => i.id !== item.id)
    }

    // Add to selected zone
    newSorted[zone].push(item)
    setSortedItems(newSorted)
  }

  const handleSubmit = () => {
    // Calculate score
    let correctCount = 0
    sortedItems.cost.forEach(item => {
      if (item.type === 'cost') correctCount++
    })
    sortedItems.income.forEach(item => {
      if (item.type === 'income') correctCount++
    })

    setScore(correctCount)
    setShowResults(true)

    // Log to backend
    logTaskCompletion(correctCount, ITEMS.length)
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
          step: 2
        })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const handleNext = () => {
    navigate('/app/dashboard')
  }

  const allItemsSorted = sortedItems.cost.length + sortedItems.income.length === ITEMS.length
  const unsortedItems = ITEMS.filter(item =>
    !sortedItems.cost.find(i => i.id === item.id) &&
    !sortedItems.income.find(i => i.id === item.id)
  )

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'warning.light', color: 'warning.contrastText' }}>
        <Typography variant="h5" gutterBottom>
          Phase 3 Step 2 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level A1 - Task A: Picture Sorting
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Let's practice sorting budget items! Look at each item and decide: Does it COST money (money goes out) or does it bring MONEY IN? Click an item, then click the box where it belongs."
        />
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1" gutterBottom>
          <strong>Instructions:</strong>
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • <strong>COSTS:</strong> Things that need money to be paid (money goes OUT)
        </Typography>
        <Typography variant="body2">
          • <strong>MONEY IN:</strong> Things that bring money (money comes IN)
        </Typography>
      </Paper>

      {/* Items to Sort */}
      {unsortedItems.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Items to Sort ({unsortedItems.length} remaining)
          </Typography>
          <Grid container spacing={2}>
            {unsortedItems.map(item => (
              <Grid item xs={6} sm={4} md={3} key={item.id}>
                <Card
                  elevation={3}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { transform: 'scale(1.05)', boxShadow: 6 },
                    transition: 'all 0.2s'
                  }}
                >
                  <CardActionArea>
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <Typography variant="h1" sx={{ fontSize: '3rem', mb: 1 }}>
                        {item.icon}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {item.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Sorting Zones */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Costs Zone */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              minHeight: 300,
              backgroundColor: 'error.lighter',
              border: 3,
              borderColor: 'error.main',
              borderStyle: 'dashed'
            }}
          >
            <Typography variant="h5" gutterBottom color="error.main" textAlign="center">
              💸 COSTS (Money Out)
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 2 }}>
              Things that cost money
            </Typography>

            <Grid container spacing={1}>
              {sortedItems.cost.map(item => {
                const isCorrect = showResults && item.type === 'cost'
                const isIncorrect = showResults && item.type !== 'cost'

                return (
                  <Grid item xs={6} key={item.id}>
                    <Card
                      elevation={2}
                      sx={{
                        cursor: showResults ? 'default' : 'pointer',
                        backgroundColor: showResults
                          ? isCorrect
                            ? 'success.lighter'
                            : 'error.lighter'
                          : 'white',
                        border: showResults ? 2 : 0,
                        borderColor: showResults
                          ? isCorrect
                            ? 'success.main'
                            : 'error.main'
                          : 'transparent'
                      }}
                      onClick={() => handleItemClick(item)}
                    >
                      <CardContent sx={{ textAlign: 'center', py: 2 }}>
                        <Typography variant="h2" sx={{ fontSize: '2rem' }}>
                          {item.icon}
                        </Typography>
                        <Typography variant="caption" display="block">
                          {item.name}
                        </Typography>
                        {showResults && isIncorrect && (
                          <Typography variant="caption" color="error" display="block">
                            ✗ Wrong
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                )
              })}
            </Grid>

            {/* Click target when no items */}
            {sortedItems.cost.length === 0 && !showResults && (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 4,
                  color: 'text.secondary',
                  fontStyle: 'italic'
                }}
              >
                Click items above, then click here to add them
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Income Zone */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              minHeight: 300,
              backgroundColor: 'success.lighter',
              border: 3,
              borderColor: 'success.main',
              borderStyle: 'dashed'
            }}
          >
            <Typography variant="h5" gutterBottom color="success.main" textAlign="center">
              💰 MONEY IN (Income)
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 2 }}>
              Things that bring money
            </Typography>

            <Grid container spacing={1}>
              {sortedItems.income.map(item => {
                const isCorrect = showResults && item.type === 'income'
                const isIncorrect = showResults && item.type !== 'income'

                return (
                  <Grid item xs={6} key={item.id}>
                    <Card
                      elevation={2}
                      sx={{
                        cursor: showResults ? 'default' : 'pointer',
                        backgroundColor: showResults
                          ? isCorrect
                            ? 'success.lighter'
                            : 'error.lighter'
                          : 'white',
                        border: showResults ? 2 : 0,
                        borderColor: showResults
                          ? isCorrect
                            ? 'success.main'
                            : 'error.main'
                          : 'transparent'
                      }}
                      onClick={() => handleItemClick(item)}
                    >
                      <CardContent sx={{ textAlign: 'center', py: 2 }}>
                        <Typography variant="h2" sx={{ fontSize: '2rem' }}>
                          {item.icon}
                        </Typography>
                        <Typography variant="caption" display="block">
                          {item.name}
                        </Typography>
                        {showResults && isIncorrect && (
                          <Typography variant="caption" color="error" display="block">
                            ✗ Wrong
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                )
              })}
            </Grid>

            {/* Click target when no items */}
            {sortedItems.income.length === 0 && !showResults && (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 4,
                  color: 'text.secondary',
                  fontStyle: 'italic'
                }}
              >
                Click items above, then click here to add them
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Helper: Click-based sorting */}
      {!showResults && unsortedItems.length < ITEMS.length && (
        <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
          <Typography variant="body2" textAlign="center">
            <strong>Tip:</strong> Click an item in the boxes above to remove it and sort it again
          </Typography>
        </Paper>
      )}

      {/* Drag and drop alternative using buttons */}
      {!showResults && unsortedItems.length > 0 && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Quick Sort
          </Typography>
          <Grid container spacing={2}>
            {unsortedItems.map(item => (
              <Grid item xs={12} sm={6} key={item.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h3" sx={{ fontSize: '2rem' }}>
                    {item.icon}
                  </Typography>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      {item.name}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDropZoneClick('cost', item)}
                  >
                    COST
                  </Button>
                  <Button
                    variant="outlined"
                    color="success"
                    size="small"
                    onClick={() => handleDropZoneClick('income', item)}
                  >
                    INCOME
                  </Button>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Results */}
      {showResults && (
        <Alert severity={score === ITEMS.length ? "success" : "warning"} sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Results
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Score:</strong> {score}/{ITEMS.length} correct
          </Typography>
          <Typography>
            {score === ITEMS.length
              ? "Perfect! You sorted all items correctly!"
              : "Good try! Look at the items marked wrong and learn the difference between costs and income."}
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
            disabled={!allItemsSorted}
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
            Complete A1 Task
          </Button>
        )}
      </Box>
    </Box>
  )
}
