import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Stack, Alert } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 4 - Remedial B1 - Task E: Tense Time Travel (Past Tense)
 * Rewrite 6 sentences from present to past tense
 * Score: +1 for each correct sentence (6 total)
 */

const SENTENCES = [
  {
    id: 1,
    present: 'is',
    sentence: 'Ad _____ promotional.',
    correct: 'was'
  },
  {
    id: 2,
    present: 'uses',
    sentence: 'Persuasive _____ ethos, pathos, logos.',
    correct: 'used'
  },
  {
    id: 3,
    present: 'is',
    sentence: 'Targeted _____ for group.',
    correct: 'was'
  },
  {
    id: 4,
    present: 'is',
    sentence: 'Original _____ new.',
    correct: 'was'
  },
  {
    id: 5,
    present: 'makes',
    sentence: 'Creative _____ memorable.',
    correct: 'made'
  },
  {
    id: 6,
    present: 'is',
    sentence: 'Ethical _____ honest.',
    correct: 'was'
  }
]

export default function RemedialB1TaskE() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 5, context: 'remedial_b1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerChange = (id, value) => {
    setAnswers(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const checkAnswer = (id) => {
    const answer = answers[id]?.toLowerCase().trim()
    const correct = SENTENCES.find(s => s.id === id).correct.toLowerCase()
    return answer === correct
  }

  const handleSubmit = async () => {
    let correctCount = 0
    SENTENCES.forEach(sentence => {
      if (checkAnswer(sentence.id)) {
        correctCount++
      }
    })

    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('remedial_step4_b1_taskE_score', correctCount)

    await logTaskCompletion(correctCount)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskE', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: 'B1',
          task: 'E',
          step: 4,
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
    navigate('/phase4/step/4/remedial/b1/taskF')
  }

  const allFilled = SENTENCES.every(s => answers[s.id] && answers[s.id].trim().length > 0)

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
        <Typography variant="h4" gutterBottom>
          Phase 4 - Step 4: Remedial Activities
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level B1 - Task E: Tense Time Travel ⏰
        </Typography>
        <Typography variant="body1">
          Rewrite 6 sentences from present tense to past tense!
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="MS. MABROUKI"
          message="Time to travel to the past! For each sentence, fill in the blank with the past tense form of the verb shown. Change 'is' to 'was', 'uses' to 'used', and 'makes' to 'made'. Be careful with your spelling!"
        />
      </Paper>

      {!submitted && (
        <Box>
          <Stack spacing={3}>
            {SENTENCES.map((sentence) => (
              <Paper key={sentence.id} elevation={2} sx={{ p: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Sentence {sentence.id}
                </Typography>
                <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', mb: 2 }}>
                  {sentence.sentence}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                  Present tense verb: <strong>{sentence.present}</strong>
                </Typography>
                <TextField
                  fullWidth
                  label="Type the past tense verb"
                  value={answers[sentence.id] || ''}
                  onChange={(e) => handleAnswerChange(sentence.id, e.target.value)}
                  placeholder="Enter past tense form..."
                  variant="outlined"
                  helperText={`Change "${sentence.present}" to past tense`}
                />
              </Paper>
            ))}
          </Stack>

          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              size="large"
              disabled={!allFilled}
            >
              {allFilled ? 'Submit Time Travel ⏰' : 'Fill All Sentences First'}
            </Button>
          </Stack>
        </Box>
      )}

      {submitted && (
        <Box>
          <Paper elevation={6} sx={{ p: 4, mt: 3, textAlign: 'center', backgroundColor: score === 6 ? 'success.light' : 'warning.light' }}>
            <Typography variant="h4" gutterBottom color={score === 6 ? 'success.dark' : 'warning.dark'}>
              {score === 6 ? '⏰ Perfect Time Travel! ⏰' : '🌟 Time Travel Complete! 🌟'}
            </Typography>
            <Typography variant="h6" color="text.primary">
              You scored {score} out of 6 points!
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Answer Review:
            </Typography>
            <Stack spacing={2}>
              {SENTENCES.map((sentence) => {
                const isCorrect = checkAnswer(sentence.id)
                return (
                  <Alert key={sentence.id} severity={isCorrect ? 'success' : 'error'}>
                    <Typography variant="body2">
                      <strong>Sentence {sentence.id}:</strong> {sentence.sentence.replace('_____', '[' + (answers[sentence.id] || '?') + ']')}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Present tense: <strong>{sentence.present}</strong> → Your answer: <strong>{answers[sentence.id] || '(empty)'}</strong>
                    </Typography>
                    {!isCorrect && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Correct past tense: <strong>{sentence.correct}</strong>
                      </Typography>
                    )}
                  </Alert>
                )
              })}
            </Stack>
          </Paper>

          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
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
