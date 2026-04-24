import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, Radio, RadioGroup, FormControlLabel, FormControl, TextField, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
}

const QUESTIONS = [
  { id: 1, question: 'Alternative?', options: ['Substitute option', 'Stop event', 'Fix problem'], correct: 0 },
  { id: 2, question: 'Urgent?', options: ['Immediate action', 'Apology', 'Repair'], correct: 0 },
  { id: 3, question: 'Solution?', options: ['Problem resolution', 'Stop plan', 'Another choice'], correct: 0 },
  { id: 4, question: 'Apology?', options: ['Expression of regret', 'Very important', 'Solve'], correct: 0 },
  { id: 5, question: 'Mitigate?', options: ['Reduce impact', 'Apology', 'Stop plan'], correct: 0 },
  { id: 6, question: 'Contingency?', options: ['Backup plan', 'Fix issue', 'Another option'], correct: 0 }
]

export default function Phase5Step1RemedialC1TaskC() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase5/subphase/1/step/1/remedial/c1/task/d') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 1, interaction: 3, context: 'remedial_c1' })
  const [answers, setAnswers] = useState({})
  const [justifications, setJustifications] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: parseInt(value) }))
  }

  const handleJustificationChange = (questionId, value) => {
    setJustifications(prev => ({ ...prev, [questionId]: value }))
  }

  const handleSubmit = async () => {
    let correctCount = 0
    QUESTIONS.forEach(q => {
      if (answers[q.id] === q.correct && justifications[q.id]?.trim().length >= 5) correctCount++
    })
    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_step1_remedial_c1_taskC_score', correctCount.toString())
    try {
      await phase5API.logRemedialActivity(1, 'C1', 'C', correctCount, 6, 0)
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/1/step/1/remedial/c1/task/d')
  }

  const allAnswered = QUESTIONS.every(q => answers[q.id] !== undefined && justifications[q.id]?.trim())

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{
            bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
            p: 3, mb: 3
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Phase 5: Execution & Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.shadow }}>Step 1: Remedial Practice - Level C1</Typography>
            <Typography variant="h6" gutterBottom fontWeight="bold">Task C: Quizlet Live</Typography>
            <Typography variant="body1">Answer quiz on 6 problem-solving terms with justifications</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3
          }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Quizlet Live! Answer each question and provide a brief justification for your answer!" />
          </Box>
        </motion.div>

        {!submitted ? (
          <>
            <Stack spacing={3} sx={{ mb: 3 }}>
              {QUESTIONS.map((q, i) => (
                <motion.div key={q.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}>
                  <Box sx={{
                    bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                    borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
                    p: 3
                  }}>
                    <Typography variant="h6" gutterBottom>Question {q.id}: {q.question}</Typography>
                    <FormControl component="fieldset" sx={{ mb: 2 }}>
                      <RadioGroup value={answers[q.id]?.toString() || ''} onChange={(e) => handleAnswerChange(q.id, e.target.value)}>
                        {q.options.map((option, idx) => (
                          <FormControlLabel key={idx} value={idx.toString()} control={<Radio />} label={option} />
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <TextField
                      fullWidth multiline rows={2} label="Justification (5+ words)" variant="outlined"
                      value={justifications[q.id] || ''} onChange={(e) => handleJustificationChange(q.id, e.target.value)}
                    />
                  </Box>
                </motion.div>
              ))}
            </Stack>
            <Box
              component="button" onClick={handleSubmit} disabled={!allAnswered}
              sx={{
                bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                borderRadius: '14px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
                px: 4, py: 1.5, fontSize: '1rem', fontWeight: 'bold',
                color: P.blue.border, cursor: allAnswered ? 'pointer' : 'not-allowed',
                opacity: allAnswered ? 1 : 0.5, width: '100%',
                transition: 'all 0.15s',
                '&:hover': allAnswered ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` } : {}
              }}
            >Submit Answers</Box>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{
              bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
              p: 4, mb: 3, textAlign: 'center'
            }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.green.shadow }} gutterBottom>✓ Task C Complete!</Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>Score: {score} / 6</Typography>
            </Box>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Box
                component="button" onClick={handleContinue}
                sx={{
                  bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                  borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
                  px: 4, py: 1.5, fontSize: '1rem', fontWeight: 'bold',
                  color: P.green.shadow, cursor: 'pointer',
                  transition: 'all 0.15s',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }
                }}
              >Next: Task D →</Box>
            </Stack>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
