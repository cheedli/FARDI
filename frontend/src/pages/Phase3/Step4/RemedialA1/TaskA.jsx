import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, TextField, Grid, Container, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import InfoIcon from '@mui/icons-material/Info'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { useProgressSave } from '../../../../hooks/useProgressSave'

// ── Clay palette ──────────────────────────────────────────────────────────────
const LIGHT = {
  pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F',
  muted: '#78909C', divider: '#E0E0E0',
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
  yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825', text: '#5D4037' },
  orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
  teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
  red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#C62828' },
}
const DARK = {
  pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5',
  muted: '#607D8B', divider: '#2A2A4A',
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#A06800', text: '#FFD54F' },
  orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
  teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
  red:    { bg: '#1F0000', border: '#EF9A9A', shadow: '#B71C1C' },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' } }),
}

/**
 * Phase 3 Step 4 - Level A1 - Task A: Fill-in Budget Template
 * Simple budget template with basic cost words + sponsor
 */

const BUDGET_TEMPLATE = [
  { id: 'venue', label: 'Venue', placeholder: 'Cost for venue' },
  { id: 'sound', label: 'Sound', placeholder: 'Cost for sound' },
  { id: 'food', label: 'Food', placeholder: 'Cost for food' },
  { id: 'sponsor', label: 'Sponsor', placeholder: 'Money from sponsor' }
]

