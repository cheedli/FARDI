import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, RadioGroup, FormControlLabel, Radio, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

const QUESTIONS = [
  { question: 'Success means?', options: ['Good result', 'Problem', 'Weakness'], correct: 0 },
  { question: 'Challenge means?', options: ['Easy task', 'Difficult thing', 'Good feeling'], correct: 1 },
  { question: 'Feedback means?', options: ['A game', 'Opinion', 'Success'], correct: 1 },
  { question: 'Improve means?', options: ['Make better', 'Give up', 'Challenge'], correct: 0 },
  { question: 'Positive means?', options: ['Bad feeling', 'Good feeling', 'Difficult thing'], correct: 1 },
  { question: 'Recommend means?', options: ['Suggest better', 'Make worse', 'Start again'], correct: 0 }
]

export default function Phase6SP1Step1RemB1TaskC() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 1, interaction: 3, context: 'remedial_b1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    let correct = 0
    QUESTIONS.forEach((q, i) => { if (parseInt(answers[i]) === q.correct) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step1_remedial_b1_taskc_score', correct.toString())
    try { await phase6API.logRemedialActivity(1, 'B1', 'C', correct, QUESTIONS.length, 0, 1) } catch (e) { console.error(e) }
  }

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
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>Step 1: Remedial B1 - Task C</Typography>
            <Typography variant="body1" sx={{ color: P.orange.shadow }}>Vocabulary Quiz</Typography>
          </Box>
        </motion.div>

        <Stack spacing={2} sx={{ mb: 3 }}>
          {QUESTIONS.map((q, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 + idx * 0.04 }}>
              <Box sx={{
                bgcolor: submitted ? (parseInt(answers[idx]) === q.correct ? P.green.bg : P.red.bg) : P.yellow.bg,
                border: `2px solid ${submitted ? (parseInt(answers[idx]) === q.correct ? P.green.border : P.red.border) : P.yellow.border}`,
                borderRadius: '14px',
                boxShadow: `2px 2px 0 ${submitted ? (parseInt(answers[idx]) === q.correct ? P.green.shadow : P.red.shadow) : P.yellow.shadow}`,
                p: 3
              }}>
                <Typography variant="body1" fontWeight="bold" sx={{ mb: 1, color: P.orange.shadow }}>{idx + 1}. {q.question}</Typography>
                <RadioGroup value={answers[idx] ?? ''} onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })}>
                  {q.options.map((opt, oi) => (
                    <FormControlLabel key={oi} value={oi.toString()} control={<Radio disabled={submitted} />} label={opt} />
                  ))}
                </RadioGroup>
              </Box>
            </motion.div>
          ))}
        </Stack>

        {!submitted ? (
          <Box
            component="button"
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < QUESTIONS.length}
            sx={{
              cursor: Object.keys(answers).length >= QUESTIONS.length ? 'pointer' : 'not-allowed',
              opacity: Object.keys(answers).length >= QUESTIONS.length ? 1 : 0.6,
              width: '100%',
              py: 1.5,
              bgcolor: P.orange.bg,
              border: `2px solid ${P.orange.border}`,
              borderRadius: '16px',
              boxShadow: `4px 4px 0 ${P.orange.shadow}`,
              fontSize: '1rem',
              fontWeight: 'bold',
              color: P.orange.shadow,
              '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` },
              transition: 'all 0.15s'
            }}
          >
            Submit Answers
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{
              bgcolor: P.green.bg,
              border: `2px solid ${P.green.border}`,
              borderRadius: '20px',
              boxShadow: `4px 4px 0 ${P.green.shadow}`,
              p: 3,
              textAlign: 'center'
            }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.green.shadow }}>Score: {score}/{QUESTIONS.length}</Typography>
              <Box
                component="button"
                onClick={() => navigate('/phase6/subphase/1/step/2')}
                sx={{
                  cursor: 'pointer',
                  mt: 2,
                  px: 4,
                  py: 1.5,
                  bgcolor: P.green.bg,
                  border: `2px solid ${P.green.border}`,
                  borderRadius: '16px',
                  boxShadow: `4px 4px 0 ${P.green.shadow}`,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: P.green.shadow,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s'
                }}
              >
                Continue
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
