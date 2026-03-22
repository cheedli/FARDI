import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Select, MenuItem, FormControl, Alert, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  green: { bg: '#052E16', border: '#4ADE80', shadow: '#166534' },
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  purple: { bg: '#3B0764', border: '#C084FC', shadow: '#6B21A8' },
  yellow: { bg: '#422006', border: '#FACC15', shadow: '#A16207' },
}

const GAPS = [
  { before: 'Give me', after: '.', correct: 'feedback', hint: 'What people say about your work' },
  { before: 'You did', after: 'work.', correct: 'positive', hint: 'Good' },
  { before: 'My', after: 'is add more details.', correct: 'suggestion', hint: 'Idea to make better' },
  { before: '', after: 'is good teamwork.', correct: 'strength', hint: 'Good part' },
  { before: '', after: 'is time management.', correct: 'weakness', hint: 'Bad part' },
  { before: 'We can', after: 'our report.', correct: 'improve', hint: 'Make better' },
]

const WORD_BANK = ['feedback', 'positive', 'suggestion', 'strength', 'weakness', 'improve']

export default function Phase6SP2Step1RemA2TaskB() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 1, interaction: 2, context: 'remedial_a2' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const cardSx = (color) => ({
    bgcolor: color.bg,
    border: `2px solid ${color.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${color.shadow}`,
    p: 3,
  })

  const handleSubmit = async () => {
    let correct = 0
    GAPS.forEach((g, i) => { if (answers[i] === g.correct) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step1_remedial_a2_taskb_score', correct.toString())
    try { await phase6API.logRemedialActivity(1, 'A2', 'B', correct, GAPS.length, 0, 2) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: P.orange.border }}>
              Step 1: Remedial A2 — Task B
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Fill Frenzy: Complete Feedback Sentences
            </Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
          <Box sx={{ ...cardSx(P.purple), mb: 3 }}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, color: P.purple.border }}>Word Bank:</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {WORD_BANK.map(w => (
                <Box key={w} sx={{ px: 2, py: 0.5, bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '10px', mb: 1 }}>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: P.purple.border }}>{w}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }}>
          <Alert severity="info" sx={{ mb: 3, borderRadius: '12px' }}>
            Choose the correct feedback word for each blank.
          </Alert>

          {GAPS.map((g, idx) => (
            <Box
              key={idx}
              sx={{
                ...cardSx(submitted ? (answers[idx] === g.correct ? P.green : { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' }) : P.blue),
                mb: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="body1" fontWeight="bold">{idx + 1}.</Typography>
                {g.before && <Typography variant="body1">{g.before}</Typography>}
                <FormControl size="small" sx={{ minWidth: 130 }}>
                  <Select value={answers[idx] || ''} onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })} disabled={submitted} displayEmpty>
                    <MenuItem value=""><em>choose...</em></MenuItem>
                    {WORD_BANK.map((opt) => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                  </Select>
                </FormControl>
                {g.after && <Typography variant="body1">{g.after}</Typography>}
              </Box>
              {submitted && answers[idx] !== g.correct && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>Correct answer: <strong>{g.correct}</strong></Typography>
              )}
            </Box>
          ))}

          {!submitted ? (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Box
                component="button"
                onClick={handleSubmit}
                disabled={Object.keys(answers).length < GAPS.length}
                sx={{
                  px: 5, py: 1.5,
                  borderRadius: '16px',
                  border: `2px solid ${P.orange.border}`,
                  bgcolor: P.orange.bg,
                  boxShadow: `4px 4px 0 ${P.orange.shadow}`,
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  width: '100%',
                  cursor: Object.keys(answers).length < GAPS.length ? 'not-allowed' : 'pointer',
                  opacity: Object.keys(answers).length < GAPS.length ? 0.5 : 1,
                  '&:hover:not(:disabled)': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` },
                  transition: 'all 0.15s',
                }}
              >
                Submit Answers
              </Box>
            </Box>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Box sx={{ ...cardSx(P.green), textAlign: 'center', mt: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
                <Typography variant="h5" fontWeight="bold" sx={{ color: P.green.shadow }}>Score: {score}/{GAPS.length}</Typography>
                <Box
                  component="button"
                  onClick={() => navigate('/phase6/subphase/2/step/1/remedial/a2/task/c')}
                  sx={{
                    mt: 2, px: 5, py: 1.5,
                    borderRadius: '16px',
                    border: `2px solid ${P.green.border}`,
                    bgcolor: P.green.bg,
                    boxShadow: `4px 4px 0 ${P.green.shadow}`,
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                    '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                    transition: 'all 0.15s',
                  }}
                >
                  Continue to Task C
                </Box>
              </Box>
            </motion.div>
          )}
        </motion.div>
      </Container>
    </Box>
  )
}
