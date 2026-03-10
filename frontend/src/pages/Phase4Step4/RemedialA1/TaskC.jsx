import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Alert } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import SentenceBuilder from '../../../components/exercises/SentenceBuilder.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 4 - Level A1 - Task C: Grammar Exercise (Simple Sentences)
 * Write 6 simple sentences describing poster/video following template examples
 */

// Exercise structure for SentenceBuilder component
const SENTENCE_BUILDER_EXERCISE = {
  instruction: 'Complete each sentence following the template',
  templates: [
    'Poster has ___.',
    'Video has ___.',
    '___ is song.',
    '___ is story.',
    'Clip is ___.',
    'Sketch is ___.'
  ],
  correct_answers: [
    'Poster has gatefold.',
    'Video has animation.',
    'Jingle is song.',
    'Dramatisation is story.',
    'Clip is short.',
    'Sketch is plan.'
  ]
}

// For scoring purposes
const SENTENCE_TEMPLATES = [
  { term: 'gatefold', template: 'Poster has gatefold.', subject: 'Poster', verb: 'has', object: 'gatefold' },
  { term: 'animation', template: 'Video has animation.', subject: 'Video', verb: 'has', object: 'animation' },
  { term: 'jingle', template: 'Jingle is song.', subject: 'Jingle', verb: 'is', object: 'song' },
  { term: 'dramatisation', template: 'Dramatisation is story.', subject: 'Dramatisation', verb: 'is', object: 'story' },
  { term: 'clip', template: 'Clip is short.', subject: 'Clip', verb: 'is', object: 'short' },
  { term: 'sketch', template: 'Sketch is plan.', subject: 'Sketch', verb: 'is', object: 'plan' }
]

export default function Phase4Step4RemedialA1TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 3, context: 'remedial_a1' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [showFinalResults, setShowFinalResults] = useState(false)
  const [finalScore, setFinalScore] = useState({ taskA: 0, taskB: 0, taskC: 0, total: 0, passed: false })

  const handleGameComplete = (result) => {
    // SentenceBuilder now awards 1 point per correct sentence
    const score = result.score || 0 // This will be the actual score (1 point per sentence)

    console.log('[Phase 4 Step 4] A1 Task C - Sentence Builder completed')
    console.log('[Phase 4 Step 4] A1 Task C - Score:', score, '/', SENTENCE_TEMPLATES.length)
    console.log('[Phase 4 Step 4] A1 Task C - Result:', result)

    sessionStorage.setItem('phase4_step4_remedial_a1_taskC_score', score)
    logTaskCompletion(score)
    setGameCompleted(true)
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
          level: 'A1',
          task: 'C',
          score: score,
          max_score: 6,
          completed: true
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('[Phase 4 Step 4] A1 Task C completion logged to backend')
      }
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = async () => {
    // Calculate total score from all three tasks
    const taskAScore = parseInt(sessionStorage.getItem('phase4_step4_remedial_a1_taskA_score') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('phase4_step4_remedial_a1_taskB_score') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('phase4_step4_remedial_a1_taskC_score') || '0')
    const totalScore = taskAScore + taskBScore + taskCScore
    const maxScore = 8 + 8 + 6 // 22 total
    const threshold = Math.ceil(maxScore * 0.8) // 80% = 18
    const passed = totalScore >= threshold

    console.log('\n' + '='.repeat(60))
    console.log('PHASE 4 STEP 4 - REMEDIAL A1 - FINAL RESULTS')
    console.log('='.repeat(60))
    console.log('Task A (Matching):', taskAScore, '/8')
    console.log('Task B (Gap Fill):', taskBScore, '/8')
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
      const response = await fetch('/api/phase4/step4/remedial/a1/final-score', {
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
      sessionStorage.removeItem('phase4_step4_remedial_a1_taskA_score')
      sessionStorage.removeItem('phase4_step4_remedial_a1_taskB_score')
      sessionStorage.removeItem('phase4_step4_remedial_a1_taskC_score')

      if (passed) {
        // Navigate to dashboard or next phase
        navigate('/dashboard')
      } else {
        // Restart from Task A
        navigate('/phase4/step/4/remedial/a1/taskA')
      }
    }, 5000) // 5 second delay
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
        <Typography variant="h4" gutterBottom>
          Phase 4 Step 4: Apply - Remedial Practice
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level A1 - Task C: Sentence Builder
        </Typography>
        <Typography variant="body1">
          Write 6 simple sentences following the template examples
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="MS. MABROUKI"
          message="Excellent progress! For the final task, write 6 simple sentences following the examples shown. Use simple present tense and basic structure. You can copy the examples or write your own similar sentences!"
        />
      </Paper>

      {/* Sentence Builder Game */}
      {!gameCompleted && (
        <Box>
          <SentenceBuilder
            exercise={SENTENCE_BUILDER_EXERCISE}
            onComplete={handleGameComplete}
          />
        </Box>
      )}

      {/* Navigation */}
      {gameCompleted && !showFinalResults && (
        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
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
              Phase 4 Step 4 - Remedial A1 - Final Results
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Task A (Term Treasure Hunt): {finalScore.taskA} / 8
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
