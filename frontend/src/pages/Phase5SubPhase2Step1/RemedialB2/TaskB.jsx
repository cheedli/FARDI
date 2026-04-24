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
  { id: 1, question: 'Welcome step', example: 'First, warmly welcome guests.' },
  { id: 2, question: 'Ticket check', example: 'Then, politely check tickets.' },
  { id: 3, question: 'Direct to booths', example: 'Guide them to the correct booth.' },
  { id: 4, question: 'Safety reminder', example: 'Remind everyone to be careful.' },
  { id: 5, question: 'Offer help', example: 'Offer help if they have questions.' },
  { id: 6, question: 'Manage queue', example: 'Keep the queue organized.' },
  { id: 7, question: 'Thank them', example: 'Thank guests for coming.' },
  { id: 8, question: 'Final note', example: 'Smile and stay positive.' }
]

export default function Phase5SubPhase2Step1RemedialB2TaskB() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 1, interaction: 2, context: 'remedial_b2' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState(Array(8).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerChange = (value) => {
    const newAnswers = [...answers]
    newAnswers[currentIndex] = value
    setAnswers(newAnswers)
  }

  const handleNext = () => { if (currentIndex < 7) setCurrentIndex(currentIndex + 1) }
  const handlePrevious = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1) }

  const handleSubmit = async () => {
    let correctCount = 0
    answers.forEach(answer => {
      const words = answer.trim().split(/\s+/).filter(w => w.length > 0)
      const lowerAnswer = answer.toLowerCase()
      const hasSequencing = lowerAnswer.includes('first') || lowerAnswer.includes('then') || lowerAnswer.includes('after')
      const hasPolite = lowerAnswer.includes('please') || lowerAnswer.includes('thank you')
      if (words.length >= 8 && hasSequencing && hasPolite) correctCount++
    })
    setScore(correctCount); setSubmitted(true)
    sessionStorage.setItem('phase5_subphase2_step1_remedial_b2_taskB_score', correctCount.toString())
    try { await phase5API.logRemedialActivity(1, 'B2', 'B', correctCount, 8, 2) } catch (e) { console.error(e) }
  }

  const handleContinue = () => navigate('/phase5/subphase/2/step/1/remedial/b2/task/c')
  window.__remedialSkip = handleContinue
  const progress = ((currentIndex + 1) / 8) * 100

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: P.orange.border, mb: 1 }}>Phase 5: Execution &amp; Problem-Solving</Typography>
            <Typography variant="h5" sx={{ color: P.orange.border, mb: 1 }}>SubPhase 2 Step 1: Remedial Practice - Level B2</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border, mb: 1 }}>Task B: Instruction Odyssey</Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>Write an 8-sentence set of instructions for one volunteer role. Create clear, polite, well-sequenced instructions!</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Instruction Odyssey! Write 8 sentences giving detailed instructions to volunteers. Each sentence should have at least 8 words, use sequencing words (first, then, after), and include polite language (please, thank you)." />
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
              <TextField fullWidth multiline rows={4} variant="outlined" placeholder="Write your sentence here..."
                value={answers[currentIndex]} onChange={(e) => handleAnswerChange(e.target.value)} sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box component="button" onClick={handlePrevious} disabled={currentIndex === 0}
                  sx={{ ...clay(P.blue), ...hoverLift(P.blue), cursor: 'pointer', px: 3, py: 1, fontWeight: 'bold', color: P.blue.border, transition: 'all 0.15s', opacity: currentIndex === 0 ? 0.4 : 1 }}>
                  ← Previous
                </Box>
                {currentIndex === 7 ? (
                  <Box component="button" onClick={handleSubmit} disabled={!answers[currentIndex].trim()}
                    sx={{ ...clay(P.orange), ...hoverLift(P.orange), cursor: 'pointer', px: 3, py: 1, fontWeight: 'bold', color: P.orange.border, transition: 'all 0.15s', opacity: !answers[currentIndex].trim() ? 0.5 : 1 }}>
                    Submit All
                  </Box>
                ) : (
                  <Box component="button" onClick={handleNext} disabled={!answers[currentIndex].trim()}
                    sx={{ ...clay(P.blue), ...hoverLift(P.blue), cursor: 'pointer', px: 3, py: 1, fontWeight: 'bold', color: P.blue.border, transition: 'all 0.15s', opacity: !answers[currentIndex].trim() ? 0.5 : 1 }}>
                    Next →
                  </Box>
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
                sx={{ ...clay(P.green), ...hoverLift(P.green), cursor: 'pointer', px: 4, py: 1.5, fontWeight: 'bold', fontSize: '1rem', color: P.green.border, transition: 'all 0.15s' }}>
                Next: Task C →
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
