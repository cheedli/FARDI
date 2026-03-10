import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import ExpandQuestGame from '../../../components/ExpandQuestGame.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Level A2 - Task B: Expand Quest (Sentence Expansion)
 * Expand sentences with "because" or "and" to grow a virtual tree
 */

const PROMPTS = [
  {
    prompt: 'Make poster',
    example: 'Make poster because eye-catcher'
  },
  {
    prompt: 'Create video',
    example: 'Create video and feature cultures'
  },
  {
    prompt: 'Use slogan',
    example: 'Use slogan and billboard'
  },
  {
    prompt: 'Commercial for',
    example: 'Commercial for TV because ad'
  },
  {
    prompt: 'Add feature',
    example: 'Add feature to poster'
  },
  {
    prompt: 'Video with',
    example: 'Video with music because fun'
  },
  {
    prompt: 'Billboard is',
    example: 'Billboard is large ad'
  },
  {
    prompt: 'Eye-catcher in',
    example: 'Eye-catcher in video'
  }
]

export default function RemedialA2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 2, context: 'remedial_a2' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameResult, setGameResult] = useState(null)
  const [showFinalResults, setShowFinalResults] = useState(false)
  const [finalScore, setFinalScore] = useState({ taskA: 0, taskB: 0, total: 0, passed: false })

  const handleGameComplete = (result) => {
    console.log('Expand Quest completed:', result)
    setGameCompleted(true)
    setGameResult(result)

    // Store result
    const score = result.score || 0
    sessionStorage.setItem('remedial_a2_taskB_score', score)

    // Log to backend
    logTaskCompletion(score, result.treeHeight || 0)
  }

  const logTaskCompletion = async (score, treeHeight) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score: score })
    try {
      const response = await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          level: 'A2',
          task: 'B',
          score: score,
          max_score: PROMPTS.length,
          tree_height: treeHeight,
          completed: true
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
    const taskAScore = parseInt(sessionStorage.getItem('remedial_a2_taskA_score') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('remedial_a2_taskB_score') || '0')
    const totalScore = taskAScore + taskBScore
    const passed = totalScore >= 13

    console.log('\n' + '='.repeat(60))
    console.log('REMEDIAL A2 - FINAL RESULTS')
    console.log('='.repeat(60))
    console.log('Task A (Chat Challenge):', taskAScore, '/8')
    console.log('Task B (Expand Quest):', taskBScore, '/8')
    console.log('-'.repeat(60))
    console.log('TOTAL SCORE:', totalScore, '/16')
    console.log('PASS THRESHOLD: 13/16')
    console.log('-'.repeat(60))
    if (passed) {
      console.log('✅ PASSED - Student will proceed to Phase 4 Step 2')
    } else {
      console.log('❌ FAILED - Student will repeat Remedial Level A2')
    }
    console.log('='.repeat(60) + '\n')

    // Log final score to backend
    try {
      const response = await fetch('/api/phase4/remedial/a2/final-score', {
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
        console.log('Final A2 score logged to backend:', data.data)
      }
    } catch (error) {
      console.error('Failed to log final score:', error)
    }

    // Show final results
    setFinalScore({ taskA: taskAScore, taskB: taskBScore, total: totalScore, passed })
    setShowFinalResults(true)

    // Delay navigation to show results
    setTimeout(() => {
      // Clear A2 scores
      sessionStorage.removeItem('remedial_a2_taskA_score')
      sessionStorage.removeItem('remedial_a2_taskB_score')

      if (passed) {
        // Navigate to Phase 4 Step 2 intro
        navigate('/phase4/step/2')
      } else {
        // Restart from Task A
        navigate('/phase4/remedial/a2/taskA')
      }
    }, 5000) // 5 second delay
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'secondary.light', color: 'secondary.contrastText' }}>
        <Typography variant="h4" gutterBottom>
          Marketing & Promotion Practice
        </Typography>
        <Typography variant="h5" gutterBottom>
          Task B: Expand Quest
        </Typography>
        <Typography variant="body1">
          Expand sentences to make your tree grow! Use "because" or "and" to add more details.
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="MS. MABROUKI"
          message="Great work on Task A! Now let's practice making longer sentences. Expand each sentence using 'because' or 'and' - the longer your sentences, the taller your tree grows!"
        />
      </Paper>

      {/* Expand Quest Game */}
      {!gameCompleted && (
        <Box>
          <ExpandQuestGame
            prompts={PROMPTS}
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
              Remedial A2 - Final Results
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Task A (Chat Challenge): {finalScore.taskA} / 8
            </Typography>
            <Typography variant="h6">
              Task B (Expand Quest): {finalScore.taskB} / 8
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
                ✅ You have passed Remedial A2!
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
