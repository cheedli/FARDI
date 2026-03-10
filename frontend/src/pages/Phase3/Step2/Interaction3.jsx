import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Card, CardContent, Select, MenuItem, Alert, Chip, Stack, FormControl } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 3 Step 2 - Interaction 3: Guided Explanation
 * Sentence Completion using word bank to explain cause-effect relationships
 */

const WORD_BANK = ['because', 'sponsor', 'budget', 'costs', 'tickets', 'funding', 'income', 'expenses']

const SENTENCE_PROMPTS = [
  {
    id: 1,
    prompt: "We need a sponsor __________ the budget has many costs.",
    correctWord: 'because',
    alternativeWords: [],
    explanation: "The word 'because' connects the reason (many costs) to the need (sponsor)."
  },
  {
    id: 2,
    prompt: "The __________ shows all the money we will spend.",
    correctWord: 'budget',
    alternativeWords: [],
    explanation: "A budget is a plan that shows how money will be spent."
  },
  {
    id: 3,
    prompt: "We sell __________ to get money from attendees.",
    correctWord: 'tickets',
    alternativeWords: [],
    explanation: "Tickets are what people buy to attend an event."
  },
  {
    id: 4,
    prompt: "The event has high __________ like venue rental and catering.",
    correctWord: 'costs',
    alternativeWords: ['expenses'],
    explanation: "Costs or expenses refer to money that must be spent."
  },
  {
    id: 5,
    prompt: "We need more __________ to cover all our expenses.",
    correctWord: 'funding',
    alternativeWords: ['income'],
    explanation: "Funding or income is money coming in to pay for things."
  }
]

