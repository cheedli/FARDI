import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Grid, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 3 Step 2 - Interaction 1: Budget Observation
 * Guided Noticing: Circle items that cost money and underline items that bring money
 */

const BUDGET_ITEMS = [
  { id: 1, name: 'Venue rental', type: 'cost', amount: '$800', icon: '🏢' },
  { id: 2, name: 'Ticket sales', type: 'income', amount: '$1,000', icon: '🎫' },
  { id: 3, name: 'Sound equipment', type: 'cost', amount: '$500', icon: '🔊' },
  { id: 4, name: 'Sponsor donation (TechCorp)', type: 'income', amount: '$800', icon: '💼' },
  { id: 5, name: 'Catering', type: 'cost', amount: '$600', icon: '🍽️' },
  { id: 6, name: 'University grant', type: 'income', amount: '$300', icon: '🏛️' },
  { id: 7, name: 'Promotion & printing', type: 'cost', amount: '$200', icon: '📄' },
  { id: 8, name: 'Food sponsor (CaféPlus)', type: 'income', amount: '$400', icon: '☕' },
  { id: 9, name: 'Decoration', type: 'cost', amount: '$300', icon: '🎨' },
  { id: 10, name: 'Donations', type: 'income', amount: '$100', icon: '💝' }
]

const LIGHT = {
  pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', divider: '#E0E0E0',
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
  yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825', text: '#5D4037' },
  teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
  orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
  red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#C62828' },
  purple: { bg: '#E1BEE7', border: '#8E24AA', shadow: '#8E24AA' },
}
const DARK = {
  pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', divider: '#2A2A4A',
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#A06800', text: '#FFD54F' },
  teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
  orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
  red:    { bg: '#1F0000', border: '#EF9A9A', shadow: '#B71C1C' },
  purple: { bg: '#1E0A2E', border: '#CE93D8', shadow: '#7B1FA2' },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4, ease: 'easeOut' } }),
}

function clay(c) {
  return {
    bgcolor: c.bg,
    border: `2px solid ${c.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${c.shadow}`,
  }
}

