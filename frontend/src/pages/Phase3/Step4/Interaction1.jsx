import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Typography, TextField, CircularProgress, Grid, IconButton, Container, useTheme
} from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import InfoIcon from '@mui/icons-material/Info'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useProgressSave } from '../../../hooks/useProgressSave'

// ── Clay palette ──────────────────────────────────────────────────────────────
const LIGHT = {
  pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F',
  muted: '#78909C', divider: '#E0E0E0',
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
  yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825', text: '#5D4037' },
  orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
  red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#C62828' },
  teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
}
const DARK = {
  pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5',
  muted: '#607D8B', divider: '#2A2A4A',
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#A06800', text: '#FFD54F' },
  orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
  red:    { bg: '#1F0000', border: '#EF9A9A', shadow: '#B71C1C' },
  teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' } }),
}

/**
 * Phase 3 Step 4 - Interaction 1: Budget Creation
 * Students create a mini budget for the Global Cultures Festival
 */

const DEFAULT_COST_ITEMS = [
  { id: 1, name: 'Venue Rental', amount: '', description: '' },
  { id: 2, name: 'Sound System', amount: '', description: '' },
  { id: 3, name: 'Promotion', amount: '', description: '' },
  { id: 4, name: 'Logistics', amount: '', description: '' }
]

const DEFAULT_FUNDING_SOURCES = [
  { id: 1, name: 'Sponsor', amount: '', description: '' }
]

