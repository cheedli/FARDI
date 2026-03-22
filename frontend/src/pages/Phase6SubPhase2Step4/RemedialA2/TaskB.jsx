import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Select, MenuItem, FormControl, Stack, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

const WORD_BANK = ['feedback', 'positive', 'suggestion', 'strength', 'weakness', 'improve']

const GAPS = [
  { sentence: 'Give ___.', correct: 'feedback' },
  { sentence: 'Say ___ things.', correct: 'positive' },
  { sentence: 'My ___ is...', correct: 'suggestion' },
  { sentence: '___ is good.', correct: 'strength' },
  { sentence: '___ is bad.', correct: 'weakness' },
  { sentence: 'We can ___.', correct: 'improve' }
]

export default function Phase6SP2Step4RemA2TaskB() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 4, interaction: 2, context: 'remedial_a2' })
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
    sessionStorage.setItem('phase6_sp2_step4_remedial_a2_taskb_score', correct.toString())
    try { await phase6API.logRemedialActivity(4, 'A2', 'B', correct, GAPS.length, 0, 2) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Step 4: Remedial A2 - Task B</Typography>
            <Typography variant="body1" sx={{ color: P.orange.shadow }}>Fill Frenzy: Complete the Sentences</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.yellow), mb: 2 }}>
            <Typography variant="body2">Choose the correct feedback word to fill each blank.</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom fontWeight="bold">Word Bank:</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {WORD_BANK.map((w) => (
                <Box key={w} sx={{
                  bgcolor: P.blue.border, color: 'white', fontWeight: 'bold',
                  px: 2, py: 0.5, borderRadius: '10px', fontSize: '0.875rem',
                  border: `1px solid ${P.blue.shadow}`,
                }}>
                  {w}
                </Box>
              ))}
            </Stack>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          {GAPS.map((g, idx) => {
            const isCorrect = submitted && answers[idx] === g.correct
            const isWrong = submitted && answers[idx] !== g.correct
            return (
              <Box key={idx} sx={{
                ...cardSx(isCorrect ? P.green : isWrong ? P.red : P.blue),
                mb: 2,
                display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap',
              }}>
                <Typography variant="body1" fontWeight="bold">{idx + 1}.</Typography>
                <Typography variant="body1">{g.sentence}</Typography>
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <Select value={answers[idx] || ''} onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })} disabled={submitted} displayEmpty>
                    <MenuItem value="" disabled><em>Choose word</em></MenuItem>
                    {WORD_BANK.map((opt) => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                  </Select>
                </FormControl>
                {submitted && answers[idx] !== g.correct && (
                  <Typography variant="body2" sx={{ color: P.red.border }}>Correct: {g.correct}</Typography>
                )}
                {submitted && answers[idx] === g.correct && (
                  <Typography variant="body2" sx={{ color: P.green.border }}>Correct!</Typography>
                )}
              </Box>
            )
          })}
        </motion.div>

        {!submitted ? (
          <Box
            component="button"
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < GAPS.length}
            sx={{
              width: '100%', bgcolor: P.orange.border, color: 'white',
              border: `2px solid ${P.orange.shadow}`, borderRadius: '14px',
              boxShadow: `4px 4px 0 ${P.orange.shadow}`, py: 1.5,
              fontSize: '1rem', fontWeight: 'bold',
              cursor: Object.keys(answers).length < GAPS.length ? 'not-allowed' : 'pointer',
              opacity: Object.keys(answers).length < GAPS.length ? 0.6 : 1,
              '&:hover': Object.keys(answers).length >= GAPS.length ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {},
              transition: 'all 0.15s',
            }}
          >
            Submit Answers
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.green.shadow }}>Task B Complete! Score: {score}/{GAPS.length}</Typography>
              <Box
                component="button"
                onClick={() => navigate('/phase6/subphase/2/step/4/remedial/a2/task/c')}
                sx={{
                  mt: 2, bgcolor: P.green.border, color: 'white',
                  border: `2px solid ${P.green.shadow}`, borderRadius: '14px',
                  boxShadow: `4px 4px 0 ${P.green.shadow}`, py: 1.5, px: 4,
                  fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s',
                }}
              >
                Continue to Task C
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
