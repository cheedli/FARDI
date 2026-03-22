import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, TextField, LinearProgress } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { CheckCircle, Cancel } from '@mui/icons-material'
import InfoIcon from '@mui/icons-material/Info'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

const SENTENCE_PROMPTS = [
  { term: 'emergency', correctAnswer: 'Emergency is problem.' },
  { term: 'contingency', correctAnswer: 'Contingency is plan.' },
  { term: 'backup', correctAnswer: 'Backup is extra.' },
  { term: 'announce', correctAnswer: 'Announce is tell.' },
  { term: 'update', correctAnswer: 'Update is new.' },
  { term: 'fix', correctAnswer: 'Fix is good.' }
]

export default function Phase5Step3RemedialA2TaskC() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 3, interaction: 3, context: 'remedial_a2' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState(Array(6).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState([])
  const [score, setScore] = useState(0)

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })

  const handleAnswerChange = (value) => { const n = [...userAnswers]; n[currentIndex] = value; setUserAnswers(n) }
  const handleNext = () => { if (currentIndex < 5) setCurrentIndex(currentIndex + 1) }
  const handlePrevious = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1) }

  const checkAnswer = (userAnswer, prompt) => {
    const normalized = userAnswer.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[.,!?;:]/g, '')
    return normalized.includes(prompt.term.toLowerCase()) && normalized.split(' ').length >= 3
  }

  const handleSubmit = async () => {
    const checkResults = userAnswers.map((answer, index) => {
      const prompt = SENTENCE_PROMPTS[index]
      const isCorrect = checkAnswer(answer, prompt)
      return { userAnswer: answer, correctAnswer: prompt.correctAnswer, isCorrect }
    })
    const correctCount = checkResults.filter(r => r.isCorrect).length
    setResults(checkResults)
    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_step3_remedial_a2_taskC_score', correctCount.toString())
    try { await phase5API.logRemedialActivity(3, 'A2', 'C', correctCount, 6, 0) } catch (e) { console.error(e) }
  }

  const handleContinue = async () => {
    const taskAScore = parseInt(sessionStorage.getItem('phase5_step3_remedial_a2_taskA_score') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('phase5_step3_remedial_a2_taskB_score') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('phase5_step3_remedial_a2_taskC_score') || '0')
    const totalScore = taskAScore + taskBScore + taskCScore
    const passed = totalScore >= Math.ceil((8 + 8 + 6) * 0.8)
    try { await phase5API.calculateRemedialScore(3, 'A2', { task_a_score: taskAScore, task_b_score: taskBScore, task_c_score: taskCScore }) } catch (e) { console.error(e) }
    navigate(passed ? '/dashboard' : '/phase5/subphase/1/step/3/remedial/a2/task/a')
  }

  const progress = ((currentIndex + 1) / 6) * 100

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Phase 5: Execution &amp; Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 3: Remedial Practice - Level A2</Typography>
            <Typography variant="h6" gutterBottom sx={{ color: P.orange.border }}>Task C: Sentence Builder</Typography>
            <Typography variant="body1" color="text.secondary">Write 6 simple sentences using crisis terms</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Sentence Builder! Write simple sentences for each term using simple present tense!" />
          </Box>
        </motion.div>
        {!submitted ? (
          <>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Box sx={{ ...cardSx(P.yellow), mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Sentence {currentIndex + 1} of 6</Typography>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: P.yellow.border }}>{Math.round(progress)}% Complete</Typography>
                </Box>
                <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
              </Box>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>Term: <strong>{SENTENCE_PROMPTS[currentIndex].term}</strong></Typography>
                <Box sx={{ ...cardSx(P.teal), mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <InfoIcon sx={{ color: P.teal.border, mr: 1, fontSize: 18 }} />
                    <Typography variant="body2" sx={{ color: P.teal.border }}><strong>Example:</strong> {SENTENCE_PROMPTS[currentIndex].correctAnswer}</Typography>
                  </Box>
                </Box>
                <TextField fullWidth multiline rows={2} variant="outlined" placeholder={`Write a simple sentence using "${SENTENCE_PROMPTS[currentIndex].term}"...`} value={userAnswers[currentIndex]} onChange={(e) => handleAnswerChange(e.target.value)} sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box component="button" onClick={handlePrevious} disabled={currentIndex === 0} sx={{ flex: 1, bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`, py: 1.5, cursor: currentIndex === 0 ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '0.9rem', color: P.yellow.border, opacity: currentIndex === 0 ? 0.5 : 1, transition: 'all 0.15s ease' }}>← Previous</Box>
                  {currentIndex === 5 ? (
                    <Box component="button" onClick={handleSubmit} disabled={!userAnswers[currentIndex].trim()} sx={{ flex: 2, bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, py: 1.5, cursor: !userAnswers[currentIndex].trim() ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '0.9rem', color: P.orange.border, opacity: !userAnswers[currentIndex].trim() ? 0.5 : 1, '&:hover': userAnswers[currentIndex].trim() ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {}, transition: 'all 0.15s ease' }}>Submit All</Box>
                  ) : (
                    <Box component="button" onClick={handleNext} disabled={!userAnswers[currentIndex].trim()} sx={{ flex: 2, bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, py: 1.5, cursor: !userAnswers[currentIndex].trim() ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '0.9rem', color: P.blue.border, opacity: !userAnswers[currentIndex].trim() ? 0.5 : 1, '&:hover': userAnswers[currentIndex].trim() ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` } : {}, transition: 'all 0.15s ease' }}>Next →</Box>
                  )}
                </Box>
              </Box>
            </motion.div>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.yellow), mb: 3 }}>
              <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.yellow.border }}>Results: {score} / 6 Correct</Typography>
              <Stack spacing={2} sx={{ mt: 2 }}>
                {results.map((result, index) => (
                  <Box key={index} sx={{ ...cardSx(result.isCorrect ? P.green : P.red), p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {result.isCorrect ? <CheckCircle sx={{ color: P.green.border, mr: 1 }} /> : <Cancel sx={{ color: P.red.border, mr: 1 }} />}
                      <Typography variant="subtitle2" fontWeight="bold">Sentence {index + 1}: {SENTENCE_PROMPTS[index].term}</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 0.5 }}><strong>Your answer:</strong> {result.userAnswer || '(empty)'}</Typography>
                    {!result.isCorrect && <Typography variant="body2" sx={{ color: P.green.border }}><strong>Example:</strong> {result.correctAnswer}</Typography>}
                  </Box>
                ))}
              </Stack>
            </Box>
            <Box component="button" onClick={handleContinue} sx={{ width: '100%', bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`, py: 1.5, cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', color: P.green.border, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s ease' }}>
              Continue to Final Results →
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
