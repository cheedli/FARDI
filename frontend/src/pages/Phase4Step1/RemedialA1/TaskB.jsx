import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import WordleGame from '../../../components/WordleGame.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Level A1 - Task B: Wordle-style Word Guessing Game
 * Guess promotion words letter by letter, Wordle-style
 */

const SENTENCES = [
  {
    sentence: 'Make a [____].',
    answer: 'poster'
  },
  {
    sentence: 'Create a [____].',
    answer: 'video'
  },
  {
    sentence: 'Use a catchy [____].',
    answer: 'slogan'
  },
  {
    sentence: 'Look at the big [____].',
    answer: 'billboard'
  },
  {
    sentence: 'Watch the TV [____].',
    answer: 'commercial'
  },
  {
    sentence: 'That bright image is a real [____].',
    answer: 'eye-catcher'
  },
  {
    sentence: 'The best product [____].',
    answer: 'feature'
  },
  {
    sentence: 'Read the general [____].',
    answer: 'ad'
  }
]

export default function RemedialA1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 2, context: 'remedial_a1' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameResult, setGameResult] = useState(null)
  const [showFinalResults, setShowFinalResults] = useState(false)
  const [finalScore, setFinalScore] = useState({ taskA: 0, taskB: 0, total: 0, passed: false })

  const handleGameComplete = (result) => {
    console.log('Wordle game completed:', result)
    setGameCompleted(true)
    setGameResult(result)

    // Store result
    const score = result.score || 0
    sessionStorage.setItem('remedial_a1_taskB_score', score)

    // Log to backend
    logTaskCompletion(score, result.completed)
  }

  const logTaskCompletion = async (score, completed) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score: score })
    try {
      const response = await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          level: 'A1',
          task: 'B',
          score: score,
          max_score: SENTENCES.length,
          completed: completed
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('Task B completion logged to backend')
      }
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = async () => {
    // Calculate total score from both tasks
    const taskAScore = parseInt(sessionStorage.getItem('remedial_a1_taskA_score') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('remedial_a1_taskB_score') || '0')
    const totalScore = taskAScore + taskBScore
    const passed = totalScore >= 13

    console.log('\n' + '='.repeat(60))
    console.log('REMEDIAL A1 - FINAL RESULTS')
    console.log('='.repeat(60))
    console.log('Task A (Matching):', taskAScore, '/8')
    console.log('Task B (Wordle):', taskBScore, '/8')
    console.log('-'.repeat(60))
    console.log('TOTAL SCORE:', totalScore, '/16')
    console.log('PASS THRESHOLD: 13/16')
    console.log('-'.repeat(60))
    if (passed) {
      console.log('✅ PASSED - Student will proceed to Phase 4 Step 2')
    } else {
      console.log('❌ FAILED - Student will repeat Remedial Level A1')
    }
    console.log('='.repeat(60) + '\n')

    // Log final score to backend
    try {
      const response = await fetch('/api/phase4/remedial/a1/final-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          task_a_score: taskAScore,
          task_b_score: taskBScore
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
    setFinalScore({ taskA: taskAScore, taskB: taskBScore, total: totalScore, passed })
    setShowFinalResults(true)

    // Delay navigation to show results
    setTimeout(() => {
      // Clear A1 scores
      sessionStorage.removeItem('remedial_a1_taskA_score')
      sessionStorage.removeItem('remedial_a1_taskB_score')

      if (passed) {
        // Navigate to Phase 4 Step 2 intro
        navigate('/phase4/step/2')
      } else {
        // Restart from Task A
        navigate('/phase4/remedial/a1/taskA')
      }
    }, 5000) // 5 second delay
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
        <Typography variant="h4" gutterBottom>
          Marketing & Promotion Practice
        </Typography>
        <Typography variant="h5" gutterBottom>
          Task B: Wordle Word Puzzle
        </Typography>
        <Typography variant="body1">
          Guess the promotion words letter by letter, just like Wordle! You have 6 attempts per word.
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="MS. MABROUKI"
          message="Great job on Task A! Now let's practice using these words in sentences. For each sentence, guess the missing word letter by letter, like Wordle! Green means correct letter in correct position, yellow means correct letter in wrong position. You have 6 attempts per word!"
        />
      </Paper>

      {/* Wordle Game */}
      <Box>
        <WordleGame
          sentences={SENTENCES}
          onComplete={handleGameComplete}
        />
      </Box>

      {/* Navigation */}
      {gameCompleted && gameResult && (
        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="success"
            onClick={handleContinue}
            size="large"
          >
            Continue to Next Task
          </Button>
        </Stack>
      )}

      {/* Completion Summary */}
      {gameCompleted && gameResult && !showFinalResults && (
        <Paper elevation={6} sx={{ p: 4, mt: 3, textAlign: 'center', backgroundColor: 'success.light' }}>
          <Typography variant="h4" gutterBottom color="success.dark">
            {gameResult.score === SENTENCES.length ? 'Perfect Score!' : 'Well Done!'}
          </Typography>
          <Typography variant="h6" color="text.primary">
            You scored {gameResult.score} out of {SENTENCES.length} points!
          </Typography>
          {gameResult.score === SENTENCES.length && (
            <Typography variant="body1" sx={{ mt: 2 }} color="text.secondary">
              Amazing! You got every word correct!
            </Typography>
          )}
        </Paper>
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
              Remedial A1 - Final Results
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Task A (Matching): {finalScore.taskA} / 8
            </Typography>
            <Typography variant="h6">
              Task B (Wordle): {finalScore.taskB} / 8
            </Typography>
            <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>
              Total Score: {finalScore.total} / 16
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
              Pass Threshold: 13 / 16
            </Typography>
          </Box>

          {finalScore.passed ? (
            <Box>
              <Typography variant="h6" sx={{ mt: 3 }}>
                ✅ You have passed Remedial A1!
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                Proceeding to Step 2...
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
