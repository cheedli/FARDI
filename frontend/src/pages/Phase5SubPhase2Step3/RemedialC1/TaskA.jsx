import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import GapFillStory from '../../../components/GapFillStory.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  blue:   { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  teal:   { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  red:    { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  teal:   { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  red:    { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
  purple: { bg: '#3B0764', border: '#C084FC', shadow: '#6B21A8' },
}

const WORD_BANK_ORIGINAL = ['sequencing', 'politeness', 'clarity', 'safety', 'empathy']

const SENTENCES = [
  'Opponent: Instructions key?',
  'You: [Clear] [sequencing] and [politeness] essential.',
  'Opponent: Why empathy?',
  'You: [Empathy] builds cooperation and reduces stress.'
]

const CORRECT_ANSWERS = {
  'g_1_0': 'Clear',
  'g_1_1': 'sequencing',
  'g_1_2': 'politeness',
  'g_3_0': 'Empathy'
}

export default function Phase5SubPhase2Step3RemedialC1TaskA() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase5/subphase/2/step/3/remedial/c1/task/b') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 3, interaction: 1, context: 'remedial_c1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const shuffledWordBank = useMemo(() => {
    return [...WORD_BANK_ORIGINAL, 'Clear', 'Empathy'].sort(() => Math.random() - 0.5)
  }, [])

  const handleAnswerChange = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }))
  }

  const calculateScore = () => {
    let correctCount = 0
    Object.entries(CORRECT_ANSWERS).forEach(([key, correct]) => {
      if (answers[key]?.toLowerCase().trim() === correct.toLowerCase()) {
        correctCount++
      }
    })
    return correctCount
  }

  const handleSubmit = async () => {
    const finalScore = calculateScore()
    setScore(finalScore)
    setSubmitted(true)
    sessionStorage.setItem('phase5_subphase2_step3_remedial_c1_taskA_score', finalScore.toString())
    try {
      await phase5API.logRemedialActivity(3, 'C1', 'A', finalScore, 4, 2)
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/2/step/3/remedial/c1/task/b')
  }

  const allFilled = Object.keys(CORRECT_ANSWERS).every(key => answers[key])

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{
            bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`,
            p: 3, mb: 3
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.purple.border }}>Phase 5: Execution & Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.purple.shadow }}>SubPhase 2 Step 3: Remedial Practice - Level C1</Typography>
            <Typography variant="h6" gutterBottom fontWeight="bold">Task A: Debate Dominion</Typography>
            <Typography variant="body1">Simulate dialogue on best volunteer instruction strategies. Advanced argumentation!</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3
          }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Debate Dominion! Complete the debate dialogue about volunteer instruction strategies. Use advanced terms from the word bank to make your arguments!" />
          </Box>
        </motion.div>

        {!submitted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Box>
              <GapFillStory templates={SENTENCES} wordBank={shuffledWordBank} answers={answers} onChange={handleAnswerChange} />
              <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
                <Box
                  component="button" onClick={handleSubmit} disabled={!allFilled}
                  sx={{
                    bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                    borderRadius: '14px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
                    px: 6, py: 1.5, fontSize: '1rem', fontWeight: 'bold',
                    color: P.blue.border, cursor: allFilled ? 'pointer' : 'not-allowed',
                    opacity: allFilled ? 1 : 0.5,
                    transition: 'all 0.15s',
                    '&:hover': allFilled ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` } : {}
                  }}
                >Submit Answers</Box>
              </Stack>
            </Box>
          </motion.div>
        )}

        {submitted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{
              bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
              p: 4, mb: 3, textAlign: 'center'
            }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.green.shadow }} gutterBottom>✓ Task A Complete!</Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>Score: {score} / 4</Typography>
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
              >Next: Task B →</Box>
            </Stack>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
