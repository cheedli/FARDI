import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Stack, Alert } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 5 - Remedial B1 - Task E: Tense Time Travel (Past Tense/Coherence)
 * Correct tense/coherence in 6 sentences
 * Gamified as "Tense Time Travel"
 * Score: +1 for each correct sentence (6 total)
 */

const SENTENCES = [
  {
    id: 1,
    faulty: 'Poster have gatefold yesterday.',
    blank: 'Poster _____ gatefold yesterday.',
    correct: 'had',
    hint: 'Change "have" to past tense'
  },
  {
    id: 2,
    faulty: 'Video use animation last week.',
    blank: 'Video _____ animation last week.',
    correct: 'used',
    hint: 'Change "use" to past tense'
  },
  {
    id: 3,
    faulty: 'Slogan was catchy.',
    blank: 'Slogan _____ catchy.',
    correct: 'is',
    hint: 'Change to present tense for general truth'
  },
  {
    id: 4,
    faulty: 'Clip show dancing.',
    blank: 'Clip _____ dancing.',
    correct: 'showed',
    hint: 'Change "show" to past tense'
  },
  {
    id: 5,
    faulty: 'Jingle play music.',
    blank: 'Jingle _____ music.',
    correct: 'played',
    hint: 'Change "play" to past tense'
  },
  {
    id: 6,
    faulty: 'Dramatisation tell story.',
    blank: 'Dramatisation _____ story.',
    correct: 'told',
    hint: 'Change "tell" to past tense'
  }
]

export default function Phase4Step5RemedialB1TaskE() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 5, context: 'remedial_b1' })
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
    sessionStorage.setItem('phase4_step5_remedial_b1_taskE_score', correctCount)

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
          level: 'B1',
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
    navigate('/phase4/step/5/remedial/b1/taskF')
  }

  const allFilled = SENTENCES.every(s => answers[s.id] && answers[s.id].trim().length > 0)

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 4 Step 5: Evaluate - Remedial Practice
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level B1 - Task E: Tense Time Travel ⏰
        </Typography>
        <Typography variant="body1">
          Travel through time! Correct tense and coherence in 6 sentences.
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="LILIA"
          message="Time to travel through tenses! ⏰ For each sentence, fill in the blank with the correct verb tense. Pay attention to time indicators like 'yesterday', 'last week', or present truths. Fix verb tenses to make the sentences coherent!"
        />
      </Paper>

      {!submitted && (
        <Box>
          <Stack spacing={3}>
            {SENTENCES.map((sentence) => (
              <Paper key={sentence.id} elevation={2} sx={{ p: 3 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Sentence {sentence.id}
                  </Typography>
                  <Typography variant="caption" sx={{ px: 1, py: 0.5, backgroundColor: 'error.light', borderRadius: 1, color: 'error.dark' }}>
                    Faulty
                  </Typography>
                </Stack>

                <Typography variant="body1" color="error.dark" sx={{ mb: 2, fontStyle: 'italic' }}>
                  ❌ {sentence.faulty}
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', mb: 2 }}>
                  {sentence.blank}
                </Typography>

                <TextField
                  fullWidth
                  label="Type the correct verb tense"
                  value={answers[sentence.id] || ''}
                  onChange={(e) => handleAnswerChange(sentence.id, e.target.value)}
                  placeholder="Enter correct verb form..."
                  variant="outlined"
                  helperText={sentence.hint}
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
                    <Typography variant="body2" gutterBottom>
                      <strong>Sentence {sentence.id}:</strong>
                    </Typography>
                    <Typography variant="body2" color="error.dark" sx={{ mb: 1 }}>
                      ❌ Faulty: {sentence.faulty}
                    </Typography>
                    <Typography variant="body2" color={isCorrect ? 'success.dark' : 'text.primary'}>
                      Your answer: {sentence.blank.replace('_____', '[' + (answers[sentence.id] || '?') + ']')}
                    </Typography>
                    {!isCorrect && (
                      <Typography variant="body2" sx={{ mt: 1 }} color="success.dark" fontWeight="bold">
                        ✓ Correct: {sentence.blank.replace('_____', sentence.correct)}
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
