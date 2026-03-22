import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, RadioGroup, FormControlLabel, Radio } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' }, red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' } }
const DARK = { pageBg: '#0F0F1A', blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' }, red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' } }

const QUESTIONS = [
  { question: 'What is the purpose of including weaknesses in a post-event report?', options: ['To embarrass the organizing team', 'Enable improvement — honest documentation drives learning and better future performance', 'To satisfy format requirements only'], correct: 1, explanation: 'Including weaknesses enables improvement: honest documentation of what went wrong provides the necessary basis for targeted, evidence-based recommendations that genuinely drive performance enhancement.' },
  { question: 'What role does evidence play in ensuring report credibility?', options: ['It ensures credibility — data and quotes support claims objectively', 'It increases the word count of the report', 'It replaces the need for stakeholder input'], correct: 0, explanation: 'Evidence (attendance data, feedback quotes, comparative statistics) ensures credibility by grounding claims in verifiable reality — transforming subjective assessment into objective, defensible findings.' },
  { question: 'Why is it important to maintain balance in a post-event report?', options: ['To please all readers equally', 'To demonstrate objectivity — showing both successes and failures fairly', 'To avoid mentioning any problems'], correct: 1, explanation: 'Balance demonstrates objectivity: a report that documents both successes and failures with equal rigor is perceived as credible and analytically sound — stakeholders trust it because it reflects reality rather than selective promotion.' },
  { question: 'Why is feedback integration important in a post-event report?', options: ['It captures real impact — direct participant perspectives provide authentic evidence', 'It makes the report longer and more impressive', 'It replaces the need for quantitative data'], correct: 0, explanation: 'Feedback integration captures real impact: participant perspectives provide authentic evidence of how the event was actually experienced, offering qualitative depth that quantitative data alone cannot capture.' },
  { question: 'What standard must recommendations in a post-event report meet?', options: ['They must be written by management only', 'They must be inspirational and motivating', 'Actionable & specific — clear, implementable steps that stakeholders can act upon'], correct: 2, explanation: 'Recommendations must be actionable and specific: vague suggestions ("do better next time") have no practical value. Effective recommendations identify what, who, when, and how — enabling immediate institutional action.' },
  { question: 'What is the optimal tone for a professional post-event report?', options: ['Objective & constructive — analytical without emotion or bias', 'Enthusiastic and promotional to motivate stakeholders', 'Apologetic and self-critical to show humility'], correct: 0, explanation: 'The optimal tone is objective and constructive: professional reporting maintains analytical distance, presenting facts, evidence, and balanced assessments without emotional language, personal bias, or excessive self-promotion or self-criticism.' }
]

export default function Phase6SP1Step3RemedialC1TaskC() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 3, interaction: 3, context: 'remedial_c1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })

  const handleSubmit = async () => {
    let correct = 0
    QUESTIONS.forEach((q, i) => { if (parseInt(answers[i]) === q.correct) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step3_remedial_c1_taskc_score', correct.toString())
    try { await phase6API.logRemedialActivity(3, 'C1', 'C', correct, QUESTIONS.length, 0, 1) } catch (e) { console.error(e) }
  }

  const allAnswered = QUESTIONS.every((_, i) => answers[i] !== undefined)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Phase 6: Reflection &amp; Evaluation</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 3: Remedial Practice - Level C1</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Task C: Advanced Quiz</Typography>
            <Typography variant="body1" color="text.secondary">Answer 6 questions on the strategic purpose of professional report concepts</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="This advanced quiz tests not just your knowledge of report terms, but your understanding of their strategic purpose and professional function. Think analytically!" />
          </Box>
        </motion.div>
        <Stack spacing={2} sx={{ mb: 3 }}>
          {QUESTIONS.map((q, idx) => {
            const isCorrect = submitted && parseInt(answers[idx]) === q.correct
            return (
              <motion.div key={idx} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + idx * 0.03 }}>
                <Box sx={{ ...cardSx(submitted ? (isCorrect ? P.green : P.red) : P.blue), p: 2.5 }}>
                  <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>{idx + 1}. {q.question}</Typography>
                  <RadioGroup value={answers[idx] !== undefined ? answers[idx].toString() : ''} onChange={(e) => !submitted && setAnswers({ ...answers, [idx]: e.target.value })}>
                    {q.options.map((opt, oi) => (
                      <FormControlLabel key={oi} value={oi.toString()} control={<Radio disabled={submitted} size="small" />}
                        label={<Typography variant="body2" sx={{ color: submitted && oi === q.correct ? P.green.border : 'inherit', fontWeight: submitted && oi === q.correct ? 'bold' : 'normal' }}>{opt}</Typography>} />
                    ))}
                  </RadioGroup>
                  {submitted && (
                    <Box sx={{ ...cardSx(isCorrect ? P.green : P.red), mt: 1, p: 1.5 }}>
                      <Typography variant="body2"><strong>Explanation:</strong> {q.explanation}</Typography>
                    </Box>
                  )}
                </Box>
              </motion.div>
            )
          })}
        </Stack>
        {!submitted ? (
          <Box component="button" onClick={handleSubmit} disabled={!allAnswered} sx={{ width: '100%', ...cardSx(P.orange), p: 1.5, cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', color: P.orange.border, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }, '&:disabled': { opacity: 0.5, cursor: 'not-allowed' }, transition: 'all 0.15s ease' }}>
            Submit Answers
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" gutterBottom sx={{ color: P.green.border }}>Task C Complete! Score: {score}/{QUESTIONS.length}</Typography>
              <Box component="button" onClick={() => navigate('/phase6/subphase/1/step/3/remedial/c1/task/d')} sx={{ ...cardSx(P.orange), p: 1.5, cursor: 'pointer', fontWeight: 'bold', color: P.orange.border, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }, transition: 'all 0.15s ease' }}>
                Next: Task D →
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
