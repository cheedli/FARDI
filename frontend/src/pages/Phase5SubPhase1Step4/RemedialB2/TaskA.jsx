import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import GapFillStory from '../../../components/GapFillStory.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' } }
const DARK = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' } }

const WORD_BANK_ORIGINAL = ['emergency', 'backup', 'announce', 'update', 'transparent']

const SENTENCES = [
  'Ms. Mabrouki: Lights fail?',
  'You: It is [emergency].',
  'SKANDER: What now?',
  'You: Use [backup] and [announce] with [transparent] [update].'
]

const CORRECT_ANSWERS = {
  'g_1_0': 'emergency',
  'g_3_0': 'backup',
  'g_3_1': 'announce',
  'g_3_2': 'transparent',
  'g_3_3': 'update'
}

export default function Phase5Step4RemedialB2TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 4, interaction: 1, context: 'remedial_b2' })
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const shuffledWordBank = useMemo(() => {
    return [...WORD_BANK_ORIGINAL].sort(() => Math.random() - 0.5)
  }, [])

  const clay = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })

  const handleAnswerChange = (key, value) => { setAnswers(prev => ({ ...prev, [key]: value })) }

  const calculateScore = () => {
    let correctCount = 0
    Object.entries(CORRECT_ANSWERS).forEach(([key, correct]) => {
      if (answers[key]?.toLowerCase().trim() === correct.toLowerCase()) correctCount++
    })
    return correctCount
  }

  const handleSubmit = async () => {
    const finalScore = calculateScore()
    setScore(finalScore); setSubmitted(true)
    sessionStorage.setItem('phase5_step4_remedial_b2_taskA_score', finalScore.toString())
    try { await phase5API.logRemedialActivity(4, 'B2', 'A', finalScore, 5, 0) } catch (e) { console.error(e) }
  }

  const handleContinue = () => { navigate('/phase5/subphase/1/step/4/remedial/b2/task/b') }
  const allFilled = Object.keys(CORRECT_ANSWERS).every(key => answers[key])

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Phase 5: Execution & Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 4: Remedial Practice - Level B2</Typography>
            <Typography variant="h6" gutterBottom sx={{ color: P.orange.border }}>Task A: Role-Play Dialogue</Typography>
            <Typography variant="body1">Complete dialogue handling crisis</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...clay(P.teal), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Role-Play Dialogue! Complete the crisis dialogue by filling in the gaps!" />
          </Box>
        </motion.div>
        {!submitted ? (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Box sx={{ ...clay(P.blue), mb: 3 }}>
              <GapFillStory templates={SENTENCES} wordBank={shuffledWordBank} answers={answers} onChange={handleAnswerChange} />
              <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
                <Box component="button" onClick={handleSubmit} disabled={!allFilled} sx={{ ...clay(P.orange), cursor: 'pointer', opacity: !allFilled ? 0.6 : 1, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }, transition: 'all 0.15s', px: 4 }}>
                  <Typography variant="button" fontWeight="bold" sx={{ color: P.orange.border }}>Submit Answers</Typography>
                </Box>
              </Stack>
            </Box>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...clay(P.green), mb: 3, textAlign: 'center' }}>
              <Typography variant="h5" sx={{ color: P.green.border }} gutterBottom>✓ Task A Complete!</Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>Score: {score} / 5</Typography>
            </Box>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Box component="button" onClick={handleContinue} sx={{ ...clay(P.green), cursor: 'pointer', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s' }}>
                <Typography variant="button" fontWeight="bold" sx={{ color: P.green.border }}>Next: Task B →</Typography>
              </Box>
            </Stack>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
