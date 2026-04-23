import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, RadioGroup, FormControlLabel, Radio } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { resolveSubphase2RemedialNextUrl } from '../../Phase6SubPhase2/shared/routing.js'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

const QUESTIONS = [
  { question: 'What does "feedback" mean?', options: ['Comments about your work', 'A type of food', 'A game to play'], correct: 0 },
  { question: 'What does "positive" mean in feedback?', options: ['Something unhelpful', 'Good things to say', 'Being very negative'], correct: 1 },
  { question: 'What is a "suggestion" in peer feedback?', options: ['A harsh criticism', 'An idea to help improve', 'A complaint'], correct: 1 },
  { question: 'What is a "strength" in a report?', options: ['A good part that works well', 'An area for improvement', 'A spelling error'], correct: 0 },
  { question: 'What is a "weakness" in a report?', options: ['Something perfect', 'Something that needs improvement', 'The title of the report'], correct: 1 },
  { question: 'What does "helpful" mean in the context of feedback?', options: ['Something that makes the person feel bad', 'Something that is not useful', 'Something that is good to use and useful for improving'], correct: 2 }
]

export default function Phase6SP2Step3RemB1TaskC() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 3, interaction: 3, context: 'remedial_b1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    let correct = 0
    QUESTIONS.forEach((q, i) => { if (parseInt(answers[i]) === q.correct) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step3_remedial_b1_taskc_score', correct.toString())
    try { await phase6API.logRemedialActivity(3, 'B1', 'C', correct, QUESTIONS.length, 0, 2) } catch (e) { console.error(e) }
  }

  const cardSx = (color) => ({
    bgcolor: P[color].bg,
    border: `2px solid ${P[color].border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${P[color].shadow}`,
    p: 3,
  })

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx('orange'), mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: P.orange.border, mb: 0.5 }}>Step 3: Remedial B1 - Task C</Typography>
            <Typography>Quiz Game: Feedback Term Definitions</Typography>
          </Box>

          <Box sx={{ ...cardSx('blue'), mb: 3 }}>
            <Typography variant="body2">Answer 6 questions about feedback word definitions.</Typography>
          </Box>

          <Stack spacing={2} sx={{ mb: 3 }}>
            {QUESTIONS.map((q, idx) => (
              <Box key={idx} sx={{
                ...cardSx('teal'),
                border: submitted ? `2px solid ${parseInt(answers[idx]) === q.correct ? P.green.border : P.red.border}` : `2px solid ${P.teal.border}`,
                bgcolor: submitted ? (parseInt(answers[idx]) === q.correct ? P.green.bg : P.red.bg) : P.teal.bg,
              }}>
                <Typography variant="body1" sx={{ fontWeight: 700, mb: 1 }}>{idx + 1}. {q.question}</Typography>
                <RadioGroup value={answers[idx] ?? ''} onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })}>
                  {q.options.map((opt, oi) => (
                    <FormControlLabel key={oi} value={oi.toString()} control={<Radio disabled={submitted} sx={{ color: P.purple.border, '&.Mui-checked': { color: P.purple.border } }} />} label={opt} />
                  ))}
                </RadioGroup>
                {submitted && parseInt(answers[idx]) !== q.correct && (
                  <Typography variant="body2" sx={{ color: P.red.border, mt: 1 }}>Correct: <strong>{q.options[q.correct]}</strong></Typography>
                )}
              </Box>
            ))}
          </Stack>

          {!submitted ? (
            <Box
              component="button"
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < QUESTIONS.length}
              sx={{
                ...cardSx('orange'),
                width: '100%', cursor: Object.keys(answers).length >= QUESTIONS.length ? 'pointer' : 'not-allowed',
                opacity: Object.keys(answers).length >= QUESTIONS.length ? 1 : 0.6,
                textAlign: 'center', fontWeight: 700, fontSize: '1.1rem',
                '&:hover': Object.keys(answers).length >= QUESTIONS.length ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {}
              }}
            >
              Submit Answers
            </Box>
          ) : (
            <Box sx={{ ...cardSx('green'), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.green.border, fontWeight: 700, mb: 2 }}>Score: {score}/{QUESTIONS.length}</Typography>
              <Box
                component="button"
                onClick={async () => navigate(await resolveSubphase2RemedialNextUrl(3, 'B1'))}
                sx={{ ...cardSx('blue'), cursor: 'pointer', fontWeight: 700, display: 'inline-block', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` } }}
              >
                Continue
              </Box>
            </Box>
          )}
        </motion.div>
      </Container>
    </Box>
  )
}