export default function Phase3Step4RemedialA1TaskA() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const D = isDark ? DARK : LIGHT

  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 4, interaction: 1, context: 'remedial_a1' })
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerChange = (id, value) => setAnswers({ ...answers, [id]: value })

  const handleSubmit = () => {
    let correctCount = 0
    BUDGET_TEMPLATE.forEach(item => {
      const answer = answers[item.id]?.trim()
      if (answer && answer.length >= 2) correctCount++
    })
    setScore(correctCount)
    setShowResults(true)
    logTaskCompletion(correctCount, BUDGET_TEMPLATE.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      await fetch('/api/phase3/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ level: 'A1', task: 'A', score: score, max_score: maxScore, time_taken: 0, step: 4 })
      })
    } catch (error) { console.error('Failed to log task:', error) }
  }

  const handleNext = () => navigate('/phase3/step/4/interaction/1')

  const allAnswered = BUDGET_TEMPLATE.every(item => answers[item.id]?.trim()?.length >= 2)
  const passThreshold = 3

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      bgcolor: D.cardBg,
      '& fieldset': { borderColor: D.divider },
      '&:hover fieldset': { borderColor: D.blue.border },
    },
    '& .MuiInputBase-input': { color: D.body },
    '& .MuiInputLabel-root': { color: D.muted },
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: D.pageBg }}>
      <Container maxWidth="md" sx={{ pt: { xs: 3, md: 4 }, pb: 6 }}>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Box sx={{ bgcolor: D.teal.bg, border: `2px solid ${D.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${D.teal.shadow}`, p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Box sx={{ px: 1.75, py: 0.4, borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800, bgcolor: D.blue.bg, border: `2px solid ${D.blue.border}`, color: D.blue.border }}>A1 Level</Box>
              <Box sx={{ px: 1.75, py: 0.4, borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800, bgcolor: D.orange.bg, border: `2px solid ${D.orange.border}`, color: D.orange.border }}>Remedial Practice</Box>
            </Box>
            <Typography variant="h5" fontWeight={800} sx={{ color: D.heading }}>Phase 3 Step 4 — Remedial Practice</Typography>
            <Typography variant="body2" fontWeight={700} sx={{ color: D.body, mt: 0.5 }}>Level A1 — Task A: Fill-in Budget Template</Typography>
          </Box>
        </motion.div>

        {/* Instructor Message */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Box sx={{ bgcolor: D.cardBg, border: `2px solid ${D.divider}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${D.divider}`, p: 3, mb: 3 }}>
            <CharacterMessage
              speaker="Emna"
              message="Let's create a very simple budget! Fill in the template below with costs and funding. You can use simple words or numbers like '100 TND' or 'money for stage'."
            />
          </Box>
        </motion.div>

        {/* Instructions */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          <Box sx={{ bgcolor: D.blue.bg, border: `2px solid ${D.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${D.blue.shadow}`, p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <InfoIcon sx={{ color: D.blue.border, flexShrink: 0 }} />
              <Typography variant="body1" fontWeight={800} sx={{ color: D.heading }}>Instructions: Complete each line of the budget template.</Typography>
            </Box>
            {[
              '• Write a cost or amount for each item',
              '• Use simple words: "100", "200 TND", "money for..."',
            ].map((t, i) => <Typography key={i} variant="body2" sx={{ color: D.body, mb: 0.5 }}>{t}</Typography>)}
            <Box sx={{ mt: 1, px: 1.75, py: 0.4, display: 'inline-flex', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800, bgcolor: D.green.bg, border: `2px solid ${D.green.border}`, color: D.green.border }}>
              Passing score: Minimum 3/4 items filled
            </Box>
          </Box>
        </motion.div>

        {/* Budget Template */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
          <Box sx={{ bgcolor: D.cardBg, border: `2px solid ${D.divider}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${D.divider}`, p: 3, mb: 4 }}>
            <Typography variant="h6" fontWeight={800} sx={{ color: D.heading, mb: 2 }}>Festival Budget Template</Typography>
            <Grid container spacing={2}>
              {BUDGET_TEMPLATE.map((item) => {
                const answered = answers[item.id]?.trim()?.length >= 2
                const rowBg = showResults ? (answered ? D.green.bg : D.red.bg) : D.pageBg
                const rowBorder = showResults ? (answered ? D.green.border : D.red.border) : D.divider
                return (
                  <Grid item xs={12} key={item.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, bgcolor: rowBg, border: `2px solid ${rowBorder}`, borderRadius: '14px', mb: 1 }}>
                      <Typography variant="body1" fontWeight={800} sx={{ minWidth: 100, color: D.heading }}>
                        {item.label}:
                      </Typography>
                      <TextField
                        fullWidth size="small"
                        placeholder={item.placeholder}
                        value={answers[item.id] || ''}
                        onChange={(e) => handleAnswerChange(item.id, e.target.value)}
                        disabled={showResults}
                        sx={inputSx}
                      />
                      {showResults && (answered
                        ? <CheckCircleIcon sx={{ color: D.green.border, flexShrink: 0 }} />
                        : <WarningAmberIcon sx={{ color: D.red.border, flexShrink: 0 }} />
                      )}
                    </Box>

                    {showResults && (
                      <Box sx={{ ml: 1, mb: 1 }}>
                        <Typography variant="body2" sx={{ color: answered ? D.green.border : D.red.border, fontWeight: 700 }}>
                          {answered
                            ? <>Good! You wrote: <strong>{answers[item.id]}</strong></>
                            : <>You need to fill in this item. Example: "100 TND" or "money from company"</>}
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                )
              })}
            </Grid>
          </Box>
        </motion.div>

        {/* Results Summary */}
        {showResults && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
            <Box sx={{
              bgcolor: score >= passThreshold ? D.green.bg : D.yellow.bg,
              border: `2px solid ${score >= passThreshold ? D.green.border : D.yellow.border}`,
              borderRadius: '20px',
              boxShadow: `4px 4px 0 ${score >= passThreshold ? D.green.shadow : D.yellow.shadow}`,
              p: 3, mb: 3,
            }}>
              <Typography variant="h6" fontWeight={800} sx={{ color: D.heading, mb: 1 }}>Task Complete!</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Box sx={{ px: 1.75, py: 0.4, borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800, bgcolor: D.cardBg, border: `2px solid ${score >= passThreshold ? D.green.border : D.yellow.border}`, color: score >= passThreshold ? D.green.border : D.yellow.border }}>
                  Score: {score}/{BUDGET_TEMPLATE.length}
                </Box>
              </Box>
              <Typography variant="body1" sx={{ color: D.body }}>
                {score === BUDGET_TEMPLATE.length
                  ? 'Perfect! You filled in all items!'
                  : score >= passThreshold
                    ? `Good job! You passed with ${score} items filled.`
                    : `You need ${passThreshold} items filled to pass. Try filling in all the blanks.`}
              </Typography>
            </Box>
          </motion.div>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          {!showResults && (
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
              <Box
                component="button"
                onClick={handleSubmit}
                disabled={!allAnswered}
                sx={{
                  px: 4, py: 1.5,
                  bgcolor: D.blue.bg, border: `2px solid ${D.blue.border}`,
                  borderRadius: '14px', boxShadow: `4px 4px 0 ${D.blue.shadow}`,
                  fontWeight: 800, fontSize: '1rem', cursor: !allAnswered ? 'not-allowed' : 'pointer',
                  color: D.blue.border, opacity: !allAnswered ? 0.6 : 1,
                  '&:hover:not(:disabled)': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.blue.shadow}` },
                }}
              >
                Submit Budget
              </Box>
            </motion.div>
          )}
          {showResults && (
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}>
              <Box
                component="button"
                onClick={handleNext}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1,
                  px: 4, py: 1.5,
                  bgcolor: D.green.bg, border: `2px solid ${D.green.border}`,
                  borderRadius: '14px', boxShadow: `4px 4px 0 ${D.green.shadow}`,
                  fontWeight: 800, fontSize: '1rem', cursor: 'pointer', color: D.green.border,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.green.shadow}` },
                }}
              >
                Retry Step 4 <ArrowForwardIcon fontSize="small" />
              </Box>
            </motion.div>
          )}
        </Box>

      </Container>
    </Box>
  )
}
