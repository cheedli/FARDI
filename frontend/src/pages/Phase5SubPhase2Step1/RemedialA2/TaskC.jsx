import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { resolveSubphase2RemedialNextUrl } from '../../Phase5SubPhase2/shared/routing.js'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' } }
const DARK  = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' } }
const clay  = (c) => ({ bgcolor: c.bg, border: `2px solid ${c.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${c.shadow}`, p: 3 })
const hoverLift = (c) => ({ '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${c.shadow}` } })

const EXPECTED_SENTENCES = [
  'Please welcome.',
  'First check ticket.',
  'Then guide.',
  'Be careful.',
  'Help people.',
  'Thank you.'
]

export default function Phase5SubPhase2Step1RemedialA2TaskC() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 1, interaction: 3, context: 'remedial_a2' })
  const [sentences, setSentences] = useState(['', '', '', '', '', ''])
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSentenceChange = (index, value) => {
    const newSentences = [...sentences]
    newSentences[index] = value
    setSentences(newSentences)
  }

  const calculateScore = () => {
    let correctCount = 0
    sentences.forEach((sentence, index) => {
      const userLower = sentence.toLowerCase().trim()
      const expectedLower = EXPECTED_SENTENCES[index].toLowerCase().trim()
      const expectedWords = expectedLower.split(' ')
      const matches = expectedWords.filter(word => userLower.includes(word)).length
      if (matches >= expectedWords.length * 0.6) correctCount++
    })
    return correctCount
  }

  const handleSubmit = async () => {
    const finalScore = calculateScore()
    setScore(finalScore); setSubmitted(true)
    sessionStorage.setItem('phase5_subphase2_step1_remedial_a2_taskC_score', finalScore.toString())
    try { await phase5API.logRemedialActivity(1, 'A2', 'C', finalScore, 6, 0, 2) } catch (e) { console.error(e) }
  }

  const handleContinue = async () => navigate(await resolveSubphase2RemedialNextUrl(1, 'A2'))
  window.__remedialSkip = handleContinue
  const allFilled = sentences.every(s => s.trim().length > 0)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: P.orange.border, mb: 1 }}>Phase 5: Execution &amp; Problem-Solving</Typography>
            <Typography variant="h5" sx={{ color: P.orange.border, mb: 1 }}>SubPhase 2 Step 1: Remedial Practice - Level A2</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border, mb: 1 }}>Task C: Sentence Builder</Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>Write 6 very simple instructions for volunteers</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Sentence Builder! Write 6 very simple instructions for volunteers. Use the examples as a guide, but write your own sentences." />
          </Box>
        </motion.div>

        {!submitted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2, color: P.orange.border }}>Write Simple Instructions</Typography>
            <Stack spacing={2} sx={{ mb: 3 }}>
              {EXPECTED_SENTENCES.map((example, index) => (
                <Box key={index} sx={{ ...clay(P.blue) }}>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>Example: "{example}"</Typography>
                  <TextField fullWidth variant="outlined" placeholder={`Write instruction ${index + 1}...`}
                    value={sentences[index]} onChange={(e) => handleSentenceChange(index, e.target.value)} disabled={submitted} />
                </Box>
              ))}
            </Stack>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box component="button" onClick={handleSubmit} disabled={!allFilled}
                sx={{ ...clay(P.orange), ...hoverLift(P.orange), cursor: 'pointer', px: 6, py: 1.5, fontWeight: 'bold', fontSize: '1rem', color: P.orange.border, transition: 'all 0.15s', opacity: !allFilled ? 0.5 : 1 }}>
                Submit Answers
              </Box>
            </Box>
          </motion.div>
        )}

        {submitted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...clay(P.green), mb: 3, textAlign: 'center' }}>
              <Typography variant="h5" sx={{ color: P.green.border, mb: 2 }}>✓ Task C Complete!</Typography>
              <Typography variant="h6">Score: {score} / 6</Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>{score >= 5 ? 'Excellent! Well done!' : "Good work! Let's see your final score."}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Box component="button" onClick={handleContinue}
                sx={{ ...clay(P.green), ...hoverLift(P.green), cursor: 'pointer', px: 4, py: 1.5, fontWeight: 'bold', fontSize: '1rem', color: P.green.border, transition: 'all 0.15s' }}>
                View Final Score →
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