export default function Phase3Step4Interaction1() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const D = isDark ? DARK : LIGHT

  const { saveNow } = useProgressSave({ phase: 3, subphase: null, step: 4, interaction: 1, context: 'main' })
  const [costItems, setCostItems] = useState(DEFAULT_COST_ITEMS)
  const [fundingSources, setFundingSources] = useState(DEFAULT_FUNDING_SOURCES)
  const [budgetJustification, setBudgetJustification] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleAddCostItem = () => {
    const newId = Math.max(...costItems.map(i => i.id), 0) + 1
    setCostItems([...costItems, { id: newId, name: '', amount: '', description: '' }])
  }

  const handleRemoveCostItem = (id) => {
    if (costItems.length > 1) setCostItems(costItems.filter(item => item.id !== id))
  }

  const handleCostItemChange = (id, field, value) => {
    setCostItems(costItems.map(item => item.id === id ? { ...item, [field]: value } : item))
  }

  const handleAddFundingSource = () => {
    const newId = Math.max(...fundingSources.map(i => i.id), 0) + 1
    setFundingSources([...fundingSources, { id: newId, name: '', amount: '', description: '' }])
  }

  const handleRemoveFundingSource = (id) => {
    if (fundingSources.length > 1) setFundingSources(fundingSources.filter(item => item.id !== id))
  }

  const handleFundingSourceChange = (id, field, value) => {
    setFundingSources(fundingSources.map(item => item.id === id ? { ...item, [field]: value } : item))
  }

  const calculateTotal = (items) => items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)

  const handleSubmit = async () => {
    const filledCosts = costItems.filter(item => item.name.trim() && item.amount)
    const filledFunding = fundingSources.filter(item => item.name.trim() && item.amount)

    if (filledCosts.length < 1) { alert('Please add at least 1 cost item with name and amount.'); return }
    if (filledFunding.length < 1) { alert('Please add at least 1 funding source with name and amount.'); return }

    setLoading(true)

    try {
      const response = await fetch('/api/phase3/step4/evaluate-budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          costItems: filledCosts,
          fundingSources: filledFunding,
          justification: budgetJustification.trim()
        })
      })

      const data = await response.json()

      if (data.success !== false) {
        setEvaluation({ success: true, score: data.score || 1, level: data.level || 'A1', feedback: data.feedback || 'Good work on your budget!', details: data.details || {} })
        setSubmitted(true)
        sessionStorage.setItem('phase3_step4_interaction1_score', data.score || 1)
      } else {
        setEvaluation({ success: false, score: 0, level: 'Below A1', feedback: data.feedback || 'Please try again with more detail.' })
      }
    } catch (error) {
      console.error('Evaluation error:', error)

      const totalCosts = calculateTotal(filledCosts)
      const totalFunding = calculateTotal(filledFunding)
      const hasJustification = budgetJustification.trim().length > 0
      const justificationWords = budgetJustification.trim().split(/\s+/).length
      const justificationLower = budgetJustification.toLowerCase()

      const hasFinancialVocab = /\b(cost|expense|budget|sponsor|funding|donation|ticket|sales|profit|loss|need|necessary)\b/i.test(budgetJustification)
      const hasConnectors = /\b(because|so|due to|since|therefore|as|in order to)\b/i.test(budgetJustification)
      const hasComparison = /\b(more|less|expensive|cheaper|essential|important|priority|critical)\b/i.test(budgetJustification)

      let score = 0, level = 'Below A1', feedback = ''

      if (filledCosts.length >= 4 && filledFunding.length >= 1 &&
        hasJustification && justificationWords >= 40 &&
        hasFinancialVocab && hasConnectors &&
        (justificationLower.includes('balance') || justificationLower.includes('risk') ||
          justificationLower.includes('realistic') || justificationLower.includes('financial logic') ||
          justificationLower.includes('coherent') || justificationLower.includes('strategic'))) {
        score = 5; level = 'C1'
        feedback = 'Excellent! Your budget demonstrates sophisticated financial planning with realistic costs, balanced funding sources, and professional justification. You show clear understanding of financial logic and risk management.'
      } else if (filledCosts.length >= 4 && filledFunding.length >= 1 &&
        hasJustification && justificationWords >= 25 &&
        hasFinancialVocab && hasConnectors && hasComparison) {
        score = 4; level = 'B2'
        feedback = 'Very good! Your budget is well-structured with clear categories and priorities. You effectively compared costs and explained funding strategies with good use of financial vocabulary.'
      } else if (filledCosts.length >= 3 && filledFunding.length >= 1 &&
        hasJustification && justificationWords >= 15 && hasFinancialVocab) {
        score = 3; level = 'B1'
        feedback = 'Good! Your budget has clear categories and you provided justifications for your costs. You used appropriate financial vocabulary. Try adding more detail about priorities and funding strategies.'
      } else if (filledCosts.length >= 2 && filledFunding.length >= 1 &&
        (hasJustification || filledCosts.some(item => item.description))) {
        score = 2; level = 'A2'
        feedback = 'Good start! You created a simple budget with costs and funding. Try to add more justification explaining why each cost is necessary and how you will manage the budget.'
      } else if (filledCosts.length >= 1 && filledFunding.length >= 1) {
        score = 1; level = 'A1'
        feedback = 'You created a basic budget list. Try to add more cost items (at least 4) and explain why each cost is important for the festival.'
      } else {
        score = 0; level = 'Below A1'
        feedback = 'Please create a budget with at least 1 cost item and 1 funding source. Include names and amounts for each item.'
      }

      setEvaluation({ success: score > 0, score, level, feedback })
      setSubmitted(score > 0)
      if (score > 0) {
        sessionStorage.setItem('phase3_step4_interaction1_score', score)
        console.log(`[Phase 3 Step 4 - Interaction 1] Score: ${score}/5 | Level: ${level}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => navigate('/phase3/step/4/interaction/2')

  useEffect(() => { window.__remedialSkip = handleContinue }, [])

  const totalCosts = calculateTotal(costItems)
  const totalFunding = calculateTotal(fundingSources)
  const balance = totalFunding - totalCosts

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
          <Box sx={{
            bgcolor: D.yellow.bg, border: `2px solid ${D.yellow.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${D.yellow.shadow}`,
            p: 3, mb: 3,
          }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Box sx={{ px: 1.75, py: 0.4, borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800,
                bgcolor: D.orange.bg, border: `2px solid ${D.orange.border}`, color: D.orange.border }}>
                Phase 3
              </Box>
              <Box sx={{ px: 1.75, py: 0.4, borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800,
                bgcolor: D.green.bg, border: `2px solid ${D.green.border}`, color: D.green.border }}>
                Step 4 — Interaction 1
              </Box>
            </Box>
            <Typography variant="h5" fontWeight={800} sx={{ color: D.heading }}>
              Sponsorship &amp; Budgeting
            </Typography>
            <Typography variant="body2" sx={{ color: D.body, mt: 0.5 }}>
              Create a Mini Budget for the Global Cultures Festival
            </Typography>
          </Box>
        </motion.div>

        {/* Instructor Message */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Box sx={{ bgcolor: D.cardBg, border: `2px solid ${D.divider}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${D.divider}`, p: 3, mb: 3 }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Now it's time to create your own budget! Think about what the festival needs and how much each item might cost. Then, decide where the money will come from. Don't worry about being perfect—just make realistic estimates and explain your thinking."
            />
          </Box>
        </motion.div>

        {/* Instructions */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          <Box sx={{
            bgcolor: D.blue.bg, border: `2px solid ${D.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${D.blue.shadow}`,
            p: 3, mb: 3, display: 'flex', gap: 2,
          }}>
            <InfoIcon sx={{ color: D.blue.border, mt: 0.3, flexShrink: 0 }} />
            <Box>
              <Typography variant="body2" fontWeight={800} sx={{ color: D.heading, mb: 1 }}>Instructions:</Typography>
              {[
                '1. List at least 4 cost items (e.g., venue, sound, promotion, logistics)',
                '2. Add at least 1 funding source (sponsor, ticket sales, donation)',
                '3. Write a short justification explaining your budget choices',
              ].map((t, i) => (
                <Typography key={i} variant="body2" sx={{ color: D.body, mb: 0.5 }}>{t}</Typography>
              ))}
            </Box>
          </Box>
        </motion.div>

        {/* Cost Items */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
          <Box sx={{ bgcolor: D.cardBg, border: `2px solid ${D.red.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${D.red.shadow}`, p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
              <AccountBalanceIcon sx={{ color: D.red.border }} />
              <Typography variant="h6" fontWeight={800} sx={{ color: D.red.border }}>
                Cost Items (Expenses)
              </Typography>
            </Box>

            {costItems.map((item) => (
              <Box key={item.id} sx={{ bgcolor: D.pageBg, border: `1px solid ${D.divider}`, borderRadius: '14px', p: 2, mb: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth size="small" label="Cost Item Name" placeholder="e.g., Venue Rental"
                      value={item.name} onChange={(e) => handleCostItemChange(item.id, 'name', e.target.value)}
                      disabled={submitted} sx={inputSx} />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField fullWidth size="small" type="number" label="Amount (TND)" placeholder="500"
                      value={item.amount} onChange={(e) => handleCostItemChange(item.id, 'amount', e.target.value)}
                      disabled={submitted} sx={inputSx} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth size="small" label="Description (optional)" placeholder="Why needed?"
                      value={item.description} onChange={(e) => handleCostItemChange(item.id, 'description', e.target.value)}
                      disabled={submitted} sx={inputSx} />
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    {costItems.length > 1 && !submitted && (
                      <IconButton color="error" onClick={() => handleRemoveCostItem(item.id)} size="small">
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              </Box>
            ))}

            {!submitted && (
              <Box
                component="button"
                onClick={handleAddCostItem}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 0.5,
                  px: 2, py: 0.75, bgcolor: 'transparent',
                  border: `2px solid ${D.divider}`, borderRadius: '14px',
                  fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                  color: D.body, mb: 2,
                  '&:hover': { borderColor: D.red.border, color: D.red.border },
                }}
              >
                <AddIcon fontSize="small" /> Add Cost Item
              </Box>
            )}

            <Box sx={{ borderTop: `2px solid ${D.divider}`, pt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Typography variant="h6" fontWeight={800} sx={{ color: D.red.border }}>
                Total Costs: {totalCosts.toFixed(2)} TND
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Funding Sources */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
          <Box sx={{ bgcolor: D.cardBg, border: `2px solid ${D.green.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${D.green.shadow}`, p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
              <AttachMoneyIcon sx={{ color: D.green.border }} />
              <Typography variant="h6" fontWeight={800} sx={{ color: D.green.border }}>
                Funding Sources (Income)
              </Typography>
            </Box>

            {fundingSources.map((item) => (
              <Box key={item.id} sx={{ bgcolor: D.pageBg, border: `1px solid ${D.divider}`, borderRadius: '14px', p: 2, mb: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth size="small" label="Funding Source Name" placeholder="e.g., Sponsor, Ticket Sales"
                      value={item.name} onChange={(e) => handleFundingSourceChange(item.id, 'name', e.target.value)}
                      disabled={submitted} sx={inputSx} />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField fullWidth size="small" type="number" label="Amount (TND)" placeholder="1000"
                      value={item.amount} onChange={(e) => handleFundingSourceChange(item.id, 'amount', e.target.value)}
                      disabled={submitted} sx={inputSx} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth size="small" label="Description (optional)" placeholder="Where from?"
                      value={item.description} onChange={(e) => handleFundingSourceChange(item.id, 'description', e.target.value)}
                      disabled={submitted} sx={inputSx} />
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    {fundingSources.length > 1 && !submitted && (
                      <IconButton color="error" onClick={() => handleRemoveFundingSource(item.id)} size="small">
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              </Box>
            ))}

            {!submitted && (
              <Box
                component="button"
                onClick={handleAddFundingSource}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 0.5,
                  px: 2, py: 0.75, bgcolor: 'transparent',
                  border: `2px solid ${D.divider}`, borderRadius: '14px',
                  fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                  color: D.body, mb: 2,
                  '&:hover': { borderColor: D.green.border, color: D.green.border },
                }}
              >
                <AddIcon fontSize="small" /> Add Funding Source
              </Box>
            )}

            <Box sx={{ borderTop: `2px solid ${D.divider}`, pt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Typography variant="h6" fontWeight={800} sx={{ color: D.green.border }}>
                Total Funding: {totalFunding.toFixed(2)} TND
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Budget Summary */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}>
          <Box sx={{
            bgcolor: balance >= 0 ? D.green.bg : D.red.bg,
            border: `2px solid ${balance >= 0 ? D.green.border : D.red.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${balance >= 0 ? D.green.shadow : D.red.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h6" fontWeight={800} sx={{ color: D.heading, mb: 2 }}>Budget Summary</Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="caption" sx={{ color: D.muted }}>Total Costs:</Typography>
                <Typography variant="h6" fontWeight={800} sx={{ color: D.red.border }}>{totalCosts.toFixed(2)} TND</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="caption" sx={{ color: D.muted }}>Total Funding:</Typography>
                <Typography variant="h6" fontWeight={800} sx={{ color: D.green.border }}>{totalFunding.toFixed(2)} TND</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="caption" sx={{ color: D.muted }}>Balance:</Typography>
                <Typography variant="h6" fontWeight={800} sx={{ color: balance >= 0 ? D.green.border : D.red.border }}>
                  {balance >= 0 ? '+' : ''}{balance.toFixed(2)} TND
                </Typography>
              </Grid>
            </Grid>
            {balance < 0 && (
              <Box sx={{ mt: 2, p: 2, bgcolor: D.yellow.bg, border: `2px solid ${D.yellow.border}`, borderRadius: '12px' }}>
                <Typography variant="body2" sx={{ color: D.body }}>
                  Your costs exceed your funding. Consider adding more funding sources or reducing costs.
                </Typography>
              </Box>
            )}
          </Box>
        </motion.div>

        {/* Justification */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6}>
          <Box sx={{ bgcolor: D.cardBg, border: `2px solid ${D.divider}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${D.divider}`, p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight={800} sx={{ color: D.heading, mb: 1 }}>Budget Justification</Typography>
            <Typography variant="body2" sx={{ color: D.body, mb: 2 }}>
              Explain why you chose these costs and funding sources. What are your priorities?
            </Typography>
            <TextField
              fullWidth multiline rows={5} variant="outlined"
              placeholder="..."
              value={budgetJustification}
              onChange={(e) => setBudgetJustification(e.target.value)}
              disabled={submitted}
              sx={{ ...inputSx, mb: 1 }}
            />
            <Typography variant="caption" sx={{ color: D.muted }}>
              Words: {budgetJustification.trim().split(/\s+/).filter(w => w.length > 0).length}
            </Typography>
          </Box>
        </motion.div>

        {/* Submit */}
        {!submitted && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={7}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Box
                component="button"
                onClick={handleSubmit}
                disabled={loading}
                sx={{
                  px: 5, py: 1.5,
                  bgcolor: D.yellow.bg, border: `2px solid ${D.yellow.border}`,
                  borderRadius: '14px', boxShadow: `4px 4px 0 ${D.yellow.shadow}`,
                  fontWeight: 800, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
                  color: D.yellow.border, opacity: loading ? 0.7 : 1,
                  '&:hover:not(:disabled)': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.yellow.shadow}` },
                }}
              >
                {loading ? <CircularProgress size={22} /> : 'Submit Budget'}
              </Box>
            </Box>
          </motion.div>
        )}

        {/* Evaluation */}
        {evaluation && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={8}>
            <Box sx={{
              bgcolor: evaluation.success ? D.green.bg : D.yellow.bg,
              border: `2px solid ${evaluation.success ? D.green.border : D.yellow.border}`,
              borderRadius: '20px',
              boxShadow: `4px 4px 0 ${evaluation.success ? D.green.shadow : D.yellow.shadow}`,
              p: 3, mb: 3,
            }}>
              <Typography variant="h6" fontWeight={800} sx={{ color: evaluation.success ? D.green.border : D.yellow.border, mb: 2 }}>
                {evaluation.success ? 'Budget Submitted!' : 'Try Again'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Box sx={{ px: 1.75, py: 0.4, borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800,
                  bgcolor: D.blue.bg, border: `2px solid ${D.blue.border}`, color: D.blue.border }}>
                  Level: {evaluation.level}
                </Box>
                <Box sx={{ px: 1.75, py: 0.4, borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800,
                  bgcolor: D.green.bg, border: `2px solid ${D.green.border}`, color: D.green.border }}>
                  Score: +{evaluation.score} point{evaluation.score !== 1 ? 's' : ''}
                </Box>
              </Box>

              <Typography variant="body1" sx={{ color: D.body, mb: 2 }}>{evaluation.feedback}</Typography>

              {evaluation.details && (
                <Box sx={{ p: 2, bgcolor: D.cardBg, borderRadius: '12px', mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ color: D.heading, mb: 1 }}>
                    Evaluation Details:
                  </Typography>
                  {evaluation.details.vocabulary && (
                    <Typography variant="body2" sx={{ color: D.body }}>Vocabulary: {evaluation.details.vocabulary}</Typography>
                  )}
                  {evaluation.details.organization && (
                    <Typography variant="body2" sx={{ color: D.body }}>Organization: {evaluation.details.organization}</Typography>
                  )}
                </Box>
              )}

              {submitted && (
                <Box
                  component="button"
                  onClick={handleContinue}
                  sx={{
                    width: '100%', py: 1.5,
                    bgcolor: D.green.bg, border: `2px solid ${D.green.border}`,
                    borderRadius: '14px', boxShadow: `4px 4px 0 ${D.green.shadow}`,
                    fontWeight: 800, fontSize: '1rem', cursor: 'pointer', color: D.green.border,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                    '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.green.shadow}` },
                  }}
                >
                  <CheckCircleIcon /> Continue to Sponsor Pitch
                </Box>
              )}
            </Box>
          </motion.div>
        )}

      </Container>
    </Box>
  )
}
