import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Alert, LinearProgress, Chip } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { CheckCircle, Cancel } from '@mui/icons-material'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 5 - Level A2 - Task C: Connector Quest
 * Choose appropriate connectors for 6 sentences
 * Students select from: and, but, so, because
 * Score: +1 for each correct connector (6 total)
 */

const CONNECTOR_OPTIONS = ['and', 'but', 'so', 'because']

const SENTENCES = [
  {
    part1: 'Poster has gatefold',
    part2: 'video has animation',
    correctConnector: 'and',
    explanation: '"and" joins two equal ideas (gatefold AND animation)'
  },
  {
    part1: 'Slogan is catchy',
    part2: 'poster is memorable',
    correctConnector: 'so',
    explanation: '"so" shows result (catchy LEADS TO memorable)'
  },
  {
    part1: 'Clip is short',
    part2: 'it is easy to watch',
    correctConnector: 'so',
    explanation: '"so" shows result (short LEADS TO easy to watch)'
  },
  {
    part1: 'Jingle is simple',
    part2: 'it is complex',
    correctConnector: 'but',
    explanation: '"but" shows contrast (simple VERSUS complex)'
  },
  {
    part1: 'Video uses dramatisation',
    part2: 'it engages viewers',
    correctConnector: 'because',
    explanation: '"because" shows reason (uses dramatisation FOR THE REASON THAT it engages)'
  },
  {
    part1: 'Poster is colorful',
    part2: 'video is plain',
    correctConnector: 'but',
    explanation: '"but" shows contrast (colorful VERSUS plain)'
  }
]

