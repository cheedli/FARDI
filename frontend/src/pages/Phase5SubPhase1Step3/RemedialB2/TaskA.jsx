import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import GapFillStory from '../../../components/GapFillStory.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
}

const WORD_BANK_ORIGINAL = ['emergency', 'contingency', 'backup', 'announce', 'transparent', 'update']

const SENTENCES = [
  'Ms. Mabrouki: What is emergency?',
  'You: [Emergency] is urgent problem.',
  'Lilia: Solution?',
  'You: Use [contingency] and [backup], then [announce] with [transparent] [update].'
]

const CORRECT_ANSWERS = {
  'g_1_0': 'emergency',
  'g_3_0': 'contingency',
  'g_3_1': 'backup',
  'g_3_2': 'announce',
  'g_3_3': 'transparent',
  'g_3_4': 'update'
}

export default function Phase5Step3RemedialB2TaskA() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 3, interaction: 1, context: 'remedial_b2' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const shuffledWordBank = useMemo(() => [...WORD_BANK_ORIGINAL].sort(() => Math.random() - 0.5), [])

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })

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
    setScore(finalScore)
    setSubmitted(true)
    sessionStorage.setItem('phase5_step3_remedial_b2_taskA_score', finalScore.toString())
    try { await phase5API.logRemedialActivity(3, 'B2', 'A', finalScore, 6, 0) } catch (e) { console.error(e) }
  }

  const handleContinue = () => { navigate('/phase5/subphase/1/step/3/remedial/b2/task/b') }
  window.__remedialSkip = handleContinue

  const allFilled = Object.keys(CORRECT_ANSWERS).every(key => answers[key])

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Phase 5: Execution &amp; Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 3: Remedial Practice - Level B2</Typography>
            <Typography variant="h6" gutterBottom sx={{ color: P.orange.border }}>Task A: Role-Play Saga</Typography>
            <Typography variant="body1" color="text.secondary">Complete dialogue explaining crisis terms</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Role-Play Saga! Complete the dialogue explaining crisis terms. Saga unfolds with correct fills!" />
          </Box>
        </motion.div>
        {!submitted ? (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
              <GapFillStory templates={SENTENCES} wordBank={shuffledWordBank} answers={answers} onChange={handleAnswerChange} />
            </Box>
            <Box component="button" onClick={handleSubmit} disabled={!allFilled} sx={{ width: '100%', bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, py: 1.5, cursor: !allFilled ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '1rem', color: P.orange.border, opacity: !allFilled ? 0.5 : 1, '&:hover': allFilled ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {}, transition: 'all 0.15s ease' }}>
              Submit Answers
            </Box>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.green), mb: 3, textAlign: 'center' }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.green.border }}>Task A Complete!</Typography>
              <Typography variant="h6" sx={{ mt: 2 }} color="text.secondary">Score: {score} / 6</Typography>
            </Box>
            <Box component="button" onClick={handleContinue} sx={{ width: '100%', bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`, py: 1.5, cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', color: P.green.border, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s ease' }}>
              Next: Task B →
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
