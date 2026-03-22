import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
}

const QUESTIONS = [
  { id: 1, question: 'Problem means?', options: ['Something wrong', 'Stop event', 'Fix problem'], correct: 0 },
  { id: 2, question: 'Emergency?', options: ['Urgent', 'Apology', 'Repair'], correct: 0 },
  { id: 3, question: 'Fix?', options: ['Repair', 'Stop plan', 'Another choice'], correct: 0 },
  { id: 4, question: 'Backup?', options: ['Extra plan', 'Very important', 'Solve'], correct: 0 },
  { id: 5, question: 'Announce?', options: ['Tell', 'Fix issue', 'Another option'], correct: 0 },
  { id: 6, question: 'Update?', options: ['New info', 'Apology', 'Stop plan'], correct: 0 }
]

export default function Phase5Step2RemedialB1TaskC() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 2, interaction: 3, context: 'remedial_b1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const cardSx = (color) => ({
    bgcolor: color.bg,
    border: `2px solid ${color.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${color.shadow}`,
    p: 3,
  })

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: parseInt(value) }))
  }

  const handleSubmit = async () => {
    let correctCount = 0
    QUESTIONS.forEach(q => {
      if (answers[q.id] === q.correct) correctCount++
    })
    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_step2_remedial_b1_taskC_score', correctCount.toString())
    try {
      await phase5API.logRemedialActivity(2, 'B1', 'C', correctCount, 6, 0)
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = async () => {
    const taskAScore = parseInt(sessionStorage.getItem('phase5_step2_remedial_b1_taskA_score') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('phase5_step2_remedial_b1_taskB_score') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('phase5_step2_remedial_b1_taskC_score') || '0')
    const totalScore = taskAScore + taskBScore + taskCScore
    const maxScore = 3 + 6 + 6
    const threshold = Math.ceil(maxScore * 0.8)
    const passed = totalScore >= threshold
    try {
      await phase5API.calculateRemedialScore(2, 'B1', {
        task_a_score: taskAScore, task_b_score: taskBScore, task_c_score: taskCScore
      })
    } catch (error) {
      console.error('Failed to log final score:', error)
    }
    if (passed) {
      navigate('/dashboard')
    } else {
      navigate('/phase5/subphase/1/step/2/remedial/b1/task/a')
    }
  }

  const allAnswered = QUESTIONS.every(q => answers[q.id] !== undefined)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>
              Phase 5: Execution &amp; Problem-Solving
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>
              Step 2: Remedial Practice - Level B1
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ color: P.orange.border }}>Task C: Wordshake Quiz</Typography>
            <Typography variant="body1" color="text.secondary">Answer 6 questions on crisis terms</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Wordshake Quiz! Answer the multiple-choice questions about crisis vocabulary!" />
          </Box>
        </motion.div>

        {!submitted ? (
          <>
            <Stack spacing={3} sx={{ mb: 3 }}>
              {QUESTIONS.map((q, qIdx) => (
                <motion.div key={q.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + qIdx * 0.05 }}>
                  <Box sx={{ ...cardSx(P.blue) }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>
                      Question {q.id}: {q.question}
                    </Typography>
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
            <Box
              component="button"
              onClick={handleSubmit}
              disabled={!allAnswered}
              sx={{
                width: '100%',
                bgcolor: P.orange.bg,
                border: `2px solid ${P.orange.border}`,
                borderRadius: '14px',
                boxShadow: `4px 4px 0 ${P.orange.shadow}`,
                py: 1.5,
                cursor: !allAnswered ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem',
                color: P.orange.border,
                opacity: !allAnswered ? 0.5 : 1,
                '&:hover': allAnswered ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {},
                transition: 'all 0.15s ease',
              }}
            >
              Submit Answers
            </Box>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), mb: 3, textAlign: 'center' }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.green.border }}>Task C Complete!</Typography>
              <Typography variant="h6" sx={{ mt: 2 }} color="text.secondary">Score: {score} / 6</Typography>
            </Box>
            <Box
              component="button"
              onClick={handleContinue}
              sx={{
                width: '100%',
                bgcolor: P.green.bg,
                border: `2px solid ${P.green.border}`,
                borderRadius: '14px',
                boxShadow: `4px 4px 0 ${P.green.shadow}`,
                py: 1.5,
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem',
                color: P.green.border,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                transition: 'all 0.15s ease',
              }}
            >
              Continue to Final Results →
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
