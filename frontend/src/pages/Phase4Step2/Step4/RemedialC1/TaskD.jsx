import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container, TextField } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 4 - Level C1 - Task D: Critique Game
 * Critique 6 post elements with balanced analysis (both positive and negative)
 */

const CRITIQUE_ITEMS = [
  { element: 'Hashtag', expectedPositive: 'powerful', expectedNegative: 'overuse dilutes' },
  { element: 'Caption', expectedPositive: 'concise best', expectedNegative: 'long loses readers' },
  { element: 'Emoji', expectedPositive: 'emotional connection', expectedNegative: 'excessive unprofessional' },
  { element: 'Call-to-action', expectedPositive: 'drives conversion', expectedNegative: 'pushy alienates' },
  { element: 'Viral content', expectedPositive: 'exponential reach', expectedNegative: 'unpredictable timing' },
  { element: 'Engagement metrics', expectedPositive: 'measurable success', expectedNegative: 'vanity metrics mislead' }
]

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

export default function Phase4_2Step4RemedialC1TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 4, context: 'remedial_c1' })
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT

  const [critiques, setCritiques] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleCritiqueChange = (element, value) => {
    setCritiques({ ...critiques, [element]: value })
  }

  const evaluateCritique = (text, expectedPositive, expectedNegative) => {
    const lower = text.toLowerCase()
    const hasPositive = lower.includes(expectedPositive.toLowerCase()) ||
                       expectedPositive.split(' ').some(word => lower.includes(word.toLowerCase()))
    const hasNegative = lower.includes(expectedNegative.toLowerCase()) ||
                       expectedNegative.split(' ').some(word => lower.includes(word.toLowerCase()))
    const hasBalancedStructure = (lower.includes('but ') || lower.includes('however') ||
                                  lower.includes('yet ') || lower.includes('though') ||
                                  lower.includes('while '))
    return hasPositive && hasNegative && hasBalancedStructure
  }

  const handleSubmit = () => {
    let correctCount = 0
    CRITIQUE_ITEMS.forEach(item => {
      const userCritique = critiques[item.element] || ''
      if (evaluateCritique(userCritique, item.expectedPositive, item.expectedNegative)) {
        correctCount++
      }
    })
    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase4_2_step4_c1_taskD_score', correctCount)
    logTaskCompletion(correctCount)
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskD', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 4, level: 'C1', task: 'D', score: finalScore, max_score: 6 })
      })
    } catch (error) {
      console.error('Failed to log:', error)
    }
  }

  const handleNext = () => {
    navigate('/phase4_2/step/4/remedial/c1/taskE')
  }

  const allAnswered = CRITIQUE_ITEMS.every(item => critiques[item.element]?.trim())

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: P.orange.shadow }}>Phase 4.2 Step 4 - Remedial Practice</Typography>
            <Typography variant="h6" sx={{ color: P.orange.shadow }}>Level C1 - Task D: Critique Game</Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <CharacterMessage
              character="EMNA"
              message="Critique 6 post elements with balanced analysis. Each critique must include BOTH positive and negative aspects. For example: 'Hashtags are powerful for discoverability, but overuse dilutes impact.' Score 5/6 to pass!"
            />
          </Box>

          {/* Instructions */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="body1" sx={{ color: P.teal.shadow }}>
              <strong>Instructions:</strong> Write balanced critiques that acknowledge both strengths and weaknesses. Use transitional words like 'but', 'however', 'yet', 'though', or 'while'.
            </Typography>
          </Box>

          {/* Example */}
          <Box sx={{
            bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: P.green.shadow }}>
              Example Balanced Critique:
            </Typography>
            <Typography variant="body2" sx={{ fontStyle: 'italic', color: P.green.shadow }}>
              "Hashtags are powerful for amplifying discoverability, but overuse dilutes their impact and appears spammy."
            </Typography>
          </Box>

          {/* Critique Items */}
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3,
          }}>
            {CRITIQUE_ITEMS.map((item, idx) => {
              const isCorrect = submitted && evaluateCritique(critiques[item.element] || '', item.expectedPositive, item.expectedNegative)
              return (
                <Box key={idx} sx={{
                  mb: idx < CRITIQUE_ITEMS.length - 1 ? 3 : 0,
                  p: 2, borderRadius: '12px',
                  bgcolor: submitted ? (isCorrect ? P.green.bg : P.red.bg) : 'transparent',
                  border: submitted ? `2px solid ${isCorrect ? P.green.border : P.red.border}` : 'none',
                }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: P.blue.shadow }}>
                    {idx + 1}. Critique: {item.element}
                  </Typography>
                  <TextField
                    fullWidth multiline rows={2} variant="outlined"
                    placeholder="Write a balanced critique with both positive and negative aspects..."
                    value={critiques[item.element] || ''}
                    onChange={(e) => handleCritiqueChange(item.element, e.target.value)}
                    disabled={submitted}
                    sx={{ mt: 1 }}
                  />
                  {submitted && (
                    <Typography variant="caption" sx={{
                      mt: 1, display: 'block', fontWeight: 600,
                      color: isCorrect ? P.green.shadow : P.red.shadow,
                    }}>
                      {isCorrect
                        ? 'Balanced critique with both aspects!'
                        : `Hint: Include "${item.expectedPositive}" (positive) and "${item.expectedNegative}" (negative)`}
                    </Typography>
                  )}
                </Box>
              )
            })}
          </Box>

          {/* Results */}
          {submitted && (
            <Box sx={{
              bgcolor: score >= 5 ? P.green.bg : P.yellow.bg,
              border: `2px solid ${score >= 5 ? P.green.border : P.yellow.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${score >= 5 ? P.green.shadow : P.yellow.shadow}`,
              p: 3, mb: 3,
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: score >= 5 ? P.green.shadow : P.yellow.shadow, mb: 1 }}>
                {score >= 5 ? 'Excellent Critical Analysis!' : 'Good Effort!'}
              </Typography>
              <Typography sx={{ color: score >= 5 ? P.green.shadow : P.yellow.shadow }}>
                Score: {score}/6 points (Need 5/6 to pass)
              </Typography>
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            {!submitted && (
              <Box component="button" onClick={handleSubmit} disabled={!allAnswered} sx={{
                bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: !allAnswered ? 'not-allowed' : 'pointer',
                color: P.blue.shadow, opacity: !allAnswered ? 0.5 : 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.blue.shadow}` },
              }}>Submit Critiques</Box>
            )}
            {submitted && (
              <Box component="button" onClick={handleNext} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: 'pointer', color: P.green.shadow, display: 'flex', alignItems: 'center', gap: 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` },
              }}>Continue to Task E <ArrowForwardIcon fontSize="small" /></Box>
            )}
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
