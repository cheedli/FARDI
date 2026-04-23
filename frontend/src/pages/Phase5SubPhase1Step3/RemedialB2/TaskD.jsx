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

const TERMS = [
  { term: 'emergency', explanation: 'Sudden serious problem' },
  { term: 'contingency', explanation: 'Backup plan' },
  { term: 'backup', explanation: 'Extra equipment' },
  { term: 'announce', explanation: 'Tell everyone' },
  { term: 'update', explanation: 'Give new information' },
  { term: 'transparent', explanation: 'Honest communication' }
]

export default function Phase5Step3RemedialB2TaskD() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 3, interaction: 4, context: 'remedial_b2' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [spellings, setSpellings] = useState(Array(6).fill(''))
  const [explanations, setExplanations] = useState(Array(6).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })

  const handleSpellingChange = (value) => { const n = [...spellings]; n[currentIndex] = value; setSpellings(n) }
  const handleExplanationChange = (value) => { const n = [...explanations]; n[currentIndex] = value; setExplanations(n) }
  const handleNext = () => { if (currentIndex < 5) setCurrentIndex(currentIndex + 1) }
  const handlePrevious = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1) }

  const handleSubmit = async () => {
    let correctCount = 0
    TERMS.forEach((term, idx) => {
      const spellingCorrect = spellings[idx].toLowerCase().trim() === term.term.toLowerCase()
      const explanationCorrect = explanations[idx].toLowerCase().includes(term.explanation.toLowerCase().split(' ')[0])
      if (spellingCorrect && explanationCorrect) correctCount++
    })
    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_step3_remedial_b2_taskD_score', correctCount.toString())
    try { await phase5API.logRemedialActivity(3, 'B2', 'D', correctCount, 6, 0) } catch (e) { console.error(e) }
  }

  const handleContinue = async () => {
    const taskAScore = parseInt(sessionStorage.getItem('phase5_step3_remedial_b2_taskA_score') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('phase5_step3_remedial_b2_taskB_score') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('phase5_step3_remedial_b2_taskC_score') || '0')
    const taskDScore = parseInt(sessionStorage.getItem('phase5_step3_remedial_b2_taskD_score') || '0')
    let nextUrl = '/phase5/subphase/1/step/3/remedial/b2/task/a'
    try {
      const result = await phase5API.calculateRemedialScore(3, 'B2', {
        task_a_score: taskAScore,
        task_b_score: taskBScore,
        task_c_score: taskCScore,
        task_d_score: taskDScore
      })
      nextUrl = result?.data?.next_url || nextUrl
    } catch (e) {
      console.error(e)
    }
    navigate(nextUrl)
  }

  const progress = ((currentIndex + 1) / 6) * 100
  const currentFilled = spellings[currentIndex].trim() && explanations[currentIndex].trim()

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Phase 5: Execution &amp; Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 3: Remedial Practice - Level B2</Typography>
            <Typography variant="h6" gutterBottom sx={{ color: P.orange.border }}>Task D: Spell Quest</Typography>
            <Typography variant="body1" color="text.secondary">Spell and explain 6 terms</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Spell Quest! Spell each term correctly and explain what it means!" />
          </Box>
        </motion.div>
        {!submitted ? (
          <>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Box sx={{ ...cardSx(P.yellow), mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Term {currentIndex + 1} of 6</Typography>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: P.yellow.border }}>{Math.round(progress)}% Complete</Typography>
                </Box>
                <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
              </Box>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
                <Box sx={{ ...cardSx(P.teal), mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <InfoIcon sx={{ color: P.teal.border, mr: 1, fontSize: 18 }} />
                    <Typography variant="body2" sx={{ color: P.teal.border }}><strong>Expected explanation:</strong> {TERMS[currentIndex].explanation}</Typography>
                  </Box>
                </Box>
                <TextField fullWidth label="Spell the term" variant="outlined" value={spellings[currentIndex]} onChange={(e) => handleSpellingChange(e.target.value)} sx={{ mb: 2 }} />
                <TextField fullWidth multiline rows={2} label="Explain the term" variant="outlined" value={explanations[currentIndex]} onChange={(e) => handleExplanationChange(e.target.value)} sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box component="button" onClick={handlePrevious} disabled={currentIndex === 0} sx={{ flex: 1, bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`, py: 1.5, cursor: currentIndex === 0 ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '0.9rem', color: P.yellow.border, opacity: currentIndex === 0 ? 0.5 : 1, transition: 'all 0.15s ease' }}>← Previous</Box>
                  {currentIndex === 5 ? (
                    <Box component="button" onClick={handleSubmit} disabled={!currentFilled} sx={{ flex: 2, bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, py: 1.5, cursor: !currentFilled ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '0.9rem', color: P.orange.border, opacity: !currentFilled ? 0.5 : 1, '&:hover': currentFilled ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {}, transition: 'all 0.15s ease' }}>Submit All</Box>
                  ) : (
                    <Box component="button" onClick={handleNext} disabled={!currentFilled} sx={{ flex: 2, bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, py: 1.5, cursor: !currentFilled ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '0.9rem', color: P.blue.border, opacity: !currentFilled ? 0.5 : 1, '&:hover': currentFilled ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` } : {}, transition: 'all 0.15s ease' }}>Next →</Box>
                  )}
                </Box>
              </Box>
            </motion.div>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), mb: 3, textAlign: 'center' }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.green.border }}>Task D Complete!</Typography>
              <Typography variant="h6" sx={{ mt: 2 }} color="text.secondary">Score: {score} / 6</Typography>
            </Box>
            <Box component="button" onClick={handleContinue} sx={{ width: '100%', bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`, py: 1.5, cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', color: P.green.border, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s ease' }}>
              Continue to Final Results →
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
