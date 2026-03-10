import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Alert, TextField, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { ErrorOutline, CheckCircle } from '@mui/icons-material'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 4 - Remedial B2 - Task D: Error Correction Game
 * Correct errors by replacing crossed-out words
 * Score: +1 for each correct correction (6 total)
 * ESL Games Plus inspired design
 */

const ERROR_SENTENCES = [
  {
    id: 1,
    parts: [
      { text: 'Promotional advertising', error: false },
      { text: 'are', error: true, correct: 'is' },
      { text: 'to sell but it', error: false },
      { text: 'lack', error: true, correct: 'lacks' },
      { text: 'persuasive.', error: false }
    ],
    fullCorrect: 'Promotional advertising is to sell but it lacks persuasive.',
    hints: ['subject-verb agreement: are → is', 'singular verb: lack → lacks']
  },
  {
    id: 2,
    parts: [
      { text: 'The gatefold which', error: false },
      { text: 'provide', error: true, correct: 'provides' },
      { text: 'space in posters', error: false },
      { text: 'are', error: true, correct: 'is highly' },
      { text: 'effective.', error: false }
    ],
    fullCorrect: 'The gatefold which provides space in posters is highly effective.',
    hints: ['provides (singular)', 'is highly (singular verb)']
  },
  {
    id: 3,
    parts: [
      { text: 'Dramatisation in video 2', error: false },
      { text: 'were', error: true, correct: 'was' },
      { text: 'used to engage but it', error: false },
      { text: 'feel', error: true, correct: 'felt' },
      { text: 'contrived.', error: false }
    ],
    fullCorrect: 'Dramatisation in video 2 was used to engage but it felt contrived.',
    hints: ['singular verb: were → was', 'past tense: feel → felt']
  },
  {
    id: 4,
    parts: [
      { text: 'Persuasive appeals which', error: false },
      { text: 'is', error: true, correct: 'are' },
      { text: 'based on ethos pathos logos', error: false },
      { text: 'is', error: true, correct: 'are' },
      { text: 'powerful.', error: false }
    ],
    fullCorrect: 'Persuasive appeals which are based on ethos pathos logos are powerful.',
    hints: ['plural verb: is → are (first)', 'plural verb: is → are (second)']
  },
  {
    id: 5,
    parts: [
      { text: 'Targeted ads', error: false },
      { text: 'has', error: true, correct: 'have' },
      { text: 'become more precise but raise ethical', error: false },
      { text: 'issue', error: true, correct: 'issues' },
      { text: '.', error: false }
    ],
    fullCorrect: 'Targeted ads have become more precise but raise ethical issues.',
    hints: ['have (plural)', 'issues (plural)']
  },
  {
    id: 6,
    parts: [
      { text: 'Creative execution', error: false },
      { text: 'stand', error: true, correct: 'stands' },
      { text: 'out but', error: false },
      { text: 'need', error: true, correct: 'needs' },
      { text: 'consistent with brand.', error: false }
    ],
    fullCorrect: 'Creative execution stands out but needs consistent with brand.',
    hints: ['singular verb: stand → stands', 'singular verb: need → needs']
  }
]

