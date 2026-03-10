import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Alert, TextField, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 4 - Remedial C1 - Task C: Tense Odyssey
 * Rewrite 6 sentences using mixed tenses and conditionals
 * Score: +1 for each correct rewrite (6 total)
 */

const TENSE_EXERCISES = [
  {
    id: 1,
    original: 'Originality is new',
    modelAnswer: 'While originality has always been valued in advertising, it would have stood out more if it had been combined with creative execution as video 1 suggests.',
    hints: ['present perfect: has been valued', 'third conditional: would have stood out... if it had been combined']
  },
  {
    id: 2,
    original: 'Persuasive uses ethos/pathos/logos',
    modelAnswer: 'Persuasive techniques, which have been used effectively since early campaigns, would convince audiences more powerfully if pathos were balanced with strong ethos.',
    hints: ['present perfect: have been used', 'second conditional: would convince... if pathos were balanced']
  },
  {
    id: 3,
    original: 'Targeted is for specific group',
    modelAnswer: 'Targeted advertising had already become more precise by the time video 1 was made, and it would increase relevance even further if personalization were applied ethically.',
    hints: ['past perfect: had become', 'second conditional: would increase... if personalization were applied']
  },
  {
    id: 4,
    original: 'Consistent is same style',
    modelAnswer: 'Consistent messaging has proven to build long-term trust, but it would fail if the brand had ignored cultural shifts.',
    hints: ['present perfect: has proven', 'third conditional: would fail... if had ignored']
  },
  {
    id: 5,
    original: 'Dramatisation is story',
    modelAnswer: 'Dramatisation, as video 2 demonstrated, was employed to create emotional engagement, and it would captivate viewers more deeply if obstacles had been more relatable.',
    hints: ['past simple: was employed', 'third conditional: would captivate... if had been']
  },
  {
    id: 6,
    original: 'Ethical is honest',
    modelAnswer: 'Ethical advertising remains essential today, and it would have prevented backlash if brands had avoided exaggeration in the past.',
    hints: ['present simple: remains', 'third conditional: would have prevented... if had avoided']
  }
]

