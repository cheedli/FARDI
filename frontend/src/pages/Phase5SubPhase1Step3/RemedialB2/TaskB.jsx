import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, LinearProgress } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import InfoIcon from '@mui/icons-material/Info'
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

const GUIDED_QUESTIONS = [
  { id: 1, question: 'Emergency identification.', example: 'Quickly identify the problem (e.g., lighting failure).' },
  { id: 2, question: 'Contingency activation.', example: 'Activate backup plan immediately.' },
  { id: 3, question: 'Transparent announcement.', example: 'Announce clearly to audience.' },
  { id: 4, question: 'Frequent updates.', example: 'Provide regular updates.' },
  { id: 5, question: 'Stakeholder communication.', example: 'Inform sponsors and team.' },
  { id: 6, question: 'Calm tone.', example: 'Use calm language to reassure.' },
  { id: 7, question: 'Resolution steps.', example: 'Explain how we fix it.' },
  { id: 8, question: 'Learning outcome.', example: 'Reflect for future prevention.' }
]

export default function Phase5Step3RemedialB2TaskB() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 3, interaction: 2, context: 'remedial_b2' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState(Array(8).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })

  const handleAnswerChange = (value) => { const n = [...answers]; n[currentIndex] = value; setAnswers(n) }
  const handleNext = () => { if (currentIndex < 7) setCurrentIndex(currentIndex + 1) }
  const handlePrevious = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1) }

  const handleSubmit = async () => {
    let correctCount = 0
    answers.forEach(answer => { if (answer.trim().split(/\s+/).filter(w => w.length > 0).length >= 8) correctCount++ })
    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_step3_remedial_b2_taskB_score', correctCount.toString())
    try { await phase5API.logRemedialActivity(3, 'B2', 'B', correctCount, 8, 0) } catch (e) { console.error(e) }
  }

  const handleContinue = () => { navigate('/phase5/subphase/1/step/3/remedial/b2/task/c') }
  window.__remedialSkip = handleContinue

  const progress = ((currentIndex + 1) / 8) * 100

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Phase 5: Execution &amp; Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 3: Remedial Practice - Level B2</Typography>
            <Typography variant="h6" gutterBottom sx={{ color: P.orange.border }}>Task B: Explain Expedition</Typography>
            <Typography variant="body1" color="text.secondary">Write an 8-sentence explanation of crisis communication elements</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome! Write an 8-sentence explanation with B2 structure. Each sentence should be 8+ words. Expedition through explanations!" />
          </Box>
        </motion.div>
        {!submitted ? (
          <>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Box sx={{ ...cardSx(P.yellow), mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Sentence {currentIndex + 1} of 8</Typography>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: P.yellow.border }}>{Math.round(progress)}% Complete</Typography>
                </Box>
                <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
              </Box>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>{GUIDED_QUESTIONS[currentIndex].question}</Typography>
                <Box sx={{ ...cardSx(P.teal), mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <InfoIcon sx={{ color: P.teal.border, mr: 1, fontSize: 18 }} />
                    <Typography variant="body2" sx={{ color: P.teal.border }}><strong>Example:</strong> {GUIDED_QUESTIONS[currentIndex].example}</Typography>
                  </Box>
                </Box>
                <TextField fullWidth multiline rows={3} variant="outlined" placeholder="Write your sentence here (8+ words)..." value={answers[currentIndex]} onChange={(e) => handleAnswerChange(e.target.value)} sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box component="button" onClick={handlePrevious} disabled={currentIndex === 0} sx={{ flex: 1, bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`, py: 1.5, cursor: currentIndex === 0 ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '0.9rem', color: P.yellow.border, opacity: currentIndex === 0 ? 0.5 : 1, transition: 'all 0.15s ease' }}>← Previous</Box>
                  {currentIndex === 7 ? (
                    <Box component="button" onClick={handleSubmit} disabled={!answers[currentIndex].trim()} sx={{ flex: 2, bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, py: 1.5, cursor: !answers[currentIndex].trim() ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '0.9rem', color: P.orange.border, opacity: !answers[currentIndex].trim() ? 0.5 : 1, '&:hover': answers[currentIndex].trim() ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {}, transition: 'all 0.15s ease' }}>Submit All</Box>
                  ) : (
                    <Box component="button" onClick={handleNext} disabled={!answers[currentIndex].trim()} sx={{ flex: 2, bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, py: 1.5, cursor: !answers[currentIndex].trim() ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '0.9rem', color: P.blue.border, opacity: !answers[currentIndex].trim() ? 0.5 : 1, '&:hover': answers[currentIndex].trim() ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` } : {}, transition: 'all 0.15s ease' }}>Next →</Box>
                  )}
                </Box>
              </Box>
            </motion.div>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), mb: 3, textAlign: 'center' }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.green.border }}>Task B Complete!</Typography>
              <Typography variant="h6" sx={{ mt: 2 }} color="text.secondary">Score: {score} / 8</Typography>
            </Box>
            <Box component="button" onClick={handleContinue} sx={{ width: '100%', bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`, py: 1.5, cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', color: P.green.border, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s ease' }}>
              Next: Task C →
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
