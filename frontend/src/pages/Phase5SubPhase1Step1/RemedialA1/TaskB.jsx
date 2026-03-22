import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import DragDropGapFill from '../../../components/DragDropGapFill.jsx'
import { phase5API } from '../../../lib/phase5_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

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

/**
 * Phase 5 Step 1 - Level A1 - Task B: Gap Fill
 * Fill in 8 gaps with problem-solving words, gamified as "Fill Frenzy"
 * Fill as items "frenzy" across screen; fast fills score higher
 */

const WORD_BANK = ['problem', 'cancel', 'change', 'solution', 'sorry', 'alternative', 'fix', 'urgent']

const TEMPLATES = [
  'Singer has ___.',
  'We must ___.',
  '___ time.',
  'Find ___.',
  'Say ___.',
  'Use ___.',
  '___ issue.',
  'It is ___.'
]

const ANSWERS = {
  'g_0_0': 'problem',
  'g_1_0': 'cancel',
  'g_2_0': 'change',
  'g_3_0': 'solution',
  'g_4_0': 'sorry',
  'g_5_0': 'alternative',
  'g_6_0': 'fix',
  'g_7_0': 'urgent'
}

export default function Phase5Step1RemedialA1TaskB() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const P = isDark ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 1, interaction: 2, context: 'remedial_a1' })
  const [phase, setPhase] = useState(1)
  const [part1Score, setPart1Score] = useState(null)
  const [totalScore, setTotalScore] = useState(0)

  const handlePart1Complete = (result) => {
    console.log('[Phase 5 Step 1] A1 Task B - Part 1 completed:', result.score, '/', result.total)
    setPart1Score(result.score)
  }

  const handlePart2Complete = async (result) => {
    const finalScore = part1Score + result.score
    console.log('[Phase 5 Step 1] A1 Task B - Part 2 completed:', result.score, '/', result.total)
    console.log('[Phase 5 Step 1] A1 Task B - Total Score:', finalScore, '/ 8')

    setTotalScore(finalScore)
    sessionStorage.setItem('phase5_step1_remedial_a1_taskB_score', finalScore.toString())

    // Log to backend
    try {
      await phase5API.logRemedialActivity(1, 'A1', 'B', finalScore, 8, 0)
      console.log('[Phase 5 Step 1] A1 Task B completion logged to backend')
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleFinishTaskB = () => {
    setPhase(3)
  }

  const handleNextToPart2 = () => {
    setPhase(2)
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/1/step/1/remedial/a1/task/c')
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: P.orange.bg,
            border: `2px solid ${P.orange.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.orange.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h4" gutterBottom fontWeight={700} color={P.orange.border}>
              Phase 5: Execution &amp; Problem-Solving
            </Typography>
            <Typography variant="h5" gutterBottom color={P.orange.shadow}>
              Step 1: Remedial Practice - Level A1
            </Typography>
            <Typography variant="h6" gutterBottom color={P.orange.shadow}>
              Task B: Fill Frenzy
            </Typography>
            <Typography variant="body1" color={isDark ? 'rgba(255,255,255,0.7)' : 'text.secondary'}>
              Fill in 8 gaps with problem-solving words. Fast fills score higher!
            </Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{
            bgcolor: P.teal.bg,
            border: `2px solid ${P.teal.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3,
          }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Great work on matching! Now let's fill in the missing words. Drag and drop words from the word bank to complete the sentences. Fill quickly for bonus points!"
            />
          </Box>

          {/* Phase 1: First 4 Sentences */}
          {phase === 1 && (
            <Box>
              <Box sx={{
                bgcolor: P.blue.bg,
                border: `2px solid ${P.blue.border}`,
                borderRadius: '20px',
                boxShadow: `4px 4px 0 ${P.blue.shadow}`,
                p: 3, mb: 3,
              }}>
                <Typography variant="h6" fontWeight={700} color={P.blue.shadow} gutterBottom sx={{ mb: 3 }}>
                  Part 1: Fill in the first 4 sentences
                </Typography>

                <DragDropGapFill
                  wordBank={['problem', 'cancel', 'change', 'solution']}
                  sentences={TEMPLATES.slice(0, 4)}
                  answers={Object.fromEntries(Object.entries(ANSWERS).slice(0, 4))}
                  onComplete={handlePart1Complete}
                />
              </Box>

              {part1Score !== null && (
                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                  <Box
                    component="button"
                    onClick={handleNextToPart2}
                    sx={{
                      bgcolor: P.green.bg,
                      border: `2px solid ${P.green.border}`,
                      borderRadius: '12px',
                      boxShadow: `3px 3px 0 ${P.green.shadow}`,
                      px: 4, py: 1.5,
                      fontWeight: 700, fontSize: '1rem',
                      cursor: 'pointer',
                      color: P.green.shadow,
                      transition: 'transform 0.15s, box-shadow 0.15s',
                      '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                    }}
                  >
                    Next: Part 2 →
                  </Box>
                </Stack>
              )}
            </Box>
          )}

          {/* Phase 2: Second 4 Sentences */}
          {phase === 2 && (
            <Box>
              <Box sx={{
                bgcolor: P.blue.bg,
                border: `2px solid ${P.blue.border}`,
                borderRadius: '20px',
                boxShadow: `4px 4px 0 ${P.blue.shadow}`,
                p: 3, mb: 3,
              }}>
                <Typography variant="h6" fontWeight={700} color={P.blue.shadow} gutterBottom sx={{ mb: 3 }}>
                  Part 2: Fill in the next 4 sentences
                </Typography>

                <DragDropGapFill
                  wordBank={['sorry', 'alternative', 'fix', 'urgent']}
                  sentences={TEMPLATES.slice(4, 8)}
                  answers={Object.fromEntries(Object.entries(ANSWERS).slice(4, 8))}
                  onComplete={handlePart2Complete}
                  startIndex={4}
                />
              </Box>

              {totalScore > 0 && (
                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                  <Box
                    component="button"
                    onClick={handleFinishTaskB}
                    sx={{
                      bgcolor: P.green.bg,
                      border: `2px solid ${P.green.border}`,
                      borderRadius: '12px',
                      boxShadow: `3px 3px 0 ${P.green.shadow}`,
                      px: 4, py: 1.5,
                      fontWeight: 700, fontSize: '1rem',
                      cursor: 'pointer',
                      color: P.green.shadow,
                      transition: 'transform 0.15s, box-shadow 0.15s',
                      '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                    }}
                  >
                    View Results &amp; Continue →
                  </Box>
                </Stack>
              )}
            </Box>
          )}

          {/* Phase 3: Complete */}
          {phase === 3 && (
            <>
              <Box sx={{
                bgcolor: P.green.bg,
                border: `2px solid ${P.green.border}`,
                borderRadius: '20px',
                boxShadow: `4px 4px 0 ${P.green.shadow}`,
                p: 4, mb: 3, textAlign: 'center',
              }}>
                <Typography variant="h5" fontWeight={700} color={P.green.shadow} gutterBottom>
                  ✓ Task B Complete!
                </Typography>
                <Typography variant="h6" sx={{ mt: 2, color: P.green.shadow }}>
                  Total Score: {totalScore} / 8
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, color: isDark ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>
                  You've filled all the gaps! Let's continue to the final task.
                </Typography>
              </Box>

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Box
                  component="button"
                  onClick={handleContinue}
                  sx={{
                    bgcolor: P.green.bg,
                    border: `2px solid ${P.green.border}`,
                    borderRadius: '12px',
                    boxShadow: `3px 3px 0 ${P.green.shadow}`,
                    px: 4, py: 1.5,
                    fontWeight: 700, fontSize: '1rem',
                    cursor: 'pointer',
                    color: P.green.shadow,
                    transition: 'transform 0.15s, box-shadow 0.15s',
                    '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                  }}
                >
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
