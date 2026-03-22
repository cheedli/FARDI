import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import GapFillStory from '../../../components/GapFillStory.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#f0f4ff',
  blue:   { bg: '#dbeafe', border: '#3b82f6', shadow: '#1d4ed8' },
  teal:   { bg: '#ccfbf1', border: '#14b8a6', shadow: '#0f766e' },
  orange: { bg: '#ffedd5', border: '#f97316', shadow: '#c2410c' },
  green:  { bg: '#dcfce7', border: '#22c55e', shadow: '#15803d' },
  red:    { bg: '#fee2e2', border: '#ef4444', shadow: '#b91c1c' },
}
const DARK = {
  pageBg: '#0f172a',
  blue:   { bg: '#1e3a5f', border: '#3b82f6', shadow: '#1d4ed8' },
  teal:   { bg: '#134e4a', border: '#14b8a6', shadow: '#0f766e' },
  orange: { bg: '#431407', border: '#f97316', shadow: '#c2410c' },
  green:  { bg: '#14532d', border: '#22c55e', shadow: '#15803d' },
  red:    { bg: '#450a0a', border: '#ef4444', shadow: '#b91c1c' },
}

const WORD_BANK_ORIGINAL = ['promote','sell','ethos','pathos','logos']
const SENTENCES = [
  'Promotional is to _______ and _______.',
  'Persuasive uses _______, _______, and _______.'
]
const CORRECT_ANSWERS = ['promote','sell','ethos','pathos','logos']

