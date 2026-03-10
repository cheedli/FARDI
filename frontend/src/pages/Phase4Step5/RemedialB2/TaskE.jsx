import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, TextField, Alert } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 5 - Remedial B2 - Task E: Conditional Challenge
 * Write 6 conditional sentences with terms
 * Gamified as "Conditional Challenge"
 * Score: +1 for each correct conditional (6 total)
 */

const CONDITIONAL_PROMPTS = [
  {
    id: 1,
    prompt: 'If gatefold _____ (use), poster would have more space.',
    correctAnswer: 'were used',
    alternatives: ['was used', 'is used'],
    explanation: 'Second conditional requires past subjunctive form'
  },
  {
    id: 2,
    prompt: 'Animation _____ (engage) viewers if dynamic.',
    correctAnswer: 'would engage',
    alternatives: ['will engage', 'engages'],
    explanation: 'Second conditional requires "would + base verb"'
  },
  {
    id: 3,
    prompt: 'Jingle _____ (be) memorable if catchy.',
    correctAnswer: 'would be memorable',
    alternatives: ['is memorable', 'will be memorable'],
    explanation: 'Second conditional requires "would + be"'
  },
  {
    id: 4,
    prompt: 'Dramatisation _____ (captivate) if scripted well.',
    correctAnswer: 'would captivate',
    alternatives: ['captivates', 'will captivate'],
    explanation: 'Second conditional requires "would + base verb"'
  },
  {
    id: 5,
    prompt: 'Sketch _____ (help) planning if detailed.',
    correctAnswer: 'would help',
    alternatives: ['helps', 'will help'],
    explanation: 'Second conditional requires "would + base verb"'
  },
  {
    id: 6,
    prompt: 'Clip _____ (show) key moments if short.',
    correctAnswer: 'would show',
    alternatives: ['shows', 'will show'],
    explanation: 'Second conditional requires "would + base verb"'
  }
]

export default function Phase4Step5RemedialB2TaskE() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 5, context: 'remedial_b2' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState([])
  const [score, setScore] = useState(0)

  const handleAnswerChange = (id, value) => {
    setAnswers(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const checkAnswer = (id) => {
    const userAnswer = answers[id]?.toLowerCase().trim()
    const prompt = CONDITIONAL_PROMPTS.find(p => p.id === id)
    const correctAnswer = prompt.correctAnswer.toLowerCase()

    // Accept the correct answer or reasonable alternatives
    return userAnswer === correctAnswer ||
           prompt.alternatives.some(alt => userAnswer === alt.toLowerCase())
  }

  const handleSubmit = async () => {
    let correctCount = 0
    const evaluationResults = []

    CONDITIONAL_PROMPTS.forEach(prompt => {
      const isCorrect = checkAnswer(prompt.id)
      if (isCorrect) correctCount++

      evaluationResults.push({
        id: prompt.id,
        prompt: prompt.prompt,
        userAnswer: answers[prompt.id] || '',
        correctAnswer: prompt.correctAnswer,
        isCorrect,
        explanation: prompt.explanation
      })
    })

    setResults(evaluationResults)
    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase4_step5_remedial_b2_taskE_score', correctCount)

    await logTaskCompletion(correctCount)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskE', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/step5/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: 'B2',
          task: 'E',
          score: score,
          max_score: 6,
          completed: true
        })
      })
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase4/step/5/remedial/b2/taskF')
  }

  const allFilled = CONDITIONAL_PROMPTS.every(prompt => answers[prompt.id] && answers[prompt.id].trim())

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #2c3e50 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 4 Step 5: Evaluate - Remedial Practice
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level B2 - Task E: Conditional Challenge 🎯
        </Typography>
        <Typography variant="body1">
          Complete 6 conditional sentences using second conditional form!
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="LILIA"
          message="Time for the Conditional Challenge! 🎯 Complete each sentence using the second conditional (hypothetical situations). Use the verb provided in parentheses and conjugate it correctly for second conditional form."
        />
      </Paper>

      {!submitted && (
        <Box>
          <Stack spacing={3}>
            {CONDITIONAL_PROMPTS.map((prompt, index) => (
              <Paper key={prompt.id} elevation={3} sx={{ p: 3, border: '2px solid #8e44ad' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Sentence {index + 1}
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', mb: 2 }}>
                  {prompt.prompt}
                </Typography>

                <TextField
                  fullWidth
                  label="Fill in the blank"
                  value={answers[prompt.id] || ''}
                  onChange={(e) => handleAnswerChange(prompt.id, e.target.value)}
                  placeholder="Type your answer here (e.g., were used, would engage, would be memorable)..."
                  variant="outlined"
                  helperText="Use second conditional form"
                />
              </Paper>
            ))}
          </Stack>

          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={!allFilled}
              sx={{
                background: 'linear-gradient(135deg, #8e44ad 0%, #2c3e50 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #7d3c98 0%, #1a252f 100%)'
                }
              }}
            >
              {allFilled ? 'Submit Conditional Challenge 🎯' : 'Fill All Sentences First'}
            </Button>
          </Stack>
        </Box>
      )}

      {submitted && (
        <Box>
          {/* Results Summary */}
          <Paper elevation={6} sx={{ p: 4, mb: 3, textAlign: 'center', backgroundColor: score >= 5 ? 'success.light' : 'warning.light' }}>
            <Typography variant="h4" gutterBottom color={score >= 5 ? 'success.dark' : 'warning.dark'}>
              {score === 6 ? '🎯 Perfect Conditionals! 🎯' : score >= 5 ? '🌟 Great Work! 🌟' : '💪 Good Effort! 💪'}
            </Typography>
            <Typography variant="h6" color="text.primary">
              You scored {score} out of 6 points!
            </Typography>
          </Paper>

          {/* Detailed Results */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Answer Review:
            </Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              {results.map((result, index) => (
                <Alert key={result.id} severity={result.isCorrect ? 'success' : 'error'}>
                  <Typography variant="body2" gutterBottom>
                    <strong>Sentence {index + 1}:</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {result.prompt.replace('_____', `[${result.userAnswer || '?'}]`)}
                  </Typography>
                  {!result.isCorrect && (
                    <Typography variant="body2" color="success.dark" fontWeight="bold">
                      ✓ Correct answer: {result.correctAnswer}
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    {result.explanation}
                  </Typography>
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
              Continue to Task F →
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  )
}
