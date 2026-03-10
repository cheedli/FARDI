import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import SimpleLineMatchingGame from '../../../components/SimpleLineMatchingGame.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Level B1 - Task D: Match Master
 * Timed matching game for marketing terms and examples
 */

const MATCHING_PAIRS = [
  {
    term: 'billboard',
    example: 'Large highway sign'
  },
  {
    term: 'commercial',
    example: 'TV advertisement clip'
  },
  {
    term: 'slogan',
    example: '"Just Do It" phrase'
  },
  {
    term: 'eye-catcher',
    example: 'Bright color advertisement'
  },
  {
    term: 'feature',
    example: 'Highlighted product characteristic'
  },
  {
    term: 'flyer',
    example: 'Handout paper'
  },
  {
    term: 'leaflet',
    example: 'Information brochure'
  },
  {
    term: 'ad',
    example: 'General advertisement'
  }
]

export default function RemedialB1TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 4, context: 'remedial_b1' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameResult, setGameResult] = useState(null)
  const [showFinalResults, setShowFinalResults] = useState(false)
  const [finalScore, setFinalScore] = useState({ taskA: 0, taskB: 0, taskC: 0, taskD: 0, total: 0, passed: false })

  const handleGameComplete = (result) => {
    console.log('Match Master completed:', result)
    setGameCompleted(true)
    setGameResult(result)

    // Store result
    const score = result.score || 0
    sessionStorage.setItem('remedial_b1_taskD_score', score)

    // Log to backend
    logTaskCompletion(score, result.timeElapsed)
  }

  const logTaskCompletion = async (score, timeElapsed) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskD', is_correct: true, score: score })
    try {
      const response = await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          level: 'B1',
          task: 'D',
          score: score,
          max_score: MATCHING_PAIRS.length,
          time_taken: timeElapsed,
          completed: true
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('Task D completion logged to backend')
      }
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = async () => {
    // Calculate total score from all 4 tasks
    const taskAScore = parseInt(sessionStorage.getItem('remedial_b1_taskA_score') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('remedial_b1_taskB_score') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('remedial_b1_taskC_score') || '0')
    const taskDScore = parseInt(sessionStorage.getItem('remedial_b1_taskD_score') || '0')
    const totalScore = taskAScore + taskBScore + taskCScore + taskDScore
    const passed = totalScore >= 22

    console.log('\n' + '='.repeat(60))
    console.log('REMEDIAL B1 - FINAL RESULTS')
    console.log('='.repeat(60))
    console.log('Task A (Dialogue):', taskAScore, '/5')
    console.log('Task B (Proposals):', taskBScore, '/8')
    console.log('Task C (Quiz):', taskCScore, '/6')
    console.log('Task D (Matching):', taskDScore, '/8')
    console.log('-'.repeat(60))
    console.log('TOTAL SCORE:', totalScore, '/27')
    console.log('PASS THRESHOLD: 22/27')
    console.log('-'.repeat(60))
    if (passed) {
      console.log('✅ PASSED - Student will proceed to Phase 4 Step 2')
    } else {
      console.log('❌ FAILED - Student will repeat Remedial Level B1')
    }
    console.log('='.repeat(60) + '\n')

    // Log final score to backend
    try {
      const response = await fetch('/api/phase4/remedial/b1/final-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          task_a_score: taskAScore,
          task_b_score: taskBScore,
          task_c_score: taskCScore,
          task_d_score: taskDScore
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('Final B1 score logged to backend:', data.data)
      }
    } catch (error) {
      console.error('Failed to log final score:', error)
    }

    // Show final results
    setFinalScore({ taskA: taskAScore, taskB: taskBScore, taskC: taskCScore, taskD: taskDScore, total: totalScore, passed })
    setShowFinalResults(true)

    // Delay navigation to show results
    setTimeout(() => {
      // Clear B1 scores
      sessionStorage.removeItem('remedial_b1_taskA_score')
      sessionStorage.removeItem('remedial_b1_taskB_score')
      sessionStorage.removeItem('remedial_b1_taskC_score')
      sessionStorage.removeItem('remedial_b1_taskD_score')

      if (passed) {
        // Navigate to Phase 4 Step 2 intro
        navigate('/phase4/step/2')
      } else{
        // Restart from Task A
        navigate('/phase4/remedial/b1/taskA')
      }
    }, 5000) // 5 second delay
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'warning.light', color: 'warning.contrastText' }}>
        <Typography variant="h4" gutterBottom>
          Marketing & Promotion Practice
        </Typography>
        <Typography variant="h5" gutterBottom>
          Task D: Match Master
        </Typography>
        <Typography variant="body1">
          Match marketing terms with their examples as fast as you can!
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="SKANDER"
          message="Final challenge! Match each marketing term with its example by drawing lines. Click a term on the left, then click its matching example on the right. Watch the line appear! The timer starts on your first click. Go!"
        />
      </Paper>

      {/* Simple Line Matching Game */}
      {!gameCompleted && (
        <Box>
          <SimpleLineMatchingGame
            pairs={MATCHING_PAIRS}
            onComplete={handleGameComplete}
          />
        </Box>
      )}

      {/* Navigation */}
      {!showFinalResults && (
        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
          {gameCompleted && (
            <Button
              variant="contained"
              color="success"
              onClick={handleContinue}
              size="large"
            >
              Complete and Continue
            </Button>
          )}
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
              Remedial B1 - Final Results
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Task A (Dialogue): {finalScore.taskA} / 5
            </Typography>
            <Typography variant="h6">
              Task B (Proposals): {finalScore.taskB} / 8
            </Typography>
            <Typography variant="h6">
              Task C (Quiz): {finalScore.taskC} / 6
            </Typography>
            <Typography variant="h6">
              Task D (Matching): {finalScore.taskD} / 8
            </Typography>
            <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>
              Total Score: {finalScore.total} / 27
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
              Pass Threshold: 22 / 27
            </Typography>
          </Box>

          {finalScore.passed ? (
            <Box>
              <Typography variant="h6" sx={{ mt: 3 }}>
                ✅ You have passed Remedial B1!
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
                Restarting Remedial B1 to help you improve...
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
