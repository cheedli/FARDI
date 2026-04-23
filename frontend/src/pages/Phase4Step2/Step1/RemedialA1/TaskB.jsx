import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import DragDropGapFill from '../../../../components/DragDropGapFill.jsx'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 - Level A1 - Task B: Fill Quest
 */

const WORD_BANK = ['hashtag', 'caption', 'emoji', 'tag', 'like', 'share', 'post', 'story']
const TEMPLATES_PART1 = ['Use ___ #Festival.', 'Write ___ under photo.', 'Add ___ smile.', '___ friend.']
const ANSWERS_PART1 = { 'g_0_0': 'hashtag', 'g_1_0': 'caption', 'g_2_0': 'emoji', 'g_3_0': 'tag' }
const TEMPLATES_PART2 = ['Click ___.', '___ with friends.', 'Make ___.', 'Watch ___.']
const ANSWERS_PART2 = { 'g_4_0': 'like', 'g_5_0': 'share', 'g_6_0': 'post', 'g_7_0': 'story' }

export default function Phase4_2RemedialA1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 1, interaction: 2, context: 'remedial_a1' })
  const [phase, setPhase] = useState(1)
  const [part1Score, setPart1Score] = useState(null)
  const [totalScore, setTotalScore] = useState(0)
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const LIGHT = {
    pageBg: '#FFFDE7',
    blue:   { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
    green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
    yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
    teal:   { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
    orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  }
  const DARK = {
    pageBg: '#0F0F1A',
    blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
    green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
    yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
    teal:   { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
    orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  }
  const P = isDark ? DARK : LIGHT

  const handlePart1Complete = (result) => { setPart1Score(result.score) }
  const handlePart2Complete = (result) => {
    const finalScore = part1Score + result.score
    setTotalScore(finalScore)
    sessionStorage.setItem('phase4_2_remedial_a1_taskB_score', finalScore)
    logTaskCompletion(finalScore)
  }
  const handleFinishTaskB = () => { setPhase(3) }
  const handleNextToPart2 = () => { setPhase(2) }
  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score })
    try {
      const response = await fetch('/api/phase4/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 1, level: 'A1', task: 'B', score, max_score: 8, completed: true })
      })
      const data = await response.json()
      if (data.success) console.log('[Phase 4.2 Step 1] A1 Task B completion logged to backend')
    } catch (error) { console.error('Failed to log task completion:', error) }
  }
  const handleContinue = () => { navigate('/phase4_2/step/1/remedial/a1/taskC') }

  const clayBtn = (color) => ({
    bgcolor: P[color].bg, border: `2px solid ${P[color].border}`, borderRadius: '12px',
    boxShadow: `3px 3px 0 ${P[color].shadow}`, px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem',
    cursor: 'pointer', color: P[color].shadow,
    '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P[color].shadow}` },
    '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P[color].shadow}` }
  })

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>Phase 4.2 Step 1: Engage - Remedial Practice</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.shadow }}>Level A1 - Task B: Fill Quest</Typography>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}>Fill gaps to quest through levels - correct fills advance the quest!</Typography>
          </Box>

          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage character="LILIA" message="Great work on Spelling Rescue! Now let's fill in the missing words. Drag and drop the correctly spelled social media words from the word bank to complete the sentences!" />
          </Box>

          {phase === 1 && (
            <Box>
              <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow, mb: 3 }}>Part 1: Fill in the first 4 sentences</Typography>
                <DragDropGapFill wordBank={['hashtag', 'caption', 'emoji', 'tag']} sentences={TEMPLATES_PART1} answers={ANSWERS_PART1} onComplete={handlePart1Complete} />
              </Box>
              {part1Score !== null && (
                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                  <Box component="button" onClick={handleNextToPart2} sx={{ ...clayBtn('green') }}>Next: Part 2 →</Box>
                </Stack>
              )}
            </Box>
          )}

          {phase === 2 && (
            <Box>
              <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow, mb: 3 }}>Part 2: Fill in the next 4 sentences</Typography>
                <DragDropGapFill wordBank={['like', 'share', 'post', 'story']} sentences={TEMPLATES_PART2} answers={ANSWERS_PART2} onComplete={handlePart2Complete} startIndex={4} />
              </Box>
              {totalScore > 0 && (
                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                  <Box component="button" onClick={handleFinishTaskB} sx={{ ...clayBtn('green') }}>View Results &amp; Continue →</Box>
                </Stack>
              )}
            </Box>
          )}

          {phase === 3 && (
            <>
              <Box sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`, p: 4, mb: 3, textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.green.shadow }}>✓ Task B Complete!</Typography>
                <Typography variant="h6" sx={{ mt: 2, color: P.green.shadow, fontWeight: 600 }}>Total Score: {totalScore} / 8</Typography>
                <Typography variant="body1" sx={{ mt: 1, color: P.green.shadow }}>You've filled all the gaps with correct spelling! Let's continue to the final task.</Typography>
              </Box>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Box component="button" onClick={handleContinue} sx={{ ...clayBtn('green') }}>Next: Task C →</Box>
              </Stack>
            </>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
