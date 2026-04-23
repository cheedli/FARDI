import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { resolveSubphase2RemedialNextUrl } from '../../Phase5SubPhase2/shared/routing.js'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' } }
const DARK = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' } }

const FAULTY_SENTENCES = [
  { faulty: 'Pleese welcom.', correct: 'Please welcome.' }, { faulty: 'Furst chek.', correct: 'First check.' }, { faulty: 'Then guied.', correct: 'Then guide.' },
  { faulty: 'Be cairful.', correct: 'Be careful.' }, { faulty: 'Thankk you.', correct: 'Thank you.' }, { faulty: 'Help peoples.', correct: 'Help people.' }
]

export default function Phase5SubPhase2Step5RemedialA2TaskC() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 5, interaction: 3, context: 'remedial_a2' })
  const [corrections, setCorrections] = useState(['', '', '', '', '', ''])
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleCorrectionChange = (index, value) => { const n = [...corrections]; n[index] = value; setCorrections(n) }
  const calculateScore = () => {
    let correctCount = 0
    corrections.forEach((correction, index) => { if (correction.toLowerCase().trim() === FAULTY_SENTENCES[index].correct.toLowerCase().trim()) correctCount++ })
    return correctCount
  }
  const handleSubmit = async () => {
    const finalScore = calculateScore()
    setScore(finalScore)
    setSubmitted(true)
    sessionStorage.setItem('phase5_subphase2_step5_remedial_a2_taskC_score', finalScore.toString())
    try { await phase5API.logRemedialActivity(5, 'A2', 'C', finalScore, 6, 2) } catch (error) { console.error('Failed to log task completion:', error) }
  }
  const handleContinue = async () => navigate(await resolveSubphase2RemedialNextUrl(5, 'A2'))
  const allFilled = corrections.every(c => c.trim().length > 0)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Phase 5: Execution & Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.shadow }}>SubPhase 2 Step 5: Remedial Practice - Level A2</Typography>
            <Typography variant="h6" gutterBottom sx={{ color: P.orange.shadow }}>Task C: Sentence Builder</Typography>
            <Typography variant="body1">Correct 6 grammar mistakes in simple instructions</Typography>
          </Box>
          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Sentence Builder! Correct the grammar mistakes in each faulty sentence. Write the correct version!" />
          </Box>
          {!submitted ? (
            <>
              <Stack spacing={2} sx={{ mb: 3 }}>
                {FAULTY_SENTENCES.map((item, index) => (
                  <Box key={index} sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '14px', boxShadow: `3px 3px 0 ${P.blue.shadow}`, p: 2 }}>
                    <Typography variant="body2" sx={{ color: P.red.border }} gutterBottom><strong>Faulty:</strong> {item.faulty}</Typography>
                    <TextField fullWidth variant="outlined" placeholder="Write correct sentence..." value={corrections[index]} onChange={(e) => handleCorrectionChange(index, e.target.value)} disabled={submitted} />
                  </Box>
                ))}
              </Stack>
              <Box component="button" onClick={handleSubmit} disabled={!allFilled}
                sx={{ width: '100%', bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, py: 1.5, fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', color: P.orange.shadow, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }, '&:disabled': { opacity: 0.5, cursor: 'not-allowed' }, transition: 'all 0.15s ease' }}>
                Submit Answers
              </Box>
            </>
          ) : (
            <>
              <Box sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`, p: 4, mb: 3, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ color: P.green.shadow }} gutterBottom>Task C Complete!</Typography>
                <Typography variant="h6" sx={{ mt: 2 }}>Score: {score} / 6</Typography>
              </Box>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Box component="button" onClick={handleContinue}
                  sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`, px: 4, py: 1.5, fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', color: P.green.shadow, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s ease' }}>
                  Continue to Score Calculation →
                </Box>
              </Stack>
            </>
          )}
        </motion.div>
      </Container>
    </Box>
  )
}
