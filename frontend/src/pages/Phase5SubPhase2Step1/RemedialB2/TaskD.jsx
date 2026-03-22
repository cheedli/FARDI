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

const TERMS = [
  { id: 1, term: 'please', explanation: 'Polite request' },
  { id: 2, term: 'thank you', explanation: 'Show thanks' },
  { id: 3, term: 'careful', explanation: 'Be safe' },
  { id: 4, term: 'guide', explanation: 'Show way' },
  { id: 5, term: 'welcome', explanation: 'Greet nicely' },
  { id: 6, term: 'queue', explanation: 'Line of people' }
]

export default function Phase5SubPhase2Step1RemedialB2TaskD() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 1, interaction: 4, context: 'remedial_b2' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [spellings, setSpellings] = useState(Array(6).fill(''))
  const [explanations, setExplanations] = useState(Array(6).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSpellingChange = (value) => {
    const newSpellings = [...spellings]; newSpellings[currentIndex] = value; setSpellings(newSpellings)
  }
  const handleExplanationChange = (value) => {
    const newExplanations = [...explanations]; newExplanations[currentIndex] = value; setExplanations(newExplanations)
  }

  const handleNext = () => { if (currentIndex < 5) setCurrentIndex(currentIndex + 1) }
  const handlePrevious = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1) }

  const handleSubmit = async () => {
    let correctCount = 0
    TERMS.forEach((term, idx) => {
      const spellingMatch = spellings[idx]?.toLowerCase().trim() === term.term.toLowerCase()
      const explanationLower = explanations[idx]?.toLowerCase() || ''
      const hasKeyWords = term.explanation.toLowerCase().split(' ').some(word => explanationLower.includes(word))
      if (spellingMatch && hasKeyWords) correctCount++
    })
    setScore(correctCount); setSubmitted(true)
    sessionStorage.setItem('phase5_subphase2_step1_remedial_b2_taskD_score', correctCount.toString())
    try { await phase5API.logRemedialActivity(1, 'B2', 'D', correctCount, 6, 2) } catch (e) { console.error(e) }
  }

  const handleContinue = () => navigate('/phase5/subphase/2/step/2')
  const progress = ((currentIndex + 1) / 6) * 100

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: P.orange.border, mb: 1 }}>Phase 5: Execution &amp; Problem-Solving</Typography>
            <Typography variant="h5" sx={{ color: P.orange.border, mb: 1 }}>SubPhase 2 Step 1: Remedial Practice - Level B2</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border, mb: 1 }}>Task D: Spelling &amp; Explain</Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>Spell and explain 6 instruction words. Show your understanding!</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Spelling & Explain! For each term, spell it correctly and write an explanation of what it means. Use the example explanations as a guide!" />
          </Box>
        </motion.div>

        {!submitted ? (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Box sx={{ ...clay(P.yellow), mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Term {currentIndex + 1} of 6</Typography>
                <Typography variant="body2" sx={{ color: P.blue.border, fontWeight: 'bold' }}>{Math.round(progress)}% Complete</Typography>
              </Box>
              <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 1 }} />
            </Box>
            <Box sx={{ ...clay(P.blue), mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: P.blue.border }}>Term {currentIndex + 1}: {TERMS[currentIndex].term}</Typography>
              <Box sx={{ bgcolor: P.yellow.bg, border: `1px solid ${P.yellow.border}`, borderRadius: '10px', p: 2, mb: 2 }}>
                <Typography variant="body2"><strong>Example Explanation:</strong> {TERMS[currentIndex].explanation}</Typography>
              </Box>
              <TextField fullWidth label="Spell the word" variant="outlined" value={spellings[currentIndex]}
                onChange={(e) => handleSpellingChange(e.target.value)} sx={{ mb: 2 }} />
              <TextField fullWidth multiline rows={3} label="Explain what it means" variant="outlined"
                value={explanations[currentIndex]} onChange={(e) => handleExplanationChange(e.target.value)} sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box component="button" onClick={handlePrevious} disabled={currentIndex === 0}
                  sx={{ ...clay(P.blue), ...hoverLift(P.blue), cursor: 'pointer', px: 3, py: 1, fontWeight: 'bold', color: P.blue.border, transition: 'all 0.15s', opacity: currentIndex === 0 ? 0.4 : 1 }}>
                  ← Previous
                </Box>
                {currentIndex === 5 ? (
                  <Box component="button" onClick={handleSubmit} disabled={!spellings[currentIndex] || !explanations[currentIndex]}
                    sx={{ ...clay(P.orange), ...hoverLift(P.orange), cursor: 'pointer', px: 3, py: 1, fontWeight: 'bold', color: P.orange.border, transition: 'all 0.15s', opacity: (!spellings[currentIndex] || !explanations[currentIndex]) ? 0.5 : 1 }}>
                    Submit All
                  </Box>
                ) : (
                  <Box component="button" onClick={handleNext} disabled={!spellings[currentIndex] || !explanations[currentIndex]}
                    sx={{ ...clay(P.blue), ...hoverLift(P.blue), cursor: 'pointer', px: 3, py: 1, fontWeight: 'bold', color: P.blue.border, transition: 'all 0.15s', opacity: (!spellings[currentIndex] || !explanations[currentIndex]) ? 0.5 : 1 }}>
                    Next →
                  </Box>
                )}
              </Box>
            </Box>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...clay(P.green), mb: 3, textAlign: 'center' }}>
              <Typography variant="h5" sx={{ color: P.green.border, mb: 2 }}>✓ Task D Complete!</Typography>
              <Typography variant="h6">Score: {score} / 6</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Box component="button" onClick={handleContinue}
                sx={{ ...clay(P.green), ...hoverLift(P.green), cursor: 'pointer', px: 4, py: 1.5, fontWeight: 'bold', fontSize: '1rem', color: P.green.border, transition: 'all 0.15s' }}>
                Continue to Step 2 →
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
