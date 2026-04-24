import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import GapFillStory from '../../../components/GapFillStory.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' } }
const DARK  = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' } }
const clay  = (c) => ({ bgcolor: c.bg, border: `2px solid ${c.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${c.shadow}`, p: 3 })
const hoverLift = (c) => ({ '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${c.shadow}` } })

const WORD_BANK_ORIGINAL = ['clear', 'polite', 'sequencing', 'safety']
const SENTENCES = ['Ms. Mabrouki: Good instructions must be [clear] and [polite].', 'You: I will use [sequencing] words and emphasize [safety].']
const CORRECT_ANSWERS = { 'g_0_0': 'clear', 'g_0_1': 'polite', 'g_1_0': 'sequencing', 'g_1_1': 'safety' }

export default function Phase5SubPhase2Step2RemedialC1TaskA() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 2, interaction: 1, context: 'remedial_c1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const shuffledWordBank = useMemo(() => [...WORD_BANK_ORIGINAL].sort(() => Math.random() - 0.5), [])
  const handleAnswerChange = (key, value) => setAnswers(prev => ({ ...prev, [key]: value }))
  const calculateScore = () => { let c = 0; Object.entries(CORRECT_ANSWERS).forEach(([k, v]) => { if (answers[k]?.toLowerCase().trim() === v.toLowerCase()) c++ }); return c }
  const handleSubmit = async () => {
    const finalScore = calculateScore(); setScore(finalScore); setSubmitted(true)
    sessionStorage.setItem('phase5_subphase2_step2_remedial_c1_taskA_score', finalScore.toString())
    try { await phase5API.logRemedialActivity(2, 'C1', 'A', finalScore, 4, 2) } catch (e) { console.error(e) }
  }
  const handleContinue = () => navigate('/phase5/subphase/2/step/2/remedial/c1/task/b')
  window.__remedialSkip = handleContinue
  const allFilled = Object.keys(CORRECT_ANSWERS).every(key => answers[key])
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: P.orange.border, mb: 1 }}>Phase 5: Execution &amp; Problem-Solving</Typography>
            <Typography variant="h5" sx={{ color: P.orange.border, mb: 1 }}>SubPhase 2 Step 2: Remedial Practice - Level C1</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border, mb: 1 }}>Task A: Debate Simulation</Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>Complete the debate dialogue about instruction principles.</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Debate Simulation! Complete the dialogue about the key principles of giving good instructions. Use the word bank to fill in the gaps!" />
          </Box>
        </motion.div>
        {!submitted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <GapFillStory templates={SENTENCES} wordBank={shuffledWordBank} answers={answers} onChange={handleAnswerChange} />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Box component="button" onClick={handleSubmit} disabled={!allFilled}
                sx={{ ...clay(P.orange), ...hoverLift(P.orange), cursor: 'pointer', px: 6, py: 1.5, fontWeight: 'bold', fontSize: '1rem', color: P.orange.border, transition: 'all 0.15s', opacity: !allFilled ? 0.5 : 1 }}>Submit Answers</Box>
            </Box>
          </motion.div>
        )}
        {submitted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...clay(P.green), mb: 3, textAlign: 'center' }}>
              <Typography variant="h5" sx={{ color: P.green.border, mb: 2 }}>✓ Task A Complete!</Typography>
              <Typography variant="h6">Score: {score} / 4</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Box component="button" onClick={handleContinue}
                sx={{ ...clay(P.green), ...hoverLift(P.green), cursor: 'pointer', px: 4, py: 1.5, fontWeight: 'bold', fontSize: '1rem', color: P.green.border, transition: 'all 0.15s' }}>Next: Task B →</Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
