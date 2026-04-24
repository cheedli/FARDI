import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, LinearProgress } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { resolveSubphase2RemedialNextUrl } from '../../Phase5SubPhase2/shared/routing.js'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' } }
const DARK  = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' } }
const clay  = (c) => ({ bgcolor: c.bg, border: `2px solid ${c.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${c.shadow}`, p: 3 })
const hoverLift = (c) => ({ '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${c.shadow}` } })

const APPROACHES = [
  { id: 1, issue: 'Impolite tone', critique: 'Reduces cooperation', fix: 'Add please/thank you' },
  { id: 2, issue: 'No sequencing', critique: 'Confuses order', fix: 'Use first/then' },
  { id: 3, issue: 'Vague safety', critique: 'Risks accidents', fix: 'Be specific' },
  { id: 4, issue: 'No empathy', critique: 'Feels cold', fix: 'Show understanding' },
  { id: 5, issue: 'Missing appreciation', critique: 'Low motivation', fix: 'Thank volunteers' },
  { id: 6, issue: 'Overly complex', critique: 'Confuses non-natives', fix: 'Simplify language' }
]

export default function Phase5SubPhase2Step1RemedialC1TaskD() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 1, interaction: 4, context: 'remedial_c1' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [critiques, setCritiques] = useState(Array(6).fill(''))
  const [fixes, setFixes] = useState(Array(6).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleCritiqueChange = (value) => {
    const newCritiques = [...critiques]; newCritiques[currentIndex] = value; setCritiques(newCritiques)
  }
  const handleFixChange = (value) => {
    const newFixes = [...fixes]; newFixes[currentIndex] = value; setFixes(newFixes)
  }

  const handleNext = () => { if (currentIndex < 5) setCurrentIndex(currentIndex + 1) }
  const handlePrevious = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1) }

  const handleSubmit = async () => {
    let correctCount = 0
    APPROACHES.forEach((approach, idx) => {
      const critiqueLower = critiques[idx]?.toLowerCase() || ''
      const fixLower = fixes[idx]?.toLowerCase() || ''
      const expectedCritiqueWords = approach.critique.toLowerCase().split(' ')
      const expectedFixWords = approach.fix.toLowerCase().split(' ')
      const hasCritiqueKeyWords = expectedCritiqueWords.some(word => critiqueLower.includes(word))
      const hasFixKeyWords = expectedFixWords.some(word => fixLower.includes(word))
      if (hasCritiqueKeyWords && hasFixKeyWords) correctCount++
    })
    setScore(correctCount); setSubmitted(true)
    sessionStorage.setItem('phase5_subphase2_step1_remedial_c1_taskD_score', correctCount.toString())
    try { await phase5API.logRemedialActivity(1, 'C1', 'D', correctCount, 6, 2) } catch (e) { console.error(e) }
  }

  const handleContinue = async () => navigate(await resolveSubphase2RemedialNextUrl(1, 'C1'))
  window.__remedialSkip = handleContinue
  const progress = ((currentIndex + 1) / 6) * 100

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: P.orange.border, mb: 1 }}>Phase 5: Execution &amp; Problem-Solving</Typography>
            <Typography variant="h5" sx={{ color: P.orange.border, mb: 1 }}>SubPhase 2 Step 1: Remedial Practice - Level C1</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border, mb: 1 }}>Task D: Critique Game</Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>Critique 6 instructional approaches. Show nuanced analysis and problem-solving!</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Critique Game! For each instructional approach issue, write a critique explaining the problem and suggest a fix. Show your advanced analytical skills!" />
          </Box>
        </motion.div>

        {!submitted ? (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Box sx={{ ...clay(P.yellow), mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Approach {currentIndex + 1} of 6</Typography>
                <Typography variant="body2" sx={{ color: P.blue.border, fontWeight: 'bold' }}>{Math.round(progress)}% Complete</Typography>
              </Box>
              <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 1 }} />
            </Box>
            <Box sx={{ ...clay(P.blue), mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: P.blue.border }}>Issue: {APPROACHES[currentIndex].issue}</Typography>
              <Box sx={{ bgcolor: P.yellow.bg, border: `1px solid ${P.yellow.border}`, borderRadius: '10px', p: 2, mb: 2 }}>
                <Typography variant="body2"><strong>Expected Critique:</strong> {APPROACHES[currentIndex].critique}</Typography>
                <Typography variant="body2"><strong>Expected Fix:</strong> {APPROACHES[currentIndex].fix}</Typography>
              </Box>
              <TextField fullWidth multiline rows={2} label="Your Critique" variant="outlined"
                placeholder="Explain the problem..." value={critiques[currentIndex]}
                onChange={(e) => handleCritiqueChange(e.target.value)} sx={{ mb: 2 }} />
              <TextField fullWidth multiline rows={2} label="Your Fix" variant="outlined"
                placeholder="Suggest a solution..." value={fixes[currentIndex]}
                onChange={(e) => handleFixChange(e.target.value)} sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box component="button" onClick={handlePrevious} disabled={currentIndex === 0}
                  sx={{ ...clay(P.blue), ...hoverLift(P.blue), cursor: 'pointer', px: 3, py: 1, fontWeight: 'bold', color: P.blue.border, transition: 'all 0.15s', opacity: currentIndex === 0 ? 0.4 : 1 }}>
                  ← Previous
                </Box>
                {currentIndex === 5 ? (
                  <Box component="button" onClick={handleSubmit} disabled={!critiques[currentIndex] || !fixes[currentIndex]}
                    sx={{ ...clay(P.orange), ...hoverLift(P.orange), cursor: 'pointer', px: 3, py: 1, fontWeight: 'bold', color: P.orange.border, transition: 'all 0.15s', opacity: (!critiques[currentIndex] || !fixes[currentIndex]) ? 0.5 : 1 }}>
                    Submit All
                  </Box>
                ) : (
                  <Box component="button" onClick={handleNext} disabled={!critiques[currentIndex] || !fixes[currentIndex]}
                    sx={{ ...clay(P.blue), ...hoverLift(P.blue), cursor: 'pointer', px: 3, py: 1, fontWeight: 'bold', color: P.blue.border, transition: 'all 0.15s', opacity: (!critiques[currentIndex] || !fixes[currentIndex]) ? 0.5 : 1 }}>
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
