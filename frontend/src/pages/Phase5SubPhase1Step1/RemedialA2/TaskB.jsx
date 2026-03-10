import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, TextField, Alert, LinearProgress, CircularProgress } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { CheckCircle, Cancel } from '@mui/icons-material'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 5 Step 1 - Level A2 - Task B: Sentence Expansion
 * Expand 8 sentences with "because" or "and", gamified as "Expand Quest"
 * Expand to "grow" a virtual tree
 */

const SENTENCE_PROMPTS = [
  {
    prompt: 'Singer cancel.',
    expectedExpansion: 'Singer cancel because sick.',
    hint: 'Add "because" and a reason'
  },
  {
    prompt: 'Find solution.',
    expectedExpansion: 'Find solution and fix.',
    hint: 'Add "and" and an action'
  },
  {
    prompt: 'Say sorry.',
    expectedExpansion: 'Say sorry because problem.',
    hint: 'Add "because" and a reason'
  },
  {
    prompt: 'Use alternative.',
    expectedExpansion: 'Use alternative singer.',
    hint: 'Add a noun after "alternative"'
  },
  {
    prompt: 'Change time.',
    expectedExpansion: 'Change time and place.',
    hint: 'Add "and" and another noun'
  },
  {
    prompt: 'Problem urgent.',
    expectedExpansion: 'Problem urgent and big.',
    hint: 'Add "and" and another adjective'
  },
  {
    prompt: 'Fix issue.',
    expectedExpansion: 'Fix issue because festival.',
    hint: 'Add "because" and a reason'
  },
  {
    prompt: 'Tell people.',
    expectedExpansion: 'Tell people and apologize.',
    hint: 'Add "and" and another action'
  }
]

export default function Phase5Step1RemedialA2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 1, interaction: 2, context: 'remedial_a2' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState(Array(SENTENCE_PROMPTS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState([])
  const [score, setScore] = useState(0)
  const [evaluating, setEvaluating] = useState(false)

  const currentPrompt = SENTENCE_PROMPTS[currentIndex]

  const handleAnswerChange = (value) => {
    const newAnswers = [...userAnswers]
    newAnswers[currentIndex] = value
    setUserAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentIndex < SENTENCE_PROMPTS.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const checkAnswer = (userAnswer, prompt) => {
    const normalized = userAnswer.toLowerCase().trim()
    const expected = prompt.expectedExpansion.toLowerCase()

    // Check if answer includes connector (because/and) and has logical detail
    const hasConnector = normalized.includes('because') || normalized.includes('and')
    const hasOriginalWords = normalized.includes(prompt.prompt.toLowerCase().split(' ')[0])
    const hasAdditionalWords = normalized.split(' ').length > prompt.prompt.split(' ').length

    // Flexible matching: accept if has connector and additional content
    return hasConnector && hasOriginalWords && hasAdditionalWords
  }

  const handleSubmit = async () => {
    setEvaluating(true)

    // Prepare all expansions for evaluation
    const expansions = userAnswers.map((answer, index) => ({
      prompt: SENTENCE_PROMPTS[index].prompt,
      userExpansion: answer,
      expectedExpansion: SENTENCE_PROMPTS[index].expectedExpansion
    }))

    try {
      // Use local evaluation (can be enhanced with AI later)
      const checkResults = expansions.map((expansion, index) => {
        const isCorrect = checkAnswer(expansion.userExpansion, SENTENCE_PROMPTS[index])
        return {
          userAnswer: expansion.userExpansion,
          expectedExpansion: expansion.expectedExpansion,
          isCorrect,
          feedback: isCorrect ? 'Good expansion!' : 'Try adding "because" or "and" with more detail.'
        }
      })

      const correctCount = checkResults.filter(r => r.isCorrect).length
      setResults(checkResults)
      setScore(correctCount)
      setSubmitted(true)

      sessionStorage.setItem('phase5_step1_remedial_a2_taskB_score', correctCount.toString())

      // Log to backend
      try {
        await phase5API.logRemedialActivity(1, 'A2', 'B', correctCount, 8, 0)
        console.log('[Phase 5 Step 1] A2 Task B completion logged to backend')
      } catch (error) {
        console.error('Failed to log task completion:', error)
      }
    } catch (error) {
      console.error('Evaluation error:', error)
    } finally {
      setEvaluating(false)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/1/step/1/remedial/a2/task/c')
  }

  const progress = ((currentIndex + 1) / SENTENCE_PROMPTS.length) * 100

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 5: Execution & Problem-Solving
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 1: Remedial Practice - Level A2
        </Typography>
        <Typography variant="h6" gutterBottom>
          Task B: Expand Quest
        </Typography>
        <Typography variant="body1">
          Expand 8 sentences with "because" or "and". Grow your virtual tree!
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Welcome to Expand Quest! Expand each sentence by adding 'because' or 'and' with more detail. Each correct expansion helps your virtual tree grow!"
        />
      </Paper>

      {!submitted ? (
        <>
          {/* Progress */}
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">
                Sentence {currentIndex + 1} of {SENTENCE_PROMPTS.length}
              </Typography>
              <Typography variant="body2" color="primary" fontWeight="bold">
                {Math.round(progress)}% Complete
              </Typography>
            </Box>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 1 }} />
          </Paper>

          {/* Current Sentence */}
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Expand this sentence:
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Original:</strong> {currentPrompt.prompt}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Hint:</strong> {currentPrompt.hint}
              </Typography>
            </Alert>

            <TextField
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              placeholder={`Expand: ${currentPrompt.prompt}...`}
              value={userAnswers[currentIndex]}
              onChange={(e) => handleAnswerChange(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Button
                variant="outlined"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                ← Previous
              </Button>
              {currentIndex === SENTENCE_PROMPTS.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={!userAnswers[currentIndex].trim() || evaluating}
                  startIcon={evaluating ? <CircularProgress size={20} /> : null}
                >
                  {evaluating ? 'Evaluating...' : 'Submit All Expansions'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  disabled={!userAnswers[currentIndex].trim()}
                >
                  Next →
                </Button>
              )}
            </Stack>
          </Paper>
        </>
      ) : (
        <>
          {/* Results */}
          <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: 'grey.50' }}>
            <Typography variant="h5" gutterBottom color="primary">
              Results: {score} / {SENTENCE_PROMPTS.length} Correct
            </Typography>

            <Stack spacing={2} sx={{ mt: 2 }}>
              {results.map((result, index) => (
                <Paper
                  key={index}
                  elevation={1}
                  sx={{
                    p: 2,
                    backgroundColor: result.isCorrect ? 'success.lighter' : 'error.lighter',
                    border: '1px solid',
                    borderColor: result.isCorrect ? 'success.main' : 'error.main'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {result.isCorrect ? (
                      <CheckCircle sx={{ color: 'success.main', mr: 1 }} />
                    ) : (
                      <Cancel sx={{ color: 'error.main', mr: 1 }} />
                    )}
                    <Typography variant="subtitle2" fontWeight="bold">
                      Sentence {index + 1}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <strong>Original:</strong> {SENTENCE_PROMPTS[index].prompt}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <strong>Your expansion:</strong> {result.userAnswer || '(empty)'}
                  </Typography>
                  {!result.isCorrect && (
                    <Typography variant="body2" color="success.dark">
                      <strong>Example:</strong> {result.expectedExpansion}
                    </Typography>
                  )}
                </Paper>
              ))}
            </Stack>
          </Paper>

          <Button
            variant="contained"
            color="success"
            onClick={handleContinue}
            size="large"
            fullWidth
          >
            Next: Task C →
          </Button>
        </>
      )}
    </Box>
  )
}
