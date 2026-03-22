import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container, useTheme } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import GapFillStory from '../../../components/GapFillStory.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'
import { motion } from 'framer-motion'

/**
 * Phase 4 Step 4 - Remedial B1 - Task A: Negotiation Battle
 * Fill gaps in poster/video descriptions
 * Score: +1 for each correct answer (4 total)
 */

const WORD_BANK_ORIGINAL = ['fold', 'space', 'move', 'picture']

const SENTENCES = [
  'Lilia: Can you describe the poster gatefold?',
  'You: Gatefold is _______ for _______.',
  'Ryan: What about the video animation?',
  'You: Animation is _______ _______ for fun.'
]

const CORRECT_ANSWERS = ['fold', 'space', 'move', 'picture']

export default function RemedialB1TaskA() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const LIGHT = {
    pageBg: '#FFFDE7',
    blue:   { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
    green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
    yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
    purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
    teal:   { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
    orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
    red:    { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
  }
  const DARK = {
    pageBg: '#0F0F1A',
    blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
    green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
    yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
    purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
    teal:   { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
    orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
    red:    { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
  }
  const P = isDark ? DARK : LIGHT

  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 1, context: 'remedial_b1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const shuffledWordBank = useMemo(() => {
    return [...WORD_BANK_ORIGINAL].sort(() => Math.random() - 0.5)
  }, [])

  const handleAnswerChange = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }))
  }

  const calculateScore = () => {
    let correctCount = 0
    if (answers['g_1_0']?.toLowerCase().trim() === CORRECT_ANSWERS[0].toLowerCase()) correctCount++
    if (answers['g_1_1']?.toLowerCase().trim() === CORRECT_ANSWERS[1].toLowerCase()) correctCount++
    if (answers['g_3_0']?.toLowerCase().trim() === CORRECT_ANSWERS[2].toLowerCase()) correctCount++
    if (answers['g_3_1']?.toLowerCase().trim() === CORRECT_ANSWERS[3].toLowerCase()) correctCount++
    return correctCount
  }

  const handleSubmit = async () => {
    const finalScore = calculateScore()
    setScore(finalScore)
    setSubmitted(true)
    sessionStorage.setItem('remedial_step4_b1_taskA_score', finalScore)
    await logTaskCompletion(finalScore)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ level: 'B1', task: 'A', step: 4, score: score, max_score: 4, completed: true })
      })
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase4/step/4/remedial/b1/taskB')
  }

  const allFilled = answers['g_1_0'] && answers['g_1_1'] && answers['g_3_0'] && answers['g_3_1']

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>Phase 4 - Step 4: Remedial Activities</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.shadow }}>Level B1 - Task A: Negotiation Battle</Typography>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}>Fill 4 gaps with the correct words. Click a word from the Word Bank, then click the blank!</Typography>
          </Box>

          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage character="MS. MABROUKI" message="Welcome to the Negotiation Battle! Complete the conversation about advertising poster and video design. Click a word from the Word Bank below, then click the blank space where it belongs. Fill all 4 gaps correctly to win the battle!" />
          </Box>

          {!submitted && (
            <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
              <GapFillStory
                templates={SENTENCES}
                wordBank={shuffledWordBank}
                answers={answers}
                onChange={handleAnswerChange}
              />
            </Box>
          )}

          {!submitted && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Box component="button" onClick={handleSubmit} disabled={!allFilled} sx={{
                bgcolor: allFilled ? P.orange.bg : (isDark ? '#222' : '#f5f5f5'),
                border: `2px solid ${allFilled ? P.orange.border : (isDark ? '#444' : '#ccc')}`,
                borderRadius: '12px', boxShadow: allFilled ? `3px 3px 0 ${P.orange.shadow}` : 'none',
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: allFilled ? 'pointer' : 'not-allowed',
                color: allFilled ? P.orange.shadow : (isDark ? '#555' : '#aaa'),
                opacity: allFilled ? 1 : 0.6,
                '&:hover': allFilled ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.orange.shadow}` } : {},
              }}>
                {allFilled ? 'Submit Battle Answers' : 'Fill All Gaps First'}
              </Box>
            </Box>
          )}

          {submitted && (
            <Box>
              <Box sx={{
                bgcolor: score === 4 ? P.green.bg : P.yellow.bg,
                border: `2px solid ${score === 4 ? P.green.border : P.yellow.border}`,
                borderRadius: '20px', boxShadow: `4px 4px 0 ${score === 4 ? P.green.shadow : P.yellow.shadow}`,
                p: 4, mt: 3, textAlign: 'center',
              }}>
                <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: score === 4 ? P.green.shadow : P.yellow.shadow }}>
                  {score === 4 ? 'Perfect Battle Victory!' : 'Battle Complete!'}
                </Typography>
                <Typography variant="h6" sx={{ color: score === 4 ? P.green.shadow : P.yellow.shadow }}>
                  You scored {score} out of 4 points!
                </Typography>
              </Box>

              <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mt: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>Answer Review:</Typography>
                <Stack spacing={2}>
                  {[
                    { key: 'g_1_0', label: 'Gap 1', text: `Gatefold is "${answers['g_1_0'] || '(empty)'}"`, idx: 0 },
                    { key: 'g_1_1', label: 'Gap 2', text: `for "${answers['g_1_1'] || '(empty)'}"`, idx: 1 },
                    { key: 'g_3_0', label: 'Gap 3', text: `Animation is "${answers['g_3_0'] || '(empty)'}"`, idx: 2 },
                    { key: 'g_3_1', label: 'Gap 4', text: `"${answers['g_3_1'] || '(empty)'}" for fun`, idx: 3 },
                  ].map(({ key, label, text, idx }) => {
                    const isCorrect = answers[key]?.toLowerCase() === CORRECT_ANSWERS[idx].toLowerCase()
                    return (
                      <Box key={key} sx={{
                        bgcolor: isCorrect ? P.green.bg : P.red.bg,
                        border: `2px solid ${isCorrect ? P.green.border : P.red.border}`,
                        borderRadius: '12px', boxShadow: `2px 2px 0 ${isCorrect ? P.green.shadow : P.red.shadow}`,
                        p: 2,
                      }}>
                        <Typography variant="body2" sx={{ color: isCorrect ? P.green.shadow : P.red.shadow }}>
                          <strong>{label}:</strong> {text}
                          {!isCorrect && <span> - Correct: <strong>{CORRECT_ANSWERS[idx]}</strong></span>}
                        </Typography>
                      </Box>
                    )
                  })}
                </Stack>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                <Box component="button" onClick={handleContinue} sx={{
                  bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                  borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                  px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                  cursor: 'pointer', color: P.green.shadow,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                  '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` }
                }}>
                  Continue to Task B →
                </Box>
              </Box>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
