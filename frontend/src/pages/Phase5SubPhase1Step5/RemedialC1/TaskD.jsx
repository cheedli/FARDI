import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, Stack, LinearProgress, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' } }
const DARK = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' } }

const CRITIQUE_ITEMS = [
  { id: 1, element: 'Panic tone', critique: 'Escalates anxiety; fix: Adopt calm, reassuring tone.' },
  { id: 2, element: 'Vague timeline', critique: 'Increases uncertainty; fix: Provide specific ETA.' },
  { id: 3, element: 'Missing reassurance', critique: 'Erodes trust; fix: Include "thank you for your patience".' },
  { id: 4, element: 'Overly technical jargon', critique: 'Confuses audience; fix: Use clear language.' },
  { id: 5, element: 'No stakeholder differentiation', critique: 'Ineffective; fix: Tailor messages (audience vs sponsors).' },
  { id: 6, element: 'Weak closing', critique: 'Leaves negative impression; fix: End positively with commitment.' }
]

export default function Phase5Step5RemedialC1TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 5, interaction: 4, context: 'remedial_c1' })
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const [currentIndex, setCurrentIndex] = useState(0)
  const [critiques, setCritiques] = useState(Array(6).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const clay = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })
  const handleCritiqueChange = (value) => { const c = [...critiques]; c[currentIndex] = value; setCritiques(c) }
  const handleNext = () => { if (currentIndex < 5) setCurrentIndex(currentIndex + 1) }
  const handlePrevious = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1) }

  const handleSubmit = async () => {
    let correctCount = 0
    critiques.forEach((critique, idx) => {
      const words = critique.trim().split(/\s+/).filter(w => w.length > 0)
      const expectedWords = CRITIQUE_ITEMS[idx].critique.toLowerCase().split(' ')
      const hasKeyWords = expectedWords.slice(0, 3).some(word => critique.toLowerCase().includes(word))
      if (words.length >= 10 && hasKeyWords) correctCount++
    })
    setScore(correctCount); setSubmitted(true)
    sessionStorage.setItem('phase5_step5_remedial_c1_taskD_score', correctCount.toString())
    try { await phase5API.logRemedialActivity(5, 'C1', 'D', correctCount, 6, 0) } catch (e) { console.error(e) }
  }

  const handleContinue = async () => {
    const a = parseInt(sessionStorage.getItem('phase5_step5_remedial_c1_taskA_score') || '0')
    const b = parseInt(sessionStorage.getItem('phase5_step5_remedial_c1_taskB_score') || '0')
    const c = parseInt(sessionStorage.getItem('phase5_step5_remedial_c1_taskC_score') || '0')
    const d = parseInt(sessionStorage.getItem('phase5_step5_remedial_c1_taskD_score') || '0')
    let nextUrl = '/phase5/subphase/1/step/5/remedial/c1/task/a'
    try {
      const result = await phase5API.calculateRemedialScore(5, 'C1', { task_a_score: a, task_b_score: b, task_c_score: c, task_d_score: d })
      nextUrl = result?.data?.next_url || nextUrl
    } catch (e) {
      console.error(e)
    }
    navigate(nextUrl)
  }

  const progress = ((currentIndex + 1) / 6) * 100

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Phase 5: Execution & Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 5: Remedial Practice - Level C1</Typography>
            <Typography variant="h6" gutterBottom sx={{ color: P.orange.border }}>Task D: Critique Kahoot</Typography>
            <Typography variant="body1">Critique/fix 6 advanced error types in crisis texts</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...clay(P.teal), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Critique Kahoot! Provide nuanced critiques for each error type, showing both the problem and the solution!" />
          </Box>
        </motion.div>
        {!submitted ? (
          <>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Box sx={{ ...clay(P.blue), mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Element {currentIndex + 1} of 6</Typography>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: P.blue.border }}>{Math.round(progress)}% Complete</Typography>
                </Box>
                <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 1 }} />
              </Box>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Box sx={{ ...clay(P.blue), mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ color: P.blue.border }}>Error Element: {CRITIQUE_ITEMS[currentIndex].element}</Typography>
                <Box sx={{ bgcolor: P.blue.bg, border: `1px solid ${P.blue.border}`, borderRadius: '12px', p: 2, mb: 2 }}>
                  <Typography variant="body2"><strong>Example critique:</strong> {CRITIQUE_ITEMS[currentIndex].critique}</Typography>
                </Box>
                <TextField fullWidth multiline rows={4} variant="outlined" placeholder="Write your nuanced critique here (10+ words, explain problem and solution)..." value={critiques[currentIndex]} onChange={(e) => handleCritiqueChange(e.target.value)} sx={{ mb: 2 }} />
                <Stack direction="row" spacing={2} justifyContent="space-between">
                  <Box component="button" onClick={handlePrevious} disabled={currentIndex === 0} sx={{ ...clay(P.blue), cursor: 'pointer', opacity: currentIndex === 0 ? 0.5 : 1, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` }, transition: 'all 0.15s' }}>
                    <Typography variant="button" sx={{ color: P.blue.border }}>← Previous</Typography>
                  </Box>
                  {currentIndex === 5 ? (
                    <Box component="button" onClick={handleSubmit} disabled={!critiques[currentIndex].trim()} sx={{ ...clay(P.orange), cursor: 'pointer', opacity: !critiques[currentIndex].trim() ? 0.6 : 1, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }, transition: 'all 0.15s' }}>
                      <Typography variant="button" fontWeight="bold" sx={{ color: P.orange.border }}>Submit All</Typography>
                    </Box>
                  ) : (
                    <Box component="button" onClick={handleNext} disabled={!critiques[currentIndex].trim()} sx={{ ...clay(P.orange), cursor: 'pointer', opacity: !critiques[currentIndex].trim() ? 0.6 : 1, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }, transition: 'all 0.15s' }}>
                      <Typography variant="button" fontWeight="bold" sx={{ color: P.orange.border }}>Next →</Typography>
                    </Box>
                  )}
                </Stack>
              </Box>
            </motion.div>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...clay(P.green), mb: 3, textAlign: 'center' }}>
              <Typography variant="h5" sx={{ color: P.green.border }} gutterBottom>✓ Task D Complete!</Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>Score: {score} / 6</Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>All C1 remedial tasks completed! Calculating final score...</Typography>
            </Box>
            <Box component="button" onClick={handleContinue} sx={{ ...clay(P.green), cursor: 'pointer', width: '100%', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s' }}>
              <Typography variant="button" fontWeight="bold" sx={{ color: P.green.border }}>Continue to Final Results →</Typography>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
