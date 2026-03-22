import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
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

export default function RemedialA1TaskB() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 2, context: 'remedial_a1' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameResult, setGameResult] = useState(null)
  const [showFinalResults, setShowFinalResults] = useState(false)
  const [finalScore, setFinalScore] = useState({ taskA: 0, taskB: 0, total: 0, passed: false })

  const handleGameComplete = (result) => {
    console.log('Wordle game completed:', result)
    setGameCompleted(true)
    setGameResult(result)

    const score = result.score || 0
    sessionStorage.setItem('remedial_a1_taskB_score', score)

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

    setFinalScore({ taskA: taskAScore, taskB: taskBScore, total: totalScore, passed })
    setShowFinalResults(true)

    setTimeout(() => {
      sessionStorage.removeItem('remedial_a1_taskA_score')
      sessionStorage.removeItem('remedial_a1_taskB_score')

      if (passed) {
        navigate('/phase4/step/2')
      } else {
        navigate('/phase4/remedial/a1/taskA')
      }
    }, 5000)
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: isDark ? DARK.pageBg : LIGHT.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: isDark ? DARK.orange.bg : LIGHT.orange.bg,
            border: `2px solid ${isDark ? DARK.orange.border : LIGHT.orange.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${isDark ? DARK.orange.shadow : LIGHT.orange.shadow}`,
            p: 3, mb: 3,
            transition: 'transform 0.15s, box-shadow 0.15s',
            '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${isDark ? DARK.orange.shadow : LIGHT.orange.shadow}` }
          }}>
            <Typography variant="h5" gutterBottom fontWeight={700} color={isDark ? DARK.orange.border : LIGHT.orange.shadow}>
              Marketing &amp; Promotion Practice
            </Typography>
            <Typography variant="h6" gutterBottom fontWeight={700} color={isDark ? DARK.orange.border : LIGHT.orange.shadow}>
              Task B: Wordle Word Puzzle
            </Typography>
            <Typography variant="body1" color={isDark ? 'rgba(255,255,255,0.8)' : 'text.secondary'}>
              Guess the promotion words letter by letter, just like Wordle! You have 6 attempts per word.
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
              character="MS. MABROUKI"
              message="Great job on Task A! Now let's practice using these words in sentences. For each sentence, guess the missing word letter by letter, like Wordle! Green means correct letter in correct position, yellow means correct letter in wrong position. You have 6 attempts per word!"
            />
          </Box>

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
                Continue to Next Task
              </Box>
            </Stack>
          )}

          {/* Completion Summary */}
          {gameCompleted && gameResult && !showFinalResults && (
            <Box sx={{
              bgcolor: isDark ? DARK.green.bg : LIGHT.green.bg,
              border: `2px solid ${isDark ? DARK.green.border : LIGHT.green.border}`,
              borderRadius: '20px',
              boxShadow: `4px 4px 0 ${isDark ? DARK.green.shadow : LIGHT.green.shadow}`,
              p: 4, mt: 3, textAlign: 'center',
            }}>
              <Typography variant="h4" gutterBottom fontWeight={700} color={isDark ? DARK.green.border : LIGHT.green.shadow}>
                {gameResult.score === SENTENCES.length ? 'Perfect Score!' : 'Well Done!'}
              </Typography>
              <Typography variant="h6" color={isDark ? 'rgba(255,255,255,0.9)' : 'text.primary'}>
                You scored {gameResult.score} out of {SENTENCES.length} points!
              </Typography>
              {gameResult.score === SENTENCES.length && (
                <Typography variant="body1" sx={{ mt: 2 }} color={isDark ? 'rgba(255,255,255,0.7)' : 'text.secondary'}>
                  Amazing! You got every word correct!
                </Typography>
              )}
            </Box>
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
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
