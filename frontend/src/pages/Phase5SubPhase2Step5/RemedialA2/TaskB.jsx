import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import GapFillStory from '../../../components/GapFillStory.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' } }
const DARK = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' } }

const WORD_BANK = ['please', 'thank you', 'first', 'then', 'careful', 'guide', 'welcome', 'queue']
const SENTENCES = ['[Please] welcome guests.', '[First], check ticket.', '[Then], [guide] them.', 'Be [careful].', '[Welcome] nicely.', 'Watch the [queue].', 'Say [thank you].', 'Help people.']
const CORRECT_ANSWERS = { 'g_0_0': 'please', 'g_1_0': 'first', 'g_2_0': 'then', 'g_2_1': 'guide', 'g_3_0': 'careful', 'g_4_0': 'welcome', 'g_5_0': 'queue', 'g_6_0': 'thank you' }

export default function Phase5SubPhase2Step5RemedialA2TaskB() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 5, interaction: 2, context: 'remedial_a2' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerChange = (key, value) => setAnswers(prev => ({ ...prev, [key]: value }))
  const calculateScore = () => {
    let correctCount = 0
    Object.entries(CORRECT_ANSWERS).forEach(([key, correct]) => { if (answers[key]?.toLowerCase().trim() === correct.toLowerCase()) correctCount++ })
    return correctCount
  }
  const handleSubmit = async () => {
    const finalScore = calculateScore()
    setScore(finalScore)
    setSubmitted(true)
    sessionStorage.setItem('phase5_subphase2_step5_remedial_a2_taskB_score', finalScore.toString())
    try { await phase5API.logRemedialActivity(5, 'A2', 'B', finalScore, 8, 2) } catch (error) { console.error('Failed to log task completion:', error) }
  }
  const handleContinue = () => navigate('/phase5/subphase/2/step/5/remedial/a2/task/c')
  window.__remedialSkip = handleContinue
  const allFilled = Object.keys(CORRECT_ANSWERS).every(key => answers[key])

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Phase 5: Execution & Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.shadow }}>SubPhase 2 Step 5: Remedial Practice - Level A2</Typography>
            <Typography variant="h6" gutterBottom sx={{ color: P.orange.shadow }}>Task B: Fill Quest</Typography>
            <Typography variant="body1">Fill 8 spelling-corrected gaps. Fill to quest through levels!</Typography>
          </Box>
          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Fill Quest! Fill in the gaps with correctly spelled words from the word bank. Complete all sentences to advance!" />
          </Box>
          {!submitted && (
            <Box sx={{ mb: 2 }}>
              <GapFillStory templates={SENTENCES} wordBank={WORD_BANK} answers={answers} onChange={handleAnswerChange} />
            </Box>
          )}
          {!submitted && (
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
              <Box component="button" onClick={handleSubmit} disabled={!allFilled}
                sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, px: 6, py: 1.5, fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', color: P.orange.shadow, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }, '&:disabled': { opacity: 0.5, cursor: 'not-allowed' }, transition: 'all 0.15s ease' }}>
                Submit Answers
              </Box>
            </Stack>
          )}
          {submitted && (
            <>
              <Box sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`, p: 4, mb: 3, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ color: P.green.shadow }} gutterBottom>Task B Complete!</Typography>
                <Typography variant="h6" sx={{ mt: 2 }}>Score: {score} / 8</Typography>
              </Box>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Box component="button" onClick={handleContinue}
                  sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`, px: 4, py: 1.5, fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', color: P.green.shadow, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s ease' }}>
                  Next: Task C →
                </Box>
              </Stack>
            </>
          )}
        </motion.div>
      </Container>
    </Box>
  )
}
