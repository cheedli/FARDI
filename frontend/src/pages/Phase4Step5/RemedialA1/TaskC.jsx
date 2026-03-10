import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Stack,
  LinearProgress,
  Chip
} from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 5 - Level A1 - Task C: Grammar Exercise (Simple Sentences)
 * Correct 6 grammar mistakes in simple sentences, gamified as "Sentence Builder"
 * Students type correct sentences directly
 */

const GRAMMAR_FIXES = [
  { id: 1, faulty: 'Poster hav title.', correct: 'Poster has title.' },
  { id: 2, faulty: 'Video hav animation.', correct: 'Video has animation.' },
  { id: 3, faulty: 'Slogan is word.', correct: 'Slogan is words.' },
  { id: 4, faulty: 'Clip is parts.', correct: 'Clip is part.' },
  { id: 5, faulty: 'Jingle is songs.', correct: 'Jingle is song.' },
  { id: 6, faulty: 'Feature is highlights.', correct: 'Feature is highlight.' }
]

export default function Phase4Step5RemedialA1TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 3, context: 'remedial_a1' })
  const [currentSentence, setCurrentSentence] = useState(0)
  const [userAnswer, setUserAnswer] = useState(GRAMMAR_FIXES[0].faulty)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [showFinalResults, setShowFinalResults] = useState(false)
  const [finalScore, setFinalScore] = useState({ taskA: 0, taskB: 0, taskC: 0, total: 0, passed: false })

  const handleCheckSentence = () => {
    const correctAnswer = GRAMMAR_FIXES[currentSentence].correct
    const userAnswerTrimmed = userAnswer.trim().toLowerCase()
    const correctAnswerLower = correctAnswer.toLowerCase()

    const isCorrect = userAnswerTrimmed === correctAnswerLower

    if (isCorrect) {
      setScore(score + 1)
      setFeedback({ type: 'success', message: 'Perfect! +1 point' })
    } else {
      setFeedback({
        type: 'error',
        message: `Incorrect. Correct answer: ${correctAnswer}`
      })
    }

    // Move to next sentence after delay
    setTimeout(() => {
      if (currentSentence < GRAMMAR_FIXES.length - 1) {
        const nextIndex = currentSentence + 1
        setCurrentSentence(nextIndex)
        setUserAnswer(GRAMMAR_FIXES[nextIndex].faulty)
        setFeedback(null)
      } else {
        // All sentences completed
        const finalTaskCScore = isCorrect ? score + 1 : score
        sessionStorage.setItem('phase4_step5_remedial_a1_taskC_score', finalTaskCScore)
        logTaskCompletion(finalTaskCScore)
        setGameCompleted(true)
        setFeedback(null)
      }
    }, 1500)
  }

  const logTaskCompletion = async (taskScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: taskScore })
    try {
      const response = await fetch('/api/phase4/step5/remedial/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          level: 'A1',
          task: 'C',
          score: taskScore,
          max_score: 6,
          completed: true
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('[Phase 4 Step 5] A1 Task C completion logged to backend')
      }
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = async () => {
    // Calculate total score from all three tasks
    const taskAScore = parseInt(sessionStorage.getItem('phase4_step5_remedial_a1_taskA_score') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('phase4_step5_remedial_a1_taskB_score') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('phase4_step5_remedial_a1_taskC_score') || '0')
    const totalScore = taskAScore + taskBScore + taskCScore
    const maxScore = 8 + 8 + 6 // 22 total
    const threshold = Math.ceil(maxScore * 0.8) // 80% = 18
    const passed = totalScore >= threshold

    console.log('\n' + '='.repeat(60))
    console.log('PHASE 4 STEP 5 - REMEDIAL A1 - FINAL RESULTS')
    console.log('='.repeat(60))
    console.log('Task A (Spelling Rescue):', taskAScore, '/8')
    console.log('Task B (Fill Quest):', taskBScore, '/8')
    console.log('Task C (Sentence Builder):', taskCScore, '/6')
    console.log('-'.repeat(60))
    console.log('TOTAL SCORE:', totalScore, '/', maxScore)
    console.log('PASS THRESHOLD:', threshold, '/', maxScore, '(80%)')
    console.log('-'.repeat(60))
    if (passed) {
      console.log('✅ PASSED - Student will proceed to Dashboard/Next Phase')
    } else {
      console.log('❌ FAILED - Student will repeat Remedial Level A1')
    }
    console.log('='.repeat(60) + '\n')

    // Log final score to backend
    try {
      const response = await fetch('/api/phase4/step5/remedial/a1/final-score', {
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
        console.log('Final A1 score logged to backend:', data.data)
      }
    } catch (error) {
      console.error('Failed to log final score:', error)
    }

    // Show final results
    setFinalScore({ taskA: taskAScore, taskB: taskBScore, taskC: taskCScore, total: totalScore, passed })
    setShowFinalResults(true)

    // Delay navigation to show results
    setTimeout(() => {
      // Clear A1 scores
      sessionStorage.removeItem('phase4_step5_remedial_a1_taskA_score')
      sessionStorage.removeItem('phase4_step5_remedial_a1_taskB_score')
      sessionStorage.removeItem('phase4_step5_remedial_a1_taskC_score')

      if (passed) {
        // Navigate to phase4 complete
        navigate('/phase4/complete')
      } else {
        // Restart from Task A
        navigate('/phase4/step/5/remedial/a1/taskA')
      }
    }, 5000) // 5 second delay
  }

  const progress = ((currentSentence + 1) / GRAMMAR_FIXES.length) * 100

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: '#e74c3c', color: 'white' }}>
        <Typography variant="h4" gutterBottom>
          Phase 4 Step 5: Evaluate - Remedial Practice
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level A1 - Task C: Sentence Builder
        </Typography>
        <Typography variant="body1">
          Correct 6 simple grammar mistakes!
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="LILIA"
          message="Excellent progress! For the final task, correct the grammar mistakes in 6 simple sentences. Type the correct version of each sentence!"
        />
      </Paper>

      {/* Game Area */}
      {!gameCompleted && !showFinalResults && (
        <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
          {/* Progress Bar */}
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              mb: 3,
              height: 10,
              borderRadius: 5,
              backgroundColor: '#ffcdd2',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#e74c3c'
              }
            }}
          />

          {/* Sentence Counter */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Chip
              label={`Sentence ${currentSentence + 1} of ${GRAMMAR_FIXES.length}`}
              color="primary"
              sx={{ fontWeight: 'bold' }}
            />
            <Chip
              label={`Score: ${score}/${GRAMMAR_FIXES.length}`}
              color="secondary"
              sx={{ fontWeight: 'bold' }}
            />
          </Box>

          {/* User Input */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              ✏️ Edit and correct the sentence below:
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Edit the sentence to fix the grammar..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={feedback !== null}
              autoFocus
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '1.1rem',
                  fontFamily: 'monospace'
                }
              }}
            />
          </Box>

          {/* Feedback */}
          {feedback && (
            <Paper
              sx={{
                p: 2,
                mb: 3,
                backgroundColor: feedback.type === 'success' ? '#d4edda' : '#f8d7da',
                border: `2px solid ${feedback.type === 'success' ? '#28a745' : '#dc3545'}`
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: feedback.type === 'success' ? '#155724' : '#721c24',
                  fontWeight: 'bold'
                }}
              >
                {feedback.message}
              </Typography>
            </Paper>
          )}

          {/* Check Button */}
          {!feedback && (
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleCheckSentence}
              disabled={!userAnswer.trim()}
              startIcon={<CheckCircleIcon />}
              sx={{
                backgroundColor: '#e74c3c',
                '&:hover': {
                  backgroundColor: '#c0392b'
                },
                py: 1.5
              }}
            >
              Check Sentence
            </Button>
          )}
        </Paper>
      )}

      {/* Navigation after game completion */}
      {gameCompleted && !showFinalResults && (
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="success"
            onClick={handleContinue}
            size="large"
          >
            View Final Results
          </Button>
        </Stack>
      )}

      {/* Final Results - Pass/Fail */}
      {showFinalResults && (
        <Paper
          elevation={8}
          sx={{
            p: 5,
            mt: 3,
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
              Phase 4 Step 5 - Remedial A1 - Final Results
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Task A (Spelling Rescue): {finalScore.taskA} / 8
            </Typography>
            <Typography variant="h6">
              Task B (Fill Quest): {finalScore.taskB} / 8
            </Typography>
            <Typography variant="h6">
              Task C (Sentence Builder): {finalScore.taskC} / 6
            </Typography>
            <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>
              Total Score: {finalScore.total} / 22
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
              Pass Threshold: 18 / 22 (80%)
            </Typography>
          </Box>

          {finalScore.passed ? (
            <Box>
              <Typography variant="h6" sx={{ mt: 3 }}>
                ✅ You have passed Remedial A1!
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
                Restarting Remedial A1 to help you improve...
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
