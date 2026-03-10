import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Alert,
  Grid,
  Card,
  CardContent
} from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 1 - Level B1 - Task D: Tense Odyssey
 * Grammar Exercise - Mixed Tenses/Conditionals for social media contexts
 */

const SENTENCES = [
  {
    id: 1,
    prompt: 'Hashtag use for viral',
    correctAnswer: 'would have been',
    hint: 'Past conditional - what could have happened',
    fullSentence: 'Hashtag use for viral ___ better if targeted.',
    explanation: 'Use "would have been" for hypothetical past situations'
  },
  {
    id: 2,
    prompt: 'Caption is short',
    correctAnswer: 'has proven',
    hint: 'Present perfect - result from past to now',
    fullSentence: 'Caption is short ___ effective.',
    explanation: 'Use "has proven" to show ongoing effectiveness'
  },
  {
    id: 3,
    prompt: 'Emoji add emotion',
    correctAnswer: 'if used',
    hint: 'Conditional - when/if situation',
    fullSentence: 'Emoji add emotion ___ sparingly.',
    explanation: 'Use "if used" for conditional statements'
  },
  {
    id: 4,
    prompt: 'Call-to-action drive conversion',
    correctAnswer: 'would increase',
    hint: 'Conditional future - what would happen',
    fullSentence: 'Call-to-action drive conversion ___ if clear.',
    explanation: 'Use "would increase" for hypothetical future results'
  },
  {
    id: 5,
    prompt: 'Tagging reach more',
    correctAnswer: 'had been',
    hint: 'Past perfect - completed past action',
    fullSentence: 'Tagging reach more ___ used wisely.',
    explanation: 'Use "had been" for completed past actions'
  },
  {
    id: 6,
    prompt: 'Viral spread fast',
    correctAnswer: 'might happen',
    hint: 'Modal - possibility in future',
    fullSentence: 'Viral spread fast ___ with good content.',
    explanation: 'Use "might happen" for possible future events'
  }
]

export default function Phase4_2RemedialB1TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 4, context: 'remedial_b1' })
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [showHints, setShowHints] = useState({})

  const handleAnswerChange = (id, value) => {
    setAnswers({
      ...answers,
      [id]: value.toLowerCase().trim()
    })
  }

  const toggleHint = (id) => {
    setShowHints({
      ...showHints,
      [id]: !showHints[id]
    })
  }

  const evaluateAnswer = (userAnswer, correctAnswer) => {
    const userWords = userAnswer.toLowerCase().trim().split(/\s+/)
    const correctWords = correctAnswer.toLowerCase().trim().split(/\s+/)

    // Check if all correct words are present in user answer
    const matches = correctWords.filter(word => userWords.includes(word))
    return matches.length === correctWords.length
  }

  const handleSubmit = () => {
    let correctCount = 0
    SENTENCES.forEach(sentence => {
      if (evaluateAnswer(answers[sentence.id] || '', sentence.correctAnswer)) {
        correctCount++
      }
    })

    setScore(correctCount)
    setShowResults(true)

    const scoreOutOf10 = (correctCount / SENTENCES.length) * 10
    sessionStorage.setItem('phase4_2_remedial_b1_taskD_score', scoreOutOf10.toFixed(1))
    sessionStorage.setItem('phase4_2_remedial_b1_taskD_max', '10')

    logTaskCompletion(correctCount, SENTENCES.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskD', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          phase: '4.2',
          step: 1,
          level: 'B1',
          task: 'D',
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
    navigate('/phase4_2/step/1/remedial/b1/taskE')
  }

  const allAnswered = SENTENCES.every(s => answers[s.id]?.trim())

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: '#e74c3c', color: 'white' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'white' }}>
          Phase 4.2 Step 1: Engage - Remedial Practice
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 500, color: 'white' }}>
          Level B1 - Task D: Tense Odyssey
        </Typography>
        <Typography variant="body1" sx={{ color: 'white' }}>
          Complete sentences with correct mixed tenses and conditionals!
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="LILIA"
          message="Time to master mixed tenses! Fill in the blanks with the correct verb forms. Use conditionals, present perfect, past perfect, and modals. Click 'Show Hint' if you need help!"
        />
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 500 }}>
          <strong>Instructions:</strong> Complete each sentence with the correct verb tense or conditional form.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: 'text.primary' }}>
          <strong>Evaluation:</strong> Your answer must include the correct tense/conditional words.
        </Typography>
      </Paper>

      {/* Sentences */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {SENTENCES.map(sentence => {
          const isCorrect = evaluateAnswer(answers[sentence.id] || '', sentence.correctAnswer)
          const isAnswered = answers[sentence.id]?.trim()

          return (
            <Grid item xs={12} key={sentence.id}>
              <Card elevation={2} sx={{
                backgroundColor: showResults
                  ? (isCorrect ? 'success.lighter' : 'error.lighter')
                  : 'background.paper'
              }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {sentence.id}. {sentence.fullSentence}
                  </Typography>

                  <Box sx={{ mt: 2, mb: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.primary', mb: 1 }}>
                      Context: <em>{sentence.prompt}</em>
                    </Typography>
                  </Box>

                  <TextField
                    fullWidth
                    size="medium"
                    placeholder="Type your answer here (e.g., would have been)"
                    value={answers[sentence.id] || ''}
                    onChange={(e) => handleAnswerChange(sentence.id, e.target.value)}
                    disabled={showResults}
                    sx={{
                      backgroundColor: 'background.paper',
                      '& .MuiInputBase-input': {
                        color: 'text.primary',
                        fontSize: '1.1rem'
                      }
                    }}
                  />

                  {!showResults && (
                    <Button
                      size="small"
                      onClick={() => toggleHint(sentence.id)}
                      sx={{ mt: 1 }}
                    >
                      {showHints[sentence.id] ? 'Hide Hint' : 'Show Hint'}
                    </Button>
                  )}

                  {showHints[sentence.id] && !showResults && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        <strong>Hint:</strong> {sentence.hint}
                      </Typography>
                    </Alert>
                  )}

                  {showResults && (
                    <Box sx={{ mt: 2 }}>
                      {isCorrect ? (
                        <Alert severity="success" icon={<CheckCircleIcon />}>
                          <Typography sx={{ color: 'text.primary' }}>
                            Correct! <strong>{sentence.correctAnswer}</strong>
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.primary', display: 'block', mt: 1 }}>
                            {sentence.explanation}
                          </Typography>
                        </Alert>
                      ) : (
                        <Alert severity="error">
                          <Typography sx={{ color: 'text.primary' }}>
                            Your answer: <strong>{answers[sentence.id] || '(empty)'}</strong>
                          </Typography>
                          <Typography sx={{ color: 'text.primary' }}>
                            Correct answer: <strong>{sentence.correctAnswer}</strong>
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.primary', display: 'block', mt: 1 }}>
                            {sentence.explanation}
                          </Typography>
                        </Alert>
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      {/* Results */}
      {showResults && (
        <Alert severity={score === SENTENCES.length ? "success" : "warning"} sx={{ mb: 3 }}>
          {score === SENTENCES.length ? (
            <Typography sx={{ color: 'text.primary' }}>
              🎉 Perfect! All {SENTENCES.length} sentences completed correctly!
            </Typography>
          ) : (
            <Typography sx={{ color: 'text.primary' }}>
              You got {score}/{SENTENCES.length} correct. Review the explanations above!
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
            onClick={handleNext}
            endIcon={<ArrowForwardIcon />}
          >
            Continue to Task E
          </Button>
        )}
      </Box>
    </Box>
  )
}
