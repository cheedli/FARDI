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
 * Phase 4.2 Step 3 - Level B1 - Task B: Definition Duel
 * Write definitions with examples for 8 social media terms
 */

const TERMS = [
  { term: 'hashtag', example: 'Hashtag is # to make post seen more' },
  { term: 'caption', example: 'Caption is text under photo to explain' },
  { term: 'emoji', example: 'Emoji is picture to show feeling' },
  { term: 'tag', example: 'Tag is @ to mention person' },
  { term: 'call-to-action', example: 'Call-to-action is words to tell people do something' },
  { term: 'post', example: 'Post is photo and words you share' },
  { term: 'story', example: 'Story is photo that goes away after 24 hours' },
  { term: 'like', example: 'Like is heart button to show you enjoy post' }
]

export default function Phase4_2Step3RemedialB1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 2, context: 'remedial_b1' })
  const [definitions, setDefinitions] = useState(Array(8).fill(''))
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(false)

  const handleInputChange = (index, value) => {
    const newDefinitions = [...definitions]
    newDefinitions[index] = value
    setDefinitions(newDefinitions)
  }

  const handleSubmit = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/phase4/4_2/step3/remedial/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: 'B1',
          task: 'B',
          definitions: definitions.map((def, idx) => ({
            term: TERMS[idx].term,
            definition: def
          }))
        })
      })

      const result = await response.json()

      if (result.success) {
        setScore(result.score)
        setFeedback(result.feedback || [])
        setShowResults(true)

        // Store score out of 8 total points
        sessionStorage.setItem('phase4_2_step3_b1_taskB', result.score.toString())

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
          step: 3,
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
    navigate('/phase4_2/step/3/remedial/b1/taskC')
  }

  const allFilled = definitions.every(def => def.trim() !== '')

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'info.light', color: 'info.contrastText' }}>
        <Typography variant="h5" gutterBottom>
          Phase 4.2 Step 3 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level B1 - Task B: Definition Duel
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Write simple definitions for these social media terms. Include examples to show you understand!"
        />
      </Paper>

      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1">
          <strong>Instructions:</strong> Write a definition with an example for each of the 8 social media terms.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Evaluation:</strong> AI will check for B1 grammar and simple examples. Each good definition earns 1 point.
        </Typography>
      </Paper>

      <Card elevation={2} sx={{ mb: 3, backgroundColor: 'warning.lighter' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="warning.dark">
            Gamification: Definition Duel
          </Typography>
          <Typography variant="body2">
            Battle it out! Write the clearest definitions to win!
          </Typography>
        </CardContent>
      </Card>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Example Answers:
        </Typography>
        <Typography variant="body2" sx={{ mb: 1, fontStyle: 'italic' }}>
          "Hashtag is # to make post seen more"
        </Typography>
        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
          "Caption is text under photo to explain"
        </Typography>
      </Paper>

      <Stack spacing={3} sx={{ mb: 4 }}>
        {TERMS.map((item, index) => (
          <Card key={index} elevation={2}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="primary">
                {index + 1}. Define "{item.term}":
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="Write your definition with an example..."
                value={definitions[index]}
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
        <Alert severity={score >= 6 ? "success" : "warning"} sx={{ mb: 3 }}>
          {score >= 6 ? (
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
            {loading ? 'Evaluating...' : 'Submit Definitions'}
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
