import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Card, CardContent, Alert, Radio, RadioGroup, FormControlLabel } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 3 Step 3 - Interaction 2: Sentence Transformation
 * Task: Combine two sentences using "because" or "so"
 */

const SENTENCE_PAIRS = [
  {
    id: 1,
    sentenceA: "We need a sponsor.",
    sentenceB: "The budget has many expenses.",
    options: [
      {
        id: 'a',
        text: "We need a sponsor because the budget has many expenses.",
        isCorrect: true,
        connector: 'because'
      },
      {
        id: 'b',
        text: "We need a sponsor so the budget has many expenses.",
        isCorrect: false,
        connector: 'so'
      },
      {
        id: 'c',
        text: "The budget has many expenses so we need a sponsor.",
        isCorrect: true,
        connector: 'so'
      }
    ],
    explanation: "Both 'because' and 'so' work here, but their order matters. Use 'because' after the main idea, or 'so' after the reason.",
    acceptableAnswers: ['a', 'c']
  },
  {
    id: 2,
    sentenceA: "Ticket sales are important.",
    sentenceB: "They provide income for the event.",
    options: [
      {
        id: 'a',
        text: "Ticket sales are important because they provide income for the event.",
        isCorrect: true,
        connector: 'because'
      },
      {
        id: 'b',
        text: "They provide income for the event so ticket sales are important.",
        isCorrect: false,
        connector: 'so'
      },
      {
        id: 'c',
        text: "Ticket sales are important so they provide income for the event.",
        isCorrect: false,
        connector: 'so'
      }
    ],
    explanation: "Use 'because' when the second part explains WHY. The income is the reason ticket sales are important.",
    acceptableAnswers: ['a']
  },
  {
    id: 3,
    sentenceA: "The venue costs $800.",
    sentenceB: "We need more funding sources.",
    options: [
      {
        id: 'a',
        text: "The venue costs $800 because we need more funding sources.",
        isCorrect: false,
        connector: 'because'
      },
      {
        id: 'b',
        text: "The venue costs $800 so we need more funding sources.",
        isCorrect: true,
        connector: 'so'
      },
      {
        id: 'c',
        text: "We need more funding sources because the venue costs $800.",
        isCorrect: true,
        connector: 'because'
      }
    ],
    explanation: "The high venue cost is the REASON for needing more funding. You can use 'so' after the reason, or 'because' before it.",
    acceptableAnswers: ['b', 'c']
  },
  {
    id: 4,
    sentenceA: "Sponsors want visibility.",
    sentenceB: "We put their logos on posters.",
    options: [
      {
        id: 'a',
        text: "Sponsors want visibility so we put their logos on posters.",
        isCorrect: true,
        connector: 'so'
      },
      {
        id: 'b',
        text: "We put their logos on posters because sponsors want visibility.",
        isCorrect: true,
        connector: 'because'
      },
      {
        id: 'c',
        text: "Sponsors want visibility because we put their logos on posters.",
        isCorrect: false,
        connector: 'because'
      }
    ],
    explanation: "The sponsor's desire for visibility is the reason for putting logos on posters. Both options a and b express this correctly.",
    acceptableAnswers: ['a', 'b']
  },
  {
    id: 5,
    sentenceA: "Our budget is limited.",
    sentenceB: "We must prioritize essential costs.",
    options: [
      {
        id: 'a',
        text: "Our budget is limited so we must prioritize essential costs.",
        isCorrect: true,
        connector: 'so'
      },
      {
        id: 'b',
        text: "We must prioritize essential costs because our budget is limited.",
        isCorrect: true,
        connector: 'because'
      },
      {
        id: 'c',
        text: "Our budget is limited because we must prioritize essential costs.",
        isCorrect: false,
        connector: 'because'
      }
    ],
    explanation: "The limited budget is the reason for prioritizing costs. Options a and b both correctly show this relationship.",
    acceptableAnswers: ['a', 'b']
  }
]

