import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, TextField, Alert } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 5 - Remedial C1 - Task G: Correction Crusade
 * Fix 6 sentences with advanced grammar errors (mixed error types)
 * Gamified as "Correction Crusade"
 * Score: +1 for each correctly fixed sentence (6 total)
 */

const CRUSADE_SENTENCES = [
  {
    id: 1,
    faulty: 'The committee have decided that each member present their findings individually.',
    correctAnswer: 'The committee has decided that each member present their findings individually.',
    errors: ['Subject-verb agreement: "committee" (collective noun) takes singular verb "has"']
  },
  {
    id: 2,
    faulty: 'Neither the marketing team nor the creative director were aware of the budget constraints.',
    correctAnswer: 'Neither the marketing team nor the creative director was aware of the budget constraints.',
    errors: ['Neither...nor agreement: verb agrees with nearest subject "director" (singular = was)']
  },
  {
    id: 3,
    faulty: 'The data suggests that consumer behaviour patterns has shifted dramatically over the past decade.',
    correctAnswer: 'The data suggest that consumer behaviour patterns have shifted dramatically over the past decade.',
    errors: ['Subject-verb agreement: "data" (plural) takes "suggest"; "patterns" takes "have shifted"']
  },
  {
    id: 4,
    faulty: 'It is imperative that the brand maintains its integrity while adapting to market trends.',
    correctAnswer: 'It is imperative that the brand maintain its integrity while adapting to market trends.',
    errors: ['Subjunctive: after "it is imperative that", use base form "maintain" not "maintains"']
  },
  {
    id: 5,
    faulty: 'The analysis, along with supplementary reports, demonstrate the effectiveness of targeted advertising.',
    correctAnswer: 'The analysis, along with supplementary reports, demonstrates the effectiveness of targeted advertising.',
    errors: ['Subject-verb agreement: "along with" does not change subject; "analysis" (singular) takes "demonstrates"']
  },
  {
    id: 6,
    faulty: 'Had the campaign been launched earlier, it would have generated more significant impact than it actually had.',
    correctAnswer: 'Had the campaign been launched earlier, it would have generated more significant impact than it actually did.',
    errors: ['Verb consistency: "had" should be "did" to avoid redundancy with "would have"']
  }
]

