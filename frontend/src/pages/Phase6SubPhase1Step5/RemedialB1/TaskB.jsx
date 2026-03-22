import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, TextField } from '@mui/material'
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

const SENTENCES = [
  { id: 0, faulty: 'Festival good.', correct: 'The festival was successful.', hint: 'Use "successful" (formal) + past tense "was"' },
  { id: 1, faulty: 'Many people come.', correct: 'Over 200 people came.', hint: 'Use past tense "came" and add specific number' },
  { id: 2, faulty: 'Dances nice.', correct: 'Dances were very good.', hint: 'Add "were" (past tense) and "very good"' },
  { id: 3, faulty: 'Lights problem bad.', correct: 'There was a lighting challenge.', hint: 'Use formal "challenge" instead of "problem bad"' },
  { id: 4, faulty: 'We fix fast.', correct: 'We fixed it quickly.', hint: 'Use past tense "fixed" and adverb "quickly"' },
  { id: 5, faulty: 'People happy.', correct: 'Guests gave positive feedback.', hint: 'Use formal "guests" and "positive feedback"' },
  { id: 6, faulty: 'Improve time.', correct: 'We need to improve time management.', hint: 'Write a complete sentence with "management"' },
  { id: 7, faulty: 'More backup.', correct: 'I recommend more backup lights.', hint: 'Use "recommend" + complete phrase' }
]

export default function Phase6SP1Step5RemB1TaskB() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 5, interaction: 2, context: 'remedial_b1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const allAnswered = SENTENCES.every(s => (answers[s.id] || '').trim().length > 0)

  const handleSubmit = async () => {
    let correct = 0
    SENTENCES.forEach(s => {
      const words = (answers[s.id] || '').trim().split(/\s+/).filter(w => w.length > 0).length
      if (words >= 3) correct++
    })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step5_remedial_b1_taskb_score', correct.toString())
    try { await phase6API.logRemedialActivity(5, 'B1', 'B', correct, SENTENCES.length, 0, 1) } catch (e) { console.error(e) }
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
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 5: Remedial Practice — Level B1</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Task B: Definition Duel</Typography>
            <Typography variant="body1" color="text.secondary">Correct 8 faulty report sentences for coherence, vocabulary, and tone</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx('teal'), mb: 3 }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Definition Duel! Each sentence below has a formality, vocabulary, or coherence problem. Rewrite it correctly. Use past tense, formal vocabulary, and complete sentences!"
            />
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx('teal'), mb: 3 }}>
            <Typography variant="body2"><strong>Instructions:</strong> Rewrite each faulty sentence correctly. Use past tense, formal vocabulary (successful/challenge/feedback/recommend), and add specific details where possible.</Typography>
          </Box>
        </motion.div>

        <Stack spacing={2} sx={{ mb: 3 }}>
          {SENTENCES.map((s, idx) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + idx * 0.04 }}>
              <Box sx={{ ...cardSx('orange') }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap', mb: 1 }}>
                  <Box sx={{ flex: 1, minWidth: 200 }}>
                    <Typography variant="caption" sx={{ color: P.red.border, fontWeight: 'bold' }}>Faulty:</Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace', color: P.red.border, mb: 1 }}>{s.faulty}</Typography>
                    <Typography variant="caption" sx={{ color: P.teal.border, fontStyle: 'italic' }}>Hint: {s.hint}</Typography>
                  </Box>
                  <Box sx={{ flex: 2, minWidth: 250 }}>
                    <Typography variant="caption" sx={{ color: P.green.border, fontWeight: 'bold' }}>Your correction:</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={answers[s.id] || ''}
                      onChange={(e) => setAnswers({ ...answers, [s.id]: e.target.value })}
                      disabled={submitted}
                      placeholder="Write the correct sentence..."
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                </Box>
                {submitted && (
                  <Box sx={{ mt: 1, p: 1.5, bgcolor: P.green.bg, border: `1px solid ${P.green.border}`, borderRadius: '12px' }}>
                    <Typography variant="body2"><strong>Model answer:</strong> {s.correct}</Typography>
                  </Box>
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
            Submit Corrections
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx('green'), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.green.border }} gutterBottom>Task B Complete!</Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>Score: {score}/{SENTENCES.length} sentences corrected</Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {score >= 7 ? 'Excellent! You can improve report formality and vocabulary.' : score >= 5 ? 'Good work! Check the model answers above.' : 'Keep practicing — focus on past tense and formal vocabulary.'}
              </Typography>
              <Box
                component="button"
                onClick={() => navigate('/phase6/subphase/1/step/5/remedial/b1/task/c')}
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
