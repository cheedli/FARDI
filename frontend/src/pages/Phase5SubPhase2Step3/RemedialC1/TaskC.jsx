import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, Radio, RadioGroup, FormControlLabel, FormControl, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  blue:   { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  teal:   { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  red:    { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  teal:   { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  red:    { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
  purple: { bg: '#3B0764', border: '#C084FC', shadow: '#6B21A8' },
}

const QUESTIONS = [
  { id: 1, question: 'Sequencing purpose?', options: ['Logical order', 'Build respect', 'Prevent accidents'], correct: 0 },
  { id: 2, question: 'Politeness markers?', options: ['Build respect', 'Logical order', 'Prevent accidents'], correct: 0 },
  { id: 3, question: 'Safety reminders?', options: ['Prevent accidents', 'Logical order', 'Build respect'], correct: 0 },
  { id: 4, question: 'Empathy tone?', options: ['Foster cooperation', 'Logical order', 'Build respect'], correct: 0 },
  { id: 5, question: 'Clarity principle?', options: ['Reduce errors', 'Logical order', 'Build respect'], correct: 0 },
  { id: 6, question: 'Appreciation effect?', options: ['Increase motivation', 'Logical order', 'Build respect'], correct: 0 }
]

export default function Phase5SubPhase2Step3RemedialC1TaskC() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase5/subphase/2/step/3/remedial/c1/task/d') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 3, interaction: 3, context: 'remedial_c1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

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
    sessionStorage.setItem('phase5_subphase2_step3_remedial_c1_taskC_score', correctCount.toString())
    try {
      await phase5API.logRemedialActivity(3, 'C1', 'C', correctCount, 6, 2)
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/2/step/3/remedial/c1/task/d')
  }

  const allAnswered = QUESTIONS.every(q => answers[q.id] !== undefined)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{
            bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`,
            p: 3, mb: 3
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.purple.border }}>Phase 5: Execution & Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.purple.shadow }}>SubPhase 2 Step 3: Remedial Practice - Level C1</Typography>
            <Typography variant="h6" gutterBottom fontWeight="bold">Task C: Advanced Quiz</Typography>
            <Typography variant="body1">Create and answer quiz on 6 instruction terms/phrases. Detailed answers!</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3
          }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Advanced Quiz! Answer the multiple-choice questions about instruction principles. Choose the most detailed and accurate answer!" />
          </Box>
        </motion.div>

        {!submitted ? (
          <>
            <Stack spacing={3} sx={{ mb: 3 }}>
              {QUESTIONS.map((q, i) => (
                <motion.div key={q.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}>
                  <Box sx={{
                    bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                    borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
                    p: 3
                  }}>
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
