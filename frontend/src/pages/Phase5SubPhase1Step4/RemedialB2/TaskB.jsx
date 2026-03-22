import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, Stack, LinearProgress, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' } }
const DARK = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' } }

const GUIDED_QUESTIONS = [
  { id: 1, question: 'Identify problem.', example: 'Lighting failure.' },
  { id: 2, question: 'Immediate action.', example: 'Deploy backup.' },
  { id: 3, question: 'Audience announcement.', example: 'Inform calmly.' },
  { id: 4, question: 'Team communication.', example: 'Update internally.' },
  { id: 5, question: 'Sponsor notification.', example: 'Email sponsors.' },
  { id: 6, question: 'Social media update.', example: 'Post progress.' },
  { id: 7, question: 'Reassurance.', example: 'Thank patience.' },
  { id: 8, question: 'Follow-up.', example: 'Confirm resolution.' }
]

export default function Phase5Step4RemedialB2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 4, interaction: 2, context: 'remedial_b2' })
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState(Array(8).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const clay = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })

  const handleAnswerChange = (value) => {
    const newAnswers = [...answers]; newAnswers[currentIndex] = value; setAnswers(newAnswers)
  }
  const handleNext = () => { if (currentIndex < 7) setCurrentIndex(currentIndex + 1) }
  const handlePrevious = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1) }

  const handleSubmit = async () => {
    let correctCount = 0
    answers.forEach(answer => { const words = answer.trim().split(/\s+/).filter(w => w.length > 0); if (words.length >= 8) correctCount++ })
    setScore(correctCount); setSubmitted(true)
    sessionStorage.setItem('phase5_step4_remedial_b2_taskB_score', correctCount.toString())
    try { await phase5API.logRemedialActivity(4, 'B2', 'B', correctCount, 8, 0) } catch (e) { console.error(e) }
  }

  const handleContinue = () => { navigate('/phase5/subphase/1/step/4/remedial/b2/task/c') }
  const progress = ((currentIndex + 1) / 8) * 100

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Phase 5: Execution & Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 4: Remedial Practice - Level B2</Typography>
            <Typography variant="h6" gutterBottom sx={{ color: P.orange.border }}>Task B: Crisis Communication Plan</Typography>
            <Typography variant="body1">Write an 8-sentence crisis communication plan</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...clay(P.teal), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome! Write an 8-sentence crisis communication plan with B2 structure. Each sentence should be 8+ words." />
          </Box>
        </motion.div>
        {!submitted ? (
          <>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Box sx={{ ...clay(P.blue), mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Sentence {currentIndex + 1} of 8</Typography>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: P.blue.border }}>{Math.round(progress)}% Complete</Typography>
                </Box>
                <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 1 }} />
              </Box>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Box sx={{ ...clay(P.blue), mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ color: P.blue.border }}>{GUIDED_QUESTIONS[currentIndex].question}</Typography>
                <Box sx={{ bgcolor: P.blue.bg, border: `1px solid ${P.blue.border}`, borderRadius: '12px', p: 2, mb: 2 }}>
                  <Typography variant="body2"><strong>Example:</strong> {GUIDED_QUESTIONS[currentIndex].example}</Typography>
                </Box>
                <TextField fullWidth multiline rows={3} variant="outlined" placeholder="Write your sentence here (8+ words)..." value={answers[currentIndex]} onChange={(e) => handleAnswerChange(e.target.value)} sx={{ mb: 2 }} />
                <Stack direction="row" spacing={2} justifyContent="space-between">
                  <Box component="button" onClick={handlePrevious} disabled={currentIndex === 0} sx={{ ...clay(P.blue), cursor: 'pointer', opacity: currentIndex === 0 ? 0.5 : 1, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` }, transition: 'all 0.15s' }}>
                    <Typography variant="button" sx={{ color: P.blue.border }}>← Previous</Typography>
                  </Box>
                  {currentIndex === 7 ? (
                    <Box component="button" onClick={handleSubmit} disabled={!answers[currentIndex].trim()} sx={{ ...clay(P.orange), cursor: 'pointer', opacity: !answers[currentIndex].trim() ? 0.6 : 1, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }, transition: 'all 0.15s' }}>
                      <Typography variant="button" fontWeight="bold" sx={{ color: P.orange.border }}>Submit All</Typography>
                    </Box>
                  ) : (
                    <Box component="button" onClick={handleNext} disabled={!answers[currentIndex].trim()} sx={{ ...clay(P.orange), cursor: 'pointer', opacity: !answers[currentIndex].trim() ? 0.6 : 1, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }, transition: 'all 0.15s' }}>
                      <Typography variant="button" fontWeight="bold" sx={{ color: P.orange.border }}>Next →</Typography>
                    </Box>
                  )}
                </Stack>
              </Box>
            </motion.div>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...clay(P.green), mb: 3, textAlign: 'center' }}>
              <Typography variant="h5" sx={{ color: P.green.border }} gutterBottom>✓ Task B Complete!</Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>Score: {score} / 8</Typography>
            </Box>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Box component="button" onClick={handleContinue} sx={{ ...clay(P.green), cursor: 'pointer', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s' }}>
                <Typography variant="button" fontWeight="bold" sx={{ color: P.green.border }}>Next: Task C →</Typography>
              </Box>
            </Stack>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
