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
  { id: 1, question: 'Welcome guests?', example: 'Please welcome guests with a smile.' },
  { id: 2, question: 'Check ticket?', example: 'First, check their ticket.' },
  { id: 3, question: 'Guide way?', example: 'Then, guide them to booths.' },
  { id: 4, question: 'Be careful?', example: 'Be careful with queues.' },
  { id: 5, question: 'Help people?', example: 'Help people if they ask.' },
  { id: 6, question: 'Thank you?', example: 'Say thank you at the end.' }
]

export default function Phase5SubPhase2Step3RemedialB1TaskB() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 3, interaction: 2, context: 'remedial_b1' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState(Array(6).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const handleAnswerChange = (value) => { const a = [...answers]; a[currentIndex] = value; setAnswers(a) }
  const handleNext = () => { if (currentIndex < 5) setCurrentIndex(currentIndex + 1) }
  const handlePrevious = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1) }
  const handleSubmit = async () => {
    let c = 0
    answers.forEach(a => {
      const w = a.trim().split(/\s+/).filter(x => x.length > 0), l = a.toLowerCase()
      const hp = l.includes('please') || l.includes('thank you'), hs = l.includes('first') || l.includes('then')
      if (w.length >= 5 && (hp || hs)) c++
    })
    setScore(c); setSubmitted(true)
    sessionStorage.setItem('phase5_subphase2_step3_remedial_b1_taskB_score', c.toString())
    try { await phase5API.logRemedialActivity(3, 'B1', 'B', c, 6, 2) } catch (e) { console.error(e) }
  }
  const handleContinue = () => navigate('/phase5/subphase/2/step/3/remedial/b1/task/c')
  window.__remedialSkip = handleContinue
  const progress = ((currentIndex + 1) / 6) * 100
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: P.orange.border, mb: 1 }}>Phase 5: Execution &amp; Problem-Solving</Typography>
            <Typography variant="h5" sx={{ color: P.orange.border, mb: 1 }}>SubPhase 2 Step 3: Remedial Practice - Level B1</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border, mb: 1 }}>Task B: Instruction Builder</Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>Write 6 sentences giving instructions to volunteers.</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Instruction Builder! Write sentences giving instructions to volunteers. Each sentence should have at least 5 words and use polite language (please/thank you) or sequencing words (first/then)." />
          </Box>
        </motion.div>
        {!submitted ? (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Box sx={{ ...clay(P.yellow), mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Question {currentIndex + 1} of 6</Typography>
                <Typography variant="body2" sx={{ color: P.blue.border, fontWeight: 'bold' }}>{Math.round(progress)}% Complete</Typography>
              </Box>
              <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 1 }} />
            </Box>
            <Box sx={{ ...clay(P.blue), mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: P.blue.border }}>{GUIDED_QUESTIONS[currentIndex].question}</Typography>
              <Box sx={{ bgcolor: P.yellow.bg, border: `1px solid ${P.yellow.border}`, borderRadius: '10px', p: 2, mb: 2 }}>
                <Typography variant="body2"><strong>Example:</strong> {GUIDED_QUESTIONS[currentIndex].example}</Typography>
              </Box>
              <TextField fullWidth multiline rows={3} variant="outlined" placeholder="Write your sentence here..."
                value={answers[currentIndex]} onChange={(e) => handleAnswerChange(e.target.value)} sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box component="button" onClick={handlePrevious} disabled={currentIndex === 0}
                  sx={{ ...clay(P.blue), ...hoverLift(P.blue), cursor: 'pointer', px: 3, py: 1, fontWeight: 'bold', color: P.blue.border, transition: 'all 0.15s', opacity: currentIndex === 0 ? 0.4 : 1 }}>← Previous</Box>
                {currentIndex === 5 ? (
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
              <Typography variant="h6">Score: {score} / 6</Typography>
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
