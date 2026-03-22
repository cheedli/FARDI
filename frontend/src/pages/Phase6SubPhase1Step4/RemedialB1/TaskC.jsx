import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack } from '@mui/material'
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
  red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

const QUESTIONS = [
  { question: 'Success means?', options: ['Good result', 'Bad event', 'Challenge'], correct: 0 },
  { question: 'Challenge means?', options: ['Problem', 'Achievement', 'Positive'], correct: 0 },
  { question: 'Feedback means?', options: ['What people say', 'Bad news', 'A failure'], correct: 0 },
  { question: 'Improve means?', options: ['Make worse', 'Make better', 'Stay same'], correct: 1 },
  { question: 'Recommend means?', options: ['Suggest', 'Ignore', 'Delete'], correct: 0 },
  { question: 'Summary means?', options: ['Long report', 'Short overview', 'Challenge'], correct: 1 }
]

export default function Phase6SP1Step4RemB1TaskC() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 4, interaction: 3, context: 'remedial_b1' })
  const [selected, setSelected] = useState(Array(QUESTIONS.length).fill(null))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSelect = (qIdx, optIdx) => {
    if (submitted) return
    const updated = [...selected]; updated[qIdx] = optIdx; setSelected(updated)
  }

  const handleSubmit = async () => {
    let correct = 0
    QUESTIONS.forEach((q, i) => { if (selected[i] === q.correct) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step4_remedial_b1_taskc_score', correct.toString())
    try { await phase6API.logRemedialActivity(4, 'B1', 'C', correct, QUESTIONS.length, 0, 1) } catch (e) { console.error(e) }
  }

  const allAnswered = selected.every(s => s !== null)

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
            <Typography variant="h6" sx={{ color: P.orange.border }}>Task C: Quiz Game</Typography>
            <Typography variant="body1" color="text.secondary">Choose the correct definition for each report term</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <Typography variant="body2">Select the best answer for each question about report vocabulary.</Typography>
          </Box>
        </motion.div>

        <Stack spacing={3} sx={{ mb: 3 }}>
          {QUESTIONS.map((q, qIdx) => (
            <motion.div key={qIdx} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + qIdx * 0.05 }}>
              <Box sx={{
                ...cardSx(submitted ? (selected[qIdx] === q.correct ? P.green : P.red) : P.purple),
              }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Question {qIdx + 1} of {QUESTIONS.length}
                </Typography>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: P.purple.border }}>
                  {q.question}
                </Typography>
                <Stack spacing={1.5}>
                  {q.options.map((opt, optIdx) => {
                    let borderColor = 'rgba(0,0,0,0.15)'
                    let bgcolor = P.pageBg

                    if (!submitted && selected[qIdx] === optIdx) {
                      borderColor = P.purple.border; bgcolor = P.purple.bg
                    }
                    if (submitted) {
                      if (optIdx === q.correct) { borderColor = P.green.border; bgcolor = P.green.bg }
                      else if (selected[qIdx] === optIdx && optIdx !== q.correct) { borderColor = P.red.border; bgcolor = P.red.bg }
                    }

                    return (
                      <Box
                        key={optIdx}
                        onClick={() => handleSelect(qIdx, optIdx)}
                        sx={{
                          p: 1.5, borderRadius: '12px',
                          border: `2px solid ${borderColor}`,
                          bgcolor,
                          cursor: submitted ? 'default' : 'pointer',
                          transition: 'all 0.15s ease',
                          '&:hover': submitted ? {} : { bgcolor: P.purple.bg, borderColor: P.purple.border },
                        }}
                      >
                        <Typography variant="body1" fontWeight={selected[qIdx] === optIdx || (submitted && optIdx === q.correct) ? 'bold' : 'normal'}>
                          {String.fromCharCode(65 + optIdx)}. {opt}
                        </Typography>
                      </Box>
                    )
                  })}
                </Stack>
                {submitted && selected[qIdx] !== q.correct && (
                  <Typography variant="body2" color="error" sx={{ mt: 1.5 }}>
                    Correct answer: <strong>{q.options[q.correct]}</strong>
                  </Typography>
                )}
              </Box>
            </motion.div>
          ))}
        </Stack>

        {!submitted ? (
          <Box
            component="button"
            onClick={handleSubmit}
            disabled={!allAnswered}
            sx={{
              width: '100%', py: 1.5,
              bgcolor: P.orange.bg,
              border: `2px solid ${P.orange.border}`,
              borderRadius: '16px',
              boxShadow: `4px 4px 0 ${P.orange.shadow}`,
              cursor: !allAnswered ? 'not-allowed' : 'pointer',
              opacity: !allAnswered ? 0.5 : 1,
              fontWeight: 'bold', fontSize: '1rem',
              color: P.orange.border,
              '&:hover': allAnswered ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {},
              transition: 'all 0.15s ease',
            }}
          >
            Submit Answers
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.purple), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 60, color: P.purple.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.purple.border }} gutterBottom>
                Task C Complete! Score: {score}/{QUESTIONS.length}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
                {score >= 5 ? 'Excellent! You know your report vocabulary.' : 'Good effort! Review the correct answers above.'}
              </Typography>
              <Box
                component="button"
                onClick={() => navigate('/phase6/subphase/1/step/4/remedial/b2/task/a')}
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
                Continue →
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
