import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Alert, Card, CardContent } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 3 Step 4 - Level B2 - Task A: Revised Pitch with Feedback
 * Write a sponsor pitch, then revise it based on guided feedback
 */

export default function Phase3Step4RemedialB2TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 4, interaction: 1, context: 'remedial_b2' })
  const [firstDraft, setFirstDraft] = useState('')
  const [revision, setRevision] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [evaluation, setEvaluation] = useState(null)

  const handleSubmitFirstDraft = () => {
    setShowFeedback(true)
  }

  const handleSubmitRevision = () => {
    // Evaluate revision
    const revisionWords = revision.trim().split(/\s+/).length
    const revisionLower = revision.toLowerCase()

    // Check for persuasive elements
    const hasComparison = /\b(unlike|compared to|different|unique|special|better than)\b/.test(revisionLower)
    const hasEmphasis = /\b(excellent|perfect|ideal|great|amazing|outstanding)\b/.test(revisionLower)
    const hasBenefits = /\b(visibility|brand|image|logo|promotion|exposure)\b/.test(revisionLower)
    const hasValues = /\b(diversity|culture|values|mission|align|support)\b/.test(revisionLower)
    const hasCallToAction = /\b(please|join|partner|consider|invite|collaborate)\b/.test(revisionLower)

    let score = 0
    let feedback = ''

    // Award points for different persuasive elements
    if (revisionWords >= 40) score += 2
    else if (revisionWords >= 25) score += 1

    if (hasComparison) score += 1
    if (hasEmphasis) score += 1
    if (hasBenefits && hasValues) score += 2
    else if (hasBenefits || hasValues) score += 1
    if (hasCallToAction) score += 1

    if (score >= 6) {
      feedback = "Excellent! Your revised pitch is persuasive, well-structured, and includes comparison, benefits, and a call to action. Very professional!"
    } else if (score >= 4) {
      feedback = "Good revision! Your pitch is more persuasive. Consider adding more comparison or emphasis to make it even stronger."
    } else {
      feedback = "Your revision shows improvement. Try to add more persuasive elements: comparison ('unlike other events'), emphasis ('perfect opportunity'), and clear benefits."
    }

    setEvaluation({
      score: score,
      maxScore: 8,
      feedback: feedback
    })

    setShowResults(true)

    // Log to backend
    logTaskCompletion(score, 8)
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

  const passThreshold = 5 // 5/8 to pass

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'secondary.light', color: 'secondary.contrastText' }}>
        <Typography variant="h5" gutterBottom>
          Phase 3 Step 4 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level B2 - Task A: Revised Sponsor Pitch
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Let's create a persuasive sponsor pitch! First, write a draft. Then, I'll give you feedback and you'll revise it to make it more convincing using persuasion strategies."
        />
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1" gutterBottom>
          <strong>Instructions:</strong>
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          1. Write a first draft of your sponsor pitch (20+ words)
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          2. Review the feedback about persuasion strategies
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          3. Revise your pitch using persuasive language
        </Typography>
      </Paper>

      {/* First Draft */}
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            First Draft - Sponsor Pitch
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Write your initial sponsor pitch for the Global Cultures Festival.
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={6}
            placeholder="Dear [Company Name], we are organizing the Global Cultures Festival and would like to invite you to be our sponsor. We need funding because..."
            value={firstDraft}
            onChange={(e) => setFirstDraft(e.target.value)}
            disabled={showFeedback}
          />

          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Words: {firstDraft.trim().split(/\s+/).filter(w => w.length > 0).length}
          </Typography>

          {!showFeedback && (
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={handleSubmitFirstDraft}
              disabled={firstDraft.trim().split(/\s+/).length < 20}
            >
              Submit Draft for Feedback
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Feedback */}
      {showFeedback && !showResults && (
        <Card elevation={3} sx={{ mb: 3, backgroundColor: 'warning.lighter' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="warning.dark">
              Feedback: Persuasion Strategies
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              To make your pitch more persuasive, consider adding:
            </Typography>

            <Box component="ul" sx={{ pl: 3 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                <strong>Comparison:</strong> "Unlike other events, our festival..."
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                <strong>Emphasis:</strong> Use words like "perfect," "ideal," "excellent opportunity"
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                <strong>Clear Benefits:</strong> Visibility, brand image, logo placement, values alignment
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                <strong>Values Alignment:</strong> Connect sponsor's values to festival mission
              </Typography>
              <Typography component="li" variant="body2">
                <strong>Call to Action:</strong> "We invite you to partner with us," "Please consider supporting"
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Revision */}
      {showFeedback && !showResults && (
        <Card elevation={3} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="success.main">
              Revised Pitch - Apply Feedback
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Revise your pitch using the persuasion strategies above.
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={8}
              placeholder="Use your first draft and improve it with persuasive language. Add comparison, emphasis, clear benefits, and a call to action..."
              value={revision}
              onChange={(e) => setRevision(e.target.value)}
            />

            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Words: {revision.trim().split(/\s+/).filter(w => w.length > 0).length} (Aim for 40+ words)
            </Typography>

            <Button
              variant="contained"
              color="success"
              sx={{ mt: 2 }}
              onClick={handleSubmitRevision}
              disabled={revision.trim().split(/\s+/).length < 25}
            >
              Submit Revised Pitch
            </Button>
          </CardContent>
        </Card>
      )}

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
            <strong>Score:</strong> {evaluation.score}/{evaluation.maxScore}
          </Typography>
          <Typography variant="body1">
            {evaluation.feedback}
          </Typography>
        </Alert>
      )}

      {/* Action Buttons */}
      {showResults && (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
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
      )}
    </Box>
  )
}
