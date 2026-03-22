import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import DragDropGapFill from '../../../../components/DragDropGapFill.jsx'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 - Level B1 - Task A: Fill Quest
 */

const TEMPLATES_PART1 = ['We need post that could go ___.', 'We should use popular ___ to reach people.', 'We need strong ___ under photo.']
const ANSWERS_PART1 = { 'g_0_0': 'viral', 'g_1_0': 'hashtag', 'g_2_0': 'caption' }
const TEMPLATES_PART2 = ['Add ___ to make it friendly!', '___ people respond better to emotional content.', 'End with clear ___ for audience.']
const ANSWERS_PART2 = { 'g_3_0': 'emoji', 'g_4_0': 'because', 'g_5_0': 'call-to-action' }

export default function Phase4_2RemedialB1TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 1, context: 'remedial_b1' })
  const [phase, setPhase] = useState(1)
  const [part1Score, setPart1Score] = useState(null)
  const [totalScore, setTotalScore] = useState(0)
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const LIGHT = {
    pageBg: '#FFFDE7',
    blue:   { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
    green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
    teal:   { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
    orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  }
  const DARK = {
    pageBg: '#0F0F1A',
    blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
    green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
    teal:   { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
    orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  }
  const P = isDark ? DARK : LIGHT

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score })
    try {
      const response = await fetch('/api/phase4/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 1, level: 'B1', task: 'A', score, max_score: 6, completed: true })
      })
      const data = await response.json()
      if (data.success) console.log('[Phase 4.2 Step 1] B1 Task A completion logged')
    } catch (error) { console.error('Failed to log task completion:', error) }
  }

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
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.shadow }}>Level B1 - Task A: Fill Quest</Typography>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}>Fill gaps to quest through levels - correct fills advance the quest!</Typography>
          </Box>

          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage character="LILIA" message="Complete this negotiation dialogue about creating a social media post! Drag and drop the words from the word bank to fill in the blanks." />
          </Box>

          {phase === 1 && (
            <Box>
              <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow, mb: 3 }}>Part 1: Fill in the first 3 sentences</Typography>
                <DragDropGapFill wordBank={['viral', 'hashtag', 'caption']} sentences={TEMPLATES_PART1} answers={ANSWERS_PART1} onComplete={(result) => setPart1Score(result.score)} />
              </Box>
              {part1Score !== null && (
                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                  <Box component="button" onClick={() => setPhase(2)} sx={{ ...clayBtn('green') }}>Next: Part 2 →</Box>
                </Stack>
              )}
            </Box>
          )}

          {phase === 2 && (
            <Box>
              <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow, mb: 3 }}>Part 2: Fill in the next 3 sentences</Typography>
                <DragDropGapFill wordBank={['emoji', 'because', 'call-to-action']} sentences={TEMPLATES_PART2} answers={ANSWERS_PART2}
                  onComplete={(result) => {
                    const finalScore = part1Score + result.score
                    setTotalScore(finalScore)
                    sessionStorage.setItem('phase4_2_remedial_b1_taskA_score', finalScore)
                    logTaskCompletion(finalScore)
                  }}
                  startIndex={3} />
              </Box>
              {totalScore > 0 && (
                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                  <Box component="button" onClick={() => setPhase(3)} sx={{ ...clayBtn('green') }}>View Results &amp; Continue →</Box>
                </Stack>
              )}
            </Box>
          )}

          {phase === 3 && (
            <>
              <Box sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`, p: 4, mb: 3, textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.green.shadow }}>✓ Task A Complete!</Typography>
                <Typography variant="h6" sx={{ mt: 2, color: P.green.shadow, fontWeight: 600 }}>Total Score: {totalScore} / 6</Typography>
                <Typography variant="body1" sx={{ mt: 1, color: P.green.shadow }}>You've filled all the gaps with correct social media terms! Let's continue to the next task.</Typography>
              </Box>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Box component="button" onClick={() => navigate('/phase4_2/step/1/remedial/b1/taskB')} sx={{ ...clayBtn('green') }}>Next: Task B →</Box>
              </Stack>
            </>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
