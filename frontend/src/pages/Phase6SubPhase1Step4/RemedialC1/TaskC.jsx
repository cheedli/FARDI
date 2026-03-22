import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, RadioGroup, FormControlLabel, Radio } from '@mui/material'
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
  {
    question: 'Why is it important to use evidence (data, figures) in a post-event report rather than just stating opinions?',
    options: [
      'It makes the report longer and more impressive.',
      'It ensures credibility and allows stakeholders to verify claims objectively.',
      'It shows you have good vocabulary.',
      'It is a rule that all reports must follow.',
    ],
    correct: 1,
    explanation: 'Evidence-based reporting ensures credibility and objectivity — stakeholders can verify findings rather than relying on subjective impressions.'
  },
  {
    question: 'A report states: "The event went well." What is the main weakness of this sentence at C1 level?',
    options: [
      'It uses the wrong tense.',
      'It is too long.',
      'It is vague, subjective, and lacks specific evidence or measurable outcomes.',
      'It should start with "Furthermore".',
    ],
    correct: 2,
    explanation: 'C1 reports require precise, evidence-based language. "Went well" is subjective and unverifiable — it must be replaced with specific, measurable claims.'
  },
  {
    question: 'When writing about challenges, which approach is most appropriate for a C1-level report?',
    options: [
      'Omit challenges to make the report more positive.',
      'List challenges briefly without explanation.',
      'Acknowledge challenges with nuanced language, explaining their cause and resolution.',
      'Use informal language to show honesty.',
    ],
    correct: 2,
    explanation: 'A balanced, nuanced treatment of challenges demonstrates analytical maturity. Omitting them undermines the report\'s objectivity and accountability.'
  },
  {
    question: 'Which opening is most appropriate for a C1 post-event report?',
    options: [
      '"This report is about the event that happened."',
      '"This report presents a comprehensive evaluation of the outcomes of the annual symposium held on 5 March."',
      '"The event was great and we learned a lot."',
      '"Here is the report about what we did."',
    ],
    correct: 1,
    explanation: 'C1 reports open with a formal, precise statement of purpose. The second option uses appropriate academic register and provides key contextual information.'
  },
  {
    question: 'Why should recommendations in a report be linked to specific findings?',
    options: [
      'To make the report more interesting to read.',
      'Because all reports must have exactly three recommendations.',
      'To ensure recommendations are actionable and justified by evidence rather than arbitrary.',
      'To demonstrate the writer\'s creativity.',
    ],
    correct: 2,
    explanation: 'Linking recommendations to findings (e.g. "In light of the low attendance figures...") ensures they are evidence-based, stakeholder-relevant, and actionable.'
  },
  {
    question: 'A report says: "Notwithstanding the logistical constraints encountered, the event achieved its core objectives." What does this sentence demonstrate?',
    options: [
      'Poor grammar and overuse of formal language.',
      'A nuanced, balanced evaluation that acknowledges difficulty while affirming success.',
      'The writer is trying to hide the problems.',
      'That the event was mostly unsuccessful.',
    ],
    correct: 1,
    explanation: '"Notwithstanding" signals a concessive relationship — the writer acknowledges a challenge while asserting a positive outcome. This balance is characteristic of C1-level analytical writing.'
  },
]

export default function Phase6SP1Step4RemC1TaskC() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 4, interaction: 3, context: 'remedial_c1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    let correct = 0
    QUESTIONS.forEach((q, i) => { if (parseInt(answers[i]) === q.correct) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step4_remedial_c1_taskc_score', correct.toString())
    try { await phase6API.logRemedialActivity(4, 'C1', 'C', correct, QUESTIONS.length, 0, 1) } catch (e) { console.error(e) }
  }

  const allAnswered = Object.keys(answers).length === QUESTIONS.length

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
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 4: Remedial Practice — Level C1</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Task C: Quizlet Live</Typography>
            <Typography variant="body1" color="text.secondary">6 advanced analytical questions about report-writing decisions</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <Typography variant="body2">These questions test your understanding of <strong>why</strong> certain report-writing choices are made — not just what they are.</Typography>
          </Box>
        </motion.div>

        <Stack spacing={3} sx={{ mb: 3 }}>
          {QUESTIONS.map((q, idx) => {
            const isCorrect = submitted && parseInt(answers[idx]) === q.correct
            const isWrong = submitted && parseInt(answers[idx]) !== q.correct
            return (
              <motion.div key={idx} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + idx * 0.05 }}>
                <Box sx={{ ...cardSx(submitted ? (isCorrect ? P.green : P.red) : P.purple) }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1.5, color: P.purple.border }}>
                    {idx + 1}. {q.question}
                  </Typography>
                  <RadioGroup
                    value={answers[idx] ?? ''}
                    onChange={(e) => !submitted && setAnswers({ ...answers, [idx]: e.target.value })}
                  >
                    {q.options.map((opt, oi) => (
                      <FormControlLabel
                        key={oi}
                        value={oi.toString()}
                        control={<Radio disabled={submitted} />}
                        label={opt}
                        sx={{
                          ...(submitted && oi === q.correct && { '& .MuiFormControlLabel-label': { color: P.green.border, fontWeight: 'bold' } }),
                          ...(submitted && isWrong && oi === parseInt(answers[idx]) && { '& .MuiFormControlLabel-label': { color: P.red.border } }),
                        }}
                      />
                    ))}
                  </RadioGroup>
                  {submitted && (
                    <Box sx={{ mt: 1.5, p: 1.5, bgcolor: isCorrect ? P.green.bg : P.red.bg, border: `1px solid ${isCorrect ? P.green.border : P.red.border}`, borderRadius: '12px' }}>
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
                {score >= 5 ? 'Outstanding analytical thinking at C1 level!' : 'Good effort! Review the explanations above carefully.'}
              </Typography>
              <Box
                component="button"
                onClick={() => navigate('/phase6/subphase/1/step/4/remedial/c1/task/d')}
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
                Continue to Task D →
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
