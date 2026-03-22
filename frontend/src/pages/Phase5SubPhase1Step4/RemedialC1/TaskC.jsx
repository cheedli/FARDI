import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, Radio, RadioGroup, FormControlLabel, FormControl, TextField, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' } }
const DARK = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' } }

const QUESTIONS = [
  { id: 1, question: 'Emergency?', options: ['Critical disruption', 'Stop event', 'Fix problem'], correct: 0 },
  { id: 2, question: 'Contingency?', options: ['Pre-planned response', 'Apology', 'Repair'], correct: 0 },
  { id: 3, question: 'Backup?', options: ['Reserve resource', 'Very important', 'Solve'], correct: 0 },
  { id: 4, question: 'Announce?', options: ['Immediate notification', 'Apology', 'Stop plan'], correct: 0 },
  { id: 5, question: 'Update?', options: ['Ongoing info', 'Fix issue', 'Another option'], correct: 0 },
  { id: 6, question: 'Transparent?', options: ['Full honesty', 'Apology', 'Stop plan'], correct: 0 }
]

export default function Phase5Step4RemedialC1TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 4, interaction: 3, context: 'remedial_c1' })
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const [answers, setAnswers] = useState({})
  const [justifications, setJustifications] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const clay = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })
  const handleAnswerChange = (questionId, value) => { setAnswers(prev => ({ ...prev, [questionId]: parseInt(value) })) }
  const handleJustificationChange = (questionId, value) => { setJustifications(prev => ({ ...prev, [questionId]: value })) }

  const handleSubmit = async () => {
    let correctCount = 0
    QUESTIONS.forEach(q => { if (answers[q.id] === q.correct && justifications[q.id]?.trim().length >= 5) correctCount++ })
    setScore(correctCount); setSubmitted(true)
    sessionStorage.setItem('phase5_step4_remedial_c1_taskC_score', correctCount.toString())
    try { await phase5API.logRemedialActivity(4, 'C1', 'C', correctCount, 6, 0) } catch (e) { console.error(e) }
  }

  const handleContinue = () => { navigate('/phase5/subphase/1/step/4/remedial/c1/task/d') }
  const allAnswered = QUESTIONS.every(q => answers[q.id] !== undefined && justifications[q.id]?.trim())

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Phase 5: Execution & Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 4: Remedial Practice - Level C1</Typography>
            <Typography variant="h6" gutterBottom sx={{ color: P.orange.border }}>Task C: Advanced Quiz</Typography>
            <Typography variant="body1">Create and answer quiz on 6 terms</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...clay(P.teal), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Advanced Quiz! Answer each question and provide a detailed justification!" />
          </Box>
        </motion.div>
        {!submitted ? (
          <>
            <Stack spacing={3} sx={{ mb: 3 }}>
              {QUESTIONS.map((q, qi) => (
                <motion.div key={q.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + qi * 0.05 }}>
                  <Box sx={{ ...clay(P.blue) }}>
                    <Typography variant="h6" gutterBottom sx={{ color: P.blue.border }}>Question {q.id}: {q.question}</Typography>
                    <FormControl component="fieldset" sx={{ mb: 2 }}>
                      <RadioGroup value={answers[q.id]?.toString() || ''} onChange={(e) => handleAnswerChange(q.id, e.target.value)}>
                        {q.options.map((option, idx) => (
                          <FormControlLabel key={idx} value={idx.toString()} control={<Radio />} label={option} />
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <TextField fullWidth multiline rows={2} label="Detailed Justification (5+ words)" variant="outlined" value={justifications[q.id] || ''} onChange={(e) => handleJustificationChange(q.id, e.target.value)} />
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
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Box component="button" onClick={handleContinue} sx={{ ...clay(P.green), cursor: 'pointer', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s' }}>
                <Typography variant="button" fontWeight="bold" sx={{ color: P.green.border }}>Next: Task D →</Typography>
              </Box>
            </Stack>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
