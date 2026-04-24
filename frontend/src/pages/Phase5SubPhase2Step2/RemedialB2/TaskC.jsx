import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' } }
const DARK  = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' } }
const clay  = (c) => ({ bgcolor: c.bg, border: `2px solid ${c.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${c.shadow}`, p: 3 })
const hoverLift = (c) => ({ '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${c.shadow}` } })

const PAIRS = [
  { term: 'Please', options: ['Polite request', 'Step 1', 'Next action', 'Warning'], correct: 0 },
  { term: 'First', options: ['Initial step', 'Be safe', 'Polite word', 'Final step'], correct: 0 },
  { term: 'Then', options: ['Next step', 'Step 1', 'Polite word', 'Warning'], correct: 0 },
  { term: 'After that', options: ['Following step', 'First step', 'Polite word', 'Final step'], correct: 0 },
  { term: 'Careful', options: ['Be safe', 'Next step', 'Polite word', 'Step 1'], correct: 0 },
  { term: 'Help', options: ['Give support', 'Next step', 'Warning', 'Step 1'], correct: 0 },
  { term: 'Guide', options: ['Show the way', 'Polite word', 'Step 1', 'Be safe'], correct: 0 },
  { term: 'Welcome', options: ['Greet warmly', 'Next step', 'Step 1', 'Warning'], correct: 0 }
]

export default function Phase5SubPhase2Step2RemedialB2TaskC() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 2, interaction: 3, context: 'remedial_b2' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const handleAnswerChange = (idx, value) => setAnswers(prev => ({ ...prev, [idx]: parseInt(value) }))
  const handleSubmit = async () => {
    let c = 0; PAIRS.forEach((p, i) => { if (answers[i] === p.correct) c++ })
    setScore(c); setSubmitted(true)
    sessionStorage.setItem('phase5_subphase2_step2_remedial_b2_taskC_score', c.toString())
    try { await phase5API.logRemedialActivity(2, 'B2', 'C', c, 8, 2) } catch (e) { console.error(e) }
  }
  const handleContinue = () => navigate('/phase5/subphase/2/step/2/remedial/b2/task/d')
  window.__remedialSkip = handleContinue
  const allAnswered = PAIRS.every((_, i) => answers[i] !== undefined)
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: P.orange.border, mb: 1 }}>Phase 5: Execution &amp; Problem-Solving</Typography>
            <Typography variant="h5" sx={{ color: P.orange.border, mb: 1 }}>SubPhase 2 Step 2: Remedial Practice - Level B2</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border, mb: 1 }}>Task C: Matching Game</Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>Match 8 instruction words to their correct meanings.</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Matching Game! Match each instruction word or phrase to its correct meaning by selecting the right answer." />
          </Box>
        </motion.div>
        {!submitted ? (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Stack spacing={3} sx={{ mb: 3 }}>
              {PAIRS.map((p, i) => (
                <Box key={i} sx={{ ...clay(P.blue) }}>
                  <Typography variant="h6" gutterBottom sx={{ color: P.blue.border }}>"{p.term}" means...</Typography>
                  <FormControl component="fieldset">
                    <RadioGroup value={answers[i]?.toString() || ''} onChange={(e) => handleAnswerChange(i, e.target.value)}>
                      {p.options.map((opt, idx) => (<FormControlLabel key={idx} value={idx.toString()} control={<Radio />} label={opt} />))}
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
              <Typography variant="h6">Score: {score} / 8</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Box component="button" onClick={handleContinue}
                sx={{ ...clay(P.green), ...hoverLift(P.green), cursor: 'pointer', px: 4, py: 1.5, fontWeight: 'bold', fontSize: '1rem', color: P.green.border, transition: 'all 0.15s' }}>Next: Task D →</Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
