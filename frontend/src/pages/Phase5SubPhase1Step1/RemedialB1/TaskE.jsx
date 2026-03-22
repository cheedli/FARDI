import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, TextField, LinearProgress, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 5 Step 1 - Remedial B1 - Task E: Tense Time Travel
 */

const LIGHT = {
  pageBg: '#FFFDE7',
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
}

const SENTENCES = [
  { id: 1, present: 'Singer cancel', past: 'canceled', full: 'Singer canceled.' },
  { id: 2, present: 'We find solution', past: 'found', full: 'We found solution.' },
  { id: 3, present: 'Send sorry message', past: 'sent', full: 'Sent sorry message.' },
  { id: 4, present: 'Change time', past: 'changed', full: 'Changed time.' },
  { id: 5, present: 'Fix problem', past: 'fixed', full: 'Fixed problem.' },
  { id: 6, present: 'Tell people', past: 'told', full: 'Told people.' }
]

export default function Phase5Step1RemedialB1TaskE() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 1, interaction: 5, context: 'remedial_b1' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState(Array(6).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerChange = (value) => {
    const newAnswers = [...answers]
    newAnswers[currentIndex] = value
    setAnswers(newAnswers)
  }

  const handleNext = () => { if (currentIndex < 5) setCurrentIndex(currentIndex + 1) }
  const handlePrevious = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1) }

  const handleSubmit = async () => {
    let correctCount = 0
    SENTENCES.forEach((sent, idx) => {
      const answer = answers[idx].toLowerCase().trim()
      if (answer.includes(sent.past)) correctCount++
    })
    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_step1_remedial_b1_taskE_score', correctCount.toString())
    try {
      await phase5API.logRemedialActivity(1, 'B1', 'E', correctCount, 6, 0)
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/1/step/1/remedial/b1/task/f')
  }

  const progress = ((currentIndex + 1) / 6) * 100
  const canPrev = currentIndex > 0
  const canNext = !!(answers[currentIndex].trim())

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{
            bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
            p: 3, mb: 3
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Phase 5: Execution & Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.shadow }}>Step 1: Remedial Practice - Level B1</Typography>
            <Typography variant="h6" gutterBottom fontWeight="bold">Task E: Tense Time Travel</Typography>
            <Typography variant="body1">Rewrite 6 sentences in past tense</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3
          }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Tense Time Travel! Rewrite each sentence in the past tense. Change the verb to its past form!" />
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
                  <Typography variant="body2">Sentence {currentIndex + 1} of 6</Typography>
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
                <Typography variant="h6" gutterBottom sx={{ color: P.blue.border }}>Present: {SENTENCES[currentIndex].present}</Typography>
                <TextField
                  fullWidth variant="outlined" placeholder="Write in past tense..."
                  value={answers[currentIndex]} onChange={(e) => handleAnswerChange(e.target.value)}
                  sx={{ mb: 2, mt: 2 }}
                />
                <Stack direction="row" spacing={2} justifyContent="space-between">
                  <Box
                    component="button"
                    onClick={handlePrevious}
                    disabled={!canPrev}
                    sx={{
                      bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
                      borderRadius: '12px', boxShadow: `3px 3px 0 ${P.orange.shadow}`,
                      px: 3, py: 1, fontWeight: 'bold', color: P.orange.border,
                      cursor: canPrev ? 'pointer' : 'not-allowed', opacity: canPrev ? 1 : 0.5,
                      transition: 'all 0.15s',
                      '&:hover': canPrev ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.orange.shadow}` } : {}
                    }}
                  >
                    ← Previous
                  </Box>
                  {currentIndex === 5 ? (
                    <Box
                      component="button"
                      onClick={handleSubmit}
                      disabled={!canNext}
                      sx={{
                        bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                        borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
                        px: 3, py: 1, fontWeight: 'bold', color: P.blue.border,
                        cursor: canNext ? 'pointer' : 'not-allowed', opacity: canNext ? 1 : 0.5,
                        transition: 'all 0.15s',
                        '&:hover': canNext ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` } : {}
                      }}
                    >
                      Submit All
                    </Box>
                  ) : (
                    <Box
                      component="button"
                      onClick={handleNext}
                      disabled={!canNext}
                      sx={{
                        bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                        borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
                        px: 3, py: 1, fontWeight: 'bold', color: P.blue.border,
                        cursor: canNext ? 'pointer' : 'not-allowed', opacity: canNext ? 1 : 0.5,
                        transition: 'all 0.15s',
                        '&:hover': canNext ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` } : {}
                      }}
                    >
                      Next →
                    </Box>
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
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.green.shadow }} gutterBottom>✓ Task E Complete!</Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>Score: {score} / 6</Typography>
            </Box>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Box
                component="button"
                onClick={handleContinue}
                sx={{
                  bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                  borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
                  px: 4, py: 1.5, fontSize: '1rem', fontWeight: 'bold',
                  color: P.green.shadow, cursor: 'pointer',
                  transition: 'all 0.15s',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }
                }}
              >
                Next: Task F →
              </Box>
            </Stack>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
