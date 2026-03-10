import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, TextField, Alert } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 5 - Remedial C1 - Task F: Debate Duel Advanced
 * Fix 6 sentences with subjunctive/modal errors
 * Gamified as "Debate Duel Advanced"
 * Score: +1 for each correctly fixed sentence (6 total)
 */

const DEBATE_SENTENCES = [
  {
    id: 1,
    faulty: 'It is crucial that promotional advertising is balanced with ethical considerations so as not to alienate the audience.',
    correctAnswer: 'It is crucial that promotional advertising be balanced with ethical considerations so as not to alienate the audience.',
    errors: ['Subjunctive error: "is" should be "be" after "it is crucial that"']
  },
  {
    id: 2,
    faulty: 'Persuasive techniques should incorporates pathos only when they are supported by credible ethos, as video 1 illustrates.',
    correctAnswer: 'Persuasive techniques should incorporate pathos only when they are supported by credible ethos, as video 1 illustrates.',
    errors: ['Modal error: "incorporates" should be "incorporate" (base form after modal "should")']
  },
  {
    id: 3,
    faulty: 'If targeted strategies was applied without respect for privacy, they might erode consumer trust in the long term.',
    correctAnswer: 'If targeted strategies were applied without respect for privacy, they might erode consumer trust in the long term.',
    errors: ['Conditional error: "was" should be "were" in second conditional']
  },
  {
    id: 4,
    faulty: 'It is essential that originality is prioritized in creative execution, lest advertisements become forgettable.',
    correctAnswer: 'It is essential that originality be prioritized in creative execution, lest advertisements become forgettable.',
    errors: ['Subjunctive error: "is prioritized" should be "be prioritized" after "it is essential that"']
  },
  {
    id: 5,
    faulty: 'Dramatisation could captivates viewers more deeply if obstacles were portrayed as authentic rather than contrived.',
    correctAnswer: 'Dramatisation could captivate viewers more deeply if obstacles were portrayed as authentic rather than contrived.',
    errors: ['Modal error: "captivates" should be "captivate" (base form after modal "could")']
  },
  {
    id: 6,
    faulty: 'Ethical advertising must remains a non-negotiable priority, even when commercial pressures threaten to compromise integrity.',
    correctAnswer: 'Ethical advertising must remain a non-negotiable priority, even when commercial pressures threaten to compromise integrity.',
    errors: ['Modal error: "remains" should be "remain" (base form after modal "must")']
  }
]

export default function Phase4Step5RemedialC1TaskF() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 6, context: 'remedial_c1' })
  // Initialize answers with the faulty sentences so users can modify them
  const [answers, setAnswers] = useState(() => {
    const initial = {}
    DEBATE_SENTENCES.forEach(s => {
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
      .replace(/[“”]/g, '"')
      .trim()

  for (const sentence of DEBATE_SENTENCES) {
    const userAnswer = answers[sentence.id] || sentence.faulty

    const isCorrect = normalize(userAnswer) === normalize(sentence.correctAnswer)

    if (isCorrect) correctCount++ // ✅ +1 per correct sentence

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
  sessionStorage.setItem('phase4_step5_remedial_c1_taskF_score', correctCount)

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
          level: 'C1',
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
    navigate('/phase4/step/5/remedial/c1/taskG')
  }

  const allFilled = DEBATE_SENTENCES.every(s =>
    (answers[s.id] && answers[s.id].trim()) || s.faulty
  )

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #c0392b 0%, #8e44ad 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 4 Step 5: Evaluate - Remedial Practice
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level C1 - Task F: Debate Duel Advanced 🎭
        </Typography>
        <Typography variant="body1">
          Fix 6 debate sentences with subjunctive/modal errors!
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="LILIA"
          message="Welcome to the Debate Duel Advanced! 🎭 You have 6 debate sentences with subjunctive and modal errors. Your mission: completely rewrite each sentence fixing the subjunctive/modal mistakes. Each correctly fixed sentence earns you 1 point!"
        />
      </Paper>

      {/* What to Fix Guide */}
      <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#fce4ec', border: '2px solid #c0392b' }}>
        <Typography variant="h6" sx={{ color: '#7b1fa2', fontWeight: 'bold' }} gutterBottom>
          🎭 What to Fix (C1 Level):
        </Typography>
        <Stack spacing={1}>
          <Typography variant="body2" sx={{ color: '#6a1b9a', fontWeight: 700 }}>
            <strong>Present Subjunctive:</strong> Use base form after "it is crucial/essential that" (be, not is/are)
          </Typography>
          <Typography variant="body2" sx={{ color: '#6a1b9a', fontWeight: 700 }}>
            <strong>Modals + Base Form:</strong> should/could/might/must + BASE VERB (incorporate, not incorporates)
          </Typography>
          <Typography variant="body2" sx={{ color: '#6a1b9a', fontWeight: 700 }}>
            <strong>Second Conditional:</strong> Use "were" (not "was") in if-clauses (If X were..., Y might...)
          </Typography>
          <Typography variant="body2" sx={{ color: '#6a1b9a', fontWeight: 700 }}>
            <strong>Advanced Structures:</strong> "lest" + base form, implied subjunctive
          </Typography>
        </Stack>
      </Paper>

      {!submitted && (
        <Box>
          <Stack spacing={3}>
            {DEBATE_SENTENCES.map((sentence, index) => (
              <Paper key={sentence.id} elevation={3} sx={{ p: 3, border: '2px solid #c0392b' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Sentence {index + 1}
                </Typography>

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Fix the subjunctive/modal errors"
                  value={answers[sentence.id]}
                  onChange={(e) => handleAnswerChange(sentence.id, e.target.value)}
                  placeholder="Modify this sentence to fix all subjunctive/modal errors..."
                  variant="outlined"
                  helperText="Fix subjunctive and modal usage for C1 accuracy"
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
              {allFilled ? 'Submit Debate Duel 🎭' : 'Fix All Sentences First'}
            </Button>
          </Stack>
        </Box>
      )}

      {submitted && (
        <Box>
          {/* Results Summary */}
          <Paper elevation={6} sx={{ p: 4, mb: 3, textAlign: 'center', backgroundColor: score >= 5 ? 'success.light' : 'warning.light' }}>
            <Typography variant="h4" gutterBottom color={score >= 5 ? 'success.dark' : 'warning.dark'}>
              {score === 6 ? '🎭 Perfect Debate Mastery! 🎭' : score >= 5 ? '🌟 Great Work! 🌟' : '💪 Good Effort! 💪'}
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
              Continue to Task G →
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  )
}
