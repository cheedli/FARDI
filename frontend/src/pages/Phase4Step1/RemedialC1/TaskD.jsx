import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import QuizletLiveDebateGame from '../../../components/QuizletLiveDebateGame.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const DEBATE_PROMPTS = [
  {
    prompt: 'Geotargeting vs remarketing: Which is more effective for local poster campaigns?',
    example: 'Geotargeting for poster local'
  }
]

const GLOSSARY_TERMS = [
  'geotargeting', 'remarketing', 'guerilla', 'surrogate',
  'billboard', 'viral', 'infomercial', 'commercial',
  'targeted', 'engaging', 'eye-catcher', 'slogan'
]

export default function RemedialC1TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 4, context: 'remedial_c1' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameResult, setGameResult] = useState(null)
  const [showFinalResults, setShowFinalResults] = useState(false)
  const [finalScore, setFinalScore] = useState(null)

  const handleGameComplete = (result) => {
    console.log('C1 Quizlet Live Debate completed:', result)

    sessionStorage.setItem('remedial_c1_taskD_score', result.score)

    console.log('✅ Task D Score stored in sessionStorage:', {
      score: sessionStorage.getItem('remedial_c1_taskD_score')
    })

    setGameCompleted(true)
    setGameResult(result)

    logTaskCompletion(result.score, result.responses)
  }

  const logTaskCompletion = async (score, responses) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskD', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: 'C1',
          task: 'D',
          score: score,
          max_score: DEBATE_PROMPTS.length,
          responses: responses,
          completed: true
        })
      })
    } catch (error) {
      console.error('Failed to log:', error)
    }
  }

  const handleContinue = async () => {
    // Get all task scores from sessionStorage
    console.log('🔍 DEBUG: Retrieving scores from sessionStorage...')
    console.log('Raw Task A:', sessionStorage.getItem('remedial_c1_taskA_score'))
    console.log('Raw Task B:', sessionStorage.getItem('remedial_c1_taskB_score'))
    console.log('Raw Task C:', sessionStorage.getItem('remedial_c1_taskC_score'))
    console.log('Raw Task D:', sessionStorage.getItem('remedial_c1_taskD_score'))

    const taskAScore = parseInt(sessionStorage.getItem('remedial_c1_taskA_score') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('remedial_c1_taskB_score') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('remedial_c1_taskC_score') || '0')
    const taskDScore = parseInt(sessionStorage.getItem('remedial_c1_taskD_score') || '0')

    console.log('🔍 DEBUG: Parsed scores:')
    console.log('Task A Score:', taskAScore)
    console.log('Task B Score:', taskBScore)
    console.log('Task C Score:', taskCScore)
    console.log('Task D Score:', taskDScore)

    const totalScore = taskAScore + taskBScore + taskCScore + taskDScore
    const passed = totalScore >= 16

    // FORMATTED CONSOLE OUTPUT
    console.log('\n' + '='.repeat(60))
    console.log('REMEDIAL C1 - FINAL ASSESSMENT')
    console.log('='.repeat(60))
    console.log(`Task A (Debate Duel):        ${taskAScore}/4 points`)
    console.log(`Task B (Critique Challenge): ${taskBScore}/8 points`)
    console.log(`Task C (Wordshake):          ${taskCScore}/6 points`)
    console.log(`Task D (Live Debate):        ${taskDScore}/1 points`)
    console.log('-'.repeat(60))
    console.log(`TOTAL SCORE: ${totalScore}/19 points`)
    console.log(`PASS THRESHOLD: 16/19 points`)
    console.log(`RESULT: ${passed ? '✅ PASSED' : '❌ FAILED'}`)
    console.log('-'.repeat(60))
    if (passed) {
      console.log('Student will proceed to Phase 4 Step 2')
    } else {
      console.log('Student will repeat Remedial Level C1')
    }
    console.log('='.repeat(60) + '\n')

    // Log final score to backend
    try {
      const response = await fetch('/api/phase4/remedial/c1/final-score', {
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
        console.log('Final C1 score logged to backend:', data.data)
      }
    } catch (error) {
      console.error('Failed to log final score:', error)
    }

    // Show final results
    setFinalScore({ taskA: taskAScore, taskB: taskBScore, taskC: taskCScore, taskD: taskDScore, total: totalScore, passed })
    setShowFinalResults(true)

    // Delay navigation to show results
    setTimeout(() => {
      // Clear C1 scores
      sessionStorage.removeItem('remedial_c1_taskA_score')
      sessionStorage.removeItem('remedial_c1_taskB_score')
      sessionStorage.removeItem('remedial_c1_taskC_score')
      sessionStorage.removeItem('remedial_c1_taskD_score')

      if (passed) {
        // Navigate to Phase 4 Step 2 intro
        navigate('/phase4/step/2')
      } else {
        // Restart from Task A
        navigate('/phase4/remedial/c1/taskA')
      }
    }, 5000) // 5 second delay
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 4, mb: 3, background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)', color: 'white' }}>
        <Typography variant="h3" gutterBottom fontWeight="bold">👥 Quizlet Live Debate</Typography>
        <Typography variant="h5" gutterBottom>Level C1 - Task D: Advanced Marketing Debate</Typography>
        <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
          Engage in sophisticated debates using at least 4 advanced marketing terms per response!
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="EMNA"
          message="This is the ultimate C1 challenge! Provide nuanced, sophisticated responses to complex marketing debates. Use at least 4 advanced terms in each response to demonstrate mastery!"
        />
      </Paper>

      {/* Game Complete - Show Continue Button */}
      {gameCompleted && !showFinalResults && (
        <Paper elevation={6} sx={{ p: 4, mb: 3, textAlign: 'center', backgroundColor: 'success.light' }}>
          <Typography variant="h4" gutterBottom fontWeight="bold" color="success.dark">
            🎉 Task D Complete!
          </Typography>
          <Typography variant="h6" sx={{ mb: 3, color: 'text.primary' }}>
            Score: {gameResult?.score}/{DEBATE_PROMPTS.length}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleContinue}
            sx={{ px: 6, py: 1.5 }}
          >
            Continue to Final Results
          </Button>
        </Paper>
      )}

      {/* Final Results - Pass/Fail */}
      {showFinalResults && (
        <Paper elevation={8} sx={{ p: 5, mt: 3, textAlign: 'center', backgroundColor: finalScore.passed ? 'success.main' : 'warning.main', color: 'white' }}>
          <Typography variant="h3" gutterBottom fontWeight="bold">
            {finalScore.passed ? '🎉 Congratulations!' : '💪 Keep Practicing!'}
          </Typography>
          <Box sx={{ my: 3 }}>
            <Typography variant="h5" gutterBottom>Remedial C1 - Final Results</Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>Task A (Debate Duel): {finalScore.taskA} / 4</Typography>
            <Typography variant="h6">Task B (Critique Challenge): {finalScore.taskB} / 8</Typography>
            <Typography variant="h6">Task C (Wordshake): {finalScore.taskC} / 6</Typography>
            <Typography variant="h6">Task D (Live Debate): {finalScore.taskD} / 1</Typography>
            <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>Total Score: {finalScore.total} / 19</Typography>
          </Box>
          {finalScore.passed ? (
            <>
              <Typography variant="h6" sx={{ mb: 2 }}>
                ✅ You passed! Proceeding to Phase 4 Step 2...
              </Typography>
              <Typography variant="body2">
                Redirecting in 5 seconds...
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="h6" sx={{ mb: 2 }}>
                ❌ Score below threshold (16/19 required)
              </Typography>
              <Typography variant="body2">
                Restarting Remedial C1 in 5 seconds...
              </Typography>
            </>
          )}
        </Paper>
      )}

      {/* Game Component */}
      {!gameCompleted && (
        <Box>
          <QuizletLiveDebateGame
            debatePrompts={DEBATE_PROMPTS}
            glossaryTerms={GLOSSARY_TERMS}
            onComplete={handleGameComplete}
          />
        </Box>
      )}
    </Box>
  )
}
