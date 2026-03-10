import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, TextField, Alert, LinearProgress, CircularProgress } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { CheckCircle, Cancel, TipsAndUpdates } from '@mui/icons-material'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 3 - Remedial A2 - Task B: Expand Empire
 * Expand 8 sentences with video terms using LLM evaluation
 * Score: +1 for each correct expansion (8 total)
 */

const SENTENCE_PROMPTS = [
  {
    prompt: 'Ad is promotional.',
    expectedExpansion: 'Ad is promotional to sell.',
    hint: 'Add what promotional does (purpose)'
  },
  {
    prompt: 'Persuasive is.',
    expectedExpansion: 'Persuasive is to convince buy.',
    hint: 'Complete: persuasive is to... what?'
  },
  {
    prompt: 'Targeted for.',
    expectedExpansion: 'Targeted for specific people.',
    hint: 'Targeted for which people?'
  },
  {
    prompt: 'Original idea.',
    expectedExpansion: 'Original idea is new.',
    hint: 'What kind of idea is original?'
  },
  {
    prompt: 'Creative ad.',
    expectedExpansion: 'Creative ad is memorable.',
    hint: 'What does a creative ad do?'
  },
  {
    prompt: 'Dramatisation story.',
    expectedExpansion: 'Dramatisation story in video.',
    hint: 'Where is the dramatisation story?'
  },
  {
    prompt: 'Goal is.',
    expectedExpansion: 'Goal is what want.',
    hint: 'What is a goal?'
  },
  {
    prompt: 'Obstacles are.',
    expectedExpansion: 'Obstacles are problems.',
    hint: 'What are obstacles?'
  }
]

