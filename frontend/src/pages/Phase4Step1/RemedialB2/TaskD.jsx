import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import KahootQuizGame from '../../../components/KahootQuizGame.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Level B2 - Task D: Kahoot-Inspired Quiz
 * 6-question quiz on marketing terms with AI competition
 * Gamified quiz with leaderboard and points
 */

const QUIZ_QUESTIONS = [
  {
    question: 'What is "feature"?',
    answers: [
      'Highlight in ad',
      'Background color',
      'Company name',
      'Price tag'
    ],
    correctIndex: 0,
    explanation: '"Feature" means to highlight or prominently display something in an advertisement. It draws attention to key aspects of a product or service.'
  },
  {
    question: 'What is an "eye-catcher"?',
    answers: [
      'A mirror',
      'Attention grabber',
      'Eye protection',
      'A camera'
    ],
    correctIndex: 1,
    explanation: 'An "eye-catcher" is something that grabs attention and makes people look. In marketing, it\'s a visual element designed to attract the viewer\'s gaze.'
  },
  {
    question: 'What does "viral" mean in marketing?',
    answers: [
      'Disease spreading',
      'Rapidly shared content',
      'Computer virus',
      'Medical advertisement'
    ],
    correctIndex: 1,
    explanation: '"Viral" in marketing refers to content that spreads rapidly across the internet through social sharing, reaching a massive audience organically.'
  },
  {
    question: 'What is a "billboard"?',
    answers: [
      'Payment invoice',
      'Shopping list',
      'Large outdoor ad',
      'Money counter'
    ],
    correctIndex: 2,
    explanation: 'A "billboard" is a large outdoor advertising structure typically found along highways and in high-traffic areas to promote products or services.'
  },
  {
    question: 'What is "targeted" advertising?',
    answers: [
      'Shooting range ads',
      'Random advertising',
      'Aimed at specific audience',
      'Expensive marketing'
    ],
    correctIndex: 2,
    explanation: '"Targeted" advertising means marketing directed at a specific demographic, audience, or group based on their characteristics, interests, or behaviors.'
  },
  {
    question: 'What is an "influencer"?',
    answers: [
      'Weather pattern',
      'Social media promoter',
      'Business owner',
      'Product designer'
    ],
    correctIndex: 1,
    explanation: 'An "influencer" is a person with significant social media following who can affect purchasing decisions through recommendations and content creation.'
  }
]

export default function RemedialB2TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 4, context: 'remedial_b2' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameResult, setGameResult] = useState(null)
  const [showFinalResults, setShowFinalResults] = useState(false)
  const [finalScore, setFinalScore] = useState({ taskA: 0, taskB: 0, taskC: 0, taskD: 0, total: 0, passed: false })

  const handleGameComplete = (result) => {
    console.log('B2 Kahoot Quiz completed:', result)

    // Store result
    const score = result.score || 0
    const points = result.points || 0

    sessionStorage.setItem('remedial_b2_taskD_score', score)
    sessionStorage.setItem('remedial_b2_taskD_points', points)

    // Log to backend
    logTaskCompletion(score, points, result.answeredQuestions)

    setGameCompleted(true)
    setGameResult(result)
  }

  const logTaskCompletion = async (score, points, answeredQuestions) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskD', is_correct: true, score: score })
    try {
      const response = await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          level: 'B2',
          task: 'D',
          score: score,
          max_score: QUIZ_QUESTIONS.length,
          points: points,
          answered_questions: answeredQuestions,
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
    const taskAScore = parseInt(sessionStorage.getItem('remedial_b2_taskA_score') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('remedial_b2_taskB_score') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('remedial_b2_taskC_score') || '0')
    const taskDScore = parseInt(sessionStorage.getItem('remedial_b2_taskD_score') || '0')
    const totalScore = taskAScore + taskBScore + taskCScore + taskDScore
    const passed = totalScore >= 24

    console.log('\n' + '='.repeat(60))
    console.log('REMEDIAL B2 - FINAL RESULTS')
    console.log('='.repeat(60))
    console.log('Task A (Role-Play RPG):', taskAScore, '/8')
    console.log('Task B (Compare Quest):', taskBScore, '/8')
    console.log('Task C (Sushi Spell):', taskCScore, '/8')
    console.log('Task D (Kahoot Quiz):', taskDScore, '/6')
    console.log('-'.repeat(60))
    console.log('TOTAL SCORE:', totalScore, '/30')
    console.log('PASS THRESHOLD: 24/30')
    console.log('-'.repeat(60))
    if (passed) {
      console.log('✅ PASSED - Student will proceed to Phase 4 Step 2')
    } else {
      console.log('❌ FAILED - Student will repeat Remedial Level B2')
    }
    console.log('='.repeat(60) + '\n')

    // Log final score to backend
    try {
      const response = await fetch('/api/phase4/remedial/b2/final-score', {
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
        console.log('Final B2 score logged to backend:', data.data)
      }
    } catch (error) {
      console.error('Failed to log final score:', error)
    }

    // Show final results
    setFinalScore({ taskA: taskAScore, taskB: taskBScore, taskC: taskCScore, taskD: taskDScore, total: totalScore, passed })
    setShowFinalResults(true)

    // Delay navigation to show results
    setTimeout(() => {
      // Clear B2 scores
      sessionStorage.removeItem('remedial_b2_taskA_score')
      sessionStorage.removeItem('remedial_b2_taskB_score')
      sessionStorage.removeItem('remedial_b2_taskC_score')
      sessionStorage.removeItem('remedial_b2_taskD_score')

      if (passed) {
        // Navigate to Phase 4 Step 2 intro
        navigate('/phase4/step/2')
      } else {
        // Restart from Task A
        navigate('/phase4/remedial/b2/taskA')
      }
    }, 5000) // 5 second delay
  }

  return (
    <Box sx={{ maxWidth: 1600, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 3,
          background: 'linear-gradient(135deg, #46178f 0%, #e21b3c 100%)',
          color: 'white'
        }}
      >
        <Typography variant="h3" gutterBottom fontWeight="bold">
          🎮 Kahoot-Inspired Quiz
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level B2 - Task D: Marketing Terms Challenge
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
          Compete with AI peers in this fast-paced quiz! Answer quickly to earn bonus points!
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="EMNA"
          message="Answer 6 questions about advanced marketing vocabulary. You have 20 seconds per question. Faster correct answers earn more points!"
        />
      </Paper>

      {/* Kahoot Quiz Game */}
      <Box>
        <KahootQuizGame
          questions={QUIZ_QUESTIONS}
          onComplete={handleGameComplete}
        />
      </Box>

      {/* Navigation */}
      {!showFinalResults && gameCompleted && (
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="success"
            onClick={handleContinue}
            size="large"
          >
            Complete and Continue
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
              Remedial B2 - Final Results
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Task A (Role-Play RPG): {finalScore.taskA} / 8
            </Typography>
            <Typography variant="h6">
              Task B (Compare Quest): {finalScore.taskB} / 8
            </Typography>
            <Typography variant="h6">
              Task C (Sushi Spell): {finalScore.taskC} / 8
            </Typography>
            <Typography variant="h6">
              Task D (Kahoot Quiz): {finalScore.taskD} / 6
            </Typography>
            <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>
              Total Score: {finalScore.total} / 30
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
              Pass Threshold: 24 / 30
            </Typography>
          </Box>

          {finalScore.passed ? (
            <Box>
              <Typography variant="h6" sx={{ mt: 3 }}>
                ✅ You have passed Remedial B2!
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
                Restarting Remedial B2 to help you improve...
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
