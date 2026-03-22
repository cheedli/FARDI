import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import GapFillStory from '../../../components/GapFillStory.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 5 Step 1 - Level A2 - Task A: Dialogue Completion
 * Complete dialogue about solving the problem, gamified as "Chat Challenge"
 * Complete lines to "unlock" next dialogue level
 */

const LIGHT = {
  pageBg: '#FFFDE7',
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
}

const WORD_BANK = ['problem', 'because', 'cancel', 'alternative', 'sorry', 'fix', 'solution']

const DIALOGUE_SENTENCES = [
  'Ms. Mabrouki: What is the _______?',
  'You: Singer _______ _______ sick.',
  'SKANDER: What _______?',
  'You: Find _______ singer and say _______.',
  'You: We _______ it.'
]

const CORRECT_ANSWERS = [
  'problem',
  'cancel', 'because',
  'solution',
  'alternative', 'sorry',
  'fix'
]

export default function Phase5Step1RemedialA2TaskA() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 1, interaction: 1, context: 'remedial_a2' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerChange = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }))
  }

  const calculateScore = () => {
    let correctCount = 0
    let answerIndex = 0
    DIALOGUE_SENTENCES.forEach((sentence, sentenceIndex) => {
      const blankCount = (sentence.match(/_______/g) || []).length
      for (let i = 0; i < blankCount; i++) {
        const key = `g_${sentenceIndex}_${i}`
        const userAnswer = answers[key]?.toLowerCase().trim()
        const correctAnswer = CORRECT_ANSWERS[answerIndex]?.toLowerCase()
        if (userAnswer === correctAnswer) correctCount++
        answerIndex++
      }
    })
    return correctCount
  }

  const handleSubmit = async () => {
    const finalScore = calculateScore()
    setScore(finalScore)
    setSubmitted(true)
    sessionStorage.setItem('phase5_step1_remedial_a2_taskA_score', finalScore.toString())
    try {
      await phase5API.logRemedialActivity(1, 'A2', 'A', finalScore, 7, 0)
      console.log('[Phase 5 Step 1] A2 Task A completion logged to backend')
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/1/step/1/remedial/a2/task/b')
  }

  const allFilled = (() => {
    return DIALOGUE_SENTENCES.every((sentence, sentenceIndex) => {
      const blankCount = (sentence.match(/_______/g) || []).length
      for (let i = 0; i < blankCount; i++) {
        const key = `g_${sentenceIndex}_${i}`
        if (!answers[key]) return false
      }
      return true
    })
  })()

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{
            bgcolor: P.orange.bg,
            border: `2px solid ${P.orange.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.orange.shadow}`,
            p: 3,
            mb: 3
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>
              Phase 5: Execution & Problem-Solving
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.shadow }}>
              Step 1: Remedial Practice - Level A2
            </Typography>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Task A: Chat Challenge
            </Typography>
            <Typography variant="body1">
              Complete dialogue about solving the problem. Complete lines to unlock next level!
            </Typography>
          </Box>
        </motion.div>

        {/* Instructor Message */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{
            bgcolor: P.blue.bg,
            border: `2px solid ${P.blue.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3,
            mb: 3
          }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Welcome to Chat Challenge! Complete the dialogue about solving the problem. Fill in the blanks using the word bank. Click a word from the Word Bank, then click the blank space where it belongs. Complete all lines to unlock the next level!"
            />
          </Box>
        </motion.div>

        {/* Gap Fill Game */}
        {!submitted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Box>
              <GapFillStory
                templates={DIALOGUE_SENTENCES}
                wordBank={WORD_BANK}
                answers={answers}
                onChange={handleAnswerChange}
              />
            </Box>
          </motion.div>
        )}

        {/* Submit Button */}
        {!submitted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
              <Box
                component="button"
                onClick={handleSubmit}
                disabled={!allFilled}
                sx={{
                  bgcolor: P.blue.bg,
                  border: `2px solid ${P.blue.border}`,
                  borderRadius: '14px',
                  boxShadow: `4px 4px 0 ${P.blue.shadow}`,
                  px: 6, py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: P.blue.border,
                  cursor: allFilled ? 'pointer' : 'not-allowed',
                  opacity: allFilled ? 1 : 0.5,
                  transition: 'all 0.15s',
                  '&:hover': allFilled ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` } : {}
                }}
              >
                Submit Answers
              </Box>
            </Stack>
          </motion.div>
        )}

        {/* Results */}
        {submitted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{
              bgcolor: P.green.bg,
              border: `2px solid ${P.green.border}`,
              borderRadius: '20px',
              boxShadow: `4px 4px 0 ${P.green.shadow}`,
              p: 4,
              mb: 3,
              textAlign: 'center'
            }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.green.shadow }} gutterBottom>
                ✓ Task A Complete!
              </Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Score: {score} / 7
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {score >= 6 ? 'Excellent! You completed the dialogue correctly!' : "Good work! Let's continue to the next task."}
              </Typography>
            </Box>

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Box
                component="button"
                onClick={handleContinue}
                sx={{
                  bgcolor: P.green.bg,
                  border: `2px solid ${P.green.border}`,
                  borderRadius: '14px',
                  boxShadow: `4px 4px 0 ${P.green.shadow}`,
                  px: 4, py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: P.green.shadow,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }
                }}
              >
                Next: Task B →
              </Box>
            </Stack>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