export default function Phase4Step5RemedialC1TaskG() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 7, context: 'remedial_c1' })
  const [answers, setAnswers] = useState(() => {
    const initial = {}
    CRUSADE_SENTENCES.forEach(s => {
      initial[s.id] = s.faulty
    })
    return initial
  })
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState([])
  const [score, setScore] = useState(0)

  const handleAnswerChange = (id, value) => {
    setAnswers(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleSubmit = async () => {
    let correctCount = 0
    const evaluationResults = []

    const normalize = (s) =>
      (s || '')
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .replace(/[""]/g, '"')
        .trim()

    for (const sentence of CRUSADE_SENTENCES) {
      const userAnswer = answers[sentence.id] || sentence.faulty
      const isCorrect = normalize(userAnswer) === normalize(sentence.correctAnswer)

      if (isCorrect) correctCount++

      evaluationResults.push({
        id: sentence.id,
        faulty: sentence.faulty,
        userAnswer,
        correctAnswer: sentence.correctAnswer,
        isCorrect,
        errors: sentence.errors
      })
    }

    setResults(evaluationResults)
    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase4_step5_remedial_c1_taskG_score', correctCount)

    await logTaskCompletion(correctCount)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskG', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/step5/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: 'C1',
          task: 'G',
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
    navigate('/phase4/step/5/remedial/c1/results')
  }

  const allFilled = CRUSADE_SENTENCES.every(s =>
    (answers[s.id] && answers[s.id].trim()) || s.faulty
  )

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #c0392b 0%, #8e44ad 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 4 Step 5: Evaluate - Remedial Practice
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level C1 - Task G: Correction Crusade ⚔️
        </Typography>
        <Typography variant="body1">
          Fix 6 sentences with advanced mixed grammar errors!
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="LILIA"
          message="Welcome to the Correction Crusade! ⚔️ You have 6 sentences with advanced grammar errors including subject-verb agreement, subjunctive mood, and more. Your mission: completely rewrite each sentence fixing all errors. Each correctly fixed sentence earns you 1 point!"
        />
      </Paper>

      <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#fce4ec', border: '2px solid #c0392b' }}>
        <Typography variant="h6" sx={{ color: '#7b1fa2', fontWeight: 'bold' }} gutterBottom>
          ⚔️ What to Fix (C1 Level - Mixed Errors):
        </Typography>
        <Stack spacing={1}>
          <Typography variant="body2" sx={{ color: '#6a1b9a', fontWeight: 700 }}>
            <strong>Collective Nouns:</strong> committee/team + singular verb (has, is, was)
          </Typography>
          <Typography variant="body2" sx={{ color: '#6a1b9a', fontWeight: 700 }}>
            <strong>Neither...Nor:</strong> Verb agrees with the nearest subject
          </Typography>
          <Typography variant="body2" sx={{ color: '#6a1b9a', fontWeight: 700 }}>
            <strong>Data (plural):</strong> data suggest/show (not suggests/shows)
          </Typography>
          <Typography variant="body2" sx={{ color: '#6a1b9a', fontWeight: 700 }}>
            <strong>Interrupting Phrases:</strong> "along with/as well as" doesn't change subject number
          </Typography>
          <Typography variant="body2" sx={{ color: '#6a1b9a', fontWeight: 700 }}>
            <strong>Subjunctive:</strong> "it is imperative that" + base form
          </Typography>
        </Stack>
      </Paper>

      {!submitted && (
        <Box>
          <Stack spacing={3}>
            {CRUSADE_SENTENCES.map((sentence, index) => (
              <Paper key={sentence.id} elevation={3} sx={{ p: 3, border: '2px solid #c0392b' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Sentence {index + 1}
                </Typography>

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Fix the grammar errors"
                  value={answers[sentence.id]}
                  onChange={(e) => handleAnswerChange(sentence.id, e.target.value)}
                  placeholder="Modify this sentence to fix all grammar errors..."
                  variant="outlined"
                  helperText="Fix all advanced grammar issues for C1 accuracy"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& textarea': {
                        color: '#ffffff',
                        fontWeight: 500
                      }
                    }
                  }}
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
                background: 'linear-gradient(135deg, #c0392b 0%, #8e44ad 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #a93226 0%, #7d3c98 100%)'
                },
                py: 2,
                px: 6
              }}
            >
              {allFilled ? 'Submit Correction Crusade ⚔️' : 'Fix All Sentences First'}
            </Button>
          </Stack>
        </Box>
      )}

      {submitted && (
        <Box>
          <Paper elevation={6} sx={{ p: 4, mb: 3, textAlign: 'center', backgroundColor: score >= 5 ? 'success.light' : 'warning.light' }}>
            <Typography variant="h4" gutterBottom color={score >= 5 ? 'success.dark' : 'warning.dark'}>
              {score === 6 ? '⚔️ Perfect Crusade Victory! ⚔️' : score >= 5 ? '🌟 Great Work! 🌟' : '💪 Good Effort! 💪'}
            </Typography>
            <Typography variant="h6" color="text.primary">
              You scored {score} out of 6 points!
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Answer Review:
            </Typography>
            <Stack spacing={3} sx={{ mt: 2 }}>
              {results.map((result, index) => (
                <Alert key={result.id} severity={result.isCorrect ? 'success' : 'error'}>
                  <Typography variant="body2" gutterBottom>
                    <strong>Sentence {index + 1}:</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, fontStyle: 'italic', color: '#d32f2f' }}>
                    Faulty: {result.faulty}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                    Your answer: {result.userAnswer || '(no answer)'}
                  </Typography>
                  {!result.isCorrect && (
                    <>
                      <Typography variant="body2" color="success.dark" fontWeight="bold" sx={{ mt: 1 }}>
                        ✓ Expected correction: {result.correctAnswer}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        Error: {result.errors[0]}
                      </Typography>
                    </>
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
              sx={{ py: 2, px: 6 }}
            >
              Continue to Results →
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  )
}
