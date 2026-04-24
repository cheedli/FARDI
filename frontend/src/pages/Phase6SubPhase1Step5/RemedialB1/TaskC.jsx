import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, RadioGroup, FormControlLabel, Radio } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { resolveSubphase1RemedialNextUrl } from '../../Phase6SubPhase1/shared/routing.js'
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
    question: '"Succes was good" — what type of error is this?',
    options: ['Spelling', 'Tense', 'Grammar', 'Formality'],
    correct: 0,
    explanation: 'Spelling error: "succes" should be "success" (double s at the end).'
  },
  {
    question: '"Many people come" — what type of error is this?',
    options: ['Spelling', 'Tense', 'Vocabulary', 'Tone'],
    correct: 1,
    explanation: 'Tense error: "come" should be past tense "came".'
  },
  {
    question: '"Dances nice" — what type of error is this?',
    options: ['Spelling', 'Tense', 'Grammar', 'Vocabulary'],
    correct: 2,
    explanation: 'Grammar error: Missing verb "were" — should be "Dances were nice."'
  },
  {
    question: '"Lights problem bad" — what type of error is this?',
    options: ['Spelling', 'Tense', 'Structure', 'Formality'],
    correct: 2,
    explanation: 'Structure error: Should be "There was a lighting problem" — needs proper sentence structure.'
  },
  {
    question: '"We fix fast" — what type of error is this?',
    options: ['Spelling', 'Tense', 'Vocabulary', 'Grammar'],
    correct: 1,
    explanation: 'Tense error: "fix" should be past tense "fixed". Also "fast" should be "quickly".'
  },
  {
    question: '"People happy" — what type of error is this?',
    options: ['Spelling', 'Tense', 'Grammar', 'Formality'],
    correct: 3,
    explanation: 'Formality error: "People happy" is too informal. Should be "Guests were satisfied" or "Guests gave positive feedback."'
  }
]

export default function Phase6SP1Step5RemB1TaskC() {
  const navigate = useNavigate()
  React.useEffect(() => { resolveSubphase1RemedialNextUrl(5, 'B1').then(url => { window.__remedialSkip = () => navigate(url) }) }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 5, interaction: 3, context: 'remedial_b1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    let correct = 0
    QUESTIONS.forEach((q, i) => { if (parseInt(answers[i]) === q.correct) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step5_remedial_b1_taskc_score', correct.toString())
    try { await phase6API.logRemedialActivity(5, 'B1', 'C', correct, QUESTIONS.length, 0, 1) } catch (e) { console.error(e) }
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
            <Typography variant="h6" sx={{ color: P.orange.border }}>Task C: Wordshake Quiz</Typography>
            <Typography variant="body1" color="text.secondary">Identify the error type in 6 report sentences</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx('teal'), mb: 3 }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Wordshake Quiz! For each faulty sentence, identify what TYPE of error it contains: Spelling, Tense, Grammar, Structure, Vocabulary, or Formality. Think carefully!"
            />
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx('teal'), mb: 3 }}>
            <Typography variant="body2"><strong>Instructions:</strong> Read each sentence and select the type of error it contains. Error types: Spelling (wrong letters), Tense (wrong verb form), Grammar (missing words), Structure (wrong order), Vocabulary (wrong word choice), Formality (too informal).</Typography>
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
                {score >= 5 ? 'Excellent! You can identify error types in report writing.' : score >= 4 ? 'Good work! Review the explanations above.' : 'Keep practicing — understanding error types helps you proofread better.'}
              </Typography>
              <Box
                component="button"
                onClick={async () => navigate(await resolveSubphase1RemedialNextUrl(5, 'B1'))}
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
                Continue →
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
