import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, RadioGroup, FormControlLabel, Radio, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 1 - Level C1 - Task C
 * Advanced Quiz: "Quizlet Live"
 */

const LIGHT = {
  pageBg: '#FFFDE7',
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

const QUESTIONS = [
  {
    question: 'Why should a post-event report include weaknesses?',
    options: ['Demonstrate transparency & enable improvement', 'Make the report longer', 'Impress stakeholders with honesty', 'Because it is required by law'],
    correct: 0,
    explanation: 'Including weaknesses demonstrates transparency and creates the foundation for genuine improvement in future events.'
  },
  {
    question: 'Why use evidence (numbers, quotes) in a report?',
    options: ['To make the report look professional', 'Increases credibility & supports recommendations', 'Because stakeholders like data', 'To fill space in the report'],
    correct: 1,
    explanation: 'Evidence increases credibility and provides objective support for your claims and recommendations.'
  },
  {
    question: 'What is the primary role of recommendations in a post-event report?',
    options: ['Criticise the team', 'Summarise what happened', 'Provide actionable steps for future events', 'Show that you identified problems'],
    correct: 2,
    explanation: 'Recommendations provide actionable, specific steps that turn lessons learned into future performance improvements.'
  },
  {
    question: 'Why is it important to balance positive and negative points?',
    options: ['To avoid conflict with stakeholders', 'Builds trust & shows objectivity', 'Because negative points are more important', 'To demonstrate writing skill'],
    correct: 1,
    explanation: 'A balanced report builds trust and shows objectivity — it demonstrates intellectual honesty and prevents accusations of bias.'
  },
  {
    question: 'What is the significance of stakeholder feedback in a report?',
    options: ['It validates your personal opinions', 'It makes the report more interesting', 'Measures real impact & guides decisions', 'It shows participants were satisfied'],
    correct: 2,
    explanation: 'Stakeholder feedback measures the real impact of the event and provides evidence-based guidance for future decisions.'
  },
  {
    question: 'What is the best tone for a formal post-event report?',
    options: ['Personal, emotional, and passionate', 'Informal and conversational', 'Objective, professional, constructive', 'Critical and analytical only'],
    correct: 2,
    explanation: 'A formal report requires objective, professional, and constructive language — avoiding emotional or informal expressions.'
  }
]

export default function Phase6SP1Step1RemC1TaskC() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 1, interaction: 3, context: 'remedial_c1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    let correct = 0
    QUESTIONS.forEach((q, i) => { if (parseInt(answers[i]) === q.correct) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step1_remedial_c1_taskc_score', correct.toString())
    try { await phase6API.logRemedialActivity(1, 'C1', 'C', correct, QUESTIONS.length, 0, 1) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{
            bgcolor: P.orange.bg,
            border: `2px solid ${P.orange.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.orange.shadow}`,
            p: 3,
            mb: 3
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>Phase 6: Reflection and Evaluation</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 1: Remedial Practice - Level C1</Typography>
            <Typography variant="h6" gutterBottom sx={{ color: P.orange.shadow }}>Task C: Quizlet Live</Typography>
            <Typography variant="body1" sx={{ color: P.orange.shadow }}>Answer 6 analytical questions about post-event report writing</Typography>
          </Box>
        </motion.div>

        {/* Instructor Message */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <Box sx={{
            bgcolor: P.teal.bg,
            border: `2px solid ${P.teal.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3,
            mb: 3
          }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Quizlet Live! Answer 6 analytical questions about key concepts in writing a post-event report. These questions test your deep understanding of WHY we write reports, not just HOW. Think carefully!"
            />
          </Box>
        </motion.div>

        {/* Instructions */}
        <Box sx={{
          bgcolor: P.blue.bg,
          border: `2px solid ${P.blue.border}`,
          borderRadius: '14px',
          boxShadow: `2px 2px 0 ${P.blue.shadow}`,
          p: 2,
          mb: 3
        }}>
          <Typography variant="body2" sx={{ color: P.blue.shadow }}>
            <strong>Instructions:</strong> For each question, select the best answer. These are analytical questions
            that require understanding of purpose, not just definitions.
          </Typography>
        </Box>

        <Stack spacing={3}>
          {QUESTIONS.map((q, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + idx * 0.04 }}>
              <Box sx={{
                bgcolor: submitted ? (parseInt(answers[idx]) === q.correct ? P.green.bg : P.red.bg) : P.yellow.bg,
                border: `2px solid ${submitted ? (parseInt(answers[idx]) === q.correct ? P.green.border : P.red.border) : P.yellow.border}`,
                borderRadius: '14px',
                boxShadow: `2px 2px 0 ${submitted ? (parseInt(answers[idx]) === q.correct ? P.green.shadow : P.red.shadow) : P.yellow.shadow}`,
                p: 3
              }}>
                <Typography variant="body1" fontWeight="bold" sx={{ mb: 2, color: P.orange.shadow }}>{idx + 1}. {q.question}</Typography>
                <RadioGroup value={answers[idx] ?? ''} onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })}>
                  {q.options.map((opt, oi) => (
                    <FormControlLabel
                      key={oi}
                      value={oi.toString()}
                      control={<Radio disabled={submitted} sx={{ '&.Mui-checked': { color: submitted ? (oi === q.correct ? P.green.border : P.red.border) : P.orange.border } }} />}
                      label={
                        <Typography variant="body2" sx={{ color: submitted ? (oi === q.correct ? P.green.shadow : parseInt(answers[idx]) === oi ? P.red.shadow : 'text.secondary') : 'text.primary' }}>
                          {opt}{submitted && oi === q.correct ? ' ✓' : ''}
                        </Typography>
                      }
                    />
                  ))}
                </RadioGroup>
                {submitted && (
                  <Box sx={{
                    mt: 2, p: 2,
                    bgcolor: parseInt(answers[idx]) === q.correct ? P.green.bg : P.red.bg,
                    border: `1px solid ${parseInt(answers[idx]) === q.correct ? P.green.border : P.red.border}`,
                    borderRadius: '10px'
                  }}>
                    <Typography variant="body2" sx={{ color: parseInt(answers[idx]) === q.correct ? P.green.shadow : P.red.shadow }}>
                      {q.explanation}
                    </Typography>
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
            disabled={Object.keys(answers).length < QUESTIONS.length}
            sx={{
              cursor: Object.keys(answers).length >= QUESTIONS.length ? 'pointer' : 'not-allowed',
              opacity: Object.keys(answers).length >= QUESTIONS.length ? 1 : 0.6,
              width: '100%', mt: 3, py: 1.5,
              bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
              borderRadius: '16px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
              fontSize: '1rem', fontWeight: 'bold', color: P.orange.shadow,
              '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` },
              transition: 'all 0.15s'
            }}
          >
            Submit Quiz
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{
              bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
              p: 3, mt: 3, textAlign: 'center'
            }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.green.shadow }}>Task C Complete!</Typography>
              <Typography variant="h6" sx={{ mt: 1, color: P.green.shadow }}>Score: {score}/{QUESTIONS.length}</Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {score === QUESTIONS.length ? 'Perfect! Outstanding analytical understanding!' : score >= 4 ? 'Excellent! Strong conceptual grasp of report writing.' : 'Good effort! Review the explanations above to deepen your understanding.'}
              </Typography>
              <Box
                component="button"
                onClick={() => navigate('/phase6/subphase/1/step/1/remedial/c1/task/d')}
                sx={{
                  cursor: 'pointer', mt: 2, px: 4, py: 1.5,
                  bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                  borderRadius: '16px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
                  fontSize: '1rem', fontWeight: 'bold', color: P.green.shadow,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s'
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
