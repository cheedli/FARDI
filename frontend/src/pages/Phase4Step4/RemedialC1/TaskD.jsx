import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Alert, TextField, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { CheckCircle, ErrorOutline } from '@mui/icons-material'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 4 - Remedial C1 - Task D: Clause Conquest
 * Complete 6 complex sentences with passive/relative clauses
 * Score: +1 for each correct completion (6 total)
 */

const CLAUSE_SENTENCES = [
  {
    id: 1,
    parts: [
      { text: 'Promotional advertising, which', error: false },
      { text: 'primarily/design', error: true, correct: 'is primarily designed' },
      { text: 'to drive sales,', error: false },
      { text: 'show', error: true, correct: 'has been shown' },
      { text: 'in video 1 to be most effective when supported by persuasive techniques.', error: false }
    ]
  },
  {
    id: 2,
    parts: [
      { text: 'The gatefold layout, which', error: false },
      { text: 'use', error: true, correct: 'is used' },
      { text: 'to unfold narrative depth in posters, would be enhanced if it', error: false },
      { text: 'combine', error: true, correct: 'were combined' },
      { text: 'with targeted imagery.', error: false }
    ]
  },
  {
    id: 3,
    parts: [
      { text: 'Dramatisation, by which emotional stories', error: false },
      { text: 'convey', error: true, correct: 'are conveyed' },
      { text: 'through relatable characters,', error: false },
      { text: 'employ', error: true, correct: 'is employed' },
      { text: 'in video 2 to overcome viewer indifference.', error: false }
    ]
  },
  {
    id: 4,
    parts: [
      { text: 'Persuasive appeals, which', error: false },
      { text: 'root', error: true, correct: 'are rooted' },
      { text: 'in ethos, pathos, and logos,', error: false },
      { text: 'integrate', error: true, correct: 'have been integrated' },
      { text: 'seamlessly in the commercials analyzed in video 1.', error: false }
    ]
  },
  {
    id: 5,
    parts: [
      { text: 'Consistent branding, which', error: false },
      { text: 'maintain', error: true, correct: 'is maintained' },
      { text: 'across platforms, would have been undermined if ethical considerations', error: false },
      { text: 'ignore', error: true, correct: 'had been ignored' },
      { text: '.', error: false }
    ]
  },
  {
    id: 6,
    parts: [
      { text: 'Creative execution, which', error: false },
      { text: 'distinguish', error: true, correct: 'distinguishes' },
      { text: 'memorable advertisements,', error: false },
      { text: 'recommend', error: true, correct: 'is recommended' },
      { text: 'in video 1 as a way to reduce audience friction.', error: false }
    ]
  }
]

