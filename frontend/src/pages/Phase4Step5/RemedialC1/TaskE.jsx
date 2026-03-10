import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, TextField, Alert } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 5 - Remedial C1 - Task E: Clause Conquest
 * Rewrite 6 faulty complex sentences correctly
 * Gamified as "Clause Conquest"
 * Score: +1 for each correctly rewritten sentence (6 total)
 */

const COMPLEX_SENTENCES = [
  {
    id: 1,
    // Original correct sentence with errors injected:
    // - remove commas (non-defining clause punctuation error)
    // - tense downgrade (has been shown -> was shown)
    // - extra "it is" (wordiness/structure)
    faulty:
      'Promotional advertising which is primarily designed to drive sales was shown in video 1 to be most effective when it is supported by persuasive techniques.',
    correctAnswer:
      'Promotional advertising, which is primarily designed to drive sales, has been shown in video 1 to be most effective when supported by persuasive techniques.',
    keyElements: ['which is primarily designed', 'has been shown', 'when supported by'],
    errorType: 'Comma punctuation + tense + unnecessary wording'
  },
  {
    id: 2,
    // Errors:
    // - agreement (which are used -> which is used)
    // - conditional error (if it was combined -> if it were combined)
    // - missing comma before main clause
    faulty:
      'The gatefold layout, which are used to unfold narrative depth in posters would be enhanced if it was combined with targeted imagery.',
    correctAnswer:
      'The gatefold layout, which is used to unfold narrative depth in posters, would be enhanced if it were combined with targeted imagery.',
    keyElements: ['which is used', 'would be enhanced', 'if it were combined'],
    errorType: 'Relative clause agreement + punctuation + conditional form'
  },
  {
    id: 3,
    // Errors:
    // - wrong preposition (conveyed by -> conveyed through) or vice versa (subtle lexical accuracy)
    // - agreement (are employed -> is employed)
    faulty:
      'Dramatisation, by which emotional stories are conveyed by relatable characters, are employed in video 2 to overcome viewer indifference.',
    correctAnswer:
      'Dramatisation, by which emotional stories are conveyed through relatable characters, is employed in video 2 to overcome viewer indifference.',
    keyElements: ['by which', 'are conveyed', 'is employed'],
    errorType: 'Collocation/preposition + subject–verb agreement'
  },
  {
    id: 4,
    // Errors:
    // - missing "been" in passive perfect (have integrated -> have been integrated)
    // - missing preposition + awkward order (analyzed in video 1)
    faulty:
      'Persuasive appeals, which are rooted in ethos, pathos, and logos, have integrated seamlessly in the commercials analyzed video 1.',
    correctAnswer:
      'Persuasive appeals, which are rooted in ethos, pathos, and logos, have been integrated seamlessly in the commercials analyzed in video 1.',
    keyElements: ['which are rooted', 'have been integrated', 'analyzed in video 1'],
    errorType: 'Present perfect passive + missing preposition'
  },
  {
    id: 5,
    // Errors:
    // - conditional mismatch (would have been undermined -> would be undermined)
    // - if-clause tense mismatch (had been ignored -> were ignored)
    faulty:
      'Consistent branding, which is maintained across platforms, would be undermined if ethical considerations were ignored.',
    correctAnswer:
      'Consistent branding, which is maintained across platforms, would have been undermined if ethical considerations had been ignored.',
    keyElements: ['which is maintained', 'would have been undermined', 'had been ignored'],
    errorType: 'Conditional perfect structure (tense consistency)'
  },
  {
    id: 6,
    // Errors:
    // - missing commas around relative clause
    // - missing "is" (passive)
    // - missing "as" + missing "to"
    faulty:
      'Creative execution which distinguishes memorable advertisements, recommended in video 1 a way reduce audience friction.',
    correctAnswer:
      'Creative execution, which distinguishes memorable advertisements, is recommended in video 1 as a way to reduce audience friction.',
    keyElements: ['which distinguishes', 'is recommended', 'as a way to reduce'],
    errorType: 'Comma punctuation + passive voice + missing connectors'
  }
]

