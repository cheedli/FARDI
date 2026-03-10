import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Alert, CircularProgress, Chip, Stack } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 3 Step 3 - Level B2 - Task A: Structured Explanation
 * Write a paragraph explaining two costs and how they are funded
 */

export default function Phase3Step3RemedialB2TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 3, interaction: 1, context: 'remedial_b2' })
  const [response, setResponse] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [evaluation, setEvaluation] = useState(null)
  const [showResults, setShowResults] = useState(false)

  const handleSubmit = async () => {
    if (response.trim().length < 100) {
      alert('Please write a well-developed paragraph (minimum 100 characters).')
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
          level: 'B2',
          task: 'A',
          answers: { 1: response },
          prompts: { 1: "Write a paragraph explaining two costs and how they are funded, using comparison and cohesion" }
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
      const score = response.length > 150 ? 1 : 0.7
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
          level: 'B2',
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
  const hasMinimumLength = response.trim().length >= 100

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'warning.light', color: 'warning.contrastText' }}>
        <Typography variant="h5" gutterBottom>
          Phase 3 Step 3 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level B2 - Task A: Structured Explanation
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Emna"
          message="For B2 level, you need to write well-structured explanations! Write a clear paragraph that explains TWO different costs from the festival budget and describes how each one is funded. Use comparison words like 'while' or 'whereas' to show differences, and make sure your paragraph flows smoothly."
        />
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1" gutterBottom>
          <strong>Task:</strong> Write a paragraph explaining two budget costs and their funding sources.
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • Choose TWO costs (e.g., venue rental, sound equipment, catering, promotion)
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • Explain how EACH cost is funded
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • Use comparison language: while, whereas, more/less than
        </Typography>
        <Typography variant="body2">
          • Ensure good cohesion with connectors: because, so, however, in addition
        </Typography>
      </Paper>

      {/* Language Tools */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: 'success.lighter' }}>
        <Typography variant="body2" gutterBottom>
          <strong>Useful Language for B2:</strong>
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
          <Chip label="while" size="small" color="success" />
          <Chip label="whereas" size="small" color="success" />
          <Chip label="however" size="small" color="success" />
          <Chip label="in addition" size="small" color="success" />
          <Chip label="furthermore" size="small" color="success" />
          <Chip label="more expensive than" size="small" color="success" />
        </Stack>
        <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 1 }}>
          Example: "The venue rental costs $800, while the sound equipment requires $500. <strong>Whereas</strong> the venue is covered by a university grant, the sound system is funded through sponsor donations."
        </Typography>
      </Paper>

      {/* Key Points to Consider */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: 'primary.lighter' }}>
        <Typography variant="body2" gutterBottom>
          <strong>Your paragraph should include:</strong>
        </Typography>
        <Box component="ul" sx={{ pl: 3, my: 1 }}>
          <Typography component="li" variant="body2">
            Introduction of the two costs
          </Typography>
          <Typography component="li" variant="body2">
            Explanation of funding source for each
          </Typography>
          <Typography component="li" variant="body2">
            Comparison or contrast between them
          </Typography>
          <Typography component="li" variant="body2">
            Smooth transitions and logical flow
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
            rows={10}
            fullWidth
            variant="outlined"
            placeholder="Write your structured paragraph here..."
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
                Write at least 100 characters
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
              Complete B2 Task
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  )
}
