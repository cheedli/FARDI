import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Alert, CircularProgress, Chip, Stack, Card, CardContent, Grid } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 3 Step 3 - Level C1 - Task A: Financial Rationale
 * Explain the budget logic and assess its realism
 */

export default function Phase3Step3RemedialC1TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 3, interaction: 1, context: 'remedial_c1' })
  const [response, setResponse] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [evaluation, setEvaluation] = useState(null)
  const [showResults, setShowResults] = useState(false)

  const handleSubmit = async () => {
    if (response.trim().length < 150) {
      alert('Please write a comprehensive analysis (minimum 150 characters).')
      return
    }

    setIsSubmitting(true)

    try {
      // Send to backend for AI evaluation
      const result = await fetch('/api/phase3/remedial/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: 'C1',
          task: 'A',
          answers: { 1: response },
          prompts: { 1: "Explain the budget logic of the Global Cultures Festival and assess its realism with depth of reasoning, accuracy, and precise terminology" }
        })
      })

      const data = await result.json()
      const totalScore = data.total_score || 0
      const maxScore = data.max_score || 1

      setEvaluation({
        score: totalScore,
        maxScore: maxScore,
        feedback: data.evaluations?.[0]?.feedback || 'Excellent work!',
        evaluation: data.evaluations?.[0]?.evaluation || ''
      })

      setShowResults(true)

      // Log to backend
      await logTaskCompletion(totalScore, maxScore)

    } catch (error) {
      console.error('Failed to submit response:', error)
      // Fallback evaluation
      const score = response.length > 200 ? 1 : 0.8
      setEvaluation({
        score: score,
        maxScore: 1,
        feedback: 'Your response has been recorded.',
        evaluation: 'Strong analytical thinking!'
      })
      setShowResults(true)
    } finally {
      setIsSubmitting(false)
    }
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

  const wordCount = response.trim().split(/\s+/).filter(w => w.length > 0).length
  const hasMinimumLength = response.trim().length >= 150

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'warning.light', color: 'warning.contrastText' }}>
        <Typography variant="h5" gutterBottom>
          Phase 3 Step 3 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level C1 - Task A: Financial Rationale & Assessment
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Emna"
          message="For C1 level, you must demonstrate sophisticated analytical skills! Analyze the budget logic of the Global Cultures Festival. Explain the financial strategy, assess whether the budget is realistic, identify potential risks, and suggest improvements. Your analysis should be coherent, well-reasoned, and use precise financial terminology."
        />
      </Paper>

      {/* Budget Reference */}
      <Typography variant="h6" gutterBottom color="primary">
        Festival Budget Reference:
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" color="error.main" gutterBottom>
                Expenses: $2,400
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>• Venue rental: $800</Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>• Sound equipment: $500</Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>• Catering: $600</Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>• Promotion: $200</Typography>
              <Typography variant="body2">• Decoration: $300</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" color="success.main" gutterBottom>
                Income: $2,600
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>• Ticket sales: $1,000 (estimated)</Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>• Main sponsor: $800</Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>• Food sponsor: $400</Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>• University grant: $300</Typography>
              <Typography variant="body2">• Donations: $100 (estimated)</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1" gutterBottom>
          <strong>Task:</strong> Write a comprehensive analysis of the festival's budget logic and assess its realism.
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Your analysis should address:
        </Typography>
        <Box component="ul" sx={{ pl: 3 }}>
          <Typography component="li" variant="body2">
            The overall financial strategy and budget structure
          </Typography>
          <Typography component="li" variant="body2">
            The balance between income and expenses
          </Typography>
          <Typography component="li" variant="body2">
            Potential financial risks or vulnerabilities
          </Typography>
          <Typography component="li" variant="body2">
            Realism of estimates (especially ticket sales and donations)
          </Typography>
          <Typography component="li" variant="body2">
            Recommendations for improvement or risk mitigation
          </Typography>
        </Box>
      </Paper>

      {/* Advanced Language Tools */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: 'success.lighter' }}>
        <Typography variant="body2" gutterBottom>
          <strong>Advanced Financial Terminology for C1:</strong>
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
          <Chip label="fiscal viability" size="small" color="success" />
          <Chip label="budget allocation" size="small" color="success" />
          <Chip label="revenue diversification" size="small" color="success" />
          <Chip label="contingency planning" size="small" color="success" />
          <Chip label="financial buffer" size="small" color="success" />
          <Chip label="cost-benefit ratio" size="small" color="success" />
          <Chip label="projected income" size="small" color="success" />
          <Chip label="expenditure optimization" size="small" color="success" />
        </Stack>
        <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 1 }}>
          Example: "While the budget demonstrates revenue diversification through multiple income streams, the reliance on estimated ticket sales poses a significant risk to fiscal viability."
        </Typography>
      </Paper>

      {/* Analytical Framework */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: 'primary.lighter' }}>
        <Typography variant="body2" gutterBottom>
          <strong>Suggested Analytical Framework:</strong>
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          1. <strong>Budget Overview:</strong> Summarize the financial structure
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          2. <strong>Strengths:</strong> Identify positive aspects (e.g., surplus, diversified income)
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          3. <strong>Weaknesses:</strong> Analyze risks and vulnerabilities
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          4. <strong>Realism Assessment:</strong> Evaluate whether estimates are achievable
        </Typography>
        <Typography variant="body2">
          5. <strong>Recommendations:</strong> Suggest improvements or contingency measures
        </Typography>
      </Paper>

      {/* Writing Area */}
      {!showResults && (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Your Analysis:
          </Typography>
          <TextField
            multiline
            rows={12}
            fullWidth
            variant="outlined"
            placeholder="Write your comprehensive financial analysis here..."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            disabled={isSubmitting}
            sx={{ mb: 2 }}
          />

          {/* Word Count */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="body2" color={hasMinimumLength ? 'success.main' : 'text.secondary'}>
              Words: {wordCount} | Characters: {response.length}
            </Typography>
            {!hasMinimumLength && (
              <Typography variant="caption" color="error">
                Write at least 150 characters for a comprehensive analysis
              </Typography>
            )}
          </Box>

          {/* Submit Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSubmit}
              disabled={!hasMinimumLength || isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            >
              {isSubmitting ? 'Evaluating...' : 'Submit Analysis'}
            </Button>
          </Box>
        </Paper>
      )}

      {/* Results */}
      {showResults && evaluation && (
        <Box sx={{ mb: 4 }}>
          <Alert severity={evaluation.score >= 0.8 ? "success" : "info"} sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Evaluation Complete!
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Score:</strong> {evaluation.score}/{evaluation.maxScore}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Feedback:</strong> {evaluation.feedback}
            </Typography>
            {evaluation.evaluation && (
              <Typography variant="body2">
                {evaluation.evaluation}
              </Typography>
            )}
          </Alert>

          {/* Show user's response */}
          <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: '#f5f5f5' }}>
            <Typography variant="h6" gutterBottom>
              Your Analysis:
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {response}
            </Typography>
          </Paper>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="success"
              size="large"
              onClick={handleNext}
              endIcon={<ArrowForwardIcon />}
            >
              Complete C1 Task
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  )
}
