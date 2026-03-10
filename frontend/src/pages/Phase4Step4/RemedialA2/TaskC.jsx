import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Alert, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { CheckCircle, Cancel, Link as LinkIcon } from '@mui/icons-material'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 4 - Level A2 - Task C: Connector Quest
 * Add "because" or "and" to 6 sentences
 * Score: +1 for each correct connector (6 total)
 */

const SENTENCES = [
  {
    text: 'Poster gatefold _____ lettering.',
    correctConnector: 'and',
    explanation: 'Use "and" to join two equal ideas: gatefold AND lettering'
  },
  {
    text: 'Video animation _____ fun.',
    correctConnector: 'because',
    explanation: 'Use "because" to show reason: animation BECAUSE (it is) fun'
  },
  {
    text: 'Jingle short _____ catchy.',
    correctConnector: 'and',
    explanation: 'Use "and" to join two equal ideas: short AND catchy'
  },
  {
    text: 'Dramatisation story _____ engage.',
    correctConnector: 'because',
    explanation: 'Use "because" to show reason: story BECAUSE (it can) engage'
  },
  {
    text: 'Sketch plan _____ draw.',
    correctConnector: 'and',
    explanation: 'Use "and" to join two equal ideas: plan AND draw'
  },
  {
    text: 'Clip short _____ quick.',
    correctConnector: 'because',
    explanation: 'Use "because" to show reason: short BECAUSE (it is) quick'
  }
]

