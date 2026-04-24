import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, Select, MenuItem, FormControl } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { CharacterMessage } from '../../../components/Avatar.jsx'
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

const GAPS = [
  { id: 0, sentence: 'Festival was ___', options: ['success', 'succes', 'sucess'], correct: 'success', explanation: '"Success" — one c, two s.' },
  { id: 1, sentence: 'Lighting was ___', options: ['challange', 'challenge', 'chalenge'], correct: 'challenge', explanation: '"Challenge" — ch-a-l-l-e-n-g-e.' },
  { id: 2, sentence: 'We need ___', options: ['feedbak', 'feeback', 'feedback'], correct: 'feedback', explanation: '"Feedback" — feed + back.' },
  { id: 3, sentence: 'We can ___', options: ['improv', 'improve', 'inprove'], correct: 'improve', explanation: '"Improve" — i-m-p-r-o-v-e.' },
  { id: 4, sentence: 'I ___ more help', options: ['recomend', 'reccomend', 'recommend'], correct: 'recommend', explanation: '"Recommend" — re-c-o-m-m-e-n-d.' },
  { id: 5, sentence: 'Write ___', options: ['sumary', 'summary', 'summery'], correct: 'summary', explanation: '"Summary" — s-u-m-m-a-r-y.' },
  { id: 6, sentence: 'Big ___', options: ['achievment', 'achievement', 'achevement'], correct: 'achievement', explanation: '"Achievement" — achieve + ment.' },
  { id: 7, sentence: 'Use ___', options: ['evidance', 'evidence', 'evidense'], correct: 'evidence', explanation: '"Evidence" — e-v-i-d-e-n-c-e.' }
]

export default function Phase6SP1Step5RemA2TaskB() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase6/subphase/1/step/5/remedial/a2/task/c') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 5, interaction: 2, context: 'remedial_a2' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    let correct = 0
    GAPS.forEach(g => { if (answers[g.id] === g.correct) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step5_remedial_a2_taskb_score', correct.toString())
    try { await phase6API.logRemedialActivity(5, 'A2', 'B', correct, GAPS.length, 0, 1) } catch (e) { console.error(e) }
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
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>
              Phase 6: Reflection &amp; Evaluation
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 5: Remedial Practice — Level A2</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Task B: Fill Quest</Typography>
            <Typography variant="body1" color="text.secondary">Choose the correctly spelled word for each gap</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx('teal'), mb: 3 }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Fill Quest! Choose the correctly spelled word for each blank. Only one option in each question has the correct spelling!"
            />
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx('teal'), mb: 3 }}>
            <Typography variant="body2"><strong>Instructions:</strong> Select the correctly spelled word for each sentence. Watch out — each question has two common spelling mistakes!</Typography>
          </Box>
        </motion.div>

        <Stack spacing={2} sx={{ mb: 3 }}>
          {GAPS.map((g, idx) => {
            const isCorrect = submitted && answers[g.id] === g.correct
            const isWrong = submitted && answers[g.id] !== g.correct
            return (
              <motion.div key={g.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + idx * 0.04 }}>
                <Box sx={{ ...cardSx(submitted ? (isCorrect ? 'green' : 'red') : 'orange') }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 1 }}>
                    <Typography variant="body1" fontWeight="bold">{g.id + 1}. {g.sentence}</Typography>
                    <FormControl size="small" sx={{ minWidth: 160 }}>
                      <Select
                        value={answers[g.id] || ''}
                        onChange={(e) => setAnswers({ ...answers, [g.id]: e.target.value })}
                        disabled={submitted}
                        displayEmpty
                      >
                        <MenuItem value="" disabled><em>Choose...</em></MenuItem>
                        {g.options.map((opt, oi) => <MenuItem key={oi} value={opt}>{opt}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Box>
                  {submitted && (
                    <Typography variant="body2" sx={{ color: isCorrect ? P.green.border : P.red.border }}>
                      {isCorrect ? '✓ Correct! ' : `✗ Correct answer: "${g.correct}". `}
                      {g.explanation}
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
            disabled={Object.keys(answers).length < GAPS.length}
            sx={{
              width: '100%', py: 1.5,
              bgcolor: P.orange.bg,
              border: `2px solid ${P.orange.border}`,
              borderRadius: '16px',
              boxShadow: `4px 4px 0 ${P.orange.shadow}`,
              cursor: Object.keys(answers).length < GAPS.length ? 'not-allowed' : 'pointer',
              opacity: Object.keys(answers).length < GAPS.length ? 0.5 : 1,
              fontWeight: 'bold', fontSize: '1rem',
              color: P.orange.border,
              '&:hover': Object.keys(answers).length >= GAPS.length ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {},
              transition: 'all 0.15s ease',
            }}
          >
            Submit Answers
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx('green'), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.green.border }} gutterBottom>Task B Complete!</Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>Score: {score}/{GAPS.length}</Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {score >= 7 ? 'Excellent! You know how to spell these report words!' : score >= 5 ? 'Good work! Review the explanations above.' : 'Keep practicing — correct spelling is important for professional reports.'}
              </Typography>
              <Box
                component="button"
                onClick={() => navigate('/phase6/subphase/1/step/5/remedial/a2/task/c')}
                sx={{
                  mt: 2, px: 6, py: 1.5,
                  bgcolor: P.green.bg,
                  border: `2px solid ${P.green.border}`,
                  borderRadius: '16px',
                  boxShadow: `4px 4px 0 ${P.green.shadow}`,
                  cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', color: P.green.border,
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
