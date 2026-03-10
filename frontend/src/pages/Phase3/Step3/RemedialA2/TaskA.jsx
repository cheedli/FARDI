import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Select, MenuItem, FormControl, Alert, Card, CardContent } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 3 Step 3 - Level A2 - Task A: Gap Fill
 * Complete sentences using: because, so
 */

const GAP_FILL_SENTENCES = [
  {
    id: 1,
    text: "We need a sponsor _______ the budget is large.",
    correctAnswers: ['because'],
    hint: 'Explains the reason'
  },
  {
    id: 2,
    text: "The venue is expensive _______ we need more funding.",
    correctAnswers: ['so'],
    hint: 'Shows the result'
  },
  {
    id: 3,
    text: "We sell tickets _______ people want to attend.",
    correctAnswers: ['because'],
    hint: 'Why do we sell tickets?'
  },
  {
    id: 4,
    text: "The costs are high _______ we must find sponsors.",
    correctAnswers: ['so'],
    hint: 'What happens as a result?'
  },
  {
    id: 5,
    text: "We need careful planning _______ money is limited.",
    correctAnswers: ['because'],
    hint: 'What is the reason?'
  },
  {
    id: 6,
    text: "Sponsors help us _______ they give money.",
    correctAnswers: ['because'],
    hint: 'How do they help?'
  },
  {
    id: 7,
    text: "The budget shows all costs _______ we can plan better.",
    correctAnswers: ['so'],
    hint: 'What does this allow us to do?'
  },
  {
    id: 8,
    text: "We create a budget _______ we need to control spending.",
    correctAnswers: ['because'],
    hint: 'Why make a budget?'
  },
  {
    id: 9,
    text: "Equipment is necessary _______ the event needs good sound.",
    correctAnswers: ['because'],
    hint: 'What is the reason?'
  },
  {
    id: 10,
    text: "Income is low _______ we need donations.",
    correctAnswers: ['so'],
    hint: 'What happens because of this?'
  }
]

export default function Phase3Step3RemedialA2TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 3, interaction: 1, context: 'remedial_a2' })
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
    // Calculate score
    let correctCount = 0
    GAP_FILL_SENTENCES.forEach(sentence => {
      const userAnswer = answers[sentence.id]?.toLowerCase().trim()
      if (sentence.correctAnswers.some(correct => userAnswer === correct)) {
        correctCount++
      }
    })

    setScore(correctCount)
    setShowResults(true)

    // Log to backend
    logTaskCompletion(correctCount, GAP_FILL_SENTENCES.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      await fetch('/api/phase3/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: 'A2',
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

  const allAnswered = Object.keys(answers).length === GAP_FILL_SENTENCES.length &&
    Object.values(answers).every(a => a && a.trim().length > 0)

  const passThreshold = 8 // 8/10 to pass

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'warning.light', color: 'warning.contrastText' }}>
        <Typography variant="h5" gutterBottom>
          Phase 3 Step 3 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level A2 - Task A: Gap Fill Exercise
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Emna"
          message="Let's practice using connectors! Fill in the gaps using either 'because' or 'so'. Remember: 'because' explains the reason, and 'so' shows the result."
        />
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1" gutterBottom>
          <strong>Instructions:</strong> Select the correct connector (because or so) for each blank.
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • <strong>because:</strong> introduces the REASON → "We need money <strong>because</strong> costs are high"
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • <strong>so:</strong> introduces the RESULT → "Costs are high <strong>so</strong> we need money"
        </Typography>
        <Typography variant="body2">
          <strong>Passing score:</strong> Minimum 8/10 correct
        </Typography>
      </Paper>

      {/* Progress */}
      {!showResults && (
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="primary">
            Completed: {Object.values(answers).filter(a => a && a.trim().length > 0).length}/{GAP_FILL_SENTENCES.length}
          </Typography>
        </Box>
      )}

      {/* Gap Fill Sentences */}
      <Box sx={{ mb: 4 }}>
        {GAP_FILL_SENTENCES.map((sentence, index) => {
          const userAnswer = answers[sentence.id]?.toLowerCase().trim()
          const isCorrect = showResults && sentence.correctAnswers.some(correct => userAnswer === correct)
          const isAnswered = userAnswer && userAnswer.length > 0

          return (
            <Card
              key={sentence.id}
              elevation={3}
              sx={{
                mb: 2,
                border: showResults ? (isCorrect ? 2 : 1) : 1,
                borderColor: showResults
                  ? isCorrect
                    ? 'success.main'
                    : 'error.main'
                  : 'grey.300',
                backgroundColor: showResults && isCorrect ? 'success.lighter' : 'white'
              }}
            >
              <CardContent>
                <Typography variant="body1" gutterBottom>
                  <strong>{index + 1}.</strong> {sentence.text.split('_______')[0]}
                  <FormControl size="small" sx={{ mx: 1, minWidth: 120 }}>
                    <Select
                      value={answers[sentence.id] || ''}
                      onChange={(e) => handleAnswerChange(sentence.id, e.target.value)}
                      disabled={showResults}
                      displayEmpty
                      sx={{
                        backgroundColor: showResults
                          ? isCorrect
                            ? 'success.lighter'
                            : 'error.lighter'
                          : 'white',
                        '& .MuiSelect-select': {
                          color: '#333',
                          fontWeight: 500
                        }
                      }}
                    >
                      <MenuItem value="" disabled>
                        <em>Select...</em>
                      </MenuItem>
                      <MenuItem value="because">because</MenuItem>
                      <MenuItem value="so">so</MenuItem>
                    </Select>
                  </FormControl>
                  {sentence.text.split('_______')[1]}
                </Typography>

                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  💡 Hint: {sentence.hint}
                </Typography>

                {/* Show results */}
                {showResults && (
                  <Alert severity={isCorrect ? "success" : "error"} sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      {isCorrect ? (
                        <>✓ Correct! The answer is: <strong>{userAnswer}</strong></>
                      ) : (
                        <>
                          ✗ Your answer: <strong>{userAnswer || '(no answer)'}</strong>
                          <br />
                          Correct answer: <strong>{sentence.correctAnswers.join(' or ')}</strong>
                        </>
                      )}
                    </Typography>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )
        })}
      </Box>

      {/* Results */}
      {showResults && (
        <Alert
          severity={score >= passThreshold ? "success" : "warning"}
          sx={{ mb: 3 }}
        >
          <Typography variant="h6" gutterBottom>
            Task Complete!
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Score:</strong> {score}/{GAP_FILL_SENTENCES.length}
          </Typography>
          <Typography>
            {score === GAP_FILL_SENTENCES.length
              ? "Perfect score! Excellent work!"
              : score >= passThreshold
                ? `Great job! You passed with ${score} correct answers.`
                : `You need ${passThreshold} correct to pass. Review the answers above and try again if needed.`}
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
            onClick={handleNext}
            endIcon={<ArrowForwardIcon />}
          >
            Complete A2 Task
          </Button>
        )}
      </Box>
    </Box>
  )
}