export default function Phase3Step3Interaction2() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 3, interaction: 2, context: 'main' })
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerChange = (pairId, optionId) => {
    setAnswers({
      ...answers,
      [pairId]: optionId
    })
  }

  const handleSubmit = () => {
    // Calculate score
    let correctCount = 0

    SENTENCE_PAIRS.forEach(pair => {
      const userAnswer = answers[pair.id]
      if (pair.acceptableAnswers.includes(userAnswer)) {
        correctCount++
      }
    })

    setScore(correctCount)
    setShowResults(true)

    // Store result
    sessionStorage.setItem('phase3_step3_int2_score', correctCount.toString())
    sessionStorage.setItem('phase3_step3_int2_max', SENTENCE_PAIRS.length.toString())

    // Log to backend
    logTaskCompletion(correctCount, SENTENCE_PAIRS.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction2', is_correct: true, score: score })
    try {
      await fetch('/api/phase3/interaction/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          step: 3,
          interaction: 2,
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
    navigate('/app/phase3/step/3/interaction/3')
  }

  const allAnswered = Object.keys(answers).length === SENTENCE_PAIRS.length

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'success.light', color: 'success.contrastText' }}>
        <Typography variant="h4" gutterBottom>
          Phase 3 Step 3: Explain
        </Typography>
        <Typography variant="h5" gutterBottom>
          Interaction 2: Sentence Transformation
        </Typography>
        <Typography variant="body1">
          Combine sentences using "because" or "so"
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Excellent! Now let's practice combining sentences using connectors. For each pair of sentences, choose the option that correctly combines them using 'because' or 'so'. Remember: 'because' introduces the reason, and 'so' introduces the result."
        />
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'warning.lighter' }}>
        <Typography variant="body1" gutterBottom>
          <strong>Instructions:</strong>
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • Read both sentences carefully
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • Select the option that correctly combines them
        </Typography>
        <Typography variant="body2">
          • Think about which part is the REASON and which is the RESULT
        </Typography>
      </Paper>

      {/* Key Grammar Reference */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body2" gutterBottom>
          <strong>Grammar Tip:</strong>
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • <strong>because:</strong> [Result] <em>because</em> [Reason] → "We need money <strong>because</strong> costs are high"
        </Typography>
        <Typography variant="body2">
          • <strong>so:</strong> [Reason] <em>so</em> [Result] → "Costs are high <strong>so</strong> we need money"
        </Typography>
      </Paper>

      {/* Progress */}
      {!showResults && (
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="primary">
            Questions Answered: {Object.keys(answers).length}/{SENTENCE_PAIRS.length}
          </Typography>
        </Box>
      )}

      {/* Sentence Pairs */}
      <Box sx={{ mb: 4 }}>
        {SENTENCE_PAIRS.map((pair, index) => {
          const userAnswer = answers[pair.id]
          const isCorrect = showResults && pair.acceptableAnswers.includes(userAnswer)
          const isAnswered = userAnswer !== undefined

          return (
            <Card
              key={pair.id}
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
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">
                    Question {index + 1}
                  </Typography>
                  {showResults && isCorrect && <CheckCircleIcon color="success" fontSize="large" />}
                </Box>

                {/* Original Sentences */}
                <Box sx={{ mb: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="body1" sx={{ mb: 1, color: '#000' }}>
                    <strong>Sentence A:</strong> {pair.sentenceA}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#000' }}>
                    <strong>Sentence B:</strong> {pair.sentenceB}
                  </Typography>
                </Box>

                <Typography variant="body2" gutterBottom sx={{ mb: 2, fontWeight: 'bold', color: '#000' }}>
                  Choose the best way to combine these sentences:
                </Typography>

                {/* Options */}
                <RadioGroup
                  value={userAnswer || ''}
                  onChange={(e) => handleAnswerChange(pair.id, e.target.value)}
                >
                  {pair.options.map(option => (
                    <FormControlLabel
                      key={option.id}
                      value={option.id}
                      control={<Radio disabled={showResults} />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography>{option.text}</Typography>
                          {showResults && pair.acceptableAnswers.includes(option.id) && (
                            <CheckCircleIcon color="success" fontSize="small" />
                          )}
                        </Box>
                      }
                      sx={{
                        backgroundColor:
                          showResults && pair.acceptableAnswers.includes(option.id)
                            ? 'success.lighter'
                            : showResults && userAnswer === option.id && !pair.acceptableAnswers.includes(option.id)
                              ? 'error.lighter'
                              : 'transparent',
                        borderRadius: 1,
                        px: 1,
                        py: 0.5,
                        my: 0.5
                      }}
                    />
                  ))}
                </RadioGroup>

                {/* Show explanation after submission */}
                {showResults && (
                  <Alert severity={isCorrect ? "success" : "info"} sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      <strong>Explanation:</strong> {pair.explanation}
                    </Typography>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )
        })}
      </Box>

      {/* Overall Results */}
      {showResults && (
        <Alert
          severity={score === SENTENCE_PAIRS.length ? "success" : score >= 4 ? "info" : "warning"}
          sx={{ mb: 3 }}
        >
          <Typography variant="h6" gutterBottom>
            Results
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Score:</strong> {score}/{SENTENCE_PAIRS.length} correct
          </Typography>
          <Typography>
            {score === SENTENCE_PAIRS.length
              ? "Perfect! You have mastered sentence transformation with connectors!"
              : score >= 4
                ? "Great work! You understand how to use 'because' and 'so' correctly."
                : "Good effort! Review the explanations to improve your connector usage."}
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
            Continue to Next Activity
          </Button>
        )}
      </Box>
    </Box>
  )
}
