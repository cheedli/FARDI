import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
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

export default function RemedialC1TaskD() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
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

    setFinalScore({ taskA: taskAScore, taskB: taskBScore, taskC: taskCScore, taskD: taskDScore, total: totalScore, passed })
    setShowFinalResults(true)

    setTimeout(() => {
      sessionStorage.removeItem('remedial_c1_taskA_score')
      sessionStorage.removeItem('remedial_c1_taskB_score')
      sessionStorage.removeItem('remedial_c1_taskC_score')
      sessionStorage.removeItem('remedial_c1_taskD_score')

      if (passed) {
        navigate('/phase4/step/2')
      } else {
        navigate('/phase4/remedial/c1/taskA')
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
              Quizlet Live Debate
            </Typography>
            <Typography variant="h6" gutterBottom fontWeight={700} color={isDark ? DARK.purple.border : LIGHT.purple.shadow}>
              Level C1 - Task D: Advanced Marketing Debate
            </Typography>
            <Typography variant="body1" color={isDark ? 'rgba(255,255,255,0.8)' : 'text.secondary'} sx={{ fontSize: '1.1rem' }}>
              Engage in sophisticated debates using at least 4 advanced marketing terms per response!
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
              message="This is the ultimate C1 challenge! Provide nuanced, sophisticated responses to complex marketing debates. Use at least 4 advanced terms in each response to demonstrate mastery!"
            />
          </Box>

          {/* Task Complete - Show Continue Button */}
          {gameCompleted && !showFinalResults && (
            <Box sx={{
              bgcolor: isDark ? DARK.green.bg : LIGHT.green.bg,
              border: `2px solid ${isDark ? DARK.green.border : LIGHT.green.border}`,
              borderRadius: '20px',
              boxShadow: `4px 4px 0 ${isDark ? DARK.green.shadow : LIGHT.green.shadow}`,
              p: 4, mb: 3, textAlign: 'center',
            }}>
              <Typography variant="h4" gutterBottom fontWeight={700} color={isDark ? DARK.green.border : LIGHT.green.shadow}>
                Task D Complete!
              </Typography>
              <Typography variant="h6" sx={{ mb: 3 }} color={isDark ? 'rgba(255,255,255,0.85)' : 'text.primary'}>
                Score: {gameResult?.score}/{DEBATE_PROMPTS.length}
              </Typography>
              <Box
                component="button"
                onClick={handleContinue}
                sx={{
                  bgcolor: isDark ? DARK.orange.bg : LIGHT.orange.bg,
                  border: `2px solid ${isDark ? DARK.orange.border : LIGHT.orange.border}`,
                  borderRadius: '12px',
                  boxShadow: `3px 3px 0 ${isDark ? DARK.orange.shadow : LIGHT.orange.shadow}`,
                  px: 6, py: 1.5,
                  fontWeight: 700, fontSize: '1rem',
                  cursor: 'pointer', color: isDark ? DARK.orange.border : LIGHT.orange.shadow,
                  transition: 'transform 0.15s, box-shadow 0.15s',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${isDark ? DARK.orange.shadow : LIGHT.orange.shadow}` },
                  '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${isDark ? DARK.orange.shadow : LIGHT.orange.shadow}` }
                }}
              >
                Continue to Final Results
              </Box>
            </Box>
          )}

          {/* Final Results - Pass/Fail */}
          {showFinalResults && finalScore && (
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
                <Typography variant="h5" gutterBottom fontWeight={700}>Remedial C1 - Final Results</Typography>
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
            </Box>
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

        </motion.div>
      </Container>
    </Box>
  )
}
