import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Alert,
  Card,
  CardContent,
  CircularProgress,
  Stack
} from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 4 - Level B1 - Task B: Writing Proposals
 * Propose elements of social media post (8 sentences)
 */

const QUESTIONS = [
  { id: 1, question: 'What hashtag should we use and why?', example: 'Use #GlobalFestival for reach' },
  { id: 2, question: 'What caption should we write?', example: 'Write short caption' },
  { id: 3, question: 'What emoji should we add?', example: 'Add happy emoji' },
  { id: 4, question: 'Who should we tag?', example: 'Tag local artists' },
  { id: 5, question: 'What call-to-action should we include?', example: 'Tell people to like and share' },
  { id: 6, question: 'When should we post?', example: 'Post at 6pm when people are free' },
  { id: 7, question: 'How should people engage with the post?', example: 'Ask them to like and share' },
  { id: 8, question: 'Should we create a story? Why?', example: 'Yes, story reaches more people' }
]

export default function Phase4_2Step4RemedialB1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 2, context: 'remedial_b1' })
  const [proposals, setProposals] = useState(Array(8).fill(''))
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(false)

  const handleInputChange = (index, value) => {
    const newProposals = [...proposals]
    newProposals[index] = value
    setProposals(newProposals)
  }

  const handleSubmit = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/phase4/4_2/step4/remedial/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: 'B1',
          task: 'B',
          proposals: proposals.map((proposal, idx) => ({
            question: QUESTIONS[idx].question,
            answer: proposal
          }))
        })
      })

      const result = await response.json()

      if (result.success) {
        setScore(result.score)
        setFeedback(result.feedback || [])
        setShowResults(true)

        // Store score out of 8 total points
        sessionStorage.setItem('phase4_2_step4_b1_taskB', result.score.toString())

        logTaskCompletion(result.score, 8)
      } else {
        alert('Evaluation failed. Please try again.')
      }
    } catch (error) {
      console.error('Failed to evaluate:', error)
      alert('Failed to evaluate. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          phase: '4.2',
          step: 4,
          level: 'B1',
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
    navigate('/phase4_2/step/4/remedial/b1/taskC')
  }

  const allFilled = proposals.every(proposal => proposal.trim() !== '')
  const passThreshold = 6

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'info.light', color: 'info.contrastText' }}>
        <Typography variant="h5" gutterBottom>
          Phase 4.2 Step 4 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level B1 - Task B: Writing Proposals
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Propose elements for a social media post! Write 8 simple proposals to plan the perfect post."
        />
      </Paper>

      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1">
          <strong>Instructions:</strong> Write 8 proposals for different elements of a social media post.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Evaluation:</strong> AI will check for B1 grammar and clear proposals. Each good proposal earns 1 point. You need {passThreshold}/8 to pass.
        </Typography>
      </Paper>

      <Card elevation={2} sx={{ mb: 3, backgroundColor: 'warning.lighter' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="warning.dark">
            Gamification: Writing Proposals
          </Typography>
          <Typography variant="body2">
            You're the social media strategist! Propose your ideas clearly!
          </Typography>
        </CardContent>
      </Card>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Example Proposals:
        </Typography>
        <Typography variant="body2" sx={{ mb: 1, fontStyle: 'italic' }}>
          "Use #GlobalFestival for reach"
        </Typography>
        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
          "Write short caption"
        </Typography>
      </Paper>

      <Stack spacing={3} sx={{ mb: 4 }}>
        {QUESTIONS.map((item, index) => (
          <Card key={index} elevation={2}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="primary">
                {index + 1}. {item.question}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Example: {item.example}
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="Write your proposal..."
                value={proposals[index]}
                onChange={(e) => handleInputChange(index, e.target.value)}
                disabled={showResults || loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: showResults
                      ? (feedback[index]?.correct ? 'success.lighter' : 'warning.lighter')
                      : 'white'
                  }
                }}
              />
              {showResults && feedback[index] && (
                <Alert severity={feedback[index].correct ? 'success' : 'info'} sx={{ mt: 1 }}>
                  <Typography variant="body2">{feedback[index].comment}</Typography>
                </Alert>
              )}
            </CardContent>
          </Card>
        ))}
      </Stack>

      {showResults && (
        <Alert severity={score >= passThreshold ? "success" : "warning"} sx={{ mb: 3 }}>
          {score >= passThreshold ? (
            <Typography>Great work! You scored {score}/8 points!</Typography>
          ) : (
            <Typography>You got {score}/8 correct. Review the feedback above!</Typography>
          )}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
        {!showResults && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit}
            disabled={!allFilled || loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Evaluating...' : 'Submit Proposals'}
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
            Continue to Task C
          </Button>
        )}
      </Box>
    </Box>
  )
}
