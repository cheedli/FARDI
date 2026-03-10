import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Alert, CircularProgress } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 3 Step 3 - Level B1 - Task A: Short Justification
 * Explain why the event needs sponsors in 5 sentences
 */

export default function Phase3Step3RemedialB1TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 3, interaction: 1, context: 'remedial_b1' })
  const [response, setResponse] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [evaluation, setEvaluation] = useState(null)
  const [showResults, setShowResults] = useState(false)

  const handleSubmit = async () => {
    if (response.trim().length < 50) {
      alert('Please write at least 5 sentences (minimum 50 characters).')
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
          level: 'B1',
          task: 'A',
          answers: { 1: response },
          prompts: { 1: "Explain why the event needs sponsors in 5 sentences" }
        })
      })

      const data = await result.json()
      const totalScore = data.total_score || 0
      const maxScore = data.max_score || 1

      setEvaluation({
        score: totalScore,
        maxScore: maxScore,
        feedback: data.evaluations?.[0]?.feedback || 'Good work!',
        evaluation: data.evaluations?.[0]?.evaluation || ''
      })

      setShowResults(true)

      // Log to backend
      await logTaskCompletion(totalScore, maxScore)

    } catch (error) {
      console.error('Failed to submit response:', error)
      // Fallback evaluation
      const score = response.length > 100 ? 1 : 0.5
      setEvaluation({
        score: score,
        maxScore: 1,
        feedback: 'Your response has been recorded.',
        evaluation: 'Good effort!'
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
          level: 'B1',
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

  const sentenceCount = response.trim().split(/[.!?]+/).filter(s => s.trim().length > 0).length
  const hasMinimumLength = response.trim().length >= 50

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'warning.light', color: 'warning.contrastText' }}>
        <Typography variant="h5" gutterBottom>
          Phase 3 Step 3 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level B1 - Task A: Short Justification
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Emna"
          message="For B1 level, you need to write clear justifications! Explain why the Global Cultures Festival needs sponsors. Write about 5 sentences using connectors like 'because' and 'so' to show cause-effect relationships."
        />
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1" gutterBottom>
          <strong>Task:</strong> Explain why the event needs sponsors in approximately 5 sentences.
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • Explain the reasons clearly
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • Use connectors: because, so, due to
        </Typography>
        <Typography variant="body2">
          • Make sure your explanation is logical and well-structured
        </Typography>
      </Paper>

      {/* Key Points to Consider */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: 'success.lighter' }}>
        <Typography variant="body2" gutterBottom>
          <strong>Consider these points in your answer:</strong>
        </Typography>
        <Box component="ul" sx={{ pl: 3, my: 1 }}>
          <Typography component="li" variant="body2">
            What costs does the festival have?
          </Typography>
          <Typography component="li" variant="body2">
            Why can't ticket sales cover all costs?
          </Typography>
          <Typography component="li" variant="body2">
            What do sponsors provide?
          </Typography>
          <Typography component="li" variant="body2">
            How does sponsorship help the event succeed?
          </Typography>
        </Box>
      </Paper>

      {/* Writing Area */}
      {!showResults && (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Your Answer:
          </Typography>
          <TextField
            multiline
            rows={8}
            fullWidth
            variant="outlined"
            placeholder="Write your explanation here (approximately 5 sentences)..."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            disabled={isSubmitting}
            sx={{ mb: 2 }}
          />

          {/* Character Count */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="body2" color={hasMinimumLength ? 'success.main' : 'text.secondary'}>
              Sentences: ~{sentenceCount} | Characters: {response.length}
            </Typography>
            {!hasMinimumLength && (
              <Typography variant="caption" color="error">
                Write at least 50 characters
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
              {isSubmitting ? 'Evaluating...' : 'Submit Answer'}
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
              Your Response:
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
              Complete B1 Task
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  )
}
