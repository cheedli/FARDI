import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import QuizGameComponent from '../../../components/QuizGameComponent.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Level B1 - Task C: Wordshake Challenge (Quiz Game)
 * Multiple choice quiz on marketing vocabulary definitions
 */

const QUIZ_QUESTIONS = [
  {
    question: 'What is a billboard?',
    options: [
      'A large outdoor sign',
      'A small flyer',
      'A TV advertisement',
      'A radio message'
    ],
    correctAnswer: 'A large outdoor sign'
  },
  {
    question: 'What is an eye-catcher?',
    options: [
      'A boring poster',
      'A bright, attractive advertisement',
      'A hidden message',
      'A simple text'
    ],
    correctAnswer: 'A bright, attractive advertisement'
  },
  {
    question: 'What is a slogan?',
    options: [
      'A long story',
      'A catchy phrase for promotion',
      'A product name',
      'A website address'
    ],
    correctAnswer: 'A catchy phrase for promotion'
  },
  {
    question: 'What is a commercial?',
    options: [
      'A business building',
      'A short TV or radio advertisement',
      'A magazine article',
      'A product manual'
    ],
    correctAnswer: 'A short TV or radio advertisement'
  },
  {
    question: 'What is a feature in advertising?',
    options: [
      'The price tag',
      'A highlighted product characteristic',
      'The company logo',
      'The shop location'
    ],
    correctAnswer: 'A highlighted product characteristic'
  },
  {
    question: 'What is a poster?',
    options: [
      'A video clip',
      'A radio show',
      'A paper advertisement with pictures and words',
      'An email message'
    ],
    correctAnswer: 'A paper advertisement with pictures and words'
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

export default function RemedialB1TaskC() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase4/remedial/b1/taskD') }, [])
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 3, context: 'remedial_b1' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameResult, setGameResult] = useState(null)

  const handleGameComplete = (result) => {
    console.log('Quiz completed:', result)
    setGameCompleted(true)
    setGameResult(result)

    const score = result.score || 0
    sessionStorage.setItem('remedial_b1_taskC_score', score)

    logTaskCompletion(score, result.passed)
  }

  const logTaskCompletion = async (score, passed) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: score })
    try {
      const response = await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          level: 'B1',
          task: 'C',
          score: score,
          max_score: QUIZ_QUESTIONS.length,
          passed: passed,
          completed: true
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('Task C completion logged to backend')
      }
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase4/remedial/b1/taskD')
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
              Task C: Wordshake Challenge
            </Typography>
            <Typography variant="body1" color={isDark ? 'rgba(255,255,255,0.8)' : 'text.secondary'}>
              Test your knowledge of marketing vocabulary with this quiz!
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
              character="SKANDER"
              message="Time to test what you've learned! Answer these multiple choice questions about marketing terms. You need all answers correct to pass. Good luck!"
            />
          </Box>

          {/* Quiz Game */}
          {!gameCompleted && (
            <Box>
              <QuizGameComponent
                questions={QUIZ_QUESTIONS}
                onComplete={handleGameComplete}
              />
            </Box>
          )}

          {/* Navigation */}
          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
            {gameCompleted && (
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
            )}
          </Stack>

        </motion.div>
      </Container>
    </Box>
  )
}
