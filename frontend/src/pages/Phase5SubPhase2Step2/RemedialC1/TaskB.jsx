import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, LinearProgress } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' } }
const DARK  = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' } }
const clay  = (c) => ({ bgcolor: c.bg, border: `2px solid ${c.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${c.shadow}`, p: 3 })
const hoverLift = (c) => ({ '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${c.shadow}` } })

const GUIDED_QUESTIONS = [
  { id: 1, question: 'Greet guests professionally?', example: 'Please welcome all distinguished guests to our technology fair with warmth and professionalism.' },
  { id: 2, question: 'Verify credentials carefully?', example: 'First, systematically verify their credentials and ensure all documentation is in order.' },
  { id: 3, question: 'Direct guests to appropriate zones?', example: 'Then, professionally direct guests to their designated zones using clear signage.' },
  { id: 4, question: 'Maintain crowd safety?', example: 'After that, carefully monitor crowd density to maintain a safe and comfortable environment.' },
  { id: 5, question: 'Resolve issues professionally?', example: 'Please handle any emerging issues calmly, diplomatically, and with complete professionalism.' },
  { id: 6, question: 'Coordinate with your team?', example: 'Then, maintain constant coordination with your team via communication devices.' },
  { id: 7, question: 'Document critical incidents?', example: 'After resolving, please document all critical incidents in the official incident report.' },
  { id: 8, question: 'Debrief after the event?', example: 'Finally, conduct a comprehensive debrief session to evaluate volunteer performance and outcomes.' }
]

export default function Phase5SubPhase2Step2RemedialC1TaskB() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 2, interaction: 2, context: 'remedial_c1' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState(Array(8).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const handleAnswerChange = (value) => { const a = [...answers]; a[currentIndex] = value; setAnswers(a) }
  const handleNext = () => { if (currentIndex < 7) setCurrentIndex(currentIndex + 1) }
  const handlePrevious = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1) }
  const handleSubmit = async () => {
    let c = 0
    answers.forEach(a => {
      const w = a.trim().split(/\s+/).filter(x => x.length > 0), l = a.toLowerCase()
      const adv = l.includes('professionally') || l.includes('carefully') || l.includes('systematically') || l.includes('diplomatically') || l.includes('comprehensively')
      const seq = l.includes('first') || l.includes('then') || l.includes('after') || l.includes('finally')
      const pol = l.includes('please') || l.includes('kindly') || l.includes('respectfully')
      if (w.length >= 10 && (adv || seq || pol)) c++
    })
    setScore(c); setSubmitted(true)
    sessionStorage.setItem('phase5_subphase2_step2_remedial_c1_taskB_score', c.toString())
    try { await phase5API.logRemedialActivity(2, 'C1', 'B', c, 8, 2) } catch (e) { console.error(e) }
  }
  const handleContinue = () => navigate('/phase5/subphase/2/step/2/remedial/c1/task/c')
  window.__remedialSkip = handleContinue
  const progress = ((currentIndex + 1) / 8) * 100
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: P.orange.border, mb: 1 }}>Phase 5: Execution &amp; Problem-Solving</Typography>
            <Typography variant="h5" sx={{ color: P.orange.border, mb: 1 }}>SubPhase 2 Step 2: Remedial Practice - Level C1</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border, mb: 1 }}>Task B: Instruction Odyssey</Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>Write 8 professional sentences giving advanced volunteer instructions.</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Instruction Odyssey! Write professional, sophisticated sentences giving instructions to volunteers. Each sentence must have at least 10 words and use advanced vocabulary (professionally/carefully/systematically) or sequencing/polite language." />
          </Box>
        </motion.div>
        {!submitted ? (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Box sx={{ ...clay(P.yellow), mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Question {currentIndex + 1} of 8</Typography>
                <Typography variant="body2" sx={{ color: P.blue.border, fontWeight: 'bold' }}>{Math.round(progress)}% Complete</Typography>
              </Box>
              <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 1 }} />
            </Box>
            <Box sx={{ ...clay(P.blue), mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: P.blue.border }}>{GUIDED_QUESTIONS[currentIndex].question}</Typography>
              <Box sx={{ bgcolor: P.yellow.bg, border: `1px solid ${P.yellow.border}`, borderRadius: '10px', p: 2, mb: 2 }}>
                <Typography variant="body2"><strong>Example:</strong> {GUIDED_QUESTIONS[currentIndex].example}</Typography>
              </Box>
              <TextField fullWidth multiline rows={3} variant="outlined" placeholder="Write your professional sentence here..."
                value={answers[currentIndex]} onChange={(e) => handleAnswerChange(e.target.value)} sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box component="button" onClick={handlePrevious} disabled={currentIndex === 0}
                  sx={{ ...clay(P.blue), ...hoverLift(P.blue), cursor: 'pointer', px: 3, py: 1, fontWeight: 'bold', color: P.blue.border, transition: 'all 0.15s', opacity: currentIndex === 0 ? 0.4 : 1 }}>← Previous</Box>
                {currentIndex === 7 ? (
                  <Box component="button" onClick={handleSubmit} disabled={!answers[currentIndex].trim()}
                    sx={{ ...clay(P.orange), ...hoverLift(P.orange), cursor: 'pointer', px: 3, py: 1, fontWeight: 'bold', color: P.orange.border, transition: 'all 0.15s', opacity: !answers[currentIndex].trim() ? 0.5 : 1 }}>Submit All</Box>
                ) : (
                  <Box component="button" onClick={handleNext} disabled={!answers[currentIndex].trim()}
                    sx={{ ...clay(P.blue), ...hoverLift(P.blue), cursor: 'pointer', px: 3, py: 1, fontWeight: 'bold', color: P.blue.border, transition: 'all 0.15s', opacity: !answers[currentIndex].trim() ? 0.5 : 1 }}>Next →</Box>
                )}
              </Box>
            </Box>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...clay(P.green), mb: 3, textAlign: 'center' }}>
              <Typography variant="h5" sx={{ color: P.green.border, mb: 2 }}>✓ Task B Complete!</Typography>
              <Typography variant="h6">Score: {score} / 8</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Box component="button" onClick={handleContinue}
                sx={{ ...clay(P.green), ...hoverLift(P.green), cursor: 'pointer', px: 4, py: 1.5, fontWeight: 'bold', fontSize: '1rem', color: P.green.border, transition: 'all 0.15s' }}>Next: Task C →</Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
