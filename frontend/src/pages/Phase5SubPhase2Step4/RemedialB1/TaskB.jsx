import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, Stack, LinearProgress } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
}

const GUIDED_QUESTIONS = [
  { id: 1, question: 'Welcome?', example: 'Please welcome guests.' },
  { id: 2, question: 'Check?', example: 'First check ticket.' },
  { id: 3, question: 'Guide?', example: 'Then guide to booth.' },
  { id: 4, question: 'Safety?', example: 'Be careful.' },
  { id: 5, question: 'Help?', example: 'Help if ask.' },
  { id: 6, question: 'Thank?', example: 'Say thank you.' },
  { id: 7, question: 'Smile?', example: 'Please smile.' },
  { id: 8, question: 'Positive?', example: 'Stay positive.' }
]

export default function Phase5SubPhase2Step4RemedialB1TaskB() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 4, interaction: 2, context: 'remedial_b1' })
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
    answers.forEach(answer => { const words = answer.trim().split(/\s+/).filter(w => w.length > 0); if (words.length >= 4) correctCount++ })
    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_subphase2_step4_remedial_b1_taskB_score', correctCount.toString())
    try { await phase5API.logRemedialActivity(4, 'B1', 'B', correctCount, 8, 2) } catch (error) { console.error('Failed to log task completion:', error) }
  }

  const handleContinue = () => navigate('/phase5/subphase/2/step/4/remedial/b1/task/c')
  const progress = ((currentIndex + 1) / 8) * 100

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Phase 5: Execution & Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.shadow }}>SubPhase 2 Step 4: Remedial Practice - Level B1</Typography>
            <Typography variant="h6" gutterBottom sx={{ color: P.orange.shadow }}>Task B: Writing Proposals</Typography>
            <Typography variant="body1">Write 8 sentences giving instructions for a volunteer role. Duel with definitions for wins!</Typography>
          </Box>
          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Writing Proposals! Write 8 sentences giving instructions for a volunteer role. Each sentence should have at least 4 words and be polite." />
          </Box>
          {!submitted ? (
            <>
              <Box sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '14px', boxShadow: `3px 3px 0 ${P.yellow.shadow}`, p: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Question {currentIndex + 1} of 8</Typography>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: P.yellow.shadow }}>{Math.round(progress)}% Complete</Typography>
                </Box>
                <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
              </Box>
              <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ color: P.blue.shadow }}>{GUIDED_QUESTIONS[currentIndex].question}</Typography>
                <Box sx={{ bgcolor: P.yellow.bg, border: `1px solid ${P.yellow.border}`, borderRadius: '10px', p: 2, mb: 2 }}>
                  <Typography variant="body2"><strong>Example:</strong> {GUIDED_QUESTIONS[currentIndex].example}</Typography>
                </Box>
                <TextField fullWidth multiline rows={3} variant="outlined" placeholder="Write your instruction here..." value={answers[currentIndex]} onChange={(e) => handleAnswerChange(e.target.value)} sx={{ mb: 2 }} />
                <Stack direction="row" spacing={2} justifyContent="space-between">
                  <Box component="button" onClick={handlePrevious} disabled={currentIndex === 0}
                    sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.orange.shadow}`, px: 3, py: 1, fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer', color: P.orange.shadow, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.orange.shadow}` }, '&:disabled': { opacity: 0.4, cursor: 'not-allowed' }, transition: 'all 0.15s ease' }}>
                    ← Previous
                  </Box>
                  {currentIndex === 7 ? (
                    <Box component="button" onClick={handleSubmit} disabled={!answers[currentIndex].trim()}
                      sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.orange.shadow}`, px: 3, py: 1, fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer', color: P.orange.shadow, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.orange.shadow}` }, '&:disabled': { opacity: 0.4, cursor: 'not-allowed' }, transition: 'all 0.15s ease' }}>
                      Submit All
                    </Box>
                  ) : (
                    <Box component="button" onClick={handleNext} disabled={!answers[currentIndex].trim()}
                      sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.orange.shadow}`, px: 3, py: 1, fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer', color: P.orange.shadow, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.orange.shadow}` }, '&:disabled': { opacity: 0.4, cursor: 'not-allowed' }, transition: 'all 0.15s ease' }}>
                      Next →
                    </Box>
                  )}
                </Stack>
              </Box>
            </>
          ) : (
            <>
              <Box sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`, p: 4, mb: 3, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ color: P.green.shadow }} gutterBottom>Task B Complete!</Typography>
                <Typography variant="h6" sx={{ mt: 2 }}>Score: {score} / 8</Typography>
              </Box>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Box component="button" onClick={handleContinue}
                  sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`, px: 4, py: 1.5, fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', color: P.green.shadow, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s ease' }}>
                  Next: Task C →
                </Box>
              </Stack>
            </>
          )}
        </motion.div>
      </Container>
    </Box>
  )
}
