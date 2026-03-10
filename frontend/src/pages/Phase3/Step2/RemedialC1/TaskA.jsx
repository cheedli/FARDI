import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Alert, Card, CardContent } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 3 Step 2 - Level C1 - Task A: Budget Evaluation
 * Critique a weak budget and suggest improvements
 */

const WEAK_BUDGET = {
  title: "University Cultural Festival Budget",
  expenses: [
    { item: "Venue", amount: "$1,500" },
    { item: "Equipment", amount: "$800" },
    { item: "Food", amount: "$1,200" },
    { item: "Miscellaneous", amount: "$500" }
  ],
  income: [
    { source: "Ticket sales", amount: "$2,000" },
    { source: "Maybe sponsors", amount: "$1,000" }
  ],
  totalExpenses: "$4,000",
  totalIncome: "$3,000",
  problems: [
    "Relies heavily on optimistic ticket sales",
    "Sponsorship is uncertain ('maybe')",
    "No contingency fund",
    "Miscellaneous expenses are vague",
    "Budget shows a deficit of $1,000"
  ]
}

export default function Phase3Step2RemedialC1TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 2, interaction: 1, context: 'remedial_c1' })
  const [critique, setCritique] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [sentenceCount, setSentenceCount] = useState(0)

  const handleTextChange = (e) => {
    const text = e.target.value
    setCritique(text)
    const words = text.trim().split(/\s+/).filter(w => w.length > 0)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    setWordCount(words.length)
    setSentenceCount(sentences.length)
  }

  const handleSubmit = () => {
    setShowResults(true)
    logTaskCompletion(Math.min(sentenceCount, 10), 10)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      await fetch('/api/phase3/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: 'C1',
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

  const isComplete = wordCount >= 150 && sentenceCount >= 8

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'warning.light', color: 'warning.contrastText' }}>
        <Typography variant="h5" gutterBottom>
          Phase 3 Step 2 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level C1 - Task A: Budget Evaluation
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="This is an advanced critical task! Review the budget below and write a comprehensive critique. Identify problems, analyze their implications, and suggest specific improvements using precise financial terminology."
        />
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1" gutterBottom>
          <strong>Instructions:</strong> Critique the weak budget below and suggest improvements (8-10 sentences).
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>What to analyze:</strong>
        </Typography>
        <Box component="ul" sx={{ mt: 1, pl: 3 }}>
          <Typography component="li" variant="body2">
            Identify specific weaknesses and problems
          </Typography>
          <Typography component="li" variant="body2">
            Analyze the implications of these problems
          </Typography>
          <Typography component="li" variant="body2">
            Suggest concrete improvements
          </Typography>
          <Typography component="li" variant="body2">
            Use precise financial terminology
          </Typography>
          <Typography component="li" variant="body2">
            Consider sustainability and risk management
          </Typography>
        </Box>
      </Paper>

      {/* Weak Budget Display */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: 'error.lighter' }}>
        <Typography variant="h6" gutterBottom color="error.main">
          Budget to Evaluate (Contains Problems!)
        </Typography>

        <Card elevation={2} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {WEAK_BUDGET.title}
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" color="error.main" gutterBottom>
                Expenses:
              </Typography>
              {WEAK_BUDGET.expenses.map((expense, index) => (
                <Typography key={index} variant="body2" sx={{ ml: 2 }}>
                  • {expense.item}: {expense.amount}
                </Typography>
              ))}
              <Typography variant="body2" fontWeight="bold" sx={{ ml: 2, mt: 1 }}>
                Total: {WEAK_BUDGET.totalExpenses}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle1" color="success.main" gutterBottom>
                Income:
              </Typography>
              {WEAK_BUDGET.income.map((income, index) => (
                <Typography key={index} variant="body2" sx={{ ml: 2 }}>
                  • {income.source}: {income.amount}
                </Typography>
              ))}
              <Typography variant="body2" fontWeight="bold" sx={{ ml: 2, mt: 1 }}>
                Total: {WEAK_BUDGET.totalIncome}
              </Typography>
            </Box>

            <Alert severity="error" sx={{ mt: 2 }}>
              <Typography variant="body2" fontWeight="bold">
                DEFICIT: $1,000 (Expenses exceed income!)
              </Typography>
            </Alert>
          </CardContent>
        </Card>

        <Typography variant="caption" color="text.secondary">
          Hint: Look for problems with realism, specificity, risk management, and financial balance.
        </Typography>
      </Paper>

      {/* Writing Area */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Your Budget Critique & Improvements
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={15}
          value={critique}
          onChange={handleTextChange}
          placeholder="Write your critique here... Analyze the budget's weaknesses, explain the implications of these problems, and suggest specific improvements. Use precise financial terminology."
          variant="outlined"
          disabled={showResults}
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Words: {wordCount} | Sentences: {sentenceCount} | Target: 8-10 sentences (approx. 150-200 words)
          </Typography>
          {isComplete && !showResults && (
            <Typography variant="caption" color="success.main" sx={{ fontWeight: 'bold' }}>
              ✓ Ready to submit!
            </Typography>
          )}
        </Box>
      </Paper>

      {/* Results */}
      {showResults && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Outstanding Critical Analysis!
          </Typography>
          <Typography>
            You wrote {sentenceCount} sentences with {wordCount} words. Your critique demonstrates advanced analytical skills, sophisticated use of financial terminology, and strategic thinking about budget management.
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
            disabled={!isComplete}
          >
            Submit Critique
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
            Complete C1 Task
          </Button>
        )}
      </Box>
    </Box>
  )
}
