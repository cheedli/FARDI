import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, RadioGroup, FormControlLabel, Radio } from '@mui/material'
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
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
  purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
}

const QUESTIONS = [
  { question: 'Which is the correct version of "Festival good."?', options: ['Festival good.', 'The festival was good.', 'Festival was good.', 'The festival good.'], correct: 1, explanation: 'Add "The" (article) and "was" (past tense verb) → "The festival was good."' },
  { question: 'Which is the correct version of "Many people come."?', options: ['Many people come.', 'Many people comed.', 'Many people came.', 'Many peoples came.'], correct: 2, explanation: 'Use past tense: "come" → "came" → "Many people came."' },
  { question: 'Which is the correct version of "Dances nice."?', options: ['Dances nice.', 'The dances were nice.', 'Dance was nice.', 'Dances was nice.'], correct: 1, explanation: 'Add "The" and past tense "were" → "The dances were nice."' },
  { question: 'Which is the correct version of "Lights problem."?', options: ['Lights problem.', 'There was a lights problem.', 'Lights was a problem.', 'There were lights problem.'], correct: 1, explanation: '"There was a lights problem." — uses correct structure with "there was".' },
  { question: 'Which is the correct version of "We fix it."?', options: ['We fix it.', 'We fixing it.', 'We fixed it.', 'We fixes it.'], correct: 2, explanation: 'Use past tense: "fix" → "fixed" → "We fixed it."' },
  { question: 'Which is the correct version of "Next time good."?', options: ['Next time good.', 'Next time will be better.', 'Next time is better.', 'Next time were better.'], correct: 1, explanation: '"Next time will be better." — uses future tense correctly with complete sentence structure.' }
]

export default function Phase6SP1Step5RemA2TaskC() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 5, interaction: 3, context: 'remedial_a2' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    let correct = 0
    QUESTIONS.forEach((q, i) => { if (parseInt(answers[i]) === q.correct) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step5_remedial_a2_taskc_score', correct.toString())
    try { await phase6API.logRemedialActivity(5, 'A2', 'C', correct, QUESTIONS.length, 0, 1) } catch (e) { console.error(e) }
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
            <Typography variant="h6" sx={{ color: P.orange.border }}>Task C: Sentence Builder</Typography>
            <Typography variant="body1" color="text.secondary">Choose the grammatically correct version of each sentence</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx('teal'), mb: 3 }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Sentence Builder! Each question shows a faulty sentence. Choose the correct version. Focus on: articles (the/a), past tense verbs (was/were/came/fixed), and complete sentence structure!"
            />
          </Box>
        </motion.div>

        <Stack spacing={3} sx={{ mb: 3 }}>
          {QUESTIONS.map((q, idx) => {
            const isCorrect = submitted && parseInt(answers[idx]) === q.correct
            const isWrong = submitted && parseInt(answers[idx]) !== q.correct
            return (
              <motion.div key={idx} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + idx * 0.05 }}>
                <Box sx={{ ...cardSx(submitted ? (isCorrect ? 'green' : 'red') : 'purple') }}>
                  <Typography variant="body1" fontWeight="bold" sx={{ mb: 2, color: P.purple.border }}>{idx + 1}. {q.question}</Typography>
                  <RadioGroup value={answers[idx] ?? ''} onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })}>
                    {q.options.map((opt, oi) => (
                      <FormControlLabel
                        key={oi}
                        value={oi.toString()}
                        control={<Radio disabled={submitted} />}
                        label={
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', color: submitted ? (oi === q.correct ? P.green.border : parseInt(answers[idx]) === oi ? P.red.border : 'text.secondary') : 'text.primary' }}>
                            {opt}{submitted && oi === q.correct ? ' ✓' : ''}
                          </Typography>
                        }
                      />
                    ))}
                  </RadioGroup>
                  {submitted && (
                    <Box sx={{ mt: 1, p: 1.5, bgcolor: isCorrect ? P.green.bg : P.red.bg, border: `1px solid ${isCorrect ? P.green.border : P.red.border}`, borderRadius: '12px' }}>
                      <Typography variant="body2">{q.explanation}</Typography>
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
            disabled={Object.keys(answers).length < QUESTIONS.length}
            sx={{
              width: '100%', py: 1.5,
              bgcolor: P.orange.bg,
              border: `2px solid ${P.orange.border}`,
              borderRadius: '16px',
              boxShadow: `4px 4px 0 ${P.orange.shadow}`,
              cursor: Object.keys(answers).length < QUESTIONS.length ? 'not-allowed' : 'pointer',
              opacity: Object.keys(answers).length < QUESTIONS.length ? 0.5 : 1,
              fontWeight: 'bold', fontSize: '1rem',
              color: P.orange.border,
              '&:hover': Object.keys(answers).length >= QUESTIONS.length ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {},
              transition: 'all 0.15s ease',
            }}
          >
            Submit Answers
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx('green'), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.green.border }} gutterBottom>Task C Complete!</Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>Score: {score}/{QUESTIONS.length}</Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {score >= 5 ? 'Excellent! You can identify correct grammar in report sentences.' : score >= 4 ? 'Good work! Review the explanations above.' : 'Good effort! Remember: use past tense and articles in formal sentences.'}
              </Typography>
              <Box
                component="button"
                onClick={() => navigate('/phase6/subphase/2/step/1')}
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
                Continue to Sub-Phase 2 →
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