export default function RemedialC1TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 4, context: 'remedial_c1' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [completions, setCompletions] = useState(
    CLAUSE_SENTENCES.map(sentence =>
      sentence.parts.filter(p => p.error).map(() => '')
    )
  )
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState([])
  const [score, setScore] = useState(0)

  const currentSentence = CLAUSE_SENTENCES[currentIndex]

  const handleCompletionChange = (errorIndex, value) => {
    const newCompletions = [...completions]
    newCompletions[currentIndex][errorIndex] = value
    setCompletions(newCompletions)
  }

  const handleNext = () => {
    if (currentIndex < CLAUSE_SENTENCES.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const checkCompletion = (userCompletions, sentence) => {
    const errors = sentence.parts.filter(p => p.error)
    let correctCount = 0

    userCompletions.forEach((userAnswer, idx) => {
      const correct = errors[idx].correct.toLowerCase().trim()
      const user = userAnswer.toLowerCase().trim()

      if (user === correct || correct.includes(user) && user.length >= correct.length * 0.7) {
        correctCount++
      }
    })

    return correctCount === errors.length
  }

  const handleSubmit = async () => {
    const checkResults = completions.map((userCompletions, index) => {
      const isCorrect = checkCompletion(userCompletions, CLAUSE_SENTENCES[index])
      return {
        isCorrect,
        userCompletions,
        sentence: CLAUSE_SENTENCES[index]
      }
    })

    setResults(checkResults)
    const correctCount = checkResults.filter(r => r.isCorrect).length
    setScore(correctCount)
    setSubmitted(true)

    sessionStorage.setItem('remedial_step4_c1_taskD_score', correctCount)
    await logTaskCompletion(correctCount)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskD', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: 'C1',
          task: 'D',
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
    navigate('/phase4/step/4/remedial/c1/results')
  }

  const allFilled = completions[currentIndex].every(c => c.trim().length > 0)
  const progress = ((currentIndex + 1) / CLAUSE_SENTENCES.length) * 100

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #00897b 0%, #00695c 100%)',
          color: 'white'
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 4 - Step 4: Remedial Activities
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level C1 - Task D: Clause Conquest ⚔️
        </Typography>
        <Typography variant="body1">
          Complete complex sentences with passive voice and relative clauses!
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="MS. MABROUKI"
          message="Welcome to the Clause Conquest! Fill in the blanks with correct passive voice or relative clause forms. Use sophisticated grammar structures like 'is designed', 'has been shown', 'are conveyed', etc."
        />
      </Paper>

      {!submitted ? (
        <Box>
          <Paper sx={{ p: 2, mb: 3, backgroundColor: '#e0f2f1' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom fontWeight="bold">
              Sentence {currentIndex + 1} of {CLAUSE_SENTENCES.length}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                mb: 1,
                height: 12,
                borderRadius: 6,
                backgroundColor: '#b2dfdb',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #00897b 0%, #00695c 100%)'
                }
              }}
            />
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              {CLAUSE_SENTENCES.map((_, idx) => (
                <Box
                  key={idx}
                  sx={{
                    width: '100%',
                    height: 10,
                    borderRadius: 1,
                    backgroundColor: idx < currentIndex ? '#4caf50' :
                                    idx === currentIndex ? '#00897b' : '#e0e0e0'
                  }}
                />
              ))}
            </Box>
          </Paper>

          <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
            <Paper sx={{ p: 3, backgroundColor: '#f0fdf4', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                {currentSentence.parts.map((part, partIndex) => {
                  if (!part.error) {
                    return (
                      <Typography
                        key={partIndex}
                        variant="h6"
                        component="span"
                        sx={{ color: '#1a1a1a' }}
                      >
                        {part.text}{' '}
                      </Typography>
                    )
                  } else {
                    const errorIndex = currentSentence.parts.slice(0, partIndex).filter(p => p.error).length
                    return (
                      <Box key={partIndex} sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          variant="h6"
                          component="span"
                          sx={{
                            color: '#00897b',
                            fontWeight: 'bold',
                            fontStyle: 'italic'
                          }}
                        >
                          ({part.text})
                        </Typography>
                        <TextField
                          size="small"
                          value={completions[currentIndex][errorIndex] || ''}
                          onChange={(e) => handleCompletionChange(errorIndex, e.target.value)}
                          placeholder="..."
                          variant="outlined"
                          sx={{
                            minWidth: '180px',
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: '#e0f2f1',
                              fontSize: '1.1rem',
                              border: '2px solid #00897b'
                            }
                          }}
                        />
                      </Box>
                    )
                  }
                })}
              </Box>
            </Paper>

            <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mt: 3 }}>
              <Button
                variant="outlined"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                sx={{ borderColor: '#00897b', color: '#00897b' }}
              >
                ← Previous
              </Button>

              {currentIndex < CLAUSE_SENTENCES.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!allFilled}
                  sx={{
                    background: 'linear-gradient(135deg, #00897b 0%, #00695c 100%)'
                  }}
                >
                  Next Sentence →
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSubmit}
                  disabled={!completions.every(c => c.every(answer => answer.trim().length > 0))}
                >
                  Submit Conquest ⚔️
                </Button>
              )}
            </Stack>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Jump to sentence:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {CLAUSE_SENTENCES.map((_, idx) => (
                <Button
                  key={idx}
                  size="small"
                  variant={idx === currentIndex ? 'contained' : 'outlined'}
                  onClick={() => setCurrentIndex(idx)}
                  sx={{
                    minWidth: 40,
                    ...(idx === currentIndex && {
                      background: 'linear-gradient(135deg, #00897b 0%, #00695c 100%)'
                    })
                  }}
                >
                  {idx + 1} {completions[idx].every(c => c.trim()) && '✓'}
                </Button>
              ))}
            </Stack>
          </Paper>
        </Box>
      ) : (
        <Box>
          <Paper elevation={6} sx={{ p: 4, mb: 3, textAlign: 'center', backgroundColor: score === 6 ? 'success.light' : 'warning.light' }}>
            <Typography variant="h4" gutterBottom color={score === 6 ? 'success.dark' : 'warning.dark'} fontWeight="bold">
              {score === 6 ? '⚔️ Perfect Conquest! ⚔️' : '🌟 Conquest Complete! 🌟'}
            </Typography>
            <Typography variant="h6" color="text.primary">
              You scored {score} out of 6 points!
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
              Clause Review:
            </Typography>
            <Stack spacing={3}>
              {results.map((result, index) => {
                const sentence = result.sentence
                const errors = sentence.parts.filter(p => p.error)

                return (
                  <Alert key={index} severity={result.isCorrect ? 'success' : 'error'} icon={result.isCorrect ? <CheckCircle /> : <ErrorOutline />}>
                    <Typography variant="body2" fontWeight="bold" gutterBottom>
                      Sentence {index + 1}
                    </Typography>

                    {errors.map((error, errIdx) => (
                      <Box key={errIdx} sx={{ mt: 1 }}>
                        <Typography variant="body2">
                          Your answer: <strong>{result.userCompletions[errIdx] || '(empty)'}</strong>
                        </Typography>
                        {result.userCompletions[errIdx].toLowerCase().trim() !== error.correct.toLowerCase().trim() && (
                          <Typography variant="body2" color="success.dark">
                            ✅ Correct: <strong>{error.correct}</strong>
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Alert>
                )
              })}
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
