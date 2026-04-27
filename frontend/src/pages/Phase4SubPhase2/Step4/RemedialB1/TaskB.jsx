import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Alert,
  Container,
  Stack,
  CircularProgress,
} from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'
import { requestPhase42TaskBScore } from '../../shared/routing.js'

const QUESTIONS = [
  { id: 1, question: 'What hashtag should we use and why?', example: 'Use #GlobalFestival for reach' },
  { id: 2, question: 'What caption should we write?', example: 'Write short caption' },
  { id: 3, question: 'What emoji should we add?', example: 'Add happy emoji' },
  { id: 4, question: 'Who should we tag?', example: 'Tag local artists' },
  { id: 5, question: 'What call-to-action should we include?', example: 'Tell people to like and share' },
  { id: 6, question: 'When should we post?', example: 'Post at 6pm when people are free' },
  { id: 7, question: 'How should people engage with the post?', example: 'Ask them to like and share' },
  { id: 8, question: 'Should we create a story? Why?', example: 'Yes, story reaches more people' },
]

export default function Phase4_2Step4RemedialB1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 4, interaction: 2, context: 'remedial_b1' })
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

  const [proposals, setProposals] = useState(Array(8).fill(''))
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(false)

  const handleInputChange = (index, value) => {
    const newProposals = [...proposals]
    newProposals[index] = value
    setProposals(newProposals)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const result = await requestPhase42TaskBScore(4, 'B1', {
        proposals: proposals.map((proposal, idx) => ({ question: QUESTIONS[idx].question, answer: proposal })),
      })
      setScore(result.score)
      setFeedback(result.feedback || [])
      setShowResults(true)
      sessionStorage.setItem('phase4_2_step4_b1_taskB', result.score.toString())
      logTaskCompletion(result.score, 8)
    } catch (error) {
      console.error('Failed to evaluate:', error)
      alert('Failed to evaluate. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 4, level: 'B1', task: 'B', score: score, max_score: maxScore, time_taken: 0 })
      })
    } catch (error) { console.error('Failed to log task:', error) }
  }

  const handleNext = () => { navigate('/phase4_2/step/4/remedial/b1/taskC') }
  window.__remedialSkip = handleNext

  const allFilled = proposals.every(p => p.trim() !== '')
  const passThreshold = 6

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: P.blue.shadow }}>Phase 4.2 Step 4 - Remedial Practice</Typography>
            <Typography variant="h6" sx={{ color: P.blue.shadow }}>Level B1 - Task B: Writing Proposals</Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Propose elements for a social media post! Write 8 simple proposals to plan the perfect post." />
          </Box>

          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 2, mb: 3 }}>
            <Typography variant="body1" sx={{ color: P.teal.shadow }}><strong>Instructions:</strong> Write 8 proposals for different elements of a social media post.</Typography>
            <Typography variant="body2" sx={{ mt: 1, color: P.teal.shadow }}><strong>Evaluation:</strong> AI checks B1 grammar and clear proposals. Each good proposal earns 1 point. Need {passThreshold}/8 to pass.</Typography>
          </Box>

          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: P.orange.shadow, mb: 1 }}>Example Proposals:</Typography>
            <Typography variant="body2" sx={{ fontStyle: 'italic', color: P.orange.shadow }}>"Use #GlobalFestival for reach"</Typography>
            <Typography variant="body2" sx={{ fontStyle: 'italic', color: P.orange.shadow }}>"Write short caption"</Typography>
          </Box>

          <Stack spacing={3} sx={{ mb: 4 }}>
            {QUESTIONS.map((item, index) => {
              const fb = feedback[index]
              return (
                <Box key={index} sx={{
                  bgcolor: showResults ? (fb?.correct ? P.green.bg : P.yellow.bg) : P.teal.bg,
                  border: `2px solid ${showResults ? (fb?.correct ? P.green.border : P.yellow.border) : P.teal.border}`,
                  borderRadius: '16px', boxShadow: `3px 3px 0 ${showResults ? (fb?.correct ? P.green.shadow : P.yellow.shadow) : P.teal.shadow}`,
                  p: 3,
                }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: P.blue.shadow, mb: 0.5 }}>{index + 1}. {item.question}</Typography>
                  <Typography variant="caption" sx={{ color: P.teal.shadow, display: 'block', mb: 1, fontStyle: 'italic' }}>Example: {item.example}</Typography>
                  <Box
                    component="textarea"
                    rows={2}
                    placeholder="Write your proposal..."
                    value={proposals[index]}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    disabled={showResults || loading}
                    sx={{ width: '100%', fontFamily: 'inherit', fontSize: '1rem', p: 1.5, border: `2px solid ${P.teal.border}`, borderRadius: '10px', bgcolor: 'white', resize: 'vertical', outline: 'none' }}
                  />
                  {showResults && fb && (
                    <Alert severity={fb.correct ? 'success' : 'info'} sx={{ mt: 1 }}>
                      <Typography variant="body2">{fb.comment}</Typography>
                    </Alert>
                  )}
                </Box>
              )
            })}
          </Stack>

          {showResults && (
            <Box sx={{
              bgcolor: score >= passThreshold ? P.green.bg : P.yellow.bg,
              border: `2px solid ${score >= passThreshold ? P.green.border : P.yellow.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${score >= passThreshold ? P.green.shadow : P.yellow.shadow}`,
              p: 3, mb: 3,
            }}>
              <Typography sx={{ color: score >= passThreshold ? P.green.shadow : P.yellow.shadow, fontWeight: 'bold' }}>
                {score >= passThreshold ? `Great work! You scored ${score}/8 points!` : `You got ${score}/8 correct. Review the feedback above!`}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            {!showResults && (
              <Box component="button" onClick={handleSubmit} disabled={!allFilled || loading} sx={{
                bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem', cursor: !allFilled || loading ? 'not-allowed' : 'pointer',
                color: P.blue.shadow, opacity: !allFilled || loading ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.blue.shadow}` },
              }}>{loading ? <><CircularProgress size={18} />&nbsp;Evaluating...</> : 'Submit Proposals'}</Box>
            )}
            {showResults && (
              <Box component="button" onClick={handleNext} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem', cursor: 'pointer', color: P.green.shadow, display: 'flex', alignItems: 'center', gap: 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` },
              }}>Continue to Task C <ArrowForwardIcon fontSize="small" /></Box>
            )}
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
