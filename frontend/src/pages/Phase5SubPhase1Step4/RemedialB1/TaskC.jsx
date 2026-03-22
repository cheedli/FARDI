import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, Radio, RadioGroup, FormControlLabel, FormControl, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' } }
const DARK = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' } }

const QUESTIONS = [
  { id: 1, question: 'Emergency?', options: ['Urgent problem', 'Stop event', 'Fix problem'], correct: 0 },
  { id: 2, question: 'Backup?', options: ['Extra plan', 'Apology', 'Repair'], correct: 0 },
  { id: 3, question: 'Announce?', options: ['Tell everyone', 'Fix issue', 'Another option'], correct: 0 },
  { id: 4, question: 'Update?', options: ['New info', 'Apology', 'Stop plan'], correct: 0 },
  { id: 5, question: 'Fix?', options: ['Repair', 'Stop plan', 'Another choice'], correct: 0 },
  { id: 6, question: 'Transparent?', options: ['Tell truth', 'Fix issue', 'Another option'], correct: 0 }
]

export default function Phase5Step4RemedialB1TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 4, interaction: 3, context: 'remedial_b1' })
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const clay = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: parseInt(value) }))
  }

  const handleSubmit = async () => {
    let correctCount = 0
    QUESTIONS.forEach(q => { if (answers[q.id] === q.correct) correctCount++ })
    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_step4_remedial_b1_taskC_score', correctCount.toString())
    try { await phase5API.logRemedialActivity(4, 'B1', 'C', correctCount, 6, 0) } catch (e) { console.error(e) }
  }

  const handleContinue = async () => {
    const a = parseInt(sessionStorage.getItem('phase5_step4_remedial_b1_taskA_score') || '0')
    const b = parseInt(sessionStorage.getItem('phase5_step4_remedial_b1_taskB_score') || '0')
    const c = parseInt(sessionStorage.getItem('phase5_step4_remedial_b1_taskC_score') || '0')
    const total = a + b + c; const passed = total >= Math.ceil(17 * 0.8)
    try { await phase5API.calculateRemedialScore(4, 'B1', { task_a_score: a, task_b_score: b, task_c_score: c }) } catch (e) { console.error(e) }
    if (passed) navigate('/dashboard'); else navigate('/phase5/subphase/1/step/4/remedial/b1/task/a')
  }

  const allAnswered = QUESTIONS.every(q => answers[q.id] !== undefined)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Phase 5: Execution & Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 4: Remedial Practice - Level B1</Typography>
            <Typography variant="h6" gutterBottom sx={{ color: P.orange.border }}>Task C: Quiz Game</Typography>
            <Typography variant="body1">Answer 6 questions on terms</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...clay(P.teal), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Quiz Game! Answer the multiple-choice questions about crisis communication terms!" />
          </Box>
        </motion.div>
        {!submitted ? (
          <>
            <Stack spacing={3} sx={{ mb: 3 }}>
              {QUESTIONS.map((q, qi) => (
                <motion.div key={q.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + qi * 0.05 }}>
                  <Box sx={{ ...clay(P.blue) }}>
                    <Typography variant="h6" gutterBottom sx={{ color: P.blue.border }}>Question {q.id}: {q.question}</Typography>
                    <FormControl component="fieldset">
                      <RadioGroup value={answers[q.id]?.toString() || ''} onChange={(e) => handleAnswerChange(q.id, e.target.value)}>
                        {q.options.map((option, idx) => (
                          <FormControlLabel key={idx} value={idx.toString()} control={<Radio />} label={option} />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </Box>
                </motion.div>
              ))}
            </Stack>
            <Box component="button" onClick={handleSubmit} disabled={!allAnswered} sx={{ ...clay(P.orange), cursor: 'pointer', width: '100%', opacity: !allAnswered ? 0.6 : 1, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }, transition: 'all 0.15s' }}>
              <Typography variant="button" fontWeight="bold" sx={{ color: P.orange.border }}>Submit Answers</Typography>
            </Box>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...clay(P.green), mb: 3, textAlign: 'center' }}>
              <Typography variant="h5" sx={{ color: P.green.border }} gutterBottom>✓ Task C Complete!</Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>Score: {score} / 6</Typography>
            </Box>
            <Box component="button" onClick={handleContinue} sx={{ ...clay(P.green), cursor: 'pointer', width: '100%', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s' }}>
              <Typography variant="button" fontWeight="bold" sx={{ color: P.green.border }}>Continue to Final Results →</Typography>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