export default function Phase4Step5RemedialA2TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 3, context: 'remedial_a2' })
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
        explanation: SENTENCES[index].explanation,
        correctSentence: `${SENTENCES[index].part1} ${SENTENCES[index].correctConnector} ${SENTENCES[index].part2}.`
      }
    })

    setResults(checkResults)
    const correctCount = checkResults.filter(r => r.isCorrect).length
    setScore(correctCount)
    setSubmitted(true)

    // Store result
    sessionStorage.setItem('phase4_step5_remedial_a2_taskC_score', correctCount)

    // Log to backend
    await logTaskCompletion(correctCount)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: score })
    try {
      const response = await fetch('/api/phase4/step5/remedial/log', {
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
        console.log('[Phase 4 Step 5] A2 Task C completion logged to backend')
      }
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = async () => {
    // Calculate total score from all three tasks
    const taskAScore = parseInt(sessionStorage.getItem('phase4_step5_remedial_a2_taskA_score') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('phase4_step5_remedial_a2_taskB_score') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('phase4_step5_remedial_a2_taskC_score') || '0')
    const totalScore = taskAScore + taskBScore + taskCScore
    const maxScore = 4 + 8 + 6 // 18 total
    const threshold = Math.ceil(maxScore * 0.8) // 80% = 15
    const passed = totalScore >= threshold

    console.log('\n' + '='.repeat(60))
    console.log('PHASE 4 STEP 5 - REMEDIAL A2 - FINAL RESULTS')
    console.log('='.repeat(60))
    console.log('Task A (Dialogue Adventure):', taskAScore, '/4')
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
      const response = await fetch('/api/phase4/step5/remedial/a2/final-score', {
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
      sessionStorage.removeItem('phase4_step5_remedial_a2_taskA_score')
      sessionStorage.removeItem('phase4_step5_remedial_a2_taskB_score')
      sessionStorage.removeItem('phase4_step5_remedial_a2_taskC_score')

      if (passed) {
        navigate('/phase4/complete')
      } else {
        navigate('/phase4/step/5/remedial/a2/taskA')
      }
    }, 5000)
  }

  const progress = ((currentIndex + 1) / SENTENCES.length) * 100

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 4 Step 5: Evaluate - Remedial Practice
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level A2 - Task C: Connector Quest 🔗
        </Typography>
        <Typography variant="body1">
          Choose the right connector to link ideas!
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="LILIA"
          message="Excellent work! Now let's connect sentences! 🔗 For each sentence pair, choose the best connector: 'and' (join equal ideas), 'but' (show contrast), 'so' (show result), or 'because' (show reason). Choose wisely!"
        />
      </Paper>

      {!submitted ? (
        <Box>
          {/* Progress Bar */}
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              mb: 3,
              height: 10,
              borderRadius: 5,
              backgroundColor: '#e1bee7',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }
            }}
          />

          {/* Current Sentence */}
          <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Chip
                label={`Sentence ${currentIndex + 1} of ${SENTENCES.length}`}
                color="primary"
                sx={{ fontWeight: 'bold' }}
              />
              <Chip
                label={`Answered: ${userAnswers.filter(a => a).length}/${SENTENCES.length}`}
                color="secondary"
                sx={{ fontWeight: 'bold' }}
              />
            </Box>

            {/* Sentence Display */}
            <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f5f5f5', textAlign: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
                {currentSentence.part1}
                <Box component="span" sx={{ mx: 2, px: 3, py: 1, backgroundColor: '#fff', border: '2px dashed #667eea', borderRadius: 2, display: 'inline-block', minWidth: 120 }}>
                  {userAnswers[currentIndex] || '______'}
                </Box>
                {currentSentence.part2}.
              </Typography>
            </Paper>

            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
              Choose the best connector:
            </Typography>

            {/* Connector Options */}
            <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" sx={{ mb: 4 }}>
              {CONNECTOR_OPTIONS.map((connector) => (
                <Button
                  key={connector}
                  variant={userAnswers[currentIndex] === connector ? 'contained' : 'outlined'}
                  onClick={() => handleConnectorSelect(connector)}
                  sx={{
                    minWidth: 120,
                    height: 60,
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    background: userAnswers[currentIndex] === connector
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'white',
                    color: userAnswers[currentIndex] === connector ? 'white' : '#667eea',
                    border: '2px solid #667eea',
                    '&:hover': {
                      background: userAnswers[currentIndex] === connector
                        ? 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
                        : '#f3e5f5',
                      transform: 'scale(1.05)'
                    }
                  }}
                >
                  {connector}
                </Button>
              ))}
            </Stack>

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
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}
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

          {/* Quick Jump */}
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
          <Paper elevation={6} sx={{ p: 4, mb: 3, textAlign: 'center', backgroundColor: 'success.lighter' }}>
            <Typography variant="h4" gutterBottom color="success.dark">
              {score === 6 ? '🔗 Perfect Connection! 🔗' : '🌟 Quest Complete! 🌟'}
            </Typography>
            <Typography variant="h6" color="text.primary">
              Score: {score} / 6
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
                    <strong>Sentence {index + 1}:</strong>
                  </Typography>
                  <Typography variant="body2" color="success.dark" sx={{ fontWeight: 'bold', mb: 1 }}>
                    ✓ Correct: {result.correctSentence}
                  </Typography>
                  {!result.isCorrect && (
                    <Typography variant="body2" color="error.dark" sx={{ mt: 1 }}>
                      Your answer: <strong>{result.userAnswer || 'No answer'}</strong> (should be "<strong>{result.correctAnswer}</strong>")
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    💡 {result.explanation}
                  </Typography>
                </Alert>
              ))}
            </Stack>
          </Paper>

          <Stack direction="row" spacing={2} justifyContent="center">
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
              Phase 4 Step 5 - Remedial A2 - Final Results
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Task A (Dialogue Adventure): {finalScore.taskA} / 4
            </Typography>
            <Typography variant="h6">
              Task B (Expand Empire): {finalScore.taskB} / 8
            </Typography>
            <Typography variant="h6">
              Task C (Connector Quest): {finalScore.taskC} / 6
            </Typography>
            <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>
              Total Score: {finalScore.total} / 18
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
              Pass Threshold: 15 / 18 (80%)
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
