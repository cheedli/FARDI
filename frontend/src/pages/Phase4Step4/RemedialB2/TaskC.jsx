import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Alert, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { CheckCircle, Cancel } from '@mui/icons-material'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 4 - Remedial B2 - Task C: Debate Grammar Game (Subjunctives/Modals)
 * Choose correct grammar structures with subjunctives and modals
 * Score: +1 for each correct answer (6 total)
 * Duolingo-inspired design
 */

const GRAMMAR_SENTENCES = [
  {
    id: 1,
    sentence: 'It is crucial that promotional advertising ___ balanced with ethical considerations so as not to alienate the audience.',
    options: [
      'be',
      'is',
      'being',
      'to be'
    ],
    correctAnswer: 'be',
    explanation: 'Use present subjunctive "be" after "It is crucial that..." (formal requirement expression)'
  },
  {
    id: 2,
    sentence: 'Persuasive techniques ___ incorporate pathos only when they are supported by credible ethos, as video 1 illustrates.',
    options: [
      'should',
      'shall',
      'would',
      'could'
    ],
    correctAnswer: 'should',
    explanation: 'Use modal "should" to express recommendation or advisability'
  },
  {
    id: 3,
    sentence: 'If targeted strategies ___ applied without respect for privacy, they ___ erode consumer trust in the long term.',
    options: [
      'are / will',
      'were / might',
      'had been / would have',
      'are / would'
    ],
    correctAnswer: 'were / might',
    explanation: 'Use second conditional (were + might) for hypothetical situations and their possible consequences'
  },
  {
    id: 4,
    sentence: 'It is essential that originality ___ prioritized in creative execution, lest advertisements become forgettable.',
    options: [
      'be',
      'is',
      'should be',
      'will be'
    ],
    correctAnswer: 'be',
    explanation: 'Use present subjunctive "be" after "It is essential that..." (formal requirement)'
  },
  {
    id: 5,
    sentence: 'Dramatisation ___ captivate viewers more deeply if obstacles ___ portrayed as authentic rather than contrived.',
    options: [
      'will / are',
      'could / were',
      'can / will be',
      'might / are'
    ],
    correctAnswer: 'could / were',
    explanation: 'Use modal "could" + second conditional "were" for hypothetical improvement'
  },
  {
    id: 6,
    sentence: 'Ethical advertising ___ remain a non-negotiable priority, even when commercial pressures threaten to compromise integrity.',
    options: [
      'must',
      'should',
      'might',
      'could'
    ],
    correctAnswer: 'must',
    explanation: 'Use modal "must" to express strong necessity or obligation'
  }
]

