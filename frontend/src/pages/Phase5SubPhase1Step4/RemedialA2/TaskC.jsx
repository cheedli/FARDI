import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Button, Stack, TextField, LinearProgress, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { CheckCircle, Cancel } from '@mui/icons-material'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' } }
const DARK = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' } }

const SENTENCE_PROMPTS = [
  { term: 'lights', correctAnswer: 'Lights problem.' }, { term: 'backup', correctAnswer: 'Use backup.' },
  { term: 'announce', correctAnswer: 'Announce now.' }, { term: 'fix', correctAnswer: 'Fix fast.' },
  { term: 'thank', correctAnswer: 'Thank you.' }, { term: 'festival', correctAnswer: 'Festival ok.' }
]

export default function Phase5Step4RemedialA2TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 4, interaction: 3, context: 'remedial_a2' })
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
  const checkAnswer = (userAnswer, prompt) => {
    const n = userAnswer.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[.,!?;:]/g, '')
    return n.includes(prompt.term.toLowerCase()) && n.split(' ').length >= 2
  }
  const handleSubmit = async () => {
    const checkResults = userAnswers.map((answer, index) => { const p = SENTENCE_PROMPTS[index]; const isCorrect = checkAnswer(answer, p); return { userAnswer: answer, correctAnswer: p.correctAnswer, isCorrect } })
    const correctCount = checkResults.filter(r => r.isCorrect).length
    setResults(checkResults); setScore(correctCount); setSubmitted(true)
    sessionStorage.setItem('phase5_step4_remedial_a2_taskC_score', correctCount.toString())
    try { await phase5API.logRemedialActivity(4, 'A2', 'C', correctCount, 6, 0) } catch (e) { console.error(e) }
  }
  const handleContinue = async () => {
    const a = parseInt(sessionStorage.getItem('phase5_step4_remedial_a2_taskA_score') || '0')
    const b = parseInt(sessionStorage.getItem('phase5_step4_remedial_a2_taskB_score') || '0')
    const c = parseInt(sessionStorage.getItem('phase5_step4_remedial_a2_taskC_score') || '0')
    let nextUrl = '/phase5/subphase/1/step/4/remedial/a2/task/a'
    try {
      const result = await phase5API.calculateRemedialScore(4, 'A2', { task_a_score: a, task_b_score: b, task_c_score: c })
      nextUrl = result?.data?.next_url || nextUrl
    } catch (e) {
      console.error(e)
    }
    navigate(nextUrl)
  }
  const progress = ((currentIndex + 1) / 6) * 100

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Phase 5: Execution & Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 4: Remedial Practice - Level A2</Typography>
            <Typography variant="h6" gutterBottom sx={{ color: P.orange.border }}>Task C: Sentence Builder</Typography>
            <Typography variant="body1">Write 6 simple sentences about the crisis</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...clay(P.teal), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Sentence Builder! Write simple sentences for each term using simple present tense!" />
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
                <Typography variant="h6" gutterBottom sx={{ color: P.blue.border }}>Term: <strong>{SENTENCE_PROMPTS[currentIndex].term}</strong></Typography>
                <Box sx={{ bgcolor: P.blue.bg, border: `1px solid ${P.blue.border}`, borderRadius: '12px', p: 2, mb: 2 }}>
                  <Typography variant="body2"><strong>Example:</strong> {SENTENCE_PROMPTS[currentIndex].correctAnswer}</Typography>
                </Box>
                <TextField fullWidth multiline rows={2} variant="outlined" placeholder={`Write a simple sentence using "${SENTENCE_PROMPTS[currentIndex].term}"...`} value={userAnswers[currentIndex]} onChange={(e) => handleAnswerChange(e.target.value)} sx={{ mb: 2 }} />
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
                      <Typography variant="subtitle2" fontWeight="bold">Sentence {index + 1}: {SENTENCE_PROMPTS[index].term}</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 0.5 }}><strong>Your answer:</strong> {result.userAnswer || '(empty)'}</Typography>
                    {!result.isCorrect && <Typography variant="body2" sx={{ color: P.green.border }}><strong>Example:</strong> {result.correctAnswer}</Typography>}
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
