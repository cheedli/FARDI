import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Container, Typography, Stack,
  Select, MenuItem, FormControl
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 4 - Level A2 - Task B
 * Fill Frenzy: Fill 6 gaps with report words from the word bank
 */

const LIGHT = {
  pageBg: '#FFFDE7',
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
}

const WORD_BANK = ['success', 'challenge', 'feedback', 'improve', 'recommend', 'summary']

const SENTENCES = [
  { before: 'Festival was', blank: 'success', after: '.' },
  { before: 'Lighting was', blank: 'challenge', after: '.' },
  { before: 'We need', blank: 'feedback', after: '.' },
  { before: 'We can', blank: 'improve', after: '.' },
  { before: 'I', blank: 'recommend', after: 'more help.' },
  { before: 'Write', blank: 'summary', after: '.' }
]

export default function Phase6SP1Step4RemedialA2TaskB() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 4, interaction: 2, context: 'remedial_a2' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    let correct = 0
    SENTENCES.forEach((s, i) => { if (answers[i] === s.blank) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step4_remedial_a2_taskb_score', correct.toString())
    try {
      await phase6API.logRemedialActivity(4, 'A2', 'B', correct, SENTENCES.length, 0, 1)
    } catch (e) {
      console.error('Failed to log task:', e)
    }
  }

  const allAnswered = SENTENCES.every((_, i) => answers[i])

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
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>
              Step 4: Remedial Practice - Level A2
            </Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Task B: Fill Frenzy</Typography>
            <Typography variant="body1" color="text.secondary">Fill 6 gaps with report words from the word bank</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Fill Frenzy! Choose the correct word from the word bank to complete each sentence about our festival report." />
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.green), mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: P.green.border }}>Word Bank:</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              {WORD_BANK.map(w => (
                <Box key={w} sx={{
                  px: 2, py: 0.5,
                  bgcolor: P.green.border,
                  borderRadius: '10px',
                }}>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: 'white' }}>{w}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </motion.div>

        <Stack spacing={2} sx={{ mb: 3 }}>
          {SENTENCES.map((s, idx) => {
            const isCorrect = submitted && answers[idx] === s.blank
            return (
              <motion.div key={idx} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + idx * 0.04 }}>
                <Box sx={{
                  ...cardSx(submitted ? (isCorrect ? P.green : { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' }) : P.teal),
                  display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap'
                }}>
                  <Typography variant="body1" fontWeight={500}>{idx + 1}. {s.before}</Typography>
                  <FormControl size="small" sx={{ minWidth: 130 }}>
                    <Select value={answers[idx] || ''} onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })} disabled={submitted} displayEmpty>
                      <MenuItem value=""><em>choose...</em></MenuItem>
                      {WORD_BANK.map(w => <MenuItem key={w} value={w}>{w}</MenuItem>)}
                    </Select>
                  </FormControl>
                  <Typography variant="body1" fontWeight={500}>{s.after}</Typography>
                  {submitted && !isCorrect && <Typography variant="body2" color="error" fontWeight="bold">✗ Correct: {s.blank}</Typography>}
                  {isCorrect && <Typography variant="body2" sx={{ color: P.green.border, fontWeight: 'bold' }}>✓</Typography>}
                </Box>
              </motion.div>
            )
          })}
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
            Check My Answers
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.green.border }} gutterBottom>
                Task B Complete! Score: {score}/{SENTENCES.length}
              </Typography>
              <Box
                component="button"
                onClick={() => navigate('/phase6/subphase/1/step/4/remedial/a2/task/c')}
                sx={{
                  px: 6, py: 1.5, mt: 2,
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
                Next: Task C →
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
