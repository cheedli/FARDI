import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, Select, MenuItem, FormControl } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
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

const GAPS = [
  { before: 'Give', blank: '', after: '.', correct: 'feedback', options: ['feedback', 'cake', 'songs'] },
  { before: 'Say', blank: '', after: 'things.', correct: 'positive', options: ['positive', 'negative', 'quiet'] },
  { before: 'My', blank: '', after: 'is...', correct: 'suggestion', options: ['suggestion', 'complaint', 'joke'] },
  { before: '', blank: '', after: 'is good.', correct: 'strength', options: ['strength', 'weakness', 'problem'] },
  { before: '', blank: '', after: 'is bad.', correct: 'weakness', options: ['weakness', 'positive', 'strength'] },
  { before: 'We can', blank: '', after: '.', correct: 'improve', options: ['improve', 'stop', 'hide'] },
  { before: 'Be', blank: '', after: '.', correct: 'polite', options: ['polite', 'mean', 'lazy'] },
  { before: 'Feedback is', blank: '', after: '.', correct: 'helpful', options: ['helpful', 'boring', 'bad'] }
]

const WORD_BANK = ['feedback', 'positive', 'suggestion', 'strength', 'weakness', 'improve', 'polite', 'helpful']

export default function Phase6SP2Step3RemA2TaskB() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 3, interaction: 2, context: 'remedial_a2' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    let correct = 0
    GAPS.forEach((g, i) => { if (answers[i] === g.correct) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step3_remedial_a2_taskb_score', correct.toString())
    try { await phase6API.logRemedialActivity(3, 'A2', 'B', correct, GAPS.length, 0, 2) } catch (e) { console.error(e) }
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
            <Typography variant="h5" sx={{ fontWeight: 800, color: P.orange.border, mb: 0.5 }}>Step 3: Remedial A2 - Task B</Typography>
            <Typography>Fill Quest: Complete Feedback Sentences</Typography>
          </Box>

          <Box sx={{ ...cardSx('purple'), mb: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Word Bank:</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {WORD_BANK.map(w => (
                <Box key={w} sx={{ px: 2, py: 0.5, bgcolor: P.purple.bg, border: `1px solid ${P.purple.border}`, borderRadius: '8px', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{w}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          <Box sx={{ ...cardSx('blue'), mb: 3 }}>
            <Typography variant="body2">Choose the correct feedback word for each gap.</Typography>
          </Box>

          <Stack spacing={2} sx={{ mb: 3 }}>
            {GAPS.map((g, idx) => (
              <Box key={idx} sx={{
                ...cardSx('teal'),
                border: submitted ? `2px solid ${answers[idx] === g.correct ? P.green.border : P.red.border}` : `2px solid ${P.teal.border}`,
                bgcolor: submitted ? (answers[idx] === g.correct ? P.green.bg : P.red.bg) : P.teal.bg,
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>{idx + 1}.</Typography>
                  {g.before && <Typography variant="body1">{g.before}</Typography>}
                  <FormControl size="small" sx={{ minWidth: 130 }}>
                    <Select value={answers[idx] || ''} onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })} disabled={submitted} displayEmpty>
                      <MenuItem value=""><em>choose...</em></MenuItem>
                      {g.options.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                    </Select>
                  </FormControl>
                  {g.after && <Typography variant="body1">{g.after}</Typography>}
                </Box>
                {submitted && answers[idx] !== g.correct && (
                  <Typography variant="body2" sx={{ color: P.red.border, mt: 1 }}>Correct: <strong>{g.correct}</strong></Typography>
                )}
              </Box>
            ))}
          </Stack>

          {!submitted ? (
            <Box
              component="button"
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < GAPS.length}
              sx={{
                ...cardSx('orange'),
                width: '100%', cursor: Object.keys(answers).length >= GAPS.length ? 'pointer' : 'not-allowed',
                opacity: Object.keys(answers).length >= GAPS.length ? 1 : 0.6,
                textAlign: 'center', fontWeight: 700, fontSize: '1.1rem',
                '&:hover': Object.keys(answers).length >= GAPS.length ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {}
              }}
            >
              Submit Answers
            </Box>
          ) : (
            <Box sx={{ ...cardSx('green'), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.green.border, fontWeight: 700, mb: 2 }}>Score: {score}/{GAPS.length}</Typography>
              <Box
                component="button"
                onClick={() => navigate('/phase6/subphase/2/step/3/remedial/a2/task/c')}
                sx={{ ...cardSx('blue'), cursor: 'pointer', fontWeight: 700, display: 'inline-block', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` } }}
              >
                Continue to Task C
              </Box>
            </Box>
          )}
        </motion.div>
      </Container>
    </Box>
  )
}