export default function RemedialC1TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 3, context: 'remedial_c1' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [rewrites, setRewrites] = useState(Array(TENSE_EXERCISES.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState([])
  const [score, setScore] = useState(0)

  const currentExercise = TENSE_EXERCISES[currentIndex]

  const handleRewriteChange = (value) => {
    const newRewrites = [...rewrites]
    newRewrites[currentIndex] = value
    setRewrites(newRewrites)
  }

  const handleNext = () => {
    if (currentIndex < TENSE_EXERCISES.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const checkRewrite = (userRewrite, modelAnswer) => {
    const userLower = userRewrite.toLowerCase().trim()

    // Check for key tense markers
    const hasPresentPerfect = userLower.includes('has') || userLower.includes('have')
    const hasPastPerfect = userLower.includes('had')
    const hasConditional = userLower.includes('would')
    const hasIfClause = userLower.includes('if')

    // Must have reasonable length and complexity
    const wordCount = userRewrite.split(/\s+/).length
    const hasComplexStructure = (hasPresentPerfect || hasPastPerfect) && hasConditional

    return wordCount >= 15 && hasComplexStructure
  }

  const handleSubmit = async () => {
    const checkResults = rewrites.map((rewrite, index) => {
      const exercise = TENSE_EXERCISES[index]
      const isCorrect = checkRewrite(rewrite, exercise.modelAnswer)
      return {
        isCorrect,
        userRewrite: rewrite,
        modelAnswer: exercise.modelAnswer
      }
    })

    setResults(checkResults)
    const correctCount = checkResults.filter(r => r.isCorrect).length
    setScore(correctCount)
    setSubmitted(true)

    sessionStorage.setItem('remedial_step4_c1_taskC_score', correctCount)
    await logTaskCompletion(correctCount)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: 'C1',
          task: 'C',
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
    navigate('/phase4/step/4/remedial/c1/taskD')
  }

  const allFilled = rewrites.every(r => r.trim().length > 0)
  const progress = ((currentIndex + 1) / TENSE_EXERCISES.length) * 100

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)',
          color: 'white'
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 4 - Step 4: Remedial Activities
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level C1 - Task C: Tense Odyssey ⏳
        </Typography>
        <Typography variant="body1">
          Journey through tenses! Rewrite simple sentences using mixed tenses and conditionals.
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="MS. MABROUKI"
          message="Welcome to the Tense Odyssey! Transform simple sentences into sophisticated ones using perfect tenses (present perfect, past perfect) and conditionals (second/third conditional). Show analytical depth!"
        />
      </Paper>

      {!submitted ? (
        <Box>
          <Paper sx={{ p: 2, mb: 3, backgroundColor: '#ffe5f1' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom fontWeight="bold">
              Sentence {currentIndex + 1} of {TENSE_EXERCISES.length}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                mb: 1,
                height: 12,
                borderRadius: 6,
                backgroundColor: '#ffcce0',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #e91e63 0%, #c2185b 100%)'
                }
              }}
            />
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              {TENSE_EXERCISES.map((_, idx) => (
                <Box
                  key={idx}
                  sx={{
                    width: '100%',
                    height: 10,
                    borderRadius: 1,
                    backgroundColor: idx < currentIndex ? '#4caf50' :
                                    idx === currentIndex ? '#e91e63' : '#e0e0e0'
                  }}
                />
              ))}
            </Box>
          </Paper>

          <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
            <Box sx={{ mb: 3, p: 3, backgroundColor: '#fff0f5', borderRadius: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Simple sentence:
              </Typography>
              <Typography variant="h5" sx={{ color: '#1a1a1a' }} fontWeight="medium">
                "{currentExercise.original}"
              </Typography>
            </Box>

            <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
              Rewrite using mixed tenses and conditionals:
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={rewrites[currentIndex]}
              onChange={(e) => handleRewriteChange(e.target.value)}
              placeholder="Rewrite with perfect tenses and conditionals..."
              variant="outlined"
              helperText={`Word count: ${rewrites[currentIndex].trim().split(/\s+/).filter(w => w).length} (aim for at least 20 words)`}
            />

            <Paper sx={{ p: 2, mt: 2, backgroundColor: '#e3f2fd' }}>
              <Typography variant="subtitle2" color="primary" fontWeight="bold">
                💡 Grammar hints:
              </Typography>
              {currentExercise.hints.map((hint, idx) => (
                <Typography key={idx} variant="body2" color="text.primary">
                  • {hint}
                </Typography>
              ))}
            </Paper>

            <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mt: 3 }}>
              <Button
                variant="outlined"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                sx={{ borderColor: '#e91e63', color: '#e91e63' }}
              >
                ← Previous
              </Button>

              {currentIndex < TENSE_EXERCISES.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!rewrites[currentIndex].trim()}
                  sx={{
                    background: 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)'
                  }}
                >
                  Next Sentence →
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSubmit}
                  disabled={!allFilled}
                >
                  Submit Odyssey ⏳
                </Button>
              )}
            </Stack>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Jump to sentence:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {TENSE_EXERCISES.map((_, idx) => (
                <Button
                  key={idx}
                  size="small"
                  variant={idx === currentIndex ? 'contained' : 'outlined'}
                  onClick={() => setCurrentIndex(idx)}
                  sx={{
                    minWidth: 40,
                    ...(idx === currentIndex && {
                      background: 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)'
                    })
                  }}
                >
                  {idx + 1} {rewrites[idx].trim() && '✓'}
                </Button>
              ))}
            </Stack>
          </Paper>
        </Box>
      ) : (
        <Box>
          <Paper elevation={6} sx={{ p: 4, mb: 3, textAlign: 'center', backgroundColor: score === 6 ? 'success.light' : 'warning.light' }}>
            <Typography variant="h4" gutterBottom color={score === 6 ? 'success.dark' : 'warning.dark'} fontWeight="bold">
              {score === 6 ? '⏳ Perfect Odyssey! ⏳' : '🌟 Odyssey Complete! 🌟'}
            </Typography>
            <Typography variant="h6" color="text.primary">
              You scored {score} out of 6 points!
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
              Tense Review:
            </Typography>
            <Stack spacing={2}>
              {TENSE_EXERCISES.map((exercise, index) => {
                const result = results[index]
                return (
                  <Alert key={index} severity={result.isCorrect ? 'success' : 'warning'}>
                    <Typography variant="body2" fontWeight="bold" gutterBottom>
                      Original: "{exercise.original}"
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                      Your rewrite: "{result.userRewrite}"
                    </Typography>
                    {!result.isCorrect && (
                      <Typography variant="body2" color="success.dark" sx={{ mt: 1 }}>
                        Model answer: <strong>{result.modelAnswer}</strong>
                      </Typography>
                    )}
                  </Alert>
                )
              })}
            </Stack>
          </Paper>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={handleContinue}
              size="large"
              sx={{
                background: 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)'
              }}
            >
              Continue to Task D →
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  )
}
