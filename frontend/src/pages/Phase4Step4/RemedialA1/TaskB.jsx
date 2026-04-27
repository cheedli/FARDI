import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import DragDropGapFill from '../../../components/DragDropGapFill.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 4 - Level A1 - Task B: Gap Fill Exercise
 */

const WORD_BANK = ['gatefold', 'lettering', 'animation', 'jingle', 'dramatisation', 'sketch', 'clip', 'storytelling']

const TEMPLATES_PART1 = ['Poster has ___.', '___ on poster.', 'Video uses ___.', '___ in video.']
const ANSWERS_PART1 = { 'g_0_0': 'gatefold', 'g_1_0': 'lettering', 'g_2_0': 'animation', 'g_3_0': 'jingle' }

const TEMPLATES_PART2 = ['___ is story.', '___ for plan.', 'Short ___.', 'Use ___.']
const ANSWERS_PART2 = { 'g_4_0': 'dramatisation', 'g_5_0': 'sketch', 'g_6_0': 'clip', 'g_7_0': 'storytelling' }

export default function Phase4Step5RemedialA1TaskB() {
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

  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 2, context: 'remedial_a1' })
  const [phase, setPhase] = useState(1)
  const [part1Score, setPart1Score] = useState(null)
  const [part2Completed, setPart2Completed] = useState(false)
  const [totalScore, setTotalScore] = useState(0)

  const handlePart1Complete = (result) => {
    console.log('[Phase 4 Step 5] A1 Task B - Part 1 completed:', result.score, '/', result.total)
    setPart1Score(result.score)
  }

  const handlePart2Complete = (result) => {
    const finalScore = (part1Score ?? 0) + result.score
    console.log('[Phase 4 Step 5] A1 Task B - Part 2 completed:', result.score, '/', result.total)
    console.log('[Phase 4 Step 5] A1 Task B - Total Score:', finalScore, '/ 8')
    setTotalScore(finalScore)
    setPart2Completed(true)
    sessionStorage.setItem('phase4_step5_remedial_a1_taskB_score', finalScore)
    logTaskCompletion(finalScore)
  }

  const handleFinishTaskB = () => { setPhase(3) }
  const handleNextToPart2 = () => { setPhase(2) }
  const handleReset = () => { setPhase(1); setPart1Score(null); setPart2Completed(false); setTotalScore(0) }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score: score })
    try {
      const response = await fetch('/api/phase4/step5/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ level: 'A1', task: 'B', score: score, max_score: 8, completed: true })
      })
      const data = await response.json()
      if (data.success) console.log('[Phase 4 Step 5] A1 Task B completion logged to backend')
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => { navigate('/phase4/step/4/remedial/a1/taskC') }
  window.__remedialSkip = handleContinue

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {/* Header */}
          <Box sx={{
            bgcolor: P.red.bg, border: `2px solid ${P.red.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.red.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.red.shadow }}>
              Phase 4 Step 4: Evaluate - Remedial Practice
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.red.shadow }}>
              Level A1 - Task B: Fill Quest
            </Typography>
            <Typography variant="body1" sx={{ color: P.red.shadow }}>
              Fill gaps to quest through levels - correct fills advance the quest!
            </Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3,
          }}>
            <CharacterMessage
              character="LILIA"
              message="Great work on Spelling Rescue! Now let's fill in the missing words. Drag and drop the correctly spelled words from the word bank to complete the sentences!"
            />
          </Box>

          {/* Phase 1 */}
          {phase === 1 && (
            <Box>
              <Box sx={{
                bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
                p: 3, mb: 3,
              }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: P.blue.shadow, mb: 3 }}>
                  Part 1: Fill in the first 4 sentences
                </Typography>
                <DragDropGapFill
                  wordBank={['gatefold', 'lettering', 'animation', 'jingle']}
                  sentences={TEMPLATES_PART1}
                  answers={ANSWERS_PART1}
                  onComplete={handlePart1Complete}
                />
              </Box>

              {part1Score !== null && (
                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                  <Box component="button" onClick={handleNextToPart2} sx={{
                    bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
                    borderRadius: '12px', boxShadow: `3px 3px 0 ${P.orange.shadow}`,
                    px: 6, py: 1.5, fontWeight: 700, fontSize: '1rem',
                    cursor: 'pointer', color: P.orange.shadow,
                    '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.orange.shadow}` },
                    '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.orange.shadow}` },
                    transition: 'all 0.15s ease',
                  }}>
                    Next: Part 2 →
                  </Box>
                </Stack>
              )}
            </Box>
          )}

          {/* Phase 2 */}
          {phase === 2 && (
            <Box>
              <Box sx={{
                bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
                p: 3, mb: 3,
              }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: P.blue.shadow, mb: 3 }}>
                  Part 2: Fill in the next 4 sentences
                </Typography>
                <DragDropGapFill
                  wordBank={['dramatisation', 'sketch', 'clip', 'storytelling']}
                  sentences={TEMPLATES_PART2}
                  answers={ANSWERS_PART2}
                  onComplete={handlePart2Complete}
                  startIndex={4}
                />
              </Box>

              {part2Completed && (
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                  {totalScore < 8 && (
                    <Box component="button" onClick={handleReset} sx={{
                      bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
                      borderRadius: '12px', boxShadow: `3px 3px 0 ${P.yellow.shadow}`,
                      px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                      cursor: 'pointer', color: P.yellow.shadow,
                      '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.yellow.shadow}` },
                      transition: 'all 0.15s ease',
                    }}>
                      Try Again
                    </Box>
                  )}
                  <Box component="button" onClick={handleFinishTaskB} sx={{
                    bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
                    borderRadius: '12px', boxShadow: `3px 3px 0 ${P.orange.shadow}`,
                    px: 6, py: 1.5, fontWeight: 700, fontSize: '1rem',
                    cursor: 'pointer', color: P.orange.shadow,
                    '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.orange.shadow}` },
                    '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.orange.shadow}` },
                    transition: 'all 0.15s ease',
                  }}>
                    View Results & Continue →
                  </Box>
                </Stack>
              )}
            </Box>
          )}

          {/* Phase 3: Complete */}
          {phase === 3 && (
            <>
              <Box sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
                p: 4, mb: 3, textAlign: 'center',
              }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: P.green.shadow }}>
                  ✓ Task B Complete!
                </Typography>
                <Typography variant="h6" sx={{ mt: 2, color: P.green.shadow }}>
                  Total Score: {totalScore} / 8
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, color: P.green.shadow, opacity: 0.8 }}>
                  You've filled all the gaps with correct spelling! Let's continue to the final task.
                </Typography>
              </Box>

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Box component="button" onClick={handleContinue} sx={{
                  bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
                  borderRadius: '12px', boxShadow: `3px 3px 0 ${P.orange.shadow}`,
                  px: 5, py: 1.5, fontWeight: 700, fontSize: '1rem',
                  cursor: 'pointer', color: P.orange.shadow,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.orange.shadow}` },
                  '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.orange.shadow}` },
                  transition: 'all 0.15s ease',
                }}>
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
