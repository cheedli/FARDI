import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, Stack, LinearProgress, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { CheckCircle, Cancel } from '@mui/icons-material'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' } }
const DARK = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' } }

const GRAMMAR_EXERCISES = [
  { faulty: 'Lights problem.', correct: 'The lights have problem.' },
  { faulty: 'We use backup.', correct: 'We use the backup.' },
  { faulty: 'Announce now.', correct: 'We announce now.' },
  { faulty: 'Fix fast.', correct: 'We fix fast.' },
  { faulty: 'Thank you.', correct: 'Thank you very much.' },
  { faulty: 'Festival ok.', correct: 'The festival is ok.' }
]

export default function Phase5Step5RemedialA2TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 5, interaction: 3, context: 'remedial_a2' })
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState(Array(6).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState([])
  const [score, setScore] = useState(0)

  const clay = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })

  const handleAnswerChange = (value) => { const a = [...userAnswers]; a[currentIndex] = value; setUserAnswers(a) }
  const handleNext = () => { if (currentIndex < 5) setCurrentIndex(currentIndex + 1) }
  const handlePrevious = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1) }

  const checkAnswer = (userAnswer, correct) => {
    const n = userAnswer.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[.,!?;:]/g, '')
    const c = correct.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[.,!?;:]/g, '')
    return n === c || n.includes(c.split(' ').slice(0, 3).join(' '))
  }

  const handleSubmit = async () => {
    const checkResults = userAnswers.map((answer, index) => {
      const exercise = GRAMMAR_EXERCISES[index]
      const isCorrect = checkAnswer(answer, exercise.correct)
      return { userAnswer: answer, correctAnswer: exercise.correct, isCorrect }
    })
    const correctCount = checkResults.filter(r => r.isCorrect).length
    setResults(checkResults); setScore(correctCount); setSubmitted(true)
    sessionStorage.setItem('phase5_step5_remedial_a2_taskC_score', correctCount.toString())
    try { await phase5API.logRemedialActivity(5, 'A2', 'C', correctCount, 6, 0) } catch (e) { console.error(e) }
  }

  const handleContinue = async () => {
    const a = parseInt(sessionStorage.getItem('phase5_step5_remedial_a2_taskA_score') || '0')
    const b = parseInt(sessionStorage.getItem('phase5_step5_remedial_a2_taskB_score') || '0')
    const c = parseInt(sessionStorage.getItem('phase5_step5_remedial_a2_taskC_score') || '0')
    const total = a + b + c; const passed = total >= Math.ceil(22 * 0.8)
    try { await phase5API.calculateRemedialScore(5, 'A2', { task_a_score: a, task_b_score: b, task_c_score: c }) } catch (e) { console.error(e) }
    if (passed) navigate('/dashboard'); else navigate('/phase5/subphase/1/step/5/remedial/a2/task/a')
  }

  const progress = ((currentIndex + 1) / 6) * 100

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Phase 5: Execution & Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 5: Remedial Practice - Level A2</Typography>
            <Typography variant="h6" gutterBottom sx={{ color: P.orange.border }}>Task C: Sentence Builder</Typography>
            <Typography variant="body1">Correct 6 grammar mistakes in crisis sentences</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...clay(P.teal), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Sentence Builder! Correct the grammar mistakes in each sentence!" />
          </Box>
        </motion.div>
        {!submitted ? (
          <>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Box sx={{ ...clay(P.blue), mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Sentence {currentIndex + 1} of 6</Typography>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: P.blue.border }}>{Math.round(progress)}% Complete</Typography>
                </Box>
                <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 1 }} />
              </Box>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Box sx={{ ...clay(P.blue), mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ color: P.blue.border }}>Faulty Sentence:</Typography>
                <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic', color: P.red.border }}>"{GRAMMAR_EXERCISES[currentIndex].faulty}"</Typography>
                <Box sx={{ bgcolor: P.blue.bg, border: `1px solid ${P.blue.border}`, borderRadius: '12px', p: 2, mb: 2 }}>
                  <Typography variant="body2"><strong>Example:</strong> {GRAMMAR_EXERCISES[currentIndex].correct}</Typography>
                </Box>
                <TextField fullWidth multiline rows={2} variant="outlined" placeholder="Write the corrected sentence here..." value={userAnswers[currentIndex]} onChange={(e) => handleAnswerChange(e.target.value)} sx={{ mb: 2 }} />
                <Stack direction="row" spacing={2} justifyContent="space-between">
                  <Box component="button" onClick={handlePrevious} disabled={currentIndex === 0} sx={{ ...clay(P.blue), cursor: 'pointer', opacity: currentIndex === 0 ? 0.5 : 1, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` }, transition: 'all 0.15s' }}>
                    <Typography variant="button" sx={{ color: P.blue.border }}>← Previous</Typography>
                  </Box>
                  {currentIndex === 5 ? (
                    <Box component="button" onClick={handleSubmit} disabled={!userAnswers[currentIndex].trim()} sx={{ ...clay(P.orange), cursor: 'pointer', opacity: !userAnswers[currentIndex].trim() ? 0.6 : 1, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }, transition: 'all 0.15s' }}>
                      <Typography variant="button" fontWeight="bold" sx={{ color: P.orange.border }}>Submit All Sentences</Typography>
                    </Box>
                  ) : (
                    <Box component="button" onClick={handleNext} disabled={!userAnswers[currentIndex].trim()} sx={{ ...clay(P.orange), cursor: 'pointer', opacity: !userAnswers[currentIndex].trim() ? 0.6 : 1, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }, transition: 'all 0.15s' }}>
                      <Typography variant="button" fontWeight="bold" sx={{ color: P.orange.border }}>Next →</Typography>
                    </Box>
                  )}
                </Stack>
              </Box>
            </motion.div>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...clay(P.blue), mb: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ color: P.blue.border }}>Results: {score} / 6 Correct</Typography>
              <Stack spacing={2} sx={{ mt: 2 }}>
                {results.map((result, index) => (
                  <Box key={index} sx={{ bgcolor: result.isCorrect ? P.green.bg : P.red.bg, border: `1px solid ${result.isCorrect ? P.green.border : P.red.border}`, borderRadius: '12px', p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {result.isCorrect ? <CheckCircle sx={{ color: P.green.border, mr: 1 }} /> : <Cancel sx={{ color: P.red.border, mr: 1 }} />}
                      <Typography variant="subtitle2" fontWeight="bold">Sentence {index + 1}</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 0.5 }}><strong>Your answer:</strong> {result.userAnswer || '(empty)'}</Typography>
                    {!result.isCorrect && <Typography variant="body2" sx={{ color: P.green.border }}><strong>Correct:</strong> {result.correctAnswer}</Typography>}
                  </Box>
                ))}
              </Stack>
            </Box>
            <Box component="button" onClick={handleContinue} sx={{ ...clay(P.green), cursor: 'pointer', width: '100%', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s' }}>
              <Typography variant="button" fontWeight="bold" sx={{ color: P.green.border }}>Continue to Final Results →</Typography>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
