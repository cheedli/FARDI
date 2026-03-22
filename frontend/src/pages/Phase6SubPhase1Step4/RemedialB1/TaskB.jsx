import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
}

const QUESTIONS = [
  { prompt: 'Success?', example: 'Festival was success.', placeholder: 'Write about success...' },
  { prompt: 'People?', example: 'Many people came.', placeholder: 'Write about attendance...' },
  { prompt: 'Good part?', example: 'Dances were good.', placeholder: 'Write about the best part...' },
  { prompt: 'Challenge?', example: 'Lighting challenge.', placeholder: 'Write about a challenge...' },
  { prompt: 'Fix?', example: 'We fixed it.', placeholder: 'Write about the solution...' },
  { prompt: 'Recommend?', example: 'Recommend more backup.', placeholder: 'Write your recommendation...' }
]

export default function Phase6SP1Step4RemB1TaskB() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 4, interaction: 2, context: 'remedial_b1' })
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(''))
  const [showExamples, setShowExamples] = useState(Array(QUESTIONS.length).fill(false))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerChange = (idx, value) => {
    const updated = [...answers]; updated[idx] = value; setAnswers(updated)
  }

  const handleSubmit = async () => {
    const filled = answers.filter(a => a.trim().split(/\s+/).filter(w => w.length > 0).length >= 3).length
    setScore(filled)
    setSubmitted(true)
    setShowExamples(Array(QUESTIONS.length).fill(true))
    sessionStorage.setItem('phase6_sp1_step4_remedial_b1_taskb_score', filled.toString())
    try { await phase6API.logRemedialActivity(4, 'B1', 'B', filled, QUESTIONS.length, 0, 1) } catch (e) { console.error(e) }
  }

  const allFilled = answers.every(a => a.trim().length > 0)

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
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 4: Remedial Practice — Level B1</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Task B: Writing Proposals</Typography>
            <Typography variant="body1" color="text.secondary">Answer each guided question to build a report summary</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <Typography variant="body2">Answer each question with at least 3 words. Examples will be shown after you submit.</Typography>
          </Box>
        </motion.div>

        <Stack spacing={3} sx={{ mb: 3 }}>
          {QUESTIONS.map((q, idx) => {
            const wordCount = answers[idx].trim().split(/\s+/).filter(w => w.length > 0).length
            const isCorrect = submitted && wordCount >= 3

            return (
              <motion.div key={idx} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + idx * 0.05 }}>
                <Box sx={{
                  ...cardSx(submitted ? (isCorrect ? P.green : { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' }) : P.purple),
                }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Question {idx + 1} of {QUESTIONS.length}
                  </Typography>
                  <Box sx={{
                    px: 2, py: 0.5, mb: 1.5,
                    bgcolor: P.purple.border,
                    borderRadius: '12px',
                    display: 'inline-block',
                  }}>
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.95rem' }}>{q.prompt}</Typography>
                  </Box>
                  <TextField
                    fullWidth multiline rows={2}
                    value={answers[idx]}
                    onChange={(e) => handleAnswerChange(idx, e.target.value)}
                    disabled={submitted}
                    placeholder={q.placeholder}
                    sx={{ mb: 1.5 }}
                  />
                  {submitted && (
                    <Box sx={{
                      p: 1.5,
                      bgcolor: P.purple.bg,
                      borderRadius: '10px',
                      border: `1px solid ${P.purple.border}`
                    }}>
                      <Typography variant="body2" sx={{ color: P.purple.border, fontWeight: 'bold' }}>
                        Example: "{q.example}"
                      </Typography>
                      {!isCorrect && (
                        <Typography variant="body2" color="error" sx={{ mt: 0.5 }}>
                          Try to write at least 3 words.
                        </Typography>
                      )}
                    </Box>
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
            Submit Proposals
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.purple), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 60, color: P.purple.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.purple.border }} gutterBottom>
                Task B Complete! Score: {score}/{QUESTIONS.length}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
                {score >= 5 ? 'Excellent! Your report proposals look great.' : 'Good effort! Compare your answers with the examples above.'}
              </Typography>
              <Box
                component="button"
                onClick={() => navigate('/phase6/subphase/1/step/4/remedial/b1/task/c')}
                sx={{
                  px: 6, py: 1.5,
                  bgcolor: P.purple.bg,
                  border: `2px solid ${P.purple.border}`,
                  borderRadius: '16px',
                  boxShadow: `4px 4px 0 ${P.purple.shadow}`,
                  cursor: 'pointer',
                  fontWeight: 'bold', fontSize: '1rem',
                  color: P.purple.border,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.purple.shadow}` },
                  transition: 'all 0.15s ease',
                }}
              >
                Continue to Task C →
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
