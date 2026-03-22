import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, TextField, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
}

const TERMS = [
  { term: 'please', explanation: 'Polite request' },
  { term: 'thank you', explanation: 'Show appreciation' },
  { term: 'careful', explanation: 'Be safe' },
  { term: 'guide', explanation: 'Show direction' },
  { term: 'welcome', explanation: 'Greet warmly' },
  { term: 'queue', explanation: 'Waiting line' }
]

export default function Phase5SubPhase2Step3RemedialB2TaskD() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 3, interaction: 4, context: 'remedial_b2' })
  const [spellings, setSpellings] = useState(Array(6).fill(''))
  const [explanations, setExplanations] = useState(Array(6).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSpellingChange = (index, value) => {
    const newSpellings = [...spellings]
    newSpellings[index] = value
    setSpellings(newSpellings)
  }

  const handleExplanationChange = (index, value) => {
    const newExplanations = [...explanations]
    newExplanations[index] = value
    setExplanations(newExplanations)
  }

  const handleSubmit = async () => {
    let correctCount = 0
    TERMS.forEach((term, idx) => {
      const spellingCorrect = spellings[idx].toLowerCase().trim() === term.term.toLowerCase()
      const explanationFilled = explanations[idx].trim().length > 0
      if (spellingCorrect && explanationFilled) correctCount++
    })
    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase5_subphase2_step3_remedial_b2_taskD_score', correctCount.toString())
    try {
      await phase5API.logRemedialActivity(3, 'B2', 'D', correctCount, 6, 2)
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/2/step/4')
  }

  const allFilled = spellings.every(s => s.trim()) && explanations.every(e => e.trim())

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{
            bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
            p: 3, mb: 3
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Phase 5: Execution & Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.shadow }}>SubPhase 2 Step 3: Remedial Practice - Level B2</Typography>
            <Typography variant="h6" gutterBottom fontWeight="bold">Task D: Spell Quest</Typography>
            <Typography variant="body1">Spell and explain 6 instruction terms</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3
          }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Spell Quest! Spell each term correctly and write a short explanation. Use the example explanations as a guide!" />
          </Box>
        </motion.div>

        {!submitted ? (
          <>
            <Stack spacing={3} sx={{ mb: 3 }}>
              {TERMS.map((term, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * idx }}>
                  <Box sx={{
                    bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                    borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
                    p: 3
                  }}>
                    <Typography variant="h6" gutterBottom sx={{ color: P.blue.border }}>Term {idx + 1}</Typography>
                    <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '12px', p: 2, mb: 2 }}>
                      <Typography variant="body2">Example explanation: "{term.explanation}"</Typography>
                    </Box>
                    <TextField
                      fullWidth label="Spell the term" variant="outlined"
                      value={spellings[idx]} onChange={(e) => handleSpellingChange(idx, e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth multiline rows={2} label="Explain what it means" variant="outlined"
                      value={explanations[idx]} onChange={(e) => handleExplanationChange(idx, e.target.value)}
                    />
                  </Box>
                </motion.div>
              ))}
            </Stack>
            <Box
              component="button" onClick={handleSubmit} disabled={!allFilled}
              sx={{
                bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                borderRadius: '14px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
                px: 4, py: 1.5, fontSize: '1rem', fontWeight: 'bold',
                color: P.blue.border, cursor: allFilled ? 'pointer' : 'not-allowed',
                opacity: allFilled ? 1 : 0.5, width: '100%',
                transition: 'all 0.15s',
                '&:hover': allFilled ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` } : {}
              }}
            >Submit Answers</Box>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{
              bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
              p: 4, mb: 3, textAlign: 'center'
            }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.green.shadow }} gutterBottom>✓ Task D Complete!</Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>Score: {score} / 6</Typography>
            </Box>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Box
                component="button" onClick={handleContinue}
                sx={{
                  bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                  borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
                  px: 4, py: 1.5, fontSize: '1rem', fontWeight: 'bold',
                  color: P.green.shadow, cursor: 'pointer',
                  transition: 'all 0.15s',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }
                }}
              >Continue to Step 4 →</Box>
            </Stack>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
