import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, TextField, LinearProgress, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  blue:   { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  teal:   { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  red:    { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  teal:   { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  red:    { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
  purple: { bg: '#3B0764', border: '#C084FC', shadow: '#6B21A8' },
}

const GUIDED_QUESTIONS = [
  { id: 1, question: 'Politeness impact', example: 'Polite markers reduce perceived hierarchy.' },
  { id: 2, question: 'Sequencing function', example: 'Logical order minimizes confusion.' },
  { id: 3, question: 'Clarity priority', example: 'Simple language ensures understanding.' },
  { id: 4, question: 'Safety emphasis', example: 'Explicit safety reminders protect all.' },
  { id: 5, question: 'Empathy role', example: 'Empathetic tone fosters cooperation.' },
  { id: 6, question: 'Welcome importance', example: 'Inclusive greeting sets positive tone.' },
  { id: 7, question: 'Help availability', example: 'Proactive help reduces frustration.' },
  { id: 8, question: 'Appreciation value', example: 'Gratitude motivates sustained effort.' }
]

export default function Phase5SubPhase2Step3RemedialC1TaskB() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 3, interaction: 2, context: 'remedial_c1' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState(Array(8).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerChange = (value) => {
    const newAnswers = [...answers]
    newAnswers[currentIndex] = value
    setAnswers(newAnswers)
  }

  const handleNext = () => { if (currentIndex < 7) setCurrentIndex(currentIndex + 1) }
  const handlePrevious = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1) }

  const handleSubmit = async () => {
    let correctCount = 0
    answers.forEach(answer => {
      const words = answer.trim().split(/\s+/).filter(w => w.length > 0)
      if (words.length >= 12) correctCount++
    })
    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_subphase2_step3_remedial_c1_taskB_score', correctCount.toString())
    try {
      await phase5API.logRemedialActivity(3, 'C1', 'B', correctCount, 8, 2)
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/2/step/3/remedial/c1/task/c')
  }

  const progress = ((currentIndex + 1) / 8) * 100
  const canPrev = currentIndex > 0
  const canNext = !!(answers[currentIndex].trim())

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{
            bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`,
            p: 3, mb: 3
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.purple.border }}>Phase 5: Execution & Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.purple.shadow }}>SubPhase 2 Step 3: Remedial Practice - Level C1</Typography>
            <Typography variant="h6" gutterBottom fontWeight="bold">Task B: Analysis Odyssey</Typography>
            <Typography variant="body1">Write an 8-sentence analytical explanation of effective volunteer instructions. Sophisticated, cohesive analysis!</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3
          }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Analysis Odyssey! Write an 8-sentence analytical explanation of effective volunteer instructions. Each sentence should have at least 12 words and use sophisticated C1-level language." />
          </Box>
        </motion.div>

        {!submitted ? (
          <>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Box sx={{
                bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
                borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
                p: 2, mb: 3
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Question {currentIndex + 1} of 8</Typography>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: P.teal.border }}>{Math.round(progress)}% Complete</Typography>
                </Box>
                <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 1 }} />
              </Box>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <Box sx={{
                bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
                p: 3, mb: 3
              }}>
                <Typography variant="h6" gutterBottom sx={{ color: P.blue.border }}>{GUIDED_QUESTIONS[currentIndex].question}</Typography>
                <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '12px', p: 2, mb: 2 }}>
                  <Typography variant="body2"><strong>Example:</strong> {GUIDED_QUESTIONS[currentIndex].example}</Typography>
                </Box>
                <TextField
                  fullWidth multiline rows={5} variant="outlined"
                  placeholder="Write your analytical explanation here..."
                  value={answers[currentIndex]} onChange={(e) => handleAnswerChange(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Stack direction="row" spacing={2} justifyContent="space-between">
                  <Box
                    component="button" onClick={handlePrevious} disabled={!canPrev}
                    sx={{
                      bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
                      borderRadius: '12px', boxShadow: `3px 3px 0 ${P.orange.shadow}`,
                      px: 3, py: 1, fontWeight: 'bold', color: P.orange.border,
                      cursor: canPrev ? 'pointer' : 'not-allowed', opacity: canPrev ? 1 : 0.5,
                      transition: 'all 0.15s',
                      '&:hover': canPrev ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.orange.shadow}` } : {}
                    }}
                  >← Previous</Box>
                  {currentIndex === 7 ? (
                    <Box
                      component="button" onClick={handleSubmit} disabled={!canNext}
                      sx={{
                        bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                        borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
                        px: 3, py: 1, fontWeight: 'bold', color: P.blue.border,
                        cursor: canNext ? 'pointer' : 'not-allowed', opacity: canNext ? 1 : 0.5,
                        transition: 'all 0.15s',
                        '&:hover': canNext ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` } : {}
                      }}
                    >Submit All</Box>
                  ) : (
                    <Box
                      component="button" onClick={handleNext} disabled={!canNext}
                      sx={{
                        bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                        borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
                        px: 3, py: 1, fontWeight: 'bold', color: P.blue.border,
                        cursor: canNext ? 'pointer' : 'not-allowed', opacity: canNext ? 1 : 0.5,
                        transition: 'all 0.15s',
                        '&:hover': canNext ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` } : {}
                      }}
                    >Next →</Box>
                  )}
                </Stack>
              </Box>
            </motion.div>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{
              bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
              p: 4, mb: 3, textAlign: 'center'
            }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.green.shadow }} gutterBottom>✓ Task B Complete!</Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>Score: {score} / 8</Typography>
            </Box>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Box
                component="button" onClick={handleContinue}
                sx={{
                  bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                  borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
                  px: 4, py: 1.5, fontSize: '1rem', fontWeight: 'bold',
                  color: P.green.shadow, cursor: 'pointer',
                  transition: 'all 0.15s',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }
                }}
              >Next: Task C →</Box>
            </Stack>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
