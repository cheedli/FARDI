import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { resolveSubphase2RemedialNextUrl } from '../../Phase5SubPhase2/shared/routing.js'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' } }
const DARK  = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' } }
const clay  = (c) => ({ bgcolor: c.bg, border: `2px solid ${c.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${c.shadow}`, p: 3 })
const hoverLift = (c) => ({ '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${c.shadow}` } })

const QUESTIONS = [
  { id: 1, question: 'Please means?', options: ['Polite request', 'Step 1', 'Next step'], correct: 0 },
  { id: 2, question: 'First?', options: ['Step 1', 'Next step', 'Be safe'], correct: 0 },
  { id: 3, question: 'Then?', options: ['Next step', 'Step 1', 'Be safe'], correct: 0 },
  { id: 4, question: 'Careful?', options: ['Be safe', 'Step 1', 'Next step'], correct: 0 },
  { id: 5, question: 'Help?', options: ['Give support', 'Step 1', 'Next step'], correct: 0 },
  { id: 6, question: 'Thank you?', options: ['Show gratitude', 'Step 1', 'Next step'], correct: 0 }
]

export default function Phase5SubPhase2Step2RemedialB1TaskC() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 2, interaction: 3, context: 'remedial_b1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const handleAnswerChange = (questionId, value) => setAnswers(prev => ({ ...prev, [questionId]: parseInt(value) }))
  const handleSubmit = async () => {
    let c = 0; QUESTIONS.forEach(q => { if (answers[q.id] === q.correct) c++ })
    setScore(c); setSubmitted(true)
    sessionStorage.setItem('phase5_subphase2_step2_remedial_b1_taskC_score', c.toString())
    try { await phase5API.logRemedialActivity(2, 'B1', 'C', c, 6, 2) } catch (e) { console.error(e) }
  }
  const handleContinue = async () => navigate(await resolveSubphase2RemedialNextUrl(2, 'B1'))
  window.__remedialSkip = handleContinue
  const allAnswered = QUESTIONS.every(q => answers[q.id] !== undefined)
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: P.orange.border, mb: 1 }}>Phase 5: Execution &amp; Problem-Solving</Typography>
            <Typography variant="h5" sx={{ color: P.orange.border, mb: 1 }}>SubPhase 2 Step 2: Remedial Practice - Level B1</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border, mb: 1 }}>Task C: Wordshake Quiz</Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>Answer 6 multiple-choice questions on instruction words</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Wordshake Quiz! Answer the multiple-choice questions about instruction vocabulary." />
          </Box>
        </motion.div>
        {!submitted ? (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Stack spacing={3} sx={{ mb: 3 }}>
              {QUESTIONS.map((q) => (
                <Box key={q.id} sx={{ ...clay(P.blue) }}>
                  <Typography variant="h6" gutterBottom sx={{ color: P.blue.border }}>Question {q.id}: {q.question}</Typography>
                  <FormControl component="fieldset">
                    <RadioGroup value={answers[q.id]?.toString() || ''} onChange={(e) => handleAnswerChange(q.id, e.target.value)}>
                      {q.options.map((option, idx) => (<FormControlLabel key={idx} value={idx.toString()} control={<Radio />} label={option} />))}
                    </RadioGroup>
                  </FormControl>
                </Box>
              ))}
            </Stack>
            <Box component="button" onClick={handleSubmit} disabled={!allAnswered}
              sx={{ ...clay(P.orange), ...hoverLift(P.orange), cursor: 'pointer', px: 4, py: 1.5, fontWeight: 'bold', fontSize: '1rem', color: P.orange.border, transition: 'all 0.15s', width: '100%', opacity: !allAnswered ? 0.5 : 1 }}>
              Submit Answers
            </Box>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...clay(P.green), mb: 3, textAlign: 'center' }}>
              <Typography variant="h5" sx={{ color: P.green.border, mb: 2 }}>✓ Task C Complete!</Typography>
              <Typography variant="h6">Score: {score} / 6</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Box component="button" onClick={handleContinue}
                sx={{ ...clay(P.green), ...hoverLift(P.green), cursor: 'pointer', px: 4, py: 1.5, fontWeight: 'bold', fontSize: '1rem', color: P.green.border, transition: 'all 0.15s' }}>Continue to Step 3 →</Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