export default function Phase4Step4RemedialA2TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 3, context: 'remedial_a2' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState(Array(SENTENCES.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState([])
  const [score, setScore] = useState(0)
  const [showFinalResults, setShowFinalResults] = useState(false)
  const [finalScore, setFinalScore] = useState({ taskA: 0, taskB: 0, taskC: 0, total: 0, passed: false })

  const currentSentence = SENTENCES[currentIndex]

  const handleConnectorSelect = (connector) => {
    const newAnswers = [...userAnswers]
    newAnswers[currentIndex] = connector
    setUserAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentIndex < SENTENCES.length - 1) {
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
      const isCorrect = answer === SENTENCES[index].correctConnector
      return {
        userAnswer: answer,
        correctAnswer: SENTENCES[index].correctConnector,
        isCorrect,
        explanation: SENTENCES[index].explanation
      }
    })

    setResults(checkResults)
    const correctCount = checkResults.filter(r => r.isCorrect).length
    setScore(correctCount)
    setSubmitted(true)

    // Store result
    sessionStorage.setItem('phase4_step4_remedial_a2_taskC_score', correctCount)

    // Log to backend
    await logTaskCompletion(correctCount)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: score })
    try {
      const response = await fetch('/api/phase4/step4/remedial/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          level: 'A2',
          task: 'C',
          score: score,
          max_score: 6,
          completed: true
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('[Phase 4 Step 4] A2 Task C completion logged to backend')
      }
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = async () => {
    // Calculate total score from all three tasks
    const taskAScore = parseInt(sessionStorage.getItem('phase4_step4_remedial_a2_taskA_score') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('phase4_step4_remedial_a2_taskB_score') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('phase4_step4_remedial_a2_taskC_score') || '0')
    const totalScore = taskAScore + taskBScore + taskCScore
    const maxScore = 7 + 8 + 6 // 21 total (Task A now worth 7, not 12)
    const threshold = Math.ceil(maxScore * 0.8) // 80% = 17
    const passed = totalScore >= threshold

    console.log('\n' + '='.repeat(60))
    console.log('PHASE 4 STEP 4 - REMEDIAL A2 - FINAL RESULTS')
    console.log('='.repeat(60))
    console.log('Task A (Dialogue Adventure):', taskAScore, '/7')
    console.log('Task B (Expand Empire):', taskBScore, '/8')
    console.log('Task C (Connector Quest):', taskCScore, '/6')
    console.log('-'.repeat(60))
    console.log('TOTAL SCORE:', totalScore, '/', maxScore)
    console.log('PASS THRESHOLD:', threshold, '/', maxScore, '(80%)')
    console.log('-'.repeat(60))
    if (passed) {
      console.log('✅ PASSED - Student will proceed to Dashboard/Next Phase')
    } else {
      console.log('❌ FAILED - Student will repeat Remedial Level A2')
    }
    console.log('='.repeat(60) + '\n')

    // Log final score to backend
    try {
      const response = await fetch('/api/phase4/step4/remedial/a2/final-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          task_a_score: taskAScore,
          task_b_score: taskBScore,
          task_c_score: taskCScore
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('Final A2 score logged to backend:', data.data)
      }
    } catch (error) {
      console.error('Failed to log final score:', error)
    }

    // Show final results
    setFinalScore({ taskA: taskAScore, taskB: taskBScore, taskC: taskCScore, total: totalScore, passed })
    setShowFinalResults(true)

    // Delay navigation to show results
    setTimeout(() => {
      // Clear A2 scores
      sessionStorage.removeItem('phase4_step4_remedial_a2_taskA_score')
      sessionStorage.removeItem('phase4_step4_remedial_a2_taskB_score')
      sessionStorage.removeItem('phase4_step4_remedial_a2_taskC_score')

      if (passed) {
        // Navigate to dashboard or next phase
        navigate('/dashboard')
      } else {
        // Restart from Task A
        navigate('/phase4/step/4/remedial/a2/taskA')
      }
    }, 5000) // 5 second delay
  }

  const progress = ((currentIndex + 1) / SENTENCES.length) * 100

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
        <Typography variant="h4" gutterBottom>
          Phase 4 Step 4: Apply - Remedial Practice
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level A2 - Task C: Connector Quest 🔗
        </Typography>
        <Typography variant="body1">
          Connect sentences to quest for treasure! Choose the right connector (because/and) to link ideas together.
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="MS. MABROUKI"
          message="Excellent work on expanding sentences! Now let's connect them! 🔗 You have 6 sentences with blanks. For each one, choose either 'because' or 'and' to fill the blank. Remember: use 'and' to join equal ideas, use 'because' to show a reason. Think carefully about each sentence!"
        />
      </Paper>

      {!submitted ? (
        <Box>
          {/* Progress Bar */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Sentence {currentIndex + 1} of {SENTENCES.length}
            </Typography>
            <LinearProgress variant="determinate" value={progress} sx={{ mb: 1 }} />
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              {SENTENCES.map((_, idx) => (
                <Box
                  key={idx}
                  sx={{
                    width: '100%',
                    height: 8,
                    borderRadius: 1,
                    backgroundColor: idx < currentIndex ? 'success.main' :
                                    idx === currentIndex ? 'primary.main' : 'grey.300'
                  }}
                />
              ))}
            </Box>
          </Paper>

          {/* Current Sentence */}
          <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
            {/* Visual game-like display */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h3" gutterBottom color="primary" fontWeight="bold">
                {currentIndex + 1}. {currentSentence.text.replace('_____', '___')}
              </Typography>
            </Box>

            {/* Connector Buttons (large circular buttons) */}
            <Stack direction="row" spacing={3} justifyContent="center" sx={{ mb: 4 }}>
              <Button
                variant={userAnswers[currentIndex] === 'because' ? 'contained' : 'outlined'}
                onClick={() => handleConnectorSelect('because')}
                sx={{
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  backgroundColor: userAnswers[currentIndex] === 'because' ? 'success.main' : 'white',
                  color: userAnswers[currentIndex] === 'because' ? 'white' : 'primary.main',
                  border: '4px solid',
                  borderColor: userAnswers[currentIndex] === 'because' ? 'success.dark' : 'primary.main',
                  '&:hover': {
                    backgroundColor: userAnswers[currentIndex] === 'because' ? 'success.dark' : 'success.light',
                    transform: 'scale(1.05)',
                    transition: 'all 0.2s'
                  }
                }}
              >
                because
              </Button>

              <Button
                variant={userAnswers[currentIndex] === 'and' ? 'contained' : 'outlined'}
                onClick={() => handleConnectorSelect('and')}
                sx={{
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  backgroundColor: userAnswers[currentIndex] === 'and' ? 'warning.main' : 'white',
                  color: userAnswers[currentIndex] === 'and' ? 'white' : 'primary.main',
                  border: '4px solid',
                  borderColor: userAnswers[currentIndex] === 'and' ? 'warning.dark' : 'primary.main',
                  '&:hover': {
                    backgroundColor: userAnswers[currentIndex] === 'and' ? 'warning.dark' : 'warning.light',
                    transform: 'scale(1.05)',
                    transition: 'all 0.2s'
                  }
                }}
              >
                and
              </Button>
            </Stack>

            {/* Helper Info */}
            <Paper sx={{ p: 2, backgroundColor: 'info.light', mb: 3 }}>
              <Stack direction="row" spacing={4} justifyContent="center">
                <Box>
                  <Typography variant="subtitle2" color="success.dark" fontWeight="bold">
                    <LinkIcon sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                    "because" = reason
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Shows why something happens
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="warning.dark" fontWeight="bold">
                    <LinkIcon sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                    "and" = join equal ideas
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Connects two similar things
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            {/* Score Display - Real-time scoring */}
            <Paper
              elevation={2}
              sx={{
                p: 2,
                backgroundColor: 'success.light',
                textAlign: 'center',
                mb: 3
              }}
            >
              <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
                {SENTENCES.map((sentence, idx) => {
                  const userAnswer = userAnswers[idx]
                  const isCorrect = userAnswer === sentence.correctConnector
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
                          color: !isAnswered ? 'grey.400' : isCorrect ? 'success.dark' : 'error.main'
                        }}
                      >
                        {!isAnswered ? '-' : isCorrect ? '+1' : '0'}
                      </Typography>
                    </Box>
                  )
                })}
              </Stack>
              <Typography variant="h4" fontWeight="bold" sx={{ mt: 2, color: 'success.dark' }}>
                SCORE: {userAnswers.filter((answer, idx) => answer === SENTENCES[idx].correctConnector).length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Answered: {userAnswers.filter(a => a).length} / {SENTENCES.length}
              </Typography>
            </Paper>

            {/* Navigation */}
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Button
                variant="outlined"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                ← Previous
              </Button>

              {currentIndex < SENTENCES.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!userAnswers[currentIndex]}
                >
                  Next →
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSubmit}
                  disabled={userAnswers.some(answer => !answer)}
                >
                  Submit Quest
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
              {SENTENCES.map((_, idx) => (
                <Button
                  key={idx}
                  size="small"
                  variant={idx === currentIndex ? 'contained' : 'outlined'}
                  onClick={() => setCurrentIndex(idx)}
                  sx={{ minWidth: 40 }}
                >
                  {idx + 1} {userAnswers[idx] && '✓'}
                </Button>
              ))}
            </Stack>
          </Paper>
        </Box>
      ) : !showFinalResults ? (
        <Box>
          {/* Results */}
          <Paper elevation={6} sx={{ p: 4, mb: 3, textAlign: 'center', backgroundColor: 'success.light' }}>
            <Typography variant="h4" gutterBottom color="success.dark">
              {score === 6 ? '🔗 Perfect Connection! 🔗' : '🌟 Good Quest! 🌟'}
            </Typography>
            <Typography variant="h6" color="text.primary">
              You scored {score} out of 6 points!
            </Typography>
          </Paper>

          {/* Answer Review */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Connector Review:
            </Typography>
            <Stack spacing={2}>
              {results.map((result, index) => (
                <Alert
                  key={index}
                  severity={result.isCorrect ? 'success' : 'error'}
                  icon={result.isCorrect ? <CheckCircle /> : <Cancel />}
                >
                  <Typography variant="body2" gutterBottom>
                    <strong>Sentence {index + 1}:</strong> {SENTENCES[index].text.replace('_____', `[${result.userAnswer || '?'}]`)}
                  </Typography>
                  {!result.isCorrect && (
                    <Typography variant="body2" color="error.dark" sx={{ mt: 1 }}>
                      Correct answer: <strong>{result.correctAnswer}</strong>
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    {result.explanation}
                  </Typography>
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
              View Final Results
            </Button>
          </Stack>
        </Box>
      ) : (
        /* Final Results - Pass/Fail */
        <Paper
          elevation={8}
          sx={{
            p: 5,
            textAlign: 'center',
            backgroundColor: finalScore.passed ? 'success.main' : 'warning.main',
            color: 'white'
          }}
        >
          <Typography variant="h3" gutterBottom fontWeight="bold">
            {finalScore.passed ? '🎉 Congratulations!' : '💪 Keep Practicing!'}
          </Typography>

          <Box sx={{ my: 3 }}>
            <Typography variant="h5" gutterBottom>
              Phase 4 Step 4 - Remedial A2 - Final Results
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Task A (Dialogue Adventure): {finalScore.taskA} / 7
            </Typography>
            <Typography variant="h6">
              Task B (Expand Empire): {finalScore.taskB} / 8
            </Typography>
            <Typography variant="h6">
              Task C (Connector Quest): {finalScore.taskC} / 6
            </Typography>
            <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>
              Total Score: {finalScore.total} / 21
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
              Pass Threshold: 17 / 21 (80%)
            </Typography>
          </Box>

          {finalScore.passed ? (
            <Box>
              <Typography variant="h6" sx={{ mt: 3 }}>
                ✅ You have passed Remedial A2!
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                Proceeding to Dashboard...
              </Typography>
            </Box>
          ) : (
            <Box>
              <Typography variant="h6" sx={{ mt: 3 }}>
                ❌ Score below passing threshold
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                Restarting Remedial A2 to help you improve...
              </Typography>
            </Box>
          )}

          <Typography variant="body2" sx={{ mt: 3, opacity: 0.8 }}>
            Redirecting in 5 seconds...
          </Typography>
        </Paper>
      )}
    </Box>
  )
}
