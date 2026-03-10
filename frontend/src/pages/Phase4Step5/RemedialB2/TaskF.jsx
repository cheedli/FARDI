import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, TextField, Alert } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 5 - Remedial B2 - Task F: Grammar Role-Quest
 * Complete 6 lines with passive voice
 * Gamified as "Grammar Role-Quest"
 * Score: +1 for each correct passive (6 total)
 */

const PASSIVE_SENTENCES = [
  {
    id: 1,
    sentence: 'Poster _____ (design) with gatefold.',
    correctAnswer: 'is designed',
    alternatives: ['was designed']
  },
  {
    id: 2,
    sentence: 'Animation _____ (use) for video.',
    correctAnswer: 'is used',
    alternatives: ['was used']
  },
  {
    id: 3,
    sentence: 'Jingle _____ (add) for music.',
    correctAnswer: 'is added',
    alternatives: ['was added']
  },
  {
    id: 4,
    sentence: 'Dramatisation _____ (employ) for story.',
    correctAnswer: 'is employed',
    alternatives: ['is used', 'was employed']
  },
  {
    id: 5,
    sentence: 'Sketch _____ (draw) for plan.',
    correctAnswer: 'is drawn',
    alternatives: ['was drawn']
  },
  {
    id: 6,
    sentence: 'Clip _____ (include) for segment.',
    correctAnswer: 'is included',
    alternatives: ['was included']
  }
]

export default function Phase4Step5RemedialB2TaskF() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 6, context: 'remedial_b2' })
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
    const sentence = PASSIVE_SENTENCES.find(s => s.id === id)
    const correctAnswer = sentence.correctAnswer.toLowerCase()

    // Accept the correct answer or reasonable alternatives
    return userAnswer === correctAnswer ||
           sentence.alternatives.some(alt => userAnswer === alt.toLowerCase())
  }

  const handleSubmit = async () => {
    let correctCount = 0
    const evaluationResults = []

    PASSIVE_SENTENCES.forEach(sentence => {
      const isCorrect = checkAnswer(sentence.id)
      if (isCorrect) correctCount++

      evaluationResults.push({
        id: sentence.id,
        sentence: sentence.sentence,
        userAnswer: answers[sentence.id] || '',
        correctAnswer: sentence.correctAnswer,
        isCorrect
      })
    })

    setResults(evaluationResults)
    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase4_step5_remedial_b2_taskF_score', correctCount)

    await logTaskCompletion(correctCount)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskF', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/step5/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: 'B2',
          task: 'F',
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
    navigate('/phase4/step/5/remedial/b2/results')
  }

  const allFilled = PASSIVE_SENTENCES.every(s => answers[s.id] && answers[s.id].trim())

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #2c3e50 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 4 Step 5: Evaluate - Remedial Practice
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level B2 - Task F: Grammar Role-Quest 🎭
        </Typography>
        <Typography variant="body1">
          Complete 6 sentences using passive voice!
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="LILIA"
          message="Final task! Welcome to the Grammar Role-Quest! 🎭 Complete each sentence using the passive voice. Use the verb provided in parentheses and conjugate it correctly for passive voice."
        />
      </Paper>

      {!submitted && (
        <Box>
          <Stack spacing={3}>
            {PASSIVE_SENTENCES.map((sentence, index) => (
              <Paper key={sentence.id} elevation={3} sx={{ p: 3, border: '2px solid #8e44ad' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Sentence {index + 1}
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', mb: 2 }}>
                  {sentence.sentence}
                </Typography>

                <TextField
                  fullWidth
                  label="Fill in the blank (passive voice)"
                  value={answers[sentence.id] || ''}
                  onChange={(e) => handleAnswerChange(sentence.id, e.target.value)}
                  placeholder="Type your answer here (e.g., is designed, is used, is added)..."
                  variant="outlined"
                  helperText="Use passive voice form"
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
              {allFilled ? 'Submit Grammar Role-Quest 🎭' : 'Fill All Sentences First'}
            </Button>
          </Stack>
        </Box>
      )}

      {submitted && (
        <Box>
          {/* Results Summary */}
          <Paper elevation={6} sx={{ p: 4, mb: 3, textAlign: 'center', backgroundColor: score >= 5 ? 'success.light' : 'warning.light' }}>
            <Typography variant="h4" gutterBottom color={score >= 5 ? 'success.dark' : 'warning.dark'}>
              {score === 6 ? '🎭 Perfect Passive Voice! 🎭' : score >= 5 ? '🌟 Great Work! 🌟' : '💪 Good Effort! 💪'}
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
                    {result.sentence.replace('_____', `[${result.userAnswer || '?'}]`)}
                  </Typography>
                  {!result.isCorrect && (
                    <Typography variant="body2" color="success.dark" fontWeight="bold">
                      ✓ Correct answer: {result.correctAnswer}
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
              View Final Results →
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  )
}