export default function RemedialB2TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 3, context: 'remedial_b2' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState(Array(GRAMMAR_SENTENCES.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState([])
  const [score, setScore] = useState(0)

  const currentSentence = GRAMMAR_SENTENCES[currentIndex]

  const handleAnswerSelect = (answer) => {
    const newAnswers = [...userAnswers]
    newAnswers[currentIndex] = answer
    setUserAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentIndex < GRAMMAR_SENTENCES.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleSubmit = async () => {
    // Check all answers
    const checkResults = userAnswers.map((answer, index) => {
      const isCorrect = answer === GRAMMAR_SENTENCES[index].correctAnswer
      return {
        userAnswer: answer,
        correctAnswer: GRAMMAR_SENTENCES[index].correctAnswer,
        isCorrect,
        explanation: GRAMMAR_SENTENCES[index].explanation
      }
    })

    setResults(checkResults)
    const correctCount = checkResults.filter(r => r.isCorrect).length
    setScore(correctCount)
    setSubmitted(true)

    // Store result
    sessionStorage.setItem('remedial_step4_b2_taskC_score', correctCount)

    // Log to backend
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
          level: 'B2',
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
    navigate('/phase4/step/4/remedial/b2/taskD')
  }

  const progress = ((currentIndex + 1) / GRAMMAR_SENTENCES.length) * 100

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header - Duolingo-inspired green */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #58cc02 0%, #48a100 100%)',
          color: 'white'
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 4 - Step 4: Remedial Activities
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level B2 - Task C: Debate Grammar Duel ⚔️
        </Typography>
        <Typography variant="body1">
          Master advanced grammar: subjunctives and modals! Duolingo-style challenge.
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="MS. MABROUKI"
          message="Advanced grammar time! You'll practice subjunctives (it is crucial that...) and modals (should, must, might, could). These structures are essential for sophisticated, formal writing. Choose carefully!"
        />
      </Paper>

      {!submitted ? (
        <Box>
          {/* Progress Bar - Duolingo style */}
          <Paper sx={{ p: 2, mb: 3, backgroundColor: '#f7f7f7' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom fontWeight="bold">
              Question {currentIndex + 1} of {GRAMMAR_SENTENCES.length}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                mb: 1,
                height: 12,
                borderRadius: 6,
                backgroundColor: '#e5e5e5',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#58cc02',
                  borderRadius: 6
                }
              }}
            />
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              {GRAMMAR_SENTENCES.map((_, idx) => (
                <Box
                  key={idx}
                  sx={{
                    width: '100%',
                    height: 10,
                    borderRadius: 1,
                    backgroundColor: idx < currentIndex ? '#58cc02' :
                                    idx === currentIndex ? '#ffc800' : '#e5e5e5'
                  }}
                />
              ))}
            </Box>
          </Paper>

          {/* Current Question */}
          <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
            {/* Sentence Display */}
            <Box sx={{ mb: 4, p: 3, backgroundColor: '#f0f9ff', borderRadius: 2, borderLeft: '5px solid #58cc02' }}>
              <Typography variant="h5" gutterBottom sx={{ color: '#1a1a1a' }} fontWeight="medium">
                {currentSentence.sentence}
              </Typography>
            </Box>

            {/* Answer Options - Duolingo-style bubbles */}
            <Stack spacing={2} sx={{ mb: 4 }}>
              {currentSentence.options.map((option, idx) => {
                const isSelected = userAnswers[currentIndex] === option

                return (
                  <Button
                    key={option}
                    variant={isSelected ? 'contained' : 'outlined'}
                    onClick={() => handleAnswerSelect(option)}
                    sx={{
                      p: 2,
                      justifyContent: 'flex-start',
                      fontSize: '1.1rem',
                      fontWeight: 'medium',
                      textTransform: 'none',
                      borderRadius: 2,
                      border: '2px solid',
                      borderColor: isSelected ? '#58cc02' : '#e5e5e5',
                      backgroundColor: isSelected ? '#58cc02' : 'white',
                      color: isSelected ? 'white' : 'text.primary',
                      '&:hover': {
                        backgroundColor: isSelected ? '#48a100' : '#f0f9ff',
                        borderColor: isSelected ? '#48a100' : '#58cc02',
                        transform: 'translateY(-2px)',
                        transition: 'all 0.2s'
                      }
                    }}
                  >
                    {option}
                  </Button>
                )
              })}
            </Stack>

            {/* Real-time Score Display */}
            <Paper
              elevation={2}
              sx={{
                p: 2,
                backgroundColor: '#f0fdf4',
                textAlign: 'center',
                mb: 3,
                border: '2px solid #58cc02'
              }}
            >
              <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
                {GRAMMAR_SENTENCES.map((sentence, idx) => {
                  const userAnswer = userAnswers[idx]
                  const isCorrect = userAnswer === sentence.correctAnswer
                  const isAnswered = userAnswer !== ''

                  return (
                    <Box
                      key={idx}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        minWidth: 60
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Q{idx + 1}
                      </Typography>
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        sx={{
                          color: !isAnswered ? '#e5e5e5' : isCorrect ? '#58cc02' : '#ff4b4b'
                        }}
                      >
                        {!isAnswered ? '-' : isCorrect ? '✓' : '✗'}
                      </Typography>
                    </Box>
                  )
                })}
              </Stack>
              <Typography variant="h4" fontWeight="bold" sx={{ mt: 2, color: '#58cc02' }}>
                SCORE: {userAnswers.filter((answer, idx) => answer === GRAMMAR_SENTENCES[idx].correctAnswer).length}/{GRAMMAR_SENTENCES.length}
              </Typography>
            </Paper>

            {/* Navigation */}
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Button
                variant="outlined"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                sx={{ borderColor: '#58cc02', color: '#58cc02' }}
              >
                ← Previous
              </Button>

              {currentIndex < GRAMMAR_SENTENCES.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!userAnswers[currentIndex]}
                  sx={{
                    backgroundColor: '#58cc02',
                    '&:hover': { backgroundColor: '#48a100' }
                  }}
                >
                  Next →
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={userAnswers.some(answer => !answer)}
                  sx={{
                    backgroundColor: '#ffc800',
                    color: '#000',
                    '&:hover': { backgroundColor: '#e6b300' }
                  }}
                >
                  Submit Duel ⚔️
                </Button>
              )}
            </Stack>
          </Paper>

          {/* Quick Navigation */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Jump to question:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {GRAMMAR_SENTENCES.map((_, idx) => (
                <Button
                  key={idx}
                  size="small"
                  variant={idx === currentIndex ? 'contained' : 'outlined'}
                  onClick={() => setCurrentIndex(idx)}
                  sx={{
                    minWidth: 40,
                    ...(idx === currentIndex && {
                      backgroundColor: '#58cc02',
                      '&:hover': { backgroundColor: '#48a100' }
                    })
                  }}
                >
                  {idx + 1} {userAnswers[idx] && '✓'}
                </Button>
              ))}
            </Stack>
          </Paper>
        </Box>
      ) : (
        <Box>
          {/* Results */}
          <Paper elevation={6} sx={{ p: 4, mb: 3, textAlign: 'center', backgroundColor: score === 6 ? '#f0fdf4' : '#fff7ed' }}>
            <Typography variant="h4" gutterBottom color={score === 6 ? 'success.dark' : 'warning.dark'} fontWeight="bold">
              {score === 6 ? '⚔️ Perfect Grammar Duel! ⚔️' : '🌟 Duel Complete! 🌟'}
            </Typography>
            <Typography variant="h6" color="text.primary">
              You scored {score} out of 6 points!
            </Typography>
          </Paper>

          {/* Answer Review */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Grammar Review:
            </Typography>
            <Stack spacing={2}>
              {results.map((result, index) => (
                <Alert
                  key={index}
                  severity={result.isCorrect ? 'success' : 'error'}
                  icon={result.isCorrect ? <CheckCircle /> : <Cancel />}
                >
                  <Typography variant="body2" fontWeight="bold" gutterBottom>
                    Question {index + 1}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {GRAMMAR_SENTENCES[index].sentence}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Your answer: <strong>{result.userAnswer}</strong>
                  </Typography>
                  {!result.isCorrect && (
                    <Typography variant="body2" color="error.dark" sx={{ mt: 1 }}>
                      Correct answer: <strong>{result.correctAnswer}</strong>
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    💡 {result.explanation}
                  </Typography>
                </Alert>
              ))}
            </Stack>
          </Paper>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={handleContinue}
              size="large"
              sx={{
                backgroundColor: '#58cc02',
                '&:hover': { backgroundColor: '#48a100' }
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