export default function RemedialB1TaskA() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 1, context: 'remedial_b1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const shuffledWordBank = useMemo(() => [...WORD_BANK_ORIGINAL].sort(() => Math.random() - 0.5), [])

  const handleAnswerChange = (key, value) => setAnswers(prev => ({ ...prev, [key]: value }))

  const calculateScore = () => {
    let correctCount = 0
    if (answers['g_0_0']?.toLowerCase().trim() === CORRECT_ANSWERS[0].toLowerCase()) correctCount++
    if (answers['g_0_1']?.toLowerCase().trim() === CORRECT_ANSWERS[1].toLowerCase()) correctCount++
    if (answers['g_1_0']?.toLowerCase().trim() === CORRECT_ANSWERS[2].toLowerCase()) correctCount++
    if (answers['g_1_1']?.toLowerCase().trim() === CORRECT_ANSWERS[3].toLowerCase()) correctCount++
    if (answers['g_1_2']?.toLowerCase().trim() === CORRECT_ANSWERS[4].toLowerCase()) correctCount++
    return correctCount
  }

  const handleSubmit = async () => {
    const finalScore = calculateScore()
    setScore(finalScore)
    setSubmitted(true)
    sessionStorage.setItem('remedial_step3_b1_taskA_score', finalScore)
    await logTaskCompletion(finalScore)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ level: 'B1', task: 'A', step: 2, score, max_score: 5, completed: true })
      })
    } catch (error) { console.error('Failed to log task completion:', error) }
  }

  const handleContinue = () => navigate('/phase4/step3/remedial/b1/taskB')

  const allFilled = answers['g_0_0'] && answers['g_0_1'] && answers['g_1_0'] && answers['g_1_1'] && answers['g_1_2']

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{ p: 3, mb: 3, bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: 3, boxShadow: `4px 4px 0 ${P.blue.shadow}` }}>
            <Typography variant="h5" fontWeight={800} color={P.blue.border}>Phase 4 - Step 3: Remedial Activities</Typography>
            <Typography variant="h6" fontWeight={700} color={P.blue.border} sx={{ mt: 0.5 }}>Level B1 - Task A: Negotiation Battle ⚔️</Typography>
            <Typography variant="body2" sx={{ mt: 1, color: theme.palette.text.secondary }}>Fill 5 gaps with the correct words. Click a word from the Word Bank, then click the blank!</Typography>
          </Box>

          {/* Instructor */}
          <Box sx={{ p: 3, mb: 3, bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: 3, boxShadow: `4px 4px 0 ${P.teal.shadow}` }}>
            <CharacterMessage character="MS. MABROUKI" message="Welcome to the Negotiation Battle! Complete the conversation about advertising concepts. Click a word from the Word Bank below, then click the blank space where it belongs. Fill all 5 gaps correctly to win the battle!" />
          </Box>

          {!submitted && (
            <Box sx={{ p: 3, mb: 3, bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: 3, boxShadow: `4px 4px 0 ${P.orange.shadow}` }}>
              <GapFillStory templates={SENTENCES} wordBank={shuffledWordBank} answers={answers} onChange={handleAnswerChange} />
            </Box>
          )}

          {!submitted && (
            <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
              <Box
                component="button"
                onClick={handleSubmit}
                disabled={!allFilled}
                sx={{
                  px: 5, py: 1.5, fontWeight: 700, fontSize: '1rem', borderRadius: 2, border: `2px solid ${P.orange.border}`,
                  bgcolor: allFilled ? P.orange.bg : theme.palette.action.disabledBackground,
                  color: allFilled ? P.orange.border : theme.palette.text.disabled,
                  boxShadow: allFilled ? `4px 4px 0 ${P.orange.shadow}` : 'none', cursor: allFilled ? 'pointer' : 'not-allowed',
                  transition: 'all 0.15s', '&:hover': allFilled ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {}
                }}
              >
                {allFilled ? 'Submit Battle Answers ⚔️' : 'Fill All Gaps First'}
              </Box>
            </Stack>
          )}

          {submitted && (
            <Box>
              <Box sx={{ p: 4, mb: 3, textAlign: 'center', bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: 3, boxShadow: `4px 4px 0 ${P.green.shadow}` }}>
                <Typography variant="h5" fontWeight={800} color={P.green.border}>{score === 5 ? '⚔️ Perfect Battle! ⚔️' : '🌟 Battle Complete! 🌟'}</Typography>
                <Typography variant="h6" sx={{ mt: 1 }}>You scored {score} out of 5 points!</Typography>
              </Box>

              <Box sx={{ p: 3, mb: 3, bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: 3, boxShadow: `4px 4px 0 ${P.blue.shadow}` }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Answer Review:</Typography>
                <Stack spacing={2}>
                  {[
                    { key: 'g_0_0', label: 'Gap 1', context: 'Promotional is to', idx: 0 },
                    { key: 'g_0_1', label: 'Gap 2', context: 'and', idx: 1 },
                    { key: 'g_1_0', label: 'Gap 3', context: 'Persuasive uses', idx: 2 },
                    { key: 'g_1_1', label: 'Gap 4', context: '', idx: 3 },
                    { key: 'g_1_2', label: 'Gap 5', context: 'and', idx: 4 },
                  ].map(({ key, label, context, idx }) => {
                    const isCorrect = answers[key]?.toLowerCase() === CORRECT_ANSWERS[idx].toLowerCase()
                    const C = isCorrect ? P.green : P.red
                    return (
                      <Box key={key} sx={{ p: 2, bgcolor: C.bg, border: `2px solid ${C.border}`, borderRadius: 2, boxShadow: `3px 3px 0 ${C.shadow}` }}>
                        <Typography variant="body2">
                          <strong>{label}:</strong> {context} "{answers[key] || '(empty)'}"
                          {!isCorrect && <span> - Correct: <strong>{CORRECT_ANSWERS[idx]}</strong></span>}
                          {isCorrect && <span> ✓</span>}
                        </Typography>
                      </Box>
                    )
                  })}
                </Stack>
              </Box>

              <Stack direction="row" justifyContent="flex-end">
                <Box
                  component="button"
                  onClick={handleContinue}
                  sx={{
                    px: 5, py: 1.5, fontWeight: 700, fontSize: '1rem', borderRadius: 2,
                    border: `2px solid ${P.green.border}`, bgcolor: P.green.bg, color: P.green.border,
                    boxShadow: `4px 4px 0 ${P.green.shadow}`, cursor: 'pointer', transition: 'all 0.15s',
                    '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }
                  }}
                >
                  Continue to Task B →
                </Box>
              </Stack>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
