import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Alert, Card, CardContent, Grid } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 3 Step 4 - Level B1 - Task A: Budget + Justification Paragraph
 * Create a simple budget and write a justification paragraph
 */

export default function Phase3Step4RemedialB1TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 4, interaction: 1, context: 'remedial_b1' })
  const [budgetItems, setBudgetItems] = useState({
    item1: '', cost1: '',
    item2: '', cost2: '',
    item3: '', cost3: ''
  })
  const [justification, setJustification] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [evaluation, setEvaluation] = useState(null)

  const handleBudgetChange = (field, value) => {
    setBudgetItems({
      ...budgetItems,
      [field]: value
    })
  }

  const handleSubmit = () => {
    // Evaluate budget items
    const filledItems = [
      budgetItems.item1 && budgetItems.cost1,
      budgetItems.item2 && budgetItems.cost2,
      budgetItems.item3 && budgetItems.cost3
    ].filter(Boolean).length

    // Evaluate justification
    const justWords = justification.trim().split(/\s+/).length
    const justLower = justification.toLowerCase()
    const hasConnectors = /\b(because|so|since|therefore|due to)\b/.test(justLower)
    const hasFinancialVocab = /\b(cost|budget|sponsor|funding|money|expense|need)\b/.test(justLower)

    let score = 0
    let feedback = ''

    // Budget evaluation (0-3 points)
    score += filledItems

    // Justification evaluation (0-3 points)
    if (justWords >= 30 && hasConnectors && hasFinancialVocab) {
      score += 3
      feedback = "Excellent! Your budget is clear and your justification is well-explained with good vocabulary and connectors."
    } else if (justWords >= 20 && hasConnectors) {
      score += 2
      feedback = "Good! Your budget is clear. Your justification could use more financial vocabulary and detail."
    } else if (justWords >= 10) {
      score += 1
      feedback = "You created a budget and provided some justification. Try to write more (20+ words) and use connectors like 'because' or 'so'."
    } else {
      feedback = "Your budget needs a longer justification explaining why each cost is necessary."
    }

    setEvaluation({
      score: score,
      maxScore: 6,
      feedback: feedback,
      budgetScore: filledItems,
      justificationScore: score - filledItems
    })

    setShowResults(true)

    // Log to backend
    logTaskCompletion(score, 6)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      await fetch('/api/phase3/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: 'B1',
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

  const budgetComplete = budgetItems.item1 && budgetItems.cost1 &&
                         budgetItems.item2 && budgetItems.cost2 &&
                         budgetItems.item3 && budgetItems.cost3
  const justificationComplete = justification.trim().length >= 10
  const canSubmit = budgetComplete && justificationComplete

  const passThreshold = 4 // 4/6 to pass

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
        <Typography variant="h5" gutterBottom>
          Phase 3 Step 4 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level B1 - Task A: Budget + Justification
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Emna"
          message="Create a simple budget with 3 cost items, then write a paragraph explaining why these costs are necessary. Use connectors like 'because' and 'so' to make your explanation clear."
        />
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1" gutterBottom>
          <strong>Instructions:</strong>
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          1. Fill in 3 budget items with costs
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          2. Write a justification paragraph (20+ words)
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          3. Use connectors: because, so, since
        </Typography>
      </Paper>

      {/* Budget Items */}
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            Festival Budget Items
          </Typography>

          <Grid container spacing={2}>
            {[1, 2, 3].map(num => (
              <React.Fragment key={num}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label={`Cost Item ${num}`}
                    placeholder="e.g., Venue Rental, Sound System"
                    value={budgetItems[`item${num}`]}
                    onChange={(e) => handleBudgetChange(`item${num}`, e.target.value)}
                    disabled={showResults}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label={`Cost Amount`}
                    placeholder="e.g., 500 TND"
                    value={budgetItems[`cost${num}`]}
                    onChange={(e) => handleBudgetChange(`cost${num}`, e.target.value)}
                    disabled={showResults}
                  />
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Justification */}
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            Budget Justification
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Explain why these costs are necessary and how you will manage the budget.
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={5}
            placeholder="Example: We need a venue because the festival requires a large space for performances. The sound system is expensive, so we must find a sponsor. Promotion costs are necessary because we want many people to attend..."
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            disabled={showResults}
          />

          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Words: {justification.trim().split(/\s+/).filter(w => w.length > 0).length} (Need at least 20)
          </Typography>
        </CardContent>
      </Card>

      {/* Results */}
      {showResults && evaluation && (
        <Alert
          severity={evaluation.score >= passThreshold ? "success" : "warning"}
          sx={{ mb: 3 }}
        >
          <Typography variant="h6" gutterBottom>
            Task Complete!
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Total Score:</strong> {evaluation.score}/{evaluation.maxScore}
          </Typography>
          <Typography variant="body2" gutterBottom>
            • Budget Items: {evaluation.budgetScore}/3 points
          </Typography>
          <Typography variant="body2" gutterBottom>
            • Justification: {evaluation.justificationScore}/3 points
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {evaluation.feedback}
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
            disabled={!canSubmit}
          >
            Submit Budget & Justification
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
            Complete B1 Task
          </Button>
        )}
      </Box>
    </Box>
  )
}
