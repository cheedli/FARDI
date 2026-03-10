import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Alert,
  Card,
  CardContent,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
  Stack
} from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 - Level A2 - Task C: Connector Quest
 * Choose "because" or "and" for 6 sentences
 */

const SENTENCES = [
  { id: 1, text: 'Post has hashtag ___ emoji.', answer: 'and' },
  { id: 2, text: 'Caption short ___ good.', answer: 'because' },
  { id: 3, text: 'Like post ___ share.', answer: 'and' },
  { id: 4, text: 'Tag friends ___ fun.', answer: 'because' },
  { id: 5, text: 'Story has photo ___ video.', answer: 'and' },
  { id: 6, text: 'Use emoji ___ express feeling.', answer: 'because' }
]

export default function Phase4_2RemedialA2TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 3, context: 'remedial_a2' })
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerChange = (id, value) => {
    setAnswers({
      ...answers,
      [id]: value
    })
  }

  const handleSubmit = () => {
    let correctCount = 0
    SENTENCES.forEach(sentence => {
      if (answers[sentence.id] === sentence.answer) {
        correctCount++
      }
    })

    setScore(correctCount)
    setShowResults(true)

    // Store score
    const scoreOutOf10 = (correctCount / SENTENCES.length) * 10
    sessionStorage.setItem('phase4_2_remedial_a2_taskC_score', scoreOutOf10.toString())
    sessionStorage.setItem('phase4_2_remedial_a2_taskC_max', '10')

    logTaskCompletion(correctCount, SENTENCES.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          phase: '4.2',
          step: 1,
          level: 'A2',
          task: 'C',
          score: score,
          max_score: maxScore,
          time_taken: 0
        })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const handleFinish = () => {
    navigate('/phase4_2/step/1/remedial/a2/results')
  }

  const allAnswered = SENTENCES.every(s => answers[s.id])

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'warning.light', color: 'warning.contrastText' }}>
        <Typography variant="h5" gutterBottom>
          Phase 4.2 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level A2 - Task C: Connector Quest
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Choose the correct connector for each sentence! Use 'and' to add information and 'because' to give a reason."
        />
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1">
          <strong>Instructions:</strong> Select "because" or "and" to complete each sentence correctly.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Evaluation:</strong> Correct connector use.
        </Typography>
      </Paper>

      {/* Connector Guide */}
      <Card elevation={2} sx={{ mb: 3, backgroundColor: 'success.lighter' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            Quick Guide:
          </Typography>
          <Stack spacing={1}>
            <Box>
              <Chip label="and" color="success" sx={{ mr: 1 }} />
              <Typography variant="body2" component="span">
                Use to add information (joins similar things)
              </Typography>
            </Box>
            <Box>
              <Chip label="because" color="info" sx={{ mr: 1 }} />
              <Typography variant="body2" component="span">
                Use to give a reason (explains why)
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Sentences */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {SENTENCES.map(sentence => {
          const isCorrect = answers[sentence.id] === sentence.answer
          const isAnswered = answers[sentence.id]

          return (
            <Grid item xs={12} key={sentence.id}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  backgroundColor: showResults
                    ? (isCorrect ? 'success.lighter' : 'error.lighter')
                    : 'white'
                }}
              >
                <Box>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {sentence.id}. {sentence.text}
                  </Typography>

                  {!showResults && (
                    <ToggleButtonGroup
                      value={answers[sentence.id] || ''}
                      exclusive
                      onChange={(e, value) => value && handleAnswerChange(sentence.id, value)}
                      sx={{ mt: 2 }}
                    >
                      <ToggleButton value="and" sx={{ px: 4, py: 1.5 }}>
                        and
                      </ToggleButton>
                      <ToggleButton value="because" sx={{ px: 4, py: 1.5 }}>
                        because
                      </ToggleButton>
                    </ToggleButtonGroup>
                  )}

                  {showResults && (
                    <Box sx={{ mt: 2 }}>
                      {isCorrect ? (
                        <Alert severity="success" icon={<CheckCircleIcon />}>
                          Correct: <strong>{sentence.answer}</strong>
                        </Alert>
                      ) : (
                        <Alert severity="error">
                          Your answer: <strong>{answers[sentence.id] || '(none)'}</strong> | Correct answer: <strong>{sentence.answer}</strong>
                        </Alert>
                      )}
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>
          )
        })}
      </Grid>

      {/* Results */}
      {showResults && (
        <Alert severity={score === SENTENCES.length ? "success" : "warning"} sx={{ mb: 3 }}>
          {score === SENTENCES.length ? (
            <Typography>
              Perfect! You got all {SENTENCES.length} connectors correct!
            </Typography>
          ) : (
            <Typography>
              You got {score}/{SENTENCES.length} correct. Review the guide and try to understand when to use each connector!
            </Typography>
          )}
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
            disabled={!allAnswered}
          >
            Submit Answers
          </Button>
        )}
        {showResults && (
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={handleFinish}
            endIcon={<ArrowForwardIcon />}
          >
            View Results
          </Button>
        )}
      </Box>
    </Box>
  )
}