export default function RemedialB2TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 4, context: 'remedial_b2' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [corrections, setCorrections] = useState(
    ERROR_SENTENCES.map(sentence =>
      sentence.parts.filter(p => p.error).map(() => '')
    )
  )
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState([])
  const [score, setScore] = useState(0)

  const currentSentence = ERROR_SENTENCES[currentIndex]

  const handleCorrectionChange = (errorIndex, value) => {
    const newCorrections = [...corrections]
    newCorrections[currentIndex][errorIndex] = value
    setCorrections(newCorrections)
  }

  const handleNext = () => {
    if (currentIndex < ERROR_SENTENCES.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const checkCorrection = (userCorrections, sentence) => {
    const errors = sentence.parts.filter(p => p.error)
    let correctCount = 0

    userCorrections.forEach((userAnswer, idx) => {
      const correct = errors[idx].correct.toLowerCase().trim()
      const user = userAnswer.toLowerCase().trim()

      if (user === correct || correct.includes(user) && user.length >= correct.length * 0.7) {
        correctCount++
      }
    })

    return correctCount === errors.length
  }

  const handleSubmit = async () => {
    const checkResults = corrections.map((userCorrections, index) => {
      const isCorrect = checkCorrection(userCorrections, ERROR_SENTENCES[index])
      return {
        isCorrect,
        userCorrections,
        sentence: ERROR_SENTENCES[index]
      }
    })

    setResults(checkResults)
    const correctCount = checkResults.filter(r => r.isCorrect).length
    setScore(correctCount)
    setSubmitted(true)

    sessionStorage.setItem('remedial_step4_b2_taskD_score', correctCount)
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
          level: 'B2',
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
    navigate('/phase4/step/4/remedial/b2/results')
  }

  const allFilled = corrections[currentIndex].every(c => c.trim().length > 0)
  const progress = ((currentIndex + 1) / ERROR_SENTENCES.length) * 100

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header - ESL Games Plus style (orange/red theme) */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
          color: 'white'
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 4 - Step 4: Remedial Activities
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level B2 - Task D: Correction Crusade 🔧
        </Typography>
        <Typography variant="body1">
          Replace the crossed-out errors with correct words!
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="MS. MABROUKI"
          message="Time to become an error detective! You'll see sentences with errors crossed out. Write the correct word or phrase in the blank space next to each error. Pay attention to subject-verb agreement, verb tense, and missing words!"
        />
      </Paper>

      {!submitted ? (
        <Box>
          {/* Progress Bar */}
          <Paper sx={{ p: 2, mb: 3, backgroundColor: '#fff5f5' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom fontWeight="bold">
              Sentence {currentIndex + 1} of {ERROR_SENTENCES.length}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                mb: 1,
                height: 12,
                borderRadius: 6,
                backgroundColor: '#ffe5e5',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #ff6b6b 0%, #ee5a6f 100%)'
                }
              }}
            />
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              {ERROR_SENTENCES.map((_, idx) => (
                <Box
                  key={idx}
                  sx={{
                    width: '100%',
                    height: 10,
                    borderRadius: 1,
                    backgroundColor: idx < currentIndex ? '#4caf50' :
                                    idx === currentIndex ? '#ff6b6b' : '#e0e0e0'
                  }}
                />
              ))}
            </Box>
          </Paper>

          {/* Current Sentence */}
          <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
              <ErrorOutline sx={{ color: '#ff6b6b', fontSize: 30 }} />
              <Typography variant="h6" color="error" fontWeight="bold">
                Correct the errors:
              </Typography>
            </Stack>

            {/* Sentence with crossed-out errors and input fields */}
            <Paper sx={{ p: 3, backgroundColor: '#fffbf0', borderRadius: 2 }}>
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
                            textDecoration: 'line-through',
                            color: '#d32f2f',
                            fontWeight: 'bold'
                          }}
                        >
                          {part.text}
                        </Typography>
                        <TextField
                          size="small"
                          value={corrections[currentIndex][errorIndex] || ''}
                          onChange={(e) => handleCorrectionChange(errorIndex, e.target.value)}
                          placeholder="..."
                          variant="outlined"
                          sx={{
                            minWidth: '150px',
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: 'white',
                              fontSize: '1.1rem'
                            }
                          }}
                        />
                      </Box>
                    )
                  }
                })}
              </Box>
            </Paper>

            {/* Hints */}
            <Paper sx={{ p: 2, mt: 3, backgroundColor: '#e3f2fd' }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="primary">
                💡 Hints:
              </Typography>
              <Stack spacing={0.5}>
                {currentSentence.hints.map((hint, idx) => (
                  <Typography key={idx} variant="body2" color="text.primary">
                    • {hint}
                  </Typography>
                ))}
              </Stack>
            </Paper>

            {/* Navigation */}
            <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mt: 3 }}>
              <Button
                variant="outlined"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                sx={{ borderColor: '#ff6b6b', color: '#ff6b6b' }}
              >
                ← Previous
              </Button>

              {currentIndex < ERROR_SENTENCES.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!allFilled}
                  sx={{
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)'
                  }}
                >
                  Next Sentence →
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSubmit}
                  disabled={!corrections.every(c => c.every(answer => answer.trim().length > 0))}
                >
                  Submit Corrections 🔧
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
              {ERROR_SENTENCES.map((_, idx) => (
                <Button
                  key={idx}
                  size="small"
                  variant={idx === currentIndex ? 'contained' : 'outlined'}
                  onClick={() => setCurrentIndex(idx)}
                  sx={{
                    minWidth: 40,
                    ...(idx === currentIndex && {
                      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)'
                    })
                  }}
                >
                  {idx + 1} {corrections[idx].every(c => c.trim()) && '✓'}
                </Button>
              ))}
            </Stack>
          </Paper>
        </Box>
      ) : (
        <Box>
          {/* Results */}
          <Paper elevation={6} sx={{ p: 4, mb: 3, textAlign: 'center', backgroundColor: score === 6 ? 'success.light' : 'warning.light' }}>
            <Typography variant="h4" gutterBottom color={score === 6 ? 'success.dark' : 'warning.dark'} fontWeight="bold">
              {score === 6 ? '🔧 Perfect Corrections! 🔧' : '🌟 Crusade Complete! 🌟'}
            </Typography>
            <Typography variant="h6" color="text.primary">
              You scored {score} out of 6 points!
            </Typography>
          </Paper>

          {/* Answer Review */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Correction Review:
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
                          ❌ Error: <span style={{ textDecoration: 'line-through', color: '#d32f2f' }}>{error.text}</span>
                          {' → '}
                          Your answer: <strong>{result.userCorrections[errIdx] || '(empty)'}</strong>
                        </Typography>
                        {result.userCorrections[errIdx].toLowerCase().trim() !== error.correct.toLowerCase().trim() && (
                          <Typography variant="body2" color="success.dark">
                            ✅ Correct: <strong>{error.correct}</strong>
                          </Typography>
                        )}
                      </Box>
                    ))}

                    <Box sx={{ mt: 2, p: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                      <Typography variant="caption" color="text.secondary" fontWeight="bold">
                        Hints:
                      </Typography>
                      {sentence.hints.map((hint, idx) => (
                        <Typography key={idx} variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          • {hint}
                        </Typography>
                      ))}
                    </Box>
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
