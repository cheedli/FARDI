import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, RadioGroup, FormControlLabel, Radio, Alert } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { resolveSubphase2RemedialNextUrl } from '../../Phase6SubPhase2/shared/routing.js'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  green: { bg: '#052E16', border: '#4ADE80', shadow: '#166534' },
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
}

const QUESTIONS = [
  { question: 'Which is a good simple feedback sentence?', options: ['Good work.', 'Bad report.', 'No feedback.'], correct: 0 },
  { question: 'Which sentence uses "positive" correctly?', options: ['Positive bad.', 'Positive nice.', 'No positive.'], correct: 1 },
  { question: 'Which sentence uses "suggestion" correctly?', options: ['Suggestion add.', 'Suggestion bad.', 'No suggestion.'], correct: 0 },
  { question: 'Which is a correct simple feedback sentence?', options: ['Strength not good.', 'Strength good.', 'No strength.'], correct: 1 },
  { question: 'Which is a correct sentence about weakness?', options: ['Weakness small.', 'Weakness great!', 'Weakness fun.'], correct: 0 },
  { question: 'Which sentence about improving is correct?', options: ['Improve never.', 'Improve worse.', 'Improve better.'], correct: 2 },
]

export default function Phase6SP2Step2RemA2TaskC() {
  const navigate = useNavigate()
  React.useEffect(() => { resolveSubphase2RemedialNextUrl(2, 'A2').then(url => { window.__remedialSkip = () => navigate(url) }) }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 2, interaction: 3, context: 'remedial_a2' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })

  const handleSubmit = async () => {
    let correct = 0
    QUESTIONS.forEach((q, i) => { if (parseInt(answers[i]) === q.correct) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step2_remedial_a2_taskc_score', correct.toString())
    try { await phase6API.logRemedialActivity(2, 'A2', 'C', correct, QUESTIONS.length, 0, 2) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: P.orange.border }}>Step 2: Remedial A2 — Task C</Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>Sentence Builder: Choose the Best Simple Feedback Sentence</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
          <Alert severity="info" sx={{ mb: 3, borderRadius: '12px' }}>Choose the correct simple feedback sentence for each question.</Alert>
          {QUESTIONS.map((q, idx) => (
            <Box key={idx} sx={{ ...cardSx(submitted ? (parseInt(answers[idx]) === q.correct ? P.green : { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' }) : P.blue), mb: 2 }}>
              <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>{idx + 1}. {q.question}</Typography>
              <RadioGroup value={answers[idx] ?? ''} onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })}>
                {q.options.map((opt, oi) => <FormControlLabel key={oi} value={oi.toString()} control={<Radio disabled={submitted} />} label={opt} />)}
              </RadioGroup>
              {submitted && parseInt(answers[idx]) !== q.correct && <Typography variant="body2" color="error" sx={{ mt: 1 }}>Correct: <strong>{q.options[q.correct]}</strong></Typography>}
            </Box>
          ))}
          {!submitted ? (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Box component="button" onClick={handleSubmit} disabled={Object.keys(answers).length < QUESTIONS.length}
                sx={{ px: 5, py: 1.5, borderRadius: '16px', border: `2px solid ${P.orange.border}`, bgcolor: P.orange.bg, boxShadow: `4px 4px 0 ${P.orange.shadow}`, fontWeight: 'bold', fontSize: '1rem', fontFamily: 'inherit', width: '100%', cursor: Object.keys(answers).length < QUESTIONS.length ? 'not-allowed' : 'pointer', opacity: Object.keys(answers).length < QUESTIONS.length ? 0.5 : 1, '&:hover:not(:disabled)': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }, transition: 'all 0.15s' }}>
                Submit Answers
              </Box>
            </Box>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Box sx={{ ...cardSx(P.green), textAlign: 'center', mt: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
                <Typography variant="h5" fontWeight="bold" sx={{ color: P.green.shadow }}>Score: {score}/{QUESTIONS.length}</Typography>
                <Box component="button" onClick={async () => navigate(await resolveSubphase2RemedialNextUrl(2, 'A2'))}
                  sx={{ mt: 2, px: 5, py: 1.5, borderRadius: '16px', border: `2px solid ${P.green.border}`, bgcolor: P.green.bg, boxShadow: `4px 4px 0 ${P.green.shadow}`, fontWeight: 'bold', fontSize: '1rem', fontFamily: 'inherit', cursor: 'pointer', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s' }}>
                  Continue
                </Box>
              </Box>
            </motion.div>
          )}
        </motion.div>
      </Container>
    </Box>
  )
}
