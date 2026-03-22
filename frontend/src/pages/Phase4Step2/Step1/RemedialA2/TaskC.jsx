import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Grid, Stack, Container, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 - Level A2 - Task C: Connector Quest
 */

const SENTENCES = [
  { id: 1, text: 'Post has hashtag ___ emoji.', answer: 'and' },
  { id: 2, text: 'Caption short ___ good.', answer: 'because' },
  { id: 3, text: 'Like post ___ share.', answer: 'and' },
  { id: 4, text: 'Tag friends ___ fun.', answer: 'because' },
  { id: 5, text: 'Story has photo ___ video.', answer: 'and' },
  { id: 6, text: 'Use emoji ___ express feeling.', answer: 'because' }
]

export default function Phase4_2RemedialA2TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 3, context: 'remedial_a2' })
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const LIGHT = {
    pageBg: '#FFFDE7',
    blue:   { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
    green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
    yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
    teal:   { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
    orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
    red:    { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
  }
  const DARK = {
    pageBg: '#0F0F1A',
    blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
    green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
    yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
    teal:   { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
    orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
    red:    { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
  }
  const P = isDark ? DARK : LIGHT

  const handleSubmit = () => {
    let correctCount = 0
    SENTENCES.forEach(sentence => { if (answers[sentence.id] === sentence.answer) correctCount++ })
    setScore(correctCount)
    setShowResults(true)
    const scoreOutOf10 = (correctCount / SENTENCES.length) * 10
    sessionStorage.setItem('phase4_2_remedial_a2_taskC_score', scoreOutOf10.toString())
    sessionStorage.setItem('phase4_2_remedial_a2_taskC_max', '10')
    logTaskCompletion(correctCount, SENTENCES.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 1, level: 'A2', task: 'C', score, max_score: maxScore, time_taken: 0 })
      })
    } catch (error) { console.error('Failed to log task:', error) }
  }

  const handleFinish = () => { navigate('/phase4_2/step/1/remedial/a2/results') }
  const allAnswered = SENTENCES.every(s => answers[s.id])

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>Phase 4.2 - Remedial Practice</Typography>
            <Typography variant="h6" sx={{ color: P.blue.shadow }}>Level A2 - Task C: Connector Quest</Typography>
          </Box>

          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Choose the correct connector for each sentence! Use 'and' to add information and 'because' to give a reason." />
          </Box>

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 2, mb: 3 }}>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}><strong>Instructions:</strong> Select "because" or "and" to complete each sentence correctly.</Typography>
          </Box>

          {/* Connector Guide */}
          <Box sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.green.shadow }}>Quick Guide:</Typography>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box component="span" sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '999px', px: 2, py: 0.5, fontSize: '0.85rem', fontWeight: 700, color: P.green.shadow, display: 'inline-block' }}>and</Box>
                <Typography variant="body2" sx={{ color: P.green.shadow }}>Use to add information (joins similar things)</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box component="span" sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '999px', px: 2, py: 0.5, fontSize: '0.85rem', fontWeight: 700, color: P.teal.shadow, display: 'inline-block' }}>because</Box>
                <Typography variant="body2" sx={{ color: P.teal.shadow }}>Use to give a reason (explains why)</Typography>
              </Box>
            </Stack>
          </Box>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {SENTENCES.map(sentence => {
              const isCorrect = answers[sentence.id] === sentence.answer
              return (
                <Grid item xs={12} key={sentence.id}>
                  <Box sx={{
                    bgcolor: showResults ? (isCorrect ? P.green.bg : P.red.bg) : P.orange.bg,
                    border: `2px solid ${showResults ? (isCorrect ? P.green.border : P.red.border) : P.orange.border}`,
                    borderRadius: '20px', boxShadow: `4px 4px 0 ${showResults ? (isCorrect ? P.green.shadow : P.red.shadow) : P.orange.shadow}`,
                    p: 3,
                  }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: showResults ? (isCorrect ? P.green.shadow : P.red.shadow) : P.orange.shadow }}>
                      {sentence.id}. {sentence.text}
                    </Typography>
                    {!showResults && (
                      <ToggleButtonGroup value={answers[sentence.id] || ''} exclusive
                        onChange={(e, value) => value && setAnswers({ ...answers, [sentence.id]: value })} sx={{ mt: 2 }}>
                        <ToggleButton value="and" sx={{ px: 4, py: 1.5, fontWeight: 700 }}>and</ToggleButton>
                        <ToggleButton value="because" sx={{ px: 4, py: 1.5, fontWeight: 700 }}>because</ToggleButton>
                      </ToggleButtonGroup>
                    )}
                    {showResults && (
                      <Box sx={{ mt: 2, bgcolor: isCorrect ? P.green.bg : P.red.bg, border: `2px solid ${isCorrect ? P.green.border : P.red.border}`, borderRadius: '12px', p: 2 }}>
                        {isCorrect ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckCircleIcon sx={{ color: P.green.shadow }} />
                            <Typography sx={{ color: P.green.shadow, fontWeight: 600 }}>Correct: <strong>{sentence.answer}</strong></Typography>
                          </Box>
                        ) : (
                          <Typography sx={{ color: P.red.shadow, fontWeight: 600 }}>
                            Your answer: <strong>{answers[sentence.id] || '(none)'}</strong> | Correct answer: <strong>{sentence.answer}</strong>
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Box>
                </Grid>
              )
            })}
          </Grid>

          {showResults && (
            <Box sx={{ bgcolor: score === SENTENCES.length ? P.green.bg : P.yellow.bg, border: `2px solid ${score === SENTENCES.length ? P.green.border : P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${score === SENTENCES.length ? P.green.shadow : P.yellow.shadow}`, p: 3, mb: 3 }}>
              <Typography fontWeight="bold" sx={{ color: score === SENTENCES.length ? P.green.shadow : P.yellow.shadow }}>
                {score === SENTENCES.length ? `Perfect! You got all ${SENTENCES.length} connectors correct!` : `You got ${score}/${SENTENCES.length} correct. Review the guide and try to understand when to use each connector!`}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            {!showResults && (
              <Box component="button" onClick={handleSubmit} disabled={!allAnswered} sx={{
                bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
                px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem', cursor: !allAnswered ? 'not-allowed' : 'pointer',
                color: P.blue.shadow, opacity: !allAnswered ? 0.6 : 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` }
              }}>Submit Answers</Box>
            )}
            {showResults && (
              <Box component="button" onClick={handleFinish} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem', cursor: 'pointer', color: P.green.shadow,
                display: 'flex', alignItems: 'center', gap: 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` }
              }}><ArrowForwardIcon /> View Results</Box>
            )}
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