export default function Phase3Step2Interaction3() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 2, interaction: 3, context: 'main' })
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [usedWords, setUsedWords] = useState([])

  const handleAnswerChange = (promptId, value) => {
    setAnswers({
      ...answers,
      [promptId]: value
    })
  }

  const handleSubmit = () => {
    // Calculate score
    let correctCount = 0
    SENTENCE_PROMPTS.forEach(prompt => {
      const userAnswer = answers[prompt.id]?.toLowerCase().trim()
      if (
        userAnswer === prompt.correctWord ||
        prompt.alternativeWords.includes(userAnswer)
      ) {
        correctCount++
      }
    })

    setScore(correctCount)
    setShowResults(true)

    // Store result
    sessionStorage.setItem('phase3_step2_int3_score', correctCount.toString())
    sessionStorage.setItem('phase3_step2_int3_max', SENTENCE_PROMPTS.length.toString())

    // Log to backend
    logTaskCompletion(correctCount, SENTENCE_PROMPTS.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction3', is_correct: true, score: score })
    try {
      await fetch('/api/phase3/interaction/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          step: 2,
          interaction: 3,
          score: score,
          max_score: maxScore,
          time_taken: 0,
          completed: true
        })
      })
    } catch (error) {
      console.error('Failed to log interaction:', error)
    }
  }

  const handleContinue = () => {
    // Calculate total score from all interactions
    const int1Score = parseInt(sessionStorage.getItem('phase3_step2_int1_score') || '0')
    const int1Max = parseInt(sessionStorage.getItem('phase3_step2_int1_max') || '10')
    const int2Score = parseInt(sessionStorage.getItem('phase3_step2_int2_score') || '0')
    const int2Max = parseInt(sessionStorage.getItem('phase3_step2_int2_max') || '5')
    const int3Score = score
    const int3Max = SENTENCE_PROMPTS.length

    const totalCorrect = int1Score + int2Score + int3Score
    const totalQuestions = int1Max + int2Max + int3Max
    const percentage = (totalCorrect / totalQuestions) * 100

    // Store overall score
    sessionStorage.setItem('phase3_step2_total_score', totalCorrect.toString())
    sessionStorage.setItem('phase3_step2_total_max', totalQuestions.toString())
    sessionStorage.setItem('phase3_step2_percentage', percentage.toFixed(2))

    console.log(`[Phase 3 Step 2 - TOTAL] Score: ${totalCorrect}/${totalQuestions} (${percentage.toFixed(1)}%)`)

    // Navigate to ScoreCalculation page for backend-driven routing
    navigate('/phase3/step/2/score')
  }

  const allAnswered = Object.keys(answers).length === SENTENCE_PROMPTS.length &&
    Object.values(answers).every(a => a && a.trim().length > 0)

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'info.light', color: 'info.contrastText' }}>
        <Typography variant="h4" gutterBottom>
          Phase 3 Step 2: Explore
        </Typography>
        <Typography variant="h5" gutterBottom>
          Interaction 3: Guided Explanation
        </Typography>
        <Typography variant="body1">
          Complete sentences using words from the word bank
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Excellent progress! Now let's practice explaining financial concepts. Complete each sentence by choosing the correct word from the word bank. Think about cause-effect relationships and financial vocabulary."
        />
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'warning.lighter' }}>
        <Typography variant="body1" gutterBottom>
          <strong>Instructions:</strong>
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • Read each sentence carefully
        </Typography>
        <Typography variant="body2">
          • Click the dropdown to select a word from the word bank for each blank
        </Typography>
      </Paper>

      {/* Word Bank Reference */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, backgroundColor: 'primary.lighter' }}>
        <Typography variant="h6" gutterBottom color="primary">
          Word Bank (Reference)
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {WORD_BANK.map((word, index) => (
            <Chip
              key={index}
              label={word}
              color="primary"
              variant="outlined"
              sx={{
                fontSize: '1rem',
                py: 2.5,
                px: 1
              }}
            />
          ))}
        </Stack>
      </Paper>

      {/* Score Display */}
      {!showResults && (
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="primary">
            Sentences Completed: {Object.values(answers).filter(a => a && a.trim().length > 0).length}/{SENTENCE_PROMPTS.length}
          </Typography>
        </Box>
      )}

      {/* Sentence Prompts */}
      <Box sx={{ mb: 4 }}>
        {SENTENCE_PROMPTS.map((prompt, index) => {
          const userAnswer = answers[prompt.id]?.toLowerCase().trim()
          const isCorrect = showResults && (
            userAnswer === prompt.correctWord ||
            prompt.alternativeWords.includes(userAnswer)
          )
          const isAnswered = userAnswer && userAnswer.length > 0

          return (
            <Card
              key={prompt.id}
              elevation={3}
              sx={{
                mb: 3,
                border: showResults ? (isCorrect ? 3 : 2) : isAnswered ? 2 : 1,
                borderColor: showResults
                  ? isCorrect
                    ? 'success.main'
                    : 'error.main'
                  : isAnswered
                    ? 'primary.main'
                    : 'grey.300',
                backgroundColor: showResults && isCorrect ? 'success.lighter' : 'white'
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {index + 1}. Complete the sentence:
                </Typography>

                {/* Show prompt with blank */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mb: 2 }}>
                  {prompt.prompt.split('__________').map((part, i, arr) => (
                    <React.Fragment key={i}>
                      <Typography variant="body1" component="span">
                        {part}
                      </Typography>
                      {i < arr.length - 1 && (
                        <FormControl
                          size="small"
                          sx={{ minWidth: 150 }}
                        >
                          <Select
                            value={answers[prompt.id] || ''}
                            onChange={(e) => handleAnswerChange(prompt.id, e.target.value)}
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
                              <em>Select word...</em>
                            </MenuItem>
                            {WORD_BANK.map((word, index) => (
                              <MenuItem key={index} value={word}>
                                {word}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    </React.Fragment>
                  ))}
                </Box>

                {/* Show results */}
                {showResults && (
                  <Alert severity={isCorrect ? "success" : "info"} sx={{ mt: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      <strong>Your answer:</strong> {userAnswer || '(no answer)'}
                    </Typography>
                    {!isCorrect && (
                      <Typography variant="body2" gutterBottom>
                        <strong>Correct answer:</strong> {prompt.correctWord}
                        {prompt.alternativeWords.length > 0 && ` or ${prompt.alternativeWords.join(', ')}`}
                      </Typography>
                    )}
                    <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                      {prompt.explanation}
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
          severity={score === SENTENCE_PROMPTS.length ? "success" : score >= 4 ? "info" : "warning"}
          sx={{ mb: 3 }}
        >
          <Typography variant="h6" gutterBottom>
            Results
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Score:</strong> {score}/{SENTENCE_PROMPTS.length} correct
          </Typography>
          <Typography>
            {score === SENTENCE_PROMPTS.length
              ? "Perfect! You have excellent understanding of financial vocabulary and cause-effect relationships!"
              : score >= 4
                ? "Great work! You understand most of the financial concepts."
                : "Good effort! Review the explanations to strengthen your understanding."}
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
            onClick={handleContinue}
            endIcon={<ArrowForwardIcon />}
          >
            Complete Step 2
          </Button>
        )}
      </Box>
    </Box>
  )
}