export default function Phase3Step2Interaction1() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 2, interaction: 1, context: 'main' })
  const [selections, setSelections] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const D = isDark ? DARK : LIGHT

  const handleItemClick = (itemId, selectedType) => {
    if (showResults) return
    if (selections[itemId] === selectedType) {
      const newSelections = { ...selections }
      delete newSelections[itemId]
      setSelections(newSelections)
    } else {
      setSelections({ ...selections, [itemId]: selectedType })
    }
  }

  const handleSubmit = () => {
    let correctCount = 0
    BUDGET_ITEMS.forEach(item => {
      if (selections[item.id] === item.type) correctCount++
    })
    setScore(correctCount)
    setShowResults(true)
    sessionStorage.setItem('phase3_step2_int1_score', correctCount.toString())
    sessionStorage.setItem('phase3_step2_int1_max', BUDGET_ITEMS.length.toString())
    logTaskCompletion(correctCount, BUDGET_ITEMS.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction1', is_correct: true, score: score })
    try {
      await fetch('/api/phase3/interaction/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ step: 2, interaction: 1, score, max_score: maxScore, time_taken: 0, completed: true })
      })
    } catch (error) {
      console.error('Failed to log interaction:', error)
    }
  }

  const handleContinue = () => {
    navigate('/app/phase3/step/2/interaction/2')
  }

  const allItemsLabeled = Object.keys(selections).length === BUDGET_ITEMS.length

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: D.pageBg }}>
      <Container maxWidth="md" sx={{ pt: { xs: 3, md: 4 }, pb: 6 }}>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Box sx={{ ...clay(D.green), p: 3, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <MenuBookIcon sx={{ fontSize: 40, color: D.green.border }} />
            <Box>
              <Typography variant="h5" fontWeight={800} sx={{ color: D.heading, lineHeight: 1.2 }}>
                Phase 3 Step 2: Explore
              </Typography>
              <Typography variant="body2" sx={{ color: D.body, mt: 0.5 }}>
                Interaction 1: Budget Observation
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Character Message */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Box sx={{ ...clay(D.blue), p: 3, mb: 3 }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Look at the budget table below. For each item, identify whether it costs money (expense) or brings money (income). Click 'COST' for items that require spending, and 'INCOME' for items that bring money to the event."
            />
          </Box>
        </motion.div>

        {/* Instructions */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          <Box sx={{ ...clay(D.teal), p: 2.5, mb: 3 }}>
            <Typography variant="body1" fontWeight={800} sx={{ color: D.heading, mb: 1 }}>
              Instructions:
            </Typography>
            {[
              'Look at each budget item below',
              'Click COST if the item requires money to be spent',
              'Click INCOME if the item brings money to the event',
            ].map((t, i) => (
              <Typography key={i} variant="body2" sx={{ color: D.body, mb: 0.5 }}>• {t}</Typography>
            ))}
          </Box>
        </motion.div>

        {/* Progress pill */}
        {!showResults && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Box component="span" sx={{
                px: 1.75, py: 0.4, borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800,
                bgcolor: D.blue.bg, color: D.blue.border, border: `2px solid ${D.blue.border}`,
              }}>
                Items Labeled: {Object.keys(selections).length}/{BUDGET_ITEMS.length}
              </Box>
            </Box>
          </motion.div>
        )}

        {/* Budget Items Grid */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {BUDGET_ITEMS.map((item, idx) => {
            const userSelection = selections[item.id]
            const isCorrect = showResults && userSelection === item.type
            const isIncorrect = showResults && userSelection && userSelection !== item.type
            const cardColor = showResults
              ? isCorrect ? D.green : isIncorrect ? D.red : { bg: D.cardBg, border: D.divider, shadow: D.divider }
              : userSelection
                ? D.blue
                : { bg: D.cardBg, border: D.divider, shadow: D.divider }

            return (
              <Grid item xs={12} sm={6} key={item.id}>
                <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4 + idx}>
                  <Box sx={{ ...clay(cardColor), p: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Typography sx={{ fontSize: '2rem' }}>{item.icon}</Typography>
                        <Box>
                          <Typography variant="body1" fontWeight={700} sx={{ color: D.heading }}>
                            {item.name}
                          </Typography>
                          <Typography variant="body2" fontWeight={700} sx={{ color: D.muted }}>
                            {item.amount}
                          </Typography>
                        </Box>
                      </Box>
                      {showResults && isCorrect && <CheckCircleIcon sx={{ color: D.green.border, fontSize: 28 }} />}
                      {showResults && isIncorrect && <RemoveCircleIcon sx={{ color: D.red.border, fontSize: 28 }} />}
                    </Box>

                    {!showResults && (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {[['cost', D.red], ['income', D.green]].map(([type, c]) => (
                          <Box
                            key={type}
                            component="button"
                            onClick={() => handleItemClick(item.id, type)}
                            sx={{
                              flex: 1,
                              bgcolor: userSelection === type ? c.bg : D.cardBg,
                              color: c.border,
                              border: `2px solid ${c.border}`,
                              borderRadius: '10px',
                              boxShadow: userSelection === type ? `3px 3px 0 ${c.shadow}` : 'none',
                              fontWeight: 800, fontSize: '0.78rem',
                              py: 0.75, cursor: 'pointer',
                              transition: 'all 0.15s',
                              '&:hover': { transform: 'translate(-1px,-1px)', boxShadow: `4px 4px 0 ${c.shadow}` },
                            }}
                          >
                            {type.toUpperCase()}
                          </Box>
                        ))}
                      </Box>
                    )}

                    {showResults && userSelection !== item.type && (
                      <Box sx={{ mt: 1, p: 1, bgcolor: D.blue.bg, borderRadius: '10px', border: `1px solid ${D.blue.border}` }}>
                        <Typography variant="caption" sx={{ color: D.body }}>
                          <strong>Correct:</strong> {item.type === 'cost' ? 'COST' : 'INCOME'}
                        </Typography>
                      </Box>
                    )}

                    {showResults && userSelection && (
                      <Box sx={{ mt: 1 }}>
                        <Box component="span" sx={{
                          px: 1.25, py: 0.3, borderRadius: '50px', fontSize: '0.75rem', fontWeight: 800,
                          bgcolor: isCorrect ? D.green.bg : D.red.bg,
                          color: isCorrect ? D.green.border : D.red.border,
                          border: `2px solid ${isCorrect ? D.green.border : D.red.border}`,
                        }}>
                          You selected: {userSelection === 'cost' ? 'COST' : 'INCOME'}
                        </Box>
                      </Box>
                    )}
                  </Box>
                </motion.div>
              </Grid>
            )
          })}
        </Grid>

        {/* Results summary */}
        {showResults && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <Box sx={{ ...clay(score === BUDGET_ITEMS.length ? D.green : score >= 8 ? D.blue : D.orange), p: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight={800} sx={{ color: D.heading, mb: 1 }}>
                Results
              </Typography>
              <Typography variant="body1" sx={{ color: D.body, mb: 0.5 }}>
                <strong>Score:</strong> {score}/{BUDGET_ITEMS.length} correct
              </Typography>
              <Typography variant="body2" sx={{ color: D.body }}>
                {score === BUDGET_ITEMS.length
                  ? 'Perfect! You correctly identified all budget items!'
                  : score >= 8
                    ? 'Great job! You understand the difference between costs and income.'
                    : 'Good try! Remember: costs are money spent, income is money received.'}
              </Typography>
            </Box>
          </motion.div>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          {!showResults && (
            <Box
              component="button"
              onClick={handleSubmit}
              disabled={!allItemsLabeled}
              sx={{
                bgcolor: allItemsLabeled ? D.blue.bg : D.divider,
                color: allItemsLabeled ? D.blue.border : D.muted,
                border: `2px solid ${allItemsLabeled ? D.blue.border : D.divider}`,
                borderRadius: '14px',
                boxShadow: allItemsLabeled ? `4px 4px 0 ${D.blue.shadow}` : 'none',
                fontWeight: 800, fontSize: '1rem',
                px: 4, py: 1.5, cursor: allItemsLabeled ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s',
                '&:hover': allItemsLabeled ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.blue.shadow}` } : {},
              }}
            >
              Submit Answers
            </Box>
          )}
          {showResults && (
            <Box
              component="button"
              onClick={handleContinue}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1,
                bgcolor: D.green.bg, color: D.green.border,
                border: `2px solid ${D.green.border}`,
                borderRadius: '14px',
                boxShadow: `4px 4px 0 ${D.green.shadow}`,
                fontWeight: 800, fontSize: '1rem',
                px: 4, py: 1.5, cursor: 'pointer',
                transition: 'all 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.green.shadow}` },
              }}
            >
              Continue to Next Activity
              <ArrowForwardIcon />
            </Box>
          )}
        </Box>

      </Container>
    </Box>
  )
}
