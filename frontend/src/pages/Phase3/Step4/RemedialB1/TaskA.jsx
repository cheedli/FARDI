import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, TextField, Grid, Container, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import InfoIcon from '@mui/icons-material/Info'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
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
  purple: { bg: '#E1BEE7', border: '#8E24AA', shadow: '#8E24AA' },
}
const DARK = {
  pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5',
  muted: '#607D8B', divider: '#2A2A4A',
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#A06800', text: '#FFD54F' },
  orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
  teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
  purple: { bg: '#1E0A2E', border: '#CE93D8', shadow: '#7B1FA2' },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' } }),
}

/**
 * Phase 3 Step 4 - Level B1 - Task A: Budget + Justification Paragraph
 * Create a simple budget and write a justification paragraph
 */

export default function Phase3Step4RemedialB1TaskA() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const D = isDark ? DARK : LIGHT

  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 4, interaction: 1, context: 'remedial_b1' })
  const [budgetItems, setBudgetItems] = useState({ item1: '', cost1: '', item2: '', cost2: '', item3: '', cost3: '' })
  const [justification, setJustification] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [evaluation, setEvaluation] = useState(null)

  const handleBudgetChange = (field, value) => setBudgetItems({ ...budgetItems, [field]: value })

  const handleSubmit = () => {
    const filledItems = [
      budgetItems.item1 && budgetItems.cost1,
      budgetItems.item2 && budgetItems.cost2,
      budgetItems.item3 && budgetItems.cost3
    ].filter(Boolean).length

    const justWords = justification.trim().split(/\s+/).length
    const justLower = justification.toLowerCase()
    const hasConnectors = /\b(because|so|since|therefore|due to)\b/.test(justLower)
    const hasFinancialVocab = /\b(cost|budget|sponsor|funding|money|expense|need)\b/.test(justLower)

    let score = 0, feedback = ''
    score += filledItems

    if (justWords >= 30 && hasConnectors && hasFinancialVocab) {
      score += 3
      feedback = 'Excellent! Your budget is clear and your justification is well-explained with good vocabulary and connectors.'
    } else if (justWords >= 20 && hasConnectors) {
      score += 2
      feedback = 'Good! Your budget is clear. Your justification could use more financial vocabulary and detail.'
    } else if (justWords >= 10) {
      score += 1
      feedback = "You created a budget and provided some justification. Try to write more (20+ words) and use connectors like 'because' or 'so'."
    } else {
      feedback = 'Your budget needs a longer justification explaining why each cost is necessary.'
    }

    setEvaluation({ score, maxScore: 6, feedback, budgetScore: filledItems, justificationScore: score - filledItems })
    setShowResults(true)
    logTaskCompletion(score, 6)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      await fetch('/api/phase3/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ level: 'B1', task: 'A', score: score, max_score: maxScore, time_taken: 0, step: 4 })
      })
    } catch (error) { console.error('Failed to log task:', error) }
  }

  const handleNext = () => navigate('/app/dashboard')

  const budgetComplete = budgetItems.item1 && budgetItems.cost1 &&
    budgetItems.item2 && budgetItems.cost2 && budgetItems.item3 && budgetItems.cost3
  const justificationComplete = justification.trim().length >= 10
  const canSubmit = budgetComplete && justificationComplete
  const passThreshold = 4

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
          <Box sx={{ bgcolor: D.blue.bg, border: `2px solid ${D.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${D.blue.shadow}`, p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Box sx={{ px: 1.75, py: 0.4, borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800, bgcolor: D.purple.bg, border: `2px solid ${D.purple.border}`, color: D.purple.border }}>B1 Level</Box>
              <Box sx={{ px: 1.75, py: 0.4, borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800, bgcolor: D.orange.bg, border: `2px solid ${D.orange.border}`, color: D.orange.border }}>Remedial Practice</Box>
            </Box>
            <Typography variant="h5" fontWeight={800} sx={{ color: D.heading }}>Phase 3 Step 4 — Remedial Practice</Typography>
            <Typography variant="body2" fontWeight={700} sx={{ color: D.body, mt: 0.5 }}>Level B1 — Task A: Budget + Justification</Typography>
          </Box>
        </motion.div>

        {/* Instructor Message */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Box sx={{ bgcolor: D.cardBg, border: `2px solid ${D.divider}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${D.divider}`, p: 3, mb: 3 }}>
            <CharacterMessage
              speaker="Emna"
              message="Create a simple budget with 3 cost items, then write a paragraph explaining why these costs are necessary. Use connectors like 'because' and 'so' to make your explanation clear."
            />
          </Box>
        </motion.div>

        {/* Instructions */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          <Box sx={{ bgcolor: D.blue.bg, border: `2px solid ${D.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${D.blue.shadow}`, p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <InfoIcon sx={{ color: D.blue.border, flexShrink: 0 }} />
              <Typography variant="body1" fontWeight={800} sx={{ color: D.heading }}>Instructions:</Typography>
            </Box>
            {['1. Fill in 3 budget items with costs', '2. Write a justification paragraph (20+ words)', '3. Use connectors: because, so, since'].map((t, i) => (
              <Typography key={i} variant="body2" sx={{ color: D.body, mb: 0.5 }}>{t}</Typography>
            ))}
          </Box>
        </motion.div>

        {/* Budget Items */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
          <Box sx={{ bgcolor: D.cardBg, border: `2px solid ${D.divider}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${D.divider}`, p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <AccountBalanceIcon sx={{ color: D.heading }} />
              <Typography variant="h6" fontWeight={800} sx={{ color: D.heading }}>Festival Budget Items</Typography>
            </Box>
            <Grid container spacing={2}>
              {[1, 2, 3].map(num => (
                <React.Fragment key={num}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth size="small" label={`Cost Item ${num}`}
                      placeholder="e.g., Venue Rental, Sound System"
                      value={budgetItems[`item${num}`]}
                      onChange={(e) => handleBudgetChange(`item${num}`, e.target.value)}
                      disabled={showResults} sx={inputSx}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth size="small" label="Cost Amount"
                      placeholder="e.g., 500 TND"
                      value={budgetItems[`cost${num}`]}
                      onChange={(e) => handleBudgetChange(`cost${num}`, e.target.value)}
                      disabled={showResults} sx={inputSx}
                    />
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>
          </Box>
        </motion.div>

        {/* Justification */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
          <Box sx={{ bgcolor: D.cardBg, border: `2px solid ${D.divider}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${D.divider}`, p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight={800} sx={{ color: D.heading, mb: 1 }}>Budget Justification</Typography>
            <Typography variant="body2" sx={{ color: D.body, mb: 2 }}>
              Explain why these costs are necessary and how you will manage the budget.
            </Typography>
            <TextField
              fullWidth multiline rows={5}
              placeholder="Example: We need a venue because the festival requires a large space for performances. The sound system is expensive, so we must find a sponsor. Promotion costs are necessary because we want many people to attend..."
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              disabled={showResults}
              sx={inputSx}
            />
            <Typography variant="caption" sx={{ color: D.muted, mt: 1, display: 'block' }}>
              Words: {justification.trim().split(/\s+/).filter(w => w.length > 0).length} (Need at least 20)
            </Typography>
          </Box>
        </motion.div>

        {/* Results */}
        {showResults && evaluation && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}>
            <Box sx={{
              bgcolor: evaluation.score >= passThreshold ? D.green.bg : D.yellow.bg,
              border: `2px solid ${evaluation.score >= passThreshold ? D.green.border : D.yellow.border}`,
              borderRadius: '20px',
              boxShadow: `4px 4px 0 ${evaluation.score >= passThreshold ? D.green.shadow : D.yellow.shadow}`,
              p: 3, mb: 3,
            }}>
              <Typography variant="h6" fontWeight={800} sx={{ color: D.heading, mb: 1 }}>Task Complete!</Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <Box sx={{ px: 1.75, py: 0.4, borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800, bgcolor: D.cardBg, border: `2px solid ${evaluation.score >= passThreshold ? D.green.border : D.yellow.border}`, color: evaluation.score >= passThreshold ? D.green.border : D.yellow.border }}>
                  Total: {evaluation.score}/{evaluation.maxScore}
                </Box>
                <Box sx={{ px: 1.75, py: 0.4, borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800, bgcolor: D.blue.bg, border: `2px solid ${D.blue.border}`, color: D.blue.border }}>
                  Budget: {evaluation.budgetScore}/3
                </Box>
                <Box sx={{ px: 1.75, py: 0.4, borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800, bgcolor: D.green.bg, border: `2px solid ${D.green.border}`, color: D.green.border }}>
                  Justification: {evaluation.justificationScore}/3
                </Box>
              </Box>
              <Typography variant="body1" sx={{ color: D.body }}>{evaluation.feedback}</Typography>
            </Box>
          </motion.div>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          {!showResults && (
            <Box
              component="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              sx={{
                px: 4, py: 1.5,
                bgcolor: D.blue.bg, border: `2px solid ${D.blue.border}`,
                borderRadius: '14px', boxShadow: `4px 4px 0 ${D.blue.shadow}`,
                fontWeight: 800, fontSize: '1rem', cursor: !canSubmit ? 'not-allowed' : 'pointer',
                color: D.blue.border, opacity: !canSubmit ? 0.6 : 1,
                '&:hover:not(:disabled)': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.blue.shadow}` },
              }}
            >
              Submit Budget &amp; Justification
            </Box>
          )}
          {showResults && (
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
              Complete B1 Task <ArrowForwardIcon fontSize="small" />
            </Box>
          )}
        </Box>

      </Container>
    </Box>
  )
}