export default function Phase4Step5RemedialC1TaskE() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 5, context: 'remedial_c1' })

  // answers are prefilled with faulty sentences so students EDIT them
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState([])
  const [score, setScore] = useState(0)

  useEffect(() => {
    // Prefill once: sentence appears in the box, student modifies it
    const initial = {}
    for (const s of COMPLEX_SENTENCES) initial[s.id] = s.faulty
    setAnswers(initial)
  }, [])

  const handleAnswerChange = (id, value) => {
    setAnswers(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleSubmit = async () => {
  let correctCount = 0
  const evaluationResults = []

  for (const sentence of COMPLEX_SENTENCES) {
    const userAnswer = answers[sentence.id] || ''

    const normalize = (s) =>
      s
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .replace(/[“”"]/g, '"')
        .trim()

    const isCorrect =
      normalize(userAnswer) === normalize(sentence.correctAnswer)

    if (isCorrect) correctCount++

    evaluationResults.push({
      id: sentence.id,
      faulty: sentence.faulty,
      userAnswer,
      correctAnswer: sentence.correctAnswer,
      isCorrect,
      errorType: sentence.errorType
    })
  }

  setResults(evaluationResults)
  setScore(correctCount)
  setSubmitted(true)

  sessionStorage.setItem(
    'phase4_step5_remedial_c1_taskE_score',
    correctCount
  )

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
          level: 'C1',
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
    navigate('/phase4/step/5/remedial/c1/taskF')
  }

  const allFilled = COMPLEX_SENTENCES.every(s => answers[s.id] && answers[s.id].trim())

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #c0392b 0%, #8e44ad 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 4 Step 5: Evaluate - Remedial Practice
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level C1 - Task E: Clause Conquest 🏆
        </Typography>
        <Typography variant="body1">
          Rewrite 6 faulty complex sentences correctly (relative clauses, passives, conditionals, punctuation).
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="LILIA"
          message="Clause Conquest 🏆 The sentence is already in the box — your job is to FIX it. Rewrite it into a correct C1-level complex sentence. 1 point per corrected sentence!"
        />
      </Paper>

      {!submitted && (
        <Box>
          <Stack spacing={3}>
            {COMPLEX_SENTENCES.map((sentence, index) => (
              <Paper key={sentence.id} elevation={3} sx={{ p: 3, border: '2px solid #c0392b' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Sentence {index + 1}
                </Typography>

                <Paper sx={{ p: 2, mb: 2, backgroundColor: '#e3f2fd', border: '2px solid #2196f3' }}>
                  <Typography variant="subtitle2" color="primary.dark" fontWeight="bold" gutterBottom>
                    📝 Fix this faulty sentence:
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#1565c0', fontFamily: 'monospace', lineHeight: 1.8 }}>
                    {sentence.faulty}
                  </Typography>
                </Paper>

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Edit the sentence to correct it"
                  value={answers[sentence.id] || ''}
                  onChange={(e) => handleAnswerChange(sentence.id, e.target.value)}
                  variant="outlined"
                  helperText="The sentence is pre-filled. Modify it until it is grammatically correct."
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
                '&:hover': { background: 'linear-gradient(135deg, #a93226 0%, #7d3c98 100%)' },
                py: 2,
                px: 6
              }}
            >
              {allFilled ? 'Submit Clause Conquest 🏆' : 'Fix All Sentences First'}
            </Button>
          </Stack>
        </Box>
      )}

      {submitted && (
        <Box>
          <Paper elevation={6} sx={{ p: 4, mb: 3, textAlign: 'center', backgroundColor: score >= 5 ? 'success.light' : 'warning.light' }}>
            <Typography variant="h4" gutterBottom color={score >= 5 ? 'success.dark' : 'warning.dark'}>
              {score === 6 ? '🏆 Perfect Clause Mastery! 🏆' : score >= 5 ? '🌟 Great Work! 🌟' : '💪 Good Effort! 💪'}
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
                <Alert key={result.id} severity={result.isCorrect ? 'success' : 'info'}>
                  <Typography variant="body2" gutterBottom>
                    <strong>Sentence {index + 1}:</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, fontFamily: 'monospace', color: '#1565c0' }}>
                    Faulty: {result.faulty}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                    Your fix: {result.userAnswer || '(no answer)'}
                  </Typography>

                  {result.isCorrect ? (
                    <Typography variant="body2" color="success.dark" fontWeight="bold" sx={{ mt: 1 }}>
                      ✓ Correct structures
                    </Typography>
                  ) : (
                    <>
                      <Typography variant="body2" color="text.primary" fontWeight="bold" sx={{ mt: 1 }}>
                        What was wrong: {result.errorType}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        Expected: {result.correctAnswer}
                      </Typography>
                    </>
                  )}
                </Alert>
              ))}
            </Stack>
          </Paper>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="contained" color="success" onClick={handleContinue} size="large" sx={{ py: 2, px: 6 }}>
              Continue to Task F →
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  )
}