export default function RemedialA2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 2, context: 'remedial_a2' })
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

  const handleSubmit = async () => {
    setEvaluating(true)

    // Prepare all sentences for single API call
    const expansions = userAnswers.map((answer, index) => ({
      prompt: SENTENCE_PROMPTS[index].prompt,
      userExpansion: answer,
      expectedExpansion: SENTENCE_PROMPTS[index].expectedExpansion
    }))

    try {
      // Single API call to evaluate all 8 expansions at once
      const response = await fetch('/api/phase4/evaluate-sentence-expansions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          expansions: expansions
        })
      })

      const data = await response.json()

      if (data.success && data.results) {
        // Use AI results
        const checkResults = data.results.map((result, index) => ({
          userAnswer: userAnswers[index],
          expectedExpansion: SENTENCE_PROMPTS[index].expectedExpansion,
          isCorrect: result.isCorrect,
          feedback: result.feedback
        }))

        setResults(checkResults)
        const correctCount = checkResults.filter(r => r.isCorrect).length
        setScore(correctCount)
        setSubmitted(true)

        // Store result
        sessionStorage.setItem('remedial_step3_a2_taskB_score', correctCount)

        // Log to backend
        await logTaskCompletion(correctCount)
      } else {
        // Fallback to local evaluation
        await handleSubmitLocal()
      }
    } catch (error) {
      console.error('AI evaluation error:', error)
      // Fallback to local evaluation
      await handleSubmitLocal()
    } finally {
      setEvaluating(false)
    }
  }

  const handleSubmitLocal = async () => {
    // Fallback: local evaluation
    const checkResults = userAnswers.map((answer, index) => {
      const prompt = SENTENCE_PROMPTS[index].prompt
      const expansion = answer.toLowerCase().trim()

      // Check if user added meaningful content
      const hasAddition = expansion.length > prompt.length + 3 // At least 3 more chars
      const hasRelevantWords = checkRelevantWords(expansion, index)

      const isCorrect = hasAddition && hasRelevantWords

      return {
        userAnswer: answer,
        expectedExpansion: SENTENCE_PROMPTS[index].expectedExpansion,
        isCorrect,
        feedback: isCorrect ? 'Good expansion!' : 'Try adding more explanation.'
      }
    })

    setResults(checkResults)
    const correctCount = checkResults.filter(r => r.isCorrect).length
    setScore(correctCount)
    setSubmitted(true)

    // Store result
    sessionStorage.setItem('remedial_step3_a2_taskB_score', correctCount)

    // Log to backend
    await logTaskCompletion(correctCount)
  }

  const checkRelevantWords = (expansion, index) => {
    const relevantWords = [
      ['sell', 'selling', 'product'],
      ['convince', 'persuade', 'buy'],
      ['specific', 'people', 'group', 'audience'],
      ['new', 'fresh', 'unique'],
      ['memorable', 'remember', 'stands out'],
      ['video', 'commercial', 'advertisement'],
      ['want', 'desire', 'wish', 'aim'],
      ['problems', 'challenges', 'difficulties', 'issues']
    ]

    if (index >= relevantWords.length) return false

    return relevantWords[index].some(word =>
      expansion.toLowerCase().includes(word.toLowerCase())
    )
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score: score })
    try {
      const response = await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          level: 'A2',
          task: 'B',
          step: 2,
          score: score,
          max_score: 8,
          completed: true
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('Step 3 Task B completion logged to backend')
      }
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase4/step3/remedial/a2/taskC')
  }

  const progress = ((currentIndex + 1) / SENTENCE_PROMPTS.length) * 100

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
        <Typography variant="h4" gutterBottom>
          Phase 4 - Step 3: Remedial Activities
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level A2 - Task B: Expand Empire 🏛️
        </Typography>
        <Typography variant="body1">
          Build your empire by expanding sentences! Each expansion is like adding a building to your empire.
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="MS. MABROUKI"
          message="Great job on the Dialogue Adventure! Now let's expand our empire! 🏛️ You have 8 short sentences. Your task is to expand each one by adding more words to make it more complete. Look at the hints for ideas. Don't worry about perfect grammar - just add simple explanations!"
        />
      </Paper>

      {!submitted ? (
        <Box>
          {/* Progress Bar */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Sentence {currentIndex + 1} of {SENTENCE_PROMPTS.length}
            </Typography>
            <LinearProgress variant="determinate" value={progress} sx={{ mb: 1 }} />
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              {SENTENCE_PROMPTS.map((_, idx) => (
                <Box
                  key={idx}
                  sx={{
                    width: '100%',
                    height: 8,
                    borderRadius: 1,
                    backgroundColor: idx < currentIndex ? 'success.main' :
                                    idx === currentIndex ? 'primary.main' : 'grey.300'
                  }}
                />
              ))}
            </Box>
          </Paper>

          {/* Current Sentence Expansion */}
          <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h6" color="primary" gutterBottom>
                Expand this sentence:
              </Typography>
              <Paper elevation={1} sx={{ p: 2, backgroundColor: 'warning.light', display: 'inline-block' }}>
                <Typography variant="h5" fontWeight="bold">
                  "{currentPrompt.prompt}"
                </Typography>
              </Paper>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Alert severity="info" icon={<TipsAndUpdates />}>
                <Typography variant="body2">
                  💡 {currentPrompt.hint}
                </Typography>
              </Alert>
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                variant="outlined"
                label="Your expanded sentence"
                placeholder="Write a longer, more complete sentence..."
                value={userAnswers[currentIndex]}
                onChange={(e) => handleAnswerChange(e.target.value)}
                multiline
                rows={3}
              />
            </Box>

            {/* Navigation */}
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Button
                variant="outlined"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                ← Previous
              </Button>

              {currentIndex < SENTENCE_PROMPTS.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!userAnswers[currentIndex]}
                >
                  Next →
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSubmit}
                  disabled={userAnswers.some(answer => !answer) || evaluating}
                  startIcon={evaluating && <CircularProgress size={20} />}
                >
                  {evaluating ? 'Evaluating...' : 'Submit All Expansions'}
                </Button>
              )}
            </Stack>
          </Paper>

          {/* Quick Navigation */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Jump to sentence:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {SENTENCE_PROMPTS.map((prompt, idx) => (
                <Button
                  key={idx}
                  size="small"
                  variant={idx === currentIndex ? 'contained' : 'outlined'}
                  onClick={() => setCurrentIndex(idx)}
                  sx={{ minWidth: 40 }}
                >
                  {idx + 1} {userAnswers[idx] && '✓'}
                </Button>
              ))}
            </Stack>
          </Paper>
        </Box>
      ) : (
        <Box>
          {/* Results */}
          <Paper elevation={6} sx={{ p: 4, mb: 3, textAlign: 'center', backgroundColor: 'success.light' }}>
            <Typography variant="h4" gutterBottom color="success.dark">
              {score === 8 ? '🏛️ Empire Complete! 🏛️' : '🌟 Good Empire Building! 🌟'}
            </Typography>
            <Typography variant="h6" color="text.primary">
              You scored {score} out of 8 points!
            </Typography>
          </Paper>

          {/* Answer Review */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Expansion Review:
            </Typography>
            <Stack spacing={2}>
              {results.map((result, index) => (
                <Alert
                  key={index}
                  severity={result.isCorrect ? 'success' : 'error'}
                  icon={result.isCorrect ? <CheckCircle /> : <Cancel />}
                >
                  <Typography variant="body2" gutterBottom>
                    <strong>Sentence {index + 1}:</strong> "{SENTENCE_PROMPTS[index].prompt}"
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Your expansion: "{result.userAnswer}"
                  </Typography>
                  {result.feedback && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                      {result.feedback}
                    </Typography>
                  )}
                  {!result.isCorrect && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                      Example: <strong>{result.expectedExpansion}</strong>
                    </Typography>
                  )}
                </Alert>
              ))}
            </Stack>
          </Paper>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="contained"
              color="success"
              onClick={handleContinue}
              size="large"
            >
              Next: Connector Quest →
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  )
}
