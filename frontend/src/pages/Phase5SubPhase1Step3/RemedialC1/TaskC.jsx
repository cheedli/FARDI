import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, TextField, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
}

const QUESTIONS = [
  { id: 1, question: 'Emergency?', options: ['Critical disruption', 'Stop event', 'Fix problem'], correct: 0 },
  { id: 2, question: 'Contingency?', options: ['Pre-planned response', 'Apology', 'Repair'], correct: 0 },
  { id: 3, question: 'Backup?', options: ['Reserve resource', 'Very important', 'Solve'], correct: 0 },
  { id: 4, question: 'Announce?', options: ['Immediate notification', 'Apology', 'Stop plan'], correct: 0 },
  { id: 5, question: 'Update?', options: ['Ongoing communication', 'Fix issue', 'Another option'], correct: 0 },
  { id: 6, question: 'Transparent?', options: ['Full disclosure', 'Apology', 'Stop plan'], correct: 0 }
]

export default function Phase5Step3RemedialC1TaskC() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 3, interaction: 3, context: 'remedial_c1' })
  const [answers, setAnswers] = useState({})
  const [justifications, setJustifications] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })

  const handleAnswerChange = (questionId, value) => { setAnswers(prev => ({ ...prev, [questionId]: parseInt(value) })) }
  const handleJustificationChange = (questionId, value) => { setJustifications(prev => ({ ...prev, [questionId]: value })) }

  const handleSubmit = async () => {
    let correctCount = 0
    QUESTIONS.forEach(q => { if (answers[q.id] === q.correct && justifications[q.id]?.trim().length >= 5) correctCount++ })
    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_step3_remedial_c1_taskC_score', correctCount.toString())
    try { await phase5API.logRemedialActivity(3, 'C1', 'C', correctCount, 6, 0) } catch (e) { console.error(e) }
  }

  const handleContinue = () => { navigate('/phase5/subphase/1/step/3/remedial/c1/task/d') }

  const allAnswered = QUESTIONS.every(q => answers[q.id] !== undefined && justifications[q.id]?.trim())

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Phase 5: Execution &amp; Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 3: Remedial Practice - Level C1</Typography>
            <Typography variant="h6" gutterBottom sx={{ color: P.orange.border }}>Task C: Quizlet Live</Typography>
            <Typography variant="body1" color="text.secondary">Answer quiz on 6 terms with detailed answers</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Quizlet Live! Answer each question and provide a detailed justification!" />
          </Box>
        </motion.div>
        {!submitted ? (
          <>
            <Stack spacing={3} sx={{ mb: 3 }}>
              {QUESTIONS.map((q, idx) => (
                <motion.div key={q.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + idx * 0.05 }}>
                  <Box sx={cardSx(P.blue)}>
                    <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>Question {q.id}: {q.question}</Typography>
                    <FormControl component="fieldset" sx={{ mb: 2 }}>
                      <RadioGroup value={answers[q.id]?.toString() || ''} onChange={(e) => handleAnswerChange(q.id, e.target.value)}>
                        {q.options.map((option, i) => (
                          <FormControlLabel key={i} value={i.toString()} control={<Radio />} label={option} />
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <TextField fullWidth multiline rows={2} label="Detailed Justification (5+ words)" variant="outlined" value={justifications[q.id] || ''} onChange={(e) => handleJustificationChange(q.id, e.target.value)} />
                  </Box>
                </motion.div>
              ))}
            </Stack>
            <Box component="button" onClick={handleSubmit} disabled={!allAnswered} sx={{ width: '100%', bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, py: 1.5, cursor: !allAnswered ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '1rem', color: P.orange.border, opacity: !allAnswered ? 0.5 : 1, '&:hover': allAnswered ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {}, transition: 'all 0.15s ease' }}>
              Submit Answers
            </Box>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), mb: 3, textAlign: 'center' }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.green.border }}>Task C Complete!</Typography>
              <Typography variant="h6" sx={{ mt: 2 }} color="text.secondary">Score: {score} / 6</Typography>
            </Box>
            <Box component="button" onClick={handleContinue} sx={{ width: '100%', bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`, py: 1.5, cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', color: P.green.border, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s ease' }}>
              Next: Task D →
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
