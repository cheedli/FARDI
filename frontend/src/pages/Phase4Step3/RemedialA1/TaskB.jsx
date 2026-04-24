import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import GapFillStory from '../../../components/GapFillStory.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 3 - Remedial A1 - Task B: Fill Quest
 * Fill in 8 gaps with advertising terms from the videos
 * Score: +1 for each correct answer (8 total)
 */

const WORD_BANK = [
  'promotional', 'persuasive', 'targeted', 'original',
  'creative', 'dramatisation', 'goal', 'obstacles'
]

const SENTENCES = [
  'Ad is _______.',
  '_______ to buy.',
  '_______ group.',
  'Be _______.',
  'Use _______.',
  '_______ story.',
  'Set _______.',
  'Face _______.'
]

const CORRECT_ANSWERS = [
  'promotional', 'persuasive', 'targeted', 'original',
  'creative', 'dramatisation', 'goal', 'obstacles'
]

export default function RemedialA1TaskB() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase4/step3/remedial/a1/taskC') }, [])
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
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
  const P = isDark ? DARK : LIGHT

  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 2, context: 'remedial_a1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerChange = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }))
  }

  const calculateScore = () => {
    let correctCount = 0
    SENTENCES.forEach((_, index) => {
      const key = `g_${index}_0`
      const userAnswer = answers[key]?.toLowerCase().trim()
      const correctAnswer = CORRECT_ANSWERS[index].toLowerCase()
      if (userAnswer === correctAnswer) correctCount++
    })
    return correctCount
  }

  const handleSubmit = async () => {
    const finalScore = calculateScore()
    setScore(finalScore)
    setSubmitted(true)
    sessionStorage.setItem('remedial_step3_a1_taskB_score', finalScore)
    await logTaskCompletion(finalScore)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score: score })
    try {
      const response = await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ level: 'A1', task: 'B', step: 2, score: score, max_score: SENTENCES.length, completed: true })
      })
      const data = await response.json()
      if (data.success) console.log('Step 3 Task B completion logged to backend')
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase4/step3/remedial/a1/taskC')
  }

  const allFilled = SENTENCES.every((_, index) => {
    const key = `g_${index}_0`
    return answers[key]
  })

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>
              Phase 4 - Step 3: Remedial Activities
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.shadow }}>
              Level A1 - Task B: Fill Quest
            </Typography>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}>
              Fill in the gaps with the correct advertising terms. Complete your quest through 8 levels!
            </Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3,
          }}>
            <CharacterMessage
              character="MS. MABROUKI"
              message="Excellent work on the Treasure Hunt! Now it's time for the Fill Quest! Click a word from the Word Bank, then click the blank space where it belongs. Each correct fill helps you advance through the quest levels. Fill all 8 gaps to complete your quest!"
            />
          </Box>

          {/* Gap Fill Game */}
          {!submitted && (
            <Box>
              <GapFillStory
                templates={SENTENCES}
                wordBank={WORD_BANK}
                answers={answers}
                onChange={handleAnswerChange}
              />
            </Box>
          )}

          {/* Submit Button */}
          {!submitted && (
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
              <Box component="button" onClick={handleSubmit} disabled={!allFilled} sx={{
                bgcolor: allFilled ? P.blue.bg : 'grey.200',
                border: `2px solid ${allFilled ? P.blue.border : '#ccc'}`,
                borderRadius: '12px',
                boxShadow: allFilled ? `3px 3px 0 ${P.blue.shadow}` : 'none',
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: allFilled ? 'pointer' : 'not-allowed',
                color: allFilled ? P.blue.shadow : 'grey.500',
                '&:hover': allFilled ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` } : {},
                '&:active': allFilled ? { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.blue.shadow}` } : {},
              }}>
                {allFilled ? 'Submit Answers' : 'Fill All Gaps First'}
              </Box>
            </Stack>
          )}

          {/* Results */}
          {submitted && (
            <Box>
              <Box sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
                p: 4, mt: 3, textAlign: 'center',
              }}>
                <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.green.shadow }}>
                  {score === SENTENCES.length ? 'Perfect Quest!' : 'Quest Complete!'}
                </Typography>
                <Typography variant="h6" sx={{ color: P.green.shadow }}>
                  You scored {score} out of {SENTENCES.length} points!
                </Typography>
                {score === SENTENCES.length && (
                  <Typography variant="body1" sx={{ mt: 2, color: P.green.shadow, opacity: 0.8 }}>
                    Amazing! You filled every gap correctly!
                  </Typography>
                )}
              </Box>

              {/* Answer Review */}
              <Box sx={{
                bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
                borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`,
                p: 3, mt: 3,
              }}>
                <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.yellow.shadow }}>
                  Answer Review:
                </Typography>
                <Stack spacing={2}>
                  {SENTENCES.map((sentence, index) => {
                    const key = `g_${index}_0`
                    const userAnswer = answers[key]?.toLowerCase().trim()
                    const correctAnswer = CORRECT_ANSWERS[index]
                    const isCorrect = userAnswer === correctAnswer.toLowerCase()

                    return (
                      <Box key={index} sx={{
                        bgcolor: isCorrect ? P.green.bg : P.red.bg,
                        border: `2px solid ${isCorrect ? P.green.border : P.red.border}`,
                        borderRadius: '12px', p: 2,
                      }}>
                        <Typography variant="body2" sx={{ color: isCorrect ? P.green.shadow : P.red.shadow }}>
                          <strong>Sentence {index + 1}:</strong> {sentence.replace('_______', `"${userAnswer || '(empty)'}"`)}
                        </Typography>
                        {!isCorrect && (
                          <Typography variant="caption" sx={{ color: P.red.shadow, opacity: 0.8 }}>
                            Correct answer: <strong>{correctAnswer}</strong>
                          </Typography>
                        )}
                      </Box>
                    )
                  })}
                </Stack>
              </Box>

              <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
                <Box component="button" onClick={handleContinue} sx={{
                  bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                  borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                  px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                  cursor: 'pointer', color: P.green.shadow,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                  '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` },
                }}>
                  Continue to Task C
                </Box>
              </Stack>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
