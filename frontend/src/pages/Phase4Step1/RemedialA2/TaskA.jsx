import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, LinearProgress, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { PhoneCallSim } from '../../../components/exercises'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Level A2 - Task A: Chat Challenge (Dialogue Completion)
 * Complete dialogue about promotion ideas in WhatsApp messenger style
 * No navigation arrows - just the messenger interface
 */

// Exercise data in PhoneCallSim format
const EXERCISE_DATA = {
  type: 'dialogue_completion',
  instruction: 'Fill in 8 gaps in this dialogue.',
  dialogue_lines: [
    {
      speaker: 'Ms. Mabrouki',
      text: 'What can we use?'
    },
    {
      speaker: 'You',
      template: 'A ____ ____ it can ____ event with ____.',
      correct_answers: ['poster', 'because', 'show', 'slogan']
    },
    {
      speaker: 'Skander',
      template: 'Or ____ to ____ ____ like ____ big.',
      correct_answers: ['video', 'add', 'fun', 'billboard']
    }
  ],
  word_bank: [
    'poster',
    'because',
    'show',
    'video',
    'fun',
    'add',
    'slogan',
    'billboard'
  ]
}

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

export default function RemedialA2TaskA() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 1, context: 'remedial_a2' })
  const [exerciseCompleted, setExerciseCompleted] = useState(false)
  const [exerciseResult, setExerciseResult] = useState(null)
  const [currentScore, setCurrentScore] = useState(0)
  const [totalBlanks] = useState(8)

  const handleExerciseComplete = (result) => {
    console.log('Chat Messenger completed:', result)
    setExerciseCompleted(true)
    setExerciseResult(result)

    const score = result.correctCount || 0
    setCurrentScore(score)
    sessionStorage.setItem('remedial_a2_taskA_score', score)

    logTaskCompletion(score)
  }

  const handleProgress = (progress) => {
    console.log('Progress:', progress)
    if (progress.correctCount !== undefined) {
      setCurrentScore(progress.correctCount)
    }
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      const response = await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          level: 'A2',
          task: 'A',
          score: score,
          max_score: 8,
          completed: true
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('Task A completion logged to backend')
      }
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase4/remedial/a2/taskB')
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
              Task A: Chat Challenge
            </Typography>
            <Typography variant="body1" color={isDark ? 'rgba(255,255,255,0.8)' : 'text.secondary'}>
              Complete the dialogue about promotion ideas by filling in the blanks. Unlock the next dialogue level!
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
              message="Great work on Task A! Now let's practice making longer sentences. Complete each line to unlock the next dialogue level - the more you complete, the taller your progress grows!"
            />
          </Box>

          {/* Progress Bar */}
          <Box sx={{
            bgcolor: isDark ? DARK.yellow.bg : LIGHT.yellow.bg,
            border: `2px solid ${isDark ? DARK.yellow.border : LIGHT.yellow.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${isDark ? DARK.yellow.shadow : LIGHT.yellow.shadow}`,
            p: 2, mb: 3,
          }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="h6" fontWeight={700} color={isDark ? DARK.yellow.border : LIGHT.yellow.shadow} sx={{ minWidth: 150 }}>
                Progress: {currentScore} / {totalBlanks}
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={(currentScore / totalBlanks) * 100}
                  sx={{
                    height: 10,
                    borderRadius: 1,
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: isDark ? DARK.yellow.border : LIGHT.yellow.shadow,
                      borderRadius: 1
                    }
                  }}
                />
              </Box>
              <Typography variant="h6" fontWeight={700} color={isDark ? DARK.yellow.border : LIGHT.yellow.shadow}>
                🌲 {currentScore}px
              </Typography>
            </Stack>
          </Box>

          {/* WhatsApp-style Chat Interface */}
          <PhoneCallSim
            exercise={EXERCISE_DATA}
            onComplete={handleExerciseComplete}
            onProgress={handleProgress}
          />

          {/* Continue Button (shown after completion) */}
          {exerciseCompleted && (
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
                  minWidth: 250,
                  transition: 'transform 0.15s, box-shadow 0.15s',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${isDark ? DARK.green.shadow : LIGHT.green.shadow}` },
                  '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${isDark ? DARK.green.shadow : LIGHT.green.shadow}` }
                }}
              >
                Continue to Task B
              </Box>
            </Stack>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
