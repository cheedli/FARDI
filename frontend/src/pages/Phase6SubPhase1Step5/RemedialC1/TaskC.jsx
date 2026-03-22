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
  {
    question: '"Festival good" — what is the precise error and its C1-level correction?',
    options: [
      'Formality → The festival was successful',
      'Spelling → The festival was successfull',
      'Tense → The festival is successful',
      'Grammar → Festival was good'
    ],
    correct: 0,
    explanation: 'Formality error: "good" is too informal for a formal report. "Successful" is the appropriate register. Full correction: "The festival was successful."'
  },
  {
    question: '"Many people come" — what is the precise error and its C1-level correction?',
    options: [
      'Spelling error',
      'Tense → Many people came',
      'Vocabulary → Many people arrived',
      'Structure → Many came people'
    ],
    correct: 1,
    explanation: 'Tense error: "come" is present tense; the report describes a past event. Correction: "Many people came." Even better: "Over 200 participants attended."'
  },
  {
    question: '"Lighting failure but resolved" — what is missing at C1 level?',
    options: [
      'Nothing — this is correct',
      'Past tense verb',
      'Balance: how it was resolved + impact mitigation',
      'An article before "lighting"'
    ],
    correct: 2,
    explanation: 'At C1, a good correction explains how the challenge was resolved and what the impact was. E.g., "While a lighting failure occurred, rapid contingency deployment ensured minimal disruption."'
  },
  {
    question: '"People liked the event" — what C1-level improvement is needed?',
    options: [
      'Change to past tense',
      'Add more specificity and formal vocabulary: participant satisfaction data/feedback evidence',
      'Nothing — this is a complete sentence',
      'Add "very much" after "liked"'
    ],
    correct: 1,
    explanation: 'At C1, vague statements must be supported with evidence. Better: "Participant satisfaction surveys indicated high approval ratings, with 87% describing the event as well-organized."'
  },
  {
    question: '"I recommend more backup" — what needs improving for C1 recommendations?',
    options: [
      'Change "I" to "We"',
      'Make it actionable and strategic: specify what backup, when, and why',
      'Use past tense: "I recommended"',
      'Nothing — recommendations are personal'
    ],
    correct: 1,
    explanation: 'C1 recommendations must be specific and actionable. Better: "It is strongly recommended that future events establish a dedicated technical contingency team with pre-tested backup systems at least 48 hours before each event."'
  },
  {
    question: '"The festival had some good things and some bad things" — what C1-level rewrite is best?',
    options: [
      '"The festival was balanced."',
      '"The festival had positives and negatives."',
      '"The festival demonstrated notable strengths in cross-cultural engagement while revealing critical areas requiring strategic improvement."',
      '"The festival was good and bad."'
    ],
    correct: 2,
    explanation: 'The C1 version uses sophisticated vocabulary (demonstrated, notable, cross-cultural engagement, strategic improvement), balanced structure, and formal register appropriate for a professional report.'
  }
]

export default function Phase6SP1Step5RemC1TaskC() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 5, interaction: 3, context: 'remedial_c1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    let correct = 0
    QUESTIONS.forEach((q, i) => { if (parseInt(answers[i]) === q.correct) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step5_remedial_c1_taskc_score', correct.toString())
    try { await phase6API.logRemedialActivity(5, 'C1', 'C', correct, QUESTIONS.length, 0, 1) } catch (e) { console.error(e) }
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
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 5: Remedial Practice — Level C1</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Task C: Quizlet Live</Typography>
            <Typography variant="body1" color="text.secondary">Identify and fix advanced errors in 6 complex report sentences</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx('teal'), mb: 3 }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Quizlet Live! These questions test C1-level understanding of report writing. They require you to identify not just WHAT is wrong, but WHY — and what the sophisticated correction should be. Think analytically!"
            />
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx('teal'), mb: 3 }}>
            <Typography variant="body2"><strong>Instructions:</strong> For each question, select the most accurate identification of the error and its best C1-level correction. Some questions test understanding of WHY certain choices are better.</Typography>
          </Box>
        </motion.div>

        <Stack spacing={3} sx={{ mb: 3 }}>
          {QUESTIONS.map((q, idx) => {
            const isCorrect = submitted && parseInt(answers[idx]) === q.correct
            const isWrong = submitted && parseInt(answers[idx]) !== q.correct
            return (
              <motion.div key={idx} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + idx * 0.05 }}>
                <Box sx={{ ...cardSx(submitted ? (isCorrect ? 'green' : 'red') : 'purple') }}>
                  <Typography variant="body1" fontWeight="bold" sx={{ mb: 2, color: P.purple.border }}>{idx + 1}. {q.question}</Typography>
                  <RadioGroup value={answers[idx] ?? ''} onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })}>
                    {q.options.map((opt, oi) => (
                      <FormControlLabel
                        key={oi}
                        value={oi.toString()}
                        control={<Radio disabled={submitted} />}
                        label={
                          <Typography variant="body2" sx={{ color: submitted ? (oi === q.correct ? P.green.border : parseInt(answers[idx]) === oi ? P.red.border : 'text.secondary') : 'text.primary' }}>
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
            Submit Quiz
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx('green'), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.green.border }} gutterBottom>Task C Complete!</Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>Score: {score}/{QUESTIONS.length}</Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {score === QUESTIONS.length ? 'Perfect! Outstanding analytical understanding of C1 report writing.' : score >= 4 ? 'Excellent! Strong analytical grasp of professional report quality.' : 'Good effort! Review the detailed explanations above to deepen your C1 understanding.'}
              </Typography>
              <Box
                component="button"
                onClick={() => navigate('/phase6/subphase/1/step/5/remedial/c1/task/d')}
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
                Next: Task D →
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
