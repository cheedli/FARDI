import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Container, Typography, Stack,
  Select, MenuItem, FormControl
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

const PAIRS = [
  { error: '"The event was good and nice."', correct: '"The event was well-received and highly praised by participants."' },
  { error: '"Many people come to the event."', correct: '"A significant number of participants attended the event."' },
  { error: '"We had problem with time."', correct: '"Time management presented a notable challenge during the final session."' },
  { error: '"Speakers talk about many things."', correct: '"Speakers addressed a range of topics relevant to the event\'s theme."' },
  { error: '"The food was not good enough."', correct: '"The catering arrangements did not fully meet participants\' expectations."' },
  { error: '"Next time we will do better."', correct: '"It is recommended that future events incorporate more thorough planning."' },
]

const SHUFFLED_CORRECT = [
  '"The catering arrangements did not fully meet participants\' expectations."',
  '"A significant number of participants attended the event."',
  '"It is recommended that future events incorporate more thorough planning."',
  '"The event was well-received and highly praised by participants."',
  '"Speakers addressed a range of topics relevant to the event\'s theme."',
  '"Time management presented a notable challenge during the final session."',
]

export default function Phase6SP1Step4RemB2TaskC() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 4, interaction: 3, context: 'remedial_b2' })
  const [answers, setAnswers] = useState(Array(PAIRS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    const correct = PAIRS.filter((p, i) => answers[i] === p.correct).length
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step4_remedial_b2_taskc_score', correct.toString())
    try { await phase6API.logRemedialActivity(4, 'B2', 'C', correct, PAIRS.length, 0, 1) } catch (e) { console.error(e) }
  }

  const allFilled = answers.every(a => a !== '')

  const cardSx = (color) => ({
    bgcolor: color.bg,
    border: `2px solid ${color.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${color.shadow}`,
    p: 3,
  })

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>
              Phase 6: Reflection &amp; Evaluation
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 4: Remedial Practice — Level B2</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Task C: Error Matching Game</Typography>
            <Typography variant="body1" color="text.secondary">Match each informal/incorrect sentence to its formal correction</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <Typography variant="body2">
              For each informal or incorrect report sentence, select the matching formal correction from the dropdown.
            </Typography>
          </Box>
        </motion.div>

        <Stack spacing={2} sx={{ mb: 3 }}>
          {PAIRS.map((p, idx) => {
            const isCorrect = submitted && answers[idx] === p.correct
            const isWrong = submitted && answers[idx] !== p.correct
            return (
              <motion.div key={idx} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + idx * 0.04 }}>
                <Box sx={{
                  ...cardSx(submitted ? (isCorrect ? P.green : P.red) : P.orange),
                }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>Error {idx + 1}:</Typography>
                  <Typography variant="body1" fontWeight="bold" sx={{ mb: 1.5, color: P.red.border }}>
                    {p.error}
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={answers[idx]}
                      onChange={(e) => {
                        const updated = [...answers]
                        updated[idx] = e.target.value
                        setAnswers(updated)
                      }}
                      disabled={submitted}
                      displayEmpty
                    >
                      <MenuItem value=""><em>Select the correct formal version...</em></MenuItem>
                      {SHUFFLED_CORRECT.map((opt, oi) => (
                        <MenuItem key={oi} value={opt}>{opt}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {isWrong && (
                    <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                      Correct: <strong>{p.correct}</strong>
                    </Typography>
                  )}
                </Box>
              </motion.div>
            )
          })}
        </Stack>

        {!submitted ? (
          <Box
            component="button"
            onClick={handleSubmit}
            disabled={!allFilled}
            sx={{
              width: '100%', py: 1.5,
              bgcolor: P.orange.bg,
              border: `2px solid ${P.orange.border}`,
              borderRadius: '16px',
              boxShadow: `4px 4px 0 ${P.orange.shadow}`,
              cursor: !allFilled ? 'not-allowed' : 'pointer',
              opacity: !allFilled ? 0.5 : 1,
              fontWeight: 'bold', fontSize: '1rem',
              color: P.orange.border,
              '&:hover': allFilled ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {},
              transition: 'all 0.15s ease',
            }}
          >
            Submit Matches
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.green.border }} gutterBottom>
                Task C Complete! Score: {score}/{PAIRS.length}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {score >= 5 ? 'Excellent! You can identify and fix report errors at B2 level.' : 'Good effort! Review the correct matches above.'}
              </Typography>
              <Box
                component="button"
                onClick={() => navigate('/phase6/subphase/1/step/4/remedial/b2/task/d')}
                sx={{
                  px: 6, py: 1.5,
                  bgcolor: P.green.bg,
                  border: `2px solid ${P.green.border}`,
                  borderRadius: '16px',
                  boxShadow: `4px 4px 0 ${P.green.shadow}`,
                  cursor: 'pointer',
                  fontWeight: 'bold', fontSize: '1rem',
                  color: P.green.border,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s ease',
                }}
              >
                Continue to Task D →
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
