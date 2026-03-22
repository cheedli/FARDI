import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
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

const LIGHT = {
  pageBg: '#FFFDE7',
  blue:   { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
  teal:   { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  red:    { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
  teal:   { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  red:    { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

export default function RemedialB2TaskD() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 4, context: 'remedial_b2' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameResult, setGameResult] = useState(null)
  const [showFinalResults, setShowFinalResults] = useState(false)
  const [finalScore, setFinalScore] = useState({ taskA: 0, taskB: 0, taskC: 0, taskD: 0, total: 0, passed: false })

  const handleGameComplete = (result) => {
    console.log('B2 Kahoot Quiz completed:', result)

    const score = result.score || 0
    const points = result.points || 0

    sessionStorage.setItem('remedial_b2_taskD_score', score)
    sessionStorage.setItem('remedial_b2_taskD_points', points)

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

    setFinalScore({ taskA: taskAScore, taskB: taskBScore, taskC: taskCScore, taskD: taskDScore, total: totalScore, passed })
    setShowFinalResults(true)

    setTimeout(() => {
      sessionStorage.removeItem('remedial_b2_taskA_score')
      sessionStorage.removeItem('remedial_b2_taskB_score')
      sessionStorage.removeItem('remedial_b2_taskC_score')
      sessionStorage.removeItem('remedial_b2_taskD_score')

      if (passed) {
        navigate('/phase4/step/2')
      } else {
        navigate('/phase4/remedial/b2/taskA')
      }
    }, 5000)
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: isDark ? DARK.pageBg : LIGHT.pageBg, py: 4 }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: isDark ? DARK.purple.bg : LIGHT.purple.bg,
            border: `2px solid ${isDark ? DARK.purple.border : LIGHT.purple.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${isDark ? DARK.purple.shadow : LIGHT.purple.shadow}`,
            p: 4, mb: 3,
            transition: 'transform 0.15s, box-shadow 0.15s',
            '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${isDark ? DARK.purple.shadow : LIGHT.purple.shadow}` }
          }}>
            <Typography variant="h4" gutterBottom fontWeight={700} color={isDark ? DARK.purple.border : LIGHT.purple.shadow}>
              Kahoot-Inspired Quiz
            </Typography>
            <Typography variant="h6" gutterBottom fontWeight={700} color={isDark ? DARK.purple.border : LIGHT.purple.shadow}>
              Level B2 - Task D: Marketing Terms Challenge
            </Typography>
            <Typography variant="body1" color={isDark ? 'rgba(255,255,255,0.8)' : 'text.secondary'} sx={{ fontSize: '1.1rem' }}>
              Compete with AI peers in this fast-paced quiz! Answer quickly to earn bonus points!
            </Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{
            bgcolor: isDark ? DARK.teal.bg : LIGHT.teal.bg,
            border: `2px solid ${isDark ? DARK.teal.border : LIGHT.teal.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${isDark ? DARK.teal.shadow : LIGHT.teal.shadow}`,
            p: 3, mb: 3,
            transition: 'transform 0.15s, box-shadow 0.15s',
            '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${isDark ? DARK.teal.shadow : LIGHT.teal.shadow}` }
          }}>
            <CharacterMessage
              character="EMNA"
              message="Answer 6 questions about advanced marketing vocabulary. You have 20 seconds per question. Faster correct answers earn more points!"
            />
          </Box>

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
              <Box
                component="button"
                onClick={handleContinue}
                sx={{
                  bgcolor: isDark ? DARK.green.bg : LIGHT.green.bg,
                  border: `2px solid ${isDark ? DARK.green.border : LIGHT.green.border}`,
                  borderRadius: '12px',
                  boxShadow: `3px 3px 0 ${isDark ? DARK.green.shadow : LIGHT.green.shadow}`,
                  px: 3, py: 1.5,
                  fontWeight: 700, fontSize: '1rem',
                  cursor: 'pointer', color: isDark ? DARK.green.border : LIGHT.green.shadow,
                  transition: 'transform 0.15s, box-shadow 0.15s',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${isDark ? DARK.green.shadow : LIGHT.green.shadow}` },
                  '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${isDark ? DARK.green.shadow : LIGHT.green.shadow}` }
                }}
              >
                Complete and Continue
              </Box>
            </Stack>
          )}

          {/* Final Results - Pass/Fail */}
          {showFinalResults && (
            <Box sx={{
              bgcolor: finalScore.passed ? (isDark ? DARK.green.bg : LIGHT.green.bg) : (isDark ? DARK.yellow.bg : LIGHT.yellow.bg),
              border: `2px solid ${finalScore.passed ? (isDark ? DARK.green.border : LIGHT.green.border) : (isDark ? DARK.yellow.border : LIGHT.yellow.border)}`,
              borderRadius: '20px',
              boxShadow: `4px 4px 0 ${finalScore.passed ? (isDark ? DARK.green.shadow : LIGHT.green.shadow) : (isDark ? DARK.yellow.shadow : LIGHT.yellow.shadow)}`,
              p: 5, mt: 3, textAlign: 'center',
            }}>
              <Typography variant="h3" gutterBottom fontWeight={700} color={finalScore.passed ? (isDark ? DARK.green.border : LIGHT.green.shadow) : (isDark ? DARK.yellow.border : LIGHT.yellow.shadow)}>
                {finalScore.passed ? '🎉 Congratulations!' : '💪 Keep Practicing!'}
              </Typography>

              <Box sx={{ my: 3 }}>
                <Typography variant="h5" gutterBottom fontWeight={700}>
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
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
